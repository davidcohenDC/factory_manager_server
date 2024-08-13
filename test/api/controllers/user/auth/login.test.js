require('module-alias/register')
const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const { faker } = require('@faker-js/faker')
const User = require('@root/persistence/mongoose/models/user')
const {expectError, initializeServer, closeServer} = require('@test/api/utils/helper')
const { userData } = require('@test/api/controllers/user/')
const {userDataTwo} = require("@test/api/controllers/user");
chai.use(chaiHttp)

describe('User Controller - Login', () => {
  let server // This will be our test server

  // Setup: start the server before tests
  before(async () => {
    server = await initializeServer()
    await new User(userData).save()
  })

  after(async () => {
    await User.deleteMany({ test: true })
    await closeServer(server)
  })

  describe('POST /api/user/login', () => {
    it('should login successfully and return a token', async () => {
      const res = await chai.request(server).post('/api/user/login').send({
        email: userData.email,
        password: userData.password
      })

      expect(res).to.have.status(200)
      expect(res.body).to.be.a('object')
      expect(res.body.token).to.be.a('string')
      expect(res.body.token).to.not.be.empty
    })

    it('should fails and return 401 to login with wrong password', async () => {
      const res = await chai.request(server).post('/api/user/login').send({
        email: userData.email,
        password: 'wrongPassword123!'
      })
      expect(res).to.have.status(401)
      expect(res.body).to.be.a('object')
      expect(res.body.error).to.equal('Invalid email or password')
      expect(res.body.token).to.be.undefined
    })

    it('should fails and return 401 to login with wrong email', async () => {
      const res = await chai.request(server).post('/api/user/login').send({
        email: faker.internet.email(),
        password: userData.password
      })
      expect(res).to.have.status(401)
      expect(res.body).to.be.a('object')
      expect(res.body.error).to.equal('Invalid email or password')
      expect(res.body.token).to.be.undefined
    })

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
})
