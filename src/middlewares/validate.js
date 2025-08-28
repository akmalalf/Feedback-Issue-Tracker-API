const { ZodError } = require('zod');

const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    const parsed = schema.parse(req[source]);
    req[source] = parsed; // gunakan data ter-parsed
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const e = new Error('Validation error');
      e.status = 400; e.code = 'VALIDATION_ERROR'; e.expose = true;
      e.details = err.issues.map(i => ({ path: i.path.join('.'), message: i.message }));
      return next(e);
    }
    next(err);
  }
};

module.exports = { validate };
