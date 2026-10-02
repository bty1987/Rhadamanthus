-- ============================================================================
-- 2026-09 生产待执行 SQL 清单（v2，核验 2026-10-01 第二轮）
-- v1 落地后用户已执行并经只读库复核确认的项（本轮移出清单）：
--   * 服务团队 contentRole 字典 12 行（DECORATION_USER_ROLE_DICT_INDEX.sql）
--   * 服务团队 type 字典 6 行 + decorationUser 盲插去重（DECORATION_USER_SERVICE_TEAM.sql，重复行已清零）
--   * 菜单 mid=328 更名服务团队（menu_rename_serviceTeam.sql）
--   * 菜单 mid=931 装修单-我的 + 授权 9529 行（menu_decoration4user.sql）
--   * 库存负库存 114 行归零（INVENTORY_NEGSTOCK_REPAIR.sql，现负库存 0 行）
-- 总账见同目录 2026-09_DB_CHANGELOG.md；本文件按执行顺序编排。
-- 纪律：
--   * 段1 菜单类脚本【非幂等】，执行前必须跑安检语句核对 MAX(mid)；
--   * 段2 幂等脚本可整体重跑（NOT EXISTS 守卫），已执行部分自动跳过；
--   * 段3 为独立小语句，逐条带守卫；
--   * 段4 修数类有前置条件/拍板点，见各文件头，勿盲跑。
-- ============================================================================

-- ============================================================================
-- 段1 菜单类（馃敶非幂等，安检后执行）——仅剩 1 项
-- ============================================================================

-- 1.1 摄像头菜单（表已建，菜单缺；mid=925 非幂等）
-- 安检: SELECT MAX(mid) FROM communion.module;                    -- 当前 MAX=931，执行本脚本需人工指定未占用 mid 或先调序
--       SELECT mid FROM communion.module WHERE mid=925 OR url LIKE '%camera%';  -- 应 0 行
-- 执行: sqls/construction/20_menu_camera.sql（若 925 已被占用，改用新 mid 并同步脚本）

-- ============================================================================
-- 段2 幂等配置补齐（直接整体重跑原文件）
-- ============================================================================

-- 2.1 退报单补段（缺 quotationfunctionright 绑定行 + §4.3~4.5 列/按钮配置组；
--     现状仅 apiPage/condArr 2 行。整体重跑本文件即可，已执行段自动跳过）
-- 执行: docs/10-指南手册/RUOTATION_UPGRADE.sql
-- 核验: SELECT COUNT(*) FROM platform.quotationfunctionright WHERE name='ruotation';  -- 应>0（现 0）
--       SELECT COUNT(*) FROM quotation.quotationfunction WHERE name='退报单';          -- 应=apiPage/列/按钮全组（现 1）

-- 2.2 功能区品类/规格 operation 6 条（表已建，operation 缺）
-- 执行: docs/10-指南手册/FUNCTIONAREA_CATEGORY_FORMAT_INIT.sql（幂等，重跑只补 operation 段）
-- 核验: SELECT operation FROM communion.operation WHERE operation LIKE '%FunctionAreaCategory%' OR operation LIKE '%FunctionAreaFormat%';  -- 应 6 行（现 0）

-- 2.3 品类规格 operation 4 条（communion.categoryformat 表已建，operation 缺）
-- 执行: sqls/communion/13_categoryformat.sql（幂等，重跑只补 operation 段）
-- 核验: SELECT operation FROM communion.operation WHERE operation LIKE '%CategoryFormat%';  -- 应 4 行（现 0）

-- 2.4 签约准备按钮授权段（主表 dfid248/249 已在，right 绑定 0 行=按钮不可见）
-- 执行: sqls/decoration/decoration_sign_prepare.sql 的授权复制段（§2，可选按公司裁剪）
-- 核验: SELECT f.value,COUNT(*) FROM platform.decorationfunctionright r
--         JOIN decoration.decorationfunction f ON f.dfid=r.dfid
--        WHERE f.value IN ('signprepare','presignprepare') GROUP BY f.value;  -- 两行均应>0（现 0）

-- 2.5 服务团队 idx_user 索引（DECORATION_USER_ROLE_DICT_INDEX.sql 的②段漏执行；
--     常量段12行已执行但索引未建: 生产 decorationUser 仅 PRIMARY+indexone(orderId)）
--     馃敶必须先于 decoration-8.3.029 jar: 新 pageDecorationForUser 的 exists 子查询 du.user
--     无索引即 37 万行全表扫, 挂装修单列表高频路径。本段幂等, 可直接执行:
SELECT COUNT(*) INTO @idx_flag FROM information_schema.STATISTICS
 WHERE TABLE_SCHEMA='decoration' AND TABLE_NAME='decorationUser' AND INDEX_NAME='idx_user';
SET @ddl = IF(@idx_flag=0,
  'ALTER TABLE decoration.decorationUser ADD INDEX idx_user (user)',
  'SELECT ''idx_user 已存在, 跳过'' AS msg');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;
-- 核验: SHOW INDEX FROM decoration.decorationUser;  -- 应含 idx_user(user)

-- 2.6 电子签路由配置（可选，非发版阻塞：SQL12 的四张合同表 provider/flowid 已核验在生产，
--     合同 PO 映射有落点；本条缺省时路由回退链兜底法大大，行为与改造前等价）
-- 执行: sqls/elecsign/13_esign_scene_route_config.sql                 -- elecsign.default.provider=fadada
-- 核验: SELECT `key`,value FROM communion.systemconfig WHERE `key`='elecsign.default.provider';  -- 现 0 行

