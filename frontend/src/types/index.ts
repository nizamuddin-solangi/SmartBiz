export type UserRole = 'CUSTOMER' | 'BUSINESS' | 'ADMIN';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    profileImage?: string;
    createdAt: string;
}

export interface Business {
    id: string;
    name: string;
    description: string;
    categories: { id: string, name: string }[];
    email: string;
    phone: string;
    address: string;
    workingHours: string;
    logo?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Service {
    id: string;
    title: string;
    description: string;
    price: number;
    duration: number;
    image?: string;
    category: string;
    businessId: string;
}

export interface Booking {
    id: string;
    customerId: string;
    serviceId: string;
    businessId: string;
    date: string;
    timeSlot: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    service?: Service;
    business?: Business;
    customer?: { name: string; email: string };
}
