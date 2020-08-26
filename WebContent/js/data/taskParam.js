$(function (){

    var taskParam = {

        btns : {
            editConfirmBtn : com.focusPage('#editConfirmBtn'),
            backBtn : com.focusPage('#backBtn'),
            addTaskParam : com.focusPage('#addTaskParam')
        },

        modals : {
            addItemModal:com.focusPage("#addItemModal")
        },

        items : {
            no : com.focusPage("#no"),
            name : com.focusPage('#name'),
            param: com.focusPage("#param"),
            alias : com.focusPage('#alias'),
            type: com.focusPage("#type"),
            handle : com.focusPage("#handles"),
            status: com.focusPage("#status"),
            sort : com.focusPage('#sort'),
            comment: com.focusPage("#comment")
        },

        tid : params.tid,
        tpid : null,
        taskParamType : {},
        taskParamStatus : {},
        editFlg : true
    };

    com.post(api.ds.data, {}, function (res) {
        taskParam.items.type.bindData(res.taskParamType, "key", "value");
        taskParam.taskParamType = res.taskParamType.split("key", "value");
        taskParam.taskParamStatus = res.taskParamStatus.split("key", "value");
    }, null, false);


    taskParam.btns.editConfirmBtn.bindClick(saveData);

    taskParam.modals.addItemModal.on("hide.bs.modal", function () {
        com.clearValidator();
        com.cleanItems(taskParam.items);
    });

    var initList = function (listData) {

        if (listData.length == 0) emptyData('list');

        var $tableWrap = com.focusPage('#list');
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if (listData && listData.length) {
            $.each(listData, function (i, v) {

                var $liLine = $('<li></li>').addClass('clearfix item-orange');
                var $h3 = $('<h3></h3>').addClass('oid');
                var $title = $('<small></small>').addClass('blue').html(v.name);
                var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
                var $btnDelete = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

                var $invalid = $('<div></div>').addClass('pull-right');
                var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
                var $span = $('<span></span>').addClass('lbl status-lbl');

                var propertyArr = [
                    ["编号:",v.no , "grey"],
                    ["字段:", v.param , "grey"],
                    ["别名:", v.alias, "grey"],
                    ["类型:", taskParam.taskParamType[v.type], "red"],
                    ["处理过程:", v.handle, "grey"],
                    ["状态:", taskParam.taskParamStatus[v.status], "red"],
                    ["排序:", v.sort, "blue"],
                    ["说明:", v.comment, "grey"]
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $invalid.append($statusSwitch).append($span);
                $btnDiv.append($invalid).append($btnUpdate).append($btnDelete);
                $h3.append($title).append($btnDiv);
                $liLine.append($h3).append($ulProperty);
                $liLine.appendTo($ul);

                $btnUpdate.click(function () {

                    taskParam.editFlg = false;

                    taskParam.tpid = v.tpid;
                    taskParam.items.no.val(v.no);
                    taskParam.items.name.val(v.name);
                    taskParam.items.param.val(v.param);
                    taskParam.items.alias.val(v.alias);
                    taskParam.items.type.val(v.type);
                    taskParam.items.handle.val(v.handle);
                    taskParam.items.sort.val(v.sort);
                    taskParam.items.comment.val(v.comment);
                    taskParam.modals.addItemModal.modal("show");
                });

                $btnDelete.click(function (e) {
                    delectItem(v);
                });

                !v.status && $statusSwitch.prop("checked", true);

                $invalid.click(function(){
                    var cvalue = $statusSwitch.prop("checked") ? 0:1;

                    updatastatus(v.tpid, cvalue);
                });

            });
            $ul.appendTo($tableWrap);
        }
    };

    taskParam.btns.addTaskParam.click(function() {
        taskParam.editFlg = true;

        taskParam.modals.addItemModal.modal("show");
    });

    function delectItem(v) {
        com.showConfirm("是否确认删除", function(){
            com.post(api.data.deleteTaskParam, {"taskParam.tpid" : v.tpid}, function () {
                com.focusPage('#list').empty();

                queryTaskParam();

                com.showAlert(com.info, "操作成功");
            });
        });

    };

    function saveData(){

        if (com.validate('from')) {
            return false;
        }

        var url;

        var options = {
            "taskParam.tid" : taskParam.tid,
            "taskParam.no" : taskParam.items.no.val(),
            "taskParam.name" : taskParam.items.name.val(),
            "taskParam.param" : taskParam.items.param.val(),
            "taskParam.alias" : taskParam.items.alias.val(),
            "taskParam.type" : taskParam.items.type.val(),
            "taskParam.handle" : taskParam.items.handle.val(),
            "taskParam.sort" : taskParam.items.sort.val(),
            "taskParam.comment" : taskParam.items.comment.val()
        };


        taskParam.editFlg ? url = api.data.addTaskParam : url = api.data.updateTaskParam , options["taskParam.tpid"] = taskParam.tpid;

        com.post(url, options, function () {
            com.focusPage('#list').empty();

            queryTaskParam();

            com.showAlert(com.info, "操作成功");

            taskParam.modals.addItemModal.modal("hide");
        })
    };

    queryTaskParam();

    function queryTaskParam() {
        com.post(api.data.queryTaskParam, {"task.tid": taskParam.tid}, function (data) {
            initList(data.taskParams);
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    };

    function updatastatus(aid, newstatus){

        com.post(api.data.updateTaskParamForStatus, {"taskParam.tpid": aid, "taskParam.status": newstatus}, function(){

            newstatus == 0 ? com.showAlert(com.info, "已启动") : com.showAlert(com.info, "已禁用");

            com.focusPage('#list').empty();

            queryTaskParam();
        });
    };

    function emptyData(id) {
        com.focusPage('#list').empty();

        var $resultList = com.focusPage('#' + id).html('');
        var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
        var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
        var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
    };

});
