jQuery(function($) {

    var oales = {

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
            balanceOalesBtn: com.focusPage("#balanceOalesBtn").on("click", balanceOalesData)
        },

        modals: {
            oalesModal: com.focusPage("#oalesModal"),
            accountModal: com.focusPage("#accountModal"),
        },

        items: {
            orderId: com.focusPage("#orderId", "#oalesModal"),
            total: com.focusPage("#total", "#oalesModal"),
            comment: com.focusPage("#comment", "#oalesModal"),
            brandName: com.focusPage('#brandName', "#oalesModal"),
            service: com.focusPage('#service', "#oalesModal"),
            channer: com.focusPage('#channer', "#oalesModal"),
            atttype: com.focusPage("#atttype", "#oalesModal"),
            cost: com.focusPage('#cost', "#oalesModal"),
            threshold: com.focusPage("#threshold", "#oalesModal"),
            materialer: com.focusPage("#materialer", "#oalesModal"),
            award: com.focusPage('#award', "#oalesModal"),
            profit: com.focusPage('#profit', "#oalesModal"),
            awardType: com.focusPage('#awardType', "#oalesModal"),
            balanceOales: com.focusPage('#balanceOales', "#accountModal"),
        },

        drawingModal: com.focusPage('#drawingModal').on("show.bs.modal", function(a) {

            com.clearValidator();
        }),

        oid: null,
        bid: null,
        house: null,
        status: {},
        atttypes: {},
        awardTypes: {},
        refund: null,

        pageType: params.urlLoadParams.pagetype,

        creater: params.userInfo.user
    };

    oales.modals.oalesModal.on('hide.bs.modal', function(e) {

        com.cleanTypeahead("brandName");
        com.cleanTypeahead("service");
        com.cleanTypeahead("channer");
        com.cleanTypeahead("materialer");
        com.cleanItems(oales.items);
        com.closeTip();
    });

    com.initTypeahead("brandName", api.data.queryBrandByPinyin, "brand.pinyin", {}, 'brands', 'bid', 'name', function(list, k, v) {

        $.each(list, function(index, val) {

            if (val.bid == k) {
                oales.bid = val.bid;
                oales.items.brandName.val(val.name);
            }
        });
        return v;
    });

    com.initTypeahead(oales.items.balanceOales, api.balance.queryBalanceOales, "balanceOales.name", {}, "balanceOaleses", "boid", function(v) {

        return v["name"] + " " + v["grade"]
    });

    oales.items.atttype.bindData(constant.sales().oales.atttype.datas, "key", "value");
    oales.items.awardType.bindData(constant.sales().oales.awardType.datas, "key", "value");

    com.initTypeahead('service', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('materialer', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('channer', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, 'autoFillKeyValue', 'key', 'value', null);

    var url = api.sales.pageOales;

    var conditions = ['sales-oales-no', 'sales-oales-orderId', 'sales-oales-category', 'sales-oales-brand', 'sales-oales-createTime', 'sales-oales-confirmTime', 'sales-oales-checkTime', 'sales-oales-status'];
    var options = {};
    var history = "oalsePostData";

    if (oales.pageType == "serve") {
        history = "oalesServicePostDate";
    } else if (oales.pageType == "material") {
        conditions.splice(4, 0, 'sales-oales-region', 'sales-oales-dept');
        options = $.extend({}, options, {
            "statuses[0]": 1,
            "statuses[1]": 3
        });
        history = "oalesMaterialPostDate";
    } else if (oales.pageType == "finance") {
        options = $.extend({}, options, {
            "statuses[0]": 2,
            "statuses[1]": 4
        });
        history = "oalesFinancePostDate";
    } else if (oales.pageType == "account") {
        url = api.sales.pageOalesForAccount
        history = "oalesAccountPostDate";
    }

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", url);
    searcher.condition(conditions);
    searcher.history(history);

    searcher.param(options);

    if (oales.pageType == "serve") {
        searcher.button([{
            id: "addOales",
            name: "创建",
            clazz: "btn-yellow",
            icon: "icon-plus"
        }]);
    }
    if (oales.pageType == "material") {
        searcher.button([{
            id: "exportOales",
            name: "导出",
            clazz: "btn-yellow",
            icon: "icon-plus"
        }]);
    }

    if (oales.pageType == "finance") {
        searcher.button([{
            id: "checkAll",
            name: "全选",
            clazz: "btn-pink",
            icon: "icon-plus"
        }, {
            id: "batchCheck",
            name: "批量复核",
            clazz: "btn-inverse",
            icon: "icon-plus"
        }]);
    }
    if (oales.pageType == "account") {
        searcher.button([{
            id: "checkAll",
            name: "全选",
            clazz: "btn-pink",
            icon: "icon-plus"
        }, {
            id: "accountOales",
            name: "对账",
            clazz: "btn-danger",
            icon: "icon-plus"
        }]);
    }
    var lineprops = [{
        field: "oid",
        type: "checkbox",
        name: "oalesId",
        prop: "oid"
    }, {
        fieId: "orderId",
        name: "装修单号",
        prop: "decoration.orderId",
        clazz: "blue",
        click: function(btn, v) {

            tools.decoration.info(btn, v.decoration.orderId);
        },
    }, {
        field: "village",
        name: "楼盘",
        prop: "decoration.house.village.name",
        clazz: "grey"
    }, {
        field: "houseNumber",
        name: "楼号",
        prop: "decoration.house.houseNumber",
        clazz: "grey"
    }, {
        field: "supplier",
        name: "厂商",
        prop: "supplier.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.supplier.userId);
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
        prop: "servicer.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.servicer.userId);
        }
    }, {
        field: "channer",
        name: "渠道",
        prop: "channer.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.channer.userId);
        }
    }, {
        field: "cdept",
        name: "渠道部门",
        prop: "dept.name",
        clazz: "grey"
    }, {
        field: "cfatherDept",
        name: "渠道分区",
        prop: "region.name",
        clazz: "grey"
    }, {
        field: "materialer",
        name: "主材员",
        prop: "materialer.currentName",
        clazz: "grey",
        click: function(btn, v) {

            tools.personel.info(btn, v.materialer.userId);
        },
        show: function(v) {

            return (v.status == constant.sales().oales.STATUS_CHECK_INT || v.status == constant.sales().oales.STATUS_CONFIRM_INI);
        }
    }, {
        field: "customer",
        name: "客户名",
        prop: "decoration.customer.name",
        clazz: "grey",
        click: function(btn, v) {

            tools.customer.info(btn, v.decoration.customer.cid);
        },
        show: function(v) {

            return (oales.pageType == "material");
        }
    }, {
        field: "dept",
        name: "部门",
        prop: "dept.name",
        clazz: "grey",
        click: function(btn, v) {

            tools.department.info(btn, v.dept.did);
        },
        show: function(v) {

            return (oales.pageType == "material");
        }
    }, {
        field: "region",
        name: "分区",
        prop: "region.name",
        clazz: "grey",
        click: function(btn, v) {

            tools.department.info(btn, v.region.did);
        },
        show: function(v) {

            return (oales.pageType == "material");
        }
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "confirmTime",
        name: "确认时间",
        prop: "confirmTime",
        clazz: "green"
    }, {
        field: "checkTime",
        name: "复核时间",
        prop: "checkTime",
        clazz: "green",
        show: function(v) {

            return (v.status == constant.sales().oales.STATUS_CHECK_INT || v.status == constant.sales().oales.STATUS_CONFIRM_INI);
        }
    }, {
        field: "brand",
        name: "品牌",
        prop: "brand",
        clazz: "grey",
        click: function(btn, v) {

            tools.brand.info(btn, v.bid);
        }
    }, {
        field: "category",
        name: "品类",
        prop: "category",
        clazz: "grey"
    }, {
        field: "atttype",
        name: "类型",
        prop: "atttype",
        clazz: "red",
        dataset: constant.sales().oales.atttype.keys,
    }, {
        field: "awardType",
        name: "奖励类型",
        prop: "awardType",
        clazz: "red",
        dataset: constant.sales().oales.awardType.keys,
    }, {
        field: "total",
        name: "总额",
        prop: "total",
        clazz: "blue"
    }, {
        field: "award",
        name: "奖励",
        prop: "award",
        clazz: "blue"
    }, {
        field: "profit",
        name: "利润",
        prop: "profit",
        clazz: "blue"
    }, {
        field: "cost",
        name: "成本",
        prop: "cost",
        clazz: "blue",
        show: function(v) {

            return (v.status == constant.sales().oales.STATUS_CHECK_INT || v.status == constant.sales().oales.STATUS_CONFIRM_INI);
        }
    }, {
        field: "threshold",
        name: "系数",
        prop: "threshold",
        clazz: "blue",
        show: function(v) {

            return (v.status == constant.sales().oales.STATUS_CHECK_INT || v.status == constant.sales().oales.STATUS_CONFIRM_INI);
        }
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.sales().oales.status.keys,
    }, {
        fieId: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.sales().oales.type.keys,
    }, {
        field: "isScale",
        name: "计入配比",
        prop: "isScale",
        clazz: "purple",
        dataset: constant.sales().oales.isScale.keys,
    }, {
        field: "isActivity",
        name: "计入积分",
        prop: "isActivity",
        clazz: "purple",
        dataset: constant.sales().oales.isActivity.keys,
    }];
    var linebtns = [{
        name: "编辑",
        clazz: "btn-success",
        handle: function(v) {

            oales.oid = v.oid;

            oales.items.orderId.val(v.decoration.orderId);
            oales.items.brandName.val(v.brand);
            oales.items.atttype.val(v.atttype);

            com.updateTypeahead(oales.items.service, v.servicer.userId, v.servicer.currentName);
            com.updateTypeahead(oales.items.channer, v.channer.userId, v.channer.currentName);
            com.updateTypeahead(oales.items.materialer, v.materialer.userId, v.materialer.currentName);

            oales.items.total.val(v.total);
            oales.items.cost.val(v.cost);
            oales.items.threshold.val(v.threshold);
            oales.items.profit.val(v.profit);
            oales.items.award.val(v.award);
            oales.items.awardType.val(v.awardType);

            com.focusPage("#orderId").attr("disabled", "disabled");
            com.focusPage(".material").hide();

            oales.modals.oalesModal.modal("show");
            return false;
        },
        show: function(v) {

            return (v.status == constant.sales().oales.STATUS_INIT_INT && oales.pageType != "account");
        }
    }, {
        name: "编辑",
        clazz: "btn-success",
        handle: function(v) {

            oales.oid = v.oid;

            oales.items.orderId.val(v.decoration.orderId);
            oales.items.brandName.val(v.brand);
            oales.items.atttype.val(v.atttype);

            com.updateTypeahead(oales.items.service, v.servicer.userId, v.servicer.currentName);
            com.updateTypeahead(oales.items.channer, v.channer.userId, v.channer.currentName);
            com.updateTypeahead(oales.items.materialer, v.materialer.userId, v.materialer.currentName);

            oales.items.total.val(v.total);
            oales.items.cost.val(v.cost);
            oales.items.threshold.val(v.threshold);
            oales.items.profit.val(v.profit);
            oales.items.award.val(v.award);
            oales.items.awardType.val(v.awardType);

            com.focusPage(".serve").hide();

            oales.modals.oalesModal.modal("show");
            return false;
        },
        show: function(v) {

            return (oales.pageType == "material" && (v.status == constant.sales().oales.STATUS_SUBMIT_INI || v.status == constant.sales().oales.STATUS_REJECT_INT));
        }
    }, {
        name: "编辑",
        clazz: "btn-success",
        handle: function(v) {

            oales.oid = v.oid;

            oales.items.orderId.val(v.decoration.orderId);
            oales.items.brandName.val(v.brand);
            oales.items.atttype.val(v.atttype);

            com.updateTypeahead(oales.items.service, v.servicer.userId, v.servicer.currentName);
            com.updateTypeahead(oales.items.channer, v.channer.userId, v.channer.currentName);
            com.updateTypeahead(oales.items.materialer, v.materialer.userId, v.materialer.currentName);

            oales.items.total.val(v.total);
            oales.items.cost.val(v.cost);
            oales.items.threshold.val(v.threshold);
            oales.items.profit.val(v.profit);
            oales.items.award.val(v.award);
            oales.items.awardType.val(v.awardType);

            com.focusPage(".serve").hide();
            com.focusPage(".material").hide();
            com.focusPage(".finance").show();

            oales.modals.oalesModal.modal("show");

            return false;
        },
        show: function(v) {

            return (oales.pageType == "finance" && v.status == constant.sales().oales.STATUS_CONFIRM_INI);
        }
    }, {
        name: "提交",
        clazz: "btn-pink",
        handle: function(v) {

            submit(v.oid);
        },
        show: function(v) {

            return (v.status == constant.sales().oales.STATUS_INIT_INT && oales.pageType != "account");
        }
    }, {
        name: "删除",
        clazz: "btn-warning",
        handle: function(v) {

            remove(v.oid);
        },
        show: function(v) {

            return (v.status == constant.sales().oales.STATUS_INIT_INT && oales.pageType != "account");
        }
    }, {
        name: "撤销",
        clazz: "btn-search",
        handle: function(v) {

            revocation(v.oid);

        },
        show: function(v) {

            return (oales.pageType == "material" && (v.status == constant.sales().oales.STATUS_SUBMIT_INI || v.status == constant.sales().oales.STATUS_REJECT_INT));

        }
    }, {
        name: "完结",
        clazz: "btn-inverse",
        handle: function(v) {

            finishOales(v.oid);

        },
        show: function(v) {

            return false;
        }
    }, {
        name: "确认",
        clazz: "btn-danger",
        handle: function(v) {

            confirmOales(v.oid);
        },
        show: function(v) {

            return (oales.pageType == "material" && (v.status == constant.sales().oales.STATUS_SUBMIT_INI || v.status == constant.sales().oales.STATUS_REJECT_INT));
        }
    }, {
        name: "复核",
        clazz: "btn-pink",
        handle: function(v) {

            checkOales(v.oid);

        },
        show: function(v) {

            return (oales.pageType == "finance" && v.status == constant.sales().oales.STATUS_CONFIRM_INI);
        }
    }, {
        name: "驳回",
        clazz: "btn-purple",
        handle: function(v) {

            rejectOales(v.oid);

        },
        show: function(v) {

            return (oales.pageType == "finance" && v.status == constant.sales().oales.STATUS_CONFIRM_INI);
        }
    }, {
        name: "废单",
        clazz: "btn-inverse",
        handle: function(v) {

            invalid(v.oid);
        },
        show: function(v) {

            return (v.status != constant.sales().oales.STATUS_INVALID_INI && oales.pageType == "material");
        }
    }, {
        name: "付款",
        clazz: "btn-purple",
        handle: function(v) {

            payment(v);
        },
        show: function(v) {

            return (v.status != constant.sales().oales.STATUS_INVALID_INI && (oales.pageType == "material" || oales.pageType == "finance"));
        }
    }, {
        name: "退货",
        clazz: "btn-grey",
        handle: function(v) {

            oales.oid = v.oid;
            oales.refund = 1;
            com.focusPage(".serve").hide();
            com.focusPage(".material").hide();
            com.focusPage(".finance").hide();
            com.focusPage(".refund").show();

            oales.modals.oalesModal.modal("show");

            return false;
        },
        show: function(v) {

            return (v.type == constant.sales().oales.TYPE_PUR_INT && v.status == constant.sales().oales.STATUS_CHECK_INT);
        }
    }, {
        name: "图片",
        clazz: "btn-primary",
        handle: function(v) {

            managedrawing(v);
            initUploadBtn(v);
        },
        show: function(v) {

            return oales.pageType != "account";
        }
    }, {
        name: "查看项目",
        clazz: "btn-info",
        handle: function(v) {

            // 使用弹窗方式加载外销项页面，传递oid参数
            params.urlLoadParams = {
                oid: v.oid
            };
            com.popup4page("#oalesItemPopUp", "/views/sales/oalesItem.html", "外销项明细", null, function() {
                // 关闭弹窗时清理参数
                params.urlLoadParams = {};
            });
            return false;
        },
        show: function(v) {

            // 所有状态都可以查看项目
            return true;
        }
    }, {
        name: "操作记录",
        clazz: "btn-purple",
        handle: function(v) {

            // 使用弹窗方式加载操作记录页面，传递oid参数
            params.urlLoadParams = {
                oid: v.oid
            };
            com.popup4page("#oalesRecordPopUp", "/views/sales/oalesRecord.html", "外销单操作记录", null, function() {
                // 关闭弹窗时清理参数
                params.urlLoadParams = {};
            });
            return false;
        },
        show: function(v) {

            // 所有状态都可以查看操作记录
            return true;
        }
    }, {
        name: function(v) {

            return v.isScale == constant.sales().oales.isScale.ISSCALE_SCALE_INT ? "不计入配比" : "计入配比";
        },
        clazz: function(v) {

            return v.isScale == constant.sales().oales.isScale.ISSCALE_SCALE_INT ? "btn-warning" : "btn-success";
        },
        handle: function(v) {

            var newStatus = v.isScale == constant.sales().oales.isScale.ISSCALE_SCALE_INT
                ? constant.sales().oales.isScale.ISSCALE_NONE_INT
                : constant.sales().oales.isScale.ISSCALE_SCALE_INT;
            scaleOales(v.oid, newStatus);
        },
        show: function(v) {

            return oales.pageType != "account";
        }
    }, {
        name: function(v) {

            return v.isActivity == constant.sales().oales.isActivity.ISACTIVITY_YES_INT ? "不参与活动" : "参与活动";
        },
        clazz: function(v) {

            return v.isActivity == constant.sales().oales.isActivity.ISACTIVITY_YES_INT ? "btn-warning" : "btn-success";
        },
        handle: function(v) {

            var newStatus = v.isActivity == constant.sales().oales.isActivity.ISACTIVITY_YES_INT
                ? constant.sales().oales.isActivity.ISACTIVITY_NO_INT
                : constant.sales().oales.isActivity.ISACTIVITY_YES_INT;
            activityOales(v.oid, newStatus);
        },
        show: function(v) {

            return oales.pageType != "account";
        }
    }, ];

    searcher.line("no", lineprops, linebtns).render();

    com.focusPage('#addOales', '#pagenation').on("click", function() {

        oales.oid = null;
        com.focusPage("#orderId").attr("disabled", false);
        com.focusPage(".material").hide();
        oales.modals.oalesModal.modal("show");
    });
    com.focusPage('#checkAll').on("click", function() {

        if (com.focusPage('input[type="checkbox"]').prop('checked')) {
            com.focusPage('input[type="checkbox"]').removeAttr('checked');
            com.focusPage('input[type="checkbox"]').prop('checked', false);
        } else {
            com.focusPage('input[type="checkbox"]').attr('checked', true);
            com.focusPage('input[type="checkbox"]').prop('checked', true);
        }
    });
    com.focusPage('#batchCheck').on("click", function() {

        var oids = new Array();
        var index = com.focusPage('input[type="checkbox"]:checked');
        if (!index.length) {
            com.showAlert(com.warning, "请选择需要进行复核的外销单");
            return false;
        }
        var options = {};
        for ( var i = 0; i < index.length; i++) {

            var input = $(index[i]);
            var oids = input.val();

            options["oaleses[" + i + "].oid"] = oids;
        }
        com.post(api.sales.checkOales, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
    });

    com.focusPage('#accountOales').on("click", function() {

        oales.modals.accountModal.modal("show");
    });

    function balanceOalesData() {

        if (com.validate('accountModal'))
            return false;

        var oids = new Array();
        var index = com.focusPage('input[type="checkbox"]:checked');
        if (!index.length) {
            com.showAlert(com.warning, "请选择需要进行对账的外销单");
            return false;
        }
        var boid = com.typeahead(oales.items.balanceOales);
        var options = {};
        for ( var i = 0; i < index.length; i++) {

            var input = $(index[i]);
            var oids = input.val();

            options["balanceOalesItems[" + i + "].oales.oid"] = oids;
        }
        options["balanceOales.boid"] = boid
        com.post(api.balance.submitBalanceOales, options, function(res) {

            com.showAlert(com.info, "操作成功");
            oales.modals.accountModal.modal("hide");
            com.cleanTypeahead("balanceOales");
            searcher.doSearch();

        });
    }

    com.focusPage('#exportOales', '#pagenation').on("click", function() {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 2000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.sales.pageOales, $.extend({}, params[history], {
            "paging.noPage": 1
        }), function(res) {

            $.exceler({
                column: [['品类', 'category'], ['品牌', 'brand'], ['供应商', 'supplier.currentName'], ['装修单号', 'decoration.orderId'], ['楼盘', 'decoration.house.village.name'], ['地址', 'decoration.house.houseNumber'], ['外销单号', 'no'], ['状态', 'status'], ['主材员', 'materialer.currentName'], ['主材员ID', 'materialer.userId'], ['设计师', 'decoration.designer.currentName'], ['设计师ID', 'decoration.designer.userId'], ['部门', 'dept.name'], ['分区', 'region.name'], ['渠道', 'channer.currentName'], ['渠道ID', 'channer.userId'], ['服务管家', 'servicer.currentName'], ['服务管家ID', 'servicer.userId'], ['总额', 'total'], ['成本', 'cost'], ['系数', 'threshold'], ['利润', 'profit'], ['奖励', 'award']],
                list: res.paging.data,
            }, function(v) {

                v.status = constant.sales().oales.status.keys[v.status];
            });
        });
    });

    function saveData() {

        if (com.validate('oalesModal'))
            return false;

        var bid = com.typeahead("awardStock");

        var url = api.sales.addOales;
        
        var profit = utils.changeThrDecimal(utils.accSub(oales.items.total.val(), oales.items.cost.val()));

        var options = {
            "oales.decoration.orderId": oales.items.orderId.val(),
            "oales.bid": oales.bid,
            "oales.atttype": oales.items.atttype.val(),
            "oales.brand": oales.items.brandName.val(),
            "oales.total": oales.items.total.val(),
            "oales.cost": oales.items.cost.val(),
            "oales.profit": profit ? profit : 0,
            "oales.threshold": oales.items.threshold.val(),
            "oales.awardType": oales.items.awardType.val(),
            "oales.award": oales.items.award.val(),
        };

        if (com.typeahead("service")) {
            options["oales.servicer.userId"] = com.typeahead("service")
        }

        if (com.typeahead("channer")) {
            options["oales.channer.userId"] = com.typeahead("channer")
        }

        if (com.typeahead("materialer")) {
            options["oales.materialer.userId"] = com.typeahead("materialer")
        }

        if (oales.oid) {
            url = api.sales.updateOales;
            options["oales.oid"] = oales.oid;
        }
        
        if (oales.refund == 1) {
            url = api.sales.refundOales;
            options["oales.oid"] = oales.oid;
        }

        com.post(url, options, function(res) {

            searcher.doSearch();
            oales.modals.oalesModal.modal("hide");

            com.showAlert(com.info, "操作成功");

            com.cleanTypeahead("brandName");
            oales.refund = null;
        });
    }

    function remove(oid) {

        com.post(api.sales.deleteOales, {
            "oales.oid": oid,
        }, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
        });
    }

    function revocation(oid) {

        var options = {
            "oales.oid": oid,
        };
        com.post(api.sales.cancelOales, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
        });
    }

    function invalid(oid) {

        var options = {
            "oales.oid": oid,
        };
        com.post(api.sales.abateOales, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
        });
    }

    function payment(v) {

        params.sales.oales = v;

        com.popup4page("#oalesPayPopUp", "/views/sales/oalesPay.html", "销售付款");
    }

    function submit(oid) {

        com.post(api.sales.submitOales, {
            "oales.oid": oid,
        }, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
        });
    }

    function finishOales(oid) {

        com.post(api.sales.finishOales, {
            "oales.oid": oid,
        }, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
        });
    }

    function checkOales(oid) {

        com.post(api.sales.checkOales, {
            "oaleses[0].oid": oid,
        }, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
        });
    }

    function rejectOales(oid) {

        com.post(api.sales.rejectOales, {
            "oales.oid": oid,
        }, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
        });
    }

    function confirmOales(oid) {

        var options = {
            "oales.oid": oid,
        };
        com.post(api.sales.confirmOales, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
        });
    }

    function scaleOales(oid, isScale) {

        var options = {
            "oales.oid": oid,
            "oales.isScale": isScale
        };
        com.post(api.sales.scaleOales, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
        });
    }

    function activityOales(oid, isActivity) {

        var options = {
            "oales.oid": oid,
            "oales.isActivity": isActivity
        };
        com.post(api.sales.activityOales, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
        });
    }

    function managedrawing(v) {

        com.focusPage('#salesDrawing').html("");

        com.post(api.sales.querySalesPicture, {
            "salesPicture.siid": v.oid
        }, function(data) {

            var salesPictures = data.salesPictures;

            oales.drawingModal.modal("show");

            if (!salesPictures || salesPictures.length == 0)
                return false;

            $.each(salesPictures, function(i, value) {

                if (value.status == constant.sales().salesPicture.STATUS_YES_SHORT) {
                    appendGalleryElement("salesDrawing", value);
                }
            });

            com.popup4photos(com.focusPage("#salesDrawing"));
        }, null, false);
    }

    function appendGalleryElement(galleryId, value) {

        var gallery = com.focusPage("#" + galleryId);
        
        var imgLi = $("<li></li>").attr("id", "gallery_li" + value.spid).addClass("text-center col-sm-4").css("border", "0px").css("border-color", "white").css("padding", "0px").css("height", "150px").css("width", "150px").appendTo(gallery);
        var img = $('<img/>');
        
        var $imgA = $('<a></a>').attr('data-rel', 'colorbox').addClass('cboxElement').attr('href', com.showImg(img, value.path, 200, 200, '200x200')).attr('target', '_blank').append(img).appendTo(imgLi);
        var imgA = $("<a></a>").addClass('cboxElement').attr("target", "_blank").css("height", "150px").append(img).appendTo(imgLi);
        
        com.showImg(img, value.path, 150, 150, value.name, null, 0);
        
        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function() {

            com.showConfirm("确认删除该图片?", function() {
                com.post(api.sales.deleteSalesPicture, {
                    "salesPicture.spid": value.spid
                }, function(res) {

                    com.focusPage("#gallery_li" + value.spid).remove();
                    com.showAlert(com.info, "删除成功");
                });
            });
            return false;
        }).appendTo(toolsDiv);
        
        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);
    }

    function initUploadBtn(v) {

        com.uploadify("#salesUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 0
        }, 5, function(data) {

            var options = {};
            options["salesPicture.sid"] = v.oid;
            options["salesPicture.siid"] = v.oid;
            options["salesPicture.name"] = data.strutsUploadsFileName;
            options["salesPicture.path"] = data.resUrl;
            options["salesPicture.type"] = 2;
            options["salesPicture.filesize"] = data.filesize;
            com.post(api.sales.addSalesPicture, options, function(res) {

                var salesPicture = res.salesPicture;

                appendGalleryElement("salesDrawing", salesPicture);

                com.popup4photos("#salesDrawing");

            });

            searcher.doSearch();
        });
    }

    oales.items.orderId.on("change", function() {

        var option = {
            "decorationOrderId": oales.items.orderId.val()
        };

        com.post(api.decoration.queryDecorationByOrderId, option, function(data) {

            com.updateTypeahead("service", oales.creater.userId, oales.creater.currentName);
            oales.items.service = data.decoration.creater;

            if (data.decoration.designer != null) {
                com.updateTypeahead("channer", data.decoration.designer.userId, data.decoration.designer.currentName);
                oales.items.channer = data.decoration.designer;
            }
        }, function(e) {

            com.showAlert(com.warning, "装修单号输入错误!");
        });
    });

});
