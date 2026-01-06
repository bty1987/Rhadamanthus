# payment {#payment}

# 款项
## 合同

## api.payment.PaymentContractAction

        |DataType:|
        #### paymentContract

    - **pcid**: 合同ID
      - 类型: *Long*
    - **rtid**: 收据ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **paymentType**: 款项类型 , 0: 预付款 , 1: 装修款 , 2: 主材款 , 3: 销售款 , 4: 服务款 , 5: 活动款 , 6: 转换款 , 7: 代付款
      - 类型: *Short*
    - **download**: 下载地址
      - 类型: *String*
    - **viewpdf**: 查看地址
      - 类型: *String*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **signner**: 签署人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **comsignTime**: 公司签时间
      - 类型: *Timestamp*
    - **cussignTime**: 客户签时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 初始 , 1: 已签 , 2: 失效 , 3: 归档 , 4: 归档(本地)
      - 类型: *Short*
    
    ### <I> pagePaymentContract

        分页方式获取款项合同信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 款项合同信息列表 , 每条数据类型 *paymentContract*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "pcid": 1,
                            "rtid": 1,
                            "orderId": "1601010001",
                            "paymentType": 1,
                            "viewpdf": "JKLSHFD213J12GH312U32.pdf",
                            "download": "JKLSHFD213J12GH312U32.pdf",
                            "creater": {
                                "uid": 1,
                                "userId": "U0203",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "136xxxx1453",
                                ...
                            },
                            "signner": null,
                            "createTime": "2016-01-01 00:00:00",
                            "comsignTime": null,
                            "cussignTime": null,
                            "status": 0
                        },
                    ],
                    ...
                },
                ...
            }

    ### <C> pollingPaymentContract

        分页方式获取款项合同信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 款项合同信息列表 , 每条数据类型 *paymentContract*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "pcid": 1,
                            "rtid": 1,
                            "orderId": "1601010001",
                            "paymentType": 1,
                            "viewpdf": "JKLSHFD213J12GH312U32.pdf",
                            "download": "JKLSHFD213J12GH312U32.pdf",
                            "creater": {
                                "uid": 1,
                                "userId": "U0203",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "136xxxx1453",
                                ...
                            },
                            "signner": null,
                            "createTime": "2016-01-01 00:00:00",
                            "comsignTime": null,
                            "cussignTime": null,
                            "status": 0
                        },
                    ],
                    ...
                },
                ...
            }
    
    ### <I> queryPaymentContract

        通过装修单号获取合同信息
        
                |Requests:|
                :param paymentContract.rtid: 收据ID
        :type paymentContract.rtid: Long
        :param paymentContract.paymentType: 款项类型
        :type paymentContract.paymentType: Short
    
    
        Example::
        
            {
                "paymentContract.rtid": 1,
                "paymentContract.paymentType": 1
            }
            
                |Returns:|
                - **paymentContract**: 合同信息 , 类型 *paymentContract*
          - 类型: *List*
    
        Example::
        
            {
                ...
                "paymentContract": {
                    "pcid": 1,
                    "rtid": 1,
                    "orderId": "1601010001",
                    "paymentType": 1,
                    "viewpdf": "JKLSHFD213J12GH312U32.pdf",
                    "download": "JKLSHFD213J12GH312U32.pdf",
                    "creater": {
                        "uid": 1,
                        "userId": "U0203",
                        "userName": "王宁",
                        "currentName": "王宁",
                        "phone": "136xxxx1453",
                        ...
                    },
                    "signner": null,
                    "createTime": "2016-01-01 00:00:00",
                    "comsignTime": null,
                    "cussignTime": null,
                    "status": 0
                },
                ...
            }

    ### <I> sendPaymentContractForAuth

        发送认证通知
        
                |Requests:|
                :param paymentContract.pcid: 装修单号
        :type paymentContract.pcid: String
    
    
        Example::
        
            {
                "paymentContract.pcid": 1
            }

    ### <I> sendPaymentContract

        发送合同通知
        
        通过不同类型的控制 , 统一的跳转页面来判断当前通知合同的状态是否符合操作
        
        判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**
        
                |Requests:|
                :param paymentContract.pcid: 合同ID
        :type paymentContract.pcid: Long
        :param paymentContract.type: 类型 , 1: 签章, 2: 签订, 3: 查看 , 4: 下载
        :type paymentContract.type: Short
        
        Example::
        
            {
                "paymentContract.pcid": 1,
                "paymentContract.type": 1
            }

    ### <I> redirectPaymentContract

        跳转合同操作 , 根据发送合同通知的类型 , 响应对应功能的页面地址
        
        类型包括1(签章)/2(签订)/3(查看)/4(下载)
        
        判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
                |Requests:|
                :param paymentContract.pcid: 合同ID
        :type paymentContract.pcid: Long
        
        Example::
        
            {
                "paymentContract.pcid": 1
            }
            
                |Returns:|
                - **redirect**: 跳转地址
          - 类型: *String*
    
        Example::
        
            {
                ...
                "redirect": "http://redirect.com/redirect.html?type=view",
                ...
            }

    ### <I> viewPaymentContract

        查看合同
        
        判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**
        
                |Requests:|
                :param paymentContract.pcid: 合同ID
        :type paymentContract.pcid: Long
        
        Example::
        
            {
                "paymentContract.pcid": 1
            }
            
                |Returns:|
                - **redirect**: 跳转地址
          - 类型: *String*
    
        Example::
        
            {
                ...
                "redirect": "http://redirect.com/redirect.html?type=view",
                ...
            }
            
    ### <I> signPaymentContractForCustomer

        签订合同 , 针对客户信息
        
        判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**
        
        判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **150066 合同不可操作**
        
                |Requests:|
                :param paymentContract.pcid: 合同ID
        :type paymentContract.pcid: Long
        :param customer.cid: 客户ID
        :type customer.cid: Long
        
        Example::
        
            {
                "paymentContract.pcid": 1,
                "customer.cid": 1
            }
            
                |Returns:|
                - **redirect**: 跳转地址
          - 类型: *String*
    
        Example::
        
            {
                ...
                "redirect": "http://redirect.com/redirect.html?type=sign",
                ...
            }

    ### <I> signPaymentContractForCompany

        签订合同 , 针对公司信息
        
        判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**
        
        判断签章是否存在 , 不存在 , 错误信息 **130045 签章不存在**
        
        判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **150066 合同不可操作**
        
                |Requests:|
                :param paymentContract.pcid: 合同ID
        :type paymentContract.pcid: Long
        :param signet.sid: 签章ID
        :type signet.sid: Long
        
        Example::
        
            {
                "paymentContract.pcid": 1,
                "signet.sid": 1
            }

    ### <I> addPaymentContract

        创建合同
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
                |Requests:|
                :param paymentContract.orderId: 装修单号
        :type paymentContract.orderId: String
        :param paymentContract.paymentType: 款项类型
        :type paymentContract.paymentType: Short
        :param paymentContract.path: 文件路径
        :type paymentContract.path: String
        
        Example::
        
            {
                "paymentContract.orderId": "1601010001",
                "paymentContract.paymentType": 1,
                "paymentContract.path": 1
            }

    ### <I> affixPaymentContract

        签订合同
        
        判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**
        
        判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **150066 合同不可操作**
        
        更新装修合同为1(已签)
        
                |Requests:|
                :param paymentContract.pcid: 合同ID
        :type paymentContract.pcid: Long
        
        Example::
        
            {
                "paymentContract.pcid": 1
            }

    ### <I> expirePaymentContract

        失效合同
        
        判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**
        
        判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **150066 合同不可操作**
        
        更新装修合同为2(失效)
        
                |Requests:|
                :param paymentContract.pcid: 合同ID
        :type paymentContract.pcid: Long
        
        Example::
        
            {
                "paymentContract.pcid": 1
            }

            
    ### <I> filingPaymentContract

        归档合同
        
        判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**
        
        判断合同状态是否为1(已签) , 其他状态不可操作 , 错误信息 **150066 合同不可操作**
        
                |Requests:|
                :param paymentContract.pcid: 合同ID
        :type paymentContract.pcid: Long
        
        Example::
        
            {
                "paymentContract.pcid": 1
            }

## 收据

## api.payment.ReceiptAction

        |DataType:|
        #### receipt

    - **rid**: 收据ID
      - 类型: *Long*
    - **prid**: 款项收据ID
      - 类型: *Long*
    - **rtid**: 收据ID
      - 类型: *Long*
    - **no**: 收据编号
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **orderId**: 装修单号
      - 类型: *String*
    - **type**: 类型 , 0: 收款, 1: 退款
      - 类型: *Short*
    - **paymentType**: 款项类型 , 0: 预付款 , 1: 装修款 , 2: 主材款 , 3: 销售款 , 4: 服务款 , 5: 活动款 , 6: 转换款 , 7: 代付款
      - 类型: *Short*
    - **paymentName**: 款项名
      - 类型: *String*
    - **receiptType**: 收据类型 , 0: 现金 , 1: 银行 , 2: 转账 , 3: 对公 , 4: 分期 , 5: 优惠 , 6: 预付
      - 类型: *Short*
    - **money**: 金额
      - 类型: *Long*
    - **collectTime**: 收款时间
      - 类型: *Timestamp*
    - **company**: 公司
      - 类型: *Integer*
    
    ### <I> pageReceipt

        分页方式获取收据信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ . 
        
                |Returns:|
                Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "rid": 1,
                            "prid": 1,
                            "rtid": 1,
                            "no": "175"
                            "name": "现金",
                            "orderId": "1601010001",
                            "type": 1,
                            "paymentType": 2,
                            "paymentName": "款项收据",
                            "receiptType": 1,
                            "money": 100000,
                            "collectTime": "2016-01-01 00:00:00"
                        }
                    ],
                    ...
                },
                ...
            }

## 流水

## api.payment.StatementAction

        |DataType:|
        商户号/订单号/金额/费率/费用/时间
    
    #### statement

    - **sid**: 流水ID
      - 类型: *Long*
    - **custNo**: 商户号
      - 类型: *String*
    - **orderNo**: 订单号
      - 类型: *String*
    - **price**: 金额
      - 类型: *Integer*
    - **fee**: 手续费
      - 类型: *Integer*
    - **rate**: 费率
      - 类型: *Integer*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **payTime**: 付款时间
      - 类型: *Timestamp*
    - **type**: 类型
      - 类型: *Short*
    - **status**: 状态
      - 类型: *Short*
    
    ### <I> pageStatement

        分页方式获取流水信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ . 
        
                |Returns:|
                Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "custNo": "60026047",
                            "orderNo": "40109TTT4u",
                            "price": 10000
                            "fee": 0,
                            "rate": 0,
                            "createTime": "2016-01-01 00:00:00",
                            "payTime": "2016-01-01 00:00:00",
                            "type": 1
                        }
                    ],
                    ...
                },
                ...
            }

## 活动

## api.payment.PaymentActivityAction

        |DataType:|
        #### paymentActivity

    - **paid**: 活动ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **type**: 类型 , 0: 预付款 , 1: 装修款 , 2: 主材款 , 3: 销售款 , 4: 服务款
      - 类型: *Short*
    - **pid**: 款项ID
      - 类型: *Long*
    - **rid**: 收款ID
      - 类型: *Long*
    - **activity**: 活动 , 类型 [activity](./information.html#api.information.ActivityAction.activity)
      - 类型: *Integer*
    - **realMoney**: 实付额
      - 类型: *Integer*
    - **multiple**: 倍数
      - 类型: *Integer*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **comment**: 说明
      - 类型: *String*
    
    ### <I> pagePaymentActivity

        分页方式获取款项活动 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 款项活动信息列表 , 每条数据类型 *paymentActivity*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "paid": 1,
                            "orderId": "1601010001",
                            "type": 0,
                            "pid": 1,
                            "rid": 1,
                            "activity": {
                                "aid": 1,
                                "name": "test",
                                ...
                            },
                            "realMoney": 1000,
                            "multiple": 1,
                            "createTime": "2016-01-01 00:00:00",
                            "comment": "说明"
                        },
                    ],
                    ...
                },
                ...
            }
    
    ### <I> amountPaymentActivity

        获取款项活动总额
    
                |Requests:|
                :param paymentActivity.orderId: 装修单号
        :type paymentActivity.orderId: String
        :param paymentActivity.type: 类型
        :type paymentActivity.type: Short
        
        Example::
        
            {
                "paymentActivity.orderId": "1601010001",
                "paymentActivity.type": 0
            }

                |Returns:|
                - **amount**: 款项活动总额
          - 类型: *Long*
        
        Example::
        
            {
                ...
                "amount": 1000000,
                ...
            }
    
    ### <I> updatePaymentActivity

        更新款项活动
    
                |Requests:|
                :param paymentActivity.activity.aid: 活动ID
        :type paymentActivity.activity.aid: Long
        :param paymentActivity.comment: 说明
        :type paymentActivity.comment: String
        
        Example::
        
            {
                "paymentActivity.activity.aid": 1,
                "paymentActivity.comment": "说明"
            }
    
    ### <I> deletePaymentActivity

        更新款项活动
    
                |Requests:|
                :param paymentActivity.paid: 活动ID
        :type paymentActivity.paid: Long
        
        Example::
        
            {
                "paymentActivity.paid": 1
            }

## 预付款

预付款款项信息管理以及相关业务功能

## api.payment.AdvancePaymentAction

        |DataType:|
        #### advancePayment

    - **apid**: 预付款ID
      - 类型: *Long*
    - **customer**: 客户, 类型 [customer](./data.html#api.data.CustomerAction.customer)
      - 类型: *Object*
    - **decoration**: 装修单 , 类型: [decoration](./decoration.html#api.data.DecorationAction.decoration)
      - 类型: *Object*
    - **balance**: 合同预付款金额
      - 类型: *Long*
    - **projectBalance**: 工程预付款金额
      - 类型: *Long*
    - **materialBalance**: 主材预付款金额
      - 类型: *Long*
    - **zhenglinBalance**: 正林预付款金额
      - 类型: *Long*
    
    ### <I> pageAdvancePayment

        分页方式获取预付款 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 预付款信息列表 , 每条数据类型 *advancePayment*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "apid": 1,
                            "customer": {
                                "cid": 1,
                                "no": "1501010001",
                                "name": "李",
                            },
                            "decoration": {
                                "doid": 1,
                                "orderId": "1601010001",
                                "customer": {
                                    "cid": 1,
                                    "no": "1501010001",
                                    "name": "李",
                                },
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

                                "grade": "B",
                                "addition": {
                                    "diid": 1,
                                    "orderId": "1601010001",
                                    "designer": "设计师",
                                    "designDepartment": "设计一部",
                                    "designRegion": "设计一分区",
                                    "salesman": "业务员",
                                    "salesDepartment": "业务一部/业务二部",
                                    "salesRegion": "业务一分区/业务二分区"
                                }
                            },
                            "balanceAdvance": 0,
                            "projectAdvance" 0,
                            "materialAdvance" 0,
                            "zaterialAdvance" 0
                        },
                    ],
                    ...
                },
                ...
            }

    ### <I> queryAdvancePaymentByOrderId

        通过装修单号获取预付款金额
        
                |Requests:|
                :param advancePayment.orderId: 装修单号
        :type advancePayment.orderId: String
        
        Example::
        
            {
                "advancePayment.orderId": "1601010001"
            }
    
                |Returns:|
                - **balanceAdvance**: 合同预付款
          - 类型: *Long*
        - **projectAdvance**: 工程预付款
          - 类型: *Long*
        - **materialAdvance**: 主材预付款
          - 类型: *Long*
        - **zaterialAdvance**: 正林预付款
          - 类型: *Long*
        
        Example::
        
            {
                "balanceAdvance": 0,
                "projectAdvance" 0,
                "materialAdvance" 0,
                "zaterialAdvance" 0
            }
            
    ### <I> addAdvancePayment

        添加预付款
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
                |Requests:|
                :param advancePayment.orderId: 装修单号
        :type advancePayment.orderId: String
        
        Example::
        
            {
                "advancePayment.orderId": "1601010001"
            }
        
