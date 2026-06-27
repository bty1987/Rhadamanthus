$(function () {
    var performanceType = {};
    var performanceLevel = {};
    var performance = {
        saveBtn: null,
        cancelBtn: null,
        viewDeployedBtn: null,
        modal: null,
        items:{},
        editFlg: false,
        nodeId: null
    };
    performance.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
    performance.cancelBtn = com.focusPage("#cancelBtn");
    performance.items.users  = com.focusPage("#users");
    performance.items.performanceType = com.focusPage("#performanceType");
    performance.items.performanceLevel = com.focusPage("#performanceLevel");
    performance.items.values = com.focusPage("#values");
    performance.items.startTime = com.focusPage("#startTime");
    performance.items.endTime = com.focusPage("#endTime");
    performance.items.work = com.focusPage("#work");
    performance.items.content = com.focusPage("#content");

    performance.modal = com.focusPage("#performanceModal");
    performance.modal.on('hide.bs.modal',function(e){
		com.cleanTypeahead("users");
        com.cleanItems(performance.items);
        com.closeTip();
    });
    
    com.focusPage("#performanceType").bindData(constant.personel().performance.type.datas, "key", "value");
    $.each(constant.personel().performance.type.datas,function (i,val) {
        performanceType[val.key] = val.value;
    });
    com.focusPage("#performanceLevel").bindData(constant.personel().performance.level.datas, "key", "value");
    $.each(constant.personel().performance.level.datas,function (i,val) {
        performanceLevel[val.key] = val.value;
    });

    com.initTypeahead('users', api.personel.queryUserByPinyin, "pinyinName", {"departmentType.name":"", "user.status":0}, "autoFillKeyValue", "key", "value", null);

    com.datetime(com.focusPage("#startTime"));
    com.datetime(com.focusPage("#endTime"));

    var lineprops = (function() {

        return [{
            field: "user.userName",
            name: "员工",
            prop: "user.userName",
            clazz: "grey"
        }, {
            field: "type",
            name: "类型",
            prop: function(v) { return performanceType[v.type]; },
            clazz: "grey"
        }, {
            field: "value",
            name: "得分",
            prop: "value",
            clazz: "grey"
        }, {
            field: "level",
            name: "等级",
            prop: function(v) { return performanceLevel[v.level]; },
            clazz: "grey"
        }, {
            field: "startTime",
            name: "开始时间",
            prop: "startTime",
            clazz: "grey"
        }, {
            field: "endTime",
            name: "结束时间",
            prop: "endTime",
            clazz: "grey"
        }, {
            field: "work",
            name: "工作",
            prop: "work",
            clazz: "grey"
        }, {
            field: "content",
            name: "说明",
            prop: "content",
            clazz: "grey"
        }];
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addperformance').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var performanceSeacher = new Searcher();

    performanceSeacher.set("condList", "pagenation", "resultList", api.personel.pagePerformance, null, ['personel-userName', 'personel-performance-type', 'personel-performance-startTime', "personel-performance-endTime"], "selectUser", null, false, buttons);
    performanceSeacher.line("user.userName", lineprops, {}).render();

    function saveData(){
        if(com.validate('performanceModal')){
            return false;
        }
        if (performance.items.startTime.val()>=performance.items.endTime.val()){
            com.showAlert(com.warning, "开始时间应小于结束时间!");
            return
        }
        var options = {
            "performance.user.userId": com.typeahead("users"),
            "performance.type": performance.items.performanceType.val(),
            "performance.value": performance.items.values.val(),
            "performance.level": performance.items.performanceLevel.val(),
            "performance.startTime": performance.items.startTime.val(),
            "performance.endTime": performance.items.endTime.val(),
            "performance.work": performance.items.work.val(),
            "performance.content": performance.items.content.val()
        };
        com.post(api.personel.addPreformance, options, function(res){
            performanceSeacher.doSearch();
            com.showAlert(com.info, "添加成功");
        });
        performance.modal.modal("hide");
    }

    var _condArr = ['personel-userName', 'personel-performance-type', 'personel-performance-startTime', "personel-performance-endTime"];

    com.focusPage('[name="addperformance"]', '#pagenation').on("click", function () {  // 选择器 [属性名="属性值"] 匿名函数

        performance.modal.modal("show");
    });
});