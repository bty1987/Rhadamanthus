.. production:

# 生产


## 车间


> **类**: `api.production.WorkshopAction`


#### 数据类型: `workshop`

| 参数 | 说明 | 类型 |
|------|------|------|
| `wsid` | 车间ID | Long |
| `name` | 车间名称 | String |
| `status` | 状态 , 0: 启用, 1: 禁用 | Short |
| `company` | 公司ID | Long |


##### `查询` pageWorkshop

分页方式获取车间信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 车间信息列表 , 每条数据类型 `workshop`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "wsid": 1,
                "name": "油漆车间"
            },
        ],
        ...
    },
    ...
}
```


##### `查询` queryWorkshop

获取车间信息

按照公司作为默认条件查询

**Returns:**

- `workshops` (List): 车间信息列表 , 每条数据类型 `workshop`

```json
{
    "workshop": 
        {
            "wsid": 1,
            "name": "油漆车间"
        },
    ...
}
```


##### `查询` addWorkshop

添加车间信息

**Requests:**

- `workshop.name` (String): 车间名称

```json
{
    "workshop.name": "油漆车间",
}
```


##### `查询` updateWorkshop

更新车间信息

判断车间信息是否存在 , 不存在更新失败 , 错误信息 **220016 车间不存在**

**Requests:**

- `workshop.wsid` (Long): 车间ID
- `workshop.name` (String): 名称

```json
{
    "wsid": 1,
    "name": "新油漆车间",
}
```


##### `查询` updateWorkshopForStatus

更新车间状态

判断车间信息是否存在 , 不存在更新失败 , 错误信息 **220016 车间不存在**

**Requests:**

- `workshop.wsid` (Long): 车间ID
- `workshop.status` (Short): 状态

```json
{
    "wsid": 1,
    "status": 0
}
```

## 工序


> **类**: `api.production.WorkflowAction`


#### 数据类型: `workflow`

| 参数 | 说明 | 类型 |
|------|------|------|
| `wfid` | 工序ID | Long |
| `name` | 名称 | String |
| `status` | 状态 , 0: 启用, 1: 禁用 | Short |
| `company` | 公司ID | Long |


:param name: 名称
:type name: String


##### `查询` pageWorkflow

分页方式获取工序信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 工序信息列表 , 每条数据类型 `workflow`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "wfid": 1,
                "name": "裁边",
            },
        ],
        ...
    },
    ...
}
```


##### `查询` queryWorkflow

获取工序信息

按照公司作为默认条件查询

**Returns:**

- `workflows` (List): 工序信息项 , 数据类型 `workflow`

```json
{
    "workflows": [
        {
            "wfid": 1,
            "name": "裁边",
        }
    ]
    ...
}
```


##### `查询` addWorkflow

添加工序信息

工序归属公司跟随操作人变化

**Requests:**

- `workflow.name` (String): 工序名称

```json
{
    "workflow.name": "裁边",
}
```


##### `查询` updateWorkflow

更新工序信息

判断工序是否存在 , 不存在更新失败 , 错误信息 **210017 工序不存在**

**Requests:**

- `workflow.wfid` (Long): 工序ID
- `workflow.name` (String): 名称

```json
{
    "wfid": 1,
    "name": "裁边",
}
```


##### `查询` updateWorkflowForStatus

更新工序状态

判断工序是否存在 , 不存在更新失败 , 错误信息 **210017 工序不存在**

**Requests:**

- `workflow.wfid` (Long): 工序ID
- `workflow.status` (Short): 状态

```json
{
    "wfid": 1,
    "status": 0
}
```

## 工序组


> **类**: `api.production.WorkplanAction`


#### 数据类型: `workplan`

| 参数 | 说明 | 类型 |
|------|------|------|
| `wpid` | 工序组ID | Long |
| `name` | 名称 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `comment` | 备注信息 | String |
| `workshop` | 车间 , 类型 [workshop ](./workshop.html#api.production.WorkshopAction.workshop) | Object |
| `company` | 公司ID | Long |


:param name: 工序组名称
:type name: String


##### `查询` pageWorkplan

分页方式获取车间信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 工序组信息列表 , 每条数据类型 :data: workplan

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "wpid": 1,
                "name": "工序组",
                "status": 0,
                "comment": "",
                "workshop": {
                    "wsid": 1,
                    "name": "油漆车间",
                }
            },
        ],
        ...
    },
    ...
}
```


##### `查询` queryWorkplan

获取工序组信息

按照公司作为默认条件查询

**Returns:**

- `workplans` (List): 工序组信息列表 , 每条数据类型 `workplan`

```json
{
    ...
    "workplans": [
        {
            "wpid": 1,
            "name": "工序组",
            "status": 0,
            "comment": "",
            "workshop": {
                "wsid": 1,
                "name": "油漆车间",
            }
        }
    ],
    ...
}
```


##### `查询` queryWorkplanByWsid

通过车间ID查询工序组信息

按照公司作为默认条件查询

**Requests:**

- `workplan.workshop.wsid` (Long): 车间ID

```json
{
    "workplan.workshop.wsid": "1"
}
```

**Returns:**

- `workplans` (List): 工序组信息列表 , 每条数据类型 `workplan`

```json
{
    ...
    "workplans": [
        {
            "wpid": 1,
            "name": "工序组",
            "status": 0,
            "comment": "",
            "workshop": {
                "wsid": 1,
                "name": "油漆车间",
            }
        }
    ],
    ...
}
```


##### `查询` addWorkplan

添加工序组信息

工序归属公司跟随操作人变化

**Requests:**

- `workplan.name` (String): 工序组名称
- `workplan.comment` (String): 备注
- `workplan.workshop.wsid` (Long): 车间ID

```json
{
    "workplan.name": "第一工序组",
    "workplan.comment": "",
    "workplan.workshop.wsid": 1,
}
```


##### `查询` updateWorkplan

更新工序组信息

判断工序组是否存在 , 不存在更新失败 , 错误信息 **220018 工序组不存在**

**Requests:**

- `workplan.wpid` (Long): 工序组ID
- `workplan.name` (String): 工序组名称
- `workplan.comment` (String): 备注信息
- `workplan.workshop.wsid` (Long): 车间ID

```json
{
    "workplan.wpid": 1,
    "workplan.name": "第一工序组",
    "workplan.comment": "",
    "workplan.workShop.wsid": 1
}
```


##### `查询` updateWorkplanForStatus

更新工序组状态

判断工序组是否存在 , 不存在更新失败 , 错误信息 **220018 工序组不存在**

**Requests:**

- `workplan.wpid` (Long): 工序组ID
- `workplan.status` (Short): 状态 , 0: 启用 , 1: 禁用

```json
{
    "workplan.wsid": 1,
    "workplan.status": 1
}
```

## 工序组-工序


> **类**: `api.production.WorkFlowPlanAction`


#### 数据类型: `workflowPlan`

| 参数 | 说明 | 类型 |
|------|------|------|
| `wfpid` | ID | Long |
| `workflow` | 工序 , 类型[workflow ](./production.html#api.production.WorkflowAction.workflow) | Object |
| `workplan` | 工序组 , 类型[workplan ](./production.html#api.production.WorkplanAction.workplan) | Object |


##### `查询` queryWorkflowPlanByWfid

通过工序ID查询与之相关工序组

**Requests:**

- `workflowPlan.workflow.wfid` (Long): 工序ID

```json
{
    "workflowPlan.workflow.wfid": 1,
}
```

**Returns:**

- `workflowPlans` (List): 工序组-工序信息列表, 每条数据类型 `workflowPlan`

```json
{
    ...
    "workflowPlans": [
        {
            "wfpid": 1,
            "workflow": {
                "wfid": 1,
                "name": "裁边",
            },
            "workplan": {
                "wpid": 1,
                "name": "第一工序组",
                "comment": "",
                "workShop": {
                    "wsid": 1,
                    "name": "油漆车间",
                }
            }
        },
    ],
    ...
}
```


##### `查询` queryWorkflowPlanByWpid

通过工序组ID查询与之相关工序

**Requests:**

- `workflowPlan.workflow.wpid` (Long): 工序组ID

```json
{
    "workflowPlan.workplan.wpid": 1,
}
```

**Returns:**

- `workflowPlans` (List): 工序组与工序关系列表, 每条数据类型 :data: workflowPlan

```json
{
    ...
    "workflowPlans": [
        {
            "wfpid": 1,
            "workflow": {
                "wfid": 1,
                "name": "裁边",
            },
            "workplan": {
                "wpid": 1,
                "name": "第一工序组",
                "comment": "",
                "workShop": {
                    "wsid": 1,
                    "name": "油漆车间",
                }
            }
        },
    ],
    ...
}
```


##### `查询` updateWorkflowPlan

更新工序到工序组

判断工序组是否存在 , 不存在更新失败 , 错误信息 **220018 工序组不存在**

删除工序组原关联工序信息 , 之后更新工序组对应的工序信息

**Requests:**

- `workflowPlan.workplan.wfpid` (Long): 工序组ID

```json
{
    "workFlowPlan.workplan.wfpid": 1,
    "wfids[0]": 1
}
```

## 人员-工序


> **类**: `api.production.UserWorkflowAction`


#### 数据类型: `userWorkflow`

| 参数 | 说明 | 类型 |
|------|------|------|
| `uwid` | 工序组ID | Long |
| `uid` | 人员ID | Long |
| `workflow` | 工序,类型[workflow ](./production.html#api.production.WorkflowAction.workflow) | Object |


##### `查询` queryUserWorkflowByUid

通过员工ID查询与之相关工序

**Requests:**

- `userWorkFlow.uid` (Long): 员工ID

```json
{
    "userWorkFlow.uid": 34,
}
```

**Returns:**

- `userWorkflows` (List): 员工与工序关系列表, 每条数据类型 `userWorkflow`

```json
{
    ...
    "userWorkflows": [
        {
            "uwfid": 1,
            "uid": 24,
            "workflow": {
                "wfid": 1,
                "name": "第一工序组",
            }
        },
    ],
    ...
}
```


##### `查询` updateUserWorkflow

更新员工对应的工序

判断员工是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

删除员工原关联工序信息 , 之后更新人员对应的工序信息

**Requests:**

- `userWorkflow.uid` (Long): 员工ID

```json
{
    "userWorkflow.uid": 1,
    "wfids[0]": 1
}
```

## 报价类型


> **类**: `api.production.QuoteTypeAction`


#### 数据类型: `quoteType`

| 参数 | 说明 | 类型 |
|------|------|------|
| `qtid` | 报价类型ID | Long |
| `name` | 报价类型名称 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |


:param name: 报价类型名称
:type name: String


##### `查询` pageQuoteType

分页方式获取报价类型信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 报价类型信息列表 , 每条数据类型 `quoteType`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "qtid": 1,
                "name": "板式家具",
                "status": 0
            },
        ],
        ...
    },
    ...
}
```


