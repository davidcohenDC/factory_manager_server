const mongoose = require("mongoose");

const machineData = {
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

const machineDataTwo = {
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

module.exports = { machineData, machineDataTwo }
