'use client';
import React, { useState } from 'react';
import styles from './LoginPage.module.css';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                throw new Error('Invalid credentials');
            }

            const { token } = await res.json();
            localStorage.setItem('authToken', token); // Store token in localStorage

            // Redirect to main page after successful login
            router.push('/');
        } catch (error) {
            if (error instanceof Error) {
                console.error('Login error:', error.message);
                setError(error.message);
            } else {
                console.error('Login error:', error);
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <div className={styles.loginContainer}>
            <h1 className={styles.loginTitle}>Login</h1>
            <div className={styles.loginForm}>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <input
                    type="email"
                    className={styles.inputField}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className={styles.inputField}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className={styles.loginButton} onClick={handleLogin}>
                    Login
                </button>
            </div>
        </div>
    );
}
