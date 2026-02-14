const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
    },
    description: {
        type: String,
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer'
    },
    buyerDetails: {
        name: String,
        companyName: String,
        address: String,
        phones: [String]
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    externalProfile: {
        type: mongoose.Schema.Types.ObjectId, // Link to ExternalProfile if applicable
        ref: 'ExternalProfile'
    },
    expenseType: {
        type: String,
        enum: ['General', 'Employee', 'External'],
        default: 'General'
    },
    details: {
        purpose: String,
        // For External Profile
        recipientName: String,
        recipientPhone: String,
        recipientAddress: String,
        
        isLoan: {
            type: Boolean,
            default: false
        },
        isLoanReturn: {
            type: Boolean,
            default: false
        },
        loanAmount: {
            type: Number,
            default: 0
        },
        repaymentStatus: {
            type: String,
            enum: ['Pending', 'Paid', 'Partial'],
            default: 'Pending'
        }
    },
    items: [{
        description: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        },
        hasQuantity: {
            type: Boolean,
            default: true,
        },
        unitPrice: {
            type: Number,
            required: true,
        },
        discountType: {
            type: String,
            enum: ['fixed', 'percentage'],
            default: 'fixed',
        },
        discountValue: {
            type: Number,
            default: 0,
        }
    }],
    discountType: {
        type: String,
        enum: ['fixed', 'percentage'],
        default: 'fixed',
    },
    discountValue: {
        type: Number,
        default: 0,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    reference: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
});

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
