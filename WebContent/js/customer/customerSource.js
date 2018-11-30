$(function () {

    var createcustomerOrigin = {
        grade: ["A", "B", "C", "D"],
        items: {}
    };

    createcustomerOrigin.items.phone = com.focusPage("#phone");
    createcustomerOrigin.items.purpose = com.focusPage("#purpose");
    createcustomerOrigin.items.intention = com.focusPage("#intention");
    createcustomerOrigin.items.price = com.focusPage("#price");
    createcustomerOrigin.items.grade = com.focusPage("#grade");
    createcustomerOrigin.items.comment = com.focusPage("#comment");
    createcustomerOrigin.items.comments = com.focusPage("#comments");
    createcustomerOrigin.items.grade.bindData(createcustomerOrigin.grade);

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
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
            var $liLine = $('<li></li>').addClass('item-orange clearfix ');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.customer.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnView = $("<a></a>").addClass("btn btn-minier btn-yellow").html("编辑");
            var $release = $("<a></a>").addClass("btn btn-minier btn-success").html("释放");
            var $record = $("<a></a>").addClass("btn btn-minier btn-warning").html("记录");

            var propertyArr = [
                ["客户电话：", v.phone, "grey"],
                ["目的：", v.purpose, "grey"],
                ["意向：", v.intention, "grey"],
                ["需求价格：", v.price, "blue"],
                ["客户等级：", v.grade, "grey"],
                ["创建人：", v.creater.userName, "grey"],
                ["创建时间：", v.createTime, "green"],
                ["归属人：", v.belonger.userName, "grey"],
                ["归属部门：", v.department.name, "grey"],
                ["归属分区：", v.region.name, "grey"],
                ["备注：", v.comment, "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnView).append($release).append($record).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnView.click(function () {
                editcustomerOrigin(v);
            });

            $record.click(function () {
                record(v.csid);
            });

            $release.click(function () {
                release(v.csid);
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
        };
    })();

    var searcher = new Searcher();

    searcher.init(["customerSourcePhone"], "condList", api.customer.pageCustomerOrigin, function (data) {
        displayFunc.init("resultList", data);
    }, "pagenation", "customerOriginPostData", null, false, null, null);

    function editcustomerOrigin(d) {
        com.clearValidator();
        createcustomerOrigin.items.csid = d.csid;
        createcustomerOrigin.items.phone.val(d.phone);
        createcustomerOrigin.items.purpose.val(d.purpose);
        createcustomerOrigin.items.intention.val(d.intention);
        createcustomerOrigin.items.price.val(d.price);
        createcustomerOrigin.items.grade.val(d.grade);
        createcustomerOrigin.items.comment.val(d.comment);

        openlayer("编辑客源", com.focusPage('#sustomersource'), function () {
            if (!com.validate("sustomersource", null)) {
                var options = {
                    "customerOrigin.csid": createcustomerOrigin.items.csid,
                    "customerOrigin.phone": createcustomerOrigin.items.phone.val(),
                    "customerOrigin.purpose": createcustomerOrigin.items.purpose.val(),
                    "customerOrigin.intention": createcustomerOrigin.items.intention.val(),
                    "customerOrigin.price": createcustomerOrigin.items.price.val(),
                    "customerOrigin.grade": createcustomerOrigin.items.grade.val(),
                    "customerOrigin.comment": createcustomerOrigin.items.comment.val()
                };

                com.post(api.customer.updateCustomerOrigin, options, function (res) {
                    layer.closeAll();
                    searcher.doSearch();
                    com.showAlert(com.info, '修改成功');
                });
            }
        });
    }

    function release(csid) {
        var btn = $(this);
        var span = btn.find('span');
        btn.find('i').remove();
        var loading = $('<i></i>').addClass('icon-spinner icon-spin white bigger-125');
        span.prepend(loading);
        var message = "<p>确定要释放该客源吗?</p>";
        bootbox.confirm(message, function (result) {
            if (result) {
                var options = {
                    "customerOrigin.csid": csid
                };
                com.post(api.customer.freeCustomerOrigin, options, function (res) {
                    searcher.doSearch();
                    com.showAlert(com.info, '释放成功');
                });
            } else {
                btn.find('i').remove();
                var prepared = $('<i></i>').addClass('icon-ok bigger-110');
                span.prepend(prepared);
            }
        });
    }

    function record(csid) {
        var $customerRecord = com.focusPage('#customerRecord');
        $customerRecord.attr({'data-csid': csid});
        layer.open({
            type: 1,
            title: '记录内容',
            content: $customerRecord,
            area: [( $(window).width() * 0.7 < 1000 ? $(window).width() * 0.7 : 1000 ) + "px", ( $(window).height() * 0.84 < 620 ? $(window).height() * 0.84 : 620 ) + "px"],
            maxmin: false,
            zIndex: 9000,
            btn: ['取消'],
            success: function (index, layero) {
                $customerRecord.load("views/customer/customerRecord.html");
            },
            end: function () {
                $customerRecord.attr('data-csid', null);
            }
        });
    }

    function openlayer(layerType, id, callback) {
        layer.closeAll();
        layer.open({
            type: 1,
            title: layerType,
            content: id,
            area: ( $(window).width() * 0.6 < 620 ? $(window).height() * 0.6 : 620 ) + "px",
            maxmin: false,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                callback(index, layero);
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
            },
            cancel: function () {
                //右上角关闭回调
            },
        });
    }
});