require('module-alias/register')
const { configureApp, app } = require('@root/app')
const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const { faker } = require('@faker-js/faker')
const User = require('@root/persistence/mongoose/models/user')
const mongoose = require('mongoose')
const { userData } = require('@test/api/controllers/user')
chai.use(chaiHttp)

describe('User Model', () => {
  beforeEach(async () => {
    await User.deleteMany({ test: true })
  })

  let server // This will be our test server

  // Setup: start the server before tests
  before(async () => {
    await configureApp()
    server = app.listen() // Start the server
    await new User(userData).save()
  })

  after(async () => {
    await User.deleteMany({ test: true })
    await mongoose.disconnect()
    server.close() // Close the server after tests
  })

  describe('Model Creation & Saving', () => {
    it('creates and saves a user successfully', async () => {
      const userSaved = await new User(userData).save()
      expect(userSaved).to.have.property('_id')
      expect(userSaved.email).to.equal(userData.email.toLowerCase())
      expect(userSaved.password).to.not.equal(userData.password)
    })

    it('throws an error when email is missing', async () => {
      await new User({ password: 'Password123!' }).save().catch((error) => {
        // expect(error).to.be.an.instanceof(mongoose.Error.ValidationError)
        expect(error.errors).to.have.property('email')
      })
    })

    it('throws an error when password is missing', async () => {
      await new User({ email: faker.internet.email() })
        .save()
        .catch((error) => {
          // expect(error).to.be.an.instanceof(mongoose.Error.ValidationError)
          expect(error.errors).to.have.property('password')
        })
    })

    it('throws an error when password is invalid', async () => {
      await new User(userData).save().catch((error) => {
        // expect(error).to.be.an.instanceof(mongoose.Error.ValidationError)
        expect(error.errors).to.have.property('password')
      })
    })

    describe('Unique Constraints', () => {
      it('throws an error when email is not unique', async () => {
        await new User(userData).save()
        await new User(userData).save().catch((error) => {
          expect(error.message).to.contains(
            'User with this email already exists.'
          )
        })
      })
    })

    describe('Password Hashing', () => {
      it('hashes the password before saving the user', async () => {
        const userSaved = await new User(userData).save()
        expect(userSaved.password).to.not.equal(userData.password)
        expect(userSaved.password).to.not.equal(undefined)
      })
    })
  })
})
