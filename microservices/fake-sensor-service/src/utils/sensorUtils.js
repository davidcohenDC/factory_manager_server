const { logger } = require('@config/');

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const ANOMALY_MULTIPLIER = 3;

/**
 * Generate a random number within a specified range.
 * @param {number} min - Minimum value.
 * @param {number} max - Maximum value.
 * @returns {string} Random number within range as a string.
 */
function getRandomInRange(min, max) {
    const minValue = min ? parseFloat(min.toString()) : DEFAULT_MIN;
    const maxValue = max ? parseFloat(max.toString()) : DEFAULT_MAX;
    return (Math.random() * (maxValue - minValue) + minValue).toFixed(2);
}

/**
 * Calculate a value far outside the normal range to simulate an anomaly.
 * @param {number} max - Maximum value of the normal range.
 * @returns {string} Anomalous value as a string.
 */
function getFarOutsideValue(max) {
    const maxValue = max ? parseFloat(max.toString()) : DEFAULT_MAX;
    logger.info(`Calculating far outside value for max value: ${maxValue}`);
    const farOutsideValue = (maxValue * ANOMALY_MULTIPLIER).toFixed(2);
    logger.info(`Calculated far outside value: ${farOutsideValue}`);
    return farOutsideValue;
}

/**
 * Apply a micro-change to an existing anomaly value to simulate small variations.
 * @param {number} anomalyValue - The current anomaly value.
 * @returns {string} Adjusted anomaly value as a string.
 */
function getMicroChangeValue(anomalyValue) {
    const anomalyVal = parseFloat(anomalyValue);
    logger.info(`Applying micro-change to anomaly value: ${anomalyValue}`);
    const microChangeValue = (anomalyVal + (Math.random() - 0.5) * 0.001).toFixed(3);
    logger.info(`Calculated micro-change value: ${microChangeValue}`);
    return microChangeValue;
}

module.exports = {
    getRandomInRange,
    getFarOutsideValue,
    getMicroChangeValue,
};
