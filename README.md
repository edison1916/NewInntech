
# Proyecto Node.js con Express

 API RESTful construida con Node.js y Express.

## Requisitos

- Node.js
- npm 
- nodemon 
- Express
- body-parser
- cors
- dotenv
- pg
- pg-hstore
- ORM sequelize
- swagger-jsdoc
- swagger-ui-express



"bcryptjs": "^2.4.3",
    "body-parser": "^1.20.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.13.2",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.37.5",
    "sequelize-cli": "^6.6.2",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.1"

## Instrucciones para ejecutar el proyecto localmente

1- Clona el repositorio
2- instala las dependencias - npm i
3- ve a la raiz del proyecto y ejecuta el comando npm run dev 
4- El servidor y el swagger se ejecutaran en el http://localhost:3000/api-docs/
5- los metodos post no estan proyejidos por JWT los demas metodos si.
6- Para probar los metodos protejidos debes utilizar postman primero solicitar el token
7- una vez solicite el token lo debes pasar por la cabecera y enviar la solicitud. 
8- si al ejecutar la app el puerto 3000 dice estar ocupado se debe modificar. 



