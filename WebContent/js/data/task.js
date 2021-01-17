$(function(){
    
    var task= {
        
        tid: null,
        
        btns: {
            saveBtn: com.focusPage("#addTaskBtn").on("click", saveData),
        },
        
        modals: {
            addTaskModal: com.focusPage("#addtaskModal")
        },
        
        taskItems : {
	        name : com.focusPage("#taskName"),
	        filepath : com.focusPage("#filepath"),
	        tasklevel : com.focusPage("#tasklevel"),
	        tasktype : com.focusPage("#tasktype"),
	        handle : com.focusPage("#handle"),
	        plugins : com.focusPage("#plugins"),
	        isShow : com.focusPage("#isShow"),
        },
        
        editFlg: false,
        
        taskLevel: ["功能级", "模块级"],
        taskType:["python","shell"],
        isShow:["显示","不显示"],

    };
    
    var taskRegular ={
        validator: {
            taskNumberAll:{
                type: "v_zhengze",
                regex: /^([A-Z])(,([A-Z]))*$/,
                errorMsg: "请输入A-Z,如两位以上用,分隔"}// 正数或负数 小数3位
        }
    };

    task.modals.addTaskModal.on("hide.bs.modal", function(a) {
        com.cleanItems(task.taskItems);
        com.clearValidator();
    });

    $.extend(com.validator, taskRegular.validator);

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ,用来显示的div的id
     * result.list 列表的json数组
     * */
    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){   //页面中的一条数据

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html( v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('查看');
            var $btnTaskParam = $('<a></a>').addClass('btn btn-minier btn-success').html('任务字段');

            //启用禁用
            var $btnStatus = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
            var $isShowSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
            var $span = $('<span></span>').addClass('lbl');

            var propertyArr = [
                ["文件路径:", v.filepath, "grey"],
                ["等级:", task.taskLevel[v.level], "grey"],
                ["类型:", task.taskType[v.type], "grey"],
                ["配置:", v.plugins, "grey"],
                ["显示标识:", task.isShow[v.isShow],"grey"]
            ];

            $.each(propertyArr, function(index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $btnStatus.append($statusSwitch).append($isShowSwitch).append($span);

            $divBtnWrap.append($btnEdit).append($btnStatus).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            if (v.level == 1){
                $divBtnWrap.append($btnTaskParam);
            }

            $btnTaskParam.click(function(){
                params['tid'] = v.tid;
                com.popup4page("#stockRecordPopUp","/views/data/taskParam.html","任务字段")
            });

            //编辑按钮的点击事件
            $btnEdit.click(function(){

                task.tid = v.tid;
                
                task.taskItems.tid = v.tid;
                task.taskItems.tasklevel.val(v.level);
                task.taskItems.tasktype.val(v.type);
                task.taskItems.filepath.val(v.filepath);
                task.taskItems.name.val(v.name);
                task.taskItems.handle.val(v.handle);
                task.taskItems.isShow.val(v.isShow);

                task.modals.addTaskModal.modal("show");
            });

            !v.status && $statusSwitch.prop("checked", true);
            $statusSwitch.switchBtn("status-lbl").on("click",function() {
                $statusSwitch.prop("checked") ? (updateStatus(v.tid, 0, function(){$statusSwitch.removeAttr("checked");})) : (updateStatus(v.tid, 1,function(){$statusSwitch.prop("checked");}));
            });

            !v.isShow && $isShowSwitch.prop("checked", true);
            $isShowSwitch.switchBtn("status-lbl").on("click",function() {
                $isShowSwitch.prop("checked") ? (updateIsShow(v.tid, 0, function(){$isShowSwitch.removeAttr("checked");})) : (updateIsShow(v.tid, 1,function(){$isShowSwitch.prop("checked");}));
            });
            return $liLine;
        };

        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();

    var taskSeacher = new Searcher();
    taskSeacher.init( ["data-task-name"], "condList", api.data.pageTask, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "taskPostData", null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addTask').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span ></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage('#addTask' , '#pagenation').on("click",function(){
        
        task.tid = null;

        task.modals.addTaskModal.modal("show");
    });

    function saveData(){

        if(com.validate('addtaskModal'))  return false;
        
        var url = api.data.addTask;
        var options = {
            "task.name": task.taskItems.name.val(),
            "task.filepath":task.taskItems.filepath.val(),
            "task.level":task.taskItems.tasklevel.val(),
            "task.type":task.taskItems.tasktype.val(),
            "task.handle":task.taskItems.handle.val(),
            "task.plugins":task.taskItems.plugins.val(),
            "task.isShow":task.taskItems.isShow.val()
        };
        
        if(task.tid) {
            url = api.data.updateTask;
            options["task.tid"] =  task.taskItems.tid;
        }
        
        com.post(url, options, function(){
            taskSeacher.doSearch();
            task.modals.addTaskModal.modal("hide");
        });
    }

    function updateStatus(id, status, failcallBack) {

        com.post(api.data.updateTaskForStatus, {
            "task.tid": id,
            "task.status": status
        }, null, function () {
            failcallBack && failcallBack();
        });
    }

    function updateIsShow(id,isShow,failcallBack){

        com.post(api.data.updateTaskForIsShow, {
            "task.tid": id,
            "task.isShow": isShow
        },null,function () {
            failcallBack && failcallBack();
        });

    }

});
