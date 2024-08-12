const Machine = require('@models/machine')

const createMachine = async (machineData) => {
    const machine = new Machine(machineData);
    return await machine.save()
}

const findMachineById = async (id) => {
    return Machine.findById(id)
}

const updateMachineById = async (id, updateData) => {
    return Machine.findByIdAndUpdate(id, updateData, {new: true, runValidators: true})
}

const deleteMachineById = async (id) => {
    return Machine.findByIdAndDelete(id)
}

const getAllMachines = async (limit, offset) => {
    return Machine.find().skip(offset).limit(limit)
}

const findMachineBySerial = async (serial) => {
    return Machine.findOne({serial: serial})
}

module.exports = {
    createMachine,
    findMachineById,
    updateMachineById,
    deleteMachineById,
    getAllMachines,
    findMachineBySerial
}