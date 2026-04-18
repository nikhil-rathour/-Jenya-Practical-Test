const express = require('express');
const auth = require('../middleware/auth.middleware');
const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent
} = require('../controllers/event.controller');

const router = express.Router();

router.get('/', getEvents);
router.post('/', auth, createEvent);
router.put('/:id', auth, updateEvent);
router.delete('/:id', auth, deleteEvent);

module.exports = router;
