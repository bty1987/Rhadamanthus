# 薪资


## 通用薪资


> **类**: `api.salary.SalaryAction`


#### 数据类型: `salary`

| 参数 | 说明 | 类型 |
|------|------|------|
| `sid` | 薪资ID | Long |
| `user` | 人员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `type` | 类型 , 0: 加 , 1: 减 | Short |
| `onetype` | 一类, 0(基本) , 1(提成) , 2(扣款) , 3(其他) | Short |
| `twotype` | 二类, 0(基本) , 1(设计) , 2(业务) , ... | Short |
| `thrtype` | 三类, 0(基本) , 1(主材) , 2(销售) , 3(迟到) , 4(早退) | Short |
| `money` | 操作金额 | Long |
| `createTime` | 创建时间 | Timestamp |
| `status` | 状态, 0(初始) , 1(通过) , 2(拒绝) , 3(撤销) | Short |
| `operater` | 操作人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `operateTime` | 操作时间 | Timestamp |
| `comment` | 说明 | String |


##### `查询` pageSalary

分页方式获取薪资信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 薪资信息列表 , 每条数据类型 `salary`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sid": 1,
                "user": {
                    "currentName": "白雪",
                    "userId": "U0479",
                    "userName": "白雪",
                },
                "createTime": "2016-01-01",
                "type": 0,
                "onetype": 1,
                "twotype": 2,
                "money": 100000,
                "status": 0,
                "operater": null,
```

"operateTime": "2016-01-01",

"comment":"说明"

}

],

},

}


##### `查询` addSalary

添加薪资

**Request:**

- `salary.user.uid` (Long): 员工ID
- `salary.type` (Short): 类型
- `salary.onetype` (Short): 一类
- `salary.twotype` (Short): 二类
- `salary.thrtype` (Short): 三类
- `salary.money` (Long): 操作金额
- `salary.comment` (String): 说明

```json
{
    "salary.user.uid": 1,
    "salary.type": 1,
    "salary.money": 500000,
    "salary.twotype": 1,
    "salary.comment": ""
}
```


##### `查询` passSalary

通过薪资信息

判断薪资状态是否为0(初始) , 非初始不能通过 , 错误信息 **280002 薪资状态不可操作**

**Request:**

- `salary.sid` (Long): 薪资ID

```json
{
    "salary.sid": 1,
}
```


##### `查询` rejectSalary

拒绝薪资信息

判断薪资状态是否为0(初始) , 非初始不能通过 , 错误信息 **280002 薪资状态不可操作**

**Request:**

- `salary.sid` (Long): 薪资ID

```json
{
    "salary.sid": 1,
}
```


##### `查询` cancelSalary

撤销薪资信息

判断薪资状态是否为0(初始) , 非初始不能通过 , 错误信息 **280002 薪资状态不可操作**

**Request:**

- `salary.sid` (Long): 薪资ID

```json
{
    "salary.sid": 1,
}
```

## 扣款


> **类**: `api.salary.WithholdAction`


#### 数据类型: `withhold`

| 参数 | 说明 | 类型 |
|------|------|------|
| `wid` | 扣款ID | Long |
| `user` | 人员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `type` | 类型 , 0: 标准 , 1: 装修款 | Short |
| `orderId` | 装修单号 | String |
| `ident` | 引用ID | Long |
| `money` | 操作金额 | Long |
| `createTime` | 创建时间 | Timestamp |
| `status` | 状态, 0(初始) | Short |
| `operater` | 操作人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `operateTime` | 操作时间 | Timestamp |
| `comment` | 说明 | String |


##### `查询` pageWithhold

分页方式获取扣款信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 扣款信息列表 , 每条数据类型 `withhold`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "wid": 1,
                "user": {
                    "currentName": "白雪",
                    "userId": "U0479",
                    "userName": "白雪",
                },
                "orderId": "1601010001",
                "createTime": "2016-01-01",
                "type": 0,
                "money": 100000,
                "status": 0,
                "operater": null,
```

"operateTime": "2016-01-01",

"comment":"说明"

}

],

},

}


##### `查询` queryWithhold

获取扣款信息

**Request:**

- `withhold.ident` (Long): 引用ID
- `withhold.type` (Short): 类型

```json
{
    "withhold.ident": 1,
    "withhold.type": 1
}
```

**Returns:**

- `withholds` (List): 扣款信息列表 , 每条数据类型 `withhold`

