-- =============================================================================
-- communion.version 补数脚本 : v8.3.015 ~ v8.3.028 (14 个大版本)
-- =============================================================================
-- 背景:
--   communion.version 表(系统版本发布历史)最后一行为 v8.3.014 (2025-05-02),
--   其后 15 个月发版未登记。本脚本按三段式大版本(x.xxx.xxx)粒度补齐
--   v8.3.015 ~ v8.3.028 共 14 行。
--
-- 数据口径(与 git 仓库 Rhadamanthus master 对齐):
--   no         = v{大版本} G{该版本收官打点提交短hash}
--   createTime = 该版本收官打点提交日期(git log 实际日期)
--   comment    = 该版本周期内功能提交归纳(8.3.015~8.3.020 为 squash 打点提交,
--                按其文件变更/新增类归纳; 8.3.021 起按周期内提交信息归纳)
--   status     = 0 (启用, STATUS_ENABLED_INT)
--
-- 幂等性: 每条 INSERT 带 NOT EXISTS 防重, 可重复执行。
--
-- 执行后验证: 见文件尾部 SELECT。
-- =============================================================================

-- v8.3.015 | 收官提交 e5d7dc5cf (2025-06-12) | squash 399 文件
INSERT INTO communion.version (no, createTime, comment, status)
SELECT 'v8.3.015 Ge5d7dc5', '2025-06-12 00:00:00',
'<div>本次版本系统调整如下:</div><div>1.新增售后反馈体系:回访/投诉/保修反馈独立管理.</div><div>2.报价模块新增退款管理功能.</div><div>3.新增部门/人员合伙人机制.</div><div>4.新增施工节点管理,装修/销售活动记录.</div><div>5.客户/数据/报价/装修等模块优化调整.</div>', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.version WHERE no = 'v8.3.015 Ge5d7dc5');

-- v8.3.016 | 收官提交 011407c51 (2025-07-29) | squash 52 文件
INSERT INTO communion.version (no, createTime, comment, status)
SELECT 'v8.3.016 G011407c', '2025-07-29 00:00:00',
'<div>本次版本系统调整如下:</div><div>1.新增客户通知功能.</div><div>2.客户/工程/报价模块功能优化与问题修复.</div>', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.version WHERE no = 'v8.3.016 G011407c');

-- v8.3.017 | 收官提交 9bf819956 (2025-08-28) | squash 305 文件
INSERT INTO communion.version (no, createTime, comment, status)
SELECT 'v8.3.017 G9bf8199', '2025-08-28 00:00:00',
'<div>本次版本系统调整如下:</div><div>1.新增外购款项管理(外购收款/退款单).</div><div>2.新增供应商品牌商品/合同服务管理.</div><div>3.新增外部用户通知/意见反馈渠道.</div><div>4.客户/营销/装修/款项等模块优化调整.</div>', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.version WHERE no = 'v8.3.017 G9bf8199');

-- v8.3.018 | 收官提交 7a7d38ed9 (2025-09-28) | squash 317 文件
INSERT INTO communion.version (no, createTime, comment, status)
SELECT 'v8.3.018 G7a7d38e', '2025-09-28 00:00:00',
'<div>本次版本系统调整如下:</div><div>1.结算模块新增图片管理功能.</div><div>2.新增片区合伙人机制.</div><div>3.供应商合同品类/商品管理完善.</div><div>4.数据/人事/结算/客户等模块优化调整.</div>', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.version WHERE no = 'v8.3.018 G7a7d38e');

-- v8.3.019 | 收官提交 3e3e4f80c (2025-10-11) | squash 208 文件
INSERT INTO communion.version (no, createTime, comment, status)
SELECT 'v8.3.019 G3e3e4f8', '2025-10-11 00:00:00',
'<div>本次版本系统调整如下:</div><div>1.结算模块新增分摊管理功能.</div><div>2.新增量房及功能项管理.</div><div>3.结算/报价模块功能优化与问题修复.</div>', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.version WHERE no = 'v8.3.019 G3e3e4f8');

