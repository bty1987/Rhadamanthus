$(function(){
    
    com.post(api.personel.queryUserInfoByUserId, {"userInfo.user.userId": params.tempUserId}, function(res){
        
        var $userInfo = res.userInfo;
        
        com.focusPage("#userIdCheck").html(com.checkNull($userInfo.user.userId, "无"));
        com.focusPage("#oldUserIdCheck").html(com.checkNull($userInfo.user.oldUserId, "无"));
        com.focusPage("#userNameCheck").html($userInfo.user.userName);
        com.focusPage("#currentNameCheck").html($userInfo.user.currentName);
        com.focusPage("#genderCheck").html($userInfo.user.gender);
        com.focusPage("#ageCheck").html($userInfo.age);
        com.focusPage("#birthdayCheck").html($userInfo.user.birthday);
        com.focusPage("#politicalSelCheck").html(com.checkNull($userInfo.political, "无"));
        com.focusPage("#jobYearsCheck").html(com.checkNull($userInfo.jobYears, "无"));
        com.focusPage("#identityCheck").html($userInfo.user.identity);
        com.focusPage("#phoneCheck").html($userInfo.user.phone);
        com.focusPage("#addressCheck").html(com.checkNull($userInfo.address, "无"));
        com.focusPage("#hometownAddressCheck").html(com.checkNull($userInfo.hometownAddress, "无"));
        com.focusPage("#householdSelCheck").html(com.checkNull($userInfo.householdType, "无"));
        com.focusPage("#emergencyManCheck").html(com.checkNull($userInfo.emergencyMan, "无"));
        com.focusPage("#emergencyPhoneCheck").html(com.checkNull($userInfo.emergencyPhone, "无"));
        com.focusPage("#isPresentGraduateCheck").html(com.checkNull($userInfo.isPresentGraduate, "无"));
        com.focusPage("#graduateTimeCheck").html(com.checkNull($userInfo.graduateTime, "无"));
        com.focusPage("#schoolCheck").html(com.checkNull($userInfo.school, "无"));
        com.focusPage("#educationSelCheck").html(com.checkNull($userInfo.education, "无"));
        com.focusPage("#specialtyCheck").html(com.checkNull($userInfo.specialty, "无"));
        com.focusPage("#isMarriedCheck").html(com.checkNull($userInfo.isMarried, "无"));
        com.focusPage("#isBirthCheck").html(com.checkNull($userInfo.isBirth, "无"));
        com.focusPage("#isHouseLoanCheck").html(com.checkNull($userInfo.isHouseLoan, "无"));
        com.focusPage("#isCarLoanCheck").html(com.checkNull($userInfo.isCarLoan, "无"));
        com.focusPage("#houseTypeSelCheck").html(com.checkNull($userInfo.houseType, "无"));
        com.focusPage("#loverCheck").html(com.checkNull($userInfo.lover, "无"));
        com.focusPage("#loginIdCheck").html($userInfo.user.loginId);
        com.focusPage("#companyCheck").html(com.checkNull($userInfo.user.companys, "无"));

        com.focusPage("#deptTypeSelCheck").html($userInfo.user.duty.departmentType.name);
        com.focusPage("#deptSelCheck").html($userInfo.user.dept.name);
        com.focusPage("#dutySelCheck").html($userInfo.user.duty.name);

        com.focusPage("#statusSelCheck").html(user.statusType[$userInfo.user.status].value);
        com.focusPage("#employWaySelCheck").html(com.checkNull($userInfo.employWay, "无"));
        com.focusPage("#employTypeSelCheck").html(com.checkNull($userInfo.employType, "无"));
        com.focusPage("#recommendManCheck").html(com.checkNull($userInfo.recommendMan, "无"));
        com.focusPage("#entryTimeCheck").html($userInfo.entryTime);
        com.focusPage("#employTimeCheck").html(com.checkNull($userInfo.employTime, "无"));
        com.focusPage("#serviceYearsCheck").html(com.checkNull($userInfo.serviceYears, "无"));
        com.focusPage("#isContractCheck").html(com.checkNull($userInfo.isContract, "无"));
        com.focusPage("#isInsuranceCheck").html(com.checkNull($userInfo.isInsurance, "无"));
        com.focusPage("#insuranceTimeCheck").html(com.checkNull($userInfo.insuranceTime, "无"));
        com.focusPage("#pensionNumCheck").html(com.checkNull($userInfo.pensionNum, "无"));
        com.focusPage("#medicalNumCheck").html(com.checkNull($userInfo.medicalNum, "无"));
        com.focusPage("#salaryCheck").html($userInfo.salary);
        com.focusPage("#bankCheck").html(com.checkNull($userInfo.bank, "无"));
        com.focusPage("#bankCardNumCheck").html(com.checkNull($userInfo.bankCardNum, "无"));
    });
    
});