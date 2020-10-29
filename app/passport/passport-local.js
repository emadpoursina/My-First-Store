const passport = require("passport");
const Strategy = require("passport-local");
const User = require("app/http/model/user.js");

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
   
passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
