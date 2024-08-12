const userRepository = require('@models/repositories/userRepository');
const bcrypt = require('bcrypt');
const { logger } = require('@config/');

const createUser = async (userData) => {
    try {
        userData.password = await bcrypt.hash(userData.password, 10);
        const user = await userRepository.createUser(userData);
        logger.info(`User created with id: ${user._id}`);
        return { success: true, data: user };
    } catch (error) {
        logger.error(`Error creating user: ${error.message}`);
        return { success: false, error: 'Failed to create user' };
    }
};

const checkUserEmail = async (email) => {
    try {
        const user = await userRepository.findUserByEmail(email);
        logger.info(`Checking user email: ${email}`);
        return { success: true, exists: user !== null };
    } catch (error) {
        logger.error(`Error checking user email: ${error.message}`);
        return { success: false, error: 'Failed to check user email' };
    }
};

const getUserByEmail = async (email) => {
    try {
        const user = await userRepository.findUserByEmail(email);
        logger.info(`User retrieved with email: ${email}`);
        return user ? { success: true, data: user } : { success: false, error: 'User not found' };
    } catch (error) {
        logger.error(`Error retrieving user by email: ${error.message}`);
        return { success: false, error: 'Failed to retrieve user by email' };
    }
};

const getUserById = async (id) => {
    try {
        const user = await userRepository.findUserById(id);
        logger.info(`User retrieved with id: ${id}`);
        return user ? { success: true, data: user } : { success: false, error: 'User not found' };
    } catch (error) {
        logger.error(`Error retrieving user by id: ${error.message}`);
        return { success: false, error: 'Failed to retrieve user by id' };
    }
};

const updateUserById = async (id, updateData) => {
    try {
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        //create if not exist lastPasswordChange
        if (!updateData.security) updateData.security = {};
        if (!updateData.security.lastPasswordChange) {
            updateData.security.lastPasswordChange = new Date();
        }

        const updatedUser = await userRepository.updateUserById(id, updateData);
        logger.info(`User updated with id: ${id}`);
        return { success: true, data: updatedUser };
    } catch (error) {
        logger.error(`Error updating user by id: ${error.message}`);
        return { success: false, error: 'Failed to update user' };
    }
};

const deleteUserById = async (id) => {
    try {
        const deletedUser = await userRepository.deleteUserById(id);
        logger.info(`User deleted with id: ${id}`);
        return { success: true, data: deletedUser };
    } catch (error) {
        logger.error(`Error deleting user by id: ${error.message}`);
        return { success: false, error: 'Failed to delete user' };
    }
};

const getAllUsers = async (limit, offset) => {
    try {
        const users = await userRepository.getAllUsers(limit, offset);
        logger.info('All users retrieved');
        return { success: true, data: users };
    } catch (error) {
        logger.error(`Error retrieving all users: ${error.message}`);
        return { success: false, error: 'Failed to retrieve users' };
    }
};

module.exports = {
    createUser,
    checkUserEmail,
    getUserByEmail,
    getUserById,
    updateUserById,
    deleteUserById,
    getAllUsers,
};
