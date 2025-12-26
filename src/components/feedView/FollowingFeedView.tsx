import React from 'react';
import { Recipe, User } from '../../types';
import { RecipeCard } from '../RecipePost/RecipeCard';
import { useTranslation } from "react-i18next";

interface FollowingFeedViewProps {
    recipes: Recipe[];
    currentUser: User;
    allUsers: User[];
    userLikes: Record<string, 'like' | 'dislike' | null>;
    onLike: (recipeId: string) => void;
    onDislike: (recipeId: string) => void;
    onRecipeClick: (recipe: Recipe) => void;
}

export const FollowingFeedView: React.FC<FollowingFeedViewProps> = ({
                                                                        recipes,
                                                                        currentUser,
                                                                        allUsers,
                                                                        userLikes,
                                                                        onLike,
                                                                        onDislike,
                                                                        onRecipeClick
                                                                    }) => {
    const { t } = useTranslation();

    const followingUsernames = currentUser.following
        .map(userId => allUsers.find(u => u._id === userId)?.username)
        .filter(Boolean);

    const followingRecipes = recipes.filter(recipe =>
        followingUsernames.includes(recipe.author)
    );

    return (
        <div className="dark:text-white text-black">
            <h2 className="text-3xl font-bold mb-6">{t("followingFeed")}</h2>

            {followingRecipes.length === 0 ? (
                <div className="text-center py-12 dark:bg-[#1a1a1a] rounded-2xl shadow-xl">
                    <p className="dark:text-gray-300 text-black text-lg mb-4">
                        {t("noFollowingRecipes")}
                    </p>
                    <p className="text-gray-500">
                        {t("followUsersToSee")}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {followingRecipes.map(recipe => (
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
