const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT || 5945;
require('./database/database');
const userRouter = require('./routes/userRouter')
const restaurantRouter = require('./routes/restaurant')
const orderRouter = require('./routes/order')
const facebookRoute = require('./routes/facebook')
const locationRoute = require('./routes/location')
const weatherRoute = require('./routes/weather')
const expressSession = require('express-session')
const passport = require('passport');
require('./controller/passport')
require('./controller/facebook')
require('./controller/github')
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');


const app = express();
app.use(express.json());
app.use(expressSession({ secret: 'olachi', saveUninitialized: false, resave: false }))
app.use(passport.initialize());
app.use(passport.session())
app.use('/api/v1/user', userRouter);
app.use('/api/v1/restaurant', restaurantRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/location', locationRoute);
app.use('/api/v1/weather', weatherRoute);

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Picker Web Application',
        version: '2.0.0',
        description:
            'This is a REST API application made with Express. It retrieves data from JSONPlaceholde. The Base URL is: http://localhost:5555',
        license: {
            name: 'Official URL',
            url: 'https://google.com',
        },
        contact: {
            name: 'JSONPlaceholder',
            url: 'https://jsonplaceholder.typicode.com',
        },
    },
    servers: [
        {
            url: 'http://localhost:5555',
            description: 'Development server',
        },
    ],
    security: [
        {
            bearerAuth: []
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    }
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js']
}

const swaggerSpec = swaggerJsdoc(options);

app.use('/api/v1/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/api/v2/documentations', swaggerUi.serve, swaggerUi.setup(swaggerSpec))



app.use((req, res, next) => {
    next({
        message: `route ${req.originalUrl} and ${req.method} not found`,
        statusCode: 500
    })
})

// app.use((error, req, res, next) => {
//     res.status(error.statusCode).json({
//         message: error.message,
//         status: error.statusCode
//     })
// })

app.use((err, req, res, next) => {
    if (err.name === 'MulterError') {
        return res.status(400).json({
            message: 'File upload failed'
        })
    }
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            message: 'Session expired, please login again'
        })
    }
    res.status(500).json({
        message: err.message
    })
})


const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Database connected successfully');
        app.listen(PORT, () => {
            console.log(`Server listening to Port: ${PORT}`);
        })

    })
    .catch((error) => {
        console.log(error.message);

    })
