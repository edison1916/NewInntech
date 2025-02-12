module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define('Vote', {
    voter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Voters',
        key: 'id'
      }
    },
    candidate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Candidates',
        key: 'id'
      }
    },
    voted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  // Relación entre Vote y Voter 
  Vote.associate = (models) => {
    Vote.belongsTo(models.Voter, {
      foreignKey: 'voter_id',
      as: 'voter'
    });
  };

  

  return Vote;
};