##### `查询` queryQuoteType

通过品类名称查询报价类型

**Returns:**

- `quoteTypes` (List): 报价类型信息 , 类型 :data: `quoteType`

```json
{
    ...
    "quoteType": [
        {
            "qtid": 1,
            "name": "板式家具",
            "status": 0
        }
    ]
    ...
}
```


##### `查询` addQuoteType

添加报价类型

**Requests:**

- `quoteType.name` (String): 名称

```json
{
   "quoteType.name": "板式家具"
}
```


##### `查询` updateQuoteType

更新报价类型

判断报价类型是否存在 , 不存在更新失败 , 错误信息 **220020 报价类型不存在**

**Requests:**

- `quoteType.qtid` (Long): 报价类型ID
- `quoteType.name` (String): 名称

```json
{
    "quoteType.qtid": 1,
    "quoteType.name": "板式家具"
}
```


##### `查询` updateQuoteTypeForStatus

更新报价类型状态

判断报价类型是否存在 , 不存在更新失败 , 错误信息 **220020 报价类型不存在**

**Requests:**

- `quoteType.qtid` (Long): 报价类型ID
- `quoteType.status` (Short): 状态

```json
{
    "quoteType.qtid": 1,
    "quoteType.status": 1
}
```

## 报价项


> **类**: `api.production.QuoteItemAction`


