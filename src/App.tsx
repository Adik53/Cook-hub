import React, { useState, useEffect } from 'react';
import { Recipe, View, User } from './types';
import { storage } from './utils/storage';
import { SAMPLE_RECIPES } from './data/sampleRecipes';
import { Navbar } from './components/navbar/Navbar';
import { FeedView } from './components/feedView/FeedView';
import { FollowingFeedView } from './components/feedView/FollowingFeedView';
import { SearchView } from './components/navbar/SearchView';
import { CreateRecipeView } from './components/RecipePost/CreateRecipeView';
import { RecipeDetailView } from './components/RecipePost/RecipeDetailView';
import { AuthView } from './components/AuthView';
import { VerificationView } from './components/VerificationView';
import { ProfileView } from './components/ProfileView';

function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [userLikes, setUserLikes] = useState<Record<string, 'like' | 'dislike' | null>>({});
    const [currentView, setCurrentView] = useState<View>('feed');
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [profileUsername, setProfileUsername] = useState<string>('');
    const [showFollowingFeed, setShowFollowingFeed] = useState(false);
    const [verificationData, setVerificationData] = useState<{ email: string } | null>(null);
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    const fetchProfileUser = async (username: string) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/auth/user/${username}`
            );

            if (!response.ok) throw new Error('User not found');

            const user = await response.json();

            setProfileUser({
                _id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio || '',
                avatar: user.avatar || '',
                followers: user.followers || [],
                following: user.following || [],
            });
        } catch (error) {
            console.error('Fetch profile error:', error);
        }
    };


    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await fetch('http://localhost:5000/api/auth/me', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const backendUser = await response.json();
                        setCurrentUser({
                            _id: backendUser._id,
                            username: backendUser.username,
                            email: backendUser.email,
                            bio: backendUser.bio,
                            avatar: backendUser.avatar,
                            followers: backendUser.followers || [],
                            following: backendUser.following || [],
                        });
                        await loadData();
                    } else {
                        localStorage.removeItem('token');
                    }
                }
            } catch (err) {
                console.log('Не авторизован');
                localStorage.removeItem('token');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleAuthSuccess = async (token: string) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const backendUser = await response.json();
                setCurrentUser({
                    _id: backendUser._id,
                    username: backendUser.username,
                    email: backendUser.email,
                    bio: backendUser.bio,
                    avatar: backendUser.avatar,
                    followers: backendUser.followers || [],
                    following: backendUser.following || [],
                });

                setVerificationData(null);
                await loadData();
            }
        } catch (error) {
            console.error('Ошибка загрузки пользователя:', error);
        }
    };

    const handleNeedsVerification = (email: string) => {
        setVerificationData({ email });
    };

    const handleVerified = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            await handleAuthSuccess(token);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
        setCurrentView('feed');
        setRecipes([]);
        setUserLikes({});
    };

    const handleClearData = () => {
        if (window.confirm('Удалить все данные?')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [localRecipes, localLikes] = await Promise.all([
                storage.getRecipes(),
                storage.getUserLikes()
            ]);

            const usersResponse = await fetch('http://localhost:5000/api/auth/users');
            let serverUsers = [];
            if (usersResponse.ok) {
                serverUsers = await usersResponse.json();
            }

            if (localRecipes.length > 0) {
                setRecipes(localRecipes);
            } else {
                setRecipes(SAMPLE_RECIPES);
                await storage.setRecipes(SAMPLE_RECIPES);
            }

            setUserLikes(localLikes);
            setUsers(serverUsers);

        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            setRecipes(SAMPLE_RECIPES);
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };


    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };

    useEffect(() => {
        localStorage.setItem("darkMode", String(darkMode));
        document.documentElement.classList.toggle("dark", darkMode);
    }, [darkMode]);

    const handleLike = (recipeId: string) => {
        if (!currentUser) {
            alert('Войдите, чтобы ставить лайки');
            return;
        }

        const currentVote = userLikes[recipeId];
        const newVote: 'like' | 'dislike' | null = currentVote === 'like' ? null : 'like';

        const updatedRecipes = recipes.map(r => {
            if (r.id === recipeId) {
                let newLikes = r.likes;
                let newDislikes = r.dislikes;

                if (currentVote === 'like') {
                    newLikes--;
                } else if (currentVote === 'dislike') {
                    newDislikes--;
                    newLikes++;
                } else {
                    newLikes++;
                }

                return { ...r, likes: newLikes, dislikes: newDislikes };
            }
            return r;
        });

        setRecipes(updatedRecipes);
        storage.setRecipes(updatedRecipes);

        const updatedLikes: Record<string, 'like' | 'dislike' | null> = {
            ...userLikes,
            [recipeId]: newVote
        };
        setUserLikes(updatedLikes);
        storage.setUserLikes(updatedLikes);

        if (selectedRecipe?.id === recipeId) {
            setSelectedRecipe(updatedRecipes.find(r => r.id === recipeId) || null);
        }
    };

    const handleDislike = (recipeId: string) => {
        if (!currentUser) {
            alert('Войдите, чтобы ставить дизлайки');
            return;
        }

        const currentVote = userLikes[recipeId];
        const newVote: 'like' | 'dislike' | null = currentVote === 'dislike' ? null : 'dislike';

        const updatedRecipes = recipes.map(r => {
            if (r.id === recipeId) {
                let newLikes = r.likes;
                let newDislikes = r.dislikes;

                if (currentVote === 'dislike') {
                    newDislikes--;
                } else if (currentVote === 'like') {
                    newLikes--;
                    newDislikes++;
                } else {
                    newDislikes++;
                }

                return { ...r, likes: newLikes, dislikes: newDislikes };
            }
            return r;
        });

        setRecipes(updatedRecipes);
        storage.setRecipes(updatedRecipes);

        const updatedLikes: Record<string, 'like' | 'dislike' | null> = {
            ...userLikes,
            [recipeId]: newVote
        };
        setUserLikes(updatedLikes);
        storage.setUserLikes(updatedLikes);

        if (selectedRecipe?.id === recipeId) {
            setSelectedRecipe(updatedRecipes.find(r => r.id === recipeId) || null);
        }
    };

    const handleCreateRecipe = (recipeData: Omit<Recipe, 'id' | 'likes' | 'dislikes' | 'comments' | 'createdAt' | 'authorId'>) => {
        if (!currentUser) {
            alert('Войдите, чтобы создавать рецепты');
            return;
        }

        const newRecipe: Recipe = {
            ...recipeData,
            id: Date.now().toString(),
            likes: 0,
            dislikes: 0,
            comments: [],
            authorId: currentUser._id,  // ← вот здесь добавляем authorId
            createdAt: Date.now()
        };

        const updatedRecipes = [newRecipe, ...recipes];
        setRecipes(updatedRecipes);
        storage.setRecipes(updatedRecipes);
        setCurrentView('feed');
    };

    const handleAddComment = (recipeId: string, text: string) => {
        if (!currentUser) {
            alert('Войдите, чтобы оставлять комментарии');
            return;
        }

        const comment = {
            id: Date.now().toString(),
            author: currentUser.username,
            text,
            timestamp: Date.now(),
            replies: []
        };

        const updatedRecipes = recipes.map(r => {
            if (r.id === recipeId) {
                return { ...r, comments: [...r.comments, comment] };
            }
            return r;
        });

        setRecipes(updatedRecipes);
        storage.setRecipes(updatedRecipes);

        if (selectedRecipe?.id === recipeId) {
            setSelectedRecipe(updatedRecipes.find(r => r.id === recipeId) || null);
        }
    };

    const handleDeleteComment = (recipeId: string, commentId: string) => {
        const updatedRecipes = recipes.map(r => {
            if (r.id === recipeId) {
                return { ...r, comments: r.comments.filter(c => c.id !== commentId) };
            }
            return r;
        });

        setRecipes(updatedRecipes);
        storage.setRecipes(updatedRecipes);

        if (selectedRecipe?.id === recipeId) {
            setSelectedRecipe(updatedRecipes.find(r => r.id === recipeId) || null);
        }
    };

    const handleEditComment = (recipeId: string, commentId: string, newText: string) => {
        const updatedRecipes = recipes.map(r => {
            if (r.id === recipeId) {
                return {
                    ...r,
                    comments: r.comments.map(c =>
                        c.id === commentId ? { ...c, text: newText } : c
                    )
                };
            }
            return r;
        });

        setRecipes(updatedRecipes);
        storage.setRecipes(updatedRecipes);

        if (selectedRecipe?.id === recipeId) {
            setSelectedRecipe(updatedRecipes.find(r => r.id === recipeId) || null);
        }
    };

    const handleRecipeClick = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setCurrentView('detail');
    };

    const handleBackToFeed = () => {
        setCurrentView('feed');
        setSelectedRecipe(null);
    };

    const handleAuthorClick = (authorId: string) => {
        const user = users.find(u => u._id === authorId);
        if (user) {
            setProfileUser(user);
            setCurrentView('profile');
        }
    };
    const handleProfileClick = async () => {
        if (currentUser) {
            setProfileUsername(currentUser.username);
            await fetchProfileUser(currentUser.username);
            setCurrentView('profile');
        }
    };

    const handleFollow = async (userId: string) => {
        if (!currentUser || !profileUser) return;

        const token = localStorage.getItem('token');

        const res = await fetch(
            `http://localhost:5000/api/auth/follow/${userId}`,
            {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        if (!res.ok) {
            const err = await res.json();
            alert(err.message);
            return;
        }

        // 🔥 обновляем текущего пользователя
        const data = await res.json();
        setCurrentUser({
            ...currentUser,
            following: data.following
        });

        // 🔥 ОБНОВЛЯЕМ ПРОФИЛЬ
        await fetchProfileUser(profileUser.username);
    };

    const handleUnfollow = async (userId: string) => {
        if (!currentUser || !profileUser) return;

        const token = localStorage.getItem('token');

        const res = await fetch(
            `http://localhost:5000/api/auth/unfollow/${userId}`,
            {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        if (!res.ok) {
            const err = await res.json();
            alert(err.message);
            return;
        }

        const data = await res.json();
        setCurrentUser({
            ...currentUser,
            following: data.following
        });

        await fetchProfileUser(profileUser.username);
    };

    const handleToggleFeed = () => {
        setShowFollowingFeed(!showFollowingFeed);
    };

    const handleViewChange = (view: View) => {
        setCurrentView(view);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-xl text-gray-700">Загрузка...</p>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        if (verificationData) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
                    <VerificationView
                        email={verificationData.email}
                        onVerified={handleVerified}
                        onSkip={handleVerified}
                    />
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
                <AuthView
                    onSuccess={handleAuthSuccess}
                    onNeedsVerification={handleNeedsVerification}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:bg-gray-950 dark:bg-none transition-colors duration-300">
            <Navbar
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                currentView={currentView}
                onViewChange={handleViewChange}
                username={currentUser.username}
                onLogout={handleLogout}
                onClearData={handleClearData}
                showFollowingFeed={showFollowingFeed}
                onToggleFeed={handleToggleFeed}
                onProfileClick={handleProfileClick}
            />

            <main className="max-w-7xl mx-auto px-4 py-8">
                {currentView === 'feed' && (
                    <>
                        {showFollowingFeed ? (
                            <FollowingFeedView
                                recipes={recipes}
                                currentUser={currentUser}
                                allUsers={users}
                                userLikes={userLikes}
                                onLike={handleLike}
                                onDislike={handleDislike}
                                onRecipeClick={handleRecipeClick}
                            />
                        ) : (
                            <FeedView
                                recipes={recipes}
                                userLikes={userLikes}
                                onLike={handleLike}
                                onDislike={handleDislike}
                                onRecipeClick={handleRecipeClick}
                            />
                        )}
                    </>
                )}

                {currentView === 'search' && (
                    <SearchView
                        recipes={recipes}
                        userLikes={userLikes}
                        onLike={handleLike}
                        onDislike={handleDislike}
                        onRecipeClick={handleRecipeClick}
                    />
                )}

                {currentView === 'create' && (
                    <CreateRecipeView
                        onCreateRecipe={handleCreateRecipe}
                    />
                )}

                {currentView === 'detail' && selectedRecipe && (
                    <RecipeDetailView
                        recipe={selectedRecipe}
                        userVote={userLikes[selectedRecipe.id] || null}
                        onLike={handleLike}
                        onDislike={handleDislike}
                        onAddComment={handleAddComment}
                        onDeleteComment={handleDeleteComment}
                        onEditComment={handleEditComment}
                        onBack={handleBackToFeed}
                        currentUsername={currentUser.username}
                        onAuthorClick={handleAuthorClick}
                        allUsers={users}
                    />
                )}

                {currentView === 'profile' && profileUser && (
                    <ProfileView
                        profileUser={profileUser}
                        currentUser={currentUser}
                        recipes={recipes}
                        userLikes={userLikes}
                        onLike={handleLike}
                        onDislike={handleDislike}
                        onRecipeClick={handleRecipeClick}
                        onBack={handleBackToFeed}
                        onFollow={handleFollow}
                        onUnfollow={handleUnfollow}
                    />
                )}
            </main>
        </div>
    );
}

export default App;