-- v8.3.020 | 收官提交 1bebae6b5 (2025-12-01) | squash 351 文件
INSERT INTO communion.version (no, createTime, comment, status)
SELECT 'v8.3.020 G1bebae6', '2025-12-01 00:00:00',
'<div>本次版本系统调整如下:</div><div>1.商品模块新增套餐管理功能.</div><div>2.新增假期管理/阿里云OSS配置管理.</div><div>3.量房功能区功能完善.</div><div>4.支付通道对接调整.</div><div>5.数据/报价/结算等模块优化调整.</div>', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.version WHERE no = 'v8.3.020 G1bebae6');

-- v8.3.021 | 收官提交 2329d6b7e (2026-01-02)
INSERT INTO communion.version (no, createTime, comment, status)
SELECT 'v8.3.021 G2329d6b', '2026-01-02 00:00:00',
'<div>本次版本系统调整如下:</div><div>1.销售:商品套餐逻辑上线(创建/补单/配送/结算),预结算品牌拆分.</div><div>2.系统:拆分阿里云模块,登录调整为挑战请求验证,新增企业微信登录页.</div><div>3.装修:净业绩计算增加活动类型与积分逻辑,新增决算计算器,合同增加客户须知确认.</div><div>4.客户:人员规则禁用/范围控制,机会验证逻辑调整.</div><div>5.权限:角色模块配置级联与多公司同步复制.</div><div>6.报价:选材单对账状态与结算选材查询.</div>', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.version WHERE no = 'v8.3.021 G2329d6b');

-- v8.3.022 | 收官提交 ce2225d97 (2026-03-05)
INSERT INTO communion.version (no, createTime, comment, status)
SELECT 'v8.3.022 Gce2225d', '2026-03-05 00:00:00',
'<div>本次版本系统调整如下:</div><div>1.新增消息队列功能,支持业务事件异步处理.</div><div>2.新增消息到期/消息提示模块,覆盖订单状态变更/归属转移/收款等场景.</div><div>3.报价:功能区复制,打印调整,审核错误点记录与钉钉推送,功能区参数与工程量自动计算.</div><div>4.新增合同记录模块,装修合同图片(设计/图纸/合同方案)批量操作.</div><div>5.客户机会直接转装修单,辅材批量导入.</div><div>6.新增楼盘数据同步接口.</div>', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.version WHERE no = 'v8.3.022 Gce2225d');

-- v8.3.023 | 收官提交 fa27e7d35 (2026-04-02)
INSERT INTO communion.version (no, createTime, comment, status)
SELECT 'v8.3.023 Gfa27e7d', '2026-04-02 00:00:00',
'<div>本次版本系统调整如下:</div><div>1.新增定额工期管理模块,报价/施工联动工时明细.</div><div>2.新增报价预算员自动分配体系(规则/配置/请求/记录).</div><div>3.报价项支持公式表达式自动计算工程量.</div><div>4.客户模块新增客源/机会直接审批与直接初审功能.</div><div>5.新增外辅费用管理功能.</div><div>6.同步接口扩展(职位/部门/用户/楼盘).</div>', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.version WHERE no = 'v8.3.023 Gfa27e7d');

-- v8.3.024 | 收官提交 70bb5faa7 (2026-04-30)
INSERT INTO communion.version (no, createTime, comment, status)
SELECT 'v8.3.024 G70bb5fa', '2026-04-30 00:00:00',
'<div>本次版本系统调整如下:</div><div>1.敏感数据加密体系上线:用户手机号/身份证/房屋号加密存储及存量迁移.</div><div>2.客户银行账户独立成表并全链路适配.</div><div>3.新增报价配置模块及交接单功能.</div><div>4.预算分配二期:分配队列/转交/全集团汇总.</div><div>5.新增预付款审批提款功能.</div><div>6.外辅单结算两步操作与驳回功能.</div>', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.version WHERE no = 'v8.3.024 G70bb5fa');

