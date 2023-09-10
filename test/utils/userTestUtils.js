const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const server = require('../../src/app');
const { connectToDb } = require('../../src/config/database');
const { expect } = chai;
const { TEST_DB_URI } = require('./test_helper');

chai.use(chaiHttp);

const updateUserModel = (model, updates) => {
    return { ...model, ...updates };
};

async function createUser(data) {
    const user = new User(data);
    return await user.save();
}

async function commonBeforeHook(dbUri) {
    await connectToDb(dbUri);
}

async function commonAfterHook() {
    await mongoose.connection.close();
    server.close();
}

async function commonBeforeEachHook(userModel) {
    return await createUser(userModel);
}

async function commonAfterEachHook() {
    await User.deleteMany({ testUser: true });
}

module.exports = {
    chai,
    mongoose,
    User,
    server,
    connectToDb,
    expect,
    TEST_DB_URI,
    createUser,
    updateUserModel,
    commonBeforeHook,
    commonAfterHook,
    commonBeforeEachHook,
    commonAfterEachHook,
};