import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Use DATABASE_URL if available (common for cloud DBs)
// Otherwise use individual connection params
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'alaskarian_tech',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export default pool;
