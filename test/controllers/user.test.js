const chaiHttp = require('chai-http');
const { chai, server, expect, TEST_DB_URI} = require('../utils/userTestUtils');
const {createUser, updateUserModel, commonBeforeHook, commonAfterHook, commonBeforeEachHook, commonAfterEachHook
} = require('../utils/userTestUtils');

chai.use(chaiHttp);

function testLogin(credentials, expectedStatus, propertyCheck) {
    return new Promise((resolve, reject) => {
        chai.request(server)
            .post('/api/users/login')
            .send(credentials)
            .end((err, res) => {
                if (err) return reject(err);
                expect(res.status).to.equal(expectedStatus);
                if (propertyCheck) {
                    expect(res.body).to.have.property(propertyCheck);
                }
                resolve(res);
            });
    });
}

describe('User Controller', () => {

    const userModel = {
        email: "john@example.com",
        password: "password123",
        testUser: true };

    const userInserted = updateUserModel(userModel, { email: "test123@test.com", password: "password345" });

    let userSaved = null;

    before(() => commonBeforeHook(TEST_DB_URI));

    after(commonAfterHook);

    beforeEach(async () => {
        userSaved = await commonBeforeEachHook(userInserted);
    });

    afterEach(commonAfterEachHook);

    describe('User Login', () => {

        describe('POST /api/users/login', () => {
            it('logins successfully and returns a token', async () => {
                await testLogin({email: userInserted.email, password: userInserted.password}, 200, 'token');
            });

            it('fails with wrong password', async () => {
                await testLogin({email: userInserted.email, password: "wrongPassword"}, 401);
            });
        });

    });

    describe('User CRUD', () => {

        it('should create a new user and return the user email', done => {
            chai.request(server)
                .post('/api/users')
                .send(userModel)
                .end((err, res) => {
                    if (err) {
                        console.error(err);
                        return done(err);
                    }

                    expect(res.status).to.equal(201);
                    expect(res.body).to.have.property('user');
                    expect(res.body.user.email).to.equal(userModel.email);
                    done();
                });
        });

        it('should return 400 when the email or password is missing', done => {
            const userWithoutEmail = createUser({ password: "password123", testUser: true })

            chai.request(server)
                .post('/api/users')
                .send(userWithoutEmail)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res.status).to.equal(400);
                    done();
                });
        });
    });
});




