const Task = require('../models/Task');
const Employee = require('../models/Employee');

// Create a new task
const createTask = async (req, res) => {
    try {
        console.log('Task Create Body:', req.body); // Debugging
        const { title, assignedTo, items, startTime, endTime, notes, initialPayment } = req.body;

        if (!title || !assignedTo || !items || items.length === 0 || !startTime || !endTime) {
            const missing = [];
            if (!title) missing.push('title');
            if (!assignedTo) missing.push('assignedTo');
            if (!items || items.length === 0) missing.push('items');
            if (!startTime) missing.push('startTime');
            if (!endTime) missing.push('endTime');
            
            console.log('Validation Failed. Missing:', missing);
            return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
        }

        const employee = await Employee.findById(assignedTo);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const taskData = {
            title,
            assignedTo,
            items,
            startTime,
            endTime,
            notes,
            status: 'Pending',
            history: [{ action: 'Created', details: 'Task created' }]
        };

        if (initialPayment && Number(initialPayment) > 0) {
            taskData.payments = [{ amount: Number(initialPayment), note: 'Advance Payment' }];
            taskData.history.push({ action: 'Payment', details: `Initial advance payment: ৳${initialPayment}` });
        }

        const task = await Task.create(taskData);

        const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name designation');
        res.status(201).json(populatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all tasks
const getTasks = async (req, res) => {
    try {
        const { employeeId, status } = req.query;
        let query = {};
        
        if (employeeId) query.assignedTo = employeeId;
        if (status) query.status = status;

        const tasks = await Task.find(query)
            .populate('assignedTo', 'name designation')
            .sort({ createdAt: -1 });
            
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Task by ID
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id).populate('assignedTo', 'name designation');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Task Progress & Add Payment
const updateTaskProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const { items, payment } = req.body; 

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update items and/or payment - create combined history if both happen
        let historyDetails = [];
        let historyAction = '';
        let historyEntry = { date: new Date() };

        if (items && Array.isArray(items)) {
            // Store snapshot of BEFORE and AFTER states for accurate change calculation
            const beforeSnapshot = task.items.map(item => ({
                _id: item._id,
                completed: item.completed
            }));

            // Create detailed update summary
            const changedItems = items.map((newItem, index) => {
                const oldItem = task.items[index];
                if (oldItem && oldItem.completed !== newItem.completed) {
                    return `${newItem.name}: ${oldItem.completed} → ${newItem.completed}`;
                }
                return null;
            }).filter(Boolean);

            task.items = items;
            
            if (changedItems.length > 0) {
                // Store both before and after for change calculation
                const afterSnapshot = items.map(item => ({
                    _id: item._id,
                    completed: item.completed
                }));
                
                historyDetails.push(`Updated items: ${changedItems.join(', ')}`);
                historyAction = 'Progress Updated';
                historyEntry.progressSnapshot = {
                    before: beforeSnapshot,
                    after: afterSnapshot
                };
            }
        }

        // Add Payment
        if (payment && payment.amount > 0) {
            const paymentIndex = task.payments.length; // Index where new payment will be added
            
            task.payments.push({
                amount: payment.amount,
                note: payment.note || 'Payment',
                date: new Date()
            });
            historyDetails.push(`Payment: ৳${payment.amount} (${payment.note || 'N/A'})`);
            
            // Store payment index for potential reversion
            historyEntry.paymentIndex = paymentIndex;
            
            // If both progress and payment, combine action
            if (historyAction) {
                historyAction = 'Progress & Payment';
            } else {
                historyAction = 'Payment Added';
            }
        }

        // Add single combined history entry if there are any updates
        if (historyDetails.length > 0) {
            historyEntry.action = historyAction;
            historyEntry.details = historyDetails.join(' | ');
            task.history.push(historyEntry);
        }

        await task.save();

        const updatedTask = await Task.findById(id).populate('assignedTo', 'name designation');
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Task
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndDelete(id);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update main task details (title, items, dates, employee, etc.)
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, assignedTo, items, startTime, endTime, notes } = req.body;
        
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        // Update fields
        if (title) task.title = title;
        if (assignedTo) task.assignedTo = assignedTo;
        if (items) task.items = items;
        if (startTime) task.startTime = startTime;
        if (endTime) task.endTime = endTime;
        if (notes !== undefined) task.notes = notes;
        
        // Add history entry
        task.history.push({
            action: 'Updated',
            details: 'Task details updated'
        });
        
        await task.save();
        
        const updatedTask = await Task.findById(id).populate('assignedTo', 'name designation');
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a specific history entry
const updateTaskHistory = async (req, res) => {
    try {
        const { taskId, historyId } = req.params;
        const { action, details } = req.body;
        
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        const historyEntry = task.history.id(historyId);
        if (!historyEntry) {
            return res.status(404).json({ message: 'History entry not found' });
        }
        
        historyEntry.action = action;
        historyEntry.details = details;
        
        await task.save();
        
        const updatedTask = await Task.findById(taskId).populate('assignedTo', 'name designation');
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a specific history entry and revert associated data
const deleteTaskHistory = async (req, res) => {
    try {
        const { taskId, historyId } = req.params;
        
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        const historyEntry = task.history.id(historyId);
        if (!historyEntry) {
            return res.status(404).json({ message: 'History entry not found' });
        }
        
        // Check if this log has associated data to revert
        const hasPayment = historyEntry.paymentIndex !== undefined && historyEntry.paymentIndex !== null;
        const hasProgressSnapshot = historyEntry.progressSnapshot !== undefined && historyEntry.progressSnapshot !== null;
        
        // Revert payment if this log added a payment
        if (hasPayment) {
            const paymentIndex = historyEntry.paymentIndex;
            if (paymentIndex >= 0 && paymentIndex < task.payments.length) {
                // Remove the payment at the specified index
                task.payments.splice(paymentIndex, 1);
                
                // Update payment indices in other history entries that come after this one
                task.history.forEach(log => {
                    if (log.paymentIndex !== undefined && log.paymentIndex > paymentIndex) {
                        log.paymentIndex = log.paymentIndex - 1;
                    }
                });
            }
        }
        
        
        // Revert progress if this log updated progress
        if (hasProgressSnapshot) {
            const snapshot = historyEntry.progressSnapshot;
            
            // Handle both old format (array) and new format (object with before/after)
            if (snapshot) {
                // New format with before/after
                if (snapshot.before && snapshot.after) {
                    task.items.forEach(currentItem => {
                        const beforeItem = snapshot.before.find(s => s._id.toString() === currentItem._id.toString());
                        const afterItem = snapshot.after.find(s => s._id.toString() === currentItem._id.toString());
                        
                        if (beforeItem && afterItem) {
                            // Calculate the change that this log made (after - before)
                            const changeAmount = afterItem.completed - beforeItem.completed;
                            // Subtract this change from current value
                            currentItem.completed = Math.max(0, currentItem.completed - changeAmount);
                        }
                    });
                }
                // Old format (array) - restore to snapshot state (for backward compatibility)
                else if (Array.isArray(snapshot)) {
                    task.items = snapshot.map(snapshotItem => ({
                        _id: snapshotItem._id,
                        name: snapshotItem.name,
                        quantity: snapshotItem.quantity,
                        completed: snapshotItem.completed,
                        rate: snapshotItem.rate
                    }));
                }
            }
        }
        
        // Remove the history entry using pull()
        task.history.pull(historyId);
        
        // Save the task (this will trigger pre-save hook to recalculate totals)
        await task.save();
        
        const updatedTask = await Task.findById(taskId).populate('assignedTo', 'name designation');
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTaskProgress,
    updateTask,
    deleteTask,
    updateTaskHistory,
    deleteTaskHistory
};
