//should be added at very beginning, to use environment varialbes
//comment out dotenv and enter environment variables on heroku when deploying, else decoment
require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session)

// //const appDb = require('./config/database.js');
// appDbUrl = "mongodb://localhost:27017/todolistDB"

// ****set-up remote server - mongoose **********
// // Connect to MongoDB Atlas
// Coment out when testing locally and replace with above
const user = process.env.user;
const password = process.env.password;
appDbUrl = "mongodb+srv://" + user + ":" + password + "@clusterdefault.faspm.mongodb.net/tododb?retryWrites=true&w=majority"

//configure db and passports
mongoose.connect(appDbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => {
  console.log('connect: success')
}).catch(err => {
  console.log('connect: error')
  throw err;
})

require('./config/passport')(passport);

//setup express
app.use(morgan('dev'));
app.use(cookieParser()); //reads cookies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));

app.enable('trust proxy');

//set up ejs and set the static files directory
app.set('view engine', 'ejs');
//When deploying webpage, folder that is checked by express for other files
app.use(express.static('public'))

//setup passport
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//start routes
require('./app/routes.js')(app, passport);
require('./app/manageTasks.js')(app);

//start the server
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server listening on port" + port);
});
