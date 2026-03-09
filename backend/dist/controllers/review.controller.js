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
exports.getBusinessReviews = exports.createReview = void 0;
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../config/prisma"));
const errors_1 = require("../utils/errors");
const reviewSchema = zod_1.z.object({
    businessId: zod_1.z.string().uuid(),
    rating: zod_1.z.number().int().min(1).max(5),
    comment: zod_1.z.string().min(5)
});
const createReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = reviewSchema.parse(req.body);
        if (!req.user)
            return next(new errors_1.AppError('Unauthorized', 401));
        // Check if customer has a completed booking with this business
        const booking = yield prisma_1.default.booking.findFirst({
            where: {
                customerId: req.user.id,
                businessId: validatedData.businessId,
                status: 'COMPLETED'
            }
        });
        if (!booking && req.user.role !== 'ADMIN') {
            return next(new errors_1.AppError('You can only review businesses you have booked and completed services with', 403));
        }
        const review = yield prisma_1.default.review.create({
            data: Object.assign(Object.assign({}, validatedData), { customerId: req.user.id })
        });
        res.status(201).json({
            status: 'success',
            data: { review }
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return next(new errors_1.AppError(error.errors[0].message, 400));
        }
        next(error);
    }
});
exports.createReview = createReview;
const getBusinessReviews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield prisma_1.default.review.findMany({
            where: { businessId: req.params.businessId },
            include: { customer: { select: { name: true, profileImage: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({
            status: 'success',
            results: reviews.length,
            data: { reviews }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getBusinessReviews = getBusinessReviews;
