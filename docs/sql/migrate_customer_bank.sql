-- 数据迁移：将 customer 表中已有的银行账户信息迁入 customer_bank
-- 迁移前请确认 customer_bank 表已创建

INSERT INTO communion.customer_bank (cid, type, no, name, phone, address, bank, bankno, status, defaults, createTime, updateTime)
SELECT 
    c.cid,
    CASE WHEN c.company = 1 THEN 1 ELSE 0 END,
    IFNULL(c.companyNo, ''),
    IFNULL(c.companyName, ''),
    IFNULL(c.companyPhone, ''),
    IFNULL(c.companyAddr, ''),
    IFNULL(c.companyBank, ''),
    IFNULL(c.companyBankno, ''),
    0,
    1,
    NOW(),
    NOW()
FROM communion.customer c
WHERE c.companyBankno IS NOT NULL 
  AND c.companyBankno != '';
