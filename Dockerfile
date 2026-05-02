# Apana Customer (Expo) — dev container
#
# Why Docker for an Expo app:
#   Pop!_OS Tower clones hit Node version mismatches + npm audit vulnerabilities
#   on fresh setup. Pinning Node 20 LTS + running `npm ci` inside the image
#   bakes a known-good node_modules every build.
#
# Run:
#   docker compose up customer
# Then on phone (same LAN): scan QR from container logs in Expo Go.
# Set REACT_NATIVE_PACKAGER_HOSTNAME=<host LAN IP> in .env so Metro tells
# Expo Go where to fetch the bundle from.

FROM node:20-bookworm-slim

# git + build-essential needed by some Expo native deps (e.g. expo-camera ffi)
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
        git python3 make g++ ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Layer-cache deps separately so source edits don't trigger reinstall
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund --loglevel=warn

# Source comes in via bind-mount in docker-compose.yml (hot reload).
# Copy here so standalone `docker run` still works.
COPY . .

# Metro bundler + Expo dev tools ports
EXPOSE 8081 19000 19001 19002

# --host lan = bind to LAN interface so Expo Go on phone can reach Metro
# --port 8081 = explicit port pin
CMD ["npx", "expo", "start", "--host", "lan", "--port", "8081"]
