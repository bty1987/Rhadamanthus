# 结算


## 帐户


> **类**: `api.balance.BalanceAccountAction`


#### 数据类型: `balanceAccount`

| 参数 | 说明 | 类型 |
|------|------|------|
| `baid` | 帐户ID | Long |
| `name` | 名称 | String |
| `belonger` | 归属人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `referMoney` | 应付额 | Long |
| `realMoney` | 实付额 | Long |
| `money` | 操作额 | Long |
| `surplus` | 余额 | Long |
| `type` | 类型 , 0: 结算 , 1: 出纳 | Short |
| `status` | 状态 , 0: 有效 , 1: 无效 | Short |
| `company` | 公司 | Integer |


##### `查询` pageBalanceAccount

分页方式获取帐户信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 帐户信息列表 , 每条数据类型 `balanceAccount`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "aid": 1,
                "name": "帐户",
                "belonger": {
                    "uid": 1,
                    "userId": "U021",
                    "userName": "归属人",
                    "currentName": "归属人"
                },
                "creater": {
                    "uid": 1,
                    "userId": "U022",
                    "userName": "创建人",
                    "currentName": "创建人"
                },
                "createTime": "2016-01-01 00:00:00",
                "referMoney": 10000,
                "realMoney": 10000,
                "surplus": 10000,
                "status": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryBalanceAccount

通过归属人ID获取帐户信息 , 帐户类型为结算

**Requests:**

- `balanceAccount.belonger.uid` (Long): 归属人ID

```json
{
    "balanceAccount.belonger.uid": 1
}
```

**Returns:**

- `balanceAccounts` (List): 帐户列表 , 每条数据类型 `balanceAccount`

```json
{
    ...
    "balanceAccounts": [
        {
            "baid": 1,
            "name": "帐户",
            "belonger": {
                "uid": 1,
                "userId": "U021",
                "userName": "归属人",
                "currentName": "归属人"
            },
            "creater": {
                "uid": 1,
                "userId": "U022",
                "userName": "创建人",
                "currentName": "创建人"
            },
            "createTime": "2016-01-01 00:00:00",
            "referMoney": 10000,
            "realMoney": 10000,
            "surplus": 10000,
            "status": 0
        }
    ],
    ...
}
```


##### `查询` queryBalanceAccountForTeller

通过公司ID获取帐户信息 , 类型为出纳

**Returns:**

- `balanceAccounts` (List): 帐户列表 , 每条数据类型 `balanceAccount`

```json
{
    ...
    "balanceAccounts": [
        {
            "aid": 1,
            "name": "帐户",
            "belonger": {
                "uid": 1,
                "userId": "U021",
                "userName": "归属人",
                "currentName": "归属人"
            },
            "creater": {
                "uid": 1,
                "userId": "U022",
                "userName": "创建人",
                "currentName": "创建人"
            },
            "createTime": "2016-01-01 00:00:00",
            "referMoney": 10000,
            "realMoney": 10000,
            "surplus": 10000,
            "status": 0
        }
    ],
    ...
}
```


##### `查询` addBalanceAccount

添加帐户

**Requests:**

- `balanceAccount.name` (String): 名称
- `balanceAccount.belonger.uid` (Long): 归属人ID

```json
{
    "balanceAccount.name": "帐户",
    "balanceAccount.belonger.uid": 1
}
```


##### `查询` updateBalanceAccountForStatus

更新帐户状态

判断帐户是否存在 , 不存在 , 错误信息 **350001 帐户不存在**

**Requests:**

- `balanceAccount.aid` (Long): 帐户ID

```json
{
    "balanceAccount.aid": 1
}
```


##### `查询` withdrawBalanceAccount

提款

判断帐户是否存在 , 不存在 , 错误信息 **350001 帐户不存在**

判断帐户余额是否满足操作额度 , 不满足 , 错误信息 **350003 帐户金额不足**

根据 帐户余额 = 应付额 - 实付额 公式 , 对应更新实付额以及余额

生成类型为2(提)的结算单

**Requests:**

- `balanceAccount.aid` (Long): 帐户ID
- `balanceAccount.money` (Long): 操作额

```json
{
    "balanceAccount.aid": 1,
    "balanceAccount.money": 10000
}
```

## 扣款


> **类**: `api.balance.BalanceDccountAction`


#### 数据类型: `balanceDccount`

| 参数 | 说明 | 类型 |
|------|------|------|
| `bdid` | 扣款ID | Long |
| `name` | 名称 | String |
| `type` | 类型 , 0: 扣款 , 1: 返款 | Short |
| `belonger` | 归属人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 操作时间 | Timestamp |
| `startTime` | 开始时间 | Timestamp |
| `endTime` | 结束时间 | Timestamp |
| `cutpay` | 总额 | Long |
| `surplus` | 余额 | Long |
| `status` | 状态 , 0: 有效 , 1: 失效 |  |
| `comment` | 说明 | String |
| `company` | 公司 | Integer |


##### `查询` pageBalanceDccount

分页方式获取扣款信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 扣款信息列表 , 每条数据类型 `balanceDccount`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "bdid": 1,
                "name": "扣款名称",
                "type": 0,
                "belonger": {
                    "uid": 1,
                    "userId": "U021",
                    "userName": "归属人",
                    "currentName": "归属人"
                },
                "creater": {
                    "uid": 1,
                    "userId": "U022",
                    "userName": "创建人",
                    "currentName": "创建人"
                },
                "createTime": "2016-01-01 00:00:00",
                "startTime": "2016-01-01",
                "endTime": "2016-01-01",
                "cutpay": 1000,
                "surplus": 1000,
                "status": 0,
                "comment": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryBalanceDccount

获取扣款信息

**Requests:**

- `balanceDccount.belonger.uid` (Long): 归属人ID

```json
{
    "balanceDccount.belonger.uid": 1
}
```

- `balanceDccounts` (List): 扣款信息列表 , 每条数据类型 `balanceDccount`

```json
{
    ...
    "balanceDccounts": [
        {
            "bdid": 1,
            "name": "扣款名称",
            "type": 0,
            "belonger": {
                "uid": 1,
                "userId": "U021",
                "userName": "归属人",
                "currentName": "归属人"
            },
            "creater": {
                "uid": 1,
                "userId": "U022",
                "userName": "创建人",
                "currentName": "创建人"
            },
            "createTime": "2016-01-01 00:00:00",
            "startTime": "2016-01-01",
            "endTime": "2016-01-01",
            "cutpay": 1000,
            "surplus": 1000,
            "status": 0,
            "comment": ""
        }
    ],
    ...
}
```


##### `查询` addBalanceDccount

创建扣款信息

**Requests:**

- `balanceDccount.name` (String): 名称
- `balanceDccount.belonger.uid` (Long): 归属人ID
- `balanceDccount.startTime` (Timestamp): 开始时间
- `balanceDccount.endTime` (Timetamp): 结束时间
- `balanceDccount.cutpay` (Long): 扣款
- `balanceDccount.comment` (String): 说明

```json
{
    "balanceDccount.name": "name",
    "balanceDccount.belonger.uid": 1,
    "balanceDccount.startTime": "2016-01-01",
    "balanceDccount.endTime": "2016-01-01",
    "balanceDccount.cutpay": 100000,
    "balanceDccount.comment": "说明"
}
```


##### `查询` updateBalanceDccount

更新扣款信息

**Requests:**

- `balanceDccount.bdid` (String): 扣款ID
- `balanceDccount.name` (String): 名称
- `balanceDccount.startTime` (Timestamp): 开始时间
- `balanceDccount.endTime` (Timetamp): 结束时间
- `balanceDccount.cutpay` (Long): 扣款
- `balanceDccount.comment` (String): 说明

```json
{
    "balanceDccount.bdid": 1,
    "balanceDccount.name": "name",
    "balanceDccount.startTime": "2016-01-01",
    "balanceDccount.endTime": "2016-01-01",
    "balanceDccount.cutpay": 100000,
    "balanceDccount.comment": "说明"
}
```


##### `查询` updateBalanceDccountForStatus

更新扣款信息状态

**Requests:**

- `balanceDccount.bdid` (String): 扣款ID
- `balanceDccount.status` (Short): 状态

```json
{
    "balanceDccount.bdid": 1,
    "balanceDccount.status": 0
}
```

## 结算单


> **类**: `api.balance.BalanceAction`


#### 数据类型: `balance`

| 参数 | 说明 | 类型 |
|------|------|------|
| `bid` | 结算单ID | Long |
| `no` | 编号 | String |
| `belonger` | 归属人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `startTime` | 开始时间 | Timestamp |
| `endTime` | 结束时间 | Timestamp |
| `amount` | 金额 | Long |
| `surplus` | 余额 | Long |
| `cutpay` | 扣款 | Long |
| `type` | 类型 , 0: 支 , 1: 收 , 2: 提 | Short |
| `status` | 状态 , 0: 初始 , 1: 已付 , 2: 完结 | Short |
| `ispay` | 付款标识 , 0: 未付 , 1: 已付 | Short |
| `company` | 公司 | Integer |


