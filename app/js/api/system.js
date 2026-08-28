/**
 * app/js/api/system.js —— system 模块 API 定义
 *
 * 接口对齐旧 WebContent/js/api/system.js，后端零改动。
 * 保留旧拼写：updateOpperation（后端 action 名即如此，勿"修正"）。
 * 保留旧拼写：companys（后端返回字段名，非 grammatical 复数）。
 */

// ============ 页面路由 ============
$.extend(api.index, {
    operationIndex:          { url: 'views/system/operation.html' },
    cityIndex:               { url: 'views/system/city.html' },
    cityProperIndex:         { url: 'views/system/cityProper.html' },
    cityProperPartnerIndex:  { url: 'views/system/cityProperPartner.html' },
    regionIndex:             { url: 'views/system/region.html' },
    organizationIndex:       { url: 'views/system/organization.html' },
    systemConfigIndex:       { url: 'views/system/systemConfig.html' },
    systemConfigCatalogIndex:{ url: 'views/system/company4params.html' },
    companyIndex:            { url: 'views/system/company.html' },
    companyConfigIndex:      { url: 'views/system/company4config.html' },
    moduleIndex:             { url: 'views/system/module.html' },
    moduleAdvanceIndex:      { url: 'views/system/module4advance.html' },
    roleModuleIndex:         { url: 'views/system/module4role.html' },
    userModuleIndex:         { url: 'views/system/module4user.html' },
    monitorIndex:            { url: 'views/system/monitor.html' },
    password2resetIndex:     { url: 'views/system/password2reset.html' },
    roleIndex:               { url: 'views/system/role.html' },
    role4baseIndex:          { url: 'views/system/role4base.html' },
    upgradePackageIndex:     { url: 'views/system/upgradePackage.html' },
    userProfileIndex:        { url: 'views/system/userProfile.html' },
    versionIndex:            { url: 'views/system/version.html' }
});

// ============ system 数据源（ds）：枚举常量 ============
// 对齐旧 api.ds.system：静态 JSON 文件，缓存到 app.params.jsonsystem
$.extend(api.ds, {
    system: { url: 'ds/system.json', demo: true, cache: 'jsonsystem' }
});

