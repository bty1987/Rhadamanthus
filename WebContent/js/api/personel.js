
$.extend(api.index, {
    userIndex: {url: "/views/personnel/user.html"},
    userEditIndex: {url: '/views/personnel/userEdit.html'},
    userContractIndex: {url: "/views/personnel/userContract.html"},
    userExperienceIndex: {url: "/views/personnel/userExperience.html"}
});

$.extend(api, {personel: {
    pageUser: {url: "pageUser.do", demo: true},
    queryUserByLoginId: {url: "queryUserByLoginId.do"},
    queryUserByUserId: {url: "queryUserByUserId.do", demo: true},
    queryUserInfoByUserId: {url: "queryUserInfoByUserId.do",},
    queryUserForSelfByUserId: {url: "queryUserForSelfByUserId.do", demo: true ,server:"communion"},
    queryUserByOldUserId: {url: "queryUserByOldUserId.do"},
    queryUserByPinyin: {url: "queryUserByPinyin.do"},
    queryUserByUids:{url:"queryUserByUids.do" },
    addUser: {url: "addUser.do", server: "communion"},
    updateUserForBaseInfo: {url: "updateUserForBaseInfo.do", server: "communion"},
    updateUser: {url: "updateUser.do", server: "communion"},
    updateUserForProfiles: {url: "updateUserForProfiles.do" ,server: "communion"},
    
    updateUserForAdvance: {url: "updateUserForAdvance.do", server: "communion"},
    resetPassword: {url: "resetPassword.do", server: "communion"},
    changePassword: {url: "changePassword.do", server: "communion"},
    defaultPassword: {url: "defaultPassword.do", server: "communion"},
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

    PageUserRequire:{url: "pageUserRequire.do"},
    addUserRequire:{url: "addUserRequire.do", server: "communion"},
    approveUserRequire:{url: "approveUserRequire.do", server: "communion"},
    finishUserRequire:{url: "finishUserRequire.do", server: "communion"},
    refuseUserRequire:{url: "refuseUserRequire.do", server: "communion"},

    pagePerformance:{url: "pagePerformance.do"},
    addPreformance:{url: "addPreformance.do", server: "communion"}

}});
