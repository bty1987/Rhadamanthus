-- 插入装饰订单相关消息队列数据
-- 功能：为装饰订单各业务接口生成消息队列数据
-- 创建时间：2025-01-17
-- 作者：AI Assistant
--
-- 操作类型说明：
-- 1. approveForDecorationBelong - 审批装饰订单归属
-- 2. signDecorationContract - 签订装修合同
-- 3. changeDecorationForAdvance - 装修订单预付款变更
-- 4. pretreatDrawLine - 预处理放线
-- 5. successDrawLine - 放线完成
-- 6. resignDecorationContract - 重签装修合同
-- 7. beginConstructionSchedule - 开始施工计划
-- 8. finishConstructionSchedule - 完成施工计划
-- 9. changeDecorationForStatus - 装修订单状态变更
-- 10. terminalDecoration - 装修订单终止
-- 11. makeDecorationAccount - 装修订单结算
-- 12. addConstructer - 添加施工人员
-- 13. deleteConstructer - 删除施工人员
-- 14. submitApprovalForDecorationTerminal - 提交装修订单终止审批
-- 15. presignDecorationContract - 预签装修合同
-- 16. obsoleteDecoration - 装修订单废单
-- 17. collectDecorationPayment - 收取装修款
-- 18. collectPayment - 收款
-- 19. addConstructionNode - 添加施工节点
-- 20. updateConstructionNode - 更新施工节点
-- 21. updateConstructionNodeForStatus - 更新施工节点状态

-- ============================================
-- 示例数据插入（请根据实际情况修改 orderId）
-- ============================================

-- 1. 审批装饰订单归属
INSERT INTO information.messagequeuing (operation, orderId, args, createtime, status)
VALUES ('approveForDecorationBelong', 'D202501170001',
        '{"orderId":"D202501170001","cnid":1001,"userId":10001}',
        NOW(), 0);

-- 2. 签订装修合同
INSERT INTO information.messagequeuing (operation, orderId, args, createtime, status)
VALUES ('signDecorationContract', 'D202501170001',
        '{"orderId":"D202501170001","cnid":1002,"userId":10001}',
        NOW(), 0);

-- 3. 装修订单预付款变更
INSERT INTO information.messagequeuing (operation, orderId, args, createtime, status)
VALUES ('changeDecorationForAdvance', 'D202501170001',
        '{"orderId":"D202501170001","cnid":1003,"userId":10001}',
        NOW(), 0);

-- 4. 预处理放线
INSERT INTO information.messagequeuing (operation, orderId, args, createtime, status)
VALUES ('pretreatDrawLine', 'D202501170001',
        '{"orderId":"D202501170001","cnid":1004,"userId":10001}',
        NOW(), 0);

-- 5. 放线完成
INSERT INTO information.messagequeuing (operation, orderId, args, createtime, status)
VALUES ('successDrawLine', 'D202501170001',
        '{"orderId":"D202501170001","cnid":1005,"userId":10001}',
        NOW(), 0);

-- 6. 重签装修合同
INSERT INTO information.messagequeuing (operation, orderId, args, createtime, status)
VALUES ('resignDecorationContract', 'D202501170001',
        '{"orderId":"D202501170001","cnid":1006,"userId":10001}',
        NOW(), 0);

-- 7. 开始施工计划
INSERT INTO information.messagequeuing (operation, orderId, args, createtime, status)
VALUES ('beginConstructionSchedule', 'D202501170001',
        '{"orderId":"D202501170001","cnid":1007,"userId":10001}',
        NOW(), 0);

-- 8. 完成施工计划
INSERT INTO information.messagequeuing (operation, orderId, args, createtime, status)
VALUES ('finishConstructionSchedule', 'D202501170001',
        '{"orderId":"D202501170001","cnid":1008,"userId":10001}',
        NOW(), 0);

-- 9. 装修订单状态变更
INSERT INTO information.messagequeuing (operation, orderId, args, createtime, status)
VALUES ('changeDecorationForStatus', 'D202501170001',
        '{"orderId":"D202501170001","cnid":1009,"userId":10001}',
        NOW(), 0);

-- 10. 装修订单终止
INSERT INTO information.messagequeuing (operation, orderId, args, createtime, status)
VALUES ('terminalDecoration', 'D202501170001',
        '{"orderId":"D202501170001","cnid":1010,"userId":10001}',
        NOW(), 0);

