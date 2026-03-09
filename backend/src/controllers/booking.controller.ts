import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AppError } from '../utils/errors';
import { bookingSchema, updateBookingStatusSchema } from '../validators/booking';

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = bookingSchema.parse(req.body);

        if (!req.user) return next(new AppError('Unauthorized', 401));

        const booking = await prisma.booking.create({
            data: {
                ...validatedData,
                date: new Date(validatedData.date),
                customerId: req.user.id,
                status: 'PENDING'
            },
            include: {
                service: true,
                business: true
            }
        });

        res.status(201).json({
            status: 'success',
            data: { booking }
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};

export const getMyBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return next(new AppError('Unauthorized', 401));

        let bookings;
        if (req.user.role === 'BUSINESS') {
            bookings = await prisma.booking.findMany({
                where: { business: { userId: req.user.id } },
                include: { service: true, customer: { select: { name: true, email: true } } },
                orderBy: { date: 'desc' }
            });
        } else {
            bookings = await prisma.booking.findMany({
                where: { customerId: req.user.id },
                include: { service: true, business: true },
                orderBy: { date: 'desc' }
            });
        }

        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: { bookings }
        });
    } catch (error) {
        next(error);
    }
};

export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status } = updateBookingStatusSchema.parse(req.body);

        const booking = await prisma.booking.findUnique({
            where: { id: req.params.id },
            include: { business: true }
        });

        if (!booking) return next(new AppError('Booking not found', 404));

        // Only business owner can confirm/complete
        // Customer can only cancel their own
        const isOwner = booking.business.userId === req.user?.id;
        const isCustomer = booking.customerId === req.user?.id;

        if (!isOwner && !isCustomer) {
            return next(new AppError('Not authorized', 403));
        }

        if (isCustomer && status !== 'CANCELLED') {
            return next(new AppError('Customers can only cancel bookings', 403));
        }

        const updatedBooking = await prisma.booking.update({
            where: { id: req.params.id },
            data: { status },
            include: { service: true, business: true }
        });

        res.status(200).json({
            status: 'success',
            data: { booking: updatedBooking }
        });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return next(new AppError(error.errors[0].message, 400));
        }
        next(error);
    }
};
