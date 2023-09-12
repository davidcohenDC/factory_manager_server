const mongoose = require('mongoose')
const { Schema, model } = mongoose

const logSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId },
    resultCode: { type: String, required: true },
    level: { type: String, required: true },
    errorMessage: { type: String, required: true },
    ip: { type: String, required: true }
  },
  {
    timestamps: true
  }
)

const Log = model('Log', logSchema)
module.exports = Log
