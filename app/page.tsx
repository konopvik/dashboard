import { query } from '../lib/db';

type DataType = {
    age: number | null;
    kod: number | null;
    sch: number | null;
    sum: number | null;
    kolvo: number | null;
    unique_rp: number | null;
    vid: string | null;
    baza: string | null;
    name: string | null;
    otdel: string | null;
    e_mail: string | null;
    period: string | null;
    lending: string | null;
    period_rp: string | null;
    data_vydachi: string | null;
    data_peredachi: string | null;
};

export default async function HomePage() {
    try {
        const result = await query<DataType>('SELECT * FROM "Sheet1__"');
        const data: DataType[] = result.rows;

        return (
            <div>
                <h1>Data from PostgreSQL</h1>
                <ul>
                    {data.map((item: DataType, index: number) => (
                        <li key={index}>{JSON.stringify(item)}</li>
                    ))}
                </ul>
            </div>
        );
    } catch (error) {
        console.error('Error fetching data:', error);
        return (
            <div>
                <h1>Error loading data</h1>
                <p>There was an error fetching the data. Please try again later.</p>
            </div>
        );
    }
}
