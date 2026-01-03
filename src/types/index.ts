    export interface Comment {
        id: string;
        author: string;
        text: string;
        timestamp: number;
        replies?: Comment[];
    }

    export interface Recipe {
        id: string;
        title: string;
        ingredients: string[];
        steps: string[];
        imageUrl: string;
        cookingHours: number;
        cookingMinutes: number;
        difficulty: 'easy' | 'medium' | 'hard';
        tags: string[];
        likes: number;
        dislikes: number;
        comments: Comment[];
        authorId: string;
        createdAt: number;
    }

    export type View = 'feed' | 'search' | 'create' | 'detail' | 'profile';

    export interface SearchMatch {
        recipe: Recipe;
        hasIngredients: string[];
        missingIngredients: string[];
        matchPercent: number;
    }

    export const DIFFICULTY_COLORS: Record<Recipe['difficulty'], string> = {
        easy: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        hard: 'bg-red-100 text-red-800'
    };

    export interface User {
        _id: string;
        username: string;
        email: string;
        bio?: string;
        avatar?: string;
        followers: string[];
        following: string[];
    }

