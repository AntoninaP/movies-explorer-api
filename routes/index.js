const express = require('express');
const { userRoutes } = require('./users');
const { movieRoutes } = require('./movies');

const routes = express.Router();
routes.use('/users', userRoutes);
routes.use('/movies', movieRoutes);

exports.routes = routes;
