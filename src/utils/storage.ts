import { Recipe } from '../types';

// Интерфейс для работы с window.storage (Claude.ai) или localStorage (локально)
declare global {
    interface Window {
        storage?: {
            get: (key: string) => Promise<{ key: string; value: string } | null>;
            set: (key: string, value: string) => Promise<{ key: string; value: string } | null>;
            delete: (key: string) => Promise<{ key: string; deleted: boolean } | null>;
            list: (prefix?: string) => Promise<{ keys: string[] } | null>;
        };
    }
}

const STORAGE_KEYS = {
    RECIPES: 'recipes',
    USER_LIKES: 'user-likes'
} as const;

// Проверяем, доступен ли window.storage (Claude.ai) или используем localStorage
const isClaudeEnv = typeof window !== 'undefined' && window.storage !== undefined;

export const storage = {
    // Получить все рецепты
    async getRecipes(): Promise<Recipe[]> {
        try {
            if (isClaudeEnv && window.storage) {
                const result = await window.storage.get(STORAGE_KEYS.RECIPES);
                return result?.value ? JSON.parse(result.value) : [];
            } else {
                const data = localStorage.getItem(STORAGE_KEYS.RECIPES);
                return data ? JSON.parse(data) : [];
            }
        } catch (error) {
            console.error('Failed to get recipes:', error);
            return [];
        }
    },

    // Сохранить рецепты
    async setRecipes(recipes: Recipe[]): Promise<void> {
        try {
            const data = JSON.stringify(recipes);
            if (isClaudeEnv && window.storage) {
                await window.storage.set(STORAGE_KEYS.RECIPES, data);
            } else {
                localStorage.setItem(STORAGE_KEYS.RECIPES, data);
            }
        } catch (error) {
            console.error('Failed to save recipes:', error);
        }
    },

    // Получить лайки пользователя
    async getUserLikes(): Promise<Record<string, 'like' | 'dislike' | null>> {
        try {
            if (isClaudeEnv && window.storage) {
                const result = await window.storage.get(STORAGE_KEYS.USER_LIKES);
                return result?.value ? JSON.parse(result.value) : {};
            } else {
                const data = localStorage.getItem(STORAGE_KEYS.USER_LIKES);
                return data ? JSON.parse(data) : {};
            }
        } catch (error) {
            console.error('Failed to get user likes:', error);
            return {};
        }
    },

    // Сохранить лайки пользователя
    async setUserLikes(likes: Record<string, 'like' | 'dislike' | null>): Promise<void> {
        try {
            const data = JSON.stringify(likes);
            if (isClaudeEnv && window.storage) {
                await window.storage.set(STORAGE_KEYS.USER_LIKES, data);
            } else {
                localStorage.setItem(STORAGE_KEYS.USER_LIKES, data);
            }
        } catch (error) {
            console.error('Failed to save user likes:', error);
        }
    }
};