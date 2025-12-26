import api from '../api/instance';

export interface AuthUser {
    _id: string;
    email: string;
    username: string;
    role: string;
}

class AuthService {
    async login(email: string, password: string) {
        const res = await api.post('/auth/login', { email, password });
        return res.data;
    }

    async register(email: string, password: string, username: string) {
        const res = await api.post('/auth/register', { email, password, username });
        return res.data;
    }

    async logout() {
        await api.post('/auth/logout');
    }

    async getCurrentUser(): Promise<AuthUser | null> {
        try {
            const res = await api.get('/profile');
            return res.data.user;
        } catch {
            return null;
        }
    }
}

export const authService = new AuthService();