import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

const checkPermissionCategory = async (req, res, next) => {
    const id = req.params.id

    const category = await prisma.category.findUnique({
        where: {
            id: parseInt(id)
        },
    });

    if (!category) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    const shared = await prisma.userPermission.findMany({
        where: {
            AND: [
                {
                    categoryId: parseInt(id)
                },
                {
                    userId: req.session.user.userId
                },
            ],
        }
    });

    if (category.userId != req.session.user.userId && shared.length == 0) {
        return res.status(403).json({ error: 'Sem permissão acessar essa categoria' });
    }

    next();
}

const checkPermissionShareCategory = async (req, res, next) => {
    const data = req.body;

    const category = await prisma.category.findUnique({
        where: {
            id: data.categoryId
        }
    });

    if (!category) {
        return res.status(400).json({ error: 'Categoria não encontrada' });
    }

    if (category.userId != req.session.user.userId) {
        return res.status(400).json({ error: 'Sem permissão para compartilhar essa categoria' });
    }

    next();
}

export {
    checkPermissionCategory,
    checkPermissionShareCategory
};