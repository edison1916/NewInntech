const { Vote } = require('../models'); 

const validateSingleVote = async (req, res, next) => {
  const { voter_id, candidate_id } = req.body; 

  if (!voter_id) {
    return res.status(400).json({ message: 'El ID del votante es obligatorio.' });
  }

  console.log('Datos de la solicitud:', req.body); // Para verificar que los datos están llegando correctamente

  try {
    // Verifica si el votante ya ha votado
    const existingVote = await Vote.findOne({ where: { voter_id } });

    console.log('Resultado de la consulta:', existingVote); // Verifica el resultado de la consulta

    if (existingVote) {
      return res.status(400).json({ message: 'Este votante ya ha emitido su voto.' });
    }

    // Si no ha votado, permite que el flujo continúe
    next();
  } catch (error) {
    console.error('Error al verificar el voto:', error); 
    return res.status(500).json({ message: 'Error al verificar el voto.' });
  }
};

module.exports = validateSingleVote;