#### 数据类型: `quoteItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `qiid` | 报价项ID | Long |
| `name` | 名称 | String |
| `pinyin` | 拼音 | String |
| `format` | 型号 | String |
| `measurementunit` | 单位 | String |
| `unitprice` | 单价 | Integer |
| `quoteType` | 类型 , 类型 [quoteType ](./production.html#api.production.QuoteTypeAction.quoteType) | Object |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `company` | 公司ID | Long |


:param name: 名称
:type name: String
:param type: 类型
:type type: Long


##### `查询` pageQuoteItem

分页方式获取报价项信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 报价项信息列表 , 每条数据类型 `quoteItem`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "qiid": 1,
                "name": "顶板",
                "pinyin": "dingban",
                "format": "zx-1",
                "measurementunit": "个",
                "unitprice": 10000,
                "quoteType": {
                    "qtid": 1,
                    "name": "板式家具",
                    "status": 0,
                },
                "status": 0
            },
        ],
        ...
    },
    ...
}
```


##### `查询` queryQuoteItemByPinyin

通过拼音查询报价项数据

按照公司作为默认条件查询

**Requests:**

- `quoteItem.pinyin` (String): 拼音

```json
{
    "quoteItem.pinyin": "dingban"
}
```

**Returns:**

- `quoteItems` (List): 报价项信息 , 类型 `quoteItem`

```json
{
    ...
    "quoteItem": [
        {
            "qiid": 1,
            "name": "顶板",
            "pinyin": "dingban",
            "format": "zx-1",
            "measurementunit": "个",
            "unitprice": 10000,
            "quoteType": {
                "qtid": 1,
                "name": "板式家具",
                "status": 0,
            },
            "status": 0
        }
    ],
    ...
}
```


##### `查询` addQuoteItem

添加报价项数据

工序归属公司跟随操作人变化

**Requests:**

- `quoteItem.name` (String): 报价项名称
- `quoteItem.pinyin` (String): 拼音
- `quoteItem.format` (String): 型号
- `quoteItem.measurementunit` (String): 单位
- `quoteItem.unitprice` (Integer): 单价
- `quoteItem.quoteType.qtid` (Long): 品类ID

```json
{
    "quoteItem.name": "顶板",
    "quoteItem.pinyin": "dingban",
    "quoteItem.format": "zx-1",
    "quoteItem.measurementunit": "个",
    "quoteItem.unitprice": 10000,
    "quoteItem.quoteType.qtid": 1,
}
```


##### `查询` updateQuoteItem

更新报价项信息

判断报价项是否存在 , 不存在更新失败 , 错误信息 **220019 报价项不存在**

**Requests:**

- `quoteItem.qiid` (Long): 报价项ID
- `quoteItem.name` (String): 报价项名称
- `quoteItem.pinyin` (String): 拼音
- `quoteItem.format` (String): 型号
- `quoteItem.measurementunit` (String): 单位
- `quoteItem.unitprice` (Integer): 单价
- `quoteItem.quoteType.qtid` (Long): 品类ID

```json
{
    "quoteItem.qiid": "1",
    "quoteItem.name": "顶板",
    "quoteItem.pinyin": "dingban",
    "quoteItem.format": "zx-1",
    "quoteItem.measurementunit": "个",
    "quoteItem.unitprice": 10000,
    "quoteItem.quoteType.qtid": 1,
}
```


##### `查询` updateQuoteItemForStatus

更新报价项状态

判断报价项是否存在 , 不存在更新失败 , 错误信息 **220019 报价项不存在**

**Requests:**

- `quoteItem.qiid` (Long): 报价项ID
- `quoteItem.status` (Short): 报价项状态

```json
{
    "quoteItem.qiid": 1,
    "quoteItem.status": 0
}
```

## 生产单


> **类**: `api.production.ProductionAction`


#### 数据类型: `production`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pid` | 生产单ID | Long |
| `orderId` | 装修单号 | String |
| `house` | 房产 , 类型 [house ](./data.html#api.data.HouseAction.house) | Object |
| `total` | 总价 | Long |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `designer` | 设计师 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `salesman` | 销售员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `spliter` | 拆单员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `status` | 状态 , 0: 初始 , 1: 设计 , 2: 生产 , 3: 仓库 , 4: 物流 , 5: 运输 , 6: 安装 , 7: 完成 , 8: 售后, 9: 完结 , 10: 废单 | Short |
| `createTime` | 创建时间 | Timestamp |
| `designTime` | 设计时间 | Timestamp |
| `divideTime` | 生产时间 | Timestamp |
| `storeTime` | 仓储时间 | Timestamp |
| `planTime` | 物流时间 | Timestamp |
| `mountTime` | 安装时间 | Timestamp |
| `updateTime` | 更新时间 , 最近完成工作时间 | Timestamp |
| `timeLimit` | 工期 | Integer |
| `spid` | 父级生产单ID | Long |
| `type` | 类型, 0:生产单 1:售后单 | Short |
| `company` | 公司ID | Long |


##### `查询` pageProduction

分页方式获取生产单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

按照公司作为默认条件查询

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 生产单信息列表 , 每条数据类型 `production`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "pid": 1,
                "orderId": 160801000,
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期",
                        "deliveryTime": null,
                        "developer": "222",
                        "salesPhone": "",
                        "status": 0,
                    },
                    "houseNumber": "1#1-1-1",
                    ...
                },
                "total": 12000000,
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "designer": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "salesman": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "spliter": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "status": 0,

                "createTime": "2016-01-01 00:00:00",
                "designTime": null,
                "divideTime": null,
                "storeTime": null,
                "planTime": null,
                "mountTime": null,
                "updateTime": "2016-01-01 00:00:00",

                "timeLimit": 92400,
                "spid": 0,
                "type": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` addProduction

添加生产单

工序归属公司跟随操作人变化

**Requests:**

- `production.orderId` (String): 装修单号
- `production.house.hid` (Long): 房产ID
- `production.total` (Long): 总价
- `production.designer.uid` (Long): 设计师ID
- `production.salesman.uid` (Long): 销售员ID
- `production.spliter.uid` (Long): 拆单员ID
- `production.timeLimit` (Integer): 工期

```json
{
    "production.orderId": "1608010000",
    "production.house.hid": 1,
    "production.total" 12000000,
    "production.designer.uid": 2,
    "production.salesman.uid": 2,
    "production.spliter.uid": 2,
    "production.timeLimit": 90000
}
```


##### `查询` updateProduction

更新生产单

判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

判断生产单状态 , 0(初始)之外的其他状态 , 不可修改设计师 ; 0(初始)和1(设计)之外的其他状态 , 不可修改拆单员

**Requests:**

- `production.pid` (Long): 生产单ID
- `production.designer.uid` (Long): 设计师ID
- `production.salesman.uid` (Long): 销售员ID
- `production.spliter.uid` (Long): 拆单员ID

```json
{
    "production.pid": 1,
    "production.designer.uid": 2,
    "production.salesman.uid": 2,
    "production.spliter.uid": 2
}
```


##### `查询` updateProductionForAdvance

更新生产单 , 高级操作

判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

**Requests:**

- `production.pid` (Long): 生产单ID
- `production.designer.uid` (Long): 设计师ID
- `production.salesman.uid` (Long): 销售员ID
- `production.spliter.uid` (Long): 拆单员ID
- `production.timeLimit` (Integer): 工期

```json
{
    "production.pid": 1,
    "production.designer.uid": 2,
    "production.salesman.uid": 2,
    "production.spliter.uid": 2,
    "production.timeLimit": 10000
}
```


##### `查询` designProduction

生产单进入设计阶段

判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

判断生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

更新生产单状态为1(设计) , 更新设计时间 , 更新生产单更新时间

**Requests:**

- `production.pid` (Long): 生产单ID

```json
{
    "production.pid": 1
}
```


##### `查询` splitProduction

生产单进入生产(拆单)阶段

判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

判断生产单状态1(设计) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

更新生产单状态为2(生产) , 更新拆单时间 , 更新生产单更新时间

**Requests:**

- `production.pid` (Long): 生产单ID

```json
{
    "production.pid": 1
}
```


##### `查询` instoreProduction

生产单进入仓储阶段

判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

判断生产单状态2(生产) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

更新生产单状态为3(仓库) , 更新仓储时间 , 更新生产单更新时间

**Requests:**

- `production.pid` (Long): 生产单ID

```json
{
    "production.pid": 1
}
```


##### `查询` planProduction

生产单进入物流阶段

判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

判断生产单状态3(仓库) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

更新生产单状态为4(物流) , 更新物流时间 , 更新生产单更新时间

更新生产单关联的物流包状态为2(物流) , 同时需要判断物流包状态是否存在0(初始) , 错误信息 220025 物流包状态不可操作

**Requests:**

- `production.pid` (Long): 生产单ID

```json
{
    "production.pid": 1
}
```


##### `查询` tranProduction

生产单进入运输阶段

判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

判断生产单状态4(物流) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

更新生产单状态为5(运输) , 更新安装时间 , 更新生产单更新时间

**Requests:**

- `production.pid` (Long): 生产单ID

```json
{
    "production.pid": 1
}
```


##### `查询` mountProduction

生产单进入物流阶段

判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

判断生产单状态5(运输) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

更新生产单状态为6(安装) , 更新安装时间 , 更新生产单更新时间

**Requests:**

- `production.pid` (Long): 生产单ID

```json
{
    "production.pid": 1
}
```


##### `查询` finishProduction

完结生产单

判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

判断生产单状态6(安装)/8(售后) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

更新生产单状态为7(完成) , 更新生产单更新时间

**Requests:**

- `production.pid` (Long): 生产单ID

```json
{
    "production.pid": 1
}
```


##### `查询` upholdProduction

售后生产单

判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

判断生产单状态7(完成) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

更新生产单状态为8(售后) , 更新生产单更新时间

**Requests:**

- `production.pid` (Long): 生产单ID

```json
{
    "production.pid": 1
}
```


##### `查询` terminalProduction

生产单废单

判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

判断生产单状态为0(初始)/1(设计) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

更新生产单状态为10(废单) , 更新完结时间 , 更新生产单更新时间

**Requests:**

- `production.pid` (Long): 生产单ID

```json
{
    "production.pid": 1
}
```

## 生产销售


生产单关联的销售单信息


> **类**: `api.production.ProductionSalesAction`


#### 数据类型: `productionSales`

| 参数 | 说明 | 类型 |
|------|------|------|
| `psid` | 生产销售ID | Long |
| `pid` | 生产单ID | Long |
| `sid` | 销售单ID | Long |


##### `查询` queryProductionSalesByPid

查询生产单中所有的生产销售单

**Requests:**

- `production.pid` (Long): 生产单ID

```json
{
    "production.pid": 1,
}
```

**Returns:**

- `productionSales` (List): 生产销售单 , 每条数据类型 `productionSales`

```json
{
    ...
    "productionSales": [
        {
            "psid": 1,
            "pid": 1,
            "sid": 1,
            "type": 0
        }
    ]
    ...
}
```


##### `查询` bindProductionSales

绑定生产单与销售单关联关系

判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

更新关联生产单更新时间

**Requests:**

- `productionSales.pid` (Long): 生产单ID
- `productionSales.sid` (Long): 销售单ID

```json
{
    "productionSales.pid": 1,
    "productionSales.sid": 1
}
```

## 报价


> **类**: `api.production.PuotationAction`


#### 数据类型: `puotation`

| 参数 | 说明 | 类型 |
|------|------|------|
| `qid` | 报价ID | Long |
| `pid` | 生产单ID | Long |
| `name` | 名称 | String |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `total` | 总价 | Long |
| `discount` | 折让 | Integer |
| `default` | 默认 , 1: 正使用 , 0: 未使用 | Short |
| `comment` | 说明 | String |


#### 数据类型: `puotationItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `qiid` | 报价项ID | Long |
| `qid` | 报价ID | Long |
| `name` | 报价项名称 | String |
| `format` | 规格 | String |
| `height` | 高度 | Integer |
| `width` | 宽度 | Integer |
| `thick` | 厚度 | Integer |
| `unitPrice` | 单价 | Integer |
| `num` | 数量 | Integer |
| `total` | 总价 | Long |
| `measurementUnit` | 单位 | String |
| `comment` | 备注 | String |
| `specil` | 特型 | String |
| `quoteType` | 类型 | String |


##### `查询` queryPuotationByPid

通过生产单ID查询报价

**Requests:**

- `puotation.pid` (Long): 生产单ID

```json
{
    "puotation.pid": 1,
}
```

**Returns:**

- `puotations` (Object): 报价信息列表, 数据类型 `puotation`

```json
{
    ...
    "puotations": [
        {
            "qid": 1,
            "pid": 22000,
            "name": "一号报价",
            "creater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "createTime": "2016-06-01",
            "total": 0,
            "discount": 0,
            "default": 1,
        }
    ],
    ...
}
```


##### `查询` queryPuotationItemByQid

通过报价ID获取报价项

**Requests:**

- `puotation.qid` (Long): 报价ID

```json
{
    "puotation.qid": 1,
}
```

**Returns:**

- `puotationItems` (List): 报价项列表, 数据类型 `puotationItem`

```json
{
    ...
    "puotationItems": [
        {
            "qiid": 1,
            "qid": 1,
            "name": "背板",
            "format": "zx-1",
            "height": 15000,
            "width": 15000,
            "thick": 2000,
            "measurementUnit": "个",
            "unitPrice": 150000,
            "num": 2000,
            "total": 300000,
            "comment": "",
            "specil": "",
            "quoteType": "板式家具"
        }
    ],
    ...
}
```


