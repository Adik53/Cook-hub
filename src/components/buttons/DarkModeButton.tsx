import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface DarkModeButtonProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const DarkModeButton: React.FC<DarkModeButtonProps> = ({ darkMode, toggleDarkMode }) => {
    return (
        <button
            onClick={toggleDarkMode}
            className="relative p-3 rounded-lg bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-slate-600"
            aria-label="Toggle dark mode"
        >
            {darkMode ? (
                <Moon className="w-5 h-5 text-slate-300" />
            ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
            )}
        </button>
    );
};

export default DarkModeButton;