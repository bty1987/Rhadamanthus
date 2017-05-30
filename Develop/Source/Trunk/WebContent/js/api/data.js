
$.extend(api.index, {
    categoryIndex: {url: "/views/data/category.html"},
    brandIndex: {url: "/views/data/brand.html"},
    customerIndex: {url: "/views/data/customer.html"},
    villageIndex: {url: "/views/data/village.html"}
});

$.extend(api.ds, {
    customerInfo: {url: "ds/customerInfo.json", demo: true}
});

$.extend(api, {data: {
    
    pageSupplier: {url: "pageSupplier.do", demo: true},
    addSupplier: {url: "addSupplier.do", server: "communionServer"},
    updateSupplier: {url: "updateSupplier.do", server: "communionServer"},
    updateSupplierForLogin: {url: "updateSupplierForLogin.do", server: "communionServer"},
    updateSupplierForPassword: {url: "updateSupplierForPassword.do", server: "communionServer"},

    querySupplierUserRightBySId: {url: "querySupplierUserRightBySId.do", demo: true},
    updateSupplierUserRight: {url: "updateSupplierUserRight.do", server: "communionServer"},

    pageBrand: {url: "pageBrand.do", demo: true},
    queryBrand: {url: "queryBrand.do", demo: true},
    queryBrandByBId: {url: "queryBrandByBId.do"},
    queryBrandByBrandId: {url: "queryBrandByBrandId.do"},
    queryBrandByCategoryId: {url: "queryBrandByCategoryId.do", demo: true},
    queryBrandForPinYinName: {url: "queryBrandForPinYinName.do"},
    queryBrandForPinYinNameACategoryName: {url: "queryBrandForPinYinNameACategoryName.do"},
    addBrand: {url: "addBrand.do", server: "communionServer"},
    updateBrand: {url: "updateBrand.do", server: "communionServer"},
    deleteBrandByBIds: {url: "deleteBrandByBIds.do", server: "communionServer"},

    queryBrandUserRightForUserId: {url: "queryBrandUserRightForUserId.do"},
    queryBrandUserRightForLogin: {url: "queryBrandUserRightForLogin.do"},
    updateBrandUserRight: {url: "updateBrandUserRight.do", server: "communionServer"},

    pageCategory: {url: "pageCategory.do", demo: true},
    queryCategory: {url: "queryCategory.do", demo: true},
    queryCategoryByCId: {url: "queryCategoryByCId.do"},
    addCategory: {url: "addCategory.do", server: "communionServer"},
    updateCategory: {url: "updateCategory.do", server: "communionServer"},
    deleteCategoryByCIds: {url: "deleteCategoryByCIds.do", server: "communionServer"},

    pageCustomer: {url: "pageCustomer.do", demo: true},
    queryCustomerById: {url: "queryCustomerById.do"},
    queryCustomerForName: {url: "queryCustomerForName.do"},
    checkCustomerForPhone: {url: "checkCustomerForPhone.do"},
    addCustomer: {url: "addCustomer.do", server: "communionServer"},
    updateCustomer: {url: "updateCustomer.do", server: "communionServer"},
    updateCustomerForBalance: {url: "updateCustomerForBalance.do", server: "communionServer"},

    pageVillage: {url: "pageVillage.do", demo: true},
    queryVillage: {url: "queryVillage.do"},
    queryVillageById: {url: "queryVillageById.do"},
    queryVillageForNameByPinyin: {url: "queryVillageForNameByPinyin.do", demo: true},
    addVillage: {url: "addVillage.do", server: "communionServer"},
    updateVillage: {url: "updateVillage.do", server: "communionServer"},
    updateVillageForStatus: {url: "updateVillageForStatus.do", server: "communionServer"},
    updateVillageForPosition: {url: "updateVillageForPosition.do", server: "communionServer"}
    
}});