##### `查询` addPuotation

创建报价信息

判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

更新关联生产单更新时间

**Requests:**

- `puotation.pid` (Long): 生产单ID
- `puotation.name` (String): 报价名称

```json
{
    "production.pid": 1,
    "puotation.name": "一号报价"
}
```


##### `查询` addPuotationItem

添加报价项

判断报价是否存在 , 不存在更新失败 , 错误信息 **220014 报价不存在**

判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

更新关联生产单更新时间

**Requests:**

- `puotationItem.qid` (Long): 报价ID
- `puotationItem.name` (String): 报价项名称
- `puotationItem.format` (String): 规格
- `puotationItem.height` (Integer): 高度
- `puotationItem.width` (Integer): 宽度
- `puotationItem.thick` (Integer): 厚度
- `puotationItem.num` (Integer): 数量
- `puotationItem.unitPrice` (Integer): 单价
- `puotationItem.measurementUnit` (String): 单位
- `puotationItem.total` (Long): 总价
- `puotationItem.comment` (String): 备注
- `puotationItem.specil` (String): 特型
- `puotationItem.quoteType` (String): 报价类型

```json
{
    "puotationItem.qid": 1,
    "puotationItem.name": "侧板",
    "puotationItem.format": "zx-1",
    "puotationItem.height": 20000,
    "puotationItem.width": 20000,
    "puotationItem.thick": 5000,
    "puotationItem.num": 2000,
    "puotationItem.unitPrice": 150000,
    "puotationItem.measurementUnit": "个",
    "puotationItem.total": 300000,
    "puotationItem.comment": "",
    "puotationItem.specil": "",
    "puotationItem.quoteType": "板式",
}
```


##### `查询` updatePuotation

更新报价信息

判断报价是否存在 , 不存在更新失败 , 错误信息 **220014 报价不存在**

判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

**Requests:**

- `puotation.qid` (Long): 报价ID
- `puotation.name` (String): 名称
- `puotation.comment` (String): 说明

```json
{
    "puotation.qid": 1,
    "puotation.name": "名字",
    "puotation.comment": "说明"
}
```


##### `查询` updatePuotationForAdvance

更新报价信息

判断报价是否存在 , 不存在更新失败 , 错误信息 **220014 报价不存在**

判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

**Requests:**

- `puotation.qid` (Long): 报价ID
- `puotation.discount` (Integer): 折扣
- `puotation.total` (Long): 总价

```json
{
    "puotation.qid": 1,
    "puotation.total": 100000,
    "puotation.discount": 10000
}
```


##### `查询` updatePuotationForDefault

更新默认报价

判断报价是否存在 , 不存在更新失败 , 错误信息 **220014 报价不存在**

判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

遍历所有报价 , 更换默认报价信息

**Requests:**

- `puotation.qid` (Long): 报价ID

```json
{
    "puotation.qid": 1
}
```


##### `查询` deletePuotation

删除报价

判断报价是否存在 , 不存在更新失败 , 错误信息 **220014 报价不存在**

判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

删除报价信息同时 , 删除归属报价的报价项信息

**Requests:**

- `puotation.qid` (Long): 报价ID

```json
{
    "puotation.qid": 1
}
```


##### `查询` deletePuotationItem

删除报价项

判断报价项是否存在 , 不存在删除失败 , 错误信息 **220015 报价中报价项不存在**

判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

**Requests:**

- `puotationItem.qiid` (Long): 报价项ID

```json
{
    "puotationItem.qiid": 1
}
```

## 图纸


图纸信息管理


> **类**: `api.production.ProductionPictureAction`


#### 数据类型: `productionPicture`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ppid` | 图纸ID | Long |
| `pid` | 生产单ID | Long |
| `name` | 名称 | String |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `path` | 路径 | String |
| `type` | 类型 , 0: 文件 , 1: 设计图 | Short |
| `status` | 状态 , 0: 初版, 1: 终版, 2:废除 | Short |
| `comment` | 备注 | String |


##### `查询` queryProductionPictureByPid

查询生产单下的图纸

**Requests:**

- `productionPicture.pid` (Long): 生产单ID

```json
{
    "productionPicture.pid": 1,
}
```

**Returns:**

- `productionPictures` (List): 图纸列表 , 每条数据类型 `productionPicture`

```json
{
    ...
    "productionPictures":[
        {
            "ppid": 1,
            "pid": 1,
            "name": "橱柜生产CAD图纸",
            "creater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "createTime": "2016-01-01 00:00:00",
            "path": "00/00/OIJASDF7ASDLFKJASD7FSDFJKL.dwg",
            "type": 0,
            "status": 0,
            "comment": "说明"

        }
    ]
    ...
}
```


##### `查询` addProductionPicture

新增图纸信息

判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

判断关联生产单状态1(设计) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

更新关联生产单更新时间

**Requests:**

- `productionPicture.pid` (Long): 生产单ID
- `productionPicture.name` (String): 名称
- `productionPicture.path` (String): 路径
- `productionPicture.type` (Short): 类型
- `productionPicture.comment` (String): 备注

```json
{
    "productionPicture.pid": 1,
    "productionPicture.name": "橱柜CAD图",
    "productionPicture.path": "00/00/OIJASDF7ASDLFKJASD7FSDFJKL.xls",
    "productionPicture.type": 0,
    "productionPicture.comment": ""
}
```


##### `查询` deleteProductionPicture

删除图纸信息

判断图纸是否存在 , 不存在 , 错误信息 **220003 图纸不存在**

判断关联生产单状态1(设计) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

**Requests:**

- `productionPicture.ppid` (Long): 图纸ID

```json
{
    "productionPicture.pid": 1
}
```

## 外协单


> **类**: `api.production.OutsourceAction`


#### 数据类型: `outsource`

| 参数 | 说明 | 类型 |
|------|------|------|
| `oid` | 外协单ID | Long |
| `production` | 生产单 , 类型 [production ](./production.html#api.production.ProductionAction.production) | Object |
| `no` | 编号 , L作为第一个字符 , 由日期加四位格式计数组成 , 例: L1601010001 | String |
| `supplier` | 厂商 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `finishTime` | 结束时间 | Timestamp |
| `timeLimit` | 工期 | Integer |
| `status` | 状态 , 0: 初始 , 1: 接收 , 2: 确认 , 3: 完结 , 4: 失效 | Short |
| `path` | 路径 | String |
| `comment` | 备注 | String |
| `company` | 公司 | Long |


#### 数据类型: `outsourceItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `oiid` | 外协项ID | Long |
| `oid` | 外协单ID | Long |
| `height` | 高 | Integer |
| `width` | 宽 | Integer |
| `thick` | 厚 | Integer |
| `modelling` | 造型 | String |
| `num` | 数量 | Integer |
| `unitprice` | 单价 | Integer |
| `total` | 总价 | Long |
| `comment` | 备注 | String |


##### `查询` pageOutsource

分页方式获取外协单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 外协单信息列表 , 每条数据类型 `outsource`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "osid": 1,
                "production": {
                    "pid": 1,
                    "orderId": 160801000,
                    "house":{
                        "hid": 1,
                        "village": {
                            "vid": 1,
                            "no": "P001",
                            "name": "广场一期",
                            "deliveryTime": null,
                            "developer": "222",
                            "salesPhone": "",
                            "status": 0,
                        },
                        "houseNumber": "1#1-1-1",
                        ...
                    },
                    "total": 12000000,
                    "creater": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "designer": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "spliter": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "status": 0,

                    "createTime": "2016-01-01 00:00:00",
                    "designTime": null,
                    "divideTime": null,
                    ...
                },
                "supplier": {
                    "uid": 111,
                    "userId": "F001",
                    "userName": "厂商",
                    "currentName": "厂商"
                },
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "createTime": "2016-01-01 00:00:00",
                "finishTime": null,
                "timeLimie": 10000,
                "status": 0,
                "path": "00/00/OIJASDF7ASDLFKJASD7FSDFJKL.xls",
                "comment": "说明"
            },
        ],
        ...
    },
    ...
}
```


##### `查询` pageOutsourceForSupplier

分页方式获取外协单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

厂商信息限定为当前操作人员相关信息

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 外协单信息列表 , 每条数据类型 `outsource`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "osid": 1,
                "production": {
                    "pid": 1,
                    "orderId": 160801000,
                    "house":{
                        "hid": 1,
                        "village": {
                            "vid": 1,
                            "no": "P001",
                            "name": "广场一期",
                            "deliveryTime": null,
                            "developer": "222",
                            "salesPhone": "",
                            "status": 0,
                        },
                        "houseNumber": "1#1-1-1",
                        ...
                    },
                    "total": 12000000,
                    "creater": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "designer": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "spliter": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "status": 0,

                    "createTime": "2016-01-01 00:00:00",
                    "designTime": null,
                    "divideTime": null,
                    ...
                },
                "supplier": {
                    "uid": 111,
                    "userId": "F001",
                    "userName": "厂商",
                    "currentName": "厂商"
                },
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "createTime": "2016-01-01 00:00:00",
                "finishTime": null,
                "timeLimie": 10000,
                "status": 0,
                "path": "00/00/OIJASDF7ASDLFKJASD7FSDFJKL.xls",
                "comment": "说明"
            },
        ],
        ...
    },
    ...
}
```


