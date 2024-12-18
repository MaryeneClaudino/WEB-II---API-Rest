import { Router } from 'express';
import { isAuth } from '../middlewares/is-auth.js';
import { addCategory, deleteCategory, getCategory, getCategoryById, getSharedCategory, toShareCategory, updateCategory } from '../controllers/categories-controller.js';
import { checkPermissionCategory, checkPermissionShareCategory } from '../middlewares/check-permission-category.js';
import { validateRequest } from "../middlewares/validation.js";
import { addCategorySchema, idCategoryParamSchema, shareCategorySchema, updateCategorySchema } from '../validators/category-validator.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Rotas de gerenciamento de categorias
 */

/**
 * @swagger
 * /categories/shared:
 *   get:
 *     summary: "Listar categorias compartilhadas"
 *     description: "Retorna uma lista de categorias compartilhadas com o usuário autenticado."
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "Lista de categorias compartilhadas retornada com sucesso."
 *       401:
 *         description: "Usuário não autenticado."
 */
router.get('/shared', isAuth, getSharedCategory);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: "Obter uma categoria por ID"
 *     description: "Retorna os detalhes de uma categoria específica."
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID da categoria."
 *     responses:
 *       200:
 *         description: "Categoria retornada com sucesso."
 *       401:
 *         description: "Usuário não autenticado."
 *       403:
 *         description: "Usuário não possui permissão para acessar esta categoria."
 */
router.get('/:id', isAuth, validateRequest(idCategoryParamSchema), checkPermissionCategory, getCategoryById);

/**
 * @swagger
 * /categories/share:
 *   post:
 *     summary: "Compartilhar categoria"
 *     description: "Compartilha uma categoria com outro usuário."
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: integer
 *                 description: "ID da categoria a ser compartilhada."
 *                 example: 1
 *               email:
 *                 type: string
 *                 description: "Email do usuário com quem a categoria será compartilhada."
 *                 example: "exemplo@dominio.com"
 *             required:
 *               - categoryId
 *               - email
 *     responses:
 *       200:
 *         description: "Categoria compartilhada com sucesso."
 *       400:
 *         description: "Requisição inválida."
 *       401:
 *         description: "Usuário não autenticado."
 *       403:
 *         description: "Usuário não possui permissão para compartilhar esta categoria."
 *       404:
 *         description: "Usuário não encontrado."
 */
router.post('/share', isAuth, validateRequest(shareCategorySchema), checkPermissionShareCategory, toShareCategory);

/**
 * @swagger
 * /categories/{id}:
 *   post:
 *     summary: "Atualizar categoria"
 *     description: "Atualiza os dados de uma categoria específica."
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID da categoria."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: "Nova descrição da categoria."
 *                 example: "Categoria atualizada"
 *             required:
 *               - description
 *     responses:
 *       200:
 *         description: "Categoria atualizada com sucesso."
 *       400:
 *         description: "Requisição inválida."
 *       401:
 *         description: "Usuário não autenticado."
 *       403:
 *         description: "Usuário não possui permissão para alterar esta categoria."
 *       404:
 *         description: "Categoria não encontrada."
 *   delete:
 *     summary: "Excluir categoria"
 *     description: "Remove uma categoria específica."
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID da categoria."
 *     responses:
 *       200:
 *         description: "Categoria removida com sucesso."
 *       401:
 *         description: "Usuário não autenticado."
 *       403:
 *         description: "Usuário não possui permissão para excluir esta categoria."
 *       404:
 *         description: "Categoria não encontrada."
 */
router.post('/:id', isAuth, validateRequest(updateCategorySchema), checkPermissionCategory, updateCategory);
router.delete('/:id', isAuth, validateRequest(idCategoryParamSchema), checkPermissionCategory, deleteCategory);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: "Listar todas as categorias"
 *     description: "Retorna uma lista de todas as categorias disponíveis para o usuário autenticado."
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "Lista de categorias retornada com sucesso."
 *       401:
 *         description: "Usuário não autenticado."
 *   post:
 *     summary: "Adicionar nova categoria"
 *     description: "Cria uma nova categoria."
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: "Descrição da categoria."
 *                 example: "Categoria de exemplo"
 *             required:
 *               - description
 *     responses:
 *       200:
 *         description: "Categoria criada com sucesso."
 *       400:
 *         description: "Requisição inválida."
 *       401:
 *         description: "Usuário não autenticado."
 */
router.get('/', isAuth, getCategory);
router.post('/', isAuth, validateRequest(addCategorySchema), addCategory);

export default router;