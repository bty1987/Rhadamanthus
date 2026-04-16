# 信息


## 消息


消息管理 , 能够发送接收系统以及用户间的消息


> **类**: `api.information.MessageAction`


#### 数据类型: `message`

| 参数 | 说明 | 类型 |
|------|------|------|
| `mid` | 消息ID | Long |
| `receiver` | 接收人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `sender` | 发送人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `group` | 分组 | Long |
| `type` | 类型 , 0: 款项消息 , 1: 审批消息 , 2: 归属消息 , 3: 工程消息 , 4: 个人消息 , 5: 回访消息 | Short |
| `subtype` | 子类 , 1: 辅料单出库 | Short |

:parma ident: 外联ID
:type ident: Long
:param contents: 消息内容
:type contents: String
:param createTime: 创建时间
:type createTime: Timestamp
:param status: 状态 , 0: 已读 , 1: 未读 , 2: 未发
:type status: Short
:param args: 参数
:type args: String
:param dresult: 钉钉消息结果
:type dresult: Short


##### `查询` pageMessage

分页方式获取所属用户消息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 消息信息列表 , 每条数据类型 `message`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "mid": 232,  
                "contents": "新增一条审批信息,请查收.",
                "createTime": "2016-01-01 16:21:55",
                "receiver": {
                    "uid": 1,
                    "userId": "U0479",
                    "userName": "白雪",
                    "currentName": "白雪"
                },
                "sender": {
                    "uid": 2,
                    "userId": "U1545",
                    "userName": "张杰",
                    "currentName": "张杰"
                },
                "group": 1,
                "status": 0,
                "type": 1,
                "subtype": 0,
                "ident": 0,
                "args": null,
                "dresult": 1
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryMessageByMid

通过消息ID获取消息信息

**Requests:**

- `message.mid` (Long): 消息ID

```json
{
    "message.mid": 1
}
```

**Returns:**

- `message` (Object): 消息信息 , 类型 `message`

```json
{
    ...
    "paging": {
        ...
        "message": {
            "mid": 232,  
            "contents": "新增一条审批信息,请查收.",
            "createTime": "2016-01-01 16:21:55",
            "receiver": {
                "uid": 1,
                "userId": "U0479",
                "userName": "白雪",
                "currentName": "白雪"
            },
            "sender": {
                "uid": 2,
                "userId": "U1545",
                "userName": "张杰",
                "currentName": "张杰"
            },
            "group": 1,
            "status": 0,
            "type": 1,
            "subtype": 0,
            "ident": 0,
            "args": null,
            "dresult": 1
        },
        ...
    },
    ...
}
```


##### `查询` countMessage

获取所属用户未读消息总数

**Returns:**

- `messageCount` (Integer): 消息总数

```json
{
    ...
    "messageCount": 1
    ...
}
```


##### `查询` sendMessage

发送消息

**Requests:**

- `message.receiver.userId` (String): 接收人编号
- `message.contents` (String): 消息内容
- `message.type` (Short): 类型 , 包括: 审批消息 , 放线消息 , 个人消息 , 归属消息

```json
{
    "message.receiver.userId": "U0479",
    "message.contents": "消息",
    "message.type": 1
}
```


##### `查询` updateMessageForRead

更新未读消息为已读

**Requests:**


```json
{
    "mids[0]": 1,
    "mids[1]": 2
}
```

## 公告


公告信息管理


> **类**: `api.information.NoticeAction`


#### 数据类型: `notice`

| 参数 | 说明 | 类型 |
|------|------|------|
| `nid` | 公告ID | Long |
| `theme` | 主题 | String |
| `type` | 类型 , 1: 通知, 2: 活动 | Short |
| `priority` | 优先级 , 0: 标准, 1: 重要, 2: 紧急 | Short |
| `startTime` | 开始时间 | Long |
| `endTime` | 结束时间 | Long |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `isPublic` | 公开标识 , 0: 公开, 1:部门公开 | Short |
| `exPublic` | 过期公开 , 0: 公开 , 1: 隐藏 | Short |
| `depts` | 部门范围 | String |
| `status` | 状态, 0: 可用, 1: 失效 | Short |
| `filePath` | 附件路径 | String |
| `contents` | 内容 | String |
| `company` | 公司ID | Long |


#### 数据类型: `noticeDepartment`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ndid` | 公告部门ID | Long |
| `nid` | 公告ID | Long |
| `did` | 部门ID | Integer |


:param theme: 主题
:type theme: String
:param dateRange: 开始结束时间范围查询 , 格式: 2016/01/01-2016/01/01
:type dateRange: String


##### `查询` pageNotice

分页方式获取归属操作人员的公告信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 公告信息列表 , 每条数据类型 `notice`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "nid": 1,
                "theme": "公告",
                "type": 1,
                "priority": 0,
                "startTime": 1493541798308,
                "endTime": 1493541798308,
                "creater": {
                    "uid": 1,
                    "userId": "U0479",
                    "userName": "白雪",
                    "currentName": "白雪"
                },
                "createTime": "2016-01-01 00:00:00",
                "isPublic": 0,
                "exPublic": 0,
                "contents": "说明",
                "status": 0,
                "filePath": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageNoticeForSeenByType

分页方式获取公告信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

公告信息符合以下条件: 操作人所属部门对应的公告信息或者公告信息公开标识为公开(0), 状态为可用(0)

返回公告信息限制数量: 5

**Requests:**

- `notice.type` (Short): 类型 , 包括: 1: 通知, 2: 活动

```json
{
    "notice.type": 1
}
```

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 公告信息列表 , 每条数据类型 `notice`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "nid": 1,
                "theme": "公告",
                "type": 1,
                "priority": 0,
                "startTime": 1493541798308,
                "endTime": 1493541798308,
                "creater": {
                    "uid": 1,
                    "userId": "U0479",
                    "userName": "白雪",
                    "currentName": "白雪"
                },
                "createTime": "2016-01-01 00:00:00",
                "isPublic": 0,
                "exPublic": 0,
                "contents": "说明",
                "status": 0,
                "filePath": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryNoticeByNid

通过公告ID获取公告信息

**Requests:**

- `notice.nid` (Long): 公告ID

```json
{
    "notice.nid": 1
}
```

**Returns:**

- `notice` (Object): 公告信息 , 类型 `notice`

```json
{
    ...
    "notice": {
        "nid": 1,
        "theme": "公告",
        "type": 1,
        "priority": 0,
        "startTime": 1493541798308,
        "endTime": 1493541798308,
        "creater": {
            "uid": 1,
            "userId": "U0479",
            "userName": "白雪",
            "currentName": "白雪"
        },
        "createTime": "2016-01-01 00:00:00",
        "isPublic": 0,
        "exPublic": 0,
        "contents": "说明",
        "status": 0,
        "filePath": ""
    }
    ...
}
```


##### `查询` queryNoticeDepartment

获取公告-部门信息

**Requests:**

- `notice.noticeId` (Long): 公告ID
**Returns:**

- `noticeDepartments` (List): 公告信息列表 , 类型 `noticeDepartment`

```json
{
    ...
    "noticeDepartments": [
        {
            "ndid": 1,
            "nid": 1,
            "did": 1,
        }
    ]
    ...
}
```


##### `查询` addNotice

添加公告信息

**Requests:**

- `notice.theme` (String): 主题
- `notice.type` (Short): 类型 , 包括: 1: 通知, 2: 活动
- `notice.priority` (Short): 优先级 , 包括: 0: 标准, 1: 重要, 2: 紧急
- `notice.startTime` (Long): 开始时间
- `notice.endTime` (Long): 结束时间
- `notice.isPublish` (Short): 公开标识 , 包括: 0: 公开, 1: 部门公开
- `notice.exPublic` (Short): 过期公开 , 包括: 0: 公开, 1: 隐藏
- `notice.contents` (String): 内容
- `notice.filePath` (String): 附件路径

