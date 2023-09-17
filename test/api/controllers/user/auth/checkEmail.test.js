require('module-alias/register')
const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const { faker } = require('@faker-js/faker')
const User = require('@models/user')
const {
  expectError,
  initializeServer,
  closeServer
} = require('@test/api/utils/helper')
chai.use(chaiHttp)

describe('User Controller - CheckEmail', () => {
  const user = {
    email: faker.internet.email(),
    password: 'testPassword123!',
    testUser: true
  }

  let server;
  // Setup: start the server before tests
  before(async () => {
    server = await initializeServer()
    await new User(user).save()
  })

  after(async () => {
    await User.deleteMany({ testUser: true })
    await closeServer(server)
  })

  describe('POST /api/user/checkEmail', () => {
    it('should return true when the email exists', async () => {
      const res = await chai.request(server).post('/api/user/checkEmail').send({
        email: user.email
      })
      expect(res).to.have.status(200)
      expect(res.body).to.be.a('object')
      expect(res.body.valid).to.be.true
    })

    it("should return false when the email doesn't exist", async () => {
      const res = await chai.request(server).post('/api/user/checkEmail').send({
        email: faker.internet.email()
      })
      expect(res).to.have.status(200)
      expect(res.body).to.be.a('object')
      expect(res.body.valid).to.be.false
    })

    const invalidUserInputs = [
      {
        name: 'missing email',
        userData: { password: 'password123!' },
        expectedError: '"email" is required'
      },
      {
        name: 'invalid email',
        userData: { email: 'invalidEmail', password: 'password123!' },
        expectedError: '"email" must be a valid email'
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
