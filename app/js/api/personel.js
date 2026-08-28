/**
 * app/js/api/personel.js —— personel（人事）模块 API 定义
 *
 * 完整对齐旧 WebContent/js/api/personel.js 全部接口（含 pageUser / 合同 / 厂商 / 招聘 等）。
 * 注意拼写：后端模块名为 personel（少一个 n），沿用旧 API 不做改名。
 * 接口对齐旧 WebContent/js/api/personel.js，后端零改动。
 */

// ============ 页面路由（菜单跳转/popup 用） ============
$.extend(api.index, {
    userIndex:                          { url: '/views/personnel/user.html' },
    user4condition:                     { url: '/views/personnel/user4condition.html' },
    userViewIndex:                      { url: '/views/personnel/user4view.html' },
    userEditIndex:                      { url: '/views/personnel/user2edit.html' },
    userDetail:                         { url: '/views/personnel/userDetail.html' },
    userContractIndex:                  { url: '/views/personnel/userContract.html' },
    userContract4create:                { url: '/views/personnel/userContract4create.html' },
    userExperienceIndex:                { url: '/views/personnel/userExperience.html' },
    userEducationIndex:                 { url: '/views/personnel/userEducation.html' },
    userOperationIndex:                 { url: '/views/personnel/userOperation.html' },
    userPrint:                          { url: '/views/personnel/userPrint.html' },
    userOutputIndex:                    { url: '/views/personnel/user2export.html' },
    userFunctionIndex:                  { url: '/views/personnel/userFunction.html' },
    userRequireIndex:                   { url: '/views/personnel/userRequire.html' },
    userPartnerIndex:                   { url: '/views/personnel/userPartner.html' },
    department4condition:               { url: '/views/personnel/department4condition.html' },
    departmentPartnerIndex:             { url: '/views/personnel/departmentPartner.html' },
    dutmentIndex:                       { url: '/views/personnel/dutment.html' },
    instorerIndex:                       { url: '/views/personnel/instorer.html' },
    selectRecruitment:                  { url: '/views/personnel/recruitment4select.html' },
    updateRecruitment:                  { url: '/views/personnel/recruitment2update.html' },
    recruitmentEducation:               { url: '/views/personnel/recruitmentEducation.html' },
    recruitmentOperation:               { url: '/views/personnel/recruitmentOperation.html' },
    macontrol:                          { url: '/views/personnel/macontrol.html' },
    supplierContract4create:            { url: '/views/personnel/supplierContract4create.html' },
    supplierContractBrand:              { url: '/views/personnel/supplierContractBrand.html' },
    supplierContractBrand4detailIndex:  { url: '/views/personnel/supplierContractBrand4detail.html' },
    supplierContractService:            { url: '/views/personnel/supplierContractService.html' },
    supplierContractGoods:              { url: '/views/personnel/supplierContractGoods.html' },
    supplierContractCategory:           { url: '/views/personnel/supplierContractCategory.html' }
});

