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
    assistanceitemIndex: {
        url: "/views/data/assistanceItem.html"
    },
    goods4condition: {
        url: "/views/data/goods4condition.html"
    },
    village4rule: {
        url: "/views/data/village4rule.html"
    },
    inspectItem: {
        url: "/views/data/inspectItem.html"
    }
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
        queryBrandByPinyinForAll: {
            url: "queryBrandByPinyinForAll.do"
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
            demo: true
        },
        queryVillage: {
            url: "queryVillage.do"
        },
        queryVillageByVid: {
            url: "queryVillageByVid.do"
        },
        queryVillageForNameByPinyin: {
            url: "queryVillageForNameByPinyin.do",
            demo: true
        },
        addVillage: {
            url: "addVillage.do",
            server: "communion"
        },
        updateVillage: {
            url: "updateVillage.do",
            server: "communion"
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
            url: "pageConstructionPace.do"
        },
        queryConstructionPace: {
            url: "queryConstructionPace.do"
        },
        addConstructionPace: {
            url: "addConstructionPace.do"
        },
        updateConstructionPace: {
            url: "updateConstructionPace.do"
        },
        updateConstructionPaceForStatus: {
            url: "updateConstructionPaceForStatus.do"
        },

        pageConstructionPeriod: {
            url: "pageConstructionPeriod.do"
        },
        addConstructionPeriod: {
            url: "addConstructionPeriod.do"
        },
        updateConstructionPeriod: {
            url: "updateConstructionPeriod.do"
        },
        deleteConstructionPeriod: {
            url: "deleteConstructionPeriod.do"
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
                args: ["precheck", "postcheck", "stacheck", "fincheck"]
            }]
        },
        queryConstructionNode: {
            url: "queryConstructionNode.do",
            type: "query",
            tranargs: [{
                result: "contructionNodes",
                args: ["precheck", "postcheck", "stacheck", "fincheck"]
            }]
        },
        queryConstructionNodeByCnid: {
            url: "queryConstructionNodeByCnid.do",
            type: "query",
            tranargs: [{
                result: "contructionNode",
                args: ["precheck", "postcheck", "stacheck", "fincheck"]
            }]
        },
        queryConstructionNodeByOrderId: {
            url: "queryConstructionNodeByOrderId.do",
            type: "query",
            tranargs: [{
                result: "contructionNodes",
                args: ["precheck", "postcheck", "stacheck", "fincheck"]
            }]
        },
        addConstructionNode: {
            url: "addConstructionNode.do",
            type: "update",
            tranargs: {
                args: ["constructionNode.precheck", "constructionNode.postcheck", "constructionNode.stacheck", "constructionNode.fincheck"]
            }
        },
        updateConstructionNode: {
            url: "updateConstructionNode.do",
            type: "update",
            tranargs: {
                args: ["constructionNode.precheck", "constructionNode.postcheck", "constructionNode.stacheck", "constructionNode.fincheck"]
            }
        },
        updateConstructionNodeForStatus: {
            url: "updateConstructionNodeForStatus.do"
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
        

        queryPackage: {
            url: "queryPackage.do",
            type: "query",
            tranargs: [{
                result: "goodsPackages",
                args: ["num"]
            }, {
                result: "goodsPackages-goods",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        addPackage: {
            url: "addPackage.do",
            type: "update",
            tranargs: {
                args: ["goodsPackages.num"]
            }

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
                args: ["totalimit", "balance", "selling"]
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
                args: ["totalimit", "balance", "selling"]
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
                args: ["totalimit", "balance", "selling"]
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
                args: ["totalimit", "balance", "selling"]
            }, {
                result: "aoodes-goods",
                args: ["purchase", "selling", "pieceNum", "confine"]
            }]
        },
        addAoods: {
            url: "addAoods.do",
            type: "update",
            tranargs: {
                args: ["aoods.totalimit", "aoods.balance", "aoods.selling"]
            }
        },
        updateAoods: {
            url: "updateAoods.do",
            type: "update",
            tranargs: {
                args: ["aoods.totalimit", "aoods.balance", "aoods.selling"]
            }
        },
        updateAoodsForStatus: {
            url: "updateAoodsForStatus.do"
        },
        updateAoodsForNorm: {
            url: "updateAoodsForNorm.do"
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
                args: ["selling", "balance"]
            }]
        },
        queryNoods: {
            url: "queryNoods.do",
            type: "query",
            tranargs: [{
                result: "noodes",
                args: ["selling", "balance"]
            }]
        },
        queryNoodsByName: {
            url: "queryNoodsByName.do",
            type: "query",
            tranargs: [{
                result: "noodes",
                args: ["selling", "balance"]
            }]
        },
        addNoods: {
            url: "addNoods.do",
            type: "update",
            tranargs: {
                args: ["noods.selling", "noods.balance"]
            }
        },
        updateNoods: {
            url: "updateNoods.do",
            type: "update",
            tranargs: {
                args: ["noods.selling", "noods.balance"]
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
            demo: true
        },
        queryDecorationBusitype: {
            url: "queryDecorationBusitype.do"
        },
        addDecorationBusitype: {
            url: "addDecorationBusitype.do"
        },
        updateDecorationBusitype: {
            url: "updateDecorationBusitype.do"
        },
        updateDecorationBusitypeForStatus: {
            url: "updateDecorationBusitypeForStatus.do"
        },

        pageDecorationAtttype: {
            url: "pageDecorationAtttype.do",
            demo: true
        },
        queryDecorationAtttype: {
            url: "queryDecorationAtttype.do"
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
        deleteNormadd: {
            url: "deleteNormadd.do"
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