```json
{
    "notice.theme": "test",
    "notice.type": 1,
    "notice.priority": 0,
    "notice.startTime": 1493541798308,
    "notice.endTime": 1493541798308,
    "notice.isPublic": 0,
    "notice.exPublic": 0,
    "notice.contents": "说明",
    "notice.filePath": ""
}
```


##### `查询` updateNotice

更新公告信息

判断公告信息是否存在 , 不存在更新失败 , 错误信息 **160017 公告不存在**

**Requests:**

- `notice.nid` (Long): 公告ID
- `notice.theme` (String): 主题
- `notice.type` (Short): 类型 , 包括: 1: 通知, 2: 活动
- `notice.priority` (Short): 优先级 , 包括: 0: 标准, 1: 重要, 2: 紧急
- `notice.startTime` (Long): 开始时间
- `notice.endTime` (Long): 结束时间
- `notice.isPublish` (Short): 公开标识 , 包括: 0: 公开, 1:部门公开
- `notice.exPublic` (Short): 过期公开 , 包括: 0: 公开, 1: 隐藏
- `notice.contents` (String): 内容
- `notice.filePath` (String): 附件路径

```json
{
    "notice.nid": 1,
    "notice.theme": "test",
    "notice.type": 1,
    "notice.priority": 0,
    "notice.startTime": 1493541798308,
    "notice.endTime": 1493541798308,
    "notice.isPublic": 0,
    "notice.exPublic": 0,
    "notice.contents": "说明",
    "notice.filePath": ""
}
```


##### `查询` updateNoticeDepartment

更新公告对应归属部门信息

判断公告信息是否存在 , 不存在更新失败 , 错误信息 **160017 公告不存在**

更新公告对应归属部门之前 , 需要将该公告之前关联的部门信息清空

判断部门数量 , 数量最多为3个

**Requests:**

- `notice.nid` (Long): 公告ID

```json
{
    "notice.nid": 1,
    "dids[0]": 1,
    "dids[1]": 2
}
```


##### `查询` deleteNotice

批量删除公告信息 , 更新公告状态为失效(1)

**Requests:**

- `nid` (Long): 公告ID

```json
{
    "nid": 1
}
```

## 奖品


### 库存


> **类**: `api.information.AwardStockAction`


#### 数据类型: `awardStock`

| 参数 | 说明 | 类型 |
|------|------|------|
| `asid` | 奖品库存ID | Long |
| `no` | 编号 | String |
| `name` | 名称 | String |
| `purchase` | 进价 | Integer |
| `selling` | 售价 | Integer |
| `num` | 库存数 | Integer |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `type` | 类型 , 0: 券 , 1: 物品 , 2: 红包 | Short |
| `subtype` | 子类 , 0: 床上用品 , 1: 电器 , 2: 厨具 , 3: 日用品 , 4: 现金资产 , 5: 食品 , 6: 洁具 , 7: 工具 , 8: 其他 | Short |
| `storeroom` | 库房 , 0: 无 , 1: 装修 , 2: 主材 , 3: 销售 | Short |
| `format` | 规格 | String |
| `isPrefor` | 是否计算业绩 , 0: 计算 , 1: 不计算 | Short |
| `isStock` | 是否计算库存 , 0: 计算 , 1: 不计算 | Short |
| `isPayment` | 是否计入金额 , 0: 计入 , 1: 不计入 , 主要体现在装修实收额计算 | Short |
| `content` | 说明 | String |
| `company` | 公司 | Integer |


##### `查询` pageAwardStock

分页方式获取奖品库存信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 奖品库存信息列表 , 每条数据类型 `awardStock`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "asid": 1,
                "no": "AS001"
                "name": "奖品券",
                "purchase": 100000,
                "selling": 100000,
                "num": 10,
                "type": 0,
                "subtype": 0,
                "storeroom": "仓库",
                "format": "规格",
                "isPrefor": 0,
                "isStock": 0,
                "isPayment": 0,
                "content": "奖品说明"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryAwardStockByAsid

通过奖品ID获取奖品库存信息

**Requests:**

- `awardStock.asid` (Long): 奖品ID
- `awardStock.storeroom` (Short): 库房

```json
{
    "awardStock.asid": 1,
    "awardStock.storeroom": 0
}
```

**Returns:**

- `awardStock` (Object): 奖品 , 类型 `awardStock`

```json
{
    ...
    "awardStock":{
        "asid": 1,
        "no": "AS001"
        "name": "奖品券",
        "content": "奖品说明"
    }
    ...
}
```


##### `查询` queryAwardStockByType

查询奖品信息 , 可以通过奖品类型进行筛选

**Requests:**

- `awardStock.type` (Short): 奖品类型
- `awardStock.storeroom` (Short): 库房

```json
{
    "awardStock.type": 1,
    "awardStock.storeroom": 0
}
```

**Returns:**

- `awardStocks` (List): 奖品列表 , 每条数据类型 `awardStock`

```json
{
    ...
    "awardStocks":[
        {
            "asid": 1,
            "no": "AS001"
            "name": "奖品券",
            "content": "奖品说明"
        }
    ],
    ...
}
```


##### `查询` queryAwardStockByName

查询奖品信息 , 可以通过奖品类型进行筛选

**Requests:**

- `awardStock.type` (Short): 奖品类型
- `awardStock.storeroom` (Short): 库房

```json
{
    "awardStock.type": 1,
    "awardStock.storeroom": 0
}
```

**Returns:**

- `awardStocks` (List): 奖品列表 , 每条数据类型 `awardStock`

```json
{
    ...
    "awardStocks":[
        {
            "asid": 1,
            "no": "AS001"
            "name": "奖品券",
            "content": "奖品说明"
        }
    ],
    ...
}
```


##### `查询` addAwardStock

添加奖品信息

**Requests:**

- `awardStock.no` (String): 编号
- `awardStock.name` (String): 名称
- `awardStock.purchase` (Integer): 进价
- `awardStock.selling` (Integer): 售价
- `awardStock.num` (Integer): 数量
- `awardStock.type` (Short): 类型
- `awardStock.subtype` (Short): 子类
- `awardStock.storeroom` (Short): 库房
- `awardStock.format` (String): 规格
- `awardStock.isPrefor` (Short): 是否计入业绩
- `awardStock.isStock` (Short): 是否计入库存
- `awardStock.isPayment` (Short): 是否计入金额
- `awardStock.content` (String): 说明

```json
{
    "awardStock.no": "AS001",
    "awardStock.name": "奖品券",
    "awardStock.purchase": 100000,
    "awardStock.selling": 100000,
    "awardStock.num": 10,
    "awardStock.type": 0,
    "awardStock.subtype": 0,
    "awardStock.storeroom": 0,
    "awardStock.format": "规格",
    "awardStock.isPrefor": 0,
    "awardStock.isStock": 0,
    "awardStock.isPayment": 0,
    "awardStock.content": "说明"
}
```


##### `查询` updateAwardStock

更新奖品信息 , 可以更新业绩和库存的记录标识以及说明信息

判断奖品信息是否存在 , 不存在 , 错误信息 **160043 物品不存在**

**Requests:**

- `awardStock.asid` (Long): 奖品ID
- `awardStock.purchase` (Integer): 进价
- `awardStock.selling` (Integer): 售价
- `awardStock.isPrefor` (Short): 是否计入业绩
- `awardStock.isStock` (Short): 是否计入库存
- `awardStock.isPayment` (Short): 是否计入金额
- `awardStock.content` (String): 说明

```json
{
    "awardStock.asid": 1,
    "awardStock.purchase": 100000,
    "awardStock.selling": 100000,
    "awardStock.isPrefor": 0,
    "awardStock.isStock": 0,
    "awardStock.isPayment": 0,
    "awardStock.content": "说明"
}
```


##### `查询` updateAwardStockForStatus

更新奖品状态

判断奖品信息是否存在 , 不存在 , 错误信息 **160043 物品不存在**

**Requests:**

- `awardStock.asid` (Long): 奖品ID
- `awardStock.status` (Short): 状态

```json
{
    "awardStock.asid": 1,
    "awardStock.status": 0
}
```


