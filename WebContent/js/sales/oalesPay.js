jQuery(function ($) {

    var oalesPay = {

        btns: {
            saveOalesPayBtn: com.focusPage("#saveOalesPayBtn").on("click", saveData),
            addOalesPay: com.focusPage("#addOalesPay").on("click", showAdd)
        },

        modals: {
            oalesPayModal: com.focusPage("#oalesPayModal")
        },

        items: {
            name: com.focusPage("#name", "#oalesPayModal"),
            money: com.focusPage("#money", "#oalesPayModal"),
            type: com.focusPage("#type", "#oalesPayModal"),
            comment: com.focusPage('#comment', "#oalesPayModal"),
            payTime: com.focusPage('#payTime', "#oalesPayModal"),
        },

        oid: null,
        opid: null,
        type: constant.sales().oalespay.type.keys,
        pageType: params.urlLoadParams.pagetype
    };
    com.datetime(com.focusPage("#payTime"));

    oalesPay.items.type = com.focusPage("#type").bindData(constant.sales().oalespay.type.datas, "key", "value");
    oalesPay.modals.oalesPayModal.on('hide.bs.modal', function (e) {

        com.cleanItems(oalesPay.items);
        com.closeTip();
    });
    var searcher = new Searcher();
    if (oalesPay.pageType == "payment") {
        com.focusPage("#addOalesPay").remove();
        var url = api.sales.pageOalesPay;
        option = {
            "paging.page": 1,
            "paging.rows": 10
        };
        searcher.base("condList", "pagenation", "resultList", url);
        searcher.condition(['sales-oales-no', 'sales-oales-orderId', 'sales-oales-createTime', 'sales-oales-status', 'sales-oales-brand', 'sales-oales-category', 'sales-oalesPay-payTime']);
        searcher.history("oalsePayPostData");
        var lineprops = [{
            fieId: "name",
            name: "名称",
            prop: "name",
            clazz: "blue"
        }, {
            field: "money",
            name: "金额",
            prop: "money",
            clazz: "grey"
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        }, {
            field: "payTime",
            name: "付款时间",
            prop: "payTime",
            clazz: "green"
        }, {
            field: "type",
            name: "类型",
            prop: "type",
            clazz: "red",
            dataset: constant.sales().oalespay.type.keys
        }, {
            field: "comment",
            name: "备注",
            prop: "comment",
            clazz: "blue"
        }, {
            type: "newline"
        }, {
            fieId: "orderId",
            name: "装修单号",
            prop: "oales.decoration.orderId",
            clazz: "blue",
            click: function(btn, v) {

                tools.decoration.info(btn, v.oales.decoration.orderId);
            }
        }, {
            field: "village",
            name: "楼盘",
            prop: "oales.decoration.house.village.name",
            clazz: "grey"
        }, {
            field: "houseNumber",
            name: "楼号",
            prop: "oales.decoration.house.houseNumber",
            clazz: "grey"
        }, {
            field: "supplier",
            name: "厂商",
            prop: "oales.supplier.currentName",
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.oales.supplier.userId);
            }
        }, {
            field: "creater",
            name: "创建人",
            prop: "creater.currentName",
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.creater.userId);
            }
        }, {
            field: "servicer",
            name: "服务管家",
            prop: "oales.servicer.currentName",
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.oales.servicer.userId);
            }
        }, {
            field: "materialer",
            name: "主材员",
            prop: "oales.materialer.currentName",
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.oales.materialer.userId);
            }
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "oales.createTime",
            clazz: "green"
        }, {
            field: "checkTime",
            name: "复核时间",
            prop: "oales.checkTime",
            clazz: "green"
        }, {
            field: "brand",
            name: "品牌",
            prop: "oales.brand",
            clazz: "grey",
            click: function(btn, v) {
                tools.brand.info(btn, v.oales.bid);
            }
        }, {
            field: "category",
            name: "品类",
            prop: "oales.category",
            clazz: "grey"
        }, {
            field: "atttype",
            name: "类型",
            prop: "oales.atttype",
            clazz: "red",
            dataset: constant.sales().oales.atttype.keys,
        }, {
            field: "awardType",
            name: "奖励类型",
            prop: "oales.awardType",
            clazz: "red",
            dataset: constant.sales().oales.awardType.keys,
        }, {
            field: "total",
            name: "总额",
            prop: "oales.total",
            clazz: "blue"
        }, {
            field: "award",
            name: "奖励",
            prop: "oales.award",
            clazz: "blue"
        }, {
            field: "profit",
            name: "利润",
            prop: "oales.profit",
            clazz: "blue"
        }, {
            field: "cost",
            name: "成本",
            prop: "oales.cost",
            clazz: "blue"
        }, {
            field: "threshold",
            name: "系数",
            prop: "oales.threshold",
            clazz: "blue"
        }, {
            fieId: "status",
            name: "状态",
            prop: "oales.status",
            clazz: "red",
            dataset: constant.sales().oales.status.keys,
        }];
        var linebtns = [{
            name: "编辑",
            clazz: "btn-success",
            handle: function (v) {
                oalesPay.opid = v.opid;
                oalesPay.items.name.val(v.name);
                oalesPay.items.money.val(v.money);
                oalesPay.items.comment.val(v.comment);
                oalesPay.items.payTime.val(v.payTime);
                oalesPay.items.type = com.focusPage("#type").bindData(constant.sales().oalespay.type.datas, "key", "value");
                oalesPay.modals.oalesPayModal.modal("show");
                return false;
            },
        }, {
            name: "删除",
            clazz: "btn-warning",
            handle: function (v) {
                remove(v.opid);
            },
        },];
        searcher.line("name", lineprops, linebtns).render();
    } else {
        com.focusPage("#pageing").remove();
        com.focusPage('#fl-statement').statement("外销单", "付款");
        showOalesPay();
    }

    function showOalesPay() {
        com.post(api.sales.queryOalesPay, {"oalesPay.oid": params.sales.oales.oid}, function (res) {
            var listData = res.oalesPays;
            var $tableWrap = com.focusPage('#list');
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');
            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                    var $h3 = $('<h3></h3>');
                    var $small = $('<small></small>').addClass('blue').html(v.name);
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                    var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
                    var $btnDelete = $('<a></a>').addClass('btn btn-minier btn-success').html('删除');

                    var propertyArr = [["名称:", v.name, "grey"], ["金额:", v.money, "grey"], ["创建人:", v.creater.currentName, "grey"], ["创建时间:", v.createTime, "green"], ["付款时间:", v.payTime, "green"], ["类型:", constant.sales().oalespay.type.keys[v.type], "red"], ["备注:", v.comment, "grey"]];

                    $.each(propertyArr, function (index, value) {

                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });
                    $btnDiv.append($btnEdit).append($btnDelete);

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);

                    $small.appendTo($h3);
                    $btnDiv.appendTo($h3);

                    $btnEdit.click(function () {

                        oalesPay.opid = v.opid;
                        oalesPay.items.name.val(v.name);
                        oalesPay.items.money.val(v.money);
                        oalesPay.items.comment.val(v.comment);
                        oalesPay.items.payTime.val(v.payTime);
                        oalesPay.items.type = com.focusPage("#type").bindData(constant.sales().oalespay.type.datas, "key", "value");
                        oalesPay.modals.oalesPayModal.modal("show");
                    });

                    $btnDelete.click(function () {
                        remove(v.opid);
                    })

                });

                $ul.appendTo($tableWrap);
            }

        }, null, false);
    }


    function showAdd() {
        oalesPay.opid = null;

        oalesPay.modals.oalesPayModal.modal("show");
    }

    function saveData() {

        if (com.validate('oalesPayModal'))
            return false;

        var url = api.sales.addOalesPay;

        var options = {
            "oalesPay.name": oalesPay.items.name.val(),
            "oalesPay.money": oalesPay.items.money.val(),
            "oalesPay.type": oalesPay.items.type.val(),
            "oalesPay.payTime": oalesPay.items.payTime.val(),
            "oalesPay.comment": oalesPay.items.comment.val()
        };
        if (oalesPay.opid) {
            url = api.sales.updateOalesPay;
            options["oalesPay.opid"] = oalesPay.opid;
        }
        if (oalesPay.pageType != "payment") {
            options["oalesPay.oid"] = params.sales.oales.oid;
        }

        com.post(url, options, function (res) {
            if (oalesPay.pageType == "payment") {
                searcher.doSearch();
            } else {
                com.focusPage("#list").empty();
                showOalesPay();
            }
        });

        oalesPay.modals.oalesPayModal.modal("hide");
        com.showAlert(com.info, "操作成功");
    }

    function remove(opid) {

        var options = {
            "oalesPay.opid": opid,
        };
        com.post(api.sales.deleteOalesPay, options, function (res) {
            com.focusPage("#list").empty();
            showOalesPay();
            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });
    }
});
