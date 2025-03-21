jQuery(function($) {

    var villageRule = {

        btns: {
            saveItemBtn: com.focusPage("#saveItemBtn"),
            addRuleModalBtn: com.focusPage('#addRuleModalBtn'),
            canceItemlBtn: com.focusPage('#canceItemlBtn'),
        },

        modals: {
            addRuleModal: com.focusPage("#addRuleModal")
        },
        items: {
            rule: com.focusPage("#rule", "#addRuleModal"),
            ruleExample: com.focusPage("#ruleExample", "#addRuleModal"),
            ruleContent: com.focusPage("#ruleContent", "#addRuleModal"),
            rulefill: com.focusPage("#rulefill", "#addRuleModal")
        },

        vid: params.vid,
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

    searcher.set("condList", "pagenation", "resultLists", api.data.queryVillageRule, {
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

    com.post(api.common.queryBuildingNameRule, {}, function(res) {

        villageRule.items.rule.bindData(res.buildingNameRules, "id", "ruleContent", false).trigger("change");
    });

    searcher.line("rule.rule", lineprops, linebtns).render();

    villageRule.btns.canceItemlBtn.click(function() {

        com.closePopup();
    });

    villageRule.btns.addRuleModalBtn.click(function() {

        villageRule.modals.addRuleModal.modal("show");
    });

    villageRule.btns.saveItemBtn.click(function() {

        if (com.validate('addRuleModal')) {
            return false;
        }

        var url = api.data.addVillageRule;

        var option = {

            "villageRule.vid": villageRule.vid,
            "villageRule.rule.id": villageRule.items.rule.val(),

        };

        com.post(url, option, function(e) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();

            villageRule.modals.addRuleModal.modal("hide");
        });
    });
});