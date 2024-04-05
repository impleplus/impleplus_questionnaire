
/*!
* Builded by Impleplus application builder (https://builder.impleplus.com)
* Version 2.0.0
* Link https://www.impleplus.com
* Copyright impleplus.com
* Licensed under MIT (https://mit-license.org)
*/
var bCrypt = require('bcrypt-nodejs');
var _ = require("lodash");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db  = require('../../models/init-models');
const sequelize = require('../../helper/db-connect');
var dbHelper = new (require('../../helper/db'))(db(sequelize));
/*
Configure the local strategy for use by Passport.
The local strategy requires a `verify` function which receives the credentials
(`username` and `password`) submitted by the user.  The function must verify
that the username and password are correct and then invoke `done` with a user
object, which will be set at `req.session.user` in route handlers after authentication.
*/
passport.use('local', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false // we are storing a JWT in the cookie with all the required session data. The server is session-less
  },
  async function (email, password, done) {  
    var user = await dbHelper.findOne("user",{email:email}); 
    if (user && user.password && bCrypt.compareSync(password, user.password)) {  
      return done(null, user);
    }
    return done("Invalid User name or Password !!!", false)
  }
))

module.exports = passport;
