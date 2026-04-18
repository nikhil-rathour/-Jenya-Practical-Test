const mongoose = require('mongoose');
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidDateOnly(value) {
  if (!DATE_ONLY_REGEX.test(value)) {
    return false;
  }

  const parsedValue = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsedValue.getTime()) && parsedValue.toISOString().slice(0, 10) === value;
}

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true
  },
  date: {
    type: String,
    required: [true, 'Event date is required'],
    validate: {
      validator(value) {
        return isValidDateOnly(value);
      },
      message: 'Event date must be in YYYY-MM-DD format'
    }
  },
  capacity: {
    type: Number,
    required: [true, 'Event capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    validate: {
      validator: Number.isInteger,
      message: 'Capacity must be an integer'
    }
  },
  availableSeats: {
    type: Number,
    min: [0, 'Available seats cannot be negative'],
    default() {
      return this.capacity;
    },
    validate: {
      validator(value) {
        return value <= this.capacity;
      },
      message: 'Available seats cannot exceed capacity'
    }
  }
}, {
  timestamps: true
});

eventSchema.index({ date: 1 });

module.exports = mongoose.model('Event', eventSchema);
