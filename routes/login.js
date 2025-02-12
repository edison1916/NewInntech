const express = require('express');
const jwt = require('jsonwebtoken');
const { Voter } = require('../models');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const router = express.Router();


/**
 * @swagger
 * tags:
 *   - name: Login
 *     description: Operaciones de autenticación de usuarios
 */

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Login]
 *     summary: Login de usuario
 *     description: Este endpoint permite autenticar a un usuario mediante su email y contraseña. Si las credenciales son válidas, se genera un token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 example: contraseña123
 *     responses:
 *       200:
 *         description: Token generado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "jwt.token.here"
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  const user = await Voter.findOne({ where: { email } });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );

  res.json({ token });
});

module.exports = router;

