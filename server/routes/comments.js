const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');
const { addComment, listComments } = require('../controllers/commentController');

router.post('/', protect, addComment);
router.get('/', listComments);

module.exports = router;