## api.payment.PaymentAction

        |DataType:|
        #### payment

    - **pid**: 款项ID
      - 类型: *Long*
    - **arid**: 收据ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **customer**: 客户信息 , 类型 [customer](./data.html#api.data.CustomerAction.customer)
      - 类型: *Object*
    - **balance**: 余额
      - 类型: *Long*
    - **recharge**: 操作金额
      - 类型: *Long*
    - **realMoney**: 实收金额
      - 类型: *Long*
    - **type**: 类型 , 包括: 0: 提现, 1: 收款, 2: 付款 , 3: 退款
      - 类型: *Short*
    - **paymentType**: 款项类型 , 包括: 0: 合同, 1:工程, 2: 主材, 3: 正林
      - 类型: *Short*
    - **collecter**: 收款人, 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **collectTime**: 收款时间
      - 类型: *Timestamp*
    - **confirmer**: 确认人, 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **confirmTime**: 确认时间
      - 类型: *Timestamp*
    - **status**: 状态, 包括: 0: 初始 , 1: 已付款, 2: 已确认, 3: 已撤销
      - 类型: *Short*
    
    - **transfer**: 转款
      - 类型: *Long*
    - **cash**: 现金
      - 类型: *Long*
    - **cashInfo**: 现金信息
      - 类型: *String*
    - **bank**: 刷卡
      - 类型: *Long*
    - **bankInfo**: 刷卡信息
      - 类型: *String*
    - **checkv**: 转账
      - 类型: *Long*
    - **checkvBank**: 转账银行
      - 类型: *String*
    - **installment**: 分期
      - 类型: *Long*
    - **installmentBank**: 分期银行
      - 类型: *String*
    - **accounts**: 对公
      - 类型: *Long*
    - **accountsBank**: 对公银行
      - 类型: *String*
    - **company**: 公司ID
      - 类型: *Integer*
    - **comment**: 说明
      - 类型: *String*
    
    #### advanceReceipt

    - **arid**: 收据ID
      - 类型: *Long*
    - **collecter**: 收款人, 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **collectTime**: 收款时间
      - 类型: *Timestamp*
    - **confirmer**: 确认人, 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **confirmTime**: 确认时间
      - 类型: *Timestamp*
    - **realMoney**: 实收金额
      - 类型: *Long*
    
    - **transfer**: 转款
      - 类型: *Long*
    - **cash**: 现金
      - 类型: *Long*
    - **cashInfo**: 现金信息
      - 类型: *String*
    - **bank**: 刷卡
      - 类型: *Long*
    - **bankInfo**: 刷卡信息
      - 类型: *String*
    - **checkv**: 转账
      - 类型: *Long*
    - **checkvBank**: 转账银行
      - 类型: *String*
    - **installment**: 分期
      - 类型: *Long*
    - **installmentBank**: 分期银行
      - 类型: *String*
    - **accounts**: 对公
      - 类型: *Long*
    - **accountsBank**: 对公银行
      - 类型: *String*
    - **comment**: 说明
      - 类型: *String*
    
    ### <I> pagePayment

        分页方式获取已付款预付款信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ . 
        
        根据当前操作公司作为条件查询对应公司的预付款
        
                |Requests:|
                :param payment.status: 状态
        :type payment.status: Short
        :param payment.type: 类型
        :type payment.type: Short
        :param payment.company: 公司
        :type payment.company: String
                
        Example::
        
            {
                "payment.status": 1,
                "payment.type": 0,
                "payment.company": "company"
            }
        
                |Returns:|
                Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "pid": 1,
                            "arid": 1,
                            "orderId": "1601010001",
                            "type": 1,
                            "paymentType": 0,
                            "recharge": 1000,
                            "balance": 1000,
                            "customer": {
                                "cid": 1,
                                "no": "1501010001",
                                "name": "李",
                                "address": "",
                                "gender": "男",
                                "qq": "111",
                                "wechat": "333",
                                "email": "111@qq.com"
                            },
                            "collecter": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "collectTime": "2017-04-22 10:26:32",
                            "confirmer": {
                                "uid": null,
                                "userId": null,
                                "userName": null,
                                "currentName": null,
                                "duty": null
                            },
                            "confirmTime": null,
                            "status": 1,
                            
                            "transfer": 0,
                            "cash": 1000,
                            "cashInfo": "157",
                            "bank": 0,
                            "bankInfo": "",
                            "checkv": 0,
                            "checkvBank": "",
                            "accounts": 0,
                            "accountsBank": "",
                            "installment": 0,
                            "installmentBank": "",
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I> queryPaymentByOrderId

        通过装修单号获取预付款信息
        
                |Requests:|
                :param payment.orderId: 装修单号
        :type payment.orderId: String
        
        Example::
        
            {
                "payment.orderId": "1601010001"
            }
            
                |Returns:|
                - **payments**: 预付款信息列表 , 每条数据类型 *payment*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "data": [
                    {
                        "pid": 1,
                        "arid": 1,
                        "orderId": "1601010001",
                        "type": 1,
                        "paymentType": 0,
                        "recharge": 1000,
                        "balance": 1000,
                        "customer": {
                            "cid": 1,
                            "no": "1501010001",
                            "name": "李",
                            "address": "",
                            "gender": "男",
                            "qq": "111",
                            "wechat": "333",
                            "email": "111@qq.com",
                            "relationshipType": "企业高端客户"
                        },
                        "collecter": {
                            "uid": 1,
                            "userId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师"
                        },
                        "collectTime": "2017-04-22 10:26:32",
                        "confirmer": {
                            "uid": null,
                            "userId": null,
                            "userName": null,
                            "currentName": null,
                            "duty": null
                        },
                        "confirmTime": null,
                        "status": 1,
                        
                        "transfer": 0,
                        "cash": 1000,
                        "cashInfo": "157",
                        "bank": 0,
                        "bankInfo": "",
                        "checkv": 0,
                        "checkvBank": "",
                        "accounts": 0,
                        "accountsBank": "",
                        "installment": 0,
                        "installmentBank": "",
                        "comment": ""
                    }
                ],
                ...
            }
            
    ### <I-C> queryPaymentByPaymentId

        通过预付款ID获取预付款信息
        
        判断预付款款项信息是否存在 , 不存在 , 错误信息 **150026 款项不存在**
        
                |Requests:|
                :param payment.paymentId: 预付款ID
        :type payment.paymentId: Long
        
        Example::
        
            {
                "payment.paymentId": 1
            }
            
                |Returns:|
                - **payment**: 预付款信息 , 数据类型 *payment*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "payment": {
                    "pid": 1,
                    "arid": 1,
                    "orderId": "1601010001",
                    "type": 1,
                    "paymentType": 0,
                    "recharge": 1000,
                    "balance": 1000,
                    "customer": {
                        "cid": 1,
                        "no": "1501010001",
                        "name": "李",
                        "address": "",
                        "gender": "男",
                        "qq": "111",
                        "wechat": "333",
                        "email": "111@qq.com",
                        "relationshipType": "企业高端客户",
                    },
                    "collecter": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "collectTime": "2017-04-22 10:26:32",
                    "confirmer": {
                        "uid": null,
                        "userId": null,
                        "userName": null,
                        "currentName": null,
                        "duty": null
                    },
                    "confirmTime": null,
                    "status": 1,
                    
                    "transfer": 0,
                    "cash": 1000,
                    "cashInfo": "157",
                    "bank": 0,
                    "bankInfo": "",
                    "checkv": 0,
                    "checkvBank": "",
                    "accounts": 0,
                    "accountsBank": "",
                    "installment": 0,
                    "installmentBank": "",
                    "comment": ""
                }
                ...
            }

    ### <I> sendPayment

        推送预付款
        
        验证预付款信息是否存在 , 不存在 , 错误信息 **150003 款项不存在**
        
                |Requests:|
                :param payment.pid: 预付款ID
        :type payment.pid: Long
        
        Example::
        
            {
                "payment.pid": 1
            }

    ### <I> addPayment

        创建预付款
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
                |Requests:|
                :param payment.orderId: 装修单号
        :type payment.orderId: String
        :param payment.recharge: 操作金额
        :type payment.recharge: Long
        :param payment.paymentType: 类型
        :type payment.paymentType: Short
        
        Example::
        
            {
                "payment.orderId": "1601010001",
                "payment.recharge": 100,
                "payment.paymentType": 0
            }
            
    ### <I> collectPayment

        预付款收款 , 同时生成预付款款项和收据信息
        
        判断客户信息是否存在 , 不存在 , 错误信息 **230001 客户信息不存在**
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        判断预付款类型 , 0(合同)/2(主材)之外的其他类型 , 错误信息 **150028 预付款类型错误**
        
        判断操作类型是否为1(收款) , 其他操作类型 , 错误信息 **150016 预付款操作不正确**
        
        判断预付款类型为2(主材) , 更新归属装修单
        
        如果预付款类型为2(主材) , 更新装修单中的销售比例 , 包括预付款(主材)/销售款
        
                |Requests:|
                :param payment.orderId: 装修单号
        :type payment.orderId: String
        :param payment.customer.cid: 客户ID
        :type payment.customer.cid: Long
        :param payment.recharge: 操作金额
        :type payment.recharge: Long
        :param payment.realMoney: 实收金额
        :type payment.realMoney: Long
        :param payment.cash: 现金
        :type payment.cash: Long
        :param payment.cashInfo: 现金信息
        :type payment.cashInfo: String
        :param payment.bank: 刷卡
        :type payment.bank: Long
        :param payment.bankInfo: 刷卡信息
        :type payment.bankInfo: String
        :param payment.checkv: 转账
        :type payment.checkv: Long
        :param payment.checkvBank: 转账银行
        :type payment.checkvBank: String
        :param payment.installment: 分期
        :type payment.installment: Long
        :param payment.installmentBank: 分期银行
        :type payment.installmentBank: String
        :param payment.accounts: 对公
        :type payment.accounts: Long
        :param payment.accountsBank: 对公银行
        :type payment.accountsBank: String
        :param payment.comment: 说明
        :type payment.comment: String
        
        Example::
        
            {
                "payment.orderId": "1601010001",
                "payment.customer.cid": 1,
                "payment.recharge": 100,
                "payment.realMoney": 10000,
                "payment.cash": 10000,
                "payment.cashInfo": "175",
                "payment.bank": 10000,
                "payment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
                "payment.checkv": 10000,
                "payment.checkvBank": "189",
                "payment.installment": 10000
                "payment.installmentBank": "201",
                "payment.accounts": 10000,
                "payment.accountsBank": "201",
                "payment.comment": "说明",
            }
            
    ### <I> confirmPayment

        预付款确认
        
                |Requests:|
                :param pids[n]: 预付款ID列表 , 每条数据类型 Long
        :type pids[n]: List
        
        Example::
        
            {
                "pids[0]": 1
            }
            
    ### <I> withdrawPayment

        预付款提现
        
        判断客户信息是否存在 , 不存在 , 错误信息 **客户信息不存在**
        
        判断客户预付款信息是否存在 , 不存在 , 错误信息 **150010 预付款余额不足**
        
        判断预付款余额是否可供提现金额 , 余额不足 , 错误信息 **150010 预付款余额不足**
        
        如果预付款类型为2(主材) , 更新装修单中的销售比例 , 包括预付款(主材)/销售款
        
                |Requests:|
                :param payment.orderId: 装修单号
        :type payment.orderId: String
        :param payment.customer.cid: 客户ID
        :type payment.customer.cid: Long
        :param payment.cash: 现金
        :type payment.cash: Long
        :param payment.cashInfo: 现金说明
        :type payment.cashInfo: String
        :param payment.bank: 刷卡
        :type payment.bank: Long
        :param payment.bankInfo: 刷卡说明
        :type payment.bankInfo: String
        :param payment.paymentType: 款项类型
        :type payment.paymentType: String
        :param payment.type: 类型
        :type payment.type: String
        :param payment.comment: 说明
        :type payment.comment: String
        
        Example::
        
            {
                "payment.orderId": "1601010001",
                "payment.customer.cid": 1,
                "payment.cash": 100,
                "payment.cashInfo": 175,
                "payment.paymengType": "主材预付款",
                "payment.type": "提现",
                "payment.comment": "说明"
            }
            
    ### <I> payPayment

        预付款付款，更新预付款余额，新增预付款支付明细
        
        判断客户信息是否存在 , 不存在 , 错误信息 **客户信息不存在**
        
        判断客户预付款信息是否存在 , 不存在 , 错误信息 **150010 预付款余额不足**
        
        判断预付款余额是否可供提现金额 , 余额不足 , 错误信息 **150010 预付款余额不足**

                |Requests:|
                :param payment.orderId: 装修单号
        :type payment.orderId: String
        :param payment.paymentType: 款项类型
        :type payment.paymentType: String
        :param payment.comment: 说明
        :type payment.comment: String
        :param payment.transfer: 转款
        :type payment.transfer: Long

        Example::

            {
                "payment.orderId": "1601010001",
                "payment.paymentType": "合同预付款",
                "payment.comment": "",
                "payment.transfer": 1000
            }
            
    ### <I> updatePayment

        更新预付款收款方式信息
        
        判断预付款是否存在 , 不存在 , 错误信息 **150003 款项不存在**
        
        预付款状态1(已付款) , 其他状态不可更新 , 错误信息 **150036 款项状态不可操作**
        
        预付款修改之后金额与应收额不等 , 不可更新 , 错误信息 **150025 款项金额不正确**
        
                |Requests:|
                :param payment.pid: 预付款ID
        :type payment.pid: Long
        :param payment.cash: 现金
        :type payment.cash: Long
        :param payment.cashInfo: 现金信息
        :type payment.cashInfo: String
        :param payment.bank: 刷卡
        :type payment.bank: Long
        :param payment.bankInfo: 刷卡信息
        :type payment.bankInfo: String
        :param payment.checkv: 转账
        :type payment.checkv: Long
        :param payment.checkvBank: 转账银行
        :type payment.checkvBank: String
        :param payment.installment: 分期
        :type payment.installment: Long
        :param payment.installmentBank: 分期银行
        :type payment.installmentBank: String
        :param payment.accounts: 对公
        :type payment.accounts: Long
        :param payment.accountsBank: 对公银行
        :type payment.accountsBank: String
        :param payment.comment: 说明
        :type payment.comment: String
        
        Example::
        
            {
                "payment.pid": 1,
                "payment.cash": 10000,
                "payment.cashInfo": "175",
                "payment.bank": 10000,
                "payment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
                "payment.checkv": 10000,
                "payment.checkvBank": "189",
                "payment.installment": 10000
                "payment.installmentBank": "201",
                "payment.accounts": 10000,
                "payment.accountsBank": "201",
                "payment.comment": "说明",
            }
            
## 装修款

装修款款项信息管理以及相关业务功能

