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

    com.post(api.ds.personel, {}, function(res){
        com.focusPage("#performanceType").bindData(res.perType, "key", "value");
        $.each(res.perType,function (i,val) {
            performanceType[val.key] = val.value;
        });
        com.focusPage("#performanceLevel").bindData(res.level, "key", "value");
        $.each(res.level,function (i,val) {
            performanceLevel[val.key] = val.value;
        });
    }, null, false);

    com.initTypeahead('users', api.personel.queryUserByPinyin, "pinyinName", {"departmentType.name":"", "user.status":0}, "autoFillKeyValue", "key", "value", null);

    com.datetime(com.focusPage("#startTime"));
    com.datetime(com.focusPage("#endTime"));

    var displayFunc = (function () {
        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.user.userName));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
                    var type = {
                        "0": "任务",
                        "1": "代码",
                        "2": "文档",
                        "3": "测试用例",
                        "4": "bug",
                        "5": "延期",
                        "6": "失误",
                        "7": "考勤",
                        "8": "加班"
                    };
                    var level = {
                        "0": "低级",
                        "1": "中级",
                        "2": "高级"
                    };
                    var propertyArr = [
                        ["员工:", v.user.userName, "grey"],
                        ["类型:", type[v.type], "grey"],
                        ["得分:", v.value, "grey"],
                        ["等级:", level[v.level], "grey"],
                        ["开始时间:", v.startTime, "grey"],
                        ["结束时间:", v.endTime, "grey"],
                        ["工作:", v.work, "grey"],
                        ["说明:", v.content, "grey"]
                    ];

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $divBtnWrap.appendTo($h3);

                    $liLine.append($h3).append($ulProperty).appendTo($ul);

                });
                $ul.appendTo($tableWrap);
            }
        };
        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        }
    })();

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

    var _condArr = ['userName', 'performanceType', 'performancestartTime', "performanceendTime"];

    var performanceSeacher = new Searcher();

    performanceSeacher.init(_condArr, "condList", api.personel.pagePerformance, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "selectUser", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addperformance').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });
    com.focusPage('[name="addperformance"]', '#pagenation').on("click", function () {  // 选择器 [属性名="属性值"] 匿名函数
        
        performance.modal.modal("show");
    });
});