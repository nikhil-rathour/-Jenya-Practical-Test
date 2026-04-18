const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Event Booking API',
      version: '1.0.0',
      description: 'API for user authentication and event management'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local development server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              example: 'Password123'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              example: 'Password123'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '664f1f77bcf86cd799439011'
            },
            name: {
              type: 'string',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-18T10:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-18T10:30:00.000Z'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example'
            }
          }
        },
        EventRequest: {
          type: 'object',
          required: ['name', 'date', 'capacity'],
          properties: {
            name: {
              type: 'string',
              example: 'Tech Conference 2026'
            },
            date: {
              type: 'string',
              example: '2023-12-25',
              description: 'Event date in YYYY-MM-DD format'
            },
            capacity: {
              type: 'integer',
              example: 100
            }
          }
        },
        EventUpdateRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'Tech Conference 2026 - Updated'
            },
            date: {
              type: 'string',
              example: '2023-12-26',
              description: 'Event date in YYYY-MM-DD format'
            },
            capacity: {
              type: 'integer',
              example: 120
            }
          }
        },
        Event: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '664f1f77bcf86cd799439012'
            },
            name: {
              type: 'string',
              example: 'Tech Conference 2026'
            },
            date: {
              type: 'string',
              example: '2023-12-25'
            },
            capacity: {
              type: 'integer',
              example: 100
            },
            availableSeats: {
              type: 'integer',
              example: 100
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-18T10:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-18T10:30:00.000Z'
            }
          }
        },
        EventListResponse: {
          type: 'object',
          properties: {
            events: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Event'
              }
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  example: 1
                },
                limit: {
                  type: 'integer',
                  example: 10
                },
                total: {
                  type: 'integer',
                  example: 1
                },
                totalPages: {
                  type: 'integer',
                  example: 1
                }
              }
            }
          }
        },
        MessageResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Event deleted successfully'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Server error'
            },
            error: {
              type: 'string',
              example: 'Detailed error message'
            }
          }
        }
      }
    }
  },
  apis: [path.join(__dirname, '../routes/*.js')]
};

module.exports = swaggerJsdoc(options);
