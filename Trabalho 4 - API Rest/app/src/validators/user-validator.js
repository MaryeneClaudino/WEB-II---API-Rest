import * as yup from "yup";

const addUserSchema = yup.object({
    body: yup.object({
        email: yup.string().email().required("O email é obrigatório!"),
        name: yup.string().min(6, "nome deve ser completo").required(),
        password: yup.string().required(),
    }),
});

const updateUserSchema = yup.object({
    body: yup.object({
        name: yup.string().min(6, "nome deve ser completo").optional(),
        password: yup.string().optional(),
    }),
    params: yup.object({
        id: yup.number().required("id é obrigatório"),
    })
});

const deleteUserSchema = yup.object({
    params: yup.object({
        id: yup.number().required("id é obrigatório"),
    })
});

export {
    addUserSchema,
    updateUserSchema,
    deleteUserSchema
}