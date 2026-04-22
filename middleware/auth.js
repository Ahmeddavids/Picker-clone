// Import JWT 
const jwt = require('jsonwebtoken');
const restaurantModel = require('../models/restaurantModel');
const userModel = require('../models/userModel')

exports.authenticate = async (req, res, next) => {
    try {
        const auth = req.headers.authorization
        if (!auth) {
            return res.status(400).json({
                message: "Auth required"
            })
        }
        const token = auth.split(' ')[1]
        // console.log(token)
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await restaurantModel.findById(decodedToken.id) || await userModel.findById(decodedToken.id)
        if (!user) {
            return res.status(404).json({
                message: "Authentication failed: User not found"
            })
        }

        req.user = decodedToken

        next()


    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: 'Session expired, Login to continue'
            })
        }
        res.status(500).json({
            message: error.message
        })
    }

};

exports.checkAdmin = async (req, res, next) => {
    try {
        const auth = req.headers.authorization
        if (!auth) {
            return res.status(400).json({
                message: "Auth required"
            })
        }
        const token = auth.split(' ')[1]
        
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decodedToken.id)
        if (!user) {
            return res.status(404).json({
                message: "Authentication failed: User not found"
            })
        }

        const role = user.role

        if (role !== 'admin') {
            res.status(401).json({
                message: 'Unaunthorized'
            })
        }

        req.user = decodedToken

        next()


    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}
