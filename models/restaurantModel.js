const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String,
    },
    otpExpiresAt: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'restaurant'
    }
}, {timeStamps: true});

const restaurantModel = mongoose.model('restaurants', restaurantSchema);

module.exports = restaurantModel;