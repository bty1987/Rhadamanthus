
$.extend(api.index, {
    cityIndex: {url: "/views/system/city.html"},
    cityProperIndex: {url: "/views/system/cityProper.html"},
    regionIndex: {url: "/views/system/region.html"},
    roleIndex: {url: "/views/system/role.html"},
    roleActionIndex: {url: "/views/system/roleRight.html"},
    subFunctionActionIndex: {url: "/views/system/subFunctionAction.html"},
    userProfile: {url: "/views/system/userProfile.html"},
    changePasswordIndex: {url: "/views/system/changePassword.html"},
    resetPasswordIndex: {url: "/views/system/resetPassword.html"},
    versionIndex: {url: "/version.html"},
    faqIndex: {url: "/faq.html"},
    homeIndex:{url: "/home.html"}
});

$.extend(api, {system: {
    pageCity: {url: "pageCity.do", demo: true},
    queryCity: {url: "queryCity.do", demo: true},
    queryCityById: {url: "queryCityById.do"},
    queryCityByRegionId: {url: "queryCityByRegionId.do", demo: true},
    addCity: {url: "addCity.do", server: "communion"},
    updateCity: {url: "updateCity.do", server: "communion"},
    deleteCityByIds: {url: "deleteCityByIds.do", server: "communion"},

    pageCityProper: {url: "pageCityProper.do", demo: true},
    queryCityProper: {url: "queryCityProper.do"},
    queryCityProperById: {url: "queryCityProperById.do"},
    queryCityProperByCityId: {url: "queryCityProperByCityId.do", demo: true},
    addCityProper: {url: "addCityProper.do", server: "communion"},
    updateCityProper: {url: "updateCityProper.do", server: "communion"},
    deleteCityProper: {url: "deleteCityProper.do", server: "communion"},

    pageRegion: {url: "pageRegion.do", demo: true},
    queryRegion: {url: "queryRegion.do", demo: true},
    queryRegionById: {url: "queryRegionById.do"},
    addRegion: {url: "addRegion.do", server: "communion"},
    updateRegion: {url: "updateRegion.do", server: "communion"},
    deleteRegion: {url: "deleteRegion.do", server: "communion"},

    pageRole: {url: "pageRole.do", demo: true},
    queryRole: {url: "queryRole.do", demo: true},
    queryRoleById: {url: "queryRoleById.do"},
    queryRoleByName: {url: "queryRoleByName.do"},
    addRole: {url: "addRole.do", server: "communion"},
    updateRole: {url: "updateRole.do", server: "communion"},
    deleteRoleByIds: {url: "deleteRoleByIds.do", server: "communion"},

    queryModule: {url: "queryModule.do", demo: true},
    queryModuleForLogin: {url: "queryModuleForLogin.do", demo: true},
    queryModuleByUserId: {url: "queryModuleByUserId.do", demo: true},
    queryModuleByRoleId: {url: "queryModuleByRoleId.do", demo: true},
    addModule: {url: "addModule.do", server: "communion"},
    updateRoleModuleByRoleId: {url: "updateRoleModuleByRoleId.do", server: "communion"},
    deleteModule: {url: "deleteModule.do", server: "communion"},

    queryOperation: {url: "queryOperation.do", demo: true},
    queryOperationForLogin: {url: "queryOperationForLogin.do", demo: true},
    queryOperationByUserId: {url: "queryOperationByUserId.do", demo: true},
    queryOperationByRoleId: {url: "queryOperationByRoleId.do", demo: true},
    addOperation: {url: "addOperation.do", server: "communion"},
    updateRoleOperationByRoleId: {url: "updateRoleOperationByRoleId.do", server: "communion"},
    updateRoleOperationByUserId: {url: "updateRoleOperationByUserId.do", server: "communion"},
    deleteOperation: {url: "deleteOperation.do", server: "communion"},

    queryFunctionByModuleId: {url: "queryFunctionByModuleId.do", demo: true},

    queryRoleRight: {url: "queryRoleRight.do", demo: true},
    updateRoleRight: {url: "updateRoleRight.do", server: "communion"},

    querySubFunctionByFunctionId: {url: "querySubFunctionByFunctionId.do", demo: true},
    querySubFunctionLikeName: {url: "querySubFunctionLikeName.do"},

    pageSubFunctionAction: {url: "pageSubFunctionAction.do", demo: true},
    querySubFunctionActionByName: {url: "querySubFunctionActionByName.do"},
    addSubFunctionAction: {url: "addSubFunctionAction.do", server: "communion"},
    updateSubFunctionAction: {url: "updateSubFunctionAction.do", server: "communion"},
    deleteSubFunctionAction: {url: "deleteSubFunctionAction.do", server: "communion"},

    pageApproveUser: {url: "pageApproveUser.do", demo: true},
    queryApproveUserForNameByType: {url: "queryApproveUserForNameByType.do"},
    addApproveUser: {url: "addApproveUser.do"},
    updateApproveUser: {url: "updateApproveUser.do"},
    deleteApproveUser: {url: "deleteApproveUser.do"},

    pageSystemConfig: {url: "pageSystemConfig.do"},
    addSystemConfig:{url:"addSystemConfig.do", server: "communion"},
    deleteSystemConfig:{url:"deleteSystemConfig.do", server: "communion"},
    updateSystemConfig:{url:"updateSystemConfig.do"},

    pageDuty: {url: "pageDuty.do", demo: true},
    queryDuty: {url: "queryDuty.do"},
    addDuty: {url: "addDuty.do"},
    updateDuty: {url: "updateDuty.do"},
    updateDutyForStatus: {url: "updateDutyForStatus.do"},

    pageCompany: {url: "pageCompany.do", demo: true},
    queryCompany: {url: "queryCompany.do"},
    queryCompanyByCid: {url: "queryCompanyByCid.do"},
    addCompany: {url: "addCompany.do", server: "communion"},
    updateCompany: {url: "updateCompany.do", server: "communion"},
    updateCompanyForStatus: {url: "updateCompanyForStatus.do", server: "communion"}

}});
