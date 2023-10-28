require('module-alias/register')
const { faker } = require('@faker-js/faker')
const Area = require('@models/area')
const { generateCRUDTests } = require('@test/api/utils/helper/')
const { expectError, initializeServer, closeServer } = require('@test/api/utils/helper');


const first_machine = {
    name: 'First Machine',
    machineId: faker.internet.userName({firstName: `TestMachine${Date.now()}`}),
    location: {
        area: "Main Areaa"
    },
    status: {
        operational: true,
        currentAnomalies: []
    }
}

const second_machine = {
    name: 'Second Machine',
    machineId: faker.internet.userName({firstName: `TestMachine${Date.now()}`}),
    location: {
        area: "Test Areaa"
    },
    status: {
        operational: true,
        currentAnomalies: []
    }
}

const areaDataPre = {
    name: 'Main Area',
    size: 100,
    machines: [
        first_machine
    ],
    subAreas: [
        {
            name: 'Sub Area',
            size: 50,
            machines: [
                second_machine
            ]
        }
    ]
}

const areaDataPost = {
    name: 'Test Area',
    size: 100,
    machines: [
        second_machine
    ],
    subAreas: [
        {
            name: 'Test Sub Area',
            size: 50,
            machines: [
                first_machine
            ]
        }
    ]
}


const requiredFields = [
    { fieldName: "name", fieldValue: "Area"},
    { fieldName: "size", fieldValue: 1000 }
];

const validationFields = []

describe('Machine Controller - CRUD', () => {
    generateCRUDTests('area', Area, areaDataPre,areaDataPost, requiredFields,validationFields,
        { expectError, initializeServer, closeServer });
})

