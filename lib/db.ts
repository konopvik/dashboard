import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.POSTGRES_PORT),
    ssl: {
        rejectUnauthorized: false, // This allows self-signed certificates. For production, configure this more securely.
    },
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
