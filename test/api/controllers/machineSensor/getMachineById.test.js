require('module-alias/register')
const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const machineSensor = require('@models/machineSensor')
const machine = require('@models/machine')
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
        // Create a machine sensor entry with the machineId
        await new machineSensor(machineSensorData).save()
    })

    // Teardown: clean up the database and close the server after tests
    after(async () => {
        await machine.deleteMany({ test: true })
        await machineSensor.deleteMany({ test: true })
        await closeServer(server)
    })

    describe("GET /api/machineSensor/machineId/:machineId", () => {
        it("should return machine sensor data when the machineId exists", async () => {
            const res = await chai.request(server).get(`/api/machineSensor/machineId/${machineData.machineId}`)
            expect(res).to.have.status(200)
            expect(res.body).to.be.a("array")
            expect(res.body.length).to.be.greaterThan(0)
            expect(res.body[0].machineId).to.equal(machineSensorData.machineId)
        })

        it("should fail and return 404 when the machineId does not exist", async () => {
            const res = await chai.request(server).get("/api/machineSensor/machineId/123") // invalid machineId
            expectError(res, 404, "machineSensor not found")
        })
    })
})
