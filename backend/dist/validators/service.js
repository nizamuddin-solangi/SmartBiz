"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateServiceSchema = exports.serviceSchema = void 0;
const zod_1 = require("zod");
exports.serviceSchema = zod_1.z.object({
    title: zod_1.z.string().min(2, 'Service title must be at least 2 characters'),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
    price: zod_1.z.number().min(0, 'Price must be a positive number'),
    duration: zod_1.z.number().int().min(1, 'Duration must be at least 1 minute'),
    category: zod_1.z.string().min(2, 'Category is required'),
    image: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    businessId: zod_1.z.string().uuid('Invalid business ID')
});
exports.updateServiceSchema = exports.serviceSchema.partial();
