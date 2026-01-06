# customer {#customer}

# 客户
## 客户

客户信息管理

## api.communion.CustomerAction

        |DataType:|
        #### customer

    - **cid**: 客户ID
      - 类型: *Long*
    - **no**: 客户编号
      - 类型: *String*
    - **name**: 客户名称
      - 类型: *String*
    - **pinyinAll**: 客户名称拼音
      - 类型: *String*
    - **pinyinAB**: 客户名称拼音缩写
      - 类型: *String*
    - **gender**: 性别
      - 类型: *String*
    - **identity**: 身份证
      - 类型: *String*
    - **officer**: 军官证
      - 类型: *String*
    - **passport**: 护照
      - 类型: *String*
    - **passhkm**: 港澳通行证
      - 类型: *String*
    - **qq**: QQ
      - 类型: *String*
    - **wechat**: 微信
      - 类型: *String*
    - **email**: 邮件
      - 类型: *String*
    - **career**: 职业
      - 类型: *String*
    - **address**: 地址
      - 类型: *String*
    - **relationshipType**: 客户关系 , 普通客户 , 企业高端客户 , 企业关系客户 , 领导关系客户 , 员工关系客户
      - 类型: *String*
    - **type**: 类型 , 0: 个人 , 1: 公司
      - 类型: *Short*
    
    - **photoPath**: 照片
      - 类型: *String*
    - **identityPathF**: 身份证正面
      - 类型: *String*
    - **identityPathB**: 身份证背面
      - 类型: *String*
    - **status**: 状态 , 包括: 0(有效) , 1(认证) , 2(本地认证)
      - 类型: *Short*
    
    - **companyNo**: 编号 , 统一社会信用代码
      - 类型: *String*
    - **companyName**: 公司名
      - 类型: *String*
    - **companyAddr**: 公司地址
      - 类型: *String*
    - **companyPhone**: 公司电话
      - 类型: *String*
    - **companyBank**: 开户行
      - 类型: *String*
    - **companyBankno**: 开户账号
      - 类型: *String*
    
    - **phones**: 电话 , 每条数据 *customerPhone*
      - 类型: *List*
    
    #### customerPhone

    - **cpid**: 客户电话ID
      - 类型: *Long*
    - **cid**: 客户ID
      - 类型: *Long*
    - **phone**: 电话
      - 类型: *String*
    - **status**: 状态 , 0(启用), 1(禁用)
      - 类型: *Short*
    - **defaults**: 默认 , 0(非默认) , 1(默认)
      - 类型: *Short*
    
    #### keyValue

    - **key**: 键
      - 类型: *String*
    - **value**: 值
      - 类型: *String*
    
        |Filters:|
        - **name**: 客户名称
      - 类型: *String*
    - **customerPhone**: 客户电话
      - 类型: *String*
    - **relationshipType**: 客户关系
      - 类型: *String*
    
    ### <I> pageCustomer

        分页方式获取客户信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 客户信息列表 , 每条数据类型 *customer*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> queryCustomerById

        通过客户编号获取客户信息
        
                |Requests:|
                :param customer.id: 客户ID
        :type customer.id: String
        
        Example::
        
            {
                "customer.id": 1
            }
            
                |Returns:|
                - **customer**: 客户信息 , 类型 *customer*
          - 类型: *object*
        
        Example::
        
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
            
    ### <I> queryCustomerForName

        通过拼音获取客户名信息
        
                |Requests:|
                - **pinyinName**: 楼盘名拼音
          - 类型: *String*
        
        Example::
        
            {
                "pinyinName": "li"
            }
            
                |Returns:|
                - **customers**: 客户信息列表 , 每条数据类型 *customer*
          - 类型: *List*
        - **autoFillList**: 客户名列表 , 每条数据类型String
          - 类型: *List*
        
        Example::
        
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

    ### <I> queryCustomerForPhone

        通过电话信息查询客户
        
                |Requests:|
                :param customerPhone.cid: 客户ID
        :type customerPhone.cid: Long
        
        Example::
        
            {
                "customerPhone.cid": 1
            }

                |Returns:|
                - **customer**: 客户信息 , 类型 *customer*
          - 类型: *List*
        
        Example::
        
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

    ### <I> queryCustomerPhoneByCid

        通过客户ID获取对应的客户电话
        
                |Requests:|
                :param customer.cid: 客户ID
        :type customer.cid: Long
        
        Example::
        
            {
                "customer.cid": 1
            }
            
                |Returns:|
                - **customerPhones**: 客户电话信息列表 , 每条数据类型 *customerPhone*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> checkCustomerForPhone

        检查客户电话信息
        
                |Requests:|
                :param customer.phone: 客户电话
        :type customer.phone: String
        
        Example::
        
            {
                "customer.phone": "136xxxx5452"
            }
            
                |Returns:|
                - **customers**: 客户信息列表 , 每条数据类型 *customer*
          - 类型: *List*
        
        Example::
        
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
        
    ### <C> addCustomer

        添加客户信息
        
                |Requests:|
                :param customer.name: 客户名称
        :type customer.name: String
        :param customer.gender: 性别
        :type customer.gender: String
        :param customer.identity: 身份证
        :type customer.identity: String
        :param customer.officer: 军官证
        :type customer.officer: String
        :param customer.passport: 护照
        :type customer.passport: String
        :param customer.passhkm: 港澳通行证
        :type customer.passhkm: String
        :param customer.qq: QQ
        :type customer.qq: String
        :param customer.wechat: 微信
        :type customer.wechat: String
        :param customer.email: 邮件
        :type customer.email: String
        :param customer.career: 职业
        :type customer.career: String
        :param customer.address: 地址
        :type customer.address: String
        :param customer.relationshipType: 客户关系
        :type customer.relationshipType: String
        :param customer.type: 类型
        :type customer.type: Short
        :param customer.companyNo: 公司编号
        :type customer.companyNo: String
        :param customer.companyName: 公司名
        :type customer.companyName: String
        :param customer.companyAddr: 公司地址
        :type customer.companyAddr: String
        :param customer.companyPhone: 公司电话
        :type customer.companyPhone: String
        :param customer.companyBank: 开户行
        :type customer.companyBank: String
        :param customer.companyBankno: 开户编号
        :type customer.companyBankno: String
        
        Example::
        
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

    ### <C> existCustomer

        通过电话判断客户是否存在 , 不存在添加 , 存在返回客户信息
        
                |Requests:|
                :param customer.name: 客户名称
        :type customer.name: String
        :param customer.gender: 性别
        :type customer.gender: String
        :param customer.phone: 电话
        :type customer.phone: String
        
                |Returns:|
                - **customer**: 客户信息 , 类型 *customer*
          - 类型: *Object*
        
        Example::
        
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

    ### <C> addCustomerPhone

        添加客户电话信息
        
                |Requests:|
                :param customer.cid: 客户ID
        :type customer.cid: Long
        :param customerPhone.phone: 电话
        :type customerPhone.phone: String
        
        Example::
        
            {
                "customer.cid": 1,
                "customerPhone.phone": "153xxxx2938"
            }

    ### <C> updateCustomer

        更新客户信息
        
                |Requests:|
                :param customer.no: 客户编号
        :type customer.no: String
        :param customer.name: 客户名称
        :type customer.name: String
        :param customer.gender: 性别
        :type customer.gender: String
        :param customer.identity: 身份证
        :type customer.identity: String
        :param customer.officer: 军官证
        :type customer.officer: String
        :param customer.passport: 护照
        :type customer.passport: String
        :param customer.passhkm: 港澳通行证
        :type customer.passhkm: String
        :param customer.qq: QQ
        :type customer.qq: String
        :param customer.wechat: 微信
        :type customer.wechat: String
        :param customer.email: 邮件
        :type customer.email: String
        :param customer.career: 职业
        :type customer.career: String
        :param customer.address: 地址
        :type customer.address: String
        :param customer.relationshipType: 客户关系
        :type customer.relationshipType: String
        :param customer.type: 类型
        :type customer.type: Short
        :param customer.companyNo: 公司编号
        :type customer.companyNo: String
        :param customer.companyName: 公司名
        :type customer.companyName: String
        :param customer.companyAddr: 公司地址
        :type customer.companyAddr: String
        :param customer.companyPhone: 公司电话
        :type customer.companyPhone: String
        :param customer.companyBank: 开户行
        :type customer.companyBank: String
        :param customer.companyBankno: 开户编号
        :type customer.companyBankno: String
        
        Example::
        
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

    ### <C> updateCustomerForBase

        更新客户信息
        
                |Requests:|
                :param customer.cid: 客户ID
        :type customer.cid: String
        :param customer.companyNo: 公司编号
        :type customer.companyNo: String
        :param customer.companyName: 公司名
        :type customer.companyName: String
        :param customer.companyAddr: 公司地址
        :type customer.companyAddr: String
        :param customer.companyPhone: 公司电话
        :type customer.companyPhone: String
        :param customer.companyBank: 开户行
        :type customer.companyBank: String
        :param customer.companyBankno: 开户编号
        :type customer.companyBankno: String
        
        Example::
        
            {
                "customer.cid": "1501010001",
                "customer.companyNo": "",
                "customer.companyName": "",
                "customer.companyAddr": "",
                "customer.companyPhone": "",
                "customer.companyBank": "",
                "customer.companyBankno": ""
            }
            
    ### <C> updateCustomerPhoneForStatus

        更新客户电话状态
        
        判断客户电话是否存在 , 不存在 , 错误信息 **130021 客户电话不存在**
        
                |Requests:|
                :param customerPhone.cpid: 客户电话ID
        :type customerPhone.cpid: Long
        :param customerPhone.status: 状态
        :type customerPhone.status: Short
        
        Example::
        
            {
                "customerPhone.cpid": 1,
                "customerPhone.status": 1
            }
        
    ### <C> updateCustomerPhoneForDefault

        更新客户电话默认状态
        
        判断客户电话是否存在 , 不存在 , 错误信息 **130021 客户电话不存在**
        
        判断更新客户电话是否已经存在同时标识为默认电话 , 错误信息 **130022 客户电话已使用**
        
        判断客户电话状态 , 未启用不可设置为默认 , 错误信息 **130023 客户电话未启用**
        
                |Requests:|
                :param customerPhone.cpid: 客户电话ID
        :type customerPhone.cpid: Long
        :param customerPhone.defaults: 默认
        :type customerPhone.defaults: Short
        
        Example::
        
            {
                "customerPhone.cpid": 1,
                "customerPhone.defaults": 1
            }
            
    ### <C> registCustomer

        注册客户
        
        判断客户是否存在 , 不存在 , 错误信息 **130002 客户信息不存在**
        
        判断客户状态是否为0(初始) , 其他状态 , 错误信息 **130028 客户状态不可操作**
        
                |Requests:|
                :param customer.cid: 客户ID
        :type customer.cid: Long
        
        Example::
        
            {
                "customer.cid": 1
            }
            
    ### <C> authCustomer

        认证客户
        
        通过第三方接口获取认证地址
        
        客户存储认证地址 , 如果不存在 , 更新客户对应的认证地址
        
        判断客户是否存在 , 不存在 , 错误信息 **130002 客户信息不存在**
        
        判断客户状态是否为0(初始) , 其他状态 , 错误信息 **130028 客户状态不可操作**
        
                |Requests:|
                :param customer.cid: 客户ID
        :type customer.cid: Long
        
        Example::
        
            {
                "customer.cid": 1
            }

    ### <C> confirmCustomer

        确认客户
        
        通过第三方接口更新客户的真实信息
        
        判断客户是否存在 , 不存在 , 错误信息 **130002 客户信息不存在**
        
        判断客户状态是否为0(初始) , 其他状态 , 错误信息 **130028 客户状态不可操作**
        
        更新客户信息 , 包括姓名/电话/性别/地址等
        
        更新客户状态为1(认证)
        
                |Requests:|
                :param customer.cid: 客户ID
        :type customer.cid: Long
        
        Example::
        
            {
                "customer.cid": 1
            }
            
    ### <C> signateCustomer

        客户签名
        
        通过第三方接口更新客户签名信息
        
        判断客户是否存在 , 不存在 , 错误信息 **130002 客户信息不存在**
        
                |Requests:|
                :param customer.cid: 客户ID
        :type customer.cid: Long
        
        Example::
        
            {
                "customer.cid": 1
            }

    ### <C> resetCustomer

        客户重置
        
        判断客户是否存在 , 不存在 , 错误信息 **130002 客户信息不存在**
        
        判断客户状态是否为0(初始) , 其他状态 , 错误信息 **130028 客户状态不可操作**
        
                |Requests:|
                :param customer.cid: 客户ID
        :type customer.cid: Long
        
        Example::
        
            {
                "customer.cid": 1
            }

## 记录

客户信息管理

## api.communion.CustomerRecordAction

        |DataType:|
        #### customerRecord

    - **crid**: 记录ID
      - 类型: *Long*
    - **cid**: 客户
      - 类型: *Long*
    - **ouid**: 操作人
      - 类型: *Long*
    - **operateTime**: 操作时间
      - 类型: *Timestamp*
    - **type**: 类型 , 0: 电话查询
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*
    
    ### <I> pageCustomerRecord

        分页方式获取客户记录信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 客户记录列表 , 每条数据类型 *customerRecord*
        :type paging.data: List
        
        Example::
        
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
    
    ### <I-C> queryCustomerRecord

        通过客户ID查询记录信息
        
                |Requests:|
                :param customerRecord.cid: 客户ID
        :type customerRecord.cid: Long
        
        Example::
        
            {
                "customerRecord.cid": 1
            }

                |Returns:|
                - **customerRecords**: 客户记录信息列表 , 每条数据类型 *customerRecord*
          - 类型: *List*
        
        Example::
        
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

## 积分

