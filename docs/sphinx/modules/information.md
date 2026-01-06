# information {#information}

# 信息
## 消息

消息管理 , 能够发送接收系统以及用户间的消息

## api.information.MessageAction

        |DataType:|
        #### message

    - **mid**: 消息ID
      - 类型: *Long*
    - **receiver**: 接收人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **sender**: 发送人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **group**: 分组
      - 类型: *Long*
    - **type**: 类型 , 0: 款项消息 , 1: 审批消息 , 2: 归属消息 , 3: 工程消息 , 4: 个人消息 , 5: 回访消息
      - 类型: *Short*
    - **subtype**: 子类 , 1: 辅料单出库
      - 类型: *Short*
    :parma ident: 外联ID
      - 类型: *Long*
    - **contents**: 消息内容
      - 类型: *String*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 已读 , 1: 未读 , 2: 未发
      - 类型: *Short*
    - **args**: 参数
      - 类型: *String*
    - **dresult**: 钉钉消息结果
      - 类型: *Short*
    
    ### <I> pageMessage

        分页方式获取所属用户消息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 消息信息列表 , 每条数据类型 *message*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> queryMessageByMid

        通过消息ID获取消息信息
        
                |Requests:|
                :param message.mid: 消息ID
        :type message.mid: Long
        
        Example::
        
            {
                "message.mid": 1
            }
            
                |Returns:|
                - **message**: 消息信息 , 类型 *message*
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I> countMessage

        获取所属用户未读消息总数
        
                |Returns:|
                - **messageCount**: 消息总数
          - 类型: *Integer*
        
        Example::
        
            {
                ...
                "messageCount": 1
                ...
            }
        
    ### <I> sendMessage

        发送消息
        
                |Requests:|
                :param message.receiver.userId: 接收人编号
        :type message.receiver.userId: String
        :param message.contents: 消息内容
        :type message.contents: String
        :param message.type: 类型 , 包括: 审批消息 , 放线消息 , 个人消息 , 归属消息
        :type message.type: Short
        
        Example::
        
            {
                "message.receiver.userId": "U0479",
                "message.contents": "消息",
                "message.type": 1
            }
    
    ### <I> updateMessageForRead

        更新未读消息为已读
        
                |Requests:|
                :param mids[n]: 接收人编号
        :type mids[n]: Long
        
        Example::
        
            {
                "mids[0]": 1,
                "mids[1]": 2
            }
            
## 公告

公告信息管理

