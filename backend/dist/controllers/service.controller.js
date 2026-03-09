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
exports.deleteService = exports.updateService = exports.getBusinessServices = exports.createService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const errors_1 = require("../utils/errors");
const service_1 = require("../validators/service");
const createService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const validatedData = service_1.serviceSchema.parse(req.body);
        const business = yield prisma_1.default.business.findUnique({
            where: { id: validatedData.businessId }
        });
        if (!business)
            return next(new errors_1.AppError('Business not found', 404));
        if (business.userId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return next(new errors_1.AppError('Only the business owner can add services', 403));
        }
        const service = yield prisma_1.default.service.create({
            data: validatedData
        });
        res.status(201).json({
            status: 'success',
            data: { service }
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return next(new errors_1.AppError(error.errors[0].message, 400));
        }
        next(error);
    }
});
exports.createService = createService;
const getBusinessServices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield prisma_1.default.service.findMany({
            where: { businessId: req.params.businessId }
        });
        res.status(200).json({
            status: 'success',
            results: services.length,
            data: { services }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getBusinessServices = getBusinessServices;
const updateService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const validatedData = service_1.updateServiceSchema.parse(req.body);
        const service = yield prisma_1.default.service.findUnique({
            where: { id: req.params.id },
            include: { business: true }
        });
        if (!service)
            return next(new errors_1.AppError('Service not found', 404));
        if (service.business.userId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return next(new errors_1.AppError('Not authorized', 403));
        }
        const updatedService = yield prisma_1.default.service.update({
            where: { id: req.params.id },
            data: validatedData
        });
        res.status(200).json({
            status: 'success',
            data: { service: updatedService }
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return next(new errors_1.AppError(error.errors[0].message, 400));
        }
        next(error);
    }
});
exports.updateService = updateService;
const deleteService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const service = yield prisma_1.default.service.findUnique({
            where: { id: req.params.id },
            include: { business: true }
        });
        if (!service)
            return next(new errors_1.AppError('Service not found', 404));
        if (service.business.userId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'ADMIN') {
            return next(new errors_1.AppError('Not authorized', 403));
        }
        yield prisma_1.default.service.delete({ where: { id: req.params.id } });
        res.status(204).json({
            status: 'success',
            data: null
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteService = deleteService;