## api.payment.DecorationPaymentAction

        |DataType:|
        #### decorationPayment

    - **dpid**: 款项ID
      - 类型: *Long*
    - **drid**: 收据ID
      - 类型: *Long*
    - **ptid**: 款项类型ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **decoration**: 装修单 , 类型 [decoration](./decoration.html#api.decoration.decorationAction.decoration)
      - 类型: *Object*
    - **paymentType**: 款项类型
      - 类型: *String*
    - **onetype**: 一类 , 0: 收款, 1: 退款 , 2: 历史
      - 类型: *Short*
    - **twotype**: 二类 , 0: 基础 , 1: 合同 , 2: 增减 , 3: 其他
      - 类型: *Short*
    - **paymentStatus**: 款项状态, 0:初始, 1:已付款, 2:已确认 , 3: 审批中 , 4: 历史
      - 类型: *Short*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **collecter**: 收款人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **collectTime**: 收款时间
      - 类型: *Timestamp*
    - **confirmer**: 确认人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **confirmTime**: 确认时间
      - 类型: *Timestamp*
    - **referMoney**: 应收款
      - 类型: *Long*
    - **realMoney**: 实收金额
      - 类型: *Long*
    - **sort**: 排序
      - 类型: *Short*
    
    - **cash**: 现金
      - 类型: *Long*
    - **cashInfo**: 现金信息
      - 类型: *String*
    - **bank**: 刷卡
      - 类型: *Long*
    - **bankInfo**: 刷卡信息 , **#** 分隔多条刷卡信息, **|** 分隔信息中不同字段 , 由 **类型|金额|时间** 组成 , 例如: **#187|15000|2016-03-23 14:25:15#**
      - 类型: *String*
    - **checkv**: 转账
      - 类型: *Long*
    - **checkvBank**: 转账银行
      - 类型: *String*
    - **installment**: 分期
      - 类型: *Long*
    - **installmentBank**: 分期银行
      - 类型: *String*
    - **accounts**: 对公
      - 类型: *Long*
    - **accountsBank**: 对公银行
      - 类型: *String*
    - **coupon**: 券值
      - 类型: *Long*
    - **couponInfo**: 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
      - 类型: *String*
    - **advance**: 预付款
      - 类型: *Long*
    - **advanceType**: 预付款类型 , 1: 合同预付款 , 2: 工程预付款
      - 类型: *Short*
    - **company**: 公司ID
      - 类型: *Integer*
    - **comment**: 说明
      - 类型: *String*
    
    #### decorationReceipt

    - **drid**: 收据ID
      - 类型: *Long*
    - **collecter**: 收款人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **collectTime**: 收款时间
      - 类型: *Timestamp*
    - **confirmer**: 确认人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **confirmTime**: 确认时间
      - 类型: *Timestamp*
    - **realMoney**: 实收金额
      - 类型: *Long*
    - **cash**: 现金
      - 类型: *Long*
    - **cashInfo**: 现金信息
      - 类型: *String*
    - **bank**: 刷卡
      - 类型: *Long*
    - **bankInfo**: 刷卡信息 , **#** 分隔多条刷卡信息, **|** 分隔信息中不同字段 , 由 **类型|金额|时间** 组成 , 例如: **#187|15000|2016-03-23 14:25:15#**
      - 类型: *String*
    - **checkv**: 转账
      - 类型: *Long*
    - **checkvBank**: 转账银行
      - 类型: *String*
    - **installment**: 分期
      - 类型: *Long*
    - **installmentBank**: 分期银行
      - 类型: *String*
    - **accounts**: 对公
      - 类型: *Long*
    - **accountsBank**: 对公银行
      - 类型: *String*
    - **coupon**: 券值
      - 类型: *Long*
    - **couponInfo**: 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
      - 类型: *String*
    - **advance**: 预付款
      - 类型: *Long*
    - **advanceType**: 预付款类型 , 1: 合同预付款 , 2: 工程预付款
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*
    
    ### <I> pageDecorationPayment

        分页方式获取装修收款信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Requests:|
                :param decorationPayment.paymentStatus: 状态
        :type decorationPayment.paymentStatus: Short
        :param decorationPayment.oneType: 类型
        :type decorationPayment.oneType: Short
        :param decorationPayment.twoType: 类型
        :type decorationPayment.twoType: Short
        
        Example::
        
            {
                "decorationPayment.paymentStatus": 1,
                "decorationPayment.oneType": 0,
                "decorationPayment.twoType": 0
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 装修收款信息列表 , 每条数据类型 *decorationPayment*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "dpid": 1,
                            "drid": 1,
                            "ptid": 1,
                            "decoration":{
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
                                "creater": {
                                    "uid": 1,
                                    "userId": "FL-02381",
                                    "userName": "王宁",
                                    "currentName": "王宁",
                                    "phone": "136xxxx1453",
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
                                
                                "designDepartment": "设计中心一部",
                                "designRegion": "设计一分区",
                                "businessDepartment": "市场营销一部",
                                ...
                            },
                            "paymentType": "首付款",
                            "onetype": 0,
                            "twotype": 1,
                            "paymentStatus": 0,
                            "creater": {
                                "uid": 1,
                                "userId": "FL-02381",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "136xxxx1453",
                                ...
                            },
                            "createTime": "2016-01-01 00:00:00",
                            "collecter": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "collectTime": "2017-04-22 10:26:32",
                            "confirmer": {
                                "uid": null,
                                "userId": null,
                                "userName": null,
                                "currentName": null,
                                "duty": null
                            },
                            "confirmTime": null,
                            "referMoney": 16000,
                            "realMoney": 16000,
                            "cash": 16000,
                            "cashInfo": "157",
                            "bank": 0,
                            "bankInfo": "",
                            "checkv": 0,
                            "checkvBank": "",
                            "installment": 0,
                            "installmentBank": "",
                            "accounts": 0,
                            "accountsBank": "",
                            "coupon": 0,
                            "couponInfo": "",
                            "advance": 0,
                            "advanceType": 0,
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <I> queryDecorationPaymentByOrderId

        通过装修单号获取装修款项信息
        
                |Requests:|
                :param decorationPayment.orderId: 装修单号
        :type decorationPayment.orderId: String
        
        Example::
        
            {
                "decorationPayment.orderId": "1601010001"
            }
            
                |Returns:|
                - **decorationPayments**: 装修款项信息列表 , 每条数据类型 *decorationPayment*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "decorationPayments": [
                    {
                        "dpid": 1,
                        "drid": 1,
                        "ptid": 1,
                        "decoration":{
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
                            "creater": {
                                "uid": 1,
                                "userId": "FL-02381",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "136xxxx1453",
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
                            
                            "designDepartment": "设计中心一部",
                            "designRegion": "设计一分区",
                            "businessDepartment": "市场营销一部",
                            ...
                        },
                        "paymentType": "首付款",
                        "onetype": 0,
                        "twotype": 1,
                        "paymentStatus": 0,
                        "creater": {
                            "uid": 1,
                            "userId": "FL-02381",
                            "userName": "王宁",
                            "currentName": "王宁",
                            "phone": "136xxxx1453",
                            ...
                        },
                        "createTime": "2016-01-01 00:00:00",
                        "collecter": {
                            "uid": 1,
                            "userId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师"
                        },
                        "collectTime": "2017-04-22 10:26:32",
                        "confirmer": {
                            "uid": null,
                            "userId": null,
                            "userName": null,
                            "currentName": null,
                            "duty": null
                        },
                        "confirmTime": null,
                        "referMoney": 16000,
                        "realMoney": 16000,
                        "cash": 16000,
                        "cashInfo": "157",
                        "bank": 0,
                        "bankInfo": "",
                        "checkv": 0,
                        "checkvBank": "",
                        "installment": 0,
                        "installmentBank": "",
                        "accounts": 0,
                        "accountsBank": "",
                        "coupon": 0,
                        "couponInfo": "",
                        "advance": 0,
                        "advanceType": 0,
                        "comment": ""
                    }
                ],
                ...
            }
            
    ### <I> queryDecorationPaymentForContractByOrderId

        通过装修单号获取装修款项信息 , 款项一类为0(收款) , 二类1(合同)
        
                |Requests:|
                :param decorationPayment.orderId: 装修单号
        :type decorationPayment.orderId: String
        
        Example::
        
            {
                "decorationPayment.orderId": "1601010001"
            }
            
                |Returns:|
                - **decorationPayments**: 装修款项信息列表 , 每条数据类型 *decorationPayment*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "decorationPayments": [
                    {
                        "dpid": 1,
                        "drid": 1,
                        "ptid": 1,
                        "decoration":{
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
                            "creater": {
                                "uid": 1,
                                "userId": "FL-02381",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "136xxxx1453",
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
                            
                            "designDepartment": "设计中心一部",
                            "designRegion": "设计一分区",
                            "businessDepartment": "市场营销一部",
                            ...
                        },
                        "paymentType": "首付款",
                        "onetype": 0,
                        "twotype": 1,
                        "paymentStatus": 0,
                        "creater": {
                            "uid": 1,
                            "userId": "FL-02381",
                            "userName": "王宁",
                            "currentName": "王宁",
                            "phone": "136xxxx1453",
                            ...
                        },
                        "createTime": "2016-01-01 00:00:00",
                        "collecter": {
                            "uid": 1,
                            "userId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师"
                        },
                        "collectTime": "2017-04-22 10:26:32",
                        "confirmer": {
                            "uid": null,
                            "userId": null,
                            "userName": null,
                            "currentName": null,
                            "duty": null
                        },
                        "confirmTime": null,
                        "referMoney": 16000,
                        "realMoney": 16000,
                        "cash": 16000,
                        "cashInfo": "157",
                        "bank": 0,
                        "bankInfo": "",
                        "checkv": 0,
                        "checkvBank": "",
                        "installment": 0,
                        "installmentBank": "",
                        "accounts": 0,
                        "accountsBank": "",
                        "coupon": 0,
                        "couponInfo": "",
                        "advance": 0,
                        "advanceType": 0,
                        "comment": ""
                    }
                ],
                ...
            }
            
    ### <I> queryDecorationPaymentForNotInitByDrId

        通过装修收据ID获取状态为未付款的装修款项
        
                |Requests:|
                :param decorationReceipt.drid: 收据ID
        :type decorationReceipt.drid: Long
        
        Example::
        
            {
                "decorationReceipt.drid": 1
            }
            
                |Returns:|
                - **decorationPayments**: 装修款项信息列表 , 每条数据类型 *decorationPayment*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "decorationPayments": [
                    {
                        "dpid": 1,
                        "drid": 1,
                        "ptid": 1,
                        "decoration":{
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
                            "creater": {
                                "uid": 1,
                                "userId": "FL-02381",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "136xxxx1453",
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
                            
                            "designDepartment": "设计中心一部",
                            "designRegion": "设计一分区",
                            "businessDepartment": "市场营销一部",
                            ...
                        },
                        "paymentType": "首付款",
                        "onetype": 0,
                        "twotype": 1,
                        "paymentStatus": 0,
                        "creater": {
                            "uid": 1,
                            "userId": "FL-02381",
                            "userName": "王宁",
                            "currentName": "王宁",
                            "phone": "136xxxx1453",
                            ...
                        },
                        "createTime": "2016-01-01 00:00:00",
                        "collecter": {
                            "uid": 1,
                            "userId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师"
                        },
                        "collectTime": "2017-04-22 10:26:32",
                        "confirmer": {
                            "uid": null,
                            "userId": null,
                            "userName": null,
                            "currentName": null,
                            "duty": null
                        },
                        "confirmTime": null,
                        "referMoney": 16000,
                        "realMoney": 16000,
                        "cash": 16000,
                        "cashInfo": "157",
                        "bank": 0,
                        "bankInfo": "",
                        "checkv": 0,
                        "checkvBank": "",
                        "installment": 0,
                        "installmentBank": "",
                        "accounts": 0,
                        "accountsBank": "",
                        "coupon": 0,
                        "couponInfo": "",
                        "advance": 0,
                        "advanceType": 0,
                        "comment": ""
                    }
                ],
                ...
            }

    ### <I-C> queryDecorationPaymentByDpid

        通过款项ID获取装修收据信息
        
                |Requests:|
                :param decorationPayment.dpid: 装修款ID
        :type decorationPayment.dpid: Long
        
        Example::
        
            {
                "decorationPayment.dpid": 1
            }
            
                |Returns:|
                - **decorationPayment**: 装修款信息 , 类型 *decorationPayment*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "decorationPayment": {
                    "dpid": 1,
                    "drid": 1,
                    "ptid": 1,
                    "decoration":{
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
                        "creater": {
                            "uid": 1,
                            "userId": "FL-02381",
                            "userName": "王宁",
                            "currentName": "王宁",
                            "phone": "136xxxx1453",
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
                        
                        "designDepartment": "设计中心一部",
                        "designRegion": "设计一分区",
                        "businessDepartment": "市场营销一部",
                        ...
                    },
                    "paymentType": "首付款",
                    "onetype": 0,
                    "twotype": 1,
                    "paymentStatus": 0,
                    "creater": {
                        "uid": 1,
                        "userId": "FL-02381",
                        "userName": "王宁",
                        "currentName": "王宁",
                        "phone": "136xxxx1453",
                        ...
                    },
                    "createTime": "2016-01-01 00:00:00",
                    "collecter": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "collectTime": "2017-04-22 10:26:32",
                    "confirmer": {
                        "uid": null,
                        "userId": null,
                        "userName": null,
                        "currentName": null,
                        "duty": null
                    },
                    "confirmTime": null,
                    "referMoney": 16000,
                    "realMoney": 16000,
                    "cash": 16000,
                    "cashInfo": "157",
                    "bank": 0,
                    "bankInfo": "",
                    "checkv": 0,
                    "checkvBank": "",
                    "installment": 0,
                    "installmentBank": "",
                    "accounts": 0,
                    "accountsBank": "",
                    "coupon": 0,
                    "couponInfo": "",
                    "advance": 0,
                    "advanceType": 0,
                    "comment": ""
                }
                ...
            }
            
    ### <I> queryDecoraionReceiptByDrId

        通过收据ID获取装修收据信息
        
                |Requests:|
                :param decorationReceipt.drid: 收据ID
        :type decorationReceipt.drid: Long
        
        Example::
        
            {
                "decorationReceipt.drid": 1
            }
            
                |Returns:|
                - **decorationReceipt**: 装修收据信息 , 类型 *decorationReceipt*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "decorationReceipt": {
                    "drid": 24,
                    "collecter": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "collectTime": "2017-04-22 10:26:32",
                    "confirmer": {
                        "uid": null,
                        "userId": null,
                        "userName": null,
                        "currentName": null,
                        "duty": null
                    },
                    "confirmTime": null,
                    "realMoney": 16000,
                    "cash": 700,
                    "cashInfo": "157",
                    "bank": 200,
                    "bankInfo": "#175|100|2015-12-05 11:11:11#175|100|2015-12-05 11:11:11#",
                    "checkv": 100,
                    "checkvBank": "158",
                    "installment": 100,
                    "installmentBank": "187",
                    "accounts": 100,
                    "accountsBank": "190",
                    "advance": 0,
                    "advanceType": 0,
                    "coupon": 200,
                    "couponInfo": "#物业费抵值券:100#赠品抵现:100#",
                    "comment": ""
                }
                ...
            }

    ### <I> sendDecorationPayment

        推送装修款
        
        判断装修款信息是否存在 , 不存在 , 错误信息 **150003 款项不存在**
        
                |Requests:|
                :param decorationPayment.dpid: 装修款ID
        :type decorationPayment.dpid: Long

        Example::
        
            {
                "decorationPayment.dpid": 1
            }
            
    ### <I> checkDecorationPayment

        判断装修款是否可以进行收款
        
        判断当前款项状态是否为0(初始) , 错误信息 **150008 款项不能进行收款**
        
                |Requests:|
                :param decorationPayment.dpid: 款项ID
        :type decorationPayment.dpid: Long
        
        Example::
        
            {
                "decorationPayment.dpid": 1
            }
            
    ### <I> addDecorationPayment

        添加装修收款信息
        
        判断装修单是否存在 , 不存在添加失败 , 错误信息 **140013 订单不存在**
        
        判断装修款类型 , 增项款/减项款/合同退款/违约金 , 其他类型 , 错误信息 **150034 款项类型不可用**
        
                |Requests:|
                :param decorationPayment.orderId: 装修单号
        :type decorationPayment.orderId: String
        :param decorationPayment.ptid: 款项类型ID
        :type decorationPayment.ptid: Long
        :param decorationPayment.referMoney: 生成金额
        :type decorationPayment.referMoney: Long
        
        Example::
        
            {
                "decorationPayment.orderId": "1601010001",
                "decorationPayment.ptid": 1,
                "decorationPayment.referMoney": 600000
            }
            
    ### <I> changeDecorationPaymentForTime

        修改装修款项收款和确认时间
        
                |Requests:|
                :param decorationPayment.orderId: 装修单号
        :type decorationPayment.orderId: String
        :param decorationPayment.paymentType: 款项类型
        :type decorationPayment.paymentType: String
        - **dateTime**: 修改时间
          - 类型: *Timestamp*
        
        Example::
        
            {
                "decorationPayment.orderId": "1601010001",
                "decorationPayment.paymentType": "首付款",
                "dateTime": "2016-01-01 00:00:00"
            }
            
    ### <I> collectDecorationPayment

        装修款项收款
        
        判断装修单信息是否存在 , 不存在 , 错误信息 **150003 款项不存在**
        
        判断装修款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**
        
        根据操作款项中排序判断前置款项是否已经收款或确认 , 如果未收款或确认 , 错误信息 **150009 前置款项未处理**
        
        判断提交款项方式汇总金额与装修款应付金额是否相等 , 不相等 , 错误信息 **150008 款项不能进行收款**
        
        收款方式包括预付款 , 判断操作金额是否满足预付款余额 , 余额不足 , 错误信息 **150010 预付款余额不足**
        
        装修款公司信息根据收款人操作公司进行更新
        
        更新归属装修单的付款比例
        
                |Requests:|
                :param decorationPayment.dpid: 款项ID
        :type decorationPayment.dpid: Long
        :param decorationPayment.realMoney: 实收金额
        :type decorationPayment.realMoney: Long
        :param decorationPayment.cash: 现金
        :type decorationPayment.cash: Long
        :param decorationPayment.cashInfo: 现金信息
        :type decorationPayment.cashInfo: String
        :param decorationPayment.bank: 刷卡
        :type decorationPayment.bank: Long
        :param decorationPayment.bankInfo: 刷卡信息
        :type decorationPayment.bankInfo: String
        :param decorationPayment.checkv: 转账
        :type decorationPayment.checkv: Long
        :param decorationPayment.checkvBank: 转账银行
        :type decorationPayment.checkvBank: String
        :param decorationPayment.installment: 分期
        :type decorationPayment.installment: Long
        :param decorationPayment.installmentBank: 分期银行
        :type decorationPayment.installmentBank: String
        :param decorationPayment.accounts: 对公
        :type decorationPayment.accounts: Long
        :param decorationPayment.accountsBank: 对公银行
        :type decorationPayment.accountsBank: String
        :param decorationPayment.coupon: 券值
        :type decorationPayment.coupon: Long
        :param decorationPayment.couponInfo: 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
        :type decorationPayment.couponInfo: String
        :param decorationPayment.advance: 预付款
        :type decorationPayment.advance: Long
        :param decorationPayment.advanceType: 预付款类型 , 1: 合同预付款 , 2: 工程预付款
        :type decorationPayment.advanceType: Short
        :param decorationPayment.comment: 说明
        :type decorationPayment.comment: String
        
        Example::
        
            {
                "decorationPayment.dpid": 1,
                "decorationPayment.realMoney": 50000,
                "decorationPayment.cash": 10000,
                "decorationPayment.cashInfo": "175",
                "decorationPayment.bank": 10000,
                "decorationPayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
                "decorationPayment.checkv": 10000,
                "decorationPayment.checkvBank": "189",
                "decorationPayment.installment": 10000
                "decorationPayment.installmentBank": "201",
                "decorationPayment.accounts": 10000,
                "decorationPayment.accountsBank": "201",
                "decorationPayment.coupon": 0,
                "decorationPayment.couponInfo": "",
                "decorationPayment.advance": 0,
                "decorationPayment.advanceType": 0,
                "decorationPayment.comment": "说明",
            }
        
    ### <I> refundDecorationPayment

        装修款项中退款类型款项收款
        
        判断装修单信息是否存在 , 不存在 , 错误信息 **150003 款项不存在**
        
        判断装修款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**
        
        判断提交款项方式汇总金额与装修款应付金额是否相等 , 不相等 , 错误信息 **150013 款项实收金额不等于应收金额**
        
        装修款公司信息根据收款人操作公司进行更新
        
                |Requests:|
                :param decorationPayment.dpid: 款项ID
        :type decorationPayment.dpid: Long
        :param decorationPayment.realMoney: 实收金额
        :type decorationPayment.realMoney: Long
        :param decorationPayment.cash: 现金
        :type decorationPayment.cash: Long
        :param decorationPayment.cashInfo: 现金信息
        :type decorationPayment.cashInfo: String
        :param decorationPayment.bank: 刷卡
        :type decorationPayment.bank: Long
        :param decorationPayment.bankInfo: 刷卡信息
        :type decorationPayment.bankInfo: String
        :param decorationPayment.checkv: 转账
        :type decorationPayment.checkv: Long
        :param decorationPayment.checkvBank: 转账银行
        :type decorationPayment.checkvBank: String
        :param decorationPayment.installment: 分期
        :type decorationPayment.installment: Long
        :param decorationPayment.installmentBank: 分期银行
        :type decorationPayment.installmentBank: String
        :param decorationPayment.accounts: 对公
        :type decorationPayment.accounts: Long
        :param decorationPayment.accountsBank: 对公银行
        :type decorationPayment.accountsBank: String
        :param decorationPayment.coupon: 券值
        :type decorationPayment.coupon: Long
        :param decorationPayment.couponInfo: 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
        :type decorationPayment.couponInfo: String
        :param decorationPayment.advance: 预付款
        :type decorationPayment.advance: Long
        :param decorationPayment.advanceType: 预付款类型 , 1: 合同预付款 , 2: 工程预付款
        :type decorationPayment.advanceType: Short
        :param decorationPayment.comment: 说明
        :type decorationPayment.comment: String
        
        Example::
        
            {
                "decorationPayment.dpid": 1,
                "decorationPayment.realMoney": 50000,
                "decorationPayment.cash": 10000,
                "decorationPayment.cashInfo": "175",
                "decorationPayment.bank": 10000,
                "decorationPayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
                "decorationPayment.checkv": 10000,
                "decorationPayment.checkvBank": "189",
                "decorationPayment.installment": 10000
                "decorationPayment.installmentBank": "201",
                "decorationPayment.accounts": 10000,
                "decorationPayment.accountsBank": "201",
                "decorationPayment.coupon": 0,
                "decorationPayment.couponInfo": "",
                "decorationPayment.advance": 0,
                "decorationPayment.advanceType": 0,
                "decorationPayment.comment": "说明",
            }
            
    ### <I> confirmDecorationPayment

        装修款项确认 , 更新款项状态为已确认
        
                |Requests:|
                :param dpids[n]: 款项ID列表 , 每条数据类型 Long
        :type dpids[n]: List
        
        Example::
        
            {
                "dpids[0]": 1
            }
            
    ### <I> updateDecorationPayment

        更新装修款收款方式信息
        
        判断款项是否存在 , 不存在 , 错误信息 **150003 款项不存在**
        
        款项状态1(已付款) , 其他状态不可更新 , 错误信息 **150036 款项状态不可操作**
        
        款项修改之后金额与应收额不等 , 不可更新 , 错误信息 **150025 款项金额不正确**
        
        装修款收款方式更新 , 只能够针对现金/刷卡进行更新 , 优惠/预付不可更新
    
                |Requests:|
                :param decorationPayment.dpid: 款项ID
        :type decorationPayment.dpid: Long
        :param decorationPayment.cash: 现金
        :type decorationPayment.cash: Long
        :param decorationPayment.cashInfo: 现金信息
        :type decorationPayment.cashInfo: String
        :param decorationPayment.bank: 刷卡
        :type decorationPayment.bank: Long
        :param decorationPayment.bankInfo: 刷卡信息
        :type decorationPayment.bankInfo: String
        :param decorationPayment.checkv: 转账
        :type decorationPayment.checkv: Long
        :param decorationPayment.checkvBank: 转账银行
        :type decorationPayment.checkvBank: String
        :param decorationPayment.installment: 分期
        :type decorationPayment.installment: Long
        :param decorationPayment.installmentBank: 分期银行
        :type decorationPayment.installmentBank: String
        :param decorationPayment.accounts: 对公
        :type decorationPayment.accounts: Long
        :param decorationPayment.accountsBank: 对公银行
        :type decorationPayment.accountsBank: String
        :param decorationPayment.comment: 说明
        :type decorationPayment.comment: String
        
        Example::
        
            {
                "decorationPayment.dpid": 1,
                "decorationPayment.cash": 10000,
                "decorationPayment.cashInfo": "175",
                "decorationPayment.bank": 10000,
                "decorationPayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
                "decorationPayment.checkv": 10000,
                "decorationPayment.checkvBank": "189",
                "decorationPayment.installment": 10000
                "decorationPayment.installmentBank": "201",
                "decorationPayment.accounts": 10000,
                "decorationPayment.accountsBank": "201",
                "decorationPayment.comment": "说明",
            }

    ### <I> deleteDecorationPayment

        删除装修款
        
        判断款项是否存在 , 不存在 , 错误信息 **150003 款项不存在**
        
        款项状态非0(未付款) , 其他状态不可更新 , 错误信息 **150036 款项状态不可操作**
        
                |Requests:|
                :param decorationPayment.dpid: 款项ID
        :type decorationPayment.dpid: Long
        
        Example::
        
            {
                "decorationPayment.dpid": 1
            }
            
## 主材款

主材款款项信息管理以及相关业务功能

## api.payment.MaterialPaymentAction

        |DataType:|
        #### materialPayment

    - **mpid**: 款项ID
      - 类型: *Long*
    - **material**: 主材单 , 类型 [material](./material.html#api.material.MaterialAction.material)
      - 类型: *Object*
    - **paymentType**: 款项类型, 1: 预付款(过时), 2:定金, 3: 补款, 4:退款, 5: 补款退款, 6: 券退款, 7: 定金退款
      - 类型: *Short*
    - **paymentStatus**: 状态, 0: 初始, 1: 已收款, 2: 已确认
      - 类型: *Short*
    - **category**: 品类
      - 类型: *String*
    - **brand**: 品牌
      - 类型: *String*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **collecter**: 收款人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **collectTime**: 收款时间
      - 类型: *Timestamp*
    - **confirmer**: 确认人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **confirmTime**: 确认时间
      - 类型: *Timestamp*
    - **referMoney**: 应收金额
      - 类型: *Long*
    - **realMoney**: 实收金额
      - 类型: *Long*
    
    - **cash**: 现金
      - 类型: *Long*
    - **cashInfo**: 现金信息
      - 类型: *String*
    - **bank**: 刷卡
      - 类型: *Long*
    - **bankInfo**: 刷卡信息 , **#** 分隔多条刷卡信息, **|** 分隔信息中不同字段 , 由 **类型|金额|时间** 组成 , 例如: **#187|15000|2016-03-23 14:25:15#**
      - 类型: *String*
    - **checkv**: 转账
      - 类型: *Long*
    - **checkvBank**: 转账银行
      - 类型: *String*
    - **installment**: 分期
      - 类型: *Long*
    - **installmentBank**: 分期银行
      - 类型: *String*
    - **accounts**: 对公
      - 类型: *Long*
    - **accountsBank**: 对公银行
      - 类型: *String*
    - **coupon**: 券值
      - 类型: *Long*
    - **couponInfo**: 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
      - 类型: *String*
    - **advance**: 预付款
      - 类型: *Long*
    - **advanceType**: 预付款类型 , 1: 主材预付款 , 2: 正林预付款
      - 类型: *Short*
    - **company**: 公司ID
      - 类型: *Integer*
    - **comment**: 说明
      - 类型: *String*
    
    #### materialReceipt

    - **mrid**: 收据ID
      - 类型: *Long*
    - **collecter**: 收款人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **collectTime**: 收款时间
      - 类型: *Timestamp*
    - **confirmer**: 确认人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **confirmTime**: 确认时间
      - 类型: *Timestamp*
    - **realMoney**: 实收金额
      - 类型: *Long*
    - **cash**: 现金
      - 类型: *Long*
    - **cashInfo**: 现金信息
      - 类型: *String*
    - **bank**: 刷卡
      - 类型: *Long*
    - **bankInfo**: 刷卡信息 , **#** 分隔多条刷卡信息, **|** 分隔信息中不同字段 , 由 **类型|金额|时间** 组成 , 例如: **#187|15000|2016-03-23 14:25:15#**
      - 类型: *String*
    - **checkv**: 转账
      - 类型: *Long*
    - **checkvBank**: 转账银行
      - 类型: *String*
    - **installment**: 分期
      - 类型: *Long*
    - **installmentBank**: 分期银行
      - 类型: *String*
    - **accounts**: 对公
      - 类型: *Long*
    - **accountsBank**: 对公银行
      - 类型: *String*
    - **coupon**: 券值
      - 类型: *Long*
    - **couponInfo**: 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
      - 类型: *String*
    - **advance**: 预付款
      - 类型: *Long*
    - **advanceType**: 预付款类型 , 1: 主材预付款 , 2: 正林预付款
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*
    
    ### <I> pageMaterialPayment

        分页方式获取主材收款信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Requests:|
                :param materialPayment.paymentStatus: 状态
        :type materialPayment.paymentStatus: Short
        :param materialPayment.paymentType: 类型
        :type materialPayment.paymentType: Short
                
        Example::
        
            {
                "materialPayment.paymentStatus": 1,
                "materialPayment.paymentType": 0
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 主材收款信息列表 , 每条数据类型 *materialPayment*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "mpid": 1,
                            "material": {
                                "mid": 1,
                                "no": "M1601012703",
                                "orderId": "1601010001",
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
                                
                                "designRegion": "设计一分区",
                                "designDepartment": "设计一部",
                                "materialDepartment": "主材二组",
                                
                                "coupon": 100,
                                "couponInfo": "",
                                ...
                            }
                            "paymentStatus": 0,
                            "paymentType": 3,
                            "category": "洁具",
                            "brand": "箭牌卫浴",
                            "creater": {
                                "uid": 1,
                                "userId": "FL-02381",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "136xxxx1453",
                                ...
                            },
                            "createTime": "2016-01-01 00:00:00",
                            "collecter": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "collectTime": "2017-04-22 10:26:32",
                            "confirmer": {
                                "uid": null,
                                "userId": null,
                                "userName": null,
                                "currentName": null,
                                "duty": null
                            },
                            "confirmTime": null,
                            "referMoney": 500,
                            "realMoney": 500,
                            "cash": 500,
                            "cashInfo": "157",
                            "bank": 0,
                            "bankInfo": "",
                            "checkv": 0,
                            "checkvBank": "",
                            "installment": 0,
                            "installmentBank": "",
                            "accounts": 0,
                            "accountsBank": "",
                            "coupon": 0,
                            "couponInfo": "",
                            "advance": 0,
                            "advanceType": 0,
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I> queryMaterialPaymentByOrderId

        通过装修单号获取装修单下所有主材装修单的款项信息
        
                |Requests:|
                :param materialPayment.orderId: 装修单号
        :type materialPayment.orderId: String
        
        Example::
        
            {
                "materialPayment.orderId": "1601010001"
            }
            
                |Returns:|
                - **materialPayments**: 主材收款信息列表 , 每条数据类型 *materialPayment*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "materialPayments": [
                    {
                        "mpid": 1,
                        "material": {
                            "mid": 1,
                            "no": "M1601012703",
                            "orderId": "1601010001",
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
                            
                            "designRegion": "设计一分区",
                            "designDepartment": "设计一部",
                            "materialDepartment": "主材二组",
                            
                            "coupon": 100,
                            "couponInfo": "",
                            ...
                        }
                        "paymentStatus": 0,
                        "paymentType": 3,
                        "category": "洁具",
                        "brand": "箭牌卫浴",
                        "creater": {
                            "uid": 1,
                            "userId": "FL-02381",
                            "userName": "王宁",
                            "currentName": "王宁",
                            "phone": "136xxxx1453",
                            ...
                        },
                        "createTime": "2016-01-01 00:00:00",
                        "collecter": {
                            "uid": 1,
                            "userId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师"
                        },
                        "collectTime": "2017-04-22 10:26:32",
                        "confirmer": {
                            "uid": null,
                            "userId": null,
                            "userName": null,
                            "currentName": null,
                            "duty": null
                        },
                        "confirmTime": null,
                        "referMoney": 500,
                        "realMoney": 500,
                        "cash": 500,
                        "cashInfo": "157",
                        "bank": 0,
                        "bankInfo": "",
                        "checkv": 0,
                        "checkvBank": "",
                        "installment": 0,
                        "installmentBank": "",
                        "accounts": 0,
                        "accountsBank": "",
                        "coupon": 0,
                        "couponInfo": "",
                        "advance": 0,
                        "advanceType": 0,
                        "comment": ""
                    }
                ],
                ...
            }
            
    ### <I> queryMaterialPaymentByMid

        通过主材单ID获取主材收款信息
        
                |Requests:|
                :param materialPayment.material.mid: 主材单ID
        :type materialPayment.material.mid: Long
        
        Example::
        
            {
                "materialPayment.material.mid": 1
            }
            
                |Returns:|
                - **materialPayments**: 主材收款信息列表 , 每条数据类型 *materialPayment*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "materialPayments": [
                    {
                        "mpid": 1,
                        "material": {
                            "mid": 1,
                            "no": "M1601012703",
                            "orderId": "1601010001",
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
                            
                            "designRegion": "设计一分区",
                            "designDepartment": "设计一部",
                            "materialDepartment": "主材二组",
                            
                            "coupon": 100,
                            "couponInfo": "",
                            ...
                        }
                        "paymentStatus": 0,
                        "paymentType": 3,
                        "category": "洁具",
                        "brand": "箭牌卫浴",
                        "creater": {
                            "uid": 1,
                            "userId": "FL-02381",
                            "userName": "王宁",
                            "currentName": "王宁",
                            "phone": "136xxxx1453",
                            ...
                        },
                        "createTime": "2016-01-01 00:00:00",
                        "collecter": {
                            "uid": 1,
                            "userId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师"
                        },
                        "collectTime": "2017-04-22 10:26:32",
                        "confirmer": {
                            "uid": null,
                            "userId": null,
                            "userName": null,
                            "currentName": null,
                            "duty": null
                        },
                        "confirmTime": null,
                        "referMoney": 500,
                        "realMoney": 500,
                        "cash": 500,
                        "cashInfo": "157",
                        "bank": 0,
                        "bankInfo": "",
                        "checkv": 0,
                        "checkvBank": "",
                        "installment": 0,
                        "installmentBank": "",
                        "accounts": 0,
                        "accountsBank": "",
                        "coupon": 0,
                        "couponInfo": "",
                        "advance": 0,
                        "advanceType": 0,
                        "comment": ""
                    }
                ],
                ...
            }
            
    ### <I> queryMaterialPaymentForNotInitByMrId

        通过收据ID获取主材款项信息 , 状态为非初始
        
                |Requests:|
                :param materialReceipt.mrid: 收据ID
        :type materialReceipt.mrid: Long
        
        Example::
        
            {
                "materialReceipt.mrid": 1
            }
        
                |Returns:|
                - **materialPayments**: 主材收款信息列表 , 每条数据类型 *materialPayment*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "materialPayments": [
                    {
                        "mpid": 1,
                        "material": {
                            "mid": 1,
                            "no": "M1601012703",
                            "orderId": "1601010001",
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
                            
                            "designRegion": "设计一分区",
                            "designDepartment": "设计一部",
                            "materialDepartment": "主材二组",
                            
                            "coupon": 100,
                            "couponInfo": "",
                            ...
                        }
                        "paymentStatus": 0,
                        "paymentType": 3,
                        "category": "洁具",
                        "brand": "箭牌卫浴",
                        "creater": {
                            "uid": 1,
                            "userId": "FL-02381",
                            "userName": "王宁",
                            "currentName": "王宁",
                            "phone": "136xxxx1453",
                            ...
                        },
                        "createTime": "2016-01-01 00:00:00",
                        "collecter": {
                            "uid": 1,
                            "userId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师"
                        },
                        "collectTime": "2017-04-22 10:26:32",
                        "confirmer": {
                            "uid": null,
                            "userId": null,
                            "userName": null,
                            "currentName": null,
                            "duty": null
                        },
                        "confirmTime": null,
                        "referMoney": 500,
                        "realMoney": 500,
                        "cash": 500,
                        "cashInfo": "157",
                        "bank": 0,
                        "bankInfo": "",
                        "checkv": 0,
                        "checkvBank": "",
                        "installment": 0,
                        "installmentBank": "",
                        "accounts": 0,
                        "accountsBank": "",
                        "coupon": 0,
                        "couponInfo": "",
                        "advance": 0,
                        "advanceType": 0,
                        "comment": ""
                    }
                ],
                ...
            }
            
    ### <I> queryMaterialReceiptByMrId

        通过收据ID获取主材收据信息
        
                |Requests:|
                :param materialReceipt.mrid: 收据ID
        :type materialReceipt.mrid: Long
        
        Example::
        
            {
                "materialReceipt.mrid": 1
            }
            
                |Returns:|
                - **materialReceipt**: 主材收据信息 , 类型 *materialReceipt*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "materialReceipt": {
                    "mrid": 1,
                    "collecter": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "collectTime": "2017-04-22 10:26:32",
                    "confirmer": {
                        "uid": null,
                        "userId": null,
                        "userName": null,
                        "currentName": null,
                        "duty": null
                    },
                    "confirmTime": null,
                    "realMoney": 500,
                    "cash": 700,
                    "cashInfo": "157",
                    "bank": 200,
                    "bankInfo": "#175|100|2015-12-05 11:11:11#175|100|2015-12-05 11:11:11#",
                    "checkv": 100,
                    "checkvBank": "158",
                    "installment": 100,
                    "installmentBank": "187",
                    "accounts": 100,
                    "accountsBank": "190",
                    "advance": 0,
                    "advanceType": 0,
                    "coupon": 200,
                    "couponInfo": "#物业费抵值券:100#赠品抵现:100#",
                    "comment": ""
                }
                ...
            }
            
    ### <I> checkMaterialPayment

        判断主材款项是否可以进行收款
        
        判断主材款项状态是否为0(初始) , 其他状态 , 错误信息 **150008 款项不能进行收款**
        
                |Requests:|
                :param materialPayment.mpid: 款项ID
        :type materialPayment.mpid: Long
        
        Example::
        
            {
                "materialPayment.mpid": 1
            }
            
    ### <I> addMaterialPaymentForDeposit

        生成定金主材款
        
        主材单是否存在 , 不存在 , 错误信息 **180001 主材订单不存在**
        
        应收款金额大于零 , 小于零 , 错误信息 **150025 款项金额不正确**
        
        不可存在主材单对应的其他款项 , 如果存在 , 错误信息 **150029 款项不可提交**
        
        判断提交主材款类型是否已经存在 , 已存在 , 错误信息 **150029 款项不可提交**
        
        主材单更新定金额为提交项金额 , 定金状态为1(未付款)
        
                |Requests:|
                :param materialPayment.material.mid: 主材单ID
        :type materialPayment.material.mid: Long
        :param materialPayment.referMoney: 应收金额
        :type materialPayment.referMoney: Long
        
        Example::
        
            {
                "materialPayment.material.mid": 1,
                "materialPayment.paymentType": 1,
                "materialPayment.referMoney": 1000
            }
        
    ### <I> addMaterialPaymentForFullpay

        生成补款主材款
        
        获取主材款类型为3(补款)的款项 , 如果存在 , 错误信息 **150040 补款已存在**
        
        定金主材款存在 , 判断款项状态是否为1(已收款)或2(已确认) , 状态为0(初始) , 错误信息 **150041 定金状态不可操作**
        
        判断主材项总额与定金+补款总额是否一致 , 不一致 , 错误信息 **150017 项目总额与款项额不符**
        
        生成款项金额为正数 , 款项类型为3(补款) , 生成金额为负数 , 款项类型为5(补款退款)
        
        主材单更新补款额为提交款项金额 , 补款状态为1(未付款)
        
        生成补款退款类型款项信息 , 其作用等同于补款
        
                |Requests:|
                :param materialPayment.material.mid: 主材单ID
        :type materialPayment.material.mid: Long
        :param materialPayment.referMoney: 金额
        :type materialPayment.referMoney: Long
        
        Example::
        
            {
                "materialPayment.material.mid": 1,
                "materialPayment.referMoney": 1000
            }
            
    ### <I> cancelMaterialPaymentForDeposit

        撤销定金主材款
        
        获取主材款类型为3(补款)的款项 , 如果存在 , 错误信息 **150040 补款已存在**
        
        获取主材款类型为2(定金)的款项 , 如果不存在 , 错误信息 **150037 定金不存在**
        
        判断定金主材款状态是否为0(初始) , 其他状态 , 错误信息 **150036 款项状态不可操作**
        
        删除定金主材款信息
        
        更新主材单中定金额为0 , 定金状态为0(初始)
        
                |Requests:|
                :param materialPayment.material.mid: 主材单ID
        :type materialPayment.material.mid: Long
        
        Example::
        
            {
                "materialPayment.material.mid": 1,
                "materialPayment.paymentType": 1
            }
            
    ### <I> cancelMaterialPaymentForFullpay

        撤销补款主材款
        
        获取主材款类型为3(补款)/5(补款退款)的款项 , 如果不存在 , 错误信息 **150038 补款不存在**
        
        判断补款/补款退款主材款状态是否为0(初始) , 其他状态 , 错误信息 **150036 款项状态不可操作**
        
        删除补款主材款信息
        
        更新主材单中补款额为0, 补款状态为0(初始)
        
                |Requests:|
                :param materialPayment.material.mid: 主材单ID
        :type materialPayment.material.mid: Long
        
        Example::
        
            {
                "materialPayment.material.mid": 1,
                "materialPayment.paymentType": 1
            }
            
    ### <I> collectMaterialPayment

        主材款项收款
        
        判断主材款是否存在 , 不存在 , 错误信息 **150003 款项不存在**
        
        判断主材款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**
        
        判断提交款项方式汇总金额与装修款应付金额是否相等 , 不相等 , 错误信息 **150008 款项不能进行收款**
        
        收款方式包括预付款 , 判断操作金额是否满足预付款余额 , 余额不足 , 错误信息 **150010 预付款余额不足**
        
        主材款公司信息根据收款人操作公司进行更新
        
        更新主材单对应收款类型的状态信息 , 定金/补款状态为1(已付款)
        
        款项类型为补款(3) , 更新销售单中补款时间
        
                |Requests:|
                :param materialPayment.mpid: 款项ID
        :type materialPayment.mpid: Long
        :param materialPayment.realMoney: 实收金额
        :type materialPayment.realMoney: Long
        :param materialPayment.cash: 现金
        :type materialPayment.cash: Long
        :param materialPayment.cashInfo: 现金信息
        :type materialPayment.cashInfo: String
        :param materialPayment.bank: 刷卡
        :type materialPayment.bank: Long
        :param materialPayment.bankInfo: 刷卡信息
        :type materialPayment.bankInfo: String
        :param materialPayment.checkv: 转账
        :type materialPayment.checkv: Long
        :param materialPayment.checkvBank: 转账银行
        :type materialPayment.checkvBank: String
        :param materialPayment.installment: 分期
        :type materialPayment.installment: Long
        :param materialPayment.installmentBank: 分期银行
        :type materialPayment.installmentBank: String
        :param materialPayment.accounts: 对公
        :type materialPayment.accounts: Long
        :param materialPayment.accountsBank: 对公银行
        :type materialPayment.accountsBank: String
        :param materialPayment.coupon: 券值
        :type materialPayment.coupon: Long
        :param materialPayment.couponInfo: 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
        :type materialPayment.couponInfo: String
        :param materialPayment.advance: 预付款
        :type materialPayment.advance: Long
        :param materialPayment.advanceType: 预付款类型 , 1: 合同预付款 , 2: 工程预付款
        :type materialPayment.advanceType: Short
        :param materialPayment.comment: 说明
        :type materialPayment.comment: String
        
        Example::
        
            {
                "materialPayment.mpid": 1,
                "materialPayment.realMoney": 10000,
                "materialPayment.cash": 10000,
                "materialPayment.cashInfo": "175",
                "materialPayment.bank": 10000,
                "materialPayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
                "materialPayment.checkv": 10000,
                "materialPayment.checkvBank": "189",
                "materialPayment.installment": 10000
                "materialPayment.installmentBank": "201",
                "materialPayment.accounts": 10000,
                "materialPayment.accountsBank": "201",
                "materialPayment.coupon": 0,
                "materialPayment.couponInfo": "",
                "materialPayment.advance": 0,
                "materialPayment.advanceType": 0,
                "materialPayment.comment": "说明",
            }
            
    ### <I> collectMaterialPayments

        主材款项批量收款
        
        判断主材款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**
        
        判断主材款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**
        
        判断提交款项方式汇总金额与装修款应付金额是否相等 , 不相等 , 错误信息 **150008 款项不能进行收款**
        
        收款方式包括预付款 , 判断操作金额是否满足预付款余额 , 余额不足 , 错误信息 **150010 预付款余额不足**
        
        主材款公司信息根据收款人操作公司进行更新
        
        更新主材单对应收款类型的状态信息 , 定金/补款状态为2(已付款)
        
        款项类型为补款(3) , 更新销售单中补款时间
        
                |Requests:|
                :param material.orderId: 装修单号
        :type material.orderId: String
        :param materialPayments[n].mpid: 款项ID列表 , 每条数据类型 Long
        :type materialPayments[n].mpid: List
        :param materialReceipt.realMoney: 实收金额
        :type materialReceipt.realMoney: Long
        :param materialReceipt.cash: 现金
        :type materialReceipt.cash: Long
        :param materialReceipt.cashInfo: 现金信息
        :type materialReceipt.cashInfo: String
        :param materialReceipt.bank: 刷卡
        :type materialReceipt.bank: Long
        :param materialReceipt.bankInfo: 刷卡信息
        :type materialReceipt.bankInfo: String
        :param materialReceipt.checkv: 转账
        :type materialReceipt.checkv: Long
        :param materialReceipt.checkvBank: 转账银行
        :type materialReceipt.checkvBank: String
        :param materialReceipt.installment: 分期
        :type materialReceipt.installment: Long
        :param materialReceipt.installmentBank: 分期银行
        :type materialReceipt.installmentBank: String
        :param materialReceipt.accounts: 对公
        :type materialReceipt.accounts: Long
        :param materialReceipt.accountsBank: 对公银行
        :type materialReceipt.accountsBank: String
        :param materialReceipt.coupon: 券值
        :type materialReceipt.coupon: Long
        :param materialReceipt.couponInfo: 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
        :type materialReceipt.couponInfo: String
        :param materialReceipt.advance: 预付款
        :type materialReceipt.advance: Long
        :param materialReceipt.advanceType: 预付款类型 , 1: 合同预付款 , 2: 工程预付款
        :type materialReceipt.advanceType: Short
        :param materialReceipt.comment: 说明
        :type materialReceipt.comment: String
        
        Example::
        
            {
                "material.orderId": "1601010001",
                "materialPayment[0].mpid": 1,
                "materialReceipt.realMoney": 10000,
                "materialReceipt.cash": 10000,
                "materialReceipt.cashInfo": "175",
                "materialReceipt.bank": 10000,
                "materialReceipt.bankInfo": "#187|15000|2016-03-23 14:25:15#",
                "materialReceipt.checkv": 10000,
                "materialReceipt.checkvBank": "189",
                "materialReceipt.installment": 10000
                "materialReceipt.installmentBank": "201",
                "materialReceipt.accounts": 10000,
                "materialReceipt.accountsBank": "201",
                "materialReceipt.coupon": 0,
                "materialReceipt.couponInfo": "",
                "materialReceipt.advance": 0,
                "materialReceipt.advanceType": 0,
                "materialReceipt.comment": "说明"
            }
            
    ### <I> refundMaterialPayment

        主材退款
        
        判断主材款是否存在 , 不存在 , 错误信息 **150003 款项不存在**
        
        判断主材款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**
        
        如果主材款类型为7(定金退款) , 更新主材单中定金额为0 , 定金状态为0(初始)
        
        如果主材款类型为5(补款退款) , 更新主材单中补款状态为2(已付款) , 补款时间为操作时间
        
        如果主材款类型为4(退款) , 更新退款主材项状态为2(已付款)
        
        主材款公司信息根据收款人操作公司进行更新
        
        更新款项状态以及生成对应收据相关信息
        
                |Requests:|
                :param materialPayment.mpid: 款项ID
        :type materialPayment.mpid: Long
        :param materialPayment.cash: 现金
        :type materialPayment.cash: Long
        :param materialPayment.cashInfo: 现金信息
        :type materialPayment.cashInfo: String
        :param materialPayment.bank: 刷卡
        :type materialPayment.bank: Long
        :param materialPayment.bankInfo: 刷卡信息
        :type materialPayment.bankInfo: String
        :param materialPayment.checkv: 转账
        :type materialPayment.checkv: Long
        :param materialPayment.checkvBank: 转账银行
        :type materialPayment.checkvBank: String
        :param materialPayment.installment: 分期
        :type materialPayment.installment: Long
        :param materialPayment.installmentBank: 分期银行
        :type materialPayment.installmentBank: String
        :param materialPayment.accounts: 对公
        :type materialPayment.accounts: Long
        :param materialPayment.accountsBank: 对公银行
        :type materialPayment.accountsBank: String
        :param materialPayment.coupon: 券值
        :type materialPayment.coupon: Long
        :param materialPayment.couponInfo: 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
        :type materialPayment.couponInfo: String
        :param materialPayment.advance: 预付款
        :type materialPayment.advance: Long
        :param materialPayment.advanceType: 预付款类型 , 1: 合同预付款 , 2: 工程预付款
        :type materialPayment.advanceType: Short
        :param materialPayment.comment: 说明
        :type materialPayment.comment: String
        
        Example::
        
            {
                "materialPayment.mpid": 1,
                "materialPayment.cash": 10000,
                "materialPayment.cashInfo": "175",
                "materialPayment.bank": 10000,
                "materialPayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
                "materialPayment.checkv": 10000,
                "materialPayment.checkvBank": "189",
                "materialPayment.installment": 10000
                "materialPayment.installmentBank": "201",
                "materialPayment.accounts": 10000,
                "materialPayment.accountsBank": "201",
                "materialPayment.coupon": 0,
                "materialPayment.couponInfo": "",
                "materialPayment.advance": 0,
                "materialPayment.advanceType": 0,
                "materialPayment.comment": "说明"
            }
            
    ### <I> refundMaterialPaymentForDeposit

        生成主材款中定金退款
        
        获取主材款类型为3(补款)的款项 , 如果存在 , 错误信息 **150040 补款已存在**
        
        获取主材款类型为2(定金)的款项 , 如果不存在 , 错误信息 **150037 定金不存在**
        
        判断定金主材款状态是否为2(已确认) , 其他状态 , 错误信息 **150012 款项不能进行退款**
        
        主材单更新定金额为0 , 定金状态为0(初始)
        
        主材单状态更新为8(废单)
        
                |Requests:|
                :param materialPayment.material.mid: 主材单ID
        :type materialPayment.material.mid: Long
        
        Example::
        
            {
                "materialPayment.material.mid": 1
            }
        
    ### <I> refundMaterialPaymentForCoupon

        生成主材款项中券退款
        
        获取主材款类型为2(定金)的款项 , 如果不存在 , 错误信息 **150037 定金不存在**
        
        判断定金主材款状态是否为1(已收款)或2(已确认) , 状态为0(初始) , 错误信息 **150041 定金状态不可操作**
        
        生成券退款类型款项信息 , 同时更新主材单中券值和券信息
        
                |Requests:|
                :param material.mid: 主材单ID
        :type material.mid: Long
        :param material.coupon: 券值
        :type material.coupon: Long
        :param material.couponInfo: 券信息
        :type material.couponInfo: String
        
        Example::
        
            {
                "material.mid": 1,
                "material.coupon": 100000,
                "material.couponInfo": #瓷砖券:100#
            }

    ### <I> updateMaterialPayment

        更新主材款收款方式
        
        判断款项是否存在 , 不存在 , 错误信息 **150003 款项不存在**
        
        主材款状态1(已付款) , 其他状态不可更新 , 错误信息 **150036 款项状态不可操作**
        
        主材款修改之后金额与应收额不等 , 不可更新 , 错误信息 **150025 款项金额不正确**
        
        预付款和优惠券不可修改
    
                |Requests:|
                :param materialPayment.mpid: 款项ID
        :type materialPayment.mpid: Long
        :param materialPayment.cash: 现金
        :type materialPayment.cash: Long
        :param materialPayment.cashInfo: 现金信息
        :type materialPayment.cashInfo: String
        :param materialPayment.bank: 刷卡
        :type materialPayment.bank: Long
        :param materialPayment.bankInfo: 刷卡信息
        :type materialPayment.bankInfo: String
        :param materialPayment.checkv: 转账
        :type materialPayment.checkv: Long
        :param materialPayment.checkvBank: 转账银行
        :type materialPayment.checkvBank: String
        :param materialPayment.installment: 分期
        :type materialPayment.installment: Long
        :param materialPayment.installmentBank: 分期银行
        :type materialPayment.installmentBank: String
        :param materialPayment.accounts: 对公
        :type materialPayment.accounts: Long
        :param materialPayment.accountsBank: 对公银行
        :type materialPayment.accountsBank: String
        :param materialPayment.comment: 说明
        :type materialPayment.comment: String
        
        Example::
        
            {
                "materialPayment.mpid": 1,
                "materialPayment.cash": 10000,
                "materialPayment.cashInfo": "175",
                "materialPayment.bank": 10000,
                "materialPayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
                "materialPayment.checkv": 10000,
                "materialPayment.checkvBank": "189",
                "materialPayment.installment": 10000
                "materialPayment.installmentBank": "201",
                "materialPayment.accounts": 10000,
                "materialPayment.accountsBank": "201",
                "materialPayment.comment": "说明"
            }
            
    ### <I> confirmMaterialPayment

        主材款项确认
        
        判断款项是否存在 , 不存在 , 错误信息 **150003 款项不存在**
        
        主材款类型为2(定金) , 更新主材单定金状态为3(已确认)
        
        主材款类型为3(补款)/5(补款退款) , 更新主材单补款状态为3(已确认)
        
        已经确认的主材款项忽略处理
        
                |Requests:|
                :param mpids[n]: 款项ID列表 , 每条数据类型 Long
        :type mpids[n]: List
        
        Example::
        
            {
                "mpids[0]": 1
            }

    ### <I> changeMaterialPaymentForTime

        修改主材款项收款和确认时间
        
        判断主材款是否存在 , 不存在 , 错误信息 **150003 款项不存在**
        
                |Requests:|
                :param materialPayment.no: 主材单编号
        :type materialPayment.no: String
        :param materialPayment.paymentType: 款项类型
        :type materialPayment.paymentType: Integer
        - **dateTime**: 修改时间
          - 类型: *Timestamp*
        
        Example::
        
            {
                "materialPayment.no": "M1601010001",
                "materialPayment.paymentType": 1,
                "dateTime": "2016-01-01 00:00:00"
            }
            
