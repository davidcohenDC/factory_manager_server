const bcrypt = require('bcrypt')
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
const {
  chai,
  User,
  server,
  expect,
  TEST_DB_URI
} = require('../utils/userTestUtils')
const {
  createUser,
  updateUserModel,
  commonBeforeHook,
  commonAfterHook,
  commonBeforeEachHook,
  commonAfterEachHook
} = require('../utils/userTestUtils')

chai.use(chaiHttp)

describe('User Model', () => {
  const userModel = {
    email: 'john@example.com',
    password: 'password123',
    testUser: true
  }

  const userInserted = updateUserModel(userModel, {
    email: 'test123@test.com',
    password: 'password345'
  })

  let userSaved = null

  before(() => commonBeforeHook(TEST_DB_URI))

  after(commonAfterHook)

  beforeEach(async () => {
    userSaved = await commonBeforeEachHook(userInserted)
  })

  afterEach(commonAfterEachHook)
  describe('Model Creation & Saving', () => {
    it('saves and validates user', async () => {
      expect(userSaved).to.include({ email: userInserted.email })
      expect(userSaved.password).to.not.equal(userInserted.password)

      let validationError
      try {
        await createUser({ password: 'password123', testUser: true })
      } catch (error) {
        validationError = error
      }
      expect(validationError).to.be.an.instanceof(
        mongoose.Error.ValidationError
      )
      expect(validationError.errors).to.have.property('email')
    })
  })

  describe('Unique Constraints', () => {
    it('fails with duplicate email', async () => {
      try {
        await createUser(userInserted)
        throw new Error('Expected a MongoServerError but did not get one')
      } catch (error) {
        expect(error).to.have.property('name').which.equals('MongoServerError')
        expect(error.code).to.equal(11000)
      }
    })
  })

  describe('Password Hashing', () => {
    it('hashes password before saving', async () => {
      expect(await bcrypt.compare(userInserted.password, userSaved.password)).to
        .be.true
    })
  })
})
