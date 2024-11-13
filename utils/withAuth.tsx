import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const withAuth = <P extends object>(Component: React.FC<P>) => {
    const AuthenticatedComponent: React.FC<P> = (props: P) => {
        const { isAuthenticated } = useAuth();
        const router = useRouter();
        const [isMounted, setIsMounted] = useState(false);

        useEffect(() => {
            setIsMounted(true); // Only after this point we can use client-only hooks
        }, []);

        useEffect(() => {
            if (isMounted && !isAuthenticated) {
                router.push('/login');
            }
        }, [isMounted, isAuthenticated, router]);

        // Render nothing (or a loading state) on the server and when not authenticated
        if (!isMounted || !isAuthenticated) {
            return null;
        }

        return <Component {...props} />;
    };

    return AuthenticatedComponent;
};

export default withAuth;
