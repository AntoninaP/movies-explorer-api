const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const AuthError = require('../errors/auth-error');
const EmailIsExistError = require('../errors/email-is-exist-error');

const { NODE_ENV, JWT_SECRET } = process.env;
const opt = { new: true, runValidators: true };

const getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = await User.findOne({ _id: req.user._id })
      .orFail(new NotFoundError('Объект не найден'));
    res.status(200).send(currentUser);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  try {
    // хешируем пароль
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hash,
    });
    res.send({
      data: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    if (err.name === 'MongoError' && err.code === 11000) {
      next(new EmailIsExistError('Данный email уже зарегистрирован'));
      return;
    }
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const newUser = await User.findByIdAndUpdate(req.user._id, { name, email }, opt)
      .orFail(new NotFoundError('Объект не найден'));
    res.status(200).send(newUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    next(err);
  }
};

const getMovies = async (req, res, next) => {
  try {
    const allMovies = await Movie.find({}).sort({ createAt: -1 });
    res.status(200).send(allMovies);
  } catch (err) {
    next(err);
  }
};

const createMovie = async (req, res, next) => {
  const { country, director, duration, year, description, image, trailer,
    nameRU, nameEN, thumbnail, movieId } = req.body;

  try {
    const movie = new Movie({ country, director, duration, year, description, image, trailer,
      nameRU, nameEN, thumbnail, movieId });
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

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AuthError('Неправильные почта или пароль');
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      // хеши не совпали — отклоняем промис
      throw new AuthError('Неправильные почта или пароль');
    }
    // совпали - аутентификация успешна
    // создадим токен
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
    // вернём токен
    res.send({ token });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCurrentUser, createUser, updateProfile, login, getMovies, createMovie, deleteMovieById
};
