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
              required: true,
              unique: true,
              example: 'john.doe@example.com'
            },
            password: {
              type: 'string',
              required: true,
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
              default: true,
              example: true
            },
            lastLogin: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00Z'
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
                  format: 'date-time',
                  example: '2024-01-01T00:00:00Z'
                }
              }
            },
            preferences: {
              type: 'object',
              properties: {
                theme: {
                  type: 'string',
                  enum: ['light', 'dark'],
                  default: 'light',
                  example: 'light'
                },
                language: {
                  type: 'string',
                  enum: ['en', 'es', 'fr'],
                  default: 'en',
                  example: 'en'
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
            test: {
              type: 'boolean',
              default: false,
              example: false
            }
          },
          required: ['email', 'password']
        },
        SpecRange: {
          type: 'object',
          properties: {
            normalRange: {
              type: 'object',
              properties: {
                min: {
                  type: 'string',
                  format: 'decimal',
                  example: '20.0',
                  description: 'Minimum acceptable value.'
                },
                max: {
                  type: 'string',
                  format: 'decimal',
                  example: '40.0',
                  description: 'Maximum acceptable value.'
                }
              }
            }
          }
        },
        MachineSchema: {
          type: 'object',
          properties: {
            serial: {
              type: 'string',
              example: 'MCH9999'
            },
            name: {
              type: 'string',
              example: 'Olive Crusher'
            },
            location: {
              type: 'object',
              properties: {
                area: {
                  type: 'string',
                  example: 'Crushing Section'
                }
              }
            },
            machineState: {
              type: 'object',
              properties: {
                currentState: {
                  type: 'string',
                  enum: ['operational', 'anomaly', 'off'],
                  example: 'operational'
                },
                anomalyDetails: {
                  type: 'array',
                  items: {
                    type: 'string',
                    example: 'powerConsumption'
                  }
                }
              }
            },
            specifications: {
              type: 'object',
              properties: {
                powerConsumption: {
                  $ref: '#/components/schemas/SpecRange'
                },
                emissions: {
                  $ref: '#/components/schemas/SpecRange'
                },
                operatingTemperature: {
                  $ref: '#/components/schemas/SpecRange'
                },
                vibration: {
                  $ref: '#/components/schemas/SpecRange'
                },
                pressure: {
                  $ref: '#/components/schemas/SpecRange'
                }
              }
            },
            turns: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  turn: {
                    type: 'string',
                    enum: ['morning', 'evening', 'night'],
                    example: 'morning'
                  },
                  userId: {
                    type: 'string',
                    example: '64c8a8fdf86a5d4a781d9f3a'
                  },
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
                }
              }
            },
            maintenance: {
              type: 'object',
              properties: {
                lastMaintenanceDate: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-01-15T08:30:00Z'
                },
                nextMaintenanceDate: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-07-15T08:30:00Z'
                },
                maintenanceHistory: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      date: {
                        type: 'string',
                        format: 'date-time',
                        example: '2023-07-15T08:30:00Z'
                      },
                      description: {
                        type: 'string',
                        example: 'Replaced crusher blades'
                      }
                    }
                  }
                }
              }
            },
            log: {
              type: 'object',
              properties: {
                lastPowerOn: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-02-01T08:00:00Z'
                },
                lastPowerOff: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-02-01T16:00:00Z'
                },
                sessions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      powerOn: {
                        type: 'string',
                        format: 'date-time',
                        example: '2024-02-01T08:00:00Z'
                      },
                      powerOff: {
                        type: 'string',
                        format: 'date-time',
                        example: '2024-02-01T16:00:00Z'
                      },
                      duration: {
                        type: 'string',
                        example: '8h'
                      }
                    }
                  }
                }
              }
            },
            test: {
              type: 'boolean',
              example: false
            }
          }
        },
        AreaSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'Crushing Section',
              description: 'The name of the area within the factory.'
            },
            size: {
              type: 'number',
              example: 1500,
              description: 'The size of the area in square meters.'
            },
            machines: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/MachineSchema'
              },
              description: 'A list of machines within the area.'
            },
            // subAreas: {
            //   type: 'array',
            //   items: {
            //     $ref: '#/components/schemas/AreaSchema'
            //   },
            //   description: 'A list of sub-areas within this area.'
            // },
            test: {
              type: 'boolean',
              example: false,
              description: 'Field used for testing purposes.'
            }
          },
          required: ['name', 'size']
        },
        MachineSensorSchema: {
          type: 'object',
          properties: {
            serial: {
              type: 'string',
              example: 'SNSR001',
              description: 'The unique serial number of the machine sensor.'
            },
            sensorData: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  timestamp: {
                    type: 'string',
                    format: 'date-time',
                    example: '2024-02-01T08:00:00Z',
                    description: 'The timestamp of the sensor data entry.'
                  },
                  powerConsumption: {
                    type: 'string',
                    format: 'decimal',
                    example: '150.0',
                    description: 'The power consumption recorded by the sensor.'
                  },
                  emissions: {
                    type: 'string',
                    format: 'decimal',
                    example: '0.75',
                    description: 'The emissions recorded by the sensor.'
                  },
                  operatingTemperature: {
                    type: 'string',
                    format: 'decimal',
                    example: '65.3',
                    description:
                      'The operating temperature recorded by the sensor.'
                  },
                  vibration: {
                    type: 'string',
                    format: 'decimal',
                    example: '0.02',
                    description: 'The vibration level recorded by the sensor.'
                  },
                  pressure: {
                    type: 'string',
                    format: 'decimal',
                    example: '101.3',
                    description: 'The pressure level recorded by the sensor.'
                  },
                  anomaly: {
                    type: 'boolean',
                    example: false,
                    description: 'Indicates if an anomaly was detected.'
                  }
                }
              },
              description:
                'An array of sensor data entries recorded by the machine sensor.'
            },
            test: {
              type: 'boolean',
              example: false,
              description: 'Field used for testing purposes.'
            }
          },
          required: ['serial']
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
          required: ['email', 'password']
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
          required: ['email']
        }
        // Response404: {
        //   description: 'Resource not found.',
        //   content: {
        //     'application/json': {
        //       schema: {
        //         type: 'object',
        //         properties: {
        //           error: {
        //             type: 'string'
        //           }
        //         }
        //       }
        //     }
        //   }
        // },
        // Response400: {
        //   description: 'Bad request.',
        //   content: {
        //     'application/json': {
        //       schema: {
        //         type: 'object',
        //         properties: {
        //           error: {
        //             type: 'string'
        //           }
        //         }
        //       }
        //     }
        //   }
        // }
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
    'src/api/controllers/machine/*.js',
    'src/api/controllers/user/*.js',
    'src/api/controllers/area/*.js',
    'src/api/controllers/machineSensor/*.js'
  ]
}
