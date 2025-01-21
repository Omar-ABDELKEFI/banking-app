import { ApiResponse, Client, ClientFilters, PaginatedResponse } from "../types";
import { api } from "./api.service";

class ClientService {
    private readonly endpoint = '/clients';

    async getAllClients(filters?: ClientFilters): Promise<ApiResponse<PaginatedResponse<Client>>> {
        try {
            const queryParams = {
                name: filters?.name,
                city: filters?.city,
                region: filters?.region,
                regionCode: filters?.regionCode,
                ageMin: filters?.ageMin,
                ageMax: filters?.ageMax,
                page: filters?.page ?? 0,
                size: filters?.size ?? 10,
                sortBy: filters?.sortBy ?? 'name',
                sortDirection: filters?.sortDirection ?? 'asc'
            };

            const response = await api.get<ApiResponse<PaginatedResponse<Client>>>(this.endpoint, {
                params: this.cleanParams(queryParams)
            });

            // Transform backend response to match frontend expectations
            return {
                data: {
                    content: response.data?.data?.content || [],
                    totalElements: response.data?.data?.totalElements || 0,
                    totalPages: response.data?.data?.totalPages || 0,
                    size: response.data?.data?.size || queryParams.size,
                    number: response.data?.data?.number || queryParams.page
                },
                message: response.data?.message,
                status: response.status
            };
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async createClient(client: Client): Promise<ApiResponse<Client>> {
        try {
            const response = await api.post(this.endpoint, client);
            return response;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async updateClient(id: number, client: Client): Promise<ApiResponse<Client>> {
        try {
            const response = await api.put(`${this.endpoint}/${id}`, client);
            return response;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async deleteClient(id: number): Promise<void> {
        try {
            await api.delete(`${this.endpoint}/${id}`);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async searchClients(
        query: string,
        filters?: Omit<ClientFilters, 'name'>
    ): Promise<ApiResponse<PaginatedResponse<Client>>> {
        try {
            const queryParams = {
                query,
                page: filters?.page ?? 0,
                size: filters?.size ?? 10,
                city: filters?.city,
                region: filters?.region,
                sortBy: filters?.sortBy ?? 'name',
                sortDirection: filters?.sortDirection ?? 'asc'
            };

            const response = await api.get(`${this.endpoint}/search`, {
                params: this.cleanParams(queryParams)
            });
            return response;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getClientsByAgeRange(minAge: number, maxAge: number): Promise<ApiResponse<Client[]>> {
        try {
            const response = await api.get(`${this.endpoint}/by-age-range`, {
                params: { minAge, maxAge }
            });
            return response;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getClientsOlderThan(age: number): Promise<ApiResponse<Client[]>> {
        try {
            const response = await api.get(`${this.endpoint}/older-than/${age}`);
            return response;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getClientsYoungerThan(age: number): Promise<ApiResponse<Client[]>> {
        try {
            const response = await api.get(`${this.endpoint}/younger-than/${age}`);
            return response;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getClientsByRegion(region: string): Promise<ApiResponse<Client[]>> {
        try {
            const response = await api.get(`${this.endpoint}/by-region/${region}`);
            return response;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private cleanParams(params: Record<string, any>): Record<string, any> {
        const cleanedParams = Object.entries(params).reduce((acc, [key, value]) => {
            // Only include defined, non-null values, and convert empty strings to undefined
            if (value !== undefined && value !== null && value !== '') {
                acc[key] = value;
            }
            return acc;
        }, {} as Record<string, any>);

        // Ensure pagination parameters are always included
        if (!cleanedParams.hasOwnProperty('page')) cleanedParams.page = 0;
        if (!cleanedParams.hasOwnProperty('size')) cleanedParams.size = 10;
        if (!cleanedParams.hasOwnProperty('sortBy')) cleanedParams.sortBy = 'name';
        if (!cleanedParams.hasOwnProperty('sortDirection')) cleanedParams.sortDirection = 'asc';

        return cleanedParams;
    }

    private handleError(error: any): Error {
        if (error.response?.status === 401) {
            // Let the api.service handle 401 errors
            throw error;
        }
        return new Error(error.response?.data?.message || 'An error occurred');
    }
}

export default new ClientService();