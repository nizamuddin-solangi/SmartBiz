import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AppError } from '../utils/errors';
import { businessSchema, updateBusinessSchema } from '../validators/business';

export const createBusiness = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = businessSchema.parse(req.body);

        if (!req.user) return next(new AppError('Unauthorized', 401));

        const business = await prisma.business.create({
            data: {
                ...validatedData,
                userId: req.user.id
            }
        });

        res.status(201).json({
            status: 'success',
            data: { business }
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

export const getBusinesses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { category, search } = req.query;

        const businesses = await prisma.business.findMany({
            where: {
                AND: [
                    category ? { categories: { some: { name: String(category) } } } : {},
                    search ? {
                        OR: [
                            { name: { contains: String(search) } },
                            { description: { contains: String(search) } }
                        ]
                    } : {}
                ]
            },
            include: {
                categories: true,
                _count: { select: { reviews: true } }
            }
        });

        res.status(200).json({
            status: 'success',
            results: businesses.length,
            data: { businesses }
        });
    } catch (error) {
        next(error);
    }
};

export const getBusiness = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const business = await prisma.business.findUnique({
            where: { id: req.params.id },
            include: {
                categories: true,
                services: true,
                reviews: {
                    include: { customer: { select: { name: true, profileImage: true } } }
                }
            }
        });

        if (!business) {
            return next(new AppError('Business not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { business }
        });
    } catch (error) {
        next(error);
    }
};

export const updateBusiness = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = updateBusinessSchema.parse(req.body);

        const business = await prisma.business.findUnique({
            where: { id: req.params.id }
        });

        if (!business) return next(new AppError('Business not found', 404));

        // Authorization check
        if (business.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
            return next(new AppError('Not authorized', 403));
        }

        const updatedBusiness = await prisma.business.update({
            where: { id: req.params.id },
            data: validatedData
        });

        res.status(200).json({
            status: 'success',
            data: { business: updatedBusiness }
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

export const deleteBusiness = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const business = await prisma.business.findUnique({
            where: { id: req.params.id }
        });

        if (!business) return next(new AppError('Business not found', 404));

        if (business.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
            return next(new AppError('Not authorized', 403));
        }

        await prisma.business.delete({ where: { id: req.params.id } });

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        next(error);
    }
};
