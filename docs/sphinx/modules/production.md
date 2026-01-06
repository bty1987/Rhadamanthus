.. production:

# 生产
## 车间

## api.production.WorkshopAction

        |DataType:|
        #### workshop

    - **wsid**: 车间ID
      - 类型: *Long*
    - **name**: 车间名称
      - 类型: *String*
    - **status**: 状态 , 0: 启用, 1: 禁用
      - 类型: *Short*
    - **company**: 公司ID
      - 类型: *Long*
    
    ### <I> pageWorkshop

        分页方式获取车间信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 车间信息列表 , 每条数据类型 *workshop*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> queryWorkshop

        获取车间信息
        
        按照公司作为默认条件查询
        
                |Returns:|
                - **workshops**: 车间信息列表 , 每条数据类型 *workshop*
          - 类型: *List*
        
        Example::
        
            {
                "workshop": 
                    {
                        "wsid": 1,
                        "name": "油漆车间"
                    },
                ...
            }
    
    ### <I> addWorkshop

        添加车间信息
        
                |Requests:|
                :param workshop.name: 车间名称
        :type workshop.name: String
        
        
        Example::
        
            {
                "workshop.name": "油漆车间",
            }
        
    ### <I> updateWorkshop

        更新车间信息
        
        判断车间信息是否存在 , 不存在更新失败 , 错误信息 **220016 车间不存在**
        
                |Requests:|
                :param workshop.wsid: 车间ID
        :type workshop.wsid: Long
        :param workshop.name: 名称
        :type workshop.name: String
        
        Example::
        
            {
                "wsid": 1,
                "name": "新油漆车间",
            }
            
    ### <I> updateWorkshopForStatus

        更新车间状态
        
        判断车间信息是否存在 , 不存在更新失败 , 错误信息 **220016 车间不存在**
        
                |Requests:|
                :param workshop.wsid: 车间ID
        :type workshop.wsid: Long
        :param workshop.status: 状态
        :type workshop.status: Short
        
        Example::
        
            {
                "wsid": 1,
                "status": 0
            }
            
## 工序

## api.production.WorkflowAction

        |DataType:|
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

    ### <I> pageWorkflow

        分页方式获取工序信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 工序信息列表 , 每条数据类型 *workflow*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> queryWorkflow

        获取工序信息
        
        按照公司作为默认条件查询
        
                |Returns:|
                - **workflows**: 工序信息项 , 数据类型 *workflow*
          - 类型: *List*
        
        Example::
        
            {
                "workflows": [
                    {
                        "wfid": 1,
                        "name": "裁边",
                    }
                ]
                ...
            }
    
    ### <I> addWorkflow

        添加工序信息
        
        工序归属公司跟随操作人变化
        
                |Requests:|
                :param workflow.name: 工序名称
        :type workflow.name: String
        
        Example::
        
            {
                "workflow.name": "裁边",
            }
        
    ### <I> updateWorkflow

        更新工序信息
        
        判断工序是否存在 , 不存在更新失败 , 错误信息 **210017 工序不存在**
        
                |Requests:|
                :param workflow.wfid: 工序ID
        :type workflow.wfid: Long
        :param workflow.name: 名称
        :type workflow.name: String
        
        Example::
        
            {
                "wfid": 1,
                "name": "裁边",
            }
            
    ### <I> updateWorkflowForStatus

        更新工序状态
        
        判断工序是否存在 , 不存在更新失败 , 错误信息 **210017 工序不存在**
        
                |Requests:|
                :param workflow.wfid: 工序ID
        :type workflow.wfid: Long
        :param workflow.status: 状态
        :type workflow.status: Short
        
        Example::
        
            {
                "wfid": 1,
                "status": 0
            }
    
## 工序组

## api.production.WorkplanAction

        |DataType:|
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

    ### <I> pageWorkplan

        分页方式获取车间信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 工序组信息列表 , 每条数据类型 :data: workplan
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> queryWorkplan

        获取工序组信息
        
        按照公司作为默认条件查询
        
                |Returns:|
                - **workplans**: 工序组信息列表 , 每条数据类型 *workplan*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> queryWorkplanByWsid

        通过车间ID查询工序组信息
        
        按照公司作为默认条件查询
        
                |Requests:|
                :param workplan.workshop.wsid: 车间ID
        :type workplan.workshop.wsid: Long
        
        Example::
        
            {
                "workplan.workshop.wsid": "1"
            }
        
                |Returns:|
                - **workplans**: 工序组信息列表 , 每条数据类型 *workplan*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> addWorkplan

        添加工序组信息
        
        工序归属公司跟随操作人变化
        
                |Requests:|
                :param workplan.name: 工序组名称
        :type workplan.name: String
        :param workplan.comment: 备注
        :type workplan.comment: String
        :param workplan.workshop.wsid: 车间ID
        :type workplan.workshop.wsid: Long
        
        Example::
        
            {
                "workplan.name": "第一工序组",
                "workplan.comment": "",
                "workplan.workshop.wsid": 1,
            }
        
    ### <I> updateWorkplan

        更新工序组信息
        
        判断工序组是否存在 , 不存在更新失败 , 错误信息 **220018 工序组不存在**
        
                |Requests:|
                :param workplan.wpid: 工序组ID
        :type workplan.wpid: Long
        :param workplan.name: 工序组名称
        :type workplan.name: String
        :param workplan.comment: 备注信息
        :type workplan.comment: String
        :param workplan.workshop.wsid: 车间ID 
        :type workplan.workshop.wsid: Long
        
        Example::
        
            {
                "workplan.wpid": 1,
                "workplan.name": "第一工序组",
                "workplan.comment": "",
                "workplan.workShop.wsid": 1
            }
    
    ### <I> updateWorkplanForStatus

        更新工序组状态
        
        判断工序组是否存在 , 不存在更新失败 , 错误信息 **220018 工序组不存在**
        
                |Requests:|
                :param workplan.wpid: 工序组ID
        :type workplan.wpid: Long
        :param workplan.status: 状态 , 0: 启用 , 1: 禁用
        :type workplan.status: Short
        
        Example::
        
            {
                "workplan.wsid": 1,
                "workplan.status": 1
            }
            
## 工序组-工序

