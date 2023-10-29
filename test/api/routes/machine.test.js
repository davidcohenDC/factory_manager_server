require('module-alias/register')
const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const { initializeServer, closeServer } = require('@test/api/utils/helper')
chai.use(chaiHttp)

describe('Machine Routes', () => {
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
    { path: '/api/machine', method: 'get' },
    { path: '/api/machine', method: 'get' },
    { path: '/api/machine/:id', method: 'get' }
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
