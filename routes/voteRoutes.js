const express = require('express');
const { Vote, Voter, Candidate } = require('../models'); 
const validateSingleVote = require('../middlewares/validateSingleVote'); // Middleware de validación de voto único
const authenticateToken = require('../auth');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Votes
 *     description: Operaciones relacionadas con los votos
 */

/**
 * @swagger
 * /votes:
 *   post:
 *     tags: [Votes]
 *     summary: Emitir un voto
 *     description: Permite que un votante emita su voto, validando que no haya votado previamente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voter_id:
 *                 type: integer
 *                 description: ID del votante que emite el voto
 *                 example: 1
 *               candidate_id:
 *                 type: integer
 *                 description: ID del candidato al que se emite el voto
 *                 example: 1
 *     responses:
 *       201:
 *         description: Voto emitido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 voter_id:
 *                   type: integer
 *                   example: 1
 *                 candidate_id:
 *                   type: integer
 *                   example: 1
 *                 voted_at:
 *                   type: string
 *                   example: "2025-02-12T13:30:00.000Z"
 *       400:
 *         description: Votante ya ha emitido un voto
 *       404:
 *         description: Votante o candidato no encontrado
 */
router.post('/', async (req, res) => {
  try {
    const { voter_id, candidate_id } = req.body;

    // Verificar que los parámetros no sean undefined
    if (voter_id === undefined || candidate_id === undefined) {
      return res.status(400).json({ message: 'El id del votante o del candidato no puede ser undefined.' });
    }

    // Verificar si el votante ya ha emitido su voto
    const existingVote = await Vote.findOne({ where: { voter_id } });
    if (existingVote) {
      return res.status(400).json({ message: 'Este votante ya ha emitido su voto.' });
    }

    // Verificar que el votante existe
    const voter = await Voter.findByPk(voter_id);
    if (!voter) {
      return res.status(404).json({ message: 'Votante no encontrado.' });
    }

    // Verificar que el candidato existe
    const candidate = await Candidate.findByPk(candidate_id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidato no encontrado.' });
    }

    
    const vote = await Vote.create({ voter_id, candidate_id });

    return res.status(201).json(vote);
  } catch (error) {
    console.error('Error al crear el voto:', error);
    return res.status(400).json({ message: error.message });
  }
});





/**
 * @swagger
 * /votes:
 *   get:
 *     tags: [Votes]
 *     summary: Obtener todos los votos emitidos
 *     description: Obtiene una lista de todos los votos emitidos.
 *     responses:
 *       200:
 *         description: Lista de votos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   voter_id:
 *                     type: integer
 *                   candidate_id:
 *                     type: integer
 *                   voted_at:
 *                     type: string
 *       500:
 *         description: Error al obtener los votos
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const votes = await Vote.findAll();
    return res.status(200).json(votes);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener los votos.' });
  }
});

/**
 * @swagger
 * /votes/statistics:
 *   get:
 *     tags: [Votes]
 *     summary: Obtener estadísticas de la votación
 *     description: Obtiene el total de votos por candidato, el porcentaje de votos y el total de votantes que han votado.
 *     responses:
 *       200:
 *         description: Estadísticas de la votación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_voters:
 *                   type: integer
 *                   example: 100
 *                 candidates:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       candidate:
 *                         type: string
 *                         example: "Candidato A"
 *                       votes:
 *                         type: integer
 *                         example: 50
 *                       percentage:
 *                         type: string
 *                         example: "50.00%"
 *       500:
 *         description: Error al obtener las estadísticas
 */
router.get('/statistics', authenticateToken, async (req, res) => {
  try {
    const votes = await Vote.findAll();
    const candidates = await Candidate.findAll();
    const totalVoters = await Voter.count({ where: {} }); 
    const votersWhoVoted = new Set(votes.map(vote => vote.voter_id)).size; 

    const statistics = candidates.map(candidate => {
      const candidateVotes = votes.filter(vote => vote.candidate_id === candidate.id).length;
      const percentage = votes.length > 0 ? ((candidateVotes / votes.length) * 100).toFixed(2) + '%' : '0.00%';

      return {
        candidate: candidate.name,
        votes: candidateVotes,
        percentage
      };
    });

    res.json({
      total_voters: votersWhoVoted,
      candidates: statistics
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas', error });
  }
});

module.exports = router;


module.exports = router;