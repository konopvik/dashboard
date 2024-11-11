import { NextResponse } from 'next/server';
import { query } from '../../../lib/db'; // Adjust the path as needed

export async function GET() {
    try {
        // Fetch unique dropdown values for each column
        const resultBaza = await query<{ value: string }>('SELECT DISTINCT baza AS value FROM "Sheet1__"');
        const resultKod = await query<{ value: number }>('SELECT DISTINCT kod AS value FROM "Sheet1__"');
        const resultPeriod = await query<{ value: string }>('SELECT DISTINCT period AS value FROM "Sheet1__"');
        const resultPeriodRp = await query<{ value: string }>('SELECT DISTINCT period_rp AS value FROM "Sheet1__"');
        const resultAge = await query<{ value: number }>('SELECT DISTINCT age AS value FROM "Sheet1__"');

        return NextResponse.json({
            baza: resultBaza.rows.map(row => row.value),
            kod: resultKod.rows.map(row => row.value),
            period: resultPeriod.rows.map(row => row.value),
            periodRp: resultPeriodRp.rows.map(row => row.value),
            age: resultAge.rows.map(row => row.value),
        });
    } catch (error) {
        console.error('Error fetching dropdown options:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
