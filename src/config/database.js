const mongoose = require('mongoose')

const connectToDb = async (uri) => {
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}

module.exports = {
  connectToDb
}