```json
{
    ...
    "withholds": [
        {
            "wid": 1,
            "user": {
                "currentName": "白雪",
                "userId": "U0479",
                "userName": "白雪",
            },
            "orderId": "1601010001",
            "createTime": "2016-01-01",
            "type": 0,
            "money": 100000,
            "status": 0,
            "operater": null,
            "operateTime": "2016-01-01",
            "comment":"说明"
        }
    ],
    ...
}
```


##### `查询` addWithhold

添加扣款信息

**Request:**

- `withhold.orderId` (String): 装修单号
- `withhold.ident` (Long): 引用ID
- `withhold.type` (Short): 类型
- `withhold.user.uid` (Long): 人员ID
- `withhold.money` (Long): 金额
- `withhold.comment` (String): 说明

```json
{
    "withhold.orderId": "1601010001",
    "withhold.ident": 1,
    "withhold.type": 1,
    "withhold.user.uid": 1,
    "withhold.money": 1000000,
    "withhold.comment": "说明",
}
```


##### `查询` updateWithholdForStatus

更新扣款信息

判断扣款信息是否存在 , 不存在 , 错误信息 **280013 扣款信息不存在**

**Request:**

- `withhold.wid` (Long): 扣款ID
- `withhold.status` (Short): 状态

```json
{
    "withhold.wid": 1,
    "withhold.status": 0
}
```

## 装修提成


> **类**: `api.salary.DecorationSalaryAction`


#### 数据类型: `decorationSalary`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dsid` | ID | Long |


##### `查询` pageDecorationSalary

## 主材提成


> **类**: `api.salary.MaterialSalaryAction`


#### 数据类型: `materialSalary`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dsid` | ID | Long |


##### `查询` pageMaterialSalary

## 工人帐户


> **类**: `api.salary.WorkerBalanceAction`


#### 数据类型: `workerBalance`

| 参数 | 说明 | 类型 |
|------|------|------|
| `wbid` | 帐户ID | Long |
| `user` | 工人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `deposit` | 质保金 | Long |
| `salary` | 工费 | Long |
| `toplimit` | 质保金上限 | Long |
| `status` | 状态 , 0: 有效 , 1: 无效 | Short |
| `company` | 公司ID | Long |


##### `查询` pageWorkerBalance

