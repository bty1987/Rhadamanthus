
$.extend(api.index, {
    categoryIndex: {url: "/views/data/category.html"},
    brandIndex: {url: "/views/data/brand.html"},
    customerIndex: {url: "/views/data/customer.html"},
    villageIndex: {url: "/views/data/village.html"},
	paymentScale: {url: "/views/data/paymentScale.html"},
    houseIndex: {url: "/views/data/house.html"},
    checkUser: {url: "/views/data/checkUser.html"},
    userLabel: {url: "/views/data/userLabel.html"},
});

$.extend(api, {data: {
    
    pageSupplier: {url: "pageSupplier.do", demo: true},
    addSupplier: {url: "addSupplier.do", server: "communion"},
    updateSupplier: {url: "updateSupplier.do", server: "communion"},
    updateSupplierForLogin: {url: "updateSupplierForLogin.do", server: "communion"},
    updateSupplierForPassword: {url: "updateSupplierForPassword.do", server: "communion"},

    querySupplierUserRightBySId: {url: "querySupplierUserRightBySId.do", demo: true},
    updateSupplierUserRight: {url: "updateSupplierUserRight.do", server: "communion"},

    pageBrand: {url: "pageBrand.do", demo: true},
    queryBrand: {url: "queryBrand.do", demo: true},
    queryBrandByBid: {url: "queryBrandByBid.do"},
    queryBrandByNo: {url: "queryBrandByNo.do"},
    queryBrandByCid: {url: "queryBrandByCid.do", demo: true},
    queryBrandForPinYinName: {url: "queryBrandForPinYinName.do"},
    queryBrandForPinYinNameAname: {url: "queryBrandForPinYinNameAname.do"},
    addBrand: {url: "addBrand.do", server: "communion"},
    updateBrand: {url: "updateBrand.do", server: "communion"},
    deleteBrandByBids: {url: "deleteBrandByBids.do", server: "communion"},

    pageCategory: {url: "pageCategory.do", demo: true},
    queryCategory: {url: "queryCategory.do", demo: true},
    queryCategoryByCId: {url: "queryCategoryByCId.do"},
    addCategory: {url: "addCategory.do", server: "communion"},
    updateCategory: {url: "updateCategory.do", server: "communion"},
    deleteCategoryByCIds: {url: "deleteCategoryByCIds.do", server: "communion"},

    pageCustomer: {url: "pageCustomer.do", demo: true},
    queryCustomerById: {url: "queryCustomerById.do"},
    queryCustomerForName: {url: "queryCustomerForName.do"},
    checkCustomerForPhone: {url: "checkCustomerForPhone.do"},
    queryCustomerPhoneByCid: {url:"queryCustomerPhoneByCid.do"},
  
    addCustomer: {url: "addCustomer.do", server: "communion"},
    updateCustomer: {url: "updateCustomer.do", server: "communion"},
    addCustomerPhone: {url:"addCustomerPhone.do", server: "communion"},
    updateCustomerPhoneForStatus: {url:"updateCustomerPhoneForStatus.do", server: "communion"},
    updateCustomerNameAPhone: {url:"updateCustomerNameAPhone.do", server: "communion"},
    updateCustomerPhoneForDefault: {url:"updateCustomerPhoneForDefault.do", server: "communion"},
    existCustomer: {url:"existCustomer.do", server: "communion"},
	
    pageVillage: {url: "pageVillage.do", demo: true},
    queryVillage: {url: "queryVillage.do"},
    queryVillageById: {url: "queryVillageById.do"},
    queryVillageForNameByPinyin: {url: "queryVillageForNameByPinyin.do", demo: true},
   
    addVillage: {url: "addVillage.do", server: "communion"},
    updateVillage: {url: "updateVillage.do", server: "communion"},
    updateVillageForStatus: {url: "updateVillageForStatus.do", server: "communion"},
    updateVillageForPosition: {url: "updateVillageForPosition.do", server: "communion"},
    updateVillageForUrl : {url:"updateVillageForUrl.do",server: "communion"},
    
    pageHouse: {
        url:"pageHouse.do",
        type: "query", 
        tranargs: [{
            result: "paging-data", 
            args: ["buildArea"]
        }]
    },
    queryHouseByHid: {
        url:"queryHouseByHid.do",
        type: "query", 
        tranargs: [{
            result: "house", 
            args: ["buildArea"]
        }]
    },
    queryHouseByNoAHnum: {
        url:"queryHouseByNoAHnum.do",
        type: "query", 
        tranargs: [{
            result: "house", 
            args: ["buildArea"]
        }]
    },
    addHouse: {
        url:"addHouse.do", 
        server: "communion",
        type: "update",
        tranargs: {
            args: ["house.buildArea"],
            query:[{
                result: "house",
                args:["buildArea"]
            }]
        }
    },
    updateHouse: {
        url:"updateHouse.do", 
        server: "communion",
        type: "update",
        tranargs: {
            args: ["house.buildArea"]
        }
    },
    existHouse: {
        url:"existHouse.do", 
        server: "communion",
        type: "update",
        tranargs: {
            args: ["house.buildArea"]
        }
    },
   
    pageDrawlineGroup: {url:"pageDrawlineGroup.do"},
    queryDrawlineGroup: {url:"queryDrawlineGroup.do"},
    addDrawlineGroup: {url:"addDrawlineGroup.do"},
    updateDrawlineGroup: {url:"updateDrawlineGroup.do"},
    updateDrawlineGroupForStatus: {url:"updateDrawlineGroupForStatus.do"},

    pageMeasurementUnit: {url:"pageMeasurementUnit.do"},
    queryMeasurementUnit: {url:"queryMeasurementUnit.do"},
    addMeasurementUnit: {url:"addMeasurementUnit.do", server: "communion"},
    updateMeasurementUnit: {url:"updateMeasurementUnit.do", server: "communion"},

    pageConstructionNode: {
        url:"pageConstructionNode.do",
        type: "query", 
        tranargs: [{
            result: "paging-data", 
            args: ["precheck", "postcheck"]
        }]
    },
    queryConstructionNode: {
        url:"queryConstructionNode.do",
        type: "query", 
        tranargs: [{
            result: "contructionNodes", 
            args: ["precheck", "postcheck"]
        }]
    },
    queryConstructionNodeByOrderId: {
        url:"queryConstructionNodeByOrderId.do",
        type: "query", 
        tranargs: [{
            result: "contructionNodes", 
            args: ["precheck", "postcheck"]
        }]
    },
    addConstructionNode: {
        url:"addConstructionNode.do", 
        server: "communion",
        type: "update",
        tranargs: {
            args: ["constructionNode.precheck", "constructionNode.postcheck"]
        }
    },
    updateConstructionNode: {
        url: "updateConstructionNode.do", 
        server: "communion",
        type: "update",
        tranargs: {
            args: ["constructionNode.precheck", "constructionNode.postcheck"]
        }
    },
    updateConstructionNodeForStatus: {url:"updateConstructionNodeForStatus.do", server: "communion"},
	
    queryPaymentScaleByCid: {url:"queryPaymentScaleByCid.do"},
    addPaymentScale: {url:"addPaymentScale.do",},
    deletePaymentScale: {url:"deletePaymentScale.do"},
    queryPaymentScaleItemByPsid: {
        url:"queryPaymentScaleItemByPsid.do",
        type: "query", 
        tranargs: [{
            result: "paymentScaleItems", 
            args: ["scale"]
        }]
    },
    addPaymentScaleItem: {
        url:"addPaymentScaleItem.do", 
        server: "communion",
        type: "update",
        tranargs: {
            args: ["paymentScaleItem.scale"]
        }
    },
    deletePaymentScaleItem: {url:"deletePaymentScaleItem.do"},

    queryChainPage: {url:"queryChainPage.do"},
    queryChainPageForSelf: {url:"queryChainPageForSelf.do"},
    addChainPage: {url:"addChainPage.do"},
    deleteChainPage: {url:"deleteChainPage.do"},

    pageLabel : {url : "pageLabel.do"},
    queryLabel : {url : "queryLabel.do"},
    addLabel : {url : "addLabel.do"},
    updateLabel : {url : "updateLabel.do"},
    updateLabelForStatus : {url : "updateLabelForStatus.do"},
    queryUserLabelByUid : {url : "queryUserLabelByUid.do"},
    pickUserLabel : {url : "pickUserLabel.do"},
    addUserLabel : {url : "addUserLabel.do"},
    deleteUserLabel : {url : "deleteUserLabel.do"},
}});