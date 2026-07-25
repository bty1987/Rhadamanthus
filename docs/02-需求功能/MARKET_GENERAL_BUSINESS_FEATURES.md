# Market 通用业务功能规划

> 目标: 基于现有 `src/com/fanglin/market`、`WebContent/js/market`、`WebContent/views/market`、`dbs/market.sql` 的分层结构, 将当前偏装修行业的展示获客能力, 扩展为适用于多数企业的通用市场营销模块。

---

## 1. 现状基线

现有 market 模块已经具备以下能力:

| 现有对象 | 当前含义 | 可抽象为通用能力 |
| --- | --- | --- |
| `Ecity` | 城市 | 区域/市场范围 |
| `Eperson` | 设计师/监理等人员展示 | 员工/顾问/达人/销售顾问主页 |
| `Ecase` | 装修案例 | 案例/作品/项目/成功实践 |
| `Eopinions` | 口碑内容 | 评价/证言/客户故事/媒体背书 |
| `Epicture` | 案例/口碑图片 | 内容素材图片库 |
| `Ecustomer` | 报名客户 | 营销线索/表单留资 |
| `Cuser` | 微信用户 | C端访客/社交用户 |
| `Card` | 电子名片 | 个人主页/分享名片/销售名片 |
| `CardPhoto` | 名片照片墙 | 名片素材/个人作品图集 |
| `Cnotice` | 消息事务 | 线索通知/互动通知 |

当前不足:

| 问题 | 影响 |
| --- | --- |
| 命名带 `E`、`C` 前缀, 业务语义不清 | 后续扩展和跨行业复用成本高 |
| 表单线索字段偏装修, 如 `villageName`、`area` | 不适用于教育、医疗、本地生活、B2B SaaS、零售等行业 |
| 缺少活动、渠道、落地页、触达、转化、统计闭环 | 难以支撑现代营销运营 |
| 内容、线索、商城、会员、优惠券边界不清 | 难以统一分析 ROI 和转化漏斗 |

建议采取“兼容保留 + 新增通用模型”的方式演进: 保留现有 `Ecase/Ecustomer/Card` 等接口, 新增更通用的 `Campaign/Inbound/Content/Channel` 等能力, 逐步将旧对象映射到新对象。

---

## 2. 通用 Market 能力地图

通用市场营销模块建议拆成 9 个业务域:

| 业务域 | 目标 | 核心对象 |
| --- | --- | --- |
| 市场资产 | 管理品牌可传播资产 | 内容、图片、视频、案例、评价、名片、门店/区域 |
| 营销活动 | 承载推广主题和权益 | 活动、活动页、活动商品/权益、报名表单 |
| 渠道来源 | 识别客户从哪里来 | 渠道、推广链接、二维码、UTM、投放批次 |
| 入站承接 | 管理获客入站和 Customer 承接 | 表单入站、承接结果、归因映射、失败重试 |
| 客群标签 | 支撑精细化运营 | 客群、标签、分群规则、黑名单 |
| 权益优惠 | 促进转化和复购 | 优惠券、礼包、积分、邀请码、核销记录 |
| 触达通知 | 自动或人工触达客户 | 短信、企微/微信、邮件、站内信、任务提醒 |
| 转化漏斗 | 衡量业务结果 | 浏览、点击、留资、领取、下单、支付、核销 |
| 数据看板 | 支撑运营决策 | 活动报表、渠道报表、入站报表、归因报表 |

---

## 3. 推荐模块设计

### 3.1 市场资产

用于管理所有可被营销活动复用的内容和素材, 不绑定装修行业。

| 功能 | 说明 | 可复用现有对象 |
| --- | --- | --- |
| 内容管理 | 图文、短视频、海报、案例、客户故事、FAQ | `Ecase`, `Eopinions` |
| 素材库 | 图片、视频、附件、封面、二维码 | `Epicture`, `CardPhoto` |
| 人员主页 | 销售、顾问、讲师、医生、设计师、达人主页 | `Eperson`, `Card` |
| 区域/门店 | 城市、门店、服务范围、经纬度 | `Ecity` |
| 评价背书 | 客户评价、媒体报道、资质证书、成功案例 | `Eopinions` |

建议新增通用对象:

| 对象 | 表名建议 | 说明 |
| --- | --- | --- |
| `MarketContent` | `market_content` | 通用内容, 支持文章/案例/评价/视频/FAQ |
| `MarketMaterial` | `market_material` | 素材库, 图片/视频/文件统一管理 |
| `MarketProfile` | `market_profile` | 人员/门店/品牌主页 |
| `MarketRegion` | `market_region` | 区域、城市、门店服务范围 |

内容类型建议:

| type | 含义 |
| --- | --- |
| `0` | 图文 |
| `1` | 案例 |
| `2` | 评价/证言 |
| `3` | 视频 |
| `4` | FAQ |
| `5` | 海报/单页 |

### 3.2 营销活动

活动是市场运营的主线, 可用于新品发布、课程报名、门店引流、服务咨询、节日促销、会员拉新等。

| 功能 | 说明 |
| --- | --- |
| 活动创建 | 活动名称、时间、区域、预算、负责人、状态 |
| 活动页配置 | banner、主文案、内容区块、表单、权益、分享图 |
| 活动表单 | 自定义字段, 如姓名、电话、行业、需求、预算、意向产品 |
| 活动权益 | 关联优惠券、礼包、积分、试用名额、资料包 |
| 活动发布 | 草稿、预热、进行中、暂停、结束、归档 |
| 活动复盘 | 浏览、点击、留资、转化、成本、ROI |

建议对象:

| 对象 | 表名建议 | 说明 |
| --- | --- | --- |
| `MarketCampaign` | `market_campaign` | 活动主表 |
| `MarketCampaignPage` | `market_campaign_page` | 活动页配置 |
| `MarketCampaignForm` | `market_campaign_form` | 活动表单定义 |
| `MarketCampaignItem` | `market_campaign_item` | 活动权益/商品/内容项 |
| `MarketCampaignRecord` | `market_campaign_record` | 活动行为记录 |

状态建议:

| status | 含义 |
| --- | --- |
| `0` | 草稿 |
| `1` | 预热 |
| `2` | 进行中 |
| `3` | 暂停 |
| `4` | 结束 |
| `5` | 归档 |

### 3.3 渠道来源

渠道是通用营销系统中非常关键的基础能力, 用于回答“客户从哪里来”。

| 功能 | 说明 |
| --- | --- |
| 渠道管理 | 抖音、小红书、视频号、公众号、百度、线下门店、转介绍、异业合作 |
| 推广链接 | 每个活动/人员/门店生成独立链接 |
| 二维码 | 支持海报、门店码、人员码、渠道码 |
| UTM 参数 | 支持 `source/medium/campaign/content/term` |
| 渠道归因 | 首次来源、最近来源、转化来源 |
| 渠道成本 | 投放成本、素材成本、人员成本 |

