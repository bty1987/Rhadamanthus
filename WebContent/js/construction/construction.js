jQuery(function ($) {

    var construction = {

        constructionSchedule: {},

        modals:{
            constructionInfoModal : com.focusPage("#constructionInfoModal"),
            updateConstructionModal: com.focusPage("#updateConstructionModal")
        },

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
            updateConstructionBtn: com.focusPage("#updateConstructionBtn"),
        },

        items: {
            ishovel  : com.focusPage("#ishovel"),
            iskey  : com.focusPage("#iskey"),
            timeLimit : com.focusPage("#timeLimit"),
            finishTime : com.focusPage("#finishTime"),
            keyTime : com.focusPage("#keyTime"),
            drawlineTime : com.focusPage("#drawlineTime"),
            designTime : com.focusPage("#designTime"),
            isCeremony  : com.focusPage("#isCeremony"),
            comment   : com.focusPage("#comment")
        },
        updateItems: {
            accessoryLimit : com.focusPage("#accessoryLimit"),
            salaryLimit : com.focusPage("#salaryLimit"),
        },
        cid : null,
        isAccessory : {},

    };

    construction.btns.saveBtn.bindClick(saveData);
    construction.btns.updateConstructionBtn.bindClick(update);

    construction.modals.constructionInfoModal.on("hide.bs.modal", function(){

        com.cleanItems(construction.items);
        com.closeTip();
    });

    construction.modals.updateConstructionModal.on("hide.bs.modal", function () {

        com.cleanItems(construction.updateItems);
        com.closeTip();
    });

    com.datetime(construction.items.finishTime);
    com.datetime(construction.items.keyTime);
    com.datetime(construction.items.drawlineTime);
    com.datetime(construction.items.designTime);

    com.post(api.ds.construction, {}, function (res) {

        construction.constructionSchedule = res.constructionSchedule.split("key", "value");
        construction.isAccessory = res.isAccessory.split("key", "value");

        construction.items.ishovel.bindData(res.isHovel, "key", "value", false);
        construction.items.iskey.bindData(res.isKey, "key", "value", false);
        construction.items.isCeremony.bindData(res.isCeremony, "key", "value", false);

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
            var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-yellow').html("更新");

            var propertyArr = [
                ["楼盘名:", v.decoration.house.village.name + " " + v.decoration.house.houseNumber, "grey"],
                ["设计师:", v.decoration.designer.userName, "grey"],
                ["监理:", v.decoration.supervisor ? v.decoration.supervisor.userName : "", "grey"],
                ["总价:", v.decoration.orderTotalPrice, "blue"],
                ["面积:", v.decoration.house.buildArea, "blue"],
                ["进度:", construction.constructionSchedule [v.decoration.projectStatus], "red"],
                ["辅料额上限:", v.accessoryLimit, "blue"],
                ["工费额上限:", v.salaryLimit, "blue"],
                ["辅料总额:", v.accessoryTotal, "blue"],
                ["工费总额:", v.salaryTotal, "blue"],
                ["辅料控制:", construction.isAccessory[v.accessory], "red"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnInfo).append($btnView).append($btnAddReduce).append($btnRe).append($btnAcs).append($btnUpdate).appendTo($h3);

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
                viewAccessory(v.cid,v.decoration.orderId);
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

            $btnUpdate.click(function () {
               construction.cid = v.cid;
               construction.updateItems.accessoryLimit.val(v.accessoryLimit);
               construction.updateItems.salaryLimit.val(v.salaryLimit);

               construction.modals.updateConstructionModal.modal("show");
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
    }, "constructionPagenation", "constructionPostData", null, false, null, null, "constructionResultList");

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

            construction.items.orderId = orderId;
            construction.items.ishovel.val(data.ishovel);
            construction.items.iskey.val(data.iskey);
            construction.items.isCeremony.val(data.isCeremony);
            construction.items.timeLimit.val(data.timeLimit);
            if(data.finishTime != null){
                construction.items.finishTime.val(data.finishTime.substr(0,10));
            }
            if(data.keyTime != null){
                construction.items.keyTime.val(data.keyTime.substr(0,10));
            }
            if(data.drawlineTime != null){
                construction.items.drawlineTime.val(data.drawlineTime.substr(0,10));
            }
            if(data.designTime != null){
                construction.items.designTime.val(data.designTime.substr(0,10));
            }
            construction.items.comment.val(data.comment);
        });

        construction.modals.constructionInfoModal.modal("show");
    }

    function viewAccessory (cid,orderId) {
        params['orderId'] = orderId;
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
            "constructionInfo.orderId" : construction.items.orderId,
            "constructionInfo.timeLimit" : construction.items.timeLimit.val(),
            "constructionInfo.ishovel": construction.items.ishovel.val(),
            "constructionInfo.iskey": construction.items.iskey.val(),
            "constructionInfo.isCeremony" : construction.items.isCeremony.val(),
            "constructionInfo.finishTime" : construction.items.finishTime.val() + " 00:00:00",
            "constructionInfo.keyTime" : construction.items.keyTime.val() + " 00:00:00",
            "constructionInfo.drawlineTime" : construction.items.drawlineTime.val() + " 00:00:00",
            "constructionInfo.designTime" : construction.items.designTime.val() + " 00:00:00",
            "constructionInfo.comment": construction.items.comment.val()
        };

        com.post(api.construction.updateConstructionInfoByOrderId, options, function (res) {

            com.showAlert(com.info,"操作成功");

            construction.modals.constructionInfoModal.modal("hide");
        });
    }

    function update() {

        var options = {
            "construction.cid" : construction.cid,
            "construction.accessoryLimit" : construction.updateItems.accessoryLimit.val(),
            "construction.salaryLimit": construction.updateItems.salaryLimit.val(),
        };

        com.post(api.construction.updateConstructionForAdvance, options, function (res) {

            seacher.doSearch();
            com.showAlert(com.info,"操作成功");

            construction.modals.updateConstructionModal.modal("hide");
        });
    }



});
