$(function () {
    var createCustomerSource = {
        grade: ["A", "B", "C", "D"],
        items: {}
    };

    createCustomerSource.items.phone = com.focusPage("#Phone");
    createCustomerSource.items.purpose = com.focusPage("#purpose");
    createCustomerSource.items.intention = com.focusPage("#intention");
    createCustomerSource.items.price = com.focusPage("#price");
    createCustomerSource.items.grade = com.focusPage("#grade");
    createCustomerSource.items.comment = com.focusPage("#comment");
    createCustomerSource.items.comments = com.focusPage("#comments");
    createCustomerSource.items.grade.bindData(createCustomerSource.grade);
    com.initChosen('belonger', api.personel.queryUserByPinyin, "pinyinName", {
        "duty": "",
        "user.status": 0
    }, "userBases", "uid", "currentName");

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

            var $belonger = $("<a></a>").addClass("btn btn-minier btn-yellow").html("编辑归属人");
            var $record = $("<a></a>").addClass("btn btn-minier btn-success").html("记录");

            var propertyArr = [
                ["客户电话：", v.phone, "grey"],
                ["目的：", v.purpose, "grey"],
                ["意向：", v.intention, "grey"],
                ["需求价格：", v.price, 'blue'],
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

            $divBtnWrap.append($belonger).append($record).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $belonger.click(function () {
                changeBelonger(v);
            });
            $record.click(function () {
                record(v.csid);
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

    searcher.init(["customerSourcePhone"], "condList", api.customer.pageCustomerOriginForAdvance, function (data) {
        displayFunc.init("resultList", data);
    }, "pagenation", "cusTomerSourcePostData", null, false, null, null);

    function changeBelonger(d) {
        com.clearValidator();
        com.updateChosen("belonger", d.belonger.uid, com.checkNull(d.belonger.userName, ''));

        openlayer("编辑归属人", com.focusPage('#customersourceforbelonger'), function () {
            if (!com.validate("customersourceforbelonger", null)) {
                var option = {
                    "customerOrigin.csid": d.csid,
                    "customerOrigin.belonger.uid": com.focusPage("#belonger").val()
                };
                com.post(api.customer.updateCustomerOriginForBelonger, option, function () {
                    layer.closeAll();
                    searcher.doSearch();
                    com.showAlert(com.info, '修改成功');
                });
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
            }
        });
    }

});