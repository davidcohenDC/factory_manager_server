const mongoose = require('mongoose');
const { Schema } = mongoose;

const sensorDataEntrySchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    powerConsumption: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    emissions: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    operatingTemperature: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    humidity: {
        type: mongoose.Types.Decimal128,
        required: true
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
    sensorData: [sensorDataEntrySchema]
});

const MachineSensorData = mongoose.model('MachineSensor', machineSensorDataSchema);
module.exports = MachineSensorData;
