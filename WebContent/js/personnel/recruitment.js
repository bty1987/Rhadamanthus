jQuery(function($) {

    var recruitment = {

        rid : null,
        deptType: [],
        deptList: {},
        dutyTypeMap: {},
        loginFlag: true,

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", AddsaveData),
            cancelBtn: com.focusPage("#cancelBtn"),
            save: com.focusPage("#save").on("click",save),
            cancel: com.focusPage("#cancel"),
        },

        modals: {
            recruitmentModal: com.focusPage("#recruitmentModal"),
            enterModal: com.focusPage("#enterModal"),
        },


        items:{
            name : com.focusPage("#name", "#recruitmentModal"),
            identity : com.focusPage("#identity", "#recruitmentModal"),
            place : com.focusPage("#place", "#recruitmentModal"),
            phone : com.focusPage("#phone", "#recruitmentModal"),
            employWay : com.focusPage("#employWay", "#recruitmentModal"),
            education : com.focusPage("#education", "#recruitmentModal"),

            userName: com.focusPage("#userName", "#enterModal"),
            deptType: com.focusPage("#deptType", "#enterModal"),
            dept: com.focusPage("#dept", "#enterModal"),
            duty: com.focusPage("#duty", "#enterModal"),
        },

    };

    com.post(api.ds.personel, {}, function(res) {
        com.focusPage("#employWay").bindData(res.employWay, "key", "value");
        recruitment.employWay = res.employWay.split("key", "value");
        com.focusPage("#education").bindData(res.education, "key", "value");
        recruitment.education = res.education.split("key", "value");
        recruitment.status = res.status.split("key", "value");
    }, null, false);

    com.post(api.communion.queryDepartmentType, {}, function(res){
        recruitment.deptType = res.departmentTypes;
    }, null, false);

    recruitment.items.deptType.bindData(recruitment.deptType, "dtid", "name");

    recruitment.modals.recruitmentModal.on('show.bs.modal',function(e){
        com.cleanItems(recruitment.items);
        com.clearValidator();
    });

    recruitment.modals.enterModal.on('show.bs.modal',function(e){
        com.cleanItems(recruitment.items);
        com.clearValidator();
    });

    recruitment.items.userName = com.focusPage("#userName");
    recruitment.items.deptType = com.focusPage("#deptType");
    recruitment.items.dept = com.focusPage("#dept");
    recruitment.items.duty= com.focusPage("#duty");
    
    recruitment.items.deptType.on("change", function(b, d) {
        
        com.post(api.communion.queryDepartmentByDtid, {"dept.type.dtid": $(this).val()}, function(res) {
            recruitment.items.dept.bindData(res.deptList, "did", "name");
            d && d();
        });
        
        com.post(api.system.queryDutyByDtid,{"duty.departmentType.dtid" :$(this).val()},function(res){
            recruitment.dutyTypeMap = res.dutys;
            recruitment.items.duty.bindData(recruitment.dutyTypeMap,"did","name");
        });
        
    }).trigger("change");

    recruitment.items.userName.on("blur", function() {
        "" ==  recruitment.items.userName.val().trim() ? (com.showTip(com.focusPage("#userName","#enterModal"), "用户名不能为空", "right"), recruitment.loginFlag = false) : com.post(api.personel.queryUserByLoginId, {
            "user.loginId": recruitment.items.userName.val()
        }, function(res) {
            recruitment.loginFlag = false;
            com.showTip(com.focusPage("#userName","#enterModal"), "用户名已存在", "right");
        }, function(res){
            recruitment.loginFlag =true;
        });
    });

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.personel.pageRecruitment);

    searcher.condition(["personel-name","personel-identity","personel-phone","personel-status"]);

    searcher.button([{id: "addRecruitment", name: "添加", clazz: "btn-primary", icon: "icon-plus"}]);

    var lineprops = [
        {field: "name", name: "姓名", prop: "name", clazz: "grey"},
        {field: "identity", name: "身份证号", prop: "identity", clazz: "grey"},
        {field: "place", name: "地址", prop: "place", clazz: "grey"},
        {field: "phone", name: "电话", prop: "phone", clazz: "grey"},
        {field: "employWay", name: "应聘方式", prop: "employWay", clazz: "red", dataset: recruitment.employWay},
        {field: "education", name: "学历", prop: "education", clazz: "red", dataset: recruitment.education},
        {field: "status", name: "状态", prop: "status", clazz: "red", dataset: recruitment.status},
    ];

    //字段上的功能按钮
    var linebtns = [
        {name: "查看", clazz: "btn-blue", handle: function (v) {
                params['rid'] = v.rid;
                com.popup4page("#layerPopUp", "/views/personnel/selectRecruitment.html", "查看 ");
                return false;
            },show: function(v){
                return (v.status !=2);
            }
        },
        {name: "入职", clazz: "btn-yellow", handle: function(v){
            recruitment.modals.enterModal.modal("show");
            recruitment.rid=v.rid;
                return false;
            },show: function(v){
                return (v.status == 0);
            }
        },
        {name: "编辑", clazz: "btn-success", handle: function (v) {
                params['rid'] = v.rid;
                com.popup4page("#layerPopUp", "/views/personnel/updateRecruitment.html", "编辑",  null,function (){
                    searcher.doSearch();
                });
                return false;
            },show: function(v){
                return (v.status == 0);
            }
        },
        {name: "教育信息", clazz: "btn-yellow", handle: function (v) {
                params['rid'] = v.rid;
                com.popup4page("#layerPopUp", "/views/personnel/recruitmentEducation.html", "教育信息");
                return false;
            },show: function(v){
                return (v.status == 0);
            }
        },
        {name: "工作信息", clazz: "btn-pink", handle: function (v) {
                params['rid'] = v.rid;
                com.popup4page("#layerPopUp", "/views/personnel/recruitmentOperation.html", "工作信息");
                return false;
            },show: function(v){
                return (v.status == 0);
            }
        },
        {name: "作废", clazz: "btn-inverse", handle: function(v){
            com.post(api.personel.cancelRecruitment, {"recruitment.rid": v.rid}, function(v){
                com.showAlert(com.info, "作废成功");
                    searcher.doSearch();
                });
                return false;
            }, show: function(v){
                return(v.status == 0);
            }
        },
    ];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#addRecruitment' , '#pagenation').on("click",function(){

        recruitment.rid = null;

        recruitment.modals.recruitmentModal.modal("show");
        
    });
    //添加
    function AddsaveData(){

        if(com.validate('addRecruitment'))  return false;

        var url = api.personel.addRecruitment;

        var options = {
            "recruitment.name" : recruitment.items.name.val(),
            "recruitment.identity" : recruitment.items.identity.val(),
            "recruitment.place" : recruitment.items.place.val(),
            "recruitment.phone" : recruitment.items.phone.val(),
            "recruitment.employWay" : recruitment.items.employWay.val(),
            "recruitment.education" : recruitment.items.education.val(),
        };

        com.post(url, options, function(){
            searcher.doSearch();
            recruitment.modals.recruitmentModal.modal("hide");
        });
    }
    
    //弹窗
    function save(){

        com.post(api.personel.queryRecruitmentByRid, {"recruitment.rid": recruitment.rid}, function(v){
            saveData(v);
        });  

    }

    //入职
    function saveData(v) {

        if(com.validate("enterModal") || !recruitment.loginFlag){
            return false;
        }

        var options = {

            "userInfo.salary": '0',
            "userInfo.gender": 1,
            "userInfo.level": 0,
            "userInfo.user.loginId": recruitment.items.userName.val().trim(),
            "userInfo.fangliner.userId": "",

            "userInfo.user.currentName": v.recruitment.name,
            "userInfo.user.userName":  v.recruitment.name,
            "userInfo.user.dept.type.dtid": recruitment.items.deptType.val(),
            "userInfo.user.dept.did": recruitment.items.dept.val(),
            "userInfo.user.duty.did": recruitment.items.duty.val(),

            "userInfo.user.phone": v.recruitment.phone,
            "userInfo.user.identity" : v.recruitment.identity,
            "userInfo.height" : v.recruitment.height,
            "userInfo.weight" : v.recruitment.weight,
            "userInfo.nation" : v.recruitment.nation,
            "userInfo.phone" : v.recruitment.phone,
            "userInfo.hometownPlace" : v.recruitment.hometownPlace,
            "userInfo.qq" : v.recruitment.qq,
            "userInfo.wechat" : v.recruitment.wechat,
            "userInfo.email" : v.recruitment.email,
            "userInfo.employWay" : v.recruitment.employWay,
            "userInfo.political" : v.recruitment.political,
            "userInfo.householdType" : v.recruitment.householdType, 
            "userInfo.education" : v.recruitment.education,
            "userInfo.address" : v.recruitment.address,
            "userInfo.hometownAddress" : v.recruitment.place,
            "userInfo.specialty" : v.recruitment.specialty,
            "userInfo.emergencyMan" : v.recruitment.emergencyMan,
            "userInfo.emergencyPhone" : v.recruitment.emergencyPhone,
            "userInfo.isMarried" : v.recruitment.isMarried,
            "userInfo.isBirth" : v.recruitment.isBirth,
            "userInfo.isCarLoan" : v.recruitment.isCar,
            "userInfo.isHouseLoan" : v.recruitment.isHouseLoan,
            "userInfo.isCarID" : v.recruitment.isCarID,
            "userInfo.isPassID" : v.recruitment.isPassID,
            "userInfo.isHMID" : v.recruitment.isHMID,
            "userInfo.isTWID" : v.recruitment.isTWID,

        };

    com.post(api.personel.queryRecruitmentEducation, {"recruitmentEducation.rid": recruitment.rid}, function(v){

        $.each(v.recruitmentEducations, function (i,v) {
            options['userEducations['+i+'].organ'] = v.organ;
            options['userEducations['+i+'].certificate'] = v.certificate;
            options['userEducations['+i+'].beginTime'] = v.beginTime;
            options['userEducations['+i+'].endTime'] = v.endTime;
            options['userEducations['+i+'].createTime'] = v.createTime;
            options['userEducations['+i+'].specialty'] = v.specialty;
            options['userEducations['+i+'].content'] = v.content;
        });
    }, null, false);

    com.post(api.personel.queryRecruitmentOperation, {"recruitmentOperation.rid": recruitment.rid}, function(v){
    	
         $.each(v.recruitmentOperations, function (i,v) {
              options['userOperations['+i+'].company'] = v.company;
              options['userOperations['+i+'].trade'] = v.trade;
              options['userOperations['+i+'].duty'] = v.duty;
              options['userOperations['+i+'].beginTime'] = v.beginTime;
              options['userOperations['+i+'].endTime'] = v.endTime;
              options['userOperations['+i+'].createTime'] = v.createTime;
              options['userOperations['+i+'].specialty'] = v.specialty;
              options['userOperations['+i+'].salary'] = v.salary;
              options['userOperations['+i+'].comment'] = v.comment;
          });  
    }, null, false);

        com.post(api.personel.addUser, options, function(res){

            com.showAlert(com.info, "入职成功");

            com.post(api.personel.entryRecruitment, {"recruitment.rid": v.recruitment.rid},function(res){
                recruitment.modals.enterModal.modal("hide");
                searcher.doSearch();
            });
        });
    }
});

