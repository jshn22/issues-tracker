const Issue = require('../models/Issue');
const Comment = require('../models/Comment');

exports.createIssue = async (req, res) => {
  const { title, description, category, address, imageUrl, coordinates } = req.body;
  try {
    const payload = {
      title,
      description,
      category,
      address,
      imageUrl,
      reportedBy: req.user._id
    };

    // Accept optional coordinates array [longitude, latitude]
    if (Array.isArray(coordinates) && coordinates.length === 2) {
      const lon = Number(coordinates[0]);
      const lat = Number(coordinates[1]);
      if (Number.isFinite(lon) && Number.isFinite(lat)) {
        payload.location = { type: 'Point', coordinates: [lon, lat] };
      }
    }

    const issue = await Issue.create(payload);
    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listIssues = async (req, res) => {
  const filter = {};
  const { status, category } = req.query;
  if (status) filter.status = status;
  if (category) filter.category = category;
  try {
    const issues = await Issue.find(filter).populate('reportedBy', 'username email').sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.issueId).populate('reportedBy', 'username email');
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    const comments = await Comment.find({ issue: issue._id }).populate('author', 'username role');
    res.json({ ...issue.toObject(), comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const issue = await Issue.findById(req.params.issueId);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    issue.status = status;
    issue.updatedAt = Date.now();
    await issue.save();
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleUpvote = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.issueId);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    const userId = req.user._id;
    const idx = issue.upvotes.findIndex(u => u.toString() === userId.toString());
    if (idx === -1) {
      issue.upvotes.push(userId);
    } else {
      issue.upvotes.splice(idx, 1);
    }
    issue.upvoteCount = issue.upvotes.length;
    await issue.save();
    res.json({ upvoteCount: issue.upvoteCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.issueId);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    // Allow admin or owner
    if (req.user.role !== 'Admin' && issue.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await Comment.deleteMany({ issue: issue._id });
    await Issue.findByIdAndDelete(req.params.issueId);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
