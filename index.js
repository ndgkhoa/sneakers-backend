const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const productRoute = require('./routes/product')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const orderRoute = require('./routes/order')
const port = 8080

dotenv.config()
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('db connected'))
    .catch((err) => console.log(err))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

app.use('/api/', authRoute)
app.use('/api/products', productRoute)
app.use('/api/users', userRoute)
app.use('/api/orders', orderRoute)

app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${process.env.PORT}!`))
