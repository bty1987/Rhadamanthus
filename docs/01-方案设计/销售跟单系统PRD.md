# 销售跟单系统 PRD

| 项目 | 内容 |
|---|---|
| 版本 | v1.3（已落码,与实现同步) |
| 日期 | 2026-11-15 |
| 状态 | 已落码待部署 |
| 涉及模块 | sales（主）、decoration（入口）、communion（operation） |
| 目标 | 丰富跟单过程数据——签约后的品类/品牌意向收集（售前）、开单后的配送/服务过程记录（售后） |

> **v1.0 → v1.1**：单表拆双表（角度/字段不同）。
> **v1.1 → v1.2（拍板落定）**：①售前不限装修单状态（有装修单就行）；②售后不限销售单状态（有销售单就行）；③逻辑删除（isDelete+deleteTime）；④工作台维持二期。
> **v1.2 → v1.3（落码定稿）**：实体族按命名规范带 Sales 前缀——`SalesPreFollowup*`（售前）/`SalesPostFollowup*`（售后）；表名 `sales.salesprefollowup`/`sales.salespostfollowup`（PK=sfid）；枚举字典改前端 JS 映射（免 constant 表依赖,照 sales4operate.js 先例）；售前/售后共用一个双模式弹层页 `salesFollowup.html`；错误码收敛为 370037/370038/370039。

---

## 一、背景与目标

当前系统对"单据的过程"记录是断裂的：

1. **售前断裂**：装修单签约后，设计师对客户"要买哪些品类、看了哪些品牌、比较到什么程度"没有任何沉淀。装修单详情页"主材信息"步骤里的"已购品类/未购品类/品牌汇总"全部由**销售单反推**（`decorationUtils.js`）——第一笔销售单开出之前永远是空的。
2. **售后断裂**：销售单开单后，配送链路（salesdelivery 四步）只记录"节点是否到达"，不记录"过程发生了什么"——约不上安装、送错楼层、安装发现问题、售后回访反馈等无录入口。满意度档案是结果评分,不是过程记录。

**目标**：两张跟单流水表、两个录入入口，不引入状态机/审批/消息推送，先让跟单行为"有地方记、有地方看"。

---

## 二、现状事实（设计依据）

| # | 事实 | 出处 |
|---|---|---|
| 1 | sales.orderId 关联装修单,1:N | `SalesPO.java` L261 |
| 2 | sales.category=品类快照文本,brand=bid关联 | `SalesServiceImpl.addSales` L367 |
| 3 | 销售单状态机=status×depositpayStatus×fullpayStatus×balanceStatus | `SalesPO.java` L30-78 |
| 4 | 配送链路 salesdeliveryitem 四步,不记过程 | `SalesDeliveryItemPO.java` L64-96 |
| 5 | 装修单签约 signDecorationContract→status=3 | `DecorationContractServiceImpl.java` L688-866 |
| 6 | 装修单主材信息步骤内页签为代码定义(drawMaterial) | `decorationPageUtils.js` L449-484 |
| 7 | 品类=communion.category(queryCategory,type≠0为主材品类),品牌=communion.brand(queryBrandByCid 参数 brand.cid) | `BrandServiceImpl.java` L164-166 |
| 8 | sales 列表行按钮由 salesfunction(pageBtn键)驱动 | `salesPageUtils.js` L46-58 |
| 9 | 逻辑删先例 isDelete(0有效/1已删)+deleteTime | `CustomerUserRuleItemPO.java` L54-56 |
| 10 | 时间戳提交格式="yyyy-MM-dd HH:mm:ss"串(前端拼 " 00:00:00") | `sales.js` pelivery L1796 |
| 11 | 列表查询 operation through=1,写操作不登记收集期放行 | 既有 module SQL 惯例 |
| 12 | 弹层页模式:page-content div+$.loadScript,popup4page 打开 | `sales4operate.html/js` |

---

## 三、设计原则

1. **两张表、纯流水、无状态机**。记录=一次跟进事件快照;"该品类是否已成交"由销售单说话。
2. **不设状态闸**（拍板）。装修单/销售单存在即可记录。
3. **不改主链路**。不加 SalesPO/DecorationPO 字段,不动收款/配送/结算;售后跟单不替代 salesdelivery。
4. **两个入口**。装修单详情页签 + 销售单列表行按钮;工作台二期。
5. **记录不可改,逻辑删**。仅记录人本人可删(isDelete=1+deleteTime,服务端硬闸)。
6. **字典前端映射**。枚举与 PO 常量一一对应,JS 字典单源(salesFollowupUtils.js),两入口共用。

