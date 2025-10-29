const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  createIssue,
  listIssues,
  getIssue,
  updateStatus,
  toggleUpvote,
  deleteIssue
} = require('../controllers/issueController');

router.post('/', protect, createIssue);
router.get('/', listIssues);
router.get('/:issueId', getIssue);
router.patch('/:issueId/status', protect, adminOnly, updateStatus);
router.post('/:issueId/upvote', protect, toggleUpvote);
router.delete('/:issueId', protect, deleteIssue);

module.exports = router;
