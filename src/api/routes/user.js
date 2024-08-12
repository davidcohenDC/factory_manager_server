const express = require('express')
const { userController } = require('@controllers/user/')
const { validateLogin, validateCheckMail, validateUserBody, validateUserId } = require('@validations/user.validation')
const router = express.Router()
const { pagination } = require('@middlewares/')

router.post('/', validateUserBody, userController.createUser)
router.get('/', pagination({itemsPerPage: 50, maxItemsPerPage: 100}), userController.getAllUsers)
router.get('/id/:id', validateUserId, userController.getUserById)
router.patch('/id/:id', validateUserId, userController.updateUserById)
router.delete('/id/:id', validateUserId, userController.deleteUserById)

router.get('/email/:email', userController.getUserByEmail)
router.post('/login', validateLogin, userController.login)
router.post('/checkemail/', validateCheckMail, userController.checkEmail)

module.exports = router
