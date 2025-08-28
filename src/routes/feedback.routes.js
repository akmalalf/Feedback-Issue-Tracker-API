const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');      
const ctrl = require('../controllers/feedback.controller');

router.post('/', auth.verifyToken, upload.single('screenshot'), ctrl.create);
router.get('/', auth.verifyToken, ctrl.list);
router.get('/:id', auth.verifyToken, ctrl.detail);
router.patch('/:id', auth.verifyToken, ctrl.update);
router.patch('/:id/status', auth.verifyToken, ctrl.updateStatus);

module.exports = router;
