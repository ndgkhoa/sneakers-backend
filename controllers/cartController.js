const Product = require('../models/Product')
const Cart = require('../models/Cart')
const Message = require('../common/messages/ConstantMessage')
const JsonResponse = require('../common/response/JsonResponse')

const cartController = {
    addCart: async (req, res) => {
        const userId = req.user.id
        const { cartItem, quantity } = req.body
        try {
            const cart = await Cart.findOne({ userId })
            if (cart) {
                const existingProduct = cart.products.find((product) => product.cartItem.toString() === cartItem)
                if (existingProduct) {
                    existingProduct.quantity += 1
                } else {
                    cart.products.push({ cartItem, quantity: 1 })
                }
                await cart.save()
                return res.status(200).send(JsonResponse(200, Message.ADD_ITEM_SUCCESS, null))
            } else {
                const newCart = new Cart({
                    userId,
                    products: [{ cartItem, quantity: 1 }],
                })
                await newCart.save()
                return res.status(200).send(JsonResponse(200, Message.ADD_ITEM_SUCCESS, null))
            }
        } catch (error) {
            return res.status(500).send(JsonResponse(500, Message.ADD_ITEM_FAIL, null))
        }
    },

    getCart: async (req, res) => {
        const userId = req.user.id
        try {
            const cart = await Cart.find({ userId })
            return res.status(200).send(JsonResponse(200, Message.FIND_PRODUCT, cart))
        } catch (error) {
            return res.status(500).send(JsonResponse(500, Message.EMPTY_CART, null))
        }
    },

    deleteCartItem: async (req, res) => {
        const cartItemId = req.params.cartItem
        try {
            const updatedCart = await Cart.findOneAndUpdate(
                { 'products._id': cartItemId },
                { $pull: { products: { _id: cartItemId } } },
                { new: true },
            )
            if (!updatedCart) {
                return res.status(404).send(JsonResponse(404, Message.NOT_FOUND_CART, null))
            }
            return res.status(200).send(JsonResponse(200, Message.DELETE_CART_SUCCESS, updatedCart))
        } catch (error) {
            return res.status(500).send(JsonResponse(500, Message.DELETE_CART_FAIL, null))
        }
    },
}

module.exports = cartController
