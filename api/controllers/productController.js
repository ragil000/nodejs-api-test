const Product = require('../models/productModel')

exports.product_get = (request, response, next) => {
    Product.find()
        .select('_id name price productImage createdAt updatedAt')
        .then((results) => {
            if(results.length !== 0) {
                response.status(200).json({
                    status: true,
                    message: 'Products were fetched',
                    products: results.map((result) => {
                        return {
                            _id: result._id,
                            name: result.name,
                            price: result.price,
                            productImage: result.productImage,
                            createdAt: result.createdAt,
                            updatedAt: result.updatedAt,
                            request: {
                                type: 'GET',
                                url: process.env.BASE_URL+'/products/'+result._id
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

exports.product_post = (request, response, next) => {
    // console.log(request.file.filename)
    const product = new Product({
        name: request.body.name,
        price: request.body.price,
        productImage: request.file.filename
    })
    product.save()
        .then((result) => {
            response.status(201).json({
                status: true,
                message: 'Product was created',
                createdProduct: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    productImage: result.productImage,
                    createdAt: result.createdAt,
                    updatedAt: result.updatedAt,
                    request: {
                        type: 'GET',
                        url: process.env.BASE_URL+'/products/'+result._id
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

exports.product_details = (request, response, next) => {
    const productId = request.params.productId
    Product.findById(productId)
        .select('_id name price productImage')
        .exec()
        .then((result ) => {
            response.status(200).json({
                status: true,
                message: 'Product details',
                product: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    productImage: result.productImage,
                    createdAt: result.createdAt,
                    updatedAt: result.updatedAt,
                    request: {
                        type: 'GET',
                        url: process.env.BASE_URL+'/products/'+result._id
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

exports.product_patch = (request, response, next) => {
    const productId = request.params.productId
    const updateOps = {}
    
    for(const [key, value] of Object.entries(request.body)) {
        updateOps[key] = value
    }

    Product.update({ _id: productId }, { $set: updateOps })
        .exec()
        .then((result) => {
            response.status(200).json({
                status: true,
                message: 'Product was updated',
                request: {
                    type: 'GET',
                    url: process.env.BASE_URL+'/products/'+productId
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

exports.product_delete = (request, response, next) => {
    const productId = request.params.productId
    Product.remove({ _id: productId })
        .then((result) => {
            response.status(204).json({
                status: true,
                message: 'Product was deleted',
                request: {
                    type: 'GET',
                    url: process.env.BASE_URL+'/products'
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