## api.production.WorkFlowPlanAction

        |DataType:|
        #### workflowPlan

    - **wfpid**: ID
      - 类型: *Long*
    - **workflow**: 工序 , 类型[workflow](./production.html#api.production.WorkflowAction.workflow)
      - 类型: *Object*
    - **workplan**: 工序组 , 类型[workplan](./production.html#api.production.WorkplanAction.workplan)
      - 类型: *Object*

    ### <I> queryWorkflowPlanByWfid

        通过工序ID查询与之相关工序组
        
                |Requests:|
                :param workflowPlan.workflow.wfid: 工序ID
        :type workflowPlan.workflow.wfid: Long
        
        Example::
        
            {
                "workflowPlan.workflow.wfid": 1,
            }
        
                |Returns:|
                - **workflowPlans**: 工序组-工序信息列表, 每条数据类型 *workflowPlan*
          - 类型: *List*
        
        Example::
        
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
    
    ### <I> queryWorkflowPlanByWpid

        通过工序组ID查询与之相关工序
        
                |Requests:|
                :param workflowPlan.workflow.wpid: 工序组ID
        :type workflowPlan.workflow.wpid: Long
        
        Example::
        
            {
                "workflowPlan.workplan.wpid": 1,
            }
        
                |Returns:|
                - **workflowPlans**: 工序组与工序关系列表, 每条数据类型 :data: workflowPlan
          - 类型: *List*
        
        Example::
        
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

    ### <I> updateWorkflowPlan

        更新工序到工序组
        
        判断工序组是否存在 , 不存在更新失败 , 错误信息 **220018 工序组不存在**
        
        删除工序组原关联工序信息 , 之后更新工序组对应的工序信息
        
                |Requests:|
                :param workflowPlan.workplan.wfpid: 工序组ID
        :type workflowPlan.workplan.wfpid: Long
        :param wfids[n]: 工序ID列表 , 每条数据类型 Long
        :type wfids[n]: List
        
        Example::
        
            {
                "workFlowPlan.workplan.wfpid": 1,
                "wfids[0]": 1
            }

## 人员-工序

## api.production.UserWorkflowAction

        |DataType:|
        #### userWorkflow

    - **uwid**: 工序组ID
      - 类型: *Long*
    - **uid**: 人员ID
      - 类型: *Long*
    - **workflow**: 工序,类型[workflow](./production.html#api.production.WorkflowAction.workflow)
      - 类型: *Object*
    
    ### <I> queryUserWorkflowByUid

        通过员工ID查询与之相关工序
        
                |Requests:|
                :param userWorkFlow.uid: 员工ID
        :type userWorkFlow.uid: Long
        
        Example::
        
            {
                "userWorkFlow.uid": 34,
            }
        
                |Returns:|
                - **userWorkflows**: 员工与工序关系列表, 每条数据类型 *userWorkflow*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> updateUserWorkflow

        更新员工对应的工序
        
        判断员工是否存在 , 不存在更新失败 , 错误信息 **190005 人员不存在**
        
        删除员工原关联工序信息 , 之后更新人员对应的工序信息
        
                |Requests:|
                :param userWorkflow.uid: 员工ID
        :type userWorkflow.uid: Long
        :param wfids[n]: 工序ID列表 , 每条数据类型 Long
        :type wfids[n]: List
        
        Example::
        
            {
                "userWorkflow.uid": 1,
                "wfids[0]": 1
            }
            
## 报价类型

## api.production.QuoteTypeAction

        |DataType:|
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
  
    ### <I> pageQuoteType

        分页方式获取报价类型信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 报价类型信息列表 , 每条数据类型 *quoteType*
        :type paging.data: List
        
        Example::
        
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
    
    ### <I> queryQuoteType

        通过品类名称查询报价类型
        
                |Returns:|
                - **quoteTypes**: 报价类型信息 , 类型 :data: `quoteType`
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> addQuoteType

        添加报价类型
        
                |Requests:|
                :param quoteType.name:名称
        :type quoteType.name: String
        
        Example::
        
            {
               "quoteType.name": "板式家具"
            }
        
    ### <I> updateQuoteType

        更新报价类型
        
        判断报价类型是否存在 , 不存在更新失败 , 错误信息 **220020 报价类型不存在**

                |Requests:|
                :param quoteType.qtid: 报价类型ID
        :type quoteType.qtid: Long
        :param quoteType.name: 名称
        :type quoteType.name: String
        
        Example::
        
            {
                "quoteType.qtid": 1,
                "quoteType.name": "板式家具"
            }
            
    ### <I> updateQuoteTypeForStatus

        更新报价类型状态
        
        判断报价类型是否存在 , 不存在更新失败 , 错误信息 **220020 报价类型不存在**

                |Requests:|
                :param quoteType.qtid: 报价类型ID
        :type quoteType.qtid: Long
        :param quoteType.status: 状态
        :type quoteType.status: Short
        
        Example::
        
            {
                "quoteType.qtid": 1,
                "quoteType.status": 1
            }
            
## 报价项

## api.production.QuoteItemAction

        |DataType:|
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

    ### <I> pageQuoteItem

        分页方式获取报价项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 报价项信息列表 , 每条数据类型 *quoteItem*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> queryQuoteItemByPinyin

        通过拼音查询报价项数据
        
        按照公司作为默认条件查询
        
                |Requests:|
                :param quoteItem.pinyin: 拼音
        :type quoteItem.pinyin: String
        
        Example::
        
            {
                "quoteItem.pinyin": "dingban"
            }
        
                |Returns:|
                - **quoteItems**: 报价项信息 , 类型 *quoteItem*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> addQuoteItem

        添加报价项数据
        
        工序归属公司跟随操作人变化
        
                |Requests:|
                :param quoteItem.name: 报价项名称
        :type quoteItem.name: String
        :param quoteItem.pinyin: 拼音
        :type quoteItem.pinyin: String
        :param quoteItem.format: 型号
        :type quoteItem.format: String
        :param quoteItem.measurementunit: 单位
        :type quoteItem.measurementunit: String
        :param quoteItem.unitprice: 单价
        :type quoteItem.unitprice: Integer
        :param quoteItem.quoteType.qtid: 品类ID
        :type quoteItem.quoteType.qtid: Long
        
        Example::
        
            {
                "quoteItem.name": "顶板",
                "quoteItem.pinyin": "dingban",
                "quoteItem.format": "zx-1",
                "quoteItem.measurementunit": "个",
                "quoteItem.unitprice": 10000,
                "quoteItem.quoteType.qtid": 1,
            }
        
    ### <I> updateQuoteItem

        更新报价项信息
        
        判断报价项是否存在 , 不存在更新失败 , 错误信息 **220019 报价项不存在**
        
                |Requests:|
                :param quoteItem.qiid: 报价项ID
        :type quoteItem.qiid: Long
        :param quoteItem.name: 报价项名称
        :type quoteItem.name: String
        :param quoteItem.pinyin: 拼音
        :type quoteItem.pinyin: String
        :param quoteItem.format: 型号
        :type quoteItem.format: String
        :param quoteItem.measurementunit: 单位
        :type quoteItem.measurementunit: String
        :param quoteItem.unitprice: 单价
        :type quoteItem.unitprice: Integer
        :param quoteItem.quoteType.qtid: 品类ID
        :type quoteItem.quoteType.qtid: Long
        
        Example::
        
            {
                "quoteItem.qiid": "1",
                "quoteItem.name": "顶板",
                "quoteItem.pinyin": "dingban",
                "quoteItem.format": "zx-1",
                "quoteItem.measurementunit": "个",
                "quoteItem.unitprice": 10000,
                "quoteItem.quoteType.qtid": 1,
            }
    
    ### <I> updateQuoteItemForStatus

        更新报价项状态
        
        判断报价项是否存在 , 不存在更新失败 , 错误信息 **220019 报价项不存在**
        
                |Requests:|
                :param quoteItem.qiid: 报价项ID
        :type quoteItem.qiid: Long
        :param quoteItem.status: 报价项状态
        :type quoteItem.status: Short
        
        Example::
        
            {
                "quoteItem.qiid": 1,
                "quoteItem.status": 0
            }
        
## 生产单

## api.production.ProductionAction

        |DataType:|
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
    
    ### <I> pageProduction

        分页方式获取生产单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        按照公司作为默认条件查询
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 生产单信息列表 , 每条数据类型 *production*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> addProduction

        添加生产单
        
        工序归属公司跟随操作人变化
        
                |Requests:|
                :param production.orderId: 装修单号
        :type production.orderId: String
        :param production.house.hid: 房产ID
        :type production.house.hid: Long
        :param production.total: 总价
        :type production.total: Long
        :param production.designer.uid: 设计师ID
        :type production.designer.uid: Long
        :param production.salesman.uid: 销售员ID
        :type production.salesman.uid: Long
        :param production.spliter.uid: 拆单员ID
        :type production.spliter.uid: Long
        :param production.timeLimit: 工期
        :type production.timeLimit: Integer
        
        Example::
        
            {
                "production.orderId": "1608010000",
                "production.house.hid": 1,
                "production.total" 12000000,
                "production.designer.uid": 2,
                "production.salesman.uid": 2,
                "production.spliter.uid": 2,
                "production.timeLimit": 90000
            }
            
    ### <I> updateProduction

        更新生产单
        
        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**
        
        判断生产单状态 , 0(初始)之外的其他状态 , 不可修改设计师 ; 0(初始)和1(设计)之外的其他状态 , 不可修改拆单员
        
                |Requests:|
                :param production.pid: 生产单ID
        :type production.pid: Long
        :param production.designer.uid: 设计师ID
        :type production.designer.uid: Long
        :param production.salesman.uid: 销售员ID
        :type production.salesman.uid: Long
        :param production.spliter.uid: 拆单员ID
        :type production.spliter.uid: Long
        
        Example::
        
            {
                "production.pid": 1,
                "production.designer.uid": 2,
                "production.salesman.uid": 2,
                "production.spliter.uid": 2
            }
            
    ### <I> updateProductionForAdvance

        更新生产单 , 高级操作
        
        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**
        
                |Requests:|
                :param production.pid: 生产单ID
        :type production.pid: Long
        :param production.designer.uid: 设计师ID
        :type production.designer.uid: Long
        :param production.salesman.uid: 销售员ID
        :type production.salesman.uid: Long
        :param production.spliter.uid: 拆单员ID
        :type production.spliter.uid: Long
        :param production.timeLimit: 工期
        :type production.timeLimit: Integer
        
        Example::
        
            {
                "production.pid": 1,
                "production.designer.uid": 2,
                "production.salesman.uid": 2,
                "production.spliter.uid": 2,
                "production.timeLimit": 10000
            }
            
    ### <I> designProduction

        生产单进入设计阶段
        
        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**
        
        判断生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**
        
        更新生产单状态为1(设计) , 更新设计时间 , 更新生产单更新时间
        
                |Requests:|
                :param production.pid: 生产单ID
        :type production.pid: Long
        
        Example::
        
            {
                "production.pid": 1
            }
    
    ### <I> splitProduction

        生产单进入生产(拆单)阶段
        
        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**
        
        判断生产单状态1(设计) , 其他状态 , 错误信息 **220002 生产单状态不可操作**
        
        更新生产单状态为2(生产) , 更新拆单时间 , 更新生产单更新时间
        
                |Requests:|
                :param production.pid: 生产单ID
        :type production.pid: Long
        
        Example::
        
            {
                "production.pid": 1
            }
    
    ### <I> instoreProduction

        生产单进入仓储阶段
        
        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**
        
        判断生产单状态2(生产) , 其他状态 , 错误信息 **220002 生产单状态不可操作**
        
        更新生产单状态为3(仓库) , 更新仓储时间 , 更新生产单更新时间
        
                |Requests:|
                :param production.pid: 生产单ID
        :type production.pid: Long
        
        Example::
        
            {
                "production.pid": 1
            }
            
    ### <I> planProduction

        生产单进入物流阶段
        
        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**
        
        判断生产单状态3(仓库) , 其他状态 , 错误信息 **220002 生产单状态不可操作**
        
        更新生产单状态为4(物流) , 更新物流时间 , 更新生产单更新时间
        
        更新生产单关联的物流包状态为2(物流) , 同时需要判断物流包状态是否存在0(初始) , 错误信息 220025 物流包状态不可操作
        
                |Requests:|
                :param production.pid: 生产单ID
        :type production.pid: Long
        
        Example::
        
            {
                "production.pid": 1
            }
            
    ### <I> tranProduction

        生产单进入运输阶段
        
        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**
        
        判断生产单状态4(物流) , 其他状态 , 错误信息 **220002 生产单状态不可操作**
        
        更新生产单状态为5(运输) , 更新安装时间 , 更新生产单更新时间
        
                |Requests:|
                :param production.pid: 生产单ID
        :type production.pid: Long
        
        Example::
        
            {
                "production.pid": 1
            }
    
    ### <I> mountProduction

        生产单进入物流阶段
        
        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**
        
        判断生产单状态5(运输) , 其他状态 , 错误信息 **220002 生产单状态不可操作**
        
        更新生产单状态为6(安装) , 更新安装时间 , 更新生产单更新时间
        
                |Requests:|
                :param production.pid: 生产单ID
        :type production.pid: Long
        
        Example::
        
            {
                "production.pid": 1
            }
    
    ### <I> finishProduction

        完结生产单
        
        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**
        
        判断生产单状态6(安装)/8(售后) , 其他状态 , 错误信息 **220002 生产单状态不可操作**
        
        更新生产单状态为7(完成) , 更新生产单更新时间
        
                |Requests:|
                :param production.pid: 生产单ID
        :type production.pid: Long
        
        Example::
        
            {
                "production.pid": 1
            }
            
    ### <I> upholdProduction

        售后生产单
        
        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**
        
        判断生产单状态7(完成) , 其他状态 , 错误信息 **220002 生产单状态不可操作**
        
        更新生产单状态为8(售后) , 更新生产单更新时间
        
                |Requests:|
                :param production.pid: 生产单ID
        :type production.pid: Long
        
        Example::
        
            {
                "production.pid": 1
            }
    
    ### <I> terminalProduction

        生产单废单
        
        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**
        
        判断生产单状态为0(初始)/1(设计) , 其他状态 , 错误信息 **220002 生产单状态不可操作**
        
        更新生产单状态为10(废单) , 更新完结时间 , 更新生产单更新时间
        
                |Requests:|
                :param production.pid: 生产单ID
        :type production.pid: Long
        
        Example::
        
            {
                "production.pid": 1
            }

## 生产销售

生产单关联的销售单信息

## api.production.ProductionSalesAction

        |DataType:|
        #### productionSales

    - **psid**: 生产销售ID
      - 类型: *Long*
    - **pid**: 生产单ID
      - 类型: *Long*
    - **sid**: 销售单ID
      - 类型: *Long*

    ### <I> queryProductionSalesByPid

        查询生产单中所有的生产销售单
        
                |Requests:|
                :param production.pid: 生产单ID
        :type production.pid: Long
        
        Example::
        
            {
                "production.pid": 1,
            }
            
                |Returns:|
                - **productionSales**: 生产销售单 , 每条数据类型 *productionSales*
          - 类型: *List*
        
        Example::
        
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
    
    ### <I> bindProductionSales

        绑定生产单与销售单关联关系
        
        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**
        
        判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**
        
        更新关联生产单更新时间
        
                |Requests:|
                :param productionSales.pid: 生产单ID
        :type productionSales.pid: Long
        :param productionSales.sid: 销售单ID
        :type productionSales.sid: Long
        
        Example::
        
            {
                "productionSales.pid": 1,
                "productionSales.sid": 1
            }
            
## 报价

## api.production.PuotationAction

        |DataType:|
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
    
    ### <I> queryPuotationByPid

        通过生产单ID查询报价
        
                |Requests:|
                :param puotation.pid: 生产单ID
        :type puotation.pid: Long
        
        Example::
        
            {
                "puotation.pid": 1,
            }
            
                |Returns:|
                - **puotations**: 报价信息列表, 数据类型 *puotation*
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I> queryPuotationItemByQid

        通过报价ID获取报价项
        
                |Requests:|
                :param puotation.qid: 报价ID
        :type puotation.qid: Long
        
        Example::
        
            {
                "puotation.qid": 1,
            }
            
                |Returns:|
                - **puotationItems**: 报价项列表, 数据类型 *puotationItem*
          - 类型: *List*
        
        Example::
        
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
    
    ### <I> addPuotation

        创建报价信息
        
        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**
        
        判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**
        
        更新关联生产单更新时间
        
                |Requests:|
                :param puotation.pid: 生产单ID
        :type puotation.pid: Long
        :param puotation.name: 报价名称
        :type puotation.name: String
        
        Example::
        
            {
                "production.pid": 1,
                "puotation.name": "一号报价"
            }
            
    ### <I> addPuotationItem

        添加报价项
        
        判断报价是否存在 , 不存在更新失败 , 错误信息 **220014 报价不存在**
        
        判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**
        
        更新关联生产单更新时间
        
                |Requests:|
                :param puotationItem.qid: 报价ID
        :type puotationItem.qid: Long
        :param puotationItem.name: 报价项名称
        :type puotationItem.name: String
        :param puotationItem.format: 规格
        :type puotationItem.format: String
        :param puotationItem.height: 高度
        :type puotationItem.height: Integer
        :param puotationItem.width: 宽度
        :type puotationItem.width: Integer
        :param puotationItem.thick: 厚度
        :type puotationItem.thick: Integer
        :param puotationItem.num: 数量
        :type puotationItem.num: Integer
        :param puotationItem.unitPrice: 单价
        :type puotationItem.unitPrice: Integer
        :param puotationItem.measurementUnit: 单位
        :type puotationItem.measurementUnit: String
        :param puotationItem.total: 总价
        :type puotationItem.total: Long
        :param puotationItem.comment: 备注
        :type puotationItem.comment: String
        :param puotationItem.specil: 特型
        :type puotationItem.specil: String
        :param puotationItem.quoteType: 报价类型
        :type puotationItem.quoteType: String
        
        Example::
        
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
            
    ### <I> updatePuotation

        更新报价信息
        
        判断报价是否存在 , 不存在更新失败 , 错误信息 **220014 报价不存在**
        
        判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**
        
                |Requests:|
                :param puotation.qid: 报价ID
        :type puotation.qid: Long
        :param puotation.name: 名称
        :type puotation.name: String
        :param puotation.comment: 说明
        :type puotation.comment: String
        
        Example::
        
            {
                "puotation.qid": 1,
                "puotation.name": "名字",
                "puotation.comment": "说明"
            }
            
    ### <I> updatePuotationForAdvance

        更新报价信息
        
        判断报价是否存在 , 不存在更新失败 , 错误信息 **220014 报价不存在**
        
        判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**
        
                |Requests:|
                :param puotation.qid: 报价ID
        :type puotation.qid: Long
        :param puotation.discount: 折扣
        :type puotation.discount: Integer
        :param puotation.total: 总价
        :type puotation.total: Long
        
        Example::
        
            {
                "puotation.qid": 1,
                "puotation.total": 100000,
                "puotation.discount": 10000
            }
            
    ### <I> updatePuotationForDefault

        更新默认报价
        
        判断报价是否存在 , 不存在更新失败 , 错误信息 **220014 报价不存在**
        
        判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**
        
        遍历所有报价 , 更换默认报价信息
        
                |Requests:|
                :param puotation.qid: 报价ID
        :type puotation.qid: Long
        
        Example::
        
            {
                "puotation.qid": 1
            }
    
    ### <I> deletePuotation

        删除报价
        
        判断报价是否存在 , 不存在更新失败 , 错误信息 **220014 报价不存在**
        
        判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**
        
        删除报价信息同时 , 删除归属报价的报价项信息
        
                |Requests:|
                :param puotation.qid: 报价ID
        :type puotation.qid: Long
        
        Example::
        
            {
                "puotation.qid": 1
            }
 
    ### <I> deletePuotationItem

        删除报价项
        
        判断报价项是否存在 , 不存在删除失败 , 错误信息 **220015 报价中报价项不存在**
        
        判断关联生产单状态0(初始) , 其他状态 , 错误信息 **220002 生产单状态不可操作**
        
                |Requests:|
                :param puotationItem.qiid: 报价项ID
        :type puotationItem.qiid: Long
        
        Example::
        
            {
                "puotationItem.qiid": 1
            }
            
## 图纸

图纸信息管理

## api.production.ProductionPictureAction

        |DataType:|
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
      
    ### <I> queryProductionPictureByPid

        查询生产单下的图纸
        
                |Requests:|
                :param productionPicture.pid: 生产单ID
        :type productionPicture.pid: Long
        
        Example::
        
            {
                "productionPicture.pid": 1,
            }
            
                |Returns:|
                - **productionPictures**: 图纸列表 , 每条数据类型 *productionPicture*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> addProductionPicture

        新增图纸信息
        
        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**
        
        判断关联生产单状态1(设计) , 其他状态 , 错误信息 **220002 生产单状态不可操作**
        
        更新关联生产单更新时间
        
                |Requests:|
                :param productionPicture.pid: 生产单ID
        :type productionPicture.pid: Long
        :param productionPicture.name: 名称
        :type productionPicture.name: String
        :param productionPicture.path: 路径
        :type productionPicture.path: String
        :param productionPicture.type: 类型
        :type productionPicture.type: Short
        :param productionPicture.comment: 备注
        :type productionPicture.comment: String
        
        Example::
        
            {
                "productionPicture.pid": 1,
                "productionPicture.name": "橱柜CAD图",
                "productionPicture.path": "00/00/OIJASDF7ASDLFKJASD7FSDFJKL.xls",
                "productionPicture.type": 0,
                "productionPicture.comment": ""
            }
        
    ### <I> deleteProductionPicture

        删除图纸信息
        
        判断图纸是否存在 , 不存在 , 错误信息 **220003 图纸不存在**
        
        判断关联生产单状态1(设计) , 其他状态 , 错误信息 **220002 生产单状态不可操作**
        
                |Requests:|
                :param productionPicture.ppid: 图纸ID
        :type productionPicture.ppid: Long
        
        Example::
        
            {
                "productionPicture.pid": 1
            }

## 外协单

## api.production.OutsourceAction

        |DataType:|
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
    
    ### <I> pageOutsource

        分页方式获取外协单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 外协单信息列表 , 每条数据类型 *outsource*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> pageOutsourceForSupplier

        分页方式获取外协单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        厂商信息限定为当前操作人员相关信息
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 外协单信息列表 , 每条数据类型 *outsource*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> queryOutsourceByPid

        通过生产单ID获取外协单
        
                |Requests:|
                :param outsource.production.pid: 生产单ID
        :type outsource.production.pid: Long
        
                |Returns:|
                - **outsources**: 外协单信息列表 , 每条数据类型 *outsource*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> addOutsource

        创建外协单
        
        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**
        
        判断关联生产单状态2(生产) , 其他状态 , 错误信息 **220002 生产单状态不可操作**
        
                |Requests:|
                :param outsource.production.pid: 生产单ID
        :type outsource.production.pid: Long
        :param outsource.supplier.uid: 厂商ID
        :type outsource.supplier.uid: Long
        :param outsource.comment: 备注
        :type outsource.comment: String
        
        Example::
        
            {
                "outsource.production.pid": 1,
                "outsource.comment": "说明"
            }
    ### <I> updateOutsource

        更新外协单
        
        判断外协单是否存在 , 不存在 , 错误信息 **220006 外协单不存在**
        
                |Requests:|
                :param outsource.oid: 外协单ID
        :type outsource.oid: Long
        :param outsource.path: 路径
        :type outsource.path: String
        :param outsource.comment: 说明
        :type outsource.comment: String
        
        Example::
        
            {
                "outsource.osid": 1,
                "outsource.path": "00/00/OIJASDF7ASDLFKJASD7FSDFJKL.xls",
                "outsource.comment": "说明"
            }

    ### <I> receiptOutsource

        接收外协单
        
        判断外协单是否存在 , 不存在 , 错误信息 **220006 外协单不存在**
        
        判断外协单状态是否为0(初始) , 其他状态 , 错误信息 **220021 外协单状态不可操作**
        
        外协单状态更新为1(接收)
        
        更新关联生产单更新时间
        
                |Requests:|
                :param outsource.oid: 外协单ID
        :type outsource.oid: Long
        
        Example::
        
            {
                "outsource.osid": 1
            }
            
    ### <I> confirmOutsource

        确认外协单
        
        判断外协单是否存在 , 不存在 , 错误信息 **220006 外协单不存在**
        
        判断外协单状态是否为1(接收) , 其他状态 , 错误信息 **220021 外协单状态不可操作**
        
        外协单状态更新为2(确认)
        
        更新关联生产单更新时间
        
                |Requests:|
                :param outsource.oid: 外协单ID
        :type outsource.oid: Long
        
        Example::
        
            {
                "outsource.osid": 1
            }

    ### <I> finishOutsource

        完结外协单
        
        判断外协单是否存在 , 不存在 , 错误信息 **220006 外协单不存在**
        
        判断外协单状态是否为2(确认) , 其他状态 , 错误信息 **220021 外协单状态不可操作**
        
        外协单状态更新为3(完结)
        
        关联生成对应数量的物流包信息
        
        更新关联生产单更新时间
        
                |Requests:|
                :param outsource.oid: 外协单ID
        :type outsource.oid: Long
        :param outsource.num: 物流包数量
        :type outsource.num: Integer
        
        Example::
        
            {
                "outsource.oid": 1,
                "outsource.num": 1
            }
            
    ### <I> deleteOutsource

        删除外协单
        
        判断外协单是否存在 , 不存在 , 错误信息 **220006 外协单不存在**
        
        判断外协单状态是否为0(初始) , 其他状态 , 错误信息 **220021 外协单状态不可操作**
        
        外协单状态更新为3(失效)
        
                |Requests:|
                :param outsource.oid: 外协单ID
        :type outsource.oid: Long
        
        Example::
        
            {
                "outsource.oid": 1
            }

    ### <I> pageOutsourceItemByOid

        通过外协单ID分页方式获取外协项信息
        
                |Requests:|
                :param outsourceItem.oid: 外协单ID
        :type outsourceItem.oid: Long
        
        Example::
        
            {
                "outsourceItem.oid": 1    
            }
            
                |Returns:|
                - **outsourceItems**: 外协项列表 , 每条数据类型 *outsourceItem*
          - 类型: *List*
        
        Example::
        
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

    ### <I> addOutsourceItem

        添加外协项信息
        
        判断外协单是否存在 , 不存在 , 错误信息 **220006 外协单不存在**
        
                |Requests:|
                :param outsource.oid: 外协项ID
        :type outsource.oid: Long
        :param outsourceItem.height: 高
        :type outsourceItem.height: Integer
        :param outsourceItem.width: 宽
        :type outsourceItem.width: Integer
        :param outsourceItem.thick: 厚
        :type outsourceItem.thick: thick
        :param outsourceItem.modelling: 造型
        :type outsourceItem.modelling: String
        :param outsourceItem.unitprice: 单价
        :type outsourceItem.unitprice: Integer
        :param outsourceItem.num: 数量
        :type outsourceItem.num: Integer
        :param outsourceItem.total: 总价
        :type outsourceItem.total: Long
        :param outsourceItem.comment: 备注
        :type outsourceItem.comment: String
        
        Example::
        
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

    ### <I> deleteOutsourceItem

        删除外协项信息
        
        判断外协项是否存在  ,不存在删除失败 , 错误信息 **220007 外协项不存在**
        
                |Requests:|
                :param outsourceItem.oiid: 外协项ID
        :type outsourceItem.oiid: Long
        
        Example::
        
            {
                "outsourceItem.oiid": 1,
            }

## 五金单

## api.production.HardwareAction

        |DataType:|
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
    
    ### <I> pageHardware

        分页方式获取五金单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 五金单信息列表 , 每条数据类型 *hardware*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> queryHardwareByPid

        通过生产单ID获取五金单
        
                |Requests:|
                :param hardware.production.pid: 生产单ID
        :type hardware.production.pid: Long
        
        Example::
        
            {
                "hardware.production.pid": 1
            }
            
                |Returns:|
                - **hardwares**: 五金单信息列表 , 每条数据类型 *hardware*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> addHardware

        创建五金单
        
        判断生产单是否存在 , 错误信息 **220001 生产单不存在**
        
        判断关联生产单状态2(生产) , 其他状态 , 错误信息 **220002 生产单状态不可操作**
        
        更新关联生产单更新时间
        
                |Requests:|
                :param hardware.production.pid: 生产单ID
        :type hardware.production.pid: Long
        :param hardware.status: 状态
        :type hardware.status: Short
        :param hardware.comment: 说明
        :type hardware.comment: String
        
        Example::
        
            {
                "hardware.production.pid": 1,
                "hardware.status": 1,
                "hardware.comment": "说明"
            }
            
    ### <I> updateHardware

        更新五金单信息
        
        判断五金单是否存在 , 错误信息 **220004 五金单不存在**
        
        更新关联生产单更新时间
        
                |Requests:|
                :param hardware.hid: 五金单ID
        :type hardware.hid: Long
        :param hardware.comment: 说明
        :type hardware.comment: String
        :param hardware.path: 路径
        :type hardware.path: String
        
        Example::
        
            {
                "hardware.hid": 1,
                "hardware.comment": 1,
                "hardware.path": 1
            }
            
    ### <I> instoreHardware

        五金单进入仓储阶段
        
        判断五金单是否存在 , 错误信息 **220004 五金单不存在**
        
        判断五金单状态为1(采购) , 其他状态 , 错误信息 **220022 五金单状态不可操作**
        
        更新关联生产单更新时间
        
                |Requests:|
                :param hardware.hid: 五金单ID
        :type hardware.hid: Long
        
        Example::
        
            {
                "hardware.hid": 1
            }
            
    ### <I> finishHardware

        完结五金单
        
        判断五金单是否存在 , 错误信息 **220004 五金单不存在**
        
        判断五金单状态是否为2(仓库) , 其他状态 , 错误信息 **220021 外协单状态不可操作**
        
        外协单状态更新为3(完结)
        
        关联生成对应数量的物流包信息
        
        更新关联生产单更新时间
        
                |Requests:|
                :param hardware.hid: 五金单ID
        :type hardware.hid: Long
        :param hardware.num: 物流包数量
        :type hardware.num: Integer
        
        Example::
        
            {
                "hardware.hid": 1,
                "hardware.num": 1
            }
            
    ### <I> deleteHardware

        删除五金单
        
        判断五金单是否存在 , 不存在更新失败 , 错误信息 **220004 五金单不存在**
        
        判断五金单状态是0(初始)/1(采购) , 其他状态 , 错误信息 **220022 五金单状态不可操作**
        
                |Requests:|
                :param hardware.hid: 五金单ID
        :type hardware.hid: Long
        
        Example::
        
            {
                "hardware.hid": 1
            }
            
    ### <I> pageHardwareItemByHid

        分页方式获取五金项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Requests:|
                :param hardwareItem.hid: 生产单ID
        :type hardwareItem.hid: Long
        
        Example::
        
            {
                "hardwareItem.hid": 1
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 五金项信息列表 , 每条数据类型 *hardwareItem*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> addHardwareItem

        添加五金项到五金单
        
        判断五金单是否存在 , 不存在更新失败 , 错误信息 **220004 五金单不存在**
        
                |Requests:|
                :param hardwareItem.hid: 五金单ID
        :type hardwareItem.hid: Long
        :param hardwareItem.name: 说明
        :type hardwareItem.name: String
        :param hardwareItem.num: 数量
        :type hardwareItem.num: Integer
        :param hardwareItem.unitprice: 单价
        :type hardwareItem.unitprice: Integer
        :param hardwareItem.total: 总价
        :type hardwareItem.total: Long
        :param hardwareItem.measurementunit: 单位
        :type hardwareItem.measurementunit: String
        :param hardwareItem.comment: 说明
        :type hardwareItem.comment: String
        
        Example::
        
            {
                "hardwareItem.hid": 1,
                "hardwareItem.name": "名称",
                "hardwareItem.num": 1,
                "hardwareItem.unitprice": 100000,
                "hardwareItem.total": 100000,
                "hardwareItem.nameasurementunitme": "个",
                "hardwareItem.comment": "说明"
            }
            
    ### <I> deleteHardwareItem

        删除五金项信息
        
        判断五金项是否存在 , 不存在删除失败 , 错误信息 **220005 五金项不存在**
        
                |Requests:|
                :param hardwareItem.hiid: 五金项ID
        :type hardwareItem.hiid: Long
        
        Example::
        
            {
                "hardwareItem.hiid": 1,
            }

## 生产计划

### 生产计划单

## api.production.ProductionPlanAction

        |DataType:|
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
    
    ### <I> pageProductionPlan

        分页方式获取计划信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 计划信息列表 , 每条数据类型 *productionPlan*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> queryProductionPlanByPid

        通过生产单ID获取生产计划
        
                |Requests:|
                :param productionPlan.production.pid: 生产单ID
        :type productionPlan.production.pid: Long
        
        Example::
        
            {
                "productionPlan.production.pid": 1,
            }
        
                |Returns:|
                - **productionPlans**: 计划表 , 每条数据类型 *productionPlan*
          - 类型: *List*
        
        Example::
        
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
    
    ### <I> addProductionPlan

        创建生产计划
        
        判断生产单是否存在 , 不存在 , 错误信息 **220001 生产单不存在**
        
        判断关联生产单状态2(生产) , 其他状态 , 错误信息 **220002 生产单状态不可操作**
        
        更新关联生产单更新时间
        
                |Requests:|
                :param productionPlan.production.pid: 生产单ID
        :type productionPlan.production.pid: Long
        :param productionPlan.timeLimit: 工期
        :type productionPlan.timeLimit: Integer
        
        Example::
        
            {
                "productionPlan.production.pid": 1,
                "productionPlan.timeLimit": 10000
            }
            
    ### <I> updateProductionPlan

        更新计划
        
        判断计划是否存在 , 不存在更新失败 , 错误信息 **220008 计划不存在**

                |Requests:|
                :param productionPlan.ppid: 生产计划ID
        :type productionPlan.ppid: Long
        :param productionPlan.path: 路径
        :type productionPlan.path: String
        
        Example::
        
            {
                "productionPlan.ppid": 1,
                "productionPlan.path": "00/00/OIJASDF7ASDLFKJASD7FSDFJKL.xls",
            }
            
    ### <I> finishProductionPlan

        完结五金单
        
        判断计划是否存在 , 不存在更新失败 , 错误信息 **220008 计划不存在**
        
        判断计划状态是否为0(初始) , 其他状态 , 错误信息 **220021 外协单状态不可操作**
        
        生产计划状态更新为1(完结)
        
        关联生成对应数量的物流包信息
        
        更新关联生产单更新时间
        
                |Requests:|
                :param productionPlan.ppid: 五金单ID
        :type productionPlan.ppid: Long
        :param productionPlan.num: 物流包数量
        :type productionPlan.num: Integer
        
        Example::
        
            {
                "productionPlan.ppid": 1,
                "productionPlan.num": 1
            }
            
    ### <I> pageProductionPlanItemByPpid

        分页方式获取计划项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Requests:|
                :param productionPlanItem.ppid: 计划ID
        :type productionPlanItem.ppid: Long
        
        Example::
        
            {
                "productionPlanItem.ppid": 1
            }
            
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 计划项信息列表 , 每条数据类型 *productionPlanItem*
        :type paging.data: List
        
        Example::
        
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
        
    ### <I> addProductionPlanItem

        添加计划项信息
        
        判断计划是否存在 , 不存在更新失败 , 错误信息 **220008 计划不存在**
    
                |Requests:|
                :param productionPlanItem.ppid: 计划ID
        :type productionPlanItem.ppid: Long
        :param productionPlanItem.typeno: 类型编号
        :type productionPlanItem.typeNo: String
        :param productionPlanItem.name: 名称
        :type productionPlanItem.name: String
        :param productionPlanItem.height: 高
        :type productionPlanItem.height: Integer
        :param productionPlanItem.width: 宽
        :type productionPlanItem.width: Integer
        :param productionPlanItem.thick: 厚
        :type productionPlanItem.thick: Integer
        :param productionPlanItem.color: 颜色
        :type productionPlanItem.color: String
        :param productionPlanItem.unitprice: 单价
        :type productionPlanItem.unitprice: Integer
        :param productionPlanItem.num: 数量
        :type productionPlanItem.num: Integer
        :param productionPlanItem.total: 总价
        :type productionPlanItem.total: Long
        :param productionPlanItem.comment: 备注
        :type productionPlanItem.comment: String
        
        Example::
        
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

    ### <I> deleteProductionPlanItem

        删除生产单项信息
        
        判断计划项是否存在 , 不存在更新失败 , 错误信息 **220009 计划项不存在**
        
                |Requests:|
                :param productionPlanItem.ppiid: 计划项ID
        :type productionPlanItem.ppiid: Long
        
        Example::
        
            {
                "productionPlanItem.ppiid": 1,
            }
            
### 计划工序组

## api.production.ProductionWorkPlanAction

        |DataType:|
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
    
    ### <I> queryProductionWorkPlanByPpid

                |Requests:|
                :param productionWorkPlan.ppid: 计划ID
        :type productionWorkPlan.ppid: Long
        
        Example::
        
            {
                "productionWorkPlan.ppid": 1,
            }
        
                |Returns:|
                - **productionWorkPlans**: 计划项列表 , 每条数据类型 *productionworkplan*
          - 类型: *List*
        
        Example::
        
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
    
    ### <I> addProductionWorkPlan

        添加计划工序组
        
        判断计划是否存在 , 不存在更新失败 , 错误信息 **220008 计划不存在**
        
        判断计划中是否已经存在工序组 , 存在不能添加 , 错误信息 **220010 计划工序已存在**
        
        添加计划工序组同时 , 利用工序组中拥有工序完成计划工序数据的生成
    
                |Requests:|
                :param productionWorkPlan.ppid: 计划ID
        :type productionWorkPlan.ppid: Long
        :param productionWorkPlan.wpid: 工序组ID
        :type productionWorkPlan.wpid: Long
        
        Example::
        
            {
                "productionWorkPlan.ppid": 1,
                "productionWorkPlan.wpid": 1
            }
            
    ### <I> finishProductionWorkPlan

        完结计划工序组
        
        判断计划是否存在 , 不存在更新失败 , 错误信息 **220008 计划不存在**
        
        判断计划工序组是否存在 , 不存在 , 错误信息 **220026 计划工序组不存在**
        
        判断计划工序组状态是否为1(执行) , 其他状态 , 错误信息 **220011 生产计划工序组状态不可操作**
        
        判断计划工序组排序 , 非顺序完成计划组 , 错误信息 **220027 计划工序组执行顺序异常**
        
        更新计划工序组状态为2(完成)
        
                |Requests:|
                :param productionWorkPlan.wpid: 工序组ID
        :type productionWorkPlan.wpid: Long
        
        Example::
        
            {
                "productionWorkPlan.wpid": 1
            }
    
    ### <I> deleteProductionWorkPlan

        删计划工序组
        
        判断计划工序组状态 , 非初始不能删除 , 错误信息 **220011 计划工序组状态不可操作**
    
                |Requests:|
                :param productionWorkPlan.pwpid: ID
        :type productionWorkPlan.pwpid: Long
        
        Example::
        
            {
                "productionWorkPlan.pwpid": 1
            }
            
### 计划工序

## api.production.ProductionWorkFlowAction

        |DataType:|
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
    
    ### <I> queryProductionWorkFlowByPwpidAWfid

        通过计划涉工序组ID获取计划工序
        
                |Requests:|
                :param productionWorkFlow.pwpid: 计划工序组ID
        :type productionWorkFlow.pwpid: Long
        
        Example::
        
            {
                "productionWorkFlow.pwpid": 1
            }
            
                |Returns:|
                - **productionWorkFlows**: 计划工序, 数据类型 *productionWorkFlow*
          - 类型: *List*
        
        Example::
        
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
            
    ### queryProductionWorkFlowByPwpid

        通过计划工序组ID获取计划工序

                |Requests:|
                :param productionWorkFlow.pwpid: 计划工序组ID
        :type productionWorkFlow.pwpid: Long

        Example::

            {
                "productionWorkFlow.pwpid": 1
            }
            
                |Returns:|
                - **productionWorkFlows**: 单位信息列表 , 每条数据类型 *productionWorkFlows*
          - 类型: *List*

        Example::

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
    
    ### <I> operateProductionWorkFlow

        操作计划工序信息
        
        判断计划工序是否存在 , 不存在操作失败 , 错误信息 **220012 计划工序不存在**
        
        判断计划工序是否已经操作 , 已经操作不可再次操作 , 错误信息 **220013 计划工序不可操作**
        
        更新计划工序操作人以及操作时间
        
        判断归属工序组内工序全部完结 , 更新计划工序组状态为已操作1(已执行)
        
                |Requests:|
                :param productionWorkFlow.pwfid: 操作工人ID
        :type productionWorkFlow.pwfid: Long
        
        Example::
        
            {
                "productionWorkFlow.pwfid": 1
            }

### 计划工序-人员

## api.production.ProductionUserWorkflowAction

        |DataType:|
        #### productionUserWorkflow

    - **puwfid**: ID
      - 类型: *Long*
    - **pwfid**: 计划工序ID
      - 类型: *Long*
    - **operater**: 操作人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **operateTime**: 操作时间
      - 类型: *Timestamp*
    
    ### <I> queryProductionUserWorkFlowByPwfid

        通过计划工序ID获取计划工序-人员
        
                |Requests:|
                :param productionUserWorkFlow.pwfid: 计划工序ID
        :type productionUserWorkFlow.pwfid: Long
        
        Example::
        
            {
                "productionUserWorkFlow.pwfid": 1
            }
            
                |Returns:|
                - **productionUserWorkFlows**: 计划工序-人员, 数据类型 *productionUserWorkFlow*
          - 类型: *List*
        
        Example::
        
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
            
## 物流包

## api.production.TranpackAction

        |DataType:|
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
    
    ### <I> pageTranpack

        分页方式获取物流包 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 计划信息列表 , 每条数据类型 *productionPlan*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> queryTranpackByPid

        通过生产单ID获取物流包
        
                |Requests:|
                :param tranpack.production.pid: 生产单ID
        :type tranpack.production.pid: Long
        
                |Returns:|
                - **tranpacks**: 物流包信息列表 , 每条数据类型 *tranpack*
          - 类型: *List*
        
        Example::
        
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

    ### <I> packTranpack

        打包物流包
        
        根据关联单号以及类型获取对应的订单 , 外协/五金/生产计划
        
        根据物流包类型以及关联ID , 判断关联单是否存在
        
        更新关联生产单更新时间
        
                |Requests:|
                :param tranpack.no: 关联单号
        :type tranpack.no: Long
        :param tranpack.type: 关联单号
        :type tranpack.type: Short
        
        Example::
        
            {
                "tranpack.no": 1,
                "tranpack.type": 0
            }            
    
    ### <I> packTranpackForOutsource

        打包物流包
        
                |Requests:|
                :param tranpack.production.pid: 生产单ID
        :type tranpack.production.pid: Long
        
        Example::
        
            {
                "tranpack.production.pid": 1,
                "tranpack.rid": 1,
                "tranpack.type": 1
            }
        
    ### <I> packTranpackForHardware

        打包物流包
        
                |Requests:|
                :param tranpack.production.pid: 生产单ID
        :type tranpack.production.pid: Long
        
        Example::
        
            {
                "tranpack.production.pid": 1,
                "tranpack.rid": 1,
                "tranpack.type": 1
            }
        
    ### <I> packTranpackForPlan

        打包物流包
        
                |Requests:|
                :param tranpack.production.pid: 生产单ID
        :type tranpack.production.pid: Long
        
        Example::
        
            {
                "tranpack.production.pid": 1,
                "tranpack.rid": 1,
                "tranpack.type": 2
            }
            
    ### <I> instoreTranpack

        物流包进仓储阶段
        
        判断物流包是否存在 , 不存在 , 错误信息 **220023 物流包不存在**
        
        判断物流包状态0(初始) , 其他状态 , 错误信息 **220025 物流包状态不可操作**
        
        更新物流包状态为1(仓储) , 更新关联生产单更新时间
        
        判断关联生产单归属外协单状态是否为3(完结) , 存在其他状态外协单 , 关联生产单状态不可更新
        
        判断关联生产单归属五金单状态是否为3(完结) , 存在其他状态五金单 , 关联生产单状态不可更新
        
        判断关联生产单归属计划单状态是否为1(完结) , 存在其他状态计划单 , 关联生产单状态不可更新
        
        判断关联生产单归属物流包状态是否为0(初始) , 存在该状态物流包 , 关联生产单状态不可更新
        
        满足以上条件之后 , 更新关联生产单状态为3(仓库) , 更新入库时间

                |Requests:|
                :param tranpack.production.pid: 生产单ID
        :type tranpack.production.pid: Long
        
        Example::
        
            {
                "tranpack.production.pid:": 1
            }

    ### <I> planTranPack

        物流包进入物流阶段
        
        判断物流包是否存在 , 不存在 , 错误信息 **220023 物流包不存在**
        
        判断物流包状态1(仓储) , 其他状态 , 错误信息 **220025 物流包状态不可操作**
        
        更新物流包状态为2(物流) , 更新物流时间 , 更新关联生产单更新时间
        
                |Requests:|
                :param tranpack.production.pid: 生产单ID
        :type tranpack.production.pid: Long
        
        Example::
        
            {
                "tranpack.production.pid:": 1
            }
    
    ### <I> tranTranpack

        物流包进入运输阶段
        
        判断物流包是否存在 , 不存在 , 错误信息 **220023 物流包不存在**
        
        判断物流包状态2(物流) , 其他状态 , 错误信息 **220025 物流包状态不可操作**
        
        更新物流包状态为3(运输) , 更新送货时间 , 更新关联生产单更新时间
        
                |Requests:|
                :param tranpack.production.pid: 生产单ID
        :type tranpack.production.pid: Long
        
        Example::
        
            {
                "tranpack.production.pid:": 1
            }
    
    ### <I> mountTranpack

        物流包进入安装阶段
        
        判断物流包是否存在 , 不存在 , 错误信息 **220023 物流包不存在**
        
        判断物流包状态3(运输) , 其他状态 , 错误信息 **220025 物流包状态不可操作**
        
        更新物流包状态为4(安装) , 更新安装时间 , 更新关联生产单更新时间
        
                |Requests:|
                :param tranpack.production.pid: 生产单ID
        :type tranpack.production.pid: Long
        
        Example::
        
            {
                "tranpack.production.pid:": 1
            }
            
    ### <I> completeTranpack

        完成物流包
        
        判断物流包是否存在 , 不存在 , 错误信息 **220023 物流包不存在**
        
        判断物流包状态4(安装) , 其他状态 , 错误信息 **220025 物流包状态不可操作**
        
        更新物流包状态为5(完成) , 更新安装时间 , 更新关联生产单更新时间
        
                |Requests:|
                :param tranpack.production.pid: 生产单ID
        :type tranpack.production.pid: Long
        
        Example::
        
            {
                "tranpack.production.pid:": 1
            }
            
    ### <I> lossTranpack

        物流包丢失
        
        判断物流包是否存在 , 不存在 , 错误信息 **220023 物流包不存在**
        
        更新物流包状态为6(丢失)
        
                |Requests:|
                :param tranpack.production.pid: 生产单ID
        :type tranpack.production.pid: Long
        
        Example::
        
            {
                "tranpack.production.pid:": 1
            }

## 功能

## api.production.ProductionFunctionAction

        |DataType:|
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
    
    ### <I> queryProductionFunction

        获取生产功能信息
    
    ### <I> queryProductionFunctionByName

        通过名称获取生产功能信息
