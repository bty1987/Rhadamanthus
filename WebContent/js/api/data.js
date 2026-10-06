$.extend(api.index, {
    categoryIndex: {
        url: "/views/data/category.html"
    },
    brandIndex: {
        url: "/views/data/brand.html"
    },
    customerIndex: {
        url: "/views/data/customer.html"
    },
    villageIndex: {
        url: "/views/data/village.html"
    },
    village4condition: {
        url: "/views/data/village4condition.html"
    },
    paymentScale: {
        url: "/views/data/paymentScale.html"
    },
    houseIndex: {
        url: "/views/data/house.html"
    },
    checkUser: {
        url: "/views/data/checkUser.html"
    },
    userLabel: {
        url: "/views/data/userLabel.html"
    },
    customerRecordIndex: {
        url: "/views/data/customerRecord.html"
    },
    customerAccountIndex: {
        url: "/views/data/customerAccount.html"
    },
    assistanceitemIndex: {
        url: "/views/data/assistanceItem.html"
    },
    goods4condition: {
        url: "/views/data/goods4condition.html"
    },
    village4rule: {
        url: "/views/data/village4rule.html"
    },
    buildingNameRuleIndex: {
        url: "/views/data/buildingNameRule.html"
    },
    inspectItem: {
        url: "/views/data/inspectItem.html"
    },
    constructionNodeIndex: {
        url: "/views/data/constructionPeriod4node.html"
    },
    goodsPool4condition: {
        url: "/views/data/goodsPool4condition.html"
    },
});

