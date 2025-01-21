import { ApiResponse, Client, ClientFilters } from "../types";
import { api } from "./api.service";

class ClientService {
    private readonly endpoint = 'clients';
    private readonly uploadEndpoint = '/api/upload';

    async uploadFile(file: File): Promise<string> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post(this.uploadEndpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data.url;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async uploadProfilePicture(file: File): Promise<string> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post(`${this.uploadEndpoint}/profile-picture`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data.url;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getAllClients(filters?: ClientFilters): Promise<ApiResponse<Client[]>> {
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

            const response = await api.get<ApiResponse<Client[]>>(this.endpoint, {
                params: this.cleanParams(queryParams)
            });

            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async createClient(client: Client, profilePicture?: File): Promise<ApiResponse<Client>> {
        try {
            const formData = new FormData();
            const clientData = { ...client };
            
            // If there's a profile picture, upload it
            if (profilePicture) {
                formData.append('profilePicture', profilePicture);
            }
            
            // Add client data as JSON string
            formData.append('data', new Blob([JSON.stringify(clientData)], { type: 'application/json' }));

            const response = await api.post<ApiResponse<Client>>(this.endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async updateClient(id: number, updatedFields: Partial<Client>): Promise<ApiResponse<Client>> {
        try {
            // Use PATCH instead of PUT for partial updates
            const response = await api.patch<ApiResponse<Client>>(`${this.endpoint}/${id}`, updatedFields);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async updateClientProfilePicture(clientId: number, profilePictureUrl: string): Promise<ApiResponse<Client>> {
        try {
            const response = await api.patch<ApiResponse<Client>>(
                `${this.endpoint}/${clientId}/profile-picture`,
                null,
                {
                    params: { profilePictureUrl }
                }
            );
            return response.data;
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
    ): Promise<ApiResponse<Client>> {
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

            const response = await api.get<ApiResponse<Client>>(`${this.endpoint}/search`, {
                params: this.cleanParams(queryParams)
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getClientsByAgeRange(minAge: number, maxAge: number): Promise<ApiResponse<Client[]>> {
        try {
            const response = await api.get<ApiResponse<Client[]>>(`${this.endpoint}/by-age-range`, {
                params: { minAge, maxAge }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getClientsOlderThan(age: number): Promise<ApiResponse<Client[]>> {
        try {
            const response = await api.get<ApiResponse<Client[]>>(`${this.endpoint}/older-than/${age}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getClientsYoungerThan(age: number): Promise<ApiResponse<Client[]>> {
        try {
            const response = await api.get<ApiResponse<Client[]>>(`${this.endpoint}/younger-than/${age}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getClientsByRegion(region: string): Promise<ApiResponse<Client[]>> {
        try {
            const response = await api.get<ApiResponse<Client[]>>(`${this.endpoint}/by-region/${region}`);
            return response.data;
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