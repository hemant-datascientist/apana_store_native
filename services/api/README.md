# services/api/

Typed HTTP client for the Apana customer backend.

## Files

| File | Purpose |
|---|---|
| `client.ts` | Single openapi-fetch instance + JWT auth middleware + token storage helpers |
| `customer.ts` | Thin typed wrappers: `getCart()`, `getAddresses()`, `login()`, etc. |

## Where types come from

`../../types/api.ts` is **auto-generated** from `apana-contracts/openapi/customer.yaml`.

Regenerate after every contract change:

```bash
cd ../../apana-contracts
npm run gen:ts:customer
```

Don't edit `types/api.ts` by hand — it gets overwritten.

## Switching backends

`client.ts` reads `EXPO_PUBLIC_API_MODE` at build time:

| Mode | URL | When to use |
|---|---|---|
| `mock` (default) | `http://localhost:4010` | Prism mock server (no backend needed) — `cd apana-contracts && npm run mock:customer` |
| `local` | `http://${EXPO_PUBLIC_TOWER_IP}:8000/api/customer` | Backend running on Tower or Win uvicorn |
| `prod` | `https://api.apana.in/api/customer` | Production |

Set in `.env` (Expo bakes `EXPO_PUBLIC_*` at build):

```
EXPO_PUBLIC_API_MODE=local
EXPO_PUBLIC_TOWER_IP=192.168.1.50
```

## Migrating screens from mock data

Screens currently import from `data/*.ts` (typed mocks). To swap one over:

```ts
// BEFORE
import { SAVED_ADDRESSES } from "../../data/addressData";
const [addresses, setAddresses] = useState(SAVED_ADDRESSES);

// AFTER
import { getAddresses, type AddressOut } from "../../services/api/customer";

const [addresses, setAddresses] = useState<AddressOut[]>([]);
useEffect(() => {
  getAddresses().then(({ data, error }) => {
    if (data) setAddresses(data);
  });
}, []);
```

## Why mocks aren't deleted yet

Migration is **opt-in per screen**. Mock-driven screens still work; new ones can pull real data. The `EXPO_PUBLIC_API_MODE=mock` switch lets the team demo end-to-end without booting Postgres.
