const express = require('express');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    
    const { title, amount, category } = req.body;
    try {
        const newExpense = new Expense({ user: req.user.id, title, amount, category });
        const expense = await newExpense.save();
        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id });
        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ msg: 'Expense not found' });

        // Ensure the user is authorized to delete this expense
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Expense.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Expense removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.put('/:id', async (req, res) => {
    try {
      const expenseId = req.params.id;
      const updatedExpenseData = req.body;
      
      const updatedExpense = await Expense.findByIdAndUpdate(
        expenseId,
        updatedExpenseData,
        { new: true }
      );
  
      if (!updatedExpense) {
        return res.status(404).json({ message: 'Expense not found' });
      }
  
      res.status(200).json(updatedExpense);
    } catch (err) {
      console.error('Error updating expense:', err);
      res.status(500).json({ message: 'Error updating expense' });
    }
  });
  
  // Get expense by ID
router.get('/:id', async (req, res) => {
    const expenseId = req.params.id;
  
    let result=await Expense.findById(expenseId)
    if(!result){
        return res.status(404).json({ message: 'Expense not found' });
      }
      res.status(200).json({"res":result});
  });
module.exports = router;
