const { authenticate } = require('../middleware/auth');
const { userWeather } = require('../utils/weather');

const router = require('express').Router();

/**
 * @swagger
 * /api/v1/weather:
 *   get:
 *     tags:
 *       - Weather
 *     summary: Get Weather Information
 *     description: Retrieve weather information for a specified location. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weather information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 location:
 *                   type: string
 *                   description: The location for which the weather information is provided
 *                   example: Lagos, Nigeria
 *                 temperature:
 *                   type: number
 *                   description: The current temperature in Celsius
 *                   example: 30.5
 *                 description:
 *                   type: string
 *                   description: A brief description of the current weather conditions
 *                   example: Partly cloudy with a chance of rain
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal Server Error
 */
router.get('/', authenticate, userWeather);


module.exports = router 