import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

async function getCategory(req, res) {

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const categories = await prisma.category.findMany({

        include: {
            _count: {
                select: { todoLists: true },
            },
            todoLists: {
                skip: (page - 1) * limit,
                take: +limit,
                orderBy: {
                    createdAt: 'desc',
                },
            }
        },
        where: {
            userId: req.session.user.userId,
        }
    });

    return res.status(200).json({ categories });
}

async function getCategoryById(req, res) {
    const id = req.params.id;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const category = await prisma.category.findUnique({
        include: {
            _count: {
                select: { todoLists: true },
            },
            todoLists: {
                skip: (page - 1) * limit,
                take: +limit,
                orderBy: {
                    createdAt: 'desc',
                },
            }
        },
        where: {
            id: parseInt(id),
        }
    });

    return res.status(200).json({ category });
}

async function getSharedCategory(req, res) {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const categories = await prisma.userPermission.findMany({
        include: {
            category: {
                include: {
                    _count: {
                        select: { todoLists: true },
                    },
                    todoLists: {
                        skip: (page - 1) * limit,
                        take: +limit,
                        orderBy: {
                            createdAt: 'desc',
                        },
                    }
                }
            }
        },
        where: {
            userId: req.session.user.userId,
        },
    });

    return res.status(200).json({ categories });
}

async function toShareCategory(req, res) {
    const data = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email: data.email
        },
    });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    let shered = null;
    try {
        shered = await prisma.userPermission.create({
            data: {
                categoryId: data.categoryId,
                userId: user.id
            }
        });
    } catch {
        return res.status(400).json({ error: 'Requisição inválida' });
    }

    return res.status(200).json({ shered });
}

async function addCategory(req, res) {
    const data = req.body;

    let category = null;
    try {
        category = await prisma.category.create({
            data: {
                userId: req.session.user.userId,
                description: data.description,
            },
        });
    } catch {
        return res.status(400).json({ error: 'Requisição inválida' });
    }

    return res.status(200).json({ category });
}

async function updateCategory(req, res) {
    const id = req.params.id;
    const data = req.body;

    const category = await prisma.category.findUnique({
        where: {
            id: parseInt(id)
        },
    });

    if (!category) {
        return res.status(404).json({ error: 'Category not found' });
    }

    let categoryUpdate = null;
    try {
        categoryUpdate = await prisma.category.update({
            where: {
                id: parseInt(id),
            },
            data
        })
    } catch {
        return res.status(400).json({ error: 'Requisição inválida' });
    }

    return res.status(200).json({ categoryUpdate });
}

async function deleteCategory(req, res) {
    const id = req.params.id;

    const category = await prisma.category.findUnique({
        where: {
            id: parseInt(id)
        },
    });

    if (!category) {
        return res.status(404).json({ error: 'Category not found' });
    }

    const deleteTodoLists = await prisma.todoList.deleteMany({
        where: {
            categoryId: parseInt(id),
        },
    })

    const deleteCategories = await prisma.category.deleteMany({
        where: {
            id: parseInt(id),
        },
    })

    return res.status(200).json({ res: 'Categoria deletada com sucesso' });
}

export {
    getCategory,
    getCategoryById,
    getSharedCategory,
    toShareCategory,
    addCategory,
    updateCategory,
    deleteCategory
};