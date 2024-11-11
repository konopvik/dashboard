import { NextResponse } from 'next/server';
import { query } from '../../../lib/db'; // Adjust the path as needed

export async function POST(request: Request) {
    try {
        const { inputBaza, inputKod, inputPeriod, inputPeriodRp, inputAge } = await request.json();

        let queryString = 'SELECT ';
        const groupByFields: string[] = [];
        const conditions: string[] = [];
        const queryParams: (string | number)[] = [];

        // Define the fields for grouping and add them only if they are selected
        const fields = [
            { values: inputBaza, column: 'baza' },
            { values: inputKod, column: 'kod' },
            { values: inputPeriod, column: 'period' },
            { values: inputPeriodRp, column: 'period_rp' },
            { values: inputAge, column: 'age' },
        ];

        // Dynamically add fields to SELECT and GROUP BY based on the selected options
        fields.forEach((field) => {
            if (field.values.length > 0) {
                groupByFields.push(field.column);
                const placeholders = field.values.map((_: number | string, i: number) => `$${queryParams.length + i + 1}`).join(' OR ');
                conditions.push(`(${placeholders})`.replace(/\$\d+/g, match => `${field.column} = ${match}`));
                queryParams.push(...field.values);
            }
        });

        // Build the SELECT clause with REPLACE to convert comma to dot and remove spaces
        queryString += groupByFields.join(', ') + ', SUM(CAST(REPLACE(REPLACE(sum, \',\', \'.\'), \' \', \'\') AS DECIMAL)) AS total_sum, COUNT(kolvo) AS total_count';

        // Build the FROM and WHERE clause
        queryString += ' FROM "Sheet1__"';
        if (conditions.length > 0) {
            queryString += ` WHERE ${conditions.join(' AND ')}`;
        }

        // Add the GROUP BY clause if there are grouping fields
        if (groupByFields.length > 0) {
            queryString += ` GROUP BY ${groupByFields.join(', ')}`;
        }

        console.log('Executing query:', queryString, 'with parameters:', queryParams); // Log query for debugging

        const result = await query(queryString, queryParams);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching data:', error); // Log full error for troubleshooting
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
