const multer = require('multer');

const { registerRestaurant, verifyRestaurantEmail, resendRestaurantOTP, loginRestaurant, uploadProduct, deletemenu, getAllMenu } = require('../controller/restaurant');
const { authenticate, checkAdmin } = require('../middleware/auth');

const router = require('express').Router();

router.post('/register', registerRestaurant);

router.post('/verify', verifyRestaurantEmail);

router.post('/resend-otp', resendRestaurantOTP);

router.post('/login', loginRestaurant);

const upload = multer(
    {
        dest: '/upload'
    }
)
router.post('/menu', authenticate, upload.single('image') , uploadProduct);

router.get('/menus', authenticate, getAllMenu)

router.delete('/menus/:id', checkAdmin, deletemenu)

module.exports = router 