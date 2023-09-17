const chai = require('chai')

// Helper function to perform common expectations
function expectError(response, status, errorMsg) {
  chai.expect(response).to.have.status(status)
  chai.expect(response.body).to.be.a('object')
  chai.expect(response.body.error).to.contains(errorMsg)
}

//create a exporting function for expectError
module.exports = {
  expectError
}
