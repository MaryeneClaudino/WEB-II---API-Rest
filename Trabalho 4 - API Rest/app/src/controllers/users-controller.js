import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "maryene.ifrs@gmail.com",
        pass: "ifet vknt gjug jnhl",
    }
});

const sendVerificationEmail = async (email, name) => {
    console.log(`Bem-vindo, ${name}!`);
    console.log(`Email enviado para ${email}`);

    const verification_token = encodeURIComponent(Buffer.from(JSON.stringify({ "email": email })).toString('base64'));
    const verification_url = "http://localhost:3000/auth/verify/" + verification_token;

    let textMessage = '<b>Olá, ' + name + '</b>' +
        '<p>Seu cadastro no Trabalho 3 - WEB II - API Rest está quase pronto!</p>' +
        '<p>Clique <a href="' + verification_url + '">aqui</a> para confirmar seu endereço de email e habilitar seu acesso.</p>';

    const info = await transporter.sendMail({
        from: 'API`s Rest WEB II <maryene.ifrs@gmail.com>', // sender address
        to: email,
        subject: "Confirmação de Cadastro",
        html: textMessage
    });

    console.log("Message sent: %s", info.messageId);
}


const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function getUsers(req, res) {
    const users = await prisma.user.findMany({
    });

    return res.status(200).json({ users });
}

async function addUser(req, res) {
    const dataUser = req.body;

    dataUser.password = bcrypt.hashSync(process.env.HASH_SECRET + dataUser.password, 10);

    const userUnique = await prisma.user.findUnique({
        where: {
            email: dataUser.email,
        },
    });
    if (userUnique) {
        return res.status(400).json({ error: 'Email já cadastrado' });
    }

    let user = null;
    try {
        user = await prisma.user.create({
            data: {
                name: dataUser.name,
                email: dataUser.email,
                password: dataUser.password,
            },
        });
    } catch {
        return res.status(400).json({ error: 'Requisição inválida' });
    }


    await sendVerificationEmail(user.email, user.name);

    return res.status(200).json({ user });
}

async function updateUser(req, res) {
    const id = req.params.id;
    const data = req.body;

    if (req.body.password != undefined && req.body.password != null) {
        req.body.password = bcrypt.hashSync(process.env.HASH_SECRET + req.body.password, 10);
    }

    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(id),
        },
    });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    let userUpdate = null;
    try {
        userUpdate = await prisma.user.update({
            where: {
                id: parseInt(id),
            },
            data: {
                name: data.name,
                password: data.password
            }
        })
    } catch {
        return res.status(400).json({ error: 'Requisição inválida' });
    }

    return res.status(200).json({ userUpdate });
}

async function deleteUser(req, res) {
    const id = req.params.id;

    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(id),
        },
    });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const deletePermissions = await prisma.userPermission.deleteMany({
        where: {
            userId: parseInt(id),
        },
    })

    const deleteCategories = await prisma.category.deleteMany({
        where: {
            userId: parseInt(id),
        },
    })

    const deleteUser = await prisma.user.delete({
        where: {
            id: parseInt(id),
        },
    })

    return res.status(200).json({ res: 'Usuário deletado com sucesso' });
}

export {
    getUsers,
    addUser,
    updateUser,
    deleteUser
};