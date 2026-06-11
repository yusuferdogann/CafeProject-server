# VDS Kurulum — CafeProject Backend (PostgreSQL)

Repo: https://github.com/yusuferdogann/CafeProject-server

## 1. Kodu cek

```bash
cd /var/www
git clone https://github.com/yusuferdogann/CafeProject-server.git cafeproject-api
cd cafeproject-api
npm install --omit=dev
```

## 2. PostgreSQL (ilk kez)

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE "CafeProject";
CREATE USER "CafeProject" WITH PASSWORD 'SIFRENIZ';
GRANT ALL PRIVILEGES ON DATABASE "CafeProject" TO "CafeProject";
\q
```

Schema izinleri (PostgreSQL 15+ zorunlu):

```bash
sudo -u postgres psql -d CafeProject -f db/grants.sql
```

## 3. Ortam dosyasi

```bash
npm run setup:env
nano .env
```

Kontrol listesi:

| Degisken | Deger |
|----------|-------|
| `DB_PROVIDER` | `postgres` |
| `DATABASE_URL` | `postgresql://CafeProject:SIFRENIZ@localhost:5432/CafeProject` |
| `SKIP_DB` | `false` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | 32+ karakter |
| `CORS_ORIGIN` | `http://89.35.73.3` |

> MongoDB kullanilmiyor. `MONGODB_URI` veya `DB_PROVIDER=mongodb` **yazmayin**.

## 4. Tablolari olustur

```bash
npm run db:migrate
```

Basarili cikti: `PostgreSQL migration tamamlandi.`

## 5. Test baslat

```bash
npm start
```

Baska terminalde:

```bash
curl http://localhost:5000/api/health
```

Beklenen:

```json
{
  "status": "ok",
  "database": "postgresql",
  "dbConnected": true,
  "provider": "postgres"
}
```

Ilk baslatmada seed kullanicilar olusur: `admin@gmail.com` / `1234`

## 6. PM2 (surekli calistir)

```bash
pm2 start server.js --name cafe-api
pm2 save
pm2 startup
```

## Sorun giderme

| Hata | Cozum |
|------|-------|
| `role "CafeProject" does not exist` | psql ile user olusturun (adim 2) |
| `permission denied for schema public` | `db/grants.sql` calistirin |
| MongoDB / Atlas hatasi | `.env` icinde `DB_PROVIDER=postgres` oldugundan emin olun |
| `JWT_SECRET` hatasi | 32+ karakter secret yazin |
| `SKIP_DB=true` production hatasi | `.env` → `SKIP_DB=false` |
