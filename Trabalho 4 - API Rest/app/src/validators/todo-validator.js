import * as yup from "yup";

const addTodoListSchema = yup.object({
    body: yup.object({
        title: yup.string().required(),
        description: yup.string().required(),
        dateForConclusion: yup.date().required(),
        categoryId: yup.number().optional()
    }),
});

const updateTodoListSchema = yup.object({
    body: yup.object({
        title: yup.string().optional(),
        description: yup.string().optional(),
        dateForConclusion: yup.date().optional(),
        categoryId: yup.number().optional()
    }),
    params: yup.object({
        id: yup.number().required("id é obrigatório"),
    })
});

const idTodoListParamSchema = yup.object({
    params: yup.object({
        id: yup.number().required("id é obrigatório"),
    })
});

export {
    addTodoListSchema,
    updateTodoListSchema,
    idTodoListParamSchema,
}