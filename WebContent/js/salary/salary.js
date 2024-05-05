$(function() {

    var salary = {

        saveBtn: com.focusPage("#saveBtn"),
        cancelBtn: com.focusPage("#cancelBtn"),

        modals: {
            salaryModal: com.focusPage("#salaryModal")
        },
        items: {
            salaryuser: com.focusPage("#salaryuser"),
            money: com.focusPage("#money"),
            type: com.focusPage("#type1"),
            salaryOnetype: com.focusPage("#type2"),
            salaryTwotype: com.focusPage("#type3"),
            salaryThrType: com.focusPage("#type4"),
            salarycomment: com.focusPage("#salarycomment")
        },

        status: {},
        type: {},

        oneType: [],
        twoType: [],
        thrType: [],
        forType: [],

        pageType: params.urlLoadParams.pagetype
    };

    salary.saveBtn.bindClick(saveData);

    salary.modals.salaryModal.on('hide.bs.modal', function(e) {

        com.cleanTypeahead('salaryuser');
        com.closeTip();
        com.cleanItems(salary.items);
    });

    com.initTypeahead('salaryuser', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": "0"
    }, "autoFillKeyValue", "key", "value", function(list, key, value) {

        return value;
    });

    com.post(api.ds.salary, {}, function(data) {

        salary.oneType = data.oneType.split("id", "name");
        salary.twoType = data.twoType.split("id", "name");
        salary.thrType = data.thrType.split("id", "name");
        salary.forType = data.forType.split("id", "name");

    }, null, false);

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.salary.pageSalary);

    searcher.condition(["salary-user", "salary-salary-status", "salary-createTime", "salary-operateTime"]);

    if (salary.pageType == "belong") {
        searcher.param({
            "salary.user.userId": params.userInfo.user.userId,
        });
    }

    searcher.button([{
        id: "addSalary",
        name: "添加",
        clazz: "btn-blue",
        icon: "icon-plus",
        show: function() {

            return salary.pageType != "belong";
        }
    }]);

    var lineprops = [{
        field: "userName",
        name: "归属人",
        prop: "user.currentName",
        clazz: "grey",
        show: function(v) {

            return salary.pageType != "belong";
        }
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.salary().salary.type.keys,
    }, {
        field: "money",
        name: "操作金额",
        prop: "money",
        clazz: "blue"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.salary().salary.status.keys,
    }, {
        field: "operater",
        name: "操作人",
        prop: "operater.currentName",
        clazz: "grey",
        show: function(v) {

            return salary.pageType != "belong";
        }
    }, {
        field: "operateTime",
        name: "操作时间",
        prop: "operateTime",
        clazz: "green",
        show: function(v) {

            return salary.pageType != "belong";
        }
    }, {
        field: "comment",
        name: "说明",
        prop: "comment",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "通过",
        clazz: "btn-yellow",
        handle: function(v) {

            adoptstatus(v.sid);
        },
        show: function(v) {

            return salary.pageType != "belong";
        }
    }, {
        name: "拒绝",
        clazz: "btn-success",
        handle: function(v) {

            rejectstatus(v.sid);
        },
        show: function(v) {

            return salary.pageType != "belong";
        }
    }, {
        name: "撤销",
        clazz: "btn-warning",
        handle: function(v) {

            cancelstatus(v.sid);
        },
        show: function(v) {

            return salary.pageType != "belong";
        }
    }];

    searcher.line(function(v) {

        return (v.comment == null ? "" : v.comment) + " " + salary.twoType[v.twotype] + " " + v.money;
    }, lineprops, linebtns);

    searcher.render();

    com.focusPage('#addSalary', '#pagenation').on("click", function() {

        salary.modals.salaryModal.modal("show");

        cleanType([1, 2, 3, 4]);

        com.post(api.ds.salary, {}, function(res) {

            $.each(res.type, function(i, v) {

                salary.items.type.append($('<option value="' + v['id'] + '">' + v['name'] + '</option>'));
            });
            salary.items.type.change(function() {

                cleanType([2, 3, 4]);
                $.each(res.twoType, function(i, v) {

                    if (salary.items.type.val() == v['oneType']) {
                        salary.items.salaryOnetype.append($('<option value="' + v['id'] + '">' + v['name'] + '</option>'));
                    }
                });
            });
            salary.items.salaryOnetype.change(function() {

                cleanType([3, 4]);
                $.each(res.thrType, function(i, v) {

                    if (salary.items.salaryOnetype.val() == v['twoType']) {
                        salary.items.salaryTwotype.append($('<option value="' + v['id'] + '">' + v['name'] + '</option>'));
                    }
                });
            });
            salary.items.salaryTwotype.change(function() {

                cleanType([4]);
                $.each(res.forType, function(i, v) {

                    if (salary.items.type.val() == v['oneType'] && salary.items.salaryTwotype.val() == v['thrType']) {
                        salary.items.salaryThrType.append($('<option value="' + v['id'] + '">' + v['name'] + '</option>'));
                    }
                });
            });
        });
    });

    function adoptstatus(sid) {

        var options = {};

        options["salary.sid"] = sid;

        com.post(api.salary.passSalary, options, function() {

            searcher.doSearch();

        });
    }

    function rejectstatus(sid) {

        var options = {};

        options["salary.sid"] = sid;

        com.post(api.salary.rejectSalary, options, function() {

            searcher.doSearch();

        });
    }

    function cancelstatus(sid) {

        var options = {};

        options["salary.sid"] = sid;

        com.post(api.salary.cancelSalary, options, function() {

            searcher.doSearch();
        });
    }

    function cleanType(num) {

        $.each(num, function(i, v) {

            com.focusPage("#type" + v + "").empty();
            com.focusPage("#type" + v + "").append($('<option value="">请选择</option>'));
        });
    }

    function saveData() {

        if (com.validate("salaryModal"))
            return false;

        var options = {
            "salary.user.userId": com.typeahead("salaryuser"),
            "salary.type": salary.items.type.val(),
            "salary.onetype": salary.items.salaryOnetype.val(),
            "salary.twotype": salary.items.salaryTwotype.val(),
            "salary.thrtype": salary.items.salaryThrType.val(),
            "salary.money": salary.items.money.val(),
            "salary.comment": salary.items.salarycomment.val()
        };

        com.post(api.salary.addSalary, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "添加成功");
        });

        salary.modals.salaryModal.modal("hide");
    }
});
