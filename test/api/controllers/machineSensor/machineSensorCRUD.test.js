require('module-alias/register')
const MachineSensor = require('@persistence/mongoose/models/machineSensor')
const { generateCRUDTests } = require('@test/api/utils/helper/')
const {
  expectError,
  initializeServer,
  closeServer
} = require('@test/api/utils/helper')
const {
  machineSensorData,
  machineSensorDataTwo
} = require('@test/api/controllers/machineSensor/')

const requiredFields = []

const validationFields = []

describe('Machine Sensor Controller - CRUD', () => {
  generateCRUDTests(
    'machine-sensor',
    MachineSensor,
    machineSensorData,
    machineSensorDataTwo,
    requiredFields,
    validationFields,
    { expectError, initializeServer, closeServer },
    { create: false, read: true, update: false, delete: false }
  )
})
