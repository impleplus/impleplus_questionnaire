
/*! 
* Builded by Impleplus application builder (https://builder.impleplus.com) 
* Version 2.0.0 
* Link https://www.impleplus.com 
* Copyright impleplus.com 
* Licensed under MIT (https://mit-license.org) 
*/ 

module.exports = function(sequelize, DataTypes) {
  var questionnaire = sequelize.define('questionnaire', {
		id: { type: DataTypes.STRING(36), allowNull: false, primaryKey: true },
		question1: {type: DataTypes.STRING(300), allowNull: true },
		answer1: {type: DataTypes.STRING(300), allowNull: true },
		question2: {type: DataTypes.STRING(300), allowNull: true },
		answer2: {type: DataTypes.SMALLINT,allowNull: true},
		question3: {type: DataTypes.STRING(300), allowNull: true },
		answer3: {type: DataTypes.SMALLINT,allowNull: true},
		accept_term: {type: DataTypes.SMALLINT,allowNull: true},
		owner_id: {type: DataTypes.STRING(36), allowNull: true },
		assign: {type: DataTypes.TEXT('medium'),allowNull: true},
		create_by: {type: DataTypes.STRING(36), allowNull: true },
		create_date: {type: DataTypes.DATE,allowNull: true},
		update_by: {type: DataTypes.STRING(36), allowNull: true },
		update_date: {type: DataTypes.DATE,allowNull: true}
  },{
    sequelize, tableName: 'questionnaire', timestamps: false, indexes: [{name: "PRIMARY",unique: true,using: "BTREE",fields: [{ name: "id" }]}]
  });
  return questionnaire;
};