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
    price_at_purchase NUMERIC(12,2) NOT NULL
);

-- 6. TABEL PAYMENT_METHODS
CREATE TABLE payment_methods (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    method_type VARCHAR(30) NOT NULL,
    account_info VARCHAR(100),
    is_default BOOLEAN DEFAULT false
);

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
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('user_test', 'user@example.com', '$2b$10$examplehashplaceholder', 'Test User', 'user');

-- Admin: kredensial default hardcoded (SENGAJA DITANAM sebagai
-- vulnerability sesuai Worksheet Assessment 1 - Blue Team.
-- JANGAN dipakai di environment produksi/non-assessment)
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@topupgame.local', 'ADMIN_PASSWORD_PLACEHOLDER', 'Administrator', 'admin');
