const mongoose = require('mongoose');
const {logger} = require("@root/config");
const { Schema } = mongoose;

const logSource = { source: 'MachineSensorSchema' };

const sensorDataEntrySchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    powerConsumption: {
        type: mongoose.Types.Decimal128
    },
    emissions: {
        type: mongoose.Types.Decimal128
    },
    operatingTemperature: {
        type: mongoose.Types.Decimal128
    },
    vibration: {
        type: mongoose.Types.Decimal128
    },
    pressure: {
        type: mongoose.Types.Decimal128
    },
    anomaly: {
        type: Boolean,
        default: false
    }
});

const machineSensorDataSchema = new Schema({
    machineId: {
        type: String,  // Use String if you're using custom IDs like "MCH1011"
        required: true
    },
    sensorData: [sensorDataEntrySchema],
    test: Boolean
});

// src/models/machine.js
machineSensorDataSchema.post('save', function (err, doc, next) {
    if (err) {
        if (err.name === 'MongoServerError' && err.code === 11000) {
            next(new Error('machineSensor is already taken.'));
        } else {
            next(err);
        }
    } else {
        next();
    }
});

const MachineSensor = mongoose.model('MachineSensor', machineSensorDataSchema);
module.exports = MachineSensor;
