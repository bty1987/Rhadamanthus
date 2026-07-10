$.extend(api.index, {

});

$.extend(api, {
    right: {
        queryDecorationDesignDepartmentRightByUserId: {
            url: "queryDecorationDesignDepartmentRightByUserId.do",
            demo: true
        },
        queryDecorationSalesmanDepartmentRightByUserId: {
            url: "queryDecorationSalesmanDepartmentRightByUserId.do",
            demo: true
        },
        queryDecorationStatusRightByUserId: {
            url: "queryDecorationStatusRightByUserId.do",
            demo: true
        },

        updateDecorationDesignDepartmentRight: {
            url: "updateDecorationDesignDepartmentRight.do"
        },
        updateDecorationSalesmanDepartmentRight: {
            url: "updateDecorationSalesmanDepartmentRight.do"
        },
        updateDecorationStatusRight: {
            url: "updateDecorationStatusRight.do"
        },
        
        syncDecorationRight: {
            url: "syncDecorationRight.do"
        },

        queryRoleChainPageByRid: {
            url: "queryRoleChainPageByRid.do"
        },
        updateRoleChainPage: {
            url: "updateRoleChainPage.do"
        },

        queryBrandUserRightByUid: {
            url: "queryBrandUserRightByUid.do",
            demo: true
        },
        queryBrandUserRightForLogin: {
            url: "queryBrandUserRightForLogin.do",
            demo: true
        },
        updateBrandUserRight: {
            url: "updateBrandUserRight.do"
        },

        queryHouseSourceDepartmentRightByUserId: {
            url: "queryHouseSourceDepartmentRightByUserId.do"
        },
        updateHouseSourceDepartmentRight: {
            url: "updateHouseSourceDepartmentRight.do"
        },

        queryCustomerSourceDepartmentRightByUserId: {
            url: "queryCustomerSourceDepartmentRightByUserId.do"
        },
        updateCustomerSourceDepartmentRight: {
            url: "updateCustomerSourceDepartmentRight.do"
        },

        queryTaskUserRightByUserId: {
            url: "queryTaskUserRightByUserId.do"
        },
        updateTaskUserRight: {
            url: "updateTaskUserRight.do"
        },

        queryDecorationFunctionRightByName: {
            url: "queryDecorationFunctionRightByName.do"
        },
        updateDecorationFunctionRight: {
            url: "updateDecorationFunctionRight.do"
        },
        syncDecorationFunctionRight: {
            url: "syncDecorationFunctionRight.do"
        },

        queryProductionFunctionRightByName: {
            url: "queryProductionFunctionRightByName.do"
        },
        updateProductionFunctionRight: {
            url: "updateProductionFunctionRight.do"
        },

        queryPaymentFunctionRight: {
            url: "queryPaymentFunctionRight.do"
        },
        updatePaymentFunctionRight: {
            url: "updatePaymentFunctionRight.do"
        },

        querySalesFunctionRightByName: {
            url: "querySalesFunctionRightByName.do"
        },
        updateSalesFunctionRight: {
            url: "updateSalesFunctionRight.do"
        },

        queryConstructionFunctionRightByName: {
            url: "queryConstructionFunctionRightByName.do"
        },
        updateConstructionFunctionRight: {
            url: "updateConstructionFunctionRight.do"
        },

        queryCustomerFunctionRight: {
            url: "queryCustomerFunctionRight.do"
        },
        updateCustomerFunctionRight: {
            url: "updateCustomerFunctionRight.do"
        },

        querySalesDeliveryStatusRight: {
            url: "querySalesDeliveryStatusRight.do",
            type: "query",
            tranargs: [{
                result: "salesDeliveryStatusRights",
                args: ["crate"]
            }]
        },
        updateSalesDeliveryStatusRight: {
            url: "updateSalesDeliveryStatusRight.do",
            type: "update",
            tranargs: {
                args: ["salesDeliveryStatusRights.crate"]
            }
        },

        queryQuotationFunctionRight: {
            url: "queryQuotationFunctionRight.do"
        },
        updateQuotationFunctionRight: {
            url: "updateQuotationFunctionRight.do"
        },

        queryUserFunctionRight: {
            url: "queryUserFunctionRight.do"
        },
        updateUserFunctionRight: {
            url: "updateUserFunctionRight.do"
        },

        queryApprovalFunctionRight: {
            url: "queryApprovalFunctionRight.do"
        },
        updateApprovalFunctionRight: {
            url: "updateApprovalFunctionRight.do"
        },

        querySelectionItemStatusRight: {
            url: "querySelectionItemStatusRight.do"
        },
        updateSelectionItemStatusRight: {
            url: "updateSelectionItemStatusRight.do"
        },
        
    }
});
