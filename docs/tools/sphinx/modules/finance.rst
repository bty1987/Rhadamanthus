
.. _finance:

***************
财务
***************

财务模块 , 根据收款以及相关数据进行财务相关业务的信息处理 . 

其中科目作为基础数据进行记录以及统计 , 根据账本(期间)进行阶段财务数据的处理工作 , 生成相应的凭证信息 .

凭证信息作为整体数据 , 包括相关时间 , 操作人员信息 .  

凭证信息包括两个部分数据 , 一是账目信息 , 二是辅助核算项目 . 账目信息关联科目信息 , 辅助核算项目关联其他信息 , 如订单 , 楼盘 . 

摘要
================

摘要信息管理 , 提供账目摘要信息选择数据

.. class:: api.finance.AbstractsAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: abstracts
    
    :param aid: 摘要ID
    :type aid: Integer
    :param ownerId: 归属人ID
    :type ownerId: Integer
    :param abstracts: 摘要信息
    :type abstracts: String
    
    .. method:: <F> queryAbstracts
    
        获取操作用户拥有的摘要信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param abstractes: 摘要信息列表 , 每条数据类型 :data:`abstracts`
        :type abstractes: List
        
        Example::
        
            {
                ...
                "abstractes": [
                    {
                        "aid": 1,
                        "ownerId": 34,
                        "abstracts": "摘要"
                    }
                ],
                ...
            }
            
    .. method:: <F> addAbstracts
    
        添加摘要信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param abstracts.abstracts: 摘要信息
        :type abstracts.abstracts: String
        
        Example::
        
            {
                "abstracts.abstracts": "摘要"
            }
            
    .. method:: <F> deleteAbstracts
    
        删除摘要信息
    
        +---------+
        |Requests:|
        +---------+
        
        :param abstracts.aid: 摘要ID
        :type abstracts.aid: Integer
        
        Example::
        
            {
                "abstracts.aid": 1
            }

期间
================

期间信息管理 , 作为关联账本数据信息基础 , 

期间信息格式 yyyyDD

.. class:: api.finance.PeriodAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: period
    
    :param pid: 期间ID
    :type pid: Long
    :param period: 期间
    :type period: String
    :param status: 状态 , 0: 初始 , 1: 关闭
    :type status: String
    
    .. method:: <F> queryPeriod
    
        获取所有期间信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param periods: 期间信息列表 , 每条数据类型 :data:`period`
        :type periods: List
        
        Example::
        
            {
                ...
                "periods": [
                    {
                        "pid": 1,
                        "period": "201601",
                        "status": 0
                    },
                ],
                ...
            }

    .. method:: <F> queryPeriodForCurrent
    
        获取当前最新期间信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param period: 期间信息 , 类型 :data:`period`
        :type period: Object
        
        Example::
        
            {
                ...
                "period": {
                    "pid": 1,
                    "period": "201601",
                    "status": 0
                ],
                ...
            }
            
    .. method:: <F> queryPeriodForOpen
    
        获取处于初始(开启)状态的期间信息 , 提供创建凭证时选择的期间信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param periods: 期间信息列表 , 每条数据类型 :data:`period`
        :type periods: List
        
        Example::
        
            {
                ...
                "periods": [
                    {
                        "pid": 1,
                        "period": "201601",
                        "status": 0
                    },
                ],
                ...
            }

账本
================

账本既期间

依托期间信息 , 根据账本相关操作完成账本(期间)的相关操作

最后一个账本(期间)处于开帐状态 , 同时不能进行关帐动作

.. class:: api.finance.BookAction

    .. method:: <F> checkoutBook
    
        结账 , 完成两个动作 , 一是产生新的期间信息 , 既新账本 ; 二是科目余额产生对应期间数据
        
        
    .. method:: <F> openBook
    
        开帐 , 操作的账本的下一个账本必须处于开帐状态 , 否则不能开帐
        
        +---------+
        |Requests:|
        +---------+
        
        :param period: 期间
        :type period: String
        
        Example::
        
            {
                "period": "201601"
            }
            
    .. method:: <F> closeBook
    
        关帐 , 操作的账本的上一个账本必须处于关帐状态 , 否则不能关帐
        
        +---------+
        |Requests:|
        +---------+
        
        :param period: 期间
        :type period: String
        
        Example::
        
            {
                "period": "201601"
            }

科目
================

科目信息管理

