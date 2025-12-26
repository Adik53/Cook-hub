import React, { useState } from 'react';
import { User, Recipe } from '../types';
import { RecipeCard } from './RecipePost/RecipeCard';
import {
    ArrowLeft,
    Edit2,
    UserPlus,
    UserMinus,
    Users
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProfileViewProps {
    profileUser: User;          // 🔥 пользователь, чей профиль открыт
    currentUser: User;          // 🔥 текущий залогиненный пользователь
    recipes: Recipe[];
    userLikes: Record<string, 'like' | 'dislike' | null>;
    onLike: (recipeId: string) => void;
    onDislike: (recipeId: string) => void;
    onRecipeClick: (recipe: Recipe) => void;
    onBack: () => void;
    onFollow: (userId: string) => void;
    onUnfollow: (userId: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
                                                            profileUser,
                                                            currentUser,
                                                            recipes,
                                                            userLikes,
                                                            onLike,
                                                            onDislike,
                                                            onRecipeClick,
                                                            onBack,
                                                            onFollow,
                                                            onUnfollow
                                                        }) => {
    const { t } = useTranslation();

    const isOwnProfile = currentUser._id === profileUser._id;
    const isFollowing = currentUser.following.includes(profileUser._id);

    const userRecipes = recipes.filter(
        recipe => recipe.author === profileUser.username
    );

    const [isEditing, setIsEditing] = useState(false);
    const [editBio, setEditBio] = useState(profileUser.bio || '');
    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);

    const handleSaveBio = () => {
        setIsEditing(false);
        alert(t('bioSaved'));
    };

    return (
        <div className="dark:bg-gray-900 dark:text-white min-h-screen p-4 rounded-xl">

            {/* BACK */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-6 text-lg font-medium"
            >
                <ArrowLeft className="w-5 h-5" />
                {t('back')}
            </button>

            {/* PROFILE CARD */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">

                    {/* AVATAR */}
                    <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white text-6xl font-bold">
                        {profileUser.username.charAt(0).toUpperCase()}
                    </div>

                    <div className="text-center sm:text-left flex-1">

                        {/* HEADER */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                            <h1 className="text-4xl font-bold">
                                {profileUser.username}
                            </h1>

                            {isOwnProfile ? (
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    {t('editProfile')}
                                </button>
                            ) : (
                                <button
                                    onClick={() =>
                                        isFollowing
                                            ? onUnfollow(profileUser.username)
                                            : onFollow(profileUser.username)
                                    }
                                    className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-3 ${
                                        isFollowing
                                            ? 'bg-gray-200 dark:bg-gray-700'
                                            : 'bg-orange-600 text-white'
                                    }`}
                                >
                                    {isFollowing ? (
                                        <>
                                            <UserMinus className="w-5 h-5" />
                                            {t('unfollow')}
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-5 h-5" />
                                            {t('follow')}
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* STATS */}
                        <div className="flex justify-center sm:justify-start gap-10 mb-6 text-lg">
                            <div>
                                <div className="font-bold text-2xl">
                                    {userRecipes.length}
                                </div>
                                <div className="text-gray-600 dark:text-gray-300">
                                    {t('recipesCount')}
                                </div>
                            </div>

                            <button
                                onClick={() => setShowFollowers(true)}
                                className="hover:text-orange-600"
                            >
                                <div className="font-bold text-2xl">
                                    {profileUser.followers.length}
                                </div>
                                <div className="text-gray-600 dark:text-gray-300">
                                    {t('followersCount')}
                                </div>
                            </button>

                            <button
                                onClick={() => setShowFollowing(true)}
                                className="hover:text-orange-600"
                            >
                                <div className="font-bold text-2xl">
                                    {profileUser.following.length}
                                </div>
                                <div className="text-gray-600 dark:text-gray-300">
                                    {t('followingCount')}
                                </div>
                            </button>
                        </div>

                        {/* BIO */}
                        {isEditing ? (
                            <div className="max-w-lg">
                                <textarea
                                    value={editBio}
                                    onChange={e => setEditBio(e.target.value)}
                                    className="w-full p-4 border rounded-xl"
                                    rows={4}
                                />

                                <div className="flex gap-3 mt-3">
                                    <button
                                        onClick={handleSaveBio}
                                        className="px-6 py-2 bg-orange-600 text-white rounded-lg"
                                    >
                                        {t('save')}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditBio(profileUser.bio || '');
                                        }}
                                        className="px-6 py-2 bg-gray-200 rounded-lg"
                                    >
                                        {t('cancel')}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-700 dark:text-gray-300 text-lg">
                                {profileUser.bio || t('noBio')}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* FOLLOWERS / FOLLOWING MODAL */}
            {(showFollowers || showFollowing) && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        {t('featureInDevelopment')}
                    </p>
                    <button
                        onClick={() => {
                            setShowFollowers(false);
                            setShowFollowing(false);
                        }}
                        className="mt-4 text-blue-600 hover:underline"
                    >
                        {t('close')}
                    </button>
                </div>
            )}

            {/* RECIPES */}
            <div>
                <h2 className="text-3xl font-bold mb-8">
                    {isOwnProfile
                        ? t('recipesYour')
                        : `${t('recipesFrom')} @${profileUser.username}`}
                    ({userRecipes.length})
                </h2>

                {userRecipes.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                        <p className="text-xl text-gray-500">
                            {t('noUserRecipes')}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {userRecipes.map(recipe => (
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
        </div>
    );
};
