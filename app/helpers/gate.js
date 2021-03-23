const ConnectRoles = require('connect-roles');
 
var gate = new ConnectRoles({
  failureHandler: function (req, res, action) {
    // optional function to customise code that runs when
    // user fails authorisation
    var accept = req.headers.accept || '';
    res.status(403);
    res.end('Access denied');
  }
});

module.exports = gate;