## 服务款

服务款项信息管理以及相关业务功能

服务款主要针对类型为半价的装修单完成主材服务费款项相关操作

## api.payment.ServicePaymentAction

        |DataType:|
        #### servicePayment

    - **spid**: 款项ID
      - 类型: *Long*
    - **decoration**: 装修单 , 类型 [decoration](./decoration.html#api.decoration.decorationAction.decoration)
      - 类型: *Object*
    - **pid**: 预付款款项ID
      - 类型: *Long*
    - **srid**: 收据ID
      - 类型: *Long*
    - **type**: 类型 , 0: 收款 , 1: 退款
      - 类型: *Short*
    - **status**: 状态, 0: 初始, 1: 已收款, 2: 已确认
      - 类型: *Short*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createrName**: 创建人名
      - 类型: *String*
    - **collecter**: 收款人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **collecterName**: 收款人名
      - 类型: *String*
    - **collectTime**: 收款时间
      - 类型: *Timestamp*
    - **confirmer**: 确认人, 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **confirmerName**: 确认人名
      - 类型: *String*
    - **confirmTime**: 确认时间
      - 类型: *Timestamp*
    - **serviceMoney**: 服务费金额
      - 类型: *Long*
    - **advanceMoney**: 预付款金额
      - 类型: *Long*
    - **realMoney**: 实收金额
      - 类型: *Long*
    
    - **cash**: 现金
      - 类型: *Long*
    - **cashInfo**: 现金信息
      - 类型: *String*
    - **bank**: 刷卡
      - 类型: *Long*
    - **bankInfo**: 刷卡信息 , **#** 分隔多条刷卡信息, **|** 分隔信息中不同字段 , 由 **类型|金额|时间** 组成 , 例如: **#187|15000|2016-03-23 14:25:15#**
      - 类型: *String*
    - **checkv**: 转账
      - 类型: *Long*
    - **checkvBank**: 转账银行
      - 类型: *String*
    - **installment**: 分期
      - 类型: *Long*
    - **installmentBank**: 分期银行
      - 类型: *String*
    - **accounts**: 对公
      - 类型: *Long*
    - **accountsBank**: 对公银行
      - 类型: *String*
    - **company**: 公司ID
      - 类型: *Integer*
    - **comment**: 说明
      - 类型: *String*
    
    #### serviceReceipt

    - **srid**: 收据ID
      - 类型: *Long*
    - **collecter**: 收款人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **collectTime**: 收款时间
      - 类型: *Timestamp*
    - **confirmer**: 收款人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **confirmTime**: 确认时间
      - 类型: *Timestamp*
    - **realMoney**: 实收金额
      - 类型: *Long*
    - **cash**: 现金
      - 类型: *Long*
    - **cashInfo**: 现金信息
      - 类型: *String*
    - **bank**: 刷卡
      - 类型: *Long*
    - **bankInfo**: 刷卡信息 , **#** 分隔多条刷卡信息, **|** 分隔信息中不同字段 , 由 **类型|金额|时间** 组成 , 例如: **#187|15000|2016-03-23 14:25:15#**
      - 类型: *String*
    - **checkv**: 转账
      - 类型: *Long*
    - **checkvBank**: 转账银行
      - 类型: *String*
    - **installment**: 分期
      - 类型: *Long*
    - **installmentBank**: 分期银行
      - 类型: *String*
    - **accounts**: 对公
      - 类型: *Long*
    - **accountsBank**: 对公银行
      - 类型: *String*
    - **comment**: 说明
      - 类型: *String*
    
    ### <I> pageServicePayment

        页方式获服务款收款信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        根据当前操作公司作为条件查询对应公司的服务款
        
                |Requests:|
                :param servicePayment.status: 状态
        :type servicePayment.status: Short
                
        Example::
        
            {
                "servicePayment.status": 1
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 销售收款信息列表 , 每条数据类型 *servicePayment*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "spid": 1,
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
                                "creater": {
                                    "uid": 1,
                                    "userId": "FL-02381",
                                    "userName": "王宁",
                                    "currentName": "王宁",
                                    "phone": "136xxxx1453",
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
                            "type": 0,
                            "status": 1,
                            "creater": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "createrName": "白雪",
                            "createTime": "2016-01-01 00:00:00",
                            "collecter": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "collectTime": "2016-01-01 00:00:00",
                            "confirmer": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "confirmTime": "2016-01-01 00:00:00",
                            "serviceMoney": 500,
                            "advanceMoney": 500,
                            
                            "cash": 500,
                            "cashInfo": "157",
                            "bank": 0,
                            "bankInfo": "",
                            "checkv": 0,
                            "checkvBank": "",
                            "installment": 0,
                            "installmentBank": "",
                            "accounts": 0,
                            "accountsBank": "",
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I> queryServicePaymentByOrderId

        通过装修单号获取服务款项
        
                |Requests:|
                :param servicePayment.decoration.orderId: 装修单号
        :type servicePayment.decoration.orderId: String
        
        Example::
        
            {
                "servicePayment.decoration.orderId": 1
            }
            
                |Returns:|
                - **servicePayments**: 服务款信息列表 , 每条数据类型 *servicePayment*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "servicePayments": [
                    {
                        "spid": 1,
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
                                "creater": {
                                    "uid": 1,
                                    "userId": "FL-02381",
                                    "userName": "王宁",
                                    "currentName": "王宁",
                                    "phone": "136xxxx1453",
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
                            "type": 0,
                            "status": 1,
                            "creater": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "createrName": "白雪",
                            "createTime": "2016-01-01 00:00:00",
                            "collecter": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "collectTime": "2016-01-01 00:00:00",
                            "confirmer": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "confirmTime": "2016-01-01 00:00:00",
                            "serviceMoney": 500,
                            "advanceMoney": 500,
                            "cash": 500,
                            "cashInfo": "157",
                            "bank": 0,
                            "bankInfo": "",
                            "checkv": 0,
                            "checkvBank": "",
                            "installment": 0,
                            "installmentBank": "",
                            "accounts": 0,
                            "accountsBank": "",
                            "comment": ""
                    }
                ],
                ...
            }
            
    ### <I> queryServicePaymentForNotInitBySrId

        通过服务款收据ID获取非初始状态的服务款项
        
                |Requests:|
                :param serviceReceipt.srid: 收据ID
        :type serviceReceipt.srid: Long

        Example::
        
            {
                "serviceReceipt.srid": 1
            }

                |Returns:|
                - **servicePayments**: 服务款信息列表 , 每条数据类型 *servicePayment*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "servicePayments": [
                    {
                        "spid": 1,
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
                            "creater": {
                                "uid": 1,
                                "userId": "FL-02381",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "136xxxx1453",
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
                        "type": 0,
                        "status": 1,
                        "creater": {
                            "uid": 1,
                            "userId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师"
                        },
                        "createrName": "白雪",
                        "createTime": "2016-01-01 00:00:00",
                        "collecter": {
                            "uid": 1,
                            "userId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师"
                        },
                        "collectTime": "2016-01-01 00:00:00",
                        "confirmer": {
                            "uid": 1,
                            "userId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师"
                        },
                        "confirmTime": "2016-01-01 00:00:00",
                        "serviceMoney": 500,
                        "advanceMoney": 500,
                        "cash": 500,
                        "cashInfo": "157",
                        "bank": 0,
                        "bankInfo": "",
                        "checkv": 0,
                        "checkvBank": "",
                        "installment": 0,
                        "installmentBank": "",
                        "accounts": 0,
                        "accountsBank": "",
                        "comment": ""
                    }
                ],
                ...
            }
            
    ### <I> queryServiceReceiptBySrId

                |Requests:|
                :param serviceReceipt.srid: 收据ID
        :type serviceReceipt.srid: Long

        Example::
        
            {
                "serviceReceipt.srid": 1
            }
            
                |Returns:|
                - **servicePayment**: 服务款信息 ,数据类型 *servicePayment*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "servicePayment": {
                    "srid": 1,
                    "collecter": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "collecterName": "白雪",
                    "collectTime": "2016-01-01 00:00:00",
                    "confirmer": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "confirmerName": "白雪",
                    "confirmTime": "2016-01-01 00:00:00",
                    "cash": 500,
                    "cashInfo": "157",
                    "bank": 0,
                    "bankInfo": "",
                    "checkv": 0,
                    "checkvBank": "",
                    "installment": 0,
                    "installmentBank": "",
                    "accounts": 0,
                    "accountsBank": "",
                    "comment": ""
                }
                ...
            }

    ### <I> makeServicePayment

        生成服务款
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**
        
        判断装修单对应的半价信息是否存在 , 不存在 , 错误信息 **260021 半价信息不存在**
        
        判断服务款剩余金额 , 如果大于交款金额 , 错误信息 **150025 款项金额不正确**
        
                |Requests:|
                :param servicePayment.decoration.orderId: 装修单号
        :type servicePayment.decoration.orderId: String
        :param servicePayment.referMoney: 收款金额
        :type servicePayment.referMoney: Long
        
        Example::
        
            {
                "servicePayment.decoration.orderId": "1601010001",
                "servicePayment.referMoney": 10000
            }
            
    ### <I> collectServicePayment

        服务款项收款 , 正常收款 , 需要拆分金额为预付款和服务款两个部分
        
        判断装修单对应的半价信息是否存在 , 不存在 , 错误信息 **260021 半价信息不存在**
        
        服务费收款款项拆分两部分 , 一是预付款 , 二是服务费 . 
        
        拆分计算方式为 , 收款金额 / 1.1 = 主材预付款金额 , 收款金额 - 主材预付款金额 = 服务费
        
        拆分之后的服务费需要与装修单半价信息中服务费和实收服务费 , 如果拆分后服务费大于服务费与实收服务费差值 , 那么多余部分交款服务费转入主材预付款 .
        
        生成服务款款项以及收据信息 , 服务款状态为1(已付款) , 补全相关收据信息
        
        生成预付款款项以及收据信息 , 预付款状态为1(已付款) , 补全相关收据信息 , 收据使用转款字段存储
        
        更新装修单半价中的服务费以及主材额
        
        服务款公司信息根据收款人操作公司进行更新
        
                |Requests:|
                :param servicePayment.decoration.orderId: 装修单号
        :type servicePayment.decoration.orderId: String
        :param servicePayment.referMoney: 收款金额
        :type servicePayment.referMoney: Long
        :param servicePayment.realMoney: 实收金额
        :type servicePayment.realMoney: Long
        :param servicePayment.cash: 现金
        :type servicePayment.cash: Long
        :param servicePayment.cashInfo: 现金信息
        :type servicePayment.cashInfo: String
        :param servicePayment.bank: 刷卡
        :type servicePayment.bank: Long
        :param servicePayment.bankInfo: 刷卡信息
        :type servicePayment.bankInfo: String
        :param servicePayment.checkv: 转账
        :type servicePayment.checkv: Long
        :param servicePayment.checkvBank: 转账银行
        :type servicePayment.checkvBank: String
        :param servicePayment.installment: 分期
        :type servicePayment.installment: Long
        :param servicePayment.installmentBank: 分期银行
        :type servicePayment.installmentBank: String
        :param servicePayment.accounts: 对公
        :type servicePayment.accounts: Long
        :param servicePayment.accountsBank: 对公银行
        :type servicePayment.accountsBank: String
        :param servicePayment.comment: 说明
        :type servicePayment.comment: String
        
        Example::
        
            {
                "servicePayment.decoration.orderId": "1601010001",
                "servicePayment.referMoney": 10000,
                "servicePayment.realMoney": 10000,
                "servicePayment.cash": 10000,
                "servicePayment.cashInfo": "175",
                "servicePayment.bank": 10000,
                "servicePayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
                "servicePayment.checkv": 10000,
                "servicePayment.checkvBank": "189",
                "servicePayment.installment": 10000
                "servicePayment.installmentBank": "201",
                "servicePayment.accounts": 10000,
                "servicePayment.accountsBank": "201",
                "servicePayment.coupon": 0,
                "servicePayment.couponInfo": "",
                "servicePayment.comment": "说明",
            }
            
    ### <I> collectServicePaymentForService

        服务款项收款 , 主要针对服务费收款
        
        判断装修单对应的半价信息是否存在 , 不存在 , 错误信息 **260021 半价信息不存在**
        
        收款金额作为服务费金额 , 不转入预付款 , 收款金额可以小于等于当前服务费剩余金额
        
        生成服务款款项以及收据信息
        
        更新装修单半价中的服务费信息
        
        服务款公司信息根据收款人操作公司进行更新
        
                |Requests:|
                :param servicePayment.decoration.orderId: 装修单号
        :type servicePayment.decoration.orderId: String
        :param servicePayment.realMoney: 实收金额
        :type servicePayment.realMoney: Long
        :param servicePayment.cash: 现金
        :type servicePayment.cash: Long
        :param servicePayment.cashInfo: 现金信息
        :type servicePayment.cashInfo: String
        :param servicePayment.bank: 刷卡
        :type servicePayment.bank: Long
        :param servicePayment.bankInfo: 刷卡信息
        :type servicePayment.bankInfo: String
        :param servicePayment.checkv: 转账
        :type servicePayment.checkv: Long
        :param servicePayment.checkvBank: 转账银行
        :type servicePayment.checkvBank: String
        :param servicePayment.installment: 分期
        :type servicePayment.installment: Long
        :param servicePayment.installmentBank: 分期银行
        :type servicePayment.installmentBank: String
        :param servicePayment.accounts: 对公
        :type servicePayment.accounts: Long
        :param servicePayment.accountsBank: 对公银行
        :type servicePayment.accountsBank: String
        :param servicePayment.comment: 说明
        :type servicePayment.comment: String
        
        Example::
        
            {
                "servicePayment.decoration.orderId": "1601010001",
                "servicePayment.realMoney": 10000,
                "servicePayment.cash": 10000,
                "servicePayment.cashInfo": "175",
                "servicePayment.bank": 10000,
                "servicePayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
                "servicePayment.checkv": 10000,
                "servicePayment.checkvBank": "189",
                "servicePayment.installment": 10000
                "servicePayment.installmentBank": "201",
                "servicePayment.accounts": 10000,
                "servicePayment.accountsBank": "201",
                "servicePayment.coupon": 0,
                "servicePayment.couponInfo": "",
                "servicePayment.comment": "说明",
            }
            
    ### <I> refundServicePaymentForService

        服务费退款 , 根据装修单半价信息中实收服务费金额进行退款
        
        判断装修单对应的半价信息是否存在 , 不存在 , 错误信息 **260021 半价信息不存在**
        
        生成服务款款项以及收据信息
        
        更新装修单半价中的服务费信息
        
        服务款公司信息根据收款人操作公司进行更新
        
                |Requests:|
                :param servicePayment.decoration.orderId: 装修单号
        :type servicePayment.decoration.orderId: String
        :param servicePayment.cash: 现金
        :type servicePayment.cash: Long
        :param servicePayment.cashInfo: 现金信息
        :type servicePayment.cashInfo: String
        :param servicePayment.bank: 刷卡
        :type servicePayment.bank: Long
        :param servicePayment.bankInfo: 刷卡信息
        :type servicePayment.bankInfo: String
        :param servicePayment.checkv: 转账
        :type servicePayment.checkv: Long
        :param servicePayment.checkvBank: 转账银行
        :type servicePayment.checkvBank: String
        :param servicePayment.installment: 分期
        :type servicePayment.installment: Long
        :param servicePayment.installmentBank: 分期银行
        :type servicePayment.installmentBank: String
        :param servicePayment.accounts: 对公
        :type servicePayment.accounts: Long
        :param servicePayment.accountsBank: 对公银行
        :type servicePayment.accountsBank: String
        :param servicePayment.comment: 说明
        :type servicePayment.comment: String
        
        Example::
        
            {
                "servicePayment.decoration.orderId": "1601010001",
                "servicePayment.cash": 10000,
                "servicePayment.cashInfo": "175",
                "servicePayment.bank": 10000,
                "servicePayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
                "servicePayment.checkv": 10000,
                "servicePayment.checkvBank": "189",
                "servicePayment.installment": 10000
                "servicePayment.installmentBank": "201",
                "servicePayment.accounts": 10000,
                "servicePayment.accountsBank": "201",
                "servicePayment.coupon": 0,
                "servicePayment.couponInfo": "",
                "servicePayment.comment": "说明",
            }
            
    ### <I>  confirmServicePayment

        服务款项确认
        
        已经确认的服务款项忽略处理
        
        更新款项状态为2(已确认)
        
        关联更新预付款状态为2(已确认)
        
                |Requests:|
                :param spids[n]: 款项ID列表  ,  每条数据类型  Long
        :type spids[n]: List
        
        Example::
        
            {
                "spids[0]": 1
            }
            
    ### <I> updateServicePayment

        更新服务款收款方式
        
        判断款项是否存在 , 不存在 , 错误信息 **150003 款项不存在**
        
        款项状态1(已付款) , 其他状态不可更新 , 错误信息 **150036 款项状态不可操作**
        
        款项修改之后金额与应收额不等 , 不可更新 , 错误信息 **150025 款项金额不正确**
        
                |Requests:|
                :param servicePayment.spid: 款项ID
        :type servicePayment.spid: Long
        :param servicePayment.cash: 现金
        :type servicePayment.cash: Long
        :param servicePayment.cashInfo: 现金信息
        :type servicePayment.cashInfo: String
        :param servicePayment.bank: 刷卡
        :type servicePayment.bank: Long
        :param servicePayment.bankInfo: 刷卡信息
        :type servicePayment.bankInfo: String
        :param servicePayment.checkv: 转账
        :type servicePayment.checkv: Long
        :param servicePayment.checkvBank: 转账银行
        :type servicePayment.checkvBank: String
        :param servicePayment.comment: 说明
        :type servicePayment.comment: String
        
        Example::
        
            {
                "servicePayment.spid": 1,
                "servicePayment.cash": 10000,
                "servicePayment.cashInfo": "175",
                "servicePayment.bank": 10000,
                "servicePayment.bankInfo": "#187|10|2016-03-23 14:25:15#",
                "servicePayment.checkv": 10000,
                "servicePayment.checkvBank": "#187|10|2016-03-23 14:25:15#",
                "servicePayment.comment": "说明",
            }
    
## 销售款

销售款信息管理以及相关业务功能

## api.payment.SalesPaymentAction

        |DataType:|
        #### salesPayment

    - **spid**: 款项ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **sales**: 销售单 , 类型 [sales](./inventory.html#api.material.SalesAction.sales)
      - 类型: *Object*
    - **type**: 款项类型, 1: 预付款(过时), 2:定金, 3: 补款, 4:退款, 5: 补款退款, 6: 券退款, 7: 定金退款 , 8: 不退定金
      - 类型: *Short*
    - **status**: 状态, 0: 初始, 1: 已收款, 2: 已确认
      - 类型: *Short*
    - **category**: 品类
      - 类型: *String*
    - **brand**: 品牌
      - 类型: *String*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **collecter**: 收款人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **collectTime**: 收款时间
      - 类型: *Timestamp*
    - **confirmer**: 确认人, 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **confirmTime**: 确认时间
      - 类型: *Timestamp*
    - **referMoney**: 应收金额
      - 类型: *Long*
    - **realMoney**: 实收金额
      - 类型: *Long*
    
    - **cash**: 现金
      - 类型: *Long*
    - **cashInfo**: 现金信息
      - 类型: *String*
    - **bank**: 刷卡
      - 类型: *Long*
    - **bankInfo**: 刷卡信息 , **#** 分隔多条刷卡信息, **|** 分隔信息中不同字段 , 由 **类型|金额|时间** 组成 , 例如: **#187|15000|2016-03-23 14:25:15#**
      - 类型: *String*
    - **checkv**: 转账
      - 类型: *Long*
    - **checkvBank**: 转账银行
      - 类型: *String*
    - **installment**: 分期
      - 类型: *Long*
    - **installmentBank**: 分期银行
      - 类型: *String*
    - **accounts**: 对公
      - 类型: *Long*
    - **accountsBank**: 对公银行
      - 类型: *String*
    - **coupon**: 券值
      - 类型: *Long*
    - **couponInfo**: 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
      - 类型: *String*
    - **advance**: 预付款
      - 类型: *Long*
    - **advanceType**: 预付款类型 , 1: 合同预付款 , 2: 工程预付款
      - 类型: *Short*
    - **company**: 公司ID
      - 类型: *Integer*
    - **comment**: 说明
      - 类型: *String*
    
    #### salesReceipt

    - **srid**: 收据ID
      - 类型: *Long*
    - **collecter**: 收款人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **collectTime**: 收款时间
      - 类型: *Timestamp*
    - **confirmer**: 收款人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **confirmTime**: 确认时间
      - 类型: *Timestamp*
    - **realMoney**: 实收金额
      - 类型: *Long*
    - **cash**: 现金
      - 类型: *Long*
    - **cashInfo**: 现金信息
      - 类型: *String*
    - **bank**: 刷卡
      - 类型: *Long*
    - **bankInfo**: 刷卡信息 , **#** 分隔多条刷卡信息, **|** 分隔信息中不同字段 , 由 **类型|金额|时间** 组成 , 例如: **#187|15000|2016-03-23 14:25:15#**
      - 类型: *String*
    - **checkv**: 转账
      - 类型: *Long*
    - **checkvBank**: 转账银行
      - 类型: *String*
    - **installment**: 分期
      - 类型: *Long*
    - **installmentBank**: 分期银行
      - 类型: *String*
    - **accounts**: 对公
      - 类型: *Long*
    - **accountsBank**: 对公银行
      - 类型: *String*
    - **coupon**: 券值
      - 类型: *Long*
    - **couponInfo**: 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
      - 类型: *String*
    - **advance**: 预付款
      - 类型: *Long*
    - **advanceType**: 预付款类型 , 1: 合同预付款 , 2: 工程预付款
      - 类型: *Short*
    - **comment**: 说明
      - 类型: *String*
    
    ### <I> pageSalesPayment

        分页方式获取销售收款信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Requests:|
                :param salesPayment.status: 状态
        :type salesPayment.status: Short
        :param salesPayment.type: 类型
        :type salesPayment.type: Short
                
        Example::
        
            {
                "salesPayment.status": 1,
                "salesPayment.type": 1
            }
        
                |Requests:|
                - **companyType**: 公司类型 , 包括 company , dompany , pompany
          - 类型: *String*
        
        Example::
        
            {
                "companyType": "company"
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 销售收款信息列表 , 每条数据类型 *salesPayment*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "spid": 1,
                            "orderId": "1601010001",
                            "sales": {
                                "sid": 1,
                                "no": "1601010001",
                                "orderId": "1601010001",
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
                                    "duty": "主材导购"
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
                                    "name": "主材一部",
                                    "type": "主材部",
                                },
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "comment": "",
                                "createTime": "2016-01-01 00:00:00",
                                "fullpayTime": "2016-01-01 00:00:00",
                                "balanceTime": "2016-01-01 00:00:00",
                                "status": 0,
                                "paymentStatus": 0
                                "balanceStatus": 0,
                                "total": 100000,
                                "maling": 0,
                                "venderMaling": 0,
                                "coupon": 0,
                                "couponInfo": ""
                            }
                            "type": 1,
                            "status": 0,
                            "category": "洁具",
                            "brand": "箭牌卫浴",
                            "creater": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "createTime": "2016-01-01 00:00:00",
                            "collecter": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "collectTime": "2016-01-01 00:00:00",
                            "confirmer": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "confirmTime": "2016-01-01 00:00:00",
                            "referMoney": 500,
                            "realMoney": 500,
                            "cash": 500,
                            "cashInfo": "157",
                            "bank": 0,
                            "bankInfo": "",
                            "checkv": 0,
                            "checkvBank": "",
                            "installment": 0,
                            "installmentBank": "",
                            "accounts": 0,
                            "accountsBank": "",
                            "coupon": 0,
                            "couponInfo": "",
                            "advance": 0,
                            "advanceType": 0,
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I> querySalesPaymentByOrderId

        通过装修单号获取销售单所属的销售款信息
        
                |Requests:|
                :param sales.orderId: 装修单号
        :type sales.orderId: String
        
        Example::
        
            {
                "sales.orderId": "1601010001"
            }
            
                |Returns:|
                - **salesPayments**: 销售收款信息列表 , 每条数据类型 *salesPayment*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "salesPayments": [
                    {
                        "spid": 1,
                        "orderId": "1601010001",
                        "sales": {
                            "sid": 1,
                            "no": "1601010001",
                            "orderId": "1601010001",
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
                                "duty": "主材导购"
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
                                "name": "主材一部",
                                "type": "主材部",
                            },
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "comment": "",
                            "createTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "status": 0,
                            "paymentStatus": 0
                            "balanceStatus": 0,
                            "total": 100000,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": ""
                        }
                        "type": 1,
                        "status": 0,
                        "category": "洁具",
                        "brand": "箭牌卫浴",
                        "creater": {
                            "uid": 1,
                            "userId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师"
                        },
                        "createTime": "2016-01-01 00:00:00",
                        "collecter": {
                            "uid": 1,
                            "userId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师"
                        },
                        "collectTime": "2016-01-01 00:00:00",
                        "confirmer": {
                            "uid": 1,
                            "userId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师"
                        },
                        "confirmTime": "2016-01-01 00:00:00",
                        "referMoney": 500,
                        "realMoney": 500,
                        "cash": 500,
                        "cashInfo": "157",
                        "bank": 0,
                        "bankInfo": "",
                        "checkv": 0,
                        "checkvBank": "",
                        "installment": 0,
                        "installmentBank": "",
                        "accounts": 0,
                        "accountsBank": "",
                        "coupon": 0,
                        "couponInfo": "",
                        "advance": 0,
                        "advanceType": 0,
                        "comment": ""
                    }
                ],
                ...
            }

    ### <I> querySalesPaymentBySid

        通过销售单ID，查询销售单对应的款项信息

                |Requests:|
                :param salesPayment.sales.sid: 销售单ID
        :type salesPayment.sales.sid: Long

        Example::

            {
                "salesPayment.sales.sid": 1
            }

                |Returns:|
                Parameters:	salesPayments (List) – 销售款信息列表 , 每条数据类型 salesPayment

        Example::

            {
                ...
                "salesPayments": [
                    {
                        "spid": 1,
                        "orderId": "1601010001",
                        "sales": {
                            "sid": 1,
                            "no": "1601010001",
                            "orderId": "1601010001",
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
                                "duty": "主材导购"
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
                                "name": "主材一部",
                                "type": "主材部",
                            },
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "comment": "",
                            "createTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "status": 0,
                            "paymentStatus": 0
                            "balanceStatus": 0,
                            "total": 100000,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": ""
                        }
                        "type": 1,
                        "status": 0,
                        "category": "洁具",
                        "brand": "箭牌卫浴",
                        "creater": {
                            "uid": 1,
                            "userId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师"
                        },
                        "createTime": "2016-01-01 00:00:00",
                        "collectTime": "2016-01-01 00:00:00",
                        "confirmTime": "2016-01-01 00:00:00",
                        "referMoney": 500,
                        "realMoney": 500,
                        "cash": 500,
                        "cashInfo": "157",
                        "bank": 0,
                        "bankInfo": "",
                        "checkv": 0,
                        "checkvBank": "",
                        "installment": 0,
                        "installmentBank": "",
                        "accounts": 0,
                        "accountsBank": "",
                        "coupon": 0,
                        "couponInfo": "",
                        "advance": 0,
                        "advanceType": 0,
                        "comment": "
                    }
                ],
                ...
            }

    ### <I> querySalesPaymentForNotInitBySrid

        通过收据ID获取销售款信息 , 状态为非初始
        
                |Requests:|
                :param salesReceipt.srid: 收据ID
        :type salesReceipt.srid: Long
        
        Example::
        
            {
                "salesReceipt.srid": 1
            }
        
                |Returns:|
                - **salesPayments**: 销售收款信息列表 , 每条数据类型 *salesPayment*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "salesPayments": [
                    {
                        "spid": 1,
                        "orderId": "1601010001",
                        "sales": {
                            "sid": 1,
                            "no": "1601010001",
                            "orderId": "1601010001",
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
                                "duty": "主材导购"
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
                                "name": "主材一部",
                                "type": "主材部",
                            },
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "comment": "",
                            "createTime": "2016-01-01 00:00:00",
                            "fullpayTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "status": 0,
                            "paymentStatus": 0
                            "balanceStatus": 0,
                            "total": 100000,
                            "maling": 0,
                            "venderMaling": 0,
                            "coupon": 0,
                            "couponInfo": ""
                        }
                        "type": 1,
                        "status": 0,
                        "category": "洁具",
                        "brand": "箭牌卫浴",
                        "creater": {
                            "uid": 1,
                            "userId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师"
                        },
                        "createTime": "2016-01-01 00:00:00",
                        "collecter": {
                            "uid": 1,
                            "userId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师"
                        },
                        "collectTime": "2016-01-01 00:00:00",
                        "confirmer": {
                            "uid": 1,
                            "userId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师"
                        },
                        "confirmTime": "2016-01-01 00:00:00",
                        "referMoney": 500,
                        "realMoney": 500,
                        "cash": 500,
                        "cashInfo": "157",
                        "bank": 0,
                        "bankInfo": "",
                        "checkv": 0,
                        "checkvBank": "",
                        "installment": 0,
                        "installmentBank": "",
                        "accounts": 0,
                        "accountsBank": "",
                        "coupon": 0,
                        "couponInfo": "",
                        "advance": 0,
                        "advanceType": 0,
                        "comment": ""
                    }
                ],
                ...
            }

    ### <I-C> querySalesPaymentBySpid

                |Requests:|
                :param salesPayment.spid: 销售款ID
        :type salesPayment.spid: Long
        
        Example::
        
            {
                "salesPayment.srid": 1
            }

                |Returns:|
                - **salesPayment**: 销售收款信息 , 类型 *salesPayment*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "salesPayment": {
                    "spid": 1,
                    "orderId": "1601010001",
                    "sales": {
                        "sid": 1,
                        "no": "1601010001",
                        "orderId": "1601010001",
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
                            "duty": "主材导购"
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
                            "name": "主材一部",
                            "type": "主材部",
                        },
                        "category": "瓷砖",
                        "brand": "瓷砖",
                        "comment": "",
                        "createTime": "2016-01-01 00:00:00",
                        "fullpayTime": "2016-01-01 00:00:00",
                        "balanceTime": "2016-01-01 00:00:00",
                        "status": 0,
                        "paymentStatus": 0
                        "balanceStatus": 0,
                        "total": 100000,
                        "maling": 0,
                        "venderMaling": 0,
                        "coupon": 0,
                        "couponInfo": ""
                    }
                    "type": 1,
                    "status": 0,
                    "category": "洁具",
                    "brand": "箭牌卫浴",
                    "creater": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "createTime": "2016-01-01 00:00:00",
                    "collecter": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "collectTime": "2016-01-01 00:00:00",
                    "confirmer": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "confirmTime": "2016-01-01 00:00:00",
                    "referMoney": 500,
                    "realMoney": 500,
                    "cash": 500,
                    "cashInfo": "157",
                    "bank": 0,
                    "bankInfo": "",
                    "checkv": 0,
                    "checkvBank": "",
                    "installment": 0,
                    "installmentBank": "",
                    "accounts": 0,
                    "accountsBank": "",
                    "coupon": 0,
                    "couponInfo": "",
                    "advance": 0,
                    "advanceType": 0,
                    "comment": ""
                },
                ...
            }
            
    ### <I> querySalesReceiptBySrId

        通过收据ID获取销售收据信息
        
                |Requests:|
                :param salesReceipt.srid: 收据ID
        :type salesReceipt.srid: Long
        
        Example::
        
            {
                "salesReceipt.srid": 1
            }
            
                |Returns:|
                - **salesReceipt**: 销售收据信息 , 类型 *salesReceipt*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "materialReceipt": {
                    "srid": 1,
                    "collecter": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "collectTime": "2016-01-01 00:00:00",
                    "confirmer": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "confirmTime": "2016-01-01 00:00:00",
                    "referMoney": 500,
                    "realMoney": 500,
                    "cash": 500,
                    "cashInfo": "157",
                    "bank": 0,
                    "bankInfo": "",
                    "checkv": 0,
                    "checkvBank": "",
                    "installment": 0,
                    "installmentBank": "",
                    "accounts": 0,
                    "accountsBank": "",
                    "coupon": 0,
                    "couponInfo": "",
                    "advance": 0,
                    "advanceType": 0,
                    "comment": ""
                }
                ...
            }

    ### <I> amountSalesPayment

        获取装修单归属的销售款总额
    
                |Requests:|
                :param salesPayment.sales.orderId: 装修单号
        :type salesPayment.sales.orderId: String
        :param salesPayment.sales.sid: 销售单ID
        :type salesPayment.sales.sid: Long
        
        Example::
        
            {
                "salesPayment.sales.orderId": "1601010001",
                "salesPayment.sales.sid": 1
            }

                |Returns:|
                - **amount**: 销售款总额
          - 类型: *Long*
        
        Example::
        
            {
                ...
                "amount": 1000000,
                ...
            }

    ### <I> sendSalesPayment

        推送销售款
        
        验证销售款信息是否存在 , 不存在 , 错误信息 **150003 款项不存在**
        
                |Requests:|
                :param salesPayment.spid: 销售款ID
        :type salesPayment.spid: Long

        Example::
        
            {
                "salesPayment.spid": 1
            }
            
    ### <I> addSalesPaymentForDeposit

        添加定金销售款 , 支持不退类型
        
        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**
        
        应收款金额大于零 , 小于零 , 错误信息 **150025 款项金额不正确**
        
        不可存在销售单对应的其他款项 , 如果存在 , 错误信息 **150029 款项不可提交**
        
        判断提交销售款类型是否已经存在 , 已存在 , 错误信息 **150029 款项不可提交**
        
        销售单更新定金额为提交项金额 , 定金状态为0(未付款)
        
                |Requests:|
                :param salesPayment.sales.sid: 销售单ID
        :type salesPayment.sales.sid: Long
        :param salesPayment.sales.ctype: 结算类型
        :type salesPayment.sales.ctype: Short
        :param salesPayment.sales.cvalue: 结算值
        :type salesPayment.sales.cvalue: Long
        
        :param salesPayment.type: 类型 , 支持1(定金)和8(不退定金)
        :type salesPayment.type: Short
        :param salesPayment.referMoney: 应收金额
        :type salesPayment.referMoney: Long
        
        Example::
        
            {
                "salesPayment.sales.sid": 1,
                "salesPayment.sales.ctype": 1,
                "salesPayment.sales.cvalue": 1000,
                "salesPayment.type": 1,
                "salesPayment.referMoney": 1000
            }
            
    ### <I> addSalesPaymentForFullpay

        添加补款销售款
        
        获取销售款类型为3(补款)的款项 , 如果存在 , 错误信息 **150040 补款已存在**
        
        定金销售款存在 , 判断款项状态是否为1(已收款)或2(已确认) , 状态为0(初始) , 错误信息 **150041 定金状态不可操作**
        
        判断销售项数量是否为0 , 如果不存在项目 , 错误信息 **260060 销售项数量不足**
        
        判断销售项总额与定金+补款总额是否一致 , 不一致 , 错误信息 **150017 项目总额与款项额不符**
        
        生成款项金额为正数 , 款项类型为3(补款) , 生成金额为负数 , 款项类型为5(补款退款)
        
        款项类型为5(补款退款) , 判断销售单款项积分以及领取活动物品积分 , 款项积分不足 , 错误信息 **160037 积分不足**
        
        销售单更新补款额为提交款项金额 , 补款状态为0(未付款)
        
        生成补款退款类型款项信息 , 其作用等同于补款
        
                |Requests:|
                :param salesPayment.sid: 销售单ID
        :type salesPayment.sid: Long
        :param salesPayment.referMoney: 应收金额
        :type salesPayment.referMoney: Long
        
        Example::
        
            {
                "salesPayment.sid": 1,
                "salesPayment.referMoney": 1000
            }

    ### <I> cancelSalesPayment

        销售款撤销
        
        款项状态为初始才能够完成撤销 , 其他状态撤销失败 , 错误信息 **150019 款项不能撤销**
        
        根据款项类型更新销售单中款项状态 , 定金(2)更新定金金额为0 , 状态为无款项(-1) ; 补款(3)/补款退款(5)更新补款金额为0 , 状态为无款项(-1)
        
                |Requests:|
                :param salesPayment.spid: 款项ID
        :type salesPayment.spid: Long
        
        Example::
        
            {
                "salesPayment.spid": 1
            }

    ### <I> cancelSalesPaymentForDeposit

        撤销定金销售款
        
        获取销售款类型为3(补款)的款项 , 如果存在 , 错误信息 **150040 补款已存在**
        
        获取销售款类型为2(定金)的款项 , 如果不存在 , 错误信息 **150037 定金不存在**
        
        判断定金销售款状态是否为0(初始) , 其他状态 , 错误信息 **150036 款项状态不可操作**
        
        删除定金销售款信息
        
        更新销售单中定金额为0 , 定金状态为-1(初始)
        
                |Requests:|
                :param salesPayment.sid: 销售单ID
        :type salesPayment.sid: Long
        
        Example::
        
            {
                "salesPayment.sid": 1
            }
            
    ### <I> cancelSalesPaymentForFullpay

        撤销补款销售款
        
        获取销售款类型为3(补款)的款项 , 如果不存在 , 错误信息 **150038 补款不存在**
        
        判断补款销售款状态是否为0(初始) , 其他状态 , 错误信息 **150036 款项状态不可操作**
        
        删除补款销售款信息
        
        更新销售单中补款额为0, 补款状态为-1(初始)
        
                |Requests:|
                :param salesPayment.sid: 销售单ID
        :type salesPayment.sid: Long
        
        Example::
        
            {
                "salesPayment.sid": 1
            }

    ### <I> collectSalesPayment

        销售款收款
        
        判断销售款是否存在 , 不存在 , 错误信息 **150003 款项不存在**
        
        判断销售款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**
        
        判断券值与券信息中各项券值之和是否相等 , 不相等收款失败 , **150024 券总金额与券统计金额不等**
        
        判断应收金额与各类型收款方式金额之和是否相等 , 不相等收款失败 , **150025 款项金额不正确**
        
        收款方式包括预付款 , 判断操作金额是否满足预付款余额 , 余额不足 , 错误信息 **150010 预付款余额不足**
        
        销售款公司信息根据收款人操作公司进行更新
        
        更新销售单对应收款类型的状态信息 , 定金/补款状态为1(已付款)
        
        款项类型为补款(3) , 更新销售单中补款时间
        
        更新归属装修单中的销售比例 , 包括预付款(主材)/销售款
        
                |Requests:|
                :param salesPayment.spid: 款项ID
        :type salesPayment.spid: Long
        :param salesPayment.realMoney: 实收金额
        :type salesPayment.realMoney: Long
        :param salesPayment.cash: 现金
        :type salesPayment.cash: Long
        :param salesPayment.cashInfo: 现金信息
        :type salesPayment.cashInfo: String
        :param salesPayment.bank: 刷卡
        :type salesPayment.bank: Long
        :param salesPayment.bankInfo: 刷卡信息
        :type salesPayment.bankInfo: String
        :param salesPayment.checkv: 转账
        :type salesPayment.checkv: Long
        :param salesPayment.checkvBank: 转账银行
        :type salesPayment.checkvBank: String
        :param salesPayment.installment: 分期
        :type salesPayment.installment: Long
        :param salesPayment.installmentBank: 分期银行
        :type salesPayment.installmentBank: String
        :param salesPayment.accounts: 对公
        :type salesPayment.accounts: Long
        :param salesPayment.accountsBank: 对公银行
        :type salesPayment.accountsBank: String
        :param salesPayment.coupon: 券值
        :type salesPayment.coupon: Long
        :param salesPayment.couponInfo: 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
        :type salesPayment.couponInfo: String
        :param salesPayment.advance: 预付款
        :type salesPayment.advance: Long
        :param salesPayment.advanceType: 预付款类型 , 1: 合同预付款 , 2: 工程预付款
        :type salesPayment.advanceType: Short
        :param salesPayment.comment: 说明
        :type salesPayment.comment: String
        
        Example::
        
            {
                "salesPayment.spid": 1,
                "salesPayment.realMoney": 10000,
                "salesPayment.cash": 10000,
                "salesPayment.cashInfo": "175",
                "salesPayment.bank": 10000,
                "salesPayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
                "salesPayment.checkv": 10000,
                "salesPayment.checkvBank": "189",
                "salesPayment.installment": 10000
                "salesPayment.installmentBank": "201",
                "salesPayment.accounts": 10000,
                "salesPayment.accountsBank": "201",
                "salesPayment.coupon": 0,
                "salesPayment.couponInfo": "",
                "salesPayment.advance": 0,
                "salesPayment.advanceType": 0,
                "salesPayment.comment": "说明",
            }
            
    ### <I> collectSalesPayments

        销售款批量收款
        
        判断销售款是否存在 , 不存在 , 错误信息 **150003 款项不存在**
        
        判断销售款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**
        
        判断应收金额与各类型收款方式金额之和是否相等 , 不相等收款失败 , **150025 款项金额不正确**
        
        收款方式包括预付款 , 判断操作金额是否满足预付款余额 , 余额不足 , 错误信息 **150010 预付款余额不足**
        
        销售款公司信息根据收款人操作公司进行更新
        
        更新销售单对应收款类型的状态信息 , 定金/补款状态为1(已付款)
        
        款项类型为补款(3) , 更新销售单中补款时间
        
        更新归属装修单中的销售比例 , 包括预付款(主材)/销售款
        
                |Requests:|
                :param sales.sid: 销售单ID
        :type sales.sid: String
        :param salesPayment[n].spid: 款项ID列表 , 每条数据类型 Long
        :type salesPayment[n].spid: List
        :param salesReceipt.realMoney: 实收金额
        :type salesReceipt.realMoney: Long
        :param salesReceipt.cash: 现金
        :type salesReceipt.cash: Long
        :param salesReceipt.cashInfo: 现金信息
        :type salesReceipt.cashInfo: String
        :param salesReceipt.bank: 刷卡
        :type salesReceipt.bank: Long
        :param salesReceipt.bankInfo: 刷卡信息
        :type salesReceipt.bankInfo: String
        :param salesReceipt.checkv: 转账
        :type salesReceipt.checkv: Long
        :param salesReceipt.checkvBank: 转账银行
        :type salesReceipt.checkvBank: String
        :param salesReceipt.installment: 分期
        :type salesReceipt.installment: Long
        :param salesReceipt.installmentBank: 分期银行
        :type salesReceipt.installmentBank: String
        :param salesReceipt.accounts: 对公
        :type salesReceipt.accounts: Long
        :param salesReceipt.accountsBank: 对公银行
        :type salesReceipt.accountsBank: String
        :param salesReceipt.coupon: 券值
        :type salesReceipt.coupon: Long
        :param salesReceipt.couponInfo: 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
        :type salesReceipt.couponInfo: String
        :param salesReceipt.advance: 预付款
        :type salesReceipt.advance: Long
        :param salesReceipt.advanceType: 预付款类型 , 1: 合同预付款 , 2: 工程预付款
        :type salesReceipt.advanceType: Short
        :param salesReceipt.comment: 说明
        :type salesReceipt.comment: String
        
        Example::
        
            {
                "sales.sid": 1,
                "salesPayment[0].spid": 1,
                "salesReceipt.realMoney": 10000,
                "salesReceipt.cash": 10000,
                "salesReceipt.cashInfo": "175",
                "salesReceipt.bank": 10000,
                "salesReceipt.bankInfo": "#187|15000|2016-03-23 14:25:15#",
                "salesReceipt.checkv": 10000,
                "salesReceipt.checkvBank": "189",
                "salesReceipt.installment": 10000
                "salesReceipt.installmentBank": "201",
                "salesReceipt.accounts": 10000,
                "salesReceipt.accountsBank": "201",
                "salesReceipt.coupon": 0,
                "salesReceipt.couponInfo": "",
                "salesReceipt.advance": 0,
                "salesReceipt.advanceType": 0,
                "salesReceipt.comment": "说明"
            }
            
    ### <I> refundSalesPayment

        销售退款
        
        判断销售款是否存在 , 不存在 , 错误信息 **150003 款项不存在**
        
        判断销售款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**
        
        如果销售款类型为7(定金退款) , 更新主材单中定金额为0 , 定金状态为0(初始)
        
        如果主材款类型为5(补款退款) , 更新主材单中补款状态为1(已付款) , 补款时间为操作时间
        
        如果主材款类型为4(退款) , 更新退货单状态为1(已付款)
        
        销售款公司信息根据收款人操作公司进行更新
        
        更新款项状态以及生成对应收据相关信息

                |Requests:|
                :param salesPayment.spid: 款项ID
        :type salesPayment.spid: Long
        :param salesPayment.cash: 现金
        :type salesPayment.cash: Long
        :param salesPayment.cashInfo: 现金信息
        :type salesPayment.cashInfo: String
        :param salesPayment.bank: 刷卡
        :type salesPayment.bank: Long
        :param salesPayment.bankInfo: 刷卡信息
        :type salesPayment.bankInfo: String
        :param salesPayment.checkv: 转账
        :type salesPayment.checkv: Long
        :param salesPayment.checkvBank: 转账银行
        :type salesPayment.checkvBank: String
        :param salesPayment.installment: 分期
        :type salesPayment.installment: Long
        :param salesPayment.installmentBank: 分期银行
        :type salesPayment.installmentBank: String
        :param salesPayment.accounts: 对公
        :type salesPayment.accounts: Long
        :param salesPayment.accountsBank: 对公银行
        :type salesPayment.accountsBank: String
        :param salesPayment.coupon: 券值
        :type salesPayment.coupon: Long
        :param salesPayment.couponInfo: 券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
        :type salesPayment.couponInfo: String
        :param salesPayment.advance: 预付款
        :type salesPayment.advance: Long
        :param salesPayment.comment: 说明
        :type salesPayment.comment: String
        
        Example::
        
            {
                "salesPayment.spid": 1,
                "salesPayment.cash": 10000,
                "salesPayment.cashInfo": "175",
                "salesPayment.bank": 10000,
                "salesPayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
                "salesPayment.checkv": 10000,
                "salesPayment.checkvBank": "189",
                "salesPayment.installment": 10000,
                "salesPayment.installmentBank": "201",
                "salesPayment.accounts": 10000,
                "salesPayment.accountsBank": "201",
                "salesPayment.coupon": 0,
                "salesPayment.couponInfo": "",
                "salesPayment.advance": 0,
                "salesPayment.advanceType": 0,
                "salesPayment.comment": "说明",
            }

    ### <I> refundSalesPaymentForDeposit

        生成销售款中定金退款
        
        获取销售款类型为3(补款)的款项 , 如果存在 , 错误信息 **150040 补款已存在**
        
        获取销售款类型为2(定金)的款项 , 如果不存在 , 错误信息 **150037 定金不存在**
        
        判断定金销售款状态是否为2(已确认) , 其他状态 , 错误信息 **150012 款项不能进行退款**
        
        判断销售单款项积分以及领取活动物品积分 , 款项积分不足 , 错误信息 **160037 积分不足**
        
        销售单更新定金额为0 , 定金状态为-1(初始)
        
        主材单状态更新为4(废单)
        
                |Requests:|
                :param salesPayment.sales.sid: 销售单ID
        :type salesPayment.sales.sid: Long
        
        Example::
        
            {
                "salesPayment.sales.sid": 1
            }

    ### <I> refundSalesPaymentForCoupon

        生成销售款中券退款
        
        获取销售款类型为2(定金)的款项 , 如果不存在 , 错误信息 **150037 定金不存在**
        
        判断定金销售款状态是否为1(已收款)或2(已确认) , 状态为0(初始) , 错误信息 **150041 定金状态不可操作**
        
        判断销售单款项积分以及领取活动物品积分 , 款项积分不足 , 错误信息 **160037 积分不足**
        
        生成券退款类型款项信息 , 同时更新销售单中券值和券信息

                |Requests:|
                :param sales.sid: 销售单ID
        :type sales.sid: Long
        :param sales.coupon: 券值
        :type sales.coupon: Long
        :param sales.couponInfo: 券信息
        :type sales.couponInfo: String
        
        Example::
        
            {
                "sales.sid": 1,
                "sales.coupon": 100000,
                "sales.couponInfo": #瓷砖券:100#
            }

    ### <I> updateSalesPayment

        更新销售款收款方式
        
        判断款项是否存在 , 不存在 , 错误信息 **150003 款项不存在**
        
        款项状态1(已付款) , 其他状态不可更新 , 错误信息 **150036 款项状态不可操作**
        
        款项修改之后金额与应收额不等 , 不可更新 , 错误信息 **150025 款项金额不正确**
        
        预付款和优惠券不可修改

                |Requests:|
                :param salesPayment.spid: 款项ID
        :type salesPayment.spid: Long
        :param salesPayment.cash: 现金
        :type salesPayment.cash: Long
        :param salesPayment.cashInfo: 现金信息
        :type salesPayment.cashInfo: String
        :param salesPayment.bank: 刷卡
        :type salesPayment.bank: Long
        :param salesPayment.bankInfo: 刷卡信息
        :type salesPayment.bankInfo: String
        :param salesPayment.checkv: 转账
        :type salesPayment.checkv: Long
        :param salesPayment.checkvBank: 转账银行
        :type salesPayment.checkvBank: String
        :param salesPayment.comment: 说明
        :type salesPayment.comment: String
        
        Example::
        
            {
                "salesPayment.spid": 1,
                "salesPayment.cash": 10000,
                "salesPayment.cashInfo": "175",
                "salesPayment.bank": 10000,
                "salesPayment.bankInfo": "#187|10|2016-03-23 14:25:15#",
                "salesPayment.checkv": 10000,
                "salesPayment.checkvBank": "#187|10|2016-03-23 14:25:15#",
                "salesPayment.comment": "说明",
            }

    ### <I> confirmSalesPayment

        销售款确认
        
        判断款项是否存在 , 不存在 , 错误信息 **150003 款项不存在**
        
        销售款类型为2(定金) , 更新销售单定金状态为2(已确认)
        
        销售款类型为3(补款)/5(补款退款) , 更新销售单单补款状态为2(已确认)
        
        已经确认的销售款忽略处理
        
                |Requests:|
                :param spids[n]: 款项ID列表 , 每条数据类型 Long
        :type spids[n]: List
        
        Example::
        
            {
                "spids[0]": 1
            }
            
