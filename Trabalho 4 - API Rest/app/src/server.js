import express, { query } from 'express';
import { dir } from './dirroot.js';
import path from 'path';
import cors from 'cors';
import session from 'express-session';

import dotenv from 'dotenv';
const NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV === 'development') {
    console.log("Running in development mode");
    dotenv.config({ path: '.env.development' });
} else if (NODE_ENV === 'production') {
    console.log("Running in production mode");
    dotenv.config({ path: '.env.production' });
}

console.log({
    ENV: process.env.NODE_ENV,
    APP_SECRET: process.env.APP_SECRET,
    HASH_SECRET: process.env.HASH_SECRET,
})

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Todo List API",
            version: "1.0.0",
            description: "API para gerenciamento de TODOs, categorias e compartilhamentos.",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./src/routes/*.js"],
};

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use(session({
    secret: process.env.APP_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.get('/healthcheck', (req, res) => {
    res.send('OK');
});

import usersRouter from './routes/users-routes.js';
app.use('/users', usersRouter);

import categoriesRouter from './routes/categories-routes.js';
app.use('/categories', categoriesRouter);

import todoListsRouter from './routes/todoLists-routes.js';
app.use('/todoLists', todoListsRouter);

import authRouter from './routes/auth-routes.js';
app.use('/auth', authRouter);

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express'
const swaggerSpecs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.listen(3000, () => console.log("Server iniciou na porta 3000"));