##### `查询` updateAwardStockForCG

奖品入库

判断奖品信息是否存在 , 不存在 , 错误信息 **160043 物品不存在**

奖品如果不需要计入库存 , 错误信息 **160041 物品不能出库**

更新奖品对应的库存数量信息

生成奖品记录 , 类型为1(入库)

**Requests:**

- `awardStock.asid` (Long): 奖品ID
- `awardStock.num` (Integer): 数量

```json
{
    "awardStock.asid": 1,
    "awardStock.num": 1.1
}
```


##### `查询` updateAwardStockForXG

奖品出库

判断奖品信息是否存在 , 不存在 , 错误信息 **160043 物品不存在**

判断奖品数量是否满足出库数量 , 不满足 , 错误信息 **160038 库存不足**

奖品如果不需要计入库存 , 错误信息 **160040 物品不能出库**

更新奖品对应的库存数量信息

生成奖品记录 , 类型为0(出库)

**Requests:**

- `awardStock.asid` (Long): 奖品ID
- `awardStock.num` (Integer): 数量

```json
{
    "awardStock.asid": 1,
    "awardStock.num": 1.1
}
```


##### `查询` checkAwardStock

奖品盘点

判断奖品信息是否存在 , 不存在 , 错误信息 **160043 物品不存在**

奖品如果不需要计入库存 , 错误信息 **160042 物品不能盘点**

更新奖品对应的库存数量信息

生成奖品记录 , 类型为2(盘盈)或3(盘亏)

**Requests:**

- `awardStock.asid` (Long): 奖品ID
- `awardStock.num` (Integer): 数量 , 纠正库存数量

```json
{
    "awardStock.asid": 1,
    "awardStock.num": 1.1
}
```

### 采购


> **类**: `api.information.AwardPurchaseAction`


#### 数据类型: `awardPurchase`

| 参数 | 说明 | 类型 |
|------|------|------|
| `apid` | 采购ID | Long |
| `awardStock` | 库存 , 类型 [awardStock ](./information.html#api.information.AwardStockAction.awardStock) | Object |
| `fapid` | 上级采购ID | Long |
| `inprice` | 采购价 | Long |
| `baprice` | 结算价 | Long |
| `num` | 数量 | Integer |
| `surplus` | 剩余量 | Integer |
| `activity` | 活动名 | String |
| `dept` | 部门 | String |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `purchaser` | 采购员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `instorer` | 入库员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `purchaseTime` | 采购时间 | Timestamp |
| `instoreTime` | 入库时间 | Timestamp |
| `balanceTime` | 仓储时间 | Timestamp |
| `status` | 状态 , 0: 初始 , 1: 采购 , 2: 入库, 3: 结算, 4: 撤销 , 5: 完成 | Short |
| `company` | 公司 | Integer |
| `comment` | 备注 | String |


##### `查询` pageAwardPurchase

分页方式获取奖品采购信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 奖品采购信息列表 , 每条数据类型 `awardPurchase`

```json
{
    ...
    "paging": {
        ...
        "data": [
            "apid": 1,
            "awardStock": {
                "asid": 1,
                "name": "奖品券",
                "num": 10,
                "type": 0,
                "content": "奖品说明"
            },
            "fapid": null,
            "inprice": 0,
            "baprice": 0,
            "num": 10,
            "surplus": 0,

            "activity": "活动",
            "部门": "",

            "creater": {
                "uid": 1,
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师" 
            },
            "purchaser": {
                "uid": 1,
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师" 
            },"instorer": {
                "uid": 1,
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师" 
            },
            "createTime": "2016-01-01",
            "purchaseTime": "2016-01-01",
            "instoreTime": "2016-01-01",
            "balanceTime": "2016-01-01",

            "status": 0.
            "comment": ""
        ],
        ...
    },
    ...
}
```


##### `查询` queryAwardPurchase

分页方式获取奖品采购信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Requests:**

- `awardPurchase.fapid` (Long): 上级采购ID

```json
{
    "awardPurchase.fapid": 1
}
```

**Returns:**

- `awardPurchases` (List): 奖品采购信息列表 , 每条数据类型 `awardPurchase`

```json
{
    ...
    "awardPurchases": [
        "apid": 1,
        "awardStock": {
            "asid": 1,
            "name": "奖品券",
            "num": 10,
            "type": 0,
            "content": "奖品说明"
        },
        "fapid": null,
        "inprice": 0,
        "baprice": 0,
        "num": 10,
        "surplus": 0,

        "activity": "活动",
        "部门": "",

        "creater": {
            "uid": 1,
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师" 
        },
        "purchaser": {
            "uid": 1,
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师" 
        },"instorer": {
            "uid": 1,
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师" 
        },
        "createTime": "2016-01-01",
        "purchaseTime": "2016-01-01",
        "instoreTime": "2016-01-01",
        "balanceTime": "2016-01-01",

        "status": 0.
        "comment": ""
    ],
    ...
}
```


##### `查询` addAwardPurchase

创建奖品采购

**Requests:**

- `awardPurchase.activity` (String): 活动名
- `awardPurchase.dept` (Long): 部门
- `awardPurchase.awardStock.asid` (Long): 奖品库存ID
- `awardPurchase.num` (Integer): 数量
- `awardPurchase.comment` (String): 备注

```json
{
    "awardPurchase.activity": "活动",
    "awardPurchase.dept": "",
    "awardPurchase.awardStock.asid": 1,
    "awardPurchase.num": 0,
    "awardPurchase.comment": ""
}
```


##### `查询` purchaseAwardPurchase

采购

判断奖品采购是否存在 , 不存在 , 错误信息 **160057 奖品采购不存在**

判断奖品采购状态是否为0(初始) , 其他状态 , 错误信息 **160058 奖品采购不可操作**

更新奖品采购状态为1(采购) , 采购价 , 采购人以及采购时间

**Requests:**

- `awardPurchase.apid` (Long): 奖品采购ID

```json
{
    "awardPurchase.apid": 1
}
```


##### `查询` instoreAwardPurchase

入库

判断奖品采购是否存在 , 不存在 , 错误信息 **160057 奖品采购不存在**

判断奖品采购状态是否为1(采购) , 其他状态 , 错误信息 **160058 奖品采购不可操作**

更新奖品采购状态为2(入库) , 入库人以及入库时间

**Requests:**

- `awardPurchase.apid` (Long): 奖品采购ID
- `awardPurchase.num` (Integer): 数量

```json
{
    "awardPurchase.apid": 1,
    "awardPurchase.num": 1
}
```


##### `查询` balanceAwardPurchase

结算

判断奖品采购是否存在 , 不存在 , 错误信息 **160057 奖品采购不存在**

判断奖品采购状态是否为2(入库) , 其他状态 , 错误信息 **160058 奖品采购不可操作**

更新奖品采购状态为3(结束) , 结算价 , 结算人以及结算时间

**Requests:**

- `awardPurchase.apid` (Long): 奖品采购ID

```json
{
    "awardPurchase.apid": 1
}
```


##### `查询` cancelAwardPurchase

撤销

判断奖品采购是否存在 , 不存在 , 错误信息 **160057 奖品采购不存在**

判断奖品采购状态是否为0(初始) , 其他状态 , 错误信息 **160058 奖品采购不可操作**

更新奖品采购状态为4(撤销)

**Requests:**

- `awardPurchase.apid` (Long): 奖品采购ID

```json
{
    "awardPurchase.apid": 1
}
```

### 记录


> **类**: `api.information.AwardRecordAction`


#### 数据类型: `awardRecord`

| 参数 | 说明 | 类型 |
|------|------|------|
| `arid` | 奖品记录ID | Long |
| `orderId` | 装修单号 | String |
| `awardStock` | 奖品 , 类型 [awardStock ](./information.html#api.information.AwardStockAction.awardStock) | Object |
| `type` | 类型 , 0: 入库 , 1: 出库 , 2: 盘盈 , 3: 盘亏 | Short |
| `subtype` | 子类 , 0: 入库 , 1: 出库, 2: 盘盈 , 3: 盘亏 , 6: 退货 , 8: 采购 , 10: 公司回库 , 12: 剩余回库 , 14: 厂家赠送 , 5: 领取 , 7: 配送 , 9: 赔偿 , 11: 自购 , 13: 福利 , 15: 营销 , 17: 跨帐 | Short |
| `onetype` | 一类 , 0: 无 , 1: 装修 , 2: 销售 , 3: 主材 | Short |
| `num` | 数量 | Integer |
| `unitPrice` | 单价 | Integer |
| `totalPrice` | 总价 | Integer |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `operateTime` | 操作时间 | Timestamp |
| `content` | 说明 | String |
| `isStock` | 是否计算库存 , 0: 计算 , 1: 不计算 | Short |


##### `查询` pageAwardRecord

分页方式获取奖品记录信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 奖品库存信息列表 , 每条数据类型 `awardStock`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "arid": 1,
                "awardStock": {
                    "asid": 1,
                    "name": "奖品券",
                    "num": 10,
                    "type": 0,
                    "content": "奖品说明"
                },
                "type": 0,
                "subtype": 0,
                "onetype": 0,
                "num": 10,
                "unitPrice": 10.1,
                "totalPrice": 101,
                "creater": {
                    "uid": 1,
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师" 
                },
                "operateTime": "2016-01-01 00:00:00",
                "content": "说明",
                "isStock": 0
            }
        ],
        ...
    },
    ...
}
```

## 活动


### 活动


活动信息管理


> **类**: `api.information.ActivityAction`


#### 数据类型: `activity`

| 参数 | 说明 | 类型 |
|------|------|------|
| `aid` | 活动ID | Long |
| `name` | 活动名 | String |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `type` | 类型 , 1: 装修 , 2: 主材 , 3: 销售 | Short |
| `paytype` | 款项类型 , 1: 合同预付 , 2: 主材预付 , 4: 装修 , 8: 主材 , 16: 销售 , 32: 服务 | Short |
| `status` | 状态 , 包括: 0: 有效 , 1: 失效 , 2: 删除 | Short |
| `defaults` | 默认标识 , 0: 默认 , 1: 标准 | Short |
| `multiple` | 倍数 | Integer |
| `createTime` | 创建时间 | Timestamp |
| `startTime` | 开始时间 | Timestamp |
| `endTime` | 结束时间 | Timestamp |
| `content` | 活动内容 | String |
| `company` | 公司ID | Integer |


#### 数据类型: `activityItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `aiid` | 活动物品ID | Long |
| `aid` | 归属活动ID | Long |
| `asid` | 奖品ID | Long |
| `activity` | 活动名 | String |
| `name` | 物品名 | String |
| `type` | 类型 , 包括: 0: 券 , 1: 物品 , 2: 红包 | Short |
| `money` | 金额 | Integer |
| `integral` | 积分 | Integer |


