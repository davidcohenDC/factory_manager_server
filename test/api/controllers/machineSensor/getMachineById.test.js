require('module-alias/register')
const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const machineSensor = require('@root/persistence/mongoose/models/machineSensor')
const machine = require('@root/persistence/mongoose/models/machine')
const { expectError, initializeServer, closeServer } = require('@test/api/utils/helper')
const { machineSensorData } = require('@test/api/controllers/machineSensor/')
const { machineData } = require('@test/api/controllers/machine/')
chai.use(chaiHttp)

describe("Machine Controller - GetMachineById", () => {
    let server // This will be our test server

    // Setup: start the server before tests
    before(async () => {
        server = await initializeServer()
        // Create a machine entry
        await new machine(machineData).save()
        // Create a machine sensor entry with the serial
        await new machineSensor(machineSensorData).save()
    })

    // Teardown: clean up the database and close the server after tests
    after(async () => {
        await machine.deleteMany({ test: true })
        await machineSensor.deleteMany({ test: true })
        await closeServer(server)
    })

    describe("GET /api/machineSensor/serial/:serial", () => {
        it("should return machine sensor data when the serial exists", async () => {
            const res = await chai.request(server).get(`/api/machine-sensor/serial/${machineData.serial}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.a("object")
            expect(res.body.sensorData.length).to.be.greaterThan(0)
            expect(res.body.serial).to.equal(machineSensorData.serial)
        })

        it("should fail and return 404 when the serial does not exist", async () => {
            const res = await chai.request(server).get("/api/machine-sensor/serial/123") // invalid serial
            expectError(res, 404, "Machine sensor not found")
        })
    })
})
