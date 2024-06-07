const User = require('../models/User')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')
const Message = require('../common/messages/ConstantMessage')
const JsonResponse = require('../common/response/JsonResponse')

const authController = {
    createUser: async (req, res) => {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString(),
            location: req.body.location,
        })
        try {
            await newUser.save()
            return res.status(201).send(JsonResponse(201, Message.CREATE_CUSTOMER_SUCCESS, null))
        } catch (error) {
            return res.status(500).send(JsonResponse(500, Message.CREATE_CUSTOMER_FAIL, null))
        }
    },

    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email })
            if (!user) return res.status(401).send(JsonResponse(401, Message.NOT_FOUND_CUSTOMER, null))

            const decryptedpass = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY)
            const thepassword = decryptedpass.toString(CryptoJS.enc.Utf8)

            if (thepassword !== req.body.password)
                return res.status(401).send(JsonResponse(401, Message.WRONG_PASSWORD, null))

            const userToken = jwt.sign(
                {
                    id: user._id,
                },
                process.env.JWT_PRIVATE_KEY,
                { expiresIn: '1h' },
            )

            const { password, __v, updatedAt, createdAt, ...others } = user._doc

            return res.status(200).send(JsonResponse(200, Message.LOGIN_SUCCESS, { ...others, token: userToken }))
        } catch (error) {
            return res.status(500).send(JsonResponse(500, Message.LOGIN_FAIL, null))
        }
    },
}
module.exports = authController
