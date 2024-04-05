/*!
* Builded by Impleplus application builder (https://builder.impleplus.com)
* Version 2.0.0
* Link https://www.impleplus.com
* Copyright impleplus.com
* Licensed under MIT (https://mit-license.org)
*/
const _ = require('lodash');
const common = require('../lib/common');
const fs = require('fs');
const crypto = require('crypto')
var bCrypt = require('bcrypt-nodejs');
const store = require('store2');
var moment = require('moment');
const db  = require('../models/init-models');
const sequelize = require('../helper/db-connect');
var dbHelper = new (require('../helper/db'))(db(sequelize));

const requireLoggedIn = async (req, res, next) => {
  if (getCookieUser(req)){
    return next();
  }
  res.redirect('/login');
};
const requireAuthorize = (access_right) => {
  return async (req, res, next) => {
      var storeUser = store(req.user.id);
      if( _.find(storeUser.user_role_bases,{name:"Administrator"}) == undefined ){
        if(access_right == "view"){
          if (req.user.accessAction.view) {
            return next();
          }
          else {
            res.redirect('/404');
          }
        }
        else if(access_right == "edit"){
          if (req.user.accessAction.edit) {
            return next();
          }
          else {
            res.redirect('/404');
          }
        }
        else if(access_right == "create"){
          if (req.user.accessAction.create) {
            return next();
          }
          else {
            res.redirect('/404');
          }
        }
        else if(access_right == "delete"){
          if (req.user.accessAction.delete) {
            return next();
          }
          else {
            res.redirect('/404');
          }
        }  
        else if(access_right == "assign"){
          if (req.user.accessAction.assign) {
            return next();
          }
          else {
            res.redirect('/404');
          }
        }                        
        else if(access_right == "export"){
          if (req.user.accessAction.export) {
            return next();
          }
          else {
            res.redirect('/404');
          }
        }      
        else {
          res.redirect('/404');
        }
      }
      else {
        return next();
      }

  }
};
const setUserAuthorize = async (req,configNavs) => {
  if(store(req.user.id)==null){
      const [user_roles, user_role_bases, user_teams, user_role_base_locations, user_role_base_departments, user_role_base_teams, user_role_base_accesses] = await Promise.all([		
        dbHelper.findAll("user_role",{user_id:req.user.id}),
        dbHelper.queryAll(`select * from user_role_base where id in (select role_base_id from user_role where user_id = '${req.user.id}')`),
        dbHelper.findAll("user_team",{user_id:req.user.id}),
        dbHelper.queryAll(`SELECT user_role_base_location.* FROM user_role_base_location where role_base_id in (select role_base_id FROM user_role where user_id = '${req.user.id}')`),
        dbHelper.queryAll(`SELECT user_role_base_department.* FROM user_role_base_department where role_base_id in (select role_base_id FROM user_role where user_id = '${req.user.id}')`),
        dbHelper.queryAll(`SELECT user_role_base_team.* FROM user_role_base_team where role_base_id in (select role_base_id FROM user_role where user_id = '${req.user.id}')`),
        dbHelper.queryAll(`SELECT user_role_base_access.*, user_access_base.name FROM user_role_base_access, user_access_base where user_role_base_access.access_base_id = user_access_base.id and role_base_id in (select role_base_id FROM user_role where user_id = '${req.user.id}')`),
      ]);

      var authorizeDatas = authorizeData(configNavs, user_role_base_accesses, user_role_bases); 

      var authorizeAccessDatas;
      if(isAdminAccess(user_role_bases) ){authorizeAccessDatas = authorizeAccess(configNavs, _.filter(authorizeDatas,{view:true}));}
      else {authorizeAccessDatas = authorizeAdminAccess(configNavs); }      
            
      req.user.default_url = "/";
      if(user_role_bases.length > 0){
        if(user_role_bases[0].default_url){
          req.user.default_url = user_role_bases[0].default_url;
        }
      }
            
      store(req.user.id,{user_roles,user_role_bases,user_teams,user_role_base_locations,user_role_base_departments,user_role_base_teams,user_role_base_accesses,authorizeDatas,authorizeAccessDatas});

  }

}

