const mongoose = require('mongoose');

const taskItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    completed: {
        type: Number,
        default: 0,
        min: 0
    },
    rate: {
        type: Number,
        required: true,
        min: 0
    }
});

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    items: [taskItemSchema],
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    notes: {
        type: String,
        default: ''
    },
    totalEarnings: {
        type: Number,
        default: 0
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    payments: [{
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        note: { type: String }
    }],
    history: [{
        date: { type: Date, default: Date.now },
        action: { type: String }, // e.g., 'Created', 'Updated Progress', 'Payment Added'
        details: { type: String },
        paymentIndex: { type: Number }, // Index of payment in payments array (for reverting payment logs)
        progressSnapshot: { type: mongoose.Schema.Types.Mixed } // Previous state of items (for reverting progress logs)
    }]
}, {
    timestamps: true
});

// Calculate total earnings before saving
taskSchema.pre('save', async function() {
    if (this.items && this.items.length > 0) {
        this.totalEarnings = this.items.reduce((acc, item) => {
            return acc + (item.completed * item.rate);
        }, 0);
    }
    
    if (this.payments && this.payments.length > 0) {
        this.paidAmount = this.payments.reduce((acc, payment) => acc + payment.amount, 0);
    } else {
        this.paidAmount = 0;
    }
    
    // Auto-update status based on completion
    if (this.items && this.items.length > 0) {
        const totalTarget = this.items.reduce((acc, item) => acc + item.quantity, 0);
        const totalCompleted = this.items.reduce((acc, item) => acc + item.completed, 0);
        
        if (totalCompleted === 0) {
            this.status = 'Pending';
        } else if (totalCompleted >= totalTarget) {
            this.status = 'Completed';
        } else {
            this.status = 'In Progress';
        }
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
