const { swaggerConfig } = require('@config/')
const { logger } = require('@config/')
function generateSwaggerDocForCRUD(modelName, schemaRef) {
  return {
    paths: {
      [`/${modelName.toLowerCase()}`]: {
        post: {
          summary: `Create a new ${modelName}`,
          tags: [modelName],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: `#/components/schemas/${schemaRef}`
                }
              }
            }
          },
          responses: {
            201: {
              description: `${modelName} created successfully.`,
              content: {
                'application/json': {
                  schema: {
                    $ref: `#/components/schemas/${schemaRef}`
                  }
                }
              }
            },
            400: {
              description: `Failed to create ${modelName}.`,
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Result'
                  }
                }
              }
            }
          }
        },
        get: {
          summary: `Retrieve all ${modelName}s`,
          tags: [modelName],
          responses: {
            200: {
              description: `List of all ${modelName}s`,
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: `#/components/schemas/${schemaRef}`
                    }
                  }
                }
              }
            },
            500: {
              description: `Failed to retrieve ${modelName}s.`,
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Result'
                  }
                }
              }
            }
          }
        }
      },
      [`/${modelName.toLowerCase()}/{id}`]: {
        get: {
          summary: `Retrieve a ${modelName} by ID`,
          tags: [modelName],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: `ID of the ${modelName} to retrieve`,
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            200: {
              description: `${modelName} retrieved successfully.`,
              content: {
                'application/json': {
                  schema: {
                    $ref: `#/components/schemas/${schemaRef}`
                  }
                }
              }
            },
            404: {
              description: `${modelName} not found.`,
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Result'
                  }
                }
              }
            }
          }
        },
        patch: {
          summary: `Update a ${modelName} by ID`,
          tags: [modelName],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: `ID of the ${modelName} to update`,
              schema: {
                type: 'string'
              }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: `#/components/schemas/${schemaRef}`
                }
              }
            }
          },
          responses: {
            200: {
              description: `${modelName} updated successfully.`,
              content: {
                'application/json': {
                  schema: {
                    $ref: `#/components/schemas/${schemaRef}`
                  }
                }
              }
            },
            404: {
              description: `${modelName} not found.`,
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Result'
                  }
                }
              }
            },
            400: {
              description: 'Invalid updates or other error.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Result'
                  }
                }
              }
            }
          }
        },
        delete: {
          summary: `Delete a ${modelName} by ID`,
          tags: [modelName],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: `ID of the ${modelName} to delete`,
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            200: {
              description: `${modelName} deleted successfully.`,
              content: {
                'application/json': {
                  schema: {
                    $ref: `#/components/schemas/${schemaRef}`
                  }
                }
              }
            },
            404: {
              description: `${modelName} not found.`,
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Result'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}


const CRUDHandler = (Model, modelName) => {
  const logSource = `CRUDHandler - ${modelName}`;

  return {
    create: async (req, res) => {
      const instance = new Model(req.body);
      try {
        await instance.save();
        logger.info(`Successfully created ${modelName} with id ${instance._id}.`, { source: logSource });
        res.status(201).send({ [modelName]: instance });
      } catch (error) {
        logger.error(`Error creating ${modelName}: ${error.message}`, { source: logSource });
        if (error.code === 11000) {
          res.status(400).send({ error: 'Email is already taken' });
        } else {
          res.status(400).send({ error: `Failed to create ${modelName}.` });
        }
      }
    },

    getOne: async (req, res) => {
      try {
        const instance = await Model.findById(req.params.id);
        if (!instance) {
          logger.warn(`${modelName} with id ${req.params.id} not found.`, { source: logSource });
          return res.status(404).send();
        }
        logger.info(`Successfully retrieved ${modelName} with id ${req.params.id}.`, { source: logSource });
        res.json({ [modelName]: instance });
      } catch (error) {
        logger.error(`Error retrieving ${modelName} with id ${req.params.id}: ${error.message}`, { source: logSource });
        res.status(500).send();
      }
    },

    getAll: async (req, res) => {
      try {
        const instances = await Model.find();
        logger.info(`Successfully retrieved all ${modelName}s.`, { source: logSource });
        res.json({ [modelName]: instances });
      } catch (error) {
        logger.error(`Error retrieving all ${modelName}s: ${error.message}`, { source: logSource });
        res.status(500).json({ error: 'Internal server error' });
      }
    },

    update: async (req, res) => {
      try {
        const instance = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!instance) {
          logger.warn(`Failed to update ${modelName} with id ${req.params.id} - Not found.`, { source: logSource });
          return res.status(404).send();
        }
        logger.info(`Successfully updated ${modelName} with id ${req.params.id}.`, { source: logSource });
        res.send({ [modelName]: instance });
      } catch (error) {
        logger.error(`Error updating ${modelName} with id ${req.params.id}: ${error.message}`, { source: logSource });
        res.status(400).send(error);
      }
    },

    remove: async (req, res) => {
      try {
        const instance = await Model.findByIdAndDelete(req.params.id);
        if (!instance) {
          logger.warn(`Failed to delete ${modelName} with id ${req.params.id} - Not found.`, { source: logSource });
          return res.status(404).send();
        }
        logger.info(`Successfully deleted ${modelName} with id ${req.params.id}.`, { source: logSource });
        res.send({ [modelName]: instance });
      } catch (error) {
        logger.error(`Error deleting ${modelName} with id ${req.params.id}: ${error.message}`, { source: logSource });
        res.status(500).send();
      }
    }
  }
};
// Usa queste funzioni di utility per evitare di ripetere la logica della capitalizzazione
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Factory function per generare CRUD handlers, specifiche Swagger e middleware di validazione
module.exports.generateResources = (
  Model,
  modelName,
  // joiBodySchema,
  // joiParamsSchema = null
) => {
  const capitalizedModelName = capitalizeFirstLetter(modelName)
  const handler = CRUDHandler(Model, modelName)
  const SwaggerSpecs = generateSwaggerDocForCRUD(
    capitalizedModelName,
    `${capitalizedModelName}Schema`
  )
  // Update paths before generating specDoc
  Object.assign(swaggerConfig.swaggerDefinition.paths, SwaggerSpecs.paths)
  // return an object with all the resources we've generated as handlers, specs and validation
  return handler
}