建议对象:

| 对象 | 表名建议 | 说明 |
| --- | --- | --- |
| `MarketChannel` | `market_channel` | 渠道定义 |
| `MarketSource` | `market_source` | 推广来源/二维码/链接 |
| `MarketAttribution` | `market_attribution` | 客资/机会/订单归因记录 |
| `MarketCost` | `market_cost` | 渠道或活动成本 |

渠道类型建议:

| type | 含义 |
| --- | --- |
| `0` | 自然流量 |
| `1` | 搜索投放 |
| `2` | 信息流投放 |
| `3` | 社交媒体 |
| `4` | 内容平台 |
| `5` | 线下活动 |
| `6` | 转介绍 |
| `7` | 异业合作 |
| `8` | 私域触达 |

### 3.4 表单入站与 Customer 承接

现有 `customer` 模块已经有 `CustomerSource`、`CustomerOrigin`、`CustomerChance` 等客户资源和机会对象。Market 不再长期持有完整线索主数据, 只管理活动表单入站、归因快照和写入 Customer 的承接结果。旧 `Ecustomer` 可作为 `MarketInbound` 的历史来源兼容。

| 功能 | 说明 |
| --- | --- |
| 表单入站 | 活动页、名片、案例、客服、商城等入口统一提交入站记录 |
| 入站快照 | 保存表单原始字段、来源码、活动、渠道、提交时间、IP/UA 等审计信息 |
| 承接写入 | 调用 `CustomerSourceService.addCustomerSource` 或 `CustomerChanceService.addCustomerChance` 创建客资/机会 |
| 承接状态 | 记录待承接、承接成功、承接失败、重试中、忽略等状态 |
| 归因映射 | 保存 `campaignId/sourceId` 与 `csid/ccid/orderId` 的关系 |
| 防刷幂等 | 对手机号、来源码、活动、时间窗做幂等和限流 |
| 失败重试 | Customer 写入失败时保留快照, 支持后台重试或人工处理 |

建议对象:

| 对象 | 表名建议 | 说明 |
| --- | --- | --- |
| `MarketInbound` | `market_inbound` | 表单入站快照和承接结果 |
| `MarketInboundItem` | `market_inbound_item` | 自定义表单字段值 |
| `MarketAttribution` | `market_attribution` | 活动/渠道与 Customer 客资/机会/订单的归因映射 |

入站主表建议字段:

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `miid` | bigint | 入站ID |
| `inboundNo` | varchar | 入站编号 |
| `name` | varchar | 姓名/称呼 |
| `phone` | varchar | 手机号, 建议加密存储 |
| `wechat` | varchar | 微信号 |
| `email` | varchar | 邮箱 |
| `companyName` | varchar | 企业/组织名称 |
| `demand` | varchar | 需求描述 |
| `channelId` | bigint | 渠道ID |
| `sourceId` | bigint | 来源ID |
| `campaignId` | bigint | 活动ID |
| `csid` | bigint | CustomerSource ID, 承接成功后回写 |
| `ccid` | bigint | CustomerChance ID, 承接成功后回写 |
| `orderId` | varchar | 转单后回写 |
| `status` | tinyint | 承接状态 |
| `errorMsg` | varchar | 承接失败原因 |
| `createTime` | timestamp | 创建时间 |
| `updateTime` | timestamp | 更新时间 |
| `company` | int | 公司 |

行业扩展建议使用 `MarketInboundItem` 存储, 示例:

| fieldKey | fieldValue | 适用行业 |
| --- | --- | --- |
| `budget` | `10000-30000` | 通用 |
| `city` | `上海` | 通用 |
| `productInterest` | `企业版` | SaaS/零售 |
| `courseInterest` | `Python训练营` | 教育 |
| `appointmentTime` | `2026-07-20 10:00` | 本地服务/医疗 |
| `houseArea` | `120` | 装修行业兼容字段 |

### 3.5 客群标签

用于后续自动化运营、精准触达、活动人群圈选。
Customer 已有画像和部分规则能力, 但 Market 的客群标签更偏行为、渠道、活动和触达效果, 建议作为营销旁路能力建设。P0 可先不实现, P2 再通过 Customer 引用和脱敏索引进行圈选。

| 功能 | 说明 |
| --- | --- |
| 标签管理 | 用户属性、兴趣、行为、来源、生命周期标签 |
| 客群分组 | 静态客群、动态客群 |
| 行为标签 | 浏览案例、领取优惠券、打开短信、提交表单 |
| 黑名单 | 退订、投诉、无效号码、竞品/内部人员 |
| 导入导出 | 批量导入客户/名单, 导出活动名单 |

建议对象:

| 对象 | 表名建议 | 说明 |
| --- | --- | --- |
| `MarketTag` | `market_tag` | 标签定义 |
| `MarketAudience` | `market_audience` | 客群定义 |
| `MarketAudienceItem` | `market_audience_item` | 客群成员 |
| `MarketBlacklist` | `market_blacklist` | 黑名单 |

### 3.6 权益优惠

现有商城文档已有 Coupon 能力, Customer 已有积分和电子会员能力。通用 Market 不必重做账户和核销底座, 更适合做权益编排层, 统一调度优惠券、礼包、积分、试用资格、资料包等权益, 并通过适配层落到 Customer/Store。

| 功能 | 说明 |
| --- | --- |
| 优惠券 | 满减、折扣、兑换、体验券、服务券 |
| 礼包 | 多权益组合, 如资料包+体验券+积分 |
| 邀请码 | 裂变邀请、员工推荐、老客推荐 |
| 领取限制 | 每人限领、渠道限领、活动限领、库存限制 |
| 核销 | 到店核销、订单抵扣、人工核销、自动核销 |
| 过期提醒 | 权益到期前提醒 |

建议对象:

| 对象 | 表名建议 | 说明 |
| --- | --- | --- |
| `MarketBenefit` | `market_benefit` | 通用权益定义 |
| `MarketBenefitPackage` | `market_benefit_package` | 礼包 |
| `MarketBenefitUser` | `market_benefit_user` | 用户领取记录 |
| `MarketBenefitUse` | `market_benefit_use` | 核销/使用记录 |
| `MarketInvite` | `market_invite` | 邀请/裂变关系 |

### 3.7 触达通知

将 `Cnotice` 扩展为通用触达与任务能力。Customer 的回访、反馈、投诉、维修继续承担服务阶段工单; Market 的触达重点放在售前转化、活动召回、权益提醒、沉睡激活、复购排除和效果追踪。

| 功能 | 说明 |
| --- | --- |
| 线索通知 | 新线索通知负责人/部门/群机器人 |
| 跟进任务 | 到期提醒、超时提醒、沉睡唤醒 |
| 营销触达 | 短信、邮件、公众号模板消息、企微消息 |
| 触达模板 | 按场景配置文案模板 |
| 退订管理 | 用户退订和黑名单联动 |
| 触达记录 | 发送、到达、打开、点击、失败原因 |