## api.customer.CppointAction

        |DataType:|
        #### cppoint

    - **cpid**: 积分ID
      - 类型: *Long*
    - **cid**: 客户ID
      - 类型: *Long*
    - **dpoint**: 装修积分
      - 类型: *Long*
    - **spoint**: 销售积分
      - 类型: *Long*
    - **company**: 公司
      - 类型: *Integer*
    
    #### cppointRecord

    - **cprid**: 记录ID
      - 类型: *Long*
    - **cid**: 客户ID
      - 类型: *Long*
    - **cpid**: 积分ID
      - 类型: *Long*
    - **type**: 类型 , 0: 累计 , 1: 消耗
      - 类型: *Short*
    - **pointType**: 积分类型 , 0: 装修 , 1: 销售
      - 类型: *Short*
    - **balance**: 剩余积分
      - 类型: *Long*
    - **point**: 积分
      - 类型: *Long*
    - **operater**: 操作人, 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **operateTime**: 操作时间
      - 类型: *Timestamp*
    
    ### <I> queryCppoint

        获取客户积分信息
        
                |Requests:|
                :param cppoint.cid: 客户ID
        :type cppoint.cid: Long
        
        Example::
        
            {
                "cppoint.cid": 1
            }

                |Returns:|
                - **cppoint**: 积分信息 , 类型 *cppoint*
          - 类型: *Object*
        
        Example::
        
            {
                "cppoint": {
                    "cpid": 1,
                    "cid": 1,
                    "dpoint": 0,
                    "spoint": 0
                }
            }

    ### <I> queryCppointRecord

        获取客户积分记录
        
                |Requests:|
                :param cppoint.cid: 客户ID
        :type cppoint.cid: Long
        
        Example::
        
            {
                "cppoint.cid": 1
            }

                |Returns:|
                - **cppointRecords**: 积分记录信息列表 , 每条数据类型 *cppointRecord*
          - 类型: *List*
        
        Example::
        
            {
                "cppointRecords": [
                    {
                        "cprid": 1,
                        "cid": 1,
                        "cpid": 1,
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

    ### <I> createCppoint

        添加客户积分
        
        判断客户积分是否存在 , 已存在 , 错误信息 **330048 积分已存在**
        
                |Requests:|
                :param cppoint.cid: 客户ID
        :type cppoint.cid: Long
        
        Example::
        
            {
                "cppoint.cid": 1
            }

    ### <I> addupCppoint

        累计客户积分
        
        判断客户积分是否存在 , 不存在 , 错误信息 **330047 积分不存在**
        
        生成客户积分记录
        
                |Requests:|
                :param cppoint.cid: 客户ID
        :type cppoint.cid: Long
        :param cppoint.dpoint: 装修积分
        :type cppoint.dpoint: Long
        :param cppoint.spoint: 销售积分
        :type cppoint.spoint: Long
        
        Example::
        
            {
                "cppoint.cid": 1,
                "cppoint.spoint": 1000
            }

    ### <I> useupCppoint

        消耗客户积分
        
        判断客户积分是否存在 , 不存在 , 错误信息 **330047 积分不存在**
        
        判断客户积分是否满足操作积分 , 积分不足 , 错误信息 **330049 积分不足**
        
        生成客户积分记录
        
                |Requests:|
                :param cppoint.cid: 客户ID
        :type cppoint.cid: Long
        :param cppoint.dpoint: 装修积分
        :type cppoint.dpoint: Long
        :param cppoint.spoint: 销售积分
        :type cppoint.spoint: Long
        
        Example::
        
            {
                "cppoint.cid": 1,
                "cppoint.dpoint": 1000
            }

## 画像

## api.customer.CustomerProfileAction

        |DataType:|
        #### customerProfile

    - **cpid**: 画像ID
      - 类型: *Long*
    - **tid**: 模版ID
      - 类型: *Long*
    - **cid**: 客户ID
      - 类型: *Long*
    
    - **orderId**: 装修单号
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 初始
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*
    
    - **items**: 项目列表 , 每条数据类型 [customerProfileItem](./customer.html#api.customer.CustomerProfileAction.customerProfileItem)
      - 类型: *List*
    
    #### customerProfileItem

    - **cpiid**: 项目ID
      - 类型: *Long*
    - **cpid**: 调研ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **type**: 类型 , 0: 文本 , 1: 输入框 , 2: 单选 , 3: 多选
      - 类型: *Short*
    - **content**: 内容
      - 类型: *String*
    
    - **options**: 选项列表 , 每条数据类型 [customerProfileOption](./customer.html#api.customer.CustomerProfileAction.customerProfileOption)
    
    #### customerProfileOption

    - **cpoid**: 选项ID
      - 类型: *Long*
    - **cpiid**: 项目ID
      - 类型: *Long*
    - **cpid**: 调研ID
      - 类型: *Long*
    - **title**: 标题
      - 类型: *String*
    - **checked**: 标识 , 0: 已选 , 1: 未选
      - 类型: *Short*
    
    ### <I> pageCustomerProfile

        分页方式获取客户画像信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 调研列表 , 每条数据类型 *customerProfile*
        :type paging.data: List
        
        Example::
        
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

    ### <I> queryCustomerProfileByOrderId

        通过装修单号获取客户画像信息
        
                |Requests:|
                :param customerProfile.orderId: 装修单号
        :type customerProfile.orderId: String
        
        Example::
        
            {
                "customerProfile.orderId": "1601010001"
            }

                |Returns:|
                - **customerProfile**: 客户画像 , 类型 *customerProfile*
          - 类型: *Object*
        
        Example::
        
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

    ### <I> queryCustomerProfileByCpid

        通过客户画像ID获取信息
        
                |Requests:|
                :param customerProfile.cpid: 调研ID
        :type customerProfile.cpid: Long
        
        Example::
        
            {
                "customerProfile.cpid": 1
            }

                |Returns:|
                - **customerProfile**: 客户画像 , 数据类型 *customerProfile*
          - 类型: *Object*
        
        Example::
        
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

    ### <I> makeCustomerProfile

        生成客户画像
        
        判断模版是否存在 , 不存在 , 错误信息 **130096 模版不存在**
        
                |Requests:|
                :param customerProfile.cid: 客户ID
        :type customerProfile.cid: Long
        :param customerProfile.orderId: 装修单号
        :type customerProfile.orderId: String
        :param customerProfile.tid: 模版ID
        :type customerProfile.tid: Long
        
        Example::
        
            {
                "customerProfile.cid": 1,
                "customerProfile.orderId": "1601010001",
                "customerProfile.tid": 1
            }

    ### <I> handleCustomerProfile

        更新客户画像
        
        判断客户画像是否存在 , 不存在 , 错误信息 **330087 客户画像不存在**
        
                |Requests:|
                :param customerProfile.cpid: 调研ID
        :type customerProfile.cpid: Long
        
        :param customerProfile.items[n].cpiid: 项目ID
        :type customerProfile.items[n].cpiid: Long
        :param customerProfile.items[n].content: 内容
        :type customerProfile.items[n].content: String
        
        :param customerProfile.items[n].options[n].cpoid: 选项ID
        :type customerProfile.items[n].options[n].cpoid: Short
        :param customerProfile.items[n].options[n].checked: 标识
        :type customerProfile.items[n].options[n].checked: Short
        
        Example::
        
            {
                "customerProfile.cpid": 1,
                
                "customerProfile.items[0].cpiid": 1,
                "customerProfile.items[0].content": "内容",
                
                "customerProfile.items[0].options[0].cpoid": 1,
                "customerProfile.items[0].options[0].checked": 1,
            }

## 客源

### 部门规则

业务部门规则配置信息

## api.customer.CustomerDeptRuleAction

        |DataType:|
        #### customerDeptRule

    - **cdrid**: 规则ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **did**: 部门ID
      - 类型: *Long*
    - **type**: 类型 , 0: 公司 , 1: 分区 , 2: 部门
      - 类型: *Short*
    - **atttype**: 业务类型 , 0: 自动 , 1: 人员 , 2: 部门 , 3: 分区
      - 类型: *Short*
    - **busitype**: 业务类型
      - 类型: *Long*
    - **focus**: 聚焦类型 , 0: 通用 , 1: 面积 , 2: 部门
      - 类型: *Short*
    - **creater**: 创建人 , 类型 [user](./user.html#api.data.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **company**: 公司
      - 类型: *Integer*
    
    ### <I> pageCustomerDeptRule

        分页方式获取客户部门规则信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 客户人员规则信息列表 , 每条数据类型 *customerDeptRule*
        :type paging.data: List
        
        Example::
        
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
    
    ### <I> queryCustomerDeptRule

        通过部门ID获取部门规则
        
                |Requests:|
                :param customerDeptRule.did: 部门ID
        :type customerDeptRule.did: Long
        :param customerDeptRule.type: 类型
        :type customerDeptRule.type: Short
        
        Example::
        
            {
                "customerDeptRule.did": 1,
                "customerDeptRule.type": 1
            }

                |Returns:|
                - **customerDeptRules**: 客户人员规则信息列表 , 每条数据类型 *customerDeptRule*
          - 类型: *List*
        
        Example::
        
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

    ### <I> addCustomerDeptRule

        添加客户部门规则
        
                |Requests:|
                :param customerDeptRule.did: 部门ID
        :type customerDeptRule.did: Long
        :param customerDeptRule.type: 类型
        :type customerDeptRule.type: Short
        :param customerDeptRule.atttype: 业务类型
        :type customerDeptRule.atttype: Short
        :param customerDeptRule.busitype.bdid: 业务类型ID
        :type customerDeptRule.busitype.bdid: Long
        :param customerDeptRule.focus: 聚焦类型
        :type customerDeptRule.focus: Short
        
        Example::
        
            {
                "customerDeptRule.did": 1,
                "customerDeptRule.type": 0,
                "customerDeptRule.atttype": 0,
                "customerDeptRule.busitype.bdid": 0,
                "customerDeptRule.focus": 0
            }

    ### <I> deleteCustomerDeptRule

        删除部门规则
        
                |Requests:|
                :param customerDeptRule.cdrid: 部门ID
        :type customerDeptRule.cdrid: Long
        
        Example::
        
            {
                "customerDeptRule.cdrid": 1
            }

### 人员规则

设计人员规则配置信息

## api.customer.CustomerUserRuleAction

        |DataType:|
        #### customerUserRule

    - **curid**: 规则ID
      - 类型: *Long*
    - **user**: 人员 , 类型 [user](./user.html#api.data.UserAction.user)
      - 类型: *Object*
    - **period**: 周期
      - 类型: *周期*
    - **measureNum**: 量尺数
      - 类型: *Integer*
    - **contractNum**: 签单数
      - 类型: *Integer*
    - **contractPrice**: 签单额
      - 类型: *Integer*
    - **predisPrice**: 折前额
      - 类型: *Integer*
    - **materialPrice**: 主材额
      - 类型: *Integer*
    - **designPrice**: 设计费
      - 类型: *Integer*
    - **score**: 得分
      - 类型: *Integer*
    - **rank**: 排名
      - 类型: *Integer*
    - **chance**: 机会数
      - 类型: *Integer*
    - **surplus**: 剩余数
      - 类型: *Integer*
    - **polling**: 轮询数
      - 类型: *Integer*
    - **creater**: 创建人 , 类型 [user](./user.html#api.data.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **finishTime**: 结束时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 启用 , 1: 个人失效 , 2: 部门失效 , 3: 分区失效 , 4: 禁用
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*
    
    #### customerUserRuleItem

    - **curiid**: 规则项ID
      - 类型: *Long*
    - **curid**: 规则ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **type**: 类型 , 0: 面积 , 1: 特殊 , 2: 部门
      - 类型: *Short*
    - **uppval**: 起始值
      - 类型: *Integer*
    - **lowval**: 终止值
      - 类型: *Integer*
    
    ### <I> pageCustomerUserRule

        分页方式获取客户人员规则信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 客户人员规则信息列表 , 每条数据类型 *customerUserRule*
        :type paging.data: List
        
        Example::
        
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

    ### <I> queryCustomerUserRule

        获取人员规则
        
                |Requests:|
                :param customerUserRule.user.uid: 人员ID
        :type customerUserRule.user.uid: Long
        
        Example::
        
            {
                "customerUserRule.user.uid": 1
            }
        
                |Returns:|
                - **customerUserRule**: 人员规则
          - 类型: *Object*
        
        Example::
        
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
    
    ### <I> addCustomerUserRule

        添加客户人员规则
        
                |Requests:|
                :param customerUserRule.user.uid: 人员ID
        :type customerUserRule.user.uid: Long
        :param customerUserRule.period: 周期
        :type customerUserRule.period: String
        
        :param customerUserRule.measureNum: 量尺数
        :type customerUserRule.measureNum: Integer
        :param customerUserRule.contractNum: 签单数
        :type customerUserRule.contractNum: Integer
        :param customerUserRule.contractPrice: 签单额
        :type customerUserRule.contractPrice: Integer
        :param customerUserRule.predisPrice: 折前额
        :type customerUserRule.predisPrice: Integer
        :param customerUserRule.materialPrice: 主材额
        :type customerUserRule.materialPrice: Integer
        :param customerUserRule.designPrice: 设计费
        :type customerUserRule.designPrice: Integer
        
        Example::
        
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
    
    ### <I> updateCustomerUserRule

        更新客户人员规则
        
                |Requests:|
                :param customerUserRule.curid: 规则ID
        :type customerUserRule.curid: Long
        :param customerUserRule.user.uid: 人员ID
        :type customerUserRule.user.uid: Long
        :param customerUserRule.period: 周期
        :type customerUserRule.period: String
        
        :param customerUserRule.measureNum: 量尺数
        :type customerUserRule.measureNum: Integer
        :param customerUserRule.contractNum: 签单数
        :type customerUserRule.contractNum: Integer
        :param customerUserRule.contractPrice: 签单额
        :type customerUserRule.contractPrice: Integer
        :param customerUserRule.predisPrice: 折前额
        :type customerUserRule.predisPrice: Integer
        :param customerUserRule.materialPrice: 主材额
        :type customerUserRule.materialPrice: Integer
        :param customerUserRule.designPrice: 设计费
        :type customerUserRule.designPrice: Integer
        
        Example::
        
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
    
    ### <I> updateCustomerUserRuleForStatus

        更新客户人员规则状态
        
                |Requests:|
                :param customerUserRule.curid: 规则ID
        :type customerUserRule.curid: Long
        :param customerUserRule.status: 状态
        :type customerUserRule.status: Short
        
        Example::
        
            {
                "customerUserRule.curid": 1,
                "customerUserRule.status": 0
            }

    ### <I> disableCustomerUserRule

        禁用人员规则

    ### <I> queryCustomerUserRuleItem

    ### <I> addCustomerUserRuleItem

    ### <I> deleteCustomerUserRuleItem

### 保护规则

装修单转换保护规则配置信息

## api.customer.CustomerProtectRuleAction

        |DataType:|
        #### customerProtectRule

    - **cprid**: 规则ID
      - 类型: *Long*
    - **title**: 标题
      - 类型: *String*
    - **type**: 类型 , 0: 面积 , 1: 预付 , 2: 设计
      - 类型: *Short*
    - **uppval**: 上限数值
      - 类型: *Integer*
    - **lowval**: 下限数值
      - 类型: *Integer*
    - **days**: 天数
      - 类型: *Integer*
    - **creater**: 创建人 , 类型 [user](./user.html#api.data.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 有效 , 1: 失效
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*
    
    ### <I> pageCustomerProtectRule

        分页方式获取客户保护规则信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 客户保护规则信息列表 , 每条数据类型 *customerProtectRule*
        :type paging.data: List
        
        Example::
        
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
    
    ### <I> queryCustomerProtectRule

        获取客户保护规则
        
                |Requests:|
                :param customerProtectRule.type: 类型
        :type customerProtectRule.type: Short
        :param customerProtectRule.uppval: 数值
        :type customerProtectRule.uppval: Integer
        :param customerProtectRule.lowval: 数值
        :type customerProtectRule.lowval: Integer
        :param customerProtectRule.days: 天数
        :type customerProtectRule.days: Integer
        
        Example::
        
            {
                "customerProtectRule.type": 1,
                "customerProtectRule.uppval": 1,
                "customerProtectRule.lowval": 1,
                "customerProtectRule.days": 1
            }

                |Returns:|
                - **customerProtectRules**: 客户保护规则信息列表 , 每条数据类型 *customerProtectRule*
          - 类型: *List*
        
        Example::
        
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

    ### <I> addCustomerProtectRule

        添加客户保护规则
        
                |Requests:|
                :param customerProtectRule.title: 标题
        :type customerProtectRule.title: String
        :param customerProtectRule.type: 类型
        :type customerProtectRule.type: Short
        :param customerProtectRule.uppval: 数值
        :type customerProtectRule.uppval: Integer
        :param customerProtectRule.lowval: 数值
        :type customerProtectRule.lowval: Integer
        :param customerProtectRule.days: 天数
        :type customerProtectRule.days: Integer
        
        Example::
        
            {
                "customerProtectRule.title": "标题",
                "customerProtectRule.type": 0,
                "customerProtectRule.uppval": 0,
                "customerProtectRule.lowval": 0,
                "customerProtectRule.days": 0
            }

    ### <I> deleteCustomerProtectRule

        删除客户保护规则
        
                |Requests:|
                :param customerProtectRule.cprid: ID
        :type customerProtectRule.cprid: Long
        
        Example::
        
            {
                "customerProtectRule.cprid": 1
            }

### 公司规则

装修单分配公司规则配置信息

## api.customer.CustomerCompanyRuleAction

        |DataType:|
        #### customerCompanyRule

    - **ccrid**: 规则ID
      - 类型: *Long*
    - **company**: 公司 , 类型 [company](./user.html#api.system.CompanyAction.company)
      - 类型: *Object*
    - **type**: 类型 , 0: 面积 , 1: 特殊 , 2: 部门
      - 类型: *Short*
    - **uppval**: 起始值
      - 类型: *Integer*
    - **lowval**: 终止值
      - 类型: *Integer*
    - **companys**: 公司ID
      - 类型: *Integer*
    
    ### <I> pageCustomerCompanytRule

        分页方式获取客户公司规则信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 客户公司规则信息列表 , 每条数据类型 *customerCompanyRule*
        :type paging.data: List
        
        Example::
        
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
    
    ### <I> queryCustomerCompanyRule

        获取客户保护规则
        
                |Requests:|
                :param customerCompanyRule.uppval: 数值
        :type customerCompanyRule.uppval: Short
        
        Example::
        
            {
                "customerCompanyRule.type": 1,
                "customerCompanyRule.value": 1,
                "customerCompanyRule.days": 1
            }

                |Returns:|
                - **customerCompanyRules**: 客户公司规则信息列表 , 每条数据类型 *customerCompanyRule*
          - 类型: *List*
        
        Example::
        
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

    ### <I> addCustomerCompanyRule

        添加客户公司规则
        
                |Requests:|
                :param customerCompanyRule.company.no: 编号
        :type customerCompanyRule.company.no: String
        :param customerCompanyRule.type: 类型
        :type customerCompanyRule.type: Short
        :param customerCompanyRule.uppval: 起始值
        :type customerCompanyRule.uppval: Integer
        :param customerCompanyRule.lowval: 终止值
        :type customerCompanyRule.lowval: Integer
        
        Example::
        
            {
                "customerProtectRule.company.no": "SUSDONE09FUSEFU09ES",
                "customerProtectRule.type": 0,
                "customerProtectRule.value": 0,
                "customerProtectRule.days": 0
            }

    ### <I> deleteCustomerCompanyRule

        删除客户公司规则
        
                |Requests:|
                :param customerCompanyRule.ccrid: 规则ID
        :type customerCompanyRule.ccrid: Long
        
        Example::
        
            {
                "customerCompanyRule.ccrid": 1
            }

### 资源

## api.customer.CustomerSourceAction

        |DataType:|
        #### customerSource

    - **csid**: 客资ID
      - 类型: *Long*
    - **name**: 姓名
      - 类型: *String*
    - **gender**: 性别
      - 类型: *String*
    - **phone**: 电话
      - 类型: *String*
    - **customerType**: 客户类型
      - 类型: *Short*
    - **demand**: 装修需求
      - 类型: *Short*
    - **purpose**: 目的
      - 类型: *String*
    - **intention**: 意向
      - 类型: *String*
    - **price**: 需求价格
      - 类型: *String*
    - **grade**: 客户等级
      - 类型: *String*

    - **village**: 楼盘 , 类型 [village](./data.html#api.data.VillageAction.village)
      - 类型: *Object*
    - **houseNumber**: 楼号
      - 类型: *String*
    - **buildArea**: 面积
      - 类型: *Float*
    - **buildArea**: 建筑面积
      - 类型: *Integer*
    - **freeArea**: 赠送面积
      - 类型: *Integer*
    - **innerArea**: 套内面积
      - 类型: *Integer*
    - **totalArea**: 总面积
      - 类型: *Integer*
    
    - **creater**: 创建人 , 类型 [user](./user.html#api.data.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    
    - **company**: 公司
      - 类型: *Integer*
    
    - **status**: 状态 , 0: 初始 , 1: 失效 , 2: 审批 , 3: 确认 , 4: 审批 , 5: 转换
      - 类型: *Short*
    
    - **referOrderId**: 推荐单号
      - 类型: *String*
    - **source**: 来源方
      - 类型: *String*
    - **contact**: 对接人
      - 类型: *String*
    
    - **comment**: 备注
      - 类型: *String*
    
    - **designer**: 设计师 , 类型 [user](./user.html#api.data.UserAction.user)
      - 类型: *Object*
    - **salesman**: 业务员 , 类型 [user](./user.html#api.data.UserAction.user)
      - 类型: *Object*
    - **customer**: 客户 , 类型 [customer](./data.html#api.data.CustomerAction.customer)
      - 类型: *Object*
    - **house**: 房产 , 类型 [house](./data.html#api.data.HouseAction.house)
      - 类型: *Object*
    - **orderId**: 装修单号
      - 类型: *String*
    
    ### <I> pageCustomerSource

        分页方式获取客户资源信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 客户资源列表 , 每条数据类型 *customerSource*
        :type paging.data: List
        
        Example::
        
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

    ### <I> queryCustomerSource

        通过客户机会ID获取信息
    
                |Requests:|
                :param customerSource.csid: 资源ID
        :type customerSource.csid: Long
        
        Example::
        
            {
                "customerSource.csid": 1
            }
        
                |Returns:|
                - **customerSource**: 客户机会
          - 类型: *Object*
        :param paging.data: 客户资源列表 , 每条数据类型 *customerSource*
        :type paging.data: List
        
        Example::
        
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

    ### <I> addCustomerSource

        添加客户资源
        
                |Requests:|
                :param customerSource.name: 姓名
        :type customerSource.name: String
        :param customerSource.gender: 性别
        :type customerSource.gender: String
        :param customerSource.phone: 电话
        :type customerSource.phone: String
        :param customerSource.purpose: 目的
        :type customerSource.purpose: String
        :param customerSource.intention: 意向
        :type customerSource.intention: String
        :param customerSource.price: 需求价格
        :type customerSource.price: String
        :param customerSource.grade: 客户等级
        :type customerSource.grade: String
        
        :param customerSource.village.vid: 楼盘ID
        :type customerSource.village.vid: Long
        :param customerSource.houseNumber: 楼号
        :type customerSource.houseNumber: String
        :param customerSource.buildArea: 建筑面积
        :type customerSource.buildArea: Float
        :param customerSource.freeArea: 赠送面积
        :type customerSource.freeArea: Float
        :param customerSource.innerArea: 套内面积
        :type customerSource.innerArea: Float
        :param customerSource.totalArea: 总面积
        :type customerSource.totalArea: Float
        
        :param customerSource.source: 来源方
        :type customerSource.source: String
        :param customerSource.contact: 对接方
        :type customerSource.contact: String
        :param customerSource.referOrderId: 推荐单号
        :type customerSource.referOrderId: String
        
        :param customerSource.comment: 备注
        :type customerSource.comment: String
        
        Example::
        
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

    ### <I> updateCustomerSource

        更新客户资源
        
                |Requests:|
                :param customerSource.csid: 资源ID
        :type customerSource.csid: Long
        :param customerSource.name: 姓名
        :type customerSource.name: String
        :param customerSource.gender: 性别
        :type customerSource.gender: String
        :param customerSource.phone: 电话
        :type customerSource.phone: String
        :param customerSource.purpose: 目的
        :type customerSource.purpose: String
        :param customerSource.intention: 意向
        :type customerSource.intention: String
        :param customerSource.price: 需求价格
        :type customerSource.price: String
        :param customerSource.grade: 客户等级
        :type customerSource.grade: String
        
        :param customerSource.village.vid: 楼盘ID
        :type customerSource.village.vid: Long
        :param customerSource.houseNumber: 楼号
        :type customerSource.houseNumber: String
        :param customerSource.buildArea: 建筑面积
        :type customerSource.buildArea: Float
        :param customerSource.freeArea: 赠送面积
        :type customerSource.freeArea: Float
        :param customerSource.innerArea: 套内面积
        :type customerSource.innerArea: Float
        :param customerSource.totalArea: 总面积
        :type customerSource.totalArea: Float
        
        :param customerSource.source: 来源方
        :type customerSource.source: String
        :param customerSource.contact: 对接方
        :type customerSource.contact: String
        :param customerSource.referOrderId: 推荐单号
        :type customerSource.referOrderId: String
        
        :param customerSource.comment: 备注
        :type customerSource.comment: String
        
        Example::
        
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

    ### <I> updateCustomerSourceForStatus

        更新客户资源状态
        
                |Requests:|
                :param customerSource.csid: 资源ID
        :type customerSource.csid: Long
        :param customerSource.status: 状态
        :type customerSource.status: Short
        
        Example::
        
            {
                "customerSource.csid": 1,
                "customerSource.status": 0
            }

    ### <I> issueCustomerSource

        分配客户资源
        
                |Requests:|
                :param customerSource.csid: 资源ID
        :type customerSource.csid: Long
        
        :param customerChance.region.did: 部门ID
        :type customerChance.region.did: Integer
        :param customerChance.department.did: 部门ID
        :type customerChance.department.did: Integer
        :param customerChance.belonger.userId: 人员编号
        :type customerChance.belonger.userId: String
        
        Example::
        
            {
                "customerSource.csid": 1,
                "customerChance.region.did": 1,
                "customerChance.department.did": 1,
                "customerChance.belonger.userId": "U0001",
            }

### 机会

## api.customer.CustomerChanceAction

        |DataType:|
        #### customerChance

    - **ccid**: 客机ID
      - 类型: *Long*
    
    - **source**: 客户资源 , 类型 [customerSource](./customer.html#api.customer.CustomerSourceAction.customerSource)
      - 类型: *Object*
    - **busitype**: 业务类型 , 类型 [decorationBusitype](./data.html#api.data.DecorationBusitypeAction.decorationBusitype)
      - 类型: *Object*
    
    - **creater**: 创建人 , 类型 [user](./user.html#api.data.UserAction.user)
      - 类型: *Object*
    - **issuer**: 分配人 , 类型 [user](./user.html#api.data.UserAction.user)
      - 类型: *Object*
    
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **issueTime**: 分配时间
      - 类型: *Timestamp*
    - **confirmTime**: 确认时间
      - 类型: *Timestamp*
    - **fineTime**: 惩罚时间
      - 类型: *Timestamp*
    - **readTime**: 阅读时间
      - 类型: *Timestamp*
    - **meetTime**: 见面时间
      - 类型: *Timestamp*
    
    - **belonger**: 归属人 , 类型 [user](./user.html#api.data.UserAction.user)
      - 类型: *Object*
    - **department**: 归属部门 , 类型 [department](./department.html#api.communion.DepartmentAction.department)
      - 类型: *Object*
    - **region**: 归属分区 , 类型 [department](./department.html#api.communion.DepartmentAction.department)
      - 类型: *Object*
    - **company**: 归属公司
      - 类型: *Integer*
    
    - **isRead**: 是否已读 , 0: 已读 , 1: 未读
      - 类型: *Short*
    - **isMeet**: 是否见面 , 0: 无 , 1: 未见 , 2: 已见
      - 类型: *Short*
    - **isPhone**: 是否电联 , 0: 无 , 1: 未联 , 2: 已联
      - 类型: *Short*
    - **isTrue**: 是否真实 , 0: 无 , 1: 虚假 , 2: 真实
      - 类型: *Short*
    - **isFine**: 是否惩罚 , 0: 惩罚 , 1: 正常
      - 类型: *Short*
    
    
    - **type**: 类型 , 0: 自动 , 1: 人员 , 2: 部门 , 3: 分区
      - 类型: *Short*
    - **status**: 状态 , 0: 初始, 1: 失效, 2: 分配, 3: 确认, 4: 完成 , 5: 释放
      - 类型: *Short*
    - **comment**: 备注
      - 类型: *String*
    
    ### <I> pageCustomerChance

        分页方式获取客户机会信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 客户机会列表 , 每条数据类型 *customerChance*
        :type paging.data: List
        
        Example::
        
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

    ### <I> queryCustomerChance

        获取客户机会
        
                |Requests:|
                :param customerChance.source.csid: 资源ID
        :type customerChance.source.csid: Long
        
        Example::
        
            {
                "customerChance.source.csid": 1
            }

                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        - **customerChances**: 客户机会列表 , 每条数据类型 *customerChance*
          - 类型: *List*
        
        Example::
        
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

    ### <I> updateCustomerChance

        分配客户机会
        
        判断客户机会是否存在 , 已存在 , 错误信息 **330076 客户机会已存在**
        
        判断客户机会状态为0(初始) , 其他状态 , 错误信息 **330077 客户机会不可操作**
        
                |Requests:|
                :param customerChance.customer.cid: 客户ID
        :type customerChance.customer.cid: Long
        :param customerChance.house.hid: 楼盘ID
        :type customerChance.house.hid: Long
        :param customerChance.busitype.dbid: 业务类型ID
        :type customerChance.busitype.dbid: Long
        
        Example::
        
            {
                "customerChance.customer.cid": 1,
                "customerChance.house.hid": 1,
                "customerChance.busitype.dbid": 1
            }

    ### <I> issueCustomerChance

        分配客户机会
        
        判断客户机会是否存在 , 已存在 , 错误信息 **330076 客户机会已存在**
        
        判断客户机会状态为0(初始) , 其他状态 , 错误信息 **330077 客户机会不可操作**
        
                |Requests:|
                :param customerChance.source.csid: 资源ID
        :type customerChance.source.csid: Long
        :param customerChance.belonger.uid: 归属人ID
        :type customerChance.belonger.uid: Long
        :param customerChance.department.did: 归属部门ID
        :type customerChance.department.did: Long
        :param customerChance.region.did: 归属分区ID
        :type customerChance.region.did: Long
        
        Example::
        
            {
                "customerChance.source.csid": 1,
                "customerChance.belonger.uid": 1,
                "customerChance.department.did": 1,
                "customerChance.region.did": 1
            }
            
    ### <I> changeCustomerChance

        更改客户机会
        
        判断客户机会是否存在 , 不存在 , 错误信息 **330075 客户机会不存在**
        
        判断客户机会状态为0(初始) , 其他状态 , 错误信息 **330077 客户机会不可操作**
        
                |Requests:|
                :param customerChance.source.csid: 资源ID
        :type customerChance.source.csid: Long
        :param customerChance.belonger.uid: 归属人ID
        :type customerChance.belonger.uid: Long
        
        Example::
        
            {
                "customerChance.source.csid": 1,
                "customerChance.belonger.uid": 1
            }

    ### <I> sendCustomerChance

        推送客户机会
        
        判断客户机会是否存在 , 不存在 , 错误信息 **330075 客户机会不存在**
        
        判断客户机会状态为1(分配) , 其他状态 , 错误信息 **330077 客户机会不可操作**
        
                |Requests:|
                :param customerChance.source.csid: 资源ID
        :type customerChance.source.csid: Long
        
        Example::
        
            {
                "customerChance.source.csid": 1
            }

    ### <I> confirmCustomerChange

        确认客户机会
    
        判断客户机会是否存在 , 不存在 , 错误信息 **330075 客户机会不存在**

        判断客户机会状态为1(分配) , 其他状态 , 错误信息 **330077 客户机会不可操作**

                |Requests:|
                :param customerOrigin.csid: 客源ID
        :type customerOrigin.csid: Long
        - **securityCode**: 验证码
          - 类型: *String*
        - **verifyCode**: 验证码
          - 类型: *String*
        
        Example::
        
            {
                "customerOrigin.csid": 2,
                "securityCode": "",
                "verifyCode": ""
            }

    ### <I> freeCustomerChance

        释放客户机会
        
        判断客户机会是否存在 , 不存在 , 错误信息 **330075 客户机会不存在**
        
        判断客户机会状态为0(初始) , 其他状态 , 错误信息 **330077 客户机会不可操作**
        
                |Requests:|
                :param customerChance.source.csid: 资源ID
        :type customerChance.source.csid: Long
        
        Example::
        
            {
                "customerChance.source.csid": 1
            }

    ### <I> disableCustomerChance

        失效客户机会
        
        判断客户机会是否存在 , 不存在 , 错误信息 **330075 客户机会不存在**
        
        判断客户机会状态为0(初始) , 其他状态 , 错误信息 **330077 客户机会不可操作**
        
                |Requests:|
                :param customerChance.source.csid: 资源ID
        :type customerChance.source.csid: Long
        
        Example::
        
            {
                "customerChance.source.csid": 1
            }

### 记录

## api.customer.CustomerSourceAction

        |DataType:|
        #### customerSourceRecord

    - **csrid**: 记录ID
      - 类型: *Long*
    - **csid**: 资源ID
      - 类型: *Long*
    - **ccid**: 机会ID
      - 类型: *Long*
    - **type**: 记录类型 , 包括: 0: 通用
      - 类型: *Short*
    - **operater**: 操作人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **operatTime**: 记录时间
      - 类型: *Timestamp*
    - **comment**: 记录信息
      - 类型: *String*

    ### <I> pageCustomerSourceRecord

        分页方式获取资源记录信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Requests:|
                :param customerSourceRecord.csid: 资源ID
        :type customerSourceRecord.csid: Long
        
        Example::
        
            {
                "customerSourceRecord.csid": 2
            }
            
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 资源记录列表 , 每条数据类型 *customerSourceRecord*
        :type paging.data: List
        
        Example::
        
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

### 客源

客源信息管理以及与客户之间关系

## api.customer.CustomerOriginAction

        |DataType:|
        #### customerOrigin

    - **csid**: 客源ID
      - 类型: *Long*
    - **name**: 姓名
      - 类型: *String*
    - **gender**: 性别
      - 类型: *String*
    - **phone**: 电话
      - 类型: *String*
    - **purpose**: 目的
      - 类型: *String*
    - **intention**: 意向
      - 类型: *String*
    - **price**: 需求价格
      - 类型: *String*
    - **grade**: 客户等级
      - 类型: *String*

    - **busitype**: 业务类型 , 类型 [decorationBusitype](./data.html#api.data.DecorationBusitypeAction.decorationBusitype)
      - 类型: *Object*
    - **village**: 楼盘 , 类型 [village](./data.html#api.data.VillageAction.village)
      - 类型: *Object*
    - **houseNumber**: 楼号
      - 类型: *String*
    - **buildArea**: 面积
      - 类型: *Float*
    - **buildArea**: 建筑面积
      - 类型: *Integer*
    - **freeArea**: 赠送面积
      - 类型: *Integer*
    - **innerArea**: 套内面积
      - 类型: *Integer*
    - **totalArea**: 总面积
      - 类型: *Integer*
    
    - **creater**: 创建人 , 类型 [user](./user.html#api.data.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **belonger**: 归属人 , 类型 [user](./user.html#api.data.UserAction.user)
      - 类型: *Object*
    - **department**: 归属部门 , 类型 [department](./department.html#api.communion.DepartmentAction.department)
      - 类型: *Object*
    - **region**: 归属分区 , 类型 [department](./department.html#api.communion.DepartmentAction.department)
      - 类型: *Object*
    
    - **status**: 状态 , 0(初始) , 1(初审) , 2(提交) , 3(确认) , 4(审批) , 5(绑定) , 6(拒绝)
      - 类型: *Short*
    - **comment**: 备注
      - 类型: *String*
    
    - **designer**: 设计师 , 类型 [user](./user.html#api.data.UserAction.user)
      - 类型: *Object*
    - **salesman**: 业务员 , 类型 [user](./user.html#api.data.UserAction.user)
      - 类型: *Object*
    - **customer**: 客户信息 , 类型 [customer](./data.html#api.data.CustomerAction.customer)
      - 类型: *Object*
    - **house**: 房产 , 类型 [house](./data.html#api.data.HouseAction.house)
      - 类型: *Object*
    - **orderId**: 装修单号
      - 类型: *String*
    
    
    ### <I> pageCustomerOrigin

        分页方式获取客源信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Requests:|
                - **type**: 类型 , 包括: 设计(designer) , 业务(salesman) , 归属(belonger) , 共享(share)
          - 类型: *String*
        
        Example::
        
            {
                "type": "salesman"
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 客源列表 , 每条数据类型 *customerOrigin*
        :type paging.data: List
        
        Example::
        
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

    ### <I> pageCustomerOriginForAdvance

        分页方式获取客源信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        利用客源-部门权限 , 查询当前人员拥有的部门权限下跟进人归属的客源信息
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 客源列表 , 每条数据类型 *customerOrigin*
        :type paging.data: List
        
        Example::
        
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
            
    ### <C> queryCustomerOriginByCsid

        通过客源ID获取客源信息
        
                |Requests:|
                :param customerOrigin.csid: 客源ID
        :type customerOrigin.csid: Long
        
        Example::
        
            {
                "customerOrigin.csid": 1
            }
            
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 客源列表 , 每条数据类型 *customerOrigin*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> addCustomerOrigin

        添加客源信息
        
        创建记录信息 , 新客源信息作为记录内容 , 信息包括: 电话, 目的, 意向, 价格, 等级
        
                |Requests:|
                :param customerOrigin.name: 姓名
        :type customerOrigin.name: String
        :param customerOrigin.gender: 性别
        :type customerOrigin.gender: String
        :param customerOrigin.phone: 电话
        :type customerOrigin.phone: String
        :param customerOrigin.purpose: 目的
        :type customerOrigin.purpose: String
        :param customerOrigin.intention: 意向
        :type customerOrigin.intention: String
        :param customerOrigin.price: 需求价格
        :type customerOrigin.price: String
        :param customerOrigin.grade: 客户等级
        :type customerOrigin.grade: String
        :param customerOrigin.comment: 备注
        :type customerOrigin.comment: String
        
        :param customerOrigin.busitype.dbid: 业务类型ID
        :type customerOrigin.busitype.dbid: Long
        :param customerOrigin.village.vid: 楼盘ID
        :type customerOrigin.village.vid: Long
        :param customerOrigin.houseNumber: 楼号
        :type customerOrigin.houseNumber: String
        :param customerOrigin.buildArea: 建筑面积
        :type customerOrigin.buildArea: Float
        :param customerOrigin.freeArea: 赠送面积
        :type customerOrigin.freeArea: Float
        :param customerOrigin.innerArea: 套内面积
        :type customerOrigin.innerArea: Float
        :param customerOrigin.totalArea: 总面积
        :type customerOrigin.totalArea: Float
        
        :param customerOrigin.designer.uid: 设计师ID
        :type customerOrigin.designer.uid: Long
        :param customerOrigin.salesman.uid: 业务员ID
        :type customerOrigin.salesman.uid: Long
        
        Example::
        
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
            
    ### <I> updateCustomerOrigin

        更新客源信息 , 包括: 目的, 意向, 价格, 等级
        
        判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**
        
        判断客源状态为0(初始) , 其他状态 , 错误信息 **330014 客源状态不可操作**
        
        创建记录信息 , 同时将原客源信息以及新客源信息作为记录内容 , 信息包括: 目的, 意向, 价格, 等级
        
                |Requests:|
                :param customerOrigin.csid: 客源ID
        :type customerOrigin.csid: Long
        :param customerOrigin.purpose: 目的
        :type customerOrigin.purpose: String
        :param customerOrigin.intention: 意向
        :type customerOrigin.intention: String
        :param customerOrigin.price: 需求价格
        :type customerOrigin.price: String
        :param customerOrigin.grade: 客户等级
        :type customerOrigin.grade: String
        :param customerOrigin.comment: 备注
        :type customerOrigin.comment: String
        
        :param customerOrigin.busitype.dbid: 业务类型ID
        :type customerOrigin.busitype.dbid: Long
        :param customerOrigin.designer.uid: 设计师ID
        :type customerOrigin.designer.uid: Long
        :param customerOrigin.salesman.uid: 业务员ID
        :type customerOrigin.salesman.uid: Long
        
        Example::
        
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
            
    ### <I> updateCustomerOriginForBelonger

        更新客源归属信息
        
        判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**
        
        判断客源状态为0(初始) , 其他状态 , 错误信息 **330014 客源状态不可操作**
        
        修改归属人信息同时更新归属部门以及分区
        
        客源归属人信息可以为空 , 为空时 , 不更新归属部门和分区
        
        创建记录信息 , 将原归属人, 部门, 分区以及新归属人, 部门, 分区作为记录内容
        
                |Requests:|
                :param customerOrigin.csid: 客源ID
        :type customerOrigin.csid: Long
        :param customerOrigin.belonger.userId: 归属人ID
        :type customerOrigin.belonger.userId: String
        
        Example::
        
            {
                "customerOrigin.csid": 2,
                "customer.belonger.userId": "U9382"
            }
            
    ### <I> freeCustomerOrigin

        释放客源归属信息
        
        判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**
        
        判断客源状态为0(初始) , 其他状态 , 错误信息 **330014 客源状态不可操作**
        
        客源归属人为当前操作人能够释放 , 否则释放失败 , 错误信息 **330002 客源归属人错误**
        
        更新归属人为空
        
        创建记录信息 , 记录原归属人信息 , 包括原归属人的员工号以及员工名
        
                |Requests:|
                :param customerOrigin.csid: 客源ID
        :type customerOrigin.csid: Long
        
        Example::
        
            {
                "customerOrigin.csid": 2
            }
            
    ### <I> takeCustomerOrigin

        认领房源
        
        判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**
        
        判断客源状态为0(初始) , 其他状态 , 错误信息 **330014 客源状态不可操作**
        
        客源归属人为空能够认领 , 否则认领失败 , 错误信息 **330002 客源归属人错误**
        
        更新归属人 , 部门以及分区信息
        
        创建记录信息 , 记录原归属人信息 , 包括认领人的员工号以及员工名
        
                |Requests:|
                :param customerOrigin.csid: 客源ID
        :type customerOrigin.csid: Long
        
        Example::
        
            {
                "customerOrigin.csid": 2
            }
            
    ### <I> bindCustomerOrigin

        绑定客源信息 , 包括: 设计师 , 业务员 , 房产ID , 客户ID
        
        判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**
        
        判断客源状态为0(初始) , 其他状态 , 错误信息 **330014 客源状态不可操作**
        
        判断房产是否存在 , 不存在 , 错误信息 **320002 房产不存在**
        
                |Requests:|
                :param customerOrigin.csid: 客源ID
        :type customerOrigin.csid: Long
        :param customerOrigin.designer.userId: 设计师ID
        :type customerOrigin.designer.userId: String
        :param customerOrigin.salesman.userId: 业务员ID
        :type customerOrigin.salesman.userId: String
        :param customerOrigin.customer.cid: 客户ID
        :type customerOrigin.customer.cid: Long
        :param customerOrigin.house.hid: 房产ID
        :type customerOrigin.house.hid: Long
        
        Example::
        
            {
                "customerOrigin.csid": 2,
                "customerOrigin.designer.userId": "U0002",
                "customerOrigin.salesman.userId": "U0002",
                "customerOrigin.customer.cid": 1,
                "customerOrigin.house.hid": 1
            }
            
    ### <I> commitCustomerOrigin

        提交客源
        
        判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**
        
        判断客源状态为1(初审) , 其他状态 , 错误信息 **330014 客源状态不可操作**
        
                |Requests:|
                :param customerOrigin.csid: 客源ID
        :type customerOrigin.csid: Long
        
        Example::
        
            {
                "customerOrigin.csid": 2
            }
        
    ### <I> confirmCustomerOrigin

        确认客源
        
        判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**
        
        判断客源状态为2(提交) , 其他状态 , 错误信息 **330014 客源状态不可操作**
        
                |Requests:|
                :param customerOrigin.csid: 客源ID
        :type customerOrigin.csid: Long
        - **securityCode**: 验证码
          - 类型: *String*
        - **verifyCode**: 验证码
          - 类型: *String*
        
        Example::
        
            {
                "customerOrigin.csid": 2,
                "securityCode": "",
                "verifyCode": ""
            }

    ### <I> cancelCustomerOrigin

        撤销客源
        
        判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**
        
        判断客源状态为2(提交)/3(确认)/5(拒绝) , 其他状态 , 错误信息 **330014 客源状态不可操作**
        
                |Requests:|
                :param customerOrigin.csid: 客源ID
        :type customerOrigin.csid: Long
        
        Example::
        
            {
                "customerOrigin.csid": 2
            }

### 记录

## api.customer.CustomerRecordAction

        |DataType:|
        #### customerOriginRecord

    - **crid**: 客户记录ID
      - 类型: *Long*
    - **csid**: 客源ID
      - 类型: *Long*
    - **comment**: 记录信息
      - 类型: *String*
    - **type**: 记录类型 , 包括: 0(更新) , 1(定义)
      - 类型: *Short*
    - **operater**: 操作人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **operatTime**: 记录时间
      - 类型: *Timestamp*

    ### <I> queryCustomerOriginRecord

        通过客源查询记录信息
        
                |Requests:|
                :param customerOriginRecord.csid: 客源ID
        :type customerOriginRecord.csid: Long
        
        Example::
        
            {
                "customerOriginRecord.csid": 2
            }
            
                |Returns:|
                - **customerOriginRecords**: 记录信息列表 , 每条数据类型 *customerOriginRecord*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> addCustomerOriginRecord

        创建客户记录信息
        
                |Requests:|
                :param customerOriginRecord.csid: 客源ID
        :type customerOriginRecord.csid: Long
        :param customerOriginRecord.comment: 说明
        :type customerOriginRecord.comment: String
        
        Example::
        
            {
                "customerOriginRecord.csid": 2,
                "customerOriginRecord.comment": "说明"
            }

### 功能

## api.customer.CustomerOriginFunctionAction

        |DataType:|
        #### customerOriginFunction

    - **cofid**: 功能ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **key**: key
      - 类型: *String*
    - **value**: value
      - 类型: *String*
    - **type**: 类型 , 0: 类型, 1: api, 2: 条件, 3: 字段, 4: 功能, 5: 节点, 6: 状态
      - 类型: *Short*
    - **subtype**: 子类 , 0: 字符串, 1: 数组
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **sort**: 排序
      - 类型: *Short*

    ### <I> queryCustomerOriginFunction

        获取客源功能信息
    
                |Requests:|
                :param customerOriginFunction.type: 类型
        :type customerOriginFunction.type: Short
        
        Example::
        
            {
                "customerOriginFunction.type": 0
            }
            
                |Returns:|
                - **customerOriginFunctions**: 功能信息列表 , 类型 *customerOriginFunction*
          - 类型: *List*
            
        Example::
        
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

## 服务

### 咨询

## api.customer.ConsultionAction

        |DataType:|
        #### consultion

    - **cid**: 咨询ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *Long*
    - **decoration**: 装修单 , 类型 [decoration](./decoration.html#api.decoration.decorationAction.decoration)
      - 类型: *Object*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **comment**: 说明
      - 类型: *Long*
    - **company**: 公司
      - 类型: *Integer*

    ### <I> pageConsultion

        分页方式获取咨询信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 咨询信息列表 , 每条数据类型 *consultion*
        :type paging.data: List
        
        Example::
        
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

    ### <I> queryConsultionByOrderId

        通过装修单号获取咨询信息
        
                |Requests:|
                :param consultion.decoration.orderId: 装修单号
        :type consultion.decoration.orderId: String
        
        Example::
        
            {
                "consultion.decoration.orderId": "1601010001"
            }
        
                |Returns:|
                - **consultions**: 咨询信息 , 每条数据类型 *user*
          - 类型: *List*
        
        Example::
        
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
    
    ### <I> addConsultion

        添加咨询信息
        
                |Requests:|
                :param consultion.decoration.orderId: 装修单号
        :type consultion.decoration.orderId: String
        :param consultion.comment: 咨询内容
        :type consultion.comment: String
        
        Example::
        
            {
                "consultion.decoration.orderId": "1601010001",
                "consultion.comment": "咨询内容"
            }
    
### 报修/维修

## api.customer.AepairAction

        |DataType:|
        #### aepair

    - **aid**: 报修ID
      - 类型: *Long*
    - **csid**: 咨询ID
      - 类型: *Long*
    - **decoration**: 装修单 , 类型 [decoration](./decoration.html#api.decoration.decorationAction.decoration)
      - 类型: *Object*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **updater**: 操作人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **repaier**: 维修人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **targetTime**: 预计完成时间
      - 类型: *Timestamp*
    - **updateTime**: 更新时间
      - 类型: *Timestamp*
    - **finishTime**: 完成时间
      - 类型: *Timestamp*
    - **onestate**: 状态 , 0: 初始 , 1: 维修 , 2: 完工
      - 类型: *Short*
    - **twostate**: 状态 , 0: 初始 , 1: 维修 , 2: 完工
      - 类型: *Short*
    - **thrstate**: 状态 , 0: 初始 , 1: 维修 , 2: 完工
      - 类型: *Short*
    - **forstate**: 状态 , 0: 初始 , 1: 维修 , 2: 完工
      - 类型: *Short*
    - **fivstate**: 状态 , 0: 初始 , 1: 维修 , 2: 完工
      - 类型: *Short*
    - **status**: 状态 , 0: 初始 , 1: 维修 , 2: 完工 , 3: 关闭
      - 类型: *Short*
    - **outlay**: 维修费用
      - 类型: *Long*
    - **outpay**: 已付费用
      - 类型: *Long*
    - **gladness**: 满意度 , 0: 初始 , 1: 满意 , 2: 一般 , 3: 投诉
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*
    
    ### <I> pageAepair

        分页方式获取报修信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 报修信息列表 , 每条数据类型 *aepair*
        :type paging.data: List
        
        Example::
        
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
    
    ### <I> queryAepair

        通过咨询ID获取报修信息
        
                |Requests:|
                :param aepair.csid: 咨询ID
        :type aepair.csid: Long
        
        Example::
        
            {
                "aepair.csid": 1
            }
            
                |Returns:|
                - **aepairs**: 报修信息列表 , 每条数据类型 *aepair*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> queryAepairByOrderId

        通过咨询ID获取报修信息
        
                |Requests:|
                :param aepair.decoration.orderId: 装修单号
        :type aepair.decoration.orderId: String
        
        Example::
        
            {
                "aepair.decoration.orderId": "1601010001"
            }
            
                |Returns:|
                - **aepairs**: 报修信息列表 , 每条数据类型 *aepair*
          - 类型: *List*
        
        Example::
        
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
    
    ### <I> addAepair

        添加报修信息
        
        判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**
        
                |Requests:|
                :param consultion.csid: 咨询ID
        :type consultion.csid: Long
        :param consultion.decoration.orderId: 装修单号
        :type consultion.decoration.orderId: String
        :param consultion.comment: 说明
        :type consultion.comment: String
        
        :param aepair.decoration.orderId: 装修单号
        :type aepair.decoration.orderId: String
        :param aepair.targetTime: 预计完成时间
        :type aepair.targetTime: Timestamp
        
        Example::
        
            {
                "consultion.csid": 1,
                "consultion.comment": 1,
                "aepair.decoration.orderId": "1601010001",
                "aepair.targetTime": "2016-01-01 00:00:00"
            }

    ### <I> updateAepair

        更新报修信息
        
        判断报修信息是否存在 , 不存在 , 错误信息 **330021 报修信息不存在**
        
        判断报修信息状态为0(初始)或1(维修) , 其他状态 **330022 报修状态不可操作**
        
                |Requests:|
                :param aepair.aid: 报修ID
        :type aepair.aid: Long
        :param aepair.outlay: 维修费用
        :type aepair.outlay: Long
        
        Example::
        
            {
                "aepair.rid": 1,
                "aepair.outlay": 100000
            }

    ### <I> receiveAepair

        领取报修信息
        
        判断报修信息是否存在 , 不存在 , 错误信息 **330021 报修信息不存在**
        
        判断报修信息状态是否为0(初始) , 其他状态 , 错误信息 **330022 报修状态不可操作**
        
        判断维修信息是否存在维修人 , 已存在 , 错误信息 **330027 维修已有归属**
        
        更新报修单中维修人信息 , 报修单状态为1(维修)
        
        生成维修信息
        
                |Requests:|
                :param aepair.aid: 报修ID
        :type aepair.aid: Long
        
        Example::
        
            {
                "aepair.aid": 1
            }
    
    ### <I> deliveAepair

        分配报修信息
        
        判断报修信息是否存在 , 不存在 , 错误信息 **330021 报修信息不存在**
        
        判断报修信息状态是否为0(初始) , 其他状态 , 错误信息 **330022 报修状态不可操作**
        
        判断维修信息是否存在维修人 , 已存在 , 错误信息 **330027 维修已有归属**
        
        生成维修信息
        
                |Requests:|
                :param aepair.aid: 报修ID
        :type aepair.aid: Long
        :param aepair.repaier.uid: 维修人ID
        :type aepair.repaier.uid: Long
        
        Example::
        
            {
                "aepair.aid": 1,
                "aepair.repaier.uid": 1
            }
    
    ### <I> tranAepair

        转交报修信息
        
        判断报修信息是否存在 , 不存在 , 错误信息 **330021 报修信息不存在**
        
        判断报修信息状态是否为1(维修) , 其他状态 , 错误信息 **330022 报修状态不可操作**
        
        判断维修归属为当前操作人 , 非同一人 , 错误信息 **330028 维修非当前归属**
        
                |Requests:|
                :param aepair.aid: 报修ID
        :type aepair.aid: Long
        :param aepair.repaier.uid: 维修人ID
        :type aepair.repaier.uid: Long
        
        Example::
        
            {
                "aepair.aid": 1,
                "aepair.repaier.uid": 1
            }

    ### <I> finishAepair

        完工报修
        
        判断报修信息是否存在 , 不存在 , 错误信息 **330021 报修信息不存在**
        
        判断报修信息状态是否为1(维修) , 其他状态 , 错误信息 **330022 报修状态不可操作**
        
        更新报修状态为2(完工)
        
                |Requests:|
                :param aepair.aid: 报修ID
        :type aepair.aid: Long
        
        Example::
        
            {
                "aepair.aid": 1
            }

    ### <I> closeAepair

        关闭报修
        
        判断报修信息是否存在 , 不存在 , 错误信息 **330021 报修信息不存在**
        
        判断报修信息状态是否为2(完工) , 其他状态 , 错误信息 **330022 报修状态不可操作**
        
                |Requests:|
                :param aepair.aid: 报修ID
        :type aepair.aid: Long
        
        Example::
        
            {
                "aepair.aid": 1
            }

    ### <I> sendAepair

        发送报修信息
        
        判断报修信息是否存在 , 不存在 , 错误信息 **330021 报修信息不存在**
        
                |Requests:|
                :param aepair.aid: 报修ID
        :type aepair.aid: Long
        
        Example::
        
            {
                "aepair.aid": 1
            }

## api.customer.RepairAction

        |DataType:|
        #### repair

    - **rid**: 维修ID
      - 类型: *Long*
    - **aid**: 报修ID
      - 类型: *Long*
    - **cnid**: 工程节点ID
      - 类型: *Long*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **updater**: 操作人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **updateTime**: 更新时间
      - 类型: *Timestamp*
    - **finishTime**: 完成时间
      - 类型: *Timestamp*
    - **deliver**: 转交人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **repaier**: 维修人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **status**: 状态 , 0: 初始 , 1: 维修 , 2: 完工
      - 类型: *Short*
    - **content**: 内容
      - 类型: *String*
    
    ### <I> queryRepair

        通过报修ID获取维修信息
        
                |Requests:|
                :param repair.aid: 报修ID
        :type repair.aid: Long
        
        Example::
        
            {
                "repair.aid": 1
            }
            
                |Returns:|
                - **repairs**: 维修信息列表 , 每条数据类型 *repair*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> addRepair

        添加维修信息
        
                |Requests:|
                :param repair.aid: 报修ID
        :type repair.aid: Long
        :param repair.repaier.uid: 维修人ID
        :type repair.repaier.uid: Long
        :param repair.content: 维修内容
        :type repair.content: String
        
        Example::
        
            {
                "repair.aid": 1,
                "repair.repaier.uid": 1,
                "repair.content": "维修内容"
            }

    ### <I> sendRepair

        发送
        
        判断维修信息是否存在 , 不存在 , 错误信息 **330025 维修信息不存在**
        
        判断维修状态为0(初始) , 其他状态 , 错误信息 **330026 维修状态不可操作**
        
                |Requests:|
                :param repair.rid: 维修ID
        :type repair.rid: Long
        
        Example::
        
            {
                "repair.rid": 1
            }
    
    ### <I> keepRepair

        维修
        
        判断维修信息是否存在 , 不存在 , 错误信息 **330025 维修信息不存在**
        
        判断维修状态为0(初始) , 其他状态 , 错误信息 **330026 维修状态不可操作**
        
        更新维修信息状态为1(维修)
        
        更新报修信息状态为1(维修)
        
                |Requests:|
                :param repair.rid: 维修ID
        :type repair.rid: Long
        :param repair.schedule: 进度
        :type repair.schedule: String
        
        Example::
        
            {
                "repair.rid": 1,
                "repair.schedule": "one"
            }
    
    ### <I> finishRepair

        完工
        
        判断维修信息是否存在 , 不存在 , 错误信息 **330025 维修信息不存在**
        
        判断维修状态为1(维修) , 其他状态 , 错误信息 **330026 维修状态不可操作**
        
        判断维修归属为当前操作人 , 非同一人 , 错误信息 **330028 维修非当前归属**
        
        更新维修信息状态为2(完工)
        
        更新报修信息状态为0(初始)
        
                |Requests:|
                :param repair.rid: 维修ID
        :type repair.rid: Long
        :param repair.schedule: 进度
        :type repair.schedule: String
        
        Example::
        
            {
                "repair.rid": 1,
                "repair.schedule": "one"
            }
    
## api.customer.RepairpayAction

        |DataType:|
        #### repairpay

    - **rpid**: 维修款ID
      - 类型: *Long*
    - **aid**: 报修ID
      - 类型: *Long*
    - **type**: 类型 , 0: 款项 , 对应装修款 , 1: 扣款 , 员工薪资 , 2: 成本 , 公司承担
      - 类型: *Short*
    - **ident**: 引用ID
      - 类型: *Long*
    - **money**: 金额
      - 类型: *Long*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 初始 , 1: 已付款 , 2: 已确认
      - 类型: *Short*
    
    ### <I> queryRepairpay

        通过维修信息ID获取维修款信息
        
                |Requests:|
                :param repairpay.aid: 报修ID
        :type repairpay.aid: Long
        
        Example::
        
            {
                "repairpay.aid": 1
            }

                |Returns:|
                - **repairpays**: 维修款信息列表 , 每条数据类型 *repairpay*
          - 类型: *List*
        
        Example::
        
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

    ### <I> addRepairpay

        添加维修款
        
        判断维修信息是否存在 , 不存在 , 错误信息 **330025 维修信息不存在**
        
        更新报修单的维修费用
        
                |Requests:|
                :param repairpay.aid: 报修ID
        :type repairpay.aid: Long
        :param repairpay.type: 类型
        :type repairpay.type: Short
        :param repairpay.money: 金额
        :type repairpay.money: Long
        
        Example::
        
            {
                "repairpay.aid": 1,
                "repairpay.type": 1,
                "repairpay.money": 100000,
            }

    ### <I> deleteRepairpay

        删除维修款
        
        判断维修款是否存在 , 不存在 , 错误信息 **330032 维修款不存在**
        
        判断维修款状态是否为0(初始) , 其他状态 , 错误信息 **330033 维修款状态不可操作**
        
                |Requests:|
                :param repairpay.rpid: 维修款ID
        :type repairpay.rpid: Long
        
        Example::
        
            {
                "repairpay.rpid": 1
            }

### 投诉/跟踪

## api.customer.ComplainAction

        |DataType:|
        #### complain

    - **cid**: 投诉ID
      - 类型: *Long*
    - **csid**: 咨询ID
      - 类型: *Long*
    - **decoration**: 装修单 , 类型 [decoration](./decoration.html#api.decoration.decorationAction.decoration)
      - 类型: *Object*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **updater**: 操作人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **updateTime**: 操作时间
      - 类型: *Timestamp*
    - **finishTime**: 完成时间
      - 类型: *Timestamp*
    - **level**: 等级 , 0: 标准 , 1: 重大 , 2: 危机
      - 类型: *Short*
    - **status**: 状态 , 0: 初始,  1: 处理 , 2: 完结 , 3: 关闭
      - 类型: *Short*
    - **gladness**: 满意度 , 0: 初始 , 1: 满意 , 2: 一般 , 3: 投诉
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*
    
    ### <I> pageComplain

        分页方式获取投诉信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 投诉信息列表 , 每条数据类型 *complain*
        :type paging.data: List
        
        Example::
        
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
    
    ### <I> queryComplain

        通过咨询ID获取投诉信息
        
                |Requests:|
                :param complain.csid: 咨询ID
        :type complain.csid: Long
        
        Example::
        
            {
                "complain.csid": 1
            }
            
                |Returns:|
                - **complains**: 投诉信息列表 , 每条数据类型 *complain*
          - 类型: *List*
        
        Example::
        
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

    ### <I> queryComplainByOrderId

        通过装修单号获取投诉信息
        
                |Requests:|
                :param complain.decoration.orderId: 装修单号
        :type complain.decoration.orderId: String
        
        Example::
        
            {
                "complain.csid": 1
            }
            
                |Returns:|
                - **complains**: 投诉信息列表 , 每条数据类型 *complain*
          - 类型: *List*
        
        Example::
        
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

    ### <I> addComplain

        添加投诉信息
        
        判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**
        
                |Requests:|
                :param consultion.csid: 咨询ID
        :type consultion.csid: Long
        :param consultion.decoration.orderId: 装修单号
        :type consultion.decoration.orderId: String
        :param consultion.comment: 说明
        :type consultion.comment: String
        
        :param complain.level: 等级
        :type complain.level: Short
        
        :param complaints[n].type: 类型
        :type complaints[n].type: Short
        :param complaints[n].dept.did: 部门ID
        :type complaints[n].dept.did: Short
        :param complaints[n].staff.uid: 人员ID
        :type complaints[n].staff.uid: Short
        :param complaints[n].brand.bid: 品牌ID
        :type complaints[n].brand.bid: Short
        :param complaints[n].content: 内容
        :type complaints[n].content: String
        
        Example::
        
            {
                "complain.csid": 1,
                "complain.level": 1,
                
                "complaints[0].type": 0,
                "complaints[0].dept.did": 1,
                "complaints[0].staff.uid": 1,
                "complaints[0].brand.bid": 1,
                "complaints[0].content": "投诉内容",
            }
    
    ### <I> finishComplain

        完结
        
        判断投诉信息是否存在 , 不存在 , 错误信息 **330037 投诉信息不存在**
        
        判断投诉信息状态是否为1(处理) , 其他状态 , 错误信息 **330038 投诉状态不可操作**
        
        更新投诉信息状态为2(完结)
        
                |Requests:|
                :param complain.cid: 投诉ID
        :type complain.cid: Long
        
        Example::
        
            {
                "complain.cid": 1
            }
    
    ### <I> closeComplain

        关闭
        
        判断投诉信息是否存在 , 不存在 , 错误信息 **330037 投诉信息不存在**
        
        判断投诉信息状态是否为2(完结) , 其他状态 , 错误信息 **330038 投诉状态不可操作**
        
        更新投诉信息状态为3(关闭)
        
                |Requests:|
                :param complain.cid: 投诉ID
        :type complain.cid: Long
        
        Example::
        
            {
                "complain.cid": 1
            }

## api.customer.ComplaintAction

        |DataType:|
        #### complaint

    - **ctid**: 投诉内容ID
      - 类型: *Long*
    - **cid**: 投诉ID
      - 类型: *Long*
    - **type**: 类型 , 0: 设计 , 1: 业务 , 2: 工程 , 3: 销售 , 4: 其他 , 5: 无理
      - 类型: *Short*
    - **dept**: 部门 , 类型 [department](./department.html#api.department.DepartmentAction.department)
      - 类型: *Object*
    - **staff**: 员工 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **brand**: 品牌 , 类型 [brand](./data.html#api.communion.BrandAction.brand)
      - 类型: *Object*
    - **content**: 内容
      - 类型: *String*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **updater**: 操作人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **updateTime**: 更新时间
      - 类型: *Timestamp*
    - **finishTime**: 完结时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 初始 , 1: 处理 , 2: 完结 , 3: 关闭
      - 类型: *Short*
    
    ### <I> queryComplaint

        通过投诉ID获取内容信息
        
                |Requests:|
                :param complaint.cid: 投诉ID
        :type complaint.cid: Long
        
        Example::
        
            {
                "complaint.cid": 1
            }
            
                |Returns:|
                - **complaints**: 投诉内容信息列表 , 每条数据类型 *complaint*
          - 类型: *List*
        
        Example::
        
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
    
    ### <I> addComplaint

        添加投诉内容
        
                |Requests:|
                :param complaint.cid: 咨询ID
        :type complaint.cid: Long
        :param complaint.type: 类型
        :type complaint.type: Short
        :param complaint.dept.did: 部门ID
        :type complaint.dept.did: Short
        :param complaint.staff.uid: 人员ID
        :type complaint.staff.uid: Short
        :param complaint.brand.bid: 品牌ID
        :type complaint.brand.bid: Short
        :param complaint.content: 内容
        :type complaint.content: String
        
        Example::
        
            {
                "complaint.cid": 1,
                "complaint.type": 1,
                "complaint.dept.did": 1,
                "complaint.staff.uid": 1,
                "complaint.brand.bid": 1,
                "complaint.content": "投诉内容"
            }
    
    ### <I> finishComplaint

        完结
        
        判断投诉信息是否存在 , 不存在 , 错误信息 **330042 投诉内容不存在**
        
        判断投诉状态是否为1(处理) , 其他状态 , 错误信息 **330043 投诉内容不可操作**
        
        更新投诉状态为2(完结)
        
                |Requests:|
                :param complaint.ctid: 投诉ID
        :type complaint.ctid: Long
        
        Example::
        
            {
                "complaint.ctid": 1
            }
    
    ### <I> closeComplaint

        关闭
        
        判断投诉内容是否存在 , 不存在 , 错误信息 **330042 投诉内容不存在**
        
        判断投诉内容状态是否为1(处理) , 其他状态 , 错误信息 **330043 投诉内容不可操作**
        
        更新投诉内容状态为3(关闭)
        
                |Requests:|
                :param complaint.ctid: 投诉ID
        :type complaint.ctid: Long
        
        Example::
        
            {
                "complaint.ctid": 1
            }

## api.customer.ComplackAction

        |DataType:|
        #### complack

    - **ckid**: 跟踪ID
      - 类型: *Long*
    - **cid**: 投诉ID
      - 类型: *Long*
    - **ctid**: 投诉内容ID
      - 类型: *Long*
    - **operater**: 操作人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **operateTime**: 操作时间
      - 类型: *Timestamp*
    - **comment**: 说明
      - 类型: *String*
    
    ### <I> queryComplack

        通过投诉内容ID获取跟踪信息
        
                |Requests:|
                :param complack.ctid: 投诉内容ID
        :type complack.ctid: Long
        
        Example::
        
            {
                "complack.ctid": 1
            }

                |Returns:|
                - **complacks**: 跟踪信息列表 , 每条数据类型 *complack*
          - 类型: *List*
        
        Example::
        
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

    ### <I> trackComplack

        跟踪
        
        判断投诉内容是否存在 , 不存在 , 错误信息 **330042 投诉内容不存在**
        
                |Requests:|
                :param complack.cid: 投诉ID
        :type complack.cid: Long
        :param complack.ctid: 投诉内容ID
        :type complack.ctid: Long
        :param complack.comment: 说明
        :type complack.comment: String
        
        Example::
        
            {
                "complack.cid": 1,
                "complack.ctid": 1,
                "complack.comment": "说明"
            }

### 回访

## api.customer.RevisitAction

        |DataType:|
        #### revisit

    - **rid**: 回访ID
      - 类型: *Long*
    - **decoration**: 装修单 , 类型 [decoration](./decoration.html#api.decoration.decorationAction.decoration)
      - 类型: *Object*
    - **type**: 类型 , 0: 保修 , 1: 投诉
      - 类型: *Short*
    - **ident**: 引用ID
      - 类型: *Long*
    - **creater**: 操作人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **gladness**: 满意度 , 0: 初始 , 1: 满意 , 2: 一般 , 3: 投诉
      - 类型: *Short*
    - **content**: 内容
      - 类型: *String*
    
    ### <I> pageRevisit

        分页方式获取回访信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 回访信息列表 , 每条数据类型 *revisit*
        :type paging.data: List
        
        Example::
        
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
    
    ### <I> queryRevisitForAepair

        获取报修类型回访信息
    
                |Requests:|
                :param revisit.ident: 引用ID
        :type revisit.ident: Long
        
        Example::
        
            {
                "revisit.ident": 1
            }
        
                |Returns:|
                - **revisits**: 回访信息列表 , 每条数据类型 *revisit*
          - 类型: *List*
        
        Example::
        
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
    
    ### <I> queryRevisitForComplain

        获取投诉类型回访信息
    
                |Requests:|
                :param revisit.ident: 引用ID
        :type revisit.ident: Long
        
        Example::
        
            {
                "revisit.ident": 1
            }
        
                |Returns:|
                - **revisits**: 回访信息列表 , 每条数据类型 *revisit*
          - 类型: *List*
        
        Example::
        
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

    ### <I> queryRevisitByOrderId

        通过装修单号获取回访信息
    
                |Requests:|
                :param revisit.decoration.orderId: 装修单号
        :type revisit.decoration.orderId: Long
        
        Example::
        
            {
                "revisit.decoration.orderId": "1601010001"
            }
        
                |Returns:|
                - **revisits**: 回访信息列表 , 每条数据类型 *revisit*
          - 类型: *List*
        
        Example::
        
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

    ### <I> visitRevisit

        回访
        
                |Requests:|
                :param revisit.decoration.orderId: 装修单号
        :type revisit.decoration.orderId: Long
        :param revisit.type: 类型
        :type revisit.type: Short
        :param revisit.ident: 引用ID
        :type revisit.ident: Long
        :param revisit.gladness: 满意度
        :type revisit.gladness: Short
        :param revisit.comment: 说明
        :type revisit.comment: String
        
        Example::
        
            {
                "revisit.decoration.orderId": "1601010001",
                "revisit.type": 1,
                "revisit.ident": 1,
                "revisit.gladness": 0,
                "revisit.comment": "说明"
            }

## 大客户

## api.customer.VustomerAction

        |DataType:|
        #### vustomer

    - **vid**: 大客户ID
      - 类型: *Long*
    - **unionId**: 归属人ID
      - 类型: *String*
    - **name**: 姓名
      - 类型: *String*
    - **phone**: 电话
      - 类型: *String*
    - **address**: 地址
      - 类型: *String*
    - **referrer**: 推荐人名
      - 类型: *String*
    - **referPhone**: 推荐人电话
      - 类型: *String*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **belonger**: 归属人 , 类型 [user](./user.html#api.data.UserAction.user)
      - 类型: *Object*
    - **orderId**: 装修单号
      - 类型: *String*
    - **contractPrice**: 签单额
      - 类型: *Float*
    - **status**: 状态 , 0: 有效 , 1: 无效
      - 类型: *Short*
    
    ### <I> pageVustomer

        分页方式获取大客户信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        针对当前登录人员返回归属的大客户信息
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 大客户信息列表 , 每条数据类型 *vustomer*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> pageVustomerForAdvance

        分页方式获取大客户信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 大客户信息列表 , 每条数据类型 *vustomer*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> pageVustomerForCommunion

        分页方式获取大客户信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        归属人为空的大客户信息
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 大客户信息列表 , 每条数据类型 *vustomer*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I-C> pageVustomerByUnionId

        分页方式获取大客户信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        固定条件为通过unionId获取归属的大客户信息
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 大客户信息列表 , 每条数据类型 *vustomer*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I-C> queryVustomerByUnionId

        通过归属人ID获取大客户信息 , 状态为0(有效)
        
                |Requests:|
                :param vustomer.unionId: 归属人ID
        :type vustomer.unionId: String
        
        Example::
        
            {
                "vustomer.unionId": 1918
            }
            
                |Returns:|
                - **vustomers**: 大客户信息列表 , 每条数据类型 *vustomer*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I-C> countVustomerByUnionId

        统计归属人对应的客户信息
        
        返回结果依次为: 签单总额 , 签单总数 , 客户总数
        
                |Requests:|
                :param vustomer.unionId: 归属人ID
        :type vustomer.unionId: String
        
        Example::
        
            {
                "vustomer.unionId": 1918
            }
            
                |Returns:|
                - **counts**: 统计信息信息 , 类型 List <String> , 依次为: 签单总额 , 签单总数 , 客户总数
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "counts":[
                    "100000",
                    "15",
                    "30"
                ],
                ...
            }
            
    ### <I-C> addVustomer

        添加大客户信息
        
                |Requests:|
                :param vustomer.uniondId: 标识
        :type vustomer.uniondId: String
        :param vustomer.name: 姓名
        :type vustomer.name: String
        :param vustomer.phone: 电话
        :type vustomer.phone: String
        :param vustomer.address: 地址
        :type vustomer.address: String
        :param vustomer.referrer: 推荐人姓名
        :type vustomer.referrer: String
        :param vustomer.referPhone: 推荐人电话
        :type vustomer.referPhone: String
        
        Example::
        
            {
                "vustomer.uniondId": 1918,
                "vustomer.name": "大客户",
                "vustomer.phone": "138xxxx9872",
                "vustomer.address": "沈阳市铁西区xxxx30号 1-1-1",
                "vustomer.referrer": "推荐人",
                "vustomer.referPhone": "135xxxx1918"
            }
            
    ### <I> updateVustomer

        大客户绑定装修单
        
        判断大客户信息是否存在 , 不存在 , 错误信息 **330003 客户信息不存在**
        
        判断大客户信息是否已经绑定装修单 , 已经绑定 , 错误信息 **330004 客户已绑装修单**
        
        判断绑定装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        判断绑定装修单状态为2(签约) , 其他状态 , 错误信息 **330006 装修单未签约**
        
                |Requests:|
                :param vustomer.vid: 大客户ID
        :type vustomer.vid: String
        :param vustomer.orderId: 装修单号
        :type vustomer.orderId: String
        
        Example::
        
            {
                "vustomer.vid": 1918,
                "vustomer.orderId": "1601010001"
            }
            
    ### <I> freeVustomer

        释放大客户信息
        
        判断大客户信息是否存在 , 不存在 , 错误信息 **330003 客户信息不存在**
        
        判断大客户信息是否已经绑定装修单 , 已经绑定 , 错误信息 **330004 客户已绑装修单**
        
                |Requests:|
                :param vustomer.vid: 大客户ID
        :type vustomer.vid: String
        
        Example::
        
            {
                "vustomer.vid": 1918
            }
            
    ### <I> takeVustomer

        认领大客户信息
        
        判断大客户信息是否存在 , 不存在 , 错误信息 **330003 客户信息不存在**
        
        判断大客户信息是否已经绑定装修单 , 已经绑定 , 错误信息 **330004 客户已绑装修单**
        
        判断大客户是否已经存在归属人 , 存在归属人 , 错误信息 **330007 客户存在归属**
        
        :param vustomer.vid: 大客户ID
        :type vustomer.vid: String
        
        Example::
        
            {
                "vustomer.vid": 1918
            }
        
    ### <I> updateVustomerForBelonger

        更新大客户归属信息
        
        判断大客户信息是否存在 , 不存在 , 错误信息 **330003 客户信息不存在**
        
        判断大客户信息是否已经绑定装修单 , 已经绑定 , 错误信息 **330004 客户已绑装修单**
    
                |Requests:|
                :param vustomer.vid: 标识
        :type vustomer.vid: String
        :param vustomer.belonger.userId: 归属人ID
        :type vustomer.belonger.userId: String
        
        Example::
        
            {
                "vustomer.vid": 1918,
                "vustomer.belonger.userId": "U0001"
            }

    ### <I-C> deleteVustomer

        逻辑删除大客户信息 , 更新状态为1(无效)
        
                |Requests:|
                :param vustomer.vid: 标识
        :type vustomer.vid: String
        
        Example::
        
            {
                "vustomer.vid": 1,
            }
            
## api.customer.VustomerNetAction

    大客户关系网

        |DataType:|
        #### vustomerNet

    - **vnid**: 客户网ID
      - 类型: *Long*
    - **unionId**: 归属人ID
      - 类型: *String*
    - **netunionId**: 关系人ID
      - 类型: *String*
    
    ### <I-C> countVustomerNetByUnionId

        统计客户关系网
        
        返回结果依次为: 关系客户数
        
                |Requests:|
                :param vustomerNet.unionId: 归属人ID
        :type vustomerNet.unionId: String
        
        Example::
        
            {
                "vustomerNet.unionId": 1918
            }
            
                |Returns:|
                - **counts**: 统计信息信息 , 类型 List <String> , 依次为: 关系客户数
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "counts":[
                    "2"
                ],
                ...
            }
            
    ### <I-C> buildVustomerNet

        建立客户关系
        
        判断关系人ID是否绑定归属人ID , 如果存在 , 错误信息 ** 客户关系已存在**
        
                |Requests:|
                :param vustomerNet.unionId: 归属人ID
        :type vustomerNet.unionId: String
        :param vustomerNet.netunionId: 关系人ID
        :type vustomerNet.netunionId: String
        
        Example::
        
            {
                "vustomerNet.unionId": 1918,
                "vustomerNet.netunionId": 1919
            }

## api.customer.VrecordAction

    客户记录信息

        |DataType:|
        #### vrecord

    - **vrid**: 记录ID
      - 类型: *Long*
    - **vid**: 大客户ID
      - 类型: *Long*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **comment**: 内容
      - 类型: *String*
    
    ### <I> queryVrecordByVid

        通过大客户ID获取记录信息
        
                |Requests:|
                :param vrecord.vid: 大客户ID
        :type vrecord.vid: String
        
        Example::
        
            {
                "vrecord.vid": 1,
            }
            
                |Returns:|
                - **vrecords**: 记录信息列表 , 每条数据类型 *vrecord*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I> addVrecord

        添加大客户对应的记录信息
    
                |Requests:|
                :param vrecord.vid: 大客户ID
        :type vrecord.vid: String
        :param vrecord.comment: 说明
        :type vrecord.comment: String
        
        Example::
        
            {
                "vrecord.vid": 1,
                "vrecord.comment": "说明",
            }
            
## api.customer.VscoreAction

    客户积分相关信息

        |DataType:|
        #### vscore

    - **vsid**: 积分ID
      - 类型: *Long*
    - **unionId**: 归属人ID
      - 类型: *String*
    - **score**: 积分
      - 类型: *Integer*
    
    #### vscoreRecord

    - **vsrid**: 积分记录ID
      - 类型: *Long*
    - **unionId**: 归属人ID
      - 类型: *String*
    - **orderId**: 装修单号
      - 类型: *String*
    - **score**: 积分
      - 类型: *Integer*
    - **operater**: 操作人
      - 类型: *Object*
    - **operateTime**: 操作时间
      - 类型: *Timestamp*
    - **type**: 类型 , 0: 新增 , 1: 提取
      - 类型: *Short*
    - **status**: 状态 , 0: 初始 , 1: 通过
      - 类型: *Short*
    - **comment**: 备注
      - 类型: *String*
    
    ### <I-C> queryVscoreByUnionId

        通过归属人ID获取积分信息
        
                |Requests:|
                :param vscore.unionId: 归属人ID
        :type vscore.unionId: String
        
        Example::
        
            {
                "vrecord.unionId": 1918,
            }
            
                |Returns:|
                - **vscore**: 积分信息 , 类型 *vscore*
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I> pageVscoreRecordByUnionId

        分页方式获取积分记录信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        默认条件为归属人ID
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 积分记录列表 , 每条数据类型 *vscoreRecord*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I> updateVscoreRecordForStatus

        更新积分记录状态
        
        判断积分记录类型以及状态不同情况进行处理
        
        通过增加类型的积分记录 , 归属人ID对应的积分值增加
        
        拒绝提取类型的积分记录 , 归属人ID对应的积分值增加
        
    ### <I> raiseVscore

        增加积分
        
        根据归属人ID获取积分信息 , 不存在创建积分信息
        
        生成对应的积分记录 , 更新积分信息中的积分值
        
                |Requests:|
                :param vscore.unionId: 归属人ID
        :type vscore.unionId: String
        :param vscore.score: 积分
        :type vscore.score: Integer
        
        Example::
        
            {
                "vrecord.unionId": "1918",
                "vrecord.score": 1000
            }
            
    ### <I-C> pickupVscore

        提取积分
        
        根据归属人ID获取积分信息 , 不存在 , 错误信息 ** 积分不存在**
        
        判断积分信息中积分值是否大于提取积分值 , 不满足提取积分值 , 错误信息 ** 积分不足**
        
        生成积分记录信息 , 同时减少归属人ID积分信息中的积分值
        
                |Requests:|
                :param vscore.unionId: 归属人ID
        :type vscore.unionId: String
        :param vscore.score: 积分
        :type vscore.score: Integer
        
        Example::
        
            {
                "vrecord.unionId": "1918",
                "vrecord.score": 1000
            }
            
## 资料

### 订单

## api.customer.DecorationAction

        |DataType:|
        #### decoration

    - **did**: 装修单ID
      - 类型: *Long*
    - **unionId**: 联合ID
      - 类型: *String*
    - **orderId**: 装修单号
      - 类型: *String*
    - **address**: 楼盘楼号
      - 类型: *String*
    - **designer**: 设计师 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **salesman**: 业务员 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **supervisor**: 监理 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **houseArea**: 面积
      - 类型: *Float*
    - **totalPrice**: 合同额
      - 类型: *Float*
    - **defaultFlag**: 默认订单,0:初始 1:默认
      - 类型: *String*
    - **memberFlag**: 会员状态,0:初始 1:会员
      - 类型: *String*
    
    #### decorationActivity

    - **orderId**: 装修单号
      - 类型: *String*
    - **activity**: 活动信息
      - 类型: *String*
    
    ### <I-C> queryCusDecoration

        通过unionId获取绑定的所有装修单信息
        
                |Requests:|
                - **unionId**: 联合ID
          - 类型: *String*
        
        Example::
        
            {
                "unionId": "SDJ4SDF5"
            }
        
                |Returns:|
                - **decorations**: 装修单列表 , 每条数据类型 :[decoration](./customer.html#api.customer.DecorationAction.decoration)
          - 类型: *List*
        
        Example::
        
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
            
    ### <I-C> queryCusDecorationForDefault

        通过unionId获取默认装修单
        
                |Requests:|
                - **unionId**: 联合ID
          - 类型: *String*
        
        Example::
        
            {
                "unionId": "SDJ4SDF5"
            }
        
                |Returns:|
                - **decoration**: 装修单信息 , 类型 :[decoration](./customer.html#api.customer.DecorationAction.decoration)
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I-C> queryCusDecorationByOrderId

        通过unionId获取装修单
        
                |Requests:|
                - **unionId**: 联合ID
          - 类型: *String*
        :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        
        Example::
        
            {
                "unionId": "SDJ4SDF5",
                "decoration.orderId": "1601010001"
            }
        
                |Returns:|
                - **decoration**: 装修单信息 , 类型 :[decoration](./customer.html#api.customer.DecorationAction.decoration)
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I-C> queryCusDecorationUser

        分页方式获取装修单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ .
        
                |Requests:|
                - **unionId**: 联合ID
          - 类型: *String*
        :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        
        Example::
        
            {
                "unionId": "SDJ4SDF5",
                "decoration.orderId": "1601010001"
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 人员信息列表 , 每条数据类型 :[decorationUser](./decoration.html#api.decoration.DecorationUserAction.decorationUser)
        :type paging.data: List
        
        Example::
        
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
            
    ### <I-C> queryCusDecorationActivity

        获取装修单活动信息
        
                |Requests:|
                :param decorationActivity.orderId: 装修单号
        :type decorationActivity.orderId: String
        
        Example::
        
            {
                "decorationActivity.orderId": "1601010001"
            }
            
                |Returns:|
                - **decorationActivity**: 活动信息 , 每条数据类型 *decorationActivity*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "decorationActivity": {
                    "orderId": "1601010001",
                    "activity": "装修活动"
                }
                ...
            }
        
    ### <I-C> queryCusDecorationHolonomy

        获取装修单半价信息
        
                |Requests:|
                :param decorationHolonomy.orderId: 装修单号
        :type decorationHolonomy.orderId: String
        
        Example::
        
            {
                "decorationHolonomy.orderId": "1601010001"
            }
            
                |Returns:|
                - **decorationHolonomy**: 半价/满减信息 , 每条数据类型 *decorationHolonomy*
          - 类型: *Object*
        
        Example::
        
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

    ### <I-C> vodeCusDecoration

        短信验证
        
                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        
        Example::
        
            {
                "decoration.orderId": "1601010001"
            }

                |Returns:|
                - **securityCode**: 验证码
          - 类型: *String*
        
        Example::
        
            {
                ...
                "securityCode": "SUDF2JH3J423NJ"
                ...
            }
            
    ### <I-C> bindingCusDecoration

        绑定装修单
        
        按照规则判断验证码和校验码 , 不匹配 , 错误信息 **330008 绑定订单失败,验证码错误**
        
        通过电话获取到对应客户的装修单 , 如果没有可绑定装修单 , 错误信息 **330009 无可绑定订单**
        
                |Requests:|
                :param decoration.unionId: 联合ID
        :type decoration.unionId: String
        :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        - **phone**: 客户电话
          - 类型: *String*
        - **securityCode**: 验证码
          - 类型: *String*
        - **verifyCode**: 校验码
          - 类型: *String*
        
        Example::
        
            {
                "decoration.unionId": "SDJ4SDF5",
                "decoration.orderId": "1601010001",
                "phone": "13333333333",
                "securityCode": "1234",
                "verifyCode": "1234"
            }
        
            
    ### <I-C> updateCusDecorationForDefault

        更换默认装修单
        
                |Requests:|
                - **unionId**: 联合ID
          - 类型: *String*
        :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        
        Example::
        
            {
                "unionId": "SDJ4SDF5",
                "decoration.orderId":"1601010001"
            }

    ### <I> unbindingCusDecoration

        解绑装修单
        
        按照规则判断验证码和校验码 , 不匹配 , 错误信息 **330008 绑定订单失败,验证码错误**
        
                |Requests:|
                :param decoration.unionId: 联合ID
        :type decoration.unionId: String
        :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        
        Example::
        
            {
                "decoration.unionId": "SDJ4SDF5",
                "decoration.orderId": "1601010001"
            }

### 款项

## api.customer.PaymentAction

        |DataType:|
        #### advancePayment

    - **cid**: 客户ID
      - 类型: *Long*
    - **balance**: 合同预付款
      - 类型: *Float*
    - **projectBalance**: 工程预付款
      - 类型: *Float*
    - **materialBalance**: 主材预付款
      - 类型: *Float*
    - **zhenglinBalance**: 正林预付款
      - 类型: *Float*
    
    #### payment

    - **orderId**: 装修单号
      - 类型: *String*
    - **money**: 操作额
      - 类型: *Float*
    - **type**: 类型 , 收款 , 退款
      - 类型: *String*
    - **paymentType**: 款项类型
      - 类型: *String*
    - **brand**: 品牌
      - 类型: *String*
    - **collectTime**: 收款时间
      - 类型: *Timestamp*
    
    #### decorationPayment

    - **orderId**: 装修单号
      - 类型: *String*
    - **referMoney**: 金额
      - 类型: *Float*
    - **collectTime**: 收款时间
      - 类型: *Timestamp*
    - **coupon**: 券金额
      - 类型: *Float*
    - **couponInfo**: 券信息
      - 类型: *String*
    - **paymentStatus**: 状态
      - 类型: *Short*
    - **paymentType**: 类型
      - 类型: *String*
    
    #### materialPayment

    - **orderId**: 装修单号
      - 类型: *String*
    - **category**: 品类
      - 类型: *String*
    - **brand**: 品牌
      - 类型: *String*
    - **no**: 主材单号
      - 类型: *String*
    - **referMoney**: 金额
      - 类型: *Float*
    - **collectTime**: 收款时间
      - 类型: *Timestamp*
    - **coupon**: 券金额
      - 类型: *Float*
    - **couponInfo**: 券信息
      - 类型: *String*
    - **paymentStatus**: 状态
      - 类型: *Short*
    - **paymentType**: 类型
      - 类型: *Short*
    
    #### salesPayment

    - **orderId**: 装修单号
      - 类型: *String*
    - **brand**: 品牌
      - 类型: *String*
    - **money**: 金额
      - 类型: *Float*
    - **collectTime**: 收款时间
      - 类型: *Timestamp*
    - **status**: 状态
      - 类型: *Short*
    - **paymentType**: 类型
      - 类型: *Short*
    
    #### servicePayment

    - **orderId**: 装修单号
      - 类型: *String*
    - **advanceMoney**: 预付款
      - 类型: *Float*
    - **serviceMoney**: 服务款
      - 类型: *Float*
    - **collectTime**: 收款时间
      - 类型: *Timestamp*
    - **status**: 状态
      - 类型: *Short*
    - **type**: 类型
      - 类型: *Short*

    #### proxyPayment

    - **ppid**: 代付款ID
      - 类型: *Long*
    - **title**: 标题
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **phone**: 电话
      - 类型: *String*
    - **address**: 地址
      - 类型: *String*
    - **unionId**: 联合ID
      - 类型: *String*
    - **orderId**: 装修单号
      - 类型: *String*
    - **referMoney**: 金额
      - 类型: *Integer*
    - **type**: 类型
      - 类型: *Short*
    - **status**: 状态
      - 类型: *Short*
    - **platform**: 平台信息
      - 类型: *String*
    
    ### <I-C> queryCusAdvance

        通过客户ID查询预付款信息
        
                |Requests:|
                :param advance.cid: 客户ID
        :type advance.cid: Long
        
        Example::
        
            {
                "advance.cid": 1,
            }
            
                |Returns:|
                - **advance**: 预付款信息 , 每条数据类型 :advance
          - 类型: *Object*
        
        Example::
        
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
    
    ### <I-C> queryCusPayment

        分页方式通过装修单号获取预付款明细信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ . 
    
                |Requests:|
                :param payment.orderId: 装修单号
        :type payment.orderId: String
        
        Example::
        
            {
                "payment.orderId": "1601010001"
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 款项列表 , 每条数据类型 *payment*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I-C> queryCusDecorationPayment

        分页方式通过装修单号获取装修款项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ . 
        
                |Requests:|
                :param payment.orderId: 装修单号
        :type payment.orderId: String
        
        Example::
        
            {
                "payment.orderId": "1601010001"
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 款项信息列表 , 每条数据类型 *decorationPayment*
        :type paging.data: List
        
        
        Example::
        
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

    ### <I-C> queryCusDecorationPaymentForContract

        获取装修单的合同类型款项 , 一类为0(收款) , 二类为1(合同) , 状态为1(已付款)和2(已确认)
        
                |Requests:|
                :param payment.orderId: 装修单号
        :type payment.orderId: String
        
        Example::
        
            {
                "payment.orderId": "1601010001"
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 款项信息列表 , 每条数据类型 *decorationPayment*
        :type paging.data: List
        
        
        Example::
        
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

    ### <I-C> queryCusMaterialPayment

        分页方式通过装修单号获取主材款项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ . 
        
                |Requests:|
                :param payment.orderId: 装修单号
        :type payment.orderId: String
        
        Example::
        
            {
                "payment.orderId": "1601010001"
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 款项信息列表 , 每条数据类型 *materialPayment*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I-C> queryCusSalesPayment

        分页方式通过装修单号获取销售款项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ . 
        
                |Requests:|
                :param payment.orderId: 装修单号
        :type payment.orderId: String
        
        Example::
        
            {
                "payment.orderId": "1601010001"
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 款项信息列表 , 每条数据类型 *salesPayment*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I-C> queryCusServicePayment

        分页方式通过装修单号获取服务款项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ . 
        
                |Requests:|
                :param payment.orderId: 装修单号
        :type payment.orderId: String
        
        Example::
        
            {
                "payment.orderId": "1601010001"
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 款项信息列表 , 每条数据类型 *servicePayment*
        :type paging.data: List
        
        Example::
        
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

    ### <I-C> queryCusProxyPayment

        获取代付款信息
        
                |Requests:|
                :param proxyPayment.ppid: 款项ID
        :type proxyPayment.ppid: Long
        
        Example::
        
            {
                "proxyPayment.ppid": "1601010001"
            }

                |Returns:|
                - **proxyPayment**: 代付款信息 , 类型 *proxyPayment*
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I-C> countCusMaterialPaymentForAmount

        统计主材款 , 状态为1(已付款)和2(已确认)
        
                |Requests:|
                :param materialPayment.orderId: 装修单号
        :type materialPayment.orderId: String
        
        Example::
        
            {
                "materialPayment.orderId": "1601010001"
            }
            
                |Returns:|
                - **realMoney**: 总额
          - 类型: *Float*
        
        Example::
        
            {
                "realMoney": 1020.00
            }
            
    ### <I-C> countCusSalesPaymentForAmount

        统计销售款 , 状态为1(已付款)和2(已确认)
        
                |Requests:|
                :param salesPayment.orderId: 装修单号
        :type salesPayment.orderId: String
        
        Example::
        
            {
                "salesPayment.orderId": "1601010001"
            }
            
                |Returns:|
                - **realMoney**: 总额
          - 类型: *Float*
        
        Example::
        
            {
                "realMoney": 1020.00
            }
    
    ### <I-C> countCusServicePaymentForAmount

        统计服务款 , 状态为1(已付款)和2(已确认)
        
                |Requests:|
                :param servicePayment.orderId: 装修单号
        :type servicePayment.orderId: String
        
        Example::
        
            {
                "servicePayment.orderId": "1601010001"
            }
            
                |Returns:|
                - **realMoney**: 总额
          - 类型: *Float*
        
        Example::
        
            {
                "realMoney": 1020.00
            }

### 合同

## api.customer.ContractAction

        |DataType:|
        #### contract

    - **dcid**: 合同ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **contract**: 模版 , 类型: [contract](./data.html#api.communion.ContractAction.contract)
      - 类型: *Object*
    - **download**: 下载地址
      - 类型: *String*
    - **viewpdf**: 查看地址
      - 类型: *String*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **comsignTime**: 公司签时间
      - 类型: *Timestamp*
    - **cussignTime**: 客户签时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 初始 , 1: 已签 , 2: 失效 , 3: 归档 , 4: 归档(本地)
      - 类型: *Short*
    - **ishow**: 显示标识
      - 类型: *Short*
    
    ### <I> queryCusContract

        通过装修单号获取合同信息
        
                |Requests:|
                :param contract.orderId: 装修单号
        :type contract.orderId: String
    
    
        Example::
        
            {
                "contract.orderId": "1601010001"
            }
            
                |Returns:|
                - **contracts**: 合同信息列表 , 类型 *contract*
          - 类型: *List*
    
        Example::
        
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

### 图片

## api.customer.PictureAction

        |DataType:|
        #### picture

    - **name**: 文件名
      - 类型: *String*
    - **path**: 路径
      - 类型: *String*
    
    ### <I-C> queryCusDecorationPicture

        分页方式获取装修图片 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Requests:|
                - **orderId**: 装修单号
          - 类型: *String*

        Example::

            {
                "orderId": "1601010001"
            }

                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 图片信息列表 , 每条数据类型 *picture*
        :type paging.data: List
        
        Example::
        
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
            
    ### <I-C> queryCusConstructionDrawing

        分页方式获取工程图片 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Requests:|
                - **orderId**: 工程ID
          - 类型: *Long*
        - **schedule**: 施工进度
          - 类型: *Integer*

        Example::

            {
                "orderId": 1,
                "schedule": 1
            }

                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 图片信息列表 , 每条数据类型 *picture*
        :type paging.data: List
        
        Example::
        
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

### 工程

## api.customer.ConstructionAction

    #### construction

    - **cid**: 工程ID
      - 类型: *Long*
    - **createTime**: 创建时间
      - 类型: *Timestamp*

    #### constructer

    - **userId**: 人员编号
      - 类型: *String*
    - **userName**: 名称
      - 类型: *String*
    - **currentName**: 名称
      - 类型: *String*
    - **phone**: 电话
      - 类型: *String*
    - **schedule**: 施工节点
      - 类型: *Short*
    - **userPhoto**: 照片路径
      - 类型: *String*

    ### <I-C> queryCusConstruction

        通过装修单号获取工程信息
        
                |Requests:|
                - **orderId**: 装修单号
          - 类型: *String*
        
        Example::
        
            {
                "orderId": "1601010001"
            }
            
                |Returns:|
                - **construction**: 工程信息 , 类型 *construction*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "construction": {
                    "cid": 1,
                    "createTime": "2016-01-01 00:00:00"
                },
                ...
            }

    ### <I-C> queryCusConstructionSchedule

        通过装修单号获取施工环节信息
        
                |Requests:|
                - **orderId**: 装修单号
          - 类型: *String*
        
        Example::
        
            {
                "orderId": "1601010001"
            }
        
                |Returns:|
                - **constructionSchedules**: 施工环节信息列表 , 类型 *construction*
          - 类型: *List*
        
        Example::
        
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

    ### <I-C> queryCusConstructer

        分页方式通过装修单号获取工人信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Requests:|
                - **unionId**: 联合ID
          - 类型: *String*
        - **orderId**: 装修单号
          - 类型: *String*
        
        Example::
        
            {
                "unionId": "SDJ4SDF5",
                "orderId": "1601010001"
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 图片信息列表 , 每条数据类型 [user](./user.html#api.personel.UserAction.user)
        :type paging.data: List
        
        Example::
        
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
            
### 审批

## api.customer.ApprovalAction

        |DataType:|
        #### approval

    - **aid**: 审批ID
      - 类型: *Long*
    - **type**: 类型 
      - 类型: *Short*
    - **status**: 状态 , 包括: 0: 初始 , 1: 审批通过 , 2: 审批拒绝 , 3: 审批中 , 4: 发起失败 , 5: 客户确认
      - 类型: *Short*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **approvalTime**: 审批时间
      - 类型: *Timestamp*
    - **contents**: 说明信息 , 系统自动生成
      - 类型: *String*
    - **comment**: 备注
      - 类型: *String*
    - **annotate**: 批注
      - 类型: *String*
    
    ### <I-C> queryApproval

        获取审批信息
        
                |Requests:|
                :param approval.aid: 审批ID
        :type approval.aid: String
        
        Example::
        
            {
                "approval.aid": 1
            }
            
                |Returns:|
                - **approval**: 审批信息
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I-C> confirmApproval

        确认审批信息
        
                |Requests:|
                :param approval.aid: 审批ID
        :type approval.aid: String
        
        Example::
        
            {
                "approval.aid": 1
            }

## 功能

### 反馈

反馈信息管理

## api.customer.FeedbackAction

        |DataType:|
        #### feedback

    - **fid**: 反馈ID
      - 类型: *Long*
    - **unionId**: 联合ID
      - 类型: *String*
    - **orderId**: 装修单号
      - 类型: *String*
    - **phone**: 电话
      - 类型: *String*
    - **picture**: 图片
      - 类型: *String*
    - **content**: 说明
      - 类型: *String*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **type**: 类型, 0: 反馈 , 1: 投诉 , 2: 维修
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*
    
    ### <I> pageFeedback

        分页方式获取反馈信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ . 
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 反馈信息列表 , 每条数据类型 *feedback*
        :type paging.data: List
        
        Example::
        
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

    ### <I-C> addFeedback

        添加反馈
        
                |Requests:|
                :param feedback.unionId: 联合ID
        :type feedback.unionId: String
        :param feedback.orderId: 装修单号
        :type feedback.orderId: String
        :param feedback.phone: 电话
        :type feedback.phone: String
        :param feedback.picture: 图片
        :type feedback.picture: String
        :param feedback.content: 反馈信息
        :type feedback.content: String
        :param feedback.type: 类型
        :type feedback.type: Short
        
        :param feedback.drawings: 图片列表
        :type feedback.drawings: List
        
        Example::
        
            {
                "feedback.unionId": "SDJ4SDF5",
                "feedback.orderId": "1601010001",
                "feedback.phone": "13800254521",
                "feedback.picture": "bd9f4736d3334afd87318c5c24fe6c44.jpg",
                "feedback.content": "反馈信息",
                "feedback.type": 0,
                "feedback.drawings[0]": "bd9f4736d3334afd87318c5c24fe6c44.jpg"
            }

## api.customer.FeedbackDrawingAction

        |DataType:|
        #### feedbackDrawing

    - **fdid**: 图片ID
      - 类型: *Long*
    - **fid**: 反馈ID
      - 类型: *String*
    - **path**: 路径
      - 类型: *String*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **status**: 状态
      - 类型: *Short*
    
    ### <I-C> queryFeedbackDrawing

                |Requests:|
                :param feedback.fid: 反馈ID
        :type feedback.fid: Long
        
        Example::
        
            {
                "feedback.fid": 1
            }

                |Returns:|
                - **feedbackDrawings**: 图片信息列表 , 每条数据类型 *feedbackDrawing*
          - 类型: *List*
        
        Example::
        
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

    ### <I> addFeedbackDrawing

                |Requests:|
                :param feedbackDrawing.fid: 反馈ID
        :type feedbackDrawing.fid: Long
        :param feedbackDrawing.path: 地址
        :type feedbackDrawing.path: String
        
        Example::
        
            {
                "feedbackDrawing.fid": 1,
                "feedbackDrawing.fid": "bd9f4736d3334afd87318c5c24fe6c44.jpg"
            }

### 调研

## api.customer.SurveyAction

        |DataType:|
        #### survey

    - **sid**: 调研ID
      - 类型: *Long*
    - **stid**: 模版ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **sender**: 推送人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **finisher**: 完成人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **sendTime**: 推送时间
      - 类型: *Timestamp*
    - **handleTime**: 处理时间
      - 类型: *Timestamp*
    - **finishTime**: 完成时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 初始, 1: 推送 , 2: 处理 , 3: 完成
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*
    
    - **items**: 项目列表 , 每条数据类型 [surveyItem](./customer.html#api.customer.SurveyAction.surveyItem)
      - 类型: *List*
    
    #### surveyItem

    - **siid**: 项目ID
      - 类型: *Long*
    - **sid**: 调研ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **type**: 类型 , 0: 文本 , 1: 输入框 , 2: 单选 , 3: 多选
      - 类型: *Short*
    - **content**: 内容
      - 类型: *String*
    
    - **options**: 选项列表 , 每条数据类型 [surveyOption](./customer.html#api.customer.SurveyAction.surveyOption)
    
    #### surveyOption

    - **soid**: 选项ID
      - 类型: *Long*
    - **siid**: 项目ID
      - 类型: *Long*
    - **sid**: 调研ID
      - 类型: *Long*
    - **title**: 标题
      - 类型: *String*
    - **checked**: 标识 , 0: 已选 , 1: 未选
      - 类型: *Short*
    
    ### <I> pageSurvey

        分页方式获取调研模版信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 调研列表 , 每条数据类型 *survey*
        :type paging.data: List
        
        Example::
        
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

    ### <I> querySurveyByOrderId

        通过装修单号获取调研信息
        
                |Requests:|
                :param survey.orderId: 装修单号
        :type survey.orderId: String
        
        Example::
        
            {
                "survey.orderId": "1601010001"
            }

                |Returns:|
                - **surveys**: 调研信息列表 , 每条数据类型 *survey*
          - 类型: *List*
        
        Example::
        
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

    ### <I> querySurveyBySid

        通过装修单号获取调研信息
        
                |Requests:|
                :param survey.sid: 调研ID
        :type survey.sid: Long
        
        Example::
        
            {
                "survey.sid": 1
            }

                |Returns:|
                - **survey**: 调研 , 数据类型 *survey*
          - 类型: *Object*
        
        Example::
        
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

    ### <I> makeSurvey

        生成调研
        
        判断调研模版是否存在 , 不存在 , 错误信息 **130096 调研模版不存在**
        
                |Requests:|
                :param survey.orderId: 装修单号
        :type survey.orderId: String
        :param survey.stid: 模版ID
        :type survey.stid: Long
        
        Example::
        
            {
                "survey.orderId": "1601010001",
                "survey.stid": 1
            }

    ### <I> sendSurvey

        推送调研
        
        判断调研是否存在 , 不存在 , 错误信息 **330058 调研不存在**
        
        判断调研装修是否为0(初始) , 其他状态 , 错误信息 **330059 调研状态不可操作**
        
        更新状态为1(推送) , 更新推送时间/推送人
        
                |Requests:|
                :param survey.sid: 调研ID
        :type survey.sid: Long
        
        Example::
        
            {
                "survey.sid": 1,
                
                "survey.items[0].siid": 1,
                "survey.items[0].content": "内容",
                
                "survey.items[0].options[0].soid": 1,
                "survey.items[0].options[0].checked": 1,
            }

    ### <I> handleSurvey

        执行调研
        
        判断调研是否存在 , 不存在 , 错误信息 **330058 调研不存在**
        
        判断调研装修是否为1(推送) , 其他状态 , 错误信息 **330059 调研状态不可操作**
        
        更新状态为2(处理) , 更新完成时间
        
                |Requests:|
                :param survey.sid: 调研ID
        :type survey.sid: Long
        
        :param survey.items[n].siid: 项目ID
        :type survey.items[n].siid: Long
        :param survey.items[n].content: 内容
        :type survey.items[n].content: String
        
        :param survey.items[n].options[n].soid: 选项ID
        :type survey.items[n].options[n].soid: Short
        :param survey.items[n].options[n].checked: 标识
        :type survey.items[n].options[n].checked: Short
        
        Example::
        
            {
                "survey.sid": 1,
                
                "survey.items[0].siid": 1,
                "survey.items[0].content": "内容",
                
                "survey.items[0].options[0].soid": 1,
                "survey.items[0].options[0].checked": 1,
            }

    ### <I> finishSurvey

        完成
        
        判断调研是否存在 , 不存在 , 错误信息 **330058 调研不存在**
        
        判断调研装修是否为2(处理) , 其他状态 , 错误信息 **330059 调研状态不可操作**
        
        更新状态为3(完成) , 更新完成时间/完成人
        
                |Requests:|
                :param survey.sid: 调研ID
        :type survey.sid: Long
        
        Example::
        
            {
                "survey.sid": 1
            }

### 会员

会员信息管理

## api.customer.EmemberAction

        |DataType:|
        #### emember

    - **emid**: 电子会员ID
      - 类型: *Long*
    - **unionId**: 联合ID
      - 类型: *String*
    - **no**: 会员编号
      - 类型: *String*
    - **name**: 姓名
      - 类型: *String*
    - **phone**: 电话
      - 类型: *String*
    - **address**: 地址
      - 类型: *String*
    - **unionId**: 联合ID
      - 类型: *String*
    - **ticket**: 票号
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    
    ### <I> pageEmember

        分页方式获取电子会员信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ . 
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 电子会员信息列表 , 每条数据类型 *emember*
        :type paging.data: List
        
        Example::
        
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
    
    ### <I-C> queryEmember

        通过unionId获取电子会员信息
        
                |Requests:|
                - **unionId**: 联合ID
          - 类型: *String*
        
        Example::

            {
                "unionId": "SDJ4SDF5"
            }
        
                |Returns:|
                - **emember**: 电子会员信息 , 类型 :[emember](./customer.html#api.customer.EmemberAction.emember)
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I-C> addEmember

        添加电子会员

                |Requests:|
                :param emember.unionId: 联合ID
        :type emember.unionId: String
        :param emember.name: 姓名
        :type emember.name: String
        :param emember.phone: 电话
        :type emember.phone: String
        :param emember.address: 地址
        :type emember.address: String
        :param emember.ticket: 票号
        :type emember.ticket: String
        - **securityCode**: 验证码
          - 类型: *String*
        - **verifyCode**: 校验码
          - 类型: *String*

        Example::

            {
                "emember.unionId": "SDJ4SDF5",
                "emember.name": "客户",
                "emember.phone": "138xxxx2738",
                "emember.address": "广场一期 1#1-1-1",
                "emember.ticket": "37487263472",
                "securityCode": "1234",
                "verifyCode": "1234"
            }

    ### <I-C> deleteEmember

        删除电子会员
        
                |Requests:|
                :param emember.emid: 会员ID
        :type emember.emid: Long

        Example::

            {
                "emember.emid": 1
            }

### 群享

## api.customer.GroupAction

        |DataType:|
        #### group

    - **gid**: 群ID
      - 类型: *Long*
    - **opengid**: 群编号
      - 类型: *String*
    - **orderId**: 装修单号
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **content**: 说明
      - 类型: *String*
    
    #### groupUser

    - **guid**: 群用户Id
      - 类型: *Long*
    - **opengid**: 群Id
      - 类型: *String*
    - **user**: 人员 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    
    ### <I-C> pageGroup

        分页方式获取群信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ . 
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 群信息列表 , 每条数据类型 *group*
        :type paging.data: List
        
        Example::
        
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

    ### <I-C> queryGroup

        通过opengid获取群信息
        
                |Requests:|
                :param group.opengid: 群编号
        :type group.opengid: String
        
        Example::
        
            {
                "group.opengid": "0KJ6nAsYbfKA_hsRHB2MUgs"
            }
            
                |Returns:|
                - **group**: 群信息 , 类型 :[group](./customer.html#api.customer.GroupAction.group)
          - 类型: *Object*
        
        Example::
        
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
            
    ### <I> updateGroup

        更新群信息
        
                |Requests:|
                :param group.gid: 群ID
        :type group.gid: String
        :param group.name: 名称
        :type group.name: String
        :param group.content: 说明
        :type group.content: String
        
        Example::
        
            {
                "group.gid": 1,
                "group.name": "名称",
                "group.content": "说明",
            }
            
    ### <I-C> bindGroup

        绑定群信息
        
                |Requests:|
                - **unionId**: 联合ID
          - 类型: *String*
        :param group.opengid: 群编号
        :type group.opengid: String
        :param group.orderId: 装修单号
        :type group.orderId: String
        
        Example::
        
            {
                "unionId": "SDJ4SDF5",
                "group.opengid": "0KJ6nAsYbfKA_hsRHB2MUgs",
                "group.orderId": "1601010001",
            }
            
    ### <I> unbindGroup

        解绑群信息
        
                |Requests:|
                :param group.gid: 群编号
        :type group.gid: String
        
        Example::
        
            {
                "group.gid": 1
            }

### 钉群

## api.customer.DroupAction

        |DataType:|
        #### droup

    - **did**: 钉群ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **decoration**: 装修单 , 类型 [decoration](./decoration.html#api.decoration.decorationAction.decoration)
      - 类型: *Object*
    - **chatId**: 会话ID
      - 类型: *String*
    - **openId**: 会话ID
      - 类型: *String*
    - **type**: 类型
      - 类型: *Short*
    - **status**: 状态 , 0: 有效 , 1: 无效
      - 类型: *Short*
    - **isHandle**: 是否处理 , 0: 客户 , 1: 处理
      - 类型: *Short*
    - **isRead**: 是否已读 , 0: 已读 , 1: 未读
      - 类型: *Short*
    - **updateTime**: 更新时间
      - 类型: *Timestamp*
    - **handleTime**: 处理时间
      - 类型: *Timestamp*
    - **company**: 公司ID
      - 类型: *Integer*
    
    ### <I-C> pageDroup

        分页方式获取钉群 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter) . 
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 钉群信息列表 , 每条数据类型 *droup*
        :type paging.data: List
        
        Example::
        
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

    ### <I> queryDroup

        通过装修单号或者会话ID查询钉群信息
        
                |Requests:|
                :param droup.decoration.orderId: 装修单号
        :type droup.decoration.orderId: String
        :param droup.chatId: 会话ID
        :type droup.chatId: String
        
        Example::
        
            {
                "droup.decoration.orderId:": "1601010001"
            }

                |Returns:|
                - **oaleses**: 钉群信息列表 , 每条数据类型 *oales*
          - 类型: *List*
        
        Example::
        
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

    ### <I> bindDroup

        绑定
        
        判断归属装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
                |Requests:|
                :param droup.decoration.orderId: 装修单号
        :type droup.decoration.orderId: String
        :param droup.chatId: 会话ID
        :type droup.chatId: String
        :param droup.openId: 会话ID
        :type droup.openId: String
        :param droup.type: 类型
        :type droup.type: Short
        
        Example::
        
            {
                "droup.decoration.orderId:": "1601010001",
                "droup.chatId": "",
                "droup.openId": "",
                "droup.type": 1
            }

    ### <I> updateDroup

        更新
        
                |Requests:|
                :param droup.did: 钉群ID
        :type droup.did: Long
        :param droup.isRead: 是否已读
        :type droup.isRead: Short
        
        Example::
        
            {
                "droup.did:": 1,
                "droup.isRead": 0
            }

    ### <I> deleteDroup

        删除
        
                |Requests:|
                :param droup.did: 钉群ID
        :type droup.did: Long
        
        Example::
        
            {
                "droup.did:": 1
            }

### 对话

## api.customer.ConversationAction

        |DataType:|
        #### conversation

    - **cid**: 对话ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **type**: 类型 , 0: 文本, 1: 图片, 2: 应用
      - 类型: *Short*
    - **atttype**: 业务类型 , 0: 请求, 1: 响应
      - 类型: *Short*
    - **contype**: 内容类型 , 0: 客户, 1: 装修, 2: 主材, 3: 工程, 4: 款项, 5: 其他
      - 类型: *Short*
    - **content**: 内容
      - 类型: *String*
    - **path**: 地址
      - 类型: *String*
    - **filesize**: 文件大小
      - 类型: *Integer*
    - **width**: 宽度
      - 类型: *Integer*
    - **height**: 高度
      - 类型: *Integer*
    - **focuser**: 关注人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 初始 , 1: 已读 , 2: 删除
      - 类型: *Short*
    

    ### <I-C> pageConversation

        分页方式获取对话 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter) . 
        
                |Requests:|
                :param conversation.orderId: 装修单号
        :type conversation.orderId: String
        
        Example::
        
            {
                "conversation.orderId:": "1601010001"
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 对话信息列表 , 每条数据类型 *conversation*
        :type paging.data: List
        
        Example::
        
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

    ### <I-C> requestConversation

        请求
        
        判断归属装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        判断钉群是否存在 , 不存在 , 错误信息 **330067 群信息不存在**
        
        业务类型默认为0(请求) , 代表客户发起
        
        如果钉群处理状态非0(客户) , 更新钉群处理状态为0(客户) , 更新钉群更新时间
        
                |Requests:|
                :param conversation.orderId: 装修单号
        :type conversation.orderId: String
        :param conversation.name: 名称
        :type conversation.name: String
        :param conversation.type: 类型
        :type conversation.type: Short
        :param conversation.contype: 内容类型
        :type conversation.contype: Short
        :param conversation.content: 内容
        :type conversation.content: String
        :param conversation.path: 路径
        :type conversation.path: String
        :param conversation.filesize: 文件大小
        :type conversation.filesize: Integer
        :param conversation.width: 宽度
        :type conversation.width: Integer
        :param conversation.height: 高度
        :type conversation.height: Integer
        :param conversation.focuser.userId: 关注人ID
        :type conversation.focuser.userId: String
        
        Example::
        
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

    ### <I-C> responseConversation

        响应
        
        判断归属装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        判断钉群是否存在 , 不存在 , 错误信息 **330067 群信息不存在**
        
        业务类型默认为1(相应) , 代表公司员工发起
        
        如果钉群处理状态非1(处理) , 更新钉群处理状态为1(处理) , 更新钉群处理时间
        
                |Requests:|
                :param conversation.orderId: 装修单号
        :type conversation.orderId: String
        :param conversation.name: 名称
        :type conversation.name: String
        :param conversation.type: 类型
        :type conversation.type: Short
        :param conversation.contype: 内容类型
        :type conversation.contype: Short
        :param conversation.content: 内容
        :type conversation.content: String
        :param conversation.path: 路径
        :type conversation.path: String
        :param conversation.filesize: 文件大小
        :type conversation.filesize: Integer
        :param conversation.width: 宽度
        :type conversation.width: Integer
        :param conversation.height: 高度
        :type conversation.height: Integer
        
        Example::
        
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

    ### <I> deleteConversation

        删除
        
                |Requests:|
                :param conversation.cid: 对话ID
        :type conversation.cid: Long
        
        Example::
        
            {
                "conversation.cid:": 1
            }
            
### 服务圈

## api.customer.CircleAction

        |DataType:|
        #### circle

    - **cid**: 圈ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **address**: 地址
      - 类型: *String*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **content**: 内容
      - 类型: *String*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **praise**: 赞数
      - 类型: *Integer*
    
    - **drawings**: 图片信息列表 , 每条数据类型 *circleDrawing*
      - 类型: *List*
    
    #### circleDrawing

    - **cdid**: 图片ID
      - 类型: *Long*
    - **cid**: 圈ID
      - 类型: *Long*
    - **path**: 图片路径
      - 类型: *String*
    
    ### <I-C> pageCircleByUnionId

        分页方式获取服务圈 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter) . 
        
        通过联合主键归属的装修单 , 分页方式查询服务圈信息
        
                |Requests:|
                - **unionId**: 联合主键
          - 类型: *String*
        
        Example::
        
            {
                "unionId": "SDJ4SDF5"
            }
        
                |Returns:|
                - **circles**: 群信息 , 类型 *circle*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I-C> pageCircleByOrderId

        分页方式获取服务圈 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter) . 
        
        通过装修单号归属的装修单 , 分页方式查询服务圈信息
        
                |Requests:|
                :param circle.orderId: 装修单号
        :type circle.orderId: String
        
        Example::
        
            {
                "circle.orderId": "1601010001"
            }
        
                |Returns:|
                - **circles**: 群信息 , 类型 *circle*
          - 类型: *List*
        
        Example::
        
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
            
    ### <I-C> addCircle

        添加服务圈信息
        
                |Requests:|
                :param circle.orderId: 装修单号
        :type circle.orderId: String
        :param circle.userId: 创建人编号
        :type circle.userId: String
        :param circle.address: 地址
        :type circle.address: String
        :param circle.content: 内容
        :type circle.content: String
        :param circle.drawings[n].path: 图片
        :type circle.drawings[n].path: String
        
        Example::
        
            {
                "circle.orderId": "1601010001",
                "circle.userId": "U001",
                "circle.address": "地址",
                "circle.content": "说明内容",
                "circle.drawings[0].path": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png"
            }
            
    ### <I-C> updateCircleForPraise

        点赞
        
                |Requests:|
                :param circle.cid: 服务圈ID
        :type circle.cid: Long
        
        Example::
        
            {
                "circle.cid": 1
            }

### 背景图

## api.customer.BackgroundAction

        |DataType:|
        #### background

    - **bid**: 背景图ID
      - 类型: *Long*
    - **unionId**: 联合主键
      - 类型: *String*
    - **path**: 图片路径
      - 类型: *String*
    
    ### <I-C> queryBackground

        通过联合主键查询背景图信息
    
                |Requests:|
                :param background.unionId: 联合主键
        :type background.unionId: String
        
        Example::
        
            {
                "background.unionId": "SDJ4SDF5"
            }
            
                |Returns:|
                - **background**: 背景图信息 , 类型 *background*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "background":{
                    "bid": 1,
                    "unionId": "SDJ4SDF5",
                    "path": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png"
                }
                ...
            }
            
    ### <I-C> updateBackground

        更新背景图信息
        
                |Requests:|
                :param background.unionId: 联合主键
        :type background.unionId: String
        :param background.path: 图片路径
        :type background.path: String
        
        Example::
        
            {
                "background.unionId": "SDJ4SDF5",
                "background.path": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png"
            }
