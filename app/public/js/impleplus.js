/*! 
* Builded by Impleplus application builder (https://builder.impleplus.com) 
* Version 2.0.0 
* Link https://www.impleplus.com 
* Copyright impleplus.com 
* Licensed under MIT (https://mit-license.org) 
*/ 
var renderNav = {
    active: () => {            
      var template = renderNav.templateRoot(accessNavs);
      document.querySelector('#navbar-menu .navbar-nav').innerHTML = template;
      var mapItems = _.compact(_.map(
        _.map(accessNavs, function (activeNav) {return activeNav.items}), function(o) {
         return _.find(o, function(o) {
            return _.some(o.activeUrls, function(p) {return p == originalUrl;})
          })
      }));
      var activeId;
      if(mapItems.length > 0) {
        activeId = mapItems[0].id;
      }
      else {
        var findActiveId = _.find(accessNavs, function(n) {
          if(n.activeUrls!=undefined) {
            var _return = false;
            for(const activeUrl of n.activeUrls){
              if(activeUrl == originalUrl == true){_return = true;}
            }
            return _return;
          }
          else { return false; }
        });
        if(findActiveId){ activeId = findActiveId.id;}
      }
      if(activeId) {
        var ddItems = document.querySelectorAll('.dropdown-item,.nav-link');
        [].forEach.call(ddItems, (item) => {
          if(item.getAttribute("data-nav") == activeId) {
            item.classList.add('active');
            item.parentNode.classList.add('show','active');
            item.parentNode.parentNode.getElementsByTagName('a')[0].setAttribute('aria-expanded','true');
          }
        });
      }
    },
    templateRoot: (navs) => {
      var elRoots = [];
      for (let nav of navs) {
        if (nav.items.length > 0) {
          elRoots.push(`<li class="nav-item dropdown"><a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" data-bs-auto-close="false" role="button" aria-expanded="false"><span class="nav-link-title">${nav.text}</span></a><div class="dropdown-menu">${renderNav.templateChild(nav.items)}</div></li>`);
        }
        else {
          elRoots.push(`<li class="nav-item"><a class="nav-link" href="${nav.url}" data-nav="${nav.id}"><span class="nav-link-title">${nav.text}</span></a></li>`);
        }
      }
      var template = `${elRoots.join("")}`;          
      return template;
    },
    templateChild: (items) => {
      var elChilds = [];
      for (let item of items) {
        elChilds.push(`<a href="${item.url}" class="dropdown-item" data-nav="${item.id}">${item.text}</a>`);
      }
      return elChilds.join("");
    }
};

function toggleNavbar() {
  var siteNavbar = document.getElementById("siteNavbar");
  var pagewrapper = document.getElementById("page-wrapper");

  siteNavbar.classList.toggle("hide");
  pagewrapper.classList.toggle("hide");
}
[].forEach.call(document.getElementsByClassName("btn-save"), function(el) {
  el.addEventListener("click", event => {
    var call_back = event.target.getAttribute("method-callback"); 
    var call_before = event.target.getAttribute("method-before"); 
    var form_id = event.target.getAttribute("data-form");
    var form = document.getElementById(form_id);
    var from_action = form.getAttribute("action");
    if(call_before!=undefined && call_before!='') {var fn = eval(call_before);fn();}
    if (form.checkValidity() === true) {
      el.style.display = "none";
      document.getElementById(el.id+"_loading").style.display = "";      
        axios({
            method: 'post',
            url: from_action,
            data: new FormData(form),
            headers: {'Content-Type': 'multipart/form-data' }
          }).then(function (response) {
            if(response.data.success)
            {
              if(response.data.message != undefined && response.data.message != '') {alert(response.data.message);}
              if(response.data.redirect != undefined && response.data.redirect != ''){window.location.href = response.data.redirect;}
              else if(response.data.refresh){window.location.reload();}
              if(call_back!=undefined && call_back!=''){var fn = eval(call_back);fn();}
            }
            else
            {
              if(response.data.redirect != undefined && response.data.redirect != ''){window.location.href = response.data.redirect;}             
              else if(response.data.refresh){if(!alert(response.data.message)){window.location.reload();}}
              else {alert(response.data.message);}
            }
            document.getElementById(el.id+"_loading").style.display = "none";
            el.style.display = "";            
          }).catch(function (error) {
            if(error.response) {
              if(error.response.status == 401) {alert("Invalid Email / Password");}
              else {alert(error);}
            }
            else {alert(error);}
            document.getElementById(el.id+"_loading").style.display = "none";
            el.style.display = "";            
          });             
          event.preventDefault();
        }
    });
});

[].forEach.call(document.getElementsByClassName("btn-post"), function(el) {
  el.addEventListener("click", event => {
    if (confirm(event.target.getAttribute("data-message"))) {
      axios({
        method: 'post',
        url: event.target.getAttribute("data-url"),
        data: {data:event.target.getAttribute("data-post")}
        }).then(function (response) {
          if(response.data.success)
          {   
            
            if(response.data.redirect != undefined && response.data.redirect != ''){ window.location.href = response.data.redirect; }
            else if(response.data.refresh) { window.location.reload(); }
            else if(response.data.openpage) { window.open(response.data.openpage,'_blank'); }
            else { alert(response.data.message); }
          }
          else { alert(response.data.message); }
        }).catch(function (error) {
          if (error.response) { alert(error.response.data.message);}  
        });          
        event.preventDefault();
    }
  });
});