建议对象:

| 对象 | 表名建议 | 说明 |
| --- | --- | --- |
| `MarketNotice` | `market_notice` | 通知任务 |
| `MarketTouch` | `market_touch` | 触达记录 |
| `MarketTouchTemplate` | `market_touch_template` | 触达模板 |
| `MarketTask` | `market_task` | 人工跟进任务 |

### 3.8 转化漏斗

通用营销不应只看留资, 需要记录从曝光到成交的完整路径。

| 漏斗节点 | 说明 |
| --- | --- |
| `view` | 页面/内容曝光 |
| `click` | 按钮/链接点击 |
| `share` | 分享 |
| `submit` | 表单提交 |
| `receive` | 权益领取 |
| `appoint` | 预约/咨询 |
| `order` | 下单/创建业务单 |
| `pay` | 支付 |
| `verify` | 核销 |
| `deal` | 成交 |

建议对象:

| 对象 | 表名建议 | 说明 |
| --- | --- | --- |
| `MarketEvent` | `market_event` | 埋点事件 |
| `MarketConversion` | `market_conversion` | 转化记录 |
| `MarketFunnelDaily` | `market_funnel_daily` | 日维度聚合 |

### 3.9 数据看板

| 看板 | 指标 |
| --- | --- |
| 活动看板 | PV、UV、留资数、承接成本、成交数、ROI |
| 渠道看板 | 渠道访问、渠道留资、渠道成交、渠道成本 |
| 内容看板 | 阅读、收藏、分享、表单转化 |
| 人员看板 | 名片访问、入站数、Customer机会数、成交数 |
| 承接看板 | 入站、新增客资、机会分配、预约、成交、无效 |
| 权益看板 | 领取、使用、过期、核销率、带单金额 |

---

## 4. 后端结构建议

沿用项目现有三层结构:

```text
src/com/fanglin/market/
├── action/
├── service/
│   └── impl/
├── dao/
│   └── impl/
├── po/
└── vo/
```

推荐新增类:

| 业务 | Action | Service | DAO | PO/VO |
| --- | --- | --- | --- | --- |
| 活动 | `MarketCampaignAction` | `MarketCampaignService` | `MarketCampaignDao` | `MarketCampaignPO/VO` |
| 渠道 | `MarketChannelAction` | `MarketChannelService` | `MarketChannelDao` | `MarketChannelPO/VO` |
| 来源 | `MarketSourceAction` | `MarketSourceService` | `MarketSourceDao` | `MarketSourcePO/VO` |
| 内容 | `MarketContentAction` | `MarketContentService` | `MarketContentDao` | `MarketContentPO/VO` |
| 素材 | `MarketMaterialAction` | `MarketMaterialService` | `MarketMaterialDao` | `MarketMaterialPO/VO` |
| 入站 | `MarketInboundAction` | `MarketInboundService` | `MarketInboundDao` | `MarketInboundPO/VO` |
| 归因 | `MarketAttributionAction` | `MarketAttributionService` | `MarketAttributionDao` | `MarketAttributionPO/VO` |
| 客群 | `MarketAudienceAction` | `MarketAudienceService` | `MarketAudienceDao` | `MarketAudiencePO/VO` |
| 标签 | `MarketTagAction` | `MarketTagService` | `MarketTagDao` | `MarketTagPO/VO` |
| 权益 | `MarketBenefitAction` | `MarketBenefitService` | `MarketBenefitDao` | `MarketBenefitPO/VO` |
| 触达 | `MarketTouchAction` | `MarketTouchService` | `MarketTouchDao` | `MarketTouchPO/VO` |
| 事件 | `MarketEventAction` | `MarketEventService` | `MarketEventDao` | `MarketEventPO/VO` |

命名遵守现有规范:

| 场景 | 方法名示例 |
| --- | --- |
| 分页活动 | `pageMarketCampaign` |
| 查询启用活动 | `queryMarketCampaignForEnable` |
| 新增活动 | `addMarketCampaign` |
| 更新活动 | `updateMarketCampaign` |
| 发布活动 | `publishMarketCampaign` |
| 暂停活动 | `disableMarketCampaign` |
| 添加入站 | `addMarketInbound` |
| 重试承接 | `retryMarketInbound` |
| 查询归因 | `queryMarketAttributionByCsid` |
| 统计活动漏斗 | `countMarketEventForCampaign` |

---

## 5. 前端结构建议

沿用现有目录:

```text
WebContent/views/market/
WebContent/js/market/
WebContent/js/api/market.js
WebContent/js/condition/market.js
WebContent/ds/market.json
```

推荐页面:

| 页面 | 路径建议 | 说明 |
| --- | --- | --- |
| 活动管理 | `views/market/campaign.html` / `js/market/campaign.js` | 活动列表、创建、发布、暂停 |
| 活动编辑 | `views/market/campaignPage.html` / `js/market/campaignPage.js` | 活动页区块、表单、权益配置 |
| 渠道管理 | `views/market/channel.html` / `js/market/channel.js` | 渠道、链接、二维码 |
| 内容管理 | `views/market/content.html` / `js/market/content.js` | 图文、案例、评价、视频 |
| 素材库 | `views/market/material.html` / `js/market/material.js` | 图片/视频/附件素材 |
| 入站记录 | `views/market/inbound.html` / `js/market/inbound.js` | 表单入站、承接状态、失败重试 |
| 归因查询 | `views/market/attribution.html` / `js/market/attribution.js` | 活动/渠道与客资、机会、订单映射 |
| 客群标签 | `views/market/audience.html` / `js/market/audience.js` | 标签、分群、黑名单 |
| 权益管理 | `views/market/benefit.html` / `js/market/benefit.js` | 优惠券、礼包、核销 |
| 营销看板 | `views/market/dashboard.html` / `js/market/dashboard.js` | 活动/渠道/入站/归因报表 |

---

## 6. API 设计草案

新增 API 应写入 `WebContent/js/api/market.js` 和 `docs/03-API文档/API/modules/market.md`。

