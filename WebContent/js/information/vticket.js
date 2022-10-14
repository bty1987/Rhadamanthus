jQuery(function($) {

    var vticket = {
        saveBtn: com.focusPage("#saveBtn"),

        modals: {
            vticketModal: com.focusPage("#vticketModal")
        },
        items: {
            vtid: com.focusPage("#vtid"),
            tno: com.focusPage("#tno"),
            belonger: com.focusPage("#belonger"),
            orderId: com.focusPage("#orderId"),
            name: com.focusPage("#name"),
            phone: com.focusPage("#phone"),
            address: com.focusPage("#address"),
            vaid: com.focusPage("#vaid")
        },
    };

    vticket.saveBtn.bindClick(saveData);

    com.post(api.information.queryVactivity, {}, function(res) {

        vticket.items.vaid.bindData(res.vactivitys, "vaid", "name", false);
    });

    vticket.modals.vticketModal.on("hide.bs.modal", function() {

        com.clearValidator();
        com.cleanTypeahead("belonger");
        com.cleanItems(vticket.items);
    });

    com.initTypeahead('belonger', api.personel.queryUserByPinyin, "pinyinName", {
        "departmentType.name": "",
        "user.status": 0
    }, "autoFillKeyValue", "key", "value", null);

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

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass("oid").append($('<small></small>').addClass('blue').html(v.tno));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnAward = $('<a></a>').addClass('btn btn-minier btn-inverse').html("奖品");// 活动物品

            var propertyArr = [["姓名:", v.name, "grey"], ["电话:", v.phone, "grey"], ["地址:", v.address, "grey"], ["装修单号:", v.orderId, "grey"], ["归属人:", v.belonger.userName, "grey"], ["归属部门:", v.department.name, "grey"], ["归属分区:", v.region.name, "grey"], ["创建人:", v.creater.userName, "grey"], ["创建时间:", v.createTime, "green"], ["是否注册:", v.isregist == constant.information().vticket.ISREGIST_NO_INT ? "未注册" : "已注册", "red"], ["是否到场:", v.iscome == constant.information().vticket.ISCOME_NO_INT ? "未到场" : "已到场", "red"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnEdit).append($btnAward).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function() {

                com.updateTypeahead("belonger", v.belonger.userId, v.belonger.userName);

                vticket.items.tno.attr("readOnly", true);
                vticket.items.vtid.val(v.vtid);
                vticket.items.tno.val(v.tno);
                vticket.items.orderId.val(v.orderId);
                vticket.items.name.val(v.name);
                vticket.items.phone.val(v.phone);
                vticket.items.address.val(v.address);

                vticket.modals.vticketModal.modal("show");
            });

            $btnAward.click(function() {

                params.infomation.tno = v.tno;
                params.infomation.vticket = v;
                com.popup4page("#vawardPopUp", api.index.vaward.url, "活动奖品");
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

    searcher.init(["information-v-ticket-no", "information-v-ticket-orderId", "information-v-ticket-name"], "condList", api.information.pageVticket, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "vticketPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addVticket').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage('#addVticket', '#pagenation').click(function() {

        vticket.items.tno.attr("readOnly", false);
        vticket.modals.vticketModal.modal("show");
    });

    function saveData() {

        if (com.validate('form')) {
            return;
        }
        var options = {
            'vticket.belonger.userId': com.typeahead("belonger"),
            'vticket.orderId': vticket.items.orderId.val(),
            'vticket.name': vticket.items.name.val(),
            'vticket.phone': vticket.items.phone.val(),
            'vticket.address': vticket.items.address.val(),
            'vticket.vaid': vticket.items.vaid.val()
        };

        if (vticket.items.vtid.val() == "") {
            options['vticket.tno'] = vticket.items.tno.val();
            com.post(api.information.createVticket, options, function(res) {

                searcher.doSearch();
            });
        } else {
            options['vticket.vtid'] = vticket.items.vtid.val();
            com.post(api.information.updateVticket, options, function(res) {

                searcher.doSearch();
            });
        }

        vticket.modals.vticketModal.modal("hide");
    }

});
