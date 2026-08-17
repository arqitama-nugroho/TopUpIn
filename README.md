# TopUpIn — Web Top Up Game

Project Assessment Weekly Mentoring Beginner — KSM Cyber Security, UPN "Veteran" Jakarta.

## Status Pengerjaan

| Bagian | Status | PIC |
|---|---|---|
| Frontend (HTML/CSS/JS) | Selesai (versi awal) | Arqitama Nugroho |
| Database (PostgreSQL) | Selesai | Zaskia Maharani |
| Backend | Belum dikerjakan | Selesai | Ahmad Billal & Haikal Ahza Anggera |
| Vulnerability Injection | Sebagian (lihat catatan di bawah) | - |
| Threat Model (OWASP Threat Dragon) | Belum dikerjakan | - |

---

## Database (PostgreSQL)

### Deskripsi Singkat
Database menyimpan seluruh data transaksional aplikasi top up game, mencakup akun pengguna, katalog game dan produk, riwayat transaksi, serta metode pembayaran.

### Teknologi yang Digunakan
- PostgreSQL 16 (image: `postgres:16-alpine`)
- Dijalankan melalui Docker Compose

### Struktur Tabel

Terdapat 6 tabel utama:

1. **`users`** — akun pengguna & admin (login, register, account management)
2. **`games`** — daftar game yang tersedia untuk top up
3. **`products`** — item/denominasi top up per game (katalog)
4. **`orders`** — transaksi top up (checkout, riwayat transaksi)
5. **`order_items`** — detail item dalam satu transaksi
6. **`payment_methods`** — metode pembayaran tersimpan milik user

Detail skema lengkap (kolom, tipe data, constraint) ada di file [`db/init.sql`](./db/init.sql).

### Cara Menjalankan

1. Pastikan Docker Desktop sudah terinstall dan berjalan.
2. Dari root folder project, jalankan:
   ```bash
   docker compose up -d db
   ```
3. Database akan otomatis ter-inisialisasi (skema tabel + seed data) dari `db/init.sql` saat container pertama kali dibuat.
4. Cek status container:
   ```bash
   docker compose ps
   ```
5. Verifikasi tabel sudah terbentuk:
   ```bash
   docker exec -it topupgame_db psql -U topup_admin -d topupgame_db -c "\dt"
   ```

### Informasi Koneksi

| Konteks | Host | Port |
|---|---|---|
| Dari service lain **di dalam** Docker network (misal backend) | `db` | `5432` |
| Dari **luar** container (misal pgAdmin, testing manual di lokal) | `localhost` | `5433` |

- Nama database: `topupgame_db`
- Username: `topup_admin`
- Password: `TopUpDb#2026` (hardcoded di `docker-compose.yml` — sengaja untuk skenario assessment "hardcoded credential")

> Catatan untuk backend: gunakan `db:5432` sebagai connection string bila backend juga didefinisikan sebagai service di `docker-compose.yml` yang sama. Port `5433` hanya berlaku untuk akses dari luar Docker.

### Seed Data / Kredensial Default (Testing Awal)

| Username | Password | Role |
|---|---|---|
| `user_test` | (hashed, placeholder) | user |
| `admin` | tidak disimpan di `.env` — di-inject ke DB saat init (`db/z-init-flags.sh`, nilai terenkode) | admin |

---

## Catatan Vulnerability yang Sudah Ditanam (Bagian Database)

Sesuai pembagian kelompok, kategori B dan C (Dependency rentan, file permission, port exposure) serta sebagian kategori A (hardcoded credential) bersinggungan dengan bagian database:

1. **Hardcoded Credential/Secret** — Password akun admin disimpan dalam bentuk **plaintext** di seed data `db/init.sql` (nilai asli di-inject saat init, lihat `db/z-init-flags.sh`), bukan di-hash. Lokasi: tabel `users`, kolom `password_hash`, baris admin.
2. **Sensitive Data Exposure (Debug Endpoint)** — `GET /api/debug/config` membocorkan konfigurasi termasuk `JWT_SECRET` (flag) tanpa autentikasi khusus (cukup API key). Lokasi: `backend/app.js`.
3. **Port Exposure** — Port PostgreSQL di-*expose* ke host (`5433:5432`) tanpa pembatasan firewall/network segmentation, sehingga database berpotensi dapat diakses langsung dari luar layer aplikasi.

Detail teknis dan dampak masing-masing vulnerability didokumentasikan lebih lanjut di **Worksheet Assessment 1 (Blue Team)** — belum di-upload ke repo ini, mohon dilengkapi sebelum deadline pengumpulan.

⚠️ **Vulnerability kategori SQL Injection, Dependency rentan (versi package), dan File permission** belum diimplementasikan — ini menjadi tanggung jawab bagian backend saat coding berlangsung, karena butuh logic aplikasi (query, dependency management, filesystem).

---

## Struktur Folder

```
TopUpIn/
├── account.html          # Frontend
├── index.html
├── login.html
├── register.html
├── script.js
├── style.css
├── db/
│   └── init.sql          # Skema database + seed data
├── docker-compose.yml    # Konfigurasi service PostgreSQL
└── README.md
```

## To-Do Selanjutnya

- [ ] Backend: setup service (bahasa/framework menyusul kesepakatan tim)
- [ ] Backend: implementasi SQL Injection (sengaja, sesuai tugas kelompok)
- [ ] Backend/DevOps: tanam vulnerability dependency rentan & file permission
- [ ] Isi Worksheet Assessment 1 (Blue Team)
- [ ] Buat Threat Model (DFD + STRIDE) via OWASP Threat Dragon
