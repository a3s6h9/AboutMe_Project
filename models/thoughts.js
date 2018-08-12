const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;


const thoughtsSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  for: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    default: moment().format('Do MMM YYYY h:mm a')
  }
});

mongoose.model('Thought', thoughtsSchema);
