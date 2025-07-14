"use strict"

// const ProductService = require("../services/product.service")
const ProductServiceV2 = require("../services/product.service.xxx")
const { SuccessResponse } = require('../core/success.response')
class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Product success!',
            metadata: await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'update Product Successfully!',
            metadata: await ProductServiceV2.updateProduct(req.body.product_type,
                req.params.id,
                {
                    ...req.body,
                    product_shop: req.user.userId
                })
        }).send(res)
    }

    // PUT
    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Publish Product Successfully!',
            metadata: await ProductServiceV2.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Publish Product Successfully!',
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    // END PUT

    // QUERY
    // Get All Draft Products
    getAllDraftProductForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get All Draft Product For A Shop Successfully!',
            metadata: await ProductServiceV2.findAllDraftProductForShop({ product_shop: req.user.userId })
        }).send(res)
    }
    // Get All Publish Products
    getAllPublishProductForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get All Publish Product For A Shop Successfully!',
            metadata: await ProductServiceV2.findAllPublishProductForShop({ product_shop: req.user.userId })
        }).send(res)
    }
    // search Product
    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get List Search Product For Successfully!',
            metadata: await ProductServiceV2.getListSearchProduct(req.params)
        }).send(res)
    }
    // find all products
    getAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get All Products Successfully!',
            metadata: await ProductServiceV2.findAllProducts(req.query)
        }).send(res)
    }
    // find one product
    getOneProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get Product Successfully!',
            metadata: await ProductServiceV2.findProduct({ product_id: req.params.id })
        }).send(res)
    }
    // END QUERY
}
module.exports = new ProductController()