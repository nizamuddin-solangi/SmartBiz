import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [totalUsers, totalBusinesses, totalBookings, activeBookings] = await Promise.all([
            prisma.user.count(),
            prisma.business.count(),
            prisma.booking.count(),
            prisma.booking.count({ where: { status: { in: ['PENDING', 'CONFIRMED'] } } })
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                totalUsers,
                totalBusinesses,
                totalBookings,
                activeBookings
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        res.status(200).json({
            status: 'success',
            data: { users }
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await prisma.user.delete({
            where: { id: req.params.id }
        });

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        next(error);
    }
};
