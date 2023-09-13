const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const User = require('../../../src/models/user');
const server = require('../../../src/app');
const { connectToDb } = require('../../../src/config/database');
const { expect } = chai;
const { TEST_DB_URI } = require('./test_helper');

chai.use(chaiHttp);

const TEST_USER_FILTER = { testUser: true };

const updateUserModel = (model, updates) => {
  return { ...model, ...updates };
};

const createUser = async (data) => {
  try {
    const user = new User(data);
    return await user.save();
  } catch (error) {
    console.error('Error while creating user:', error);
    throw error;
  }
};

const commonBeforeHook = async (dbUri) => {
  try {
    await connectToDb(dbUri);
  } catch (error) {
    console.error('Error while connecting to DB:', error);
    throw error;
  }
};

const commonAfterHook = async () => {
  try {
    await mongoose.connection.close();
    server.close();
  } catch (error) {
    console.error('Error while closing the DB connection or server:', error);
    throw error;
  }
};

const commonBeforeEachHook = async (userModel) => {
  return await createUser(userModel);
};

const commonAfterEachHook = async () => {
  try {
    await User.deleteMany(TEST_USER_FILTER);
  } catch (error) {
    console.error('Error while deleting test users:', error);
    throw error;
  }
};

async function obtainTestToken() {
  const testUserCredentials = {
    email: 'testuser@example.com',
    password: 'testPassword123!'
  };

  const res = await chai.request(server)
      .post('/api/user/login')
      .send(testUserCredentials);

  if (res.status !== 200) {
    throw new Error('Failed to obtain test token');
  }

  return res.body.token;
}

module.exports = {
  chai,
  mongoose,
  User,
  server,
  obtainTestToken,
  connectToDb,
  expect,
  TEST_DB_URI,
  createUser,
  updateUserModel,
  commonBeforeHook,
  commonAfterHook,
  commonBeforeEachHook,
  commonAfterEachHook
};
