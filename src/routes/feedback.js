const express = require('express');
const router = express.Router();

const Feedback = require('../models/Feedback');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');            // multer (memoryStorage)
const { uploadToFirebase } = require('../utils/firebase');  // helper upload → signed URL

// Semua endpoint butuh login
router.use(auth.verifyToken);

/**
 * @openapi
 * /api/feedbacks:
 *   post:
 *     summary: Create feedback (dengan screenshot opsional)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               category: { type: string, enum: [bug, feature, ui] }
 *               screenshot: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', upload.single('screenshot'), async (req, res, next) => {
  try {
    let screenshotUrl = '';

    if (req.file) {
      // Selalu Firebase (req.file.buffer tersedia karena memoryStorage)
      screenshotUrl = await uploadToFirebase(req.file);
    }

    const feedback = await Feedback.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category || 'bug',
      userId: req.user.userId,
      screenshotUrl
    });

    res.status(201).json(feedback);
  } catch (err) {
    next(err);
  }
});

/**
 * @openapi
 * /api/feedbacks/mine:
 *   get:
 *     summary: List feedback milik user yang login
 *     responses:
 *       200: { description: OK }
 */
router.get('/mine', async (req, res, next) => {
  try {
    const items = await Feedback.find({ userId: req.user.userId })
      .sort('-createdAt')
      .lean();
    res.json(items);
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /api/feedbacks:
 *   get:
 *     summary: Admin — list semua feedback (pagination + filter + sort)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10, minimum: 1, maximum: 100 }
 *       - in: query
 *         name: q
 *         schema: { type: string, description: "search title/description (case-insensitive)" }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [open, "in progress", resolved, in_progress] }
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [createdAt,-createdAt,status,-status,category,-category,title,-title]
 *           default: -createdAt
 *     responses:
 *       200: { description: OK }
 */
router.get('/', auth.requireAdmin, async (req, res, next) => {
  try {
    const page  = Math.max(parseInt(req.query.page, 10)  || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);

    const filter = {};

    // category
    if (req.query.category) filter.category = req.query.category;

    // status: terima 'in_progress' → simpan/filter 'in progress'
    if (req.query.status) {
      filter.status = (req.query.status === 'in_progress') ? 'in progress' : req.query.status;
    }

    // search q (escape regex)
    if (req.query.q) {
      const esc = req.query.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const rx = new RegExp(esc, 'i');
      filter.$or = [{ title: rx }, { description: rx }];
    }

    // sort whitelist
    const allowedSort = ['createdAt', '-createdAt', 'status', '-status', 'category', '-category', 'title', '-title'];
    const sort = allowedSort.includes(req.query.sort) ? req.query.sort : '-createdAt';

    const [items, total] = await Promise.all([
      Feedback.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', 'name email')
        .lean(),
      Feedback.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: items,
      meta: { page, limit, total, pages: Math.ceil(total / limit), sort }
    });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /api/feedbacks/{id}/status:
 *   patch:
 *     summary: Admin — ubah status feedback
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string, enum: [open, "in progress", resolved, in_progress] }
 *     responses:
 *       200: { description: Status updated }
 */
router.patch('/:id/status', auth.requireAdmin, async (req, res, next) => {
  try {
    let status = req.body.status;
    if (status === 'in_progress') status = 'in progress'; // normalisasi

    if (!['open', 'in progress', 'resolved'].includes(status)) {
      const e = new Error('Invalid status');
      e.status = 400; e.code = 'VALIDATION_ERROR'; e.expose = true;
      throw e;
    }

    const updated = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      const e = new Error('Feedback not found');
      e.status = 404; e.code = 'NOT_FOUND'; e.expose = true;
      throw e;
    }

    res.json({ message: 'Status updated', feedback: updated });
  } catch (err) { next(err); }
});

module.exports = router;
