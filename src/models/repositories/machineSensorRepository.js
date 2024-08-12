const MachineSensor = require('@models/machine-sensor')

const createMachineSensor = async (machineSensorData) => {
    const machineSensor = new MachineSensor(machineSensorData);
    return await machineSensor.save()
}

const findMachineSensorById = async (id) => {
    return MachineSensor.findById(id)
}

const findMachineSensorBySerial = async (serial) => {
    return MachineSensor.findOne({serial : serial})
}

const getAllMachineSensors = async (limit, offset) => {
    return MachineSensor.find().skip(offset).limit(limit)
}

module.exports = {
    createMachineSensor,
    findMachineSensorById,
    findMachineSensorBySerial,
    getAllMachineSensors
}