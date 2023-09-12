module.exports = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Factory Manager API',
            version: '1.0.0',
            description: 'API endpoints to manage factory operations.',
            contact: {
                name: 'David Cohen & Giulia Nardicchia',
                email: 'david.cohen@studio.unibo.it; giulia.nardicchia@studio.unibo.it',
            },
        },
        servers: [
            {
                url: '{protocol}://localhost:4000/api/',
                variables: {
                    protocol: {
                        default: "http",
                        description: "API protocol."
                    }
                }
            },
        ],
        paths: {}, // Initialize an empty paths object
        components: {
            schemas: {
                UserSchema: {
                    type: 'object',
                    description: 'User entity with email and password fields.',
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address.'
                        },
                        password: {
                            type: 'string',
                            description: 'User password (hashed).'
                        }
                    },
                    required: ['email', 'password']
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
                                },
                            }
                        }
                    },
                    required: ['resultCode', 'resultMessage']
                },
                // If using JWT or similar, define the security scheme here
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                },
                LoginRequestBody: {
                    type: 'object',
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email of the user.'
                        },
                        password: {
                            type: 'string',
                            description: 'Password of the user.'
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
                            description: 'Email of the user.'
                        },
                    },
                    required: ['email', 'password']
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
            }
        },
    },
    apis: [
        "src/utils/helpers/*.js",
        "src/api/controllers/user/*.js",
        "src/api/controllers/user/auth/*.js",
    ]
};
