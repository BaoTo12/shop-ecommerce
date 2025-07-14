"use strict"
const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const discountController = require("../../controllers/discount.controller");
const router = express.Router();

router.post("/amount", asyncHandler(discountController.getDiscountAmount))
router.get("/listProduct", asyncHandler(discountController.getAllProductsWithDiscountCode))


router.post("", asyncHandler(discountController.createDiscountCode))
router.get("", asyncHandler(discountController.getAllProductsWithDiscountCode))

module.exports = router