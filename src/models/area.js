const mongoose = require('mongoose')
const { Schema } = mongoose
const { logger } = require('@config/')
const Machine = require('./machine')
const logSource = { source: 'AreaSchema' }

const areaSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    size: { type: Number, required: true },
    machines: [Machine.schema],
    subAreas: [this],  // Self-embedding for sub-areas
    test: { type: Boolean }
});

areaSchema.add({ subAreas: [areaSchema] });

areaSchema.pre('save', async function (next) {
    logger.info('Pre-save hook called', logSource)
    next()
})

areaSchema.post('save', async function (err, doc, next) {
    if (err) {
        if (err.name === 'MongoServerError' && err.code === 11000) {
            logger.error(`Error saving area (MongoServerError): ${err.message}`, logSource)
            next(new Error('area is already taken.'))
        } else {
            next(err)
        }
    } else {
        next()
    }
})

const Area = mongoose.model('Area', areaSchema);

module.exports = Area;
