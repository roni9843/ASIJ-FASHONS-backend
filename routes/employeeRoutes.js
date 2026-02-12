const express = require('express');
const router = express.Router();
const { getEmployees, addEmployee, updateEmployee, deleteEmployee, markAttendance, getAttendance, calculatePayroll } = require('../controllers/employeeController');

router.get('/', getEmployees);
router.post('/', addEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

// Attendance & Payroll
router.post('/attendance', markAttendance);
router.get('/:employeeId/attendance', getAttendance);
router.post('/payroll', calculatePayroll);

module.exports = router;
