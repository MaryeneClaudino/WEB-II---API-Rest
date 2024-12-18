import * as yup from "yup";

const loginSchema = yup.object({
    body: yup.object({
        email: yup.string().email().required("O email é obrigatório!"),
        password: yup.string().required(),
    }),
});

export {
    loginSchema
}