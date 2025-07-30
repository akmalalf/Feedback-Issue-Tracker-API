const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const bucket = require('../config/firebase');

router.use(auth.verifyToken);

// ✅ POST: Submit feedback + upload screenshot
router.post('/', auth.verifyToken, upload.single('screenshot'), async (req, res) => {
  try {
    let screenshotUrl = '';

    if (req.file) {
      const fileName = `screenshots/${Date.now()}-${req.file.originalname}`;
      const file = bucket.file(fileName);

      await new Promise((resolve, reject) => {
        const stream = file.createWriteStream({
          metadata: {
            contentType: req.file.mimetype,
          }
        });

        stream.on('error', reject);
        stream.on('finish', resolve);
        stream.end(req.file.buffer);
      });

      await file.makePublic();
      screenshotUrl = file.publicUrl();
      console.log('[DEBUG] Upload Success:', screenshotUrl);
    }

    const feedback = new Feedback({
      ...req.body,
      userId: req.user.userId, // Pastikan middleware auth berjalan
      screenshotUrl
    });

    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload screenshot or save feedback' });
  }
});


// ✅ GET: Lihat feedback sendiri
router.get('/mine', async (req, res) => {
  const feedbacks = await Feedback.find({ userId: req.user.userId });
  res.json(feedbacks);
});

// ✅ GET: Admin lihat semua
router.get('/', auth.requireAdmin, async (req, res) => {
  const feedbacks = await Feedback.find().populate('userId', 'name email');
  res.json(feedbacks);
});

// ✅ PATCH: Admin ubah status
router.patch('/:id/status', auth.requireAdmin, async (req, res) => {
  const feedback = await Feedback.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(feedback);
});

module.exports = router;