##### `查询` queryOutsourceByPid

通过生产单ID获取外协单

**Requests:**

- `outsource.production.pid` (Long): 生产单ID
**Returns:**

- `outsources` (List): 外协单信息列表 , 每条数据类型 `outsource`

```json
{
    ...
    "outsources": [
        {
            "osid": 1,
            "production": {
                "pid": 1,
                "orderId": 160801000,
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期",
                        "deliveryTime": null,
                        "developer": "222",
                        "salesPhone": "",
                        "status": 0,
                    },
                    "houseNumber": "1#1-1-1",
                    ...
                },
                "total": 12000000,
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "designer": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "spliter": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "status": 0,

                "createTime": "2016-01-01 00:00:00",
                "designTime": null,
                "divideTime": null,
                ...
            },
            "supplier": {
                "uid": 111,
                "userId": "F001",
                "userName": "厂商",
                "currentName": "厂商"
            },
            "creater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "createTime": "2016-01-01 00:00:00",
            "finishTime": null,
            "timeLimie": 10000,
            "status": 0,
            "path": "00/00/OIJASDF7ASDLFKJASD7FSDFJKL.xls",
            "comment": "说明"
        },
    ],
    ...
}
```


##### `查询` addOutsource

创建外协单

判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

判断关联生产单状态2(生产) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

**Requests:**

- `outsource.production.pid` (Long): 生产单ID
- `outsource.supplier.uid` (Long): 厂商ID
- `outsource.comment` (String): 备注

```json
{
    "outsource.production.pid": 1,
    "outsource.comment": "说明"
}
```


##### `查询` updateOutsource

更新外协单

判断外协单是否存在 , 不存在 , 错误信息 **220006 外协单不存在**

**Requests:**

- `outsource.oid` (Long): 外协单ID
- `outsource.path` (String): 路径
- `outsource.comment` (String): 说明

```json
{
    "outsource.osid": 1,
    "outsource.path": "00/00/OIJASDF7ASDLFKJASD7FSDFJKL.xls",
    "outsource.comment": "说明"
}
```


##### `查询` receiptOutsource

接收外协单

判断外协单是否存在 , 不存在 , 错误信息 **220006 外协单不存在**

判断外协单状态是否为0(初始) , 其他状态 , 错误信息 **220021 外协单状态不可操作**

外协单状态更新为1(接收)

更新关联生产单更新时间

**Requests:**

- `outsource.oid` (Long): 外协单ID

```json
{
    "outsource.osid": 1
}
```


##### `查询` confirmOutsource

确认外协单

判断外协单是否存在 , 不存在 , 错误信息 **220006 外协单不存在**

判断外协单状态是否为1(接收) , 其他状态 , 错误信息 **220021 外协单状态不可操作**

外协单状态更新为2(确认)

更新关联生产单更新时间

**Requests:**

- `outsource.oid` (Long): 外协单ID

```json
{
    "outsource.osid": 1
}
```


##### `查询` finishOutsource

完结外协单

判断外协单是否存在 , 不存在 , 错误信息 **220006 外协单不存在**

判断外协单状态是否为2(确认) , 其他状态 , 错误信息 **220021 外协单状态不可操作**

外协单状态更新为3(完结)

关联生成对应数量的物流包信息

更新关联生产单更新时间

**Requests:**

- `outsource.oid` (Long): 外协单ID
- `outsource.num` (Integer): 物流包数量

```json
{
    "outsource.oid": 1,
    "outsource.num": 1
}
```


##### `查询` deleteOutsource

删除外协单

判断外协单是否存在 , 不存在 , 错误信息 **220006 外协单不存在**

判断外协单状态是否为0(初始) , 其他状态 , 错误信息 **220021 外协单状态不可操作**

外协单状态更新为3(失效)

**Requests:**

- `outsource.oid` (Long): 外协单ID

```json
{
    "outsource.oid": 1
}
```


##### `查询` pageOutsourceItemByOid

通过外协单ID分页方式获取外协项信息

**Requests:**

- `outsourceItem.oid` (Long): 外协单ID

```json
{
    "outsourceItem.oid": 1    
}
```

**Returns:**

- `outsourceItems` (List): 外协项列表 , 每条数据类型 `outsourceItem`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "oiid": 1,
                "oid": 1,
                "width": 10000,
                "height": 10000,
                "thick": 10000,
                "modelling": "造型",
                "num": 1,
                "unitprice": 100000,
                "total": 100000,
                "comment": "说明"
            },
        ],
        ...
    },
    ...
}
```


##### `查询` addOutsourceItem

添加外协项信息

判断外协单是否存在 , 不存在 , 错误信息 **220006 外协单不存在**

**Requests:**

- `outsource.oid` (Long): 外协项ID
- `outsourceItem.height` (Integer): 高
- `outsourceItem.width` (Integer): 宽
- `outsourceItem.thick` (thick): 厚
- `outsourceItem.modelling` (String): 造型
- `outsourceItem.unitprice` (Integer): 单价
- `outsourceItem.num` (Integer): 数量
- `outsourceItem.total` (Long): 总价
- `outsourceItem.comment` (String): 备注

```json
{
    "outsource.oid": 1,
    "outsourceItem.height": 20000,
    "outsourceItem.width": 20000,
    "outsourceItem.thick": 20000,
    "outsourceItem.modelling": "造型",
    "outsourceItem.unitprice": 100000,
    "outsourceItem.num": 1,
    "outsourceItem.total": 100000,
    "outsourceItem.comment": "说明"
}
```


##### `查询` deleteOutsourceItem

删除外协项信息

判断外协项是否存在  ,不存在删除失败 , 错误信息 **220007 外协项不存在**

**Requests:**

- `outsourceItem.oiid` (Long): 外协项ID

```json
{
    "outsourceItem.oiid": 1,
}
```

## 五金单


> **类**: `api.production.HardwareAction`


#### 数据类型: `hardware`

| 参数 | 说明 | 类型 |
|------|------|------|
| `hid` | 五金单ID | Long |
| `production` | 生产单 , 类型 [production ](./production.html#api.production.ProductionAction.production) | Object |
| `no` | 编号 , G作为第一个字符 , 由日期加四位格式计数组成 , 例: G1601010001 | String |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `finishTime` | 结束时间 | Timestamp |
| `timeLimit` | 工期 | Integer |
| `status` | 状态 , 0: 初始 , 1: 采购 , 2: 仓库 , 3: 完结 , 4: 失效 | Short |
| `path` | 路径 | String |
| `comment` | 说明 | String |
| `company` | 公司 | Long |


#### 数据类型: `hardwareItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `hiid` | 五金项ID | Long |
| `hid` | 五金单ID | Long |
| `name` | 名称 | String |
| `num` | 数量 | Integer |
| `unitprice` | 单价 | Integer |
| `measurementunit` | 单位 | String |
| `comment` | 备注 | String |
| `total` | 总价 | Long |


##### `查询` pageHardware

