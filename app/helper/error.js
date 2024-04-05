/*!
* Builded by Impleplus application builder (https://builder.impleplus.com)
* Version 2.0.0
* Link https://www.impleplus.com
* Copyright impleplus.com
* Licensed under MIT (https://mit-license.org)
*/
const dotenv = require('dotenv');
dotenv.config();

const handleError = (err, req, res) => {
    console.log("Err: ", err);
    res.status(err.statusCode || 500);
    if (process.env.NODE_ENV == 'production') {
      if(req.method == "GET") {
        if (err.statusCode == 403) {
          res.redirect('/403');
        }
        else if (err.statusCode == 404) {
          res.redirect('/404');
        }
        else {
          res.redirect('/500');
        }
      }
      else {
        if (err.statusCode == undefined) {
          err.statusCode = 500;
        } 
        res.status(err.statusCode).json({ success: false, message: err.message });
      }
    }
    else {
      if(req.method == "GET") {
        res.send(err.message);
      }
      else {
        if (err.statusCode == undefined) {
          err.statusCode = 500;
        } 
        res.status(err.statusCode).json({ success: false, message: err.message });
      }
    }

  };
  module.exports = {
    handleError
  }