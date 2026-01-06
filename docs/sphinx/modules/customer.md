# customer 客户
## 客户

客户信息管理

## api.communion.CustomerAction

**数据类型**:

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

    ### `pageCustomer` <span style="color:gray">[内部]</span>

        分页方式获取客户信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  客户信息列表 , 每条数据类型 *customer*

        **示例**:{
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

    ### `queryCustomerById` <span style="color:gray">[内部]</span>

        通过客户编号获取客户信息

**请求参数**:

- **customer.id**:
  客户ID

        **示例**:{
                "customer.id": 1
            }

**返回参数**:

- **customer**: 客户信息 , 类型 *customer*
          - 类型: *object*

        **示例**:{
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

    ### `queryCustomerForName` <span style="color:gray">[内部]</span>

        通过拼音获取客户名信息

**请求参数**:

- **pinyinName**: 楼盘名拼音
          - 类型: *String*

        **示例**:{
                "pinyinName": "li"
            }

**返回参数**:

- **customers**: 客户信息列表 , 每条数据类型 *customer*
          - 类型: *List*
        - **autoFillList**: 客户名列表 , 每条数据类型String
          - 类型: *List*

        **示例**:{
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

    ### `queryCustomerForPhone` <span style="color:gray">[内部]</span>

        通过电话信息查询客户

**请求参数**:

- **customerPhone.cid**:
  客户ID

        **示例**:{
                "customerPhone.cid": 1
            }

**返回参数**:

- **customer**: 客户信息 , 类型 *customer*
          - 类型: *List*

        **示例**:{
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

    ### `queryCustomerPhoneByCid` <span style="color:gray">[内部]</span>

        通过客户ID获取对应的客户电话

**请求参数**:

- **customer.cid**:
  客户ID

        **示例**:{
                "customer.cid": 1
            }

**返回参数**:

- **customerPhones**: 客户电话信息列表 , 每条数据类型 *customerPhone*
          - 类型: *List*

        **示例**:{
                ...
                "customerPhones": [
                    {
                        "cpid": 1,
                        "cid": 1,
                        "phone": "137xxxx1876",
                    }
                ],
                ...

    ### `checkCustomerForPhone` <span style="color:gray">[内部]</span>

        检查客户电话信息

**请求参数**:

- **customer.phone**:
  客户电话

        **示例**:{
                "customer.phone": "136xxxx5452"
            }

**返回参数**:

- **customers**: 客户信息列表 , 每条数据类型 *customer*
          - 类型: *List*

        **示例**:{
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

    ### `addCustomer` <span style="color:blue">[自定义]</span>

        添加客户信息

**请求参数**:

- **customer.name**:
  客户名称
        - **customer.gender**:
  性别
        - **customer.identity**:
  身份证
        - **customer.officer**:
  军官证
        - **customer.passport**:
  护照
        - **customer.passhkm**:
  港澳通行证
        - **customer.qq**:
  QQ
        - **customer.wechat**:
  微信
        - **customer.email**:
  邮件
        - **customer.career**:
  职业
        - **customer.address**:
  地址
        - **customer.relationshipType**:
  客户关系
        - **customer.type**:
  类型
        - **customer.companyNo**:
  公司编号
        - **customer.companyName**:
  公司名
        - **customer.companyAddr**:
  公司地址
        - **customer.companyPhone**:
  公司电话
        - **customer.companyBank**:
  开户行
        - **customer.companyBankno**:
  开户编号

        **示例**:{
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

    ### `existCustomer` <span style="color:blue">[自定义]</span>

        通过电话判断客户是否存在 , 不存在添加 , 存在返回客户信息

**请求参数**:

- **customer.name**:
  客户名称
        - **customer.gender**:
  性别
        - **customer.phone**:
  电话

**返回参数**:

- **customer**: 客户信息 , 类型 *customer*
          - 类型: *Object*

        **示例**:{
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

    ### `addCustomerPhone` <span style="color:blue">[自定义]</span>

        添加客户电话信息

**请求参数**:

- **customer.cid**:
  客户ID
        - **customerPhone.phone**:
  电话

        **示例**:{
                "customer.cid": 1,
                "customerPhone.phone": "153xxxx2938"
            }

    ### `updateCustomer` <span style="color:blue">[自定义]</span>

        更新客户信息

**请求参数**:

- **customer.no**:
  客户编号
        - **customer.name**:
  客户名称
        - **customer.gender**:
  性别
        - **customer.identity**:
  身份证
        - **customer.officer**:
  军官证
        - **customer.passport**:
  护照
        - **customer.passhkm**:
  港澳通行证
        - **customer.qq**:
  QQ
        - **customer.wechat**:
  微信
        - **customer.email**:
  邮件
        - **customer.career**:
  职业
        - **customer.address**:
  地址
        - **customer.relationshipType**:
  客户关系
        - **customer.type**:
  类型
        - **customer.companyNo**:
  公司编号
        - **customer.companyName**:
  公司名
        - **customer.companyAddr**:
  公司地址
        - **customer.companyPhone**:
  公司电话
        - **customer.companyBank**:
  开户行
        - **customer.companyBankno**:
  开户编号

        **示例**:{
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

    ### `updateCustomerForBase` <span style="color:blue">[自定义]</span>

        更新客户信息

**请求参数**:

- **customer.cid**:
  客户ID
        - **customer.companyNo**:
  公司编号
        - **customer.companyName**:
  公司名
        - **customer.companyAddr**:
  公司地址
        - **customer.companyPhone**:
  公司电话
        - **customer.companyBank**:
  开户行
        - **customer.companyBankno**:
  开户编号

        **示例**:{
                "customer.cid": "1501010001",
                "customer.companyNo": "",
                "customer.companyName": "",
                "customer.companyAddr": "",
                "customer.companyPhone": "",
                "customer.companyBank": "",
                "customer.companyBankno": ""
            }

    ### `updateCustomerPhoneForStatus` <span style="color:blue">[自定义]</span>

        更新客户电话状态

        判断客户电话是否存在 , 不存在 , 错误信息 **130021 客户电话不存在**

**请求参数**:

- **customerPhone.cpid**:
  客户电话ID
        - **customerPhone.status**:
  状态

        **示例**:{
                "customerPhone.cpid": 1,
                "customerPhone.status": 1
            }

    ### `updateCustomerPhoneForDefault` <span style="color:blue">[自定义]</span>

        更新客户电话默认状态

        判断客户电话是否存在 , 不存在 , 错误信息 **130021 客户电话不存在**

        判断更新客户电话是否已经存在同时标识为默认电话 , 错误信息 **130022 客户电话已使用**

        判断客户电话状态 , 未启用不可设置为默认 , 错误信息 **130023 客户电话未启用**

**请求参数**:

- **customerPhone.cpid**:
  客户电话ID
        - **customerPhone.defaults**:
  默认

        **示例**:{
                "customerPhone.cpid": 1,
                "customerPhone.defaults": 1
            }

    ### `registCustomer` <span style="color:blue">[自定义]</span>

        注册客户

        判断客户是否存在 , 不存在 , 错误信息 **130002 客户信息不存在**

        判断客户状态是否为0(初始) , 其他状态 , 错误信息 **130028 客户状态不可操作**

**请求参数**:

- **customer.cid**:
  客户ID

        **示例**:{
                "customer.cid": 1
            }

    ### `authCustomer` <span style="color:blue">[自定义]</span>

        认证客户

        通过第三方接口获取认证地址

        客户存储认证地址 , 如果不存在 , 更新客户对应的认证地址

        判断客户是否存在 , 不存在 , 错误信息 **130002 客户信息不存在**

        判断客户状态是否为0(初始) , 其他状态 , 错误信息 **130028 客户状态不可操作**

**请求参数**:

- **customer.cid**:
  客户ID

        **示例**:{
                "customer.cid": 1
            }

    ### `confirmCustomer` <span style="color:blue">[自定义]</span>

        确认客户

        通过第三方接口更新客户的真实信息

        判断客户是否存在 , 不存在 , 错误信息 **130002 客户信息不存在**

        判断客户状态是否为0(初始) , 其他状态 , 错误信息 **130028 客户状态不可操作**

        更新客户信息 , 包括姓名/电话/性别/地址等

        更新客户状态为1(认证)

**请求参数**:

- **customer.cid**:
  客户ID

        **示例**:{
                "customer.cid": 1
            }

    ### `signateCustomer` <span style="color:blue">[自定义]</span>

        客户签名

        通过第三方接口更新客户签名信息

        判断客户是否存在 , 不存在 , 错误信息 **130002 客户信息不存在**

**请求参数**:

- **customer.cid**:
  客户ID

        **示例**:{
                "customer.cid": 1
            }

    ### `resetCustomer` <span style="color:blue">[自定义]</span>

        客户重置

        判断客户是否存在 , 不存在 , 错误信息 **130002 客户信息不存在**

        判断客户状态是否为0(初始) , 其他状态 , 错误信息 **130028 客户状态不可操作**

**请求参数**:

- **customer.cid**:
  客户ID

        **示例**:{
                "customer.cid": 1
            }

## 记录

客户信息管理

## api.communion.CustomerRecordAction

**数据类型**:

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

    ### `pageCustomerRecord` <span style="color:gray">[内部]</span>

        分页方式获取客户记录信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  客户记录列表 , 每条数据类型 *customerRecord*

        **示例**:{
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

**请求参数**:

- **customerRecord.cid**:
  客户ID

        **示例**:{
                "customerRecord.cid": 1
            }

**返回参数**:

- **customerRecords**: 客户记录信息列表 , 每条数据类型 *customerRecord*
          - 类型: *List*

        **示例**:{
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

**数据类型**:

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

    ### `queryCppoint` <span style="color:gray">[内部]</span>

        获取客户积分信息

**请求参数**:

- **cppoint.cid**:
  客户ID

        **示例**:{
                "cppoint.cid": 1
            }

**返回参数**:

- **cppoint**: 积分信息 , 类型 *cppoint*
          - 类型: *Object*

        **示例**:{
                "cppoint": {
                    "cpid": 1,
                    "cid": 1,
                    "dpoint": 0,
                    "spoint": 0
                }
            }

    ### `queryCppointRecord` <span style="color:gray">[内部]</span>

        获取客户积分记录

**请求参数**:

- **cppoint.cid**:
  客户ID

        **示例**:{
                "cppoint.cid": 1
            }

**返回参数**:

- **cppointRecords**: 积分记录信息列表 , 每条数据类型 *cppointRecord*
          - 类型: *List*

        **示例**:{
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

    ### `createCppoint` <span style="color:gray">[内部]</span>

        添加客户积分

        判断客户积分是否存在 , 已存在 , 错误信息 **330048 积分已存在**

**请求参数**:

- **cppoint.cid**:
  客户ID

        **示例**:{
                "cppoint.cid": 1
            }

    ### `addupCppoint` <span style="color:gray">[内部]</span>

        累计客户积分

        判断客户积分是否存在 , 不存在 , 错误信息 **330047 积分不存在**

        生成客户积分记录

**请求参数**:

- **cppoint.cid**:
  客户ID
        - **cppoint.dpoint**:
  装修积分
        - **cppoint.spoint**:
  销售积分

        **示例**:{
                "cppoint.cid": 1,
                "cppoint.spoint": 1000
            }

    ### `useupCppoint` <span style="color:gray">[内部]</span>

        消耗客户积分

        判断客户积分是否存在 , 不存在 , 错误信息 **330047 积分不存在**

        判断客户积分是否满足操作积分 , 积分不足 , 错误信息 **330049 积分不足**

        生成客户积分记录

**请求参数**:

- **cppoint.cid**:
  客户ID
        - **cppoint.dpoint**:
  装修积分
        - **cppoint.spoint**:
  销售积分

        **示例**:{
                "cppoint.cid": 1,
                "cppoint.dpoint": 1000
            }

## 画像

## api.customer.CustomerProfileAction

**数据类型**:

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

    ### `pageCustomerProfile` <span style="color:gray">[内部]</span>

        分页方式获取客户画像信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  调研列表 , 每条数据类型 *customerProfile*

        **示例**:{
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

    ### `queryCustomerProfileByOrderId` <span style="color:gray">[内部]</span>

        通过装修单号获取客户画像信息

**请求参数**:

- **customerProfile.orderId**:
  装修单号

        **示例**:{
                "customerProfile.orderId": "1601010001"
            }

**返回参数**:

- **customerProfile**: 客户画像 , 类型 *customerProfile*
          - 类型: *Object*

        **示例**:{
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

    ### `queryCustomerProfileByCpid` <span style="color:gray">[内部]</span>

        通过客户画像ID获取信息

**请求参数**:

- **customerProfile.cpid**:
  调研ID

        **示例**:{
                "customerProfile.cpid": 1
            }

**返回参数**:

- **customerProfile**: 客户画像 , 数据类型 *customerProfile*
          - 类型: *Object*

        **示例**:{
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

    ### `makeCustomerProfile` <span style="color:gray">[内部]</span>

        生成客户画像

        判断模版是否存在 , 不存在 , 错误信息 **130096 模版不存在**

**请求参数**:

- **customerProfile.cid**:
  客户ID
        - **customerProfile.orderId**:
  装修单号
        - **customerProfile.tid**:
  模版ID

        **示例**:{
                "customerProfile.cid": 1,
                "customerProfile.orderId": "1601010001",
                "customerProfile.tid": 1
            }

    ### `handleCustomerProfile` <span style="color:gray">[内部]</span>

        更新客户画像

        判断客户画像是否存在 , 不存在 , 错误信息 **330087 客户画像不存在**

**请求参数**:

- **customerProfile.cpid**:
  调研ID

        - **customerProfile.items[n].cpiid**:
  项目ID
        - **customerProfile.items[n].content**:
  内容

        - **customerProfile.items[n].options[n].cpoid**:
  选项ID
        - **customerProfile.items[n].options[n].checked**:
  标识

        **示例**:{
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

**数据类型**:

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

    ### `pageCustomerDeptRule` <span style="color:gray">[内部]</span>

        分页方式获取客户部门规则信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  客户人员规则信息列表 , 每条数据类型 *customerDeptRule*

        **示例**:{
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

    ### `queryCustomerDeptRule` <span style="color:gray">[内部]</span>

        通过部门ID获取部门规则

**请求参数**:

- **customerDeptRule.did**:
  部门ID
        - **customerDeptRule.type**:
  类型

        **示例**:{
                "customerDeptRule.did": 1,
                "customerDeptRule.type": 1
            }

**返回参数**:

- **customerDeptRules**: 客户人员规则信息列表 , 每条数据类型 *customerDeptRule*
          - 类型: *List*

        **示例**:{
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

    ### `addCustomerDeptRule` <span style="color:gray">[内部]</span>

        添加客户部门规则

**请求参数**:

- **customerDeptRule.did**:
  部门ID
        - **customerDeptRule.type**:
  类型
        - **customerDeptRule.atttype**:
  业务类型
        - **customerDeptRule.busitype.bdid**:
  业务类型ID
        - **customerDeptRule.focus**:
  聚焦类型

        **示例**:{
                "customerDeptRule.did": 1,
                "customerDeptRule.type": 0,
                "customerDeptRule.atttype": 0,
                "customerDeptRule.busitype.bdid": 0,
                "customerDeptRule.focus": 0
            }

    ### `deleteCustomerDeptRule` <span style="color:gray">[内部]</span>

        删除部门规则

**请求参数**:

- **customerDeptRule.cdrid**:
  部门ID

        **示例**:{
                "customerDeptRule.cdrid": 1
            }

### 人员规则

设计人员规则配置信息

## api.customer.CustomerUserRuleAction

**数据类型**:

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

    ### `pageCustomerUserRule` <span style="color:gray">[内部]</span>

        分页方式获取客户人员规则信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  客户人员规则信息列表 , 每条数据类型 *customerUserRule*

        **示例**:{
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

    ### `queryCustomerUserRule` <span style="color:gray">[内部]</span>

        获取人员规则

**请求参数**:

- **customerUserRule.user.uid**:
  人员ID

        **示例**:{
                "customerUserRule.user.uid": 1
            }

**返回参数**:

- **customerUserRule**: 人员规则
          - 类型: *Object*

        **示例**:{
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

    ### `addCustomerUserRule` <span style="color:gray">[内部]</span>

        添加客户人员规则

**请求参数**:

- **customerUserRule.user.uid**:
  人员ID
        - **customerUserRule.period**:
  周期

        - **customerUserRule.measureNum**:
  量尺数
        - **customerUserRule.contractNum**:
  签单数
        - **customerUserRule.contractPrice**:
  签单额
        - **customerUserRule.predisPrice**:
  折前额
        - **customerUserRule.materialPrice**:
  主材额
        - **customerUserRule.designPrice**:
  设计费

        **示例**:{
                "customerUserRule.user.uid": 1,
                "customerUserRule.period": "201601",

                "customerUserRule.measureNum": 0,
                "customerUserRule.contractNum": 0,
                "customerUserRule.predisPrice": 0,
                "customerUserRule.contractPrice": 0,
                "customerUserRule.materialPrice": 0,
                "customerUserRule.designPrice": 0
            }

    ### `updateCustomerUserRule` <span style="color:gray">[内部]</span>

        更新客户人员规则

**请求参数**:

- **customerUserRule.curid**:
  规则ID
        - **customerUserRule.user.uid**:
  人员ID
        - **customerUserRule.period**:
  周期

        - **customerUserRule.measureNum**:
  量尺数
        - **customerUserRule.contractNum**:
  签单数
        - **customerUserRule.contractPrice**:
  签单额
        - **customerUserRule.predisPrice**:
  折前额
        - **customerUserRule.materialPrice**:
  主材额
        - **customerUserRule.designPrice**:
  设计费

        **示例**:{
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

    ### `updateCustomerUserRuleForStatus` <span style="color:gray">[内部]</span>

        更新客户人员规则状态

**请求参数**:

- **customerUserRule.curid**:
  规则ID
        - **customerUserRule.status**:
  状态

        **示例**:{
                "customerUserRule.curid": 1,
                "customerUserRule.status": 0
            }

    ### `disableCustomerUserRule` <span style="color:gray">[内部]</span>

        禁用人员规则

    ### `queryCustomerUserRuleItem` <span style="color:gray">[内部]</span>

    ### `addCustomerUserRuleItem` <span style="color:gray">[内部]</span>

    ### `deleteCustomerUserRuleItem` <span style="color:gray">[内部]</span>

### 保护规则

装修单转换保护规则配置信息

## api.customer.CustomerProtectRuleAction

**数据类型**:

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

    ### `pageCustomerProtectRule` <span style="color:gray">[内部]</span>

        分页方式获取客户保护规则信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  客户保护规则信息列表 , 每条数据类型 *customerProtectRule*

        **示例**:{
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

    ### `queryCustomerProtectRule` <span style="color:gray">[内部]</span>

        获取客户保护规则

**请求参数**:

- **customerProtectRule.type**:
  类型
        - **customerProtectRule.uppval**:
  数值
        - **customerProtectRule.lowval**:
  数值
        - **customerProtectRule.days**:
  天数

        **示例**:{
                "customerProtectRule.type": 1,
                "customerProtectRule.uppval": 1,
                "customerProtectRule.lowval": 1,
                "customerProtectRule.days": 1
            }

**返回参数**:

- **customerProtectRules**: 客户保护规则信息列表 , 每条数据类型 *customerProtectRule*
          - 类型: *List*

        **示例**:{
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

    ### `addCustomerProtectRule` <span style="color:gray">[内部]</span>

        添加客户保护规则

**请求参数**:

- **customerProtectRule.title**:
  标题
        - **customerProtectRule.type**:
  类型
        - **customerProtectRule.uppval**:
  数值
        - **customerProtectRule.lowval**:
  数值
        - **customerProtectRule.days**:
  天数

        **示例**:{
                "customerProtectRule.title": "标题",
                "customerProtectRule.type": 0,
                "customerProtectRule.uppval": 0,
                "customerProtectRule.lowval": 0,
                "customerProtectRule.days": 0
            }

    ### `deleteCustomerProtectRule` <span style="color:gray">[内部]</span>

        删除客户保护规则

**请求参数**:

- **customerProtectRule.cprid**:
  ID

        **示例**:{
                "customerProtectRule.cprid": 1
            }

### 公司规则

装修单分配公司规则配置信息

## api.customer.CustomerCompanyRuleAction

**数据类型**:

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

    ### `pageCustomerCompanytRule` <span style="color:gray">[内部]</span>

        分页方式获取客户公司规则信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  客户公司规则信息列表 , 每条数据类型 *customerCompanyRule*

        **示例**:{
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

    ### `queryCustomerCompanyRule` <span style="color:gray">[内部]</span>

        获取客户保护规则

**请求参数**:

- **customerCompanyRule.uppval**:
  数值

        **示例**:{
                "customerCompanyRule.type": 1,
                "customerCompanyRule.value": 1,
                "customerCompanyRule.days": 1
            }

**返回参数**:

- **customerCompanyRules**: 客户公司规则信息列表 , 每条数据类型 *customerCompanyRule*
          - 类型: *List*

        **示例**:{
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

    ### `addCustomerCompanyRule` <span style="color:gray">[内部]</span>

        添加客户公司规则

**请求参数**:

- **customerCompanyRule.company.no**:
  编号
        - **customerCompanyRule.type**:
  类型
        - **customerCompanyRule.uppval**:
  起始值
        - **customerCompanyRule.lowval**:
  终止值

        **示例**:{
                "customerProtectRule.company.no": "SUSDONE09FUSEFU09ES",
                "customerProtectRule.type": 0,
                "customerProtectRule.value": 0,
                "customerProtectRule.days": 0
            }

    ### `deleteCustomerCompanyRule` <span style="color:gray">[内部]</span>

        删除客户公司规则

**请求参数**:

- **customerCompanyRule.ccrid**:
  规则ID

        **示例**:{
                "customerCompanyRule.ccrid": 1
            }

### 资源

## api.customer.CustomerSourceAction

**数据类型**:

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

    ### `pageCustomerSource` <span style="color:gray">[内部]</span>

        分页方式获取客户资源信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  客户资源列表 , 每条数据类型 *customerSource*

        **示例**:{
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

    ### `queryCustomerSource` <span style="color:gray">[内部]</span>

        通过客户机会ID获取信息

**请求参数**:

- **customerSource.csid**:
  资源ID

        **示例**:{
                "customerSource.csid": 1
            }

**返回参数**:

- **customerSource**: 客户机会
          - 类型: *Object*
        - **paging.data**:
  客户资源列表 , 每条数据类型 *customerSource*

        **示例**:{
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

    ### `addCustomerSource` <span style="color:gray">[内部]</span>

        添加客户资源

**请求参数**:

- **customerSource.name**:
  姓名
        - **customerSource.gender**:
  性别
        - **customerSource.phone**:
  电话
        - **customerSource.purpose**:
  目的
        - **customerSource.intention**:
  意向
        - **customerSource.price**:
  需求价格
        - **customerSource.grade**:
  客户等级

        - **customerSource.village.vid**:
  楼盘ID
        - **customerSource.houseNumber**:
  楼号
        - **customerSource.buildArea**:
  建筑面积
        - **customerSource.freeArea**:
  赠送面积
        - **customerSource.innerArea**:
  套内面积
        - **customerSource.totalArea**:
  总面积

        - **customerSource.source**:
  来源方
        - **customerSource.contact**:
  对接方
        - **customerSource.referOrderId**:
  推荐单号

        - **customerSource.comment**:
  备注

        **示例**:{
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

    ### `updateCustomerSource` <span style="color:gray">[内部]</span>

        更新客户资源

**请求参数**:

- **customerSource.csid**:
  资源ID
        - **customerSource.name**:
  姓名
        - **customerSource.gender**:
  性别
        - **customerSource.phone**:
  电话
        - **customerSource.purpose**:
  目的
        - **customerSource.intention**:
  意向
        - **customerSource.price**:
  需求价格
        - **customerSource.grade**:
  客户等级

        - **customerSource.village.vid**:
  楼盘ID
        - **customerSource.houseNumber**:
  楼号
        - **customerSource.buildArea**:
  建筑面积
        - **customerSource.freeArea**:
  赠送面积
        - **customerSource.innerArea**:
  套内面积
        - **customerSource.totalArea**:
  总面积

        - **customerSource.source**:
  来源方
        - **customerSource.contact**:
  对接方
        - **customerSource.referOrderId**:
  推荐单号

        - **customerSource.comment**:
  备注

        **示例**:{
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

    ### `updateCustomerSourceForStatus` <span style="color:gray">[内部]</span>

        更新客户资源状态

**请求参数**:

- **customerSource.csid**:
  资源ID
        - **customerSource.status**:
  状态

        **示例**:{
                "customerSource.csid": 1,
                "customerSource.status": 0
            }

    ### `issueCustomerSource` <span style="color:gray">[内部]</span>

        分配客户资源

**请求参数**:

- **customerSource.csid**:
  资源ID

        - **customerChance.region.did**:
  部门ID
        - **customerChance.department.did**:
  部门ID
        - **customerChance.belonger.userId**:
  人员编号

        **示例**:{
                "customerSource.csid": 1,
                "customerChance.region.did": 1,
                "customerChance.department.did": 1,
                "customerChance.belonger.userId": "U0001",
            }

### 机会

## api.customer.CustomerChanceAction

**数据类型**:

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

    ### `pageCustomerChance` <span style="color:gray">[内部]</span>

        分页方式获取客户机会信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  客户机会列表 , 每条数据类型 *customerChance*

        **示例**:{
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

    ### `queryCustomerChance` <span style="color:gray">[内部]</span>

        获取客户机会

**请求参数**:

- **customerChance.source.csid**:
  资源ID

        **示例**:{
                "customerChance.source.csid": 1
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **customerChances**: 客户机会列表 , 每条数据类型 *customerChance*
          - 类型: *List*

        **示例**:{
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

    ### `updateCustomerChance` <span style="color:gray">[内部]</span>

        分配客户机会

        判断客户机会是否存在 , 已存在 , 错误信息 **330076 客户机会已存在**

        判断客户机会状态为0(初始) , 其他状态 , 错误信息 **330077 客户机会不可操作**

**请求参数**:

- **customerChance.customer.cid**:
  客户ID
        - **customerChance.house.hid**:
  楼盘ID
        - **customerChance.busitype.dbid**:
  业务类型ID

        **示例**:{
                "customerChance.customer.cid": 1,
                "customerChance.house.hid": 1,
                "customerChance.busitype.dbid": 1
            }

    ### `issueCustomerChance` <span style="color:gray">[内部]</span>

        分配客户机会

        判断客户机会是否存在 , 已存在 , 错误信息 **330076 客户机会已存在**

        判断客户机会状态为0(初始) , 其他状态 , 错误信息 **330077 客户机会不可操作**

**请求参数**:

- **customerChance.source.csid**:
  资源ID
        - **customerChance.belonger.uid**:
  归属人ID
        - **customerChance.department.did**:
  归属部门ID
        - **customerChance.region.did**:
  归属分区ID

        **示例**:{
                "customerChance.source.csid": 1,
                "customerChance.belonger.uid": 1,
                "customerChance.department.did": 1,
                "customerChance.region.did": 1
            }

    ### `changeCustomerChance` <span style="color:gray">[内部]</span>

        更改客户机会

        判断客户机会是否存在 , 不存在 , 错误信息 **330075 客户机会不存在**

        判断客户机会状态为0(初始) , 其他状态 , 错误信息 **330077 客户机会不可操作**

**请求参数**:

- **customerChance.source.csid**:
  资源ID
        - **customerChance.belonger.uid**:
  归属人ID

        **示例**:{
                "customerChance.source.csid": 1,
                "customerChance.belonger.uid": 1
            }

    ### `sendCustomerChance` <span style="color:gray">[内部]</span>

        推送客户机会

        判断客户机会是否存在 , 不存在 , 错误信息 **330075 客户机会不存在**

        判断客户机会状态为1(分配) , 其他状态 , 错误信息 **330077 客户机会不可操作**

**请求参数**:

- **customerChance.source.csid**:
  资源ID

        **示例**:{
                "customerChance.source.csid": 1
            }

    ### `confirmCustomerChange` <span style="color:gray">[内部]</span>

        确认客户机会

        判断客户机会是否存在 , 不存在 , 错误信息 **330075 客户机会不存在**

        判断客户机会状态为1(分配) , 其他状态 , 错误信息 **330077 客户机会不可操作**

**请求参数**:

- **customerOrigin.csid**:
  客源ID
        - **securityCode**: 验证码
          - 类型: *String*
        - **verifyCode**: 验证码
          - 类型: *String*

        **示例**:{
                "customerOrigin.csid": 2,
                "securityCode": "",
                "verifyCode": ""
            }

    ### `freeCustomerChance` <span style="color:gray">[内部]</span>

        释放客户机会

        判断客户机会是否存在 , 不存在 , 错误信息 **330075 客户机会不存在**

        判断客户机会状态为0(初始) , 其他状态 , 错误信息 **330077 客户机会不可操作**

**请求参数**:

- **customerChance.source.csid**:
  资源ID

        **示例**:{
                "customerChance.source.csid": 1
            }

    ### `disableCustomerChance` <span style="color:gray">[内部]</span>

        失效客户机会

        判断客户机会是否存在 , 不存在 , 错误信息 **330075 客户机会不存在**

        判断客户机会状态为0(初始) , 其他状态 , 错误信息 **330077 客户机会不可操作**

**请求参数**:

- **customerChance.source.csid**:
  资源ID

        **示例**:{
                "customerChance.source.csid": 1
            }

### 记录

## api.customer.CustomerSourceAction

**数据类型**:

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

    ### `pageCustomerSourceRecord` <span style="color:gray">[内部]</span>

        分页方式获取资源记录信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**请求参数**:

- **customerSourceRecord.csid**:
  资源ID

        **示例**:{
                "customerSourceRecord.csid": 2
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  资源记录列表 , 每条数据类型 *customerSourceRecord*

        **示例**:{
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

**数据类型**:

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


    ### `pageCustomerOrigin` <span style="color:gray">[内部]</span>

        分页方式获取客源信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**请求参数**:

- **type**: 类型 , 包括: 设计(designer) , 业务(salesman) , 归属(belonger) , 共享(share)
          - 类型: *String*

        **示例**:{
                "type": "salesman"
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  客源列表 , 每条数据类型 *customerOrigin*

        **示例**:{
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

    ### `pageCustomerOriginForAdvance` <span style="color:gray">[内部]</span>

        分页方式获取客源信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        利用客源-部门权限 , 查询当前人员拥有的部门权限下跟进人归属的客源信息

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  客源列表 , 每条数据类型 *customerOrigin*

        **示例**:{
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

    ### `queryCustomerOriginByCsid` <span style="color:blue">[自定义]</span>

        通过客源ID获取客源信息

**请求参数**:

- **customerOrigin.csid**:
  客源ID

        **示例**:{
                "customerOrigin.csid": 1
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  客源列表 , 每条数据类型 *customerOrigin*

        **示例**:{
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

    ### `addCustomerOrigin` <span style="color:gray">[内部]</span>

        添加客源信息

        创建记录信息 , 新客源信息作为记录内容 , 信息包括: 电话, 目的, 意向, 价格, 等级

**请求参数**:

- **customerOrigin.name**:
  姓名
        - **customerOrigin.gender**:
  性别
        - **customerOrigin.phone**:
  电话
        - **customerOrigin.purpose**:
  目的
        - **customerOrigin.intention**:
  意向
        - **customerOrigin.price**:
  需求价格
        - **customerOrigin.grade**:
  客户等级
        - **customerOrigin.comment**:
  备注

        - **customerOrigin.busitype.dbid**:
  业务类型ID
        - **customerOrigin.village.vid**:
  楼盘ID
        - **customerOrigin.houseNumber**:
  楼号
        - **customerOrigin.buildArea**:
  建筑面积
        - **customerOrigin.freeArea**:
  赠送面积
        - **customerOrigin.innerArea**:
  套内面积
        - **customerOrigin.totalArea**:
  总面积

        - **customerOrigin.designer.uid**:
  设计师ID
        - **customerOrigin.salesman.uid**:
  业务员ID

        **示例**:{
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

    ### `updateCustomerOrigin` <span style="color:gray">[内部]</span>

        更新客源信息 , 包括: 目的, 意向, 价格, 等级

        判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**

        判断客源状态为0(初始) , 其他状态 , 错误信息 **330014 客源状态不可操作**

        创建记录信息 , 同时将原客源信息以及新客源信息作为记录内容 , 信息包括: 目的, 意向, 价格, 等级

**请求参数**:

- **customerOrigin.csid**:
  客源ID
        - **customerOrigin.purpose**:
  目的
        - **customerOrigin.intention**:
  意向
        - **customerOrigin.price**:
  需求价格
        - **customerOrigin.grade**:
  客户等级
        - **customerOrigin.comment**:
  备注

        - **customerOrigin.busitype.dbid**:
  业务类型ID
        - **customerOrigin.designer.uid**:
  设计师ID
        - **customerOrigin.salesman.uid**:
  业务员ID

        **示例**:{
                "customerOrigin.csid": 2,
                "customerOrigin.purpose": "婚房",
                "customerOrigin.intention": "铁西广场附近",
                "customerOrigin.grade": "A",
                "customerOrigin.comment": "备注",
                "customerOrigin.decortionBusitype.dbid": 1,
                "customerOrigin.designer.uid": 1,
                "customerOrigin.salesman.uid": 1
            }

    ### `updateCustomerOriginForBelonger` <span style="color:gray">[内部]</span>

        更新客源归属信息

        判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**

        判断客源状态为0(初始) , 其他状态 , 错误信息 **330014 客源状态不可操作**

        修改归属人信息同时更新归属部门以及分区

        客源归属人信息可以为空 , 为空时 , 不更新归属部门和分区

        创建记录信息 , 将原归属人, 部门, 分区以及新归属人, 部门, 分区作为记录内容

**请求参数**:

- **customerOrigin.csid**:
  客源ID
        - **customerOrigin.belonger.userId**:
  归属人ID

        **示例**:{
                "customerOrigin.csid": 2,
                "customer.belonger.userId": "U9382"
            }

    ### `freeCustomerOrigin` <span style="color:gray">[内部]</span>

        释放客源归属信息

        判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**

        判断客源状态为0(初始) , 其他状态 , 错误信息 **330014 客源状态不可操作**

        客源归属人为当前操作人能够释放 , 否则释放失败 , 错误信息 **330002 客源归属人错误**

        更新归属人为空

        创建记录信息 , 记录原归属人信息 , 包括原归属人的员工号以及员工名

**请求参数**:

- **customerOrigin.csid**:
  客源ID

        **示例**:{
                "customerOrigin.csid": 2
            }

    ### `takeCustomerOrigin` <span style="color:gray">[内部]</span>

        认领房源

        判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**

        判断客源状态为0(初始) , 其他状态 , 错误信息 **330014 客源状态不可操作**

        客源归属人为空能够认领 , 否则认领失败 , 错误信息 **330002 客源归属人错误**

        更新归属人 , 部门以及分区信息

        创建记录信息 , 记录原归属人信息 , 包括认领人的员工号以及员工名

**请求参数**:

- **customerOrigin.csid**:
  客源ID

        **示例**:{
                "customerOrigin.csid": 2
            }

    ### `bindCustomerOrigin` <span style="color:gray">[内部]</span>

        绑定客源信息 , 包括: 设计师 , 业务员 , 房产ID , 客户ID

        判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**

        判断客源状态为0(初始) , 其他状态 , 错误信息 **330014 客源状态不可操作**

        判断房产是否存在 , 不存在 , 错误信息 **320002 房产不存在**

**请求参数**:

- **customerOrigin.csid**:
  客源ID
        - **customerOrigin.designer.userId**:
  设计师ID
        - **customerOrigin.salesman.userId**:
  业务员ID
        - **customerOrigin.customer.cid**:
  客户ID
        - **customerOrigin.house.hid**:
  房产ID

        **示例**:{
                "customerOrigin.csid": 2,
                "customerOrigin.designer.userId": "U0002",
                "customerOrigin.salesman.userId": "U0002",
                "customerOrigin.customer.cid": 1,
                "customerOrigin.house.hid": 1
            }

    ### `commitCustomerOrigin` <span style="color:gray">[内部]</span>

        提交客源

        判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**

        判断客源状态为1(初审) , 其他状态 , 错误信息 **330014 客源状态不可操作**

**请求参数**:

- **customerOrigin.csid**:
  客源ID

        **示例**:{
                "customerOrigin.csid": 2
            }

    ### `confirmCustomerOrigin` <span style="color:gray">[内部]</span>

        确认客源

        判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**

        判断客源状态为2(提交) , 其他状态 , 错误信息 **330014 客源状态不可操作**

**请求参数**:

- **customerOrigin.csid**:
  客源ID
        - **securityCode**: 验证码
          - 类型: *String*
        - **verifyCode**: 验证码
          - 类型: *String*

        **示例**:{
                "customerOrigin.csid": 2,
                "securityCode": "",
                "verifyCode": ""
            }

    ### `cancelCustomerOrigin` <span style="color:gray">[内部]</span>

        撤销客源

        判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**

        判断客源状态为2(提交)/3(确认)/5(拒绝) , 其他状态 , 错误信息 **330014 客源状态不可操作**

**请求参数**:

- **customerOrigin.csid**:
  客源ID

        **示例**:{
                "customerOrigin.csid": 2
            }

### 记录

## api.customer.CustomerRecordAction

**数据类型**:

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

    ### `queryCustomerOriginRecord` <span style="color:gray">[内部]</span>

        通过客源查询记录信息

**请求参数**:

- **customerOriginRecord.csid**:
  客源ID

        **示例**:{
                "customerOriginRecord.csid": 2
            }

**返回参数**:

- **customerOriginRecords**: 记录信息列表 , 每条数据类型 *customerOriginRecord*
          - 类型: *List*

        **示例**:{
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

    ### `addCustomerOriginRecord` <span style="color:gray">[内部]</span>

        创建客户记录信息

**请求参数**:

- **customerOriginRecord.csid**:
  客源ID
        - **customerOriginRecord.comment**:
  说明

        **示例**:{
                "customerOriginRecord.csid": 2,
                "customerOriginRecord.comment": "说明"
            }

### 功能

## api.customer.CustomerOriginFunctionAction

**数据类型**:

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

    ### `queryCustomerOriginFunction` <span style="color:gray">[内部]</span>

        获取客源功能信息

**请求参数**:

- **customerOriginFunction.type**:
  类型

        **示例**:{
                "customerOriginFunction.type": 0
            }

**返回参数**:

- **customerOriginFunctions**: 功能信息列表 , 类型 *customerOriginFunction*
          - 类型: *List*

        **示例**:{
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

**数据类型**:

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

    ### `pageConsultion` <span style="color:gray">[内部]</span>

        分页方式获取咨询信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  咨询信息列表 , 每条数据类型 *consultion*

        **示例**:{
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

    ### `queryConsultionByOrderId` <span style="color:gray">[内部]</span>

        通过装修单号获取咨询信息

**请求参数**:

- **consultion.decoration.orderId**:
  装修单号

        **示例**:{
                "consultion.decoration.orderId": "1601010001"
            }

**返回参数**:

- **consultions**: 咨询信息 , 每条数据类型 *user*
          - 类型: *List*

        **示例**:{
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

    ### `addConsultion` <span style="color:gray">[内部]</span>

        添加咨询信息

**请求参数**:

- **consultion.decoration.orderId**:
  装修单号
        - **consultion.comment**:
  咨询内容

        **示例**:{
                "consultion.decoration.orderId": "1601010001",
                "consultion.comment": "咨询内容"
            }

### 报修/维修

## api.customer.AepairAction

**数据类型**:

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

    ### `pageAepair` <span style="color:gray">[内部]</span>

        分页方式获取报修信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  报修信息列表 , 每条数据类型 *aepair*

        **示例**:{
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

    ### `queryAepair` <span style="color:gray">[内部]</span>

        通过咨询ID获取报修信息

**请求参数**:

- **aepair.csid**:
  咨询ID

        **示例**:{
                "aepair.csid": 1
            }

**返回参数**:

- **aepairs**: 报修信息列表 , 每条数据类型 *aepair*
          - 类型: *List*

        **示例**:{
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

    ### `queryAepairByOrderId` <span style="color:gray">[内部]</span>

        通过咨询ID获取报修信息

**请求参数**:

- **aepair.decoration.orderId**:
  装修单号

        **示例**:{
                "aepair.decoration.orderId": "1601010001"
            }

**返回参数**:

- **aepairs**: 报修信息列表 , 每条数据类型 *aepair*
          - 类型: *List*

        **示例**:{
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

    ### `addAepair` <span style="color:gray">[内部]</span>

        添加报修信息

        判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**

**请求参数**:

- **consultion.csid**:
  咨询ID
        - **consultion.decoration.orderId**:
  装修单号
        - **consultion.comment**:
  说明

        - **aepair.decoration.orderId**:
  装修单号
        - **aepair.targetTime**:
  预计完成时间

        **示例**:{
                "consultion.csid": 1,
                "consultion.comment": 1,
                "aepair.decoration.orderId": "1601010001",
                "aepair.targetTime": "2016-01-01 00:00:00"
            }

    ### `updateAepair` <span style="color:gray">[内部]</span>

        更新报修信息

        判断报修信息是否存在 , 不存在 , 错误信息 **330021 报修信息不存在**

        判断报修信息状态为0(初始)或1(维修) , 其他状态 **330022 报修状态不可操作**

**请求参数**:

- **aepair.aid**:
  报修ID
        - **aepair.outlay**:
  维修费用

        **示例**:{
                "aepair.rid": 1,
                "aepair.outlay": 100000
            }

    ### `receiveAepair` <span style="color:gray">[内部]</span>

        领取报修信息

        判断报修信息是否存在 , 不存在 , 错误信息 **330021 报修信息不存在**

        判断报修信息状态是否为0(初始) , 其他状态 , 错误信息 **330022 报修状态不可操作**

        判断维修信息是否存在维修人 , 已存在 , 错误信息 **330027 维修已有归属**

        更新报修单中维修人信息 , 报修单状态为1(维修)

        生成维修信息

**请求参数**:

- **aepair.aid**:
  报修ID

        **示例**:{
                "aepair.aid": 1
            }

    ### `deliveAepair` <span style="color:gray">[内部]</span>

        分配报修信息

        判断报修信息是否存在 , 不存在 , 错误信息 **330021 报修信息不存在**

        判断报修信息状态是否为0(初始) , 其他状态 , 错误信息 **330022 报修状态不可操作**

        判断维修信息是否存在维修人 , 已存在 , 错误信息 **330027 维修已有归属**

        生成维修信息

**请求参数**:

- **aepair.aid**:
  报修ID
        - **aepair.repaier.uid**:
  维修人ID

        **示例**:{
                "aepair.aid": 1,
                "aepair.repaier.uid": 1
            }

    ### `tranAepair` <span style="color:gray">[内部]</span>

        转交报修信息

        判断报修信息是否存在 , 不存在 , 错误信息 **330021 报修信息不存在**

        判断报修信息状态是否为1(维修) , 其他状态 , 错误信息 **330022 报修状态不可操作**

        判断维修归属为当前操作人 , 非同一人 , 错误信息 **330028 维修非当前归属**

**请求参数**:

- **aepair.aid**:
  报修ID
        - **aepair.repaier.uid**:
  维修人ID

        **示例**:{
                "aepair.aid": 1,
                "aepair.repaier.uid": 1
            }

    ### `finishAepair` <span style="color:gray">[内部]</span>

        完工报修

        判断报修信息是否存在 , 不存在 , 错误信息 **330021 报修信息不存在**

        判断报修信息状态是否为1(维修) , 其他状态 , 错误信息 **330022 报修状态不可操作**

        更新报修状态为2(完工)

**请求参数**:

- **aepair.aid**:
  报修ID

        **示例**:{
                "aepair.aid": 1
            }

    ### `closeAepair` <span style="color:gray">[内部]</span>

        关闭报修

        判断报修信息是否存在 , 不存在 , 错误信息 **330021 报修信息不存在**

        判断报修信息状态是否为2(完工) , 其他状态 , 错误信息 **330022 报修状态不可操作**

**请求参数**:

- **aepair.aid**:
  报修ID

        **示例**:{
                "aepair.aid": 1
            }

    ### `sendAepair` <span style="color:gray">[内部]</span>

        发送报修信息

        判断报修信息是否存在 , 不存在 , 错误信息 **330021 报修信息不存在**

**请求参数**:

- **aepair.aid**:
  报修ID

        **示例**:{
                "aepair.aid": 1
            }

## api.customer.RepairAction

**数据类型**:

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

    ### `queryRepair` <span style="color:gray">[内部]</span>

        通过报修ID获取维修信息

**请求参数**:

- **repair.aid**:
  报修ID

        **示例**:{
                "repair.aid": 1
            }

**返回参数**:

- **repairs**: 维修信息列表 , 每条数据类型 *repair*
          - 类型: *List*

        **示例**:{
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

    ### `addRepair` <span style="color:gray">[内部]</span>

        添加维修信息

**请求参数**:

- **repair.aid**:
  报修ID
        - **repair.repaier.uid**:
  维修人ID
        - **repair.content**:
  维修内容

        **示例**:{
                "repair.aid": 1,
                "repair.repaier.uid": 1,
                "repair.content": "维修内容"
            }

    ### `sendRepair` <span style="color:gray">[内部]</span>

        发送

        判断维修信息是否存在 , 不存在 , 错误信息 **330025 维修信息不存在**

        判断维修状态为0(初始) , 其他状态 , 错误信息 **330026 维修状态不可操作**

**请求参数**:

- **repair.rid**:
  维修ID

        **示例**:{
                "repair.rid": 1
            }

    ### `keepRepair` <span style="color:gray">[内部]</span>

        维修

        判断维修信息是否存在 , 不存在 , 错误信息 **330025 维修信息不存在**

        判断维修状态为0(初始) , 其他状态 , 错误信息 **330026 维修状态不可操作**

        更新维修信息状态为1(维修)

        更新报修信息状态为1(维修)

**请求参数**:

- **repair.rid**:
  维修ID
        - **repair.schedule**:
  进度

        **示例**:{
                "repair.rid": 1,
                "repair.schedule": "one"
            }

    ### `finishRepair` <span style="color:gray">[内部]</span>

        完工

        判断维修信息是否存在 , 不存在 , 错误信息 **330025 维修信息不存在**

        判断维修状态为1(维修) , 其他状态 , 错误信息 **330026 维修状态不可操作**

        判断维修归属为当前操作人 , 非同一人 , 错误信息 **330028 维修非当前归属**

        更新维修信息状态为2(完工)

        更新报修信息状态为0(初始)

**请求参数**:

- **repair.rid**:
  维修ID
        - **repair.schedule**:
  进度

        **示例**:{
                "repair.rid": 1,
                "repair.schedule": "one"
            }

## api.customer.RepairpayAction

**数据类型**:

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

    ### `queryRepairpay` <span style="color:gray">[内部]</span>

        通过维修信息ID获取维修款信息

**请求参数**:

- **repairpay.aid**:
  报修ID

        **示例**:{
                "repairpay.aid": 1
            }

**返回参数**:

- **repairpays**: 维修款信息列表 , 每条数据类型 *repairpay*
          - 类型: *List*

        **示例**:{
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

    ### `addRepairpay` <span style="color:gray">[内部]</span>

        添加维修款

        判断维修信息是否存在 , 不存在 , 错误信息 **330025 维修信息不存在**

        更新报修单的维修费用

**请求参数**:

- **repairpay.aid**:
  报修ID
        - **repairpay.type**:
  类型
        - **repairpay.money**:
  金额

        **示例**:{
                "repairpay.aid": 1,
                "repairpay.type": 1,
                "repairpay.money": 100000,
            }

    ### `deleteRepairpay` <span style="color:gray">[内部]</span>

        删除维修款

        判断维修款是否存在 , 不存在 , 错误信息 **330032 维修款不存在**

        判断维修款状态是否为0(初始) , 其他状态 , 错误信息 **330033 维修款状态不可操作**

**请求参数**:

- **repairpay.rpid**:
  维修款ID

        **示例**:{
                "repairpay.rpid": 1
            }

### 投诉/跟踪

## api.customer.ComplainAction

**数据类型**:

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

    ### `pageComplain` <span style="color:gray">[内部]</span>

        分页方式获取投诉信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  投诉信息列表 , 每条数据类型 *complain*

        **示例**:{
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

    ### `queryComplain` <span style="color:gray">[内部]</span>

        通过咨询ID获取投诉信息

**请求参数**:

- **complain.csid**:
  咨询ID

        **示例**:{
                "complain.csid": 1
            }

**返回参数**:

- **complains**: 投诉信息列表 , 每条数据类型 *complain*
          - 类型: *List*

        **示例**:{
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

    ### `queryComplainByOrderId` <span style="color:gray">[内部]</span>

        通过装修单号获取投诉信息

**请求参数**:

- **complain.decoration.orderId**:
  装修单号

        **示例**:{
                "complain.csid": 1
            }

**返回参数**:

- **complains**: 投诉信息列表 , 每条数据类型 *complain*
          - 类型: *List*

        **示例**:{
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

    ### `addComplain` <span style="color:gray">[内部]</span>

        添加投诉信息

        判断装修单是否存在 , 不存在 , 错误信息 **130014 订单不存在**

**请求参数**:

- **consultion.csid**:
  咨询ID
        - **consultion.decoration.orderId**:
  装修单号
        - **consultion.comment**:
  说明

        - **complain.level**:
  等级

        - **complaints[n].type**:
  类型
        - **complaints[n].dept.did**:
  部门ID
        - **complaints[n].staff.uid**:
  人员ID
        - **complaints[n].brand.bid**:
  品牌ID
        - **complaints[n].content**:
  内容

        **示例**:{
                "complain.csid": 1,
                "complain.level": 1,

                "complaints[0].type": 0,
                "complaints[0].dept.did": 1,
                "complaints[0].staff.uid": 1,
                "complaints[0].brand.bid": 1,
                "complaints[0].content": "投诉内容",
            }

    ### `finishComplain` <span style="color:gray">[内部]</span>

        完结

        判断投诉信息是否存在 , 不存在 , 错误信息 **330037 投诉信息不存在**

        判断投诉信息状态是否为1(处理) , 其他状态 , 错误信息 **330038 投诉状态不可操作**

        更新投诉信息状态为2(完结)

**请求参数**:

- **complain.cid**:
  投诉ID

        **示例**:{
                "complain.cid": 1
            }

    ### `closeComplain` <span style="color:gray">[内部]</span>

        关闭

        判断投诉信息是否存在 , 不存在 , 错误信息 **330037 投诉信息不存在**

        判断投诉信息状态是否为2(完结) , 其他状态 , 错误信息 **330038 投诉状态不可操作**

        更新投诉信息状态为3(关闭)

**请求参数**:

- **complain.cid**:
  投诉ID

        **示例**:{
                "complain.cid": 1
            }

## api.customer.ComplaintAction

**数据类型**:

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

    ### `queryComplaint` <span style="color:gray">[内部]</span>

        通过投诉ID获取内容信息

**请求参数**:

- **complaint.cid**:
  投诉ID

        **示例**:{
                "complaint.cid": 1
            }

**返回参数**:

- **complaints**: 投诉内容信息列表 , 每条数据类型 *complaint*
          - 类型: *List*

        **示例**:{
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

    ### `addComplaint` <span style="color:gray">[内部]</span>

        添加投诉内容

**请求参数**:

- **complaint.cid**:
  咨询ID
        - **complaint.type**:
  类型
        - **complaint.dept.did**:
  部门ID
        - **complaint.staff.uid**:
  人员ID
        - **complaint.brand.bid**:
  品牌ID
        - **complaint.content**:
  内容

        **示例**:{
                "complaint.cid": 1,
                "complaint.type": 1,
                "complaint.dept.did": 1,
                "complaint.staff.uid": 1,
                "complaint.brand.bid": 1,
                "complaint.content": "投诉内容"
            }

    ### `finishComplaint` <span style="color:gray">[内部]</span>

        完结

        判断投诉信息是否存在 , 不存在 , 错误信息 **330042 投诉内容不存在**

        判断投诉状态是否为1(处理) , 其他状态 , 错误信息 **330043 投诉内容不可操作**

        更新投诉状态为2(完结)

**请求参数**:

- **complaint.ctid**:
  投诉ID

        **示例**:{
                "complaint.ctid": 1
            }

    ### `closeComplaint` <span style="color:gray">[内部]</span>

        关闭

        判断投诉内容是否存在 , 不存在 , 错误信息 **330042 投诉内容不存在**

        判断投诉内容状态是否为1(处理) , 其他状态 , 错误信息 **330043 投诉内容不可操作**

        更新投诉内容状态为3(关闭)

**请求参数**:

- **complaint.ctid**:
  投诉ID

        **示例**:{
                "complaint.ctid": 1
            }

## api.customer.ComplackAction

**数据类型**:

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

    ### `queryComplack` <span style="color:gray">[内部]</span>

        通过投诉内容ID获取跟踪信息

**请求参数**:

- **complack.ctid**:
  投诉内容ID

        **示例**:{
                "complack.ctid": 1
            }

**返回参数**:

- **complacks**: 跟踪信息列表 , 每条数据类型 *complack*
          - 类型: *List*

        **示例**:{
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

    ### `trackComplack` <span style="color:gray">[内部]</span>

        跟踪

        判断投诉内容是否存在 , 不存在 , 错误信息 **330042 投诉内容不存在**

**请求参数**:

- **complack.cid**:
  投诉ID
        - **complack.ctid**:
  投诉内容ID
        - **complack.comment**:
  说明

        **示例**:{
                "complack.cid": 1,
                "complack.ctid": 1,
                "complack.comment": "说明"
            }

### 回访

## api.customer.RevisitAction

**数据类型**:

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

    ### `pageRevisit` <span style="color:gray">[内部]</span>

        分页方式获取回访信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  回访信息列表 , 每条数据类型 *revisit*

        **示例**:{
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

    ### `queryRevisitForAepair` <span style="color:gray">[内部]</span>

        获取报修类型回访信息

**请求参数**:

- **revisit.ident**:
  引用ID

        **示例**:{
                "revisit.ident": 1
            }

**返回参数**:

- **revisits**: 回访信息列表 , 每条数据类型 *revisit*
          - 类型: *List*

        **示例**:{
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

    ### `queryRevisitForComplain` <span style="color:gray">[内部]</span>

        获取投诉类型回访信息

**请求参数**:

- **revisit.ident**:
  引用ID

        **示例**:{
                "revisit.ident": 1
            }

**返回参数**:

- **revisits**: 回访信息列表 , 每条数据类型 *revisit*
          - 类型: *List*

        **示例**:{
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

    ### `queryRevisitByOrderId` <span style="color:gray">[内部]</span>

        通过装修单号获取回访信息

**请求参数**:

- **revisit.decoration.orderId**:
  装修单号

        **示例**:{
                "revisit.decoration.orderId": "1601010001"
            }

**返回参数**:

- **revisits**: 回访信息列表 , 每条数据类型 *revisit*
          - 类型: *List*

        **示例**:{
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

    ### `visitRevisit` <span style="color:gray">[内部]</span>

        回访

**请求参数**:

- **revisit.decoration.orderId**:
  装修单号
        - **revisit.type**:
  类型
        - **revisit.ident**:
  引用ID
        - **revisit.gladness**:
  满意度
        - **revisit.comment**:
  说明

        **示例**:{
                "revisit.decoration.orderId": "1601010001",
                "revisit.type": 1,
                "revisit.ident": 1,
                "revisit.gladness": 0,
                "revisit.comment": "说明"
            }

## 大客户

## api.customer.VustomerAction

**数据类型**:

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

    ### `pageVustomer` <span style="color:gray">[内部]</span>

        分页方式获取大客户信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        针对当前登录人员返回归属的大客户信息

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  大客户信息列表 , 每条数据类型 *vustomer*

        **示例**:{
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

    ### `pageVustomerForAdvance` <span style="color:gray">[内部]</span>

        分页方式获取大客户信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  大客户信息列表 , 每条数据类型 *vustomer*

        **示例**:{
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

    ### `pageVustomerForCommunion` <span style="color:gray">[内部]</span>

        分页方式获取大客户信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        归属人为空的大客户信息

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  大客户信息列表 , 每条数据类型 *vustomer*

        **示例**:{
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

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  大客户信息列表 , 每条数据类型 *vustomer*

        **示例**:{
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

**请求参数**:

- **vustomer.unionId**:
  归属人ID

        **示例**:{
                "vustomer.unionId": 1918
            }

**返回参数**:

- **vustomers**: 大客户信息列表 , 每条数据类型 *vustomer*
          - 类型: *List*

        **示例**:{
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

**请求参数**:

- **vustomer.unionId**:
  归属人ID

        **示例**:{
                "vustomer.unionId": 1918
            }

**返回参数**:

- **counts**: 统计信息信息 , 类型 List <String> , 依次为: 签单总额 , 签单总数 , 客户总数
          - 类型: *Object*

        **示例**:{
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

**请求参数**:

- **vustomer.uniondId**:
  标识
        - **vustomer.name**:
  姓名
        - **vustomer.phone**:
  电话
        - **vustomer.address**:
  地址
        - **vustomer.referrer**:
  推荐人姓名
        - **vustomer.referPhone**:
  推荐人电话

        **示例**:{
                "vustomer.uniondId": 1918,
                "vustomer.name": "大客户",
                "vustomer.phone": "138xxxx9872",
                "vustomer.address": "沈阳市铁西区xxxx30号 1-1-1",
                "vustomer.referrer": "推荐人",
                "vustomer.referPhone": "135xxxx1918"
            }

    ### `updateVustomer` <span style="color:gray">[内部]</span>

        大客户绑定装修单

        判断大客户信息是否存在 , 不存在 , 错误信息 **330003 客户信息不存在**

        判断大客户信息是否已经绑定装修单 , 已经绑定 , 错误信息 **330004 客户已绑装修单**

        判断绑定装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

        判断绑定装修单状态为2(签约) , 其他状态 , 错误信息 **330006 装修单未签约**

**请求参数**:

- **vustomer.vid**:
  大客户ID
        - **vustomer.orderId**:
  装修单号

        **示例**:{
                "vustomer.vid": 1918,
                "vustomer.orderId": "1601010001"
            }

    ### `freeVustomer` <span style="color:gray">[内部]</span>

        释放大客户信息

        判断大客户信息是否存在 , 不存在 , 错误信息 **330003 客户信息不存在**

        判断大客户信息是否已经绑定装修单 , 已经绑定 , 错误信息 **330004 客户已绑装修单**

**请求参数**:

- **vustomer.vid**:
  大客户ID

        **示例**:{
                "vustomer.vid": 1918
            }

    ### `takeVustomer` <span style="color:gray">[内部]</span>

        认领大客户信息

        判断大客户信息是否存在 , 不存在 , 错误信息 **330003 客户信息不存在**

        判断大客户信息是否已经绑定装修单 , 已经绑定 , 错误信息 **330004 客户已绑装修单**

        判断大客户是否已经存在归属人 , 存在归属人 , 错误信息 **330007 客户存在归属**

        - **vustomer.vid**:
  大客户ID

        **示例**:{
                "vustomer.vid": 1918
            }

    ### `updateVustomerForBelonger` <span style="color:gray">[内部]</span>

        更新大客户归属信息

        判断大客户信息是否存在 , 不存在 , 错误信息 **330003 客户信息不存在**

        判断大客户信息是否已经绑定装修单 , 已经绑定 , 错误信息 **330004 客户已绑装修单**

**请求参数**:

- **vustomer.vid**:
  标识
        - **vustomer.belonger.userId**:
  归属人ID

        **示例**:{
                "vustomer.vid": 1918,
                "vustomer.belonger.userId": "U0001"
            }

    ### <I-C> deleteVustomer

        逻辑删除大客户信息 , 更新状态为1(无效)

**请求参数**:

- **vustomer.vid**:
  标识

        **示例**:{
                "vustomer.vid": 1,
            }

## api.customer.VustomerNetAction

    大客户关系网

**数据类型**:

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

**请求参数**:

- **vustomerNet.unionId**:
  归属人ID

        **示例**:{
                "vustomerNet.unionId": 1918
            }

**返回参数**:

- **counts**: 统计信息信息 , 类型 List <String> , 依次为: 关系客户数
          - 类型: *Object*

        **示例**:{
                ...
                "counts":[
                    "2"
                ],
                ...
            }

    ### <I-C> buildVustomerNet

        建立客户关系

        判断关系人ID是否绑定归属人ID , 如果存在 , 错误信息 ** 客户关系已存在**

**请求参数**:

- **vustomerNet.unionId**:
  归属人ID
        - **vustomerNet.netunionId**:
  关系人ID

        **示例**:{
                "vustomerNet.unionId": 1918,
                "vustomerNet.netunionId": 1919
            }

## api.customer.VrecordAction

    客户记录信息

**数据类型**:

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

    ### `queryVrecordByVid` <span style="color:gray">[内部]</span>

        通过大客户ID获取记录信息

**请求参数**:

- **vrecord.vid**:
  大客户ID

        **示例**:{
                "vrecord.vid": 1,
            }

**返回参数**:

- **vrecords**: 记录信息列表 , 每条数据类型 *vrecord*
          - 类型: *List*

        **示例**:{
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

    ### `addVrecord` <span style="color:gray">[内部]</span>

        添加大客户对应的记录信息

**请求参数**:

- **vrecord.vid**:
  大客户ID
        - **vrecord.comment**:
  说明

        **示例**:{
                "vrecord.vid": 1,
                "vrecord.comment": "说明",
            }

## api.customer.VscoreAction

    客户积分相关信息

**数据类型**:

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

**请求参数**:

- **vscore.unionId**:
  归属人ID

        **示例**:{
                "vrecord.unionId": 1918,
            }

**返回参数**:

- **vscore**: 积分信息 , 类型 *vscore*
          - 类型: *Object*

        **示例**:{
                ...
                "vscore": {
                    "vsid": 1,
                    "vid": 1,
                    "unionId": "1918",
                    "score": 100
                }
                ...
            }

    ### `pageVscoreRecordByUnionId` <span style="color:gray">[内部]</span>

        分页方式获取积分记录信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        默认条件为归属人ID

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  积分记录列表 , 每条数据类型 *vscoreRecord*

        **示例**:{
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

    ### `updateVscoreRecordForStatus` <span style="color:gray">[内部]</span>

        更新积分记录状态

        判断积分记录类型以及状态不同情况进行处理

        通过增加类型的积分记录 , 归属人ID对应的积分值增加

        拒绝提取类型的积分记录 , 归属人ID对应的积分值增加

    ### `raiseVscore` <span style="color:gray">[内部]</span>

        增加积分

        根据归属人ID获取积分信息 , 不存在创建积分信息

        生成对应的积分记录 , 更新积分信息中的积分值

**请求参数**:

- **vscore.unionId**:
  归属人ID
        - **vscore.score**:
  积分

        **示例**:{
                "vrecord.unionId": "1918",
                "vrecord.score": 1000
            }

    ### <I-C> pickupVscore

        提取积分

        根据归属人ID获取积分信息 , 不存在 , 错误信息 ** 积分不存在**

        判断积分信息中积分值是否大于提取积分值 , 不满足提取积分值 , 错误信息 ** 积分不足**

        生成积分记录信息 , 同时减少归属人ID积分信息中的积分值

**请求参数**:

- **vscore.unionId**:
  归属人ID
        - **vscore.score**:
  积分

        **示例**:{
                "vrecord.unionId": "1918",
                "vrecord.score": 1000
            }

## 资料

### 订单

## api.customer.DecorationAction

**数据类型**:

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

**请求参数**:

- **unionId**: 联合ID
          - 类型: *String*

        **示例**:{
                "unionId": "SDJ4SDF5"
            }

**返回参数**:

- **decorations**: 装修单列表 , 每条数据类型 :[decoration](./customer.html#api.customer.DecorationAction.decoration)
          - 类型: *List*

        **示例**:{
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

**请求参数**:

- **unionId**: 联合ID
          - 类型: *String*

        **示例**:{
                "unionId": "SDJ4SDF5"
            }

**返回参数**:

- **decoration**: 装修单信息 , 类型 :[decoration](./customer.html#api.customer.DecorationAction.decoration)
          - 类型: *Object*

        **示例**:{
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

**请求参数**:

- **unionId**: 联合ID
          - 类型: *String*
        - **decoration.orderId**:
  装修单号

        **示例**:{
                "unionId": "SDJ4SDF5",
                "decoration.orderId": "1601010001"
            }

**返回参数**:

- **decoration**: 装修单信息 , 类型 :[decoration](./customer.html#api.customer.DecorationAction.decoration)
          - 类型: *Object*

        **示例**:{
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

**请求参数**:

- **unionId**: 联合ID
          - 类型: *String*
        - **decoration.orderId**:
  装修单号

        **示例**:{
                "unionId": "SDJ4SDF5",
                "decoration.orderId": "1601010001"
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  人员信息列表 , 每条数据类型 :[decorationUser](./decoration.html#api.decoration.DecorationUserAction.decorationUser)

        **示例**:{
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

**请求参数**:

- **decorationActivity.orderId**:
  装修单号

        **示例**:{
                "decorationActivity.orderId": "1601010001"
            }

**返回参数**:

- **decorationActivity**: 活动信息 , 每条数据类型 *decorationActivity*
          - 类型: *Object*

        **示例**:{
                ...
                "decorationActivity": {
                    "orderId": "1601010001",
                    "activity": "装修活动"
                }
                ...
            }

    ### <I-C> queryCusDecorationHolonomy

        获取装修单半价信息

**请求参数**:

- **decorationHolonomy.orderId**:
  装修单号

        **示例**:{
                "decorationHolonomy.orderId": "1601010001"
            }

**返回参数**:

- **decorationHolonomy**: 半价/满减信息 , 每条数据类型 *decorationHolonomy*
          - 类型: *Object*

        **示例**:{
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

**请求参数**:

- **decoration.orderId**:
  装修单号

        **示例**:{
                "decoration.orderId": "1601010001"
            }

**返回参数**:

- **securityCode**: 验证码
          - 类型: *String*

        **示例**:{
                ...
                "securityCode": "SUDF2JH3J423NJ"
                ...
            }

    ### <I-C> bindingCusDecoration

        绑定装修单

        按照规则判断验证码和校验码 , 不匹配 , 错误信息 **330008 绑定订单失败,验证码错误**

        通过电话获取到对应客户的装修单 , 如果没有可绑定装修单 , 错误信息 **330009 无可绑定订单**

**请求参数**:

- **decoration.unionId**:
  联合ID
        - **decoration.orderId**:
  装修单号
        - **phone**: 客户电话
          - 类型: *String*
        - **securityCode**: 验证码
          - 类型: *String*
        - **verifyCode**: 校验码
          - 类型: *String*

        **示例**:{
                "decoration.unionId": "SDJ4SDF5",
                "decoration.orderId": "1601010001",
                "phone": "13333333333",
                "securityCode": "1234",
                "verifyCode": "1234"
            }


    ### <I-C> updateCusDecorationForDefault

        更换默认装修单

**请求参数**:

- **unionId**: 联合ID
          - 类型: *String*
        - **decoration.orderId**:
  装修单号

        **示例**:{
                "unionId": "SDJ4SDF5",
                "decoration.orderId":"1601010001"
            }

    ### `unbindingCusDecoration` <span style="color:gray">[内部]</span>

        解绑装修单

        按照规则判断验证码和校验码 , 不匹配 , 错误信息 **330008 绑定订单失败,验证码错误**

**请求参数**:

- **decoration.unionId**:
  联合ID
        - **decoration.orderId**:
  装修单号

        **示例**:{
                "decoration.unionId": "SDJ4SDF5",
                "decoration.orderId": "1601010001"
            }

### 款项

## api.customer.PaymentAction

**数据类型**:

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

**请求参数**:

- **advance.cid**:
  客户ID

        **示例**:{
                "advance.cid": 1,
            }

**返回参数**:

- **advance**: 预付款信息 , 每条数据类型 :advance
          - 类型: *Object*

        **示例**:{
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

**请求参数**:

- **payment.orderId**:
  装修单号

        **示例**:{
                "payment.orderId": "1601010001"
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  款项列表 , 每条数据类型 *payment*

        **示例**:{
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

**请求参数**:

- **payment.orderId**:
  装修单号

        **示例**:{
                "payment.orderId": "1601010001"
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  款项信息列表 , 每条数据类型 *decorationPayment*


        **示例**:{
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

**请求参数**:

- **payment.orderId**:
  装修单号

        **示例**:{
                "payment.orderId": "1601010001"
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  款项信息列表 , 每条数据类型 *decorationPayment*


        **示例**:{
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

**请求参数**:

- **payment.orderId**:
  装修单号

        **示例**:{
                "payment.orderId": "1601010001"
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  款项信息列表 , 每条数据类型 *materialPayment*

        **示例**:{
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

**请求参数**:

- **payment.orderId**:
  装修单号

        **示例**:{
                "payment.orderId": "1601010001"
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  款项信息列表 , 每条数据类型 *salesPayment*

        **示例**:{
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

**请求参数**:

- **payment.orderId**:
  装修单号

        **示例**:{
                "payment.orderId": "1601010001"
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  款项信息列表 , 每条数据类型 *servicePayment*

        **示例**:{
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

**请求参数**:

- **proxyPayment.ppid**:
  款项ID

        **示例**:{
                "proxyPayment.ppid": "1601010001"
            }

**返回参数**:

- **proxyPayment**: 代付款信息 , 类型 *proxyPayment*
          - 类型: *Object*

        **示例**:{
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

**请求参数**:

- **materialPayment.orderId**:
  装修单号

        **示例**:{
                "materialPayment.orderId": "1601010001"
            }

**返回参数**:

- **realMoney**: 总额
          - 类型: *Float*

        **示例**:{
                "realMoney": 1020.00
            }

    ### <I-C> countCusSalesPaymentForAmount

        统计销售款 , 状态为1(已付款)和2(已确认)

**请求参数**:

- **salesPayment.orderId**:
  装修单号

        **示例**:{
                "salesPayment.orderId": "1601010001"
            }

**返回参数**:

- **realMoney**: 总额
          - 类型: *Float*

        **示例**:{
                "realMoney": 1020.00
            }

    ### <I-C> countCusServicePaymentForAmount

        统计服务款 , 状态为1(已付款)和2(已确认)

**请求参数**:

- **servicePayment.orderId**:
  装修单号

        **示例**:{
                "servicePayment.orderId": "1601010001"
            }

**返回参数**:

- **realMoney**: 总额
          - 类型: *Float*

        **示例**:{
                "realMoney": 1020.00
            }

### 合同

## api.customer.ContractAction

**数据类型**:

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

    ### `queryCusContract` <span style="color:gray">[内部]</span>

        通过装修单号获取合同信息

**请求参数**:

- **contract.orderId**:
  装修单号


        **示例**:{
                "contract.orderId": "1601010001"
            }

**返回参数**:

- **contracts**: 合同信息列表 , 类型 *contract*
          - 类型: *List*

        **示例**:{
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

**数据类型**:

#### picture

    - **name**: 文件名
      - 类型: *String*
    - **path**: 路径
      - 类型: *String*

    ### <I-C> queryCusDecorationPicture

        分页方式获取装修图片 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**请求参数**:

- **orderId**: 装修单号
          - 类型: *String*

        **示例**:{
                "orderId": "1601010001"
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  图片信息列表 , 每条数据类型 *picture*

        **示例**:{
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

**请求参数**:

- **orderId**: 工程ID
          - 类型: *Long*
        - **schedule**: 施工进度
          - 类型: *Integer*

        **示例**:{
                "orderId": 1,
                "schedule": 1
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  图片信息列表 , 每条数据类型 *picture*

        **示例**:{
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

**请求参数**:

- **orderId**: 装修单号
          - 类型: *String*

        **示例**:{
                "orderId": "1601010001"
            }

**返回参数**:

- **construction**: 工程信息 , 类型 *construction*
          - 类型: *Object*

        **示例**:{
                ...
                "construction": {
                    "cid": 1,
                    "createTime": "2016-01-01 00:00:00"
                },
                ...
            }

    ### <I-C> queryCusConstructionSchedule

        通过装修单号获取施工环节信息

**请求参数**:

- **orderId**: 装修单号
          - 类型: *String*

        **示例**:{
                "orderId": "1601010001"
            }

**返回参数**:

- **constructionSchedules**: 施工环节信息列表 , 类型 *construction*
          - 类型: *List*

        **示例**:{
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

**请求参数**:

- **unionId**: 联合ID
          - 类型: *String*
        - **orderId**: 装修单号
          - 类型: *String*

        **示例**:{
                "unionId": "SDJ4SDF5",
                "orderId": "1601010001"
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  图片信息列表 , 每条数据类型 [user](./user.html#api.personel.UserAction.user)

        **示例**:{
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

**数据类型**:

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

**请求参数**:

- **approval.aid**:
  审批ID

        **示例**:{
                "approval.aid": 1
            }

**返回参数**:

- **approval**: 审批信息
          - 类型: *Object*

        **示例**:{
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

**请求参数**:

- **approval.aid**:
  审批ID

        **示例**:{
                "approval.aid": 1
            }

## 功能

### 反馈

反馈信息管理

## api.customer.FeedbackAction

**数据类型**:

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

    ### `pageFeedback` <span style="color:gray">[内部]</span>

        分页方式获取反馈信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ .

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  反馈信息列表 , 每条数据类型 *feedback*

        **示例**:{
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

**请求参数**:

- **feedback.unionId**:
  联合ID
        - **feedback.orderId**:
  装修单号
        - **feedback.phone**:
  电话
        - **feedback.picture**:
  图片
        - **feedback.content**:
  反馈信息
        - **feedback.type**:
  类型

        - **feedback.drawings**:
  图片列表

        **示例**:{
                "feedback.unionId": "SDJ4SDF5",
                "feedback.orderId": "1601010001",
                "feedback.phone": "13800254521",
                "feedback.picture": "bd9f4736d3334afd87318c5c24fe6c44.jpg",
                "feedback.content": "反馈信息",
                "feedback.type": 0,
                "feedback.drawings[0]": "bd9f4736d3334afd87318c5c24fe6c44.jpg"
            }

## api.customer.FeedbackDrawingAction

**数据类型**:

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

**请求参数**:

- **feedback.fid**:
  反馈ID

        **示例**:{
                "feedback.fid": 1
            }

**返回参数**:

- **feedbackDrawings**: 图片信息列表 , 每条数据类型 *feedbackDrawing*
          - 类型: *List*

        **示例**:{
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

    ### `addFeedbackDrawing` <span style="color:gray">[内部]</span>

**请求参数**:

- **feedbackDrawing.fid**:
  反馈ID
        - **feedbackDrawing.path**:
  地址

        **示例**:{
                "feedbackDrawing.fid": 1,
                "feedbackDrawing.fid": "bd9f4736d3334afd87318c5c24fe6c44.jpg"
            }

### 调研

## api.customer.SurveyAction

**数据类型**:

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

    ### `pageSurvey` <span style="color:gray">[内部]</span>

        分页方式获取调研模版信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  调研列表 , 每条数据类型 *survey*

        **示例**:{
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

    ### `querySurveyByOrderId` <span style="color:gray">[内部]</span>

        通过装修单号获取调研信息

**请求参数**:

- **survey.orderId**:
  装修单号

        **示例**:{
                "survey.orderId": "1601010001"
            }

**返回参数**:

- **surveys**: 调研信息列表 , 每条数据类型 *survey*
          - 类型: *List*

        **示例**:{
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

    ### `querySurveyBySid` <span style="color:gray">[内部]</span>

        通过装修单号获取调研信息

**请求参数**:

- **survey.sid**:
  调研ID

        **示例**:{
                "survey.sid": 1
            }

**返回参数**:

- **survey**: 调研 , 数据类型 *survey*
          - 类型: *Object*

        **示例**:{
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

    ### `makeSurvey` <span style="color:gray">[内部]</span>

        生成调研

        判断调研模版是否存在 , 不存在 , 错误信息 **130096 调研模版不存在**

**请求参数**:

- **survey.orderId**:
  装修单号
        - **survey.stid**:
  模版ID

        **示例**:{
                "survey.orderId": "1601010001",
                "survey.stid": 1
            }

    ### `sendSurvey` <span style="color:gray">[内部]</span>

        推送调研

        判断调研是否存在 , 不存在 , 错误信息 **330058 调研不存在**

        判断调研装修是否为0(初始) , 其他状态 , 错误信息 **330059 调研状态不可操作**

        更新状态为1(推送) , 更新推送时间/推送人

**请求参数**:

- **survey.sid**:
  调研ID

        **示例**:{
                "survey.sid": 1,

                "survey.items[0].siid": 1,
                "survey.items[0].content": "内容",

                "survey.items[0].options[0].soid": 1,
                "survey.items[0].options[0].checked": 1,
            }

    ### `handleSurvey` <span style="color:gray">[内部]</span>

        执行调研

        判断调研是否存在 , 不存在 , 错误信息 **330058 调研不存在**

        判断调研装修是否为1(推送) , 其他状态 , 错误信息 **330059 调研状态不可操作**

        更新状态为2(处理) , 更新完成时间

**请求参数**:

- **survey.sid**:
  调研ID

        - **survey.items[n].siid**:
  项目ID
        - **survey.items[n].content**:
  内容

        - **survey.items[n].options[n].soid**:
  选项ID
        - **survey.items[n].options[n].checked**:
  标识

        **示例**:{
                "survey.sid": 1,

                "survey.items[0].siid": 1,
                "survey.items[0].content": "内容",

                "survey.items[0].options[0].soid": 1,
                "survey.items[0].options[0].checked": 1,
            }

    ### `finishSurvey` <span style="color:gray">[内部]</span>

        完成

        判断调研是否存在 , 不存在 , 错误信息 **330058 调研不存在**

        判断调研装修是否为2(处理) , 其他状态 , 错误信息 **330059 调研状态不可操作**

        更新状态为3(完成) , 更新完成时间/完成人

**请求参数**:

- **survey.sid**:
  调研ID

        **示例**:{
                "survey.sid": 1
            }

### 会员

会员信息管理

## api.customer.EmemberAction

**数据类型**:

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

    ### `pageEmember` <span style="color:gray">[内部]</span>

        分页方式获取电子会员信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ .

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  电子会员信息列表 , 每条数据类型 *emember*

        **示例**:{
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

**请求参数**:

- **unionId**: 联合ID
          - 类型: *String*

        **示例**:{
                "unionId": "SDJ4SDF5"
            }

**返回参数**:

- **emember**: 电子会员信息 , 类型 :[emember](./customer.html#api.customer.EmemberAction.emember)
          - 类型: *Object*

        **示例**:{
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

**请求参数**:

- **emember.unionId**:
  联合ID
        - **emember.name**:
  姓名
        - **emember.phone**:
  电话
        - **emember.address**:
  地址
        - **emember.ticket**:
  票号
        - **securityCode**: 验证码
          - 类型: *String*
        - **verifyCode**: 校验码
          - 类型: *String*

        **示例**:{
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

**请求参数**:

- **emember.emid**:
  会员ID

        **示例**:{
                "emember.emid": 1
            }

### 群享

## api.customer.GroupAction

**数据类型**:

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

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  群信息列表 , 每条数据类型 *group*

        **示例**:{
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

**请求参数**:

- **group.opengid**:
  群编号

        **示例**:{
                "group.opengid": "0KJ6nAsYbfKA_hsRHB2MUgs"
            }

**返回参数**:

- **group**: 群信息 , 类型 :[group](./customer.html#api.customer.GroupAction.group)
          - 类型: *Object*

        **示例**:{
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

    ### `updateGroup` <span style="color:gray">[内部]</span>

        更新群信息

**请求参数**:

- **group.gid**:
  群ID
        - **group.name**:
  名称
        - **group.content**:
  说明

        **示例**:{
                "group.gid": 1,
                "group.name": "名称",
                "group.content": "说明",
            }

    ### <I-C> bindGroup

        绑定群信息

**请求参数**:

- **unionId**: 联合ID
          - 类型: *String*
        - **group.opengid**:
  群编号
        - **group.orderId**:
  装修单号

        **示例**:{
                "unionId": "SDJ4SDF5",
                "group.opengid": "0KJ6nAsYbfKA_hsRHB2MUgs",
                "group.orderId": "1601010001",
            }

    ### `unbindGroup` <span style="color:gray">[内部]</span>

        解绑群信息

**请求参数**:

- **group.gid**:
  群编号

        **示例**:{
                "group.gid": 1
            }

### 钉群

## api.customer.DroupAction

**数据类型**:

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

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  钉群信息列表 , 每条数据类型 *droup*

        **示例**:{
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

    ### `queryDroup` <span style="color:gray">[内部]</span>

        通过装修单号或者会话ID查询钉群信息

**请求参数**:

- **droup.decoration.orderId**:
  装修单号
        - **droup.chatId**:
  会话ID

        **示例**:{
                "droup.decoration.orderId:": "1601010001"
            }

**返回参数**:

- **oaleses**: 钉群信息列表 , 每条数据类型 *oales*
          - 类型: *List*

        **示例**:{
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

    ### `bindDroup` <span style="color:gray">[内部]</span>

        绑定

        判断归属装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**请求参数**:

- **droup.decoration.orderId**:
  装修单号
        - **droup.chatId**:
  会话ID
        - **droup.openId**:
  会话ID
        - **droup.type**:
  类型

        **示例**:{
                "droup.decoration.orderId:": "1601010001",
                "droup.chatId": "",
                "droup.openId": "",
                "droup.type": 1
            }

    ### `updateDroup` <span style="color:gray">[内部]</span>

        更新

**请求参数**:

- **droup.did**:
  钉群ID
        - **droup.isRead**:
  是否已读

        **示例**:{
                "droup.did:": 1,
                "droup.isRead": 0
            }

    ### `deleteDroup` <span style="color:gray">[内部]</span>

        删除

**请求参数**:

- **droup.did**:
  钉群ID

        **示例**:{
                "droup.did:": 1
            }

### 对话

## api.customer.ConversationAction

**数据类型**:

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

**请求参数**:

- **conversation.orderId**:
  装修单号

        **示例**:{
                "conversation.orderId:": "1601010001"
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  对话信息列表 , 每条数据类型 *conversation*

        **示例**:{
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

**请求参数**:

- **conversation.orderId**:
  装修单号
        - **conversation.name**:
  名称
        - **conversation.type**:
  类型
        - **conversation.contype**:
  内容类型
        - **conversation.content**:
  内容
        - **conversation.path**:
  路径
        - **conversation.filesize**:
  文件大小
        - **conversation.width**:
  宽度
        - **conversation.height**:
  高度
        - **conversation.focuser.userId**:
  关注人ID

        **示例**:{
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

**请求参数**:

- **conversation.orderId**:
  装修单号
        - **conversation.name**:
  名称
        - **conversation.type**:
  类型
        - **conversation.contype**:
  内容类型
        - **conversation.content**:
  内容
        - **conversation.path**:
  路径
        - **conversation.filesize**:
  文件大小
        - **conversation.width**:
  宽度
        - **conversation.height**:
  高度

        **示例**:{
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

    ### `deleteConversation` <span style="color:gray">[内部]</span>

        删除

**请求参数**:

- **conversation.cid**:
  对话ID

        **示例**:{
                "conversation.cid:": 1
            }

### 服务圈

## api.customer.CircleAction

**数据类型**:

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

**请求参数**:

- **unionId**: 联合主键
          - 类型: *String*

        **示例**:{
                "unionId": "SDJ4SDF5"
            }

**返回参数**:

- **circles**: 群信息 , 类型 *circle*
          - 类型: *List*

        **示例**:{
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

**请求参数**:

- **circle.orderId**:
  装修单号

        **示例**:{
                "circle.orderId": "1601010001"
            }

**返回参数**:

- **circles**: 群信息 , 类型 *circle*
          - 类型: *List*

        **示例**:{
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

**请求参数**:

- **circle.orderId**:
  装修单号
        - **circle.userId**:
  创建人编号
        - **circle.address**:
  地址
        - **circle.content**:
  内容
        - **circle.drawings[n].path**:
  图片

        **示例**:{
                "circle.orderId": "1601010001",
                "circle.userId": "U001",
                "circle.address": "地址",
                "circle.content": "说明内容",
                "circle.drawings[0].path": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png"
            }

    ### <I-C> updateCircleForPraise

        点赞

**请求参数**:

- **circle.cid**:
  服务圈ID

        **示例**:{
                "circle.cid": 1
            }

### 背景图

## api.customer.BackgroundAction

**数据类型**:

#### background

    - **bid**: 背景图ID
      - 类型: *Long*
    - **unionId**: 联合主键
      - 类型: *String*
    - **path**: 图片路径
      - 类型: *String*

    ### <I-C> queryBackground

        通过联合主键查询背景图信息

**请求参数**:

- **background.unionId**:
  联合主键

        **示例**:{
                "background.unionId": "SDJ4SDF5"
            }

**返回参数**:

- **background**: 背景图信息 , 类型 *background*
          - 类型: *Object*

        **示例**:{
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

**请求参数**:

- **background.unionId**:
  联合主键
        - **background.path**:
  图片路径

        **示例**:{
                "background.unionId": "SDJ4SDF5",
                "background.path": "2016/08/02/2/c7ec4da2429a4debbc3cca21eb5035b9.png"
            }
