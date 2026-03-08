$(function() {

    var normtime = {

        items: {
            constructionNode: com.focusPage('#constructionNode', "#addNormtimeModal"),
            unit: com.focusPage('#unit', "#addNormtimeModal"),
            trannum: com.focusPage('#trannum', "#addNormtimeModal"),
            workdays: com.focusPage('#workdays', "#addNormtimeModal"),

            // 导入功能相关
            quotationVersion: com.focusPage("#quotationVersion", "#importNormtimeModal"),
            executeDates: com.focusPage("#executeDates", "#importNormtimeModal"),
            executeTimes: com.focusPage("#executeTimes", "#importNormtimeModal"),
            filePath: com.focusPage("#filePath", "#importNormtimeModal")
        },
        modals: {
            addNormtimeModal: com.focusPage('#addNormtimeModal'),
            importNormtimeModal: com.focusPage('#importNormtimeModal')
        },
        btns: {
            addNormtimeBtn: com.focusPage('#addNormtimeBtn'),
            addNormtimeItemBtn: com.focusPage('#addNormtimeItemBtn').on("click", saveData),
            normtimeBackBtn: com.focusPage('#normtimeBackBtn'),
            confirmImportBtn: com.focusPage("#confirmImportBtn").on("click", importNormtime)
        },

        qiid: params.data.quotationItem != null ? params.data.quotationItem.qiid : "",

        pageType: params.urlLoadParams.pageType,

        keyword: "import_quotation_normtime" // 导入功能关键字
    };

    // 初始化日期和时间选择器
    com.datetime(normtime.items.executeDates, "date", false);
    com.datetime(normtime.items.executeTimes, "time", false);

    // 初始化文件上传
    com.uploadify("#attachment", "上传文件", api.common.uploadOther, 'btn btn-sm btn-primary lineheight0', "*.xls", {
        'uploadType': 3
    }, 1, function(data) {
        0 == data.errorCode ? com.focusPage("#filePath", "#importNormtimeModal").val(data.resUrl) : alert(data.errorMsg);
    });

    normtime.modals.addNormtimeModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanTypeahead("constructionNode");
        com.cleanItems(normtime.items);
    });

    normtime.modals.importNormtimeModal.on("hide.bs.modal", function(e) {
        com.clearValidator();
        // 清空文件路径和表单
        normtime.items.filePath.val("");
        normtime.items.quotationVersion.val("");
    });

    // 当导入模态框显示时，加载报价版本数据
    normtime.modals.importNormtimeModal.on("show.bs.modal", function(e) {
        com.post(api.quotation.queryQuotationVersion, {}, function(res) {
            normtime.items.quotationVersion.bindData(res.quotationVersions, "no", "name", "请选择");
        });
    });

    com.post(api.data.queryMeasurementUnit, {}, function(res) {

        normtime.items.unit.bindData(res.measurementUnits, "name", "name");
    });

    com.post(api.data.queryConstructionNode, {}, function(res) {

        normtime.items.constructionNode.bindData(res.constructionNodes, "cnid", "name");
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
        fieId: "workdays",
        name: "工时天数",
        prop: "workdays",
        clazz: "blue"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.data().normtime.status.keys
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

                com.post(api.data.deleteNormtime, {
                    "normtime.ntid": v.ntid
                }, function(e) {

                    com.showAlert(com.info, "操作成功");

                    searcher.doSearch();
                });
            });

        }
    }];

    if (normtime.pageType == "query") {

        searcher.base("normtimeCondList", "normtimePagenation", "normtimeResultList", api.data.queryNormtimeByQiid);
        searcher.result("normtimes").isPage(true);

        searcher.param({
            "normtime.quotationItem.qiid": normtime.qiid
        });

        searcher.button(function() {

            var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'add').css("margin", "0px 3px");
            var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
            var $addspan = $('<span></span>').text('添加').appendTo($adda);

            return [$adda];
        });

        searcher.line("constructionNode.name", normprops, linebtns).render();
    } else {

        searcher.history("normtimePostData");
        searcher.base("normtimeCondList", "normtimePagenation", "normtimeResultList", api.data.pageNormtime);
        searcher.condition(["data-normtime-quotationItem", "data-normtime-quotation-version", "data-normtime-constructionNode", "data-normtime-status"]);

        // 添加导入按钮
        searcher.button(function() {

            var $importa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('id', 'importNormtime').css("margin", "0px 3px");
            var $importi = $('<i></i>').addClass('icon-upload bigger-110').appendTo($importa);
            var $importspan = $('<span></span>').text('导入').appendTo($importa);

            return [$importa];
        });

        searcher.line("constructionNode.name", normprops.concat({
            type: "newline"
        }).concat(quoteprops), linebtns).render();
    }

    com.focusPage("#add").click(function() {

        normtime.modals.addNormtimeModal.modal("show");
    });

    // 导入按钮点击事件（分页区域）
    com.focusPage("#importNormtime").click(function() {

        normtime.keyword = "import_quotation_normtime";

        // 显示导入模态框
        normtime.modals.importNormtimeModal.modal("show");
    });

    function saveData() {

        if (com.validate('addNormtimeModal')) {
            return false;
        }

        var option = {
            "normtime.constructionNode.cnid": normtime.items.constructionNode.val(),
            "normtime.unit": normtime.items.unit.val(),
            "normtime.trannum": normtime.items.trannum.val(),
            "normtime.workdays": normtime.items.workdays.val(),
            "normtime.quotationItem.qiid": normtime.qiid
        };

        com.post(api.data.addNormtime, option, function(e) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            normtime.modals.addNormtimeModal.modal("hide");
        });
    }

    // 导入定额工期
    function importNormtime() {

        if (com.validate('importNormtimeModal')) {
            return false;
        }

        var filePath = normtime.items.filePath.val();

        if (filePath == null || filePath == "") {
            com.showAlert(com.warning, "上传文件不能为空");
            return false;
        }

        var quotationVersion = normtime.items.quotationVersion.val();

        if (quotationVersion == null || quotationVersion == "") {
            com.showAlert(com.warning, "请选择报价版本");
            return false;
        }

        // 将文件路径和报价版本拼接为参数
        var args = filePath + "," + quotationVersion;

        var date = normtime.items.executeDates.val();
        var time = normtime.items.executeTimes.val();

        var executeTime = date.replace(/\-/g, '').substr(2) + time.replace(/:/g, '').substr(0, 4);

        var times = normtime.items.executeDates.val() + ' ' + normtime.items.executeTimes.val();
        var checkTime = new Date(times);

        // 检查执行时间（需要导入 planUtils）
        if (typeof planUtils !== 'undefined' && !planUtils.TimeComparison(checkTime, config.planTimeLimit)) {
            com.showAlert(com.warning, "执行时间请大于当前时间" + config.planTimeLimit + "分钟");
            return false;
        }

        var options = {
            "plan.task.keyWord": normtime.keyword,
            "plan.executeTime": executeTime,
            "plan.args": args
        };

        com.post(api.information.createPlan, options, function(res) {

            com.showAlert(com.info, "计划创建成功");

            // 关闭模态框
            normtime.modals.importNormtimeModal.modal("hide");

            // 刷新列表
            searcher.doSearch();
        });
    }
});
