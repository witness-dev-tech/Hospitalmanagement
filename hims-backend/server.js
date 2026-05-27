const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');
const { isAuthenticated } = require('./authMiddleware');
const { validateRegister, validatePatient, validateAppointment } = require('./validation');

const app = express();

// Middleware Configuration
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Update to match your frontend URL if necessary
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day expiry
    }
}));

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Create Account (Register)
app.post('/api/auth/register', validateRegister, async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const [existing] = await db.query('SELECT * FROM User WHERE Username = ?', [username]);
        if (existing.length > 0) return res.status(400).json({ error: "Username already taken" });

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO User (Username, Password, Role) VALUES (?, ?, ?)', [username, hashedPassword, role || 'Staff']);
        
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM User WHERE Username = ?', [username]);
        if (users.length === 0) return res.status(401).json({ error: "Invalid credentials" });

        const user = users[0];
        const match = await bcrypt.compare(password, user.Password);
        if (!match) return res.status(401).json({ error: "Invalid credentials" });

        // Establish Session
        req.session.user = { id: user.UserID, username: user.Username, role: user.Role };
        res.json({ message: "Logged in successfully", user: req.session.user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: "Could not log out" });
        res.clearCookie('connect.sid');
        res.json({ message: "Logged out successfully" });
    });
});

