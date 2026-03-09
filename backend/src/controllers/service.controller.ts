import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AppError } from '../utils/errors';
import { serviceSchema, updateServiceSchema } from '../validators/service';

export const createService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = serviceSchema.parse(req.body);

        const business = await prisma.business.findUnique({
            where: { id: validatedData.businessId }
        });

        if (!business) return next(new AppError('Business not found', 404));

        if (business.userId !== req.user?.id) {
            return next(new AppError('Only the business owner can add services', 403));
        }

        const service = await prisma.service.create({
            data: validatedData
        });

        res.status(201).json({
            status: 'success',
            data: { service }
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

export const getBusinessServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const services = await prisma.service.findMany({
            where: { businessId: req.params.businessId }
        });

        res.status(200).json({
            status: 'success',
            results: services.length,
            data: { services }
        });
    } catch (error) {
        next(error);
    }
};

export const updateService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = updateServiceSchema.parse(req.body);

        const service = await prisma.service.findUnique({
            where: { id: req.params.id },
            include: { business: true }
        });

        if (!service) return next(new AppError('Service not found', 404));

        if (service.business.userId !== req.user?.id) {
            return next(new AppError('Not authorized', 403));
        }

        const updatedService = await prisma.service.update({
            where: { id: req.params.id },
            data: validatedData
        });

        res.status(200).json({
            status: 'success',
            data: { service: updatedService }
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const service = await prisma.service.findUnique({
            where: { id: req.params.id },
            include: { business: true }
        });

        if (!service) return next(new AppError('Service not found', 404));

        if (service.business.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
            return next(new AppError('Not authorized', 403));
        }

        await prisma.service.delete({ where: { id: req.params.id } });

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        next(error);
    }
};
