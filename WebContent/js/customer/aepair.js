$(function () {

    var aepair = {
        aid: null,
        items: {
            outlay: com.focusPage("#outlay")
        },
        modals: {
            updateAepairModal: com.focusPage("#updateAepairModal"),
            tranAepairModal: com.focusPage("#tranAepairModal"),
        },
        updateSaveBtn: com.focusPage("#updateSaveBtn"),
        saveBtn: com.focusPage("#saveBtn"),
        type: null,
    };

    aepair.updateSaveBtn.bindClick(updateFunction);
    aepair.saveBtn.bindClick(saveFunction);

    aepair.modals.updateAepairModal.on('hide.bs.modal', function (e) {
        com.cleanItems(aepair.items);
        com.clearValidator();
    });

    aepair.modals.tranAepairModal.on('hide.bs.modal', function (e) {
        com.cleanTypeahead('userName');
        com.clearValidator();
    });

    com.initTypeahead('userName', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": "0",
        "departmentType.name": ""
    }, "autoFillKeyValue", "key", "value", null);


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
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue'));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnSend = $('<a></a>').addClass('btn btn-minier btn-blue').html('发送');
            var $btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html('查看');
            var $btnPay = $('<a></a>').addClass('btn btn-minier btn-purple').html('维修款');
            var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-success').html('更新');
            var $btnReceive = $('<a></a>').addClass('btn btn-minier btn-danger').html('领取');
            var $btnDelive = $('<a></a>').addClass('btn btn-minier btn-pink').html('分配');
            var $btnTran = $('<a></a>').addClass('btn btn-minier btn-warning').html('转交');
            var $btnFinish = $('<a></a>').addClass('btn btn-minier btn-inverse').html('完工');
            var $btnClose = $('<a></a>').addClass('btn btn-minier btn-yellow').html('关闭');

            var $label = $('<label></label>').addClass('control-label').css({
                'color': 'grey',
                'font-size': '20px',
                "font-weight": "bold"
            });

            var _label = $('<label></label>');

            var propertyArr = [
                ["创建人:", v.creater.currentName, "grey"],
                ["创建时间:", v.createTime, "green"],
                ["操作人:", v.updater.currentName, "grey"],
                ["操作时间:", v.updateTime, "green"],
                ["维修人:", v.repaier.currentName, "grey"],
                ["状态:", v.status == 0 ? "初始" : v.status == 1 ? "维修" : v.status == 2 ? "完工" : "关闭", "red"],
                ["水:", v.onestate == 0 ? "初始" : v.onestate == 1 ? "维修" : "完工", "red"],
                ["电:", v.twostate == 0 ? "初始" : v.twostate == 1 ? "维修" : "完工", "red"],
                ["瓦:", v.thrstate == 0 ? "初始" : v.thrstate == 1 ? "维修" : "完工", "red"],
                ["木:", v.forstate == 0 ? "初始" : v.forstate == 1 ? "维修" : "完工", "red"],
                ["油:", v.fivstate == 0 ? "初始" : v.fivstate == 1 ? "维修" : "完工", "red"],
                ["说明:", v.comment, "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
                $label.appendTo($h3);
            });

            var _span = $('<span></span>').addClass('lbl blue bigger-150').html(v.comment);

            _label.append(_span).appendTo($label);

            $divBtnWrap.append($btnSend).append($btnView).append($btnUpdate).append($btnReceive).append($btnDelive).append($btnTran).append($btnFinish).append($btnClose).append($btnPay).appendTo($h3);

            $liLine.append($h3).append($ulProperty);
            
            $btnSend.click(function () {
                var option = {
                    "code": "1b0c4d577a692ccbea1020147d2d851e1db9f9055d204872a3c76c9edab27204",
                    "aepair.aid": v.aid
                };
                com.post(api.customer.sendAepair, option, function () {
                    com.showAlert(com.info, '发送成功');
                });
            });

            $btnView.click(function () {
                params.aid = v.aid;
                com.popup4page('#repairPopUp', 'views/customer/repair.html', '维修单');
            });

            $btnPay.click(function () {
                params.aid = v.aid;
                com.popup4page('#repairPayPopUp', 'views/customer/repairPay.html', '维修款');
            });

            $btnUpdate.click(function () {
                aepair.aid = v.aid;
                aepair.modals.updateAepairModal.modal("show");
            });

            $btnReceive.click(function () {
                receiveFunction(v.aid);
            });

            $btnDelive.click(function () {
                com.focusPage("#tranModal").html("分配报修信息");
                aepair.aid = v.aid;
                aepair.type = "delive";
                aepair.modals.tranAepairModal.modal("show");
            });

            $btnTran.click(function () {
                com.focusPage("#tranModal").html("转交报修信息");
                aepair.aid = v.aid;
                aepair.type = null;
                aepair.modals.tranAepairModal.modal("show");
            });

            $btnFinish.click(function () {
                finishFunction(v.aid);
            });

            $btnClose.click(function () {
                closeFunction(v.aid);
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

    var seacher = new Searcher();

    seacher.init(["customer-service-creater-name", "customer-service-updater-name", "customer-aepair-status"], "condListData", api.customer.pageAepair, function (data) {
        displayFunc.init('resultListData', data);
    }, "pagenationData", "aepairPostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-success').attr('name', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [];
    }, "resultListData");

    function updateFunction() {

        if (com.validate('form')) {
            return false;
        }

        var options = {};
        options["aepair.aid"] = aepair.aid;
        options["aepair.outlay"] = aepair.items.outlay.val();

        com.post(api.customer.updateAepair, options, function (res) {
            com.showAlert(com.info, '操作成功');
            aepair.modals.updateAepairModal.modal("hide");
            seacher.doSearch();
        });
    }

    function receiveFunction(aid) {

        com.showConfirm("确认要领取吗", function () {
            com.post(api.customer.receiveAepair, {"aepair.aid": aid}, function (res) {
                com.showAlert(com.info, '领取成功');
                seacher.doSearch();
            });
        });

    }

    function saveFunction() {

        if (com.validate('tranForm')) {
            return false;
        }

        var options = {
            "aepair.aid": aepair.aid,
            "aepair.repaier.userId": com.typeahead("#userName")
        };

        if (aepair.type == "delive") {
            com.post(api.customer.deliveAepair, options, function (res) {
                com.showAlert(com.info, '分配成功');
                aepair.modals.tranAepairModal.modal("hide");
                seacher.doSearch();
            });
        } else {
            com.post(api.customer.tranAepair, options, function (res) {
                com.showAlert(com.info, '转交成功');
                aepair.modals.tranAepairModal.modal("hide");
                seacher.doSearch();
            });
        }

    }

    function finishFunction(aid) {

        com.showConfirm("确认要完工吗", function () {
            com.post(api.customer.finishAepair, {"aepair.aid": aid}, function (res) {
                com.showAlert(com.info, '操作成功');
                seacher.doSearch();
            });
        });

    }

    function closeFunction(aid) {

        com.showConfirm("确认要关闭吗", function () {
            com.post(api.customer.closeAepair, {"aepair.aid": aid}, function (res) {
                com.showAlert(com.info, '关闭成功');
                seacher.doSearch();
            });
        });

    }
});