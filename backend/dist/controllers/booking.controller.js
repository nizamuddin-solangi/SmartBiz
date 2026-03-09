"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatus = exports.getMyBookings = exports.createBooking = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const errors_1 = require("../utils/errors");
const booking_1 = require("../validators/booking");
const createBooking = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = booking_1.bookingSchema.parse(req.body);
        if (!req.user)
            return next(new errors_1.AppError('Unauthorized', 401));
        const booking = yield prisma_1.default.booking.create({
            data: Object.assign(Object.assign({}, validatedData), { date: new Date(validatedData.date), customerId: req.user.id, status: 'PENDING' }),
            include: {
                service: true,
                business: true
            }
        });
        res.status(201).json({
            status: 'success',
            data: { booking }
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return next(new errors_1.AppError(error.errors[0].message, 400));
        }
        next(error);
    }
});
exports.createBooking = createBooking;
const getMyBookings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return next(new errors_1.AppError('Unauthorized', 401));
        let bookings;
        if (req.user.role === 'BUSINESS') {
            bookings = yield prisma_1.default.booking.findMany({
                where: { business: { userId: req.user.id } },
                include: { service: true, customer: { select: { name: true, email: true } } },
                orderBy: { date: 'desc' }
            });
        }
        else {
            bookings = yield prisma_1.default.booking.findMany({
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
    }
    catch (error) {
        next(error);
    }
});
exports.getMyBookings = getMyBookings;
const updateBookingStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { status } = booking_1.updateBookingStatusSchema.parse(req.body);
        const booking = yield prisma_1.default.booking.findUnique({
            where: { id: req.params.id },
            include: { business: true }
        });
        if (!booking)
            return next(new errors_1.AppError('Booking not found', 404));
        // Only business owner can confirm/complete
        // Customer can only cancel their own
        const isOwner = booking.business.userId === ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        const isCustomer = booking.customerId === ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        if (!isOwner && !isCustomer) {
            return next(new errors_1.AppError('Not authorized', 403));
        }
        if (isCustomer && status !== 'CANCELLED') {
            return next(new errors_1.AppError('Customers can only cancel bookings', 403));
        }
        const updatedBooking = yield prisma_1.default.booking.update({
            where: { id: req.params.id },
            data: { status },
            include: { service: true, business: true }
        });
        res.status(200).json({
            status: 'success',
            data: { booking: updatedBooking }
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return next(new errors_1.AppError(error.errors[0].message, 400));
        }
        next(error);
    }
});
exports.updateBookingStatus = updateBookingStatus;