:param activityName: 活动名
:type activityName: String
:param status: 状态 , 包括: 0: 有效 , 1: 失效
:type status: Short


##### `查询` pageActivity

分页方式获取操作用户活动信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 活动信息列表 , 每条数据类型 `activity`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "aid": 1,
                "name": "test",
                "creater": {
                    "uid": 1,
                    "userId": "U0479",
                    "userName": "白雪",
                    "currentName": "白雪"
                },
                "createTime": "2016-01-01 00:00:00",
                "startTime": "2016-01-01 00:00:00",
                "endTime": "2016-01-01 23:59:59",
                "type": 1,
                "paytype": 0,
                "defaults": 0,
                "multiple": 1,
                "status": 1,
                "content": "8"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryActivityForValid

获取所有状态为有效的活动信息

**Requests:**

- `activity.type` (Short): 类型

```json
{
    "activity.type": 1
}
```

**Returns:**

- `activitys` (List): 活动信息列表 , 每条数据类型 `activity`

```json
{
    ...
    "activitys": [
        {
            "aid": 1,
            "name": "test",
            "creater": {
                "uid": 1,
                "userId": "U0479",
                "userName": "白雪",
                "currentName": "白雪"
            },
            "createTime": "2016-01-01 00:00:00",
            "startTime": "2016-01-01 00:00:00",
            "endTime": "2016-01-01 23:59:59",
            "type": 1,
            "paytype": 0,
            "defaults": 0,
            "multiple": 1,
            "status": 1,
            "content": "8"
        }
    ],
    ...
}
```


##### `查询` addActivity

添加活动信息

**Requests:**

- `activity.name` (String): 活动名
- `activity.type` (Short): 类型
- `activity.paytype` (Short): 款项类型
- `activity.multiple` (Integer): 倍数
- `activity.createTime` (Timestamp): 开始时间
- `activity.endTime` (Timestamp): 结束时间
- `activity.content` (String): 活动内容

```json
{
    "activity.name": "活动",
    "activity.type": 0,
    "activity.paytype": 0,
    "activity.multiple": 0,
    "activity.createTime": "2016-01-01 00:00:00",
    "activity.endTime": "2016-01-01 23:59:59",
    "activity.content": "内容"
}
```


##### `查询` updateActivity

更新活动信息

判断活动是否存在 , 不存在 , 错误信息 **160011 活动信息不存在**

判断活动状态 , 状态为无效 , 错误信息 **160012 活动当前状态不能修改**

**Requests:**

- `activity.aid` (Long): 活动ID
- `activity.paytype` (Short): 款项类型
- `activity.endTime` (Timestamp): 结束时间
- `activity.content` (String): 活动内容

```json
{
    "activity.aid": 1,
    "activity.paytype": 0,
    "activity.endTime": "2016-01-01 23:59:59",
    "activity.content": "内容"
}
```


##### `查询` updateActivityForStatus

更新活动状态

判断活动是否存在 , 不存在 , 错误信息 **160011 活动信息不存在**

判断活动状态 , 状态为无效 , 错误信息 **160012 活动当前状态不能修改**

**Requests:**

- `activity.aid` (Long): 活动ID
- `activity.status` (Short): 状态

```json
{
    "activity.aid": 1,
    "activity.status": 1
}
```


##### `查询` updateActivityForDefault

更新活动默认状态

判断活动是否存在 , 不存在 , 错误信息 **160011 活动信息不存在**

判断活动状态 , 状态为无效 , 错误信息 **160012 活动当前状态不能修改**

操作活动所属的类型中的所有活动 , 默认标识更新为1(标准) , 当前操作活动默认标识更新为0(默认)

**Requests:**

- `activity.aid` (Long): 活动ID

```json
{
    "activity.aid": 1
}
```

### 物品


活动信息管理


> **类**: `api.information.ActivityAction`


#### 数据类型: `activityItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `aiid` | 物品ID | Long |
| `aid` | 归属活动ID | Long |
| `asid` | 奖品ID | Long |
| `activity` | 活动名 | String |
| `name` | 物品名 | String |
| `type` | 类型 , 包括: 0: 券 , 1: 物品 , 2: 红包 | Short |
| `money` | 金额 | Integer |
| `integral` | 积分 | Integer |


##### `查询` queryActivityItemByAid

通过活动ID获取活动中的活动物品信息

**Requests:**

- `activity.aid` (Long): 活动ID

```json
{
    "activity.aid": 1
}
```

**Returns:**

- `activityItems` (List): 活动物品信息列表 , 每条数据类型 `activityItem`

```json
{
    ...
    "activityItems":[
        {
            "aiid": 1,
            "aid": 1,
            "awid": 1,
            "name": "券",
            "activity": "活动",
            "money": 100000,
            "num": 0,
            "integral": 0,
            "type": 0
        },
        {
            "aiid": 2,
            "aid": 1,
            "awid": 2,
            "name": "物品",
            "activity": "活动",
            "money": 0,
            "num": 0,
            "integral": 0,
            "type": 1
        }
    ],
    ...
}
```


##### `查询` queryActivityItemByAiid

通过活动物品ID获取信息

**Requests:**

