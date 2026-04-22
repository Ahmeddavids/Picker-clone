const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    menuName: {
        type: String,
        required: true
    },
    menuDescription: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        defaultValue: true
    },
    menuImage: {
        type: String
    }
}, {timeStamps: true});

const menuModel = mongoose.model('menus', menuSchema);

module.exports = menuModel;