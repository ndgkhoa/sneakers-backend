const Product = require('../models/Product')
const Message = require('../common/messages/ConstantMessage')
const JsonResponse = require('../common/response/JsonResponse')

const productController = {
    createProduct: async (req, res) => {
        const newProduct = new Product(req.body)
        try {
            await newProduct.save()
            return res.status(200).send(JsonResponse(200, Message.CREATE_PRODUCT_SUCCESS, null))
        } catch (error) {
            return res.status(500).send(JsonResponse(500, Message.CREATE_PRODUCT_FAIL, null))
        }
    },

    getAllProducts: async (req, res) => {
        try {
            const products = await Product.find().sort({ createdAt: -1 })
            return res.status(200).send(JsonResponse(200, Message.FIND_PRODUCT, products))
        } catch (error) {
            return res.status(500).send(JsonResponse(500, Message.NOT_FOUND_PRODUCT, null))
        }
    },

    getProduct: async (req, res) => {
        const productId = req.params.id
        try {
            const product = await Product.findById(productId)
            const { __v, createdAt, ...productData } = product._doc
            return res.status(200).send(JsonResponse(200, Message.FIND_PRODUCT, productData))
        } catch (error) {
            return res.status(500).send(JsonResponse(500, Message.NOT_FOUND_PRODUCT, null))
        }
    },

    searchProducts: async (req, res) => {
        try {
            const results = await Product.aggregate([
                {
                    $search: {
                        index: 'default',
                        text: {
                            query: req.params.key,
                            path: {
                                wildcard: '*',
                            },
                        },
                    },
                },
            ])
            return res.status(200).send(JsonResponse(200, Message.FIND_PRODUCT, results))
        } catch (error) {
            return res.status(500).send(JsonResponse(500, Message.NOT_FOUND_PRODUCT, null))
        }
    },
}
module.exports = productController
