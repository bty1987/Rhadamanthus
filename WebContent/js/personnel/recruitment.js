jQuery(function($) {

    var recruitment = {

        rid : null,

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", AddsaveData),
            cancelBtn: com.focusPage("#cancelBtn"),
        },

        modals: {
            recruitmentModal: com.focusPage("#recruitmentModal"),
        },


        items:{
            name : com.focusPage("#name", "#recruitmentModal"),
            identity : com.focusPage("#identity", "#recruitmentModal"),
            place : com.focusPage("#place", "#recruitmentModal"),
            phone : com.focusPage("#phone", "#recruitmentModal"),
            employWay : com.focusPage("#employWay", "#recruitmentModal"),
            education : com.focusPage("#education", "#recruitmentModal"),
        },

        employWay:{
            0: "校园招聘",
            1: "网络招聘",
            2: "内部推荐",	
            3: "主动应聘",
            4: "猎头"
        },
        education:{
            0: "小学及以下",
            1: "初中",
            2: "中专",
            3: "高中",
            4: "大专 ",
            5: "本科",
            6: "研究生及以上",
        },
    };

    com.post(api.ds.personel, {}, function(res) {
		com.focusPage("#employWay").bindData(res.employWay, "key", "value");
		recruitment.employWay = res.employWay.split("key", "value");
	}, null, false);
    
    com.post(api.ds.personel, {}, function(res) {
		com.focusPage("#education").bindData(res.education, "key", "value");
		recruitment.education = res.education.split("key", "value");
	}, null, false);
    
    recruitment.modals.recruitmentModal.on('show.bs.modal',function(e){
        com.cleanItems(recruitment.items);
        com.clearValidator();
    });

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.personel.pageRecruitment);

    searcher.condition(["personel-name","personel-identity","personel-phone"]);

    searcher.button([{id: "addRecruitment", name: "添加", clazz: "btn-primary", icon: "icon-plus"}]);

    var lineprops = [
         {field: "name", name: "姓名", prop: "name", clazz: "grey"},
	     {field: "identity", name: "身份证号", prop: "identity", clazz: "grey"},
	     {field: "place", name: "地址", prop: "place", clazz: "grey"},
	     {field: "phone", name: "电话", prop: "phone", clazz: "grey"},
	     {field: "employWay", name: "应聘方式", prop: "employWay", clazz: "red", dataset: recruitment.employWay},
	     {field: "education", name: "学历", prop: "education", clazz: "red", dataset: recruitment.education},
    ];

    //字段上的功能按钮
    var linebtns = [
        {name: "查看", clazz: "btn-blue", handle: function (v) {
                params['rid'] = v.rid;
                com.popup4page("#layerPopUp", "/views/personnel/selectRecruitment.html", "查看 ");
                return false;
            }
        },
        {name: "入职", clazz: "btn-yellow", handle: function(v){
                com.post(api.personel.queryRecruitmentByRid, {"recruitment.rid": v.rid}, function(v){
                    saveData(v);
                });
                return false;
            }
        },
        {name: "编辑", clazz: "btn-success", handle: function (v) {
                params['rid'] = v.rid;
                com.popup4page("#layerPopUp", "/views/personnel/updateRecruitment.html", "编辑",  null,function (){
                    searcher.doSearch();
                });
                return false;
            }
        },
        {name: "教育信息", clazz: "btn-yellow", handle: function (v) {
                params['rid'] = v.rid;
                com.popup4page("#layerPopUp", "/views/personnel/recruitmentEducation.html", "教育信息");
                return false;
            }
        },
        {name: "工作信息", clazz: "btn-pink", handle: function (v) {
                params['rid'] = v.rid;
                com.popup4page("#layerPopUp", "/views/personnel/recruitmentOperation.html", "工作信息");
                return false;
            }
        },
    ];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#addRecruitment' , '#pagenation').on("click",function(){

        recruitment.rid = null;

        recruitment.modals.recruitmentModal.modal("show");
        
    });

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

    function saveData(v) {

        if(com.validate("simpleAddUserModal")){
            return false;
        }
   
        var options = {

            "userInfo.salary": '0',
            "userInfo.gender": 1,
            "userInfo.level": 0,
            "userInfo.user.dept.did":214,
            "userInfo.user.loginId": v.recruitment.name,
            "userInfo.user.duty.did": 1,
            "userInfo.fangliner.userId": "",

            "userInfo.user.currentName":  v.recruitment.name,
            "userInfo.user.userName": v.recruitment.name,
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
        com.post(api.personel.addUser, options, function(res){

             com.showAlert(com.info, "入职成功");

        });
    }
});