const isAdminAccess = (user_role_bases) => {
  if( _.find(user_role_bases,{name:"Administrator"}) != undefined ){
    return true;
  }
  else {
    return false;
  }
}
const authorizeData = (configNavs, user_role_base_accesses, user_role_bases) => {
  const viewUser_role_base_accesses = _.filter(user_role_base_accesses,{name:"View"});
  const deleteUser_role_base_accesses = _.filter(user_role_base_accesses,{name:"Delete"});
  const createUser_role_base_accesses = _.filter(user_role_base_accesses,{name:"Create"});
  const editeUser_role_base_accesses = _.filter(user_role_base_accesses,{name:"Edit"});
  const assignUser_role_base_accesses = _.filter(user_role_base_accesses,{name:"Assign"});
  const approveUser_role_base_accesses = _.filter(user_role_base_accesses,{name:"Approve"});
  const requestUser_role_base_accesses = _.filter(user_role_base_accesses,{name:"Request"});
  const exportUser_role_base_accesses = _.filter(user_role_base_accesses,{name:"Export"});
  var urlPrivilege = [];
  var assignConfigNavs = Object.assign([], configNavs);
  for(configNav of assignConfigNavs) {
    if (configNav.items.length > 0) {
      for(const configNavItem of configNav.items) {
        for(const activeUrl of configNavItem.activeUrls) {
          urlPrivilege.push(
            {
              url:activeUrl,
              view:_.find(viewUser_role_base_accesses,{nav_id:configNavItem.id})!=undefined?true:false,
              delete:_.find(deleteUser_role_base_accesses,{nav_id:configNavItem.id})!=undefined?true:false,
              create:_.find(createUser_role_base_accesses,{nav_id:configNavItem.id})!=undefined?true:false,
              edit:_.find(editeUser_role_base_accesses,{nav_id:configNavItem.id})!=undefined?true:false,
              assign:_.find(assignUser_role_base_accesses,{nav_id:configNavItem.id})!=undefined?true:false,
              approve:_.find(approveUser_role_base_accesses,{nav_id:configNavItem.id})!=undefined?true:false,
              request:_.find(requestUser_role_base_accesses,{nav_id:configNavItem.id})!=undefined?true:false,
              export:_.find(exportUser_role_base_accesses,{nav_id:configNavItem.id})!=undefined?true:false
            }
          );
        }
      }
    }
    else {
      for(const activeUrl of configNav.activeUrls) {
        urlPrivilege.push(
          {
            url:activeUrl,
            view:_.find(viewUser_role_base_accesses,{nav_id:configNav.id})!=undefined?true:false,
            delete:_.find(deleteUser_role_base_accesses,{nav_id:configNav.id})!=undefined?true:false,
            create:_.find(createUser_role_base_accesses,{nav_id:configNav.id})!=undefined?true:false,
            edit:_.find(editeUser_role_base_accesses,{nav_id:configNav.id})!=undefined?true:false,
            assign:_.find(assignUser_role_base_accesses,{nav_id:configNav.id})!=undefined?true:false,
            approve:_.find(approveUser_role_base_accesses,{nav_id:configNav.id})!=undefined?true:false,
            request:_.find(requestUser_role_base_accesses,{nav_id:configNav.id})!=undefined?true:false,
            export:_.find(exportUser_role_base_accesses,{nav_id:configNav.id})!=undefined?true:false     
          }
        );
      }
    }
  }
  if( _.find(user_role_bases,{name:"Administrator"}) != undefined ){
    urlPrivilege = urlPrivilege.map((item) => ({ ...item, ...{assign:true, approve:true, create:true, delete:true, edit:true, export:true, request:true, view:true} }) );
  }
  return urlPrivilege;
};
const authorizeAdminAccess = (configNavs) => {
  var dataNavs = [];
  var assignConfigNavs = Object.assign([], configNavs);
  for(configNav of assignConfigNavs) {
    if (configNav.items.length > 0) {
      var dataItemNavs = [];
      for(const configNavItem of configNav.items) {
        dataItemNavs.push(configNavItem);
      }
      if(dataItemNavs.length > 0) {
        var filterConfigNav = Object.assign({}, configNav);
        filterConfigNav.items = dataItemNavs;
        dataNavs.push(filterConfigNav);
      }
    }
    else {
      dataNavs.push(configNav);
    }
  }
  return dataNavs;  
};
const authorizeAccess = (configNavs, dataPrivilege) => {
  var dataNavs = [];
  var assignConfigNavs = Object.assign([], configNavs);
  for(let i=0; i<assignConfigNavs.length; i++) {
    const configNav = assignConfigNavs[i];
    if (configNav.items.length > 0) {
      var dataItemNavs = [];
      for(let j=0; j<configNav.items.length; j++) {
        const configNavItem = Object.assign({}, configNav.items[j]);
        for(let k=0; k<configNavItem.activeUrls.length; k++) {
          const activeUrl = configNavItem.activeUrls[k];
          if( _.find(dataPrivilege,{url:activeUrl}) != undefined ) {
            if(_.find(dataItemNavs,{id:configNavItem.id}) == undefined){
              dataItemNavs.push(configNavItem);
            }
          }
        }
      }
      if(dataItemNavs.length > 0) {
        var filterConfigNav = Object.assign({}, configNav);
        filterConfigNav.items = dataItemNavs;
        dataNavs.push(filterConfigNav);
      }
    }
    else {
      for(let j=0; j<configNav.activeUrls.length; j++) {
        const activeUrl = configNav.activeUrls[j];
        if( _.find(dataPrivilege,{url:activeUrl}) != undefined ) {
          if(_.find(dataNavs,{id:configNav.id}) == undefined){
            dataNavs.push(configNav);
          }
        }
      }
    }
  }
  return dataNavs;
};
const sqlDataPrivilege = (req,table) => {
  var storeUser = store(req.user.id);
  if(table) {table = `${table}.`;} else {table = '';}  
  var sqlWhereDataPrivilege = "";
  if( _.find(storeUser.user_role_bases,{name:"Administrator"}) == undefined ){
    if(req.user.accessAction.view) {
        if(storeUser.user_role_base_locations.find(el => el.location_id == storeUser.location_id)) {
            sqlWhereDataPrivilege = `${table}owner_id in (
                    select user.id from user where location_id in (${ _.map(storeUser.user_role_base_locations,"location_id").join(",") })
                )`;
        }
        else if(storeUser.user_role_base_departments.find(el => el.department_id == storeUser.department_id)) {
            sqlWhereDataPrivilege = `${table}owner_id in (
                select user.id from user where department_id in ('${_.map(storeUser.user_role_base_departments,"department_id").join(",") }')
            )`;                
        }
        else if(
            _.compact(_(storeUser.user_role_base_teams)
            .keyBy('team_id')
            .at(_.map(storeUser.user_teams,"team_id"))
            .value()).length > 0
        ) {
            sqlWhereDataPrivilege = `${table}owner_id in (
                select id from user where id in (
                    select distinct user_id from user_team where team_id in ('${_.map(storeUser.user_role_base_teams,"team_id").join(",")}')
                )
            )`;                     
        }
        else {
            sqlWhereDataPrivilege = `${table}owner_id = '${req.user.id}'`;  
        }
    }
  }
  return sqlWhereDataPrivilege;
};
const getAccessAction = (req) => {
  const originalUrl = req.originalUrl;
  var storeUser = store(req.user.id);
  var accessAction = _.find(storeUser.authorizeDatas,{url:originalUrl});    
  if(!accessAction){
    accessAction = storeUser.authorizeDatas[0];
  }
  for(let item of Object.keys(accessAction)) {
    if(item != "url"){
      accessAction[item] = true;
    }
  }   
  return accessAction;
  // req.user.accessAction = accessAction;
}
const initial = async () => {
    const dbDataFile = "./app/config/initial-data.json";
    if(fs.existsSync(dbDataFile)){
        var initialDatas = JSON.parse(fs.readFileSync(dbDataFile));    
            for(tableData of initialDatas){
                for(rowRecords of tableData.records){
                  var data = {};
                  for(field of rowRecords){
                      data[field.field] = field.value;              
                  }
                  dbHelper.create(tableData.table,data);
                }
            }
        fs.rmSync(dbDataFile);
      }
};
const sync = async () => {
    const dbDataFile = "./app/config/sync-data.json";
    if(fs.existsSync(dbDataFile)){
        var initialDatas = JSON.parse(fs.readFileSync(dbDataFile));    
        var user_role_base_accesses = await dbHelper.findAll("user_role_base_access");
            for(tableData of initialDatas){
                for(rowRecords of tableData.records){
                  var data = {};
                  for(field of rowRecords){
                      data[field.field] = field.value;              
                  }
                  if(_.find(user_role_base_accesses,{nav_id:data.nav_id}) == undefined){
                    dbHelper.create(tableData.table,data);
                  }                  
                }
            }
        fs.rmSync(dbDataFile);
      }
};
const generateSha1 = (assetPath) => {
  return crypto.createHash('sha1').update(assetPath).digest('hex')
};
  
