import React, { useState } from 'react';
import { Send, Trash2, Edit2 } from 'lucide-react';
import { Comment } from '../../../types';
import { useTranslation } from "react-i18next";

interface CommentSectionProps {
    comments: Comment[];
    onAddComment: (text: string) => void;
    onDeleteComment: (commentId: string) => void;
    onEditComment: (commentId: string, newText: string) => void;
    currentUsername?: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
                                                                  comments,
                                                                  onAddComment,
                                                                  onDeleteComment,
                                                                  onEditComment,
                                                                  currentUsername
                                                              }) => {

    const [commentText, setCommentText] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');
    const { t } = useTranslation();

    const handleSubmit = () => {
        if (commentText.trim()) {
            onAddComment(commentText);
            setCommentText('');
        }
    };

    const handleEdit = (commentId: string) => {
        if (editText.trim()) {
            onEditComment(commentId, editText);
            setEditingId(null);
            setEditText('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-gray-900 dark:text-white mb-4">
                {t("commentsTitle")} ({comments.length})
            </h2>

            <div className="mb-6">
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder={t("writeComment")}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button onClick={handleSubmit} disabled={!commentText.trim()} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
                        <Send className="w-4 h-4"/>
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                                {comment.author}
                            </span>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(comment.timestamp).toLocaleDateString('ru-RU', {
                                        day: 'numeric',
                                        month: 'long',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>

                                {comment.author === currentUsername && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingId(comment.id);
                                                setEditText(comment.text);
                                            }}
                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                            title={t("edit")}
                                        >
                                            <Edit2 className="w-4 h-4"/>
                                        </button>

                                        <button
                                            onClick={() => {
                                                if (window.confirm(t("deleteCommentConfirm"))) {
                                                    onDeleteComment(comment.id);
                                                }
                                            }}
                                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                                            title={t("delete")}
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {editingId === comment.id ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    autoFocus
                                />
                                <button
                                    onClick={() => handleEdit(comment.id)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {t("save")}
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingId(null);
                                        setEditText('');
                                    }}
                                    className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                                >
                                    {t("cancel")}
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-700 dark:text-gray-200">{comment.text}</p>
                        )}
                    </div>
                ))}

                {comments.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        {t("noComments")}
                    </p>
                )}
            </div>
        </div>
    );
};
