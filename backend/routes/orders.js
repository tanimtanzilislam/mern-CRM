const express = require('express');
const Order = require('../models/Order');
const { requireAuth, requireRoles } = require('../middleware/auth');

const router = express.Router();
const orderManagers = ['admin', 'sales_manager'];

router.get('/', requireAuth, requireRoles(...orderManagers), async (req, res) => {
  try {
    res.json(await Order.find().populate('customer', 'name email').populate('product', 'name sku').sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', requireAuth, requireRoles(...orderManagers), async (req, res) => {
  try {
    res.status(201).json(await Order.create(req.body));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:id', requireAuth, requireRoles(...orderManagers), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', requireAuth, requireRoles('admin'), async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