```javascript
$.extend(api, {market: {
    pageMarketCampaign: {url: "pageMarketCampaign.do"},
    queryMarketCampaignForEnable: {url: "queryMarketCampaignForEnable.do"},
    addMarketCampaign: {url: "addMarketCampaign.do"},
    updateMarketCampaign: {url: "updateMarketCampaign.do"},
    publishMarketCampaign: {url: "publishMarketCampaign.do"},
    disableMarketCampaign: {url: "disableMarketCampaign.do"},

    pageMarketChannel: {url: "pageMarketChannel.do"},
    queryMarketChannelForEnable: {url: "queryMarketChannelForEnable.do"},
    addMarketChannel: {url: "addMarketChannel.do"},
    updateMarketChannel: {url: "updateMarketChannel.do"},

    pageMarketSource: {url: "pageMarketSource.do"},
    addMarketSource: {url: "addMarketSource.do"},
    updateMarketSource: {url: "updateMarketSource.do"},
    disableMarketSource: {url: "disableMarketSource.do"},

    pageMarketContent: {url: "pageMarketContent.do"},
    queryMarketContentByMcid: {url: "queryMarketContentByMcid.do"},
    addMarketContent: {url: "addMarketContent.do"},
    updateMarketContent: {url: "updateMarketContent.do"},
    publishMarketContent: {url: "publishMarketContent.do"},

    pageMarketInbound: {url: "pageMarketInbound.do"},
    queryMarketInboundByMiid: {url: "queryMarketInboundByMiid.do"},
    addMarketInbound: {url: "addMarketInbound.do", intercept: true},
    retryMarketInbound: {url: "retryMarketInbound.do"},
    queryMarketAttributionByCsid: {url: "queryMarketAttributionByCsid.do"},

    pageMarketTag: {url: "pageMarketTag.do"},
    addMarketTag: {url: "addMarketTag.do"},
    updateMarketTag: {url: "updateMarketTag.do"},

    pageMarketAudience: {url: "pageMarketAudience.do"},
    addMarketAudience: {url: "addMarketAudience.do"},
    updateMarketAudience: {url: "updateMarketAudience.do"},

    pageMarketBenefit: {url: "pageMarketBenefit.do"},
    addMarketBenefit: {url: "addMarketBenefit.do"},
    receiveMarketBenefit: {url: "receiveMarketBenefit.do", intercept: true},
    useMarketBenefit: {url: "useMarketBenefit.do"},

    addMarketEvent: {url: "addMarketEvent.do", intercept: true},
    countMarketEventForCampaign: {url: "countMarketEventForCampaign.do"},
    countMarketInboundForChannel: {url: "countMarketInboundForChannel.do"}
}});
```

---

## 7. 数据库设计草案

仍使用 `market` catalog, 新表统一使用 `market_` 前缀, 与旧表区分。

### 7.1 核心表

| 表名 | 说明 | 优先级 |
| --- | --- | --- |
| `market_campaign` | 营销活动 | P0 |
| `market_campaign_page` | 活动页配置 | P1 |
| `market_campaign_form` | 活动表单定义 | P1 |
| `market_channel` | 渠道 | P0 |
| `market_source` | 推广来源/二维码/链接 | P0 |
| `market_inbound` | 表单入站快照 | P0 |
| `market_inbound_item` | 入站扩展字段 | P0 |
| `market_attribution` | 活动/渠道归因映射 | P0 |
| `market_content` | 内容资产 | P1 |
| `market_material` | 素材资产 | P1 |
| `market_tag` | 标签 | P2 |
| `market_audience` | 客群 | P2 |
| `market_benefit` | 权益 | P2 |
| `market_event` | 行为事件 | P1 |

### 7.2 P0 表字段建议

#### `market_campaign`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `mcid` | int | 活动ID |
| `name` | varchar(128) | 活动名称 |
| `type` | tinyint | 活动类型 |
| `regionId` | int | 区域/城市 |
| `ownerId` | int | 负责人 |
| `budget` | decimal(10,2) | 预算 |
| `startTime` | timestamp | 开始时间 |
| `endTime` | timestamp | 结束时间 |
| `status` | tinyint | 状态 |
| `comment` | varchar(255) | 备注 |
| `createTime` | timestamp | 创建时间 |
| `updateTime` | timestamp | 更新时间 |
| `company` | int | 公司 |

#### `market_channel`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `mchid` | int | 渠道ID |
| `name` | varchar(64) | 渠道名称 |
| `type` | tinyint | 渠道类型 |
| `platform` | varchar(64) | 平台, 如 douyin/xhs/wechat/baidu/offline |
| `ownerId` | int | 负责人 |
| `status` | tinyint | 状态, 0启用/1禁用 |
| `comment` | varchar(255) | 备注 |
| `company` | int | 公司 |

#### `market_source`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `msid` | int | 来源ID |
| `channelId` | int | 渠道ID |
| `campaignId` | int | 活动ID |
| `profileId` | int | 人员/门店/名片ID, 可空 |
| `code` | varchar(64) | 来源码 |
| `url` | varchar(255) | 推广链接 |
| `qrcode` | varchar(255) | 二维码图片 |
| `utmSource` | varchar(64) | UTM source |
| `utmMedium` | varchar(64) | UTM medium |
| `utmCampaign` | varchar(64) | UTM campaign |
| `status` | tinyint | 状态 |
| `createTime` | timestamp | 创建时间 |

#### `market_inbound`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `miid` | int | 入站ID |
| `inboundNo` | varchar(64) | 入站编号 |
| `name` | varchar(64) | 姓名/称呼 |
| `phone` | varchar(128) | 手机号, 建议 AES 加密 |
| `wechat` | varchar(64) | 微信号 |
| `email` | varchar(128) | 邮箱 |
| `companyName` | varchar(128) | 企业/组织名称 |
| `demand` | varchar(255) | 需求描述 |
| `cityId` | int | 城市/区域 |
| `channelId` | int | 渠道ID |
| `sourceId` | int | 来源ID |
| `campaignId` | int | 活动ID |
| `csid` | int | CustomerSource ID, 承接成功后回写 |
| `ccid` | int | CustomerChance ID, 承接成功后回写 |
| `orderId` | varchar(15) | 转单后回写 |
| `status` | tinyint | 承接状态 |
| `errorMsg` | varchar(255) | 承接失败原因 |
| `createTime` | timestamp | 创建时间 |
| `updateTime` | timestamp | 更新时间 |
| `company` | int | 公司 |

#### `market_attribution`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `maid` | int | 归因ID |
| `campaignId` | int | 活动ID |
| `sourceId` | int | 来源ID |
| `miid` | int | 入站ID |
| `csid` | int | CustomerSource ID |
| `ccid` | int | CustomerChance ID |
| `orderId` | varchar | 订单ID |
| `eventType` | tinyint | 转化类型 |
| `status` | tinyint | 状态 |
| `createTime` | timestamp | 创建时间 |

---

## 8. 与现有业务的衔接

### 8.1 与 customer 模块衔接

重新评估后, Customer 更适合定位为生产环境里的客户主链路和营销转化承接层, Market 更适合定位为售前营销和营销运营层。Customer 中已有能力可以被读取和调用, 但不代表营销能力已经完整; 如果 Customer 能力偏装修、偏售后、偏手工流程, Market 可以重新设计营销侧对象, 通过映射、读取、适配来补齐, 尽量不直接修改 Customer 表结构、状态机和核心 Service。

边界原则:

