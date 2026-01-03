
.. _salary:

***************
薪资
***************

通用薪资
================

.. class:: api.salary.SalaryAction

    +---------+
    |DataType:|
    +---------+

    .. data:: salary

    :param sid: 薪资ID
    :type sid: Long
    :param user: 人员 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type user: Object
    :param type: 类型 , 0: 加 , 1: 减
    :type type: Short
    :param onetype: 一类, 0(基本) , 1(提成) , 2(扣款) , 3(其他)
    :type onetype: Short
    :param twotype: 二类, 0(基本) , 1(设计) , 2(业务) , ...
    :type twotype: Short
    :param thrtype: 三类, 0(基本) , 1(主材) , 2(销售) , 3(迟到) , 4(早退)
    :type thrtype: Short
    :param money: 操作金额
    :type money: Long
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param status: 状态, 0(初始) , 1(通过) , 2(拒绝) , 3(撤销)
    :type status: Short
    :param operater: 操作人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type operater: Object
    :param operateTime: 操作时间
    :type operateTime: Timestamp
    :param comment: 说明
    :type comment: String

	.. method:: <I> pageSalary

        分页方式获取薪资信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        +--------+
        |Returns:|
        +--------+

        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 薪资信息列表 , 每条数据类型 :data:`salary`
        :type paging.data: List

        Example::

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
							"operateTime": "2016-01-01",
                            "comment":"说明"
                        }
                    ],
                    ...
                },
                ...
            }
			
    .. method:: <I> addSalary

        添加薪资

        +--------+
        |Request:|
        +--------+

        :param salary.user.uid: 员工ID
        :type salary.user.uid: Long
        :param salary.type: 类型
        :type salary.type: Short
        :param salary.onetype: 一类
        :type salary.onetype: Short
        :param salary.twotype: 二类
        :type salary.twotype: Short
        :param salary.thrtype: 三类
        :type salary.thrtype: Short
        :param salary.money: 操作金额
        :type salary.money: Long
        :param salary.comment: 说明
        :type salary.comment: String

        Example::

            {
                "salary.user.uid": 1,
                "salary.type": 1,
                "salary.money": 500000,
                "salary.twotype": 1,
                "salary.comment": ""
            }
			
    .. method:: <I> passSalary

        通过薪资信息

        判断薪资状态是否为0(初始) , 非初始不能通过 , 错误信息 **280002 薪资状态不可操作**

        +--------+
        |Request:|
        +--------+

        :param salary.sid: 薪资ID
        :type salary.sid: Long

        Example::

            {
                "salary.sid": 1,
            }
			
    .. method:: <I> rejectSalary

        拒绝薪资信息

        判断薪资状态是否为0(初始) , 非初始不能通过 , 错误信息 **280002 薪资状态不可操作**

        +--------+
        |Request:|
        +--------+

        :param salary.sid: 薪资ID
        :type salary.sid: Long

        Example::

            {
                "salary.sid": 1,
            }
			
    .. method:: <I> cancelSalary

        撤销薪资信息

        判断薪资状态是否为0(初始) , 非初始不能通过 , 错误信息 **280002 薪资状态不可操作**

        +--------+
        |Request:|
        +--------+

        :param salary.sid: 薪资ID
        :type salary.sid: Long

        Example::

            {
                "salary.sid": 1,
            }

扣款
================

