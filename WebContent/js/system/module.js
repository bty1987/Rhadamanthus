$(function() {

    var module = {
        modal: com.focusPage('#moduleModal').on("show.bs.modal", function(a) {

            com.clearValidator();
            com.clearValidator("#materialModelName", !0);
            com.clearValidator("#materialModelNo", !0);
        }),
        btnAdd: com.focusPage('#addModule').click(function() {

            com.cleanItems(module.moduleModalItems);
            com.focusPage('#moduleModal').modal("show");
        }),
        saveBtn: com.focusPage("#saveBtn").on("click", saveData),
        moduleModalItems: {
            name: com.focusPage('#moduleName'),
            icon: com.focusPage('#icon'),
            url: com.focusPage('#url'),
            level: com.focusPage('#level').on('change', function() {

                var val = $(this).val();
                if (val == 1) {
                    com.focusPage('#fatherModule').attr('readonly', true).removeClass('v_required');
                } else {
                    com.focusPage('#fatherModule').removeAttr('readonly').addClass('v_required');
                }
            }),
            fatherModule: com.focusPage('#fatherModule').typeahead({

                list: [],
                source: function(query, process) {

                    var level = com.focusPage('#level').val() - 1;

                    var result = $.map(fatherModuleArr['level' + level], function(val) {

                        return val.name.indexOf(query) == -1 ? null : val;
                    });

                    result = result.length ? result : fatherModuleArr['level' + level];

                    this.options.callback.call(this, result);
                },
                matcher: function(item) {

                    return true;
                },
                callback: function(data) {

                    // this.options.list = data;
                    this.flprocess(data, 'mid', 'name');
                },
                isResultTypeMap: true // 必填值为true,获取key,value的标识,
                ,
                flupdater: function(k, v) {// 下拉列表选中时的一些处理,必填对选中项的key和value做处理

                    // k: key, v:value
                    return v;
                }
            }).attr('readonly', true)
        }
    };

    var seacher = new Searcher();

    seacher.base("condList", "pagenation", "resultList",api.system.pageModule);

    seacher.condition(["system-module-name", "system-module-level"]);

    seacher.history("modulePostData");

    var lineprops = [{
        fieId : "level",
        name : "等级",
        prop : "level",
        clazz : "grey"
    }, {
        fieId : "icon",
        name : "图标",
        prop : "icon",
        clazz : "grey"
    }, {
        fieId : "url",
        name : "链接",
        prop: function(v) {

            return v.url ? v.url : "---";
        },
        clazz : "grey"
    }, {
        fieId : "fatherModule.name",
        name : "上级",
        prop: function(v) {

            return v.fatherModule ? v.fatherModule.name : "---";
        },
        clazz : "grey",

    }, {
        fieId : "module",
        name : "模块",
        prop : "module",
        clazz : "grey"
    }];

    var linebtus = [];

    seacher.line("name", lineprops, linebtus).render();

    // 保存
    function saveData() {

        if (com.validate("moduleModal")) {
            return false;
        }

        var params = {
            "module.name": module.moduleModalItems.name.val(),
            "module.alias": module.moduleModalItems.name.val(),
            "module.icon": module.moduleModalItems.icon.val(),
            "module.url": module.moduleModalItems.url.val(),
            "module.level": module.moduleModalItems.level.val(),
            "module.fatherModule.mid": module.moduleModalItems.fatherModule.attr('data-typeahead-key'),
            "module.system": config.system
        };

        com.post(api.system.addModule, params, function(a) {

            module.modal.modal('hide');
            search();
        });
    }

    function deleteModule(mid) {

        com.showConfirm("是否确定删除", function() {

            com.post(api.system.deleteModule, {
                "module.mid": mid
            }, function() {

                search();
            });
        });
    }

});