-- 11. 装修订单结算
INSERT INTO information.messagequeuing (operation, orderId, args, createtime, status)
VALUES ('makeDecorationAccount', 'D202501170001',
        '{"orderId":"D202501170001","cnid":1011,"userId":10001}',
        NOW(), 0);

-- 12. 添加施工人员
INSERT INTO information.messagequeuing (operation, orderId, args, createtime, status)
VALUES ('addConstructer', 'D202501170001',
        '{"orderId":"D202501170001","cnid":1012,"userId":10001}',
        NOW(), 0);

-- 13. 删除施工人员
INSERT INTO information.messagequeuing (operation, orderId, args, createtime, status)
VALUES ('deleteConstructer', 'D202501170001',
        '{"orderId":"D202501170001","cnid":1013,"userId":10001}',
        NOW(), 0);

-- 14. 提交装修订单终止审批
INSERT INTO information.messagequeuing (operation, orderId, args, createtime, status)
VALUES ('submitApprovalForDecorationTerminal', 'D202501170001',
        '{"orderId":"D202501170001","cnid":1014,"userId":10001}',
        NOW(), 0);

-- 15. 预签装修合同
INSERT INTO information.messagequeuing (operation, orderId, args, createtime, status)
VALUES ('presignDecorationContract', 'D202501170001',
        '{"orderId":"D202501170001","cnid":1015,"userId":10001}',
        NOW(), 0);

-- 16. 装修订单废单
INSERT INTO information.messagequeuing (operation, orderId, args, createtime, status)
VALUES ('obsoleteDecoration', 'D202501170001',
        '{"orderId":"D202501170001","cnid":1016,"userId":10001}',
        NOW(), 0);

-- 17. 收取装修款
INSERT INTO information.messagequeuing (operation, orderId, args, createtime, status)
VALUES ('collectDecorationPayment', 'D202501170001',
        '{"orderId":"D202501170001","cnid":1017,"userId":10001}',
        NOW(), 0);

-- 18. 收款
INSERT INTO information.messagequeuing (operation, orderId, args, createtime, status)
VALUES ('collectPayment', 'D202501170001',
        '{"orderId":"D202501170001","cnid":1018,"userId":10001}',
        NOW(), 0);

-- 19. 添加施工节点
INSERT INTO information.messagequeuing (operation, orderId, args, createtime, status)
VALUES ('addConstructionNode', 'D202501170001',
        '{"orderId":"D202501170001","cnid":1019,"userId":10001}',
        NOW(), 0);

-- 20. 更新施工节点
INSERT INTO information.messagequeuing (operation, orderId, args, createtime, status)
VALUES ('updateConstructionNode', 'D202501170001',
        '{"orderId":"D202501170001","cnid":1020,"userId":10001}',
        NOW(), 0);

-- 21. 更新施工节点状态
INSERT INTO information.messagequeuing (operation, orderId, args, createtime, status)
VALUES ('updateConstructionNodeForStatus', 'D202501170001',
        '{"orderId":"D202501170001","cnid":1021,"userId":10001}',
        NOW(), 0);


-- ============================================
-- 批量生成示例数据（多个订单）
-- ============================================

-- 为多个订单生成签约事件示例
INSERT INTO information.messagequeuing (operation, orderId, args, createtime, status)
VALUES
    ('signDecorationContract', 'D202501170002', '{"orderId":"D202501170002","cnid":1002,"userId":10001}', NOW(), 0),
    ('signDecorationContract', 'D202501170003', '{"orderId":"D202501170003","cnid":1002,"userId":10001}', NOW(), 0),
    ('signDecorationContract', 'D202501170004', '{"orderId":"D202501170004","cnid":1002,"userId":10001}', NOW(), 0),
    ('beginConstructionSchedule', 'D202501170002', '{"orderId":"D202501170002","cnid":1007,"userId":10001}', NOW(), 0),
    ('beginConstructionSchedule', 'D202501170003', '{"orderId":"D202501170003","cnid":1007,"userId":10001}', NOW(), 0),
    ('obsoleteDecoration', 'D202501170004', '{"orderId":"D202501170004","cnid":1016,"userId":10001}', NOW(), 0);


-- ============================================
-- 查询验证
-- ============================================

-- 查看各操作类型的消息数量
SELECT operation, COUNT(*) as count
FROM information.messagequeuing
GROUP BY operation
ORDER BY operation;

-- 查看所有待处理消息
SELECT mqid, operation, orderId, createtime, status
FROM information.messagequeuing
WHERE status = 0
ORDER BY createtime DESC;