## 活动款

## api.payment.ActivityPaymentAction

        |DataType:|
        #### activityPayment

    - **apid**: 活动款ID
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
    - **type**: 类型 , 0: 装修款 , 1: 主材款
      - 类型: *Short*
    - **status**: 状态 , 0: 未付款 , 1: 已付款
      - 类型: *Short*
    - **category**: 品类
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
    
    #### activityReceipt

    - **arid**: 活动收据ID
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
    
    ### <I> pageActivityPayment

        分页方式获取活动款信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 活动款信息列表 , 每条数据类型 *activityPayment*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "apid": 1,
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
            
    ### <I> queryActivityPaymentByArid

        通过活动收据ID获取活动款信息
        
                |Requests:|
                :param activityPayment.arid: 活动收据ID
        :type activityPayment.arid: Long
        
        Example::
        
            {
                "activityPayment.arid": 1
            }
            
                |Returns:|
                - **activityPayments**: 活动款信息列表 , 每条数据类型 *activityPayment*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "activityPayments": [
                    {
                        "apid": 1,
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
            
    ### <I-C> queryActivityPaymentByNo

        通过活动票号获取活动款信息
        
                |Requests:|
                :param activityPayment.mno: 活动票号
        :type activityPayment.mno: String
        
        Example::
        
            {
                "activityPayment.mno": "000000000000000000"
            }
            
                |Returns:|
                - **activityPayments**: 活动款信息列表 , 每条数据类型 *activityPayment*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "activityPayments": [
                    {
                        "apid": 1,
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
            
    ### <I> queryActivityReceiptByArid

        通过活动收据ID获取活动收据信息
        
                |Requests:|
                :param activityReceipt.arid: 活动收据ID
        :type activityReceipt.arid: Long
        
        Example::
        
            {
                "activityReceipt.arid": 1
            }
            
                |Returns:|
                - **activityReceipt**: 活动收据
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "activityReceipt": {
                    "arid": 1,
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
            
    ### <I> countActivityPayment

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
            
    ### <I> createActivityPayment

        创建活动款信息
        
                |Requests:|
                :param activityPayment.mno: 活动票号
        :type activityPayment.mno: String
        :param activityPayment.type: 类型
        :type activityPayment.type: Short
        :param activityPayment.category: 品类
        :type activityPayment.category: String
        :param activityPayment.brand: 品牌
        :type activityPayment.brand: String
        :param activityPayment.money: 金额
        :type activityPayment.money: Integer
        :param activityPayment.comment: 备注
        :type activityPayment.comment: String
        
        Example::
        
            {
                "activityPayment.mno": "000000000000000000",
                "activityPayment.type": 1,
                "activityPayment.category": "品类",
                "activityPayment.brand": "品牌1",
                "activityPayment.money": 100000,
                "activityPayment.comment": "说明"
            }

    ### <I> collectActivityPayment

        活动款收款 , 同时支持批量收款
        
        判断活动票是否存在 , 不存在 , 错误信息 **160044 活动票不存在**
        
        判断活动票是否已经注册 , 未注册 , 错误信息 **160045 活动票未注册**
        
        判断活动款总额是否与收款总额相同
        
        批量收款时 , 判断多个款项对应人会员号是否唯一
        
        创建收款数据 , 更新款项状态
        
                |Requests:|
                :param activityPayment[n].apid: 活动款ID
        :type activityPayment[n].apid: Long
        
        :param activityReceipt.orderId: 装修单号
        :type activityReceipt.orderId: String
        :param activityReceipt.cash: 现金
        :type activityReceipt.cash: Integer
        :param activityReceipt.bank: 刷卡
        :type activityReceipt.bank: Integer
        :param activityReceipt.bankInfo: 刷卡信息
        :type activityReceipt.bankInfo: String
        :param activityReceipt.comment: 说明
        :type activityReceipt.comment: String
        
        Example::
        
            {
                "activityPayment[0].apid": 1,
                "activityPayment[1].apid": 2,
                "activityReceipt.orderId": "1601010001",
                "activityReceipt.cash": 100000,
                "activityReceipt.bank": 0,
                "activityReceipt.bankInfo": "",
                "activityReceipt.comment": "说明"
            }

## 代付款

## api.payment.ProxyPaymentAction

        |DataType:|
        #### proxyPayment

    - **ppid**: 代付款ID
      - 类型: *Long*
    - **prid**: 收据ID
      - 类型: *Long*
    - **title**: 标题
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **phone**: 电话
      - 类型: *String*
    - **address**: 地址
      - 类型: *String*
    - **unionId**: 归属人ID
      - 类型: *String*
    - **orderId**: 装修单号
      - 类型: *String*
    - **referMoney**: 应付款
      - 类型: *Long*
    - **realMoney**: 实收金额
      - 类型: *Long*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **did**: 部门ID
      - 类型: *Integer*
    - **rid**: 分区ID
      - 类型: *Integer*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **type**: 类型 , 0: 收款 , 1: 退款
      - 类型: *Short*
    - **status**: 状态 , 0:初始, 1:已付款, 2:已确认
      - 类型: *Short*
    - **isexpire**: 过期标识 , 0: 有效 , 1: 过期
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*
    
    #### proxyReceipt

    - **prid**: 收据ID
      - 类型: *Long*
    - **collecter**: 收款人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **collectTime**: 收款时间
      - 类型: *Timestamp*
    - **confirmer**: 确认人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **confirmTime**: 确认时间
      - 类型: *Timestamp*
    - **realMoney**: 实收金额
      - 类型: *Long*
    - **cash**: 现金
      - 类型: *Long*
    - **cashInfo**: 现金信息
      - 类型: *String*
    - **bank**: 刷卡
      - 类型: *Long*
    - **bankInfo**: 刷卡信息 , **#** 分隔多条刷卡信息, **|** 分隔信息中不同字段 , 由 **类型|金额|时间** 组成 , 例如: **#187|15000|2016-03-23 14:25:15#**
      - 类型: *String*
    - **checkv**: 转账
      - 类型: *Long*
    - **checkvBank**: 转账银行
      - 类型: *String*
    - **comment**: 说明
      - 类型: *String*
    
    ### <I> pageProxyPayment

        分页方式获取代付款信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 代付款信息列表 , 每条数据类型 *proxyPayment*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "ppid": 1,
                            "prid": 1,
                            "title": "标题",
                            "name": "名称",
                            "phone": "",
                            "address": "",
                            "unionId": "",
                            "orderId": "",
                            "referMoney": 1000,
                            "realMoney": 1000,
                            "creater": {
                                "uid": 1,
                                "userId": "FL-02381",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "phone": "136xxxx1453",
                                ...
                            },
                            "createTime": "2016-01-01 00:00:00",
                            "type": 0,
                            "status": 0,
                            "collecter": null,
                            "collectTime": null,
                            "confirmer": null
                            "confirmTime": null,
                            "realMoney": 0,
                            "cash": 0,
                            "cashInfo": "",
                            "bank": 0,
                            "bankInfo": "",
                            "checkv": 0,
                            "checkvBank": "",
                            "comment": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I> queryProxyPayment

        通过代付款ID获取信息
        
                |Requests:|
                :param proxyPayment.ppid: 代付款ID
        :type proxyPayment.ppid: Long
        
        Example::
        
            {
                "proxyPayment.ppid": 1
            }
            
                |Returns:|
                - **proxyPayment**: 代付款 , 类型 *proxyPayment*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "proxyPayment": {
                    "ppid": 1,
                    "prid": 1,
                    "title": "标题",
                    "name": "名称",
                    "phone": "",
                    "address": "",
                    "unionId": "",
                    "orderId": "",
                    "referMoney": 1000,
                    "realMoney": 1000,
                    "creater": {
                        "uid": 1,
                        "userId": "FL-02381",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "phone": "136xxxx1453",
                        ...
                    },
                    "createTime": "2016-01-01 00:00:00",
                    "type": 0,
                    "status": 0,
                    "collecter": null,
                    "collectTime": null,
                    "confirmer": null
                    "confirmTime": null,
                    "realMoney": 0,
                    "cash": 0,
                    "cashInfo": "",
                    "bank": 0,
                    "bankInfo": "",
                    "checkv": 0,
                    "checkvBank": "",
                    "comment": ""
                },
                ...
            }

    ### <I> queryProxyPaymentForUnionId

        通过代付款ID获取信息
        
                |Requests:|
                :param proxyPayment.unionId: 代付款ID
        :type proxyPayment.unionId: Long
        
        Example::
        
            {
                "proxyPayment.unionId": 1
            }
            
                |Returns:|
                - **proxyPayments**: 代付款 , 类型 *proxyPayment*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "proxyPayment": {
                    "ppid": 1,
                    "prid": 1,
                    "title": "标题",
                    "name": "名称",
                    "phone": "",
                    "address": "",
                    "unionId": "",
                    "orderId": "",
                    "referMoney": 1000,
                    "realMoney": 1000,
                    "creater": {
                        "uid": 1,
                        "userId": "FL-02381",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "phone": "136xxxx1453",
                        ...
                    },
                    "createTime": "2016-01-01 00:00:00",
                    "type": 0,
                    "status": 0,
                    "collecter": null,
                    "collectTime": null,
                    "confirmer": null
                    "confirmTime": null,
                    "realMoney": 0,
                    "cash": 0,
                    "cashInfo": "",
                    "bank": 0,
                    "bankInfo": "",
                    "checkv": 0,
                    "checkvBank": "",
                    "comment": ""
                },
                ...
            }

    ### <I> addProxyPayment

        添加代付款信息
        
                |Requests:|
                :param proxyPayment.title: 标题
        :type proxyPayment.title: String
        :param proxyPayment.name: 名称
        :type proxyPayment.name: String
        :param proxyPayment.phone: 电话
        :type proxyPayment.phone: String
        :param proxyPayment.address: 地址
        :type proxyPayment.address: String
        :param proxyPayment.referMoney: 生成金额
        :type proxyPayment.referMoney: Long
        :param proxyPayment.creater.userId: 创建人编号
        :type proxyPayment.creater.userId: String
        
        Example::
        
            {
                "proxyPayment.title": "",
                "proxyPayment.name": "",
                "proxyPayment.phone": "",
                "proxyPayment.address": "",
                "proxyPayment.referMoney": 600000,
                "proxyPayment.creater.userId": "FL-02381"
            }

    ### <I> collectProxyPayment

        代付款收款
        
        判断代付款是否存在 , 不存在 , 错误信息 **150003 款项不存在**
        
        判断款收款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**
        
                |Requests:|
                :param proxyPayment.ppid: 款项ID
        :type proxyPayment.ppid: Long
        :param proxyPayment.realMoney: 实收金额
        :type proxyPayment.realMoney: Long
        :param proxyPayment.cash: 现金
        :type proxyPayment.cash: Long
        :param proxyPayment.cashInfo: 现金信息
        :type proxyPayment.cashInfo: String
        :param proxyPayment.bank: 刷卡
        :type proxyPayment.bank: Long
        :param proxyPayment.bankInfo: 刷卡信息
        :type proxyPayment.bankInfo: String
        :param proxyPayment.checkv: 转账
        :type proxyPayment.checkv: Long
        :param proxyPayment.checkvBank: 转账银行
        :type proxyPayment.checkvBank: String
        :param proxyPayment.comment: 说明
        :type proxyPayment.comment: String
        
        Example::
        
            {
                "proxyPayment.ppid": 1,
                "proxyPayment.realMoney": 10000,
                "proxyPayment.cash": 10000,
                "proxyPayment.cashInfo": "175",
                "proxyPayment.bank": 10000,
                "proxyPayment.bankInfo": "#187|15000|2016-03-23 14:25:15#",
                "proxyPayment.checkv": 10000,
                "proxyPayment.checkvBank": "189",
                "proxyPayment.comment": "说明",
            }

    ### <I> refundProxyPayment

    ### <I> confirmProxyPayment

        代付款确认 , 更新款项状态为已确认
        
                |Requests:|
                :param ppids[n]: 款项ID列表 , 每条数据类型 Long
        :type ppids[n]: List
        
        Example::
        
            {
                "ppids[0]": 1
            }

    ### <I> cancelProxyPayment

## 转换款

## api.payment.PaytranAction

        |DataType:|
        #### paytran

    - **ptid**: 转换款ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **pid**: 款项ID
      - 类型: *Long*
    - **rid**: 收据ID
      - 类型: *Long*
    - **rtid**: 商户类型ID
      - 类型: *Long*
    - **type**: 类型 , 0: 预付款 , 1: 装修款 , 2: 主材款 , 3: 销售款 , 4: 服务款 , 5: 活动款 , 6: 转换款 , 7: 代付款
      - 类型: *Short*
    - **atttype**: 业务类型 , 0: 装修 , 1: 主材
      - 类型: *Short*
    - **no**: 收据编号
      - 类型: *String*
    - **sn**: 机器编号
      - 类型: *String*
    - **msgId**: 消息编号
      - 类型: *String*
    - **outOrderId**: 订单号
      - 类型: *String*
    - **status**: 状态 , 0: 初始 , 1: 成功 , 2: 失败 , 3: 失效
      - 类型: *Short*
    - **money**: 金额
      - 类型: *Long*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **pushTime**: 推送时间
      - 类型: *Timestamp*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **rstcode**: 响应码
      - 类型: *String*
    - **rstmsg**: 响应信息
      - 类型: *String*
    - **way**: 支付方式 , 包括: 0: pospay(刷卡), 1: wxpay(微信), 2: alipay(支付宝), 3: codepay(pos扫码)
      - 类型: *Short*
    
    ### <I> pagePaytran

        分页方式获取转换款信息 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter) 
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *object*
        :param paging.data: 转换款信息列表 , 每条数据类型 *paytran*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "ptid": 1,
                            "orderId": "1601010001",
                            "pid": 1,
                            "rid": 1,
                            "type": 1,
                            "atttype": 0,
                            "no": "157",
                            "sn": "420408479404809043870826390",
                            "msgId": "67538996237553921700979907083217",
                            "outOrderId": "1615670",
                            "status": 0,
                            "money": 100000,
                            "createTime": "2016-01-01 00:00:00",
                            "pushTime": "2016-01-01 00:00:00",
                            "creater": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "rstcode": "",
                            "rstmsg": ""
                        }
                    ],
                    ...
                },
                ...
            }
    
    ### <I> queryPaytran

        根据款项ID以及类型获取转换款信息
        
                |Requests:|
                :param paytran.pid: 款项ID
        :type paytran.pid: Long
        :param paytran.rid: 收据ID
        :type paytran.rid: Long
        :param paytran.type: 类型
        :type paytran.type: Short
        :param paytran.atttype: 业务类型
        :type paytran.atttype: Short
        
        Example::
        
            {
                "paytran.pid": 1,
                "paytran.rid": 1,
                "paytran.type": 1,
                "paytran.atttype": 0
            }
            
                |Returns:|
                - **paytrans**: 转换款信息列表 , 类型 *paytran*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "paytrans": [
                    {
                        "ptid": 1,
                        "orderId": "1601010001",
                        "pid": 1,
                        "rid": 1,
                        "type": 1,
                        "atttype": 0,
                        "no": "157",
                        "sn": "420408479404809043870826390",
                        "msgId": "67538996237553921700979907083217",
                        "outOrderId": "1615670",
                        "status": 0,
                        "money": 100000,
                        "createTime": "2016-01-01 00:00:00",
                        "pushTime": "2016-01-01 00:00:00",
                        "creater": {
                            "uid": 1,
                            "userId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师"
                        },
                        "rstcode": "",
                        "rstmsg": ""
                    }
                ]
                ...
            }

    ### <I-C> queryPaytranByPtid

        通过转换款ID获取转换款信息
        
                |Requests:|
                :param paytran.ptid: 转换款ID
        :type paytran.pid: Long
        
        Example::
        
            {
                "paytran.pid": 1,
                "paytran.rid": 1,
                "paytran.type": 1
            }

                |Returns:|
                - **paytran**: 转换款信息 , 类型 *paytran*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "paytran": {
                    "ptid": 1,
                    "orderId": "1601010001",
                    "pid": 1,
                    "rid": 0,
                    "type": 1,
                    "atttype": 0,
                    "no": "157",
                    "sn": "420408479404809043870826390",
                    "msgId": "67538996237553921700979907083217",
                    "outOrderId": "1615670",
                    "status": 0,
                    "money": 100000,
                    "createTime": "2016-01-01 00:00:00",
                    "pushTime": "2016-01-01 00:00:00",
                    "creater": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "rstcode": "",
                    "rstmsg": ""
                }
                ...
            }

    ### <I> sendPaytran

        推送转换款
        
        验证转款款信息是否存在 , 不存在 , 错误信息 **150003 款项不存在**
        
                |Requests:|
                :param paytran.pid: 转换款ID
        :type paytran.pid: Long

        Example::
        
            {
                "paytran.pid": 1
            }
            
    ### <I> addPaytran

        添加转换款信息 , 发起收款
        
        金额精度处理 , 支持两位小数 , 分
        
        判断金额处理之后 , 不能为0 , 错误信息 **150025 款项金额不正确**
        
        判断当前pid对应是否存在状态处于(0)初始的转换款信息 , 如果存在 , 错误信息 **150048 转换款支付未完成**
        
        调用第三方支付工具 , 完成发起转换款信息过程 , 更新第三方支付信息
        
                |Requests:|
                :param paytran.pid: 款项ID
        :type paytran.pid: Long
        :param paytran.type: 类型
        :type paytran.type: Short
        :param paytran.no: 收据编号
        :type paytran.no: String
        :param paytran.sn: 机器编号
        :type paytran.sn: String
        :param paytran.money: 收据编号
        :type paytran.money: String
        :param paytran.way: 交易方式
        :type paytran.way: String
        
        Example::
        
            {
                "paytran.pid": 1,
                "paytran.type": 1,
                "paytran.no": "157",
                "paytran.sn": "420408479404809043870826390",
                "paytran.money": 1,
                "paytran.way": "wxpay"
            }
            
                |Returns:|
                - **paytran**: 转换款 , 类型 *paytran*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "paytran": {
                    "ptid": 1,
                    "pid": 1,
                    "type": 1,
                    "no": "157",
                    "sn": "420408479404809043870826390",
                    "msgId": "67538996237553921700979907083217",
                    "outOrderId": "1615670",
                    "status": 0,
                    "money": 100000,
                    "createTime": "2016-01-01 00:00:00",
                    "creater": {
                        "uid": 1,
                        "userId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师"
                    },
                    "rstcode": "",
                    "rstmsg": ""
                }
                ...
            }
            
    ### <I> checkPaytran

        验证转换款信息 , 收款成功或者失败 , 更新状态
        
        判断转换款信息是否存在 , 不存在 , 错误信息 **150043 转换款不存在**
        
        判断转换款信息状态是否为0(初始) , 其他状态 , 错误信息 **150047 转换款支付不可操作**
        
        调用第三方支付工具 , 完成转换款信息验证过程 , 同时更新转换款状态以及结果信息
        
                |Requests:|
                :param paytran.ptid: 转换款ID
        :type paytran.ptid: Long

        Example::
        
            {
                "paytran.pid": 1,
            }
            
                |Returns:|
                - **paytran**: 转换款 , 类型 *paytran*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "paytran": {
                    "ptid": 1,
                    "pid": 1,
                    "type": 1,
                    "no": "157",
                    "sn": "420408479404809043870826390",
                    "msgId": "67538996237553921700979907083217",
                    "outOrderId": "1615670",
                    "status": 0,
                    "money": 100000,
                    "createTime": "2016-01-01 00:00:00",
                    "rstcode": "",
                    "rstmsg": ""
                }
                ...
            }

    ### <I> cancelPaytran

        撤销转换款
        
        判断转换款信息是否存在 , 不存在 , 错误信息 **150043 转换款不存在**
        
        判断转换款信息状态不为1(成功) , 成功状态 , 错误信息 **150047 转换款支付不可操作**
        
                |Requests:|
                :param paytran.ptid: 转换款ID
        :type paytran.ptid: Long

        Example::
        
            {
                "paytran.pid": 1,
            }

    ### <I> deletePaytran

        删除转换款
        
        判断转换款信息是否存在 , 不存在 , 错误信息 **150043 转换款不存在**
        
        判断转换款信息状态不为0(初始) , 成功状态 , 错误信息 **150047 转换款支付不可操作**
        
                |Requests:|
                :param paytran.ptid: 转换款ID
        :type paytran.ptid: Long

        Example::
        
            {
                "paytran.pid": 1,
            }

