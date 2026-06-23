/**
 * 系统配置项目录 (SystemConfig Catalog)
 *
 * 定义所有可通过「公司级系统配置」页面进行维护的配置项元数据。
 * 每项包含: key(配置键) / group(分组) / name(中文名) / desc(说明) / type(数据类型) / defaultValue(默认值)
 *
 * 说明:
 * - 此目录覆盖业务运行期通过 systemConfigDao.querySystemConfig(key, company) 读取的全部配置键。
 * - 读取自 conf/sysconfig.properties 的文件型配置(加密密钥、communion 总开关、debug、disable 等)
 *   以及纯运维 token 不在本目录维护范围内,需在服务器配置文件中调整。
 * - 未在数据库落库的配置项,前端会以 defaultValue 作为占位灰显,点击「设置值」即可新增。
 */
window.SYSTEM_CONFIG_CATALOG = [

    // ==================== 报价管理 quotation ====================
    { key: "manageRate",                     group: "quotation",    name: "管理费率",             desc: "报价管理费费率(小数,如 0.08 表示 8%)",                 type: "string", defaultValue: "" },
    { key: "trafficRate",                    group: "quotation",    name: "远征费率",             desc: "报价远征费费率(小数)",                                   type: "string", defaultValue: "" },
    { key: "quotationlimit",                 group: "quotation",    name: "报价数量上限",         desc: "单个装修订单可创建的报价数量上限",                       type: "int",    defaultValue: "3" },
    { key: "quotationtimelimit",             group: "quotation",    name: "报价时效(天)",         desc: "报价有效期天数",                                         type: "int",    defaultValue: "30" },
    { key: "KEEPRICE_DAYS_INT",              group: "quotation",    name: "保价天数",             desc: "报价保价天数,超过后价格变更需重新核价",                 type: "int",    defaultValue: "30" },
    { key: "PROTATION_KEEPRICE_DAYS_INT",    group: "quotation",    name: "原型保价天数",         desc: "原型报价保价天数",                                       type: "int",    defaultValue: "30" },
    { key: "quotationFunctionAreaIndex",     group: "quotation",    name: "功能区报价下标",       desc: "报价功能区下标规则(0=不启用)",                          type: "int",    defaultValue: "0" },
    { key: "QUOTATION_CMPREH_CONFIG",        group: "quotation",    name: "综合报价配置",         desc: "报价综合计算配置(JSON 或标识)",                         type: "json",   defaultValue: "" },
    { key: "protationlimit",                 group: "quotation",    name: "原型报价上限",         desc: "原型报价数量上限",                                       type: "int",    defaultValue: "3" },
    { key: "QUOTATION_EXTENSION_MET_FLAG",   group: "quotation",    name: "增项扩展标记",         desc: "报价增项扩展计量开关(0=关闭)",                          type: "int",    defaultValue: "0" },

    // ==================== 施工管理 construction ====================
    { key: "CONSTRUCTION_ACCEPTANCE_LIMIT_INT", group: "construction", name: "验收次数上限",       desc: "施工验收次数上限",                                       type: "int",    defaultValue: "3" },
    { key: "constructionDiarydrawinglimit",  group: "construction", name: "施工日志图纸上限",     desc: "施工日志单次上传图纸数量上限",                         type: "int",    defaultValue: "20" },
    { key: "constructiondrawinglimit",       group: "construction", name: "施工图纸上限",         desc: "施工图纸单次上传数量上限",                             type: "int",    defaultValue: "20" },
    { key: "DESIGN_STATUS_CHECK_INT",        group: "construction", name: "设计状态校验",         desc: "放线前设计图纸状态校验开关(0=关闭)",                    type: "int",    defaultValue: "0" },
    { key: "accessoryLimit",                 group: "construction", name: "辅材限额",             desc: "放线辅材限额",                                           type: "int",    defaultValue: "" },
    { key: "salaryLimit",                    group: "construction", name: "工人工资限额",         desc: "放线工人工资限额",                                       type: "int",    defaultValue: "" },
    { key: "WORKER_SALARY_LIMIT_TOTAL_INT",  group: "construction", name: "工资总额上限",         desc: "工人工资总额上限",                                       type: "int",    defaultValue: "" },

    // ==================== 客户管理 customer ====================
    { key: "CUSTOMER_ISSUE_RULE_INT",        group: "customer",     name: "客户分发规则",         desc: "客户信息分发规则(0=不限制)",                            type: "int",    defaultValue: "0" },
    { key: "CUSTOMER_USER_RULE_CONTROL",     group: "customer",     name: "客户归属控制",         desc: "客户归属人变更控制开关",                                 type: "int",    defaultValue: "0" },
    { key: "MEMBER_ENABLE_FLAG",             group: "customer",     name: "会员功能开关",         desc: "会员体系功能开关(0=关闭)",                              type: "int",    defaultValue: "0" },
    { key: "MESSAGE_DING_GROUP_ECUSTOMER",   group: "customer",     name: "电商客户通知群",       desc: "电商客户钉钉通知群 ID",                                 type: "string", defaultValue: "" },
    { key: "MESSAGE_DING_GROUP_VUSTOMER",    group: "customer",     name: "无效客户通知群",       desc: "无效/失效客户钉钉通知群 ID",                            type: "string", defaultValue: "" },

    // ==================== 支付管理 payment ====================
    { key: "PAYMENT_PLATFORM_PATH_STR",      group: "payment",      name: "支付平台地址",         desc: "统一支付平台接口地址",                                   type: "url",    defaultValue: "" },
    { key: "PAYMENT_PLATFORM_WXPAY_PATH_STR",group: "payment",      name: "微信支付地址",         desc: "微信支付平台接口地址",                                   type: "url",    defaultValue: "" },
    { key: "PAYMENT_PLATFORM_POSPAY_PATH_STR",group: "payment",     name: "POS支付地址",          desc: "POS 支付接口地址",                                      type: "url",    defaultValue: "" },
    { key: "PAYMENT_PLATFORM_WXPAY_PATH_B_STR",   group: "payment", name: "微信支付地址(B)",     desc: "微信支付平台 B 接口地址",                               type: "url",    defaultValue: "" },
    { key: "PAYMENT_PLATFORM_WXPAY_PATH_7_B_STR", group: "payment", name: "微信支付地址(7B)",    desc: "微信支付平台 7-B 接口地址",                             type: "url",    defaultValue: "" },
    { key: "APPLET_PAYMENT_CONFIG",          group: "payment",      name: "小程序支付配置",       desc: "小程序支付配置(JSON)",                                  type: "json",   defaultValue: "" },
    { key: "PAYMENT_DESIGN_FEE_LIMIT",       group: "payment",      name: "设计费支付限制",       desc: "设计费收款限制规则",                                     type: "int",    defaultValue: "0" },
    { key: "PAYMENT_TYPE_SUPROFIT_INT",      group: "payment",      name: "供应商分润类型",       desc: "供应商分润计算类型(0=关闭)",                            type: "int",    defaultValue: "0" },
    { key: "MESSAGE_DING_GROUP_AWARD_PURCHASE",  group: "payment",  name: "返款通知群",           desc: "返款/奖励钉钉通知群 ID",                                type: "string", defaultValue: "" },
    { key: "MESSAGE_DING_GROUP_ADDREDUCE",       group: "payment",  name: "增减项通知群",         desc: "增减项款项钉钉通知群 ID",                               type: "string", defaultValue: "" },
    { key: "MESSAGE_DING_GROUP_ADVANCE_PAYMENT", group: "payment",  name: "预付款通知群",         desc: "预付款钉钉通知群 ID",                                   type: "string", defaultValue: "" },

    // ==================== 主材销售 sales ====================
    { key: "SALES_PICTURE_LIMIT",            group: "sales",        name: "销售图片上限",         desc: "主材销售单据图片上传数量上限",                         type: "int",    defaultValue: "20" },
    { key: "SALES_AUTO_BALANCE_INT",         group: "sales",        name: "自动结算开关",         desc: "主材销售自动结算开关(0=关闭)",                          type: "int",    defaultValue: "0" },
    { key: "SALES_MUILT_BALANCE_INT",        group: "sales",        name: "多次结算开关",         desc: "主材销售多次结算开关(0=关闭)",                          type: "int",    defaultValue: "0" },
    { key: "BALANCE_PICTURE_LIMIT",          group: "sales",        name: "结算图片上限",         desc: "结算单据图片上传数量上限",                             type: "int",    defaultValue: "20" },

    // ==================== 人事管理 personel ====================
    { key: "userlimit",                      group: "personel",     name: "员工数量上限",         desc: "员工账号数量上限(0=不限)",                              type: "int",    defaultValue: "0" },
    { key: "instorerlimit",                  group: "personel",     name: "库管数量上限",         desc: "库管账号数量上限(0=不限)",                              type: "int",    defaultValue: "0" },
    { key: "supplierlimit",                  group: "personel",     name: "供应商数量上限",       desc: "供应商账号数量上限(0=不限)",                            type: "int",    defaultValue: "0" },
    { key: "password",                       group: "personel",     name: "默认密码",             desc: "新增员工/库管/供应商的初始密码",                       type: "string", defaultValue: "" },
    { key: "visitor",                        group: "personel",     name: "访客角色ID",           desc: "访客默认角色 ID",                                       type: "int",    defaultValue: "" },
    { key: "instorer",                       group: "personel",     name: "库管角色ID",           desc: "库管默认角色 ID",                                       type: "int",    defaultValue: "" },
    { key: "supplier",                       group: "personel",     name: "供应商角色ID",         desc: "供应商默认角色 ID",                                     type: "int",    defaultValue: "" },
    { key: "supplierDept",                   group: "personel",     name: "供应商部门",           desc: "供应商归属部门 ID",                                     type: "int",    defaultValue: "" },
    { key: "supplierDuty",                   group: "personel",     name: "供应商职务",           desc: "供应商默认职务 ID",                                     type: "int",    defaultValue: "" },
    { key: "workerDepositLimit",             group: "personel",     name: "工人押金限额",         desc: "工人押金限额",                                           type: "int",    defaultValue: "" },
    { key: "salarydrawinglimit",             group: "personel",     name: "工资领取上限",         desc: "工资单次领取数量上限",                                 type: "int",    defaultValue: "" },
    { key: "planlimit",                      group: "personel",     name: "计划数量上限",         desc: "工程计划数量上限",                                       type: "int",    defaultValue: "" },
    { key: "CONTRACT_COUNT_LIMIT_INT",       group: "personel",     name: "合同数量上限",         desc: "合同生成数量上限",                                       type: "int",    defaultValue: "" },

    // ==================== 钉钉集成 dingtalk ====================
    { key: "DINGTALK_OAPI_URL_STR",          group: "dingtalk",     name: "钉钉接口地址",         desc: "钉钉开放平台 OAPI 地址",                                type: "url",    defaultValue: "" },
    { key: "DINGTALK_CORPID_STR",            group: "dingtalk",     name: "钉钉企业ID",           desc: "钉钉企业 corpId",                                       type: "string", defaultValue: "" },
    { key: "DINGTALK_SECRET_STR",            group: "dingtalk",     name: "钉钉应用密钥",         desc: "钉钉应用 secret",                                       type: "string", defaultValue: "" },
    { key: "corpId",                         group: "dingtalk",     name: "钉钉 corpId",          desc: "钉钉免登 corpId",                                       type: "string", defaultValue: "" },
    { key: "oapiHost",                       group: "dingtalk",     name: "钉钉 API Host",        desc: "钉钉接口 host(用于审批/部门/消息/用户)",                type: "url",    defaultValue: "" },
    { key: "messageAgentId",                 group: "dingtalk",     name: "消息应用AgentId",      desc: "钉钉工作通知应用 agentId",                              type: "string", defaultValue: "" },
    { key: "messageUrl",                     group: "dingtalk",     name: "消息接口地址",         desc: "钉钉消息接口地址",                                       type: "url",    defaultValue: "" },
    { key: "dingAgentId",                    group: "dingtalk",     name: "钉钉AgentId",          desc: "钉钉应用 agentId",                                      type: "string", defaultValue: "" },
    { key: "suiteKey",                       group: "dingtalk",     name: "回调套件Key",          desc: "钉钉事件回调 suiteKey",                                 type: "string", defaultValue: "" },
    { key: "encodingAesKey",                 group: "dingtalk",     name: "回调加密Key",          desc: "钉钉事件回调 encodingAesKey",                           type: "string", defaultValue: "" },
    { key: "token",                          group: "dingtalk",     name: "回调Token",            desc: "钉钉事件回调 token",                                    type: "string", defaultValue: "" },

    // ==================== 微信集成 wechat ====================
    { key: "WECHAT_WXAPI_PATH_STR",          group: "wechat",       name: "微信接口地址",         desc: "微信接口统一地址",                                       type: "url",    defaultValue: "" },
    { key: "WECHAT_APPID_0",                 group: "wechat",       name: "公众号AppID",          desc: "微信公众号 AppID",                                      type: "string", defaultValue: "" },
    { key: "WECHAT_APPID_0_0",               group: "wechat",       name: "消息AppID",            desc: "微信消息 AppID",                                        type: "string", defaultValue: "" },
    { key: "WECHAT_APPID_1",                 group: "wechat",       name: "小程序AppID",          desc: "微信小程序 AppID",                                      type: "string", defaultValue: "" },
    { key: "WECHAT_APPID_1_5",               group: "wechat",       name: "小程序AppID(5)",       desc: "微信小程序 AppID(变体5)",                               type: "string", defaultValue: "" },
    { key: "WECHAT_SECRET_0",                group: "wechat",       name: "公众号Secret",         desc: "微信公众号 AppSecret",                                  type: "string", defaultValue: "" },
    { key: "WECHAT_SECRET_1",                group: "wechat",       name: "小程序Secret",         desc: "微信小程序 AppSecret",                                  type: "string", defaultValue: "" },
    { key: "WECHAT_NONCESTR",                group: "wechat",       name: "微信NonceStr",         desc: "微信签名 nonceStr",                                     type: "string", defaultValue: "" },
    { key: "WECHAT_COMMUNION_URL",           group: "wechat",       name: "微信回调地址",         desc: "微信服务回调地址",                                       type: "url",    defaultValue: "" },

    // ==================== 世雅集成 seiya ====================
    { key: "SSO_URL_STR",                    group: "seiya",        name: "SSO地址",              desc: "世雅单点登录地址",                                       type: "url",    defaultValue: "" },
    { key: "SSO_SECRET_STR",                 group: "seiya",        name: "SSO密钥",              desc: "世雅单点登录 secret",                                   type: "string", defaultValue: "" },
    { key: "PM_URL_STR",                     group: "seiya",        name: "PM地址",               desc: "世雅项目管理接口地址",                                   type: "url",    defaultValue: "" },

    // ==================== 装饰订单 decoration ====================
    { key: "isv",                            group: "decoration",   name: "ISV白标开关",          desc: "是否启用 ISV/白标模式(0=关闭)",                         type: "int",    defaultValue: "0" },
    { key: "communion",                      group: "decoration",   name: "集团版开关",           desc: "集团/共享版功能开关(DB 级,非文件总开关)",              type: "string", defaultValue: "" },
    { key: "TENCENT_MAP_KEY_STR",            group: "decoration",   name: "腾讯地图Key",          desc: "腾讯地图服务 Key",                                       type: "string", defaultValue: "" },

    // ==================== 金蝶对接 kingdee ====================
    { key: "salesCollectPurpose",            group: "kingdee",      name: "销售收款用途",         desc: "金蝶销售收款对应用途编码",                               type: "string", defaultValue: "" },
    { key: "salesCollectBill",               group: "kingdee",      name: "销售收款单据",         desc: "金蝶销售收款单据类型",                                   type: "string", defaultValue: "" },
    { key: "costReceivableBill",             group: "kingdee",      name: "成本应收单据",         desc: "金蝶成本应收单据类型",                                   type: "string", defaultValue: "" },
    { key: "decorationCostCode",             group: "kingdee",      name: "装饰成本编码",         desc: "金蝶装饰成本科目编码",                                   type: "string", defaultValue: "" },
    { key: "decorationCostDept",             group: "kingdee",      name: "装饰成本部门",         desc: "金蝶装饰成本核算部门",                                   type: "string", defaultValue: "" },
    { key: "salesRefundBill",                group: "kingdee",      name: "销售退款单据",         desc: "金蝶销售退款单据类型",                                   type: "string", defaultValue: "" },
    { key: "otherCollectBill",               group: "kingdee",      name: "其他收款单据",         desc: "金蝶其他收款单据类型",                                   type: "string", defaultValue: "" },
    { key: "otherRefundBill",                group: "kingdee",      name: "其他退款单据",         desc: "金蝶其他退款单据类型",                                   type: "string", defaultValue: "" },
    { key: "replaceMaterial",                group: "kingdee",      name: "换料编码",             desc: "金蝶换料对应编码",                                       type: "string", defaultValue: "" }
];

/**
 * 分组定义: 分组编码 → 中文名 + 显示顺序
 * 与 company4params.html 的下拉选项保持一致,并补充 kingdee 分组。
 */
window.SYSTEM_CONFIG_GROUPS = {
    "decoration":   { name: "装饰订单配置", order: 1 },
    "quotation":    { name: "报价管理配置", order: 2 },
    "construction": { name: "施工管理配置", order: 3 },
    "customer":     { name: "客户管理配置", order: 4 },
    "payment":      { name: "支付管理配置", order: 5 },
    "sales":        { name: "主材销售配置", order: 6 },
    "personel":     { name: "人事管理配置", order: 7 },
    "dingtalk":     { name: "钉钉集成配置", order: 8 },
    "wechat":       { name: "微信集成配置", order: 9 },
    "seiya":        { name: "世雅集成配置", order: 10 },
    "kingdee":      { name: "金蝶对接配置", order: 11 },
    "default":      { name: "其他配置",     order: 99 }
};
