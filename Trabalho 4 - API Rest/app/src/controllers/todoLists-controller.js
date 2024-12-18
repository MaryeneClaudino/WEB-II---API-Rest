import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

async function addTodoList(req, res) {
    const data = req.body;

    let todoList = null;
    try {
        todoList = await prisma.todoList.create({
            data: {
                userId: req.session.user.userId,
                description: data.description,
                title: data.title,
                dateForConclusion: data.dateForConclusion,
                categoryId: data.categoryId
            },
        });
    } catch {
        return res.status(400).json({ error: 'Requisição inválida' });
    }

    return res.status(200).json({ todoList });
}

async function getTodoListById(req, res) {
    const id = req.params.id;

    const todoList = await prisma.todoList.findUnique({
        where: {
            id: parseInt(id),
        }
    });

    return res.status(200).json({ todoList });
}

async function getTodoListPending(req, res) {
    let arr = [];

    const sharedCategoriesID = await prisma.userPermission.findMany({
        select: {
            categoryId: true,
        },
        where: {
            userId: req.session.user.userId
        }
    });

    for (let id of sharedCategoriesID) {
        arr.push(id.categoryId);
    }

    const todoLists = await prisma.todoList.findMany({
        where: {
            AND: [
                {
                    isConclusion: "NO"
                },
                {
                    OR: [
                        {
                            userId: req.session.user.userId
                        },
                        {
                            categoryId: {
                                in: arr
                            }
                        }
                    ]
                }
            ]
        }
    });

    return res.status(200).json({ todoLists });
}

async function getTodoListLate(req, res) {
    let arr = [];

    const sharedCategoriesID = await prisma.userPermission.findMany({
        select: {
            categoryId: true,
        },
        where: {
            userId: req.session.user.userId
        }
    });

    for (let id of sharedCategoriesID) {
        arr.push(id.categoryId);
    }

    const todoLists = await prisma.todoList.findMany({
        where: {
            AND: [
                {
                    isConclusion: "NO"
                },
                {
                    dateForConclusion: {
                        lt: new Date()
                    }
                },
                {
                    OR: [
                        {
                            userId: req.session.user.userId
                        },
                        {
                            categoryId: {
                                in: arr
                            }
                        }
                    ]
                }
            ]
        }
    });

    return res.status(200).json({ todoLists });
}

async function concludeTodoList(req, res) {
    const id = req.params.id;

    const todoList = await prisma.todoList.findUnique({
        where: {
            id: parseInt(id)
        },
    });

    if (!todoList) {
        return res.status(404).json({ error: 'TODO not found' });
    }

    if (todoList.isConclusion == "NO") {
        const todoListUpdate = await prisma.todoList.update({
            where: {
                id: parseInt(id),
            },
            data: {
                isConclusion: 'YES'
            }
        })

        return res.status(200).json({ res: 'TODO concluído com sucesso' });
    }

    return res.status(200).json({ res: 'TODO já concluído anteriormente' });
}

async function updateTodoList(req, res) {
    const id = req.params.id;
    const data = req.body;

    const todoList = await prisma.todoList.findUnique({
        where: {
            id: parseInt(id)
        },
    });

    if (!todoList) {
        return res.status(404).json({ error: 'TODO not found' });
    }

    let todoListUpdate = null;
    try {
        todoListUpdate = await prisma.todoList.update({
            where: {
                id: parseInt(id),
            },
            data
        })
    } catch {
        return res.status(400).json({ error: 'Requisição inválida' });
    }

    return res.status(200).json({ todoListUpdate });
}

async function deleteTodoList(req, res) {
    const id = req.params.id;

    const todoList = await prisma.todoList.findUnique({
        where: {
            id: parseInt(id)
        },
    });

    if (!todoList) {
        return res.status(404).json({ error: 'TODO not found' });
    }

    const deleteTodoLists = await prisma.todoList.deleteMany({
        where: {
            id: parseInt(id),
        },
    })

    return res.status(200).json({ res: 'TODO deletado com sucesso' });
}

export {
    getTodoListById,
    getTodoListPending,
    getTodoListLate,
    addTodoList,
    concludeTodoList,
    updateTodoList,
    deleteTodoList
};