$(function() {

    var selectRecruitment = {
        employWay: {},
        householdType: {},
        political: {},
        education: {},
    };

    com.post(api.personel.queryRecruitmentByRid, {
        "recruitment.rid": params.rid
    }, function(res) {

        var $recruitment = res.recruitment;

        com.focusPage("#name", "#recruitmentFrom").html(com.checkNull($recruitment.name, "无"));
        com.focusPage("#identity", "#recruitmentFrom").html(com.checkNull($recruitment.identity, "无"));
        com.focusPage("#nation", "#recruitmentFrom").html(com.checkNull($recruitment.nation, "无"));
        com.focusPage("#weight", "#recruitmentFrom").html(com.checkNull($recruitment.weight, "无"));
        com.focusPage("#height", "#recruitmentFrom").html(com.checkNull($recruitment.height, "无"));
        com.focusPage("#employWay", "#recruitmentFrom").html(com.checkNull(constant.personel.recruitment.employWay.datas[$recruitment.employWay].value, "无"));
        com.focusPage("#householdType", "#recruitmentFrom").html(com.checkNull(constant.personel.userInfo.householdType.datas[$recruitment.householdType].value, "无"));
        com.focusPage("#political", "#recruitmentFrom").html(com.checkNull(constant.personel.recruitment.political.datas[$recruitment.political].value, "无"));
        com.focusPage("#education", "#recruitmentFrom").html(com.checkNull(constant.personel.recruitment.education.datas[$recruitment.education].value, "无"));
        com.focusPage("#phone", "#recruitmentFrom").html(com.checkNull($recruitment.phone, "无"));
        com.focusPage("#wechat", "#recruitmentFrom").html(com.checkNull($recruitment.wechat, "无"));
        com.focusPage("#qq", "#recruitmentFrom").html(com.checkNull($recruitment.qq, "无"));
        com.focusPage("#address", "#recruitmentFrom").html(com.checkNull($recruitment.address, "无"));
        com.focusPage("#nativePlace", "#recruitmentFrom").html(com.checkNull($recruitment.nativePlace, "无"));
        com.focusPage("#hometownPlace", "#recruitmentFrom").html(com.checkNull($recruitment.hometownPlace, "无"));
        com.focusPage("#specialty", "#recruitmentFrom").html(com.checkNull($recruitment.specialty, "无"));
        com.focusPage("#emergencyMan", "#recruitmentFrom").html(com.checkNull($recruitment.emergencyMan, "无"));
        com.focusPage("#emergencyPhone", "#recruitmentFrom").html(com.checkNull($recruitment.emergencyPhone, "无"));
        com.focusPage("#isMarried", "#recruitmentFrom").html(com.checkNull($recruitment.isMarried == 0 ? "已婚" : "未婚", "无"));
        com.focusPage("#isBirth", "#recruitmentFrom").html(com.checkNull($recruitment.isBirth == 0 ? "已育" : "未育", "无"));
        com.focusPage("#isHouse", "#recruitmentFrom").html(com.checkNull($recruitment.isHouse == 0 ? "有" : "无", "无"));
        com.focusPage("#isCar", "#recruitmentFrom").html(com.checkNull($recruitment.isCar == 0 ? "有" : "无", "无"));
        com.focusPage("#isHouseLoan", "#recruitmentFrom").html(com.checkNull($recruitment.isHouseLoan == 0 ? "有" : "无", "无"));
        com.focusPage("#isCarLoan", "#recruitmentFrom").html(com.checkNull($recruitment.isCarLoan == 0 ? "有" : "无", "无"));
        com.focusPage("#isCarID", "#recruitmentFrom").html(com.checkNull($recruitment.isCarID == 0 ? "有" : "无", "无"));
        com.focusPage("#isPassID", "#recruitmentFrom").html(com.checkNull($recruitment.isPassID == 0 ? "有" : "无", "无"));
        com.focusPage("#isHMID", "#recruitmentFrom").html(com.checkNull($recruitment.isHMID == 0 ? "有" : "无", "无"));
        com.focusPage("#isTWID", "#recruitmentFrom").html(com.checkNull($recruitment.isTWID == 0 ? "有" : "无", "无"));
        com.focusPage("#isContract", "#recruitmentFrom").html(com.checkNull($recruitment.isContract == 0 ? "有" : "否", "无"));
        com.focusPage("#isSnsurance", "#recruitmentFrom").html(com.checkNull($recruitment.isSnsurance == 0 ? "有" : "否", "无"));
        com.focusPage("#isFire", "#recruitmentFrom").html(com.checkNull($recruitment.isFire == 0 ? "有" : "否", "无"));
        com.focusPage("#isCnsurance", "#recruitmentFrom").html(com.checkNull($recruitment.isCnsurance == 0 ? "有" : "否", "无"));
        com.focusPage("#isCompete", "#recruitmentFrom").html(com.checkNull($recruitment.isCompete == 0 ? "有" : "否", "无"));
        com.focusPage("#isTrain", "#recruitmentFrom").html(com.checkNull($recruitment.isTrain == 0 ? "有" : "否", "无"));
        com.focusPage("#isCriminal", "#recruitmentFrom").html(com.checkNull($recruitment.isCriminal == 0 ? "有" : "否", "无"));
        com.focusPage("#isDisease", "#recruitmentFrom").html(com.checkNull($recruitment.isDisease == 0 ? "有" : "否", "无"));

    });

});