require('module-alias/register')
const MachineSensor = require('@models/machineSensor')
const { generateCRUDTests } = require('@test/api/utils/helper/')
const {expectError, initializeServer, closeServer} = require('@test/api/utils/helper')
const { machineData, machineDataTwo } = require('@test/api/controllers/machine/')

const machineSensorData = {
        machineId: machineData.machineId,
        sensorData: [
                {
                        timestamp: new Date(),
                        powerConsumption: 100,
                        emissions: 100,
                        operatingTemperature: 100,
                        humidity: 100,
                        anomaly: false
                }
        ]
}

const machineSensorDataTwo = {
        machineId: machineDataTwo.machineId,
        sensorData: [
                {
                        timestamp: new Date(),
                        powerConsumption: 100,
                        emissions: 100,
                        operatingTemperature: 100,
                        humidity: 100,
                        anomaly: false
                }
        ]
}

const requiredFields = []

const validationFields = []

describe('Machine Sensor Controller - CRUD', () => {
  generateCRUDTests(
      'machineSensor',
      MachineSensor,
      machineSensorData,
      machineSensorDataTwo,
      requiredFields,
      validationFields,
      { expectError, initializeServer, closeServer },
      { create: false, read: true, update: false, delete: false }
  )
})