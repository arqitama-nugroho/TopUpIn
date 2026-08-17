const express = require('express');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET_PLACEHOLDER";

const API_KEY = process.env.API_KEY || "API_KEY_PLACEHOLDER";

app.use('/api', (req, res, next) => {
    if (req.method === 'OPTIONS' || req.path === '/key') return next();
    if (req.headers['x-api-key'] === API_KEY) return next();
    return res.status(401).json({ status: "failed", message: "API key tidak valid" });
});

// ==========================================
// KONFIGURASI DATABASE POSTGRESQL
// ==========================================
const dbClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'topupgame_db',
    user: process.env.DB_USER || 'topup_admin',
    password: process.env.DB_PASSWORD || 'DB_PASSWORD_PLACEHOLDER'
});

dbClient.connect()
    .then(() => console.log('Terhubung ke PostgreSQL'))
    .catch(err => console.error('Koneksi DB Gagal:', err));


// ==========================================
// 0. LEAK API KEY (dikirim ke client saat runtime)
// ==========================================
app.get('/api/key', (req, res) => {
    res.json({ status: "success", key: API_KEY });
});


// ==========================================
// 1. LOGIN
// ==========================================
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    const query = `
        SELECT id, username, role
        FROM users
        WHERE email = '${email}'
        AND password_hash = '${password}'
    `;

    try {
        const result = await dbClient.query(query);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            const logPath = path.join(__dirname, 'login_activity.log');
            const logMessage =
                `User ${email} berhasil login pada ${new Date().toISOString()}\n`;

            fs.appendFileSync(logPath, logMessage);
            fs.chmodSync(logPath, 0o777);

            res.json({
                status: "success",
                message: "Login berhasil",
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });
        } else {
            res.status(401).json({
                status: "failed",
                message: "Email atau password salah"
            });
        }
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
});


