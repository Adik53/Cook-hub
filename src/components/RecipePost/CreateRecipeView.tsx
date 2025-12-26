import React, { useState } from 'react';
import { Recipe } from '../../types';
import { useTranslation } from "react-i18next";

interface CreateRecipeViewProps {
    onCreateRecipe: (recipe: Omit<Recipe, 'id' | 'likes' | 'dislikes' | 'comments' | 'createdAt'>) => void;
}

export const CreateRecipeView: React.FC<CreateRecipeViewProps> = ({ onCreateRecipe }) => {
    const [formData, setFormData] = useState({
        title: '',
        ingredients: '',
        steps: '',
        imageUrl: '',
        time: '',
        difficulty: 'easy' as Recipe['difficulty'],
        tags: ''
    });
    const { t } = useTranslation();

    const handleSubmit = () => {
        if (!formData.title.trim()) {
            alert(t("fillRecipeTitle"));
            return;
        }
        if (!formData.ingredients.trim()) {
            alert(t("fillIngredients"));
            return;
        }
        if (!formData.steps.trim()) {
            alert(t("fillSteps"));
            return;
        }
        if (!formData.time.trim()) {
            alert(t("fillTime"));
            return;
        }

        const recipe = {
            title: formData.title,
            ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(Boolean),
            steps: formData.steps.split('\n').map(s => s.trim()).filter(Boolean),
            imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800',
            time: formData.time,
            difficulty: formData.difficulty,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            author: t("you"),
        };

        onCreateRecipe(recipe);

        setFormData({
            title: '',
            ingredients: '',
            steps: '',
            imageUrl: '',
            time: '',
            difficulty: 'easy',
            tags: ''
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 dark:text-white">{t("addRecipe")}</h2>

            <div className="
                bg-white dark:bg-[#1e1e1e]
                rounded-xl shadow-lg p-8 space-y-6
                transition-colors
            ">
                <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                        {t("recipeTitle")} *
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="
                            w-full px-4 py-2 border rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-orange-500
                            dark:bg-[#2b2b2b] dark:border-gray-700 dark:text-white
                            dark:placeholder-gray-400
                        "
                        placeholder={t("recipeTitlePlaceholder")}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                        {t("ingredients")} *
                    </label>
                    <textarea
                        value={formData.ingredients}
                        onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                        rows={3}
                        className="
                            w-full px-4 py-2 border rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-orange-500
                            dark:bg-[#2b2b2b] dark:border-gray-700 dark:text-white
                            dark:placeholder-gray-400
                        "
                        placeholder={t("ingredientsPlaceholder")}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                        {t("steps")} *
                    </label>
                    <textarea
                        value={formData.steps}
                        onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                        rows={6}
                        className="
                            w-full px-4 py-2 border rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-orange-500
                            dark:bg-[#2b2b2b] dark:border-gray-700 dark:text-white
                            dark:placeholder-gray-400
                        "
                        placeholder={t("stepsPlaceholder")}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                        {t("imageUrl")}
                    </label>
                    <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="
                            w-full px-4 py-2 border rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-orange-500
                            dark:bg-[#2b2b2b] dark:border-gray-700 dark:text-white
                        "
                        placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t("imageUrlHint")}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                            {t("time")} *
                        </label>
                        <input
                            type="text"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            className="
                                w-full px-4 py-2 border rounded-lg
                                focus:outline-none focus:ring-2 focus:ring-orange-500
                                dark:bg-[#2b2b2b] dark:border-gray-700 dark:text-white
                            "
                            placeholder={t("timePlaceholder")}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                            {t("difficulty")} *
                        </label>
                        <select
                            value={formData.difficulty}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    difficulty: e.target.value as Recipe['difficulty']
                                })
                            }
                            className="
                                w-full px-4 py-2 border rounded-lg
                                focus:outline-none focus:ring-2 focus:ring-orange-500
                                dark:bg-[#2b2b2b] dark:border-gray-700 dark:text-white
                            "
                        >
                            <option value="easy">{t("difficulty_easy")}</option>
                            <option value="medium">{t("difficulty_medium")}</option>
                            <option value="hard">{t("difficulty_hard")}</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                        {t("tags")}
                    </label>
                    <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        className="
                            w-full px-4 py-2 border rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-orange-500
                            dark:bg-[#2b2b2b] dark:border-gray-700 dark:text-white
                        "
                        placeholder={t("tagsPlaceholder")}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    className="
                        w-full py-3 bg-orange-600 text-white rounded-lg font-medium
                        hover:bg-orange-700 transition-colors
                    "
                >
                    {t("publishRecipe")}
                </button>
            </div>
        </div>
    );
};
