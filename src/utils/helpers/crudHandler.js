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
                  // schema: {
                  //   $ref: `#/components/schemas/${schemaRef}Response`
                  // }
                }
              }
            }
          }
        },
        get: {
          summary: `Retrieve all ${modelName}s`,
          tags: [modelName],
          parameters: [
            {
              name: 'limit',
              in: 'query',
              required: false,
              description:
                'Limit the number of results per request. Maximum allowed is 100.',
              schema: {
                type: 'integer',
                default: 50,
                maximum: 100
              }
            },
            {
              name: 'offset',
              in: 'query',
              required: false,
              description:
                'Offset to start fetching results from. Useful for pagination.',
              schema: {
                description:
                  'Limit the number of results per request. Maximum allowed is 100.',
                type: 'integer',
                default: 0
              }
            }
          ],
          responses: {
            200: {
              description: `List of all ${modelName}s`,
              content: {
                'application/json': {
                  schema: {
                    type: 'array'
                    // items: {
                    //   $ref: `#/components/schemas/${schemaRef}`
                    // }
                  }
                }
              }
            },
            500: {
              description: `Failed to retrieve ${modelName}s.`,
              content: {
                'application/json': {}
              }
            }
          }
        }
      },
      [`/${modelName.toLowerCase()}/id/{id}`]: {
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
                    $ref: `#/components/schemas/Response404`
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
                    $ref: `#/components/schemas/Response404`
                  }
                }
              }
            },
            400: {
              description: 'Invalid updates or other error.',
              content: {
                'application/json': {
                  schema: {
                    $ref: `#/components/schemas/Response400`
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
                    $ref: `#/components/schemas/Response404`
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
  const logSource = `CRUDHandler - ${modelName}`

  return {
    create: async (req, res) => {
      const instance = new Model(req.body)
      try {
        await instance.save()
        logger.info(
          `Successfully created ${modelName} with id ${instance._id}.`,
          { source: logSource }
        )
        res.status(201).send({ [modelName]: instance })
      } catch (error) {
        logger.error(`Error creating ${modelName}: ${error.message}`, {
          source: logSource
        })
        res.status(400).send({ error: error.message })
      }
    },

    getOne: async (req, res) => {
      try {
        const instance = await Model.findById(req.params.id)
        if (!instance) {
          logger.warn(`${modelName} with id ${req.params.id} not found.`, {
            source: logSource
          })
          return res.status(404).send({ error: `${modelName} not found.` })
        }
        logger.info(
          `Successfully retrieved ${modelName} with id ${req.params.id}.`,
          { source: logSource }
        )
        res.json({ [modelName]: instance })
      } catch (error) {
        logger.error(
          `Error retrieving ${modelName} with id ${req.params.id}: ${error}`,
          { source: logSource }
        )
        res.status(500).send({ error: 'Internal server error' })
      }
    },

    getAll: async (req, res) => {
      // Parsing limit and offset from query parameters
      const limit = parseInt(req.query.limit, 10) || 50 // Default limit is 50
      const offset = parseInt(req.query.offset, 10) || 0 // Default offset is 0

      // Ensure limit doesn't exceed maximum allowed value
      if (limit > 100) {
        logger.warn(`Requested limit exceeds maximum allowed limit.`, {
          source: logSource
        })
        return res
          .status(400)
          .send({ error: `Limit should not exceed 100 items per request.` })
      }

      try {
        const instances = await Model.find().skip(offset).limit(limit)
        logger.info(
          `Successfully retrieved ${instances.length} ${modelName}s from offset ${offset}.`,
          {
            source: logSource
          }
        )
        res.json({ [modelName]: instances })
      } catch (error) {
        logger.error(`Error retrieving ${modelName}s: ${error.message}`, {
          source: logSource
        })
        res.status(500).json({ error: 'Internal server error' })
      }
    },

    update: async (req, res) => {
      try {
        const instance = await Model.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true, runValidators: true }
        )
        if (!instance) {
          logger.warn(
            `Failed to update ${modelName} with id ${req.params.id} - Not found.`,
            { source: logSource }
          )
          return res.status(404).send({ error: `${modelName} not found.` })
        }
        logger.info(
          `Successfully updated ${modelName} with id ${req.params.id}.`,
          { source: logSource }
        )
        res.send({ [modelName]: instance })
      } catch (error) {
        logger.error(
          `Error updating ${modelName} with id ${req.params.id}: ${error.message}`,
          { source: logSource }
        )
        res.status(400).send({ error: error.message })
      }
    },

    remove: async (req, res) => {
      try {
        const instance = await Model.findByIdAndDelete(req.params.id)
        if (!instance) {
          logger.warn(
            `Failed to delete ${modelName} with id ${req.params.id} - Not found.`,
            { source: logSource }
          )
          return res.status(404).send({ error: `${modelName} not found.` })
        }
        logger.info(
          `Successfully deleted ${modelName} with id ${req.params.id}.`,
          { source: logSource }
        )
        res.send({
          [modelName]: instance,
          message: `${modelName} deleted successfully`
        })
      } catch (error) {
        logger.error(
          `Error deleting ${modelName} with id ${req.params.id}: ${error.message}`,
          { source: logSource }
        )
        res.status(500).send({ error: 'Internal server error' })
      }
    }
  }
}
// Usa queste funzioni di utility per evitare di ripetere la logica della capitalizzazione
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Factory function per generare CRUD handlers, specifiche Swagger e middleware di validazione
module.exports.generateResources = (
  Model,
  modelName
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
