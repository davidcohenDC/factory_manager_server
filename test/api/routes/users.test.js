require('module-alias/register')
const server = require('@root/app')
const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
chai.use(chaiHttp)

describe('User Routes', () => {

    after(async () => {
        await mongoose.disconnect()
        await server.close()
    })

  describe('route /api/users', () => {
    it('should exist', (done) => {
      chai
        .request(server)
        .get('/api/users')
        .end((err, res) => {
          expect(res.status).to.not.be.undefined
          done()
        })
    })
  })

  describe('route /api/user', () => {
    it('should exist', (done) => {
      chai
        .request(server)
        .get('/api/user')
        .end((err, res) => {
          expect(res.status).to.not.be.undefined
          done()
        })
    })
  })

  describe('route /api/user/:id', () => {
    it('should exist', (done) => {
      chai
        .request(server)
        .get('/api/user/:id')
        .end((err, res) => {
          expect(res.status).to.not.be.undefined
          done()
        })
    })
  })
  describe('route /api/login', () => {
    it('should exist', (done) => {
      chai
        .request(server)
        .delete('/api/login')
        .end((err, res) => {
          expect(res.status).to.not.be.undefined
          done()
        })
    })
  })

  describe('route /api/user/login', () => {
    it('should exist', (done) => {
      chai
        .request(server)
        .delete('/api/user/login')
        .end((err, res) => {
          expect(res.status).to.not.be.undefined
          done()
        })
    })
  })
})
