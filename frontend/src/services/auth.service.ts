import axios from 'axios';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

const API_URL = 'http://localhost:8080/api/v1/auth';

export const authService = {
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await axios.post(`${API_URL}/authenticate`, data);
        if (response.data.token) {
            this.setToken(response.data.token);
        }
        return response.data;
    },

    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await axios.post(`${API_URL}/register`, data);
        if (response.data.token) {
            this.setToken(response.data.token);
        }
        return response.data;
    },

    setToken(token: string) {
        localStorage.setItem('token', token);
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    logout() {
        localStorage.removeItem('token');
        // Clear other auth-related data if any
        localStorage.clear();
    },

    isAuthenticated(): boolean {
        const token = this.getToken();
        return !!token;
    }
};