## 收款单

## api.payment.BillAction

        |DataType:|
        #### bill

    - **bid**: 收款单ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **rtid**: 收据类型ID
      - 类型: *Long*
    - **money**: 收款额
      - 类型: *Long*
    - **status**: 状态 , 0: 初始 , 1: 提交 , 2: 已付 , 3: 拒绝 , 4: 超时 , 5: 失效
      - 类型: *Short*
    
    #### billItem

    - **biid**: 收款项ID
      - 类型: *Long*
    - **bid**: 收款单ID
      - 类型: *Long*
    - **type**: 款项类型 , 0: 预付款 , 1: 装修款 , 2: 主材款 , 3: 销售款 , 4: 服务款 , 5: 活动款 , 6: 转换款 , 7: 代付款
      - 类型: *Short*
    - **pid**: 款项ID
      - 类型: *Long*
    
    ### <I> pageBill

        分页方式获取收款单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 钱包信息列表 , 每条数据类型 *wallet*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "bid": 1,
                            "orderId": "1601010001",
                            "money": 1000000,
                            "status": 1
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I> queryBill

        获取收款单信息
        
                |Requests:|
                :param bill.bid: 收款单ID
        :type bill.bid: Long
        
        Example::
        
            {
                "bill.bid": 1
            }
            
                |Returns:|
                - **bill**: 收款单信息 , 数据类型 *bill*
          - 类型: *Object*
        
        Example::
        
            {
                "bid": 1,
                "orderId": "1601010001",
                "money": 1000000,
                "status": 1
            }

    ### <I> makeBill

        创建收款单
        
                |Requests:|
                :param bill.orderId: 装修单号
        :type bill.orderId: String
        :param bill.money: 收款额
        :type bill.money: Long
        
        :param billItems[n].pid: 款项ID
        :type billItems[n].pid: Long
        :param billItems[n].type: 款项类型
        :type billItems[n].type: Short
        
        Example::
        
            {
                "bill.orderId": "1601010001",
                "bill.money": 100000,
                
                "billItems[0].pid": 1,
                "billItems[0].type": 1
            }

    ### <I> cancelBill

        取消收款单
        
                |Requests:|
                :param bill.bid: 装修单号
        :type bill.bid: String
        
        Example::
        
            {
                "bill.bid": 1
            }

