const express = require('express')
const { userHandler, login, checkEmail } = require('../controllers/user/')
const router = express.Router()

// CRUD operations for user

// CREATE a new user
router.post('/', userHandler.create)

// RETRIEVE all users
router.get('/', userHandler.getAll)

// RETRIEVE a single user by ID
router.get('/:id', userHandler.getOne)

// UPDATE a user by ID
router.patch('/:id', userHandler.update)

// DELETE a user by ID
router.delete('/:id', userHandler.remove)

// LOGIN a user
router.post('/login', login)

// CheckEmail a user
router.post('/checkemail/', checkEmail)

module.exports = router
