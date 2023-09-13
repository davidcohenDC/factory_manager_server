const express = require('express')
const { login, checkEmail } = require('../controllers/user/')
const { validateLogin, validateCheckMail, validateUserBody, validateUserId } = require('../validations/user.validation')
const router = express.Router()
const trimRequest = require('trim-request')
const { userCRUD } = require('../controllers/user/')

// CRUD operations for user

// CREATE a new user
router.post('/',
    trimRequest.all,
    validateUserBody,
    userCRUD.create);

// RETRIEVE all users
router.get('/',
    trimRequest.all,
    userCRUD.getAll)

// RETRIEVE a single user by ID
router.get('/:id',
    trimRequest.all,
    validateUserId,
    userCRUD.getOne)

// UPDATE a user by ID
router.patch('/:id',
    trimRequest.all,
    validateUserId,
    userCRUD.update)

// DELETE a user by ID
router.delete('/:id',
    trimRequest.all,
    validateUserId,
    userCRUD.remove)

// LOGIN a user
router.post('/login',
    trimRequest.all,
    validateLogin,
    login)

// CheckEmail a user
router.post('/checkemail/',
    trimRequest.all,
    validateCheckMail,
    checkEmail)

module.exports = router
