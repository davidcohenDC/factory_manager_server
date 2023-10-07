module.exports = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Factory Manager API',
      version: '1.0.0',
      description: 'API endpoints to manage factory operations.',
      contact: {
        name: 'David Cohen & Giulia Nardicchia',
        email: 'david.cohen@studio.unibo.it; giulia.nardicchia@studio.unibo.it'
      }
    },
    servers: [
      {
        url: '{protocol}://localhost:4000/api/',
        variables: {
          protocol: {
            default: 'http',
            description: 'API protocol.'
          }
        }
      }
    ],
    paths: {}, // Initialize an empty paths object
    components: {
      schemas: {
        UserSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'object',
              properties: {
                first: {
                  type: 'string',
                  example: 'John'
                },
                last: {
                  type: 'string',
                  example: 'Doe'
                }
              }
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com'
            },
            password: {
              type: 'string',
              example: 'Password1234!'
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              example: '1990-01-01'
            },
            address: {
              type: 'object',
              properties: {
                street: {
                  type: 'string',
                  example: '123 Main St'
                },
                city: {
                  type: 'string',
                  example: 'Anytown'
                },
                state: {
                  type: 'string',
                  example: 'CA'
                },
                zip: {
                  type: 'string',
                  example: '90210'
                },
                country: {
                  type: 'string',
                  example: 'US'
                }
              }
            },
            phoneNumbers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    enum: ['mobile'],
                    example: 'mobile'
                  },
                  number: {
                    type: 'string',
                    example: '+1234567890'
                  }
                }
              }
            },
            role: {
              type: 'string',
              enum: ['administrator', 'moderator', 'worker'],
              example: 'worker'
            },
            department: {
              type: 'string',
              example: 'Engineering'
            },
            isActive: {
              type: 'boolean',
              default: true
            },
            lastLogin: {
              type: 'string',
              format: 'date-time'
            },
            profilePicture: {
              type: 'string',
              example: 'http://example.com/path/to/profile.jpg'
            },
            security: {
              type: 'object',
              properties: {
                twoFactorEnabled: {
                  type: 'boolean',
                  example: false
                },
                lastPasswordChange: {
                  type: 'string',
                  format: 'date-time'
                }
              }
            },
            preferences: {
              type: 'object',
              properties: {
                theme: {
                  type: 'string',
                  enum: ['light', 'dark'],
                  default: 'light'
                },
                language: {
                  type: 'string',
                  enum: ['en', 'es', 'fr'],
                  default: 'en'
                }
              }
            },
            socialLinks: {
              type: 'object',
              properties: {
                linkedin: {
                  type: 'string',
                  example: 'http://linkedin.com/in/johndoe'
                },
                twitter: {
                  type: 'string',
                  example: 'http://twitter.com/johndoe'
                }
              }
            },
            joinedDate: {
              type: 'string',
              format: 'date',
              example: '2022-01-01'
            },
            notes: {
              type: 'string',
              example: 'This is a note about John Doe.'
            },
            testUser: {
              type: 'boolean',
              default: false
            }
          },
          required: ['email', 'password']
        },
        "MachineSchema": {
          "type": "object",
          "properties": {
            "machineId": {
              "type": "string",
              "example": "MCHN001"
            },
            "name": {
              "type": "string",
              "example": "Lathe-101"
            },
            "location": {
              "type": "object",
              "properties": {
                "area": {
                  "type": "string",
                  "example": "Plant1-South"
                }
              }
            },
            "status": {
              "type": "object",
              "properties": {
                "operational": {
                  "type": "boolean",
                  "example": true
                },
                "currentAnomalies": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "example": ["High Temperature"]
                }
              }
            },
            "specifications": {
              "type": "object",
              "properties": {
                "powerConsumption": {
                  "type": "object",
                  "properties": {
                    "normalRange": {
                      "type": "object",
                      "properties": {
                        "min": {
                          "type": "string",
                          "format": "Decimal",
                          "example": "150.0"
                        },
                        "max": {
                          "type": "string",
                          "format": "Decimal",
                          "example": "200.0"
                        }
                      }
                    },
                    "current": {
                      "type": "string",
                      "format": "Decimal",
                      "example": "180.5"
                    }
                  }
                },
                "emissions": {
                  "$ref": "#/components/schemas/SpecRange"
                },
                "operatingTemperature": {
                  "$ref": "#/components/schemas/SpecRange"
                },
                "humidity": {
                  "$ref": "#/components/schemas/SpecRange"
                },
                "otherSpecification": {
                  "type": "string",
                  "example": "Emergency Stop Feature"
                }
              }
            },
            "turns": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "turn": {
                    "type": "string",
                    "example": "Turn1"
                  },
                  "userId": {
                    "type": "string",
                    "format": "ObjectId",
                    "example": "60f5b5f7a2f7c42fd6501acc"
                  },
                  "userName": {
                    "type": "string",
                    "example": "John Doe"
                  }
                }
              }
            },
            "maintenance": {
              "type": "object",
              "properties": {
                "lastMaintenanceDate": {
                  "type": "string",
                  "format": "date",
                  "example": "2023-09-15"
                },
                "nextMaintenanceDate": {
                  "type": "string",
                  "format": "date",
                  "example": "2023-11-15"
                },
                "maintenanceHistory": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "date": {
                        "type": "string",
                        "format": "date",
                        "example": "2023-09-15"
                      },
                      "description": {
                        "type": "string",
                        "example": "Replaced grinding wheel"
                      }
                    }
                  }
                }
              }
            },
            "log": {
              "type": "object",
              "properties": {
                "lastPowerOn": {
                  "type": "string",
                  "format": "date-time",
                  "example": "2023-10-06T08:30:00Z"
                },
                "lastPowerOff": {
                  "type": "string",
                  "format": "date-time",
                  "example": "2023-10-06T14:30:00Z"
                },
                "totalRunningTime": {
                  "type": "string",
                  "example": "PT6H"
                },
                "sessions": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "powerOn": {
                        "type": "string",
                        "format": "date-time",
                        "example": "2023-10-06T08:30:00Z"
                      },
                      "powerOff": {
                        "type": "string",
                        "format": "date-time",
                        "example": "2023-10-06T14:30:00Z"
                      },
                      "duration": {
                        "type": "string",
                        "example": "PT6H"
                      }
                    }
                  }
                }
              }
            }
          },
          "required": ['machineId','name', 'location', 'status', 'specifications', 'turns', 'maintenance', 'log']
        },
        "SpecRange": {
          "type": "object",
          "properties": {
            "normalRange": {
              "type": "object",
              "properties": {
                "min": {
                  "type": "string",
                  "format": "Decimal",
                  "example": "20.0"
                },
                "max": {
                  "type": "string",
                  "format": "Decimal",
                  "example": "40.0"
                }
              }
            },
            "current": {
              "type": "string",
              "format": "Decimal",
              "example": "30.0"
            }
          }
        },
        LoginRequestBody: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email of the user.',
              example: 'john.doe@example.com'
            },
            password: {
              type: 'string',
              description: 'Password of the user.',
              example: 'Password1234!'
            }
          },
          required: ['machineId', 'location']
        },
        CheckEmailRequestBody: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email of the user.',
              example: 'john.doe@example.com'
            }
          },
          required: ['email'] // Removed 'password' from required since it's not present in the schema.
        },
        Response404: {
          description: 'Resource not found.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        Response400: {
          description: 'Bad request.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    'src/utils/helpers/*.js',
    'src/api/controllers/user/*.js',
    'src/api/controllers/user/auth/*.js'
  ]
}
