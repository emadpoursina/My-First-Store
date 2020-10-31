const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("app/model/user");

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
   
passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use("local.register", new localStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({
        "email" : email
    }, (err, user) => {
        if(err) return done(err);
        if(user) return done(null, false, req.flash("error", "ایمیل تکراری است"));

        const newuser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        newuser.save(err => {
            if(err) return done(err, false, req.flash("error", "ثبت نام موفقیت آمیز نبود. دوباره امتحان کنید"));
            done(null, newuser);
        })
    })
}))