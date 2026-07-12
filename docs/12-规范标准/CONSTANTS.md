# 系统常量定义文档

> 生成时间: 2026-01-06 08:26:37
> 来源: `communion.constant` 表

## 统计信息

- **模块数**: 16
- **类数**: 191
- **常量数**: 1777

## 目录

- [APPROVAL](#approval)
  - [approval](#approval-approval)
  - [process](#approval-process)
- [BALANCE](#balance)
  - [balance](#balance-balance)
  - [balanceAccount](#balance-balanceaccount)
  - [balanceCutpay](#balance-balancecutpay)
  - [balanceDccount](#balance-balancedccount)
  - [balanceOales](#balance-balanceoales)
  - [balancePicture](#balance-balancepicture)
  - [balanceSales](#balance-balancesales)
  - [balanceSelection](#balance-balanceselection)
- [CONSTRUCTION](#construction)
  - [accessory](#construction-accessory)
  - [construction](#construction-construction)
  - [constructionDiary](#construction-constructiondiary)
  - [constructionInfo](#construction-constructioninfo)
  - [constructionSchedule](#construction-constructionschedule)
  - [customer4complaint](#construction-customer4complaint)
  - [customer4feedback](#construction-customer4feedback)
  - [customerServiceComplaint](#construction-customerservicecomplaint)
  - [drawLine](#construction-drawline)
  - [qualiter](#construction-qualiter)
- [CUSTOMER](#customer)
  - [aepair](#customer-aepair)
  - [aepairPay](#customer-aepairpay)
  - [complain](#customer-complain)
  - [complaint](#customer-complaint)
  - [cppoint](#customer-cppoint)
  - [customer](#customer-customer)
  - [customerChance](#customer-customerchance)
  - [customerDeptRule](#customer-customerdeptrule)
  - [customerOrigine](#customer-customerorigine)
  - [customerProtectRule](#customer-customerprotectrule)
  - [customerSource](#customer-customersource)
  - [customerUserRule](#customer-customeruserrule)
  - [customerUserRuleItem](#customer-customeruserruleitem)
  - [droup](#customer-droup)
  - [feedback](#customer-feedback)
  - [feedbackBackVisit](#customer-feedbackbackvisit)
  - [feedbackComplaint](#customer-feedbackcomplaint)
  - [feedbackComplaintDept](#customer-feedbackcomplaintdept)
  - [feedbackGuarantee](#customer-feedbackguarantee)
  - [repair](#customer-repair)
  - [revisit](#customer-revisit)
  - [survey](#customer-survey)
  - [surveyOption](#customer-surveyoption)
  - [vscoreRecord](#customer-vscorerecord)
  - [vustomer](#customer-vustomer)
  - [vustomerAdvance](#customer-vustomeradvance)
  - [vustomerShared](#customer-vustomershared)
- [DATA](#data)
  - [accessoriesType](#data-accessoriestype)
  - [assistance](#data-assistance)
  - [bankAccount](#data-bankaccount)
  - [brand](#data-brand)
  - [brandBalance](#data-brandbalance)
  - [category](#data-category)
  - [color](#data-color)
  - [common](#data-common)
  - [constructionNode](#data-constructionnode)
  - [constructionPaceNode](#data-constructionpacenode)
  - [contract](#data-contract)
  - [custype](#data-custype)
  - [decorationAtttype](#data-decorationatttype)
  - [decorationBusitype](#data-decorationbusitype)
  - [decorationMatching](#data-decorationmatching)
  - [format](#data-format)
  - [functionArea](#data-functionarea)
  - [goods](#data-goods)
  - [goodsKind](#data-goodskind)
  - [goodsPool](#data-goodspool)
  - [goodsRecord](#data-goodsrecord)
  - [holiday](#data-holiday)
  - [inspect](#data-inspect)
  - [inspectItem](#data-inspectitem)
  - [noods](#data-noods)
  - [normood](#data-normood)
  - [normrice](#data-normrice)
  - [paymentType](#data-paymenttype)
  - [presignItem](#data-presignitem)
  - [presignPrice](#data-presignprice)
  - [presignProduce](#data-presignproduce)
  - [price](#data-price)
  - [quotationItem](#data-quotationitem)
  - [quotationPrice](#data-quotationprice)
  - [quotationRtem](#data-quotationrtem)
  - [quotationVersion](#data-quotationversion)
  - [receiptType](#data-receipttype)
  - [remeasureFormat](#data-remeasureformat)
  - [soods](#data-soods)
  - [soodsItem](#data-soodsitem)
  - [surveyTemplate](#data-surveytemplate)
- [DECORATION](#decoration)
  - [audit](#decoration-audit)
  - [audit4record](#decoration-audit4record)
  - [auditRecord](#decoration-auditrecord)
  - [decoration](#decoration-decoration)
  - [decorationActivityItem](#decoration-decorationactivityitem)
  - [decorationContract](#decoration-decorationcontract)
  - [decorationPicture](#decoration-decorationpicture)
  - [decorationUser](#decoration-decorationuser)
  - [decorationbelong](#decoration-decorationbelong)
  - [measure](#decoration-measure)
- [INFORMATION](#information)
  - [activity](#information-activity)
  - [activityItem](#information-activityitem)
  - [awardPurchase](#information-awardpurchase)
  - [awardRecord](#information-awardrecord)
  - [awardStock](#information-awardstock)
  - [message](#information-message)
  - [notice](#information-notice)
  - [phoneCall](#information-phonecall)
  - [plan](#information-plan)
  - [vpayment](#information-vpayment)
  - [vprize](#information-vprize)
  - [vticket](#information-vticket)
  - [worksheet](#information-worksheet)
- [INVENTORY](#inventory)
  - [accessories](#inventory-accessories)
  - [manifest](#inventory-manifest)
  - [occessories](#inventory-occessories)
  - [occessoriesCost](#inventory-occessoriescost)
  - [storehouse](#inventory-storehouse)
- [OUTBOUND](#outbound)
  - [outbound](#outbound-outbound)
- [PAYMENT](#payment)
  - [activityPayment](#payment-activitypayment)
  - [advancePayment](#payment-advancepayment)
  - [decorationPayment](#payment-decorationpayment)
  - [materialPayment](#payment-materialpayment)
  - [oalesPayment](#payment-oalespayment)
  - [payment](#payment-payment)
  - [paymentContract](#payment-paymentcontract)
  - [paymentFunction](#payment-paymentfunction)
  - [paytran](#payment-paytran)
  - [proxyPayment](#payment-proxypayment)
  - [receipt](#payment-receipt)
  - [receiptType](#payment-receipttype)
  - [salesPayment](#payment-salespayment)
  - [salespayment](#payment-salespayment)
  - [servicePayment](#payment-servicepayment)
  - [statement](#payment-statement)
  - [wallet](#payment-wallet)
  - [walletard](#payment-walletard)
  - [walletran](#payment-walletran)
  - [walletres](#payment-walletres)
- [PERSONEL](#personel)
  - [cityPartner](#personel-citypartner)
  - [contract](#personel-contract)
  - [dept](#personel-dept)
  - [performance](#personel-performance)
  - [recruitment](#personel-recruitment)
  - [supplierContractBrand](#personel-suppliercontractbrand)
  - [supplierContractBrandProduct](#personel-suppliercontractbrandproduct)
  - [supplierContractService](#personel-suppliercontractservice)
  - [uesrInfo](#personel-uesrinfo)
  - [user](#personel-user)
  - [userContract](#personel-usercontract)
  - [userExperience](#personel-userexperience)
  - [userFunction](#personel-userfunction)
  - [userInfo](#personel-userinfo)
  - [userPartner](#personel-userpartner)
- [QUOTATION](#quotation)
  - [addReduceItem](#quotation-addreduceitem)
  - [addreduce](#quotation-addreduce)
  - [extension](#quotation-extension)
  - [extensionItem](#quotation-extensionitem)
  - [normoodItem](#quotation-normooditem)
  - [normoodItem ](#quotation-normooditem )
  - [normriceItem](#quotation-normriceitem)
  - [normtion](#quotation-normtion)
  - [protation](#quotation-protation)
  - [protationItem](#quotation-protationitem)
  - [qeasureItem](#quotation-qeasureitem)
  - [quotation](#quotation-quotation)
  - [quotationFunctionArea](#quotation-quotationfunctionarea)
  - [quotationFunctionAreaItem](#quotation-quotationfunctionareaitem)
  - [quotationPicture](#quotation-quotationpicture)
  - [quotationPrefer](#quotation-quotationprefer)
  - [quotationRecord](#quotation-quotationrecord)
  - [quotetionFunctionArea](#quotation-quotetionfunctionarea)
  - [quotetionFunctionAreaItem](#quotation-quotetionfunctionareaitem)
  - [selection](#quotation-selection)
  - [selectionItem](#quotation-selectionitem)
- [RIGHT](#right)
  - [salesDeliveryStatusRight](#right-salesdeliverystatusright)
  - [selectionItemStatusRight](#right-selectionitemstatusright)
- [SALARY](#salary)
  - [decorationSalary](#salary-decorationsalary)
  - [materialSalary](#salary-materialsalary)
  - [salary](#salary-salary)
  - [withhold](#salary-withhold)
- [SALES](#sales)
  - [oales](#sales-oales)
  - [oalespay](#sales-oalespay)
  - [refunds](#sales-refunds)
  - [sales](#sales-sales)
  - [salesActivityItem](#sales-salesactivityitem)
  - [salesBalance](#sales-salesbalance)
  - [salesDeliveryItem](#sales-salesdeliveryitem)
  - [salesFunction](#sales-salesfunction)
  - [salesItem](#sales-salesitem)
  - [salesPicture](#sales-salespicture)
- [SYSTEM](#system)
  - [company](#system-company)
  - [module](#system-module)

---

## APPROVAL 模块

<a name="approval"></a>

### approval

<a name="approval-approval"></a>

#### **status** (9 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `` | `4` | 发起失败(状态) |
| `` | `15` | 归属(类型) |
| `STATUS_APPROVAL_INT` | `1` | 审批通过(状态) |
| `STATUS_APPROVE_INT` | `3` | 审批中(状态) |
| `STATUS_CONFIRMED_INT` | `6` | 待确认(状态) |
| `STATUS_CONFIRM_INT` | `5` | 客户确认(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |
| `STATUS_REFUSE_INT` | `2` | 审批拒绝(状态) |
| `STATUS_REJECT_INT` | `7` | 客户拒绝(状态) |

#### **type** (24 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_CUSTOMER_CHANCE_INT` | `21` | 客户机会 |
| `TYPE_CUSTOMER_INT` | `1` | 客户信息修改(类型) |
| `TYPE_CUSTOMER_ORIGIN_INT` | `17` | 客源初审(类型) |
| `TYPE_CUSTOMER_ORIGIN_T_DECORATION_INT` | `14` | 客源转装修单(类型) |
| `TYPE_CUSTOMER_SOURCE_INT` | `20` | 客户资源 |
| `TYPE_DECORATION_ACTIVITY_INT` | `8` | 活动物品申领(类型) |
| `TYPE_DECORATION_CHANCE_DISABLED_INT` | `25` | 客户机会不匹配 |
| `TYPE_DECORATION_CONTRACT_INT` | `24` | 装修合同 |
| `TYPE_DECORATION_HOLONOMY_INT` | `16` | 装修满减修改(类型) |
| `TYPE_DECORATION_REFUND_INT` | `5` | 订单退款(类型) |
| `TYPE_DECORATION_TERMINAL_INT` | `19` | 装修合同终止(类型) |
| `TYPE_HR_INT` | `13` | 人资(类型) |
| `TYPE_MANIFESTDB_INT` | `11` | 商品库存调拨(类型) |
| `TYPE_MATERIAL_FULL_PAYMENT_INT` | `9` | 主材补款提交(类型) |
| `TYPE_MATERIAL_OUTSIDE_REFUND_INT` | `7` | 主材场外退款(类型) |
| `TYPE_MATERIAL_REFUND_INT` | `6` | 主材退货(类型) |
| `TYPE_ORDER_BELONG_INT` | `3` | 订单归属信息修改(类型) |
| `TYPE_PROTATION_PERFER_INT` | `23` | 预签优惠 |
| `TYPE_QUOTATION_DISCOUNT_INT` | `4` | 报价折扣修改(类型) |
| `TYPE_QUOTATION_PERFER_INT` | `22` | 报价优惠 |
| `TYPE_SALESDAYMENT_INT` | `18` | 销售不退定金(类型) |
| `TYPE_SALESREFUND_PAYMENT_INT` | `10` | 销售退货(类型) |
| `TYPE_SALES_DIACOUNT_INT` | `12` | 销售补款提交(类型) |
| `TYPE_VILLAGE_INT` | `2` | 订单房产信息修改(类型) |

### process

<a name="approval-process"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `1` | 禁用(状态) |
| `STATUS_ENABLE_INT` | `0` | 启用(状态) |

## BALANCE 模块

<a name="balance"></a>

### balance

<a name="balance-balance"></a>

#### **isPay** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISPAY_NOTPAY_INT` | `0` | 未付(付款标识) |
| `ISPAY_PAYED_INT` | `1` | 已付(付款标识) |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_FINISH_INT` | `1` | 完结(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |

#### **type** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_COLLECT_INT` | `1` | 收款(类型) |
| `TYPE_PAYOUT_INT` | `0` | 支出(类型) |
| `TYPE_WITHDRAW_INT` | `2` | 提款(类型) |

### balanceAccount

<a name="balance-balanceaccount"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_UNVALID_SHORT` | `1` | 无效(状态) |
| `STATUS_VALID_SHORT` | `0` | 有效(状态) |

#### **type** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_UNVALID_SHORT` | `1` | 出纳(类型) |
| `TYPE_VALID_SHORT` | `0` | 结算(类型) |

### balanceCutpay

<a name="balance-balancecutpay"></a>

#### **atttype** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ATTTYPE_CUTPAY_INT` | `0` | 扣款 |
| `ATTTYPE_ENTRY_STORE_INT` | `1` | 入场费 |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_BIND_INT` | `1` | 绑定(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |

#### **type** (13 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_ACTIVITY_INT` | `2` | 活动费 |
| `TYPE_BAIL_INT` | `11` | 保证金 |
| `TYPE_CUTPAY_INT` | `0` | 扣款(类型) |
| `TYPE_DECORA_INT` | `10` | 装修费 |
| `TYPE_LEASE_INT` | `8` | 场地租赁费 |
| `TYPE_MANAGE_INT` | `3` | 管理费 |
| `TYPE_PARENT_INT` | `7` | 合作费 |
| `TYPE_POST_INT` | `4` | 售后费 |
| `TYPE_PROFIT_INT` | `5` | 年返 |
| `TYPE_PROFIT_OUT_INT` | `6` | 场外返利 |
| `TYPE_PUBLIC_INT` | `9` | 推广费 |
| `TYPE_SERVER_INT` | `12` | 服务费 |
| `TYPE_UNCUTPAY_INT` | `1` | 返款(类型) |

### balanceDccount

<a name="balance-balancedccount"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_UNVALID_SHORT` | `1` | 失效(状态) |
| `STATUS_VALID_SHORT` | `0` | 有效(状态) |

#### **type** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_CUTPAY_INT` | `0` | 扣款(类型) |
| `TYPE_UNCUTPAY_INT` | `1` | 返款(类型) |

### balanceOales

<a name="balance-balanceoales"></a>

#### **grade** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `GRADE_A_INT` | `A` | A(等级) |
| `GRADE_B_INT` | `B` | B(等级) |
| `GRADE_C_INT` | `C` | C(等级) |

#### **status** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_AFFIRM_INT` | `2` | 确认(状态) |
| `STATUS_ENABLE_CHECK_INT` | `3` | 结算(状态) |
| `STATUS_FINISH_INT` | `4` | 完结(状态) |
| `STATUS_UNLOCK_INT` | `1` | 锁定(状态) |

### balancePicture

<a name="balance-balancepicture"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DEL_SHORT` | `1` | 删除(图片状态) |
| `STATUS_YES_SHORT` | `0` | 有效(图片状态) |

### balanceSales

<a name="balance-balancesales"></a>

#### **grade** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `GRADE_A_INT` | `A` | A(等级) |
| `GRADE_B_INT` | `B` | B(等级) |

#### **status** (5 项)

| 字段 | 值 | 描述      |
|:---|---:|:--------|
| `STATUS_AFFIRM_INT` | `2` | 确认(状态)  |
| `STATUS_ENABLE_CHECK_INT` | `3` | 结算(状态)  |
| `STATUS_FINISH_INT` | `4` | 完结(状态 ) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |
| `STATUS_UNLOCK_INT` | `1` | 锁定(状态)  |

### balanceSelection

<a name="balance-balanceselection"></a>

#### **grade** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `GRADE_A_INT` | `A` | A |
| `GRADE_A_INT` | `B` | B |
| `GRADE_A_INT` | `C` | C |

#### **status** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_ENABLE_CHECK_INT` | `3` | 审核(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |
| `STATUS_UNLOCK_INT` | `1` | 锁定(状态） |
| `STATUS_WAIT_INT` | `2` | 待审(状态) |

## CONSTRUCTION 模块

<a name="construction"></a>

### accessory

<a name="construction-accessory"></a>

#### **isCheckup** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISCHECKUP_ADOPT_INT` | `1` | 通过(类型) |
| `ISCHECKUP_VERIFICATION_INT` | `0` | 验证(类型) |

### construction

<a name="construction-construction"></a>

#### **balance** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `BALANCE_BALANCE_INT` | `1` | 已结算 |
| `BALANCE_INIT_INT` | `0` | 未结算 |
| `BALANCE_NONE_INT` | `2` | 不结算 |

#### **isAccessory** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISACCESSORY_DISABLE_INT` | `1` | 锁定(辅料权限) |
| `ISACCESSORY_ENABLE_INT` | `0` | 开启(辅料权限) |

#### **isIssue** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISSUE_INIT_INT` | `0` | 未分配 |
| `ISSUE_ISSUE_INT` | `1` | 已分配 |

#### **process** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `PROCESS_BASIC_DONE_INT` | `1` | 基础完工 |
| `PROCESS_UNDONE_INT` | `0` | 未完工 |

#### **terminalStatus** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISKEY_COMPANY_INT` | `0` | 无 |
| `ISKEY_CUSTOMER_INT` | `2` | 木工终止 |
| `ISKEY_CUSTOMER_INT` | `3` | 油工终止 |
| `ISKEY_CUSTOMER_INT` | `1` | 瓦工终止 |

### constructionDiary

<a name="construction-constructiondiary"></a>

#### **atttype** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `PROCESS_ATT_INT` | `2` | 日记(类型) |
| `PROCESS_ATT_INT` | `1` | 日记(类型) |

#### **isUpload** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISUPLOAD_UNUPLOAD_INT` | `0` | 否(是否上传图片) |
| `ISUPLOAD_UPLOAD_INT` | `1` | 是(是否上传图片) |

### constructionInfo

<a name="construction-constructioninfo"></a>

#### **isCeremony** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISCEREMONY_EXIST_INT` | `0` | 有(开工仪式) |
| `ISCEREMONY_NONE_INT` | `1` | 无(开工仪式) |

#### **isCheck** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISCHECK_CHECK_INT` | `0` | 已分配 |
| `ISCHECK_INIT_INT` | `0` | 未验证 |

#### **isHovel** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISHOVEL_COMPANY_INT` | `0` | 公司(铲大白) |
| `ISHOVEL_CUSTOMER_INT` | `1` | 客户(铲大白) |

#### **isIssue** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISISSUE_INIT_INT` | `0` | 未分配 |
| `ISISSUE_ISSUE_INT` | `1` | 已分配 |

#### **isKey** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISKEY_COMPANY_INT` | `0` | 工程中心(钥匙) |
| `ISKEY_CUSTOMER_INT` | `1` | 客户(钥匙) |

### constructionSchedule

<a name="construction-constructionschedule"></a>

#### **status** (15 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_BEGIN_INT` | `1` | 开工(工程状态) |
| `STATUS_BRICK_INT` | `9` | 瓦工(工程状态) |
| `STATUS_CARPENTER_INT` | `11` | 木工(工程状态) |
| `STATUS_CLEAN_INT` | `14` | 保洁(工程状态) |
| `STATUS_ELECTRIC_INT` | `8` | 电工(工程状态) |
| `STATUS_FINISH_INT` | `2` | 完工(工程状态) |
| `STATUS_GROUND_INT` | `10` | 地面找平(工程状态) |
| `STATUS_INIT_INT` | `0` | 初始(工程状态) |
| `STATUS_OILER_INT` | `12` | 油工(工程状态) |
| `STATUS_PAYOFF_INT` | `5` | 放线(工程状态) |
| `STATUS_PHYSICAL_INT` | `6` | 力工(工程状态) |
| `STATUS_WALLING_INT` | `3` | 砌墙(工程状态) |
| `STATUS_WATER_INT` | `7` | 水工(工程状态) |
| `STATUS_WHITE_INT` | `4` | 铲大白(工程状态) |
| `STATUS_WORELE_INT` | `13` | 水电验收(工程状态) |

### customer4complaint

<a name="construction-customer4complaint"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `COMPLAINT_STATUS_TYPE_HANDLE_INT` | `1` | 已处理(状态) |
| `COMPLAINT_STATUS_TYPE_INIT_INT` | `0` | 未处理(状态) |

### customer4feedback

<a name="construction-customer4feedback"></a>

#### **backVisitTypeData** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `BACKCISIT_IMPORT_INT` | `1` | 重要(类型) |
| `BACKVISIT_ORDINARY_INT` | `0` | 标准(类型) |

### customerServiceComplaint

<a name="construction-customerservicecomplaint"></a>

#### **levelDict** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `LEVELDICT_IMPORT_INT` | `1` | 重要(类型) |
| `TYPE_ORDINARY_INT` | `0` | 标准(类型) |

#### **typeDict** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPEDICT_MATERIALS_INT` | `1` | 主材(类型) |
| `TYPEDICT_RENOVATION_INT` | `0` | 装修(类型) |

### drawLine

<a name="construction-drawline"></a>

#### **status** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_APPLICATION_INT` | `1` | 申请放线(状态) |
| `STATUS_FAIL_INT` | `3` | 失败放线(状态) |
| `STATUS_QUEUE_INT` | `0` | 排队(状态) |
| `STATUS_SUCCESS_INT` | `2` | 成功放线(状态) |

### qualiter

<a name="construction-qualiter"></a>

#### **status** (1 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_VALID_INT` | `0` | 初始(状态) |

## CUSTOMER 模块

<a name="customer"></a>

### aepair

<a name="customer-aepair"></a>

#### **aepairStatus** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_COMMONLY_INT` | `2` | 一般(状态) |
| `STATUS_COMPLAINT_INT` | `3` | 投诉(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |
| `STATUS_INIT_INT` | `0` | 初始(类型) |
| `STATUS_SATISFIED_INT` | `1` | 满意(状态) |

#### **fivState** (15 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_FINISHED_INT` | `2` | 完工(状态) |
| `TYPE_FINISHED_INT` | `2` | 完工(状态) |
| `TYPE_FINISHED_INT` | `2` | 完工(状态) |
| `TYPE_FINISHED_INT` | `2` | 完工(状态) |
| `TYPE_FINISHED_INT` | `2` | 完工(状态) |
| `TYPE_INIT_INT` | `0` | 初始(状态) |
| `TYPE_INIT_INT` | `0` | 初始(状态) |
| `TYPE_INIT_INT` | `0` | 初始(状态) |
| `TYPE_INIT_INT` | `0` | 初始(状态) |
| `TYPE_INIT_INT` | `0` | 初始(状态) |
| `TYPE_REPAIR_INT` | `1` | 维修(状态) |
| `TYPE_REPAIR_INT` | `1` | 维修(状态) |
| `TYPE_REPAIR_INT` | `1` | 维修(状态) |
| `TYPE_REPAIR_INT` | `1` | 维修(状态) |
| `TYPE_REPAIR_INT` | `1` | 维修(状态) |

#### **status** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_CLOSE_INT` | `3` | 关闭(类型) |
| `STATUS_FINISHED_INT` | `2` | 完工(类型) |
| `STATUS_REPAIR_INT` | `1` | 维修(类型) |

### aepairPay

<a name="customer-aepairpay"></a>

#### **status** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_CONFIRMED_INT` | `2` | 已确认(状态) |
| `TYPE_INIT_INT` | `0` | 初始(状态) |
| `TYPE_PAID_INT` | `1` | 已付款(状态) |

#### **type** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_COST_INT` | `2` | 成本(类型) |
| `TYPE_DEDUCTION_INT` | `1` | 扣款(类型) |
| `TYPE_MONEY_INT` | `0` | 款项(类型) |

### complain

<a name="customer-complain"></a>

#### **complainStatus** (6 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_COMMONLY_INT` | `2` | 一般(状态) |
| `STATUS_COMPLAIN_INT` | `3` | 投诉(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |
| `STATUS_SATISFIED_INT` | `1` | 满意(状态) |

#### **complainType** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_CRISIS_INT` | `2` | 危机(类型) |
| `TYPE_MAJOR_INT` | `1` | 重大(类型) |
| `TYPE_ORDINARY_INT` | `0` | 标准(类型) |

#### **status** (6 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_CLOSE_INT` | `3` | 关闭(状态) |
| `STATUS_CLOSE_SHORT` | `3` | 关闭(状态) |
| `STATUS_DISPOSE_SHORT` | `1` | 处理(状态) |
| `STATUS_END_INT` | `2` | 完结(状态) |
| `STATUS_END_SHORT` | `2` | 完结(状态) |
| `STATUS_HANDLE_INT` | `1` | 处理(状态) |

### complaint

<a name="customer-complaint"></a>

#### **status** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_CLOSE_INT` | `3` | 关闭(状态) |
| `STATUS_END_INT` | `2` | 完结(状态) |
| `STATUS_HANDLE_INT` | `1` | 处理(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |

#### **type** (6 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_BUSINESS-INT` | `1` | 业务(类型) |
| `TYPE_DESIGN_INT` | `0` | 设计(类型) |
| `TYPE_ENGINEERING_INT` | `2` | 工程(类型) |
| `TYPE_OTHER_INT` | `4` | 其他(类型) |
| `TYPE_SALE_INT` | `3` | 销售(类型) |
| `TYPE_UNREASONABLE_INT` | `5` | 无理(类型) |

### cppoint

<a name="customer-cppoint"></a>

#### **cppointType** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_ACCUMULATION_INT` | `0` | 积累(类型) |
| `TYPE_CONSUME_INT` | `1` | 消耗(类型) |

#### **type** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_OPERATE_INT` | `2` | 运营(类型) |
| `TYPE_RENOVARION_INT` | `0` | 装修(类型) |
| `TYPE_SALE_INT` | `1` | 销售(类型) |

### customer

<a name="customer-customer"></a>

#### **customerStatus** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_AUTHENTICATION_INT` | `1` | 认证(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |

#### **customerType** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_COMPANY_INT` | `1` | 公司(类型) |
| `STATUS_PERSONAL_INT` | `0` | 个人(类型) |

#### **type** (1 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_ORDINARY_INT` | `0` | 标准客户(类型) |

### customerChance

<a name="customer-customerchance"></a>

#### **config** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `` | `0` | 无状态(机会) |
| `` | `2` | 未读 |
| `` | `3` | 未读 |
| `CONFIRM_CONFIRM_INT` | `2` | 是(机会) |
| `CONFIRM_UNCONFIRM_INT` | `1` | 否(机会) |

#### **isFine** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISFINE_FINE_INT` | `1` | 罚款 |
| `ISFINE_UNFINE_INT` | `0` | 未罚款 |

#### **isRead** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISREAD_READ_INT` | `1` | 已读 |
| `ISREAD_UNREAD_INT` | `0` | 未读 |

#### **status** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_APPROVE_INT` | `3` | 确认 |
| `STATUS_COMPLETE_INT` | `4` | 完成(状态) |
| `STATUS_CONFIRM_INT` | `2` | 分配 |
| `STATUS_DISTRIBUTION_INT` | `1` | 失效 |
| `STATUS_INIT_INT` | `0` | 初始(状态) |

#### **type** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_AUTO_INT` | `0` | 自动(类型) |
| `TYPE_DEPARTMENT_INT` | `2` | 部门(类型) |
| `TYPE_REGION_INT` | `3` | 分区(类型) |
| `TYPE_USER_INT` | `1` | 人员(类型) |

### customerDeptRule

<a name="customer-customerdeptrule"></a>

#### **atttype** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ATTTYPE_AUTO_INT` | `0` | 自动(业务类型) |
| `ATTTYPE_DEPT_INT` | `2` | 部门 |
| `ATTTYPE_RULE_INT` | `3` | 分区 |
| `ATTTYPE_USER_INT` | `1` | 人员 |

#### **focus** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `FOCUS_AREA_INT` | `1` | 面积 |
| `FOCUS_COM_INT` | `0` | 通用 |
| `FOCUS_DEPT_INT` | `2` | 部门 |
| `FOCUS_DEPT_TYPE_INT` | `3` | 部门类型 |

#### **type** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_COMPANY_INT` | `0` | 公司(类型) |
| `TYPE_COMPANY_INT` | `2` | 部门(类型) |
| `TYPE_ROLE_INT` | `1` | 分区(类型) |

### customerOrigine

<a name="customer-customerorigine"></a>

#### **status** (7 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_APPROVE_INT` | `4` | 审批(状态) |
| `STATUS_BIND_INT` | `5` | 绑定(状态) |
| `STATUS_COMMIT_INT` | `2` | 提交(状态) |
| `STATUS_CONFIRM_INT` | `3` | 确认(状态) |
| `STATUS_FIRSTAPPROVAL_INT` | `1` | 初审(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |
| `STATUS_REFUSE_INT` | `6` | 驳回(状态) |

### customerProtectRule

<a name="customer-customerprotectrule"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_ABLE_SHORT` | `0` | 有效 |
| `STATUS_DISABLE_SHORT` | `1` | 失效 |

#### **type** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_ADVANCE_SHORT` | `1` | 预付 |
| `TYPE_AREA_SHORT` | `0` | 面积 |
| `TYPE_DESIGN_SHORT` | `2` | 设计 |

### customerSource

<a name="customer-customersource"></a>

#### **customerType** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `CUSTOMEER_TYPE_GO_STORE` | `0` | 到店(状态) |
| `CUSTOMEER_TYPE_GUARD_GARDEN` | `2` | 守园(状态) |
| `CUSTOMEER_TYPE_MEASUR_ROOM` | `1` | 量房(状态) |

#### **demand** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `DEMAND_BASIC_DECORATION` | `0` | 基装(状态) |
| `DEMAND_LOCAL_DECORATION` | `2` | 局改装(状态) |
| `DEMAND_OVERALL_DECORATION` | `1` | 整装(状态) |

#### **houseAttr** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `HOUSE_TYPE_ALL_STORE` | `1` | 全翻(状态) |
| `HOUSE_TYPE_APT_STORE` | `2` | 局改(状态) |
| `HOUSE_TYPE_NEW_STORE` | `0` | 清水(状态) |

#### **status** (6 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_APPROVAL_INT` | `2` | 审批 |
| `STATUS_APPROVAL_INT` | `4` | 审批 |
| `STATUS_CONFIRM_INT` | `3` | 确认 |
| `STATUS_INIT_INT` | `0` | 初始(状态) |
| `STATUS_LNVALID_INT` | `1` | 失效(状态) |
| `STATUS_TRAN_INT` | `5` | 转换(状态) |

### customerUserRule

<a name="customer-customeruserrule"></a>

#### **status** (6 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_ADVANCE_INVALID_INT` | `5` | 停止(管理) |
| `STATUS_DEPT_INVALID_INT` | `2` | 停止(部门) |
| `STATUS_DISABLE_INT` | `4` | 失效 |
| `STATUS_ENABLE_INT` | `0` | 启用(状态) |
| `STATUS_REGION_INVALID_INT` | `3` | 停止(分区) |
| `STATUS_USER_INVALID_INT` | `1` | 停止(个人) |

### customerUserRuleItem

<a name="customer-customeruserruleitem"></a>

#### **isDelete** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISDELETE_DELETE_INT` | `0` | 删除 |
| `ISDELETE_UNDELETE_INT` | `1` | 不删除 |

#### **isSurplus** (13 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `` | `1` | 不减 |
| `` | `0` | 减 |
| `` | `0` | 优先级(1) |
| `` | `1` | 优先级(2) |
| `` | `2` | 优先级(3) |
| `` | `3` | 优先级(4) |
| `` | `4` | 优先级(5) |
| `` | `5` | 优先级(6) |
| `` | `6` | 优先级(7) |
| `` | `7` | 优先级(8) |
| `` | `8` | 优先级(8) |
| `` | `1` | 无效(人员规则项) |
| `` | `0` | 有效(人员规则项) |

#### **type** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_AREA_INT` | `0` | 面积 |
| `TYPE_DEPT_INT` | `2` | 部门 |
| `TYPE_DEPT_TYPE_INT` | `3` | 部门类型 |
| `TYPE_OTHER_INT` | `1` | 特殊 |

### droup

<a name="customer-droup"></a>

#### **dType** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_DD_INT` | `1` | 钉钉(类型) |
| `TYPE_VX_INT` | `2` | 微信(类型) |

#### **droupType** (7 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_CUSTOMER_INT` | `0` | 客户(类型) |
| `TYPE_CUSTOMER_INT` | `0` | 客户(类型) |
| `TYPE_ENGINEERING_INT` | `3` | 工程(类型) |
| `TYPE_MATERIAL_INT` | `2` | 主材(类型) |
| `TYPE_MONEY_INT` | `4` | 款项(类型) |
| `TYPE_OTHER_INT` | `5` | 其他(类型) |
| `TYPE_RENOVATION_INT` | `1` | 装修(类型) |

#### **droupTypes** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_APPLICATION_INT` | `2` | 应用(状态) |
| `TYPE_PICTURE_INT` | `1` | 图片(状态) |
| `TYPE_TEEXT_INT` | `0` | 文本(状态) |
| `TYPE_VOICE_INT` | `3` | 语音(状态) |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_EFFECTIVE_INT` | `0` | 有效(状态) |
| `STATUS_INVALID_SHORT` | `1` | 无效(状态) |

#### **type** (1 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_HANDLE_INT` | `1` | 处理(类型) |

### feedback

<a name="customer-feedback"></a>

#### **feedbackStatus** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_FINISH_INT` | `3` | 完成(状态) |
| `STATUS_HANDLE_INT` | `2` | 处理(状态) |
| `STATUS_INITIAL_INT` | `0` | 初始(状态) |
| `STATUS_RECEIVE_INT` | `1` | 接收(状态) |

#### **status** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_COMPLAINT_INT` | `1` | 投诉(类型) |
| `STATUS_FEEDBACK_INT` | `0` | 反馈(类型) |
| `STATUS_REPAIR_INT` | `2` | 维修(类型) |

### feedbackBackVisit

<a name="customer-feedbackbackvisit"></a>

#### **contactFlag** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `CONTACTFLAG_IN_SOLVE_INT` | `1` | 解决过程中(事后有无人员联系您) |
| `CONTACTFLAG_SOLVE_INT` | `0` | 已解决(事后有无人员联系您) |

#### **contactSoonFlag** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `CONTACTSOONFLAG_FORGET_INT` | `2` | 不记得(24h内有无人联系系您) |
| `CONTACTSOONFLAG_NO_INT` | `1` | 否(24h内有无人联系系您) |
| `CONTACTSOONFLAG_YES_INT` | `0` | 是(24h内有无人联系系您) |

#### **openWords** (6 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `OPENWORDS_GIVE_UP_INT` | `5` | 超期放弃回访(开头语) |
| `OPENWORDS_HANDY_INT` | `0` | 方便(开头语) |
| `OPENWORDS_NOT_ACCEPTED_ONE_INT` | `2` | 未接一①次(开头语) |
| `OPENWORDS_NOT_ACCEPTED_THREE_INT` | `4` | 未接一③次(开头语) |
| `OPENWORDS_NOT_ACCEPTED_TWO_INT` | `3` | 未接一②次(开头语) |
| `OPENWORDS_NO_HANDY_INT` | `1` | 不方便/拒绝评价(开头语) |

#### **perforFlag** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `PERFORFLAG_FORGET_INT` | `2` | 不记得(师傅是否按时上门) |
| `PERFORFLAG_NO_INT` | `1` | 否(师傅是否按时上门) |
| `PERFORFLAG_YES_INT` | `0` | 是(师傅是否按时上门) |

#### **pleased** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `PLEASED_BAD` | `3` | 不满意(维修满意度) |
| `PLEASED_GENERAL` | `2` | 一般(维修满意度) |
| `PLEASED_GOOD` | `1` | 满意(维修满意度) |
| `PLEASED_VERY_BAD` | `4` | 非常不满意(维修满意度) |
| `PLEASED_VERY_GOOD` | `0` | 非常满意(维修满意度) |

#### **praiseType** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `PRAISETYPE_PRAISE_ONE_INT` | `0` | 表扬形式①(表扬形式) |
| `PRAISETYPE_PRAISE_TWO_INT` | `1` | 表扬形式②(表扬形式) |

#### **result** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `RESULT_PART_FINISH_INT` | `3` | 部分完工(维修结果) |
| `RESULT_PRAISE_INT` | `4` | 来电表扬(维修结果) |
| `RESULT_REPAIRED_INT` | `0` | 整体待修(维修结果) |
| `RESULT_REVOKE_INT` | `2` | 确认撤销(维修结果) |
| `RESULT_WHOLE_FINISH_INT` | `1` | 整体完工(维修结果) |

#### **resultFlag** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `RESULTFLAG_NO_INT` | `1` | 否(报修是否解决) |
| `RESULTFLAG_YES_INT` | `0` | 是(报修是否解决) |

### feedbackComplaint

<a name="customer-feedbackcomplaint"></a>

#### **results** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `RESULTS_COMPLETE` | `0` | 结案-完成 |
| `RESULTS_LEGAL_AFFAIRS` | `4` | 升级-法务介入处理 |
| `RESULTS_REVOKE` | `1` | 结案-撤销 |
| `RESULTS_SURE` | `3` | 执行中-确定方案(问题闭环) |
| `RESULTS_UNDETERMINED` | `2` | 协商中-方案未确定 |

#### **source** (10 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `SOURCE_400` | `1` | 400电话 |
| `SOURCE_CCA_CB` | `4` | 消协/工商 |
| `SOURCE_ERPAPP` | `5` | ERP小程序 |
| `SOURCE_INTERNAL` | `3` | 内部反馈 |
| `SOURCE_PHONE` | `0` | 平台私聊 |
| `SOURCE_RESEARCH_FOLLOW-UP` | `7` | 调研回访 |
| `SOURCE_TELEVISION_EXPOSURE` | `8` | 电视/电台曝光 |
| `SOURCE_THIRD_PARTY_PLATFORM` | `9` | 第三方平台 |
| `SOURCE_TO_STORE` | `2` | 到店投诉 |
| `SOURCE_VIP` | `6` | VIP服务群 |

#### **upgrade** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `UPGRADE_FALSE_INT` | `2` | 是否升级(状态) |
| `UPGRADE_PLATFORM_INT` | `1` | 是否升级(状态) |
| `UPGRADE_TIMEOUT_INT` | `0` | 是否升级(状态) |

#### **urgency** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `URGENCY_EARLY_WARNING_INT` | `0` | 紧急程度(状态) |
| `URGENCY_ONE_INT` | `1` | 紧急程度(状态) |
| `URGENCY_THREE_INT` | `3` | 紧急程度(状态) |
| `URGENCY_TWO_INT` | `2` | 紧急程度(状态) |

### feedbackComplaintDept

<a name="customer-feedbackcomplaintdept"></a>

#### **firstLevel** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `CONTRACT_TYPE` | `1` | 合同类 |
| `DRAWING_CATEGORY` | `0` | 图纸类 |
| `PAYMENT_CATEGORY` | `3` | 款项类 |
| `SERVICE` | `2` | 服务类 |

#### **problemType** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `DRAWING_DELAY` | `2` | 图纸拖延 |
| `DRAWING_OMISSION` | `1` | 图纸标注错误/遗漏 |
| `ERROR_ADD_DEDUCTION` | `4` | 故意漏项，增项纠纷 |
| `NOT_DRAWING` | `0` | 图纸不满意 |
| `PLAN_NO_LAND` | `3` | 方案无法落地 |

#### **secondary** (6 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `AEC_DIMENSION` | `1` | 标注问题 |
| `EFFECT_ISSUE` | `0` | 效果问题 |
| `LANDING_ISSUES` | `3` | 落地问题 |
| `MISSING_ITEM_ISSUE` | `4` | 漏项问题 |
| `PROCRASTINATION_ISSUE` | `2` | 拖延问题 |
| `PROPORTION_ISSUE` | `5` | 配比问题 |

### feedbackGuarantee

<a name="customer-feedbackguarantee"></a>

#### **cutomerType** (8 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `CUTOMERTYPE_FEE` | `2` | 收费客户 |
| `CUTOMERTYPE_OUTOFWARRANTY` | `1` | 过保客户 |
| `CUTOMERTYPE_RESALE_PROPERTY` | `5` | 二手房主 |
| `CUTOMERTYPE_VERIFY‌` | `4` | 核查确认 |
| `CUTOMERTYPE_WARRANTY_2‌` | `6` | 保修2年 |
| `CUTOMERTYPE_WARRANTY_5` | `7` | 保修5年 |
| `CUTOMERTYPE_‌LIFETIME` | `0` | 终身保修客户 |
| `CUTOMERTYPE_‌RELATION` | `3` | 关系客户 |

#### **repairResult** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `REPAIRRESULT_FOUR` | `3` | 无 |
| `REPAIRRESULT_ONE` | `0` | 待修 |
| `REPAIRRESULT_THREE` | `2` | 撤销 |
| `REPAIRRESULT_TOW` | `1` | 完工 |

#### **source** (15 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `PPCHAT` | `11` | 平台私聊 |
| `PPCHAT` | `1` | 315公众平台 |
| `PPCHAT` | `0` | 无 |
| `SOURCE_315` | `10` | 315 |
| `SOURCE_CB` | `7` | 工商 |
| `SOURCE_CCA` | `8` | 消协 |
| `SOURCE_EMPLOYEE` | `4` | 员工上报 |
| `SOURCE_ERPAPP` | `6` | ERP小程序 |
| `SOURCE_HOME_VISIT‌` | `9` | 上门拜访 |
| `SOURCE_MEDIA_PLATFORM` | `1` | 媒体平台 |
| `SOURCE_PHONE` | `0` | 400电话 |
| `SOURCE_STORE_VISIT` | `2` | 到店来访 |
| `SOURCE_SUPERVISOR` | `3` | 监理上报 |
| `SOURCE_‌CUSTOMER_CALLBACK` | `5` | 客户回访 |
| `THIRD_PARTY_PLATFORM` | `12` | 第三方平台 |

#### **svUserStatus** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `SVUSERSTATUS_NO` | `1` | 否 |
| `SVUSERSTATUS_OTHER` | `2` | 调至 |
| `SVUSERSTATUS_YES` | `0` | 是 |

#### **upgradeSource** (6 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `BlackCat` | `4` | 黑猫 |
| `RABBR` | `5` | 大众点评 |
| `RedBook` | `3` | 小红书 |
| `Tiktok` | `2` | 抖音 |
| `TIMEOUT` | `7` | 超时 |
| `VISTER` | `6` | 上门 |

#### **workType** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `WORKTYPE_ELECTRICITY‌` | `2` | 电工 |
| `WORKTYPE_OIL` | `5` | 油工 |
| `WORKTYPE_TILE` | `3` | 瓦工 |
| `WORKTYPE_TREE` | `4` | 木工 |
| `WORKTYPE_WATER` | `1` | 水工 |

### repair

<a name="customer-repair"></a>

#### **status** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_CLOSE_INT` | `3` | 关闭(状态) |
| `STATUS_FINISHED_INT` | `2` | 完工(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |
| `STATUS_REPAIR_INT` | `1` | 维修(状态) |

#### **type** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_COST_INT` | `2` | 成本(类型) |
| `TYPE_DEDUCTION_INT` | `1` | 扣款(类型) |
| `TYPE_MONEY_INT` | `0` | 款项(类型) |

### revisit

<a name="customer-revisit"></a>

#### **status** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_COMMONLY_INT` | `2` | 一般(状态) |
| `STATUS_COMPLAINT_INT` | `3` | 投诉(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |
| `STATUS_SATISFIED_INT` | `1` | 满意(状态) |

#### **type** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_COMPLAINT_INT` | `1` | 投诉(类型) |
| `TYPE_GUARAANTEE_INT` | `0` | 保修(类型) |

### survey

<a name="customer-survey"></a>

#### **status** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_FINISH_INT` | `3` | 完成(状态) |
| `STATUS_HANDLE_INT` | `2` | 处理(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |
| `STATUS_SEND_INT` | `1` | 推送(状态) |

#### **surveyType** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_DATE_INT` | `4` | 日期 |
| `TYPE_INPUT_INT` | `1` | 输入框(类型) |
| `TYPE_MULTIPLE_INT` | `3` | 多选(类型) |
| `TYPE_SINGLE_INT` | `2` | 单选(类型) |
| `TYPE_TEXT_INT` | `0` | 文本(类型) |

### surveyOption

<a name="customer-surveyoption"></a>

#### **checked** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_SELECT_INT` | `0` | 已选(类型) |
| `TYPE_UNSELECT_INT` | `1` | 未选(类型) |

### vscoreRecord

<a name="customer-vscorerecord"></a>

#### **status** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_ADOPT_INT` | `1` | 通过(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |
| `STATUS_REFUSE_INT` | `2` | 拒绝(状态) |

#### **type** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_EXTRACT_INT` | `1` | 提取(类型) |
| `TYPE_INSERT_INT` | `0` | 新增(类型) |

### vustomer

<a name="customer-vustomer"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_EFFECTIVE_INT` | `0` | 有效(状态) |
| `STATUS_INVALID_INT` | `1` | 无效(状态) |

### vustomerAdvance

<a name="customer-vustomeradvance"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_EFFECTIVE_INT` | `0` | 有效(状态) |
| `STATUS_INVALID_INT` | `1` | 无效(状态) |

### vustomerShared

<a name="customer-vustomershared"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_EFFECTIVE_INT` | `0` | 有效(状态) |
| `STATUS_INVALID_INT` | `1` | 无效(状态) |

## DATA 模块

<a name="data"></a>

### accessoriesType

<a name="data-accessoriestype"></a>

#### **type** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_CLASS_INT` | `0` | 分类 |
| `TYPE_SORT_INT` | `1` | 排序 |

### assistance

<a name="data-assistance"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `1` | 禁用(状态) |
| `STATUS_ENABLE_INT` | `0` | 启用(状态) |

### bankAccount

<a name="data-bankaccount"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `1` | 禁用 |
| `STATUS_ENABLE_INT` | `0` | 启用 |

### brand

<a name="data-brand"></a>

#### **atttype** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `` | `0` | 内销(业务类型) |
| `` | `1` | 外销(业务类型) |
| `` | `0` | 实用量(选材量类型) |
| `` | `1` | 退货量(选材量类型) |

### brandBalance

<a name="data-brandbalance"></a>

#### **ctype** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `CTYPE_BASE_INT` | `0` | 底价(结算类型) |
| `CTYPE_POINT_INT` | `1` | 点位(结算类型) |

### category

<a name="data-category"></a>

#### **isCount** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISCOUNT_STAT_INT` | `0` | 统计 |
| `ISCOUNT_STA_INT` | `1` | 标准 |

#### **isCoupon** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISCOUPON_PRE_INT` | `0` | 优惠 |
| `ISCOUPON_STA_INT` | `1` | 标准 |

#### **isLimit** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISLIMIT_DISABLE_INT` | `1` | 否 |
| `ISLIMIT_ENABLE_INT` | `0` | 是 |

#### **type** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_STAT_INT` | `1` | 统计 |
| `TYPE_STA_INT` | `0` | 标准 |

### color

<a name="data-color"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `1` | 禁用(状态) |
| `STATUS_ENABLE_INT` | `0` | 启用(状态) |

### common

<a name="data-common"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `1` | 禁用(状态) |
| `STATUS_ENABLE_INT` | `0` | 启用(状态) |

### constructionNode

<a name="data-constructionnode"></a>

#### **mark** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `MARK_ONE` | `0` | 无 |
| `MARK_THREE` | `2` | 完工标识 |
| `MARK_TOW` | `1` | 开工标识 |

#### **process** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `PROCESS_FOUNDATION_INT` | `1` | 基础完工(进度) |
| `PROCESS_STANDARD_INT` | `0` | 标准(进度) |

#### **proset** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `PROSET_PROSET_INT` | `1` | 预派 |
| `PROSET_STANDARD_INT` | `0` | 标准 |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `1` | 禁用(状态) |
| `STATUS_ENABLE_INT` | `0` | 启用(状态) |

### constructionPaceNode

<a name="data-constructionpacenode"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `1` | 禁用(状态) |
| `STATUS_ENABLE_INT` | `0` | 启用(状态) |

### contract

<a name="data-contract"></a>

#### **atttype** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ATTTYPE_DECORATION_INT` | `0` | 装修(业务类型) |
| `ATTTYPE_SUPPLIER_INT` | `2` | 厂商(业务类型) |
| `ATTTYPE_SUPPLIER_INT` | `2` | 厂商 |
| `ATTTYPE_USER_INT` | `1` | 人员(业务类型) |

#### **count** (1 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `CONTRACT_COUNT_LIMIT_INT` | `1024` | 合同总数 |

#### **type** (68 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `` | `/views/contract/C-001-D-8-0001.html` | 个人-14天无理由退合同承诺 |
| `` | `/views/contract/C-001-D-6-0001.html` | 个人-免责协议 |
| `` | `/views/contract/C-003-D-0-0004.html` | 个人-半包/整装保密协议 |
| `` | `/views/contract/C-003-D-0-0002.html` | 个人-半包/整装补充协议 |
| `` | `/views/contract/C-003-D-0-0003.html?type=3` | 个人-半包/整装达额减-一笔款 |
| `` | `/views/contract/C-003-D-0-0003.html?type=0` | 个人-半包/整装达额减-三笔款 |
| `` | `/views/contract/C-003-D-0-0003.html?type=2` | 个人-半包/整装达额减-二笔款 |
| `` | `/views/contract/C-003-D-0-0001.html` | 个人-半包/整装预签 |
| `` | `/views/contract/C-001-M-2-0001.html` | 个人-半包主材代购 |
| `` | `/views/contract/C-001-M-2-0004.html` | 个人-半包主材代购(分期) |
| `` | `/views/contract/C-003-M-2-0001.html` | 个人-半包主材代购约束主材 |
| `` | `/views/contract/C-001-D-0-0001.html?type=1` | 个人-半包工程-期房 |
| `` | `/views/contract/C-001-D-0-0001.html?type=0` | 个人-半包工程-现房 |
| `` | `/views/contract/C-001-D-3-0001.html` | 个人-半包服务费 |
| `` | `/views/contract/C-001-D-6-0001.html?type=1` | 个人-售后工程停工协议 |
| `` | `/views/contract/C-001-D-6-0001.html?type=0` | 个人-售后工程延期协议 |
| `` | `/views/contract/C-001-D-3-0002.html` | 个人-团队服务费 |
| `` | `/views/contract/C-002-M-2-0001.html` | 个人-大宅主材代购 |
| `` | `/views/contract/C-002-M-2-0001.html?type=1` | 个人-大宅主材代购两笔款 |
| `` | `/views/contract/C-002-D-0-0001.html?type=0` | 个人-大宅工程 |
| `` | `/views/contract/C-005-D-0-0001.html?type=3` | 个人-局改-一笔款 |
| `` | `/views/contract/C-005-D-0-0001.html?type=0` | 个人-局改-三笔款 |
| `` | `/views/contract/C-005-D-0-0001.html?type=2` | 个人-局改-二笔款 |
| `` | `/views/contract/C-004-D-0-0002.html?type=1` | 个人-整装补充协议 |
| `` | `/views/contract/C-004-D-0-0001.html?type=1` | 个人-整装预签 |
| `` | `/views/contract/C-001-M-2-0001.html?type=1` | 对人-新满减主材代购 |
| `` | `/views/contract/C-001-M-2-0002.html` | 个人-满减主材代购 |
| `` | `/views/contract/C-004-D-0-0002.html?type=4` | 爱林装修工程补充协议 |
| `` | `/views/contract/C-001-D-9-0001.html` | 个人-环保协议合同 |
| `` | `/views/contract/C-001-D-6-0001.html` | 个人-补充协议 |
| `` | `/views/contract/C-001-D-5-0001.html` | 个人-解除协议 |
| `` | `/views/contract/C-001-D-1-0001.html` | 个人-设计费 |
| `` | `/views/contract/C-001-P-0-0001.html?type=1` | 人资合同-派遣 |
| `` | `/views/contract/C-001-P-0-0001.html` | 人资合同-非派遣 |
| `` | `/views/contract/C-001-P-0-0001.html?type=2` | 人资合同-非派遣(有保险) |
| `` | `/views/contract/C-001-F-0-0001.html?type=3` | 厂商合同-基装 |
| `` | `/views/contract/C-001-D-8-0001.html?company=1` | 对公-14天无理由退合同承诺 |
| `` | `/views/contract/C-001-D-6-0001.html?company=1` | 对公-免责协议 |
| `` | `/views/contract/C-003-D-0-0004.html?company=1` | 对公-半包/整装保密协议 |
| `` | `/views/contract/C-003-D-0-0002.html?company=1` | 对公-半包/整装补充协议 |
| `` | `/views/contract/C-003-D-0-0003.html?type=3&company=1` | 对公-半包/整装达额减-一笔款 |
| `` | `/views/contract/C-003-D-0-0003.html?type=0&company=1` | 对公-半包/整装达额减-三笔款 |
| `` | `/views/contract/C-003-D-0-0003.html?type=2&company=1` | 对公-半包/整装达额减-二笔款 |
| `` | `/views/contract/C-003-D-0-0001.html?company=1` | 对公-半包/整装预签 |
| `` | `/views/contract/C-001-M-2-0001.html?company=1` | 对公-半包主材代购 |
| `` | `/views/contract/C-001-M-2-0004.html?company=1` | 对公-半包主材代购(分期) |
| `` | `/views/contract/C-003-M-2-0001.html?company=1` | 对公-半包主材代购约束主材 |
| `` | `/views/contract/C-001-D-0-0001.html?type=1&company=1` | 对公-半包工程-期房 |
| `` | `/views/contract/C-001-D-0-0001.html?type=0&company=1` | 对公-半包工程-现房 |
| `` | `/views/contract/C-001-D-3-0001.html?company=1` | 对公-半包服务费 |
| `` | `/views/contract/C-001-D-6-0001.html?type=1&company=1` | 对公-售后工程停工协议 |
| `` | `/views/contract/C-001-D-6-0001.html?type=0&company=1` | 对公-售后工程延期协议 |
| `` | `/views/contract/C-001-D-3-0002.html?company=1` | 对公-团队服务费 |
| `` | `/views/contract/C-002-M-2-0001.html?company=1` | 对公-大宅主材代购 |
| `` | `/views/contract/C-002-M-2-0001.html?type=1&company=1` | 对公-大宅主材代购两笔款 |
| `` | `/views/contract/C-005-D-0-0001.html?type=3&company=1` | 对公-局改-一笔款 |
| `` | `/views/contract/C-005-D-0-0001.html?type=0&company=1` | 对公-局改-三笔款 |
| `` | `/views/contract/C-005-D-0-0001.html?type=2&company=1` | 对公-局改-二笔款 |
| `` | `/views/contract/C-004-D-0-0002.html?type=1&company=1` | 对公-整装补充协议 |
| `` | `/views/contract/C-004-D-0-0001.html?type=1&company=1` | 对公-整装预签 |
| `` | `/views/contract/C-001-M-2-0001.html?company=1&type=1` | 对公-新满减主材代购 |
| `` | `/views/contract/C-001-M-2-0002.html?company=1` | 对公-满减主材代购 |
| `` | `/views/contract/C-001-D-9-0001.html?company=1` | 对公-环保协议合同 |
| `` | `/views/contract/C-001-D-6-0001.html?company=1` | 对公-补充协议 |
| `` | `/views/contract/C-001-D-5-0001.html?company=1` | 对公-解除协议 |
| `` | `/views/contract/C-001-D-1-0001.html?company=1` | 对公-设计费 |
| `` | `/views/contract/C-001-F-0-0002.html` | 新厂商合同 |
| `` | `/views/contract/C-001-D-7-0001.html` | 签约后交付流程服务 |

### custype

<a name="data-custype"></a>

#### **dgrade** (7 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `` | `A` | A(装修等级) |
| `` | `B` | B(装修等级) |
| `` | `C` | C(装修等级) |
| `` | `A` | A(销售等级) |
| `` | `B` | B(销售等级) |
| `` | `` | ''(销售等级) |
| `` | `C` | C(销售等级) |

#### **platform** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `PLATFORM_ALIPAY_SHORT` | `2` | alipay |
| `PLATFORM_POS_SHORT` | `0` | POS |
| `PLATFORM_WXPAY_SHORT` | `1` | wxpay |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `1` | 禁用 |
| `STATUS_INIT_INT` | `0` | 启用 |

### decorationAtttype

<a name="data-decorationatttype"></a>

#### **type** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_FULLREDUCTION_INT` | `2` | 满减(装修业务) |
| `TYPE_HALFPACK_INT` | `0` | 半包(装修业务) |
| `TYPE_PACKAGE_INT` | `1` | 整装(装修业务) |

### decorationBusitype

<a name="data-decorationbusitype"></a>

#### **isAward** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISAWARD_NO_SHORT` | `0` | 无 |
| `ISAWARD_YES_SHORT` | `1` | 奖励 |

#### **isRefer** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISREFER_NO_SHORT` | `0` | 无 |
| `ISREFER_YES_SHORT` | `1` | 推荐 |

#### **outside** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `OUTSIDE_NO_SHORT` | `0` | 内部 |
| `OUTSIDE_YES_SHORT` | `1` | 三方 |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_ACTIVATE` | `0` | 显示 |
| `STATUS_DISABLE` | `1` | 隐藏 |

#### **type** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_COMMON_INT` | `0` | 通用 |
| `TYPE_ORIGIN_INT` | `1` | 设计 |
| `TYPE_SOURCE_INT` | `2` | 业务 |

### decorationMatching

<a name="data-decorationmatching"></a>

#### **discountType** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `DISCOUNTTYPE_EDIT_INT` | `1` | 可改 |
| `DISCOUNTTYPE_LOW_INT` | `2` | 最低 |
| `DISCOUNTTYPE_ONLY_INT` | `0` | 固定 |

#### **isShow** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISSHOW_HIDE_INT` | `1` | 隐藏(默认显示) |
| `ISSHOW_SHOW_INT` | `0` | 显示(默认显示) |

#### **vision** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `VISION_ACCOUNTS_INT` | `8` | 决算计算(显示) |
| `VISION_FORMFUND_INT` | `4` | 生成款项(显示) |
| `VISION_QUOTECOUNT_INT` | `2` | 报价计算(显示) |
| `VISION_QUOTEDISCOUNT_INT` | `1` | 报价折扣(显示) |

### format

<a name="data-format"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `1` | 禁用(状态) |
| `STATUS_ENABLE_INT` | `0` | 启用(状态) |

### functionArea

<a name="data-functionarea"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `1` | 禁用(状态) |
| `STATUS_ENABLE_INT` | `0` | 启用(状态) |

#### **type** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_COST_INT` | `4` | 成本(类型) |
| `TYPE_IGNORE_INT` | `3` | 不计算(类型) |
| `TYPE_TOTAL_INT` | `2` | 功能区总额(类型) |
| `TYPE_UNACHE_INT` | `5` | 非业绩(类型) |
| `TYPE_WORD_INT` | `1` | 工程量(类型) |

### goods

<a name="data-goods"></a>

#### **isShow** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISSHOW_NO_SHORT` | `1` | 未出 |
| `ISSHOW_YES_SHORT` | `0` | 已出 |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `1` | 禁用(状态) |
| `STATUS_ENABLE_INT` | `0` | 启用(状态) |

#### **type** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_GOODS_INT` | `0` | 商品 |
| `TYPE_SUIT_INT` | `1` | 套餐 |

### goodsKind

<a name="data-goodskind"></a>

#### **level** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `LEVEL_ONE_SHORT` | `1` | 一级 |
| `LEVEL_THREE_SHORT` | `3` | 三级 |
| `LEVEL_TWO_SHORT` | `2` | 二级 |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_SHORT` | `1` | 禁用 |
| `STATUS_ENABLE_SHORT` | `0` | 启用 |

### goodsPool

<a name="data-goodspool"></a>

#### **atttype** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `BASE_SHORT` | `0` | 基装 |
| `WHOLE_SHORT` | `1` | 整装 |

#### **cascade** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `CASCADE_NO_SHORT ` | `2` | 不级联 |
| `CASCADE_YES_SHORT` | `1` | 级联 |
| `CONTROL_NO_SHORT` | `8` | 不控制 |
| `CONTROL_PRICE_SHORT` | `16` | 价格控制 |
| `CONTROL_YES_SHORT` | `4` | 控制 |

#### **type** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_GOODS_SHORT` | `0` | 商品 |
| `TYPE_SETMEAL_SHORT` | `1` | 套餐 |

### goodsRecord

<a name="data-goodsrecord"></a>

#### **type** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_AOODS_SHORT` | `2` | 辅材 |
| `TYPE_GOODS_SHORT` | `0` | 商品 |
| `TYPE_SOODS_SHORT` | `1` | 选材 |

### holiday

<a name="data-holiday"></a>

#### **atttype** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ATTTYPE_COMMON_INT` | `0` | 通用 |
| `ATTTYPE_CONSTRUCTION_INT` | `2` | 工程 |
| `ATTTYPE_DESIGN_INT` | `1` | 设计 |

### inspect

<a name="data-inspect"></a>

#### **atttype** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ATTTYPE_DECORATION_SHORT` | `0` | 装修 |
| `ATTTYPE_MATERIAL_SHORT` | `1` | 主材 |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| ` STATUS_ENABLE_SHORT` | `0` | 启用 |
| `STATUS_DISABLE_SHORT` | `1` | 禁用 |

#### **type** (1 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_WAITING_SHORT` | `0` | 待定 |

### inspectItem

<a name="data-inspectitem"></a>

#### **isRequire** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISREQUIRE_NO_SHORT` | `0` | 不必填 |
| `ISREQUIRE_YES_SHORT` | `1` | 必填 |

#### **type** (1 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_WAITING_SHORT` | `0` | 类型 |

### noods

<a name="data-noods"></a>

#### **calc** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `CALC_COUNT_INT` | `0` | 计算(计算标识) |
| `CALC_NOTCOUNT_INT` | `1` | 不计算(计算标识) |

### normood

<a name="data-normood"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_INVALID_INT` | `1` | 无效 |
| `STATUS_VALID_INT` | `0` | 有效 |

### normrice

<a name="data-normrice"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_INVALID_INT` | `1` | 无效 |
| `STATUS_VALID_INT` | `0` | 有效 |

### paymentType

<a name="data-paymenttype"></a>

#### **atttype** (12 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ATTTYPE_ADVANCE_BASE_INT` | `0-0` | 基础 |
| `ATTTYPE_ADVANCE_OTHER_INT` | `0-1` | 其他 |
| `ATTTYPE_DECORATION_ADDREDUCE_INT` | `1-2` | 增减 |
| `ATTTYPE_DECORATION_BASE_INT` | `1-0` | 基础 |
| `ATTTYPE_DECORATION_CONTRACT_INT` | `1-1` | 合同 |
| `ATTTYPE_DECORATION_OTHER_INT` | `1-3` | 其他 |
| `ATTTYPE_DECORATION_TERMINATION_INT` | `1-4` | 终止 |
| `ATTTYPE_MATERIAL_BASE_INT` | `2-0` | 基础 |
| `ATTTYPE_SALES_BASE_INT` | `3-0` | 基础 |
| `ATTTYPE_SALES_OTHER_INT` | `3-2` | 其他 |
| `ATTTYPE_SALES_REFUND_INT` | `3-1` | 退款 |
| `ATTTYPE_SERVICE_BASE_INT` | `4-0` | 基础 |

#### **bustype** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `BUSTYPE_DECORATION_INT` | `0` | 装修 |
| `BUSTYPE_MATERIAL_INT` | `1` | 主材 |

#### **code** (11 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `CODE_MATERIAL_DISPOIT_INT` | `2+2` | 定金 |
| `CODE_MATERIAL_FULLPAY_INT` | `2+3` | 补款 |
| `CODE_SALESL_COUPON_REF_INT` | `3+6` | 券退款 |
| `CODE_SALESL_DISPOINT_UNREF_INT` | `3+8` | 不可退定金 |
| `CODE_SALESL_DISPOIT_CHG_INT` | `3+-1` | 定金出 |
| `CODE_SALESL_DISPOIT_INT` | `3+2` | 定金 |
| `CODE_SALESL_DISPOIT_REF_INT` | `3+7` | 定金退款 |
| `CODE_SALESL_FULLPAY_CHG_INT` | `3+-2` | 定金转全款 |
| `CODE_SALESL_FULLPAY_INT` | `3+3` | 补款 |
| `CODE_SALESL_FULLPAY_REF_INT` | `3+5` | 补款退款 |
| `CODE_SALESL_REFUND_INT` | `3+4` | 退款 |

#### **paytype** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `PAYTYPE_PAY_INT` | `0` | 收款 |
| `PAYTYPE_UNPAY_INT` | `1` | 出款 |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `1` | 禁用 |
| `STATUS_INIT_INT` | `0` | 启用 |

#### **type** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_ADVANCE_INT` | `0` | 预付款 |
| `TYPE_DECORATION_INT` | `1` | 装修款 |
| `TYPE_MATERIAL_INT` | `2` | 主材款 |
| `TYPE_SALES_INT` | `3` | 销售款 |
| `TYPE_SERVICE_INT` | `4` | 服务款 |

### presignItem

<a name="data-presignitem"></a>

#### **areaCale** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `AREACALE_AREA_INT` | `1` | 面积(面积规则) |
| `AREACALE_NUMBER_INT` | `0` | 数量(面积规则) |

#### **atttype** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ATTTYPE_CURRENT_INT` | `0` | 通用(业务类型) |
| `ATTTYPE_ENGINEERING_INT` | `1` | 工程(业务类型) |
| `ATTTYPE_MATERIAL_INT` | `2` | 主材(业务类型) |

#### **oneType** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ONETYPE_COMMON_INT` | `0` | 标准(一类) |
| `ONETYPE_MATESUB_INT` | `2` | 配减(一类) |
| `ONETYPE_STANDARD_INT` | `1` | 标配(一类) |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `1` | 禁用(状态) |
| `STATUS_ENABLE_INT` | `0` | 启用(状态) |

#### **type** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_ADDTION_INT` | `3` | 赋能(类型) |
| `TYPE_BASICS_INT` | `0` | 功能区(类型) |
| `TYPE_CUSTOM_INT` | `2` | 个性(类型) |
| `TYPE_OPTIONAL_INT` | `1` | 可选配(类型) |

### presignPrice

<a name="data-presignprice"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `1` | (禁用)状态 |
| `STATUS_ENABLE_INT` | `0` | (启用)状态 |

### presignProduce

<a name="data-presignproduce"></a>

#### **manageDiscount** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `MANAGE_DISCOUNT_INT` | `1` | 打折(管理费折扣) |
| `MANAGE_NODISCOUNT_INT` | `0` | 不打折(管理费折扣) |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `1` | 禁用(状态) |
| `STATUS_ENABLE_INT` | `0` | 启用(状态) |

### price

<a name="data-price"></a>

#### **ctype** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `CTYPE_DISABLE_INT` | `1` | 点位(结算类型) |
| `CTYPE_ENABLE_INT` | `0` | 底价(结算类型) |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `1` | 禁用(状态) |
| `STATUS_ENABLE_INT` | `0` | 启用(状态) |

#### **type** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_REGULAR_INT` | `0` | 正价(类型) |
| `TYPE_SPECIAL_INT` | `1` | 特价(类型) |

### quotationItem

<a name="data-quotationitem"></a>

#### **discount** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `DISCOUNT_DISCOUNT_INT` | `1` | 打折(折扣标识) |
| `DISCOUNT_NODISCOUNT_INT` | `0` | 不打折(折扣标识) |

#### **type** (7 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_CMPREH_INT` | `6` | 综合(类型) |
| `TYPE_COMMON_INT` | `0` | 标准(类型) |
| `TYPE_COST_INT` | `1` | 成本(类型) |
| `TYPE_CUSTOM_INT` | `2` | 自定义(类型) |
| `TYPE_HIDE_INT` | `5` | 隐藏(类型) |
| `TYPE_IGNORE_INT` | `3` | 不计总额(类型) |
| `TYPE_UNACHE_INT` | `4` | 非业绩(类型) |

### quotationPrice

<a name="data-quotationprice"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `1` | 禁用(状态) |
| `STATUS_ENABLE_INT` | `0` | 启用(状态) |

### quotationRtem

<a name="data-quotationrtem"></a>

#### **type** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_BRAND_INT` | `4` | 品牌(类型) |
| `TYPE_CMPREH_INT` | `1` | 综合(类型) |
| `TYPE_DOWNGRADE_INT` | `3` | 降级(类型) |
| `TYPE_GENERRAL_INT` | `0` | 普通(类型) |
| `TYPE_UPGRADE_INT` | `2` | 升级(类型) |

### quotationVersion

<a name="data-quotationversion"></a>

#### **defaultFlag** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `DEFAULTFLAG_DEFAULT_INT` | `1` | 默认(默认标识) |
| `DEFAULTFLAG_INIT_INT` | `0` | 非默认(默认标识) |

#### **manageDiscount** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `MANAGE_DISCOUNT_INT` | `1` | 打折(管理费折扣) |
| `MANAGE_NODISCOUNT_INT` | `0` | 不打折(管理费折扣) |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `1` | 禁用(状态) |
| `STATUS_ENABLE_INT` | `0` | 启用(状态) |

#### **taxDiscount** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TAX_DISCOUNT_INT` | `2` | 总额税金(税金折扣) |
| `TAX_NODISCOUNT_INT` | `1` | 管理税金(税金折扣) |
| `TAX_NOTTAXDISCOUNT_INT` | `0` | 无税金(税金折扣) |

#### **trafficDiscount** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TRAFFIC_DISCOUNT_INT` | `1` | 打折(车运费折扣) |
| `TRAFFIC_NODISCOUNT_INT` | `0` | 不打折(车运费折扣) |

#### **type** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_CURRENCY_INT` | `-1` | 通用(类型) |
| `TYPE_HOLONOMY_INT` | `2` | 满减 , 主材配比 , 装修打折( 类型) |
| `TYPE_INCLUSIVE_INT` | `1` | 整装 , 装修+主材单(类型) |
| `TYPE_MIDPACK_INT` | `0` | 半包 , 装修单 , 不包括主材单(类型) |

### receiptType

<a name="data-receipttype"></a>

#### **fund** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `FUND_CAPITAL_SHORT` | `1` | 资金(资金类型) |
| `FUND_STANDARD_SHORT` | `0` | 标准(资金类型) |

#### **grade** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `` | `A` | A |
| `` | `B` | B |
| `` | `C` | C |
| `` | `` | 无 |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `0` | 禁用 |
| `STATUS_ENABLE_INT` | `1` | 启用 |

#### **type** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_BANK_INT` | `3` | 银行 |
| `TYPE_CARD_INT` | `2` | 刷卡 |
| `TYPE_CASH_INT` | `1` | 现金 |
| `TYPE_COUPON_INT` | `5` | 优惠 |
| `TYPE_PUBLIC_INT` | `4` | 对公 |

### remeasureFormat

<a name="data-remeasureformat"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `1` | 禁用 |
| `STATUS_ENABLE_INT` | `0` | 启用 |

#### **type** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_SALES_SHORT` | `1` | 销售 |
| `TYPE_SOODS_SHORT` | `0` | 选材 |

### soods

<a name="data-soods"></a>

#### **type** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `` | `1` | 费用(选材类型) |
| `` | `2` | 辅料 |
| `` | `0` | 通用(选材类型) |

### soodsItem

<a name="data-soodsitem"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `1` | 禁用(状态) |
| `STATUS_ENABLE_INT` | `0` | 启用(状态) |

### surveyTemplate

<a name="data-surveytemplate"></a>

#### **isSend** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISSEND_AUTOMATIC_INT` | `1` | 自动 |
| `ISSEND_HAND_INT` | `0` | 手动 |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `1` | 禁用 |
| `STATUS_ENABLE_INT` | `0` | 启用 |

## DECORATION 模块

<a name="decoration"></a>

### audit

<a name="decoration-audit"></a>

#### **auditStatus** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `AUDITSTATUS_APPROVED` | `已审批` | 已审批 |
| `AUDITSTATUS_UNAPPROVED` | `未审批` | 未审批 |

### audit4record

<a name="decoration-audit4record"></a>

#### **perCharge** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `PERCHARGE_DESIGNER_INT` | `designer` | designer |
| `PERCHARGE_MANAGER_INT` | `manager` | manager |

### auditRecord

<a name="decoration-auditrecord"></a>

#### **status** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_INIT_SHORT` | `0` | 初始(审核状态) |
| `STATUS_NOTINIT_SHORT` | `1` | 确认提交扣款信息(审核状态) |
| `STATUS_PROCESSED_INT` | `2` | 已处理(审核状态) |
| `STATUS_REFUNDED_INT` | `3` | 已退款(审核状态) |

### decoration

<a name="decoration-decoration"></a>

#### **balanceStatus** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `BALANCESTATUS_CONDUCT_INT` | `1` | 结算(装修结算状态) |
| `BALANCESTATUS_INITIA_INT` | `0` | 初始(装修结算状态) |

#### **busitype** (14 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `dbid` | `7` | 业务（类型） |
| `dbid` | `13` | 业务（类型） |
| `dbid` | `3` | 业务（类型） |
| `dbid` | `14` | 业务（类型） |
| `dbid` | `8` | 业务（类型） |
| `dbid` | `6` | 业务（类型） |
| `dbid` | `11` | 业务（类型） |
| `dbid` | `15` | 业务（类型） |
| `dbid` | `5` | 业务（类型） |
| `dbid` | `1` | 业务（类型） |
| `dbid` | `2` | 业务（类型） |
| `dbid` | `12` | 业务（类型） |
| `dbid` | `4` | 业务（类型） |
| `dbid` | `9` | 业务（类型） |

#### **designStatus** (8 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `DESIGNSTATUS_INITIA_INT` | `0` | 初始/待设计(装修设计状态) |
| `DESIGNSTATUS_CONDUCT_INT` | `1` | 设计中(装修设计状态) |
| `DESIGNSTATUS_COMPLETE_PENDING_INT` | `2` | 完成-待确认(装修设计状态) |
| `DESIGNSTATUS_COMPLETE_CONFIRMED_INT` | `3` | 完成-已确认(装修设计状态) |
| `DESIGNSTATUS_MINOR_PENDING_INT` | `4` | 微改-待确认(装修设计状态) |
| `DESIGNSTATUS_MINOR_CONFIRMED_INT` | `5` | 微改-已确认(装修设计状态) |
| `DESIGNSTATUS_MAJOR_PENDING_INT` | `6` | 大改-待确认(装修设计状态) |
| `DESIGNSTATUS_MAJOR_CONFIRMED_INT` | `7` | 大改-已确认(装修设计状态) |

#### **grade** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `GRADE_A_INT` | `A` | A(装修等级) |
| `GRADE_B_INT` | `B` | B(装修等级) |
| `GRADE_C_INT` | `C` | C(装修等级) |

#### **houseClass** (7 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `HOUSECLASS_ATTIC_INT` | `阁楼` | 阁楼(装修房屋类型) |
| `HOUSECLASS_BASEMENT_INT` | `地下室` | 地下室(装修房屋类型) |
| `HOUSECLASS_COMPOUND_INT` | `复式` | 复式(装修房屋类型) |
| `HOUSECLASS_LEVELING_INT` | `平层` | 平层(装修房屋类型) |
| `HOUSECLASS_SECONDHAND_INT` | `二手房` | 二手房(装修房屋类型) |
| `HOUSECLASS_THERMOCLINE_INT` | `跃层` | 跃层(装修房屋类型) |
| `HOUSECLASS_VILLA_INT` | `别墅` | 别墅(装修房屋类型) |

#### **houseType** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `HOUSETYPE_PRESENT_INT` | `现房` | 现房(装修房屋类别) |
| `HOUSETYPE_STAGE_INT` | `期房` | 期房(装修房屋类别) |

#### **repairStatus** (9 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `REPAIRSTATUS_ARREARS_INT` | `4` | 欠款(装修维修状态) |
| `REPAIRSTATUS_BASE_INT` | `6` | 基础2年(装修维修状态) |
| `REPAIRSTATUS_EXONERATION_INT` | `3` | 免责(装修维修状态) |
| `REPAIRSTATUS_HIDE_INT` | `7` | 隐蔽5年(装修维修状态) |
| `REPAIRSTATUS_INITIA_INT` | `0` | 初始(装修维修状态) |
| `REPAIRSTATUS_LIFELONG_INT` | `1` | 终身(装修维修状态) |
| `REPAIRSTATUS_NONE_INT` | `7` | 无保 |
| `REPAIRSTATUS_OVER_INT` | `5` | 过保(装修维修状态) |
| `REPAIRSTATUS_RESELL_INT` | `2` | 转卖(装修维修状态) |

#### **resourceType** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `RESOURCETYPE_AMOUNT_INT` | `1` | 量房(装修资源类型) |
| `RESOURCETYPE_CONSULT_INT` | `0` | 咨询(装修资源类型) |

#### **salesmanType** (13 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `SALESMANTYPE_400_INT` | `400渠道客源` | 400渠道客源(装修业务类型) |
| `SALESMANTYPE_ABOUT_INT` | `约访公司` | 约访公司(装修业务类型) |
| `SALESMANTYPE_COMPANY_INT` | `公司` | 公司(装修业务类型) |
| `SALESMANTYPE_CONSULT_INT` | `咨询` | 咨询(装修业务类型) |
| `SALESMANTYPE_DESIGNER_INT` | `设计师` | 设计师(装修业务类型) |
| `SALESMANTYPE_DOOR_INT` | `上门` | 上门(装修业务类型) |
| `SALESMANTYPE_GUARD_INT` | `守园` | 守园(装修业务类型) |
| `SALESMANTYPE_NETSALES_INT` | `网销公司网络` | 网销公司网络(装修业务类型) |
| `SALESMANTYPE_NONBUSINESS_INT` | `非业务人员` | 非业务人员(装修业务类型) |
| `SALESMANTYPE_ONLINESALES_INT` | `网销自有网络` | 网销自有网络(装修业务类型) |
| `SALESMANTYPE_RESOURCES_INT` | `资源` | 资源(装修业务类型) |
| `SALESMANTYPE_SUPERVISOR_INT` | `监理` | 监理(装修业务类型) |
| `SALESMANTYPE_WORKER_INT` | `工人` | 工人(装修业务类型) |

#### **sourceStatus** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `SOURCESTATUS_CONTRACT_CONFIRMATION_INT` | `1` | 合同方案确认(装修资源状态) |
| `SOURCESTATUS_INITIA_INT` | `0` | 初始(装修资源状态) |
| `SOURCESTATUS_SETTING_OUT_CONFIRMATION_INT` | `2` | 放线方案确认(装修资源状态) |

#### **status** (13 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_COMPLETED_INT` | `8` | 完工(状态) |
| `STATUS_DEPOSIT_INT` | `1` | 定金(状态) |
| `STATUS_FINAL_INT` | `7` | 决算(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |
| `STATUS_PROSIGNAPPROVAL_INT` | `22` | 审批中(状态) |
| `STATUS_PROSIGNTERMINABLE_INT` | `32` | 可终止(状态) |
| `STATUS_PROSIGN_INT` | `2` | 预签(状态) |
| `STATUS_RESIGNED_INT` | `4` | 重签(状态) |
| `STATUS_SIGNEDAPPROVAL_INT` | `23` | 审批中(状态) |
| `STATUS_SIGNEDTERMINABLE_INT` | `33` | 可终止(状态) |
| `STATUS_SIGNED_INT` | `3` | 签约(状态) |
| `STATUS_TERMINATION_INT` | `6` | 终止(状态) |
| `STATUS_WASTE_INT` | `5` | 废单(状态) |

#### **type** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_HOLONOMY_INT` | `2` | 满减 , 主材配比 , 装修打折( 类型) |
| `TYPE_INCLUSIVE_INT` | `1` | 整装 , 装修+主材单(类型) |
| `TYPE_MIDPACK_INT` | `0` | 半包 , 装修单 , 不包括主材单(类型) |

#### **typeness** (13 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPENESS_AMOUNTREACHED_INT` | `5` | 达额减(装修类型) |
| `TYPENESS_FULLREACHED_INT` | `11` | 满额减(装修类型) |
| `TYPENESS_FULLREDUCTION_INT` | `3` | 满减(装修类型) |
| `TYPENESS_HALFPRICE_INT` | `2` | 半价(装修类型) |
| `TYPENESS_MINUSPICKUP_INT` | `4` | 减上捡(装修类型) |
| `TYPENESS_NEWAMOUNTREACHED_INT` | `10` | 新达额减(装修类型) |
| `TYPENESS_NEWFULLREACHED_INT` | `12` | 满额减(装修类型) |
| `TYPENESS_NEWFULLREDUCTION_INT` | `6` | 新满减(装修类型) |
| `TYPENESS_ONLINESALES_INT` | `0` | 半包(装修类型) |
| `TYPENESS_OUTFIT_INT` | `1` | 整装(装修类型) |
| `TYPENESS_PART_INT` | `7` | 局改(装修类型) |
| `TYPENESS_REWHOLE_INT` | `8` | 全翻(装修类型) |
| `TYPENESS_WHOLE_INT` | `9` | 全案(装修类型) |

### decorationActivityItem

<a name="decoration-decorationactivityitem"></a>

#### **isAffirm** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISAFFIRM_CHECKED_INT` | `2` | 二次确认(装修活动是否确认) |
| `ISAFFIRM_CONFIRMED_INT` | `1` | 客户确认(装修活动是否确认) |
| `ISAFFIRM_INITIA_INT` | `0` | 初始(装修活动是否确认) |

#### **isStatus** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISSTATUS_CAL_INT` | `0` | 计入(装修活动库存/业绩/金额) |
| `ISSTATUS_UNCAL_INT` | `1` | 不计入(装修活动库存/业绩/金额) |

#### **stateType** (17 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUSTYPE_APPROVAL_INT` | `4` | 签单特批 |
| `STATUSTYPE_APPROVAL_INT` | `4` | 签单特批 |
| `STATUSTYPE_CUSTOMERL_INT` | `11` | 老带新 |
| `STATUSTYPE_DEPOSIT_INT` | `1` | 定金 |
| `STATUSTYPE_DEPOSIT_INT` | `1` | 定金 |
| `STATUSTYPE_DESING_INT` | `8` | 设计 |
| `STATUSTYPE_DESING_INT` | `8` | 设计 |
| `STATUSTYPE_DRAW_INT` | `3` | 签单抽奖 |
| `STATUSTYPE_DRAW_INT` | `9` | 签单抽奖 |
| `STATUSTYPE_DRAW_INT` | `10` | 活动抽奖 |
| `STATUSTYPE_DRAW_INT` | `3` | 签单抽奖 |
| `STATUSTYPE_FINE_INT` | `12` | 赔偿 |
| `STATUSTYPE_SIGNATURE_INT` | `2` | 签单 |
| `STATUSTYPE_SIGNATURE_INT` | `2` | 签单 |
| `STATUSTYPE_TOSHOP_INT` | `0` | 到店 |
| `STATUSTYPE_TOSHOP_INT` | `0` | 到店 |
| `STATUSTYPE_UPGRADE_INT` | `7` | 升级 |

#### **status** (10 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_CONSUME_INT` | `7` | 补款(装修活动状态) |
| `STATUS_DELIVERY_INT` | `4` | 配送(装修活动状态) |
| `STATUS_DISCOUNT_INT` | `8` | 抵现(装修活动状态) |
| `STATUS_INIT_INT` | `0` | 初始(装修活动状态) |
| `STATUS_PURCHASE_INT` | `9` | 采购(装修活动状态) |
| `STATUS_RECEIVE_INT` | `2` | 已领(装修活动状态) |
| `STATUS_RETREAT_INT` | `3` | 退货(装修活动状态) |
| `STATUS_UNVALID_INT` | `1` | 失效(装修活动状态) |
| `STATUS_UPGRADE_INT` | `6` | 升级(装修活动状态) |
| `STATUS_WAIT_INT` | `5` | 未退(装修活动状态) |

### decorationContract

<a name="decoration-decorationcontract"></a>

#### **status** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_FILELOCAL_INT` | `4` | 归档本地(装修合同状态) |
| `STATUS_FILE_INT` | `3` | 归档(装修合同状态) |
| `STATUS_NULL_INT` | `2` | 失效(装修合同状态) |
| `STATUS_SIGN_INT` | `1` | 已签(装修合同状态) |
| `STATUS_VALID_INT` | `0` | 初始(装修合同状态) |

### decorationPicture

<a name="decoration-decorationpicture"></a>

#### **type** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `` | `(1)` | 甲方委托乙方设计 |
| `` | `(2)` | 甲方自带图纸 |

### decorationUser

<a name="decoration-decorationuser"></a>

#### **isPay** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISSPAY_PAID_INT` | `0` | 无薪(薪资标识) |
| `ISSPAY_UNPAID_INT` | `1` | 有薪(薪资标识) |

#### **isShow** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISSHOW_HIDE_INT` | `1` | 隐藏(显示标识) |
| `ISSHOW_SHOW_INT` | `0` | 显示(显示标识) |

### decorationbelong

<a name="decoration-decorationbelong"></a>

#### **defaultFlag** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `DEFAULTFLAG_NO_INT` | `0` | 非归属 |
| `DEFAULTFLAG_YES_INT` | `1` | 归属 |

### measure

<a name="decoration-measure"></a>

#### **status** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_APPLICATION_INT` | `1` | 申请量尺(状态) |
| `STATUS_FAIL_INT` | `3` | 失败量尺(状态) |
| `STATUS_QUEUE_INT` | `0` | 排队(状态) |
| `STATUS_SUCCESS_INT` | `2` | 成功量尺(状态) |

## INFORMATION 模块

<a name="information"></a>

### activity

<a name="information-activity"></a>

#### **atttype** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_OFFLINE_INT` | `0` | 线下(类型) |
| `TYPE_ONLINE_INT` | `1` | 线上(类型) |

#### **defaults** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `DEFAULTS_COMMON_INT` | `1` | 标准(默认标识) |
| `DEFAULTS_DEFAULT_INT` | `0` | 默认(默认标识) |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_UNVALID_INT` | `1` | 失效(状态) |
| `STATUS_VALID_INT` | `0` | 有效(状态) |

#### **type** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_DECORATION_INT` | `1` | 装修(类型) |
| `TYPE_MATERIAL_INT` | `2` | 主材(类型) |
| `TYPE_SALES_INT` | `3` | 销售(类型) |

### activityItem

<a name="information-activityitem"></a>

#### **storeroom** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STOREROOM_DECORATION_INT` | `1` | 装修(库房) |
| `STOREROOM_MATERIAL_INT` | `2` | 主材(库房) |
| `STOREROOM_NONE_INT` | `0` | 无(库房) |
| `STOREROOM_SALES_INT` | `3` | 销售(库房) |

#### **type** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_COUPON_INT` | `0` | 券(类型) |
| `TYPE_REDPACKAGE_INT` | `2` | 红包(类型) |
| `TYPE_THING_INT` | `1` | 物品(类型) |

### awardPurchase

<a name="information-awardpurchase"></a>

#### **status** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_CLOSE_INT` | `3` | 结算(状态) |
| `STATUS_DISALE_INT` | `4` | 撤销(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |
| `STATUS_PROC_INT` | `1` | 采购(状态) |
| `STATUS_WARE_INT` | `2` | 入库(状态) |

### awardRecord

<a name="information-awardrecord"></a>

#### **onetype** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ONETYPE_DECORATION_INT` | `1` | 装修(一类) |
| `ONETYPE_MATERIAL_INT` | `3` | 主材(一类) |
| `ONETYPE_NOT_INT` | `0` | 无(一类) |
| `ONETYPE_SALES_INT` | `2` | 销售(一类) |

#### **subtype** (16 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `SUBTYPE_COMPANY_INT` | `10` | 公司回库(子类) |
| `SUBTYPE_CROSSACCOUNT_INT` | `17` | 跨帐(子类) |
| `SUBTYPE_DELIVERY_INT` | `7` | 配送(子类) |
| `SUBTYPE_GIVE_INT` | `14` | 厂家赠送(子类) |
| `SUBTYPE_INWARE_INT` | `0` | 入库(子类) |
| `SUBTYPE_LOSSES_INT` | `3` | 盘亏(子类) |
| `SUBTYPE_LOSS_INT` | `9` | 赔偿(子类) |
| `SUBTYPE_MARKETING_INT` | `15` | 营销(子类) |
| `SUBTYPE_PURCHASES_INT` | `11` | 自购(子类) |
| `SUBTYPE_PURCHASE_INT` | `8` | 采购(子类) |
| `SUBTYPE_RECEIVE_INT` | `5` | 领取(子类) |
| `SUBTYPE_REFUND_INT` | `6` | 退货(子类) |
| `SUBTYPE_REMAINDER_INT` | `12` | 剩余回库(子类) |
| `SUBTYPE_SURPLUS_INT` | `2` | 盘盈(子类) |
| `SUBTYPE_WELFARE_INT` | `13` | 福利(子类) |
| `SUBTYPE_XG_INT` | `1` | 出库(子类) |

#### **type** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_CG_INT` | `0` | 入库(类型) |
| `TYPE_LOSSES_INT` | `3` | 盘亏(类型) |
| `TYPE_SURPLUS_INT` | `2` | 盘盈(类型) |
| `TYPE_XG_INT` | `1` | 出库(类型) |

### awardStock

<a name="information-awardstock"></a>

#### **isPayment** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISPAYMENT_CAL_INT` | `0` | 计入金额(是否计入金额) |
| `ISPAYMENT_NCAL_INT` | `1` | 不计入金额(是否计入金额) |

#### **isPrefor** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISPREFOR_CAL_INT` | `0` | 计算(是否计算业绩) |
| `ISPREFOR_NCAL_INT` | `1` | 不计算(是否计算业绩) |

#### **isStock** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISSTOCK_CAL_INT` | `0` | 计算(是否计算库存) |
| `ISSTOCK_NCAL_INT` | `1` | 不计算(是否计算库存) |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_ABLE_SHORT` | `0` | 启用(状态) |
| `STATUS_DISABLE_SHORT` | `1` | 禁用(状态) |

#### **storeroom** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `` | `0` | 无(库房) |
| `STOREROOM_DECORATION_INT` | `1` | 装修(库房) |
| `STOREROOM_MATERIAL_INT` | `2` | 主材(库房) |
| `STOREROOM_SALES_INT` | `3` | 销售(库房) |

#### **subtype** (9 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `SUBTYPE_ARTICLES_INT` | `3` | 日用品(子类) |
| `SUBTYPE_BEDARTICLE_INT` | `0` | 床上用品(子类) |
| `SUBTYPE_CASHASSETS_INT` | `4` | 现金资产(子类) |
| `SUBTYPE_ELECTRICAPPLIANCE_INT` | `1` | 电器(子类) |
| `SUBTYPE_FOOD_INT` | `5` | 食品(子类) |
| `SUBTYPE_KITCHENWARE_INT` | `2` | 厨具(子类) |
| `SUBTYPE_OTHER_INT` | `8` | 其他(子类) |
| `SUBTYPE_SANITARYWARE_INT` | `6` | 洁具(子类) |
| `SUBTYPE_TOOL_INT` | `7` | 工具(子类) |

#### **type** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_COUPON_INT` | `0` | 券(类型) |
| `TYPE_REDPACK_INT` | `2` | 红包(类型) |
| `TYPE_THING_INT` | `1` | 物品(类型) |

### message

<a name="information-message"></a>

#### **status** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_NOTISSUED_INT` | `2` | 未发(状态) |
| `STATUS_READED_INT` | `1` | 已读(状态) |
| `STATUS_UNREAD_INT` | `0` | 未读(状态) |

#### **type** (6 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `` | `4` | 个人消息(类型) |
| `TYPE_PAYMENT_INT` | `0` | 款项消息(类型) |
| `TYPE_SEND_APPROVAL_INT` | `1` | 审批消息(类型) |
| `TYPE_SEND_BLONG_INT` | `2` | 归属消息(类型) |
| `TYPE_SEND_CONSTRUCTION_INT` | `3` | 工程消息(类型) |
| `TYPE_SEND_VISIT_INT` | `5` | 回访消息(类型) |

### notice

<a name="information-notice"></a>

#### **exPublic** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `EXPUBLIC_HIDE_INT` | `1` | 隐藏(过期公开) |
| `EXPUBLIC_OPEN_INT` | `0` | 公开(过期公开) |

#### **isPublic** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISPUBLIC_DEPARTMENTOPEN_INT` | `1` | 部门公开(公开标识) |
| `ISPUBLIC_OPEN_INT` | `0` | 公开(公开标识) |

#### **priority** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `PRIORITY_IMPORTANT_INT` | `1` | 重要(优先级) |
| `PRIORITY_ORDINARY_INT` | `0` | 标准(优先级) |
| `PRIORITY_URGENT_INT` | `2` | 紧急(优先级) |

#### **type** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_ACTIVITY_INT` | `2` | 活动(类型) |
| `TYPE_NOTICE_INT` | `1` | 通知(类型) |

### phoneCall

<a name="information-phonecall"></a>

#### **recordType** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `RECORDTYPE_FAIL_INT` | `3` | 失败(录音类型) |
| `RECORDTYPE_INIT_INT` | `0` | 初始(录音类型) |
| `RECORDTYPE_LOCAL_INT` | `1` | 本地(录音类型) |
| `RECORDTYPE_ONLINE_INT` | `2` | 线上(录音类型) |

#### **stopReason** (14 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STOPREASON_BUSY_INT` | `14` | 被叫正忙(挂断原因) |
| `STOPREASON_CALLED_INT` | `2` | 被叫挂断(挂断原因) |
| `STOPREASON_CALLER_INT` | `1` | 主叫挂断(挂断原因) |
| `STOPREASON_CALL_INT` | `3` | 呼叫不可及(挂断原因) |
| `STOPREASON_ERROR_INT` | `11` | 呼叫失败，系统错误(挂断原因) |
| `STOPREASON_INSUFFICIENT_INT` | `10` | 余额不足(挂断原因) |
| `STOPREASON_MAXIMUM_INT` | `16` | 呼叫超过最大呼叫时间(挂断原因) |
| `STOPREASON_MISSED_INT` | `5` | 超时未接(挂断原因) |
| `STOPREASON_NETWORK_INT` | `7` | 网络问题(挂断原因) |
| `STOPREASON_NOANSWER_INT` | `13` | 被叫无人接听(挂断原因) |
| `STOPREASON_NOTONLINE_INT` | `15` | 被叫不在线(挂断原因) |
| `STOPREASON_OVERTIME_INT` | `6` | 拒接或超时(挂断原因) |
| `STOPREASON_REFUSE_INT` | `12` | 被叫拒接(挂断原因) |
| `STOPREASON_REQUEST_INT` | `9` | API请求挂断(挂断原因) |

### plan

<a name="information-plan"></a>

#### **status** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_CANCEL_INT` | `1` | 取消(状态) |
| `STATUS_FAIL_INT` | `3` | 失败(状态) |
| `STATUS_IMME_INT` | `4` | 执行(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |
| `STATUS_SUCCESS_INT` | `2` | 成功(状态) |

### vpayment

<a name="information-vpayment"></a>

#### **banks** (45 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `` | `XY` | 兴业银行(开户行) |
| `` | `JH1` | 建行1(开户行) |
| `` | `JH2` | 建行2(开户行) |
| `` | `JH3` | 建行3(开户行) |
| `` | `JH4` | 建行4(开户行) |
| `` | `JH5` | 建行5(开户行) |
| `` | `A` | 方林家居A(开户行) |
| `` | `B` | 方林建材B(开户行) |
| `` | `C` | 方林建材C(开户行) |
| `` | `SB` | 随付贷(开户行) |
| `` | `主材券` | 主材券(优惠券) |
| `` | `内部转账` | 内部转账(优惠券) |
| `` | `建行95折` | 建行95折(优惠券) |
| `` | `随付贷券` | 随付贷券(优惠券) |
| `` | `505654139305661670346998396` | B1(pos) |
| `` | `516134917328247684203866752` | B10(pos) |
| `` | `244587511315241181238065840` | B11(pos) |
| `` | `291345804030124664729072237` | B12(pos) |
| `` | `241682539494451135905249159` | B13(pos) |
| `` | `500717628411515178384167373` | B14(pos) |
| `` | `615350182265807364562976540` | B15(pos) |
| `` | `982435468219301513927325843` | B16(pos) |
| `` | `545801868542045256217953264` | B2(pos) |
| `` | `044754134409599470726475422` | B3(pos) |
| `` | `664507313572041681824039180` | B4(pos) |
| `` | `401295583720578147957624328` | B5(pos) |
| `` | `581797589997320463926416466` | B6(pos) |
| `` | `445625935879089551763080081` | B7(pos) |
| `` | `034377001809832417085011014` | B8(pos) |
| `` | `248128441422829612903222869` | B9(pos) |
| `` | `610374301078369508713943120` | C1(pos) |
| `` | `931273395907877826622007736` | C10(pos) |
| `` | `969887858269295010730922933` | C11(pos) |
| `` | `261488689762210256537560504` | C2(pos) |
| `` | `008330725853194089652000853` | C3(pos) |
| `` | `760472995551349086735533582` | C4(pos) |
| `` | `851604725087443974738577288` | C5(pos) |
| `` | `262349009254755874816165968` | C6(pos) |
| `` | `067493917188690632095081513` | C7(pos) |
| `` | `569593596188246968556298813` | C8(pos) |
| `` | `087210328410778638708486351` | C9(pos) |
| `` | `acquire` | 刷卡(支付方式) |
| `` | `wxpay` | 微信(支付方式) |
| `` | `alipay` | 支付宝(支付方式) |
| `` | `0` | 现金(类型) |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_INIT_INT` | `0` | 未付款(状态) |
| `STATUS_PAYED_INT` | `1` | 已付款(状态) |

#### **type** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_PRINCIPALDEPOSIT_INT` | `3` | 主材定金(类型) |
| `TYPE_PRINCIPAL_INT` | `2` | 主材款(类型) |
| `TYPE_RENOVATIONDEPOSIT_INT` | `1` | 装修定金(类型) |
| `TYPE_RENOVATION_INT` | `0` | 装修款(类型) |

### vprize

<a name="information-vprize"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_INIT_INT` | `0` | 有效(状态) |
| `STATUS_INVALID_INT` | `1` | 无效(状态) |

### vticket

<a name="information-vticket"></a>

#### **iscome** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISCOME_NO_INT` | `1` | 已到场(是否到场) |
| `ISCOME_NO_INT` | `0` | 未到场(是否到场) |

#### **isregist** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISREGIST_NO_INT` | `0` | 未注册(是否注册) |
| `ISREGIST_YES_INT` | `1` | 已注册(是否注册) |

### worksheet

<a name="information-worksheet"></a>

#### **status** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_CANCEL_INT` | `1` | 取消(状态) |
| `STATUS_FINISH_INT` | `3` | 完成(状态) |
| `STATUS_HANDL_INT` | `2` | 已处理(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |

## INVENTORY 模块

<a name="inventory"></a>

### accessories

<a name="inventory-accessories"></a>

#### **status** (8 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_ADVANCE_INT` | `1` | 预出(状态) |
| `STATUS_AUDIT_INT` | `7` | 审核(状态) |
| `STATUS_BATCHOUT_INT` | `2` | 出货(状态) |
| `STATUS_DELIVER_INT` | `6` | 到货(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |
| `STATUS_REJECT_INT` | `3` | 撤销(状态) |
| `STATUS_RETURN_INT` | `5` | 退回(状态) |
| `STATUS_UNDO_INT` | `4` | 拒绝(状态) |

#### **type** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_COMMON_INT` | `0` | 普通(类型) |
| `TYPE_POST_INT` | `1` | 售后(类型) |

### manifest

<a name="inventory-manifest"></a>

#### **type** (1 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_AS_INT` | `7` | 辅料出库 |

### occessories

<a name="inventory-occessories"></a>

#### **isAttic** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISATTIC_NO_INT` | `1` | 无(有无阁楼) |
| `ISATTIC_YES_INT` | `0` | 有(有无阁楼) |

#### **isEnter** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISENTER_NO_INT` | `1` | 不(可进园区) |
| `ISENTER_YES_INT` | `0` | 可(可进园区) |

#### **isExceed** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISEXCEED_NO_INT` | `1` | 无(有无超阶) |
| `ISEXCEED_YES_INT` | `0` | 有(有无超阶) |

#### **isLift** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISLIFT_NO_INT` | `1` | 无(有无电梯) |
| `ISLIFT_YES_INT` | `0` | 有(有无电梯) |

#### **status** (6 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_BALANCE_INT` | `4` | 状态(结算) |
| `STATUS_BIND_INT` | `1` | 状态(分配) |
| `STATUS_DELIVE_INT` | `2` | 状态(送货) |
| `STATUS_FINISH_INT` | `5` | 状态(完成) |
| `STATUS_INIT_INT` | `0` | 状态(初始) |
| `STATUS_RECEIVE_INT` | `3` | 状态(到货) |

### occessoriesCost

<a name="inventory-occessoriescost"></a>

#### **type** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_CARRY_INT` | `1` | 类型(搬运费) |
| `TYPE_CAR_INT` | `0` | 类型(车运费) |
| `TYPE_UP_INT` | `2` | 类型(上楼费) |

### storehouse

<a name="inventory-storehouse"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `1` | 禁用(状态) |
| `STATUS_ENABLE_INT` | `0` | 启用(状态) |

## OUTBOUND 模块

<a name="outbound"></a>

### outbound

<a name="outbound-outbound"></a>

#### **1001** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_INIT_INT` | `outbound` | 外呼 |
| `STATUS_INIT_INT` | `outbound` | 外呼 |
| `STATUS_INIT_INT` | `outbound` | 外呼 |

## PAYMENT 模块

<a name="payment"></a>

### activityPayment

<a name="payment-activitypayment"></a>

#### **activityCouponType** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ACTIVITYCOUPON_INTERNALTRANSFER_STRING` | `内部转账` | 内部转账 |
| `ACTIVITYCOUPON_MATERIAL_STRING` | `2019主材券` | 2019主材券 |
| `ACTIVITYCOUPON_SUIFUDAI_STRING` | `随付贷券` | 随付贷券 |

#### **paymentType** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `PAYMENTTYPE_DECORATIONPAYMENT_DEPOSIT_INT` | `1` | 装修定金 |
| `PAYMENTTYPE_DECORATIONPAYMENT_INT` | `0` | 装修款 |
| `PAYMENTTYPE_MATERIALPAYMENT_DEPOSIT_INT` | `3` | 主材定金 |
| `PAYMENTTYPE_MATERIALPAYMENT_INT` | `2` | 主材款 |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_COLLECT_INT` | `1` | 已付款(状态) |
| `STATUS_INIT_INT` | `0` | 未付款(状态) |

#### **ways** (1 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `WAYS_CASH_INT` | `0` | 现金 |

### advancePayment

<a name="payment-advancepayment"></a>

#### **paymentType** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `PAYMENTTYPE_BALANCE_INT` | `0` | 合同预付款(款项类型) |
| `PAYMENTTYPE_MATERIAL_INT` | `2` | 主材预付款(款项类型) |
| `PAYMENTTYPE_PROJECT_INT` | `1` | 工程预付款(款项类型) |
| `PAYMENTTYPE_ZATERIAL_INT` | `3` | 正林预付款(款项类型) |

#### **type** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_COLLECTION_INT` | `1` | 收款(类型) |
| `TYPE_EXTRACT_INT` | `0` | 提现(类型) |
| `TYPE_PAYED_INT` | `2` | 付款(类型) |
| `TYPE_REFUND_INT` | `3` | 退款(类型) |

### decorationPayment

<a name="payment-decorationpayment"></a>

#### **isAffirm** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISAFFIRM_CONFIRM_SHORT` | `1` | 已确认 |
| `ISAFFIRM_INIT_SHORT` | `0` | 未确认 |

#### **onetype** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ONETYPE_ADD_INT` | `0` | 收款(一类) |
| `ONETYPE_HISTORY_INT` | `2` | 历史(一类) |
| `ONETYPE_REFUND_INT` | `1` | 退款(一类) |

#### **paymentStatus** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `PAYMENTSTATUS_APPLYING_INT` | `3` | 审批中 |
| `PAYMENTSTATUS_CONFIRM_INT` | `2` | 已确认 |
| `PAYMENTSTATUS_HISTORY_INT` | `4` | 历史 |
| `PAYMENTSTATUS_PAY_INT` | `1` | 已付款 |
| `PAYMENTSTATUS_UNPAY_INT` | `0` | 未付款 |

#### **twotype** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TWOTYPE_ADD_REDUCE_INT` | `2` | 增减(二类) |
| `TWOTYPE_BASE_INT` | `0` | 基础(二类) |
| `TWOTYPE_DEAL_INT` | `1` | 合同(二类) |
| `TWOTYPE_OTHER_INT` | `3` | 其他(二类) |

### materialPayment

<a name="payment-materialpayment"></a>

#### **advanceType** (1 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ADVANCETYPE_MATERIAL_INT` | `1` | 主材(预付款类型) |

#### **paymentType** (8 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `PAYMENTTYPE_TYPE_ADVANCE_INT` | `1` | 预付款(款项类型) |
| `PAYMENTTYPE_TYPE_COUPON_REFUND_INT` | `6` | 券退款(款项类型) |
| `PAYMENTTYPE_TYPE_DEPOSIT_INT` | `2` | 定金(款项类型) |
| `PAYMENTTYPE_TYPE_DEPOSIT_NOTREFUND_INT` | `8` | 不可退定金(款项类型) |
| `PAYMENTTYPE_TYPE_DEPOSIT_REFUND_INT` | `7` | 定金退款(款项类型) |
| `PAYMENTTYPE_TYPE_FULL_INT` | `3` | 补款(款项类型) |
| `PAYMENTTYPE_TYPE_FULL_REFUND_INT` | `5` | 补款退款(款项类型) |
| `PAYMENTTYPE_TYPE_REJECT_INT` | `4` | 退款(款项类型) |

#### **status** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_COLLECT_INT` | `1` | 已付款(状态) |
| `STATUS_CONFIRM_INT` | `2` | 已确认(状态) |
| `STATUS_INIT_INT` | `0` | 未付款(状态) |

### oalesPayment

<a name="payment-oalespayment"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_COLLECT_INT` | `1` | 已付款(状态) |
| `STATUS_INIT_INT` | `0` | 未付款(状态) |

#### **type** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_PAYMENT_INT` | `0` | 收款(类型) |
| `TYPE_REFUNDS_INT` | `1` | 退款(类型) |

#### **ways** (1 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `WAYS_CASH_INT` | `0` | 现金 |

### payment

<a name="payment-payment"></a>

#### **status** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_CANCELED_INT` | `3` | 已撤销(状态) |
| `STATUS_CONFIRMED_INT` | `2` | 已确认(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |
| `STATUS_PAID_INT` | `1` | 已付款(状态) |

### paymentContract

<a name="payment-paymentcontract"></a>

#### **status** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_FILE_INT` | `3` | 归档 |
| `STATUS_FILE_LOCAL_INT` | `4` | 归档(本地) |
| `STATUS_NULL_INT` | `2` | 失效 |
| `STATUS_SIGN_INT` | `1` | 已签 |
| `STATUS_VALID_INT` | `0` | 初始 |

### paymentFunction

<a name="payment-paymentfunction"></a>

#### **type** (8 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_API_INT` | `1` | api |
| `TYPE_CONDITION_INT` | `2` | 条件 |
| `TYPE_FIELD_INT` | `3` | 字段 |
| `TYPE_FUNCTION_INT` | `4` | 功能 |
| `TYPE_NODE_INT` | `5` | 节点 |
| `TYPE_PAYTYPE_INT` | `7` | 支付方式 |
| `TYPE_STATUS_INT` | `6` | 状态 |
| `TYPE_TYPE_INT` | `0` | 类型 |

### paytran

<a name="payment-paytran"></a>

#### **atttype** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ATTTYPE_DECORATION_INT` | `0` | 装修 |
| `ATTTYPE_MATERIAL_INT` | `1` | 主材 |

#### **status** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_FAIL_INT` | `2` | 失败 |
| `STATUS_INIT_INT` | `0` | 初始 |
| `STATUS_INVALID_INT` | `3` | 失效 |
| `STATUS_SUCCESS_INT` | `1` | 成功 |
| `STATUS_USED_INT` | `4` | 已用 |

### proxyPayment

<a name="payment-proxypayment"></a>

#### **isexpire** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISEXPIRE_DISABLED_INT` | `1` | 过期 |
| `ISEXPIRE_INIT_INT` | `0` | 有效 |

#### **status** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_CANCEL_INT` | `3` | 已取消 |
| `STATUS_CONFIRM_INT` | `2` | 已确认 |
| `STATUS_INIT_INT` | `0` | 初始 |
| `STATUS_PAY_INT` | `1` | 已付款 |

#### **type** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_COLLECT_INT` | `0` | 收款 |
| `TYPE_REFUND_INT` | `1` | 退款 |

### receipt

<a name="payment-receipt"></a>

#### **paymentType** (8 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `PAYMENTTYPE_ACTIVITY_INT` | `5` | 活动款 |
| `PAYMENTTYPE_ADVANCE_INT` | `0` | 预付款 |
| `PAYMENTTYPE_DECORATION_INT` | `1` | 装修款 |
| `PAYMENTTYPE_MATERIAL_INT` | `2` | 主材款 |
| `PAYMENTTYPE_PAYTRAN_INT` | `6` | 转换款 |
| `PAYMENTTYPE_PROXY_INT` | `7` | 代付款 |
| `PAYMENTTYPE_SALES_INT` | `3` | 销售款 |
| `PAYMENTTYPE_SERVICE_INT` | `4` | 服务款 |

### receiptType

<a name="payment-receipttype"></a>

#### **posway** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `RECEIPTTYPE_ALIPAY_STRING` | `2` | 支付宝 |
| `RECEIPTTYPE_CARD_STRING` | `0` | 刷卡 |
| `RECEIPTTYPE_WECHAT_STRING` | `1` | 微信 |

#### **receiptType** (7 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `RECEIPTTYPE_ACCOUNTS_INT` | `4` | 分期 |
| `RECEIPTTYPE_ADVANCE_INT` | `6` | 预付 |
| `RECEIPTTYPE_BANK_INT` | `1` | 银行 |
| `RECEIPTTYPE_CASH_INT` | `0` | 现金 |
| `RECEIPTTYPE_CHECKV_INT` | `2` | 转账 |
| `RECEIPTTYPE_COUPON_INT` | `5` | 优惠券 |
| `RECEIPTTYPE_INSTALLMENT_INT` | `3` | 对公 |

### salesPayment

<a name="payment-salespayment"></a>

#### **advanceType** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ADVANCETYPE_BALANCE_INT` | `1` | 合同(预付款类型) |
| `ADVANCETYPE_MATERIALBALANCE_INT` | `3` | 主材(预付款类型) |
| `ADVANCETYPE_PROJECTBALANCE_INT` | `2` | 工程(预付款类型) |
| `ADVANCETYPE_ZHENGLINBALANCE_INT` | `4` | 正林(预付款类型) |

#### **status** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_COLLECT_INT` | `1` | 已付款(状态) |
| `STATUS_CONFIRM_INT` | `2` | 已确认(状态) |
| `STATUS_INIT_INT` | `0` | 未付款(状态) |

### salespayment

<a name="payment-salespayment"></a>

#### **type** (8 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `SALESPAYMENTTYPE_TYPE_ADVANCE_INT` | `1` | 预付款(销售款项类型) |
| `SALESPAYMENTTYPE_TYPE_DEPOSITREFUND_INT` | `7` | 定金退款(销售款项类型) |
| `SALESPAYMENTTYPE_TYPE_DEPOSIT_INT` | `2` | 定金(销售款项类型) |
| `SALESPAYMENTTYPE_TYPE_MAKEAREFUND_INT` | `5` | 补款退款(销售款项类型) |
| `SALESPAYMENTTYPE_TYPE_NOTDEPOSITREFUND_INT` | `8` | 不可退定金(销售款项类型) |
| `SALESPAYMENTTYPE_TYPE_REFUNDS_INT` | `4` | 退款(销售款项类型) |
| `SALESPAYMENTTYPE_TYPE_REPLENISHMENT_INT` | `3` | 补款(销售款项类型) |
| `SALESPAYMENTTYPE_TYPE_VOUCHERREFUND_INT` | `6` | 券退款(销售款项类型) |

### servicePayment

<a name="payment-servicepayment"></a>

#### **status** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_COLLECT_INT` | `1` | 已付款(状态) |
| `STATUS_CONFIRM_INT` | `2` | 已确认(状态) |
| `STATUS_INIT_INT` | `0` | 未付款(状态) |

#### **type** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_COLLECT_INT` | `0` | 收款 |
| `TYPE_REFUND_INT` | `1` | 退款 |

### statement

<a name="payment-statement"></a>

#### **status** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `` | `0` | 状态 |
| `` | `1` | 状态 |
| `` | `1` | 类型 |
| `` | `0` | 类型 |

### wallet

<a name="payment-wallet"></a>

#### **status** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_BIND_INT` | `1` | 绑定 |
| `STATUS_CLOSE_INT` | `3` | 注销 |
| `STATUS_FROZEN_INT` | `2` | 冻结 |
| `STATUS_INIT_INT` | `0` | 初始 |

#### **type** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_COMPANY_INT` | `0` | 公司 |
| `TYPE_SUPPLIER_INT` | `1` | 厂商 |
| `TYPE_USER_INT` | `2` | 员工 |

### walletard

<a name="payment-walletard"></a>

#### **status** (6 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_ABLE_INT` | `1` | 有效 |
| `STATUS_DISABLED_INT` | `2` | 失效 |
| `STATUS_INIT_INT` | `0` | 初始 |
| `STATUS_REGISTER_INT` | `4` | 已登记 |
| `STATUS_SIGNINGFAILED_INT` | `3` | 签约失败 |
| `STATUS_UNBIND_INT` | `5` | 解绑 |

#### **type** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_CREDIT_INT` | `1` | 贷记 |
| `TYPE_DEBIT_INT` | `0` | 借记 |

### walletran

<a name="payment-walletran"></a>

#### **status** (1 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_INIT_INT` | `0` | 初始 |

#### **type** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_CONSUME_INT` | `2` | 消费 |
| `TYPE_RECHARGE_INT` | `0` | 充值 |
| `TYPE_REFUND_INT` | `4` | 退款 |
| `TYPE_TRANSFER_INT` | `3` | 转账 |
| `TYPE_WITHDRAW_INT` | `1` | 提现 |

### walletres

<a name="payment-walletres"></a>

#### **type** (14 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_ACCOUNTLICENCE_INT` | `37` | 开户许可证 |
| `TYPE_ACQUIRERBUSINESS_INT` | `38` | 收单业务商户协议 |
| `TYPE_AUTHORIZATION_INT` | `32` | 授权书 |
| `TYPE_BANKCARD_FRONT_INT` | `35` | 结算银行卡正面照 |
| `TYPE_BANKCARD_REVERSE_INT` | `36` | 结算银行卡反面照 |
| `TYPE_BUSINESSLICENSE_INT` | `19` | 营业执照 |
| `TYPE_DOORHEAD_INT` | `34` | 门头照 |
| `TYPE_HAND_IDENTITY_FACE_INT` | `33` | 手持身份证正扫面照 |
| `TYPE_IDENTITY_FRONT_INT` | `00` | 公民身份证正面 |
| `TYPE_IDENTITY_REVERSE_INT` | `30` | 公民身份证反面 |
| `TYPE_INTERNETBUSINESS_INT` | `31` | 互联网业务商户协议 |
| `TYPE_MANAGEPLACEPIC_INT` | `50` | 经营场所图1 |
| `TYPE_MANAGEPLACE_INT` | `51` | 经营场所 |
| `TYPE_TAXREGISTER_INT` | `20` | 税务登记证 |

## PERSONEL 模块

<a name="personel"></a>

### cityPartner

<a name="personel-citypartner"></a>

#### **type** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_BUSINESS_INT` | `0` | 业务(类型) |
| `TYPE_DESIGN_INT` | `1` | 设计(类型) |
| `TYPE_ENGIN_INT` | `3` | 主材(类型) |
| `TYPE_SALES_INT` | `2` | 销售(类型) |
| `TYPE_SERV_INT` | `4` | 工程(类型) |

### contract

<a name="personel-contract"></a>

#### **deliveryMode** (10 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `` | `①` | 乙方配送到仓模式(厂商合同-配送模式) |
| `` | `②` | 乙方配送到户模式(厂商合同-配送模式) |
| `` | `①` | 甲方自装(厂商合同-配送模式) |
| `` | `②` | 乙方负责安装(厂商合同-配送模式) |
| `` | `③` | 乙方负责安装(厂商合同-配送模式) |
| `` | `①` | 系统下单(厂商合同-下单方式) |
| `` | `(2)` | 比例结算(厂商合同-结算方式) |
| `` | `(1)` | 采购价结算(厂商合同-结算方式) |
| `` | `①` | 定制品(厂商合同-产品模式) |
| `` | `②` | 标准成品(厂商合同-产品模式) |

### dept

<a name="personel-dept"></a>

#### **isdet** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISDET_LOCK_INT` | `1` | 定岗 |
| `ISDET_OPEN_INT` | `0` | 开放 |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLED_INT` | `0` | 禁用 |
| `STATUS_ENABLED_INT` | `1` | 启用 |

### performance

<a name="personel-performance"></a>

#### **level** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `LEVEL_HIGH_INT` | `2` | 高级(等级) |
| `LEVEL_IN_INT` | `1` | 中级(等级) |
| `LEVEL_LOW_INT` | `0` | 低级(等级) |

#### **type** (9 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_ATTENDANCE_INT` | `7` | 考勤(类型) |
| `TYPE_BUG_INT` | `4` | bug(类型) |
| `TYPE_CODE_INT` | `1` | 代码(类型) |
| `TYPE_DELAY_INT` | `5` | 延期(类型) |
| `TYPE_ERROR_INT` | `6` | 失误(类型) |
| `TYPE_FILE_INT` | `2` | 文档(类型) |
| `TYPE_OVERTIME_INT` | `8` | 加班(类型) |
| `TYPE_TASK_INT` | `0` | 任务(类型) |
| `TYPE_TEST_INT` | `3` | 测试用例(类型) |

### recruitment

<a name="personel-recruitment"></a>

#### **education** (7 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `EDUCATION_FIRSTSCHOLL_INT` | `1` | 初中(学历) |
| `EDUCATION_GRADUATESTUDENT_INT` | `6` | 研究生及以上(学历) |
| `EDUCATION_HIGHSCHOLL_INT` | `3` | 高中(学历) |
| `EDUCATION_JUNIORCOLLEGE_INT` | `4` | 大专(学历) |
| `EDUCATION_MIDDLEJUNIOR_INT` | `2` | 中专(学历) |
| `EDUCATION_SMALLSCHOLL_INT` | `0` | 小学及以下(学历) |
| `EDUCATION_UNDERGRADUATE_INT` | `5` | 本科(学历) |

#### **employWay** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `EMPLOYWAY_ACTIVE_INT` | `3` | 主动应聘(招聘方式) |
| `EMPLOYWAY_CAMPUS_INT` | `0` | 校园招聘(招聘方式) |
| `EMPLOYWAY_HEADHUNTING_INT` | `4` | 猎头(招聘方式) |
| `EMPLOYWAY_INSIDEI_INT` | `2` | 内部推荐(招聘方式) |
| `EMPLOYWAY_NETWORK_INT` | `1` | 网络招聘(招聘方式) |

#### **political** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `POLITICAL_MASSES_INT` | `0` | 群众(政治面貌) |
| `POLITICAL_PARTY_INT` | `2` | 党员(政治面貌) |
| `POLITICAL_TEAM_INT` | `1` | 团员(政治面貌) |

#### **status** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_CANCEL_INT` | `2` | 作废(状态) |
| `STATUS_ENTRY_INT` | `1` | 入职(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |

### supplierContractBrand

<a name="personel-suppliercontractbrand"></a>

#### **ctype** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `CTYPE_LOW_INT` | `0` | 底价 |
| `CTYPE_POINT_INT` | `1` | 点位(业务类型) |

### supplierContractBrandProduct

<a name="personel-suppliercontractbrandproduct"></a>

#### **type** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `CTYPE_CONVENTION_INT` | `2` | 常规 |
| `CTYPE_LOW_INT` | `0` | 底价 |
| `CTYPE_OEM_INT` | `4` | 专供 |
| `CTYPE_POINT_INT` | `1` | 点位(业务类型) |
| `CTYPE_SPECIAL_INT` | `3` | 特价  |

### supplierContractService

<a name="personel-suppliercontractservice"></a>

#### **type** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `CTYPE_CONVENTION_INT` | `2` | 常规 |
| `CTYPE_OEM_INT` | `4` | 专供 |
| `CTYPE_SPECIAL_INT` | `3` | 特价  |

### uesrInfo

<a name="personel-uesrinfo"></a>

#### **form** (1 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `FORM_OUTPUTVALUE_INT` | `0` | 产值(岗位类型) |

### user

<a name="personel-user"></a>

#### **authStatus** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `AUTH_STATUS_AUTH_INT` | `1` | 认证(认证状态) |
| `AUTH_STATUS_INIT_INT` | `0` | 初始(认证状态) |

#### **extranet** (6 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `EXTRANET_IP_INT` | `2` | IP |
| `EXTRANET_MAC_INT` | `1` | MAC |
| `EXTRANET_NONE_INT` | `0` | 无 |
| `EXTRANET_PC_INT` | `16` | PC |
| `EXTRANET_QCODE_INT` | `4` | QCODE |
| `EXTRANET_WEB_INT` | `8` | WEB |

#### **islogin** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISLOGIN_FIP_INT` | `1` | 登陆 |
| `ISLOGIN_NOT_INT` | `0` | 禁用 |

#### **status** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_KEEPJOB_INT` | `2` | 停薪留职(状态) |
| `STATUS_OFFJOB_INT` | `1` | 离职(状态) |
| `STATUS_ONJOB_INT` | `0` | 在职(状态) |

### userContract

<a name="personel-usercontract"></a>

#### **status** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_FILE_INT` | `3` | 归档(状态) |
| `STATUS_NULL_INT` | `1` | 无效(状态) |
| `STATUS_SIGN_INT` | `2` | 已签(状态) |
| `STATUS_VALID_INT` | `0` | 初始(状态) |

### userExperience

<a name="personel-userexperience"></a>

#### **isPrefor** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `` | `1` | 不计算（是否计入业绩） |
| `` | `0` | 计算（是否计入业绩） |

### userFunction

<a name="personel-userfunction"></a>

#### **type** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_API_INT` | `1` | api |
| `TYPE_CONDITION_INT` | `2` | 条件 |
| `TYPE_FIELD_INT` | `3` | 字段 |
| `TYPE_FUNCTION_INT` | `4` | 功能 |

### userInfo

<a name="personel-userinfo"></a>

#### **education** (7 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `EDUCATION_FIRSTSCHOLL_INT` | `1` | 初中(学历) |
| `EDUCATION_GRADUATESTUDENT_INT` | `6` | 研究生及以上(学历) |
| `EDUCATION_HIGHSCHOLL_INT` | `3` | 高中(学历) |
| `EDUCATION_JUNIORCOLLEGE_INT` | `4` | 大专(学历) |
| `EDUCATION_MIDDLEJUNIOR_INT` | `2` | 中专(学历) |
| `EDUCATION_SMALLSCHOLL_INT` | `0` | 小学及以下(学历) |
| `EDUCATION_UNDERGRADUATE_INT` | `5` | 本科(学历) |

#### **employType** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `EMPLOYTYPE_FORMAL_INT` | `0` | 正式(招聘类型) |
| `EMPLOYTYPE_TRIAL_INT` | `1` | 试用(招聘类型) |

#### **employWay** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `EMPLOYWAY_ACTIVE_INT` | `3` | 主动应聘(招聘方式) |
| `EMPLOYWAY_CAMPUS_INT` | `0` | 校园招聘(招聘方式) |
| `EMPLOYWAY_HEADHUNTING_INT` | `4` | 猎头(招聘方式) |
| `EMPLOYWAY_INSIDEI_INT` | `2` | 内部推荐(招聘方式) |
| `EMPLOYWAY_NETWORK_INT` | `1` | 网络招聘(招聘方式) |

#### **experienceType** (12 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `` | `0` | 工作经验 |
| `` | `1` | 管理经验 |
| `` | `1` | 1 |
| `` | `2` | 2 |
| `` | `3` | 3 |
| `` | `4` | 4 |
| `` | `5` | 5 |
| `` | `6` | 6 |
| `` | `7` | 7 |
| `` | `8` | 8 |
| `` | `M` | M |
| `` | `P` | P |

#### **form** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `FORM_NONOUTPUTVALUE_INT` | `1` | 非产值(岗位类型) |
| `FORM_NONOUTPUTVALUE_INT` | `1` | 非产值(岗位类型) |
| `FORM_OUTPUTVALUE_INT` | `0` | 产值(岗位类型) |

#### **householdType** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `HOUSEHOLDTYPE_COUNTRYSIDE_INT` | `0` | 农村(户口类型) |
| `HOUSEHOLDTYPE_TOWN_INT` | `1` | 城镇(户口类型) |

#### **insuranceType** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `INSURANCETYPE_COMMERCIALINSURANCE_INT` | `1` | 商业保险(保险类型) |
| `INSURANCETYPE_SOCIALSECURITY_INT` | `0` | 社保(保险类型) |

#### **level** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `LEVEL_CHAIRMAN_INT` | `4` | 总监及以上(职级) |
| `LEVEL_CORESTAFF_INT` | `1` | 核心员工(职级) |
| `LEVEL_EXECUTIVEDIRECTOR_INT` | `2` | 主管(职级) |
| `LEVEL_MANAGER_INT` | `3` | 经理(职级) |
| `LEVEL_STAFF_INT` | `0` | 员工(职级) |

#### **political** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `POLITICAL_MASSES_INT` | `0` | 群众(政治面貌) |
| `POLITICAL_PARTY_INT` | `2` | 党员(政治面貌) |
| `POLITICAL_TEAM_INT` | `1` | 团员(政治面貌) |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_EFFECTIVE_INT` | `0` | 有效(状态) |
| `STATUS_INVALID_INT` | `1` | 无效(状态) |

### userPartner

<a name="personel-userpartner"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_INVALID_INT` | `1` | 无效(状态) |
| `STATUS_VALID_INT` | `0` | 有效(状态) |

#### **type** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_BUSINESS_INT` | `0` | 业务(类型) |
| `TYPE_DESIGN_INT` | `1` | 设计(类型) |
| `TYPE_MAIN_INT` | `2` | 主材(类型) |
| `TYPE_PROJECT_INT` | `3` | 工程(类型) |
| `TYPE_SERV_INT` | `4` | 工程(类型) |

## QUOTATION 模块

<a name="quotation"></a>

### addReduceItem

<a name="quotation-addreduceitem"></a>

#### **discount** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `DISCOUNT_DISCOUNT_INT` | `1` | 打折(折扣标识) |
| `DISCOUNT_DISCOUNT_NON_INT` | `3` | 打折(非配比) (折扣标识) |
| `DISCOUNT_NODISCOUNT_INT` | `0` | 不打折(折扣标识) |
| `DISCOUNT_NODISCOUNT_NON_INT` | `2` | 不打折(非配比) (折扣标识) |

#### **itemtype** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ITEMTYPE_COST_INT` | `1` | 成本(项目类型) |
| `ITEMTYPE_NORM_INT` | `0` | 标准(项目类型) |

#### **subtype** (8 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `SUBTYPE_ELECTRICAL_INT` | `5` | 电器(子类) |
| `SUBTYPE_FURNITURE_INT` | `4` | 家具(子类) |
| `SUBTYPE_LAMPS_INT` | `6` | 灯具(子类) |
| `SUBTYPE_MATERIAL_INT` | `2` | 主材(子类) |
| `SUBTYPE_OTHER_INT` | `0` | 其他(子类) |
| `SUBTYPE_PACKAGES_INT` | `3` | 套餐(子类) |
| `SUBTYPE_PROJECT_INT` | `1` | 工程(子类) |
| `SUBTYPE_SOFTDECORATION_INT` | `7` | 软装(子类) |

#### **type** (6 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_ADD_ITEM_INT` | `4` | 增项中报价项(类型) |
| `TYPE_COMMON_QUOTATION_INT` | `0` | 标准报价项(类型) |
| `TYPE_CUSTOM_QUOTATION_INT` | `2` | 自定义项(类型) |
| `TYPE_EXTENSION_ITEM_INT` | `5` | 拓展中报价项(类型) |
| `TYPE_QUOTATION_ITEM_INT` | `3` | 报价中报价项(类型) |
| `TYPE_SYSTEM_QUOTATION_INT` | `1` | 系统定义项(类型) |

### addreduce

<a name="quotation-addreduce"></a>

#### **atttype** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ATTTYPE_MATERIAL_INT` | `1` | 主材(业务类型) |
| `ATTTYPE_PROJECT_INT` | `0` | 工程(业务类型) |

#### **isAffirm** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISAFFIRM_CONFIRMED_INT` | `1` | 客户确认(是否确认) |
| `ISAFFIRM_UNCONFIRMED_INT` | `0` | 未确认(是否确认) |

#### **manageDiscount** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `MANAGEDISCOUNT_DISCOUNT_INT` | `1` | 打折(管理费折扣) |
| `MANAGEDISCOUNT_NODISCOUNT_INT` | `0` | 不打折(管理费折扣) |

#### **paytype** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `PAYTYPE_ARO_INT` | `2` | 特批(付款类型) |
| `PAYTYPE_COM_INT` | `1` | 下拨(付款类型) |
| `PAYTYPE_NORETURN_INT` | `3` | 不退( 付款类型) |
| `PAYTYPE_PAY_INT` | `0` | 付款(付款类型) |

#### **status** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_CONFIRMED_INT` | `3` | 已确认(状态) |
| `STATUS_PAYED_INT` | `2` | 已付款(状态) |
| `STATUS_SUBMIT_INT` | `1` | 提交(状态) |
| `STATUS_UNSUBMIT_INT` | `0` | 初始(状态) |

#### **taxDiscount** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TAX_MANAGETAXDISCOUNT_INT` | `1` | 管理税金(税金折扣) |
| `TAX_NODISCOUNT_INT` | `0` | 无税金(税金折扣) |
| `TAX_TOTALTAXDISCOUNT_INT` | `2` | 总额税金(税金折扣) |

#### **type** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_ADD_INT` | `0` | 增项( 类型) |
| `TYPE_REDUCE_INT` | `1` | 减项(类型) |

### extension

<a name="quotation-extension"></a>

#### **atttype** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ATTTYPE_ACTIVITY_INT` | `4` | 活动(业务类型) |
| `ATTTYPE_CURRENCY_INT` | `0` | 通用(业务类型) |
| `ATTTYPE_DISPLACE_INT` | `1` | 置换(业务类型) |
| `ATTTYPE_QUOTATION_INT` | `3` | 报价(业务类型) |
| `ATTTYPE_SPECIAL_INT` | `2` | 赋能(业务类型) |

#### **manageDiscount** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `MANAGEDISCOUNT_DISCOUNT_INT` | `1` | 打折(管理费折扣) |
| `MANAGEDISCOUNT_NODISCOUNT_INT` | `0` | 不打折(管理费折扣) |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_INIT_SHORT` | `0` | 初始(状态) |
| `STATUS_LOCK_INT` | `1` | 锁定(状态) |

#### **type** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_ADD_INT` | `0` | 增项( 类型) |
| `TYPE_SUB_INT` | `1` | 减项(类型) |

### extensionItem

<a name="quotation-extensionitem"></a>

#### **discount** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `DISCOUMNT_DISCOUMNT_INT` | `1` | 打折(折扣标识) |
| `DISCOUMNT_NODISCOUMNT_INT` | `0` | 不打折(折扣标识) |

#### **subtype** (8 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `SUBTYPE_ELECTRICAL_INT` | `5` | 电器(子类) |
| `SUBTYPE_FURNITURE_INT` | `4` | 家具(子类) |
| `SUBTYPE_LAMPS_INT` | `6` | 灯具(子类) |
| `SUBTYPE_MATERIAL_INT` | `2` | 主材(子类) |
| `SUBTYPE_OTHER_INT` | `0` | 其他(子类) |
| `SUBTYPE_PACKAGES_INT` | `3` | 套餐(子类) |
| `SUBTYPE_PROJECT_INT` | `1` | 工程(子类) |
| `SUBTYPE_SOFTDECORATION_INT` | `7` | 软装(子类) |

#### **type** (6 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_CUTOMADD_INT` | `1` | 自定义(增项)(类型) |
| `TYPE_CUTOMSUB_INT` | `3` | 自定义(减项)(类型) |
| `TYPE_QUOTATIONADD_INT` | `0` | 标准(增项)(类型) |
| `TYPE_QUOTATIONINADD_INT` | `5` | 报价中(增项)(类型) |
| `TYPE_QUOTATIONINSUB_INT` | `4` | 报价中项(减项)(类型) |
| `TYPE_QUOTATIONSUB_INT` | `2` | 标准(减项)(类型) |

### normoodItem

<a name="quotation-normooditem"></a>

#### **normtype** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `NORMTYPE_MATERIAL_INT` | `0` | 材料(定额类型) |
| `NORMTYPE_PACK_INT` | `1` | 打包(定额类型) |

#### **type** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_ADDCUT_INT` | `2` | 增减(类型) |
| `TYPE_EXPAND_INT` | `1` | 拓展(类型) |
| `TYPE_OFFER_INT` | `0` | 报价(类型) |
| `TYPE_QUOTA_INT` | `3` | 定额(类型) |

### normoodItem 

<a name="quotation-normooditem "></a>

#### **atttype** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ATTTYPE_COLLECTION_INT` | `0` | 收款(业务类型) |
| `ATTTYPE_DISBURSEMENTS_INT` | `1` | 出款(业务类型) |

### normriceItem

<a name="quotation-normriceitem"></a>

#### **atttype** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ATTTYPE_COLLECTION_INT` | `0` | 收款(业务类型) |
| `ATTTYPE_DISBURSEMENTS_INT` | `1` | 出款(业务类型) |

#### **normtype** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `NORMTYPE_ADD_INT` | `1` | 附加(定额类型) |
| `NORMTYPE_WORKFEE_INT` | `0` | 工费(定额类型) |

#### **type** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_ADDCUT_INT` | `2` | 增减(类型) |
| `TYPE_EXPAND_INT` | `1` | 拓展(类型) |
| `TYPE_OFFER_INT` | `0` | 报价(类型) |
| `TYPE_QUOTA_INT` | `3` | 定额(类型) |

### normtion

<a name="quotation-normtion"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DISABLE_INT` | `1` | 禁用(状态) |
| `STATUS_ENABLE_INT` | `0` | 启用(状态) |

### protation

<a name="quotation-protation"></a>

#### **defaults** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `DEFAULT_COMMON_INT` | `0` | 非默认(默认标识) |
| `DEFAULT_DEFAULT_INT` | `1` | 默认(默认标识) |

#### **status** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_APPROVAL_INT` | `3` | 审批(状态) |
| `STATUS_DISABLE_INT` | `1` | 禁用(状态) |
| `STATUS_INIT_INT` | `0` | 启用(状态) |
| `STATUS_LOCK_INT` | `2` | 锁定(状态) |

### protationItem

<a name="quotation-protationitem"></a>

#### **oneType** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ONETYPE_MATESUB_INT` | `2` | 配减(一类) |
| `ONETYPE_MATE_INT` | `1` | 标配(一类) |
| `ONETYPE_STAND_INT` | `0` | 标准(一类) |

#### **type** (11 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_ACCMAIN_INT` | `8` | 赋主(类型) |
| `TYPE_ACCWORK_INT` | `7` | 赋工(类型) |
| `TYPE_ADDMAIN_INT` | `4` | 增主(类型) |
| `TYPE_ADDWORK_INT` | `3` | 增工(类型) |
| `TYPE_BASE_INT` | `0` | 基础(类型) |
| `TYPE_CUTCURRENT_INT` | `11` | 减通(类型) |
| `TYPE_CUTMAIN_INT` | `6` | 减主(类型) |
| `TYPE_CUTWORK_INT` | `5` | 减工(类型) |
| `TYPE_PRCURRENT_INT` | `9` | 通用(类型) |
| `TYPE_PRINCIPAL_INT` | `2` | 主材(类型) |
| `TYPE_PROJECT_INT` | `1` | 工程(类型) |

### qeasureItem

<a name="quotation-qeasureitem"></a>

#### **type** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_DATE_INT` | `4` | 日期 |
| `TYPE_INPUT_INT` | `1` | 输入框(类型) |
| `TYPE_MULTIPLE_INT` | `3` | 多选(类型) |
| `TYPE_SINGLE_INT` | `2` | 单选(类型) |
| `TYPE_TEXT_INT` | `0` | 文本(类型) |

### quotation

<a name="quotation-quotation"></a>

#### **attstatus** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ATTSTATUS_AUDI_INT` | `2` | 审批(业务状态) |
| `ATTSTATUS_FINISH_INT` | `3` | 完成(业务状态) |
| `ATTSTATUS_PRIMARY_INT` | `0` | 初始(业务状态) |
| `ATTSTATUS_SUBMIT_INT` | `1` | 提交(业务状态) |

#### **defaults** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `DEFAULTS_DEFAULT_INT` | `1` | 默认(默认标识) |
| `DEFAULTS_NONDEFAULT_INT` | `0` | 非默认(默认标识) |

#### **status** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_APPROVAL_INT` | `2` | 审批(状态) |
| `STATUS_INIT_INT` | `0` | 启用(状态) |
| `STATUS_LOCK_INT` | `1` | 锁定(状态) |

#### **taxDiscount** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TAX_DISCOUNT_INT` | `1` | 打折(税金折扣) |
| `TAX_NODISCOUNT_INT` | `0` | 不打折(税金折扣) |

### quotationFunctionArea

<a name="quotation-quotationfunctionarea"></a>

#### **type** (8 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_ACHIEVEMENT_INT` | `5` | 非业绩(类型) |
| `TYPE_CMPREH_INT` | `7` | 综合(类型) |
| `TYPE_COST_INT` | `4` | 成本(类型) |
| `TYPE_FUNCTIONAREA_TOTAL_INT` | `2` | 功能区总额(类型) |
| `TYPE_HIDE_INT` | `6` | 隐藏(类型) |
| `TYPE_MANAGEMENT_INT` | `0` | 管理(类型) |
| `TYPE_NOT_COUNT_INT` | `3` | 不计算(类型) |
| `TYPE_PROJECT_NUM_INT` | `1` | 工程量(类型) |

### quotationFunctionAreaItem

<a name="quotation-quotationfunctionareaitem"></a>

#### **discount** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `DISCOUNT_DISCOUNT_INT` | `1` | 打折(折扣标识) |
| `DISCOUNT_NODISCOUNT_INT` | `0` | 不打折(折扣标识) |

#### **subtype** (8 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `SUBTYPE_FURNITURE_INT` | `4` | 家具(子类) |
| `SUBTYPE_LAMP_INT` | `6` | 灯具(子类) |
| `SUBTYPE_MATERIAL_INT` | `2` | 主材(子类) |
| `SUBTYPE_OTHER_INT` | `0` | 其他(子类) |
| `SUBTYPE_PACKAGE_INT` | `3` | 套餐(子类) |
| `SUBTYPE_PROJECT_INT` | `1` | 工程(子类) |
| `SUBTYPE_SOFT_INT` | `7` | 软装(子类) |
| `SUBTYPE_WIREWARE_INT` | `5` | 电器(子类) |

#### **type** (11 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_CMPREH_INT` | `9` | 综合(类型) |
| `TYPE_COMMON_INT` | `0` | 标准(类型) |
| `TYPE_COST_INT` | `5` | 成本(类型) |
| `TYPE_CUSTOM_INT` | `1` | 自定义(类型) |
| `TYPE_GENERAL_MANA_INT` | `10` | 综合管理(类型) |
| `TYPE_HIDE_INT` | `7` | 隐藏(类型) |
| `TYPE_IGNORE_INT` | `4` | 不计(类型) |
| `TYPE_MANAGE_INT` | `3` | 管理(类型) |
| `TYPE_TAX_INT` | `8` | 税金(类型) |
| `TYPE_TRAFFIC_INT` | `2` | 车运(类型) |
| `TYPE_UNACHE_INT` | `6` | 非业绩(类型) |

### quotationPicture

<a name="quotation-quotationpicture"></a>

#### **type** (1 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_SELECT_INT` | `1` | 选材(类型) |

### quotationPrefer

<a name="quotation-quotationprefer"></a>

#### **drawing** (1 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `DRAWING_INT` | `0` | 无(图纸) |

#### **redo** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `REDO_CHANGE_DESIGN_INT` | `1` | 换设计(重做) |
| `REDO_NO_CHANGE_DESIGN_INT` | `0` | 未换设计(重做) |

#### **urgent** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `URGENT_BEAT_THE_CLOCK_INT` | `1` | 提前完成(加急) |
| `URGENT_CUSTOMER_IN_STORE_INT` | `0` | 客户在店(加急) |

### quotationRecord

<a name="quotation-quotationrecord"></a>

#### **type** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_ADDREDUCE_INT` | `3` | 增减(类型) |
| `TYPE_EXTENSION_INT` | `2` | 扩展(类型) |
| `TYPE_PROTATION_INT` | `0` | 预签(类型) |
| `TYPE_QUOTATION_INT` | `1` | 报价(类型) |

### quotetionFunctionArea

<a name="quotation-quotetionfunctionarea"></a>

#### **type** (8 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_ACHIEVEMENT_INT` | `5` | 非业绩(类型) |
| `TYPE_CMPREH_INT` | `7` | 综合(类型) |
| `TYPE_COST_INT` | `4` | 成本(类型) |
| `TYPE_FUNCTIONAREA_TOTAL_INT` | `2` | 功能区总额(类型) |
| `TYPE_HIDE_INT` | `6` | 隐藏(类型) |
| `TYPE_MANAGEMENT_INT` | `0` | 管理(类型) |
| `TYPE_NOT_COUNT_INT` | `3` | 不计算(类型) |
| `TYPE_PROJECT_NUM_INT` | `1` | 工程量(类型) |

### quotetionFunctionAreaItem

<a name="quotation-quotetionfunctionareaitem"></a>

#### **discount** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `DISCOUNT_DISCOUNT_INT` | `1` | 打折(折扣标识) |
| `DISCOUNT_NODISCOUNT_INT` | `0` | 不打折(折扣标识) |

#### **subtype** (8 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `SUBTYPE_FURNITURE_INT` | `4` | 家具(子类) |
| `SUBTYPE_LAMP_INT` | `6` | 灯具(子类) |
| `SUBTYPE_MATERIAL_INT` | `2` | 主材(子类) |
| `SUBTYPE_OTHER_INT` | `0` | 其他(子类) |
| `SUBTYPE_PACKAGE_INT` | `3` | 套餐(子类) |
| `SUBTYPE_PROJECT_INT` | `1` | 工程(子类) |
| `SUBTYPE_SOFT_INT` | `7` | 软装(子类) |
| `SUBTYPE_WIREWARE_INT` | `5` | 电器(子类) |

#### **type** (10 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_CMPREH_INT` | `9` | 综合(类型) |
| `TYPE_COMMON_INT` | `0` | 标准(类型) |
| `TYPE_COST_INT` | `5` | 成本(类型) |
| `TYPE_CUSTOM_INT` | `1` | 自定义(类型) |
| `TYPE_HIDE_INT` | `7` | 隐藏(类型) |
| `TYPE_IGNORE_INT` | `4` | 不计(类型) |
| `TYPE_MANAGE_INT` | `3` | 管理(类型) |
| `TYPE_TAX_INT` | `8` | 税金(类型) |
| `TYPE_TRAFFIC_INT` | `2` | 车运(类型) |
| `TYPE_UNACHE_INT` | `6` | 非业绩(类型) |

### selection

<a name="quotation-selection"></a>

#### **isAffirm** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISAFFIRM_CONFIRMED_INT` | `1` | 客户确认(是否确认) |
| `ISAFFIRM_UNCONFIRMED_INT` | `0` | 未确认(是否确认) |

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_INIT_INT` | `0` | 初始(状态) |
| `STATUS_LOCK_INT` | `1` | 锁定(状态) |

### selectionItem

<a name="quotation-selectionitem"></a>

#### **accountStatus** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ACCOUNT_STATUS_ACCOUNT_INT` | `1` | 对账状态(对账) |
| `ACCOUNT_STATUS_INIT_INT` | `0` | 对账状态(初始) |
| `ACCOUNT_STATUS_PENDING_INT` | `2` | 对账状态(挂载) |

#### **status** (8 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_BALANCE_INT` | `6` | 结算(状态) |
| `STATUS_CHECK_INT` | `2` | 审核(状态) |
| `STATUS_CONFIRM_INT` | `3` | 确认(状态) |
| `STATUS_DISABLE_SHORT` | `7` | 失效(状态) |
| `STATUS_FINISH_INT` | `4` | 完结(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |
| `STATUS_REVIEW_INT` | `5` | 核对(状态) |
| `STATUS_TRAN_INT` | `1` | 配送(状态) |

#### **type** (13 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_ADDED_ADDITEM_INT` | `33` | 增减增补量(类型) |
| `TYPE_ADDED_EXTENSIONADD_INT` | `31` | 拓展增补量(类型) |
| `TYPE_ADDED_EXTENSIONMINUS_INT` | `32` | 拓展减补量(类型) |
| `TYPE_ADDED_MINUSITEM_INT` | `34` | 增减减补量(类型) |
| `TYPE_ADDED_QUOTATION_SHORT` | `30` | 报价项补量(类型) |
| `TYPE_ADDITEM_COM_INT` | `13` | 增减增下拨(类型) |
| `TYPE_ADDITEM_INT` | `3` | 增减增(类型) |
| `TYPE_ALONE_INT` | `5` | 选材项(类型) |
| `TYPE_EXTENSIONADD_INT` | `1` | 拓展增(类型) |
| `TYPE_EXTENSIONMINUS_INT` | `2` | 拓展减(类型) |
| `TYPE_MINUSITEM_INT` | `4` | 增减减(类型) |
| `TYPE_MINUSITEM_NORETURN_INT` | `14` | 增减减不退(类型) |
| `TYPE_QUOTATION_INT` | `0` | 报价项(类型) |

## RIGHT 模块

<a name="right"></a>

### salesDeliveryStatusRight

<a name="right-salesdeliverystatusright"></a>

#### **status** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_CHECK_INT` | `2` | 审核 |
| `STATUS_DELIVERY_INT` | `1` | 配送 |
| `STATUS_END_INT` | `4` | 完结 |
| `STATUS_INIT_INT` | `0` | 初始 |
| `STATUS_NOTARIZE_INT` | `3` | 确认 |

### selectionItemStatusRight

<a name="right-selectionitemstatusright"></a>

#### **status** (7 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_CHECK_INT` | `2` | 审核 |
| `STATUS_COLLATION_INT` | `5` | 核对 |
| `STATUS_DELIVERY_INT` | `1` | 配送 |
| `STATUS_END_INT` | `4` | 完结 |
| `STATUS_INIT_INT` | `0` | 初始 |
| `STATUS_NOTARIZE_INT` | `3` | 确认 |
| `STATUS_SETTLEMENT_INT` | `6` | 结算 |

## SALARY 模块

<a name="salary"></a>

### decorationSalary

<a name="salary-decorationsalary"></a>

#### **atttype** (9 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `` | `1` | 提成类型 |
| `` | `0` | 提成类型 |
| `` | `2` | 阶段 |
| `` | `0` | 阶段 |
| `` | `3` | 阶段 |
| `` | `1` | 阶段 |
| `` | `1` | 状态 |
| `` | `0` | 状态 |
| `` | `1` | 类型 |

#### **type** (1 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_INT` | `0` | 类型 |

### materialSalary

<a name="salary-materialsalary"></a>

#### **stage** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STAGE_ALL_INT` | `0` | 全部(阶段) |
| `STAGE_FIRST_INT` | `1` | 首提(阶段) |
| `STAGR_LAST_INT` | `3` | 尾提(阶段) |
| `STAGR_MIDDLE_INT` | `2` | 中提(阶段) |

#### **status** (1 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_YES_INT` | `0` | 有效(状态) |

### salary

<a name="salary-salary"></a>

#### **SalaryTwoType** (10 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `SALARYTWOTYPE_ADDITEM_INT` | `10` | 附加项(类型) |
| `SALARYTWOTYPE_ADD_INT` | `2` | 增项(类型) |
| `SALARYTWOTYPE_COST_INT` | `1` | 工费(类型) |
| `SALARYTWOTYPE_DEPOSIT_INT` | `7` | 工具押金(类型) |
| `SALARYTWOTYPE_FINE_INT` | `5` | 罚款(类型) |
| `SALARYTWOTYPE_INSURANCE_INT` | `9` | 工人家属保险(类型) |
| `SALARYTWOTYPE_LOAN_INT` | `8` | 借款(类型) |
| `SALARYTWOTYPE_MONEY_INT` | `6` | 工程质保金(类型) |
| `SALARYTWOTYPE_PAYMENT_INT` | `4` | 维修款(类型) |
| `SALARYTWOTYPE_REWARD_INT` | `3` | 油工一级奖励(类型) |

#### **status** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_INIT_INT` | `0` | 初始(状态) |
| `STATUS_PASS_INT` | `1` | 通过(状态) |
| `STATUS_REJECT_INT` | `2` | 驳回(状态) |
| `STATUS_REVOKE_INT` | `3` | 撤销(状态) |

#### **type** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_ADD_INT` | `0` | 加(类型) |
| `TYPE_MINUS_INT` | `1` | 减(类型) |

### withhold

<a name="salary-withhold"></a>

#### **status** (1 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_INIT_INT` | `0` | 初始(状态) |

#### **type** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_DECORATION_INT` | `1` | 装修款(类型) |
| `TYPE_STANDARD_INT` | `0` | 标准(类型) |

## SALES 模块

<a name="sales"></a>

### oales

<a name="sales-oales"></a>

#### **atttype** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ATTTYPE_IAP_INT` | `0` | 内购(业务类型) |
| `ATTTYPE_OAP_INT` | `1` | 外购(业务类型) |

#### **awardType** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `AWARDTYPE_DESIGN_INT` | `0` | 设计部(奖励类型) |
| `AWARDTYPE_ENGINEER_INT` | `2` | 工程部(奖励类型) |
| `AWARDTYPE_SERVICE_INT` | `1` | 服务部(奖励类型) |

#### **status** (7 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_CHECK_INT` | `4` | 复核(外销单状态) |
| `STATUS_CONFIRM_INI` | `2` | 确认(外销单状态) |
| `STATUS_FINISH_INI` | `5` | 完结(外销单状态) |
| `STATUS_INIT_INT` | `0` | 初始(外销单状态) |
| `STATUS_INVALID_INI` | `6` | 废单(外销单状态) |
| `STATUS_REJECT_INT` | `3` | 驳回(外销单状态) |
| `STATUS_SUBMIT_INI` | `1` | 提交(外销单状态) |

#### **type** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_PUR_INT` | `0` | 购货 |
| `TYPE_REFUND_INT` | `1` | 退货 |

### oalespay

<a name="sales-oalespay"></a>

#### **type** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_BANK_INT` | `1` | 银行 |
| `TYPE_BILL_INT` | `2` | 账扣 |
| `TYPE_CASH_INT` | `0` | 现金 |
| `TYPE_INTERIOL_INT` | `3` | 内部 |

### refunds

<a name="sales-refunds"></a>

#### **status** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_CHECK_INT` | `1` | 未确定(退货单状态) |
| `STATUS_INIT` | `0` | 初始(状态) |
| `STATUS_PAY` | `1` | 已付款(状态) |

#### **type** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_TYPE_FULLY_INT` | `2` | 全退(退货类型) |
| `STATUS_TYPE_REFUNDS_INT` | `1` | 退货(退货类型) |
| `STATUS_TYPE_RESENDING_INT` | `3` | 倒单(退货类型) |

### sales

<a name="sales-sales"></a>

#### **balanceStatus** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `BALANCESTATUS_FINISH_SHORT` | `4` | 完结(结算状态) |
| `BALANCESTATUS_INIT_INT` | `0` | 初始(结算状态) |
| `BALANCESTATUS_PRESETTLEMENT_INT` | `1` | 预结算(结算状态) |
| `BALANCESTATUS_SETTLEMENT_INT` | `3` | 结算(结算状态) |
| `BALANCESTATUS_VENDORSETTLEMENT_INT` | `2` | 厂商结算(结算状态) |

#### **depositpayStatus** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `DESPOSITPAYSTATUS_CONFIRM_SHORT` | `2` | 已确认(定金状态) |
| `DESPOSITPAYSTATUS_INIT_SHORT` | `-1` | 初始(定金状态) |
| `DESPOSITPAYSTATUS_PAYED_SHORT` | `1` | 已付款(定金状态) |
| `DESPOSITPAYSTATUS_UNPAY_SHORT` | `0` | 未付款(定金状态) |

#### **fullpayStatus** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `FULLPAYSTATUS_APPROVAL_INT` | `3` | 正在审批(补款状态) |
| `FULLPAYSTATUS_CONFIRM_SHORT` | `2` | 已确认(补款状态) |
| `FULLPAYSTATUS_INIT_SHORT` | `-1` | 初始(补款状态) |
| `FULLPAYSTATUS_PAYED_SHORT` | `1` | 已付款(补款状态) |
| `FULLPAYSTATUS_UNPAY_SHORT` | `0` | 未付款(补款状态) |

#### **isAffirm** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISAFFIRM_AFFIRM_INT` | `1` | 已确认 |
| `ISAFFIRM_UNCONFIRMED_INT` | `0` | 未确认 |

#### **otherStatus** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `OTHERSTATUS_ADDSALES_INT` | `0` | 添加销售款(其他状态) |
| `OTHERSTATUS_FILLING_INT` | `1` | 补款审批(其他状态) |

#### **status** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_ALLBACK_INT` | `2` | 全退(状态) |
| `STATUS_DBACKORDER_INT` | `3` | 倒单(状态) |
| `STATUS_END_INT` | `5` | 完结(状态) |
| `STATUS_INIT_INT` | `0` | 初始(状态) |
| `STATUS_WAST_INT` | `4` | 废单(状态) |

#### **type** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_STA_INT` | `0` | 初始(类型) |
| `TYPE_SUB_INT` | `1` | 补贴(类型) |

### salesActivityItem

<a name="sales-salesactivityitem"></a>

#### **isAffirm** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ISAFFIRM_CHECKED_INT` | `2` | 二次确认(是否确认) |
| `ISAFFIRM_CONFIRMED_INT` | `1` | 首次确认(是否确认) |
| `ISAFFIRM_UNSUBMIT_INT` | `0` | 初始(是否确认) |

#### **state** (10 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_CONSUME_INT` | `7` | 消耗 |
| `STATUS_DELIVERY_INT` | `4` | 配送 |
| `STATUS_DISCOUNT_INT` | `8` | 折现 |
| `STATUS_PURCHER_INT` | `9` | 采购 |
| `STATUS_RECEIVE_INT` | `2` | 已领 |
| `STATUS_REFUND_INT` | `3` | 退货 |
| `STATUS_UNRETURNED_INT` | `5` | 未退 |
| `STATUS_UNVALID_INT` | `1` | 失效  |
| `STATUS_UPGRADE_INT` | `6` | 升级 |
| `STATUS_VALID_INT` | `0` | 初始  |

#### **type** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_GOODS_INT` | `1` | 物品(活动类型) |
| `TYPE_PACKET_INT` | `2` | 红包(活动类型) |
| `TYPE_TICKET_INT` | `0` | 券(活动类型) |

### salesBalance

<a name="sales-salesbalance"></a>

#### **confirmStatus** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `CONFIRMSTATUS_ALL_INT` | `2` | 全部确认 |
| `CONFIRMSTATUS_INIT_INT` | `0` | 未确认 |
| `CONFIRMSTATUS_PART_INT` | `1` | 部分确认 |

#### **deliverStatus** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `DELIVERSTATUS_ALL_INT` | `2` | 全部送达 |
| `DELIVERSTATUS_INIT_INT` | `0` | 未配送 |
| `DELIVERSTATUS_PART_INT` | `1` | 部分送达 |

#### **onetype** (4 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `ONETYPE_ALLBACK_INT` | `2` | 全退(一类) |
| `ONETYPE_DBACKORDER_INT` | `3` | 倒单(一类) |
| `ONETYPE_INIT_INT` | `0` | 购货(一类) |
| `ONETYPE_REFUND_INT` | `1` | 退货(一类) |

#### **status** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_BALANCE_INT` | `2` | 结算(结算状态) |
| `STATUS_PREBALANCE_INT` | `0` | 预结算(结算状态) |
| `STATUS_VENDORBALANCE_INT` | `1` | 厂商结算(结算状态) |

#### **type** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_BALANCEREFUNDS_INT` | `2` | 结算退货(结算类型) |
| `TYPE_BALANCE_INT` | `4` | 结算 |
| `TYPE_DEPOSITPAY_INT` | `3` | 定金(结算类型) |
| `TYPE_INIT_INT` | `0` | 购货(结算类型) |
| `TYPE_PREBALANCEREFUNDS_INT` | `1` | 预结算退货(结算类型) |

#### **verifyStatus** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `VERIFYSTATUS_ALL_INT` | `2` | 全部审核 |
| `VERIFYSTATUS_INIT_INT` | `0` | 未审核 |
| `VERIFYSTATUS_PART_INT` | `1` | 部分审核 |

### salesDeliveryItem

<a name="sales-salesdeliveryitem"></a>

#### **status** (5 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_CHECK_INT` | `2` | 审核(配送状态) |
| `STATUS_CONFIRM_INT` | `3` | 确认(配送状态) |
| `STATUS_FINISH_INT` | `4` | 完结(配送状态) |
| `STATUS_INIT_INT` | `0` | 初始(配送状态) |
| `STATUS_TRAN_INT` | `1` | 配送(配送状态) |

### salesFunction

<a name="sales-salesfunction"></a>

#### **type** (7 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `TYPE_API_INT` | `1` | api |
| `TYPE_CONDITION_INT` | `2` | 条件 |
| `TYPE_FILID_INT` | `3` | 字段 |
| `TYPE_FUNCTION_INT` | `4` | 功能 |
| `TYPE_NODE_INT` | `5` | 节点 |
| `TYPE_STATUS_INT` | `6` | 状态 |
| `TYPE_TYPE_INT` | `0` | 类型 |

### salesItem

<a name="sales-salesitem"></a>

#### **ctype** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `CTYPE_NOTCOUNT_INT` | `2` | 不计算 |
| `CTYPE_POINT_INT` | `1` | 点位 |
| `CTYPE_RESERVEPRICE_INT` | `0` | 底价 |

### salesPicture

<a name="sales-salespicture"></a>

#### **status** (2 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `STATUS_DEL_SHORT` | `1` | 删除(图片状态) |
| `STATUS_YES_SHORT` | `0` | 有效(图片状态) |

## SYSTEM 模块

<a name="system"></a>

### company

<a name="system-company"></a>

#### **block** (6 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `BLOCK_1918_INT` | `2` | 板块(1918) |
| `BLOCK_AILIN_INT` | `4` | 板块(爱林) |
| `BLOCK_ENLIN_INT` | `5` | 板块(恩林) |
| `BLOCK_FANGLIN_INT` | `1` | 板块(方林) |
| `BLOCK_GENERAL_INT` | `0` | 板块(通用) |
| `BLOCK_IKEA_INT` | `3` | 板块(宜家) |

### module

<a name="system-module"></a>

#### **level** (3 项)

| 字段 | 值 | 描述 |
|:---|---:|:---|
| `LEVEL_ONE_INT` | `1` | 1 |
| `LEVEL_THR_INT` | `3` | 3 |
| `LEVEL_TOW_INT` | `2` | 2 |
