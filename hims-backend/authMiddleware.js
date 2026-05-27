// Middleware to ensure a user is logged in before accessing routes
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).json({ error: "Unauthorized. Please log in first." });
};

module.exports = { isAuthenticated };