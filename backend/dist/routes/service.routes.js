"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const service_controller_1 = require("../controllers/service.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.protect, (0, auth_1.authorize)('BUSINESS'), service_controller_1.createService);
router.get('/business/:businessId', service_controller_1.getBusinessServices);
router.route('/:id')
    .put(auth_1.protect, service_controller_1.updateService)
    .delete(auth_1.protect, service_controller_1.deleteService);
exports.default = router;
