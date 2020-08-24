const Order = require('../models/orderModel')
const Product = require('../models/productModel')

exports.order_get = (request, response, next) => {
    Order.find()
        .select('_id product quantity createdAt updatedAt')
        .populate('product', 'name price')
        .then((results) => {
            if(results.length !== 0) {
                response.status(200).json({
                    status: true,
                    message: 'Order were fetched',
                    orders: results.map((result) => {
                        return {
                            _id: result._id,
                            product: result.product,
                            quantity: result.quantity,
                            createdAt: result.createdAt,
                            updatedAt: result.updatedAt,
                            request: {
                                type: 'GET',
                                url: process.env.BASE_URL+'/orders/'+result._id
                            }
                        }
                    })
                })
            }else {
                response.status(200).json({
                    status: false,
                    message: 'Product is empty'
                })
            }
        })
        .catch((error) => {
            console. log(error)
            response.status(500).json({
                status: false,
                message: error.message
            })
        })
}

exports.order_post = (request, response, next) => {
    Product.findById(request.body.productId)
        .then((result) => {
            const order = new Order({
                product: request.body.productId,
                quantity: request.body.quantity
            })

            return order.save()
        })
        .then((result) => {
            response.status(201).json({
                status: true,
                message: 'Order was created',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity,
                    createdAt: result.createdAt,
                    updatedAt: result.updatedAt,
                    request: {
                        type: 'GET',
                        url: process.env.BASE_URL+'/orders/'+result._id
                    } 
                }
            })
        })
        .catch((error) => {
            console.log(error)
            response.status(500).json({
                status: false,
                message: error.message
            })
        })
}

exports.order_details = (request, response, next) => {
    const orderId = request.params.orderId
    Order.findById(orderId)
        .select('_id name price')
        .populate('product', 'name price')
        .exec()
        .then((result ) => {
            response.status(200).json({
                status: true,
                message: 'Order details',
                order: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity,
                    createdAt: result.createdAt,
                    updatedAt: result.updatedAt,
                    request: {
                        type: 'GET',
                        url: process.env.BASE_URL+'/orders/'+result._id
                    }
                }
            })
        })
        .catch((error) => {
            console.log(error);
            response.json({
                status: false,
                message: error.message
            })
        })
}

exports.order_patch = (request, response, next) => {
    const orderId = request.params.orderId
    const updateOps = {}
    
    for(const [key, value] of Object.entries(request.body)) {
        updateOps[key] = value
    }

    Product.findById({ _id: updateOps['product'] })
        .exec()
        .then((result) => {
            Order.update({ _id: orderId }, { $set: updateOps })
                .exec()
                .then((result) => {
                    response.status(200).json({
                        status: true,
                        message: 'Order was updated',
                        request: {
                            type: 'GET',
                            url: process.env.BASE_URL+'/orders/'+orderId
                        }
                    })
                })
                .catch((error) => {
                    console.log(error)
                    response.status(500).json({
                        status: false,
                        message: error.message
                    })
                })
        })
        .catch((error) => {
            console.log(error)
            response.status(500).json({
                status: false,
                message: error.message
            })
        })
}

exports.order_delete = (request, response, next) => {
    const orderId = request.params.orderId
    Order.remove({ _id: orderId })
        .then((result) => {
            response.status(204).json({
                status: true,
                message: 'Product was deleted',
                request: {
                    type: 'GET',
                    url: process.env.BASE_URL+'/orders'
                }
            })
        })
        .catch((error) => {
            response.status(500).json({
                status: false,
                message: error.message
            })
        })
}