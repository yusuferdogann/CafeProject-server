# CafeProject API

Express backend — **PostgreSQL** (varsayilan).

## Hizli baslangic (VDS)

Detayli adimlar: **[VDS-SETUP.md](./VDS-SETUP.md)**

```bash
npm install --omit=dev
npm run setup:env    # .env.example → .env
nano .env            # DATABASE_URL, JWT_SECRET
npm run db:migrate
npm start
```

Health: `GET /api/health`

## Scriptler

| Komut | Aciklama |
|-------|----------|
| `npm start` | API baslat |
| `npm run db:migrate` | PostgreSQL tablolari olustur |
| `npm run setup:env` | `.env` dosyasi olustur |

## Varsayilan kullanicilar (seed)

| Rol | Email | Sifre |
|-----|-------|-------|
| Admin | admin@gmail.com | 1234 |
| Garson | garson@gmail.com | 1234 |

Ops panel: `/api/monitoring` — `OPS_EMAIL` / `OPS_PASSWORD` (.env)
