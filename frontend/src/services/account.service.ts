

import { api } from './api.service';
import { Account, ApiResponse } from '../types';

class AccountService {
    private readonly endpoint = '/accounts';

    async getAllAccounts(): Promise<ApiResponse<Account[]>> {
        try {
            const response = await api.get(this.endpoint);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async createAccount(account: Account): Promise<ApiResponse<Account>> {
        try {
            const response = await api.post(this.endpoint, account);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async updateAccount(rib: string, account: Account): Promise<ApiResponse<Account>> {
        try {
            const response = await api.put(`${this.endpoint}/${rib}`, account);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async deleteAccount(rib: string): Promise<void> {
        try {
            await api.delete(`${this.endpoint}/${rib}`);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private handleError(error: any): Error {
        return new Error(error.response?.data?.message || 'An error occurred');
    }
}

export default new AccountService();