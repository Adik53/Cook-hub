import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value;
        console.log('Changing language to:', newLang); // DEBUG

        if (i18n && typeof i18n.changeLanguage === 'function') {
            i18n.changeLanguage(newLang);
        } else {
            console.error('i18n.changeLanguage is not available');
        }
    };

    return (
        <div className="relative inline-block">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 shadow-sm">
                <Globe className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                <select
                    value={i18n.language || 'en'}
                    onChange={handleChange}
                    className="bg-transparent text-gray-900 dark:text-gray-100 text-sm font-medium focus:outline-none cursor-pointer"
                >
                    <option value="en">🇬🇧 English</option>
                    <option value="ru">🇷🇺 Русский</option>
                    <option value="tr">🇹🇷 Türkçe</option>
                    <option value="kz">🇰🇿 Қазақша</option>
                </select>
            </div>
        </div>
    );
};

export default LanguageSwitcher;