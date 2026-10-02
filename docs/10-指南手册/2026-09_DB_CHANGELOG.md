# 2026年9月数据库调整总账 + 生产核验

> 核验日期：2026-10-01（生产只读副本逐项查证）。
> 范围：2026-09-01 ~ 10-01 全部涉及数据库调整的语句（`docs/10-指南手册/`、`sqls/`、`dbs/` 三处落盘脚本 + 2 个未落盘语句）。
> 结论：**9月共 40 项 DB 调整**。第一轮核验（10-01）后用户执行了服务团队两 SQL、serviceTeam 更名、decoration4user 菜单、负库存修数；**第二轮核验（10-01）确认：已执行 27 项、部分执行 6 项、未执行 7 项**。缺口统一收敛到 [2026-09_PROD_PENDING.sql](2026-09_PROD_PENDING.sql)。
> 升级影响评估（2026-10-01 复核）：**未执行项中已无任何缺表/缺列 DDL，发 jar 不会撞 Unknown column / Table doesn't exist**；唯一功能级硬前置是 SSO operation 注册（免登放行依赖），见下表。

---

## 一、总表（按落盘日期）

| 日期 | 脚本 | 内容 | 生产状态 |
|---|---|---|---|
| 09-01 | `sqls/construction/10_construction_camera.sql` | construction.camera/cameramedia/cameraaccess 三表 | ✅ 表已在 |
| 09-02 | `sqls/construction/20_menu_camera.sql` | 摄像头菜单 mid=925 + 授权 | ❌ 未执行（表在菜单缺） |
| 09-02 | `docs/10-指南手册/TASK_PROFILE_EXPORT.sql` | task 注册5行(报价/增减/工程双口径/放线标签) + roletask rid427 | ⚠️ 4/5 行已在(tid275/276/277/278)，缺"工程标签·交接时间"行 |
| 09-04 | `sqls/communion/12_operation_inventory_sync.sql` | A20260904 库存同步 operation 3条 | ✅ oid 1623~1625 |
| 09-06 | `docs/10-指南手册/NORMRICEITEM_QUOTA_TRANNUM_FIX.sql` | normriceitem type=3 trannum 0→1000（62行） | ✅ trannum0 现存 0 行 |
| 09-06 | `docs/10-指南手册/SELECTIONITEM_ACCOUNTSTATUS_REPAIR.sql` | 选材项对账状态修数（89反向孤儿+102重复） | ❌ 未执行（现状 5/89/102，🔴两处拍板点未拍板） |
| 09-06 | `docs/10-指南手册/SYSTEMCONFIG_HEFEI_SYFH_MERCHANT.sql` | 合肥收银台公钥 3 行 | ✅ scid 2617~2619 |
| 09-09 | `docs/10-指南手册/CONTRACT_COMMON_RATIO_CONSTANT.sql` | 合同约定比例 constant | ✅ 11 行 |
| 09-10 | `docs/10-指南手册/CONSTRUCTIONNODE_SKIRTING_INSERT.sql` | 25 公司插"踢脚线安装"节点+七表挪位(16.4万行,单事务) | ✅ 28 家公司均有该节点 |
| 09-10 | `docs/10-指南手册/CONSTRUCTIONNODE_DEMOLITION_INSERT.sql` | 北京三公司插"拆除"节点+七表挪位 | ✅ 91/92/93 均有 |
| 09-10 | `docs/10-指南手册/FUNCTIONAREA_CATEGORY_FORMAT_INIT.sql` | functionareacategory/functionareaformat 两表 + operation 6条 | ⚠️ 两表已在，operation 6条缺 |
| 09-10 | `docs/10-指南手册/FUNCTIONAREATYPE_INIT.sql` | functionareatype 表+13预置+operation 6条+菜单(mid927)+模板回填 | ✅ 全链在 |
| 09-10 | （对话生成，未落盘）salaryLimit 三公司节点+排期压 100000 | c3/c12/c57 两表 | ✅ 已执行（c3 排期 25.7万行@100000，300000 手工值保留=守卫版生效） |
| 09-11 | `sqls/elecsign/12_add_provider_flowid_to_contract_tables.sql` | 四张**合同表**(decorationContract/paymentContract/supplierContract/userContract)加 provider/flowid | ✅ 已执行（2026-10-01 复核四表列均在；脚本 `personel.` 前缀实际落 communion 库） |
| 09-11 | `sqls/elecsign/13_esign_scene_route_config.sql` | systemconfig elecsign.default.provider | ❌ 未执行（非阻塞：路由回退链缺省兜底法大大，行为与改造前等价） |
| 09-14 | `sqls/construction/21_menu_drawline.sql` | 放线记录菜单 mid=928 + 授权复制(5419行) | ✅ 已执行 |
| 09-16 | `sqls/right/10_crosscompanyright.sql` | platform.crosscompanyright 新表 | ✅ 表已在 |
| 09-17 | `sqls/communion/13_categoryformat.sql` | communion.categoryformat 表 + functionareaformat.company→formula | ⚠️ 表+更名已在，operation 4条缺 |
| 09-18 | `sqls/customer/30_menu_customerchance_service.sql` | 客服视图菜单 mid=929 + rid86 动态授权 | ✅ 已执行（授权 100 行） |
| 09-18 | `docs/10-指南手册/DECORATION_RECONTRACTTIME_CONDITION.sql` | 重签时间条件：主表行+绑定复制(全量≈1468行) | ⚠️ 仅 directer 变体 99 行(每公司1行)，其余 18 变体未绑 |
| 09-18 | `docs/10-指南手册/TASK_EXPORT_CONSTRUCTION_DESIGN.sql` | 设计信息导出 task+roletask(rid380/370 石晶) | ✅ tid279 + 授权 2 行 |
| 09-19 | `sqls/construction/22_material_plan.sql` | 主材计划全链：两表 DDL+constant 16行+constructionfunction 种子21行+菜单 mid930+授权1180行 | ✅ 全链在（两表暂 0 行=未使用） |
| 09-19 | `docs/10-指南手册/RUOTATION_UPGRADE.sql` | 退报单：ruotation/ruotationitem 加列+菜单 mid870 修链+constant 4行+页面配置§4 | ⚠️ DDL/菜单/常量/apiPage/condArr 已在；**缺 quotationfunctionright 绑定行 + §4.3~4.5 列/按钮配置组** |
| 09-19 | `docs/10-指南手册/BALANCE_ACCOUNT_CUTPAY_CLOSURE.sql` | balancecutpay money/total→bigint + utype 字典 2 行 | ✅ 已执行 |
| 09-19 | `sqls/decoration/decoration_sign_prepare.sql` | 签约准备 pageBtn 主表 2 行 + 可选授权复制段 | ⚠️ 主表 dfid248/249 已在，**授权段 0 行=按钮对人不可见** |
| 09-20 | `sqls/balance/delete_comcost_menu.sql` | 删 comcost 死菜单 mid=573 + 授权 | ✅ 已删 |
| 09-20 | `sqls/misc/济南三公司数据创建SQL.sql` | 济南三公司(company 97/98/99)+isvconfig 等 | ✅ 已执行 |
| 09-20 | （fc278f943 配套，仅 dev 直改未落盘）条件组件 DB 死引用修正 8 处 | 条件配置 condArr 值改名+删死键 | ❌ 生产仍剩 2 条死键：`construction-projectStatus`、`quotation-extension-decoration-salesman`（schedule-* 三条已是新值） |
| 09-21 | `docs/10-指南手册/DECORATION_USER_ROLE_DICT_INDEX.sql` | contentRole 字典 12 行 + decorationUser.idx_user 索引 | ⚠️ 常量段已执行（12 行在库）；**idx_user 未建**（生产仅 PRIMARY+indexone(orderId)，第三轮核验 10-01）——🔴必须先于 decoration jar：新 pageDecorationForUser 的 exists 子查询 `du.user` 无索引即 37 万行全表扫 |
| 09-21 | `docs/10-指南手册/DECORATION_USER_SERVICE_TEAM.sql` | 服务团队 type 字典 6 行 + decorationUser 盲插去重 DELETE | ✅ 已执行（第二轮核验：type 6 行在库；重复行清零） |
| 09-21 | `sqls/customer/menu_rename_serviceTeam.sql` | mid=328 更名/换 url 为 serviceTeam | ✅ 已执行（第二轮核验：mid=328=服务团队/serviceTeam.html） |
| 09-21 | `sqls/decoration/menu_decoration4user.sql` | 我参与的装修单菜单 mid=931 + 授权 | ✅ 已执行（第二轮核验：mid=931 装修单-我的，授权 9529 行） |
| 09-21 | （用户生产手工）cppoint 删 uniqueone 索引（be4d7f672 按单建户配套） | 索引删除 | ✅ 已确认（现仅 PRIMARY/indexone/indextwo） |
| 09-24 | `docs/10-指南手册/QUOTATIONITEM_IMPORTANT_FLAG.sql` | quotationitem 加 isImportant 列(13.7万行) | ✅ 列已在 |
| 09-27 | `docs/10-指南手册/NOODS_PNID_GROUP_MAPPING_UPDATE.sql` | noods.pnid 集团定材挂接 752 行 | ✅ 已执行（pnid 命中恰 752） |
| 09-29 | `docs/10-指南手册/NOODS_FAMILY_NID_DRIFT_REPAIR.sql` | 定材族漂移修数（公司69改绑47行+自建对3行） | ❌ 未执行（qid=952164 旧 nid 12 组仍在） |
| 09-29 | `dbs/roleoperation_company_alignment.sql` | roleoperation 去重+按公司补全 22.9万行+(rid,oid,company)唯一索引 | ❌ 未执行（现总量 71520、无重复、无唯一索引） |
| 09-29 | `docs/10-指南手册/CONSTRUCTION_NODE_SALARY_FLOOR.sql` | constructionnode 加 salaryFloor 列 | ✅ 列已在 |
| 10-01 | `docs/10-指南手册/INVENTORY_NEGSTOCK_REPAIR.sql` | 库存负库存 114 行归零 | ✅ 已执行（第二轮核验：负库存 0 行） |
| 文档内 | `docs/03-API文档/A20251113Action_SSO_API.md` §3.6 | SSO operation 注册 exchangeAuthCodeForToken | ❌ 未执行 🔴SSO 上线硬前置：该接口无票据调用，免登放行走 `operation.through=1` 分支，operation 行不存在时被当普通需登录接口拦下（不影响 jar 部署稳定性，但 SSO 换票必失败） |

