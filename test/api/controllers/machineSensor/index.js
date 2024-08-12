const mongoose = require('mongoose');
const { machineData, machineDataTwo } = require('@test/api/controllers/machine/')

const machineSensorData = {
    serial: machineData.serial,
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
    serial: machineDataTwo.serial,
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

module.exports = {
    machineSensorData,
    machineSensorDataTwo
}