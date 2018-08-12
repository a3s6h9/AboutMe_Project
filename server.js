const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const methodOverride = require('method-override');

const app = express();

// Routers
const users = require('./routes/users');
const me = require('./routes/me');

// load passport
require('./config/passport')(passport);

let db = require('./config/db');

// mongoose global promise
mongoose.Promise = global.Promise;
console.log(db.MONGO_URI)
// connnect to mongoose
mongoose.connect(db.MONGO_URI, { useNewUrlParser: true } ).then( () => {
  console.log('connected to the MongoDB');
}).catch( e => console.log('server not responding', e));


// Express-Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Set Up Static Folder
app.use(express.static(path.join(__dirname, '/public')));

// Express Session Middleware
app.use(session({
  secret: '27017Hoe',
  resave: true,
  saveUninitialized: false
}));

// Connect Flash Middleware
app.use(flash());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Method override middleware
app.use(methodOverride('_method'));

// Global Vars
app.use( (req, res, nxt) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  nxt();
});

// Home route
app.get('/', (req, res) => {
  res.render('index', {
    title: 'AboutMe ',
    active_home: true
  });
});

// About route
app.get('/about', (req, res) => {
  res.render('about', {
    title: 'this is the About',
    active_about: true
  });
});

// use routers
app.use('/users', users);
app.use('/me', me);

const port = process.env.PORT || 5000;


app.listen(port, () => {
  console.log('site live on port 5000');
});