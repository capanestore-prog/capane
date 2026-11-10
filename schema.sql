-- =======================================================
-- CAPANE STORE — Banco de Dados Relacional (PostgreSQL / MySQL)
-- =======================================================

CREATE DATABASE capane_store;
\c capane_store;

-- Tabela de Administradores e Clientes
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50)
);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    stock BIGINT NOT NULL DEFAULT 0,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Cupons de Desconto
CREATE TABLE IF NOT EXISTS coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL,
    uses_left INT DEFAULT 100,
    expires_at TIMESTAMP
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    total_amount DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0.00,
    status VARCHAR(40) DEFAULT 'Aguardando pagamento',
    character_name VARCHAR(100) NOT NULL,
    server_name VARCHAR(100) NOT NULL,
    pix_qr_code TEXT,
    pix_copy_paste TEXT,
    external_payment_id VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Itens do Pedido
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    quantity BIGINT NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL
);

-- Inserção de Categorias Padrão
INSERT INTO categories (name, slug, icon) VALUES 
('Gold Coin', 'gold-coin', 'fa-coins'),
('Tibia Coin', 'tibia-coin', 'fa-gem'),
('Sets', 'sets', 'fa-shield-alt'),
('Relikias', 'relikias', 'fa-crown'),
('Gemas', 'gemas', 'fa-ring'),
('Badges de Skills', 'badges-de-skills', 'fa-medal'),
('Upgrade Tier', 'upgrade-tier', 'fa-arrow-up'),
('Minerais', 'minerais', 'fa-cube')
ON CONFLICT (slug) DO NOTHING;

-- Inserção de Cupons Padrão
INSERT INTO coupons (code, discount_type, discount_value, uses_left) VALUES
('CAPANE10', 'percentage', 10.00, 100),
('KOLISEU15', 'fixed', 15.00, 50),
('DRAGON5', 'percentage', 5.00, 200)
ON CONFLICT (code) DO NOTHING;
