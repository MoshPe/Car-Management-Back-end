const express = require('express');
const userAuth = require('../modules/UserService/userService.service');

const refresh = express.Router();

refresh.get('/refresh', userAuth.refreshToken);

module.exports = refresh;
