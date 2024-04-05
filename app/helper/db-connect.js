/*!
* Builded by Impleplus application builder (https://builder.impleplus.com)
* Version 2.0.0
* Link https://www.impleplus.com
* Copyright impleplus.com
* Licensed under MIT (https://mit-license.org)
*/
var Sequelize = require("sequelize");

const sequelize = new Sequelize(__config.database.databasename, __config.database.username, __config.database.password, __config.database);          
sequelize
.authenticate()
.then(() => {
    console.log("DATABASE CONNECTED: "+__config.database.databasename);
})
.catch((err) => {
    console.log(err);
});

module.exports = sequelize
