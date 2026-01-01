jQuery(function($) {

    var buildingNameRule = {
        btns: {
            saveBtn: null,
            cancelBtn: null,
            addBtn: null
        },
        modals: {
            buildingNameRuleModal: com.focusPage("#buildingNameRuleModal")
        },
        items: {
            id: null,
            buildingNameRuleId: null,
            ruleContent: null,
            ruleExample: null,
            inputs: [],
            separators: []
        },
        currentId: null,

        // 输入选项（正则表达式）
        inputOptions: [
            { value: '', text: '空', regex: '' },
            { value: '[0-9]+[A-Za-z]+', text: '数字字母' },
            { value: '[A-Za-z]+[0-9]+', text: '字母数字' },
            { value: '[0-9]+', text: '数字' },
            { value: '[A-Za-z]+', text: '字母' }
        ],

        // 连接符选项（字面值）
        separatorOptions: [
            { value: '', text: '空' },
            { value: '-', text: '-' },
            { value: '/', text: '/' },
            { value: '门', text: '门' },
            { value: '门-', text: '门-' },
            { value: '门#', text: '门#' },
            { value: '座', text: '座' },
            { value: '座-', text: '座-' },
            { value: '座#', text: '座#' },
            { value: '甲', text: '甲' },
            { value: '甲-', text: '甲-' },
            { value: '甲#', text: '甲#' }
        ]
    };

    var searcher = new Searcher();

    // 删除和编辑按钮
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
        name: "规则说明",
        prop: "ruleContent",
        clazz: "grey"
    }];

    // 渲染列表
    searcher.line("rule", lineprops, linebtns).render();

    // 初始化下拉框选项
    function initSelectOptions() {
        // 初始化5个输入下拉框
        for (var i = 1; i <= 5; i++) {
            var $input = com.focusPage("#input" + i, "#buildingNameRuleModal");
            buildingNameRule.items.inputs.push($input);

            // 使用框架提供的 bindData 方法填充下拉框
            $input.bindData(buildingNameRule.inputOptions, 'value', 'text', '输入', function() {
                // 绑定change事件，自动更新规则示例
                $input.on("change", updateRuleExample);
            });
        }

        // 初始化5个连接符下拉框
        for (var i = 1; i <= 5; i++) {
            var $separator = com.focusPage("#separator" + i, "#buildingNameRuleModal");
            buildingNameRule.items.separators.push($separator);

            // 使用框架提供的 bindData 方法填充下拉框
            $separator.bindData(buildingNameRule.separatorOptions, 'value', 'text', '连接符', function() {
                // 绑定change事件，自动更新规则示例
                $separator.on("change", updateRuleExample);
            });
        }

        // 初始化其他字段
        buildingNameRule.items.id = com.focusPage("#id", "#buildingNameRuleModal");
        buildingNameRule.items.buildingNameRuleId = com.focusPage("#buildingNameRuleId", "#buildingNameRuleModal");
        buildingNameRule.items.ruleContent = com.focusPage("#ruleContent", "#buildingNameRuleModal");
        buildingNameRule.items.ruleRegex = com.focusPage("#ruleRegex", "#buildingNameRuleModal");
        buildingNameRule.items.ruleExample = com.focusPage("#ruleExample", "#buildingNameRuleModal");

        // 初始化按钮
        buildingNameRule.btns.saveBtn = com.focusPage("#saveBtn");
        buildingNameRule.btns.cancelBtn = com.focusPage("#cancelBtn");
    }

    // 更新规则示例（同时生成正则表达式和人类可读示例）
    function updateRuleExample() {
        var regex = '';
        var example = '';

        for (var i = 0; i < 5; i++) {
            var inputValue = buildingNameRule.items.inputs[i].val();
            var separatorValue = buildingNameRule.items.separators[i].val();

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
        buildingNameRule.items.ruleRegex.val(regex);
        buildingNameRule.items.ruleExample.val(example);
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
            ruleData.inputs.push(buildingNameRule.items.inputs[i].val());
            ruleData.separators.push(buildingNameRule.items.separators[i].val());
        }

        return JSON.stringify(ruleData);
    }

    // 解码规则JSON字符串（用于回显）
    function decodeRule(ruleJson) {
        try {
            var ruleData = JSON.parse(ruleJson);

            if (ruleData.inputs && ruleData.inputs.length === 5) {
                for (var i = 0; i < 5; i++) {
                    buildingNameRule.items.inputs[i].val(ruleData.inputs[i] || '');
                }
            }

            if (ruleData.separators && ruleData.separators.length === 5) {
                for (var i = 0; i < 5; i++) {
                    buildingNameRule.items.separators[i].val(ruleData.separators[i] || '');
                }
            }
        } catch (e) {
            console.error("解析规则失败:", e);
        }
    }

    // 编辑规则
    function editBuildingNameRule(data) {
        buildingNameRule.currentId = data.id;
        buildingNameRule.items.buildingNameRuleId.val(data.buildingNameRuleId || '');
        buildingNameRule.items.ruleContent.val(data.ruleContent || '');
        buildingNameRule.items.ruleExample.val(data.ruleExample || '');

        // 解析规则并回显
        if (data.rule) {
            decodeRule(data.rule);
        } else {
            // 清空选择
            for (var i = 0; i < 5; i++) {
                buildingNameRule.items.inputs[i].val('');
                buildingNameRule.items.separators[i].val('');
            }
        }

        // 生成示例
        updateRuleExample();

        com.focusPage("#buildingNameRuleDialog").text("编辑楼盘命名规则");
        buildingNameRule.modals.buildingNameRuleModal.modal("show");
    }

    // 重置表单
    function resetForm() {
        buildingNameRule.currentId = null;
        buildingNameRule.items.buildingNameRuleId.val('');
        buildingNameRule.items.ruleContent.val('');
        buildingNameRule.items.ruleRegex.val('');
        buildingNameRule.items.ruleExample.val('');

        for (var i = 0; i < 5; i++) {
            buildingNameRule.items.inputs[i].val('');
            buildingNameRule.items.separators[i].val('');
        }
    }

    // 初始化
    initSelectOptions();

    // 添加按钮
    var $addBtnHtml = $('<a class="btn btn-minier btn-primary pull-left" id="addBtn" style="margin-right: 10px"><i class="icon-plus bigger-110"></i><span>添加</span></a>');
    com.focusPage("#condList").before($addBtnHtml);
    buildingNameRule.btns.addBtn = com.focusPage("#addBtn");

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
            "buildingNameRule.rule": encodeRule(),
            "buildingNameRule.ruleContent": buildingNameRule.items.ruleContent.val(),
            "buildingNameRule.ruleExample": buildingNameRule.items.ruleExample.val()
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