- `activityItem.aiid` (Long): 物品ID

```json
{
    "activityItem.aiid": 1
}
```

**Returns:**

- `activityItem` (Object): 活动物品 , 类型 `activityItem`

```json
{
    ...
    "activityItem":{
        "aiid": 1,
        "aid": 1,
        "awid": 1,
        "name": "券",
        "activity": "活动",
        "money": 100000,
        "num": 0,
        "integral": 0,
        "type": 0
    },
    ...
}
```


##### `查询` addActivityItem

向活动中添加活动物品信息

**Requests:**

- `activity.aid` (Long): 活动ID
- `activity.asid` (Long): 奖品ID
- `activityItem.activity` (String): 活动名称
- `activityItem.name` (String): 活动物品名称
- `activityItem.money` (String): 金额
- `activityItem.type` (Short): 类型 , 包括: 0: 券 , 1: 物品
- `activityItem.integral` (Integer): 积分

```json
{
    "activity.aid": 1,

    "activityItem.activity": "活动",
    "activityItem.name": "券",
    "activityItem.money": 100
    "activityItem.type": 0,
    "activityItem.integral": 0
}
```


##### `查询` deleteActivityItem

删除活动物品信息

**Requests:**

- `activityItem.aiid` (Long): 活动物品ID

```json
{
    "activityItem.aiid": 1
}
```

## 事件


事件信息管理


> **类**: `api.information.EventsAction`


#### 数据类型: `event`

| 参数 | 说明 | 类型 |
|------|------|------|
| `eid` | 事件ID | Long |
| `orderId` | 装修单号 | String |
| `title` | 标题 | String |
| `content` | 内容 | String |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `holder` | 所有人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `department` | 归属部门 , 类型 [department ](./department.html#api.communion.DepartmentAction.department) | Object |
| `region` | 归属分区 , 类型 [department ](./department.html#api.communion.DepartmentAction.department) | Object |
| `type` | 类型 , 1: 系统 , 2: 标准 | Short |
| `atttype` | 业务类型 , 0: 通知 | Short |
| `createTime` | 创建时间 | Timestamp |
| `showDate` | 显示日期 | Date |
| `beginDate` | 开始日期 | String |
| `endDate` | 结束日期 | String |
| `isSend` | 推送标识 | Short |


:param showDate: 显示日期
:type showDate: String
:param showDateRange: 显示日期范围 , 例: 2016/01/01-2016/01/02
:type showDateRange: String


##### `查询` queryEvent

获取当前登陆系统人所拥有事件信息

**Requests:**

- `event.beginDate` (String): 开始日期
- `event.endDate` (String): 结束日期

```json
{
    "event.beginDate": "2016-01-01",
    "event.endDate": "2016-01-02"
}
```

**Returns:**

- `events` (List): 事件信息列表 , 每条数据类型 `event`

```json
{
    ...
    "events":[
        {
            "eid": 1,
            "title": "事件",
            "orderId": ""
            "type": 1,
            "atttype": 0,
            "content": "事件内容",
            "showDate": "2016-01-02",
            "createTime": "2016-01-01",
            "creater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师",
                "phone": "123xxxx5215",
                "userPhoto": "/upload/Imag//userI01fdc2cc283d76ac6.jpg"
            },
            "holder": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师",
                "phone": "123xxxx5215",
                "userPhoto": "/upload/Imag//userI01fdc2cc283d76ac6.jpg"
           }
        }
    ],
    ...
}
```


##### `查询` addEvent

添加事件信息

**Requests:**

- `event.title` (String): 标题
- `event.content` (String): 内容
- `event.showDate` (String): 显示日期

```json
{
    "event.title": "事件",
    "event.content": "事件内容",
    "event.showDate": "2016-01-01"
}
```

**Returns:**

- `event` (Object): 事件信息 , 类型 `event`

```json
{
    ...
    "event":{
        "eid": 1,
        "title": "事件",
        "orderId": ""
        "type": 1,
        "atttype": 0,
        "content": "事件内容",
        "showDate": "2016-01-02",
        "createTime": "2016-01-01",
        "creater": {
            "uid": 1,
            "userId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师",
            "phone": "123xxxx5215",
            "userPhoto": "/upload/Imag//userI01fdc2cc283d76ac6.jpg"
        },
        "holder": {
            "uid": 1,
            "userId": "U001",
            "userName": "白雪",
            "currentName": "白雪",
            "duty": "设计师",
            "phone": "123xxxx5215",
            "userPhoto": "/upload/Imag//userI01fdc2cc283d76ac6.jpg"
       }
    }
    ...
}
```


##### `查询` deleteEvent

删除事件信息

**Requests:**

- `event.eid` (Long): 事件ID

```json
{
    "event.eid": 1
}
```

## 电话拨叫


电话拨叫功能信息管理


> **类**: `api.information.PhoneCallAction`


#### 数据类型: `phoneCall`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pcid` | ID | Long |
| `orderId` | 订单编号 | String |
| `operater` | 操作人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `operateTime` | 操作时间 | Timestamp |
| `callbackId` | 通话信息ID | String |
| `caller` | 主叫号码 | String |
| `callee` | 被叫号码 | String |
| `startTime` | 开始时间 | Timestamp |
| `endTime` | 结束时间 | Timestamp |
| `stopReason` | 挂断原因 | Short |
| `duration` | 时长 | Integer |
| `recordType` | 录音类型 , 0: 初始 , 1: 本地 , 2: 线上 , 3: 失败 | Short |
| `recordUrl` | 录音地址 | String |


##### `查询` pagePhoneCall

分页方式获取电话拨叫信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 电话拨叫信息列表 , 每条数据类型 `phoneCall`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "pcid": 1,
                "orderId": "1601010001",
                "operater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "operateTime": "2016-01-01 00:00:00",
                "callbackId": "JDS7S656SDF87",
                "caller": "136xxxx2865",
                "callee": "174xxxx2876",
                "startTime": "2016-01-01 00:00:00",
                "endTime": "2016-01-01 00:00:00",
                "stopReason": 1,
                "duration": 267662,
                "recordType": 0,
                "recordUrl": "/01/01/JSDIFJAN212NJ2N3JFDS.mp3"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` phoneCall

发起电话拨叫

**Requests:**

- `phoneCall.orderId` (String): 订单编号
- `phoneCall.caller` (String): 主叫号码
- `phoneCall.callee` (String): 被叫号码

```json
{
    "phoneCall.orderId": "1601010001",
    "phoneCall.caller": "136xxxx2865",
    "phoneCall.callee": "174xxxx2876"
}
```


##### `查询` updatePhoneCallForInfo

**Requests:**

- `phoneCall.pcid` (Long): ID
- `phoneCall.startTime` (Timestamp): 开始时间
- `phoneCall.endTime` (Timestamp): 结束时间
- `phoneCall.stopReason` (Short): 挂断原因
- `phoneCall.duration` (Integer): 时长

```json
{
    "phoneCall.pcid": "1601010001",
    "phoneCall.startTime": "2016-01-01 00:00:00",
    "phoneCall.endTime": "2016-01-01 00:00:00",
    "phoneCall.stopReason": 0,
    "phoneCall.duration": 1
}
```


##### `查询` updatePhoneCallForRecord

**Requests:**

- `phoneCall.pcid` (Long): ID
- `phoneCall.recordType` (Short): 录音类型
- `phoneCall.recordUrl` (String): 录音地址

```json
{
    "phoneCall.pcid": "1601010001",
    "phoneCall.recordType": 0,
    "phoneCall.recordUrl": "/JDIU/SDFJI/SOCN2312KJ312IN3.mp3",
}
```

## 大活动


### 活动


提供展会/节日等大型活动部分业务支持


> **类**: `api.information.VactivityAction`


#### 数据类型: `vactivity`

| 参数 | 说明 | 类型 |
|------|------|------|
| `vaid` | 活动ID | Long |
| `name` | 名称 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |


##### `查询` pageVactivity

分页方式获取活动信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 活动信息列表 , 每条数据类型 `vactivity`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "vaid": 1,
                "name": "活动名称",
                "status": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryVactivity

获取所有活动信息 , 状态为0(启用)

**Returns:**

- `vactivitys` (List): 活动信息列表 , 每条数据类型 `vactivity`

```json
{
    ...
    "vactivitys": [
        {
            "vaid": 1,
            "name": "活动名称",
            "status": 0
        }
    ],
    ...
}
```


##### `查询` updateVactivityForStatus

更新活动状态

判断活动是否存在 , 不存在 , 错误信息 **160011 活动信息不存在**

判断活动状态是否为0(启用) , 其他状态不可操作 , 错误信息 **160052 活动不可操作**

**Requests:**

- `vactivity.vaid` (Long): 活动ID

```json
{
    "vactivity.vaid": 1
}
```

### 奖品


> **类**: `api.information.VprizeAction`


#### 数据类型: `vprize`

| 参数 | 说明 | 类型 |
|------|------|------|
| `vpid` | 奖品ID | Long |
| `vaid` | 活动ID | Long |
| `name` | 名称 | String |
| `price` | 价格 | Integer |
| `unit` | 单位 | String |
| `status` | 状态 , 0: 有效 , 1: 无效 | Short |


##### `查询` pageVprize

分页方式获取奖品信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 奖品信息列表 , 每条数据类型 `vprize`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "vpid": 1,
                "vaid": 1,
                "name": "奖品",
                "price": 100000,
                "unit": "个",
                "status": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询/创建` queryVprizeByNo

通过票号获取奖品信息

判断活动票是否存在 , 不存在 , 错误信息 **160026 活动票不存在**

通过活动票获取活动ID , 利用活动ID获取活动归属的奖品 , 状态为0(有效)

**Requests:**

- `no` (String): 票号

```json
{
    "no": 1
}
```

**Returns:**

- `vprizes` (List): 奖品信息列表 , 每条数据类型 `vprize`

```json
{
    ...
    "vprizes": [
        {
            "vpid": 1,
            "vaid": 1,
            "name": "奖品",
            "price": 100000,
            "unit": "个",
            "status": 0
        }
    ],
    ...
}
```


##### `查询` addVprize

添加奖品信息

**Requests:**

- `vprize.vaid` (Long): 活动ID
- `vprize.name` (String): 名称
- `vprize.price` (Integer): 价格

```json
{
    "vprize.vaid": 1,
    "vprize.name": "奖品",
    "vprize.price": 100000,
    "vprize.unit": "个"
}
```


##### `查询` updateVprize

更新奖品信息

判断奖品是否存在 , 不存在 , 错误信息 **160048 奖品不存在**

**Requests:**

- `vprize.vpid` (Long): 奖品ID
- `vprize.name` (String): 名称
- `vprize.price` (Integer): 价格

```json
{
    "vprize.vpid": 1,
    "vprize.name": "奖品",
    "vprize.price": 100000,
    "vprize.unit": "个"
}
```


##### `查询` updateVprizeForStatus

更新奖品状态

判断奖品是否存在 , 不存在 , 错误信息 **160048 奖品不存在**

**Requests:**

- `vprize.vpid` (Long): 奖品ID
- `vprize.status` (Short): 状态

```json
{
    "vprize.vpid": 1,
    "vprize.status": 0
}
```

### 票务


> **类**: `api.information.VticketAction`


#### 数据类型: `vticket`

| 参数 | 说明 | 类型 |
|------|------|------|
| `vtid` | 活动票ID | Long |
| `tno` | 活动票号 | String |
| `vaid` | 活动ID | Long |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `belonger` | 归属人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `department` | 归属部门 , 类型 [department ](./department.html#api.communion.DepartmentAction.department) | Object |
| `region` | 归属分区 , 类型 [department ](./department.html#api.communion.DepartmentAction.department) | Object |
| `orderId` | 装修单号 | String |
| `name` | 姓名 | String |
| `phone` | 电话 | String |
| `address` | 地址 | String |
| `isregist` | 是否注册 , 0: 未注册 , 1: 已注册 | Short |
| `iscome` | 是否到场 , 0: 未到场 , 1: 已到场 | Short |


##### `查询` pageVticket

分页方式获取活动票信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 活动票信息列表 , 每条数据类型 `vticket`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "vtid": 1,
                "tno": "0000000000000000000",
                "vaid": 1,
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师",
                    "phone": "123xxxx5215",
                    "userPhoto": "/upload/Imag//userI01fdc2cc283d76ac6.jpg"
                },
                "belonger": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师",
                    "phone": "123xxxx5215",
                    "userPhoto": "/upload/Imag//userI01fdc2cc283d76ac6.jpg"
                },
                "createTime": "2016-01-01 00:00:00",
                "orderId": "1601010001",
                "name": "客户",
                "phone": "174xxxx2876",
                "address": "广场一期1#1-1-1",
                "isregist": 0,
                "iscome": 1
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageVticketForBelonger

分页方式获取活动票信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

返回归属人所属的活动票信息

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 活动票信息列表 , 每条数据类型 `vticket`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "vtid": 1,
                "tno": "0000000000000000000",
                "vaid": 1,
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师",
                    "phone": "123xxxx5215",
                    "userPhoto": "/upload/Imag//userI01fdc2cc283d76ac6.jpg"
                },
                "belonger": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师",
                    "phone": "123xxxx5215",
                    "userPhoto": "/upload/Imag//userI01fdc2cc283d76ac6.jpg"
                },
                "createTime": "2016-01-01 00:00:00",
                "orderId": "1601010001",
                "name": "客户",
                "phone": "174xxxx2876",
                "address": "广场一期1#1-1-1",
                "isregist": 0,
                "iscome": 1
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageVticketForSelf

