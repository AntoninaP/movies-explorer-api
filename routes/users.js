const express = require('express');
const { celebrate, Joi } = require('celebrate');

const userRoutes = express.Router();
const { getCurrentUser, updateProfile } = require('../controllers/users');

// вернуть информацию о текущем пользователе
userRoutes.get('/me', getCurrentUser);

// обновить профиль текущего пользователя
userRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);

exports.userRoutes = userRoutes;