| 原则 | 说明 |
| --- | --- |
| Customer 不轻易改 | Customer 正在生产环境运行, 不建议为 Market 直接改 Customer 表结构、状态机、核心 Service 流程 |
| Market 可重新思考 | Market 可以重新设计营销侧活动、客群、权益、触达、归因, 不必被 Customer 现状完全限制 |
| 主数据归 Customer | 客户、客资、机会、订单、售后单等生产主数据继续归 Customer/Decoration 等现有模块 |
| 运营数据归 Market | 活动、渠道、来源码、入站快照、触达记录、权益策略、归因、营销客群归 Market |
| 写入走适配层 | Market 需要承接转化时, 优先调用 Customer 现有 Service, 不绕开其查重、加密、分配、保护规则 |

| Market 建议职责 | Customer 已有职责 | 处理原则 |
| --- | --- | --- |
| 活动、渠道、二维码、UTM、来源码 | `CustomerSource.source/contact/referOrderId` 记录来源方和对接方 | Market 保存细粒度投放归因, Customer 保存业务可见来源摘要 |
| 落地页表单入站 | `CustomerSource`/`CustomerOrigin` 已有姓名、电话、需求、楼盘、面积、来源 | 不在 Market 重建完整线索池, 表单提交后优先调用 Customer 创建客资/客源 |
| 获客归因事件 | `CustomerSourceRecord`/`CustomerOriginRecord` 已有业务操作记录 | Market 记录曝光/点击/提交等营销事件, Customer 记录业务流转日志 |
| 活动来源转商机 | `CustomerChance` 已有分配、确认、释放、失效、转装修单流程 | Market 不实现分配/跟进状态机, 只把 campaign/source 信息传入 CustomerChance |
| 活动表单扩展字段 | `CustomerProfile` 已有画像模板、画像项、选项 | 表单原始字段留在 MarketInboundItem, 需要形成生产画像时再映射 CustomerProfile |
| 客群标签 | Customer 已有 `customerfunction`、画像、客户规则, 但无完整通用标签体系 | P0 可不做标签; P2 可做营销标签和动态客群, 只保存规则、行为和引用, 不替代 Customer 画像主数据 |
| 权益/积分 | `PointAccount`/`PointRecord`/`Emember` 已有积分和电子会员 | Market 可做活动权益定义、奖励规则和发放编排, 积分账户和会员身份优先复用 Customer |
| 回访/调研/反馈 | `Revisit`/`Survey`/`Feedback`/`Complaint`/`Repair` 已覆盖服务阶段, 但偏订单和售后 | 售后工单不进入 Market; 售前问卷、偏好采集、NPS 分析和营销排除规则可在 Market 旁路建设 |
| 触达通知 | `MessageService`、`Cnotice`、`CustomerNotice`、钉钉消息已有基础能力 | Market 负责营销触达任务、模板、频控、退订和效果追踪, 实际发送优先复用现有消息服务 |

Customer 重点能力完整度复核:

| 能力 | Customer 现状 | 完整度判断 | Market 补位策略 | 是否改 Customer |
| --- | --- | --- | --- | --- |
| 积分账户 | `PointAccount`/`PointRecord` 支持装修积分、销售积分、运营积分的创建、发放、消耗和流水, 但账户强绑定客户/装修单, 更像订单后积分账户 | 生产可用, 但不是完整营销积分体系 | Market 可设计 `MarketBenefit`/`MarketRewardRule`/`MarketRewardGrant`, 管活动规则、任务奖励、邀请奖励、过期策略; 真正入账时通过适配调用 Customer 积分或记录待入账 | 尽量不改, 只读账户和调用发放/消耗能力 |
| 电子会员 | `Emember` 依赖活动票 `Vticket`, 通过 unionId/no 注册, 字段较轻, 更像活动电子会员或票务注册 | 可用但偏单场活动/票务, 不是通用会员中心 | Market 可做营销会员视图、会员等级、权益包、会员生命周期; 与 `Emember` 通过 unionId/phone/no 做映射 | 不改 Emember 主流程 |
| 优惠券/权益 | Store/商城文档已有 Coupon, Customer 有积分/会员, 但缺统一权益编排 | 分散可用, 编排不足 | Market 作为权益编排层, 统一管理券、积分、礼包、邀请码、资料包、试用资格; 使用和核销分别适配 Store/Customer | 不改既有券/积分核心 |
| 售后反馈 | `Feedback` 有接收、处理、完成状态, 可挂图片; `FeedbackComplaint`/`FeedbackGuarantee` 分别处理投诉/维修 | 生产可用, 偏售后工单 | Market 不重做售后工单, 但可读取售后结果作为客户标签、复购排除、NPS/满意度分析 | 不改 |
| 回访 | `Revisit` 按装修单记录满意度和内容, 结构轻 | 可用但偏订单服务回访 | Market 可做售前回访/营销触达任务; 售后回访继续读 `Revisit` | 不改 |
| 调研 | `Survey`/模板/选项支持创建、推送、填写、完成, 和装修单绑定明显 | 可用但偏订单调研 | Market 可做活动问卷/表单和营销偏好采集, 不强依赖订单; 需要沉淀客户画像时再映射 CustomerProfile | 不改 |
| 客户画像 | `CustomerProfile` 复用调研模板, 支持画像项/选项, 可按 csid/cid/orderId 查询 | 生产可用, 但偏模板化静态画像 | Market 可做行为标签、动态客群、营销偏好、渠道偏好; 必要时读取 CustomerProfile 作为客群条件 | 不改 |
| 分配保护 | `CustomerSource`/`CustomerChance` 已有查重、分配、保护、消息等复杂生产规则 | 较完整且高风险 | Market 不重做也不绕开, 入站承接必须走 Customer 适配层 | 不改 |
| 触达通知 | Customer/Information/WeChat/DingTalk 有多种消息能力, 但营销触达模板、频控、退订、效果追踪不完整 | 发送能力可用, 营销运营不足 | Market 设计 `MarketTouch`/`MarketTouchTemplate`/`MarketSubscription`, 实际发送适配现有消息服务 | 不改发送底座 |

因此, “售前营销为 Market, Customer 为接入营销转化”是更稳的整体分工: Market 负责产生、识别、运营和评估需求; Customer 负责把有效需求纳入生产客户链路。积分、售后、画像等 Customer 既有能力不必全盘搬到 Market, 但 Market 可以建立营销视角的旁路模型, 用引用关系连接 Customer 数据。

