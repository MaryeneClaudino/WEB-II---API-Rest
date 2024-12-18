import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

const checkPermissionTodo = async (req, res, next) => {
    const id = req.params.id

    const todoList = await prisma.todoList.findUnique({
        where: {
            id: parseInt(id),
        },
    });

    if (!todoList) {
        return res.status(404).json({ error: 'TODO não encontrado' });
    }

    let shared = [];
    if (todoList.categoryId != undefined && todoList.categoryId != null) {
        shared = await prisma.userPermission.findMany({
            where: {
                AND: [
                    {
                        categoryId: todoList.categoryId
                    },
                    {
                        userId: req.session.user.userId
                    },
                ],
            }
        });
    }

    if (todoList.userId != req.session.user.userId && shared.length == 0) {
        return res.status(403).json({ error: 'Sem permissão acessar esse TODO' });
    }

    next();
}

export { checkPermissionTodo };