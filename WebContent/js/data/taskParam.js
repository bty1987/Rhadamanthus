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

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid')
            var $title = $('<small></small>').addClass('blue').html(' ' + v.name);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var $invalid = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({
                "type": "checkbox"
            });
            var $span = $('<span></span>').addClass('lbl status-lbl');
            var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnDelete = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

            var propertyArr = [["模块:", taskParam.taskParamModule[v.module], "grey"], ["字段:", v.field, "grey"], ["别名:", v.alias, "grey"], ["类型:", taskParam.taskParamType[v.type], "red"], ["一类:", taskParam.taskParamOneType[v.oneType], "red"], ["表名:", v.tableName, "grey"], ["关联:", v.unionField, "grey"], ["关联字段:", taskParam.unionParams[v.unionParam], "grey"], ["处理过程:", v.handle, "grey"], ["状态:", taskParam.taskParamStatus[v.status], "red"], ["排序:", v.sort, "grey"], ["表排序:", v.tableSort, "grey"], ["说明:", v.comment, "grey"], ["是否主要:", taskParam.taskParamIsmain[v.ismain], "red"], ];

            $.each(propertyArr, function(index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
            if (taskParam.pageType == "task") {
                $liLine.append($h3).append($ulProperty);
                $h3.append($title).append($btnDiv);
            } else {
                $invalid.append($statusSwitch).append($span);
                $liLine.append($h3).append($ulProperty);
                $btnDiv.append($invalid).append($btnUpdate).append($btnDelete);
                $h3.append($title).append($btnDiv);
            }

            !v.status && $statusSwitch.prop("checked", true);

            $btnUpdate.click(function() {

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
            });

            $btnDelete.click(function() {
                com.showConfirm("是否确认删除", function() {
                    com.post(api.communion.deleteTaskParam, {
                        "taskParam.tpid": v.tpid
                    }, function() {
                        searcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                });
            });

            $invalid.click(function() {
                var cvalue = $statusSwitch.prop("checked") ? 0 : 1;

                var options = {
                    "taskParam.tpid": v.tpid,
                    "taskParam.status": cvalue
                }

                com.post(api.communion.updateTaskParamForStatus, options, function(res) {
                    cvalue == 0 ? com.showAlert(com.info, "已启用") : com.showAlert(com.info, "已禁用");
                    searcher.doSearch();
                });
            });
            return $liLine;
        };

        return {
            init: function(tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function(v) {
                return creatLine(v);
            }
        }
    })();

    var searcher = new Searcher();

    searcher.init(['data-taskParam-module'], "taskParamCondList", api.communion.pageTaskParam, function(data) {
        displayFunc.init('taskParamResultList', data);
    }, "taskParamPagenation", "taskParamPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addTaskParam').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        if (taskParam.pageType != "task") {
            return [$adda];
        }
        return [];
    }, 'resultList');

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