$.extend(api.index, {
    userIndex: {
        url: "/views/personnel/user.html"
    },
    user4condition: {
        url: "/views/personnel/user4condition.html"
    },
    userViewIndex: {
        url: "/views/personnel/user4view.html"
    },
    userEditIndex: {
        url: '/views/personnel/user2edit.html'
    },
    userEdit: {
        url: "/views/personnel/userEdit.html"
    },
    userDetail: {
        url: "/views/personnel/userDetail.html"
    },
    userContractIndex: {
        url: "/views/personnel/userContract.html"
    },
    userContract4create: {
        url: "/views/personnel/userContract4create.html"
    },
    userExperienceIndex: {
        url: "/views/personnel/userExperience.html"
    },
    userPrint: {
        url: "/views/personnel/userPrint.html"
    },
    userOutputIndex: {
        url: "/views/personnel/user2export.html"
    },
    department4condition: {
        url: "/views/personnel/department4condition.html"
    },
    dutment: {
        url: "/views/personnel/dutment.html"
    },
    selectRecruitment: {
        url: "/views/personnel/selectRecruitment.html"
    },
    updateRecruitment: {
        url: "/views/personnel/updateRecruitment.html"
    },
    recruitmentEducation: {
        url: "/views/personnel/recruitmentEducation.html"
    },
    recruitmentOperation: {
        url: "/views/personnel/recruitmentOperation.html"
    },
    userContract: {
        url: "/views/personnel/userContract.html"
    },
    userEducation: {
        url: "/views/personnel/userEducation.html"
    },
    userOperation: {
        url: "/views/personnel/userOperation.html"
    },
    userExperience: {
        url: "/views/personnel/userExperience.html"
    },
    macontrol: {
        url: "/views/personnel/macontrol.html"
    },
    supplierContract4create: {
        url: "/views/personnel/supplierContract4create.html"
    },
    supplierContractBrand: {
        url: "/views/personnel/supplierContractBrand.html"
    },
    supplierContractGoods: {
        url: "/views/personnel/supplierContractGoods.html"
    },
    supplierSignet: {
        url: "/views/data/supplierSignet.html"
    },
    userPartnerIndex: {
        url: '/views/personnel/userPartner.html'
    },
    departmentPartnerIndex: {
        url: '/views/personnel/departmentPartner.html'
    }
    
});

