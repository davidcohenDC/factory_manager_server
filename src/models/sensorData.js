const mongoose = require('mongoose');
const { Schema } = mongoose;

const sensorDataSchema = new Schema({
    machineId: {
        type: Schema.Types.ObjectId,
        ref: 'Machine',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    powerConsumption: mongoose.Types.Decimal128,
    emissions: mongoose.Types.Decimal128,
    operatingTemperature: mongoose.Types.Decimal128,
    humidity: mongoose.Types.Decimal128,
    anomaly: {
        type: Boolean,
        default: false
    }
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);
module.exports = SensorData;
