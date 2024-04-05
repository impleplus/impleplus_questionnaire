
/*!
 * Module dependencies.
 */

const local = require('./passport/local');

/**
 * Expose
 */

module.exports = function (passport) {
  // serialize sessions
  passport.serializeUser(function(data, done) {
    done(null, data)
  })

  passport.deserializeUser(function(data, done) {
    done(null, data);
  })

  // use these strategies
  passport.use(local);
};
