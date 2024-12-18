const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export { validateRequest };