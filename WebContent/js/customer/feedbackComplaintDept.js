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
        fcid: params.customer.fcid
    };
    
    complaintDept.items.firstLevel.bindData(constant.customer().feedbackComplaintDept.firstLevel.datas, "key", "value");
    complaintDept.items.secondary.bindData(constant.customer().feedbackComplaintDept.secondary.datas, "key", "value");
    complaintDept.items.problemType.bindData(constant.customer().feedbackComplaintDept.problemType.datas, "key", "value");

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

    var linebtns = [ {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.customer.deleteFeedbackComplaintDept, {
                "feedbackComplaintDept.fcdid": v.fcdid
            }, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
        }
    }];

    searcher.set("condList2", "pagenationFeedbackComplaintDept2", "resultLists2", api.customer.queryFeedbackComplaintDept, {
        "feedbackComplaintDept.fcid": complaintDept.fcid
    }, null, null, "feedbackComplaintDepts", true);

    searcher.button([{
        id: "addFeedbackComplaintDept",
        name: "添加",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        fieId: "dept.name",
        name: "部门",
        prop: "dept.name",
        clazz: "green"
    }, {
        fieId: "duty.name",
        name: "职务",
        prop: "duty.name",
        clazz: "grey"
    }, {
        fieId: "dutyUser.userName",
        name: "责任人",
        prop: "dutyUser.userName",
        clazz: "green"
    }, {
        fieId: "firstLevel",
        name: "一级分类",
        prop: "firstLevel",
        clazz: "red",
        dataset:constant.customer().feedbackComplaintDept.firstLevel.keys
    }, {
        fieId: "secondary",
        name: "二级分类",
        prop: "secondary",
        clazz: "red",
        dataset:constant.customer().feedbackComplaintDept.secondary.keys
    }, {
        fieId: "problemType",
        name: "问题类型",
        prop: "problemType",
        clazz: "red",
        dataset:constant.customer().feedbackComplaintDept.problemType.keys
    }];

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
            "feedbackComplaintDept.firstLevel": complaintDept.items.firstLevel.val(),
            "feedbackComplaintDept.secondary": complaintDept.items.secondary.val(),
            "feedbackComplaintDept.problemType": complaintDept.items.problemType.val(),

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