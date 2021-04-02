$(function () {

    var plan = {

        modals: {
            planModal: com.focusPage("#addplanModal")
        },
        items: {
            current: com.focusPage("#current"),
            executeDate: com.focusPage("#executeDate"),
            executeTime: com.focusPage("#executeTime"),
            task : com.focusPage("#task")
        },
        
        btns: {
           saveBtn: com.focusPage("#addplanBtn"),
        },
        
        plugins: {},
        lists: {},
        status: {},

        keyword: null,

        current: "",
        currentTime: getNowFormatDate().substr(2, 10),
    };

    plan.btns.saveBtn.bindClick(saveData);

    plan.modals.planModal.on("hide.bs.modal", function () {
        com.clearValidator();
        com.cleanItems(plan.items);
    });

    com.datetime(plan.items.executeDate);
    com.datetime(plan.items.executeTime, "time");

    com.post(api.ds.information, {}, function(res) {
        plan.status = res.planStatus.split("key", "value");
    }, null, false);

    com.post(api.data.queryTask, {"task.level": 0}, function (res) {
        plan.plugins = res.tasks.split("keyWord", "plugins");
    }, null, false);

    com.post(api.data.queryTaskRoleRightByUserId, {"taskRoleRight.rid": params.userInfo.user.role.rid}, function (res) {
        var task = [];

        $.each(res.taskRoleRights, function(i, v){

            task.push(v.task);
        });

        plan.items.task.bindData(task, "keyWord", "name", false);
    }, null, false);

    planUtils.bindUploadBtn("#attachment", 1070);

    var searcher = new Searcher();
    
    searcher.base("condList", "pagenation", "resultList", api.information.pagePlan);
    
    searcher.condition(["information-plan-task", "information-plan-createTime", "information-plan-status"]);
    
    searcher.button(function () {
        
        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addPlan').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span ></span>').text('添加').appendTo($adda);
        
        var $exporta = $('<a></a>').addClass('btn btn-minier btn-inverse pull-left').attr('id', 'createPlan').css("margin", "0px 3px");
        var $exporti = $('<i></i>').addClass('icon-plus bigger-110').appendTo($exporta);
        var $exportspan = $('<span></span>').text('创建').appendTo($exporta);
    
        return [$adda, $exporta];
    });
    
//    searcher.button([{id: "addPlan", name: "添加", clazz: "btn-yellow", icon: "icon-plus"}]);
    
    var lineprops = [
        {field: "pid", name: "多选", type: "checkbox", prop: "pid"},
        {field: "creater", name: "创建人", prop: "creater.userName", clazz: "grey"},
        {field: "createTime", name: "创建时间", prop: "createTime", clazz: "green"},
        {field: "args", name: "参数", prop: "args", clazz: "grey"},
        {field: "executeTime", name: "执行时间", prop: "executeTime", clazz: "green"},
        {field: "schedule", name: "进度", prop: "schedule", clazz: "grey"},
        {field: "status", name: "状态", prop: "status", dataset: plan.status, clazz: "red"},
        {field: "info", name: "结果信息", prop: "info", clazz: "grey"},
    ];
    
    var linebtns = [
        {name: "下载", clazz: "btn-yellow", handle: function(v){
            window.open(config.media + v.resultFilepath);
            return false;
        }, show: function(v){
            return (v.resultFilepath != null && v.resultFilepath.length != 0) && (v.status == 2);
        }},
        {name: "日志", clazz: "btn-danger", handle: function(v){
            window.open(config.media + v.infoFilepath);
            return false;
        }, show: function(v){
            return v.infoFilepath != null && v.infoFilepath != "";
        }},
        {name: "取消", clazz: "btn-warning", handle: function(v){
            cancel(v);
            return false;
        }, show: function(v){
            return (v.status == 0) && (v.executeTime != null && v.executeTime.length != 0) && (Number(v.executeTime) > Number(plan.currentTime));
        }},
    ]
    
    searcher.line("task.name", lineprops, linebtns);
    
    searcher.render();

    com.focusPage('#addPlan', '#pagenation').on("click", function () {

        com.focusPage("#timediv").addClass("hide");

        taskArgs();
        
        current();
        
        com.focusPage(".planitem").click(current);
        
        plan.modals.planModal.modal("show");
    });

    com.focusPage('#createPlan', '#pagenation').on("click", function () {
        params["searcher"] = searcher;
        com.popup4page("#stockRecordPopUp", "/views/information/plan2create.html", "计划创建")
    });

    function saveData() {

        if (com.validate('addplanModal'))
            return false;

        var options = {
            "plan.task.keyWord": plan.items.task.val()
        };

        var cuts = plan.plugins[plan.keyword];
        var results = cuts.split(",");
        var args = "";
        var flag = false;
        
        $.each(results, function (i, v) {
            if (v == "C") {
                var filePaths = com.focusPage("#filePath");
                if (filePaths.val() == null || filePaths.val() == "") {
                    flag = true;
                    return
                }
                args = args + filePaths.val() + ",";
            }else{
                args = args +  com.focusPage("#id" + i).val()+ ",";
            }
        });
        
        if(flag){
            com.showAlert(com.warning, "上传文件不能为空!");
            return false;
        }
        
        args = args.substring(0, args.length - 1);
        
        var date = plan.items.executeDate.val();
        var time = plan.items.executeTime.val();
        
        var executeTime = date.replace(/-/g, '').substr(2) + time.replace(/:/g, '').substr(0, 4);
        
        options["plan.args"] = args;
        options["plan.executeTime"] = executeTime;
        
        if(executeTime < plan.current){
            com.showAlert(com.warning, "执行时间已超时");
            return false;
        }
        
        var plans = [];
        
        com.post(api.information.existPlan, options, function(res){
            plans = res.plans;
        }, null, false);
        
        if(plans && plans.length != 0){
            com.showSelection("该计划已经成功执行, 是否直接下载", {"下载": function(){
                window.open(config.media + plans[0].resultFilepath);
                com.closePopup();
                plan.modals.planModal.modal("hide");
            }, "创建": function(){
                com.post(api.information.createPlan, options, function (res) {
                    com.showAlert(com.info, "计划创建成功!");
                    plan.modals.planModal.modal("hide");
                    searcher.doSearch();
                });
            }, "取消": function(){
                com.closePopup();
            }})
        }else{
            com.post(api.information.createPlan, options, function (res) {
                com.showAlert(com.info, "计划创建成功!");
                plan.modals.planModal.modal("hide");
                searcher.doSearch();
            });
        }
    }

    function cancel(v) {
        com.showConfirm('是否确认撤销计划', function () {
            com.post(api.information.cancelPlan, {"plan.pid": v.pid}, function (res) {
                searcher.doSearch();
            });
        });
    }
    
    function current(){
        com.post(api.common.current, {"current": "yyyy-MM-dd hh:mm:ss"}, function(res){
            plan.current = res.current.replace(/[-:\s]/g, '').substr(2, 10);
            plan.items.current.val(res.current);
        });
    }

    function getNowFormatDate() {
        var date = new Date();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = "" + date.getFullYear() + month + strDate + date.getHours() + date.getMinutes();

        return currentdate;
    }

    taskArgs();

    function taskArgs() {
        plan.items.task.on("change", function (e) {
            $this = $(this);

            com.focusPage("#timediv").removeClass("hide");

            var asd = com.focusPage("#pluginss");
            
            asd.empty();

            var keyworld = $this.val();
            plan.keyword = keyworld;
            var cut = plan.plugins[keyworld];
            if (cut != null) {
                var result = cut.split(",");
                $.each(result, function (i, v) {
                    var divId = plan.lists[v];
                    if (v !== null && v != "") {
                        var idName = "id" + i;
                        eval("planUtils.Plugins" + v + "(" + i + ")");
                        plan.lists[v] = idName;
                    }
                });
            }
        }).trigger("change");
    }

});