const randomText = () => {return Math.random().toString(36).slice(2, 7);};
postData = (url,data) => {
    axios({
        method: 'post',
        url: url,
        data: data
        }).then(function (response) {
          if(response.data.success)
          {   
            if(response.data.redirect != undefined && response.data.redirect != ''){window.location.href = response.data.redirect;}
            else if(response.data.refresh){if(!alert(response.data.message)){window.location.reload();}}           
            else { alert(response.data.message);}
          }
          else { alert(response.data.message);}   
        }).catch(function (error) { if (error.response) { alert(error.response.data.message);}  });
  };
  postCallback = (url, data) => {
    /*
        how to call
        ----------------------
        postCallback(url,data)
        .then((data) => {
            console.log(data);
        });
     */    
      try {
        return axios.post(url, data)
        .then((response) => {
            return response.data;
        });
      }
      catch (err) { console.error(err);}         
  };
  $save = (e, o) => {
    var call_back = o.getAttribute("callback"); 
    var call_before = o.getAttribute("method-before"); 
    var data_method_next = o.getAttribute("callnext"); 
    var add_attr = o.getAttribute("add-attr");
    var form_id = o.getAttribute("data-form");
    var form = document.getElementById(form_id);
    var from_action = form.getAttribute("action");
    if(data_method_next!=undefined && data_method_next!='')
    {
      if(data_method_next){
        var el_input_save_next = document.createElement("input");
        el_input_save_next.setAttribute("type", "hidden");
        el_input_save_next.setAttribute("name", "event_savenext");
        el_input_save_next.setAttribute("value", true);
        document.getElementById(form_id).appendChild(el_input_save_next);
      }
    }
    if(add_attr!=undefined){
      var json_add_attr = JSON.parse(add_attr);
      var el_input_save_next = document.createElement("input");
      el_input_save_next.setAttribute("type", json_add_attr.type);
      el_input_save_next.setAttribute("name", json_add_attr.name);
      el_input_save_next.setAttribute("value", json_add_attr.value);
      document.getElementById(form_id).appendChild(el_input_save_next);
    }
    if(call_before!=undefined && call_before!=''){ var fn = eval(call_before);fn();}
    if (form.checkValidity() === true) {
        axios({
          method: 'post',
          url: from_action,
          data: new FormData(form),
          headers: {'Content-Type': 'multipart/form-data' }
          }).then(function (response) {
            if(response.data.success)
            {                           
              if(response.data.message != undefined && response.data.message != '') {alert(response.data.message);}
              if(response.data.redirect != undefined && response.data.redirect != ''){ window.location.href = response.data.redirect;}
              else if(response.data.refresh){if(!alert(response.data.message)){window.location.reload();}}
              if(call_back!=undefined && call_back!=''){ var fn = eval(call_back);fn();}
            }
            else
            {
              alert(response.data.message);
              if(response.data.redirect != undefined && response.data.redirect != ''){window.location.href = response.data.redirect;}
              else if(response.data.refresh){if(!alert(response.data.message)){window.location.reload();}}           
              else{alert(response.data.message);}              
            }   
          }).catch(function (error) {
            if(error.response) {
              if(error.response.status == 401) {alert("Invalid Email / Password");}
              else {alert(error);}
            }
            else {alert(error);}
          });              
          e.preventDefault();
        }
  };
  $delete = (e, o, elRemove) => {
    if (confirm(o.getAttribute("data-message"))) {
      axios({
        method: 'post',
        url: o.getAttribute("data-url"),
        data: {deleteId:o.getAttribute("data-id")}
        }).then(function (response) {
          if(response.data.success)
          {
            if(response.data.redirect != undefined && response.data.redirect != ''){window.location.href = response.data.redirect;}
            else if(response.data.refresh){ window.location.reload(); }
            else if (response.data.message){alert(response.data.message);}
            if(elRemove){elRemove.remove();}            
          }
          else{alert(response.data.message);}   
        }).catch(function (error) {
          if(error.response) {
            if(error.response.status == 401) {alert("Invalid Email / Password");}
            else {alert(error);}
          }
          else {alert(error);}
        });
        e.preventDefault();
    }
  };

class DataSheet {
  constructor(tableId,headerConfigs,bodyConfigs,items,lookupUrl,lookupVaribale,lookupHeader,lookupField,lookupSelect) {
      this.tableId=tableId;
      this.headerConfigs=headerConfigs;
      this.bodyConfigs=bodyConfigs;
      this.items=items;        
      this.lookupUrl=lookupUrl;
      this.lookupVaribale=lookupVaribale;
      this.lookupHeader=lookupHeader;
      this.lookupField=lookupField;
      this.lookupSelect=lookupSelect;

      this.dataSheetTable=document.querySelector(`table[data-id="${this.tableId}"]`);
  }          

