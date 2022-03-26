$(function() {

    var decoration7Achievement = {

        daid: null,
        btns: {
            createBalanceSalesBtn: com.focusPage("#updateDataBtn").on("click", saveData),
        },

        modals: {
            updateDataModal: com.focusPage("#updateDataModal"),

        },

        items: {
            year: com.focusPage("#yearDate"),
            month: com.focusPage("#monthDate"),
        },

        current: "",
    };

    var searcher = new Searcher();

    searcher.base("condList", "decoration7Achievement", "resultList", api.report.queryDecoration7Achievement);

    searcher.condition(["report-year", "report-month"]);

    searcher.button([{
        id: "updateData",
        name: "更新",
        clazz: "btn-primary",
        icon: "icon-refresh"
    }]);

    var lineprops = [{
        field: "index",
        name: "",
        prop: "",
        type: "numbers",
        fixed: "left"
    }, {
        field: "department.no",
        name: "分区编号",
        prop: "department.no",
        clazz: "grey",
        fixed: "left"
    }, {
        field: "department.name",
        name: "分区",
        prop: "department.name",
        clazz: "grey",
        fixed: "left"
    }, {
        field: "date",
        name: "日期",
        prop: function(v) {

            return (v.year + "年" + v.month + "月业绩");
        },
        clazz: "grey"
    }, {
        field: "cs0",
        name: "签单户数",
        prop: "cs0",
        clazz: "grey"
    }, {
        field: "cs1",
        name: "设计户数",
        prop: "cs1",
        clazz: "grey"
    }, {
        field: "cs2",
        name: "工程合同额",
        prop: "cs2",
        clazz: "grey"
    }, {
        field: "cs3",
        name: "工程净业绩",
        prop: "cs3",
        clazz: "grey"
    }, {
        field: "cs4",
        name: "设计费",
        prop: "cs4",
        clazz: "grey"
    }, {
        field: "cs5",
        name: "服务费",
        prop: "cs5",
        clazz: "grey"
    }, {
        field: "total",
        name: "工程总净业绩",
        prop: function(v) {

            return (v.cs3 + v.cs4 + v.cs5);
        },
        clazz: "grey"
    }, ];

    var linebtns = [];

    searcher.table(lineprops, linebtns);

    searcher.render();

    com.datetime(com.focusPage("[name='report-year']"), "year");
    com.datetime(com.focusPage("[name='report-month']"), "month");
    com.datetime(com.focusPage("#yearDate"), "year");
    com.datetime(com.focusPage("#monthDate"), "month");

    com.focusPage("#updateData").click(function() {

        com.focusPage("#yearDate").val();
        com.focusPage("#monthDate").val();
        decoration7Achievement.modals.updateDataModal.modal("show");
    });

    function saveData() {

        if (com.validate('updateDataModal'))
            return false;

        var options = {
            "decorationAchievement.year": decoration7Achievement.items.year.val(),
            "decorationAchievement.month": decoration7Achievement.items.month.val(),
        };

        com.post(api.report.updataDecoration7Achievement, options, function() {

            searcher.doSearch();
            com.showAlert(com.info, "更新成功");
        });
        decoration7Achievement.modals.updateDataModal.modal("hide");
    }

});
