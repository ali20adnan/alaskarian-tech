-- SQL script to initialize the database for Alaskarian Tech Dashboard
-- Run this in your PostgreSQL database

-- 5. Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'editor', -- admin, editor
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed with initial data
INSERT INTO admin_users (name, email, role) VALUES
('Admin User', 'admin@alaskarian.tech', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 1. Stats Table
CREATE TABLE IF NOT EXISTS admin_stats (
    id SERIAL PRIMARY KEY,
    key VARCHAR(50) UNIQUE NOT NULL,
    value VARCHAR(100) NOT NULL,
    trend VARCHAR(20),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Recent Activity Table
CREATE TABLE IF NOT EXISTS admin_activity (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    action TEXT NOT NULL,
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Support Chats Table
CREATE TABLE IF NOT EXISTS support_chats (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    last_message TEXT,
    status VARCHAR(20) DEFAULT 'online', -- online, offline
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. System Status Table
CREATE TABLE IF NOT EXISTS system_status (
    id SERIAL PRIMARY KEY,
    label VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL, -- operational, degraded, error
    icon VARCHAR(50)
);

-- Seed with real initial data (set to 0/Empty initially if preferred)
INSERT INTO admin_stats (key, value, trend) VALUES
('total_users', '0', '0%'),
('active_chats', '0', '0%'),
('system_health', '100%', 'Stable')
ON CONFLICT (key) DO NOTHING;

-- Add initial status
INSERT INTO system_status (label, status, icon) VALUES
('Auth API', 'operational', 'ShieldCheck'),
('Database', 'operational', 'Database'),
('File Storage', 'operational', 'HardDrive'),
('Search Engine', 'operational', 'Search')
ON CONFLICT (label) DO NOTHING;

-- Add some initial activity
INSERT INTO admin_activity (user_name, action, location) VALUES
('System', 'Database initialized successfully', 'Server');

-- Add initial support chat placeholder
INSERT INTO support_chats (customer_name, last_message, status) VALUES
('Sample Customer', 'Welcome to Alaskarian Support', 'online');
