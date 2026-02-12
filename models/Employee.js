const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    salary: { // This is Gross Salary
        type: Number,
        required: true,
    },
    basicSalary: {
        type: Number,
        default: function() { return this.salary * 0.6; } // Basic is approx 60% of Gross in BD
    },
    joinDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    }
}, {
    timestamps: true,
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