分页方式获取五金单信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 五金单信息列表 , 每条数据类型 `hardware`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "hid": 1,
                "production": {
                    "pid": 1,
                    "orderId": 160801000,
                    "house":{
                        "hid": 1,
                        "village": {
                            "vid": 1,
                            "no": "P001",
                            "name": "广场一期",
                            "deliveryTime": null,
                            "developer": "222",
                            "salesPhone": "",
                            "status": 0,
                        },
                        "houseNumber": "1#1-1-1",
                        ...
                    },
                    "total": 12000000,
                    "creater": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "designer": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "spliter": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "status": 0,

                    "createTime": "2016-01-01 00:00:00",
                    "designTime": null,
                    "divideTime": null,
                    ...
                },
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "createTime": "2016-01-01 00:00:00",
                "finishTime": null,
                "status": 0,
                "comment": "说明",
                "path": "00/00/OIJASDF7ASDLFKJASD7FSDFJKL.xls"
            },
        ],
        ...
    },
    ...
}
```


##### `查询` queryHardwareByPid

通过生产单ID获取五金单

**Requests:**

- `hardware.production.pid` (Long): 生产单ID

```json
{
    "hardware.production.pid": 1
}
```

**Returns:**

- `hardwares` (List): 五金单信息列表 , 每条数据类型 `hardware`

```json
{
    ...
    "hardwares": [
        {
            "hid": 1,
            "production": {
                "pid": 1,
                "orderId": 160801000,
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期",
                        "deliveryTime": null,
                        "developer": "222",
                        "salesPhone": "",
                        "status": 0,
                    },
                    "houseNumber": "1#1-1-1",
                    ...
                },
                "total": 12000000,
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "designer": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "spliter": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "status": 0,

                "createTime": "2016-01-01 00:00:00",
                "designTime": null,
                "divideTime": null,
                ...
            },
            "creater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "createTime": "2016-01-01 00:00:00",
            "finishTime": null,
            "status": 0,
            "comment": "说明",
            "path": "00/00/OIJASDF7ASDLFKJASD7FSDFJKL.xls"
        },
    ],
    ...
}
```


##### `查询` addHardware

创建五金单

判断生产单是否存在 , 错误信息 **220001 生产单不存在**

判断关联生产单状态2(生产) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

更新关联生产单更新时间

**Requests:**

- `hardware.production.pid` (Long): 生产单ID
- `hardware.status` (Short): 状态
- `hardware.comment` (String): 说明

```json
{
    "hardware.production.pid": 1,
    "hardware.status": 1,
    "hardware.comment": "说明"
}
```


##### `查询` updateHardware

更新五金单信息

判断五金单是否存在 , 错误信息 **220004 五金单不存在**

更新关联生产单更新时间

**Requests:**

- `hardware.hid` (Long): 五金单ID
- `hardware.comment` (String): 说明
- `hardware.path` (String): 路径

```json
{
    "hardware.hid": 1,
    "hardware.comment": 1,
    "hardware.path": 1
}
```


##### `查询` instoreHardware

五金单进入仓储阶段

判断五金单是否存在 , 错误信息 **220004 五金单不存在**

判断五金单状态为1(采购) , 其他状态 , 错误信息 **220022 五金单状态不可操作**

更新关联生产单更新时间

**Requests:**

- `hardware.hid` (Long): 五金单ID

```json
{
    "hardware.hid": 1
}
```


##### `查询` finishHardware

完结五金单

判断五金单是否存在 , 错误信息 **220004 五金单不存在**

判断五金单状态是否为2(仓库) , 其他状态 , 错误信息 **220021 外协单状态不可操作**

外协单状态更新为3(完结)

关联生成对应数量的物流包信息

更新关联生产单更新时间

**Requests:**

- `hardware.hid` (Long): 五金单ID
- `hardware.num` (Integer): 物流包数量

```json
{
    "hardware.hid": 1,
    "hardware.num": 1
}
```


##### `查询` deleteHardware

删除五金单

判断五金单是否存在 , 不存在更新失败 , 错误信息 **220004 五金单不存在**

判断五金单状态是0(初始)/1(采购) , 其他状态 , 错误信息 **220022 五金单状态不可操作**

**Requests:**

- `hardware.hid` (Long): 五金单ID

```json
{
    "hardware.hid": 1
}
```


##### `查询` pageHardwareItemByHid

分页方式获取五金项信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Requests:**

- `hardwareItem.hid` (Long): 生产单ID

```json
{
    "hardwareItem.hid": 1
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 五金项信息列表 , 每条数据类型 `hardwareItem`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "hiid": 1,
                "hid": 1,
                "name": "五金项名称",
                "num": 1,
                "unitprice": 100000
                "measurementunit": "个",
                "total": 100000
                "comment": "说明",
            },
        ],
        ...
    },
    ...
}
```


##### `查询` addHardwareItem

添加五金项到五金单

判断五金单是否存在 , 不存在更新失败 , 错误信息 **220004 五金单不存在**

**Requests:**

- `hardwareItem.hid` (Long): 五金单ID
- `hardwareItem.name` (String): 说明
- `hardwareItem.num` (Integer): 数量
- `hardwareItem.unitprice` (Integer): 单价
- `hardwareItem.total` (Long): 总价
- `hardwareItem.measurementunit` (String): 单位
- `hardwareItem.comment` (String): 说明

```json
{
    "hardwareItem.hid": 1,
    "hardwareItem.name": "名称",
    "hardwareItem.num": 1,
    "hardwareItem.unitprice": 100000,
    "hardwareItem.total": 100000,
    "hardwareItem.nameasurementunitme": "个",
    "hardwareItem.comment": "说明"
}
```


##### `查询` deleteHardwareItem

删除五金项信息

判断五金项是否存在 , 不存在删除失败 , 错误信息 **220005 五金项不存在**

**Requests:**

- `hardwareItem.hiid` (Long): 五金项ID

```json
{
    "hardwareItem.hiid": 1,
}
```

## 生产计划


### 生产计划单


> **类**: `api.production.ProductionPlanAction`


#### 数据类型: `productionPlan`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ppid` | 计划ID | Long |
| `production` | 生产单 , 类型 [production ](./production.html#api.production.ProductionAction.production) | Object |
| `no` | 编号 , G作为第一个字符 , 由日期加四位格式计数组成 , 例: Z1601010001 | String |
| `path` | 路径 | String |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `finishTime` | 完成时间 | Timestamp |
| `timeLimit` | 工期 | Integer |
| `status` | 状态 0: 初始, 1: 完结 | Short |
| `company` | 公司 | Long |


#### 数据类型: `productionPlanItem`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ppiid` | 计划项ID | Long |
| `ppid` | 计划ID | Object |
| `typeno` | 类型编号 | String |
| `name` | 名称 | String |
| `height` | 高 | Integer |
| `width` | 宽 | Integer |
| `thick` | 厚 | Integer |
| `color` | 颜色 | String |
| `unitprice` | 单价 | Integer |
| `num` | 数量 | Integer |
| `total` | 总价 | Long |
| `comment` | 备注 | String |


##### `查询` pageProductionPlan

分页方式获取计划信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 计划信息列表 , 每条数据类型 `productionPlan`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "ppid": 1,
                "production": {
                    "pid": 1,
                    "orderId": 160801000,
                    "house":{
                        "hid": 1,
                        "village": {
                            "vid": 1,
                            "no": "P001",
                            "name": "广场一期",
                            "deliveryTime": null,
                            "developer": "222",
                            "salesPhone": "",
                            "status": 0,
                        },
                        "houseNumber": "1#1-1-1",
                        ...
                    },
                    "total": 12000000,
                    "creater": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "designer": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "spliter": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "status": 0,

                    "createTime": "2016-01-01 00:00:00",
                    "designTime": null,
                    "divideTime": null,
                    ...
                },
                "no": "Z1601010001",
                "path": "00/00/OIJASDF7ASDLFKJASD7FSDFJKL.xls",
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "createTime": "2016-01-01 00:00:00",
                "finishTime": null,
                "timeLimit": 10000,
                "status": 0,
            },
        ],
        ...
    },
    ...
}
```


##### `查询` queryProductionPlanByPid

通过生产单ID获取生产计划

**Requests:**

- `productionPlan.production.pid` (Long): 生产单ID

```json
{
    "productionPlan.production.pid": 1,
}
```

**Returns:**

- `productionPlans` (List): 计划表 , 每条数据类型 `productionPlan`

```json
{
    ...
    "productionPlans": [
        {
            "ppid": 1,
            "pid": 1,
            "no": "Z1601010001",
            "path": "00/00/OIJASDF7ASDLFKJASD7FSDFJKL.xls",
            "creater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "createTime": "2016-01-01 00:00:00",
            "finishTime": null,
            "timeLimit": 10000,
            "status": 0,
        }
    ]
    ...
}
```


##### `查询` addProductionPlan

创建生产计划

判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

判断关联生产单状态2(生产) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

更新关联生产单更新时间

**Requests:**

- `productionPlan.production.pid` (Long): 生产单ID
- `productionPlan.timeLimit` (Integer): 工期

```json
{
    "productionPlan.production.pid": 1,
    "productionPlan.timeLimit": 10000
}
```


##### `查询` updateProductionPlan

更新计划

判断计划是否存在 , 不存在更新失败 , 错误信息 **220008 计划不存在**

**Requests:**

- `productionPlan.ppid` (Long): 生产计划ID
- `productionPlan.path` (String): 路径

```json
{
    "productionPlan.ppid": 1,
    "productionPlan.path": "00/00/OIJASDF7ASDLFKJASD7FSDFJKL.xls",
}
```


##### `查询` finishProductionPlan

完结五金单

判断计划是否存在 , 不存在更新失败 , 错误信息 **220008 计划不存在**

判断计划状态是否为0(初始) , 其他状态 , 错误信息 **220021 外协单状态不可操作**

生产计划状态更新为1(完结)

关联生成对应数量的物流包信息

更新关联生产单更新时间

**Requests:**

- `productionPlan.ppid` (Long): 五金单ID
- `productionPlan.num` (Integer): 物流包数量

```json
{
    "productionPlan.ppid": 1,
    "productionPlan.num": 1
}
```


##### `查询` pageProductionPlanItemByPpid

分页方式获取计划项信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Requests:**

- `productionPlanItem.ppid` (Long): 计划ID

```json
{
    "productionPlanItem.ppid": 1
}
```

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 计划项信息列表 , 每条数据类型 `productionPlanItem`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "ppiid": 1,
                "ppid": 1,
                "typeno": "SDFIU83NFK",
                "name": "名称",
                "height": 10000,
                "width": 10000,
                "thick": 10000,
                "color": "白色",
                "unitprice": 100000,
                "num": 1,
                "total": 100000,
                "comment": "说明"
            },
        ],
        ...
    },
    ...
}
```


