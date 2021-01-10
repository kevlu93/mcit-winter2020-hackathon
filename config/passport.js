const LocalStrategy   = require('passport-local').Strategy;

// load up the user model
const User = require('../app/models/user');

// expose this function to our app 
module.exports = function(passport) {
    //set up passport so that is we have persistent login sessions, and the ability to serialize and deserialize the user
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    //set up local sign up strategy
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {

            //check is username exists
            User.findOne({ 'local.username' :  username}, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                if (user) {
                    return done(null, false);
                } else {

                    // create the user
                    var newUser = new User();

                    // set the user's local credentials
                    newUser.local.username= username;
                    newUser.local.password = newUser.generateHash(password);

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });    
        });
    }));

    passport.use('local-login', new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { 
            //see if user exists
            User.findOne({ 'local.username' :  username}, function(err, user) {
            // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false);

                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false);

                return done(null, user);
            });

        })
    );
};