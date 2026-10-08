-- =============================================================================
-- requestAuthCode 加固(2026-10-08): factory.token 加关联工号与超时配置两列
-- 背景: ①code 不绑定用户(任何有效 code+secret 可为任意 userId 换票),加 buid 关联字段收窄冒充面;
--       ②签发票据原为永久(setTimout(1)),改为按码可配: 默认正常超时,可配永久
-- 字段语义:
--   buid   int NOT NULL DEFAULT 0  关联 communion.user.uid(对齐 noods.pnid/pcnid 关联字段先例)
--                                  0=不绑定(兼容存量行,行为不变);
--                                  >0 时 requestAuthCode 的 userId 所对应 uid 必须与之相等,否则按 110008 拒绝
--   timeout smallint NOT NULL DEFAULT 0  会话超时档位:
--                                  0 = 正常超时(全局 cookieOvertime,默认30分钟)
--                                  -1 = 永久(签发时映射 Authentication.TIMEOUT_INT=1)
--                                  🔴 仅支持 0/-1 两档;自定义分钟档需改造 core AccessInterceptor
--                                    (core 走 WEB-INF/classes 部署,不在 jar 热替换体系),暂不启用
-- 配套代码: TokenPO(fanglin-factory-8.3.030) + LoginServiceImpl/LoginAction(fanglin-common-8.3.030)
-- 🔴 上线序: 本 SQL 先于两 jar(PO 映射新列)
-- 发码样例: INSERT INTO factory.token(`key`,status,buid,timeout)
--           VALUES('<32位随机码>',0,(SELECT uid FROM communion.user WHERE userId='FL-xxxxx'),0);
-- 幂等: information_schema 判断列存在,重复执行安全(MySQL 5.6 无 IF NOT EXISTS)
-- =============================================================================

-- ---------- 1. 加 buid 列 ----------
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = 'factory' AND TABLE_NAME = 'token' AND COLUMN_NAME = 'buid');
SET @ddl := IF(@col_exists = 0,
    'ALTER TABLE factory.token ADD COLUMN buid int NOT NULL DEFAULT 0',
    'SELECT "column buid already exists" AS note');
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ---------- 2. 加 timeout 列 ----------
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = 'factory' AND TABLE_NAME = 'token' AND COLUMN_NAME = 'timeout');
SET @ddl := IF(@col_exists = 0,
    'ALTER TABLE factory.token ADD COLUMN timeout smallint NOT NULL DEFAULT 0',
    'SELECT "column timeout already exists" AS note');
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 核验
SHOW COLUMNS FROM factory.token LIKE 'buid';
SHOW COLUMNS FROM factory.token LIKE 'timeout';
