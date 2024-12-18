import { Router } from 'express';
import { isAuth } from '../middlewares/is-auth.js';
import { getUsers, addUser, updateUser, deleteUser } from '../controllers/users-controller.js';
import { validateRequest } from "../middlewares/validation.js";
import { addUserSchema, updateUserSchema, deleteUserSchema } from "../validators/user-validator.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Rotas para gerenciamento de usuários
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: "Listar usuários"
 *     description: "Retorna a lista de todos os usuários."
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "Lista de usuários retornada com sucesso."
 *       401:
 *         description: "Usuário não autenticado."
 */
router.get('/', isAuth, getUsers);

/**
 * @swagger
 * /users/{id}:
 *   post:
 *     summary: "Atualizar usuário"
 *     description: "Atualiza as informações de um usuário específico."
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID do usuário a ser atualizado."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: "Nome completo do usuário."
 *                 example: "João da Silva"
 *               password:
 *                 type: string
 *                 description: "Senha do usuário."
 *                 example: "novaSenha123"
 *     responses:
 *       200:
 *         description: "Usuário atualizado com sucesso."
 *       400:
 *         description: "Requisição inválida."
 *       401:
 *         description: "Usuário não autenticado."
 *       404:
 *         description: "Usuário não encontrado."
 */
router.post('/:id', isAuth, validateRequest(updateUserSchema), updateUser);


/**
 * @swagger
 * /users:
 *   post:
 *     summary: "Adicionar novo usuário"
 *     description: "Cria um novo usuário no sistema."
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: "Email do usuário."
 *                 example: "user@example.com"
 *               name:
 *                 type: string
 *                 description: "Nome completo do usuário."
 *                 example: "João da Silva"
 *               password:
 *                 type: string
 *                 description: "Senha do usuário."
 *                 example: "senha123"
 *             required:
 *               - email
 *               - name
 *               - password
 *     responses:
 *       200:
 *         description: "Usuário criado com sucesso."
 *       400:
 *         description: "Requisição inválida."
 *       401:
 *         description: "Usuário não autenticado."
 */
router.post('/', validateRequest(addUserSchema), addUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: "Excluir usuário"
 *     description: "Remove um usuário específico."
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID do usuário a ser excluído."
 *     responses:
 *       200:
 *         description: "Usuário excluído com sucesso."
 *       401:
 *         description: "Usuário não autenticado."
 *       404:
 *         description: "Usuário não encontrado."
 */
router.delete('/:id', isAuth, validateRequest(deleteUserSchema), deleteUser);

export default router;
