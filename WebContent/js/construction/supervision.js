$(function () {

    var constructionNodes = {

        constructionSchedule: {},

        modals:{
            constructionInfoModal : com.focusPage("#constructionInfoModal")
        },

        btns: {
            saveBtn: com.focusPage("#saveBtn")
        },

        items: {

            ishovel  : com.focusPage("#ishovel"),
            iskey  : com.focusPage("#iskey"),
            timeLimit : com.focusPage("#timeLimit"),
            finishTime : com.focusPage("#finishTime"),
            keyTime : com.focusPage("#keyTime"),
            drawlineTime : com.focusPage("#drawlineTime"),
            isCeremony  : com.focusPage("#isCeremony"),
            comment   : com.focusPage("#comment")
        }

    };

    constructionNodes.btns.saveBtn.bindClick(saveData);

    constructionNodes.modals.constructionInfoModal.on("hide.bs.modal", function(){

        com.cleanItems(constructionNodes.items);
        com.closeTip();
    });

    com.datetime(constructionNodes.items.finishTime);
    com.datetime(constructionNodes.items.keyTime);
    com.datetime(constructionNodes.items.drawlineTime);

    com.post(api.ds.construction, {}, function (res) {
        
        constructionNodes.constructionSchedule = res.constructionSchedule.split("key", "value");

        constructionNodes.items.ishovel.bindData(res.isHovel, "key", "value", false);
        constructionNodes.items.iskey.bindData(res.isKey, "key", "value", false);
        constructionNodes.items.isCeremony.bindData(res.isCeremony, "key", "value", false);

    }, null, false);

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId).empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {

            var that = this;
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnInfo = $('<a></a>').addClass('btn btn-minier btn-yellow').html("信息");
            var $btnView = $('<a></a>').addClass('btn btn-minier btn-success').html("查看");
            var $btnAddReduce = $('<a></a>').addClass('btn btn-minier btn-warning').html('增减项');
            var $btnRe = $('<a></a>').addClass('btn btn-minier btn-inverse').html('返工');
            var $btnMoney = $('<a></a>').addClass('btn btn-minier btn-info').html('扣款');

            var propertyArr = [
                ["楼盘名:", v.house.village.name + " " + v.house.houseNumber, "grey"],
                ["设计师:", v.designer.userName, "grey"],
                ["监理:", v.supervisor ? v.supervisor.userName : "", "grey"],
                ["总价:", v.orderTotalPrice, "blue"],
                ["面积:", v.house.buildArea, "blue"],
                ["进度:", constructionNodes.constructionSchedule[v.projectStatus], "red"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnInfo).append($btnView).append($btnAddReduce).append($btnRe).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnView.click(function () {
                viewSupervisionDetail(v.orderId);
            });

            $btnInfo.click(function(){
                viewConstructionInfo(v.orderId);
            });

            $btnAddReduce.click(function () {
                viewAddReduceIndex(v.orderId, v.type);
            });

            $btnRe.click(function () {
                viewReworkIndex(v.orderId);
            });

            $btnMoney.click(function () {
                viewDelGold(v.orderId);
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        }
    })();

    var seacher = new Searcher();

    seacher.init(['c_orderId', 'c_village', 'c_houseNumber', 'c_designer', 'c_schedule', 'c_projectStatusFlag'], "supervisionCondList", api.construction.pageConstruction, function (list) {
        displayFunc.init('supervisionResultList', list);
    }, "supervisionPagenation", "supervisionSeacherPostData", null, false, null, null, "supervisionResultList");

    function viewSupervisionDetail(orderId) {
        params.orderId = orderId;
        com.popup4page("#stockRecordPopUp","/views/construction/supervisionDetail.html","查看");
    }

    function viewAddReduceIndex(orderId, type) {
        params.decorationOrderId = orderId;
        params.decorationOrderType = type;
        params.historyPage = api.index.supervisionIndex.url;
        com.switchPage(api.index.addReduceIndex.url);
    }

    function viewReworkIndex(orderId) {
        params.orderId = orderId;
        com.popup4page("#stockRecordPopUp","/views/construction/supervisionRework.html","返工");
    }

    function viewDelGold(orderId) {
        params['decorationOrderId'] = orderId;
        params['auditStatusType'] = 'select';
        com.popup4page("#stockRecordPopUp","/views/decoration/audit4record.html","扣款")
    }

    function viewConstructionInfo(orderId) {

        com.post(api.construction.queryConstructionInfoByOrderId, {"constructionInfo.orderId": orderId}, function (res) {

            data = res.constructionInfo;

            constructionNodes.items.orderId = orderId;
            constructionNodes.items.ishovel.val(data.ishovel);
            constructionNodes.items.iskey.val(data.iskey);
            constructionNodes.items.isCeremony.val(data.isCeremony);
            constructionNodes.items.timeLimit.val(data.timeLimit);
            if(data.finishTime != null){
                constructionNodes.items.finishTime.val(data.finishTime.substr(0,10));
            }
            if(data.keyTime != null){
                constructionNodes.items.keyTime.val(data.keyTime.substr(0,10));
            }
            if(data.drawlineTime != null){
                constructionNodes.items.drawlineTime.val(data.drawlineTime.substr(0,10));
            }
            constructionNodes.items.comment.val(data.comment);
        });

        constructionNodes.modals.constructionInfoModal.modal("show");
    }

    function saveData() {

        var options = {
            "constructionInfo.orderId" : constructionNodes.items.orderId,
            "constructionInfo.timeLimit" : constructionNodes.items.timeLimit.val(),
            "constructionInfo.ishovel": constructionNodes.items.ishovel.val(),
            "constructionInfo.iskey": constructionNodes.items.iskey.val(),
            "constructionInfo.isCeremony" : constructionNodes.items.isCeremony.val(),
            "constructionInfo.finishTime" : constructionNodes.items.finishTime.val() + " 00:00:00",
            "constructionInfo.keyTime" : constructionNodes.items.keyTime.val() + " 00:00:00",
            "constructionInfo.drawlineTime" : constructionNodes.items.drawlineTime.val() + " 00:00:00",
            "constructionInfo.comment": constructionNodes.items.comment.val()
        };

        com.post(api.construction.updateConstructionInfoByOrderId, options, function (res) {

            com.showAlert(com.info,"操作成功");

            constructionNodes.modals.constructionInfoModal.modal("hide");
        });
    }

});
