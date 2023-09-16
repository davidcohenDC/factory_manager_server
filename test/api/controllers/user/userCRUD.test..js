require('module-alias/register')
const server = require('@root/app')
const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const { faker } = require('@faker-js/faker')
const mongoose = require('mongoose')
const User = require('@models/user')
chai.use(chaiHttp)
describe('User Controller - CRUD', () => {
  const userID = '6505a373b8bc9badb1caa7de' //use only a real id to test

  //create the user
  const user = {
    email: faker.internet.email(),
    password: 'testPassword123!',
    testUser: true
  }

  after(async () => {
    await User.deleteMany({ testUser: true })
    await mongoose.disconnect()
    await server.close()
  })

  describe('Create User', () => {
    it('should create a new user', async () => {
      const res = await chai.request(server).post('/api/user').send(user)

      expect(res).to.have.status(201)
      expect(res.body).to.be.a('object')
      expect(res.body.user).to.have.property('_id')
      expect(res.body.user.email).to.equal(user.email.toLowerCase())
      expect(res.body.user.password).to.not.equal(user.password)
      user._id = res.body.id
    })

    //Validation tests

    it('should return 400 when the email or password is missing', async () => {
      const userWithoutEmail = {
        password: 'password123',
        testUser: true
      }
      const res = await chai
        .request(server)
        .post('/api/user')
        .send(userWithoutEmail)

      expect(res).to.have.status(400)
      expect(res.body).to.be.a('object')
      console.log(res.body)
      expect(res.body.error).to.equal('"email" is required')
    })

    it('should return 400 when the email is invalid', async () => {
      const userWithInvalidEmail = {
        email: 'invalidEmail',
        password: 'password123',
        testUser: true
      }
      const res = await chai
        .request(server)
        .post('/api/user')
        .send(userWithInvalidEmail)

      expect(res).to.have.status(400)
      expect(res.body).to.be.a('object')
      expect(res.body.error).to.equal('"email" must be a valid email')
    })

    it('should return 400 when the password is invalid', async () => {
      const userWithInvalidPassword = {
        email: user.email,
        password: 'hi',
        testUser: true
      }
      const res = await chai
        .request(server)
        .post('/api/user')
        .send(userWithInvalidPassword)

      expect(res).to.have.status(400)
      expect(res.body).to.be.a('object')
      expect(res.body.error).to.contain(
        '"password" must contain at least 8 characters'
      )
    })

    it('should return 400 when the email is already in use', async () => {
      await chai.request(server).post('/api/user').send(user)

      const res = await chai.request(server).post('/api/user').send(user)

      expect(res).to.have.status(400)
      expect(res.body).to.be.a('object')
      expect(res.body.error).to.equal(`email address is already taken.`)
    })
  })

  describe('Get User', () => {
    it('should return the user', async () => {
      if (userID === '') return
      const res = await chai.request(server).get(`/api/user/${userID}`)

      console.log(res.body)
      expect(res).to.have.status(200)
      expect(res.body).to.be.a('object')
      expect(res.body.user).to.have.property('_id')
      expect(res.body.user.password).to.not.equal(user.password)
    })

    it('should return 404 when the user is not valid', async () => {
      if (userID === '') return
      const res = await chai.request(server).get(`/api/user/123`)

      expect(res).to.have.status(400)
      expect(res.body).to.be.a('object')
      expect(res.body.error).to.equal('"id" length must be 24 characters long')
    })

    it('should return 404 when the user is not found', async () => {
      if (userID === '') return
      const res = await chai
        .request(server)
        .get(`/api/user/000000000000000000000001`)

      expect(res).to.have.status(404)
      expect(res.body).to.be.a('object')
      expect(res.body.error).to.equal('user not found.')
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
      if (userID === '') return
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
      if (userID === '') return
      const res = await chai.request(server).patch(`/api/user/123`)

      expect(res).to.have.status(400)
      expect(res.body).to.be.a('object')
      expect(res.body.error).to.equal('"id" length must be 24 characters long')
    })

    it('should return 404 when the user is not found', async () => {
      if (userID === '') return
      const res = await chai
        .request(server)
        .patch(`/api/user/000000000000000000000001`)

      console.log(res.body)
      expect(res).to.have.status(404)
      expect(res.body).to.be.a('object')
      expect(res.body.error).to.equal('user not found.')
    })

    it('should return 400 when the email is invalid', async () => {
      if (userID === '') return
      const res = await chai
        .request(server)
        .patch(`/api/user/${userID}`)
        .send({ email: 'invalidEmail' })

      expect(res).to.have.status(400)
      expect(res.body).to.be.a('object')
      expect(res.body.error).to.contains('Validation failed')
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
      if (userID === '') return
      const res = await chai.request(server).delete(`/api/user/123`)

      expect(res).to.have.status(400)
      expect(res.body).to.be.a('object')
      expect(res.body.error).to.equal('"id" length must be 24 characters long')
    })

    it('should return 404 when the user is not found', async () => {
      if (userID === '') return
      const res = await chai
        .request(server)
        .delete(`/api/user/000000000000000000000001`)

      expect(res).to.have.status(404)
      expect(res.body).to.be.a('object')
      expect(res.body.error).to.equal('user not found.')
    })
  })
})
