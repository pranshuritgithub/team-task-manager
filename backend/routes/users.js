const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET all users (admin only, for assigning tasks/projects)
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
