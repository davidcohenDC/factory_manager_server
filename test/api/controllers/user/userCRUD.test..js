require('module-alias/register')
const { faker } = require('@faker-js/faker')
const User = require('@models/user')
const { expectError, initializeServer, closeServer } = require('@test/api/utils/helper');
const { generateCRUDTests } = require('@test/api/utils/helper/')

const userDataPre = {
    email: faker.internet.email().toLowerCase(),
    password: 'Password123!'
}

const userData = {
    email: faker.internet.email().toLowerCase(),
    password: 'Password123!'
}

const requiredFields = [
    { fieldName: "email", fieldValue: faker.internet.email().toLowerCase() },
    { fieldName: "password", fieldValue: 'Password123!' }
];

const validationFields = [
    {
        name: 'invalid email',
        userData: { email: 'invalidEmail', password: 'password123!' },
        expectedError: '"email" must be a valid email'
    },
    {
        name: 'invalid password',
        userData: { email: faker.internet.email(), password: 'hi' },
        expectedError: '"password" must contain at least 8 characters'
    }
];

describe('User Controller - CRUD', () => {
    generateCRUDTests('user', User, userDataPre, userData, requiredFields, validationFields,
        { expectError, initializeServer, closeServer });
})
//   let server // This will be our test server
//   let userID = ''
//
//   //create the user
//   const user = {
//     email: faker.internet.email(),
//     password: 'Password123!'
//   }
//
//   // Setup: start the server before tests
//   before(async () => {
//     server = await initializeServer()
//     const userSaved = await new User({
//       email: faker.internet.email(),
//       password: 'Password123!'
//     }).save()
//     userID = userSaved._id
//   })
//
//   after(async () => {
//     await User.deleteMany({ test: true })
//     await closeServer(server)
//   })
//
//   describe('Create User', () => {
//     it('should create a new user', async () => {
//       const res = await chai.request(server).post('/api/user').send(user)
//       expect(res).to.have.status(201)
//       expect(res.body).to.be.a('object')
//       expect(res.body.user).to.have.property('_id')
//       expect(res.body.user.email).to.equal(user.email.toLowerCase())
//       expect(res.body.user.password).to.not.equal(user.password)
//     })
//
//     it('should return 400 when the email is already in use', async () => {
//       await chai.request(server).post('/api/user').send(user)
//
//       const res = await chai.request(server).post('/api/user').send(user)
//
//       expectError(res, 400, 'user is already taken.')
//     })
//
//     const invalidInputs = [
//       {
//         name: 'missing email',
//         userData: { password: 'password123!' },
//         expectedError: '"email" is required'
//       },
//       {
//         name: 'missing password',
//         userData: { email: faker.internet.email() },
//         expectedError: '"password" is required'
//       },

