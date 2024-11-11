import { NextResponse } from 'next/server';
import { query } from '../../../lib/db'; // Adjust the path as needed

export async function POST(request: Request) {
    try {
        const { inputBaza, inputKod, inputPeriod, inputPeriodRp, inputAge } = await request.json();

        let queryString = 'SELECT * FROM "Sheet1__"';
        const conditions: string[] = [];
        const queryParams: (string | number)[] = [];

        const inputs = [
            { values: inputBaza, column: 'baza' },
            { values: inputKod, column: 'kod' },
            { values: inputPeriod, column: 'period' },
            { values: inputPeriodRp, column: 'period_rp' },
            { values: inputAge, column: 'age' },
        ];

        inputs.forEach((input) => {
            if (input.values.length > 0) {
                const placeholders = input.values.map((_, i) => `$${queryParams.length + i + 1}`).join(' OR ');
                conditions.push(`(${input.column} = ${placeholders.split(' OR ').join(` OR ${input.column} = `)})`);
                queryParams.push(...input.values);
            }
        });

        if (conditions.length > 0) {
            queryString += ` WHERE ${conditions.join(' AND ')}`;
        }

        const result = await query(queryString, queryParams);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
