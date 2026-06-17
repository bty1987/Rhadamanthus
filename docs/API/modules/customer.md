# 客户


## 客户


客户信息管理


> **类**: `api.communion.CustomerAction`


#### 数据类型: `customer`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cid` | 客户ID | Long |
| `no` | 客户编号 | String |
| `name` | 客户名称 | String |
| `pinyinAll` | 客户名称拼音 | String |
| `pinyinAB` | 客户名称拼音缩写 | String |
| `gender` | 性别 | String |
| `identity` | 身份证 | String |
| `officer` | 军官证 | String |
| `passport` | 护照 | String |
| `passhkm` | 港澳通行证 | String |
| `qq` | QQ | String |
| `wechat` | 微信 | String |
| `email` | 邮件 | String |
| `career` | 职业 | String |
| `address` | 地址 | String |
| `relationshipType` | 客户关系 , 普通客户 , 企业高端客户 , 企业关系客户 , 领导关系客户 , 员工关系客户 | String |
| `type` | 类型 , 0: 个人 , 1: 公司 | Short |
| `photoPath` | 照片 | String |
| `identityPathF` | 身份证正面 | String |
| `identityPathB` | 身份证背面 | String |
| `status` | 状态 , 包括: 0(有效) , 1(认证) , 2(本地认证) | Short |
| `companyNo` | 编号 , 统一社会信用代码 | String |
| `companyName` | 公司名 | String |
| `companyAddr` | 公司地址 | String |
| `companyPhone` | 公司电话 | String |
| `companyBank` | 开户行 | String |
| `companyBankno` | 开户账号 | String |
| `phones` | 电话 , 每条数据 `customerPhone` | List |


#### 数据类型: `customerPhone`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cpid` | 客户电话ID | Long |
| `cid` | 客户ID | Long |
| `phone` | 电话 | String |
| `status` | 状态 , 0(启用), 1(禁用) | Short |
| `defaults` | 默认 , 0(非默认) , 1(默认) | Short |


#### 数据类型: `keyValue`

| 参数 | 说明 | 类型 |
|------|------|------|
| `key` | 键 | String |
| `value` | 值 | String |


:param name: 客户名称
:type name: String
:param customerPhone: 客户电话
:type customerPhone: String
:param relationshipType: 客户关系
:type relationshipType: String


##### `查询` pageCustomer

分页方式获取客户信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 客户信息列表 , 每条数据类型 `customer`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "cid": 1,
                "no": "1501010001",
                "name": "李",
                "gender": "男",
                "identity": "",
                "officer": "",
                "passport": "",
                "passhkm": "",
                "qq": "111",
                "wechat": "333",
                "email": "111@qq.com",
                "career": "",
                "address": "",
                "relationshipType": "企业高端客户",
                "type": "0",
                "companyNo": "",
                "companyName": "",
                "companyAddr": "",
                "companyPhone": "",
                "companyBank": "",
                "companyBankno": "",
                "phones": [
                    {
                        "cpid": 1,
                        "cid": 1,
                        "phone": 137xxxx1876
                    }
                ]
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryCustomerById

通过客户编号获取客户信息

**Requests:**

- `customer.id` (String): 客户ID

```json
{
    "customer.id": 1
}
```

**Returns:**

- `customer` (object): 客户信息 , 类型 `customer`

```json
{
    ...
    "customer": {
        "cid": 1,
        "no": "1501010001",
        "name": "李",
        "gender": "男",
        "identity": "",
        "officer": "",
        "passport": "",
        "passhkm": "",
        "qq": "111",
        "wechat": "333",
        "email": "111@qq.com",
        "career": "",
        "address": "",
        "relationshipType": "企业高端客户",
        "type": "0",
        "companyNo": "",
        "companyName": "",
        "companyAddr": "",
        "companyPhone": "",
        "companyBank": "",
        "companyBankno": "",
        "phones": [
            {
                "cpid": 1,
                "cid": 1,
                "phone": 137xxxx1876
            }
        ]
    },
    ...
}
```


##### `查询` queryCustomerForName

通过拼音获取客户名信息

**Requests:**

- `pinyinName` (String): 楼盘名拼音

```json
{
    "pinyinName": "li"
}
```

**Returns:**

- `customers` (List): 客户信息列表 , 每条数据类型 `customer`
- `autoFillList` (List): 客户名列表 , 每条数据类型String

```json
{
    ...
    "customers": [
        {
            "cid": 1,
            "no": "1501010001",
            "name": "李",
            "address": "",
            "gender": "男",
            "identity": "",
            "officer": "",
            "passport": "",
            "passhkm": "",
            "qq": "111",
            "wechat": "333",
            "email": "111@qq.com",
            "career": "",
            "address": "",
            "relationshipType": "企业高端客户",
            "type": "0",
            "companyNo": "",
            "companyName": "",
            "companyAddr": "",
            "companyPhone": "",
            "companyBank": "",
            "companyBankno": "",
            "phones": [
                {
                    "cpid": 1,
                    "cid": 1,
                    "phone": 137xxxx1876
                }
            ]
        }
    ],
    "autoFillList": [
        "李"
    ],
    ...
}
```


##### `查询` queryCustomerForPhone

通过电话信息查询客户

**Requests:**

- `customerPhone.cid` (Long): 客户ID

```json
{
    "customerPhone.cid": 1
}
```

**Returns:**

- `customer` (List): 客户信息 , 类型 `customer`

```json
{
    ...
    "customer": {
        "cid": 1,
        "no": "1501010001",
        "name": "李",
        "address": "",
        "gender": "男",
        "identity": "",
        "officer": "",
        "passport": "",
        "passhkm": "",
        "phone": "138****9457"
        "qq": "111",
        "wechat": "333",
        "email": "111@qq.com",
        "career": "",
        "address": "",
        "relationshipType": "企业高端客户",
        "type": "0",
        "companyNo": "",
        "companyName": "",
        "companyAddr": "",
        "companyPhone": "",
        "companyBank": "",
        "companyBankno": ""
    }
}
```


##### `查询` queryCustomerPhoneByCid

通过客户ID获取对应的客户电话

**Requests:**

- `customer.cid` (Long): 客户ID

```json
{
    "customer.cid": 1
}
```

**Returns:**

- `customerPhones` (List): 客户电话信息列表 , 每条数据类型 `customerPhone`

```json
{
    ...
    "customerPhones": [
        {
            "cpid": 1,
            "cid": 1,
            "phone": "137xxxx1876",
        }
    ],
    ...
```


##### `查询` checkCustomerForPhone

检查客户电话信息

**Requests:**

- `customer.phone` (String): 客户电话

```json
{
    "customer.phone": "136xxxx5452"
}
```

**Returns:**

- `customers` (List): 客户信息列表 , 每条数据类型 `customer`

```json
{
    ...
    "customers": [
        {
            "cid": 1,
            "no": "1501010001",
            "name": "李",
            "address": "",
            "gender": "男",
            "identity": "",
            "officer": "",
            "passport": "",
            "passhkm": "",
            "qq": "111",
            "wechat": "333",
            "email": "111@qq.com",
            "career": "",
            "address": "",
            "relationshipType": "企业高端客户",
            "type": "0",
            "companyNo": "",
            "companyName": "",
            "companyAddr": "",
            "companyPhone": "",
            "companyBank": "",
            "companyBankno": "",
            "phones": [
                {
                    "cpid": 1,
                    "cid": 1,
                    "phone": 137xxxx1876
                }
            ]
        }
    ],
    ...
}
```


##### `创建` addCustomer

添加客户信息

**Requests:**

- `customer.name` (String): 客户名称
- `customer.gender` (String): 性别
- `customer.identity` (String): 身份证
- `customer.officer` (String): 军官证
- `customer.passport` (String): 护照
- `customer.passhkm` (String): 港澳通行证
- `customer.qq` (String): QQ
- `customer.wechat` (String): 微信
- `customer.email` (String): 邮件
- `customer.career` (String): 职业
- `customer.address` (String): 地址
- `customer.relationshipType` (String): 客户关系
- `customer.type` (Short): 类型
- `customer.companyNo` (String): 公司编号
- `customer.companyName` (String): 公司名
- `customer.companyAddr` (String): 公司地址
- `customer.companyPhone` (String): 公司电话
- `customer.companyBank` (String): 开户行
- `customer.companyBankno` (String): 开户编号

```json
{
    "customer.name": "李",
    "customer.gender": "男",
    "customer.identity": "",
    "customer.officer": "",
    "customer.passport": "",
    "customer.passhkm": "",
    "customer.qq": "111",
    "customer.wechat": "333",
    "customer.email": "111@qq.com",
    "customer.relationshipType": "标准客户",
    "customer.career": "",
    "customer.address": "",
    "customer.type": 0,
    "customer.companyNo": "",
    "customer.companyName": "",
    "customer.companyAddr": "",
    "customer.companyPhone": "",
    "customer.companyBank": "",
    "customer.companyBankno": ""
}
```


##### `创建` existCustomer

通过电话判断客户是否存在 , 不存在添加 , 存在返回客户信息

**Requests:**

- `customer.name` (String): 客户名称
- `customer.gender` (String): 性别
- `customer.phone` (String): 电话
**Returns:**

- `customer` (Object): 客户信息 , 类型 `customer`

```json
{
    ...
    "customer": {
        "cid": 1,
        "no": "1501010001",
        "name": "李",
        "address": "",
        "gender": "男",
        "identity": "",
        "officer": "",
        "passport": "",
        "qq": "111",
        "wechat": "333",
        "email": "111@qq.com",
        "relationshipType": "企业高端客户",
        "phone": 137xxxx1876
    }
    ...
}
```


##### `创建` addCustomerPhone

添加客户电话信息

**Requests:**

- `customer.cid` (Long): 客户ID
- `customerPhone.phone` (String): 电话

```json
{
    "customer.cid": 1,
    "customerPhone.phone": "153xxxx2938"
}
```


##### `创建` updateCustomer

更新客户信息

**Requests:**

- `customer.no` (String): 客户编号
- `customer.name` (String): 客户名称
- `customer.gender` (String): 性别
- `customer.identity` (String): 身份证
- `customer.officer` (String): 军官证
- `customer.passport` (String): 护照
- `customer.passhkm` (String): 港澳通行证
- `customer.qq` (String): QQ
- `customer.wechat` (String): 微信
- `customer.email` (String): 邮件
- `customer.career` (String): 职业
- `customer.address` (String): 地址
- `customer.relationshipType` (String): 客户关系
- `customer.type` (Short): 类型
- `customer.companyNo` (String): 公司编号
- `customer.companyName` (String): 公司名
- `customer.companyAddr` (String): 公司地址
- `customer.companyPhone` (String): 公司电话
- `customer.companyBank` (String): 开户行
- `customer.companyBankno` (String): 开户编号

```json
{
    "customer.no": "1501010001",
    "customer.name": "李",
    "customer.gender": "男",
    "customer.identity": "",
    "customer.officer": "",
    "customer.passport": "",
    "customer.passhkm": "",
    "customer.qq": "111",
    "customer.wechat": "333",
    "customer.email": "111@qq.com",
    "customer.career": "",
    "customer.address": "",
    "customer.relationshipType": "标准客户",
    "customer.type": 0,
    "customer.companyNo": "",
    "customer.companyName": "",
    "customer.companyAddr": "",
    "customer.companyPhone": "",
    "customer.companyBank": "",
    "customer.companyBankno": ""
}
```


##### `创建` updateCustomerForBase

更新客户信息

**Requests:**

- `customer.cid` (String): 客户ID
- `customer.companyNo` (String): 公司编号
- `customer.companyName` (String): 公司名
- `customer.companyAddr` (String): 公司地址
- `customer.companyPhone` (String): 公司电话
- `customer.companyBank` (String): 开户行
- `customer.companyBankno` (String): 开户编号

```json
{
    "customer.cid": "1501010001",
    "customer.companyNo": "",
    "customer.companyName": "",
    "customer.companyAddr": "",
    "customer.companyPhone": "",
    "customer.companyBank": "",
    "customer.companyBankno": ""
}
```


##### `创建` updateCustomerPhoneForStatus

更新客户电话状态

判断客户电话是否存在 , 不存在 , 错误信息 **130021 客户电话不存在**

**Requests:**

- `customerPhone.cpid` (Long): 客户电话ID
- `customerPhone.status` (Short): 状态

```json
{
    "customerPhone.cpid": 1,
    "customerPhone.status": 1
}
```


##### `创建` updateCustomerPhoneForDefault

更新客户电话默认状态

判断客户电话是否存在 , 不存在 , 错误信息 **130021 客户电话不存在**

判断更新客户电话是否已经存在同时标识为默认电话 , 错误信息 **130022 客户电话已使用**

判断客户电话状态 , 未启用不可设置为默认 , 错误信息 **130023 客户电话未启用**

**Requests:**

- `customerPhone.cpid` (Long): 客户电话ID
- `customerPhone.defaults` (Short): 默认

```json
{
    "customerPhone.cpid": 1,
    "customerPhone.defaults": 1
}
```


##### `创建` registCustomer

注册客户

判断客户是否存在 , 不存在 , 错误信息 **130002 客户信息不存在**

判断客户状态是否为0(初始) , 其他状态 , 错误信息 **130028 客户状态不可操作**

**Requests:**

- `customer.cid` (Long): 客户ID

```json
{
    "customer.cid": 1
}
```


##### `创建` authCustomer

认证客户

通过第三方接口获取认证地址

客户存储认证地址 , 如果不存在 , 更新客户对应的认证地址

判断客户是否存在 , 不存在 , 错误信息 **130002 客户信息不存在**

判断客户状态是否为0(初始) , 其他状态 , 错误信息 **130028 客户状态不可操作**

**Requests:**

- `customer.cid` (Long): 客户ID

```json
{
    "customer.cid": 1
}
```


##### `创建` confirmCustomer

确认客户

通过第三方接口更新客户的真实信息

判断客户是否存在 , 不存在 , 错误信息 **130002 客户信息不存在**

判断客户状态是否为0(初始) , 其他状态 , 错误信息 **130028 客户状态不可操作**

更新客户信息 , 包括姓名/电话/性别/地址等

更新客户状态为1(认证)

**Requests:**

- `customer.cid` (Long): 客户ID

```json
{
    "customer.cid": 1
}
```


##### `创建` signateCustomer

客户签名

通过第三方接口更新客户签名信息

判断客户是否存在 , 不存在 , 错误信息 **130002 客户信息不存在**

**Requests:**

- `customer.cid` (Long): 客户ID

```json
{
    "customer.cid": 1
}
```


##### `创建` resetCustomer

客户重置

判断客户是否存在 , 不存在 , 错误信息 **130002 客户信息不存在**

判断客户状态是否为0(初始) , 其他状态 , 错误信息 **130028 客户状态不可操作**

**Requests:**

- `customer.cid` (Long): 客户ID

```json
{
    "customer.cid": 1
}
```

## 记录


客户信息管理


> **类**: `api.communion.CustomerRecordAction`


#### 数据类型: `customerRecord`

| 参数 | 说明 | 类型 |
|------|------|------|
| `crid` | 记录ID | Long |
| `cid` | 客户 | Long |
| `ouid` | 操作人 | Long |
| `operateTime` | 操作时间 | Timestamp |
| `type` | 类型 , 0: 电话查询 | Short |
| `comment` | 说明 | String |


##### `查询` pageCustomerRecord

