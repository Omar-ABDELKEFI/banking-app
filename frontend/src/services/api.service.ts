import axios from 'axios';
import { authService } from './auth.service';

const api = axios.create({
    baseURL: 'http://localhost:8080'
});

api.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            authService.logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export { api };
