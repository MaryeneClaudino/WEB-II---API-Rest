import { Router } from 'express';
import { isAuth } from '../middlewares/is-auth.js';
import { login, logout, verifyToken } from '../controllers/auth-controller.js';
import { validateRequest } from "../middlewares/validation.js";
import { loginSchema } from "../validators/auth-validator.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Rotas de autenticação de usuários
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: exemplo@email.com
 *               password:
 *                 type: string
 *                 example: 12345
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /auth/verify/{token}:
 *   get:
 *     summary: Verifica a validade de um token
 *     tags: [Auth]
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: abc123
 *     responses:
 *       200:
 *         description: Email verificado com sucesso
 *       400:
 *         description: Email já verificado anteriormente
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Realiza o logout do usuário
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout bem-sucedido
 *       401:
 *         description: Usuário não autenticado
 */

router.post('/login', validateRequest(loginSchema), login);
router.get('/verify/:token', verifyToken);
router.get('/logout', isAuth, logout);

export default router;
