const User = require('@models/user')

const createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};

const findUserByEmail = async (email) => {
    return User.findOne({email: email});
};

const findUserById = async (id) => {
    return User.findById(id);
};

const updateUserById = async (id, updateData) => {
    return User.findByIdAndUpdate(id, updateData, {new: true, runValidators: true});
};

const deleteUserById = async (id) => {
    return User.findByIdAndDelete(id);
};

const getAllUsers = async (limit, offset) => {
    return User.find().skip(offset).limit(limit);
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    updateUserById,
    deleteUserById,
    getAllUsers,
};