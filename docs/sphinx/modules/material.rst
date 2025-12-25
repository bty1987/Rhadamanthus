
.. _material:

***************
主材
***************

订单
================

主材单信息以及部分业务管理

.. class:: api.material.MaterialAction

    +---------+
    |DataType:|
    +---------+

    .. data:: material
    
    :param mid: 主材单ID
    :type mid: Long
    :param no: 主材单号
    :type no: String
    :param orderId: 装修单号
    :type orderId: String
    :param house: 房产 , 类型 `house <./data.html#api.data.HouseAction.house>`__
    :type house: Object
    
    :param salesman: 业务员 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type salesman: Object
    :param materialer: 主材员 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type materialer: Object
    :param instorer: 驻店 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type instorer: Object
    
    :param grade: 等级 , 包括: A/B/C
    :type grade: String
    :param category: 品类
    :type category: String
    :param bid: 品牌ID
    :type bid: Long
    :param brand: 品牌
    :type brand: String
    
    :param designerFlag: 设计师标识 , 0: 业务员类型为设计师 , 1: 业务员类型非设计师
    :type designerFlag: Short
    :param packageFlag: 套餐标识 , 0: 主材单中存在套餐 , 1: 主材单中不存在套餐
    :type packageFlag: Short

    :param designRegion: 设计大区
    :type designRegion: String
    :param designDepartment: 设计部
    :type designDepartment: String
    :param materialDepartment: 主材部
    :type materialDepartment: String
    
    :param createTime: 创建时间
    :type createTime: Timestamp
    :param preBalanceTime: 预结算时间
    :type preBalanceTime: Timestamp
    :param postBalanceTime: 结算时间
    :type postBalanceTime: Timestamp
    :param fullpayTime: 补款收款时间
    :type fullpayTime: Timestamp
    
    :param type: 类型 , 包括: 0: 标准
    :type type: String
    :param status: 状态 , 包括: 0: 初始 , 1: 删除 , 2: 退货 , 3: 预结算 , 4: 购货 (保留) , 5: 结算 , 6: 全退 , 7: 倒单 , 8: 废单 , 9: 完结
    :type status: Short
    :param balanceStatus: 结算状态 , 包括: 0: 初始 , 1: 预结算 , 2: 结算
    :type balanceStatus: Short
    :param otherStatus: 其他状态 , 包括: 1: 补款审批 , 2: 修理
    :type otherStatus: Short
    
    :param depositPayment: 定金金额
    :type depositPayment: Long
    :param depositStatus: 定金状态 , 包括: 0: 初始 , 1: 未付款 , 2: 已付款 , 3: 已确认
    :type depositStatus: Short
    :param fullPayment: 补款金额
    :type fullPayment: Long
    :param fullStatus: 补款状态 , 包括: 0: 初始 , 1: 未付款 , 2: 已付款 , 3: 已确认
    :type fullStatus: Short
    
    :param total: 总价
    :type total: Long
    :param distotal: 折扣总价
    :type distotal: Long
    :param maling: 抹零
    :type maling: Integer
    :param venderMaling: 厂商抹零
    :type venderMaling: Integer
    :param coupon: 券值
    :type coupon: Integer
    :param couponInfo: 券信息 , 例子: #洁具券:150#
    :type couponInfo: String
    
    :param comment: 说明
    :type comment: String
    
    +--------+
    |Filters:|
    +--------+
    
    :param no: 主材单号
    :type no: String
    :param orderId: 装修单号
    :type orderId: String
    :param villageName: 楼盘
    :type villageName: String
    :param houseNumber: 楼牌号
    :type houseNumber: String
    :param instoreId: 驻店员编号
    :type instoreId: String
    :param salesmanId: 业务员编号
    :type salesmanId: String
    :param salesmanName: 业务员名
    :type salesmanName: String
    :param fullStatusRange: 补款状态范围 , 支持查询多个状态 , 包括: 0: 初始 , 1: 提交 , 2: 收款 , 3: 确认 , 4: 审批 , 格式为: 1,2000,3
    :type fullStatusRange: String
    :param fullCollectTimeRange: 补款收款时间 , 格式: 2016/01/01-2016/01/01
    :type fullCollectTimeRange: String
    
    .. method:: <I> pageMaterial
    
        分页方式获取主材单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        主材单状态不可为1(删除) , 归属装修单号非空
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 主材单信息列表 , 每条数据类型 :data:`material`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "mid": 1,
                            "no": "M1601012703",
                            "orderId": "1601010001",
                            "house":{
                                "hid": 1,
                                "village": {
                                    "vid": 1,
                                    "no": "P001",
                                    "name": "广场一期"
                                },
                                "houseNumber": "1#1-1-1",
                                "buildArea": 88.6
                            },
                            "salesman": {
                                "uid": 3,
                                "userId": "FL-00638",
                                "userName": "李宁",
                                "currentName": "李宁",
                                "phone": "156xxxx9283",
                                ...
                            },
                            "materialer": {
                                "uid": 21,
                                "userId": "FL-83726",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "179xxxx2837",
                                ...
                            },
                            "instorer": {
                                "uid": 87,
                                "userId": "FL-83726",
                                "userName": "宋茜",
                                "currentName": "宋茜",
                                "phone": "138xxxx2837",
                                ...
                            },
                            
                            "grade": "B",
                            "category": "洁具",
                            "brand": "卫浴",
                            
                            "designerFlag": 1,
                            "packageFlag": 1,
                            
                            "designRegion": "设计一分区",
                            "designDepartment": "设计一部",
                            "materialDepartment": "主材二组",
                            
                            "createTime": "2016-01-01 15:31:55",
                            "preBalanceTime": "2016-01-01 00:00:00",
                            "postBalanceTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 13:03:09",
                            
                            "type": 1,
                            "status": 0,
                            "balanceStatus": 0,
                            "otherStatus": 2000,
                            
                            "total": 0,
                            "distotal": 0,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": "",

                            "depositPayment": 0,
                            "depositStatus": 3,
                            "fullPayment": 2360000,
                            "fullStatus": 2000,
                            
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> pageMaterialForAdvance
    
        分页方式获取主材单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        通过装修单号 , 同时主材单状态不为1(删除)
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 主材单信息列表 , 每条数据类型 :data:`material`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "mid": 1,
                            "no": "M1601012703",
                            "orderId": "1601010001",
                            "house":{
                                "hid": 1,
                                "village": {
                                    "vid": 1,
                                    "no": "P001",
                                    "name": "广场一期"
                                },
                                "houseNumber": "1#1-1-1",
                                "buildArea": 88.6
                            },
                            "salesman": {
                                "uid": 3,
                                "userId": "FL-00638",
                                "userName": "李宁",
                                "currentName": "李宁",
                                "phone": "156xxxx9283",
                                ...
                            },
                            "materialer": {
                                "uid": 21,
                                "userId": "FL-83726",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "179xxxx2837",
                                ...
                            },
                            "instorer": {
                                "uid": 87,
                                "userId": "FL-83726",
                                "userName": "宋茜",
                                "currentName": "宋茜",
                                "phone": "138xxxx2837",
                                ...
                            },
                            
                            "grade": "B",
                            "category": "洁具",
                            "brand": "卫浴",
                            
                            "designerFlag": 1,
                            "packageFlag": 1,
                            
                            "designRegion": "设计一分区",
                            "designDepartment": "设计一部",
                            "materialDepartment": "主材二组",
                            
                            "createTime": "2016-01-01 15:31:55",
                            "preBalanceTime": "2016-01-01 00:00:00",
                            "postBalanceTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 13:03:09",
                            
                            "type": 1,
                            "status": 0,
                            "balanceStatus": 0,
                            "otherStatus": 2000,
                            
                            "total": 0,
                            "distotal": 0,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": "",

                            "depositPayment": 0,
                            "depositStatus": 3,
                            "fullPayment": 2360000,
                            "fullStatus": 2000,
                            
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> pageMaterialByOrderId
    
        分页方式获取操作用户所有主材单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        通过归属装修单号 , 根据当前操作用户信息 , 过滤主材单归属人员 , 包括业务员 , 驻店员 , 主材员
        
        +---------+
        |Requests:|
        +---------+
        
        :param material.orderId: 订单编号
        :type material.orderId: String
        
        Example::
        
            {
                "material.orderId": 1601010001
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 主材单信息列表 , 每条数据类型 :data:`material`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "mid": 1,
                            "no": "M1601012703",
                            "orderId": "1601010001",
                            "house":{
                                "hid": 1,
                                "village": {
                                    "vid": 1,
                                    "no": "P001",
                                    "name": "广场一期"
                                },
                                "houseNumber": "1#1-1-1",
                                "buildArea": 88.6
                            },
                            "salesman": {
                                "uid": 3,
                                "userId": "FL-00638",
                                "userName": "李宁",
                                "currentName": "李宁",
                                "phone": "156xxxx9283",
                                ...
                            },
                            "materialer": {
                                "uid": 21,
                                "userId": "FL-83726",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "179xxxx2837",
                                ...
                            },
                            "instorer": {
                                "uid": 87,
                                "userId": "FL-83726",
                                "userName": "宋茜",
                                "currentName": "宋茜",
                                "phone": "138xxxx2837",
                                ...
                            },
                            
                            "grade": "B",
                            "category": "洁具",
                            "brand": "卫浴",
                            
                            "designerFlag": 1,
                            "packageFlag": 1,
                            
                            "designRegion": "设计一分区",
                            "designDepartment": "设计一部",
                            "materialDepartment": "主材二组",
                            
                            "createTime": "2016-01-01 15:31:55",
                            "preBalanceTime": "2016-01-01 00:00:00",
                            "postBalanceTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 13:03:09",
                            
                            "type": 1,
                            "status": 0,
                            "balanceStatus": 0,
                            "otherStatus": 2000,
                            
                            "total": 0,
                            "distotal": 0,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": "",

                            "depositPayment": 0,
                            "depositStatus": 3,
                            "fullPayment": 2360000,
                            "fullStatus": 2000,
                            
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> pageMaterialByUserId
    
        分页方式获取订单所有主材单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        通过归属装修单号 , 根据当前操作用户信息 , 过滤主材单归属人员 , 包括业务员 , 驻店员 , 主材员
        
        +---------+
        |Requests:|
        +---------+
        
        :param material.orderId: 订单编号
        :type material.orderId: String
        
        Example::
        
            {
                "material.orderId": 1601010001
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 主材单信息列表 , 每条数据类型 :data:`material`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "mid": 1,
                            "no": "M1601012703",
                            "orderId": "1601010001",
                            "house":{
                                "hid": 1,
                                "village": {
                                    "vid": 1,
                                    "no": "P001",
                                    "name": "广场一期"
                                },
                                "houseNumber": "1#1-1-1",
                                "buildArea": 88.6
                            },
                            "salesman": {
                                "uid": 3,
                                "userId": "FL-00638",
                                "userName": "李宁",
                                "currentName": "李宁",
                                "phone": "156xxxx9283",
                                ...
                            },
                            "materialer": {
                                "uid": 21,
                                "userId": "FL-83726",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "179xxxx2837",
                                ...
                            },
                            "instorer": {
                                "uid": 87,
                                "userId": "FL-83726",
                                "userName": "宋茜",
                                "currentName": "宋茜",
                                "phone": "138xxxx2837",
                                ...
                            },
                            
                            "grade": "B",
                            "category": "洁具",
                            "brand": "卫浴",
                            
                            "designerFlag": 1,
                            "packageFlag": 1,
                            
                            "designRegion": "设计一分区",
                            "designDepartment": "设计一部",
                            "materialDepartment": "主材二组",
                            
                            "createTime": "2016-01-01 15:31:55",
                            "preBalanceTime": "2016-01-01 00:00:00",
                            "postBalanceTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 13:03:09",
                            
                            "type": 1,
                            "status": 0,
                            "balanceStatus": 0,
                            "otherStatus": 2000,
                            
                            "total": 0,
                            "distotal": 0,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": "",

                            "depositPayment": 0,
                            "depositStatus": 3,
                            "fullPayment": 2360000,
                            "fullStatus": 2000,
                            
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> queryMaterialByMid
    
        通过主材单ID获取主材单信息
        
        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param material.mid: 主材单ID
        :type material.mid: Long
        
        Example::
        
            {
                "material.mid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param material: 主材单信息 , 类型 :data:`material`
        :type material: Object
        
        Example::
        
            {
                ...
                "material":{
                    "mid": 1,
                    "no": "M1601012703",
                    "orderId": "1601010001",
                    "house":{
                        "hid": 1,
                        "village": {
                            "vid": 1,
                            "no": "P001",
                            "name": "广场一期"
                        },
                        "houseNumber": "1#1-1-1",
                        "buildArea": 88.6
                    },
                    "salesman": {
                        "uid": 3,
                        "userId": "FL-00638",
                        "userName": "李宁",
                        "currentName": "李宁",
                        "phone": "156xxxx9283",
                        ...
                    },
                    "materialer": {
                        "uid": 21,
                        "userId": "FL-83726",
                        "userName": "王宁",
                        "currentName": "王宁",
                        "phone": "179xxxx2837",
                        ...
                    },
                    "instorer": {
                        "uid": 87,
                        "userId": "FL-83726",
                        "userName": "宋茜",
                        "currentName": "宋茜",
                        "phone": "138xxxx2837",
                        ...
                    },
                    
                    "grade": "B",
                    "category": "洁具",
                    "brand": "卫浴",
                    
                    "designerFlag": 1,
                    "packageFlag": 1,
                    
                    "designRegion": "设计一分区",
                    "designDepartment": "设计一部",
                    "materialDepartment": "主材二组",
                    
                    "createTime": "2016-01-01 15:31:55",
                    "preBalanceTime": "2016-01-01 00:00:00",
                    "postBalanceTime": "2016-01-01 00:00:00",
                    "fullpayTime": "2016-01-01 13:03:09",
                    
                    "type": 1,
                    "status": 0,
                    "balanceStatus": 0,
                    "otherStatus": 2000,
                    
                    "total": 0,
                    "distotal": 0,
                    "maling": 0,
                    "venderMaling": 0,
                    "coupon": 0,
                    "couponInfo": "",

                    "depositPayment": 0,
                    "depositStatus": 3,
                    "fullPayment": 2360000,
                    "fullStatus": 2000,
                    
                    "comment": ""
                }
                ...
            }
            
    .. method:: <I> queryMaterialByNo
    
        通过主材单号获取主材单信息
        
        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param material.no: 主材单号
        :type material.no: String
        
        Example::
        
            {
                "material.no": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param material: 主材单信息 , 类型 :data:`material`
        :type material: Object
        
        Example::
        
            {
                ...
                "material":{
                    "mid": 1,
                    "no": "M1601012703",
                    "orderId": "1601010001",
                    "house":{
                        "hid": 1,
                        "village": {
                            "vid": 1,
                            "no": "P001",
                            "name": "广场一期"
                        },
                        "houseNumber": "1#1-1-1",
                        "buildArea": 88.6
                    },
                    "salesman": {
                        "uid": 3,
                        "userId": "FL-00638",
                        "userName": "李宁",
                        "currentName": "李宁",
                        "phone": "156xxxx9283",
                        ...
                    },
                    "materialer": {
                        "uid": 21,
                        "userId": "FL-83726",
                        "userName": "王宁",
                        "currentName": "王宁",
                        "phone": "179xxxx2837",
                        ...
                    },
                    "instorer": {
                        "uid": 87,
                        "userId": "FL-83726",
                        "userName": "宋茜",
                        "currentName": "宋茜",
                        "phone": "138xxxx2837",
                        ...
                    },
                    
                    "grade": "B",
                    "category": "洁具",
                    "brand": "卫浴",
                    
                    "designerFlag": 1,
                    "packageFlag": 1,
                    
                    "designRegion": "设计一分区",
                    "designDepartment": "设计一部",
                    "materialDepartment": "主材二组",
                    
                    "createTime": "2016-01-01 15:31:55",
                    "preBalanceTime": "2016-01-01 00:00:00",
                    "postBalanceTime": "2016-01-01 00:00:00",
                    "fullpayTime": "2016-01-01 13:03:09",
                    
                    "type": 1,
                    "status": 0,
                    "balanceStatus": 0,
                    "otherStatus": 2000,
                    
                    "total": 0,
                    "distotal": 0,
                    "maling": 0,
                    "venderMaling": 0,
                    "coupon": 0,
                    "couponInfo": "",

                    "depositPayment": 0,
                    "depositStatus": 3,
                    "fullPayment": 2360000,
                    "fullStatus": 2000,
                    
                    "comment": ""
                }
                ...
            }
            
    .. method:: <I> addMaterial
    
        创建主材单信息 , 同时包括主材项信息
        
        判断主材单品牌信息与主材项品牌信息是否一致 , 不一致 , 错误信息 **180024 主材项品牌不一致**
        
        获取当前默认主材活动信息 , 同时赋值给创建的主材单
        
        主材项需要判断套餐项目过程 , 针对总价计算以及结算信息进行区分处理
        
        利用归属装修单等级和公司以及主材单归属公司 , 按照规则生成主材单等级信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param material.orderId: 装修单号
        :type material.orderId: String
        :param material.salesman.userId: 业务员编号
        :type material.salesman.userId: String
        :param material.materialer.userId: 主材员编号
        :type material.materialer.userId: String
        :param material.instore.userId: 驻店编号
        :type material.instore.userId: String
        :param material.category: 品类
        :type material.category: String
        :param material.bid: 品牌ID
        :type material.bid: Long
        :param material.brand: 品牌
        :type material.brand: String
        :param material.type: 类型 , 包括: 0:标准
        :type material.type: Short
        :param material.total: 总价
        :type material.total: Long
        :param material.maling: 抹零
        :type material.maling: Integer
        :param material.coupon: 券值
        :type material.coupon: Integer
        :param material.couponInfo: 券信息
        :type material.couponInfo: String
        :param material.comment: 说明
        :type material.comment: String
        
        :param materialItem[n].no: 型号编号
        :type materialItem[n].no: String
        :param materialItem[n].name: 型号名
        :type materialItem[n].name: String
        :param materialItem[n].category: 品类
        :type materialItem[n].category: String
        :param materialItem[n].brand: 品牌
        :type materialItem[n].brand: String
        :param materialItem[n].measurementUnit: 单位
        :type materialItem[n].measurementUnit: String
        :param materialItem[n].packageName: 套餐名
        :type materialItem[n].packageName: String
        :param materialItem[n].unitPrice: 单价
        :type materialItem[n].unitPrice: Integer
        :param materialItem[n].purchasePrice: 进价
        :type materialItem[n].purchasePrice: Integer
        :param materialItem[n].salePrice: 折后价
        :type materialItem[n].salePrice: Integer
        :param materialItem[n].price: 售价
        :type materialItem[n].price: Integer
        :param materialItem[n].discount: 折扣
        :type materialItem[n].discount: Integer
        :param materialItem[n].postDiscount: 折让
        :type materialItem[n].postDiscount: Integer
        :param materialItem[n].num: 数量
        :type materialItem[n].num: Integer
        :param materialItem[n].total: 总价
        :type materialItem[n].total: Integer
        :param materialItem[n].calcType: 结算方式
        :type materialItem[n].calcType: Integer
        :param materialItem[n].prePoint: 预结算值
        :type materialItem[n].prePoint: Integer
        :param materialItem[n].comment: 备注
        :type materialItem[n].comment: String
        
        Example::
        
            {
                "material.orderId": "1601010001",
                "material.salesman.userId": "U0186",
                "material.materialer.userId": "U0511",
                "material.instorer.userId": "",
                "material.category": "洁具",
                "material.bid": 1,
                "material.brand": "卫浴",
                "material.type": 1,
                "material.coupon": 0,
                "material.couponInfo": "",
                "material.maling": 0,
                "material.total": 0,
                "material.comment": "",
                
                "materialItem[0].no": "JP0005",
                "materialItem[0].name": "卫浴AB1116",
                "materialItem[0].category": "洁具",
                "materialItem[0].brand": "卫浴",
                "materialItem[0].measurementUnit": "个",
                "materialItem[0].packageName": "package",
                
                "materialItem[0].unitPrice": 2670000,
                "materialItem[0].purchasePrice": 1,
                "materialItem[0].salePrice": 2670000,
                "materialItem[0].price": 2670000,
                "materialItem[0].discount": 1,
                "materialItem[0].postDiscount": 1,
                "materialItem[0].num": 2000,
                "materialItem[0].total": 0,
                
                "materialItem[0].calcType": 1,
                "materialItem[0].prePoint": 0,
                
                "materialItem[0].comment": ""

            }
            
    .. method:: <I> changeMaterialForOrderId
    
        更换主材单所属装修单号
        
        判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**
        
        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param material.no: 主材单号
        :type material.no: String
        :param material.orderId: 更换装修单号
        :type material.orderId: String
        
        Example::
        
            {
                "material.no": "M1601012703",
                "material.orderId": "1601010001"
            }
            
    .. method:: <I> updateMaterialForCoupon
    
        更新主材单中券相关信息
        
        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**
        
        判断主材单状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**
        
        判断主材单补款状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**
        
        判断主材单结算状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param material.mid: 主材单ID
        :type material.mid: Long
        :param material.coupon: 券值
        :type material.coupon: Integer
        :param material.couponInfo: 券信息 , 例子: #洁具券:150#
        :type material.couponInfo: String
        
        Example::
        
            {
                "material.mid": 1,
                "material.coupon": 150000,
                "material.couponInfo": #洁具券:150#
            }
            
    .. method:: <I> updateMaterialForMaling
    
        更新主材单中抹零信息
        
        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**
        
        判断主材单状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**
        
        判断主材单补款状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**
        
        判断主材单结算状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param material.mid: 主材单ID
        :type material.mid: Long
        :param material.maling: 抹零
        :type material.maling: Integer
        :param material.venderMaling: 厂商抹零
        :type material.venderMaling: Integer
        
        Example::
        
            {
                "material.mid": 1,
                "material.maling": 100,
                "material.venderMaling": 100
            }
            
    .. method:: <I> updateMaterialForActivity
    
        更新主材单参与活动信息
        
        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param material.mid: 主材单ID
        :type material.mid: Long
        :param material.activityId: 活动ID
        :type material.activityId: Long
        
        Example::
        
            {
                "material.mid": 1,
                "material.activityId": 1
            }
            
    .. method:: <I> deleteMaterial
    
        删除主材单信息
        
        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**
        
        判断主材单状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**
        
        判断主材单定金状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**
        
        判断主材单补款状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**
        
        判断主材单结算状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**
        
        +---------+
        |Requests:|
        +---------+
        
        :param material.mid: 主材单ID
        :type material.mid: Long
        
        Example::
        
            {
                "material.mid": 1
            }

型号
================

主材单型号信息管理

.. class:: api.material.MaterialItemAction

    +---------+
    |DataType:|
    +---------+

    .. data:: materialItem
    
    :param miid: 主材项ID
    :type miid: Long
    :param mid: 主材单ID
    :type mid: Long
    :param no: 型号编号
    :type no: String
    :param name: 型号名
    :type name: String
    :param category: 品类
    :type category: String
    :param brand: 品牌
    :type brand: String
    :param measurementUnit: 单位
    :type measurementUnit: String
    :param packageName: 套餐名
    :type packageName: String
    :param unitPrice: 单价
    :type unitPrice: Integer
    :param purchasePrice: 进价
    :type purchasePrice: Integer
    :param salePrice: 折后价
    :type salePrice: Integer
    :param price: 售价
    :type price: Integer
    :param discount: 折扣
    :type discount: Integer
    :param postDiscount: 折让
    :type postDiscount: Integer
    :param num: 数量
    :type num: Integer
    :param total: 总价
    :type total: Integer
    :param status: 状态 , 包括: 0: 初始 , 1: 删除
    :type status: Short
    :param balanceStatus: 结算状态 , 包括: 0: 初始 , 1: 预结算 , 2: 结算
    :type balanceStatus: Short
    :param refundStatus: 退货状态 , 包括: 0: 初始 , 1: 退款
    :type refundStatus: Short
    :param rawCalcType: 原结算方式
    :type rawCalcType: Short
    :param rawPoint: 原结算值
    :type rawPoint: Integer
    :param calcType: 结算方式 , 包括: 0: 底价 , 1: 点位
    :type calcType: Short
    :param prePoint: 预结算值
    :type prePoint: Integer
    :param postPoint: 结算值
    :type postPoint: Integer
    :param comment: 备注
    :type comment: String

    .. method:: <I> queryMaterialItemByMid
    
        通过主材单ID获取型号信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param material.mid: 主材单ID
        :type material.mid: Long
        
        Example::
        
            {
                "material.mid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param materialItems: 型号信息列表 , 每条数据类型 :data:`materialItem`
        :type materialItems: List
        
        Example::
        
            {
                ...
                "materialItems": [
                    {
                        "miid": 1,
                        "mid": 1,
                        "no": "JP0005",
                        "name": "卫浴AB1116",
                        "category": "洁具",
                        "brand": "卫浴",
                        "measurementUnit": "个",
                        "packageName": "package",
                        
                        "unitPrice": 2670000,
                        "purchasePrice": 1,
                        "salePrice": 2670000,
                        "price": 2670000,
                        "discount": 1,
                        "postDiscount": 1,
                        "num": 2000,
                        "total": 0,
                        
                        "status": 0,
                        "balanceStatus": 0,
                        "refundStatus": 0,
                        
                        "rawCalcType": 0,
                        "rawPoint": 1,
                        "calcType": 1,
                        "prePoint": 0,
                        "postPoint": 0,
                        
                        "comment": null
                    }
                ],
                ...
            }
            
    .. method:: <I> queryMaterialItemByMiid
    
        通过主材项ID获取型号信息 , 返回结果为销售基础信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialItem.miid: 主材项ID
        :type materialItem.miid: Long
        
        Example::
        
            {
                "materialItem.miid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param materialItem: 型号信息 , 类型 :data:`materialItem`
        :type materialItem: List
        
        Example::
        
            {
                ...
                "materialItem": {
                    "miid": 1,
                    "mid": 1,
                    "no": "JP0005",
                    "name": "卫浴AB1116",
                    "category": "洁具",
                    "brand": "卫浴",
                    "measurementUnit": "个",
                    "packageName": "package",
                    
                    "unitPrice": 2670000,
                    "purchasePrice": 1,
                    "salePrice": 2670000,
                    "price": 2670000,
                    "discount": 1,
                    "postDiscount": 1,
                    "num": 2000,
                    "total": 0,
                    
                    "status": 0,
                    "balanceStatus": 0,
                    "refundStatus": 0,
                    
                    "rawCalcType": 0,
                    "rawPoint": 1,
                    "calcType": 1,
                    "prePoint": 0,
                    "postPoint": 0,
                    
                    "comment": null
                }
                ...
            }
            
    .. method:: <I> queryMaterialItemForNameByName
    
        通过主材项名称查询指定主材单下型号相关信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialItem.mid: 主材单ID
        :type materialItem.mid: Long
        :param materialItem.name: 型号名称
        :type materialItem.name: String
        
        Example::
        
            {
                "materialItem.mid": 1,
                "materialItem.name": "卫浴"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param materialItems: 型号信息列表 , 每条数据类型 :data:`materialItem`
        :type materialItems: List
        
        Example::
        
            {
                ...
                "materialItems": [
                    {
                        "miid": 1,
                        "mid": 1,
                        "no": "JP0005",
                        "name": "卫浴AB1116",
                        "category": "洁具",
                        "brand": "卫浴",
                        "measurementUnit": "个",
                        "packageName": "package",
                        
                        "unitPrice": 2670000,
                        "purchasePrice": 1,
                        "salePrice": 2670000,
                        "price": 2670000,
                        "discount": 1,
                        "postDiscount": 1,
                        "num": 2000,
                        "total": 0,
                        
                        "status": 0,
                        "balanceStatus": 0,
                        "refundStatus": 0,
                        
                        "rawCalcType": 0,
                        "rawPoint": 1,
                        "calcType": 1,
                        "prePoint": 0,
                        "postPoint": 0,
                        
                        "comment": null
                    }
                ],
                ...
            }
    
    .. method:: <I> queryMaterialItemForNameByNo
    
        通过主材项编号查询指定主材单下型号相关信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialItem.mid: 主材单ID
        :type materialItem.mid: Long
        :param materialItem.no: 型号编号
        :type materialItem.no: String
        
        Example::
        
            {
                "materialItem.mid": 1,
                "materialItem.no": "AB1154"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param materialItems: 型号信息列表 , 每条数据类型 :data:`materialItem`
        :type materialItems: List
        
        Example::
        
            {
                ...
                "materialItems": [
                    {
                        "miid": 1,
                        "mid": 1,
                        "no": "JP0005",
                        "name": "卫浴AB1116",
                        "category": "洁具",
                        "brand": "卫浴",
                        "measurementUnit": "个",
                        "packageName": "package",
                        
                        "unitPrice": 2670000,
                        "purchasePrice": 1,
                        "salePrice": 2670000,
                        "price": 2670000,
                        "discount": 1,
                        "postDiscount": 1,
                        "num": 2000,
                        "total": 0,
                        
                        "status": 0,
                        "balanceStatus": 0,
                        "refundStatus": 0,
                        
                        "rawCalcType": 0,
                        "rawPoint": 1,
                        "calcType": 1,
                        "prePoint": 0,
                        "postPoint": 0,
                        
                        "comment": null
                    }
                ],
                ...
            }
            
    .. method:: <I> addMaterialItem
    
        主材单中添加主材项信息
        
        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**
        
        判断主材单状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**
        
        判断主材单补款状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**
        
        判断主材单结算状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**
        
        主材项需要判断套餐项目过程 , 针对总价计算以及结算信息进行区分处理
        
        更新主材单中总价金额
        
        +---------+
        |Requests:|
        +---------+
        
        :param material.mid: 主材单ID
        :type material.mid: Long
        
        :param materialItem[n].no: 型号名
        :type materialItem[n].no: String
        :param materialItem[n].name: 型号名
        :type materialItem[n].name: String
        :param materialItem[n].category: 品类
        :type materialItem[n].category: String
        :param materialItem[n].brand: 品牌
        :type materialItem[n].brand: String
        :param materialItem[n].measurementUnit: 单位
        :type materialItem[n].measurementUnit: String
        :param materialItem[n].packageName: 套餐名
        :type materialItem[n].packageName: String
        :param materialItem[n].unitPrice: 单价
        :type materialItem[n].unitPrice: Integer
        :param materialItem[n].purchasePrice: 进价
        :type materialItem[n].purchasePrice: Integer
        :param materialItem[n].salePrice: 折后价
        :type materialItem[n].salePrice: Integer
        :param materialItem[n].price: 售价
        :type materialItem[n].price: Integer
        :param materialItem[n].discount: 折扣
        :type materialItem[n].discount: Integer
        :param materialItem[n].postDiscount: 折让
        :type materialItem[n].postDiscount: Integer
        :param materialItem[n].num: 数量
        :type materialItem[n].num: Integer
        :param materialItem[n].total: 总价
        :type materialItem[n].total: Integer
        :param materialItem[n].calcType: 结算方式
        :type materialItem[n].calcType: Integer
        :param materialItem[n].prePoint: 预结算值
        :type materialItem[n].prePoint: Integer
        :param materialItem[n].comment: 备注
        :type materialItem[n].comment: String
        
        Example::
        
            {
                "material.mid": 1,
                "materialItem[0].no": "JP0005",
                "materialItem[0].name": "卫浴AB1116",
                "materialItem[0].category": "洁具",
                "materialItem[0].brand": "卫浴",
                "materialItem[0].measurementUnit": "个",
                "materialItem[0].packageName": "package",
                
                "materialItem[0].unitPrice": 2670000,
                "materialItem[0].purchasePrice": 1,
                "materialItem[0].salePrice": 2670000,
                "materialItem[0].price": 2670000,
                "materialItem[0].discount": 1,
                "materialItem[0].postDiscount": 1,
                "materialItem[0].num": 2000,
                "materialItem[0].total": 0,
                "materialItem[0].calcType": 1,
                "materialItem[0].prePoint": 0,
                "materialItem[0].comment": "",
                
            }
            
    .. method:: <I> updateMaterialItemForModel
    
        更新型号类型的型号信息
        
        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**
        
        判断主材单状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**
        
        判断主材单补款状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**
        
        判断主材单结算状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**
        
        判断主材项是否存在 , 不存在 , 错误信息 **180022 主材项不存在**
        
        只可更新主材项数量 , 通过利用主材项价格信息更新项目总价以及主材单总价
        
        +---------+
        |Requests:|
        +---------+
        
        :param material.mid: 主材单ID
        :type material.mid: Long
        :param materialItem.miid: 主材项ID
        :type materialItem.miid: Long
        :param materialItem.num: 数量
        :type materialItem.num: Integer
        :param materialItem.total: 总价
        :type materialItem.total: Integer
        
        Example::
        
            {
                "material.mid": 1,
                "materialItem.miid": 2000,
                "materialItem.num": 2000,
                "materialItem.total": 0
            }
            
    .. method:: <I> updateMaterialItemForPackage
    
        更新套餐类型的型号信息
        
        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**
        
        判断主材单状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**
        
        判断主材单补款状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**
        
        判断主材单结算状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**
        
        判断主材项是否存在 , 不存在 , 错误信息 **180022 主材项不存在**
        
        只可更新主材项数量以及总价 , 总价代表套餐整体价格 , 通过利用主材项价格信息更新项目总价以及主材单总价
        
        +---------+
        |Requests:|
        +---------+
        
        :param material.mid: 主材单ID
        :type material.mid: Long
        
        :param materialItem[n].miid: 主材项ID
        :type materialItem[n].miid: Long
        :param materialItem[n].packageName: 套餐名
        :type materialItem[n].packageName: String
        :param materialItem[n].num: 数量
        :type materialItem[n].num: Integer
        :param materialItem[n].total: 总价
        :type materialItem[n].total: Integer
        
        Example::
        
            {
                "material.mid": 1,
                "materialItem[0].miid": 1,
                "materialItem[0].packageName": "套餐1",
                "materialItem[0].num": 2000,
                "materialItem[0].total": 0,
            }
            
    .. method:: <I> changeMaterialItemForCaclType
    
        更改主材项结算方式
        
        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**
        
        判断主材单结算状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**
        
        判断主材项是否存在 , 不存在 , 错误信息 **180022 主材项不存在**
        
        判断主材项是否为套餐 , 套餐不可修改 , 错误信息 **180010 套餐不能修改结算方式**
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialItem.miid: 主材型号ID
        :type materialItem.miid: Long
        :param materialItem.prePoint: 结算值
        :type materialItem.prePonit: Integer
        
        Example::
        
            {
                "materialItem.miid": 1,
                "materialItem.prePoint": 10
            }

    .. method:: <I> updateMaterialItemForPrePT
    
        更新主材项预结算计算值

        +---------+
        |Requests:|
        +---------+
        
        :param materialItem.miids: 主材项ID
        :type materialItem.miids: Long
        
        Example::
        
            {
                "materialItem.miids": 15
            }
            
    .. method:: <I> deleteMaterialItem
    
        删除主材项信息
        
        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**
        
        判断主材单状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**
        
        判断主材单补款状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**
        
        判断主材单结算状态是否为0(初始) , 其他状态 , 错误信息 **180025 主材单不可操作**
        
        计算项目总金额更新主材单总金额
        
        +---------+
        |Requests:|
        +---------+
        
        :param material.mid: 主材单ID
        :type material.mid: Long
        :param miids[n]: 主材项ID列表 , 类型为 Long
        :type miids[n]: List
        
        Example::
        
            {
                "material.mid": 1,
                "miids[0]": 1,
                "miids[1]": 2
            }

退货
================

主材单退货信息管理

.. class:: api.material.MaterialRefundAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: materialRefund
    
    :param mrid: 退货型号ID
    :type mrid: Long
    :param mid: 主材单ID
    :type mid: Long
    :param miid: 主材项ID
    :type miid: Long
    :param ident: 批次标识 , 标识退货批次
    :type ident: Integer
    :param no: 型号编号
    :type no: String
    :param name: 型号名
    :type name: String
    :param category: 品类
    :type category: String
    :param brand: 品牌
    :type brand: String
    :param measurementUnit: 单位
    :type measurementUnit: String
    :param packageName: 套餐名
    :type packageName: String
    :param unitPrice: 单价
    :type unitPrice: Integer
    :param purchasePrice: 进价
    :type purchasePrice: Integer
    :param salePrice: 折后价
    :type salePrice: Integer
    :param price: 售价
    :type price: Integer
    :param discount: 折扣
    :type discount: Integer
    :param postDiscount: 折让
    :type postDiscount: Integer
    :param num: 数量
    :type num: Integer
    :param total: 总价
    :type total: Integer
    :param status: 状态 , 包括: 0: 退货 , 1: 取消 , 2: 已收款 , 3: 已确认
    :type status: Short
    :param balanceType: 结算类型
    :type balanceType: Integer
    :param comment: 备注
    :type comment: String
    
    .. method:: <I> queryMaterialRefundByMid
    
        通过主材单ID获取退货信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialRefund.mid: 主材单ID
        :type materialRefund.mid: Long
        
        Example::
        
            {
                "materialRefund.mid": 1
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param materialRefunds: 型号信息列表 , 每条数据类型 :data:`materialRefund`
        :type materialRefunds: List
        
        Example::
        
            {
                ...
                "materialRefunds": [
                    {
                        "mrid": 31,
                        "mid": 8,
                        "miid": 10000,
                        "ident": 382000,
                        "no": "JP0005",
                        "name": "卫浴AB1154",
                        "category": "洁具",
                        "brand": "卫浴",
                        "measurementUnit": "个"
                        "packageName": "package",
                        "unitPrice": 2670000,
                        "salePrice": 2670000,
                        "price": 2670000,
                        "discount": 1,
                        "postDiscount": 1,
                        "num": 2000,
                        "total": 0,
                        "status": 0,
                        "balanceStatus": 0,
                        "refundDes": "",
                        "postPoint": 0,
                        "prePoint": 0,
                        "comment": ""
                    }
                ],
                ...
            }
        
结算
================

主材单结算功能

.. class:: api.material.MaterialBalanceAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: materialBalance
    
    :param mbid: 结算ID
    :type mbid: Long
    :param material: 主材单 , 类型 `material <./material.html#api.material.MaterialAction.material>`__
    :type material: Object
    :param creater: 创建人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type creater: Object
    :param instorer: 主材驻店 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type instorer: Object
    :param poster: 结算人 , 类型 `user <./user.html#api.personel.UserAction.user>`__
    :type poster: Object
    :param balanceTime: 预结算时间 , 既创建时间
    :type balanceTime: Timestamp
    :param postTime: 结算时间
    :type postTime: Timestmp
    :param balance: 结算值 , 利润
    :type balance: Long
    :param difference: 差值 , 既总额 - 结算值
    :type difference: Long
    :param vbalance: 厂商结算
    :type vbalance: Long
    :param post: 结算值
    :type post: Long
    :param vbalanceTime: 厂商结算时间
    :type vbalanceTime: Timestamp
    :param total: 总价 , 生成结算数据时 , 购货类型记录主菜单总额 , 预结算/结算退货时记录退货款金额
    :type total: Long
    :param status: 状态 , 0: 预结算 , 1: 厂商结算 , 2: 结算
    :type status: Short
    :param type: 类型 , 0: 购货 , 1: 预结算退货 , 2: 结算退货 
    :type type: Short
    :param ident: 退货标识
    :type ident: Integer
    :param mpid: 款项ID, 类型为1(预结算退货)和2(结算退货)需要关联退货生成款项
    :type mpid: Integer
    
    +--------+
    |Filters:|
    +--------+
    
    :param msoNo: 主材单号
    :type msoNo: String
    :param instoreId: 驻店员编号
    :type instoreId: String
    :param orderId: 装修单号
    :type orderId: String
    :param type: 类型 , 0: 购货 , 1: 退货
    :type type: Short
    :param status: 状态 , 0: 预结算 , 1: 厂商结算 , 2: 结算
    :type status: Short
    :param fullCollectTimeRange: 补款收款时间 , 格式: 2016/01/01-2016/01/01
    :type fullCollectTimeRange: String
    
    .. method:: <I> pageMaterialBalance
    
        分页方式获取主材结算信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 主材单信息列表 , 每条数据类型 :data:`materialBalance`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            mbid: 1,
                            creater: {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "instorer": null,
                            "poster": null,
                            "balanceTime": "2016-01-01 00:00:00",
                            "balance": 0,
                            "difference": 0,
                            "vbalance": 0,
                            "vbalanceTime": null,
                            "total": 100,
                            "status": 0,
                            "type": 0,
                            "ident": 0,
                            "material": {
                                "mid": 1,
                                "no": "M1601012703",
                                "orderId": "1601010001",
                                "house":{
                                    "hid": 1,
                                    "village": {
                                        "vid": 1,
                                        "no": "P001",
                                        "name": "广场一期"
                                    },
                                    "houseNumber": "1#1-1-1",
                                    "buildArea": 88.6
                                },
                                "salesman": {
                                    "uid": 3,
                                    "userId": "FL-00638",
                                    "userName": "李宁",
                                    "currentName": "李宁",
                                    "phone": "156xxxx9283",
                                    ...
                                },
                                "materialer": {
                                    "uid": 21,
                                    "userId": "FL-83726",
                                    "userName": "王宁",
                                    "currentName": "王宁",
                                    "phone": "179xxxx2837",
                                    ...
                                },
                                "instorer": {
                                    "uid": 87,
                                    "userId": "FL-83726",
                                    "userName": "宋茜",
                                    "currentName": "宋茜",
                                    "phone": "138xxxx2837",
                                    ...
                                },
                                
                                "category": "洁具",
                                "brand": "卫浴",
                                
                                "designerFlag": 1,
                                "packageFlag": 1,
                                
                                "designRegion": "设计一分区",
                                "designDepartment": "设计一部",
                                "materialDepartment": "主材二组",
                                
                                "createTime": "2016-01-01 15:31:55",
                                "preBalanceTime": "2016-01-01 00:00:00",
                                "postBalanceTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 13:03:09",
                                
                                "type": 1,
                                "status": 0,
                                "balanceStatus": 0,
                                "otherStatus": 2000,
                                
                                "total": 0,
                                "distotal": 0,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": "",

                                "depositPayment": 0,
                                "depositStatus": 3,
                                "fullPayment": 2360000,
                                "fullStatus": 2000,
                                
                                "comment": ""
                            }
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> pageMaterialBalanceForVender
    
        分页方式获取主材结算信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        根据当前登陆系统的用户信息获取关联的主材驻店人员进行获取主材结算信息
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 主材结算信息列表 , 每条数据类型 :data:`materialBalance`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            mbid: 1,
                            creater: {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "instorer": null,
                            "poster": null,
                            "balanceTime": "2016-01-01 00:00:00",
                            "balance": 0,
                            "difference": 0,
                            "vbalance": 0,
                            "vbalanceTime": null,
                            "total": 100,
                            "status": 0,
                            "type": 0,
                            "ident": 0,
                            "material": {
                                "mid": 1,
                                "no": "M1601012703",
                                "orderId": "1601010001",
                                "house":{
                                    "hid": 1,
                                    "village": {
                                        "vid": 1,
                                        "no": "P001",
                                        "name": "广场一期"
                                    },
                                    "houseNumber": "1#1-1-1",
                                    "buildArea": 88.6
                                },
                                "salesman": {
                                    "uid": 3,
                                    "userId": "FL-00638",
                                    "userName": "李宁",
                                    "currentName": "李宁",
                                    "phone": "156xxxx9283",
                                    ...
                                },
                                "materialer": {
                                    "uid": 21,
                                    "userId": "FL-83726",
                                    "userName": "王宁",
                                    "currentName": "王宁",
                                    "phone": "179xxxx2837",
                                    ...
                                },
                                "instorer": {
                                    "uid": 87,
                                    "userId": "FL-83726",
                                    "userName": "宋茜",
                                    "currentName": "宋茜",
                                    "phone": "138xxxx2837",
                                    ...
                                },
                                
                                "category": "洁具",
                                "brand": "卫浴",
                                
                                "designerFlag": 1,
                                "packageFlag": 1,
                                
                                "designRegion": "设计一分区",
                                "designDepartment": "设计一部",
                                "materialDepartment": "主材二组",
                                
                                "createTime": "2016-01-01 15:31:55",
                                "preBalanceTime": "2016-01-01 00:00:00",
                                "postBalanceTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 13:03:09",
                                
                                "type": 1,
                                "status": 0,
                                "balanceStatus": 0,
                                "otherStatus": 2000,
                                
                                "total": 0,
                                "distotal": 0,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": "",

                                "depositPayment": 0,
                                "depositStatus": 3,
                                "fullPayment": 2360000,
                                "fullStatus": 2000,
                                
                                "comment": ""
                            }
                        }
                    ],
                    ...
                },
                ...
            }

    .. method:: <I> pageMaterialForPreBalance
    
        分页方式获取需要预结算的主材单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        +--------+
        |Returns:|
        +--------+
        
        :param paging: 分页信息
        :type paging: Object
        :param paging.data: 主材单信息列表 , 每条数据类型 :data:`material`
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "mid": 1,
                            "no": "M1601012703",
                            "orderId": "1601010001",
                            "house":{
                                "hid": 1,
                                "village": {
                                    "vid": 1,
                                    "no": "P001",
                                    "name": "广场一期"
                                },
                                "houseNumber": "1#1-1-1",
                                "buildArea": 88.6
                            },
                            "salesman": {
                                "uid": 3,
                                "userId": "FL-00638",
                                "userName": "李宁",
                                "currentName": "李宁",
                                "phone": "156xxxx9283",
                                ...
                            },
                            "materialer": {
                                "uid": 21,
                                "userId": "FL-83726",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "179xxxx2837",
                                ...
                            },
                            "instorer": {
                                "uid": 87,
                                "userId": "FL-83726",
                                "userName": "宋茜",
                                "currentName": "宋茜",
                                "phone": "138xxxx2837",
                                ...
                            },
                            
                            "category": "洁具",
                            "brand": "卫浴",
                            
                            "designerFlag": 1,
                            "packageFlag": 1,
                            
                            "designRegion": "设计一分区",
                            "designDepartment": "设计一部",
                            "materialDepartment": "主材二组",
                            
                            "createTime": "2016-01-01 15:31:55",
                            "preBalanceTime": "2016-01-01 00:00:00",
                            "postBalanceTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 13:03:09",
                            
                            "type": 1,
                            "status": 0,
                            "balanceStatus": 0,
                            "otherStatus": 2000,
                            
                            "total": 0,
                            "distotal": 0,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": "",

                            "depositPayment": 0,
                            "depositStatus": 3,
                            "fullPayment": 2360000,
                            "fullStatus": 2000,
                            
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }
            
    .. method:: <I> updateMaterialBalanceForVBalance
    
        更新主材结算信息中的厂商结算值
        
        判断主材结算信息是否存在 , 不存在 , 错误信息 **180018 主材结算信息不存在**
        
        判断主材结算信息状态是否为0(预结算) , 其他状态 **180019 主材结算信息状态错误**
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialBalance.mbid: 结算ID
        :type materialBalance.mbid: Long
        :param materialBalance.vbalance: 厂商结算值
        :type materialBalance.vbalance: Long
        
        Example::
        
            {
                "materialBalance.mbid": 1,
                "materialBalance.vbalance": 100
            }
            
    .. method:: <I> updateMaterialBalanceForBalance
    
        更新主材结算信息中的结算值
        
        判断主材结算信息是否存在 , 不存在 , 错误信息 **180018 主材结算信息不存在**
        
        判断主材结算信息状态是否为1(厂商结算) , 其他状态 **180019 主材结算信息状态错误**
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialBalance.mbid: 结算ID
        :type materialBalance.mbid: Long
        :param materialBalance.balance: 厂商结算值
        :type materialBalance.balance: Long
        
        Example::
        
            {
                "materialBalance.mbid": 1,
                "materialBalance.balance": 100
            }
            
    .. method:: <I> passBalanceMaterial
    
        批量处理主材单到完结 , 主要提供跳过主材结算过程
        
        根据主材单状态以及结算状态处理 , 状态为0(初始) , 结算状态为0(初始)
        
        更新主材单状态为9(完结)
        
        +---------+
        |Requests:|
        +---------+
        
        :param mids[n]: 主材单ID列表 , 每条数据类型 Long
        :type mids[n]: List
        
        Example::
        
            {
                "mids[0]": 1,
                "mids[1]": 2
            }
            
    .. method:: <I> preBalanceMaterial
    
        批量预结算主材单
        
        判断主材单是否存在 , 不存在 , 错误信息 **180001 主材单不存在**
        
        判断预结算的主材单是否存在未处理审批 , 存在未处理审批 , 错误信息 **240007 存在未处理审批信息**
        
        判断主材单状态以及结算状态进行处理 , 状态为0(初始) , 结算状态为0(初始) , 补款状态为3(已确认) , 满足三个状态可以进行预结算处理
        
        生成主材单对应的主材结算信息
        
        利润计算公式 , 套餐商品只能根据点位方式进行计算
        
        点位计算方式: 利润 = (售价 - 折扣价 * (1 - 点位)) * 数量 , 成本 = 折扣价 * (1 - 点位) * 数量
        
        底价计算方式: 利润 = (售价 - 底价) * 数量 , 成本 = 底价 * 数量
        
        套餐计算方式: 利润 = 总价 * 点位 , 成本 = 总价 * (1 - 点位)
        
        +---------+
        |Requests:|
        +---------+
        
        :param mids[n]: 主材单ID列表 , 每条数据类型 Long
        :type mids[n]: List
        
        Example::
        
            {
                "mids[0]": 1,
                "mids[1]": 2
            }
        
    .. method:: <I> vpostMaterialBalance
    
        厂商结算
        
        判断主材结算信息是否存在 , 不存在 , 错误信息 **180018 主材结算信息不存在**
        
        判断主材结算信息状态是否为0(预结算) , 其他状态 **180019 主材结算信息状态错误**
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialBalance.mbid: 结算ID
        :type materialBalance.mbid: Long
        
        Example::
        
            {
                "materialBalance.mbid": 1
            }
            
    .. method:: <I> postMaterialBalance
    
        结算
        
        判断主材结算信息是否存在 , 不存在 , 错误信息 **180018 主材结算信息不存在**
        
        判断主材结算信息状态是否为1(厂商结算) , 其他状态 **180019 主材结算信息状态错误**
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialBalance.mbid: 结算ID
        :type materialBalance.mbid: Long
        
        Example::
        
            {
                "materialBalance.mbid": 1
            }

活动
================

主材单活动管理

.. class:: api.material.MaterialActivityAction

    +---------+
    |DataType:|
    +---------+
    
    .. data:: materialActivityItem
    
    :param maiid: 活动项ID
    :type maiid: Long
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
    
    :param type: 类型 , 0: 券 , 1: 物品
    :type type: Short
    :param state: 状态 , 0: 初始 , 1: 失效 , 2: 已领 , 3: 退货 , 4: 配送 , 5: 未退 , 6: 升级 , 7: 消耗
    :type state: Short
    :param isStock: 是否计入库存 , 0: 计入 , 1: 不计入
    :type isStock: Short
    :param isPayment: 是否计入金额 , 0: 计入 , 1: 不计入 , 主要体现在装修实收额计算
    :type isPayment: Short
    
    :param num: 数量
    :type num: Integer
    :param money: 价格
    :type money: Integer
    :param content: 备注
    :type content: String
    
    :param receiveUserId: 接收人编号
    :type receiveUserId: String
    :param receiveUserName: 接收人名
    :type receiveUserName: String
    :param receiveTime: 接收时间
    :type receiveTime: Timestamp
    
    .. method:: <I> queryMaterialActivity
    
        通过装修单号 , 获取归属主材单参与的活动信息以及款项信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param material.orderId: 装修单号
        :type material.orderId: String
        
        Example::
        
            {
                "material.orderId": "1601010001"
            }
        
        +--------+
        |Returns:|
        +--------+
        
        :param materialActivitys: 活动信息 , 类型 List <Map <String, String>>
        :type materialActivitys: Object
        
        Example::
        
            {
                ...
                "materialActivitys":[
                    {
                        "aid": 1,
                        "activity": "活动",
                        "amount": 1530,
                    }
                ],
                ...
            }
    
    .. method:: <I> queryMaterialActivityItem
    
        通过装修单号 , 查询归属所有主材单参与的活动项信息
        
        +---------+
        |Requests:|
        +---------+
        
        :param material.orderId: 装修单号
        :type material.orderId: String
        
        Example::
        
            {
                "material.orderId": "1601010001"
            }
            
        +--------+
        |Returns:|
        +--------+
        
        :param materialActivityItems: 活动项信息列表 , 每条数据类型 :data:`materialActivityItem`
        :type materialActivityItems: List
        
        Example::
        
            {
                ...
                "MaterialActivityItems": [
                    {
                        "maiid": 1,
                        "orderId": "1601010001",
                        "aid": 1,
                        "asid": 1,
                        "activity": "测试",
                        "name": "测试项",
                        "state": 0,
                        "type": 0,
                        "stateType": 0,
                        
                        "money": 100,
                        "num": 1,
                        "content": "",
                        
                        
                        "receiveTime": "2016-08-21 15:00:54",
                        "receiveUserId": "",
                        "receiveUserName": ""
                    }
                ],
                ...
            }
            
    .. method:: <I> addMaterialActivityItem
    
        添加主材活动项
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialActivityItem.orderId: 装修单号
        :type materialActivityItem.orderId: String
        :param materialActivityItem.aid: 活动ID
        :type materialActivityItem.aid: Long
        :param materialActivityItem.asid: 奖品ID
        :type materialActivityItem.asid: Long
        :param materialActivityItem.activity: 活动名
        :type materialActivityItem.activity: String
        :param materialActivityItem.name: 物品名
        :type materialActivityItem.name: String
        :param materialActivityItem.type: 类型
        :type materialActivityItem.type: Short
        :param materialActivityItem.num: 数量
        :type materialActivityItem.num: Integer
        :param materialActivityItem.money: 金额
        :type materialActivityItem.money: Integer
        :param materialActivityItem.content: 说明
        :type materialActivityItem.content: String
        
        Example::
        
            {
                "materialActivityItem.orderId": "1601010001",
                "materialActivityItem.aid": 1,
                "materialActivityItem.asid": 1,
                "materialActivityItem.activity": "活动名",
                "materialActivityItem.name": "活动项",
                "materialActivityItem.type": 0,
                "materialActivityItem.num": 1500,
                "materialActivityItem.money": 10000,
                "materialActivityItem.content": "说明"
            }
            
    .. method:: <I> receiveMaterialActivityItem
    
        领取主材活动项
        
        判断主材活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**
        
        判断奖品信息是否存在 , 不存在 , 错误信息 **160043 物品不存在**
        
        判断奖品数量是否满足出库数量 , 不满足 , 错误信息 **160038 库存不足**
        
        判断主材活动项中是否计入库存标识 , 更新关联奖品对应的库存数量 , 同时生成奖品记录
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialActivityItem.maiid: 活动项ID
        :type materialActivityItem.maiid: Long
        
        Example::
        
            {
                "materialActivityItem.maiid": 1
            }
            
    .. method:: <I> abateMaterialActivityItem
    
        失效主材活动项
        
        判断主材活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**
        
        判断主材活动项状态为0(初始) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**
        
        主材活动项状态更新为1(失效)
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialActivityItem.maiid: 活动项ID
        :type materialActivityItem.maiid: Long
        
        Example::
        
            {
                "materialActivityItem.maiid": 1
            }
            
    .. method:: <I> deliveMaterialActivityItem
    
        配送主材活动项
        
        判断主材活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**
        
        判断主材活动项状态为0(初始) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**
        
        主材活动项状态更新为4(配送)
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialActivityItem.daiid: 活动项ID
        :type materialActivityItem.daiid: Long
        
        Example::
        
            {
                "materialActivityItem.daiid": 1
            }
            
    .. method:: <I> unrefundMaterialActivityItem
    
        未退装修活动 , 已审批未退货
        
        判断主材活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**
        
        判断主材活动项状态为2(已领) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**
        
        主材活动项状态更新为5(未退)
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialActivityItem.daiid: 活动项ID
        :type materialActivityItem.daiid: Long
        
        Example::
        
            {
                "materialActivityItem.daiid": 1
            }
            
    .. method:: <I> refundMaterialActivityItem
    
        退货主材活动项
        
        判断主材活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**
        
        判断主材活动项状态为2(已领)/5(未退) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**
        
        主材活动项状态更新为3(退货)
        
        判断主材活动项中是否计入库存标识 , 更新关联奖品对应的库存数量 , 同时生成奖品记录以及装修单号
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialActivityItem.daiid: 活动项ID
        :type materialActivityItem.daiid: Long
        
        Example::
        
            {
                "materialActivityItem.daiid": 1
            }
        
    .. method:: <I> expendMaterialActivityItem
    
        消耗主材活动项
        
        判断主材活动项是否存在 , 不存在 , 错误信息 **140030 订单活动物品不存在**
        
        判断主材活动项状态为2(已领) , 其他状态不可操作 , 错误信息 **140057 订单活动奖品不可操作**
        
        主材活动项状态更新为7(消耗)
        
        +---------+
        |Requests:|
        +---------+
        
        :param materialActivityItem.daiid: 活动项ID
        :type materialActivityItem.daiid: Long
        
        Example::
        
            {
                "materialActivityItem.daiid": 1
            }