高风险重叠点:
| 重叠对象 | 现有依据 | 建议 |
| --- | --- | --- |
| `MarketLead` vs `CustomerSource` | `customersource` 已有客户姓名、电话、需求、来源、楼盘、房屋、创建人、公司、状态, `CustomerSourceServiceImpl.addCustomerSource` 已做手机号/楼盘楼号查重和敏感数据加密 | `MarketLead` 不作为长期主数据, 改为 `MarketInbound` 或 `MarketLeadSnapshot`, 创建后落到 CustomerSource |
| `MarketLeadFollow` vs `CustomerSourceRecord` | `customersourcerecord` 已有关联资源、机会、操作人、操作时间、记录内容 | 跟进和分配日志写 CustomerSourceRecord, Market 只保留营销事件 |
| `assignMarketLead` vs `issueCustomerSource/issueCustomerChance` | Customer 已有按部门规则、面积、城区、人员规则自动/手动分配, 并发送消息 | 删除 Market 侧分配接口, 改为 `createCustomerSourceForCampaign` 或调用 Customer 现有接口 |
| `MarketAudience` vs `CustomerProfile` | `customerprofile/customerprofileitem/customerprofileoption` 已支持模板化客户画像, 但动态行为标签不足 | Market 客群可读取 CustomerProfile, 同时维护营销行为标签和成员引用, 不复制客户主档案 |
| `MarketBenefit` vs `PointAccount/Emember/Coupon` | Customer 有积分账户和电子会员, Store/商城文档有 Coupon | 权益定义、任务奖励、裂变规则可留在 Market, 账户余额、积分流水、券核销复用既有模块 |
| `MarketSurvey/MarketPreference` vs `Survey/CustomerProfile` | Customer 调研和画像偏订单/模板, 不一定覆盖售前偏好和活动问卷 | Market 可做活动问卷、营销偏好和 NPS 聚合, 需要进入生产画像时通过适配写入 CustomerProfile |
| `MarketTask/MarketTouch` vs Customer 售后回访 | `revisit/survey/feedback/complaint/repair` 已覆盖服务阶段 | 售后工单和服务回访归 Customer; Market 做售前触达、召回、满意度分群和复购排除规则 |

推荐流程:

```text
活动/名片/内容页留资
    -> Market 校验活动/渠道/来源码, 记录 MarketEvent/MarketInbound
    -> 调用 CustomerSourceService.addCustomerSource 或 CustomerChanceService.addCustomerChance
    -> Customer 执行查重、加密、分配、保护、消息通知
    -> Market 通过 sourceId/campaignId/csid/ccid 建立归因映射
    -> 后续跟进、确认、转单、售后由 Customer 继续承接
```

旁路架构建议:

| 组件 | 职责 | 说明 |
| --- | --- | --- |
| `MarketCustomerBridgeService` | Market 到 Customer 的唯一承接适配层 | 统一封装创建客资、创建机会、写画像、发放积分、查询售后结果等动作, 避免 Market Service 直接散落调用 Customer DAO |
| `market_inbound` | 原始入站和承接状态 | 保存提交快照、幂等键、失败原因、重试次数、承接后的 `csid/ccid/orderId` |
| `market_attribution` | 营销归因映射 | 保存 `campaignId/sourceId/miid` 与 Customer 生产对象的引用, 支撑后续 ROI 和漏斗统计 |
| `market_audience_item` | 客群成员引用 | 只保存 `cid/csid/ccid/orderId/unionId/phoneHash` 等引用或脱敏索引, 不复制客户主档案 |
| `market_reward_grant` | 权益发放过程 | 记录营销规则命中、待发放、已发放、失败重试; 真正账户流水仍走 Customer/Store 适配 |

开发保护线:

1. P0/P1 不为 Market 直接 `ALTER` Customer 生产表。
2. Market 新增数据表只保存营销运营数据、快照、引用、状态和统计。
3. Market 不直接调用 Customer DAO 写生产数据, 写入必须经 `MarketCustomerBridgeService` 再调用 Customer Service。
4. 承接 Customer 时必须保留 MarketInbound 快照、幂等键和重试状态, 防止重复写入和重复分配。
5. 如果 P2 需要把营销画像沉淀为 CustomerProfile, 应先做字段映射和人工/规则审核, 不自动覆盖 Customer 既有画像。

### 8.2 与 store/商城能力衔接

| Market | Store/商城 |
| --- | --- |
| 活动 | 关联商品、套餐、服务 |
| 权益 | 关联 Coupon 或商品优惠 |
| 行为事件 | 记录商品访问、加购、下单 |
| 转化记录 | 关联订单、支付、核销 |

### 8.3 与 information/activity 衔接

项目已有 `information/activity` 和 `activityItem` 相关页面。若其定位是内部活动或装修活动, Market 活动建议定位为“外部营销活动”。短期可并行, 中长期可以抽象公共活动底座。

---

## 9. 安全与合规

| 项 | 要求 |
| --- | --- |
| 手机号 | 使用 `AESHelper.encrypt()` 加密存储, 查询时通过 hash 或加密值匹配 |
| 表单验证码 | 复用现有 `securityCode/verifyCode` 模式, 但修正空值判断逻辑 |
| 权限 | 后台管理接口走登录与权限校验 |
| C端接口 | `addMarketInbound`, `addMarketEvent`, `receiveMarketBenefit` 等可匿名, 但需限流/验证码/防刷 |
| 数据导出 | 导出入站记录和归因结果需要权限控制和操作日志 |
| 黑名单/退订 | 触达前必须过滤 |
| 重复入站 | 避免同一手机号在短时间内重复写入 Customer 并触发频繁分配 |

---

## 10. 错误码建议

当前 `error.md` 中 `340xxx` 标注为 Store/商城, 但历史 market API 已使用 `340xxx`。建议:

| 阶段 | 方案 |
| --- | --- |
| 短期 | 兼容现有 `340xxx`, 新增 market 功能先在文档中登记清楚 |
| 中期 | 在 `error.md` 增加独立 Market 码段, 如 `390xxx` |
| 长期 | Store/商城与 Market/营销错误码分离 |

候选错误码:

| 错误号 | 错误信息 |
| --- | --- |
| `390001` | 活动不存在 |
| `390002` | 活动状态不可操作 |
| `390003` | 渠道不存在 |
| `390004` | 来源不存在 |
| `390005` | 入站记录不存在 |
| `390006` | 入站状态不可操作 |
| `390007` | 入站记录已存在 |
| `390008` | 入站记录无操作权限 |
| `390009` | 内容不存在 |
| `390010` | 权益不存在 |
| `390011` | 权益已领取 |
| `390012` | 权益不可使用 |
| `390013` | 触达模板不存在 |
| `390014` | 客群不存在 |
| `390015` | 标签不存在 |
| `390016` | 来源已存在 |

正式开发前必须先在 `docs/03-API文档/API/error.md` 登记。

---

## 11. 实施前置评审与调整准入方案

### 11.1 Review 结论

本方案可以进入调整, 但不建议按 9 个业务域一次性开发。当前 market 模块仍以 `Ecase/Ecustomer/Eperson/Card` 等展示和报名对象为主, 缺少活动、渠道、来源码、入站状态、承接结果和归因映射; customer 模块已经承载客资、机会、分配、保护、转单、售后、积分、会员等生产逻辑。直接在 Market 重建完整线索池或修改 Customer 主链路, 会产生重复状态机和生产风险。

推荐采用“P0 前置层先行”的方式: 只新增 Market 自身的营销运营数据和承接快照, 通过适配层调用 Customer 现有 Service 完成生产写入, 暂不改 Customer 表结构、状态机和核心流程。

