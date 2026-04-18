const mongoose = require('mongoose');
const Event = require('../models/event.model');

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function parsePositiveInteger(value) {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return null;
  }

  return parsedValue;
}

function parseDateValue(value) {
  if (typeof value !== 'string' || !DATE_ONLY_REGEX.test(value)) {
    return null;
  }

  const parsedValue = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsedValue.getTime())) {
    return null;
  }

  if (parsedValue.toISOString().slice(0, 10) !== value) {
    return null;
  }

  return value;
}

function trimName(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : null;
}

function handleError(res, error) {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(error.errors).map((item) => item.message)
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  return res.status(500).json({
    message: 'Server error',
    error: error.message
  });
}

const createEvent = async (req, res) => {
  try {
    const name = trimName(req.body.name);
    const date = parseDateValue(req.body.date);
    const capacity = parsePositiveInteger(req.body.capacity);

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (!date) {
      return res.status(400).json({ message: 'Invalid event date. Use YYYY-MM-DD format' });
    }

    if (!capacity) {
      return res.status(400).json({ message: 'Capacity must be a positive integer' });
    }

    const event = await Event.create({
      name,
      date,
      capacity,
      availableSeats: capacity
    });

    return res.status(201).json(event);
  } catch (error) {
    return handleError(res, error);
  }
};

const getEvents = async (req, res) => {
  try {
    const { start, end } = req.query;
    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);

    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) {
      return res.status(400).json({ message: 'Page and limit must be positive integers' });
    }

    const filter = {};

    if (start || end) {
      filter.date = {};

      if (start) {
        const startDate = parseDateValue(start);
        if (!startDate) {
          return res.status(400).json({ message: 'Invalid start date. Use YYYY-MM-DD format' });
        }

        filter.date.$gte = startDate;
      }

      if (end) {
        const endDate = parseDateValue(end);
        if (!endDate) {
          return res.status(400).json({ message: 'Invalid end date. Use YYYY-MM-DD format' });
        }

        filter.date.$lte = endDate;
      }

      if (filter.date.$gte && filter.date.$lte && filter.date.$gte > filter.date.$lte) {
        return res.status(400).json({ message: 'Start date cannot be after end date' });
      }
    }

    const skip = (page - 1) * limit;
    const [events, total] = await Promise.all([
      Event.find(filter).sort({ date: 1, createdAt: -1 }).skip(skip).limit(limit),
      Event.countDocuments(filter)
    ]);

    return res.status(200).json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const updates = {};

    if (Object.prototype.hasOwnProperty.call(req.body, 'name')) {
      const name = trimName(req.body.name);

      if (!name) {
        return res.status(400).json({ message: 'Name must be a non-empty string' });
      }

      updates.name = name;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'date')) {
      const date = parseDateValue(req.body.date);

      if (!date) {
        return res.status(400).json({ message: 'Invalid event date. Use YYYY-MM-DD format' });
      }

      updates.date = date;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'capacity')) {
      const capacity = parsePositiveInteger(req.body.capacity);

      if (!capacity) {
        return res.status(400).json({ message: 'Capacity must be a positive integer' });
      }

      const bookedSeats = event.capacity - event.availableSeats;

      if (capacity < bookedSeats) {
        return res.status(400).json({
          message: 'Capacity cannot be less than the number of already booked seats'
        });
      }

      updates.capacity = capacity;
      updates.availableSeats = capacity - bookedSeats;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: 'Provide at least one field to update: name, date, or capacity'
      });
    }

    Object.assign(event, updates);
    await event.save();

    return res.status(200).json(event);
  } catch (error) {
    return handleError(res, error);
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    return res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent
};