分页方式获取活动票信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 活动票信息列表 , 每条数据类型 `vticket`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "vtid": 1,
                "tno": "0000000000000000000",
                "vaid": 1,
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师",
                    "phone": "123xxxx5215",
                    "userPhoto": "/upload/Imag//userI01fdc2cc283d76ac6.jpg"
                },
                "belonger": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师",
                    "phone": "123xxxx5215",
                    "userPhoto": "/upload/Imag//userI01fdc2cc283d76ac6.jpg"
                },
                "createTime": "2016-01-01 00:00:00",
                "orderId": "1601010001",
                "name": "客户",
                "phone": "174xxxx2876",
                "address": "广场一期1#1-1-1",
                "isregist": 0,
                "iscome": 1
            }
        ],
        ...
    },
    ...
}
```


##### `查询` countVticket

根据活动票归属的部门 , 汇总统计部门拥有的活动票总数

**Returns:**

- `counts` (Object): 统计信息 , 类型 List <List <String>>

```json
{
    ...
    "counts":[
        ["一分区", "一部", "2"],
        ["二分区", "二部", "10"]
    ],
    ...
}
```


##### `查询` createVticket

创建活动票信息

根据归属人所属部门以及分区 , 完成活动票归属部门以及分区

**Requests:**

- `vticket.tno` (String): 活动票号
- `vticket.vaid` (Long): 活动ID
- `vticket.belonger.userId` (String): 归属人编号
- `vticket.orderId` (String): 装修单号
- `vticket.name` (String): 姓名
- `vticket.phone` (String): 电话
- `vticket.address` (String): 地址

```json
{
    "vticket.tno": "000000000000000000",
    "vticket.vaid": 1,
    "vticket.belonger.userId": "U002",
    "vticket.orderId": "1601010001",
    "vticket.name": "客户",
    "vticket.phone": "174xxxx2876",
    "vticket.address": "广场一期1#1-1-1",
}
```


##### `查询` updateVticket

更新活动票信息

根据归属人所属部门以及分区 , 更新活动票归属部门以及分区

**Requests:**

- `vticket.vtid` (Long): 活动票ID
- `vticket.belonger.userId` (String): 归属人编号
- `vticket.orderId` (String): 装修单号
- `vticket.name` (String): 姓名
- `vticket.phone` (String): 电话
- `vticket.address` (String): 地址

```json
{
    "vticket.vtid": 1,
    "vticket.belonger.userId": "U002",
    "vticket.orderId": "1601010001",
    "vticket.name": "客户",
    "vticket.phone": "174xxxx2876",
    "vticket.address": "广场一期1#1-1-1",
}
```


##### `查询` registVticket

更新活动票注册

**Requests:**

- `vticket.vtid` (Long): 活动票ID

```json
{
    "vticket.vtid": 1
}
```


##### `查询` comeVticket

更新活动票到场

判断活动票是否存在 , 不存在 , 错误信息 **160044 活动票不存在**

判断活动票是否已经注册 , 未注册 , 错误信息 **160045 活动票未注册**

**Requests:**

- `vticket.vtid` (Long): 活动票ID

```json
{
    "vticket.vtid": 1
}
```


##### `查询` takeVticket

认领活动票

获取当前状态为0(初始) , 无归属人的活动票 , 更新归属人/部门/分区信息


##### `查询` freeVticket

释放活动票

判断活动票是否存在 , 不存在 , 错误信息 **160044 活动票不存在**

判断操作人是否为归属人 , 非同一人 , 错误信息 **160051 活动票不可操作**

**Requests:**

- `vticket.vtid` (Long): 活动票ID

```json
{
    "vticket.vtid": 1
}
```

### 款项


> **类**: `api.information.VpaymentAction`


#### 数据类型: `vpayment`

| 参数 | 说明 | 类型 |
|------|------|------|
| `vpid` | 活动款ID | Long |
| `mno` | 会员号 | String |
| `vaid` | 活动ID | Long |
| `orderId` | 装修单号 | String |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `collecter` | 收款人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `collectTime` | 收款时间 | Timestamp |
| `type` | 类型 , 0: 装修款 , 1: 装修定金 , 2: 主材款 , 3: 主材定金 | Short |
| `status` | 状态 , 0: 未付款 , 1: 已付款 | Short |
| `category` | 品牌 | String |
| `brand` | 品牌 | String |
| `money` | 金额 | Integer |
| `cash` | 现金 | Integer |
| `bank` | 刷卡 | Integer |
| `bankInfo` | 刷卡信息 | String |
| `comment` | 说明 | String |


#### 数据类型: `vreceipt`

| 参数 | 说明 | 类型 |
|------|------|------|
| `vrid` | 活动收据ID | Long |
| `orderId` | 装修单号 | String |
| `collecter` | 收款人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `collectTime` | 收款时间 | Timestamp |
| `cash` | 现金 | Integer |
| `bank` | 刷卡 | Integer |
| `bankInfo` | 刷卡信息 | String |
| `comment` | 说明 | String |


##### `查询` pageVpayment

分页方式获取活动款信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 活动款信息列表 , 每条数据类型 `vpayment`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "vpid": 1,
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


##### `查询` queryVpaymentByVrid

通过活动收据ID获取活动款信息

**Requests:**

- `vpayment.vrid` (Long): 活动收据ID

```json
{
    "vpayment.vrid": 1
}
```

**Returns:**

- `vpayments` (List): 活动款信息列表 , 每条数据类型 `vpayment`

```json
{
    ...
    "vpayments": [
        {
            "vpid": 1,
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


##### `查询/创建` queryVpaymentByNo

通过活动票号获取活动款信息

**Requests:**

- `vpayment.mno` (String): 活动票号

```json
{
    "vpayment.mno": "000000000000000000"
}
```

**Returns:**

- `vpayments` (List): 活动款信息列表 , 每条数据类型 `vpayment`

```json
{
    ...
    "vpayments": [
        {
            "vpid": 1,
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


##### `查询` queryVreceiptByVrid

通过活动收据ID获取活动收据信息

**Requests:**

- `vreceipt.vrid` (Long): 活动收据ID

```json
{
    "vreceipt.vrid": 1
}
```

**Returns:**

- `vreceipt` (Object): 活动收据

```json
{
    ...
    "vreceipt": {
        "brid": 1,
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


##### `查询` countVpayment

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


##### `查询` createVpayment

创建活动款信息

**Requests:**

- `vpayment.mno` (String): 活动票号
- `vpayment.type` (Short): 类型
- `vpayment.category` (String): 品类
- `vpayment.brand` (String): 品牌
- `vpayment.money` (Integer): 金额
- `vpayment.comment` (String): 备注

```json
{
    "vpayment.mno": "000000000000000000",
    "vpayment.type": 1,
    "vpayment.category": "品类",
    "vpayment.brand": "品牌1",
    "vpayment.money": 100000,
    "vpayment.comment": "说明"
}
```


##### `查询` collectVpayment

活动款收款 , 同时支持批量收款

判断活动票是否存在 , 不存在 , 错误信息 **160044 活动票不存在**

判断活动票是否已经注册 , 未注册 , 错误信息 **160045 活动票未注册**

判断活动款总额是否与收款总额相同

批量收款时 , 判断多个款项对应人会员号是否唯一

创建收款数据 , 更新款项状态

**Requests:**

- `vreceipt.orderId` (String): 装修单号
- `vreceipt.cash` (Integer): 现金
- `vreceipt.bank` (Integer): 刷卡
- `vreceipt.bankInfo` (String): 刷卡信息
- `vreceipt.comment` (String): 说明

```json
{
    "vpayment[0].vpid": 1,
    "vpayment[1].vpid": 2,
    "vreceipt.orderId": "1601010001",
    "vreceipt.cash": 100000,
    "vreceipt.bank": 0,
    "vreceipt.bankInfo": "",
    "vreceipt.comment": "说明"
}
```

### 奖品


> **类**: `api.information.VawardAction`


#### 数据类型: `vaward`

| 参数 | 说明 | 类型 |
|------|------|------|
| `vaid` | 奖品ID | Long |
| `vpid` | 奖品ID | Long |
| `no` | 票号 | String |
| `name` | 名称 | String |
| `price` | 价格 | Integer |
| `num` | 数量 | Integer |
| `unit` | 单位 | String |
| `status` | 状态 | Short |


##### `查询/创建` queryVawardByNo

通过票号获取奖品信息

**Requests:**

- `vaward.no` (String): 票号

```json
{
    "vaward.no": "0000000000"
}
```

**Returns:**

- `vawards` (List): 奖品信息列表 , 每条数据类型 `vaward`

```json
{
    ...
    "vawards": [
        {
            "vaid": 1,
            "vpid": 1,
            "no": "0000000000",
            "name": "奖品",
            "price": 100000,
            "num": 21000,
            "unit": "个"
        }
    ]
    ...
}
```


##### `查询/创建` addVaward

添加奖品

判断活动票是否存在 , 不存在 , 错误信息 **160026 活动票不存在**

判断活动票是否到场 , 未到场 , 错误信息 **160046 活动票未到场**

判断奖品是否存在 , 不存在 , 错误信息 **160048 奖品不存在**

判断活动票和奖品归属的活动 , 活动不同 , 错误信息 **160049 活动不同不可操作**

**Requests:**

- `vaward.no` (String): 票号
- `vaward.vpid` (Long): 奖品ID
- `vaward.num` (Integer): 数量

```json
{
    "vaward.no": "0000000000",
    "vaward.vpid": 1,
    "vaward.num": 21000,
    "vaward.unit": "个"
}
```


##### `查询` deleteVaward

删除奖品

判断奖品是否存在 , 不存在 , 错误信息 **160048 奖品不存在**

**Requests:**

- `vaward.vaid` (Long): 奖品ID

```json
{
    "vaward.vaid": 1
}
```


##### `查询/创建` countVaward

汇总统计奖品信息

**Returns:**

- `counts` (Object): 统计信息 , 类型 List <List <String>>

```json
{
    ...
    "counts":[
        ["奖品一", "2"],
        ["奖品二", "2"],
    ],
    ...
}
```

## 计划


> **类**: `api.information.PlanAction`


#### 数据类型: `plan`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pid` | 计划ID | Long |
| `task` | 任务 , 类型 [task ](./information.html#api.data.TaskAction.task) | Object |
| `args` | 任务参数 | String |
| `cuid` | 创建人ID | Long |
| `createTime` | 创建时间 | Timestamp |
| `executeTime` | 执行时间 | String |
| `resultFilePath` | 结果文件路径 | String |
| `resultFileSize` | 结果文件大小 | Integer |
| `infoFilePath` | 信息文件路径 | String |
| `infoFileSize` | 信息文件大小 | Integer |
| `schedule` | 进度 , 范围: 1-100 | Short |
| `status` | 状态 , 0: 初始 , 1: 取消 , 2: 成功 , 3: 失败 , 4: 执行 | Short |
| `info` | 结果信息 | String |


##### `查询` pagePlan

分页方式获取计划信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

返回的计划信息为当前操作人创建

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 计划信息列表 , 每条数据类型 `plan`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "pid": 1,
                "task": {
                    "tid": 1,
                    "name": "任务",
                    "filepath": "/fanglin/task/execution.py",
                    "type": 1
                },
                "args": "2016-01-01 2016-01-01",
                "createTime": "2016-01-01 00:00:00",
                "executeTime": "01010000",
                "resultFilePath": "",
                "resultFileSize": 0,
                "infoFilePath": "",
                "infoFileSize": 0,
                "schedule": 0,
                "status": 0,
                "info": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryPlan

查询计划

**Requests:**

- `plan.pid` (Long): 计划ID

```json
{
    "plan.pid": 1
}
```

**Returns:**

- `plan` (Object): 计划信息 , 数据类型 `plan`

```json
{
    ...
    "plan": {
        "pid": 1,
        "task": {
            "tid": 1,
            "name": "任务",
            "filepath": "/fanglin/task/execution.py",
            "type": 1
        },
        "args": "2016-01-01 2016-01-01",
        "createTime": "2016-01-01 00:00:00",
        "executeTime": "01010000",
        "resultFilePath": "",
        "resultFileSize": 0,
        "infoFilePath": "",
        "infoFileSize": 0,
        "schedule": 0,
        "status": 0,
        "info": ""
    }
    ...
}
```


##### `查询` existPlan

判断计划是否存在

**Requests:**

- `plan.task.keyword` (String): 任务关键字
- `plan.args` (String): 参数

```json
{
    "plan.task.keyword": "keyword",
    "plan.args": "args"
}
```

**Returns:**

- `plans` (List): 计划信息列表 , 每条数据类型 `plan`

```json
{
    ...
    "plans": [
        {
            "pid": 1,
            "task": {
                "tid": 1,
                "name": "任务",
                "filepath": "/fanglin/task/execution.py",
                "type": 1
            },
            "args": "2016-01-01 2016-01-01",
            "createTime": "2016-01-01 00:00:00",
            "executeTime": "01010000",
            "resultFilePath": "",
            "resultFileSize": 0,
            "infoFilePath": "",
            "infoFileSize": 0,
            "schedule": 0,
            "status": 0,
            "info": ""
        }
    ]
    ...
}
```


##### `查询` createPlan

创建计划

当前操作人员拥有未执行任务总数不得超过3个 , 错误信息 **160030 未执行任务达到上限**

执行时间为空 , 立即执行

严格判断执行的任务是否存在 , 不存在不能执行 , 避免通过args进行注入攻击 , 错误信息 **160029 计划不可操作**

**Requests:**

- `plan.task.tid` (String): 任务ID
- `plan.args` (String): 参数
- `plan.executeTime` (String): 执行时间

```json
{
    "plan.task.tid": 1,
    "plan.args": "2016-01-01 2016-01-01",
    "plan.executeTime": ""
}
```


##### `查询` updatePlanForAdvance

更新计划状态以及进度

判断计划是否存在 , 不存在 , 错误信息 **160028 计划不存在**

判断计划状态是否为0(初始)或4(执行) , 其他状态 , 错误信息 **160029 计划不可操作**

**Requests:**

- `plan.pid` (Long): 计划ID
- `plan.status` (Short): 状态
- `plan.schedule` (Short): 进度
- `plan.resultFilePath` (String): 结果文件路径
- `plan.resultFileSize` (Integer): 结果文件大小
- `plan.infoFilePath` (String): 信息文件路径
- `plan.infoFileSize` (Integer): 信息文件大小

```json
{
    "plan.pid": 1
    "plan.status": 1,
    "plan.schedule": 100,
    "plan.resultFilePath": "",
    "plan.resultfileSize": 0,
    "plan.infoFilePath": "",
    "plan.infoFileSize": 0
}
```


##### `查询` cancelPlan

注销计划

判断注销计划是否存在 , 不存在 , 错误信息 **160028 计划不存在**

判断注销任务是否归属当前操作人 , 不归属 , 错误信息 **160029 计划不可操作**

判断注销计划状态是否为0(初始) , 错误信息 **160029 计划不可操作**

**Requests:**

- `plan.pid` (String): 计划ID

```json
{
    "plan.pid": 1
}
```

## 工单


提供展会/节日等大型活动部分业务支持


> **类**: `api.information.WorksheetAction`


#### 数据类型: `worksheet`

| 参数 | 说明 | 类型 |
|------|------|------|
| `wsid` | 工单ID | Long |
| `code` | 单号 | String |
| `module` | 模块 | String |
| `content` | 内容 | String |
| `path` | 路径 | String |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `status` | 状态 , 0: 初始 , 1: 取消, 2: 处理, 3: 完成 | Short |
| `handler` | 处理人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `handTime` | 处理时间 | Timestamp |
| `result` | 结果 | String |


##### `查询` pageWorksheet

分页方式获取工单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 工单信息列表 , 每条数据类型 `worksheet`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "wsid": 1,
                "code": "1601010001",
                "module": "模块",
                "content": "内容",
                "path": "",
                "creater": {
                    "uid": 1,
                    "userId": "U0479",
                    "userName": "白雪",
                    "currentName": "白雪"
                },
                "createTime": "2016-01-01 00:00:00",
                "status": 1,
                "handler": {
                    "uid": 2,
                    "userId": "U1545",
                    "userName": "张杰",
                    "currentName": "张杰"
                },
                "handTime" : "2016-01-01 00:00:00",
                "result": "处理结果"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryWorksheet

根据创建人查询工单信息


##### `查询` addWorksheet

添加工单

**Requests:**

- `worksheet.module` (String): 模块
- `worksheet.content` (String): 内容

```json
{
    "worksheet.module": "模块",
    "worksheet.content": "内容"
}
```


##### `查询` updateWorksheet

更新

判断工单是否存在 , 不存在 , 错误信息 **160050 工单不存在**

**Requests:**

- `worksheet.wsid` (Long): 工单ID
- `worksheet.path` (String): 路径

```json
{
    "worksheet.wsid": 1,
    "worksheet.path": ""
}
```


##### `查询` cancelWorksheet

取消工单

判断工单是否存在 , 不存在 , 错误信息 **160050 工单不存在**

判断工单状态是否为0(初始) , 其他状态不可操作 , 错误信息 **160051 工单不可操作**

**Requests:**

- `worksheet.wsid` (Long): 工单ID

```json
{
    "worksheet.wsid": 1
}
```


##### `查询` handleWorksheet

处理工单

判断工单是否存在 , 不存在 , 错误信息 **160050 工单不存在**

判断工单状态是否为0(初始) , 其他状态不可操作 , 错误信息 **160051 工单不可操作**

**Requests:**

- `worksheet.wsid` (Long): 工单ID

```json
{
    "worksheet.wsid": 1
}
```


##### `查询` finishWorksheet

完成

判断工单是否存在 , 不存在 , 错误信息 **160050 工单不存在**

判断工单状态是否为2(处理) , 其他状态不可操作 , 错误信息 **160051 工单不可操作**

**Requests:**

- `worksheet.wsid` (Long): 工单ID

```json
{
    "worksheet.wsid": 1
}
```
