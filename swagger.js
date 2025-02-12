const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Opciones para configurar Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema de Votaciones API',
      version: '1.0.0',
      description: 'Documentación de la API del sistema de votaciones',
    },
  },
  
  apis: ['./routes/*.js'],
};

// Crear especificación Swagger
const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerSpec, swaggerUi };
