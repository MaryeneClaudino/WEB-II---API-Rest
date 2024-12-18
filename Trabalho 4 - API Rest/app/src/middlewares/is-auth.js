import { PrismaClient } from '@prisma/client'
import jsonwebtoken from 'jsonwebtoken';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

const isAuth = async (req, res, next) => {
    let token = "";
    if (req.session.user != undefined && req.session.user != null) {
        token = req.session.user.token;
    }

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const user = jsonwebtoken.verify(token, process.env.APP_SECRET);
        req.user = user;
    }
    catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

export { isAuth };