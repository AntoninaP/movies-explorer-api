const mongoose = require('mongoose');
const { isEmail } = require('validator');

// схема для пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина 2 символа'],
    maxlength: [30, 'Максимальная длина 30 символов'],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, 'invalid email'],
  },
  password: {
    type: String,
    required: true,
    select: false,
    // что значит "Нужно задать поведение по умолчанию, чтобы база данных не возвращала это поле."
  },
});

module.exports = mongoose.model('user', userSchema);
