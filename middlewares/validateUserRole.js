const { Voter, Candidate } = require('../models');

const validateUserRole = async (req, res, next) => {
  const { email } = req.body;

  // Verificar si el usuario ya existe como votante o candidato
  const existingVoter = await Voter.findOne({ where: { email } });
  const existingCandidate = await Candidate.findOne({ where: { email } });

  if (existingVoter) {
    return res.status(400).json({ message: 'El usuario ya está registrado como votante y no puede ser candidato.' });
  }

  if (existingCandidate) {
    return res.status(400).json({ message: 'El usuario ya está registrado como candidato y no puede ser votante.' });
  }

  next(); 
};

module.exports = validateUserRole;