## 二、jar 发版关联（缺口闭合时的顺序约束）

- **电子签批次**：SQL12 已在生产（四张合同表 provider/flowid 已核验，合同 PO 映射有落点，**发版无缺列风险**）；13 为可选路由配置（缺省兜底法大大），建议随 jar 顺带执行。
- **退报单三 jar**：RUOTATION 补段（right 绑定+列配置）与 quotation/decoration/approval 8.3.031.000 同批，SQL 先行。
- **服务团队**：ROLE_DICT、SERVICE_TEAM、menu_rename_serviceTeam、menu_decoration4user 四件已于 10-01 执行并核验（contentRole 12 行 / type 6 行 / decorationUser 去重清零 / mid328 更名 / mid931+授权 9529 行）；**遗留：① DECORATION_USER_ROLE_DICT_INDEX.sql 的 idx_user 索引段未执行（🔴先于 decoration jar）；② B1 批次 8 个前端静态文件须同步生产 WebContent（decoration4user 页面 loadScript fail 200 = js 未到位/内容异常）**。
- **SSO**：operation 注册先于 seiya 8.3.028.024 jar。
- **库存**：INVENTORY_NEGSTOCK_REPAIR 与 common-8.3.029 + inventory-8.3.029 同批事项，发版窗口当日单据走完后执行。
- **主材计划/重要标记/保底额**：22_material_plan、QUOTATIONITEM_IMPORTANT_FLAG、CONSTRUCTION_NODE_SALARY_FLOOR 的 SQL 腿均已执行，剩下的是 jar（data/construction/quotation 8.3.029/031）侧事项，不在本账范围。