// ============ system 接口 ============
$.extend(api, {
    system: {

        // —— 模块（用于 operation.module 自动补全 + 菜单点击取真实 url）——
        queryModule: {
            url: 'queryModule.do',
            demo: true
        },
        pageModule: {
            url: 'pageModule.do',
            demo: true
        },
        queryModuleForLogin: { url: 'queryModuleForLogin.do', demo: true },
        queryModuleForLink:  { url: 'queryModuleForLink.do',  demo: true },
        queryModuleByUserId: { url: 'queryModuleByUserId.do', demo: true },
        queryModuleByRid:    { url: 'queryModuleByRid.do',    demo: true },
        queryModuleByFatherModule: { url: 'queryModuleByFatherModule.do', demo: true },
        // 菜单点击时按 mid 取真实 url + 鉴权（不在 DOM 暴露页面路径）
        checkModule: { url: 'checkModule.do' },
        addModule:    { url: 'addModule.do',    server: 'communion' },
        updateModule: { url: 'updateModule.do', server: 'communion' },
        updateRoleModule: {
            url: 'updateRoleModule.do',
            server: 'communion',
            intercept: true
        },
        updateRoleModuleByRid: { url: 'updateRoleModuleByRid.do', server: 'communion' },
        syncRoleModule:        { url: 'syncRoleModule.do',        server: 'communion' },
        deleteModule:          { url: 'deleteModule.do',          server: 'communion' },

        // ===== 大区 region =====
        pageRegion:   { url: 'pageRegion.do',   server: 'communion', demo: true },
        queryRegion:  { url: 'queryRegion.do',  server: 'communion', demo: true },
        addRegion:    { url: 'addRegion.do',    server: 'communion' },
        updateRegion: { url: 'updateRegion.do', server: 'communion' },
        deleteRegion: { url: 'deleteRegion.do', server: 'communion' },

        // ===== 组织 organization =====
        pageOrganization:            { url: 'pageOrganization.do',            server: 'communion' },
        queryOrganization:           { url: 'queryOrganization.do' },
        addOrganization:             { url: 'addOrganization.do',             server: 'communion' },
        updateOrganization:          { url: 'updateOrganization.do',          server: 'communion' },
        updateOrganizationForStatus: { url: 'updateOrganizationForStatus.do', server: 'communion' },

        // ===== 公司 company =====
        pageCompany:            { url: 'pageCompany.do',            demo: true },
        queryCompany:           { url: 'queryCompany.do' },
        queryCompanyByCid:      { url: 'queryCompanyByCid.do' },
        addCompany:             { url: 'addCompany.do',             server: 'communion' },
        updateCompany:          { url: 'updateCompany.do',          server: 'communion' },
        updateCompanyForStatus: { url: 'updateCompanyForStatus.do', server: 'communion' },

        // ===== 系统配置 systemConfig =====
        pageSystemConfig:        { url: 'pageSystemConfig.do' },
        querySystemConfigByCid:  { url: 'querySystemConfigByCid.do' },
        querySystemConfigByGroup:{ url: 'querySystemConfigByGroup.do' },
        querySystemConfigByKey:  { url: 'querySystemConfigByKey.do' },
        addSystemConfig:    { url: 'addSystemConfig.do',    server: 'communion' },
        deleteSystemConfig: { url: 'deleteSystemConfig.do', server: 'communion' },
        updateSystemConfig: { url: 'updateSystemConfig.do', server: 'communion' },

        // ===== 城市 city（关联 region 大区）=====
        pageCity:    { url: 'pageCity.do',    server: 'communion' },
        queryCity:   { url: 'queryCity.do',   server: 'communion' },
        addCity:     { url: 'addCity.do',     server: 'communion' },
        updateCity:  { url: 'updateCity.do',  server: 'communion' },
        deleteCity:  { url: 'deleteCity.do',  server: 'communion' },

        // ===== 区域 cityProper（关联 city 城市）=====
        pageCityProper:        { url: 'pageCityProper.do',   server: 'communion' },
        queryCityProper:       { url: 'queryCityProper.do' },
        queryCityProperByCid:  { url: 'queryCityProperByCid.do' },
        addCityProper:    { url: 'addCityProper.do',    server: 'communion' },
        updateCityProper: { url: 'updateCityProper.do', server: 'communion' },
        deleteCityProper: { url: 'deleteCityProper.do', server: 'communion' },

        // ===== 区域合作人 cityProperPartner =====
        queryCityProperPartner: { url: 'queryCityProperPartner.do' },
        addCityProperPartner:   { url: 'addCityProperPartner.do',   server: 'communion' },
        deleteCityProperPartner:{ url: 'deleteCityProperPartner.do',server: 'communion' },

        // ===== 角色 role =====
        pageRole:      { url: 'pageRole.do',      demo: true },
        pageRoleByMid: { url: 'pageRoleByMid.do', demo: true },
        queryRole:     { url: 'queryRole.do',     demo: true },
        queryRoleById: { url: 'queryRoleById.do' },
        queryRoleByName:{ url: 'queryRoleByName.do' },
        queryDutyByDtid:  { url: 'queryDutyByDtid.do' },
        addRole:           { url: 'addRole.do',           server: 'communion' },
        updateRole:        { url: 'updateRole.do',        server: 'communion' },
        deleteRoleByRid:   { url: 'deleteRoleByRid.do',   server: 'communion' },

        // —— 操作（operation）CRUD ——
        pageOperation:        { url: 'pageOperation.do',        demo: true },
        queryOperation:       { url: 'queryOperation.do',       demo: true },
        queryOperationForSelf:{ url: 'queryOperationForSelf.do' },
        queryOperationByRid:  { url: 'queryOperationByRid.do',  demo: true },
        addOperation:    { url: 'addOperation.do' },
        // ⚠️ 保留后端原始拼写 "updateOpperation"（双 p），勿改成 updateOperation
        updateOpperation:      { url: 'updateOpperation.do' },
        updateRoleOperation: {
            url: 'updateRoleOperation.do',
            server: 'communion',
            intercept: true
        },
        updateRoleOperationByRid:   { url: 'updateRoleOperationByRid.do',   server: 'communion' },
        updateRoleOperationByUserId:{ url: 'updateRoleOperationByUserId.do',server: 'communion' },
        deleteOperation:     { url: 'deleteOperation.do' },
        deleteRoleOperation: {
            url: 'deleteRoleOperation.do',
            server: 'communion',
            intercept: true
        },
        syncRoleOperation:   { url: 'syncRoleOperation.do', server: 'communion' },

        // ===== 版本 version =====
        pageVersion: { url: 'pageVersion.do' },

        // ===== 服务器查询 =====
        queryServer: { url: 'queryServer.do', server: 'communion' }
    }
});

// ============ upgrade 接口（升级包） ============
$.extend(api, {
    upgrade: {
        pageUpgrade:           { url: 'pageUpgrade.do' },
        queryUpgrade:          { url: 'queryUpgrade.do' },
        matchUpgrade: {
            url: 'matchUpgrade.do',
            intercept: true
        },
        addUpgrade:            { url: 'addUpgrade.do',            server: 'communion' },
        updateUpgradeForStatus:{ url: 'updateUpgradeForStatus.do',server: 'communion' },
        deleteUpgrade:         { url: 'deleteUpgrade.do',         server: 'communion' },
        pageVersion:           { url: 'pageVersion.do' },
        queryVersion:          { url: 'queryVersion.do' },
        addVersion:            { url: 'addVersion.do',            server: 'communion' },
        updateVersion:         { url: 'updateVersion.do',         server: 'communion' },
        updateVersionForStatus:{ url: 'updateVersionForStatus.do',server: 'communion' },
        deleteVersion:         { url: 'deleteVersion.do',         server: 'communion' },
        generatePostSignature: { url: 'generatePostSignature.do' },
        getOssStsToken:        { url: 'getOssStsToken.do' },
        getProgressiveImage:   { url: 'getProgressiveImage.do' }
    }
});
