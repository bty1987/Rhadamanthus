
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
    faqIndex: {url: "/faq.html"}
});

$.extend(api.ds, {
    companyType: {url: "ds/companyType.json", demo: true},
    workType: {url: "ds/workType.json", demo: true}
});

$.extend(api, {system: {
    pageCity: {url: "pageCity.do", demo: true},
    queryCity: {url: "queryCity.do", demo: true},
    queryCityById: {url: "queryCityById.do"},
    queryCityByRegionId: {url: "queryCityByRegionId.do", demo: true},
    addCity: {url: "addCity.do", server: "communionServer"},
    updateCity: {url: "updateCity.do", server: "communionServer"},
    deleteCityByIds: {url: "deleteCityByIds.do", server: "communionServer"},

    pageCityProper: {url: "pageCityProper.do", demo: true},
    queryCityProper: {url: "queryCityProper.do"},
    queryCityProperById: {url: "queryCityProperById.do"},
    queryCityProperByCityId: {url: "queryCityProperByCityId.do", demo: true},
    addCityProper: {url: "addCityProper.do", server: "communionServer"},
    updateCityProper: {url: "updateCityProper.do", server: "communionServer"},
    deleteCityProper: {url: "deleteCityProper.do", server: "communionServer"},

    pageRegion: {url: "pageRegion.do", demo: true},
    queryRegion: {url: "queryRegion.do", demo: true},
    queryRegionById: {url: "queryRegionById.do"},
    addRegion: {url: "addRegion.do", server: "communionServer"},
    updateRegion: {url: "updateRegion.do", server: "communionServer"},
    deleteRegion: {url: "deleteRegion.do", server: "communionServer"},

    pageRole: {url: "pageRole.do", demo: true},
    queryRole: {url: "queryRole.do", demo: true},
    queryRoleById: {url: "queryRoleById.do"},
    queryRoleByName: {url: "queryRoleByName.do"},
    addRole: {url: "addRole.do", server: "communionServer"},
    updateRole: {url: "updateRole.do", server: "communionServer"},
    deleteRoleByIds: {url: "deleteRoleByIds.do", server: "communionServer"},

    queryModule: {url: "queryModule.do", demo: true},
    queryModuleForLogin: {url: "queryModuleForLogin.do", demo: true},
    queryModuleByUserId: {url: "queryModuleByUserId.do", demo: true},
    queryModuleByRoleId: {url: "queryModuleByRoleId.do", demo: true},
    addModule: {url: "addModule.do", server: "communionServer"},
    updateRoleModuleByRoleId: {url: "updateRoleModuleByRoleId.do", server: "communionServer"},
    deleteModule: {url: "deleteModule.do", server: "communionServer"},

    queryOperation: {url: "queryOperation.do", demo: true},
    queryOperationForLogin: {url: "queryOperationForLogin.do", demo: true},
    queryOperationByUserId: {url: "queryOperationByUserId.do", demo: true},
    queryOperationByRoleId: {url: "queryOperationByRoleId.do", demo: true},
    addOperation: {url: "addOperation.do", server: "communionServer"},
    updateRoleOperationByRoleId: {url: "updateRoleOperationByRoleId.do", server: "communionServer"},
    updateRoleOperationByUserId: {url: "updateRoleOperationByUserId.do", server: "communionServer"},
    deleteOperation: {url: "deleteOperation.do", server: "communionServer"},

    queryFunctionByModuleId: {url: "queryFunctionByModuleId.do", demo: true},

    queryRoleRight: {url: "queryRoleRight.do", demo: true},
    updateRoleRight: {url: "updateRoleRight.do", server: "communionServer"},

    querySubFunctionByFunctionId: {url: "querySubFunctionByFunctionId.do", demo: true},
    querySubFunctionLikeName: {url: "querySubFunctionLikeName.do"},

    pageSubFunctionAction: {url: "pageSubFunctionAction.do", demo: true},
    querySubFunctionActionByName: {url: "querySubFunctionActionByName.do"},
    addSubFunctionAction: {url: "addSubFunctionAction.do", server: "communionServer"},
    updateSubFunctionAction: {url: "updateSubFunctionAction.do", server: "communionServer"},
    deleteSubFunctionAction: {url: "deleteSubFunctionAction.do", server: "communionServer"},

    pageApproveUser: {url: "pageApproveUser.do", demo: true},
    queryApproveUserForNameByType: {url: "queryApproveUserForNameByType.do"},
    addApproveUser: {url: "addApproveUser.do"},
    updateApproveUser: {url: "updateApproveUser.do"},
    deleteApproveUser: {url: "deleteApproveUser.do"}
}});
