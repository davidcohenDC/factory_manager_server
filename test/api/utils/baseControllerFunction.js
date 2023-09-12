const { chai, server } = require('./userTestUtils')

module.exports.testController = async ({
  credentials,
  url,
  method = 'post',
  expectations = []
}) => {
  try {
    let response = await chai.request(server)[method](url).send(credentials)

    // Run through each expectation function
    for (const expectation of expectations) {
      expectation(response)
    }

    return response
  } catch (error) {
    throw new Error(
      `Error testing the ${method.toUpperCase()} method on URL ${url}: ${
        error.message
      }`
    )
  }
}