  init(){
    if (!document.getElementById(this.tableId)) {
      return;
    }     
    var headerCols = [];
    for(let i=0;i<this.headerConfigs.length;i++){
      headerCols.push(`<th style="width: ${this.headerConfigs[i].width};">${this.headerConfigs[i].text}</th>`);
    }
    headerCols.push(`<th style="width: 10%;"></th>`);
    this.dataSheetTable.querySelector("thead").innerHTML = `<tr>${headerCols.join("")}</tr>`;
    document.getElementById(tableId).value = JSON.stringify(this.items);
    if(this.items.length==0){
      this.items.push(this.addRow());
    }
    this.renderBody();
  };
  addRow(){
    var itemVals = {};
      for(let bodyConfig of this.bodyConfigs){
        if(bodyConfig.type == "number"){
          itemVals[bodyConfig.field] = 0;
        }
        else if(bodyConfig.type == "text"){
          itemVals[bodyConfig.field] = "";
        }
        else if(bodyConfig.type == "lookup"){
          itemVals[bodyConfig.field] = "";
          itemVals[bodyConfig.field_text] = "";
        }                
        else {
          itemVals[bodyConfig.field] = "";
        }
      }
      itemVals["id"] = randomText();
      return itemVals;
  };
  onAddRow(){
    this.items.push(this.addRow());
    this.renderBody();            
  }
  onRemoveRow(o,id){
    o.parentNode.parentNode.remove();

    var findItem = this.items.find(x => x.id == id);
    this.items = this.items.filter(item => item !== findItem);
    o.parentNode.parentNode.remove(); 

    if(this.items.length==0){
      this.items.push(this.addRow());
      this.renderBody();
    }
    else {
      document.getElementById(tableId).value = JSON.stringify(this.items);
    }
  };
  