## 钱包

### 钱包

## api.payment.WalletAction

        |DataType:|
        #### wallet

    - **wid**: 钱包ID
      - 类型: *Long*
    - **buid**: 归属人ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *String*
    - **phone**: 电话
      - 类型: *String*
    - **identity**: 身份证
      - 类型: *String*
    - **balance**: 余额
      - 类型: *Long*
    - **type**: 类型 , 0: 公司 , 1: 厂商 , 2: 员工
      - 类型: *Short*
    - **status**: 状态 , 0: 初始 , 1: 正常 , 2: 冻结 , 3: 注销
      - 类型: *Short*
    
    - **amount**: 金额
      - 类型: *Long*
    - **validCode**: 验证码
      - 类型: *String*
    - **sn**: 流水号
      - 类型: *String*
    
    ### <I> pageWallet

        分页方式获取钱包信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 钱包信息列表 , 每条数据类型 *wallet*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "wid": 1,
                            "buid": 1,
                            "no": ""
                            "phone": "13858484851",
                            "identity": "",
                            "balance": 10000,
                            "type": 0,
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }
    
    ### <I> queryWallet

        查询钱包信息
        
                |Requests:|
                :param wallet.wid: 钱包ID
        :type wallet.wid: Long
        
        Example::
        
            {
                "wallet.wid": 1
            }
            
                |Returns:|
                - **wallet**: 钱包信息 , 数据类型 *wallet*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "wallet": {
                    "wid": 1,
                    "buid": 1,
                    "no": ""
                    "phone": "13858484851",
                    "identity": "",
                    "balance": 10000,
                    "type": 0,
                    "status": 0
                }
                ...
            }
    
    ### <I> applyWallet

        开户
        
                |Requests:|
                :param wallet.buid: 归属人ID
        :type wallet.buid: Long
        :param wallet.phone: 电话
        :type wallet.phone: String
        :param wallet.identity: 身份证
        :type wallet.identity: String
        
        Example::
        
            {
                "wallet.buid": 1,
                "wallet.phone": "13848584582",
                "wallet.identity": ""
            }
    
    ### <I> bindWallet

        绑定
        
        判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**
        
        判断钱包状态为0(初始) , 其他状态 , 错误信息 **150055 钱包状态不可操作**
        
        更新钱包状态为1(绑定)
        
                |Requests:|
                :param wallet.wid: 钱包ID
        :type wallet.wid: Long
        
        Example::
        
            {
                "wallet.wid": 1
            }
        
                |Returns:|
                - **wallet**: 钱包 , 数据类型 *wallet*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "wallet": {
                    "sn": 1,
                    "validCode": ""
                }
                ...
            }
    
    ### <I> updateWallet

        更新
        
        判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**
        
        判断钱包状态为1(绑定) , 其他状态 , 错误信息 **150055 钱包状态不可操作**
        
                |Requests:|
                :param wallet.wid: 钱包ID
        :type wallet.wid: Long
        :param wallet.phone: 电话
        :type wallet.phone: String
        
        Example::
        
            {
                "wallet.wid": 1,
                "wallet.phone": "13848548541"
            }

                |Returns:|
                - **wallet**: 钱包 , 数据类型 *wallet*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "wallet": {
                    "sn": "",
                    "validCode": "6854"
                }
                ...
            }
    
    ### <I> confirmWallet

        确认
        
        判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**
        
                |Requests:|
                :param wallet.wid: 钱包ID
        :type wallet.wid: Long
        :param wallet.sn: 流水号
        :type wallet.sn: String
        :param wallet.validCode: 验证码
        :type wallet.validCode: String
        
        Example::
        
            {
                "wallet.wid": 1,
                "wallet.sn": "",
                "wallet.validCode": "1585"
            }
    
    ### <I> freezeWallet

        冻结
        
        判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**
        
                |Requests:|
                :param wallet.wid: 钱包ID
        :type wallet.wid: Long
        
        Example::
        
            {
                "wallet.wid": 1
            }
    
    ### <I> unfreezeWallet

        解冻
        
        判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**
        
                |Requests:|
                :param wallet.wid: 钱包ID
        :type wallet.wid: Long
        
        Example::
        
            {
                "wallet.wid": 1
            }
    
    ### <I> consumeWallet

        消费
        
        判断操作钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**
        
        判断操作钱包状态为1(正常) , 其他状态 , 错误信息 **150055 钱包状态不可操作**
        
                |Requests:|
                :param wallet.wid: 钱包ID
        :type wallet.wid: Long
        :param wallet.amount: 金额
        :type wallet.amount: Long
        :param tallet.wid: 钱包ID
        :type tallet.wid: Long
        
        Example::
        
            {
                "wallet.wid": 1,
                "wallet.amount": 10000,
                "tallet.wid": 2
            }
        
                |Returns:|
                - **wallet**: 钱包 , 数据类型 *wallet*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "wallet": {
                    "sn": "",
                    "validCode": "6854"
                }
                ...
            }
    
    ### <I> rechargeWallet

        充值
        
        判断操作钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**
        
        判断操作钱包状态为1(正常) , 其他状态 , 错误信息 **150055 钱包状态不可操作**
        
                |Requests:|
                :param wallet.wid: 钱包ID
        :type wallet.wid: Long
        :param wallet.amount: 金额
        :type wallet.amount: Long
        
        Example::
        
            {
                "wallet.wid": 1,
                "wallet.amount": 10000
            }
        
                |Returns:|
                - **wallet**: 钱包 , 数据类型 *wallet*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "wallet": {
                    "sn": "",
                    "validCode": "6854"
                }
                ...
            }
    
    ### <I> withdrawWallet

        提现
        
        判断操作钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**
        
        判断操作钱包状态为1(正常) , 其他状态 , 错误信息 **150055 钱包状态不可操作**
        
                |Requests:|
                :param wallet.wid: 钱包ID
        :type wallet.wid: Long
        :param wallet.amount: 金额
        :type wallet.amount: Long
        
        Example::
        
            {
                "wallet.wid": 1,
                "wallet.amount": 10000
            }
        
                |Returns:|
                - **wallet**: 钱包 , 数据类型 *wallet*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "wallet": {
                    "sn": "",
                    "validCode": "6854"
                }
                ...
            }
    
    ### <I> consentWallet

        交易确认
        
        判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**
        
                |Requests:|
                :param wallet.wid: 钱包ID
        :type wallet.wid: Long
        :param wallet.sn: 流水号
        :type wallet.sn: String
        :param wallet.validCode: 验证码
        :type wallet.validCode: String
        
        Example::
        
            {
                "wallet.wid": 1,
                "wallet.sn": "",
                "wallet.validCode": "1585"
            }
    
    ### <I> transferWallet

        判断操作钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**
        
        判断操作钱包状态为1(正常) , 其他状态 , 错误信息 **150055 钱包状态不可操作**
        
                |Requests:|
                :param wallet.wid: 钱包ID
        :type wallet.wid: Long
        :param wallet.amount: 金额
        :type wallet.amount: Long
        :param tallet.wid: 钱包ID
        :type tallet.wid: Long
        
        Example::
        
            {
                "wallet.wid": 1,
                "wallet.amount": 10000,
                "tallet.wid": 2
            }
        
                |Returns:|
                - **wallet**: 钱包 , 数据类型 *wallet*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "wallet": {
                    "sn": "",
                    "validCode": "6854"
                }
                ...
            }
    
    ### <I> approveWallet

        转账确认
        
        判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**
        
                |Requests:|
                :param wallet.wid: 钱包ID
        :type wallet.wid: Long
        :param wallet.sn: 流水号
        :type wallet.sn: String
        :param wallet.validCode: 验证码
        :type wallet.validCode: String
        
        Example::
        
            {
                "wallet.wid": 1,
                "wallet.sn": "",
                "wallet.validCode": "1585"
            }