// ==========================================
// 2. REGISTER
// ==========================================
app.post('/api/register', async (req, res) => {
    const { name, email, phone, password } = req.body;
    const username = email.split('@')[0];

    const query = `
        INSERT INTO users
        (full_name, email, phone_number, password_hash, username, role)
        VALUES
        ('${name}', '${email}', '${phone}', '${password}', '${username}', 'user')
        RETURNING id, username, role
    `;

    try {
        const result = await dbClient.query(query);
        const newUser = result.rows[0];

        res.json({
            status: "success",
            message: "Akun berhasil dibuat",
            user: {
                id: newUser.id,
                username: newUser.username,
                role: newUser.role
            }
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
});


// ==========================================
// 3. CEK ID KARAKTER
// ==========================================
app.post('/api/check-id', async (req, res) => {
    const { character_id } = req.body;

    // 1) Cek ID akun pengguna
    const userQuery = `
        SELECT id, username AS account_name
        FROM users
        WHERE id::text = '${character_id}'
    `;

    // 2) Fallback: cek ID karakter game (dari riwayat pesanan)
    const gameQuery = `
        SELECT DISTINCT u.id, u.username AS account_name
        FROM users u
        JOIN orders o ON o.user_id = u.id
        WHERE o.game_user_id = '${character_id}'
    `;

    try {
        let result = await dbClient.query(userQuery);
        if (result.rows.length === 0) {
            result = await dbClient.query(gameQuery);
        }

        if (result.rows.length > 0) {
            res.json({
                status: "success",
                data: result.rows
            });
        } else {
            res.json({
                status: "failed",
                message: "ID Karakter tidak ditemukan"
            });
        }
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
});


// ==========================================
// 4. GET SEMUA PRODUK
// ==========================================
app.get('/api/products', async (req, res) => {
    try {
        const query = `
            SELECT
                p.id,
                p.name AS product_name,
                p.denomination,
                p.price,
                p.stock_status,
                p.game_id,
                g.name AS game_name,
                g.publisher AS game_publisher
            FROM products p
            JOIN games g ON p.game_id = g.id
            WHERE g.is_active = TRUE
            ORDER BY p.id DESC
        `;

        const result = await dbClient.query(query);

        res.json({
            status: "success",
            data: result.rows
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
});


// ==========================================
// 5. GET DETAIL PRODUK
// ==========================================
app.get('/api/products/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const query = `
            SELECT
                p.id,
                p.name AS product_name,
                p.denomination,
                p.price,
                p.stock_status,
                p.game_id,
                g.name AS game_name,
                g.publisher AS game_publisher
            FROM products p
            JOIN games g ON p.game_id = g.id
            WHERE p.id = $1
            AND g.is_active = TRUE
        `;

        const result = await dbClient.query(query, [productId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "failed",
                message: "Produk tidak ditemukan"
            });
        }

        res.json({
            status: "success",
            data: result.rows[0]
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
});


// ==========================================
// 6. TAMBAH PRODUK
// ==========================================
app.post('/api/products', async (req, res) => {
    const {
        game_id,
        name,
        denomination,
        price
    } = req.body;

    const query = `
        INSERT INTO products
        (game_id, name, denomination, price)
        VALUES
        (${game_id}, '${name}', '${denomination}', ${price})
        RETURNING id
    `;

    try {
        const result = await dbClient.query(query);

        res.json({
            status: "success",
            message: "Produk berhasil ditambahkan",
            id: result.rows[0].id
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
});


// ==========================================
// 7. UPDATE PRODUK
// ==========================================
app.put('/api/products/:id', async (req, res) => {
    const productId = req.params.id;

    const {
        name,
        denomination,
        price,
        game_id
    } = req.body;

    const query = `
        UPDATE products
        SET
            name = '${name}',
            denomination = '${denomination}',
            price = ${price},
            game_id = ${game_id}
        WHERE id = ${productId}
    `;

    try {
        await dbClient.query(query);

        res.json({
            status: "success",
            message: "Produk berhasil diperbarui"
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
});


// ==========================================
// 8. HAPUS PRODUK
// ==========================================
app.delete('/api/products/:id', async (req, res) => {
    const productId = req.params.id;

    const query = `
        DELETE FROM products
        WHERE id = ${productId}
    `;

    try {
        await dbClient.query(query);

        res.json({
            status: "success",
            message: "Produk berhasil dihapus"
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
});


// ==========================================
// 9. GET SEMUA GAME UNTUK KATALOG
// ==========================================
app.get('/api/games', async (req, res) => {
    try {
        const query = `
            SELECT
                id,
                name,
                publisher,
                is_active
            FROM games
            WHERE is_active = TRUE
            ORDER BY id ASC
        `;

        const result = await dbClient.query(query);

        res.json({
            status: "success",
            data: result.rows
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
});


// ==========================================
// 10. TAMBAH GAME
// ==========================================
app.post('/api/games', async (req, res) => {
    const { name, publisher } = req.body;

    const query = `
        INSERT INTO games
        (name, publisher)
        VALUES
        ('${name}', '${publisher}')
        RETURNING id
    `;

    try {
        const result = await dbClient.query(query);

        res.json({
            status: "success",
            message: "Game berhasil ditambahkan",
            id: result.rows[0].id
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
});


// ==========================================
// 11. UPDATE GAME
// ==========================================
app.put('/api/games/:id', async (req, res) => {
    const gameId = req.params.id;

    const {
        name,
        publisher
    } = req.body;

    const query = `
        UPDATE games
        SET
            name = '${name}',
            publisher = '${publisher}'
        WHERE id = ${gameId}
    `;

    try {
        await dbClient.query(query);

        res.json({
            status: "success",
            message: "Game berhasil diperbarui"
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
});


// ==========================================
// 12. DELETE GAME
// ==========================================
app.delete('/api/games/:id', async (req, res) => {
    const gameId = req.params.id;

    const query = `
        DELETE FROM games
        WHERE id = ${gameId}
    `;

    try {
        await dbClient.query(query);

        res.json({
            status: "success",
            message: "Game berhasil dihapus"
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
});


// ==========================================
// 13. DATA USERS UNTUK ADMIN
// ==========================================
app.get('/api/users', async (req, res) => {
    try {
        const query = `
            SELECT
                id,
                full_name,
                username,
                email,
                role,
                created_at
            FROM users
            ORDER BY id DESC
        `;

        const result = await dbClient.query(query);

        res.json({
            status: "success",
            data: result.rows
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
});


// ==========================================
// 13b. DETAIL PROFIL USER (sesuai username)
// ==========================================
app.get('/api/users/:username', async (req, res) => {
    const username = req.params.username;

    const query = `
        SELECT id, full_name, username, email, phone_number, role, created_at
        FROM users
        WHERE username = '${username}'
    `;

    try {
        const result = await dbClient.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "failed",
                message: "User tidak ditemukan"
            });
        }

        res.json({
            status: "success",
            data: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
});


// ==========================================
// 13c. UPDATE PROFIL USER
// ==========================================
app.put('/api/users/:id/profile', async (req, res) => {
    const userId = req.params.id;
    const { full_name, email, phone_number } = req.body;

    const query = `
        UPDATE users
        SET full_name = '${full_name}',
            email = '${email}',
            phone_number = '${phone_number}'
        WHERE id = ${userId}
        RETURNING id, full_name, username, email, phone_number
    `;

    try {
        const result = await dbClient.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "failed",
                message: "User tidak ditemukan"
            });
        }

        res.json({
            status: "success",
            message: "Profil berhasil diperbarui",
            data: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
});


// ==========================================
// 14. DATA ORDERS UNTUK ADMIN
// ==========================================
app.get('/api/orders', async (req, res) => {
    try {
        const query = `
            SELECT
                o.id,
                o.order_code,
                o.user_id,
                o.game_user_id,
                o.total_amount,
                o.status,
                o.created_at,
                oi.quantity,
                COALESCE(oi.description, p.name, 'Top Up Lainnya') AS product_name
            FROM orders o
            JOIN order_items oi
                ON o.id = oi.order_id
            LEFT JOIN products p
                ON oi.product_id = p.id
            ORDER BY o.id DESC
        `;

        const result = await dbClient.query(query);

        res.json({
            status: "success",
            data: result.rows
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
});


// ==========================================
// 14b. BUAT ORDER BARU (pembelian dari checkout)
// ==========================================
app.post('/api/orders', async (req, res) => {
    const { user_id, game_user_id, description, quantity, total_amount } = req.body;

    const orderCode = 'TPI-' + Math.floor(10000 + Math.random() * 89999);

    try {
        const orderResult = await dbClient.query(`
            INSERT INTO orders (order_code, user_id, game_user_id, total_amount, status)
            VALUES ('${orderCode}', ${user_id || 'NULL'}, '${game_user_id}', ${total_amount}, 'pending')
            RETURNING id, order_code, created_at
        `);
        const order = orderResult.rows[0];

        let productId = null;
        try {
            const match = await dbClient.query(`
                SELECT id FROM products
                WHERE denomination ILIKE '%' || '${description}' || '%'
                   OR '${description}' ILIKE '%' || denomination || '%'
                LIMIT 1
            `);
            if (match.rows.length > 0) productId = match.rows[0].id;
        } catch (e) {
            /* abaikan kegagalan pencocokan produk */
        }

        await dbClient.query(`
            INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase, description)
            VALUES (${order.id}, ${productId}, ${quantity}, ${total_amount}, '${description}')
        `);

        res.json({
            status: "success",
            message: "Pesanan berhasil dibuat",
            data: {
                id: order.id,
                order_code: order.order_code,
                created_at: order.created_at
            }
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
});


// ==========================================
// SERVER
// ==========================================
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Backend API berjalan di port ${PORT}`);
});