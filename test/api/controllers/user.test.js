const chaiHttp = require('chai-http');
const { chai, server, expect, TEST_DB_URI} = require('../utils/userTestUtils');
const {createUser, updateUserModel, commonBeforeHook, commonAfterHook, commonBeforeEachHook, commonAfterEachHook
} = require('../utils/userTestUtils');
const { testController } = require('../utils/baseControllerFunction');

chai.use(chaiHttp);
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

        describe('POST /api/user/login', () => {

            const options = {
                credentials: { email: userInserted.email, password: userInserted.password },
                url: '/api/user/login',
                method: 'post',
                expectations: []
            }

            it('logins successfully and returns a token', async () => {
                options.expectations =[(response) => {
                        expect(response.status).to.equal(200);
                        expect(response.body).to.have.property('token');
                        expect(response.body.token).to.be.a('string');
                    }]
                await testController(options);
            });

            it('fails with wrong password', async () => {
                options.credentials.password = 'wrongpassword';
                options.expectations =[(response) => {
                        expect(response.status).to.equal(401);
                        expect(response.body).to.have.property('error');
                    }]
                await testController(options);
            });
        });

    });

    describe('User Check Email', () => {

        const options = {
            credentials: { email: userInserted.email },
            url: '/api/user/checkemail',
            method: 'post',
            expectations: []
        }

        describe('GET /api/user/checkemail/', () => {

            it('email exist and return boolean exist true', async () => {
                options.expectations =[(response) => {
                        expect(response.status).to.equal(200);
                        expect(response.body).to.have.property('exists');
                        expect(response.body.exists).to.equal(true);
                    }]
                await testController(options);

            });
        });
    });

    describe('User CRUD', () => {

        it('should create a new user and return the user email', done => {
            chai.request(server)
                .post('/api/user')
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
                .post('/api/user')
                .send(userWithoutEmail)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res.status).to.equal(400);
                    done();
                });
        });
    });
});




