const mongoose = require('mongoose');
const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

const getMovies = async (req, res, next) => {
  try {
    const allMovies = await Movie.find({}).sort({ createAt: -1 });
    res.status(200).send(allMovies);
  } catch (err) {
    next(err);
  }
};

const createMovie = async (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailer, thumbnail,
    nameRU, nameEN, movieId,
  } = req.body;

  try {
    const movie = new Movie({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      nameRU,
      nameEN,
      movieId,
    });
    movie.owner = new mongoose.Types.ObjectId(req.user._id);
    await movie.save();
    res.send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    next(err);
  }
};

const deleteMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.movieId)
      .orFail(new NotFoundError('Объект не найден'));
    if (movie.owner.toString() !== req.user._id) {
      throw new BadRequestError('Пользователь не имеет прав на удаление данной карточки');
    }

    const movieWithId = await Movie.findByIdAndDelete(req.params.movieId)
      .orFail(new NotFoundError('Объект не найден'));
    res.status(200).send(movieWithId);
  } catch (err) {
    next(err);
  }
};

module.exports = { getMovies, createMovie, deleteMovieById };
