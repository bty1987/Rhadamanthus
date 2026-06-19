$.extend(api.index, {
    vustomer: {
        url: "/views/customer/vustomer.html"
    },
    vrecord: {
        url: "/views/customer/vrecord.html"
    },
    vscoreRecord: {
        url: "/views/customer/vscoreRecord.html"
    },
    vustomerAdvance: {
        url: "/views/customer/vustomerAdvance.html"
    },
    crowd: {
        url: "/views/customer/crowd.html"
    },
    repair: {
        url: "/views/customer/repair.html"
    },
    repairPay: {
        url: "/views/customer/repairPay.html"
    },
    complaint: {
        url: "/views/customer/complaint.html"
    },
    crowdUser: {
        url: "/views/customer/crowdUser.html"
    },
    customerOriginRecord: {
        url: "/views/customer/customerOrigineRecord.html"
    },
    customerUserRuleItem: {
        url: "/views/customer/customerUserRuleItem.html"
    },
    feedRecord: {
        url: "/views/customer/feedbackRecord.html"
    },
    feedComplaint: {
        url: "/views/customer/feedbackComplaint.html"
    },
    feedbackGuarantee: {
        url: "/views/customer/feedbackGuarantee.html"
    },
    customerCompanyRule: {
        url: "/views/customer/customerCompanyRule.html"
    },
    customerCityProperRule: {
        url: "/views/customer/customerCityProperRule.html"
    },
    customerprofile: {
        url: "/views/customer/customerProfile.html"
    },
    customerProfile4detailIndex: {
        url: "/views/customer/customerProfile4detail.html"
    },
    feedbackGuarantee2edit: {
        url: "/views/customer/feedbackGuarantee2edit.html"
    },
});

