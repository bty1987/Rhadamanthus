-- payment.paymentfunction 数据整理(保持既有行 pfid 不变)
-- 体检结论: 181 行, 引用完整性正常(right 表无重复绑定/无悬空引用), 60 行无 right 引用, 分三类:
--   1. 环节字典行(key=value=common/collect/pos/history/confirm/check/create): 与 right.name 环节集合一一对应, 管理界面依赖, 保留
--   2. 完全重复行: pfid=142(生成服务费, group=4) 与 pfid=144(group=16, 被 create|16 引用) 同 key/value/name, 142 无任何引用, 属主材款历史残留, 删除
--   3. 未挂载配置(保留, 是否挂载/清理由业务决定):
--      - 活动款全套(group=32): pfid 41/50/51/52/53/85/89/122, right.type=32 仅剩一条收款按钮绑定, 页面配置已脱钩
--      - 待启用功能: pfid 177/178(合同额/主材额提现审批按钮, 前端 payment.js 有 contains 判断), 146(同步金蝶按钮), 158/159(客户确认列)
--      - 其他: 108(已停用 status=1), 145(实收额列), 138/157(代收款列)

-- 删除确认冗余的重复行(142 无引用, 生效行为 144, 主键不变)
DELETE FROM payment.paymentfunction WHERE pfid = 142;

-- sort 修正: 31组同(页面type,环节,key)下sort重复导致页面列/按钮顺序不稳定, 分配不冲突取值(pfid不变)
-- 楼盘(147)=2 楼号(148)=3 地址(55)=4; 收款码(128)=20 支付宝收款码(176)=21
UPDATE payment.paymentfunction SET sort = 3 WHERE pfid = 148;
UPDATE payment.paymentfunction SET sort = 4 WHERE pfid = 55;
UPDATE payment.paymentfunction SET sort = 21 WHERE pfid = 176;

-- (可选, 默认不执行) 如需启用预付款提现审批按钮/金蝶同步按钮, 补 right 绑定:
-- INSERT INTO platform.paymentfunctionright (name, pfid, type, company)
-- SELECT 'collect', 177, 1, company FROM platform.paymentfunctionright WHERE name='collect' AND type=1 LIMIT 1;
-- INSERT INTO platform.paymentfunctionright (name, pfid, type, company)
-- SELECT 'collect', 178, 1, company FROM platform.paymentfunctionright WHERE name='collect' AND type=1 LIMIT 1;
-- INSERT INTO platform.paymentfunctionright (name, pfid, type, company)
-- SELECT 'collect', 146, 1, company FROM platform.paymentfunctionright WHERE name='collect' AND type=1 LIMIT 1;
