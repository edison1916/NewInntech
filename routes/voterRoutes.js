const express = require('express');
const { Voter } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateUserRole = require('../middlewares/validateUserRole'); // Importar el middleware
const authenticateToken = require('../auth');

const router = express.Router();

// // Middleware de autenticación JWT mejorado
// const authenticateJWT = (req, res, next) => {
//   try {
//     const token = req.header('Authorization');
//     if (!token) {
//       return res.status(403).json({ message: 'Acceso denegado. Token no proporcionado.' });
//     }

//     jwt.verify(token, 'secreto', (err, user) => {
//       if (err) {
//         return res.status(403).json({ message: 'Token inválido.' });
//       }
//       req.user = user;
//       next();
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error al procesar el token', error: error.message });
//   }
// };

/**
 * @swagger
 * tags:
 *   name: Voters
 *   description: Endpoints para la gestión de voters
 */

/**
 * @swagger
 * /voters:
 *   post:
 *     summary: Registrar un nuevo votante
 *     description: Este endpoint permite registrar un nuevo votante.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 example: contraseña123
 *     responses:
 *       201:
 *         description: Votante creado con éxito
 *       400:
 *         description: Error al registrar votante
 */
router.post('/', validateUserRole, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nombre, correo y contraseña son requeridos' });
    }

    const existingVoter = await Voter.findOne({ where: { email } });
    if (existingVoter) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const voter = await Voter.create({ name, email, password: hashedPassword });

    res.status(201).json(voter);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error al registrar votante', error: error.message });
  }
});

/**
 * @swagger
 * /voters:
 *   get:
 *     summary: Obtener todos los votantes
 *     description: Este endpoint permite obtener la lista de todos los votantes.
 *     responses:
 *       200:
 *         description: Lista de votantes obtenida con éxito
 *       400:
 *         description: Error al obtener votantes
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const voters = await Voter.findAll();
    res.json(voters);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener votantes', error });
  }
});

/**
 * @swagger
 * /voters/{id}:
 *   get:
 *     summary: Obtener detalles de un votante
 *     description: Este endpoint permite obtener los detalles de un votante por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del votante
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Votante encontrado
 *       404:
 *         description: Votante no encontrado
 *       400:
 *         description: Error al obtener votante
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const voter = await Voter.findByPk(req.params.id);
    if (voter) {
      res.json(voter);
    } else {
      res.status(404).json({ message: 'Votante no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener votante', error });
  }
});

/**
 * @swagger
 * /voters/{id}:
 *   delete:
 *     summary: Eliminar un votante
 *     description: Este endpoint permite eliminar un votante por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del votante
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Votante eliminado con éxito
 *       404:
 *         description: Votante no encontrado
 *       400:
 *         description: Error al eliminar votante
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const voter = await Voter.findByPk(req.params.id);
    if (voter) {
      await voter.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Votante no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar votante', error });
  }
});

module.exports = router;
