const User = require('../models/User')
const Message = require('../common/messages/ConstantMessage')
const JsonResponse = require('../common/response/JsonResponse')

const userController = {
    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id)

            const { password, __v, updatedAt, createdAt, ...userData } = user._doc

            return res.status(200).send(JsonResponse(200, Message.FOUND_CUSTOMER_SUCCESS, userData))
        } catch (error) {
            return res.status(500).send(JsonResponse(500, Message.FOUND_CUSTOMER_SUCCESS, null))
        }
    },
}

module.exports = userController
