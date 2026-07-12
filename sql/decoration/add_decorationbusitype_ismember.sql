ALTER TABLE data.decorationbusitype
ADD COLUMN isMember tinyint(1) NOT NULL DEFAULT 0 COMMENT '会员标识 0: 通用 , 1: 会员' AFTER isAward;
