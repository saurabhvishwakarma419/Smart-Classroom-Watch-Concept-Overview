const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  checkInTime: {
    type: Date,
    required: true
  },
  checkOutTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'excused'],
    default: 'present'
  },
  location: {
    type: String
  },
  deviceMac: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
attendanceSchema.index({ studentId: 1, checkInTime: -1 });
attendanceSchema.index({ classId: 1, checkInTime: -1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
