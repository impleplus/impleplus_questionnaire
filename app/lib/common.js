/*!
* Builded by Impleplus application builder (https://builder.impleplus.com)
* Version 2.0.0
* Link https://www.impleplus.com
* Copyright impleplus.com
* Licensed under MIT (https://mit-license.org)
*/
const _ = require('lodash');
const uglifycss = require('uglifycss');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const nodemailer = require('nodemailer');
const sanitizeHtml = require('sanitize-html');
const escape = require('html-entities').AllHtmlEntities;
const mkdirp = require('mkdirp');
const countryList = require('countries-list');
var url = require('url');
const querystring = require('querystring');
var mv = require('mv');
const moment = require('moment');
var im = require('imagemagick');
const Excel = require('exceljs');
const crypto = require('crypto');

/*google api, email */
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

// Parse country list once
const countryArray = [];
Object.keys(countryList.countries).forEach((country) => {
    countryArray.push(countryList.countries[country].name);
});

// Allowed mime types for product images
const allowedMimeType = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp'
];

const fileSizeLimit = 10485760; /*10 MB */

// common functions
const cleanHtml = (html) => {
    return sanitizeHtml(html);
};

const checkboxBool = (param) => {
    if(param && param === 'on'){
        return true;
    }
    return false;
};

const convertBool = (value) => {
    if(value === 'true' || value === true){
        return true;
    }
    return false;
};



const clearSessionValue = (session, sessionVar) => {
    let temp;
    if(session){
        temp = session[sessionVar];
        session[sessionVar] = null;
    }
    return temp;
};

const checkDirectorySync = (directory) => {
    try{
        fs.statSync(directory);
    }catch(e){
        try{
            fs.mkdirSync(directory);
        }catch(err){
           mkdirp.sync(directory);// error : directory & sub directories to be newly created
        }
    }
};

const getImages = async (id, req, res, callback) => {

    // loop files in /public/uploads/
    const files = await glob.sync(`public/uploads/${id}/**`, { nosort: true });

    // sort array
    files.sort();

    // declare the array of objects
    const fileList = [];

    // loop these files
    for(let i = 0; i < files.length; i++){
        // only want files
        if(fs.lstatSync(files[i]).isDirectory() === false){
            // declare the file object and set its values
            const file = {
                id: i,
                path: files[i].substring(6)
            };
            if(product.productImage === files[i].substring(6)){
                file.productImage = true;
            }
            // push the file object into the array
            fileList.push(file);
        }
    }
    return fileList;
};

const getConfig = () => {
    let config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config', 'config.json'), 'utf8'));
    return config;
};


const updateConfig = (field) => {
    const localSettingsFile = path.join(__dirname, '../config', 'config.json');
    try{
        let localSettings = {};
        if(fs.existsSync(localSettingsFile)){
            localSettings = JSON.parse(fs.readFileSync(localSettingsFile));
        }
        Object.assign(localSettings, field);
        fs.writeFileSync(localSettingsFile, JSON.stringify(localSettings, null, 4));
    }
    catch(exception){
        console.log('Failed to save local settings file', exception);
    }
};

