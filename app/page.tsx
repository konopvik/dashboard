'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import styles from './HomePage.module.css';
import withAuth from '@/utils/withAuth';

// Dynamically import react-select to avoid SSR issues
const Select = dynamic(() => import('react-select'), { ssr: false });

type DataType = {
    id: number | null;
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
    [key: string]: string | number | null;
};

function HomePage() {
    const [inputBaza, setInputBaza] = useState<string[]>([]);
    const [inputKod, setInputKod] = useState<number[]>([]);
    const [inputPeriod, setInputPeriod] = useState<string[]>([]);
    const [inputPeriodRp, setInputPeriodRp] = useState<string[]>([]);
    const [inputAge, setInputAge] = useState<number[]>([]);
    const [dropdownOptions1, setDropdownOptions1] = useState<string[]>([]);
    const [dropdownOptions2, setDropdownOptions2] = useState<number[]>([]);
    const [dropdownOptions3, setDropdownOptions3] = useState<string[]>([]);
    const [dropdownOptions4, setDropdownOptions4] = useState<string[]>([]);
    const [dropdownOptions5, setDropdownOptions5] = useState<number[]>([]);
    const [data, setData] = useState<DataType[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const fetchDropdownOptions = async () => {
            try {
                const res = await fetch('/api/fetch-dropdowns');
                if (!res.ok) {
                    throw new Error('Failed to fetch dropdown options');
                }
                const options = await res.json();
                setDropdownOptions1(options.baza);
                setDropdownOptions2(options.kod);
                setDropdownOptions3(options.period);
                setDropdownOptions4(options.periodRp);
                setDropdownOptions5(options.age);
            } catch (error) {
                console.error('Error fetching dropdown options:', error);
                setError('Failed to load dropdown options.');
            }
        };

        fetchDropdownOptions();
    }, []);

    const handleSelectChange = <T extends string | number>(
        setter: React.Dispatch<React.SetStateAction<T[]>>,
        selectedOptions: Array<{ value: T; label: string }>
    ) => {
        setter(selectedOptions.map((option) => option.value));
    };

    const handleFetchData = async () => {
        try {
            const res = await fetch('/api/fetch-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputBaza, inputKod, inputPeriod, inputPeriodRp, inputAge }),
            });

            if (!res.ok) {
                throw new Error('Failed to fetch data');
            }

            const result = await res.json();
            setData(result);
            setError(null);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error fetching data:', error.message);
            } else {
                console.error('Error fetching data:', error);
            }
            setError('There was an error fetching the data. Please try again later.');
        }
    };

    const headers = data.length > 0 ? Object.keys(data[0]) : [];

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from localStorage
        router.push('/login'); // Redirect to the login page
    };

    return (
        <div className={styles.container}>
            {/* Logout Button */}
            <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
            </button>

            <h1 className={styles.title}>Data from PostgreSQL</h1>
            {error && <p className={styles.error}>{error}</p>}
            {isClient && (
                <div>
                    <label className={styles.label}>Baza</label>
                    <Select
                        isMulti
                        options={dropdownOptions1.map((option) => ({
                            value: option,
                            label: option || '',
                        }))}
                        onChange={(selected) => handleSelectChange<string>(setInputBaza, selected as Array<{ value: string; label: string }>)}
                    />
                    <label className={styles.label}>Kod</label>
                    <Select
                        isMulti
                        options={dropdownOptions2.map((option) => ({
                            value: option,
                            label: option != null ? option.toString() : '',
                        }))}
                        onChange={(selected) => handleSelectChange<number>(setInputKod, selected as Array<{ value: number; label: string }>)}
                    />
                    <label className={styles.label}>Period</label>
                    <Select
                        isMulti
                        options={dropdownOptions3.map((option) => ({
                            value: option,
                            label: option || '',
                        }))}
                        onChange={(selected) => handleSelectChange<string>(setInputPeriod, selected as Array<{ value: string; label: string }>)}
                    />
                    <label className={styles.label}>Period Rp</label>
                    <Select
                        isMulti
                        options={dropdownOptions4.map((option) => ({
                            value: option,
                            label: option || '',
                        }))}
                        onChange={(selected) => handleSelectChange<string>(setInputPeriodRp, selected as Array<{ value: string; label: string }>)}
                    />
                    <label className={styles.label}>Age</label>
                    <Select
                        isMulti
                        options={dropdownOptions5.map((option) => ({
                            value: option,
                            label: option != null ? option.toString() : '',
                        }))}
                        onChange={(selected) => handleSelectChange<number>(setInputAge, selected as Array<{ value: number; label: string }>)}
                    />
                </div>
            )}
            <button className={styles.button} onClick={handleFetchData}>Fetch Data</button>
            {/* Dynamic table */}
            {data.length > 0 && (
                <table className={styles.table}>
                    <thead>
                    <tr>
                        {headers.map((header) => (
                            <th key={header}>{header}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            {headers.map((header) => (
                                <td key={header}>
                                    {row[header] != null ? row[header] : 'N/A'}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default withAuth(HomePage);
