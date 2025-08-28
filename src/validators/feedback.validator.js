const { z } = require('zod');
const StatusEnum = z.enum(['open', 'in_progress', 'resolved']);
const PriorityEnum = z.enum(['low', 'medium', 'high']);

const createFeedbackSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  priority: PriorityEnum.optional(),
});

const updateFeedbackSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(5).optional(),
  priority: PriorityEnum.optional(),
}).refine(obj => Object.keys(obj).length > 0, { message: 'At least one field required' });

const updateStatusSchema = z.object({ status: StatusEnum });

const idParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid Mongo ObjectId'),
});

module.exports = {
  StatusEnum, PriorityEnum,
  createFeedbackSchema, updateFeedbackSchema, updateStatusSchema, idParamSchema
};
