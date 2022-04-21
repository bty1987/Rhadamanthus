jQuery(function ($) {

    var plan2create = {

        btns: {
            createPlanBtn : com.focusPage("#createPlanBtn"),
            submitBtn : com.focusPage("#submitBtn"),
        },
        modals: {
            referModal: com.focusPage("#referModal")
        },
        items: {
            dataTime : com.focusPage("#dataTime"),
            time : com.focusPage("#time"),
            taskPlan : com.focusPage("#taskPlan")
        },
        cuItems: {
            cuTime: com.focusPage("#cuTime"),
            orderId: com.focusPage("#orderId")
        },
        taskParam:{
            tpid : null,
            taskParamModule: {},
            taskPlanType: {},
            taskParamIsmain: {},
            taskParamOneType: {}
        },
        tid : null,
        cTime : null,
        args: {},
        data : {},
        unionParams : {}
    };

    plan2create.btns.createPlanBtn.bindClick(cuDate);
    plan2create.btns.submitBtn.bindClick(saveDate);

    com.datetime(plan2create.items.dataTime);
    com.datetime(plan2create.items.time, "time");
    com.datetime(plan2create.cuItems.cuTime, "data", true);

    var $referquery = com.focusPage("#referquery");
    var $referfilling = com.focusPage("#referfilling");

    plan2create.modals.referModal.on("hide.bs.modal", function () {
        com.clearValidator();
        com.cleanItems(plan2create.cuItems);
    });


    com.post(api.data.queryTask, {"task.level": 1}, function (res) {
        var task = []

        $.each(res.tasks, function (i, v) {
            task.push(v)
        });
        plan2create.items.taskPlan.bindData(task, "keyWord", "name", false, null, "tid");
    }, null, false);

    com.post(api.ds.data, {}, function (res) {
        plan2create.taskParam.taskParamModule = res.taskParamModule.split("module", "name");
        plan2create.taskParam.taskPlanType = res.taskParamType.split("key", "value");
        plan2create.taskParam.taskParamIsmain = res.taskParamIsmain.split("key", "value");
        plan2create.taskParam.taskParamOneType = res.taskParamOneType.split("key", "value")
    }, null, false);

    plan2create.items.taskPlan.change(function() {
        com.focusPage("#referquery").empty();
        com.focusPage("#referfilling").empty();
        com.focusPage("#itemfield").empty();
        com.focusPage("#itemitem").empty();
        com.focusPage("#notfield").show();
        com.focusPage("#notitem").show();
        queryTaskParmas()
    });
    queryTaskParmas();
    // 点击标签
    function initItem($div, data, flag){

        var $btn = $(this);
        var args = $btn.data();

        if(data) {
            args = data;
            plan2create.data = data
        };

        plan2create.args = args;

        if (args.type == 1) {
            plan2create.taskParam.tpid = args.tpid;
            if (args.name == "公司") {
                com.focusPage("#notitem").hide();
                plan2create.cTime = 1;
                com.focusPage("#"+ args.tpid).click(createItem());
            } else if (args.name == "装修单号") {
                com.focusPage("#cuTime").hide();
                com.focusPage("#orderId").show();
                plan2create.modals.referModal.modal("show");
            } else {
                com.focusPage("#cuTime").show();
                com.focusPage("#orderId").hide();
                plan2create.modals.referModal.modal("show");
            }
        } else {
            com.focusPage("#notfield").hide();
            com.focusPage("#"+ args.tpid).click(createItem());
        }
    }
    //
    function createItem(){

        if(com.validate("referModal")) return false;

        var id = plan2create.args.id;
        var tid = plan2create.args.tid;
        var name = plan2create.args.name;
        var type = plan2create.args.type;
        var onetype = plan2create.args.onetype;
        var union = plan2create.args.union;
        var unionParam = plan2create.args.unionparam;
        var alias = plan2create.args.alias;
        var module = plan2create.args.module;
        var field = plan2create.args.field;
        var handle = plan2create.args.handle;
        var status = plan2create.args.status;
        var sort = plan2create.args.sort;
        var tableSort = plan2create.args.tablesort;
        var comment = plan2create.args.comment;
        var ismain = plan2create.args.ismain;
        var data = "";


        if(!id){
            id = plan2create.referItems.id.val();
        }

        if(com.focusPage(".refer-item#" + id).length != 0){
            com.showAlert(com.warning, "控件已存在");
            return false;
        }

        var data = {
            "'id'" : id,
            "'tid'" : tid,
            "'name'" : name,
            "'type'" : type,
            "'oneType'" : onetype,
            "'union'" : union,
            "'unionParam'" : unionParam,
            "'alias'" : alias,
            "'data'" : data,
            "'module'" : module,
            "'field'" : field,
            "'handle'" : handle,
            "'status'" : status,
            "'sort'" : sort,
            "'tableSort'" : tableSort,
            "'comment'" : comment,
            "'ismain'" : ismain,
            "'form'" : type == 0 ? "field" : "item"
        };
        drawItem(data, null);

    }
    //
    function drawItem(data, v){

        var liId = data["'type'"] == 0 ? data["'id'"] : data["'id'"] + "|" + plan2create.cTime;
        var $content = com.focusPage("#item"+data["'form'"] );
        var  $liLine = $('<li></li>').addClass('clearfix refer-item').addClass("item-orange").attr("id", liId).data(data).appendTo($content);

        var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(data["'name'"])).appendTo($liLine);
        var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').appendTo($liLine);
        var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

        var $btnUp = $('<a></a>').addClass('btn btn-minier btn-warning').html('上移');
        var $btnDown = $('<a></a>').addClass('btn btn-minier btn-inverse').html("下移");
        var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

        var propertyArr = [
            ["名称:", data["'name'"], "grey"],
            ["类型:", plan2create.taskParam.taskPlanType[data["'type'"]], "red"],
            ["一类:", plan2create.taskParam.taskParamOneType[data["'oneType'"]], "red"],
            ["模块:", plan2create.taskParam.taskParamModule[data["'module'"]], "grey"],
            ["关联:", data["'union'"], "grey"],
            ["关联字段:", plan2create.unionParams[data["'unionParam'"]], "grey"],
            ["字段:", data["'field'"], "grey"],
            ["别名:", data["'alias'"], "grey"],
            ["处理过程:", data["'handle'"], "grey"],
            ["排序:", data["'sort'"], "grey"],
            ["表排序:", data["'tableSort'"], "grey"],
            ["备注:", data["'comment'"], "grey"],
            ["是否主要:", plan2create.taskParam.taskParamIsmain[data["'ismain'"]], "red"]
        ];

        $.each(propertyArr, function (index,value) {
            var $liProperty = $('<li></li>');
            $('<strong></strong>').html(value[0]).appendTo($liProperty);
            $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
            $liProperty.appendTo($ulProperty);
        });

        $btnUp.click(function(){

            var currli = $(this).parents("li");
            var prevli = currli.prev();

            if(prevli && prevli.length != 0) currli.insertBefore(prevli);
        });

        $btnDown.click(function(){

            var currli = $(this).parents("li");
            var nextli = currli.next();

            if(nextli && nextli.length != 0) currli.insertAfter(nextli);
        });

        $btnDel.click(function(){
            $(this).parents("li").remove();
        });

        $divBtnWrap.append($btnUp).append($btnDown).append($btnDel).appendTo($h3);
    }

    function cuDate(){
        plan2create.cTime = plan2create.cuItems.cuTime.val() == "" ? plan2create.cuItems.orderId.val() : plan2create.cuItems.cuTime.val();
        com.focusPage("#"+ plan2create.data.tpid).click(createItem());
        com.focusPage("#notitem").hide();
        plan2create.modals.referModal.modal("hide");
    }
    function saveDate(){

        if (com.validate('referModal'))
            return false;

        var fields = "" ;
        var conditions = "";
        $.each(com.focusPage("#itemfield li").parents("li") ,function (i, v) {
            if (fields == "") {
                fields = v.id;
            } else {
                fields += "," + v.id
            }
        })
        $.each(com.focusPage("#itemitem li").parents("li") ,function (i, v) {
            if (conditions == "") {
                conditions = v.id;
            } else {
                conditions += "," + v.id
            }
        });

        if (fields == "" || conditions == ""){
            com.showAlert(com.warning, "请选择字段和条件");
            return
        }

        var options = {
            "plan.task.keyWord": plan2create.items.taskPlan.val(),
            "plan.param.conditions": conditions,
            "plan.param.fields": fields,
            "plan.task.tid": plan2create.tid,
            "plan.args" : plan2create.cTime,
        };

        var times = plan2create.items.dataTime.val() + ' ' + plan2create.items.time.val();
        var executeTime = new Date(times);
        
        if (planUtils.TimeComparison(executeTime, 5)) {
            options["plan.executeTime"] = plan2create.items.dataTime.val().replace(/-/g, '').substr(2) + plan2create.items.time.val().replace(/:/g, '').substr(0, 4);
        } else {
            com.showAlert(com.warning, "执行时间请大于当前时间5分钟!");
            return
        }

        com.post(api.information.createPlan, options, function (res) {
            
            com.focusPage("#itemfield").empty();
            com.focusPage("#itemitem").empty();
            com.focusPage("#notfield").show();
            com.focusPage("#notitem").show();
            
            com.closePopup();
        });
    }

    function queryTaskParmas() {

        plan2create.tid = plan2create.items.taskPlan.find("option:selected").attr('other');

        com.post(api.data.queryTaskParam, {"taskParam.tid":  plan2create.tid}, function (res) {

            var taskParams = res.taskParams;

            plan2create.unionParams = taskParams.split("tpid", "name");
            plan2create.unionParams[0] = "无";

                $.each(taskParams, function(i, v){
                    if (v.type == 0 || v.type == 1) {
                        var $content = v.type == 0 ? $referquery : $referfilling;
                        var btncolor = v.type == 0 ? "btn-primary" : "btn-warning";

                        var $p = $('<p></p>').addClass("col-xs-6").appendTo($content);
                        var $btn = $('<button></button>').addClass("btn btn-sm referItem col-xs-12").addClass(btncolor).attr({"data-id": v.tpid, "data-tid": v.tid, "data-name": v.name, "data-type": v.type, "data-alias": v.alias, "data-module": v.module, "data-field": v.field, "data-ismain": v.ismain, "data-oneType": v.oneType, "data-union": v.unionField, "data-unionParam": v.unionParam, "data-handle": v.handle, "data-status": v.status, "data-sort": v.sort, "data-tableSort": v.tableSort, "data-comment": v.comment}).appendTo($p);
                        var $span = $("<span></span>").text(v.name).appendTo($btn);
                    }
                });
                com.focusPage(".referItem").click(initItem);
            });
        };
})