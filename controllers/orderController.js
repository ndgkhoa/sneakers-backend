const mongoose = require('mongoose')
const Order = require('../models/Order')

const orderController = {
    getUserOrders: async (req, res) => {
        const userId = req.user.id
        try {
            if (!userId) {
                return res.status(400).json({ message: 'Invalid user ID' })
            }

            const userOrders = await Order.find({ userId })

            if (!userOrders.length) {
                return res.status(200).json({ message: 'No orders found' })
            }

            res.status(200).json(userOrders)
        } catch (error) {
            console.error('Error fetching user orders:', error)
            res.status(500).json({ message: 'Failed to get orders' })
        }
    },

    createOrder: async (req, res) => {
        const { userId, customerId, productId, quantity, subtotal, payment_status, total } = req.body
        if (!userId || !customerId || !productId || !quantity || !subtotal || !payment_status || !total) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const newOrder = new Order({
            userId,
            customerId,
            productId,
            quantity,
            subtotal,
            payment_status,
            total,
        })

        try {
            const savedOrder = await newOrder.save()
            res.status(201).json(savedOrder)
        } catch (error) {
            res.status(500).json({ message: 'Failed to create order' })
        }
    },
}

module.exports = orderController
