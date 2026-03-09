"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("../controllers/review.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.protect, review_controller_1.createReview);
router.get('/business/:businessId', review_controller_1.getBusinessReviews);
exports.default = router;
