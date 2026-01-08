$(function() {

    var normood = {

        items: {
            quotationItem: com.focusPage('#quotationItem', "#addNormoodModal"),
            normunit: com.focusPage('#normunit', "#addNormoodModal"),
            normnum: com.focusPage('#normnum', "#addNormoodModal"),
            storeunit: com.focusPage('#storeunit', "#addNormoodModal"),
            storenum: com.focusPage('#storenum', "#addNormoodModal"),
            noodsName: com.focusPage('#noodsName', "#addNormoodModal"),
            price: com.focusPage('#price', "#addNormoodModal"),

            // 导入功能相关
            quotationVersion: com.focusPage("#quotationVersion", "#importNormoodModal"),
            executeDates: com.focusPage("#executeDates", "#importNormoodModal"),
            executeTimes: com.focusPage("#executeTimes", "#importNormoodModal"),
            filePath: com.focusPage("#filePath", "#importNormoodModal")
        },
        modals: {
            addNormoodModal: com.focusPage('#addNormoodModal'),
            importNormoodModal: com.focusPage('#importNormoodModal')
        },
        btns: {
            addNormoodItemBtn: com.focusPage('#addNormoodItemBtn').on("click", saveData),
            confirmImportBtn: com.focusPage("#confirmImportBtn").on("click", importNormood)
        },

        qiid: params.data.quotationItem != null ? params.data.quotationItem.qiid : "",

        status: constant.data().normood.status.keys,

        pageType: params.urlLoadParams.pageType,

        keyword: "import_quotation_normood" // 导入功能关键字
    };

    // 初始化日期和时间选择器
    com.datetime(normood.items.executeDates, "date", false);
    com.datetime(normood.items.executeTimes, "time", false);

    // 初始化文件上传
    com.uploadify("#attachment", "上传文件", api.common.uploadOther, 'btn btn-sm btn-primary lineheight0', "*.xls", {
        'uploadType': 3
    }, 1, function(data) {
        0 == data.errorCode ? com.focusPage("#filePath", "#importNormoodModal").val(data.resUrl) : alert(data.errorMsg);
    });

    normood.modals.addNormoodModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanTypeahead("noodsName");
        com.cleanItems(normood.items);
    });

    normood.modals.importNormoodModal.on("hide.bs.modal", function(e) {
        com.clearValidator();
        // 清空文件路径和表单
        normood.items.filePath.val("");
        normood.items.quotationVersion.val("");
    });

    // 当导入模态框显示时，加载报价版本数据
    normood.modals.importNormoodModal.on("show.bs.modal", function(e) {
        com.post(api.quotation.queryQuotationVersion, {}, function(res) {
            normood.items.quotationVersion.bindData(res.quotationVersions, "no", "name", "请选择");
        });
    });

    com.initTypeahead(normood.items.noodsName, api.data.queryNoodsByName, "noods.name", {}, "noodes", "nid", "name", null);

    com.post(api.common.queryMeasurementUnit, {}, function(res) {

        normood.items.normunit.bindData(res.measurementUnits, "name", "name");
        normood.items.storeunit.bindData(res.measurementUnits, "name", "name");
    });

    var searcher = new Searcher();

    var normprops = [{
        fieId: "name",
        name: "名称",
        prop: "name",
        clazz: "grey"
    }, {
        fieId: "noods",
        name: "定材",
        prop: "noods.name",
        clazz: "grey"
    }, {
        fieId: "normunit",
        name: "定额单位",
        prop: "normunit",
        clazz: "grey"
    }, {
        fieId: "quotationUnit",
        name: "报价单位",
        prop: "quotationItem.unit.name",
        clazz: "grey"
    }, {
        fieId: "normnum",
        name: "定额数量",
        prop: "normnum",
        clazz: "blue"
    }, {
        fieId: "storeunit",
        name: "库房单位",
        prop: "storeunit",
        clazz: "grey"
    }, {
        fieId: "storenum",
        name: "库房数量",
        prop: "storenum",
        clazz: "blue"
    }, {
        fieId: "price",
        name: "价格",
        prop: "price",
        clazz: "blue"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: normood.status
    }];

    var quoteprops = [{
        fieId: "name",
        name: "报价项",
        prop: "quotationItem.name",
        clazz: "grey"
    }, {
        fieId: "category",
        name: "类型",
        prop: "quotationItem.category.name",
        clazz: "red"
    }, {
        fieId: "classification",
        name: "分类",
        prop: "quotationItem.classification.name",
        clazz: "red"
    }, {
        fieId: "bigCategory",
        name: "大类",
        prop: "quotationItem.bigCategory.name",
        clazz: "red"
    }, {
        fieId: "smallCategory",
        name: "小类",
        prop: "quotationItem.smallCategory.name",
        clazz: "red"
    }, {
        fieId: "unit",
        name: "单位",
        prop: "unit",
        clazz: "red"
    }, {
        fieId: "workType",
        name: "工种",
        prop: "quotationItem.workType.name",
        clazz: "grey"
    }, {
        fieId: "comment",
        name: "说明",
        prop: "quotationItem.comment",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "删除",
        clazz: "btn-warning",
        handle: function(v) {

            com.showConfirm("确认删除吗?", function(result) {

                com.post(api.data.deleteNormood, {
                    "normood.ngid": v.ngid
                }, function(e) {

                    com.showAlert(com.info, "操作成功");

                    searcher.doSearch();
                });
            });
        }
    }];

    if (normood.pageType == "query") {

        searcher.base("normoodCondList", "normoodPagenation", "normoodResultList", api.data.queryNormoodByQiid);
        searcher.result("normoods").isPage(true);

        searcher.param({
            "normood.quotationItem.qiid": normood.qiid
        });

        searcher.button(function() {

            var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'add').css("margin", "0px 3px");
            var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
            var $addspan = $('<span></span>').text('添加').appendTo($adda);

            return [$adda];
        });

        searcher.line("name", normprops, linebtns).render();
    } else {

        searcher.history("normoodPostData");
        searcher.base("normoodCondList", "normoodPagenation", "normoodResultList", api.data.pageNormood);
        searcher.condition(["data-normood-quotationItem", "data-normood-quotation-version", "data-normood-name", "data-normood-no", "data-normood-status"]);

        // 添加导入按钮
        searcher.button(function() {

            var $importa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('id', 'importNormood').css("margin", "0px 3px");
            var $importi = $('<i></i>').addClass('icon-upload bigger-110').appendTo($importa);
            var $importspan = $('<span></span>').text('导入').appendTo($importa);

            return [$importa];
        });

        searcher.line("name", normprops.concat({
            type: "newline"
        }).concat(quoteprops), linebtns).render();
    }

    com.focusPage("#add").click(function() {

        normood.modals.addNormoodModal.modal("show");
    });

    // 导入按钮点击事件（分页区域）
    com.focusPage("#importNormood").click(function() {

        normood.keyword = "import_quotation_normood";

        // 显示导入模态框
        normood.modals.importNormoodModal.modal("show");
    });

    function saveData() {

        if (com.validate('addNormoodModal')) {
            return false;
        }

        var option = {
            "normood.goods.gid": null,
            "normood.noods.nid": com.typeahead(normood.items.noodsName),
            "normood.normunit": normood.items.normunit.val(),
            "normood.normnum": normood.items.normnum.val(),
            "normood.storeunit": normood.items.storeunit.val(),
            "normood.storenum": normood.items.storenum.val(),
            "normood.quotationItem.qiid": normood.qiid,
            "normood.name": normood.items.noodsName.val(),
            "normood.price": normood.items.price.val()
        };

        com.post(api.data.addNormood, option, function(e) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            normood.modals.addNormoodModal.modal("hide");
        });
    }

    // 导入定额材料
    function importNormood() {

        if (com.validate('importNormoodModal')) {
            return false;
        }

        var filePath = normood.items.filePath.val();

        if (filePath == null || filePath == "") {
            com.showAlert(com.warning, "上传文件不能为空");
            return false;
        }

        var quotationVersion = normood.items.quotationVersion.val();

        if (quotationVersion == null || quotationVersion == "") {
            com.showAlert(com.warning, "请选择报价版本");
            return false;
        }

        // 将文件路径和报价版本拼接为参数
        var args = filePath + "," + quotationVersion;

        var date = normood.items.executeDates.val();
        var time = normood.items.executeTimes.val();

        var executeTime = date.replace(/\-/g, '').substr(2) + time.replace(/:/g, '').substr(0, 4);

        var times = normood.items.executeDates.val() + ' ' + normood.items.executeTimes.val();
        var checkTime = new Date(times);

        // 检查执行时间（需要导入 planUtils）
        if (typeof planUtils !== 'undefined' && !planUtils.TimeComparison(checkTime, config.planTimeLimit)) {
            com.showAlert(com.warning, "执行时间请大于当前时间" + config.planTimeLimit + "分钟");
            return false;
        }

        var options = {
            "plan.task.keyWord": normood.keyword,
            "plan.executeTime": executeTime,
            "plan.args": args
        };

        com.post(api.information.createPlan, options, function(res) {

            com.showAlert(com.info, "计划创建成功");

            // 关闭模态框
            normood.modals.importNormoodModal.modal("hide");

            // 刷新列表
            searcher.doSearch();
        });
    }
});