##### `查询` pageBalance

分页方式获取结算单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 结算单信息列表 , 每条数据类型 `balance`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "bid": 1,
                "no": "1601010001",
                "belonger": {
                    "uid": 1,
                    "userId": "U021",
                    "userName": "归属人",
                    "currentName": "归属人"
                },
                "creater": {
                    "uid": 1,
                    "userId": "U022",
                    "userName": "创建人",
                    "currentName": "创建人"
                },
                "createTime": "2016-01-01 00:00:00",
                "startTime": "2016-01-01",
                "endTime": "2016-01-01",
                "amount": 1000,
                "surplus": 1000,
                "type": 0,
                "status": 0,
                ispay: 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryBalance

获取结算单信息

**Requests:**

- `balance.belonger.uid` (Long): 归属人ID
- `balance.status` (Short): 状态

```json
{
    "balance.belonger.uid": 1,
    "balance.status": 0
}
```

- `balances` (List): 结算单信息列表 , 每条数据类型 `balance`

```json
{
    ...
    "balances": [
        {
            "bid": 1,
            "no": "1601010001",
            "belonger": {
                "uid": 1,
                "userId": "U021",
                "userName": "归属人",
                "currentName": "归属人"
            },
            "creater": {
                "uid": 1,
                "userId": "U022",
                "userName": "创建人",
                "currentName": "创建人"
            },
            "createTime": "2016-01-01 00:00:00",
            "startTime": "2016-01-01",
            "endTime": "2016-01-01",
            "amount": 1000,
            "surplus": 1000,
            "type": 0,
            "status": 0,
            ispay: 0
        }
    ],
    ...
}
```


##### `查询` addBalance

添加结算单

**Requests:**

- `balance.belonger.uid` (Long): 归属人ID
- `balance.startTime` (Timestamp): 开始时间
- `balance.endTime` (Timestamp): 结束时间
- `balance.amount` (Long): 金额

```json
{
    "balance.belonger.uid": 1,
    "balance.startTime": "2016-01-01",
    "balance.endTime": "2016-01-01",
    "balance.amount": 1000
}
```


##### `查询` balanceBalance

结算

判断结算单是否存在 , 不存在 , 错误信息 **350006 结算单不存在**

判断帐户是否存在 , 不存在 , 错误信息 **350001 帐户不存在**

判断帐户和结算单是否为统一归属人 , 存在不一致 , 错误信息 **350007 结算归属不一致**

判断帐户余额是否满足操作额度 , 不满足 , 错误信息 **350003 帐户金额不足**

结算过程 , 操作帐户类型为0(结算)

结算过程中 , 结算单类型与帐户应付款/实付款/余额之间的关系

收类型结算单对应的操作额 , 增加帐户中的应付款额度

支类型结算单对应的操作额 , 增加帐户中的实付款额度

帐户中余额 = 应付款 - 实付款

**Requests:**

- `balance.bid` (Long): 结算单ID

```json
{
    "balance.belonger.uid": 1,
    "balance.amount": 1000
}
```


##### `查询` payBalance

出纳

判断结算单是否存在 , 不存在 , 错误信息 **350006 结算单不存在**

判断帐户是否存在 , 不存在 , 错误信息 **350001 帐户不存在**

结算过程 , 操作帐户类型为1(出纳)

出纳过程 , 不更新帐户中的应付额/实付额/余额 , 记录操作过程金额 , 生成结算明细

**Requests:**

- `balance.bid` (Long): 结算单ID

```json
{
    "balance.bid": 1,
    "balance.amount": 1000

    "account[0].aid": 1,
    "account[0].money": 1000,
}
```


##### `查询` payedBalance

付款

判断结算单是否存在 , 不存在 , 错误信息 **350006 结算单不存在**

**Requests:**


```json
{
    "balances[0].bid": 1,
}
```

## 结算明细


> **类**: `api.balance.BalanceDetailAction`


#### 数据类型: `balanceDetail`

