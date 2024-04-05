/*!
* Builded by Impleplus application builder (https://builder.impleplus.com)
* Version 2.0.0
* Link https://www.impleplus.com
* Copyright impleplus.com
* Licensed under MIT (https://mit-license.org)
*/
module.exports = function(sequelize, DataTypes) {
  var user_role = sequelize.define('user_role', {
    id: {type: DataTypes.STRING(36),allowNull: false,primaryKey: true},
    user_id: {type: DataTypes.STRING(36),allowNull: true},
    role_base_id: {type: DataTypes.STRING(36),allowNull: true}
  }, {
    sequelize,tableName: 'user_role',timestamps: false,indexes: [{name: "PRIMARY",unique: true,using: "BTREE",fields: [{ name: "id" },]}]
  });
  return user_role;
};        
    