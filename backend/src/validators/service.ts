import { z } from 'zod';

export const serviceSchema = z.object({
    title: z.string().min(2, 'Service title must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().min(0, 'Price must be a positive number'),
    duration: z.number().int().min(1, 'Duration must be at least 1 minute'),
    category: z.string().min(2, 'Category is required'),
    image: z.string().url().optional().or(z.literal('')),
    businessId: z.string().uuid('Invalid business ID')
});

export const updateServiceSchema = serviceSchema.partial();
