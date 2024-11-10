import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export async function GET() {
    try {
        const result = await query('SELECT * FROM Sheet1__');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
