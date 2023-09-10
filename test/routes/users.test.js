const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const {connectToDb} = require("../../src/config/database");
const { chai, User, expect, TEST_DB_URI} = require('../utils/userTestUtils');
const {createUser, updateUserModel, commonBeforeHook, commonAfterHook, commonBeforeEachHook, commonAfterEachHook
} = require('../utils/userTestUtils');
// import the server
const server = require('../../src/app');

chai.use(chaiHttp);

describe('User Routes', () => {

    const userModel = {
        email: "john@example.com",
        password: "password123",
        testUser: true };

    const userInserted = updateUserModel(userModel, { email: "test123@test.com", password: "password345" });

    let userSaved = null;
    //
    // before(() => commonBeforeHook(TEST_DB_URI));
    //
    // after(commonAfterHook);
    //
    // beforeEach(async () => {
    //     userSaved = await commonBeforeEachHook(userInserted);
    // });
    //
    // afterEach(commonAfterEachHook);


    describe('GET /api/users', () => {

        it('should return status 200', done => {
            chai.request(server)
                .get('/api/users')
                .end((err, res) => {
                    console.log(res.body)
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    describe('POST /api/users', () => {
        it('should return status 201 on successful creation', done => {
            chai.request(server)
                .post('/api/users')
                .send(userModel)
                .end((err, res) => {
                    expect(res.status).to.equal(201); // 201 Created
                    done();
                });
        });
    });

    describe('PUT /api/users/:id', () => {

        it('should return status 200 on successful update', done => {
            chai.request(server)
                .put(`/api/users/${userSaved.id}`)
                .send(userModel)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    done();
                });
        });

    });
    describe('Error Routes', () => {

        it('should return 404 for non-existent routes', done => {
            chai.request(server)
                .get('/api/nonExistentRoute')
                .end((err, res) => {
                    expect(res.status).to.equal(404);
                    done();
                });
        });
    });
});

describe('User API', () => {

    before(done => {
        // Connect to test database
        mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => done())
            .catch(err => done(err));
    });


    after(async () => {
        await User.deleteMany({ testUser: true });
        mongoose.connection.close();
    });

});
