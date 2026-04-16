# 款项


## 合同


> **类**: `api.payment.PaymentContractAction`


#### 数据类型: `paymentContract`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pcid` | 合同ID | Long |
| `rtid` | 收据ID | Long |
| `orderId` | 装修单号 | String |
| `paymentType` | 款项类型 , 0: 预付款 , 1: 装修款 , 2: 主材款 , 3: 销售款 , 4: 服务款 , 5: 活动款 , 6: 转换款 , 7: 代付款 | Short |
| `download` | 下载地址 | String |
| `viewpdf` | 查看地址 | String |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `signner` | 签署人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `comsignTime` | 公司签时间 | Timestamp |
| `cussignTime` | 客户签时间 | Timestamp |
| `status` | 状态 , 0: 初始 , 1: 已签 , 2: 失效 , 3: 归档 , 4: 归档(本地) | Short |


##### `查询` pagePaymentContract

分页方式获取款项合同信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 款项合同信息列表 , 每条数据类型 `paymentContract`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "pcid": 1,
                "rtid": 1,
                "orderId": "1601010001",
                "paymentType": 1,
                "viewpdf": "JKLSHFD213J12GH312U32.pdf",
                "download": "JKLSHFD213J12GH312U32.pdf",
                "creater": {
                    "uid": 1,
                    "userId": "U0203",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "signner": null,
                "createTime": "2016-01-01 00:00:00",
                "comsignTime": null,
                "cussignTime": null,
                "status": 0
            },
        ],
        ...
    },
    ...
}
```


##### `创建` pollingPaymentContract

分页方式获取款项合同信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 款项合同信息列表 , 每条数据类型 `paymentContract`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "pcid": 1,
                "rtid": 1,
                "orderId": "1601010001",
                "paymentType": 1,
                "viewpdf": "JKLSHFD213J12GH312U32.pdf",
                "download": "JKLSHFD213J12GH312U32.pdf",
                "creater": {
                    "uid": 1,
                    "userId": "U0203",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "signner": null,
                "createTime": "2016-01-01 00:00:00",
                "comsignTime": null,
                "cussignTime": null,
                "status": 0
            },
        ],
        ...
    },
    ...
}
```


##### `查询` queryPaymentContract

通过装修单号获取合同信息

**Requests:**

- `paymentContract.rtid` (Long): 收据ID
- `paymentContract.paymentType` (Short): 款项类型

```json
{
    "paymentContract.rtid": 1,
    "paymentContract.paymentType": 1
}
```

**Returns:**

- `paymentContract` (List): 合同信息 , 类型 `paymentContract`

```json
{
    ...
    "paymentContract": {
        "pcid": 1,
        "rtid": 1,
        "orderId": "1601010001",
        "paymentType": 1,
        "viewpdf": "JKLSHFD213J12GH312U32.pdf",
        "download": "JKLSHFD213J12GH312U32.pdf",
        "creater": {
            "uid": 1,
            "userId": "U0203",
            "userName": "王宁",
            "currentName": "王宁",
            "phone": "136xxxx1453",
            ...
        },
        "signner": null,
        "createTime": "2016-01-01 00:00:00",
        "comsignTime": null,
        "cussignTime": null,
        "status": 0
    },
    ...
}
```


##### `查询` sendPaymentContractForAuth

发送认证通知

**Requests:**

- `paymentContract.pcid` (String): 装修单号

```json
{
    "paymentContract.pcid": 1
}
```


##### `查询` sendPaymentContract

发送合同通知

通过不同类型的控制 , 统一的跳转页面来判断当前通知合同的状态是否符合操作

判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**

**Requests:**

- `paymentContract.pcid` (Long): 合同ID
- `paymentContract.type` (Short): 类型 , 1: 签章, 2: 签订, 3: 查看 , 4: 下载

```json
{
    "paymentContract.pcid": 1,
    "paymentContract.type": 1
}
```


##### `查询` redirectPaymentContract

跳转合同操作 , 根据发送合同通知的类型 , 响应对应功能的页面地址

类型包括1(签章)/2(签订)/3(查看)/4(下载)

判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**Requests:**

- `paymentContract.pcid` (Long): 合同ID

```json
{
    "paymentContract.pcid": 1
}
```

**Returns:**

- `redirect` (String): 跳转地址

```json
{
    ...
    "redirect": "http://redirect.com/redirect.html?type=view",
    ...
}
```


##### `查询` viewPaymentContract

查看合同

判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**

**Requests:**

- `paymentContract.pcid` (Long): 合同ID

```json
{
    "paymentContract.pcid": 1
}
```

**Returns:**

- `redirect` (String): 跳转地址

```json
{
    ...
    "redirect": "http://redirect.com/redirect.html?type=view",
    ...
}
```


##### `查询` signPaymentContractForCustomer

签订合同 , 针对客户信息

判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**

判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **150066 合同不可操作**

**Requests:**

- `paymentContract.pcid` (Long): 合同ID
- `customer.cid` (Long): 客户ID

```json
{
    "paymentContract.pcid": 1,
    "customer.cid": 1
}
```

**Returns:**

- `redirect` (String): 跳转地址

```json
{
    ...
    "redirect": "http://redirect.com/redirect.html?type=sign",
    ...
}
```


##### `查询` signPaymentContractForCompany

签订合同 , 针对公司信息

判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**

判断签章是否存在 , 不存在 , 错误信息 **130045 签章不存在**

判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **150066 合同不可操作**

**Requests:**

- `paymentContract.pcid` (Long): 合同ID
- `signet.sid` (Long): 签章ID

```json
{
    "paymentContract.pcid": 1,
    "signet.sid": 1
}
```


##### `查询` addPaymentContract

创建合同

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**Requests:**

- `paymentContract.orderId` (String): 装修单号
- `paymentContract.paymentType` (Short): 款项类型
- `paymentContract.path` (String): 文件路径

```json
{
    "paymentContract.orderId": "1601010001",
    "paymentContract.paymentType": 1,
    "paymentContract.path": 1
}
```


##### `查询` affixPaymentContract

签订合同

判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**

判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **150066 合同不可操作**

更新装修合同为1(已签)

**Requests:**

- `paymentContract.pcid` (Long): 合同ID

```json
{
    "paymentContract.pcid": 1
}
```


##### `查询` expirePaymentContract

失效合同

判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**

判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **150066 合同不可操作**

更新装修合同为2(失效)

**Requests:**

- `paymentContract.pcid` (Long): 合同ID

```json
{
    "paymentContract.pcid": 1
}
```


##### `查询` filingPaymentContract

归档合同

判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**

判断合同状态是否为1(已签) , 其他状态不可操作 , 错误信息 **150066 合同不可操作**

**Requests:**

- `paymentContract.pcid` (Long): 合同ID

```json
{
    "paymentContract.pcid": 1
}
```

## 收据


> **类**: `api.payment.ReceiptAction`


#### 数据类型: `receipt`

| 参数 | 说明 | 类型 |
|------|------|------|
| `rid` | 收据ID | Long |
| `prid` | 款项收据ID | Long |
| `rtid` | 收据ID | Long |
| `no` | 收据编号 | String |
| `name` | 名称 | String |
| `orderId` | 装修单号 | String |
| `type` | 类型 , 0: 收款, 1: 退款 | Short |
| `paymentType` | 款项类型 , 0: 预付款 , 1: 装修款 , 2: 主材款 , 3: 销售款 , 4: 服务款 , 5: 活动款 , 6: 转换款 , 7: 代付款 | Short |
| `paymentName` | 款项名 | String |
| `receiptType` | 收据类型 , 0: 现金 , 1: 银行 , 2: 转账 , 3: 对公 , 4: 分期 , 5: 优惠 , 6: 预付 | Short |
| `money` | 金额 | Long |
| `collectTime` | 收款时间 | Timestamp |
| `company` | 公司 | Integer |


##### `查询` pageReceipt

分页方式获取收据信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter) .

**Returns:**


```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "rid": 1,
                "prid": 1,
                "rtid": 1,
                "no": "175"
                "name": "现金",
                "orderId": "1601010001",
                "type": 1,
                "paymentType": 2,
                "paymentName": "款项收据",
                "receiptType": 1,
                "money": 100000,
                "collectTime": "2016-01-01 00:00:00"
            }
        ],
        ...
    },
    ...
}
```

## 流水


> **类**: `api.payment.StatementAction`


商户号/订单号/金额/费率/费用/时间


#### 数据类型: `statement`

| 参数 | 说明 | 类型 |
|------|------|------|
| `sid` | 流水ID | Long |
| `custNo` | 商户号 | String |
| `orderNo` | 订单号 | String |
| `price` | 金额 | Integer |
| `fee` | 手续费 | Integer |
| `rate` | 费率 | Integer |
| `createTime` | 创建时间 | Timestamp |
| `payTime` | 付款时间 | Timestamp |
| `type` | 类型 | Short |
| `status` | 状态 | Short |


##### `查询` pageStatement

分页方式获取流水信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter) .

**Returns:**


```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sid": 1,
                "custNo": "60026047",
                "orderNo": "40109TTT4u",
                "price": 10000
                "fee": 0,
                "rate": 0,
                "createTime": "2016-01-01 00:00:00",
                "payTime": "2016-01-01 00:00:00",
                "type": 1
            }
        ],
        ...
    },
    ...
}
```

## 活动


> **类**: `api.payment.PaymentActivityAction`


#### 数据类型: `paymentActivity`

| 参数 | 说明 | 类型 |
|------|------|------|
| `paid` | 活动ID | Long |
| `orderId` | 装修单号 | String |
| `type` | 类型 , 0: 预付款 , 1: 装修款 , 2: 主材款 , 3: 销售款 , 4: 服务款 | Short |
| `pid` | 款项ID | Long |
| `rid` | 收款ID | Long |
| `activity` | 活动 , 类型 [activity ](./information.html#api.information.ActivityAction.activity) | Integer |
| `realMoney` | 实付额 | Integer |
| `multiple` | 倍数 | Integer |
| `createTime` | 创建时间 | Timestamp |
| `comment` | 说明 | String |


##### `查询` pagePaymentActivity

分页方式获取款项活动 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 款项活动信息列表 , 每条数据类型 `paymentActivity`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "paid": 1,
                "orderId": "1601010001",
                "type": 0,
                "pid": 1,
                "rid": 1,
                "activity": {
                    "aid": 1,
                    "name": "test",
                    ...
                },
                "realMoney": 1000,
                "multiple": 1,
                "createTime": "2016-01-01 00:00:00",
                "comment": "说明"
            },
        ],
        ...
    },
    ...
}
```


##### `查询` amountPaymentActivity

获取款项活动总额

**Requests:**

- `paymentActivity.orderId` (String): 装修单号
- `paymentActivity.type` (Short): 类型

```json
{
    "paymentActivity.orderId": "1601010001",
    "paymentActivity.type": 0
}
```

**Returns:**

- `amount` (Long): 款项活动总额

```json
{
    ...
    "amount": 1000000,
    ...
}
```


##### `查询` updatePaymentActivity

更新款项活动

**Requests:**

- `paymentActivity.activity.aid` (Long): 活动ID
- `paymentActivity.comment` (String): 说明

```json
{
    "paymentActivity.activity.aid": 1,
    "paymentActivity.comment": "说明"
}
```


##### `查询` deletePaymentActivity

更新款项活动

**Requests:**

- `paymentActivity.paid` (Long): 活动ID

```json
{
    "paymentActivity.paid": 1
}
```

## 预付款


预付款款项信息管理以及相关业务功能


> **类**: `api.payment.AdvancePaymentAction`


#### 数据类型: `advancePayment`

| 参数 | 说明 | 类型 |
|------|------|------|
| `apid` | 预付款ID | Long |
| `customer` | 客户, 类型 [customer ](./data.html#api.data.CustomerAction.customer) | Object |
| `decoration` | 装修单 , 类型: [decoration ](./decoration.html#api.data.DecorationAction.decoration) | Object |
| `balance` | 合同预付款金额 | Long |
| `projectBalance` | 工程预付款金额 | Long |
| `materialBalance` | 主材预付款金额 | Long |
| `zhenglinBalance` | 正林预付款金额 | Long |


##### `查询` pageAdvancePayment

分页方式获取预付款 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 预付款信息列表 , 每条数据类型 `advancePayment`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "apid": 1,
                "customer": {
                    "cid": 1,
                    "no": "1501010001",
                    "name": "李",
                },
                "decoration": {
                    "doid": 1,
                    "orderId": "1601010001",
                    "customer": {
                        "cid": 1,
                        "no": "1501010001",
                        "name": "李",
                    },
                    "house":{
                        "hid": 1,
                        "village": {
                            "vid": 1,
                            "no": "P001",
                            "name": "广场一期"
                        },
                        "houseNumber": "1#1-1-1",
                        ...
                    },

                    "grade": "B",
                    "addition": {
                        "diid": 1,
                        "orderId": "1601010001",
                        "designer": "设计师",
                        "designDepartment": "设计一部",
                        "designRegion": "设计一分区",
                        "salesman": "业务员",
                        "salesDepartment": "业务一部/业务二部",
                        "salesRegion": "业务一分区/业务二分区"
                    }
                },
                "balanceAdvance": 0,
                "projectAdvance" 0,
                "materialAdvance" 0,
                "zaterialAdvance" 0
            },
        ],
        ...
    },
    ...
}
```


##### `查询` queryAdvancePaymentByOrderId

通过装修单号获取预付款金额

**Requests:**

- `advancePayment.orderId` (String): 装修单号

```json
{
    "advancePayment.orderId": "1601010001"
}
```

**Returns:**

- `balanceAdvance` (Long): 合同预付款
- `projectAdvance` (Long): 工程预付款
- `materialAdvance` (Long): 主材预付款
- `zaterialAdvance` (Long): 正林预付款

```json
{
    "balanceAdvance": 0,
    "projectAdvance" 0,
    "materialAdvance" 0,
    "zaterialAdvance" 0
}
```


##### `查询` addAdvancePayment

添加预付款

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**Requests:**

- `advancePayment.orderId` (String): 装修单号

```json
{
    "advancePayment.orderId": "1601010001"
}
```


> **类**: `api.payment.PaymentAction`


#### 数据类型: `payment`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pid` | 款项ID | Long |
| `arid` | 收据ID | Long |
| `orderId` | 装修单号 | String |
| `customer` | 客户信息 , 类型 [customer ](./data.html#api.data.CustomerAction.customer) | Object |
| `balance` | 余额 | Long |
| `recharge` | 操作金额 | Long |
| `realMoney` | 实收金额 | Long |
| `type` | 类型 , 包括: 0: 提现, 1: 收款, 2: 付款 , 3: 退款 | Short |
| `paymentType` | 款项类型 , 包括: 0: 合同, 1:工程, 2: 主材, 3: 正林 | Short |
| `collecter` | 收款人, 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `collectTime` | 收款时间 | Timestamp |
| `confirmer` | 确认人, 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `confirmTime` | 确认时间 | Timestamp |
| `status` | 状态, 包括: 0: 初始 , 1: 已付款, 2: 已确认, 3: 已撤销 | Short |
| `transfer` | 转款 | Long |
| `cash` | 现金 | Long |
| `cashInfo` | 现金信息 | String |
| `bank` | 刷卡 | Long |
| `bankInfo` | 刷卡信息 | String |
| `checkv` | 转账 | Long |
| `checkvBank` | 转账银行 | String |
| `installment` | 分期 | Long |
| `installmentBank` | 分期银行 | String |
| `accounts` | 对公 | Long |
| `accountsBank` | 对公银行 | String |
| `company` | 公司ID | Integer |
| `comment` | 说明 | String |


#### 数据类型: `advanceReceipt`

| 参数 | 说明 | 类型 |
|------|------|------|
| `arid` | 收据ID | Long |
| `collecter` | 收款人, 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `collectTime` | 收款时间 | Timestamp |
| `confirmer` | 确认人, 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `confirmTime` | 确认时间 | Timestamp |
| `realMoney` | 实收金额 | Long |
| `transfer` | 转款 | Long |
| `cash` | 现金 | Long |
| `cashInfo` | 现金信息 | String |
| `bank` | 刷卡 | Long |
| `bankInfo` | 刷卡信息 | String |
| `checkv` | 转账 | Long |
| `checkvBank` | 转账银行 | String |
| `installment` | 分期 | Long |
| `installmentBank` | 分期银行 | String |
| `accounts` | 对公 | Long |
| `accountsBank` | 对公银行 | String |
| `comment` | 说明 | String |


##### `查询` pagePayment

分页方式获取已付款预付款信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter) .

根据当前操作公司作为条件查询对应公司的预付款

**Requests:**

- `payment.status` (Short): 状态
- `payment.type` (Short): 类型
- `payment.company` (String): 公司

```json
{
    "payment.status": 1,
    "payment.type": 0,
    "payment.company": "company"
}
```

**Returns:**


