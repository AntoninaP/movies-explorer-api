const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');

const movieRoutes = express.Router();
const { getMovies, createMovie, deleteMovieById } = require('../controllers/movies');

// вернуть все сохраненные пользователем фильмы
movieRoutes.get('/', getMovies);

// создать фильм
const checkURL = (val, helper) => {
  if (!isURL(val, { require_protocol: true })) {
    return helper.message('Не валидный URL');
  }

  return val;
};
movieRoutes.post('/', celebrate({
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
    movieId: Joi.number().required(),
  }),
}), createMovie);

// удалить фильм по id
movieRoutes.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.number(),
  }).unknown(true),
}), deleteMovieById);

exports.movieRoutes = movieRoutes;
