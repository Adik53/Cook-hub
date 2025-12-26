import React from 'react';
import { ChefHat, Search, Plus, LogOut, User, Users } from 'lucide-react';
import { View } from '../../types';
import DarkModeButton from '../buttons/DarkModeButton';
import LanguageSwitcher from '../buttons/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

interface NavbarProps {
    currentView: View;
    onViewChange: (view: View) => void;
    username?: string;
    onLogout?: () => void;
    onClearData?: () => void;
    showFollowingFeed?: boolean;
    onToggleFeed?: () => void;
    onProfileClick?: () => void;

    darkMode: boolean;
    toggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
                                                  currentView,
                                                  onViewChange,
                                                  username,
                                                  onLogout,
                                                  onClearData,
                                                  showFollowingFeed,
                                                  onToggleFeed,
                                                  onProfileClick,
                                                  darkMode,
                                                  toggleDarkMode
                                              }) => {
    const { t } = useTranslation();

    return (
        <nav className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">

                    <div
                        className="flex items-center gap-2 text-2xl font-bold text-orange-600 cursor-pointer"
                        onClick={() => onViewChange('feed')}
                    >
                        <ChefHat className="w-8 h-8" />
                        <span>Cookbook</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {currentView === 'feed' && onToggleFeed && (
                            <button
                                onClick={onToggleFeed}
                                className="px-4 py-2 bg-blue-100 dark:bg-blue-900 dark:text-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex items-center gap-2"
                            >
                                <Users className="w-4 h-4" />
                                {showFollowingFeed ? t("allRecipes") : t("followingFeed")}
                            </button>
                        )}

                        <button
                            onClick={() => onViewChange('feed')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                currentView === 'feed'
                                    ? 'bg-orange-600 text-white'
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700'
                            }`}
                        >
                            {t("feed")}
                        </button>

                        <button
                            onClick={() => onViewChange('search')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                                currentView === 'search'
                                    ? 'bg-orange-600 text-white'
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700'
                            }`}
                        >
                            <Search className="w-4 h-4" />
                            {t("search")}
                        </button>

                        <button
                            onClick={() => onViewChange('create')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                                currentView === 'create'
                                    ? 'bg-orange-600 text-white'
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700'
                            }`}
                        >
                            <Plus className="w-4 h-4" />
                            {t("create")}
                        </button>

                        {username && onLogout && (
                            <>
                                <button
                                    onClick={onProfileClick}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                                        currentView === 'profile'
                                            ? 'bg-orange-600 text-white'
                                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    <User className="w-4 h-4" />
                                    {t("profile")}
                                </button>

                                <button
                                    onClick={onLogout}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    {t("logout")}
                                </button>

                                {onClearData && (
                                    <button
                                        onClick={() => {
                                            if (window.confirm(t("confirmDeleteAll"))) {
                                                onClearData();
                                            }
                                        }}
                                        className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                                        title={t("clearAll")}
                                    >
                                        🗑️
                                    </button>
                                )}
                                <LanguageSwitcher />
                                <DarkModeButton darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
