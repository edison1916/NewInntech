const express = require('express');
const { Candidate, Voter } = require('../models'); // Se importa el modelo de Voter
const jwt = require('jsonwebtoken');
const validateUserRole = require('../middlewares/validateUserRole');
const authenticateToken = require('../auth');

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Candidates
 *   description: Endpoints para la gestión de candidatos
 */

/**
 * @swagger
 * /candidates:
 *   post:
 *     summary: Registrar un nuevo candidato
 *     tags: [Candidates]
 *     description: Permite registrar un nuevo candidato con nombre, posición y email. Un votante no puede ser registrado como candidato y viceversa.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Carlos Ramírez"
 *               position:
 *                 type: string
 *                 example: "Presidente"
 *               email:
 *                 type: string
 *                 example: "carlos@example.com"
 *     responses:
 *       201:
 *         description: Candidato registrado con éxito
 *       400:
 *         description: Error al registrar candidato (ya está registrado como votante o email ya registrado)
 */
router.post('/', validateUserRole, async (req, res) => {
  try {
    const { name, position, email } = req.body;

    if (!name || !position || !email) {
      return res.status(400).json({ message: 'Nombre, posición y email son requeridos' });
    }

    // Verificar si el email ya está registrado como candidato
    const existingCandidate = await Candidate.findOne({ where: { email } });
    if (existingCandidate) {
      return res.status(400).json({ message: 'Este email ya está registrado como candidato.' });
    }

    // Verificar si la persona ya está registrada como votante
    const existingVoter = await Voter.findOne({ where: { name } });
    if (existingVoter) {
      return res.status(400).json({ message: 'Este usuario ya está registrado como votante y no puede ser candidato.' });
    }

    const candidate = await Candidate.create({ name, position, email });
    res.status(201).json(candidate);
  } catch (error) {
    res.status(400).json({ message: 'Error al registrar candidato', error });
  }
});

/**
 * @swagger
 * /candidates:
 *   get:
 *     summary: Obtener todos los candidatos
 *     tags: [Candidates]
 *     description: Retorna una lista con todos los candidatos registrados.
 *     responses:
 *       200:
 *         description: Lista de candidatos obtenida con éxito
 *       400:
 *         description: Error al obtener candidatos
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    res.json(candidates);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener candidatos', error });
  }
});

/**
 * @swagger
 * /candidates/{id}:
 *   get:
 *     summary: Obtener detalles de un candidato
 *     tags: [Candidates]
 *     description: Retorna los detalles de un candidato según su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del candidato
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Candidato encontrado
 *       404:
 *         description: Candidato no encontrado
 *       400:
 *         description: Error al obtener candidato
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (candidate) {
      res.json(candidate);
    } else {
      res.status(404).json({ message: 'Candidato no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener candidato', error });
  }
});

/**
 * @swagger
 * /candidates/{id}:
 *   delete:
 *     summary: Eliminar un candidato
 *     tags: [Candidates]
 *     description: Elimina un candidato por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del candidato
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Candidato eliminado con éxito
 *       404:
 *         description: Candidato no encontrado
 *       400:
 *         description: Error al eliminar candidato
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (candidate) {
      await candidate.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Candidato no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar candidato', error });
  }
});

module.exports = router;
