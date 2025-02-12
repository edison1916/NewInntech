module.exports = (sequelize, DataTypes) => {
  const Voter = sequelize.define('Voter', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,  
    },
    has_voted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

   // Relaciones
   Voter.associate = (models) => {
    Voter.belongsToMany(models.Candidate, {
      through: models.Vote,  // Relación muchos a muchos con Candidate a través de Vote
      foreignKey: 'voter_id'
    });
  };

  return Voter;
};