.. class:: api.salary.WithholdAction

    +---------+
    |DataType:|
    +---------+

    .. data:: withhold

    :param wid: 扣款ID
    :type wid: Long
    :param user: 人员 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type user: Object
    :param type: 类型 , 0: 标准 , 1: 装修款
    :type type: Short
    :param orderId: 装修单号
    :type orderId: String
    :param ident: 引用ID
    :type ident: Long
    :param money: 操作金额
    :type money: Long
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param status: 状态, 0(初始)
    :type status: Short
    :param operater: 操作人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type operater: Object
    :param operateTime: 操作时间
    :type operateTime: Timestamp
    :param comment: 说明
    :type comment: String

	.. method:: <I> pageWithhold

        分页方式获取扣款信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        +--------+
        |Returns:|
        +--------+

        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 扣款信息列表 , 每条数据类型 :data:`withhold`
        :type paging.data: List

        Example::

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
							"operateTime": "2016-01-01",
                            "comment":"说明"
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> queryWithhold
    
        获取扣款信息
        
        +--------+
        |Request:|
        +--------+

        :param withhold.ident: 引用ID
        :type withhold.ident: Long
        :param withhold.type: 类型
        :type withhold.type: Short

        Example::

            {
                "withhold.ident": 1,
                "withhold.type": 1
            }
        
        +--------+
        |Returns:|
        +--------+

        :param withholds: 扣款信息列表 , 每条数据类型 :data:`withhold`
        :type withholds: List

        Example::

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
            
    .. method:: <I> addWithhold
    
        添加扣款信息
        
        +--------+
        |Request:|
        +--------+

        :param withhold.orderId: 装修单号
        :type withhold.orderId: String
        :param withhold.ident: 引用ID
        :type withhold.ident: Long
        :param withhold.type: 类型
        :type withhold.type: Short
        :param withhold.user.uid: 人员ID
        :type withhold.user.uid: Long
        :param withhold.money: 金额
        :type withhold.money: Long
        :param withhold.comment: 说明
        :type withhold.comment: String

        Example::

            {
                "withhold.orderId": "1601010001",
                "withhold.ident": 1,
                "withhold.type": 1,
                "withhold.user.uid": 1,
                "withhold.money": 1000000,
                "withhold.comment": "说明",
            }
            
    .. method:: <I> updateWithholdForStatus
    
        更新扣款信息
        
        判断扣款信息是否存在 , 不存在 , 错误信息 **280013 扣款信息不存在**
        
        +--------+
        |Request:|
        +--------+

        :param withhold.wid: 扣款ID
        :type withhold.wid: Long
        :param withhold.status: 状态
        :type withhold.status: Short

        Example::

            {
                "withhold.wid": 1,
                "withhold.status": 0
            }

装修提成
================

.. class:: api.salary.DecorationSalaryAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: decorationSalary
    
    :param dsid: ID
    :type dsid: Long
    
    .. method:: <I> pageDecorationSalary
    
主材提成
================

.. class:: api.salary.MaterialSalaryAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: materialSalary
    
    :param dsid: ID
    :type dsid: Long
    
    .. method:: <I> pageMaterialSalary

工人帐户
================

.. class:: api.salary.WorkerBalanceAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: workerBalance
    
    :param wbid: 帐户ID
    :type wbid: Long
    :param user: 工人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type user: Object
    :param deposit: 质保金
    :type deposit: Long
    :param salary: 工费
    :type salary: Long
    :param toplimit: 质保金上限
    :type toplimit: Long
    :param status: 状态 , 0: 有效 , 1: 无效
    :type status: Short
    :param company: 公司ID
    :type company: Long
    
    .. method:: <I> pageWorkerBalance
    
        分页方式获取工费帐户信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 工人帐户信息列表 , 每条数据类型 :data:`workerBalance`
        :type paging.data: List
        
        Example::
        
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
            
    .. method:: <I> addWorkerBalance
    
        添加工人帐户信息
        
        判断工人帐户是否存在 , 已存在 , 错误信息 **280008 工人帐户已存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param workerBalance.user.uid: 工人ID
        :type workerBalance.user.uid: Long
        
        Example::
        
            {
                "workerBalance.user.uid": 1
            }
            
    .. method:: <I> updateWorkerBalance
    
        更新工人帐户信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param workerBalance.wbid: 帐户ID
        :type workerBalance.wbid: Long
        :param workerBalance.toplimit: 质保金上限
        :type workerBalance.toplimit: Long
        
        Example::
        
            {
                "workerBalance.wbid": 1,
                "workerBalance.toplimit": 1000000
            }

