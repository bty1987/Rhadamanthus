$(function () {
    var customerSource = {
        saveBtn: com.focusPage("#saveBtn"),

        items: {
            phone: com.focusPage("#Phone"),
            purpose: com.focusPage("#purpose"),
            intention: com.focusPage("#intention"),
            price: com.focusPage("#price"),
            grade: com.focusPage("#grade"),
            comment: com.focusPage("#comment"),
            comments: com.focusPage("#comments")
        },

        csid: null,
        
        status: {},

        grade: ["A", "B", "C", "D"]
    };

    customerSource.saveBtn.bindClick(saveData);
    
    com.post(api.ds.customer, {}, function (res) {
        customerSource.status = res.customerSourceStatus.split('key', 'value');
    }, null, false);

    com.initTypeahead('belonger', api.personel.queryUserByPinyin, "pinyinName", { "duty": "", "user.status": 0}, "userBases", "uid", "currentName", null);

    customerSource.items.grade.bindData(customerSource.grade, "key", "value", false);

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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $belonger = $("<a></a>").addClass("btn btn-minier btn-yellow").html("编辑归属人");
            var $record = $("<a></a>").addClass("btn btn-minier btn-success").html("记录");

            var propertyArr = [
                ["客户电话: ", v.phone, "grey"],
                ["性别: ", v.gender, "grey"],
                ["目的: ", v.purpose, "grey"],
                ["风格意向: ", v.intention, "grey"],
                ["预计装修价格: ", v.price, 'blue'],
                ["客户等级: ", v.grade, "grey"],
                ["创建人: ", v.creater.currentName, "grey"],
                ["创建时间: ", v.createTime, "green"],
                ["归属人: ", v.belonger.currentName, "grey"],
                ["归属部门: ", v.department.name, "grey"],
                ["归属分区: ", v.region.name, "grey"],
                ["归属设计师: ", com.checkNull(v.designer.currentName,'无'), "grey"],
                ["楼盘名: ",com.checkNull(v.village.name,'无'), "grey"],
                ["楼牌号: ", v.houseNumber, "blue"],
                ["建筑面积: ", v.buildArea, "blue"],
                ["装修单号: ", com.checkNull(v.orderId, '无'), "blue"],
                ["状态: ", customerSource.status[v.status], "red"],
                ["备注: ", com.checkNull(v.comment, '无'), "grey"]
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

                com.popup4model('#customersourceforbelonger', "编辑归属人", function () {
                    customerSource.csid = v.csid;
                    com.updateTypeahead("belonger", v.belonger.uid, com.checkNull(v.belonger.userName, ''));
                });
            });
            $record.click(function () {
                params.csid = v.csid;

                com.popup4page("#customerRecordPopUp", "views/customer/customerRecord.html", "记录内容");
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

    function saveData(){
        if (com.validate("form2")) {
            return false;
        }

        var option = {
            "customerOrigin.csid": customerSource.csid,
            "customerOrigin.belonger.uid": com.typeahead("belonger")
        };

        com.post(api.customer.updateCustomerOriginForBelonger, option, function () {
            searcher.doSearch();
            com.closePopup();
            com.showAlert(com.info, '修改成功');
        });
    }

});