分页方式获取客户记录信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 客户记录列表 , 每条数据类型 `customerRecord`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "crid": 1,
                "cid": 1,
                "ouid": 1,
                "operateTime": "2016-01-01 00:00:00",
                "type": 0,
                "comment": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询/创建` queryCustomerRecord

通过客户ID查询记录信息

**Requests:**

- `customerRecord.cid` (Long): 客户ID

```json
{
    "customerRecord.cid": 1
}
```

**Returns:**

- `customerRecords` (List): 客户记录信息列表 , 每条数据类型 `customerRecord`

```json
{
    "customerRecords": [
        {
            "crid": 1,
            "cid": 1,
            "ouid": 1,
            "operateTime": "2016-01-01 00:00:00",
            "type": 0,
            "comment": ""
        } 
    ]
}
```

## 积分


> **类**: `api.customer.PointAccountAction`


#### 数据类型: `pointAccount`

| 参数 | 说明 | 类型 |
|------|------|------|
| `accountId` | 积分ID | Long |
| `cid` | 客户ID | Long |
| `decorationPoint` | 装修积分 | Long |
| `materialPoint` | 销售积分 | Long |
| `company` | 公司 | Integer |


#### 数据类型: `pointRecord`

| 参数 | 说明 | 类型 |
|------|------|------|
| `recordId` | 记录ID | Long |
| `cid` | 客户ID | Long |
| `accountId` | 积分ID | Long |
| `type` | 类型 , 0: 累计 , 1: 消耗 | Short |
| `pointType` | 积分类型 , 0: 装修 , 1: 销售 | Short |
| `balance` | 剩余积分 | Long |
| `point` | 积分 | Long |
| `operater` | 操作人, 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `operateTime` | 操作时间 | Timestamp |


##### `查询` queryPointAccount

获取客户积分信息

**Requests:**

- `pointAccount.accountId` (Long): 客户ID

```json
{
    "pointAccount.accountId": 1
}
```

**Returns:**

- `pointAccount` (Object): 积分信息 , 类型 `pointAccount`

```json
{
    "pointAccount": {
        "accountId": 1,
        "cid": 1,
        "decorationPoint": 0,
        "materialPoint": 0
    }
}
```


##### `查询` queryPointRecord

获取客户积分记录

**Requests:**

- `pointAccount.accountId` (Long): 客户ID

```json
{
    "pointAccount.accountId": 1
}
```

**Returns:**

- `pointRecords` (List): 积分记录信息列表 , 每条数据类型 `pointRecord`

```json
{
    "pointRecords": [
        {
            "recordId": 1,
            "cid": 1,
            "accountId": 1,
            "type": 0,
            "pointType": 0,
            "balance": 1000,
            "point": 1000,
            "operater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "operateTime": "2016-01-01 00:00:00"
        } 
    ]
}
```


##### `查询` createPointAccount

添加客户积分

判断客户积分是否存在 , 已存在 , 错误信息 **330048 积分已存在**

**Requests:**

- `pointAccount.accountId` (Long): 客户ID

```json
{
    "pointAccount.accountId": 1
}
```


##### `查询` grantPoint

累计客户积分

判断客户积分是否存在 , 不存在 , 错误信息 **330047 积分不存在**

生成客户积分记录

**Requests:**

- `pointAccount.accountId` (Long): 客户ID
- `pointAccount.decorationPoint` (Long): 装修积分
- `pointAccount.materialPoint` (Long): 销售积分

```json
{
    "pointAccount.accountId": 1,
    "pointAccount.materialPoint": 1000
}
```


##### `查询` consumePoint

消耗客户积分

判断客户积分是否存在 , 不存在 , 错误信息 **330047 积分不存在**

判断客户积分是否满足操作积分 , 积分不足 , 错误信息 **330049 积分不足**

生成客户积分记录

**Requests:**

- `pointAccount.accountId` (Long): 客户ID
- `pointAccount.decorationPoint` (Long): 装修积分
- `pointAccount.materialPoint` (Long): 销售积分

```json
{
    "pointAccount.accountId": 1,
    "pointAccount.decorationPoint": 1000
}
```

## 画像


> **类**: `api.customer.CustomerProfileAction`


#### 数据类型: `customerProfile`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cpid` | 画像ID | Long |
| `tid` | 模版ID | Long |
| `cid` | 客户ID | Long |
| `orderId` | 装修单号 | String |
| `name` | 名称 | String |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `status` | 状态 , 0: 初始 | Short |
| `company` | 公司 | Integer |
| `items` | 项目列表 , 每条数据类型 [customerProfileItem ](./customer.html#api.customer.CustomerProfileAction.customerProfileItem) | List |


#### 数据类型: `customerProfileItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cpiid` | 项目ID | Long |
| `cpid` | 调研ID | Long |
| `name` | 名称 | String |
| `type` | 类型 , 0: 文本 , 1: 输入框 , 2: 单选 , 3: 多选 | Short |
| `content` | 内容 | String |
| `options` | 选项列表 , 每条数据类型 [customerProfileOption ](./customer.html#api.customer.CustomerProfileAction.customerProfileOption) |  |


#### 数据类型: `customerProfileOption`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cpoid` | 选项ID | Long |
| `cpiid` | 项目ID | Long |
| `cpid` | 调研ID | Long |
| `title` | 标题 | String |
| `checked` | 标识 , 0: 已选 , 1: 未选 | Short |


##### `查询` pageCustomerProfile

分页方式获取客户画像信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 调研列表 , 每条数据类型 `customerProfile`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "cpid": 1,
                "tid": 1,
                "name": "模版",
                "cid": 1,
                "orderId": "1601010001",
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "createTime": "2016-01-01 00:00:00",
                "status": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryCustomerProfileByOrderId

通过装修单号获取客户画像信息

**Requests:**

- `customerProfile.orderId` (String): 装修单号

```json
{
    "customerProfile.orderId": "1601010001"
}
```

**Returns:**

- `customerProfile` (Object): 客户画像 , 类型 `customerProfile`

```json
{
    ...
    "surveys": {
        "cpid": 1,
        "tid": 1,
        "name": "模版",
        "cid": 1,
        "orderId": "1601010001",
        "creater": {
            "uid": 1,
            "userId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师"
        },
        "createTime": "2016-01-01 00:00:00",
        "status": 0
    }
    ...
}
```


##### `查询` queryCustomerProfileByCpid

通过客户画像ID获取信息

**Requests:**

- `customerProfile.cpid` (Long): 调研ID

```json
{
    "customerProfile.cpid": 1
}
```

**Returns:**

- `customerProfile` (Object): 客户画像 , 数据类型 `customerProfile`

```json
{
    ...
    "customerProfile": {
        "cpid": 1,
        "tid": 1,
        "name": "模版",
        "cid": 1,
        "orderId": "1601010001",
        "creater": {
            "uid": 1,
            "userId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师"
        },
        "createTime": "2016-01-01 00:00:00",
        "status": 0,
        "items": [
            {
                "cpiid": 1,
                "cpid": 1,
                "name": "项目",
                "type": 0,
                "content": "内容",
            },
            {
                "cpiid": 1,
                "cpid": 1,
                "name": "项目",
                "type": 2,
                "content": "内容",
                "options": [
                    {
                        "cpoid": 1,
                        "cpiid": 1,
                        "cpid": 1,
                        "title": "选项",
                        "checked": 0
                    }
                ]
            }
        ]
    }
    ...
}
```


##### `查询` makeCustomerProfile

生成客户画像

判断模版是否存在 , 不存在 , 错误信息 **130096 模版不存在**

**Requests:**

- `customerProfile.cid` (Long): 客户ID
- `customerProfile.orderId` (String): 装修单号
- `customerProfile.tid` (Long): 模版ID

```json
{
    "customerProfile.cid": 1,
    "customerProfile.orderId": "1601010001",
    "customerProfile.tid": 1
}
```


##### `查询` handleCustomerProfile

更新客户画像

判断客户画像是否存在 , 不存在 , 错误信息 **330087 客户画像不存在**

**Requests:**

- `customerProfile.cpid` (Long): 调研ID

```json
{
    "customerProfile.cpid": 1,

    "customerProfile.items[0].cpiid": 1,
    "customerProfile.items[0].content": "内容",

    "customerProfile.items[0].options[0].cpoid": 1,
    "customerProfile.items[0].options[0].checked": 1,
}
```

## 客源


### 部门规则


业务部门规则配置信息


> **类**: `api.customer.CustomerDeptRuleAction`


#### 数据类型: `customerDeptRule`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cdrid` | 规则ID | Long |
| `name` | 名称 | String |
| `did` | 部门ID | Long |
| `type` | 类型 , 0: 公司 , 1: 分区 , 2: 部门 | Short |
| `atttype` | 业务类型 , 0: 自动 , 1: 人员 , 2: 部门 , 3: 分区 | Short |
| `busitype` | 业务类型 | Long |
| `focus` | 聚焦类型 , 0: 通用 , 1: 面积 , 2: 部门 | Short |
| `creater` | 创建人 , 类型 [user ](./user.html#api.data.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `company` | 公司 | Integer |


##### `查询` pageCustomerDeptRule

分页方式获取客户部门规则信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 客户人员规则信息列表 , 每条数据类型 `customerDeptRule`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "cdrid": 1,
                "name": "",
                "did": 1,
                "type": 1,
                "atttype": 0,
                "busitype": 1,
                "focus": 0,
                "creater": {
                    "uid": 1,
                    "userId": "U0001",
                    "currentName": "白雪",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "createTime": "2016-01-01"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryCustomerDeptRule

通过部门ID获取部门规则

**Requests:**

- `customerDeptRule.did` (Long): 部门ID
- `customerDeptRule.type` (Short): 类型

```json
{
    "customerDeptRule.did": 1,
    "customerDeptRule.type": 1
}
```

**Returns:**

- `customerDeptRules` (List): 客户人员规则信息列表 , 每条数据类型 `customerDeptRule`

```json
{
    ...
    "customerDeptRules": [
        {
            "cdrid": 1,
            "name": "",
            "did": 1,
            "type": 1,
            "atttype": 0,
            "busitype": 1,
            "focus": 0,
            "creater": {
                "uid": 1,
                "userId": "U0001",
                "currentName": "白雪",
                "phone": "135xxxx1918",
                "userPhoto": ""
            },
            "createTime": "2016-01-01"
        }
    ],
    ...
}
```


##### `查询` addCustomerDeptRule

添加客户部门规则

**Requests:**

- `customerDeptRule.did` (Long): 部门ID
- `customerDeptRule.type` (Short): 类型
- `customerDeptRule.atttype` (Short): 业务类型
- `customerDeptRule.busitype.bdid` (Long): 业务类型ID
- `customerDeptRule.focus` (Short): 聚焦类型

```json
{
    "customerDeptRule.did": 1,
    "customerDeptRule.type": 0,
    "customerDeptRule.atttype": 0,
    "customerDeptRule.busitype.bdid": 0,
    "customerDeptRule.focus": 0
}
```


##### `查询` deleteCustomerDeptRule

删除部门规则

**Requests:**

- `customerDeptRule.cdrid` (Long): 部门ID

```json
{
    "customerDeptRule.cdrid": 1
}
```

### 人员规则


设计人员规则配置信息


> **类**: `api.customer.CustomerUserRuleAction`


#### 数据类型: `customerUserRule`

| 参数 | 说明 | 类型 |
|------|------|------|
| `curid` | 规则ID | Long |
| `user` | 人员 , 类型 [user ](./user.html#api.data.UserAction.user) | Object |
| `period` | 周期 | 周期 |
| `measureNum` | 量尺数 | Integer |
| `contractNum` | 签单数 | Integer |
| `contractPrice` | 签单额 | Integer |
| `predisPrice` | 折前额 | Integer |
| `materialPrice` | 主材额 | Integer |
| `designPrice` | 设计费 | Integer |
| `score` | 得分 | Integer |
| `rank` | 排名 | Integer |
| `chance` | 机会数 | Integer |
| `surplus` | 剩余数 | Integer |
| `polling` | 轮询数 | Integer |
| `creater` | 创建人 , 类型 [user ](./user.html#api.data.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `finishTime` | 结束时间 | Timestamp |
| `status` | 状态 , 0: 启用 , 1: 个人失效 , 2: 部门失效 , 3: 分区失效 , 4: 禁用 | Short |
| `company` | 公司 | Integer |


#### 数据类型: `customerUserRuleItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `curiid` | 规则项ID | Long |
| `curid` | 规则ID | Long |
| `name` | 名称 | String |
| `type` | 类型 , 0: 面积 , 1: 特殊 , 2: 部门 | Short |
| `uppval` | 起始值 | Integer |
| `lowval` | 终止值 | Integer |


##### `查询` pageCustomerUserRule

分页方式获取客户人员规则信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 客户人员规则信息列表 , 每条数据类型 `customerUserRule`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "curid": 1,
                "user": {
                    "uid": 1,
                    "userId": "U0001",
                    "currentName": "白雪",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "period": "201601",
                "measureNum": 0,
                "contractNum": 0,
                "contractPrice": 0,
                "predisPrice": 0,
                "materialPrice": 0,
                "designPrice": 0,
                "score": 0,
                "rank": 0,
                "chance": 0,
                "surplus": 0,
                "polling": 0,
                "creater": {
                    "uid": 1,
                    "userId": "U0001",
                    "currentName": "白雪",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "createTime": "2016-01-01",
                "finishTime": "2016-01-01",
                "status": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryCustomerUserRule

获取人员规则

**Requests:**

- `customerUserRule.user.uid` (Long): 人员ID

```json
{
    "customerUserRule.user.uid": 1
}
```

**Returns:**

- `customerUserRule` (Object): 人员规则

```json
{
    ...
    "customerUserRule": {
        "curid": 1,
        "user": {
            "uid": 1,
            "userId": "U0001",
            "currentName": "白雪",
            "phone": "135xxxx1918",
            "userPhoto": ""
        },
        "period": "201601",
        "measureNum": 0,
        "contractNum": 0,
        "contractPrice": 0,
        "predisPrice": 0,
        "materialPrice": 0,
        "designPrice": 0,
        "score": 0,
        "rank": 0,
        "chance": 0,
        "surplus": 0,
        "polling": 0,
        "creater": {
            "uid": 1,
            "userId": "U0001",
            "currentName": "白雪",
            "phone": "135xxxx1918",
            "userPhoto": ""
        },
        "createTime": "2016-01-01",
        "finishTime": "2016-01-01",
        "status": 0
    },
    ...
}
```


##### `查询` addCustomerUserRule

添加客户人员规则

**Requests:**

- `customerUserRule.user.uid` (Long): 人员ID
- `customerUserRule.period` (String): 周期
- `customerUserRule.measureNum` (Integer): 量尺数
- `customerUserRule.contractNum` (Integer): 签单数
- `customerUserRule.contractPrice` (Integer): 签单额
- `customerUserRule.predisPrice` (Integer): 折前额
- `customerUserRule.materialPrice` (Integer): 主材额
- `customerUserRule.designPrice` (Integer): 设计费

```json
{
    "customerUserRule.user.uid": 1,
    "customerUserRule.period": "201601",

    "customerUserRule.measureNum": 0,
    "customerUserRule.contractNum": 0,
    "customerUserRule.predisPrice": 0,
    "customerUserRule.contractPrice": 0,
    "customerUserRule.materialPrice": 0,
    "customerUserRule.designPrice": 0
}
```


##### `查询` updateCustomerUserRule

更新客户人员规则

**Requests:**

- `customerUserRule.curid` (Long): 规则ID
- `customerUserRule.user.uid` (Long): 人员ID
- `customerUserRule.period` (String): 周期
- `customerUserRule.measureNum` (Integer): 量尺数
- `customerUserRule.contractNum` (Integer): 签单数
- `customerUserRule.contractPrice` (Integer): 签单额
- `customerUserRule.predisPrice` (Integer): 折前额
- `customerUserRule.materialPrice` (Integer): 主材额
- `customerUserRule.designPrice` (Integer): 设计费

```json
{
    "customerUserRule.curid": 1,
    "customerUserRule.user.uid": 1,
    "customerUserRule.period": "201601",

    "customerUserRule.measureNum": 0,
    "customerUserRule.contractNum": 0,
    "customerUserRule.contractPrice": 0,
    "customerUserRule.predisPrice": 0,
    "customerUserRule.materialPrice": 0,
    "customerUserRule.designPrice": 0
}
```


##### `查询` updateCustomerUserRuleForStatus

更新客户人员规则状态

**Requests:**

- `customerUserRule.curid` (Long): 规则ID
- `customerUserRule.status` (Short): 状态

```json
{
    "customerUserRule.curid": 1,
    "customerUserRule.status": 0
}
```


##### `查询` disableCustomerUserRule

禁用人员规则


##### `查询` queryCustomerUserRuleItem


##### `查询` addCustomerUserRuleItem


##### `查询` deleteCustomerUserRuleItem

### 保护规则


装修单转换保护规则配置信息


> **类**: `api.customer.CustomerProtectRuleAction`


#### 数据类型: `customerProtectRule`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cprid` | 规则ID | Long |
| `title` | 标题 | String |
| `type` | 类型 , 0: 面积 , 1: 预付 , 2: 设计 | Short |
| `uppval` | 上限数值 | Integer |
| `lowval` | 下限数值 | Integer |
| `days` | 天数 | Integer |
| `creater` | 创建人 , 类型 [user ](./user.html#api.data.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `status` | 状态 , 0: 有效 , 1: 失效 | Short |
| `company` | 公司 | Integer |


##### `查询` pageCustomerProtectRule

分页方式获取客户保护规则信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 客户保护规则信息列表 , 每条数据类型 `customerProtectRule`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "cprid": 1,
                "title": "标题",
                "type": 1,
                "uppval": 0,
                "lowval": 0,
                "days": 0,
                "creater": {
                    "uid": 1,
                    "userId": "U0001",
                    "currentName": "白雪",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "createTime": "2016-01-01",
                "status": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryCustomerProtectRule

获取客户保护规则

**Requests:**

- `customerProtectRule.type` (Short): 类型
- `customerProtectRule.uppval` (Integer): 数值
- `customerProtectRule.lowval` (Integer): 数值
- `customerProtectRule.days` (Integer): 天数

```json
{
    "customerProtectRule.type": 1,
    "customerProtectRule.uppval": 1,
    "customerProtectRule.lowval": 1,
    "customerProtectRule.days": 1
}
```

**Returns:**

- `customerProtectRules` (List): 客户保护规则信息列表 , 每条数据类型 `customerProtectRule`

```json
{
    ...
    "customerProtectRules": [
        {
            "cprid": 1,
            "title": "标题",
            "type": 1,
            "uppval": 0,
            "lowval": 0,
            "days": 0,
            "creater": {
                "uid": 1,
                "userId": "U0001",
                "currentName": "白雪",
                "phone": "135xxxx1918",
                "userPhoto": ""
            },
            "createTime": "2016-01-01",
            "status": 0
        }
    ],
    ...
}
```


##### `查询` addCustomerProtectRule

添加客户保护规则

**Requests:**

- `customerProtectRule.title` (String): 标题
- `customerProtectRule.type` (Short): 类型
- `customerProtectRule.uppval` (Integer): 数值
- `customerProtectRule.lowval` (Integer): 数值
- `customerProtectRule.days` (Integer): 天数

```json
{
    "customerProtectRule.title": "标题",
    "customerProtectRule.type": 0,
    "customerProtectRule.uppval": 0,
    "customerProtectRule.lowval": 0,
    "customerProtectRule.days": 0
}
```


##### `查询` deleteCustomerProtectRule

删除客户保护规则

**Requests:**

- `customerProtectRule.cprid` (Long): ID

```json
{
    "customerProtectRule.cprid": 1
}
```

### 公司规则


装修单分配公司规则配置信息


> **类**: `api.customer.CustomerCompanyRuleAction`


#### 数据类型: `customerCompanyRule`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ccrid` | 规则ID | Long |
| `company` | 公司 , 类型 [company ](./user.html#api.system.CompanyAction.company) | Object |
| `type` | 类型 , 0: 面积 , 1: 特殊 , 2: 部门 | Short |
| `uppval` | 起始值 | Integer |
| `lowval` | 终止值 | Integer |
| `companys` | 公司ID | Integer |


##### `查询` pageCustomerCompanytRule

分页方式获取客户公司规则信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 客户公司规则信息列表 , 每条数据类型 `customerCompanyRule`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "cprid": 1,
                "company": {
                    "cid": 1,
                    "name": "公司"
                },
                "type": 1,
                "uppval": 0,
                "lowval": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryCustomerCompanyRule

获取客户保护规则

**Requests:**

- `customerCompanyRule.uppval` (Short): 数值

```json
{
    "customerCompanyRule.type": 1,
    "customerCompanyRule.value": 1,
    "customerCompanyRule.days": 1
}
```

**Returns:**

- `customerCompanyRules` (List): 客户公司规则信息列表 , 每条数据类型 `customerCompanyRule`

```json
{
    ...
    "customerCompanyRules": [
        {
            "ccrid": 1,
            "company": {
                "cid": 1,
                "name": "公司"
            },
            "type": 1,
            "uppval": 0,
            "lowval": 0
        }
    ],
    ...
}
```


##### `查询` addCustomerCompanyRule

添加客户公司规则

**Requests:**

- `customerCompanyRule.company.no` (String): 编号
- `customerCompanyRule.type` (Short): 类型
- `customerCompanyRule.uppval` (Integer): 起始值
- `customerCompanyRule.lowval` (Integer): 终止值

```json
{
    "customerProtectRule.company.no": "SUSDONE09FUSEFU09ES",
    "customerProtectRule.type": 0,
    "customerProtectRule.value": 0,
    "customerProtectRule.days": 0
}
```


##### `查询` deleteCustomerCompanyRule

删除客户公司规则

**Requests:**

- `customerCompanyRule.ccrid` (Long): 规则ID

```json
{
    "customerCompanyRule.ccrid": 1
}
```

### 资源


> **类**: `api.customer.CustomerSourceAction`


#### 数据类型: `customerSource`

| 参数 | 说明 | 类型 |
|------|------|------|
| `csid` | 客资ID | Long |
| `name` | 姓名 | String |
| `gender` | 性别 | String |
| `phone` | 电话 | String |
| `customerType` | 客户类型 | Short |
| `demand` | 装修需求 | Short |
| `purpose` | 目的 | String |
| `intention` | 意向 | String |
| `price` | 需求价格 | String |
| `grade` | 客户等级 | String |
| `village` | 楼盘 , 类型 [village ](./data.html#api.data.VillageAction.village) | Object |
| `houseNumber` | 楼号 | String |
| `buildArea` | 建筑面积 | Integer |
| `buildArea` | 建筑面积 | Integer |
| `freeArea` | 赠送面积 | Integer |
| `innerArea` | 套内面积 | Integer |
| `totalArea` | 总面积 | Integer |
| `creater` | 创建人 , 类型 [user ](./user.html#api.data.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `company` | 公司 | Integer |
| `status` | 状态 , 0: 初始 , 1: 失效 , 2: 审批 , 3: 确认 , 4: 审批 , 5: 转换 | Short |
| `referOrderId` | 推荐单号 | String |
| `source` | 来源方 | String |
| `contact` | 对接人 | String |
| `comment` | 备注 | String |
| `designer` | 设计师 , 类型 [user ](./user.html#api.data.UserAction.user) | Object |
| `salesman` | 业务员 , 类型 [user ](./user.html#api.data.UserAction.user) | Object |
| `customer` | 客户 , 类型 [customer ](./data.html#api.data.CustomerAction.customer) | Object |
| `house` | 房产 , 类型 [house ](./data.html#api.data.HouseAction.house) | Object |
| `orderId` | 装修单号 | String |


##### `查询` pageCustomerSource

分页方式获取客户资源信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 客户资源列表 , 每条数据类型 `customerSource`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "csid": 1,
                "name": "李先生",
                "gender": "男",
                "phone": "136xxxx2345"
                "purpose": "婚房",
                "intention": "铁西区学区房",
                "price": "{'MAX':1200, 'MIN': 1000}",
                "grade": "A",
                "village": {
                    "vid": 1,
                    "no": "P001",
                    "name": "广场一期"
                },
                "houseNumber": "1#1-1-1",
                "buildArea": 100,
                "freeArea": 0,
                "innerArea": 0,
                "totalArea": 0,
                "createTime": "2016-01-01",
                "creater": {
                    "uid": 1,
                    "userId": "U0001",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "status": 0,
                "source": "",
                "contact": "",
                "referOrderId": "",
                "comment": "说明",

                "designer": null,
                "salesman": null,
                "customer": null,
                "house": null,
                "orderId": null
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryCustomerSource

通过客户机会ID获取信息

**Requests:**

- `customerSource.csid` (Long): 资源ID

```json
{
    "customerSource.csid": 1
}
```

**Returns:**

- `customerSource` (Object): 客户机会
- `paging.data` (List): 客户资源列表 , 每条数据类型 `customerSource`

```json
{
    ...
    "customerSource": {
        "csid": 1,
        "name": "李先生",
        "gender": "男",
        "phone": "136xxxx2345"
        "purpose": "婚房",
        "intention": "铁西区学区房",
        "price": "{'MAX':1200, 'MIN': 1000}",
        "grade": "A",
        "village": {
            "vid": 1,
            "no": "P001",
            "name": "广场一期"
        },
        "houseNumber": "1#1-1-1",
        "buildArea": 100,
        "freeArea": 0,
        "innerArea": 0,
        "totalArea": 0,
        "createTime": "2016-01-01",
        "creater": {
            "uid": 1,
            "userId": "U0001",
            "currentName": "白雪",
            "deptType": "行政",
            "duty": "财务",
            "phone": "135xxxx1918",
            "userPhoto": ""
        },
        "status": 0,
        "source": "",
        "contact": "",
        "referOrderId": "",
        "comment": "说明",

        "designer": null,
        "salesman": null,
        "customer": null,
        "house": null,
        "orderId": null,
        "referOrderId": ""
    },
    ...
}
```


##### `查询` addCustomerSource

添加客户资源

**Requests:**

- `customerSource.name` (String): 姓名
- `customerSource.gender` (String): 性别
- `customerSource.phone` (String): 电话
- `customerSource.purpose` (String): 目的
- `customerSource.intention` (String): 意向
- `customerSource.price` (String): 需求价格
- `customerSource.grade` (String): 客户等级
- `customerSource.village.vid` (Long): 楼盘ID
- `customerSource.houseNumber` (String): 楼号
- `customerSource.buildArea` (Float): 建筑面积
- `customerSource.freeArea` (Float): 赠送面积
- `customerSource.innerArea` (Float): 套内面积
- `customerSource.totalArea` (Float): 总面积
- `customerSource.source` (String): 来源方
- `customerSource.contact` (String): 对接方
- `customerSource.referOrderId` (String): 推荐单号
- `customerSource.comment` (String): 备注

```json
{
    "customerSource.name": "李先生",
    "customerSource.gender": "男",
    "customerSource.purpose": "婚房",
    "customerSource.intention": "铁西广场附近",
    "customerSource.grade": "A",

    "customerSource.busitype.dbid": 1,
    "customerSource.village.vid": 1,
    "customerSource.houseNumber": "1#1-1-1",
    "customerSource.buildArea": 100,
    "customerSource.freeArea": 0,
    "customerSource.innerArea": 0,
    "customerSource.totalArea": 0,

    "customerSource.source": "",
    "customerSource.contact": "",
    "customerSource.referOrderId": null,

    "customerSource.comment": "备注",
}
```


##### `查询` updateCustomerSource

更新客户资源

**Requests:**

- `customerSource.csid` (Long): 资源ID
- `customerSource.name` (String): 姓名
- `customerSource.gender` (String): 性别
- `customerSource.phone` (String): 电话
- `customerSource.purpose` (String): 目的
- `customerSource.intention` (String): 意向
- `customerSource.price` (String): 需求价格
- `customerSource.grade` (String): 客户等级
- `customerSource.village.vid` (Long): 楼盘ID
- `customerSource.houseNumber` (String): 楼号
- `customerSource.buildArea` (Float): 建筑面积
- `customerSource.freeArea` (Float): 赠送面积
- `customerSource.innerArea` (Float): 套内面积
- `customerSource.totalArea` (Float): 总面积
- `customerSource.source` (String): 来源方
- `customerSource.contact` (String): 对接方
- `customerSource.referOrderId` (String): 推荐单号
- `customerSource.comment` (String): 备注

```json
{
    "customerSource.csid": 1,
    "customerSource.name": "李先生",
    "customerSource.gender": "男",
    "customerSource.purpose": "婚房",
    "customerSource.intention": "铁西广场附近",
    "customerSource.grade": "A",

    "customerSource.busitype.dbid": 1,
    "customerSource.village.vid": 1,
    "customerSource.houseNumber": "1#1-1-1",
    "customerSource.buildArea": 100,
    "customerSource.freeArea": 0,
    "customerSource.innerArea": 0,
    "customerSource.totalArea": 0,

    "customerSource.source": "",
    "customerSource.contact": "",
    "customerSource.referOrderId": null,

    "customerSource.comment": "备注",
}
```


##### `查询` updateCustomerSourceForStatus

更新客户资源状态

**Requests:**

- `customerSource.csid` (Long): 资源ID
- `customerSource.status` (Short): 状态

```json
{
    "customerSource.csid": 1,
    "customerSource.status": 0
}
```


##### `查询` issueCustomerSource

分配客户资源

**Requests:**

- `customerSource.csid` (Long): 资源ID
- `customerChance.region.did` (Integer): 部门ID
- `customerChance.department.did` (Integer): 部门ID
- `customerChance.belonger.userId` (String): 人员编号

```json
{
    "customerSource.csid": 1,
    "customerChance.region.did": 1,
    "customerChance.department.did": 1,
    "customerChance.belonger.userId": "U0001",
}
```

### 机会


> **类**: `api.customer.CustomerChanceAction`


#### 数据类型: `customerChance`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ccid` | 客机ID | Long |
| `source` | 客户资源 , 类型 [customerSource ](./customer.html#api.customer.CustomerSourceAction.customerSource) | Object |
| `busitype` | 业务类型 , 类型 [decorationBusitype ](./data.html#api.data.DecorationBusitypeAction.decorationBusitype) | Object |
| `creater` | 创建人 , 类型 [user ](./user.html#api.data.UserAction.user) | Object |
| `issuer` | 分配人 , 类型 [user ](./user.html#api.data.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `issueTime` | 分配时间 | Timestamp |
| `confirmTime` | 确认时间 | Timestamp |
| `fineTime` | 惩罚时间 | Timestamp |
| `readTime` | 阅读时间 | Timestamp |
| `meetTime` | 见面时间 | Timestamp |
| `belonger` | 归属人 , 类型 [user ](./user.html#api.data.UserAction.user) | Object |
| `department` | 归属部门 , 类型 [department ](./department.html#api.communion.DepartmentAction.department) | Object |
| `region` | 归属分区 , 类型 [department ](./department.html#api.communion.DepartmentAction.department) | Object |
| `company` | 归属公司 | Integer |
| `isRead` | 是否已读 , 0: 已读 , 1: 未读 | Short |
| `isMeet` | 是否见面 , 0: 无 , 1: 未见 , 2: 已见 | Short |
| `isPhone` | 是否电联 , 0: 无 , 1: 未联 , 2: 已联 | Short |
| `isTrue` | 是否真实 , 0: 无 , 1: 虚假 , 2: 真实 | Short |
| `isFine` | 是否惩罚 , 0: 惩罚 , 1: 正常 | Short |


:param type: 类型 , 0: 自动 , 1: 人员 , 2: 部门 , 3: 分区
:type type: Short
:param status: 状态 , 0: 初始, 1: 失效, 2: 分配, 3: 确认, 4: 完成 , 5: 释放
:type status: Short
:param comment: 备注
:type comment: String


##### `查询` pageCustomerChance

分页方式获取客户机会信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 客户机会列表 , 每条数据类型 `customerChance`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "ccid": 1,
                "source": {
                    "csid": 1,
                    "name": "李先生",
                    "gender": "男",
                    "phone": "136xxxx2345"
                    "purpose": "婚房",
                    "intention": "铁西区学区房",
                    "price": "{'MAX':1200, 'MIN': 1000}",
                    "grade": "A",
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期"
                    },
                    "houseNumber": "1#1-1-1",
                    "buildArea": 100,
                    "freeArea": 0,
                    "innerArea": 0,
                    "totalArea": 0,
                    "createTime": "2016-01-01",
                    "creater": {
                        "uid": 1,
                        "userId": "U0001",
                        "currentName": "白雪",
                        "deptType": "行政",
                        "duty": "财务",
                        "phone": "135xxxx1918",
                        "userPhoto": ""
                    },
                    "status": 0,
                    "comment": "说明"
                },
                "busitype": {
                    "dbid": 1,
                    "name": "业务类型",
                    "status": 0
                },
                "creater": {
                    "uid": 1,
                    "userId": "U0001",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "createTime": "2016-01-01",
                "belonger": {
                    "uid": 1,
                    "userId": "U0001",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "department": {
                    "did": 1,
                    "no": "D001",
                    "name": "市场营销一部",
                },
                "region": {
                    "did": 2,
                    "no": "D0022",
                    "name": "市场一分区",
                },
                "status": 0,
                "comment": "说明"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryCustomerChance

获取客户机会

**Requests:**

- `customerChance.source.csid` (Long): 资源ID

```json
{
    "customerChance.source.csid": 1
}
```

**Returns:**

- `paging` (Object): 分页信息
- `customerChances` (List): 客户机会列表 , 每条数据类型 `customerChance`

```json
{
    ...
    "customerChances": [
        {
            "ccid": 1,
            "source": {
                "csid": 1,
                "name": "李先生",
                "gender": "男",
                "phone": "136xxxx2345"
                "purpose": "婚房",
                "intention": "铁西区学区房",
                "price": "{'MAX':1200, 'MIN': 1000}",
                "grade": "A",
                "village": {
                    "vid": 1,
                    "no": "P001",
                    "name": "广场一期"
                },
                "houseNumber": "1#1-1-1",
                "buildArea": 100,
                "freeArea": 0,
                "innerArea": 0,
                "totalArea": 0,
                "createTime": "2016-01-01",
                "creater": {
                    "uid": 1,
                    "userId": "U0001",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "status": 0,
                "comment": "说明"
            },
            "busitype": {
                "dbid": 1,
                "name": "业务类型",
                "status": 0
            },
            "creater": {
                "uid": 1,
                "userId": "U0001",
                "currentName": "白雪",
                "deptType": "行政",
                "duty": "财务",
                "phone": "135xxxx1918",
                "userPhoto": ""
            },
            "createTime": "2016-01-01",
            "belonger": {
                "uid": 1,
                "userId": "U0001",
                "currentName": "白雪",
                "deptType": "行政",
                "duty": "财务",
                "phone": "135xxxx1918",
                "userPhoto": ""
            },
            "department": {
                "did": 1,
                "no": "D001",
                "name": "市场营销一部",
            },
            "region": {
                "did": 2,
                "no": "D0022",
                "name": "市场一分区",
            },
            "status": 0,
            "comment": "说明"
        }
    ],
    ...
}
```


##### `查询` updateCustomerChance

分配客户机会

判断客户机会是否存在 , 已存在 , 错误信息 **330076 客户机会已存在**

判断客户机会状态为0(初始) , 其他状态 , 错误信息 **330077 客户机会不可操作**

**Requests:**

- `customerChance.customer.cid` (Long): 客户ID
- `customerChance.house.hid` (Long): 楼盘ID
- `customerChance.busitype.dbid` (Long): 业务类型ID

```json
{
    "customerChance.customer.cid": 1,
    "customerChance.house.hid": 1,
    "customerChance.busitype.dbid": 1
}
```


##### `查询` issueCustomerChance

分配客户机会

判断客户机会是否存在 , 已存在 , 错误信息 **330076 客户机会已存在**

判断客户机会状态为0(初始) , 其他状态 , 错误信息 **330077 客户机会不可操作**

**Requests:**

- `customerChance.source.csid` (Long): 资源ID
- `customerChance.belonger.uid` (Long): 归属人ID
- `customerChance.department.did` (Long): 归属部门ID
- `customerChance.region.did` (Long): 归属分区ID

```json
{
    "customerChance.source.csid": 1,
    "customerChance.belonger.uid": 1,
    "customerChance.department.did": 1,
    "customerChance.region.did": 1
}
```


##### `查询` changeCustomerChance

更改客户机会

判断客户机会是否存在 , 不存在 , 错误信息 **330075 客户机会不存在**

判断客户机会状态为0(初始) , 其他状态 , 错误信息 **330077 客户机会不可操作**

**Requests:**

- `customerChance.source.csid` (Long): 资源ID
- `customerChance.belonger.uid` (Long): 归属人ID

```json
{
    "customerChance.source.csid": 1,
    "customerChance.belonger.uid": 1
}
```


##### `查询` sendCustomerChance

推送客户机会

判断客户机会是否存在 , 不存在 , 错误信息 **330075 客户机会不存在**

判断客户机会状态为1(分配) , 其他状态 , 错误信息 **330077 客户机会不可操作**

**Requests:**

- `customerChance.source.csid` (Long): 资源ID

```json
{
    "customerChance.source.csid": 1
}
```


##### `查询` confirmCustomerChange

确认客户机会

判断客户机会是否存在 , 不存在 , 错误信息 **330075 客户机会不存在**

判断客户机会状态为1(分配) , 其他状态 , 错误信息 **330077 客户机会不可操作**

**Requests:**

- `customerOrigin.csid` (Long): 客源ID
- `securityCode` (String): 验证码
- `verifyCode` (String): 验证码

```json
{
    "customerOrigin.csid": 2,
    "securityCode": "",
    "verifyCode": ""
}
```


##### `查询` freeCustomerChance

释放客户机会

判断客户机会是否存在 , 不存在 , 错误信息 **330075 客户机会不存在**

判断客户机会状态为0(初始) , 其他状态 , 错误信息 **330077 客户机会不可操作**

**Requests:**

- `customerChance.source.csid` (Long): 资源ID

```json
{
    "customerChance.source.csid": 1
}
```


##### `查询` disableCustomerChance

失效客户机会

判断客户机会是否存在 , 不存在 , 错误信息 **330075 客户机会不存在**

判断客户机会状态为0(初始) , 其他状态 , 错误信息 **330077 客户机会不可操作**

**Requests:**

- `customerChance.source.csid` (Long): 资源ID

```json
{
    "customerChance.source.csid": 1
}
```

### 记录


> **类**: `api.customer.CustomerSourceAction`


#### 数据类型: `customerSourceRecord`

| 参数 | 说明 | 类型 |
|------|------|------|
| `csrid` | 记录ID | Long |
| `csid` | 资源ID | Long |
| `ccid` | 机会ID | Long |
| `type` | 记录类型 , 包括: 0: 通用 | Short |
| `operater` | 操作人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `operatTime` | 记录时间 | Timestamp |
| `comment` | 记录信息 | String |


##### `查询` pageCustomerSourceRecord

分页方式获取资源记录信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Requests:**

- `customerSourceRecord.csid` (Long): 资源ID

```json
{
    "customerSourceRecord.csid": 2
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 资源记录列表 , 每条数据类型 `customerSourceRecord`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
            "crid": 1,
            "csid": 1,
            "csid": 1,
            "type": 0,
            "operater": {
                "uid": 1,
                "userId": "U0001",
                "userName": "白雪",
                "currentName": "白雪",
                ...
            },
            "operatTime": "2016-01-01",
            "comment": "创建资源信息",

        }
    ],
    ...
}
```

### 客源


客源信息管理以及与客户之间关系


> **类**: `api.customer.CustomerOriginAction`


#### 数据类型: `customerOrigin`

| 参数 | 说明 | 类型 |
|------|------|------|
| `csid` | 客源ID | Long |
| `name` | 姓名 | String |
| `gender` | 性别 | String |
| `phone` | 电话 | String |
| `purpose` | 目的 | String |
| `intention` | 意向 | String |
| `price` | 需求价格 | String |
| `grade` | 客户等级 | String |
| `busitype` | 业务类型 , 类型 [decorationBusitype ](./data.html#api.data.DecorationBusitypeAction.decorationBusitype) | Object |
| `village` | 楼盘 , 类型 [village ](./data.html#api.data.VillageAction.village) | Object |
| `houseNumber` | 楼号 | String |
| `buildArea` | 建筑面积 | Integer |
| `buildArea` | 建筑面积 | Integer |
| `freeArea` | 赠送面积 | Integer |
| `innerArea` | 套内面积 | Integer |
| `totalArea` | 总面积 | Integer |
| `creater` | 创建人 , 类型 [user ](./user.html#api.data.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `belonger` | 归属人 , 类型 [user ](./user.html#api.data.UserAction.user) | Object |
| `department` | 归属部门 , 类型 [department ](./department.html#api.communion.DepartmentAction.department) | Object |
| `region` | 归属分区 , 类型 [department ](./department.html#api.communion.DepartmentAction.department) | Object |
| `status` | 状态 , 0(初始) , 1(初审) , 2(提交) , 3(确认) , 4(审批) , 5(绑定) , 6(拒绝) | Short |
| `comment` | 备注 | String |
| `designer` | 设计师 , 类型 [user ](./user.html#api.data.UserAction.user) | Object |
| `salesman` | 业务员 , 类型 [user ](./user.html#api.data.UserAction.user) | Object |
| `customer` | 客户信息 , 类型 [customer ](./data.html#api.data.CustomerAction.customer) | Object |
| `house` | 房产 , 类型 [house ](./data.html#api.data.HouseAction.house) | Object |
| `orderId` | 装修单号 | String |


##### `查询` pageCustomerOrigin

分页方式获取客源信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Requests:**

- `type` (String): 类型 , 包括: 设计(designer) , 业务(salesman) , 归属(belonger) , 共享(share)

```json
{
    "type": "salesman"
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 客源列表 , 每条数据类型 `customerOrigin`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "csid": 1,
                "name": "李先生",
                "gender": "男",
                "phone": "136xxxx2345"
                "purpose": "婚房",
                "intention": "铁西区学区房",
                "price": "{'MAX':1200, 'MIN': 1000}",
                "grade": "A",
                "busitype": {
                    "dbid": 1,
                    "name": "业务类型",
                    "status": 0
                },
                "village": {
                    "vid": 1,
                    "no": "P001",
                    "name": "广场一期"
                },
                "houseNumber": "1#1-1-1",
                "buildArea": 100,
                "freeArea": 0,
                "innerArea": 0,
                "totalArea": 0,
                "creater": {
                    "uid": 1,
                    "userId": "U0001",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "createTime": "2016-01-01",
                "belonger": {
                    "uid": 1,
                    "userId": "U0001",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "department": {
                    "did": 1,
                    "no": "D001",
                    "name": "市场营销一部",
                },
                "region": {
                    "did": 2,
                    "no": "D0022",
                    "name": "市场一分区",
                },
                "designer": {
                    "uid": 1,
                    "userId": "U0001",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "salesman": {
                    "uid": 1,
                    "userId": "U0001",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "status": 0,
                "comment": "说明"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageCustomerOriginForAdvance

分页方式获取客源信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

利用客源-部门权限 , 查询当前人员拥有的部门权限下跟进人归属的客源信息

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 客源列表 , 每条数据类型 `customerOrigin`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "csid": 1,
                "name": "李先生",
                "gender": "男",
                "phone": "136xxxx2345"
                "purpose": "婚房",
                "intention": "铁西区学区房",
                "price": "{'MAX':1200, 'MIN': 1000}",
                "grade": "A",
                "busitype": {
                    "dbid": 1,
                    "name": "业务类型",
                    "status": 0
                },
                "village": {
                    "vid": 1,
                    "no": "P001",
                    "name": "广场一期"
                },
                "houseNumber": "1#1-1-1",
                "buildArea": 100,
                "freeArea": 0,
                "innerArea": 0,
                "totalArea": 0,
                "creater": {
                    "uid": 1,
                    "userId": "U0001",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "createTime": "2016-01-01",
                "belonger": {
                    "uid": 1,
                    "userId": "U0001",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "department": {
                    "did": 1,
                    "no": "D001",
                    "name": "市场营销一部",
                },
                "region": {
                    "did": 2,
                    "no": "D0022",
                    "name": "市场一分区",
                },
                "designer": {
                    "uid": 1,
                    "userId": "U0001",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "salesman": {
                    "uid": 1,
                    "userId": "U0001",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "status": 0,
                "comment": "说明"
            }
        ],
        ...
    },
    ...
}
```


##### `创建` queryCustomerOriginByCsid

通过客源ID获取客源信息

**Requests:**

- `customerOrigin.csid` (Long): 客源ID

```json
{
    "customerOrigin.csid": 1
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 客源列表 , 每条数据类型 `customerOrigin`

```json
{
    ...
    "customerOrigin": {
        "csid": 1,
        "name": "李先生",
        "gender": "男",
        "phone": "136xxxx2345"
        "purpose": "婚房",
        "intention": "铁西区学区房",
        "price": "{'MAX':1200, 'MIN': 1000}",
        "grade": "A",
        "busitype": {
            "dbid": 1,
            "name": "业务类型",
            "status": 0
        },
        "village": {
            "vid": 1,
            "no": "P001",
            "name": "广场一期"
        },
        "houseNumber": "1#1-1-1",
        "buildArea": 100,
        "freeArea": 0,
        "innerArea": 0,
        "totalArea": 0,
        "creater": {
            "uid": 1,
            "userId": "U0001",
            "currentName": "白雪",
            "deptType": "行政",
            "duty": "财务",
            "phone": "135xxxx1918",
            "userPhoto": ""
        },
        "createTime": "2016-01-01",
        "belonger": {
            "uid": 1,
            "userId": "U0001",
            "currentName": "白雪",
            "deptType": "行政",
            "duty": "财务",
            "phone": "135xxxx1918",
            "userPhoto": ""
        },
        "department": {
            "did": 1,
            "no": "D001",
            "name": "市场营销一部",
        },
        "region": {
            "did": 2,
            "no": "D0022",
            "name": "市场一分区",
        },
        "designer": {
            "uid": 1,
            "userId": "U0001",
            "currentName": "白雪",
            "deptType": "行政",
            "duty": "财务",
            "phone": "135xxxx1918",
            "userPhoto": ""
        },
        "salesman": {
            "uid": 1,
            "userId": "U0001",
            "currentName": "白雪",
            "deptType": "行政",
            "duty": "财务",
            "phone": "135xxxx1918",
            "userPhoto": ""
        },
        "status": 0,
        "comment": "说明"
    }
    ...
}
```


##### `查询` addCustomerOrigin

添加客源信息

创建记录信息 , 新客源信息作为记录内容 , 信息包括: 电话, 目的, 意向, 价格, 等级

**Requests:**

- `customerOrigin.name` (String): 姓名
- `customerOrigin.gender` (String): 性别
- `customerOrigin.phone` (String): 电话
- `customerOrigin.purpose` (String): 目的
- `customerOrigin.intention` (String): 意向
- `customerOrigin.price` (String): 需求价格
- `customerOrigin.grade` (String): 客户等级
- `customerOrigin.comment` (String): 备注
- `customerOrigin.busitype.dbid` (Long): 业务类型ID
- `customerOrigin.village.vid` (Long): 楼盘ID
- `customerOrigin.houseNumber` (String): 楼号
- `customerOrigin.buildArea` (Float): 建筑面积
- `customerOrigin.freeArea` (Float): 赠送面积
- `customerOrigin.innerArea` (Float): 套内面积
- `customerOrigin.totalArea` (Float): 总面积
- `customerOrigin.designer.uid` (Long): 设计师ID
- `customerOrigin.salesman.uid` (Long): 业务员ID

```json
{
    "customerOrigin.name": "李先生",
    "customerOrigin.gender": "男",
    "customerOrigin.purpose": "婚房",
    "customerOrigin.intention": "铁西广场附近",
    "customerOrigin.grade": "A",
    "customer.belonger.userId": "U9382"
    "customerOrigin.comment": "备注",
    "customerOrigin.busitype.dbid": 1,
    "customerOrigin.village.vid": 1,
    "customerOrigin.houseNumber": "1#1-1-1",
    "customerOrigin.buildArea": 100,
    "customerOrigin.freeArea": 0,
    "customerOrigin.innerArea": 0,
    "customerOrigin.totalArea": 0,
    "customerOrigin.designer.uid": 1,
    "customerOrigin.salesman.uid": 1,
}
```


##### `查询` updateCustomerOrigin

更新客源信息 , 包括: 目的, 意向, 价格, 等级

判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**

判断客源状态为0(初始) , 其他状态 , 错误信息 **330014 客源状态不可操作**

创建记录信息 , 同时将原客源信息以及新客源信息作为记录内容 , 信息包括: 目的, 意向, 价格, 等级

**Requests:**

- `customerOrigin.csid` (Long): 客源ID
- `customerOrigin.purpose` (String): 目的
- `customerOrigin.intention` (String): 意向
- `customerOrigin.price` (String): 需求价格
- `customerOrigin.grade` (String): 客户等级
- `customerOrigin.comment` (String): 备注
- `customerOrigin.busitype.dbid` (Long): 业务类型ID
- `customerOrigin.designer.uid` (Long): 设计师ID
- `customerOrigin.salesman.uid` (Long): 业务员ID

```json
{
    "customerOrigin.csid": 2,
    "customerOrigin.purpose": "婚房",
    "customerOrigin.intention": "铁西广场附近",
    "customerOrigin.grade": "A",
    "customerOrigin.comment": "备注",
    "customerOrigin.decortionBusitype.dbid": 1,
    "customerOrigin.designer.uid": 1,
    "customerOrigin.salesman.uid": 1
}
```


##### `查询` updateCustomerOriginForBelonger

更新客源归属信息

判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**

判断客源状态为0(初始) , 其他状态 , 错误信息 **330014 客源状态不可操作**

修改归属人信息同时更新归属部门以及分区

客源归属人信息可以为空 , 为空时 , 不更新归属部门和分区

创建记录信息 , 将原归属人, 部门, 分区以及新归属人, 部门, 分区作为记录内容

**Requests:**

- `customerOrigin.csid` (Long): 客源ID
- `customerOrigin.belonger.userId` (String): 归属人ID

```json
{
    "customerOrigin.csid": 2,
    "customer.belonger.userId": "U9382"
}
```


##### `查询` freeCustomerOrigin

释放客源归属信息

判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**

判断客源状态为0(初始) , 其他状态 , 错误信息 **330014 客源状态不可操作**

客源归属人为当前操作人能够释放 , 否则释放失败 , 错误信息 **330002 客源归属人错误**

更新归属人为空

创建记录信息 , 记录原归属人信息 , 包括原归属人的员工号以及员工名

**Requests:**

- `customerOrigin.csid` (Long): 客源ID

```json
{
    "customerOrigin.csid": 2
}
```


##### `查询` takeCustomerOrigin

认领房源

判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**

判断客源状态为0(初始) , 其他状态 , 错误信息 **330014 客源状态不可操作**

客源归属人为空能够认领 , 否则认领失败 , 错误信息 **330002 客源归属人错误**

更新归属人 , 部门以及分区信息

创建记录信息 , 记录原归属人信息 , 包括认领人的员工号以及员工名

**Requests:**

- `customerOrigin.csid` (Long): 客源ID

```json
{
    "customerOrigin.csid": 2
}
```


##### `查询` bindCustomerOrigin

绑定客源信息 , 包括: 设计师 , 业务员 , 房产ID , 客户ID

判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**

判断客源状态为0(初始) , 其他状态 , 错误信息 **330014 客源状态不可操作**

判断房产是否存在 , 不存在 , 错误信息 **320002 房产不存在**

**Requests:**

- `customerOrigin.csid` (Long): 客源ID
- `customerOrigin.designer.userId` (String): 设计师ID
- `customerOrigin.salesman.userId` (String): 业务员ID
- `customerOrigin.customer.cid` (Long): 客户ID
- `customerOrigin.house.hid` (Long): 房产ID

```json
{
    "customerOrigin.csid": 2,
    "customerOrigin.designer.userId": "U0002",
    "customerOrigin.salesman.userId": "U0002",
    "customerOrigin.customer.cid": 1,
    "customerOrigin.house.hid": 1
}
```


##### `查询` commitCustomerOrigin

提交客源

判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**

判断客源状态为1(初审) , 其他状态 , 错误信息 **330014 客源状态不可操作**

**Requests:**

- `customerOrigin.csid` (Long): 客源ID

```json
{
    "customerOrigin.csid": 2
}
```


##### `查询` confirmCustomerOrigin

确认客源

判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**

判断客源状态为2(提交) , 其他状态 , 错误信息 **330014 客源状态不可操作**

**Requests:**

- `customerOrigin.csid` (Long): 客源ID
- `securityCode` (String): 验证码
- `verifyCode` (String): 验证码

```json
{
    "customerOrigin.csid": 2,
    "securityCode": "",
    "verifyCode": ""
}
```


##### `查询` cancelCustomerOrigin

撤销客源

判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**

判断客源状态为2(提交)/3(确认)/5(拒绝) , 其他状态 , 错误信息 **330014 客源状态不可操作**

**Requests:**

- `customerOrigin.csid` (Long): 客源ID

```json
{
    "customerOrigin.csid": 2
}
```

### 记录


> **类**: `api.customer.CustomerRecordAction`


#### 数据类型: `customerOriginRecord`

| 参数 | 说明 | 类型 |
|------|------|------|
| `crid` | 客户记录ID | Long |
| `csid` | 客源ID | Long |
| `comment` | 记录信息 | String |
| `type` | 记录类型 , 包括: 0(更新) , 1(定义) | Short |
| `operater` | 操作人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `operatTime` | 记录时间 | Timestamp |


##### `查询` queryCustomerOriginRecord

通过客源查询记录信息

**Requests:**

- `customerOriginRecord.csid` (Long): 客源ID

```json
{
    "customerOriginRecord.csid": 2
}
```

**Returns:**

- `customerOriginRecords` (List): 记录信息列表 , 每条数据类型 `customerOriginRecord`

```json
{
    ...
    "customerOriginRecords": [
        {
            "crid": 1,
            "csid": 1,
            "operater": {
                "uid": 1,
                "userId": "U0001",
                "userName": "白雪",
                "currentName": "白雪",
                "deptType": "行政",
                "duty": "财务",
                "phone": "135xxxx1918",
                "userPhoto": ""
            },
            "operatTime": "2016-01-01",
            "comment": "创建客源信息",
            "type": 0
        }
    ],
    ...
}
```


##### `查询` addCustomerOriginRecord

创建客户记录信息

**Requests:**

- `customerOriginRecord.csid` (Long): 客源ID
- `customerOriginRecord.comment` (String): 说明

```json
{
    "customerOriginRecord.csid": 2,
    "customerOriginRecord.comment": "说明"
}
```

### 功能


> **类**: `api.customer.CustomerOriginFunctionAction`


#### 数据类型: `customerOriginFunction`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cofid` | 功能ID | Long |
| `name` | 名称 | String |
| `key` | key | String |
| `value` | value | String |
| `type` | 类型 , 0: 类型, 1: api, 2: 条件, 3: 字段, 4: 功能, 5: 节点, 6: 状态 | Short |
| `subtype` | 子类 , 0: 字符串, 1: 数组 | Short |
| `comment` | 说明 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `sort` | 排序 | Short |


##### `查询` queryCustomerOriginFunction

获取客源功能信息

**Requests:**

- `customerOriginFunction.type` (Short): 类型

```json
{
    "customerOriginFunction.type": 0
}
```

**Returns:**

- `customerOriginFunctions` (List): 功能信息列表 , 类型 `customerOriginFunction`

```json
{
    ...
    "customerOriginFunctions": [
        {
            "cofid": 1,
            "name": "designer",
            "key": "api",
            "value": "api.customer.function",
            "type": 0,
            "subtype": 0,
            "comment": "说明",
            "sort": 0
        }
    ],
    ...
}
```

## 服务


### 咨询


> **类**: `api.customer.ConsultionAction`


#### 数据类型: `consultion`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cid` | 咨询ID | Long |
| `no` | 编号 | Long |
| `decoration` | 装修单 , 类型 [decoration ](./decoration.html#api.decoration.decorationAction.decoration) | Object |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `comment` | 说明 | Long |
| `company` | 公司 | Integer |


##### `查询` pageConsultion

分页方式获取咨询信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 咨询信息列表 , 每条数据类型 `consultion`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "cid": 34,
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
                "creater": {
                    "uid": 3,
                    "userId": "U0041",
                    "userName": "创建",
                    "currentName": "创建",
                },
                "comment": "咨询内容",
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryConsultionByOrderId

通过装修单号获取咨询信息

**Requests:**

- `consultion.decoration.orderId` (String): 装修单号

```json
{
    "consultion.decoration.orderId": "1601010001"
}
```

**Returns:**

- `consultions` (List): 咨询信息 , 每条数据类型 `user`

```json
{
    ...
    "user": [
        {
            "cid": 34,
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
            "creater": {
                "uid": 3,
                "userId": "U0041",
                "userName": "创建",
                "currentName": "创建",
            },
            "comment": "咨询内容",
        },
    ]
    ...
}
```


##### `查询` addConsultion

添加咨询信息

**Requests:**

- `consultion.decoration.orderId` (String): 装修单号
- `consultion.comment` (String): 咨询内容

```json
{
    "consultion.decoration.orderId": "1601010001",
    "consultion.comment": "咨询内容"
}
```

### 报修/维修


> **类**: `api.customer.AepairAction`


#### 数据类型: `aepair`

| 参数 | 说明 | 类型 |
|------|------|------|
| `aid` | 报修ID | Long |
| `csid` | 咨询ID | Long |
| `decoration` | 装修单 , 类型 [decoration ](./decoration.html#api.decoration.decorationAction.decoration) | Object |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `updater` | 操作人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `repaier` | 维修人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `targetTime` | 预计完成时间 | Timestamp |
| `updateTime` | 更新时间 | Timestamp |
| `finishTime` | 完成时间 | Timestamp |
| `onestate` | 状态 , 0: 初始 , 1: 维修 , 2: 完工 | Short |
| `twostate` | 状态 , 0: 初始 , 1: 维修 , 2: 完工 | Short |
| `thrstate` | 状态 , 0: 初始 , 1: 维修 , 2: 完工 | Short |
| `forstate` | 状态 , 0: 初始 , 1: 维修 , 2: 完工 | Short |
| `fivstate` | 状态 , 0: 初始 , 1: 维修 , 2: 完工 | Short |
| `status` | 状态 , 0: 初始 , 1: 维修 , 2: 完工 , 3: 关闭 | Short |
| `outlay` | 维修费用 | Long |
| `outpay` | 已付费用 | Long |
| `gladness` | 满意度 , 0: 初始 , 1: 满意 , 2: 一般 , 3: 投诉 | Short |
| `company` | 公司 | Integer |


##### `查询` pageAepair

分页方式获取报修信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 报修信息列表 , 每条数据类型 `aepair`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "aid": 1,
                "csid": 1,
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
                "creater": {
                    "uid": 3,
                    "userId": "U0041",
                    "userName": "夏雨",
                    "currentName": "夏雨",
                },
                "updater": {
                    "uid": 7,
                    "userId": "U0042",
                    "userName": "白雪",
                    "currentName": "白雪",
                },
                "repaier": {
                    "uid": 7,
                    "userId": "U0042",
                    "userName": "白雪",
                    "currentName": "白雪",
                },
                "createTime": "2016-01-01 00:00:00",
                "targetTime": "2016-01-01 00:00:00",
                "updateTime": "2016-01-01 00:00:00",
                "finishTime": "2016-01-01 00:00:00",
                "updateTime": "",
                "onestate": 0,
                "twostate": 0,
                "thrstate": 0,
                "forstate": 0,
                "fivstate": 0,
                "status": 0,
                "gladness": 0,
                "outlay": 100000,
                "outpay": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryAepair

通过咨询ID获取报修信息

**Requests:**

- `aepair.csid` (Long): 咨询ID

```json
{
    "aepair.csid": 1
}
```

**Returns:**

- `aepairs` (List): 报修信息列表 , 每条数据类型 `aepair`

```json
{
    ...
    "aepairs": [
        {
            "aid": 1,
            "csid": 1,
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
            "creater": {
                "uid": 3,
                "userId": "U0041",
                "userName": "夏雨",
                "currentName": "夏雨",
            },
            "updater": {
                "uid": 7,
                "userId": "U0042",
                "userName": "白雪",
                "currentName": "白雪",
            },
            "createTime": "2016-01-01 00:00:00",
            "targetTime": "2016-01-01 00:00:00",
            "finishTime": "2016-01-01 00:00:00",
            "updateTime": "",
            "onestate": 0,
            "twostate": 0,
            "thrstate": 0,
            "forstate": 0,
            "fivstate": 0,
            "status": 0,
            "gladness": 0,
            "outlay": 100000,
            "outpay": 0
        },
    ]
    ...
}
```


##### `查询` queryAepairByOrderId

通过咨询ID获取报修信息

**Requests:**

- `aepair.decoration.orderId` (String): 装修单号

```json
{
    "aepair.decoration.orderId": "1601010001"
}
```

**Returns:**

- `aepairs` (List): 报修信息列表 , 每条数据类型 `aepair`

```json
{
    ...
    "aepairs": [
        {
            "aid": 1,
            "csid": 1,
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
            "creater": {
                "uid": 3,
                "userId": "U0041",
                "userName": "夏雨",
                "currentName": "夏雨",
            },
            "updater": {
                "uid": 7,
                "userId": "U0042",
                "userName": "白雪",
                "currentName": "白雪",
            },
            "createTime": "2016-01-01 00:00:00",
            "targetTime": "2016-01-01 00:00:00",
            "finishTime": "2016-01-01 00:00:00",
            "updateTime": "",
            "onestate": 0,
            "twostate": 0,
            "thrstate": 0,
            "forstate": 0,
            "fivstate": 0,
            "status": 0,
            "gladness": 0,
            "outlay": 100000,
            "outpay": 0
        },
    ]
    ...
}
```


##### `查询` addAepair

添加报修信息

判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**

**Requests:**

- `consultion.csid` (Long): 咨询ID
- `consultion.decoration.orderId` (String): 装修单号
- `consultion.comment` (String): 说明
- `aepair.decoration.orderId` (String): 装修单号
- `aepair.targetTime` (Timestamp): 预计完成时间

```json
{
    "consultion.csid": 1,
    "consultion.comment": 1,
    "aepair.decoration.orderId": "1601010001",
    "aepair.targetTime": "2016-01-01 00:00:00"
}
```


##### `查询` updateAepair

更新报修信息

判断报修信息是否存在 , 不存在 , 错误信息 **330021 报修信息不存在**

判断报修信息状态为0(初始)或1(维修) , 其他状态 **330022 报修状态不可操作**

**Requests:**

- `aepair.aid` (Long): 报修ID
- `aepair.outlay` (Long): 维修费用

```json
{
    "aepair.rid": 1,
    "aepair.outlay": 100000
}
```


##### `查询` receiveAepair

领取报修信息

判断报修信息是否存在 , 不存在 , 错误信息 **330021 报修信息不存在**

判断报修信息状态是否为0(初始) , 其他状态 , 错误信息 **330022 报修状态不可操作**

判断维修信息是否存在维修人 , 已存在 , 错误信息 **330027 维修已有归属**

更新报修单中维修人信息 , 报修单状态为1(维修)

生成维修信息

**Requests:**

- `aepair.aid` (Long): 报修ID

```json
{
    "aepair.aid": 1
}
```


##### `查询` deliveAepair

分配报修信息

判断报修信息是否存在 , 不存在 , 错误信息 **330021 报修信息不存在**

判断报修信息状态是否为0(初始) , 其他状态 , 错误信息 **330022 报修状态不可操作**

判断维修信息是否存在维修人 , 已存在 , 错误信息 **330027 维修已有归属**

生成维修信息

**Requests:**

- `aepair.aid` (Long): 报修ID
- `aepair.repaier.uid` (Long): 维修人ID

```json
{
    "aepair.aid": 1,
    "aepair.repaier.uid": 1
}
```


##### `查询` tranAepair

转交报修信息

判断报修信息是否存在 , 不存在 , 错误信息 **330021 报修信息不存在**

判断报修信息状态是否为1(维修) , 其他状态 , 错误信息 **330022 报修状态不可操作**

判断维修归属为当前操作人 , 非同一人 , 错误信息 **330028 维修非当前归属**

**Requests:**

- `aepair.aid` (Long): 报修ID
- `aepair.repaier.uid` (Long): 维修人ID

```json
{
    "aepair.aid": 1,
    "aepair.repaier.uid": 1
}
```


##### `查询` finishAepair

完工报修

判断报修信息是否存在 , 不存在 , 错误信息 **330021 报修信息不存在**

判断报修信息状态是否为1(维修) , 其他状态 , 错误信息 **330022 报修状态不可操作**

更新报修状态为2(完工)

**Requests:**

- `aepair.aid` (Long): 报修ID

```json
{
    "aepair.aid": 1
}
```


##### `查询` closeAepair

关闭报修

判断报修信息是否存在 , 不存在 , 错误信息 **330021 报修信息不存在**

判断报修信息状态是否为2(完工) , 其他状态 , 错误信息 **330022 报修状态不可操作**

**Requests:**

- `aepair.aid` (Long): 报修ID

```json
{
    "aepair.aid": 1
}
```


##### `查询` sendAepair

发送报修信息

判断报修信息是否存在 , 不存在 , 错误信息 **330021 报修信息不存在**

**Requests:**

- `aepair.aid` (Long): 报修ID

```json
{
    "aepair.aid": 1
}
```


> **类**: `api.customer.RepairAction`


#### 数据类型: `repair`

| 参数 | 说明 | 类型 |
|------|------|------|
| `rid` | 维修ID | Long |
| `aid` | 报修ID | Long |
| `cnid` | 工程节点ID | Long |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `updater` | 操作人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `updateTime` | 更新时间 | Timestamp |
| `finishTime` | 完成时间 | Timestamp |
| `deliver` | 转交人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `repaier` | 维修人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `status` | 状态 , 0: 初始 , 1: 维修 , 2: 完工 | Short |
| `content` | 内容 | String |


##### `查询` queryRepair

通过报修ID获取维修信息

**Requests:**

- `repair.aid` (Long): 报修ID

```json
{
    "repair.aid": 1
}
```

**Returns:**

- `repairs` (List): 维修信息列表 , 每条数据类型 `repair`

```json
{
    ...
    "repairs": [
        {
            "rid": 1,
            "aid": 1,
            "cnid": 1,
            "creater": {
                "uid": 3,
                "userId": "U0041",
                "userName": "夏雨",
                "currentName": "夏雨",
            },
            "updater": {
                "uid": 7,
                "userId": "U0042",
                "userName": "白雪",
                "currentName": "白雪",
            },
            "createTime": "2016-01-01 00:00:00",
            "finishTime": "2016-01-01 00:00:00",
            "updateTime": "",
            "deliver": {
                "uid": 13,
                "userId": "U0045",
                "userName": "冬日",
                "currentName": "冬日",
            },
            "repaier": {
                "uid": 13,
                "userId": "U0045",
                "userName": "冬日",
                "currentName": "冬日",
            },
            "status": 0,
            "content": "维修内容"
        },
    ]
    ...
}
```


##### `查询` addRepair

添加维修信息

**Requests:**

- `repair.aid` (Long): 报修ID
- `repair.repaier.uid` (Long): 维修人ID
- `repair.content` (String): 维修内容

```json
{
    "repair.aid": 1,
    "repair.repaier.uid": 1,
    "repair.content": "维修内容"
}
```


##### `查询` sendRepair

发送

判断维修信息是否存在 , 不存在 , 错误信息 **330025 维修信息不存在**

判断维修状态为0(初始) , 其他状态 , 错误信息 **330026 维修状态不可操作**

**Requests:**

- `repair.rid` (Long): 维修ID

```json
{
    "repair.rid": 1
}
```


##### `查询` keepRepair

维修

判断维修信息是否存在 , 不存在 , 错误信息 **330025 维修信息不存在**

判断维修状态为0(初始) , 其他状态 , 错误信息 **330026 维修状态不可操作**

更新维修信息状态为1(维修)

更新报修信息状态为1(维修)

**Requests:**

- `repair.rid` (Long): 维修ID
- `repair.schedule` (String): 进度

```json
{
    "repair.rid": 1,
    "repair.schedule": "one"
}
```


##### `查询` finishRepair

完工

判断维修信息是否存在 , 不存在 , 错误信息 **330025 维修信息不存在**

判断维修状态为1(维修) , 其他状态 , 错误信息 **330026 维修状态不可操作**

判断维修归属为当前操作人 , 非同一人 , 错误信息 **330028 维修非当前归属**

更新维修信息状态为2(完工)

更新报修信息状态为0(初始)

**Requests:**

- `repair.rid` (Long): 维修ID
- `repair.schedule` (String): 进度

```json
{
    "repair.rid": 1,
    "repair.schedule": "one"
}
```


> **类**: `api.customer.RepairpayAction`


#### 数据类型: `repairpay`

| 参数 | 说明 | 类型 |
|------|------|------|
| `rpid` | 维修款ID | Long |
| `aid` | 报修ID | Long |
| `type` | 类型 , 0: 款项 , 对应装修款 , 1: 扣款 , 员工薪资 , 2: 成本 , 公司承担 | Short |
| `ident` | 引用ID | Long |
| `money` | 金额 | Long |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `status` | 状态 , 0: 初始 , 1: 已付款 , 2: 已确认 | Short |


##### `查询` queryRepairpay

通过维修信息ID获取维修款信息

**Requests:**

- `repairpay.aid` (Long): 报修ID

```json
{
    "repairpay.aid": 1
}
```

**Returns:**

- `repairpays` (List): 维修款信息列表 , 每条数据类型 `repairpay`

```json
{
    ...
    "repairpays": [
        {
            "rpid": 1,
            "rid": 1,
            "type": 0,
            "ident": 1,
            "money": 10000,
            "creater": {
                "uid": 13,
                "userId": "U0045",
                "userName": "冬日",
                "currentName": "冬日",
            },
            "createTime": "2016-01-01 00:00:00"
        },
    ]
    ...
}
```


##### `查询` addRepairpay

添加维修款

判断维修信息是否存在 , 不存在 , 错误信息 **330025 维修信息不存在**

更新报修单的维修费用

**Requests:**

- `repairpay.aid` (Long): 报修ID
- `repairpay.type` (Short): 类型
- `repairpay.money` (Long): 金额

```json
{
    "repairpay.aid": 1,
    "repairpay.type": 1,
    "repairpay.money": 100000,
}
```


##### `查询` deleteRepairpay

删除维修款

判断维修款是否存在 , 不存在 , 错误信息 **330032 维修款不存在**

判断维修款状态是否为0(初始) , 其他状态 , 错误信息 **330033 维修款状态不可操作**

**Requests:**

- `repairpay.rpid` (Long): 维修款ID

```json
{
    "repairpay.rpid": 1
}
```

### 投诉/跟踪


> **类**: `api.customer.ComplainAction`


#### 数据类型: `complain`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cid` | 投诉ID | Long |
| `csid` | 咨询ID | Long |
| `decoration` | 装修单 , 类型 [decoration ](./decoration.html#api.decoration.decorationAction.decoration) | Object |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `updater` | 操作人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `updateTime` | 操作时间 | Timestamp |
| `finishTime` | 完成时间 | Timestamp |
| `level` | 等级 , 0: 标准 , 1: 重大 , 2: 危机 | Short |
| `status` | 状态 , 0: 初始,  1: 处理 , 2: 完结 , 3: 关闭 | Short |
| `gladness` | 满意度 , 0: 初始 , 1: 满意 , 2: 一般 , 3: 投诉 | Short |
| `company` | 公司 | Integer |


##### `查询` pageComplain

分页方式获取投诉信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 投诉信息列表 , 每条数据类型 `complain`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "cid": 1,
                "csid": 1,
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
                "creater": {
                    "uid": 3,
                    "userId": "U0041",
                    "userName": "夏雨",
                    "currentName": "夏雨",
                },
                "updater": {
                    "uid": 7,
                    "userId": "U0042",
                    "userName": "白雪",
                    "currentName": "白雪",
                },
                "createTime": "2016-01-01 00:00:00",
                "finishTime": "2016-01-01 00:00:00",
                "updateTime": "",
                "level": 0,
                "status": 0,
                "gladness": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryComplain

通过咨询ID获取投诉信息

**Requests:**

- `complain.csid` (Long): 咨询ID

```json
{
    "complain.csid": 1
}
```

**Returns:**

- `complains` (List): 投诉信息列表 , 每条数据类型 `complain`

```json
{
    ...
    "complains": [
        {
            "cid": 1,
            "csid": 1,
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
            "creater": {
                "uid": 3,
                "userId": "U0041",
                "userName": "夏雨",
                "currentName": "夏雨",
            },
            "updater": {
                "uid": 7,
                "userId": "U0042",
                "userName": "白雪",
                "currentName": "白雪",
            },
            "createTime": "2016-01-01 00:00:00",
            "finishTime": "2016-01-01 00:00:00",
            "updateTime": "",
            "level": 0,
            "status": 0,
            "gladness": 0
        }
    ],
    ...
}
```


##### `查询` queryComplainByOrderId

通过装修单号获取投诉信息

**Requests:**

- `complain.decoration.orderId` (String): 装修单号

```json
{
    "complain.csid": 1
}
```

**Returns:**

- `complains` (List): 投诉信息列表 , 每条数据类型 `complain`

```json
{
    ...
    "complains": [
        {
            "cid": 1,
            "csid": 1,
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
            "creater": {
                "uid": 3,
                "userId": "U0041",
                "userName": "夏雨",
                "currentName": "夏雨",
            },
            "updater": {
                "uid": 7,
                "userId": "U0042",
                "userName": "白雪",
                "currentName": "白雪",
            },
            "createTime": "2016-01-01 00:00:00",
            "finishTime": "2016-01-01 00:00:00",
            "updateTime": "",
            "level": 0,
            "status": 0,
            "gladness": 0
        }
    ],
    ...
}
```


##### `查询` addComplain

添加投诉信息

判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**

**Requests:**

- `consultion.csid` (Long): 咨询ID
- `consultion.decoration.orderId` (String): 装修单号
- `consultion.comment` (String): 说明
- `complain.level` (Short): 等级

```json
{
    "complain.csid": 1,
    "complain.level": 1,

    "complaints[0].type": 0,
    "complaints[0].dept.did": 1,
    "complaints[0].staff.uid": 1,
    "complaints[0].brand.bid": 1,
    "complaints[0].content": "投诉内容",
}
```


##### `查询` finishComplain

完结

判断投诉信息是否存在 , 不存在 , 错误信息 **330037 投诉信息不存在**

判断投诉信息状态是否为1(处理) , 其他状态 , 错误信息 **330038 投诉状态不可操作**

更新投诉信息状态为2(完结)

**Requests:**

- `complain.cid` (Long): 投诉ID

```json
{
    "complain.cid": 1
}
```


##### `查询` closeComplain

关闭

判断投诉信息是否存在 , 不存在 , 错误信息 **330037 投诉信息不存在**

判断投诉信息状态是否为2(完结) , 其他状态 , 错误信息 **330038 投诉状态不可操作**

更新投诉信息状态为3(关闭)

**Requests:**

- `complain.cid` (Long): 投诉ID

```json
{
    "complain.cid": 1
}
```


> **类**: `api.customer.ComplaintAction`


#### 数据类型: `complaint`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ctid` | 投诉内容ID | Long |
| `cid` | 投诉ID | Long |
| `type` | 类型 , 0: 设计 , 1: 业务 , 2: 工程 , 3: 销售 , 4: 其他 , 5: 无理 | Short |
| `dept` | 部门 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `staff` | 员工 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `brand` | 品牌 , 类型 [brand ](./data.html#api.communion.BrandAction.brand) | Object |
| `content` | 内容 | String |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `updater` | 操作人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `updateTime` | 更新时间 | Timestamp |
| `finishTime` | 完结时间 | Timestamp |
| `status` | 状态 , 0: 初始 , 1: 处理 , 2: 完结 , 3: 关闭 | Short |


##### `查询` queryComplaint

通过投诉ID获取内容信息

**Requests:**

- `complaint.cid` (Long): 投诉ID

```json
{
    "complaint.cid": 1
}
```

**Returns:**

- `complaints` (List): 投诉内容信息列表 , 每条数据类型 `complaint`

```json
{
    ...
    "complaints": [
        {
            "ctid": 1,
            "cid": 1,
            "type": 1,
            "dept": {
                "did": 250,
                "no": "D001",
                "name": "设计部",
                "fatherDept": null,
                "type": "职能部"
            },
            "staff": {
                "uid": 3,
                "userId": "U0041",
                "userName": "夏雨",
                "currentName": "夏雨",
            },
            "brand": {
                "bid": 1,
                "name": "品牌",
            },
            "content": "投诉内容",
            "creater": {
                "uid": 3,
                "userId": "U0041",
                "userName": "夏雨",
                "currentName": "夏雨",
            },
            "updater": {
                "uid": 7,
                "userId": "U0042",
                "userName": "白雪",
                "currentName": "白雪",
            },
            "createTime": "2016-01-01 00:00:00",
            "finishTime": "2016-01-01 00:00:00",
            "updateTime": "",
            "status": 0
        }
    ],
    ...
}
```


##### `查询` addComplaint

添加投诉内容

**Requests:**

- `complaint.cid` (Long): 咨询ID
- `complaint.type` (Short): 类型
- `complaint.dept.did` (Short): 部门ID
- `complaint.staff.uid` (Short): 人员ID
- `complaint.brand.bid` (Short): 品牌ID
- `complaint.content` (String): 内容

```json
{
    "complaint.cid": 1,
    "complaint.type": 1,
    "complaint.dept.did": 1,
    "complaint.staff.uid": 1,
    "complaint.brand.bid": 1,
    "complaint.content": "投诉内容"
}
```


##### `查询` finishComplaint

完结

判断投诉信息是否存在 , 不存在 , 错误信息 **330042 投诉内容不存在**

判断投诉状态是否为1(处理) , 其他状态 , 错误信息 **330043 投诉内容不可操作**

更新投诉状态为2(完结)

**Requests:**

- `complaint.ctid` (Long): 投诉ID

```json
{
    "complaint.ctid": 1
}
```


##### `查询` closeComplaint

关闭

判断投诉内容是否存在 , 不存在 , 错误信息 **330042 投诉内容不存在**

判断投诉内容状态是否为1(处理) , 其他状态 , 错误信息 **330043 投诉内容不可操作**

更新投诉内容状态为3(关闭)

**Requests:**

- `complaint.ctid` (Long): 投诉ID

```json
{
    "complaint.ctid": 1
}
```


> **类**: `api.customer.ComplackAction`


#### 数据类型: `complack`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ckid` | 跟踪ID | Long |
| `cid` | 投诉ID | Long |
| `ctid` | 投诉内容ID | Long |
| `operater` | 操作人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `operateTime` | 操作时间 | Timestamp |
| `comment` | 说明 | String |


##### `查询` queryComplack

通过投诉内容ID获取跟踪信息

**Requests:**

- `complack.ctid` (Long): 投诉内容ID

```json
{
    "complack.ctid": 1
}
```

**Returns:**

- `complacks` (List): 跟踪信息列表 , 每条数据类型 `complack`

```json
{
    ...
    "complacks": [
        {
            "ckid": 1,
            "cid": 1,
            "ctid": 1,
            "operater": {
                "uid": 7,
                "userId": "U0042",
                "userName": "白雪",
                "currentName": "白雪",
            },
            "createTime": "2016-01-01 00:00:00",
            "operateTime": "2016-01-01 00:00:00",
            "comment": "说明"
        }
    ],
    ...
}
```


##### `查询` trackComplack

跟踪

判断投诉内容是否存在 , 不存在 , 错误信息 **330042 投诉内容不存在**

**Requests:**

- `complack.cid` (Long): 投诉ID
- `complack.ctid` (Long): 投诉内容ID
- `complack.comment` (String): 说明

```json
{
    "complack.cid": 1,
    "complack.ctid": 1,
    "complack.comment": "说明"
}
```

### 回访


> **类**: `api.customer.RevisitAction`


#### 数据类型: `revisit`

| 参数 | 说明 | 类型 |
|------|------|------|
| `rid` | 回访ID | Long |
| `decoration` | 装修单 , 类型 [decoration ](./decoration.html#api.decoration.decorationAction.decoration) | Object |
| `type` | 类型 , 0: 保修 , 1: 投诉 | Short |
| `ident` | 引用ID | Long |
| `creater` | 操作人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `gladness` | 满意度 , 0: 初始 , 1: 满意 , 2: 一般 , 3: 投诉 | Short |
| `content` | 内容 | String |


##### `查询` pageRevisit

分页方式获取回访信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 回访信息列表 , 每条数据类型 `revisit`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "rid": 1,
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
                "type": 1,
                "ident": 1,
                "creater": {
                    "uid": 3,
                    "userId": "U0041",
                    "userName": "夏雨",
                    "currentName": "夏雨",
                },
                "createTime": "2016-01-01 00:00:00",
                "gladness": 0,
                "comment": "回访内容"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryRevisitForAepair

获取报修类型回访信息

**Requests:**

- `revisit.ident` (Long): 引用ID

```json
{
    "revisit.ident": 1
}
```

**Returns:**

- `revisits` (List): 回访信息列表 , 每条数据类型 `revisit`

```json
{
    ...
    "revisits": [
        {
            "rid": 1,
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
            "type": 1,
            "ident": 1,
            "creater": {
                "uid": 3,
                "userId": "U0041",
                "userName": "夏雨",
                "currentName": "夏雨",
            },
            "createTime": "2016-01-01 00:00:00",
            "gladness": 0,
            "comment": "回访内容"
        }
    ],
    ...
}
```


##### `查询` queryRevisitForComplain

获取投诉类型回访信息

**Requests:**

- `revisit.ident` (Long): 引用ID

```json
{
    "revisit.ident": 1
}
```

**Returns:**

- `revisits` (List): 回访信息列表 , 每条数据类型 `revisit`

```json
{
    ...
    "revisits": [
        {
            "rid": 1,
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
            "type": 1,
            "ident": 1,
            "creater": {
                "uid": 3,
                "userId": "U0041",
                "userName": "夏雨",
                "currentName": "夏雨",
            },
            "createTime": "2016-01-01 00:00:00",
            "gladness": 0,
            "comment": "回访内容"
        }
    ],
    ...
}
```


##### `查询` queryRevisitByOrderId

通过装修单号获取回访信息

**Requests:**

- `revisit.decoration.orderId` (Long): 装修单号

```json
{
    "revisit.decoration.orderId": "1601010001"
}
```

**Returns:**

- `revisits` (List): 回访信息列表 , 每条数据类型 `revisit`

```json
{
    ...
    "revisits": [
        {
            "rid": 1,
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
            "type": 1,
            "ident": 1,
            "creater": {
                "uid": 3,
                "userId": "U0041",
                "userName": "夏雨",
                "currentName": "夏雨",
            },
            "createTime": "2016-01-01 00:00:00",
            "gladness": 0,
            "comment": "回访内容"
        }
    ],
    ...
}
```


##### `查询` visitRevisit

回访

**Requests:**

- `revisit.decoration.orderId` (Long): 装修单号
- `revisit.type` (Short): 类型
- `revisit.ident` (Long): 引用ID
- `revisit.gladness` (Short): 满意度
- `revisit.comment` (String): 说明

```json
{
    "revisit.decoration.orderId": "1601010001",
    "revisit.type": 1,
    "revisit.ident": 1,
    "revisit.gladness": 0,
    "revisit.comment": "说明"
}
```

## 大客户


> **类**: `api.customer.VustomerAction`


#### 数据类型: `vustomer`

| 参数 | 说明 | 类型 |
|------|------|------|
| `vid` | 大客户ID | Long |
| `unionId` | 归属人ID | String |
| `name` | 姓名 | String |
| `phone` | 电话 | String |
| `address` | 地址 | String |
| `referrer` | 推荐人名 | String |
| `referPhone` | 推荐人电话 | String |
| `createTime` | 创建时间 | Timestamp |
| `belonger` | 归属人 , 类型 [user ](./user.html#api.data.UserAction.user) | Object |
| `orderId` | 装修单号 | String |
| `contractPrice` | 签单额 | Float |
| `status` | 状态 , 0: 有效 , 1: 无效 | Short |


##### `查询` pageVustomer

分页方式获取大客户信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

针对当前登录人员返回归属的大客户信息

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 大客户信息列表 , 每条数据类型 `vustomer`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "vid": 1,
                "unionId": 134,
                "name": "大客户",
                "phone": "138xxxx9872",
                "address": "沈阳市铁西区xxxx30号 1-1-1",
                "referrer": "推荐人",
                "referPhone": "135xxxx1918",
                "createTime": "2016-01-01 00:00:00",
                "belonger": {
                    "uid": 1,
                    "userId": "U0001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "orderId": "",
                "contractPrice": 0.00,
                "status": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageVustomerForAdvance

分页方式获取大客户信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 大客户信息列表 , 每条数据类型 `vustomer`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "vid": 1,
                "unionId": 134,
                "name": "大客户",
                "phone": "138xxxx9872",
                "address": "沈阳市铁西区xxxx30号 1-1-1",
                "referrer": "推荐人",
                "referPhone": "135xxxx1918",
                "createTime": "2016-01-01 00:00:00",
                "belonger": {
                    "uid": 1,
                    "userId": "U0001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "deptType": "行政",
                    "duty": "财务",
                    "phone": "135xxxx1918",
                    "userPhoto": ""
                },
                "orderId": "",
                "contractPrice": 0.00,
                "status": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageVustomerForCommunion

分页方式获取大客户信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

归属人为空的大客户信息

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 大客户信息列表 , 每条数据类型 `vustomer`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "vid": 1,
                "unionId": 134,
                "name": "大客户",
                "phone": "138xxxx9872",
                "address": "沈阳市铁西区xxxx30号 1-1-1",
                "referrer": "推荐人",
                "referPhone": "135xxxx1918",
                "createTime": "2016-01-01 00:00:00",
                "belonger": null,
                "orderId": "",
                "contractPrice": 0.00,
                "status": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询/创建` pageVustomerByUnionId

分页方式获取大客户信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

固定条件为通过unionId获取归属的大客户信息

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 大客户信息列表 , 每条数据类型 `vustomer`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "vid": 1,
                "unionId": 134,
                "name": "大客户",
                "phone": "138xxxx9872",
                "address": "沈阳市铁西区xxxx30号 1-1-1",
                "referrer": "推荐人",
                "referPhone": "135xxxx1918",
                "createTime": "2016-01-01 00:00:00",
                "orderId": "",
                "contractPrice": 0.00,
                "status": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询/创建` queryVustomerByUnionId

通过归属人ID获取大客户信息 , 状态为0(有效)

**Requests:**

- `vustomer.unionId` (String): 归属人ID

```json
{
    "vustomer.unionId": 1918
}
```

**Returns:**

- `vustomers` (List): 大客户信息列表 , 每条数据类型 `vustomer`

```json
{
    ...
    "vustomers": [
        {
            "vid": 1,
            "unionId": 1918,
            "name": "大客户",
            "phone": "138xxxx9872",
            "address": "沈阳市铁西区xxxx30号 1-1-1",
            "referrer": "推荐人",
            "referPhone": "135xxxx1918",
            "createTime": "2016-01-01 00:00:00",
            "orderId": "",
            "contractPrice": 0.00,
            "status": 0
        }
    ],
    ...
}
```


##### `查询/创建` countVustomerByUnionId

统计归属人对应的客户信息

返回结果依次为: 签单总额 , 签单总数 , 客户总数

**Requests:**

- `vustomer.unionId` (String): 归属人ID

```json
{
    "vustomer.unionId": 1918
}
```

**Returns:**

- `counts` (Object): 统计信息信息 , 类型 List <String> , 依次为: 签单总额 , 签单总数 , 客户总数

```json
{
    ...
    "counts":[
        "100000",
        "15",
        "30"
    ],
    ...
}
```


##### `查询/创建` addVustomer

添加大客户信息

**Requests:**

- `vustomer.uniondId` (String): 标识
- `vustomer.name` (String): 姓名
- `vustomer.phone` (String): 电话
- `vustomer.address` (String): 地址
- `vustomer.referrer` (String): 推荐人姓名
- `vustomer.referPhone` (String): 推荐人电话

```json
{
    "vustomer.uniondId": 1918,
    "vustomer.name": "大客户",
    "vustomer.phone": "138xxxx9872",
    "vustomer.address": "沈阳市铁西区xxxx30号 1-1-1",
    "vustomer.referrer": "推荐人",
    "vustomer.referPhone": "135xxxx1918"
}
```


##### `查询` updateVustomer

大客户绑定装修单

判断大客户信息是否存在 , 不存在 , 错误信息 **330003 客户信息不存在**

判断大客户信息是否已经绑定装修单 , 已经绑定 , 错误信息 **330004 客户已绑装修单**

判断绑定装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断绑定装修单状态为2(签约) , 其他状态 , 错误信息 **330006 装修单未签约**

**Requests:**

- `vustomer.vid` (String): 大客户ID
- `vustomer.orderId` (String): 装修单号

```json
{
    "vustomer.vid": 1918,
    "vustomer.orderId": "1601010001"
}
```


##### `查询` freeVustomer

释放大客户信息

判断大客户信息是否存在 , 不存在 , 错误信息 **330003 客户信息不存在**

判断大客户信息是否已经绑定装修单 , 已经绑定 , 错误信息 **330004 客户已绑装修单**

**Requests:**

- `vustomer.vid` (String): 大客户ID

```json
{
    "vustomer.vid": 1918
}
```


##### `查询` takeVustomer

认领大客户信息

判断大客户信息是否存在 , 不存在 , 错误信息 **330003 客户信息不存在**

判断大客户信息是否已经绑定装修单 , 已经绑定 , 错误信息 **330004 客户已绑装修单**

判断大客户是否已经存在归属人 , 存在归属人 , 错误信息 **330007 客户存在归属**

- `vustomer.vid` (String): 大客户ID

```json
{
    "vustomer.vid": 1918
}
```


##### `查询` updateVustomerForBelonger

更新大客户归属信息

判断大客户信息是否存在 , 不存在 , 错误信息 **330003 客户信息不存在**

判断大客户信息是否已经绑定装修单 , 已经绑定 , 错误信息 **330004 客户已绑装修单**

**Requests:**

- `vustomer.vid` (String): 标识
- `vustomer.belonger.userId` (String): 归属人ID

```json
{
    "vustomer.vid": 1918,
    "vustomer.belonger.userId": "U0001"
}
```


##### `查询/创建` deleteVustomer

逻辑删除大客户信息 , 更新状态为1(无效)

**Requests:**

- `vustomer.vid` (String): 标识

```json
{
    "vustomer.vid": 1,
}
```


> **类**: `api.customer.VustomerNetAction`


大客户关系网


#### 数据类型: `vustomerNet`

| 参数 | 说明 | 类型 |
|------|------|------|
| `vnid` | 客户网ID | Long |
| `unionId` | 归属人ID | String |
| `netunionId` | 关系人ID | String |


##### `查询/创建` countVustomerNetByUnionId

统计客户关系网

返回结果依次为: 关系客户数

**Requests:**

- `vustomerNet.unionId` (String): 归属人ID

```json
{
    "vustomerNet.unionId": 1918
}
```

**Returns:**

- `counts` (Object): 统计信息信息 , 类型 List <String> , 依次为: 关系客户数

```json
{
    ...
    "counts":[
        "2"
    ],
    ...
}
```


##### `查询/创建` buildVustomerNet

建立客户关系

判断关系人ID是否绑定归属人ID , 如果存在 , 错误信息 ** 客户关系已存在**

**Requests:**

- `vustomerNet.unionId` (String): 归属人ID
- `vustomerNet.netunionId` (String): 关系人ID

```json
{
    "vustomerNet.unionId": 1918,
    "vustomerNet.netunionId": 1919
}
```


> **类**: `api.customer.VrecordAction`


客户记录信息


#### 数据类型: `vrecord`

| 参数 | 说明 | 类型 |
|------|------|------|
| `vrid` | 记录ID | Long |
| `vid` | 大客户ID | Long |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `comment` | 内容 | String |


##### `查询` queryVrecordByVid

通过大客户ID获取记录信息

**Requests:**

- `vrecord.vid` (String): 大客户ID

```json
{
    "vrecord.vid": 1,
}
```

**Returns:**

- `vrecords` (List): 记录信息列表 , 每条数据类型 `vrecord`

```json
{
    ...
    "vrecords": [
        {
            "vrid": 1,
            "vid": 1,
            "creater": {
                "uid": 1,
                "userId": "U0479",
                "userName": "白雪",
                "currentName": "白雪"
            },
            "createTime": "2016-01-01 00:00:00",
            "comment": "说明"
        }
    ],
    ...
}
```


##### `查询` addVrecord

添加大客户对应的记录信息

**Requests:**

- `vrecord.vid` (String): 大客户ID
- `vrecord.comment` (String): 说明

```json
{
    "vrecord.vid": 1,
    "vrecord.comment": "说明",
}
```


> **类**: `api.customer.VscoreAction`


客户积分相关信息


#### 数据类型: `vscore`

| 参数 | 说明 | 类型 |
|------|------|------|
| `vsid` | 积分ID | Long |
| `unionId` | 归属人ID | String |
| `score` | 积分 | Integer |


#### 数据类型: `vscoreRecord`

| 参数 | 说明 | 类型 |
|------|------|------|
| `vsrid` | 积分记录ID | Long |
| `unionId` | 归属人ID | String |
| `orderId` | 装修单号 | String |
| `score` | 积分 | Integer |
| `operater` | 操作人 | Object |
| `operateTime` | 操作时间 | Timestamp |
| `type` | 类型 , 0: 新增 , 1: 提取 | Short |
| `status` | 状态 , 0: 初始 , 1: 通过 | Short |
| `comment` | 备注 | String |


##### `查询/创建` queryVscoreByUnionId

通过归属人ID获取积分信息

**Requests:**

- `vscore.unionId` (String): 归属人ID

```json
{
    "vrecord.unionId": 1918,
}
```

**Returns:**

- `vscore` (Object): 积分信息 , 类型 `vscore`

```json
{
    ...
    "vscore": {
        "vsid": 1,
        "vid": 1,
        "unionId": "1918",
        "score": 100
    }
    ...
}
```


##### `查询` pageVscoreRecordByUnionId

分页方式获取积分记录信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

默认条件为归属人ID

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 积分记录列表 , 每条数据类型 `vscoreRecord`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "vsrid": 1,
                "unionId": "1918",
                "score": 100,
                "type": 0,
                "operater": {
                    "uid": 1,
                    "userId": "U0479",
                    "userName": "白雪",
                    "currentName": "白雪"
                },
                "operateTime": "2016-01-01 00:00:00",
                "comment": "说明"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` updateVscoreRecordForStatus

更新积分记录状态

判断积分记录类型以及状态不同情况进行处理

通过增加类型的积分记录 , 归属人ID对应的积分值增加

拒绝提取类型的积分记录 , 归属人ID对应的积分值增加


##### `查询` raiseVscore

增加积分

根据归属人ID获取积分信息 , 不存在创建积分信息

生成对应的积分记录 , 更新积分信息中的积分值

**Requests:**

- `vscore.unionId` (String): 归属人ID
- `vscore.score` (Integer): 积分

```json
{
    "vrecord.unionId": "1918",
    "vrecord.score": 1000
}
```


##### `查询/创建` pickupVscore

提取积分

根据归属人ID获取积分信息 , 不存在 , 错误信息 ** 积分不存在**

判断积分信息中积分值是否大于提取积分值 , 不满足提取积分值 , 错误信息 ** 积分不足**

生成积分记录信息 , 同时减少归属人ID积分信息中的积分值

**Requests:**

- `vscore.unionId` (String): 归属人ID
- `vscore.score` (Integer): 积分

```json
{
    "vrecord.unionId": "1918",
    "vrecord.score": 1000
}
```

## 资料


### 订单


> **类**: `api.customer.DecorationAction`


#### 数据类型: `decoration`

| 参数 | 说明 | 类型 |
|------|------|------|
| `did` | 装修单ID | Long |
| `unionId` | 联合ID | String |
| `orderId` | 装修单号 | String |
| `address` | 楼盘楼号 | String |
| `designer` | 设计师 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `salesman` | 业务员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `supervisor` | 监理 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `houseArea` | 面积 | Float |
| `totalPrice` | 合同额 | Float |
| `defaultFlag` | 默认订单,0:初始 1:默认 | String |
| `memberFlag` | 会员状态,0:初始 1:会员 | String |


#### 数据类型: `decorationActivity`

| 参数 | 说明 | 类型 |
|------|------|------|
| `orderId` | 装修单号 | String |
| `activity` | 活动信息 | String |


##### `查询/创建` queryCusDecoration

通过unionId获取绑定的所有装修单信息

**Requests:**

- `unionId` (String): 联合ID

```json
{
    "unionId": "SDJ4SDF5"
}
```

**Returns:**

- `decorations` (List): 装修单列表 , 每条数据类型 :[decoration ](./customer.html#api.customer.DecorationAction.decoration)

```json
{                    
    ...
    "decorations": [
        {
            "did": 1,
            "orderId": "1601010001",
            "address": "广场一期 1#1-1-1",
            "defaultFlag": 0,
            "memberFlag": 0
        }
    ],
    ...
}
```


##### `查询/创建` queryCusDecorationForDefault

通过unionId获取默认装修单

**Requests:**

- `unionId` (String): 联合ID

```json
{
    "unionId": "SDJ4SDF5"
}
```

**Returns:**

- `decoration` (Object): 装修单信息 , 类型 :[decoration ](./customer.html#api.customer.DecorationAction.decoration)

```json
{
    ...
    "decoration":{
        "did": 1,
        "orderId": "1601010001",
        "address": "广场一期 1#1-1-1",
        "designer": {
            "uid": 2,
            "userId": "U686",
            "userName": "白雪",
            "currentName": "白雪",
            "phone": "138xxxx1828",
            ...
        },
        "salesman": {
            "uid": 3,
            "userId": "U638",
            "userName": "李宁",
            "currentName": "李宁",
            "phone": "156xxxx9283",
            ...
        },
        "supervisor": null,
        "houseArea": 100,
        "totalPrice": 100000,
        "defaultFlag": 0,
        "memberFlag": 0
    }
    ...
}
```


##### `查询/创建` queryCusDecorationByOrderId

通过unionId获取装修单

**Requests:**

- `unionId` (String): 联合ID
- `decoration.orderId` (String): 装修单号

```json
{
    "unionId": "SDJ4SDF5",
    "decoration.orderId": "1601010001"
}
```

**Returns:**

- `decoration` (Object): 装修单信息 , 类型 :[decoration ](./customer.html#api.customer.DecorationAction.decoration)

```json
{
    ...
    "decoration":{
        "did": 1,
        "orderId": "1601010001",
        "address": "广场一期 1#1-1-1",
        "designer": {
            "uid": 2,
            "userId": "U686",
            "userName": "白雪",
            "currentName": "白雪",
            "phone": "138xxxx1828",
            ...
        },
        "salesman": {
            "uid": 3,
            "userId": "U638",
            "userName": "李宁",
            "currentName": "李宁",
            "phone": "156xxxx9283",
            ...
        },
        "supervisor": null,
        "houseArea": 100,
        "totalPrice": 100000,
        "defaultFlag": 0,
        "memberFlag": 0
    }
    ...
}
```


##### `查询/创建` queryCusDecorationUser

分页方式获取装修单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter) .

**Requests:**

- `unionId` (String): 联合ID
- `decoration.orderId` (String): 装修单号

```json
{
    "unionId": "SDJ4SDF5",
    "decoration.orderId": "1601010001"
}
```

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 人员信息列表 , 每条数据类型 :[decorationUser ](./decoration.html#api.decoration.DecorationUserAction.decorationUser)

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "duid": 1,
                "orderId": "1601010001",
                "user": {
                    "uid": 1,
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师" 
                    "userPhoto": "1d7184baf670d0370658.png"
                },
                "content": "说明"
            }
        ],
        ...
    },
    ...
}
```


##### `查询/创建` queryCusDecorationActivity

获取装修单活动信息

**Requests:**

- `decorationActivity.orderId` (String): 装修单号

```json
{
    "decorationActivity.orderId": "1601010001"
}
```

**Returns:**

- `decorationActivity` (Object): 活动信息 , 每条数据类型 `decorationActivity`

```json
{
    ...
    "decorationActivity": {
        "orderId": "1601010001",
        "activity": "装修活动"
    }
    ...
}
```


##### `查询/创建` queryCusDecorationHolonomy

获取装修单半价信息

**Requests:**

- `decorationHolonomy.orderId` (String): 装修单号

```json
{
    "decorationHolonomy.orderId": "1601010001"
}
```

**Returns:**

- `decorationHolonomy` (Object): 半价/满减信息 , 每条数据类型 `decorationHolonomy`

```json
{
    ...
    "decorationHolonomy": {
        "name": null,
        "maching": 2,
        "discount": 5,
        "discountbase": 1,
        "projectBase": 50000,
        "projectPrice": 25000,
        "managePrice": 8000,
        "manageRate": 0.16,
        "materialPrice": 116000,
        "servicePrice": 11600,
        "serviceRate": 0.1,
        "materialPaidup": 0,
        "servicePaidup": 0
    }
    ...
}
```


##### `查询/创建` vodeCusDecoration

短信验证

**Requests:**

- `decoration.orderId` (String): 装修单号

```json
{
    "decoration.orderId": "1601010001"
}
```

**Returns:**

- `securityCode` (String): 验证码

```json
{
    ...
    "securityCode": "SUDF2JH3J423NJ"
    ...
}
```


##### `查询/创建` bindingCusDecoration

绑定装修单

按照规则判断验证码和校验码 , 不匹配 , 错误信息 **330008 绑定订单失败,验证码错误**

通过电话获取到对应客户的装修单 , 如果没有可绑定装修单 , 错误信息 **330009 无可绑定订单**

**Requests:**

- `decoration.unionId` (String): 联合ID
- `decoration.orderId` (String): 装修单号
- `phone` (String): 客户电话
- `securityCode` (String): 验证码
- `verifyCode` (String): 校验码

```json
{
    "decoration.unionId": "SDJ4SDF5",
    "decoration.orderId": "1601010001",
    "phone": "13333333333",
    "securityCode": "1234",
    "verifyCode": "1234"
}
```


##### `查询/创建` updateCusDecorationForDefault

更换默认装修单

**Requests:**

- `unionId` (String): 联合ID
- `decoration.orderId` (String): 装修单号

```json
{
    "unionId": "SDJ4SDF5",
    "decoration.orderId":"1601010001"
}
```


##### `查询` unbindingCusDecoration

解绑装修单

按照规则判断验证码和校验码 , 不匹配 , 错误信息 **330008 绑定订单失败,验证码错误**

**Requests:**

- `decoration.unionId` (String): 联合ID
- `decoration.orderId` (String): 装修单号

```json
{
    "decoration.unionId": "SDJ4SDF5",
    "decoration.orderId": "1601010001"
}
```

### 款项


> **类**: `api.customer.PaymentAction`


#### 数据类型: `advancePayment`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cid` | 客户ID | Long |
| `balance` | 合同预付款 | Float |
| `projectBalance` | 工程预付款 | Float |
| `materialBalance` | 主材预付款 | Float |
| `zhenglinBalance` | 正林预付款 | Float |


#### 数据类型: `payment`

| 参数 | 说明 | 类型 |
|------|------|------|
| `orderId` | 装修单号 | String |
| `money` | 操作额 | Float |
| `type` | 类型 , 收款 , 退款 | String |
| `paymentType` | 款项类型 | String |
| `brand` | 品牌 | String |
| `collectTime` | 收款时间 | Timestamp |


#### 数据类型: `decorationPayment`

| 参数 | 说明 | 类型 |
|------|------|------|
| `orderId` | 装修单号 | String |
| `referMoney` | 金额 | Float |
| `collectTime` | 收款时间 | Timestamp |
| `coupon` | 券金额 | Float |
| `couponInfo` | 券信息 | String |
| `paymentStatus` | 状态 | Short |
| `paymentType` | 类型 | String |


#### 数据类型: `materialPayment`

| 参数 | 说明 | 类型 |
|------|------|------|
| `orderId` | 装修单号 | String |
| `category` | 品类 | String |
| `brand` | 品牌 | String |
| `no` | 主材单号 | String |
| `referMoney` | 金额 | Float |
| `collectTime` | 收款时间 | Timestamp |
| `coupon` | 券金额 | Float |
| `couponInfo` | 券信息 | String |
| `paymentStatus` | 状态 | Short |
| `paymentType` | 类型 | Short |


#### 数据类型: `salesPayment`

| 参数 | 说明 | 类型 |
|------|------|------|
| `orderId` | 装修单号 | String |
| `brand` | 品牌 | String |
| `money` | 金额 | Float |
| `collectTime` | 收款时间 | Timestamp |
| `status` | 状态 | Short |
| `paymentType` | 类型 | Short |


#### 数据类型: `servicePayment`

| 参数 | 说明 | 类型 |
|------|------|------|
| `orderId` | 装修单号 | String |
| `advanceMoney` | 预付款 | Float |
| `serviceMoney` | 服务款 |  |
| `collectTime` | 收款时间 | Timestamp |
| `status` | 状态 | Short |
| `type` | 类型 | Short |


#### 数据类型: `proxyPayment`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ppid` | 代付款ID | Long |
| `title` | 标题 | String |
| `name` | 名称 | String |
| `phone` | 电话 | String |
| `address` | 地址 | String |
| `unionId` | 联合ID | String |
| `orderId` | 装修单号 | String |
| `referMoney` | 金额 | Integer |
| `type` | 类型 | Short |
| `status` | 状态 | Short |
| `platform` | 平台信息 | String |


##### `查询/创建` queryCusAdvance

通过客户ID查询预付款信息

**Requests:**

- `advance.cid` (Long): 客户ID

```json
{
    "advance.cid": 1,
}
```

**Returns:**

- `advance` (Object): 预付款信息 , 每条数据类型 :advance

```json
{
    ...
    "advance": 
        {
            "balance": 0,
            "materialBalance": 0,
            "projectBalance": 0,
            "zhenglinBalance": 0                    
        }
    ...
}
```


##### `查询/创建` queryCusPayment

分页方式通过装修单号获取预付款明细信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter) .

**Requests:**

- `payment.orderId` (String): 装修单号

```json
{
    "payment.orderId": "1601010001"
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 款项列表 , 每条数据类型 `payment`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "orderId": "1601010001",
                "money": 100,
                "type": 0,
                "paymentType": "0",
                "collectTime": "2016-01-01 00:00:00"
            }
        ],
        ...
    },
    ...
}
```


##### `查询/创建` queryCusDecorationPayment

分页方式通过装修单号获取装修款项信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter) .

**Requests:**

- `payment.orderId` (String): 装修单号

```json
{
    "payment.orderId": "1601010001"
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 款项信息列表 , 每条数据类型 `decorationPayment`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "orderId": "1601010001",
                "referMoney": 100,
                "collectTime": "2016-01-01 00:00:00",
                "coupon": 10,
                "couponInfo": "优惠券",
                "paymentStatus": 0,
                "paymentType": "首付款"

            }
        ],
        ...
    },
    ...
}
```


##### `查询/创建` queryCusDecorationPaymentForContract

获取装修单的合同类型款项 , 一类为0(收款) , 二类为1(合同) , 状态为1(已付款)和2(已确认)

**Requests:**

- `payment.orderId` (String): 装修单号

```json
{
    "payment.orderId": "1601010001"
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 款项信息列表 , 每条数据类型 `decorationPayment`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "orderId": "1601010001",
                "referMoney": 100,
                "collectTime": "2016-01-01 00:00:00",
                "coupon": 10,
                "couponInfo": "优惠券",
                "paymentStatus": 0,
                "paymentType": "首付款"

            }
        ],
        ...
    },
    ...
}
```


##### `查询/创建` queryCusMaterialPayment

分页方式通过装修单号获取主材款项信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter) .

**Requests:**

- `payment.orderId` (String): 装修单号

```json
{
    "payment.orderId": "1601010001"
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 款项信息列表 , 每条数据类型 `materialPayment`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "orderId": "1601010001",
                "category": "品类",
                "brand": "品牌",
                "no": "M1601010001",
                "referMoney": 100,
                "collectTime": "2016-01-01 00:00:00",
                "coupon": 10,
                "couponInfo": "优惠券",
                "paymentStatus": 1,
                "paymentType": "2"

            }
        ],
        ...
    },
    ...
}
```


##### `查询/创建` queryCusSalesPayment

分页方式通过装修单号获取销售款项信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter) .

**Requests:**

- `payment.orderId` (String): 装修单号

```json
{
    "payment.orderId": "1601010001"
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 款项信息列表 , 每条数据类型 `salesPayment`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "orderId": "1601010001",
                "brand": "品牌",
                "referMoney": 100,
                "collectTime": "2016-01-01 00:00:00",
                "status": 1,
                "paymentType": "2"
            }
        ],
        ...
    },
    ...
}
```


##### `查询/创建` queryCusServicePayment

分页方式通过装修单号获取服务款项信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter) .

**Requests:**

- `payment.orderId` (String): 装修单号

```json
{
    "payment.orderId": "1601010001"
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 款项信息列表 , 每条数据类型 `servicePayment`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "orderId": "1601010001",
                "advanceMoney": 0,
                "serviceMoney": 100,
                "collectTime": "2016-01-01 00:00:00",
                "type": 0,
                "type": 0

            }
        ],
        ...
    },
    ...
}
```


##### `查询/创建` queryCusProxyPayment

获取代付款信息

**Requests:**

- `proxyPayment.ppid` (Long): 款项ID

```json
{
    "proxyPayment.ppid": "1601010001"
}
```

**Returns:**

- `proxyPayment` (Object): 代付款信息 , 类型 `proxyPayment`

```json
{
    ...
    "proxyPayment": {
        "ppid": 1,
        "title": "标题",
        "name": "名称",
        "phone": "",
        "address": "",
        "unionId": "",
        "orderId": "",
        "referMoney": 1000,
        "type": 0,
        "status": 0
    },
    ...
}
```


##### `查询/创建` countCusMaterialPaymentForAmount

统计主材款 , 状态为1(已付款)和2(已确认)

**Requests:**

- `materialPayment.orderId` (String): 装修单号

```json
{
    "materialPayment.orderId": "1601010001"
}
```

**Returns:**

- `realMoney` (Float): 总额

```json
{
    "realMoney": 1020.00
}
```


##### `查询/创建` countCusSalesPaymentForAmount

统计销售款 , 状态为1(已付款)和2(已确认)

**Requests:**

- `salesPayment.orderId` (String): 装修单号

```json
{
    "salesPayment.orderId": "1601010001"
}
```

**Returns:**

- `realMoney` (Float): 总额

```json
{
    "realMoney": 1020.00
}
```


##### `查询/创建` countCusServicePaymentForAmount

统计服务款 , 状态为1(已付款)和2(已确认)

**Requests:**

- `servicePayment.orderId` (String): 装修单号

```json
{
    "servicePayment.orderId": "1601010001"
}
```

**Returns:**

- `realMoney` (Float): 总额

```json
{
    "realMoney": 1020.00
}
```

### 合同


> **类**: `api.customer.ContractAction`


#### 数据类型: `contract`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dcid` | 合同ID | Long |
| `orderId` | 装修单号 | String |
| `contract` | 模版 , 类型: [contract ](./data.html#api.communion.ContractAction.contract) | Object |
| `download` | 下载地址 | String |
| `viewpdf` | 查看地址 | String |
| `createTime` | 创建时间 | Timestamp |
| `comsignTime` | 公司签时间 | Timestamp |
| `cussignTime` | 客户签时间 | Timestamp |
| `status` | 状态 , 0: 初始 , 1: 已签 , 2: 失效 , 3: 归档 , 4: 归档(本地) | Short |
| `ishow` | 显示标识 | Short |


##### `查询` queryCusContract

通过装修单号获取合同信息

**Requests:**

- `contract.orderId` (String): 装修单号

```json
{
    "contract.orderId": "1601010001"
}
```

**Returns:**

- `contracts` (List): 合同信息列表 , 类型 `contract`

```json
{
    ...
    "contracts":[
        {
            "dcid": 1,
            "orderId": "1601010001",
            "contract": {
                "cid": 1,
                "no": "74HENIDH121H",
                "name": "合同模版",
                "title": "合同标题"
            }
            "viewpdf": "JKLSHFD213J12GH312U32.pdf",
            "download": "JKLSHFD213J12GH312U32.pdf",
            "signner": null,
            "createTime": "2016-01-01 00:00:00",
            "comsignTime": null,
            "cussignTime": null,
            "status": 0,
            "ishow": 0
        },
        ...
    ],
    ...
}
```

### 图片


> **类**: `api.customer.PictureAction`


#### 数据类型: `picture`

| 参数 | 说明 | 类型 |
|------|------|------|
| `name` | 文件名 | String |
| `path` | 路径 | String |


##### `查询/创建` queryCusDecorationPicture

分页方式获取装修图片 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Requests:**

- `orderId` (String): 装修单号

```json
{
    "orderId": "1601010001"
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 图片信息列表 , 每条数据类型 `picture`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "name": fanglin1.png,
                "path": "wKgFZ1nQz1WAEzcJPnQo181.png"
            }
        ],
        ...
    },
    ...
}
```


##### `查询/创建` queryCusConstructionDrawing

分页方式获取工程图片 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Requests:**

- `orderId` (Long): 工程ID
- `schedule` (Integer): 施工进度

```json
{
    "orderId": 1,
    "schedule": 1
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 图片信息列表 , 每条数据类型 `picture`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "name": fanglin1.png,
                "path": "wKgFZ1nQz1WAEzcJPnQo181.png"
            }
        ],
        ...
    },
    ...
}
```

### 工程


> **类**: `api.customer.ConstructionAction`


#### 数据类型: `construction`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cid` | 工程ID | Long |
| `createTime` | 创建时间 | Timestamp |


#### 数据类型: `constructer`

| 参数 | 说明 | 类型 |
|------|------|------|
| `userId` | 人员编号 | String |
| `userName` | 名称 | String |
| `currentName` | 名称 | String |
| `phone` | 电话 | String |
| `schedule` | 施工节点 | Short |
| `userPhoto` | 照片路径 | String |


##### `查询/创建` queryCusConstruction

通过装修单号获取工程信息

**Requests:**

- `orderId` (String): 装修单号

```json
{
    "orderId": "1601010001"
}
```

**Returns:**

- `construction` (Object): 工程信息 , 类型 `construction`

```json
{
    ...
    "construction": {
        "cid": 1,
        "createTime": "2016-01-01 00:00:00"
    },
    ...
}
```


##### `查询/创建` queryCusConstructionSchedule

通过装修单号获取施工环节信息

**Requests:**

- `orderId` (String): 装修单号

```json
{
    "orderId": "1601010001"
}
```

**Returns:**

- `constructionSchedules` (List): 施工环节信息列表 , 类型 `construction`

```json
{
    ...
    "constructionSchedules": [
        {
            "csid": 1
            "cid": 1,
            "orderId": "1601010001",
            "node": "节点名称",
            "schedule": 1,
            "startTime": "2016-01-01",
            "endTime": "2016-01-01"
        }
    ]{

    },
    ...
}
```


##### `查询/创建` queryCusConstructer

分页方式通过装修单号获取工人信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Requests:**

- `unionId` (String): 联合ID
- `orderId` (String): 装修单号

```json
{
    "unionId": "SDJ4SDF5",
    "orderId": "1601010001"
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 图片信息列表 , 每条数据类型 [user ](./user.html#api.personel.UserAction.user)

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "uid": 3,
                "userId": "U638",
                "userName": "李宁",
                "currentName": "李宁",
                "phone": "156xxxx9283",
                "userPhoto": "1d7184baf670d0370658.png"
            }
        ],
        ...
    },
    ...
}
```

### 审批


> **类**: `api.customer.ApprovalAction`


#### 数据类型: `approval`

| 参数 | 说明 | 类型 |
|------|------|------|
| `aid` | 审批ID | Long |
| `type` | 类型 | Short |
| `status` | 状态 , 包括: 0: 初始 , 1: 审批通过 , 2: 审批拒绝 , 3: 审批中 , 4: 发起失败 , 5: 客户确认 | Short |
| `createTime` | 创建时间 | Timestamp |
| `approvalTime` | 审批时间 | Timestamp |
| `contents` | 说明信息 , 系统自动生成 | String |
| `comment` | 备注 | String |
| `annotate` | 批注 | String |


##### `查询/创建` queryApproval

获取审批信息

**Requests:**

- `approval.aid` (String): 审批ID

```json
{
    "approval.aid": 1
}
```

**Returns:**

- `approval` (Object): 审批信息

```json
{
    ...
    "approval": {
        "aid": 1,
        "type": 0,
        "status": 5,
        "createTime": "2016-01-01 00:00:00",
        "approvalTime": "2016-01-01 00:00:00",
        "contents": "说明",
        "comment": "备注",
        "annotate": "批注",
    },
    ...
}
```


##### `查询/创建` confirmApproval

确认审批信息

**Requests:**

- `approval.aid` (String): 审批ID

```json
{
    "approval.aid": 1
}
```

## 功能


### 反馈


反馈信息管理


> **类**: `api.customer.FeedbackAction`


#### 数据类型: `feedback`

| 参数 | 说明 | 类型 |
|------|------|------|
| `fid` | 反馈ID | Long |
| `unionId` | 联合ID | String |
| `orderId` | 装修单号 | String |
| `phone` | 电话 | String |
| `picture` | 图片 | String |
| `content` | 说明 | String |
| `createTime` | 创建时间 | Timestamp |
| `type` | 类型, 0: 反馈 , 1: 投诉 , 2: 维修 | Short |
| `company` | 公司 | Integer |


##### `查询` pageFeedback

分页方式获取反馈信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter) .

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 反馈信息列表 , 每条数据类型 `feedback`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "fid": 1,
                "unionId": "SDJ4SDF5",
                "orderId": "1601010001",
                "phone": "13800254521",
                "picture": "bd9f4736d3334afd87318c5c24fe6c44.jpg",
                "content": "反馈信息",
                "type": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询/创建` addFeedback

添加反馈

**Requests:**

- `feedback.unionId` (String): 联合ID
- `feedback.orderId` (String): 装修单号
- `feedback.phone` (String): 电话
- `feedback.picture` (String): 图片
- `feedback.content` (String): 反馈信息
- `feedback.type` (Short): 类型
- `feedback.drawings` (List): 图片列表

```json
{
    "feedback.unionId": "SDJ4SDF5",
    "feedback.orderId": "1601010001",
    "feedback.phone": "13800254521",
    "feedback.picture": "bd9f4736d3334afd87318c5c24fe6c44.jpg",
    "feedback.content": "反馈信息",
    "feedback.type": 0,
    "feedback.drawings[0]": "bd9f4736d3334afd87318c5c24fe6c44.jpg"
}
```


> **类**: `api.customer.FeedbackDrawingAction`


#### 数据类型: `feedbackDrawing`

| 参数 | 说明 | 类型 |
|------|------|------|
| `fdid` | 图片ID | Long |
| `fid` | 反馈ID | String |
| `path` | 路径 | String |
| `createTime` | 创建时间 | Timestamp |
| `status` | 状态 | Short |


##### `查询/创建` queryFeedbackDrawing

**Requests:**

- `feedback.fid` (Long): 反馈ID

```json
{
    "feedback.fid": 1
}
```

**Returns:**

- `feedbackDrawings` (List): 图片信息列表 , 每条数据类型 `feedbackDrawing`

```json
{
    ...
    "feedbackDrawings": [
        {
            "fdid": 1,
            "fid": 1,
            "path": "bd9f4736d3334afd87318c5c24fe6c44.jpg"
        }
    ],
    ...
}
```


##### `查询` addFeedbackDrawing

**Requests:**

- `feedbackDrawing.fid` (Long): 反馈ID
- `feedbackDrawing.path` (String): 地址

```json
{
    "feedbackDrawing.fid": 1,
    "feedbackDrawing.fid": "bd9f4736d3334afd87318c5c24fe6c44.jpg"
}
```

### 调研


> **类**: `api.customer.SurveyAction`


#### 数据类型: `survey`

| 参数 | 说明 | 类型 |
|------|------|------|
| `sid` | 调研ID | Long |
| `stid` | 模版ID | Long |
| `orderId` | 装修单号 | String |
| `name` | 名称 | String |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `sender` | 推送人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `finisher` | 完成人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `sendTime` | 推送时间 | Timestamp |
| `handleTime` | 处理时间 | Timestamp |
| `finishTime` | 完成时间 | Timestamp |
| `status` | 状态 , 0: 初始, 1: 推送 , 2: 处理 , 3: 完成 | Short |
| `company` | 公司 | Integer |
| `items` | 项目列表 , 每条数据类型 [surveyItem ](./customer.html#api.customer.SurveyAction.surveyItem) | List |


#### 数据类型: `surveyItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `siid` | 项目ID | Long |
| `sid` | 调研ID | Long |
| `name` | 名称 | String |
| `type` | 类型 , 0: 文本 , 1: 输入框 , 2: 单选 , 3: 多选 | Short |
| `content` | 内容 | String |
| `options` | 选项列表 , 每条数据类型 [surveyOption ](./customer.html#api.customer.SurveyAction.surveyOption) |  |


#### 数据类型: `surveyOption`

| 参数 | 说明 | 类型 |
|------|------|------|
| `soid` | 选项ID | Long |
| `siid` | 项目ID | Long |
| `sid` | 调研ID | Long |
| `title` | 标题 | String |
| `checked` | 标识 , 0: 已选 , 1: 未选 | Short |


##### `查询` pageSurvey

分页方式获取调研模版信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 调研列表 , 每条数据类型 `survey`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "sid": 1,
                "stid": 1,
                "name": "模版",
                "orderId": "1601010001",
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "sender": null,
                "finisher": null,
                "createTime": "2016-01-01 00:00:00",
                "sendTime": "2016-01-01 00:00:00",
                "handleTime": "2016-01-01 00:00:00",
                "finishTime": "2016-01-01 00:00:00",
                "status": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` querySurveyByOrderId

通过装修单号获取调研信息

**Requests:**

- `survey.orderId` (String): 装修单号

```json
{
    "survey.orderId": "1601010001"
}
```

**Returns:**

- `surveys` (List): 调研信息列表 , 每条数据类型 `survey`

```json
{
    ...
    "surveys": [
        {
            "sid": 1,
            "stid": 1,
            "name": "模版",
            "orderId": "1601010001",
            "creater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "sender": null,
            "finisher": null,
            "createTime": "2016-01-01 00:00:00",
            "sendTime": "2016-01-01 00:00:00",
            "handleTime": "2016-01-01 00:00:00",
            "finishTime": "2016-01-01 00:00:00",
            "status": 0
        }
    ],
    ...
}
```


##### `查询` querySurveyBySid

通过装修单号获取调研信息

**Requests:**

- `survey.sid` (Long): 调研ID

```json
{
    "survey.sid": 1
}
```

**Returns:**

- `survey` (Object): 调研 , 数据类型 `survey`

```json
{
    ...
    "surveys": [
        {
            "sid": 1,
            "stid": 1,
            "name": "模版",
            "orderId": "1601010001",
            "creater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "sender": null,
            "finisher": null,
            "createTime": "2016-01-01 00:00:00",
            "sendTime": "2016-01-01 00:00:00",
            "handleTime": "2016-01-01 00:00:00",
            "finishTime": "2016-01-01 00:00:00",
            "status": 0,
            "items": [
                {
                    "siid": 1,
                    "sid": 1,
                    "name": "项目",
                    "type": 0,
                    "content": "内容",
                },
                {
                    "siid": 1,
                    "sid": 1,
                    "name": "项目",
                    "type": 2,
                    "content": "内容",
                    "options": [
                        {
                            "soid": 1,
                            "siid": 1,
                            "sid": 1,
                            "title": "选项",
                            "checked": 0
                        }
                    ]
                }
            ]
        }
    ],
    ...
}
```


##### `查询` makeSurvey

生成调研

判断调研模版是否存在 , 不存在 , 错误信息 **130096 调研模版不存在**

**Requests:**

- `survey.orderId` (String): 装修单号
- `survey.stid` (Long): 模版ID

```json
{
    "survey.orderId": "1601010001",
    "survey.stid": 1
}
```


##### `查询` sendSurvey

推送调研

判断调研是否存在 , 不存在 , 错误信息 **330058 调研不存在**

判断调研装修是否为0(初始) , 其他状态 , 错误信息 **330059 调研状态不可操作**

更新状态为1(推送) , 更新推送时间/推送人

**Requests:**

- `survey.sid` (Long): 调研ID

```json
{
    "survey.sid": 1,

    "survey.items[0].siid": 1,
    "survey.items[0].content": "内容",

    "survey.items[0].options[0].soid": 1,
    "survey.items[0].options[0].checked": 1,
}
```


##### `查询` handleSurvey

执行调研

判断调研是否存在 , 不存在 , 错误信息 **330058 调研不存在**

判断调研装修是否为1(推送) , 其他状态 , 错误信息 **330059 调研状态不可操作**

更新状态为2(处理) , 更新完成时间

**Requests:**

- `survey.sid` (Long): 调研ID

```json
{
    "survey.sid": 1,

    "survey.items[0].siid": 1,
    "survey.items[0].content": "内容",

    "survey.items[0].options[0].soid": 1,
    "survey.items[0].options[0].checked": 1,
}
```


##### `查询` finishSurvey

完成

判断调研是否存在 , 不存在 , 错误信息 **330058 调研不存在**

判断调研装修是否为2(处理) , 其他状态 , 错误信息 **330059 调研状态不可操作**

更新状态为3(完成) , 更新完成时间/完成人

**Requests:**

- `survey.sid` (Long): 调研ID

```json
{
    "survey.sid": 1
}
```

### 会员


会员信息管理


> **类**: `api.customer.EmemberAction`


#### 数据类型: `emember`

| 参数 | 说明 | 类型 |
|------|------|------|
| `emid` | 电子会员ID | Long |
| `unionId` | 联合ID | String |
| `no` | 会员编号 | String |
| `name` | 姓名 | String |
| `phone` | 电话 | String |
| `address` | 地址 | String |
| `unionId` | 联合ID | String |
| `ticket` | 票号 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |


##### `查询` pageEmember

分页方式获取电子会员信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter) .

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 电子会员信息列表 , 每条数据类型 `emember`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "emid": 1,
                "unionId": "SDJ4SDF5"
                "no": "37487263472",
                "name": "客户",
                "address": "广场一期 1#1-1-1",
                "phone": "138xxxx2738",
                "ticket": "37487263472"
            }
        ],
        ...
    },
    ...
}
```


##### `查询/创建` queryEmember

通过unionId获取电子会员信息

**Requests:**

- `unionId` (String): 联合ID

```json
{
    "unionId": "SDJ4SDF5"
}
```

**Returns:**

- `emember` (Object): 电子会员信息 , 类型 :[emember ](./customer.html#api.customer.EmemberAction.emember)

```json
{
    ...
    "emember": {
        "emid": 1,
        "unionId": "SDJ4SDF5"
        "no": "37487263472",
        "name": "客户",
        "address": "广场一期 1#1-1-1",
        "phone": "138xxxx2738",
        "ticket": "37487263472"
    }
    ...
}
```


##### `查询/创建` addEmember

添加电子会员

**Requests:**

- `emember.unionId` (String): 联合ID
- `emember.name` (String): 姓名
- `emember.phone` (String): 电话
- `emember.address` (String): 地址
- `emember.ticket` (String): 票号
- `securityCode` (String): 验证码
- `verifyCode` (String): 校验码

```json
{
    "emember.unionId": "SDJ4SDF5",
    "emember.name": "客户",
    "emember.phone": "138xxxx2738",
    "emember.address": "广场一期 1#1-1-1",
    "emember.ticket": "37487263472",
    "securityCode": "1234",
    "verifyCode": "1234"
}
```


##### `查询/创建` deleteEmember

删除电子会员

**Requests:**

- `emember.emid` (Long): 会员ID

```json
{
    "emember.emid": 1
}
```

### 群享


> **类**: `api.customer.GroupAction`


#### 数据类型: `group`

| 参数 | 说明 | 类型 |
|------|------|------|
| `gid` | 群ID | Long |
| `opengid` | 群编号 | String |
| `orderId` | 装修单号 | String |
| `name` | 名称 | String |
| `content` | 说明 | String |


#### 数据类型: `groupUser`

| 参数 | 说明 | 类型 |
|------|------|------|
| `guid` | 群用户Id | Long |
| `opengid` | 群Id | String |
| `user` | 人员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |


##### `查询/创建` pageGroup

分页方式获取群信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter) .

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 群信息列表 , 每条数据类型 `group`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "gid": 1,
                "opengid": "0KJ6nAsYbfKA_hsRHB2MUgs",
                "orderId": "1601010001",
                "name": "名称",
                "content": "说明"
            }
        ],
        ...
    },
    ...
}
```


##### `查询/创建` queryGroup

通过opengid获取群信息

**Requests:**

- `group.opengid` (String): 群编号

```json
{
    "group.opengid": "0KJ6nAsYbfKA_hsRHB2MUgs"
}
```

**Returns:**

- `group` (Object): 群信息 , 类型 :[group ](./customer.html#api.customer.GroupAction.group)

```json
{
    ...
    "group":{
        "gid": 1,
        "opengid": "0KJ6nAsYbfKA_hsRHB2MUgs",
        "orderId": "1601010001",
        "name": "名称",
        "content": "说明"
    }
    ...
}
```


##### `查询` updateGroup

更新群信息

**Requests:**

- `group.gid` (String): 群ID
- `group.name` (String): 名称
- `group.content` (String): 说明

```json
{
    "group.gid": 1,
    "group.name": "名称",
    "group.content": "说明",
}
```


##### `查询/创建` bindGroup

绑定群信息

**Requests:**

- `unionId` (String): 联合ID
- `group.opengid` (String): 群编号
- `group.orderId` (String): 装修单号

```json
{
    "unionId": "SDJ4SDF5",
    "group.opengid": "0KJ6nAsYbfKA_hsRHB2MUgs",
    "group.orderId": "1601010001",
}
```


##### `查询` unbindGroup

解绑群信息

**Requests:**

- `group.gid` (String): 群编号

```json
{
    "group.gid": 1
}
```

### 钉群


> **类**: `api.customer.DroupAction`


#### 数据类型: `droup`

| 参数 | 说明 | 类型 |
|------|------|------|
| `did` | 钉群ID | Long |
| `name` | 名称 | String |
| `decoration` | 装修单 , 类型 [decoration ](./decoration.html#api.decoration.decorationAction.decoration) | Object |
| `chatId` | 会话ID | String |
| `openId` | 会话ID | String |
| `type` | 类型 | Short |
| `status` | 状态 , 0: 有效 , 1: 无效 | Short |
| `isHandle` | 是否处理 , 0: 客户 , 1: 处理 | Short |
| `isRead` | 是否已读 , 0: 已读 , 1: 未读 | Short |
| `updateTime` | 更新时间 | Timestamp |
| `handleTime` | 处理时间 | Timestamp |
| `company` | 公司ID | Integer |


##### `查询/创建` pageDroup

分页方式获取钉群 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter) .

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 钉群信息列表 , 每条数据类型 `droup`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "did": 1,
                "name": "名称",
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
                "chatId": "",
                "openId": "",
                "type": 1,
                "status": 0,
                "isHandle": 0,
                "isRead": 0,
                "updateTime": "2016-01-01 00:00:00",
                "handleTime": "2016-01-01 00:00:00"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryDroup

通过装修单号或者会话ID查询钉群信息

**Requests:**

- `droup.decoration.orderId` (String): 装修单号
- `droup.chatId` (String): 会话ID

```json
{
    "droup.decoration.orderId:": "1601010001"
}
```

**Returns:**

- `oaleses` (List): 钉群信息列表 , 每条数据类型 `oales`

```json
{
    ...
    "oaleses": [
        {
            "did": 1,
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
            "chatId": "",
            "openId": "",
            "type": 1,
            "status": 0,
            "isHandle": 0,
            "isRead": 0,
            "updateTime": "2016-01-01 00:00:00",
            "handleTime": "2016-01-01 00:00:00"
        }
    ],
    ...
}
```


##### `查询` bindDroup

绑定

判断归属装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**Requests:**

- `droup.decoration.orderId` (String): 装修单号
- `droup.chatId` (String): 会话ID
- `droup.openId` (String): 会话ID
- `droup.type` (Short): 类型

```json
{
    "droup.decoration.orderId:": "1601010001",
    "droup.chatId": "",
    "droup.openId": "",
    "droup.type": 1
}
```


##### `查询` updateDroup

更新

**Requests:**

- `droup.did` (Long): 钉群ID
- `droup.isRead` (Short): 是否已读

```json
{
    "droup.did:": 1,
    "droup.isRead": 0
}
```


##### `查询` deleteDroup

删除

**Requests:**

- `droup.did` (Long): 钉群ID

```json
{
    "droup.did:": 1
}
```

### 对话


> **类**: `api.customer.ConversationAction`


#### 数据类型: `conversation`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cid` | 对话ID | Long |
| `orderId` | 装修单号 | String |
| `name` | 名称 | String |
| `type` | 类型 , 0: 文本, 1: 图片, 2: 应用 | Short |
| `atttype` | 业务类型 , 0: 请求, 1: 响应 | Short |
| `contype` | 内容类型 , 0: 客户, 1: 装修, 2: 主材, 3: 工程, 4: 款项, 5: 其他 | Short |
| `content` | 内容 | String |
| `path` | 地址 | String |
| `filesize` | 文件大小 | Integer |
| `width` | 宽度 | Integer |
| `height` | 高度 | Integer |
| `focuser` | 关注人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `status` | 状态 , 0: 初始 , 1: 已读 , 2: 删除 | Short |


##### `查询/创建` pageConversation

分页方式获取对话 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter) .

**Requests:**

- `conversation.orderId` (String): 装修单号

```json
{
    "conversation.orderId:": "1601010001"
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 对话信息列表 , 每条数据类型 `conversation`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "cid": 1,
                "orderId": "1601010001",
                "name": "",
                "type": 0,
                "atttype": 0,
                "contype": 0,
                "content": "内容",
                "path": "",
                "filesize": 0,
                "width": 0,
                "height": 0,
                "creater": {
                    "uid": 1,
                    "userId": "FL-02381",
                    "userName": "王宁",
                    "currentName": "王宁",
                    "phone": "136xxxx1453",
                    ...
                },
                "createTime": "2016-01-01 00:00:00",
                "status": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询/创建` requestConversation

请求

判断归属装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断钉群是否存在 , 不存在 , 错误信息 **330067 群信息不存在**

业务类型默认为0(请求) , 代表客户发起

如果钉群处理状态非0(客户) , 更新钉群处理状态为0(客户) , 更新钉群更新时间

**Requests:**

- `conversation.orderId` (String): 装修单号
- `conversation.name` (String): 名称
- `conversation.type` (Short): 类型
- `conversation.contype` (Short): 内容类型
- `conversation.content` (String): 内容
- `conversation.path` (String): 路径
- `conversation.filesize` (Integer): 文件大小
- `conversation.width` (Integer): 宽度
- `conversation.height` (Integer): 高度
- `conversation.focuser.userId` (String): 关注人ID

```json
{
    "conversation.orderId:": "1601010001",
    "conversation.name": "",
    "conversation.type": 0,
    "conversation.contype": 0,
    "conversation.content": "",
    "conversation.path": "",
    "conversation.filesize": 0,
    "conversation.width": 0,
    "conversation.height": 0,
    "conversation.focuser.userId": "U0001",
}
```


##### `查询/创建` responseConversation

响应

判断归属装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

判断钉群是否存在 , 不存在 , 错误信息 **330067 群信息不存在**

业务类型默认为1(相应) , 代表公司员工发起

如果钉群处理状态非1(处理) , 更新钉群处理状态为1(处理) , 更新钉群处理时间

**Requests:**

- `conversation.orderId` (String): 装修单号
- `conversation.name` (String): 名称
- `conversation.type` (Short): 类型
- `conversation.contype` (Short): 内容类型
- `conversation.content` (String): 内容
- `conversation.path` (String): 路径
- `conversation.filesize` (Integer): 文件大小
- `conversation.width` (Integer): 宽度
- `conversation.height` (Integer): 高度

```json
{
    "conversation.orderId:": "1601010001",
    "conversation.name": "",
    "conversation.type": 0,
    "conversation.contype": 0,
    "conversation.content": "",
    "conversation.path": "",
    "conversation.filesize": 0,
    "conversation.width": 0,
    "conversation.height": 0
}
```


##### `查询` deleteConversation

删除

**Requests:**

- `conversation.cid` (Long): 对话ID

```json
{
    "conversation.cid:": 1
}
```

### 服务圈


> **类**: `api.customer.CircleAction`


#### 数据类型: `circle`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cid` | 圈ID | Long |
| `orderId` | 装修单号 | String |
| `address` | 地址 | String |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `content` | 内容 | String |
| `createTime` | 创建时间 | Timestamp |
| `praise` | 赞数 | Integer |
| `drawings` | 图片信息列表 , 每条数据类型 `circleDrawing` | List |


#### 数据类型: `circleDrawing`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cdid` | 图片ID | Long |
| `cid` | 圈ID | Long |
| `path` | 图片路径 | String |


##### `查询/创建` pageCircleByUnionId

分页方式获取服务圈 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter) .

通过联合主键归属的装修单 , 分页方式查询服务圈信息

**Requests:**

- `unionId` (String): 联合主键

```json
{
    "unionId": "SDJ4SDF5"
}
```

**Returns:**

- `circles` (List): 群信息 , 类型 `circle`

```json
{
    ...
    "circles":[
        "cid": 1,
        "orderId": "1601010001",
        "address": "地址信息",
        "creater": {
            "uid": 1,
            "userId": "U0001",
            "userName": "白雪",
            "currentName": "白雪",
            "phone": "138xxxx1828",
            ...
        },
        "content": "服务信息",
        "createTime": "2016-01-01",
        "praise": 1,
        "drawings": [
            {
                "cdid": 1
                "cid": 1,
                "path": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png"
            }
        ]
    ],
    ...
}
```


##### `查询/创建` pageCircleByOrderId

分页方式获取服务圈 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter) .

通过装修单号归属的装修单 , 分页方式查询服务圈信息

**Requests:**

- `circle.orderId` (String): 装修单号

```json
{
    "circle.orderId": "1601010001"
}
```

**Returns:**

- `circles` (List): 群信息 , 类型 `circle`

```json
{
    ...
    "circles":[
        "cid": 1,
        "orderId": "1601010001",
        "address": "地址信息",
        "creater": {
            "uid": 1,
            "userId": "U0001",
            "userName": "白雪",
            "currentName": "白雪",
            "phone": "138xxxx1828",
            ...
        },
        "content": "服务信息",
        "createTime": "2016-01-01",
        "praise": 1,
        "drawings": [
            {
                "cdid": 1
                "cid": 1,
                "path": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png"
            }
        ]
    ],
    ...
}
```


##### `查询/创建` addCircle

添加服务圈信息

**Requests:**

- `circle.orderId` (String): 装修单号
- `circle.userId` (String): 创建人编号
- `circle.address` (String): 地址
- `circle.content` (String): 内容

```json
{
    "circle.orderId": "1601010001",
    "circle.userId": "U001",
    "circle.address": "地址",
    "circle.content": "说明内容",
    "circle.drawings[0].path": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png"
}
```


##### `查询/创建` updateCircleForPraise

点赞

**Requests:**

- `circle.cid` (Long): 服务圈ID

```json
{
    "circle.cid": 1
}
```

### 背景图


> **类**: `api.customer.BackgroundAction`


#### 数据类型: `background`

| 参数 | 说明 | 类型 |
|------|------|------|
| `bid` | 背景图ID | Long |
| `unionId` | 联合主键 | String |
| `path` | 图片路径 | String |


##### `查询/创建` queryBackground

通过联合主键查询背景图信息

**Requests:**

- `background.unionId` (String): 联合主键

```json
{
    "background.unionId": "SDJ4SDF5"
}
```

**Returns:**

- `background` (Object): 背景图信息 , 类型 `background`

```json
{
    ...
    "background":{
        "bid": 1,
        "unionId": "SDJ4SDF5",
        "path": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png"
    }
    ...
}
```


##### `查询/创建` updateBackground

更新背景图信息

**Requests:**

- `background.unionId` (String): 联合主键
- `background.path` (String): 图片路径

```json
{
    "background.unionId": "SDJ4SDF5",
    "background.path": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png"
}
```
