const Machine = require('@models/machine');
const MachineSensor = require('@models/machineSensor');
const { handleAnomaly } = require('@services/anomalyHandler');
const { generateRandomSensorData } = require('@services/sensorDataGenerator');
const { handleOffState } = require('@services/stateHandler');
const { logger } = require('@config/');

async function getAllMachines() {
    try {
        return await Machine.find();
    } catch (error) {
        logger.error('Error fetching machines:', error);
        throw error;
    }
}

async function generateDataForMachine(machine) {
    try {
        let currentValues;

        if (machine.machineState.currentState === 'anomaly') {
            currentValues = generateRandomSensorData(machine.specifications);
            currentValues = handleAnomaly(currentValues, machine);
        } else if (machine.machineState.currentState === 'off') {
            logger.info(`Machine ${machine.machineId} is currently off.`);
            currentValues = handleOffState();
        } else {
            currentValues = generateRandomSensorData(machine.specifications);
        }

        let machineSensor = await MachineSensor.findOne({ machineId: machine.machineId });
        if (!machineSensor) {
            machineSensor = new MachineSensor({
                machineId: machine.machineId,
                sensorData: [currentValues],
            });
        } else {
            machineSensor.sensorData.push(currentValues);
        }

        await machineSensor.save();
        logger.info(`Generated sensor data for machine ${machine.machineId}`, {
            machineId: machine.machineId,
            machineName: machine.name,
            sensorData: currentValues,
            currentState: machine.machineState.currentState,
        });

        return {
            machineId: machine.machineId,
            machineName: machine.name,
            ...currentValues,
            currentState: machine.machineState.currentState,
            anomalyDetails: machine.machineState.anomalyDetails,
        };
    } catch (error) {
        logger.error(`Error generating sensor data for machine ${machine.machineId}: ${error.message}`, {
            machineId: machine.machineId,
            machineName: machine.name,
            error: error.stack,
        });
        throw error;
    }
}

module.exports = {
    getAllMachines,
    generateDataForMachine,
};
