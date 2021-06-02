const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');

const routes = express.Router();
const {
  getCurrentUser, updateProfile, getMovies, createMovie, deleteMovieById
} = require('../controllers/controllers');

// вернуть информацию о текущем пользователе
routes.get('/users/me', getCurrentUser);

// обновить профиль текущего пользователя
routes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);

// вернуть все сохраненные пользователем фильмы
routes.get('/movies', getMovies);

// создать фильм
const checkURL = (val, helper) => {
  if (!isURL(val, { require_protocol: true })) {
    return helper.message('Не валидный URL');
  }

  return val;
};
routes.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().custom(checkURL, 'invalid URL').required(),
    trailer: Joi.string().custom(checkURL, 'invalid URL').required(),
    thumbnail: Joi.string().custom(checkURL, 'invalid URL').required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.string().required().hex().length(24)
  }),
}), createMovie);

// удалить фильм по id
routes.delete('/movies/movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }).unknown(true),
}), deleteMovieById);

exports.routes = routes;
