// Import JWT 
const jwt = require('jsonwebtoken');
const restaurantModel = require('../models/restaurantModel');
const userModel = require('../models/userModel');
const redisClient = require('../config/redis');

exports.authenticate = async (req, res, next) => {
    try {
        const auth = req.headers.authorization
        if (!auth) {
            return next({
                message: `Auth required`,
                statusCode: 400
            })
        }
   
        const token = auth.split(' ')[1]
        // console.log(token)
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // Check if token exists in Redis
        const redisToken = await redisClient.get(`user:${decodedToken.id}`);
        if (!redisToken || redisToken !== token) {
            return next({
                message: `Session expired, Login to continue`,
                statusCode: 401
            })
        }

        const user = await restaurantModel.findById(decodedToken.id) || await userModel.findById(decodedToken.id)
        if (!user) {
            return next({
                message: `Authentication failed: User not found`,
                statusCode: 404
            })
        }

        req.user = decodedToken

        next()


    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next({
                message: `Session expired, Login to continue`,
                statusCode: 401
            })
        }
        next({
                message: error.message,
                statusCode: 500
            })
    }

};

exports.checkAdmin = async (req, res, next) => {
    try {
        const auth = req.headers.authorization
        if (!auth) {
            return next({
                message: `Auth required`,
                statusCode: 400
            })
        }
        const token = auth.split(' ')[1]
        
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decodedToken.id)
        if (!user) {
            return next({
                message: `Authentication failed: User not found`,
                statusCode: 404
            })
        }

        const role = user.role

        if (role !== 'admin') {
            next({
                message: `Unauthorized`,
                statusCode: 401
            })
        }

        req.user = decodedToken

        next()


    } catch (error) {
        next({
                message: error.message,
                statusCode: 500
            })
    }

}
