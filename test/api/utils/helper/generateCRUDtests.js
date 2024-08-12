const { logger } = require('@config/');
const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
const { faker } = require('@faker-js/faker');
chai.use(chaiHttp);

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
    const { fieldName, _ } = fieldInfo;
    const testCase = {
      field: fieldName,
      name: `missing ${fieldName}`,
      userData: {},
      expectedError: `"${fieldName}" is required`
    };

    // Populate userData with dummy values, excluding the current field
    for (const otherFieldInfo of requiredFields) {
      if (otherFieldInfo.fieldName !== fieldName) {
        const dummyValue = otherFieldInfo.fieldValue;
        setNestedField(testCase.userData, otherFieldInfo.fieldName, dummyValue);
      }
    }

    testCases.push(testCase);
  }

  return testCases;
}

function generateCRUDTests(
    modelName,
    Model,
    modelDataPre,
    modelData,
    requiredFields,
    validationFields,
    { expectError, initializeServer, closeServer },
    options = { create: true, read: true, update: true, delete: true }
) {
  let server;
  let modelID = '';

  before(async () => {
    const helper = require('@test/api/utils/helper');
    expectError = helper.expectError;
    initializeServer = helper.initializeServer;
    closeServer = helper.closeServer;
    server = await initializeServer();
    if (options.create || options.read || options.update || options.delete) {
      const modelSaved = await new Model(modelDataPre).save();
      modelID = modelSaved._id;
    }
  });

  after(async () => {
    if (options.create || options.read || options.update || options.delete) {
      await Model.deleteMany({ test: true });
    }
    await closeServer(server);
  });

  if (options.create) {
    describe(`Create ${capitalizeFirstLetter(modelName)}`, () => {
      it(`should create a new ${modelName}`, async () => {
        const res = await chai
            .request(server)
            .post(`/api/${modelName}`)
            .send(modelData);
        expect(res).to.have.status(201);
        expect(res.body).to.be.a('object');

        const responseBodyModel = res.body;
        for (const field in modelData[0]) {
          if (typeof modelData[0][field] === 'object' && modelData[0][field] !== null) {
            // Handle nested objects
            for (const subField in modelData[0][field]) {
              expect(responseBodyModel[0][field][subField]).to.equal(modelData[0][field][subField]);
            }
          } else {
            // Handle primitive types
            expect(responseBodyModel[0][field]).to.equal(modelData[0][field]);
          }
        }
      });

      it(`should return 400 when the ${modelName} id is already in use`, async () => {
        await chai.request(server).post(`/api/${modelName}`).send(modelData);

        const res = await chai
            .request(server)
            .post(`/api/${modelName}`)
            .send(modelData);
        expectError(res, 400, `${modelName} is already taken.`);
      });

      const invalidInputs = generateTestCases(requiredFields);

      validationFields.forEach((testCase) => {
        it(`should return 400 when ${testCase.name}`, async () => {
          const res = await chai
              .request(server)
              .post(`/api/${modelName}`)
              .send(testCase.userData);

          await expectError(res, 400, testCase.expectedError);
        });
      });

      invalidInputs.forEach((testCase) => {
        it(`should return 400 when ${testCase.name}`, async () => {
          const res = await chai
              .request(server)
              .post(`/api/${modelName}`)
              .send(testCase.userData);

          const expectedPattern = testCase.customValidation
              ? testCase.expectedError
              : `${testCase.field}.*is required`;
          expect(res.body.error).to.match(new RegExp(expectedPattern));
        });
      });
    });
  }

  if (options.read) {
    describe(`Get ${capitalizeFirstLetter(modelName)}`, () => {
      it(`should return the ${modelName}`, async function () {
        if (!modelID) this.skip();
        const res = await chai.request(server).get(`/api/${modelName}/id/${modelID}`);

        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body[modelName]).to.have.property('_id');
        expect(res.body[modelName].serial).equal(modelDataPre.serial);
      });

      it(`should return 400 when the ${modelName} ID is not valid`, async function () {
        if (!modelID) this.skip();
        const res = await chai.request(server).get(`/api/${modelName}/id/123`);
        expectError(res, 400, '"id" length must be 24 characters long');
      });

      it(`should return 404 when the ${modelName} is not found`, async function () {
        if (!modelID) this.skip();
        const res = await chai
            .request(server)
            .get(`/api/${modelName}/id/000000000000000000000001`);

        expectError(res, 404, `${modelName} not found.`);
      });
    });

    describe(`Get All ${capitalizeFirstLetter(modelName)}`, () => {
      it(`should return all ${modelName}`, async () => {
        const res = await chai.request(server).get(`/api/${modelName}`);

        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body[modelName]).to.be.a('array');
        if (res.body[modelName].length > 0) {
          expect(res.body[modelName].length).to.be.greaterThan(0);
          expect(res.body[modelName][0]).to.have.property('_id');
        }
      });

      it(`should limit the ${modelName}`, async () => {
        const all = await chai.request(server).get(`/api/${modelName}`);
        const res = await chai.request(server).get(`/api/${modelName}?limit=5`);

        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body[modelName]).to.be.a('array');
        const expectedLength = Math.min(5, all.body[modelName].length);
        expect(res.body[modelName].length).to.be.equal(expectedLength);
        for (let i = 0; i < expectedLength; i++) {
          expect(res.body[modelName][i]._id).to.be.equal(
              all.body[modelName][i]._id
          );
        }
      });

      it(`should offset the ${modelName}`, async () => {
        const all = await chai.request(server).get(`/api/${modelName}`);
        const res = await chai.request(server).get(`/api/${modelName}?offset=5`);

        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body[modelName]).to.be.a('array');
        const expectedLength = Math.min(all.body[modelName].length - 5, parseInt(process.env.ITEMS_PER_PAGE, 10));
        expect(res.body[modelName].length).to.be.equal(expectedLength);
        for (let i = 0; i < expectedLength; i++) {
          expect(res.body[modelName][i]._id).to.be.equal(
              all.body[modelName][i + 5]._id
          );
        }
      });

      it(`should limit and offset the ${modelName}`, async () => {
        const limit = 1;
        const offset = 3;

        // Fetch all models without any limit or offset
        const all = await chai.request(server).get(`/api/${modelName}`);
        const totalModels = all.body[modelName].length;

        // Fetch models with limit and offset
        const res = await chai
            .request(server)
            .get(`/api/${modelName}?limit=${limit}&offset=${offset}`);

        // Calculate the expected length
        const expectedLength = Math.max(0, totalModels - offset);

        // General checks
        expect(res).to.have.status(200);
        expect(res).to.have.header('content-type', /json/);
        expect(res.body).to.be.an('object').that.includes.keys(modelName);
        expect(res.body[modelName]).to.be.an('array');

        // Length checks
        const responseLength = res.body[modelName].length;
        if (responseLength < limit) {
          expect(responseLength).to.equal(responseLength);
        } else {
          expect(responseLength).to.equal(limit);
        }

        // No further checks needed if expected length is zero
        if (expectedLength === 0) return;

        // Check individual items
        for (let i = 0; i < Math.min(limit, expectedLength); i++) {
          expect(res.body[modelName][i]._id).to.equal(
              all.body[modelName][i + offset]._id
          );
        }
      });
    });
  }

  if (options.update) {
    describe(`Update ${capitalizeFirstLetter(modelName)}`, () => {
      it(`should update the ${modelName}`, async function () {
        if (!modelID) this.skip();
        const res = await chai
            .request(server)
            .patch(`/api/${modelName}/id/${modelID}`)
            .send({ email: faker.internet.email() });

        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body[modelName]).to.have.property('_id');
        expect(res.body[modelName].serial).equal(modelDataPre.serial);
      });

      it(`should return 400 when the ${modelName} ID is not valid`, async function () {
        if (!modelID) this.skip();
        const res = await chai.request(server).patch(`/api/${modelName}/id/123`);

        expectError(res, 400, '"id" length must be 24 characters long');
      });

      it(`should return 404 when the ${modelName} is not found`, async function () {
        if (!modelID) this.skip();
        const res = await chai
            .request(server)
            .patch(`/api/${modelName}/id/000000000000000000000001`);

        expectError(res, 404, `${modelName} not found.`);
      });
    });
  }

  if (options.delete) {
    describe(`Delete ${capitalizeFirstLetter(modelName)}`, () => {
      it(`should delete the ${modelName}`, async function () {
        if (!modelID) this.skip();
        const res = await chai
            .request(server)
            .delete(`/api/${modelName}/id/${modelID}`);

        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.equal(`${modelName} deleted successfully`);
      });

      it(`should return 400 when the ${modelName} ID is not valid`, async function () {
        if (!modelID) this.skip();
        const res = await chai.request(server).delete(`/api/${modelName}/id/123`);

        expectError(res, 400, '"id" length must be 24 characters long');
      });

      it(`should return 404 when the ${modelName} is not found`, async function () {
        if (!modelID) this.skip();
        const res = await chai
            .request(server)
            .delete(`/api/${modelName}/id/000000000000000000000001`);

        expectError(res, 404, `${modelName} not found.`);
      });
    });
  }
}

module.exports = generateCRUDTests;
