require('module-alias/register')
const Area = require('@root/persistence/mongoose/models/area')
const { generateCRUDTests } = require('@test/api/utils/helper/')
const {
  expectError,
  initializeServer,
  closeServer
} = require('@test/api/utils/helper')
const {
  machineData,
  machineDataTwo
} = require('@test/api/controllers/machine/')

const areaDataPre = {
  name: 'Main Area 4',
  size: 100,
  machines: [machineData],
  subAreas: [
    {
      name: 'Sub Area 2',
      size: 50,
      machines: [machineDataTwo]
    }
  ],
  test: true
}

const areaDataPost = {
  name: 'Test Area 3',
  size: 100,
  machines: [machineDataTwo],
  subAreas: [
    {
      name: 'Test Sub Area 2',
      size: 50,
      machines: [machineData]
    }
  ],
  test: true
}

// All required fields
const requiredFields = [{ fieldName: 'name' }, { fieldName: 'size' }]

const validationFields = []

describe('Machine Controller - CRUD', function() {
  this.timeout(5000)
  generateCRUDTests(
    'area',
    Area,
    areaDataPre,
    areaDataPost,
    requiredFields,
    validationFields,
    { expectError, initializeServer, closeServer },
    { create: true, read: true, update: true, delete: true }
  )
})