// ==========================================
// PATIENT CRUD (Protected)
// ==========================================
app.post('/api/patients', isAuthenticated, validatePatient, async (req, res) => {
    const { FirstName, LastName, Gender, Telephone, Address, RegistrationDate } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Patient (FirstName, LastName, Gender, Telephone, Address, RegistrationDate) VALUES (?, ?, ?, ?, ?, ?)',
            [FirstName, LastName, Gender, Telephone, Address, RegistrationDate]
        );
        res.status(201).json({ message: "Patient created", patientId: result.insertId });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/patients', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Patient');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/patients/:id', isAuthenticated, validatePatient, async (req, res) => {
    const { FirstName, LastName, Gender, Telephone, Address, RegistrationDate } = req.body;
    try {
        await db.query(
            'UPDATE Patient SET FirstName=?, LastName=?, Gender=?, Telephone=?, Address=?, RegistrationDate=? WHERE PatientID=?',
            [FirstName, LastName, Gender, Telephone, Address, RegistrationDate, req.params.id]
        );
        res.json({ message: "Patient updated successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/patients/:id', isAuthenticated, async (req, res) => {
    try {
        await db.query('DELETE FROM Patient WHERE PatientID = ?', [req.params.id]);
        res.json({ message: "Patient record deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// DOCTOR CRUD (Protected)
// ==========================================
app.post('/api/doctors', isAuthenticated, async (req, res) => {
    const { DoctorCode, DoctorName, Specialization, Telephone, Email, HireDate } = req.body;
    try {
        await db.query(
            'INSERT INTO Doctor (DoctorCode, DoctorName, Specialization, Telephone, Email, HireDate) VALUES (?, ?, ?, ?, ?, ?)',
            [DoctorCode, DoctorName, Specialization, Telephone, Email, HireDate]
        );
        res.status(201).json({ message: "Doctor created" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/doctors', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Doctor');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/doctors/:code', isAuthenticated, async (req, res) => {
    const { DoctorName, Specialization, Telephone, Email, HireDate } = req.body;
    try {
        await db.query(
            'UPDATE Doctor SET DoctorName=?, Specialization=?, Telephone=?, Email=?, HireDate=? WHERE DoctorCode=?',
            [DoctorName, Specialization, Telephone, Email, HireDate, req.params.code]
        );
        res.json({ message: "Doctor updated successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/doctors/:code', isAuthenticated, async (req, res) => {
    try {
        await db.query('DELETE FROM Doctor WHERE DoctorCode = ?', [req.params.code]);
        res.json({ message: "Doctor record deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// APPOINTMENT CRUD (Protected)
// ==========================================
app.post('/api/appointments', isAuthenticated, validateAppointment, async (req, res) => {
    const { PatientID, DoctorCode, AppointmentDate, Diagnosis, Treatment, Status } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Appointment (PatientID, DoctorCode, AppointmentDate, Diagnosis, Treatment, Status) VALUES (?, ?, ?, ?, ?, ?)',
            [PatientID, DoctorCode, AppointmentDate, Diagnosis, Treatment, Status || 'Scheduled']
        );
        res.status(201).json({ message: "Appointment scheduled", appointmentId: result.insertId });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET Read Appointments (Includes JOIN details to fetch readable names)
app.get('/api/appointments', isAuthenticated, async (req, res) => {
    try {
        const query = `
            SELECT a.*, p.FirstName, p.LastName, d.DoctorName 
            FROM Appointment a
            JOIN Patient p ON a.PatientID = p.PatientID
            JOIN Doctor d ON a.DoctorCode = d.DoctorCode
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/appointments/:id', isAuthenticated, validateAppointment, async (req, res) => {
    const { PatientID, DoctorCode, AppointmentDate, Diagnosis, Treatment, Status } = req.body;
    try {
        await db.query(
            'UPDATE Appointment SET PatientID=?, DoctorCode=?, AppointmentDate=?, Diagnosis=?, Treatment=?, Status=? WHERE AppointmentID=?',
            [PatientID, DoctorCode, AppointmentDate, Diagnosis, Treatment, Status, req.params.id]
        );
        res.json({ message: "Appointment updated successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/appointments/:id', isAuthenticated, async (req, res) => {
    try {
        await db.query('DELETE FROM Appointment WHERE AppointmentID = ?', [req.params.id]);
        res.json({ message: "Appointment cancelled/deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});
// ==========================================
// REPORTING ENDPOINTS (Protected)
// ==========================================

// 1. Appointment History Report (Comprehensive View)
app.get('/api/reports/appointments', isAuthenticated, async (req, res) => {
    try {
        const query = `
            SELECT 
                CONCAT(p.FirstName, ' ', p.LastName) AS PatientName,
                d.DoctorName AS DoctorName,
                a.AppointmentDate,
                a.Diagnosis,
                a.Treatment,
                a.Status
            FROM Appointment a
            INNER JOIN Patient p ON a.PatientID = p.PatientID
            INNER JOIN Doctor d ON a.DoctorCode = d.DoctorCode
            ORDER BY a.AppointmentDate DESC;
        `;
        const [rows] = await db.query(query);
        res.json({
            reportName: "Comprehensive Appointment History",
            generatedAt: new Date(),
            totalRecords: rows.length,
            data: rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Doctors Summary List Report
app.get('/api/reports/doctors', isAuthenticated, async (req, res) => {
    try {
        const query = `
            SELECT 
                d.DoctorCode,
                d.DoctorName,
                d.Specialization,
                d.Telephone,
                d.Email,
                d.HireDate,
                COUNT(a.AppointmentID) AS TotalAppointmentsAssigned
            FROM Doctor d
            LEFT JOIN Appointment a ON d.DoctorCode = a.DoctorCode
            GROUP BY d.DoctorCode
            ORDER BY TotalAppointmentsAssigned DESC;
        `;
        const [rows] = await db.query(query);
        res.json({
            reportName: "Active Doctors Registry Summary",
            generatedAt: new Date(),
            totalDoctors: rows.length,
            data: rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Patients Summary List Report
app.get('/api/reports/patients', isAuthenticated, async (req, res) => {
    try {
        const query = `
            SELECT 
                p.PatientID,
                CONCAT(p.FirstName, ' ', p.LastName) AS PatientName,
                p.Gender,
                p.Telephone,
                p.RegistrationDate,
                COUNT(a.AppointmentID) AS TotalVisits
            FROM Patient p
            LEFT JOIN Appointment a ON p.PatientID = a.PatientID
            GROUP BY p.PatientID
            ORDER BY p.RegistrationDate DESC;
        `;
        const [rows] = await db.query(query);
        res.json({
            reportName: "Registered Patients Summary",
            generatedAt: new Date(),
            totalPatients: rows.length,
            data: rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Treatment and Metrics Summary Report
app.get('/api/reports/treatments-summary', isAuthenticated, async (req, res) => {
    try {
        // Query to get metric breakdown counts (Total, Completed, Cancelled)
        const metricsQuery = `
            SELECT 
                COUNT(*) AS TotalTreatmentsTracked,
                SUM(CASE WHEN Status = 'Completed' THEN 1 ELSE 0 END) AS CompletedTreatments,
                SUM(CASE WHEN Status = 'Cancelled' THEN 1 ELSE 0 END) AS CancelledAppointments
            FROM Appointment;
        `;
        
        // Query to view recent diagnoses and active treatments matching them
        const detailsQuery = `
            SELECT DISTINCT
                Diagnosis,
                Treatment,
                COUNT(*) as Frequency
            FROM Appointment
            WHERE Diagnosis IS NOT NULL AND Diagnosis != ''
            GROUP BY Diagnosis, Treatment
            ORDER BY Frequency DESC;
        `;

        const [[metrics]] = await db.query(metricsQuery);
        const [details] = await db.query(detailsQuery);

        res.json({
            reportName: "Treatment Metrics and Diagnosis Breakdown",
            generatedAt: new Date(),
            summaryMetrics: metrics,
            treatmentFrequencyBreakdown: details
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});