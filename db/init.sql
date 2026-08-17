-- =====================================================
-- DATABASE SCHEMA: Web Top Up Game
-- KSM Cyber Security - Weekly Mentoring Beginner Assessment
-- Kelompok: [isi nomor/nama kelompok]
-- =====================================================

-- 1. TABEL USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone_number VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- 2. TABEL GAMES
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    publisher VARCHAR(100),
    icon_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true
);

-- 3. TABEL PRODUCTS
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    denomination VARCHAR(50),
    price NUMERIC(12,2) NOT NULL,
    stock_status BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT now()
);

-- 4. TABEL ORDERS
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_code VARCHAR(30) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    game_user_id VARCHAR(100),
    total_amount NUMERIC(12,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- 5. TABEL ORDER_ITEMS
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_purchase NUMERIC(12,2) NOT NULL,
    description VARCHAR(200)
);

-- 6. TABEL PAYMENT_METHODS
CREATE TABLE payment_methods (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    method_type VARCHAR(30) NOT NULL,
    account_info VARCHAR(100),
    is_default BOOLEAN DEFAULT false
);

-- 7. TABEL CTF_SECRET
CREATE TABLE ctf_secret (
    id SERIAL PRIMARY KEY,
    flag VARCHAR(255) NOT NULL
);

INSERT INTO ctf_secret (flag) VALUES ('CTF{PLACEHOLDER_LIHAT_ENV}');

-- =====================================================
-- INDEXING (untuk efisiensi query)
-- =====================================================
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_products_game_id ON products(game_id);

-- =====================================================
-- SEED DATA
-- =====================================================

-- Games
INSERT INTO games (name, publisher) VALUES
('Mobile Legends', 'Moonton'),
('Free Fire', 'Garena'),
('PUBG Mobile', 'Krafton');

-- Products
INSERT INTO products (game_id, name, denomination, price) VALUES
(1, 'Diamond 86', '86 Diamond', 20000),
(1, 'Diamond 172', '172 Diamond', 39000),
(2, 'Diamond 70', '70 Diamond', 12000),
(3, 'UC 60', '60 UC', 15000);

-- Users (password_hash idealnya di-hash dengan bcrypt di aplikasi,
-- BUKAN disimpan plaintext seperti pada akun admin di bawah)
INSERT INTO users (username, email, password_hash, full_name, phone_number, role) VALUES
('user_test', 'user@example.com', '$2b$10$examplehashplaceholder', 'Test User', '0812 0000 1111', 'user');

-- Admin
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@topupgame.local', 'CTF{PLACEHOLDER_LIHAT_ENV}', 'Administrator', 'admin');

-- Orders (contoh riwayat transaksi untuk user_test, id=1)
INSERT INTO orders (id, order_code, user_id, game_user_id, total_amount, status, created_at) VALUES
(1, 'TPI-88213', 1, '1122334455', 20000, 'completed', now() - interval '3 days'),
(2, 'TPI-88190', 1, '9988776655', 39000, 'completed', now() - interval '7 days'),
(3, 'TPI-88147', 1, '4455667788', 15000, 'pending',  now() - interval '9 days'),
(4, 'TPI-87990', 1, '5566778899', 12000, 'failed',   now() - interval '19 days');

-- Order items
INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase, description) VALUES
(1, 1, 1, 20000, 'Mobile Legends — Diamond 86'),
(2, 2, 1, 39000, 'Mobile Legends — Diamond 172'),
(3, 3, 1, 15000, 'Mobile Legends — UC 60'),
(4, 4, 1, 12000, 'Mobile Legends — Diamond 70');

-- Lanjutkan sequence setelah seed memakai id eksplisit
SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders));
SELECT setval('order_items_id_seq', (SELECT MAX(id) FROM order_items));
