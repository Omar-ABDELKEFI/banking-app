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
    dateOfBirth?: Date | null;
    accounts?: Account[];
    createdAt?: Date;
    updatedAt?: Date;
    latitude?: number | null;
    longitude?: number | null;
    profilePictureUrl?: string;
}

export interface Account {
    rib: string;
    balance: number;
    client?: Client;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    pageMetadata: PageMetadata;
    success: boolean;
    timestamp: string;
}

export interface PageMetadata {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
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
