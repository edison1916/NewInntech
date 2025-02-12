const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');
const voterRoutes = require('./routes/voterRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const loginRoutes = require('./routes/login');  
const votesRoutes = require('./routes/voteRoutes');
const { swaggerSpec, swaggerUi } = require('./swagger');

const app = express();

// Configurar CORS para permitir solo solicitudes desde el frontend
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

// Rutas
app.use('/voters', voterRoutes);
app.use('/candidates', candidateRoutes);
app.use('/votes', votesRoutes);
app.use('/login', loginRoutes);  


// Ruta para la documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Sincronizar los modelos con la base de datos
// utilizar force para cuando ejecutes el proyecto por primera vez 
// y no tengas tablas creadas en la base de datos
// luedo cambiarlo a alter para que no se borren los datos de la base de datos
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Las tablas se han creado correctamente');
  })
  .catch((err) => {
    console.error('Error al crear las tablas:', err);
  });

// Puerto desde variables de entorno
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
