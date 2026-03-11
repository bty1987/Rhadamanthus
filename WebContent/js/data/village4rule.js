jQuery(function($) {

    var villageRule = {

        btns: {
            saveBindBtn: com.focusPage("#saveBindBtn"),
            bindRuleModalBtn: com.focusPage('#bindRuleModalBtn'),
            cancelBindBtn: com.focusPage('#cancelBindBtn'),
            saveCreateBtn: com.focusPage("#saveCreateBtn"),
            createRuleModalBtn: com.focusPage('#createRuleModalBtn'),
            cancelCreateBtn: com.focusPage('#cancelCreateBtn'),
        },

        modals: {
            bindRuleModal: com.focusPage("#bindRuleModal"),
            createRuleModal: com.focusPage("#createRuleModal")
        },
        items: {
            rule: com.focusPage("#rule", "#bindRuleModal"),
            // 创建规则相关字段
            buildingNameRuleId: null,
            ruleContent: null,
            ruleRegex: null,
            ruleExample: null,
            inputs: [],
            separators: []
        },

        vid: params.vid,

        // 输入选项（正则表达式）
        inputOptions: [{
            value: '',
            text: '空',
            regex: ''
        }, {
            value: '[0-9]+[A-Za-z]+',
            text: '数字字母'
        }, {
            value: '[A-Za-z]+[0-9]+',
            text: '字母数字'
        }, {
            value: '[0-9]+',
            text: '数字'
        }, {
            value: '[A-Za-z]+',
            text: '字母'
        }],

        // 连接符选项（字面值）
        separatorOptions: [{
            value: '',
            text: '空'
        }, {
            value: '-',
            text: '-'
        }, {
            value: '/',
            text: '/'
        }, {
            value: '门',
            text: '门'
        }, {
            value: '门-',
            text: '门-'
        }, {
            value: '门#',
            text: '门#'
        }, {
            value: '座',
            text: '座'
        }, {
            value: '座-',
            text: '座-'
        }, {
            value: '座#',
            text: '座#'
        }, {
            value: '甲',
            text: '甲'
        }, {
            value: '甲-',
            text: '甲-'
        }, {
            value: '甲#',
            text: '甲#'
        }]
    };

    var searcher = new Searcher();

    var linebtns = [{
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.data.deleteVillageRule, {
                "villageRule.vrid": v.vrid
            }, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
        }
    }];

    searcher.set("condLists", "pagenation", "resultLists", api.data.queryVillageRule, {
        "villageRule.vid": villageRule.vid
    }, null, null, "villageRules", true);

    var lineprops = [{
        fieId: "rule.buildingNameRuleId",
        name: "编号",
        prop: "rule.buildingNameRuleId",
        clazz: "blue"
    }, {
        fieId: "rule.rule",
        name: "规则",
        prop: "rule.rule",
        clazz: "red"
    }, {
        fieId: "rule.ruleExample",
        name: "示例",
        prop: "rule.ruleExample",
        clazz: "green"
    }, {
        fieId: "rule.ruleContent",
        name: "内容",
        prop: "rule.ruleContent",
        clazz: "grey"
    }, {
        fieId: "rule.rulefill",
        name: "填充",
        prop: "rule.rulefill",
        clazz: "grey"
    }];

    // 加载规则下拉选项
    com.post(api.common.queryBuildingNameRule, {}, function(res) {
        villageRule.items.rule.bindData(res.buildingNameRules, "id", "ruleContent", false).trigger("change");
    });

    searcher.line("rule.rule", lineprops, linebtns).render();

    // ========== 绑定规则相关逻辑 ==========

    villageRule.btns.cancelBindBtn.click(function() {
        villageRule.modals.bindRuleModal.modal("hide");
    });

    villageRule.btns.bindRuleModalBtn.click(function() {
        villageRule.modals.bindRuleModal.modal("show");
    });

    villageRule.btns.saveBindBtn.click(function() {

        if (com.validate('bindRuleModal')) {
            return false;
        }

        var url = api.data.addVillageRule;

        var option = {
            "villageRule.vid": villageRule.vid,
            "villageRule.rule.id": villageRule.items.rule.val(),
        };

        com.post(url, option, function(e) {

            com.showAlert(com.info, "绑定成功");
            searcher.doSearch();
            villageRule.modals.bindRuleModal.modal("hide");
        });
    });

    // ========== 创建规则相关逻辑 ==========

    // 初始化创建规则下拉框
    function initCreateRuleSelectOptions() {

        // 初始化5个输入下拉框
        for (var i = 1; i <= 5; i++) {
            var $input = com.focusPage("#input" + i, "#createRuleModal");
            villageRule.items.inputs.push($input);

            $input.bindData(villageRule.inputOptions, 'value', 'text', '输入', function() {
                $input.on("change", updateRuleExample);
            });
        }

        // 初始化5个连接符下拉框
        for (var i = 1; i <= 5; i++) {
            var $separator = com.focusPage("#separator" + i, "#createRuleModal");
            villageRule.items.separators.push($separator);

            $separator.bindData(villageRule.separatorOptions, 'value', 'text', '连接符', function() {
                $separator.on("change", updateRuleExample);
            });
        }

        // 初始化其他字段
        villageRule.items.buildingNameRuleId = com.focusPage("#buildingNameRuleId", "#createRuleModal");
        villageRule.items.ruleContent = com.focusPage("#ruleContent", "#createRuleModal");
        villageRule.items.ruleRegex = com.focusPage("#ruleRegex", "#createRuleModal");
        villageRule.items.ruleExample = com.focusPage("#ruleExample", "#createRuleModal");
    }

    // 更新规则示例（同时生成正则表达式和人类可读示例）
    function updateRuleExample() {

        var regex = '';
        var example = '';

        for (var i = 0; i < 5; i++) {
            var inputValue = villageRule.items.inputs[i].val();
            var separatorValue = villageRule.items.separators[i].val();

            // 生成正则表达式
            if (inputValue) {
                regex += inputValue;
            }
            if (separatorValue) {
                regex += separatorValue;
            }

            // 生成人类可读示例
            if (inputValue) {
                var inputText = getInputExampleText(inputValue);
                example += inputText;
            }
            if (separatorValue) {
                example += separatorValue;
            }
        }

        // 同时更新两个字段
        villageRule.items.ruleRegex.val(regex);
        villageRule.items.ruleExample.val(example);
    }

    // 获取输入示例文本（用于显示）
    function getInputExampleText(value) {

        var examples = {
            '[0-9]+[A-Za-z]+': '1A',
            '[A-Za-z]+[0-9]+': 'A1',
            '[0-9]+': '1',
            '[A-Za-z]+': 'A',
            '': ''
        };
        return examples[value] || '';
    }

    // 编码规则为JSON字符串（用于存储）
    function encodeRule() {

        var ruleData = {
            inputs: [],
            separators: []
        };

        for (var i = 0; i < 5; i++) {
            ruleData.inputs.push(villageRule.items.inputs[i].val());
            ruleData.separators.push(villageRule.items.separators[i].val());
        }

        return JSON.stringify(ruleData);
    }

    // 重置创建规则表单
    function resetCreateRuleForm() {

        villageRule.items.buildingNameRuleId.val('');
        villageRule.items.ruleContent.val('');
        villageRule.items.ruleRegex.val('');
        villageRule.items.ruleExample.val('');

        for (var i = 0; i < 5; i++) {
            villageRule.items.inputs[i].val('');
            villageRule.items.separators[i].val('');
        }
    }

    // 初始化下拉框
    initCreateRuleSelectOptions();

    // 创建按钮点击
    villageRule.btns.createRuleModalBtn.on("click", function() {

        resetCreateRuleForm();
        villageRule.modals.createRuleModal.modal("show");
    });

    // 取消创建按钮点击
    villageRule.btns.cancelCreateBtn.on("click", function() {

        resetCreateRuleForm();
        villageRule.modals.createRuleModal.modal("hide");
    });

    // 保存并绑定按钮点击
    villageRule.btns.saveCreateBtn.on("click", function() {

        // 表单验证
        if (com.validate('createRuleModal')) {
            com.showAlert(com.warning, "请填写必填项");
            return false;
        }

        var url = api.data.addVillageRule;

        var option = {
            "villageRule.vid": villageRule.vid,
            // 不传 id，而是传 rule 内容
            "villageRule.rule.buildingNameRuleId": villageRule.items.buildingNameRuleId.val(),
            "villageRule.rule.rule": encodeRule(),
            "villageRule.rule.ruleContent": villageRule.items.ruleContent.val(),
            "villageRule.rule.ruleExample": villageRule.items.ruleExample.val()
        };

        com.post(url, option, function(e) {

            com.showAlert(com.info, "创建并绑定成功");
            searcher.doSearch();

            // 刷新规则下拉列表
            com.post(api.common.queryBuildingNameRule, {}, function(res) {
                villageRule.items.rule.bindData(res.buildingNameRules, "id", "ruleContent", false).trigger("change");
            });

            villageRule.modals.createRuleModal.modal("hide");
        });
    });
});
