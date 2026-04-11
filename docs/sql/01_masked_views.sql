-- ============================================
-- 脱敏视图创建脚本
-- ============================================
-- 功能：创建脱敏视图，普通用户只能查询视图，主账号可查询原表
-- 版本：v1.0
-- 日期：2026-04-11
-- ============================================

USE communion;

-- ============================================
-- 1. 客户表脱敏视图 (customer_v)
-- ============================================
DROP VIEW IF EXISTS customer_v;

CREATE VIEW customer_v AS
SELECT
    cid,
    no,
    name,
    pinyinAB,
    pinyinAll,
    gender,
    -- phone 脱敏：前3后4，中间**** (如：138****1234)
    CASE
        WHEN phone IS NULL THEN NULL
        WHEN LENGTH(phone) >= 7 THEN CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4))
        ELSE phone
    END AS phone,
    qq,
    wechat,
    email,
    career,
    address,
    relationshipType,
    officer,
    passport,
    passhkm,
    -- identity 脱敏：前6后4，中间******** (如：210***********1234)
    CASE
        WHEN identity IS NULL THEN NULL
        WHEN LENGTH(identity) >= 10 THEN CONCAT(LEFT(identity, 6), '********', RIGHT(identity, 4))
        ELSE identity
    END AS identity,
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

-- ============================================
-- 2. 用户表脱敏视图 (user_v)
-- ============================================
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
    currentName,
    did,
    gender,
    -- identity 脱敏
    CASE
        WHEN identity IS NULL THEN NULL
        WHEN LENGTH(identity) >= 10 THEN CONCAT(LEFT(identity, 6), '********', RIGHT(identity, 4))
        ELSE identity
    END AS identity,
    -- phone 脱敏
    CASE
        WHEN phone IS NULL THEN NULL
        WHEN LENGTH(phone) >= 7 THEN CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4))
        ELSE phone
    END AS phone,
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

-- ============================================
-- 3. 客户电话表脱敏视图 (customerphone_v)
-- ============================================
DROP VIEW IF EXISTS customerphone_v;

CREATE VIEW customerphone_v AS
SELECT
    cpid,
    cid,
    -- phone 脱敏
    CASE
        WHEN phone IS NULL THEN NULL
        WHEN LENGTH(phone) >= 7 THEN CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 4))
        ELSE phone
    END AS phone,
    status,
    defaults
FROM customerphone;

-- ============================================
-- 4. 房屋表脱敏视图 (house_v)
-- ============================================
-- housenumber 暂不脱敏，按需求控制访问权限
DROP VIEW IF EXISTS house_v;

CREATE VIEW house_v AS
SELECT
    hid,
    vid,
    -- housenumber 不脱敏，如果需要脱敏请取消下面注释
    -- CASE
    --     WHEN LENGTH(houseNumber) >= 4 THEN CONCAT(LEFT(houseNumber, 2), '**', RIGHT(houseNumber, 2))
    --     ELSE houseNumber
    -- END AS houseNumber,
    houseNumber,
    orderId,
    built,
    unit,
    floor,
    door,
    innerFloor,
    type,
    buildArea,
    freeArea,
    innerArea,
    quoteArea,
    totalArea,
    maxFloor,
    through,
    roomNum,
    houseType,
    orientation,
    feature,
    waterVapour,
    parlourType,
    heatingType,
    islift,
    status,
    company
FROM house;

-- ============================================
-- 验证视图创建
-- ============================================
SELECT
    TABLE_NAME as '视图名称',
    TABLE_TYPE as '类型'
FROM information_schema.VIEWS
WHERE TABLE_SCHEMA = 'communion'
  AND TABLE_NAME LIKE '%_v'
ORDER BY TABLE_NAME;