  renderBody(){
    const lookupSelectValue = this.lookupSelect.split(",");
    var template = [];
    for(let item of this.items){
      var tds = [];
      for (const [index, bodyConfig] of this.bodyConfigs.entries()) {           
        var readonly = "";
        if(bodyConfig.readonly) {
          readonly = "readonly";
        }
        var addevent = "";
        if(bodyConfig.addevent){
          addevent = bodyConfig.addevent;
        }
        if(bodyConfig.type == "lookup") {
          tds.push(`<td data-col=${index}><div class="row g-2">
                        <div class="col">
                          <input type="hidden" class="datasheet-item" data-key="${item["id"]}" data-field="${bodyConfig.field}" name="${this.tableId}_${bodyConfig.field}" id="${this.tableId}_${bodyConfig.field}_${item["id"]}" value="${item[bodyConfig.field]}">
                          <input type="text" class="form-control datasheet-item" data-key="${item["id"]}" data-field="${bodyConfig.field_text}" name="${this.tableId}_${bodyConfig.field_text}" id="${this.tableId}_${bodyConfig.field}_${item["id"]}_text" value="${item[bodyConfig.field_text]}" ${readonly}>
                        </div>
                        <div class="col-auto">                                  
                          <a href="javascript:void(0)" data-url="${this.lookupUrl}" data-varibale="${this.lookupVaribale}" data-headers="${this.lookupHeader}" data-fields="${this.lookupField}" data-select='${this.lookupSelect}' data-target="${this.tableId}_${bodyConfig.field}_${item["id"]},${this.tableId}_${bodyConfig.field}_${item["id"]}_text" fn-callback="setLookupValue_${this.tableId}" 
                          fn-callback-params='["${this.tableId}","${item["id"]}","${bodyConfig.field}","${bodyConfig.field_text}",data.${lookupSelectValue[0]},data.${lookupSelectValue[1]}]' onclick="lookup.open(this)" class="btn btn-white btn-icon" aria-label="Button">
                            <svg class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="10" cy="10" r="7"></circle><line x1="21" y1="21" x2="15" y2="15"></line></svg>
                          </a>
                        </div>
                      </div></td>`);
        }
        else if(bodyConfig.type == "select") {
          const options = [];            
          for(const dataValue of bodyConfig.dataValue){
            var optionSelect = "";
            if(item[bodyConfig.field] == dataValue.value){
              optionSelect = "selected";
            }              
            options.push(`<option value="${dataValue.value}" ${optionSelect}>${dataValue.text}</option>`);
          }
          tds.push(`<td data-col=${index}><select class="form-select datasheet-item" data-key="${item["id"]}" name="${this.tableId}_${bodyConfig.field}">
          ${options.join("")}           
        </select></td>`);          
        }          
        else {
          tds.push(`<td data-col=${index}><input type="${bodyConfig.type}" data-key="${item["id"]}" name="${this.tableId}_${bodyConfig.field}" value="${item[bodyConfig.field]}" ${addevent} class="form-control datasheet-item" ${readonly}></td>`);
        }
      }
      tds.push(`<td class="text-center"><input type="button" value="Remove" onclick="_${this.tableId}.onRemoveRow(this,'${item["id"]}')" class="btn" ></td>`);
      template.push(`<tr data-id="${item["id"]}">${tds.join("")}</tr>`);
    }

    this.dataSheetTable.querySelector("tbody").innerHTML = template.join("");

    for(let elInput of this.dataSheetTable.querySelectorAll(".datasheet-item")) {
      elInput.addEventListener('change', (event) => {
        var rowId = event.target.getAttribute("data-key");
        var elName = event.target.getAttribute("name").replace(`${this.tableId}_`,"");
        var foundIndex = this.items.findIndex(x => x.id == rowId);
        this.items[foundIndex][elName] = event.target.value;
        document.getElementById(tableId).value = JSON.stringify(this.items);
      });              
    }
    document.getElementById(tableId).value = JSON.stringify(this.items);
  };

}
var lookup = {
  title:"",headers:[],fields:[],selects:[],target:"",url:"",variable:"",fncallback:"",fncallbackparams:"",
  open : (o) => {
    lookup.title = o.getAttribute("data-title");   
    lookup.headers = o.getAttribute("data-headers").split(",");      
    lookup.fields = o.getAttribute("data-fields").split(",");
    lookup.selects = o.getAttribute("data-select").split(",");
    lookup.targets = o.getAttribute("data-target").split(",");  
    lookup.url = o.getAttribute("data-url");   
    lookup.variable = o.getAttribute("data-varibale");   
    lookup.fncallback = o.getAttribute("fn-callback");
    lookup.fncallbackparams = o.getAttribute("fn-callback-params");
    var tblHeader = (lookup.headers.map(item => `<td>${item}</td>`).concat("<td></td>")).join("");
    document.querySelector("#lookup-modal .modal-title").innerHTML = lookup.title;     
    document.querySelector("#lookup-modal thead tr").innerHTML = tblHeader;       
    lookup.getData("",1);
  },
  search : (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {lookup.getData(document.getElementById("qLookup").value,1);}
  },
  pageClick : (page) => {
    lookup.getData(document.getElementById("qLookup").value,page);                      
  },          
  getData : (searchValue,page) => {
    var postData = {};
    var dataElSearch = `[${lookup.fields.map(item=>`"${item}"`).join(",")}]`;
    postData[`q${lookup.variable}`] = JSON.stringify({"value":searchValue,"field":dataElSearch,"type":"text","operator":"like"});      
    postData.page = page;
    postCallback(lookup.url, postData).then(res => {
      if(res.success){
        lookup.render(res);
        lookup.pagination(res[`${lookup.variable}Pagination`]); 
      }
      else {alert(res.message);}
    });    
  },
  render: (res) => {
    var dataTrs = [];    
    var dataTrValues = [];
    for(data of res[lookup.variable]){
      for(let targetSelect of lookup.selects){
        dataTrValues.push(`"${targetSelect}":"${data[targetSelect]}"`);
      }
      var dataTds = [];
      for(field of lookup.fields){
        dataTds.push(`<td>${data[field]}</td>`);
      }
      dataTds.push(`<td><button type="button" class="btn btn-outline-primary btn-pill" onclick="lookup.select(this)">Select</button></td>`);                
      dataTrs.push(`<tr data='{${dataTrValues.join(",")}}'>${dataTds.join("")}</tr>`);
    }
    document.querySelector("#lookup-modal tbody").innerHTML = dataTrs.join("");
    lookupModal.show();
  },
  pagination:(pagination)=>{
    var elPagination = '';
    if(pagination.totalcount > 0) {
      elPagination += `<nav class="d-block text-right">`;
        elPagination += `<ul class="pagination d-inline-flex">`;
              if(pagination.currentpage == 1){ elPagination += `<li class="page-item disabled"><a class="page-link" onclick="lookup.pageClick('${pagination.prevpage}')" tabindex="-1">Previous</a></li>`;} 
              else { elPagination += `<li class="page-item"><a class="page-link" onclick="lookup.pageClick('${pagination.prevpage}')" tabindex="-1">Previous</a></li>`;}
              for(var i=pagination.startpage; i <= pagination.endpage; i++) {
                if(pagination.currentpage == i ){ elPagination += `<li class="page-item active"><a class="page-link" onclick="lookup.pageClick('${i}')">${i}</a></li>`; }
                else { elPagination += `<li class="page-item"><a class="page-link" onclick="lookup.pageClick('${i}')">${i}</a></li>`;} 
              }
              elPagination += `<li class="page-item"><a class="page-link" onclick="lookup.pageClick('${pagination.nextpage}')">Next</a></li>`;
              elPagination += "</ul>";
        elPagination += "</nav>";
    }
    document.getElementById("tbl-lookup-pagination").innerHTML = elPagination;
  },          
  select: (o) => {
    var data = JSON.parse(o.parentNode.parentNode.getAttribute("data"));
    for(let i=0;i<lookup.targets.length;i++){
      document.getElementById(`${lookup.targets[i]}`).value = data[lookup.selects[i]]!="null"?data[lookup.selects[i]]:"";
    }
    if(lookup.fncallback!="" && lookup.fncallback != undefined){
      var fn = eval(lookup.fncallback);fn(eval(lookup.fncallbackparams));
    }
    document.getElementById("qLookup").value = "";
    lookupModal.hide();
  },
  clear: () => {
    for(let i=0;i<lookup.targets.length;i++){
      document.getElementById(`${lookup.targets[i]}`).value = "";
    }

    document.getElementById("qLookup").value = "";
    lookupModal.hide();
  }
};

