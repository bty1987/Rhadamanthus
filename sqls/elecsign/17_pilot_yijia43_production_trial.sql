-- =============================================================================
-- e签宝试点：盘锦宜家（cid=43）生产试签——数据层操作包
-- =============================================================================
-- 背景：生产 jar 升级到最新 8.3.030（含多层路由/autoFinish/确认认证修复）后，
--       在盘锦宜家用现成测试单走通"生成→企业静默签→客户H5签→归档"全流程。
--       路由链=公司级配置(company=43 elecsign.provider.decoration=esign，已就位)
--              + 模板行标记(cid=11923 path=esign://docTemplate，已就位)。
--       e签宝侧为沙箱网关(smlopenapi)——试签合同非法律效力文件，仅验证生产管道。
--
-- 执行顺序：①(步骤1) 先于一切生成动作  ②(步骤2) 先于印章认证 API 调用
--           ③(步骤3) 先于客户签署链接获取
-- 执行人：有生产库写权限的运维（本文件由 ZCode 准备，逐段执行）
--
-- 回滚方式：
--   步骤2：DELETE FROM data.signet WHERE no='PJYJ_TEST_00002' AND company=43;
--   步骤3：UPDATE communion.customer SET signno=NULL, status=0 WHERE cid=82828495;（见行内实际cid）
--   步骤1：不建议回滚（列宽只增不减）
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 步骤1（必须最先执行）：合同表 URL 列加长 256→2048
-- 原因：e签宝返回的 OSS 临时地址 500~900 字符，塞 varchar(256) 必触发
--       Data too long → 生成事务回滚（dev 当日实测）。
-- 验证：SELECT COLUMN_TYPE FROM information_schema.COLUMNS
--       WHERE TABLE_SCHEMA='decoration' AND TABLE_NAME='decorationcontract'
--         AND COLUMN_NAME='download';  → 应为 varchar(2048)
-- -----------------------------------------------------------------------------
ALTER TABLE decoration.decorationcontract
	MODIFY download varchar(2048),
	MODIFY viewpdf varchar(2048),
	MODIFY path varchar(2048);

-- -----------------------------------------------------------------------------
-- 步骤2：试签用印章（应用主体企业=方林家居装饰有限公司）
-- 原因：e签宝 autoSign 仅应用主体企业自身免印章授权；沙箱主体企业已预实名
--       （orgId=eb576a21a94c48ccafaa1aaa9c17a3eb），authSignet→confirmSignet
--       纯 API 即可拿 orgId，无需人工授权环节。
--       印章 203（盘锦宜家装饰）保留不动，待正式应用+企业实名授权后启用。
-- 验证：SELECT sid,name,status FROM data.signet WHERE no='PJYJ_TEST_00002';
-- -----------------------------------------------------------------------------
INSERT INTO data.signet (no, name, keyword, path, status, company, provider)
SELECT 'PJYJ_TEST_00002', '方林家居装饰有限公司', '乙方（盖章）', '', 0, 43, 2
FROM DUAL WHERE NOT EXISTS (
	SELECT 1 FROM data.signet WHERE no='PJYJ_TEST_00002' AND company=43);

-- -----------------------------------------------------------------------------
-- 步骤3：试签客户绑沙箱已实名测试个人账号
-- 原因：客户签署链接按 customer.signno(psnId) 出；e1e16bbf=沙箱已实名账号
--       （绑定手机 13840085846=白添宇，收码即签，与 dev 演练同款）。
--       仅动测试客户（测楼盘 cid=828495），带姓名+状态双守卫防误伤。
-- 回滚：UPDATE communion.customer SET signno=NULL, status=0 WHERE cid=828495;
-- 验证：SELECT cid,name,signno,status FROM communion.customer WHERE cid=828495;
-- -----------------------------------------------------------------------------
UPDATE communion.customer
SET signno='e1e16bbf3bbb4832b9a3ca1c66c70ec3', status=1
WHERE cid=828495 AND status=0;

-- =============================================================================
-- 执行后交回 ZCode 只读核验（列宽/印章行/客户行），随后走试签流程：
--   authSignet/confirmSignet(新印章) → addDecorationContract(2610070205+11923)
--   → signDecorationContractForCompany → signDecorationContractForCustomer
--   → 白添宇手机 H5 签署 → affix/filing → 终态核验
-- =============================================================================
