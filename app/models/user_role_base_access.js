
/*!
* Builded by Impleplus application builder (https://builder.impleplus.com)
* Version 2.0.0
* Link https://www.impleplus.com
* Copyright impleplus.com
* Licensed under MIT (https://mit-license.org)
*/
module.exports = function(sequelize, DataTypes) {
  var user_role_base_access = sequelize.define('user_role_base_access', {
    id: {type: DataTypes.STRING(36),allowNull: false,primaryKey: true},
    role_base_id: {type: DataTypes.STRING(36),allowNull: false},
    nav_id: {type: DataTypes.STRING(36),allowNull: false},
    access_base_id: {type: DataTypes.STRING(36),allowNull: false}
  }, {
    sequelize,tableName: 'user_role_base_access',timestamps: false,indexes: [{name: "PRIMARY",unique: true,using: "BTREE",fields: [{ name: "id" },]}]
  });
  return user_role_base_access;
};        
    