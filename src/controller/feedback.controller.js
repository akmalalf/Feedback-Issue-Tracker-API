const Feedback = require('../models/Feedback');

// helper: hindari regex injection
const escapeRegex = (str = '') => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.list = async (req, res, next) => {
  try {
    // 1) Coerce & default
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);

    // 2) Filter
    const filter = {};

    // status: terima 'in_progress' → map ke 'in progress', sesuai modelmu
    if (req.query.status) {
      const s = req.query.status === 'in_progress' ? 'in progress' : req.query.status;
      filter.status = s;
    }

    // category (dokumen kamu pakai category, bukan priority)
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // search q pada title/description (case-insensitive + escaped)
    if (req.query.q) {
      const rx = new RegExp(escapeRegex(req.query.q), 'i');
      filter.$or = [{ title: rx }, { description: rx }];
    }

    // 3) Sort aman (whitelist)
    const allowedSort = ['createdAt', '-createdAt', 'status', '-status', 'category', '-category', 'title', '-title'];
    const sort = allowedSort.includes(req.query.sort) ? req.query.sort : '-createdAt';

    // 4) Query + count (lean = respons lebih ringan)
    const [items, total] = await Promise.all([
      Feedback.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
      Feedback.countDocuments(filter),
    ]);

    // 5) Response meta rapi
    res.json({
      success: true,
      data: items,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        sort,
        filter: {
          ...(filter.status ? { status: filter.status } : {}),
          ...(filter.category ? { category: filter.category } : {}),
          ...(req.query.q ? { q: req.query.q } : {}),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
