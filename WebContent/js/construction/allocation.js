$(function() {

    var constructionNodes = {

        constructionSchedule: {},

        modals: {
            constructionInfoModal: com.focusPage("#constructionInfoModal")
        },

        btns: {
            saveBtn: com.focusPage("#saveBtn")
        },

        items: {

            ishovel: com.focusPage("#ishovel"),
            iskey: com.focusPage("#iskey"),
            timeLimit: com.focusPage("#timeLimit"),
            finishTime: com.focusPage("#finishTime"),
            keyTime: com.focusPage("#keyTime"),
            drawlineTime: com.focusPage("#drawlineTime"),
            designTime: com.focusPage("#designTime"),
            isCeremony: com.focusPage("#isCeremony"),
            comment: com.focusPage("#comment")

        }
    };

    constructionNodes.btns.saveBtn.bindClick(saveData);

    constructionNodes.modals.constructionInfoModal.on("hide.bs.modal", function() {

        com.cleanItems(constructionNodes.items);
        com.closeTip();
    });

    com.datetime(constructionNodes.items.finishTime);
    com.datetime(constructionNodes.items.keyTime);
    com.datetime(constructionNodes.items.drawlineTime);
    com.datetime(constructionNodes.items.designTime);

    constructionNodes.items.ishovel.bindData(constant.construction().constructionInfo.isHovel.datas, "key", "value");
    constructionNodes.items.iskey.bindData(constant.construction().constructionInfo.isKey.datas, "key", "value");
    constructionNodes.items.isCeremony.bindData(constant.construction().constructionInfo.isCeremony.datas, "key", "value");

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId).empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnQualiter = $('<a></a>').addClass('btn btn-minier btn-warning').html("质检");
            var $btnInfo = $('<a></a>').addClass('btn btn-minier btn-yellow').html("信息");
            var $btnView = $('<a></a>').addClass('btn btn-minier btn-success').html("施工节点");

            var propertyArr = [
                ["装修单: ", v.orderId, "blue", function(btn) {

                    tools.decoration.info(btn, v.orderId);
                }],
                ["楼盘: ", v.house.village.name, "grey", function(btn) {

                    tools.house.info(btn, v.house.hid);
                }],
                ["楼号: ", v.house.houseNumber, "grey"],
                ["客户: ", v.customer.name, "grey", function(btn) {

                    tools.customer.info(btn, v.customer.cid);
                }],
                ["设计师:", v.designer.userName, "grey", function(btn) {

                    tools.personel.info(btn, v.designer.userId);
                }],
                ["监理:", v.supervisor ? v.supervisor.userName : "", "grey", function(btn) {

                    tools.personel.info(btn, v.supervisor.userId);
                }],
                ["总价:", v.orderTotalPrice, "blue"],
                ["面积:", v.house.buildArea, "blue"],
                ["合同额: ", v.orderTotalPrice, "blue"],
                ["报价版本: ", v.version.name, "grey"],
                ["进度:", constant.decoration().decoration.projectStatus.keys[v.projectStatus], "red"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                var $b = $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);

                if (value[3]) {
                    $b.click(function() {

                        value[3]($b);
                    });
                }

                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnQualiter).append($btnInfo).append($btnView).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnQualiter.click(function() {

                params.construction.orderId = v.orderId;
                com.popup4page("#stockRecordPopUp", "/views/construction/qualiter4detail.html", "质检");
            });

            $btnView.click(function() {

                viewworkerAllocationDetail(v.orderId);
            });

            $btnInfo.click(function() {

                viewConstructionInfo(v.orderId);
            });

            return $liLine;
        };

        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();
    searcher.init(['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-designer', 'decoration-projectStatus'], "condList", api.construction.pageConstruction, function(list) {

        displayFunc.init('resultList', list);
    }, "pagenation", "workerAllocationSeacherPostData");

    function viewworkerAllocationDetail(orderId) {

        params.construction.orderId = orderId;
        com.popup4page("#stockRecordPopUp", "/views/construction/allocation4detail.html", "查看");
    }

    function viewConstructionInfo(orderId) {

        com.post(api.construction.queryConstructionInfoByOrderId, {
            "constructionInfo.orderId": orderId
        }, function(res) {

            data = res.constructionInfo;

            constructionNodes.items.orderId = orderId;
            constructionNodes.items.ishovel.val(data.ishovel);
            constructionNodes.items.iskey.val(data.iskey);
            constructionNodes.items.isCeremony.val(data.isCeremony);
            constructionNodes.items.timeLimit.val(data.timeLimit);
            if (data.finishTime != null) {
                constructionNodes.items.finishTime.val(data.finishTime.substr(0, 10));
            }
            if (data.keyTime != null) {
                constructionNodes.items.keyTime.val(data.keyTime.substr(0, 10));
            }
            if (data.drawlineTime != null) {
                constructionNodes.items.drawlineTime.val(data.drawlineTime.substr(0, 10));
            }
            if (data.designTime != null) {
                constructionNodes.items.designTime.val(data.designTime.substr(0, 10));
            }
            constructionNodes.items.comment.val(data.comment);
        });

        constructionNodes.modals.constructionInfoModal.modal("show");
    }

    function saveData() {

        var options = {
            "constructionInfo.orderId": constructionNodes.items.orderId,
            "constructionInfo.decoration.orderId": constructionNodes.items.orderId,
            "constructionInfo.timeLimit": constructionNodes.items.timeLimit.val(),
            "constructionInfo.ishovel": constructionNodes.items.ishovel.val(),
            "constructionInfo.iskey": constructionNodes.items.iskey.val(),
            "constructionInfo.isCeremony": constructionNodes.items.isCeremony.val(),
            "constructionInfo.finishTime": constructionNodes.items.finishTime.val() + " 00:00:00",
            "constructionInfo.keyTime": constructionNodes.items.keyTime.val() + " 00:00:00",
            "constructionInfo.drawlineTime": constructionNodes.items.drawlineTime.val() + " 00:00:00",
            "constructionInfo.designTime": constructionNodes.items.designTime.val() + " 00:00:00",
            "constructionInfo.comment": constructionNodes.items.comment.val()
        };

        com.post(api.construction.updateConstructionInfoByOrderId, options, function(res) {

            com.showAlert(com.info, "操作成功");

            constructionNodes.modals.constructionInfoModal.modal("hide");
        });
    }

});
