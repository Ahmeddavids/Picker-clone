const { register, verifyEmail, resendOTP, login, getAllUsers, getUserById } = require('../controller/userController');
const passport = require('passport')
const router = require('express').Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and authentication
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The User's Name
 *           example: John Doe
 *         email:
 *           type: string
 *           description: The User's Email
 *           example: 0MfPp@example.com
 *         phoneNumber:
 *           type: string
 *           description: The User's Phone Number
 *           example: 1234567890
 *         password:
 *           type: string
 *           description: The User's Password
 *           example: password123
 *         confirmPassword:
 *           type: string
 *           description: The User's Confirm Password
 *           example: password123
 */



/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     tags:
 *       - User
 *     summary: User Registration
 *     description: Register a new user with email, password, and other details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The User's Name
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: The User's Email
 *                 example: 0MfPp@example.com
 *               password:
 *                 type: string
 *                 description: The User's Password
 *                 example: password123
 *               confirmPassword:
 *                 type: string
 *                 description: The User's Confirm Password
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *                   example: User registered successfully
 */
router.post('/register', register);

router.post('/verify', verifyEmail);

router.post('/resend-otp', resendOTP);

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     tags:
 *       - User
 *     summary: User Login
 *     description: Log in a user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The User's Email
 *                 example: 0MfPp@example.com
 *               password:
 *                 type: string
 *                 description: The User's Password
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *                   example: User logged in successfully
 */
router.post('/login', login);

router.get('/collect', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/googleLogin', passport.authenticate('google', {
  successRedirect: '/api/user/loginsuccess',
  failureRedirect: '/api/user/loginfailed'
}))

router.get('/loginsuccess', (req, res) => {
  res.json({
    message: 'Login successful',
    data: req.user
  })
})

router.get('/loginfailed', (req, res) => {
  res.json({ message: 'Login failed' })
})


router.get('/githubLogin', passport.authenticate('github2'));

router.get('/githubLogin/callback', passport.authenticate('github2', { failureRedirect: '/login', session: false }),
  (req, res) => {
    res.json({ message: "GitHub login successful", data: req.user });
  }
);

// router.get('/auth/facebook',
//   passport.authenticate('facebook'));

// router.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//    });

/**
 * @swagger
 * /api/v1/user/getAllUsers:
 *   get:
 *     tags:
 *       - User
 *     summary: All Users
 *     description: Get all users in the database
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/getAllUsers', getAllUsers);



/**
 * @swagger
 * /api/v1/user/getone/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get User by ID
 *     description: Get a user by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The User ID
 *         schema:
 *           type: string
 *           example: 69f6fc59f069dce732d54a15
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the user was not found
 *                   example: User not found
*/
router.get('/getone/:id', getUserById);

module.exports = router;
// /**
//  * @swagger
//  * /api/v1/user/getAllUsers:
//  *   get:
//  *     summary: All Users
//  *     description: Get all users in the database
//  *     responses:
//  *       200:
//  *         description: List of users
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 data:
//  *                   type: array
//  *                   items:
//  *                     type: object
//  *                     properties:
//  *                       id:
//  *                         type: string
//  *                         description: The User ID
//  *                         example: 69f6fc59f069dce732d54a15
//  *                       name:
//  *                         type: string
//  *                         description: The User's Name
//  *                         example: John Doe
//  *                       email:
//  *                         type: string
//  *                         description: The User's Email
//  *                         example: example@example.com
//  *                       phoneNumber:
//  *                         type: string
//  *                         description: The User's Phone Number
//  *                         example: +2348012345678
//  *                       isVerified:
//  *                         type: boolean
//  *                         description: The User's Verification Status
//  *                         example: true
//  *                       createdAt:
//  *                         type: string
//  *                         format: date-time
//  *                         description: The User's Creation Date
//  *                         example: 2026-05-04T15:56:49.406Z
//  *                       updatedAt:
//  *                         type: string
//  *                         format: date-time
//  *                         description: The User's Update Date
//  *                         example: 2026-05-04T15:56:49.406Z
//  *              
//  */


// router.get('/getAllUsers', getAllUsers);