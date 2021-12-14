jQuery(function ($) {

    var salary = {

        modals: {
            workersalaryModal: com.focusPage("#workersalaryModal"),
            importModal: com.focusPage("#importModal"),
            batchSendModal: com.focusPage("#batchSendModal"),
        },
        items: {
        	workersalary : com.focusPage("#workersalary", "#workersalaryModal"),
            workersalaryuser : com.focusPage("#workersalaryuser", "#workersalaryModal"),
            workersalarySubtype : com.focusPage("#workersalarySubtype", "#workersalaryModal"),
            workersalarycomment : com.focusPage("#workersalarycomment", "#workersalaryModal"),
            
            beginTime: com.focusPage("#beginTime", "#batchSendModal"),
            finishTime: com.focusPage("#finishTime", "#batchSendModal"),
        },
        
        btns: {
            saveBtn: com.focusPage("#saveBtn"),
            
            batchSendBtn: com.focusPage("#batchSendBtn"),
        },
        
        salaryStatus: {},
        type:{},
        oneType:{},
        constructionSchedule:{},
        salaryType : {},
        twoType:{},
        twotype:{},

    };
    
    com.datetime(salary.items.beginTime);
    com.datetime(salary.items.finishTime);

    salary.btns.saveBtn.bindClick(saveData);
    salary.btns.batchSendBtn.bindClick(batchSend);
    
    salary.modals.workersalaryModal.on('hide.bs.modal', function (e) {
        com.cleanTypeahead("workersalaryuser");
        com.cleanItems(salary.items);
        com.closeTip();
    });

    com.initTypeahead('workersalaryuser', api.personel.queryUserByPinyin, "pinyinName", {"user.status": "0"}, "autoFillKeyValue", "key", "value",function(list,key,value){return value;});

    com.post(api.ds.salary, {}, function (data) {

        salary.salaryStatus=data.status.split("key", "value");
        salary.type=data.type.split("id", "name");
        salary.oneType=data.oneType.split("id", "name");
        salary.twoType=data.SalaryTwoType.split("key", "oneType");
        salary.twotype=data.SalaryTwoType.split("key", "name");
        salary.items.workersalarySubtype.bindData(data.SalaryTwoType,"key","name");

    }, null, false);

    com.post(api.data.queryConstructionNode,{}, function(res){

        salary.constructionSchedule = res.constructionNodes.split("sort","name");

        salary.constructionSchedule[0] = "初始";
        salary.constructionSchedule[1] = "开工";
        salary.constructionSchedule[2] = "完工";

    }, null, false);

    var searcher = new Searcher();
    
    searcher.base("condList", "pagenation", "resultList", api.salary.pageWorkerSalary);
    
    searcher.condition(["salary-orderId", "salary-salaryWorkduty", "salary-jober", "salary-salaryschedule", "salary-worker-count", 'salary-salarystatus',"salary-createTime", 'salary-approveTime']);
    
    searcher.history("workersalaryPostData");
    
    searcher.button([
        {id: "select", name: "全选", clazz: "btn-yellow", icon: ""},
        {id: "add", name: "创建", clazz: "btn-success", icon: "icon-plus"},
        {id: "exports", name: "导出", clazz: "btn-inverse", icon: "icon-download-alt"},
        {id: "imports", name: "导入", clazz: "btn-danger", icon: "icon-upload"},
        {id: "adopt", name: "批量通过", clazz: "btn-warning", icon: ""},
        {id: "batchImport", name: "批量更新", clazz: "btn-pink", icon: ""},
        {id: "batchSend", name: "批量通知", clazz: "btn-success", icon: ""},
    ]);
    
    var lineprops = [
        {field: "wsId", name: "多选", type: "checkbox", prop: "wsId"},
        {field: "orderId", name: "装修单号", prop: "decoration.orderId", clazz: "grey"},
        {field: "village", name: "楼盘", prop: "decoration.house.village.name", clazz: "grey"},
        {field: "houseNumber", name: "楼号", prop: "decoration.house.houseNumber", clazz: "grey"},
        {field: "supervisor", name: "监理", prop: "decoration.supervisor.userName", clazz: "grey"},
        {field: "creater", name: "创建人", prop: "creater.userName", clazz: "grey"},
        {field: "createTime", name: "创建时间", prop: "createTime", clazz: "green"},
        {field: "workerId", name: "工人工号", prop: "user.userId", clazz: "grey"},
        {field: "workerName", name: "工人姓名", prop: "user.currentName", clazz: "grey"},
        {field: "dutyName", name: "工种", prop: "user.duty.name", clazz: "grey"},
        {field: "schedule", name: "施工节点", prop: "schedule", dataset: salary.constructionSchedule, clazz: "red"},
        {field: "approver", name: "审批人", prop: "approver.currentName", clazz: "grey"},
        {field: "approveTime", name: "审批时间", prop: "approveTime", clazz: "green"},
        {field: "type", name: "类型", prop: "type", dataset: salary.type, clazz: "red"},
        {field: "oneType", name: "一类", prop: "oneType", dataset: salary.oneType, clazz: "red"},
        {field: "twotype", name: "二类", prop: "twotype", dataset: salary.twotype, clazz: "red"},
        {field: "money", name: "操作金额", prop: function(v){return v.type == 0 ? v.money : -v.money}, clazz: "blue"},
        {field: "salary", name: "工费", prop: function(v){return v.type == 0 ? v.salary : -v.salary}, clazz: "blue"},
        {field: "deposit", name: "质保金", prop: function(v){return v.type == 0 ? v.deposit : -v.deposit}, clazz: "blue"},
        {field: "count", name: "计数", prop: "count", clazz: "blue", show: function(v){return (v.status in ["0", "1"])}},
        {field: "status", name: "状态", prop: "status", dataset: salary.salaryStatus, clazz: "red"},
        {field: "isSend", name: "消息", prop: "isSend", dataset: {"0": "未发送", "1": "待发送", "2": "已发送"}, clazz: "red"},
    ];
    
    var linebtns = [
        {name: "通过", clazz: "btn-success", handle: function(v){
            adopt(v);
            return false;
        }, show: function(v){
            return v.status == 0;
        }},
        {name: "驳回", clazz: "btn-danger", handle: function(v){
            refuse(v);
            return false;
        }, show: function(v){
            return v.status == 1;
        }},
        {name: "撤销", clazz: "btn-yellow", handle: function(v){
            deletebystatus(v);
            return false;
        }, show: function(v){
            return v.status == 0;
        }},
        {name: "发送通知", clazz: "btn-success", handle: function(v){
            send(v);
            return false;
        }, show: function(v){
            return v.isSend == 0 && v.status == 1;
        }},
        {name: "取消通知", clazz: "btn-yellow", handle: function(v){
            cancel(v);
            return false;
        }, show: function(v){
            return v.isSend == 1;
        }},
    ]
    
    searcher.line("user.userName", lineprops, linebtns);
    
    searcher.render();

    com.focusPage('a[name="add"]', '#pagenation').click(function () {
        salary.modals.workersalaryModal.modal("show");
    });

    com.focusPage('a[name="select"]').click(function () {

        if (com.focusPage('input[type="checkbox"]').prop('checked')) {
            com.focusPage('input[type="checkbox"]').removeAttr('checked');
            com.focusPage('input[type="checkbox"]').prop('checked', false);

        } else {
            com.focusPage('input[type="checkbox"]').attr('checked', true);
            com.focusPage('input[type="checkbox"]').prop('checked', true);

        }
    });

    com.focusPage('a[name="imports"]', '#pagenation').click(function () {
        salary.modals.importModal.modal("show");
    });

    com.focusPage('a[name="batchImport"]', '#pagenation').click(function () {
       salary.modals.workersalaryModal.modal("show");
    });

    com.focusPage('a[name="exports"]', '#pagenation').click(function () {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 5000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.salary.pageWorkerSalary, $.extend({}, params.workersalaryPostData, {"paging.noPage": 1}), function (res) {

            $.exceler({
                column: [
                    ["装修单号", "decoration.orderId"],
                    ['楼盘地址', "decoration.house"],
                    ["等级", "decoration.grade"],
                    ['监理编号', 'decoration.supervisorId'],
                    ['监理', 'decoration.supervisor'],
                    ["工费Id", "wsId"],
                    ["工人姓名", "user.userName"],
                    ["工人工号", "user.userId"],
                    ["工种", "user.duty.name"],
                    ["创建人", "creater.userName"],
                    ["创建时间", "createTime"],
                    ["审批人", 'approver.userName'],
                    ["审批时间", "approveTime"],
                    ['操作金额', 'money'],
                    ['工费', 'salary'],
                    ['质保金', 'deposit'],
                    ['施工节点', 'schedule'],
                    ['工种', 'user.duty.name'],
                    ['类型', 'type'],
                    ['一类', 'onetype'],
                    ['二类', 'twotype'],
                    ['计数', 'count'],
                    ['备注', 'comment'],
                    ['状态', "status"]
                ],
                list: res.paging.data

            }, function (v) {

                v.approver.userName = v.approver.userName == null ? "" : v.approver.userName;
                v.comment = v.comment == null ? "" : v.comment;
                v.approveTime = v.approveTime == null ? "" : v.approveTime;
                v.decoration.supervisorId = (v.decoration.supervisor == null ? "" : v.decoration.supervisor.userId);
                v.decoration.supervisor = (v.decoration.supervisor == null ? "" : v.decoration.supervisor.userName);
                v.decoration.orderId = (v.decoration.orderId == null ? "" : v.decoration.orderId);

                v.decoration.house = (v.decoration.house == null ? "" : v.decoration.house.village.name + "" + v.decoration.house.houseNumber);

                v.status = salary.salaryStatus[v.status];
                v.schedule = v.schedule == 0 ? "" :salary.constructionSchedule[v.schedule];
                v.type = salary.type[v.type];
                v.onetype = salary.oneType[v.onetype];

            });
        });

    });

    com.focusPage('a[name="adopt"]', '#pagenation').click(function (v) {
        
        var checkbox = com.focusPage('input[name="check"]:checked');

        var options = {};
        var cwsids = [];
        
        if (!checkbox.length) {
            com.showAlert(com.warning, "请选择工人工费信息");
            return false;
        }

        $.each(checkbox, function (i, v) {
            
            var $v = $(v);
            
            if($v.attr('cwsid')) cwsids.push($v.attr('cwsid'));
            
            options["workerSalarys[" + i + "].wsId"] = $v.attr('wsid');
        });
        
        if (cwsids.length > 0) {
            com.showAlert(com.error, "转款不允许批量通过");
            return false;
        }

        if (!options) {
            com.showAlert(com.warning, "请选择工人工费信息");
            return false;
        }

        com.post(api.salary.adoptWorkerSalary, options, function () {
            searcher.doSearch();
        });

    });
    
    com.focusPage('a[name="batchSend"]', '#pagenation').click(function () {
        salary.modals.batchSendModal.modal("show");
     });

    function deletebystatus(v) {
        com.post(api.salary.deleteWorkerSalary, {"workerSalary.wsId": v.wsId}, function (res) {
            searcher.doSearch();
        });
    }

    function adopt(v) {
        com.post(api.salary.adoptWorkerSalary, {"workerSalarys[0].wsId": v.wsId}, function (res) {
            searcher.doSearch();
        });
    }

    function refuse(v) {
        com.post(api.salary.rejectWorkerSalary, {"workerSalary.wsId": v.wsId}, function (res) {
            searcher.doSearch();
        });
    }
    
    function send(v) {
        com.post(api.salary.sendWorkerSalary, {"workerSalary.wsId": v.wsId}, function (res) {
            searcher.doSearch();
        });
    }
    
    function cancel(v) {
        com.post(api.salary.cancelWorkerSalary, {"workerSalary.wsId": v.wsId}, function (res) {
            searcher.doSearch();
        });
    }

    function saveData(options) {

        if(com.validate("workersalaryModal")) return  false;

        var option = {
            "workerSalary.user.userId": com.typeahead("workersalaryuser"),
            "workerSalary.money":salary.items.workersalary.val(),
            "workerSalary.onetype": salary.twoType[salary.items.workersalarySubtype.val()],
            "workerSalary.twotype":salary.items.workersalarySubtype.val() ,
            "workerSalary.comment": salary.items.workersalarycomment.val()
        };
        com.post(api.salary.addWorkerSalary, option, function (res) {
            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });
       salary.modals.workersalaryModal.modal("hide");
    }
    
    function batchSend(){
        
        if(com.validate("batchSendModal")) return  false;
        
        var options = {
            "workerSalary.createTime": salary.items.beginTime.val() + " 00:00:00",
            "workerSalary.finishTime": salary.items.finishTime.val() + " 23:59:59",
        }
        
        com.post(api.salary.batchWorkerSalary, options, function (res) {
            
            searcher.doSearch();
            
            salary.modals.batchSendModal.modal("hide");
        });
    }
    
    com.uploadify("#import", "上传文件", api.salary.importWorkerSalary, 'btn btn-success col-sm-12', "*.xls;*.xlsx;", {'uploadType': 4}, 1, function(data){
        searcher.doSearch();
    });

});
