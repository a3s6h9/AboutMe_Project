const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {type: String,
    required: true,
    min: 3
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  resetToken: {
    type: String,
    default: null
  }
});

mongoose.model('User', usersSchema);
