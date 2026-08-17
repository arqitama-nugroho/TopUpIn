#!/bin/sh
# Menyuntikkan nilai flag ASLI ke database saat pertama kali inisialisasi.
# Flag TIDAK disimpan di .env / environment — nilai terenkode (base64)
# tertanam langsung di sini, didekode saat init. Dengan sengaja untuk
# mengarahkan pentester menemukan rahasia lewat aplikasi (SQLi / brute
# force), bukan dari file konfigurasi. Dijalankan setelah init.sql
# (nama file di-prefix z- agar urut setelahnya).
ADMIN_PASSWORD=$(printf '%s' 'Q1RGezRkbTFuX1A0c3N3MHJkX0IwYzByfQ==' | base64 -d)
CTF_FLAG=$(printf '%s' 'Q1RGe0E4YV9sdV9saWF0XzVxbF8xbmplY3R9' | base64 -d)
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<SQL
UPDATE users SET password_hash = '$ADMIN_PASSWORD' WHERE username = 'admin';
INSERT INTO ctf_secret (flag) VALUES ('$CTF_FLAG') ON CONFLICT DO NOTHING;
SQL