### 银行卡

## api.payment.WalletardAction

        |DataType:|
        #### walletard

    - **wcid**: 银行卡ID
      - 类型: *Long*
    - **wid**: 钱包ID
      - 类型: *Long*
    - **bankNo**: 卡号
      - 类型: *String*
    - **bankName**: 银行名
      - 类型: *String*
    - **validTime**: 有效期
      - 类型: *String*
    - **cvv**: 安全码
      - 类型: *String*
    - **type**: 类型 , 0: 借记 , 1: 贷记
      - 类型: *Short*
    - **status**: 状态 , 0: 初始 , 1: 有效 , 2: 失效 , 3: 签约失败 , 4: 已登记 , 5: 解绑
      - 类型: *Short*
    - **mobile**: 电话
      - 类型: *String*
    - **bindTime**: 绑定时间
      - 类型: *Timestamp*
    - **token**: 令牌
      - 类型: *String*
    
    - **validCode**: 验证码
      - 类型: *String*
    - **sn**: 流水号
      - 类型: *流水号*
    
    ### <I> queryWalletard

        获取银行卡信息
        
                |Requests:|
                :param walletard.wid: 钱包ID
        :type walletard.wid: Long
        
        Example::
        
            {
                "walletard.wid": 1
            }

                |Returns:|
                - **walletards**: 银行卡信息列表 , 每条数据类型 *walletard*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "walletards": [
                    {
                        "wcid": 1,
                        "wid": 1,
                        "bankNo": "",
                        "bankName": "银行名称",
                        "validTime": "20160101",
                        "cvv": "845",
                        "type": 0,
                        "status": 0,
                        "mobile": "13848589484",
                        "bindTime": "2016-01-01 00:00:00",
                        "token": ""
                    }
                ],
                ...
            }

    ### <I> bindWalletard

        绑定银行卡
        
        判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**
        
                |Requests:|
                :param walletard.wtid: 钱包ID
        :type walletard.wtid: Long
        :param walletard.wid: 钱包ID
        :type walletard.wid: Long
        :param walletard.bankNo: 银行卡号
        :type walletard.bankNo: String
        :param walletard.validTime: 有效期
        :type walletard.validTime: String
        :param walletard.cvv: 安全码
        :type walletard.cvv: String
        :param walletard.type: 类型
        :type walletard.type: Short
        :param walletard.mobile: 电话
        :type walletard.mobile: String
        
        Example::
        
            {
                "walletard.wtid": 1,
                "walletard.wid": 1,
                "walletard.bankNo": "",
                "walletard.validTime": "20160101",
                "walletard.cvv": "789",
                "walletard.type": 0,
                "walletard.mobile": 13840585484,
            }
        
                |Returns:|
                - **walletard**: 银行卡信息
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "walletard": {
                    "sn": 1,
                    "validCode": ""
                }
                ...
            }
    
    ### <I> confirmWalletard

        确认银行卡
        
        判断银行卡是否存在 , 不存在 , 错误信息 **150058 银行卡不存在**
        
        判断银行卡状态为0(初始)/5(解绑) , 其他状态 , 错误信息 **150059 银行卡状态不可操作**
        
                |Requests:|
                :param walletard.wtid: 钱包ID
        :type walletard.wtid: Long
        :param walletard.sn: 流水号
        :type walletard.sn: String
        :param walletard.validCode: 验证码
        :type walletard.validCode: String
        
        Example::
        
            {
                "walletard.wtid": 1,
                "walletard.sn": 1,
                "walletard.validCode": "6585"
            }
    
    ### <I> unbindWalletard

        解绑银行卡
    
        判断银行卡是否存在 , 不存在 , 错误信息 **150058 银行卡不存在**
        
        判断银行卡状态为1(有效) , 其他状态 , 错误信息 **150059 银行卡状态不可操作**
        
                |Requests:|
                :param walletard.wtid: 钱包ID
        :type walletard.wtid: Long
        
        Example::
        
            {
                "walletard.wtid": 1
            }
    
    ### <I> deleteWalletard

        删除银行卡
        
        判断银行卡是否存在 , 不存在 , 错误信息 **150058 银行卡不存在**
        
        判断银行卡状态为0(初始)/5(解绑) , 其他状态 , 错误信息 **150059 银行卡状态不可操作**
        
                |Requests:|
                :param walletard.wtid: 钱包ID
        :type walletard.wtid: Long
        
        Example::
        
            {
                "walletard.wtid": 1
            }

### 交易

## api.payment.WalletranAction

        |DataType:|
        #### walletran

    - **wtid**: 交易ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *String*
    - **wallet**: 操作钱包 , 类型 [wallet](./payment.html#api.payment.WalletAction.wallet)
      - 类型: *Object*
    - **tallet**: 关联钱包 , 类型 [wallet](./payment.html#api.payment.WalletAction.wallet)
      - 类型: *Object*
    - **amount**: 金额
      - 类型: *Long*
    - **type**: 类型 , 0: 充值 , 1: 提现 , 2: 消费 , 3: 转账 , 4: 退款
      - 类型: *Short*
    - **status**: 状态 , 0: 初始
      - 类型: *Short*
    - **comment**: 备注
      - 类型: *String*
    
    ### <I> pageWalletran

        分页方式获取交易信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 交易信息列表 , 每条数据类型 *walletran*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "wtid": 1,
                            "wid": 1,
                            "wallet": {
                                "wid": 1,
                                "buid": 1,
                                "no": ""
                                "phone": "13858484851",
                                "identity": "",
                                "balance": 10000,
                                "type": 0,
                                "status": 0
                            },
                            "tallet": {
                                "wid": 1,
                                "buid": 1,
                                "no": ""
                                "phone": "13858484851",
                                "identity": "",
                                "balance": 10000,
                                "type": 0,
                                "status": 0
                            },
                            "amount": 10000,
                            "type": 0,
                            "status": 0,
                            "comment": "备注"
                        }
                    ],
                    ...
                },
                ...
            }
    
    ### <I> queryWalletran

        获取交易信息
        
                |Requests:|
                :param walletran.wid: 钱包ID
        :type walletran.wid: Long
        
        Example::
        
            {
                "walletran.wid": 1
            }

                |Returns:|
                - **walletrans**: 交易信息列表 , 每条数据类型 *walletran*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "walletrans": [
                    {
                        "wtid": 1,
                        "wid": 1,
                        "wallet": {
                            "wid": 1,
                            "buid": 1,
                            "no": ""
                            "phone": "13858484851",
                            "identity": "",
                            "balance": 10000,
                            "type": 0,
                            "status": 0
                        },
                        "tallet": {
                            "wid": 1,
                            "buid": 1,
                            "no": ""
                            "phone": "13858484851",
                            "identity": "",
                            "balance": 10000,
                            "type": 0,
                            "status": 0
                        },
                        "amount": 10000,
                        "type": 0,
                        "status": 0,
                        "comment": "备注"
                    }
                ],
                ...
            }

### 资源

## api.payment.WalletresAction

        |DataType:|
        #### walletres

    - **wrid**: 资源ID
      - 类型: *Long*
    - **wid**: 钱包ID
      - 类型: *Long*
    - **picid**: 资源ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **type**: 类型
      - 类型: *String*
    - **path**: 路径
      - 类型: *String*
    - **commnet**: 备注
      - 类型: *String*
    
    
    +----------------+--------------------------------------------------------------    | Type           | 类型                                                         |               |
    +================+==============================================================+===============+
    | 00             | 公民身份证正面                                               |               |
    +----------------+--------------------------------------------------------------    | 19             | 营业执照                                                     |               |
    +----------------+--------------------------------------------------------------    | 20             | 税务登记证                                                   |               |
    +----------------+--------------------------------------------------------------    | 30             | 公民身份证反面                                               |               |
    +----------------+--------------------------------------------------------------    | 31             | 互联网业务商户协议                                           |               |
    +----------------+--------------------------------------------------------------    | 32             | 授权书                                                       |               |
    +----------------+--------------------------------------------------------------    | 33             | 手持身份证正扫面照                                           |               |
    +----------------+--------------------------------------------------------------    | 34             | 门头照                                                       |               |
    +----------------+--------------------------------------------------------------    | 35             | 结算银行卡正面照                                             |               |
    +----------------+--------------------------------------------------------------    | 36             | 结算银行卡反面照                                             |               |
    +----------------+--------------------------------------------------------------    | 37             | 开户许可证                                                   |               |
    +----------------+--------------------------------------------------------------    | 38             | 收单业务商户协议                                             |               |
    +----------------+--------------------------------------------------------------    | 50             | 经营场所图1                                                  |               |
    +----------------+--------------------------------------------------------------    | 51             | 经营场所                                                     |               |
    +----------------+--------------------------------------------------------------    ### <I> queryWalletres

        获取钱包归属资源
        
                |Requests:|
                :param walletres.wid: 钱包ID
        :type walletres.wid: Long
        
        Example::
        
            {
                "walletres.wid": 1
            }
        
                |Returns:|
                - **walletreses**: 资源信息列表 , 每条数据类型 *walletres*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "walletreses": [
                    {
                        "wrid": 1,
                        "wid": 1,
                        "picid": 1,
                        "name": "名称",
                        "path": "",
                        "type": "00",
                        "comment": "备注"
                    }
                ],
                ...
            }
    
    ### <I> uploadWalletres

        上传资源
        
        判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**
        
                |Requests:|
                :param walletres.wid: 钱包ID
        :type walletres.wid: Long
        :param walletres.name: 名称
        :type walletres.name: String
        :param walletres.path: 路径
        :type walletres.path: String
        :param walletres.type: 类型
        :type walletres.type: String
        :param walletres.comment: 备注
        :type walletres.comment: String
        
        Example::
        
            {
                "walletres.wid": 1,
                "walletres.name": "名称",
                "walletres.path": "",
                "walletres.type": "00",
                "walletres.comment": "备注"
            }
    
    ### <I> deleteWalletres

        删除资源
        
                |Requests:|
                :param walletres.wtid: 资源ID
        :type walletres.wtid: Long
        
        Example::
        
            {
                "walletres.wtid": 1
            }

## 功能

## api.sales.PaymentFunctionAction

        |DataType:|
        #### paymentFunction

    - **pfid**: 功能ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **key**: key
      - 类型: *String*
    - **value**: value
      - 类型: *String*
    - **group**: 分组 , 0: 公共 , 1: 预付 , 2: 装修 , 4: 主材 , 8: 销售 , 16: 服务
      - 类型: *Short*
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
    
    ### <I> queryPaymentFunction

        获取款项功能信息
    
                |Requests:|
                :param paymentFunction.type: 类型
        :type paymentFunction.type: Short
        
        Example::
        
            {
                "paymentFunction.type": 0
            }
            
                |Returns:|
                - **paymentFunctions**: 功能信息 , 类型 *paymentFunction*
          - 类型: *Object*
            
        Example::
        
            {
                ...
                "paymentFunctions": [
                    {
                        "pfid": 1,
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
