/*!
* Builded by Impleplus application builder (https://builder.impleplus.com)
* Version 2.0.0
* Link https://www.impleplus.com
* Copyright impleplus.com
* Licensed under MIT (https://mit-license.org)
*/
class DbHelper {
    constructor(db) {
        this.db = db;
    } 
    findOne = async (model, where = {}, defaultValue) => {
        return this.db[model].findOne({ where: where, raw: true })
        .then(async function (obj) {
            if(obj == null && defaultValue != null) {
                obj = defaultValue;
            }
            return obj;
        });
    };
    findAll = async (model, where = {}, order = []) => {
        return this.db[model].findAll({ where: where, raw: true, order:order })
        .then(async function (obj) {
            return obj;
        }); 
    };
    queryOne = async (sql, replacements = {}, defaultValue) => {
        return this.db.sequelize.query(sql, { 
            replacements: replacements,					
            type: this.db.sequelize.QueryTypes.SELECT 
            })
            .then(res => {
                if(res.length > 0){
                    return res[0];
                }
                else {
                    if(defaultValue != null) {
                        return defaultValue;
                    }
                    else {
                        return null;
                    }                    
                }            
            });
    };
    queryAll = async (sql, replacements = {}) => {
        return this.db.sequelize.query(sql, { 
            replacements: replacements,	
            type: this.db.sequelize.QueryTypes.SELECT })
            .then(res => {
                return res;
        }); 
    };
    update = async (model, values, where) => {
        this.db[model].update(values, { where: where });
        return values;
    };
    create = async (model, values) => {
        return this.db[model].create(values).then(function (data) {
            return data.get();
         });
    };
    save = async (model, values, new_values, where) => {
        const db = this.db;
        await db[model].findOne({ where: where })
        .then(async function (obj) {
                if (obj) {
                    obj.update(values);
                }
                else
                {
                    if(new_values == null) {
                        new_values = values;
                    }
                    return db[model].create(new_values).then(function (data) {
                        return data.get();
                });
            }
        });
    };
    delete = async (model, where) => {
        if(where != null) {
            this.db[model].destroy({ where: where });
        }
        else {
            this.db[model].destroy({ where: {}, truncate: true });
        }
        return model;
    }
    execute = async (sql) => {
        this.db.sequelize.query(sql, function (err, result) {
            if (err) throw err;
          });
    }
    db = async (sql) => {
        return this.db;
    }
}
module.exports = DbHelper;