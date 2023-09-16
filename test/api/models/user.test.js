require('module-alias/register')
const {configureApp, app} = require("@root/app");
const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const { faker } = require('@faker-js/faker')
const User = require('@models/user')
const mongoose = require('mongoose')
chai.use(chaiHttp)

describe('User Model', () => {
  const user = {
    email: faker.internet.email(),
    password: 'password123!',
    testUser: true
  }

  beforeEach(async () => {
    await User.deleteMany({ testUser: true })
  })

  let server;  // This will be our test server

  // Setup: start the server before tests
  before(async () => {
    await configureApp();
    server = app.listen(); // Start the server
    await new User(user).save();
  });

  after(async () => {
    await User.deleteMany({ testUser: true });
    await mongoose.disconnect();
    server.close();  // Close the server after tests
  });

  describe('Model Creation & Saving', () => {
    it('creates and saves a user successfully', async () => {
      const userSaved = await new User(user).save()
      expect(userSaved).to.have.property('_id')
      expect(userSaved.email).to.equal(user.email.toLowerCase())
      expect(userSaved.password).to.not.equal(user.password)
    })

    it('throws an error when email is missing', async () => {
      await new User({ password: 'Password123!' }).save().catch((error) => {
        expect(error).to.be.an.instanceof(mongoose.Error.ValidationError)
        expect(error.errors).to.have.property('email')
      })
    })

    it('throws an error when password is missing', async () => {
      await new User({ email: faker.internet.email() })
        .save()
        .catch((error) => {
          expect(error).to.be.an.instanceof(mongoose.Error.ValidationError)
          expect(error.errors).to.have.property('password')
        })
    })

    it('throws an error when email is invalid', async () => {
      await new User({ email: 'invalidEmail', password: 'Password1234!' })
        .save()
        .catch((error) => {
          expect(error).to.be.an.instanceof(mongoose.Error.ValidationError)
          expect(error.errors).to.have.property('email')
        })
    })

    it('throws an error when password is invalid', async () => {
      await new User({ email: faker.internet.email(), password: 'notvalid' })
        .save()
        .catch((error) => {
          expect(error).to.be.an.instanceof(mongoose.Error.ValidationError)
          expect(error.errors).to.have.property('password')
        })
    })

    describe('Unique Constraints', () => {

      it('throws an error when email is not unique', async () => {
        await new User(user).save()
        await new User(user).save().catch((error) => {
          expect(error.message).to.contains('email address is already taken')
        })
      })

      it('throws an error when email is not unique (case insensitive)', async () => {
        await new User(user).save()
        await new User({
          email: user.email.toUpperCase(),
          password: user.password
        })
          .save()
          .catch((error) => {
            expect(error.message).to.contains('email address is already taken')
          })
      })
    })

    describe('Password Hashing', () => {
      it('hashes the password before saving the user', async () => {
        const userSaved = await new User(user).save()
        expect(userSaved.password).to.not.equal(user.password)
        expect(userSaved.password).to.not.equal(undefined)
      })
    })
  })
})
