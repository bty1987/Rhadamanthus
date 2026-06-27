$(function() {
    var taskParam = {

        btns: {
            editConfirmBtn: com.focusPage('#editConfirmBtn')
        },

        modals: {
            addItemModal: com.focusPage("#addItemModal")
        },

        items: {
            name: com.focusPage('#name'),
            table: com.focusPage("#table"),
            alias: com.focusPage('#alias'),
            type: com.focusPage("#type"),
            oneType: com.focusPage("#oneType"),
            module: com.focusPage("#module"),
            field: com.focusPage('#field'),
            ismain: com.focusPage("#ismain"),
            unionField: com.focusPage("#unionField"),
            unionParam: com.focusPage("#unionParam"),
            handle: com.focusPage("#handle"),
            status: com.focusPage("#status"),
            sort: com.focusPage("#sort"),
            tableSort: com.focusPage("#tableSort"),
            comment: com.focusPage("#comment")
        },

        tpid: null,
        taskParamType: {},
        editFlg: false,
        taskParamIsmain: {},
        taskParamModule: {},
        taskParamOneType: {},
        taskParamStatus: {},
        unionParams: {},

        pageType: params.urlLoadParams.type
    };

    taskParam.btns.editConfirmBtn.bindClick(saveData);

    taskParam.modals.addItemModal.on("hide.bs.modal", function() {
        com.clearValidator();
        com.cleanItems(taskParam.items);
    });

    com.post(api.ds.data, {}, function(res) {
        taskParam.items.type.bindData(res.taskParamType, "key", "value");
        taskParam.items.module.bindData(res.taskParamModule, "module", "name");
        taskParam.items.ismain.bindData(res.taskParamIsmain, "key", "value");
        taskParam.items.oneType.bindData(res.taskParamOneType, "key", "value");
        taskParam.taskParamType = res.taskParamType.split("key", "value");
        taskParam.taskParamModule = res.taskParamModule.split("module", "name");
        taskParam.taskParamIsmain = res.taskParamIsmain.split("key", "value");
        taskParam.taskParamOneType = res.taskParamOneType.split("key", "value");
        taskParam.taskParamStatus = res.taskParamStatus.split("key", "value");
    }, null, false);

    if (taskParam.pageType != "task") {
        com.post(api.communion.queryTaskParam, {
            "taskParam.tid": params.data.task.tid
        }, function(res) {
            taskParam.unionParams = res.taskParams.split("tpid", "name");
            taskParam.unionParams[0] = "无";
            var tParams = [];
            $.each(res.taskParams, function(i, v) {
                tParams.push(v)
            });
            taskParam.items.unionParam.bindData(tParams, "tpid", "name", true);
        }, null, false)
    };

    var lineprops = (function() {

        return [{
            field: "module",
            name: "模块",
            prop: function(v) { return taskParam.taskParamModule[v.module]; },
            clazz: "grey"
        }, {
            field: "field",
            name: "字段",
            prop: "field",
            clazz: "grey"
        }, {
            field: "alias",
            name: "别名",
            prop: "alias",
            clazz: "grey"
        }, {
            field: "type",
            name: "类型",
            prop: function(v) { return taskParam.taskParamType[v.type]; },
            clazz: "red"
        }, {
            field: "oneType",
            name: "一类",
            prop: function(v) { return taskParam.taskParamOneType[v.oneType]; },
            clazz: "red"
        }, {
            field: "tableName",
            name: "表名",
            prop: "tableName",
            clazz: "grey"
        }, {
            field: "unionField",
            name: "关联",
            prop: "unionField",
            clazz: "grey"
        }, {
            field: "unionParam",
            name: "关联字段",
            prop: function(v) { return taskParam.unionParams[v.unionParam]; },
            clazz: "grey"
        }, {
            field: "handle",
            name: "处理过程",
            prop: "handle",
            clazz: "grey"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return taskParam.taskParamStatus[v.status]; },
            clazz: "red"
        }, {
            field: "sort",
            name: "排序",
            prop: "sort",
            clazz: "grey"
        }, {
            field: "tableSort",
            name: "表排序",
            prop: "tableSort",
            clazz: "grey"
        }, {
            field: "comment",
            name: "说明",
            prop: "comment",
            clazz: "grey"
        }, {
            field: "ismain",
            name: "是否主要",
            prop: function(v) { return taskParam.taskParamIsmain[v.ismain]; },
            clazz: "red"
        }];
    })();

    var linebtns = (function() {

        var btns = {};

        if (taskParam.pageType != "task") {
            btns.status = {
                type: "switch",
                init: function(v) { return !v.status; },
                handle: function(v, checked) {
                    var cvalue = checked ? 0 : 1;
                    com.post(api.communion.updateTaskParamForStatus, {
                        "taskParam.tpid": v.tpid,
                        "taskParam.status": cvalue
                    }, function(res) {
                        cvalue == 0 ? com.showAlert(com.info, "已启用") : com.showAlert(com.info, "已禁用");
                        searcher.doSearch();
                    });
                }
            };
            btns.edit = {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {
                    taskParam.editFlg = false;
                    taskParam.tpid = v.tpid;
                    taskParam.items.name.val(v.name);
                    taskParam.items.module.val(v.module);
                    taskParam.items.field.val(v.field);
                    taskParam.items.alias.val(v.alias);
                    taskParam.items.type.val(v.type);
                    taskParam.items.oneType.val(v.oneType);
                    taskParam.items.table.val(v.tableName);
                    taskParam.items.unionField.val(v.unionField);
                    taskParam.items.unionParam.val(v.unionParam);
                    taskParam.items.ismain.val(v.ismain);
                    taskParam.items.handle.val(v.handle);
                    taskParam.items.sort.val(v.sort);
                    taskParam.items.tableSort.val(v.tableSort);
                    taskParam.items.comment.val(v.comment);
                    taskParam.modals.addItemModal.modal("show");
                }
            };
            btns.delete = {
                name: "删除",
                clazz: "btn-danger",
                handle: function(v) {
                    com.showConfirm("是否确认删除", function() {
                        com.post(api.communion.deleteTaskParam, {
                            "taskParam.tpid": v.tpid
                        }, function() {
                            searcher.doSearch();
                            com.showAlert(com.info, "操作成功");
                        });
                    });
                }
            };
        }

        return btns;
    })();

    var buttons = (function() {

        if (taskParam.pageType == "task") {
            return [];
        }

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addTaskParam').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("taskParamCondList", "taskParamPagenation", "taskParamResultList", api.communion.pageTaskParam, null, ['data-taskParam-module'], "taskParamPostData", null, false, buttons);
    searcher.line(function(v) { return ' ' + v.name; }, lineprops, linebtns).render();

    com.focusPage('#addTaskParam').click(function() {
        taskParam.editFlg = true;
        taskParam.modals.addItemModal.modal("show");
    });

    function saveData() {

        var url;

        var options = {
            "taskParam.name": taskParam.items.name.val(),
            "taskParam.tid": params.data.task.tid,
            "taskParam.module": taskParam.items.module.val(),
            "taskParam.field": taskParam.items.field.val(),
            "taskParam.alias": taskParam.items.alias.val(),
            "taskParam.type": taskParam.items.type.val(),
            "taskParam.oneType": taskParam.items.oneType.val(),
            "taskParam.unionField": taskParam.items.unionField.val(),
            "taskParam.unionParam": taskParam.items.unionParam.val(),
            "taskParam.tableName": taskParam.items.table.val(),
            "taskParam.ismain": taskParam.items.ismain.val(),
            "taskParam.handle": taskParam.items.handle.val(),
            "taskParam.sort": taskParam.items.sort.val(),
            "taskParam.tableSort": taskParam.items.tableSort.val(),
            "taskParam.comment": taskParam.items.comment.val(),
        };

        taskParam.editFlg ? url = api.communion.addTaskParam : url = api.communion.updateTaskParam, options["taskParam.tpid"] = taskParam.tpid;

        com.post(url, options, function() {
            com.focusPage('#list').empty();
            searcher.doSearch();
            com.showAlert(com.info, "操作成功");

            taskParam.modals.addItemModal.modal("hide");
        })
    };

})