-- v8.3.025 | 收官提交 8d3ccca6b (2026-05-29)
INSERT INTO communion.version (no, createTime, comment, status)
SELECT 'v8.3.025 G8d3ccca', '2026-05-29 00:00:00',
'<div>本次版本系统调整如下:</div><div>1.附加项功能体系上线:确认流程/新增/查询页面.</div><div>2.新增报价命名规则管理功能.</div><div>3.装修款/销售款新增落款/撤款快捷操作.</div><div>4.施工进度增加预估工费管理.</div><div>5.客户手机号统一脱敏处理,经纪人报备保护定时检查.</div><div>6.预算员替换/跨公司查询支持.</div>', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.version WHERE no = 'v8.3.025 G8d3ccca');

-- v8.3.026 | 收官提交 2e7dc9b85 (2026-06-28)
INSERT INTO communion.version (no, createTime, comment, status)
SELECT 'v8.3.026 G2e7dc9b', '2026-06-28 00:00:00',
'<div>本次版本系统调整如下:</div><div>1.前端视图体系上线:视图切换/用户偏好缓存,销售/装修/款项等模块展示配置迁移.</div><div>2.前端框架增强:模板样式切换/暗色主题/水印/页面标签右键菜单.</div><div>3.新增用户多部门关系维护功能.</div><div>4.客户账户管理规范并内嵌装修详情页.</div><div>5.上传改造为阿里云STS临时凭证方式.</div><div>6.外销单创建支持按品牌选择厂商.</div>', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.version WHERE no = 'v8.3.026 G2e7dc9b');

-- v8.3.027 | 收官提交 086ecb8ac (2026-07-31)
INSERT INTO communion.version (no, createTime, comment, status)
SELECT 'v8.3.027 G086ecb8', '2026-07-31 00:00:00',
'<div>本次版本系统调整如下:</div><div>1.新增配置化审批流程引擎:支持或签/并签/会签,表单设计器与通用审批.</div><div>2.前端国际化体系上线:18业务模块及菜单翻译.</div><div>3.新增业务操作日志体系:按月归档/接口级开关.</div><div>4.新增企业微信自建应用消息推送模块.</div><div>5.新增客户售后管理与获客工作流.</div><div>6.权限关闸影子收集,错误码前端映射激活.</div>', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.version WHERE no = 'v8.3.027 G086ecb8');

-- v8.3.028 | 收官提交 517f1c9c8 (2026-08-25, 版本进行中, 以当前 HEAD 收尾)
INSERT INTO communion.version (no, createTime, comment, status)
SELECT 'v8.3.028 G517f1c9', '2026-08-25 00:00:00',
'<div>本次版本系统调整如下:</div><div>1.经营分析报表体系上线:九大主题域(客源/装修履约/主材/仓储/财务/人力/审批/转化/资金闭环)及一户全景穿透,支持导出.</div><div>2.线上活动物品签约自动核销与数量管控.</div><div>3.附加项页面增加图片画廊功能.</div><div>4.装修单详情主材节点增强:优惠券/国补利润/外销退货冲减.</div><div>5.款项模块:预付款/销售款收款即确认,三页面新增类型/状态查询条件.</div><div>6.同步接口扩展:驻店人员/客户机会更新.</div>', 0
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.version WHERE no = 'v8.3.028 G517f1c9');

-- =============================================================================
-- 执行后验证: 应返回 14 行, 时间递增
-- =============================================================================
-- SELECT vid, no, createTime, status FROM communion.version WHERE no LIKE 'v8.3.0%' ORDER BY vid;
--
-- 预期: v8.3.014 (已有, vid=141) 之后新增 14 行 v8.3.015 ~ v8.3.028, status 全 0