##### `查询` addProductionPlanItem

添加计划项信息

判断计划是否存在 , 不存在更新失败 , 错误信息 **220008 计划不存在**

**Requests:**

- `productionPlanItem.ppid` (Long): 计划ID
- `productionPlanItem.typeno` (String): 类型编号
- `productionPlanItem.name` (String): 名称
- `productionPlanItem.height` (Integer): 高
- `productionPlanItem.width` (Integer): 宽
- `productionPlanItem.thick` (Integer): 厚
- `productionPlanItem.color` (String): 颜色
- `productionPlanItem.unitprice` (Integer): 单价
- `productionPlanItem.num` (Integer): 数量
- `productionPlanItem.total` (Long): 总价
- `productionPlanItem.comment` (String): 备注

```json
{
    "productionPlanItem.pid": 1,
    "productionPlanItem.typeNo": "木门",
    "productionPlanItem.name": "木门门板",
    "productionPlanItem.height": 200000,
    "productionPlanItem.width": 90000,
    "productionPlanItem.thick": 6000,
    "productionPlanItem.color": "浅白",
    "productionPlanItem].unitprice": 100000,
    "productionPlanItem].num": 3000,
    "productionPlanItem].total": 100000,
    "productionPlanItem.comment": "",
}
```


##### `查询` deleteProductionPlanItem

删除生产单项信息

判断计划项是否存在 , 不存在更新失败 , 错误信息 **220009 计划项不存在**

**Requests:**

- `productionPlanItem.ppiid` (Long): 计划项ID

```json
{
    "productionPlanItem.ppiid": 1,
}
```

### 计划工序组


> **类**: `api.production.ProductionWorkPlanAction`


