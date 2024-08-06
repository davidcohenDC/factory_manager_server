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

const machineDataPre = {
  name: 'First Machine',
  machineId: "Machine1",
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
  ],
  test: true
}

const machineDataPost = {
  name: 'Second Machine',
  machineId: "Machine2",
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
  ],
    test: true
}

const requiredFields = [
  { fieldName: 'name' },
  { fieldName: 'location' },
  { fieldName: 'machineState' },
]


const validationFields = [
  // {
  //   name: 'Test Machine',
  //   location: {
  //     area: 'Test Area',
  //     machineState: {
  //       currentState: 'operational',
  //       anomalyDetails: []
  //     },
  //     specifications: {
  //       powerConsumption: {
  //         normalRange: {
  //           min: '150.00',
  //           max: '500.00'
  //         }
  //       },
  //       emissions: {
  //         normalRange: {
  //           min: '0.50',
  //           max: '1.50'
  //         }
  //       },
  //       operatingTemperature: {
  //         normalRange: {
  //           min: '10.00',
  //           max: '35.00'
  //         }
  //       },
  //       humidity: {
  //         normalRange: {
  //           min: '30.00',
  //           max: '60.00'
  //         }
  //       }
  //     },
  //     turns: [
  //       {
  //         turn: 'morning',
  //         userId: new mongoose.Types.ObjectId().toString(),
  //         name: {
  //           first: 'John',
  //           last: 'Doe'
  //         }
  //       }
  //     ],
  //     test: true
  //   },
  //   expectedError: '"machineId" is required'
  // },
  // {
  //   machineId: faker.internet.userName({ firstName: `TestMachine${Date.now()}` }),
  //   location: {
  //     area: 'Test Area',
  //     machineState: {
  //       currentState: 'operational',
  //       anomalyDetails: []
  //     },
  //     specifications: {
  //       powerConsumption: {
  //         normalRange: {
  //           min: '150.00',
  //           max: '500.00'
  //         }
  //       },
  //       emissions: {
  //         normalRange: {
  //           min: '0.50',
  //           max: '1.50'
  //         }
  //       },
  //       operatingTemperature: {
  //         normalRange: {
  //           min: '10.00',
  //           max: '35.00'
  //         }
  //       },
  //       humidity: {
  //         normalRange: {
  //           min: '30.00',
  //           max: '60.00'
  //         }
  //       }
  //     },
  //     turns: [
  //       {
  //         turn: 'morning',
  //         userId: new mongoose.Types.ObjectId().toString(),
  //           name: {
  //               first: 'Marco',
  //               last: 'Rossi'
  //           }
  //       }
  //     ],
  //     test: true
  //   },
  //   expectedError: '"machineId" is required'
  // }
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