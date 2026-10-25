-- ============================================================================
-- 文件: 22_userpartner_type_supplier_dict.sql
-- 库表: communion.constant(前端字典)
-- 用途: userpartner 复用为「厂商↔驻店员关联用户」关系表——新增搭档类型 type=5(厂商):
--       uid=厂商(user.type=1), puid=驻店员(user.type=4), 一个用户仅可归属一个厂商。
--       落库链路: ①OC同步syncInstorer(A20260404, 以传入supplierUserId为准upsert);
--       ②前台厂商管理页「关联用户」维护(personnel/supplier4partner弹层, 走
--       queryUserPartner/addUserPartner/deleteUserPartner现成接口)。
--       本行字典驱动 userPartner.html 类型下拉与列表类型列显示。
-- 执行前置条件:
--   ① 后端jar(personel-8.3.030: UserPartnerPO.TYPE_SUPPLIER_INT/唯一归属闸;
--      seiya-8.3.030: syncInstorer落关系)部署前后均可, 字典仅影响前端显示;
--   ② 验证现状: SELECT COUNT(*) FROM communion.constant
--      WHERE module='personel' AND clazz='userPartner' AND `key`='5'; 期望=0
-- 回滚方式:
--   DELETE FROM communion.constant WHERE module='personel' AND clazz='userPartner'
--     AND type='type' AND field='TYPE_SUPPLIER_INT' AND `key`='5';
--   (若已有 type=5 关系数据, 仅删字典会导致 userPartner.html 列表类型列显示空, 关系本身不受影响)
-- 幂等性: 按 module+clazz+type+key NOT EXISTS 守卫, 可重复执行
-- ============================================================================

INSERT INTO communion.constant (name, module, clazz, type, field, `key`, value, status)
SELECT '厂商(类型)', 'personel', 'userPartner', 'type', 'TYPE_SUPPLIER_INT', '5', '厂商', 0
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM communion.constant
    WHERE module = 'personel' AND clazz = 'userPartner' AND type = 'type' AND `key` = '5'
);

-- 验证: 期望=1行, value='厂商', status=0
SELECT cid, name, module, clazz, type, field, `key`, value, status
FROM communion.constant
WHERE module = 'personel' AND clazz = 'userPartner' AND `key` = '5';
