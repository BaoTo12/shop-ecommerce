const { product, clothing, electronics, furniture } = require("../models/product.model")
const { BadRequestError } = require("../core/error.response")
const {
    findAllDraftProductForShop,
    publishProductByShop,
    findAllPublicProductForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById } = require("../models/repositories/product.repo")
const { removeFalseField } = require("../utils")
// Define Factory Class
class ProductFactory {


    static productRegistry = {}

    static registeredProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }
    //* create
    static async createProduct(type, payload) {
        // get class by type
        const ProductClass = ProductFactory.productRegistry[type]
        if (!ProductClass) throw new BadRequestError("Cannot find product with type:" + type)

        return new ProductClass(payload).createProduct()
    }

    //* update
    static async updateProduct(type, product_id, payload) {
        // get class by type
        const ProductClass = ProductFactory.productRegistry[type]
        if (!ProductClass) throw new BadRequestError("Cannot find product with type:" + type)
        console.log({ payload });

        return new ProductClass(payload).updateProduct(product_id)
    }

    //* PUT
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }
    //* END PUT


    //* QUERY
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
    // search Product
    static async getListSearchProduct({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }
    // find All Products
    static async findAllProducts({ limit = 50, sort = "ctime", page = 1, filter = { isPublish: true } }) {
        return await findAllProducts({
            limit, sort, page, filter,
            select: ["product_name", "product_price", "product_thumb"]
        })
    }
    // find product
    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ["__v"] })
    }
    //* END QUERY
}

// define Base Class
class Product {
    constructor({
        product_name, product_thumb,
        product_description, product_price,
        product_type, product_shop, product_attributes, product_quantity,
        product_variations
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
        this.product_quantity = product_quantity
        this.product_variations = product_variations
    }
    // create new product
    async createProduct(product_id) {
        return await product.create({
            ...this,
            _id: product_id
        })
    }
    // update
    async updateProduct(product_id, payload) {
        return await updateProductById({ product_id, payload, model: product })
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

    async updateProduct(product_id) {
        // remove all fields has falsy values\
        console.log("BEFORE", this);
        const objectParams = removeFalseField(this);
        console.log("AFTER", this);

        // check where to update, if the payload has attributes object --> update both parent and child classes
        if (objectParams.product_attributes) {
            // update child
            await updateProductById({ product_id, payload: objectParams.product_attributes, model: clothing })
        }

        const updateProduct = await super.updateProduct(product_id, objectParams)

        return updateProduct
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