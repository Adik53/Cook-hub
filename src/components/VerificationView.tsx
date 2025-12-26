import React, { useState } from 'react';
import { Mail, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VerificationViewProps {
    email: string;
    onVerified: () => void;
    onSkip?: () => void;
}

export const VerificationView: React.FC<VerificationViewProps> = ({
                                                                      email,
                                                                      onVerified,
                                                                      onSkip
                                                                  }) => {
    const { t } = useTranslation();

    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const handleVerify = async () => {
        if (code.length !== 6) {
            setError(t('verificationInvalidCode'));
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                onVerified();
            } else {
                setError(data.message || t('verificationInvalidCode'));
            }
        } catch {
            setError(t('connectionError'));
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/resend-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                alert(t('verificationCodeSent'));
            } else {
                setError(data.message || t('commonError'));
            }
        } catch {
            setError(t('connectionError'));
        } finally {
            setResending(false);
        }
    };

    return (
        <div className=" min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md transition-colors">
                <div className="text-center mb-8">
                    <div className=" inline-flex items-center justify-center w-20 h-20 bg-orange-100 dark:bg-gray-700 rounded-full mb-4 ">
                        <Mail className="w-10 h-10 text-orange-600" />
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                        {t('verificationTitle')}
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300">
                        {t('verificationSubtitle')}<br />
                        <strong className="dark:text-white">{email}</strong>
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <label className="block text-sm font-medium dark:text-gray-300 mb-2">
                        {t('verificationEnterCode')}
                    </label>

                    <input
                        type="text"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                        onKeyPress={(e) => e.key === 'Enter' && code.length === 6 && handleVerify()}
                        placeholder="123456"
                        className=" w-full px-4 py-3 text-center text-2xl font-bold tracking-widest border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white
                        "
                        autoFocus
                    />

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        {t('enterCode')}
                    </p>
                </div>

                <button
                    onClick={handleVerify}
                    disabled={loading || code.length !== 6}
                    className="
                        w-full py-3 bg-orange-600 text-white rounded-lg font-medium
                        hover:bg-orange-700 transition-colors
                        disabled:bg-gray-300 disabled:cursor-not-allowed
                    "
                >
                    {loading ? t('verifying') : t('verificationConfirm')}
                </button>

                <button
                    onClick={handleResend}
                    disabled={resending}
                    className="
                        w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white
                        rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600
                        transition-colors flex items-center justify-center gap-2 mt-3
                    "
                >
                    <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                    {resending ? t('sending') : t('verificationResend')}
                </button>

                {onSkip && process.env.NODE_ENV === 'development' && (
                    <button
                        onClick={onSkip}
                        className="w-full py-2 mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline"
                    >
                        Skip verification (Dev mode)
                    </button>
                )}

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                    {t('noEmail')}
                </p>
            </div>
        </div>
    );
};
