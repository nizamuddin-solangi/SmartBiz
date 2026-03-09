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
exports.deleteBusiness = exports.updateBusiness = exports.getBusiness = exports.getBusinesses = exports.createBusiness = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const errors_1 = require("../utils/errors");
const business_1 = require("../validators/business");
const createBusiness = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = business_1.businessSchema.parse(req.body);
        if (!req.user)
            return next(new errors_1.AppError('Unauthorized', 401));
        const business = yield prisma_1.default.business.create({
            data: Object.assign(Object.assign({}, validatedData), { userId: req.user.id })
        });
        res.status(201).json({
            status: 'success',
            data: { business }
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return next(new errors_1.AppError(error.errors[0].message, 400));
        }
        next(error);
    }
});
exports.createBusiness = createBusiness;
const getBusinesses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, search } = req.query;
        const businesses = yield prisma_1.default.business.findMany({
            where: {
                AND: [
                    category ? { category: String(category) } : {},
                    search ? {
                        OR: [
                            { name: { contains: String(search), mode: 'insensitive' } },
                            { description: { contains: String(search), mode: 'insensitive' } }
                        ]
                    } : {}
                ]
            },
            include: {
                _count: { select: { reviews: true } }
            }
        });
        res.status(200).json({
            status: 'success',
            results: businesses.length,
            data: { businesses }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getBusinesses = getBusinesses;
const getBusiness = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const business = yield prisma_1.default.business.findUnique({
            where: { id: req.params.id },
            include: {
                services: true,
                reviews: {
                    include: { customer: { select: { name: true, profileImage: true } } }
                }
            }
        });
        if (!business) {
            return next(new errors_1.AppError('Business not found', 404));
        }
        res.status(200).json({
            status: 'success',
            data: { business }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getBusiness = getBusiness;
const updateBusiness = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const validatedData = business_1.updateBusinessSchema.parse(req.body);
        const business = yield prisma_1.default.business.findUnique({
            where: { id: req.params.id }
        });
        if (!business)
            return next(new errors_1.AppError('Business not found', 404));
        // Authorization check
        if (business.userId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'ADMIN') {
            return next(new errors_1.AppError('Not authorized', 403));
        }
        const updatedBusiness = yield prisma_1.default.business.update({
            where: { id: req.params.id },
            data: validatedData
        });
        res.status(200).json({
            status: 'success',
            data: { business: updatedBusiness }
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return next(new errors_1.AppError(error.errors[0].message, 400));
        }
        next(error);
    }
});
exports.updateBusiness = updateBusiness;
const deleteBusiness = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const business = yield prisma_1.default.business.findUnique({
            where: { id: req.params.id }
        });
        if (!business)
            return next(new errors_1.AppError('Business not found', 404));
        if (business.userId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'ADMIN') {
            return next(new errors_1.AppError('Not authorized', 403));
        }
        yield prisma_1.default.business.delete({ where: { id: req.params.id } });
        res.status(204).json({
            status: 'success',
            data: null
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteBusiness = deleteBusiness;
