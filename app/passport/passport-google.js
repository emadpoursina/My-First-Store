const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("app/model/user");

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
   
passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: config.service.google.client_key,
    clientSecret: config.service.google.secret_key,
    callbackURL: config.service.google.callback_url
  },
  function(token, tokenSecret, profile, done) {
      console.log(profile);
  }
));