$(function() {

    var quotationNamingRule = {

        items: {
            name: com.focusPage('#name'),
            pinyin: com.focusPage('#pinyin'),
            type: com.focusPage('#type'),
            sort: com.focusPage('#sort'),
            comment: com.focusPage('#comment')
        },

        btns: {
            submitBtn: com.focusPage("#submitBtn")
        },

        qnrid: null
    };

    // 类型选项
    var typeDatas = [
        {key: "0", value: "预留"},
        {key: "3", value: "附加项"}
    ];

    quotationNamingRule.items.type.bindData(typeDatas, "key", "value");

    var searcher = new Searcher();

    var lineprops = [{
        fieId: "name",
        name: "名称",
        prop: "name",
        clazz: "grey"
    }, {
        fieId: "pinyin",
        name: "拼音",
        prop: "pinyin",
        clazz: "grey"
    }, {
        fieId: "type",
        name: "类型",
        prop: function(v) {
            if (v.type == 3) return "附加项";
            if (v.type == 0) return "预留";
            return v.type;
        },
        clazz: "blue"
    }, {
        fieId: "sort",
        name: "排序",
        prop: "sort",
        clazz: "green"
    }, {
        fieId: "status",
        name: "状态",
        prop: function(v) {
            return v.status == 0 ? "启用" : "禁用";
        },
        clazz: "red"
    }, {
        fieId: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-warning",
        handle: function(v) {

            com.clearValidator();
            com.cleanItems(quotationNamingRule.items);

            quotationNamingRule.qnrid = v.qnrid;

            quotationNamingRule.items.name.val(v.name);
            quotationNamingRule.items.pinyin.val(v.pinyin);
            quotationNamingRule.items.type.val(v.type);
            quotationNamingRule.items.sort.val(v.sort);
            quotationNamingRule.items.comment.val(v.comment);

            com.focusPage('#layerAdd').modal('show');
        }
    }, {
        name: "启用",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.data.updateQuotationNamingRuleForStatus, {
                "quotationNamingRule.qnrid": v.qnrid,
                "quotationNamingRule.status": check ? 0 : 1
            }, function(res) {

                searcher.doSearch();
            });

            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.showConfirm("确认删除该规则吗？", function() {

                com.post(api.data.deleteQuotationNamingRule, {
                    "quotationNamingRule.qnrid": v.qnrid
                }, function(res) {

                    com.showAlert(com.info, "删除成功");
                    searcher.doSearch();
                });
            });
        }
    }];

    searcher.base("condList", "pagenation", "resultList", api.data.pageQuotationNamingRule);
    searcher.condition(["data-quotationNamingRule-name", "data-quotationNamingRule-type", "data-quotationNamingRule-status"]);

    searcher.button(function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addQuotationNamingRule').css({
            'margin-top': '-2px',
            'margin-left': '4px'
        });
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    searcher.line("name", lineprops, linebtns).render();

    // 添加按钮
    com.focusPage("#addQuotationNamingRule").click(function() {

        com.clearValidator();
        com.cleanItems(quotationNamingRule.items);

        quotationNamingRule.qnrid = null;

        com.focusPage('#layerAdd').modal('show');
    });

    // 保存按钮
    quotationNamingRule.btns.submitBtn.click(function() {

        saveData();
    });

    function saveData() {

        if (com.validate('form1', "right")) {
            return false;
        }

        var name = quotationNamingRule.items.name.val();
        var pinyin = quotationNamingRule.items.pinyin.val();
        var type = quotationNamingRule.items.type.val();
        var sort = quotationNamingRule.items.sort.val();
        var comment = quotationNamingRule.items.comment.val();

        var url = api.data.addQuotationNamingRule;
        var options = {
            "quotationNamingRule.name": name,
            "quotationNamingRule.pinyin": pinyin,
            "quotationNamingRule.type": type,
            "quotationNamingRule.sort": sort || 0,
            "quotationNamingRule.comment": comment
        };

        if (quotationNamingRule.qnrid) {
            url = api.data.updateQuotationNamingRule;
            options["quotationNamingRule.qnrid"] = quotationNamingRule.qnrid;
        }

        com.post(url, options, function(res) {

            com.showAlert(com.info, quotationNamingRule.qnrid ? "更新成功" : "添加成功");
            com.focusPage('#layerAdd').modal('hide');
            searcher.doSearch();
        });
    }

});
