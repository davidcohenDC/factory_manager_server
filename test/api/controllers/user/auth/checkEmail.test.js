require('module-alias/register')
const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const User = require('@root/persistence/mongoose/models/user')
const {
  expectError,
  initializeServer,
  closeServer
} = require('@test/api/utils/helper')
const { userData } = require('@test/api/controllers/user')
chai.use(chaiHttp)

describe('User Controller - CheckEmail', () => {
  let server
  // Setup: start the server before tests
  before(async () => {
    server = await initializeServer()
    await new User(userData).save()
  })

  after(async () => {
    await User.deleteMany({ test: true })
    await closeServer(server)
  })

  describe('POST /api/user/checkEmail', () => {
    it('should return true when the email exists', async () => {
      const res = await chai.request(server).post('/api/user/checkEmail').send({
        email: userData.email
      })
      expect(res).to.have.status(200)
      expect(res.body).to.be.a('object')
      expect(res.body.valid).to.be.true
    })
    it('should return error when the email does not exist', async () => {
      const res = await chai
        .request(server)
        .post('/api/user/checkEmail')
        .send({ email: 'notexist@notexist.it ' })
      console.log(res.body)
      expect(res, 200, 'Email does not exist')
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
