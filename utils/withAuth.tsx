import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const withAuth = (Component: React.FC) => {
    return (props) => {
        const { isAuthenticated } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!isAuthenticated) {
                router.push('/login');
            }
        }, [isAuthenticated, router]);

        if (!isAuthenticated) {
            return null;
        }

        return <Component {...props} />;
    };
};

export default withAuth;
