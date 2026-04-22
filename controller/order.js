const userModel = require('../models/userModel');
const menuModel = require('../models/menuModel');
const orderModel = require('../models/order');
const otpGen = require('otp-generator');
const reference = otpGen.generate(10, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
const axios = require('axios');

exports.placeOrder = async (req, res) => {
    try {
        const { id } = req.user;
        const { menuId } = req.params;
        const { quantity } = req.body;
        const user = await userModel.findById(id);
        console.log("my user: ", user)
        const menu = await menuModel.findById(menuId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        };

        if (!menu) {
            return res.status(404).json({
                message: "Menu not found"
            })
        };

        const payload = {
            amount: menu.amount * quantity,
            customer: {
                email: user.email,
                name: user.name
            },
            redirect_url: 'https://www.google.com',
            currency: 'NGN',
            reference: reference
        };

        const { data } = await axios.post('https://api.korapay.com/merchant/api/v1/charges/initialize', payload, {
            headers: {
                Authorization:  `Bearer ${process.env.KORA_SK}`
            }
        });

        const order = new orderModel({
            restaurantId : menu.restaurantId,
            userId: user._id,
            menuId: menu._id,
            quantity,
            total: menu.amount * quantity,
            reference: data.data.reference
        });

        await order.save();

        res.status(200).json({
            message: 'Payment initialized successfully',
            data: data.data
        })
    } catch (error) {
        // console.log(error)
        res.status(500).json({
            messsage: error.message
        })
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { reference } = req.query;
        const order = await orderModel.findOne({
            reference
        });

        if (!order) {
            return res.status(404).json({
                message: 'No order found'
            })
        };

        const { data } = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`,
            {
                headers: {
                Authorization: `Bearer ${process.env.KORA_SK}`
            }}
        );

        console.log(data);

        if (data.status === true && data.data.status === 'processing') {
            order.status = 'processing'
            await order.save();
            return res.status(200).json({
                message: 'Payment is still processing'
            })
        };

        if (data.status === true && data.data.status === 'success') {
            order.status = 'successful'
            await order.save();
            return res.status(200).json({
                message: 'Payment successful'
            })
        };
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}