require('module-alias/register')
const { faker } = require('@faker-js/faker')
const Machine = require('@models/machine')
const { generateCRUDTests } = require('@test/api/utils/helper/')
const { expectError, initializeServer, closeServer } = require('@test/api/utils/helper');


const machineDataPre = {
  name: 'Test Machine 2',
  machineId: faker.internet.userName({firstName: `TestMachine${Date.now()}`}),
  location: {
    area: "Test Area"
  },
  status: {
    operational: true,
    currentAnomalies: []
  }
}

const machineDataPost = {
  name: 'Test Machine 3',
  machineId: faker.internet.userName({firstName: `TestMachine${Date.now()}`}),
  location: {
    area: "Test Area"
  },
  status: {
    operational: true,
    currentAnomalies: []
  }
}
const requiredFields = [
  { fieldName: "machineId", fieldValue: "DummyId"},
  { fieldName: "name", fieldValue: "DummyName" },
  { fieldName: "location.area", fieldValue: "DummyArea" },
];

const validationFields = []

describe('Machine Controller - CRUD', () => {
  generateCRUDTests('machine', Machine, machineDataPre,machineDataPost, requiredFields,validationFields,
      { expectError, initializeServer, closeServer });
})
