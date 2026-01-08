$(function() {

    var normrice = {

        items: {
            constructionNode: com.focusPage('#constructionNode', "#addNormriceModal"),
            unit: com.focusPage('#unit', "#addNormriceModal"),
            trannum: com.focusPage('#trannum', "#addNormriceModal"),
            salary: com.focusPage('#salary', "#addNormriceModal"),
            stuff: com.focusPage('#stuff', "#addNormriceModal"),

            // 导入功能相关
            quotationVersion: com.focusPage("#quotationVersion", "#importNormriceModal"),
            executeDates: com.focusPage("#executeDates", "#importNormriceModal"),
            executeTimes: com.focusPage("#executeTimes", "#importNormriceModal"),
            filePath: com.focusPage("#filePath", "#importNormriceModal")
        },
        modals: {
            addNormriceModal: com.focusPage('#addNormriceModal'),
            importNormriceModal: com.focusPage('#importNormriceModal')
        },
        btns: {
            addNormriceBtn: com.focusPage('#addNormriceBtn'),
            addNormriceItemBtn: com.focusPage('#addNormriceItemBtn').on("click", saveData),
            normriceBackBtn: com.focusPage('#normriceBackBtn'),
            confirmImportBtn: com.focusPage("#confirmImportBtn").on("click", importNormrice)
        },

        qiid: params.data.quotationItem != null ? params.data.quotationItem.qiid : "",

        pageType: params.urlLoadParams.pageType,

        keyword: "import_quotation_normrice" // 导入功能关键字
    };

    // 初始化日期和时间选择器
    com.datetime(normrice.items.executeDates, "date", false);
    com.datetime(normrice.items.executeTimes, "time", false);

    // 初始化文件上传
    com.uploadify("#attachment", "上传文件", api.common.uploadOther, 'btn btn-sm btn-primary lineheight0', "*.xls", {
        'uploadType': 3
    }, 1, function(data) {
        0 == data.errorCode ? com.focusPage("#filePath", "#importNormriceModal").val(data.resUrl) : alert(data.errorMsg);
    });

    normrice.modals.addNormriceModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanTypeahead("constructionNode");
        com.cleanItems(normrice.items);
    });

    normrice.modals.importNormriceModal.on("hide.bs.modal", function(e) {
        com.clearValidator();
        // 清空文件路径和表单
        normrice.items.filePath.val("");
        normrice.items.quotationVersion.val("");
    });

    // 当导入模态框显示时，加载报价版本数据
    normrice.modals.importNormriceModal.on("show.bs.modal", function(e) {
        com.post(api.quotation.queryQuotationVersion, {}, function(res) {
            normrice.items.quotationVersion.bindData(res.quotationVersions, "no", "name", "请选择");
        });
    });

    com.post(api.data.queryMeasurementUnit, {}, function(res) {

        normrice.items.unit.bindData(res.measurementUnits, "name", "name");
    });

    com.post(api.data.queryConstructionNode, {}, function(res) {

        normrice.items.constructionNode.bindData(res.constructionNodes, "cnid", "name");
    });

    var searcher = new Searcher();

    var normprops = [{
        fieId: "constructionNode",
        name: "施工节点",
        prop: "constructionNode.name",
        clazz: "grey"
    }, {
        fieId: "quotationItem",
        name: "报价项",
        prop: "quotationItem.name",
        clazz: "grey"
    }, {
        fieId: "quotationUnit",
        name: "报价单位",
        prop: "quotationItem.unit.name",
        clazz: "grey"
    }, {
        fieId: "unit",
        name: "定额单位",
        prop: "unit",
        clazz: "grey"
    }, {
        fieId: "trannum",
        name: "转换量",
        prop: "trannum",
        clazz: "blue"
    }, {
        fieId: "salary",
        name: "工费",
        prop: "salary",
        clazz: "blue"
    }, {
        fieId: "stuff",
        name: "材料费",
        prop: "stuff",
        clazz: "blue"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.data().normrice.status.keys
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

                com.post(api.data.deleteNormrice, {
                    "normrice.npid": v.npid
                }, function(e) {

                    com.showAlert(com.info, "操作成功");

                    searcher.doSearch();
                });
            });

        }
    }];

    if (normrice.pageType == "query") {

        searcher.base("normriceCondList", "normricePagenation", "normriceResultList", api.data.queryNormriceByQiid);
        searcher.result("normrices").isPage(true);

        searcher.param({
            "normrice.quotationItem.qiid": normrice.qiid
        });

        searcher.button(function() {

            var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'add').css("margin", "0px 3px");
            var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
            var $addspan = $('<span></span>').text('添加').appendTo($adda);

            return [$adda];
        });

        searcher.line("constructionNode.name", normprops, linebtns).render();
    } else {

        searcher.history("normricePostData");
        searcher.base("normriceCondList", "normricePagenation", "normriceResultList", api.data.pageNormrice);
        searcher.condition(["data-normrice-quotationItem", "data-normrice-quotation-version", "data-normrice-constructionNode", "data-normrice-status"]);

        // 添加导入按钮
        searcher.button(function() {

            var $importa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('id', 'importNormrice').css("margin", "0px 3px");
            var $importi = $('<i></i>').addClass('icon-upload bigger-110').appendTo($importa);
            var $importspan = $('<span></span>').text('导入').appendTo($importa);

            return [$importa];
        });

        searcher.line("constructionNode.name", normprops.concat({
            type: "newline"
        }).concat(quoteprops), linebtns).render();
    }

    com.focusPage("#add").click(function() {

        normrice.modals.addNormriceModal.modal("show");
    });

    // 导入按钮点击事件（分页区域）
    com.focusPage("#importNormrice").click(function() {

        normrice.keyword = "import_normrice";

        // 显示导入模态框
        normrice.modals.importNormriceModal.modal("show");
    });

    function saveData() {

        if (com.validate('addNormriceModal')) {
            return false;
        }

        var option = {
            "normrice.constructionNode.cnid": normrice.items.constructionNode.val(),
            "normrice.unit": normrice.items.unit.val(),
            "normrice.trannum": normrice.items.trannum.val(),
            "normrice.salary": normrice.items.salary.val(),
            "normrice.stuff": normrice.items.stuff.val(),
            "normrice.quotationItem.qiid": normrice.qiid
        };

        com.post(api.data.addNormrice, option, function(e) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            normrice.modals.addNormriceModal.modal("hide");
        });
    }

    // 导入定额工费
    function importNormrice() {

        if (com.validate('importNormriceModal')) {
            return false;
        }

        var filePath = normrice.items.filePath.val();

        if (filePath == null || filePath == "") {
            com.showAlert(com.warning, "上传文件不能为空");
            return false;
        }

        var quotationVersion = normrice.items.quotationVersion.val();

        if (quotationVersion == null || quotationVersion == "") {
            com.showAlert(com.warning, "请选择报价版本");
            return false;
        }

        // 将文件路径和报价版本拼接为参数
        var args = filePath + "," + quotationVersion;

        var date = normrice.items.executeDates.val();
        var time = normrice.items.executeTimes.val();

        var executeTime = date.replace(/\-/g, '').substr(2) + time.replace(/:/g, '').substr(0, 4);

        var times = normrice.items.executeDates.val() + ' ' + normrice.items.executeTimes.val();
        var checkTime = new Date(times);

        // 检查执行时间（需要导入 planUtils）
        if (typeof planUtils !== 'undefined' && !planUtils.TimeComparison(checkTime, config.planTimeLimit)) {
            com.showAlert(com.warning, "执行时间请大于当前时间" + config.planTimeLimit + "分钟");
            return false;
        }

        var options = {
            "plan.task.keyWord": normrice.keyword,
            "plan.executeTime": executeTime,
            "plan.args": args
        };

        com.post(api.information.createPlan, options, function(res) {

            com.showAlert(com.info, "计划创建成功");

            // 关闭模态框
            normrice.modals.importNormriceModal.modal("hide");

            // 刷新列表
            searcher.doSearch();
        });
    }
});