jQuery(function($) {

    var buildingNameRule = {
        btns: {
            saveBtn: com.focusPage("#saveBtn"),
            cancelBtn: com.focusPage("#cancelBtn"),
            addBtn: null
        },
        modals: {
            buildingNameRuleModal: com.focusPage("#buildingNameRuleModal")
        },
        items: {
            id: com.focusPage("#id", "#buildingNameRuleModal"),
            buildingNameRuleId: com.focusPage("#buildingNameRuleId", "#buildingNameRuleModal"),
            rule: com.focusPage("#rule", "#buildingNameRuleModal"),
            ruleExample: com.focusPage("#ruleExample", "#buildingNameRuleModal"),
            ruleContent: com.focusPage("#ruleContent", "#buildingNameRuleModal"),
            rulefill: com.focusPage("#rulefill", "#buildingNameRuleModal")
        },
        currentId: null
    };

    var searcher = new Searcher();

    // 删除按钮
    var linebtns = [{
        name: "编辑",
        clazz: "btn-info",
        handle: function(v) {
            editBuildingNameRule(v);
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {
            com.showConfirm("确认删除该规则吗？", function() {
                com.post(api.data.deleteBuildingNameRule, {
                    "buildingNameRule.id": v.id
                }, function(res) {
                    com.showAlert(com.info, "删除成功");
                    searcher.doSearch();
                });
            });
        }
    }];

    // 初始化搜索器
    searcher.set(
        "condLists",
        "pagenation",
        "resultList",
        api.data.pageBuildingNameRule,
        {},
        null,
        null,
        "buildingNameRules",
        true
    );

    // 列表属性
    var lineprops = [{
        fieId: "buildingNameRuleId",
        name: "规则编号",
        prop: "buildingNameRuleId",
        clazz: "blue"
    }, {
        fieId: "rule",
        name: "规则",
        prop: "rule",
        clazz: "red"
    }, {
        fieId: "ruleExample",
        name: "规则示例",
        prop: "ruleExample",
        clazz: "green"
    }, {
        fieId: "ruleContent",
        name: "规则内容",
        prop: "ruleContent",
        clazz: "grey"
    }, {
        fieId: "rulefill",
        name: "规则填充",
        prop: "rulefill",
        clazz: "grey"
    }];

    // 渲染列表
    searcher.line("rule", lineprops, linebtns).render();

    // 添加按钮
    var $addBtnHtml = $('<a class="btn btn-minier btn-primary pull-left" id="addBtn" style="margin-right: 10px"><i class="icon-plus bigger-110"></i><span>添加</span></a>');
    com.focusPage("#condList").before($addBtnHtml);
    buildingNameRule.btns.addBtn = com.focusPage("#addBtn");

    // 编辑规则
    function editBuildingNameRule(data) {
        buildingNameRule.currentId = data.id;
        buildingNameRule.items.buildingNameRuleId.val(data.buildingNameRuleId);
        buildingNameRule.items.rule.val(data.rule);
        buildingNameRule.items.ruleExample.val(data.ruleExample);
        buildingNameRule.items.ruleContent.val(data.ruleContent);
        buildingNameRule.items.rulefill.val(data.rulefill);

        com.focusPage("#buildingNameRuleDialog").text("编辑楼盘命名规则");
        buildingNameRule.modals.buildingNameRuleModal.modal("show");
    }

    // 重置表单
    function resetForm() {
        buildingNameRule.currentId = null;
        buildingNameRule.items.buildingNameRuleId.val("");
        buildingNameRule.items.rule.val("");
        buildingNameRule.items.ruleExample.val("");
        buildingNameRule.items.ruleContent.val("");
        buildingNameRule.items.rulefill.val("");
    }

    // 添加按钮点击
    buildingNameRule.btns.addBtn.on("click", function() {
        resetForm();
        com.focusPage("#buildingNameRuleDialog").text("添加楼盘命名规则");
        buildingNameRule.modals.buildingNameRuleModal.modal("show");
    });

    // 取消按钮点击
    buildingNameRule.btns.cancelBtn.on("click", function() {
        resetForm();
        com.closePopup();
    });

    // 保存按钮点击
    buildingNameRule.btns.saveBtn.on("click", function() {
        // 表单验证
        if (com.validate('buildingNameRuleModal')) {
            com.showAlert(com.warning, "请填写必填项");
            return false;
        }

        var formData = {
            "buildingNameRule.buildingNameRuleId": buildingNameRule.items.buildingNameRuleId.val(),
            "buildingNameRule.rule": buildingNameRule.items.rule.val(),
            "buildingNameRule.ruleExample": buildingNameRule.items.ruleExample.val(),
            "buildingNameRule.ruleContent": buildingNameRule.items.ruleContent.val(),
            "buildingNameRule.rulefill": buildingNameRule.items.rulefill.val()
        };

        // 如果是编辑模式，添加ID
        if (buildingNameRule.currentId) {
            formData["buildingNameRule.id"] = buildingNameRule.currentId;
            var url = api.data.updateBuildingNameRule;
        } else {
            var url = api.data.addBuildingNameRule;
        }

        com.post(url, formData, function(res) {
            com.showAlert(com.info, "保存成功");
            buildingNameRule.modals.buildingNameRuleModal.modal("hide");
            searcher.doSearch();
        });
    });
});
