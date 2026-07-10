jQuery(function($) {

    var complaintDept = {

        btns: {
            addConfirmBtn: com.focusPage("#addConfirmBtn"),
        },

        modals: {
            addFeedbackComplaintDeptModal: com.focusPage("#addFeedbackComplaintDeptModal")
        },
        items: {
            deptTypeSel: com.focusPage("#deptTypeSel", "#addFeedbackComplaintDeptModal"),
            deptType: com.focusPage("#deptType", "#addFeedbackComplaintDeptModal"),
            duty: com.focusPage("#duty", "#addFeedbackComplaintDeptModal"),
            dutyUser: com.focusPage("#dutyUser", "#addFeedbackComplaintDeptModal"),
            firstLevel: com.focusPage("#firstLevel", "#addFeedbackComplaintDeptModal"),
            secondary: com.focusPage("#secondary", "#addFeedbackComplaintDeptModal"),
            problemType: com.focusPage("#problemType", "#addFeedbackComplaintDeptModal")
        },

        editFlag: false,
        fcdid: null,
        fcid: params.customer.fcid,
        deptType: params.customer.deptType,

    };

    var options = {};

    if (params.customer.deptType.includes(",")) {
        
        var deptTypeList = complaintDept.deptType.split(',');
        
        $.each(deptTypeList, function(i, t) {

            if (t == "设计") {
                options["deptTypes[" + i + "]"] = 1;
                return true;
            }
            if (t == "工程") {
                options["deptTypes[" + i + "]"] = 2;
                return true;
            }
            if (t == "主材") {
                options["deptTypes[" + i + "]"] = 3;
                return true;
            }
            if (t == "尺源") {
                options["deptTypes[" + i + "]"] = 4;
                return true;
            }
            if (t == "未知") {
                options["deptTypes[" + i + "]"] = 5;
                return true;
            }
        });
    }

    com.post(api.customer.queryFeedbackComplaintProblem, options, function(res) {

        complaintDept.items.firstLevel.bindData(res.feedbackComplaintProblems, "fcpid", "name", "请选择");
    });

    var options = {};

    complaintDept.items.firstLevel.on("change", function(b, d) {

        options["deptTypes[" + i + "]"] = complaintDept.items.firstLevel.val();
        com.post(api.customer.queryFeedbackComplaintProblem, options, function(res) {

            complaintDept.items.secondary.bindData(res.feedbackComplaintProblems, "fcpid", "name", "请选择");
        });
    }).trigger("change");

    var options = {};

    complaintDept.items.secondary.on("change", function(b, d) {

        options["deptTypes[" + i + "]"] = complaintDept.items.secondary.val();
        com.post(api.customer.queryFeedbackComplaintProblem, options, function(res) {

            complaintDept.items.problemType.bindData(res.feedbackComplaintProblems, "fcpid", "name", "请选择");
        });
    }).trigger("change");

    com.post(api.communion.queryDepartmentType, {}, function(res) {

        complaintDept.items.deptTypeSel.bindData(res.departmentTypes, "dtid", "name", true);
    });

    complaintDept.items.deptTypeSel.on("change", function(b, d) {

        com.post(api.system.queryDutyByDtid, {
            "duty.departmentType.dtid": $(this).val()
        }, function(res) {

            complaintDept.items.duty.bindData(res.dutys, "did", "name");
        });

        com.post(api.communion.queryDepartmentByDtid, {
            "dept.type.dtid": $(this).val()
        }, function(res) {

            complaintDept.items.deptType.bindData(res.deptList, "did", "name");
        });
    }).trigger("change");

    com.initTypeahead(complaintDept.items.dutyUser, api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, "autoFillKeyValue", "key", "value");

    var searcher = new Searcher();

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = customerPage.getConfig("feedbackComplaintDept");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    var linebtns = [{
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.customer.deleteFeedbackComplaintDept, {
                "feedbackComplaintDept.fcdid": v.fcdid
            }, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
        },
        show: function() { return btnVisible("del"); }
    }];

    searcher.set("condList2", "pagenationFeedbackComplaintDept2", "resultLists2", pageConfig.apiPage || api.customer.queryFeedbackComplaintDept, {
        "feedbackComplaintDept.fcid": complaintDept.fcid
    }, null, null, "feedbackComplaintDepts", true);

    searcher.button([{
        id: "addFeedbackComplaintDept",
        name: "添加",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    var propertyMap = {
        "dept": {
            fieId: "dept.name",
            name: "部门",
            prop: "dept.name",
            clazz: "green"
        },
        "duty": {
            fieId: "duty.name",
            name: "职务",
            prop: "duty.name",
            clazz: "grey"
        },
        "dutyUser": {
            fieId: "dutyUser.userName",
            name: "责任人",
            prop: "dutyUser.userName",
            clazz: "green"
        },
        "firstLevel": {
            fieId: "firstLevel.name",
            name: "一级分类",
            prop: "firstLevel.name",
            clazz: "red"
        },
        "secondary": {
            fieId: "secondary.name",
            name: "二级分类",
            prop: "secondary.name",
            clazz: "red"
        },
        "problemType": {
            fieId: "problemType.name",
            name: "问题类型",
            prop: "problemType.name",
            clazz: "red"
        }
    };

    var lineprops = (function () {

        if (pageConfig.propertyArr.length == 0) {

            var all = [];
            $.each(propertyMap, function (key, prop) { all.push(prop); });
            return all;
        }

        var props = [];
        $.each(pageConfig.propertyArr, function (i, key) {

            if (propertyMap[key]) props.push(propertyMap[key]);
        });
        return props;
    })();

    searcher.line("dept.name", lineprops, linebtns).render();

    com.focusPage('#addFeedbackComplaintDept', '#pagenationFeedbackComplaintDept2').on("click", function() {

        complaintDept.editFlag = false;

        complaintDept.modals.addFeedbackComplaintDeptModal.modal("show");

    });

    complaintDept.btns.addConfirmBtn.click(function() {

        if (com.validate('addFeedbackComplaintDeptModal')) {
            return false;
        }
        
        var url = api.customer.addFeedbackComplaintDept;
        var options = {
            "feedbackComplaintDept.fcid": complaintDept.fcid,
            "feedbackComplaintDept.dept.did": complaintDept.items.deptType.val(),
            "feedbackComplaintDept.duty.did": complaintDept.items.duty.val(),
            "feedbackComplaintDept.dutyUser.userId": com.typeahead(complaintDept.items.dutyUser),
            "feedbackComplaintDept.firstLevel.fcpid": complaintDept.items.firstLevel.val(),
            "feedbackComplaintDept.secondary.fcpid": complaintDept.items.secondary.val(),
            "feedbackComplaintDept.problemType.fcpid": complaintDept.items.problemType.val(),
        };

        if (complaintDept.editFlag) {
            options["complaintDept.fcid"] = complaintDept.fcid;
            url = api.customer.updateFeedbackComplaintDept;
        }

        com.post(url, options, function(e) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();

            complaintDept.modals.addFeedbackComplaintDeptModal.modal("hide");
        });
    });
});