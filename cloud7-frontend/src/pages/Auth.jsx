import { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

export default function Auth({ onLogin }) {
    const [mode, setMode] = useState('login'); // 'login' | 'signup'

    return mode === 'login' ? (
        <Login
            onLogin={onLogin}
            onSwitch={() => setMode('signup')}
        />
    ) : (
        <Signup
            onLogin={onLogin}
            onSwitch={() => setMode('login')}
        />
    );
}
