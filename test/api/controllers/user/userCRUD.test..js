require('module-alias/register')
const { app, configureApp } = require('@root/app')
const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const { faker } = require('@faker-js/faker')
const mongoose = require('mongoose')
const User = require('@models/user')
const { expectError } = require('../../utils/helper/')
chai.use(chaiHttp)
describe('User Controller - CRUD', () => {
  let server // This will be our test server
  let userID = ''

  //create the user
  const user = {
    email: faker.internet.email(),
    password: 'Password123!'
  }

  const invalidUserInputs = [
    {
      name: 'missing email',
      userData: { password: 'password123!' },
      expectedError: '"email" is required'
    },
    {
      name: 'missing password',
      userData: { email: faker.internet.email() },
      expectedError: '"password" is required'
    },
    {
      name: 'invalid email',
      userData: { email: 'invalidEmail', password: 'password123!' },
      expectedError: '"email" must be a valid email'
    },
    {
      name: 'invalid password',
      userData: { email: faker.internet.email(), password: 'hi' },
      expectedError: '"password" must contain at least 8 characters'
    }
  ]

  // Setup: start the server before tests
  before(async () => {
    await configureApp()
    server = app.listen() // Start the server
    userSaved = await new User({
      email: faker.internet.email(),
      password: 'Password123!'
    }).save()
    userID = userSaved._id
  })

  after(async () => {
    await User.deleteMany({ testUser: true })
    await mongoose.disconnect()
    server.close() // Close the server after tests
  })

  describe('Create User', () => {
    it('should create a new user', async () => {
      const res = await chai.request(server).post('/api/user').send(user)
      expect(res).to.have.status(201)
      expect(res.body).to.be.a('object')
      expect(res.body.user).to.have.property('_id')
      expect(res.body.user.email).to.equal(user.email.toLowerCase())
      expect(res.body.user.password).to.not.equal(user.password)
    })

    it('should return 400 when the email is already in use', async () => {
      await chai.request(server).post('/api/user').send(user)

      const res = await chai.request(server).post('/api/user').send(user)

      expectError(res, 400, 'email address is already taken.')
    })

    //Validation tests
    invalidUserInputs.forEach((testCase) => {
      it(`should return 400 when ${testCase.name}`, async () => {
        const res = await chai
          .request(server)
          .post('/api/user')
          .send(testCase.userData)
        expectError(res, 400, testCase.expectedError)
      })
    })
  })

  describe('Get User', () => {
    it('should return the user', async () => {
      if (userID === '') this.skip()
      const res = await chai.request(server).get(`/api/user/${userID}`)

      expect(res).to.have.status(200)
      expect(res.body).to.be.a('object')
      expect(res.body.user).to.have.property('_id')
      expect(res.body.user.password).to.not.equal(user.password)
    })

    it('should return 404 when the user is not valid', async () => {
      if (userID === '') this.skip()
      const res = await chai.request(server).get(`/api/user/123`)
      expectError(res, 400, '"id" length must be 24 characters long')
    })

    it('should return 404 when the user is not found', async () => {
      if (userID === '') this.skip()
      const res = await chai
        .request(server)
        .get(`/api/user/000000000000000000000001`)

      expectError(res, 404, 'user not found.')
    })
  })
  describe('Get All Users', () => {
    it('should return all users', async () => {
      const res = await chai.request(server).get(`/api/user`)

      expect(res).to.have.status(200)
      expect(res.body).to.be.a('object')
      expect(res.body.user).to.be.a('array')
      if (res.body.user.length > 0) {
        expect(res.body.user.length).to.be.greaterThan(0)
        expect(res.body.user[0]).to.have.property('_id')
      }
    })
  })

  //using patch
  describe('Update User', () => {
    it('should update the user', async () => {
      if (userID === '') this.skip()
      const res = await chai
        .request(server)
        .patch(`/api/user/${userID}`)
        .send({ email: faker.internet.email() })

      expect(res).to.have.status(200)
      expect(res.body).to.be.a('object')
      expect(res.body.user).to.have.property('_id')
      expect(res.body.user.email).to.not.equal(user.email)
    })

    it('should return 404 when the user is not valid', async () => {
      if (userID === '') this.skip()
      const res = await chai.request(server).patch(`/api/user/123`)

      expectError(res, 400, '"id" length must be 24 characters long')
    })

    it('should return 404 when the user is not found', async () => {
      if (userID === '') this.skip()
      const res = await chai
        .request(server)
        .patch(`/api/user/000000000000000000000001`)

      expectError(res, 404, 'user not found.')
    })

    it('should return 400 when the email is invalid', async () => {
      if (userID === '') this.skip()
      const res = await chai
        .request(server)
        .patch(`/api/user/${userID}`)
        .send({ email: 'invalidEmail' })

      expectError(res, 400, 'Validation failed: email:')
    })
  })

  describe('Delete User', () => {
    let savedUser

    beforeEach(async () => {
      savedUser = await new User({
        email: faker.internet.email(),
        password: 'Password123!'
      }).save()
    })

    it('should delete the user', async () => {
      const res = await chai
        .request(server)
        .delete(`/api/user/${savedUser._id}`)

      expect(res).to.have.status(200)
      expect(res.body).to.be.a('object')
      expect(res.body.message).to.equal('user deleted successfully')
    })

    it('should return 404 when the user is not valid', async () => {
      if (userID === '') this.skip()
      const res = await chai.request(server).delete(`/api/user/123`)

      expectError(res, 400, '"id" length must be 24 characters long')
    })

    it('should return 404 when the user is not found', async () => {
      if (userID === '') this.skip()
      const res = await chai
        .request(server)
        .delete(`/api/user/000000000000000000000001`)

      expectError(res, 404, 'user not found.')
    })
  })
})
