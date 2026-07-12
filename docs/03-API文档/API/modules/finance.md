# 财务


财务模块 , 根据收款以及相关数据进行财务相关业务的信息处理 .

其中科目作为基础数据进行记录以及统计 , 根据账本(期间)进行阶段财务数据的处理工作 , 生成相应的凭证信息 .

凭证信息作为整体数据 , 包括相关时间 , 操作人员信息 .

凭证信息包括两个部分数据 , 一是账目信息 , 二是辅助核算项目 . 账目信息关联科目信息 , 辅助核算项目关联其他信息 , 如订单 , 楼盘 .

## 摘要


摘要信息管理 , 提供账目摘要信息选择数据


> **类**: `api.finance.AbstractsAction`


#### 数据类型: `abstracts`

| 参数 | 说明 | 类型 |
|------|------|------|
| `aid` | 摘要ID | Integer |
| `ownerId` | 归属人ID | Integer |
| `abstracts` | 摘要信息 | String |


##### `功能` queryAbstracts

获取操作用户拥有的摘要信息

**Returns:**

- `abstractes` (List): 摘要信息列表 , 每条数据类型 `abstracts`

```json
{
    ...
    "abstractes": [
        {
            "aid": 1,
            "ownerId": 34,
            "abstracts": "摘要"
        }
    ],
    ...
}
```


##### `功能` addAbstracts

添加摘要信息

**Requests:**

- `abstracts.abstracts` (String): 摘要信息

```json
{
    "abstracts.abstracts": "摘要"
}
```


##### `功能` deleteAbstracts

删除摘要信息

**Requests:**

- `abstracts.aid` (Integer): 摘要ID

```json
{
    "abstracts.aid": 1
}
```

## 期间


期间信息管理 , 作为关联账本数据信息基础 ,

期间信息格式 yyyyDD


> **类**: `api.finance.PeriodAction`


#### 数据类型: `period`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pid` | 期间ID | Long |
| `period` | 期间 | String |
| `status` | 状态 , 0: 初始 , 1: 关闭 | String |


##### `功能` queryPeriod

获取所有期间信息

**Returns:**

- `periods` (List): 期间信息列表 , 每条数据类型 `period`

```json
{
    ...
    "periods": [
        {
            "pid": 1,
            "period": "201601",
            "status": 0
        },
    ],
    ...
}
```


##### `功能` queryPeriodForCurrent

获取当前最新期间信息

**Returns:**

- `period` (Object): 期间信息 , 类型 `period`

```json
{
    ...
    "period": {
        "pid": 1,
        "period": "201601",
        "status": 0
    ],
    ...
}
```


##### `功能` queryPeriodForOpen

获取处于初始(开启)状态的期间信息 , 提供创建凭证时选择的期间信息

**Returns:**

- `periods` (List): 期间信息列表 , 每条数据类型 `period`

```json
{
    ...
    "periods": [
        {
            "pid": 1,
            "period": "201601",
            "status": 0
        },
    ],
    ...
}
```

## 账本


账本既期间

依托期间信息 , 根据账本相关操作完成账本(期间)的相关操作

最后一个账本(期间)处于开帐状态 , 同时不能进行关帐动作


> **类**: `api.finance.BookAction`


##### `功能` checkoutBook

结账 , 完成两个动作 , 一是产生新的期间信息 , 既新账本 ; 二是科目余额产生对应期间数据


##### `功能` openBook

开帐 , 操作的账本的下一个账本必须处于开帐状态 , 否则不能开帐

**Requests:**

- `period` (String): 期间

```json
{
    "period": "201601"
}
```


##### `功能` closeBook

关帐 , 操作的账本的上一个账本必须处于关帐状态 , 否则不能关帐

**Requests:**

- `period` (String): 期间

```json
{
    "period": "201601"
}
```

## 科目


科目信息管理


> **类**: `api.finance.SubjectAction`


#### 数据类型: `subject`

