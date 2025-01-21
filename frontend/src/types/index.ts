export interface Client {
    id?: number;
    name: string;
    surname: string;
    email: string;
    phone?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    region?: string;
    regionCode?: string;
    dateOfBirth?: string;
    accounts?: Account[];
    createdAt?: string;
    updatedAt?: string;
}

export interface Account {
    rib: string;
    balance: number;
    client?: Client;
}

export interface ApiResponse<T> {
    data?: T;
    message?: string;
    status?: number;
    error?: string;
}

export interface ClientFilters {
    name?: string;
    city?: string;
    region?: string;
    regionCode?: string;
    ageMin?: number;
    ageMax?: number;
    sortBy?: 'name' | 'dateOfBirth' | 'createdAt';
    sortDirection?: 'asc' | 'desc';
    page?: number;
    size?: number;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}
