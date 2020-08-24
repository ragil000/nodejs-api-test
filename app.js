const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const productRoute = require('./api/routes/productRoute')
const orderRoute = require('./api/routes/orderRoute')
const userRoute = require('./api/routes/userRoute')
const { response, request } = require('express')

const mongodbUrl = process.env.MONGODB_URL 
mongoose.connect('mongodb:'+mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = global.Promise

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// handle CORS
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if(request.method === 'OPTIONS') {
        response.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return response.status(200).json({})
    }
    next()
})

app.use('/products', productRoute)
app.use('/orders', orderRoute)
app.use('/users', userRoute)

// handle error
app.use((request, response, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, request, response, next) => {
    response.status(error.status || 500)
    response.json({
        error: {
            message: error.message || 'Server error'
        }
    })
})

module.exports = app