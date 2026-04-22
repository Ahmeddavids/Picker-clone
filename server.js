const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT || 5945;
require('./database/database');
const userRouter = require('./routes/userRouter')
const restaurantRouter = require('./routes/restaurant')
const orderRouter = require('./routes/order')
const facebookRoute = require('./routes/facebook')
const expressSession = require('express-session')
const passport = require('passport');
require('./controller/passport')
require('./controller/facebook')
require('./controller/github')


const app = express();
app.use(express.json());
app.use(expressSession({secret: 'olachi'}))
app.use(passport.initialize());
app.use(passport.session())
app.use('/api/user',userRouter);
app.use('/api/users',facebookRoute);
app.use('/api/restaurant', restaurantRouter);
app.use('/api', orderRouter);


const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, ()=> {
    console.log(`Server listening to Port: ${PORT}`);
})
    
})
.catch((error) => {
    console.log(error.message);
    
})
