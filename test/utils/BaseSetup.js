const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const server = require('../../src');
const { connectToDb } = require('../../src/config/database');
const { expect } = chai;
const { TEST_DB_URI } = require('./test_helper');
chai.use(chaiHttp);

module.exports = {
    chai,
    mongoose,
    User,
    server,
    connectToDb,
    expect,
    TEST_DB_URI
};