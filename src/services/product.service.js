const { product, clothing, electronics } = require("../models/product.model")
const { BadRequestError } = require("../core/error.response")
// Define Factory Class
class ProductFactory {
    static async createProduct(type, payload) {
        switch (type) {
            case "Electronics":
                return new Electronics(payload).createProduct()
            case "Clothing":
                return new Clothing(payload).createProduct()
            default:
                throw new BadRequestError("Cannot find product with type:" + type)
        }
    }
}

// define Base Class
class Product {
    constructor({
        product_name, product_thumb,
        product_description, product_price,
        product_type, product_shop, product_attributes, product_quantity
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
        this.product_quantity = product_quantity
    }
    // create new product
    async createProduct(product_id) {
        return await product.create({
            ...this,
            _id: product_id
        })
    }
}

// define Clothing Class
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing)
            throw new BadRequestError("Error While Creating New Clothing Product")

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError("Error While Create New Product::[Inside Clothing Class]")

        return newProduct;
    }
}
// define Electronics Class
class Electronics extends Product {
    async createProduct() {
        const newElectronics = await electronics.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronics)
            throw new BadRequestError("Error While Creating New Electronics Product")

        const newProduct = await super.createProduct(newElectronics._id)
        if (!newProduct) throw new BadRequestError("Error While Create New Product::[Inside Electronics Class]")

        return newProduct;
    }
}

module.exports = ProductFactory