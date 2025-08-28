const { z } = require('zod');
const { StatusEnum, PriorityEnum } = require('./feedback.validator');

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: StatusEnum.optional(),
  priority: PriorityEnum.optional(),
  q: z.string().trim().optional(),
  sort: z.string().trim().default('-createdAt'),
});

module.exports = { listQuerySchema };