const generateHash = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};

const generateToken = (length) => {
  return Promise.fromCallback(clb => {
    crypto.randomBytes(length, clb)
  }).then(buf => {
    return buf.toString('hex')
  })
};

const getFunctionParams = (req) => {
  var param = {};
  var allParams = common.getUrlAllParam(req);
  var urlParamsKeys = Object.keys(allParams);
  for (var i = 0; i < urlParamsKeys.length; i++) {
      param[urlParamsKeys[i]] = allParams[urlParamsKeys[i]]??"";	
  }
  if (req.method == "POST") {
		for(let reqKey of Object.keys(req.body)) {
        param[reqKey] = req.body[reqKey]??"";	
        if(common.isJson(req.body[reqKey])){
          const jReqKey = JSON.parse(req.body[reqKey]);
          if(jReqKey.field){
            const jReqKey_fields = JSON.parse(jReqKey.field);
            jReqKey_fields.forEach(field => {
                param[field] = jReqKey.value;
            });                 
          }
        }
    }
  }
  return param;
}

const getSqlParam = (param) => {
  var allParams = Object.keys(param);
  var arrParamSearchs = [];
  for (var i = 0; i < allParams.length; i++) {
      const paramName = allParams[i];
      const paramValue = param[paramName];
                                                  
      var sqlParamFieldSearch = "";
      if(paramValue != "" && paramValue != null && paramValue != undefined && common.isJson(paramValue)) {
          const objParamValue = JSON.parse(paramValue);
          const arrParamFields = JSON.parse(objParamValue.field);   
          
          if(objParamValue.type == "text")
          {        
              var arrParamFieldSearchs = [];
              for (let paramField of arrParamFields) {
                  if(objParamValue.value != ""){
                      arrParamFieldSearchs.push({"field":paramField,"operator":objParamValue.operator,"value":objParamValue.value}); 
                  }                            
              }
              if(arrParamFieldSearchs.length>0){
                  sqlParamFieldSearch = `(${arrParamFieldSearchs.map(item => `${item.field} ${item.operator} '%${item.value}%'`).join(" or ")})`; 
              }
          }
          else if(objParamValue.type == "date") {
              const dateValue = moment(objParamValue.value,objParamValue.dateformat);
              const dateValueFormat = `${dateValue.year()}-${dateValue.month()}-${dateValue.date()}`;
              var arrParamFieldSearchs = [];
              for (let paramField of arrParamFields) {
                  if(objParamValue.value != ""){
                      arrParamFieldSearchs.push({"field":paramField,"operator":objParamValue.operator,"value":`DATE_FORMAT(${paramField},'%Y-%m-%d')`});
                  }
              }
              if(arrParamFieldSearchs.length>0){
                  sqlParamFieldSearch = `(${arrParamFieldSearchs.map(item => `${item.value} ${item.operator} '${dateValueFormat}'`).join(" and ")})`;       
              }                        
          }
      }
      if(sqlParamFieldSearch != "") {
          arrParamSearchs.push(sqlParamFieldSearch);
      }            
  }

  var sqlSearch = "";
  if(arrParamSearchs.length>0) {
      sqlSearch = `${arrParamSearchs.map(item => item).join(" and ")}`;  
  }
  return sqlSearch;
}

