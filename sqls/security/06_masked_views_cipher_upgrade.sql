-- ============================================================
-- 06号: 脱敏视图密文化升级 (customer_v / user_v / customerphone_v)
-- ============================================================
-- 用途说明:
--   P3出口治理配套。01号视图的 phone/identity 脱敏逻辑(CONCAT(LEFT/RIGHT))
--   按明文列设计; 列全加密(ENC(V1:)格式)后, 视图对密文做前后截断输出为
--   无意义乱码。本脚本将三个视图的敏感列改为直接输出原值——列内已是密文,
--   普通账号(仅视图权限)天然拿不到明文, 安全目标不变且输出语义一致;
--   需要明文/掩码的业务一律走应用接口(SensitiveDataHelper 脱敏出口)。
--   house_v(01号)本就直出 houseNumber, 列加密后语义自动成立, 无需改动。
--
-- 涉及敏感列(全部为密文列):
--   customer:      phone, identity, companyPhone
--   user:          phone, identity
--   customerphone: phone
--
-- 执行前置条件:
--   1. 在 01号视图脚本之后执行(覆盖其定义);
--   2. 执行后普通账号(仅视图权限)查询视图将看到密文, 属预期;
--   3. 幂等: DROP+CREATE 可安全重跑。
--
-- 回滚方式:
--   重新执行 sqls/security/01_masked_views.sql 即恢复旧脱敏定义
--   (注意: 回滚后视图对密文列的截断输出仍为乱码, 仅作定义还原)。
--
-- 验证语句:
--   SHOW CREATE VIEW communion.customer_v;  -- 确认无 LEFT/RIGHT 截断逻辑
--   SELECT COUNT(*) FROM communion.user_v LIMIT 1;  -- 视图可查
--
-- 幂等性: DROP IF EXISTS + CREATE, 可安全重跑。
-- ============================================================

USE communion;

DROP VIEW IF EXISTS customer_v;

CREATE VIEW customer_v AS
SELECT
    cid,
    no,
    name,
    pinyinAB,
    pinyinAll,
    gender,
    phone,
    qq,
    wechat,
    email,
    career,
    address,
    relationshipType,
    officer,
    passport,
    passhkm,
    identity,
    company,
    token,
    signno,
    status,
    photoPath,
    signPath,
    identityPathF,
    identityPathB,
    authurl,
    type,
    companyNo,
    companyName,
    companyAddr,
    companyPhone,
    companyBank,
    companyBankno
FROM customer;

DROP VIEW IF EXISTS user_v;

CREATE VIEW user_v AS
SELECT
    uid,
    userId,
    oldUserId,
    type,
    roleId,
    deptId,
    company,
    loginId,
    password,
    userName,
    pinyin,
    did,
    gender,
    identity,
    phone,
    userPhoto,
    identityPathF,
    identityPathB,
    status,
    isLogin,
    extranet,
    freedom,
    isUpdate,
    authStatus,
    authUrl,
    signNo,
    token
FROM user;

DROP VIEW IF EXISTS customerphone_v;

CREATE VIEW customerphone_v AS
SELECT
    cpid,
    cid,
    phone,
    status,
    defaults
FROM customerphone;
