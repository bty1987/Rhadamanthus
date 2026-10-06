jQuery(function($) {

    var constructionNode = {

        cnid: null,

        pcnid: null,

        isGroupView: null,

        btns: {
            updateBtn: com.focusPage("#updateBtn").on("click", save)
        },

        modals: {
            updateModal: com.focusPage("#updateModal")
        },

        items: {

            name: com.focusPage("#name", "#updateModal"),

            groupNodeSel: com.focusPage("#constructionNodeSel", "#updateModal"),

            precheck: com.focusPage("#precheck", "#updateModal"),
            postcheck: com.focusPage("#postcheck", "#updateModal"),
            stacheck: com.focusPage("#stacheck", "#updateModal"),
            fincheck: com.focusPage("#fincheck", "#updateModal"),
            startalk: com.focusPage("#startalk", "#updateModal"),
            endtalk: com.focusPage("#endtalk", "#updateModal"),
            startSurvey: com.focusPage("#startSurvey", "#updateModal"),
            endSurvey: com.focusPage("#endSurvey", "#updateModal"),
            process: com.focusPage("#process", "#updateModal"),
            proset: com.focusPage("#proset", "#updateModal"),
            timeLimit: com.focusPage("#timeLimit", "#updateModal"),
            kino: com.focusPage("#kino", "#updateModal"),
            kiname: com.focusPage("#kiname", "#updateModal"),
            mark: com.focusPage("#mark", "#updateModal"),
            account: com.focusPage("#account", "#updateModal"),
            accessoryLimit: com.focusPage("#accessoryLimit", "#updateModal"),
            salaryLimit: com.focusPage("#salaryLimit", "#updateModal"),
            salaryFloor: com.focusPage("#salaryFloor", "#updateModal"),
        },

        status: {
            0: "启用",
            1: "禁用"
        },

        account: {
            0: "否",
            1: "是"
        },

        editFlg: false,
    };

    constructionNode.items.process.bindData(constant.data().constructionNode.process.datas, "key", "value");
    constructionNode.items.proset.bindData(constant.data().constructionNode.proset.datas, "key", "value");

    constructionNode.items.mark.bindData(constant.data().constructionNode.mark.datas, "key", "value");
    constructionNode.items.account.bindData([{"key": 0, "value": "否"}, {"key": 1, "value": "是"}], "key", "value");

    constructionNode.modals.updateModal.on('show.bs.hide', function(e) {

        com.cleanItems(constructionNode.items);
    });

    com.post(api.data.querySurveyTemplate, {'surveyTemplate.name': ''}, function(res) {

        constructionNode.items.startSurvey.bindData(res.surveyTemplates, "stid", "name");

        constructionNode.items.endSurvey.bindData(res.surveyTemplates, "stid", "name");
    }, null, false);

    // 账号形态探测(数据驱动,不引身份接口):自有行company=0 → 集团账号,隐藏选择器自建集团行;自有行为空时按集团目录有无数据兜底判定
    com.post(api.data.queryConstructionNode, {}, function(res) {

        var rows = res.constructionNodes || [];

        if (rows.length > 0) {
            constructionNode.isGroupView = rows[0].company === 0;
        } else {
            com.post(api.data.queryConstructionNodeForGroup, {}, function(res2) {
                constructionNode.isGroupView = (res2.constructionNodes || []).length === 0;
            }, null, false);
        }
    }, null, false);

    // 集团工程节点选择器(数据源queryConstructionNodeForGroup查company=0启用行);无快照,选中仅记录pcnid
    com.initTypeahead('constructionNodeSel', api.data.queryConstructionNodeForGroup, "constructionNode.name", {}, "constructionNodes", "cnid", "name", function(list, key, value) {

        $.each(list, function(i, v) {

            if (v.cnid == key) {
                constructionNode.pcnid = v.cnid;
            }
        });

        return value;
    });

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pageConstructionNode);

    searcher.condition(["data-construction-node-name", "data-construction-node-status", "data-construction-node-process", "data-construction-node-proset", "data-construction-node-mark", "data-construction-node-kino", "data-construction-node-kiname"]);

    searcher.history("constructionNodePostData");

    searcher.button([{
        id: "add",
        name: "创建",
        clazz: "btn-success",
        icon: "icon-plus"
    }]);

    // 数据
    var propertyArr = [{
        fieId: "name",
        name: "节点名称",
        prop: "name",
        clazz: "grey"
    }, {
        fieId: "pcnid",
        name: "关联cnid",
        prop: "pcnid",
        clazz: "blue"
    }, {
        fieId: "precheck",
        name: "开工款项比",
        prop: "precheck",
        clazz: "blue"
    }, {
        fieId: "postcheck",
        name: "完工款项比",
        prop: "postcheck",
        clazz: "blue"
    }, {
        fieId: "stacheck",
        name: "开工销售比例",
        prop: "stacheck",
        clazz: "blue"
    }, {
        fieId: "fincheck",
        name: "完工销售比例",
        prop: "fincheck",
        clazz: "blue"
    }, {
        fieId: "accessoryLimit",
        name: "辅料总额限制",
        prop: "accessoryLimit",
        clazz: "blue"
    }, {
        fieId: "salaryLimit",
        name: "工费总额限制",
        prop: "salaryLimit",
        clazz: "blue"
    }, {
        fieId: "salaryFloor",
        name: "工费保底额",
        prop: "salaryFloor",
        clazz: "blue"
    }, {
        fieId: "startalk",
        name: "开工话术",
        prop: "startalk",
        clazz: "grey"
    }, {
        fieId: "endtalk",
        name: "完工话术",
        prop: "endtalk",
        clazz: "grey"
    }, {
        fieId: "startSurvey",
        name: "开工调研模版",
        prop: "startSurvey.name",
        clazz: "grey"
    }, {
        fieId: "endSurvey",
        name: "完工调研模版",
        prop: "endSurvey.name",
        clazz: "grey"
    }, {
        fieId: "process",
        name: "进度",
        prop: "process",
        clazz: "red",
        dataset: constant.data().constructionNode.process.keys
    }, {
        fieId: "proset",
        name: "预派",
        prop: "proset",
        clazz: "red",
        dataset: constant.data().constructionNode.proset.keys
    }, {
        fieId: "timeLimit",
        name: "工期",
        prop: "timeLimit",
        clazz: "blue"
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constructionNode.status
    }, {
        field: "mark",
        name: "工程标识",
        prop: "mark",
        clazz: "red",
        dataset: constant.data().constructionNode.mark.keys
    }, {
        field: "account",
        name: "决算标识",
        prop: "account",
        clazz: "red",
        dataset: constructionNode.account
    }, {
        fieId: "kino",
        name: "金蝶编号",
        prop: "kino",
        clazz: "blue"
    }, {
        fieId: "kiname",
        name: "金蝶名称",
        prop: "kiname",
        clazz: "blue"
    }, {
        fieId: "sort",
        name: "排序",
        prop: "sort",
        clazz: "blue"
    }, ];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            constructionNode.cnid = v.cnid;
            constructionNode.pcnid = v.pcnid;
            constructionNode.items.name.val(v.name);
            constructionNode.items.precheck.val(v.precheck);
            constructionNode.items.postcheck.val(v.postcheck);
            constructionNode.items.stacheck.val(v.stacheck);
            constructionNode.items.fincheck.val(v.fincheck);
            constructionNode.items.startalk.val(v.startalk);
            constructionNode.items.endtalk.val(v.endtalk);
            constructionNode.items.startSurvey.val(v.startSurvey.stid);
            constructionNode.items.endSurvey.val(v.endSurvey.stid);
            constructionNode.items.process.val(v.process);
            constructionNode.items.proset.val(v.proset);
            constructionNode.items.timeLimit.val(v.timeLimit);
            constructionNode.items.kino.val(v.kino);
            constructionNode.items.kiname.val(v.kiname);
            constructionNode.items.mark.val(v.mark);
            constructionNode.items.account.val(v.account);
            constructionNode.items.accessoryLimit.val(v.accessoryLimit);
            constructionNode.items.salaryLimit.val(v.salaryLimit);
            constructionNode.items.salaryFloor.val(v.salaryFloor);

            // 编辑态不展示集团选择器(关联关系建行即定,换绑走运维SQL)
            com.focusPage("#groupNodeSelGroup").hide();

            constructionNode.modals.updateModal.modal("show");

            return false;
        }
    }, ];

    searcher.line("name", propertyArr, linebtns).render();

    com.focusPage('a[name="add"]', '#pagenation').on("click", function() {

        com.cleanItems(constructionNode.items);

        constructionNode.cnid = null;
        constructionNode.pcnid = null;

        // 分公司账号创建必选集团节点(集团没有的先在集团下维护);集团账号(自有行company=0)隐藏选择器自建集团行
        com.focusPage("#groupNodeSelGroup").toggle(constructionNode.isGroupView !== true);

        constructionNode.modals.updateModal.modal("show");
    });

    function save() {

        if (com.validate("updateModal"))
            return false;

        var url;
        var options = {
            "constructionNode.cnid": constructionNode.cnid,
            'constructionNode.name': constructionNode.items.name.val(),
            "constructionNode.precheck": constructionNode.items.precheck.val(),
            "constructionNode.postcheck": constructionNode.items.postcheck.val(),
            "constructionNode.stacheck": constructionNode.items.stacheck.val(),
            "constructionNode.fincheck": constructionNode.items.fincheck.val(),
            "constructionNode.startalk": constructionNode.items.startalk.val(),
            "constructionNode.endtalk": constructionNode.items.endtalk.val(),
            "constructionNode.kino": constructionNode.items.kino.val(),
            "constructionNode.kiname": constructionNode.items.kiname.val(),
            "constructionNode.process": constructionNode.items.process.val(),
            "constructionNode.proset": constructionNode.items.proset.val(),
            "constructionNode.mark": constructionNode.items.mark.val(),
            "constructionNode.account": constructionNode.items.account.val(),
            "constructionNode.accessoryLimit": constructionNode.items.accessoryLimit.val(),
            "constructionNode.salaryLimit": constructionNode.items.salaryLimit.val(),
            "constructionNode.salaryFloor": constructionNode.items.salaryFloor.val(),
            "constructionNode.timeLimit": constructionNode.items.timeLimit.val()
        }

        if (constructionNode.items.startSurvey.val()) {
            options["constructionNode.startSurvey.stid"] = constructionNode.items.startSurvey.val();
        }

        if (constructionNode.items.endSurvey.val()) {
            options["constructionNode.endSurvey.stid"] = constructionNode.items.endSurvey.val();
        }

        if (constructionNode.cnid) {
            options["constructionNode.cnid"] = constructionNode.cnid;

            url = api.data.updateConstructionNode;
        } else {
            // 分公司创建必须先选集团节点(前端承载约束,后端零校验);集团账号自建集团行不带pcnid
            if (constructionNode.isGroupView === false && constructionNode.pcnid == null) {
                com.showAlert(com.error, "请选择集团工程节点(集团没有的节点请先在集团下维护)");
                return false;
            }

            if (constructionNode.pcnid != null) {
                options["constructionNode.pcnid"] = constructionNode.pcnid;
            }

            url = api.data.addConstructionNode;
        }

        com.post(url, options, function() {

            searcher.doSearch();
            constructionNode.modals.updateModal.modal("hide");
        });
    }

});