## 三、8月尾遗留（本轮顺带抽查）

| 脚本 | 状态 |
|---|---|
| `NOODS_ADD_PNID.sql`(08-28) | ✅ pnid 列已在生产 |
| `INSTORER_PAGE_MENU.sql`(08-28) | 菜单行已在（url 含 instorer 2 行），未深核 |
| `UPGRADE_MAJOR_VERSION_BRIDGE.sql`(08-25) / `VERSION_BACKFILL_8_3_015_TO_028.sql`(08-25) | 未逐项复核 |
| `MESSAGECUEUING_ARGS_QUOTE_FIX.sql`(08-27) 存量30188条 | 未逐项复核 |
| `OALES_PAYMENT_ORDERID_COND_SWAP.sql`(08-29) | 未逐项复核 |
| `USERINFO_EMAIL_UPDATE_DINGTALK.sql`(08-29) 4553条 | 未逐项复核 |
| quotationlimit 补54公司 INSERT(08-31，仅对话输出未落盘) | 未落盘未执行，需先落盘 |

## 四、核验口径备查

各状态的判定 SQL 已固化在核验会话（只读库），要点：DDL 查 `information_schema.columns/tables`；菜单查 `communion.module/rolemodule`；operation 查 `communion.operation`；常量查 `communion.constant`；修数直接复跑各脚本头部的核验 SELECT。重跑幂等脚本（RUOTATION/FUNCTIONAREA/categoryformat/字典/任务注册类均带 NOT EXISTS 守卫）不会产生重复数据；菜单类 mid=925/931 非幂等，执行前必须复核 MAX(mid)。
