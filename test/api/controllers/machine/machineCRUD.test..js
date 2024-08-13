require('module-alias/register')
const Machine = require('@root/persistence/mongoose/models/machine')
const { generateCRUDTests } = require('@test/api/utils/helper/')
const {expectError, initializeServer, closeServer} = require('@test/api/utils/helper')
const { machineData, machineDataTwo } = require('@test/api/controllers/machine/')

const requiredFields = [
  { fieldName: 'serial' },
  { fieldName: 'name' },
  { fieldName: 'location' }
];


const validationFields = []

describe('Machine Controller - CRUD', () => {
  generateCRUDTests(
      'machine',
      Machine,
      machineData,
      machineDataTwo,
      requiredFields,
      validationFields,
      { expectError, initializeServer, closeServer },
      { create: true, read: true, update: true, delete: true }
  )
})