-- ============================================================================
-- 段3 独立小语句（逐条带守卫）
-- ============================================================================

-- 3.1 SSO 令牌换票接口 operation 注册（馃敶SSO 上线硬前置：无票据接口的免登放行依赖本行，
--     未注册时被当普通需登录接口拦下；不阻塞 jar 部署。原文=A20251113Action_SSO_API.md §3.6）
INSERT INTO communion.operation (moduleId, name, operation, through, type, status, system, logFlag)
SELECT 1, '令牌授权码', 'exchangeAuthCodeForToken', 1, 1, 0, 1, 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.operation WHERE operation = 'exchangeAuthCodeForToken');
-- 核验: SELECT oid,through FROM communion.operation WHERE operation='exchangeAuthCodeForToken';  -- 现 0 行

-- 3.2 工程标签·交接时间口径任务行（TASK_PROFILE_EXPORT 第5行漏执行；tid277=创建时间口径已在）
--     执行前核对 tid=277 filepath 是否带尾参 ' 0'（SELECT filepath FROM communion.task WHERE tid=277;）
INSERT INTO communion.task (name, filepath, plugins, level, type, handle, server, status, isShow, keyword)
SELECT '导出工程标签(交接时间)', '/home/fanglin/cronbin/py3/plan_export_construction_construction_profile.py 1', 'A', 0, 2, 0, 0, 0, 0, 'export_construction_construction_profile_handoverTime' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.task WHERE keyword = 'export_construction_construction_profile_handoverTime');

-- 授权随既有工程标签任务（tid=277,rid=427,company 1/97/98/99）同步复制
INSERT INTO communion.roletask (rid, tid, cuid, createTime, company)
SELECT rt.rid, t.tid, 34, NOW(), rt.company
FROM communion.roletask rt
JOIN communion.task s ON s.keyword = 'export_construction_construction_profile'
JOIN communion.task t ON t.keyword = 'export_construction_construction_profile_handoverTime'
WHERE rt.tid = s.tid
  AND NOT EXISTS (SELECT 1 FROM communion.roletask x WHERE x.tid = t.tid AND x.rid = rt.rid AND x.company = rt.company);
-- 核验: SELECT tid,name FROM communion.task WHERE keyword LIKE '%handoverTime%';  -- 现 0 行

-- 3.3 条件组件死引用修正（fc278f943 当轮仅 dev 直改；schedule-* 三条生产已是新值，剩 2 条）
--     前提: 前端条件组件已含新键（2026-09-20 已推送，静态文件部署即有）
UPDATE construction.constructionfunction
   SET value = 'construction-projectStatusFlag'
 WHERE `key` = 'condArr' AND value = 'construction-projectStatus';

UPDATE quotation.quotationfunction
   SET value = 'quotation-extension-salesman'
 WHERE `key` = 'condArr' AND value = 'quotation-extension-decoration-salesman';

-- 核验: 两条旧值应 0 行（现各 1 行）
-- SELECT value FROM construction.constructionfunction WHERE `key`='condArr' AND value IN ('construction-projectStatus','quotation-extension-decoration-salesman');

-- ============================================================================
-- 段4 修数类（有前置/拍板，逐个看文件头再跑）
-- ============================================================================

-- 4.1 定材族漂移修数（独立，SQL 先行不依赖 jar；幂等）
-- 执行: docs/10-指南手册/NOODS_FAMILY_NID_DRIFT_REPAIR.sql
-- 前置核验: SELECT nid,COUNT(*) FROM quotation.normooditem WHERE qid=952164 GROUP BY nid;
--           现仍见旧 nid 12 组: 706/707/708/709/715/716/1203/1204/1206/1207/1208/1210

-- 4.2 选材项对账状态修数（馃敶文件头两处业务拍板点未拍板：89 条反向孤儿认账 vs 反结算、
--     跨结算单 10 对人工判定；拍板前勿跑）
-- 执行: docs/10-指南手册/SELECTIONITEM_ACCOUNTSTATUS_REPAIR.sql
-- 现状: 正向孤儿 5 / 反向孤儿 89 / 重复对 102

-- 4.3 roleoperation 公司维度对齐补全（馃敶低峰执行；严格 步骤1→2A→2B→3→4 单线程；
--     预期补全约 22.9 万行、总量约 30 万）
-- 执行: dbs/roleoperation_company_alignment.sql
-- 现状: 总量 71520、无重复、无 (rid,oid,company) 唯一索引

-- ============================================================================
-- 段5 待拍板/待确认（不自动执行）
-- ============================================================================

-- 5.1 重签时间查询条件绑定扩展：现仅 directer 变体每公司 1 行(99 行)；
--     若需 19 个页面变体全量启用，按 docs/10-指南手册/DECORATION_RECONTRACTTIME_CONDITION.sql §2
--     去掉 name/company 收窄后重跑（幂等，绑定按 name+company+dfid 防重）。

-- 5.2 8月尾遗留未复核项（UPGRADE 桥接/VERSION 补数/MESSAGECUEUING 存量/OALES 条件换绑/
--     USERINFO 邮箱回填/quotationlimit 54 公司——最后者仍只在对话输出，未落盘），另开批次核对。
