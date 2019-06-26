$(function(){
//定义全局变量  json
    var  task= {
        saveBtn: com.focusPage("#addTaskBtn").on("click", saveData),//绑定事件
        cancelBtn: null,
        modal: com.focusPage("#addtaskModal").on("show.bs.modal", function(a) {
            com.clearValidator();
        }),
        
        cancelBtn : com.focusPage("#cancelTaskBtn"),
        modal : com.focusPage("#addtaskModal"),
        
        taskItems : {
	        name : com.focusPage("#taskName"),
	        filepath : com.focusPage("#filepath"),
	        tasktype : com.focusPage("#tasktype"),
	        handle : com.focusPage("#handle"),
	        plugins : com.focusPage("#plugins"),
	        isShow : com.focusPage("#isShow"),
        },
    
        taskItems: {},
        editFlg: false,
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


            //启用禁用
            var $btnStatus = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
            var $isShowSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
            var $span = $('<span></span>').addClass('lbl');

            var propertyArr = [
                ["文件路径:", v.filepath, "grey"],
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

            //编辑按钮的点击事件
            $btnEdit.click(function(){
                edit(v);
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

    taskSeacher.init( ["taskName"], "condList", api.information.pageTask, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "taskPostData", null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addTask').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span ></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    //编辑
    function edit(row){
        task.modal.modal("show"); //弹出弹层
        task.editFlg=true;
        task.taskItems.tid = row.tid;
        task.taskItems.tasktype.val(row.type);
        task.taskItems.filepath.val(row.filepath);
        task.taskItems.name.val(row.name);
        task.taskItems.handle.val(row.handle);
        task.taskItems.isShow.val(row.isShow);
        com.focusPage("#addTaskBtn").addClass("hide");
    //$("#addTaskBtn"  ,'.modal-footer').css({"display":"none"});
    }
    //保存
    function saveData(){

        if(com.validate())
            return;
        var url;

        var options = {
            "task.name": task.taskItems.name.val(),
            "task.filepath":task.taskItems.filepath.val(),
            "task.type":task.taskItems.tasktype.val(),
            "task.handle":task.taskItems.handle.val(),
            "task.plugins":task.taskItems.plugins.val(),
            "task.isShow":task.taskItems.isShow.val()
        };

        if(task.editFlg) {
            url = api.information.updatetask;
            options["task.tid"] =  task.taskItems.tid;
        }else{
            url = api.information.addTask;
        }

        com.post(url, options, successCallback);

        task.modal.modal("hide");
    }

    //添加
    com.focusPage('[name="addTask"]' , '#pagenation').on("click",function(){  //选择器 [属性名="属性值"]  匿名函数

        com.cleanItems(task.taskItems);
        task.modal.modal("show");
        com.focusPage("#addTaskBtn").removeClass("hide");
        // com.focusPage("#addTaskBtn"  ,'.modal-footer').css({"display":"none"});
        task.editFlg = false;

    });

    //启用禁用功能
    function updateStatus(id, status, failcallBack) {

        com.post(api.information.updateTaskForStatus, {
            "task.tid": id,
            "task.status": status
        }, function () {

        }, function () {
            failcallBack && failcallBack();
        });
    }

    //显示与不显示
    function updateIsShow(id,isShow,failcallBack){

        com.post(api.information.updateTaskForIsShow, {
            "task.tid": id,
            "task.isShow": isShow
        },function(){

        },function () {
            failcallBack && failcallBack();
        });

    }
    //刷新
    function successCallback(){
        //$('button.btn-search','#condList').click();//调用成功后,执行查询操作
        taskSeacher.doSearch();//调用成功后,执行com.Seacher中的doSeach方法
    }

});
