
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

$.extend(api, {
    data: {
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
        queryBrandByPinyin: {url: "queryBrandByPinyin.do"},
        queryBrandByPinyinForAll: {url: "queryBrandByPinyinForAll.do"},
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
        checkCustomerForPhone: {url: "checkCustomerForPhone.do", intercept: true},
        queryCustomerPhoneByCid: {url:"queryCustomerPhoneByCid.do"},

        addCustomer: {url: "addCustomer.do", server: "communion"},
        updateCustomer: {url: "updateCustomer.do", server: "communion"},
        addCustomerPhone: {url:"addCustomerPhone.do", server: "communion"},
        updateCustomerPhoneForStatus: {url:"updateCustomerPhoneForStatus.do", server: "communion", intercept: true},
        updateCustomerNameAPhone: {url:"updateCustomerNameAPhone.do", server: "communion"},
        updateCustomerPhoneForDefault: {url:"updateCustomerPhoneForDefault.do", server: "communion", intercept: true},
        existCustomer: {url:"existCustomer.do", server: "communion"},
        registCustomer: {url:"registCustomer.do", server: "communion"},
        authCustomer: {url:"authCustomer.do", server: "communion"},
        confirmCustomer: {url:"confirmCustomer.do", server: "communion"},
        signateCustomer: {url:"signateCustomer.do", server: "communion"},

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
                args: ["buildArea", "freeArea", "innerArea", "totalArea"]
            }]
        },
        queryHouseByHid: {
            url:"queryHouseByHid.do",
            type: "query",
            tranargs: [{
                result: "house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea"]
            }]
        },
        queryHouseByNoAHnum: {
            url:"queryHouseByNoAHnum.do",
            type: "query",
            tranargs: [{
                result: "house",
                args: ["buildArea", "freeArea", "innerArea", "totalArea"]
            }]
        },
        addHouse: {
            url:"addHouse.do",
            server: "communion",
            type: "update",
            tranargs: {
                args: ["house.buildArea", "house.freeArea", "house.innerArea", "house.totalArea"],
                query:[{
                    result: "house",
                    args: ["buildArea", "freeArea", "innerArea", "totalArea"]
                }]
            }
        },
        updateHouse: {
            url:"updateHouse.do",
            server: "communion",
            type: "update",
            tranargs: {
                args: ["house.buildArea", "house.freeArea", "house.innerArea", "house.totalArea"]
            }
        },
        existHouse: {
            url:"existHouse.do",
            server: "communion",
            type: "update",
            tranargs: {
                args: ["house.buildArea", "house.freeArea", "house.innerArea", "house.totalArea"]
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
                args: ["precheck", "postcheck", "stacheck", "fincheck"]
            }]
        },
        queryConstructionNode: {
            url:"queryConstructionNode.do",
            type: "query",
            tranargs: [{
                result: "contructionNodes",
                args: ["precheck", "postcheck", "stacheck", "fincheck"]
            }]
        },
        queryConstructionNodeByOrderId: {
            url:"queryConstructionNodeByOrderId.do",
            type: "query",
            tranargs: [{
                result: "contructionNodes",
                args: ["precheck", "postcheck", "stacheck", "fincheck"]
            }]
        },
        addConstructionNode: {
            url:"addConstructionNode.do",
            server: "communion",
            type: "update",
            tranargs: {
                args: ["constructionNode.precheck", "constructionNode.postcheck", "constructionNode.stacheck", "constructionNode.fincheck"]
            }
        },
        updateConstructionNode: {
            url: "updateConstructionNode.do",
            server: "communion",
            type: "update",
            tranargs: {
                args: ["constructionNode.precheck", "constructionNode.postcheck", "constructionNode.stacheck", "constructionNode.fincheck"]
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
        
        querySalesMatching: {url:"querySalesMatching.do"},
        addSalesMatching: {url:"addSalesMatching.do"},
        updateSalesMatching: {url:"updateSalesMatching.do"},
        updateSalesMatchingForStatus: {url:"updateSalesMatchingForStatus.do"},

        pageLabel : {url : "pageLabel.do"},
        queryLabel : {url : "queryLabel.do"},
        addLabel : {url : "addLabel.do"},
        updateLabel : {url : "updateLabel.do"},
        updateLabelForStatus : {url : "updateLabelForStatus.do"},
        queryUserLabelByUid : {url : "queryUserLabelByUid.do"},
        pickUserLabel : {url : "pickUserLabel.do"},
        addUserLabel : {url : "addUserLabel.do"},
        deleteUserLabel : {url : "deleteUserLabel.do"},

        pageConstructionCost: {
            url:"pageConstructionCost.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["areaLeft", "areaRight", "accessory", "salary"]
            }]
        },
        queryConstructionCost : {url : "queryConstructionCost.do"},
        addConstructionCost: {url: "addConstructionCost.do",
            type:"update",
            tranargs:{
                args: ["constructionCost.areaLeft", "constructionCost.areaRight", "constructionCost.accessory", "constructionCost.salary"]
            }},
        updateConstructionCost: {url: "updateConstructionCost.do",
            type:"update",
            tranargs:{
                args: ["constructionCost.areaLeft", "constructionCost.areaRight", "constructionCost.accessory", "constructionCost.salary"]
            }},
        updateConstructionCostForStatus: {url: "updateConstructionCostForStatus.do"},
        // 任务
        pageTask: {url: "pageTask.do"},
        queryTask: {url: "queryTask.do"},
        addTask: {url: "addTask.do"},
        updateTaskForStatus: {url: "updateTaskForStatus.do"},
        updateTaskForIsShow: {url: "updateTaskForIsShow.do"},

        pageTaskParam: {url: "pageTaskParam.do"},
        queryTaskParam: {url: "queryTaskParam.do"},
        addTaskParam: {url: "addTaskParam.do"},
        updateTaskParam: {url: "updateTaskParam.do"},
        updateTaskParamForStatus: {url: "updateTaskParamForStatus.do"},
        deleteTaskParam:{url: "deleteTaskParam.do"},
        
        pageAccessoriesType: {url: "pageAccessoriesType.do"},
        queryAccessoriesType: {url: "queryAccessoriesType.do"},
        queryAccessoriesTypeByWtid: {url: "queryAccessoriesTypeByWtid.do"},
        updateAccessoriesTypeForStatus: {url:
            "updateAccessoriesTypeForStatus.do"},
        addAccessoriesType: {url: "addAccessoriesType.do"},
        updateAccessoriesType: {url: "updateAccessoriesType.do"},

        queryColorByGid: {url: "queryColorByGid.do"},
        queryColorForEnableByGid: {url: "queryColorForEnableByGid.do"},
        addColor: {url: "addColor.do"},
        updateColorForStatus: {url: "updateColorForStatus.do"},

        queryFormatByGid: {url: "queryFormatByGid.do"},
        queryFormatForEnableByGid: {url: "queryFormatForEnableByGid.do"},
        addFormat: {url: "addFormat.do"},
        updateFormatForStatus: {url: "updateFormatForStatus.do"},

        pageGoods: {
            url: "pageGoods.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["purchase","selling","pieceNum"]
            }]
        },
        pageGoodsForAdvance: {
            url: "pageGoodsForAdvance.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["purchase","selling","pieceNum"]
            }]
        },
        queryGoods: {url: "queryGoods.do"},
        queryGoodsByNo: {url: "queryGoodsByNo.do"},
        queryGoodsByName: {
            url: "queryGoodsByName.do",
            type:"query",
            tranargs:[{
                result:"goodes",
                args: ["purchase","selling","pieceNum"]
            }]
        },
        queryGoodsByAtid: {url: "queryGoodsByAtid.do"},
        queryGoodsByBarcode: {url: "queryGoodsByBarcode.do"},
        queryGoodsByGId: {
            url: "queryGoodsByGId.do",
            type:"query",
            tranargs:[{
                result:"goods",
                args:["purchase", "selling", "pieceNum"]
            }]
        },
        queryPackage: {
            url: "queryPackage.do",
            type:"query",
            tranargs:[{
                result:"goodsPackages",
                args:["num"]
            },{
                result:"goodsPackages-goods",
                args:["purchase", "selling", "pieceNum"]
            }]
        },
        addGoods: {
            url: "addGoods.do",
            type: "update",
            tranargs: {
                args: ["goods.pieceNum", "goods.purchase", "goods.selling"]
            }
        },
        addPackage: {
            url: "addPackage.do",
            type: "update",
            tranargs: {
                args: ["goodsPackages.num"]
            }

        },
        updateGoods: {
            url: "updateGoods.do",
            type: "update",
            tranargs: {
                args: ["goods.pieceNum", "goods.purchase", "goods.selling"]
            }
        },
        updateGoodsForStatus: {url: "updateGoodsForStatus.do"},

        queryPriceByGid: {
            url: "queryPriceByGid.do",
            type:"query",
            tranargs:[{
                result:"prices",
                args:["purchase","selling","cvalue"]
            }]
        },
        queryPriceByPid: {url: "queryPriceByPid.do",
            type:"query",
            tranargs:[{
                result:"price",
                args:["purchase","selling","cvalue"]
            }]
        },
        addPrice: {
            url: "addPrice.do",
            type: "update",
            tranargs: {
                args: ["price.purchase", "price.selling", "price.cvalue"]
            }
        },
        deletePrice: {url: "deletePrice.do"},
        updatePriceForStatus: {url: "updatePriceForStatus.do"},

        pageAoods: {
            url: "pageAoods.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["totalimit"]
            },{
                result:"paging-data-goods",
                args:["purchase", "selling", "pieceNum"]
            }]
        },
        queryAoodsByName:{
            url: "queryAoodsByName.do",
            type:"query",
            tranargs:[{
                result:"aoodes-goods",
                args: ["purchase","selling","pieceNum"]
            }]
        },
        queryAoodsByAtid:{
            url: "queryAoodsByAtid.do",
            type:"query",
            tranargs:[{
                result:"aoodes-goods",
                args: ["purchase","selling","pieceNum"]
            }]
        },
        addAoods: {
            url: "addAoods.do",
            type: "update",
            tranargs: {
                args: ["aoods.totalimit"]
            }
        },
        updateAoods: {
            url: "updateAoods.do",
            type: "update",
            tranargs: {
                args: ["aoods.totalimit"]
            }
        },
        updateAoodsForStatus: {url: "updateAoodsForStatus.do"},

        pageSoods: {
            url: "pageSoods.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["num", "selling"]
            },{
                result:"paging-data-goods",
                args:["purchase", "selling", "pieceNum"]
            }]
        },
        pageSoodsByQiid: {
            url: "pageSoodsByQiid.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["num", "selling"]
            },{
                result:"paging-data-goods",
                args:["purchase", "selling", "pieceNum"]
            }]
        },
        querySoodsByQiid: {
            url: "querySoodsByQiid.do",
            type:"query",
            tranargs:[
                {
                    result:"soodes",
                    args: ["num", "selling"]
                },{
                    result:"soodes-goods",
                    args: ["pieceNum","purchase","selling"]
                }]
        },
        addSoods: {
            url: "addSoods.do",
            type: "update",
            tranargs: {
                args: ["soods.num", "soods.selling"]
            }
        },
        updateSoods: {
            url: "updateSoods.do",
            type: "update",
            tranargs: {
                args: ["soods.selling"]
            }
        },
        deleteSoods: {url: "deleteSoods.do"},

        pageAoodsCost: {
            url: "pageAoodsCost.do",
            type: "query",
            tranargs: [{
                result: "paging-data",
                args: ["numLimit"]
            },{
                result:"paging-data-constructionCost",
                args:["areaLeft", "areaRight", "accessory", "salary"]
            }]
        },
        addAoodsCost: {
            url: "addAoodsCost.do",
            type: "update",
            tranargs: {
                args: ["aoodsCost.numLimit"]
            }
        },
        deleteAoodsCost: {url: "deleteAoodsCost.do"},

        queryHouseLayout:{
            url:"queryHouseLayout.do",
            type: "query",
            tranargs: [{
                result:"houseLayouts",
                args:["area"]
            }]
        },
        addHouseLayout:{
            url:"addHouseLayout.do",
            server: "communion",
            type: "update",
            tranargs: {
                args: ["houseLayout.Area"]
            }
        },
        deleteHouseLayout:{url:"deleteHouseLayout.do", server: "communion"},

        // 定额
        queryNormriceByQiid: {
            url: "queryNormriceByQiid.do",
            type: "query",
            tranargs: [{
                result: "normrices",
                args: ["trannum", "salary"]
            },{
                result: "normrices-constructionNode",
                args: ["precheck", "postcheck", "stacheck", "fincheck"]
            }]
        },
        addNormrice: {
            url: "addNormrice.do",
            type: "update",
            tranargs: {
                args: ["normrice.trannum", "normrice.salary"]
            }
        },
        deleteNormrice: {url: "deleteNormrice.do"},

        
        queryNormoodByQiid: {
            url: "queryNormoodByQiid.do",
            type: "query",
            tranargs: [{
                result: "normoods",
                args: ["num"]
            }, {
                result: "normoods-goods",
                args: ["purchase", "selling", "pieceNum"]
            }]
        },
        addNormood: {
            url: "addNormood.do",
            type: "update",
            tranargs: {
                args: ["normood.num"]
            }
        },
        deleteNormood: {url: "deleteNormood.do"},
        
        pageChart:{url:"pageChart.do"},
        queryChart:{url:"queryChart.do"},
        queryChartForLogin:{url:"queryChartForLogin.do"},
        queryChartByRid:{url:"queryChartByRid.do"},
        updateRoleChartByRid:{url:"updateRoleChartByRid.do"},

        queryDecorationMatching:{
            url:"queryDecorationMatching.do",
            type: "query",
            tranargs: [{
                result: "decorationMatchings",
                args: ["base","discount","material","service"]
            }]
        },
        addDecorationMatching:{
            url:"addDecorationMatching.do",
            type: "update",
            tranargs: {
                args: ["decorationMatching.base","decorationMatching.discount","decorationMatching.material","decorationMatching.service"]
            }
        },
        updateDecorationMatching:{
            url:"updateDecorationMatching.do",
            type: "update",
            tranargs: {
                args: ["decorationMatching.base","decorationMatching.discount","decorationMatching.material","decorationMatching.service"]
            }
        },
        queryTaskRoleRightByUserId :{url:"queryTaskRoleRightByUserId.do"},
        updateTaskRoleRight : {url:"updateTaskRoleRight.do"},

        queryBrandBalance :{
            url:"queryBrandBalance.do",
            type: "query",
            tranargs: [{
                result: "brandBalances",
                args: ["cvalue"]
            }]
        },
        addBrandBalance :{
            url:"addBrandBalance.do",
            type: "update",
            tranargs: {
                args: ["brandBalance.cvalue"]
            }
        },
        deleteBrandBalance :{url:"deleteBrandBalance.do"},
        
        pageContract:{url:"pageContract.do"},
        queryContract:{url:"queryContract.do"},
        addContract:{url:"addContract.do"},
        updateContract: {url: "updateContract.do"},
        updateContractForStatus: {url: "updateContractForStatus.do"},
        
        pageSignet: {url:"pageSignet.do"},
        querySignet: {url:"querySignet.do"},
        addSignet: {url:"addSignet.do"},
        updateSignet: {url:"updateSignet.do"},
        registSignet: {url:"registSignet.do"},
        authSignet: {url:"authSignet.do"},
        confirmSignet: {url:"confirmSignet.do"},
        signateSignet: {url:"signateSignet.do"},
        signateAuto: {url:"signateAuto.do"},
        
        pageTalking:{url:"pageTalking.do"},
        queryTalking:{url:"queryTalking.do"},
        addTalking:{url:"addTalking.do"},
        updateTalking:{url:"updateTalking.do"},
        updateTalkingForStatus:{url:"updateTalkingForStatus.do"},
        deleteTalking:{url:"deleteTalking.do"},

        pageAdditem: {url:"pageAdditem.do"},
        queryAdditem: {url:"queryAdditem.do"},
        addAdditem: {url:"addAdditem.do"},
        updateAdditemForStatus: {url:"updateAdditemForStatus.do"},
        deleteAdditem: {url:"deleteAdditem.do"},
    }
});