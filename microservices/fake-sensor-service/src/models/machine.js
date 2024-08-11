const mongoose = require('mongoose');
const { Schema } = mongoose;

const machineSchema = new Schema({
    machineId: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    location: {
        area: {
            type: String,
            required: true
        }
    },
    machineState: {
        currentState: {
            type: String,
            enum: ['operational', 'anomaly', 'off'],
            required: true
        },
        anomalyDetails: {
            type: [String],
            enum: ['powerConsumption', 'emissions', 'operatingTemperature', 'vibration', 'pressure']
        }
    },
    specifications: {
        powerConsumption: {
            measurementUnit: String,
            normalRange: {
                min: {
                    type: mongoose.Types.Decimal128,
                },
                max: {
                    type: mongoose.Types.Decimal128,
                }
            }
        },
        emissions: {
            measurementUnit: String,
            normalRange: {
                min: {
                    type: mongoose.Types.Decimal128,
                },
                max: {
                    type: mongoose.Types.Decimal128,
                }
            }
        },
        operatingTemperature: {
            measurementUnit: String,
            normalRange: {
                min: {
                    type: mongoose.Types.Decimal128,
                },
                max: {
                    type: mongoose.Types.Decimal128,
                }
            }
        },
        vibration: {
            measurementUnit: String,
            normalRange: {
                min: {
                    type: mongoose.Types.Decimal128,
                },
                max: {
                    type: mongoose.Types.Decimal128,
                }
            }
        },
        pressure: {
            measurementUnit: String,
            normalRange: {
                min: {
                    type: mongoose.Types.Decimal128,
                },
                max: {
                    type: mongoose.Types.Decimal128,
                }
            }
        }
    },
    turns: [
        {
            turn: {
                type: String,
                enum: ['morning', 'evening', 'night'],
                required: true
            },
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                first: String,
                last: String
            }
        },
    ],
    maintenance: {
        lastMaintenanceDate: Date,
        nextMaintenanceDate: Date,
        maintenanceHistory: [
            {
                date: Date,
                description: String
            }
        ]
    },
    log: {
        lastPowerOn: Date,
        lastPowerOff: Date,
        sessions: [
            {
                powerOn: Date,
                powerOff: Date,
                duration: String // As above
            }
        ]
    },
    test: { type: Boolean }
});


// src/models/machine.js
machineSchema.post('save', function (err, doc, next) {
    if (err) {
        if (err.name === 'MongoServerError' && err.code === 11000) {
            next(new Error('machine is already taken.'));
        } else {
            next(err);
        }
    } else {
        next();
    }
});


const Machine = mongoose.model('Machine', machineSchema);
module.exports = Machine;
