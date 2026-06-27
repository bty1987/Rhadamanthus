$(function () {
// 定义全局变量 json
    var userRequire = {
        status: [],
        saveBtn: com.focusPage("#addplanBtn").on("click", saveData),// 绑定事件
        cancelBtn: com.focusPage("#cancelplanBtn"),//取消
        modal: com.focusPage("#addplanModal"),//添加
        userRequireItems: {},
        userRequireItem:{}
    };

    userRequire.userRequireItems.backVisitContent = com.focusPage("#backVisitContent");//需求内容
    userRequire.userRequireItem.type = com.focusPage("#type");//类型
    userRequire.userRequireItem.status = com.focusPage("status");//状态

    userRequire.modal.on('hide.bs.modal', function (e) {
        com.cleanItems(userRequire.userRequireItems);
        com.closeTip();
    });

    // 状态/类型映射
    var statusMap = {
        "0": "初始",
        "1": "通过",
        "2": "拒绝",
        "3": "完成"
    };
    var typeMap = {
        "0": "招聘",
        "1": "培训"
    };

    var lineprops = (function() {

        return [{
            field: "creater.userName",
            name: "创建人",
            prop: "creater.userName",
            clazz: "grey"
        }, {
            field: "dept.name",
            name: "归属部门",
            prop: "dept.name",
            clazz: "grey"
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        }, {
            field: "receiveId.currentName",
            name: "接收人",
            prop: "receiveId.currentName",
            clazz: "grey"
        }, {
            field: "content",
            name: "需求内容",
            prop: function(v) { return v.content != null ? v.content : "---"; },
            clazz: "grey"
        }, {
            field: "approveTime",
            name: "审批时间",
            prop: function(v) { return v.approveTime != null ? v.approveTime : "---"; },
            clazz: "green"
        }, {
            field: "finishTime",
            name: "完成时间",
            prop: function(v) { return v.finishTime != null ? v.finishTime : "---"; },
            clazz: "green"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return statusMap[v.status]; },
            clazz: "red"
        }, {
            field: "type",
            name: "类型",
            prop: function(v) { return typeMap[v.type]; },
            clazz: "red"
        }];
    })();

    var linebtns = (function() {

        return {
            approve: {
                name: "通过",
                clazz: "btn-yellow",
                handle: function(v) {

                    currency(v);
                }
            },
            refuse: {
                name: "拒绝",
                clazz: "btn-danger",
                handle: function(v) {

                    refuse(v);
                }
            },
            complete: {
                name: "完成",
                clazz: "btn-warning",
                handle: function(v) {

                    complete(v);
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addplan').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.personel.PageUserRequire, null, [], "userRequirePostData_test_", null, false, buttons);
    searcher.line("creater.userName", lineprops, linebtns).render();

    com.focusPage('[name="addplan"]', '#pagenation').on("click", function () {  // 选择器 [属性名="属性值"] 匿名函数
        userRequire.modal.modal("show");
    });

    // 保存
    function saveData() {

        var options = {
            "userRequire.content": com.focusPage("#backVisitContent").val(),
            "userRequire.type": com.focusPage("#type").val(),
        };

        com.post(api.personel.addUserRequire, options, function (res) {
            com.showAlert(com.info, "创建成功!");
            userRequire.modal.modal("hide");
            searcher.doSearch();
        });
    }

    //取消
    com.focusPage("#cancelplanBtn").on("click",function () {
        com.cleanItems(userRequire.userRequireItems);
    });

    //通过
    function currency(v) {

    	com.showConfirm("是否确认通过审批?", function(result){
            var options = {
                "userRequire.urid": v.urid,
             };
            com.post(api.personel.approveUserRequire, options, function (res) {
            	com.showAlert(com.info, "审批通过!");
            	userRequire.modal.modal("hide");
            	searcher.doSearch();
            });
        });
    }

    //拒绝
    function refuse(v) {

    	com.showConfirm("是否确认拒绝审批?", function(result){
            var options = {
               "userRequire.urid": v.urid,
            };
            com.post(api.personel.refuseUserRequire, options, function (res) {
                com.showAlert(com.info, "审批拒绝!");
                userRequire.modal.modal("hide");
                searcher.doSearch();
             });
        });
    }

    //完成
    function complete(v) {

    	com.showConfirm("是否确认完成审批?", function(result){
                var options = {
                    "userRequire.urid": v.urid,
                };
                com.post(api.personel.finishUserRequire, options, function (res) {

                    com.showAlert(com.info, "审批完成!");
                    userRequire.modal.modal("hide");
                    searcher.doSearch();
                });
        });
    }
});
