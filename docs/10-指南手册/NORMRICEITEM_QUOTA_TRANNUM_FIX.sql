-- =============================================================================
-- 附加项定额 trannum 修数 —— 修复 280014 附加项定额少算(num被忽略)
-- 日期: 2026-09-06
--
-- 背景:
--   addNormriceItem normadd 分支创建附加项定额行(type=3)时写死 trannum=0,
--   而 amountNormriceItemForSalary 的数量折算系数 if(trannum=0,1,num/1000*trannum/1000)
--   把 trannum=0 解释为"salary即全额"——附加项行 salary=单价(normaddPO.getPrice()),
--   导致只计单价、数量被吞(如: 16元×20个 只计16元, 应计320元)。
--
--   代码已同步修复(NormriceItemServiceImpl setTrannum(0)→1000, jar quotation-8.3.029)。
--   本脚本修正存量行: 附加项定额 trannum 全部置 1000(=1), 即 单价×数量 计入定额池。
--
-- 生产核查(2026-09-06 只读库):
--   type=3 AND trannum=0 共 62 行(status=0:2 / 2:54 / 3:6), 全部 num>0, 无 num=0 特例。
--   典型案例: 订单 2607070089 瓦工节点 npiid=32888192, 16元×20个, 修复后 320元 工费可过。
--
-- 执行顺序: 先发 jar, 再执行本脚本(幂等)。
-- =============================================================================

UPDATE `quotation`.`normriceitem`
   SET `trannum` = 1000
 WHERE `type` = 3
   AND `trannum` = 0;

-- 核验: 应返回 0 行
SELECT npiid, qid, cnid, status, salary, num, trannum
  FROM `quotation`.`normriceitem`
 WHERE `type` = 3 AND `trannum` = 0;
