import React from 'react';
import { query } from '../lib/db'; // Adjust path as necessary

export default async function HomePage() {
    const result = await query('SELECT * FROM "Sheet1__"');
    const data = result.rows;

    return (
        <div>
            <h1>Data from PostgreSQL</h1>
            <ul>
                {data.map((item: any, index: number) => (
                    <li key={index}>{JSON.stringify(item)}</li>
                ))}
            </ul>
        </div>
    );
}
