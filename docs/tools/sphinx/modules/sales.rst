
.. _sales:

***************
销售
***************

销售
================

销售单
----------------

.. class:: api.material.SalesAction

    +---------+
    |DataType:|
    +---------+

    .. data:: sales
    
    :param sid: 销售单ID
    :type sid: Long
    :param no: 编号 , 由日期加六位格式计数组成 , 例: 1601010001
    :type no: String
    :param orderId: 装修单号
    :type orderId: String
    :param phone: 电话
    :type phone: String
    
    :param supplier: 厂商 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type supplier: Object
    
    :param grade: 等级 , 包括: A/B/C
    :type grade: String
    :param house: 房产 , 类型 `house <./data.html#api.data.HouseAction.house>`__
    :type house: Object
    
    :param salesman: 业务员 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type salesman: Object
    :param dept: 部门 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type dept: Object
    :param region: 分区 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type region: Object
    :param guider: 导购 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type guider: Object
    :param instorer: 驻店 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type instorer: Object
    :param guideDept: 导购归属部门 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type guideDept: Object
    :param finisher: 完结人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type finisher: Object
    
    :param category: 品类
    :type category: String
    :param bid: 品牌ID
    :type bid: Long
    :param brand: 品牌
    :type brand: String
    
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param balanceTime: 结算时间
    :type balanceTime: Timestamp
    :param fullpayTime: 补款时间
    :type fullpayTime: Timestamp
    :param finishTime: 完结时间
    :type finishTime: Timestamp
    :param affirmTime: 确认时间
    :type affirmTime: Timestamp
    
    :param isAffirm: 确认状态
    :type isAffirm: Short
    :param status: 状态 , 0: 初始 , 2: 全退 , 3: 倒单 , 4: 废单 , 5: 完结
    :type status: Short
    :param depositpay: 定金
    :type depositpay: Long
    :param depositpayStatus: 定金状态 , -1: 初始, 0: 未付款, 1: 已付款, 2: 已确认
    :type depositpayStatus: Short
    :param fullpay: 补款
    :type fullpay: Long
    :param fullpayStatus: 补款状态 , -1: 初始, 0: 未付款, 1: 已付款, 2: 已确认
    :type fullpayStatus: Short
    :param balanceStatus: 结算状态 , 0: 初始 , 1: 预结算 , 2: 厂商结算 , 3: 结算 , 4: 完结
    :type balanceStatus: Short
    
    :param total: 总额
    :type total: Long
    :param amount: 总额 , 当前总额
    :type amount: Long
    :param maling: 抹零
    :type maling: Integer
    :param venderMaling: 厂商抹零
    :type venderMaling: Integer
    :param coupon: 券值
    :type coupon: Integer
    :param couponInfo: 券信息 , 例: #洁具券:150#
    :type couponInfo: String
    :param ctype: 结算类型 , 0: 底价 , 1: 点位 , 2: 不计算(默认)
    :type ctype: Short
    :param cvalue: 结算值
    :type cvalue: Long
    
    :param comment: 备注
    :type comment: String
    
    :param company: 公司 , 通常为销售公司
    :type company: Long
    :param dompany: 公司 , 通常为装修公司
    :type dompany: Long
    :param pompany: 公司 , 通常为收款公司
    :type pompany: Long
    
    +--------+
    |Filters:|
    +--------+
    
    :param no: 销售单号
    :type no: String
    :param orderId: 装修单号
    :type orderId: String
    :param instorerId: 驻店员编号
    :type instorerId: String
    :param salesmanId: 业务员编号
    :type salesmanId: String
    :param salesmanName: 业务员名
    :type salesmanName: String
    :param fullpayTimeRange: 补款收款时间 , 格式: 2016/01/01-2016/01/01
    :type fullpayTimeRange: String
    
    .. method:: <I> pageSales
    
        分页方式获取销售单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        根据当前操作用户信息 , 过滤销售单归属人员 , 包括业务 , 驻店 , 导购
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 销售单信息列表 , 每条数据类型 :data:`sales`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "no": "1601010001",
                            "orderId": "1601010001",
                            "phone": "",
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
                                "duty": "导购"
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
                                "name": "导购一部",
                                "type": "导购部",
                            },
                            "finisher": {
                                "uid": 100,
                                "userId": "U073",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "财务"
                            },
                            "grade": "A",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "comment": "",
                            "createTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "finishTime": "2016-01-01 00:00:00",
                            "affirmTime": "2016-01-01 00:00:00",
                            "isAffirm": 0,
                            "status": 0,
                            "depositpay": 100000,
                            "depositpayStatus": 1,
                            "fullpay": 0,
                            "fullpayStatus": 0,
                            "balanceStatus": 0,
                            "total": 100000,
                            "amount": 100000,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": ""
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> pageSalesForDompany
    
        分页方式获取销售单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        通过销售单归属的第二公司进行查询 , 第二公司为装修单公司
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 销售单信息列表 , 每条数据类型 :data:`sales`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "no": "1601010001",
                            "orderId": "1601010001",
                            "phone": "",
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
                                "duty": "导购"
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
                                "name": "导购一部",
                                "type": "导购部",
                            },
                            "finisher": {
                                "uid": 100,
                                "userId": "U073",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "财务"
                            },
                            "grade": "A",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "comment": "",
                            "createTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "finishTime": "2016-01-01 00:00:00",
                            "affirmTime": "2016-01-01 00:00:00",
                            "isAffirm": 0,
                            "status": 0,
                            "depositpay": 100000,
                            "depositpayStatus": 1,
                            "fullpay": 0,
                            "fullpayStatus": 0,
                            "balanceStatus": 0,
                            "total": 100000,
                            "amount": 100000,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": ""
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> pageSalesForPompany
    
        分页方式获取销售单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        通过销售单归属的第三公司进行查询 , 第三公司为款项公司
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 销售单信息列表 , 每条数据类型 :data:`sales`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "no": "1601010001",
                            "orderId": "1601010001",
                            "phone": "",
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
                                "duty": "导购"
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
                                "name": "导购一部",
                                "type": "导购部",
                            },
                            "finisher": {
                                "uid": 100,
                                "userId": "U073",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "财务"
                            },
                            "grade": "A",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "comment": "",
                            "createTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "finishTime": "2016-01-01 00:00:00",
                            "affirmTime": "2016-01-01 00:00:00",
                            "isAffirm": 0,
                            "status": 0,
                            "depositpay": 100000,
                            "depositpayStatus": 1,
                            "fullpay": 0,
                            "fullpayStatus": 0,
                            "balanceStatus": 0,
                            "total": 100000,
                            "amount": 100000,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": ""
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> pageSalesForSupplier
    
        分页方式获取销售单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        根据当前操作用户信息 , 查询对应厂商对应的销售单
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 销售单信息列表 , 每条数据类型 :data:`sales`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "no": "1601010001",
                            "orderId": "1601010001",
                            "phone": "",
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
                                "duty": "导购"
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
                                "name": "导购一部",
                                "type": "导购部",
                            },
                            "finisher": {
                                "uid": 100,
                                "userId": "U073",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "财务"
                            },
                            "grade": "A",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "comment": "",
                            "createTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "finishTime": "2016-01-01 00:00:00",
                            "affirmTime": "2016-01-01 00:00:00",
                            "isAffirm": 0,
                            "status": 0,
                            "depositpay": 100000,
                            "depositpayStatus": 1,
                            "fullpay": 0,
                            "fullpayStatus": 0,
                            "balanceStatus": 0,
                            "total": 100000,
                            "amount": 100000,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": ""
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> pageSalesForAdvance
    
        分页方式获取销售单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 销售单信息列表 , 每条数据类型 :data:`sales`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "no": "1601010001",
                            "orderId": "1601010001",
                            "phone": "",
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
                                "duty": "导购"
                            },
                            "instorer": {
                                "uid": 3,
                                "userId": "U0032",
                                "userName": "驻店",
                                "currentName": "驻店",
                                "duty": "驻店"
                            },
                            "guideDept": {
                                "did": 1,
                                "no": "D003",
                                "name": "导购一部",
                                "type": "导购部",
                            },
                            "finisher": {
                                "uid": 100,
                                "userId": "U073",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "财务"
                            },
                            "grade": "A",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "comment": "",
                            "createTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "finishTime": "2016-01-01 00:00:00",
                            "affirmTime": "2016-01-01 00:00:00",
                            "isAffirm": 0,
                            "status": 0,
                            "depositpay": 100000,
                            "depositpayStatus": 1,
                            "fullpay": 0,
                            "fullpayStatus": 0,
                            "balanceStatus": 0,
                            "total": 100000,
                            "amount": 100000,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": ""
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> pageSalesForBalance
    
        分页方式获取进行预结算的销售单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        需要预结算的销售单条件 , 补款状态为2(已确认) , 结算状态为0(初始)
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 销售单信息列表 , 每条数据类型 :data:`sales`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "no": "1601010001",
                            "orderId": "1601010001",
                            "phone": "",
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
                                "duty": "导购"
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
                                "name": "导购一部",
                                "type": "导购部",
                            },
                            "finisher": {
                                "uid": 100,
                                "userId": "U073",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "财务"
                            },
                            "grade": "A",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "createTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "finishTime": "2016-01-01 00:00:00",
                            "affirmTime": "2016-01-01 00:00:00",
                            "isAffirm": 0,
                            "status": 0,
                            "depositpay": 100000,
                            "depositpayStatus": 1,
                            "fullpay": 0,
                            "fullpayStatus": 0,
                            "balanceStatus": 0,
                            "total": 100000,
                            "amount": 100000,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": "",
                            "company": 1,
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> pageSalesForBalanceByDompany
    
        分页方式获取进行预结算的销售单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        根据销售单归属第二公司进行查询 , 第二公司为装修单公司
        
        需要预结算的销售单条件 , 补款状态为2(已确认) , 结算状态为0(初始)
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 销售单信息列表 , 每条数据类型 :data:`sales`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "no": "1601010001",
                            "orderId": "1601010001",
                            "phone": "",
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
                                "duty": "导购"
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
                                "name": "导购一部",
                                "type": "导购部",
                            },
                            "finisher": {
                                "uid": 100,
                                "userId": "U073",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "财务"
                            },
                            "grade": "A",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "createTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "finishTime": "2016-01-01 00:00:00",
                            "affirmTime": "2016-01-01 00:00:00",
                            "isAffirm": 0,
                            "status": 0,
                            "depositpay": 100000,
                            "depositpayStatus": 1,
                            "fullpay": 0,
                            "fullpayStatus": 0,
                            "balanceStatus": 0,
                            "total": 100000,
                            "amount": 100000,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": "",
                            "comment": "",
                            "company": 1
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> pageSalesForBalanceByPompany
    
        分页方式获取进行预结算的销售单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        根据销售单归属第三公司进行查询 , 第三公司为款项公司
        
        需要预结算的销售单条件 , 补款状态为2(已确认) , 结算状态为0(初始)
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 销售单信息列表 , 每条数据类型 :data:`sales`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "no": "1601010001",
                            "orderId": "1601010001",
                            "phone": "",
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
                                "duty": "导购"
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
                                "name": "导购一部",
                                "type": "导购部",
                            },
                            "finisher": {
                                "uid": 100,
                                "userId": "U073",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "财务"
                            },
                            "grade": "A",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "createTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "finishTime": "2016-01-01 00:00:00",
                            "affirmTime": "2016-01-01 00:00:00",
                            "isAffirm": 0,
                            "status": 0,
                            "depositpay": 100000,
                            "depositpayStatus": 1,
                            "fullpay": 0,
                            "fullpayStatus": 0,
                            "balanceStatus": 0,
                            "total": 100000,
                            "amount": 100000,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": "",
                            "comment": "",
                            "company": 1
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> pageSalesByOrderId
    
        分页方式获取进行预结算的销售单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        通过装修单号获取归属的销售单信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.orderId: 装修单号
        :type sales.orderId: String
        
        Example::
        
            {
                "sales.orderId:": "1601010001"
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 销售单信息列表 , 每条数据类型 :data:`sales`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "no": "1601010001",
                            "orderId": "1601010001",
                            "phone": "",
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
                                "duty": "导购"
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
                                "name": "导购一部",
                                "type": "导购部",
                            },
                            "finisher": {
                                "uid": 100,
                                "userId": "U073",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "财务"
                            },
                            "grade": "A",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "createTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "finishTime": "2016-01-01 00:00:00",
                            "affirmTime": "2016-01-01 00:00:00",
                            "isAffirm": 0,
                            "status": 0,
                            "depositpay": 100000,
                            "depositpayStatus": 1,
                            "fullpay": 0,
                            "fullpayStatus": 0,
                            "balanceStatus": 0,
                            "total": 100000,
                            "amount": 100000,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": "",
                            "comment": "",
                            "company": 1
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> querySalesBySid
    
        通过销售单ID获取销售单信息
        
        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.sid: 销售单ID
        :type sales.sid: Long
        
        Example::
        
            {
                "sales.sid": 1
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param sales: 销售单信息 , 类型 :data:`sales`
        :type sales: List
        
        Example::
        
            {
                ...
                "sales": {
                    "sid": 1,
                    "no": "1601010001",
                    "orderId": "1601010001",
                    "phone": "",
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
                        "duty": "导购"
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
                        "name": "导购一部",
                        "type": "导购部",
                    },
                    "finisher": {
                        "uid": 100,
                        "userId": "U073",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "财务"
                    },
                    "grade": "A",
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "createTime": "2016-01-01 00:00:00",
                    "fullpayTime": "2016-01-01 00:00:00",
                    "balanceTime": "2016-01-01 00:00:00",
                    "finishTime": "2016-01-01 00:00:00",
                    "affirmTime": "2016-01-01 00:00:00",
                    "isAffirm": 0,
                    "status": 0,
                    "depositpay": 100000,
                    "depositpayStatus": 1,
                    "fullpay": 0,
                    "fullpayStatus": 0,
                    "balanceStatus": 0,
                    "total": 100000,
                    "amount": 100000,
                    "maling": 0,
                    "venderMaling": 0,
                    "coupon": 0,
                    "couponInfo": "",
                    "comment": "",
                    "company": 1
                }
                ...
            }
            
    .. method:: <I> querySalesByNo
    
        通过销售单编号获取销售单信息
        
        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.no: 销售单编号
        :type sales.no: String
        
        Example::
        
            {
                "sales.no": "1601010001"
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param sales: 销售单信息 , 类型 :data:`sales`
        :type sales: List
        
        Example::
        
            {
                ...
                "sales": {
                        "sid": 1,
                    "no": "1601010001",
                    "orderId": "1601010001",
                    "phone": "",
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
                        "duty": "导购"
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
                        "name": "导购一部",
                        "type": "导购部",
                    },
                    "finisher": {
                        "uid": 100,
                        "userId": "U073",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "财务"
                    },
                    "grade": "A",
                    "category": "瓷砖",
                    "brand": "瓷砖",
                    "createTime": "2016-01-01 00:00:00",
                    "fullpayTime": "2016-01-01 00:00:00",
                    "balanceTime": "2016-01-01 00:00:00",
                    "finishTime": "2016-01-01 00:00:00",
                    "affirmTime": "2016-01-01 00:00:00",
                    "isAffirm": 0,
                    "status": 0,
                    "depositpay": 100000,
                    "depositpayStatus": 1,
                    "fullpay": 0,
                    "fullpayStatus": 0,
                    "balanceStatus": 0,
                    "total": 100000,
                    "amount": 100000,
                    "maling": 0,
                    "venderMaling": 0,
                    "coupon": 0,
                    "couponInfo": "",
                    "comment": "",
                    "company": 1
                }
                ...
            }

    .. method:: <I> amountSales
    
        汇总销售总额
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.orderId: 销售单ID
        :type sales.orderId: Long
        
        Example::
        
            {
                "sales.orderId": "1601010001"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param amount: 销售总额
        :type amount: Long
        
        Example::
        
            {
                ...
                "amount": 1000000,
                ...
            }

    .. method:: <I> sendSales
    
        推送销售单
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.sid: 销售单ID
        :type sales.sid: Long
        
        Example::
        
            {
                "sales.sid": 1
            }
            
    .. method:: <I> checkSales
    
        验证销售单
        
        根据归属装修单判断销售单状态是否全部完结 , 存在其他状态 , 错误信息 **260057 销售单未完结**
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.orderId: 装修单号
        :type sales.orderId: String
        
        Example::
        
            {
                "sales.orderId": "1601010001",
            }
            
    .. method:: <I> addSales
    
        创建销售单
        
        判断归属装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        判断装修单状态为
        
        获取第二公司信息 , 解密过程以及获取公司信息 , 处理失败 , 错误信息 **230015 公司不存在**
        
        销售项需与销售单品牌一致 , 如果不一致 , 错误信息 **260033 品牌不一致**
        
        销售项累计总额与销售单总额比较 , 不一致 , 错误信息 **150025 款项金额不正确**
        
        利用归属装修单等级和公司以及销售单归属公司 , 按照规则生成销售单等级信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.orderId: 装修单号
        :type sales.orderId: String
        :param sales.phone: 电话
        :type sales.phone: String
        :param sales.house.hid: 房产ID
        :type sales.house.hid: Long
        :param sales.salesman.userId: 业务员编号
        :type sales.salesman.userId: String
        :param sales.guider.userId: 主材员编号
        :type sales.guider.userId: String
        :param sales.instorer.userId: 驻店编号
        :type sales.instorer.userId: String
        :param sales.category: 品类
        :type sales.category: String
        :param sales.bid: 品牌ID
        :type sales.bid: Long
        :param sales.brand: 品牌
        :type sales.brand: String
        :param sales.total: 总价
        :type sales.total: Long
        :param sales.maling: 抹零
        :type sales.maling: Integer
        :param sales.coupon: 券值
        :type sales.coupon: Integer
        :param sales.comment: 备注
        :type sales.comment: String
        
        :param salesItems[n].goods.gid: 商品ID
        :type salesItems[n].goods.gid: Long
        :param salesItems[n].color.cid: 颜色ID
        :type salesItems[n].color.cid: Long
        :param salesItems[n].format.fid: 规格ID
        :type salesItems[n].format.fid: Long
        :param salesItems[n].purchase: 进价
        :type salesItems[n].purchase: Integer
        :param salesItems[n].selling: 售价
        :type salesItems[n].selling: Integer
        :param salesItems[n].discount: 折扣
        :type salesItems[n].discount: Integer
        :param salesItems[n].disPrice: 折扣价
        :type salesItems[n].disPrice: Integer
        :param salesItems[n].postDis: 折让
        :type salesItems[n].postDis: Integer
        :param salesItems[n].price: 折让价
        :type salesItems[n].price: Integer
        :param salesItems[n].priceType: 价格类型
        :type salesItems[n].priceType: Short
        :param salesItems[n].num: 数量
        :type salesItems[n].num: Integer
        :param salesItems[n].total: 总价
        :type salesItems[n].total: Integer
        :param salesItems[n].comment: 备注
        :type salesItems[n].comment: Integer
        :param salesItems[n].ctype: 结算方式
        :type salesItems[n].ctype: Short
        :param salesItems[n].cvalue: 结算值
        :type salesItems[n].cvalue: Integer
        
        Example::
        
            {
                "sales.orderId": "1601010001",
                "sales.phone": "",
                "sales.house.hid": 1,
                "sales.salesman.userId": "U0186",
                "sales.guider.userId": "U0511",
                "sales.instore.userId": "",
                "sales.category": "洁具",
                "sales.bid": 1,
                "sales.brand": "卫浴",
                "sales.coupon": 0,
                "sales.couponInfo": "",
                "sales.comment": "",
                "sales.maling": 0,
                "sales.total": 0,
                
                "salesItems[0].goods.gid": 1,
                "salesItems[0].color.cid": 1,
                "salesItems[0].format.fid": 1,
                "salesItems[0].purchase": 50000
                "salesItems[0].selling": 100000,
                "salesItems[0].discount": 900,
                "salesItems[0].disPrice": 90000
                "salesItems[0].postDis": 900,
                "salesItems[0].price": 81000,
                "salesItems[0].priceType": 0,
                "salesItems[0].num": 1,
                "salesItems[0].total": 81000,
                "salesItems[0].comment": "",
                "salesItems[0].ctype": "",
                "salesItems[0].cvalue": ""
            }
            
    .. method:: <I> updateSales
    
        更新销售单信息
        
        销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**
        
        判断销售单状态为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.sid: 销售单ID
        :type sales.sid: Long
        :param sales.grade: 等级
        :type sales.grade: String
        
        Example::
        
            {
                "sales.sid": 1,
                "sales.grade": "B"
            }

    .. method:: <I> updateSalesForActivity
    
        更新销售单参与活动信息
        
        销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**
        
        判断销售单状态为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.sid: 销售单ID
        :type sales.sid: Long
        :param sales.activityId: 活动ID
        :type sales.activityId: Long
        
        Example::
        
            {
                "sales.sid": 1,
                "sales.activityId": 1
            }
            
    .. method:: <I> updateSalesForBelong
    
        更新销售单归属信息 , 渠道(业务)/驻店/导购
        
        销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**
        
        判断销售单状态为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.sid: 销售单ID
        :type sales.sid: Long
        :param sales.salesman.userId: 业务员编号
        :type sales.salesman.userId: String
        :param sales.guider.userId: 主材员编号
        :type sales.guider.userId: String
        :param sales.instorer.userId: 驻店编号
        :type sales.instorer.userId: String
        :param sales.supplier.userId: 厂商
        :type sales.supplier.userId: String
        
        Example::
        
            {
                "sales.sid": 1,
                "sales.salesman.userId": "U0083",
                "sales.guider.userId": "U0083",
                "sales.instorer.userId": "U0083",
                "sales.supplier.userId": "U0083"
            }

    .. method:: <I> updateSalesForCoupon
    
        更新销售单中券相关信息
        
        销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**
        
        判断销售单状态为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**
        
        判断销售单补款状态是否为-1(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.sid: 销售单ID
        :type sales.sid: Long
        :param sales.coupon: 券值
        :type sales.coupon: Integer
        :param sales.couponInfo: 券信息 , 例子: #洁具券:150#
        :type sales.couponInfo: String
        
        Example::
        
            {
                "sales.sid": 1,
                "sales.coupon": 150000
                "sales.couponInfo": #洁具券:150#
            }
            
    .. method:: <I> updateSalesForMaling
    
        更新销售单中抹零信息
        
        销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**
        
        判断销售单状态为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**
        
        判断销售单补款状态是否为-1(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.sid: 销售单ID
        :type sales.sid: Long
        :param sales.maling: 抹零
        :type sales.maling: Integer
        :param sales.venderMaling: 厂商抹零
        :type sales.venderMaling: Integer
        
        Example::
        
            {
                "sales.sid": 1,
                "sales.maling": 100000,
                "sales.venderMaling": 100
            }
            
    .. method:: <I> updateSalesForAdvance
    
        更新销售单的信息 , 高级业务处理
        
        销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**

        更新销售单状态为0(初始)
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.sid: 销售单ID
        :type sales.sid: Long
        
        Example::
        
            {
                "sales.sid": 1
            }

    .. method:: <I-C> affirmSales

        确认销售单
        
        判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**
        
        判断客户编号是否绑定 , 未绑定 , 错误信息 **330017 装修单未绑定**
        
        销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.sid: 销售单ID
        :type sales.sid: Long
        :param sales.customer.no: 客户编号
        :type sales.customer.no: String

        Example::
        
            {
                "sales.sid": 1,
                "sales.customer.no": "",
            }
            
    .. method:: <I> terminalSales
    
        废止销售单
        
        销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**
        
        判断销售单状态为0(初始) , 结算状态为0(初始) , 定金状态为-1(初始) , 补款状态为-1(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.sid: 销售单ID
        :type sales.sid: Long
        
        Example::
        
            {
                "sales.sid": 1
            }
            
    .. method:: <I> finishSales
    
        完结销售单
        
        销售单信息不存在 , 不存在 , 错误信息 **260021 销售单不存在**
        
        判断销售单状态为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.sid: 销售单ID
        :type sales.sid: Long
        
        Example::
        
            {
                "sales.sid": 1
            }

销售项
----------------

.. class:: api.material.SalesItemAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: salesItem
    
    :param siid: 销售项ID
    :type siid: Long
    :param sid: 销售单ID
    :type sid: Long
    :param goods: 商品 , 类型 `goods <./data.html#api.data.GoodsAction.goods>`__
    :type goods: Object
    :param color: 颜色 , 类型 `color <./data.html#api.data.ColorAction.color>`__
    :type color: Object
    :param format: 规格 , 类型 `format <./data.html#api.data.FormatAction.format>`__
    :type format: Object
    :param purchase: 进价
    :type purchase: Integer
    :param selling: 售价
    :type selling: Integer
    :param discount: 折扣
    :type discount: Integer
    :param disPrice: 折扣价
    :type disPrice: Integer
    :param postDis: 折让
    :type postDis: Integer
    :param price: 折让价
    :type price: Integer
    :param priceType: 价格类型
    :type priceType: Short
    :param initnum: 初始量
    :type initnum: Integer
    :param num: 数量
    :type num: Integer
    :param total: 总价
    :type total: Integer
    :param comment: 备注
    :type comment: String
    :param punum: 采购余数
    :type punum: Integer
    :param xgnum: 出库余数
    :type xgnum: Integer
    :param rawCtype: 原结算方式
    :type rawCtype: Short
    :param rawCvalue: 原结算值
    :type rawCvalue: Integer
    :param ctype: 结算方式 , 0: 底价 , 1: 点位 , 2: 不计算
    :type ctype: Short
    :param cvalue: 结算值
    :type cvalue: Integer
    
    .. method:: <I> querySalesItemBySid
    
        通过销售单ID获取销售项
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.sid: 销售单ID
        :type sales.sid: Long
        
        Example::
        
            {
                "sales.sid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param salesItems: 销售项列表 , 每条数据类型 :data:`salesItem`
        :type salesItems: List
        
        Example::
        
            {
                ...
                "salesItems": [
                    {
                        "siid": 1,
                        "sid": 1,
                        "goods": {
                            "gid": 1,
                            "no": "JGIDNEHDUIN5SD",
                            "name": "瓷砖",
                            "alias": "",
                            "barcode": "254125212521251",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "measurementUnit": "个"
                        },
                        "color": {
                            "cid": 1,
                            "gid": 1,
                            "name": "白色",
                        },
                        "format": {
                            "cid": 1,
                            "gid": 1,
                            "info": "300*300",
                        },
                        "purchase": 60,
                        "selling": 90000
                        "discount": 1,
                        "disPrice": 90000
                        "postDis": 1,
                        "price": 90000
                        "initnum": 1,
                        "num": 1,
                        "total": 90000
                        "comment": "",
                        "punum": 1,
                        "xgnum": 1,
                        "rawCtype": 0,
                        "rawCvalue": 80000,
                        "ctype": 0,
                        "cvalue": 80000,
                    }
                ],
                ...
            }

    .. method:: <I> querySalesItemBySids
    
        通过销售单ID列表获取销售项
        
        +---------+
        |Requests:|
        +---------+
        
        :param sids[n]: 销售单ID列表 , 每条数据类型 Long
        :type sids[n]: List
        
        Example::
        
            {
                "sids[0]": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param salesItems: 销售项列表 , 每条数据类型 :data:`salesItem`
        :type salesItems: List
        
        Example::
        
            {
                ...
                "salesItems": [
                    {
                        "siid": 1,
                        "sid": 1,
                        "goods": {
                            "gid": 1,
                            "no": "JGIDNEHDUIN5SD",
                            "name": "瓷砖",
                            "alias": "",
                            "barcode": "254125212521251",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "measurementUnit": "个"
                        },
                        "color": {
                            "cid": 1,
                            "gid": 1,
                            "name": "白色",
                        },
                        "format": {
                            "cid": 1,
                            "gid": 1,
                            "info": "300*300",
                        },
                        "purchase": 60,
                        "selling": 90000
                        "discount": 1,
                        "disPrice": 90000
                        "postDis": 1,
                        "price": 90000,
                        "initnum": 1,
                        "num": 1,
                        "total": 90000
                        "comment": "",
                        "punum": 1,
                        "xgnum": 1,
                        "rawCtype": 0,
                        "rawCvalue": 80000,
                        "ctype": 0,
                        "cvalue": 80000,
                    }
                ],
                ...
            }
    
    .. method:: <I> addSalesItem
    
        添加销售项
        
        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**
        
        判断销售单状态是否为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**
        
        判断销售单补款状态是否为-1(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**
        
        销售项需与销售单品牌一致 , 如果不一致 , 错误信息 **260033 品牌不一致**
        
        销售项累计总额与销售单总额比较 , 不一致 , 错误信息 **150025 款项金额不正确**
        
        添加销售项同时需要更新销售单中总额信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.sid: 销售单ID
        :type sales.sid: Long
        :param sales.total: 总额
        :type sales.total: Long
        :param salesItem.goods.gid: 商品ID
        :type salesItem.goods.gid: Long
        :param salesItem.color.cid: 颜色ID
        :type salesItem.color.cid: Long
        :param salesItem.format.fid: 规格ID
        :type salesItem.format.fid: Long
        :param salesItem.purchase: 进价
        :type salesItem.purchase: Integer
        :param salesItem.selling: 售价
        :type salesItem.selling: Integer
        :param salesItem.discount: 折扣
        :type salesItem.discount: Integer
        :param salesItem.disPrice: 折扣价
        :type salesItem.disPrice: Integer
        :param salesItem.postDis: 折让
        :type salesItem.postDis: Integer
        :param salesItem.price: 折让价
        :type salesItem.price: Integer
        :param salesItem.priceType: 价格类型
        :type salesItem.priceType: Short
        :param salesItem.num: 数量
        :type salesItem.num: Integer
        :param salesItem.total: 总价
        :type salesItem.total: Integer
        :param salesItem.comment: 备注
        :type salesItem.comment: Integer
        :param salesItem.ctype: 结算方式
        :type salesItem.ctype: Short
        :param salesItem.cvalue: 结算值
        :type salesItem.cvalue: Integer
        
        Example::
        
            {
                "sales.sid": 1,
                "sales.total": 100000,
                "salesItem.goods.gid": 1,
                "salesItem.color.cid": 1,
                "salesItem.format.fid": 1,
                "salesItem.purchase": 50000
                "salesItem.selling": 100000,
                "salesItem.discount": 900,
                "salesItem.disPrice": 90000
                "salesItem.postDis": 900,
                "salesItem.price": 81000,
                "salesItem.priceType": 0,
                "salesItem.num": 1,
                "salesItem.total": 81000,
                "salesItem.comment": "",
                "salesItem.ctype": "",
                "salesItem.cvalue": "",
            }
            
    .. method:: <I> updateSalesItem
    
        更新销售单中销售项 , 只能够更新数量/总额/备注
        
        判断销售项是否存在 , 不存在 , 错误信息 **260023 销售项不存在**
        
        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**
        
        判断销售单状态是否为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**
        
        判断销售单补款状态是否为-1(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**
        
        更新销售项之前需要判断销售单补款状态 , 补款状态为初始 , 其他状态操作失败 , 错误信息 **260045 销售项状态不可操作**
        
        销售项信息不存在 , 不存在 , 错误信息 **260023 销售项不存在**
        
        更新销售项同时需要更新销售单中总额信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.sid: 销售单ID
        :type sales.sid: Long
        :param sales.total: 总额
        :type sales.total: Long
        :param salesItem.siid: 销售项ID
        :type salesItem.siid: Long
        :param salesItem.num: 数量
        :type salesItem.num: Integer
        :param salesItem.total: 总价
        :type salesItem.total: Integer
        :param salesItem.comment: 备注
        :type salesItem.comment: Integer
        
        Example::
        
            {
                "sales.sid": 1,
                "sales.total": 100000,
                "salesItem.siid": 1,
                "salesItem.num": 1,
                "salesItem.total": 81000,
                "salesItem.comment": ""
            }
            
    .. method:: <I> updateSalesItemForBalance
    
        更新销售项关于结算信息 , 结算方式(ctype)和结算值(cvalue)
        
        判断销售项是否存在 , 不存在 , 错误信息 **260023 销售项不存在**
        
        判断销售单补款状态是否为2(已确认) , 其他状态 , 错误信息 **260045 销售项状态不可操作**
        
        判断销售单结算状态是否为0(初始) , 其他状态 , 错误信息 **260045 销售项状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesItem.siid: 销售项ID
        :type salesItem.siid: Long
        :param salesItem.ctype: 结算类型
        :type salesItem.ctype: Short
        :param salesItem.cvalue: 结算值
        :type salesItem.cvalue: Integer
        
        Example::
        
            {
                "salesItem.siid": 1,
                "salesItem.ctype": 1,
                "salesItem.cvalue": 1
            }
    
    .. method:: <I> deleteSalesItem
    
        删除销售单中销售项

        判断销售项是否存在 , 不存在 , 错误信息 **260023 销售项不存在**
        
        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**
        
        判断销售单状态是否为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**
        
        判断销售单补款状态是否为-1(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.sid: 销售单ID
        :type sales.sid: Long
        :param sales.total: 总额
        :type sales.total: Long
        :param salesItem.siid: 销售项ID
        :type salesItem.siid: Long
        
        Example::
        
            {
                "sales.sid": 1,
                "sales.total": 100000,
                "salesItem.siid": 1
            }

退货
================

退货单
----------------

.. class:: api.sales.SalesRefundsAction

    +---------+
    |DataType:|
    +---------+

    .. data:: salesRefunds
    
    :param srid: 退货单ID
    :type srid: Long
    :param sid: 销售单ID
    :type sid: Long
    :param spid: 款项ID
    :type spid: Long
    :param total: 总额
    :type total: Long
    :param type: 类型 , 0: 退货 , 2: 全退 , 3: 倒单
    :type type: Short
    :param status: 状态 , 0: 初始 , 1: 已付款
    :type status: Short
    :param creater: 创建人 ,  类型 `user <./user.html#api.personel.UserAction.user>`__
    :type creater: Object
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param balanceTime: 结算时间
    :type balanceTime: Timestamp
    :param comment: 备注
    :type comment: String

    .. method:: <I> pageSalesRefunds
    
        分页方式获取销售退货信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 选材单信息列表 , 每条数据类型 :data:`salesRefunds`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "srid": 1,
                            "sales": {
                                "sid": 1,
                                "no": "1601010001",
                                "orderId": "1601010001",
                                "company": 1,
                                "village": {
                                    "vid": 6,
                                    "no": "P001",
                                    "name": "广场一期",
                                },
                                "houseNumber": "A#1-1-1",
                                "customer": {
                                    "cid": 1,
                                    "no": "1501010001",
                                    "name": "李"
                                },
                                "guider": {
                                    "uid": 2,
                                    "userId": "U0012",
                                    "userName": "导购",
                                    "currentName": "导购",
                                    "duty": "导购"
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
                                    "name": "导购一部",
                                    "type": "导购部",
                                },
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "comment": "",
                                "createTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 00:00:00",
                                "balanceTime": "2016-01-01 00:00:00",
                                "status": 0,
                                "balanceStatus": 0,
                                "allowance": 10000,
                                "total": 100000,
                                "amount": 100000,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": ""
                            },
                            "spid": 1,
                            "total": 100000,
                            "type": 0,
                            "creater": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "createTime": "2016-06-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> querySalesRefundsBySid
    
        通过销售单ID获取退货单
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesRefunds.sid: 销售单ID
        :type salesRefunds.sid: Long
        
        Example::
        
            {
                "salesRefunds.sid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param salesRefundes: 退货单列表 , 每条数据类型 :data:`salesRefunds`
        :type salesRefundes: List
        
        Example::
        
            {
                ...
                "salesRefundes": [
                    {
                        "srid": 1,
                        "sid": 1,
                        "spid": 1,
                        "total": 100000,
                        "type": 0,
                        "creater": {
                            "uid": 1,
                            "userId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师"
                        },
                        "createTime": "2016-06-01 00:00:00",
                        "balanceTime": "2016-01-01 00:00:00",
                        "comment": ""
                    }
                ],
                ...
            }

退货项
----------------

.. class:: api.sales.SalesRefundItemAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: salesRefundsItem
    
    :param riid: 退货项ID
    :type riid: Long
    :param sid: 销售单ID
    :type sid: Long
    :param rid: 退货单ID
    :type rid: Long
    :param salesItem: 销售项 , 类型 `salesItem <./sales.html#api.sales.SalesAction.salesItem>`__
    :type salesItem: Object
    :param num: 数量
    :type num: Integer
    :param total: 总额
    :type total: Integer
    
    .. method:: <I> querySalesRefundsItemBySid
    
        通过销售单号查询退货项信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesRefunds.sid: 销售单ID
        :type salesRefunds.sid: Long
        
        Example::
        
            {
                "salesRefunds.sid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param salesRefundsItems: 退货项列表 , 每条数据类型 :data:`salesRefundsItem`
        :type salesRefundsItems: List
        
        Example::
        
            {
                ...
                "salesRefundsItems": [
                    {
                        "riid": 1,
                        "sid": 1,
                        "rid": 1,
                        "salesItem": {
                            "siid": 1,
                            "sid": 1,
                            "goods": {
                                "gid": 1,
                                "no": "JGIDNEHDUIN5SD",
                                "name": "瓷砖",
                                "alias": "",
                                "barcode": "254125212521251",
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "measurementUnit": "个"
                            },
                            "color": {
                                "cid": 1,
                                "gid": 1,
                                "name": "白色",
                            },
                            "format": {
                                "cid": 1,
                                "gid": 1,
                                "info": "300*300",
                            },
                            "purchase": 60,
                            "selling": 90000
                            "discount": 1,
                            "disPrice": 90000
                            "postDis": 1,
                            "price": 90000
                            "num": 1,
                            "total": 90000
                            "comment": "",
                            "rawCtype": 0,
                            "rawCvalue": 80000,
                            "ctype": 0,
                            "cvalue": 80000,
                        }
                        "num": 1,
                        "total": 90
                    }
                ],
                ...
            }

    .. method:: <I> querySalesRefundsItemByRid
    
        通过退货单号查询退货项信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesRefunds.rid: 销售单ID
        :type salesRefunds.rid: Long
        
        Example::
        
            {
                "salesRefunds.rid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param salesRefundsItems: 退货项列表 , 每条数据类型 :data:`salesRefundsItem`
        :type salesRefundsItems: List
        
        Example::
        
            {
                ...
                "salesRefundsItems": [
                    {
                        "riid": 1,
                        "sid": 1,
                        "rid": 1,
                        "salesItem": {
                            "siid": 1,
                            "sid": 1,
                            "goods": {
                                "gid": 1,
                                "no": "JGIDNEHDUIN5SD",
                                "name": "瓷砖",
                                "alias": "",
                                "barcode": "254125212521251",
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "measurementUnit": "个"
                            },
                            "color": {
                                "cid": 1,
                                "gid": 1,
                                "name": "白色",
                            },
                            "format": {
                                "cid": 1,
                                "gid": 1,
                                "info": "300*300",
                            },
                            "purchase": 60,
                            "selling": 90000
                            "discount": 1,
                            "disPrice": 90000
                            "postDis": 1,
                            "price": 90000
                            "num": 1,
                            "total": 90000
                            "comment": "",
                            "rawCtype": 0,
                            "rawCvalue": 80000,
                            "ctype": 0,
                            "cvalue": 80000,
                        }
                        "num": 1,
                        "total": 90
                    }
                ],
                ...
            }

外销
================

外销单
----------------

.. class:: api.sales.OalesAction

    +---------+
    |DataType:|
    +---------+

    .. data:: oales
    
    :param oid: 外销单ID
    :type oid: Long
    :param foid: 关联外销单ID
    :type foid: Long
    :param no: 编号 , 由日期加六位格式计数组成 , 例: 1601010001
    :type no: String
    :param decoration: 装修单 , 类型 `decoration <./decoration.html#api.decoration.decorationAction.decoration>`__
    :type decoration: Object
    :param house: 房产 , 类型 `house <./data.html#api.data.HouseAction.house>`__
    :type house: Object
    :param customer: 客户, 类型 `customer <./customer.html#api.customer.CustomerAction.customer>`__
    :type customer: Object
    
    :param supplier: 厂商 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type supplier: Object
    
    :param category: 品类
    :type category: String
    :param bid: 品牌ID
    :type bid: Long
    :param brand: 品牌
    :type brand: String
    
    :param type: 类型 , 0: 购货 , 1: 退货
    :type type: Short
    :param atttype: 业务类型 , 0: 内购 , 1: 外购
    :type atttype: Short
    :param awardType: 奖励类型 , 0: 设计部 , 1: 服务部 , 2: 工程部
    :type awardType: Short
    
    :param servicer: 服务管家 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type servicer: Object
    :param materialer: 主材员 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type materialer: Object
    :param channer: 渠道 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type channer: Object
    :param creater: 创建人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type creater: Object
    :param checker: 复核人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type checker: Object
    
    :param dept: 部门 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type dept: Object
    :param region: 分区 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type region: Object
    
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param confirmTime: 确认时间
    :type confirmTime: Timestamp
    :param checkTime: 复核时间
    :type checkTime: Timestamp
    :param finishTime: 完结时间
    :type finishTime: Timestamp
    
    :param total: 总额
    :type total: Long
    :param profit: 利润
    :type profit: Long
    :param award: 奖励
    :type award: Long
    :param cost: 成本
    :type cost: Long
    :param threshold: 系数
    :type threshold: Integer
    
    :param status: 状态 , 0: 初始 , 1: 提交, 2: 确认 , 3: 驳回 , 4: 复核 , 5: 完结 , 6: 废单
    :type status: Short
    
    :param comment: 备注
    :type comment: String
    :param company: 公司
    :type company: Long
    
    .. method:: <I> pageOales
    
        分页方式获取外销单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +---------+
        |Requests:|
        +---------+
        
        :param statuses: 状态列表 , 每条数据类型 Short
        :type statuses: List
        
        Example::
        
            {
                "statuses[0]": 1,
                "statuses[1]": 2
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 外销单信息列表 , 每条数据类型 :data:`oales`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "oid": 1,
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
                            
                            "creater": {
                                "uid": 1,
                                "userId": "FL-02381",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "136xxxx1453",
                                ...
                            },
                            "servicer": {
                                "uid": 1,
                                "userId": "FL-02381",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "136xxxx1453",
                                ...
                            },
                            "materialer": null,
                            "channer": null,
                            
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
                            
                            "createTime": "2016-01-01 00:00:00",
                            "confirmTime": "2016-01-01 00:00:00",
                            "checkTime": "2016-01-01 00:00:00",
                            "finishTime": "2016-01-01 00:00:00",
                            
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            
                            "atttype": 0,
                            "awardType": 0,
                            
                            "total": 100000,
                            "profit": 0,
                            "award": 0,
                            
                            "status": 0,
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> queryOalesByOrderId
    
        通过装修单号查询外销单
        
        +---------+
        |Requests:|
        +---------+
        
        :param oales.orderId: 装修单号
        :type oales.orderId: String
        
        Example::
        
            {
                "oales.orderId:": "1601010001"
            }
    
        +--------+
        |Returns:|
        +--------+
        
        :param oaleses: 外销单信息列表 , 每条数据类型 :data:`oales`
        :type oaleses: List
        
        Example::
        
            {
                ...
                "oaleses": [
                    {
                        "oid": 1,
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
                        
                        "creater": {
                            "uid": 1,
                            "userId": "FL-02381",
                            "userName": "王宁",
                            "currentName": "王宁",
                            "phone": "136xxxx1453",
                            ...
                        },
                        "servicer": {
                            "uid": 1,
                            "userId": "FL-02381",
                            "userName": "王宁",
                            "currentName": "王宁",
                            "phone": "136xxxx1453",
                            ...
                        },
                        "materialer": null,
                        "channer": null,

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
                        
                        "createTime": "2016-01-01 00:00:00",
                        "confirmTime": "2016-01-01 00:00:00",
                        "checkTime": "2016-01-01 00:00:00",
                        "finishTime": "2016-01-01 00:00:00",
                        
                        "category": "瓷砖",
                        "brand": "瓷砖",
                        
                        "atttype": 0,
                        "awardType": 0,
                        
                        "total": 100000,
                        "profit": 0,
                        "award": 0,
                        
                        "status": 0,
                        "comment": ""
                    }
                ],
                ...
            }

    .. method:: <I> amountOales
    
        汇总外销总额
        
        +---------+
        |Requests:|
        +---------+
        
        :param oales.decoration.orderId: 销售单ID
        :type oales.decoration.orderId: Long
        
        Example::
        
            {
                "oales.decoration.orderId": "1601010001"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param amount: 外销总额
        :type amount: Long
        
        Example::
        
            {
                ...
                "amount": 1000000,
                ...
            }

    .. method:: <I> addOales
    
        创建外销单
        
        判断归属装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param oales.decoration.orderId: 装修单号
        :type oales.decoration.orderId: String
        :param oales.bid: 品牌ID
        :type oales.bid: Long
        :param oales.total: 总价
        :type oales.total: Long
        :param oales.atttype: 业务类型
        :type oales.atttype: Short
        :param oales.comment: 备注
        :type oales.comment: String
        
        Example::
        
            {
                "oales.decoration.orderId": "1601010001",
                "oales.bid": 1,
                "oales.total": 0,
                "oales.atttype": 0,
                "oales.comment": ""
            }

    .. method:: <I> updateOales
    
        更新外销单
        
        判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param oales.oid: 外销单ID
        :type oales.oid: Long
        :param oales.total: 总额
        :type oales.total: Long
        
        Example::
        
            {
                "oales.oid": 1,
                "oales.total": 0
            }

    .. method:: <I> submitOales
    
        提交
        
        判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**
        
        判断销售单状态是否为0(初始) , 其他状态 , 错误信息 **370022 外销单不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param oales.oid: 外销单ID
        :type oales.oid: Long
        
        Example::
        
            {
                "oales.oid": 1
            }
        
    .. method:: <I> cancelOales
    
        撤销
        
        判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**
        
        判断销售单状态是否为1(提交) , 其他状态 , 错误信息 **370022 外销单不可操作**
        
        更新外销单状态为0(初始)
        
        +---------+
        |Requests:|
        +---------+
        
        :param oales.oid: 外销单ID
        :type oales.oid: Long
        
        Example::
        
            {
                "oales.oid": 1
            }
    
    .. method:: <I> confirmOales
    
        确认
        
        判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**
        
        判断外销单状态是否为1(提交)/3(驳回) , 其他状态 , 错误信息 **370022 外销单不可操作**
        
        判断外销单归属款项是否存在 , 不存在 , 错误信息 **370026 外销付款不存在**
        
        更新外销单状态为2(确认) , 更新外销单确认时间
        
        +---------+
        |Requests:|
        +---------+
        
        :param oales.oid: 外销单ID
        :type oales.oid: Long
        
        Example::
        
            {
                "oales.oid": 1
            }

    .. method:: <I> rejectOales
    
        驳回外销单
        
        判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**
        
        判断外销单状态是否为2(确认) , 其他状态 , 错误信息 **370022 外销单不可操作**
        
        更新外销单状态3(驳回)
        
        +---------+
        |Requests:|
        +---------+
        
        :param oales.oid: 外销单ID
        :type oales.oid: Long
        
        Example::
        
            {
                "oales.oid": 1
            }

    .. method:: <I> checkOales
    
        复核外销单
        
        判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**
        
        判断外销单状态是否为2(确认) , 其他状态 , 错误信息 **370022 外销单不可操作**
        
        更新外销单状态为4(复核) , 更新外销单复核时间
        
        +---------+
        |Requests:|
        +---------+
        
        :param oaleses[n].oid: 外销单ID
        :type oaleses[b].oid: Long
        
        Example::
        
            {
                "oaleses[0].oid": 1
            }

    .. method:: <I> finishOales
    
        完结外销单
        
        判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**
        
        判断外销单状态是否为4(复核) , 其他状态 , 错误信息 **370022 外销单不可操作**
        
        更新外销单状态为5(完结) , 更新外销单完结时间
        
        +---------+
        |Requests:|
        +---------+
        
        :param oales.oid: 外销单ID
        :type oales.oid: Long
        
        Example::
        
            {
                "oales.oid": 1
            }

    .. method:: <I> abateOales
    
        废单
        
        判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param oales.oid: 外销单ID
        :type oales.oid: Long
        
        Example::
        
            {
                "oales.oid": 1
            }

    .. method:: <I> refundOales
    
        退货
        
        判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**
        
        判断外销单状态是否为5(完结) , 其他状态 , 错误信息 **370022 外销单不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param oales.oid: 外销单ID
        :type oales.oid: Long
        
        Example::
        
            {
                "oales.oid": 1
            }

    .. method:: <I> deleteOales
    
        删除
        
        +---------+
        |Requests:|
        +---------+
        
        :param oales.oid: 外销单ID
        :type oales.oid: Long
        
        Example::
        
            {
                "oales.oid": 1
            }

付款单
----------------

.. class:: api.sales.OalesPayAction

    +---------+
    |DataType:|
    +---------+

    .. data:: oalesPay
    
    :param opid: 付款ID
    :type opid: Long
    :param oid: 外销单ID
    :type oid: Long
    :param name: 名称
    :type name: String
    :param money: 金额
    :type money: Integer
    :param type: 类型 , 0: 现金 , 1: 银行 , 2: 账扣 , 3: 内部
    :type type: Short
    :param creater: 创建人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type creater: Object
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param payTime: 付款时间
    :type payTime: Timestamp
    :param comment: 备注
    :type comment: String
    
    .. method:: <I> pageOalesPay
    
        分页方式获取外销单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 外销付款信息列表 , 每条数据类型 :data:`oalesPay`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "opid": 1,
                            "oid": 1,
                            "name": "名称"
                            "money": 10000,
                            "type": 0,
                            "creater": {
                                "uid": 1,
                                "userId": "FL-02381",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "136xxxx1453",
                                ...
                            },
                            "createTime": "2016-01-01 00:00:00",
                            "payTime": "2016-01-01 00:00:00",
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> queryOalesPay
    
        通过外销单ID获取外销付款信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param oalesPay.oid: 外销单ID
        :type oalesPay.oid: Long
        
        Example::
        
            {
                "oalesPay.oid:": 1
            }
    
        +--------+
        |Returns:|
        +--------+
        
        :param oalesPays: 外销付款信息列表 , 每条数据类型 :data:`oalesPay`
        :type oalesPays: List
        
        Example::
        
            {
                ...
                "oalesPays": [
                    {
                        "opid": 1,
                        "oid": 1,
                        "name": "名称"
                        "money": 10000,
                        "type": 0,
                        "creater": {
                            "uid": 1,
                            "userId": "FL-02381",
                            "userName": "王宁",
                            "currentName": "王宁",
                            "phone": "136xxxx1453",
                            ...
                        },
                        "createTime": "2016-01-01 00:00:00",
                        "payTime": "2016-01-01 00:00:00",
                        "comment": ""
                    }
                ],
                ...
            }

    .. method:: <I> addOalesPay
    
        创建外销付款
        
        判断外销单是否存在 , 不存在 , 错误信息 **370021 外销单不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param oalesPay.oid: 外销单ID
        :type oalesPay.oid: Long
        :param oalesPay.name: 名称
        :type oalesPay.name: String
        :param oalesPay.money: 金额
        :type oalesPay.money: Integer
        :param oalesPay.payTime: 付款时间
        :type oalesPay.payTime: Timestamp
        :param oalesPay.type: 类型
        :type oalesPay.type: Short
        :param oalesPay.comment: 备注
        :type oalesPay.comment: String
        
        Example::
        
            {
                "oalesPay.oid": 1,
                "oalesPay.name": "名称",
                "oalesPay.money": 10000,
                "oalesPay.payTime": "2016-01-01 00:00:00",
                "oalesPay.type": 0,
                "oalesPay.comment": ""
            }

    .. method:: <I> updateOalesPay
    
        更新外销付款
        
        判断外销单是否存在 , 不存在 , 错误信息 **370026 外销付款不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param oalesPay.opid: 外销付款ID
        :type oalesPay.opid: Long
        :param oalesPay.name: 名称
        :type oalesPay.name: String
        :param oalesPay.money: 金额
        :type oalesPay.money: Integer
        :param oalesPay.payTime: 付款时间
        :type oalesPay.payTime: Timestamp
        :param oalesPay.type: 类型
        :type oalesPay.type: Short
        :param oalesPay.comment: 备注
        :type oalesPay.comment: String
        
        Example::
        
            {
                "oalesPay.opid": 1,
                "oalesPay.name": "名称",
                "oalesPay.money": 10000,
                "oalesPay.payTime": "2016-01-01 00:00:00",
                "oalesPay.type": 0,
                "oalesPay.comment": ""
            }

    .. method:: <I> deleteOalesPay
    
        删除外销付款
        
        判断外销单是否存在 , 不存在 , 错误信息 **370026 外销付款不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param oalesPay.opid: 外销付款ID
        :type oalesPay.opid: Long
        
        Example::
        
            {
                "oalesPay.opid": 1
            }

结算
================

结算单
----------------

销售单结算相关功能

.. class:: api.sales.SalesBalanceAction

    +---------+
    |DataType:|
    +---------+

    .. data:: salesBalance
    
    :param sbid: 结算ID
    :type sbid: Long
    :param sales: 销售单 , 类型 `sales <./inventory.html#api.material.SalesAction.sales>`__
    :type sales: Object
    :param refunds: 退货单 , 类型 `refunds <./inventory.html#api.material.SalesRefundAction.salesRefunds>`__
    :type refunds: Object
    :param salesman: 业务员 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type salesman: Object
    :param dept: 部门 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type dept: Object
    :param region: 分区 , 类型 `department <./department.html#api.department.DepartmentAction.department>`__
    :type region: Object
    :param creater: 创建人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type creater: Object
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param voster: 厂商结算人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type voster: Object
    :param venderTime: 厂商结算时间
    :type venderTime: Timestamp
    :param poster: 结算人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type poster: Object
    :param postTime: 结算时间
    :type postTime: Timestamp
    :param checker: 对账人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type checker: Object
    :param checkTime: 对账时间
    :type checkTime: Timestamp
    :param allowance: 补贴
    :type allowance: Long
    :param coupon: 券值
    :type coupon: Integer
    :param total: 总额
    :type total: Long
    :param balance: 预结算值
    :type balance: Long
    :param difference: 差值 , 既总额 - 结算值
    :type difference: Long
    :param vbalance: 厂商结算
    :type vbalance: Long
    :param pbalance: 结算值
    :type pbalance: Long
    :param type: 类型 , 0: 购货 , 1: 预结算退货 , 2: 结算退货 , 3: 定金
    :type type: Short
    :param onetype: 一类 , 0: 购货 , 1: 退货 , 2: 全退 , 3: 倒单
    :type onetype: Short
    :param status: 状态 , 0: 预结算 , 1: 厂商结算 , 2: 结算
    :type status: Short
    :param deliverStatus: 配送状态 , 0: 未配送 , 1: 部分送达 , 2: 全部送达
    :type deliverStatus: Short
    :param verifyStatus: 审核状态 , 0: 未审核 , 1: 部分审核 , 2: 全部审核
    :type verifyStatus: Short
    :param confirmStatus: 确认状态 , 0: 未确认 , 1: 部分确认 , 2: 全部确认
    :type confirmStatus: Short
    :param checkStatus: 对账状态 , 0: 初始 , 1: 对账 , 2: 已付
    :type checkStatus: Short
    :param comment: 备注
    :type comment: String

    .. method:: <I> pageSalesBalance
    
        分页方式获取销售结算信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        通过销售单公司进行查询
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 销售结算信息列表 , 每条数据类型 :data:`salesBalance`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sbid": 1,
                            "sales": {
                                "sid": 1,
                                "no": "1601010001",
                                "orderId": "1601010001",
                                "company": 1,
                                "village": {
                                    "vid": 6,
                                    "no": "P001",
                                    "name": "广场一期",
                                },
                                "houseNumber": "A#1-1-1",
                                "customer": {
                                    "cid": 1,
                                    "no": "1501010001",
                                    "name": "李"
                                },
                                "guider": {
                                    "uid": 2,
                                    "userId": "U0012",
                                    "userName": "导购",
                                    "currentName": "导购",
                                    "duty": "导购"
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
                                    "name": "导购一部",
                                    "type": "导购部",
                                },
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "comment": "",
                                "createTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 00:00:00",
                                "balanceTime": "2016-01-01 00:00:00",
                                "status": 0,
                                "balanceStatus": 0,
                                "allowance": 10000,
                                "total": 100000,
                                "amount": 100000,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": ""
                            },
                            "refunds": null,
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
                            "creater": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "createTime": "2016-01-01 00:00:00",
                            "poster": null,
                            "postTime": null,
                            "venderTime": null,
                            "checker": null,
                            "checkTime": null,
                            "balance": 0,
                            "total": 100.8,
                            "balance": 10000,
                            "difference": 90.8,
                            "vbalance": 0,
                            "pbalance": 0,
                            "type": 0,
                            "onetype": 0,
                            "status": 0,
                            "deliverStatus": 0,
                            "verifyStatus": 0,
                            "confirmStatus": 0,
                            "checkStatus": 0,
                            "comment": "说明"
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> pageSalesBalanceForDompany
    
        分页方式获取销售结算信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        通过销售单第二公司进行查询 , 第二公司为装修单公司
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 销售结算信息列表 , 每条数据类型 :data:`salesBalance`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sbid": 1,
                            "sales": {
                                "sid": 1,
                                "no": "1601010001",
                                "orderId": "1601010001",
                                "company": 1,
                                "village": {
                                    "vid": 6,
                                    "no": "P001",
                                    "name": "广场一期",
                                },
                                "houseNumber": "A#1-1-1",
                                "customer": {
                                    "ciid": 1,
                                    "no": "1501010001",
                                    "name": "李"
                                },
                                "guider": {
                                    "uid": 2,
                                    "userId": "U0012",
                                    "userName": "导购",
                                    "currentName": "导购",
                                    "duty": "导购"
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
                                    "name": "导购一部",
                                    "type": "导购部",
                                },
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "comment": "",
                                "createTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 00:00:00",
                                "balanceTime": "2016-01-01 00:00:00",
                                "status": 0,
                                "balanceStatus": 0,
                                "allowance": 10000,
                                "total": 100000,
                                "amount": 100000,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": ""
                            },
                            "refunds": null,
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
                            "creater": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "createTime": "2016-01-01 00:00:00",
                            "poster": null,
                            "postTime": null,
                            "venderTime": null,
                            "checker": null,
                            "checkTime": null,
                            "balance": 0,
                            "total": 100.8,
                            "balance": 10000,
                            "difference": 90.8,
                            "vbalance": 0,
                            "pbalance": 0,
                            "type": 0,
                            "onetype": 0,
                            "status": 0,
                            "deliverStatus": 0,
                            "verifyStatus": 0,
                            "confirmStatus": 0,
                            "checkStatus": 0,
                            "comment": "说明"
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> pageSalesBalanceForPompany
    
        分页方式获取销售结算信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        通过销售单第三公司进行查询 , 第三公司为款项公司
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 销售结算信息列表 , 每条数据类型 :data:`salesBalance`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sbid": 1,
                            "sales": {
                                "sid": 1,
                                "no": "1601010001",
                                "orderId": "1601010001",
                                "company": 1,
                                "village": {
                                    "vid": 6,
                                    "no": "P001",
                                    "name": "广场一期",
                                },
                                "houseNumber": "A#1-1-1",
                                "customer": {
                                    "ciid": 1,
                                    "no": "1501010001",
                                    "name": "李"
                                },
                                "guider": {
                                    "uid": 2,
                                    "userId": "U0012",
                                    "userName": "导购",
                                    "currentName": "导购",
                                    "duty": "导购"
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
                                    "name": "导购一部",
                                    "type": "导购部",
                                },
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "comment": "",
                                "createTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 00:00:00",
                                "balanceTime": "2016-01-01 00:00:00",
                                "status": 0,
                                "balanceStatus": 0,
                                "allowance": 10000,
                                "total": 100000,
                                "amount": 100000,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": ""
                            },
                            "refunds": null,
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
                            "creater": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "createTime": "2016-01-01 00:00:00",
                            "poster": null,
                            "postTime": null,
                            "venderTime": null,
                            "checker": null,
                            "checkTime": null,
                            "balance": 0,
                            "total": 100.8,
                            "balance": 10000,
                            "difference": 90.8,
                            "vbalance": 0,
                            "pbalance": 0,
                            "type": 0,
                            "onetype": 0,
                            "status": 0,
                            "deliverStatus": 0,
                            "verifyStatus": 0,
                            "confirmStatus": 0,
                            "checkStatus": 0,
                            "comment": "说明"
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> pageSalesBalanceForSupplier
    
        分页方式获取销售结算信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        通过销售单厂商以及当前操作人信息查询对应销售单
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 销售结算信息列表 , 每条数据类型 :data:`salesBalance`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sbid": 1,
                            "sales": {
                                "sid": 1,
                                "no": "1601010001",
                                "orderId": "1601010001",
                                "company": 1,
                                "village": {
                                    "vid": 6,
                                    "no": "P001",
                                    "name": "广场一期",
                                },
                                "houseNumber": "A#1-1-1",
                                "customer": {
                                    "ciid": 1,
                                    "no": "1501010001",
                                    "name": "李"
                                },
                                "guider": {
                                    "uid": 2,
                                    "userId": "U0012",
                                    "userName": "导购",
                                    "currentName": "导购",
                                    "duty": "导购"
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
                                    "name": "导购一部",
                                    "type": "导购部",
                                },
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "comment": "",
                                "createTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 00:00:00",
                                "balanceTime": "2016-01-01 00:00:00",
                                "status": 0,
                                "balanceStatus": 0,
                                "allowance": 10000,
                                "total": 100000,
                                "amount": 100000,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": ""
                            },
                            "refunds": null,
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
                            "creater": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "createTime": "2016-01-01 00:00:00",
                            "poster": null,
                            "postTime": null,
                            "venderTime": null,
                            "checker": null,
                            "checkTime": null,
                            "balance": 0,
                            "total": 100.8,
                            "balance": 10000,
                            "difference": 90.8,
                            "vbalance": 0,
                            "pbalance": 0,
                            "type": 0,
                            "onetype": 0,
                            "status": 0,
                            "deliverStatus": 0,
                            "verifyStatus": 0,
                            "confirmStatus": 0,
                            "checkStatus": 0,
                            "comment": "说明"
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> pageSalesBalanceForCheck
    
        分页方式获取销售结算信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        提供对账功能业务 , 通过销售单厂商 , 对账状态为初始以及状态为预结算的销售单
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 销售结算信息列表 , 每条数据类型 :data:`salesBalance`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sbid": 1,
                            "sales": {
                                "sid": 1,
                                "no": "1601010001",
                                "orderId": "1601010001",
                                "company": 1,
                                "village": {
                                    "vid": 6,
                                    "no": "P001",
                                    "name": "广场一期",
                                },
                                "houseNumber": "A#1-1-1",
                                "customer": {
                                    "ciid": 1,
                                    "no": "1501010001",
                                    "name": "李"
                                },
                                "guider": {
                                    "uid": 2,
                                    "userId": "U0012",
                                    "userName": "导购",
                                    "currentName": "导购",
                                    "duty": "导购"
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
                                    "name": "导购一部",
                                    "type": "导购部",
                                },
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "comment": "",
                                "createTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 00:00:00",
                                "balanceTime": "2016-01-01 00:00:00",
                                "status": 0,
                                "balanceStatus": 0,
                                "allowance": 10000,
                                "total": 100000,
                                "amount": 100000,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": ""
                            },
                            "refunds": null,
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
                            "creater": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "createTime": "2016-01-01 00:00:00",
                            "poster": null,
                            "postTime": null,
                            "venderTime": null,
                            "checker": null,
                            "checkTime": null,
                            "balance": 0,
                            "total": 100.8,
                            "balance": 10000,
                            "difference": 90.8,
                            "vbalance": 0,
                            "pbalance": 0,
                            "type": 0,
                            "onetype": 0,
                            "status": 0,
                            "deliverStatus": 0,
                            "verifyStatus": 0,
                            "confirmStatus": 0,
                            "checkStatus": 0,
                            "comment": "说明"
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> updateSalesBalanceForVBalance
    
        更新销售结算信息中的厂商结算值
        
        判断销售结算信息是否存在 , 不存在 , 错误信息 **260037 销售结算信息不存在**
        
        判断销售结算信息状态是否为1(预结算) , 错误信息 **260038 销售结算状态不可操作**
        
        更新销售结算信息中厂商结算值
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesBalance.sbid: 结算ID
        :type salesBalance.sbid: Long
        :param salesBalance.vbalance: 厂商结算值
        :type salesBalance.vbalance: Long
        
        Example::
        
            {
                "salesBalance.sbid": 1,
                "salesBalance.vbalance": 100
            }
            
    .. method:: <I> updateSalesBalanceForPBalance
    
        更新销售结算信息中的结算值
        
        判断销售结算信息是否存在 , 不存在 , 错误信息 **260037 销售结算信息不存在**
        
        判断销售结算信息状态是否为2(厂商结算) , 错误信息 **260038 销售结算状态不可操作**
        
        更新销售结算信息中结算值
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesBalance.sbid: 结算ID
        :type salesBalance.sbid: Integer
        :param salesBalance.pbalance: 厂商结算值
        :type salesBalance.pbalance: Long
        
        Example::
        
            {
                "salesBalance.sbid": 1,
                "salesBalance.pbalance": 100
            }
            
    .. method:: <I> passSalesBalance
    
        批量过渡销售单到完结 , 主要提供跳过主材结算过程
        
        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**
        
        判断销售单状态是否为0(初始) , 其他状态 **销售单状态不可操作**
        
        更新销售单结算状态为4(完结)
        
        +---------+
        |Requests:|
        +---------+
        
        :param sids[n]: 销售单ID列表 , 每条数据类型 Long
        :type sids[n]: List
        
        Example::
        
            {
                "sids[0]": 1,
                "sids[1]": 2
            }
            
    .. method:: <I> preSalesBalance
    
        批量预结算销售单
        
        判断销售项是否存在 , 不存在 , 错误信息 **260023 销售项不存在**
        
        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**
        
        判断销售单状态是否为0(初始) , 其他状态 , 错误信息 **260022 销售单状态不可操作**
        
        判断销售单补款状态是否为2(已确认) , 其他状态 , 错误信息 **260022 销售单状态不可操作**
        
        判断销售单是否存在未处理审批 , 审批状态为0(初始) , 错误信息 **240007 存在未处理审批信息**
        
        利用销售单对应的销售项中的计算方式和计算值进行计算得出预结算值
        
        套餐商品中的套餐信息直接进行结算 , 商品信息不参与结算过程
        
        点位计算公式: 利润 = (折让价 - 折扣价 * (1 - 点位)) * 数量 , 成本 = 折扣价 * (1 - 点位) * 数量

        底价计算方式: 利润 = (折让价 - 底价) * 数量 , 成本 = 底价 * 数量
        
        补贴 = (折扣价 - 折让价) * 数量
        
        生成销售单对应的销售结算信息
        
        更新销售单结算状态为1(预结算)
        
        +---------+
        |Requests:|
        +---------+
        
        :param sids[n]: 销售单ID列表 , 每条数据类型 Long
        :type sids[n]: List
        
        Example::
        
            {
                "sids[0]": 1,
                "sids[1]": 2
            }
        
    .. method:: <I> vpostSalesBalance
    
        厂商结算
        
        判断销售结算信息是否存在 , 不存在 , 错误信息 **260037 销售结算信息不存在**
        
        判断销售结算信息状态是否为1(预结算) , 错误信息 **260038 销售结算状态不可操作**
        
        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**
        
        更新销售结算中状态更新为1(厂商结算) , 更新厂商结算时间
        
        更新销售单结算状态为2(厂商结算)
        
        +---------+
        |Requests:|
        +---------+
        
        :param sbids[n]: 结算ID列表 , 每条数据类型 Long
        :type sbids[n]: List
        
        Example::
        
            {
                "sbids[0]": 1
            }
            
    .. method:: <I> rpreSalesBalance
    
        反厂商结算
        
        判断销售结算信息是否存在 , 不存在 , 错误信息 **260037 销售结算信息不存在**
        
        判断销售结算信息状态是否为1(厂商结算) , 错误信息 **260038 销售结算状态不可操作**
        
        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**
        
        更新销售结算中状态更新为0(预结算)
        
        判断销售结算类型是否为0(购货) , 更新销售单结算状态为1(预结算)
        
        +---------+
        |Requests:|
        +---------+
        
        :param sbids[n]: 结算ID列表 , 每条数据类型 Long
        :type sbids[n]: List
        
        Example::
        
            {
                "sbids[0]": 1
            }
            
    .. method:: <I> postSalesBalance
    
        结算
        
        判断销售结算信息是否存在 , 不存在 , 错误信息 **260037 销售结算信息不存在**
        
        判断销售结算信息状态是否为1(预结算) , 错误信息 **260038 销售结算状态不可操作**
        
        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**
        
        更新销售结算中状态更新为2(结算) , 更新结算时间
        
        更新销售单结算状态为3(结算)
        
        +---------+
        |Requests:|
        +---------+
        
        :param sbids[n]: 结算ID列表 , 每条数据类型 Long
        :type sbids[n]: List
        
        Example::
        
            {
                "sbids[0]": 1
            }

结算项
----------------

.. class:: api.sales.SalesBalanceItemAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: salesBalanceItem
    
    :param sbiid: 结算项ID
    :type sbiid: Long
    :param sbid: 结算ID
    :type sbid: Long
    :param salesItem: 销售项 , 类型 `salesItem <./sales.html#api.sales.SalesAction.salesItem>`__
    :type salesItem: Object
    :param rawCtype: 原结算方式 , 0: 底价 , 1: 点位
    :type rawCtype: Short
    :param rawCvalue: 原结算值 , 点位结算对应结算值为0~1之前三位小数 , 底价结算对应结算值为浮点数
    :type rawCvalue: Integer
    :param ctype: 结算方式
    :type ctype: Short
    :param cvalue: 结算值
    :type cvalue: Integer
    :param num: 数量
    :type num: Integer
    :param total: 总价
    :type total: Integer

    .. method:: <I> querySalesBalanceItemBySbid
    
        通过销售结算ID获取销售结算项信息
        
        判断销售结算信息是否存在 , 不存在 , 错误信息 **260037 销售结算信息不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesBalance.sbid: 结算ID
        :type salesBalance.sbid: Long
        
        Example::
        
            {
                "salesBalance.sbid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param salesBalanceItems: 销售结算项列表 , 每条数据类型 :data:`salesBalanceItem`
        :type salesBalanceItems: List
        
        Example::
        
            {
                ...
                "salesBalanceItems": [
                    {
                        "sbiid": 1,
                        "sbid": 1,
                        "salesItem": {
                            "siid": 1,
                            "sid": 1,
                            "goods": {
                                "gid": 1,
                                "no": "JGIDNEHDUIN5SD",
                                "name": "瓷砖",
                                "alias": "",
                                "barcode": "254125212521251",
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "measurementUnit": "个"
                            },
                            "color": {
                                "cid": 1,
                                "gid": 1,
                                "name": "白色",
                            },
                            "format": {
                                "cid": 1,
                                "gid": 1,
                                "info": "300*300",
                            },
                            "purchase": 60,
                            "selling": 90000
                            "discount": 1,
                            "disPrice": 90000
                            "postDis": 1,
                            "price": 90000
                            "num": 1,
                            "total": 90000
                            "comment": "",
                            "rawCtype": 0,
                            "rawCvalue": 80000,
                            "ctype": 0,
                            "cvalue": 80000,
                        },
                        "rawCtype": 1,
                        "rawCvalue": 0.1,
                        "ctype": 1,
                        "cvalue": 0.1,
                        "num": 10000,
                        "total": 1000
                    }
                ],
                ...
            }

活动
================

销售单活动管理

.. class:: api.sales.SalesActivityAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: salesActivity
    
    :param sales: 销售单 , 类型 `sales <./inventory.html#api.material.SalesAction.sales>`__
    :type sales: Object
    :param activity: 活动 , 类型 `activity <./information.html#api.information.ActivityAction.activity>`__
    :type activity: Object
    :param amount: 汇总
    :type amount: Long
    
    .. data:: salesActivityItem
    
    :param saiid: 活动项ID
    :type saiid: Long
    :param aid: 活动ID
    :type aid: Long
    :param asid: 奖品ID
    :type asid: Long
    :param orderId: 装修单号
    :type orderId: String
    :param activity: 活动名
    :type activity: String
    :param name: 活动项名
    :type name: String
    
    :param creater: 创建人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type creater: Object
    :param operater: 操作人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type operater: Object
    :param refunder: 退货人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type refunder: Object
    
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param operateTime: 操作时间
    :type operateTime: Timestamp
    :param refundTime: 操作时间
    :type refundTime: Timestamp
    :param affirmTime: 确认时间
    :type affirmTime: Timestamp
    :param checkTime: 核对时间
    :type checkTime: Timestamp
    
    :param type: 类型 , 0: 券 , 1: 物品 , 2: 红包
    :type type: Short
    :param state: 状态 , 0: 初始 , 1: 失效 , 2: 已领 , 3: 退货 , 4: 配送 , 5: 未退 , 6: 升级 , 7: 消耗 , 8: 折现
    :type state: Short
    :param isStock: 是否计入库存 , 0: 计入 , 1: 不计入
    :type isStock: Short
    :param isPayment: 是否计入金额 , 0: 计入 , 1: 不计入 , 主要体现在装修实收额计算
    :type isPayment: Short
    :param isAffirm: 是否确认 , 0: 初始 , 1: 确认 , 2: 核对
    :type isAffirm: Short
    
    :param num: 数量
    :type num: Integer
    :param money: 价格
    :type money: Integer
    :param content: 备注
    :type content: String
    :param comment: 说明
    :type comment: String

    .. method:: <I> pageSalesActivity
    
        通过装修单号 , 分页方式获取销售活动 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`__ 以及 `filter <../check_rule.html#filter>`__ 
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.orderId: 装修单号
        :type sales.orderId: String
        
        Example::
        
            {
                "sales.orderId": "1601010001"
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: object
        :param paging.data: 销售活动信息列表 , 每条数据类型 :data:`salesActivity`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sales": {
                                "sid": 1,
                                "no": "1601010001",
                                "orderId": "1601010001",
                                "company": 1,
                                "village": {
                                    "vid": 6,
                                    "no": "P001",
                                    "name": "广场一期",
                                },
                                "houseNumber": "A#1-1-1",
                                "customer": {
                                    "ciid": 1,
                                    "no": "1501010001",
                                    "name": "李"
                                },
                                "guider": {
                                    "uid": 2,
                                    "userId": "U0012",
                                    "userName": "导购",
                                    "currentName": "导购",
                                    "duty": "导购"
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
                                    "name": "导购一部",
                                    "type": "导购部",
                                },
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "comment": "",
                                "createTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 00:00:00",
                                "balanceTime": "2016-01-01 00:00:00",
                                "status": 0,
                                "balanceStatus": 0,
                                "allowance": 10000,
                                "total": 100000,
                                "amount": 100000,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": ""
                            },
                            "activity": {
                                "aid": 1,
                                "name": "test",
                                "creater": {
                                    "uid": 1,
                                    "userId": "U0479",
                                    "userName": "白雪",
                                    "currentName": "白雪"
                                },
                                "createTime": "2016-01-01 16:04:28",
                                "startTime": "2016-01-01 00:00:00",
                                "endTime": "2016-01-01 23:59:59",
                                "type": 1,
                                "defaults": 0,
                                "multiple": 1,
                                "status": 1,
                                "content": "8"
                            }
                        }
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> amountSalesActivity
    
        通过装修单号 , 获取归属销售单参与的活动信息以及款项信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.orderId: 装修单号
        :type sales.orderId: String
        
        Example::
        
            {
                "sales.orderId": "1601010001"
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param salesActivitys: 活动信息 , 类型  :data:`salesActivity`
        :type salesActivitys: List
        
        Example::
        
            {
                ...
                "salesActivitys":[
                    {
                        "activity": {
                            "aid": 1,
                            "name": "test",
                        },
                        "amount": 100000,
                    }
                ],
                ...
            }

    .. method:: <I> amountSalesActivityForActivity
    
        通过装修单号 , 获取归属销售单参与活动的积分总额
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesActivity.sales.orderId: 装修单号
        :type salesActivity.sales.orderId: String
        
        Example::
        
            {
                "salesActivity.sales.orderId": "1601010001"
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param salesActivity: 销售活动信息 , 类型  :data:`salesActivity`
        :type salesActivity: Object
        
        Example::
        
            {
                ...
                "salesActivity":{
                    "amount": 100000,
                },
                ...
            }

    .. method:: <I> amountSalesActivityForPayment
    
        通过装修单号 , 获取归属销售单所交款项的积分总额
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesActivity.sales.orderId: 装修单号
        :type salesActivity.sales.orderId: String
        
        Example::
        
            {
                "salesActivity.sales.orderId": "1601010001"
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param salesActivity: 销售活动信息 , 类型  :data:`salesActivity`
        :type salesActivity: Object
        
        Example::
        
            {
                ...
                "salesActivity":{
                    "amount": 100000,
                },
                ...
            }
    
    .. method:: <I> querySalesActivityItem
    
        通过装修单号 , 查询归属所有销售单参与的活动项信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.orderId: 装修单号
        :type sales.orderId: String
        
        Example::
        
            {
                "sales.orderId": "1601010001"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param salesActivityItems: 活动项信息列表 , 每条数据类型 :data:`SalesActivityItem`
        :type salesActivityItems: List
        
        Example::
        
            {
                ...
                "salesActivityItems": [
                    {
                        "saiid": 1,
                        "orderId": "1601010001",
                        "aid": 1,
                        "asid": 1,
                        "activity": "测试",
                        "name": "测试项",
                        
                        "money": 100000,
                        "num": 1,
                        "content": "",
                        
                        "creater": {
                            "uid": 1,
                            "userId": "U0479",
                            "userName": "白雪",
                            "currentName": "白雪"
                        },
                        "operater": {
                            "uid": 1,
                            "userId": "U0479",
                            "userName": "白雪",
                            "currentName": "白雪"
                        },
                        "operater": null,
                        "refunder": null,
                        
                        "createTime": "2016-01-01",
                        "operateTime": "2016-01-01",
                        "refundTime": "2016-01-01",
                        "affirmTime": "2016-01-01",
                        "checkTime": "2016-01-01",
                        
                        "state": 0,
                        "type": 0,
                        "stateType": 0,
                        "content": "",
                        "comment": ""
                    }
                ],
                ...
            }
            
    .. method:: <I> addSalesActivityItem
    
        添加销售活动项
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesActivity.sales.orderId: 装修单号
        :type salesActivity.sales.orderId: String
        :param salesActivity.amount: 积分
        :type salesActivity.amount: Long
        
        :param salesActivityItems[n].aid: 活动ID
        :type salesActivityItems[n].aid: Long
        :param salesActivityItems[n].asid: 奖品ID
        :type salesActivityItems[n].asid: Long
        :param salesActivityItems[n].activity: 活动名
        :type salesActivityItems[n].activity: String
        :param salesActivityItems[n].name: 物品名
        :type salesActivityItems[n].name: String
        :param salesActivityItems[n].type: 类型
        :type salesActivityItems[n].type: Short
        :param salesActivityItems[n].num: 数量
        :type salesActivityItems[n].num: Integer
        :param salesActivityItems[n].money: 金额
        :type salesActivityItems[n].money: Integer
        :param salesActivityItems[n].integral: 积分
        :type salesActivityItems[n].integral: Long
        :param salesActivityItems[n].content: 说明
        :type salesActivityItems[n].content: String

        Example::
        
            {
                "salesActivity.sales.orderId": "1601010001",
                "salesActivity.amount": 1000000,
                "salesActivityItems[0].aid": 1,
                "salesActivityItems[0].asid": 1,
                "salesActivityItems[0].activity": "活动名",
                "salesActivityItems[0].name": "活动项",
                "salesActivityItems[0].type": 0,
                "salesActivityItems[0].num": 1500,
                "salesActivityItems[0].money": 10000,
                "salesActivityItems[0].integral": 1000000,
                "salesActivityItems[0].content": "说明"
            }
            
    .. method:: <I> receiveSalesActivityItem
    
        领取销售活动项
        
        判断销售活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**
        
        判断奖品信息是否存在 , 不存在 , 错误信息 **160043 物品不存在**
        
        判断奖品数量是否满足出库数量 , 不满足 , 错误信息 **160038 库存不足**
        
        判断销售活动项中是否计入库存标识 , 更新关联奖品对应的库存数量 , 同时生成奖品记录
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesActivityItem.saiid: 活动项ID
        :type salesActivityItem.saiid: Long
        :param salesActivityItem.content: 备注
        :type salesActivityItem.content: String
        
        Example::
        
            {
                "salesActivityItem.saiid": 1,
                "salesActivityItem.content": "备注"
            }
            
    .. method:: <I> abateSalesActivityItem
    
        失效销售活动项
        
        判断销售活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**
        
        判断销售活动项状态为0(初始) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**
        
        判断销售单款项积分以及领取活动物品积分 , 活动物品积分不足 , 错误信息 **160037 积分不足**
        
        销售活动项状态更新为1(失效)
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesActivityItem.saiid: 活动项ID
        :type salesActivityItem.saiid: Long
        :param salesActivityItem.content: 备注
        :type salesActivityItem.content: String
        
        Example::
        
            {
                "salesActivityItem.saiid": 1,
                "salesActivityItem.content": "备注"
            }
            
    .. method:: <I> deliveSalesActivityItem
    
        配送销售活动项
        
        判断销售活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**
        
        判断销售活动项状态为0(初始) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**
        
        销售活动项状态更新为4(配送)
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesActivityItem.saiid: 活动项ID
        :type salesActivityItem.saiid: Long
        :param decorationActivityItem.content: 备注
        :type decorationActivityItem.content: String
        
        Example::
        
            {
                "salesActivityItem.saiid": 1,
                "salesActivityItem.content": "备注"
            }
            
    .. method:: <I> unrefundSalesActivityItem
    
        未退装修活动 , 已审批未退货
        
        判断销售活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**
        
        判断销售活动项状态为2(已领) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**
        
        销售活动项状态更新为5(未退)
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesActivityItem.saiid: 活动项ID
        :type salesActivityItem.saiid: Long
        :param salesActivityItem.comment: 说明
        :type salesActivityItem.comment: String
        
        Example::
        
            {
                "salesActivityItem.saiid": 1,
                "salesActivityItem.comment": "说明"
            }
            
    .. method:: <I> refundSalesActivityItem
    
        退货销售活动项
        
        判断销售活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**
        
        判断销售活动项状态为2(已领)/5(未退) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**
        
        判断销售单款项积分以及领取活动物品积分 , 活动物品积分不足 , 错误信息 **160037 积分不足**
        
        销售活动项状态更新为3(退货)
        
        判断销售活动项中是否计入库存标识 , 更新关联奖品对应的库存数量 , 同时生成奖品记录以及装修单号
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesActivityItem.saiid: 活动项ID
        :type salesActivityItem.saiid: Long
        :param salesActivityItem.comment: 说明
        :type salesActivityItem.comment: String
        
        Example::
        
            {
                "salesActivityItem.saiid": 1,
                "salesActivityItem.comment": "说明"
            }
        
    .. method:: <I> expendSalesActivityItem
    
        消耗销售活动项
        
        判断销售活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**
        
        判断销售活动项状态为2(已领) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**
        
        销售活动项状态更新为7(消耗)
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesActivityItem.saiid: 活动项ID
        :type salesActivityItem.saiid: Long
        :param salesActivityItem.comment: 说明
        :type salesActivityItem.comment: String
        
        Example::
        
            {
                "salesActivityItem.saiid": 1,
                "salesActivityItem.comment": "说明"
            }

    .. method:: <I> discountSalesActivityItem
    
        折现销售活动项
        
        判断销售活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**
        
        判断销售活动项状态为0(初始) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**
        
        销售活动项状态更新为8(折现)
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesActivityItem.saiid: 活动项ID
        :type salesActivityItem.saiid: Long
        :param salesActivityItem.comment: 说明
        :type salesActivityItem.comment: String
        
        Example::
        
            {
                "salesActivityItem.saiid": 1,
                "salesActivityItem.comment": "说明"
            }

    .. method:: <I> sendSalesActivityItem
    
        发送销售活动项
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesActivityItem.orderId: 装修单号
        :type salesActivityItem.orderId: String
        :param salesActivityItem.content: 备注
        :type salesActivityItem.content: String
        
        Example::
        
            {
                "salesActivityItem.orderId": "1601010001",
                "salesActivityItem.content": ""
            }

    .. method:: <I> affirmSalesActivityItem
    
        确认销售活动项
        
        判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**
        
        判断客户电话是否正确 , 不正确 , 错误信息 **客户电话不匹配**
        
        +---------+
        |Requests:|
        +---------+
        
        :param sales.orderId: 装修单号
        :type sales.orderId: String
        :param sales.customer.no: 编号
        :type sales.customer.no: String
        
        :param salesActivityItem[n].saiid: 活动项ID
        :type salesActivityItem[n].saiid: Long
        
        Example::
        
            {
                "sales.orderId": "1601010001",
                "sales.customer.no": "",
                "salesActivityItem[0].saiid": 1            
            }

配送
================

.. class:: api.sales.SalesDeliveryAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: salesDeliveryItem
    
    :param sdiid: 配送项ID
    :type sdiid: Long
    :param sales: 销售单 , 类型 `sales <./inventory.html#api.material.SalesAction.sales>`__
    :type sales: Object
    :param salesItem: 销售项 , 类型 `salesItem <./sales.html#api.sales.SalesAction.salesItem>`__
    :type salesItem: Object
    :param status: 状态 , 0: 初始 , 1: 配送 , 2: 审核 , 3: 确认 , 4: 完结
    :type status: Short
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param protranTime: 预计配送时间
    :type protranTime: Timestamp
    :param tranTime: 配送时间
    :type tranTime: Timestamp
    :param checkTime: 审核时间
    :type checkTime: Timestamp
    :param confirmTime: 确认时间
    :type confirmTime: Timestamp
    :param finishTime: 完结时间
    :type finishTime: Timestamp
    :param creater: 创建人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type creater: Object
    :param traner: 配送人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type traner: Object
    :param checker: 审核人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type checker: Object
    :param confirmer: 确认人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type confirmer: Object
    :param finisher: 完结人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type finisher: Object
    :param comment: 备注
    :type comment: String
    :param company: 公司ID
    :type company: Integer

    .. method:: <I> pageSalesDeliveryItem
    
        分页方式获取配送项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 配送项信息列表 , 每条数据类型 :data:`salesDeliveryItem`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sdiid": 1,
                            "sales": {
                                "sid": 1,
                                "no": "1601010001",
                                "orderId": "1601010001",
                                "company": 1,
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
                                    "duty": "导购"
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
                                    "name": "导购一部",
                                    "type": "导购部",
                                },
                                "finisher": {
                                    "uid": 100,
                                    "userId": "U073",
                                    "userName": "白雪",
                                    "currentName": "白雪",
                                    "duty": "财务"
                                },
                                "grade": "A",
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "comment": "",
                                "createTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 00:00:00",
                                "balanceTime": "2016-01-01 00:00:00",
                                "finishTime": "2016-01-01 00:00:00",
                                "depositpay": 100000,
                                "depositpayStatus": 1,
                                "fullpay": 0,
                                "fullpayStatus": 0,
                                "status": 0,
                                "balanceStatus": 0,
                                "total": 100000,
                                "amount": 100000,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": ""
                            },
                            "salesItem": {
                                "siid": 1,
                                "sid": 1,
                                "goods": {
                                    "gid": 1,
                                    "no": "JGIDNEHDUIN5SD",
                                    "name": "瓷砖",
                                    "alias": "",
                                    "barcode": "254125212521251",
                                    "category": "瓷砖",
                                    "brand": "瓷砖",
                                    "measurementUnit": "个"
                                },
                                "color": {
                                    "cid": 1,
                                    "gid": 1,
                                    "name": "白色",
                                },
                                "format": {
                                    "cid": 1,
                                    "gid": 1,
                                    "info": "300*300",
                                },
                                "purchase": 60,
                                "selling": 90000
                                "discount": 1,
                                "disPrice": 90000
                                "postDis": 1,
                                "price": 90000
                                "num": 1,
                                "total": 90000
                                "comment": "",
                                "punum": 1,
                                "xgnum": 1,
                                "rawCtype": 0,
                                "rawCvalue": 80000,
                                "ctype": 0,
                                "cvalue": 80000,
                            },
                            "num": 10000,
                            "refnum": 0,
                            "status": 0,
                            "comment": "备注",
                            "protranTime": "2016-01-01 00:00:00",
                            "tranTime": "2016-01-01 00:00:00",
                            "checkTime": "2016-01-01 00:00:00",
                            "confirmTime": "2016-01-01 00:00:00",
                            "creater": {
                                "uid": 11,
                                "userId": "U010",
                                "userName": "创建人",
                                "currentName": "创建人",
                                "duty": "创建人"
                            },
                            "traner": {
                                "uid": 11,
                                "userId": "U011",
                                "userName": "配送人",
                                "currentName": "配送人",
                                "duty": "配送人"
                            },
                            "checker": {
                                "uid": 12,
                                "userId": "U012",
                                "userName": "审核人",
                                "currentName": "审核人",
                                "duty": "审核人"
                            },
                            "confirmer": {
                                "uid": 13,
                                "userId": "U013",
                                "userName": "确认人",
                                "currentName": "确认人",
                                "duty": "确认人"
                            },
                            "finisher": {
                                "uid": 14,
                                "userId": "U014",
                                "userName": "完结人",
                                "currentName": "完结人",
                                "duty": "完结人"
                            }
                        },
                    ],
                    ...
                },
                ...
            }
    
    .. method:: <I> pageSalesDeliveryItemForSupplier
    
        分页方式获取配送项信息 , 利用厂商作为条件 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 配送项信息列表 , 每条数据类型 :data:`salesDeliveryItem`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sdiid": 1,
                            "sales": {
                                "sid": 1,
                                "no": "1601010001",
                                "orderId": "1601010001",
                                "company": 1,
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
                                    "duty": "导购"
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
                                    "name": "导购一部",
                                    "type": "导购部",
                                },
                                "finisher": {
                                    "uid": 100,
                                    "userId": "U073",
                                    "userName": "白雪",
                                    "currentName": "白雪",
                                    "duty": "财务"
                                },
                                "grade": "A",
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "comment": "",
                                "createTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 00:00:00",
                                "balanceTime": "2016-01-01 00:00:00",
                                "finishTime": "2016-01-01 00:00:00",
                                "depositpay": 100000,
                                "depositpayStatus": 1,
                                "fullpay": 0,
                                "fullpayStatus": 0,
                                "status": 0,
                                "balanceStatus": 0,
                                "total": 100000,
                                "amount": 100000,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": ""
                            },
                            "salesItem": {
                                "siid": 1,
                                "sid": 1,
                                "goods": {
                                    "gid": 1,
                                    "no": "JGIDNEHDUIN5SD",
                                    "name": "瓷砖",
                                    "alias": "",
                                    "barcode": "254125212521251",
                                    "category": "瓷砖",
                                    "brand": "瓷砖",
                                    "measurementUnit": "个"
                                },
                                "color": {
                                    "cid": 1,
                                    "gid": 1,
                                    "name": "白色",
                                },
                                "format": {
                                    "cid": 1,
                                    "gid": 1,
                                    "info": "300*300",
                                },
                                "purchase": 60,
                                "selling": 90000
                                "discount": 1,
                                "disPrice": 90000
                                "postDis": 1,
                                "price": 90000
                                "num": 1,
                                "total": 90000
                                "comment": "",
                                "punum": 1,
                                "xgnum": 1,
                                "rawCtype": 0,
                                "rawCvalue": 80000,
                                "ctype": 0,
                                "cvalue": 80000,
                            },
                            "num": 10000,
                            "refnum": 0,
                            "status": 0,
                            "comment": "备注",
                            "protranTime": "2016-01-01 00:00:00",
                            "tranTime": "2016-01-01 00:00:00",
                            "checkTime": "2016-01-01 00:00:00",
                            "confirmTime": "2016-01-01 00:00:00",
                            "creater": {
                                "uid": 11,
                                "userId": "U010",
                                "userName": "创建人",
                                "currentName": "创建人",
                                "duty": "创建人"
                            },
                            "traner": {
                                "uid": 11,
                                "userId": "U011",
                                "userName": "配送人",
                                "currentName": "配送人",
                                "duty": "配送人"
                            },
                            "checker": {
                                "uid": 12,
                                "userId": "U012",
                                "userName": "审核人",
                                "currentName": "审核人",
                                "duty": "审核人"
                            },
                            "confirmer": {
                                "uid": 13,
                                "userId": "U013",
                                "userName": "确认人",
                                "currentName": "确认人",
                                "duty": "确认人"
                            },
                            "finisher": {
                                "uid": 14,
                                "userId": "U014",
                                "userName": "完结人",
                                "currentName": "完结人",
                                "duty": "完结人"
                            }
                        },
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> pageSalesDeliveryItemForInstorer
    
        分页方式获取配送项信息 , 利用导购作为条件 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 配送项信息列表 , 每条数据类型 :data:`salesDeliveryItem`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sdiid": 1,
                            "sales": {
                                "sid": 1,
                                "no": "1601010001",
                                "orderId": "1601010001",
                                "company": 1,
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
                                    "duty": "导购"
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
                                    "name": "导购一部",
                                    "type": "导购部",
                                },
                                "finisher": {
                                    "uid": 100,
                                    "userId": "U073",
                                    "userName": "白雪",
                                    "currentName": "白雪",
                                    "duty": "财务"
                                },
                                "grade": "A",
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "comment": "",
                                "createTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 00:00:00",
                                "balanceTime": "2016-01-01 00:00:00",
                                "finishTime": "2016-01-01 00:00:00",
                                "depositpay": 100000,
                                "depositpayStatus": 1,
                                "fullpay": 0,
                                "fullpayStatus": 0,
                                "status": 0,
                                "balanceStatus": 0,
                                "total": 100000,
                                "amount": 100000,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": ""
                            },
                            "salesItem": {
                                "siid": 1,
                                "sid": 1,
                                "goods": {
                                    "gid": 1,
                                    "no": "JGIDNEHDUIN5SD",
                                    "name": "瓷砖",
                                    "alias": "",
                                    "barcode": "254125212521251",
                                    "category": "瓷砖",
                                    "brand": "瓷砖",
                                    "measurementUnit": "个"
                                },
                                "color": {
                                    "cid": 1,
                                    "gid": 1,
                                    "name": "白色",
                                },
                                "format": {
                                    "cid": 1,
                                    "gid": 1,
                                    "info": "300*300",
                                },
                                "purchase": 60,
                                "selling": 90000
                                "discount": 1,
                                "disPrice": 90000
                                "postDis": 1,
                                "price": 90000
                                "num": 1,
                                "total": 90000
                                "comment": "",
                                "punum": 1,
                                "xgnum": 1,
                                "rawCtype": 0,
                                "rawCvalue": 80000,
                                "ctype": 0,
                                "cvalue": 80000,
                            },
                            "num": 10000,
                            "refnum": 0,
                            "status": 0,
                            "comment": "备注",
                            "protranTime": "2016-01-01 00:00:00",
                            "tranTime": "2016-01-01 00:00:00",
                            "checkTime": "2016-01-01 00:00:00",
                            "confirmTime": "2016-01-01 00:00:00",
                            "creater": {
                                "uid": 11,
                                "userId": "U010",
                                "userName": "创建人",
                                "currentName": "创建人",
                                "duty": "创建人"
                            },
                            "traner": {
                                "uid": 11,
                                "userId": "U011",
                                "userName": "配送人",
                                "currentName": "配送人",
                                "duty": "配送人"
                            },
                            "checker": {
                                "uid": 12,
                                "userId": "U012",
                                "userName": "审核人",
                                "currentName": "审核人",
                                "duty": "审核人"
                            },
                            "confirmer": {
                                "uid": 13,
                                "userId": "U013",
                                "userName": "确认人",
                                "currentName": "确认人",
                                "duty": "确认人"
                            },
                            "finisher": {
                                "uid": 14,
                                "userId": "U014",
                                "userName": "完结人",
                                "currentName": "完结人",
                                "duty": "完结人"
                            }
                        },
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> querySalesDeliveryItem
    
        获取配送项信息
    
        +---------+
        |Requests:|
        +---------+
        
        :param salesDeliveryItem.sales.sid: 销售单ID
        :type salesDeliveryItem.sales.sid: Long
        
        Example::
        
            {
                "salesDeliveryItem.sales.sid": 1
            }

        +--------+
        |Returns:|
        +--------+
        
        :param salesDeliveryItems: 配送项信息列表 , 每条数据类型 :data:`salesDeliveryItem`
        :type salesDeliveryItems: List
        
        Example::
        
            {
                ...
                "data": [
                    {
                        "sdiid": 1,
                        "sales": {
                            "sid": 1,
                            "no": "1601010001",
                            "orderId": "1601010001",
                            "company": 1,
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
                                "duty": "导购"
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
                                "name": "导购一部",
                                "type": "导购部",
                            },
                            "finisher": {
                                "uid": 100,
                                "userId": "U073",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "财务"
                            },
                            "grade": "A",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "comment": "",
                            "createTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "finishTime": "2016-01-01 00:00:00",
                            "depositpay": 100000,
                            "depositpayStatus": 1,
                            "fullpay": 0,
                            "fullpayStatus": 0,
                            "status": 0,
                            "balanceStatus": 0,
                            "total": 100000,
                            "amount": 100000,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": ""
                        },
                        "salesItem": {
                            "siid": 1,
                            "sid": 1,
                            "goods": {
                                "gid": 1,
                                "no": "JGIDNEHDUIN5SD",
                                "name": "瓷砖",
                                "alias": "",
                                "barcode": "254125212521251",
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "measurementUnit": "个"
                            },
                            "color": {
                                "cid": 1,
                                "gid": 1,
                                "name": "白色",
                            },
                            "format": {
                                "cid": 1,
                                "gid": 1,
                                "info": "300*300",
                            },
                            "purchase": 60,
                            "selling": 90000
                            "discount": 1,
                            "disPrice": 90000
                            "postDis": 1,
                            "price": 90000
                            "num": 1,
                            "total": 90000
                            "comment": "",
                            "punum": 1,
                            "xgnum": 1,
                            "rawCtype": 0,
                            "rawCvalue": 80000,
                            "ctype": 0,
                            "cvalue": 80000,
                        },
                        "num": 10000,
                        "refnum": 0,
                        "status": 0,
                        "comment": "备注",
                        "protranTime": "2016-01-01 00:00:00",
                        "tranTime": "2016-01-01 00:00:00",
                        "checkTime": "2016-01-01 00:00:00",
                        "confirmTime": "2016-01-01 00:00:00",
                        "creater": {
                            "uid": 11,
                            "userId": "U010",
                            "userName": "创建人",
                            "currentName": "创建人",
                            "duty": "创建人"
                        },
                        "traner": {
                            "uid": 11,
                            "userId": "U011",
                            "userName": "配送人",
                            "currentName": "配送人",
                            "duty": "配送人"
                        },
                        "checker": {
                            "uid": 12,
                            "userId": "U012",
                            "userName": "审核人",
                            "currentName": "审核人",
                            "duty": "审核人"
                        },
                        "confirmer": {
                            "uid": 13,
                            "userId": "U013",
                            "userName": "确认人",
                            "currentName": "确认人",
                            "duty": "确认人"
                        },
                        "finisher": {
                            "uid": 14,
                            "userId": "U014",
                            "userName": "完结人",
                            "currentName": "完结人",
                            "duty": "完结人"
                        }
                    },
                ],
                ...
            }
            
    .. method:: <I> updateSalesDeliveryItem
    
        更新配送信息
        
        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**
        
        判断配送项状态为0(初始) , 其他状态 , 错误信息 **260066 配送项状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesDeliveryItem.sdiid: 配送项ID
        :type salesDeliveryItem.sdiid: Long
        :param salesDeliveryItem.protranTime: 预计配送时间
        :type salesDeliveryItem.protranTime: Timestamp
        :param salesDeliveryItem.comment: 备注
        :type salesDeliveryItem.comment: String
        
        Example::
        
            {
                "salesDeliveryItem.sdiid": 1,
                "salesDeliveryItem.protranTime": "2016-01-01 00:00:00",
                "salesDeliveryItem.comment": "备注"
            }

    .. method:: <I> deliveSalesDeliveryItem
    
        配送
        
        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**
        
        判断销售单补款状态是否为2(已确认) , 其他状态 , 错误信息 **260045 销售项状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesDeliveryItem.sales.sid: 销售单ID
        :type salesDeliveryItem.sales.sid: Long
        
        Example::
        
            {
                "salesDeliveryItem.sales.sid": 1
            }

    .. method:: <I> tranSalesDeliveryItem
    
        配送
        
        判断配送项是否存在 , 不存在 , 错误信息 **260065 配送项不存在**
        
        判断配送项状态为0(初始) , 其他状态 , 错误信息 **260066 配送项状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesDeliveryItems[n].sdiid: 配送项ID
        :type salesDeliveryItems[n].sdiid: Long
        
        Example::
        
            {
                "salesDeliveryItems[0].sdiid": 1
            }
            
    .. method:: <I> checkSalesDeliveryItem
    
        审核
        
        判断配送项是否存在 , 不存在 , 错误信息 **260065 配送项不存在**
        
        判断配送项状态为1(配送) , 其他状态 , 错误信息 **260066 配送项状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesDeliveryItems[n].sdiid: 配送项ID
        :type salesDeliveryItems[n].sdiid: Long
        
        Example::
        
            {
                "salesDeliveryItems[n].sdiid": 1
            }
            
    .. method:: <I> confirmSalesDeliveryItem
    
        确认
        
        判断配送项是否存在 , 不存在 , 错误信息 **260065 配送项不存在**
        
        判断配送项状态为2(审核) , 其他状态 , 错误信息 **260066 配送项状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesDeliveryItems[n].sdiid: 配送项ID
        :type salesDeliveryItems[n].sdiid: Long
        
        Example::
        
            {
                "salesDeliveryItems[n].sdiid": 1
            }
            
    .. method:: <I> finishSalesDeliveryItem
    
        完结
        
        判断配送项是否存在 , 不存在 , 错误信息 **260065 配送项不存在**
        
        判断配送项状态为3(确认) , 其他状态 , 错误信息 **260066 配送项状态不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesDeliveryItems[n].sdiid: 配送项ID
        :type salesDeliveryItems[n].sdiid: Long
        
        Example::
        
            {
                "salesDeliveryItems[n].sdiid": 1
            }

图片
================

.. class:: api.sales.SalesPictureAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: salesPicture
    
    :param spid: 图片ID
    :type spid: Long
    :param sid: 销售单ID
    :type sid: Long
    :param siid: 销售项ID
    :type siid: Long
    :param name: 名称
    :type name: String
    :param path: 路径
    :type path: String
    :param filesize: 文件大小
    :type filesize: Integer
    :param type: 类型 , 0: 销售 , 1: 配送 , 2: 外销
    :type type: Short
    :param creater: 创建人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type creater: Object
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param status: 状态 , 0: 有效 , 1: 删除
    :type status: Short
    
    .. method:: <I> querySalesPicture
    
        获取销售图片信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesPicture.sid: 销售单ID
        :type salesPicture.sid: Long
        :param salesPicture.siid: 销售项ID
        :type salesPicture.siid: Long
        
        Example::
        
            {
                "salesPicture.sid": 1,
                "salesPicture.siid": 1,
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param salesPictures: 结算信息列表 , 类型 :data:`salesPicture`
        :type salesPictures: List
            
        Example::
        
            {
                ...
                "salesPictures": [
                    {
                        "spid": 1,
                        "sid": 1,
                        "siid": 1,
                        "name": "销售图片",
                        "path": "",
                        "filesize": 0,
                        "creater": {
                            "uid": 1,
                            "createrId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师"
                        },
                        "createTime": "2016-01-01 00:00:00"
                    }
                ],
                ...
            }

    .. method:: <I> addSalesPicture
    
        添加销售图片
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesPicture.sid: 销售单ID
        :type salesPicture.sid: Long
        :param salesPicture.siid: 销售项ID
        :type salesPicture.siid: Long
        :param salesPicture.path: 路径
        :type salesPicture.path: String
        
        Example::
        
            {
                "salesPicture.sid": 1,
                "salesPicture.siid": 1,
                "salesPicture.name": "销售图片",
                "salesPicture.path": "",
                "salesPicture.filesize": 0,
                "salesPicture.type": 1
            }

    .. method:: <I> deleteSalesPicture
    
        删除销售图片
        
        +---------+
        |Requests:|
        +---------+
        
        :param salesPicture.spid: 图片ID
        :type salesPicture.spid: Long
        
        Example::
        
            {
                "salesPicture.spid": 1
            }
            
功能
================

.. class:: api.sales.SalesFunctionAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: salesFunction
    
    :param sfid: 功能ID
    :type sfid: Long
    :param name: 名称
    :type name: String
    :param key: key
    :type key: String
    :param value: value
    :type value: String
    :param group: 分组 , 0: 公共 , 1: 订单 , 2: 仓储 , 4: 预结算 , 8: 结算 , 16: 对账
    :type group: Short
    :param type: 类型 , 0: 类型, 1: api, 2: 条件, 3: 字段, 4: 功能, 5: 节点
    :type type: Short
    :param subtype: 子类 , 0: 字符串, 1: 数组
    :type subtype: Short
    :param comment: 说明
    :type comment: String
    :param status: 状态 , 0: 启用 , 1: 禁用
    :type status: Short
    :param sort: 排序
    :type sort: Short
    
    .. method:: <I> querySalesFunction
    
        获取销售功能信息
    
        +---------+
        |Requests:|
        +---------+
        
        :param salesFunction.type: 类型
        :type salesFunction.type: Short
        
        Example::
        
            {
                "salesFunction.type": 0
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param salesFunctions: 结算信息 , 类型 :data:`salesFunction`
        :type salesFunctions: Object
            
        Example::
        
            {
                ...
                "salesFunctions": [
                    {
                        "sfid": 1,
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
            
    .. method:: <I> querySalesFunctionByName
    
        通过名称获取销售功能信息
    
        +---------+
        |Requests:|
        +---------+
        
        :param salesFunction.name: 名称
        :type salesFunction.name: String
        
        Example::
        
            {
                "salesFunction.name": "designer"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param salesFunctions: 结算信息 , 类型 :data:`salesFunction`
        :type salesFunctions: Object
            
        Example::
        
            {
                ...
                "salesFunctions": [
                    {
                        "sfid": 1,
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