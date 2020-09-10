$(function(){
    
	var userDetail = {
			statusType: {},
			politicalType: {},
			householdType: {},
			educationType: {},
			userLevel: {},
			employWay: {},
			insuranceType: {},
			employType: {},
			status: {"0": "有效", "1": "无效"},
			gender: {"0": "女", "1": "男"},
			isOrNot: {"0": "是","1": "否"},
			isOrHave: {"0": "有","1": "无"},
			ucid: null,
			ueid: null,
			uoid: null,
			upid: null,
	        deptType: [],
	        flag: true,
			modals: {
				addContractModal: com.focusPage('#addContractModal'),
				addEducationModal: com.focusPage('#addEducationModal'),
				addOperationModal: com.focusPage('#addOperationModal'),
				updateUserBasicModal: com.focusPage('#updateUserBasicModal'),
				updateUserHouseholdModal: com.focusPage('#updateUserHouseholdModal'),
				updateUserWorkModal: com.focusPage('#updateUserWorkModal'),
				updateUserEmployModal: com.focusPage('#updateUserEmployModal'),
				updateUserBelongModal: com.focusPage('#updateUserBelongModal'),
				updateUserQiTaModal: com.focusPage('#updateUserQiTaModal')
			},
			items: {},
			btns:{
				saveContractBtn: com.focusPage("#saveContractBtn", "#addContractModal"),
				saveEducationBtn: com.focusPage("#saveEducationBtn", "#addEducationModal"),
				saveOperationsBtn: com.focusPage("#saveOperationsBtn", "#addOperationModal"),
				updateUserBasicBtn: com.focusPage('#updateUserBasicBtn', '#updateUserBasicModal'),
				updateUserHouseholdBtn: com.focusPage('#updateUserHouseholdBtn', '#updateUserHouseholdModal'),
				updateUserWorkBtn: com.focusPage('#updateUserWorkBtn', '#updateUserWorkModal'),
				updateUserEmployBtn: com.focusPage('#updateUserEmployBtn', '#updateUserEmployModal'),
				updateUserBelongBtn: com.focusPage('#updateUserBelongBtn', '#updateUserBelongModal'),
				updateUserQiTaBtn: com.focusPage('#updateUserQiTaBtn', '#updateUserQiTaModal')
			},
			getProp: {"0": true, "1": false, "true": 0, "false": 1},
			isExpert: params.isExpert
	};
	
	if (userDetail.isExpert == false) {
		com.focusPage('#userPalary').parents('div.profile-info-row').css('display','none');
		com.focusPage('#userSalary').parents('div.profile-info-row').css('display','none');
		com.focusPage('#userBank').parents('div.profile-info-row').css('display','none');
		com.focusPage('#userBankCardNum').parents('div.profile-info-row').css('display','none');
	}
	
	//有关合同控件绑定
	userDetail.items.name = com.focusPage("#name", "#addContractModal");
	userDetail.items.signTime = com.focusPage("#signTime", "#addContractModal");
	userDetail.items.startTime = com.focusPage("#startTime", "#addContractModal");
	userDetail.items.endTime = com.focusPage("#endTime", "#addContractModal");
	userDetail.items.status = com.focusPage("#status", "#addContractModal");
	userDetail.items.comment = com.focusPage("#comment", "#addContractModal");
    com.datetime(com.focusPage("#signTime", "#addContractModal"));
    com.datetime(com.focusPage("#startTime", "#addContractModal"));
    com.datetime(com.focusPage("#endTime", "#addContractModal"));
    
    //有关教育控件绑定
    userDetail.items.organ = com.focusPage('#organ', '#addEducationModal');
    userDetail.items.certificate = com.focusPage('#certificate', '#addEducationModal');
    userDetail.items.beginTime = com.focusPage('#beginTime', '#addEducationModal');
    userDetail.items.educationEndTime = com.focusPage('#educationEndTime', '#addEducationModal');
    userDetail.items.content = com.focusPage('#content', '#addEducationModal');
    userDetail.items.specialty = com.focusPage('#specialty', '#addEducationModal');
    com.datetime(com.focusPage("#beginTime", "#addEducationModal"));
    com.datetime(com.focusPage("#educationEndTime", "#addEducationModal"));
    
    //有关工作控件绑定
    userDetail.items.company = com.focusPage('#company', '#addOperationModal');
    userDetail.items.trade = com.focusPage('#trade', '#addOperationModal');
    userDetail.items.duty = com.focusPage('#duty', '#addOperationModal');
    userDetail.items.opeBeginTime = com.focusPage('#opeBeginTime', '#addOperationModal');
    userDetail.items.opeEndTime = com.focusPage('#opeEndTime', '#addOperationModal');
    userDetail.items.salary = com.focusPage('#salary', '#addOperationModal');
    userDetail.items.opeComment = com.focusPage('#opeComment', '#addOperationModal');
    com.datetime(com.focusPage("#opeBeginTime", "#addOperationModal"));
    com.datetime(com.focusPage("#opeEndTime", "#addOperationModal"));
    
    //人员基本信息
    userDetail.items.genders = com.focusPage('#genders', '#updateUserBasicModal');
    userDetail.items.heights = com.focusPage('#heights', '#updateUserBasicModal');
    userDetail.items.weights = com.focusPage('#weights', '#updateUserBasicModal');
    userDetail.items.politicals = com.focusPage('#politicals', '#updateUserBasicModal');
    userDetail.items.nations = com.focusPage('#nations', '#updateUserBasicModal');
    userDetail.items.qqs = com.focusPage('#qqs', '#updateUserBasicModal');
    userDetail.items.wechats = com.focusPage('#wechats', '#updateUserBasicModal');
    userDetail.items.emails = com.focusPage('#emails', '#updateUserBasicModal');
    userDetail.items.hobbys = com.focusPage('#hobbys', '#updateUserBasicModal');
    
    //人员户籍信息
    userDetail.items.isMarrieds = com.focusPage('#isMarrieds', '#updateUserHouseholdModal');
    userDetail.items.isBirths = com.focusPage('#isBirths', '#updateUserHouseholdModal');
    userDetail.items.isHouseLoans = com.focusPage('#isHouseLoans', '#updateUserHouseholdModal');
    userDetail.items.isCarLoans = com.focusPage('#isCarLoans', '#updateUserHouseholdModal');
    userDetail.items.isPassIDs = com.focusPage('#isPassIDs', '#updateUserHouseholdModal');
    userDetail.items.isCarIDs = com.focusPage('#isCarIDs', '#updateUserHouseholdModal');
    userDetail.items.isHMIDs = com.focusPage('#isHMIDs', '#updateUserHouseholdModal');
    userDetail.items.isTWIDs = com.focusPage('#isTWIDs', '#updateUserHouseholdModal');
    userDetail.items.householdTypes = com.focusPage('#householdTypes', '#updateUserHouseholdModal');
    userDetail.items.hometownAddresss = com.focusPage('#hometownAddresss', '#updateUserHouseholdModal');
    userDetail.items.addresss = com.focusPage('#addresss', '#updateUserHouseholdModal');
    userDetail.items.lovers = com.focusPage('#lovers', '#updateUserHouseholdModal');
    userDetail.items.claners = com.focusPage('#claners', '#updateUserHouseholdModal');
    userDetail.items.clanerComs = com.focusPage('#clanerComs', '#updateUserHouseholdModal');
    userDetail.items.emergencyMans = com.focusPage('#emergencyMans', '#updateUserHouseholdModal');
    userDetail.items.emergencyPhones = com.focusPage('#emergencyPhones', '#updateUserHouseholdModal');
    userDetail.items.fangliners = com.focusPage('#fangliners', '#updateUserHouseholdModal');
    userDetail.items.hometownPlace = com.focusPage('#hometownPlace', '#updateUserHouseholdModal');
    
    //人员工作信息
    userDetail.items.isContracts = com.focusPage('#isContracts', '#updateUserWorkModal');
    userDetail.items.signTimes = com.focusPage('#signTimes', '#updateUserWorkModal');
    userDetail.items.eignTimes = com.focusPage('#eignTimes', '#updateUserWorkModal');
    userDetail.items.fignTimes = com.focusPage('#fignTimes', '#updateUserWorkModal');
    userDetail.items.signNums = com.focusPage('#signNums', '#updateUserWorkModal');
    userDetail.items.formTimes = com.focusPage('#formTimes', '#updateUserWorkModal');
    userDetail.items.isInsurances = com.focusPage('#isInsurances', '#updateUserWorkModal');
    userDetail.items.insuranceTypes = com.focusPage('#insuranceTypes', '#updateUserWorkModal');
    userDetail.items.insuranceTimes = com.focusPage('#insuranceTimes', '#updateUserWorkModal');
    userDetail.items.pensionNums = com.focusPage('#pensionNums', '#updateUserWorkModal');
    userDetail.items.medicalNums = com.focusPage('#medicalNums', '#updateUserWorkModal');
    userDetail.items.publicNums = com.focusPage('#publicNums', '#updateUserWorkModal');
    com.datetime(com.focusPage("#signTimes", "#updateUserWorkModal"));
    com.datetime(com.focusPage("#eignTimes", "#updateUserWorkModal"));
    com.datetime(com.focusPage("#fignTimes", "#updateUserWorkModal"));
    com.datetime(com.focusPage("#formTimes", "#updateUserWorkModal"));
    com.datetime(com.focusPage("#insuranceTimes", "#updateUserWorkModal"));
    
    //人员招聘信息
    userDetail.items.firstTimes = com.focusPage('#firstTimes', '#updateUserEmployModal');
    userDetail.items.entryTimes = com.focusPage('#entryTimes', '#updateUserEmployModal');
    userDetail.items.employWays = com.focusPage('#employWays', '#updateUserEmployModal');
    userDetail.items.recommendMans = com.focusPage('#recommendMans', '#updateUserEmployModal');
    userDetail.items.jobYearss = com.focusPage('#jobYearss', '#updateUserEmployModal');
    userDetail.items.employTypes = com.focusPage('#employTypes', '#updateUserEmployModal');
    userDetail.items.employTimes = com.focusPage('#employTimes', '#updateUserEmployModal');
    userDetail.items.isPresentGraduates = com.focusPage('#isPresentGraduates', '#updateUserEmployModal');
    userDetail.items.graduateTimes = com.focusPage('#graduateTimes', '#updateUserEmployModal');
    userDetail.items.schools = com.focusPage('#schools', '#updateUserEmployModal');
    userDetail.items.educations = com.focusPage('#educations', '#updateUserEmployModal');
    userDetail.items.specialtys = com.focusPage('#specialtys', '#updateUserEmployModal');
    com.datetime(com.focusPage("#firstTimes", "#updateUserEmployModal"));
    com.datetime(com.focusPage("#entryTimes", "#updateUserEmployModal"));
    com.datetime(com.focusPage("#employTimes", "#updateUserEmployModal"));
    com.datetime(com.focusPage("#graduateTimes", "#updateUserEmployModal"));
    
    //人员归属信息
    userDetail.items.userIds = com.focusPage('#userIds', '#updateUserBelongModal');
    userDetail.items.oldUserIds = com.focusPage('#oldUserIds', '#updateUserBelongModal');
    userDetail.items.userNames = com.focusPage('#userNames', '#updateUserBelongModal');
    userDetail.items.currentNames = com.focusPage('#currentNames', '#updateUserBelongModal');
    userDetail.items.identitys = com.focusPage('#identitys', '#updateUserBelongModal');
    userDetail.items.deptTypeSel = com.focusPage('#deptTypeSel', '#updateUserBelongModal');
    userDetail.items.deptSel = com.focusPage('#deptSel', '#updateUserBelongModal');
    userDetail.items.dutySel = com.focusPage('#dutySel', '#updateUserBelongModal');
    userDetail.items.roles = com.focusPage('#roles', '#updateUserBelongModal');
    userDetail.items.levels = com.focusPage('#levels', '#updateUserBelongModal');
    userDetail.items.rank_sequence = com.focusPage('#rank_sequence', '#updateUserBelongModal');
    userDetail.items.rank_level = com.focusPage('#rank_level', '#updateUserBelongModal');
    userDetail.items.form = com.focusPage('#form', '#updateUserBelongModal');
    
    com.datetime(com.focusPage("#operateTime", "#updateUserExperienceModal"));
    
    com.post(api.communion.queryDepartmentType, {}, function(a){
        userDetail.deptType = a.departmentTypes;
    },null, false);
    
    userDetail.items.deptTypeSel.bindData(userDetail.deptType, "dtid", "name");
    userDetail.items.deptTypeSel.on("change", function(b, d) {
        com.post(api.system.queryDutyByDtid,{"duty.departmentType.dtid" :$(this).val()},function(res){
            userDetail.dutyTypeMap=res.dutys;
            userDetail.items.dutySel.bindData(userDetail.dutyTypeMap,"did","name");
        },null,false);

        com.post(api.communion.queryDepartmentByDtid, {"dept.type.dtid": $(this).val()}, function(res) {
        	userDetail.items.deptSel.bindData(res.deptList, "did", "name");
            d && d();
        },null,false);
    }).trigger("change");
    
    //人员其他信息
    userDetail.items.palarys = com.focusPage('#palarys', '#updateUserQiTaModal');
    userDetail.items.salarys = com.focusPage('#salarys', '#updateUserQiTaModal');
    userDetail.items.banks = com.focusPage('#banks', '#updateUserQiTaModal');
    userDetail.items.bankCardNums = com.focusPage('#bankCardNums', '#updateUserQiTaModal');
    userDetail.items.comments = com.focusPage('#comments', '#updateUserQiTaModal');
    userDetail.items.preformNums = com.focusPage('#preformNums', '#updateUserQiTaModal');
    
	com.post(api.ds.personel, {timestamp: (new Date).getTime()},function(a) {
		userDetail.statusType = a.statusType;
		userDetail.politicalType = a.politicalType;
		userDetail.householdType = a.householdType;
		userDetail.educationType = a.educationType;
		userDetail.userLevel = a.userLevel;
		userDetail.employWay = a.employWay;
		userDetail.insuranceType = a.insuranceType;
		userDetail.employType = a.employType;
		userDetail.items.status.bindData(a.contractStatus , "key", "value");
		userDetail.items.rank_sequence.bindData(a.rank_sequence, "key", "value");
	    userDetail.items.rank_level.bindData(a.rank_level, "key", "value");
	    userDetail.items.form.bindData(a.form, "key", "value");
    }, null, false);
	
	userDetail.items.politicals.bindData(userDetail.politicalType, "key", "value");
	userDetail.items.insuranceTypes.bindData(userDetail.insuranceType, "key", "value");
	userDetail.items.employWays.bindData(userDetail.employWay, "key", "value");
	userDetail.items.employTypes.bindData(userDetail.employType, "key", "value");
	userDetail.items.educations.bindData(userDetail.educationType, "key", "value");
	userDetail.items.levels.bindData(userDetail.userLevel, "key", "value");
	userDetail.items.householdTypes.bindData(userDetail.householdType, "key", "value");
	
	function getBirthday(idCard) {
		  var birthday = "";
		  if(idCard != null && idCard != ""){
			  birthday = idCard.substr(6,8);

			  birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
		  }
		  return birthday;
	}
	
	function calaAge(birth){
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
		var days = (endDate - startDate) / (1*24*60*60*1000);
		  
		return  (days / 365).toFixed(1);
	}
	
	queryUserInfo();

	update();

	function queryUserInfo(){
		
    	com.post(api.personel.queryUserInfoByUserId, {"userInfo.user.userId": params.tempUserId}, function(res){
        	
            var $userInfo = res.userInfo;

            upload($userInfo);
        
            com.showImg(com.focusPage('#avatar'), $userInfo.user.userPhoto, 180, 200, '');
            
            com.focusPage('#userSex').html(userDetail.gender[$userInfo.gender]);
            com.focusPage('#userAge').html(calaAge(getBirthday($userInfo.user.identity)));
            com.focusPage('#userBirthday').html(getBirthday($userInfo.user.identity));
            com.focusPage('#userHeight').html($userInfo.height + 'cm');
            com.focusPage('#userWeight').html($userInfo.weight + 'kg');
            com.focusPage('#userPolitical').html(userDetail.politicalType[$userInfo.political].value);
            com.focusPage('#userNation').html(com.checkNull($userInfo.nation, "无"));
            com.focusPage('#userHobby').html(com.checkNull($userInfo.hobby, "无"));
            com.focusPage('#userQQ').html(com.checkNull($userInfo.qq, "无"));
            com.focusPage('#userWechat').html(com.checkNull($userInfo.wechat, "无"));
            com.focusPage('#userEamil').html(com.checkNull($userInfo.email, "无"));
            
            com.focusPage('#userIsContract').html(userDetail.isOrNot[$userInfo.isContract]);
            com.focusPage('#userSignTime').html(com.checkNull($userInfo.signTime, "无"));
            com.focusPage('#userEignTime').html(com.checkNull($userInfo.eignTime, "无"));
            com.focusPage('#userFignTime').html(com.checkNull($userInfo.fignTime, "无"));
            com.focusPage('#userSignNum').html(com.checkNull($userInfo.signNum, "无"));
            com.focusPage('#userPreformNum').html(com.checkNull($userInfo.preformNum, "无"));
            com.focusPage('#userFormTime').html(com.checkNull($userInfo.formTime, "无"));
            com.focusPage('#userIsInsurance').html(userDetail.isOrNot[$userInfo.isInsurance]);
            com.focusPage('#userInsuranceType').html(userDetail.insuranceType[$userInfo.insuranceType].value);
            com.focusPage('#userInsuranceTime').html(com.checkNull($userInfo.insuranceTime, "无"));
            com.focusPage('#userPensionNum').html(com.checkNull($userInfo.pensionNum, "无"));
            com.focusPage('#userMedicalNum').html(com.checkNull($userInfo.medicalNum, "无"));
            com.focusPage('#userPublicNum').html(com.checkNull($userInfo.publicNum, "无"));
            
            com.focusPage('#usersIds').html($userInfo.user.userId);
            com.focusPage('#userOldUserId').html(com.checkNull($userInfo.user.oldUserId, "无"));
            com.focusPage('#usersNames').html(com.checkNull($userInfo.user.userName, "无"));
            com.focusPage('#userCurrentName').html(com.checkNull($userInfo.user.currentName, "无"));
            com.focusPage('#userIdentity').html(com.checkNull($userInfo.user.identity, "无"));
            com.focusPage('#userPhone').html(com.checkNull($userInfo.user.phone, "无"));
            com.focusPage('#userDuty').html($userInfo.user.duty.name);
            com.focusPage('#userRole').html($userInfo.user.role.name);
            com.focusPage('#userDept').html($userInfo.user.dept.name);
            com.focusPage('#userLevel').html(userDetail.userLevel[$userInfo.level].value);
            
            com.focusPage('#userIsMarried').html($userInfo.isMarried == 0 ? "已婚" : "未婚");
            com.focusPage('#userIsBirth').html($userInfo.isBirth == 0 ? "已育" : "未育");
            com.focusPage('#userIsHouseLoan').html(userDetail.isOrHave[$userInfo.isHouseLoan]);
            com.focusPage('#userIsCarLoan').html(userDetail.isOrHave[$userInfo.isCarLoan]);
            com.focusPage('#userIsCarID').html(userDetail.isOrHave[$userInfo.isCarID]);
            com.focusPage('#userIsPassID').html(userDetail.isOrHave[$userInfo.isPassID]);
            com.focusPage('#userIsHMID').html(userDetail.isOrHave[$userInfo.isHMID]);
            com.focusPage('#userIsTWID').html(userDetail.isOrHave[$userInfo.isTWID]);
            com.focusPage('#userHouseholdType').html(userDetail.householdType[$userInfo.householdType].value);
            com.focusPage('#userHometownAddress').html(com.checkNull($userInfo.hometownAddress, "无"));
            com.focusPage('#userAddress').html(com.checkNull($userInfo.address, "无"));
            com.focusPage('#userLover').html(com.checkNull($userInfo.lover, "无"));
            com.focusPage('#userClaner').html(com.checkNull($userInfo.claner, "无"));
            com.focusPage('#userClanerCom').html(com.checkNull($userInfo.clanerCom, "无"));
            com.focusPage('#userEmergencyMan').html(com.checkNull($userInfo.emergencyMan, "无"));
            com.focusPage('#userEmergencyPhone').html(com.checkNull($userInfo.emergencyPhone, "无"));
            com.focusPage('#userFangliner').html($userInfo.fangliner == null ? "无" : $userInfo.fangliner.currentName);
            
            com.focusPage('#userFirstTime').html(com.checkNull($userInfo.firstTime, "无"));
            com.focusPage('#userEntryTime').html(com.checkNull($userInfo.entryTime, "无"));
            com.focusPage('#userEmployWay').html(userDetail.employWay[$userInfo.employWay].value);
            com.focusPage('#userRecommendMan').html(com.checkNull($userInfo.recommendMan, "无"));
            com.focusPage('#userJobYears').html(com.checkNull($userInfo.jobYears, "无"));
            com.focusPage('#userEmployType').html(userDetail.employType[$userInfo.employType].value);
            com.focusPage('#userEmployTime').html(com.checkNull($userInfo.employTime, "无"));
            com.focusPage('#userServiceYears').html(getDateYearSub($userInfo.entryTime));
            com.focusPage('#userIsPresentGraduate').html(userDetail.isOrNot[$userInfo.isPresentGraduate]);
            com.focusPage('#userGraduateTime').html(com.checkNull($userInfo.graduateTime, "无"));
            com.focusPage('#userSchool').html(com.checkNull($userInfo.school, "无"));
            com.focusPage('#userEducation').html(userDetail.educationType[$userInfo.education].value);
            com.focusPage('#userSpecialty').html(com.checkNull($userInfo.specialty, "无"));
            
            com.focusPage('#userPalary').html(com.checkNull($userInfo.palary, "无"));
            com.focusPage('#userSalary').html(com.checkNull($userInfo.salary, "无"));
            com.focusPage('#userBank').html(com.checkNull($userInfo.bank, "无"));
            com.focusPage('#userBankCardNum').html(com.checkNull($userInfo.bankCardNum, "无"));
            com.focusPage('#userComment').html(com.checkNull($userInfo.comment, "无"));
            com.focusPage('#userHometownPlace').html(com.checkNull($userInfo.hometownPlace, "无"));
            com.focusPage('#rank').html(com.checkNull($userInfo.rank, "无"));
            com.focusPage('#form').html($userInfo.form == 0 ? "产值" : "非产值");
            
          //修改人员基本信息弹窗
            com.focusPage('#updateUsersBasic').bindClick(function(){
            	updateUsersBasic($userInfo);
            	userDetail.modals.updateUserBasicModal.modal('show');
            });
            
            com.focusPage('#updateUserHousehold').bindClick(function(){
            	updateUserHousehold($userInfo);
            	userDetail.modals.updateUserHouseholdModal.modal('show');
            });
            
            com.focusPage('#updateUsersWork').bindClick(function(){
            	updateUsersWork($userInfo);
            	userDetail.modals.updateUserWorkModal.modal('show');
            });
            
            com.focusPage('#updateUsersEmploys').bindClick(function(){
            	updateUsersEmploys($userInfo);
            	userDetail.modals.updateUserEmployModal.modal('show');
            });
            
            com.focusPage('#updateUsersBelong').bindClick(function(){
            	updateUsersBelong($userInfo);
            	userDetail.modals.updateUserBelongModal.modal('show');
            });
            
            com.focusPage('#updateQiTa').bindClick(function(){
            	updateQiTa($userInfo);
            	userDetail.modals.updateUserQiTaModal.modal('show');
            });

        });
    }
	
	function updateUsersBasic($userInfo){
		
		userDetail.items.genders.prop("checked", userDetail.getProp[$userInfo.gender]);
    	userDetail.items.heights.val($userInfo.height);
    	userDetail.items.weights.val($userInfo.weight);
    	userDetail.items.politicals.val($userInfo.political);
    	userDetail.items.nations.val($userInfo.nation);
    	userDetail.items.hobbys.val($userInfo.hobby);
    	
    	userDetail.items.qqs.val($userInfo.qq);
    	userDetail.items.wechats.val($userInfo.wechat);
    	userDetail.items.emails.val($userInfo.email);
	}
	
	function updateUserHousehold($userInfo){
		
		userDetail.items.isMarrieds.prop("checked", userDetail.getProp[$userInfo.isMarried]);
    	userDetail.items.isBirths.prop("checked", userDetail.getProp[$userInfo.isBirth]);
    	userDetail.items.isHouseLoans.prop("checked", userDetail.getProp[$userInfo.isHouseLoan]);
    	userDetail.items.isCarLoans.prop("checked", userDetail.getProp[$userInfo.isCarLoan]);
    	userDetail.items.isPassIDs.prop("checked", userDetail.getProp[$userInfo.isPassID]);
    	userDetail.items.isCarIDs.prop("checked", userDetail.getProp[$userInfo.isCarID]);
    	userDetail.items.isHMIDs.prop("checked", userDetail.getProp[$userInfo.isHMID]);
    	userDetail.items.isTWIDs.prop("checked", userDetail.getProp[$userInfo.isTWID]);
    	
    	userDetail.items.householdTypes.val($userInfo.householdType);
    	userDetail.items.hometownAddresss.val($userInfo.hometownAddress);
    	userDetail.items.addresss.val($userInfo.address);
    	userDetail.items.lovers.val($userInfo.lover);
    	userDetail.items.claners.val($userInfo.claner);
    	userDetail.items.clanerComs.val($userInfo.clanerCom);
    	userDetail.items.emergencyMans.val($userInfo.emergencyMan);
    	userDetail.items.emergencyPhones.val($userInfo.emergencyPhone);
    	userDetail.items.fangliners.val($userInfo.fangliner == null ? "" : $userInfo.fangliner.currentName);
    	userDetail.items.hometownPlace.val($userInfo.hometownPlace);
	}
	
	function updateUsersWork($userInfo){
		
		userDetail.items.isContracts.prop("checked", userDetail.getProp[$userInfo.isContract]);
    	userDetail.items.signTimes.val($userInfo.signTime);
    	userDetail.items.eignTimes.val($userInfo.eignTime);
    	userDetail.items.fignTimes.val($userInfo.fignTime);
    	userDetail.items.signNums.val($userInfo.signNum);
    	userDetail.items.formTimes.val($userInfo.formTime);
    	
    	userDetail.items.isInsurances.prop("checked", userDetail.getProp[$userInfo.isInsurance]);
    	userDetail.items.insuranceTypes.val($userInfo.insuranceType);
    	userDetail.items.insuranceTimes.val($userInfo.insuranceTime);
    	userDetail.items.pensionNums.val($userInfo.pensionNum);
    	userDetail.items.medicalNums.val($userInfo.medicalNum);
    	userDetail.items.publicNums.val($userInfo.publicNum);
	}
	
	function updateUsersEmploys($userInfo){
		
		userDetail.items.firstTimes.val($userInfo.firstTime);
    	userDetail.items.entryTimes.val($userInfo.entryTime);
    	userDetail.items.employWays.val($userInfo.employWay);
    	userDetail.items.recommendMans.val($userInfo.recommendMan);
    	userDetail.items.jobYearss.val($userInfo.jobYears);
    	userDetail.items.employTypes.val($userInfo.employType);
    	userDetail.items.employTimes.val($userInfo.employTime);
    	
    	userDetail.items.isPresentGraduates.prop("checked", userDetail.getProp[$userInfo.isPresentGraduate]);
    	userDetail.items.graduateTimes.val($userInfo.graduateTime);
    	userDetail.items.schools.val($userInfo.school);
    	userDetail.items.educations.val($userInfo.education);
    	userDetail.items.specialtys.val($userInfo.specialty);
	}
	
	function updateUsersBelong($userInfo){
		
		userDetail.items.userIds.val($userInfo.user.userId);
    	userDetail.items.oldUserIds.val($userInfo.user.oldUserId);
    	userDetail.items.userNames.val($userInfo.user.userName);
    	userDetail.items.currentNames.val($userInfo.user.currentName);
    	userDetail.items.identitys.val($userInfo.user.identity);
    	userDetail.items.roles.val($userInfo.user.role.name);
    	userDetail.items.levels.val($userInfo.level);
        
    	userDetail.items.deptTypeSel.val($userInfo.user.dept.type.dtid).trigger("change",function() {
    		userDetail.items.deptSel.val($userInfo.user.dept.did);
    		userDetail.items.dutySel.val($userInfo.user.duty.did);
        });
    	
        if ($userInfo.rank != null){
    		userDetail.items.rank_sequence.val($userInfo.rank.substr(0,1));
    		userDetail.items.rank_level.val($userInfo.rank.substr(1,2))
    	}
        userDetail.items.form.val($userInfo.form);
	}
	
	function updateQiTa($userInfo){
		
		if (userDetail.isExpert == false){
			userDetail.items.palarys.parents('div.form-group').css('display','none');
			userDetail.items.salarys.parents('div.form-group').css('display','none');
			userDetail.items.banks.parents('div.form-group').css('display','none');
			userDetail.items.bankCardNums.parents('div.form-group').css('display','none');
		}
		
		userDetail.items.palarys.val($userInfo.palary);
    	userDetail.items.salarys.val($userInfo.salary);
    	userDetail.items.banks.val($userInfo.bank);
    	userDetail.items.bankCardNums.val($userInfo.bankCardNum);
    	userDetail.items.comments.val($userInfo.comment);
    	userDetail.items.preformNums.val($userInfo.preformNum);
	}

	function update(){

        com.post(api.personel.queryUserInfoByUserId, {"userInfo.user.userId": params.tempUserId}, function(res){
        	var $userInfo = res.userInfo;
        	
        //修改人员基本信息更新按钮点击事件
        userDetail.btns.updateUserBasicBtn.bindClick(function(){
        	
    		 if(com.validate("updateUserBasicModal")){
    		     return false;
    		 }
    		 
    	   	var options = {
    	   			"userInfo.gender": userDetail.getProp[userDetail.items.genders.prop("checked")],
    	   			"userInfo.height": userDetail.items.heights.val(),
    	   			"userInfo.weight": userDetail.items.weights.val(),
    	   			"userInfo.political": userDetail.items.politicals.val(),
    	   			"userInfo.nation": userDetail.items.nations.val(),
    	   			"userInfo.hobby": userDetail.items.hobbys.val(),
    	   			"userInfo.qq": userDetail.items.qqs.val(),
    	   			"userInfo.wechat": userDetail.items.wechats.val(),
    	   			"userInfo.email": userDetail.items.emails.val(),
    	   			"userInfo.user.userId": $userInfo.user.userId,
    	   			"userInfo.user.dept.did": $userInfo.user.dept.did,
    	   			"userInfo.user.status": $userInfo.user.status,
    	   			"userInfo.user.duty.did": $userInfo.user.duty.did,
    	   			"userInfo.fangliner.userId": $userInfo.fangliner == null ? "" : $userInfo.fangliner.userId,
    	   			"userInfo.user.currentName": $userInfo.user.currentName
    	   	};
    	   	
    		com.post(api.personel.updateUser, options, function(res){
    					
    			com.showAlert(com.info, "操作成功");
    			
    			clear(userDetail.items)
    			userDetail.modals.updateUserBasicModal.modal("hide");
    		}, null, false);
        });
        
        com.initTypeahead('fangliners', api.personel.queryUserByPinyin, "pinyinName", {"departmentType.name" : "", "user.status" : 0}, "autoFillKeyValue", "key", "value", null);
        
        //修改人员户籍信息更新按钮点击
        userDetail.btns.updateUserHouseholdBtn.bindClick(function(){
       		 if(com.validate("updateUserHouseholdModal")){
    		     return false;
    		 }
       		 
       		 var options = {
       				"userInfo.user.userId": $userInfo.user.userId,
    	   			"userInfo.user.dept.did": $userInfo.user.dept.did,
    	   			"userInfo.user.status": $userInfo.user.status,
    	   			"userInfo.user.duty.did": $userInfo.user.duty.did,
    	   			"userInfo.fangliner.userId": com.typeahead("fangliners"),
    	   			"userInfo.user.currentName": $userInfo.user.currentName,
    	   			"userInfo.isMarried": userDetail.getProp[userDetail.items.isMarrieds.prop("checked")],
    	   			"userInfo.isBirth": userDetail.getProp[userDetail.items.isBirths.prop("checked")],
    	   			"userInfo.isHouseLoan": userDetail.getProp[userDetail.items.isHouseLoans.prop("checked")],
    	   			"userInfo.isCarLoan": userDetail.getProp[userDetail.items.isCarLoans.prop("checked")],
    	   			"userInfo.isPassID": userDetail.getProp[userDetail.items.isPassIDs.prop("checked")],
    	   			"userInfo.isCarID": userDetail.getProp[userDetail.items.isCarIDs.prop("checked")],
    	   			"userInfo.isHMID": userDetail.getProp[userDetail.items.isHMIDs.prop("checked")],
    	   			"userInfo.isTWID": userDetail.getProp[userDetail.items.isTWIDs.prop("checked")],
    	   			"userInfo.householdType": userDetail.items.householdTypes.val(),
    	   			"userInfo.hometownAddress": userDetail.items.hometownAddresss.val(),
    	   			"userInfo.address": userDetail.items.addresss.val(),
    	   			"userInfo.lover": userDetail.items.lovers.val(),
    	   			"userInfo.claner": userDetail.items.claners.val(),
    	   			"userInfo.clanerCom": userDetail.items.clanerComs.val(),
    	   			"userInfo.emergencyMan": userDetail.items.emergencyMans.val(),
    	   			"userInfo.emergencyPhone": userDetail.items.emergencyPhones.val(),
    	   			"userInfo.hometownPlace": userDetail.items.hometownPlace.val()
       		 };
       		 
       		if(com.typeahead("fangliners") == "" && com.focusPage("#fangliners").val() != ""){
            	options["userInfo.fangliner.userId"] = $userInfo.fangliner.userId
            }else if(com.focusPage("#fangliners").val() == ""){
            	options["userInfo.fangliner.userId"] = ""
            }
       		
    		com.post(api.personel.updateUser, options, function(res){
				
    			com.showAlert(com.info, "操作成功");
    			
    			clear(userDetail.items)
    			userDetail.modals.updateUserHouseholdModal.modal("hide");
    		}, null, false);
        });
        
        userDetail.btns.updateUserWorkBtn.bindClick(function(){
       		 
        	if(com.validate("updateUserWorkModal")){
    		     return false;
    		 }
        	
        	var options = {
       				"userInfo.user.userId": $userInfo.user.userId,
    	   			"userInfo.user.dept.did": $userInfo.user.dept.did,
    	   			"userInfo.user.status": $userInfo.user.status,
    	   			"userInfo.user.duty.did": $userInfo.user.duty.did,
    	   			"userInfo.fangliner.userId": $userInfo.fangliner == null ? "" : $userInfo.fangliner.userId,
    	   			"userInfo.user.currentName": $userInfo.user.currentName,
    	   			"userInfo.isContract": userDetail.getProp[userDetail.items.isContracts.prop("checked")],
    	   			"userInfo.signTime": userDetail.items.signTimes.val(),
    	   			"userInfo.eignTime": userDetail.items.eignTimes.val(),
    	   			"userInfo.fignTime": userDetail.items.fignTimes.val(),
    	   			"userInfo.signNum": userDetail.items.signNums.val(),
    	   			"userInfo.formTime": userDetail.items.formTimes.val(),
    	   			"userInfo.isInsurance": userDetail.getProp[userDetail.items.isInsurances.prop("checked")],
    	   			"userInfo.insuranceType": userDetail.items.insuranceTypes.val(),
    	   			"userInfo.insuranceTime": userDetail.items.insuranceTimes.val(),
    	   			"userInfo.pensionNum": userDetail.items.pensionNums.val(),
    	   			"userInfo.medicalNum": userDetail.items.medicalNums.val(),
    	   			"userInfo.publicNum": userDetail.items.publicNums.val(),
       		 };
        	
        	if(userDetail.items.signTimes.val() == "") delete options['userInfo.signTime'];
        	if(userDetail.items.eignTimes.val() == "") delete options['userInfo.eignTime'];
        	if(userDetail.items.fignTimes.val() == "") delete options['userInfo.fignTime'];
        	if(userDetail.items.formTimes.val() == "") delete options['userInfo.formTime'];
        	if(userDetail.items.insuranceTimes.val() == "") delete options['userInfo.insuranceTime'];
        	
    		com.post(api.personel.updateUser, options, function(res){
				
    			com.showAlert(com.info, "操作成功");

    			clear(userDetail.items)
    			userDetail.modals.updateUserWorkModal.modal("hide");
    		}, null, false);
    		
        });
        
        userDetail.btns.updateUserEmployBtn.bindClick(function(){
        	
        	if(com.validate("updateUserEmployModal")){
    		     return false;
    		 }
        	
        	var options = {
       				"userInfo.user.userId": $userInfo.user.userId,
    	   			"userInfo.user.dept.did": $userInfo.user.dept.did,
    	   			"userInfo.user.status": $userInfo.user.status,
    	   			"userInfo.user.duty.did": $userInfo.user.duty.did,
    	   			"userInfo.fangliner.userId": $userInfo.fangliner == null ? "" : $userInfo.fangliner.userId,
    	   			"userInfo.user.currentName": $userInfo.user.currentName,
    	   			"userInfo.firstTime": userDetail.items.firstTimes.val(),
    	   			"userInfo.entryTime": userDetail.items.entryTimes.val(),
    	   			"userInfo.employWay": userDetail.items.employWays.val(),
    	   			"userInfo.recommendMan": userDetail.items.recommendMans.val(),
    	   			"userInfo.jobYears": userDetail.items.jobYearss.val(),
    	   			"userInfo.employType": userDetail.items.employTypes.val(),
    	   			"userInfo.employTime": userDetail.items.employTimes.val(),
    	   			"userInfo.isPresentGraduate": userDetail.getProp[userDetail.items.isPresentGraduates.prop("checked")],
    	   			"userInfo.graduateTime": userDetail.items.graduateTimes.val(),
    	   			"userInfo.school": userDetail.items.schools.val(),
    	   			"userInfo.education": userDetail.items.educations.val(),
    	   			"userInfo.specialty": userDetail.items.specialtys.val(),
       		 };
        	
        	if(userDetail.items.firstTimes.val() == "") delete options['userInfo.firstTime'];
        	if(userDetail.items.employTimes.val() == "") delete options['userInfo.employTime'];
        	if(userDetail.items.graduateTimes.val() == "") delete options['userInfo.graduateTime'];
        	
    		com.post(api.personel.updateUser, options, function(res){
				
    			com.showAlert(com.info, "操作成功");

    			clear(userDetail.items)
    			userDetail.modals.updateUserEmployModal.modal("hide");
    		}, null, false);
        	
        });
        
        userDetail.btns.updateUserBelongBtn.bindClick(function(){
       		 
        	if(com.validate("updateUserBelongModal")){
    		     return false;
    		 }
        	
        	var options = {
       				"userInfo.user.userId": $userInfo.user.userId,
       				"userInfo.user.dept.did": userDetail.items.deptSel.val(),
    	   			"userInfo.user.status": $userInfo.user.status,
    	   			"userInfo.user.duty.did": userDetail.items.dutySel.val(),
    	   			"userInfo.fangliner.userId": $userInfo.fangliner == null ? "" : $userInfo.fangliner.userId,
    	   			"userInfo.user.currentName": userDetail.items.currentNames.val(),
    	   			"userInfo.user.oldUserId": userDetail.items.oldUserIds.val(),
    	   			"userInfo.level": userDetail.items.levels.val(),
    	   			"userInfo.rank": userDetail.items.rank_sequence.val() + userDetail.items.rank_level.val(),
    	   			"userInfo.form": userDetail.items.form.val()
       		 };
        	
    		com.post(api.personel.updateUser, options, function(res){
				
    			com.showAlert(com.info, "操作成功");

    			clear(userDetail.items)
    			userDetail.modals.updateUserBelongModal.modal("hide");
    		}, null, false);
        	
        });
        
        userDetail.btns.updateUserQiTaBtn.bindClick(function(){
       		 
        	if(com.validate("updateUserQiTaModal")){
    		     return false;
    		 }
        	
        	var options = {
       				"userInfo.user.userId": $userInfo.user.userId,
    	   			"userInfo.user.dept.did": $userInfo.user.dept.did,
    	   			"userInfo.user.status": $userInfo.user.status,
    	   			"userInfo.user.duty.did": $userInfo.user.duty.did,
    	   			"userInfo.fangliner.userId": $userInfo.fangliner == null ? "" : $userInfo.fangliner.userId,
    	   			"userInfo.user.currentName": $userInfo.user.currentName,
    	   			"userInfo.palary": userDetail.items.palarys.val() == "" ? "" : userDetail.items.palarys.val(),
    	   			"userInfo.salary": userDetail.items.salarys.val() == "" ? 0 : userDetail.items.salarys.val(),
    	   			"userInfo.bank": userDetail.items.banks.val() == "" ? 0 : userDetail.items.banks.val(),
    	   			"userInfo.bankCardNum": userDetail.items.bankCardNums.val() == "" ? 0 : userDetail.items.bankCardNums.val(),
    	   			"userInfo.comment": userDetail.items.comments.val(),
    	   			"userInfo.preformNum": userDetail.items.preformNums.val(),
       		 };
        	
    		com.post(api.personel.updateUser, options, function(res){
				
    			com.showAlert(com.info, "操作成功");

    			clear(userDetail.items)
    			userDetail.modals.updateUserQiTaModal.modal("hide");
    		}, null, false);
        	
        });
       });
	}
    
	function clear(items){
		com.clearValidator();
        com.cleanItems(items);
        queryUserInfo();
	}
	
    var $contractList = com.focusPage('.contract');
    var $educationList = com.focusPage('.educations');
    var $operationList = com.focusPage('.operations');
    var $userExperienceList = com.focusPage('.userExperience');
    
    function drawTools(div, v, type){
    	var $div_tools = $('<div></div>').addClass('tools action-buttons').appendTo(div);
		var $a_blue = $('<a></a>').addClass('blue').appendTo($div_tools);
		var $i_update = $('<i></i>').addClass('icon-pencil bigger-125').appendTo($a_blue);
		var $a_red = $('<a></a>').addClass('red').appendTo($div_tools);
		var $i_delete = $('<i></i>').addClass('icon-trash bigger-125').appendTo($a_red);
		
		if(type == 1){
			$i_update.click(function(){
				updateContract(v);
			});
			
			$i_delete.click(function(){
				deleteContract(v.ucId);
			});
		}else if(type == 2){
			$i_update.click(function(){
				updateEducation(v);
			});
			
			$i_delete.click(function(){
				deleteEducation(v.ueid);
			});
		}else if(type == 3){
			$i_update.click(function(){
				updateOperation(v);
			});
			
			$i_delete.click(function(){
				deleteOperation(v.uoid);
			});
		}else if(type == 4){
			$i_update.click(function(){
				userDetail.upid = v.upid;
				com.focusPage('#operateTime', '#updateUserExperienceModal').val(v.operateTime);
				com.focusPage('#updateUserExperienceModal').modal('show');
			});
			
			$a_red.css('display', 'none');
		}
    }
    
    function updateContract(v){
    	userDetail.flag = false;
		userDetail.ucid = v.ucId;
		
		userDetail.items.name.val(v.name);
		userDetail.items.signTime.val(v.signTime);
		userDetail.items.startTime.val(v.startTime);
		userDetail.items.endTime.val(v.endTime);
		userDetail.items.status.val(v.status);
		userDetail.items.comment.val(v.comment);
		
		userDetail.modals.addContractModal.modal('show');
    }
    
    function updateEducation(v){
    	userDetail.flag = false;
		userDetail.ueid = v.ueid;
		
		userDetail.items.organ.val(v.organ);
		userDetail.items.certificate.val(v.certificate);
		userDetail.items.specialty.val(v.specialty);
		userDetail.items.beginTime.val(v.beginTime);
		userDetail.items.educationEndTime.val(v.endTime);
		userDetail.items.content.val(v.content);
		
		userDetail.modals.addEducationModal.modal('show');
    }
    
    function updateOperation(v){
    	userDetail.flag = false;
		userDetail.uoid = v.uoid;
		
		userDetail.items.company.val(v.company);
		userDetail.items.trade.val(v.trade);
		userDetail.items.duty.val(v.duty);
		userDetail.items.opeBeginTime.val(v.beginTime);
		userDetail.items.opeEndTime.val(v.endTime);
		userDetail.items.salary.val(v.salary);
		userDetail.items.opeComment.val(v.comment);
		
		userDetail.modals.addOperationModal.modal('show');
    }
    
    queryAboutUser();
    
    function queryAboutUser(){
    	
    	com.focusPage('.contract').empty();
    	com.focusPage('.educations').empty();
    	com.focusPage('.operations').empty();
    	com.focusPage('.userExperience').empty();
    	
    	com.post(api.personel.queryUserContract, {"userContract.uid": params.uid}, function (data) {
        	if(data.userContracts.length == 0){
        		emptyData('contract');
        	}else{
        		$.each(data.userContracts, function(i, v){
            		var $div_clearfix = $('<div></div>').addClass('profile-activity clearfix').appendTo($contractList);
        			var $div = $('<div></div>').appendTo($div_clearfix);
        			var $div_title = $('<div></div>').addClass('blue').html(v.no).css('font-size','20px').appendTo($div);
        			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').appendTo($div);
					var propertyArr = [
					                ["名称:", v.name, "grey"],
					                ["状态:", userDetail.status[v.status], "red"],
					                ["签订时间:", v.signTime, "green"],
					                ["开始时间:",v.startTime,"green" ],
					                ["结束时间:",v.endTime, "green" ],
					                ["创建时间:",v.createTime, "green" ],
					                ["说明:",v.comment, "grey" ],
					            ];
        			
        			$.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });
        			drawTools($div, v, 1);
        		});
        	}
        }, null, false);
        
        com.post(api.personel.queryUserEducation, {"userEducation.uid": params.uid}, function (data) {
        	if(data.userEducations.length == 0){
        		emptyData('educations');
        	}else{
        		$.each(data.userEducations, function(i, v){
        
            		var $div_clearfix = $('<div></div>').addClass('profile-activity clearfix').appendTo($educationList);
        			var $div = $('<div></div>').appendTo($div_clearfix);
        			var $div_title = $('<div></div>').addClass('blue').html(v.organ).css('font-size','20px').appendTo($div);
        			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').appendTo($div);
					var propertyArr = [
					                ["证书:", v.certificate, "grey"],
					                ["专业:", v.specialty, "grey"],
					                ["开始时间:", v.beginTime, "green"],
					                ["结束时间:",v.endTime,"green" ],
					                ["创建时间:",v.createTime, "green" ],
					                ["内容:",v.content, "grey" ],
					            ];
        			
        			$.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });
        			drawTools($div, v, 2);
        		});
        	}
        }, null, false);
        
        com.post(api.personel.queryUserOperation, {"userOperation.uid": params.uid}, function (data) {
        	if(data.userOperations.length == 0){
        		emptyData('operations');
        	}else{
        		$.each(data.userOperations, function(i, v){
            		var $div_clearfix = $('<div></div>').addClass('profile-activity clearfix').appendTo($operationList);
        			var $div = $('<div></div>').appendTo($div_clearfix);
        			var $div_title = $('<div></div>').addClass('blue').html(v.company).css('font-size','20px').appendTo($div);
        			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').appendTo($div);
					var propertyArr = [
					                ["行业:", v.trade, "grey"],
					                ["职位:", v.duty, "grey"],
					                ["薪资:",v.salary,"blue" ],
					                ["开始时间:",v.beginTime, "green" ],
					                ["结束时间:",v.endTime, "green" ],
					                ["创建时间:",v.createTime, "green" ],
					                ["描述:",v.comment, "grey" ],
					            ];
        			
        			$.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });
        			drawTools($div, v, 3);
        		});
        	}
        }, null, false);
        
        com.post(api.personel.queryUserExperienceByUid, {"userExperience.uid": params.uid}, function (data) {
        	if(data.userExperiences.length == 0){
        		emptyData('userExperience');
        	}else{
        		$.each(data.userExperiences, function(i, v){
            		var $div_clearfix = $('<div></div>').addClass('profile-activity clearfix').appendTo($userExperienceList);
        			var $div = $('<div></div>').appendTo($div_clearfix);
        			var $div_title = $('<div></div>').addClass('blue').html(v.type).css('font-size','20px').appendTo($div);
        			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').appendTo($div);
					var propertyArr = [
				                    ["类型:", v.type, "red"],
				                    ["备注:", v.comment, "grey"],
				                    ["调动时间:",v.operateTime,"green"],
				                    ["创建时间:",v.createTime,"green"],
					            ];
        			
        			$.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });
        			drawTools($div, v, 4);
        		});
        	}
        }, null, false);
    }
    
    function emptyData(id) {
        var $resultList = com.focusPage('.' + id).html('');
        var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
        var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
        var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
    }
    
    //合同添加弹窗
    com.focusPage('#addContractBtn').bindClick(function(){
    	userDetail.flag = true;
    	userDetail.modals.addContractModal.modal('show');
    });
    
    //教育添加弹窗
    com.focusPage('#addEducationsBtn').bindClick(function(){
    	userDetail.flag = true;
    	userDetail.modals.addEducationModal.modal('show');
    });
    
    //工作弹窗
    com.focusPage('#addOperationsBtn').bindClick(function(){
    	userDetail.flag = true;
    	userDetail.modals.addOperationModal.modal('show');
    });
    
    com.focusPage('#updateUserExperienceBtn').bindClick(function(){
        if(com.validate("updateUserExperienceModal")){
            return false;
        }
        
        var options = {
        		"userExperience.upid": userDetail.upid,
        		"userExperience.operateTime": com.focusPage('#operateTime', '#updateUserExperienceModal').val()
        };
        
    	com.post(api.personel.updateUserExperience, options, function(res){
    		
    		com.showAlert(com.info, "操作成功");
    		queryAboutUser();
    		
            com.focusPage('#updateUserExperienceModal').modal("hide");
    	}, null, false);
    });
    
    //添加教育保存按钮点击事件
    userDetail.btns.saveEducationBtn.bindClick(function(){

        if(com.validate("addEducationModal")){
            return false;
        }
    	
    	var options = {
    		"userEducation.uid": params.uid,
    		"userEducation.organ": userDetail.items.organ.val(),
    		"userEducation.certificate": userDetail.items.certificate.val(),
    		"userEducation.beginTime": userDetail.items.beginTime.val(),
    		"userEducation.endTime": userDetail.items.educationEndTime.val(),
    		"userEducation.content": userDetail.items.content.val(),
    		"userEducation.specialty": userDetail.items.specialty.val()
    	};
    	
    	var url;
    	userDetail.flag ? url = api.personel.addUserEducation : (url = api.personel.updateUserEducation, options['userEducation.ueid'] = userDetail.ueid);
    	
    	com.post(url, options, function(res){
    		
    		com.showAlert(com.info, "操作成功");
    		clean(userDetail.items);
    		userDetail.modals.addEducationModal.modal("hide");
    	}, null, false);
    });
    
    //添加合同保存按钮点击事件
    userDetail.btns.saveContractBtn.bindClick(function(){
    	
    	if(com.validate("addContractModal")){
            return false;
        }
    	
    	var options = {
        		"userContract.uid": params.uid,
        		"userContract.name": userDetail.items.name.val(),
        		"userContract.signTime": userDetail.items.signTime.val(),
        		"userContract.startTime": userDetail.items.startTime.val(),
        		"userContract.endTime": userDetail.items.endTime.val(),
        		"userContract.status": userDetail.items.status.val(),
        		"userContract.comment": userDetail.items.comment.val()
        	};
        var url;
    	userDetail.flag ? url = api.personel.addUserContract : (url = api.personel.updateUserContract, options['userContract.ucId'] = userDetail.ucid);
    	
        	com.post(url, options, function(res){
        		
        		com.showAlert(com.info, "操作成功");
        		clean(userDetail.items);
        		userDetail.modals.addContractModal.modal("hide");
        	}, null, false);
    	
    });
    
    userDetail.btns.saveOperationsBtn.bindClick(function(){
    	if(com.validate("addOperationModal")){
            return false;
        }
    	
    	var options = {
    		"userOperation.uid": params.uid,
    		"userOperation.company": userDetail.items.company.val(),
    		"userOperation.trade": userDetail.items.trade.val(),
    		"userOperation.duty": userDetail.items.duty.val(),
    		"userOperation.beginTime": userDetail.items.opeBeginTime.val(),
    		"userOperation.endTime": userDetail.items.opeEndTime.val(),
    		"userOperation.salary": userDetail.items.salary.val(),
    		"userOperation.comment": userDetail.items.opeComment.val()
    	};
    	
    	var url;
    	userDetail.flag ? url = api.personel.addUserOperation : (url = api.personel.updateUserOperation, options['userOperation.uoid'] = userDetail.uoid);
    	
    	com.post(url, options, function(res){
    		
    		com.showAlert(com.info, "操作成功");
    		clean(userDetail.items);
    		userDetail.modals.addOperationModal.modal("hide");
    	}, null, false);
    });
    
    function clean(items){
    	queryAboutUser();
		com.clearValidator();
        com.cleanItems(items);
    }
    
	function deleteOperation(uoid){

	    com.post(api.personel.deleteUserOperation, {"userOperation.uoid": uoid}, function(){
	    	
	    	com.showAlert(com.info, "操作成功");
	    	
	    	queryAboutUser();
	    },null,false);
	}
    
	function deleteContract(ucid){

	    com.post(api.personel.deleteUserContract, {"userContract.ucId": ucid}, function(){
	    	
	    	com.showAlert(com.info, "操作成功");
	    	
	    	queryAboutUser();
	    },null,false);
	}
	
	function deleteEducation(ueid){

	    com.post(api.personel.deleteUserEducation, {"userEducation.ueid": ueid}, function(){
	    	
	    	com.showAlert(com.info, "操作成功");
	    	
	    	queryAboutUser();
	    },null,false);
	}
    
	function upload(v){
		com.focusPage("#updateUserPhotoBtn").empty();
		
		com.focusPage("#updateUserPhotoBtn").Huploadify({
	        'debug' : false, // 开启调试
	        'auto':true, // 是否自动上传
	        'successTimeout': 99999, //超时时间
	        'formData': { //附带值
	            'uploadType':0,
	            'strutsUploadsFileName': '',
	            'username':'用户名',
	            'rnd':'加密密文'
	        },
	        'buttonClass': 'btn btn-sm btn-block btn-success icon-plus-sign bigger-120',
	        'overrideEvents': ['onDialogClose'], // 不执行默认的onSelect事件
	        'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
	        'uploader': config.media + api.common.uploadImg.url, // 上传处理程序
	        'width': '100', // 浏览按钮的宽度
	        'height': '32', // 浏览按钮的高度
	        'fileTypeDesc': '支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
	        'fileTypeExts': '*.jpg;*.jpge;*.gif;*.png', // 允许上传的文件后缀
	        'fileSizeLimit': '3MB', // 上传文件的大小限制
	        'queueSizeLimit': 25, // 上传数量
	        'onUploadSuccess':function(file, data, response){
				var dateObj=eval("("+data+")");
				if(dateObj.errorCode == 0){
					com.focusPage("#picture").val(dateObj.resUrl);
					
					parm = {
							"userInfo.user.userPhoto":dateObj.resUrl,
							"userInfo.user.userId": v.user.userId,
							"userInfo.user.phone":v.user.phone,
							"userInfo.emergencyMan":v.emergencyMan,
							"userInfo.emergencyPhone":v.emergencyPhone,
							"userInfo.qq":v.qq,
							"userInfo.wechat":v.wechat,
							"userInfo.email":v.email
						};

					com.post(api.personel.updateUserForBaseInfo, parm, function(res){
						com.showAlert(com.info, "操作成功");
						queryUserInfo();
					});
				}else{
					alert(data);
				}
	        }
	    });
	}
    
});