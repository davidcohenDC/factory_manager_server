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

describe('User Controller - GetUserByEmail', () => {
    const user = {
        email: faker.internet.email(),
        password: 'testPassword123!',
        testUser: true
    }
    let server // This will be our test server

    // Setup: start the server before tests
    before(async () => {
        server = await initializeServer()
        await new User(user).save()
    })

    after(async () => {
        await User.deleteMany({ testUser: true })
        await closeServer(server)
    })

    describe('GET /api/user/email/:email', () => {
        it('should return user when the email exists', async () => {
            const res = await chai.request(server).get(`/api/user/email/${user.email}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.a('object')
            expect(res.body.email).to.equal(user.email.toLocaleLowerCase())
        })
        it('should fail and return 404 when the email does not exist', async () => {
            const res = await chai.request(server).get('/api/user/email/123@123.123)') // invalid email
            expectError(res, 404, 'User not found')
        })
    })
})