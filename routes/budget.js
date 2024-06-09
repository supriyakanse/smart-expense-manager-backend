const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Budget = require('../models/Budget');

// @route   POST api/budgets
// @desc    Set a new budget
// @access  Private
router.post('/', auth, async (req, res) => {
  const { category, amount } = req.body;

  try {
    const newBudget = new Budget({
      user: req.user.id,
      category,
      amount
    });

    const budget = await newBudget.save();
    res.json(budget);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/budgets
// @desc    Get all budgets for the user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(budgets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
