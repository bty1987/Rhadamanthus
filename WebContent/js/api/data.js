
$.extend(api.index, {
    categoryIndex: {url: "/views/data/category.html"},
    brandIndex: {url: "/views/data/brand.html"},
    customerIndex: {url: "/views/data/customer.html"},
    villageIndex: {url: "/views/data/village.html"},
	PaymentScale: {url: "/views/data/paymentScale.html"},
    houseIndex:{url: "/views/data/house.html"},
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
    queryBrandByBId: {url: "queryBrandByBId.do"},
    queryBrandByBrandId: {url: "queryBrandByBrandId.do"},
    queryBrandByCategoryId: {url: "queryBrandByCategoryId.do", demo: true},
    queryBrandForPinYinName: {url: "queryBrandForPinYinName.do"},
    queryBrandForPinYinNameACategoryName: {url: "queryBrandForPinYinNameACategoryName.do"},
    addBrand: {url: "addBrand.do", server: "communion"},
    updateBrand: {url: "updateBrand.do", server: "communion"},
    deleteBrandByBIds: {url: "deleteBrandByBIds.do", server: "communion"},

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
    updateCustomerPhoneForStatus:{url:"updateCustomerPhoneForStatus.do", server: "communion"},
    updateCustomerNameAPhone:{url:"updateCustomerNameAPhone.do", server: "communion"},
    updateCustomerPhoneForDefault:{url:"updateCustomerPhoneForDefault.do", server: "communion"},
	
    pageVillage: {url: "pageVillage.do", demo: true},
    queryVillage: {url: "queryVillage.do"},
    queryVillageById: {url: "queryVillageById.do"},
    queryVillageForNameByPinyin: {url: "queryVillageForNameByPinyin.do", demo: true},
   
    addVillage: {url: "addVillage.do", server: "communion"},
    updateVillage: {url: "updateVillage.do", server: "communion"},
    updateVillageForStatus: {url: "updateVillageForStatus.do", server: "communion"},
    updateVillageForPosition: {url: "updateVillageForPosition.do", server: "communion"},
    updateVillageForUrl : {url:"updateVillageForUrl.do",server: "communion"},
    
    pageHouse:{url:"pageHouse.do"},
    queryHouseByHid:{url:"queryHouseByHid.do"},
    queryHouseByNoAHnum:{url:"queryHouseByNoAHnum.do"},
    addHouse:{url:"addHouse.do", server: "communion"},
    updateHouse:{url:"updateHouse.do", server: "communion"},
   
    pageDrawlineGroup: {url:"pageDrawlineGroup.do"},
    queryDrawlineGroup:{url:"queryDrawlineGroup.do"},
    addDrawlineGroup: {url:"addDrawlineGroup.do"},
    updateDrawlineGroup: {url:"updateDrawlineGroup.do"},
    updateDrawlineGroupForStatus:{url:"updateDrawlineGroupForStatus.do"},


    pageMeasurementUnit:{url:"pageMeasurementUnit.do"},
    queryMeasurementUnit:{url:"queryMeasurementUnit.do"},
    addMeasurementUnit:{url:"addMeasurementUnit.do", server: "communion"},
    updateMeasurementUnit:{url:"updateMeasurementUnit.do", server: "communion"},

    pageConstructionNode:{url:"pageConstructionNode.do"},
    queryConstructionNode:{url:"queryConstructionNode.do"},
    queryConstructionNodeByCid:{url:"queryConstructionNodeByCid.do"},
    addConstructionNode:{url:"addConstructionNode.do"},
    updateConstructionNodeForStatus:{url:"updateConstructionNodeForStatus.do"},
    updateConstructionNodeCompany:{url:"updateConstructionNodeCompany.do"},
	
    queryPaymentScaleByCid:{url:"queryPaymentScaleByCid.do"},
    addPaymentScale: {url:"addPaymentScale.do"},
    deletePaymentScale: {url:"deletePaymentScale.do"},
    queryPaymentScaleItemByPsid:{url:"queryPaymentScaleItemByPsid.do"},
    addPaymentScaleItem:{url:"addPaymentScaleItem.do"},
    deletePaymentScaleItem:{url:"deletePaymentScaleItem.do"},

    queryChainPage: {url:"queryChainPage.do"},
    queryChainPageForSelf: {url:"queryChainPageForSelf.do"},
    addChainPage: {url:"addChainPage.do"},
    deleteChainPage: {url:"deleteChainPage.do"},

    pageLabel :{url : "pageLabel.do"},
    queryLabel :{url : "queryLabel.do"},
    addLabel :{url : "addLabel.do"},
    updateLabel : {url : "updateLabel.do"},
    updateLabelForStatus :{url : "updateLabelForStatus.do"},
    queryUserLabelByUid :{url : "queryUserLabelByUid.do"},
    pickUserLabel : {url : "pickUserLabel.do"},
    addUserLabel :{url : "addUserLabel.do"},
    deleteUserLabel : {url : "deleteUserLabel.do"},
}});