---

## 四、场景与角色总览

| 场景 | 表 | 主角色 | 次角色 | 入口 |
|---|---|---|---|---|
| 售前跟单 | `sales.salesprefollowup`（挂 orderId） | 设计师 | 跟单员/业务员/部门主管 | 装修单详情 → 主材信息步骤 → "售前跟单"页签(第5个左页签) |
| 售后跟单 | `sales.salespostfollowup`（挂 sid,冗余 orderId） | 主材管家(materialer) | 业务员/驻店员/导购 | 销售单列表 → 行按钮"跟单" → 双模式弹层 |

---

## 五、功能需求（已实现）

### 5.1 售前跟单（`sales.salesprefollowup`）

- 页签内容：统计条（总数/最近跟进>7天标橙/超期计划标红）+ 时间轴列表（时间倒序,品类/品牌/事项/方式/内容/计划,超期计划整条标红边）+ **[新增跟单]**（打开双模式弹层 pre 模式,弹层内含完整列表+表单,关闭回刷页签）+ 行内删除（仅本人可见）。
- 新增字段：事项(意向沟通/品牌到店/方案比价/其他)、方式(电话/微信/到店接待/上门/其他)、品类(可空)、品牌(按品类联动,可空)、跟进内容(必填≤512)、下一步计划(≤256)、计划跟进时间(可空,允许过去时间)。
- 规则：装修单存在即可记(不限状态);bid>0 时 category 由服务端取 `brand.category.name` 快照(照 sales 口径);品牌品类组合可重复。

### 5.2 售后跟单（`sales.salespostfollowup`）

- 弹层内容：头部信息条（销售单号/装修单号/品类/品牌/收款状态/配送进度——品类品牌取销售单自身,配送进度=querySalesDeliveryItem 最大状态文案）+ 统计条 + 事项筛选 + 时间轴列表（含处理结果列）+ 新增表单 + 删除。
- 新增字段：事项(配送协调/安装服务/客户回访/投诉处理/其他,默认客户回访)、方式(电话/微信/上门/其他,默认电话)、跟进内容(必填)、处理结果(选填≤256,售后特有闭环字段)、下一步计划、计划跟进时间。
- 规则：销售单存在即可记(不限状态);orderId/company 由 Service 从销售单冗余带入,前端不传;记录人不限角色;只读展示不回写销售单。

### 5.3 通用规则

新增=Action 传 VO→Service 校验→落库(creater=登录人);编辑不提供;删除=逻辑删(isDelete 置1+deleteTime),仅记录人本人(370038 硬闸),重复删已删记录返回 370037;列表/统计只算有效记录;无金额字段不涉及 tranargs。

---

## 六、数据模型

### 6.0 两表对照（拆表依据）

| 维度 | salesprefollowup 售前 | salespostfollowup 售后 | 理由 |
|---|---|---|---|
| 锚 | orderId（必填） | sid（必填）+ orderId 冗余 | 记录主体不同 |
| 品类/品牌 | category+bid（业务主字段） | **无** | 销售单自带,不重复收集 |
| 处理结果 result | **无** | 有(选填) | 售后关心服务闭环 |
| 方式枚举 | 电话/微信/**到店接待**/上门 | 电话/微信/上门 | 带客到店是售前动作 |
| PK | sfid | sfid | 两表独立自增 |
| 共性 | company/item/way/content/plan/planTime/isDelete/deleteTime/cuid/createTime | 同 | 两场景共性 |

### 6.1 `sales.salesprefollowup`

sfid(PK AI)、company、orderId varchar(15)、category varchar(32)、bid bigint(0=未指定)、item tinyint(0意向沟通/1品牌到店/2方案比价/9其他)、way tinyint(0电话/1微信/2到店接待/3上门/9其他)、content varchar(512)、plan varchar(256)、planTime datetime、isDelete tinyint(0/1)、deleteTime datetime、cuid bigint、createTime datetime；KEY idx_order(orderId)。COMMENT='售前跟单记录(设计师品类品牌意向)'。

### 6.2 `sales.salespostfollowup`

