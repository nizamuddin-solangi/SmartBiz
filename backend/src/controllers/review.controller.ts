import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma';
import { AppError } from '../utils/errors';

const reviewSchema = z.object({
    businessId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(5)
});

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = reviewSchema.parse(req.body);

        if (!req.user) return next(new AppError('Unauthorized', 401));

        // Check if customer has a completed booking with this business
        const booking = await prisma.booking.findFirst({
            where: {
                customerId: req.user.id,
                businessId: validatedData.businessId,
                status: 'COMPLETED'
            }
        });

        if (!booking && req.user.role !== 'ADMIN') {
            return next(new AppError('You can only review businesses you have booked and completed services with', 403));
        }

        const review = await prisma.review.create({
            data: {
                ...validatedData,
                customerId: req.user.id
            }
        });

        res.status(201).json({
            status: 'success',
            data: { review }
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

export const getBusinessReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { businessId: req.params.businessId },
            include: { customer: { select: { name: true, profileImage: true } } },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            status: 'success',
            results: reviews.length,
            data: { reviews }
        });
    } catch (error) {
        next(error);
    }
};
