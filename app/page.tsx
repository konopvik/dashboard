'use client';
import React, { useEffect, useState } from 'react';
import styles from './HomePage.module.css'; // Import the CSS module

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
};

export default function HomePage() {
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

    const handleDropdownChange = <T extends string | number>(
        setter: React.Dispatch<React.SetStateAction<T[]>>,
        selectedOptions: HTMLSelectElement,
        type: 'string' | 'number'
    ) => {
        const values = Array.from(selectedOptions.selectedOptions, (option) => {
            return type === 'number' ? (parseFloat(option.value) as T) : (option.value as T);
        });
        setter(values);
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
            console.error('Error fetching data:', error);
            setError('There was an error fetching the data. Please try again later.');
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Data from PostgreSQL</h1>
            {error && <p className={styles.error}>{error}</p>}
            <div>
                <select
                    multiple
                    className={styles.dropdown}
                    onChange={(e) => handleDropdownChange<string>(setInputBaza, e.target, 'string')}
                >
                    {dropdownOptions1.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <select
                    multiple
                    className={styles.dropdown}
                    onChange={(e) => handleDropdownChange<number>(setInputKod, e.target, 'number')}
                >
                    {dropdownOptions2.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <select
                    multiple
                    className={styles.dropdown}
                    onChange={(e) => handleDropdownChange<string>(setInputPeriod, e.target, 'string')}
                >
                    {dropdownOptions3.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <select
                    multiple
                    className={styles.dropdown}
                    onChange={(e) => handleDropdownChange<string>(setInputPeriodRp, e.target, 'string')}
                >
                    {dropdownOptions4.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <select
                    multiple
                    className={styles.dropdown}
                    onChange={(e) => handleDropdownChange<number>(setInputAge, e.target, 'number')}
                >
                    {dropdownOptions5.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>

                <button className={styles.button} onClick={handleFetchData}>Fetch Data</button>
            </div>
            <ul className={styles.dataList}>
                {data.map((item: DataType, index: number) => (
                    <li key={index} className={styles.dataListItem}>{JSON.stringify(item)}</li>
                ))}
            </ul>
        </div>
    );
}
