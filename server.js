require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:senha@localhost:5432/capane_store'
});

const JWT_SECRET = process.env.JWT_SECRET || 'capane_secret_jwt_key_9988';

// Middleware de autenticação
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido ou expirado.' });
        req.user = user;
        next();
    });
}

// Middleware de Admin
function requireAdmin(req, res, next) {
    if (!req.user || !req.user.is_admin) {
        return res.status(403).json({ error: 'Acesso restrito a administradores.' });
    }
    next();
}

// --- ROTAS DE AUTENTICAÇÃO ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, is_admin',
            [name, email, hashedPassword]
        );
        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, email: user.email, is_admin: user.is_admin }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user });
    } catch (err) {
        res.status(400).json({ error: 'E-mail já cadastrado ou dados inválidos.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(400).json({ error: 'Credenciais inválidas.' });

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(400).json({ error: 'Credenciais inválidas.' });

        const token = jwt.sign({ id: user.id, email: user.email, is_admin: user.is_admin }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, is_admin: user.is_admin } });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});

// --- ROTAS DE PRODUTOS E CATEGORIAS ---
app.get('/api/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar categorias.' });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const { category } = req.query;
        let query = 'SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id';
        let params = [];
        if (category) {
            query += ' WHERE c.slug = $1';
            params.push(category);
        }
        query += ' ORDER BY p.id DESC';
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar produtos.' });
    }
});

// --- ROTA DE PAGAMENTO E PEDIDOS (PIX REAL) ---
// Confirma a transação no banco
await client.query('COMMIT');

// Monta a mensagem do WhatsApp
const mensagem = `
Olá! Acabei de realizar uma compra na CAPANE STORE!

*MEU PEDIDO*

${processedItems.map(item =>
    `Produto ID: ${item.product_id}
Quantidade: ${item.quantity}
Valor unitário: R$ ${item.unit_price.toFixed(2)}`
).join('\n\n')}

*TOTAL: R$ ${totalAmount.toFixed(2)}*

Personagem: ${character_name}
Servidor: ${server_name}

Gostaria de confirmar meu pedido!
`;

// Gera o link do WhatsApp
const whatsappUrl = `https://api.whatsapp.com/send/?phone=5561999287524&text&type=phone_number&app_absent=0`;

// Retorna o link para o site
res.json({
    success: true,
    whatsapp_url: 'https://api.whatsapp.com/send/?phone=5561999287524&text&type=phone_number&app_absent=0'
});

            // Abate do estoque atômico
            await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, product.id]);
        }

        let discountAmount = 0;
        if (coupon_code) {
            const couponRes = await client.query('SELECT * FROM coupons WHERE code = $1 AND uses_left > 0', [coupon_code]);
            if (couponRes.rows.length > 0) {
                const coupon = couponRes.rows[0];
                if (coupon.discount_type === 'percentage') {
                    discountAmount = (totalAmount * coupon.discount_value) / 100;
                } else {
                    discountAmount = parseFloat(coupon.discount_value);
                }
                totalAmount = Math.max(0, totalAmount - discountAmount);
                await client.query('UPDATE coupons SET uses_left = uses_left - 1 WHERE id = $1', [coupon.id]);
            }
        }

        // Integração com Gateway PIX (ex: Mercado Pago / EFI / OpenPix configurado por ENV)
        let pixData = { 
            qr_code: "Voce será redirecionado ao whatsapp pra pegar o produto", 
            copy_paste: "https://api.whatsapp.com/send/?phone=5561999287524&text&type=phone_number&app_absent=0", 
            payment_id: "pix_" + Date.now() 
        };
        
        if (process.env.PIX_API_URL && process.env.PIX_TOKEN) {
            try {
                const pixResponse = await axios.post(process.env.PIX_API_URL, {
                    transaction_amount: totalAmount,
                    description: `Capane Store - Pedido #${req.user.id}`,
                    payment_method_id: 'pix',
                    payer: { email: req.user.email }
                }, {
                    headers: { 'Authorization': `Bearer ${process.env.PIX_TOKEN}` }
                });
                pixData.qr_code = pixResponse.data.point_of_interaction.transaction_data.qr_code_base64;
                pixData.copy_paste = pixResponse.data.point_of_interaction.transaction_data.qr_code;
                pixData.payment_id = pixResponse.data.id;
            } catch (pixErr) {
                console.error("Erro na API PIX, utilizando fallback de teste:", pixErr.message);
            }
        }

        const orderRes = await client.query(
            `INSERT INTO orders (user_id, total_amount, discount_amount, status, character_name, server_name, pix_qr_code, pix_copy_paste, external_payment_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
            [req.user.id, totalAmount, discountAmount, 'Aguardando pagamento', character_name, server_name, pixData.qr_code, pixData.copy_paste, pixData.payment_id]
        );
        const orderId = orderRes.rows[0].id;

        for (let pi of processedItems) {
            await client.query(
                'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
                [orderId, pi.product_id, pi.quantity, pi.unit_price]
            );
        }

        await client.query('COMMIT');
        res.json({ success: true, order_id: orderId, total_amount: totalAmount, pix: pixData });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: err.message });
    } finally {
        client.release();
    }
});

// Webhook para confirmação automática de pagamento PIX
app.post('/api/webhook/pix', async (req, res) => {
    try {
        const notification = req.body;
        const paymentId = notification?.data?.id || notification?.id;
        const status = notification?.status || notification?.action;

        if (paymentId && (status === 'approved' || status === 'completed')) {
            await pool.query("UPDATE orders SET status = 'Pagamento aprovado' WHERE external_payment_id = $1", [String(paymentId)]);
        }
        res.status(200).json({ received: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- PAINEL ADMINISTRATIVO (ROTAS PROTEGIDAS) ---
app.get('/api/admin/dashboard', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const totalSales = await pool.query("SELECT SUM(total_amount) as total FROM orders WHERE status = 'Pagamento aprovado' OR status = 'Entregue'");
        const todaySales = await pool.query("SELECT SUM(total_amount) as total FROM orders WHERE (status = 'Pagamento aprovado' OR status = 'Entregue') AND created_at >= CURRENT_DATE");
        const pendingOrders = await pool.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Aguardando pagamento'");
        const completedOrders = await pool.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Entregue'");
        const lowStock = await pool.query("SELECT * FROM products WHERE stock < 10");

        res.json({
            faturamento_total: totalSales.rows[0]?.total || 0,
            vendas_hoje: todaySales.rows[0]?.total || 0,
            pedidos_pendentes: pendingOrders.rows[0]?.count || 0,
            pedidos_concluidos: completedOrders.rows[0]?.count || 0,
            produtos_estoque_baixo: lowStock.rows || []
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao carregar dashboard.' });
    }
});

app.post('/api/admin/products', authenticateToken, requireAdmin, async (req, res) => {
    const { category_id, name, slug, description, price, stock, image_url, is_featured } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO products (category_id, name, slug, description, price, stock, image_url, is_featured)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [category_id, name, slug, description, price, stock, image_url, is_featured || false]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: 'Erro ao cadastrar produto.' });
    }
});

app.put('/api/admin/orders/:id/status', authenticateToken, requireAdmin, async (req, res) => {
    const { status } = req.body;
    try {
        await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: 'Erro ao atualizar status do pedido.' });
    }
});

const PORT = process.env.API_PORT || 3001;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Backend Capane Store pronto na porta ${PORT}`));
}

module.exports = app;
