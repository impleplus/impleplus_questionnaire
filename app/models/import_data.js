
/*!
* Builded by Impleplus application builder (https://builder.impleplus.com)
* Version 2.0.0
* Link https://www.impleplus.com
* Copyright impleplus.com
* Licensed under MIT (https://mit-license.org)
*/
module.exports = function(sequelize, DataTypes) {
    var import_data = sequelize.define('import_data', {
        id: {type: DataTypes.STRING(36),allowNull: false,primaryKey: true},        
        table_name: {type: DataTypes.STRING(50),allowNull: true},
        import_by: {type: DataTypes.STRING(36),allowNull: false},
        import_date: {type: DataTypes.DATE,allowNull: true},
        import_status: {type: DataTypes.SMALLINT,allowNull: true},
        message: {type: DataTypes.STRING(500),allowNull: true},
        owner_id: {type: DataTypes.STRING(36),allowNull: true},
        assign: {type: DataTypes.TEXT('medium'),allowNull: true},
        create_by: {type: DataTypes.STRING(36),allowNull: true},
        create_date: {type: DataTypes.DATE,allowNull: true},
        update_by: {type: DataTypes.STRING(36),allowNull: true},
        update_date: {type: DataTypes.DATE,allowNull: true}          
    }, {
    sequelize,
    tableName: 'import_data',
    timestamps: false,
    indexes: [{name: "PRIMARY",unique: true,using: "BTREE",fields: [{ name: "id" }]}]});
    return import_data;
};        
    