ALTER TABLE `data`.`constructionnode`
  ADD COLUMN `account` tinyint(1) NOT NULL DEFAULT 0 COMMENT '决算标识, 0:否, 1:是' AFTER `mark`;