var actionAssign = {
    add:() => {
      document.getElementById("tb-assign").classList.add("col-8");
      document.getElementById("pn-action-assign").style.display = "block";
      document.querySelector('#pn-action-assign [name="action"]').innerHTML = `<option value="open">Open</option>`;           
      actionAssign.filterData("add");
      actionAssign.filterAssign(document.querySelector('#pn-action-assign [name="assign_to_cat"]').value);  
    },
    approve:(o) => {
      document.getElementById("tb-assign").classList.add("col-8");
      document.getElementById("pn-action-assign").style.display = "block";
      document.querySelector('#pn-action-assign [name="action"]').innerHTML = `<option value="accept">Accept</option><option value="reject">Reject</option>`;
      actionAssign.filterAssign(document.querySelector('#pn-action-assign [name="assign_to_cat"]').value);    
      actionAssign.filterData("edit");
      actionAssign.assignData(o);     
    },
    cancel:(o) => {
      document.getElementById("tb-assign").classList.add("col-8");
      document.getElementById("pn-action-assign").style.display = "block";
      document.querySelector('#pn-action-assign [name="action"]').innerHTML = `<option value="cancel">Cancel</option>`;
      actionAssign.filterAssign(document.querySelector('#pn-action-assign [name="assign_to_cat"]').value);
      actionAssign.filterData("cancel");     
      actionAssign.assignData(o);       
    },
    filterData:(action) => {
      var filterEls = document.querySelectorAll("#pn-action-assign .filter-data");
      [].forEach.call(filterEls, (filterEl) => {
        let dataFilters = filterEl.getAttribute("data-filter").split(",");
        if(dataFilters.includes(action)){filterEl.style.display = 'block';}
        else {filterEl.style.display = 'none';}
      });
    },     
    assignData:(o) => {
      var elTr = o.parentNode.parentNode;
      var id = elTr.getAttribute("data-id");      
      var elTrData = JSON.parse(elTr.getAttribute("data"));
      document.querySelector('#pn-action-assign [name="id"]').value = id; 
      document.querySelector('#pn-action-assign [name="reason"]').value = "";       
    }, 
    hide: () => {
      document.getElementById("tb-assign").classList.remove("col-8");
      document.getElementById("pn-action-assign").style.display = "none";
    },
    filterAssign:(value) => {
      var filterEls = document.querySelectorAll("#pn-action-assign .filter-org");
      [].forEach.call(filterEls, (filterEl) => {
        let dataFilters = filterEl.getAttribute("data-filter-org").split(",");
        if(dataFilters.includes(value)){ filterEl.style.display = 'block';}
        else { filterEl.style.display = 'none';}
      });
    }
  };
