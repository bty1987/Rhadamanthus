jQuery(function($) {

    var constants = {
        items: {
            cid: com.focusPage("#cid", "#constant"),
            name: com.focusPage("#name", "#constant"),
            module: com.focusPage("#module", "#constant"),
            clazz: com.focusPage("#clazz", "#constant"),
            type: com.focusPage("#type", "#constant"),
            field: com.focusPage("#field", "#constant"),
            key: com.focusPage("#key", "#constant"),
            value: com.focusPage("#value", "#constant"),
            status: com.focusPage("#status", "#constant"),
        },

        modals: {
            constantModal: com.focusPage("#constant"),
        },

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
        },

        status: ["启用", "禁用"],

        cid: null,
    };

    constants.items.status.bindData(constant.data().common.status.datas, "key", "value");

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pageConstant);

    searcher.condition(["data-constant-name", "data-constant-module", "data-constant-field", "data-constant-key"]);

    searcher.history("constantPostData");

    searcher.button([{
        id: "add",
        name: "添加",
        clazz: "btn-success",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        fieId: "name",
        name: "名称",
        prop: "name",
        clazz: "grey"
    }, {
        field: "module",
        name: "模块",
        prop: "module",
        clazz: "grey"
    }, {
        field: "clazz",
        name: "对象",
        prop: "clazz",
        clazz: "grey"
    }, {
        fieId: "type",
        name: "类型",
        prop: "type",
        clazz: "red"
    }, {
        fieId: "field",
        name: "字段名",
        prop: "field",
        clazz: "grey"
    }, {
        fieId: "key",
        name: "键",
        prop: "key",
        clazz: "grey"
    }, {
        fieId: "value",
        name: "值",
        prop: "value",
        clazz: "grey"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constants.status
    }, ];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-success",
        handle: function(v) {

            constants.cid = v.cid;

            constants.items.cid.val(v.cid);
            constants.items.name.val(v.name);
            constants.items.module.val(v.module);
            constants.items.clazz.val(v.clazz);
            constants.items.type.val(v.type);
            constants.items.field.val(v.field);
            constants.items.key.val(v.key);
            constants.items.value.val(v.value);
            constants.items.type.val(v.type);
            constants.items.status.val(v.status);

            constants.modals.constantModal.modal("show");

            return false;
        }

    }, {
        name: "删除",
        clazz: "btn-yellow",
        handle: function(v) {

            com.showConfirm("是否确定删除", function() {

                com.post(api.data.deleteConstant, {
                    "constant.cid": v.cid,
                }, function() {

                    searcher.doSearch();
                });
            });
        },
        show: function(v) {

            return false;
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.data.updateConstantForStatus, {
                "constant.cid": v.cid,
                "constant.status": check ? 0 : 1
            }, function(res) {

                searcher.doSearch();
                return false;
            });
        },
        init: function(v) {

            return !v.status;
        }
    }, ];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('a[name="add"]', '#pagenation').click(function() {

        com.cleanItems(constants.items);

        constants.cid = null;

        com.focusPage('#constant').modal("show");
    });

    // 保存
    function saveData() {

        if (com.validate("constant")) {
            return false;
        }

        var url;
        var params = {

            "constant.cid": constants.items.cid.val(),
            "constant.name": constants.items.name.val(),
            "constant.module": constants.items.module.val(),
            "constant.clazz": constants.items.clazz.val(),
            "constant.type": constants.items.type.val(),
            "constant.field": constants.items.field.val(),
            "constant.key": constants.items.key.val(),
            "constant.value": constants.items.value.val(),
            "constant.status": constants.items.status.val(),

        };

        if (constants.cid) {
            params["constant.cid"] = constants.cid;

            url = api.data.updateConstant
        } else {
            url = api.data.addConstant;
        }

        com.post(url, params, function() {

            searcher.doSearch();
            constants.modals.constantModal.modal("hide");
        });
    }

});