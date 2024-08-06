const express = require('express')
const { userCRUD, login, checkEmail, getByEmail} = require('@controllers/user/')
const {validateLogin, validateCheckMail, validateUserBody, validateUserId} = require('@validations/user.validation')
const router = express.Router()
const { tagTest } = require('@middlewares/')
const pagination = require('@middlewares/pagination')

// CRUD operations for user

// CREATE a new user
router.post('/', validateUserBody, tagTest, userCRUD.create)
router.get('/', pagination({itemsPerPage: 50, maxItemsPerPage: 100}), userCRUD.getAll)
router.get('/id/:id', validateUserId, userCRUD.getOne)
router.patch('/id/:id', validateUserId, userCRUD.update)
router.delete('/id/:id', validateUserId, userCRUD.remove)

// retrieve user by email
router.get('/email/:email', getByEmail)
// LOGIN a user
router.post('/login', validateLogin, login)
// CheckEmail a user
router.post('/checkemail/', validateCheckMail, checkEmail)

module.exports = router
