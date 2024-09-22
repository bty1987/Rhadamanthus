jQuery(function($) {

    var awardPurchase = {

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
            saveInw: com.focusPage("#saveInw").on("click", saveW),
            saveBap: com.focusPage("#saveBap").on("click", saveB),
        },

        modals: {
            awardPurchaseModal: com.focusPage("#awardPurchaseModal"),
            purchaseModal: com.focusPage("#purchaseModal"),
            bapriceModal: com.focusPage("#bapriceModal"),
        },

        items: {
            inprice: com.focusPage("#inprice", "#purchaseModal"),
            warehousing: com.focusPage("#warehousing", "#purchaseModal"),
            baprice: com.focusPage("#baprice", "#bapriceModal"),
            num: com.focusPage("#num", "#awardPurchaseModal"),
            activity: com.focusPage("#activity", "#awardPurchaseModal"),
            dept: com.focusPage("#dept", "#awardPurchaseModal"),
            comment: com.focusPage("#comment", "#awardPurchaseModal"),
        },

        apid: null,
        asid: null,
        surplus: null,
        fapid: params.fapid,
        status: {},
        storeroom: {},

        pageType: params.urlLoadParams.pagetype,
    };

    awardPurchase.modals.awardPurchaseModal.on('hide.bs.modal', function(e) {

        com.cleanTypeahead("awardStock");
        com.cleanItems(awardPurchase.items);
        com.closeTip();
    });

    com.initTypeahead('awardStock', api.information.queryAwardStockByName, "awardStock.name", {}, "awardStocks", "asId", function(v) {

        return v.name + "-" + constant.information().activityItem.storeroom.keys[v.storeroom];
    }, null);

    awardPurchase.modals.awardPurchaseModal.on('hide.bs.modal', function() {

        com.clearValidator();
        com.cleanItems(awardPurchase.items);
    });

    var searcher = new Searcher();

    if (awardPurchase.pageType == null || awardPurchase.pageType == '') {

        $("#awardPurchase").show();

        searcher.base("condList", "pagenation", "resultList", api.information.pageAwardPurchase);
        searcher.condition(['information-awardPurchase-no', 'information-awardPurchase-name', 'information-awardPurchase-activity', 'information-awardPurchase-dept', "information-awardPurchase-createTime", "information-awardPurchase-purchaseTime", "information-awardPurchase-instoreTime", 'information-awardPurchase-type', "information-award-status"]);
        searcher.history("awardPurchasePostDate");

        searcher.button([{
            id: "addAwardPurchase",
            name: "创建",
            clazz: "btn-yellow",
            icon: "icon-plus"
        }]);

        var lineprops = [{
            fieId: "awardStock",
            name: "库存",
            prop: "awardStock.name",
            clazz: "blue"
        }, {
            fieId: "inprice",
            name: "入库价",
            prop: "inprice",
            clazz: "blue"
        }, {
            fieId: "baprice",
            name: "结算价",
            prop: "baprice",
            clazz: "blue"
        }, {
            fieId: "num",
            name: "数量",
            prop: "num",
            clazz: "blue"
        }, {
            fieId: "surplus",
            name: "剩余数量",
            prop: "surplus",
            clazz: "blue"
        }, {
            fieId: "status",
            name: "状态",
            prop: "status",
            clazz: "red",
            dataset: constant.information().awardPurchase.status.keys
        }, {
            field: "creater",
            name: "创建人",
            prop: "creater.userName",
            clazz: "grey"
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        }, {
            field: "purchaser",
            name: "采购员",
            prop: "purchaser.userName",
            clazz: "grey"
        }, {
            field: "purchaseTime",
            name: "采购时间",
            prop: "purchaseTime",
            clazz: "green"
        }, {
            field: "instorer",
            name: "入库员",
            prop: "instorer.userName",
            clazz: "grey"
        }, {
            field: "instoreTime",
            name: "入库时间",
            prop: "instoreTime",
            clazz: "green"
        }, {
            field: "balanceTime",
            name: "仓储时间",
            prop: "balanceTime",
            clazz: "green"
        }, {
            field: "activity",
            name: "活动名称",
            prop: "activity",
            clazz: "grey"
        }, {
            field: "dept",
            name: "部门",
            prop: "dept",
            clazz: "grey"
        }, {
            field: "comment",
            name: "备注",
            prop: "comment",
            clazz: "grey"
        }];

        var linebtns = [{
            name: "采购",
            clazz: "btn-yellow",
            handle: function(v) {

                com.post(api.information.purchaseAwardPurchase, {
                    "awardPurchase.apid": v.apid
                }, function(res) {

                    searcher.doSearch();
                    com.showAlert(com.info, "操作成功");
                });
                return false;
            },
            show: function(v) {

                return (v.status == constant.information().awardPurchase.STATUS_INIT_INT);
            }
        }, {
            name: "入库",
            clazz: "btn-green",
            handle: function(v) {

                awardPurchase.apid = v.apid;
                awardPurchase.surplus = v.surplus;
                warehouse(v);
                return false;
            },
            show: function(v) {

                return (v.status == constant.information().awardPurchase.STATUS_PROC_INT);
            }
        }, {
            name: "结算",
            clazz: "btn-success",
            handle: function(v) {

                awardPurchase.apid = v.apid;
                account(v);
                return false;
            },
            show: function(v) {

                return (v.status == constant.information().awardPurchase.STATUS_WARE_INT);
            }
        }, {
            name: "撤销",
            clazz: "btn-danger",
            handle: function(v) {

                saveC(v.apid);
                return false;
            },
            show: function(v) {

                return (v.status == constant.information().awardPurchase.STATUS_INIT_INT);
            }
        }, {
            name: "明细",
            clazz: "btn-purple",
            handle: function(v) {

                detail(v);
                return false;
            },
            show: function(v) {

                return (v.fapid != null && v.fapid != 0);
            }
        }, ];

        searcher.line("awardStock.name", lineprops, linebtns).render();
    } else if (awardPurchase.pageType == "item") {

        com.focusPage('#fl-statement').statement("奖品采购", "明细");

        com.focusPage("#detailPopUp", "#detailPopUp").addClass("page-content").show();

        showDetail();
    }

    function showDetail() {

        com.post(api.information.queryAwardPurchaseByFapid, {
            "awardPurchase.fapid": params.infomation.awardPurchase.fapid
        }, function(res) {

            var listData = res.awardPurchases;

            var $tableWrap = com.focusPage('#list');
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            var $tableWrapp = com.focusPage('#listp');
            var $ulp = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if (!listData || listData.length == 0)
                return false;

            $.each(listData, function(i, v) {

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                var $h3 = $('<h3></h3>').addClass('oid');
                var $small = $('<small></small>').addClass('blue').html(v.awardStock.name);
                var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                var $btnPurchase = $('<a></a>').addClass('btn btn-minier btn-yellow').html('采购');
                var $btnInventory = $('<a></a>').addClass('btn btn-minier btn-green').html('入库');
                var $btnAccount = $('<a></a>').addClass('btn btn-minier btn-success').html('结算');
                var $btnRepeal = $('<a></a>').addClass('btn btn-minier btn-danger').html('撤销');

                var propertyArr = [["库存:", v.awardStock.name, "blue"], ["入库价:", v.inprice, "blue"], ["结算价:", v.baprice, "blue"], ["数量:", v.num, "blue"], ["剩余数量:", v.surplus, "blue"], ["状态:", constant.information().awardPurchase.status.keys[v.status], "red"], ["创建人:", v.creater.userName, "grey"], ["创建时间:", v.createTime, "green"], ["采购员:", v.purchaser.userName, "grey"], ["采购时间:", v.purchaseTime, "green"], ["入库员:", v.instorer.userName, "grey"], ["入库时间:", v.instoreTime, "green"], ["仓储时间:", v.balanceTime, "green"], ["活动名称:", v.activity, "grey"], ["部门:", v.dept, "grey"], ["备注:", v.comment, "grey"]];

                $.each(propertyArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });
                if (v.status == constant.information().awardPurchase.STATUS_INIT_INT) {
                    $btnDiv.append($btnPurchase)
                } else if (v.status == constant.information().awardPurchase.STATUS_PROC_INT) {
                    $btnDiv.append($btnInventory)
                } else if (v.status == constant.information().awardPurchase.STATUS_WARE_INT) {
                    $btnDiv.append($btnAccount)
                } else if (v.status == constant.information().awardPurchase.STATUS_INIT_INT) {
                    $btnDiv.append($btnRepeal)
                }

                if (v.fapid && v.fapid != 0)
                    $liLine.appendTo($ul);
                else
                    $liLine.appendTo($ulp);
                $liLine.append($h3).append($ulProperty);

                $small.appendTo($h3);
                $btnDiv.appendTo($h3);

                $btnPurchase.click(function() {

                    com.post(api.information.purchaseAwardPurchase, {
                        "awardPurchase.apid": v.apid
                    }, function(res) {

                        searcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                });

                $btnInventory.click(function() {

                    awardPurchase.apid = v.apid;
                    awardPurchase.surplus = v.surplus;
                    warehouse(v);
                });

                $btnAccount.click(function() {

                    awardPurchase.apid = v.apid;
                    account(v);
                });

                $btnRepeal.click(function() {

                    saveC(v.apid);
                });

            });

            $ul.appendTo($tableWrap);
            $ulp.appendTo($tableWrapp);
        }, null, false);
    }

    com.focusPage('#addAwardPurchase', '#pagenation').on("click", function() {

        awardPurchase.modals.awardPurchaseModal.modal("show");
    });

    function warehouse(v) {

        awardPurchase.modals.purchaseModal.modal("show");
    }

    function account(v) {

        awardPurchase.modals.bapriceModal.modal("show");
    }

    function saveW() {

        if (com.validate('purchaseModal'))
            return false;

        var options = {
            "awardPurchase.apid": awardPurchase.apid,
            "awardPurchase.inprice": awardPurchase.items.inprice.val(),
            "awardPurchase.num": awardPurchase.items.warehousing.val()
        };

        com.post(api.information.instoreAwardPurchase, options, function(res) {

            searcher.doSearch();
        });

        awardPurchase.modals.purchaseModal.modal("hide");
    }

    function saveB() {

        if (com.validate('bapriceModal'))
            return false;

        var options = {
            "awardPurchase.apid": awardPurchase.apid,
            "awardPurchase.baprice": awardPurchase.items.baprice.val()
        };

        com.post(api.information.balanceAwardPurchase, options, function(res) {

            searcher.doSearch();
        });

        awardPurchase.modals.bapriceModal.modal("hide");
    }

    function saveC(apid) {

        com.post(api.information.cancelAwardPurchase, {
            "awardPurchase.apid": apid,
        }, function(res) {

            searcher.doSearch();
        });
    }

    function detail(v) {

        com.focusPage("#detailPopUp").show();
        params.urlLoadParams.pagetype = "item";
        params.infomation.awardPurchase = v;
        com.popup4page("#detailPopUp", "/views/information/awardPurchase.html?pagetype=item", "明细");

    }

    function saveData() {

        if (com.validate('awardPurchaseModal'))
            return false;

        var options = {
            "awardPurchase.awardStock.asId": com.typeahead("awardStock"),
            "awardPurchase.num": awardPurchase.items.num.val(),
            "awardPurchase.activity": awardPurchase.items.activity.val(),
            "awardPurchase.dept": awardPurchase.items.dept.val(),
            "awardPurchase.comment": awardPurchase.items.comment.val(),
        };

        com.post(api.information.addAwardPurchase, options, function(res) {

            searcher.doSearch();
        });

        awardPurchase.modals.awardPurchaseModal.modal("hide");
    }
});
