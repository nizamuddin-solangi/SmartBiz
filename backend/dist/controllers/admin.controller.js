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
exports.deleteUser = exports.getAllUsers = exports.getStats = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getStats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [totalUsers, totalBusinesses, totalBookings, activeBookings] = yield Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.business.count(),
            prisma_1.default.booking.count(),
            prisma_1.default.booking.count({ where: { status: { in: ['PENDING', 'CONFIRMED'] } } })
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
    }
    catch (error) {
        next(error);
    }
});
exports.getStats = getStats;
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma_1.default.user.findMany({
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
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsers = getAllUsers;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.user.delete({
            where: { id: req.params.id }
        });
        res.status(204).json({
            status: 'success',
            data: null
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;
