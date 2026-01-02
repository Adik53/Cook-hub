import React from 'react';
import { Heart, ThumbsDown, MessageCircle, Clock } from 'lucide-react';
import { Recipe, SearchMatch, DIFFICULTY_COLORS } from '../../types';
import { useTranslation } from "react-i18next";
import {formatTime} from "../../utils/formatTime";

interface RecipeCardProps {
    recipe: Recipe;
    onLike: (recipeId: string) => void;
    onDislike: (recipeId: string) => void;
    onClick: (recipe: Recipe) => void;
    userVote: 'like' | 'dislike' | null;
    showMatch?: Pick<SearchMatch, 'hasIngredients' | 'missingIngredients' | 'matchPercent'>;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
                                                          recipe,
                                                          onLike,
                                                          onDislike,
                                                          onClick,
                                                          userVote,
                                                          showMatch
                                                      }) => {
    const { t } = useTranslation();

    return (
        <div
            className="
                bg-white dark:bg-[#1e1e1e]
                rounded-xl shadow-lg overflow-hidden
                hover:shadow-xl transition-shadow cursor-pointer
                dark:border dark:border-gray-800
            "
            onClick={() => onClick(recipe)}
        >
            <div className="relative h-48">
                <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover"/>

                {showMatch && (
                    <div className="absolute top-2 right-2 bg-white dark:bg-gray-900text-black dark:text-whitepx-3 py-1 rounded-full shadow-lg font-semibold text-sm">
                        {showMatch.matchPercent === 100
                            ? t("everythingOk")
                            : `${Math.round(showMatch.matchPercent)}% ${t("match")}`
                        }
                    </div>
                )}
            </div>

            <div className="p-5 dark:text-gray-200">
                <h3 className="text-xl font-bold mb-2 dark:text-white">{recipe.title}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        {formatTime(recipe.cookingHours, recipe.cookingMinutes)}
                    </span>

                    <span
                        className={`
                            px-2 py-1 rounded-full text-xs font-medium 
                            ${DIFFICULTY_COLORS[recipe.difficulty]}
                            dark:ring-1 dark:ring-gray-700 dark:bg-gray-800 dark:text-gray-200
                        `}
                    >
                        {t(`difficulty_${recipe.difficulty}`)}
                    </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                    {recipe.tags.map((tag, i) => (
                        <span
                            key={i}
                            className="
                                text-xs
                                bg-blue-50 dark:bg-blue-900/40
                                text-blue-600 dark:text-blue-300
                                px-2 py-1 rounded
                            "
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {showMatch && showMatch.missingIngredients.length > 0 && (
                    <div
                        className="
                            mb-3 p-2
                            bg-orange-50 dark:bg-orange-900/30
                            rounded text-sm
                        "
                    >
                        <p className="font-medium text-orange-800 dark:text-orange-300">
                            {t("missing")}
                        </p>
                        <p className="text-orange-700 dark:text-orange-200">
                            {showMatch.missingIngredients.join(', ')}
                        </p>
                    </div>
                )}

                <div className="flex items-center gap-4 pt-3 border-t dark:border-gray-700">
                    {/* LIKE */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onLike(recipe.id);
                        }}
                        className={`
                            flex items-center gap-1 transition-colors 
                            ${userVote === 'like'
                            ? 'text-red-500'
                            : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
                        }
                        `}
                    >
                        <Heart className={`w-5 h-5 ${userVote === 'like' ? 'fill-current' : ''}`}/>
                        <span className="font-medium">{recipe.likes}</span>
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDislike(recipe.id);
                        }}
                        className={`flex items-center gap-1 transition-colors
                        ${userVote === 'dislike'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                        }
    `}
                    >
                        <ThumbsDown className={`w-5 h-5 ${userVote === 'dislike' ? 'fill-current' : ''}`}/>
                        <span className="font-medium">{recipe.dislikes}</span>
                    </button>

                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 ml-auto">
                        <MessageCircle className="w-5 h-5"/>
                        <span className="font-medium">{recipe.comments.length}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
