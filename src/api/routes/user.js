const express = require('express')
const { login, checkEmail } = require('../controllers/user/')
const {
  validateLogin,
  validateCheckMail,
  validateUserBody,
  validateUserId
} = require('../validations/user.validation')
const router = express.Router()
const { userCRUD } = require('../controllers/user/')

// CRUD operations for user

// CREATE a new user
router.post('/', validateUserBody, userCRUD.create)

// RETRIEVE all users
router.get('/', userCRUD.getAll)

// RETRIEVE a single user by ID
router.get('/:id', validateUserId, userCRUD.getOne)

// UPDATE a user by ID
router.patch('/:id', validateUserId, userCRUD.update)

// DELETE a user by ID
router.delete('/:id', validateUserId, userCRUD.remove)

// LOGIN a user
router.post('/login', validateLogin, login)

// CheckEmail a user
router.post('/checkemail/', validateCheckMail, checkEmail)

module.exports = router
