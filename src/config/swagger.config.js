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
          }
        },
        Result: {
          type: 'object',
          description: 'Standard API response with result code and message.',
          properties: {
            resultCode: {
              type: 'string',
              description: 'Unique result code indicating the response type.'
            },
            resultMessage: {
              type: 'object',
              description: 'Localized result messages.',
              properties: {
                en: {
                  type: 'string',
                  description: 'English message.'
                }
              }
            }
          },
          required: ['resultCode', 'resultMessage']
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
          required: ['email'] // Removed 'password' from required since it's not present in the schema.
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Description of the error.'
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
