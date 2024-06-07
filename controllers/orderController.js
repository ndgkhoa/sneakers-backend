const Orders = require('../models/Order')
const Message = require('../common/messages/ConstantMessage')
const JsonResponse = require('../common/response/JsonResponse')

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

            return res.status(200).send(JsonResponse(200, Message.ADD_ORDER_SUCCESS, userOrders))
        } catch (error) {
            return res.status(500).send(JsonResponse(500, Message.ADD_ORDER_FAIL, null))
        }
    },
}
module.exports = orderController
