-- =====================================================================
-- 文件: 22_signet_orgid_pull_backfill.sql
-- 用途: 正式环境已实名企业 orgId 批量回填签章(esign_signet_orgid_pull.py 生成)
--       该主体已在正式应用完成实名(identity-info realnameStatus=1), 直接取 orgId
--       等价完成机构认证, 跳过人工点链接; 未实名章走认证链接(bat脚本另出)
-- 前置条件: 21号配置切换已执行(正式凭证); 回填前核对下方清单企业主体
-- 回滚方式: UPDATE data.signet SET signno = NULL, status = 1 WHERE sid IN (<下列sid>) AND provider = 2;
-- 验证语句: SELECT sid, company, name, status, LEFT(signno,16) FROM data.signet WHERE provider = 2 AND status = 3;
-- 幂等性: 幂等(同值重复UPDATE无变化)
-- =====================================================================

UPDATE data.signet SET signno = '1a85fed720e54397bcbbf872cf223a20', status = 3 WHERE sid = 307 AND provider = 2 AND (signno IS NULL OR signno = '');
UPDATE data.signet SET signno = 'ddad148ec6d04450b4d980f410e5b619', status = 3 WHERE sid = 210 AND provider = 2 AND (signno IS NULL OR signno = '');
UPDATE data.signet SET signno = 'ddad148ec6d04450b4d980f410e5b619', status = 3 WHERE sid = 342 AND provider = 2 AND (signno IS NULL OR signno = '');

-- 共 3 条(每条仅当该章尚无orgId时生效, 防覆盖)
