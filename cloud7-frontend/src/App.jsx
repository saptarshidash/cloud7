import { useEffect, useState } from 'react';
import { decodeJwt } from './utils/jwt';
import Drive from './pages/Drive';
import Trash from './pages/Trash';
import Login from './pages/Login';
import Signup from './pages/Signup';


export default function App() {
    const [user, setUser] = useState(null);
    const [page, setPage] = useState('drive');
    const [authMode, setAuthMode] = useState('login');

    useEffect(() => {
        function handleNav(e) {
            setPage(e.detail);
        }
        window.addEventListener('navigate', handleNav);
        return () => window.removeEventListener('navigate', handleNav);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const payload = decodeJwt(token);

            setUser({
                userId: payload.userId,
                firstName: payload.firstName,
                lastName: payload.lastName
            });
        } catch (e) {
            console.error('Invalid token, clearing');
            localStorage.removeItem('token');
        }
    }, []);

    if (!user) {
        return authMode === 'login' ? (
            <Login onLogin={setUser} onSwitch={() => setAuthMode('signup')} />
        ) : (
            <Signup onLogin={setUser} onSwitch={() => setAuthMode('login')} />
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-gray-900">
            <div className="flex gap-6 p-4 border-b border-gray-200 bg-white">
                <button
                    onClick={() => setPage('drive')}
                    className={
                        page === 'drive'
                            ? 'font-medium text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }
                >
                    Cloud7 Drive
                </button>
            </div>

            {page === 'drive' && <Drive user={user} />}
            {page === 'trash' && <Trash user={user} />}
        </div>
    );
}
