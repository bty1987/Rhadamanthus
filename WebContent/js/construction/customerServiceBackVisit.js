jQuery(function ($) {

    var backVisit = {

        saveBtn: com.focusPage("#saveBtn"),
        cancellBtn: com.focusPage("#cancelBtn"),

        modals:{
            modal: com.focusPage("#backVisitModal")
        },

        items: {
            orderId : com.focusPage("#orderId"),
            orderAddr : com.focusPage("#orderAddr"),
            customerName : com.focusPage("#customerName"),
            backVisitTime : com.focusPage("#backVisitTime"),
            backVisitType : com.focusPage("#backVisitType"),
            backVisitDes : com.focusPage("#backVisitDes")
        },

        backVisitTypeData: {},
        editFlag: false,
        repeatFlg: false
    };

    backVisit.saveBtn.bindClick(saveData);
    
    com.focusPage('#fl-statement').statement("客服控制", "回访");

    com.datetime(backVisit.items.backVisitTime);

    backVisit.modals.modal.on("hide.bs.modal", function(){

        com.cleanItems(backVisit.items);
        com.closeTip();
    });

    com.post(api.ds.construction, {}, function (res) {
        backVisit.backVisitTypeData = res.backVisitTypeData.split("key", "value");

        backVisit.items.backVisitType.bindData(res.backVisitTypeData, "key", "value", false);
    });

    var displayFunc = (function () {
        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId).empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-primary').html("编辑");
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html("删除");

            var propertyArr = [
                ["楼盘地址:", v.orderAddr, "grey"],
                ["客户名:", v.customerName, "grey"],
                ["时间:", v.backVisitTime, "green"],
                ["类型:", backVisit.backVisitTypeData[v.backVisitType], "red "],
                ["备注:", v.backVisitDes, "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnEdit).append($btnDel).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function () {
                backVisit.editFlag = true;
                var row = v;

                backVisit.items.orderId.val(params.construction.orderId);
                backVisit.items.orderAddr.val(params.construction.orderAddr);
                backVisit.items.customerName.val(params.construction.customerName);
                backVisit.items.backVisitTime.val(row.backVisitTime);
                backVisit.items.backVisitType.val(row.backVisitType);
                backVisit.items.backVisitDes.val(row.backVisitDes);

                backVisit["customerServiceBackVisit.csbvId"] = row.csbvId;

                backVisit.items.orderId.attr('disabled', true);
                backVisit.items.orderAddr.attr("disabled", true);
                backVisit.items.customerName.attr('disabled', true);

                backVisit.modals.modal.modal("show");
            });

            $btnDel.click(function () {
                removeRow(v.csbvId);
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

    var searcher = new Searcher();
    searcher.init([], "condList", api.construction.pageCustomerServiceBackVisit, function (list) {
        displayFunc.init('resultList', list);
    }, "pagenation", "customerServiceBackVisitPostData", {
        "customerServiceBackVisit.orderId": params.construction.orderId
    }, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('id', 'Add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage('#Add', '#pagenation').click(function () {
        backVisit.editFlag = false;

        backVisit.items.orderId.val(params.construction.orderId);
        backVisit.items.orderAddr.val(params.construction.orderAddr);
        backVisit.items.customerName.val(params.construction.customerName);

        backVisit.items.orderId.attr("disabled", true);
        backVisit.items.orderAddr.attr("disabled", true);
        backVisit.items.customerName.attr("disabled", true);

        backVisit.modals.modal.modal("show");
    });

    function saveData() {
        if (com.validate("backVisitModal") || backVisit.repeatFlg)
            return;

        var url;
        var options = {
            "customerServiceBackVisit.orderId": backVisit.items.orderId.val(),
            "customerServiceBackVisit.orderAddr": backVisit.items.orderAddr.val(),
            "customerServiceBackVisit.customerName": backVisit.items.customerName.val(),
            "customerServiceBackVisit.backVisitTime": backVisit.items.backVisitTime.val(),
            "customerServiceBackVisit.backVisitType": backVisit.items.backVisitType.val(),
            "customerServiceBackVisit.backVisitDes": backVisit.items.backVisitDes.val()
        };

        if (backVisit.editFlag) {
            url = api.construction.updateCustomerServiceBackVisit;
            options["customerServiceBackVisit.csbvId"] = backVisit["customerServiceBackVisit.csbvId"];
        } else {
            url = api.construction.addCustomerServiceBackVisit;
        }

        com.post(url, options, successCallback, failCallback);
        backVisit.modals.modal.modal("hide");
    }

    function removeRow(id) {

        com.showConfirm("确认删除吗?", function () {
            com.post(api.construction.deleteCustomerServiceBackVisit, {"csbvIds[0]": id}, successCallback, failCallback);
        });

    }

    function successCallback(result) {
        searcher.doSearch();
    }

    function failCallback() {

    }

});

