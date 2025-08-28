const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const PORT = process.env.PORT || 4000;
const BASE = process.env.BASE_URL || `http://localhost:${PORT}`;

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Feedback & Issue Tracker API', version: '1.0.0' },
    servers: [{ url: BASE }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer' } }
    },
    security: [{ bearerAuth: [] }]
  },
  // arahkan ke SEMUA file route .js
  apis: [path.join(__dirname, '../routes/*.js')],
};

module.exports = swaggerJSDoc(options);