// ============ 接口定义 ============
$.extend(api, {
    personel: {
        // ===== 用户（员工）查询 =====
        pageUser:                  { url: 'pageUser.do',                  demo: true },
        pageUserInfo:              { url: 'pageUserInfo.do' },
        queryUserByLoginId:        { url: 'queryUserByLoginId.do' },
        pageUserByMid:             { url: 'pageUserByMid.do' },
        queryUserByUserId:         { url: 'queryUserByUserId.do',         demo: true },
        queryUserInfoByUserId:     { url: 'queryUserInfoByUserId.do' },
        queryUserForSelfByUserId:  { url: 'queryUserForSelfByUserId.do',  demo: true, server: 'communion' },
        queryUserByOldUserId:      { url: 'queryUserByOldUserId.do' },
        queryUserByPinyin:         { url: 'queryUserByPinyin.do' },
        queryUserByUids:           { url: 'queryUserByUids.do' },
        queryUserPrefer:           { url: 'queryUserPrefer.do',           server: 'communion' },
        queryUserPrefers:          { url: 'queryUserPrefers.do',          server: 'communion' },
        queryUserRole:             { url: 'queryUserRole.do' },
        queryUserFunction:         { url: 'queryUserFunction.do' },
        queryUserCompany:          { url: 'queryUserCompany.do' },
        queryUserCompanyForSelf:   { url: 'queryUserCompanyForSelf.do' },
        queryUserDepartment:       { url: 'queryUserDepartment.do' },
        queryUserLabelByUid:       { url: 'queryUserLabelByUid.do' },

        // ===== 用户（员工）写入 =====
        addUser:                   { url: 'addUser.do',                   server: 'communion' },
        updateUserForBaseInfo:     { url: 'updateUserForBaseInfo.do',     server: 'communion' },
        updateUser:                { url: 'updateUser.do',                server: 'communion' },
        updateUserForProfile:      { url: 'updateUserForProfile.do',      server: 'communion' },
        updateUserForAdvance:      { url: 'updateUserForAdvance.do',      server: 'communion' },
        updateUserForPhoto:        { url: 'updateUserForPhoto.do',        server: 'communion' },
        updateUserPrefer:          { url: 'updateUserPrefer.do',          server: 'communion' },
        updateUserRole:            { url: 'updateUserRole.do',            server: 'communion' },
        updateUserCompany:         { url: 'updateUserCompany.do',         server: 'communion' },
        updateUserDepartment:      { url: 'updateUserDepartment.do' },
        quitUser:                  { url: 'quitUser.do',                  server: 'communion' },
        tranUser:                  { url: 'tranUser.do',                  server: 'communion' },
        resetPassword:             { url: 'resetPassword.do',             server: 'communion' },
        changePassword:            { url: 'changePassword.do',            server: 'communion' },
        defaultPassword:           { url: 'defaultPassword.do',           server: 'communion' },
        deleteUserByIds:           { url: 'deleteUserByIds.do',           server: 'communion' },
        registUser:                { url: 'registUser.do',                server: 'communion' },
        resetUser:                 { url: 'resetUser.do',                 server: 'communion' },
        authUser:                  { url: 'authUser.do',                  server: 'communion' },
        confirmUser:               { url: 'confirmUser.do',               server: 'communion' },
        signateUser:               { url: 'signateUser.do',               server: 'communion' },

        // ===== 用户合作人 =====
        queryUserPartner:          { url: 'queryUserPartner.do' },
        addUserPartner:            { url: 'addUserPartner.do',            server: 'communion' },
        deleteUserPartner:         { url: 'deleteUserPartner.do',         server: 'communion' },

        // ===== 部门合作人 =====
        queryDepartmentPartner:    { url: 'queryDepartmentPartner.do' },
        addDepartmentPartner:      { url: 'addDepartmentPartner.do',      server: 'communion' },
        deleteDepartmentPartner:   { url: 'deleteDepartmentPartner.do',   server: 'communion' },

        // ===== 定岗（dutment） =====
        queryDutmentByDeid:        { url: 'queryDutmentByDeid.do' },
        queryDutmentByDuid:        { url: 'queryDutmentByDuid.do' },
        addDutment:                { url: 'addDutment.do',                server: 'communion' },
        updateDutment:             { url: 'updateDutment.do',             server: 'communion' },
        deleteDutment:             { url: 'deleteDutment.do',             server: 'communion' },

        // ===== 用户合同 =====
        pageUserContractByUserId:  { url: 'pageUserContractByUserId.do' },
        queryUserContract:         { url: 'queryUserContract.do' },
        addUserContract:           { url: 'addUserContract.do',           server: 'communion' },
        updateUserContract:        { url: 'updateUserContract.do',        server: 'communion' },
        deleteUserContract:        { url: 'deleteUserContract.do',        server: 'communion' },
        sendUserContractForAuth:   { url: 'sendUserContractForAuth.do' },
        sendUserContract:          { url: 'sendUserContract.do' },
        redirectUserContract:      { url: 'redirectUserContract.do' },
        viewUserContract:          { url: 'viewUserContract.do' },
        signUserContractForCompany:{ url: 'signUserContractForCompany.do', server: 'communion' },
        signUserContractForUser:   { url: 'signUserContractForUser.do',    server: 'communion' },
        affixUserContract:         { url: 'affixUserContract.do',          server: 'communion' },
        expireUserContract:        { url: 'expireUserContract.do',         server: 'communion' },
        filingUserContract:        { url: 'filingUserContract.do',         server: 'communion' },

        // ===== 厂商合同 =====
        querySupplierContract:     { url: 'querySupplierContract.do' },
        querySupplierContractById: { url: 'querySupplierContractById.do' },
        viewSupplierContract:      { url: 'viewSupplierContract.do' },
        addSupplierContract:       { url: 'addSupplierContract.do',        server: 'communion' },
        makeSupplierContract:      { url: 'makeSupplierContract.do',       server: 'communion' },
        updateSupplierContract:    { url: 'updateSupplierContract.do',     server: 'communion' },
        deleteSupplierContract:    { url: 'deleteSupplierContract.do',     server: 'communion' },
        signSupplierContractForCompany:  { url: 'signSupplierContractForCompany.do',  server: 'communion' },
        signSupplierContractForSupplier: { url: 'signSupplierContractForSupplier.do', server: 'communion' },
        affixSupplierContract:     { url: 'affixSupplierContract.do',      server: 'communion' },
        expireSupplierContract:    { url: 'expireSupplierContract.do',     server: 'communion' },
        filingSupplierContract:    { url: 'filingSupplierContract.do',     server: 'communion' },

        // ===== 厂商合同-品牌 =====
        pageSupplierContractBrand: {
            url: 'pageSupplierContractBrand.do',
            type: 'query',
            tranargs: [{ result: 'paging-data', args: ['cvalue', 'breakpay'] }, { result: 'paging-data-supplierContractCategorys', args: ['cvalue', 'breakpay'] }]
        },
        querySupplierContractBrand: {
            url: 'querySupplierContractBrand.do',
            type: 'query',
            tranargs: [{ result: 'supplierContractBrand', args: ['cvalue', 'breakpay'] }]
        },
        addSupplierContractBrand: {
            url: 'addSupplierContractBrand.do', server: 'communion', type: 'update',
            tranargs: { args: ['supplierContractBrand.cvalue', 'supplierContractBrand.breakpay'] }
        },
        updateSupplierContractBrand: {
            url: 'updateSupplierContractBrand.do', server: 'communion', type: 'update',
            tranargs: { args: ['supplierContractBrand.cvalue', 'supplierContractBrand.breakpay'] }
        },
        deleteSupplierContractBrand: { url: 'deleteSupplierContractBrand.do', server: 'communion' },

        // ===== 厂商合同-品类 =====
        querySupplierContractCategory: {
            url: 'querySupplierContractCategory.do',
            type: 'query',
            tranargs: [{ result: 'supplierContractCategorys', args: ['cvalue', 'breakpay'] }]
        },
        addSupplierContractCategory: {
            url: 'addSupplierContractCategory.do', server: 'communion', type: 'update',
            tranargs: { args: ['supplierContractCategory.cvalue', 'supplierContractCategory.breakpay'] }
        },
        deleteSupplierContractCategory: { url: 'deleteSupplierContractCategory.do', server: 'communion' },

        // ===== 厂商合同-服务费 =====
        querySupplierContractServiceBySid: { url: 'querySupplierContractServiceBySid.do' },
        addSupplierContractService:        { url: 'addSupplierContractService.do',        server: 'communion' },
        deleteSupplierContractService:     { url: 'deleteSupplierContractService.do',     server: 'communion' },

        // ===== 厂商合同-商品（质保/产品）=====
        querySupplierContractProduct: {
            url: 'querySupplierContractProduct.do',
            type: 'query',
            tranargs: [{ result: 'supplierContractProducts', args: ['cvalue', 'breakpay'] }]
        },
        querySupplierContractProductByScid: {
            url: 'querySupplierContractProductByScid.do',
            type: 'query',
            tranargs: [{ result: 'supplierContractProducts', args: ['cvalue', 'breakpay'] }]
        },
        addSupplierContractProduct: {
            url: 'addSupplierContractProduct.do', server: 'communion', type: 'update',
            tranargs: { args: ['supplierContractProduct.cvalue', 'supplierContractProduct.breakpay'] }
        },
        deleteSupplierContractProduct: { url: 'deleteSupplierContractProduct.do', server: 'communion' },

        // ===== 厂商合同-商品（goods）=====
        pageSupplierContractGoods:        { url: 'pageSupplierContractGoods.do' },
        querySupplierContractGoods:       { url: 'querySupplierContractGoods.do' },
        addSupplierContractGoods:         { url: 'addSupplierContractGoods.do', server: 'communion' },
        deleteSupplierContractGoods:      { url: 'deleteSupplierContractGoods.do' },

        // ===== 用户教育/工作/经历 =====
        queryUserEducation:        { url: 'queryUserEducation.do' },
        addUserEducation:          { url: 'addUserEducation.do',          server: 'communion' },
        updateUserEducation:        { url: 'updateUserEducation.do',       server: 'communion' },
        deleteUserEducation:        { url: 'deleteUserEducation.do',       server: 'communion' },
        queryUserOperation:         { url: 'queryUserOperation.do' },
        addUserOperation:           { url: 'addUserOperation.do',          server: 'communion' },
        updateUserOperation:        { url: 'updateUserOperation.do',       server: 'communion' },
        deleteUserOperation:        { url: 'deleteUserOperation.do',       server: 'communion' },
        queryUserExperienceByUid:   { url: 'queryUserExperienceByUid.do' },
        updateUserExperience:       { url: 'updateUserExperience.do',       server: 'communion' },

        // ===== 薪资 =====
        pageUserSalary:            { url: 'pageUserSalary.do' },
        pageUserSalaryByUserId:    { url: 'pageUserSalaryByUserId.do' },
        addUserSalary:             { url: 'addUserSalary.do' },
        updateUserSalary:          { url: 'updateUserSalary.do' },
        deleteUserSalary:          { url: 'deleteUserSalary.do' },

        // ===== 用户需求 =====
        PageUserRequire:           { url: 'pageUserRequire.do' },
        addUserRequire:            { url: 'addUserRequire.do',            server: 'communion' },
        approveUserRequire:        { url: 'approveUserRequire.do',        server: 'communion' },
        finishUserRequire:         { url: 'finishUserRequire.do',         server: 'communion' },
        refuseUserRequire:         { url: 'refuseUserRequire.do',         server: 'communion' },

        // ===== 绩效 =====
        pagePerformance:           { url: 'pagePerformance.do' },
        addPreformance:            { url: 'addPreformance.do',            server: 'communion' },

        // ===== 厂商（supplier）=====
        pageSupplier:              { url: 'pageSupplier.do' },
        querySupplierByPinyin:     { url: 'querySupplierByPinyin.do' },
        addSupplier:               { url: 'addSupplier.do',               server: 'communion' },
        updateSupplier:            { url: 'updateSupplier.do',            server: 'communion' },

        // ===== 仓管员（instorer）=====
        pageInstorer:              { url: 'pageInstorer.do' },
        queryInstorerByPinyin:     { url: 'queryInstorerByPinyin.do' },
        addInstorer:               { url: 'addInstorer.do',               server: 'communion' },
        updateInstorer:            { url: 'updateInstorer.do',            server: 'communion' },

        // ===== Mac/IP 权限 =====
        queryMacontrol:            { url: 'queryMacontrol.do' },
        checkMacontrol:            { url: 'checkMacontrol.do',            server: 'communion' },
        addMacontrol:              { url: 'addMacontrol.do',              server: 'communion' },
        deleteMacontrol:           { url: 'deleteMacontrol.do',           server: 'communion' },
        queryAttendance:           { url: 'queryAttendance.do' },
        reportAttendance:          { url: 'reportAttendance.do' },

        // ===== 复仇者（avenger）=====
        pageAvenger:               { url: 'pageAvenger.do' },
        queryAvengerByPinyin:      { url: 'queryAvengerByPinyin.do' },

        // ===== 商户（merchant）=====
        pageMerchant:              { url: 'pageMerchant.do' },
        queryMerchantByPinyin:     { url: 'queryMerchantByPinyin.do' },

        // ===== 招聘 =====
        pageRecruitment:           { url: 'pageRecruitment.do' },
        addRecruitment:            { url: 'addRecruitment.do' },
        queryRecruitmentByRid:     { url: 'queryRecruitmentByRid.do' },
        checkRecruitment:          { url: 'checkRecruitment.do' },
        updateRecruitment:         { url: 'updateRecruitment.do' },
        updateRecruitmentForAdvance:{ url: 'updateRecruitmentForAdvance.do' },
        entryRecruitment:          { url: 'entryRecruitment.do' },
        cancelRecruitment:         { url: 'cancelRecruitment.do' },
        addRecruitmentEducation:   { url: 'addRecruitmentEducation.do' },
        queryRecruitmentEducation: { url: 'queryRecruitmentEducation.do' },
        updateRecruitmentEducation:{ url: 'updateRecruitmentEducation.do' },
        deleteRecruitmentEducation:{ url: 'deleteRecruitmentEducation.do' },
        addRecruitmentOperation:   { url: 'addRecruitmentOperation.do' },
        queryRecruitmentOperation: { url: 'queryRecruitmentOperation.do' },
        updateRecruitmentOperation:{ url: 'updateRecruitmentOperation.do' },
        deleteRecruitmentOperation:{ url: 'deleteRecruitmentOperation.do' }
    }
});
