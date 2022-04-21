$(function() {

    api = parent.api;
    com = parent.com;
    utils = parent.utils;
    params = parent.params;
    printer = parent.printer;

    var userInfo = {};
    var user = {};
    var politicalType = {};
    var householdType = {};
    var educationType = {};
    var employWay = {};

    var trList = $("#reslist");
    var tabody = $('<tbody> </tbody>');

    com.post(api.ds.personel, {
        timestamp: (new Date).getTime()
    }, function(a) {

        politicalType = a.politicalType;
        householdType = a.householdType;
        educationType = a.educationType;
        employWay = a.employWay;

    }, null, false);

    com.post(api.personel.queryUserInfoByUserId, {
        "userInfo.user.userId": params.personel.userId
    }, function(res) {

        userInfo = res.userInfo;
        user = userInfo.user;
    }, null, false);

    // 教育经历
    com.post(api.personel.queryUserEducation, {
        "userEducation.uid": params.personel.uid
    }, function(data) {

        if (data.userEducations.length != 0) {
            createPreLineEd(data.userEducations);
        }
    }, function(e) {

        com.showAlert(com.error, e.errorMsg);
    }, false);

    // 工作经历
    com.post(api.personel.queryUserOperation, {
        "userOperation.uid": params.personel.uid
    }, function(data) {

        if (data.userOperations.length != 0) {
            createPreLineOp(data.userOperations);
        }
    }, function(e) {

        com.showAlert(com.error, e.errorMsg);
    }, false);

    var table = createPreHeader().appendTo(trList);

    tabody.appendTo(table);
    createPreFooter();

    function createPreHeader() {

        var div = $('<div align="center" class="col-xs-12"></div>');
        var table = $('<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;table-layout:fixed;width:100%;">').appendTo(div);
        var caption = $('<caption style="line-height: 65px;font-size:20px;border: 1px solid">方林装饰应聘登记表</caption>').appendTo(table);

        var tr1 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td1 = $('<td colspan="12" style="border: 1px none;border-right:1px solid;border-left:1px solid;"></td>').text("承诺书").appendTo(tr1);

        var tr2 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td2 = $('<td colspan="12" align="left" style="border: 1px none;border-right:1px solid;border-left:1px solid;"></td>').text("1、我在本应聘申请表内所填写的各项内容均属事实，" + "保证没有与事实不符的欺骗行为。如因上述行为所造成的一切法律责任和经济损失均由我本人承担。如有不一致的情况，视为不符合本单位的录用条件，本单位予以解除劳动关系。").appendTo(tr2);

        var tr3 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td3 = $('<td colspan="12" align="left" style="border: 1px none;border-right:1px solid;border-left:1px solid;"></td>').text("2、承诺主动协助公司办理保险关系新建或转移等相关" + "入职所需手续并提供所需材料。如非公司原因导致保险关系无法正常办理所产生的后果由本人承担，与公司无关。").appendTo(tr3);

        var tr4 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td4 = $('<td colspan="9" align="left" style="border: 1px solid;border-top:1px none;border-right:1px none;"></td>').text("3、我同意接受公司对我所填写的各项经历进行背景调" + "查。").appendTo(tr4);
        var td5 = $('<td colspan="3" align="left" style="border: 1px solid;border-top:1px none;border-left:1px none;"></td>').text("承诺人签字：").appendTo(tr4);

        var tr5 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td6 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text("姓 名").appendTo(tr5);
        var td7 = $('<td style="border: 1px solid;border-top:1px none;"></td>').text(com.checkNull(userInfo.user.userName, "无")).appendTo(tr5);
        var td8 = $('<td style="border: 1px solid;border-top:1px none;"></td>').text("性别").appendTo(tr5);
        var td9 = $('<td style="border: 1px solid;border-top:1px none;"></td>').text(com.checkNull(userInfo.user.gender, "无")).appendTo(tr5);
        var td10 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text("出生日期").appendTo(tr5);
        var td11 = $('<td style="border: 1px solid;border-top:1px none;"></td>').text(getBirthday(userInfo.user.identity)).appendTo(tr5);
        var td12 = $('<td style="border: 1px solid;border-top:1px none;"></td>').text("身高").appendTo(tr5);
        var td13 = $('<td style="border: 1px solid;border-top:1px none;"></td>').text(com.checkNull(userInfo.height, "无")).appendTo(tr5);
        var td14 = $('<td colspan="2" rowspan="6" style="border: 1px solid;border-top:1px none;"></td>').text("照片").appendTo(tr5);

        var tr6 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td15 = $('<td colspan="2" style="border: 1px solid;"></td>').text("现用名").appendTo(tr6);
        var td16 = $('<td style="border: 1px solid;"></td>').text(com.checkNull(userInfo.user.currentName, "无")).appendTo(tr6);
        var td17 = $('<td style="border: 1px solid;"></td>').text("民族").appendTo(tr6);

        var td18 = $('<td style="border: 1px solid;"></td>').text(com.checkNull(userInfo.nation, "无")).appendTo(tr6);
        var td19 = $('<td colspan="2" style="border: 1px solid;"></td>').text("最高学历").appendTo(tr6);
        var td20 = $('<td style="border: 1px solid;"></td>').text(com.checkNull(educationType[userInfo.education].value, "无")).appendTo(tr6);
        var td21 = $('<td style="border: 1px solid;"></td>').text("体重").appendTo(tr6);
        var td22 = $('<td style="border: 1px solid;"></td>').text(com.checkNull(userInfo.weight, "无")).appendTo(tr6);

        var tr7 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td22 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text("微信号码").appendTo(tr7);
        var td23 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text(com.checkNull(userInfo.wechat, "无")).appendTo(tr7);
        var td24 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text("QQ号码").appendTo(tr7);
        var td25 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text(com.checkNull(userInfo.qq, "无")).appendTo(tr7);

        var tr8 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td26 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text("政治面貌").appendTo(tr8);
        var td27 = $('<td style="border: 1px solid;border-top:1px none;"></td>').text(com.checkNull(politicalType[userInfo.political].value, "无")).appendTo(tr8);
        var td28 = $('<td style="border: 1px solid;border-top:1px none;"></td>').text("年龄").appendTo(tr8);
        var td29 = $('<td style="border: 1px solid;border-top:1px none;"></td>').text(calaAge(getBirthday(userInfo.user.identity))).appendTo(tr8);
        var td30 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text("户籍所在地").appendTo(tr8);
        var td31 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text(com.checkNull(userInfo.hometownPlace, "无")).appendTo(tr8);

        var tr9 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td32 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text("专 业").appendTo(tr9);
        var td33 = $('<td style="border: 1px solid;border-top:1px none;"></td>').text(com.checkNull(userInfo.specialty, "无")).appendTo(tr9);
        var td34 = $('<td style="border: 1px solid;border-top:1px none;"></td>').text("婚否").appendTo(tr9);
        var td35 = $('<td style="border: 1px solid;border-top:1px none;"></td>').text(com.checkNull(userInfo.isMarried == 0 ? "已婚" : "未婚", "无")).appendTo(tr9);
        var td36 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text("现住址").appendTo(tr9);
        var td37 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text(com.checkNull(userInfo.address, "无")).appendTo(tr9);

        var tr10 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td38 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text("籍 贯").appendTo(tr10);
        var td39 = $('<td style="border: 1px solid;border-top:1px none;"></td>').text(com.checkNull(userInfo.hometownPlace, "无")).appendTo(tr10);
        var td40 = $('<td style="border: 1px solid;border-top:1px none;"></td>').text("育否").appendTo(tr10);
        var td41 = $('<td style="border: 1px solid;border-top:1px none;"></td>').text(com.checkNull(userInfo.isBirth == 0 ? "已育" : "未育", "无")).appendTo(tr10);
        var td42 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text("身份证号").appendTo(tr10);
        var td43 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text(userInfo.user.identity).appendTo(tr10);

        var tr11 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td44 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text("联系电话").appendTo(tr11);
        var td45 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text(userInfo.user.phone).appendTo(tr11);
        var td46 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text("紧急联系人电话").appendTo(tr11);
        var td47 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text(com.checkNull(userInfo.emergencyPhone, "无")).appendTo(tr11);
        var td48 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text("与本人关系").appendTo(tr11);
        var td49 = $('<td style="border: 1px solid;border-top:1px none;"></td>').text("").appendTo(tr11);

        var tr12 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(table);
        var td50 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text("户口类型").appendTo(tr12);
        var td51 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text(com.checkNull(householdType[userInfo.householdType].value)).appendTo(tr12);
        var td52 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text("应聘方式").appendTo(tr12);
        var td53 = $('<td colspan="5" style="border: 1px solid;border-top:1px none;"></td>').text(com.checkNull(employWay[userInfo.employWay].value, "无")).appendTo(tr12);

        return table;
    }

    function createPreLineEd(items) {

        var tr13 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(tabody);
        var td54 = $('<td colspan="12" bgcolor="#D9D9D9" style="border: 1px solid;border-top:1px none;"></td>').text("教育背景").appendTo(tr13);

        var tr14 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(tabody);
        var td55 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text("起止时间").appendTo(tr14);
        var td56 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("培训内容").appendTo(tr14);
        var td57 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("学校名称").appendTo(tr14);
        var td58 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text("专业").appendTo(tr14);
        var td59 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text("取得证书").appendTo(tr14);

        $.each(items, function(i, v) {

            var tr15 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(tabody);
            var td60 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text(v.beginTime + "-" + v.endTime).appendTo(tr15);
            var td61 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text(v.content).appendTo(tr15);
            var td62 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text(v.organ).appendTo(tr15);
            var td63 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text(v.specialty).appendTo(tr15);
            var td64 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text(v.certificate).appendTo(tr15);

        });
    }

    function createPreLineOp(items) {

        var tr16 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(tabody);
        var td65 = $('<td colspan="12" bgcolor="#D9D9D9" style="border: 1px solid;border-top:1px none;"></td>').text("工作经历（所有工作经历必须填写完整）").appendTo(tr16);

        var tr17 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(tabody);
        var td66 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text("起止时间").appendTo(tr17);
        var td67 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text("单位名称").appendTo(tr17);
        var td68 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text("所属行业").appendTo(tr17);
        var td69 = $('<td style="border: 1px solid;border-top:1px none;"></td>').text("职务").appendTo(tr17);
        var td70 = $('<td style="border: 1px solid;border-top:1px none;"></td>').text("薪金").appendTo(tr17);
        var td71 = $('<td colspan="4" style="border: 1px solid;border-top:1px none;"></td>').text("离职原因").appendTo(tr17);

        $.each(items, function(i, v) {

            var tr18 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(tabody);
            var td72 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text(v.beginTime + "-" + v.endTime).appendTo(tr18);
            var td73 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text(v.company).appendTo(tr18);
            var td74 = $('<td colspan="2" style="border: 1px solid;border-top:1px none;"></td>').text(v.trade).appendTo(tr18);
            var td75 = $('<td style="border: 1px solid;border-top:1px none;"></td>').text(v.duty).appendTo(tr18);
            var td76 = $('<td style="border: 1px solid;border-top:1px none;"></td>').text(v.salary).appendTo(tr18);
            var td77 = $('<td colspan="4" style="border: 1px solid;border-top:1px none;"></td>').text(v.comment).appendTo(tr18);

        });
    }

    function createPreFooter() {

        var tr19 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(tabody);
        var td78 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("是否有驾照").appendTo(tr19);
        var td79 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text(com.checkNull(userInfo.isCarID == 0 ? "有" : "无", "无")).appendTo(tr19);
        var td80 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("是否有护照").appendTo(tr19);
        var td81 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text(com.checkNull(userInfo.isPassID == 0 ? "有" : "无", "无")).appendTo(tr19);

        var tr20 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(tabody);
        var td82 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("是否与原单位签订劳动合同").appendTo(tr20);
        var td83 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text(com.checkNull(userInfo.isContract == 0 ? "是" : "否", "无")).appendTo(tr20);
        var td84 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("是否已缴纳社会保险").appendTo(tr20);
        var td85 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text(com.checkNull(userInfo.insuranceTypeCheck == 0 ? "是" : "否", "无")).appendTo(tr20);

        var tr21 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(tabody);
        var td86 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("是否已经与其它单位解除了劳动关系").appendTo(tr21);
        var td87 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("").appendTo(tr21);
        var td88 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("是否缴纳其他商业保险").appendTo(tr21);
        var td89 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("").appendTo(tr21);

        var tr22 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(tabody);
        var td90 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("是否有住房贷款").appendTo(tr22);
        var td91 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text(com.checkNull(userInfo.isHouseLoan == 0 ? "有" : "无", "无")).appendTo(tr22);
        var td92 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("是否有车贷").appendTo(tr22);
        var td93 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text(com.checkNull(userInfo.isCarLoan == 0 ? "有" : "无", "无")).appendTo(tr22);

        var tr23 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(tabody);
        var td94 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("是否有港澳通行证").appendTo(tr23);
        var td95 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text(com.checkNull(userInfo.isHMID == 0 ? "有" : "无", "无")).appendTo(tr23);
        var td96 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("是否有台湾通行证").appendTo(tr23);
        var td97 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text(com.checkNull(userInfo.isTWID == 0 ? "有" : "无", "无")).appendTo(tr23);

        var tr24 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(tabody);
        var td98 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("是否有独立住房").appendTo(tr24);
        var td99 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("").appendTo(tr24);
        var td100 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("是否有独立车辆").appendTo(tr24);
        var td101 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("").appendTo(tr24);

        var tr25 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(tabody);
        var td102 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("现在是否还在竟业限制期内").appendTo(tr25);
        var td103 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("").appendTo(tr25);
        var td104 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("公司提供培训机会时，是否同意并签订协议").appendTo(tr25);
        var td105 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("").appendTo(tr25);

        var tr26 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(tabody);
        var td106 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("是否曾有前科劣迹、行政/邢事拘留等经历").appendTo(tr26);
        var td107 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("").appendTo(tr26);
        var td108 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("是否患有精神系统疾病、传染性疾病、家族遗传病史、既往重病史").appendTo(tr26);
        var td109 = $('<td colspan="3" style="border: 1px solid;border-top:1px none;"></td>').text("").appendTo(tr26);

        var tr27 = $('<tr style="border: 1px none;height: 25px;text-align: center;"></tr>').appendTo(tabody);
        var td110 = $('<td colspan="12" style="border: 1px solid;border-top:1px none;"></td>').text("以上内容在办理入职时填写完整").appendTo(tr27);

    }

    function getBirthday(idCard) {

        var birthday = "";
        if (idCard != null && idCard != "") {
            birthday = idCard.substr(6, 8);
            birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
        }
        return birthday;
    }

    function calaAge(birth) {

        var birthday = new Date(birth.replace(/-/g, "\/"));
        var d = new Date();
        var age = d.getFullYear() - birthday.getFullYear() - ((d.getMonth() < birthday.getMonth() || d.getMonth() == birthday.getMonth() && d.getDate() < birthday.getDate()) ? 1 : 0);
        return age;
    }

});
