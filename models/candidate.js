

module.exports = (sequelize, DataTypes) => {
  const Candidate = sequelize.define('Candidate', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    party: {
      type: DataTypes.STRING
    },
    votes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    email: { 
      type: DataTypes.STRING,
      allowNull: false,  
      unique: true,      
      validate: {
        isEmail: true    
      }
    }
  });

 
  Candidate.associate = (models) => {
    Candidate.belongsToMany(models.Voter, {
      through: models.Vote,  
      foreignKey: 'candidate_id'
    });
  };

  return Candidate;
};