const sendEmail = (to, subject, body, attachments) => {
    try {
        var emailSettings = {};
        if(__config.emailHost == 'smtp.gmail.com')
        {
            const myOAuth2Client = new OAuth2(__config.gmail.MAILING_SERVICE_CLIENT_ID, __config.gmail.MAILING_SERVICE_CLIENT_SECRET,__config.gmail.OAUTH_PLAYGROUND)
            
            myOAuth2Client.setCredentials({refresh_token:__config.gmail.MAILING_SERVICE_REFRESH_TOKEN});
            
            const myAccessToken = myOAuth2Client.getAccessToken()

            emailSettings = {
                service: 'gmail',
                host: __config.emailHost,
                auth: {
                    type: 'OAuth2',
                    user: __config.emailUser,
                    clientId: __config.gmail.MAILING_SERVICE_CLIENT_ID,
                    clientSecret: __config.gmail.MAILING_SERVICE_CLIENT_SECRET,
                    refreshToken: __config.gmail.MAILING_SERVICE_REFRESH_TOKEN,
                    accessToken: myAccessToken,
                }
              };              
        }
        else
        {
            emailSettings = {
                host: __config.emailHost,
                port: __config.emailPort,
                secure: __config.emailSecure,
                auth: {
                    user: __config.emailUser,
                    pass: __config.emailPassword
                }
            };
        }

        const transporter = nodemailer.createTransport(emailSettings);

        const mailOptions = {
            from: __config.emailAddress, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            html: body// html body          
        };
        if(attachments != null)
        {
            mailOptions.attachments = attachments;
        }
     
        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                return console.error(colors.red(error));
            }
            return true;
        });
    }
	catch (err) {
		console.log(err);
	}
};

  const countUrlParam = (rawUrl) => {
    let parsedUrl = url.parse(rawUrl);
    let parsedQs = querystring.parse(parsedUrl.query);
    return Object.keys(parsedQs).length;
  }

  const getUrlAllParam = (req) => {
    if (req.method == "GET") {
        let rawUrl = req.originalUrl;
        let parsedUrl = url.parse(rawUrl);
        let parsedQs = querystring.parse(parsedUrl.query);
        return parsedQs;
    }
    else {
        let rawUrl = req.headers.referer;
        let parsedUrl = url.parse(rawUrl);
        let parsedQs = querystring.parse(parsedUrl.query);
        return parsedQs;
    }
  }

  const getRedirectAllParam = (req) => {
    const params = getUrlAllParam(req);
    var strUrlParam = [];
    for(let param of Object.keys(params)) {
        strUrlParam.push(`${param}=${params[param]}`);
    } 
    return strUrlParam.join("&");
  }

  const replaceUrlParam = (url, paramName, paramValue) => {
    if (paramValue == null) {
        paramValue = '';
    }
    var pattern = new RegExp('\\b('+paramName+'=).*?(&|#|$)');
    if (url.search(pattern)>=0) {
        return url.replace(pattern,'$1' + paramValue + '$2');
    }

    url = url.replace(/[?#]$/,'');
    return url + (url.indexOf('?')>0 ? '&' : '?') + paramName + '=' + paramValue;
}

function removeURLParameter(url, parameter) {
    var urlparts = url.split('?');   
    if (urlparts.length >= 2) {

        var prefix = encodeURIComponent(parameter) + '=';
        var pars = urlparts[1].split(/[&;]/g);
        for (var i = pars.length; i-- > 0;) {    
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
                pars.splice(i, 1);
            }
        }
        return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
    }
    else
    {
        return url;
    }
}

function addURLParameter(url, parameter) {
    if(countUrlParam(url)<=1){
        return '?'+parameter;
    }
    else{
        return '&'+parameter;
    }
}

const pagination = (req, datacount, limit, page, param, param_page) => {
    if(param_page==undefined)
    {
        param_page = 'page';
    }

    let rawUrl = req.originalUrl;
    let rawUrl_remove_page = removeURLParameter(rawUrl,param_page);

    const showNum = 5;
    const pageShowNum = Math.ceil(page / showNum);
    const totalPage = Math.ceil(datacount/limit);
    const totalPageNum = Math.ceil(totalPage / showNum);

    var prev = (pageShowNum-1)*showNum;
    prev = prev>totalPage?(Math.floor(totalPage / showNum))*showNum:prev;
    prev = prev!=0?prev:1;
    var next = (Math.ceil(page / showNum)*showNum)+1;
    next = next<totalPage?next:totalPage;

    var pageStart = Math.floor(page / showNum);
    pageStart = pageStart<=totalPageNum?pageStart:totalPageNum;
    
    var pageEnd = Math.ceil(page / showNum);
    pageEnd = pageEnd<=totalPageNum?pageEnd:totalPageNum;

    var pageStartNum = (pageStart*showNum)+1;
    pageStartNum = pageStart!=pageEnd?pageStartNum:(((pageStart-1)*showNum)+1);

    var pageEndNum = pageEnd*showNum;
    pageEndNum = pageEndNum<totalPage?pageEndNum:totalPage;     

    let urlpage = '';
    if(param == undefined)
    {
        if(countUrlParam(rawUrl_remove_page)==0){
            urlpage = '?'+param_page+'=';
        }
        else{
            urlpage = rawUrl_remove_page+'&'+param_page+'=';
        }
    }
    else
    {
        if(countUrlParam(req.originalUrl)<=1){            
            if(rawUrl.indexOf(param)==-1)
            {
                urlpage = '?'+param+'&'+param_page+'=';
            }
            else
            {
                urlpage = '?'+param_page+'=';
            }
        }
        else{
            if(rawUrl.indexOf(param)==-1)
            {
                urlpage = removeURLParameter(rawUrl,param_page)+'&'+param+'&'+param_page+'=';
            }
            else
            {
                urlpage = removeURLParameter(rawUrl,param_page)+'&'+param_page+'=';
            }            
        }
    }
    let _paggination = {
        pages:totalPage,
        startpage:pageStartNum,
        prevpage:prev,
        nextpage:next,
        endpage:pageEndNum,
        currentpage:page,
        totalcount:datacount,
        urlpage:urlpage,
        rowPerPage:limit
    }
    return _paggination;
}

const uploadFile = (file, target_path, fileName) => {
    var newFilename = "";
    if (file != undefined) {
        if(fileName != undefined){
            newFilename = fileName.concat(".",file.name.split(".")[file.name.split(".").length-1]);
        }        
        else {
            newFilename = file.name;
        }
        let tmp_path = file.tempFilePath;
        let path_upload = path.join(__basedir, 'app/public', target_path);
        const made = mkdirp.sync(path_upload);

        path_upload_file = path.join(path_upload,newFilename);
        mv(tmp_path, path_upload_file, function(err) {});
        return newFilename;
        
    }
}

const deleteUplodFile = (file, target_path) => {
    if (file != undefined) {
        let filename = file.name;
        let pathFile = path.join(__basedir, 'app/public', target_path,filename);
        fs.unlinkSync(pathFile);
    }
}

const toDateFormat = (value, fromFormat, toFormat, defaultValue = null) => {
    /* if ((value instanceof Date) )
     if(Date.prototype.isPrototypeOf(value))
     if(!isNaN(Date.parse(new Date(value))))
    */
    try
    {
        if(moment(value,fromFormat).isValid())
        {
            return moment(moment(value,fromFormat)).format(toFormat);
        }
        else
        {
            if (defaultValue == null)
            {
                return null
            }     
            else
            {
                return defaultValue;
            }       
        }
    }
    catch (err)
    {
        return null;
    }
}

const toMySqlDateTimeFormat = (value) => {
    try
    {
        const config = getConfig();
        if(moment(value,`${__config.dateFormat} HH:mm:ss`).isValid())
        {
            return moment(moment(value,`${__config.dateFormat} HH:mm:ss`)).format("YYYY-MM-DD HH:mm:ss").concat("Z");
        }
        else
        {
            return (moment()).format("YYYY-MM-DD HH:mm:ss").concat("Z");
        }
    }
    catch (err)
    {
        return null;
    }
}

const awaitHandlerFactory = middleware => {    
    return async (req, res, next) => {
        try {
          await middleware(req, res, next)
        } catch (err) {
          next(err)
        }
    }
}

const isNumber = (value) => {
    if(typeof value == "number") { return true; }
    else return false;
}
const isUUID = (value) => {
    const typeValue = typeof value;
    if(typeValue == "string" && value.length >= 35) { return true; }
    else return false;
}
const randomText = (length=6) => {
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result  = '';
    for (var i = 0; i < length; ++i) {
        result += alphabet[Math.floor(alphabet.length * Math.random())];
    }
    return result;      
};

const stampTime = moment().format('YYYYMMDDHHmmss');

const exportXls = (res, fileName, sheetName, data) => {
    res.writeHead(200, {
        'Content-Disposition': 'attachment; filename="'+fileName+'.xlsx"',
        'Transfer-Encoding': 'chunked',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: res });
    const worksheet = workbook.addWorksheet(sheetName);
    let worksheet_header = [];			
    if (data.length > 0) {
        let record = data[0];
        for(let i=0; i< Object.keys(record).length; i++){
            worksheet_header.push({ header: Object.keys(record)[i], key: Object.keys(record)[i] });
        }
    }
    worksheet.columns = worksheet_header;
    data.forEach(record => {
        let row = {};
        for(let i=0; i< Object.keys(record).length; i++){
            row[Object.keys(record)[i]] = Object.values(record)[i];
        }            
        worksheet.addRow(row).commit();
    });
    worksheet.commit();
    workbook.commit();	
}

const isJson = (value) => {    
    if (typeof value!=="string"){
        return false;
    }
    try{
        var json = JSON.parse(value);
        return (typeof json === 'object');
    }
    catch (error){
        return false;
    }
}

function encryptData(securitykey, initVector, message) {
	const algorithm = "aes-256-cbc"; 
    const cipher = crypto.createCipheriv(algorithm, securitykey, initVector);
    let encryptedData = cipher.update(message, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    return encryptedData;
}

function decryptData(securitykey, initVector, encryptedData) {
	const algorithm = "aes-256-cbc"; 
    const decipher = crypto.createDecipheriv(algorithm, securitykey, initVector);
    let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
    decryptedData += decipher.final("utf8");
    return decryptedData;
}

module.exports = {
    allowedMimeType,
    fileSizeLimit,
    cleanHtml,
    checkboxBool,
    convertBool,    
    clearSessionValue,                
    checkDirectorySync,
    getImages,
    getConfig,    
    updateConfig,
    sendEmail,
    countUrlParam,
    getUrlAllParam,
    getRedirectAllParam,
    replaceUrlParam,
    removeURLParameter,
    addURLParameter,
    pagination,
    uploadFile,
    deleteUplodFile,
    toDateFormat,
    toMySqlDateTimeFormat,
    awaitHandlerFactory,
    isNumber,
    isUUID,
    randomText,
    stampTime,
    exportXls,
    isJson,
    encryptData,
    decryptData
};
