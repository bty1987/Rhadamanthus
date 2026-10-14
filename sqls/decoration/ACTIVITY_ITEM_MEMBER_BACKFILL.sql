-- decorationactivityitem 会员/线上物品(atttype=1)老数据字段维护（待生产）
-- 背景：makeMemberOrder(批量)/makeMemberOrderItem(单件)历史版本均未写 type/stateType，
--       type 落表默认 0。2026-10-05 曾误判券为错值、计划全量改物品(1)，2026-10-14 拍板撤回：
--       积分商城兑换在装修单即券口径，type=0 正确，存量 type 无需修。
-- 存量核验(2026-10-05 生产)：atttype=1 共 1204 行, 唯一来源=积分商城同步(MemberServiceImpl, 全库无第二写入口)：
--   type=0券(正确口径) 1204 / stateType=0到店(空默认) 1204 / state: 4配送1135 + 1失效61 + 10核销7 + 0初始1
-- 口径：
--   A. 仅修 stateType(到店0→积分商城15)，type 不动(0券即正确口径)；
--   B. state 仅修仍为初始的行(已流转的 4/1/10 是真实业务状态, 不动)；
--      存量 1135 行 state=4配送(老批量写死产物, 现核销闸只认0/2不可核销)拍板暂不处理(2026-10-14)；
--   C. receiveTime 必做段仅补 B 段行；可选段全量用 createTime 近似回填(老数据无真实领取时间,
--      同步时间≈领取时间, 供页面"首次操作时间"列显示——拍板后启用)。
-- 安全性：全部限定 atttype=1(线上/会员), atttype=0 装修活动物品(~50万行, 字段语义不同)零接触;
--         UPDATE 天然幂等, 可重复执行。先于/后于 jar 均可(新老代码对已修数据幂等兼容)。

-- A. 办理类型: 到店(0,空默认) → 积分商城(15)
UPDATE decoration.decorationactivityitem
SET stateType = 15
WHERE atttype = 1 AND stateType = 0;

-- B. 办理状态: 初始(0) → 已领(2), 仅 1 行
UPDATE decoration.decorationactivityitem
SET state = 2, receiveTime = createTime
WHERE atttype = 1 AND state = 0;

-- C.(可选, 拍板后启用) 首次操作时间近似回填: 老数据流转行 receiveTime 全空, 用 createTime 补显示
-- UPDATE decoration.decorationactivityitem
-- SET receiveTime = createTime
-- WHERE atttype = 1 AND receiveTime IS NULL;

-- 核验语句(执行后人工核对)：
-- SELECT type, stateType, state, COUNT(*) FROM decoration.decorationactivityitem WHERE atttype = 1 GROUP BY type, stateType, state;
