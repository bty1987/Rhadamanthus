$(function() {

    var operations = {

        items: {
            name: com.focusPage('#name', "#addOperation"),
            operation: com.focusPage('#operation', "#addOperation"),
            type: com.focusPage("#type", "#addOperation"),
            module: com.focusPage('#module', "#addOperation"),
        },

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
        },

        modals: {
            addOperationModal: com.focusPage("#addOperation"),
        },

        datasets: {
            modules: [],
        },

        oid: null,
    };

    com.post(api.ds.system, {}, function(res) {

        operations.items.type.bindData(res.operationType, "key", "value");
    });

    com.post(api.system.queryModule, {
        'module.system': parent.config.system
    }, function(data) {

        operations.datasets.modules = data.modules;
    }, null, false);

    operations.items.module.typeahead({

        list: [],
        source: function(query, process) {

            var level = com.focusPage('#level').val() - 1;

            var result = $.map(operations.datasets.modules, function(val) {

                return val.name.indexOf(query) == -1 ? null : val;
            });

            result = result.length ? result : operations.datasets.modules;

            this.options.callback.call(this, result);
        },
        matcher: function(item) {

            return true;
        },
        callback: function(data) {

            this.flprocess(data, 'mid', 'name');
        },
        isResultTypeMap: true, // 必填值为true,获取key,value的标识,
        flupdater: function(k, v) {// 下拉列表选中时的一些处理,必填对选中项的key和value做处理

            return v;
        }
    });

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.system.pageOperation);

    searcher.condition(["system-operation-name", "system-operation-operation", "system-operation-type"]);

    searcher.history("modulePostData");

    searcher.button([{
        id: "add",
        name: "添加",
        clazz: "btn-success",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        field: "oid",
        name: "编号",
        prop: "oid",
        clazz: "grey"
    }, {
        field: "name",
        name: "操作说明",
        prop: "name",
        clazz: "grey"
    }, {
        field: "module",
        name: "模块",
        prop: function(v) {

            return v.module ? v.module.name : "---"
        },
        clazz: "grey"
    }, {
        field: "type",
        name: "类型",
        prop: function(v) {

            return v.type == 0 ? "权限" : v.type == 1 ? "免检" : v.type == 2 ? "通用" : "钉钉"
        },
        clazz: "grey",
    }, {
        field: "operation",
        name: "操作",
        prop: "operation",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-success",
        handle: function(v) {

            operations.oid = v.oid;
            com.focusPage('#addOperationDialog').text('编辑');

            operations.items.name.val(v.name);
            operations.items.operation.val(v.operation);
            operations.items.type.val(v.type);

            if (v.module) {
                com.updateTypeahead("module", v.module.mid, v.module.name);
            }

            operations.modals.addOperationModal.modal("show");

            return false;
        }
    }, {
        name: "删除",
        clazz: "btn-yellow",
        handle: function(v) {

            com.showConfirm("是否确定删除", function() {

                com.post(api.system.deleteOperation, {
                    "operation.oid": v.oid,
                }, function() {

                    searcher.doSearch();
                });
            });
        }
    }, ];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('a[name="add"]', '#pagenation').click(function() {

        com.cleanItems(operations.items);

        operations.oid = null;

        com.focusPage('#addOperation').modal("show");
    });

    // 保存
    function saveData() {

        if (com.validate("addOperation")) {
            return false;
        }

        var url;
        var params = {
            "operation.name": operations.items.name.val(),
            "operation.operation": operations.items.operation.val(),
            "operation.module.mid": com.typeahead("module"),
            "operation.system": config.system,
            "operation.type": operations.items.type.val()
        };

        if (operations.oid) {
            params["operation.oid"] = operations.oid;

            url = api.system.updateOpperation;
        } else {
            url = api.system.addOperation;
        }

        com.post(url, params, function() {

            searcher.doSearch();
            operations.modals.addOperationModal.modal("hide");
        });
    }

});