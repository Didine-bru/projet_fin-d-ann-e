const express = require('express');
const { indexView } = require('../Controllers/HomeControllers');
const { signupSubmit } = require('../Controllers/signupController');
const { loginSubmit } = require('../Controllers/loginControllers');
const password_submit = require('../Controllers/passwordController');
const { signView } = require('../Controllers/main');
const { crudView } = require('../Controllers/crud');

const router = express.Router();
router.get('/', indexView);
router.post('/signup', signupSubmit);
router.post('/mdp', password_submit);
router.post('/login', loginSubmit);
router.get('/sign', signView);
router.get('/crud', crudView);
module.exports = router;