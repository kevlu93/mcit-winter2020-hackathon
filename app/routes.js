

module.exports = function (app, passport) {
    //home page
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    //login page
    app.get('/login', function(req, res) {
        res.render('login.ejs');
    });

    //process the login info
    app.post('/login', 
        passport.authenticate(
            'local-login', {
                successRedirect: '/general',
                failureRedirect: '/login'
            }
        )
    );

    //signup form
    app.get('/signup', function(req, res) {
        res.render('signup.ejs');
    });

    //process signup info
    app.post('/signup', 
        passport.authenticate(
            'local-signup', {
                successRedirect: '/general', 
                failureRedirect: '/signup'
            } 
        )
    );

    //profile page
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });
    
    //logout page
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