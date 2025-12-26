import React from 'react';
import { ArrowLeft, Clock, Heart, X, User } from 'lucide-react';
import { Recipe, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '../../types';
import { CommentSection } from './comments/CommentSection';
import { useTranslation } from "react-i18next";

interface RecipeDetailViewProps {
    recipe: Recipe;
    userVote: 'like' | 'dislike' | null;
    onLike: (recipeId: string) => void;
    onDislike: (recipeId: string) => void;
    onAddComment: (recipeId: string, text: string) => void;
    onDeleteComment: (recipeId: string, commentId: string) => void;
    onEditComment: (recipeId: string, commentId: string, newText: string) => void;
    onBack: () => void;
    currentUsername?: string;
    onAuthorClick: (authorName: string) => void;
}

export const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({
                                                                      recipe,
                                                                      userVote,
                                                                      onLike,
                                                                      onDislike,
                                                                      onAddComment,
                                                                      onDeleteComment,
                                                                      onEditComment,
                                                                      onBack,
                                                                      currentUsername,
                                                                      onAuthorClick
                                                                  }) => {

    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={onBack} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                {t("backToFeed")}
            </button>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-96 object-cover"/>

                <div className="p-8">
                    <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                        {recipe.title}
                    </h1>

                    <div className="flex items-center gap-4 mb-6">

                        <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <Clock className="w-5 h-5" />
                            {recipe.time}
                        </span>

                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${DIFFICULTY_COLORS[recipe.difficulty]}`}>
                            {DIFFICULTY_LABELS[recipe.difficulty]}
                        </span>

                        <button
                            onClick={() => onAuthorClick(recipe.author)}
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                        >
                            <User className="w-5 h-5" />
                            <span className="font-medium">{recipe.author}</span>
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {recipe.tags.map((tag, i) => (
                            <span
                                key={i}
                                className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                            {t("ingredientsList")}
                        </h2>
                        <ul className="space-y-2">
                            {recipe.ingredients.map((ing, i) => (
                                <li key={i} className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                    <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></span>
                                    {ing}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                            {t("cookingSteps")}
                        </h2>
                        <ol className="space-y-3">
                            {recipe.steps.map((step, i) => (
                                <li key={i} className="flex gap-3 text-gray-700 dark:text-gray-200">
                                    <span className="font-bold text-blue-600 dark:text-blue-400 min-w-[24px]">
                                        {i + 1}.
                                    </span>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="flex items-center gap-6 py-6 border-y border-gray-200 dark:border-gray-700">

                        <button
                            onClick={() => onLike(recipe.id)}
                            className={`flex items-center gap-2 ${
                                userVote === 'like'
                                    ? 'text-red-500'
                                    : 'text-gray-500 dark:text-gray-300 hover:text-red-500'
                            } transition-colors`}
                        >
                            <Heart className={`w-6 h-6 ${userVote === 'like' ? 'fill-current' : ''}`} />
                            <span className="font-medium text-lg">{recipe.likes}</span>
                        </button>

                        <button
                            onClick={() => onDislike(recipe.id)}
                            className={`flex items-center gap-2 ${
                                userVote === 'dislike'
                                    ? 'text-gray-700 dark:text-gray-200'
                                    : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                            } transition-colors`}
                        >
                            <X className="w-6 h-6" />
                            <span className="font-medium text-lg">{recipe.dislikes}</span>
                        </button>
                    </div>

                    <CommentSection
                        comments={recipe.comments}
                        onAddComment={(text) => onAddComment(recipe.id, text)}
                        onDeleteComment={(commentId) => onDeleteComment(recipe.id, commentId)}
                        onEditComment={(commentId, newText) => onEditComment(recipe.id, commentId, newText)}
                        currentUsername={currentUsername}
                    />
                </div>
            </div>
        </div>
    );
};
