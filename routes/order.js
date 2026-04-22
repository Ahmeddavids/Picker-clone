const { placeOrder, verifyPayment } = require('../controller/order');
const { authenticate } = require('../middleware/auth');

const router = require('express').Router();

router.post('/order/:menuId', authenticate, placeOrder);

router.get('/order', verifyPayment)

module.exports = router 