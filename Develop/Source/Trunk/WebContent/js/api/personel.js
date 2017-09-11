
$.extend(api.index, {
    userIndex: {url: "/views/personnel/user.html"},
    userEditIndex: {url: '/views/personnel/userEdit.html'},
    userContractIndex: {url: "/views/personnel/userContract.html"},
    userExperienceIndex: {url: "/views/personnel/userExperience.html"}
});

$.extend(api.ds, {
    personInfo: {url: "ds/personInfo.json", demo: true}
});

$.extend(api, {personel: {
    pageUser: {url: "pageUser.do", demo: true},
    queryUserByLoginId: {url: "queryUserByLoginId.do"},
    queryUserByUserId: {url: "queryUserByUserId.do", demo: true},
    queryUserInfoByUserId: {url: "queryUserInfoByUserId.do",},
    queryUserForSelfByUserId: {url: "queryUserForSelfByUserId.do", demo: true},
    queryUserByOldUserId: {url: "queryUserByOldUserId.do"},
    queryUserForNameByPinyinName: {url: "queryUserForNameByPinyinName.do"},
    queryUserForNameByDuty: {url: "queryUserForNameByDuty.do", demo: true},
    queryUserForNameByDutys: {url: "queryUserForNameByDutys.do", demo: true},
    queryUserForNameByDutyADept: {url: "queryUserForNameByDutyADept.do"},
    queryUserForNameByDutysADept: {url: "queryUserForNameByDutysADept.do"},
    queryUserForNameByDutysAO: {url: "queryUserForNameByDutysAO.do"},
    queryUserForNameByDutysAODept: {url: "queryUserForNameByDutysAODept.do"},
    addUser: {url: "addUser.do", server: "communion"},
    saveUserForBaseInfo: {url: "saveUserForBaseInfo.do", server: "communion"},
    updateUser: {url: "updateUser.do", server: "communion"},
  
    updateUserForAdvance: {url: "updateUserForAdvance.do", server: "communion"},
    resetPassword: {url: "resetPassword.do"},
    
    changePassword: {url: "changePassword.do", server: "communion"},
    deleteUserByIds: {url: "deleteUserByIds.do", server: "communion"},

    pageUserContractByUserId: {url: "pageUserContractByUserId.do"},
    addUserContract: {url: "addUserContract.do", server: "communion"},
    updateUserContract: {url: "updateUserContract.do", server: "communion"},
    deleteUserContract: {url: "deleteUserContract.do", server: "communion"},

    queryUserExperienceByUid: {url: "queryUserExperienceByUid.do"},

    pageUserSalary: {url: "pageUserSalary.do"},
    pageUserSalaryByUserId: {url: "pageUserSalaryByUserId.do"},
    addUserSalary: {url: "addUserSalary.do"},
    updateUserSalary: {url: "updateUserSalary.do"},
    deleteUserSalary: {url: "deleteUserSalary.do"},
    
    queryUserCompany: {url: "queryUserCompany.do"},
    
    updateUserCompany: {url: "updateUserCompany.do", server: "communion"},
  

}});
