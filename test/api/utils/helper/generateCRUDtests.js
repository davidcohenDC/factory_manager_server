require('module-alias/register')
const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const { faker } = require('@faker-js/faker')
chai.use(chaiHttp)

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function setNestedField(obj, path, value) {
    const keys = path.split('.');
    let current = obj;

    while (keys.length > 1) {
        const key = keys.shift();
        current[key] = current[key] || {};
        current = current[key];
    }

    current[keys[0]] = value;
}
function generateTestCases(requiredFields) {
    const testCases = [];

    for (const fieldInfo of requiredFields) {
        const { fieldName, fieldValue } = fieldInfo;
        const testCase = {
            field: fieldName,
            name: `missing ${fieldName}`,
            userData: {},
            expectedError: `"${fieldName}" is required`
        };

        // Populate userData with dummy values, excluding the current field
        for (const otherFieldInfo of requiredFields) {
            if (otherFieldInfo.fieldName !== fieldName) {
                const dummyValue = otherFieldInfo.fieldValue
                setNestedField(testCase.userData, otherFieldInfo.fieldName, dummyValue);
            }
        }

        testCases.push(testCase);
    }

    return testCases;
}
function generateCRUDTests(modelName, Model, modelDataPre, modelData, requiredFields, validationFields,
                           { expectError, initializeServer, closeServer }) {

    let server;
    let modelID = '';

    before(async () => {
        const helper = require('@test/api/utils/helper');
        expectError = helper.expectError;
        initializeServer = helper.initializeServer;
        closeServer = helper.closeServer;
        server = await initializeServer();
        const modelSaved = await new Model(modelDataPre).save();
        modelID = modelSaved._id;
    });

    after(async () => {
        await Model.deleteMany({test: true});
        await closeServer(server);
    });

    describe(`Create ${capitalizeFirstLetter(modelName)}`, () => {

        it(`should create a new ${modelName}`, async () => {
            const res = await chai.request(server).post(`/api/${modelName}`).send(modelData);
            expect(res).to.have.status(201)
            expect(res.body).to.be.a('object')

            const responseBodyModel = res.body[modelName];  // Nota: qui ho usato modelName

            for (const field in modelData) {
                if (field === 'password') continue;
                if (Array.isArray(modelData[field])) {
                    expect(responseBodyModel[field]).to.deep.equal(modelData[field]);
                } else if (typeof modelData[field] === 'object' && modelData[field] !== null) {
                    for (const subField in modelData[field]) {
                        expect(responseBodyModel[field][subField]).to.deep.equal(modelData[field][subField]);
                    }
                } else {
                    expect(responseBodyModel[field]).to.equal(modelData[field]);
                }
            }
        })

        it(`should return 400 when the ${modelName} id is already in use`, async () => {
            await chai.request(server).post(`/api/${modelName}/`).send(modelData)

            const res = await chai.request(server).post(`/api/${modelName}`).send(modelData)
            expectError(res, 400, `${modelName} is already taken.`)
        })

        const invalidInputs = generateTestCases(requiredFields);

        validationFields.forEach((testCase) => {
            it(`should return 400 when ${testCase.name}`, async () => {
                const res = await chai.request(server)
                    .post(`/api/${modelName}`)
                    .send(testCase.userData);

                await expectError(res, 400, testCase.expectedError)
            });
        });

        invalidInputs.forEach((testCase) => {
            it(`should return 400 when ${testCase.name}`, async () => {
                const res = await chai.request(server)
                    .post(`/api/${modelName}`)
                    .send(testCase.userData);

                const expectedPattern = testCase.customValidation
                    ? testCase.expectedError
                    : `${testCase.field}.*is required`;
                console.log(testCase.userData)
                expect(res.body.error).to.match(new RegExp(expectedPattern));
            });
        });
    })

    describe(`Get ${capitalizeFirstLetter(modelName)}`, () => {
        it(`should return the ${modelName}`, async () => {
            if (modelID === '') this.skip()
            const res = await chai.request(server).get(`/api/${modelName}/${modelID}`)

            expect(res).to.have.status(200)
            expect(res.body).to.be.a('object')
            expect(res.body[modelName]).to.have.property('_id')
            expect(res.body[modelName].machineId).equal(modelDataPre.machineId)
        })

        it(`should return 404 when the ${modelName} is not valid`, async () => {
            if (modelID === '') this.skip()
            const res = await chai.request(server).get(`/api/${modelName}/123`)
            expectError(res, 400, '"id" length must be 24 characters long')
        })

        it(`should return 404 when the ${modelName} is not found`, async () => {
            if (modelID === '') this.skip()
            const res = await chai.request(server).get(`/api/${modelName}/000000000000000000000001`)

            expectError(res, 404, `${modelName} not found.`)
        })
    })

    describe(`Get All ${capitalizeFirstLetter(modelName)}`, () => {
        it(`should return all ${modelName}`, async () => {
            const res = await chai.request(server).get(`/api/${modelName}`)

            expect(res).to.have.status(200)
            expect(res.body).to.be.a('object')
            expect(res.body[modelName]).to.be.a('array')
            if (res.body[modelName].length > 0) {
                expect(res.body[modelName].length).to.be.greaterThan(0)
                expect(res.body[modelName][0]).to.have.property('_id')
            }
        })

        //   use pagination in the request, the offset and limit using testing adding user
        it(`should limit the ${modelName}`, async () => {
            const all = await chai.request(server).get(`/api/${modelName}`)
            const res = await chai.request(server).get(`/api/${modelName}?limit=5`)

            expect(res).to.have.status(200)
            expect(res.body).to.be.a('object')
            expect(res.body[modelName]).to.be.a('array')
            expect(res.body[modelName].length).to.be.equal(5)
            for (let i = 0; i < 5; i++) {
                expect(res.body[modelName][i]._id).to.be.equal(all.body[modelName][i]._id)
            }
        })

        it(`should offset the ${modelName}`, async () => {
            const all = await chai.request(server).get(`/api/${modelName}`)
            const res = await chai.request(server).get(`/api/${modelName}?offset=5`)

            expect(res).to.have.status(200)
            expect(res.body).to.be.a('object')
            expect(res.body[modelName]).to.be.a('array')
            if ((res.body[modelName].length) < process.env.ITEMS_PER_PAGE) {
                expect(res.body[modelName].length).to.be.equal(
                    parseInt(res.body[modelName].length)
                )
            } else {
                expect(res.body[modelName].length).to.be.equal(
                    parseInt(process.env.ITEMS_PER_PAGE)
                )
            }
            for (let i = 0; i < all.body[modelName].length - 5; i++) {
                expect(res.body[modelName][i]._id).to.be.equal(all.body[modelName][i + 5]._id)
            }
        })

        it(`should limit and offset the ${modelName}`, async () => {
                const all = await chai.request(server).get(`/api/${modelName}`);
                const totalModels = all.body[modelName].length;

                // Calculate the expected length
                const expectedLength = Math.min(5, totalModels - 5); // -5 because we offset by 5

                const res = await chai.request(server).get(`/api/${modelName}?offset=5&limit=5`);

                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body[modelName]).to.be.a('array');
                expect(res.body[modelName].length).to.be.equal(expectedLength);

                for (let i = 0; i < expectedLength; i++) {
                    expect(res.body[modelName][i]._id).to.be.equal(all.body[modelName][i + 5]._id);
                }
            }
        );
    })

    describe(`Update ${capitalizeFirstLetter(modelName)}`, () => {
        it(`should update the ${modelName}`, async () => {
            if (modelID === '') this.skip()
            const res = await chai
                .request(server)
                .patch(`/api/${modelName}/${modelID}`)
                .send({ email: faker.internet.email() })

            expect(res).to.have.status(200)
            expect(res.body).to.be.a('object')
            expect(res.body[modelName]).to.have.property('_id')
            expect(res.body[modelName].machineId).equal(modelDataPre.machineId)
        })

        it(`should return 404 when the ${modelName} is not valid`, async () => {
            if (modelID === '') this.skip()
            const res = await chai.request(server).patch(`/api/${modelName}/123`)

            expectError(res, 400, '"id" length must be 24 characters long')
        })

        it(`should return 404 when the ${modelName} is not found`, async () => {
            if (modelID === '') this.skip()
            const res = await chai
                .request(server)
                .patch(`/api/${modelName}/000000000000000000000001`)

            expectError(res, 404, `${modelName} not found.`)
        })
    })

    describe(`Delete ${capitalizeFirstLetter(modelName)}`, () => {


        it(`should delete the ${modelName}`, async () => {
            const res = await chai
                .request(server)
                .delete(`/api/${modelName}/${modelID}`)

            expect(res).to.have.status(200)
            expect(res.body).to.be.a('object')
            expect(res.body.message).to.equal(`${modelName} deleted successfully`)
        })

        it(`should return 404 when the ${modelName} is not valid`, async () => {
            if (modelID === '') this.skip()
            const res = await chai.request(server).delete(`/api/${modelName}/123`)

            expectError(res, 400, '"id" length must be 24 characters long')
        })

        it(`should return 404 when the ${modelName} is not found`, async () => {
            if (modelID === '') this.skip()
            const res = await chai
                .request(server)
                .delete(`/api/${modelName}/000000000000000000000001`)

            expectError(res, 404, `${modelName} not found.`)
        })
    })
}

module.exports = generateCRUDTests