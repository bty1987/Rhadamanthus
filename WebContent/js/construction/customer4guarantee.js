jQuery(function ($) {

    var guarantee = {
        saveBtn: com.focusPage("#saveBtn"),
        cancellBtn: com.focusPage("#cancelBtn"),

        modals: {
            modal: com.focusPage("#guaranteeModal")
        },

        items: {
            orderId : com.focusPage("#orderId"),
            customerName : com.focusPage("#customerName"),
            guaranteeTime : com.focusPage("#guaranteeTime"),
            guaranteeDes : com.focusPage("#guaranteeDes")
        },

        editFlag: false,
        repeatFlg: false
    };

    guarantee.saveBtn.bindClick(saveData);

    guarantee.modals.modal.on("hide.bs.modal", function(){

        com.cleanItems(guarantee.items);
        com.closeTip();
    });

    com.focusPage('#fl-statement').statement("客服控制", "保修");

    com.datetime(guarantee.items.guaranteeTime);

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
                ["客户名:", v.customerName, "grey"],
                ["时间:", v.guaranteeTime, "grey"],
                ["备注:", v.guaranteeDes, "grey"]
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
                guarantee.editFlag = true;
                var row = v;
                guarantee.items.orderId.val(row.orderId);
                guarantee.items.customerName.val(row.customerName);
                guarantee.items.guaranteeTime.val(row.guaranteeTime);
                guarantee.items.guaranteeDes.val(row.guaranteeDes);

                guarantee["customerServiceGuarantee.csgId"] = row.csgId;

                guarantee.items.orderId.attr('disabled', true);
                guarantee.items.customerName.attr('disabled', true);
                guarantee.items.guaranteeTime.attr("disabled", true);

                guarantee.modals.modal.modal("show");
            });

            $btnDel.click(function () {
                removeRow(v.csgId);
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
    searcher.init([], "condList", api.construction.pageCustomerServiceGuarantee, function (list) {
        displayFunc.init('resultList', list);
    }, "pagenation", "searcherPostData", {
        "customerServiceGuarantee.orderId": params.construction.orderId
    }, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('id', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage('#add', '#pagenation').click(function () {
        guarantee.editFlag = false;

        guarantee.items.orderId.val(params.construction.orderId);
        guarantee.items.customerName.val(params.construction.customerName);

        guarantee.items.orderId.attr("disabled", true);
        guarantee.items.customerName.attr("disabled", true);
        guarantee.items.guaranteeTime.attr("disabled", false);

        guarantee.modals.modal.modal("show");
    });

    function saveData() {
        if (com.validate("guaranteeModal") || guarantee.repeatFlg)
            return;

        var url;
        var options = {
            "customerServiceGuarantee.orderId": guarantee.items.orderId.val(),
            "customerServiceGuarantee.customerName": guarantee.items.customerName.val(),
            "customerServiceGuarantee.guaranteeTime": guarantee.items.guaranteeTime.val(),
            "customerServiceGuarantee.guaranteeDes": guarantee.items.guaranteeDes.val()
        };

        if (guarantee.editFlag) {
            url = api.construction.updateCustomerServiceGuarantee;
            options["customerServiceGuarantee.csgId"] = guarantee["customerServiceGuarantee.csgId"];
        } else {
            url = api.construction.addCustomerServiceGuarantee;
        }

        com.post(url, options, successCallback);
        guarantee.modals.modal.modal("hide");
    }

    function removeRow(id) {

        com.showConfirm("确认删除吗?", function () {
                com.post(api.construction.deleteCustomerServiceGuarantee, {"csgIds[0]": id}, successCallback);

        });

    }

    function successCallback(result) {
        searcher.doSearch();
    }

});

