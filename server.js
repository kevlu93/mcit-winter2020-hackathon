const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const appDb = require('./config/database.js');

//configure db and passports
mongoose.connect(appDb.url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }
);
require('./config/passport')(passport);

//setup express
app.use(morgan('dev'));
app.use(cookieParser()); //reads cookies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));

//set up ejs and set the static files directory
app.set('view engine', 'ejs');
app.use(express.static('public'))

//setup passport
app.use(session({
    secret: 'secret'
    , resave: false
    , saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//start routes
require('./app/routes.js')(app, passport); 
require('./app/manageTasks.js')(app);

//start the server
app.listen(port)
console.log('Running on port ' + port);