import { z } from 'zod';

export const bookingSchema = z.object({
    serviceId: z.string().uuid('Invalid service ID'),
    businessId: z.string().uuid('Invalid business ID'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    timeSlot: z.string().min(1, 'Time slot is required')
});

export const updateBookingStatusSchema = z.object({
    status: z.string()
});
