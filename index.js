const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const port = 3000

dotenv.config()
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('db connected'))
    .catch((err) => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))
