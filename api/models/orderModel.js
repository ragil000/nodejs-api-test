const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        default: 1
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('Order', orderSchema)