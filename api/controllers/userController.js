const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

exports.user_signup = (request, response, next) => {
    User.find({ email: request.body.email })
        .exec()
        .then((result) => {
            if(result.length > 0) {
                return response.status(409).json({
                    status: false,
                    message: "Email exists"
                })
            }else {
                bcrypt.hash(request.body.password, 10, (error, hash) => {
                    if(error) {
                        return response.status(500).json({
                            error: error
                        })
                    }else {
                        const user = new User({
                            email: request.body.email,
                            password: hash
                        })
                        user.save()
                            .then((result) => {
                                response.status(201).json({
                                    status: true,
                                    message: 'user was created'
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
                })
            }
        })
        .catch((error) => {
            console.log(error)
            response.status(500).json({
                status: false,
                message: error.message
            })
        })
}

exports.user_login = (request, response, next) => {
    User.find({ email: request.body.email })
        .exec()
        .then((result) => {
            if(result.length > 0) {
                bcrypt.compare(request.body.password, result[0].password, (error, success) => {
                    if(error) {
                        return response.status(401).json({
                            status: false,
                            message: 'Pasword not valid'
                        })
                    }

                    if(success) {
                        const token = jwt.sign({
                            email: result[0].email,
                            userId: result[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        })
                        
                        return response.status(200).json({
                            status: true,
                            message: 'Auth successful',
                            token: token
                        })
                    }

                    response.status(401).json({
                        status: false,
                        message: 'Pasword not valid'
                    })

                })
            }else {
                return response.status(404).json({
                    status: false,
                    message: 'Mail not found, user doesn\'t exist'
                })
            }
        })
        .catch((error) => {
            console.log(error)
            response.status(500).json({
                status: false,
                message: error.message
            })
        })
}

exports.user_delete = (request, response, next) => {
    User.remove({ _id: request.params.userId })
        .then((result) => {
            response.status(200).json({
                status: true,
                message: "user was deleted"
            })
        })
        .catch((error) => {
            console.log(erro)
            response.status(500).json({
                status: false,
                message: error.message
            })
        })
}