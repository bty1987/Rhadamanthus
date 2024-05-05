$(function() {

    var salary4common = {

        userId: "",

        salaryStatus: {},
        salaryType: {},
        withholdStatus: {},
        withholdType: {},
        decorationSalaryType: constant.salary().decorationSalary.type.keys,
        decorationSalaryAtttype: constant.salary().decorationSalary.atttype.keys,
        decorationSalaryStage: constant.salary().decorationSalary.stage.keys,
        decorationSalaryStatus: constant.salary().decorationSalary.status.keys,
        salaryStatus: {},
        salaryType: {},
        salaryOneType: {},
        salaryTwoType: {},
        salaryTwotype: {},
    };

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var times = [];

    if (month < 10) {
        var dateTime = year + '-' + '0' + month + '-' + '01';
    }

    for(var i=0;i<6;i++){

        var time = {year: year,month: month};

        if (month - 1 <= 0){
            month = 12;
            year = year - 1;
        } else {
            month = month - 1;
        }

        times.push(time);
    }

    com.focusPage('#fl-statement').statement("薪资", "汇总").show();

    com.post(api.ds.salary, {}, function(data) {

        salary4common.salaryStatus = data.status.split("key", "value");
        salary4common.salaryType = data.type.split("id", "name");
        salary4common.twoType = data.twoType.split("id", "name");

    }, null, false);

    com.post(api.ds.salary, {}, function(res) {

        salary4common.withholdStatus = res.withholdStatus.split("key", "value");
    }, null, false);

    com.post(api.ds.salary, {}, function(res) {

        salary4common.withholdType = res.withholdType.split("key", "value");
    }, null, false);

    com.post(api.ds.salary, {}, function(data) {

        var twotypes = [];

        $.each(data.SalaryTwoType, function(i, v) {

            if (v.status != 0)
                return true;
            twotypes.push(v);
        });

        salary4common.salaryStatus = data.status.split("key", "value");
        salary4common.salaryType = data.type.split("id", "name");
        salary4common.salaryOneType = data.oneType.split("id", "name");
        salary4common.salaryTwoType = data.SalaryTwoType.split("key", "oneType");
        salary4common.salaryTwotype = data.SalaryTwoType.split("key", "name");

    }, null, false);

    function drawuser(userId) {

        var userInfo = {
            user: {
                userId: "",
                currentName: "",
                duty: {
                    name: ""
                },
                phone: ""
            }
        };

        com.post(api.personel.queryUserInfoByUserId, {
            "userInfo.user.userId": userId
        }, function(res) {

            userInfo = res.userInfo;
        }, null, false);

        var $widget = $('<div></div>').addClass("col-xs-6 col-md-3").prependTo(com.focusPage("#userInfo"));
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header header-color-blue").appendTo($box);

        var name = $('<h4></h4>').attr('id', 'h4name_').text("人员").appendTo($header);

        var $body = $('<div></div>').addClass("widget-body").appendTo($box);
        var $main = $('<div></div>').addClass("widget-main").appendTo($body);
        var $info = $('<div></div>').css("padding", "5px").appendTo($main);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('编号: ' + userInfo.user.userId)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('姓名: ' + userInfo.user.currentName)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('职位: ' + userInfo.user.duty.name)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('电话: ' + userInfo.user.phone)).appendTo($info);
    }

    function drawsalary() {

        var $widget = $('<div></div>').addClass("col-xs-6 col-md-3").prependTo(com.focusPage("#userInfo"));
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header header-color-orange").appendTo($box);

        var name = $('<h4></h4>').attr('id', 'h4name_').text("薪资").appendTo($header);

        var $body = $('<div></div>').addClass("widget-body").appendTo($box);
        var $main = $('<div></div>').addClass("widget-main").appendTo($body);
        var $info = $('<div></div>').css("padding", "5px").appendTo($main);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('基础总额: ' + "0")).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('扣款总额: ' + "0")).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('设计提成: ' + "0")).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('主材提成: ' + "0")).appendTo($info);
    }

    function drawdateBtn() {

        $.each(times, function(i, v) {

            var aTag = $('<a href="#" id="add" class="btn btn-default btn-app btn-sm radius-4" style="padding: 5px 0;"></a>').appendTo(com.focusPage("#dateBtn"));
            var iTag = $('<i class="icon-plus-sign bigger-230"></i>').appendTo(aTag);
            var spanborder = $('<span></span>').html(v.year + '-' + v.month).appendTo(aTag);

            var datetime = null;

            if (v.month < 10) {
                datetime = v.year + '-' + '0' + v.month + '-' + '01';
            } else {
                datetime = v.year + '-' + v.month + '-' + '01';
            }

            aTag.click(function () {

                searcher.param({
                    "salary.user.userId": salary4common.userId,
                    "salary.createTime": datetime
                });

                searcher1.param({
                    "withhold.user.userId": salary4common.userId,
                    "withhold.createTime": datetime
                });

                searcher2.param({
                    "decorationSalary.belonger.userId": salary4common.userId,
                    "decorationSalary.createTime": datetime
                });

                searcher3.param({
                    "materialSalary.belonger.userId": salary4common.userId,
                    "materialSalary.createTime": datetime
                });

                searcher4.param({
                    "workerSalary.user.userId": salary4common.userId,
                    "workerSalary.createTime": datetime
                });

                searcher.doSearch();
                searcher1.doSearch();
                searcher2.doSearch();
                searcher3.doSearch();
                searcher4.doSearch();
            });
        });
    }

    salary4common.userId = params.userInfo.user.userId;

    if (params.salary.belonger && params.salary.belonger.userId) {
        salary4common.userId = params.salary.belonger.userId;
    }

    drawsalary();
    drawuser(salary4common.userId);
    drawdateBtn();

    var searcher = new Searcher();

    searcher.base("condList0", "pagenation0", "resultList0", api.salary.pageSalary);
    searcher.history("salaryCommonPostData");
    searcher.param({
        "salary.user.userId": salary4common.userId,
        "salary.createTime": dateTime
    });

    var lineprops = [{
        field: "type",
        name: "类型",
        prop: "type",
        dataset: salary4common.salaryType,
        clazz: "red"
    }, {
        field: "money",
        name: "金额",
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
        dataset: salary4common.salaryStatus,
        clazz: "red"
    }, {
        field: "operateTime",
        name: "操作时间",
        prop: "operateTime",
        clazz: "green"
    }, {
        field: "comment",
        name: "说明",
        prop: "comment",
        clazz: "grey"
    }];

    searcher.line(function(v) {

        return (v.comment == null ? "" : v.comment) + " " + salary4common.twoType[v.twotype] + " " + v.money;
    }, lineprops, []).render();

    var searcher1 = new Searcher();

    searcher1.base("condList1", "pagenation1", "resultList1", api.salary.pageWithhold);
    searcher1.history("withholdCommonPostData");
    searcher1.param({
        "withhold.user.userId": salary4common.userId,
        "withhold.createTime": dateTime
    });

    var lineprops1 = [{
        field: "type",
        name: "类型",
        prop: "type",
        dataset: salary4common.withholdType,
        clazz: "red"
    }, {
        field: "money",
        name: "金额",
        prop: "money",
        clazz: "blue"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "grey"
    }, {
        field: "operateTime",
        name: "操作时间",
        prop: "operateTime",
        clazz: "green"
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        dataset: salary4common.withholdStatus,
        clazz: "red"
    }, {
        field: "comment",
        name: "说明",
        prop: "comment",
        clazz: "grey"
    }];

    searcher1.line(function(v) {

        return (v.comment == null ? "" : v.comment) + " " + v.money;
    }, lineprops1, []).render();

    var searcher2 = new Searcher();

    searcher2.base("condList2", "pagenation2", "resultList2", api.salary.pageDecorationSalary);
    searcher2.condition(["salary-decoraitonSalary-orderId"]);
    searcher2.history("decorationSalaryCommonPostData");
    searcher2.param({
        "decorationSalary.belonger.userId": salary4common.userId,
        "decorationSalary.createTime": dateTime
    });

    var lineprops2 = [{
        field: "orderId",
        name: "装修单号",
        prop: "decoration.orderId",
        clazz: "blue",
    }, {
        field: "village.name",
        name: "楼盘",
        prop: "decoration.house.village.name",
        clazz: "grey"
    }, {
        field: "house.houseNumber",
        name: "楼盘",
        prop: "decoration.house.houseNumber",
        clazz: "grey"
    }, {
        field: "typeness",
        name: "类型",
        prop: "decoration.typeness",
        dataset: constant.decoration().decoration.typeness.keys,
        clazz: "red"
    }, {
        field: "status",
        name: "状态",
        prop: "decoration.status",
        dataset: constant.decoration().decoration.status.keys,
        clazz: "red"
    }, {
        field: "contractPrice",
        name: "签单额",
        prop: "decoration.orderTotalPrice",
        clazz: "blue"
    }, {
        field: "factPrice",
        name: "实收额",
        prop: "decoration.factPrice",
        clazz: "blue"
    }, {
        field: "couponCut",
        name: "券优惠",
        prop: "decoration.couponCut",
        clazz: "blue"
    }, {
        field: "thingCut",
        name: "物品优惠",
        prop: "decoration.thingCut",
        clazz: "blue"
    }, {
        type: "newline"
    }, {
        field: "money",
        name: "金额",
        prop: "money",
        clazz: "blue",
    }, {
        field: "rate",
        name: "比例",
        prop: "rate",
        clazz: "blue",
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        dataset: constant.salary().decorationSalary.type.keys,
        clazz: "red",
    }, {
        field: "atttype",
        name: "业务类型",
        prop: "atttype",
        dataset: constant.salary().decorationSalary.atttype.keys,
        clazz: "red",
    }, {
        field: "stage",
        name: "阶段",
        prop: "stage",
        dataset: constant.salary().decorationSalary.stage.keys,
        clazz: "red"
    }, {
        field: "level",
        name: "等级",
        prop: "level",
        clazz: "red",
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green",
    }, {
        field: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey",
    }];

    searcher2.line(function(v) {

        return constant.salary().decorationSalary.atttype.keys[v.atttype] + " " + constant.salary().decorationSalary.stage.keys[v.stage] + " " + v.money;
    }, lineprops2, []).render();

    var searcher3 = new Searcher();

    searcher3.base("condList3", "pagenation3", "resultList3", api.salary.pageMaterialSalary);
    searcher3.condition(["salary-materialSalary-orderId", "salary-materialSalary-sales-no", ]);
    searcher3.history("materialSalaryCommonPostData");
    searcher3.param({
        "materialSalary.belonger.userId": salary4common.userId,
        "materialSalary.createTime": dateTime
    });

    var lineprops3 = [{
        field: "orderId",
        name: "装修单号",
        prop: "decoration.orderId",
        clazz: "blue"
    }, {
        field: "sales.no",
        name: "销售单号",
        prop: "sales.no",
        clazz: "blue"
    }, {
        field: "village.name",
        name: "楼盘",
        prop: "decoration.house.village.name",
        clazz: "grey"
    }, {
        field: "house.houseNumber",
        name: "楼盘",
        prop: "decoration.house.houseNumber",
        clazz: "grey"
    }, {
        field: "category",
        name: "品类",
        prop: "sales.category",
        clazz: "grey"
    }, {
        field: "brand",
        name: "品牌",
        prop: "sales.brand",
        clazz: "grey"
    }, {
        type: "newline"
    }, {
        field: "period",
        name: "账期",
        prop: "period",
        clazz: "grey"
    }, {
        field: "money",
        name: "金额 ",
        prop: "money",
        clazz: "blue"
    }, {
        field: "rate",
        name: "比例 ",
        prop: "rate",
        clazz: "blue"
    }, {
        field: "stage",
        name: "阶段",
        prop: "stage",
        clazz: "red",
        dataset: constant.salary().materialSalary.stage.keys,
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey"
    }, ];

    searcher3.line(function(v) {

        return constant.salary().materialSalary.stage.keys[v.stage] + " " + v.money;
    }, lineprops3, []).render();

    var searcher4 = new Searcher();

    searcher4.base("condList4", "pagenation4", "resultList4", api.salary.pageWorkerSalary);
    searcher4.history("workerSalaryCommonPostData");
    searcher4.param({
        "workerSalary.user.userId": salary4common.userId,
        "workerSalary.createTime": dateTime
    });

    var lineprops4 = [{
        field: "orderId",
        name: "装修单号",
        prop: "decoration.orderId",
        clazz: "grey"
    }, {
        field: "village",
        name: "楼盘",
        prop: "decoration.house.village.name",
        clazz: "grey"
    }, {
        field: "houseNumber",
        name: "楼号",
        prop: "decoration.house.houseNumber",
        clazz: "grey"
    }, {
        field: "supervisor",
        name: "监理",
        prop: "decoration.supervisor.userName",
        clazz: "grey"
    }, {
        field: "schedule",
        name: "施工节点",
        prop: "cnid",
        dataset: constant.decoration().decoration.projectStatus.keys,
        clazz: "red"
    }, {
        field: "twotype",
        name: "类型",
        prop: "twotype",
        dataset: salary4common.salaryTwotype,
        clazz: "red"
    }, {
        field: "money",
        name: "操作金额",
        prop: function(v) {

            return v.type == 0 ? v.money : -v.money;
        },
        clazz: "blue"
    }, {
        field: "salary",
        name: "工费",
        prop: function(v) {

            return v.type == 0 ? v.salary : -v.salary;
        },
        clazz: "blue"
    }, {
        field: "deposit",
        name: "质保金",
        prop: function(v) {

            return v.type == 0 ? v.deposit : -v.deposit;
        },
        clazz: "blue"
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        dataset: salary4common.salaryStatus,
        clazz: "red"
    }, ];

    searcher4.line(function(v) {

        return salary4common.salaryTwotype[v.twotype] + " " + v.money;
    }, lineprops4, []).render();

});