$.extend(api, {
    customer: {
        pageVustomer: {
            url: "pageVustomer.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["contractPrice"]
            }]
        },
        queryVustomerByUnionId: {
            url: "queryVustomerByUnionId.do",
            type: "query",
            tranargs: [{
                result: "vustomers",
                args: ["contractPrice"]
            }]
        },
        addVustomer: {
            url: "addVustomer.do",
            type: "update",
            tranargs: {
                args: ["vustomer.contractPrice"]
            }
        },
        updateVustomer: {
            url: "updateVustomer.do",
            type: "update",
            tranargs: {
                args: ["vustomer.contractPrice"]
            }
        },
        deleteVustomer: {
            url: "deleteVustomer.do"
        },
        pageVrecord: {
            url: "pageVrecord.do"
        },
        queryVrecordByVid: {
            url: "queryVrecordByVid.do"
        },
        addVrecord: {
            url: "addVrecord.do"
        },

        pageCustomerOrigin: {
            url: "pageCustomerOrigin.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["buildArea", "freeArea", "totalArea", "innerArea"]
            }]
        },
        pageCustomerOriginForAdvance: {
            url: "pageCustomerOriginForAdvance.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["buildArea", "freeArea", "totalArea", "innerArea"]
            }]
        },
        queryCustomerOriginByCsid: {
            url: "queryCustomerOriginByCsid.do",
            type: "query",
            tranargs: [{
                result: "customerOrigin",
                args: ["buildArea", "freeArea", "totalArea", "innerArea"]
            }]
        },
        addCustomerOrigin: {
            url: "addCustomerOrigin.do",
            type: "update",
            tranargs: {
                args: ["customerOrigin.buildArea", "customerOrigin.freeArea", "customerOrigin.totalArea", "customerOrigin.innerArea"]
            }
        },
        updateCustomerOrigin: {
            url: "updateCustomerOrigin.do",
            type: "update",
            tranargs: {
                args: ["customerOrigin.buildArea", "customerOrigin.freeArea", "customerOrigin.totalArea", "customerOrigin.innerArea"]
            }
        },
        updateCustomerOriginForBelonger: {
            url: "updateCustomerOriginForBelonger.do"
        },
        freeCustomerOrigin: {
            url: "freeCustomerOrigin.do"
        },
        takeCustomerOrigin: {
            url: "takeCustomerOrigin.do"
        },
        bindCustomerOrigin: {
            url: "bindCustomerOrigin.do"
        },
        commitCustomerOrigin: {
            url: "commitCustomerOrigin.do"
        },
        confirmCustomerOrigin: {
            url: "confirmCustomerOrigin.do"
        },
        cancelCustomerOrigin: {
            url: "cancelCustomerOrigin.do"
        },
        approveCustomerOrigin: {
            url: "approveCustomerOrigin.do"
        },
        tranCustomerOrigin: {
            url: "tranCustomerOrigin.do"
        },

        queryCustomerOriginRecord: {
            url: "queryCustomerOriginRecord.do"
        },
        addCustomerOriginRecord: {
            url: "addCustomerOriginRecord.do"
        },

        queryCustomerOriginFunction: {
            url: "queryCustomerOriginFunction.do"
        },

        pageCustomerCompanyRule: {
            url: "pageCustomerCompanyRule.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["uppval", "lowval"]
            }]
        },
        queryCustomerCompanyRule: {
            url: "queryCustomerCompanyRule.do",
            type: "update",
            tranargs: {
                args: ["customerCompanyRule.uppval", "customerUserRuleItem.lowval"],
                query: [{
                    result: "customerCompanyRules",
                    args: ["uppval", "lowval"]
                }]
            }
        },
        addCustomerCompanyRule: {
            url: "addCustomerCompanyRule.do",
            type: "update",
            tranargs: {
                args: ["customerCompanyRule.uppval", "customerCompanyRule.lowval"]
            }
        },
        deleteCustomerCompanyRule: {
            url: "deleteCustomerCompanyRule.do",
            type: "update",
            tranargs: {
                args: ["customerCompanyRule.uppval", "customerCompanyRule.lowval"]
            }
        },

        pageCustomerCityProperRule: {
            url: "pageCustomerCityProperRule.do",
            type: "query"
        },
        queryCustomerCityProperRule: {
            url: "queryCustomerCityProperRule.do",
            type: "query"
        },
        addCustomerCityProperRule: {
            url: "addCustomerCityProperRule.do",
        },
        deleteCustomerCityProperRule: {
            url: "deleteCustomerCityProperRule.do",
        },
        updateCustomerCityProperRule: {
            url: "updateCustomerCityProperRule.do",
        },

        pageCustomerProtectRule: {
            url: "pageCustomerProtectRule.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["uppval", "lowval", "days"]
            }]
        },
        queryCustomerProtectRule: {
            url: "queryCustomerProtectRule.do",
            type: "query",
            tranargs: [{
                result: "customerProtectRules",
                args: ["uppval", "lowval", "days"]
            }]
        },
        checkCustomerProtectRule: {
            url: "checkCustomerProtectRule.do",
            type: "query",
            tranargs: [{
                result: "customerProtectRule",
                args: ["uppval", "lowval", "days"]
            }]
        },
        addCustomerProtectRule: {
            url: "addCustomerProtectRule.do",
            type: "update",
            tranargs: {
                args: ["customerProtectRule.uppval", "customerProtectRule.lowval", "customerProtectRule.days"]
            }
        },
        deleteCustomerProtectRule: {
            url: "deleteCustomerProtectRule.do"
        },

        pageCustomerDeptRule: {
            url: "pageCustomerDeptRule.do"
        },
        queryCustomerDeptRuleByDid: {
            url: "queryCustomerDeptRuleByDid.do"
        },
        queryCustomerDeptRuleByDbid: {
            url: "queryCustomerDeptRuleByDbid.do"
        },
        addCustomerDeptRule: {
            url: "addCustomerDeptRule.do"
        },
        deleteCustomerDeptRule: {
            url: "deleteCustomerDeptRule.do"
        },

        pageCustomerUserRule: {
            url: "pageCustomerUserRule.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["measureNum", "contractNum", "contractPrice", "materialPrice", "designPrice", "predisPrice", "score", "rank", "chance", "surplus", "polling"]
            }]
        },
        queryCustomerUserRule: {
            url: "queryCustomerUserRule.do",
            type: "query",
            tranargs: [{
                result: "customerUserRule",
                args: ["measureNum", "contractNum", "contractPrice", "materialPrice", "designPrice", "predisPrice", "score", "rank", "chance", "surplus", "polling"]
            }]
        },
        addCustomerUserRule: {
            url: "addCustomerUserRule.do",
            type: "update",
            tranargs: {
                args: ["customerUserRule.measureNum", "customerUserRule.contractNum", "customerUserRule.contractPrice", "customerUserRule.materialPrice", "customerUserRule.designPrice", "customerUserRule.predisPrice", "customerUserRule.score", "customerUserRule.rank", "customerUserRule.chance", "customerUserRule.surplus", "customerUserRule.polling"],
                query: [{
                    result: "customerUserRule",
                    args: ["measureNum", "contractNum", "contractPrice", "materialPrice", "designPrice", "predisPrice", "score", "rank", "chance", "surplus", "polling"]
                }]
            }
        },
        updateCustomerUserRule: {
            url: "updateCustomerUserRule.do",
            type: "update",
            tranargs: {
                args: ["customerUserRule.measureNum", "customerUserRule.contractNum", "customerUserRule.contractPrice", "customerUserRule.materialPrice", "customerUserRule.designPrice", "customerUserRule.predisPrice", "customerUserRule.score", "customerUserRule.rank", "customerUserRule.chance", "customerUserRule.surplus", "customerUserRule.polling"]
            }
        },
        updateCustomerUserRuleForStatus: {
            url: "updateCustomerUserRuleForStatus.do",
            type: "update",
            tranargs: {
                args: ["customerUserRule.measureNum", "customerUserRule.contractNum", "customerUserRule.contractPrice", "customerUserRule.materialPrice", "customerUserRule.designPrice", "customerUserRule.predisPrice", "customerUserRule.score", "customerUserRule.rank", "customerUserRule.chance", "customerUserRule.surplus", "customerUserRule.polling"]
            }
        },
        disableCustomerUserRule: {
            url: "disableCustomerUserRule.do"
        },
        disableCustomerUserRuleByCurid: {
            url: "disableCustomerUserRuleByCurid.do"
        },

        queryCustomerUserRuleItem: {
            url: "queryCustomerUserRuleItem.do",
            type: "query",
            tranargs: [{
                result: "customerUserRuleItems",
                args: ["uppval", "lowval", "chance"]
            }]
        },
        addCustomerUserRuleItem: {
            url: "addCustomerUserRuleItem.do",
            type: "update",
            tranargs: {
                args: ["customerUserRuleItem.uppval", "customerUserRuleItem.lowval", "customerUserRuleItem.chance"],
                query: [{
                    result: "customerUserRuleItem",
                    args: ["uppval", "lowval", "chance"]
                }]
            }
        },
        deleteCustomerUserRuleItem: {
            url: "deleteCustomerUserRuleItem.do"
        },
        queryCustomerUserRuleItemByPinyin: {
            url: "queryCustomerUserRuleItemByPinyin.do",
            type: "query"
        },

        pageCustomerSource: {
            url: "pageCustomerSource.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["buildArea", "freeArea", "totalArea", "innerArea"]
            }]
        },
        queryCustomerSource: {
            url: "queryCustomerSource.do",
            type: "query",
            tranargs: [{
                result: "customerSource",
                args: ["buildArea", "freeArea", "totalArea", "innerArea"]
            }]
        },
        addCustomerSource: {
            url: "addCustomerSource.do",
            type: "update",
            tranargs: {
                args: ["customerSource.buildArea", "customerSource.freeArea", "customerSource.totalArea", "customerSource.innerArea"],
                query: [{
                    result: "customerSource",
                    args: ["buildArea", "freeArea", "totalArea", "innerArea"]
                }]
            }
        },
        updateCustomerSource: {
            url: "updateCustomerSource.do",
            type: "update",
            tranargs: {
                args: ["customerSource.buildArea", "customerSource.freeArea", "customerSource.totalArea", "customerSource.innerArea"],
                query: [{
                    result: "customerSource",
                    args: ["buildArea", "freeArea", "totalArea", "innerArea"]
                }]
            }
        },
        updateCustomerSourceForStatus: {
            url: "updateCustomerSourceForStatus.do"
        },
        updateCustomerSourceForCustomer: {
            url: "updateCustomerSourceForCustomer.do"
        },
        updateCustomerSourceForHouse: {
            url: "updateCustomerSourceForHouse.do"
        },
        issueCustomerSource: {
            url: "issueCustomerSource.do"
        },
        pageCustomerSourceRecord: {
            url: "pageCustomerSourceRecord.do"
        },
        queryCustomerSourceRecord: {
            url: "queryCustomerSourceRecord.do"
        },

        pageCustomerNotice: {
            url: "pageCustomerNotice.do"
        },

        pageCustomerChance: {
            url: "pageCustomerChance.do",
            type: "query",
            tranargs: [{
                result: "paging-data-source",
                args: ["buildArea", "freeArea", "totalArea", "innerArea"]
            }, {
                result: "paging-data-source-house",
                args: ["buildArea", "freeArea", "totalArea", "innerArea"]
            }]
        },
        queryCustomerChanceByCcid: {
            url: "queryCustomerChanceByCcid.do",
            type: "query",
            tranargs: [{
                result: "source",
                args: ["buildArea", "freeArea", "totalArea", "innerArea"]
            }, {
                result: "paging-data-source-house",
                args: ["buildArea", "freeArea", "totalArea", "innerArea"]
            }]
        },
        updateCustomerChance: {
            url: "updateCustomerChance.do"
        },
        issueCustomerChance: {
            url: "issueCustomerChance.do"
        },
        disableCustomerChance: {
            url: "disableCustomerChance.do"
        },
        sendCustomerChance: {
            url: "sendCustomerChance.do"
        },
        confirmCustomerChance: {
            url: "confirmCustomerChance.do"
        },
        affirmCustomerChance: {
            url: "affirmCustomerChance.do"
        },
        changeCustomerChance: {
            url: "changeCustomerChance.do"
        },
        readCustomerChance: {
            url: "readCustomerChance.do"
        },
        configCustomerChance: {
            url: "configCustomerChance.do"
        },
        fineCustomerChance: {
            url: "fineCustomerChance.do"
        },
        finishCustomerChance: {
            url: "finishCustomerChance.do"
        },
        uncheckCustomerChance: {
            url: "uncheckCustomerChance.do"
        },
        tranCustomerChance: {
            url: "tranCustomerChance.do"
        },
        approveCustomerChance: {
            url: "approveCustomerChance.do"
        },

        pageCustomerProfile: {
            url: "pageCustomerProfile.do"
        },
        queryCustomerProfileByOrderId: {
            url: "queryCustomerProfileByOrderId.do"
        },
        queryCustomerProfileByCid: {
            url: "queryCustomerProfileByCid.do"
        },
        queryCustomerProfileByCsid: {
            url: "queryCustomerProfileByCsid.do"
        },
        queryCustomerProfileByCpid: {
            url: "queryCustomerProfileByCpid.do"
        },
        addCustomerProfile: {
            url: "addCustomerProfile.do"
        },
        handleCustomerProfile: {
            url: "handleCustomerProfile.do"
        },
        makeCustomerProfile: {
            url: "makeCustomerProfile.do"
        },
        pageVustomerByUnionId: {
            url: "pageVustomerByUnionId.do"
        },
        buildVustomerNet: {
            url: "buildVustomerNet.do"
        },
        countVustomerNetByUnionId: {
            url: "countVustomerNetByUnionId.do"
        },
        countVustomerByUnionId: {
            url: "countVustomerByUnionId.do"
        },
        queryVscoreByUnionId: {
            url: "queryVscoreByUnionId.do"
        },
        pageVscoreRecordByUnionId: {
            url: "pageVscoreRecordByUnionId.do"
        },
        raiseVscore: {
            url: "raiseVscore.do"
        },
        pickupVscore: {
            url: "pickupVscore.do"
        },
        updateVscoreRecordForStatus: {
            url: "updateVscoreRecordForStatus.do"
        },

        pageVustomerForAdvance: {
            url: "pageVustomerForAdvance.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["contractPrice"]
            }]
        },
        pageVustomerForCommunion: {
            url: "pageVustomerForCommunion.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["contractPrice"]
            }]
        },
        freeVustomer: {
            url: "freeVustomer.do"
        },
        takeVustomer: {
            url: "takeVustomer.do"
        },
        updateVustomerForBelonger: {
            url: "updateVustomerForBelonger.do"
        },

        addVuser: {
            url: "addVuser.do"
        },
        queryVuser: {
            url: "queryVuser.do"
        },

        // 公众号
        queryCusConstructer: {
            url: "queryCusConstructer.do"
        },
        queryCusConstruction: {
            url: "queryCusConstruction.do"
        },

        queryCusDecoration: {
            url: "queryCusDecoration.do"
        },
        queryCusDecorationByOrderId: {
            url: "queryCusDecorationByOrderId.do"
        },
        queryCusDecorationUser: {
            url: "queryCusDecorationUser.do"
        },
        bindingCusDecoration: {
            url: "bindingCusDecoration.do"
        },
        queryCusDecorationForDefault: {
            url: "queryCusDecorationForDefault.do"
        },

        queryCusTalking: {
            url: "queryCusTalking.do"
        },

        updateCusDecorationForDefault: {
            url: "updateCusDecorationForDefault.do"
        },

        pageSurvey: {
            url: "pageSurvey.do"
        },
        querySurveyByOrderId: {
            url: "querySurveyByOrderId.do"
        },
        querySurveyBySid: {
            url: "querySurveyBySid.do"
        },
        makeSurvey: {
            url: "makeSurvey.do"
        },
        handleSurvey: {
            url: "handleSurvey.do"
        },
        sendSurvey: {
            url: "sendSurvey.do"
        },
        finishSurvey: {
            url: "finishSurvey.do"
        },

        pageEmember: {
            url: "pageEmember.do"
        },
        queryEmember: {
            url: "queryEmember.do"
        },
        addEmember: {
            url: "addEmember.do"
        },
        deleteEmember: {
            url: "deleteEmember.do"
        },

        pageFeedback: {
            url: "pageFeedback.do"
        },
        addFeedback: {
            url: "addFeedback.do"
        },
        finishFeedback: {
            url: "finishFeedback.do"
        },
        receiveFeedback: {
            url: "receiveFeedback.do"
        },
        queryFeedbackBackVisit: {
            url: "queryFeedbackBackVisit.do"
        },
        addFeedbackBackVisit: {
            url: "addFeedbackBackVisit.do"
        },
        queryFeedbackRecord: {
            url: "queryFeedbackRecord.do"
        },
        addFeedbackRecord: {
            url: "addFeedbackRecord.do"
        },
        queryFeedbackComplaintProblem: {
            url: "queryFeedbackComplaintProblem.do"
        },
        queryFeedbackComplaint: {
            url: "queryFeedbackComplaint.do"
        },
        addFeedbackComplaint: {
            url: "addFeedbackComplaint.do"
        },
        updateFeedbackComplaint: {
            url: "updateFeedbackComplaint.do"
        },
        finishFeedbackComplaint: {
            url: "finishFeedbackComplaint.do"
        },
        queryFeedbackComplaintDept: {
            url: "queryFeedbackComplaintDept.do"
        },
        addFeedbackComplaintDept: {
            url: "addFeedbackComplaintDept.do",
        },
        updateFeedbackComplaintDept: {
            url: "updateFeedbackComplaintDept.do"
        },
        deleteFeedbackComplaintDept: {
            url: "deleteFeedbackComplaintDept.do"
        },
        queryFeedbackDrawing: {
            url: "queryFeedbackDrawing.do"
        },
        queryFeedbackDrawingBySid: {
            url: "queryFeedbackDrawingBySid.do"
        },
        addFeedbackDrawing: {
            url: "addFeedbackDrawing.do"
        },
        deleteFeedbackDrawing: {
            url: "deleteFeedbackDrawing.do"
        },
        updateFeedbackDrawing: {
            url: "updateFeedbackDrawing.do"
        },
        queryFeedbackGuarantee: {
            url: "queryFeedbackGuarantee.do"
        },
        queryFeedbackGuaranteeByFgid: {
            url: "queryFeedbackGuaranteeByFgid.do"
        },
        addFeedbackGuarantee: {
            url: "addFeedbackGuarantee.do"
        },
        updateFeedbackGuarantee: {
            url: "updateFeedbackGuarantee.do"
        },
        pageGroup: {
            url: "pageGroup.do"
        },
        queryGroup: {
            url: "queryGroup.do"
        },
        updateGroup: {
            url: "updateGroup.do"
        },
        unbindGroup: {
            url: "unbindGroup.do"
        },
        bindGroup: {
            url: "bindGroup.do"
        },

        queryCusMaterialPayment: {
            url: "queryCusMaterialPayment.do"
        },
        queryCusDecorationPayment: {
            url: "queryCusDecorationPayment.do"
        },
        queryCusServicePayment: {
            url: "queryCusServicePayment.do"
        },
        queryCusSalesPayment: {
            url: "queryCusSalesPayment.do"
        },
        queryCusAdvance: {
            url: "queryCusAdvance.do"
        },
        queryCusPayment: {
            url: "queryCusPayment.do"
        },

        queryCusDecorationPicture: {
            url: "queryCusDecorationPicture.do"
        },
        queryCusConstructionDrawing: {
            url: "queryCusConstructionDrawing.do"
        },

        addDecorationCircle: {
            url: "addDecorationCircle.do"
        },
        pageConsultion: {
            url: "pageConsultion.do"
        },
        queryConsultionByOrderId: {
            url: "queryConsultionByOrderId.do"
        },
        addConsultion: {
            url: "addConsultion.do"
        },
        pageRevisit: {
            url: "pageRevisit.do"
        },
        queryRevisitByOrderId: {
            url: "queryRevisitByOrderId.do"
        },
        queryRevisitForAepair: {
            url: "queryRevisitForAepair.do"
        },
        queryRevisitForComplain: {
            url: "queryRevisitForComplain.do"
        },
        visitRevisit: {
            url: "visitRevisit.do"
        },

        pageComplain: {
            url: "pageComplain.do"
        },
        queryComplain: {
            url: "queryComplain.do"
        },
        queryComplainByOrderId: {
            url: "queryComplainByOrderId.do"
        },
        addComplain: {
            url: "addComplain.do"
        },
        finishComplain: {
            url: "finishComplain.do"
        },
        closeComplain: {
            url: "closeComplain.do"
        },
        queryComplaint: {
            url: "queryComplaint.do"
        },
        addComplaint: {
            url: "addComplaint.do"
        },
        finishComplaint: {
            url: "finishComplaint.do"
        },
        closeComplaint: {
            url: "closeComplaint.do"
        },
        queryComplack: {
            url: "queryComplack.do"
        },
        trackComplack: {
            url: "trackComplack.do"
        },

        pageAepair: {
            url: "pageAepair.do"
        },
        queryAepair: {
            url: "queryAepair.do"
        },
        queryAepairByOrderId: {
            url: "queryAepairByOrderId.do"
        },
        addAepair: {
            url: "addAepair.do"
        },
        updateAepair: {
            url: "updateAepair.do",
            type: "update",
            tranargs: {
                args: ["aepair.outlay"]
            }
        },
        receiveAepair: {
            url: "receiveAepair.do"
        },
        deliveAepair: {
            url: "deliveAepair.do"
        },
        tranAepair: {
            url: "tranAepair.do"
        },
        finishAepair: {
            url: "finishAepair.do"
        },
        closeAepair: {
            url: "closeAepair.do"
        },
        sendAepair: {
            url: "sendAepair.do"
        },

        queryRepair: {
            url: "queryRepair.do"
        },
        addRepair: {
            url: "addRepair.do"
        },
        keepRepair: {
            url: "keepRepair.do"
        },
        finishRepair: {
            url: "finishRepair.do"
        },

        queryRepairpay: {
            url: "queryRepairpay.do",
            type: "query",
            tranargs: [{
                result: "repairpays",
                args: ["money"]
            }]
        },
        addRepairpay: {
            url: "addRepairpay.do",
            type: "update",
            tranargs: {
                args: ["repairpay.money"]
            }
        },
        deleteRepairpay: {
            url: "deleteRepairpay.do"
        },

        pagePointAccount: {
            url: "pagePointAccount.do",
            type: "query",
            tranargs: [{
                result: "pointAccount",
                args: ["decorationPoint", "materialPoint", "operatePoint"]
            }]
        },
        queryPointAccount: {
            url: "queryPointAccount.do",
            type: "query",
            tranargs: [{
                result: "pointAccount",
                args: ["decorationPoint", "materialPoint", "operatePoint"]
            }]
        },
        queryPointRecord: {
            url: "queryPointRecord.do",
            type: "query",
            tranargs: [{
                result: "pointRecords",
                args: ["balance", "point"]
            }]
        },
        createPointAccount: {
            url: "createPointAccount.do"
        },
        grantPoint: {
            url: "grantPoint.do",
            type: "update",
            tranargs: {
                args: ["pointAccount.decorationPoint", "pointAccount.materialPoint", "pointAccount.operatePoint"]
            }
        },
        consumePoint: {
            url: "consumePoint.do",
            type: "update",
            tranargs: {
                args: ["pointAccount.decorationPoint", "pointAccount.materialPoint", "pointAccount.operatePoint"]
            }
        },

        pageDroup: {
            url: "pageDroup.do"
        },
        queryDroup: {
            url: "queryDroup.do"
        },
        updateDroup: {
            url: "updateDroup.do"
        },
        deleteDroup: {
            url: "deleteDroup.do"
        },
        bindDroup: {
            url: "bindDroup.do"
        },

        pageConversation: {
            url: "pageConversation.do"
        },
        requestConversation: {
            url: "requestConversation.do"
        },
        responseConversation: {
            url: "responseConversation.do"
        },
        deleteConversation: {
            url: "deleteConversation.do"
        }

    }
});

$.extend(tools, {
    customer: {
        info: function(content, cid) {

            com.post(api.data.queryCustomerById, {
                "customer.cid": cid
            }, function(res) {

                var customer = res.customer;
                var type = constant.customer().customer.customerType.keys[customer.type];

                com.showTip(content, "姓名:" + customer.name + "<br\>地址:" + customer.address + "<br\>邮箱:" + customer.email + "<br\>客户类型:" + type, "bottom");
            });

        }
    }
});
