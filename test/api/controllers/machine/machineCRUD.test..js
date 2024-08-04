require('module-alias/register')
const { faker } = require('@faker-js/faker')
const mongoose = require('mongoose')
const Machine = require('@models/machine')
const { generateCRUDTests } = require('@test/api/utils/helper/')
const {
  expectError,
  initializeServer,
  closeServer
} = require('@test/api/utils/helper')

let id = new mongoose.Types.ObjectId().toString()

const machineDataPre = {
  machineId: faker.internet.userName({ firstName: `TestMachine${Date.now()}` }),
  name: 'Test Machine 2',
  location: {
    area: 'Test Area'
  },
  machineState: {
    currentState: 'operational',
    anomalyDetails: []
  },
  specifications: {
    powerConsumption: {
      normalRange: {
        min: mongoose.Types.Decimal128.fromString('150.00').toString(),
        max: mongoose.Types.Decimal128.fromString('500.00').toString()
      }
    },
    emissions: {
      normalRange: {
        min: mongoose.Types.Decimal128.fromString('0.50').toString(),
        max: mongoose.Types.Decimal128.fromString('1.50').toString()
      }
    },
    operatingTemperature: {
      normalRange: {
        min: mongoose.Types.Decimal128.fromString('10.00').toString(),
        max: mongoose.Types.Decimal128.fromString('35.00').toString()
      }
    },
    humidity: {
      normalRange: {
        min: mongoose.Types.Decimal128.fromString('30.00').toString(),
        max: mongoose.Types.Decimal128.fromString('60.00').toString()
      }
    }
  },
  turns: [
    {
      turn: 'morning',
      userId: new mongoose.Types.ObjectId().toString(),
      name: {
        first: 'John',
        last: 'Doe'
      }
    }
  ],
  test: true
}

const machineDataPost = {
  machineId: faker.internet.userName({ firstName: `TestMachine${Date.now()}` }),
  name: 'Test Machine 3',
  location: {
    area: 'Test Area'
  },
  machineState: {
    currentState: 'stand-by',
    anomalyDetails: []
  },
  specifications: {
    powerConsumption: {
      normalRange: {
        min: mongoose.Types.Decimal128.fromString('150.00').toString(),
        max: mongoose.Types.Decimal128.fromString('500.00').toString()
      }
    },
    emissions: {
      normalRange: {
        min: mongoose.Types.Decimal128.fromString('0.50').toString(),
        max: mongoose.Types.Decimal128.fromString('1.50').toString()
      }
    },
    operatingTemperature: {
      normalRange: {
        min: mongoose.Types.Decimal128.fromString('10.00').toString(),
        max: mongoose.Types.Decimal128.fromString('35.00').toString()
      }
    },
    humidity: {
      normalRange: {
        min: mongoose.Types.Decimal128.fromString('30.00').toString(),
        max: mongoose.Types.Decimal128.fromString('60.00').toString()
      }
    }
  },
  // turns: [
  //   {
  //     turn: 'morning',
  //     userId: new mongoose.Types.ObjectId().toString(),
  //     name: {
  //       first: 'aaa',
  //       last: 'vvv'
  //     }
  //   }
  // ],
  maintenance: {
    lastMaintenanceDate: new Date(),
    nextMaintenanceDate: new Date(),
    maintenanceHistory: [
      {
        date: new Date(),
        description: 'Initial setup'
      }
    ]
  },
  log: {
    lastPowerOn: new Date(),
    lastPowerOff: new Date(),
    sessions: [
      {
        powerOn: new Date(),
        powerOff: new Date(),
        duration: '8h'
      }
    ]
  },
  test: false
}

const requiredFields = [

  { fieldName: 'machineId', fieldValue: faker.internet.userName({ firstName: `TestMachine${Date.now()}` }) },
  { fieldName: 'name', fieldValue: 'DummyName' },
  { fieldName: 'location', fieldValue: { area: 'DummyArea' } },
  // { fieldName: 'machineState', fieldValue: { currentState: 'operational' } },
  { fieldName: 'specifications', fieldValue: { powerConsumption: { normalRange: { min: '150.00', max: '500.00' } } } },
  // { fieldName: 'turns', fieldValue: [{ turn: 'morning', userId: new mongoose.Types.ObjectId().toString(), userName: 'John Doe' }] }
]


const validationFields = [
  {
    name: 'Test Machine',
    location: {
      area: 'Test Area',
      machineState: {
        currentState: 'operational',
        anomalyDetails: []
      },
      specifications: {
        powerConsumption: {
          normalRange: {
            min: '150.00',
            max: '500.00'
          }
        },
        emissions: {
          normalRange: {
            min: '0.50',
            max: '1.50'
          }
        },
        operatingTemperature: {
          normalRange: {
            min: '10.00',
            max: '35.00'
          }
        },
        humidity: {
          normalRange: {
            min: '30.00',
            max: '60.00'
          }
        }
      },
      turns: [
        {
          turn: 'morning',
          userId: new mongoose.Types.ObjectId().toString(),
          name: {
            first: 'John',
            last: 'Doe'
          }
        }
      ],
      test: true
    },
    expectedError: '"machineId" is required'
  },
  {
    machineId: faker.internet.userName({ firstName: `TestMachine${Date.now()}` }),
    location: {
      area: 'Test Area',
      machineState: {
        currentState: 'operational',
        anomalyDetails: []
      },
      specifications: {
        powerConsumption: {
          normalRange: {
            min: '150.00',
            max: '500.00'
          }
        },
        emissions: {
          normalRange: {
            min: '0.50',
            max: '1.50'
          }
        },
        operatingTemperature: {
          normalRange: {
            min: '10.00',
            max: '35.00'
          }
        },
        humidity: {
          normalRange: {
            min: '30.00',
            max: '60.00'
          }
        }
      },
      turns: [
        {
          turn: 'morning',
          userId: new mongoose.Types.ObjectId().toString(),
            name: {
                first: 'Marco',
                last: 'Rossi'
            }
        }
      ],
      test: true
    },
    expectedError: '"machineId" is required'
  }
]

describe('Machine Controller - CRUD', () => {
  generateCRUDTests(
      'machine',
      Machine,
      machineDataPre,
      machineDataPost,
      requiredFields,
      validationFields,
      { expectError, initializeServer, closeServer }
  )
})