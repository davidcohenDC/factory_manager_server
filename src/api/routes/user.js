const express = require('express')
const { login, checkEmail, getByEmail} = require('@controllers/user/')
const {
  validateLogin,
  validateCheckMail,
  validateUserBody,
  validateUserId
} = require('@validations/user.validation')
const router = express.Router()
const { userCRUD } = require('@controllers/user/')
const { tagTest } = require('@middlewares/')
const pagination = require('@middlewares/pagination')

// CRUD operations for user

// CREATE a new user
router.post('/', validateUserBody, tagTest, userCRUD.create)

// RETRIEVE all users
router.get(
  '/',
  pagination({
    itemsPerPage: 50,
    maxItemsPerPage: 100
  }),
  userCRUD.getAll
)

// RETRIEVE a single user by ID
router.get('/id/:id', validateUserId, userCRUD.getOne)

// UPDATE a user by ID
router.patch('/id/:id', validateUserId, userCRUD.update)

// DELETE a user by ID
router.delete('/id/:id', validateUserId, userCRUD.remove)

// retrieve user by email
router.get('/email/:email', validateCheckMail, getByEmail)

// LOGIN a user
router.post('/login', validateLogin, login)

// CheckEmail a user
router.post('/checkemail/', validateCheckMail, checkEmail)



module.exports = router