//     ]
//
//     //Validation tests
//     invalidInputs.forEach((testCase) => {
//       it(`should return 400 when ${testCase.name}`, async () => {
//         const res = await chai
//           .request(server)
//           .post('/api/user')
//           .send(testCase.userData)
//         expectError(res, 400, testCase.expectedError)
//       })
//     })
//   })
//
//   describe('Get User', () => {
//     it('should return the user', async () => {
//       if (userID === '') this.skip()
//       const res = await chai.request(server).get(`/api/user/${userID}`)
//
//       expect(res).to.have.status(200)
//       expect(res.body).to.be.a('object')
//       expect(res.body.user).to.have.property('_id')
//       expect(res.body.user.password).to.not.equal(user.password)
//     })
//
//     it('should return 404 when the user is not valid', async () => {
//       if (userID === '') this.skip()
//       const res = await chai.request(server).get(`/api/user/123`)
//       expectError(res, 400, '"id" length must be 24 characters long')
//     })
//
//     it('should return 404 when the user is not found', async () => {
//       if (userID === '') this.skip()
//       const res = await chai
//         .request(server)
//         .get(`/api/user/000000000000000000000001`)
//
//       expectError(res, 404, 'user not found.')
//     })
//   })
//   describe('Get All Users', () => {
//     it('should return all users', async () => {
//       const res = await chai.request(server).get(`/api/user`)
//
//       expect(res).to.have.status(200)
//       expect(res.body).to.be.a('object')
//       expect(res.body.user).to.be.a('array')
//       if (res.body.user.length > 0) {
//         expect(res.body.user.length).to.be.greaterThan(0)
//         expect(res.body.user[0]).to.have.property('_id')
//       }
//     })
//
//     //   use pagination in the request, the offset and limit using testing adding user
//     it('should limit the users', async () => {
//       const all = await chai.request(server).get(`/api/user`)
//       const res = await chai.request(server).get(`/api/user?limit=5`)
//
//       expect(res).to.have.status(200)
//       expect(res.body).to.be.a('object')
//       expect(res.body.user).to.be.a('array')
//       expect(res.body.user.length).to.be.equal(5)
//       for (let i = 0; i < 5; i++) {
//         expect(res.body.user[i]._id).to.be.equal(all.body.user[i]._id)
//       }
//     })
//
//     it('should offset the users', async () => {
//       const all = await chai.request(server).get(`/api/user`)
//       const res = await chai.request(server).get(`/api/user?offset=5`)
//
//       expect(res).to.have.status(200)
//       expect(res.body).to.be.a('object')
//       expect(res.body.user).to.be.a('array')
//       if((res.body.user.length) < process.env.ITEMS_PER_PAGE) {
//         expect(res.body.user.length).to.be.equal(
//           parseInt(res.body.user.length)
//         )
//       } else {
//         expect(res.body.user.length).to.be.equal(
//           parseInt(process.env.ITEMS_PER_PAGE)
//         )
//       }
//       for (let i = 0; i < all.body.user.length - 5; i++) {
//         expect(res.body.user[i]._id).to.be.equal(all.body.user[i + 5]._id)
//       }
//     })
//
//     it('should limit and offset the users', async () => {
//       const all = await chai.request(server).get(`/api/user`);
//       const totalUsers = all.body.user.length;
//
//       // Calculate the expected length
//       const expectedLength = Math.min(5, totalUsers - 5); // -5 because we offset by 5
//
//       const res = await chai.request(server).get(`/api/user?offset=5&limit=5`);
//
//       expect(res).to.have.status(200);
//       expect(res.body).to.be.a('object');
//       expect(res.body.user).to.be.a('array');
//       expect(res.body.user.length).to.be.equal(expectedLength);
//
//       for (let i = 0; i < expectedLength; i++) {
//         expect(res.body.user[i]._id).to.be.equal(all.body.user[i + 5]._id);
//       }
//     });
//
//     //   check the max limit
//     it('should limit the users to max limit', async () => {
//       const res = await chai.request(server).get(`/api/user?limit=200`)
//
//       expect(res).to.have.status(400)
//       expect(res.body).to.be.a('object')
//       expect(res.body.error).to.be.equal(
//         `Limit should not exceed ${process.env.MAX_ITEMS_PER_PAGE} items per request.`
//       )
//     })
//   })
//
//   //using patch
//   describe('Update User', () => {
//     it('should update the user', async () => {
//       if (userID === '') this.skip()
//       const res = await chai
//         .request(server)
//         .patch(`/api/user/${userID}`)
//         .send({ email: faker.internet.email() })
//
//       expect(res).to.have.status(200)
//       expect(res.body).to.be.a('object')
//       expect(res.body.user).to.have.property('_id')
//       expect(res.body.user.email).to.not.equal(user.email)
//     })
//
//     it('should return 404 when the user is not valid', async () => {
//       if (userID === '') this.skip()
//       const res = await chai.request(server).patch(`/api/user/123`)
//
//       expectError(res, 400, '"id" length must be 24 characters long')
//     })
//
//     it('should return 404 when the user is not found', async () => {
//       if (userID === '') this.skip()
//       const res = await chai
//         .request(server)
//         .patch(`/api/user/000000000000000000000001`)
//
//       expectError(res, 404, 'user not found.')
//     })
//
//     it('should return 400 when the email is invalid', async () => {
//       if (userID === '') this.skip()
//       const res = await chai
//         .request(server)
//         .patch(`/api/user/${userID}`)
//         .send({ email: 'invalidEmail' })
//
//       expectError(res, 400, 'Validation failed: email:')
//     })
//   })
//
//   describe('Delete User', () => {
//     let savedUser
//
//     beforeEach(async () => {
//       savedUser = await new User({
//         email: faker.internet.email(),
//         password: 'Password123!'
//       }).save()
//     })
//
//     it('should delete the user', async () => {
//       const res = await chai
//         .request(server)
//         .delete(`/api/user/${savedUser._id}`)
//
//       expect(res).to.have.status(200)
//       expect(res.body).to.be.a('object')
//       expect(res.body.message).to.equal('user deleted successfully')
//     })
//
//     it('should return 404 when the user is not valid', async () => {
//       if (userID === '') this.skip()
//       const res = await chai.request(server).delete(`/api/user/123`)
//
//       expectError(res, 400, '"id" length must be 24 characters long')
//     })
//
//     it('should return 404 when the user is not found', async () => {
//       if (userID === '') this.skip()
//       const res = await chai
//         .request(server)
//         .delete(`/api/user/000000000000000000000001`)
//
//       expectError(res, 404, 'user not found.')
//     })
//   })
// })
