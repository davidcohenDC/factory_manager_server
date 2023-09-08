const bcrypt = require('bcrypt');
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
describe('User Model', () => {

    before(done => {
        // Connect to test database
        mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => done())
            .catch(err => done(err));
    });


    after((done) => {
        server.close(() => {
            User.deleteMany({ testUser: true })
                .then(() => mongoose.connection.close())
                .then(() => done())
                .catch(err => done(err));
        });
    });


    describe('Model Creation & Saving', () => {

        it('should create & save a user successfully', async () => {
            const userData = {
                name: "John Doe",
                email: "john@example.com",
                password: "password123",
                testUser: true
            };

            const user = new User(userData);
            const savedUser = await user.save();

            expect(savedUser._id).to.not.be.null;
            expect(savedUser.name).to.equal(userData.name);
            expect(savedUser.email).to.equal(userData.email);
            expect(savedUser.password).to.not.equal(userData.password);  // Password should be hashed
        });

        it('should throw a validation error when email is missing', async () => {
            const user = new User({
                name: "John A",
                password: "password123",
                testUser: true
            });

            let validationError;

            try {
                await user.save();
            } catch (error) {
                validationError = error;
            }

            expect(validationError).to.be.an.instanceof(mongoose.Error.ValidationError);
            expect(validationError).to.have.property('errors');
            expect(validationError.errors).to.have.property('email');
        });

    });

    describe('Password Hashing', () => {

        it('should hash the password before saving', async () => {
            const user = new User({
                name: "John Smith",
                email: "johnsmith@example.com",
                password: "password123",
                testUser: true
            });
            const savedUser = await user.save();

            const isMatch = await bcrypt.compare("password123", savedUser.password);
            expect(isMatch).to.be.true;
        });

    });

    describe('Unique Constraints', () => {

        it('should fail to save a user with a duplicate email', async () => {
            const user1 = new User({
                name: "John A",
                email: "duplicate@example.com",
                password: "password123",
                testUser: true
            });
            await user1.save();

            const user2 = new User({
                name: "John B",
                email: "duplicate@example.com",
                password: "password123",
                testUser: true
            });

            try {
                await user2.save();
                // if no error thrown by this line, test should fail:
                expect(true, "Expected an error but did not get one").to.be.false;
            } catch (error) {
                expect(error).to.have.property('name').which.equals('MongoServerError');
                expect(error.code).to.equal(11000);
            }
        });

    });

    describe('POST /api/users/login', () => {

        // Before testing login, create a sample user in the database
        beforeEach(async () => {
            const user = new User({
                name: "John Doe",
                email: "test123@test123",
                password: "password123", // in real-world, store a hashed password
                testUser: true
            });
            await user.save();
        });

        // After each deled the sample user test123@test123",
        afterEach(async () => {
            await User.deleteMany({ email: "test123@test123" });
        });

        it('should login successfully and return a token', done => {
            const credentials = {
                email: "test123@test123",
                password: "password123"
            };

            chai.request(server)
                .post('/api/users/login')
                .send(credentials)
                .end((err, res) => {
                    if (err) {
                        console.error(err);
                        return done(err);
                    }

                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('token');
                    done();
                });
        });

        it('should fail login with wrong password', done => {
            const credentials = {
                email: "test123@test123",
                password: "wrongPassword"
            };

            chai.request(server)
                .post('/api/users/login')
                .send(credentials)
                .end((err, res) => {
                    if (err) {
                        console.error(err);
                        return done(err);
                    }

                    expect(res.status).to.equal(401); // Unauthorized
                    done();
                });
        });
    });

});
