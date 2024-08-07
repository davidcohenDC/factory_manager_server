require('module-alias/register')
const { faker } = require('@faker-js/faker')
const User = require('@models/user')
const { expectError, initializeServer, closeServer } = require('@test/api/utils/helper')
const { generateCRUDTests } = require('@test/api/utils/helper/')
const { userData, userDataTwo } = require('@test/api/controllers/user/')

  delete userData._id
  delete userDataTwo._id


const requiredFields = [
  // { fieldName: 'email', value: faker.internet.email().toLowerCase() },
  // { fieldName: 'password', value: 'Password123!'},
  // { fieldName: 'role', value: 'worker' }
]

const validationFields = [
  {
    name: 'invalid email',
    userData: { email: 'invalidEmail', password: 'password123!', role: 'worker', test: true },
    expectedError: '"email" must be a valid email',

  },
  {
    name: 'invalid password',
    userData: { email: faker.internet.email(), password: 'hi', role: 'worker', test: true },
    expectedError: '"password" must contain at least 8 characters'
  }
]

describe('User Controller - CRUD', () => {
  generateCRUDTests(
    'user',
    User,
    userData,
    userDataTwo,
    requiredFields,
    validationFields,
    { expectError, initializeServer, closeServer },
      { create: true, read: true, update: true, delete: true }
  )
})