| 参数 | 说明 | 类型 |
|------|------|------|
| `sid` | 科目ID | Long |
| `level` | 等级 , 1: 一级 , 2: 二级 , 3: 三级 | Short |
| `oneCode` | 一级编号 , 四位数字组成 | String |
| `twoCode` | 二级编号 , 三位数字组成 | String |
| `thrCode` | 三级编号 , 三位数字组成 | String |
| `name` | 名称 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `code` | 编号 , 由一级 , 二级和三级编号组成 , 共十位数字组成 | String |
| `direction` | 余额方向 , 0: 借 , 1: 贷 | Short , 0: |
| `assistant` | 辅助核算项目编号列表 , 格式: oi-oa-dsr | String |


##### `功能` pageSubject

分页方式获取科目信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 大区信息列表 , 每条数据类型 `region`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sid": 1,
                "name": "现金",
                "code": "1010000000",
                "oneCode": "1010",
                "thrCode": "000",
                "twoCode": "000",
                "direction": 1,
                "level": 1,
                "status": 0,
                "assistant": ""
            }
        ],
        ...
    },
    ...
}
```


##### `功能` querySubject

获取所有科目信息

**Returns:**

- `subjects` (List): 科目信息列表 , 每条数据类型 `subject`

```json
{
    ...
    "subjects": [
        {
            "sid": 1,
            "name": "现金",
            "code": "1010000000",
            "oneCode": "1010",
            "thrCode": "000",
            "twoCode": "000",
            "direction": 1,
            "level": 1,
            "status": 0,
            "assistant": ""
        }
    ],
    ...
}
```


##### `功能` querySubjectByNameOCode

通过科目名称或编号获取科目信息

**Requests:**

- `subject.name` (String): 名称
- `subject.code` (String): 编号

```json
{
    "subject.name": "现金",
    "subject.code": "1010001001"
}
```

**Returns:**

- `region` (object): 大区信息 , 类型 `region`

```json
{
    ...
    "subject":{
        "sid": 1,
        "name": "现金",
        "code": "1010000000",
        "oneCode": "1010",
        "thrCode": "000",
        "twoCode": "000",
        "direction": 1,
        "level": 1,
        "status": 0,
        "assistant": ""
    },
    ...
}
```


##### `功能` querySubjectByCode

通过编号获取科目信息

**Requests:**

- `subject.code` (String): 编号

```json
{
    "subject.code": "1010001001"
}
```

**Returns:**

- `region` (object): 大区信息 , 类型 `region`

```json
{
    ...
    "subject":{
        "sid": 1,
        "name": "现金",
        "code": "1010000000",
        "oneCode": "1010",
        "thrCode": "000",
        "twoCode": "000",
        "direction": 1,
        "level": 1,
        "status": 0,
        "assistant": ""
    },
    ...
}
```


##### `功能` addSubject

添加科目信息 , 需要区分一 , 二 , 三级科目层级进行添加 , 如果添加二 , 三级科目 , 需要匹配上级科目的编号 , 如果没有上级科目将不能创建 , 如果科目编号存在或者名称存在也不能添加成功

科目编号组成格式 , 准从 4-3-3 的格式 , 由数字组成

一级科目编号为: xxxx 000 000

二级科目编号为: xxxx xxx xxx

三级科目编号为: xxxx xxx xxx

**Requests:**

- `subject.name` (String): 名称
- `subject.code` (String): 编号
- `subject.oneCode` (String): 一级编号
- `subject.twoCode` (String): 二级编号
- `subject.thrCode` (String): 三级编号
- `subject.direction` (Short): 科目余额方向
- `subject.level` (Short): 等级 , 1: 一级 , 2: 二级 , 3: 三级
- `subject.assistant` (String): 辅助核算项

```json
{
    "subject.name": "现金",
    "subject.code": "1010001001",
    "subject.oneCode": "1010",
    "subject.twoCode": "001",
    "subject.thrCode": "001",
    "subject.direction": 0,
    "subject.level": 3,
    "subject.assistant": ""
}
```


##### `功能` updateSubject

更新科目信息 , 如果当前科目已经使用将不能进行更新动作

**Requests:**

- `subject.sid` (Long): 科目ID
- `subject.name` (String): 名称
- `subject.code` (String): 编号
- `subject.oneCode` (String): 一级编号
- `subject.twoCode` (String): 二级编号
- `subject.thrCode` (String): 三级编号
- `subject.direction` (Short): 科目余额方向
- `subject.level` (Short): 等级 , 1: 一级 , 2: 二级 , 3: 三级
- `subject.assistant` (String): 辅助核算项

```json
{
    "subject.sid": 1
    "subject.name": "现金",
    "subject.code": "1010001001",
    "subject.oneCode": "1010",
    "subject.twoCode": "001",
    "subject.thrCode": "001",
    "subject.direction": 0,
    "subject.level": 3,
    "subject.assistant": ""
}
```


##### `功能` updateSubjectForStatus

更新科目状态

**Requests:**

- `subject.sid` (Long): 科目ID
- `subject.status` (Short): 状态

```json
{
    "subject.sid": 1
    "subject.status": 0
}
```


##### `功能` deleteSubject

删除科目信息 , 已经被引用的科目将不能删除

**Requests:**

- `subject.sid` (Long): 科目ID

```json
{
    "subject.sid": 1
}
```

## 科目余额


科目余额信息 , 根据期间(账本)进行统计科目对应余额相关数据 , 同时统计年余额


> **类**: `api.finance.SubjectBalanceAction`


#### 数据类型: `subjectBalance`

| 参数 | 说明 | 类型 |
|------|------|------|
| `sbId` | 科目余额ID | Long |
| `subject` | 科目信息 , 类型 [subject ](./finance.html#api.finance.SubjectAction.subject) | Object |
| `period` | 期间 | String |
| `total` | 总额 | Float |
| `initial` | 起始金额 | Float |
| `balance` | 期间余额 | Float |
| `debit` | 借方向余额 | Float |
| `credit` | 贷方向余额 | Float |
| `annual` | 年余额 | Float |
| `adebit` | 年借方向余额 | Float |
| `acredit` | 年贷方向余额 | Float |
| `status` | 状态 , 0: 初始 , 1: 过期 | Short |


##### `功能` pageSubjectBalance

分页方式获取科目余额信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 科目余额信息列表 , 每条数据类型 `subjectBalance`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sbId": 1,
                "acredit": 0.0,
                "adebit": 0.0,
                "annual": 300.0,
                "balance": 300.0,
                "credit": 0.0,
                "debit": 0.0,
                "initial": 300.0,
                "period": "201608",
                "status": 1,
                "total": 300.0,
                "subject": {
                    "assistant": "",
                    "code": "1010001001",
                    "direction": 1,
                    "level": 3,
                    "name": "金额",
                    "oneCode": "1010",
                    "sid": 66,
                    "status": 0,
                    "thrCode": "001",
                    "twoCode": "001"
                }
            }
        ],
        ...
    },
    ...
}
```


