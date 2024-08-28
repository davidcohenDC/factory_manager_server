const userRepository = require('@persistence/mongoose/models/repositories/userRepository')
const bcrypt = require('bcrypt')
const { logWithSource } = require('@config/')
const logger = logWithSource('UserService')

const createUser = async (userData) => {
  try {
    userData.password = await bcrypt.hash(userData.password, 10)
    const user = await userRepository.createUser(userData)
    logger.info(`User created with id: ${user._id}`, {
      userId: user._id,
      email: user.email
    })
    return { success: true, data: user }
  } catch (error) {
    if (error.message === 'User with this email already exists.') {
      logger.warn(`User creation failed: ${error.message}`)
      return { success: false, error: 'User with this email already exists.' }
    } else {
      logger.error(`Unexpected error during user creation: ${error.message}`)
      return { success: false, error: 'Failed to create user' }
    }
  }
}

const checkUserEmail = async (email) => {
  try {
    const user = await userRepository.findUserByEmail(email)
    logger.info(`Checking user email: ${email}`)
    return { success: true, exists: !!user }
  } catch (error) {
    logger.error(`Error checking user email: ${error.message}`, {
      stack: error.stack
    })
    return { success: false, error: 'Failed to check user email', status: 500 }
  }
}

const getUserByEmail = async (email) => {
  try {
    const user = await userRepository.findUserByEmail(email)
    if (!user) return { success: false, error: 'User not found', status: 404 }
    logger.info(`User retrieved with email: ${email}`)
    return { success: true, data: user }
  } catch (error) {
    logger.error(`Error retrieving user by email: ${error.message}`, {
      stack: error.stack
    })
    return {
      success: false,
      error: 'Failed to retrieve user by email',
      status: 500
    }
  }
}

const getUserById = async (id) => {
  try {
    const user = await userRepository.findUserById(id)
    if (!user) return { success: false, error: 'User not found', status: 404 }
    logger.info(`User retrieved with id: ${id}`)
    return { success: true, data: user }
  } catch (error) {
    logger.error(`Error retrieving user by id: ${error.message}`, {
      stack: error.stack
    })
    return {
      success: false,
      error: 'Failed to retrieve user by id',
      status: 500
    }
  }
}

const updateUserById = async (id, updateData) => {
  try {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10)
    }
    if (!updateData.security) updateData.security = {}
    if (!updateData.security.lastPasswordChange) {
      updateData.security.lastPasswordChange = new Date()
    }

    const updatedUser = await userRepository.updateUserById(id, updateData)
    if (!updatedUser)
      return { success: false, error: 'User not found', status: 404 }
    logger.info(`User updated with id: ${id}`)
    return { success: true, data: updatedUser }
  } catch (error) {
    logger.error(`Error updating user by id: ${error.message}`, {
      stack: error.stack
    })
    return { success: false, error: 'Failed to update user', status: 500 }
  }
}

const deleteUserById = async (id) => {
  try {
    const deletedUser = await userRepository.deleteUserById(id)
    if (!deletedUser)
      return { success: false, error: 'User not found', status: 404 }
    logger.info(`User deleted with id: ${id}`)
    return { success: true, data: deletedUser }
  } catch (error) {
    logger.error(`Error deleting user by id: ${error.message}`, {
      stack: error.stack
    })
    return { success: false, error: 'Failed to delete user', status: 500 }
  }
}

const getAllUsers = async (limit, offset) => {
  try {
    const users = await userRepository.getAllUsers(limit, offset)
    logger.info('All users retrieved')
    return { success: true, data: users }
  } catch (error) {
    logger.error(`Error retrieving all users: ${error.message}`, {
      stack: error.stack
    })
    return { success: false, error: 'Failed to retrieve users', status: 500 }
  }
}

module.exports = {
  createUser,
  checkUserEmail,
  getUserByEmail,
  getUserById,
  updateUserById,
  deleteUserById,
  getAllUsers
}
