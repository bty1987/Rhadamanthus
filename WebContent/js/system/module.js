$(function() {

    var module = {

        mid: null,

        items: {
            name: com.focusPage('#moduleName', "#moduleModal"),
            alias: com.focusPage('#moduleAlias', "#moduleModal"),
            code: com.focusPage('#moduleCode', "#moduleModal"),
            icon: com.focusPage('#icon', "#moduleModal"),
            url: com.focusPage('#url', "#moduleModal"),
            level: com.focusPage('#level', "#moduleModal").on('change', toggleFatherModule),
            fatherModule: com.focusPage('#fatherModule', "#moduleModal"),
            order: com.focusPage('#moduleOrder', "#moduleModal")
        },

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData)
        },

        modals: {
            moduleModal: com.focusPage("#moduleModal").on("show.bs.modal", function() {
                com.clearValidator();
            })
        },

        datasets: {
            modules: []
        }
    };

    // 加载当前系统全部模块,作为上级模块 typeahead 的数据源
    com.post(api.system.queryModule, {
        "module.system": config.system
    }, function(data) {

        module.datasets.modules = data.modules;
    }, null, false);

    // 上级模块自动补全: 按所选等级(level-1)过滤候选上级
    module.items.fatherModule.typeahead({

        list: [],
        source: function(query, process) {

            var fatherLevel = module.items.level.val() - 1;

            var candidates = $.map(module.datasets.modules, function(val) {

                return val.level == fatherLevel ? val : null;
            });

            var result = $.map(candidates, function(val) {

                return val.name.indexOf(query) == -1 ? null : val;
            });

            result = result.length ? result : candidates;

            this.options.callback.call(this, result);
        },
        matcher: function(item) {

            return true;
        },
        callback: function(data) {

            this.flprocess(data, 'mid', 'name');
        },
        isResultTypeMap: true,
        flupdater: function(k, v) {

            return v;
        }
    }).attr('readonly', true);

    var seacher = new Searcher();

    seacher.base("condList", "pagenation", "resultList", api.system.pageModule);

    seacher.condition(["system-module-name", "system-module-level"]);

    seacher.history("modulePostData");

    seacher.button([{
        id: "addModule",
        name: "添加",
        clazz: "btn-success",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        fieId: "level",
        name: "等级",
        prop: "level",
        clazz: "grey"
    }, {
        fieId: "icon",
        name: "图标",
        prop: "icon",
        clazz: "grey"
    }, {
        fieId: "url",
        name: "链接",
        prop: function(v) {

            return v.url ? v.url : "---";
        },
        clazz: "grey"
    }, {
        fieId: "fatherModule.name",
        name: "上级",
        prop: function(v) {

            return v.fatherModule ? v.fatherModule.name : "---";
        },
        clazz: "grey"
    }, {
        fieId: "module",
        name: "模块",
        prop: "module",
        clazz: "grey"
    }, {
        fieId: "order",
        name: "排序",
        prop: "order",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "更新",
        clazz: "btn-info",
        handle: function(v) {

            module.mid = v.mid;

            com.focusPage('#moduleDialog').text('更新');

            module.items.name.val(v.name);
            module.items.alias.val(v.alias);
            module.items.code.val(v.module);
            module.items.icon.val(v.icon);
            module.items.url.val(v.url);
            module.items.level.val(v.level);
            module.items.order.val(v.order);

            toggleFatherModule();

            if (v.level != 1 && v.fatherModule) {
                com.updateTypeahead("fatherModule", v.fatherModule.mid, v.fatherModule.name);
            }

            module.modals.moduleModal.modal("show");

            return false;
        }
    }, {
        name: "删除",
        clazz: "btn-yellow",
        handle: function(v) {

            com.showConfirm("是否确定删除", function() {

                com.post(api.system.deleteModule, {
                    "module.mid": v.mid
                }, function() {

                    seacher.doSearch();
                });
            });
        }
    }];

    seacher.line("name", lineprops, linebtns).render();

    com.focusPage('#addModule', '#pagenation').on("click", function() {

        module.mid = null;

        com.cleanItems(module.items);

        com.focusPage('#moduleDialog').text('添加');

        toggleFatherModule();

        module.modals.moduleModal.modal("show");
    });

    // 等级联动: 一级模块无上级,置灰并清空; 否则可编辑并设为必填
    function toggleFatherModule() {

        var level = module.items.level.val();

        if (level == 1) {
            module.items.fatherModule.attr('readonly', true).removeClass('v_required').val('').removeAttr('data-typeahead-key');
        } else {
            module.items.fatherModule.removeAttr('readonly').addClass('v_required');
        }
    }

    // 保存(新增/更新)
    function saveData() {

        if (com.validate("moduleModal")) {
            return false;
        }

        var url = api.system.addModule;
        var params = {
            "module.name": module.items.name.val(),
            "module.alias": module.items.alias.val() ? module.items.alias.val() : module.items.name.val(),
            "module.module": module.items.code.val(),
            "module.icon": module.items.icon.val(),
            "module.url": module.items.url.val(),
            "module.level": module.items.level.val(),
            "module.fatherModule.mid": com.typeahead("fatherModule"),
            "module.system": config.system,
            "module.order": module.items.order.val()
        };

        if (module.mid) {
            url = api.system.updateModule;
            params["module.mid"] = module.mid;
        }

        com.post(url, params, function() {

            seacher.doSearch();
            module.modals.moduleModal.modal("hide");
        });
    }

});