工人工费
================

.. class:: api.salary.WorkerSalaryAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: workerSalary
    
    :param wsid: 工费ID
    :type wsid: Long
    :param cwsid: 关联工费ID
    :type cwsid: 关联工费ID
    :param orderId: 装修单号
    :type orderId: String
    :param csid: 工程ID
    :type csid: Long
    :param user: 工人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type user: Object
    :param creater: 创建人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type creater: Object
    :param approver: 审批人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type approver: Object
    :param checker: 质检人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type checker: Object
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param approveTime: 审批时间
    :type approveTime: Timestamp
    :param checkTime: 质检时间
    :type checkTime: Timestamp
    :param money: 操作金额
    :type money: Long
    :param deposit: 操作质保金
    :type deposit: Long
    :param salary: 操作工费
    :type salary: Long
    :param type: 类型 , 包括: 0(加), 1(减)
    :type type: Short
    :param onetype: 一类 , 0(工费), 1(扣/罚), 2(转额), 3(其他) 
    :type onetype: Short
    :param twotype: 类型 , 包括: 1(工费), 2(增项), 3(油工一级奖励), 4(维修款), 5(罚款), 6(工程质保金), 7(工具押金), 8(借款), 9(工人家属保险)
    :type twotype: Short
    :param status: 状态 , 包括: 0(初始) , 1(通过) , 2(驳回) , 3(撤销)
    :type status: Short
    :param isSend: 消息状态 , 包括: 0(初始) , 1(待发) , 2(已发)
    :type isSend: Short
    :param isAppr: 审批状态 , 包括: 0(初始) , 1(待发) , 2(已发)
    :type isAppr: Short
    :param isCheck: 质检状态 , 包括: 0(初始) , 1(确认)
    :type isCheck: Short
    :param count: 计数 , 装修单下同一施工节点工费数量 , 状态通过计数
    :type count: Short
    :param comment: 备注
    :type comment: String
    
    .. note::
    
        加类金额根据当前人员帐户中质保金和工费金额操作 , 根据质保金上限 , 如果未达到质保金上限 , 补充到质保金中 , 超出部分补充到工费中 .
        
        减类金额根据当前人员帐户中质保金和工费金额操作 , 扣掉工费金额 , 工费金额不足时 , 扣掉质保金金额 , 质保金不足 , 本次操作失败 . 
    
            +------------------+--------------------------+----------------------------------+
            | twotype          | onetype                  | type                             |
            +==================+==========================+==================================+
            | 1 工费           | 0 工费                   | 0/1 加/减                        |
            +------------------+--------------------------+----------------------------------+
            | 2 增项           | 0 工费                   | 0 加                             |
            +------------------+--------------------------+----------------------------------+
            | 3 油工一级奖励   | 0 工费                   | 0 加                             |
            +------------------+--------------------------+----------------------------------+
            | 4 维修费         | 2 转额                   | 0/1 加/减                        |
            +------------------+--------------------------+----------------------------------+
            | 5 罚款           | 1 扣/罚                  | 1 减                             |
            +------------------+--------------------------+----------------------------------+
            | 6 工程质保金     | 3 其他                   | 0/1 加/减                        |
            +------------------+--------------------------+----------------------------------+
            | 7 工具押金       | 3 其他                   | 0/1 加/减                        |
            +------------------+--------------------------+----------------------------------+
            | 8 借款           | 3 其他                   | 0/1 加/减                        |
            +------------------+--------------------------+----------------------------------+
            | 9 工人家属保险   | 3 其他                   | 0/1 加/减                        |
            +------------------+--------------------------+----------------------------------+
            | 10 附加项        | 3 其他                   | 0/1 加/减                        |
            +------------------+--------------------------+----------------------------------+
            | 11 预支工费      | 3 其他                   | 0/1 加/减                        |
            +------------------+--------------------------+----------------------------------+
            | 12 运费          | 3 其他                   | 0/1 加/减                        |
            +------------------+--------------------------+----------------------------------+
            | 13 上楼费        | 3 其他                   | 0/1 加/减                        |
            +------------------+--------------------------+----------------------------------+
            | 14 工人维修款    | 3 其他                   | 0/1 加/减                        |
            +------------------+--------------------------+----------------------------------+
    
    .. method:: <I> pageWorkerSalary
    
        分页方式获取工人工费信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 工费信息列表 , 每条数据类型 :data:`workerSalary`
        :type paging.data: List
        
        Example::
        
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
            
    .. method:: <I> pageWorkerSalaryByUserId
    
        分页方式获取工人工费信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        通过指定员工编号获取
        
        +---------+
        |Requests:|
        +---------+
        
        :param workerSalary.user.userId: 员工编号
        :type workerSalary.user.userId: String
        
        Example::
        
            {
                "workerSalary.user.userId": "U0409"
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 返工信息列表 , 每条数据类型 :data:`workerSalary`
        :type paging.data: List
        
        Example::
        
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
    
    .. method:: <I> queryWorkerSalary
    
        获取工程对应工人的工费信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param workerSalary.csid: 工程ID
        :type workerSalary.csid: Long
        :param workerSalary.user.userId: 员工编号
        :type workerSalary.user.userId: String
        
        Example::
        
            {
                "workerSalary.csid": 1,
                "workerSalary.user.userId": "U0409",
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param workerSalarys: 工人工费列表 , 每条数据类型 :data:`workerSalary`
        :type workerSalarys: List
        
        Example::
        
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

    .. method:: <I> queryWorkerSalaryByWsid
    
        通过工人工费ID获取工费信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param workerSalary.wsid: 工程ID
        :type workerSalary.wsid: Long
        
        Example::
        
            {
                "workerSalary.wsid": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param workerSalary: 工人工费 , 类型 :data:`workerSalary`
        :type workerSalary: Object
        
        Example::
        
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
            
    .. method:: <I> collectWorkerDeposit
    
        收取工人质保金
        
        判断工人对应的帐户信息是否存在 , 不存在 , 错误信息 **280004 工人帐户不存在**
        
        工费类型限定为: 类型为加类(0) , 一类为其他(3) , 二类为质保金(6)
        
        +---------+
        |Requests:|
        +---------+
        
        :param workerSalary.user.userId: 员工编号
        :type workerSalary.user.userId: String
        :param workerSalary.money: 操作金额
        :type workerSalary.money: Long
        :param workerSalary.comment: 备注
        :type workerSalary.comment: String
        
        Example::
        
            {
                "workerSalary.user.userId": "U0409",
                "workerSalary.money": 500000,
                "workerSalary.comment": ""
            }
    
    .. method:: <I> drawWorkerDeposit
    
        提现工人质保金
        
        判断工人对应的帐户信息是否存在 , 不存在 , 错误信息 **280004 工人帐户不存在**
        
        工人帐户中质保金金额不足 , 错误信息 **280005 质保金金额不足**
        
        工费类型限定为: 类型为减类(1) , 一类为其他(3) , 二类为质保金(6)
        
        +---------+
        |Requests:|
        +---------+
        
        :param workerSalary.user.userId: 员工编号
        :type workerSalary.user.userId: String
        :param workerSalary.money: 操作金额
        :type workerSalary.money: Long
        :param workerSalary.comment: 备注
        :type workerSalary.comment: String
        
        Example::
        
            {
                "workerSalary.user.userId": "U0409",
                "workerSalary.money": 500000,
                "workerSalary.comment": ""
            }
    
    .. method:: <I> addWorkerSalary
    
        添加工人工费
        
        判断工程环节是否存在 , 不存在 , 错误信息 **120024 工程环节不存在**
        
        判断工程环节状态为1(开工) , 其他状态 , 错误信息 **120025 工程环节不可操作**
        
        判断工程环节状态是否为2(完工) , 未完工不可添加 , 错误信息 **120027 工程环节未完工**
        
        判断工人对应的帐户信息是否存在 , 不存在 , 错误信息 **280004 工人帐户不存在**
        
        工费类型限定为: 类型为加类(0) , 一类为工费(0) , 二类为工费/增项/油工一级奖励(1/2/3)

        根据工人工费对应账户中质保金和工费更新工费中对应的金额
        
        +---------+
        |Requests:|
        +---------+
        
        :param workerSalary.user.userId: 员工编号
        :type workerSalary.user.userId: String
        :param workerSalary.orderId: 装修单号
        :type workerSalary.orderId: String
        :param workerSalary.csid: 工程ID
        :type workerSalary.csid: Long
        :param workerSalary.money: 操作金额
        :type workerSalary.money: Long
        :param workerSalary.twotype: 二类
        :type workerSalary.twotype: Short
        :param workerSalary.comment: 备注
        :type workerSalary.comment: String
        
        Example::
        
            {
                "workerSalary.user.userId": "U0409",
                "workerSalary.orderId": 1601010001,
                "workerSalary.csid": 1,
                "workerSalary.money": 500000,
                "workerSalary.twotype": 1,
                "workerSalary.comment": ""
            }
            
    .. method:: <I> cutWorkerSalary
    
        扣款工人工费
        
        判断工人对应的帐户信息是否存在 , 不存在 , 错误信息 **280004 工人帐户不存在**
        
        工人帐户中质保金金额不足 , 错误信息 **280005 质保金金额不足**
        
        工费类型限定为: 类型为减类(0) , 一类为扣/罚(1) , 二类为罚款(5)
        
        根据工人工费对应账户中质保金和工费更新工费中对应的金额
        
        +---------+
        |Requests:|
        +---------+
        
        :param workerSalary.user.userId: 员工编号
        :type workerSalary.user.userId: String
        :param workerSalary.orderId: 装修单号
        :type workerSalary.orderId: String
        :param workerSalary.csid: 工程ID
        :type workerSalary.csid: Long
        :param workerSalary.money: 操作金额
        :type workerSalary.money: Long
        :param workerSalary.twotype: 二类
        :type workerSalary.twotype: Short
        :param workerSalary.comment: 备注
        :type workerSalary.comment: String
        
        Example::
        
            {
                "workerSalary.user.userId": "U0409",
                "workerSalary.orderId": 1601010001,
                "workerSalary.csid": 1,
                "workerSalary.money": 500000,
                "workerSalary.twotype": 5,
                "workerSalary.comment": ""
            }
            
    .. method:: <I> tranWorkerSalary
    
        转款工人工费
        
        判断工人对应的帐户信息是否存在 , 不存在 , 错误信息 **280004 工人帐户不存在**
        
        工人帐户中质保金金额不足 , 错误信息 **280005 质保金金额不足**
        
        工费类型限定为: 一类为转款(2) , 二类为维修金(4)
        
        根据工人工费对应账户中质保金和工费更新工费中对应的金额
        
        根据工人工费信息生成两条工费数据 , 同时进行关联操作
        
        +---------+
        |Requests:|
        +---------+
        
        :param sourceId: 员工编号
        :type sourceId: String
        :param targetId: 员工编号
        :type targetId: String
        
        :param workerSalary.orderId: 装修单号
        :type workerSalary.orderId: String
        :param workerSalary.csid: 工程ID
        :type workerSalary.csid: Long
        :param workerSalary.money: 操作金额
        :type workerSalary.money: Long
        :param workerSalary.twotype: 二类
        :type workerSalary.twotype: Short
        :param workerSalary.comment: 备注
        :type workerSalary.comment: String
        
        Example::
        
            {
                "workerSalary.user.userId": "U0409",
                "workerSalary.orderId": 1601010001,
                "workerSalary.csid": 1,
                "workerSalary.money": 500000,
                "workerSalary.twotype": 1,
                "workerSalary.comment": ""
            }
            
    .. method:: <I> payWorkerSalary
    
        发放工人工费
        
        判断工人对应的帐户信息是否存在 , 不存在 , 错误信息 **280004 工人帐户不存在**
        
        工人帐户中工费金额不足 , 错误信息 **280006 工费金额不足**
        
        工费类型限定为: 类型为减类(1) , 一类为工费(0) , 二类为维修金(1)
        
        +---------+
        |Requests:|
        +---------+
        
        :param workerSalary.user.userId: 员工编号
        :type workerSalary.user.userId: String
        :param workerSalary.money: 操作金额
        :type workerSalary.money: Long
        :param workerSalary.comment: 备注
        :type workerSalary.comment: String
        
        Example::
        
            {
                "workerSalary.user.userId": "U0409",
                "workerSalary.money": 500000,
                "workerSalary.comment": ""
            }
    
    .. method:: <I> adoptWorkerSalary
    
        通过工人工费
        
        判断工费信息是否存在 , 不存在 , 错误信息 **280001 薪资信息不存在**
        
        判断工费状态是否为0(初始) , 非初始不能通过 , 错误信息 **280002 工费状态不可操作**
        
        如果通过的工人工费存在关联工费信息 , 需要一同处理
        
        +---------+
        |Requests:|
        +---------+
        
        :param workerSalarys[n].wsid: 工费ID
        :type workerSalarys[n].wsid: Long
        
        Example::
        
            {
                "workerSalarys[n].wsid": 1
            }
            
    .. method:: <I> rejectWorkerSalary
    
        驳回
        
        判断工费信息是否存在 , 不存在 , 错误信息 **280001 薪资信息不存在**
        
        判断工费状态是否为1(通过) , 非初始不能驳回 , 错误信息 **280002 工费状态不可操作**
        
        如果驳回的工人工费存在关联工费信息 , 需要一同处理 , 关联还原质保金
        
        +---------+
        |Requests:|
        +---------+
        
        :param workerSalary.wsid: 工费ID
        :type workerSalary.wsid: Long
        
        Example::
        
            {
                "workerSalary.wsid": 1
            }

    .. method:: <I> checkWsorkerSalary
    
        质检
        
        判断工费信息是否存在 , 不存在 , 错误信息 **280001 薪资信息不存在**
        
        判断质检状态是否为0(初始) , 其他状态 , 错误信息 **280002 工费状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param workerSalary.wsid: 工费ID
        :type workerSalary.wsid: Long
        
        Example::
        
            {
                "workerSalary.wsid": 1
            }

    .. method:: <I> deleteWorkerSalary
    
        删除工人工费信息
        
        判断工费信息是否存在 , 不存在 , 错误信息 **280001 薪资信息不存在**
        
        判断工费状态是否为0(初始) , 非初始不能删除 , 错误信息 **280002 工费状态不可操作**
        
        操作工费状态置3(撤销)
        
        如果通过的工人工费存在关联工费信息 , 需要一同处理
        
        +---------+
        |Requests:|
        +---------+
        
        :param workerSalary.wsid: 工费ID
        :type workerSalary.wsid: Long
        
        Example::
        
            {
                "workerSalary.wsid": 1
            }

    .. method:: <I> batchWorkerSalary
    
        批量发送工费
        
        利用开始和结束时间作为范围 , 状态为1(通过) , 消息状态为0(初始)
        
        +---------+
        |Requests:|
        +---------+
        
        :param workerSalary.createTime: 开始时间
        :type workerSalary.createTime: Timestamp
        :param workerSalary.endTime: 结束时间
        :type workerSalary.endTime: Timestamp
        
        Example::
        
            {
                "workerSalary.createTime": "2016-01-01 00:00:00",
                "workerSalary.endTime": "2016-01-01 23: 59:59"
            }
            
    .. method:: <I> sendWorkerSalary
    
        发送工费
        
        判断工费信息是否存在 , 不存在 , 错误信息 **280001 薪资信息不存在**
        
        判断工费状态是否为0(初始) , 其他状态 , 错误信息 **280002 工费状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param workerSalary.wsid: 工费Id
        :type workerSalary.wsid: Long
        
        Example::
        
            {
                "workerSalary.wsid": 1
            }
    
    .. method:: <I> cancelWorkerSalary
    
        取消发送工费
    
        判断工费信息是否存在 , 不存在 , 错误信息 **280001 薪资信息不存在**
        
        判断工费状态是否为1(待发) , 其他状态 , 错误信息 **280002 工费状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param workerSalary.wsid: 工费Id
        :type workerSalary.wsid: Long
        
        Example::
        
            {
                "workerSalary.wsid": 1
            }
            
设计师薪资
================

.. class:: api.salary.DesignerSalaryAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: designerSalary
    
    :param dsid: ID
    :type dsid: Long
    
    .. method:: <I> pageDesignerSalary
    
    .. method:: <I> addDesignerSalary
    
    .. method:: <I> updateDesignerSalary
    
    .. method:: <I> adoptDesignerSalary
    
    .. method:: <I> rejectDesignerSalary
    
    .. method:: <I> deleteDesignerSalary

图片
================

图片信息管理 , 提供如楼盘图片等资源

.. class:: api.salary.SalaryDrawingAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: salaryDrawing
    
    :param sdid: 图片ID
    :type sdid: Long
    :param sid: 关联ID
    :type sid: Long
    :param name: 名称
    :type name: String
    :param drawingUrl: 图片路径
    :type drawingUrl: String
    :param drawingType: 图片类型 , 0: 本地 , 1: 钉钉
    :type drawingType: Short
    :param type: 类型 , 0: 工费
    :type type: Short
    :param creater: 创建人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type creater: Object
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param status: 状态 , 0: 有效 , 1: 无效
    :type status: Short
    
    .. method:: <I> querySalaryDrawing
    
        通过关联ID以及类型获取图片信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param salaryDrawing.sid: 关联ID
        :type salaryDrawing.sid: Long
        :param salaryDrawing.type: 类型
        :type salaryDrawing.type: Short
        
        Example::
        
            {
                "salaryDrawing.sid": 1,
                "salaryDrawing.type": 0
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param salaryDrawings: 图片信息列表 , 每条数据类型 :data:`salaryDrawing`
        :type salaryDrawings: List
        
        Example::
        
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
            
    .. method:: <C> addSalaryDrawing
    
        添加图片信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param salaryDrawing.sid: 关联ID
        :type salaryDrawing.sid: Long
        :param salaryDrawing.name: 名称
        :type salaryDrawing.name: String
        :param salaryDrawing.drawingUrl: 路径
        :type salaryDrawing.drawingUrl: String
        :param salaryDrawing.drawingType: 图片类型
        :type salaryDrawing.drawingType: Short
        :param salaryDrawing.type: 类型
        :type salaryDrawing.type: Short
        
        Example::
        
            {
                "salaryDrawing.sid": 1,
                "salaryDrawing.name": "name.jpg",
                "salaryDrawing.drawingUrl": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png",
                "salaryDrawing.drawingType": 0,
                "salaryDrawing.type": 0
            }

    .. method:: <C> deleteSalaryDrawing
    
        删除图片信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param salaryDrawing.sdid: 图片ID
        :type salaryDrawing.sdid: Long
        
        Example::
        
            {
                "salaryDrawing.sdid": 1
            }
