import { z } from 'zod';

export const businessSchema = z.object({
    name: z.string().min(2, 'Business name must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    category: z.string().min(2, 'Category is required'),
    email: z.string().email('Invalid business email'),
    phone: z.string().min(5, 'Invalid phone number'),
    address: z.string().min(5, 'Address is required'),
    workingHours: z.string().min(2, 'Working hours are required'),
    logo: z.string().url().optional().or(z.literal(''))
});

export const updateBusinessSchema = businessSchema.partial();
