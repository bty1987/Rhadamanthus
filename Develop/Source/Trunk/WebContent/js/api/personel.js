
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
    pageUserForResetPassword: {url: "pageUserForResetPassword.do", demo: true},
    queryUserByLoginId: {url: "queryUserByLoginId.do"},
    queryUserByUserId: {url: "queryUserByUserId.do", demo: true},
    queryUserForSelfByUserId: {url: "queryUserForSelfByUserId.do", demo: true},
    queryUserByOldUserId: {url: "queryUserByOldUserId.do"},
    queryUserForNameByPinyinName: {url: "queryUserForNameByPinyinName.do"},
    queryUserForNameByDuty: {url: "queryUserForNameByDuty.do", demo: true},
    queryUserForNameByDutys: {url: "queryUserForNameByDutys.do", demo: true},
    queryUserForNameByDutyADept: {url: "queryUserForNameByDutyADept.do"},
    queryUserForNameByDutysADept: {url: "queryUserForNameByDutysADept.do"},
    queryUserForNameByDutysAO: {url: "queryUserForNameByDutysAO.do"},
    queryUserForNameByDutysAODept: {url: "queryUserForNameByDutysAODept.do"},
    addUser: {url: "addUser.do", server: "communionServer"},
    saveUserForBaseInfo: {url: "saveUserForBaseInfo.do", server: "communionServer"},
    updateUser: {url: "updateUser.do", server: "communionServer"},
    updateUserForAdvance: {url: "updateUserForAdvance.do", server: "communionServer"},
    resetPassword: {url: "resetPassword.do", server: "communionServer"},
    changePassword: {url: "changePassword.do", server: "communionServer"},
    deleteUserByIds: {url: "deleteUserByIds.do", server: "communionServer"},

    pageUserContractByUserId: {url: "pageUserContractByUserId.do"},
    addUserContract: {url: "addUserContract.do", server: "communionServer"},
    updateUserContract: {url: "updateUserContract.do", server: "communionServer"},
    deleteUserContract: {url: "deleteUserContract.do", server: "communionServer"},

    pageUserExperienceByUserId: {url: "pageUserExperienceByUserId.do"},
    addUserExperience: {url: "addUserExperience.do", server: "communionServer"},
    updateUserExperience: {url: "updateUserExperience.do", server: "communionServer"},
    deleteUserExperience: {url: "deleteUserExperience.do", server: "communionServer"},

    pageUserSalary: {url: "pageUserSalary.do"},
    pageUserSalaryByUserId: {url: "pageUserSalaryByUserId.do"},
    addUserSalary: {url: "addUserSalary.do"},
    updateUserSalary: {url: "updateUserSalary.do"},
    deleteUserSalary: {url: "deleteUserSalary.do"}
}});
