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
        sparse: true,
    },
    nid: {
        type: String,
        required: true,
    },
    fathersName: {
        type: String,
        required: true, 
    },
    mothersName: {
        type: String,
        required: true,
    },
    phones: [{
        type: String,
        required: true,
    }],
    salary: { // This is Gross Salary or Rate per Task/Hour
        type: Number,
        default: 0
    },
    basicSalary: {
        type: Number,
        default: function() { return this.salary * 0.6; } 
    },
    salaryType: {
        type: String,
        enum: ['Monthly', 'Task-wise'],
        required: true,
        default: 'Monthly'
    },
    joinDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
    note: {
        type: String,
        default: ''
    }
}, {
    timestamps: true,
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
