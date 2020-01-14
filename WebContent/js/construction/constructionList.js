$(function () {

    var constructionList = {

        constructionListSchedule: {},

        modals:{
            constructionInfoModal : com.focusPage("#constructionInfoModal")
        },

        btns: {
            saveBtn: com.focusPage("#saveBtn")
        },

        items: {

            ishovel  : com.focusPage("#ishovel"),
            iskey  : com.focusPage("#iskey"),
            isCeremony  : com.focusPage("#isCeremony"),
            comment   : com.focusPage("#comment")
        },

        isAccessory : {},

    };

    constructionList.btns.saveBtn.bindClick(saveData);

    constructionList.modals.constructionInfoModal.on("hide.bs.modal", function(){

        com.cleanItems(constructionList.items);
        com.closeTip();
    });

    com.post(api.ds.construction, {}, function (res) {

        constructionList.constructionListSchedule = res.constructionSchedule.split("key", "value");
        constructionList.isAccessory = res.isAccessory.split("key", "value");

        constructionList.items.ishovel.bindData(res.isHovel, "key", "value", false);
        constructionList.items.iskey.bindData(res.isKey, "key", "value", false);
        constructionList.items.isCeremony.bindData(res.isCeremony, "key", "value", false);

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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.decoration.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnInfo = $('<a></a>').addClass('btn btn-minier btn-yellow').html("信息");
            var $btnView = $('<a></a>').addClass('btn btn-minier btn-success').html("查看");
            var $btnAddReduce = $('<a></a>').addClass('btn btn-minier btn-warning').html('增减项');
            var $btnRe = $('<a></a>').addClass('btn btn-minier btn-inverse').html('返工');
            var $btnMoney = $('<a></a>').addClass('btn btn-minier btn-info').html('扣款');
            var $btnAcs = $('<a></a>').addClass('btn btn-minier btn-purple').html('工程辅料');
            var $btnOpen = $('<a></a>').addClass('btn btn-minier btn-danger').html('辅料开启');
            var $btnLock = $('<a></a>').addClass('btn btn-minier btn-pink').html('辅料锁定');

            var propertyArr = [
                ["楼盘名:", v.decoration.house.village.name + " " + v.decoration.house.houseNumber, "grey"],
                ["设计师:", v.decoration.designer.userName, "grey"],
                ["监理:", v.decoration.supervisor ? v.decoration.supervisor.userName : "", "grey"],
                ["总价:", v.decoration.orderTotalPrice, "blue"],
                ["面积:", v.decoration.house.buildArea, "blue"],
                ["进度:", constructionList.constructionListSchedule [v.decoration.projectStatus], "red"],
                ["辅料额上限:", v.accessoryLimit, "blue"],
                ["工费额上限:", v.salaryLimit, "blue"],
                ["辅料总额:", v.accessoryTotal, "blue"],
                ["工费总额:", v.salaryTotal, "blue"],
                ["辅料控制:", constructionList.isAccessory[v.accessory], "red"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnInfo).append($btnView).append($btnAddReduce).append($btnRe).append($btnAcs).appendTo($h3);

            if(v.accessory == 1){
                $divBtnWrap.append($btnOpen);
            }else if(v.accessory == 0){
                $divBtnWrap.append($btnLock);
            }

            $liLine.append($h3).append($ulProperty);

            $btnView.click(function () {
                viewSupervisionDetail(v.decoration.orderId);
            });

            $btnInfo.click(function(){
                viewConstructionInfo(v.decoration.orderId);
            });

            $btnAddReduce.click(function () {
                viewAddReduceIndex(v.decoration.orderId, v.decoration.type);
            });

            $btnRe.click(function () {
                viewReworkIndex(v.decoration.orderId);
            });

            $btnAcs.click(function () {
                viewAccessory(v.cid);
            });

            $btnMoney.click(function () {
                viewDelGold(v.decoration.orderId);
            });

            $btnOpen.click(function () {
                accessoryOpen(v.cid);
            });

            $btnLock.click(function () {
                accessoryLock(v.cid);
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

    seacher.init(['c_orderId', 'c_village', 'c_houseNumber', 'c_designer', 'c_schedule', 'c_projectStatusFlag'], "constructionCondList", api.construction.pageConstructionForBase, function (list) {
        displayFunc.init('constructionResultList', list);
    }, "constructionPagenation", "constructionListPostData", null, false, null, null, "constructionResultList");

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

            constructionList.items.orderId = orderId;
            constructionList.items.ishovel.val(data.ishovel);
            constructionList.items.iskey.val(data.iskey);
            constructionList.items.isCeremony.val(data.isCeremony);
            constructionList.items.comment.val(data.comment);
        });

        constructionList.modals.constructionInfoModal.modal("show");
    }

    function viewAccessory (cid) {
        params['cid'] = cid;
        com.popup4page("#stockRecordPopUp","/views/construction/constructionAccessory.html","工程辅料")
    }

    function accessoryOpen(cid) {

        com.post(api.construction.openAccessory, {"construction.cid": cid}, function (res) {
            com.showAlert(com.info, "创建辅料单状态开启");
            seacher.doSearch();
        });
    }

    function accessoryLock(cid) {

        com.post(api.construction.lockAccessory, {"construction.cid": cid}, function (res) {
            com.showAlert(com.info, "创建辅料单状态锁定");
            seacher.doSearch();
        });
    }

    function saveData() {

        var options = {
            "constructionInfo.orderId" : constructionList.items.orderId,
            "constructionInfo.ishovel": constructionList.items.ishovel.val(),
            "constructionInfo.iskey": constructionList.items.iskey.val(),
            "constructionInfo.isCeremony": constructionList.items.isCeremony.val(),
            "constructionInfo.comment": constructionList.items.comment.val()
        };

        com.post(api.construction.updateConstructionInfoByOrderId, options, function (res) {

            com.showAlert(com.info,"操作成功");

            constructionList.modals.constructionInfoModal.modal("hide");
        });
    }

});
