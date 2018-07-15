
$(function(){

    var statusDict = { "0" : ["\u6709\u6548", "green"], "1" : ["\u65e0\u6548", "red"]};
    var activity = {
        saveBtn: $("#saveBtn").on("click", saveData),
        cancelBtn: $("#cancelBtn").on("show.bs.modal", function(a){
            com.clearValidator()
        }),
        modal: $("#activityModal"),
        items: {
            activityName : $("#activityName"),
            startTime : $("#startTime"),
            endTime : $("#endTime"),
        },
        editFlg: !1,
        postParam: {},
    };

    $("#activityModal").on('show.bs.modal',function(e){
        com.clearValidator();
    });
    
    $.extend(com.validator, activity.validator);
    $(".date-picker").datepicker({autoclose : !0}).on("show", function() {
        setTimeout(function() {
            $(".dropdown-menu").css("z-index", 1060);
        },0);
    }).next().on(ace.click_event, function() {
        $(this).prev().focus();
    });

    var displayFunc  = (function(){


        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId).empty();
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

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-primary').html('编辑');
            var $btnView = $('<a></a>').addClass('btn btn-minier btn-success').html("\u6d3b\u52a8\u7269\u54c1");// 活动物品


            var propertyArr = [
                ["创建人:", v.creater.currentName, "grey"],
                ["开始时间:", v.startTime, "grey"],
                ["结束时间:", v.endTime, "grey"],
                ["状态:", statusDict[v.status][0], statusDict[v.status][1]],
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });


            $divBtnWrap.append($btnEdit).append($btnView).appendTo($h3);

            $liLine.append($h3).append($ulProperty);


            $btnEdit.click(function(){
                activity.editFlg = !0;
                var a = v;
                void 0 != a && (activity.items.aid = a.aid, activity.items.status = a.status, activity.items.activityName.val(a.name).attr("disabled", "disabled"), activity.items.startTime.val(a.startTime).attr("disabled", "disabled"), activity.items.endTime.val(a.endTime), activity.modal.modal("show"))
            });

            $btnView.click(function(){
                viewActivityItemIndex(v);
            });


            return $liLine;
        };

        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();

    var _condArr = ['activityName', 'activityStatus'];
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
            activity.modal.modal("show")
        });

        return [$adda];
    });


    function viewActivityItemIndex(v) {
    	params.aid = v.aid;
    	params.activityName = v.name;
        $("#activityPageContent").load(api.index.activityItemIndex.url)
    }
    function saveData() {
        if (!com.validate() && !activity.repeatFlg) {
            var a = activity.items.startTime.val(),
                b = activity.items.endTime.val();
            a > b ? com.showAlert(com.warning, "\u5f00\u59cb\u65f6\u95f4\u4e0d\u80fd\u5927\u4e8e\u7ed3\u675f\u65f6\u95f4") : (b = {
                "activity.name": activity.items.activityName.val(),
                "activity.startTime": activity.items.startTime.val() + " 00:00:00",
                "activity.endTime": activity.items.endTime.val() + " 23:59:59",
                "activity.content": ""
            },
                activity.editFlg ? (a = api.information.updateActivity, b["activity.aid"] = activity.items.aid) : a = api.information.addActivity, com.post(a, b, successCallback), activity.modal.modal("hide"))
        }
    }
    function successCallback() {
        com.showAlert(com.info, "\u64cd\u4f5c\u6210\u529f");
        ActivitySeacher.doSearch();
    };



});