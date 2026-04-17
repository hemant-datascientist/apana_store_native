# Deployment & Infrastructure — Apana Platform

---

## PHASE 1: MVP (0–1000 sellers, 1–3 cities)

> Simple setup, low cost, fast to deploy. Start here.

```
┌────────────────────────────────────────────┐
│              Cloudflare CDN                 │
│    (DDoS protection + static assets)        │
└──────────────────┬─────────────────────────┘
                   │
┌──────────────────▼─────────────────────────┐
│         Single VPS or EC2 (4 vCPU, 8GB)    │
│                                             │
│  ┌─────────────┐  ┌───────────────────────┐│
│  │   Nginx     │  │  Node.js App (PM2)     ││
│  │  (reverse   │  │  All services in 1     ││
│  │   proxy)    │  │  monolith initially    ││
│  └─────────────┘  └───────────────────────┘│
│                                             │
│  ┌─────────────┐  ┌────────────┐           │
│  │ PostgreSQL  │  │   Redis    │           │
│  │  (same VPS) │  │ (same VPS) │           │
│  └─────────────┘  └────────────┘           │
└────────────────────────────────────────────┘

Estimated cost: ~₹3,000–6,000/month (AWS Lightsail or DigitalOcean)
```

---

## PHASE 2: Growth (1000–10000 sellers, 5–10 cities)

```
┌─────────────────────────────────────────────────────┐
│                   Cloudflare                         │
└──────────────────────┬──────────────────────────────┘
                       │
              ┌────────▼────────┐
              │   Load Balancer  │
              │  (AWS ALB / ELB) │
              └────────┬────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼───────┐            ┌────────▼───────┐
│  App Server 1  │            │  App Server 2   │
│  (2 vCPU 4GB) │            │  (2 vCPU 4GB)   │
│  API Services │            │  API Services   │
└───────────────┘            └────────────────┘
        │                             │
┌───────┴─────────────────────────────┘
│
┌───────▼──────────┐  ┌────────────────┐  ┌───────────────────┐
│  RDS PostgreSQL   │  │  ElastiCache   │  │  Elasticsearch    │
│  (Multi-AZ)       │  │  Redis Cluster │  │  (Search)         │
└───────────────────┘  └────────────────┘  └───────────────────┘

Estimated cost: ~₹20,000–40,000/month
```

---

## PHASE 3: Scale (10,000+ sellers, all India)

```
Full Kubernetes (k8s) on AWS EKS

Microservices:
  auth-service:         2 replicas, auto-scale to 10
  order-service:        3 replicas, auto-scale to 20
  partner-service:      3 replicas, auto-scale to 20 (WebSocket-heavy)
  catalog-service:      2 replicas, auto-scale to 10
  notification-service: 2 replicas, auto-scale to 15
  payment-service:      2 replicas (no auto-scale, stable)
  location-service:     5 replicas (high throughput, GPS pings)

Databases:
  PostgreSQL:    AWS RDS Aurora (auto-scaling, multi-AZ, read replicas per region)
  Redis:         AWS ElastiCache (cluster mode, 3 shards)
  Elasticsearch: AWS OpenSearch (3 nodes)
  TimescaleDB:   Timescale Cloud or self-managed on EC2
  S3:            AWS S3 + CloudFront CDN

Regions (expansion plan):
  ap-south-1 (Mumbai)    → Primary (all India traffic)
  ap-south-2 (Hyderabad) → Secondary/DR (disaster recovery)
  Later: ap-southeast-1 (Singapore) for international expansion

Estimated cost: ₹2,00,000–5,00,000/month at India scale
```

---

## CI/CD PIPELINE

```yaml
# .github/workflows/deploy.yml

name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
      - run: npm run lint

  build:
    needs: test
    steps:
      - name: Build Docker image
        run: docker build -t apanastore/api:${{ github.sha }} .
      - name: Push to ECR (AWS Container Registry)
        run: docker push ...

  deploy:
    needs: build
    environment: production
    steps:
      - name: Deploy to EKS
        run: kubectl set image deployment/api api=apanastore/api:${{ github.sha }}
      - name: Wait for rollout
        run: kubectl rollout status deployment/api
      - name: Run smoke tests
        run: ./scripts/smoke-test.sh
```

---

## MONITORING & ALERTING

```
Uptime monitoring:
  BetterUptime / UptimeRobot → ping all service health endpoints every 1 min
  Alert: SMS + WhatsApp to founder if any service goes down

Application monitoring:
  Sentry → error tracking, stack traces
  Datadog / Grafana + Prometheus → metrics dashboards

Key metrics to monitor:
  API response time p95 (target: <200ms)
  Order placement success rate (target: >99%)
  WebSocket connections count
  Redis memory usage
  DB query time p95
  Partner location update lag

Alerts:
  Response time > 500ms → Slack #alerts channel
  Error rate > 1% → PagerDuty → phone call to on-call engineer
  Order failure rate > 0.5% → Immediate investigation required
  DB CPU > 80% → Scale up
```

---

## ENVIRONMENT VARIABLES (per service)

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/apana_prod
DATABASE_POOL_SIZE=20

# Redis
REDIS_URL=redis://user:pass@host:6379
REDIS_CLUSTER_MODE=true

# Auth
JWT_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----...
JWT_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----...
JWT_ACCESS_EXPIRY=900        # 15 minutes in seconds
JWT_REFRESH_EXPIRY=2592000   # 30 days

# Third-party
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
MSG91_AUTH_KEY=xxx
MSG91_SENDER_ID=APANAS
FCM_SERVER_KEY=xxx
GS1_API_KEY=xxx
GOOGLE_MAPS_API_KEY=xxx

# ONDC
ONDC_SUBSCRIBER_ID=apanastore.in
ONDC_PRIVATE_KEY=xxx
ONDC_GATEWAY_URL=https://gateway.ondc.org

# Storage
AWS_S3_BUCKET=apana-store-prod
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=ap-south-1

# App
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
CORS_ORIGINS=https://apanastore.in,https://admin.apanastore.in
```

---

## BACKUP STRATEGY

```
PostgreSQL:
  Automated daily snapshot (AWS RDS)
  Point-in-time recovery enabled (up to 7 days)
  Manual snapshot before every major deployment
  Backup retention: 30 days

Redis:
  RDB snapshots every 1 hour
  AOF (Append Only File) enabled for durability
  Backup retention: 7 days

S3 (media):
  Versioning enabled
  Cross-region replication to ap-south-2 (Hyderabad)
  Lifecycle rule: move to Glacier after 1 year

Recovery Time Objective (RTO):  < 1 hour
Recovery Point Objective (RPO): < 1 hour (max data loss)
```

---

## SECURITY HARDENING

```
Network:
  All services in private subnets — no direct internet access
  API Gateway is the only public-facing component
  VPN required for DB access (no public DB endpoint)
  Security groups: minimal ports (only 80/443 public)

Application:
  Rate limiting at API Gateway level
  SQL injection: parameterized queries only (no raw SQL interpolation)
  XSS: sanitize all user inputs
  CORS: whitelist only known origins
  HTTPS only — HTTP redirect to HTTPS

Secrets management:
  AWS Secrets Manager (not env files in production)
  Rotate secrets quarterly
  Never commit secrets to git (pre-commit hooks)

Penetration testing:
  Quarterly pen test before expanding to new cities
  Bug bounty program after Series A
```
