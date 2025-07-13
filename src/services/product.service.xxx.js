const { product, clothing, electronics, furniture } = require("../models/product.model")
const { BadRequestError } = require("../core/error.response")
const {
    findAllDraftProductForShop,
    publishProductByShop,
    findAllPublicProductForShop } = require("../models/repositories/product.repo")
// Define Factory Class
class ProductFactory {


    static productRegistry = {}

    static registeredProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        // get class by type
        const ProductClass = ProductFactory.productRegistry[type]
        if (!ProductClass) throw new BadRequestError("Cannot find product with type:" + type)

        return new ProductClass(payload).createProduct()
    }

    // PUT
    static async publishProductByShop({ product_shop, product_id }) {

        return await publishProductByShop({ product_shop, product_id })

    }
    // END PUT


    // QUERY
    // query list of draft products
    static async findAllDraftProductForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }

        return await findAllDraftProductForShop({ query, skip, limit })
    }
    // query publish product
    static async findAllPublishProductForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublish: true }

        return await findAllPublicProductForShop({ query, skip, limit })
    }
    // END QUERY
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

// define Electronics Class
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture)
            throw new BadRequestError("Error While Creating New Furniture Product")

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError("Error While Create New Product::[Inside Furniture Class]")

        return newProduct;
    }
}

// register product 
ProductFactory.registeredProductType("Electronics", Electronics)
ProductFactory.registeredProductType("Clothing", Clothing)
ProductFactory.registeredProductType("Furniture", Furniture)

module.exports = ProductFactory