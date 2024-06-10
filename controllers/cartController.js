const Product = require('../models/Product')
const Cart = require('../models/Cart')

const cartController = {
    addCart: async (req, res) => {
        const userId = req.user.id
        const { cartItem, quantity, size } = req.body

        try {
            const product = await Product.findById(cartItem)
            if (!product) {
                return res.status(404).json({ message: 'Product not found' })
            }

            cart = new Cart({
                userId,
                products: [{ cartItem, quantity, size }],
            })

            await cart.save()
            res.status(200).json('Product added to cart')
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Internal Server Error', error: error.message })
        }
    },

    getCart: async (req, res) => {
        const userId = req.user.id
        try {
            const cart = await Cart.find({ userId }).populate('products.cartItem', '_id name imageUrl price category')
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found for this user' })
            }
            res.status(200).json(cart)
        } catch (error) {
            console.error('Error fetching cart:', error)
            res.status(500).json({ message: 'Internal server error' })
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
                return res.status(404).json({ message: 'cart item not found' })
            }
            res.status(200).json(updatedCart)
        } catch (error) {
            res.status(500).json(error)
        }
    },
}

module.exports = cartController
