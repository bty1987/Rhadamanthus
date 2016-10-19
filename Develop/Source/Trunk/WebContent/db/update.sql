ALTER TABLE `platform`.`decorationorder` DROP COLUMN `orderType`;

ALTER TABLE `platform`.`decorationorder` ADD COLUMN `type` TINYINT NOT NULL DEFAULT 0 AFTER `status`;

ALTER TABLE `platform`.`quotation` ADD COLUMN `type` TINYINT NOT NULL DEFAULT 0 AFTER `status`;
ALTER TABLE `platform`.`quotation` ADD COLUMN `basicPrice` DECIMAL(10,3) NOT NULL DEFAULT 0.000;
ALTER TABLE `platform`.`quotation` ADD COLUMN `setpackage` DECIMAL(10,3) NOT NULL DEFAULT 0.000;
ALTER TABLE `platform`.`quotation` ADD COLUMN `qdiff` DECIMAL(10,3) NOT NULL DEFAULT 0.000;
ALTER TABLE `platform`.`quotation` ADD COLUMN `mdiff` DECIMAL(10,3) NOT NULL DEFAULT 0.000;

ALTER TABLE `platform`.`functionarea` ADD COLUMN `type` TINYINT NOT NULL DEFAULT 0;
ALTER TABLE `platform`.`functionarea` ADD COLUMN `total` DECIMAL(10,3) NOT NULL DEFAULT 0.000;

ALTER TABLE `platform`.`quotationfunctionarea` ADD COLUMN `type` TINYINT NOT NULL DEFAULT 0;
ALTER TABLE `platform`.`quotationfunctionarea` ADD COLUMN `total` DECIMAL(10,3) NOT NULL DEFAULT 0.000;

















update functionarea set type = 1;
update quotationfunctionarea set type = 1;
update quotationfunctionarea set type = 0 where functionAreaType = '0';