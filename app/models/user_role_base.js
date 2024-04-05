/*!
* Builded by Impleplus application builder (https://builder.impleplus.com)
* Version 2.0.0
* Link https://www.impleplus.com
* Copyright impleplus.com
* Licensed under MIT (https://mit-license.org)
*/
module.exports = function(sequelize, DataTypes) {
  var user_role_base = sequelize.define('user_role_base', {
    id: {type: DataTypes.STRING(36),allowNull: false,primaryKey: true},   
    name: {type: DataTypes.STRING(100),allowNull: true},
    default_url: {type: DataTypes.STRING(100),allowNull: true},
    remark: {type: DataTypes.STRING(1000),allowNull: true}
  }, {
    sequelize,tableName: 'user_role_base',timestamps: false,indexes: [{name: "PRIMARY",unique: true,using: "BTREE",fields: [{ name: "id" },]}]
  });
  return user_role_base;
};        
    