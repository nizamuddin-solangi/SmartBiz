"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBusinessSchema = exports.businessSchema = void 0;
const zod_1 = require("zod");
exports.businessSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Business name must be at least 2 characters'),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
    category: zod_1.z.string().min(2, 'Category is required'),
    email: zod_1.z.string().email('Invalid business email'),
    phone: zod_1.z.string().min(5, 'Invalid phone number'),
    address: zod_1.z.string().min(5, 'Address is required'),
    workingHours: zod_1.z.string().min(2, 'Working hours are required'),
    logo: zod_1.z.string().url().optional().or(zod_1.z.literal(''))
});
exports.updateBusinessSchema = exports.businessSchema.partial();
