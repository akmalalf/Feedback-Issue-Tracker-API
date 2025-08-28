const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(), // <-- selalu memory
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      const err = new Error('Invalid file type');
      err.status = 400; err.code = 'INVALID_FILE'; err.expose = true;
      return cb(err);
    }
    cb(null, true);
  },
});

module.exports = upload;