##### `功能` querySubjectBalance

获取所有科目余额信息

**Returns:**

- `subjectBalances` (List): 科目余额信息列表 , 每条数据类型 `subjectBalance`

```json
{
    ...
    "subjectBalances": [
        {
            "sbId": 1,
            "acredit": 0.0,
            "adebit": 0.0,
            "annual": 300.0,
            "balance": 300.0,
            "credit": 0.0,
            "debit": 0.0,
            "initial": 300.0,
            "period": "201608",
            "status": 1,
            "total": 300.0,
            "subject": {
                "assistant": "",
                "code": "1010001001",
                "direction": 1,
                "level": 3,
                "name": "金额",
                "oneCode": "1010",
                "sid": 66,
                "status": 0,
                "thrCode": "001",
                "twoCode": "001"
            }
        }
    ],
    ...
}
```


##### `功能` updateSubjectBalanceForBalance

通过科目ID更新科目对应余额信息

**Requests:**

- `subjectBalance.subject.sid` (Long): 科目ID
- `subjectBalance.balance` (Float): 余额金额

```json
{
    "subjectBalance.subject.sid": 1,
    "subjectBalance.balance": 100
}
```

## 凭证


凭证管理 , 凭证相关动作


> **类**: `api.finance.VoucherAction`


#### 数据类型: `voucher`

