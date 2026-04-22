const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurants'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    menuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'menus'
    },
    quantity: {
        type: Number
    },
    total: {
        type: Number
    },
    reference: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'failed', 'successful', 'processing'],
        default: 'pending'
    }
    
}, {timeStamps: true});

const orderModel = mongoose.model('orders', orderSchema);

module.exports = orderModel;