var userUserEdit = {
    init: () => {
        var tagId = document.querySelector('#teams_id');
        tagId.value = JSON.stringify(user_teams);
        var whitelist = org_teams.map((obj)=> ({'value':obj.name,'data_id': obj.id }) );
        tagify = new Tagify(tagId, { enforceWhitelist: true,whitelist: whitelist,editTags: false,
        dropdown: {
            classname: "tags-look", enabled: 0, closeOnSelect: true
        }});
        tagify.on('add', e => {
          user_teams.push({'value': e.detail.data.value, 'data_id': e.detail.data.data_id});
        }).on('remove', e => {
          const index = user_teams.findIndex(object => {
              return object.data_id == e.detail.data.data_id;
          });        
          user_teams.splice(index, 1); 
        });      
    }          
};
var userRolebaseOrganizationEdit = {
    tagorg_locations : {
        init: () => {
          var tagId = document.querySelector('#locations_id');
          tagId.value = JSON.stringify(user_role_base_locations);
          var whitelist = org_locations.map((obj)=> ({'value': obj.name, 'data_id': obj.id}) );    
          var tagify = new Tagify(tagId, {enforceWhitelist: true,whitelist: whitelist,editTags: false,
            dropdown: {classname: "tags-look", enabled: 0,closeOnSelect: true}
          });
          tagify.on('add', e => {
            user_role_base_locations.push({'value': e.detail.data.value, 'data_id': e.detail.data.data_id});
          }).on('remove', e => {
            const index = user_role_base_locations.findIndex(object => {
              return object.data_id == e.detail.data.data_id;
            });        
            user_role_base_locations.splice(index, 1); 
          });    
        }
      },
      tagorg_departments : {
        init: () => {
          var tagId = document.querySelector('#departments_id');
          tagId.value = JSON.stringify(user_role_base_departments);
          var whitelist = org_departments.map((obj)=> ({'value':obj.locationName.concat(":",obj.name),'data_id': obj.id }) );
            tagify = new Tagify(tagId, { enforceWhitelist: true,whitelist: whitelist,editTags: false,
            dropdown: {classname: "tags-look", enabled: 0,closeOnSelect: true}
          });
          tagify.on('add', e => {
            user_role_base_departments.push({
              'value': e.detail.data.value, 'data_id': e.detail.data.data_id
            });
          }).on('remove', e => {
            const index = user_role_base_departments.findIndex(object => {
              return object.data_id == e.detail.data.data_id;
            });        
            user_role_base_departments.splice(index, 1); 
          });
        }
      },    
      tagorg_teams : {
        init: () => {
          var tagId = document.querySelector('#teams_id');
          tagId.value = JSON.stringify(user_role_base_teams);
          var whitelist = org_teams.map((obj)=> ({'value':obj.locationName.concat(":",obj.name),'data_id': obj.id }) );
            tagify = new Tagify(tagId, { enforceWhitelist: true,whitelist: whitelist,editTags: false,
            dropdown: {classname: "tags-look", enabled: 0,closeOnSelect: true}
          });
          tagify.on('add', e => {
            user_role_base_teams.push({
              'value': e.detail.data.value, 'data_id': e.detail.data.data_id
            });
          }).on('remove', e => {
            const index = user_role_base_teams.findIndex(object => {
              return object.data_id == e.detail.data.data_id;
            });        
            user_role_base_teams.splice(index, 1); 
          });      
        }
      }
};
class PageList {
  constructor(instName, postUrl, accessAction, renderDataName, paginationDataName, deleteData, editData, exportData, fields, summaryFields, tblTarget, tblPaginationTarget) {
      this.instName=instName;
      this.postUrl=postUrl; 
      this.accessAction=accessAction;
      this.renderDataName=renderDataName;
      this.paginationDataName=paginationDataName;
      this.deleteData=deleteData;
      this.editData=editData;
      this.exportData=exportData;        
      this.fields=fields;
      this.summaryFields=summaryFields;
      this.tblTarget=tblTarget;
      this.tblPaginationTarget=tblPaginationTarget;                
  }
  dataText = {
      edit:"Edit",
      delete:"Delete",
      deleteMessage:``
  };   
  pageClick(page){
    var postData = {};
    var elSearchs = document.querySelectorAll(`.${this.instName}-searchFilter`);
    [].forEach.call(elSearchs, function (elSearch) {
      var dataElSearch = `[${elSearch.getAttribute("data-field").split(",").map(item=>`"${item}"`).join(",")}]`;
      var searchValue = JSON.stringify({
        "value":elSearch.value,"field":dataElSearch,"type":elSearch.getAttribute("data-type"),"operator":elSearch.getAttribute("data-operator"),"dateformat":elSearch.getAttribute("data-format")
      });      
      postData[elSearch["name"]] = searchValue;
    });
    postData.page = page;
    const dataVariableSummary = this.summaryFields.dataVariable;    
    postCallback(this.postUrl, postData).then(res => {
       this.render(res[this.renderDataName],res[dataVariableSummary]);
       this.pagination(res[this.paginationDataName]);
    });
  }
  render(datas,summaryDatas) {
    if (!document.getElementById(this.tblTarget)) {
      return;
    }    
    var elTable = [];
    var running_no = 1;
    const regexCheckParam = new RegExp("{([^<>]+)}");
    datas.forEach((data) => {        
      var btnDelete = "";
      var arrEditUrl = this.editData.url.split("?");
      if(arrEditUrl.length==1){
        var editUrlwithParams = `${this.editData.url}?id=${data.id}`;
      }
      else {
        var arrEditUrlParams = [];
        var paramEditUrls = arrEditUrl[1].split("&");
        for(let paramEditUrl of paramEditUrls){
          var arrParamEditUrl = paramEditUrl.split("=");
          const paramKey = arrParamEditUrl[0];
          var paramValue = arrParamEditUrl[1];              
          const matchValue = paramValue.match(regexCheckParam);
          if(matchValue){
            paramValue = eval(matchValue[1]);            
          }
          arrEditUrlParams.push(`${paramKey}=${paramValue}`);
        }
        editUrlwithParams = `${arrEditUrl[0]}?${arrEditUrlParams.join("&")}`;
        editUrlwithParams = editUrlwithParams==""?`?id=${data.id}`:`${editUrlwithParams}&id=${data.id}`;
      }          

      var deleteMessage = "";
      if(this.deleteData.message){
        const matchDeleteMessage = this.deleteData.message.match(regexCheckParam);
        if(matchDeleteMessage){
          const deleteMessageValue = eval(matchDeleteMessage[1]);
          deleteMessage = this.deleteData.message.replace(new RegExp(matchDeleteMessage[0],'g'),deleteMessageValue);
        }
        else {
          deleteMessage = this.deleteData.message
        }          
      }  
      if(this.accessAction.delete && this.deleteData.url != undefined && this.deleteData.url!=""){ btnDelete = `<td><a href="javascript:void(0)" onclick="$delete(event, this, this.parentElement.parentElement)" class="btn btn-outline-warning btn-pill" data-url="${this.deleteData.url}" data-id="${data.id}" data-message="${deleteMessage}">${this.dataText.delete}</a></td>`;}
      var btnEdit = "";
      if(this.accessAction.edit && this.editData.url!=undefined && this.editData.url!=""){ btnEdit = `<td><a href="${editUrlwithParams}" target="${this.editData.target}" class="btn btn-outline-info btn-pill">${this.dataText.edit}</a></td>`;}
      var tds = [];
      for(let field of this.fields){
        if(field!="running_no"){
          tds.push(`<td>${eval(field)??""}</td>`);
        }
        else {
          tds.push(`<td>${running_no}</td>`);
        }
      }
      tds.push(`${btnDelete}`);
      tds.push(`${btnEdit}`);
      elTable.push(`<tr>${tds.join("")}</tr>`);
      running_no++;
    });
    document.getElementById(this.tblTarget).getElementsByTagName('tbody')[0].innerHTML = elTable.join("");

    if(summaryDatas && this.summaryFields != ""){
      this.summaryFields.cols = this.summaryFields.cols.sort((firstItem, secondItem) => firstItem.col - secondItem.col);
      var dataVariable = this.summaryFields.dataVariable;
      const numSummaryRow = this.summaryFields.cols[0].values.length;
      const numColumns = this.fields.length;
      var arrSummaryRows = [];
      for (let i=0;i<numSummaryRow;i++){
        var arrTds = [];
        for(let j=0;j<numColumns;j++){
          const summaryField = this.summaryFields.cols.find((item) => item.col == (j+1));
          // console.log(summaryField);
          if(summaryField){
            var tdStyle = "";
            var tdClass = "";
            if (summaryField.style){
              tdStyle = `style="${summaryField.style[i]}"`;
            }
            if (summaryField.cssClass && summaryField.cssClass!=""){
              tdClass = `class="${summaryField.cssClass[i]}"`;
            }
            var summaryFieldValue = summaryField.values[i];
            const matchValueSummaryRows = summaryFieldValue.match(/\{(.*?)\}/g);
            for (let matchValueSummaryRow of matchValueSummaryRows){
              var strQt = matchValueSummaryRow.match(/{(.*?)}/g).map(function(val){
                return val.replace(/{/g,'').replace(/}/g,'');
              });
              var strQtFormat = strQt[0].split("|");
              var evalMatchValueSummaryRow;
              if(strQtFormat.length==1)
              {
                evalMatchValueSummaryRow = eval(`${dataVariable}.${strQtFormat[0]}`);
              }
              else {
                if(strQtFormat[1] == "money"){
                  evalMatchValueSummaryRow = Number(eval(`${dataVariable}.${strQtFormat[0]}`)).formatCurrency();
                }
                else {
                  evalMatchValueSummaryRow = eval(`${dataVariable}.${strQtFormat[0]}`);
                }
              }
              summaryFieldValue = summaryFieldValue.replace(matchValueSummaryRow, evalMatchValueSummaryRow);
            }
            arrTds.push(`<td ${tdClass} ${tdStyle}>${summaryFieldValue}</td>`);
          }
          else {
            arrTds.push("<td></td>");
          }
        }
        arrSummaryRows.push(`<tr>${arrTds.join("")}</tr>`);
      }
      // console.log(arrSummaryRows);
      document.getElementById(this.tblTarget).getElementsByTagName('tfoot')[0].innerHTML = arrSummaryRows.join("");
    }
  }
  pagination(dataPagination){
    var elPagination = '';
    if(dataPagination.totalcount > 0) {
      elPagination += `
      <div class="container">
          <div class="row">
            <div class="col-6"><span class="text-muted bg-white">${dataPagination.pages} Pages of ${dataPagination.totalcount} Rows</span></div>
            <div class="col-6">
            <nav class="d-block text-right">`;
        elPagination += `<ul class="pagination d-inline-flex">`;
              if(dataPagination.currentpage == 1){ elPagination += `<li class="page-item disabled"><a class="page-link" onclick="${this.instName}.pageClick('${dataPagination.prevpage}')" tabindex="-1">Previous</a></li>`;} 
              else { elPagination += `<li class="page-item"><a class="page-link" onclick="${this.instName}.pageClick('${dataPagination.prevpage}')" tabindex="-1">Previous</a></li>`;}
              for(var i=dataPagination.startpage; i <= dataPagination.endpage; i++) {
                if(dataPagination.currentpage == i ){ elPagination += `<li class="page-item active"><a class="page-link" onclick="${this.instName}.pageClick('${i}')">${i}</a></li>`; }
                else { elPagination += `<li class="page-item"><a class="page-link" onclick="${this.instName}.pageClick('${i}')">${i}</a></li>`; } 
              }      
              elPagination += `<li class="page-item"><a class="page-link" onclick="${this.instName}.pageClick('${dataPagination.nextpage}')">Next</a></li>`;
              elPagination += "</ul>";
        elPagination += `</nav>
            </div>
          </div>
        </div>`;    
    }
    document.getElementById(this.tblPaginationTarget).innerHTML = elPagination;        
  }
  search(e){
    if (e.key === 'Enter' || e.keyCode === 13) { this.pageClick(1);  }
  }
  onSearch(){
    this.pageClick(1); 
  }
  export(){
    var searchData = [];
    var elSearchs = document.querySelectorAll(`.${this.instName}-searchFilter`);
    [].forEach.call(elSearchs, function (elSearch) {
      var dataElSearch = `[${elSearch.getAttribute("data-field").split(",").map(item=>`"${item}"`).join(",")}]`;
      var searchValue = JSON.stringify({
        "value":elSearch.value,"field":dataElSearch,"type":elSearch.getAttribute("data-type"),"operator":elSearch.getAttribute("data-operator")
      });           
      searchData.push(`${elSearch["name"]}=${searchValue}`);
    });      
    var exportUrl = `${this.exportData.url}?${searchData.join("&")}`;  
    window.open(exportUrl);
  }      
};
class Table_xtsblM extends PageList {
    constructor(instName,accessAction) {
        super(instName,"/import_datas",accessAction,"import_datas","import_datasPagination",{},{url:"/import_data/edit",target:""}, 
        {},["data.table_name","data.import_by_name","moment(data.import_date).format('<%=dateFormat%>')","data.import_status==0?'Success':'Failed'","data.message"], "", "tbl-xtsblM", "tbl-xtsblM-pagination");
    }
    pagination(){super.pagination();}
    pageClick(page){if(page==undefined){page=1;}super.pageClick(page);}
    render(data) {super.render(data);}
    pagination(dataPagination){super.pagination(dataPagination);}
    search(e){super.search(e);}
    export(){super.export();}
}
class Table_NGFllA extends PageList {
    constructor(instName,accessAction) {
        super(instName,"/organization/departmentpage",accessAction,"org_departments","org_departmentsPagination",{url:"/organization/department/delete",message:"Are you sure delete data '{data.name}' ?"},{url:"/organization/department/edit?location={param.location}&id={data.id}",target:""}, 
        {},["data.name","data.address"], "", "tbl-NGFllA", "tbl-NGFllA-pagination");
    }
    pagination(){super.pagination();}
    pageClick(page){if(page==undefined){page=1;}super.pageClick(page);}
    render(data) {super.render(data);}
    pagination(dataPagination){super.pagination(dataPagination);}
    search(e){super.search(e);}
    export(){super.export();}
}
class Table_SqVFFZ extends PageList {
    constructor(instName,accessAction) {
        super(instName,"/organization/locationpage",accessAction,"org_locations","org_locationsPagination",{url:"/organization/location/delete",message:"Are you sure delete data '{data.name}' ?"},{url:"/organization/location/edit?location={data.id}",target:""}, 
        {},["data.name","data.address"], "", "tbl-SqVFFZ", "tbl-SqVFFZ-pagination");
    }
    pagination(){super.pagination();}
    pageClick(page){if(page==undefined){page=1;}super.pageClick(page);}
    render(data) {super.render(data);}
    pagination(dataPagination){super.pagination(dataPagination);}
    search(e){super.search(e);}
    export(){super.export();}
}
class Table_hqFTKx extends PageList {
    constructor(instName,accessAction) {
        super(instName,"/organization/teampage",accessAction,"org_teams","org_teamsPagination",{url:"/organization/team/delete",message:"Are you sure delete data '{data.name}' ?"},{url:"/organization/team/edit?location={param.location}&id={data.id}",target:""}, 
        {},["data.name","data.address"], "", "tbl-hqFTKx", "tbl-hqFTKx-pagination");
    }
    pagination(){super.pagination();}
    pageClick(page){if(page==undefined){page=1;}super.pageClick(page);}
    render(data) {super.render(data);}
    pagination(dataPagination){super.pagination(dataPagination);}
    search(e){super.search(e);}
    export(){super.export();}
}
class Table_DEsAim extends PageList {
    constructor(instName,accessAction) {
        super(instName,"/user/rolebasepage",accessAction,"user_role_bases","user_role_basesPagination",{url:"/user/rolebase/delete",message:"Are you sure delete data '{data.name}' ?"},{url:"/user/rolebase/edit?role={data.id}",target:""}, 
        {},["data.name"], "", "tbl-DEsAim", "tbl-DEsAim-pagination");
    }
    pagination(){super.pagination();}
    pageClick(page){if(page==undefined){page=1;}super.pageClick(page);}
    render(data) {super.render(data);}
    pagination(dataPagination){super.pagination(dataPagination);}
    search(e){super.search(e);}
    export(){super.export();}
}
class Table_nLbfqv extends PageList {
    constructor(instName,accessAction) {
        super(instName,"/userpage",accessAction,"users","usersPagination",{url:"/user/delete",message:"Are you sure delete data '{data.user_name}' ?"},{url:"/user/edit?user={data.id}",target:""}, 
        {},["data.user_code","data.user_name","data.address"], "", "tbl-nLbfqv", "tbl-nLbfqv-pagination");
    }
    pagination(){super.pagination();}
    pageClick(page){if(page==undefined){page=1;}super.pageClick(page);}
    render(data) {super.render(data);}
    pagination(dataPagination){super.pagination(dataPagination);}
    search(e){super.search(e);}
    export(){super.export();}
}
function printExternal(url) {
	var printWindow = window.open( url, 'Print');
	printWindow.addEventListener('load', function() {
		if (Boolean(printWindow.chrome)) {
			printWindow.print();
			setTimeout(function(){
				printWindow.close();
			}, 500);
		} 
		else {
			printWindow.print();
			printWindow.close();
		}
    }, true);
}
Number.prototype.formatCurrency = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

