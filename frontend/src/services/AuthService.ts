import axios from 'axios';

interface LoginCredentials {
    username: string;
    password: string;
}

interface RegisterData {
    username: string;
    email: string;
    password: string;
    role?: 'user' | 'admin';
}

interface AuthResponse {
    success: boolean;
    data    : {
        id: number;
        username: string;
        email: string;
        role: 'user' | 'admin';
    };
    token: string;
}

const API_URL = 'http://localhost:8080/api';
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthResponse>('/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw new Error('Login failed');
        }
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthResponse>('/auth/register', data);
            return response.data;
        } catch (error) {
            throw new Error('Registration failed');
        }
    },
};