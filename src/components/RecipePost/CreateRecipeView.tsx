import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { Recipe } from '../../types';

interface CreateRecipeViewProps {
    onCreateRecipe: (recipe: Omit<Recipe, 'id' | 'likes' | 'dislikes' | 'comments' | 'createdAt' |'authorId'>) => void;
}

export const CreateRecipeView: React.FC<CreateRecipeViewProps> = ({ onCreateRecipe }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        title: '',
        ingredients: '',
        steps: '',
        imageUrl: '',
        difficulty: 'easy' as Recipe['difficulty'],
        tags: ''
    });

    const [imagePreview, setImagePreview] = useState<string>('');
    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(15);
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [showError, setShowError] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setFormData({ ...formData, imageUrl: result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview('');
        setFormData({ ...formData, imageUrl: '' });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const formatTime = (h: number, m: number): string => {
        if (h === 0 && m === 0) return '';
        if (h > 11) return `12+ ${t("hours")}`;
        if (h === 0) return `${m} ${t("min")}`;
        if (m === 0) return `${h} ${t("hoursShort")}`;
        return `${h} ${t("hoursShort")} ${m} ${t("min")}`;
    };

    const handleSubmit = () => {
        const newErrors: Record<string, boolean> = {};

        if (!formData.title.trim()) newErrors.title = true;
        if (!formData.ingredients.trim()) newErrors.ingredients = true;
        if (!formData.steps.trim()) newErrors.steps = true;
        if (hours === 0 && minutes === 0) newErrors.time = true;

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setShowError(true);
            return;
        }

        const recipe = {
            title: formData.title,
            ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(Boolean),
            steps: formData.steps.split('\n').map(s => s.trim()).filter(Boolean),
            imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800',
            cookingHours: hours,
            cookingMinutes: minutes,
            difficulty: formData.difficulty,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          };

        onCreateRecipe(recipe);

        setFormData({
            title: '',
            ingredients: '',
            steps: '',
            imageUrl: '',
            difficulty: 'easy',
            tags: ''
        });
        setImagePreview('');
        setHours(0);
        setMinutes(15);
        setErrors({});
        setShowError(false);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 dark:text-white">{t("addRecipe")}</h2>

            <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-lg p-8 space-y-6 transition-colors">
                <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                        {t("recipeTitle")} *
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => {
                            setFormData({ ...formData, title: e.target.value });
                            setErrors({ ...errors, title: false });
                        }}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-[#2b2b2b] dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                        placeholder={t("recipeTitlePlaceholder")}
                    />
                    {errors.title && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1 font-semibold bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded">
                            {t("fillRecipeTitle")}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                        {t("ingredients")} *
                    </label>
                    <textarea
                        value={formData.ingredients}
                        onChange={(e) => {
                            setFormData({ ...formData, ingredients: e.target.value });
                            setErrors({ ...errors, ingredients: false });
                        }}
                        rows={3}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-[#2b2b2b] dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                        placeholder={t("ingredientsPlaceholder")}
                    />
                    {errors.ingredients && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1 font-semibold bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded">
                            {t("fillIngredients")}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                        {t("steps")} *
                    </label>
                    <textarea
                        value={formData.steps}
                        onChange={(e) => {
                            setFormData({ ...formData, steps: e.target.value });
                            setErrors({ ...errors, steps: false });
                        }}
                        rows={6}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-[#2b2b2b] dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                        placeholder={t("stepsPlaceholder")}
                    />
                    {errors.steps && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1 font-semibold bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded">
                            {t("fillSteps")}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                        {t("photo")}
                    </label>

                    {imagePreview ? (
                        <div className="relative">
                            <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                            <button
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    ) : (
                        <div>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-orange-500 dark:hover:border-orange-500 transition-colors dark:text-gray-200"
                            >
                                <Upload size={24} />
                                <span>{t("uploadFromComputer")}</span>
                            </button>
                        </div>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t("photoHint")}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                            {t("time")} *
                        </label>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400 w-12">{t("hours")}</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="12"
                                    value={hours}
                                    onChange={(e) => {
                                        setHours(Number(e.target.value));
                                        setErrors({ ...errors, time: false });
                                    }}
                                    className="flex-1 accent-orange-500"
                                />
                                <span className="text-sm font-medium dark:text-white w-12 text-right">
                  {hours > 11 ? '12+' : hours}
                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400 w-12">{t("minutes")}</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="59"
                                    step="5"
                                    value={minutes}
                                    onChange={(e) => {
                                        setMinutes(Number(e.target.value));
                                        setErrors({ ...errors, time: false });
                                    }}
                                    className="flex-1 accent-orange-500"
                                />
                                <span className="text-sm font-medium dark:text-white w-12 text-right">{minutes}</span>
                            </div>

                            <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">
                  {formatTime(hours, minutes) || t("selectTime")}
                </span>
                            </div>
                        </div>
                        {errors.time && (
                            <p className="text-red-600 dark:text-red-400 text-sm mt-1 font-semibold bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded">
                                {t("fillTime")}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                            {t("difficulty")} *
                        </label>
                        <select
                            value={formData.difficulty}
                            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Recipe['difficulty'] })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-[#2b2b2b] dark:border-gray-700 dark:text-white"
                        >
                            <option value="easy">{t("difficulty_easy")}</option>
                            <option value="medium">{t("difficulty_medium")}</option>
                            <option value="hard">{t("difficulty_hard")}</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">{t("tags")}</label>
                    <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-[#2b2b2b] dark:border-gray-700 dark:text-white"
                        placeholder={t("tagsPlaceholder")}
                    />
                </div>

                <div>
                    <button
                        onClick={handleSubmit}
                        className="w-full py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                    >
                        {t("publishRecipe")}
                    </button>

                    {showError && Object.keys(errors).length > 0 && (
                        <p className="text-red-600 dark:text-red-400 text-center text-sm mt-3 font-semibold bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded">
                            {t("fillAllFields")}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};