$.extend(api, {
    personel: {
        pageUser: {
            url: "pageUser.do",
            demo: true
        },
        pageUserInfo: {
            url: "pageUserInfo.do"
        },
        queryUserByLoginId: {
            url: "queryUserByLoginId.do"
        },
        pageUserByMid: {
            url: "pageUserByMid.do"
        },
        queryUserByUserId: {
            url: "queryUserByUserId.do",
            demo: true
        },
        queryUserInfoByUserId: {
            url: "queryUserInfoByUserId.do"
        },
        queryUserForSelfByUserId: {
            url: "queryUserForSelfByUserId.do",
            demo: true,
            server: "communion"
        },
        queryUserByOldUserId: {
            url: "queryUserByOldUserId.do"
        },
        queryUserByPinyin: {
            url: "queryUserByPinyin.do"
        },
        queryUserByUids: {
            url: "queryUserByUids.do"
        },
        addUser: {
            url: "addUser.do",
            server: "communion"
        },
        updateUserForBaseInfo: {
            url: "updateUserForBaseInfo.do",
            server: "communion"
        },
        updateUser: {
            url: "updateUser.do",
            server: "communion"
        },
        updateUserForProfile: {
            url: "updateUserForProfile.do",
            server: "communion"
        },

        updateUserForAdvance: {
            url: "updateUserForAdvance.do",
            server: "communion"
        },
        updateUserForPhoto: {
            url: "updateUserForPhoto.do",
            server: "communion"
        },
        quitUser: {
            url: "quitUser.do",
            server: "communion"
        },
        tranUser: {
            url: "tranUser.do",
            server: "communion"
        },
        resetPassword: {
            url: "resetPassword.do",
            server: "communion"
        },
        changePassword: {
            url: "changePassword.do",
            server: "communion"
        },
        defaultPassword: {
            url: "defaultPassword.do",
            server: "communion"
        },
        deleteUserByIds: {
            url: "deleteUserByIds.do",
            server: "communion"
        },

        queryUserPartner: {
            url: "queryUserPartner.do",
        },
        addUserPartner: {
            url: "addUserPartner.do",
            server: "communion"
        },
        deleteUserPartner: {
            url: "deleteUserPartner.do",
            server: "communion"
        },
        
        queryDepartmentPartner: {
            url: "queryDepartmentPartner.do",
        },
        addDepartmentPartner: {
            url: "addDepartmentPartner.do",
            server: "communion"
        },
        deleteDepartmentPartner: {
            url: "deleteDepartmentPartner.do",
            server: "communion"
        },

        pageUserContractByUserId: {
            url: "pageUserContractByUserId.do"
        },
        addUserContract: {
            url: "addUserContract.do",
            server: "communion"
        },
        updateUserContract: {
            url: "updateUserContract.do",
            server: "communion"
        },
        deleteUserContract: {
            url: "deleteUserContract.do",
            server: "communion"
        },
        queryUserContract: {
            url: "queryUserContract.do"
        },

        querySupplierContract: {
            url: "querySupplierContract.do"
        },
        viewSupplierContract: {
            url: "viewSupplierContract.do"
        },
        signSupplierContractForCompany: {
            url: "signSupplierContractForCompany.do",
            server: "communion"
        },
        signSupplierContractForSupplier: {
            url: "signSupplierContractForSupplier.do",
            server: "communion"
        },
        affixSupplierContract: {
            url: "affixSupplierContract.do",
            server: "communion"
        },
        expireSupplierContract: {
            url: "expireSupplierContract.do",
            server: "communion"
        },
        filingSupplierContract: {
            url: "filingSupplierContract.do",
            server: "communion"
        },
        addSupplierContract: {
            url: "addSupplierContract.do",
            server: "communion"
        },
        makeSupplierContract: {
            url: "makeSupplierContract.do",
            server: "communion"
        },
        updateSupplierContract: {
            url: "updateSupplierContract.do",
            server: "communion"
        },
        deleteSupplierContract: {
            url: "deleteSupplierContract.do",
            server: "communion"
        },

        queryUserEducation: {
            url: "queryUserEducation.do"
        },
        addUserEducation: {
            url: "addUserEducation.do",
            server: "communion"
        },
        updateUserEducation: {
            url: "updateUserEducation.do",
            server: "communion"
        },
        deleteUserEducation: {
            url: "deleteUserEducation.do",
            server: "communion"
        },

        queryUserLabelByUid: {
            url: "queryUserLabelByUid.do"
        },
        queryUserOperation: {
            url: "queryUserOperation.do"
        },
        addUserOperation: {
            url: "addUserOperation.do",
            server: "communion"
        },
        updateUserOperation: {
            url: "updateUserOperation.do",
            server: "communion"
        },
        deleteUserOperation: {
            url: "deleteUserOperation.do",
            server: "communion"
        },

        queryUserExperienceByUid: {
            url: "queryUserExperienceByUid.do"
        },

        pageUserSalary: {
            url: "pageUserSalary.do"
        },
        pageUserSalaryByUserId: {
            url: "pageUserSalaryByUserId.do"
        },
        addUserSalary: {
            url: "addUserSalary.do"
        },
        updateUserSalary: {
            url: "updateUserSalary.do"
        },
        deleteUserSalary: {
            url: "deleteUserSalary.do"
        },

        queryUserCompany: {
            url: "queryUserCompany.do"
        },
        queryUserCompanyForSelf: {
            url: "queryUserCompanyForSelf.do"
        },
        updateUserCompany: {
            url: "updateUserCompany.do",
            server: "communion"
        },

        PageUserRequire: {
            url: "pageUserRequire.do"
        },
        addUserRequire: {
            url: "addUserRequire.do",
            server: "communion"
        },
        approveUserRequire: {
            url: "approveUserRequire.do",
            server: "communion"
        },
        finishUserRequire: {
            url: "finishUserRequire.do",
            server: "communion"
        },
        refuseUserRequire: {
            url: "refuseUserRequire.do",
            server: "communion"
        },

        pagePerformance: {
            url: "pagePerformance.do"
        },
        addPreformance: {
            url: "addPreformance.do",
            server: "communion"
        },

        pageSupplier: {
            url: "pageSupplier.do"
        },
        querySupplierByPinyin: {
            url: "querySupplierByPinyin.do"
        },
        addSupplier: {
            url: "addSupplier.do",
            server: "communion"
        },
        updateSupplier: {
            url: "updateSupplier.do",
            server: "communion"
        },

        pageInstorer: {
            url: "pageInstorer.do"
        },
        queryInstorerByPinyin: {
            url: "queryInstorerByPinyin.do"
        },
        addInstorer: {
            url: "addInstorer.do",
            server: "communion"
        },
        updateInstorer: {
            url: "updateInstorer.do",
            server: "communion"
        },

        queryMacontrol: {
            url: "queryMacontrol.do"
        },
        checkMacontrol: {
            url: "checkMacontrol.do",
            server: "communion"
        },
        addMacontrol: {
            url: "addMacontrol.do",
            server: "communion"
        },
        deleteMacontrol: {
            url: "deleteMacontrol.do",
            server: "communion"
        },
        queryAttendance: {
            url: "queryAttendance.do"
        },
        reportAttendance: {
            url: "reportAttendance.do"
        },

        queryDutmentByDeid: {
            url: "queryDutmentByDeid.do"
        },
        queryDutmentByDuid: {
            url: "queryDutmentByDuid.do"
        },
        addDutment: {
            url: "addDutment.do",
            server: "communion"
        },
        updateDutment: {
            url: "updateDutment.do",
            server: "communion"
        },
        deleteDutment: {
            url: "deleteDutment.do",
            server: "communion"
        },
        updateUserExperience: {
            url: "updateUserExperience.do",
            server: "communion"
        },

        pageAvenger: {
            url: "pageAvenger.do"
        },
        queryAvengerByPinyin: {
            url: "queryAvengerByPinyin.do"
        },

        pageMerchant: {
            url: "pageMerchant.do"
        },
        queryMerchantByPinyin: {
            url: "queryMerchantByPinyin.do"
        },

        pageRecruitment: {
            url: "pageRecruitment.do"
        },
        addRecruitment: {
            url: "addRecruitment.do"
        },
        queryRecruitmentByRid: {
            url: "queryRecruitmentByRid.do"
        },
        checkRecruitment: {
            url: "checkRecruitment.do"
        },
        updateRecruitment: {
            url: "updateRecruitment.do"
        },
        updateRecruitmentForAdvance: {
            url: "updateRecruitmentForAdvance.do"
        },
        entryRecruitment: {
            url: "entryRecruitment.do"
        },
        cancelRecruitment: {
            url: "cancelRecruitment.do"
        },

        addRecruitmentEducation: {
            url: "addRecruitmentEducation.do"
        },
        queryRecruitmentEducation: {
            url: "queryRecruitmentEducation.do"
        },
        updateRecruitmentEducation: {
            url: "updateRecruitmentEducation.do"
        },
        deleteRecruitmentEducation: {
            url: "deleteRecruitmentEducation.do"
        },

        addRecruitmentOperation: {
            url: "addRecruitmentOperation.do"
        },
        queryRecruitmentOperation: {
            url: "queryRecruitmentOperation.do"
        },
        updateRecruitmentOperation: {
            url: "updateRecruitmentOperation.do"
        },
        deleteRecruitmentOperation: {
            url: "deleteRecruitmentOperation.do"
        },

        queryUserRole: {
            url: "queryUserRole.do"
        },
        updateUserRole: {
            url: "updateUserRole.do",
            server: "communion"
        },

        registUser: {
            url: "registUser.do",
            server: "communion"
        },
        resetUser: {
            url: "resetUser.do",
            server: "communion"
        },
        authUser: {
            url: "authUser.do",
            server: "communion"
        },
        confirmUser: {
            url: "confirmUser.do",
            server: "communion"
        },
        signateUser: {
            url: "signateUser.do",
            server: "communion"
        },

        sendUserContractForAuth: {
            url: "sendUserContractForAuth.do"
        },
        sendUserContract: {
            url: "sendUserContract.do"
        },
        redirectUserContract: {
            url: "redirectUserContract.do"
        },
        viewUserContract: {
            url: "viewUserContract.do"
        },
        signUserContractForCompany: {
            url: "signUserContractForCompany.do",
            server: "communion"
        },
        signUserContractForUser: {
            url: "signUserContractForUser.do",
            server: "communion"
        },
        affixUserContract: {
            url: "affixUserContract.do",
            server: "communion"
        },
        expireUserContract: {
            url: "expireUserContract.do",
            server: "communion"
        },
        filingUserContract: {
            url: "filingUserContract.do",
            server: "communion"
        },
        queryUserFunction: {
            url: "queryUserFunction.do"
        },
        pageSupplierContractBrand: {
            url: "pageSupplierContractBrand.do",
            type: "query",
            tranargs: [{
                result: "supplierContractBrand",
                args: ["cvalue", "breakpay"]
            }]
        },
        querySupplierContractBrand: {
            url: "querySupplierContractBrand.do",
            type: "query",
            tranargs: [{
                result: "supplierContractBrand",
                args: ["cvalue", "breakpay"]
            }]
        },
        addSupplierContractBrand: {
            url: "addSupplierContractBrand.do"
        },
        deleteSupplierContractBrand: {
            url: "deleteSupplierContractBrand.do"
        },
        updateSupplierContractBrand: {
            url: "updateSupplierContractBrand.do"
        },
        pageSupplierContractGoods: {
            url: "pageSupplierContractGoods.do"
        },
        querySupplierContractGoods: {
            url: "querySupplierContractGoods.do"
        },
        addSupplierContractGoods: {
            url: "addSupplierContractGoods.do"
        },
        deleteSupplierContractGoods: {
            url: "deleteSupplierContractGoods.do"
        }

    }
});

$.extend(tools, {
    personel: {
        info: function(content, userId) {

            com.post(api.personel.queryUserByUserId, {
                "user.userId": userId
            }, function(res) {

                var user = res.user;

                com.showTip(content, "编号:" + user.userId + "<br\>姓名:" + user.currentName + "<br\>部门:" + user.dept.name, "bottom");
            });
        }
    }
});
