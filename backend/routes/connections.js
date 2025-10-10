const express = require('express');
const router = express.Router();
const Connection = require('../models/Connection');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// @route   POST /api/connections/request
// @desc    Send connection request
// @access  Private
router.post('/request', auth, async (req, res) => {
  try {
    const { recipientId, message } = req.body;

    if (recipientId === req.userId) {
      return res.status(400).json({ success: false, message: 'Cannot connect with yourself' });
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { requester: req.userId, recipient: recipientId },
        { requester: recipientId, recipient: req.userId }
      ]
    });

    if (existingConnection) {
      return res.status(400).json({ success: false, message: 'Connection request already exists' });
    }

    const connection = new Connection({
      requester: req.userId,
      recipient: recipientId,
      message
    });

    await connection.save();

    // Create notification
    await Notification.create({
      recipient: recipientId,
      sender: req.userId,
      type: 'connection_request',
      content: 'sent you a connection request'
    });

    res.status(201).json({ success: true, connection });
  } catch (error) {
    console.error('Send connection request error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/connections/:id/accept
// @desc    Accept connection request
// @access  Private
router.put('/:id/accept', auth, async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection request not found' });
    }

    if (connection.recipient.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    connection.status = 'accepted';
    await connection.save();

    // Add to each other's connections
    await User.findByIdAndUpdate(connection.requester, {
      $addToSet: { connections: connection.recipient }
    });

    await User.findByIdAndUpdate(connection.recipient, {
      $addToSet: { connections: connection.requester }
    });

    // Create notification
    await Notification.create({
      recipient: connection.requester,
      sender: req.userId,
      type: 'connection_accepted',
      content: 'accepted your connection request'
    });

    res.json({ success: true, connection });
  } catch (error) {
    console.error('Accept connection error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/connections/:id/reject
// @desc    Reject connection request
// @access  Private
router.put('/:id/reject', auth, async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection request not found' });
    }

    if (connection.recipient.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    connection.status = 'rejected';
    await connection.save();

    res.json({ success: true, connection });
  } catch (error) {
    console.error('Reject connection error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/connections/:userId
// @desc    Remove connection
// @access  Private
router.delete('/:userId', auth, async (req, res) => {
  try {
    // Remove from both users' connections
    await User.findByIdAndUpdate(req.userId, {
      $pull: { connections: req.params.userId }
    });

    await User.findByIdAndUpdate(req.params.userId, {
      $pull: { connections: req.userId }
    });

    // Delete connection record
    await Connection.deleteOne({
      $or: [
        { requester: req.userId, recipient: req.params.userId },
        { requester: req.params.userId, recipient: req.userId }
      ]
    });

    res.json({ success: true, message: 'Connection removed' });
  } catch (error) {
    console.error('Remove connection error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/connections/requests
// @desc    Get pending connection requests
// @access  Private
router.get('/requests', auth, async (req, res) => {
  try {
    const requests = await Connection.find({
      recipient: req.userId,
      status: 'pending'
    })
    .populate('requester', 'firstName lastName profilePicture headline currentPosition')
    .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    console.error('Get connection requests error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/connections
// @desc    Get user connections
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('connections', 'firstName lastName profilePicture headline currentPosition company location');

    res.json({ success: true, connections: user.connections });
  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