分页方式获取工费帐户信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 工人帐户信息列表 , 每条数据类型 `workerBalance`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "wbid": 1,
                "user": {
                    "currentName": "白雪",
                    "userId": "U0479",
                    "userName": "白雪",
                    ...
                },
                "deposit": 0,
                "salary": 0,
                "toplimit": 1000000
            }
        ],
        ...
    },
    ...
}
```


##### `查询` addWorkerBalance

添加工人帐户信息

判断工人帐户是否存在 , 已存在 , 错误信息 **280008 工人帐户已存在**

**Requests:**

- `workerBalance.user.uid` (Long): 工人ID

```json
{
    "workerBalance.user.uid": 1
}
```


##### `查询` updateWorkerBalance

更新工人帐户信息

**Requests:**

- `workerBalance.wbid` (Long): 帐户ID
- `workerBalance.toplimit` (Long): 质保金上限

```json
{
    "workerBalance.wbid": 1,
    "workerBalance.toplimit": 1000000
}
```

## 工人工费


> **类**: `api.salary.WorkerSalaryAction`


#### 数据类型: `workerSalary`

| 参数 | 说明 | 类型 |
|------|------|------|
| `wsid` | 工费ID | Long |
| `cwsid` | 关联工费ID | 关联工费ID |
| `orderId` | 装修单号 | String |
| `csid` | 工程ID | Long |
| `user` | 工人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `approver` | 审批人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `checker` | 质检人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `approveTime` | 审批时间 | Timestamp |
| `checkTime` | 质检时间 | Timestamp |
| `money` | 操作金额 | Long |
| `deposit` | 操作质保金 | Long |
| `salary` | 操作工费 | Long |
| `type` | 类型 , 包括: 0(加), 1(减) | Short |
| `onetype` | 一类 , 0(工费), 1(扣/罚), 2(转额), 3(其他) | Short |
| `twotype` | 类型 , 包括: 1(工费), 2(增项), 3(油工一级奖励), 4(维修款), 5(罚款), 6(工程质保金), 7(工具押金), 8(借款), 9(工人家属保险) | Short |
| `status` | 状态 , 包括: 0(初始) , 1(通过) , 2(驳回) , 3(撤销) | Short |
| `isSend` | 消息状态 , 包括: 0(初始) , 1(待发) , 2(已发) | Short |
| `isAppr` | 审批状态 , 包括: 0(初始) , 1(待发) , 2(已发) | Short |
| `isCheck` | 质检状态 , 包括: 0(初始) , 1(确认) | Short |
| `count` | 计数 , 装修单下同一施工节点工费数量 , 状态通过计数 | Short |
| `comment` | 备注 | String |


.. note::

加类金额根据当前人员帐户中质保金和工费金额操作 , 根据质保金上限 , 如果未达到质保金上限 , 补充到质保金中 , 超出部分补充到工费中 .

减类金额根据当前人员帐户中质保金和工费金额操作 , 扣掉工费金额 , 工费金额不足时 , 扣掉质保金金额 , 质保金不足 , 本次操作失败 .


| twotype | onetype | type |
| --- | --- | --- |
| 1 工费 | 0 工费 | 0/1 加/减 |
| 2 增项 | 0 工费 | 0 加 |
| 3 油工一级奖励 | 0 工费 | 0 加 |
| 4 维修费 | 2 转额 | 0/1 加/减 |
| 5 罚款 | 1 扣/罚 | 1 减 |
| 6 工程质保金 | 3 其他 | 0/1 加/减 |
| 7 工具押金 | 3 其他 | 0/1 加/减 |
| 8 借款 | 3 其他 | 0/1 加/减 |
| 9 工人家属保险 | 3 其他 | 0/1 加/减 |
| 10 附加项 | 3 其他 | 0/1 加/减 |
| 11 预支工费 | 3 其他 | 0/1 加/减 |
| 12 运费 | 3 其他 | 0/1 加/减 |
| 13 上楼费 | 3 其他 | 0/1 加/减 |
| 14 工人维修款 | 3 其他 | 0/1 加/减 |


##### `查询` pageWorkerSalary

分页方式获取工人工费信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 工费信息列表 , 每条数据类型 `workerSalary`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "wsid": 1,
                "csid": 1,
                "orderId": "1601010001",
                "user": {
                    "currentName": "白雪",
                    "userId": "U0479",
                    "userName": "白雪",
                    ...
                },
                "creater": {
                    "currentName": "白雪",
                    "userId": "U0479",
                    "userName": "白雪",
                    ...
                },
                "createTime": "2016-01-01",
                "approver": {
                    "currentName": "白雪",
                    "userId": "U0479",
                    "userName": "白雪",
                    ...
                },
                "approveTime": "2016-01-01",
                "checker": {
                    "currentName": "白雪",
                    "userId": "U0479",
                    "userName": "白雪",
                    ...
                },
                "checkTime": "2016-01-01",
                "money": 100000,
                "deposit": 0,
                "salary": 100000,
                "type": 0,
                "onetype": 0,
                "twotype": 1,
                "count": 0,
                "status": 0,
                "isSend": 0,
                "isAppr": 0,
                "isCheck": 0,
                "comment": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageWorkerSalaryByUserId

分页方式获取工人工费信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

通过指定员工编号获取

**Requests:**

- `workerSalary.user.userId` (String): 员工编号

```json
{
    "workerSalary.user.userId": "U0409"
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 返工信息列表 , 每条数据类型 `workerSalary`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "wsid": 1,
                "csid": 1,
                "orderId": "1601010001",
                "user": {
                    "currentName": "白雪",
                    "userId": "U0479",
                    "userName": "白雪",
                    ...
                },
                "creater": {
                    "currentName": "白雪",
                    "userId": "U0479",
                    "userName": "白雪",
                    ...
                },
                "createTime": "2016-01-01",
                "approver": {
                    "currentName": "白雪",
                    "userId": "U0479",
                    "userName": "白雪",
                    ...
                },
                "approveTime": "2016-01-01",
                "checker": {
                    "currentName": "白雪",
                    "userId": "U0479",
                    "userName": "白雪",
                    ...
                },
                "checkTime": "2016-01-01",
                "money": 100000,
                "deposit": 0,
                "salary": 100000,
                "type": 0,
                "onetype": 0,
                "twotype": 1,
                "count": 0,
                "status": 0,
                "isSend": 0,
                "isAppr": 0,
                "isCheck": 0,
                "comment": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryWorkerSalary

获取工程对应工人的工费信息

**Requests:**

- `workerSalary.csid` (Long): 工程ID
- `workerSalary.user.userId` (String): 员工编号

```json
{
    "workerSalary.csid": 1,
    "workerSalary.user.userId": "U0409",
}
```

**Returns:**

- `workerSalarys` (List): 工人工费列表 , 每条数据类型 `workerSalary`

```json
{
    ...
    "workerSalarys": [
        {
            "wsid": 1,
            "csid": 1,
            "orderId": "1601010001",
            "user": {
                "currentName": "白雪",
                "userId": "U0479",
                "userName": "白雪",
                ...
            },
            "creater": {
                "currentName": "白雪",
                "userId": "U0479",
                "userName": "白雪",
                ...
            },
            "createTime": "2016-01-01",
            "approver": {
                "currentName": "白雪",
                "userId": "U0479",
                "userName": "白雪",
                ...
            },
            "approveTime": "2016-01-01",
            "checker": {
                "currentName": "白雪",
                "userId": "U0479",
                "userName": "白雪",
                ...
            },
            "checkTime": "2016-01-01",
            "money": 100000,
            "deposit": 0,
            "salary": 100000,
            "type": 0,
            "onetype": 0,
            "twotype": 1,
            "count": 0,
            "status": 0,
            "isSend": 0,
            "isAppr": 0,
            "isCheck": 0,
            "comment": ""
        }
    ],
    ...
}
```


##### `查询` queryWorkerSalaryByWsid

通过工人工费ID获取工费信息

**Requests:**

- `workerSalary.wsid` (Long): 工程ID

```json
{
    "workerSalary.wsid": 1
}
```

**Returns:**

- `workerSalary` (Object): 工人工费 , 类型 `workerSalary`

```json
{
    ...
    "workerSalary": {
        "wsid": 1,
        "csid": 1,
        "orderId": "1601010001",
        "user": {
            "currentName": "白雪",
            "userId": "U0479",
            "userName": "白雪",
            ...
        },
        "creater": {
            "currentName": "白雪",
            "userId": "U0479",
            "userName": "白雪",
            ...
        },
        "createTime": "2016-01-01",
        "approver": {
            "currentName": "白雪",
            "userId": "U0479",
            "userName": "白雪",
            ...
        },
        "approveTime": "2016-01-01",
        "checker": {
            "currentName": "白雪",
            "userId": "U0479",
            "userName": "白雪",
            ...
        },
        "checkTime": "2016-01-01",
        "money": 100000,
        "deposit": 0,
        "salary": 100000,
        "type": 0,
        "onetype": 0,
        "twotype": 1,
        "count": 0,
        "status": 0,
        "isSend": 0,
        "isAppr": 0,
        "isCheck": 0,
        "comment": ""
    },
    ...
}
```


##### `查询` collectWorkerDeposit

收取工人质保金

判断工人对应的帐户信息是否存在 , 不存在 , 错误信息 **280004 工人帐户不存在**

工费类型限定为: 类型为加类(0) , 一类为其他(3) , 二类为质保金(6)

**Requests:**

- `workerSalary.user.userId` (String): 员工编号
- `workerSalary.money` (Long): 操作金额
- `workerSalary.comment` (String): 备注

```json
{
    "workerSalary.user.userId": "U0409",
    "workerSalary.money": 500000,
    "workerSalary.comment": ""
}
```


##### `查询` drawWorkerDeposit

提现工人质保金

判断工人对应的帐户信息是否存在 , 不存在 , 错误信息 **280004 工人帐户不存在**

工人帐户中质保金金额不足 , 错误信息 **280005 质保金金额不足**

工费类型限定为: 类型为减类(1) , 一类为其他(3) , 二类为质保金(6)

**Requests:**

- `workerSalary.user.userId` (String): 员工编号
- `workerSalary.money` (Long): 操作金额
- `workerSalary.comment` (String): 备注

```json
{
    "workerSalary.user.userId": "U0409",
    "workerSalary.money": 500000,
    "workerSalary.comment": ""
}
```


##### `查询` addWorkerSalary

添加工人工费

判断工程环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**

判断工程环节状态为1(开工) , 其他状态 , 错误信息 **120025 工程环节不可操作**

判断工程环节状态是否为2(完工) , 未完工不可添加 , 错误信息 **120027 工程环节未完工**

判断工人对应的帐户信息是否存在 , 不存在 , 错误信息 **280004 工人帐户不存在**

工费类型限定为: 类型为加类(0) , 一类为工费(0) , 二类为工费/增项/油工一级奖励(1/2/3)

根据工人工费对应账户中质保金和工费更新工费中对应的金额

**Requests:**

- `workerSalary.user.userId` (String): 员工编号
- `workerSalary.orderId` (String): 装修单号
- `workerSalary.csid` (Long): 工程ID
- `workerSalary.money` (Long): 操作金额
- `workerSalary.twotype` (Short): 二类
- `workerSalary.comment` (String): 备注

```json
{
    "workerSalary.user.userId": "U0409",
    "workerSalary.orderId": 1601010001,
    "workerSalary.csid": 1,
    "workerSalary.money": 500000,
    "workerSalary.twotype": 1,
    "workerSalary.comment": ""
}
```


##### `查询` cutWorkerSalary

扣款工人工费

判断工人对应的帐户信息是否存在 , 不存在 , 错误信息 **280004 工人帐户不存在**

工人帐户中质保金金额不足 , 错误信息 **280005 质保金金额不足**

工费类型限定为: 类型为减类(0) , 一类为扣/罚(1) , 二类为罚款(5)

根据工人工费对应账户中质保金和工费更新工费中对应的金额

**Requests:**

- `workerSalary.user.userId` (String): 员工编号
- `workerSalary.orderId` (String): 装修单号
- `workerSalary.csid` (Long): 工程ID
- `workerSalary.money` (Long): 操作金额
- `workerSalary.twotype` (Short): 二类
- `workerSalary.comment` (String): 备注

```json
{
    "workerSalary.user.userId": "U0409",
    "workerSalary.orderId": 1601010001,
    "workerSalary.csid": 1,
    "workerSalary.money": 500000,
    "workerSalary.twotype": 5,
    "workerSalary.comment": ""
}
```


##### `查询` tranWorkerSalary

转款工人工费

判断工人对应的帐户信息是否存在 , 不存在 , 错误信息 **280004 工人帐户不存在**

工人帐户中质保金金额不足 , 错误信息 **280005 质保金金额不足**

工费类型限定为: 一类为转款(2) , 二类为维修金(4)

根据工人工费对应账户中质保金和工费更新工费中对应的金额

根据工人工费信息生成两条工费数据 , 同时进行关联操作

**Requests:**

- `sourceId` (String): 员工编号
- `targetId` (String): 员工编号
- `workerSalary.orderId` (String): 装修单号
- `workerSalary.csid` (Long): 工程ID
- `workerSalary.money` (Long): 操作金额
- `workerSalary.twotype` (Short): 二类
- `workerSalary.comment` (String): 备注

```json
{
    "workerSalary.user.userId": "U0409",
    "workerSalary.orderId": 1601010001,
    "workerSalary.csid": 1,
    "workerSalary.money": 500000,
    "workerSalary.twotype": 1,
    "workerSalary.comment": ""
}
```


##### `查询` payWorkerSalary

发放工人工费

判断工人对应的帐户信息是否存在 , 不存在 , 错误信息 **280004 工人帐户不存在**

工人帐户中工费金额不足 , 错误信息 **280006 工费金额不足**

工费类型限定为: 类型为减类(1) , 一类为工费(0) , 二类为维修金(1)

**Requests:**

- `workerSalary.user.userId` (String): 员工编号
- `workerSalary.money` (Long): 操作金额
- `workerSalary.comment` (String): 备注

```json
{
    "workerSalary.user.userId": "U0409",
    "workerSalary.money": 500000,
    "workerSalary.comment": ""
}
```


##### `查询` adoptWorkerSalary

通过工人工费

判断工费信息是否存在 , 不存在 , 错误信息 **280001 薪资信息不存在**

判断工费状态是否为0(初始) , 非初始不能通过 , 错误信息 **280002 工费状态不可操作**

如果通过的工人工费存在关联工费信息 , 需要一同处理

**Requests:**


```json
{
    "workerSalarys[n].wsid": 1
}
```


##### `查询` rejectWorkerSalary

驳回

判断工费信息是否存在 , 不存在 , 错误信息 **280001 薪资信息不存在**

判断工费状态是否为1(通过) , 非初始不能驳回 , 错误信息 **280002 工费状态不可操作**

如果驳回的工人工费存在关联工费信息 , 需要一同处理 , 关联还原质保金

**Requests:**

- `workerSalary.wsid` (Long): 工费ID

```json
{
    "workerSalary.wsid": 1
}
```


##### `查询` checkWsorkerSalary

质检

判断工费信息是否存在 , 不存在 , 错误信息 **280001 薪资信息不存在**

判断质检状态是否为0(初始) , 其他状态 , 错误信息 **280002 工费状态不可操作**

**Requests:**

- `workerSalary.wsid` (Long): 工费ID

```json
{
    "workerSalary.wsid": 1
}
```


##### `查询` deleteWorkerSalary

删除工人工费信息

判断工费信息是否存在 , 不存在 , 错误信息 **280001 薪资信息不存在**

判断工费状态是否为0(初始) , 非初始不能删除 , 错误信息 **280002 工费状态不可操作**

操作工费状态置3(撤销)

如果通过的工人工费存在关联工费信息 , 需要一同处理

**Requests:**

- `workerSalary.wsid` (Long): 工费ID

```json
{
    "workerSalary.wsid": 1
}
```


##### `查询` batchWorkerSalary

批量发送工费

利用开始和结束时间作为范围 , 状态为1(通过) , 消息状态为0(初始)

**Requests:**

- `workerSalary.createTime` (Timestamp): 开始时间
- `workerSalary.endTime` (Timestamp): 结束时间

```json
{
    "workerSalary.createTime": "2016-01-01 00:00:00",
    "workerSalary.endTime": "2016-01-01 23: 59:59"
}
```


##### `查询` sendWorkerSalary

发送工费

判断工费信息是否存在 , 不存在 , 错误信息 **280001 薪资信息不存在**

判断工费状态是否为0(初始) , 其他状态 , 错误信息 **280002 工费状态不可操作**

**Requests:**

- `workerSalary.wsid` (Long): 工费Id

```json
{
    "workerSalary.wsid": 1
}
```


##### `查询` cancelWorkerSalary

取消发送工费

判断工费信息是否存在 , 不存在 , 错误信息 **280001 薪资信息不存在**

判断工费状态是否为1(待发) , 其他状态 , 错误信息 **280002 工费状态不可操作**

**Requests:**

- `workerSalary.wsid` (Long): 工费Id

```json
{
    "workerSalary.wsid": 1
}
```

## 设计师薪资


> **类**: `api.salary.DesignerSalaryAction`


#### 数据类型: `designerSalary`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dsid` | ID | Long |


##### `查询` pageDesignerSalary


##### `查询` addDesignerSalary


##### `查询` updateDesignerSalary


##### `查询` adoptDesignerSalary


##### `查询` rejectDesignerSalary


##### `查询` deleteDesignerSalary

## 图片


图片信息管理 , 提供如楼盘图片等资源


> **类**: `api.salary.SalaryDrawingAction`


#### 数据类型: `salaryDrawing`

| 参数 | 说明 | 类型 |
|------|------|------|
| `sdid` | 图片ID | Long |
| `sid` | 关联ID | Long |
| `name` | 名称 | String |
| `drawingUrl` | 图片路径 | String |
| `drawingType` | 图片类型 , 0: 本地 , 1: 钉钉 | Short |
| `type` | 类型 , 0: 工费 | Short |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `status` | 状态 , 0: 有效 , 1: 无效 | Short |


##### `查询` querySalaryDrawing

通过关联ID以及类型获取图片信息

**Requests:**

- `salaryDrawing.sid` (Long): 关联ID
- `salaryDrawing.type` (Short): 类型

```json
{
    "salaryDrawing.sid": 1,
    "salaryDrawing.type": 0
}
```

**Returns:**

- `salaryDrawings` (List): 图片信息列表 , 每条数据类型 `salaryDrawing`

```json
{
    ...
    "salaryDrawings": [
        {
            "sdid": 1,
            "sid": 1,
            "name": "SDFK4DFS4D5",
            "drawingUrl": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png",
            "drawingType": 0,
            "type": 0,
            "creater": {
                "uid": 1,
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师" 
            },
            "createTime": "2016-01-01"
        }
    ],
    ...
}
```


##### `创建` addSalaryDrawing

添加图片信息

**Requests:**

- `salaryDrawing.sid` (Long): 关联ID
- `salaryDrawing.name` (String): 名称
- `salaryDrawing.drawingUrl` (String): 路径
- `salaryDrawing.drawingType` (Short): 图片类型
- `salaryDrawing.type` (Short): 类型

```json
{
    "salaryDrawing.sid": 1,
    "salaryDrawing.name": "name.jpg",
    "salaryDrawing.drawingUrl": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png",
    "salaryDrawing.drawingType": 0,
    "salaryDrawing.type": 0
}
```


##### `创建` deleteSalaryDrawing

删除图片信息

**Requests:**

- `salaryDrawing.sdid` (Long): 图片ID

```json
{
    "salaryDrawing.sdid": 1
}
```
