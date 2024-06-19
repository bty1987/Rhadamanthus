$.extend(api.index, {
    cityIndex: {
        url: "/views/system/city.html"
    },
    cityProperIndex: {
        url: "/views/system/cityProper.html"
    },
    regionIndex: {
        url: "/views/system/region.html"
    },
    roleIndex: {
        url: "/views/system/role.html"
    },
    roleActionIndex: {
        url: "/views/system/roleRight.html"
    },
    subFunctionActionIndex: {
        url: "/views/system/subFunctionAction.html"
    },
    userProfile: {
        url: "/views/system/userProfile.html"
    },
    changePasswordIndex: {
        url: "/views/system/password2change.html"
    },
    resetPasswordIndex: {
        url: "/views/system/password2reset.html"
    },
    versionIndex: {
        url: "/version.html"
    },
    faqIndex: {
        url: "/faq.html"
    },
    homeIndex: {
        url: "/home-antv.html"
    },
    companyConfig: {
        url: "/views/system/companyConfig.html"
    },
    license: {
        url: "/license.html"
    },
    roleModule: {
        url: "/views/system/module4role.html"
    },
    userModule: {
        url: "/views/system/module4user.html"
    }
});

$.extend(api, {
    system: {
        pageCity: {
            url: "pageCity.do",
            demo: true
        },
        queryCity: {
            url: "queryCity.do",
            demo: true
        },
        queryCityByCid: {
            url: "queryCityByCid.do"
        },
        queryCityByRid: {
            url: "queryCityByRid.do",
            demo: true
        },
        addCity: {
            url: "addCity.do",
            server: "communion"
        },
        updateCity: {
            url: "updateCity.do",
            server: "communion"
        },
        updateCityForPosition: {
            url: "updateCityForPosition.do",
            server: "communion"
        },

        deleteCity: {
            url: "deleteCity.do",
            server: "communion"
        },

        pageCityProper: {
            url: "pageCityProper.do",
            demo: true
        },
        queryCityProper: {
            url: "queryCityProper.do"
        },
        queryCityProperByCpid: {
            url: "queryCityProperByCpid.do"
        },
        queryCityProperByCid: {
            url: "queryCityProperByCid.do",
            demo: true
        },
        addCityProper: {
            url: "addCityProper.do",
            server: "communion"
        },
        updateCityProper: {
            url: "updateCityProper.do",
            server: "communion"
        },
        updateCityProperForPosition: {
            url: "updateCityProperForPosition.do",
            server: "communion"
        },
        deleteCityProper: {
            url: "deleteCityProper.do",
            server: "communion"
        },

        pageRegion: {
            url: "pageRegion.do",
            demo: true
        },
        queryRegion: {
            url: "queryRegion.do",
            demo: true
        },
        queryRegionByRid: {
            url: "queryRegionByRid.do"
        },
        addRegion: {
            url: "addRegion.do",
            server: "communion"
        },
        updateRegion: {
            url: "updateRegion.do",
            server: "communion"
        },
        deleteRegion: {
            url: "deleteRegion.do",
            server: "communion"
        },

        pageRole: {
            url: "pageRole.do",
            demo: true
        },
        pageRoleByMid: {
            url: "pageRoleByMid.do",
            demo: true
        },
        queryRole: {
            url: "queryRole.do",
            demo: true
        },
        queryRoleById: {
            url: "queryRoleById.do"
        },
        queryRoleByName: {
            url: "queryRoleByName.do"
        },
        addRole: {
            url: "addRole.do",
            server: "communion"
        },
        updateRole: {
            url: "updateRole.do",
            server: "communion"
        },
        deleteRoleByRid: {
            url: "deleteRoleByRid.do",
            server: "communion"
        },
        pageModule: {
            url: "pageModule.do",
            demo: true
        },
        queryModule: {
            url: "queryModule.do",
            demo: true
        },
        queryModuleForLogin: {
            url: "queryModuleForLogin.do",
            demo: true
        },
        queryModuleForLink: {
            url: "queryModuleForLink.do",
            demo: true
        },
        queryModuleByUserId: {
            url: "queryModuleByUserId.do",
            demo: true
        },
        queryModuleByRid: {
            url: "queryModuleByRid.do",
            demo: true
        },
        queryModuleByFatherModule: {
            url: "queryModuleByFatherModule.do",
            demo: true
        },
        checkModule: {
            url: "checkModule.do",
            demo: true,
            intercept: true,
        },
        addModule: {
            url: "addModule.do",
            server: "communion"
        },
        updateRoleModuleByRid: {
            url: "updateRoleModuleByRid.do",
            server: "communion"
        },
        deleteModule: {
            url: "deleteModule.do",
            server: "communion"
        },

        queryOperation: {
            url: "queryOperation.do",
            demo: true
        },
        pageOperation: {
            url: "pageOperation.do",
            demo: true
        },
        queryOperationForLogin: {
            url: "queryOperationForLogin.do",
            demo: true
        },
        queryOperationByUserId: {
            url: "queryOperationByUserId.do",
            demo: true
        },
        queryOperationByRid: {
            url: "queryOperationByRid.do",
            demo: true
        },
        addOperation: {
            url: "addOperation.do",
            server: "communion"
        },
        updateOpperation: {
            url: "updateOpperation.do",
            server: "communion"
        },
        updateRoleOperation: {
            url: "updateRoleOperation.do",
            server: "communion",
            intercept: true,
        },
        updateRoleOperationByRid: {
            url: "updateRoleOperationByRid.do",
            server: "communion"
        },
        updateRoleOperationByUserId: {
            url: "updateRoleOperationByUserId.do",
            server: "communion"
        },
        deleteOperation: {
            url: "deleteOperation.do",
            server: "communion"
        },
        deleteRoleOperation: {
            url: "deleteRoleOperation.do",
            server: "communion",
            intercept: true,
        },

        queryFunctionByModuleId: {
            url: "queryFunctionByModuleId.do",
            demo: true
        },

        queryRoleRight: {
            url: "queryRoleRight.do",
            demo: true
        },
        updateRoleRight: {
            url: "updateRoleRight.do",
            server: "communion"
        },

        querySubFunctionByFunctionId: {
            url: "querySubFunctionByFunctionId.do",
            demo: true
        },
        querySubFunctionLikeName: {
            url: "querySubFunctionLikeName.do"
        },

        pageSubFunctionAction: {
            url: "pageSubFunctionAction.do",
            demo: true
        },
        querySubFunctionActionByName: {
            url: "querySubFunctionActionByName.do"
        },
        addSubFunctionAction: {
            url: "addSubFunctionAction.do",
            server: "communion"
        },
        updateSubFunctionAction: {
            url: "updateSubFunctionAction.do",
            server: "communion"
        },
        deleteSubFunctionAction: {
            url: "deleteSubFunctionAction.do",
            server: "communion"
        },

        pageApproveUser: {
            url: "pageApproveUser.do",
            demo: true
        },
        queryApproveUserForNameByType: {
            url: "queryApproveUserForNameByType.do"
        },
        addApproveUser: {
            url: "addApproveUser.do"
        },
        updateApproveUser: {
            url: "updateApproveUser.do"
        },
        deleteApproveUser: {
            url: "deleteApproveUser.do"
        },

        pageSystemConfig: {
            url: "pageSystemConfig.do"
        },
        querySystemConfigByCid: {
            url: "querySystemConfigByCid.do"
        },
        querySystemConfigByKey: {
            url: "querySystemConfigByKey.do"
        },
        addSystemConfig: {
            url: "addSystemConfig.do",
            server: "communion"
        },
        deleteSystemConfig: {
            url: "deleteSystemConfig.do",
            server: "communion"
        },
        updateSystemConfig: {
            url: "updateSystemConfig.do",
            server: "communion"
        },

        pageDuty: {
            url: "pageDuty.do",
            demo: true
        },
        queryDuty: {
            url: "queryDuty.do"
        },
        addDuty: {
            url: "addDuty.do",
            server: "communion"
        },
        updateDuty: {
            url: "updateDuty.do",
            server: "communion"
        },
        updateDutyForStatus: {
            url: "updateDutyForStatus.do",
            server: "communion"
        },
        queryDutyByDtid: {
            url: "queryDutyByDtid.do"
        },
        queryDutyByName: {
            url: "queryDutyByName.do"
        },

        pageCompany: {
            url: "pageCompany.do",
            demo: true
        },
        queryCompany: {
            url: "queryCompany.do"
        },
        queryCompanyByCid: {
            url: "queryCompanyByCid.do"
        },
        addCompany: {
            url: "addCompany.do",
            server: "communion"
        },
        updateCompany: {
            url: "updateCompany.do",
            server: "communion"
        },
        updateCompanyForStatus: {
            url: "updateCompanyForStatus.do",
            server: "communion"
        },

        queryServer: {
            url: "queryServer.do",
            server: "communion"
        },

        pageOrganization: {
            url: "pageOrganization.do",
            server: "communion"
        },
        updateOrganization: {
            url: "updateOrganization.do",
            server: "communion"
        },
        updateOrganizationForStatus: {
            url: "updateOrganizationForStatus.do",
            server: "communion"
        },
        queryOrganization: {
            url: "queryOrganization.do"
        },
        addOrganization: {
            url: "addOrganization.do",
            server: "communion"
        },
        queryOperationForSelf: {
            url: "queryOperationForSelf.do"
        },
    }
});

$.extend(api, {
    upgrade: {

        pageUpgrade: {
            url: "pageUpgrade.do"
        },
        queryUpgrade: {
            url: "queryUpgrade.do"
        },
        matchUpgrade: {
            url: "matchUpgrade.do",
            intercept: true
        },
        addUpgrade: {
            url: "addUpgrade.do",
            server: "communion"
        },
        updateUpgradeForStatus: {
            url: "updateUpgradeForStatus.do",
            server: "communion"
        },
        deleteUpgrade: {
            url: "deleteUpgrade.do",
            server: "communion"
        },
        pageVersion: {
            url: "pageVersion.do"
        },
        queryVersion: {
            url: "queryVersion.do"
        },
        addVersion: {
            url: "addVersion.do",
            server: "communion"
        },
        updateVersion: {
            url: "updateVersion.do",
            server: "communion"
        },
        updateVersionForStatus: {
            url: "updateVersionForStatus.do",
            server: "communion"
        },
        deleteVersion: {
            url: "deleteVersion.do",
            server: "communion"
        }
    }
});

$.extend(api, {
    home: {
        library: {
            url: "library",
            server: "library",
            intercept: true
        }
    }
});
