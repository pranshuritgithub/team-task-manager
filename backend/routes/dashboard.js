const router = require('express').Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const now = new Date();

    if (req.user.role === 'admin') {
      const [totalProjects, totalTasks, totalUsers, tasks] = await Promise.all([
        Project.countDocuments(),
        Task.countDocuments(),
        User.countDocuments(),
        Task.find().populate('assignedTo', 'name').populate('project', 'name')
      ]);

      const todo = tasks.filter(t => t.status === 'todo').length;
      const inProgress = tasks.filter(t => t.status === 'in-progress').length;
      const done = tasks.filter(t => t.status === 'done').length;
      const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done').length;
      const recentTasks = tasks.slice(0, 5);

      res.json({ totalProjects, totalTasks, totalUsers, todo, inProgress, done, overdue, recentTasks });
    } else {
      const tasks = await Task.find({
        $or: [{ assignedTo: req.user._id }, { createdBy: req.user._id }]
      }).populate('project', 'name');

      const todo = tasks.filter(t => t.status === 'todo').length;
      const inProgress = tasks.filter(t => t.status === 'in-progress').length;
      const done = tasks.filter(t => t.status === 'done').length;
      const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done').length;
      const recentTasks = tasks.slice(0, 5);

      res.json({ totalTasks: tasks.length, todo, inProgress, done, overdue, recentTasks });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
