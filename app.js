var createError = require('http-errors');
var express = require('express');
const expressLayouts = require('express-ejs-layouts');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const homeRoutes = require('./routes/home-routes');
const app = express();
const portfinder = require('portfinder');
const bodyParser = require('body-parser');
const verifyToken = require('./Controllers/jwt');

app.use(bodyParser.urlencoded({ extended: true }));

portfinder.getPort((err, port) => {
  if (err) {
    console.error(err);
  } else {
    const server = app.listen(port, () => {
      console.log(`Serveur Express écoutant sur le port ${port}`);
    });
  }
});

app.get('/favicon.ico', (req, res) => res.status(204));
app.get('/main', (req, res) => {
  res.render('main');
});
app.get('/crud', (req, res) => {
  res.render('crud');
});
app.get('/sign', (req, res) => {
  res.render('sign');
});
app.get('/pwd', (req, res) => {
  res.render('pwd');
}); 
app.get('/private_token', verifyToken, (req, res) => {
  res.json({ message: 'Route protégée' });
});

app.post('/login', homeRoutes);
app.post('/mdp', homeRoutes);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));
app.use(homeRoutes);
app.use('/users', usersRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  if (req.originalUrl.startsWith('/api/')) {
    res.status(500).json({ error: 'Erreur du serveur : ' + err.message });
  } else {
    res.status(err.status || 500);
    res.render('error');
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});

module.exports = app;