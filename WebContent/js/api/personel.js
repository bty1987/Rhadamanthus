
$.extend(api.index, {
    userIndex: {url: "/views/personnel/user.html"},
    userViewIndex: {url: "/views/personnel/user4view.html"},
    userEditIndex: {url: '/views/personnel/user2edit.html'},
    userContractIndex: {url: "/views/personnel/userContract.html"},
    userExperienceIndex: {url: "/views/personnel/userExperience.html"}
});

$.extend(api, {personel: {
    pageUser: {url: "pageUser.do", demo: true},
    queryUserByLoginId: {url: "queryUserByLoginId.do"},
    queryUserByUserId: {url: "queryUserByUserId.do", demo: true},
    queryUserInfoByUserId: {url: "queryUserInfoByUserId.do"},
    queryUserForSelfByUserId: {url: "queryUserForSelfByUserId.do", demo: true ,server:"communion"},
    queryUserByOldUserId: {url: "queryUserByOldUserId.do"},
    queryUserByPinyin: {url: "queryUserByPinyin.do"},
	querySupplierByPinyin: {url: "querySupplierByPinyin.do"},
    queryUserByUids:{url:"queryUserByUids.do" },
    addUser: {url: "addUser.do", server: "communion"},
    updateUserForBaseInfo: {url: "updateUserForBaseInfo.do", server: "communion"},
    updateUser: {url: "updateUser.do", server: "communion"},
    updateUserForProfile: {url: "updateUserForProfile.do" ,server: "communion"},
    
    updateUserForAdvance: {url: "updateUserForAdvance.do", server: "communion"},
    resetPassword: {url: "resetPassword.do", server: "communion"},
    changePassword: {url: "changePassword.do", server: "communion"},
    defaultPassword: {url: "defaultPassword.do", server: "communion"},
    deleteUserByIds: {url: "deleteUserByIds.do", server: "communion"},

    pageUserContractByUserId: {url: "pageUserContractByUserId.do"},
    addUserContract: {url: "addUserContract.do", server: "communion"},
    updateUserContract: {url: "updateUserContract.do", server: "communion"},
    deleteUserContract: {url: "deleteUserContract.do", server: "communion"},
    queryUserContract: {url: "queryUserContract.do"},
    
    queryUserEducation:{url: "queryUserEducation.do"},
    addUserEducation:{url: "addUserEducation.do", server: "communion"},
    updateUserEducation: {url: "updateUserEducation.do", server: "communion"},
    deleteUserEducation: {url: "deleteUserEducation.do", server: "communion"},
    
    queryUserLabelByUid: {url: "queryUserLabelByUid.do"},
    queryUserOperation: {url: "queryUserOperation.do"},
    addUserOperation: {url: "addUserOperation.do", server: "communion"},
    updateUserOperation: {url: "updateUserOperation.do", server: "communion"},
    deleteUserOperation: {url: "deleteUserOperation.do", server: "communion"},

    queryUserExperienceByUid: {url: "queryUserExperienceByUid.do"},

    pageUserSalary: {url: "pageUserSalary.do"},
    pageUserSalaryByUserId: {url: "pageUserSalaryByUserId.do"},
    addUserSalary: {url: "addUserSalary.do"},
    updateUserSalary: {url: "updateUserSalary.do"},
    deleteUserSalary: {url: "deleteUserSalary.do"},
    
    queryUserCompany: {url: "queryUserCompany.do"},
    updateUserCompany: {url: "updateUserCompany.do", server: "communion"},

    PageUserRequire:{url: "pageUserRequire.do"},
    addUserRequire:{url: "addUserRequire.do", server: "communion"},
    approveUserRequire:{url: "approveUserRequire.do", server: "communion"},
    finishUserRequire:{url: "finishUserRequire.do", server: "communion"},
    refuseUserRequire:{url: "refuseUserRequire.do", server: "communion"},

    pagePerformance:{url: "pagePerformance.do"},
    addPreformance:{url: "addPreformance.do", server: "communion"},
    
    pageSupplier: {url: "pageSupplier.do"},
    querySupplierByPinyin: {url: "querySupplierByPinyin.do"},
    addSupplier: {url: "addSupplier.do", server: "communion"},
    updateSupplier: {url: "updateSupplier.do", server: "communion"},
    
    queryMacontrol: {url: "queryMacontrol.do"},
    checkMacontrol: {url: "checkMacontrol.do", server: "communion"},
    addMacontrol: {url: "addMacontrol.do", server: "communion"},
    deleteMacontrol: {url: "deleteMacontrol.do", server: "communion"},
	queryAttendance: {url: "queryAttendance.do"},
	reportAttendance: {url: "reportAttendance.do"},
	
	queryDutmentByDeid: {url: "queryDutmentByDeid.do"},
	queryDutmentByDuid: {url: "queryDutmentByDuid.do"},
	addDutment: {url: "addDutment.do", server: "communion"},
	updateDutment: {url: "updateDutment.do", server: "communion"},
	deleteDutment: {url: "deleteDutment.do", server: "communion"},
	updateUserExperience: {url: "updateUserExperience.do", server: "communion"},
	
	pageAvenger: {url: "pageAvenger.do"},
    queryAvengerByPinyin: {url: "queryAvengerByPinyin.do"},
    
    pageMerchant: {url: "pageMerchant.do"},
    queryMerchantByPinyin: {url: "queryMerchantByPinyin.do"},

}});
