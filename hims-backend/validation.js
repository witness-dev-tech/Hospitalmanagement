const { body, validationResult } = require('express-validator');

// Error handling middleware for validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validateRegister = [
    body('username').isLength({ min: 4 }).withMessage('Username must be at least 4 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validate
];

const validatePatient = [
    body('FirstName').trim().notEmpty().withMessage('First Name is required'),
    body('LastName').trim().notEmpty().withMessage('Last Name is required'),
    body('Gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
    body('Telephone').isMobilePhone().withMessage('Valid phone number required'),
    body('RegistrationDate').isISO8601().withMessage('Valid Registration Date required (YYYY-MM-DD)'),
    validate
];

const validateAppointment = [
    body('PatientID').isInt().withMessage('Valid Patient ID required'),
    body('DoctorCode').notEmpty().withMessage('Doctor Code is required'),
    body('AppointmentDate').isISO8601().withMessage('Valid Date/Time required'),
    validate
];

module.exports = { validateRegister, validatePatient, validateAppointment };