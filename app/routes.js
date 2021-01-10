/**
 * These functions take in the app as well as the authenticator as parameters.
 * Based on the login/signup requests from the app, the appropriate webpage will be rendered
 * @param app 
 * @param passport 
 */

module.exports = function (app, passport) {
    //renders the home page
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    //renders the login page
    app.get('/login', function(req, res) {
        res.render('login.ejs');
    });

    //process the login info. If the user successfully authenticates via the local-login strategy from passport.js, redirect to the general task list
    app.post('/login', 
        passport.authenticate(
            'local-login', {
                successRedirect: '/general',
                failureRedirect: '/index'
            }
        )
    );

    //renders the signup form
    app.get('/signup', function(req, res) {
        res.render('signup.ejs');
    });

    //process signup info. If the user signs up, local-signup strategy in passport.js is run
    app.post('/signup', 
        passport.authenticate(
            'local-signup', {
                successRedirect: '/general', 
                failureRedirect: '/signup'
            } 
        )
    );

    //renders the user profile page
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });
    
    //logs out the user and redirects back to the home page
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    //function that makes sure a user is logged in
    function isLoggedIn(req, res, next) {
        //if user is authenticated, continue
        if (req.isAuthenticated()) {
            return next();
        }
        //otherwise redirect them back to the homepage
        res.redirect('/');
    }
}