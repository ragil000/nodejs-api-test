const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/checkAuth')

const orderController = require('../controllers/orderController')

router.get('/', checkAuth, orderController.order_get)

router.post('/', checkAuth, orderController.order_post)

router.get('/:orderId', checkAuth, orderController.order_details)

router.patch('/:orderId', checkAuth, orderController.order_patch)

router.delete('/:orderId', checkAuth, orderController.order_delete)

module.exports = router