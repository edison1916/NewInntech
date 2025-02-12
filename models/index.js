require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  dialectOptions: {
  },
});

// Modelos
const Voter = require('./voter')(sequelize, DataTypes);
const Candidate = require('./candidate')(sequelize, DataTypes);
const Vote = require('./vote')(sequelize, DataTypes);


Voter.hasMany(Vote, { foreignKey: 'voter_id' });
Vote.belongsTo(Voter, { foreignKey: 'voter_id' });

Candidate.hasMany(Vote, { foreignKey: 'candidate_id' });
Vote.belongsTo(Candidate, { foreignKey: 'candidate_id' });

// Exportar los modelos y la instancia de sequelize
module.exports = { Voter, Candidate, Vote, sequelize };