| 参数 | 说明 | 类型 |
|------|------|------|
| `vid` | 凭证ID | Long |
| `voucherId` | 凭证编号 , 格式为 xxxxxxxxxx , 十位数字组成 | String |
| `word` | 字号 , 格式为XX , 两位大写字符组成 | String |
| `wordnum` | 行号 | Integer |
| `createTime` | 创建时间 | Timestamp |
| `period` | 期间 | String |
| `originator` | 创建人 , 类型为 [user ](./user.html#api.personel.UserAction.user) | Object |
| `auditor` | 审计人 , 类型为 [user ](./user.html#api.personel.UserAction.user) | Object |
| `auditTime` | 审计时间 | Timestamp |
| `postor` | 过账人 , 类型为 [user ](./user.html#api.personel.UserAction.user) | Object |
| `postTime` | 过账时间 | Timestamp |
| `authorizer` | 授权人 , 类型为 [user ](./user.html#api.personel.UserAction.user) | Object |
| `cashier` | 出纳 , 类型为 [user ](./user.html#api.personel.UserAction.user) | Object |
| `reference` | 说明 | String |
| `attachmentNum` | 附件数 | Integer |
| `comment` | 备注 | String |
| `status` | 状态 , 0: 预制 , 1: 正式 , 2: 关闭 , 3: 非正式 | Short |
| `lockFlag` | 锁标识 | Short |
| `accounts` | 账目信息列表 , 每条数据类型 account | List |


:param a.ou: 创建人Id
:type a.ou: String
:param a.pu: 过账人Id
:type a.pu: String
:param a.ct: 创建时间
:type a.ct: String
:param a.pt: 过账时间Id
:type a.pt: String
:param a.p: 期间
:type a.p: String
:param y.a: 账目摘要
:type y.a: String


##### `功能` pageVoucher

分页方式获取凭证信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 凭证信息列表 , 每条数据类型 `voucher`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "accounts": [
                    {
                        "abstracts": "摘要",
                        "aid": 2,
                        "assistant": null,
                        "businessTime": null,
                        "createTime": null,
                        "credit": 100.0,
                        "debit": 0.0,
                        "oneCode": "1010",
                        "period": "201601",
                        "saId": 0,
                        "status": 0,
                        "subjectName": "现金",
                        "thrCode": "001",
                        "twoCode": "001",
                        "voucher": null,
                        "word": "DR"
                    },
                    {
                        "abstracts": "摘要",
                        "aid": 1,
                        "assistant": null,
                        "businessTime": null,
                        "createTime": null,
                        "credit": 0.0,
                        "debit": 100.0,
                        "oneCode": "1020",
                        "period": "201601",
                        "saId": 0,
                        "status": 0,
                        "subjectName": "银行卡",
                        "thrCode": "001",
                        "twoCode": "001",
                        "voucher": null,
                        "word": "DR"
                    }
                ],
                "attachmentNum": 0,
                "auditTime": null,
                "auditor": null,
                "authorizer": null,
                "cashier": null,
                "comment": "",
                "createTime": "2016-09-18",
                "lockFlag": null,
                "originator": {
                    "currentName": "白雪",
                    "dept": null,
                    "deptType": "设计部",
                    "duty": "设计师",
                    "uid": 2146,
                    "userId": "U001",
                    "userName": "白雪",
                },
                "period": "201610",
                "postTime": "2016-01-01",
                "postor": null,
                "reference": "",
                "status": 1,
                "vid": 1,
                "voucherId": "1100000019",
                "word": "DR",
                "wordnum": 0
            }
        ],
        ...
    },
    ...
}
```


##### `功能` queryVoucherByVId

通过凭证ID获取凭证信息

**Requests:**

- `voucher.vid` (Long): 凭证ID

```json
{
    "voucher.vid": 1
}
```

**Returns:**

- `voucher` (object): 凭证信息 , 类型 `voucher`

```json
{
    ...
    "voucher":{
        "accounts": [
            {
                "abstracts": "摘要",
                "aid": 2,
                "assistant": null,
                "businessTime": null,
                "createTime": null,
                "credit": 100.0,
                "debit": 0.0,
                "oneCode": "1010",
                "period": "201601",
                "saId": 0,
                "status": 0,
                "subjectName": "现金",
                "thrCode": "001",
                "twoCode": "001",
                "voucher": null,
                "word": "DR"
            },
            {
                "abstracts": "摘要",
                "aid": 1,
                "assistant": null,
                "businessTime": null,
                "createTime": null,
                "credit": 0.0,
                "debit": 100.0,
                "oneCode": "1020",
                "period": "201601",
                "saId": 0,
                "status": 0,
                "subjectName": "银行卡",
                "thrCode": "001",
                "twoCode": "001",
                "voucher": null,
                "word": "DR"
            }
        ],
        "attachmentNum": 0,
        "auditTime": null,
        "auditor": null,
        "authorizer": null,
        "cashier": null,
        "comment": "",
        "createTime": "2016-09-18",
        "lockFlag": null,
        "originator": {
            "currentName": "白雪",
            "dept": null,
            "deptType": "设计部",
            "duty": "设计师",
            "uid": 2146,
            "userId": "U001",
            "userName": "白雪",
        },
        "period": "201610",
        "postTime": "2016-09-18",
        "postor": null,
        "reference": "",
        "status": 1,
        "vid": 1,
        "voucherId": "1100000019",
        "word": "DR",
        "wordnum": 0
    },
    ...
}
```


##### `功能` addVoucher

添加凭证信息 , 在添加凭证信息之前 , 账目信息以及辅助核算项目信息存储到临时数据中 , 通过ID列表进行关联动作

**Requests:**

- `voucher.word` (String): 字号 , 格式为XX , 两位大写字符组成
- `voucher.reference` (String): 说明
- `voucher.createTime` (Timestamp): 创建时间
- `voucher.attachmentNum` (Integer): 附件数
- `voucher.comment` (String): 备注

```json
{
    "voucher.word": "DD",
    "voucher.reference": "说明",
    "voucher.createTime": "2016-01-01 00:00:00",
    "voucher.attachmentNum": 0,
    "voucher.comment": "备注",
    "atIds[0]": 152,
    "atIds[1]": 352
}
```


##### `功能` updateVoucher

更新凭证信息 , 只有预制凭证能够进行更新动作

更新动作利用临时数据与凭证中账目和辅助核算项信息进行比较 , 之后完成更新动作

**Requests:**

- `voucher.vid` (Long): 凭证ID
- `voucher.reference` (String): 说明
- `voucher.createTime` (Timestamp): 创建时间
- `voucher.postTime` (Timestamp): 过账时间
- `voucher.attachmentNum` (Integer): 附件数
- `voucher.comment` (String): 备注

```json
{
    "voucher.vid": 1,
    "voucher.word": "DD",
    "voucher.reference": "说明",
    "voucher.createTime": "2016-01-01 00:00:00",
    "voucher.attachmentNum": 0,
    "voucher.comment": "备注",
    "atIds[0]": 152,
    "atIds[1]": 352,
    "uatIds[0]": 452,
    "datIds[0]": 23
}
```


##### `功能` postVoucher

过账凭证

**Requests:**

- `voucher.vid` (Long): 凭证ID

```json
{
    "voucher.vid": 1,
}
```


##### `功能` postVouchers

批量过账凭证

**Requests:**


```json
{
    "vids[n]": 32,
}
```


##### `功能` inpostVoucher

反审核凭证

**Requests:**

- `voucher.vid` (Long): 凭证ID

```json
{
    "voucher.vid": 1,
}
```

## 账目


账目信息管理


> **类**: `api.finance.AccountAction`


#### 数据类型: `account`

| 参数 | 说明 | 类型 |
|------|------|------|
| `aid` | 账目ID | Long |
| `voucher` | 所属凭证 , 类型 [voucher ](./finance.html#api.system.RegionAction.voucher) | Object |
| `assistant` | 辅助核算项 , 类型 [assistant ](./finance.html#api.system.RegionAction.assistant) | Object |
| `word` | 字号 | String |
| `createTime` | 创建时间 | Timestamp |
| `period` | 期间 | String |
| `saId` | 序号 | Integer |
| `abstracts` | 摘要 | String |
| `oneCode` | 一级编号 | String |
| `twoCode` | 二级编号 | String |
| `thrCode` | 三级编号 | String |
| `subjectName` | 科目名称 | String |
| `debit` | 借金额 | Float |
| `credit` | 贷金额 | Float |
| `businessTime` | 业务时间 | Timestamp |
| `status` | 状态 , 0: 预制 , 1: 正式 , 2: 关闭 | Short |


#### 数据类型: `assistant`

| 参数 | 说明 | 类型 |
|------|------|------|
| `assistant.aid` | 辅助核算项ID | Long |
| `assistant.orderId` | 订单号 | String |
| `assistant.orderAddr` | 楼盘地址 | String |
| `assistant.msoNo` | 主材订单号 | String |
| `assistant.user` | 员工 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `assistant.department` | 部门 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `assistant.designRegion` | 设计分区 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `assistant.designDepartment` | 设计部 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `assistant.deginer` | 设计师 , 类型 [user ](./user.html#api.personel.UserAction.user) |  |
| `assistant.businessRegion` | 业务分区 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `assistant.businessDepartment` | 业务部 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `assistant.salesman` | 业务员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `assistant.supervisDepartment` | 监理部 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `assistant.supervisor` | 监理 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `assistant.workDepartment` | 工人部 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `assistant.worker` | 工人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `assistant.officeDepartment` | 职能部 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `assistant.officer` | 职能员工 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `assistant.materialDepartment` | 主材部 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `assistant.materialer` | 主材员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `assistant.brandName` | 型号名 | String |
| `assistant.company` | 公司 | Short |


:param a.ou: 创建人ID
:type a.ou: String
:param a.pu: 过账人ID
:type a.pu: String
:param a.ct: 创建时间
:type a.ct: String
:param a.pt: 过账时间
:type a.pt: String
:param a.p: 期间
:type a.p: String
:param c.oi: 订单编号
:type c.oi: String
:param c.mn: 主材订单编号
:type c.mn: String
:param c.du: 设计师ID
:type c.du: String
:param c.su: 业务员ID
:type c.su: String
:param c.vu: 监理ID
:type c.vu: String
:param c.wu: 工人ID
:type c.wu: String
:param c.ou: 员工ID
:type c.ou: String
:param c.mu: 主材人员ID
:type c.mu: String
:param c.dr: 设计大区ID
:type c.dr: String
:param c.dd: 设计部ID
:type c.dd: String
:param c.br: 业务大区ID
:type c.br: String
:param c.db: 业务部ID
:type c.db: String
:param c.sd: 监理部ID
:type c.sd: String
:param c.wd: 工人部ID
:type c.wd: String
:param c.od: 员工部ID
:type c.od: String
:param c.md: 主材部ID
:type c.md: String


##### `功能` pageAccount

分页方式获取账目信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 账目信息列表 , 每条数据类型 `account`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "abstracts": "摘要",
                "aid": 1,
                "assistant": null,
                "businessTime": null,
                "createTime": null,
                "credit": 0.0,
                "debit": 100.0,
                "oneCode": "1010",
                "period": "201601",
                "saId": 0,
                "status": 0,
                "subjectName": "现金",
                "thrCode": "001",
                "twoCode": "001",
                "voucher": {
                    "accounts": null,
                    "attachmentNum": 0,
                    "auditTime": null,
                    "auditor": null,
                    "authorizer": null,
                    "cashier": null,
                    "comment": "",
                    "createTime": "2016-09-18",
                    "lockFlag": null,
                    "originator": {
                        "currentName": "白雪",
                        "dept": null,
                        "deptType": "设计部",
                        "duty": "设计师",
                        "uid": 2146,
                        "userId": "U001",
                        "userName": "白雪",
                    },
                    "period": "201601",
                    "postTime": "2016-01-01",
                    "postor": null,
                    "reference": "",
                    "status": 1,
                    "vid": 1,
                    "voucherId": "1100000019",
                    "word": "DR",
                    "wordnum": 0
                },
                "word": "DR"
            }
        ],
        ...
    },
    ...
}
```


##### `功能` queryAccountByAId

通过账目编号获取账目信息

**Requests:**

- `account.aid` (Long): 账目ID

```json
{
    "account.aid": 1
}
```

**Returns:**

- `account` (object): 账目信息 , 类型 `account`

```json
{
    ...
    "account":{
        "abstracts": "摘要",
        "aid": 1,
        "assistant": null,
        "businessTime": null,
        "createTime": null,
        "credit": 0.0,
        "debit": 100.0,
        "oneCode": "1010",
        "period": "201601",
        "saId": 0,
        "status": 0,
        "subjectName": "现金",
        "thrCode": "001",
        "twoCode": "001",
        "voucher": {
            "accounts": null,
            "attachmentNum": 0,
            "auditTime": null,
            "auditor": null,
            "authorizer": null,
            "cashier": null,
            "comment": "",
            "createTime": "2016-09-18",
            "lockFlag": null,
            "originator": {
                "currentName": "白雪",
                "dept": null,
                "deptType": "设计部",
                "duty": "设计师",
                "uid": 2146,
                "userId": "U001",
                "userName": "白雪",
            },
            "period": "201601",
            "postTime": "2016-01-01",
            "postor": null,
            "reference": "",
            "status": 1,
            "vid": 1,
            "voucherId": "1100000019",
            "word": "DR",
            "wordnum": 0
        },
        "word": "DR"
    },
    ...
}
```


##### `功能` queryAccountForFormalByAId

通过账目编号获取账目信息 , 同时将账目以及辅助核算项目信息提交到临时数据中 , 以便提供编辑操作

**Requests:**

- `account.aid` (Long): 账目ID

```json
{
    "account.aid": 1
}
```

**Returns:**

- `account` (object): 账目信息 , 类型 `account`

```json
{
    ...
    "account":{
        "abstracts": "摘要",
        "aid": 1,
        "assistant": null,
        "businessTime": null,
        "createTime": null,
        "credit": 0.0,
        "debit": 100.0,
        "oneCode": "1010",
        "period": "201601",
        "saId": 0,
        "status": 0,
        "subjectName": "现金",
        "thrCode": "001",
        "twoCode": "001",
        "voucher": {
            "accounts": null,
            "attachmentNum": 0,
            "auditTime": null,
            "auditor": null,
            "authorizer": null,
            "cashier": null,
            "comment": "",
            "createTime": "2016-09-18",
            "lockFlag": null,
            "originator": {
                "currentName": "白雪",
                "dept": null,
                "deptType": "设计部",
                "duty": "设计师",
                "uid": 2146,
                "userId": "U001",
                "userName": "白雪",
            },
            "period": "201601",
            "postTime": "2016-01-01",
            "postor": null,
            "reference": "",
            "status": 1,
            "vid": 1,
            "voucherId": "1100000019",
            "word": "DR",
            "wordnum": 0
        },
        "word": "DR"
    },
    ...
}
```


##### `功能` addAccount

添加账目信息到临时数据中 , 提供提交凭证时进行管理数据使用

**Requests:**

- `account.word` (String): 字号
- `account.period` (String): 期间
- `account.abstracts` (String): 摘要
- `account.oneCode` (String): 一级编号
- `account.twoCode` (String): 二级编号
- `account.thrCode` (String): 三级编号
- `account.subjectName` (String): 科目名称
- `account.debit` (Float): 借金额
- `account.credit` (Float): 贷金额
- `account.assistant.orderId` (String): 订单号
- `account.assistant.orderAddr` (String): 楼盘地址
- `account.assistant.msoNo` (String): 主材订单号
- `account.assistant.user.uid` (Integer): 员工ID
- `account.assistant.department.did` (Integer): 部门ID
- `account.assistant.designRegion.did` (Integer): 设计分区ID
- `account.assistant.designDepartment.did` (Integer): 设计部ID
- `account.assistant.deginer.uid` (Integer): 设计师ID
- `account.assistant.businessRegion.did` (Integer): 业务分区ID
- `account.assistant.businessDepartment.did` (Integer): 业务部ID
- `account.assistant.salesman.uid` (Integer): 业务员ID
- `account.assistant.supervisDepartment.did` (Integer): 监理部
- `account.assistant.supervisor.uid` (Integer): 监理ID
- `account.assistant.workDepartment.did` (Integer): 工人部ID
- `account.assistant.worker.uid` (Integer): 工人ID
- `account.assistant.officeDepartment.did` (Integer): 职能部ID
- `account.assistant.officer.uid` (Integer): 职能员工ID
- `account.assistant.materialDepartment.did` (Integer): 主材部ID
- `account.assistant.materialer.uid` (Integer): 主材员ID
- `account.assistant.brandName` (String): 型号名
- `account.assistant.company` (Short): 公司

```json
{
    "account.subjectName": "现金",
    "account.abstracts": "摘要",
    "account.period": "201601",
    "account.word": "DR",
    "account.credit": 0.0,
    "account.debit": 100.0,
    "account.oneCode": "1010",
    "account.twoCode": "001",
    "account.thrCode": "001",
    "account.assistant.orderId": "1601010001"
}
```


##### `功能` updateAccount

更新账目信息到临时信息中

**Requests:**

- `account.aid` (Long): 账目ID
- `account.word` (String): 字号
- `account.period` (String): 期间
- `account.abstracts` (String): 摘要
- `account.oneCode` (String): 一级编号
- `account.twoCode` (String): 二级编号
- `account.thrCode` (String): 三级编号
- `account.subjectName` (String): 科目名称
- `account.debit` (Float): 借金额
- `account.credit` (Float): 贷金额
- `account.assistant.orderId` (String): 订单号
- `account.assistant.orderAddr` (String): 楼盘地址
- `account.assistant.msoNo` (String): 主材订单号
- `account.assistant.user.uid` (Integer): 员工ID
- `account.assistant.department.did` (Integer): 部门ID
- `account.assistant.designRegion.did` (Integer): 设计分区ID
- `account.assistant.designDepartment.did` (Integer): 设计部ID
- `account.assistant.deginer.uid` (Integer): 设计师ID
- `account.assistant.businessRegion.did` (Integer): 业务分区ID
- `account.assistant.businessDepartment.did` (Integer): 业务部ID
- `account.assistant.salesman.uid` (Integer): 业务员ID
- `account.assistant.supervisDepartment.did` (Integer): 监理部
- `account.assistant.supervisor.uid` (Integer): 监理ID
- `account.assistant.workDepartment.did` (Integer): 工人部ID
- `account.assistant.worker.uid` (Integer): 工人ID
- `account.assistant.officeDepartment.did` (Integer): 职能部ID
- `account.assistant.officer.uid` (Integer): 职能员工ID
- `account.assistant.materialDepartment.did` (Integer): 主材部ID
- `account.assistant.materialer.uid` (Integer): 主材员ID
- `account.assistant.brandName` (String): 型号名
- `account.assistant.company` (Short): 公司

```json
{
    "account.aid": 2,
    "account.subjectName": "现金",
    "account.abstracts": "摘要",
    "account.period": "201601",
    "account.word": "DR",
    "account.credit": 0.0,
    "account.debit": 100.0,
    "account.oneCode": "1010",
    "account.twoCode": "001",
    "account.thrCode": "001",
    "account.assistant.orderId": "1601010001"
}
```


##### `功能` deleteAccount

删除临时账目信息

**Requests:**

- `account.aid` (Long): 账目ID

```json
{
    "account.aid": 2
}
```
