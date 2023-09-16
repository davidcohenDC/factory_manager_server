require('module-alias/register')
const server = require('@root/app')
const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const { faker } = require('@faker-js/faker')
const User = require('@models/user')
const mongoose = require('mongoose')
chai.use(chaiHttp)

describe('User Controller - CheckEmail', () => {
  const user = {
    email: faker.internet.email(),
    password: 'testPassword123!',
    testUser: true
  }

  before(async () => {
    await new User(user).save()
  })

  after(async () => {
    await User.deleteMany({ testUser: true })
    await mongoose.disconnect()
    await server.close()
  })

  describe('POST /api/user/checkEmail', () => {
    it('should return true when the email is valid', async () => {
      const res = await chai.request(server).post('/api/user/checkEmail').send({
        email: user.email
      })
      console.log(res.body)
      expect(res).to.have.status(200)
      expect(res.body).to.be.a('object')
      expect(res.body.valid).to.be.true
    })

    it('should return false when the email is wrong', async () => {
      const res = await chai.request(server).post('/api/user/checkEmail').send({
        email: faker.internet.email()
      })
      expect(res).to.have.status(200)
      expect(res.body).to.be.a('object')
      expect(res.body.valid).to.be.false
    })

    it('should return 400 when the email is invalid', async () => {
      const res = await chai.request(server).post('/api/user/checkEmail').send({
        email: 'invalidEmail'
      })
      expect(res).to.have.status(400)
      expect(res.body).to.be.a('object')
      expect(res.body.error).to.contains('"email" must be a valid email')
      expect(res.body.valid).to.be.undefined
    })
  })
})
