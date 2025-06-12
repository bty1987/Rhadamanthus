$(function() {

    var awardStock = {

        saveBtn: com.focusPage("#saveBtn"),
        updateBtn: com.focusPage("#updateBtn"),

        leave: com.focusPage("#leave"),
        stock: com.focusPage("#stock"),
        money: com.focusPage("#money"),
        join: com.focusPage("#join"),
        subType: com.focusPage("#subType"),
        moneys: com.focusPage("#moneys"),

        items: {
            no: com.focusPage("#no"),
            name: com.focusPage("#name"),
            num: com.focusPage("#num"),
            type: com.focusPage("#type"),
            storeroom: com.focusPage("#storeroom"),
            subtype: com.focusPage("#subtype"),
            price: com.focusPage("#price"),
            content: com.focusPage("#content"),
            format: com.focusPage("#format"),
            warehousing: com.focusPage("#warehousing"),
            warehousend: com.focusPage("#warehousend"),

            comment: com.focusPage("#comment"),

            no2: com.focusPage("#no2"),
            name2: com.focusPage("#name2"),
            nownum: com.focusPage("#nownum"),
            isPrefor: com.focusPage("#isPrefor"),
            isStock: com.focusPage("#isStock"),
            isPayment: com.focusPage("#isPayment"),
            price2: com.focusPage("#price2"),
            awardRecordSubtype: com.focusPage("#awardRecordSubtype"),
        },

        asid: null,
        num: null,

        storeroom: {},
        subtype: {},
        subtypeOfWarehousing: [],
        subtypeOfWarehousend: [],
        type: {},
        flag: 0
    };

    awardStock.saveBtn.bindClick(saveData);
    awardStock.updateBtn.bindClick(updateData);

    awardStock.items.storeroom.bindData(constant.information().awardStock.storeroom.datas, "key", "value");
    awardStock.items.subtype.bindData(constant.information().awardStock.subtype.datas, "key", "value");
    awardStock.items.type.bindData(constant.information().awardStock.type.datas, "key", "value");
    awardStock.items.isPrefor.bindData(constant.information().awardStock.isPrefor.datas, "key", "value");
    awardStock.items.isStock.bindData(constant.information().awardStock.isStock.datas, "key", "value");
    awardStock.items.isPayment.bindData(constant.information().awardStock.isPayment.datas, "key", "value");

    $.each(constant.information().awardRecord.subtype.datas, function(i, v) {

        if (v.key != 1 && v.key % 2 == 0) {
            awardStock.subtypeOfWarehousing.push(v);
        } else {
            awardStock.subtypeOfWarehousend.push(v);
        }
    });

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.information.pageAwardStock);

    searcher.condition(['information-award-no', 'information-award-name', 'information-awardStock-type', 'information-awardStock-subtype', 'information-awardStock-room', 'information-awardStock-status']);

    searcher.button(function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addAwardStock').css('margin', '0px 3px');
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })

    var lineprops = [{
        "field": "no",
        "name": "编号",
        prop: "no",
        clazz: "grey"
    }, {
        "field": "name",
        "name": "名称",
        prop: "name",
        clazz: "grey"
    }, {
        "field": "num",
        "name": "数量",
        prop: "num",
        clazz: "blue"
    }, {
        "field": "type",
        "name": "类型",
        prop: "type",
        dataset: constant.information().awardStock.type.keys,
        clazz: "grey"
    }, {
        "field": "subtype",
        "name": "子类",
        prop: "subtype",
        dataset: constant.information().awardStock.subtype.keys,
        clazz: "grey"
    }, {
        "field": "storeroom",
        "name": "库房",
        prop: "storeroom",
        dataset: constant.information().awardStock.storeroom.keys,
        clazz: "grey"
    }, {
        "field": "format",
        "name": "规格",
        prop: "format",
        clazz: "grey"
    }, {
        "field": "unitPrice",
        "name": "价格",
        prop: "unitPrice",
        clazz: "blue"
    }, {
        "field": "status",
        "name": "状态",
        prop: "status",
        dataset: constant.information().awardStock.status.keys,
        clazz: "red"
    }, {
        "field": "isStock",
        "name": "库存标识",
        prop: "isStock",
        dataset: constant.information().awardStock.isStock.keys,
        clazz: "red"
    }, {
        "field": "isPrefor",
        "name": "业绩标识",
        prop: "isPrefor",
        dataset: constant.information().awardStock.isPrefor.keys,
        clazz: "red"
    }, {
        "field": "isPayment",
        "name": "金额标识",
        prop: "isPayment",
        dataset: constant.information().awardStock.isPayment.keys,
        clazz: "red"
    }, {
        "field": "content",
        "name": "备注",
        prop: "content",
        clazz: "grey"
    }, ];

    var linebtns = [{
        name: "启用",
        handle: function(v) {

            if (v.status == constant.information().awardStock.STATUS_ABLE_SHORT) {
                com.showAlert(com.warning, '已启用');
                return false;
            }

            changeStatus(v.asId, 0);
        }
    }, {
        name: "禁用",
        handle: function(v) {

            if (v.status == constant.information().awardStock.STATUS_DISABLE_SHORT) {
                com.showAlert(com.warning, '已禁用');
                return false;
            }

            changeStatus(v.asId, 1);
        }
    }, {
        name: "入库",
        handle: function(v) {

            if (v.isStock == constant.information().awardStock.ISSTOCK_NCAL_INT) {
                com.showAlert(com.warning, "此商品禁止入库!");
                return false;
            }

            com.popup4model('#layerAdd2', '奖品入库', function() {

                awardStock.asid = v.asId;
                awardStock.flag = 3;
            }, null, function() {

                com.cleanItems(awardStock.items);

                awardStock.items.no2.val(v.no).attr('disabled', 'disabled');
                awardStock.items.name2.val(v.name).attr('disabled', 'disabled');
                awardStock.items.nownum.val(v.num);

                awardStock.items.awardRecordSubtype.bindData(awardStock.subtypeOfWarehousing, "key", "value", false);

                awardStock.join.show();
                awardStock.leave.hide();
                awardStock.money.show();
                awardStock.stock.hide();
                awardStock.subType.show();
            });
        }
    }, {
        name: "出库",
        handle: function(v) {

            if (v.isStock == constant.information().awardStock.ISSTOCK_NCAL_INT) {
                com.showAlert(com.warning, "此商品禁止出库!");
                return false;
            }

            com.popup4model('#layerAdd2', '奖品出库', function() {

                com.cleanItems(awardStock.items);

                awardStock.items.no2.val(v.no).attr('disabled', 'disabled');
                awardStock.items.name2.val(v.name).attr('disabled', 'disabled');
                awardStock.items.nownum.val(v.num);

                awardStock.items.awardRecordSubtype.bindData(awardStock.subtypeOfWarehousend, "key", "value", false);

                awardStock.join.hide();
                awardStock.leave.show();
                awardStock.money.show();
                awardStock.stock.hide();
                awardStock.subType.show();

                awardStock.asid = v.asId;
                awardStock.flag = 2;
            });
        }
    }, {
        name: "盘点",
        handle: function(v) {

            if (v.isStock == constant.information().awardStock.ISSTOCK_NCAL_INT) {
                com.showAlert(com.warning, "此商品禁止盘点!");
                return false;
            }

            com.popup4model('#layerAdd2', '盘点', function() {

                awardStock.asid = v.asId;
                awardStock.num = v.num;
                awardStock.flag = 1;
            }, null, function() {

                com.cleanItems(awardStock.items);

                awardStock.items.no2.val(v.no).attr('disabled', 'disabled');
                awardStock.items.name2.val(v.name).attr('disabled', 'disabled');
                awardStock.items.nownum.val(v.num);

                awardStock.join.hide();
                awardStock.leave.hide();
                awardStock.money.hide();
                awardStock.stock.show();
                awardStock.subType.hide();
            });
        }
    }, {
        name: "编辑",
        handle: function(v) {

            com.popup4model('#layerAdd1', '奖品更新', function() {

                awardStock.asid = v.asId;
                awardStock.flag = 4;
            }, null, function() {

                com.cleanItems(awardStock.items);

                awardStock.items.no.val(v.no).attr('disabled', 'disabled');
                awardStock.items.name.val(v.name).attr('disabled', 'disabled');
                awardStock.items.num.val(v.num).attr('disabled', 'disabled');
                awardStock.items.format.val(v.format);
                awardStock.items.content.val(v.content);
                awardStock.items.storeroom.val(v.storeroom);
                awardStock.items.type.val(v.type);
                awardStock.items.subtype.val(v.subtype);
                awardStock.items.isStock.val(v.isStock);

                awardStock.items.type.attr('disabled', 'disabled');

                awardStock.moneys.hide();
            });
        }
    }, {
        name: "记录",
        handle: function(v) {

            params.infomation.asid = v.asId;
            com.popup4page('#stockRecordPopUp', api.index.stockRecord.url, "奖品纪录");
        }
    }]

    searcher.toble(lineprops, linebtns).render();

    com.focusPage("#addAwardStock").click(function() {

        com.popup4model('#layerAdd1', '添加奖品', function() {

            com.cleanItems(awardStock.items);

            awardStock.moneys.show();

            awardStock.items.no.removeAttr('disabled');
            awardStock.items.name.removeAttr('disabled');
            awardStock.items.num.removeAttr('disabled');
            awardStock.items.type.removeAttr('disabled');
            awardStock.items.storeroom.removeAttr('disabled');
            awardStock.items.subtype.removeAttr('disabled');

            awardStock.flag = 0;
        });
    });

    function changeStatus(asid, status) {

        com.post(api.information.updateAwardStockForStatus, {
            "awardStock.asId": asid,
            "awardStock.status": status
        }, function() {

            com.showAlert(com.info, "操作成功");
            com.closePopup();
            searcher.doSearch();
        });
    }

    function saveData() {

        if (com.validate('redact'))
            return false;

        var url = null;
        var options = {
            "awardStock.content": awardStock.items.content.val(),
            "awardStock.isPrefor": awardStock.items.isPrefor.val(),
            "awardStock.isStock": awardStock.items.isStock.val(),
            "awardStock.isPayment": awardStock.items.isPayment.val(),
            "awardStock.storeroom": awardStock.items.storeroom.val(),
            "awardStock.subtype": awardStock.items.subtype.val(),
            "awardStock.format": awardStock.items.format.val()
        };

        switch (awardStock.flag) {
            case 0:
                url = api.information.addAwardStock;
                options["awardStock.no"] = awardStock.items.no.val();
                options["awardStock.name"] = awardStock.items.name.val();
                options["awardStock.type"] = awardStock.items.type.val();
                options["awardStock.num"] = awardStock.items.num.val();
                options["awardStock.price"] = awardStock.items.price.val();
                break;
            case 4:
                url = api.information.updateAwardStock;
                options["awardStock.asId"] = awardStock.asid;
                break;
        }

        com.post(url, options, function() {

            com.closePopup();
            searcher.doSearch();
        })

    }

    function updateData() {

        if (com.validate('checkstorer')) {
            return false;
        }

        var url = null;
        var options = {
            "awardStock.asId": awardStock.asid,
            "awardStock.content": awardStock.items.comment.val()
        };

        switch (awardStock.flag) {
            case 1:
                url = api.information.checkAwardStock;
                options["awardStock.num"] = awardStock.items.nownum.val();
                break;
            case 2:
                url = api.information.updateAwardStockForXG;
                options["awardStock.num"] = awardStock.items.warehousend.val();
                options["awardStock.price"] = awardStock.items.price2.val();
                options["awardStock.subtype"] = awardStock.items.awardRecordSubtype.val();
                break;
            case 3:
                url = api.information.updateAwardStockForCG;
                options["awardStock.num"] = awardStock.items.warehousing.val();
                options["awardStock.price"] = awardStock.items.price2.val();
                options["awardStock.subtype"] = awardStock.items.awardRecordSubtype.val();
                break;
        }

        com.post(url, options, function() {

            com.closePopup();
            searcher.doSearch();
        })

    }

});
