-- =============================================================================
-- 四模块功能字典维护页 —— 菜单注册 + 角色授权
-- 日期: 2026-10-09
--
-- 用途: 客户/款项/报价/工程 四张功能字典表的页面化管理(与 decoration 933 功能维护同款),
--       各挂本模块「功能配置」菜单之后:
--         934 客户功能维护    挂 客户(240)  order=10  (571 功能配置 order=9 之后)
--         935 款项功能维护    挂 款项(10)   order=14  (556 功能配置 order=12 之后, 其下 max=13)
--         936 报价功能维护    挂 报价(316)  order=12  (752 功能配置 order=11 之后)
--         937 工程功能维护    挂 工程(237)  order=8   (923 功能配置 order=7 之后)
--
-- 生产核查(2026-10-09 只读库):
--   communion.module MAX(mid) = 933, 本脚本取 934-937(执行前请复核未被占用)
--   数据分布: customer 55行(type0-4) / payment 181行(type0-7) / quotation 292行(type0-4) / construction 416行(type0-4)
--
-- 注意:
--   1. 非幂等, 重复执行前先跑核验查询确认未插入过。
--   2. cuid 必须为真实存在的 user.uid(统一 34=白添宇 FL-00479): RoleModulePO.creater 系
--      EAGER ManyToOne 关联 user.uid, cuid 无对应用户时 queryModuleForLogin 取菜单抛
--      ObjectNotFoundException, 整个菜单接口报错。
--   3. 新端点 page/add/update/delete<X>Function.do 走 operation 自动补全(through=1), 无需登记。
--   4. 部署序: 四 jar(customer/quotation/construction/payment-8.3.030) 同批先上, 再执行本 SQL 开菜单。
-- =============================================================================

-- 1. module: 菜单 × 4
INSERT INTO `communion`.`module`
  (`mid`, `fatherModuleId`, `name`, `alias`, `module`, `icon`, `url`, `level`, `system`, `order`, `helpKey`)
VALUES
  (934, 240, '功能维护', '功能维护', '', 'icon-list-alt', '/views/customer/customerFunctionManage.html', 2, 1, 10, ''),
  (935, 10,  '功能维护', '功能维护', '', 'icon-list-alt', '/views/payment/paymentFunctionManage.html', 2, 1, 14, ''),
  (936, 316, '功能维护', '功能维护', '', 'icon-list-alt', '/views/quotation/quotationFunctionManage.html', 2, 1, 12, ''),
  (937, 237, '功能维护', '功能维护', '', 'icon-list-alt', '/views/construction/constructionFunctionManage.html', 2, 1, 8, '');

-- 2. rolemodule: 各复制本模块「功能配置」的全部角色授权(DISTINCT 去重历史重复行), cuid=34
INSERT INTO `communion`.`rolemodule`
  (`rid`, `mid`, `link`, `access`, `cuid`, `createTime`, `company`)
SELECT DISTINCT rm.rid, 934, rm.link, rm.access, 34, NOW(), rm.company
FROM `communion`.`rolemodule` rm WHERE rm.mid = 571;

INSERT INTO `communion`.`rolemodule`
  (`rid`, `mid`, `link`, `access`, `cuid`, `createTime`, `company`)
SELECT DISTINCT rm.rid, 935, rm.link, rm.access, 34, NOW(), rm.company
FROM `communion`.`rolemodule` rm WHERE rm.mid = 556;

INSERT INTO `communion`.`rolemodule`
  (`rid`, `mid`, `link`, `access`, `cuid`, `createTime`, `company`)
SELECT DISTINCT rm.rid, 936, rm.link, rm.access, 34, NOW(), rm.company
FROM `communion`.`rolemodule` rm WHERE rm.mid = 752;

INSERT INTO `communion`.`rolemodule`
  (`rid`, `mid`, `link`, `access`, `cuid`, `createTime`, `company`)
SELECT DISTINCT rm.rid, 937, rm.link, rm.access, 34, NOW(), rm.company
FROM `communion`.`rolemodule` rm WHERE rm.mid = 923;

-- =============================================================================
-- 执行前核验(mid 未被占用, 应返回 0 行)
-- =============================================================================
-- SELECT mid FROM communion.module WHERE mid IN (934, 935, 936, 937)
--    OR url IN ('/views/customer/customerFunctionManage.html', '/views/payment/paymentFunctionManage.html',
--               '/views/quotation/quotationFunctionManage.html', '/views/construction/constructionFunctionManage.html');

-- 执行后核验(应返回 4 行菜单 + 各授权行数)
-- SELECT mid, fatherModuleId, name, url, `order` FROM communion.module WHERE mid IN (934, 935, 936, 937);
-- SELECT mid, COUNT(*) FROM communion.rolemodule WHERE mid IN (934, 935, 936, 937) GROUP BY mid;
