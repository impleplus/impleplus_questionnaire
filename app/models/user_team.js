
/*!
* Builded by Impleplus application builder (https://builder.impleplus.com)
* Version 2.0.0
* Link https://www.impleplus.com
* Copyright impleplus.com
* Licensed under MIT (https://mit-license.org)
*/
module.exports = function(sequelize, DataTypes) {
  var user_team = sequelize.define('user_team', {
    id: {type: DataTypes.STRING(36),allowNull: false,primaryKey: true},
    user_id: {type: DataTypes.STRING(36),allowNull: true},
    team_id: {type: DataTypes.STRING(36),allowNull: true}
  }, {
    sequelize,tableName: 'user_team',timestamps: false,indexes: [{name: "PRIMARY",unique: true,using: "BTREE",fields: [{ name: "id" },]}]
  });
  return user_team;
};        
    