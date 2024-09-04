const userRepository = require('@persistence/mongoose/models/repositories/userRepository')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { jwtSecretKey, logger } = require('@config/')

const authenticateUser = async (email, password) => {
  try {
    const user = await userRepository.findUserByEmail(email)
    if (!user) {
      logger.warn(`Authentication failed for email: ${email}`)
      return { success: false, error: 'Invalid email or password' }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      logger.warn(`Invalid password attempt for user id: ${user._id}`)
      return { success: false, error: 'Invalid email or password' }
    }

    const token = jwt.sign({ userId: user._id }, jwtSecretKey, {
      expiresIn: '30d'
    })
    logger.info(`User authenticated successfully with id: ${user._id}`)
    return { success: true, data: { token } }
  } catch (error) {
    logger.error(`Error authenticating user: ${error.message}`)
    return { success: false, error: 'Failed to authenticate user' }
  }
}

module.exports = {
  authenticateUser
}
