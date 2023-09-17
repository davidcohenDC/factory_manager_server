require('module-alias/register')
const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const { faker } = require('@faker-js/faker')
const User = require('@models/user')
const mongoose = require('mongoose')
const { configureApp, app } = require('@root/app')
chai.use(chaiHttp)

describe('User Controller - Login', () => {
  const user = {
    email: faker.internet.email(),
    password: 'testPassword123!',
    testUser: true
  }
  let server // This will be our test server

  // Setup: start the server before tests
  before(async () => {
    await configureApp()
    server = app.listen() // Start the server
    await new User(user).save()
  })

  after(async () => {
    await User.deleteMany({ testUser: true })
    await mongoose.disconnect()
    server.close() // Close the server after tests
  })

  describe('POST /api/user/login', () => {
    it('should login successfully and return a token', async () => {
      const res = await chai.request(server).post('/api/user/login').send({
        email: user.email,
        password: user.password
      })

      console.log(res.body)
      expect(res).to.have.status(200)
      expect(res.body).to.be.a('object')
      expect(res.body.token).to.be.a('string')
      expect(res.body.token).to.not.be.empty
    })

    it('should return 400 when the email is invalid', async () => {
      const res = await chai.request(server).post('/api/user/login').send({
        email: 'invalidEmail',
        password: user.password
      })
      expect(res).to.have.status(400)
      expect(res.body).to.be.a('object')
      expect(res.body.error).to.equal('"email" must be a valid email')
      expect(res.body.token).to.be.undefined
    })

    it('should return 400 when the password is invalid', async () => {
      const res = await chai.request(server).post('/api/user/login').send({
        email: user.email,
        password: 'invalidPassword'
      })
      expect(res).to.have.status(400)
      expect(res.body).to.be.a('object')
      expect(res.body.error).to.contains(
        '"password" must contain at least 8 characters'
      )
      expect(res.body.token).to.be.undefined
    })

    it('should fails to login with wrong password', async () => {
      const res = await chai.request(server).post('/api/user/login').send({
        email: user.email,
        password: 'wrongPassword123!'
      })
      expect(res).to.have.status(401)
      expect(res.body).to.be.a('object')
      expect(res.body.error).to.equal('Invalid email or password')
      expect(res.body.token).to.be.undefined
    })

    it('should fails to login with wrong email', async () => {
      const res = await chai.request(server).post('/api/user/login').send({
        email: faker.internet.email(),
        password: user.password
      })
      expect(res).to.have.status(401)
      expect(res.body).to.be.a('object')
      expect(res.body.error).to.equal('Invalid email or password')
      expect(res.body.token).to.be.undefined
    })
  })
})