sfid(PK AI)、company、sid bigint、orderId varchar(15,服务端冗余)、item tinyint(0配送协调/1安装服务/2客户回访/3投诉处理/9其他)、way tinyint(0电话/1微信/2上门/9其他)、content varchar(512)、result varchar(256)、plan varchar(256)、planTime datetime、isDelete/deleteTime/cuid/createTime 同上；KEY idx_sid(sid)、idx_order(orderId)。COMMENT='售后跟单记录(销售单配送服务过程)'。

### 6.3 枚举字典（前端 JS 映射,免 constant 表依赖）

`WebContent/js/utils/salesFollowupUtils.js` 内 `salesFollowupDict = {pre:{items,ways}, post:{items,ways}}`,与 PO 常量一一对应;照 `sales4operate.js` 字典先例。售前表单只出 pre 组,售后表单只出 post 组。

---

## 七、接口设计（已实现,三层同名）

### 7.1 接口清单（SalesFollowupAction,8 个）

| 接口 | 类型 | 参数 | 返回 |
|---|---|---|---|
| `querySalesPreFollowupByOrderId` | 查询 | salesPreFollowup.orderId | salesPreFollowups 全量(createTime倒序,仅有效) |
| `countSalesPreFollowup` | 计数 | salesPreFollowup.orderId | salesPreFollowup.{total,lastTime,overdueCount} |
| `addSalesPreFollowup` | 写 | salesPreFollowup.{orderId,item,way,category,bid,content,plan,planTime} | — |
| `deleteSalesPreFollowup` | 写 | salesPreFollowup.sfid | — |
| `querySalesPostFollowupBySid` | 查询 | salesPostFollowup.sid | salesPostFollowups 全量 |
| `countSalesPostFollowup` | 计数 | salesPostFollowup.sid | salesPostFollowup.{total,lastTime,overdueCount} |
| `addSalesPostFollowup` | 写 | salesPostFollowup.{sid,item,way,content,result,plan,planTime} | — |
| `deleteSalesPostFollowup` | 写 | salesPostFollowup.sfid | — |

count 单条原生 SQL 返回 `Object[]{count(*),max(createTime),sum(planTime<curdate())}`,null 归零(照 PlanDaoImpl.countPlan 惯例)。

### 7.2 VO

- `SalesPreFollowupVO`：sfid/orderId/category/bid/brandName/item/way/content/plan/planTime/creater(UserBaseVO)/createTime/total/lastTime/overdueCount。
- `SalesPostFollowupVO`：sfid/sid/orderId/item/way/content/result/plan/planTime/creater/createTime/total/lastTime/overdueCount。

brandName 由 PO @ManyToOne BrandPO 带出(ptv 内 set);creater 由 UserPO.setBaseInfo 填充;isDelete/deleteTime 不进 VO。

### 7.3 Service 校验（前置校验,无 try-catch）

| 校验 | 码 |
|---|---|
| 装修单存在(售前) | 140013(复用) |
| 销售单存在(售后) | 370001(复用) |
| content 空白 | 370039 跟单内容不能为空 |
| 删除:有效记录存在 | 370037 跟单记录不存在 |
| 删除:记录人=登录人(uid 比对) | 370038 仅记录人可删除 |
| 品牌存在(bid>0 时) | 130077(复用) |

无状态闸(拍板);售后 orderId/company 服务端冗余;删除流程=查有效记录→370037→uid 比对→370038→isDelete=1+deleteTime。

### 7.4 DAO

`SalesPreFollowupDao/SalesPostFollowupDao`（@Repository("salesPreFollowupDao"/"salesPostFollowupDao")）：query 条件 criteria(orderId/sid eq + isDelete=0 + Order.desc(createTime));count 原生 SQL(不 join)。

---

## 八、前端页面（已实现,7 文件）

| 文件 | 改动 |
|---|---|
| `WebContent/views/sales/salesFollowup.html` | **新增**,双模式弹层页(信息条/统计条/筛选/列表/新增表单弹窗) |
| `WebContent/js/sales/salesFollowup.js` | **新增**,弹层逻辑(pre/post 按 params.sales.followupMode 分流) |
| `WebContent/js/utils/salesFollowupUtils.js` | **新增**,共享字典(salesFollowupDict)+统计条/时间轴/列表渲染函数 |
| `WebContent/js/api/sales.js` | +8 端点映射 |
| `WebContent/js/sales/sales.js` | buttonMap 加"跟单"按钮 + followupSales(post 模式 popup) |
| `WebContent/js/utils/decorationPageUtils.js` | drawMaterial 左列加"售前跟单"页签(salesPreFollowupList{conf}) |
| `WebContent/js/utils/decorationUtils.js` | initMaterial 内 loadPreFollowup(统计+列表+新增按钮开 pre 模式弹层+行内删除) |
| `WebContent/views/decoration/decoration4detail.html` | loadScript 追加 salesFollowupUtils.js |

