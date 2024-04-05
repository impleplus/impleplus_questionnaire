
  /*!
* Builded by Impleplus application builder (https://builder.impleplus.com)
* Version 2.0.0
* Link https://www.impleplus.com
* Copyright impleplus.com
* Licensed under MIT (https://mit-license.org)
*/
module.exports = function(sequelize, DataTypes) {
      var org_department = sequelize.define('org_department', {
      id: { type: DataTypes.STRING(36),allowNull: false,primaryKey: true},        
      location_id: {type: DataTypes.STRING(36),allowNull: true},         
      name: {type: DataTypes.STRING(100),allowNull: true},        
      address: {type: DataTypes.STRING(200),allowNull: true},        
      remark: {type: DataTypes.STRING(500),allowNull: true}
    }, {
      sequelize,
      tableName: 'org_department',
      timestamps: false,
      indexes: [{name: "PRIMARY",unique: true,using: "BTREE",fields: [{ name: "id" },]}]
  });
  return org_department;
};        
    