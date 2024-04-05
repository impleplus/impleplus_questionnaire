
/*! 
* Builded by Impleplus application builder (https://builder.impleplus.com) 
* Version 2.0.0 
* Link https://www.impleplus.com 
* Copyright impleplus.com 
* Licensed under MIT (https://mit-license.org) 
*/ 

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
		user_code: {type: DataTypes.STRING(20), allowNull: true },
		user_name: {type: DataTypes.STRING(60), allowNull: true },
		address: {type: DataTypes.STRING(100), allowNull: true },
		email: {type: DataTypes.STRING(50), allowNull: true },
		password: {type: DataTypes.STRING(100), allowNull: true },
		location_id: {type: DataTypes.STRING(36), allowNull: true },
		department_id: {type: DataTypes.STRING(36), allowNull: true },
		status_id: {type: DataTypes.SMALLINT,allowNull: true},
		remark: {type: DataTypes.STRING(1000), allowNull: true },
		picture: {type: DataTypes.STRING(200), allowNull: true },
		id: { type: DataTypes.STRING(36), allowNull: false, primaryKey: true },
		owner_id: {type: DataTypes.STRING(36), allowNull: true },
		assign: {type: DataTypes.TEXT('medium'),allowNull: true},
		create_by: {type: DataTypes.STRING(36), allowNull: true },
		create_date: {type: DataTypes.DATE,allowNull: true},
		update_by: {type: DataTypes.STRING(36), allowNull: true },
		update_date: {type: DataTypes.DATE,allowNull: true}
  },{
    sequelize, tableName: 'user', timestamps: false, indexes: [{name: "PRIMARY",unique: true,using: "BTREE",fields: [{ name: "id" }]}]
  });
  return user;
};