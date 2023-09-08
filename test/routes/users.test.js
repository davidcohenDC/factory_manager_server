const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const server = require('../../src');
const expect = chai.expect;

chai.use(chaiHttp);

// Use a separate test environment
process.env.NODE_ENV = 'test';
const DB_URI = process.env.TEST_DB_URI;

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

    describe('POST /api/users', () => {

        it('should create a new user and return the user data', done => {
            const user = {
                name: "John Doe",
                email: "test123@test123",
                password: "password123",
                testUser: true
            };

            chai.request(server)
                .post('/api/users')
                .send(user)
                .end((err, res) => {
                    if (err) {
                        console.error(err);
                        return done(err);
                    }

                    expect(res.status).to.equal(201);
                    expect(res.body).to.have.property('user');
                    expect(res.body.user.name).to.equal(user.name);
                    expect(res.body.user.email).to.equal(user.email);
                    done();
                });
        });

        it('should return 400 when the email or password is missing', done => {
            const user = {
                name: "John Doe"
            };

            chai.request(server)
                .post('/api/users')
                .send(user)
                .end((err, res) => {
                    if (err) {
                        console.error(err);
                        return done(err);
                    }

                    expect(res.status).to.equal(400);
                    done();
                });
        });
    });

    describe('GET /api/users', () => {

        it('should retrieve all the users', done => {
            chai.request(server)
                .get('/api/users')
                .end((err, res) => {
                    if (err) {
                        console.error(err);
                        return done(err);
                    }

                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });
});
