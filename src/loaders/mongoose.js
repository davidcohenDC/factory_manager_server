const mongoose = require('mongoose')
const { dbUri } = require('../config/index.js')

module.exports = async () => {
  mongoose.set('strictQuery', false)
  await mongoose
    .connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log('Mongodb Connection')
    })
    .catch((err) => {
      console.log(err)
    })

  mongoose.connection.on('error', console.log)
}
