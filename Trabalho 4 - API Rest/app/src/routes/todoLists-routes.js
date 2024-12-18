import { Router } from 'express';
import { isAuth } from '../middlewares/is-auth.js';
import { addTodoList, deleteTodoList, updateTodoList, getTodoListById, concludeTodoList, getTodoListPending, getTodoListLate } from '../controllers/todoLists-controller.js';
import { checkPermissionTodo } from '../middlewares/check-permission-todo.js';
import { validateRequest } from "../middlewares/validation.js";
import { addTodoListSchema, idTodoListParamSchema, updateTodoListSchema } from '../validators/todo-validator.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: TodoLists
 *   description: Rotas para gerenciar listas de tarefas
 */

/**
 * @swagger
 * /todoLists/late:
 *   get:
 *     summary: "Listar tarefas atrasadas"
 *     description: "Retorna uma lista de tarefas que estão atrasadas."
 *     tags: [TodoLists]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "Lista de tarefas atrasadas retornada com sucesso."
 *       401:
 *         description: "Usuário não autenticado."
 */
router.get('/late', isAuth, getTodoListLate);

/**
 * @swagger
 * /todoLists/pending:
 *   get:
 *     summary: "Listar tarefas pendentes"
 *     description: "Retorna uma lista de tarefas que ainda estão pendentes."
 *     tags: [TodoLists]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "Lista de tarefas pendentes retornada com sucesso."
 *       401:
 *         description: "Usuário não autenticado."
 */
router.get('/pending', isAuth, getTodoListPending);

/**
 * @swagger
 * /todoLists/{id}:
 *   get:
 *     summary: "Obter tarefa por ID"
 *     description: "Retorna os detalhes de uma tarefa específica."
 *     tags: [TodoLists]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID da tarefa."
 *     responses:
 *       200:
 *         description: "Tarefa retornada com sucesso."
 *       401:
 *         description: "Usuário não autenticado."
 *       403:
 *         description: "Usuário não possui permissão para acessar esta tarefa."
 *       404:
 *         description: "Tarefa não encontrada."
 */
router.get('/:id', isAuth, validateRequest(idTodoListParamSchema), checkPermissionTodo, getTodoListById);

/**
 * @swagger
 * /todoLists/conclude/{id}:
 *   post:
 *     summary: "Concluir tarefa"
 *     description: "Marca uma tarefa como concluída."
 *     tags: [TodoLists]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID da tarefa a ser concluída."
 *     responses:
 *       200:
 *         description: "Tarefa concluída com sucesso."
 *       401:
 *         description: "Usuário não autenticado."
 *       403:
 *         description: "Usuário não possui permissão para concluir esta tarefa."
 *       404:
 *         description: "Tarefa não encontrada."
 */
router.post('/conclude/:id', isAuth, validateRequest(idTodoListParamSchema), checkPermissionTodo, concludeTodoList);

/**
 * @swagger
 * /todoLists/{id}:
 *   post:
 *     summary: "Atualizar tarefa"
 *     description: "Atualiza os dados de uma tarefa específica."
 *     tags: [TodoLists]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID da tarefa a ser atualizada."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: "Título da tarefa."
 *                 example: "Tarefa atualizada"
 *               description:
 *                 type: string
 *                 description: "Descrição da tarefa."
 *                 example: "Descrição atualizada"
 *               dateForConclusion:
 *                 type: string
 *                 format: date
 *                 description: "Data para conclusão da tarefa."
 *                 example: "2024-12-31"
 *               categoryId:
 *                 type: integer
 *                 description: "ID da categoria associada à tarefa."
 *                 example: 1
 *     responses:
 *       200:
 *         description: "Tarefa atualizada com sucesso."
 *       400:
 *         description: "Requisição inválida."
 *       401:
 *         description: "Usuário não autenticado."
 *       403:
 *         description: "Usuário não possui permissão para atualizar esta tarefa."
 *       404:
 *         description: "Tarefa não encontrada."
 *   delete:
 *     summary: "Excluir tarefa"
 *     description: "Remove uma tarefa específica."
 *     tags: [TodoLists]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID da tarefa."
 *     responses:
 *       200:
 *         description: "Tarefa removida com sucesso."
 *       401:
 *         description: "Usuário não autenticado."
 *       403:
 *         description: "Usuário não possui permissão para excluir esta tarefa."
 *       404:
 *         description: "Tarefa não encontrada."
 */
router.post('/:id', isAuth, validateRequest(updateTodoListSchema), checkPermissionTodo, updateTodoList);
router.delete('/:id', isAuth, validateRequest(idTodoListParamSchema), checkPermissionTodo, deleteTodoList);

/**
 * @swagger
 * /todoLists:
 *   post:
 *     summary: "Adicionar nova tarefa"
 *     description: "Cria uma nova tarefa."
 *     tags: [TodoLists]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: "Título da tarefa."
 *                 example: "Nova Tarefa"
 *               description:
 *                 type: string
 *                 description: "Descrição da tarefa."
 *                 example: "Descrição da nova tarefa"
 *               dateForConclusion:
 *                 type: string
 *                 format: date
 *                 description: "Data para conclusão da tarefa."
 *                 example: "2024-12-31"
 *               categoryId:
 *                 type: integer
 *                 description: "ID da categoria associada à tarefa."
 *                 example: 1
 *             required:
 *               - title
 *               - description
 *               - dateForConclusion
 *     responses:
 *       200:
 *         description: "Tarefa criada com sucesso."
 *       400:
 *         description: "Requisição inválida."
 *       401:
 *         description: "Usuário não autenticado."
 */
router.post('/', isAuth, validateRequest(addTodoListSchema), addTodoList);

export default router;
