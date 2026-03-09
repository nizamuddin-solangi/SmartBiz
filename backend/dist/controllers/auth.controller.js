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
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
const errors_1 = require("../utils/errors");
const auth_1 = require("../validators/auth");
const generateToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ userId, role }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = auth_1.registerSchema.parse(req.body);
        const userExists = yield prisma_1.default.user.findUnique({
            where: { email: validatedData.email }
        });
        if (userExists) {
            return next(new errors_1.AppError('User already exists', 400));
        }
        const hashedPassword = yield bcrypt_1.default.hash(validatedData.password, 12);
        const user = yield prisma_1.default.user.create({
            data: Object.assign(Object.assign({}, validatedData), { password: hashedPassword }),
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });
        const token = generateToken(user.id, user.role);
        res.status(201).json({
            status: 'success',
            token,
            data: { user }
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return next(new errors_1.AppError(error.errors[0].message, 400));
        }
        next(error);
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = auth_1.loginSchema.parse(req.body);
        const user = yield prisma_1.default.user.findUnique({
            where: { email: validatedData.email }
        });
        if (!user || !(yield bcrypt_1.default.compare(validatedData.password, user.password))) {
            return next(new errors_1.AppError('Invalid email or password', 401));
        }
        const token = generateToken(user.id, user.role);
        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return next(new errors_1.AppError(error.errors[0].message, 400));
        }
        next(error);
    }
});
exports.login = login;
