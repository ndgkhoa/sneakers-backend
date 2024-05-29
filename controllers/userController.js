const User = require('../models/User')

const userController = {
    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id)

            const { password, __v, updatedAt, createdAt, ...userData } = user._doc

            res.status(200).json(userData)
        } catch (error) {
            res.status(500).json(error)
        }
    },
}

module.exports = userController
