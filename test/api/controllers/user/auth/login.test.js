require('module-alias/register')
const server = require('@root/app')
const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const { faker } = require('@faker-js/faker')
const User = require('@models/user')
chai.use(chaiHttp)

describe('User Controller - Login', () => {
  const user = {
    email: faker.internet.email(),
    password: 'testPassword123!',
    testUser: true
  }

  before(async () => {
    await new User(user).save()
  })

  after(() => {
    User.deleteMany({ testUser: true }).then(() => {
      mongoose.disconnect().then(() => {
        server.close()
      })
    })
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
