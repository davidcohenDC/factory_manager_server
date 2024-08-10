const Machine = require('@models/machine');
const MachineSensor = require('@models/machineSensor');
const { logger } = require('@config/');

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const ANOMALY_MULTIPLIER = 3;

let lastAnomalyValue = {}; // To keep track of the last anomaly value per sensor

/**
 * Generates random sensor data based on the provided specifications.
 *
 * @param {Object} specifications - The machine specifications containing normal ranges for sensors.
 * @returns {Object} - An object containing the current values for each sensor.
 */
function generateRandomSensorData(specifications = {}) {
    const {
        powerConsumption: { normalRange: { min: pcMin = 0, max: pcMax = 0 } = {} } = {},
        emissions: { normalRange: { min: emMin = 0, max: emMax = 0 } = {} } = {},
        operatingTemperature: { normalRange: { min: otMin = 0, max: otMax = 0 } = {} } = {},
        vibration: { normalRange: { min: vibMin = 0, max: vibMax = 0 } = {} } = {},
        pressure: { normalRange: { min: prMin = 0, max: prMax = 0 } = {} } = {}
    } = specifications;

    return {
        timestamp: new Date(),
        powerConsumption: getRandomInRange(pcMin, pcMax),
        emissions: getRandomInRange(emMin, emMax),
        operatingTemperature: getRandomInRange(otMin, otMax),
        vibration: getRandomInRange(vibMin, vibMax),
        pressure: getRandomInRange(prMin, prMax),
        anomaly: false
    };
}

function getRandomInRange(min, max) {
    const minValue = min ? parseFloat(min.toString()) : DEFAULT_MIN;
    const maxValue = max ? parseFloat(max.toString()) : DEFAULT_MAX;
    return (Math.random() * (maxValue - minValue) + minValue).toFixed(2);
}

function getFarOutsideValue(max) {
    const maxValue = max ? parseFloat(max.toString()) : DEFAULT_MAX;
    logger.info(`getFarOutsideValue called with maxValue: ${maxValue}`);
    const farOutsideValue = (maxValue * ANOMALY_MULTIPLIER).toFixed(2);
    logger.info(`Calculated farOutsideValue: ${farOutsideValue}`);
    return farOutsideValue;
}

function getMicroChangeValue(anomalyValue) {
    const anomalyVal = parseFloat(anomalyValue);
    logger.info(`getMicroChangeValue called with anomalyValue: ${anomalyValue}`);
    const microChangeValue = (anomalyVal + (Math.random() - 0.5) * 0.001).toFixed(3);
    logger.info(`Calculated microChangeValue: ${microChangeValue}`);
    return microChangeValue;
}

function handleAnomaly(currentValues, machine) {
    if (machine.machineState.anomalyDetails && machine.machineState.anomalyDetails.length > 0) {
        currentValues.anomaly = true;
        logger.info(`Handling anomaly for machine ${machine.machineId} with details: ${JSON.stringify(machine.machineState.anomalyDetails)}`);

        for (const spec of machine.machineState.anomalyDetails) {
            const normalMax = parseFloat(machine.specifications[spec].normalRange.max.toString());
            const currentValue = parseFloat(currentValues[spec]);

            if (lastAnomalyValue[spec] && currentValue === parseFloat(lastAnomalyValue[spec])) {
                // Apply a micro change to the last anomaly value
                logger.info(`Applying micro change to last anomaly value of ${spec} (${currentValue}).`);
                currentValues[spec] = getMicroChangeValue(currentValue);
            } else if (currentValue > normalMax) {
                // Apply a micro change if current value is greater than normal max
                logger.info(`Current value of ${spec} (${currentValue}) is greater than normal max (${normalMax}). Applying micro change.`);
                currentValues[spec] = getMicroChangeValue(currentValues[spec]);
            } else {
                // Generate and track a far outside value
                logger.info(`Current value of ${spec} (${currentValue}) is not greater than normal max (${normalMax}). Generating far outside value.`);
                const farOutsideValue = getFarOutsideValue(normalMax);
                currentValues[spec] = farOutsideValue;
                lastAnomalyValue[spec] = farOutsideValue; // Track the farOutsideValue
            }
        }
    }
    return currentValues;
}

function handleOffState() {
    // When the machine is off, all sensor values should be 0.0
    return {
        timestamp: new Date(),
        powerConsumption: "0.0",
        emissions: "0.0",
        operatingTemperature: "0.0",
        vibration: "0.0",
        pressure: "0.0",
        anomaly: false
    };
}

module.exports = (io) => async function generateSensorData() {
    try {
        const machines = await Machine.find();
        const sensorUpdates = [];

        for (const machine of machines) {
            try {
                let currentValues;

                // Check the machine's current state
                if (machine.machineState.currentState === 'anomaly') {
                    currentValues = generateRandomSensorData(machine.specifications);
                    currentValues = handleAnomaly(currentValues, machine);
                } else if (machine.machineState.currentState === 'off') {
                    logger.info(`Machine ${machine.machineId} is currently off.`);
                    currentValues = handleOffState(); // Set all values to 0.0
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

                sensorUpdates.push(machineSensor);
                io.emit('sensorData', {
                    machineId: machine.machineId,
                    machineName: machine.name,
                    ...currentValues,
                    currentState: machine.machineState.currentState,
                    anomalyDetails: machine.machineState.anomalyDetails
                });

                logger.info(`Generated sensor data for machine ${machine.machineId}`, {
                    machineId: machine.machineId,
                    machineName: machine.name,
                    sensorData: currentValues,
                    currentState: machine.machineState.currentState,
                });

            } catch (error) {
                logger.error(`Error generating sensor data for machine ${machine.machineId}: ${error.message}`, {
                    machineId: machine.machineId,
                    machineName: machine.name,
                    error: error.stack,
                });
            }
        }

        await Promise.all(sensorUpdates.map(sensor => sensor.save()));

    } catch (error) {
        logger.error(`Error in sensor data generation process: ${error.message}`, {
            error: error.stack,
        });
    }
};
