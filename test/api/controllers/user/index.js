const {faker} = require("@faker-js/faker");

const userData = {
        email: faker.internet.email().toLowerCase(),
        password: 'Password123!',
        role: 'moderator',
        test: true
}

const userDataTwo = {
        email: faker.internet.email().toLowerCase(),
        password: 'Password123!',
        role: 'worker',
        test: true
}

module.exports = { userData, userDataTwo }