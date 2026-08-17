#!/bin/sh
# Menyuntikkan nilai flag ASLI ke database saat pertama kali inisialisasi.
# Nilai dikirim terenkode (base64) dari docker-compose agar tidak terbaca
# langsung di repo — didekode di sini. Dijalankan setelah init.sql
# (nama file di-prefix z- agar urut setelahnya).
ADMIN_PASSWORD=$(printf '%s' "$ADMIN_PASSWORD" | base64 -d)
CTF_FLAG=$(printf '%s' "$CTF_FLAG" | base64 -d)
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<SQL
UPDATE users SET password_hash = '$ADMIN_PASSWORD' WHERE username = 'admin';
INSERT INTO ctf_secret (flag) VALUES ('$CTF_FLAG') ON CONFLICT DO NOTHING;
SQL