const cookieHandler = async (req, res, next) => {
  try {
    const originalUrl = req.originalUrl;
    if(isValidRequest(req)) {
      if(req.cookies[__config.cookie.name]){
        const cookieUser = getCookieUser(req);
        res.locals.user = cookieUser;
        req.user = cookieUser;

        var storeUser = store(cookieUser.id);
        if(!storeUser){
          await setUserAuthorize(req,__configNavs);
          storeUser = store(cookieUser.id);
        }
        const accessAction = await getAccessAction(req);
        req.user.accessAction = accessAction;
        res.locals.accessAction = accessAction;
        res.locals.accessNavs = storeUser.authorizeAccessDatas;   
      }

      res.locals.originalUrl = originalUrl;
      res.locals.moment = moment;
    }
    return next();
  }
	catch (err) {
    res.clearCookie(__config.cookie.name, {domain: __config.cookie.domain});
    return next();
	}

}

const isValidRequest = (req) => {
  if(!req.url.includes(".css") && 
  !req.url.includes(".js") && 
  !req.url.includes(".zip") && 
  !req.url.includes(".jpg") && 
  !req.url.includes(".png") && 
  !req.url.includes(".ico") && 
  !req.url.includes(".svg") && 
  !req.url.includes(".webp") && 
  !req.url.includes(".gif" )) {
    return true;
  }
  else {
    return false;
  }
};

const getCookieUser = (req) => {
  if(req.cookies[__config.cookie.name]){
    var cookieValue = req.cookies[__config.cookie.name];
    const securityKey = Buffer.from(__config.cookie.securityKey);
    const initVector = Buffer.from(__config.cookie.initVector);      
    const decryptData = common.decryptData(securityKey, initVector, cookieValue) ;
    var userData = JSON.parse(decryptData);
    return userData;
  }
  else {
     return null;
  }
};

module.exports = {
    requireLoggedIn,
    authorizeData,
    authorizeAdminAccess,
    isAdminAccess,
    authorizeAccess,    
    requireAuthorize,
    sqlDataPrivilege,
    getAccessAction,
    initial,
    sync,
    generateSha1,
    generateHash,
    generateToken,
    getFunctionParams,
    getSqlParam,
    setUserAuthorize,
    cookieHandler,
    getCookieUser
};
