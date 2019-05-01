
$(function(){

    var statusDict = { "0" : ["\u6709\u6548", "red"], "1" : ["\u65e0\u6548", "red"]};
    var activity = {
        saveBtn: com.focusPage("#saveBtn").on("click", saveData),
        cancelBtn: com.focusPage("#cancelBtn").on("show.bs.modal", function(a){
            com.clearValidator();
        }),
        modal: com.focusPage("#activityModal"),
        items: {
            activityName : com.focusPage("#activityName"),
            startTime : com.focusPage("#startTime"),
            endTime : com.focusPage("#endTime"),
            types : com.focusPage("#type"),
            content : com.focusPage("#content")
        },
        editFlg: !1,
        postParam: {}
    };

    com.focusPage("#activityModal").on('show.bs.modal',function(e){
        com.clearValidator();
    });

    bindingisType("type");

    $.extend(com.validator, activity.validator);
    com.focusPage(".date-picker").datepicker({autoclose : !0}).on("show", function() {
        setTimeout(function() {
            com.focusPage(".dropdown-menu").css("z-index", 1060);
        },0);
    }).next().on(ace.click_event, function() {
        $(this).prev().focus();
    });

    var displayFunc  = (function(){


        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId).empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnDelStatus = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');
            var $default = $('<a></a>').addClass('btn btn-minier btn-warning').html('默认');
            var $btnView = $('<a></a>').addClass('btn btn-minier btn-inverse').html("\u6d3b\u52a8\u7269\u54c1");// 活动物品

            //状态启用禁用
            var $invalid = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
            var $span = $('<span></span>').addClass('lbl status-lbl');

            var propertyArr = [
                ["创建人:", v.creater.currentName, "grey"],
                ["开始时间:", v.startTime, "green"],
                ["结束时间:", v.endTime, "green"],
                ["状态:", statusDict[v.status][0], statusDict[v.status][1]],
                ["类型:",v.type == 0 ? "装修" : "主材","red" ],
                ["默认标识:",v.defaults == 0 ? "默认" : "普通", "grey" ],
                ["说明:",v.content, "grey"]
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

                $invalid.append($statusSwitch).append($span);
                $divBtnWrap.append($btnEdit).append($btnView).append($invalid).append($btnDelStatus).append($default).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function(){
                activity.editFlg = !0;
                var a = v;
                void 0 != a && (activity.items.aid = a.aid, activity.items.status = a.status, activity.items.activityName.val(a.name), activity.items.startTime.val(a.startTime).attr("disabled", "disabled"),activity.items.types.val(a.type).attr("disabled", "disabled"), activity.items.endTime.val(a.endTime),activity.items.content.val(a.content), activity.modal.modal("show"));
            });

            $btnDelStatus.click(function(){
                com.post(api.information.updateActivityForStatus, {
                    "activity.aid": v.aid,
                    "activity.status": 2
                }, function(res){
                    ActivitySeacher.doSearch();
                });
            });
            !v.status && $statusSwitch.prop("checked", true);
            $default.click(function(){

                if(v.defaults == 0){
                    com.showAlert(com.warning, "该活动已是默认活动！！！！！！！！！!");
                    return
                }
                com.post(api.information.updateActivityForDefault, {
                    "activity.aid": v.aid
                }, function(res){
                    ActivitySeacher.doSearch();
                });
            });
            $invalid.click(function(){
                var cvalue = $statusSwitch.prop("checked");
                if(cvalue){
                    cvalue = 0;
                }else{
                    cvalue = 1;
                }
                updatastatus(v.aid, cvalue);
            });
            $btnView.click(function(){
                viewActivityItemIndex(v);
            });

            return $liLine;
        };

        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();

    var _condArr = ['activityName', 'activityType', 'activityStatus'];
    var ActivitySeacher = new Searcher();
    ActivitySeacher.init( _condArr, "condList", api.information.pageActivity, function(list){
        displayFunc.init('resultList', list);
    }, "pagenation", "activitySeacherPostData", null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addVillage').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function(){
            activity.editFlg = !1;
            com.cleanItems(activity.items);
            activity.items.activityName.removeAttr("disabled", "disabled");
            activity.items.startTime.removeAttr("disabled", "disabled");
            activity.items.types.removeAttr("disabled", "disabled");
            activity.modal.modal("show");
        });
        return [$adda];
    });


    function viewActivityItemIndex(v) {
        params.aid = v.aid;
    	params.activityName = v.name;
        com.focusPage("#activityPageContent").load(api.index.activityItemIndex.url);

    }

    function bindingisType(idName) {
        com.post(api.ds.information, {}, function (res) {
            com.focusPage("#" + idName).bindData(res.activityTypes, "key", "value", true)
        });
    }
    function saveData() {
        if (!com.validate() && !activity.repeatFlg) {

            var a = activity.items.startTime.val(),
                b = activity.items.endTime.val();
            a > b ? com.showAlert(com.warning, "\u5f00\u59cb\u65f6\u95f4\u4e0d\u80fd\u5927\u4e8e\u7ed3\u675f\u65f6\u95f4") : (b = {
                "activity.name": activity.items.activityName.val(),
                "activity.startTime": activity.items.startTime.val(),
                "activity.endTime": String(activity.items.endTime.val()).substring(0,10)+ " 23:59:59",
                "activity.type" : activity.items.types.val(),
                "activity.content": activity.items.content.val()
            },
                activity.editFlg ? (a = api.information.updateActivity, b["activity.aid"] = activity.items.aid): a = api.information.addActivity, com.post(a, b, successCallback), activity.modal.modal("hide"));
        }
    }
    function successCallback() {
        com.showAlert(com.info, "\u64cd\u4f5c\u6210\u529f");
        ActivitySeacher.doSearch();
    }
    function updatastatus(aid, newstatus){
        var options = {};
        options[ "activity.aid"] = aid;
        options["activity.status"] = newstatus;

        com.post(api.information.updateActivityForStatus, options, function(res){
            ActivitySeacher.doSearch();
        })
    }
});