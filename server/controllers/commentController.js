const Comment = require('../models/Comment');
const Issue = require('../models/Issue');

exports.addComment = async (req, res) => {
  const { text } = req.body;
  try {
    const issue = await Issue.findById(req.params.issueId);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    const comment = await Comment.create({ text, author: req.user._id, issue: issue._id, isOfficialUpdate: req.user.role === 'Admin' });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listComments = async (req, res) => {
  try {
    const comments = await Comment.find({ issue: req.params.issueId }).populate('author', 'username role').sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
