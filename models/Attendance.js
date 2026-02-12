const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Leave'],
        default: 'Present',
    },
    inTime: {
        type: String, // e.g., "08:00"
    },
    outTime: {
        type: String, // e.g., "20:00"
    },
    overtimeHours: {
        type: Number,
        default: 0,
    },
    overtimeRate: {
        type: Number,
        default: 0, 
    },
    hourlyRate: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
