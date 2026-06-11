-- PostgreSQL 15+ icin schema izinleri
-- Calistirma: sudo -u postgres psql -d CafeProject -f db/grants.sql

GRANT ALL ON SCHEMA public TO "CafeProject";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "CafeProject";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "CafeProject";
