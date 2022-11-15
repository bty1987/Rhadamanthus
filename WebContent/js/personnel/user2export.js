$(function() {

    var output = {
        fields: [{
            "key": "user.userId",
            "value": "编号",
            "type": "belong",
            "check": true
        }, {
            "key": "user.userName",
            "value": "用户名",
            "type": "belong"
        }, {
            "key": "user.currentName",
            "value": "现用名",
            "type": "basic",
            "check": true
        }, {
            "key": "user.pinYin",
            "value": "拼音"
        }, {
            "key": "user.oldUserId",
            "value": "旧员工编号",
            "type": "belong"
        }, {
            "key": "user.identity",
            "value": "身份证号",
            "type": "basic"
        }, {
            "key": "user.phone",
            "value": "手机号",
            "type": "basic",
            "check": true
        }, {
            "key": "user.role.name",
            "value": "角色",
            "type": "belong",
            "check": true
        }, {
            "key": "user.dept.name",
            "value": "部门",
            "type": "belong",
            "check": true
        }, {
            "key": "level",
            "value": "级别",
            "type": "belong"
        }, {
            "key": "user.duty.name",
            "value": "职位",
            "type": "belong",
            "check": true
        }, {
            "key": "user.gender",
            "value": "性别",
            "type": "basic",
            "check": true
        }, {
            "key": "height",
            "value": "身高",
            "type": "basic"
        }, {
            "key": "weight",
            "value": "体重",
            "type": "basic"
        }, {
            "key": "political",
            "value": "政治面貌",
            "type": "basic"
        }, {
            "key": "nation",
            "value": "民族",
            "type": "basic"
        }, {
            "key": "hobby",
            "value": "爱好",
            "type": "basic"
        }, {
            "key": "qq",
            "value": "QQ",
            "type": "basic"
        }, {
            "key": "wechat",
            "value": "微信",
            "type": "basic"
        }, {
            "key": "email",
            "value": "邮箱",
            "type": "basic"
        }, {
            "key": "isMarried",
            "value": "婚姻状况",
            "type": "account"
        }, {
            "key": "isBirth",
            "value": "生育状况",
            "type": "account"
        }, {
            "key": "isHouseLoan",
            "value": "是否有房贷",
            "type": "account"
        }, {
            "key": "isCarLoan",
            "value": "是否有车贷",
            "type": "account"
        }, {
            "key": "isHMID",
            "value": "是否有港澳通行证",
            "type": "account"
        }, {
            "key": "isTWID",
            "value": "是否有台湾通行证",
            "type": "account"
        }, {
            "key": "hometownPlace",
            "value": "户籍地",
            "type": "account"
        }, {
            "key": "hometownAddress",
            "value": "户籍地址",
            "type": "account"
        }, {
            "key": "address",
            "value": "现住地址",
            "type": "account"
        }, {
            "key": "lover",
            "value": "爱人",
            "type": "account"
        }, {
            "key": "claner",
            "value": "直系亲属",
            "type": "account"
        }, {
            "key": "clanerCom",
            "value": "直系亲属公司",
            "type": "account"
        }, {
            "key": "emergencyMan",
            "value": "紧急联系人",
            "type": "account"
        }, {
            "key": "emergencyPhone",
            "value": "紧急联系人电话",
            "type": "account"
        }, {
            "key": "fangliner.currentName",
            "value": "方林家属",
            "type": "account"
        }, {
            "key": "employWay",
            "value": "招聘方式",
            "type": "recruit"
        }, {
            "key": "jobYears",
            "value": "司龄",
            "type": "recruit"
        }, {
            "key": "employTime",
            "value": "招聘时间",
            "type": "recruit"
        }, {
            "key": "serviceYears",
            "value": "服务年限",
            "type": "recruit"
        }, {
            "key": "isPresentGraduate",
            "value": "是否应届",
            "type": "recruit"
        }, {
            "key": "graduateTime",
            "value": "毕业时间",
            "type": "recruit"
        }, {
            "key": "school",
            "value": "毕业学校",
            "type": "recruit"
        }, {
            "key": "education",
            "value": "学历",
            "type": "recruit"
        }, {
            "key": "specialty",
            "value": "专业",
            "type": "recruit"
        }, {
            "key": "isContract",
            "value": "是否签劳动合同",
            "type": "job"
        }, {
            "key": "preformNum",
            "value": "试用期限",
            "type": "other"
        }, {
            "key": "formTime",
            "value": "转正日期",
            "type": "job"
        }, {
            "key": "isInsurance",
            "value": "是否上保险",
            "type": "job"
        }, {
            "key": "insuranceTime",
            "value": "参保时间",
            "type": "job"
        }, {
            "key": "palary",
            "value": "试用工资",
            "type": "other"
        }, {
            "key": "salary",
            "value": "转正工资",
            "type": "other"
        }, {
            "key": "bank",
            "value": "开户行",
            "type": "other"
        }, {
            "key": "bankCardNum",
            "value": "银行卡号",
            "type": "other"
        }, {
            "key": "form",
            "value": "岗位类型",
            "type": "belong"
        }, {
            "key": "householdType",
            "value": "户口类型",
            "type": "account"
        }, {
            "key": "employType",
            "value": "招聘类型",
            "type": "recruit"
        }, {
            "key": "insuranceType",
            "value": "保险类型",
            "type": "job"
        }, {
            "key": "comment",
            "value": "备注",
            "type": "other"
        }],
        conditions: ["personel-userName", "personel-roleId", "personel-deptId", "personel-info-level", "personel-userstatus"],
        btns: {
            outputBtn: com.focusPage("#outputBtn", "#userOutput").click(outputData)
        },
        levels: [],
        politicalTypes: [],
        employWays: [],
        educations: [],
        forms: [],
        householdTypes: [],
        employTypes: [],
        insuranceTypes: []
    };

    com.focusPage("#checkedFields").html("");

    output.levels = constant.personel().userInfo.level.datas.split("key", "value");
    output.politicalTypes = constant.personel().userInfo.political.split("key", "value");
    output.employWays = constant.personel().userInfo.employWay.split("key", "value");
    output.educations = constant.personel().userInfo.education.split("key", "value");
    output.forms = constant.personel().userInfo.form.split("key", "value");
    output.householdTypes = constant.personel().userInfo.householdType.split("key", "value");
    output.employTypes = constant.personel().userInfo.employType.split("key", "value");
    output.insuranceTypes = constant.personel().userInfo.insuranceType.split("key", "value");

    $.each(output.fields, function(i, v) {

        var $button = $('<button></button>').addClass("btn btn-primary").prop("style", "margin:2px;").html(v.value).attr({
            "type": "button",
            "data-toggle": "button",
            "fieldkey": v.key,
            "fieldvalue": v.value
        }).appendTo(com.focusPage("#" + v.type));

        switch (v.type) {
            case "job":
                $button.addClass("btn-success");
                break;
            case "belong":
                $button.addClass("btn-danger");
                break;
            case "recruit":
                $button.addClass("btn-yellow");
                break;
            case "other":
                $button.addClass("btn-info");
                break;
        }

        if (v.check) {
            $button.addClass("active");

            var index = com.focusPage(".badge", "#fields").length;
            $('<span class="badge badge-warning" style="left: 10px;"></span>').text(index + 1).appendTo($button);
            addField(v.key, v.value);
        } else {
            $button.removeClass("active")
        }

        $button.click(function() {

            clickBtn($(this))
        });
    });

    var searcher = new Searcher();

    searcher.init(output.conditions, "conditions", api.personel.pageUserInfo, null, "blankNoDelete", "userOutputPostData", {
        "paging.noPage": 1
    }, true, "", null, true);
    com.focusPage("button", "#conditions").hide();

    function outputData() {

        var totalRecords = 0;

        com.post(api.personel.pageUserInfo, $.extend({
            "paging.rows": 10,
            "paging.page": 0
        }, searcher.param()), function(res) {

            totalRecords = res.paging.totalRecords;
        }, null, false);

        if (parseInt(totalRecords) == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (parseInt(totalRecords) > 1000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        var fields = [];

        var $buttons = com.focusPage('li', "#checkedFields");

        if ($buttons.length == 0) {
            com.showAlert(com.warning, "请选择字段");
            return false;
        }

        $.each($buttons, function(i, v) {

            var _e = $(v);
            fields.push([_e.attr('fieldvalue'), _e.attr('fieldkey')]);
        });

        com.post(api.personel.pageUserInfo, $.extend({
            "paging.noPage": 1
        }, searcher.param()), function(res) {

            $.exceler({
                column: fields,
                list: res.paging.data
            }, function(v) {

                v.level = output.levels[v.level];
                v.political = output.politicalTypes[v.political];
                v.employWay = output.employWays[v.employWay];
                v.education = output.educations[v.education];
                v.form = output.forms[v.form];
                v.householdType = output.householdTypes[v.householdType];
                v.employType = output.employTypes[v.employType];
                v.insuranceType = v.isInsurance == 0 ? output.insuranceTypes[v.insuranceType] : "无";
                v.fangliner = v.fangliner == null ? {
                    "currentName": "无"
                } : v.fangliner;

                v.isMarried = com.checkNull(v.isMarried == 0 ? "已婚" : "未婚", "无");
                v.isBirth = com.checkNull(v.isBirth == 0 ? "已育" : "未育", "无");
                v.isHouseLoan = com.checkNull(v.isHouseLoan == 0 ? "有" : "无", "无");
                v.isCarLoan = com.checkNull(v.isCarLoan == 0 ? "有" : "无", "无");
                v.isHMID = com.checkNull(v.isHMID == 0 ? "有" : "无", "无");
                v.isTWID = com.checkNull(v.isTWID == 0 ? "有" : "无", "无");
                v.isPresentGraduate = com.checkNull(v.isPresentGraduate == 0 ? "是" : "否", "无");
                v.isContract = com.checkNull(v.isContract == 0 ? "是" : "否", "无");
                v.isInsurance = com.checkNull(v.isInsurance == 0 ? "是" : "否", "无");

                v.serviceYears = getDateYearSub(v.entryTime);

            });
        });
    }

    function getDateYearSub(entryTime) {

        var date = new Date();
        var mon = date.getMonth() + 1;
        var day = date.getDate();
        var currDate = date.getFullYear() + "-" + (mon < 10 ? "0" + mon : mon) + "-" + (day < 10 ? "0" + day : day);

        var startDate = Date.parse(entryTime);
        var endDate = Date.parse(currDate);
        var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);

        return (days / 365).toFixed(1);
    }

    function addField(key, value) {

        var $btn = $("<li></li>").addClass("btn btn-primary btn-purple").css({
            "margin": "2px"
        }).attr({
            "fieldkey": key,
            "fieldvalue": value
        }).html(value).appendTo(com.focusPage("#checkedFields"));
        var $a = $("<a></a>").addClass("glyphicon glyphicon-remove").css({
            'color': '#d15b47',
            'margin-left': '10px'
        }).appendTo($btn);
        $a.click(function() {

            $btn.remove();
            clickBtn(com.focusPage("button[fieldvalue=" + value + "]"), true);
        });
    }

    function clickBtn(btn, flag) {

        var that = btn;

        if (that.hasClass("active")) {
            var badge = that.find("span.badge");
            var badges = com.focusPage(".badge", "#fields");

            var index = parseInt(badge.html());

            $.each(badges, function(i, v) {

                var _badge = $(v);
                var _index = parseInt(_badge.html());

                if (_index > index)
                    _badge.html(_index - 1);

            });

            that.find("span.badge").remove();
            flag ? that.removeClass("active") : that.removeAttr("active");
            com.focusPage("li[fieldvalue=" + that.attr("fieldvalue") + "]").remove();
        } else {
            var index = com.focusPage(".badge", "#fields").length;
            $('<span class="badge badge-warning" style="left: 10px;"></span>').text(index + 1).appendTo(that);
            addField(that.attr("fieldkey"), that.attr("fieldvalue"));
        }
    }
});