if (process.env.NODE_ENV === 'production') {
  module.exports =  {MONGO_URI: process.env.ABOUT_URI, SESSION_SEC: process.env.S_SEC}
} else {
  module.exports = {MONGO_URI: 'mongodb://localhost:27017/AboutMe', SESSION_SEC: 'igotnopowers4real'}
}
