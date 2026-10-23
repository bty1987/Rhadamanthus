-- ============================================================================
-- 文件: 16_system_version_info_insert.sql
-- 库表: communion.version(系统版本公告, 版本更新说明展示)
-- 用途: 新增系统版本公告行(如 v8.3.030)。历史行 status 全部为 0(启用)。
-- 字段口径:
--   no         版本串, 现网格式 `v{版本} G{githash短}`(如 v8.3.028 G517f1c9);
--              githash 填本次生产部署对应 commit 的短 hash(◇ 占位, 按实际部署填写);
--   createTime 发布日期(显式给, 不依赖列默认);
--   comment    更新说明, HTML 片段(text 列), 惯例格式:
--              <div>本次版本系统调整如下:</div><div>1.xxx</div><div>2.xxx</div>…;
--   status     🔴 0=启用(展示), 1=禁用——列默认值是 1, INSERT 必须显式给 0,
--              否则插入即"禁用", queryVersion 只出 status=0 的行;
--   vid        自增, 不写。
-- 执行前核对:
--   ① SELECT vid, no FROM communion.version ORDER BY vid DESC LIMIT 3;
--      ——确认最新行与拟插版本号不重复(no 无唯一约束, 重复插入不报错但页面出双条)
-- 回滚方式: DELETE FROM communion.version WHERE no = 'v8.3.030 G◇';
-- 幂等性: NOT EXISTS 守卫(MySQL 5.6 需 FROM DUAL), 重复执行跳过。
-- ============================================================================

-- ① 新版本公告行(即插即启用; ◇ 占位符按实际填写)
INSERT INTO communion.version (no, createTime, comment, status)
SELECT 'v8.3.030 G◇',
       '2026-10-23',                                                          -- ◆ 发布日期
       '<div>本次版本系统调整如下:</div>'
       '<div>1.销售:增减单新增工费打印, 已开工费的单据可按施工节点出定额工费单;</div>'
       '<div>2.报价:预报单拷贝报价增加归属约束, 仅设计师/业务员本人的装修单可拷贝;</div>'
       '<div>3.报价:修复公式计算回归, 工程量修改保存异常与公式NaN防护调整;</div>'
       '<div>4.装修:款项信息中违约金类型款项支持发起退款;</div>'
       '<div>5.人事:部门同步接口上级部门兼容性调整。</div>'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM communion.version WHERE no = 'v8.3.030 G◇');

-- ② (备选)先插禁用草稿、核对说明后再启用——与程序新增默认行为一致:
-- INSERT INTO communion.version (no, createTime, comment, status)
-- SELECT 'v8.3.030 G◇', '2026-10-23', '<div>本次版本系统调整如下:</div>', 1
-- FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM communion.version WHERE no = 'v8.3.030 G◇');
-- UPDATE communion.version SET status = 0 WHERE no = 'v8.3.030 G◇';

-- ============================================================================
-- 验证语句(执行后核对):
--   SELECT vid, no, createTime, status FROM communion.version ORDER BY vid DESC LIMIT 3;
--   ——新行 status 应为 0(启用); 页面/接口 queryVersion 即时可见, 免发版免重启
-- ============================================================================
