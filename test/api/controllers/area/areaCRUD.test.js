require('module-alias/register')
const { faker } = require('@faker-js/faker')
const Area = require('@models/area')
const { generateCRUDTests } = require('@test/api/utils/helper/')
const {
  expectError,
  initializeServer,
  closeServer
} = require('@test/api/utils/helper')
const mongoose = require("mongoose");

const first_machine = {
  name: 'First Machine',
  machineId: faker.internet.userName({ firstName: `TestMachine${Date.now()}` }),
  location: {
    area: 'Main Area 1'
  },
   machineState: {
     currentState: 'operational'
   },
  specifications: {
    powerConsumption: {
      normalRange: {
        min: 10,
        max: 100
      }
    },
    emissions: {
      normalRange: {
        min: 10,
        max: 100
      }
    },
    operatingTemperature: {
      normalRange: {
        min: 10,
        max: 100
      }
    }
  },
  turns: [
    {
      turn: 'morning',
      userId: new mongoose.Types.ObjectId().toString(),
    }
  ]
}

const second_machine = {
  name: 'Second Machine',
  machineId: faker.internet.userName({ firstName: `TestMachine${Date.now()}` }),
  location: {
    area: 'Test Area 1'
  },
    machineState: {
        currentState: 'operational'
    },
    specifications: {
        powerConsumption: {
            normalRange: {
                min: 10,
                max: 100
            }
        },
        emissions: {
            normalRange: {
                min: 10,
                max: 100
            }
        },
        operatingTemperature: {
            normalRange: {
                min: 10,
                max: 100
            }
        }
    },
    turns: [
      {
        turn: 'evening',
        userId: new mongoose.Types.ObjectId().toString(),
      }
    ]
}

const areaDataPre = {
  name: 'Main Area 4',
  size: 100,
  machines: [first_machine],
  subAreas: [
    {
      name: 'Sub Area 2',
      size: 50,
      machines: [second_machine]
    }
  ]
}

const areaDataPost = {
  name: 'Test Area 3',
  size: 100,
  machines: [second_machine],
  subAreas: [
    {
      name: 'Test Sub Area 2',
      size: 50,
      machines: [first_machine]
    }
  ]
}

// All required fields
const requiredFields = [
  { fieldName: 'name' },
  { fieldName: 'size' }
]

const validationFields = []

describe('Machine Controller - CRUD', () => {
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
