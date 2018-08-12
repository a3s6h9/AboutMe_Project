if (process.env.NODE_ENV === 'developement') {
  module.exports =  {MONGO_URI: process.env.ABOUT_URI}
} else {
  module.exports = {MONGO_URI: 'mongodb://localhost:27017/AboutMe'}
}
