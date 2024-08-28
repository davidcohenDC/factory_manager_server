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
const { userData } = require('@test/api/controllers/user/')
chai.use(chaiHttp)

describe('User Controller - GetUserByEmail', () => {
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

  describe('GET /api/user/email/:email', () => {
    it('should return user when the email exists', async () => {
      const res = await chai
        .request(server)
        .get(`/api/user/email/${userData.email}`)
      expect(res).to.have.status(200)
      expect(res.body).to.be.a('object')
      expect(res.body.email).to.equal(userData.email.toLocaleLowerCase())
    })
    it('should fail and return 404 when the email does not exist', async () => {
      const res = await chai.request(server).get('/api/user/email/123@123.123)') // invalid email
      expectError(res, 404, 'User not found')
    })
  })
})
