"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = require("../controllers/booking.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.protect);
router.route('/')
    .get(booking_controller_1.getMyBookings)
    .post(booking_controller_1.createBooking);
router.patch('/:id/status', booking_controller_1.updateBookingStatus);
exports.default = router;
