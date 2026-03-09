"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatusSchema = exports.bookingSchema = void 0;
const zod_1 = require("zod");
exports.bookingSchema = zod_1.z.object({
    serviceId: zod_1.z.string().uuid('Invalid service ID'),
    businessId: zod_1.z.string().uuid('Invalid business ID'),
    date: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    timeSlot: zod_1.z.string().min(1, 'Time slot is required')
});
exports.updateBookingStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])
});