$.extend(api, {
    data: {
        pageSupplier: {
            url: "pageSupplier.do",
            demo: true
        },
        addSupplier: {
            url: "addSupplier.do",
            server: "communion"
        },
        updateSupplier: {
            url: "updateSupplier.do",
            server: "communion"
        },
        updateSupplierForLogin: {
            url: "updateSupplierForLogin.do",
            server: "communion"
        },
        updateSupplierForPassword: {
            url: "updateSupplierForPassword.do",
            server: "communion"
        },

        pageInstorer: {
            url: "pageInstorer.do",
            demo: true
        },
        addInstorer: {
            url: "addInstorer.do",
            server: "communion"
        },
        updateInstorer: {
            url: "updateInstorer.do",
            server: "communion"
        },
        updateInstorerForLogin: {
            url: "updateInstorerForLogin.do",
            server: "communion"
        },
        updateInstorerForPassword: {
            url: "updateInstorerForPassword.do",
            server: "communion"
        },

        querySupplierUserRightBySId: {
            url: "querySupplierUserRightBySId.do",
            demo: true
        },
        updateSupplierUserRight: {
            url: "updateSupplierUserRight.do",
            server: "communion"
        },

        pageBrand: {
            url: "pageBrand.do",
            demo: true
        },
        queryBrand: {
            url: "queryBrand.do",
            demo: true
        },
        queryBrandByBid: {
            url: "queryBrandByBid.do"
        },
        queryBrandByNo: {
            url: "queryBrandByNo.do"
        },
        queryBrandByCid: {
            url: "queryBrandByCid.do",
            demo: true
        },
        queryBrandByPinyin: {
            url: "queryBrandByPinyin.do"
        },
        queryBrandForAllByPinyin: {
            url: "queryBrandForAllByPinyin.do"
        },
        addBrand: {
            url: "addBrand.do",
            server: "communion"
        },
        updateBrand: {
            url: "updateBrand.do",
            server: "communion"
        },
        updateBrandForStatus: {
            url: "updateBrandForStatus.do",
            server: "communion"
        },
        deleteBrandByBids: {
            url: "deleteBrandByBids.do",
            server: "communion"
        },

        pageBrandPool: {
            url: "pageBrandPool.do"
        },
        queryBrandPoolByName: {
            url: "queryBrandPoolByName.do"
        },
        updateBrandPoolForStatus: {
            url: "updateBrandPoolForStatus.do"
        },
        addBrandPool: {
            url: "addBrandPool.do"
        },
        updateBrandPool: {
            url: "updateBrandPool.do"
        },

        queryRemeasureFormatByBid: {
            url: "queryRemeasureFormatByBid.do",
            type: "query",
            tranargs: [{
                result: "remeasureFormats",
                args: ["value"]
            }]
        },
        queryRemeasureFormatByRfid: {
            url: "queryRemeasureFormatByRfid.do",
            type: "query",
            tranargs: [{
                result: "remeasureFormat",
                args: ["value"]
            }]
        },
        addRemeasureFormat: {
            url: "addRemeasureFormat.do",
            type: "update",
            tranargs: {
                args: ["remeasureFormat.value"]
            }
        },
        updateRemeasureFormat: {
            url: "updateRemeasureFormat.do",
            type: "update",
            tranargs: {
                args: ["remeasureFormat.value"]
            }
        },
        updateRemeasureFormatForStatus: {
            url: "updateRemeasureFormatForStatus.do"
        },

        pageCategory: {
            url: "pageCategory.do",
            demo: true
        },
        queryCategory: {
            url: "queryCategory.do",
            demo: true
        },
        queryCategoryFormatByCid: {
            url: "queryCategoryFormatByCid.do"
        },
        addCategoryFormat: {
            url: "addCategoryFormat.do"
        },
        updateCategoryFormat: {
            url: "updateCategoryFormat.do"
        },
        deleteCategoryFormat: {
            url: "deleteCategoryFormat.do"
        },
        queryCategoryByCId: {
            url: "queryCategoryByCId.do"
        },
        addCategory: {
            url: "addCategory.do",
            server: "communion"
        },
        updateCategory: {
            url: "updateCategory.do",
            server: "communion"
        },
        deleteCategoryByCIds: {
            url: "deleteCategoryByCIds.do",
            server: "communion"
        },

        pageCustomer: {
            url: "pageCustomer.do",
            demo: true
        },
        queryCustomerById: {
            url: "queryCustomerById.do"
        },
        queryCustomerForName: {
            url: "queryCustomerForName.do"
        },
        queryCustomerForPhone: {
            url: "queryCustomerForPhone.do",
            server: "communion"
        },
        checkCustomerForPhone: {
            url: "checkCustomerForPhone.do",
            intercept: true
        },
        queryCustomerPhoneByCid: {
            url: "queryCustomerPhoneByCid.do"
        },

        addCustomer: {
            url: "addCustomer.do",
            server: "communion"
        },
        updateCustomer: {
            url: "updateCustomer.do",
            server: "communion"
        },
        updateCustomerForBase: {
            url: "updateCustomerForBase.do",
            server: "communion"
        },
        addCustomerPhone: {
            url: "addCustomerPhone.do",
            server: "communion"
        },
        updateCustomerPhoneForStatus: {
            url: "updateCustomerPhoneForStatus.do",
            server: "communion",
            intercept: true
        },
        updateCustomerNameAPhone: {
            url: "updateCustomerNameAPhone.do",
            server: "communion"
        },
        updateCustomerPhoneForDefault: {
            url: "updateCustomerPhoneForDefault.do",
            server: "communion",
            intercept: true
        },
        existCustomer: {
            url: "existCustomer.do",
            server: "communion"
        },
        registCustomer: {
            url: "registCustomer.do",
            server: "communion"
        },
        authCustomer: {
            url: "authCustomer.do",
            server: "communion"
        },
        confirmCustomer: {
            url: "confirmCustomer.do",
            server: "communion"
        },
        signateCustomer: {
            url: "signateCustomer.do",
            server: "communion"
        },
        resetCustomer: {
            url: "resetCustomer.do",
            server: "communion"
        },

        pageVillage: {
            url: "pageVillage.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["mileage"]
            }]
        },
        queryVillage: {
            url: "queryVillage.do",
            type: "query",
            tranargs: [{
                result: "villages",
                args: ["mileage"]
            }]
        },
        queryVillageByVid: {
            url: "queryVillageByVid.do",
            type: "query",
            tranargs: [{
                result: "villages",
                args: ["mileage"]
            }]
        },
        queryVillageForNameByPinyin: {
            url: "queryVillageForNameByPinyin.do",
            demo: true,
            type: "query",
            tranargs: [{
                result: "villages",
                args: ["mileage"]
            }]
        },
        addVillage: {
            url: "addVillage.do",
            server: "communion",
            type: "update",
            tranargs: {
                args: ["village.mileage"]
            }
        },
        updateVillage: {
            url: "updateVillage.do",
            server: "communion",
            type: "update",
            tranargs: {
                args: ["village.mileage"]
            }
        },
        updateVillageForStatus: {
            url: "updateVillageForStatus.do",
            server: "communion"
        },
        updateVillageForPosition: {
            url: "updateVillageForPosition.do",
            server: "communion"
        },
        updateVillageForUrl: {
            url: "updateVillageForUrl.do",
            server: "communion"
        },
        locateVillage: {
            url: "locateVillage.do",
            server: "communion"
        },
        queryVillageRule: {
            url: "queryVillageRule.do",
            type: "query",
            tranargs: [{
                result: "villageRules",
                args: ["price"]
            }]
        },
        addVillageRule: {
            url: "addVillageRule.do",
            server: "communion"
        },
        deleteVillageRule: {
            url: "deleteVillageRule.do",
            server: "communion"
        },

        // 楼盘命名规则管理
        pageBuildingNameRule: {
            url: "pageBuildingNameRule.do",
            type: "query"
        },
        queryBuildingNameRule: {
            url: "queryBuildingNameRule.do",
            type: "query"
        },
        addBuildingNameRule: {
            url: "addBuildingNameRule.do",
            server: "communion"
        },
        updateBuildingNameRule: {
            url: "updateBuildingNameRule.do",
            server: "communion"
        },
        deleteBuildingNameRule: {
            url: "deleteBuildingNameRule.do",
            server: "communion"
        },

        pageHouse: {
            url: "pageHouse.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["buildArea", "freeArea", "innerArea", "totalArea"]
            }]
        },
        queryHouseByHid: {
            url: "queryHouseByHid.do",
            type: "query",
            tranargs: [{
                result: "house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea"]
            }]
        },
        queryHouseByNoAHnum: {
            url: "queryHouseByNoAHnum.do",
            type: "query",
            tranargs: [{
                result: "house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea"]
            }]
        },
        addHouse: {
            url: "addHouse.do",
            server: "communion",
            type: "update",
            tranargs: {
                args: ["house.buildArea", "house.freeArea", "house.innerArea", "house.totalArea"],
                query: [{
                    result: "house",
                    args: ["buildArea", "freeArea", "innerArea", "totalArea"]
                }]
            }
        },
        updateHouse: {
            url: "updateHouse.do",
            intercept: true,
            server: "communion",
            type: "update",
            tranargs: {
                args: ["house.buildArea", "house.freeArea", "house.innerArea", "house.totalArea"]
            }
        },
        existHouse: {
            url: "existHouse.do",
            server: "communion",
            type: "update",
            tranargs: {
                args: ["house.buildArea", "house.freeArea", "house.innerArea", "house.totalArea"]
            }
        },

        pageConstructionPace: {
            url: "pageConstructionPace.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["upperArea", "lowerArea", "period", "designPeriod"]
            }]
        },
        queryConstructionPace: {
            url: "queryConstructionPace.do",
            type: "update",
            tranargs: {
                args: ["constructionPace.upperArea", "constructionPace.lowerArea", "constructionPace.period", "constructionPace.designPeriod"],
                query: [{
                    result: "constructionPace",
                    args: ["upperArea", "lowerArea", "period", "designPeriod"]
                }]
            }
        },
        addConstructionPace: {
            url: "addConstructionPace.do",
            type: "update",
            tranargs: {
                args: ["constructionPace.upperArea", "constructionPace.lowerArea", "constructionPace.period", "constructionPace.designPeriod"]
            }
        },
        updateConstructionPace: {
            url: "updateConstructionPace.do",
            type: "update",
            tranargs: {
                args: ["constructionPace.upperArea", "constructionPace.lowerArea", "constructionPace.period", "constructionPace.designPeriod"]
            }
        },
        deleteConstructionPace: {
            url: "deleteConstructionPace.do"
        },

        pageConstructionPaceNode: {
            url: "pageConstructionPaceNode.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["connum", "comnum", "prenum", "postnum"]
            }]
        },
        queryConstructionPaceNode: {
            url: "queryConstructionPaceNode.do",
            type: "query",
            tranargs: [{
                result: "constructionPaceNodes",
                args: ["connum", "comnum", "prenum", "postnum"]
            }]
        },
        addConstructionPaceNode: {
            url: "addConstructionPaceNode.do",
            type: "update",
            tranargs: {
                args: ["constructionPaceNode.connum", "constructionPaceNode.comnum", "constructionPaceNode.prenum", "constructionPaceNode.postnum"]
            }
        },
        updateConstructionPaceNode: {
            url: "updateConstructionPaceNode.do",
            type: "update",
            tranargs: {
                args: ["constructionPaceNode.connum", "constructionPaceNode.comnum", "constructionPaceNode.prenum", "constructionPaceNode.postnum"]
            }
        },
        updateConstructionPaceNodeForStatus: {
            url: "updateConstructionPaceNodeForStatus.do"
        },

        pageConstructionPeriod: {
            url: "pageConstructionPeriod.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["upperArea", "lowerArea", "period"]
            }]
        },
        queryConstructionPeriod: {
            url: "queryConstructionPeriod.do",
            type: "update",
            tranargs: {
                args: ["constructionPeriod.upperArea", "constructionPeriod.lowerArea", "constructionPeriod.period"],
                query: [{
                    result: "constructionPeriods",
                    args: ["upperArea", "lowerArea", "period"]
                }]
            }
        },
        addConstructionPeriod: {
            url: "addConstructionPeriod.do",
            type: "update",
            tranargs: {
                args: ["constructionPeriod.upperArea", "constructionPeriod.lowerArea", "constructionPeriod.period"]
            }
        },
        updateConstructionPeriod: {
            url: "updateConstructionPeriod.do",
            type: "update",
            tranargs: {
                args: ["constructionPeriod.upperArea", "constructionPeriod.lowerArea", "constructionPeriod.period"]
            }
        },
        deleteConstructionPeriod: {
            url: "deleteConstructionPeriod.do"
        },

        queryConstructionPeriodNodeByCpid: {
            url: "queryConstructionPeriodNodeByCpid.do",
            type: "query",
            tranargs: [{
                result: "constructionPeriodNodes",
                args: ["period"]
            }]
        },
        addConstructionPeriodNode: {
            url: "addConstructionPeriodNode.do",
            type: "update",
            tranargs: {
                args: ["constructionPeriodNode.period"]
            }
        },
        deleteConstructionPeriodNodeByCpnid: {
            url: "deleteConstructionPeriodNodeByCpnid.do",
        },

        pageDrawlineGroup: {
            url: "pageDrawlineGroup.do"
        },
        queryDrawlineGroup: {
            url: "queryDrawlineGroup.do"
        },
        addDrawlineGroup: {
            url: "addDrawlineGroup.do"
        },
        updateDrawlineGroup: {
            url: "updateDrawlineGroup.do"
        },
        updateDrawlineGroupForStatus: {
            url: "updateDrawlineGroupForStatus.do"
        },

        pageMeasurementUnit: {
            url: "pageMeasurementUnit.do"
        },
        queryMeasurementUnit: {
            url: "queryMeasurementUnit.do"
        },
        addMeasurementUnit: {
            url: "addMeasurementUnit.do",
            server: "communion"
        },
        updateMeasurementUnit: {
            url: "updateMeasurementUnit.do",
            server: "communion"
        },

        pageConstructionNode: {
            url: "pageConstructionNode.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["precheck", "postcheck", "stacheck", "fincheck", "timeLimit", "salaryLimit", "salaryFloor", "accessoryLimit", "account"]
            }]
        },
        queryConstructionNode: {
            url: "queryConstructionNode.do",
            type: "query",
            tranargs: [{
                result: "constructionNodes",
                args: ["precheck", "postcheck", "stacheck", "fincheck", "timeLimit", "salaryLimit", "salaryFloor", "accessoryLimit", "account"]
            }]
        },
        queryConstructionNodeByCnid: {
            url: "queryConstructionNodeByCnid.do",
            type: "query",
            tranargs: [{
                result: "constructionNode",
                args: ["precheck", "postcheck", "stacheck", "fincheck", "timeLimit", "salaryLimit", "salaryFloor", "accessoryLimit", "account"]
            }]
        },
        queryConstructionNodeByOrderId: {
            url: "queryConstructionNodeByOrderId.do",
            type: "query",
            tranargs: [{
                result: "constructionNodes",
                args: ["precheck", "postcheck", "stacheck", "fincheck", "timeLimit", "salaryLimit", "salaryFloor", "accessoryLimit", "account"]
            }]
        },
        queryConstructionNodeForGroup: {
            url: "queryConstructionNodeForGroup.do",
            type: "query",
            tranargs: [{
                result: "constructionNodes",
                args: ["precheck", "postcheck", "stacheck", "fincheck", "timeLimit", "salaryLimit", "salaryFloor", "accessoryLimit", "account"]
            }]
        },
        addConstructionNode: {
            url: "addConstructionNode.do",
            type: "update",
            tranargs: {
                args: ["constructionNode.precheck", "constructionNode.postcheck", "constructionNode.stacheck", "constructionNode.fincheck", "constructionNode.timeLimit", "constructionNode.salaryLimit", "constructionNode.salaryFloor", "constructionNode.accessoryLimit", "constructionNode.account"]
            }
        },
        updateConstructionNode: {
            url: "updateConstructionNode.do",
            type: "update",
            tranargs: {
                args: ["constructionNode.precheck", "constructionNode.postcheck", "constructionNode.stacheck", "constructionNode.fincheck", "constructionNode.timeLimit", "constructionNode.salaryLimit", "constructionNode.salaryFloor", "constructionNode.accessoryLimit", "constructionNode.account"]
            }
        },
        updateConstructionNodeForStatus: {
            url: "updateConstructionNodeForStatus.do"
        },

        pageMaterialPlanNode: {
            url: "pageMaterialPlanNode.do",
            type: "query"
        },
        queryMaterialPlanNode: {
            url: "queryMaterialPlanNode.do",
            type: "query"
        },
        addMaterialPlanNode: {
            url: "addMaterialPlanNode.do",
            type: "update"
        },
        updateMaterialPlanNode: {
            url: "updateMaterialPlanNode.do",
            type: "update"
        },
        updateMaterialPlanNodeForStatus: {
            url: "updateMaterialPlanNodeForStatus.do"
        },

        queryPaymentScale: {
            url: "queryPaymentScale.do"
        },
        addPaymentScale: {
            url: "addPaymentScale.do",
        },
        deletePaymentScale: {
            url: "deletePaymentScale.do"
        },
        updatePaymentScaleForStatus: {
            url: "updatePaymentScaleForStatus.do"
        },
        queryPaymentScaleItemByPsid: {
            url: "queryPaymentScaleItemByPsid.do",
            type: "query",
            tranargs: [{
                result: "paymentScaleItems",
                args: ["scale"]
            }]
        },
        fetchPaymentScaleItem: {
            url: "fetchPaymentScaleItem.do",
            type: "query",
            tranargs: [{
                result: "paymentScaleItems",
                args: ["scale"]
            }]
        },
        queryPaymentScaleItem: {
            url: "queryPaymentScaleItem.do",
            type: "query",
            tranargs: [{
                result: "paymentScaleItem",
                args: ["scale"]
            }]
        },
        addPaymentScaleItem: {
            url: "addPaymentScaleItem.do",
            type: "update",
            tranargs: {
                args: ["paymentScaleItem.scale"]
            }
        },
        deletePaymentScaleItem: {
            url: "deletePaymentScaleItem.do"
        },

        queryChainPage: {
            url: "queryChainPage.do"
        },
        queryChainPageForSelf: {
            url: "queryChainPageForSelf.do"
        },
        addChainPage: {
            url: "addChainPage.do"
        },
        deleteChainPage: {
            url: "deleteChainPage.do"
        },

        querySalesMatching: {
            url: "querySalesMatching.do"
        },
        addSalesMatching: {
            url: "addSalesMatching.do"
        },
        updateSalesMatching: {
            url: "updateSalesMatching.do"
        },
        updateSalesMatchingForStatus: {
            url: "updateSalesMatchingForStatus.do"
        },

        pageLabel: {
            url: "pageLabel.do"
        },
        queryLabel: {
            url: "queryLabel.do"
        },
        addLabel: {
            url: "addLabel.do"
        },
        updateLabel: {
            url: "updateLabel.do"
        },
        updateLabelForStatus: {
            url: "updateLabelForStatus.do"
        },
        queryUserLabelByUid: {
            url: "queryUserLabelByUid.do"
        },
        pickUserLabel: {
            url: "pickUserLabel.do"
        },
        addUserLabel: {
            url: "addUserLabel.do"
        },
        deleteUserLabel: {
            url: "deleteUserLabel.do"
        },

        pageSurveyTemplate: {
            url: "pageSurveyTemplate.do"
        },
        querySurveyTemplate: {
            url: "querySurveyTemplate.do"
        },
        querySurveyTemplateByStid: {
            url: "querySurveyTemplateByStid.do"
        },
        addSurveyTemplate: {
            url: "addSurveyTemplate.do"
        },
        updateSurveyTemplate: {
            url: "updateSurveyTemplate.do"
        },
        updateSurveyTemplateForStatus: {
            url: "updateSurveyTemplateForStatus.do"
        },
        deleteSurveyTemplate: {
            url: "deleteSurveyTemplate.do"
        },
        copySurveyTemplate: {
            url: "copySurveyTemplate.do"
        },

        pageChating: {
            url: "pageChating.do"
        },
        queryChating: {
            url: "queryChating.do"
        },
        addChating: {
            url: "addChating.do"
        },
        updateChating: {
            url: "updateChating.do"
        },
        updateChatingForStatus: {
            url: "updateChatingForStatus.do"
        },
        deleteChating: {
            url: "deleteChating.do"
        },

        pageConstructionCost: {
            url: "pageConstructionCost.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["areaLeft", "areaRight", "accessory", "salary"]
            }]
        },
        queryConstructionCost: {
            url: "queryConstructionCost.do"
        },
        addConstructionCost: {
            url: "addConstructionCost.do",
            type: "update",
            tranargs: {
                args: ["constructionCost.areaLeft", "constructionCost.areaRight", "constructionCost.accessory", "constructionCost.salary"]
            }
        },
        updateConstructionCost: {
            url: "updateConstructionCost.do",
            type: "update",
            tranargs: {
                args: ["constructionCost.areaLeft", "constructionCost.areaRight", "constructionCost.accessory", "constructionCost.salary"]
            }
        },
        updateConstructionCostForStatus: {
            url: "updateConstructionCostForStatus.do"
        },

        pageAccessoriesType: {
            url: "pageAccessoriesType.do"
        },
        queryAccessoriesType: {
            url: "queryAccessoriesType.do"
        },
        queryAccessoriesTypeByWtid: {
            url: "queryAccessoriesTypeByWtid.do"
        },
        updateAccessoriesTypeForStatus: {
            url: "updateAccessoriesTypeForStatus.do"
        },
        addAccessoriesType: {
            url: "addAccessoriesType.do"
        },
        updateAccessoriesType: {
            url: "updateAccessoriesType.do"
        },

        pageColor: {
            url: "pageColor.do",
            type: "query",
            tranargs: [{
                result: "paging-data-goods",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },

        queryColorByGid: {
            url: "queryColorByGid.do",
            type: "query",
            tranargs: [{
                result: "colors-goods",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        queryColorForEnableByGid: {
            url: "queryColorForEnableByGid.do",
            type: "query",
            tranargs: [{
                result: "colors-goods",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        addColor: {
            url: "addColor.do"
        },
        updateColorForStatus: {
            url: "updateColorForStatus.do"
        },

        pageFormat: {
            url: "pageFormat.do",
            type: "query",
            tranargs: [{
                result: "paging-data-goods",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },

        queryFormatByGid: {
            url: "queryFormatByGid.do",
            type: "query",
            tranargs: [{
                result: "formats-goods",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        queryFormatForEnableByGid: {
            url: "queryFormatForEnableByGid.do",
            type: "query",
            tranargs: [{
                result: "formats-goods",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        addFormat: {
            url: "addFormat.do"
        },
        updateFormatForStatus: {
            url: "updateFormatForStatus.do"
        },

        pageGoods: {
            url: "pageGoods.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        pageGoodsForAdvance: {
            url: "pageGoodsForAdvance.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        queryGoods: {
            url: "queryGoods.do",
            type: "query",
            tranargs: [{
                result: "goodes",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        queryGoodsByNo: {
            url: "queryGoodsByNo.do",
            type: "query",
            tranargs: [{
                result: "goodes",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        queryGoodsByName: {
            url: "queryGoodsByName.do",
            type: "query",
            tranargs: [{
                result: "goodes",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        queryGoodsByAtid: {
            url: "queryGoodsByAtid.do",
            type: "query",
            tranargs: [{
                result: "goodes",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        queryGoodsByBarcode: {
            url: "queryGoodsByBarcode.do",
            type: "query",
            tranargs: [{
                result: "goods",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        queryGoodsByGId: {
            url: "queryGoodsByGId.do",
            type: "query",
            tranargs: [{
                result: "goods",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        queryGoodsByGpid: {
            url: "queryGoodsByGpid.do",
            type: "query",
            tranargs: [{
                result: "goodes",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        addGoods: {
            url: "addGoods.do",
            type: "update",
            tranargs: {
                args: ["goods.pieceNum", "goods.purchase", "goods.selling", "goods.confine"]
            }
        },

        updateGoods: {
            url: "updateGoods.do",
            type: "update",
            tranargs: {
                args: ["goods.pieceNum", "goods.purchase", "goods.selling", "goods.confine"]
            }
        },
        updateGoodsForStatus: {
            url: "updateGoodsForStatus.do"
        },
        showGoods: {
            url: "showGoods.do"
        },

        pageGoodsRecord: {
            url: "pageGoodsRecord.do"
        },
        addGoodsRecord: {
            url: "addGoodsRecord.do"
        },

        queryGoodsPackage: {
            url: "queryGoodsPackage.do",
            type: "query",
            tranargs: [{
                result: "goodsPackages",
                args: ["num", "purchase", "selling", "pieceNum", "confine", "cvalue"]
            }, {
                result: "goodsPackages-goods",
                args: ["purchase", "selling", "pieceNum", "confine", "cvalue"]
            }]
        },
        addGoodsPackage: {
            url: "addGoodsPackage.do",
            type: "update",
            tranargs: {
                args: ["goodsPackages.num", "goodsPackages.purchase", "goodsPackages.selling", "goodsPackages.pieceNum", "goodsPackages.confine", "goodsPackages.cvalue", ]
            }
        },
        updateGoodsPackage: {
            url: "updateGoodsPackage.do",
            type: "update",
            tranargs: {
                args: ["goodsPackage.num", "goodsPackage.purchase", "goodsPackage.selling", "goodsPackage.pieceNum", "goodsPackage.confine", "goodsPackage.cvalue", ]
            }
        },
        deleteGoodsPackage: {
            url: "deleteGoodsPackage.do",
        },

        pagePrice: {
            url: "pagePrice.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["purchase", "selling", "cvalue", "confine"]
            }, {
                result: "paging-data-goods",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        queryPriceByGid: {
            url: "queryPriceByGid.do",
            type: "query",
            tranargs: [{
                result: "prices",
                args: ["purchase", "selling", "cvalue", "confine"]
            }, {
                result: "prices-goods",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        queryPriceByPid: {
            url: "queryPriceByPid.do",
            type: "query",
            tranargs: [{
                result: "price",
                args: ["purchase", "selling", "cvalue", "confine"]
            }, {
                result: "price-goods",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        addPrice: {
            url: "addPrice.do",
            type: "update",
            tranargs: {
                args: ["price.purchase", "price.selling", "price.cvalue", "price.confine"]
            }
        },
        updatePriceForStatus: {
            url: "updatePriceForStatus.do"
        },
        deletePrice: {
            url: "deletePrice.do"
        },

        pageAoods: {
            url: "pageAoods.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["totalimit", "balance", "selling", "normnum", "storenum"]
            }, {
                result: "paging-data-goods",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        queryAoods: {
            url: "queryAoods.do",
            type: "query",
            tranargs: [{
                result: "aoodes",
                args: ["totalimit", "balance", "selling", "normnum", "storenum"]
            }, {
                result: "aoodes-goods",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        queryAoodsByName: {
            url: "queryAoodsByName.do",
            type: "query",
            tranargs: [{
                result: "aoodes",
                args: ["totalimit", "balance", "selling", "normnum", "storenum"]
            }, {
                result: "aoodes-goods",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        queryAoodsByAtid: {
            url: "queryAoodsByAtid.do",
            type: "query",
            tranargs: [{
                result: "aoodes",
                args: ["totalimit", "balance", "selling", "normnum", "storenum"]
            }, {
                result: "aoodes-goods",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        addAoods: {
            url: "addAoods.do",
            type: "update",
            tranargs: {
                args: ["aoods.totalimit", "aoods.balance", "aoods.selling", "aoods.normnum", "aoods.storenum"]
            }
        },
        updateAoods: {
            url: "updateAoods.do",
            type: "update",
            tranargs: {
                args: ["aoods.totalimit", "aoods.balance", "aoods.selling", "aoods.normnum", "aoods.storenum"]
            }
        },
        updateAoodsForStatus: {
            url: "updateAoodsForStatus.do"
        },
        updateAoodsForNorm: {
            url: "updateAoodsForNorm.do"
        },
        updateAoodsForAdvance: {
            url: "updateAoodsForAdvance.do"
        },
        copyAoods: {
            url: "copyAoods.do"
        },

        pageSoods: {
            url: "pageSoods.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["num", "selling", "cost", "balance"]
            }, {
                result: "paging-data-goods",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        querySoodsByName: {
            url: "querySoodsByName.do",
            type: "query",
            tranargs: [{
                result: "soodes",
                args: ["num", "selling", "cost", "balance"]
            }, {
                result: "soodes-goods",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        querySoods: {
            url: "querySoods.do",
            type: "query",
            tranargs: [{
                result: "soodes",
                args: ["num", "selling", "cost", "balance"]
            }, {
                result: "soodes-goods",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        addSoods: {
            url: "addSoods.do",
            type: "update",
            tranargs: {
                args: ["soods.num", "soods.selling", "soods.cost", "soods.balance"]
            }
        },

        updateSoods: {
            url: "updateSoods.do",
            type: "update",
            tranargs: {
                args: ["soods.selling", "soods.cost", "soods.balance"]
            }
        },
        updateSoodsForStatus: {
            url: "updateSoodsForStatus.do"
        },
        copySoods: {
            url: "copySoods.do"
        },
        deleteSoods: {
            url: "deleteSoods.do"
        },

        pageSoodsItemByQiid: {
            url: "pageSoodsItemByQiid.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["num", "selling"]
            }, {
                result: "paging-data-goods",
                args: ["addPrice", "unitPrice", "subPrice"]
            }, {
                result: "paging-data-quotationItem",
                args: ["pieceNum", "purchase", "selling"]
            }]
        },
        pageSoodsItemBySid: {
            url: "pageSoodsItemBySid.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["num", "selling"]
            }, {
                result: "paging-data-goods",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }, {
                result: "paging-data-quotationItem",
                args: ["pieceNum", "purchase", "selling"]
            }]
        },
        querySoodsItemByQiid: {
            url: "querySoodsItemByQiid.do",
            type: "query",
            tranargs: [{
                result: "soodsItems",
                args: ["num", "selling"]
            }, {
                result: "soodsItems-goods",
                args: ["pieceNum", "purchase", "selling"]
            }, {
                result: "soodsItems-quotationItem",
                args: ["pieceNum", "purchase", "selling"]
            }, ]
        },
        querySoodsItemBySid: {
            url: "querySoodsItemBySid.do",
            type: "query",
            tranargs: [{
                result: "soodsItems",
                args: ["num", "selling"]
            }, {
                result: "soodsItems-goods",
                args: ["pieceNum", "purchase", "selling"]
            }, {
                result: "soodsItems-quotationItem",
                args: ["pieceNum", "purchase", "selling"]
            }, ]
        },
        addSoodsItem: {
            url: "addSoodsItem.do",
            type: "update",
            tranargs: {
                args: ["soodsItem.quotationItem.unitPrice"]
            }
        },
        deleteSoodsItem: {
            url: "deleteSoodsItem.do"
        },

        pageNoods: {
            url: "pageNoods.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["selling", "balance", "surplus"]
            }]
        },
        queryNoods: {
            url: "queryNoods.do",
            type: "query",
            tranargs: [{
                result: "noodes",
                args: ["selling", "balance", "surplus"]
            }]
        },
        queryNoodsByName: {
            url: "queryNoodsByName.do",
            type: "query",
            tranargs: [{
                result: "noodes",
                args: ["selling", "balance", "surplus"]
            }]
        },
        queryNoodsForGroup: {
            url: "queryNoodsForGroup.do",
            type: "query",
            tranargs: [{
                result: "noodes",
                args: ["selling", "balance", "surplus"]
            }]
        },
        addNoods: {
            url: "addNoods.do",
            type: "update",
            tranargs: {
                args: ["noods.selling", "noods.balance", "noods.surplus"]
            }
        },
        updateNoods: {
            url: "updateNoods.do",
            type: "update",
            tranargs: {
                args: ["noods.selling", "noods.balance", "noods.surplus"]
            }
        },
        updateNoodsForStatus: {
            url: "updateNoodsForStatus.do"
        },
        updateNoodsForCalc: {
            url: "updateNoodsForCalc.do"
        },

        pageAoodsCost: {
            url: "pageAoodsCost.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["numLimit"]
            }, {
                result: "paging-data-constructionCost",
                args: ["areaLeft", "areaRight", "accessory", "salary"]
            }]
        },
        addAoodsCost: {
            url: "addAoodsCost.do",
            type: "update",
            tranargs: {
                args: ["aoodsCost.numLimit"]
            }
        },
        deleteAoodsCost: {
            url: "deleteAoodsCost.do"
        },

        pageAoodsCharge: {
            url: "pageAoodsCharge.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["price", "surplus"]
            }]
        },
        queryAoodsChargeByAid: {
            url: "queryAoodsChargeByAid.do",
            type: "query",
            tranargs: [{
                result: "aoodsCharges",
                args: ["price", "surplus"]
            }]
        },
        addAoodsCharge: {
            url: "addAoodsCharge.do",
            type: "update",
            tranargs: {
                args: ["aoodsCharge.price", "aoodsCharge.surplus"]
            },
        },
        updateAoodsCharge: {
            url: "updateAoodsCharge.do",
            type: "update",
            tranargs: {
                args: ["aoodsCharge.price", "aoodsCharge.surplus"]
            },
        },
        deleteAoodsCharge: {
            url: "deleteAoodsCharge.do"
        },

        pageHouseLayout: {
            url: "pageHouseLayout.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["area"]
            }]
        },
        queryHouseLayout: {
            url: "queryHouseLayout.do",
            type: "query",
            tranargs: [{
                result: "houseLayouts",
                args: ["area"]
            }]
        },
        addHouseLayout: {
            url: "addHouseLayout.do",
            server: "communion",
            type: "update",
            tranargs: {
                args: ["houseLayout.Area"]
            }
        },
        deleteHouseLayout: {
            url: "deleteHouseLayout.do",
            server: "communion"
        },

        // 公共项-工费
        pageCormrice: {
            url: "pageCormrice.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["trannum", "salary"]
            }]
        },
        queryCormriceByQcid: {
            url: "queryCormriceByQcid.do",
            type: "query",
            tranargs: [{
                result: "cormrices",
                args: ["trannum", "salary"]
            }, {
                result: "cormrices-constructionNode",
                args: ["precheck", "postcheck", "stacheck", "fincheck"]
            }]
        },
        addCormrice: {
            url: "addCormrice.do",
            type: "update",
            tranargs: {
                args: ["cormrice.trannum", "cormrice.salary"]
            }
        },
        deleteCormrice: {
            url: "deleteCormrice.do"
        },

        // 定额
        pageNormrice: {
            url: "pageNormrice.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["trannum", "salary", "stuff"]
            }, {
                result: "paging-data-quotationItem",
                args: ["unitPrice"]
            }]
        },
        queryNormriceByQiid: {
            url: "queryNormriceByQiid.do",
            type: "query",
            tranargs: [{
                result: "normrices",
                args: ["trannum", "salary", "stuff"]
            }, {
                result: "normrices-constructionNode",
                args: ["precheck", "postcheck", "stacheck", "fincheck"]
            }]
        },
        addNormrice: {
            url: "addNormrice.do",
            type: "update",
            tranargs: {
                args: ["normrice.trannum", "normrice.salary", "normrice.stuff"]
            }
        },
        deleteNormrice: {
            url: "deleteNormrice.do"
        },

        // 定额工期
        pageNormtime: {
            url: "pageNormtime.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["trannum", "workdays"]
            }, {
                result: "paging-data-quotationItem",
                args: ["unitPrice"]
            }]
        },
        queryNormtimeByQiid: {
            url: "queryNormtimeByQiid.do",
            type: "query",
            tranargs: [{
                result: "normtimes",
                args: ["trannum", "workdays"]
            }, {
                result: "normtimes-constructionNode",
                args: ["precheck", "postcheck", "stacheck", "fincheck"]
            }]
        },
        addNormtime: {
            url: "addNormtime.do",
            type: "update",
            tranargs: {
                args: ["normtime.trannum", "normtime.workdays"]
            }
        },
        deleteNormtime: {
            url: "deleteNormtime.do"
        },

        pageNormood: {
            url: "pageNormood.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["normnum", "storenum", "price"]
            }, {
                result: "paging-data-quotationItem",
                args: ["unitPrice"]
            }]
        },
        queryNormoodByQiid: {
            url: "queryNormoodByQiid.do",
            type: "query",
            tranargs: [{
                result: "normoods",
                args: ["normnum", "storenum", "price"]
            }, {
                result: "normoods-goods",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        addNormood: {
            url: "addNormood.do",
            type: "update",
            tranargs: {
                args: ["normood.normnum", "normood.storenum", "normood.price"]
            }
        },
        deleteNormood: {
            url: "deleteNormood.do"
        },

        pageChart: {
            url: "pageChart.do"
        },
        queryChart: {
            url: "queryChart.do"
        },
        queryChartForLogin: {
            url: "queryChartForLogin.do"
        },
        queryChartByRid: {
            url: "queryChartByRid.do"
        },
        updateRoleChartByRid: {
            url: "updateRoleChartByRid.do"
        },

        // 业务类型
        pageDecorationBusitype: {
            url: "pageDecorationBusitype.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["notSalesmanRate"]
            }]
        },
        queryDecorationBusitype: {
            url: "queryDecorationBusitype.do",
            type: "query",
            intercept: true,
            tranargs: [{
                result: "decorationBusitypes",
                args: ["notSalesmanRate"]
            }]
        },
        addDecorationBusitype: {
            url: "addDecorationBusitype.do",
            type: "update",
            tranargs: {
                args: ["decorationBusitype.notSalesmanRate"]
            }
        },
        updateDecorationBusitype: {
            url: "updateDecorationBusitype.do",
            type: "update",
            tranargs: {
                args: ["decorationBusitype.notSalesmanRate"]
            }
        },
        updateDecorationBusitypeForStatus: {
            url: "updateDecorationBusitypeForStatus.do",
            type: "update",
            tranargs: {
                args: ["decorationBusitype.notSalesmanRate"]
            }
        },

        pageDecorationAtttype: {
            url: "pageDecorationAtttype.do",
            demo: true
        },
        queryDecorationAtttype: {
            url: "queryDecorationAtttype.do"
        },
        updateDecorationAtttype: {
            url: "updateDecorationAtttype.do",
            type: "update"
        },

        pageDecorationMatching: {
            url: "pageDecorationMatching.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["base", "discount", "material", "service"]
            }]
        },
        queryDecorationMatching: {
            url: "queryDecorationMatching.do",
            type: "query",
            tranargs: [{
                result: "decorationMatchings",
                args: ["base", "discount", "material", "service"]
            }]
        },
        addDecorationMatching: {
            url: "addDecorationMatching.do",
            type: "update",
            tranargs: {
                args: ["decorationMatching.base", "decorationMatching.discount", "decorationMatching.material", "decorationMatching.service"]
            }
        },
        updateDecorationMatching: {
            url: "updateDecorationMatching.do",
            type: "update",
            tranargs: {
                args: ["decorationMatching.base", "decorationMatching.discount", "decorationMatching.material", "decorationMatching.service"]
            }
        },

        queryBrandBalance: {
            url: "queryBrandBalance.do",
            type: "query",
            tranargs: [{
                result: "brandBalances",
                args: ["cvalue"]
            }]
        },
        addBrandBalance: {
            url: "addBrandBalance.do",
            type: "update",
            tranargs: {
                args: ["brandBalance.cvalue"]
            }
        },
        deleteBrandBalance: {
            url: "deleteBrandBalance.do"
        },

        queryBrandProduct: {
            url: "queryBrandProduct.do",
            type: "query",
            tranargs: [{
                result: "brandProducts",
                args: ["cvalue"]
            }]
        },
        addBrandProduct: {
            url: "addBrandProduct.do",
        },
        updateBrandProduct: {
            url: "updateBrandProduct.do"
        },
        deleteBrandProduct: {
            url: "deleteBrandProduct.do"
        },

        queryBrandDeliver: {
            url: "queryBrandDeliver.do",
            type: "query",
            tranargs: [{
                result: "brandDelivers",
                args: ["cvalue"]
            }]
        },
        addBrandDeliver: {
            url: "addBrandDeliver.do",
        },
        updateBrandDeliver: {
            url: "updateBrandDeliver.do"
        },
        deleteBrandDeliver: {
            url: "deleteBrandDeliver.do"
        },

        queryBrandInstall: {
            url: "queryBrandInstall.do",
            type: "query",
            tranargs: [{
                result: "brandInstalls",
                args: ["cvalue"]
            }]
        },
        addBrandInstall: {
            url: "addBrandInstall.do",
        },
        updateBrandInstall: {
            url: "updateBrandInstall.do"
        },
        deleteBrandInstall: {
            url: "deleteBrandInstall.do"
        },

        queryBrandServer: {
            url: "queryBrandServer.do",
            type: "query",
            tranargs: [{
                result: "brandServers",
                args: ["cvalue"]
            }]
        },
        addBrandServer: {
            url: "addBrandServer.do",
        },
        updateBrandServer: {
            url: "updateBrandServer.do"
        },
        deleteBrandServer: {
            url: "deleteBrandServer.do"
        },

        pageContract: {
            url: "pageContract.do"
        },
        queryContract: {
            url: "queryContract.do"
        },
        queryContractByCid: {
            url: "queryContractByCid.do"
        },
        addContract: {
            url: "addContract.do"
        },
        updateContract: {
            url: "updateContract.do"
        },
        updateContractForStatus: {
            url: "updateContractForStatus.do"
        },
        countContract: {
            url: "countContract.do"
        },

        pageSignet: {
            url: "pageSignet.do"
        },
        querySignet: {
            url: "querySignet.do"
        },
        querySignetBySid: {
            url: "querySignetBySid.do"
        },
        addSignet: {
            url: "addSignet.do"
        },
        updateSignet: {
            url: "updateSignet.do"
        },
        registSignet: {
            url: "registSignet.do"
        },
        authSignet: {
            url: "authSignet.do"
        },
        confirmSignet: {
            url: "confirmSignet.do"
        },
        signateSignet: {
            url: "signateSignet.do"
        },
        autoSignet: {
            url: "autoSignet.do"
        },
        cancelSignet: {
            url: "cancelSignet.do"
        },
        copySignet: {
            url: "copySignet.do"
        },
        selectSignet: {
            url: "selectSignet.do"
        },
        moveSignet: {
            url: "moveSignet.do"
        },

        pollingSignature: {
            url: "pollingSignature.do"
        },
        defaultSignature: {
            url: "defaultSignature.do"
        },
        addSignature: {
            url: "addSignature.do"
        },
        deleteSignature: {
            url: "deleteSignature.do"
        },

        pageTalking: {
            url: "pageTalking.do"
        },
        queryTalking: {
            url: "queryTalking.do"
        },
        addTalking: {
            url: "addTalking.do"
        },
        updateTalking: {
            url: "updateTalking.do"
        },
        updateTalkingForStatus: {
            url: "updateTalkingForStatus.do"
        },
        deleteTalking: {
            url: "deleteTalking.do"
        },

        pageNormadd: {
            url: "pageNormadd.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["price"]
            }]
        },
        queryNormadd: {
            url: "queryNormadd.do",
            type: "query",
            tranargs: [{
                result: "normadds",
                args: ["price"]
            }]
        },
        addNormadd: {
            url: "addNormadd.do",
            type: "update",
            tranargs: {
                args: ["normadd.price"]
            }
        },
        updateNormaddForStatus: {
            url: "updateNormaddForStatus.do"
        },
        updateNormadd: {
            url: "updateNormadd.do",
            type: "update",
            tranargs: {
                args: ["normadd.price"]
            }
        },
        deleteNormadd: {
            url: "deleteNormadd.do"
        },

        pageQuotationNamingRule: {
            url: "pageQuotationNamingRule.do"
        },
        queryQuotationNamingRule: {
            url: "queryQuotationNamingRule.do",
            type: "query"
        },
        addQuotationNamingRule: {
            url: "addQuotationNamingRule.do"
        },
        updateQuotationNamingRule: {
            url: "updateQuotationNamingRule.do"
        },
        updateQuotationNamingRuleForStatus: {
            url: "updateQuotationNamingRuleForStatus.do"
        },
        deleteQuotationNamingRule: {
            url: "deleteQuotationNamingRule.do"
        },
        queryQuotationNamingRuleByPinyin: {
            url: "queryQuotationNamingRuleByPinyin.do",
            type: "query"
        },

        pageNormpack: {
            url: "pageNormpack.do"
        },
        queryNormpack: {
            url: "queryNormpack.do"
        },
        addNormpack: {
            url: "addNormpack.do",
            tranargs: {
                args: ["normpack.trannum"]
            }
        },
        updateNormpackForStatus: {
            url: "updateNormpackForStatus.do"
        },
        deleteNormpack: {
            url: "deleteNormpack.do"
        },

        queryNormpackItem: {
            url: "queryNormpackItem.do",
            type: "query",
            tranargs: [{
                result: "normpackItems",
                args: ["normnum", "storenum", "price"]
            }]
        },
        addNormpackItem: {
            url: "addNormpackItem.do",
            type: "update",
            tranargs: {
                args: ["normpackItem.normnum", "normpackItem.storenum", "normpackItem.price"]
            }
        },
        deleteNormpackItem: {
            url: "deleteNormpackItem.do"
        },

        pageReceiptType: {
            url: "pageReceiptType.do"
        },
        queryReceiptType: {
            url: "queryReceiptType.do",
            demo: true
        },
        queryReceiptTypeByType: {
            url: "queryReceiptTypeByType.do"
        },
        queryReceiptTypeByNo: {
            url: "queryReceiptTypeByNo.do"
        },
        addReceiptType: {
            url: "addReceiptType.do"
        },
        updateReceiptType: {
            url: "updateReceiptType.do"
        },
        updateReceiptTypeForStatus: {
            url: "updateReceiptTypeForStatus.do"
        },

        queryReceiptTypeItem: {
            url: "queryReceiptTypeItem.do"
        },
        addReceiptTypeItem: {
            url: "addReceiptTypeItem.do"
        },
        deleteReceiptTypeItem: {
            url: "deleteReceiptTypeItem.do"
        },

        pagePaymentType: {
            url: "pagePaymentType.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["taxrate"]
            }]
        },
        queryPaymentType: {
            url: "queryPaymentType.do",
            type: "query",
            tranargs: [{
                result: "paymentType",
                args: ["taxrate"]
            }]
        },
        queryPaymentTypeByPtid: {
            url: "queryPaymentTypeByPtid.do",
            type: "query",
            tranargs: [{
                result: "paymentType",
                args: ["taxrate"]
            }]
        },
        queryPaymentTypeByName: {
            url: "queryPaymentTypeByName.do",
            type: "query",
            tranargs: [{
                result: "paymentType",
                args: ["taxrate"]
            }]
        },
        addPaymentType: {
            url: "addPaymentType.do",
            type: "update",
            tranargs: {
                args: ["paymentType.taxrate"]
            }
        },
        updatePaymentType: {
            url: "updatePaymentType.do",
            type: "update",
            tranargs: {
                args: ["paymentType.taxrate"]
            }
        },
        updatePaymentTypeForStatus: {
            url: "updatePaymentTypeForStatus.do"
        },

        pageCustype: {
            url: "pageCustype.do"
        },
        queryCustype: {
            url: "queryCustype.do",
            server: "communion"
        },
        addCustype: {
            url: "addCustype.do",
            server: "communion"
        },
        updateCustype: {
            url: "updateCustype.do"
        },
        pageFlowpath: {
            url: "pageFlowpath.do"
        },
        queryFlowpath: {
            url: "queryFlowpath.do"
        },
        addFlowpath: {
            url: "addFlowpath.do"
        },
        updateFlowpath: {
            url: "updateFlowpath.do"
        },
        deleteFlowpath: {
            url: "deleteFlowpath.do"
        },

        queryFlowitem: {
            url: "queryFlowitem.do",
            type: "query",
            tranargs: [{
                result: "flowitems",
                args: ["x", "y"]
            }]
        },
        addFlowitem: {
            url: "addFlowitem.do",
            intercept: true,
            type: "update",
            tranargs: {
                args: ["flowitems.x", "flowitems.y"],
                query: [{
                    result: "flowitems",
                    args: ["x", "y"]
                }]
            }
        },
        deleteFlowItem: {
            intercept: true,
            url: "deleteFlowItem.do"

        },
        pageAssistance: {
            url: "pageAssistance.do"
        },
        queryAssistance: {
            url: "queryAssistance.do"
        },
        queryAssistanceByAid: {
            url: "queryAssistanceByAid.do"
        },
        queryAssistanceByKeyword: {
            url: "queryAssistanceByKeyword.do"
        },
        addAssistance: {
            url: "addAssistance.do"
        },
        updateAssistance: {
            url: "updateAssistance.do"
        },
        updateAssistanceForStatus: {
            url: "updateAssistanceForStatus.do"
        },
        queryAssistanceItem: {
            url: "queryAssistanceItem.do"
        },
        addAssistanceItem: {
            url: "addAssistanceItem.do"
        },
        updateAssistanceItem: {
            url: "updateAssistanceItem.do"
        },
        pageConstant: {
            url: "pageConstant.do"
        },
        queryConstant: {
            url: "queryConstant.do"
        },
        addConstant: {
            url: "addConstant.do",
            server: "communion"
        },
        updateConstant: {
            url: "updateConstant.do",
            server: "communion"
        },
        updateConstantForStatus: {
            url: "updateConstantForStatus.do",
            server: "communion"
        },
        deleteConstant: {
            url: "deleteConstant.do",
            server: "communion"
        },
        queryDecorationMeasureRule: {
            url: "queryDecorationMeasureRule.do"
        },
        pageDecorationMeasureRule: {
            url: "pageDecorationMeasureRule.do"
        },
        addDecorationMeasureRule: {
            url: "addDecorationMeasureRule.do"
        },
        updateDecorationMeasureRule: {
            url: "updateDecorationMeasureRule.do"
        },
        updateDecorationMeasureRuleForStatus: {
            url: "updateDecorationMeasureRuleForStatus.do"
        },
        deleteDecorationMeasureRule: {
            url: "deleteDecorationMeasureRule.do"
        },
        queryDecorationMeasureRuleItem: {
            url: "queryDecorationMeasureRuleItem.do"
        },
        addDecorationMeasureRuleItem: {
            url: "addDecorationMeasureRuleItem.do"
        },
        deleteDecorationMeasureRuleItem: {
            url: "deleteDecorationMeasureRuleItem.do"
        },

        pageBankAccount: {
            url: "pageBankAccount.do"
        },
        queryBankAccount: {
            url: "queryBankAccount.do"
        },
        addBankAccount: {
            url: "addBankAccount.do"
        },
        updateBankAccount: {
            url: "updateBankAccount.do"
        },
        updateBankAccountForStatus: {
            url: "updateBankAccountForStatus.do"
        },

        pageGoodsKind: {
            url: "pageGoodsKind.do"
        },
        queryGoodsKind: {
            url: "queryGoodsKind.do"
        },
        queryGoodsKindByFgkid: {
            url: "queryGoodsKindByFgkid.do"
        },
        queryGoodsKindByGkid: {
            url: "queryGoodsKindByGkid.do"
        },
        addGoodsKind: {
            url: "addGoodsKind.do"
        },
        updateGoodsKind: {
            url: "updateGoodsKind.do"
        },
        updateGoodsKindForStatus: {
            url: "updateGoodsKindForStatus.do"
        },

        pageInspect: {
            url: "pageInspect.do"
        },
        queryInspect: {
            url: "queryInspect.do"
        },
        addInspect: {
            url: "addInspect.do"
        },
        updateInspect: {
            url: "updateInspect.do"
        },
        updateInspectForStatus: {
            url: "updateInspectForStatus.do"
        },

        queryInspectItem: {
            url: "queryInspectItem.do"
        },
        addInspectItem: {
            url: "addInspectItem.do"
        },
        updateInspectItem: {
            url: "updateInspectItem.do"
        },
        deleteInspectItem: {
            url: "deleteInspectItem.do"
        },
        pageSupplierSignet: {
            url: "pageSupplierSignet.do"
        },
        querySupplierSignet: {
            url: "querySupplierSignet.do"
        },
        querySupplierSignetBySid: {
            url: "querySupplierSignetBySid.do"
        },
        addSupplierSignet: {
            url: "addSupplierSignet.do"
        },
        updateSupplierSignet: {
            url: "updateSupplierSignet.do"
        },
        registSupplierSignet: {
            url: "registSupplierSignet.do"
        },
        authSupplierSignet: {
            url: "authSupplierSignet.do"
        },
        confirmSupplierSignet: {
            url: "confirmSupplierSignet.do"
        },
        signateSupplierSignet: {
            url: "signateSupplierSignet.do"
        },
        autoSupplierSignet: {
            url: "autoSupplierSignet.do"
        },
        cancelSupplierSignet: {
            url: "cancelSupplierSignet.do"
        },
        copySupplierSignet: {
            url: "copySupplierSignet.do"
        },
        selectSupplierSignet: {
            url: "selectSupplierSignet.do"
        },
        moveSupplierSignet: {
            url: "moveSupplierSignet.do"
        },
        pageHoliday: {
            url: "pageHoliday.do"
        },
        queryHoliday: {
            url: "queryHoliday.do"
        },
        addHoliday: {
            url: "addHoliday.do"
        },
        updateHoliday: {
            url: "updateHoliday.do"
        },
        deleteHoliday: {
            url: "deleteHoliday.do"
        }
    }
});

$.extend(tools, {
    village: {
        info: function(content, vid) {

            com.post(api.data.queryVillageByVid, {
                "village.no": vid
            }, function(res) {

                var village = res.village;

                com.showTip(content, "城市:" + village.cityProper.city.name + "<br\>城区:" + village.cityProper.name + "<br\>楼盘:" + village.name, "bottom");
            });

        }
    },
    house: {
        info: function(content, hid) {

            com.post(api.data.queryHouseByHid, {
                "house.hid": hid
            }, function(res) {

                var house = res.house;

                com.showTip(content, "楼号:" + house.houseNumber + "<br\>户型:" + house.houseType + "<br\>面积:" + house.buildArea, "bottom");
            });
        }
    },
    brand: {
        info: function(content, bid) {

            com.post(api.data.queryBrandByBid, {
                "brand.bid": bid
            }, function(res) {

                var brand = res.brand;

                com.showTip(content, "品类:" + brand.categoryName + "<br\>厂商:" + brand.supplier.currentName, "bottom");
            });
        }
    }
});
