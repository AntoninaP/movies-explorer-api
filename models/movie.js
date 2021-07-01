const mongoose = require('mongoose');
const { isURL } = require('validator');

// схема для фильма
const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: [isURL, { require_protocol: true }, 'invalid URL'],
  },
  trailer: {
    type: String,
    required: true,
    validate: [isURL, { require_protocol: true }, 'invalid URL'],
  },
  thumbnail: {
    type: String,
    required: true,
    validate: [isURL, { require_protocol: true }, 'invalid URL'],
  },
  owner: {
    type: mongoose.ObjectId,
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
