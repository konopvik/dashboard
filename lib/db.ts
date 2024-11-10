import { Pool, QueryResult, QueryResultRow } from 'pg';

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.POSTGRES_PORT),
    ssl: {
        rejectUnauthorized: false,
    },
});

export const query = <T extends QueryResultRow>(text: string, params?: unknown[]): Promise<QueryResult<T>> => {
    return pool.query<T>(text, params);
};
