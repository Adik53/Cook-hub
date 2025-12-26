import React, { useState } from 'react';
import { User, LogIn, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DarkModeButton from './buttons/DarkModeButton';
import LanguageSwitcher from './buttons/LanguageSwitcher';
import { useDarkMode } from '../hooks/useDarkMode';

interface AuthViewProps {
    onSuccess: (token: string) => void;
    onNeedsVerification?: (email: string, devCode?: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess, onNeedsVerification }) => {
    const { t } = useTranslation();
    const { darkMode, toggleDarkMode } = useDarkMode();
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!formData.email || !formData.password) {
            setError(t('fillAllFields'));
            return;
        }

        if (isRegister && !formData.username) {
            setError(t('enterUsername'));
            return;
        }

        setLoading(true);
        setError('');

        try {
            const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
            const body = isRegister
                ? { username: formData.username, email: formData.email, password: formData.password }
                : { email: formData.email, password: formData.password };

            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            console.log('Response:', data);

            if (response.ok) {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify({
                        _id: data._id,
                        username: data.username,
                        email: data.email
                    }));
                    onSuccess(data.token);
                }
                else if (data.needsVerification && onNeedsVerification) {
                    onNeedsVerification(data.email || formData.email, data.devCode);
                }
                else {
                    setError('Unexpected response from server');
                }
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(t('connectionError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-purple-900 p-4">
            <div className="absolute top-4 right-4 flex gap-3">
                <LanguageSwitcher />
                <DarkModeButton darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full mb-4">
                        <User className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                        {isRegister ? t('signUp') : t('signIn')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        {isRegister ? t('createAccount') : t('welcome')}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {isRegister && (
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                {t('username')}
                            </label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                disabled={loading}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            {t('email')}
                        </label>
                        <input
                            type="email"
                            placeholder="example@mail.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            {t('password')}
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                            disabled={loading}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {isRegister ? t('signingUp') || 'Signing up...' : t('signingIn') || 'Signing in...'}
                            </>
                        ) : (
                            <>
                                <LogIn className="w-5 h-5" />
                                {isRegister ? t('signUp') : t('signIn')}
                            </>
                        )}
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setError('');
                        }}
                        disabled={loading}
                        className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium disabled:text-gray-400"
                    >
                        {isRegister ? t('alreadyHaveAccount') : t('noAccount')}
                    </button>
                </div>
            </div>
        </div>
    );
};