本次调整已按该边界完成 P0 代码落地: 新增 Market 活动、渠道、来源、入站、扩展项和归因模型, 补齐 API 映射、后台轻页面、错误码和数据库脚本; Customer 模块未修改, 承接动作集中在 `MarketCustomerBridgeService`。

### 11.2 当前可操作性判断

| 评审项 | 判断 | 处理建议 |
| --- | --- | --- |
| 现有 Market 结构 | 可扩展 | 继续沿用 action/service/dao/po/vo 分层, 新对象使用 `Market*` 命名, 不替换旧 `E*` 接口 |
| 旧 `Ecustomer` | 只能兼容 | 字段偏装修, 无活动/渠道/来源/承接状态/公司/创建时间, 手机号也不是新规范加密模型; 仅作为历史报名入口保留 |
| Customer 客资/机会 | 已是生产主链路 | Market 不重做分配、保护、跟进、转单状态机, 只保存入站快照和归因引用 |
| 积分/会员/权益 | Customer/Store 有底座但分散 | P0 不做权益; P2 再做 Market 权益编排, 实际账户流水和券核销走 Customer/Store 适配 |
| 售后/回访/调研 | Customer 已覆盖服务阶段 | Market 不做售后工单, 只在 P2/P3 读取售后结果用于复购排除、满意度标签和 NPS 分析 |
| 客群/画像 | Customer 有静态画像, Market 可补行为标签 | P0 暂缓; P2 做营销标签和客群引用, 不复制客户主档案 |
| 报表统计 | 可做基础统计 | P0 只做活动/渠道入站数、承接成功数、失败数; ROI、多触点归因放到 P3 |

### 11.3 P0 准入范围

P0 只允许建设“活动 -> 渠道 -> 来源码 -> 入站快照 -> Customer 承接 -> 归因映射 -> 基础统计”这一条最小闭环。

| 类型 | 允许开发 | 暂不开发 |
| --- | --- | --- |
| 数据对象 | `MarketCampaign`, `MarketChannel`, `MarketSource`, `MarketInbound`, `MarketInboundItem`, `MarketAttribution` | `MarketTag`, `MarketAudience`, `MarketBenefit`, `MarketTouch`, `MarketEvent` 的完整体系 |
| 接口 | 活动/渠道/来源分页与新增更新, 入站提交, 入站重试, 归因查询, 活动/渠道基础统计 | 自动营销、权益领取、积分发放、动态客群、复杂漏斗、ROI 报表 |
| Customer 衔接 | 通过 `MarketCustomerBridgeService` 调用 `CustomerSourceService` 或 `CustomerChanceService` | 直接调用 Customer DAO, 直接改 Customer 表, 复制 Customer 分配逻辑 |
| 前端页面 | 活动管理、渠道来源、入站记录、归因查询的后台轻页面 | 可视化落地页编辑器、营销自动化编排器、复杂数据大屏 |

P0 最小数据闭环建议如下:

```text
MarketCampaign/MarketChannel/MarketSource
    -> addMarketInbound 保存原始表单和幂等键
    -> MarketCustomerBridgeService 调用 CustomerSourceService/CustomerChanceService
    -> 回写 MarketInbound.csid/ccid/orderId/status/errorMsg
    -> 写入 MarketAttribution
    -> countMarketInboundForCampaign/countMarketInboundForChannel 输出基础统计
```

### 11.4 开发前置条件

正式进入代码开发前, 需要先完成以下前置条件:

| 前置项 | 要求 |
| --- | --- |
| 错误码 | 在 `docs/03-API文档/API/error.md` 登记 `390xxx` Market 错误码, 保持同码同文案 |
| 数据库 | 在 `dbs/market.sql` 追加新表, 只新增 `market_` 前缀表, 不修改 Customer 生产表 |
| 敏感数据 | Market 入站手机号使用 `SensitiveDataHelper.encrypt()` 或等价现有敏感数据工具, 页面展示只返回脱敏值 |
| 幂等键 | `market_inbound` 需要保存 `idempotentKey` 或等价字段, 建议由 `company + campaignId + sourceId + phoneHash + 时间窗` 生成 |
| 承接状态 | 至少支持待承接、承接成功、承接失败、重试中、忽略, 失败原因必须回写 |
| Customer 适配 | 新增 `MarketCustomerBridgeService`, 所有写 Customer 的动作集中在此服务, Market 其他 Service 不直接写 Customer |
| 权限边界 | 后台管理接口走登录权限; C 端 `addMarketInbound` 可匿名但必须支持验证码、防刷和频控 |
| 兼容策略 | 旧 `Ecustomer/addEcustomer` 保留, 不直接迁移历史数据; 后续需要时再做只读映射或迁移脚本 |

### 11.5 禁止项与风险控制

| 禁止项 | 原因 |
| --- | --- |
| 新建 `MarketLead` 并长期维护线索主状态 | 会和 `CustomerSource/CustomerChance` 重叠, 形成双线索池 |
| 在 Market 中实现分配、保护、释放、转单状态机 | Customer 已有复杂生产规则和消息通知, 重做风险高 |
| P0 直接改 Customer 表结构或核心 Service | Customer 正在生产环境运行, 需要独立评审和迁移窗口 |
| Market 自动覆盖 CustomerProfile、积分账户、会员状态、售后结论 | 这些是生产数据或服务结论, 只能通过适配和审核写入 |
| 报表实时扫入站/事件大表 | 后续数据量增长会拖慢后台, P1 后应设计日聚合 |

### 11.6 P0 验收标准

| 验收项 | 标准 |
| --- | --- |
| 活动来源 | 能创建活动、渠道和来源码, 来源可关联活动和渠道 |
| 入站提交 | C 端提交后可保存原始快照和扩展字段, 重复提交不会重复写入 Customer |
| Customer 承接 | 承接成功后 `MarketInbound` 回写 `csid/ccid/orderId`, 失败时保留错误信息并可重试 |
| 归因映射 | 可通过 `campaignId/sourceId/miid/csid/ccid/orderId` 查询来源关系 |
| 基础统计 | 可查看活动、渠道维度的入站数、承接成功数、失败数 |
| 生产隔离 | Customer 表结构和既有状态机无改动, 旧 market 页面和接口不受影响 |
| 文档同步 | API 文档、前端 api 映射、错误码、数据库脚本与代码同步提交 |

### 11.7 建议的执行顺序

1. 先登记 `390xxx` 错误码和 P0 API 文档。
2. 新增 `market_campaign/market_channel/market_source/market_inbound/market_inbound_item/market_attribution` 表结构。
3. 按现有 market 分层补齐 PO/VO/DAO/Service/Action。
4. 新增 `MarketCustomerBridgeService`, 只在该服务中调用 Customer 承接接口。
5. 补 `WebContent/js/api/market.js` API 映射和最轻后台页面。
6. 用 `git diff --check`、可用环境下的 `mvn clean compile` 做提交前检查。

