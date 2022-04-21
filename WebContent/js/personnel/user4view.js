$(function() {

    var userView = {
        statusType: {},
        politicalType: {},
        householdType: {},
        educationType: {},
        userLevel: {},
        employWay: {},
        insuranceType: {},
        isExpert: params.personel.isExpert
    };

    com.post(api.ds.personel, {
        timestamp: (new Date).getTime()
    }, function(a) {

        userView.statusType = a.statusType;
        userView.politicalType = a.politicalType;
        userView.householdType = a.householdType;
        userView.educationType = a.educationType;
        userView.userLevel = a.userLevel;
        userView.employWay = a.employWay;
        userView.insuranceType = a.insuranceType;
    }, null, false);

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

    com.post(api.personel.queryUserInfoByUserId, {
        "userInfo.user.userId": params.personel.userId
    }, function(res) {

        var $userInfo = res.userInfo;

        com.focusPage("#userIdCheck").html(com.checkNull($userInfo.user.userId, "无"));
        com.focusPage("#oldUserIdCheck").html(com.checkNull($userInfo.user.oldUserId, "无"));
        com.focusPage("#userNameCheck").html(com.checkNull($userInfo.user.userName, "无"));
        com.focusPage("#currentNameCheck").html(com.checkNull($userInfo.user.currentName, "无"));
        com.focusPage("#genderCheck").html(com.checkNull($userInfo.user.gender, "无"));
        com.focusPage("#heightCheck").html(com.checkNull($userInfo.height, "无"));
        com.focusPage("#weightCheck").html(com.checkNull($userInfo.weight, "无"));
        com.focusPage("#nationCheck").html(com.checkNull($userInfo.nation, "无"));
        com.focusPage("#qqCheck").html(com.checkNull($userInfo.qq, "无"));
        com.focusPage("#weChatCheck").html(com.checkNull($userInfo.wechat, "无"));
        com.focusPage("#emailCheck").html(com.checkNull($userInfo.email, "无"));
        com.focusPage("#clanerCheck").html(com.checkNull($userInfo.claner, "无"));
        com.focusPage("#clanerComCheck").html(com.checkNull($userInfo.clanerCom, "无"));
        com.focusPage("#ageCheck").html(calaAge(getBirthday($userInfo.user.identity)));
        com.focusPage("#birthdayCheck").html(getBirthday($userInfo.user.identity));
        com.focusPage("#politicalSelCheck").html(com.checkNull(userView.politicalType[$userInfo.political].value, "无"));
        com.focusPage("#jobYearsCheck").html(com.checkNull($userInfo.jobYears, "无"));
        com.focusPage("#identityCheck").html($userInfo.user.identity);
        com.focusPage("#phoneCheck").html($userInfo.user.phone);
        com.focusPage("#addressCheck").html(com.checkNull($userInfo.address, "无"));
        com.focusPage("#hometownAddressCheck").html(com.checkNull($userInfo.hometownAddress, "无"));
        com.focusPage("#householdSelCheck").html(com.checkNull(userView.householdType[$userInfo.householdType].value, "无"));
        com.focusPage("#emergencyManCheck").html(com.checkNull($userInfo.emergencyMan, "无"));
        com.focusPage("#hobbyCheck").html(com.checkNull($userInfo.hobby, "无"));
        com.focusPage("#commentCheck").html(com.checkNull($userInfo.comment, "无"));

        com.focusPage("#emergencyPhoneCheck").html(com.checkNull($userInfo.emergencyPhone, "无"));
        com.focusPage("#fanglinerCheck").html($userInfo.fangliner == null ? "无" : $userInfo.fangliner.currentName + "-" + $userInfo.fangliner.dept.name);
        com.focusPage("#isPresentGraduateCheck").html(com.checkNull($userInfo.isPresentGraduate == 0 ? "是" : "否", "无"));
        com.focusPage("#graduateTimeCheck").html(com.checkNull($userInfo.graduateTime, "无"));
        com.focusPage("#schoolCheck").html(com.checkNull($userInfo.school, "无"));
        com.focusPage("#educationSelCheck").html(com.checkNull(userView.educationType[$userInfo.education].value, "无"));
        com.focusPage("#specialtyCheck").html(com.checkNull($userInfo.specialty, "无"));
        com.focusPage("#isMarriedCheck").html(com.checkNull($userInfo.isMarried == 0 ? "已婚" : "未婚", "无"));
        com.focusPage("#isBirthCheck").html(com.checkNull($userInfo.isBirth == 0 ? "已育" : "未育", "无"));
        com.focusPage("#isHouseLoanCheck").html(com.checkNull($userInfo.isHouseLoan == 0 ? "有" : "无", "无"));
        com.focusPage("#isCarLoanCheck").html(com.checkNull($userInfo.isCarLoan == 0 ? "有" : "无", "无"));
        com.focusPage("#isCarIDCheck").html(com.checkNull($userInfo.isCarID == 0 ? "有" : "无", "无"));
        com.focusPage("#isPassIDCheck").html(com.checkNull($userInfo.isPassID == 0 ? "有" : "无", "无"));
        com.focusPage("#isHMIDCheck").html(com.checkNull($userInfo.isHMID == 0 ? "有" : "无", "无"));
        com.focusPage("#isTWIDCheck").html(com.checkNull($userInfo.isTWID == 0 ? "有" : "无", "无"));

        com.focusPage("#loverCheck").html(com.checkNull($userInfo.lover, "无"));
        com.focusPage("#loginIdCheck").html($userInfo.user.loginId);
        com.focusPage("#companyCheck").html(com.checkNull($userInfo.user.companys, "无"));
        com.focusPage("#levelCheck").html(com.checkNull(userView.userLevel[$userInfo.level].value, "无"));
        com.focusPage("#deptTypeSelCheck").html($userInfo.user.duty.departmentType.name);
        com.focusPage("#deptSelCheck").html($userInfo.user.dept.name);
        com.focusPage("#dutySelCheck").html($userInfo.user.duty.name);
        com.focusPage("#employTime").html(com.checkNull($userInfo.employTime, "无"));
        com.focusPage("#firstTime").html(com.checkNull($userInfo.firstTime, "无"));
        com.focusPage("#preformNumCheck").html(com.checkNull($userInfo.preformNum, "无"));
        com.focusPage("#fignTimeCheck").html(com.checkNull($userInfo.fignTime, "无"));

        com.focusPage("#statusSelCheck").html(userView.statusType[$userInfo.user.status].value);
        com.focusPage("#employWaySelCheck").html(com.checkNull(userView.employWay[$userInfo.employWay].value, "无"));
        com.focusPage("#employTypeSelCheck").html(com.checkNull($userInfo.employType == 0 ? "正式" : "试用", "无"));
        com.focusPage("#recommendManCheck").html(com.checkNull($userInfo.recommendMan, "无"));
        com.focusPage("#entryTimeCheck").html(com.checkNull($userInfo.entryTime, "无"));
        com.focusPage("#employTimeCheck").html(com.checkNull($userInfo.employTime, "无"));

        com.focusPage("#signTimeCheck").html(com.checkNull($userInfo.signTime, "无"));
        com.focusPage("#eignTimeCheck").html(com.checkNull($userInfo.eignTime, "无"));
        com.focusPage("#signNumCheck").html(com.checkNull($userInfo.signNum, "无"));
        com.focusPage("#serviceYearsCheck").html(getDateYearSub($userInfo.entryTime));
        com.focusPage("#isContractCheck").html(com.checkNull($userInfo.isContract == 0 ? "是" : "否", "无"));
        com.focusPage("#isInsuranceCheck").html(com.checkNull($userInfo.isInsurance == 0 ? "是" : "否", "无"));
        com.focusPage("#insuranceTypeCheck").html($userInfo.isInsurance == 0 ? userView.insuranceType[$userInfo.insuranceType].value : "无");
        com.focusPage("#insuranceTimeCheck").html(com.checkNull($userInfo.insuranceTime, "无"));
        com.focusPage("#pensionNumCheck").html(com.checkNull($userInfo.pensionNum, "无"));
        com.focusPage("#medicalNumCheck").html(com.checkNull($userInfo.medicalNum, "无"));
        com.focusPage("#publicNumCheck").html(com.checkNull($userInfo.publicNum, "无"));

        com.focusPage("#hometownPlaceCheck").html(com.checkNull($userInfo.hometownPlace, "无"));
        com.focusPage("#rankCheck").html(com.checkNull($userInfo.rank, "无"));
        com.focusPage("#formSelCheck").html($userInfo.form == 0 ? "产值" : "非产值");

        if (userView.isExpert == true) {
            com.focusPage("#palaryCheck").html(com.checkNull($userInfo.palary, "无"));
            com.focusPage("#salaryCheck").html(com.checkNull($userInfo.salary, "无"));
            com.focusPage("#bankCheck").html(com.checkNull($userInfo.bank, "无"));
            com.focusPage("#bankCardNumCheck").html(com.checkNull($userInfo.bankCardNum, "无"));
        } else {
            com.focusPage("#palaryCheck").parents('div.form-group').css('display', 'none');
            com.focusPage("#salaryCheck").parents('div.form-group').css('display', 'none');
            com.focusPage("#bankCheck").parents('div.form-group').css('display', 'none');
            com.focusPage("#bankCardNumCheck").parents('div.form-group').css('display', 'none');
        }
    });

});