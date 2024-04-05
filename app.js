/*!
* Builded by Impleplus application builder (https://builder.impleplus.com)
* Version 2.0.0
* Link https://www.impleplus.com
* Copyright impleplus.com
* Licensed under MIT (https://mit-license.org)
*/
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var expressLayouts = require('express-ejs-layouts');
var compression = require('compression');
var fileUpload = require('express-fileupload');
var flash = require('connect-flash');
var fs = require('fs');
var { handleError } = require('./app/helper/error');
var common = require('./app/lib/common');
var config = common.getConfig();
global.__config = config;
var impleplusHelper = require('./app/helper/impleplus-helper');
const sequelize = require('./app/helper/db-connect');

if(config.databaseSync=="force"){ 
  sequelize.sync({ force : true }).then(() => {
    impleplusHelper.initial();
    impleplusHelper.sync();
    common.updateConfig({...config,...{databaseSync:""}});
  });    
}
else if(config.databaseSync=="sync"){ 
  sequelize.sync({ alter : true }).then(() => { 
    impleplusHelper.sync();
    common.updateConfig({...config,...{databaseSync:""}});
  }); 
}

const configNavs = JSON.parse(fs.readFileSync("app/config/nav.json",{ encoding: 'utf8' }));
global.__basedir = __dirname;
global.__configNavs = configNavs;

var app = express();
app.use(compression());
app.use(fileUpload({useTempFiles: true,tempFileDir: '/tmp/'}));
app.set('views', './app/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/app/public')));
var passport = require('./app/config/passport/local');
app.use(passport.initialize());
app.use(flash());

app.all('*', impleplusHelper.cookieHandler, async function (req, res, next) {
  next();
});

require('./app/routes/impleplus')(app, passport);

app.use(function(err, req, res, next) {
  handleError(err, req, res);
});

const port = 3000;
app.listen(port, function () {
  console.log(`App running at Port: ${port}`);
})
