const express = require('express');
const userAuth = require('../modules/UserService/userService.service');
const verifyJWT = require('../middleware/verifyJWT');
const { Validator } = require('express-json-validator-middleware');
const userSchema = require('../models/contactBodySchema');
const { validate } = new Validator();

const users = express.Router();

users.post('/auth', userAuth.login);
users.post('/forget_password', userAuth.forgetPassword);
users.post('/register', userAuth.signup);
users.post('/contact_us', validate({ body: userSchema }), userAuth.contactUs);

// users.use(verifyJWT);

users.get('/logout', userAuth.logout);

module.exports = users;
