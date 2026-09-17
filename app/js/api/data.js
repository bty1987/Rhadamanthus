/**
 * app/js/api/data.js —— data（主数据）模块 API 定义
 *
 * data 是最大模块（98 页、443 接口、140 tranargs、54 communion）。
 * 本批先迁核心基础数据子域：color/format/bankAccount/category。
 * 后续子域（brand/village/house/customer/goods 等）逐步迁入。
 */

// ===== 颜色 color =====
$.extend(api, { data: {

    // ===== 颜色 color =====
    queryColorByGid:      { url: 'queryColorByGid.do', demo: true },
    addColor:             { url: 'addColor.do' },
    updateColorForStatus: { url: 'updateColorForStatus.do' },

    // ===== 规格 format =====
    queryFormatByGid:      { url: 'queryFormatByGid.do', demo: true },
    addFormat:             { url: 'addFormat.do' },
    updateFormatForStatus:{ url: 'updateFormatForStatus.do' },

    // ===== 银行账户 bankAccount =====
    pageBankAccount:            { url: 'pageBankAccount.do' },
    addBankAccount:             { url: 'addBankAccount.do' },
    updateBankAccount:          { url: 'updateBankAccount.do' },
    updateBankAccountForStatus: { url: 'updateBankAccountForStatus.do' },

    // ===== 品类 category =====
    pageCategory:    { url: 'pageCategory.do' },
    queryCategory:   { url: 'queryCategory.do', type: 'query' },
    queryCategoryFormatByCid: { url: 'queryCategoryFormatByCid.do' },
    addCategoryFormat:        { url: 'addCategoryFormat.do' },
    updateCategoryFormat:     { url: 'updateCategoryFormat.do' },
    deleteCategoryFormat:     { url: 'deleteCategoryFormat.do' },
    addCategory:     { url: 'addCategory.do' },
    updateCategory:  { url: 'updateCategory.do' },

    // ===== 品牌 brand（关联 category）=====
    pageBrand:            { url: 'pageBrand.do' },
    addBrand:             { url: 'addBrand.do' },
    updateBrand:          { url: 'updateBrand.do' },
    updateBrandForStatus: { url: 'updateBrandForStatus.do' },

    // ===== 楼盘 village =====
    pageVillage:            { url: 'pageVillage.do' },
    queryVillageByVid:      { url: 'queryVillageByVid.do' },
    queryVillageForNameByPinyin: { url: 'queryVillageForNameByPinyin.do' },
    addVillage:             { url: 'addVillage.do' },
    updateVillage:          { url: 'updateVillage.do' },
    updateVillageForStatus: { url: 'updateVillageForStatus.do' },

    // ===== 房屋 house（关联 village）=====
    pageHouse:     { url: 'pageHouse.do' },
    addHouse:      { url: 'addHouse.do' },
    updateHouse:   { url: 'updateHouse.do' },

    // ===== 施工工费 constructionCost =====
    pageConstructionCost:            { url: 'pageConstructionCost.do' },
    addConstructionCost:             { url: 'addConstructionCost.do' },
    updateConstructionCost:          { url: 'updateConstructionCost.do' },
    updateConstructionCostForStatus: { url: 'updateConstructionCostForStatus.do' },

    // ===== 供应商 supplier =====
    pageSupplier:            { url: 'pageSupplier.do' },
    addSupplier:             { url: 'addSupplier.do' },
    updateSupplier:          { url: 'updateSupplier.do' },
    updateSupplierForLogin:  { url: 'updateSupplierForLogin.do' },

    // ===== 辅料品类 accessoriesType =====
    pageAccessoriesType:    { url: 'pageAccessoriesType.do' },
    addAccessoriesType:     { url: 'addAccessoriesType.do' },
    updateAccessoriesType:  { url: 'updateAccessoriesType.do' },
    updateAccessoriesTypeForStatus: { url: 'updateAccessoriesTypeForStatus.do' },

    // ===== 品牌产品/服务/配送/安装（结构相同，增删查）=====
    queryBrandProduct: { url: 'queryBrandProduct.do' }, addBrandProduct: { url: 'addBrandProduct.do' }, deleteBrandProduct: { url: 'deleteBrandProduct.do' },
    queryBrandServer:  { url: 'queryBrandServer.do' },  addBrandServer:  { url: 'addBrandServer.do' },  deleteBrandServer:  { url: 'deleteBrandServer.do' },
    queryBrandDeliver: { url: 'queryBrandDeliver.do' }, addBrandDeliver: { url: 'addBrandDeliver.do' }, deleteBrandDeliver: { url: 'deleteBrandDeliver.do' },
    queryBrandInstall: { url: 'queryBrandInstall.do' }, addBrandInstall: { url: 'addBrandInstall.do' }, deleteBrandInstall: { url: 'deleteBrandInstall.do' },

    // ===== 品牌池 brandPool（CRUD + 状态）=====
    pageBrandPool:            { url: 'pageBrandPool.do' },
    addBrandPool:             { url: 'addBrandPool.do' },
    updateBrandPool:          { url: 'updateBrandPool.do' },
    updateBrandPoolForStatus: { url: 'updateBrandPoolForStatus.do' },

    // ===== 施工节点 constructionNode（下拉用）=====
    pageConstructionNode: { url: 'pageConstructionNode.do' },
    queryConstructionNode: { url: 'queryConstructionNode.do' },
    addConstructionNode: { url: 'addConstructionNode.do' },
    updateConstructionNode: { url: 'updateConstructionNode.do' },
    updateConstructionNodeForStatus: { url: 'updateConstructionNodeForStatus.do' },

    // ===== 辅料成本 aoodsCost（增删）=====
    pageAoodsCost:    { url: 'pageAoodsCost.do' },
    addAoodsCost:     { url: 'addAoodsCost.do' },
    deleteAoodsCost:  { url: 'deleteAoodsCost.do' },

    // ===== 帮助文档 assistance =====
    pageAssistance:    { url: 'pageAssistance.do' },
    addAssistance:     { url: 'addAssistance.do' },
    updateAssistance:  { url: 'updateAssistance.do' },
    queryAssistanceItem: { url: 'queryAssistanceItem.do' },
    addAssistanceItem: { url: 'addAssistanceItem.do' },
    updateAssistanceItem: { url: 'updateAssistanceItem.do' },

    // ===== 常量 constant =====
    pageConstant:          { url: 'pageConstant.do' },
    queryConstant:         { url: 'queryConstant.do' },
    addConstant:           { url: 'addConstant.do' },
    updateConstant:        { url: 'updateConstant.do' },
    updateConstantForStatus: { url: 'updateConstantForStatus.do' },
    deleteConstant:        { url: 'deleteConstant.do' },

    // ===== 放线小组 drawlineGroup =====
    pageDrawlineGroup:            { url: 'pageDrawlineGroup.do' },
    queryDrawlineGroup:           { url: 'queryDrawlineGroup.do' },
    addDrawlineGroup:             { url: 'addDrawlineGroup.do' },
    updateDrawlineGroup:          { url: 'updateDrawlineGroup.do' },
    updateDrawlineGroupForStatus: { url: 'updateDrawlineGroupForStatus.do' },

    // ===== 计量单位 measurementUnit =====
    pageMeasurementUnit:  { url: 'pageMeasurementUnit.do' },
    queryMeasurementUnit: { url: 'queryMeasurementUnit.do' },
    addMeasurementUnit:   { url: 'addMeasurementUnit.do' },
    updateMeasurementUnit: { url: 'updateMeasurementUnit.do' },

    // ===== 外链 chainPage =====
    queryChainPage:      { url: 'queryChainPage.do' },
    queryChainPageForSelf: { url: 'queryChainPageForSelf.do' },
    addChainPage:   { url: 'addChainPage.do' },
    deleteChainPage: { url: 'deleteChainPage.do' },

    // ===== 标签 label =====
    pageLabel:            { url: 'pageLabel.do' },
    queryLabel:           { url: 'queryLabel.do' },
    addLabel:             { url: 'addLabel.do' },
    updateLabel:          { url: 'updateLabel.do' },
    updateLabelForStatus: { url: 'updateLabelForStatus.do' },
    queryUserLabelByUid:  { url: 'queryUserLabelByUid.do' },
    pickUserLabel:        { url: 'pickUserLabel.do' },
    addUserLabel:         { url: 'addUserLabel.do' },
    deleteUserLabel:      { url: 'deleteUserLabel.do' },

    // ===== 工期工程 constructionPace =====
    pageConstructionPace:   { url: 'pageConstructionPace.do' },
    queryConstructionPace:  { url: 'queryConstructionPace.do' },
    addConstructionPace:    { url: 'addConstructionPace.do' },
    updateConstructionPace: { url: 'updateConstructionPace.do' },
    deleteConstructionPace: { url: 'deleteConstructionPace.do' },

    // ===== 工期工程节点 constructionPaceNode =====
    pageConstructionPaceNode:            { url: 'pageConstructionPaceNode.do' },
    queryConstructionPaceNode:           { url: 'queryConstructionPaceNode.do' },
    addConstructionPaceNode:             { url: 'addConstructionPaceNode.do' },
    updateConstructionPaceNode:          { url: 'updateConstructionPaceNode.do' },
    updateConstructionPaceNodeForStatus: { url: 'updateConstructionPaceNodeForStatus.do' },

    // ===== 工期 constructionPeriod =====
    pageConstructionPeriod:   { url: 'pageConstructionPeriod.do' },
    queryConstructionPeriod:  { url: 'queryConstructionPeriod.do' },
    addConstructionPeriod:    { url: 'addConstructionPeriod.do' },
    updateConstructionPeriod: { url: 'updateConstructionPeriod.do' },
    deleteConstructionPeriod: { url: 'deleteConstructionPeriod.do' },
    queryConstructionPeriodNodeByCpid:    { url: 'queryConstructionPeriodNodeByCpid.do' },
    addConstructionPeriodNode:             { url: 'addConstructionPeriodNode.do' },
    deleteConstructionPeriodNodeByCpnid:   { url: 'deleteConstructionPeriodNodeByCpnid.do' },

    // ===== 合同 contract =====
    pageContract:            { url: 'pageContract.do' },
    queryContract:           { url: 'queryContract.do' },
    addContract:             { url: 'addContract.do' },
    updateContract:          { url: 'updateContract.do' },
    updateContractForStatus: { url: 'updateContractForStatus.do' },
    countContract:           { url: 'countContract.do' },

    // ===== 话术 talking =====
    pageTalking:            { url: 'pageTalking.do' },
    queryTalking:           { url: 'queryTalking.do' },
    addTalking:             { url: 'addTalking.do' },
    updateTalking:          { url: 'updateTalking.do' },
    updateTalkingForStatus: { url: 'updateTalkingForStatus.do' },
    deleteTalking:          { url: 'deleteTalking.do' },

    // ===== 假期 holiday =====
    pageHoliday:    { url: 'pageHoliday.do' },
    queryHoliday:   { url: 'queryHoliday.do' },
    addHoliday:     { url: 'addHoliday.do' },
    updateHoliday:  { url: 'updateHoliday.do' },
    deleteHoliday:  { url: 'deleteHoliday.do' },

    // ===== 流程 flowpath / flowitem =====
    pageFlowpath:    { url: 'pageFlowpath.do' },
    queryFlowpath:   { url: 'queryFlowpath.do' },
    addFlowpath:     { url: 'addFlowpath.do' },
    updateFlowpath:  { url: 'updateFlowpath.do' },
    deleteFlowpath:  { url: 'deleteFlowpath.do' },
    queryFlowitem:   { url: 'queryFlowitem.do' },
    addFlowitem:     { url: 'addFlowitem.do' },
    deleteFlowItem:  { url: 'deleteFlowItem.do' },

    // ===== 测量规则 decorationMeasureRule =====
    queryDecorationMeasureRule:           { url: 'queryDecorationMeasureRule.do' },
    pageDecorationMeasureRule:            { url: 'pageDecorationMeasureRule.do' },
    addDecorationMeasureRule:             { url: 'addDecorationMeasureRule.do' },
    updateDecorationMeasureRule:          { url: 'updateDecorationMeasureRule.do' },
    updateDecorationMeasureRuleForStatus: { url: 'updateDecorationMeasureRuleForStatus.do' },
    deleteDecorationMeasureRule:          { url: 'deleteDecorationMeasureRule.do' },
    queryDecorationMeasureRuleItem:       { url: 'queryDecorationMeasureRuleItem.do' },
    addDecorationMeasureRuleItem:         { url: 'addDecorationMeasureRuleItem.do' },
    deleteDecorationMeasureRuleItem:      { url: 'deleteDecorationMeasureRuleItem.do' },

    // ===== 业务类型 decorationBusitype / Atttype / Matching =====
    pageDecorationBusitype:            { url: 'pageDecorationBusitype.do' },
    queryDecorationBusitype:           { url: 'queryDecorationBusitype.do' },
    addDecorationBusitype:             { url: 'addDecorationBusitype.do' },
    updateDecorationBusitype:          { url: 'updateDecorationBusitype.do' },
    updateDecorationBusitypeForStatus: { url: 'updateDecorationBusitypeForStatus.do' },
    pageDecorationAtttype:             { url: 'pageDecorationAtttype.do' },
    queryDecorationAtttype:            { url: 'queryDecorationAtttype.do' },
    updateDecorationAtttype:           { url: 'updateDecorationAtttype.do' },
    pageDecorationMatching:            { url: 'pageDecorationMatching.do' },
    queryDecorationMatching:           { url: 'queryDecorationMatching.do' },
    addDecorationMatching:             { url: 'addDecorationMatching.do' },
    updateDecorationMatching:          { url: 'updateDecorationMatching.do' },

    // ===== 客户类型 custype =====
    pageCustype:    { url: 'pageCustype.do' },
    queryCustype:   { url: 'queryCustype.do' },
    addCustype:     { url: 'addCustype.do' },
    updateCustype:  { url: 'updateCustype.do' },

    // ===== 签章 signet =====
    pageSignet:    { url: 'pageSignet.do' },
    querySignet:   { url: 'querySignet.do' },
    querySignetBySid: { url: 'querySignetBySid.do' },
    addSignet:     { url: 'addSignet.do' },
    updateSignet:  { url: 'updateSignet.do' },
    registSignet:  { url: 'registSignet.do' },
    authSignet:    { url: 'authSignet.do' },
    confirmSignet: { url: 'confirmSignet.do' },
    signateSignet: { url: 'signateSignet.do' },
    autoSignet:    { url: 'autoSignet.do' },
    cancelSignet:  { url: 'cancelSignet.do' },
    copySignet:    { url: 'copySignet.do' },
    selectSignet:  { url: 'selectSignet.do' },
    moveSignet:    { url: 'moveSignet.do' },
    pollingSignature: { url: 'pollingSignature.do' },
    defaultSignature: { url: 'defaultSignature.do' },
    addSignature:  { url: 'addSignature.do' },
    deleteSignature: { url: 'deleteSignature.do' },

    // ===== 厂商签章 supplierSignet =====
    pageSupplierSignet:       { url: 'pageSupplierSignet.do' },
    querySupplierSignet:      { url: 'querySupplierSignet.do' },
    querySupplierSignetBySid: { url: 'querySupplierSignetBySid.do' },
    addSupplierSignet:        { url: 'addSupplierSignet.do' },
    updateSupplierSignet:     { url: 'updateSupplierSignet.do' },
    registSupplierSignet:     { url: 'registSupplierSignet.do' },
    authSupplierSignet:       { url: 'authSupplierSignet.do' },
    confirmSupplierSignet:    { url: 'confirmSupplierSignet.do' },
    signateSupplierSignet:    { url: 'signateSupplierSignet.do' },
    autoSupplierSignet:       { url: 'autoSupplierSignet.do' },
    cancelSupplierSignet:     { url: 'cancelSupplierSignet.do' },
    copySupplierSignet:       { url: 'copySupplierSignet.do' },
    selectSupplierSignet:     { url: 'selectSupplierSignet.do' },
    moveSupplierSignet:       { url: 'moveSupplierSignet.do' },

    // ===== 印章签名 signature =====

    // ===== 品牌 balance（品牌结算）=====
    queryBrandBalance: { url: 'queryBrandBalance.do' },
    addBrandBalance:   { url: 'addBrandBalance.do' },
    deleteBrandBalance: { url: 'deleteBrandBalance.do' },

    // ===== 楼盘命名规则 buildingNameRule =====
    pageBuildingNameRule:    { url: 'pageBuildingNameRule.do' },
    queryBuildingNameRule:   { url: 'queryBuildingNameRule.do' },
    addBuildingNameRule:     { url: 'addBuildingNameRule.do' },
    updateBuildingNameRule:  { url: 'updateBuildingNameRule.do' },
    deleteBuildingNameRule:  { url: 'deleteBuildingNameRule.do' },

    // ===== 报价命名规则 quotationNamingRule =====
    pageQuotationNamingRule:            { url: 'pageQuotationNamingRule.do' },
    queryQuotationNamingRule:           { url: 'queryQuotationNamingRule.do' },
    addQuotationNamingRule:             { url: 'addQuotationNamingRule.do' },
    updateQuotationNamingRule:          { url: 'updateQuotationNamingRule.do' },
    updateQuotationNamingRuleForStatus: { url: 'updateQuotationNamingRuleForStatus.do' },
    deleteQuotationNamingRule:          { url: 'deleteQuotationNamingRule.do' },
    queryQuotationNamingRuleByPinyin:   { url: 'queryQuotationNamingRuleByPinyin.do' },

    // ===== 定额 normadd =====
    pageNormadd:            { url: 'pageNormadd.do' },
    queryNormadd:           { url: 'queryNormadd.do' },
    addNormadd:             { url: 'addNormadd.do' },
    updateNormadd:          { url: 'updateNormadd.do' },
    updateNormaddForStatus: { url: 'updateNormaddForStatus.do' },
    deleteNormadd:          { url: 'deleteNormadd.do' },

    // ===== 定额包 normpack / normpackItem =====
    pageNormpack:            { url: 'pageNormpack.do' },
    queryNormpack:           { url: 'queryNormpack.do' },
    addNormpack:             { url: 'addNormpack.do' },
    updateNormpackForStatus: { url: 'updateNormpackForStatus.do' },
    deleteNormpack:          { url: 'deleteNormpack.do' },
    queryNormpackItem:       { url: 'queryNormpackItem.do' },
    addNormpackItem:         { url: 'addNormpackItem.do' },
    deleteNormpackItem:      { url: 'deleteNormpackItem.do' },

    // ===== 定额工费 normrice =====
    pageNormrice:    { url: 'pageNormrice.do' },
    queryNormriceByQiid: { url: 'queryNormriceByQiid.do' },
    addNormrice:     { url: 'addNormrice.do' },
    deleteNormrice:  { url: 'deleteNormrice.do' },

    // ===== 定额工期 normtime =====
    pageNormtime:    { url: 'pageNormtime.do' },
    queryNormtimeByQiid: { url: 'queryNormtimeByQiid.do' },
    addNormtime:     { url: 'addNormtime.do' },
    deleteNormtime:  { url: 'deleteNormtime.do' },

    // ===== 定额物料 normood =====
    pageNormood:     { url: 'pageNormood.do' },
    queryNormoodByQiid: { url: 'queryNormoodByQiid.do' },
    addNormood:      { url: 'addNormood.do' },
    deleteNormood:   { url: 'deleteNormood.do' },

    // ===== 公共项工费 cormrice =====
    pageCormrice:        { url: 'pageCormrice.do' },
    queryCormriceByQcid: { url: 'queryCormriceByQcid.do' },
    addCormrice:         { url: 'addCormrice.do' },
    deleteCormrice:      { url: 'deleteCormrice.do' },

    // ===== 收款类型 receiptType =====
    pageReceiptType:            { url: 'pageReceiptType.do' },
    queryReceiptType:           { url: 'queryReceiptType.do' },
    queryReceiptTypeByType:     { url: 'queryReceiptTypeByType.do' },
    queryReceiptTypeByNo:       { url: 'queryReceiptTypeByNo.do' },
    addReceiptType:             { url: 'addReceiptType.do' },
    updateReceiptType:          { url: 'updateReceiptType.do' },
    updateReceiptTypeForStatus: { url: 'updateReceiptTypeForStatus.do' },
    queryReceiptTypeItem:       { url: 'queryReceiptTypeItem.do' },
    addReceiptTypeItem:         { url: 'addReceiptTypeItem.do' },
    deleteReceiptTypeItem:      { url: 'deleteReceiptTypeItem.do' },

    // ===== 款项类型 paymentType =====
    pagePaymentType:            { url: 'pagePaymentType.do' },
    queryPaymentType:           { url: 'queryPaymentType.do' },
    queryPaymentTypeByPtid:     { url: 'queryPaymentTypeByPtid.do' },
    queryPaymentTypeByName:     { url: 'queryPaymentTypeByName.do' },
    addPaymentType:             { url: 'addPaymentType.do' },
    updatePaymentType:          { url: 'updatePaymentType.do' },
    updatePaymentTypeForStatus: { url: 'updatePaymentTypeForStatus.do' },

    // ===== 付款比例 paymentScale =====
    queryPaymentScale:           { url: 'queryPaymentScale.do' },
    addPaymentScale:             { url: 'addPaymentScale.do' },
    deletePaymentScale:          { url: 'deletePaymentScale.do' },
    updatePaymentScaleForStatus: { url: 'updatePaymentScaleForStatus.do' },
    queryPaymentScaleItemByPsid: { url: 'queryPaymentScaleItemByPsid.do' },
    fetchPaymentScaleItem:       { url: 'fetchPaymentScaleItem.do' },
    queryPaymentScaleItem:       { url: 'queryPaymentScaleItem.do' },
    addPaymentScaleItem:         { url: 'addPaymentScaleItem.do' },
    deletePaymentScaleItem:      { url: 'deletePaymentScaleItem.do' },

    // ===== 户型 houseLayout =====
    pageHouseLayout:   { url: 'pageHouseLayout.do' },
    queryHouseLayout:  { url: 'queryHouseLayout.do' },
    addHouseLayout:    { url: 'addHouseLayout.do' },
    deleteHouseLayout: { url: 'deleteHouseLayout.do' },

    // ===== 商品 goods =====
    pageGoods:         { url: 'pageGoods.do' },
    pageGoodsForAdvance: { url: 'pageGoodsForAdvance.do' },
    queryGoods:        { url: 'queryGoods.do' },
    queryGoodsByNo:    { url: 'queryGoodsByNo.do' },
    queryGoodsByName:  { url: 'queryGoodsByName.do' },
    queryGoodsByAtid:  { url: 'queryGoodsByAtid.do' },
    queryGoodsByBarcode: { url: 'queryGoodsByBarcode.do' },
    queryGoodsByGId:   { url: 'queryGoodsByGId.do' },
    queryGoodsByGpid:  { url: 'queryGoodsByGpid.do' },
    addGoods:          { url: 'addGoods.do' },
    updateGoods:       { url: 'updateGoods.do' },
    updateGoodsForStatus: { url: 'updateGoodsForStatus.do' },
    showGoods:         { url: 'showGoods.do' },

    // ===== 商品记录 goodsRecord =====
    pageGoodsRecord: { url: 'pageGoodsRecord.do' },
    addGoodsRecord:  { url: 'addGoodsRecord.do' },

    // ===== 商品包 goodsPackage =====
    queryGoodsPackage: { url: 'queryGoodsPackage.do' },
    addGoodsPackage:   { url: 'addGoodsPackage.do' },
    updateGoodsPackage: { url: 'updateGoodsPackage.do' },
    deleteGoodsPackage: { url: 'deleteGoodsPackage.do' },

    // ===== 商品品类 goodsKind =====
    pageGoodsKind:            { url: 'pageGoodsKind.do' },
    queryGoodsKind:           { url: 'queryGoodsKind.do' },
    queryGoodsKindByFgkid:    { url: 'queryGoodsKindByFgkid.do' },
    queryGoodsKindByGkid:     { url: 'queryGoodsKindByGkid.do' },
    addGoodsKind:             { url: 'addGoodsKind.do' },
    updateGoodsKind:          { url: 'updateGoodsKind.do' },
    updateGoodsKindForStatus: { url: 'updateGoodsKindForStatus.do' },

    // ===== 价格 price =====
    pagePrice:              { url: 'pagePrice.do' },
    queryPriceByGid:        { url: 'queryPriceByGid.do' },
    queryPriceByPid:        { url: 'queryPriceByPid.do' },
    addPrice:               { url: 'addPrice.do' },
    updatePriceForStatus:   { url: 'updatePriceForStatus.do' },
    deletePrice:            { url: 'deletePrice.do' },

    // ===== 辅料 aoods =====
    pageAoods:           { url: 'pageAoods.do' },
    queryAoods:          { url: 'queryAoods.do' },
    queryAoodsByName:    { url: 'queryAoodsByName.do' },
    queryAoodsByAtid:    { url: 'queryAoodsByAtid.do' },
    addAoods:            { url: 'addAoods.do' },
    updateAoods:         { url: 'updateAoods.do' },
    updateAoodsForStatus: { url: 'updateAoodsForStatus.do' },
    updateAoodsForNorm:   { url: 'updateAoodsForNorm.do' },
    updateAoodsForAdvance: { url: 'updateAoodsForAdvance.do' },
    copyAoods:            { url: 'copyAoods.do' },

    // ===== 辅料费用 aoodsCharge =====
    pageAoodsCharge:       { url: 'pageAoodsCharge.do' },
    queryAoodsChargeByAid: { url: 'queryAoodsChargeByAid.do' },
    addAoodsCharge:        { url: 'addAoodsCharge.do' },
    updateAoodsCharge:     { url: 'updateAoodsCharge.do' },
    deleteAoodsCharge:     { url: 'deleteAoodsCharge.do' },

    // ===== 售卖商品 soods =====
    pageSoods:         { url: 'pageSoods.do' },
    querySoods:        { url: 'querySoods.do' },
    querySoodsByName:  { url: 'querySoodsByName.do' },
    addSoods:          { url: 'addSoods.do' },
    updateSoods:       { url: 'updateSoods.do' },
    updateSoodsForStatus: { url: 'updateSoodsForStatus.do' },
    copySoods:         { url: 'copySoods.do' },
    deleteSoods:       { url: 'deleteSoods.do' },

    // ===== 售卖明细 soodsItem =====
    pageSoodsItemByQiid: { url: 'pageSoodsItemByQiid.do' },
    pageSoodsItemBySid:  { url: 'pageSoodsItemBySid.do' },
    querySoodsItemByQiid: { url: 'querySoodsItemByQiid.do' },
    querySoodsItemBySid:  { url: 'querySoodsItemBySid.do' },
    addSoodsItem:         { url: 'addSoodsItem.do' },
    deleteSoodsItem:      { url: 'deleteSoodsItem.do' },

    // ===== noods =====
    pageNoods:          { url: 'pageNoods.do' },
    queryNoods:         { url: 'queryNoods.do' },
    queryNoodsByName:   { url: 'queryNoodsByName.do' },
    queryNoodsForGroup: { url: 'queryNoodsForGroup.do' },
    addNoods:           { url: 'addNoods.do' },
    updateNoods:        { url: 'updateNoods.do' },
    updateNoodsForStatus: { url: 'updateNoodsForStatus.do' },
    updateNoodsForCalc:   { url: 'updateNoodsForCalc.do' },

    // ===== 调研模板 surveyTemplate =====
    pageSurveyTemplate:            { url: 'pageSurveyTemplate.do' },
    querySurveyTemplate:           { url: 'querySurveyTemplate.do' },
    querySurveyTemplateByStid:     { url: 'querySurveyTemplateByStid.do' },
    addSurveyTemplate:             { url: 'addSurveyTemplate.do' },
    updateSurveyTemplate:          { url: 'updateSurveyTemplate.do' },
    updateSurveyTemplateForStatus: { url: 'updateSurveyTemplateForStatus.do' },
    deleteSurveyTemplate:          { url: 'deleteSurveyTemplate.do' },
    copySurveyTemplate:            { url: 'copySurveyTemplate.do' },

    // ===== 客户 customer =====
    pageCustomer:               { url: 'pageCustomer.do' },
    queryCustomerById:          { url: 'queryCustomerById.do' },
    queryCustomerForName:       { url: 'queryCustomerForName.do' },
    queryCustomerForPhone:      { url: 'queryCustomerForPhone.do' },
    checkCustomerForPhone:      { url: 'checkCustomerForPhone.do' },
    queryCustomerPhoneByCid:    { url: 'queryCustomerPhoneByCid.do' },
    addCustomer:                { url: 'addCustomer.do' },
    updateCustomer:             { url: 'updateCustomer.do' },
    updateCustomerForBase:      { url: 'updateCustomerForBase.do' },
    addCustomerPhone:           { url: 'addCustomerPhone.do' },
    updateCustomerPhoneForStatus: { url: 'updateCustomerPhoneForStatus.do' },
    updateCustomerNameAPhone:   { url: 'updateCustomerNameAPhone.do' },
    updateCustomerPhoneForDefault: { url: 'updateCustomerPhoneForDefault.do' },
    existCustomer:              { url: 'existCustomer.do' },
    registCustomer:             { url: 'registCustomer.do' },
    authCustomer:               { url: 'authCustomer.do' },
    confirmCustomer:            { url: 'confirmCustomer.do' },
    signateCustomer:            { url: 'signateCustomer.do' },
    resetCustomer:              { url: 'resetCustomer.do' },

    // ===== 客户账户 customerAccount =====
    pageCustomerAccount:    { url: 'pageCustomerAccount.do' },

    // ===== 房型图 houseLayout（已在上面）=====

    // ===== 楼盘规则 villageRule / village4rule =====
    queryVillageRule:  { url: 'queryVillageRule.do' },
    addVillageRule:    { url: 'addVillageRule.do' },
    deleteVillageRule: { url: 'deleteVillageRule.do' },
    updateVillageForPosition: { url: 'updateVillageForPosition.do' },
    updateVillageForUrl:      { url: 'updateVillageForUrl.do' },
    locateVillage:            { url: 'locateVillage.do' },

    // ===== 品牌 brand（扩展）=====
    queryBrand:               { url: 'queryBrand.do' },
    queryBrandByBid:          { url: 'queryBrandByBid.do' },
    queryBrandByNo:           { url: 'queryBrandByNo.do' },
    queryBrandByCid:          { url: 'queryBrandByCid.do' },
    queryBrandByPinyin:       { url: 'queryBrandByPinyin.do' },
    queryBrandForAllByPinyin: { url: 'queryBrandForAllByPinyin.do' },
    deleteBrandByBids:        { url: 'deleteBrandByBids.do' },

    // ===== 颜色/规格/价格池（仅查询）=====
    pageColor:  { url: 'pageColor.do' },
    pageFormat: { url: 'pageFormat.do' },
    queryColorForEnableByGid:  { url: 'queryColorForEnableByGid.do' },
    queryFormatForEnableByGid: { url: 'queryFormatForEnableByGid.do' },

    // ===== 房屋 house（扩展）=====
    queryHouseByHid:      { url: 'queryHouseByHid.do' },
    queryHouseByNoAHnum:  { url: 'queryHouseByNoAHnum.do' },
    existHouse:           { url: 'existHouse.do' },

    // ===== 厂商 instorer（厂商账号）=====
    pageInstorer:            { url: 'pageInstorer.do' },
    addInstorer:             { url: 'addInstorer.do' },
    updateInstorer:          { url: 'updateInstorer.do' },
    updateInstorerForLogin:  { url: 'updateInstorerForLogin.do' },
    updateInstorerForPassword: { url: 'updateInstorerForPassword.do' },
    updateSupplierForPassword: { url: 'updateSupplierForPassword.do' },
    querySupplierUserRightBySId: { url: 'querySupplierUserRightBySId.do' },
    updateSupplierUserRight: { url: 'updateSupplierUserRight.do' },

    // ===== 复测规格 remeasureFormat =====
    queryRemeasureFormatByBid:   { url: 'queryRemeasureFormatByBid.do' },
    queryRemeasureFormatByRfid:  { url: 'queryRemeasureFormatByRfid.do' },
    addRemeasureFormat:          { url: 'addRemeasureFormat.do' },
    updateRemeasureFormat:       { url: 'updateRemeasureFormat.do' },
    updateRemeasureFormatForStatus: { url: 'updateRemeasureFormatForStatus.do' },

    // ===== 商品池 goodsPool（查询用）=====
    pageGoodsPool: { url: 'pageGoodsPool.do' },

    // ===== 角色图表 chart =====
    pageChart:    { url: 'pageChart.do' },
    queryChart:   { url: 'queryChart.do' },

    // ===== ChatGPT配置 chatGpt =====
    pageChatGpt:   { url: 'pageChatGpt.do' },
    addChatGpt:    { url: 'addChatGpt.do' },
    updateChatGpt: { url: 'updateChatGpt.do' },

    // ===== 沟通话术 chating =====
    pageChating:   { url: 'pageChating.do' },
    addChating:    { url: 'addChating.do' },
    updateChating: { url: 'updateChating.do' },

    // ===== 颜色池/规格池/价格池（查询用）=====
    pageColorPool:  { url: 'pageColorPool.do' },
    pageFormatPool: { url: 'pageFormatPool.do' },
    pagePricePool:  { url: 'pagePricePool.do' },

    // ===== 复测规格 remeasureFormat =====
    pageRemeasureFormat: { url: 'pageRemeasureFormat.do' },

    // ===== 服务节点 serviceNode =====
    pageServiceNode:   { url: 'pageServiceNode.do' },
    addServiceNode:    { url: 'addServiceNode.do' },
    updateServiceNode: { url: 'updateServiceNode.do' },

    // ===== 印章 signature =====
    pageSignature:   { url: 'pageSignature.do' },
    addSignature:    { url: 'addSignature.do' },
    updateSignature: { url: 'updateSignature.do' },

    // ===== 任务 task / taskParam =====
    pageTask:    { url: 'pageTask.do' },
    addTask:     { url: 'addTask.do' },
    updateTask:  { url: 'updateTask.do' },
    pageTaskParam:   { url: 'pageTaskParam.do' },
    addTaskParam:    { url: 'addTaskParam.do' },
    updateTaskParam: { url: 'updateTaskParam.do' }
}});