## api.information.NoticeAction

        |DataType:|
        #### notice

    - **nid**: 公告ID
      - 类型: *Long*
    - **theme**: 主题
      - 类型: *String*
    - **type**: 类型 , 1: 通知, 2: 活动
      - 类型: *Short*
    - **priority**: 优先级 , 0: 标准, 1: 重要, 2: 紧急
      - 类型: *Short*
    - **startTime**: 开始时间
      - 类型: *Long*
    - **endTime**: 结束时间
      - 类型: *Long*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **isPublic**: 公开标识 , 0: 公开, 1:部门公开
      - 类型: *Short*
    - **exPublic**: 过期公开 , 0: 公开 , 1: 隐藏
      - 类型: *Short*
    - **depts**: 部门范围
      - 类型: *String*
    - **status**: 状态, 0: 可用, 1: 失效
      - 类型: *Short*
    - **filePath**: 附件路径
      - 类型: *String*
    - **contents**: 内容
      - 类型: *String*
    - **company**: 公司ID
      - 类型: *Long*
    
    #### noticeDepartment

    - **ndid**: 公告部门ID
      - 类型: *Long*
    - **nid**: 公告ID
      - 类型: *Long*
    - **did**: 部门ID
      - 类型: *Integer*
    
        |Filters:|
        - **theme**: 主题
      - 类型: *String*
    - **dateRange**: 开始结束时间范围查询 , 格式: 2016/01/01-2016/01/01
      - 类型: *String*
    
    ### <I> pageNotice

        分页方式获取归属操作人员的公告信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 公告信息列表 , 每条数据类型 *notice*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> pageNoticeForSeenByType

        分页方式获取公告信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        公告信息符合以下条件: 操作人所属部门对应的公告信息或者公告信息公开标识为公开(0), 状态为可用(0)
        
        返回公告信息限制数量: 5
        
                |Requests:|
                :param notice.type: 类型 , 包括: 1: 通知, 2: 活动
        :type notice.type: Short
        
        Example::
        
            {
                "notice.type": 1
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 公告信息列表 , 每条数据类型 *notice*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> queryNoticeByNid

        通过公告ID获取公告信息
        
                |Requests:|
                :param notice.nid: 公告ID
        :type notice.nid: Long
        
        Example::
        
            {
                "notice.nid": 1
            }
            
                |Returns:|
                - **notice**: 公告信息 , 类型 *notice*
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I> queryNoticeDepartment

        获取公告-部门信息
        
                |Requests:|
                :param notice.noticeId: 公告ID
        :type notice.noticeId: Long
        
                |Returns:|
                - **noticeDepartments**: 公告信息列表 , 类型 *noticeDepartment*
          - 类型: *List*
        
        Example::
        
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
                    
    ### <I> addNotice

        添加公告信息
        
                |Requests:|
                :param notice.theme: 主题
        :type notice.theme: String
        :param notice.type: 类型 , 包括: 1: 通知, 2: 活动
        :type notice.type: Short
        :param notice.priority: 优先级 , 包括: 0: 标准, 1: 重要, 2: 紧急
        :type notice.priority: Short
        :param notice.startTime: 开始时间
        :type notice.startTime: Long
        :param notice.endTime: 结束时间
        :type notice.endTime: Long
        :param notice.isPublish: 公开标识 , 包括: 0: 公开, 1: 部门公开
        :type notice.isPublish: Short
        :param notice.exPublic: 过期公开 , 包括: 0: 公开, 1: 隐藏
        :type notice.exPublic: Short
        :param notice.contents: 内容
        :type notice.contents: String
        :param notice.filePath: 附件路径
        :type notice.filePath: String
        
        Example::
        
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
            
    ### <I> updateNotice

        更新公告信息
        
        判断公告信息是否存在 , 不存在更新失败 , 错误信息 **160017 公告不存在**
        
                |Requests:|
                :param notice.nid: 公告ID
        :type notice.nid: Long
        :param notice.theme: 主题
        :type notice.theme: String
        :param notice.type: 类型 , 包括: 1: 通知, 2: 活动
        :type notice.type: Short
        :param notice.priority: 优先级 , 包括: 0: 标准, 1: 重要, 2: 紧急
        :type notice.priority: Short
        :param notice.startTime: 开始时间
        :type notice.startTime: Long
        :param notice.endTime: 结束时间
        :type notice.endTime: Long
        :param notice.isPublish: 公开标识 , 包括: 0: 公开, 1:部门公开
        :type notice.isPublish: Short
        :param notice.exPublic: 过期公开 , 包括: 0: 公开, 1: 隐藏
        :type notice.exPublic: Short
        :param notice.contents: 内容
        :type notice.contents: String
        :param notice.filePath: 附件路径
        :type notice.filePath: String
            
        Example::
        
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
            
    ### <I> updateNoticeDepartment

        更新公告对应归属部门信息
        
        判断公告信息是否存在 , 不存在更新失败 , 错误信息 **160017 公告不存在**
        
        更新公告对应归属部门之前 , 需要将该公告之前关联的部门信息清空
        
        判断部门数量 , 数量最多为3个
        
                |Requests:|
                :param notice.nid: 公告ID
        :type notice.nid: Long
        :param dids[n]: 部门ID信息列表 , 每条数据类型: Integer
        :type dids[n]: List
        
        Example::
        
            {
                "notice.nid": 1,
                "dids[0]": 1,
                "dids[1]": 2
            }
            
    ### <I> deleteNotice

        批量删除公告信息 , 更新公告状态为失效(1)
        
                |Requests:|
                - **nid**: 公告ID
          - 类型: *Long*
        
        Example::
            
            {
                "nid": 1
            }
            
## 奖品

### 库存

## api.information.AwardStockAction

        |DataType:|
        #### awardStock

    - **asid**: 奖品库存ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **purchase**: 进价
      - 类型: *Integer*
    - **selling**: 售价
      - 类型: *Integer*
    - **num**: 库存数
      - 类型: *Integer*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **type**: 类型 , 0: 券 , 1: 物品 , 2: 红包
      - 类型: *Short*
    - **subtype**: 子类 , 0: 床上用品 , 1: 电器 , 2: 厨具 , 3: 日用品 , 4: 现金资产 , 5: 食品 , 6: 洁具 , 7: 工具 , 8: 其他
      - 类型: *Short*
    - **storeroom**: 库房 , 0: 无 , 1: 装修 , 2: 主材 , 3: 销售
      - 类型: *Short*
    - **format**: 规格
      - 类型: *String*
    - **isPrefor**: 是否计算业绩 , 0: 计算 , 1: 不计算
      - 类型: *Short*
    - **isStock**: 是否计算库存 , 0: 计算 , 1: 不计算
      - 类型: *Short*
    - **isPayment**: 是否计入金额 , 0: 计入 , 1: 不计入 , 主要体现在装修实收额计算
      - 类型: *Short*
    - **content**: 说明
      - 类型: *String*
    - **company**: 公司
      - 类型: *Integer*
    
    ### <I> pageAwardStock

        分页方式获取奖品库存信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 奖品库存信息列表 , 每条数据类型 *awardStock*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> queryAwardStockByAsid

        通过奖品ID获取奖品库存信息
        
                |Requests:|
                :param awardStock.asid: 奖品ID
        :type awardStock.asid: Long
        :param awardStock.storeroom: 库房
        :type awardStock.storeroom: Short
        
        
        Example::
        
            {
                "awardStock.asid": 1,
                "awardStock.storeroom": 0
            }
            
                |Returns:|
                - **awardStock**: 奖品 , 类型 *awardStock*
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I> queryAwardStockByType

        查询奖品信息 , 可以通过奖品类型进行筛选
    
                |Requests:|
                :param awardStock.type: 奖品类型
        :type awardStock.type: Short
        :param awardStock.storeroom: 库房
        :type awardStock.storeroom: Short
        
        Example::
        
            {
                "awardStock.type": 1,
                "awardStock.storeroom": 0
            }
            
                |Returns:|
                - **awardStocks**: 奖品列表 , 每条数据类型 *awardStock*
          - 类型: *List*
        
        Example::
        
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

    ### <I> queryAwardStockByName

        查询奖品信息 , 可以通过奖品类型进行筛选
    
                |Requests:|
                :param awardStock.type: 奖品类型
        :type awardStock.type: Short
        :param awardStock.storeroom: 库房
        :type awardStock.storeroom: Short
        
        Example::
        
            {
                "awardStock.type": 1,
                "awardStock.storeroom": 0
            }
            
                |Returns:|
                - **awardStocks**: 奖品列表 , 每条数据类型 *awardStock*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> addAwardStock

        添加奖品信息
        
                |Requests:|
                :param awardStock.no: 编号
        :type awardStock.no: String
        :param awardStock.name: 名称
        :type awardStock.name: String
        :param awardStock.purchase: 进价
        :type awardStock.purchase: Integer
        :param awardStock.selling: 售价
        :type awardStock.selling: Integer
        :param awardStock.num: 数量
        :type awardStock.num: Integer
        :param awardStock.type: 类型
        :type awardStock.type: Short
        :param awardStock.subtype: 子类
        :type awardStock.subtype: Short
        :param awardStock.storeroom: 库房
        :type awardStock.storeroom: Short
        :param awardStock.format: 规格
        :type awardStock.format: String
        :param awardStock.isPrefor: 是否计入业绩
        :type awardStock.isPrefor: Short
        :param awardStock.isStock: 是否计入库存
        :type awardStock.isStock: Short
        :param awardStock.isPayment: 是否计入金额
        :type awardStock.isPayment: Short
        :param awardStock.content: 说明
        :type awardStock.content: String
        
        Example::
        
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
            
    ### <I> updateAwardStock

        更新奖品信息 , 可以更新业绩和库存的记录标识以及说明信息
        
        判断奖品信息是否存在 , 不存在 , 错误信息 **160043 物品不存在**
        
                |Requests:|
                :param awardStock.asid: 奖品ID
        :type awardStock.asid: Long
        :param awardStock.purchase: 进价
        :type awardStock.purchase: Integer
        :param awardStock.selling: 售价
        :type awardStock.selling: Integer
        :param awardStock.isPrefor: 是否计入业绩
        :type awardStock.isPrefor: Short
        :param awardStock.isStock: 是否计入库存
        :type awardStock.isStock: Short
        :param awardStock.isPayment: 是否计入金额
        :type awardStock.isPayment: Short
        :param awardStock.content: 说明
        :type awardStock.content: String
        
        Example::
        
            {
                "awardStock.asid": 1,
                "awardStock.purchase": 100000,
                "awardStock.selling": 100000,
                "awardStock.isPrefor": 0,
                "awardStock.isStock": 0,
                "awardStock.isPayment": 0,
                "awardStock.content": "说明"
            }
            
    ### <I> updateAwardStockForStatus

        更新奖品状态
        
        判断奖品信息是否存在 , 不存在 , 错误信息 **160043 物品不存在**
        
                |Requests:|
                :param awardStock.asid: 奖品ID
        :type awardStock.asid: Long
        :param awardStock.status: 状态
        :type awardStock.status: Short
        
        Example::
        
            {
                "awardStock.asid": 1,
                "awardStock.status": 0
            }
            
    ### <I> updateAwardStockForCG

        奖品入库
        
        判断奖品信息是否存在 , 不存在 , 错误信息 **160043 物品不存在**
        
        奖品如果不需要计入库存 , 错误信息 **160041 物品不能出库**
        
        更新奖品对应的库存数量信息
        
        生成奖品记录 , 类型为1(入库)
        
                |Requests:|
                :param awardStock.asid: 奖品ID
        :type awardStock.asid: Long
        :param awardStock.num: 数量
        :type awardStock.num: Integer
        
        Example::
        
            {
                "awardStock.asid": 1,
                "awardStock.num": 1.1
            }
            
    ### <I> updateAwardStockForXG

        奖品出库
        
        判断奖品信息是否存在 , 不存在 , 错误信息 **160043 物品不存在**
        
        判断奖品数量是否满足出库数量 , 不满足 , 错误信息 **160038 库存不足**
        
        奖品如果不需要计入库存 , 错误信息 **160040 物品不能出库**
        
        更新奖品对应的库存数量信息
        
        生成奖品记录 , 类型为0(出库)
        
                |Requests:|
                :param awardStock.asid: 奖品ID
        :type awardStock.asid: Long
        :param awardStock.num: 数量
        :type awardStock.num: Integer
        
        Example::
        
            {
                "awardStock.asid": 1,
                "awardStock.num": 1.1
            }
            
    ### <I> checkAwardStock

        奖品盘点
        
        判断奖品信息是否存在 , 不存在 , 错误信息 **160043 物品不存在**
        
        奖品如果不需要计入库存 , 错误信息 **160042 物品不能盘点**
        
        更新奖品对应的库存数量信息
        
        生成奖品记录 , 类型为2(盘盈)或3(盘亏)
        
                |Requests:|
                :param awardStock.asid: 奖品ID
        :type awardStock.asid: Long
        :param awardStock.num: 数量 , 纠正库存数量
        :type awardStock.num: Integer
        
        Example::
        
            {
                "awardStock.asid": 1,
                "awardStock.num": 1.1
            }

### 采购

## api.information.AwardPurchaseAction

        |DataType:|
        #### awardPurchase

    - **apid**: 采购ID
      - 类型: *Long*
    - **awardStock**: 库存 , 类型 [awardStock](./information.html#api.information.AwardStockAction.awardStock)
      - 类型: *Object*
    - **fapid**: 上级采购ID
      - 类型: *Long*
    - **inprice**: 采购价
      - 类型: *Long*
    - **baprice**: 结算价
      - 类型: *Long*
    - **num**: 数量
      - 类型: *Integer*
    - **surplus**: 剩余量
      - 类型: *Integer*
    
    - **activity**: 活动名
      - 类型: *String*
    - **dept**: 部门
      - 类型: *String*
    
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **purchaser**: 采购员 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **instorer**: 入库员 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **purchaseTime**: 采购时间
      - 类型: *Timestamp*
    - **instoreTime**: 入库时间
      - 类型: *Timestamp*
    - **balanceTime**: 仓储时间
      - 类型: *Timestamp*
    
    - **status**: 状态 , 0: 初始 , 1: 采购 , 2: 入库, 3: 结算, 4: 撤销 , 5: 完成
      - 类型: *Short*
    
    - **company**: 公司
      - 类型: *Integer*
    - **comment**: 备注
      - 类型: *String*
    
    ### <I> pageAwardPurchase

        分页方式获取奖品采购信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 奖品采购信息列表 , 每条数据类型 *awardPurchase*
        :type paging.data: List
        
        Example::
        
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

    ### <I> queryAwardPurchase

        分页方式获取奖品采购信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

                |Requests:|
                :param awardPurchase.fapid: 上级采购ID
        :type awardPurchase.fapid: Long

        Example::
        
            {
                "awardPurchase.fapid": 1
            }
        
                |Returns:|
                - **awardPurchases**: 奖品采购信息列表 , 每条数据类型 *awardPurchase*
          - 类型: *List*
        
        Example::
        
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

    ### <I> addAwardPurchase

        创建奖品采购
        
                |Requests:|
                :param awardPurchase.activity: 活动名
        :type awardPurchase.activity: String
        :param awardPurchase.dept: 部门
        :type awardPurchase.dept: String
        :type awardPurchase.awardStock.asid: Long
        :param awardPurchase.awardStock.asid: 奖品库存ID
        :type awardPurchase.awardStock.asid: Long
        :param awardPurchase.num: 数量
        :type awardPurchase.num: Integer
        :param awardPurchase.comment: 备注
        :type awardPurchase.comment: String
        
        Example::
        
            {
                "awardPurchase.activity": "活动",
                "awardPurchase.dept": "",
                "awardPurchase.awardStock.asid": 1,
                "awardPurchase.num": 0,
                "awardPurchase.comment": ""
            }
    
    ### <I> purchaseAwardPurchase

        采购
        
        判断奖品采购是否存在 , 不存在 , 错误信息 **160057 奖品采购不存在**
        
        判断奖品采购状态是否为0(初始) , 其他状态 , 错误信息 **160058 奖品采购不可操作**
        
        更新奖品采购状态为1(采购) , 采购价 , 采购人以及采购时间
        
                |Requests:|
                :param awardPurchase.apid: 奖品采购ID
        :type awardPurchase.apid: Long
        
        Example::
        
            {
                "awardPurchase.apid": 1
            }
    
    ### <I> instoreAwardPurchase

        入库
        
        判断奖品采购是否存在 , 不存在 , 错误信息 **160057 奖品采购不存在**
        
        判断奖品采购状态是否为1(采购) , 其他状态 , 错误信息 **160058 奖品采购不可操作**
        
        更新奖品采购状态为2(入库) , 入库人以及入库时间
        
                |Requests:|
                :param awardPurchase.apid: 奖品采购ID
        :type awardPurchase.apid: Long
        :param awardPurchase.num: 数量
        :type awardPurchase.num: Integer
        
        Example::
        
            {
                "awardPurchase.apid": 1,
                "awardPurchase.num": 1
            }
    
    ### <I> balanceAwardPurchase

        结算
        
        判断奖品采购是否存在 , 不存在 , 错误信息 **160057 奖品采购不存在**
        
        判断奖品采购状态是否为2(入库) , 其他状态 , 错误信息 **160058 奖品采购不可操作**
        
        更新奖品采购状态为3(结束) , 结算价 , 结算人以及结算时间
        
                |Requests:|
                :param awardPurchase.apid: 奖品采购ID
        :type awardPurchase.apid: Long
        
        Example::
        
            {
                "awardPurchase.apid": 1
            }

    ### <I> cancelAwardPurchase

        撤销
        
        判断奖品采购是否存在 , 不存在 , 错误信息 **160057 奖品采购不存在**
        
        判断奖品采购状态是否为0(初始) , 其他状态 , 错误信息 **160058 奖品采购不可操作**
        
        更新奖品采购状态为4(撤销)
        
                |Requests:|
                :param awardPurchase.apid: 奖品采购ID
        :type awardPurchase.apid: Long
        
        Example::
        
            {
                "awardPurchase.apid": 1
            }

### 记录
## api.information.AwardRecordAction

        |DataType:|
        #### awardRecord

    - **arid**: 奖品记录ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **awardStock**: 奖品 , 类型 [awardStock](./information.html#api.information.AwardStockAction.awardStock)
      - 类型: *Object*
    - **type**: 类型 , 0: 入库 , 1: 出库 , 2: 盘盈 , 3: 盘亏
      - 类型: *Short*
    - **subtype**: 子类 , 0: 入库 , 1: 出库, 2: 盘盈 , 3: 盘亏 , 6: 退货 , 8: 采购 , 10: 公司回库 , 12: 剩余回库 , 14: 厂家赠送 , 5: 领取 , 7: 配送 , 9: 赔偿 , 11: 自购 , 13: 福利 , 15: 营销 , 17: 跨帐
      - 类型: *Short*
    - **onetype**: 一类 , 0: 无 , 1: 装修 , 2: 销售 , 3: 主材
      - 类型: *Short*
    - **num**: 数量
      - 类型: *Integer*
    - **unitPrice**: 单价
      - 类型: *Integer*
    - **totalPrice**: 总价
      - 类型: *Integer*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **operateTime**: 操作时间
      - 类型: *Timestamp*
    - **content**: 说明
      - 类型: *String*
    - **isStock**: 是否计算库存 , 0: 计算 , 1: 不计算
      - 类型: *Short*
    
    ### <I> pageAwardRecord

        分页方式获取奖品记录信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 奖品库存信息列表 , 每条数据类型 *awardStock*
        :type paging.data: List
        
        Example::
        
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
            
## 活动

### 活动

活动信息管理

## api.information.ActivityAction

        |DataType:|
        #### activity

    - **aid**: 活动ID
      - 类型: *Long*
    - **name**: 活动名
      - 类型: *String*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **type**: 类型 , 1: 装修 , 2: 主材 , 3: 销售
      - 类型: *Short*
    - **paytype**: 款项类型 , 1: 合同预付 , 2: 主材预付 , 4: 装修 , 8: 主材 , 16: 销售 , 32: 服务
      - 类型: *Short*
    - **status**: 状态 , 包括: 0: 有效 , 1: 失效 , 2: 删除
      - 类型: *Short*
    - **defaults**: 默认标识 , 0: 默认 , 1: 标准
      - 类型: *Short*
    - **multiple**: 倍数
      - 类型: *Integer*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **startTime**: 开始时间
      - 类型: *Timestamp*
    - **endTime**: 结束时间
      - 类型: *Timestamp*
    - **content**: 活动内容
      - 类型: *String*
    - **company**: 公司ID
      - 类型: *Integer*
    
    #### activityItem

    - **aiid**: 活动物品ID
      - 类型: *Long*
    - **aid**: 归属活动ID
      - 类型: *Long*
    - **asid**: 奖品ID
      - 类型: *Long*
    - **activity**: 活动名
      - 类型: *String*
    - **name**: 物品名
      - 类型: *String*
    - **type**: 类型 , 包括: 0: 券 , 1: 物品 , 2: 红包
      - 类型: *Short*
    - **money**: 金额
      - 类型: *Integer*
    - **integral**: 积分
      - 类型: *Integer*
    
        |Filters:|
        - **activityName**: 活动名
      - 类型: *String*
    - **status**: 状态 , 包括: 0: 有效 , 1: 失效
      - 类型: *Short*

    ### <I> pageActivity

        分页方式获取操作用户活动信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 活动信息列表 , 每条数据类型 *activity*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> queryActivityForValid

        获取所有状态为有效的活动信息
        
                |Requests:|
                :param activity.type: 类型
        :type activity.type: Short
        
        Example::
        
            {
                "activity.type": 1
            }
        
                |Returns:|
                - **activitys**: 活动信息列表 , 每条数据类型 *activity*
          - 类型: *List*
        
        Example::
        
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

    ### <I> addActivity

        添加活动信息
        
                |Requests:|
                :param activity.name: 活动名
        :type activity.name: String
        :param activity.type: 类型
        :type activity.type: Short
        :param activity.paytype: 款项类型
        :type activity.paytype: Short
        :param activity.multiple: 倍数
        :type activity.multiple: Integer
        :param activity.createTime: 开始时间
        :type activity.createTime: Timestamp
        :param activity.endTime: 结束时间
        :type activity.endTime: Timestamp
        :param activity.content: 活动内容
        :type activity.content: String
        
        Example::
        
            {
                "activity.name": "活动",
                "activity.type": 0,
                "activity.paytype": 0,
                "activity.multiple": 0,
                "activity.createTime": "2016-01-01 00:00:00",
                "activity.endTime": "2016-01-01 23:59:59",
                "activity.content": "内容"
            }

    ### <I> updateActivity

        更新活动信息
        
        判断活动是否存在 , 不存在 , 错误信息 **160011 活动信息不存在**
        
        判断活动状态 , 状态为无效 , 错误信息 **160012 活动当前状态不能修改**
        
                |Requests:|
                :param activity.aid: 活动ID
        :type activity.aid: Long
        :param activity.paytype: 款项类型
        :type activity.paytype: Short
        :param activity.endTime: 结束时间
        :type activity.endTime: Timestamp
        :param activity.content: 活动内容
        :type activity.content: String
        
        Example::
        
            {
                "activity.aid": 1,
                "activity.paytype": 0,
                "activity.endTime": "2016-01-01 23:59:59",
                "activity.content": "内容"
            }
            
    ### <I> updateActivityForStatus

        更新活动状态
        
        判断活动是否存在 , 不存在 , 错误信息 **160011 活动信息不存在**
        
        判断活动状态 , 状态为无效 , 错误信息 **160012 活动当前状态不能修改**
        
                |Requests:|
                :param activity.aid: 活动ID
        :type activity.aid: Long
        :param activity.status: 状态
        :type activity.status: Short
        
        Example::
        
            {
                "activity.aid": 1,
                "activity.status": 1
            }
            
    ### <I> updateActivityForDefault

        更新活动默认状态
        
        判断活动是否存在 , 不存在 , 错误信息 **160011 活动信息不存在**
        
        判断活动状态 , 状态为无效 , 错误信息 **160012 活动当前状态不能修改**
        
        操作活动所属的类型中的所有活动 , 默认标识更新为1(标准) , 当前操作活动默认标识更新为0(默认)
        
                |Requests:|
                :param activity.aid: 活动ID
        :type activity.aid: Long
        
        Example::
        
            {
                "activity.aid": 1
            }

### 物品

活动信息管理

## api.information.ActivityAction

        |DataType:|
        #### activityItem

    - **aiid**: 物品ID
      - 类型: *Long*
    - **aid**: 归属活动ID
      - 类型: *Long*
    - **asid**: 奖品ID
      - 类型: *Long*
    - **activity**: 活动名
      - 类型: *String*
    - **name**: 物品名
      - 类型: *String*
    - **type**: 类型 , 包括: 0: 券 , 1: 物品 , 2: 红包
      - 类型: *Short*
    - **money**: 金额
      - 类型: *Integer*
    - **integral**: 积分
      - 类型: *Integer*
    
    ### <I> queryActivityItemByAid

        通过活动ID获取活动中的活动物品信息
        
                |Requests:|
                :param activity.aid: 活动ID
        :type activity.aid: Long
        
        Example::
        
            {
                "activity.aid": 1
            }
            
                |Returns:|
                - **activityItems**: 活动物品信息列表 , 每条数据类型 *activityItem*
          - 类型: *List*
        
        Example::
        
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

    ### <I> queryActivityItemByAiid

        通过活动物品ID获取信息
        
                |Requests:|
                :param activityItem.aiid: 物品ID
        :type activityItem.aiid: Long
        
        Example::
        
            {
                "activityItem.aiid": 1
            }
            
                |Returns:|
                - **activityItem**: 活动物品 , 类型 *activityItem*
          - 类型: *Object*
        
        Example::
        
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
    
    ### <I> addActivityItem

        向活动中添加活动物品信息
        
                |Requests:|
                :param activity.aid: 活动ID
        :type activity.aid: Long
        
        :param activity.asid: 奖品ID
        :type activity.asid: Long
        :param activityItem.activity: 活动名称
        :type activityItem.activity: String
        :param activityItem.name: 活动物品名称
        :type activityItem.name: String
        :param activityItem.money: 金额
        :type activityItem.money: String
        :param activityItem.type: 类型 , 包括: 0: 券 , 1: 物品
        :type activityItem.type: Short
        :param activityItem.integral: 积分
        :type activityItem.integral: Integer
        
        Example::
        
            {
                "activity.aid": 1,
                
                "activityItem.activity": "活动",
                "activityItem.name": "券",
                "activityItem.money": 100
                "activityItem.type": 0,
                "activityItem.integral": 0
            }
    
    ### <I> deleteActivityItem

        删除活动物品信息
        
                |Requests:|
                :param activityItem.aiid: 活动物品ID
        :type activityItem.aiid: Long
        
        Example::
        
            {
                "activityItem.aiid": 1
            }
            
## 事件

事件信息管理

## api.information.EventsAction

        |DataType:|
        #### event

    - **eid**: 事件ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **title**: 标题
      - 类型: *String*
    - **content**: 内容
      - 类型: *String*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **holder**: 所有人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **department**: 归属部门 , 类型 [department](./department.html#api.communion.DepartmentAction.department)
      - 类型: *Object*
    - **region**: 归属分区 , 类型 [department](./department.html#api.communion.DepartmentAction.department)
      - 类型: *Object*
    - **type**: 类型 , 1: 系统 , 2: 标准
      - 类型: *Short*
    - **atttype**: 业务类型 , 0: 通知
      - 类型: *Short*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **showDate**: 显示日期
      - 类型: *Date*
    - **beginDate**: 开始日期
      - 类型: *String*
    - **endDate**: 结束日期
      - 类型: *String*
    - **isSend**: 推送标识
      - 类型: *Short*
    
        |Filters:|
        - **showDate**: 显示日期
      - 类型: *String*
    - **showDateRange**: 显示日期范围 , 例: 2016/01/01-2016/01/02
      - 类型: *String*
    
    ### <I> queryEvent

        获取当前登陆系统人所拥有事件信息
        
                |Requests:|
                :param event.beginDate: 开始日期
        :type event.beginDate: String
        :param event.endDate: 结束日期
        :type event.endDate: String
        
        Example::
        
            {
                "event.beginDate": "2016-01-01",
                "event.endDate": "2016-01-02"
            }
        
                |Returns:|
                - **events**: 事件信息列表 , 每条数据类型 *event*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> addEvent

        添加事件信息
        
                |Requests:|
                :param event.title: 标题
        :type event.title: String
        :param event.content: 内容
        :type event.content: String
        :param event.showDate: 显示日期
        :type event.showDate: String
        
        Example::
        
            {
                "event.title": "事件",
                "event.content": "事件内容",
                "event.showDate": "2016-01-01"
            }
            
                |Returns:|
                - **event**: 事件信息 , 类型 *event*
          - 类型: *Object*
        
        Example::
        
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

    ### <I> deleteEvent

        删除事件信息
        
                |Requests:|
                :param event.eid: 事件ID
        :type event.eid: Long
        
        Example::
        
            {
                "event.eid": 1
            }
            
## 电话拨叫

电话拨叫功能信息管理

## api.information.PhoneCallAction

        |DataType:|
        #### phoneCall

    - **pcid**: ID
      - 类型: *Long*
    - **orderId**: 订单编号
      - 类型: *String*
    - **operater**: 操作人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **operateTime**: 操作时间
      - 类型: *Timestamp*
    - **callbackId**: 通话信息ID
      - 类型: *String*
    - **caller**: 主叫号码
      - 类型: *String*
    - **callee**: 被叫号码
      - 类型: *String*
    - **startTime**: 开始时间
      - 类型: *Timestamp*
    - **endTime**: 结束时间
      - 类型: *Timestamp*
    - **stopReason**: 挂断原因
      - 类型: *Short*
    - **duration**: 时长
      - 类型: *Integer*
    - **recordType**: 录音类型 , 0: 初始 , 1: 本地 , 2: 线上 , 3: 失败
      - 类型: *Short*
    - **recordUrl**: 录音地址
      - 类型: *String*
    
    ### <I> pagePhoneCall

        分页方式获取电话拨叫信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 电话拨叫信息列表 , 每条数据类型 *phoneCall*
        :type paging.data: List
        
        Example::
        
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
    
    ### <I> phoneCall

        发起电话拨叫
        
                |Requests:|
                :param phoneCall.orderId: 订单编号
        :type phoneCall.orderId: String
        :param phoneCall.caller: 主叫号码
        :type phoneCall.caller: String
        :param phoneCall.callee: 被叫号码
        :type phoneCall.callee: String
        
        Example::
        
            {
                "phoneCall.orderId": "1601010001",
                "phoneCall.caller": "136xxxx2865",
                "phoneCall.callee": "174xxxx2876"
            }
    
    ### <I> updatePhoneCallForInfo

                |Requests:|
                :param phoneCall.pcid: ID
        :type phoneCall.pcid: Long
        :param phoneCall.startTime: 开始时间
        :type phoneCall.startTime: Timestamp
        :param phoneCall.endTime: 结束时间
        :type phoneCall.endTime: Timestamp
        :param phoneCall.stopReason: 挂断原因
        :type phoneCall.stopReason: Short
        :param phoneCall.duration: 时长
        :type phoneCall.duration: Integer
        
        Example::
        
            {
                "phoneCall.pcid": "1601010001",
                "phoneCall.startTime": "2016-01-01 00:00:00",
                "phoneCall.endTime": "2016-01-01 00:00:00",
                "phoneCall.stopReason": 0,
                "phoneCall.duration": 1
            }
            
    ### <I> updatePhoneCallForRecord

                |Requests:|
                :param phoneCall.pcid: ID
        :type phoneCall.pcid: Long
        :param phoneCall.recordType: 录音类型
        :type phoneCall.recordType: Short
        :param phoneCall.recordUrl: 录音地址
        :type phoneCall.recordUrl: String
        
        Example::
        
            {
                "phoneCall.pcid": "1601010001",
                "phoneCall.recordType": 0,
                "phoneCall.recordUrl": "/JDIU/SDFJI/SOCN2312KJ312IN3.mp3",
            }

## 大活动

### 活动

提供展会/节日等大型活动部分业务支持

## api.information.VactivityAction

        |DataType:|
        #### vactivity

    - **vaid**: 活动ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    
    ### <I> pageVactivity

        分页方式获取活动信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 活动信息列表 , 每条数据类型 *vactivity*
        :type paging.data: List
        
        Example::
        
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
    
    ### <I> queryVactivity

        获取所有活动信息 , 状态为0(启用)
        
                |Returns:|
                - **vactivitys**: 活动信息列表 , 每条数据类型 *vactivity*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> updateVactivityForStatus

        更新活动状态
        
        判断活动是否存在 , 不存在 , 错误信息 **160011 活动信息不存在**
        
        判断活动状态是否为0(启用) , 其他状态不可操作 , 错误信息 **160052 活动不可操作**
        
                |Requests:|
                :param vactivity.vaid: 活动ID
        :type vactivity.vaid: Long
        
        Example::
        
            {
                "vactivity.vaid": 1
            }

### 奖品

## api.information.VprizeAction

        |DataType:|
        #### vprize

    - **vpid**: 奖品ID
      - 类型: *Long*
    - **vaid**: 活动ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **price**: 价格
      - 类型: *Integer*
    - **unit**: 单位
      - 类型: *String*
    - **status**: 状态 , 0: 有效 , 1: 无效
      - 类型: *Short*
    
    ### <I> pageVprize

        分页方式获取奖品信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 奖品信息列表 , 每条数据类型 *vprize*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I-C> queryVprizeByNo

        通过票号获取奖品信息
        
        判断活动票是否存在 , 不存在 , 错误信息 **160026 活动票不存在**
        
        通过活动票获取活动ID , 利用活动ID获取活动归属的奖品 , 状态为0(有效)
        
                |Requests:|
                - **no**: 票号
          - 类型: *String*
        
        Example::
        
            {
                "no": 1
            }
            
                |Returns:|
                - **vprizes**: 奖品信息列表 , 每条数据类型 *vprize*
          - 类型: *List*
        
        Example::
        
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
            

    ### <I> addVprize

        添加奖品信息
        
                |Requests:|
                :param vprize.vaid: 活动ID
        :type vprize.vaid: Long
        :param vprize.name: 名称
        :type vprize.name: String
        :param vprize.price: 价格
        :type vprize.price: Integer
        
        Example::
        
            {
                "vprize.vaid": 1,
                "vprize.name": "奖品",
                "vprize.price": 100000,
                "vprize.unit": "个"
            }
    
    ### <I> updateVprize

        更新奖品信息
        
        判断奖品是否存在 , 不存在 , 错误信息 **160048 奖品不存在**
        
                |Requests:|
                :param vprize.vpid: 奖品ID
        :type vprize.vpid: Long
        :param vprize.name: 名称
        :type vprize.name: String
        :param vprize.price: 价格
        :type vprize.price: Integer
        
        Example::
        
            {
                "vprize.vpid": 1,
                "vprize.name": "奖品",
                "vprize.price": 100000,
                "vprize.unit": "个"
            }
    
    ### <I> updateVprizeForStatus

        更新奖品状态
        
        判断奖品是否存在 , 不存在 , 错误信息 **160048 奖品不存在**
        
                |Requests:|
                :param vprize.vpid: 奖品ID
        :type vprize.vpid: Long
        :param vprize.status: 状态
        :type vprize.status: Short
        
        Example::
        
            {
                "vprize.vpid": 1,
                "vprize.status": 0
            }

### 票务

## api.information.VticketAction

        |DataType:|
        #### vticket

    - **vtid**: 活动票ID
      - 类型: *Long*
    - **tno**: 活动票号
      - 类型: *String*
    - **vaid**: 活动ID
      - 类型: *Long*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **belonger**: 归属人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **department**: 归属部门 , 类型 [department](./department.html#api.communion.DepartmentAction.department)
      - 类型: *Object*
    - **region**: 归属分区 , 类型 [department](./department.html#api.communion.DepartmentAction.department)
      - 类型: *Object*
    - **orderId**: 装修单号
      - 类型: *String*
    - **name**: 姓名
      - 类型: *String*
    - **phone**: 电话
      - 类型: *String*
    - **address**: 地址
      - 类型: *String*
    - **isregist**: 是否注册 , 0: 未注册 , 1: 已注册
      - 类型: *Short*
    - **iscome**: 是否到场 , 0: 未到场 , 1: 已到场
      - 类型: *Short*
    
    ### <I> pageVticket

        分页方式获取活动票信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 活动票信息列表 , 每条数据类型 *vticket*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> pageVticketForBelonger

        分页方式获取活动票信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        返回归属人所属的活动票信息
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 活动票信息列表 , 每条数据类型 *vticket*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> pageVticketForSelf

        分页方式获取活动票信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 活动票信息列表 , 每条数据类型 *vticket*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> countVticket

        根据活动票归属的部门 , 汇总统计部门拥有的活动票总数
        
                |Returns:|
                - **counts**: 统计信息 , 类型 List <List <String>>
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "counts":[
                    ["一分区", "一部", "2"],
                    ["二分区", "二部", "10"]
                ],
                ...
            }
            
    ### <I> createVticket

        创建活动票信息
        
        根据归属人所属部门以及分区 , 完成活动票归属部门以及分区
        
                |Requests:|
                :param vticket.tno: 活动票号
        :type vticket.tno: String
        :param vticket.vaid: 活动ID
        :type vticket.vaid: Long
        :param vticket.belonger.userId: 归属人编号
        :type vticket.belonger.userId: String
        :param vticket.orderId: 装修单号
        :type vticket.orderId: String
        :param vticket.name: 姓名
        :type vticket.name: String
        :param vticket.phone: 电话
        :type vticket.phone: String
        :param vticket.address: 地址
        :type vticket.address: String
        
        Example::
        
            {
                "vticket.tno": "000000000000000000",
                "vticket.vaid": 1,
                "vticket.belonger.userId": "U002",
                "vticket.orderId": "1601010001",
                "vticket.name": "客户",
                "vticket.phone": "174xxxx2876",
                "vticket.address": "广场一期1#1-1-1",
            }
            
    ### <I> updateVticket

        更新活动票信息
        
        根据归属人所属部门以及分区 , 更新活动票归属部门以及分区
        
                |Requests:|
                :param vticket.vtid: 活动票ID
        :type vticket.vtid: Long
        :param vticket.belonger.userId: 归属人编号
        :type vticket.belonger.userId: String
        :param vticket.orderId: 装修单号
        :type vticket.orderId: String
        :param vticket.name: 姓名
        :type vticket.name: String
        :param vticket.phone: 电话
        :type vticket.phone: String
        :param vticket.address: 地址
        :type vticket.address: String
        
        Example::
        
            {
                "vticket.vtid": 1,
                "vticket.belonger.userId": "U002",
                "vticket.orderId": "1601010001",
                "vticket.name": "客户",
                "vticket.phone": "174xxxx2876",
                "vticket.address": "广场一期1#1-1-1",
            }
            
    ### <I> registVticket

        更新活动票注册
        
                |Requests:|
                :param vticket.vtid: 活动票ID
        :type vticket.vtid: Long
        
        Example::
        
            {
                "vticket.vtid": 1
            }
            
    ### <I> comeVticket

        更新活动票到场
        
        判断活动票是否存在 , 不存在 , 错误信息 **160044 活动票不存在**
        
        判断活动票是否已经注册 , 未注册 , 错误信息 **160045 活动票未注册**
        
                |Requests:|
                :param vticket.vtid: 活动票ID
        :type vticket.vtid: Long
        
        Example::
        
            {
                "vticket.vtid": 1
            }
            
    ### <I> takeVticket

        认领活动票
        
        获取当前状态为0(初始) , 无归属人的活动票 , 更新归属人/部门/分区信息
        
    ### <I> freeVticket

        释放活动票
        
        判断活动票是否存在 , 不存在 , 错误信息 **160044 活动票不存在**
        
        判断操作人是否为归属人 , 非同一人 , 错误信息 **160051 活动票不可操作**
    
                |Requests:|
                :param vticket.vtid: 活动票ID
        :type vticket.vtid: Long
        
        Example::
        
            {
                "vticket.vtid": 1
            }

### 款项

## api.information.VpaymentAction

        |DataType:|
        #### vpayment

    - **vpid**: 活动款ID
      - 类型: *Long*
    - **mno**: 会员号
      - 类型: *String*
    - **vaid**: 活动ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **collecter**: 收款人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **collectTime**: 收款时间
      - 类型: *Timestamp*
    - **type**: 类型 , 0: 装修款 , 1: 装修定金 , 2: 主材款 , 3: 主材定金
      - 类型: *Short*
    - **status**: 状态 , 0: 未付款 , 1: 已付款
      - 类型: *Short*
    - **category**: 品牌
      - 类型: *String*
    - **brand**: 品牌
      - 类型: *String*
    - **money**: 金额
      - 类型: *Integer*
    - **cash**: 现金
      - 类型: *Integer*
    - **bank**: 刷卡
      - 类型: *Integer*
    - **bankInfo**: 刷卡信息
      - 类型: *String*
    - **comment**: 说明
      - 类型: *String*
    
    #### vreceipt

    - **vrid**: 活动收据ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **collecter**: 收款人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **collectTime**: 收款时间
      - 类型: *Timestamp*
    - **cash**: 现金
      - 类型: *Integer*
    - **bank**: 刷卡
      - 类型: *Integer*
    - **bankInfo**: 刷卡信息
      - 类型: *String*
    - **comment**: 说明
      - 类型: *String*
    
    ### <I> pageVpayment

        分页方式获取活动款信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 活动款信息列表 , 每条数据类型 *vpayment*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> queryVpaymentByVrid

        通过活动收据ID获取活动款信息
        
                |Requests:|
                :param vpayment.vrid: 活动收据ID
        :type vpayment.vrid: Long
        
        Example::
        
            {
                "vpayment.vrid": 1
            }
            
                |Returns:|
                - **vpayments**: 活动款信息列表 , 每条数据类型 *vpayment*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I-C> queryVpaymentByNo

        通过活动票号获取活动款信息
        
                |Requests:|
                :param vpayment.mno: 活动票号
        :type vpayment.mno: String
        
        Example::
        
            {
                "vpayment.mno": "000000000000000000"
            }
            
                |Returns:|
                - **vpayments**: 活动款信息列表 , 每条数据类型 *vpayment*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> queryVreceiptByVrid

        通过活动收据ID获取活动收据信息
        
                |Requests:|
                :param vreceipt.vrid: 活动收据ID
        :type vreceipt.vrid: Long
        
        Example::
        
            {
                "vreceipt.vrid": 1
            }
            
                |Returns:|
                - **vreceipt**: 活动收据
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I> countVpayment

        根据活动款主材类型 , 汇总统计不同品牌金额总数
        
                |Returns:|
                - **counts**: 统计信息信息 , 类型 List <List <String>>
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "counts":[
                    ["品牌1", "2000"],
                    ["品牌2", "2000"]
                ],
                ...
            }
            
    ### <I> createVpayment

        创建活动款信息
        
                |Requests:|
                :param vpayment.mno: 活动票号
        :type vpayment.mno: String
        :param vpayment.type: 类型
        :type vpayment.type: Short
        :param vpayment.category: 品类
        :type vpayment.category: String
        :param vpayment.brand: 品牌
        :type vpayment.brand: String
        :param vpayment.money: 金额
        :type vpayment.money: Integer
        :param vpayment.comment: 备注
        :type vpayment.comment: String
        
        Example::
        
            {
                "vpayment.mno": "000000000000000000",
                "vpayment.type": 1,
                "vpayment.category": "品类",
                "vpayment.brand": "品牌1",
                "vpayment.money": 100000,
                "vpayment.comment": "说明"
            }

    ### <I> collectVpayment

        活动款收款 , 同时支持批量收款
        
        判断活动票是否存在 , 不存在 , 错误信息 **160044 活动票不存在**
        
        判断活动票是否已经注册 , 未注册 , 错误信息 **160045 活动票未注册**
        
        判断活动款总额是否与收款总额相同
        
        批量收款时 , 判断多个款项对应人会员号是否唯一
        
        创建收款数据 , 更新款项状态
        
                |Requests:|
                :param vpayment[n].vpid: 活动款ID
        :type vpayment[n].vpid: Long
        
        :param vreceipt.orderId: 装修单号
        :type vreceipt.orderId: String
        :param vreceipt.cash: 现金
        :type vreceipt.cash: Integer
        :param vreceipt.bank: 刷卡
        :type vreceipt.bank: Integer
        :param vreceipt.bankInfo: 刷卡信息
        :type vreceipt.bankInfo: String
        :param vreceipt.comment: 说明
        :type vreceipt.comment: String
        
        Example::
        
            {
                "vpayment[0].vpid": 1,
                "vpayment[1].vpid": 2,
                "vreceipt.orderId": "1601010001",
                "vreceipt.cash": 100000,
                "vreceipt.bank": 0,
                "vreceipt.bankInfo": "",
                "vreceipt.comment": "说明"
            }

### 奖品

## api.information.VawardAction

        |DataType:|
        #### vaward

    - **vaid**: 奖品ID
      - 类型: *Long*
    - **vpid**: 奖品ID
      - 类型: *Long*
    - **no**: 票号
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **price**: 价格
      - 类型: *Integer*
    - **num**: 数量
      - 类型: *Integer*
    - **unit**: 单位
      - 类型: *String*
    - **status**: 状态
      - 类型: *Short*
    
    ### <I-C> queryVawardByNo

        通过票号获取奖品信息
        
                |Requests:|
                :param vaward.no: 票号
        :type vaward.no: String
        
        Example::
        
            {
                "vaward.no": "0000000000"
            }
        
                |Returns:|
                - **vawards**: 奖品信息列表 , 每条数据类型 *vaward*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I-C> addVaward

        添加奖品
        
        判断活动票是否存在 , 不存在 , 错误信息 **160026 活动票不存在**
        
        判断活动票是否到场 , 未到场 , 错误信息 **160046 活动票未到场**
        
        判断奖品是否存在 , 不存在 , 错误信息 **160048 奖品不存在**
        
        判断活动票和奖品归属的活动 , 活动不同 , 错误信息 **160049 活动不同不可操作**
        
                |Requests:|
                :param vaward.no: 票号
        :type vaward.no: String
        :param vaward.vpid: 奖品ID
        :type vaward.vpid: Long
        :param vaward.num: 数量
        :type vaward.num: Integer
        
        Example::
        
            {
                "vaward.no": "0000000000",
                "vaward.vpid": 1,
                "vaward.num": 21000,
                "vaward.unit": "个"
            }
    
    ### <I> deleteVaward

        删除奖品
        
        判断奖品是否存在 , 不存在 , 错误信息 **160048 奖品不存在**
        
                |Requests:|
                :param vaward.vaid: 奖品ID
        :type vaward.vaid: Long
        
        Example::
        
            {
                "vaward.vaid": 1
            }
            
    ### <I-C> countVaward

        汇总统计奖品信息
    
                |Returns:|
                - **counts**: 统计信息 , 类型 List <List <String>>
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "counts":[
                    ["奖品一", "2"],
                    ["奖品二", "2"],
                ],
                ...
            }

## 计划
    
## api.information.PlanAction

        |DataType:|
        #### plan

    - **pid**: 计划ID
      - 类型: *Long*
    - **task**: 任务 , 类型 [task](./information.html#api.data.TaskAction.task)
      - 类型: *Object*
    - **args**: 任务参数
      - 类型: *String*
    - **cuid**: 创建人ID
      - 类型: *Long*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **executeTime**: 执行时间
      - 类型: *String*
    - **resultFilePath**: 结果文件路径
      - 类型: *String*
    - **resultFileSize**: 结果文件大小
      - 类型: *Integer*
    - **infoFilePath**: 信息文件路径
      - 类型: *String*
    - **infoFileSize**: 信息文件大小
      - 类型: *Integer*
    - **schedule**: 进度 , 范围: 1-100
      - 类型: *Short*
    - **status**: 状态 , 0: 初始 , 1: 取消 , 2: 成功 , 3: 失败 , 4: 执行
      - 类型: *Short*
    - **info**: 结果信息
      - 类型: *String*
    
    ### <I> pagePlan

        分页方式获取计划信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        返回的计划信息为当前操作人创建
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 计划信息列表 , 每条数据类型 *plan*
        :type paging.data: List
        
        Example::
        
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

    ### <I> queryPlan

        查询计划
        
                |Requests:|
                :param plan.pid: 计划ID
        :type plan.pid: Long
        
        Example::
        
            {
                "plan.pid": 1
            }

                |Returns:|
                - **plan**: 计划信息 , 数据类型 *plan*
          - 类型: *Object*
        
        Example::
        
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

    ### <I> existPlan

        判断计划是否存在
        
                |Requests:|
                :param plan.task.keyword: 任务关键字
        :type plan.task.keyword: String
        :param plan.args: 参数
        :type plan.args: String
        
        Example::
        
            {
                "plan.task.keyword": "keyword",
                "plan.args": "args"
            }

                |Returns:|
                - **plans**: 计划信息列表 , 每条数据类型 *plan*
          - 类型: *List*
        
        Example::
        
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

    ### <I> createPlan

        创建计划
        
        当前操作人员拥有未执行任务总数不得超过3个 , 错误信息 **160030 未执行任务达到上限**
        
        执行时间为空 , 立即执行
        
        严格判断执行的任务是否存在 , 不存在不能执行 , 避免通过args进行注入攻击 , 错误信息 **160029 计划不可操作**
        
                |Requests:|
                :param plan.task.tid: 任务ID
        :type plan.task.tid: String
        :param plan.args: 参数
        :type plan.args: String
        :param plan.executeTime: 执行时间
        :type plan.executeTime: String
        
        Example::
        
            {
                "plan.task.tid": 1,
                "plan.args": "2016-01-01 2016-01-01",
                "plan.executeTime": ""
            }

    ### <I> updatePlanForAdvance

        更新计划状态以及进度
        
        判断计划是否存在 , 不存在 , 错误信息 **160028 计划不存在**
        
        判断计划状态是否为0(初始)或4(执行) , 其他状态 , 错误信息 **160029 计划不可操作**
        
                |Requests:|
                :param plan.pid: 计划ID
        :type plan.pid: Long
        :param plan.status: 状态
        :type plan.status: Short
        :param plan.schedule: 进度
        :type plan.schedule: Short
        :param plan.resultFilePath: 结果文件路径
        :type plan.resultFilePath: String
        :param plan.resultFileSize: 结果文件大小
        :type plan.resultFileSize: Integer
        :param plan.infoFilePath: 信息文件路径
        :type plan.infoFilePath: String
        :param plan.infoFileSize: 信息文件大小
        :type plan.infoFileSize: Integer
        
        Example::
        
            {
                "plan.pid": 1
                "plan.status": 1,
                "plan.schedule": 100,
                "plan.resultFilePath": "",
                "plan.resultfileSize": 0,
                "plan.infoFilePath": "",
                "plan.infoFileSize": 0
            }
        
    ### <I> cancelPlan

        注销计划
        
        判断注销计划是否存在 , 不存在 , 错误信息 **160028 计划不存在**
        
        判断注销任务是否归属当前操作人 , 不归属 , 错误信息 **160029 计划不可操作**
        
        判断注销计划状态是否为0(初始) , 错误信息 **160029 计划不可操作**
        
                |Requests:|
                :param plan.pid: 计划ID
        :type plan.pid: String
        
        Example::
        
            {
                "plan.pid": 1
            }
            
## 工单

提供展会/节日等大型活动部分业务支持

## api.information.WorksheetAction

        |DataType:|
        #### worksheet

    - **wsid**: 工单ID
      - 类型: *Long*
    - **code**: 单号
      - 类型: *String*
    - **module**: 模块
      - 类型: *String*
    - **content**: 内容
      - 类型: *String*
    - **path**: 路径
      - 类型: *String*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 初始 , 1: 取消, 2: 处理, 3: 完成
      - 类型: *Short*
    - **handler**: 处理人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **handTime**: 处理时间
      - 类型: *Timestamp*
    - **result**: 结果
      - 类型: *String*

    ### <I> pageWorksheet

        分页方式获取工单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 工单信息列表 , 每条数据类型 *worksheet*
        :type paging.data: List
        
        Example::
        
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

    ### <I> queryWorksheet

        根据创建人查询工单信息
            
    ### <I> addWorksheet

        添加工单
        
                |Requests:|
                :param worksheet.module: 模块
        :type worksheet.module: String
        :param worksheet.content: 内容
        :type worksheet.content: String
        
        Example::
        
            {
                "worksheet.module": "模块",
                "worksheet.content": "内容"
            }

    ### <I> updateWorksheet

        更新
        
        判断工单是否存在 , 不存在 , 错误信息 **160050 工单不存在**
        
                |Requests:|
                :param worksheet.wsid: 工单ID
        :type worksheet.wsid: Long
        :param worksheet.path: 路径
        :type worksheet.path: String
        
        Example::
        
            {
                "worksheet.wsid": 1,
                "worksheet.path": ""
            }
            
    ### <I> cancelWorksheet

        取消工单
        
        判断工单是否存在 , 不存在 , 错误信息 **160050 工单不存在**
        
        判断工单状态是否为0(初始) , 其他状态不可操作 , 错误信息 **160051 工单不可操作**
        
                |Requests:|
                :param worksheet.wsid: 工单ID
        :type worksheet.wsid: Long
        
        Example::
        
            {
                "worksheet.wsid": 1
            }
            
    ### <I> handleWorksheet

        处理工单
        
        判断工单是否存在 , 不存在 , 错误信息 **160050 工单不存在**
        
        判断工单状态是否为0(初始) , 其他状态不可操作 , 错误信息 **160051 工单不可操作**
        
                |Requests:|
                :param worksheet.wsid: 工单ID
        :type worksheet.wsid: Long
        
        Example::
        
            {
                "worksheet.wsid": 1
            }

    ### <I> finishWorksheet

        完成
        
        判断工单是否存在 , 不存在 , 错误信息 **160050 工单不存在**
        
        判断工单状态是否为2(处理) , 其他状态不可操作 , 错误信息 **160051 工单不可操作**
        
                |Requests:|
                :param worksheet.wsid: 工单ID
        :type worksheet.wsid: Long
        
        Example::
        
            {
                "worksheet.wsid": 1
            }