.. class:: api.finance.SubjectAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: subject
    
    :param sid: 科目ID
    :type sid: Long
    :param level: 等级 , 1: 一级 , 2: 二级 , 3: 三级
    :type level: Short
    :param oneCode: 一级编号 , 四位数字组成
    :type oneCode: String
    :param twoCode: 二级编号 , 三位数字组成
    :type twoCode: String
    :param thrCode: 三级编号 , 三位数字组成
    :type thrCode: String
    :param name: 名称
    :type name: String
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    :param code: 编号 , 由一级 , 二级和三级编号组成 , 共十位数字组成
    :type code: String
    :param direction: 余额方向 , 0: 借 , 1: 贷
    :type direction: Short , 0: 
    :param assistant: 辅助核算项目编号列表 , 格式: oi-oa-dsr
    :type assistant: String
    
    .. method:: <F> pageSubject
    
        分页方式获取科目信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 大区信息列表 , 每条数据类型 :data:`region`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "name": "现金",
                            "code": "1010000000",
                            "oneCode": "1010",
                            "thrCode": "000",
                            "twoCode": "000",
                            "direction": 1,
                            "level": 1,
                            "status": 0,
                            "assistant": ""
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <F> querySubject
    
        获取所有科目信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param subjects: 科目信息列表 , 每条数据类型 :data:`subject`
        :type subjects: List
        
        Example::
        
            {
                ...
                "subjects": [
                    {
                        "sid": 1,
                        "name": "现金",
                        "code": "1010000000",
                        "oneCode": "1010",
                        "thrCode": "000",
                        "twoCode": "000",
                        "direction": 1,
                        "level": 1,
                        "status": 0,
                        "assistant": ""
                    }
                ],
                ...
            }
            
    .. method:: <F> querySubjectByNameOCode
    
        通过科目名称或编号获取科目信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param subject.name: 名称
        :type subject.name: String
        :param subject.code: 编号
        :type subject.code: String
        
        Example::
        
            {
                "subject.name": "现金",
                "subject.code": "1010001001"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param region: 大区信息 , 类型 :data:`region`
        :type region: object
        
        Example::
        
            {
                ...
                "subject":{
                    "sid": 1,
                    "name": "现金",
                    "code": "1010000000",
                    "oneCode": "1010",
                    "thrCode": "000",
                    "twoCode": "000",
                    "direction": 1,
                    "level": 1,
                    "status": 0,
                    "assistant": ""
                },
                ...
            }
            
    .. method:: <F> querySubjectByCode
    
        通过编号获取科目信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param subject.code: 编号
        :type subject.code: String
        
        Example::
        
            {
                "subject.code": "1010001001"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param region: 大区信息 , 类型 :data:`region`
        :type region: object
        
        Example::
        
            {
                ...
                "subject":{
                    "sid": 1,
                    "name": "现金",
                    "code": "1010000000",
                    "oneCode": "1010",
                    "thrCode": "000",
                    "twoCode": "000",
                    "direction": 1,
                    "level": 1,
                    "status": 0,
                    "assistant": ""
                },
                ...
            }
            
    .. method:: <F> addSubject
    
        添加科目信息 , 需要区分一 , 二 , 三级科目层级进行添加 , 如果添加二 , 三级科目 , 需要匹配上级科目的编号 , 如果没有上级科目将不能创建 , 如果科目编号存在或者名称存在也不能添加成功
        
        科目编号组成格式 , 准从 4-3-3 的格式 , 由数字组成
        
        一级科目编号为: xxxx 000 000
        
        二级科目编号为: xxxx xxx xxx
        
        三级科目编号为: xxxx xxx xxx
        
        +---------+
        |Requests:|
        +---------+
        
        :param subject.name: 名称
        :type subject.name: String
        :param subject.code: 编号
        :type subject.code: String
        :param subject.oneCode: 一级编号
        :type subject.oneCode: String
        :param subject.twoCode: 二级编号
        :type subject.twoCode: String
        :param subject.thrCode: 三级编号
        :type subject.thrCode: String
        :param subject.direction: 科目余额方向
        :type subject.direction: Short
        :param subject.level: 等级 , 1: 一级 , 2: 二级 , 3: 三级
        :type subject.level: Short
        :param subject.assistant: 辅助核算项
        :type subject.assistant: String
        
        Example::
        
            {
                "subject.name": "现金",
                "subject.code": "1010001001",
                "subject.oneCode": "1010",
                "subject.twoCode": "001",
                "subject.thrCode": "001",
                "subject.direction": 0,
                "subject.level": 3,
                "subject.assistant": ""
            }
            
    .. method:: <F> updateSubject
    
        更新科目信息 , 如果当前科目已经使用将不能进行更新动作
        
        +---------+
        |Requests:|
        +---------+
        
        :param subject.sid: 科目ID
        :type subject.sid: Long
        :param subject.name: 名称
        :type subject.name: String
        :param subject.code: 编号
        :type subject.code: String
        :param subject.oneCode: 一级编号
        :type subject.oneCode: String
        :param subject.twoCode: 二级编号
        :type subject.twoCode: String
        :param subject.thrCode: 三级编号
        :type subject.thrCode: String
        :param subject.direction: 科目余额方向
        :type subject.direction: Short
        :param subject.level: 等级 , 1: 一级 , 2: 二级 , 3: 三级
        :type subject.level: Short
        :param subject.assistant: 辅助核算项
        :type subject.assistant: String
    
        Example::
        
            {
                "subject.sid": 1
                "subject.name": "现金",
                "subject.code": "1010001001",
                "subject.oneCode": "1010",
                "subject.twoCode": "001",
                "subject.thrCode": "001",
                "subject.direction": 0,
                "subject.level": 3,
                "subject.assistant": ""
            }
            
    .. method:: <F> updateSubjectForStatus
        
        更新科目状态
        
        +---------+
        |Requests:|
        +---------+
        
        :param subject.sid: 科目ID
        :type subject.sid: Long
        :param subject.status: 状态
        :type subject.status: Short
    
        Example::
        
            {
                "subject.sid": 1
                "subject.status": 0
            }
            
    .. method:: <F> deleteSubject
    
        删除科目信息 , 已经被引用的科目将不能删除
        
        +---------+
        |Requests:|
        +---------+
        
        :param subject.sid: 科目ID
        :type subject.sid: Long
    
        Example::
        
            {
                "subject.sid": 1
            }
        

科目余额
================

科目余额信息 , 根据期间(账本)进行统计科目对应余额相关数据 , 同时统计年余额

.. class:: api.finance.SubjectBalanceAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: subjectBalance
    
    :param sbId: 科目余额ID
    :type sbId: Long
    :param subject: 科目信息 , 类型 `subject <./finance.html#api.finance.SubjectAction.subject>`_
    :type subject: Object
    :param period: 期间
    :type period: String
    :param total: 总额
    :type total: Float
    :param initial: 起始金额
    :type initial: Float
    :param balance: 期间余额
    :type balance: Float
    :param debit: 借方向余额
    :type debit: Float
    :param credit: 贷方向余额
    :type credit: Float
    :param annual: 年余额
    :type annual: Float
    :param adebit: 年借方向余额
    :type adebit: Float
    :param acredit: 年贷方向余额
    :type acredit: Float
    :param status: 状态 , 0: 初始 , 1: 过期
    :type status: Short
    
    .. method:: <F> pageSubjectBalance
    
        分页方式获取科目余额信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 科目余额信息列表 , 每条数据类型 :data:`subjectBalance`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sbId": 1,
                            "acredit": 0.0,
                            "adebit": 0.0,
                            "annual": 300.0,
                            "balance": 300.0,
                            "credit": 0.0,
                            "debit": 0.0,
                            "initial": 300.0,
                            "period": "201608",
                            "status": 1,
                            "total": 300.0,
                            "subject": {
                                "assistant": "",
                                "code": "1010001001",
                                "direction": 1,
                                "level": 3,
                                "name": "金额",
                                "oneCode": "1010",
                                "sid": 66,
                                "status": 0,
                                "thrCode": "001",
                                "twoCode": "001"
                            }
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <F> querySubjectBalance
    
        获取所有科目余额信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param subjectBalances: 科目余额信息列表 , 每条数据类型 :data:`subjectBalance`
        :type subjectBalances: List
        
        Example::
        
            {
                ...
                "subjectBalances": [
                    {
                        "sbId": 1,
                        "acredit": 0.0,
                        "adebit": 0.0,
                        "annual": 300.0,
                        "balance": 300.0,
                        "credit": 0.0,
                        "debit": 0.0,
                        "initial": 300.0,
                        "period": "201608",
                        "status": 1,
                        "total": 300.0,
                        "subject": {
                            "assistant": "",
                            "code": "1010001001",
                            "direction": 1,
                            "level": 3,
                            "name": "金额",
                            "oneCode": "1010",
                            "sid": 66,
                            "status": 0,
                            "thrCode": "001",
                            "twoCode": "001"
                        }
                    }
                ],
                ...
            }
            
    .. method:: <F> updateSubjectBalanceForBalance
    
        通过科目ID更新科目对应余额信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param subjectBalance.subject.sid: 科目ID
        :type subjectBalance.subject.sid: Long
        :param subjectBalance.balance: 余额金额
        :type subjectBalance.balance: Float
        
        Example::
        
            {
                "subjectBalance.subject.sid": 1,
                "subjectBalance.balance": 100
            }
            
凭证
================

凭证管理 , 凭证相关动作

.. class:: api.finance.VoucherAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: voucher
    
    :param vid: 凭证ID
    :type vid: Long
    :param voucherId: 凭证编号 , 格式为 xxxxxxxxxx , 十位数字组成
    :type voucherId: String
    :param word: 字号 , 格式为XX , 两位大写字符组成
    :type word: String
    :param wordnum: 行号
    :type wordnum: Integer
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param period: 期间
    :type period: String
    :param originator: 创建人 , 类型为 `user <./user.html#api.personel.UserAction.user>`__
    :type originator: Object
    :param auditor: 审计人 , 类型为 `user <./user.html#api.personel.UserAction.user>`__
    :type auditor: Object
    :param auditTime: 审计时间
    :type auditTime: Timestamp
    :param postor: 过账人 , 类型为 `user <./user.html#api.personel.UserAction.user>`__
    :type postor: Object
    :param postTime: 过账时间
    :type postTime: Timestamp
    :param authorizer: 授权人 , 类型为 `user <./user.html#api.personel.UserAction.user>`__
    :type authorizer: Object
    :param cashier: 出纳 , 类型为 `user <./user.html#api.personel.UserAction.user>`__
    :type cashier: Object
    :param reference: 说明
    :type reference: String
    :param attachmentNum: 附件数
    :type attachmentNum: Integer
    :param comment: 备注
    :type comment: String
    :param status: 状态 , 0: 预制 , 1: 正式 , 2: 关闭 , 3: 非正式
    :type status: Short
    :param lockFlag: 锁标识
    :type lockFlag: Short
    :param accounts: 账目信息列表 , 每条数据类型 account
    :type accounts: List
    
    +--------+
    |Filters:|
    +--------+
    
    :param a.ou: 创建人Id
    :type a.ou: String
    :param a.pu: 过账人Id
    :type a.pu: String
    :param a.ct: 创建时间
    :type a.ct: String
    :param a.pt: 过账时间Id
    :type a.pt: String
    :param a.p: 期间
    :type a.p: String
    :param y.a: 账目摘要
    :type y.a: String
    
    .. method:: <F> pageVoucher
    
        分页方式获取凭证信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 凭证信息列表 , 每条数据类型 :data:`voucher`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "accounts": [
                                {
                                    "abstracts": "摘要",
                                    "aid": 2,
                                    "assistant": null,
                                    "businessTime": null,
                                    "createTime": null,
                                    "credit": 100.0,
                                    "debit": 0.0,
                                    "oneCode": "1010",
                                    "period": "201601",
                                    "saId": 0,
                                    "status": 0,
                                    "subjectName": "现金",
                                    "thrCode": "001",
                                    "twoCode": "001",
                                    "voucher": null,
                                    "word": "DR"
                                },
                                {
                                    "abstracts": "摘要",
                                    "aid": 1,
                                    "assistant": null,
                                    "businessTime": null,
                                    "createTime": null,
                                    "credit": 0.0,
                                    "debit": 100.0,
                                    "oneCode": "1020",
                                    "period": "201601",
                                    "saId": 0,
                                    "status": 0,
                                    "subjectName": "银行卡",
                                    "thrCode": "001",
                                    "twoCode": "001",
                                    "voucher": null,
                                    "word": "DR"
                                }
                            ],
                            "attachmentNum": 0,
                            "auditTime": null,
                            "auditor": null,
                            "authorizer": null,
                            "cashier": null,
                            "comment": "",
                            "createTime": "2016-09-18",
                            "lockFlag": null,
                            "originator": {
                                "currentName": "白雪",
                                "dept": null,
                                "deptType": "设计部",
                                "duty": "设计师",
                                "uid": 2146,
                                "userId": "U001",
                                "userName": "白雪",
                            },
                            "period": "201610",
                            "postTime": "2016-01-01",
                            "postor": null,
                            "reference": "",
                            "status": 1,
                            "vid": 1,
                            "voucherId": "1100000019",
                            "word": "DR",
                            "wordnum": 0
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <F> queryVoucherByVId
    
        通过凭证ID获取凭证信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param voucher.vid: 凭证ID
        :type voucher.vid: Long
        
        Example::
        
            {
                "voucher.vid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param voucher: 凭证信息 , 类型 :data:`voucher`
        :type voucher: object
        
        Example::
        
            {
                ...
                "voucher":{
                    "accounts": [
                        {
                            "abstracts": "摘要",
                            "aid": 2,
                            "assistant": null,
                            "businessTime": null,
                            "createTime": null,
                            "credit": 100.0,
                            "debit": 0.0,
                            "oneCode": "1010",
                            "period": "201601",
                            "saId": 0,
                            "status": 0,
                            "subjectName": "现金",
                            "thrCode": "001",
                            "twoCode": "001",
                            "voucher": null,
                            "word": "DR"
                        },
                        {
                            "abstracts": "摘要",
                            "aid": 1,
                            "assistant": null,
                            "businessTime": null,
                            "createTime": null,
                            "credit": 0.0,
                            "debit": 100.0,
                            "oneCode": "1020",
                            "period": "201601",
                            "saId": 0,
                            "status": 0,
                            "subjectName": "银行卡",
                            "thrCode": "001",
                            "twoCode": "001",
                            "voucher": null,
                            "word": "DR"
                        }
                    ],
                    "attachmentNum": 0,
                    "auditTime": null,
                    "auditor": null,
                    "authorizer": null,
                    "cashier": null,
                    "comment": "",
                    "createTime": "2016-09-18",
                    "lockFlag": null,
                    "originator": {
                        "currentName": "白雪",
                        "dept": null,
                        "deptType": "设计部",
                        "duty": "设计师",
                        "uid": 2146,
                        "userId": "U001",
                        "userName": "白雪",
                    },
                    "period": "201610",
                    "postTime": "2016-09-18",
                    "postor": null,
                    "reference": "",
                    "status": 1,
                    "vid": 1,
                    "voucherId": "1100000019",
                    "word": "DR",
                    "wordnum": 0
                },
                ...
            }
            
    .. method:: <F> addVoucher
    
        添加凭证信息 , 在添加凭证信息之前 , 账目信息以及辅助核算项目信息存储到临时数据中 , 通过ID列表进行关联动作
        
        +---------+
        |Requests:|
        +---------+
        
        :param voucher.word: 字号 , 格式为XX , 两位大写字符组成
        :type voucher.word: String
        :param voucher.reference: 说明
        :type voucher.reference: String
        :param voucher.createTime: 创建时间
        :type voucher.createTime: Timestamp
        :param voucher.attachmentNum: 附件数
        :type voucher.attachmentNum: Integer
        :param voucher.comment: 备注
        :type voucher.comment: String
        :param atIds[n]: 临时账目ID列表
        :type atIds[n]: List
        
        Example::
        
            {
                "voucher.word": "DD",
                "voucher.reference": "说明",
                "voucher.createTime": "2016-01-01 00:00:00",
                "voucher.attachmentNum": 0,
                "voucher.comment": "备注",
                "atIds[0]": 152,
                "atIds[1]": 352
            }

    .. method:: <F> updateVoucher
    
        更新凭证信息 , 只有预制凭证能够进行更新动作
        
        更新动作利用临时数据与凭证中账目和辅助核算项信息进行比较 , 之后完成更新动作
        
        +---------+
        |Requests:|
        +---------+
        
        :param voucher.vid: 凭证ID
        :type voucher.vid: Long
        :param voucher.reference: 说明
        :type voucher.reference: String
        :param voucher.createTime: 创建时间
        :type voucher.createTime: Timestamp
        :param voucher.postTime: 过账时间
        :type voucher.postTime: Timestamp
        :param voucher.attachmentNum: 附件数
        :type voucher.attachmentNum: Integer
        :param voucher.comment: 备注
        :type voucher.comment: String
        :param atIds[n]: 临时创建账目ID列表
        :type atIds[n]: List
        :param uatIds[n]: 临时更新账目ID列表
        :type uatIds[n]: List
        :param datIds[n]: 删除账目ID列表
        :type datIds[n]: List
        
        Example::
        
            {
                "voucher.vid": 1,
                "voucher.word": "DD",
                "voucher.reference": "说明",
                "voucher.createTime": "2016-01-01 00:00:00",
                "voucher.attachmentNum": 0,
                "voucher.comment": "备注",
                "atIds[0]": 152,
                "atIds[1]": 352,
                "uatIds[0]": 452,
                "datIds[0]": 23
            }

    .. method:: <F> postVoucher
    
        过账凭证
        
        +---------+
        |Requests:|
        +---------+
        
        :param voucher.vid: 凭证ID
        :type voucher.vid: Long
        
        Example::
        
            {
                "voucher.vid": 1,
            }
    
    .. method:: <F> postVouchers
    
        批量过账凭证
        
        +---------+
        |Requests:|
        +---------+
        
        :param vids[n]: 凭证ID列表 , 每条数据类型 Long
        :type vids[n]: List
        
        Example::
        
            {
                "vids[n]": 32,
            }
            
    .. method:: <F> inpostVoucher
    
        反审核凭证
        
        +---------+
        |Requests:|
        +---------+
        
        :param voucher.vid: 凭证ID
        :type voucher.vid: Long
        
        Example::
        
            {
                "voucher.vid": 1,
            }
            
账目
================

账目信息管理

.. class:: api.finance.AccountAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: account
    
    :param aid: 账目ID
    :type aid: Long
    :param voucher: 所属凭证 , 类型 `voucher <./finance.html#api.system.RegionAction.voucher>`__
    :type voucher: Object
    :param assistant: 辅助核算项 , 类型 `assistant <./finance.html#api.system.RegionAction.assistant>`__
    :type assistant: Object
    :param word: 字号
    :type word: String
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param period: 期间
    :type period: String
    :param saId: 序号
    :type saId: Integer
    :param abstracts: 摘要
    :type abstracts: String
    :param oneCode: 一级编号
    :type oneCode: String
    :param twoCode: 二级编号
    :type twoCode: String
    :param thrCode: 三级编号
    :type thrCode: String
    :param subjectName: 科目名称
    :type subjectName: String
    :param debit: 借金额
    :type debit: Float
    :param credit: 贷金额
    :type credit: Float
    :param businessTime: 业务时间
    :type businessTime: Timestamp
    :param status: 状态 , 0: 预制 , 1: 正式 , 2: 关闭
    :type status: Short
    
    .. data:: assistant
    
    :param assistant.aid: 辅助核算项ID
    :type assistant.aid: Long
    :param assistant.orderId: 订单号
    :type assistant.orderId: String
    :param assistant.orderAddr: 楼盘地址
    :type assistant.orderAddr: String
    :param assistant.msoNo: 主材订单号
    :type assistant.msoNo: String
    :param assistant.user: 员工 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type assistant.user: Object
    :param assistant.department: 部门 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type assistant.department: Object
    :param assistant.designRegion: 设计分区 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type assistant.designRegion: Object
    :param assistant.designDepartment: 设计部 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type assistant.designDepartment: Object
    :param assistant.deginer: 设计师 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type assistant.designer: Object
    :param assistant.businessRegion: 业务分区 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type assistant.businessRegion: Object
    :param assistant.businessDepartment: 业务部 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type assistant.businessDepartment: Object
    :param assistant.salesman: 业务员 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type assistant.salesman: Object
    :param assistant.supervisDepartment: 监理部 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type assistant.supervisDepartment: Object
    :param assistant.supervisor: 监理 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type assistant.supervisor: Object
    :param assistant.workDepartment: 工人部 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type assistant.workDepartment: Object
    :param assistant.worker: 工人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type assistant.worker: Object
    :param assistant.officeDepartment: 职能部 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type assistant.officeDepartment: Object
    :param assistant.officer: 职能员工 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type assistant.officer: Object
    :param assistant.materialDepartment: 主材部 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type assistant.materialDepartment: Object
    :param assistant.materialer: 主材员 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type assistant.materialer: Object
    :param assistant.brandName: 型号名
    :type assistant.brandName: String
    :param assistant.company: 公司
    :type assistant.company: Short
    
    +--------+
    |Filters:|
    +--------+
    
    :param a.ou: 创建人ID
    :type a.ou: String
    :param a.pu: 过账人ID
    :type a.pu: String
    :param a.ct: 创建时间
    :type a.ct: String
    :param a.pt: 过账时间
    :type a.pt: String
    :param a.p: 期间
    :type a.p: String
    :param c.oi: 订单编号
    :type c.oi: String
    :param c.mn: 主材订单编号
    :type c.mn: String
    :param c.du: 设计师ID
    :type c.du: String
    :param c.su: 业务员ID
    :type c.su: String
    :param c.vu: 监理ID
    :type c.vu: String
    :param c.wu: 工人ID
    :type c.wu: String
    :param c.ou: 员工ID
    :type c.ou: String
    :param c.mu: 主材人员ID
    :type c.mu: String
    :param c.dr: 设计大区ID
    :type c.dr: String
    :param c.dd: 设计部ID
    :type c.dd: String
    :param c.br: 业务大区ID
    :type c.br: String
    :param c.db: 业务部ID
    :type c.db: String
    :param c.sd: 监理部ID
    :type c.sd: String
    :param c.wd: 工人部ID
    :type c.wd: String
    :param c.od: 员工部ID
    :type c.od: String
    :param c.md: 主材部ID
    :type c.md: String
    
    .. method:: <F> pageAccount
    
        分页方式获取账目信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 账目信息列表 , 每条数据类型 :data:`account`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "abstracts": "摘要",
                            "aid": 1,
                            "assistant": null,
                            "businessTime": null,
                            "createTime": null,
                            "credit": 0.0,
                            "debit": 100.0,
                            "oneCode": "1010",
                            "period": "201601",
                            "saId": 0,
                            "status": 0,
                            "subjectName": "现金",
                            "thrCode": "001",
                            "twoCode": "001",
                            "voucher": {
                                "accounts": null,
                                "attachmentNum": 0,
                                "auditTime": null,
                                "auditor": null,
                                "authorizer": null,
                                "cashier": null,
                                "comment": "",
                                "createTime": "2016-09-18",
                                "lockFlag": null,
                                "originator": {
                                    "currentName": "白雪",
                                    "dept": null,
                                    "deptType": "设计部",
                                    "duty": "设计师",
                                    "uid": 2146,
                                    "userId": "U001",
                                    "userName": "白雪",
                                },
                                "period": "201601",
                                "postTime": "2016-01-01",
                                "postor": null,
                                "reference": "",
                                "status": 1,
                                "vid": 1,
                                "voucherId": "1100000019",
                                "word": "DR",
                                "wordnum": 0
                            },
                            "word": "DR"
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <F> queryAccountByAId
    
        通过账目编号获取账目信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param account.aid: 账目ID
        :type account.aid: Long
        
        Example::
        
            {
                "account.aid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param account: 账目信息 , 类型 :data:`account`
        :type account: object
        
        Example::
        
            {
                ...
                "account":{
                    "abstracts": "摘要",
                    "aid": 1,
                    "assistant": null,
                    "businessTime": null,
                    "createTime": null,
                    "credit": 0.0,
                    "debit": 100.0,
                    "oneCode": "1010",
                    "period": "201601",
                    "saId": 0,
                    "status": 0,
                    "subjectName": "现金",
                    "thrCode": "001",
                    "twoCode": "001",
                    "voucher": {
                        "accounts": null,
                        "attachmentNum": 0,
                        "auditTime": null,
                        "auditor": null,
                        "authorizer": null,
                        "cashier": null,
                        "comment": "",
                        "createTime": "2016-09-18",
                        "lockFlag": null,
                        "originator": {
                            "currentName": "白雪",
                            "dept": null,
                            "deptType": "设计部",
                            "duty": "设计师",
                            "uid": 2146,
                            "userId": "U001",
                            "userName": "白雪",
                        },
                        "period": "201601",
                        "postTime": "2016-01-01",
                        "postor": null,
                        "reference": "",
                        "status": 1,
                        "vid": 1,
                        "voucherId": "1100000019",
                        "word": "DR",
                        "wordnum": 0
                    },
                    "word": "DR"
                },
                ...
            }

    .. method:: <F> queryAccountForFormalByAId
    
        通过账目编号获取账目信息 , 同时将账目以及辅助核算项目信息提交到临时数据中 , 以便提供编辑操作
        
        +---------+
        |Requests:|
        +---------+
        
        :param account.aid: 账目ID
        :type account.aid: Long
        
        Example::
        
            {
                "account.aid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param account: 账目信息 , 类型 :data:`account`
        :type account: object
        
        Example::
        
            {
                ...
                "account":{
                    "abstracts": "摘要",
                    "aid": 1,
                    "assistant": null,
                    "businessTime": null,
                    "createTime": null,
                    "credit": 0.0,
                    "debit": 100.0,
                    "oneCode": "1010",
                    "period": "201601",
                    "saId": 0,
                    "status": 0,
                    "subjectName": "现金",
                    "thrCode": "001",
                    "twoCode": "001",
                    "voucher": {
                        "accounts": null,
                        "attachmentNum": 0,
                        "auditTime": null,
                        "auditor": null,
                        "authorizer": null,
                        "cashier": null,
                        "comment": "",
                        "createTime": "2016-09-18",
                        "lockFlag": null,
                        "originator": {
                            "currentName": "白雪",
                            "dept": null,
                            "deptType": "设计部",
                            "duty": "设计师",
                            "uid": 2146,
                            "userId": "U001",
                            "userName": "白雪",
                        },
                        "period": "201601",
                        "postTime": "2016-01-01",
                        "postor": null,
                        "reference": "",
                        "status": 1,
                        "vid": 1,
                        "voucherId": "1100000019",
                        "word": "DR",
                        "wordnum": 0
                    },
                    "word": "DR"
                },
                ...
            }
            
    .. method:: <F> addAccount
    
        添加账目信息到临时数据中 , 提供提交凭证时进行管理数据使用
        
        +---------+
        |Requests:|
        +---------+
        
        :param account.word: 字号
        :type account.word: String
        :param account.period: 期间
        :type account.period: String
        :param account.abstracts: 摘要
        :type account.abstracts: String
        :param account.oneCode: 一级编号
        :type account.oneCode: String
        :param account.twoCode: 二级编号
        :type account.twoCode: String
        :param account.thrCode: 三级编号
        :type account.thrCode: String
        :param account.subjectName: 科目名称
        :type account.subjectName: String
        :param account.debit: 借金额
        :type account.debit: Float
        :param account.credit: 贷金额
        :type account.credit: Float
        
        :param account.assistant.orderId: 订单号
        :type account.assistant.orderId: String
        :param account.assistant.orderAddr: 楼盘地址
        :type account.assistant.orderAddr: String
        :param account.assistant.msoNo: 主材订单号
        :type account.assistant.msoNo: String
        :param account.assistant.user.uid: 员工ID
        :type account.assistant.user.uid: Integer
        :param account.assistant.department.did: 部门ID
        :type account.assistant.department.did: Integer
        :param account.assistant.designRegion.did: 设计分区ID
        :type account.assistant.designRegion.did: Integer
        :param account.assistant.designDepartment.did: 设计部ID
        :type account.assistant.designDepartment.did: Integer
        :param account.assistant.deginer.uid: 设计师ID
        :type account.assistant.designer.uid: Integer
        :param account.assistant.businessRegion.did: 业务分区ID
        :type account.assistant.businessRegion.did: Integer
        :param account.assistant.businessDepartment.did: 业务部ID
        :type account.assistant.businessDepartment.did: Integer
        :param account.assistant.salesman.uid: 业务员ID
        :type account.assistant.salesman.uid: Integer
        :param account.assistant.supervisDepartment.did: 监理部
        :type account.assistant.supervisDepartment.did: Integer
        :param account.assistant.supervisor.uid: 监理ID
        :type account.assistant.supervisor.uid: Integer
        :param account.assistant.workDepartment.did: 工人部ID
        :type account.assistant.workDepartment.did: Integer
        :param account.assistant.worker.uid: 工人ID
        :type account.assistant.worker.uid: Integer
        :param account.assistant.officeDepartment.did: 职能部ID
        :type account.assistant.officeDepartment.did: Integer
        :param account.assistant.officer.uid: 职能员工ID
        :type account.assistant.officer.uid: Integer
        :param account.assistant.materialDepartment.did: 主材部ID
        :type account.assistant.materialDepartment.did: Integer
        :param account.assistant.materialer.uid: 主材员ID
        :type account.assistant.materialer.uid: Integer
        :param account.assistant.brandName: 型号名
        :type account.assistant.brandName: String
        :param account.assistant.company: 公司
        :type account.assistant.company: Short
        
        Example::
        
            {
                "account.subjectName": "现金",
                "account.abstracts": "摘要",
                "account.period": "201601",
                "account.word": "DR",
                "account.credit": 0.0,
                "account.debit": 100.0,
                "account.oneCode": "1010",
                "account.twoCode": "001",
                "account.thrCode": "001",
                "account.assistant.orderId": "1601010001"
            }
            
    .. method:: <F> updateAccount
    
        更新账目信息到临时信息中
        
        +---------+
        |Requests:|
        +---------+
        
        :param account.aid: 账目ID
        :type account.aid: Long
        :param account.word: 字号
        :type account.word: String
        :param account.period: 期间
        :type account.period: String
        :param account.abstracts: 摘要
        :type account.abstracts: String
        :param account.oneCode: 一级编号
        :type account.oneCode: String
        :param account.twoCode: 二级编号
        :type account.twoCode: String
        :param account.thrCode: 三级编号
        :type account.thrCode: String
        :param account.subjectName: 科目名称
        :type account.subjectName: String
        :param account.debit: 借金额
        :type account.debit: Float
        :param account.credit: 贷金额
        :type account.credit: Float
        
        :param account.assistant.orderId: 订单号
        :type account.assistant.orderId: String
        :param account.assistant.orderAddr: 楼盘地址
        :type account.assistant.orderAddr: String
        :param account.assistant.msoNo: 主材订单号
        :type account.assistant.msoNo: String
        :param account.assistant.user.uid: 员工ID
        :type account.assistant.user.uid: Integer
        :param account.assistant.department.did: 部门ID
        :type account.assistant.department.did: Integer
        :param account.assistant.designRegion.did: 设计分区ID
        :type account.assistant.designRegion.did: Integer
        :param account.assistant.designDepartment.did: 设计部ID
        :type account.assistant.designDepartment.did: Integer
        :param account.assistant.deginer.uid: 设计师ID
        :type account.assistant.designer.uid: Integer
        :param account.assistant.businessRegion.did: 业务分区ID
        :type account.assistant.businessRegion.did: Integer
        :param account.assistant.businessDepartment.did: 业务部ID
        :type account.assistant.businessDepartment.did: Integer
        :param account.assistant.salesman.uid: 业务员ID
        :type account.assistant.salesman.uid: Integer
        :param account.assistant.supervisDepartment.did: 监理部
        :type account.assistant.supervisDepartment.did: Integer
        :param account.assistant.supervisor.uid: 监理ID
        :type account.assistant.supervisor.uid: Integer
        :param account.assistant.workDepartment.did: 工人部ID
        :type account.assistant.workDepartment.did: Integer
        :param account.assistant.worker.uid: 工人ID
        :type account.assistant.worker.uid: Integer
        :param account.assistant.officeDepartment.did: 职能部ID
        :type account.assistant.officeDepartment.did: Integer
        :param account.assistant.officer.uid: 职能员工ID
        :type account.assistant.officer.uid: Integer
        :param account.assistant.materialDepartment.did: 主材部ID
        :type account.assistant.materialDepartment.did: Integer
        :param account.assistant.materialer.uid: 主材员ID
        :type account.assistant.materialer.uid: Integer
        :param account.assistant.brandName: 型号名
        :type account.assistant.brandName: String
        :param account.assistant.company: 公司
        :type account.assistant.company: Short
        
        Example::
        
            {
                "account.aid": 2,
                "account.subjectName": "现金",
                "account.abstracts": "摘要",
                "account.period": "201601",
                "account.word": "DR",
                "account.credit": 0.0,
                "account.debit": 100.0,
                "account.oneCode": "1010",
                "account.twoCode": "001",
                "account.thrCode": "001",
                "account.assistant.orderId": "1601010001"
            }
            
    .. method:: <F> deleteAccount
    
        删除临时账目信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param account.aid: 账目ID
        :type account.aid: Long
        
        Example::
        
            {
                "account.aid": 2
            }
