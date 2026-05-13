const weatherModel = require('../models/weather')
const axios = require("axios")
require('dotenv').config()

exports.userWeather = async (req, res, next) => {
    try {
       const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress

       const ip = rawIp === "::1" ? "102.89.47.157" : rawIp

        const userAddress = await axios.get(`http://ip-api.com/json/${ip}`);
        const latitude = userAddress.data.lat;
        const longitude = userAddress.data.lon;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.Weather_Key}&units=metric`

        const actualWeather = await axios.get(apiUrl)

        console.log(actualWeather)

        const location = {
                    lat: latitude,
                    long: longitude,
                    weatherTemp: actualWeather.data.main.temp,
                    userId: req.user.id
                }
        
                const data = await weatherModel.create(location)
                res.status(200).json({
                    message: "Weather gotten successfully",
                    data: data
                })

    } catch (error) {
        next({
                message: error.message,
                statusCode: 500
            })
    }
}