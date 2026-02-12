const express = require('express');
const router = express.Router();
const { getEmployees, getEmployeeById, addEmployee, updateEmployee, deleteEmployee, markAttendance, getAttendance, calculatePayroll } = require('../controllers/employeeController');

router.get('/', getEmployees);
router.post('/', addEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

// Attendance & Payroll
router.post('/attendance', markAttendance);
router.get('/:employeeId/attendance', getAttendance);
router.post('/payroll', calculatePayroll);

// Get Single Employee (Place at bottom to avoid conflict with specific paths if any, though :id usually safe if specific paths are above)
router.get('/:id', getEmployeeById);

module.exports = router;
