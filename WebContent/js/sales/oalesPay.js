jQuery(function ($) {

    var oalesPay = {

        btns: {
            saveOalesPayBtn: com.focusPage("#saveOalesPayBtn").on("click", saveData),
            addOalesPay: com.focusPage("#addOalesPay").on("click", showAdd),
            saveCreateTime: com.focusPage("#saveCreateTime").on("click", saveTime),
        },

        modals: {
            oalesPayModal: com.focusPage("#oalesPayModal"),
            createrTimeModal: com.focusPage("#createrTimeModal"),
        },

        items: {
            name: com.focusPage("#name", "#oalesPayModal"),
            money: com.focusPage("#money", "#oalesPayModal"),
            type: com.focusPage("#type", "#oalesPayModal"),
            comment: com.focusPage('#comment', "#oalesPayModal"),
            payTime: com.focusPage('#payTime', "#oalesPayModal"),
            createTime: com.focusPage('#createTime', "#createrTimeModal"),
        },

        oid: null,
        opid: null,
        type: constant.sales().oalespay.type.keys,
        pageType: params.urlLoadParams.pagetype
    };
    com.datetime(com.focusPage("#payTime"));
    com.datetime(com.focusPage("#createTime"));

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
        searcher.condition(['sales-oales-no', 'sales-oales-orderId', 'sales-oales-createTime', 'sales-oales-status', 'sales-oales-type', 'sales-oales-brand', 'sales-oales-category', 'sales-oalesPay-payTime', 'sales-oales-checkTime', 'sales-oales-confirmTime', 'sales-oales-confirmTime']);
        searcher.history("oalsePayPostData");
        searcher.button([{
            id: "exportOalesPay",
            name: "导出",
            clazz: "btn-yellow",
            icon: "icon-plus"
        }]);

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
            fieId: "oales.no",
            name: "外销单号",
            prop: "oales.no",
            clazz: "blue"
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
            field: "channer",
            name: "渠道",
            prop: "oales.channer.currentName",
            clazz: "grey",
            click: function(btn, v) {

                tools.personel.info(btn, v.channer.userId);
            }
        }, {
            field: "cdept",
            name: "渠道部门",
            prop: "oales.dept.name",
            clazz: "grey"
        }, {
            field: "cfatherDept",
            name: "渠道分区",
            prop: "oales.region.name",
            clazz: "grey"
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
            field: "confirmTime",
            name: "确认时间",
            prop: "oales.confirmTime",
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
            field: "type",
            name: "外销单类型",
            prop: "oales.type",
            clazz: "red",
            dataset: constant.sales().oales.type.keys,
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
        }, {
            name: "归属",
            clazz: "btn-purple",
            handle: function (v) {

                oalesPay.opid = v.opid;
                oalesPay.items.createTime.val(v.createTime);
                oalesPay.modals.createrTimeModal.modal("show");
                return false;
            },
        }];
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
                    var $btnCreateTime = $('<a></a>').addClass('btn btn-minier btn-purple').html('归属');

                    var propertyArr = [["名称:", v.name, "grey"], ["金额:", v.money, "grey"], ["创建人:", v.creater.currentName, "grey"], ["创建时间:", v.createTime, "green"], ["付款时间:", v.payTime, "green"], ["类型:", constant.sales().oalespay.type.keys[v.type], "red"], ["备注:", v.comment, "grey"]];

                    $.each(propertyArr, function (index, value) {

                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });
                    $btnDiv.append($btnEdit).append($btnDelete).append($btnCreateTime);

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
                    $btnCreateTime.click(function () {

                        oalesPay.opid = v.opid;
                        oalesPay.items.createTime.val(v.createTime);
                        oalesPay.modals.createrTimeModal.modal("show");
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

    com.focusPage('#exportOalesPay', '#pagenation').on("click", function () {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 2000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.sales.pageOalesPay, $.extend({}, params["oalsePayPostData"], {
            "paging.noPage": 1
        }), function (res) {

            $.exceler({
                column: [['名称', 'name'], ['金额', 'money'], ['类型', 'type'],['品类', 'oales.category'], ['品牌', 'oales.brand'], ['供应商', 'oales.supplier.currentName'], ['装修单号', 'oales.decoration.orderId'], ['楼盘', 'oales.decoration.house.village.name'], ['地址', 'oales.decoration.house.houseNumber'], ['外销单号', 'oales.no'], ['状态', 'oales.status'], ['主材员', 'oales.materialer.currentName'], ['主材员ID', 'oales.materialer.userId'], ['设计师', 'oales.decoration.designer.currentName'], ['设计师ID', 'oales.decoration.designer.userId'], ['部门', 'oales.dept.name'], ['分区', 'oales.region.name'], ['渠道', 'oales.channer.currentName'], ['渠道ID', 'oales.channer.userId'], ['服务管家', 'oales.servicer.currentName'], ['服务管家ID', 'oales.servicer.userId'], ['创建人', 'creater.currentName'], ['创建时间', 'createTime'], ['付款时间', 'payTime'], ['复核时间', 'oales.checkTime'], ['确认时间', 'oales.confirmTime'], ['总额', 'oales.total'], ['类型', 'oales.atttype'], ['奖励类型', 'oales.awardType'], ['成本', 'oales.cost'], ['系数', 'oales.threshold'], ['利润', 'oales.profit'], ['奖励', 'oales.award'], ['备注', 'comment']],
                list: res.paging.data,
            }, function (v) {

                v.oales.status = constant.sales().oales.status.keys[v.oales.status];
                v.oales.atttype = constant.sales().oales.atttype.keys[v.oales.atttype];
                v.oales.awardType = constant.sales().oales.awardType.keys[v.oales.awardType];
                v.type = constant.sales().oalespay.type.keys[v.type];
            });
        });

    });

    function saveData() {

        if (com.validate('oalesPayModal'))
            return false;

        var url = api.sales.addOalesPay;

        var options = {
            "oalesPay.name": oalesPay.items.name.val(),
            "oalesPay.money": oalesPay.items.money.val(),
            "oalesPay.payTime": oalesPay.items.payTime.val(),
            "oalesPay.comment": oalesPay.items.comment.val(),
            "oalesPay.type": params.sales.oales.type,
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

    function saveTime() {

        if (com.validate('createrTimeModal'))
            return false;

        var url = api.sales.updateOalesPayForAdvance;

        var options = {
            "oalesPay.opid": oalesPay.opid,
            "oalesPay.createTime": oalesPay.items.createTime.val()
        }

        com.post(url, options, function (res) {

            if (oalesPay.pageType == "payment") {
                searcher.doSearch();
            } else {
                com.focusPage("#list").empty();
                showOalesPay();
            }
            oalesPay.modals.createrTimeModal.modal("hide");
            com.showAlert(com.info, "操作成功");
        })
    }
});
