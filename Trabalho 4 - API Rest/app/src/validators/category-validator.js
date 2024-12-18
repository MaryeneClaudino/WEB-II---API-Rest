import * as yup from "yup";

const addCategorySchema = yup.object({
    body: yup.object({
        description: yup.string().required()
    }),
});

const updateCategorySchema = yup.object({
    body: yup.object({
        description: yup.string().required()
    }),
    params: yup.object({
        id: yup.number().required("id é obrigatório"),
    })
});

const idCategoryParamSchema = yup.object({
    params: yup.object({
        id: yup.number().required("id é obrigatório"),
    })
});

const shareCategorySchema = yup.object({
    body: yup.object({
        categoryId: yup.number().required(),
        email: yup.string().email().required("O email é obrigatório!"),
    }),
});

export {
    addCategorySchema,
    updateCategorySchema,
    idCategoryParamSchema,
    shareCategorySchema
}