import React, { useState, useMemo } from 'react';
import { Recipe, SearchMatch } from '../../types';
import { RecipeCard } from '../RecipePost/RecipeCard';
import { useTranslation } from 'react-i18next';

interface SearchViewProps {
    recipes: Recipe[];
    userLikes: Record<string, 'like' | 'dislike' | null>;
    onLike: (recipeId: string) => void;
    onDislike: (recipeId: string) => void;
    onRecipeClick: (recipe: Recipe) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
                                                          recipes,
                                                          userLikes,
                                                          onLike,
                                                          onDislike,
                                                          onRecipeClick
                                                      }) => {
    const [searchIngredients, setSearchIngredients] = useState('');
    const { t } = useTranslation();

    const searchResults = useMemo(() => {
        if (!searchIngredients.trim()) return [];

        const userIngredients = searchIngredients
            .toLowerCase()
            .split(',')
            .map(i => i.trim())
            .filter(Boolean);

        return recipes
            .map(recipe => {
                const recipeIngredients = recipe.ingredients.map(i => i.toLowerCase());

                const hasIngredients = recipeIngredients.filter(recipeIng =>
                    userIngredients.some(userIng =>
                        recipeIng.includes(userIng) || userIng.includes(recipeIng)
                    )
                );

                const missingIngredients = recipeIngredients.filter(recipeIng =>
                    !userIngredients.some(userIng =>
                        recipeIng.includes(userIng) || userIng.includes(recipeIng)
                    )
                );

                const matchPercent =
                    (hasIngredients.length / recipeIngredients.length) * 100;

                return {
                    recipe,
                    hasIngredients,
                    missingIngredients,
                    matchPercent
                } as SearchMatch;
            })
            .sort((a, b) => b.matchPercent - a.matchPercent);
    }, [recipes, searchIngredients]);

    return (
        <div className="text-black dark:text-white">
            <h2 className="text-3xl font-bold mb-6">
                {t("whatDoIHave")}
            </h2>

            <div className="
                bg-white dark:bg-neutral-900
                border border-gray-200 dark:border-neutral-700
                rounded-xl shadow-lg p-6 mb-8
            ">
                <label className="block text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">
                    {t("enterIngredients")}
                </label>

                <input
                    type="text"
                    placeholder={t("placeholderIngredients")}
                    value={searchIngredients}
                    onChange={(e) => setSearchIngredients(e.target.value)}
                    className="
                        w-full px-4 py-3 text-lg rounded-lg
                        border border-gray-300 dark:border-neutral-700
                        bg-white dark:bg-neutral-800
                        text-black dark:text-white
                        focus:outline-none
                        focus:ring-2 focus:ring-orange-500
                    "
                />

                {searchIngredients.trim() && (
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        {t("foundRecipes")} {searchResults.length}
                    </p>
                )}
            </div>

            {searchIngredients.trim() && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map(
                        ({ recipe, hasIngredients, missingIngredients, matchPercent }) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                onLike={onLike}
                                onDislike={onDislike}
                                onClick={onRecipeClick}
                                userVote={userLikes[recipe.id] || null}
                                showMatch={{ hasIngredients, missingIngredients, matchPercent }}
                            />
                        )
                    )}
                </div>
            )}
        </div>
    );
};
