import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

async function login(req, res) {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    if (user.emailHasVerified == "NO") {
        return res.status(401).json({ error: 'Email não verificado, confira seu email e tente novamente!' });
    }

    const isValid = bcrypt.compareSync(process.env.HASH_SECRET + password, user.password);
    if (!isValid) {
        return res.status(401).json({ error: 'invalid credentials' });
    }

    const jwt = jsonwebtoken.sign(user, process.env.APP_SECRET, { expiresIn: '1d' });

    const userSession = {
        userId: user.id,
        email: user.email,
        token: jwt
    };

    req.session.user = userSession

    return res.status(200).json({ res: 'Login realizado com sucesso' });
}

function logout(req, res) {
    req.session.destroy();
    res.status(200).json({ res: 'Sessão encerrada com sucesso' });
}

async function verifyToken(req, res) {
    var tokenObj = JSON.parse(Buffer.from(decodeURIComponent(req.params.token), 'base64').toString('ascii'));

    const user = await prisma.user.findUnique({
        where: {
            email: tokenObj.email,
        },
    });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    if (user.emailHasVerified == "NO") {
        const validEmail = await prisma.user.update({
            where: {
                email: tokenObj.email,
            },
            data: {
                emailHasVerified: 'YES'
            }
        });

        return res.status(200).json({ res: 'Email verificado com sucesso' });
    }

    return res.status(400).json({ error: 'Email já verificado anteriormente.' });
}

export {
    login,
    logout,
    verifyToken
};