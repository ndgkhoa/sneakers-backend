const Orders = require('../models/Order')

const orderController = {
    getUserOrders: async (req, res) => {
        const userId = req.user.userId
        try {
            const userOrders = await Orders.find({ userId })
                .populate({
                    path: 'productId',
                    select: '-sizes -oldPrice -description -category',
                })
                .exec()

            res.status(200).json(userOrders)
        } catch (error) {
            res.status(200).json({ message: 'Failed to get order' })
        }
    },
}
module.exports = orderController