```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "pid": 1,
                "arid": 1,
                "orderId": "1601010001",
                "type": 1,
                "paymentType": 0,
                "recharge": 1000,
                "balance": 1000,
                "customer": {
                    "cid": 1,
                    "no": "1501010001",
                    "name": "李",
                    "address": "",
                    "gender": "男",
                    "qq": "111",
                    "wechat": "333",
                    "email": "111@qq.com"
                },
                "collecter": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "collectTime": "2017-04-22 10:26:32",
                "confirmer": {
                    "uid": null,
                    "userId": null,
                    "userName": null,
                    "currentName": null,
                    "duty": null
                },
                "confirmTime": null,
                "status": 1,

                "transfer": 0,
                "cash": 1000,
                "cashInfo": "157",
                "bank": 0,
                "bankInfo": "",
                "checkv": 0,
                "checkvBank": "",
                "accounts": 0,
                "accountsBank": "",
                "installment": 0,
                "installmentBank": "",
                "comment": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryPaymentByOrderId

通过装修单号获取预付款信息

**Requests:**

- `payment.orderId` (String): 装修单号

```json
{
    "payment.orderId": "1601010001"
}
```

**Returns:**

- `payments` (List): 预付款信息列表 , 每条数据类型 `payment`

```json
{
    ...
    "data": [
        {
            "pid": 1,
            "arid": 1,
            "orderId": "1601010001",
            "type": 1,
            "paymentType": 0,
            "recharge": 1000,
            "balance": 1000,
            "customer": {
                "cid": 1,
                "no": "1501010001",
                "name": "李",
                "address": "",
                "gender": "男",
                "qq": "111",
                "wechat": "333",
                "email": "111@qq.com",
                "relationshipType": "企业高端客户"
            },
            "collecter": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "collectTime": "2017-04-22 10:26:32",
            "confirmer": {
                "uid": null,
                "userId": null,
                "userName": null,
                "currentName": null,
                "duty": null
            },
            "confirmTime": null,
            "status": 1,

            "transfer": 0,
            "cash": 1000,
            "cashInfo": "157",
            "bank": 0,
            "bankInfo": "",
            "checkv": 0,
            "checkvBank": "",
            "accounts": 0,
            "accountsBank": "",
            "installment": 0,
            "installmentBank": "",
            "comment": ""
        }
    ],
    ...
}
```


##### `查询/创建` queryPaymentByPaymentId

通过预付款ID获取预付款信息

判断预付款款项信息是否存在 , 不存在 , 错误信息 **150026 款项不存在**

**Requests:**

- `payment.paymentId` (Long): 预付款ID

```json
{
    "payment.paymentId": 1
}
```

**Returns:**

- `payment` (Object): 预付款信息 , 数据类型 `payment`

```json
{
    ...
    "payment": {
        "pid": 1,
        "arid": 1,
        "orderId": "1601010001",
        "type": 1,
        "paymentType": 0,
        "recharge": 1000,
        "balance": 1000,
        "customer": {
            "cid": 1,
            "no": "1501010001",
            "name": "李",
            "address": "",
            "gender": "男",
            "qq": "111",
            "wechat": "333",
            "email": "111@qq.com",
            "relationshipType": "企业高端客户",
        },
        "collecter": {
            "uid": 1,
            "userId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师"
        },
        "collectTime": "2017-04-22 10:26:32",
        "confirmer": {
            "uid": null,
            "userId": null,
            "userName": null,
            "currentName": null,
            "duty": null
        },
        "confirmTime": null,
        "status": 1,

        "transfer": 0,
        "cash": 1000,
        "cashInfo": "157",
        "bank": 0,
        "bankInfo": "",
        "checkv": 0,
        "checkvBank": "",
        "accounts": 0,
        "accountsBank": "",
        "installment": 0,
        "installmentBank": "",
        "comment": ""
    }
    ...
}
```


##### `查询` sendPayment

推送预付款

验证预付款信息是否存在 , 不存在 , 错误信息 **150003 款项不存在**

**Requests:**

- `payment.pid` (Long): 预付款ID

```json
{
    "payment.pid": 1
}
```


##### `查询` addPayment

创建预付款

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**Requests:**

- `payment.orderId` (String): 装修单号
- `payment.recharge` (Long): 操作金额
- `payment.paymentType` (Short): 类型

```json
{
    "payment.orderId": "1601010001",
    "payment.recharge": 100,
    "payment.paymentType": 0
}
```


##### `查询` collectPayment

预付款收款 , 同时生成预付款款项和收据信息

判断客户信息是否存在 , 不存在 , 错误信息 **230001 客户信息不存在**

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断预付款类型 , 0(合同)/2(主材)之外的其他类型 , 错误信息 **150028 预付款类型错误**

判断操作类型是否为1(收款) , 其他操作类型 , 错误信息 **150016 预付款操作不正确**

判断预付款类型为2(主材) , 更新归属装修单

如果预付款类型为2(主材) , 更新装修单中的销售比例 , 包括预付款(主材)/销售款

**Requests:**

- `payment.orderId` (String): 装修单号
- `payment.customer.cid` (Long): 客户ID
- `payment.recharge` (Long): 操作金额
- `payment.realMoney` (Long): 实收金额
- `payment.cash` (Long): 现金
- `payment.cashInfo` (String): 现金信息
- `payment.bank` (Long): 刷卡
- `payment.bankInfo` (String): 刷卡信息
- `payment.checkv` (Long): 转账
- `payment.checkvBank` (String): 转账银行
- `payment.installment` (Long): 分期
- `payment.installmentBank` (String): 分期银行
- `payment.accounts` (Long): 对公
- `payment.accountsBank` (String): 对公银行
- `payment.comment` (String): 说明

```json
{
    "payment.orderId": "1601010001",
    "payment.customer.cid": 1,
    "payment.recharge": 100,
    "payment.realMoney": 10000,
    "payment.cash": 10000,
    "payment.cashInfo": "175",
    "payment.bank": 10000,
    "payment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
    "payment.checkv": 10000,
    "payment.checkvBank": "189",
    "payment.installment": 10000
    "payment.installmentBank": "201",
    "payment.accounts": 10000,
    "payment.accountsBank": "201",
    "payment.comment": "说明",
}
```


##### `查询` confirmPayment

预付款确认

**Requests:**


```json
{
    "pids[0]": 1
}
```


##### `查询` withdrawPayment

预付款提现

判断客户信息是否存在 , 不存在 , 错误信息 **客户信息不存在**

判断客户预付款信息是否存在 , 不存在 , 错误信息 **150010 预付款余额不足**

判断预付款余额是否可供提现金额 , 余额不足 , 错误信息 **150010 预付款余额不足**

如果预付款类型为2(主材) , 更新装修单中的销售比例 , 包括预付款(主材)/销售款

**Requests:**

- `payment.orderId` (String): 装修单号
- `payment.customer.cid` (Long): 客户ID
- `payment.cash` (Long): 现金
- `payment.cashInfo` (String): 现金说明
- `payment.bank` (Long): 刷卡
- `payment.bankInfo` (String): 刷卡说明
- `payment.paymentType` (String): 款项类型
- `payment.type` (String): 类型
- `payment.comment` (String): 说明

```json
{
    "payment.orderId": "1601010001",
    "payment.customer.cid": 1,
    "payment.cash": 100,
    "payment.cashInfo": 175,
    "payment.paymengType": "主材预付款",
    "payment.type": "提现",
    "payment.comment": "说明"
}
```


##### `查询` payPayment

预付款付款，更新预付款余额，新增预付款支付明细

判断客户信息是否存在 , 不存在 , 错误信息 **客户信息不存在**

判断客户预付款信息是否存在 , 不存在 , 错误信息 **150010 预付款余额不足**

判断预付款余额是否可供提现金额 , 余额不足 , 错误信息 **150010 预付款余额不足**

**Requests:**

- `payment.orderId` (String): 装修单号
- `payment.paymentType` (String): 款项类型
- `payment.comment` (String): 说明
- `payment.transfer` (Long): 转款

```json
{
    "payment.orderId": "1601010001",
    "payment.paymentType": "合同预付款",
    "payment.comment": "",
    "payment.transfer": 1000
}
```


##### `查询` updatePayment

更新预付款收款方式信息

判断预付款是否存在 , 不存在 , 错误信息 **150003 款项不存在**

预付款状态1(已付款) , 其他状态不可更新 , 错误信息 **150036 款项状态不可操作**

预付款修改之后金额与应收额不等 , 不可更新 , 错误信息 **150025 款项金额不正确**

**Requests:**

- `payment.pid` (Long): 预付款ID
- `payment.cash` (Long): 现金
- `payment.cashInfo` (String): 现金信息
- `payment.bank` (Long): 刷卡
- `payment.bankInfo` (String): 刷卡信息
- `payment.checkv` (Long): 转账
- `payment.checkvBank` (String): 转账银行
- `payment.installment` (Long): 分期
- `payment.installmentBank` (String): 分期银行
- `payment.accounts` (Long): 对公
- `payment.accountsBank` (String): 对公银行
- `payment.comment` (String): 说明

```json
{
    "payment.pid": 1,
    "payment.cash": 10000,
    "payment.cashInfo": "175",
    "payment.bank": 10000,
    "payment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
    "payment.checkv": 10000,
    "payment.checkvBank": "189",
    "payment.installment": 10000
    "payment.installmentBank": "201",
    "payment.accounts": 10000,
    "payment.accountsBank": "201",
    "payment.comment": "说明",
}
```

## 装修款


装修款款项信息管理以及相关业务功能


> **类**: `api.payment.DecorationPaymentAction`


#### 数据类型: `decorationPayment`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dpid` | 款项ID | Long |
| `drid` | 收据ID | Long |
| `ptid` | 款项类型ID | Long |
| `orderId` | 装修单号 | String |
| `decoration` | 装修单 , 类型 [decoration ](./decoration.html#api.decoration.decorationAction.decoration) | Object |
| `paymentType` | 款项类型 | String |
| `onetype` | 一类 , 0: 收款, 1: 退款 , 2: 历史 | Short |
| `twotype` | 二类 , 0: 基础 , 1: 合同 , 2: 增减 , 3: 其他 | Short |
| `paymentStatus` | 款项状态, 0:初始, 1:已付款, 2:已确认 , 3: 审批中 , 4: 历史 | Short |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `collecter` | 收款人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `collectTime` | 收款时间 | Timestamp |
| `confirmer` | 确认人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `confirmTime` | 确认时间 | Timestamp |
| `referMoney` | 应收款 | Long |
| `realMoney` | 实收金额 | Long |
| `sort` | 排序 | Short |
| `cash` | 现金 | Long |
| `cashInfo` | 现金信息 | String |
| `bank` | 刷卡 | Long |
| `bankInfo` | 刷卡信息 , **#** 分隔多条刷卡信息, **|** 分隔信息中不同字段 , 由 **类型|金额|时间** 组成 , 例如: **#187|15000|2016-03-23 14:25:15#** | String |
| `checkv` | 转账 | Long |
| `checkvBank` | 转账银行 | String |
| `installment` | 分期 | Long |
| `installmentBank` | 分期银行 | String |
| `accounts` | 对公 | Long |
| `accountsBank` | 对公银行 | String |
| `coupon` | 券值 | Long |
| `couponInfo` | 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#** | String |
| `advance` | 预付款 | Long |
| `advanceType` | 预付款类型 , 1: 合同预付款 , 2: 工程预付款 | Short |
| `company` | 公司ID | Integer |
| `comment` | 说明 | String |


#### 数据类型: `decorationReceipt`

| 参数 | 说明 | 类型 |
|------|------|------|
| `drid` | 收据ID | Long |
| `collecter` | 收款人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `collectTime` | 收款时间 | Timestamp |
| `confirmer` | 确认人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `confirmTime` | 确认时间 | Timestamp |
| `realMoney` | 实收金额 | Long |
| `cash` | 现金 | Long |
| `cashInfo` | 现金信息 | String |
| `bank` | 刷卡 | Long |
| `bankInfo` | 刷卡信息 , **#** 分隔多条刷卡信息, **|** 分隔信息中不同字段 , 由 **类型|金额|时间** 组成 , 例如: **#187|15000|2016-03-23 14:25:15#** | String |
| `checkv` | 转账 | Long |
| `checkvBank` | 转账银行 | String |
| `installment` | 分期 | Long |
| `installmentBank` | 分期银行 | String |
| `accounts` | 对公 | Long |
| `accountsBank` | 对公银行 | String |
| `coupon` | 券值 | Long |
| `couponInfo` | 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#** | String |
| `advance` | 预付款 | Long |
| `advanceType` | 预付款类型 , 1: 合同预付款 , 2: 工程预付款 | Short |
| `comment` | 说明 | String |


##### `查询` pageDecorationPayment

分页方式获取装修收款信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Requests:**

- `decorationPayment.paymentStatus` (Short): 状态
- `decorationPayment.oneType` (Short): 类型
- `decorationPayment.twoType` (Short): 类型

```json
{
    "decorationPayment.paymentStatus": 1,
    "decorationPayment.oneType": 0,
    "decorationPayment.twoType": 0
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 装修收款信息列表 , 每条数据类型 `decorationPayment`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "dpid": 1,
                "drid": 1,
                "ptid": 1,
                "decoration":{
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
                    },
                    "creater": {
                        "uid": 1,
                        "userId": "FL-02381",
                        "userName": "王宁",
                        "currentName": "王宁",
                        "phone": "136xxxx1453",
                        ...
                    },
                    "designer": {
                        "uid": 2,
                        "userId": "FL-00186",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "phone": "138xxxx1828",
                        ...
                    },
                    "salesman": {
                        "uid": 3,
                        "userId": "FL-00638",
                        "userName": "李宁",
                        "currentName": "李宁",
                        "phone": "156xxxx9283",
                        ...
                    },

                    "designDepartment": "设计中心一部",
                    "designRegion": "设计一分区",
                    "businessDepartment": "市场营销一部",
                    ...
                },
                "paymentType": "首付款",
                "onetype": 0,
                "twotype": 1,
                "paymentStatus": 0,
                "creater": {
                    "uid": 1,
                    "userId": "FL-02381",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "createTime": "2016-01-01 00:00:00",
                "collecter": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "collectTime": "2017-04-22 10:26:32",
                "confirmer": {
                    "uid": null,
                    "userId": null,
                    "userName": null,
                    "currentName": null,
                    "duty": null
                },
                "confirmTime": null,
                "referMoney": 16000,
                "realMoney": 16000,
                "cash": 16000,
                "cashInfo": "157",
                "bank": 0,
                "bankInfo": "",
                "checkv": 0,
                "checkvBank": "",
                "installment": 0,
                "installmentBank": "",
                "accounts": 0,
                "accountsBank": "",
                "coupon": 0,
                "couponInfo": "",
                "advance": 0,
                "advanceType": 0,
                "comment": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryDecorationPaymentByOrderId

通过装修单号获取装修款项信息

**Requests:**

- `decorationPayment.orderId` (String): 装修单号

```json
{
    "decorationPayment.orderId": "1601010001"
}
```

**Returns:**

- `decorationPayments` (List): 装修款项信息列表 , 每条数据类型 `decorationPayment`

```json
{
    ...
    "decorationPayments": [
        {
            "dpid": 1,
            "drid": 1,
            "ptid": 1,
            "decoration":{
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
                },
                "creater": {
                    "uid": 1,
                    "userId": "FL-02381",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "designer": {
                    "uid": 2,
                    "userId": "FL-00186",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "salesman": {
                    "uid": 3,
                    "userId": "FL-00638",
                    "userName": "李宁",
                    "currentName": "李宁",
                    "phone": "156xxxx9283",
                    ...
                },

                "designDepartment": "设计中心一部",
                "designRegion": "设计一分区",
                "businessDepartment": "市场营销一部",
                ...
            },
            "paymentType": "首付款",
            "onetype": 0,
            "twotype": 1,
            "paymentStatus": 0,
            "creater": {
                "uid": 1,
                "userId": "FL-02381",
                "userName": "王宁",
                "currentName": "王宁",
                "phone": "136xxxx1453",
                ...
            },
            "createTime": "2016-01-01 00:00:00",
            "collecter": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "collectTime": "2017-04-22 10:26:32",
            "confirmer": {
                "uid": null,
                "userId": null,
                "userName": null,
                "currentName": null,
                "duty": null
            },
            "confirmTime": null,
            "referMoney": 16000,
            "realMoney": 16000,
            "cash": 16000,
            "cashInfo": "157",
            "bank": 0,
            "bankInfo": "",
            "checkv": 0,
            "checkvBank": "",
            "installment": 0,
            "installmentBank": "",
            "accounts": 0,
            "accountsBank": "",
            "coupon": 0,
            "couponInfo": "",
            "advance": 0,
            "advanceType": 0,
            "comment": ""
        }
    ],
    ...
}
```


##### `查询` queryDecorationPaymentForContractByOrderId

通过装修单号获取装修款项信息 , 款项一类为0(收款) , 二类1(合同)

**Requests:**

- `decorationPayment.orderId` (String): 装修单号

```json
{
    "decorationPayment.orderId": "1601010001"
}
```

**Returns:**

- `decorationPayments` (List): 装修款项信息列表 , 每条数据类型 `decorationPayment`

```json
{
    ...
    "decorationPayments": [
        {
            "dpid": 1,
            "drid": 1,
            "ptid": 1,
            "decoration":{
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
                },
                "creater": {
                    "uid": 1,
                    "userId": "FL-02381",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "designer": {
                    "uid": 2,
                    "userId": "FL-00186",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "salesman": {
                    "uid": 3,
                    "userId": "FL-00638",
                    "userName": "李宁",
                    "currentName": "李宁",
                    "phone": "156xxxx9283",
                    ...
                },

                "designDepartment": "设计中心一部",
                "designRegion": "设计一分区",
                "businessDepartment": "市场营销一部",
                ...
            },
            "paymentType": "首付款",
            "onetype": 0,
            "twotype": 1,
            "paymentStatus": 0,
            "creater": {
                "uid": 1,
                "userId": "FL-02381",
                "userName": "王宁",
                "currentName": "王宁",
                "phone": "136xxxx1453",
                ...
            },
            "createTime": "2016-01-01 00:00:00",
            "collecter": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "collectTime": "2017-04-22 10:26:32",
            "confirmer": {
                "uid": null,
                "userId": null,
                "userName": null,
                "currentName": null,
                "duty": null
            },
            "confirmTime": null,
            "referMoney": 16000,
            "realMoney": 16000,
            "cash": 16000,
            "cashInfo": "157",
            "bank": 0,
            "bankInfo": "",
            "checkv": 0,
            "checkvBank": "",
            "installment": 0,
            "installmentBank": "",
            "accounts": 0,
            "accountsBank": "",
            "coupon": 0,
            "couponInfo": "",
            "advance": 0,
            "advanceType": 0,
            "comment": ""
        }
    ],
    ...
}
```


##### `查询` queryDecorationPaymentForNotInitByDrId

通过装修收据ID获取状态为未付款的装修款项

**Requests:**

- `decorationReceipt.drid` (Long): 收据ID

```json
{
    "decorationReceipt.drid": 1
}
```

**Returns:**

- `decorationPayments` (List): 装修款项信息列表 , 每条数据类型 `decorationPayment`

```json
{
    ...
    "decorationPayments": [
        {
            "dpid": 1,
            "drid": 1,
            "ptid": 1,
            "decoration":{
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
                },
                "creater": {
                    "uid": 1,
                    "userId": "FL-02381",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "designer": {
                    "uid": 2,
                    "userId": "FL-00186",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "salesman": {
                    "uid": 3,
                    "userId": "FL-00638",
                    "userName": "李宁",
                    "currentName": "李宁",
                    "phone": "156xxxx9283",
                    ...
                },

                "designDepartment": "设计中心一部",
                "designRegion": "设计一分区",
                "businessDepartment": "市场营销一部",
                ...
            },
            "paymentType": "首付款",
            "onetype": 0,
            "twotype": 1,
            "paymentStatus": 0,
            "creater": {
                "uid": 1,
                "userId": "FL-02381",
                "userName": "王宁",
                "currentName": "王宁",
                "phone": "136xxxx1453",
                ...
            },
            "createTime": "2016-01-01 00:00:00",
            "collecter": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "collectTime": "2017-04-22 10:26:32",
            "confirmer": {
                "uid": null,
                "userId": null,
                "userName": null,
                "currentName": null,
                "duty": null
            },
            "confirmTime": null,
            "referMoney": 16000,
            "realMoney": 16000,
            "cash": 16000,
            "cashInfo": "157",
            "bank": 0,
            "bankInfo": "",
            "checkv": 0,
            "checkvBank": "",
            "installment": 0,
            "installmentBank": "",
            "accounts": 0,
            "accountsBank": "",
            "coupon": 0,
            "couponInfo": "",
            "advance": 0,
            "advanceType": 0,
            "comment": ""
        }
    ],
    ...
}
```


##### `查询/创建` queryDecorationPaymentByDpid

通过款项ID获取装修收据信息

**Requests:**

- `decorationPayment.dpid` (Long): 装修款ID

```json
{
    "decorationPayment.dpid": 1
}
```

**Returns:**

- `decorationPayment` (Object): 装修款信息 , 类型 `decorationPayment`

```json
{
    ...
    "decorationPayment": {
        "dpid": 1,
        "drid": 1,
        "ptid": 1,
        "decoration":{
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
            },
            "creater": {
                "uid": 1,
                "userId": "FL-02381",
                "userName": "王宁",
                "currentName": "王宁",
                "phone": "136xxxx1453",
                ...
            },
            "designer": {
                "uid": 2,
                "userId": "FL-00186",
                "userName": "白雪",
                "currentName": "白雪",
                "phone": "138xxxx1828",
                ...
            },
            "salesman": {
                "uid": 3,
                "userId": "FL-00638",
                "userName": "李宁",
                "currentName": "李宁",
                "phone": "156xxxx9283",
                ...
            },

            "designDepartment": "设计中心一部",
            "designRegion": "设计一分区",
            "businessDepartment": "市场营销一部",
            ...
        },
        "paymentType": "首付款",
        "onetype": 0,
        "twotype": 1,
        "paymentStatus": 0,
        "creater": {
            "uid": 1,
            "userId": "FL-02381",
            "userName": "王宁",
            "currentName": "王宁",
            "phone": "136xxxx1453",
            ...
        },
        "createTime": "2016-01-01 00:00:00",
        "collecter": {
            "uid": 1,
            "userId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师"
        },
        "collectTime": "2017-04-22 10:26:32",
        "confirmer": {
            "uid": null,
            "userId": null,
            "userName": null,
            "currentName": null,
            "duty": null
        },
        "confirmTime": null,
        "referMoney": 16000,
        "realMoney": 16000,
        "cash": 16000,
        "cashInfo": "157",
        "bank": 0,
        "bankInfo": "",
        "checkv": 0,
        "checkvBank": "",
        "installment": 0,
        "installmentBank": "",
        "accounts": 0,
        "accountsBank": "",
        "coupon": 0,
        "couponInfo": "",
        "advance": 0,
        "advanceType": 0,
        "comment": ""
    }
    ...
}
```


##### `查询` queryDecoraionReceiptByDrId

通过收据ID获取装修收据信息

**Requests:**

- `decorationReceipt.drid` (Long): 收据ID

```json
{
    "decorationReceipt.drid": 1
}
```

**Returns:**

- `decorationReceipt` (Object): 装修收据信息 , 类型 `decorationReceipt`

```json
{
    ...
    "decorationReceipt": {
        "drid": 24,
        "collecter": {
            "uid": 1,
            "userId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师"
        },
        "collectTime": "2017-04-22 10:26:32",
        "confirmer": {
            "uid": null,
            "userId": null,
            "userName": null,
            "currentName": null,
            "duty": null
        },
        "confirmTime": null,
        "realMoney": 16000,
        "cash": 700,
        "cashInfo": "157",
        "bank": 200,
        "bankInfo": "#175|100|2015-12-05 11:11:11#175|100|2015-12-05 11:11:11#",
        "checkv": 100,
        "checkvBank": "158",
        "installment": 100,
        "installmentBank": "187",
        "accounts": 100,
        "accountsBank": "190",
        "advance": 0,
        "advanceType": 0,
        "coupon": 200,
        "couponInfo": "#物业费抵值券:100#赠品抵现:100#",
        "comment": ""
    }
    ...
}
```


##### `查询` sendDecorationPayment

推送装修款

判断装修款信息是否存在 , 不存在 , 错误信息 **150003 款项不存在**

**Requests:**

- `decorationPayment.dpid` (Long): 装修款ID

```json
{
    "decorationPayment.dpid": 1
}
```


##### `查询` checkDecorationPayment

判断装修款是否可以进行收款

判断当前款项状态是否为0(初始) , 错误信息 **150008 款项不能进行收款**

**Requests:**

- `decorationPayment.dpid` (Long): 款项ID

```json
{
    "decorationPayment.dpid": 1
}
```


##### `查询` addDecorationPayment

添加装修收款信息

判断装修单是否存在 , 不存在添加失败 , 错误信息 **140013 订单不存在**

判断装修款类型 , 增项款/减项款/合同退款/违约金 , 其他类型 , 错误信息 **150034 款项类型不可用**

**Requests:**

- `decorationPayment.orderId` (String): 装修单号
- `decorationPayment.ptid` (Long): 款项类型ID
- `decorationPayment.referMoney` (Long): 生成金额

```json
{
    "decorationPayment.orderId": "1601010001",
    "decorationPayment.ptid": 1,
    "decorationPayment.referMoney": 600000
}
```


##### `查询` changeDecorationPaymentForTime

修改装修款项收款和确认时间

**Requests:**

- `decorationPayment.orderId` (String): 装修单号
- `decorationPayment.paymentType` (String): 款项类型
- `dateTime` (Timestamp): 修改时间

```json
{
    "decorationPayment.orderId": "1601010001",
    "decorationPayment.paymentType": "首付款",
    "dateTime": "2016-01-01 00:00:00"
}
```


##### `查询` collectDecorationPayment

装修款项收款

判断装修单信息是否存在 , 不存在 , 错误信息 **150003 款项不存在**

判断装修款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**

根据操作款项中排序判断前置款项是否已经收款或确认 , 如果未收款或确认 , 错误信息 **150009 前置款项未处理**

判断提交款项方式汇总金额与装修款应付金额是否相等 , 不相等 , 错误信息 **150008 款项不能进行收款**

收款方式包括预付款 , 判断操作金额是否满足预付款余额 , 余额不足 , 错误信息 **150010 预付款余额不足**

装修款公司信息根据收款人操作公司进行更新

更新归属装修单的付款比例

**Requests:**

- `decorationPayment.dpid` (Long): 款项ID
- `decorationPayment.realMoney` (Long): 实收金额
- `decorationPayment.cash` (Long): 现金
- `decorationPayment.cashInfo` (String): 现金信息
- `decorationPayment.bank` (Long): 刷卡
- `decorationPayment.bankInfo` (String): 刷卡信息
- `decorationPayment.checkv` (Long): 转账
- `decorationPayment.checkvBank` (String): 转账银行
- `decorationPayment.installment` (Long): 分期
- `decorationPayment.installmentBank` (String): 分期银行
- `decorationPayment.accounts` (Long): 对公
- `decorationPayment.accountsBank` (String): 对公银行
- `decorationPayment.coupon` (Long): 券值
- `decorationPayment.couponInfo` (String): 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
- `decorationPayment.advance` (Long): 预付款
- `decorationPayment.advanceType` (Short): 预付款类型 , 1: 合同预付款 , 2: 工程预付款
- `decorationPayment.comment` (String): 说明

```json
{
    "decorationPayment.dpid": 1,
    "decorationPayment.realMoney": 50000,
    "decorationPayment.cash": 10000,
    "decorationPayment.cashInfo": "175",
    "decorationPayment.bank": 10000,
    "decorationPayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
    "decorationPayment.checkv": 10000,
    "decorationPayment.checkvBank": "189",
    "decorationPayment.installment": 10000
    "decorationPayment.installmentBank": "201",
    "decorationPayment.accounts": 10000,
    "decorationPayment.accountsBank": "201",
    "decorationPayment.coupon": 0,
    "decorationPayment.couponInfo": "",
    "decorationPayment.advance": 0,
    "decorationPayment.advanceType": 0,
    "decorationPayment.comment": "说明",
}
```


##### `查询` refundDecorationPayment

装修款项中退款类型款项收款

判断装修单信息是否存在 , 不存在 , 错误信息 **150003 款项不存在**

判断装修款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**

判断提交款项方式汇总金额与装修款应付金额是否相等 , 不相等 , 错误信息 **150013 款项实收金额不等于应收金额**

装修款公司信息根据收款人操作公司进行更新

**Requests:**

- `decorationPayment.dpid` (Long): 款项ID
- `decorationPayment.realMoney` (Long): 实收金额
- `decorationPayment.cash` (Long): 现金
- `decorationPayment.cashInfo` (String): 现金信息
- `decorationPayment.bank` (Long): 刷卡
- `decorationPayment.bankInfo` (String): 刷卡信息
- `decorationPayment.checkv` (Long): 转账
- `decorationPayment.checkvBank` (String): 转账银行
- `decorationPayment.installment` (Long): 分期
- `decorationPayment.installmentBank` (String): 分期银行
- `decorationPayment.accounts` (Long): 对公
- `decorationPayment.accountsBank` (String): 对公银行
- `decorationPayment.coupon` (Long): 券值
- `decorationPayment.couponInfo` (String): 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
- `decorationPayment.advance` (Long): 预付款
- `decorationPayment.advanceType` (Short): 预付款类型 , 1: 合同预付款 , 2: 工程预付款
- `decorationPayment.comment` (String): 说明

```json
{
    "decorationPayment.dpid": 1,
    "decorationPayment.realMoney": 50000,
    "decorationPayment.cash": 10000,
    "decorationPayment.cashInfo": "175",
    "decorationPayment.bank": 10000,
    "decorationPayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
    "decorationPayment.checkv": 10000,
    "decorationPayment.checkvBank": "189",
    "decorationPayment.installment": 10000
    "decorationPayment.installmentBank": "201",
    "decorationPayment.accounts": 10000,
    "decorationPayment.accountsBank": "201",
    "decorationPayment.coupon": 0,
    "decorationPayment.couponInfo": "",
    "decorationPayment.advance": 0,
    "decorationPayment.advanceType": 0,
    "decorationPayment.comment": "说明",
}
```


##### `查询` confirmDecorationPayment

装修款项确认 , 更新款项状态为已确认

**Requests:**


```json
{
    "dpids[0]": 1
}
```


##### `查询` updateDecorationPayment

更新装修款收款方式信息

判断款项是否存在 , 不存在 , 错误信息 **150003 款项不存在**

款项状态1(已付款) , 其他状态不可更新 , 错误信息 **150036 款项状态不可操作**

款项修改之后金额与应收额不等 , 不可更新 , 错误信息 **150025 款项金额不正确**

装修款收款方式更新 , 只能够针对现金/刷卡进行更新 , 优惠/预付不可更新

**Requests:**

- `decorationPayment.dpid` (Long): 款项ID
- `decorationPayment.cash` (Long): 现金
- `decorationPayment.cashInfo` (String): 现金信息
- `decorationPayment.bank` (Long): 刷卡
- `decorationPayment.bankInfo` (String): 刷卡信息
- `decorationPayment.checkv` (Long): 转账
- `decorationPayment.checkvBank` (String): 转账银行
- `decorationPayment.installment` (Long): 分期
- `decorationPayment.installmentBank` (String): 分期银行
- `decorationPayment.accounts` (Long): 对公
- `decorationPayment.accountsBank` (String): 对公银行
- `decorationPayment.comment` (String): 说明

```json
{
    "decorationPayment.dpid": 1,
    "decorationPayment.cash": 10000,
    "decorationPayment.cashInfo": "175",
    "decorationPayment.bank": 10000,
    "decorationPayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
    "decorationPayment.checkv": 10000,
    "decorationPayment.checkvBank": "189",
    "decorationPayment.installment": 10000
    "decorationPayment.installmentBank": "201",
    "decorationPayment.accounts": 10000,
    "decorationPayment.accountsBank": "201",
    "decorationPayment.comment": "说明",
}
```


##### `查询` deleteDecorationPayment

删除装修款

判断款项是否存在 , 不存在 , 错误信息 **150003 款项不存在**

款项状态非0(未付款) , 其他状态不可更新 , 错误信息 **150036 款项状态不可操作**

**Requests:**

- `decorationPayment.dpid` (Long): 款项ID

```json
{
    "decorationPayment.dpid": 1
}
```

## 主材款


主材款款项信息管理以及相关业务功能


> **类**: `api.payment.MaterialPaymentAction`


#### 数据类型: `materialPayment`

| 参数 | 说明 | 类型 |
|------|------|------|
| `mpid` | 款项ID | Long |
| `material` | 主材单 , 类型 [material ](./material.html#api.material.MaterialAction.material) | Object |
| `paymentType` | 款项类型, 1: 预付款(过时), 2:定金, 3: 补款, 4:退款, 5: 补款退款, 6: 券退款, 7: 定金退款 | Short |
| `paymentStatus` | 状态, 0: 初始, 1: 已收款, 2: 已确认 | Short |
| `category` | 品类 | String |
| `brand` | 品牌 | String |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `collecter` | 收款人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `collectTime` | 收款时间 | Timestamp |
| `confirmer` | 确认人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `confirmTime` | 确认时间 | Timestamp |
| `referMoney` | 应收金额 | Long |
| `realMoney` | 实收金额 | Long |
| `cash` | 现金 | Long |
| `cashInfo` | 现金信息 | String |
| `bank` | 刷卡 | Long |
| `bankInfo` | 刷卡信息 , **#** 分隔多条刷卡信息, **|** 分隔信息中不同字段 , 由 **类型|金额|时间** 组成 , 例如: **#187|15000|2016-03-23 14:25:15#** | String |
| `checkv` | 转账 | Long |
| `checkvBank` | 转账银行 | String |
| `installment` | 分期 | Long |
| `installmentBank` | 分期银行 | String |
| `accounts` | 对公 | Long |
| `accountsBank` | 对公银行 | String |
| `coupon` | 券值 | Long |
| `couponInfo` | 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#** | String |
| `advance` | 预付款 | Long |
| `advanceType` | 预付款类型 , 1: 主材预付款 , 2: 正林预付款 | Short |
| `company` | 公司ID | Integer |
| `comment` | 说明 | String |


#### 数据类型: `materialReceipt`

| 参数 | 说明 | 类型 |
|------|------|------|
| `mrid` | 收据ID | Long |
| `collecter` | 收款人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `collectTime` | 收款时间 | Timestamp |
| `confirmer` | 确认人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `confirmTime` | 确认时间 | Timestamp |
| `realMoney` | 实收金额 | Long |
| `cash` | 现金 | Long |
| `cashInfo` | 现金信息 | String |
| `bank` | 刷卡 | Long |
| `bankInfo` | 刷卡信息 , **#** 分隔多条刷卡信息, **|** 分隔信息中不同字段 , 由 **类型|金额|时间** 组成 , 例如: **#187|15000|2016-03-23 14:25:15#** | String |
| `checkv` | 转账 | Long |
| `checkvBank` | 转账银行 | String |
| `installment` | 分期 | Long |
| `installmentBank` | 分期银行 | String |
| `accounts` | 对公 | Long |
| `accountsBank` | 对公银行 | String |
| `coupon` | 券值 | Long |
| `couponInfo` | 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#** | String |
| `advance` | 预付款 | Long |
| `advanceType` | 预付款类型 , 1: 主材预付款 , 2: 正林预付款 | Short |
| `comment` | 说明 | String |


##### `查询` pageMaterialPayment

分页方式获取主材收款信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Requests:**

- `materialPayment.paymentStatus` (Short): 状态
- `materialPayment.paymentType` (Short): 类型

```json
{
    "materialPayment.paymentStatus": 1,
    "materialPayment.paymentType": 0
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 主材收款信息列表 , 每条数据类型 `materialPayment`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "mpid": 1,
                "material": {
                    "mid": 1,
                    "no": "M1601012703",
                    "orderId": "1601010001",
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
                    },
                    "salesman": {
                        "uid": 3,
                        "userId": "FL-00638",
                        "userName": "李宁",
                        "currentName": "李宁",
                        "phone": "156xxxx9283",
                        ...
                    },
                    "materialer": {
                        "uid": 21,
                        "userId": "FL-83726",
                        "userName": "王宁",
                        "currentName": "王宁",
                        "phone": "179xxxx2837",
                        ...
                    },
                    "instorer": {
                        "uid": 87,
                        "userId": "FL-83726",
                        "userName": "宋茜",
                        "currentName": "宋茜",
                        "phone": "138xxxx2837",
                        ...
                    },

                    "category": "洁具",
                    "brand": "卫浴",

                    "designRegion": "设计一分区",
                    "designDepartment": "设计一部",
                    "materialDepartment": "主材二组",

                    "coupon": 100,
                    "couponInfo": "",
                    ...
                }
                "paymentStatus": 0,
                "paymentType": 3,
                "category": "洁具",
                "brand": "箭牌卫浴",
                "creater": {
                    "uid": 1,
                    "userId": "FL-02381",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "createTime": "2016-01-01 00:00:00",
                "collecter": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "collectTime": "2017-04-22 10:26:32",
                "confirmer": {
                    "uid": null,
                    "userId": null,
                    "userName": null,
                    "currentName": null,
                    "duty": null
                },
                "confirmTime": null,
                "referMoney": 500,
                "realMoney": 500,
                "cash": 500,
                "cashInfo": "157",
                "bank": 0,
                "bankInfo": "",
                "checkv": 0,
                "checkvBank": "",
                "installment": 0,
                "installmentBank": "",
                "accounts": 0,
                "accountsBank": "",
                "coupon": 0,
                "couponInfo": "",
                "advance": 0,
                "advanceType": 0,
                "comment": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryMaterialPaymentByOrderId

通过装修单号获取装修单下所有主材装修单的款项信息

**Requests:**

- `materialPayment.orderId` (String): 装修单号

```json
{
    "materialPayment.orderId": "1601010001"
}
```

**Returns:**

- `materialPayments` (List): 主材收款信息列表 , 每条数据类型 `materialPayment`

```json
{
    ...
    "materialPayments": [
        {
            "mpid": 1,
            "material": {
                "mid": 1,
                "no": "M1601012703",
                "orderId": "1601010001",
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
                },
                "salesman": {
                    "uid": 3,
                    "userId": "FL-00638",
                    "userName": "李宁",
                    "currentName": "李宁",
                    "phone": "156xxxx9283",
                    ...
                },
                "materialer": {
                    "uid": 21,
                    "userId": "FL-83726",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "179xxxx2837",
                    ...
                },
                "instorer": {
                    "uid": 87,
                    "userId": "FL-83726",
                    "userName": "宋茜",
                    "currentName": "宋茜",
                    "phone": "138xxxx2837",
                    ...
                },

                "category": "洁具",
                "brand": "卫浴",

                "designRegion": "设计一分区",
                "designDepartment": "设计一部",
                "materialDepartment": "主材二组",

                "coupon": 100,
                "couponInfo": "",
                ...
            }
            "paymentStatus": 0,
            "paymentType": 3,
            "category": "洁具",
            "brand": "箭牌卫浴",
            "creater": {
                "uid": 1,
                "userId": "FL-02381",
                "userName": "王宁",
                "currentName": "王宁",
                "phone": "136xxxx1453",
                ...
            },
            "createTime": "2016-01-01 00:00:00",
            "collecter": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "collectTime": "2017-04-22 10:26:32",
            "confirmer": {
                "uid": null,
                "userId": null,
                "userName": null,
                "currentName": null,
                "duty": null
            },
            "confirmTime": null,
            "referMoney": 500,
            "realMoney": 500,
            "cash": 500,
            "cashInfo": "157",
            "bank": 0,
            "bankInfo": "",
            "checkv": 0,
            "checkvBank": "",
            "installment": 0,
            "installmentBank": "",
            "accounts": 0,
            "accountsBank": "",
            "coupon": 0,
            "couponInfo": "",
            "advance": 0,
            "advanceType": 0,
            "comment": ""
        }
    ],
    ...
}
```


##### `查询` queryMaterialPaymentByMid

通过主材单ID获取主材收款信息

**Requests:**

- `materialPayment.material.mid` (Long): 主材单ID

```json
{
    "materialPayment.material.mid": 1
}
```

**Returns:**

- `materialPayments` (List): 主材收款信息列表 , 每条数据类型 `materialPayment`

```json
{
    ...
    "materialPayments": [
        {
            "mpid": 1,
            "material": {
                "mid": 1,
                "no": "M1601012703",
                "orderId": "1601010001",
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
                },
                "salesman": {
                    "uid": 3,
                    "userId": "FL-00638",
                    "userName": "李宁",
                    "currentName": "李宁",
                    "phone": "156xxxx9283",
                    ...
                },
                "materialer": {
                    "uid": 21,
                    "userId": "FL-83726",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "179xxxx2837",
                    ...
                },
                "instorer": {
                    "uid": 87,
                    "userId": "FL-83726",
                    "userName": "宋茜",
                    "currentName": "宋茜",
                    "phone": "138xxxx2837",
                    ...
                },

                "category": "洁具",
                "brand": "卫浴",

                "designRegion": "设计一分区",
                "designDepartment": "设计一部",
                "materialDepartment": "主材二组",

                "coupon": 100,
                "couponInfo": "",
                ...
            }
            "paymentStatus": 0,
            "paymentType": 3,
            "category": "洁具",
            "brand": "箭牌卫浴",
            "creater": {
                "uid": 1,
                "userId": "FL-02381",
                "userName": "王宁",
                "currentName": "王宁",
                "phone": "136xxxx1453",
                ...
            },
            "createTime": "2016-01-01 00:00:00",
            "collecter": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "collectTime": "2017-04-22 10:26:32",
            "confirmer": {
                "uid": null,
                "userId": null,
                "userName": null,
                "currentName": null,
                "duty": null
            },
            "confirmTime": null,
            "referMoney": 500,
            "realMoney": 500,
            "cash": 500,
            "cashInfo": "157",
            "bank": 0,
            "bankInfo": "",
            "checkv": 0,
            "checkvBank": "",
            "installment": 0,
            "installmentBank": "",
            "accounts": 0,
            "accountsBank": "",
            "coupon": 0,
            "couponInfo": "",
            "advance": 0,
            "advanceType": 0,
            "comment": ""
        }
    ],
    ...
}
```


##### `查询` queryMaterialPaymentForNotInitByMrId

通过收据ID获取主材款项信息 , 状态为非初始

**Requests:**

- `materialReceipt.mrid` (Long): 收据ID

```json
{
    "materialReceipt.mrid": 1
}
```

**Returns:**

- `materialPayments` (List): 主材收款信息列表 , 每条数据类型 `materialPayment`

```json
{
    ...
    "materialPayments": [
        {
            "mpid": 1,
            "material": {
                "mid": 1,
                "no": "M1601012703",
                "orderId": "1601010001",
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
                },
                "salesman": {
                    "uid": 3,
                    "userId": "FL-00638",
                    "userName": "李宁",
                    "currentName": "李宁",
                    "phone": "156xxxx9283",
                    ...
                },
                "materialer": {
                    "uid": 21,
                    "userId": "FL-83726",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "179xxxx2837",
                    ...
                },
                "instorer": {
                    "uid": 87,
                    "userId": "FL-83726",
                    "userName": "宋茜",
                    "currentName": "宋茜",
                    "phone": "138xxxx2837",
                    ...
                },

                "category": "洁具",
                "brand": "卫浴",

                "designRegion": "设计一分区",
                "designDepartment": "设计一部",
                "materialDepartment": "主材二组",

                "coupon": 100,
                "couponInfo": "",
                ...
            }
            "paymentStatus": 0,
            "paymentType": 3,
            "category": "洁具",
            "brand": "箭牌卫浴",
            "creater": {
                "uid": 1,
                "userId": "FL-02381",
                "userName": "王宁",
                "currentName": "王宁",
                "phone": "136xxxx1453",
                ...
            },
            "createTime": "2016-01-01 00:00:00",
            "collecter": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "collectTime": "2017-04-22 10:26:32",
            "confirmer": {
                "uid": null,
                "userId": null,
                "userName": null,
                "currentName": null,
                "duty": null
            },
            "confirmTime": null,
            "referMoney": 500,
            "realMoney": 500,
            "cash": 500,
            "cashInfo": "157",
            "bank": 0,
            "bankInfo": "",
            "checkv": 0,
            "checkvBank": "",
            "installment": 0,
            "installmentBank": "",
            "accounts": 0,
            "accountsBank": "",
            "coupon": 0,
            "couponInfo": "",
            "advance": 0,
            "advanceType": 0,
            "comment": ""
        }
    ],
    ...
}
```


##### `查询` queryMaterialReceiptByMrId

通过收据ID获取主材收据信息

**Requests:**

- `materialReceipt.mrid` (Long): 收据ID

```json
{
    "materialReceipt.mrid": 1
}
```

**Returns:**

- `materialReceipt` (Object): 主材收据信息 , 类型 `materialReceipt`

```json
{
    ...
    "materialReceipt": {
        "mrid": 1,
        "collecter": {
            "uid": 1,
            "userId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师"
        },
        "collectTime": "2017-04-22 10:26:32",
        "confirmer": {
            "uid": null,
            "userId": null,
            "userName": null,
            "currentName": null,
            "duty": null
        },
        "confirmTime": null,
        "realMoney": 500,
        "cash": 700,
        "cashInfo": "157",
        "bank": 200,
        "bankInfo": "#175|100|2015-12-05 11:11:11#175|100|2015-12-05 11:11:11#",
        "checkv": 100,
        "checkvBank": "158",
        "installment": 100,
        "installmentBank": "187",
        "accounts": 100,
        "accountsBank": "190",
        "advance": 0,
        "advanceType": 0,
        "coupon": 200,
        "couponInfo": "#物业费抵值券:100#赠品抵现:100#",
        "comment": ""
    }
    ...
}
```


##### `查询` checkMaterialPayment

判断主材款项是否可以进行收款

判断主材款项状态是否为0(初始) , 其他状态 , 错误信息 **150008 款项不能进行收款**

**Requests:**

- `materialPayment.mpid` (Long): 款项ID

```json
{
    "materialPayment.mpid": 1
}
```


##### `查询` addMaterialPaymentForDeposit

生成定金主材款

主材单是否存在 , 不存在 , 错误信息 **180001 主材订单不存在**

应收款金额大于零 , 小于零 , 错误信息 **150025 款项金额不正确**

不可存在主材单对应的其他款项 , 如果存在 , 错误信息 **150029 款项不可提交**

判断提交主材款类型是否已经存在 , 已存在 , 错误信息 **150029 款项不可提交**

主材单更新定金额为提交项金额 , 定金状态为1(未付款)

**Requests:**

- `materialPayment.material.mid` (Long): 主材单ID
- `materialPayment.referMoney` (Long): 应收金额

```json
{
    "materialPayment.material.mid": 1,
    "materialPayment.paymentType": 1,
    "materialPayment.referMoney": 1000
}
```


##### `查询` addMaterialPaymentForFullpay

生成补款主材款

获取主材款类型为3(补款)的款项 , 如果存在 , 错误信息 **150040 补款已存在**

定金主材款存在 , 判断款项状态是否为1(已收款)或2(已确认) , 状态为0(初始) , 错误信息 **150041 定金状态不可操作**

判断主材项总额与定金+补款总额是否一致 , 不一致 , 错误信息 **150017 项目总额与款项额不符**

生成款项金额为正数 , 款项类型为3(补款) , 生成金额为负数 , 款项类型为5(补款退款)

主材单更新补款额为提交款项金额 , 补款状态为1(未付款)

生成补款退款类型款项信息 , 其作用等同于补款

**Requests:**

- `materialPayment.material.mid` (Long): 主材单ID
- `materialPayment.referMoney` (Long): 金额

```json
{
    "materialPayment.material.mid": 1,
    "materialPayment.referMoney": 1000
}
```


##### `查询` cancelMaterialPaymentForDeposit

撤销定金主材款

获取主材款类型为3(补款)的款项 , 如果存在 , 错误信息 **150040 补款已存在**

获取主材款类型为2(定金)的款项 , 如果不存在 , 错误信息 **150037 定金不存在**

判断定金主材款状态是否为0(初始) , 其他状态 , 错误信息 **150036 款项状态不可操作**

删除定金主材款信息

更新主材单中定金额为0 , 定金状态为0(初始)

**Requests:**

- `materialPayment.material.mid` (Long): 主材单ID

```json
{
    "materialPayment.material.mid": 1,
    "materialPayment.paymentType": 1
}
```


##### `查询` cancelMaterialPaymentForFullpay

撤销补款主材款

获取主材款类型为3(补款)/5(补款退款)的款项 , 如果不存在 , 错误信息 **150038 补款不存在**

判断补款/补款退款主材款状态是否为0(初始) , 其他状态 , 错误信息 **150036 款项状态不可操作**

删除补款主材款信息

更新主材单中补款额为0, 补款状态为0(初始)

**Requests:**

- `materialPayment.material.mid` (Long): 主材单ID

```json
{
    "materialPayment.material.mid": 1,
    "materialPayment.paymentType": 1
}
```


##### `查询` collectMaterialPayment

主材款项收款

判断主材款是否存在 , 不存在 , 错误信息 **150003 款项不存在**

判断主材款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**

判断提交款项方式汇总金额与装修款应付金额是否相等 , 不相等 , 错误信息 **150008 款项不能进行收款**

收款方式包括预付款 , 判断操作金额是否满足预付款余额 , 余额不足 , 错误信息 **150010 预付款余额不足**

主材款公司信息根据收款人操作公司进行更新

更新主材单对应收款类型的状态信息 , 定金/补款状态为1(已付款)

款项类型为补款(3) , 更新销售单中补款时间

**Requests:**

- `materialPayment.mpid` (Long): 款项ID
- `materialPayment.realMoney` (Long): 实收金额
- `materialPayment.cash` (Long): 现金
- `materialPayment.cashInfo` (String): 现金信息
- `materialPayment.bank` (Long): 刷卡
- `materialPayment.bankInfo` (String): 刷卡信息
- `materialPayment.checkv` (Long): 转账
- `materialPayment.checkvBank` (String): 转账银行
- `materialPayment.installment` (Long): 分期
- `materialPayment.installmentBank` (String): 分期银行
- `materialPayment.accounts` (Long): 对公
- `materialPayment.accountsBank` (String): 对公银行
- `materialPayment.coupon` (Long): 券值
- `materialPayment.couponInfo` (String): 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
- `materialPayment.advance` (Long): 预付款
- `materialPayment.advanceType` (Short): 预付款类型 , 1: 合同预付款 , 2: 工程预付款
- `materialPayment.comment` (String): 说明

```json
{
    "materialPayment.mpid": 1,
    "materialPayment.realMoney": 10000,
    "materialPayment.cash": 10000,
    "materialPayment.cashInfo": "175",
    "materialPayment.bank": 10000,
    "materialPayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
    "materialPayment.checkv": 10000,
    "materialPayment.checkvBank": "189",
    "materialPayment.installment": 10000
    "materialPayment.installmentBank": "201",
    "materialPayment.accounts": 10000,
    "materialPayment.accountsBank": "201",
    "materialPayment.coupon": 0,
    "materialPayment.couponInfo": "",
    "materialPayment.advance": 0,
    "materialPayment.advanceType": 0,
    "materialPayment.comment": "说明",
}
```


##### `查询` collectMaterialPayments

主材款项批量收款

判断主材款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**

判断主材款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**

判断提交款项方式汇总金额与装修款应付金额是否相等 , 不相等 , 错误信息 **150008 款项不能进行收款**

收款方式包括预付款 , 判断操作金额是否满足预付款余额 , 余额不足 , 错误信息 **150010 预付款余额不足**

主材款公司信息根据收款人操作公司进行更新

更新主材单对应收款类型的状态信息 , 定金/补款状态为2(已付款)

款项类型为补款(3) , 更新销售单中补款时间

**Requests:**

- `material.orderId` (String): 装修单号
- `materialReceipt.realMoney` (Long): 实收金额
- `materialReceipt.cash` (Long): 现金
- `materialReceipt.cashInfo` (String): 现金信息
- `materialReceipt.bank` (Long): 刷卡
- `materialReceipt.bankInfo` (String): 刷卡信息
- `materialReceipt.checkv` (Long): 转账
- `materialReceipt.checkvBank` (String): 转账银行
- `materialReceipt.installment` (Long): 分期
- `materialReceipt.installmentBank` (String): 分期银行
- `materialReceipt.accounts` (Long): 对公
- `materialReceipt.accountsBank` (String): 对公银行
- `materialReceipt.coupon` (Long): 券值
- `materialReceipt.couponInfo` (String): 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
- `materialReceipt.advance` (Long): 预付款
- `materialReceipt.advanceType` (Short): 预付款类型 , 1: 合同预付款 , 2: 工程预付款
- `materialReceipt.comment` (String): 说明

```json
{
    "material.orderId": "1601010001",
    "materialPayment[0].mpid": 1,
    "materialReceipt.realMoney": 10000,
    "materialReceipt.cash": 10000,
    "materialReceipt.cashInfo": "175",
    "materialReceipt.bank": 10000,
    "materialReceipt.bankInfo": "#187|15000|2016-03-23 14:25:15#",
    "materialReceipt.checkv": 10000,
    "materialReceipt.checkvBank": "189",
    "materialReceipt.installment": 10000
    "materialReceipt.installmentBank": "201",
    "materialReceipt.accounts": 10000,
    "materialReceipt.accountsBank": "201",
    "materialReceipt.coupon": 0,
    "materialReceipt.couponInfo": "",
    "materialReceipt.advance": 0,
    "materialReceipt.advanceType": 0,
    "materialReceipt.comment": "说明"
}
```


##### `查询` refundMaterialPayment

主材退款

判断主材款是否存在 , 不存在 , 错误信息 **150003 款项不存在**

判断主材款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**

如果主材款类型为7(定金退款) , 更新主材单中定金额为0 , 定金状态为0(初始)

如果主材款类型为5(补款退款) , 更新主材单中补款状态为2(已付款) , 补款时间为操作时间

如果主材款类型为4(退款) , 更新退款主材项状态为2(已付款)

主材款公司信息根据收款人操作公司进行更新

更新款项状态以及生成对应收据相关信息

**Requests:**

- `materialPayment.mpid` (Long): 款项ID
- `materialPayment.cash` (Long): 现金
- `materialPayment.cashInfo` (String): 现金信息
- `materialPayment.bank` (Long): 刷卡
- `materialPayment.bankInfo` (String): 刷卡信息
- `materialPayment.checkv` (Long): 转账
- `materialPayment.checkvBank` (String): 转账银行
- `materialPayment.installment` (Long): 分期
- `materialPayment.installmentBank` (String): 分期银行
- `materialPayment.accounts` (Long): 对公
- `materialPayment.accountsBank` (String): 对公银行
- `materialPayment.coupon` (Long): 券值
- `materialPayment.couponInfo` (String): 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
- `materialPayment.advance` (Long): 预付款
- `materialPayment.advanceType` (Short): 预付款类型 , 1: 合同预付款 , 2: 工程预付款
- `materialPayment.comment` (String): 说明

```json
{
    "materialPayment.mpid": 1,
    "materialPayment.cash": 10000,
    "materialPayment.cashInfo": "175",
    "materialPayment.bank": 10000,
    "materialPayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
    "materialPayment.checkv": 10000,
    "materialPayment.checkvBank": "189",
    "materialPayment.installment": 10000
    "materialPayment.installmentBank": "201",
    "materialPayment.accounts": 10000,
    "materialPayment.accountsBank": "201",
    "materialPayment.coupon": 0,
    "materialPayment.couponInfo": "",
    "materialPayment.advance": 0,
    "materialPayment.advanceType": 0,
    "materialPayment.comment": "说明"
}
```


##### `查询` refundMaterialPaymentForDeposit

生成主材款中定金退款

获取主材款类型为3(补款)的款项 , 如果存在 , 错误信息 **150040 补款已存在**

获取主材款类型为2(定金)的款项 , 如果不存在 , 错误信息 **150037 定金不存在**

判断定金主材款状态是否为2(已确认) , 其他状态 , 错误信息 **150012 款项不能进行退款**

主材单更新定金额为0 , 定金状态为0(初始)

主材单状态更新为8(废单)

**Requests:**

- `materialPayment.material.mid` (Long): 主材单ID

```json
{
    "materialPayment.material.mid": 1
}
```


##### `查询` refundMaterialPaymentForCoupon

生成主材款项中券退款

获取主材款类型为2(定金)的款项 , 如果不存在 , 错误信息 **150037 定金不存在**

判断定金主材款状态是否为1(已收款)或2(已确认) , 状态为0(初始) , 错误信息 **150041 定金状态不可操作**

生成券退款类型款项信息 , 同时更新主材单中券值和券信息

**Requests:**

- `material.mid` (Long): 主材单ID
- `material.coupon` (Long): 券值
- `material.couponInfo` (String): 券信息

```json
{
    "material.mid": 1,
    "material.coupon": 100000,
    "material.couponInfo": #瓷砖券:100#
}
```


##### `查询` updateMaterialPayment

更新主材款收款方式

判断款项是否存在 , 不存在 , 错误信息 **150003 款项不存在**

主材款状态1(已付款) , 其他状态不可更新 , 错误信息 **150036 款项状态不可操作**

主材款修改之后金额与应收额不等 , 不可更新 , 错误信息 **150025 款项金额不正确**

预付款和优惠券不可修改

**Requests:**

- `materialPayment.mpid` (Long): 款项ID
- `materialPayment.cash` (Long): 现金
- `materialPayment.cashInfo` (String): 现金信息
- `materialPayment.bank` (Long): 刷卡
- `materialPayment.bankInfo` (String): 刷卡信息
- `materialPayment.checkv` (Long): 转账
- `materialPayment.checkvBank` (String): 转账银行
- `materialPayment.installment` (Long): 分期
- `materialPayment.installmentBank` (String): 分期银行
- `materialPayment.accounts` (Long): 对公
- `materialPayment.accountsBank` (String): 对公银行
- `materialPayment.comment` (String): 说明

```json
{
    "materialPayment.mpid": 1,
    "materialPayment.cash": 10000,
    "materialPayment.cashInfo": "175",
    "materialPayment.bank": 10000,
    "materialPayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
    "materialPayment.checkv": 10000,
    "materialPayment.checkvBank": "189",
    "materialPayment.installment": 10000
    "materialPayment.installmentBank": "201",
    "materialPayment.accounts": 10000,
    "materialPayment.accountsBank": "201",
    "materialPayment.comment": "说明"
}
```


##### `查询` confirmMaterialPayment

主材款项确认

判断款项是否存在 , 不存在 , 错误信息 **150003 款项不存在**

主材款类型为2(定金) , 更新主材单定金状态为3(已确认)

主材款类型为3(补款)/5(补款退款) , 更新主材单补款状态为3(已确认)

已经确认的主材款项忽略处理

**Requests:**


```json
{
    "mpids[0]": 1
}
```


##### `查询` changeMaterialPaymentForTime

修改主材款项收款和确认时间

判断主材款是否存在 , 不存在 , 错误信息 **150003 款项不存在**

**Requests:**

- `materialPayment.no` (String): 主材单编号
- `materialPayment.paymentType` (Integer): 款项类型
- `dateTime` (Timestamp): 修改时间

```json
{
    "materialPayment.no": "M1601010001",
    "materialPayment.paymentType": 1,
    "dateTime": "2016-01-01 00:00:00"
}
```

## 服务款


服务款项信息管理以及相关业务功能

服务款主要针对类型为半价的装修单完成主材服务费款项相关操作


> **类**: `api.payment.ServicePaymentAction`


#### 数据类型: `servicePayment`

| 参数 | 说明 | 类型 |
|------|------|------|
| `spid` | 款项ID | Long |
| `decoration` | 装修单 , 类型 [decoration ](./decoration.html#api.decoration.decorationAction.decoration) | Object |
| `pid` | 预付款款项ID | Long |
| `srid` | 收据ID | Long |
| `type` | 类型 , 0: 收款 , 1: 退款 | Short |
| `status` | 状态, 0: 初始, 1: 已收款, 2: 已确认 | Short |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createrName` | 创建人名 | String |
| `collecter` | 收款人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `collecterName` | 收款人名 | String |
| `collectTime` | 收款时间 | Timestamp |
| `confirmer` | 确认人, 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `confirmerName` | 确认人名 | String |
| `confirmTime` | 确认时间 | Timestamp |
| `serviceMoney` | 服务费金额 | Long |
| `advanceMoney` | 预付款金额 | Long |
| `realMoney` | 实收金额 | Long |
| `cash` | 现金 | Long |
| `cashInfo` | 现金信息 | String |
| `bank` | 刷卡 | Long |
| `bankInfo` | 刷卡信息 , **#** 分隔多条刷卡信息, **|** 分隔信息中不同字段 , 由 **类型|金额|时间** 组成 , 例如: **#187|15000|2016-03-23 14:25:15#** | String |
| `checkv` | 转账 | Long |
| `checkvBank` | 转账银行 | String |
| `installment` | 分期 | Long |
| `installmentBank` | 分期银行 | String |
| `accounts` | 对公 | Long |
| `accountsBank` | 对公银行 | String |
| `company` | 公司ID | Integer |
| `comment` | 说明 | String |


#### 数据类型: `serviceReceipt`

| 参数 | 说明 | 类型 |
|------|------|------|
| `srid` | 收据ID | Long |
| `collecter` | 收款人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `collectTime` | 收款时间 | Timestamp |
| `confirmer` | 收款人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `confirmTime` | 确认时间 | Timestamp |
| `realMoney` | 实收金额 | Long |
| `cash` | 现金 | Long |
| `cashInfo` | 现金信息 | String |
| `bank` | 刷卡 | Long |
| `bankInfo` | 刷卡信息 , **#** 分隔多条刷卡信息, **|** 分隔信息中不同字段 , 由 **类型|金额|时间** 组成 , 例如: **#187|15000|2016-03-23 14:25:15#** | String |
| `checkv` | 转账 | Long |
| `checkvBank` | 转账银行 | String |
| `installment` | 分期 | Long |
| `installmentBank` | 分期银行 | String |
| `accounts` | 对公 | Long |
| `accountsBank` | 对公银行 | String |
| `comment` | 说明 | String |


##### `查询` pageServicePayment

页方式获服务款收款信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

根据当前操作公司作为条件查询对应公司的服务款

**Requests:**

- `servicePayment.status` (Short): 状态

```json
{
    "servicePayment.status": 1
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 销售收款信息列表 , 每条数据类型 `servicePayment`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "spid": 1,
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
                    },
                    "creater": {
                        "uid": 1,
                        "userId": "FL-02381",
                        "userName": "王宁",
                        "currentName": "王宁",
                        "phone": "136xxxx1453",
                        ...
                    },
                    "designer": {
                        "uid": 2,
                        "userId": "FL-00186",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "phone": "138xxxx1828",
                        ...
                    },
                    "salesman": {
                        "uid": 3,
                        "userId": "FL-00638",
                        "userName": "李宁",
                        "currentName": "李宁",
                        "phone": "156xxxx9283",
                        ...
                    },
                    "quoter": null,
                    "escorter": null,
                    "supervisor": null,
                    "contracter": null,

                    "designDepartment": "设计中心一部",
                    "designRegion": "设计一分区",
                    "businessDepartment": "市场营销一部",
                    ...
                },
                "type": 0,
                "status": 1,
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "createrName": "白雪",
                "createTime": "2016-01-01 00:00:00",
                "collecter": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "collectTime": "2016-01-01 00:00:00",
                "confirmer": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "confirmTime": "2016-01-01 00:00:00",
                "serviceMoney": 500,
                "advanceMoney": 500,

                "cash": 500,
                "cashInfo": "157",
                "bank": 0,
                "bankInfo": "",
                "checkv": 0,
                "checkvBank": "",
                "installment": 0,
                "installmentBank": "",
                "accounts": 0,
                "accountsBank": "",
                "comment": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryServicePaymentByOrderId

通过装修单号获取服务款项

**Requests:**

- `servicePayment.decoration.orderId` (String): 装修单号

```json
{
    "servicePayment.decoration.orderId": 1
}
```

**Returns:**

- `servicePayments` (List): 服务款信息列表 , 每条数据类型 `servicePayment`

```json
{
    ...
    "servicePayments": [
        {
            "spid": 1,
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
                    },
                    "creater": {
                        "uid": 1,
                        "userId": "FL-02381",
                        "userName": "王宁",
                        "currentName": "王宁",
                        "phone": "136xxxx1453",
                        ...
                    },
                    "designer": {
                        "uid": 2,
                        "userId": "FL-00186",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "phone": "138xxxx1828",
                        ...
                    },
                    "salesman": {
                        "uid": 3,
                        "userId": "FL-00638",
                        "userName": "李宁",
                        "currentName": "李宁",
                        "phone": "156xxxx9283",
                        ...
                    },
                    "quoter": null,
                    "escorter": null,
                    "supervisor": null,
                    "contracter": null,

                    "designDepartment": "设计中心一部",
                    "designRegion": "设计一分区",
                    "businessDepartment": "市场营销一部",
                    ...
                },
                "type": 0,
                "status": 1,
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "createrName": "白雪",
                "createTime": "2016-01-01 00:00:00",
                "collecter": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "collectTime": "2016-01-01 00:00:00",
                "confirmer": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "confirmTime": "2016-01-01 00:00:00",
                "serviceMoney": 500,
                "advanceMoney": 500,
                "cash": 500,
                "cashInfo": "157",
                "bank": 0,
                "bankInfo": "",
                "checkv": 0,
                "checkvBank": "",
                "installment": 0,
                "installmentBank": "",
                "accounts": 0,
                "accountsBank": "",
                "comment": ""
        }
    ],
    ...
}
```


##### `查询` queryServicePaymentForNotInitBySrId

通过服务款收据ID获取非初始状态的服务款项

**Requests:**

- `serviceReceipt.srid` (Long): 收据ID

```json
{
    "serviceReceipt.srid": 1
}
```

**Returns:**

- `servicePayments` (List): 服务款信息列表 , 每条数据类型 `servicePayment`

```json
{
    ...
    "servicePayments": [
        {
            "spid": 1,
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
                },
                "creater": {
                    "uid": 1,
                    "userId": "FL-02381",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "designer": {
                    "uid": 2,
                    "userId": "FL-00186",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "salesman": {
                    "uid": 3,
                    "userId": "FL-00638",
                    "userName": "李宁",
                    "currentName": "李宁",
                    "phone": "156xxxx9283",
                    ...
                },
                "quoter": null,
                "escorter": null,
                "supervisor": null,
                "contracter": null,

                "designDepartment": "设计中心一部",
                "designRegion": "设计一分区",
                "businessDepartment": "市场营销一部",
                ...
            },
            "type": 0,
            "status": 1,
            "creater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "createrName": "白雪",
            "createTime": "2016-01-01 00:00:00",
            "collecter": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "collectTime": "2016-01-01 00:00:00",
            "confirmer": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "confirmTime": "2016-01-01 00:00:00",
            "serviceMoney": 500,
            "advanceMoney": 500,
            "cash": 500,
            "cashInfo": "157",
            "bank": 0,
            "bankInfo": "",
            "checkv": 0,
            "checkvBank": "",
            "installment": 0,
            "installmentBank": "",
            "accounts": 0,
            "accountsBank": "",
            "comment": ""
        }
    ],
    ...
}
```


##### `查询` queryServiceReceiptBySrId

**Requests:**

- `serviceReceipt.srid` (Long): 收据ID

```json
{
    "serviceReceipt.srid": 1
}
```

**Returns:**

- `servicePayment` (Object): 服务款信息 ,数据类型 `servicePayment`

```json
{
    ...
    "servicePayment": {
        "srid": 1,
        "collecter": {
            "uid": 1,
            "userId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师"
        },
        "collecterName": "白雪",
        "collectTime": "2016-01-01 00:00:00",
        "confirmer": {
            "uid": 1,
            "userId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师"
        },
        "confirmerName": "白雪",
        "confirmTime": "2016-01-01 00:00:00",
        "cash": 500,
        "cashInfo": "157",
        "bank": 0,
        "bankInfo": "",
        "checkv": 0,
        "checkvBank": "",
        "installment": 0,
        "installmentBank": "",
        "accounts": 0,
        "accountsBank": "",
        "comment": ""
    }
    ...
}
```


##### `查询` makeServicePayment

生成服务款

判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断装修单对应的半价信息是否存在 , 不存在 , 错误信息 **260021 半价信息不存在**

判断服务款剩余金额 , 如果大于交款金额 , 错误信息 **150025 款项金额不正确**

**Requests:**

- `servicePayment.decoration.orderId` (String): 装修单号
- `servicePayment.referMoney` (Long): 收款金额

```json
{
    "servicePayment.decoration.orderId": "1601010001",
    "servicePayment.referMoney": 10000
}
```


##### `查询` collectServicePayment

服务款项收款 , 正常收款 , 需要拆分金额为预付款和服务款两个部分

判断装修单对应的半价信息是否存在 , 不存在 , 错误信息 **260021 半价信息不存在**

服务费收款款项拆分两部分 , 一是预付款 , 二是服务费 .

拆分计算方式为 , 收款金额 / 1.1 = 主材预付款金额 , 收款金额 - 主材预付款金额 = 服务费

拆分之后的服务费需要与装修单半价信息中服务费和实收服务费 , 如果拆分后服务费大于服务费与实收服务费差值 , 那么多余部分交款服务费转入主材预付款 .

生成服务款款项以及收据信息 , 服务款状态为1(已付款) , 补全相关收据信息

生成预付款款项以及收据信息 , 预付款状态为1(已付款) , 补全相关收据信息 , 收据使用转款字段存储

更新装修单半价中的服务费以及主材额

服务款公司信息根据收款人操作公司进行更新

**Requests:**

- `servicePayment.decoration.orderId` (String): 装修单号
- `servicePayment.referMoney` (Long): 收款金额
- `servicePayment.realMoney` (Long): 实收金额
- `servicePayment.cash` (Long): 现金
- `servicePayment.cashInfo` (String): 现金信息
- `servicePayment.bank` (Long): 刷卡
- `servicePayment.bankInfo` (String): 刷卡信息
- `servicePayment.checkv` (Long): 转账
- `servicePayment.checkvBank` (String): 转账银行
- `servicePayment.installment` (Long): 分期
- `servicePayment.installmentBank` (String): 分期银行
- `servicePayment.accounts` (Long): 对公
- `servicePayment.accountsBank` (String): 对公银行
- `servicePayment.comment` (String): 说明

```json
{
    "servicePayment.decoration.orderId": "1601010001",
    "servicePayment.referMoney": 10000,
    "servicePayment.realMoney": 10000,
    "servicePayment.cash": 10000,
    "servicePayment.cashInfo": "175",
    "servicePayment.bank": 10000,
    "servicePayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
    "servicePayment.checkv": 10000,
    "servicePayment.checkvBank": "189",
    "servicePayment.installment": 10000
    "servicePayment.installmentBank": "201",
    "servicePayment.accounts": 10000,
    "servicePayment.accountsBank": "201",
    "servicePayment.coupon": 0,
    "servicePayment.couponInfo": "",
    "servicePayment.comment": "说明",
}
```


##### `查询` collectServicePaymentForService

服务款项收款 , 主要针对服务费收款

判断装修单对应的半价信息是否存在 , 不存在 , 错误信息 **260021 半价信息不存在**

收款金额作为服务费金额 , 不转入预付款 , 收款金额可以小于等于当前服务费剩余金额

生成服务款款项以及收据信息

更新装修单半价中的服务费信息

服务款公司信息根据收款人操作公司进行更新

**Requests:**

- `servicePayment.decoration.orderId` (String): 装修单号
- `servicePayment.realMoney` (Long): 实收金额
- `servicePayment.cash` (Long): 现金
- `servicePayment.cashInfo` (String): 现金信息
- `servicePayment.bank` (Long): 刷卡
- `servicePayment.bankInfo` (String): 刷卡信息
- `servicePayment.checkv` (Long): 转账
- `servicePayment.checkvBank` (String): 转账银行
- `servicePayment.installment` (Long): 分期
- `servicePayment.installmentBank` (String): 分期银行
- `servicePayment.accounts` (Long): 对公
- `servicePayment.accountsBank` (String): 对公银行
- `servicePayment.comment` (String): 说明

```json
{
    "servicePayment.decoration.orderId": "1601010001",
    "servicePayment.realMoney": 10000,
    "servicePayment.cash": 10000,
    "servicePayment.cashInfo": "175",
    "servicePayment.bank": 10000,
    "servicePayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
    "servicePayment.checkv": 10000,
    "servicePayment.checkvBank": "189",
    "servicePayment.installment": 10000
    "servicePayment.installmentBank": "201",
    "servicePayment.accounts": 10000,
    "servicePayment.accountsBank": "201",
    "servicePayment.coupon": 0,
    "servicePayment.couponInfo": "",
    "servicePayment.comment": "说明",
}
```


##### `查询` refundServicePaymentForService

服务费退款 , 根据装修单半价信息中实收服务费金额进行退款

判断装修单对应的半价信息是否存在 , 不存在 , 错误信息 **260021 半价信息不存在**

生成服务款款项以及收据信息

更新装修单半价中的服务费信息

服务款公司信息根据收款人操作公司进行更新

**Requests:**

- `servicePayment.decoration.orderId` (String): 装修单号
- `servicePayment.cash` (Long): 现金
- `servicePayment.cashInfo` (String): 现金信息
- `servicePayment.bank` (Long): 刷卡
- `servicePayment.bankInfo` (String): 刷卡信息
- `servicePayment.checkv` (Long): 转账
- `servicePayment.checkvBank` (String): 转账银行
- `servicePayment.installment` (Long): 分期
- `servicePayment.installmentBank` (String): 分期银行
- `servicePayment.accounts` (Long): 对公
- `servicePayment.accountsBank` (String): 对公银行
- `servicePayment.comment` (String): 说明

```json
{
    "servicePayment.decoration.orderId": "1601010001",
    "servicePayment.cash": 10000,
    "servicePayment.cashInfo": "175",
    "servicePayment.bank": 10000,
    "servicePayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
    "servicePayment.checkv": 10000,
    "servicePayment.checkvBank": "189",
    "servicePayment.installment": 10000
    "servicePayment.installmentBank": "201",
    "servicePayment.accounts": 10000,
    "servicePayment.accountsBank": "201",
    "servicePayment.coupon": 0,
    "servicePayment.couponInfo": "",
    "servicePayment.comment": "说明",
}
```


##### `查询` confirmServicePayment

服务款项确认

已经确认的服务款项忽略处理

更新款项状态为2(已确认)

关联更新预付款状态为2(已确认)

**Requests:**


```json
{
    "spids[0]": 1
}
```


##### `查询` updateServicePayment

更新服务款收款方式

判断款项是否存在 , 不存在 , 错误信息 **150003 款项不存在**

款项状态1(已付款) , 其他状态不可更新 , 错误信息 **150036 款项状态不可操作**

款项修改之后金额与应收额不等 , 不可更新 , 错误信息 **150025 款项金额不正确**

**Requests:**

- `servicePayment.spid` (Long): 款项ID
- `servicePayment.cash` (Long): 现金
- `servicePayment.cashInfo` (String): 现金信息
- `servicePayment.bank` (Long): 刷卡
- `servicePayment.bankInfo` (String): 刷卡信息
- `servicePayment.checkv` (Long): 转账
- `servicePayment.checkvBank` (String): 转账银行
- `servicePayment.comment` (String): 说明

```json
{
    "servicePayment.spid": 1,
    "servicePayment.cash": 10000,
    "servicePayment.cashInfo": "175",
    "servicePayment.bank": 10000,
    "servicePayment.bankInfo": "#187|10|2016-03-23 14:25:15#",
    "servicePayment.checkv": 10000,
    "servicePayment.checkvBank": "#187|10|2016-03-23 14:25:15#",
    "servicePayment.comment": "说明",
}
```

## 销售款


销售款信息管理以及相关业务功能


> **类**: `api.payment.SalesPaymentAction`


#### 数据类型: `salesPayment`

| 参数 | 说明 | 类型 |
|------|------|------|
| `spid` | 款项ID | Long |
| `orderId` | 装修单号 | String |
| `sales` | 销售单 , 类型 [sales ](./inventory.html#api.material.SalesAction.sales) | Object |
| `type` | 款项类型, 1: 预付款(过时), 2:定金, 3: 补款, 4:退款, 5: 补款退款, 6: 券退款, 7: 定金退款 , 8: 不退定金 | Short |
| `status` | 状态, 0: 初始, 1: 已收款, 2: 已确认 | Short |
| `category` | 品类 | String |
| `brand` | 品牌 | String |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `collecter` | 收款人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `collectTime` | 收款时间 | Timestamp |
| `confirmer` | 确认人, 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `confirmTime` | 确认时间 | Timestamp |
| `referMoney` | 应收金额 | Long |
| `realMoney` | 实收金额 | Long |
| `cash` | 现金 | Long |
| `cashInfo` | 现金信息 | String |
| `bank` | 刷卡 | Long |
| `bankInfo` | 刷卡信息 , **#** 分隔多条刷卡信息, **|** 分隔信息中不同字段 , 由 **类型|金额|时间** 组成 , 例如: **#187|15000|2016-03-23 14:25:15#** | String |
| `checkv` | 转账 | Long |
| `checkvBank` | 转账银行 | String |
| `installment` | 分期 | Long |
| `installmentBank` | 分期银行 | String |
| `accounts` | 对公 | Long |
| `accountsBank` | 对公银行 | String |
| `coupon` | 券值 | Long |
| `couponInfo` | 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#** | String |
| `advance` | 预付款 | Long |
| `advanceType` | 预付款类型 , 1: 合同预付款 , 2: 工程预付款 | Short |
| `company` | 公司ID | Integer |
| `comment` | 说明 | String |


#### 数据类型: `salesReceipt`

| 参数 | 说明 | 类型 |
|------|------|------|
| `srid` | 收据ID | Long |
| `collecter` | 收款人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `collectTime` | 收款时间 | Timestamp |
| `confirmer` | 收款人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `confirmTime` | 确认时间 | Timestamp |
| `realMoney` | 实收金额 | Long |
| `cash` | 现金 | Long |
| `cashInfo` | 现金信息 | String |
| `bank` | 刷卡 | Long |
| `bankInfo` | 刷卡信息 , **#** 分隔多条刷卡信息, **|** 分隔信息中不同字段 , 由 **类型|金额|时间** 组成 , 例如: **#187|15000|2016-03-23 14:25:15#** | String |
| `checkv` | 转账 | Long |
| `checkvBank` | 转账银行 | String |
| `installment` | 分期 | Long |
| `installmentBank` | 分期银行 | String |
| `accounts` | 对公 | Long |
| `accountsBank` | 对公银行 | String |
| `coupon` | 券值 | Long |
| `couponInfo` | 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#** | String |
| `advance` | 预付款 | Long |
| `advanceType` | 预付款类型 , 1: 合同预付款 , 2: 工程预付款 | Short |
| `comment` | 说明 | String |


##### `查询` pageSalesPayment

分页方式获取销售收款信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Requests:**

- `salesPayment.status` (Short): 状态
- `salesPayment.type` (Short): 类型

```json
{
    "salesPayment.status": 1,
    "salesPayment.type": 1
}
```

**Requests:**

- `companyType` (String): 公司类型 , 包括 company , dompany , pompany

```json
{
    "companyType": "company"
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 销售收款信息列表 , 每条数据类型 `salesPayment`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "spid": 1,
                "orderId": "1601010001",
                "sales": {
                    "sid": 1,
                    "no": "1601010001",
                    "orderId": "1601010001",
                    "house":{
                        "hid": 1,
                        "village": {
                            "vid": 1,
                            "no": "P001",
                            "name": "广场一期"
                        },
                        "houseNumber": "1#1-1-1",
                        ...
                    },
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
                    "guider": {
                        "uid": 2,
                        "userId": "U0012",
                        "userName": "导购",
                        "currentName": "导购",
                        "duty": "主材导购"
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
                        "name": "主材一部",
                        "type": "主材部",
                    },
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "comment": "",
                    "createTime": "2016-01-01 00:00:00",
                    "fullpayTime": "2016-01-01 00:00:00",
                    "balanceTime": "2016-01-01 00:00:00",
                    "status": 0,
                    "paymentStatus": 0
                    "balanceStatus": 0,
                    "total": 100000,
                    "maling": 0,
                    "venderMaling": 0,
                    "coupon": 0,
                    "couponInfo": ""
                }
                "type": 1,
                "status": 0,
                "category": "洁具",
                "brand": "箭牌卫浴",
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "createTime": "2016-01-01 00:00:00",
                "collecter": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "collectTime": "2016-01-01 00:00:00",
                "confirmer": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "confirmTime": "2016-01-01 00:00:00",
                "referMoney": 500,
                "realMoney": 500,
                "cash": 500,
                "cashInfo": "157",
                "bank": 0,
                "bankInfo": "",
                "checkv": 0,
                "checkvBank": "",
                "installment": 0,
                "installmentBank": "",
                "accounts": 0,
                "accountsBank": "",
                "coupon": 0,
                "couponInfo": "",
                "advance": 0,
                "advanceType": 0,
                "comment": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` querySalesPaymentByOrderId

通过装修单号获取销售单所属的销售款信息

**Requests:**

- `sales.orderId` (String): 装修单号

```json
{
    "sales.orderId": "1601010001"
}
```

**Returns:**

- `salesPayments` (List): 销售收款信息列表 , 每条数据类型 `salesPayment`

```json
{
    ...
    "salesPayments": [
        {
            "spid": 1,
            "orderId": "1601010001",
            "sales": {
                "sid": 1,
                "no": "1601010001",
                "orderId": "1601010001",
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期"
                    },
                    "houseNumber": "1#1-1-1",
                    ...
                },
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
                "guider": {
                    "uid": 2,
                    "userId": "U0012",
                    "userName": "导购",
                    "currentName": "导购",
                    "duty": "主材导购"
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
                    "name": "主材一部",
                    "type": "主材部",
                },
                "category": "瓷砖",
                "brand": "瓷砖",
                "comment": "",
                "createTime": "2016-01-01 00:00:00",
                "fullpayTime": "2016-01-01 00:00:00",
                "balanceTime": "2016-01-01 00:00:00",
                "status": 0,
                "paymentStatus": 0
                "balanceStatus": 0,
                "total": 100000,
                "maling": 0,
                "venderMaling": 0,
                "coupon": 0,
                "couponInfo": ""
            }
            "type": 1,
            "status": 0,
            "category": "洁具",
            "brand": "箭牌卫浴",
            "creater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "createTime": "2016-01-01 00:00:00",
            "collecter": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "collectTime": "2016-01-01 00:00:00",
            "confirmer": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "confirmTime": "2016-01-01 00:00:00",
            "referMoney": 500,
            "realMoney": 500,
            "cash": 500,
            "cashInfo": "157",
            "bank": 0,
            "bankInfo": "",
            "checkv": 0,
            "checkvBank": "",
            "installment": 0,
            "installmentBank": "",
            "accounts": 0,
            "accountsBank": "",
            "coupon": 0,
            "couponInfo": "",
            "advance": 0,
            "advanceType": 0,
            "comment": ""
        }
    ],
    ...
}
```


##### `查询` querySalesPaymentBySid

通过销售单ID，查询销售单对应的款项信息

**Requests:**

- `salesPayment.sales.sid` (Long): 销售单ID

```json
{
    "salesPayment.sales.sid": 1
}
```

**Returns:**

Parameters:	salesPayments (List) – 销售款信息列表 , 每条数据类型 salesPayment


```json
{
    ...
    "salesPayments": [
        {
            "spid": 1,
            "orderId": "1601010001",
            "sales": {
                "sid": 1,
                "no": "1601010001",
                "orderId": "1601010001",
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期"
                    },
                    "houseNumber": "1#1-1-1",
                    ...
                },
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
                "guider": {
                    "uid": 2,
                    "userId": "U0012",
                    "userName": "导购",
                    "currentName": "导购",
                    "duty": "主材导购"
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
                    "name": "主材一部",
                    "type": "主材部",
                },
                "category": "瓷砖",
                "brand": "瓷砖",
                "comment": "",
                "createTime": "2016-01-01 00:00:00",
                "fullpayTime": "2016-01-01 00:00:00",
                "balanceTime": "2016-01-01 00:00:00",
                "status": 0,
                "paymentStatus": 0
                "balanceStatus": 0,
                "total": 100000,
                "maling": 0,
                "venderMaling": 0,
                "coupon": 0,
                "couponInfo": ""
            }
            "type": 1,
            "status": 0,
            "category": "洁具",
            "brand": "箭牌卫浴",
            "creater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "createTime": "2016-01-01 00:00:00",
            "collectTime": "2016-01-01 00:00:00",
            "confirmTime": "2016-01-01 00:00:00",
            "referMoney": 500,
            "realMoney": 500,
            "cash": 500,
            "cashInfo": "157",
            "bank": 0,
            "bankInfo": "",
            "checkv": 0,
            "checkvBank": "",
            "installment": 0,
            "installmentBank": "",
            "accounts": 0,
            "accountsBank": "",
            "coupon": 0,
            "couponInfo": "",
            "advance": 0,
            "advanceType": 0,
            "comment": "
        }
    ],
    ...
}
```


##### `查询` querySalesPaymentForNotInitBySrid

通过收据ID获取销售款信息 , 状态为非初始

**Requests:**

- `salesReceipt.srid` (Long): 收据ID

```json
{
    "salesReceipt.srid": 1
}
```

**Returns:**

- `salesPayments` (List): 销售收款信息列表 , 每条数据类型 `salesPayment`

```json
{
    ...
    "salesPayments": [
        {
            "spid": 1,
            "orderId": "1601010001",
            "sales": {
                "sid": 1,
                "no": "1601010001",
                "orderId": "1601010001",
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期"
                    },
                    "houseNumber": "1#1-1-1",
                    ...
                },
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
                "guider": {
                    "uid": 2,
                    "userId": "U0012",
                    "userName": "导购",
                    "currentName": "导购",
                    "duty": "主材导购"
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
                    "name": "主材一部",
                    "type": "主材部",
                },
                "category": "瓷砖",
                "brand": "瓷砖",
                "comment": "",
                "createTime": "2016-01-01 00:00:00",
                "fullpayTime": "2016-01-01 00:00:00",
                "balanceTime": "2016-01-01 00:00:00",
                "status": 0,
                "paymentStatus": 0
                "balanceStatus": 0,
                "total": 100000,
                "maling": 0,
                "venderMaling": 0,
                "coupon": 0,
                "couponInfo": ""
            }
            "type": 1,
            "status": 0,
            "category": "洁具",
            "brand": "箭牌卫浴",
            "creater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "createTime": "2016-01-01 00:00:00",
            "collecter": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "collectTime": "2016-01-01 00:00:00",
            "confirmer": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "confirmTime": "2016-01-01 00:00:00",
            "referMoney": 500,
            "realMoney": 500,
            "cash": 500,
            "cashInfo": "157",
            "bank": 0,
            "bankInfo": "",
            "checkv": 0,
            "checkvBank": "",
            "installment": 0,
            "installmentBank": "",
            "accounts": 0,
            "accountsBank": "",
            "coupon": 0,
            "couponInfo": "",
            "advance": 0,
            "advanceType": 0,
            "comment": ""
        }
    ],
    ...
}
```


##### `查询/创建` querySalesPaymentBySpid

**Requests:**

- `salesPayment.spid` (Long): 销售款ID

```json
{
    "salesPayment.srid": 1
}
```

**Returns:**

- `salesPayment` (Object): 销售收款信息 , 类型 `salesPayment`

```json
{
    ...
    "salesPayment": {
        "spid": 1,
        "orderId": "1601010001",
        "sales": {
            "sid": 1,
            "no": "1601010001",
            "orderId": "1601010001",
            "house":{
                "hid": 1,
                "village": {
                    "vid": 1,
                    "no": "P001",
                    "name": "广场一期"
                },
                "houseNumber": "1#1-1-1",
                ...
            },
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
            "guider": {
                "uid": 2,
                "userId": "U0012",
                "userName": "导购",
                "currentName": "导购",
                "duty": "主材导购"
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
                "name": "主材一部",
                "type": "主材部",
            },
            "category": "瓷砖",
            "brand": "瓷砖",
            "comment": "",
            "createTime": "2016-01-01 00:00:00",
            "fullpayTime": "2016-01-01 00:00:00",
            "balanceTime": "2016-01-01 00:00:00",
            "status": 0,
            "paymentStatus": 0
            "balanceStatus": 0,
            "total": 100000,
            "maling": 0,
            "venderMaling": 0,
            "coupon": 0,
            "couponInfo": ""
        }
        "type": 1,
        "status": 0,
        "category": "洁具",
        "brand": "箭牌卫浴",
        "creater": {
            "uid": 1,
            "userId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师"
        },
        "createTime": "2016-01-01 00:00:00",
        "collecter": {
            "uid": 1,
            "userId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师"
        },
        "collectTime": "2016-01-01 00:00:00",
        "confirmer": {
            "uid": 1,
            "userId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师"
        },
        "confirmTime": "2016-01-01 00:00:00",
        "referMoney": 500,
        "realMoney": 500,
        "cash": 500,
        "cashInfo": "157",
        "bank": 0,
        "bankInfo": "",
        "checkv": 0,
        "checkvBank": "",
        "installment": 0,
        "installmentBank": "",
        "accounts": 0,
        "accountsBank": "",
        "coupon": 0,
        "couponInfo": "",
        "advance": 0,
        "advanceType": 0,
        "comment": ""
    },
    ...
}
```


##### `查询` querySalesReceiptBySrId

通过收据ID获取销售收据信息

**Requests:**

- `salesReceipt.srid` (Long): 收据ID

```json
{
    "salesReceipt.srid": 1
}
```

**Returns:**

- `salesReceipt` (Object): 销售收据信息 , 类型 `salesReceipt`

```json
{
    ...
    "materialReceipt": {
        "srid": 1,
        "collecter": {
            "uid": 1,
            "userId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师"
        },
        "collectTime": "2016-01-01 00:00:00",
        "confirmer": {
            "uid": 1,
            "userId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师"
        },
        "confirmTime": "2016-01-01 00:00:00",
        "referMoney": 500,
        "realMoney": 500,
        "cash": 500,
        "cashInfo": "157",
        "bank": 0,
        "bankInfo": "",
        "checkv": 0,
        "checkvBank": "",
        "installment": 0,
        "installmentBank": "",
        "accounts": 0,
        "accountsBank": "",
        "coupon": 0,
        "couponInfo": "",
        "advance": 0,
        "advanceType": 0,
        "comment": ""
    }
    ...
}
```


##### `查询` amountSalesPayment

获取装修单归属的销售款总额

**Requests:**

- `salesPayment.sales.orderId` (String): 装修单号
- `salesPayment.sales.sid` (Long): 销售单ID

```json
{
    "salesPayment.sales.orderId": "1601010001",
    "salesPayment.sales.sid": 1
}
```

**Returns:**

- `amount` (Long): 销售款总额

```json
{
    ...
    "amount": 1000000,
    ...
}
```


##### `查询` sendSalesPayment

推送销售款

验证销售款信息是否存在 , 不存在 , 错误信息 **150003 款项不存在**

**Requests:**

- `salesPayment.spid` (Long): 销售款ID

```json
{
    "salesPayment.spid": 1
}
```


##### `查询` addSalesPaymentForDeposit

添加定金销售款 , 支持不退类型

判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

应收款金额大于零 , 小于零 , 错误信息 **150025 款项金额不正确**

不可存在销售单对应的其他款项 , 如果存在 , 错误信息 **150029 款项不可提交**

判断提交销售款类型是否已经存在 , 已存在 , 错误信息 **150029 款项不可提交**

销售单更新定金额为提交项金额 , 定金状态为0(未付款)

**Requests:**

- `salesPayment.sales.sid` (Long): 销售单ID
- `salesPayment.sales.ctype` (Short): 结算类型
- `salesPayment.sales.cvalue` (Long): 结算值
- `salesPayment.type` (Short): 类型 , 支持1(定金)和8(不退定金)
- `salesPayment.referMoney` (Long): 应收金额

```json
{
    "salesPayment.sales.sid": 1,
    "salesPayment.sales.ctype": 1,
    "salesPayment.sales.cvalue": 1000,
    "salesPayment.type": 1,
    "salesPayment.referMoney": 1000
}
```


##### `查询` addSalesPaymentForFullpay

添加补款销售款

获取销售款类型为3(补款)的款项 , 如果存在 , 错误信息 **150040 补款已存在**

定金销售款存在 , 判断款项状态是否为1(已收款)或2(已确认) , 状态为0(初始) , 错误信息 **150041 定金状态不可操作**

判断销售项数量是否为0 , 如果不存在项目 , 错误信息 **260060 销售项数量不足**

判断销售项总额与定金+补款总额是否一致 , 不一致 , 错误信息 **150017 项目总额与款项额不符**

生成款项金额为正数 , 款项类型为3(补款) , 生成金额为负数 , 款项类型为5(补款退款)

款项类型为5(补款退款) , 判断销售单款项积分以及领取活动物品积分 , 款项积分不足 , 错误信息 **160037 积分不足**

销售单更新补款额为提交款项金额 , 补款状态为0(未付款)

生成补款退款类型款项信息 , 其作用等同于补款

**Requests:**

- `salesPayment.sid` (Long): 销售单ID
- `salesPayment.referMoney` (Long): 应收金额

```json
{
    "salesPayment.sid": 1,
    "salesPayment.referMoney": 1000
}
```


##### `查询` cancelSalesPayment

销售款撤销

款项状态为初始才能够完成撤销 , 其他状态撤销失败 , 错误信息 **150019 款项不能撤销**

根据款项类型更新销售单中款项状态 , 定金(2)更新定金金额为0 , 状态为无款项(-1) ; 补款(3)/补款退款(5)更新补款金额为0 , 状态为无款项(-1)

**Requests:**

- `salesPayment.spid` (Long): 款项ID

```json
{
    "salesPayment.spid": 1
}
```


##### `查询` cancelSalesPaymentForDeposit

撤销定金销售款

获取销售款类型为3(补款)的款项 , 如果存在 , 错误信息 **150040 补款已存在**

获取销售款类型为2(定金)的款项 , 如果不存在 , 错误信息 **150037 定金不存在**

判断定金销售款状态是否为0(初始) , 其他状态 , 错误信息 **150036 款项状态不可操作**

删除定金销售款信息

更新销售单中定金额为0 , 定金状态为-1(初始)

**Requests:**

- `salesPayment.sid` (Long): 销售单ID

```json
{
    "salesPayment.sid": 1
}
```


##### `查询` cancelSalesPaymentForFullpay

撤销补款销售款

获取销售款类型为3(补款)的款项 , 如果不存在 , 错误信息 **150038 补款不存在**

判断补款销售款状态是否为0(初始) , 其他状态 , 错误信息 **150036 款项状态不可操作**

删除补款销售款信息

更新销售单中补款额为0, 补款状态为-1(初始)

**Requests:**

- `salesPayment.sid` (Long): 销售单ID

```json
{
    "salesPayment.sid": 1
}
```


##### `查询` collectSalesPayment

销售款收款

判断销售款是否存在 , 不存在 , 错误信息 **150003 款项不存在**

判断销售款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**

判断券值与券信息中各项券值之和是否相等 , 不相等收款失败 , **150024 券总金额与券统计金额不等**

判断应收金额与各类型收款方式金额之和是否相等 , 不相等收款失败 , **150025 款项金额不正确**

收款方式包括预付款 , 判断操作金额是否满足预付款余额 , 余额不足 , 错误信息 **150010 预付款余额不足**

销售款公司信息根据收款人操作公司进行更新

更新销售单对应收款类型的状态信息 , 定金/补款状态为1(已付款)

款项类型为补款(3) , 更新销售单中补款时间

更新归属装修单中的销售比例 , 包括预付款(主材)/销售款

**Requests:**

- `salesPayment.spid` (Long): 款项ID
- `salesPayment.realMoney` (Long): 实收金额
- `salesPayment.cash` (Long): 现金
- `salesPayment.cashInfo` (String): 现金信息
- `salesPayment.bank` (Long): 刷卡
- `salesPayment.bankInfo` (String): 刷卡信息
- `salesPayment.checkv` (Long): 转账
- `salesPayment.checkvBank` (String): 转账银行
- `salesPayment.installment` (Long): 分期
- `salesPayment.installmentBank` (String): 分期银行
- `salesPayment.accounts` (Long): 对公
- `salesPayment.accountsBank` (String): 对公银行
- `salesPayment.coupon` (Long): 券值
- `salesPayment.couponInfo` (String): 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
- `salesPayment.advance` (Long): 预付款
- `salesPayment.advanceType` (Short): 预付款类型 , 1: 合同预付款 , 2: 工程预付款
- `salesPayment.comment` (String): 说明

```json
{
    "salesPayment.spid": 1,
    "salesPayment.realMoney": 10000,
    "salesPayment.cash": 10000,
    "salesPayment.cashInfo": "175",
    "salesPayment.bank": 10000,
    "salesPayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
    "salesPayment.checkv": 10000,
    "salesPayment.checkvBank": "189",
    "salesPayment.installment": 10000
    "salesPayment.installmentBank": "201",
    "salesPayment.accounts": 10000,
    "salesPayment.accountsBank": "201",
    "salesPayment.coupon": 0,
    "salesPayment.couponInfo": "",
    "salesPayment.advance": 0,
    "salesPayment.advanceType": 0,
    "salesPayment.comment": "说明",
}
```


##### `查询` collectSalesPayments

销售款批量收款

判断销售款是否存在 , 不存在 , 错误信息 **150003 款项不存在**

判断销售款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**

判断应收金额与各类型收款方式金额之和是否相等 , 不相等收款失败 , **150025 款项金额不正确**

收款方式包括预付款 , 判断操作金额是否满足预付款余额 , 余额不足 , 错误信息 **150010 预付款余额不足**

销售款公司信息根据收款人操作公司进行更新

更新销售单对应收款类型的状态信息 , 定金/补款状态为1(已付款)

款项类型为补款(3) , 更新销售单中补款时间

更新归属装修单中的销售比例 , 包括预付款(主材)/销售款

**Requests:**

- `sales.sid` (String): 销售单ID
- `salesReceipt.realMoney` (Long): 实收金额
- `salesReceipt.cash` (Long): 现金
- `salesReceipt.cashInfo` (String): 现金信息
- `salesReceipt.bank` (Long): 刷卡
- `salesReceipt.bankInfo` (String): 刷卡信息
- `salesReceipt.checkv` (Long): 转账
- `salesReceipt.checkvBank` (String): 转账银行
- `salesReceipt.installment` (Long): 分期
- `salesReceipt.installmentBank` (String): 分期银行
- `salesReceipt.accounts` (Long): 对公
- `salesReceipt.accountsBank` (String): 对公银行
- `salesReceipt.coupon` (Long): 券值
- `salesReceipt.couponInfo` (String): 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
- `salesReceipt.advance` (Long): 预付款
- `salesReceipt.advanceType` (Short): 预付款类型 , 1: 合同预付款 , 2: 工程预付款
- `salesReceipt.comment` (String): 说明

```json
{
    "sales.sid": 1,
    "salesPayment[0].spid": 1,
    "salesReceipt.realMoney": 10000,
    "salesReceipt.cash": 10000,
    "salesReceipt.cashInfo": "175",
    "salesReceipt.bank": 10000,
    "salesReceipt.bankInfo": "#187|15000|2016-03-23 14:25:15#",
    "salesReceipt.checkv": 10000,
    "salesReceipt.checkvBank": "189",
    "salesReceipt.installment": 10000
    "salesReceipt.installmentBank": "201",
    "salesReceipt.accounts": 10000,
    "salesReceipt.accountsBank": "201",
    "salesReceipt.coupon": 0,
    "salesReceipt.couponInfo": "",
    "salesReceipt.advance": 0,
    "salesReceipt.advanceType": 0,
    "salesReceipt.comment": "说明"
}
```


##### `查询` refundSalesPayment

销售退款

判断销售款是否存在 , 不存在 , 错误信息 **150003 款项不存在**

判断销售款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**

如果销售款类型为7(定金退款) , 更新主材单中定金额为0 , 定金状态为0(初始)

如果主材款类型为5(补款退款) , 更新主材单中补款状态为1(已付款) , 补款时间为操作时间

如果主材款类型为4(退款) , 更新退货单状态为1(已付款)

销售款公司信息根据收款人操作公司进行更新

更新款项状态以及生成对应收据相关信息

**Requests:**

- `salesPayment.spid` (Long): 款项ID
- `salesPayment.cash` (Long): 现金
- `salesPayment.cashInfo` (String): 现金信息
- `salesPayment.bank` (Long): 刷卡
- `salesPayment.bankInfo` (String): 刷卡信息
- `salesPayment.checkv` (Long): 转账
- `salesPayment.checkvBank` (String): 转账银行
- `salesPayment.installment` (Long): 分期
- `salesPayment.installmentBank` (String): 分期银行
- `salesPayment.accounts` (Long): 对公
- `salesPayment.accountsBank` (String): 对公银行
- `salesPayment.coupon` (Long): 券值
- `salesPayment.couponInfo` (String): 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
- `salesPayment.advance` (Long): 预付款
- `salesPayment.comment` (String): 说明

```json
{
    "salesPayment.spid": 1,
    "salesPayment.cash": 10000,
    "salesPayment.cashInfo": "175",
    "salesPayment.bank": 10000,
    "salesPayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
    "salesPayment.checkv": 10000,
    "salesPayment.checkvBank": "189",
    "salesPayment.installment": 10000,
    "salesPayment.installmentBank": "201",
    "salesPayment.accounts": 10000,
    "salesPayment.accountsBank": "201",
    "salesPayment.coupon": 0,
    "salesPayment.couponInfo": "",
    "salesPayment.advance": 0,
    "salesPayment.advanceType": 0,
    "salesPayment.comment": "说明",
}
```


##### `查询` refundSalesPaymentForDeposit

生成销售款中定金退款

获取销售款类型为3(补款)的款项 , 如果存在 , 错误信息 **150040 补款已存在**

获取销售款类型为2(定金)的款项 , 如果不存在 , 错误信息 **150037 定金不存在**

判断定金销售款状态是否为2(已确认) , 其他状态 , 错误信息 **150012 款项不能进行退款**

判断销售单款项积分以及领取活动物品积分 , 款项积分不足 , 错误信息 **160037 积分不足**

销售单更新定金额为0 , 定金状态为-1(初始)

主材单状态更新为4(废单)

**Requests:**

- `salesPayment.sales.sid` (Long): 销售单ID

```json
{
    "salesPayment.sales.sid": 1
}
```


##### `查询` refundSalesPaymentForCoupon

生成销售款中券退款

获取销售款类型为2(定金)的款项 , 如果不存在 , 错误信息 **150037 定金不存在**

判断定金销售款状态是否为1(已收款)或2(已确认) , 状态为0(初始) , 错误信息 **150041 定金状态不可操作**

判断销售单款项积分以及领取活动物品积分 , 款项积分不足 , 错误信息 **160037 积分不足**

生成券退款类型款项信息 , 同时更新销售单中券值和券信息

**Requests:**

- `sales.sid` (Long): 销售单ID
- `sales.coupon` (Long): 券值
- `sales.couponInfo` (String): 券信息

```json
{
    "sales.sid": 1,
    "sales.coupon": 100000,
    "sales.couponInfo": #瓷砖券:100#
}
```


##### `查询` updateSalesPayment

更新销售款收款方式

判断款项是否存在 , 不存在 , 错误信息 **150003 款项不存在**

款项状态1(已付款) , 其他状态不可更新 , 错误信息 **150036 款项状态不可操作**

款项修改之后金额与应收额不等 , 不可更新 , 错误信息 **150025 款项金额不正确**

预付款和优惠券不可修改

**Requests:**

- `salesPayment.spid` (Long): 款项ID
- `salesPayment.cash` (Long): 现金
- `salesPayment.cashInfo` (String): 现金信息
- `salesPayment.bank` (Long): 刷卡
- `salesPayment.bankInfo` (String): 刷卡信息
- `salesPayment.checkv` (Long): 转账
- `salesPayment.checkvBank` (String): 转账银行
- `salesPayment.comment` (String): 说明

```json
{
    "salesPayment.spid": 1,
    "salesPayment.cash": 10000,
    "salesPayment.cashInfo": "175",
    "salesPayment.bank": 10000,
    "salesPayment.bankInfo": "#187|10|2016-03-23 14:25:15#",
    "salesPayment.checkv": 10000,
    "salesPayment.checkvBank": "#187|10|2016-03-23 14:25:15#",
    "salesPayment.comment": "说明",
}
```


##### `查询` confirmSalesPayment

销售款确认

判断款项是否存在 , 不存在 , 错误信息 **150003 款项不存在**

销售款类型为2(定金) , 更新销售单定金状态为2(已确认)

销售款类型为3(补款)/5(补款退款) , 更新销售单单补款状态为2(已确认)

已经确认的销售款忽略处理

**Requests:**


```json
{
    "spids[0]": 1
}
```

## 活动款


> **类**: `api.payment.ActivityPaymentAction`


#### 数据类型: `activityPayment`

| 参数 | 说明 | 类型 |
|------|------|------|
| `apid` | 活动款ID | Long |
| `mno` | 会员号 | String |
| `vaid` | 活动ID | Long |
| `orderId` | 装修单号 | String |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `collecter` | 收款人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `collectTime` | 收款时间 | Timestamp |
| `type` | 类型 , 0: 装修款 , 1: 主材款 | Short |
| `status` | 状态 , 0: 未付款 , 1: 已付款 | Short |
| `category` | 品类 | String |
| `brand` | 品牌 | String |
| `money` | 金额 | Integer |
| `cash` | 现金 | Integer |
| `bank` | 刷卡 | Integer |
| `bankInfo` | 刷卡信息 | String |
| `comment` | 说明 | String |


#### 数据类型: `activityReceipt`

| 参数 | 说明 | 类型 |
|------|------|------|
| `arid` | 活动收据ID | Long |
| `orderId` | 装修单号 | String |
| `collecter` | 收款人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `collectTime` | 收款时间 | Timestamp |
| `cash` | 现金 | Integer |
| `bank` | 刷卡 | Integer |
| `bankInfo` | 刷卡信息 | String |
| `comment` | 说明 | String |


##### `查询` pageActivityPayment

分页方式获取活动款信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 活动款信息列表 , 每条数据类型 `activityPayment`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "apid": 1,
                "mno": "0000000000000000000",
                "vaid": 1,
                "orderId": "1601010001",
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪"
                },
                "collecter": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                },
                "createTime": "2016-01-01 00:00:00",
                "collectTime": "2016-01-01 00:00:00",
                "type": 1,
                "status": 1,
                "category": "品类",
                "brand": "品牌",
                "money": 100000,
                "cash": 100000,
                "bank": 0,
                "bankInfo": "",
                "comment": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryActivityPaymentByArid

通过活动收据ID获取活动款信息

**Requests:**

- `activityPayment.arid` (Long): 活动收据ID

```json
{
    "activityPayment.arid": 1
}
```

**Returns:**

- `activityPayments` (List): 活动款信息列表 , 每条数据类型 `activityPayment`

```json
{
    ...
    "activityPayments": [
        {
            "apid": 1,
            "mno": "0000000000000000000",
            "vaid": 1,
            "orderId": "1601010001",
            "creater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪"
            },
            "collecter": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
            },
            "createTime": "2016-01-01 00:00:00",
            "collectTime": "2016-01-01 00:00:00",
            "type": 1,
            "category": "品类",
            "brand": "品牌",
            "money": 100000,
            "cash": 100000,
            "bank": 0,
            "bankInfo": "",
            "comment": ""
        }
    ],
    ...
}
```


##### `查询/创建` queryActivityPaymentByNo

通过活动票号获取活动款信息

**Requests:**

- `activityPayment.mno` (String): 活动票号

```json
{
    "activityPayment.mno": "000000000000000000"
}
```

**Returns:**

- `activityPayments` (List): 活动款信息列表 , 每条数据类型 `activityPayment`

```json
{
    ...
    "activityPayments": [
        {
            "apid": 1,
            "mno": "0000000000000000000",
            "vaid": 1,
            "orderId": "1601010001",
            "creater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪"
            },
            "collecter": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
            },
            "createTime": "2016-01-01 00:00:00",
            "collectTime": "2016-01-01 00:00:00",
            "type": 1,
            "category": "品类",
            "brand": "品牌",
            "money": 100000,
            "cash": 100000,
            "bank": 0,
            "bankInfo": "",
            "comment": ""
        }
    ],
    ...
}
```


##### `查询` queryActivityReceiptByArid

通过活动收据ID获取活动收据信息

**Requests:**

- `activityReceipt.arid` (Long): 活动收据ID

```json
{
    "activityReceipt.arid": 1
}
```

**Returns:**

- `activityReceipt` (Object): 活动收据

```json
{
    ...
    "activityReceipt": {
        "arid": 1,
        "collecter": {
            "uid": 1,
            "userId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
        },
        "collectTime": "2016-01-01 00:00:00",
        "cash": 100000,
        "bank": 0,
        "bankInfo": "",
        "comment": ""
    }
    ...
}
```


##### `查询` countActivityPayment

根据活动款主材类型 , 汇总统计不同品牌金额总数

**Returns:**

- `counts` (Object): 统计信息信息 , 类型 List <List <String>>

```json
{
    ...
    "counts":[
        ["品牌1", "2000"],
        ["品牌2", "2000"]
    ],
    ...
}
```


##### `查询` createActivityPayment

创建活动款信息

**Requests:**

- `activityPayment.mno` (String): 活动票号
- `activityPayment.type` (Short): 类型
- `activityPayment.category` (String): 品类
- `activityPayment.brand` (String): 品牌
- `activityPayment.money` (Integer): 金额
- `activityPayment.comment` (String): 备注

```json
{
    "activityPayment.mno": "000000000000000000",
    "activityPayment.type": 1,
    "activityPayment.category": "品类",
    "activityPayment.brand": "品牌1",
    "activityPayment.money": 100000,
    "activityPayment.comment": "说明"
}
```


##### `查询` collectActivityPayment

活动款收款 , 同时支持批量收款

判断活动票是否存在 , 不存在 , 错误信息 **160044 活动票不存在**

判断活动票是否已经注册 , 未注册 , 错误信息 **160045 活动票未注册**

判断活动款总额是否与收款总额相同

批量收款时 , 判断多个款项对应人会员号是否唯一

创建收款数据 , 更新款项状态

**Requests:**

- `activityReceipt.orderId` (String): 装修单号
- `activityReceipt.cash` (Integer): 现金
- `activityReceipt.bank` (Integer): 刷卡
- `activityReceipt.bankInfo` (String): 刷卡信息
- `activityReceipt.comment` (String): 说明

```json
{
    "activityPayment[0].apid": 1,
    "activityPayment[1].apid": 2,
    "activityReceipt.orderId": "1601010001",
    "activityReceipt.cash": 100000,
    "activityReceipt.bank": 0,
    "activityReceipt.bankInfo": "",
    "activityReceipt.comment": "说明"
}
```

## 代付款


> **类**: `api.payment.ProxyPaymentAction`


#### 数据类型: `proxyPayment`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ppid` | 代付款ID | Long |
| `prid` | 收据ID | Long |
| `title` | 标题 | String |
| `name` | 名称 | String |
| `phone` | 电话 | String |
| `address` | 地址 | String |
| `unionId` | 归属人ID | String |
| `orderId` | 装修单号 | String |
| `referMoney` | 应付款 | Long |
| `realMoney` | 实收金额 | Long |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `did` | 部门ID | Integer |
| `rid` | 分区ID | Integer |
| `createTime` | 创建时间 | Timestamp |
| `type` | 类型 , 0: 收款 , 1: 退款 | Short |
| `status` | 状态 , 0:初始, 1:已付款, 2:已确认 | Short |
| `isexpire` | 过期标识 , 0: 有效 , 1: 过期 | Short |
| `company` | 公司 | Integer |


#### 数据类型: `proxyReceipt`

| 参数 | 说明 | 类型 |
|------|------|------|
| `prid` | 收据ID | Long |
| `collecter` | 收款人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `collectTime` | 收款时间 | Timestamp |
| `confirmer` | 确认人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `confirmTime` | 确认时间 | Timestamp |
| `realMoney` | 实收金额 | Long |
| `cash` | 现金 | Long |
| `cashInfo` | 现金信息 | String |
| `bank` | 刷卡 | Long |
| `bankInfo` | 刷卡信息 , **#** 分隔多条刷卡信息, **|** 分隔信息中不同字段 , 由 **类型|金额|时间** 组成 , 例如: **#187|15000|2016-03-23 14:25:15#** | String |
| `checkv` | 转账 | Long |
| `checkvBank` | 转账银行 | String |
| `comment` | 说明 | String |


##### `查询` pageProxyPayment

分页方式获取代付款信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 代付款信息列表 , 每条数据类型 `proxyPayment`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "ppid": 1,
                "prid": 1,
                "title": "标题",
                "name": "名称",
                "phone": "",
                "address": "",
                "unionId": "",
                "orderId": "",
                "referMoney": 1000,
                "realMoney": 1000,
                "creater": {
                    "uid": 1,
                    "userId": "FL-02381",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "136xxxx1453",
                    ...
                },
                "createTime": "2016-01-01 00:00:00",
                "type": 0,
                "status": 0,
                "collecter": null,
                "collectTime": null,
                "confirmer": null
                "confirmTime": null,
                "realMoney": 0,
                "cash": 0,
                "cashInfo": "",
                "bank": 0,
                "bankInfo": "",
                "checkv": 0,
                "checkvBank": "",
                "comment": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryProxyPayment

通过代付款ID获取信息

**Requests:**

- `proxyPayment.ppid` (Long): 代付款ID

```json
{
    "proxyPayment.ppid": 1
}
```

**Returns:**

- `proxyPayment` (Object): 代付款 , 类型 `proxyPayment`

```json
{
    ...
    "proxyPayment": {
        "ppid": 1,
        "prid": 1,
        "title": "标题",
        "name": "名称",
        "phone": "",
        "address": "",
        "unionId": "",
        "orderId": "",
        "referMoney": 1000,
        "realMoney": 1000,
        "creater": {
            "uid": 1,
            "userId": "FL-02381",
            "userName": "白雪",
            "currentName": "白雪",
            "phone": "136xxxx1453",
            ...
        },
        "createTime": "2016-01-01 00:00:00",
        "type": 0,
        "status": 0,
        "collecter": null,
        "collectTime": null,
        "confirmer": null
        "confirmTime": null,
        "realMoney": 0,
        "cash": 0,
        "cashInfo": "",
        "bank": 0,
        "bankInfo": "",
        "checkv": 0,
        "checkvBank": "",
        "comment": ""
    },
    ...
}
```


##### `查询` queryProxyPaymentForUnionId

通过代付款ID获取信息

**Requests:**

- `proxyPayment.unionId` (Long): 代付款ID

```json
{
    "proxyPayment.unionId": 1
}
```

**Returns:**

- `proxyPayments` (Object): 代付款 , 类型 `proxyPayment`

```json
{
    ...
    "proxyPayment": {
        "ppid": 1,
        "prid": 1,
        "title": "标题",
        "name": "名称",
        "phone": "",
        "address": "",
        "unionId": "",
        "orderId": "",
        "referMoney": 1000,
        "realMoney": 1000,
        "creater": {
            "uid": 1,
            "userId": "FL-02381",
            "userName": "白雪",
            "currentName": "白雪",
            "phone": "136xxxx1453",
            ...
        },
        "createTime": "2016-01-01 00:00:00",
        "type": 0,
        "status": 0,
        "collecter": null,
        "collectTime": null,
        "confirmer": null
        "confirmTime": null,
        "realMoney": 0,
        "cash": 0,
        "cashInfo": "",
        "bank": 0,
        "bankInfo": "",
        "checkv": 0,
        "checkvBank": "",
        "comment": ""
    },
    ...
}
```


##### `查询` addProxyPayment

添加代付款信息

**Requests:**

- `proxyPayment.title` (String): 标题
- `proxyPayment.name` (String): 名称
- `proxyPayment.phone` (String): 电话
- `proxyPayment.address` (String): 地址
- `proxyPayment.referMoney` (Long): 生成金额
- `proxyPayment.creater.userId` (String): 创建人编号

```json
{
    "proxyPayment.title": "",
    "proxyPayment.name": "",
    "proxyPayment.phone": "",
    "proxyPayment.address": "",
    "proxyPayment.referMoney": 600000,
    "proxyPayment.creater.userId": "FL-02381"
}
```


##### `查询` collectProxyPayment

代付款收款

判断代付款是否存在 , 不存在 , 错误信息 **150003 款项不存在**

判断款收款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**

**Requests:**

- `proxyPayment.ppid` (Long): 款项ID
- `proxyPayment.realMoney` (Long): 实收金额
- `proxyPayment.cash` (Long): 现金
- `proxyPayment.cashInfo` (String): 现金信息
- `proxyPayment.bank` (Long): 刷卡
- `proxyPayment.bankInfo` (String): 刷卡信息
- `proxyPayment.checkv` (Long): 转账
- `proxyPayment.checkvBank` (String): 转账银行
- `proxyPayment.comment` (String): 说明

```json
{
    "proxyPayment.ppid": 1,
    "proxyPayment.realMoney": 10000,
    "proxyPayment.cash": 10000,
    "proxyPayment.cashInfo": "175",
    "proxyPayment.bank": 10000,
    "proxyPayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
    "proxyPayment.checkv": 10000,
    "proxyPayment.checkvBank": "189",
    "proxyPayment.comment": "说明",
}
```


##### `查询` refundProxyPayment


##### `查询` confirmProxyPayment

代付款确认 , 更新款项状态为已确认

**Requests:**


```json
{
    "ppids[0]": 1
}
```


##### `查询` cancelProxyPayment

## 转换款


> **类**: `api.payment.PaytranAction`


#### 数据类型: `paytran`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ptid` | 转换款ID | Long |
| `orderId` | 装修单号 | String |
| `pid` | 款项ID | Long |
| `rid` | 收据ID | Long |
| `rtid` | 商户类型ID | Long |
| `type` | 类型 , 0: 预付款 , 1: 装修款 , 2: 主材款 , 3: 销售款 , 4: 服务款 , 5: 活动款 , 6: 转换款 , 7: 代付款 | Short |
| `atttype` | 业务类型 , 0: 装修 , 1: 主材 | Short |
| `no` | 收据编号 | String |
| `sn` | 机器编号 | String |
| `msgId` | 消息编号 | String |
| `outOrderId` | 订单号 | String |
| `status` | 状态 , 0: 初始 , 1: 成功 , 2: 失败 , 3: 失效 | Short |
| `money` | 金额 | Long |
| `createTime` | 创建时间 | Timestamp |
| `pushTime` | 推送时间 | Timestamp |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `rstcode` | 响应码 | String |
| `rstmsg` | 响应信息 | String |
| `way` | 支付方式 , 包括: 0: pospay(刷卡), 1: wxpay(微信), 2: alipay(支付宝), 3: codepay(pos扫码) | Short |


##### `查询` pagePaytran

分页方式获取转换款信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 转换款信息列表 , 每条数据类型 `paytran`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "ptid": 1,
                "orderId": "1601010001",
                "pid": 1,
                "rid": 1,
                "type": 1,
                "atttype": 0,
                "no": "157",
                "sn": "420408479404809043870826390",
                "msgId": "67538996237553921700979907083217",
                "outOrderId": "1615670",
                "status": 0,
                "money": 100000,
                "createTime": "2016-01-01 00:00:00",
                "pushTime": "2016-01-01 00:00:00",
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "rstcode": "",
                "rstmsg": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryPaytran

根据款项ID以及类型获取转换款信息

**Requests:**

- `paytran.pid` (Long): 款项ID
- `paytran.rid` (Long): 收据ID
- `paytran.type` (Short): 类型
- `paytran.atttype` (Short): 业务类型

```json
{
    "paytran.pid": 1,
    "paytran.rid": 1,
    "paytran.type": 1,
    "paytran.atttype": 0
}
```

**Returns:**

- `paytrans` (List): 转换款信息列表 , 类型 `paytran`

```json
{
    ...
    "paytrans": [
        {
            "ptid": 1,
            "orderId": "1601010001",
            "pid": 1,
            "rid": 1,
            "type": 1,
            "atttype": 0,
            "no": "157",
            "sn": "420408479404809043870826390",
            "msgId": "67538996237553921700979907083217",
            "outOrderId": "1615670",
            "status": 0,
            "money": 100000,
            "createTime": "2016-01-01 00:00:00",
            "pushTime": "2016-01-01 00:00:00",
            "creater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "rstcode": "",
            "rstmsg": ""
        }
    ]
    ...
}
```


##### `查询/创建` queryPaytranByPtid

通过转换款ID获取转换款信息

**Requests:**

- `paytran.ptid` (Long): 转换款ID

```json
{
    "paytran.pid": 1,
    "paytran.rid": 1,
    "paytran.type": 1
}
```

**Returns:**

- `paytran` (Object): 转换款信息 , 类型 `paytran`

```json
{
    ...
    "paytran": {
        "ptid": 1,
        "orderId": "1601010001",
        "pid": 1,
        "rid": 0,
        "type": 1,
        "atttype": 0,
        "no": "157",
        "sn": "420408479404809043870826390",
        "msgId": "67538996237553921700979907083217",
        "outOrderId": "1615670",
        "status": 0,
        "money": 100000,
        "createTime": "2016-01-01 00:00:00",
        "pushTime": "2016-01-01 00:00:00",
        "creater": {
            "uid": 1,
            "userId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师"
        },
        "rstcode": "",
        "rstmsg": ""
    }
    ...
}
```


##### `查询` sendPaytran

推送转换款

验证转款款信息是否存在 , 不存在 , 错误信息 **150003 款项不存在**

**Requests:**

- `paytran.pid` (Long): 转换款ID

```json
{
    "paytran.pid": 1
}
```


##### `查询` addPaytran

添加转换款信息 , 发起收款

金额精度处理 , 支持两位小数 , 分

判断金额处理之后 , 不能为0 , 错误信息 **150025 款项金额不正确**

判断当前pid对应是否存在状态处于(0)初始的转换款信息 , 如果存在 , 错误信息 **150048 转换款支付未完成**

调用第三方支付工具 , 完成发起转换款信息过程 , 更新第三方支付信息

**Requests:**

- `paytran.pid` (Long): 款项ID
- `paytran.type` (Short): 类型
- `paytran.no` (String): 收据编号
- `paytran.sn` (String): 机器编号
- `paytran.money` (String): 收据编号
- `paytran.way` (String): 交易方式

```json
{
    "paytran.pid": 1,
    "paytran.type": 1,
    "paytran.no": "157",
    "paytran.sn": "420408479404809043870826390",
    "paytran.money": 1,
    "paytran.way": "wxpay"
}
```

**Returns:**

- `paytran` (Object): 转换款 , 类型 `paytran`

```json
{
    ...
    "paytran": {
        "ptid": 1,
        "pid": 1,
        "type": 1,
        "no": "157",
        "sn": "420408479404809043870826390",
        "msgId": "67538996237553921700979907083217",
        "outOrderId": "1615670",
        "status": 0,
        "money": 100000,
        "createTime": "2016-01-01 00:00:00",
        "creater": {
            "uid": 1,
            "userId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师"
        },
        "rstcode": "",
        "rstmsg": ""
    }
    ...
}
```


##### `查询` checkPaytran

验证转换款信息 , 收款成功或者失败 , 更新状态

判断转换款信息是否存在 , 不存在 , 错误信息 **150043 转换款不存在**

判断转换款信息状态是否为0(初始) , 其他状态 , 错误信息 **150047 转换款支付不可操作**

调用第三方支付工具 , 完成转换款信息验证过程 , 同时更新转换款状态以及结果信息

**Requests:**

- `paytran.ptid` (Long): 转换款ID

```json
{
    "paytran.pid": 1,
}
```

**Returns:**

- `paytran` (Object): 转换款 , 类型 `paytran`

```json
{
    ...
    "paytran": {
        "ptid": 1,
        "pid": 1,
        "type": 1,
        "no": "157",
        "sn": "420408479404809043870826390",
        "msgId": "67538996237553921700979907083217",
        "outOrderId": "1615670",
        "status": 0,
        "money": 100000,
        "createTime": "2016-01-01 00:00:00",
        "rstcode": "",
        "rstmsg": ""
    }
    ...
}
```


##### `查询` cancelPaytran

撤销转换款

判断转换款信息是否存在 , 不存在 , 错误信息 **150043 转换款不存在**

判断转换款信息状态不为1(成功) , 成功状态 , 错误信息 **150047 转换款支付不可操作**

**Requests:**

- `paytran.ptid` (Long): 转换款ID

```json
{
    "paytran.pid": 1,
}
```


##### `查询` deletePaytran

删除转换款

判断转换款信息是否存在 , 不存在 , 错误信息 **150043 转换款不存在**

判断转换款信息状态不为0(初始) , 成功状态 , 错误信息 **150047 转换款支付不可操作**

**Requests:**

- `paytran.ptid` (Long): 转换款ID

```json
{
    "paytran.pid": 1,
}
```

## 收款单


> **类**: `api.payment.BillAction`


#### 数据类型: `bill`

| 参数 | 说明 | 类型 |
|------|------|------|
| `bid` | 收款单ID | Long |
| `orderId` | 装修单号 | String |
| `rtid` | 收据类型ID | Long |
| `money` | 收款额 | Long |
| `status` | 状态 , 0: 初始 , 1: 提交 , 2: 已付 , 3: 拒绝 , 4: 超时 , 5: 失效 | Short |


#### 数据类型: `billItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `biid` | 收款项ID | Long |
| `bid` | 收款单ID | Long |
| `type` | 款项类型 , 0: 预付款 , 1: 装修款 , 2: 主材款 , 3: 销售款 , 4: 服务款 , 5: 活动款 , 6: 转换款 , 7: 代付款 | Short |
| `pid` | 款项ID | Long |


##### `查询` pageBill

分页方式获取收款单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 钱包信息列表 , 每条数据类型 `wallet`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "bid": 1,
                "orderId": "1601010001",
                "money": 1000000,
                "status": 1
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryBill

获取收款单信息

**Requests:**

- `bill.bid` (Long): 收款单ID

```json
{
    "bill.bid": 1
}
```

**Returns:**

- `bill` (Object): 收款单信息 , 数据类型 `bill`

```json
{
    "bid": 1,
    "orderId": "1601010001",
    "money": 1000000,
    "status": 1
}
```


##### `查询` makeBill

创建收款单

**Requests:**

- `bill.orderId` (String): 装修单号
- `bill.money` (Long): 收款额

```json
{
    "bill.orderId": "1601010001",
    "bill.money": 100000,

    "billItems[0].pid": 1,
    "billItems[0].type": 1
}
```


##### `查询` cancelBill

取消收款单

**Requests:**

- `bill.bid` (String): 装修单号

```json
{
    "bill.bid": 1
}
```

## 钱包


### 钱包


> **类**: `api.payment.WalletAction`


#### 数据类型: `wallet`

| 参数 | 说明 | 类型 |
|------|------|------|
| `wid` | 钱包ID | Long |
| `buid` | 归属人ID | Long |
| `no` | 编号 | String |
| `phone` | 电话 | String |
| `identity` | 身份证 | String |
| `balance` | 余额 | Long |
| `type` | 类型 , 0: 公司 , 1: 厂商 , 2: 员工 | Short |
| `status` | 状态 , 0: 初始 , 1: 正常 , 2: 冻结 , 3: 注销 | Short |
| `amount` | 金额 | Long |
| `validCode` | 验证码 | String |
| `sn` | 流水号 | String |


##### `查询` pageWallet

分页方式获取钱包信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 钱包信息列表 , 每条数据类型 `wallet`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "wid": 1,
                "buid": 1,
                "no": ""
                "phone": "13858484851",
                "identity": "",
                "balance": 10000,
                "type": 0,
                "status": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryWallet

查询钱包信息

**Requests:**

- `wallet.wid` (Long): 钱包ID

```json
{
    "wallet.wid": 1
}
```

**Returns:**

- `wallet` (Object): 钱包信息 , 数据类型 `wallet`

```json
{
    ...
    "wallet": {
        "wid": 1,
        "buid": 1,
        "no": ""
        "phone": "13858484851",
        "identity": "",
        "balance": 10000,
        "type": 0,
        "status": 0
    }
    ...
}
```


##### `查询` applyWallet

开户

**Requests:**

- `wallet.buid` (Long): 归属人ID
- `wallet.phone` (String): 电话
- `wallet.identity` (String): 身份证

```json
{
    "wallet.buid": 1,
    "wallet.phone": "13848584582",
    "wallet.identity": ""
}
```


##### `查询` bindWallet

绑定

判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

判断钱包状态为0(初始) , 其他状态 , 错误信息 **150055 钱包状态不可操作**

更新钱包状态为1(绑定)

**Requests:**

- `wallet.wid` (Long): 钱包ID

```json
{
    "wallet.wid": 1
}
```

**Returns:**

- `wallet` (Object): 钱包 , 数据类型 `wallet`

```json
{
    ...
    "wallet": {
        "sn": 1,
        "validCode": ""
    }
    ...
}
```


##### `查询` updateWallet

更新

判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

判断钱包状态为1(绑定) , 其他状态 , 错误信息 **150055 钱包状态不可操作**

**Requests:**

- `wallet.wid` (Long): 钱包ID
- `wallet.phone` (String): 电话

```json
{
    "wallet.wid": 1,
    "wallet.phone": "13848548541"
}
```

**Returns:**

- `wallet` (Object): 钱包 , 数据类型 `wallet`

```json
{
    ...
    "wallet": {
        "sn": "",
        "validCode": "6854"
    }
    ...
}
```


##### `查询` confirmWallet

确认

判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

**Requests:**

- `wallet.wid` (Long): 钱包ID
- `wallet.sn` (String): 流水号
- `wallet.validCode` (String): 验证码

```json
{
    "wallet.wid": 1,
    "wallet.sn": "",
    "wallet.validCode": "1585"
}
```


##### `查询` freezeWallet

冻结

判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

**Requests:**

- `wallet.wid` (Long): 钱包ID

```json
{
    "wallet.wid": 1
}
```


##### `查询` unfreezeWallet

解冻

判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

**Requests:**

- `wallet.wid` (Long): 钱包ID

```json
{
    "wallet.wid": 1
}
```


##### `查询` consumeWallet

消费

判断操作钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

判断操作钱包状态为1(正常) , 其他状态 , 错误信息 **150055 钱包状态不可操作**

**Requests:**

- `wallet.wid` (Long): 钱包ID
- `wallet.amount` (Long): 金额
- `tallet.wid` (Long): 钱包ID

```json
{
    "wallet.wid": 1,
    "wallet.amount": 10000,
    "tallet.wid": 2
}
```

**Returns:**

- `wallet` (Object): 钱包 , 数据类型 `wallet`

```json
{
    ...
    "wallet": {
        "sn": "",
        "validCode": "6854"
    }
    ...
}
```


##### `查询` rechargeWallet

充值

判断操作钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

判断操作钱包状态为1(正常) , 其他状态 , 错误信息 **150055 钱包状态不可操作**

**Requests:**

- `wallet.wid` (Long): 钱包ID
- `wallet.amount` (Long): 金额

```json
{
    "wallet.wid": 1,
    "wallet.amount": 10000
}
```

**Returns:**

- `wallet` (Object): 钱包 , 数据类型 `wallet`

```json
{
    ...
    "wallet": {
        "sn": "",
        "validCode": "6854"
    }
    ...
}
```


##### `查询` withdrawWallet

提现

判断操作钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

判断操作钱包状态为1(正常) , 其他状态 , 错误信息 **150055 钱包状态不可操作**

**Requests:**

- `wallet.wid` (Long): 钱包ID
- `wallet.amount` (Long): 金额

```json
{
    "wallet.wid": 1,
    "wallet.amount": 10000
}
```

**Returns:**

- `wallet` (Object): 钱包 , 数据类型 `wallet`

```json
{
    ...
    "wallet": {
        "sn": "",
        "validCode": "6854"
    }
    ...
}
```


##### `查询` consentWallet

交易确认

判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

**Requests:**

- `wallet.wid` (Long): 钱包ID
- `wallet.sn` (String): 流水号
- `wallet.validCode` (String): 验证码

```json
{
    "wallet.wid": 1,
    "wallet.sn": "",
    "wallet.validCode": "1585"
}
```


##### `查询` transferWallet

判断操作钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

判断操作钱包状态为1(正常) , 其他状态 , 错误信息 **150055 钱包状态不可操作**

**Requests:**

- `wallet.wid` (Long): 钱包ID
- `wallet.amount` (Long): 金额
- `tallet.wid` (Long): 钱包ID

```json
{
    "wallet.wid": 1,
    "wallet.amount": 10000,
    "tallet.wid": 2
}
```

**Returns:**

- `wallet` (Object): 钱包 , 数据类型 `wallet`

```json
{
    ...
    "wallet": {
        "sn": "",
        "validCode": "6854"
    }
    ...
}
```


##### `查询` approveWallet

转账确认

判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

**Requests:**

- `wallet.wid` (Long): 钱包ID
- `wallet.sn` (String): 流水号
- `wallet.validCode` (String): 验证码

```json
{
    "wallet.wid": 1,
    "wallet.sn": "",
    "wallet.validCode": "1585"
}
```

### 银行卡


> **类**: `api.payment.WalletardAction`


#### 数据类型: `walletard`

| 参数 | 说明 | 类型 |
|------|------|------|
| `wcid` | 银行卡ID | Long |
| `wid` | 钱包ID | Long |
| `bankNo` | 卡号 | String |
| `bankName` | 银行名 | String |
| `validTime` | 有效期 | String |
| `cvv` | 安全码 | String |
| `type` | 类型 , 0: 借记 , 1: 贷记 | Short |
| `status` | 状态 , 0: 初始 , 1: 有效 , 2: 失效 , 3: 签约失败 , 4: 已登记 , 5: 解绑 | Short |
| `mobile` | 电话 | String |
| `bindTime` | 绑定时间 | Timestamp |
| `token` | 令牌 | String |
| `validCode` | 验证码 | String |
| `sn` | 流水号 | 流水号 |


##### `查询` queryWalletard

获取银行卡信息

**Requests:**

- `walletard.wid` (Long): 钱包ID

```json
{
    "walletard.wid": 1
}
```

**Returns:**

- `walletards` (List): 银行卡信息列表 , 每条数据类型 `walletard`

```json
{
    ...
    "walletards": [
        {
            "wcid": 1,
            "wid": 1,
            "bankNo": "",
            "bankName": "银行名称",
            "validTime": "20160101",
            "cvv": "845",
            "type": 0,
            "status": 0,
            "mobile": "13848589484",
            "bindTime": "2016-01-01 00:00:00",
            "token": ""
        }
    ],
    ...
}
```


##### `查询` bindWalletard

绑定银行卡

判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

**Requests:**

- `walletard.wtid` (Long): 钱包ID
- `walletard.wid` (Long): 钱包ID
- `walletard.bankNo` (String): 银行卡号
- `walletard.validTime` (String): 有效期
- `walletard.cvv` (String): 安全码
- `walletard.type` (Short): 类型
- `walletard.mobile` (String): 电话

```json
{
    "walletard.wtid": 1,
    "walletard.wid": 1,
    "walletard.bankNo": "",
    "walletard.validTime": "20160101",
    "walletard.cvv": "789",
    "walletard.type": 0,
    "walletard.mobile": 13840585484,
}
```

**Returns:**

- `walletard` (Object): 银行卡信息

```json
{
    ...
    "walletard": {
        "sn": 1,
        "validCode": ""
    }
    ...
}
```


##### `查询` confirmWalletard

确认银行卡

判断银行卡是否存在 , 不存在 , 错误信息 **150058 银行卡不存在**

判断银行卡状态为0(初始)/5(解绑) , 其他状态 , 错误信息 **150059 银行卡状态不可操作**

**Requests:**

- `walletard.wtid` (Long): 钱包ID
- `walletard.sn` (String): 流水号
- `walletard.validCode` (String): 验证码

```json
{
    "walletard.wtid": 1,
    "walletard.sn": 1,
    "walletard.validCode": "6585"
}
```


##### `查询` unbindWalletard

解绑银行卡

判断银行卡是否存在 , 不存在 , 错误信息 **150058 银行卡不存在**

判断银行卡状态为1(有效) , 其他状态 , 错误信息 **150059 银行卡状态不可操作**

**Requests:**

- `walletard.wtid` (Long): 钱包ID

```json
{
    "walletard.wtid": 1
}
```


##### `查询` deleteWalletard

删除银行卡

判断银行卡是否存在 , 不存在 , 错误信息 **150058 银行卡不存在**

判断银行卡状态为0(初始)/5(解绑) , 其他状态 , 错误信息 **150059 银行卡状态不可操作**

**Requests:**

- `walletard.wtid` (Long): 钱包ID

```json
{
    "walletard.wtid": 1
}
```

### 交易


> **类**: `api.payment.WalletranAction`


#### 数据类型: `walletran`

| 参数 | 说明 | 类型 |
|------|------|------|
| `wtid` | 交易ID | Long |
| `no` | 编号 | String |
| `wallet` | 操作钱包 , 类型 [wallet ](./payment.html#api.payment.WalletAction.wallet) | Object |
| `tallet` | 关联钱包 , 类型 [wallet ](./payment.html#api.payment.WalletAction.wallet) | Object |
| `amount` | 金额 | Long |
| `type` | 类型 , 0: 充值 , 1: 提现 , 2: 消费 , 3: 转账 , 4: 退款 | Short |
| `status` | 状态 , 0: 初始 | Short |
| `comment` | 备注 | String |


##### `查询` pageWalletran

分页方式获取交易信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 交易信息列表 , 每条数据类型 `walletran`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "wtid": 1,
                "wid": 1,
                "wallet": {
                    "wid": 1,
                    "buid": 1,
                    "no": ""
                    "phone": "13858484851",
                    "identity": "",
                    "balance": 10000,
                    "type": 0,
                    "status": 0
                },
                "tallet": {
                    "wid": 1,
                    "buid": 1,
                    "no": ""
                    "phone": "13858484851",
                    "identity": "",
                    "balance": 10000,
                    "type": 0,
                    "status": 0
                },
                "amount": 10000,
                "type": 0,
                "status": 0,
                "comment": "备注"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryWalletran

获取交易信息

**Requests:**

- `walletran.wid` (Long): 钱包ID

```json
{
    "walletran.wid": 1
}
```

**Returns:**

- `walletrans` (List): 交易信息列表 , 每条数据类型 `walletran`

```json
{
    ...
    "walletrans": [
        {
            "wtid": 1,
            "wid": 1,
            "wallet": {
                "wid": 1,
                "buid": 1,
                "no": ""
                "phone": "13858484851",
                "identity": "",
                "balance": 10000,
                "type": 0,
                "status": 0
            },
            "tallet": {
                "wid": 1,
                "buid": 1,
                "no": ""
                "phone": "13858484851",
                "identity": "",
                "balance": 10000,
                "type": 0,
                "status": 0
            },
            "amount": 10000,
            "type": 0,
            "status": 0,
            "comment": "备注"
        }
    ],
    ...
}
```

### 资源


> **类**: `api.payment.WalletresAction`


#### 数据类型: `walletres`

| 参数 | 说明 | 类型 |
|------|------|------|
| `wrid` | 资源ID | Long |
| `wid` | 钱包ID | Long |
| `picid` | 资源ID | Long |
| `name` | 名称 | String |
| `type` | 类型 | String |
| `path` | 路径 | String |
| `commnet` | 备注 |  |


| Type | 类型 |  |
| --- | --- | --- |
| 00 | 公民身份证正面 |  |
| 19 | 营业执照 |  |
| 20 | 税务登记证 |  |
| 30 | 公民身份证反面 |  |
| 31 | 互联网业务商户协议 |  |
| 32 | 授权书 |  |
| 33 | 手持身份证正扫面照 |  |
| 34 | 门头照 |  |
| 35 | 结算银行卡正面照 |  |
| 36 | 结算银行卡反面照 |  |
| 37 | 开户许可证 |  |
| 38 | 收单业务商户协议 |  |
| 50 | 经营场所图1 |  |
| 51 | 经营场所 |  |


##### `查询` queryWalletres

获取钱包归属资源

**Requests:**

- `walletres.wid` (Long): 钱包ID

```json
{
    "walletres.wid": 1
}
```

**Returns:**

- `walletreses` (List): 资源信息列表 , 每条数据类型 `walletres`

```json
{
    ...
    "walletreses": [
        {
            "wrid": 1,
            "wid": 1,
            "picid": 1,
            "name": "名称",
            "path": "",
            "type": "00",
            "comment": "备注"
        }
    ],
    ...
}
```


##### `查询` uploadWalletres

上传资源

判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

**Requests:**

- `walletres.wid` (Long): 钱包ID
- `walletres.name` (String): 名称
- `walletres.path` (String): 路径
- `walletres.type` (String): 类型
- `walletres.comment` (String): 备注

```json
{
    "walletres.wid": 1,
    "walletres.name": "名称",
    "walletres.path": "",
    "walletres.type": "00",
    "walletres.comment": "备注"
}
```


##### `查询` deleteWalletres

删除资源

**Requests:**

- `walletres.wtid` (Long): 资源ID

```json
{
    "walletres.wtid": 1
}
```

## 功能


> **类**: `api.sales.PaymentFunctionAction`


#### 数据类型: `paymentFunction`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pfid` | 功能ID | Long |
| `name` | 名称 | String |
| `key` | key | String |
| `value` | value | String |
| `group` | 分组 , 0: 公共 , 1: 预付 , 2: 装修 , 4: 主材 , 8: 销售 , 16: 服务 | Short |
| `type` | 类型 , 0: 类型, 1: api, 2: 条件, 3: 字段, 4: 功能, 5: 节点 | Short |
| `subtype` | 子类 , 0: 字符串, 1: 数组 | Short |
| `comment` | 说明 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `sort` | 排序 | Short |


##### `查询` queryPaymentFunction

获取款项功能信息

**Requests:**

- `paymentFunction.type` (Short): 类型

```json
{
    "paymentFunction.type": 0
}
```

**Returns:**

- `paymentFunctions` (Object): 功能信息 , 类型 `paymentFunction`

```json
{
    ...
    "paymentFunctions": [
        {
            "pfid": 1,
            "name": "designer",
            "key": "api",
            "value": "api.decoration.function",
            "group": 0,
            "type": 0,
            "subtype": 0,
            "comment": "说明",
            "sort": 0
        }
    ],
    ...
}
```
