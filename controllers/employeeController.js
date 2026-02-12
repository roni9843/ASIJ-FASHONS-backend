const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');

const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addEmployee = async (req, res) => {
    try {
        if (!req.body.email) delete req.body.email; // Allow empty email to be sparse
        const { phones, nid, fathersName, mothersName, name, salaryType, salary } = req.body;
        
        // Basic Validation
        if (!phones || phones.length === 0 || !phones[0]) {
            return res.status(400).json({ message: 'At least one phone number is required' });
        }
        if (!nid) return res.status(400).json({ message: 'NID is required' });
        if (!fathersName) return res.status(400).json({ message: 'Father\'s Name is required' });
        if (!mothersName) return res.status(400).json({ message: 'Mother\'s Name is required' });
        if (!name) return res.status(400).json({ message: 'Name is required' });
        if (!salaryType) return res.status(400).json({ message: 'Salary Type is required' });
        if (salaryType === 'Monthly' && !salary) return res.status(400).json({ message: 'Salary amount is required for Monthly employees' });

        const employee = await Employee.create(req.body);
        res.status(201).json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        await Employee.findByIdAndDelete(id);
        // Optionally delete attendance records for this employee
        await Attendance.deleteMany({ employeeId: id });
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

    const markAttendance = async (req, res) => {
    try {
        const { employeeId, date, status, inTime, outTime, overtimeHours, overtimeRate, hourlyRate } = req.body;
        
        // ... (Existing duplicate check) ...
        const existing = await Attendance.findOne({ 
            employeeId, 
            date: { 
                $gte: new Date(new Date(date).setHours(0,0,0)), 
                $lt: new Date(new Date(date).setHours(23,59,59)) 
            } 
        });
        
        if (existing) {
             const updated = await Attendance.findByIdAndUpdate(existing._id, req.body, { new: true });
             return res.status(200).json(updated);
        }

        const attendance = await Attendance.create(req.body);
        res.status(201).json(attendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAttendance = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const logs = await Attendance.find({ employeeId }).sort({ date: -1 });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const calculatePayroll = async (req, res) => {
    try {
        const { employeeId, month, year } = req.body; // month is 0-indexed or 1-indexed? Let's assume 1-12
        
        const employee = await Employee.findById(employeeId);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const attendanceLogs = await Attendance.find({
            employeeId,
            date: { $gte: startDate, $lte: endDate }
        });

        const presentDays = attendanceLogs.filter(l => l.status === 'Present').length;
        const totalOTHours = attendanceLogs.reduce((acc, curr) => acc + (curr.overtimeHours || 0), 0);

        // Payroll Calculation Logic
        let basicSalary = 0;
        let otAmount = 0;
        let totalSalary = 0;
        let hourlyRate = 0;

        if (employee.salaryType === 'Task-wise') {
             // Calculate daily earnings based on daily rate or default rate
             attendanceLogs.forEach(log => {
                if (log.status === 'Present') { // Only pay if present
                    const dailyRate = log.hourlyRate > 0 ? log.hourlyRate : employee.salary;
                    basicSalary += dailyRate * 8; // Assuming 8hr shifts or Task completion equivalent
                }
             });
             hourlyRate = employee.salary; // Just for reference
        } else {
            // Monthly
            attendanceLogs.forEach(log => {
                if (log.status === 'Present') {
                   // If admin provided a specific rate for this day (stored in hourlyRate), treat it as a Daily/Hourly fix.
                   // User said "Ghonta Chukti" (Hourly Contract) for the override.
                   // So if log.hourlyRate exists, we use it as the rate for the day (Rate * 8 hours).
                   
                   if (log.hourlyRate > 0) {
                        basicSalary += log.hourlyRate * 8; 
                   } else {
                        // Standard Monthly Calculation for this day
                        const daysInMonth = new Date(year, month, 0).getDate();
                        const dailyGross = employee.salary / daysInMonth; // Using full salary as gross
                        // Basic is typically portion of Gross, but for simplicity here we accumulate the 'Basic' portion?
                        // Let's accumulate the Gross portion to 'basicSalary' variable for consistency with final sum, 
                        // or better: Keep separation.
                        
                        // Let's stick to the previous defined structure:
                        // basicSalary variable accumulates the "Base Pay" for the month.
                        
                        // Normal Monthly Day:
                        const dailyBasic = (employee.salary * 0.6) / daysInMonth; 
                        basicSalary += dailyBasic;
                        
                        // Wait, previous logic was simpler. Let's ensure we don't break "Gross" calc.
                        // If we just add to basicSalary, we need to know if we should divide by 0.6 later.
                        // Mixing calculation types (Monthly + Hourly override) is tricky if we use one variable.
                   }
                }
            });
            
            // This is getting complex because 'basicSalary' is used to determine Gross later: `grossPayable = basicSalary / 0.6`.
            // If we add Hourly chunks (which are Gross equivalent?), we mess up the /0.6 logic.
            
            // RE-THINK:
            // Calculate Pay for days present.
            // Sum up total earnings.
            // TotalSalary = (Sum of Days).
            
            // Let's refactor to calculate `totalBasePay` directly.
            
            let totalBasePay = 0;
            const daysInMonth = new Date(year, month, 0).getDate();
            
            attendanceLogs.forEach(log => {
                if (log.status === 'Present') {
                    if (log.hourlyRate > 0) {
                        // Override Logic: User entered an Hourly Rate (e.g. 200)
                        // So for this day, they get Rate * 8
                        totalBasePay += log.hourlyRate * 8; // Treating override as Hourly
                    } else {
                        // Standard Monthly Logic
                        totalBasePay += employee.salary / daysInMonth;
                    }
                }
            });
            
            // Now we have the Gross Base Pay.
            // We need to set 'basicSalary' and 'grossPayable' for the response.
            // Let's set basicSalary as 60% of totalBasePay for display.
            basicSalary = totalBasePay * 0.6;
            
            // And use totalBasePay for the final sum
            // We need to override the subsequent logic that might double count or apply /0.6 again.
            
            // Global Hourly Rate for OT (defaulting to master if not varying)
            hourlyRate = (employee.salary * 0.6) / 208;
        }

        // Calculate OT Amount using daily rates from attendance logs
        attendanceLogs.forEach(log => {
            const dailyOTRate = log.overtimeRate || hourlyRate * 2; // Default to 2x if not set, or user set
            // User said: "attendance er somoy abar over time er taka change korte pare"
            // So we strictly use log.overtimeRate if it exists.
            
            // Wait, if user sets a specfic rate in attendance, we use it.
            // If 0 or null, what is the default? 
            // "extra over time e defold thakte pare taka ..seta admin select kore dibe" -> Employee.defaultOvertimeRate
            
            const rateToUse = log.overtimeRate > 0 ? log.overtimeRate : (employee.defaultOvertimeRate > 0 ? employee.defaultOvertimeRate : hourlyRate * 2);
            
            otAmount += (log.overtimeHours || 0) * rateToUse;
        });

        // Base Pay
        const grossPayable = employee.salaryType === 'Monthly' ? (typeof totalBasePay !== 'undefined' ? totalBasePay : employee.salary) : basicSalary;

        totalSalary = grossPayable + otAmount;

        res.status(200).json({
            employee: employee.name,
            salaryType: employee.salaryType,
            basicSalary: Math.round(basicSalary),
            earnedSalary: Math.round(grossPayable), // Total Earned (Gross)
            totalOTHours,
            otRate: Math.round(hourlyRate), // OT Rate (approx)
            otAmount: Math.round(otAmount),
            totalSalary: Math.round(totalSalary),
            presentDays
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getEmployees, getEmployeeById, addEmployee, updateEmployee, deleteEmployee, markAttendance, getAttendance, calculatePayroll };