---

## 12. 分期实施建议

### P0: 通用获客闭环

目标: 先把“活动 -> 渠道 -> 留资 -> Customer承接 -> 归因统计”跑通。Customer 已有客资、机会、分配、跟进记录和保护规则, P0 不重复实现这些状态机。

| 功能 | 说明 |
| --- | --- |
| `MarketCampaign` | 活动管理 |
| `MarketChannel` | 渠道管理 |
| `MarketSource` | 来源链接/二维码 |
| `MarketInbound` | 表单提交原始快照, 用于防刷、审计和失败重试 |
| `MarketAttribution` | `campaignId/sourceId` 与 `csid/ccid/orderId` 的归因映射 |
| Customer 承接适配 | 调用 `CustomerSourceService`/`CustomerChanceService`, 复用查重、加密、分配、消息通知 |
| 基础报表 | 活动/渠道入站数、Customer承接数 |

### P1: 内容与活动页

目标: 支持内容营销和落地页转化。

| 功能 | 说明 |
| --- | --- |
| `MarketContent` | 图文/案例/评价/视频 |
| `MarketMaterial` | 素材库 |
| `MarketCampaignPage` | 活动页配置 |
| `MarketCampaignForm` | 自定义表单 |
| `MarketEvent` | 浏览/点击/提交事件 |
| 漏斗报表 | PV/UV/点击/留资转化 |

### P2: 客群、权益与自动化

目标: 提升复购、裂变和精细化运营。该阶段允许 Market 建立营销运营旁路模型, 例如营销标签、动态客群、权益编排、触达频控、邀请裂变; Customer 的画像、积分、会员、回访和调研作为生产数据源和承接对象, 不直接改造。

| 功能 | 说明 |
| --- | --- |
| `MarketTag` | 营销标签, 可由浏览、活动、触达、CustomerProfile、成交、回访结果共同派生 |
| `MarketAudience` | 动态/静态营销圈选, 只保存圈选规则和成员引用, 不复制客户主档案 |
| `MarketBenefit` | 权益编排层, 管券、积分、礼包、邀请码、资料包、试用资格的营销规则 |
| `MarketInvite` | 邀请裂变 |
| `MarketTouch` | 售前营销触达记录、模板、频控、退订、效果追踪, 实际发送适配现有消息能力 |
| 自动任务 | 营销唤醒、权益提醒、活动召回、沉睡激活; 售后回访工单继续归 Customer |

### P3: 智能分析与归因

目标: 支撑多渠道投放优化。

| 功能 | 说明 |
| --- | --- |
| 多触点归因 | 首次来源、最近来源、成交来源 |
| 成本 ROI | 渠道成本、活动成本、成交金额 |
| 人员效能 | 名片获客、跟进效率、成交转化 |
| 入站评分 | 根据来源、行为、资料完整度计算营销质量分, 供 Customer 分配参考 |
| 分配效果分析 | 读取 Customer 分配结果, 分析区域、忙闲、转化率、保护规则效果 |

---

## 13. MVP 用户故事

| 角色 | 用户故事 |
| --- | --- |
| 市场运营 | 我可以创建一个活动, 配置渠道二维码, 查看每个渠道带来的入站数和 Customer 承接数 |
| 销售主管 | 我可以查看由活动承接到 Customer 的新客资/机会, 监督 Customer 中的分配和跟进状态 |
| 销售/顾问 | 我可以分享自己的名片或活动链接, 收到来自自己链接的客户提醒 |
| 客服 | 我可以查看客户提交的需求, 添加跟进记录, 标记无效或预约 |
| 管理层 | 我可以看到活动投入、入站数、Customer机会数、转化数和渠道 ROI |
| C端访客 | 我可以通过活动页、名片页、案例页提交咨询或领取权益 |

---

## 14. 推荐的第一版接口清单

P0 最小可交付建议只做以下接口:

| 接口 | 说明 |
| --- | --- |
| `pageMarketCampaign` | 分页活动 |
| `addMarketCampaign` | 新增活动 |
| `updateMarketCampaign` | 更新活动 |
| `publishMarketCampaign` | 发布活动 |
| `pageMarketChannel` | 分页渠道 |
| `addMarketChannel` | 新增渠道 |
| `pageMarketSource` | 分页来源 |
| `addMarketSource` | 生成活动来源链接/二维码 |
| `pageMarketInbound` | 分页查看入站表单快照和承接结果 |
| `addMarketInbound` | C端提交表单, 内部调用 Customer 创建客资/机会 |
| `retryMarketInbound` | 对承接失败的入站记录重试写入 Customer |
| `queryMarketAttributionByCsid` | 按 CustomerSource 查询归因 |
| `countMarketInboundForCampaign` | 活动入站/承接统计 |
| `countMarketInboundForChannel` | 渠道入站/承接统计 |

---

## 15. 开发注意事项

1. 旧功能不要直接删除: `Ecase/Ecustomer/Eperson/Card` 仍保留, 后续通过迁移脚本或适配层逐步归并。
2. 新表统一 `market_` 前缀, 避免与现有短表名混杂。
3. 普通业务 Action 遵守 `throws FLException`, 不在 Action 层本地 `catch (Exception)`。
4. Service 写操作添加 `@Transactional(rollbackFor = Exception.class)`。
5. 手机号、邮箱等敏感字段尽量不在 Market 长期保存; 必须保存入站快照时需加密或脱敏, Customer 主数据复用 `SensitiveDataHelper` 现有逻辑。
6. 表单入站需做幂等和防刷, 防止活动页被恶意提交; 承接失败要保留快照便于重试。
7. 不在 Market 重做 Customer 的生产分配、保护、转单状态机; 但可以建设营销侧旁路状态, 如入站承接状态、触达状态、权益领取状态、客群命中状态。
8. P0/P1 不直接修改 Customer 表结构; 如确需写入 Customer 生产数据, 只能通过适配层调用 Customer Service。
9. Market 营销画像、营销标签、NPS 分析可以旁路建设, 但不得自动覆盖 Customer 既有画像和售后结论。
10. 报表类接口避免实时扫大表, P1 后建议增加日聚合表。
11. `page` 接口必须返回分页结构, `query` 接口不分页。
12. API 文档、错误码、前端 api 映射、数据库脚本要同步提交。

---

## 16. 结论

Market 模块建议从“展示型获客模块”升级为“通用增长营销入口和运营层”, Customer 则作为生产环境中的客户主链路和营销转化承接层。第一阶段重点完成活动、渠道、来源码、表单入站、Customer 承接适配和归因统计; 后续可以在 Market 旁路建设营销标签、动态客群、权益编排、触达频控、裂变邀请和营销自动化。客户资源、机会分配、保护、转单、售后工单等高风险生产状态继续由 Customer 承担, Market 通过引用和适配连接它们。
