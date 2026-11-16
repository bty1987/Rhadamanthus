-- ============================================================================
-- 文件: 44_system_version_info_insert_831.sql
-- 库表: communion.version(系统版本公告, 版本更新说明展示)
-- 用途: 新增 v8.3.031 版本公告行(8.3.031 发版批: 工人维护/回聘同步/落款权限/
--       报价上限/印章等级/离职移交重构/变更记录/登录页优化/权限加载修复)。
-- 字段口径(沿用 16_system_version_info_insert.sql / v8.3.030 行惯例):
--   no         'v8.3.031 G3bbef9d'(G+本次生产部署基线 commit 短哈希);
--   createTime 发布日期(◆ 按实际部署日调整, 惯例为零点);
--   comment    HTML 片段, 用户视角变更条目;
--   status     🔴 必须显式 0(0=启用展示, 列默认 1=禁用, queryVersion 只出 0);
--   vid        自增不写(当前最大 156, 本行落 157)。
-- 执行前核对:
--   ① SELECT vid, no FROM communion.version ORDER BY vid DESC LIMIT 3;
--      ——最新行应为 v8.3.030 Ge6636e1(vid=156), 确认无 v8.3.031 重复行
--        (no 无唯一约束, 重复插入不报错但页面出双条);
--   ② G 哈希与发布日期按实际部署基线核对调整。
-- 回滚方式: DELETE FROM communion.version WHERE no = 'v8.3.031 G3bbef9d';
-- 幂等性: NOT EXISTS 守卫(MySQL 5.6 需 FROM DUAL), 重复执行跳过。
-- ============================================================================

INSERT INTO communion.version (no, createTime, comment, status)
SELECT 'v8.3.031 G3bbef9d',
       '2026-11-16',                                                          -- ◆ 发布日期, 按实际部署日调整
       '<div>本次版本系统调整如下:</div><div>1.人员:新增工人数据维护, 支持工人档案新建/编辑/查看与密码管理;</div><div>2.人员:员工资料同步支持回聘人员更新, 修复回聘员工资料更新失败问题;</div><div>3.装修:款项落款操作支持按公司与角色配置权限管控;</div><div>4.报价:各公司报价单数量上限统一调整为每装修单8个;</div><div>5.印章:印章支持设置适用装修单等级, 合同公司签章按装修单等级严控选章;</div><div>6.装修:员工离职移交调整为按装修单维度配置, 支持勾选批量移交与按移交人合并审批;</div><div>7.报价:新增工费材料验证变更记录, 验证相关调整全程留痕可追查;</div><div>8.系统:登录页界面优化, 修复权限菜单加载异常问题。</div>',
       0
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.version WHERE no = 'v8.3.031 G3bbef9d');
