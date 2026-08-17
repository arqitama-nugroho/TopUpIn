#!/bin/sh
# Menyuntikkan nilai flag ASLI dari environment (file .env, tidak di-commit)
# ke database saat pertama kali inisialisasi. dijalankan setelah init.sql
# (nama file di-prefix z- agar urut setelahnya).
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<SQL
UPDATE users SET password_hash = '$ADMIN_PASSWORD' WHERE username = 'admin';
INSERT INTO ctf_secret (flag) VALUES ('$CTF_FLAG') ON CONFLICT DO NOTHING;
SQL
