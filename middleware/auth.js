const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    
    let token = req.header('authorization');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    // Assuming token is prefixed with "Bearer "
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length).trim();
    }

    try {
        const decoded = jwt.verify(token, 'secret');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid', error: err.message });
    }
};