#### 数据类型: `productionWorkPlan`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pwpid` | 工序组ID | Long |
| `ppid` | 计划ID | Long |
| `workPlan` | 工序组 , 类型 [workPlan ](./production.html#api.production.WorkPlanAction.workPlan) | Long |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `status` | 状态 , 0: 初始 , 1: 执行 , 2: 完成 | Short |
| `sort` | 排序 | Short |


##### `查询` queryProductionWorkPlanByPpid

**Requests:**

- `productionWorkPlan.ppid` (Long): 计划ID

```json
{
    "productionWorkPlan.ppid": 1,
}
```

**Returns:**

- `productionWorkPlans` (List): 计划项列表 , 每条数据类型 `productionworkplan`

```json
{
    ...
    "productionWorkPlans": [
        {
            "pwpid": 1,
            "workplan": {
                "wpid": 1,
                "name": "第一工序组",
                "status": 0,
                "comment": "",
                "workShop": {
                    "wsid": 1,
                    "name": "油漆车间",
                },
            },
            "creater": {
                "uid": 1,
                "userId": "U001",
                "userName": "设计师",
                "currentName": "设计师",
                "duty": ""
            },
            "creatTime": "2016-01-01 00:00:00",
            "status": 0
        }
    ],
    ...
}
```


##### `查询` addProductionWorkPlan

添加计划工序组

判断计划是否存在 , 不存在更新失败 , 错误信息 **220008 计划不存在**

判断计划中是否已经存在工序组 , 存在不能添加 , 错误信息 **220010 计划工序已存在**

添加计划工序组同时 , 利用工序组中拥有工序完成计划工序数据的生成

**Requests:**

- `productionWorkPlan.ppid` (Long): 计划ID
- `productionWorkPlan.wpid` (Long): 工序组ID

```json
{
    "productionWorkPlan.ppid": 1,
    "productionWorkPlan.wpid": 1
}
```


##### `查询` finishProductionWorkPlan

完结计划工序组

判断计划是否存在 , 不存在更新失败 , 错误信息 **220008 计划不存在**

判断计划工序组是否存在 , 不存在 , 错误信息 **220026 计划工序组不存在**

判断计划工序组状态是否为1(执行) , 其他状态 , 错误信息 **220011 生产计划工序组状态不可操作**

判断计划工序组排序 , 非顺序完成计划组 , 错误信息 **220027 计划工序组执行顺序异常**

更新计划工序组状态为2(完成)

**Requests:**

- `productionWorkPlan.wpid` (Long): 工序组ID

```json
{
    "productionWorkPlan.wpid": 1
}
```


##### `查询` deleteProductionWorkPlan

删计划工序组

判断计划工序组状态 , 非初始不能删除 , 错误信息 **220011 计划工序组状态不可操作**

**Requests:**

- `productionWorkPlan.pwpid` (Long): ID

```json
{
    "productionWorkPlan.pwpid": 1
}
```

### 计划工序


> **类**: `api.production.ProductionWorkFlowAction`


#### 数据类型: `productionWorkFlow`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pwfid` | 计划工序ID | Long |
| `pwpid` | 计划工序组ID | Long |
| `workflow` | 操作工序 , 类型 [workflow ](./production.html#api.production.WorkFlowAction.workflow) | Object |
| `operater` | 操作人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `operateTime` | 操作时间 | Timestamp |
| `status` | 状态 , 0: 初始 , 1: 执行 | Short |


##### `查询` queryProductionWorkFlowByPwpidAWfid

通过计划涉工序组ID获取计划工序

**Requests:**

- `productionWorkFlow.pwpid` (Long): 计划工序组ID

```json
{
    "productionWorkFlow.pwpid": 1
}
```

**Returns:**

- `productionWorkFlows` (List): 计划工序, 数据类型 `productionWorkFlow`

```json
{
    ...
    "productionWorkFlows": [
        {
            "pwfid": 1,
            "pwpid": 1,
            "workflow": {
                "wfid": 1,
                "name": "工序"
            },
            "operater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "oprateTime": "2016-06-01 00:00:00",
        }
    ],
    ...
}
```


##### queryProductionWorkFlowByPwpid

通过计划工序组ID获取计划工序

**Requests:**

- `productionWorkFlow.pwpid` (Long): 计划工序组ID

```json
{
    "productionWorkFlow.pwpid": 1
}
```

**Returns:**

- `productionWorkFlows` (List): 单位信息列表 , 每条数据类型 `productionWorkFlows`

```json
{
    ...
    "productionWorkFlows": [
        {
            "pwfid": 1,
            "pwpid": 1,
            "workflow": {
                "wfid": 1,
                "name": "工序"
            },
            "operater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "oprateTime": "2016-06-01 00:00:00",
        }
    ],
    ...
}
```


##### `查询` operateProductionWorkFlow

操作计划工序信息

判断计划工序是否存在 , 不存在操作失败 , 错误信息 **220012 计划工序不存在**

判断计划工序是否已经操作 , 已经操作不可再次操作 , 错误信息 **220013 计划工序不可操作**

更新计划工序操作人以及操作时间

判断归属工序组内工序全部完结 , 更新计划工序组状态为已操作1(已执行)

**Requests:**

- `productionWorkFlow.pwfid` (Long): 操作工人ID

```json
{
    "productionWorkFlow.pwfid": 1
}
```

### 计划工序-人员


> **类**: `api.production.ProductionUserWorkflowAction`


#### 数据类型: `productionUserWorkflow`

| 参数 | 说明 | 类型 |
|------|------|------|
| `puwfid` | ID | Long |
| `pwfid` | 计划工序ID | Long |
| `operater` | 操作人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `operateTime` | 操作时间 | Timestamp |


##### `查询` queryProductionUserWorkFlowByPwfid

通过计划工序ID获取计划工序-人员

**Requests:**

- `productionUserWorkFlow.pwfid` (Long): 计划工序ID

```json
{
    "productionUserWorkFlow.pwfid": 1
}
```

**Returns:**

- `productionUserWorkFlows` (List): 计划工序-人员, 数据类型 `productionUserWorkFlow`

```json
{
    ...
    "productionUserWorkFlows": [
        {
            "puwfid": 1,
            "pwfid": 1,
            "operater": {
                "uid": 1,
                "userId": "U001",
                "userName": "白雪",
                "currentName": "白雪",
                "duty": "设计师"
            },
            "oprateTime": "2016-06-01 00:00:00",
        }
    ],
    ...
}
```

## 物流包


> **类**: `api.production.TranpackAction`


#### 数据类型: `tranpack`

| 参数 | 说明 | 类型 |
|------|------|------|
| `tid` | 物流包ID | Long |
| `production` | 生产单 , 类型 [production ](./production.html#api.production.ProductionAction.production) | Object |
| `no` | 编号 | String |
| `rid` | 关联ID , 分别关联五金单ID/外协单ID/生产计划单ID , 利用类型进行区分 | Long |
| `type` | 类型 , 0: 外协 , 1: 五金 , 2: 生产计划 | Short |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `sender` | 送货人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `mounter` | 安装人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `planTime` | 物流时间 | Timestamp |
| `tranTime` | 送货时间 | Timestamp |
| `mountTime` | 安装时间 | Timestamp |
| `status` | 状态 , 0: 初始 , 1: 仓库 , 2: 物流 , 3: 运输 , 4: 安装 , 5: 完成 , 6: 丢失 , 7: 失效 | Short |


##### `查询` pageTranpack

分页方式获取物流包 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 计划信息列表 , 每条数据类型 `productionPlan`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "tid": 1,
                "production": {
                    "pid": 1,
                    "orderId": 160801000,
                    "house":{
                        "hid": 1,
                        "village": {
                            "vid": 1,
                            "no": "P001",
                            "name": "广场一期",
                            "deliveryTime": null,
                            "developer": "222",
                            "salesPhone": "",
                            "status": 0,
                        },
                        "houseNumber": "1#1-1-1",
                        ...
                    },
                    "total": 12000000,
                    "creater": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "designer": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "spliter": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "status": 0,

                    "createTime": "2016-01-01 00:00:00",
                    "designTime": null,
                    "divideTime": null,
                    ...
                },
                "no": ""
            },
        ],
        ...
    },
    ...
}
```


##### `查询` queryTranpackByPid

通过生产单ID获取物流包

**Requests:**

- `tranpack.production.pid` (Long): 生产单ID
**Returns:**

- `tranpacks` (List): 物流包信息列表 , 每条数据类型 `tranpack`

```json
{
    ...
    "tranpacks": [
        {
            "tid": 1,
            "production": {
                "pid": 1,
                "orderId": 160801000,
                "house":{
                    "hid": 1,
                    "village": {
                        "vid": 1,
                        "no": "P001",
                        "name": "广场一期",
                        "deliveryTime": null,
                        "developer": "222",
                        "salesPhone": "",
                        "status": 0,
                    },
                    "houseNumber": "1#1-1-1",
                    ...
                },
                "total": 12000000,
                "creater": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "designer": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "spliter": {
                    "uid": 1,
                    "userId": "U001",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "duty": "设计师"
                },
                "status": 0,

                "createTime": "2016-01-01 00:00:00",
                "designTime": null,
                "divideTime": null,
                ...
            },
            "no": ""
        },
    ],
    ...
}
```


##### `查询` packTranpack

打包物流包

根据关联单号以及类型获取对应的订单 , 外协/五金/生产计划

根据物流包类型以及关联ID , 判断关联单是否存在

更新关联生产单更新时间

**Requests:**

- `tranpack.no` (Long): 关联单号
- `tranpack.type` (Short): 关联单号

```json
{
    "tranpack.no": 1,
    "tranpack.type": 0
}            
```


##### `查询` packTranpackForOutsource

打包物流包

**Requests:**

- `tranpack.production.pid` (Long): 生产单ID

```json
{
    "tranpack.production.pid": 1,
    "tranpack.rid": 1,
    "tranpack.type": 1
}
```


##### `查询` packTranpackForHardware

打包物流包

**Requests:**

- `tranpack.production.pid` (Long): 生产单ID

```json
{
    "tranpack.production.pid": 1,
    "tranpack.rid": 1,
    "tranpack.type": 1
}
```


##### `查询` packTranpackForPlan

打包物流包

**Requests:**

- `tranpack.production.pid` (Long): 生产单ID

```json
{
    "tranpack.production.pid": 1,
    "tranpack.rid": 1,
    "tranpack.type": 2
}
```


##### `查询` instoreTranpack

物流包进仓储阶段

判断物流包是否存在 , 不存在 , 错误信息 **220023 物流包不存在**

判断物流包状态0(初始) , 其他状态 , 错误信息 **220025 物流包状态不可操作**

更新物流包状态为1(仓储) , 更新关联生产单更新时间

判断关联生产单归属外协单状态是否为3(完结) , 存在其他状态外协单 , 关联生产单状态不可更新

判断关联生产单归属五金单状态是否为3(完结) , 存在其他状态五金单 , 关联生产单状态不可更新

判断关联生产单归属计划单状态是否为1(完结) , 存在其他状态计划单 , 关联生产单状态不可更新

判断关联生产单归属物流包状态是否为0(初始) , 存在该状态物流包 , 关联生产单状态不可更新

满足以上条件之后 , 更新关联生产单状态为3(仓库) , 更新入库时间

**Requests:**

- `tranpack.production.pid` (Long): 生产单ID

```json
{
    "tranpack.production.pid:": 1
}
```


##### `查询` planTranPack

物流包进入物流阶段

判断物流包是否存在 , 不存在 , 错误信息 **220023 物流包不存在**

判断物流包状态1(仓储) , 其他状态 , 错误信息 **220025 物流包状态不可操作**

更新物流包状态为2(物流) , 更新物流时间 , 更新关联生产单更新时间

**Requests:**

- `tranpack.production.pid` (Long): 生产单ID

```json
{
    "tranpack.production.pid:": 1
}
```


##### `查询` tranTranpack

物流包进入运输阶段

判断物流包是否存在 , 不存在 , 错误信息 **220023 物流包不存在**

判断物流包状态2(物流) , 其他状态 , 错误信息 **220025 物流包状态不可操作**

更新物流包状态为3(运输) , 更新送货时间 , 更新关联生产单更新时间

**Requests:**

- `tranpack.production.pid` (Long): 生产单ID

```json
{
    "tranpack.production.pid:": 1
}
```


##### `查询` mountTranpack

物流包进入安装阶段

判断物流包是否存在 , 不存在 , 错误信息 **220023 物流包不存在**

判断物流包状态3(运输) , 其他状态 , 错误信息 **220025 物流包状态不可操作**

更新物流包状态为4(安装) , 更新安装时间 , 更新关联生产单更新时间

**Requests:**

- `tranpack.production.pid` (Long): 生产单ID

```json
{
    "tranpack.production.pid:": 1
}
```


##### `查询` completeTranpack

完成物流包

判断物流包是否存在 , 不存在 , 错误信息 **220023 物流包不存在**

判断物流包状态4(安装) , 其他状态 , 错误信息 **220025 物流包状态不可操作**

更新物流包状态为5(完成) , 更新安装时间 , 更新关联生产单更新时间

**Requests:**

- `tranpack.production.pid` (Long): 生产单ID

```json
{
    "tranpack.production.pid:": 1
}
```


##### `查询` lossTranpack

物流包丢失

判断物流包是否存在 , 不存在 , 错误信息 **220023 物流包不存在**

更新物流包状态为6(丢失)

**Requests:**

- `tranpack.production.pid` (Long): 生产单ID

```json
{
    "tranpack.production.pid:": 1
}
```

## 功能


> **类**: `api.production.ProductionFunctionAction`


#### 数据类型: `productionFunction`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pfid` | 功能ID | Long |
| `name` | 名称 | String |
| `key` | key | String |
| `value` | value | String |
| `type` | 类型 , 0: 类型, 1: api, 2: 条件, 3: 字段, 4: 功能, 5: 节点 | Short |
| `subtype` | 子类 , 0: 字符串, 1: 数组 | Short |
| `comment` | 说明 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |
| `sort` | 排序 | Short |


##### `查询` queryProductionFunction

获取生产功能信息


##### `查询` queryProductionFunctionByName

通过名称获取生产功能信息
