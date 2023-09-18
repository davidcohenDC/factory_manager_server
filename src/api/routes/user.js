const express = require('express')
const { login, checkEmail } = require('@controllers/user/')
const {
  validateLogin,
  validateCheckMail,
  validateUserBody,
  validateUserId
} = require('@validations/user.validation')
const router = express.Router()
const { userCRUD } = require('@controllers/user/')
const { tagTestUser} = require('@middlewares/testUserMiddleware')
const pagination = require('@middlewares/pagination')

// CRUD operations for user

// CREATE a new user
router.post('/', validateUserBody, tagTestUser, userCRUD.create)

// RETRIEVE all users
router.get('/',  pagination({
  itemsPerPage: 50,
  maxItemsPerPage: 100
}), userCRUD.getAll)

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
