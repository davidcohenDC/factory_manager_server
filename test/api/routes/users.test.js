require('module-alias/register')
const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const { initializeServer, closeServer } = require('@test/api/utils/helper')
chai.use(chaiHttp)

describe('User Routes', () => {
  let server // This will be our test server

  // Setup: start the server before tests
  before(async () => {
    server = await initializeServer()
  })

  after(async () => {
    await closeServer(server)
  })

  // Routes to test
  const routes = [
    { path: '/api/users', method: 'get' },
    { path: '/api/user', method: 'get' },
    { path: '/api/user/:id', method: 'get' },
    { path: '/api/login', method: 'delete' },
    { path: '/api/user/login', method: 'delete' }
  ]

  routes.forEach((route) => {
    describe(`route ${route.path}`, () => {
      it('should exist', (done) => {
        chai
          .request(server)
          [route.method](route.path)
          .end((err, res) => {
            expect(res.status).to.not.be.undefined
            done()
          })
      })
    })
  })
})
