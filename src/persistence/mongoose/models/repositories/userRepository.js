const { User } = require('@persistence/mongoose/models/')
const { logWithSource } = require('@config/')
const logger = logWithSource('UserRepository')

const createUser = async (userData) => {
  try {
    const user = new User(userData)
    await user.save()
    logger.info(`User created with id: ${user._id}`)
    return user
  } catch (error) {
    if (error.message === 'User with this email already exists.') {
      // The error is already logged in the schema, just propagate it
      throw error
    } else {
      logger.error(`Database operation failed: ${error.message}`, { error })
      throw new Error('Failed to process data')
    }
  }
}

const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email })
    if (!user) {
      logger.warn(`User with email: ${email} not found.`)
    }
    return user
  } catch (error) {
    logger.error(`Error finding user by email ${email}: ${error.message}`)
    throw error
  }
}

const findUserById = async (id) => {
  try {
    const user = await User.findById(id)
    if (!user) {
      logger.warn(`User with id: ${id} not found.`)
    }
    return user
  } catch (error) {
    logger.error(`Error finding user by id ${id}: ${error.message}`)
    throw error
  }
}

const updateUserById = async (id, updateData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    })
    if (!updatedUser) {
      logger.warn(`User with id: ${id} not found for update.`)
    } else {
      logger.info(`User with id: ${id} successfully updated.`)
    }
    return updatedUser
  } catch (error) {
    logger.error(`Error updating user by id ${id}: ${error.message}`)
    throw error
  }
}

const deleteUserById = async (id) => {
  try {
    const deletedUser = await User.findByIdAndDelete(id)
    if (!deletedUser) {
      logger.warn(`User with id: ${id} not found for deletion.`)
    } else {
      logger.info(`User with id: ${id} successfully deleted.`)
    }
    return deletedUser
  } catch (error) {
    logger.error(`Error deleting user by id ${id}: ${error.message}`)
    throw error
  }
}

const getAllUsers = async (limit, offset) => {
  try {
    const users = await User.find().skip(offset).limit(limit)
    logger.info(`Retrieved ${users.length} users.`)
    return users
  } catch (error) {
    logger.error(`Error retrieving users: ${error.message}`)
    throw error
  }
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
  deleteUserById,
  getAllUsers
}
