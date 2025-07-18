"use strict"
const express = require("express")
const productController = require("../../controllers/product.controller")
const asyncHandler = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")
const router = express.Router()

// search product
router.get("/search/:keySearch", asyncHandler(productController.getListSearchProduct))
router.get("", asyncHandler(productController.getAllProducts))
router.get("/:id", asyncHandler(productController.getOneProduct))

// authentication
router.use(authenticationV2)

router.post("", asyncHandler(productController.createProduct))
router.patch("/:id", asyncHandler(productController.updateProduct))
router.post("/publish/:id", asyncHandler(productController.publishProductByShop))
router.post("/unpublish/:id", asyncHandler(productController.unPublishProductByShop))

// QUERY
router.get("/draft/all", asyncHandler(productController.getAllDraftProductForShop))
router.get("/publish/all", asyncHandler(productController.getAllPublishProductForShop))
// END QUERY

module.exports = router