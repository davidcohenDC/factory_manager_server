const { getAllMachines, generateDataForMachine } = require('@services/machineService');
const { logger } = require('@config/');

module.exports = (io) => async function generateSensorData() {
    try {
        const machines = await getAllMachines();
        const sensorUpdates = [];

        for (const machine of machines) {
            try {
                const sensorData = await generateDataForMachine(machine);
                io.emit('sensorData', sensorData);
                sensorUpdates.push(sensorData);
            } catch (error) {
                logger.error(`Failed to generate data for machine ${machine.machineId}`, error);
            }
        }

        await Promise.all(sensorUpdates.map(sensor => sensor.save()));

    } catch (error) {
        logger.error(`Error in sensor data generation process: ${error.message}`, {
            error: error.stack,
        });
    }

    // Use setTimeout to ensure the next execution only happens after the current one completes
    setTimeout(() => generateSensorData(io), 2000);
};