| 参数 | 说明 | 类型 |
|------|------|------|
| `bdid` | 结算明细ID | Long |
| `account` | 帐户 , 类型 [account ](./account.html#api.balance.AccountAction.account) | Object |
| `balance` | 结算单 , 类型 [balance ](./balance.html#api.balance.BalanceAction.balance) | Object |
| `operater` | 操作人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `operateTime` | 操作时间 | Timestamp |
| `money` | 金额 | Long |


##### `查询` queryBalanceDetailForBalance

根据结算单ID获取结算明细

**Requests:**

- `balanceDetail.balance.bid` (Long): 结算单ID

```json
{
    "balanceDetail.balance.bid": 1
}
```

**Returns:**

- `balanceDetails` (List): 帐户明细列表 , 每条数据类型 `balanceDetail`

```json
{
    ...
    "balanceDetails": [
        {
            "bdid": 1,
            "account": {
                "aid": 1,
                "name": "帐户",
                "belonger": {
                    "uid": 1,
                    "userId": "U021",
                    "userName": "归属人",
                    "currentName": "归属人"
                },
                "creater": {
                    "uid": 1,
                    "userId": "U022",
                    "userName": "创建人",
                    "currentName": "创建人"
                }
            },
            "operater": {
                "uid": 1,
                "userId": "U021",
                "userName": "归属人",
                "currentName": "归属人"
            },
            "operateTime": "2016-01-01 00:00:00",
            "money": 10000
        }
    ],
    ...
}
```

## 结算扣款


> **类**: `api.balance.BalanceCutpayAction`


#### 数据类型: `balanceCutpay`

| 参数 | 说明 | 类型 |
|------|------|------|
| `bcid` | 扣款ID | Long |
| `name` | 名称 | String |
| `balance` | 结算单 , 类型 [balance ](./balance.html#api.balance.BalanceAction.balance) | Object |
| `cutpay` | 总额 | Long |
| `dccount` | 关联扣款 , 类型 [balanceDccount ](./balance.html#api.balance.BalanceDccountAction.balanceDccount) | Object |
| `type` | 类型 , 0: 扣款 , 1: 返款 | Short |
| `operater` | 操作人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `operateTime` | 操作时间 | Timestamp |
| `money` | 金额 | Integer |
| `cutpay` | 总额 | Long |
| `comment` | 说明 | String |


##### `查询` pageBalanceCutpay

分页方式获取结算扣款信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Requests:**

- `balanceCutpay.balance.bid` (Long): 结算单ID
- `balanceCutpay.dccount.bdid` (Long): 结算扣款

```json
{
    "balanceCutpay.balance.bid": 1,
    "balanceCutpay.dccount.bdid": 1
}
```

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 结算扣款信息列表 , 每条数据类型 `balanceCutpay`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "bcid": 1,
                "balance": {
                    "bid": 1,
                    "no": "1601010001",
                    ...
                },
                "cutpay": null,
                "dccount": null,
                "type": 0,
                "operater": {
                    "uid": 1,
                    "userId": "U021",
                    "userName": "归属人",
                    "currentName": "归属人"
                },
                "operateTime": "2016-01-01 00:00:00",
                "money": 10000,
                "cutpay": 10000,
                "comment": "说明"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryBalanceCutpay

通过结算单主键查询扣款信息

**Requests:**

- `balanceCutpay.balance.bid` (Long): 结算单ID
- `balanceCutpay.dccount.bdid` (Long): 结算扣款

```json
{
    "balanceCutpay.balance.bid": 1,
    "balanceCutpay.dccount.bdid": 1
}
```

**Returns:**

- `balanceCutpays` (List): 结算扣款列表 , 每条数据类型 `balanceCutpay`

```json
{
    ...
    "balanceCutpays": [
        {
            "bcid": 1,
            "balance": {
                "bid": 1,
                "no": "1601010001",
                ...
            },
            "cutpay": null,
            "dccount": null,
            "type": 0,
            "operater": {
                "uid": 1,
                "userId": "U021",
                "userName": "归属人",
                "currentName": "归属人"
            },
            "operateTime": "2016-01-01 00:00:00",
            "money": 10000,
            "cutpay": 10000,
            "comment": "说明"
        }
    ],
    ...
}
```


##### `查询` addBalanceCutpay

添加扣款信息

**Requests:**

- `balanceCutpay.balance.bid` (Long): 结算单ID
- `blanaceCutpay.dccount.bdid` (Long): 关联扣款ID
- `balanceCutpay.type` (Short): 类型
- `balanceCutpay.money` (Integer): 金额
- `balanceCutpay.comment` (String): 说明

```json
{
    "balanceCutpay.balance.bid": 1,
    "balanceCutpay.dccount.bdid": 1,
    "balanceCutpay.type": 0,
    "balanceCutpay.money": 10000,
    "balanceCutpay.comment": "说明"
}
```


##### `查询` deductBalanceCutpay

抵扣

**Requests:**

- `balanceCutpay.balance.bid` (Long): 结算单ID
- `balanceCutpay.cutpay.bcid` (Long): 关联扣款ID
- `balanceCutpay.money` (Integer): 金额
- `balanceCutpay.comment` (String): 说明

```json
{
    "balanceCutpay.balance.bid": 1,
    "balanceCutpay.cutpay.bcid": 1,
    "balanceCutpay.type": 0,
    "balanceCutpay.money": 10000,
    "balanceCutpay.comment": "说明"
}
```

## 分摊明细


> **类**: `api.balance.ApportDetailAction`


#### 数据类型: `apportDetail`

| 参数 | 说明 | 类型 |
|------|------|------|
| `adid` | 分摊明细ID | Long |
| `bid` | 结算单ID | Long |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `money` | 金额 | Long |
| `comment` | 说明 | String |


##### `查询` queryApportDetailForBalance

通过结算单ID获取分摊明细

**Requests:**

- `apportDetail.bid` (Long): 结算单ID

```json
{
    "apportDetail.bid": 1
}
```

**Returns:**

- `apportDetails` (List): 分摊明细列表 , 每条数据类型 `apportDetail`

```json
{
    ...
    "apportDetails": [
        {
            "bdid": 1,
            "creater": {
                "uid": 1,
                "userId": "U021",
                "userName": "归属人",
                "currentName": "归属人"
            },
            "createTime": "2016-01-01 00:00:00",
            "money": 10000,
            "comment": "说明"
        }
    ],
    ...
}
```


##### `查询` addApportDetail

添加分摊明细

判断结算单是否存在 , 不存在 , 错误信息 **350006 结算单不存在**

**Requests:**

- `apportDetail.bid` (Long): 结算单ID
- `apportDetail.money` (Long): 分摊额
- `apportDetail.comment` (String): 说明

```json
{
    "apportDetail.bid": 1,
    "apportDetail.money": 10000,
    "apportDetail.comment": "说明",
}
```

## 结算销售


### 结算


> **类**: `api.balance.BalanceSalesAction`


#### 数据类型: `balanceSales`

| 参数 | 说明 | 类型 |
|------|------|------|
| `bsid` | 结算销售ID | Long |
| `bid` | 结算单ID | Long |
| `balance` | 结算单 , 类型 [balance ](./sales.html#api.sales.BalanceAction.balance) | Object |
| `name` | 名称 | String |
| `brand` | 品牌 , 类型 [brand ](./data.html#api.data.BrandAction.brand) | Object |
| `grade` | 等级 | String |
| `income` | 收入 | Long |
| `cost` | 成本 | Long |
| `payment` | 应付 | Long |
| `profit` | 利润 | Long |
| `status` | 状态 , 0: 初始 , 1: 锁定, 2: 结算 , 3: 完结 | Short |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `balancer` | 结算人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `lockTime` | 锁定时间 | Timestamp |
| `balanceTime` | 结算时间 | Timestamp |
| `company` | 公司 | Integer |


##### `查询` pageBalanceSales

分页方式获取结算销售信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 结算销售信息列表 , 每条数据类型 `balanceSales`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "bsid": 1,
                "bid": 1,
                "name": "结算销售",
                "brand": {
                    "bid": 1,
                    "no": "B001",
                    "name": "品牌",
                    "pinyin": "pinpai",
                    "category": {
                        "cid": 1,
                        "no": "C001",
                        "name": "地板"
                    },
                    "supplier": {
                        "uid": 1000,
                        "userId": "OC001",
                        "currentName": "厂商",
                        "userName": "厂商"
                    },
                },
                "grade": "A",
                "income": 0,
                "cost": 0,
                "payment": 0,
                "profit": 0,
                "creater": {
                    "uid": 1,
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师" 
                },
                "balancer": {
                    "uid": 1,
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师" 
                },
                "createTime": "2016-01-01",
                "lockTime": "2016-01-01",
                "balanceTime": "2016-01-01"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageBalanceSalesForBalance

分页方式获取结算销售信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 结算销售信息列表 , 每条数据类型 `balanceSales`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "bsid": 1,
                "bid": 1,
                "balance": {
                    "bid": 1,
                    "no": "1601010001",
                    "belonger": {
                        "uid": 1,
                        "userId": "U021",
                        "userName": "归属人",
                        "currentName": "归属人"
                    },
                    "creater": {
                        "uid": 1,
                        "userId": "U022",
                        "userName": "创建人",
                        "currentName": "创建人"
                    },
                    "createTime": "2016-01-01 00:00:00",
                    "startTime": "2016-01-01",
                    "endTime": "2016-01-01",
                    "amount": 1000,
                    "surplus": 1000,
                    "type": 0,
                    "status": 0
                },
                "name": "结算销售",
                "brand": {
                    "bid": 1,
                    "no": "B001",
                    "name": "品牌",
                    "pinyin": "pinpai",
                    "category": {
                        "cid": 1,
                        "no": "C001",
                        "name": "地板"
                    },
                    "supplier": {
                        "uid": 1000,
                        "userId": "OC001",
                        "currentName": "厂商",
                        "userName": "厂商"
                    },
                },
                "grade": "A",
                "income": 0,
                "cost": 0,
                "payment": 0,
                "profit": 0,
                "creater": {
                    "uid": 1,
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师" 
                },
                "balancer": {
                    "uid": 1,
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师" 
                },
                "createTime": "2016-01-01",
                "lockTime": "2016-01-01",
                "balanceTime": "2016-01-01"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryBalanceSales

查询结算销售 , 状态为0(初始)

**Requests:**

- `balanceSales.name` (String): 名称

```json
{
    "balanceSales.name:": "结算销售"
}
```

**Returns:**

- `balanceSaleses` (List): 结算销售信息列表 , 每条数据类型 `balanceSales`

```json
{
    ...
    "balanceSaleses": [
        {
            "bsid": 1,
            "bid": 1,
            "name": "结算销售",
            "brand": {
                "bid": 1,
                "no": "B001",
                "name": "品牌",
                "pinyin": "pinpai",
                "category": {
                    "cid": 1,
                    "no": "C001",
                    "name": "地板"
                },
                "supplier": {
                    "uid": 1000,
                    "userId": "OC001",
                    "currentName": "厂商",
                    "userName": "厂商"
                },
            },
            "grade": "A",
            "income": 0,
            "cost": 0,
            "payment": 0,
            "profit": 0,
            "creater": {
                "uid": 1,
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师" 
            },
            "balancer": {
                "uid": 1,
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师" 
            },
            "createTime": "2016-01-01",
            "lockTime": "2016-01-01",
            "balanceTime": "2016-01-01"
        }
    ],
    ...
}
```


##### `查询` queryBalanceSalesByBsid

通过结算单ID查询结算销售

**Requests:**

- `balanceSales.bsid` (Long): 结算销售ID

```json
{
    "balanceSales.bsid:": 1
}
```

**Returns:**

- `balanceSales` (Object): 结算销售信息 , 类型 `balanceSales`

```json
{
    ...
    "balanceSales": {
        "bsid": 1,
        "bid": 1,
        "name": "结算销售",
        "brand": {
            "bid": 1,
            "no": "B001",
            "name": "品牌",
            "pinyin": "pinpai",
            "category": {
                "cid": 1,
                "no": "C001",
                "name": "地板"
            },
            "supplier": {
                "uid": 1000,
                "userId": "OC001",
                "currentName": "厂商",
                "userName": "厂商"
            },
        },
        "grade": "A",
        "income": 0,
        "cost": 0,
        "payment": 0,
        "profit": 0,
        "creater": {
            "uid": 1,
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师" 
        },
        "balancer": {
            "uid": 1,
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师" 
        },
        "createTime": "2016-01-01",
        "lockTime": "2016-01-01",
        "balanceTime": "2016-01-01"
    }
    ...
}
```


##### `查询` queryBalanceSalesByBid

通过结算单ID查询结算销售

**Requests:**

- `balanceSales.bid` (Long): 结算单ID

```json
{
    "balanceSales.bid:": 1
}
```

**Returns:**

- `balanceSales` (Object): 结算销售信息 , 类型 `balanceSales`

```json
{
    ...
    "balanceSales": {
        "bsid": 1,
        "bid": 1,
        "name": "结算销售",
        "brand": {
            "bid": 1,
            "no": "B001",
            "name": "品牌",
            "pinyin": "pinpai",
            "category": {
                "cid": 1,
                "no": "C001",
                "name": "地板"
            },
            "supplier": {
                "uid": 1000,
                "userId": "OC001",
                "currentName": "厂商",
                "userName": "厂商"
            },
        },
        "grade": "A",
        "income": 0,
        "cost": 0,
        "payment": 0,
        "profit": 0,
        "creater": {
            "uid": 1,
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师" 
        },
        "balancer": {
            "uid": 1,
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师" 
        },
        "createTime": "2016-01-01",
        "lockTime": "2016-01-01",
        "balanceTime": "2016-01-01"
    }
    ...
}
```


##### `查询` amountBalanceSales

汇总结算销售

**Requests:**

- `balanceSales.bsid` (Long): 结算销售ID

```json
{
    "balanceSales.bsid": 1
}
```


##### `查询` createBalanceSales

创建结算销售

**Requests:**

- `balanceSales.name` (String): 名称
- `balanceSales.brand.bid` (Long): 品牌ID
- `balanceSales.grade` (String): 等级

```json
{
    "balanceSales.name": "结算销售",
    "balanceSales.brand.bid": 1,
    "balanceSales.grade": "A"
}
```


##### `查询` updateBalanceSales

更新结算销售

判断结算销售是否存在 , 不存在 , 错误信息 **350017 结算销售不存在**

判断结算销售状态为0(初始) , 其他状态 , 错误信息 **350018 结算销售不可操作**

**Requests:**

- `balanceSales.bsid` (Long): 结算销售ID
- `balanceSales.name` (String): 名称

```json
{
    "balanceSales.bsid": 1,
    "balanceSales.name": "结算销售"
}
```


##### `查询` submitBalanceSales

提交结算销售

判断结算销售是否存在 , 不存在 , 错误信息 **350017 结算销售不存在**

判断结算销售状态为0(初始) , 其他状态 , 错误信息 **350018 结算销售不可操作**

**Requests:**

- `balanceSales.bsid` (Long): 结算销售ID
- `balanceSales.income` (Long): 收入
- `balanceSales.cost` (Long): 成本
- `balanceSales.payment` (Long): 应付
- `balanceSales.profit` (Long): 利润

```json
{
    "balanceSales.bsid": 1,
    "balanceSales.income": 0,
    "balanceSales.cost": 0,
    "balanceSales.payment": 0,
    "balanceSales.profit": 0,

    "balanceSalesBalances[0].salesBalance.sbid": 1,
    "balanceSalesBalances[1].salesBalance.sbid": 2
}
```


##### `查询` lockBalanceSales

锁定结算销售

判断结算销售是否存在 , 不存在 , 错误信息 **350017 结算销售不存在**

判断结算销售状态为0(初始) , 其他状态 , 错误信息 **350018 结算销售不可操作**

结算销售状态更新为1(锁定) , 更新锁定时间

**Requests:**

- `balanceSales.bsid` (Long): 结算销售ID

```json
{
    "balanceSales.bsid": 1
}
```


##### `查询` unlockBalanceSales

锁定结算销售

判断结算销售是否存在 , 不存在 , 错误信息 **350017 结算销售不存在**

判断结算销售状态为1(锁定) , 其他状态 , 错误信息 **350018 结算销售不可操作**

结算销售状态更新为0(初始)

**Requests:**

- `balanceSales.bsid` (Long): 结算销售ID

```json
{
    "balanceSales.bsid": 1
}
```


##### `查询` balanceBalanceSales

结算

判断结算销售是否存在 , 不存在 , 错误信息 **350017 结算销售不存在**

判断结算销售状态为1(锁定) , 其他状态 , 错误信息 **350018 结算销售不可操作**

结算销售状态更新为2(结算) , 更新结算人和结算时间

生成对应结算单

**Requests:**

- `balanceSales.bsid` (Long): 结算销售ID

```json
{
    "balanceSales.bsid": 1
}
```


##### `查询` deleteBalanceSales

删除

判断结算销售是否存在 , 不存在 , 错误信息 **350017 结算销售不存在**

判断结算销售状态为0(初始) , 其他状态 , 错误信息 **350018 结算销售不可操作**

判断结算销售明细 , 存在明细数据 , 错误信息 **350021 销售明细存在**

**Requests:**

- `balanceSales.bsid` (Long): 结算销售ID

```json
{
    "balanceSales.bsid": 1
}
```

### 明细


> **类**: `api.balance.BalanceSalesAction`


#### 数据类型: `balanceSalesBalance`

| 参数 | 说明 | 类型 |
|------|------|------|
| `bsbid` | 销售结算ID | Long |
| `bsid` | 结算销售ID | Long |
| `salesBalance` | 销售结算 , 类型 [salesBalance ](./sales.html#api.sales.SalesBalanceAction.salesBalance) | Object |


##### `查询` pageBalanceSalesBalance

分页方式获取结算销售明细信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Requests:**

- `balanceSales.bsid` (Long): 结算销售ID

```json
{
    "balanceSales.bsid:": 1
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 结算销售明细信息列表 , 每条数据类型 `balanceSalesBalance`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "bsbid": 1,
                "bsid": 1,
                "salesBalance": {
                    "sbid": 1,
                    "sales": {
                        "sid": 1,
                        "no": "1601010001",
                        "orderId": "1601010001",
                        "company": 1,
                        "village": {
                            "vid": 6,
                            "no": "P001",
                            "name": "广场一期",
                        },
                        "houseNumber": "A#1-1-1",
                        "customer": {
                            "cid": 1,
                            "no": "1501010001",
                            "name": "李"
                        },
                        "guider": {
                            "uid": 2,
                            "userId": "U0012",
                            "userName": "导购",
                            "currentName": "导购",
                            "duty": "导购"
                        },
                        "instorer": {
                            "uid": 3,
                            "userId": "U0032",
                            "userName": "驻店",
                            "currentName": "驻店",
                            "duty": "驻店导购"
                        },
                        "guideDept": {
                            "did": 1,
                            "no": "D003",
                            "name": "导购一部",
                            "type": "导购部",
                        },
                        "category": "瓷砖",
                        "brand": "瓷砖",
                        "comment": "",
                        "createTime": "2016-01-01 00:00:00",
                        "fullpayTime": "2016-01-01 00:00:00",
                        "balanceTime": "2016-01-01 00:00:00",
                        "status": 0,
                        "balanceStatus": 0,
                        "allowance": 10000,
                        "total": 100000,
                        "amount": 100000,
                        "maling": 0,
                        "venderMaling": 0,
                        "coupon": 0,
                        "couponInfo": ""
                    },
                    "refunds": null,
                    "salesman": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "设计师",
                        "currentName": "设计师",
                        "duty": "设计师"
                    },
                    dept: {
                        "did": 1,
                        "no": "D001",
                        "name": "设计一部",
                        "type": "设计部",
                    },
                    "region": {
                        "did": 2,
                        "no": "D002",
                        "name": "设计一分区",
                        "type": "设计大区",
                    },
                    "creater": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "createTime": "2016-01-01 00:00:00",
                    "poster": null,
                    "postTime": null,
                    "venderTime": null,
                    "checker": null,
                    "checkTime": null,
                    "total": 100.8,
                    "balance": 10000,
                    "difference": 90.8,
                    "vbalance": 0,
                    "pbalance": 0,
                    "type": 0,
                    "onetype": 0,
                    "status": 0,
                    "comment": "说明"
                }
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryBalanceSalesBalance

通过结算销售ID获取销售结算明细信息

**Requests:**

- `balanceSalesBalance.bsid` (Long): 结算销售ID

```json
{
    "balanceSalesBalance.bsid": 1
}
```

**Returns:**

- `balanceSalesBalances` (List): 结算销售信息列表 , 类型 `balanceSalesBalance`

```json
{
    ...
    "balanceSalesBalances": [
        {
            "bsbid": 1,
            "bsid": 1,
            "salesBalance": {
                "sbid": 1,
                "sales": {
                    "sid": 1,
                    "no": "1601010001",
                    "orderId": "1601010001",
                    "company": 1,
                    "village": {
                        "vid": 6,
                        "no": "P001",
                        "name": "广场一期",
                    },
                    "houseNumber": "A#1-1-1",
                    "customer": {
                        "cid": 1,
                        "no": "1501010001",
                        "name": "李"
                    },
                    "guider": {
                        "uid": 2,
                        "userId": "U0012",
                        "userName": "导购",
                        "currentName": "导购",
                        "duty": "导购"
                    },
                    "instorer": {
                        "uid": 3,
                        "userId": "U0032",
                        "userName": "驻店",
                        "currentName": "驻店",
                        "duty": "驻店导购"
                    },
                    "guideDept": {
                        "did": 1,
                        "no": "D003",
                        "name": "导购一部",
                        "type": "导购部",
                    },
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "comment": "",
                    "createTime": "2016-01-01 00:00:00",
                    "fullpayTime": "2016-01-01 00:00:00",
                    "balanceTime": "2016-01-01 00:00:00",
                    "status": 0,
                    "balanceStatus": 0,
                    "allowance": 10000,
                    "total": 100000,
                    "amount": 100000,
                    "maling": 0,
                    "venderMaling": 0,
                    "coupon": 0,
                    "couponInfo": ""
                },
                "refunds": null,
                "salesman": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "设计师",
                    "currentName": "设计师",
                    "duty": "设计师"
                },
                dept: {
                    "did": 1,
                    "no": "D001",
                    "name": "设计一部",
                    "type": "设计部",
                },
                "region": {
                    "did": 2,
                    "no": "D002",
                    "name": "设计一分区",
                    "type": "设计大区",
                },
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "createTime": "2016-01-01 00:00:00",
                "poster": null,
                "postTime": null,
                "venderTime": null,
                "checker": null,
                "checkTime": null,
                "total": 100.8,
                "balance": 10000,
                "difference": 90.8,
                "vbalance": 0,
                "pbalance": 0,
                "type": 0,
                "onetype": 0,
                "status": 0,
                "comment": "说明"
            }
        }
    ],
    ...
}
```


##### `查询` countBalanceSalesBalance

统计结算销售

**Requests:**

- `balanceSalesBalance.bsid` (Long): 结算销售ID

```json
{
    "balanceSalesBalance.bsid": 1
}
```

**Returns:**

- `count` (Long): 统计结果

```json
{
    ...
    "count": 0,
    ...
}
```


##### `查询` unbindBalanceSales

解绑结算销售

判断结算销售是否存在 , 不存在 , 错误信息 **350017 结算销售不存在**

判断结算销售状态为0(初始) , 其他状态 , 错误信息 **350018 结算销售不可操作**

**Requests:**

- `balanceSales.bsid` (Long): 结算销售ID
- `balanceSales.income` (Long): 收入
- `balanceSales.cost` (Long): 成本
- `balanceSales.payment` (Long): 应付
- `balanceSales.profit` (Long): 利润

```json
{
    "balanceSales.bsid": 1,
    "balanceSales.income": 0,
    "balanceSales.cost": 0,
    "balanceSales.payment": 0,
    "balanceSales.profit": 0,

    "balanceSalesBalances[0].bsbid": 1,
    "balanceSalesBalances[1].bsbid": 2
}
```

## 结算外销


### 结算


> **类**: `api.balance.BalanceOalesAction`


#### 数据类型: `balanceOales`

| 参数 | 说明 | 类型 |
|------|------|------|
| `boid` | 结算外销ID | Long |
| `bid` | 结算单ID | Long |
| `balance` | 结算单 , 类型 [balance ](./sales.html#api.sales.BalanceAction.balance) | Object |
| `name` | 名称 | String |
| `grade` | 等级 | String |
| `profit` | 利润 | Long |
| `status` | 状态 , 0: 初始 , 1: 锁定, 2: 结算 , 3: 完结 | Short |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `balancer` | 结算人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `lockTime` | 锁定时间 | Timestamp |
| `balanceTime` | 结算时间 | Timestamp |
| `company` | 公司 | Integer |


##### `查询` pageBalanceOales

分页方式获取结算外销信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 结算外销信息列表 , 每条数据类型 `balanceOales`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "boid": 1,
                "bid": 1,
                "name": "结算外销",
                "grade": "A",
                "profit": 0,
                "creater": {
                    "uid": 1,
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师" 
                },
                "balancer": {
                    "uid": 1,
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师" 
                },
                "createTime": "2016-01-01",
                "lockTime": "2016-01-01",
                "balanceTime": "2016-01-01"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageBalanceOalesForBalance

分页方式获取结算外销信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 结算外销信息列表 , 每条数据类型 `balanceOales`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "boid": 1,
                "bid": 1,
                "balance": {
                    "bid": 1,
                    "no": "1601010001",
                    "belonger": {
                        "uid": 1,
                        "userId": "U021",
                        "userName": "归属人",
                        "currentName": "归属人"
                    },
                    "creater": {
                        "uid": 1,
                        "userId": "U022",
                        "userName": "创建人",
                        "currentName": "创建人"
                    },
                    "createTime": "2016-01-01 00:00:00",
                    "startTime": "2016-01-01",
                    "endTime": "2016-01-01",
                    "amount": 1000,
                    "surplus": 1000,
                    "type": 0,
                    "status": 0
                },
                "name": "结算外销",
                "grade": "A",
                "profit": 0,
                "creater": {
                    "uid": 1,
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师" 
                },
                "balancer": {
                    "uid": 1,
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师" 
                },
                "createTime": "2016-01-01",
                "lockTime": "2016-01-01",
                "balanceTime": "2016-01-01"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryBalanceOales

查询结算外销 , 状态为0(初始)

**Requests:**

- `balanceOales.name` (String): 名称

```json
{
    "balanceOales.name:": "结算外销"
}
```

**Returns:**

- `balanceOaleses` (List): 结算外销信息列表 , 每条数据类型 `balanceOales`

```json
{
    ...
    "balanceOaleses": [
        {
            "boid": 1,
            "bid": 1,
            "name": "结算外销",
            "grade": "A",
            "profit": 0,
            "creater": {
                "uid": 1,
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师" 
            },
            "balancer": {
                "uid": 1,
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师" 
            },
            "createTime": "2016-01-01",
            "lockTime": "2016-01-01",
            "balanceTime": "2016-01-01"
        }
    ],
    ...
}
```


##### `查询` queryBalanceOalesByBoid

通过结算外销ID查询

**Requests:**

- `balanceOales.boid` (Long): 结算外销ID

```json
{
    "balanceOales.boid:": 1
}
```

**Returns:**

- `balanceOales` (Object): 结算外销信息 , 类型 `balanceOales`

```json
{
    ...
    "balanceOales": {
        "boid": 1,
        "bid": 1,
        "name": "结算外销",
        "grade": "A",
        "profit": 0,
        "creater": {
            "uid": 1,
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师" 
        },
        "balancer": {
            "uid": 1,
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师" 
        },
        "createTime": "2016-01-01",
        "lockTime": "2016-01-01",
        "balanceTime": "2016-01-01"
    }
    ...
}
```


##### `查询` queryBalanceOalesByBid

通过结算单ID查询结算外销

**Requests:**

- `balanceOales.bid` (Long): 结算单ID

```json
{
    "balanceOales.bid:": 1
}
```

**Returns:**

- `balanceOales` (Object): 结算外销信息 , 类型 `balanceOales`

```json
{
    ...
    "balanceOales": {
        "boid": 1,
        "bid": 1,
        "name": "结算外销",
        "grade": "A",
        "profit": 0,
        "creater": {
            "uid": 1,
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师" 
        },
        "balancer": {
            "uid": 1,
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师" 
        },
        "createTime": "2016-01-01",
        "lockTime": "2016-01-01",
        "balanceTime": "2016-01-01"
    }
    ...
}
```


##### `查询` amountBalanceOales

汇总结算外销

**Requests:**

- `balanceOales.boid` (Long): 结算外销ID

```json
{
    "balanceOales.boid": 1
}
```


##### `查询` createBalanceOales

创建结算外销

**Requests:**

- `balanceOales.name` (String): 名称
- `balanceOales.grade` (String): 等级

```json
{
    "balanceOales.name": "结算外销",
    "balanceOales.brand.bid": 1,
    "balanceOales.grade": "A"
}
```


##### `查询` updateBalanceOales

更新结算外销

判断结算外销是否存在 , 不存在 , 错误信息 **350023 结算外销不存在**

判断结算外销状态为0(初始) , 其他状态 , 错误信息 **350024 结算外销不可操作**

**Requests:**

- `balanceOales.boid` (Long): 结算外销ID
- `balanceOales.name` (String): 名称

```json
{
    "balanceOales.boid": 1,
    "balanceOales.name": "结算外销"
}
```


##### `查询` submitBalanceOales

提交结算外销

判断结算外销是否存在 , 不存在 , 错误信息 **350023 结算外销不存在**

判断结算外销状态为0(初始) , 其他状态 , 错误信息 **350024 结算外销不可操作**

**Requests:**

- `balanceOales.boid` (Long): 结算外销ID
- `balanceOales.profit` (Long): 利润

```json
{
    "balanceOales.boid": 1,
    "balanceOales.profit": 0,

    "balanceOalesBalances[0].oales.oid": 1,
    "balanceOalesBalances[1].oales.oid": 2
}
```


##### `查询` lockBalanceOales

锁定结算外销

判断结算外销是否存在 , 不存在 , 错误信息 **350023 结算外销不存在**

判断结算外销状态为0(初始) , 其他状态 , 错误信息 **350024 结算外销不可操作**

结算外销状态更新为1(锁定) , 更新锁定时间

**Requests:**

- `balanceOales.boid` (Long): 结算外销ID

```json
{
    "balanceOales.boid": 1
}
```


##### `查询` unlockBalanceOales

锁定结算外销

判断结算外销是否存在 , 不存在 , 错误信息 **350023 结算外销不存在**

判断结算外销状态为1(锁定) , 其他状态 , 错误信息 **350024 结算外销不可操作**

结算外销状态更新为0(初始)

**Requests:**

- `balanceOales.boid` (Long): 结算外销ID

```json
{
    "balanceOales.boid": 1
}
```


##### `查询` balanceBalanceOales

结算

判断结算外销是否存在 , 不存在 , 错误信息 **350023 结算外销不存在**

判断结算外销状态为1(锁定) , 其他状态 , 错误信息 **350024 结算外销不可操作**

结算外销状态更新为2(结算) , 更新结算人和结算时间

生成对应结算单

**Requests:**

- `balanceOales.boid` (Long): 结算外销ID

```json
{
    "balanceOales.boid": 1
}
```


##### `查询` deleteBalanceOales

删除

判断结算外销是否存在 , 不存在 , 错误信息 **350023 结算外销不存在**

判断结算外销状态为0(初始) , 其他状态 , 错误信息 **350024 结算外销不可操作**

判断结算外销明细 , 存在明细数据 , 错误信息 **350025 销售明细存在**

**Requests:**

- `balanceOales.boid` (Long): 结算外销ID

```json
{
    "balanceOales.boid": 1
}
```

### 明细


> **类**: `api.balance.BalanceOalesBalanceAction`


#### 数据类型: `balanceOalesBalance`

| 参数 | 说明 | 类型 |
|------|------|------|
| `bobid` | 结算明细ID | Long |
| `boid` | 结算外销ID | Long |
| `oales` | 外销单 , 类型 [oales ](./sales.html#api.sales.OalesAction.oales) | Object |


##### `查询` pageBalanceOalesBalance

分页方式获取结算外销明细信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Requests:**

- `balanceOales.boid` (Long): 结算外销ID

```json
{
    "balanceOales.boid:": 1
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 结算外销明细信息列表 , 每条数据类型 `balanceOalesBalance`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "bobid": 1,
                "boid": 1,
                "oales": {
                    "oid": 1,
                    "no": "1601010001",
                    "decoration": {
                        "doid": 1,
                        "orderId": "1601010001",
                        "customer": {
                            "id": 1,
                            "no": "1501010001",
                            "name": "李",
                            ...
                        },
                        "house":{
                            "hid": 1,
                            "village": {
                                "vid": 1,
                                "no": "P001",
                                "name": "广场一期",
                                ...
                            },
                            "houseNumber": "1#1-1-1",
                            ...
                        }
                        "designer": {
                            "uid": 2,
                            "userId": "FL-00186",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "phone": "138xxxx1828",
                            ...
                        }
                    },

                    "creater": {
                        "uid": 1,
                        "userId": "FL-02381",
                        "userName": "王宁",
                        "currentName": "王宁",
                        "phone": "136xxxx1453",
                        ...
                    },
                    "servicer": {
                        "uid": 1,
                        "userId": "FL-02381",
                        "userName": "王宁",
                        "currentName": "王宁",
                        "phone": "136xxxx1453",
                        ...
                    },
                    "materialer": null,
                    "channer": null,

                    dept: {
                        "did": 1,
                        "no": "D001",
                        "name": "设计一部",
                        "type": "设计部",
                    },
                    "region": {
                        "did": 2,
                        "no": "D002",
                        "name": "设计一分区",
                        "type": "设计大区",
                    },

                    "createTime": "2016-01-01 00:00:00",
                    "confirmTime": "2016-01-01 00:00:00",
                    "checkTime": "2016-01-01 00:00:00",
                    "finishTime": "2016-01-01 00:00:00",

                    "category": "瓷砖",
                    "brand": "瓷砖",

                    "atttype": 0,
                    "awardType": 0,

                    "total": 100000,
                    "profit": 0,
                    "award": 0,

                    "status": 0,
                    "comment": ""
                }
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryBalanceOalesBalance

通过结算外销ID获取外销单明细信息

**Requests:**

- `balanceOalesBalance.boid` (Long): 结算外销ID

```json
{
    "balanceOalesBalance.boid": 1
}
```

**Returns:**

- `balanceOalesBalances` (List): 结算外销信息列表 , 类型 `balanceOalesBalance`

```json
{
    ...
    "balanceOalesBalances": [
        {
            "bobid": 1,
            "boid": 1,
            "oales": {
                "oid": 1,
                "no": "1601010001",
                "decoration": {
                    "doid": 1,
                    "orderId": "1601010001",
                    "customer": {
                        "id": 1,
                        "no": "1501010001",
                        "name": "李",
                        ...
                    },
                    "house":{
                        "hid": 1,
                        "village": {
                            "vid": 1,
                            "no": "P001",
                            "name": "广场一期",
                            ...
                        },
                        "houseNumber": "1#1-1-1",
                        ...
                    }
                    "designer": {
                        "uid": 2,
                        "userId": "FL-00186",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "phone": "138xxxx1828",
                        ...
                    }
                },

                "creater": {
                    "uid": 1,
                    "userId": "FL-02381",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "servicer": {
                    "uid": 1,
                    "userId": "FL-02381",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "materialer": null,
                "channer": null,

                dept: {
                    "did": 1,
                    "no": "D001",
                    "name": "设计一部",
                    "type": "设计部",
                },
                "region": {
                    "did": 2,
                    "no": "D002",
                    "name": "设计一分区",
                    "type": "设计大区",
                },

                "createTime": "2016-01-01 00:00:00",
                "confirmTime": "2016-01-01 00:00:00",
                "checkTime": "2016-01-01 00:00:00",
                "finishTime": "2016-01-01 00:00:00",

                "category": "瓷砖",
                "brand": "瓷砖",

                "atttype": 0,
                "awardType": 0,

                "total": 100000,
                "profit": 0,
                "award": 0,

                "status": 0,
                "comment": ""
            }
        }
    ],
    ...
}
```


##### `查询` countBalanceOalesBalance

统计结算外销

**Requests:**

- `balanceOalesBalance.boid` (Long): 结算外销ID

```json
{
    "balanceOalesBalance.boid": 1
}
```

**Returns:**

- `count` (Long): 统计结果

```json
{
    ...
    "count": 0,
    ...
}
```


##### `查询` unbindBalanceOales

解绑结算外销

判断结算外销是否存在 , 不存在 , 错误信息 **350023 结算外销不存在**

判断结算外销状态为0(初始) , 其他状态 , 错误信息 **350024 结算外销不可操作**

**Requests:**

- `balanceOales.boid` (Long): 结算外销ID
- `balanceOales.profit` (Long): 利润

```json
{
    "balanceOales.boid": 1,
    "balanceOales.income": 0,
    "balanceOales.cost": 0,
    "balanceOales.payment": 0,
    "balanceOales.profit": 0,

    "balanceOalesBalances[0].bobid": 1,
    "balanceOalesBalances[1].bobid": 2
}
```

## 结算选材


### 结算


> **类**: `api.balance.BalanceSelectionAction`


#### 数据类型: `balanceSelection`

| 参数 | 说明 | 类型 |
|------|------|------|
| `bsid` | 结算选材ID | Long |
| `bid` | 结算单ID | Long |
| `balance` | 结算单 , 类型 [balance ](./sales.html#api.sales.BalanceAction.balance) | Object |
| `name` | 名称 | String |
| `brand` | 品牌 , 类型 [brand ](./data.html#api.data.BrandAction.brand) | Object |
| `grade` | 等级 | String |
| `income` | 收入 | Long |
| `cost` | 成本 | Long |
| `payment` | 应付 | Long |
| `profit` | 利润 | Long |
| `status` | 状态 , 0: 初始 , 1: 锁定, 2: 结算 , 3: 完结 | Short |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `balancer` | 结算人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `lockTime` | 锁定时间 | Timestamp |
| `balanceTime` | 结算时间 | Timestamp |
| `company` | 公司 | Integer |


##### `查询` pageBalanceSelection

分页方式获取结算选材信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 结算选材信息列表 , 每条数据类型 `balanceSelection`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "bsid": 1,
                "bid": 1,
                "name": "结算选材",
                "brand": {
                    "bid": 1,
                    "no": "B001",
                    "name": "品牌",
                    "pinyin": "pinpai",
                    "category": {
                        "cid": 1,
                        "no": "C001",
                        "name": "地板"
                    },
                    "supplier": {
                        "uid": 1000,
                        "userId": "OC001",
                        "currentName": "厂商",
                        "userName": "厂商"
                    },
                },
                "grade": "A",
                "income": 0,
                "cost": 0,
                "payment": 0,
                "profit": 0,
                "creater": {
                    "uid": 1,
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师" 
                },
                "balancer": {
                    "uid": 1,
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师" 
                },
                "createTime": "2016-01-01",
                "lockTime": "2016-01-01",
                "balanceTime": "2016-01-01"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageBalanceSelectionForBalance

分页方式获取结算选材信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 结算选材信息列表 , 每条数据类型 `balanceSelection`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "bsid": 1,
                "bid": 1,
                "name": "结算选材",
                "brand": {
                    "bid": 1,
                    "no": "B001",
                    "name": "品牌",
                    "pinyin": "pinpai",
                    "category": {
                        "cid": 1,
                        "no": "C001",
                        "name": "地板"
                    },
                    "supplier": {
                        "uid": 1000,
                        "userId": "OC001",
                        "currentName": "厂商",
                        "userName": "厂商"
                    },
                },
                "grade": "A",
                "income": 0,
                "cost": 0,
                "payment": 0,
                "profit": 0,
                "creater": {
                    "uid": 1,
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师" 
                },
                "balancer": {
                    "uid": 1,
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师" 
                },
                "createTime": "2016-01-01",
                "lockTime": "2016-01-01",
                "balanceTime": "2016-01-01"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageBalanceSelectionItem

分页方式获取结算选材项信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Requests:**

- `balanceSelection.bsid` (Long): 结算选材ID

```json
{
    "balanceSelection.bsid:": 1
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 结算选材项信息列表 , 每条数据类型 `balanceSelectionItem`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "bsiid": 1,
                "bsid": 1,
                "selectionItem": {
                    "siid": 1,
                    "orderId": "1601010001",
                    "sid": 1,
                    "areaId": 1,
                    "quoteId": 1,
                    "goods": {
                        "gid": 1,
                        "no": "JGIDNEHDUIN5SD",
                        "name": "瓷砖",
                        "barcode": "254125212521251",
                        "category": "瓷砖",
                        "brand": "瓷砖",
                        "measurementUnit": "个",
                        "purchase": 100000,
                        "selling": 10000,
                        "pieceNum": 1,
                        "type": 0,
                        "checkup": 0,
                        "company": 0
                    },
                    "areaName": "功能区",
                    "preprice": 0,
                    "postprice": 0,
                    "initnum": 10000,
                    "num": 10000,
                    "refnum": 0,
                    "status": 0,
                    "comment": "备注"
                    "tranTime": "2016-01-01 00:00:00",
                    "checkTime": "2016-01-01 00:00:00",
                    "confirmTime": "2016-01-01 00:00:00",
                    "balanceTime": "2016-01-01 00:00:00",
                    "traner": {
                        "uid": 11,
                        "userId": "U011",
                        "userName": "配送人",
                        "currentName": "配送人",
                        "duty": "配送人"
                    },
                    "checker": {
                        "uid": 12,
                        "userId": "U012",
                        "userName": "审核人",
                        "currentName": "审核人",
                        "duty": "审核人"
                    },
                    "confirmer": {
                        "uid": 13,
                        "userId": "U013",
                        "userName": "确认人",
                        "currentName": "确认人",
                        "duty": "确认人"
                    },
                    "finisher": {
                        "uid": 14,
                        "userId": "U014",
                        "userName": "完结人",
                        "currentName": "完结人",
                        "duty": "完结人"
                    },
                    "balancer": {
                        "uid": 15,
                        "userId": "U015",
                        "userName": "结算人",
                        "currentName": "结算人",
                        "duty": "结算人"
                    }
                }
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryBalanceSelection

查询结算选材 , 状态为0(初始)

**Requests:**

- `balanceSelection.name` (String): 名称

```json
{
    "balanceSelection.name:": "结算选材"
}
```

**Returns:**

- `balanceSelections` (List): 结算选材信息列表 , 每条数据类型 `balanceSelection`

```json
{
    ...
    "balanceSelections": [
        {
            "bsid": 1,
            "bid": 1,
            "name": "结算选材",
            "brand": {
                "bid": 1,
                "no": "B001",
                "name": "品牌",
                "pinyin": "pinpai",
                "category": {
                    "cid": 1,
                    "no": "C001",
                    "name": "地板"
                },
                "supplier": {
                    "uid": 1000,
                    "userId": "OC001",
                    "currentName": "厂商",
                    "userName": "厂商"
                },
            },
            "grade": "A",
            "income": 0,
            "cost": 0,
            "payment": 0,
            "profit": 0,
            "creater": {
                "uid": 1,
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师" 
            },
            "balancer": {
                "uid": 1,
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师" 
            },
            "createTime": "2016-01-01",
            "lockTime": "2016-01-01",
            "balanceTime": "2016-01-01"
        }
    ],
    ...
}
```


##### `查询` queryBalanceSelectionByBsid

查询结算选材

**Requests:**

- `balanceSelection.bsid` (Long): 结算选材ID

```json
{
    "balanceSelection.bsid:": 1
}
```

**Returns:**

- `balanceSelections` (List): 结算选材信息列表 , 每条数据类型 `balanceSelection`

```json
{
    ...
    "balanceSelections": [
        {
            "bsid": 1,
            "bid": 1,
            "name": "结算选材",
            "brand": {
                "bid": 1,
                "no": "B001",
                "name": "品牌",
                "pinyin": "pinpai",
                "category": {
                    "cid": 1,
                    "no": "C001",
                    "name": "地板"
                },
                "supplier": {
                    "uid": 1000,
                    "userId": "OC001",
                    "currentName": "厂商",
                    "userName": "厂商"
                },
            },
            "grade": "A",
            "income": 0,
            "cost": 0,
            "payment": 0,
            "profit": 0,
            "creater": {
                "uid": 1,
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师" 
            },
            "balancer": {
                "uid": 1,
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师" 
            },
            "createTime": "2016-01-01",
            "lockTime": "2016-01-01",
            "balanceTime": "2016-01-01"
        }
    ],
    ...
}
```


##### `查询` amountBalanceSelection

汇总结算选材

**Requests:**

- `balanceSelection.bsid` (Long): 结算选材ID

```json
{
    "balanceSelection.bsid": 1
}
```


##### `查询` createBalanceSelection

创建结算选材

**Requests:**

- `balanceSelection.name` (String): 名称
- `balanceSelection.brand.bid` (Long): 品牌ID
- `balanceSelection.grade` (String): 等级

```json
{
    "balanceSelection.name": "结算选材",
    "balanceSelection.brand.bid": 1,
    "balanceSelection.grade": "A"
}
```


##### `查询` updateBalanceSelection

更新结算选材

判断结算选材是否存在 , 不存在 , 错误信息 **350027 结算选材不存在**

判断结算选材状态为0(初始) , 其他状态 , 错误信息 **350028 结算选材不可操作**

**Requests:**

- `balanceSelection.bsid` (Long): 结算选材ID
- `balanceSelection.name` (String): 名称

```json
{
    "balanceSelection.bsid": 1,
    "balanceSelection.name": "结算选材"
}
```


##### `查询` submitBalanceSelection

提交结算选材

判断结算选材是否存在 , 不存在 , 错误信息 **350027 结算选材不存在**

判断结算选材状态为0(初始) , 其他状态 , 错误信息 **350028 结算选材不可操作**

**Requests:**

- `balanceSelection.bsid` (Long): 结算选材ID
- `balanceSelection.income` (Long): 收入
- `balanceSelection.cost` (Long): 成本
- `balanceSelection.payment` (Long): 应付
- `balanceSelection.profit` (Long): 利润

```json
{
    "balanceSelection.bsid": 1,
    "balanceSelection.income": 0,
    "balanceSelection.cost": 0,
    "balanceSelection.payment": 0,
    "balanceSelection.profit": 0,

    "balanceSelectionItems[0].selectionItem.siid": 1,
    "balanceSelectionItems[1].selectionItem.siid": 2
}
```


##### `查询` lockBalanceSelection

锁定结算选材

判断结算选材是否存在 , 不存在 , 错误信息 **350027 结算选材不存在**

判断结算选材状态为0(初始) , 其他状态 , 错误信息 **350028 结算选材不可操作**

结算选材状态更新为1(锁定) , 更新锁定时间

**Requests:**

- `balanceSelection.bsid` (Long): 结算选材ID

```json
{
    "balanceSelection.bsid": 1
}
```


##### `查询` unlockBalanceSelection

锁定结算选材

判断结算选材是否存在 , 不存在 , 错误信息 **350027 结算选材不存在**

判断结算选材状态为1(锁定) , 其他状态 , 错误信息 **350028 结算选材不可操作**

结算选材状态更新为0(初始)

**Requests:**

- `balanceSelection.bsid` (Long): 结算选材ID

```json
{
    "balanceSelection.bsid": 1
}
```


##### `查询` balanceBalanceSelection

结算

判断结算选材是否存在 , 不存在 , 错误信息 **350027 结算选材不存在**

判断结算选材状态为1(锁定) , 其他状态 , 错误信息 **350028 结算选材不可操作**

结算选材更新为2(结算) , 更新结算人和结算时间

生成对应结算单

**Requests:**

- `balanceSelection.bsid` (Long): 结算选材ID

```json
{
    "balanceSelection.bsid": 1
}
```


##### `查询` deleteBalanceSelection

删除

判断结算选材是否存在 , 不存在 , 错误信息 **350027 结算选材不存在**

判断结算选材状态为0(初始) , 其他状态 , 错误信息 **350028 结算选材不可操作**

判断结算选材明细存在 , 存在明细数据 , 错误信息 **350029 结算选材明细存在**

**Requests:**

- `balanceSelection.bsid` (Long): 结算选材ID

```json
{
    "balanceSelection.bsid": 1
}
```

### 明细


> **类**: `api.balance.BalanceSelectionAction`


#### 数据类型: `balanceSelectionItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `bsiid` | 结算选材ID | Long |
| `bsid` | 结算选材ID | Long |
| `selectionItem` | 选材项 , 类型 [selectionItem ](./quotation.html#api.quotation.SelectionItemAction.selectionItem) | Object |


##### `查询` pageBalanceSelectionItem

分页方式获取结算选材项信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Requests:**

- `balanceSelection.bsid` (Long): 结算选材ID

```json
{
    "balanceSelection.bsid:": 1
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 结算选材项信息列表 , 每条数据类型 `balanceSelectionItem`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "bsiid": 1,
                "bsid": 1,
                "selectionItem": {
                    "siid": 1,
                    "orderId": "1601010001",
                    "sid": 1,
                    "areaId": 1,
                    "quoteId": 1,
                    "goods": {
                        "gid": 1,
                        "no": "JGIDNEHDUIN5SD",
                        "name": "瓷砖",
                        "barcode": "254125212521251",
                        "category": "瓷砖",
                        "brand": "瓷砖",
                        "measurementUnit": "个",
                        "purchase": 100000,
                        "selling": 10000,
                        "pieceNum": 1,
                        "type": 0,
                        "checkup": 0,
                        "company": 0
                    },
                    "areaName": "功能区",
                    "preprice": 0,
                    "postprice": 0,
                    "initnum": 10000,
                    "num": 10000,
                    "refnum": 0,
                    "status": 0,
                    "comment": "备注"
                    "tranTime": "2016-01-01 00:00:00",
                    "checkTime": "2016-01-01 00:00:00",
                    "confirmTime": "2016-01-01 00:00:00",
                    "balanceTime": "2016-01-01 00:00:00",
                    "traner": {
                        "uid": 11,
                        "userId": "U011",
                        "userName": "配送人",
                        "currentName": "配送人",
                        "duty": "配送人"
                    },
                    "checker": {
                        "uid": 12,
                        "userId": "U012",
                        "userName": "审核人",
                        "currentName": "审核人",
                        "duty": "审核人"
                    },
                    "confirmer": {
                        "uid": 13,
                        "userId": "U013",
                        "userName": "确认人",
                        "currentName": "确认人",
                        "duty": "确认人"
                    },
                    "finisher": {
                        "uid": 14,
                        "userId": "U014",
                        "userName": "完结人",
                        "currentName": "完结人",
                        "duty": "完结人"
                    },
                    "balancer": {
                        "uid": 15,
                        "userId": "U015",
                        "userName": "结算人",
                        "currentName": "结算人",
                        "duty": "结算人"
                    }
                }
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryBalanceSelectionItem

获取结算选材项

**Requests:**

- `balanceSelectionItem.bsid` (String): 结算选材ID

```json
{
    "balanceSelectionItem.bsid:": 1
}
```

**Returns:**

- `balanceSelectionItems` (List): 结算选材项信息列表 , 每条数据类型 `balanceSelectionItem`

```json
{
    ...
    "balanceSelectionItems": [
        {
            "bsiid": 1,
            "bsid": 1,
            "selectionItem": {
                "siid": 1,
                "orderId": "1601010001",
                "sid": 1,
                "areaId": 1,
                "quoteId": 1,
                "goods": {
                    "gid": 1,
                    "no": "JGIDNEHDUIN5SD",
                    "name": "瓷砖",
                    "barcode": "254125212521251",
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "measurementUnit": "个",
                    "purchase": 100000,
                    "selling": 10000,
                    "pieceNum": 1,
                    "type": 0,
                    "checkup": 0,
                    "company": 0
                },
                "areaName": "功能区",
                "preprice": 0,
                "postprice": 0,
                "initnum": 10000,
                "num": 10000,
                "refnum": 0,
                "status": 0,
                "comment": "备注"
                "tranTime": "2016-01-01 00:00:00",
                "checkTime": "2016-01-01 00:00:00",
                "confirmTime": "2016-01-01 00:00:00",
                "balanceTime": "2016-01-01 00:00:00",
                "traner": {
                    "uid": 11,
                    "userId": "U011",
                    "userName": "配送人",
                    "currentName": "配送人",
                    "duty": "配送人"
                },
                "checker": {
                    "uid": 12,
                    "userId": "U012",
                    "userName": "审核人",
                    "currentName": "审核人",
                    "duty": "审核人"
                },
                "confirmer": {
                    "uid": 13,
                    "userId": "U013",
                    "userName": "确认人",
                    "currentName": "确认人",
                    "duty": "确认人"
                },
                "finisher": {
                    "uid": 14,
                    "userId": "U014",
                    "userName": "完结人",
                    "currentName": "完结人",
                    "duty": "完结人"
                },
                "balancer": {
                    "uid": 15,
                    "userId": "U015",
                    "userName": "结算人",
                    "currentName": "结算人",
                    "duty": "结算人"
                }
            }
        }
    ],
    ...
}
```


##### `查询` countBalanceSelectionItem

统计结算选材项数量

**Requests:**

- `balanceSelectionItem.bsid` (String): 结算选材ID

```json
{
    "balanceSelectionItem.bsid:": 1
}
```

**Returns:**

- `count` (Integer): 结算选材项数量

```json
{
    ...
    "count": 100
    ...
}
```


##### `查询` unbindBalanceSelection

解绑结算选材

判断结算选材是否存在 , 不存在 , 错误信息 **350027 结算选材不存在**

判断结算选材状态为0(初始) , 其他状态 , 错误信息 **350028 结算选材不可操作**

**Requests:**

- `balanceSelection.bsid` (Long): 结算选材ID
- `balanceSelection.income` (Long): 收入
- `balanceSelection.cost` (Long): 成本
- `balanceSelection.payment` (Long): 应付
- `balanceSelection.profit` (Long): 利润

```json
{
    "balanceSelection.bsid": 1,
    "balanceSelection.income": 0,
    "balanceSelection.cost": 0,
    "balanceSelection.payment": 0,
    "balanceSelection.profit": 0,

    "balanceSelectionItems[0].bsiid": 1,
    "balanceSelectionItems[1].bsiid": 2
}
```

## 成本


> **类**: `api.balance.ComcostAction`


#### 数据类型: `comcost`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cid` | 成本ID | Long |
| `type` | 类型 , 0: 标准 | Short |
| `orderId` | 装修单号 | String |
| `ident` | 引用ID | Long |
| `money` | 操作金额 | Long |
| `creater` | 人员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `status` | 状态, 0(初始) | Short |
| `comment` | 说明 | String |
| `company` | 公司 | Integer |


##### `查询` pageComcost

分页方式获取成本信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 扣款信息列表 , 每条数据类型 `comcost`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "cid": 1,
                "type": 0,
                "money": 100000,
                "orderId": "1601010001",
                "creater": {
                    "currentName": "白雪",
                    "userId": "U0479",
                    "userName": "白雪",
                },
                "createTime": "2016-01-01",
                "status": 0,
                "comment":"说明",
                "company": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryComcost

获取成本信息

**Request:**

- `comcost.ident` (Long): 引用ID
- `comcost.type` (Short): 类型

```json
{
    "comcost.ident": 1,
    "comcost.type": 1
}
```

**Returns:**

- `comcosts` (List): 成本信息列表 , 每条数据类型 `comcost`

```json
{
    ...
    "comcosts": [
        {
            "cid": 1,
            "type": 0,
            "money": 100000,
            "orderId": "1601010001",
            "creater": {
                "currentName": "白雪",
                "userId": "U0479",
                "userName": "白雪",
            },
            "createTime": "2016-01-01",
            "status": 0,
            "comment":"说明",
            "company": 0
        }
    ],
    ...
}
```


##### `查询` addComcost

添加成本信息

**Request:**

- `comcost.orderId` (String): 装修单号
- `comcost.ident` (Long): 引用ID
- `comcost.type` (Short): 类型
- `comcost.money` (Long): 金额
- `comcost.comment` (String): 说明
- `comcost.company` (Integer): 公司ID

```json
{
    "comcost.orderId": "1601010001",
    "comcost.ident": 1,
    "comcost.type": 1,
    "comcost.money": 1000000,
    "comcost.comment": "说明",
    "comcost.company": 1
}
```


##### `查询` updateComcostForStatus

更新成本状态

判断成本信息是否存在 , 不存在 , 错误信息 **350011 成本不存在**

**Request:**

- `comcost.cid` (Long): 成本ID
- `comcost.status` (Short): 状态

```json
{
    "comcost.cid": 1,
    "comcost.status": 0
}
```