要点：品牌下拉联动=queryCategory(主材品类 type≠0)→queryBrandByCid(参数 brand.cid);计划时间=com.datetime("date")+" 00:00:00"拼串(照 pelivery 先例);删除按钮仅记录人可见(前端 queryUserForSelfByUserId 比对+服务端硬闸双保险);post 信息条配送进度=querySalesDeliveryItem(salesDeliveryItem.sales.sid)取最大状态文案。

---

## 九、权限与部署

### 9.1 operation（sqls/sales/02号）

| 操作 | through |
|---|---|
| querySalesPreFollowupByOrderId / countSalesPreFollowup / querySalesPostFollowupBySid / countSalesPostFollowup | 1(免检,4行) |
| addSalesPreFollowup / addSalesPostFollowup / deleteSalesPreFollowup / deleteSalesPostFollowup | 不登记(收集期放行,照 addInstorer;删除"仅本人"是服务端硬闸) |

### 9.2 页面配置

salesfunction 插入"跟单"行按钮(key='pageBtn',value='followup',group=1 销售单,sort=21)+salesfunctionright 铺开现存全部(变体,公司)组合(照 03 号"记录"按钮先例);不配数据按钮不渲染。装修单详情页签为代码定义,不涉及 decorationFunction 配置。

### 9.3 SQL（`sqls/sales/02_salesfollowup.sql`,单文件幂等）

两表 CREATE TABLE IF NOT EXISTS + salesfunction 按钮与铺开 + operation 4 行;error.md 已登记 370037/370038/370039。

### 9.4 部署物

- 后端：`fanglin-sales-8.3.031.jar`（259773B,旧 241581B 作废,13 个新类已验证在包内）
- 前端：8 处（3 新增+5 修改）
- SQL：sqls/sales/02号（DDL 先于 jar）

---

## 十、非目标与二期

v1 不做：状态机/审批/字段回写、消息推送/定时任务、图片附件、全局工作台（拍板暂不考虑）、转化率报表。

二期候选：①我的跟单工作台（planTime 已预留）；②装修单全过程聚合视图（售后表冗余 orderId+idx_order 已支持）；③品类转化统计；④配送单号引用+图片。

---

## 十一、验收清单

售前：

- [ ] 装修单详情主材信息步骤出现"售前跟单"页签,空态正常;
- [ ] 新增(品类联动品牌/计划时间)落库 salesprefollowup,列表倒序;
- [ ] 预签/废单/终止单均可记录(无状态闸);
- [ ] content 空被拒 370039;非记录人删除被拒 370038;
- [ ] 记录人删除后列表/统计即刻屏蔽,库内 isDelete=1+deleteTime 有值;
- [ ] 统计条三指标正确(只计有效),>7天标橙/超期标红。

售后：

- [ ] 销售单列表"跟单"按钮(salesfunction 配置后)打开弹层,信息条带出销售单信息+配送进度;
- [ ] 初始/完结/全退/折单/废单均可记录,落库 salespostfollowup;
- [ ] orderId 服务端冗余写入(前端不传也正确);
- [ ] 处理结果可补记;删除仅本人(两表同验),重复删返回 370037。

通用：

- [ ] 4 个查询接口免检可访问;370037-39 与 error.md 一致;
- [ ] 售前表单不出售后事项,售后表单不出售前事项。

---

## 附：拍板记录（2026-11-15 已定）

| # | 问题 | 拍板结果 |
|---|---|---|
| 1 | 售前跟单是否限制装修单状态？ | **不限制,有装修单就行** |
| 2 | 售后记录是否限制销售单状态？ | **不限制,有销售单就行** |
| 3 | 删除是物理删还是逻辑删？ | **逻辑删**(isDelete 0/1+deleteTime,照 CustomerUserRuleItemPO 先例) |
| 4 | "我的跟单"工作台是否进 v1？ | **暂不考虑**(二期第一候选,planTime 预留) |
| 5 | 售后"处理结果"是否必填？ | 选填 |
| 6 | 实体命名 | **SalesPreFollowup*/SalesPostFollowup***(sales 前缀族,表 salesprefollowup/salespostfollowup) |
