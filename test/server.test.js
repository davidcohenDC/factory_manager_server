require('module-alias/register')
const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const { initializeServer, closeServer } = require('@test/api/utils/helper')
chai.use(chaiHttp)

describe('Test Server ', () => {
  let server

  before(async () => {
    server = await initializeServer()
  })

  after(async () => {
    await closeServer(server)
  })

  describe('Health Check', () => {
    it('should return 200', async () => {
      const res = await chai.request(server).get('/health')
      expect(res).to.have.status(200)
      expect(res.body).to.be.a('object')
      expect(res.body).to.have.property('status')
      expect(res.body.status).to.equal('OK')
    })

    it('should return 404', async () => {
      const res = await chai.request(server).get('/health1')
      expect(res).to.have.status(404)
    })
  })

  describe('Socket Demo', () => {
    it('should return 200', async () => {
      const res = await chai.request(server).get('/socketdemo')
      expect(res).to.have.status(200)
      expect(res).to.be.html
    })

    it('should return 404', async () => {
      const res = await chai.request(server).get('/health1')
      expect(res).to.have.status(404)
    })
  })

  // describe('Status Monitor', () => {
  //     it('should return 200', async () => {
  //         const res = await chai.request(server).get('/status')
  //         expect(res).to.have.status(200);
  //         expect(res).to.be.html;
  //     })
  //
  //     it('should return 404', async () => {
  //         const res = await chai.request(server).get('/health1')
  //         expect(res).to.have.status(404);
  //     })
  // })

  describe('Documentation', () => {
    it('should return 200', async () => {
      const res = await chai.request(server).get('/api/docs')
      expect(res).to.have.status(200)
      expect(res).to.be.html
      expect(res.text).to.include('Swagger UI')
      expect(res.text).to.include('swagger-ui.css')
      expect(res.text).to.include('swagger-ui-bundle.js')
      expect(res.text).to.include('swagger-ui-standalone-preset.js')
    })

    it('should return 404', async () => {
      const res = await chai.request(server).get('/health1')
      expect(res).to.have.status(404)
    })
  })
})
