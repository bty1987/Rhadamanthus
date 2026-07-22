INSERT INTO `communion`.`systemconfig` (`group`, `key`, `value`, `cuid`, `comment`, `company`)
VALUES
  ('decoration', 'DECORATION_ACCOUNT_CHECK_ENABLE', '0', 0, '装修决算指标总开关, 0:不验证, 1:验证', 0),
  ('decoration', 'DECORATION_ACCOUNT_CHECK_SIGN_ENABLE', '0', 0, '装修决算签约指标开关, 0:不验证, 1:验证', 0),
  ('decoration', 'DECORATION_ACCOUNT_CHECK_SALES_ENABLE', '0', 0, '装修决算销售单完结指标开关, 0:不验证, 1:验证', 0),
  ('decoration', 'DECORATION_ACCOUNT_CHECK_CONSTRUCTION_ENABLE', '0', 0, '装修决算工程节点指标开关, 0:不验证, 1:验证', 0),
  ('decoration', 'DECORATION_ACCOUNT_CHECK_SELECTION_ENABLE', '0', 0, '装修决算选材完结指标开关, 0:不验证, 1:验证', 0),
  ('decoration', 'DECORATION_ACCOUNT_CHECK_DECORATION_PAYMENT_ENABLE', '0', 0, '装修决算装修款比例指标开关, 0:不验证, 1:验证', 0),
  ('decoration', 'DECORATION_ACCOUNT_CHECK_SALES_PAYMENT_ENABLE', '0', 0, '装修决算销售比例指标开关, 0:不验证, 1:验证', 0),
  ('decoration', 'DECORATION_ACCOUNT_DECORATION_PAYMENT_SCALE', '99', 0, '装修决算装修款比例目标值', 0),
  ('decoration', 'DECORATION_ACCOUNT_SALES_PAYMENT_SCALE', '99', 0, '装修决算销售比例目标值', 0);
