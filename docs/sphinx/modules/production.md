.. production:

# 生产
## 车间

## api.production.WorkshopAction

**数据类型**:

#### workshop

    - **wsid**: 车间ID
      - 类型: *Long*
    - **name**: 车间名称
      - 类型: *String*
    - **status**: 状态 , 0: 启用, 1: 禁用
      - 类型: *Short*
    - **company**: 公司ID
      - 类型: *Long*

    ### `pageWorkshop` <span style="color:gray">[内部]</span>

        分页方式获取车间信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  车间信息列表 , 每条数据类型 *workshop*

        **示例**:{
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

    ### `queryWorkshop` <span style="color:gray">[内部]</span>

        获取车间信息

        按照公司作为默认条件查询

**返回参数**:

- **workshops**: 车间信息列表 , 每条数据类型 *workshop*
          - 类型: *List*

        **示例**:{
                "workshop":
                    {
                        "wsid": 1,
                        "name": "油漆车间"
                    },
                ...
            }

    ### `addWorkshop` <span style="color:gray">[内部]</span>

        添加车间信息

**请求参数**:

- **workshop.name**:
  车间名称


        **示例**:{
                "workshop.name": "油漆车间",
            }

    ### `updateWorkshop` <span style="color:gray">[内部]</span>

        更新车间信息

        判断车间信息是否存在 , 不存在更新失败 , 错误信息 **220016 车间不存在**

**请求参数**:

- **workshop.wsid**:
  车间ID
        - **workshop.name**:
  名称

        **示例**:{
                "wsid": 1,
                "name": "新油漆车间",
            }

    ### `updateWorkshopForStatus` <span style="color:gray">[内部]</span>

        更新车间状态

        判断车间信息是否存在 , 不存在更新失败 , 错误信息 **220016 车间不存在**

**请求参数**:

- **workshop.wsid**:
  车间ID
        - **workshop.status**:
  状态

        **示例**:{
                "wsid": 1,
                "status": 0
            }

## 工序

## api.production.WorkflowAction

**数据类型**:

#### workflow

    - **wfid**: 工序ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **status**: 状态 , 0: 启用, 1: 禁用
      - 类型: *Short*
    - **company**: 公司ID
      - 类型: *Long*

        |Filters:|
        - **name**: 名称
      - 类型: *String*

    ### `pageWorkflow` <span style="color:gray">[内部]</span>

        分页方式获取工序信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  工序信息列表 , 每条数据类型 *workflow*

        **示例**:{
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

    ### `queryWorkflow` <span style="color:gray">[内部]</span>

        获取工序信息

        按照公司作为默认条件查询

**返回参数**:

- **workflows**: 工序信息项 , 数据类型 *workflow*
          - 类型: *List*

        **示例**:{
                "workflows": [
                    {
                        "wfid": 1,
                        "name": "裁边",
                    }
                ]
                ...
            }

    ### `addWorkflow` <span style="color:gray">[内部]</span>

        添加工序信息

        工序归属公司跟随操作人变化

**请求参数**:

- **workflow.name**:
  工序名称

        **示例**:{
                "workflow.name": "裁边",
            }

    ### `updateWorkflow` <span style="color:gray">[内部]</span>

        更新工序信息

        判断工序是否存在 , 不存在更新失败 , 错误信息 **210017 工序不存在**

**请求参数**:

- **workflow.wfid**:
  工序ID
        - **workflow.name**:
  名称

        **示例**:{
                "wfid": 1,
                "name": "裁边",
            }

    ### `updateWorkflowForStatus` <span style="color:gray">[内部]</span>

        更新工序状态

        判断工序是否存在 , 不存在更新失败 , 错误信息 **210017 工序不存在**

**请求参数**:

- **workflow.wfid**:
  工序ID
        - **workflow.status**:
  状态

        **示例**:{
                "wfid": 1,
                "status": 0
            }

## 工序组

## api.production.WorkplanAction

**数据类型**:

#### workplan

    - **wpid**: 工序组ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **comment**: 备注信息
      - 类型: *String*
    - **workshop**: 车间 , 类型 [workshop](./workshop.html#api.production.WorkshopAction.workshop)
      - 类型: *Object*
    - **company**: 公司ID
      - 类型: *Long*

        |Filters:|
        - **name**: 工序组名称
      - 类型: *String*

    ### `pageWorkplan` <span style="color:gray">[内部]</span>

        分页方式获取车间信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  工序组信息列表 , 每条数据类型 :data: workplan

        **示例**:{
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

    ### `queryWorkplan` <span style="color:gray">[内部]</span>

        获取工序组信息

        按照公司作为默认条件查询

**返回参数**:

- **workplans**: 工序组信息列表 , 每条数据类型 *workplan*
          - 类型: *List*

        **示例**:{
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

    ### `queryWorkplanByWsid` <span style="color:gray">[内部]</span>

        通过车间ID查询工序组信息

        按照公司作为默认条件查询

**请求参数**:

- **workplan.workshop.wsid**:
  车间ID

        **示例**:{
                "workplan.workshop.wsid": "1"
            }

**返回参数**:

- **workplans**: 工序组信息列表 , 每条数据类型 *workplan*
          - 类型: *List*

        **示例**:{
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

    ### `addWorkplan` <span style="color:gray">[内部]</span>

        添加工序组信息

        工序归属公司跟随操作人变化

**请求参数**:

- **workplan.name**:
  工序组名称
        - **workplan.comment**:
  备注
        - **workplan.workshop.wsid**:
  车间ID

        **示例**:{
                "workplan.name": "第一工序组",
                "workplan.comment": "",
                "workplan.workshop.wsid": 1,
            }

    ### `updateWorkplan` <span style="color:gray">[内部]</span>

        更新工序组信息

        判断工序组是否存在 , 不存在更新失败 , 错误信息 **220018 工序组不存在**

**请求参数**:

- **workplan.wpid**:
  工序组ID
        - **workplan.name**:
  工序组名称
        - **workplan.comment**:
  备注信息
        - **workplan.workshop.wsid**:
  车间ID

        **示例**:{
                "workplan.wpid": 1,
                "workplan.name": "第一工序组",
                "workplan.comment": "",
                "workplan.workShop.wsid": 1
            }

    ### `updateWorkplanForStatus` <span style="color:gray">[内部]</span>

        更新工序组状态

        判断工序组是否存在 , 不存在更新失败 , 错误信息 **220018 工序组不存在**

**请求参数**:

- **workplan.wpid**:
  工序组ID
        - **workplan.status**:
  状态 , 0: 启用 , 1: 禁用

        **示例**:{
                "workplan.wsid": 1,
                "workplan.status": 1
            }

## 工序组-工序

## api.production.WorkFlowPlanAction

**数据类型**:

#### workflowPlan

    - **wfpid**: ID
      - 类型: *Long*
    - **workflow**: 工序 , 类型[workflow](./production.html#api.production.WorkflowAction.workflow)
      - 类型: *Object*
    - **workplan**: 工序组 , 类型[workplan](./production.html#api.production.WorkplanAction.workplan)
      - 类型: *Object*

    ### `queryWorkflowPlanByWfid` <span style="color:gray">[内部]</span>

        通过工序ID查询与之相关工序组

**请求参数**:

- **workflowPlan.workflow.wfid**:
  工序ID

        **示例**:{
                "workflowPlan.workflow.wfid": 1,
            }

**返回参数**:

- **workflowPlans**: 工序组-工序信息列表, 每条数据类型 *workflowPlan*
          - 类型: *List*

        **示例**:{
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

    ### `queryWorkflowPlanByWpid` <span style="color:gray">[内部]</span>

        通过工序组ID查询与之相关工序

**请求参数**:

- **workflowPlan.workflow.wpid**:
  工序组ID

        **示例**:{
                "workflowPlan.workplan.wpid": 1,
            }

**返回参数**:

- **workflowPlans**: 工序组与工序关系列表, 每条数据类型 :data: workflowPlan
          - 类型: *List*

        **示例**:{
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

    ### `updateWorkflowPlan` <span style="color:gray">[内部]</span>

        更新工序到工序组

        判断工序组是否存在 , 不存在更新失败 , 错误信息 **220018 工序组不存在**

        删除工序组原关联工序信息 , 之后更新工序组对应的工序信息

**请求参数**:

- **workflowPlan.workplan.wfpid**:
  工序组ID
        - **wfids[n]**:
  工序ID列表 , 每条数据类型 Long

        **示例**:{
                "workFlowPlan.workplan.wfpid": 1,
                "wfids[0]": 1
            }

## 人员-工序

## api.production.UserWorkflowAction

**数据类型**:

#### userWorkflow

    - **uwid**: 工序组ID
      - 类型: *Long*
    - **uid**: 人员ID
      - 类型: *Long*
    - **workflow**: 工序,类型[workflow](./production.html#api.production.WorkflowAction.workflow)
      - 类型: *Object*

    ### `queryUserWorkflowByUid` <span style="color:gray">[内部]</span>

        通过员工ID查询与之相关工序

**请求参数**:

- **userWorkFlow.uid**:
  员工ID

        **示例**:{
                "userWorkFlow.uid": 34,
            }

**返回参数**:

- **userWorkflows**: 员工与工序关系列表, 每条数据类型 *userWorkflow*
          - 类型: *List*

        **示例**:{
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

    ### `updateUserWorkflow` <span style="color:gray">[内部]</span>

        更新员工对应的工序

        判断员工是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**

        删除员工原关联工序信息 , 之后更新人员对应的工序信息

**请求参数**:

- **userWorkflow.uid**:
  员工ID
        - **wfids[n]**:
  工序ID列表 , 每条数据类型 Long

        **示例**:{
                "userWorkflow.uid": 1,
                "wfids[0]": 1
            }

## 报价类型

## api.production.QuoteTypeAction

**数据类型**:

#### quoteType

    - **qtid**: 报价类型ID
      - 类型: *Long*
    - **name**: 报价类型名称
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*

        |Filters:|
        - **name**: 报价类型名称
      - 类型: *String*

    ### `pageQuoteType` <span style="color:gray">[内部]</span>

        分页方式获取报价类型信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  报价类型信息列表 , 每条数据类型 *quoteType*

        **示例**:{
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

    ### `queryQuoteType` <span style="color:gray">[内部]</span>

        通过品类名称查询报价类型

**返回参数**:

- **quoteTypes**: 报价类型信息 , 类型 :data: `quoteType`
          - 类型: *List*

        **示例**:{
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

    ### `addQuoteType` <span style="color:gray">[内部]</span>

        添加报价类型

**请求参数**:

- **quoteType.name**:
  名称

        **示例**:{
               "quoteType.name": "板式家具"
            }

    ### `updateQuoteType` <span style="color:gray">[内部]</span>

        更新报价类型

        判断报价类型是否存在 , 不存在更新失败 , 错误信息 **220020 报价类型不存在**

**请求参数**:

- **quoteType.qtid**:
  报价类型ID
        - **quoteType.name**:
  名称

        **示例**:{
                "quoteType.qtid": 1,
                "quoteType.name": "板式家具"
            }

    ### `updateQuoteTypeForStatus` <span style="color:gray">[内部]</span>

        更新报价类型状态

        判断报价类型是否存在 , 不存在更新失败 , 错误信息 **220020 报价类型不存在**

**请求参数**:

- **quoteType.qtid**:
  报价类型ID
        - **quoteType.status**:
  状态

        **示例**:{
                "quoteType.qtid": 1,
                "quoteType.status": 1
            }

## 报价项

## api.production.QuoteItemAction

**数据类型**:

#### quoteItem

    - **qiid**: 报价项ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **pinyin**: 拼音
      - 类型: *String*
    - **format**: 型号
      - 类型: *String*
    - **measurementunit**: 单位
      - 类型: *String*
    - **unitprice**: 单价
      - 类型: *Integer*
    - **quoteType**: 类型 , 类型 [quoteType](./production.html#api.production.QuoteTypeAction.quoteType)
      - 类型: *Object*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **company**: 公司ID
      - 类型: *Long*

        |Filters:|
        - **name**: 名称
      - 类型: *String*
    - **type**: 类型
      - 类型: *Long*

    ### `pageQuoteItem` <span style="color:gray">[内部]</span>

        分页方式获取报价项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  报价项信息列表 , 每条数据类型 *quoteItem*

        **示例**:{
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

    ### `queryQuoteItemByPinyin` <span style="color:gray">[内部]</span>

        通过拼音查询报价项数据

        按照公司作为默认条件查询

**请求参数**:

- **quoteItem.pinyin**:
  拼音

        **示例**:{
                "quoteItem.pinyin": "dingban"
            }

**返回参数**:

- **quoteItems**: 报价项信息 , 类型 *quoteItem*
          - 类型: *List*

        **示例**:{
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

    ### `addQuoteItem` <span style="color:gray">[内部]</span>

        添加报价项数据

        工序归属公司跟随操作人变化

**请求参数**:

- **quoteItem.name**:
  报价项名称
        - **quoteItem.pinyin**:
  拼音
        - **quoteItem.format**:
  型号
        - **quoteItem.measurementunit**:
  单位
        - **quoteItem.unitprice**:
  单价
        - **quoteItem.quoteType.qtid**:
  品类ID

        **示例**:{
                "quoteItem.name": "顶板",
                "quoteItem.pinyin": "dingban",
                "quoteItem.format": "zx-1",
                "quoteItem.measurementunit": "个",
                "quoteItem.unitprice": 10000,
                "quoteItem.quoteType.qtid": 1,
            }

    ### `updateQuoteItem` <span style="color:gray">[内部]</span>

        更新报价项信息

        判断报价项是否存在 , 不存在更新失败 , 错误信息 **220019 报价项不存在**

**请求参数**:

- **quoteItem.qiid**:
  报价项ID
        - **quoteItem.name**:
  报价项名称
        - **quoteItem.pinyin**:
  拼音
        - **quoteItem.format**:
  型号
        - **quoteItem.measurementunit**:
  单位
        - **quoteItem.unitprice**:
  单价
        - **quoteItem.quoteType.qtid**:
  品类ID

        **示例**:{
                "quoteItem.qiid": "1",
                "quoteItem.name": "顶板",
                "quoteItem.pinyin": "dingban",
                "quoteItem.format": "zx-1",
                "quoteItem.measurementunit": "个",
                "quoteItem.unitprice": 10000,
                "quoteItem.quoteType.qtid": 1,
            }

    ### `updateQuoteItemForStatus` <span style="color:gray">[内部]</span>

        更新报价项状态

        判断报价项是否存在 , 不存在更新失败 , 错误信息 **220019 报价项不存在**

**请求参数**:

- **quoteItem.qiid**:
  报价项ID
        - **quoteItem.status**:
  报价项状态

        **示例**:{
                "quoteItem.qiid": 1,
                "quoteItem.status": 0
            }

## 生产单

## api.production.ProductionAction

**数据类型**:

#### production

    - **pid**: 生产单ID
      - 类型: *Long    *
    - **orderId**: 装修单号
      - 类型: *String*
    - **house**: 房产 , 类型 [house](./data.html#api.data.HouseAction.house)
      - 类型: *Object*
    - **total**: 总价
      - 类型: *Long*

    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **designer**: 设计师 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **salesman**: 销售员 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **spliter**: 拆单员 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*

    - **status**: 状态 , 0: 初始 , 1: 设计 , 2: 生产 , 3: 仓库 , 4: 物流 , 5: 运输 , 6: 安装 , 7: 完成 , 8: 售后, 9: 完结 , 10: 废单
      - 类型: *Short*

    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **designTime**: 设计时间
      - 类型: *Timestamp*
    - **divideTime**: 生产时间
      - 类型: *Timestamp*
    - **storeTime**: 仓储时间
      - 类型: *Timestamp*
    - **planTime**: 物流时间
      - 类型: *Timestamp*
    - **mountTime**: 安装时间
      - 类型: *Timestamp*
    - **updateTime**: 更新时间 , 最近完成工作时间
      - 类型: *Timestamp*

    - **timeLimit**: 工期
      - 类型: *Integer*
    - **spid**: 父级生产单ID
      - 类型: *Long*
    - **type**: 类型, 0:生产单 1:售后单
      - 类型: *Short*
    - **company**: 公司ID
      - 类型: *Long*

    ### `pageProduction` <span style="color:gray">[内部]</span>

        分页方式获取生产单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        按照公司作为默认条件查询

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  生产单信息列表 , 每条数据类型 *production*

        **示例**:{
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

    ### `addProduction` <span style="color:gray">[内部]</span>

        添加生产单

        工序归属公司跟随操作人变化

**请求参数**:

- **production.orderId**:
  装修单号
        - **production.house.hid**:
  房产ID
        - **production.total**:
  总价
        - **production.designer.uid**:
  设计师ID
        - **production.salesman.uid**:
  销售员ID
        - **production.spliter.uid**:
  拆单员ID
        - **production.timeLimit**:
  工期

        **示例**:{
                "production.orderId": "1608010000",
                "production.house.hid": 1,
                "production.total" 12000000,
                "production.designer.uid": 2,
                "production.salesman.uid": 2,
                "production.spliter.uid": 2,
                "production.timeLimit": 90000
            }

    ### `updateProduction` <span style="color:gray">[内部]</span>

        更新生产单

        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

        判断生产单状态 , 0(初始)之外的其他状态 , 不可修改设计师 ; 0(初始)和1(设计)之外的其他状态 , 不可修改拆单员

**请求参数**:

- **production.pid**:
  生产单ID
        - **production.designer.uid**:
  设计师ID
        - **production.salesman.uid**:
  销售员ID
        - **production.spliter.uid**:
  拆单员ID

        **示例**:{
                "production.pid": 1,
                "production.designer.uid": 2,
                "production.salesman.uid": 2,
                "production.spliter.uid": 2
            }

    ### `updateProductionForAdvance` <span style="color:gray">[内部]</span>

        更新生产单 , 高级操作

        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

**请求参数**:

- **production.pid**:
  生产单ID
        - **production.designer.uid**:
  设计师ID
        - **production.salesman.uid**:
  销售员ID
        - **production.spliter.uid**:
  拆单员ID
        - **production.timeLimit**:
  工期

        **示例**:{
                "production.pid": 1,
                "production.designer.uid": 2,
                "production.salesman.uid": 2,
                "production.spliter.uid": 2,
                "production.timeLimit": 10000
            }

    ### `designProduction` <span style="color:gray">[内部]</span>

        生产单进入设计阶段

        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

        判断生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

        更新生产单状态为1(设计) , 更新设计时间 , 更新生产单更新时间

**请求参数**:

- **production.pid**:
  生产单ID

        **示例**:{
                "production.pid": 1
            }

    ### `splitProduction` <span style="color:gray">[内部]</span>

        生产单进入生产(拆单)阶段

        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

        判断生产单状态1(设计) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

        更新生产单状态为2(生产) , 更新拆单时间 , 更新生产单更新时间

**请求参数**:

- **production.pid**:
  生产单ID

        **示例**:{
                "production.pid": 1
            }

    ### `instoreProduction` <span style="color:gray">[内部]</span>

        生产单进入仓储阶段

        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

        判断生产单状态2(生产) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

        更新生产单状态为3(仓库) , 更新仓储时间 , 更新生产单更新时间

**请求参数**:

- **production.pid**:
  生产单ID

        **示例**:{
                "production.pid": 1
            }

    ### `planProduction` <span style="color:gray">[内部]</span>

        生产单进入物流阶段

        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

        判断生产单状态3(仓库) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

        更新生产单状态为4(物流) , 更新物流时间 , 更新生产单更新时间

        更新生产单关联的物流包状态为2(物流) , 同时需要判断物流包状态是否存在0(初始) , 错误信息 220025 物流包状态不可操作

**请求参数**:

- **production.pid**:
  生产单ID

        **示例**:{
                "production.pid": 1
            }

    ### `tranProduction` <span style="color:gray">[内部]</span>

        生产单进入运输阶段

        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

        判断生产单状态4(物流) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

        更新生产单状态为5(运输) , 更新安装时间 , 更新生产单更新时间

**请求参数**:

- **production.pid**:
  生产单ID

        **示例**:{
                "production.pid": 1
            }

    ### `mountProduction` <span style="color:gray">[内部]</span>

        生产单进入物流阶段

        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

        判断生产单状态5(运输) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

        更新生产单状态为6(安装) , 更新安装时间 , 更新生产单更新时间

**请求参数**:

- **production.pid**:
  生产单ID

        **示例**:{
                "production.pid": 1
            }

    ### `finishProduction` <span style="color:gray">[内部]</span>

        完结生产单

        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

        判断生产单状态6(安装)/8(售后) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

        更新生产单状态为7(完成) , 更新生产单更新时间

**请求参数**:

- **production.pid**:
  生产单ID

        **示例**:{
                "production.pid": 1
            }

    ### `upholdProduction` <span style="color:gray">[内部]</span>

        售后生产单

        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

        判断生产单状态7(完成) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

        更新生产单状态为8(售后) , 更新生产单更新时间

**请求参数**:

- **production.pid**:
  生产单ID

        **示例**:{
                "production.pid": 1
            }

    ### `terminalProduction` <span style="color:gray">[内部]</span>

        生产单废单

        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

        判断生产单状态为0(初始)/1(设计) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

        更新生产单状态为10(废单) , 更新完结时间 , 更新生产单更新时间

**请求参数**:

- **production.pid**:
  生产单ID

        **示例**:{
                "production.pid": 1
            }

## 生产销售

生产单关联的销售单信息

## api.production.ProductionSalesAction

**数据类型**:

#### productionSales

    - **psid**: 生产销售ID
      - 类型: *Long*
    - **pid**: 生产单ID
      - 类型: *Long*
    - **sid**: 销售单ID
      - 类型: *Long*

    ### `queryProductionSalesByPid` <span style="color:gray">[内部]</span>

        查询生产单中所有的生产销售单

**请求参数**:

- **production.pid**:
  生产单ID

        **示例**:{
                "production.pid": 1,
            }

**返回参数**:

- **productionSales**: 生产销售单 , 每条数据类型 *productionSales*
          - 类型: *List*

        **示例**:{
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

    ### `bindProductionSales` <span style="color:gray">[内部]</span>

        绑定生产单与销售单关联关系

        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

        判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

        更新关联生产单更新时间

**请求参数**:

- **productionSales.pid**:
  生产单ID
        - **productionSales.sid**:
  销售单ID

        **示例**:{
                "productionSales.pid": 1,
                "productionSales.sid": 1
            }

## 报价

## api.production.PuotationAction

**数据类型**:

#### puotation

    - **qid**: 报价ID
      - 类型: *Long*
    - **pid**: 生产单ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **total**: 总价
      - 类型: *Long*
    - **discount**: 折让
      - 类型: *Integer*
    - **default**: 默认 , 1: 正使用 , 0: 未使用
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*

    #### puotationItem

    - **qiid**: 报价项ID
      - 类型: *Long*
    - **qid**: 报价ID
      - 类型: *Long*
    - **name**: 报价项名称
      - 类型: *String*
    - **format**: 规格
      - 类型: *String*
    - **height**: 高度
      - 类型: *Integer*
    - **width**: 宽度
      - 类型: *Integer*
    - **thick**: 厚度
      - 类型: *Integer*
    - **unitPrice**: 单价
      - 类型: *Integer*
    - **num**: 数量
      - 类型: *Integer*
    - **total**: 总价
      - 类型: *Long*
    - **measurementUnit**: 单位
      - 类型: *String*
    - **comment**: 备注
      - 类型: *String*
    - **specil**: 特型
      - 类型: *String*
    - **quoteType**: 类型
      - 类型: *String*

    ### `queryPuotationByPid` <span style="color:gray">[内部]</span>

        通过生产单ID查询报价

**请求参数**:

- **puotation.pid**:
  生产单ID

        **示例**:{
                "puotation.pid": 1,
            }

**返回参数**:

- **puotations**: 报价信息列表, 数据类型 *puotation*
          - 类型: *Object*

        **示例**:{
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

    ### `queryPuotationItemByQid` <span style="color:gray">[内部]</span>

        通过报价ID获取报价项

**请求参数**:

- **puotation.qid**:
  报价ID

        **示例**:{
                "puotation.qid": 1,
            }

**返回参数**:

- **puotationItems**: 报价项列表, 数据类型 *puotationItem*
          - 类型: *List*

        **示例**:{
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

    ### `addPuotation` <span style="color:gray">[内部]</span>

        创建报价信息

        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

        判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

        更新关联生产单更新时间

**请求参数**:

- **puotation.pid**:
  生产单ID
        - **puotation.name**:
  报价名称

        **示例**:{
                "production.pid": 1,
                "puotation.name": "一号报价"
            }

    ### `addPuotationItem` <span style="color:gray">[内部]</span>

        添加报价项

        判断报价是否存在 , 不存在更新失败 , 错误信息 **220014 报价不存在**

        判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

        更新关联生产单更新时间

**请求参数**:

- **puotationItem.qid**:
  报价ID
        - **puotationItem.name**:
  报价项名称
        - **puotationItem.format**:
  规格
        - **puotationItem.height**:
  高度
        - **puotationItem.width**:
  宽度
        - **puotationItem.thick**:
  厚度
        - **puotationItem.num**:
  数量
        - **puotationItem.unitPrice**:
  单价
        - **puotationItem.measurementUnit**:
  单位
        - **puotationItem.total**:
  总价
        - **puotationItem.comment**:
  备注
        - **puotationItem.specil**:
  特型
        - **puotationItem.quoteType**:
  报价类型

        **示例**:{
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

    ### `updatePuotation` <span style="color:gray">[内部]</span>

        更新报价信息

        判断报价是否存在 , 不存在更新失败 , 错误信息 **220014 报价不存在**

        判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

**请求参数**:

- **puotation.qid**:
  报价ID
        - **puotation.name**:
  名称
        - **puotation.comment**:
  说明

        **示例**:{
                "puotation.qid": 1,
                "puotation.name": "名字",
                "puotation.comment": "说明"
            }

    ### `updatePuotationForAdvance` <span style="color:gray">[内部]</span>

        更新报价信息

        判断报价是否存在 , 不存在更新失败 , 错误信息 **220014 报价不存在**

        判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

**请求参数**:

- **puotation.qid**:
  报价ID
        - **puotation.discount**:
  折扣
        - **puotation.total**:
  总价

        **示例**:{
                "puotation.qid": 1,
                "puotation.total": 100000,
                "puotation.discount": 10000
            }

    ### `updatePuotationForDefault` <span style="color:gray">[内部]</span>

        更新默认报价

        判断报价是否存在 , 不存在更新失败 , 错误信息 **220014 报价不存在**

        判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

        遍历所有报价 , 更换默认报价信息

**请求参数**:

- **puotation.qid**:
  报价ID

        **示例**:{
                "puotation.qid": 1
            }

    ### `deletePuotation` <span style="color:gray">[内部]</span>

        删除报价

        判断报价是否存在 , 不存在更新失败 , 错误信息 **220014 报价不存在**

        判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

        删除报价信息同时 , 删除归属报价的报价项信息

**请求参数**:

- **puotation.qid**:
  报价ID

        **示例**:{
                "puotation.qid": 1
            }

    ### `deletePuotationItem` <span style="color:gray">[内部]</span>

        删除报价项

        判断报价项是否存在 , 不存在删除失败 , 错误信息 **220015 报价中报价项不存在**

        判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

**请求参数**:

- **puotationItem.qiid**:
  报价项ID

        **示例**:{
                "puotationItem.qiid": 1
            }

## 图纸

图纸信息管理

## api.production.ProductionPictureAction

**数据类型**:

#### productionPicture

    - **ppid**: 图纸ID
      - 类型: *Long*
    - **pid**: 生产单ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **path**: 路径
      - 类型: *String*
    - **type**: 类型 , 0: 文件 , 1: 设计图
      - 类型: *Short*
    - **status**: 状态 , 0: 初版, 1: 终版, 2:废除
      - 类型: *Short*
    - **comment**: 备注
      - 类型: *String*

    ### `queryProductionPictureByPid` <span style="color:gray">[内部]</span>

        查询生产单下的图纸

**请求参数**:

- **productionPicture.pid**:
  生产单ID

        **示例**:{
                "productionPicture.pid": 1,
            }

**返回参数**:

- **productionPictures**: 图纸列表 , 每条数据类型 *productionPicture*
          - 类型: *List*

        **示例**:{
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

    ### `addProductionPicture` <span style="color:gray">[内部]</span>

        新增图纸信息

        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

        判断关联生产单状态1(设计) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

        更新关联生产单更新时间

**请求参数**:

- **productionPicture.pid**:
  生产单ID
        - **productionPicture.name**:
  名称
        - **productionPicture.path**:
  路径
        - **productionPicture.type**:
  类型
        - **productionPicture.comment**:
  备注

        **示例**:{
                "productionPicture.pid": 1,
                "productionPicture.name": "橱柜CAD图",
                "productionPicture.path": "00/00/OIJASDF7ASDLFKJASD7FSDFJKL.xls",
                "productionPicture.type": 0,
                "productionPicture.comment": ""
            }

    ### `deleteProductionPicture` <span style="color:gray">[内部]</span>

        删除图纸信息

        判断图纸是否存在 , 不存在 , 错误信息 **220003 图纸不存在**

        判断关联生产单状态1(设计) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

**请求参数**:

- **productionPicture.ppid**:
  图纸ID

        **示例**:{
                "productionPicture.pid": 1
            }

## 外协单

## api.production.OutsourceAction

**数据类型**:

#### outsource

    - **oid**: 外协单ID
      - 类型: *Long*
    - **production**: 生产单 , 类型 [production](./production.html#api.production.ProductionAction.production)
      - 类型: *Object*
    - **no**: 编号 , L作为第一个字符 , 由日期加四位格式计数组成 , 例: L1601010001
      - 类型: *String*
    - **supplier**: 厂商 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **finishTime**: 结束时间
      - 类型: *Timestamp*
    - **timeLimit**: 工期
      - 类型: *Integer*
    - **status**: 状态 , 0: 初始 , 1: 接收 , 2: 确认 , 3: 完结 , 4: 失效
      - 类型: *Short*
    - **path**: 路径
      - 类型: *String*
    - **comment**: 备注
      - 类型: *String*
    - **company**: 公司
      - 类型: *Long*

    #### outsourceItem

    - **oiid**: 外协项ID
      - 类型: *Long*
    - **oid**: 外协单ID
      - 类型: *Long*
    - **height**: 高
      - 类型: *Integer*
    - **width**: 宽
      - 类型: *Integer*
    - **thick**: 厚
      - 类型: *Integer*
    - **modelling**: 造型
      - 类型: *String*
    - **num**: 数量
      - 类型: *Integer*
    - **unitprice**: 单价
      - 类型: *Integer*
    - **total**: 总价
      - 类型: *Long*
    - **comment**: 备注
      - 类型: *String*

    ### `pageOutsource` <span style="color:gray">[内部]</span>

        分页方式获取外协单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  外协单信息列表 , 每条数据类型 *outsource*

        **示例**:{
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

    ### `pageOutsourceForSupplier` <span style="color:gray">[内部]</span>

        分页方式获取外协单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        厂商信息限定为当前操作人员相关信息

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  外协单信息列表 , 每条数据类型 *outsource*

        **示例**:{
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

    ### `queryOutsourceByPid` <span style="color:gray">[内部]</span>

        通过生产单ID获取外协单

**请求参数**:

- **outsource.production.pid**:
  生产单ID

**返回参数**:

- **outsources**: 外协单信息列表 , 每条数据类型 *outsource*
          - 类型: *List*

        **示例**:{
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

    ### `addOutsource` <span style="color:gray">[内部]</span>

        创建外协单

        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

        判断关联生产单状态2(生产) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

**请求参数**:

- **outsource.production.pid**:
  生产单ID
        - **outsource.supplier.uid**:
  厂商ID
        - **outsource.comment**:
  备注

        **示例**:{
                "outsource.production.pid": 1,
                "outsource.comment": "说明"
            }
    ### `updateOutsource` <span style="color:gray">[内部]</span>

        更新外协单

        判断外协单是否存在 , 不存在 , 错误信息 **220006 外协单不存在**

**请求参数**:

- **outsource.oid**:
  外协单ID
        - **outsource.path**:
  路径
        - **outsource.comment**:
  说明

        **示例**:{
                "outsource.osid": 1,
                "outsource.path": "00/00/OIJASDF7ASDLFKJASD7FSDFJKL.xls",
                "outsource.comment": "说明"
            }

    ### `receiptOutsource` <span style="color:gray">[内部]</span>

        接收外协单

        判断外协单是否存在 , 不存在 , 错误信息 **220006 外协单不存在**

        判断外协单状态是否为0(初始) , 其他状态 , 错误信息 **220021 外协单状态不可操作**

        外协单状态更新为1(接收)

        更新关联生产单更新时间

**请求参数**:

- **outsource.oid**:
  外协单ID

        **示例**:{
                "outsource.osid": 1
            }

    ### `confirmOutsource` <span style="color:gray">[内部]</span>

        确认外协单

        判断外协单是否存在 , 不存在 , 错误信息 **220006 外协单不存在**

        判断外协单状态是否为1(接收) , 其他状态 , 错误信息 **220021 外协单状态不可操作**

        外协单状态更新为2(确认)

        更新关联生产单更新时间

**请求参数**:

- **outsource.oid**:
  外协单ID

        **示例**:{
                "outsource.osid": 1
            }

    ### `finishOutsource` <span style="color:gray">[内部]</span>

        完结外协单

        判断外协单是否存在 , 不存在 , 错误信息 **220006 外协单不存在**

        判断外协单状态是否为2(确认) , 其他状态 , 错误信息 **220021 外协单状态不可操作**

        外协单状态更新为3(完结)

        关联生成对应数量的物流包信息

        更新关联生产单更新时间

**请求参数**:

- **outsource.oid**:
  外协单ID
        - **outsource.num**:
  物流包数量

        **示例**:{
                "outsource.oid": 1,
                "outsource.num": 1
            }

    ### `deleteOutsource` <span style="color:gray">[内部]</span>

        删除外协单

        判断外协单是否存在 , 不存在 , 错误信息 **220006 外协单不存在**

        判断外协单状态是否为0(初始) , 其他状态 , 错误信息 **220021 外协单状态不可操作**

        外协单状态更新为3(失效)

**请求参数**:

- **outsource.oid**:
  外协单ID

        **示例**:{
                "outsource.oid": 1
            }

    ### `pageOutsourceItemByOid` <span style="color:gray">[内部]</span>

        通过外协单ID分页方式获取外协项信息

**请求参数**:

- **outsourceItem.oid**:
  外协单ID

        **示例**:{
                "outsourceItem.oid": 1
            }

**返回参数**:

- **outsourceItems**: 外协项列表 , 每条数据类型 *outsourceItem*
          - 类型: *List*

        **示例**:{
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

    ### `addOutsourceItem` <span style="color:gray">[内部]</span>

        添加外协项信息

        判断外协单是否存在 , 不存在 , 错误信息 **220006 外协单不存在**

**请求参数**:

- **outsource.oid**:
  外协项ID
        - **outsourceItem.height**:
  高
        - **outsourceItem.width**:
  宽
        - **outsourceItem.thick**:
  厚
        - **outsourceItem.modelling**:
  造型
        - **outsourceItem.unitprice**:
  单价
        - **outsourceItem.num**:
  数量
        - **outsourceItem.total**:
  总价
        - **outsourceItem.comment**:
  备注

        **示例**:{
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

    ### `deleteOutsourceItem` <span style="color:gray">[内部]</span>

        删除外协项信息

        判断外协项是否存在  ,不存在删除失败 , 错误信息 **220007 外协项不存在**

**请求参数**:

- **outsourceItem.oiid**:
  外协项ID

        **示例**:{
                "outsourceItem.oiid": 1,
            }

## 五金单

## api.production.HardwareAction

**数据类型**:

#### hardware

    - **hid**: 五金单ID
      - 类型: *Long*
    - **production**: 生产单 , 类型 [production](./production.html#api.production.ProductionAction.production)
      - 类型: *Object*
    - **no**: 编号 , G作为第一个字符 , 由日期加四位格式计数组成 , 例: G1601010001
      - 类型: *String*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **finishTime**: 结束时间
      - 类型: *Timestamp*
    - **timeLimit**: 工期
      - 类型: *Integer*
    - **status**: 状态 , 0: 初始 , 1: 采购 , 2: 仓库 , 3: 完结 , 4: 失效
      - 类型: *Short*
    - **path**: 路径
      - 类型: *String*
    - **comment**: 说明
      - 类型: *String*
    - **company**: 公司
      - 类型: *Long*

    #### hardwareItem

    - **hiid**: 五金项ID
      - 类型: *Long*
    - **hid**: 五金单ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **num**: 数量
      - 类型: *Integer*
    - **unitprice**: 单价
      - 类型: *Integer*
    - **measurementunit**: 单位
      - 类型: *String*
    - **comment**: 备注
      - 类型: *String*
    - **total**: 总价
      - 类型: *Long*

    ### `pageHardware` <span style="color:gray">[内部]</span>

        分页方式获取五金单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  五金单信息列表 , 每条数据类型 *hardware*

        **示例**:{
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

    ### `queryHardwareByPid` <span style="color:gray">[内部]</span>

        通过生产单ID获取五金单

**请求参数**:

- **hardware.production.pid**:
  生产单ID

        **示例**:{
                "hardware.production.pid": 1
            }

**返回参数**:

- **hardwares**: 五金单信息列表 , 每条数据类型 *hardware*
          - 类型: *List*

        **示例**:{
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

    ### `addHardware` <span style="color:gray">[内部]</span>

        创建五金单

        判断生产单是否存在 , 错误信息 **220001 生产单不存在**

        判断关联生产单状态2(生产) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

        更新关联生产单更新时间

**请求参数**:

- **hardware.production.pid**:
  生产单ID
        - **hardware.status**:
  状态
        - **hardware.comment**:
  说明

        **示例**:{
                "hardware.production.pid": 1,
                "hardware.status": 1,
                "hardware.comment": "说明"
            }

    ### `updateHardware` <span style="color:gray">[内部]</span>

        更新五金单信息

        判断五金单是否存在 , 错误信息 **220004 五金单不存在**

        更新关联生产单更新时间

**请求参数**:

- **hardware.hid**:
  五金单ID
        - **hardware.comment**:
  说明
        - **hardware.path**:
  路径

        **示例**:{
                "hardware.hid": 1,
                "hardware.comment": 1,
                "hardware.path": 1
            }

    ### `instoreHardware` <span style="color:gray">[内部]</span>

        五金单进入仓储阶段

        判断五金单是否存在 , 错误信息 **220004 五金单不存在**

        判断五金单状态为1(采购) , 其他状态 , 错误信息 **220022 五金单状态不可操作**

        更新关联生产单更新时间

**请求参数**:

- **hardware.hid**:
  五金单ID

        **示例**:{
                "hardware.hid": 1
            }

    ### `finishHardware` <span style="color:gray">[内部]</span>

        完结五金单

        判断五金单是否存在 , 错误信息 **220004 五金单不存在**

        判断五金单状态是否为2(仓库) , 其他状态 , 错误信息 **220021 外协单状态不可操作**

        外协单状态更新为3(完结)

        关联生成对应数量的物流包信息

        更新关联生产单更新时间

**请求参数**:

- **hardware.hid**:
  五金单ID
        - **hardware.num**:
  物流包数量

        **示例**:{
                "hardware.hid": 1,
                "hardware.num": 1
            }

    ### `deleteHardware` <span style="color:gray">[内部]</span>

        删除五金单

        判断五金单是否存在 , 不存在更新失败 , 错误信息 **220004 五金单不存在**

        判断五金单状态是0(初始)/1(采购) , 其他状态 , 错误信息 **220022 五金单状态不可操作**

**请求参数**:

- **hardware.hid**:
  五金单ID

        **示例**:{
                "hardware.hid": 1
            }

    ### `pageHardwareItemByHid` <span style="color:gray">[内部]</span>

        分页方式获取五金项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**请求参数**:

- **hardwareItem.hid**:
  生产单ID

        **示例**:{
                "hardwareItem.hid": 1
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  五金项信息列表 , 每条数据类型 *hardwareItem*

        **示例**:{
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

    ### `addHardwareItem` <span style="color:gray">[内部]</span>

        添加五金项到五金单

        判断五金单是否存在 , 不存在更新失败 , 错误信息 **220004 五金单不存在**

**请求参数**:

- **hardwareItem.hid**:
  五金单ID
        - **hardwareItem.name**:
  说明
        - **hardwareItem.num**:
  数量
        - **hardwareItem.unitprice**:
  单价
        - **hardwareItem.total**:
  总价
        - **hardwareItem.measurementunit**:
  单位
        - **hardwareItem.comment**:
  说明

        **示例**:{
                "hardwareItem.hid": 1,
                "hardwareItem.name": "名称",
                "hardwareItem.num": 1,
                "hardwareItem.unitprice": 100000,
                "hardwareItem.total": 100000,
                "hardwareItem.nameasurementunitme": "个",
                "hardwareItem.comment": "说明"
            }

    ### `deleteHardwareItem` <span style="color:gray">[内部]</span>

        删除五金项信息

        判断五金项是否存在 , 不存在删除失败 , 错误信息 **220005 五金项不存在**

**请求参数**:

- **hardwareItem.hiid**:
  五金项ID

        **示例**:{
                "hardwareItem.hiid": 1,
            }

## 生产计划

### 生产计划单

## api.production.ProductionPlanAction

**数据类型**:

#### productionPlan

    - **ppid**: 计划ID
      - 类型: *Long*
    - **production**: 生产单 , 类型 [production](./production.html#api.production.ProductionAction.production)
      - 类型: *Object*
    - **no**: 编号 , G作为第一个字符 , 由日期加四位格式计数组成 , 例: Z1601010001
      - 类型: *String*
    - **path**: 路径
      - 类型: *String*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **finishTime**: 完成时间
      - 类型: *Timestamp*
    - **timeLimit**: 工期
      - 类型: *Integer*
    - **status**: 状态 0: 初始, 1: 完结
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Long*

    #### productionPlanItem

    - **ppiid**: 计划项ID
      - 类型: *Long*
    - **ppid**: 计划ID
      - 类型: *Object*
    - **typeno**: 类型编号
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **height**: 高
      - 类型: *Integer*
    - **width**: 宽
      - 类型: *Integer*
    - **thick**: 厚
      - 类型: *Integer*
    - **color**: 颜色
      - 类型: *String*
    - **unitprice**: 单价
      - 类型: *Integer*
    - **num**: 数量
      - 类型: *Integer*
    - **total**: 总价
      - 类型: *Long*
    - **comment**: 备注
      - 类型: *String*

    ### `pageProductionPlan` <span style="color:gray">[内部]</span>

        分页方式获取计划信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  计划信息列表 , 每条数据类型 *productionPlan*

        **示例**:{
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

    ### `queryProductionPlanByPid` <span style="color:gray">[内部]</span>

        通过生产单ID获取生产计划

**请求参数**:

- **productionPlan.production.pid**:
  生产单ID

        **示例**:{
                "productionPlan.production.pid": 1,
            }

**返回参数**:

- **productionPlans**: 计划表 , 每条数据类型 *productionPlan*
          - 类型: *List*

        **示例**:{
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

    ### `addProductionPlan` <span style="color:gray">[内部]</span>

        创建生产计划

        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**

        判断关联生产单状态2(生产) , 其他状态 , 错误信息 **220002 生产单状态不可操作**

        更新关联生产单更新时间

**请求参数**:

- **productionPlan.production.pid**:
  生产单ID
        - **productionPlan.timeLimit**:
  工期

        **示例**:{
                "productionPlan.production.pid": 1,
                "productionPlan.timeLimit": 10000
            }

    ### `updateProductionPlan` <span style="color:gray">[内部]</span>

        更新计划

        判断计划是否存在 , 不存在更新失败 , 错误信息 **220008 计划不存在**

**请求参数**:

- **productionPlan.ppid**:
  生产计划ID
        - **productionPlan.path**:
  路径

        **示例**:{
                "productionPlan.ppid": 1,
                "productionPlan.path": "00/00/OIJASDF7ASDLFKJASD7FSDFJKL.xls",
            }

    ### `finishProductionPlan` <span style="color:gray">[内部]</span>

        完结五金单

        判断计划是否存在 , 不存在更新失败 , 错误信息 **220008 计划不存在**

        判断计划状态是否为0(初始) , 其他状态 , 错误信息 **220021 外协单状态不可操作**

        生产计划状态更新为1(完结)

        关联生成对应数量的物流包信息

        更新关联生产单更新时间

**请求参数**:

- **productionPlan.ppid**:
  五金单ID
        - **productionPlan.num**:
  物流包数量

        **示例**:{
                "productionPlan.ppid": 1,
                "productionPlan.num": 1
            }

    ### `pageProductionPlanItemByPpid` <span style="color:gray">[内部]</span>

        分页方式获取计划项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**请求参数**:

- **productionPlanItem.ppid**:
  计划ID

        **示例**:{
                "productionPlanItem.ppid": 1
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  计划项信息列表 , 每条数据类型 *productionPlanItem*

        **示例**:{
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

    ### `addProductionPlanItem` <span style="color:gray">[内部]</span>

        添加计划项信息

        判断计划是否存在 , 不存在更新失败 , 错误信息 **220008 计划不存在**

**请求参数**:

- **productionPlanItem.ppid**:
  计划ID
        - **productionPlanItem.typeno**:
  类型编号
        - **productionPlanItem.name**:
  名称
        - **productionPlanItem.height**:
  高
        - **productionPlanItem.width**:
  宽
        - **productionPlanItem.thick**:
  厚
        - **productionPlanItem.color**:
  颜色
        - **productionPlanItem.unitprice**:
  单价
        - **productionPlanItem.num**:
  数量
        - **productionPlanItem.total**:
  总价
        - **productionPlanItem.comment**:
  备注

        **示例**:{
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

    ### `deleteProductionPlanItem` <span style="color:gray">[内部]</span>

        删除生产单项信息

        判断计划项是否存在 , 不存在更新失败 , 错误信息 **220009 计划项不存在**

**请求参数**:

- **productionPlanItem.ppiid**:
  计划项ID

        **示例**:{
                "productionPlanItem.ppiid": 1,
            }

### 计划工序组

## api.production.ProductionWorkPlanAction

**数据类型**:

#### productionWorkPlan

    - **pwpid**: 工序组ID
      - 类型: *Long*
    - **ppid**: 计划ID
      - 类型: *Long*
    - **workPlan**: 工序组 , 类型 [workPlan](./production.html#api.production.WorkPlanAction.workPlan)
      - 类型: *Long*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 初始 , 1: 执行 , 2: 完成
      - 类型: *Short*
    - **sort**: 排序
      - 类型: *Short*

    ### `queryProductionWorkPlanByPpid` <span style="color:gray">[内部]</span>

**请求参数**:

- **productionWorkPlan.ppid**:
  计划ID

        **示例**:{
                "productionWorkPlan.ppid": 1,
            }

**返回参数**:

- **productionWorkPlans**: 计划项列表 , 每条数据类型 *productionworkplan*
          - 类型: *List*

        **示例**:{
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

    ### `addProductionWorkPlan` <span style="color:gray">[内部]</span>

        添加计划工序组

        判断计划是否存在 , 不存在更新失败 , 错误信息 **220008 计划不存在**

        判断计划中是否已经存在工序组 , 存在不能添加 , 错误信息 **220010 计划工序已存在**

        添加计划工序组同时 , 利用工序组中拥有工序完成计划工序数据的生成

**请求参数**:

- **productionWorkPlan.ppid**:
  计划ID
        - **productionWorkPlan.wpid**:
  工序组ID

        **示例**:{
                "productionWorkPlan.ppid": 1,
                "productionWorkPlan.wpid": 1
            }

    ### `finishProductionWorkPlan` <span style="color:gray">[内部]</span>

        完结计划工序组

        判断计划是否存在 , 不存在更新失败 , 错误信息 **220008 计划不存在**

        判断计划工序组是否存在 , 不存在 , 错误信息 **220026 计划工序组不存在**

        判断计划工序组状态是否为1(执行) , 其他状态 , 错误信息 **220011 生产计划工序组状态不可操作**

        判断计划工序组排序 , 非顺序完成计划组 , 错误信息 **220027 计划工序组执行顺序异常**

        更新计划工序组状态为2(完成)

**请求参数**:

- **productionWorkPlan.wpid**:
  工序组ID

        **示例**:{
                "productionWorkPlan.wpid": 1
            }

    ### `deleteProductionWorkPlan` <span style="color:gray">[内部]</span>

        删计划工序组

        判断计划工序组状态 , 非初始不能删除 , 错误信息 **220011 计划工序组状态不可操作**

**请求参数**:

- **productionWorkPlan.pwpid**:
  ID

        **示例**:{
                "productionWorkPlan.pwpid": 1
            }

### 计划工序

## api.production.ProductionWorkFlowAction

**数据类型**:

#### productionWorkFlow

    - **pwfid**: 计划工序ID
      - 类型: *Long*
    - **pwpid**: 计划工序组ID
      - 类型: *Long*
    - **workflow**: 操作工序 , 类型 [workflow](./production.html#api.production.WorkFlowAction.workflow)
      - 类型: *Object*
    - **operater**: 操作人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **operateTime**: 操作时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 初始 , 1: 执行
      - 类型: *Short*

    ### `queryProductionWorkFlowByPwpidAWfid` <span style="color:gray">[内部]</span>

        通过计划涉工序组ID获取计划工序

**请求参数**:

- **productionWorkFlow.pwpid**:
  计划工序组ID

        **示例**:{
                "productionWorkFlow.pwpid": 1
            }

**返回参数**:

- **productionWorkFlows**: 计划工序, 数据类型 *productionWorkFlow*
          - 类型: *List*

        **示例**:{
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

    ### queryProductionWorkFlowByPwpid

        通过计划工序组ID获取计划工序

**请求参数**:

- **productionWorkFlow.pwpid**:
  计划工序组ID

        **示例**:{
                "productionWorkFlow.pwpid": 1
            }

**返回参数**:

- **productionWorkFlows**: 单位信息列表 , 每条数据类型 *productionWorkFlows*
          - 类型: *List*

        **示例**:{
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

    ### `operateProductionWorkFlow` <span style="color:gray">[内部]</span>

        操作计划工序信息

        判断计划工序是否存在 , 不存在操作失败 , 错误信息 **220012 计划工序不存在**

        判断计划工序是否已经操作 , 已经操作不可再次操作 , 错误信息 **220013 计划工序不可操作**

        更新计划工序操作人以及操作时间

        判断归属工序组内工序全部完结 , 更新计划工序组状态为已操作1(已执行)

**请求参数**:

- **productionWorkFlow.pwfid**:
  操作工人ID

        **示例**:{
                "productionWorkFlow.pwfid": 1
            }

### 计划工序-人员

## api.production.ProductionUserWorkflowAction

**数据类型**:

#### productionUserWorkflow

    - **puwfid**: ID
      - 类型: *Long*
    - **pwfid**: 计划工序ID
      - 类型: *Long*
    - **operater**: 操作人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **operateTime**: 操作时间
      - 类型: *Timestamp*

    ### `queryProductionUserWorkFlowByPwfid` <span style="color:gray">[内部]</span>

        通过计划工序ID获取计划工序-人员

**请求参数**:

- **productionUserWorkFlow.pwfid**:
  计划工序ID

        **示例**:{
                "productionUserWorkFlow.pwfid": 1
            }

**返回参数**:

- **productionUserWorkFlows**: 计划工序-人员, 数据类型 *productionUserWorkFlow*
          - 类型: *List*

        **示例**:{
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

## 物流包

## api.production.TranpackAction

**数据类型**:

#### tranpack

    - **tid**: 物流包ID
      - 类型: *Long*
    - **production**: 生产单 , 类型 [production](./production.html#api.production.ProductionAction.production)
      - 类型: *Object*
    - **no**: 编号
      - 类型: *String*
    - **rid**: 关联ID , 分别关联五金单ID/外协单ID/生产计划单ID , 利用类型进行区分
      - 类型: *Long*
    - **type**: 类型 , 0: 外协 , 1: 五金 , 2: 生产计划
      - 类型: *Short*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **sender**: 送货人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **mounter**: 安装人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **planTime**: 物流时间
      - 类型: *Timestamp*
    - **tranTime**: 送货时间
      - 类型: *Timestamp*
    - **mountTime**: 安装时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 初始 , 1: 仓库 , 2: 物流 , 3: 运输 , 4: 安装 , 5: 完成 , 6: 丢失 , 7: 失效
      - 类型: *Short*

    ### `pageTranpack` <span style="color:gray">[内部]</span>

        分页方式获取物流包 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  计划信息列表 , 每条数据类型 *productionPlan*

        **示例**:{
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

    ### `queryTranpackByPid` <span style="color:gray">[内部]</span>

        通过生产单ID获取物流包

**请求参数**:

- **tranpack.production.pid**:
  生产单ID

**返回参数**:

- **tranpacks**: 物流包信息列表 , 每条数据类型 *tranpack*
          - 类型: *List*

        **示例**:{
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

    ### `packTranpack` <span style="color:gray">[内部]</span>

        打包物流包

        根据关联单号以及类型获取对应的订单 , 外协/五金/生产计划

        根据物流包类型以及关联ID , 判断关联单是否存在

        更新关联生产单更新时间

**请求参数**:

- **tranpack.no**:
  关联单号
        - **tranpack.type**:
  关联单号

        **示例**:{
                "tranpack.no": 1,
                "tranpack.type": 0
            }

    ### `packTranpackForOutsource` <span style="color:gray">[内部]</span>

        打包物流包

**请求参数**:

- **tranpack.production.pid**:
  生产单ID

        **示例**:{
                "tranpack.production.pid": 1,
                "tranpack.rid": 1,
                "tranpack.type": 1
            }

    ### `packTranpackForHardware` <span style="color:gray">[内部]</span>

        打包物流包

**请求参数**:

- **tranpack.production.pid**:
  生产单ID

        **示例**:{
                "tranpack.production.pid": 1,
                "tranpack.rid": 1,
                "tranpack.type": 1
            }

    ### `packTranpackForPlan` <span style="color:gray">[内部]</span>

        打包物流包

**请求参数**:

- **tranpack.production.pid**:
  生产单ID

        **示例**:{
                "tranpack.production.pid": 1,
                "tranpack.rid": 1,
                "tranpack.type": 2
            }

    ### `instoreTranpack` <span style="color:gray">[内部]</span>

        物流包进仓储阶段

        判断物流包是否存在 , 不存在 , 错误信息 **220023 物流包不存在**

        判断物流包状态0(初始) , 其他状态 , 错误信息 **220025 物流包状态不可操作**

        更新物流包状态为1(仓储) , 更新关联生产单更新时间

        判断关联生产单归属外协单状态是否为3(完结) , 存在其他状态外协单 , 关联生产单状态不可更新

        判断关联生产单归属五金单状态是否为3(完结) , 存在其他状态五金单 , 关联生产单状态不可更新

        判断关联生产单归属计划单状态是否为1(完结) , 存在其他状态计划单 , 关联生产单状态不可更新

        判断关联生产单归属物流包状态是否为0(初始) , 存在该状态物流包 , 关联生产单状态不可更新

        满足以上条件之后 , 更新关联生产单状态为3(仓库) , 更新入库时间

**请求参数**:

- **tranpack.production.pid**:
  生产单ID

        **示例**:{
                "tranpack.production.pid:": 1
            }

    ### `planTranPack` <span style="color:gray">[内部]</span>

        物流包进入物流阶段

        判断物流包是否存在 , 不存在 , 错误信息 **220023 物流包不存在**

        判断物流包状态1(仓储) , 其他状态 , 错误信息 **220025 物流包状态不可操作**

        更新物流包状态为2(物流) , 更新物流时间 , 更新关联生产单更新时间

**请求参数**:

- **tranpack.production.pid**:
  生产单ID

        **示例**:{
                "tranpack.production.pid:": 1
            }

    ### `tranTranpack` <span style="color:gray">[内部]</span>

        物流包进入运输阶段

        判断物流包是否存在 , 不存在 , 错误信息 **220023 物流包不存在**

        判断物流包状态2(物流) , 其他状态 , 错误信息 **220025 物流包状态不可操作**

        更新物流包状态为3(运输) , 更新送货时间 , 更新关联生产单更新时间

**请求参数**:

- **tranpack.production.pid**:
  生产单ID

        **示例**:{
                "tranpack.production.pid:": 1
            }

    ### `mountTranpack` <span style="color:gray">[内部]</span>

        物流包进入安装阶段

        判断物流包是否存在 , 不存在 , 错误信息 **220023 物流包不存在**

        判断物流包状态3(运输) , 其他状态 , 错误信息 **220025 物流包状态不可操作**

        更新物流包状态为4(安装) , 更新安装时间 , 更新关联生产单更新时间

**请求参数**:

- **tranpack.production.pid**:
  生产单ID

        **示例**:{
                "tranpack.production.pid:": 1
            }

    ### `completeTranpack` <span style="color:gray">[内部]</span>

        完成物流包

        判断物流包是否存在 , 不存在 , 错误信息 **220023 物流包不存在**

        判断物流包状态4(安装) , 其他状态 , 错误信息 **220025 物流包状态不可操作**

        更新物流包状态为5(完成) , 更新安装时间 , 更新关联生产单更新时间

**请求参数**:

- **tranpack.production.pid**:
  生产单ID

        **示例**:{
                "tranpack.production.pid:": 1
            }

    ### `lossTranpack` <span style="color:gray">[内部]</span>

        物流包丢失

        判断物流包是否存在 , 不存在 , 错误信息 **220023 物流包不存在**

        更新物流包状态为6(丢失)

**请求参数**:

- **tranpack.production.pid**:
  生产单ID

        **示例**:{
                "tranpack.production.pid:": 1
            }

## 功能

## api.production.ProductionFunctionAction

**数据类型**:

#### productionFunction

    - **pfid**: 功能ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **key**: key
      - 类型: *String*
    - **value**: value
      - 类型: *String*
    - **type**: 类型 , 0: 类型, 1: api, 2: 条件, 3: 字段, 4: 功能, 5: 节点
      - 类型: *Short*
    - **subtype**: 子类 , 0: 字符串, 1: 数组
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **sort**: 排序
      - 类型: *Short*

    ### `queryProductionFunction` <span style="color:gray">[内部]</span>

        获取生产功能信息

    ### `queryProductionFunctionByName` <span style="color:gray">[内部]</span>

        通过名称获取生产功能信息
