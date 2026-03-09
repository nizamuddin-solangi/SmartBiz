"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const business_controller_1 = require("../controllers/business.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.route('/')
    .get(business_controller_1.getBusinesses)
    .post(auth_1.protect, (0, auth_1.authorize)('BUSINESS', 'ADMIN'), business_controller_1.createBusiness);
router.route('/:id')
    .get(business_controller_1.getBusiness)
    .put(auth_1.protect, business_controller_1.updateBusiness)
    .delete(auth_1.protect, business_controller_1.deleteBusiness);
exports.default = router;
