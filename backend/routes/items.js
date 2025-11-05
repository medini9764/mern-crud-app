const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Item = require('../models/Item');

// Get all items for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create item
router.post('/', auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    const newItem = new Item({
      title,
      description,
      userId: req.user.id
    });

    const item = await newItem.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update item
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    item = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description } },
      { new: true }
    );

    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;