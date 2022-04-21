jQuery(function($) {

    var extension = {

        orderId: params.quotation.orderId,

        saveBtn: com.focusPage("#saveBtn").on("click", saveData),
        cancellBtn: com.focusPage("#cancelBtn"),
        modal: com.focusPage("#extensionModal"),

        items: {
            addExtensionDes: com.focusPage("#extensionDes"),
            addExtensionType: com.focusPage("#extensionType")
        }
    };

    var extraParams = {
        "extension.orderId": extension.orderId
    };

    var typeDict = {
        "0": "增项",
        "1": "减项"
    };

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
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

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnLook = $('<a></a>').addClass('btn btn-minier btn-yellow').html('查看');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

            var $label = $('<label></label>');
            var $input = $('<input>').attr({
                "type": "checkbox",
                "name": "eids",
                "class": "ace ace-checkbox-2"
            }).val(v.eid);
            var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.content);

            var propertyArr = [["非打折总额:", v.undisPrice, "grey"], ["打折总额:", v.disPrice, "grey"], ["总价:", v.total, "grey"], ["类型", typeDict[v.type], 'grey'], ["状态:", v.status == 0 ? "初始" : v.status == 1 ? "已提交" : "-", "red"], ["添加时间:", v.createTime, "grey"], ["说明:", v.content, "grey"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
            $label.append($input).append($span).appendTo($h3);
            $divBtnWrap.append($btnLook).append($btnDel).appendTo($h3);
            $liLine.append($h3).append($ulProperty);

            // 查看按钮点击事件
            $btnLook.click(function() {

                viewDetailExtension(v.eid, v.type);
            });

            $btnDel.click(function() {

                com.showConfirm("是否确认删除", function() {

                    removeRow(v.eid);
                });
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

    initQuotationList();

    function initQuotationList() {

        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": extension.orderId
        }, function(res) {

            drawdecoration(res.decoration);
        }, null, false);

    }

    function drawdecoration(decoration) {

        var decorationInfo = com.focusPage("#extensionInfo");
        var $widget1 = $('<div></div>').addClass("col-xs-6 col-md-3").prependTo(decorationInfo);
        var $box1 = $('<div></div>').addClass("widget-box").appendTo($widget1);
        var $header1 = $('<div></div>').addClass("widget-header header-color-green").appendTo($box1);

        var name1 = $('<h4></h4>').attr('id', 'h4name_').text("客户").appendTo($header1);

        var $body1 = $('<div></div>').addClass("widget-body").appendTo($box1);
        var $main1 = $('<div></div>').addClass("widget-main").appendTo($body1);
        var $info1 = $('<div></div>').css("padding", "5px").appendTo($main1);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('姓名: ' + decoration.customer.name)).appendTo($info1);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('电话: ' + (decoration.customer.phone == "" ? "暂无" : decoration.customer.phone))).appendTo($info1);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('地址: ' + (decoration.customer.address == "" ? "暂无" : decoration.customer.address))).appendTo($info1);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('客户关系: ' + decoration.customer.relationshipType)).appendTo($info1);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('身份证: ' + (decoration.customer.identity == "" ? "暂无" : decoration.customer.identity))).appendTo($info1);

        var $widget = $('<div></div>').addClass("col-xs-6 col-md-3").prependTo(decorationInfo);
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header header-color-orange").appendTo($box);

        var name = $('<h4></h4>').attr('id', 'h4name_').text("装修单").appendTo($header);

        var $body = $('<div></div>').addClass("widget-body").appendTo($box);
        var $main = $('<div></div>').addClass("widget-main").appendTo($body);
        var $info = $('<div></div>').css("padding", "5px").appendTo($main);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('装修单号: ' + decoration.orderId)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('楼盘地址: ' + decoration.house.village.name + " " + decoration.house.houseNumber)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('报价版本: ' + decoration.version.name)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('设计师: ' + decoration.designer.currentName)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('业务员: ' + decoration.salesman.currentName)).appendTo($info);
    }

    var search = new Searcher();
    search.init({}, "condList", api.quotation.queryExtensionByOrderId, function(data) {

        displayFunc.init('resultList', data);
    }, null, "addExtensionPostData", extraParams, true, "extensions");

    // 返回按钮
    com.focusPage('#btnBack').click(function() {

        com.switchPage("/views/decoration/decoration.html");
    });

    // 添加按钮
    com.focusPage('#add').click(function() {

        com.cleanItems(extension.items);

        extension.items.addExtensionType.attr('disabled', false);

        extension.modal.modal("show");
    });

    function viewDetailExtension(extensionId, type) {

        params.quotation.extensionId = extensionId;
        params.quotation.extensionType = type;

        com.switchPage(api.index.extensionDetailIndex.url);
    }

    function removeRow(eid) {

        com.post(api.quotation.deleteExtension, {
            "extension.eid": eid
        }, function(res) {

            com.showAlert(com.info, "操作成功!");
            search.doSearch();
        });
    }

    function saveData() {

        if (com.validate("extensionModal"))
            return;

        var url;
        var options = {
            "extension.content": extension.items.addExtensionDes.val(),
            "extension.type": extension.items.addExtensionType.val(),
            "extension.orderId": extension.orderId
        };

        url = api.quotation.addExtension;
        options["extension.status"] = 0;
        options["extension.total"] = 0;

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");
            search.doSearch();

            extension.modal.modal("hide");
        });
    }
});
