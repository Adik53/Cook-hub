import React from "react";
import { Recipe } from "../../types";
import { RecipeCard } from "../RecipePost/RecipeCard";
import { useTranslation } from "react-i18next";

interface FeedViewProps {
    recipes: Recipe[];
    userLikes: Record<string, "like" | "dislike" | null>;
    onLike: (recipeId: string) => void;
    onDislike: (recipeId: string) => void;
    onRecipeClick: (recipe: Recipe) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
                                                      recipes,
                                                      userLikes,
                                                      onLike,
                                                      onDislike,
                                                      onRecipeClick
                                                  }) => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-white dark:bg-[#0d0d0d] text-black dark:text-white px-4 py-6 transition-colors duration-300">

            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                {t("feed")}
            </h2>

            {recipes.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        {t("noRecipesYet")}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            onLike={onLike}
                            onDislike={onDislike}
                            onClick={onRecipeClick}
                            userVote={userLikes[recipe.id] || null}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
