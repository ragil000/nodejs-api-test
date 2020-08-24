const express = require('express')
const router = express.Router()
const multer = require('multer')
const checkAuth = require('../middleware/checkAuth')
const productController = require('../controllers/productController')
const storage = multer.diskStorage({
    destination: function (request, response, callback) {
        callback(null, './uploads/')
    },
    filename: function(request, response, callback) {
        let mimetype = response.mimetype.split('/')
        let filetype = mimetype[1]

        callback(null, new Date().getTime()+'.'+filetype)
    }
})

const fileFilter = (request, response, callback) => {
    // reject a file
    if(response.mimetype === 'image/jpeg' || response.mimetype === 'image/png') {
        callback(null, true)
    }else {
        callback(new Error('image type nonvalid'), false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

router.get('/', checkAuth, productController.product_get)

router.post('/', checkAuth, upload.single('productImage'), productController.product_post)

router.get('/:productId', checkAuth, productController.product_details)

router.patch('/:productId', checkAuth, productController.product_patch)

router.delete('/:productId', checkAuth, productController.product_delete)

module.exports = router