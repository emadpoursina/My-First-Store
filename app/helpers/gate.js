const ConnectRoles = require('connect-roles');
const Permission = require('app/model/Permission');
const Role = require('app/model/Role');
 
var gate = new ConnectRoles({
  failureHandler: function (req, res, action) {
    // optional function to customise code that runs when
    // user fails authorisation
    var accept = req.headers.accept || '';
    res.status(403);
    res.end('Access denied');
  }
});

gate.use((req, action) => {
  if(!req.isAuthenticated())
    return false;
})

Permission.find({}).populate('roles')
  .then(permissions => {
    permissions.forEach(permission => {
      const roleIds = permission.roles.map(role => {
        return role._id;
      })
      gate.use(permission.name.trim(), (req) => {
        return (req.isAuthenticated()) ? req.user.hasRole(roleIds) : false;
      })
    })
  });

module.exports = gate;