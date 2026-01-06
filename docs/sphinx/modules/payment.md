# payment 款项
## 合同

## api.payment.PaymentContractAction

**数据类型**:

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

    ### `pagePaymentContract` <span style="color:gray">[内部]</span>

        分页方式获取款项合同信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  款项合同信息列表 , 每条数据类型 *paymentContract*

        **示例**:{
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

    ### `pollingPaymentContract` <span style="color:blue">[自定义]</span>

        分页方式获取款项合同信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  款项合同信息列表 , 每条数据类型 *paymentContract*

        **示例**:{
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

    ### `queryPaymentContract` <span style="color:gray">[内部]</span>

        通过装修单号获取合同信息

**请求参数**:

- **paymentContract.rtid**:
  收据ID
        - **paymentContract.paymentType**:
  款项类型


        **示例**:{
                "paymentContract.rtid": 1,
                "paymentContract.paymentType": 1
            }

**返回参数**:

- **paymentContract**: 合同信息 , 类型 *paymentContract*
          - 类型: *List*

        **示例**:{
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

    ### `sendPaymentContractForAuth` <span style="color:gray">[内部]</span>

        发送认证通知

**请求参数**:

- **paymentContract.pcid**:
  装修单号


        **示例**:{
                "paymentContract.pcid": 1
            }

    ### `sendPaymentContract` <span style="color:gray">[内部]</span>

        发送合同通知

        通过不同类型的控制 , 统一的跳转页面来判断当前通知合同的状态是否符合操作

        判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**

**请求参数**:

- **paymentContract.pcid**:
  合同ID
        - **paymentContract.type**:
  类型 , 1: 签章, 2: 签订, 3: 查看 , 4: 下载

        **示例**:{
                "paymentContract.pcid": 1,
                "paymentContract.type": 1
            }

    ### `redirectPaymentContract` <span style="color:gray">[内部]</span>

        跳转合同操作 , 根据发送合同通知的类型 , 响应对应功能的页面地址

        类型包括1(签章)/2(签订)/3(查看)/4(下载)

        判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**

        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**请求参数**:

- **paymentContract.pcid**:
  合同ID

        **示例**:{
                "paymentContract.pcid": 1
            }

**返回参数**:

- **redirect**: 跳转地址
          - 类型: *String*

        **示例**:{
                ...
                "redirect": "http://redirect.com/redirect.html?type=view",
                ...
            }

    ### `viewPaymentContract` <span style="color:gray">[内部]</span>

        查看合同

        判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**

**请求参数**:

- **paymentContract.pcid**:
  合同ID

        **示例**:{
                "paymentContract.pcid": 1
            }

**返回参数**:

- **redirect**: 跳转地址
          - 类型: *String*

        **示例**:{
                ...
                "redirect": "http://redirect.com/redirect.html?type=view",
                ...
            }

    ### `signPaymentContractForCustomer` <span style="color:gray">[内部]</span>

        签订合同 , 针对客户信息

        判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**

        判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **150066 合同不可操作**

**请求参数**:

- **paymentContract.pcid**:
  合同ID
        - **customer.cid**:
  客户ID

        **示例**:{
                "paymentContract.pcid": 1,
                "customer.cid": 1
            }

**返回参数**:

- **redirect**: 跳转地址
          - 类型: *String*

        **示例**:{
                ...
                "redirect": "http://redirect.com/redirect.html?type=sign",
                ...
            }

    ### `signPaymentContractForCompany` <span style="color:gray">[内部]</span>

        签订合同 , 针对公司信息

        判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**

        判断签章是否存在 , 不存在 , 错误信息 **130045 签章不存在**

        判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **150066 合同不可操作**

**请求参数**:

- **paymentContract.pcid**:
  合同ID
        - **signet.sid**:
  签章ID

        **示例**:{
                "paymentContract.pcid": 1,
                "signet.sid": 1
            }

    ### `addPaymentContract` <span style="color:gray">[内部]</span>

        创建合同

        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**请求参数**:

- **paymentContract.orderId**:
  装修单号
        - **paymentContract.paymentType**:
  款项类型
        - **paymentContract.path**:
  文件路径

        **示例**:{
                "paymentContract.orderId": "1601010001",
                "paymentContract.paymentType": 1,
                "paymentContract.path": 1
            }

    ### `affixPaymentContract` <span style="color:gray">[内部]</span>

        签订合同

        判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**

        判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **150066 合同不可操作**

        更新装修合同为1(已签)

**请求参数**:

- **paymentContract.pcid**:
  合同ID

        **示例**:{
                "paymentContract.pcid": 1
            }

    ### `expirePaymentContract` <span style="color:gray">[内部]</span>

        失效合同

        判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**

        判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **150066 合同不可操作**

        更新装修合同为2(失效)

**请求参数**:

- **paymentContract.pcid**:
  合同ID

        **示例**:{
                "paymentContract.pcid": 1
            }


    ### `filingPaymentContract` <span style="color:gray">[内部]</span>

        归档合同

        判断合同是否存在 , 不存在 , 错误信息 **150065 合同不存在**

        判断合同状态是否为1(已签) , 其他状态不可操作 , 错误信息 **150066 合同不可操作**

**请求参数**:

- **paymentContract.pcid**:
  合同ID

        **示例**:{
                "paymentContract.pcid": 1
            }

## 收据

## api.payment.ReceiptAction

**数据类型**:

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

    ### `pageReceipt` <span style="color:gray">[内部]</span>

        分页方式获取收据信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ .

**返回参数**:


**示例**:

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

**数据类型**:

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

    ### `pageStatement` <span style="color:gray">[内部]</span>

        分页方式获取流水信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ .

**返回参数**:


**示例**:

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

**数据类型**:

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

    ### `pagePaymentActivity` <span style="color:gray">[内部]</span>

        分页方式获取款项活动 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  款项活动信息列表 , 每条数据类型 *paymentActivity*

        **示例**:{
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

    ### `amountPaymentActivity` <span style="color:gray">[内部]</span>

        获取款项活动总额

**请求参数**:

- **paymentActivity.orderId**:
  装修单号
        - **paymentActivity.type**:
  类型

        **示例**:{
                "paymentActivity.orderId": "1601010001",
                "paymentActivity.type": 0
            }

**返回参数**:

- **amount**: 款项活动总额
          - 类型: *Long*

        **示例**:{
                ...
                "amount": 1000000,
                ...
            }

    ### `updatePaymentActivity` <span style="color:gray">[内部]</span>

        更新款项活动

**请求参数**:

- **paymentActivity.activity.aid**:
  活动ID
        - **paymentActivity.comment**:
  说明

        **示例**:{
                "paymentActivity.activity.aid": 1,
                "paymentActivity.comment": "说明"
            }

    ### `deletePaymentActivity` <span style="color:gray">[内部]</span>

        更新款项活动

**请求参数**:

- **paymentActivity.paid**:
  活动ID

        **示例**:{
                "paymentActivity.paid": 1
            }

## 预付款

预付款款项信息管理以及相关业务功能

## api.payment.AdvancePaymentAction

**数据类型**:

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

    ### `pageAdvancePayment` <span style="color:gray">[内部]</span>

        分页方式获取预付款 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  预付款信息列表 , 每条数据类型 *advancePayment*

        **示例**:{
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

    ### `queryAdvancePaymentByOrderId` <span style="color:gray">[内部]</span>

        通过装修单号获取预付款金额

**请求参数**:

- **advancePayment.orderId**:
  装修单号

        **示例**:{
                "advancePayment.orderId": "1601010001"
            }

**返回参数**:

- **balanceAdvance**: 合同预付款
          - 类型: *Long*
        - **projectAdvance**: 工程预付款
          - 类型: *Long*
        - **materialAdvance**: 主材预付款
          - 类型: *Long*
        - **zaterialAdvance**: 正林预付款
          - 类型: *Long*

        **示例**:{
                "balanceAdvance": 0,
                "projectAdvance" 0,
                "materialAdvance" 0,
                "zaterialAdvance" 0
            }

    ### `addAdvancePayment` <span style="color:gray">[内部]</span>

        添加预付款

        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**请求参数**:

- **advancePayment.orderId**:
  装修单号

        **示例**:{
                "advancePayment.orderId": "1601010001"
            }

## api.payment.PaymentAction

**数据类型**:

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

    ### `pagePayment` <span style="color:gray">[内部]</span>

        分页方式获取已付款预付款信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_ .

        根据当前操作公司作为条件查询对应公司的预付款

**请求参数**:

- **payment.status**:
  状态
        - **payment.type**:
  类型
        - **payment.company**:
  公司

        **示例**:{
                "payment.status": 1,
                "payment.type": 0,
                "payment.company": "company"
            }

**返回参数**:


**示例**:

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

    ### `queryPaymentByOrderId` <span style="color:gray">[内部]</span>

        通过装修单号获取预付款信息

**请求参数**:

- **payment.orderId**:
  装修单号

        **示例**:{
                "payment.orderId": "1601010001"
            }

**返回参数**:

- **payments**: 预付款信息列表 , 每条数据类型 *payment*
          - 类型: *List*

        **示例**:{
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

**请求参数**:

- **payment.paymentId**:
  预付款ID

        **示例**:{
                "payment.paymentId": 1
            }

**返回参数**:

- **payment**: 预付款信息 , 数据类型 *payment*
          - 类型: *Object*

        **示例**:{
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

    ### `sendPayment` <span style="color:gray">[内部]</span>

        推送预付款

        验证预付款信息是否存在 , 不存在 , 错误信息 **150003 款项不存在**

**请求参数**:

- **payment.pid**:
  预付款ID

        **示例**:{
                "payment.pid": 1
            }

    ### `addPayment` <span style="color:gray">[内部]</span>

        创建预付款

        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

**请求参数**:

- **payment.orderId**:
  装修单号
        - **payment.recharge**:
  操作金额
        - **payment.paymentType**:
  类型

        **示例**:{
                "payment.orderId": "1601010001",
                "payment.recharge": 100,
                "payment.paymentType": 0
            }

    ### `collectPayment` <span style="color:gray">[内部]</span>

        预付款收款 , 同时生成预付款款项和收据信息

        判断客户信息是否存在 , 不存在 , 错误信息 **230001 客户信息不存在**

        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

        判断预付款类型 , 0(合同)/2(主材)之外的其他类型 , 错误信息 **150028 预付款类型错误**

        判断操作类型是否为1(收款) , 其他操作类型 , 错误信息 **150016 预付款操作不正确**

        判断预付款类型为2(主材) , 更新归属装修单

        如果预付款类型为2(主材) , 更新装修单中的销售比例 , 包括预付款(主材)/销售款

**请求参数**:

- **payment.orderId**:
  装修单号
        - **payment.customer.cid**:
  客户ID
        - **payment.recharge**:
  操作金额
        - **payment.realMoney**:
  实收金额
        - **payment.cash**:
  现金
        - **payment.cashInfo**:
  现金信息
        - **payment.bank**:
  刷卡
        - **payment.bankInfo**:
  刷卡信息
        - **payment.checkv**:
  转账
        - **payment.checkvBank**:
  转账银行
        - **payment.installment**:
  分期
        - **payment.installmentBank**:
  分期银行
        - **payment.accounts**:
  对公
        - **payment.accountsBank**:
  对公银行
        - **payment.comment**:
  说明

        **示例**:{
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

    ### `confirmPayment` <span style="color:gray">[内部]</span>

        预付款确认

**请求参数**:

- **pids[n]**:
  预付款ID列表 , 每条数据类型 Long

        **示例**:{
                "pids[0]": 1
            }

    ### `withdrawPayment` <span style="color:gray">[内部]</span>

        预付款提现

        判断客户信息是否存在 , 不存在 , 错误信息 **客户信息不存在**

        判断客户预付款信息是否存在 , 不存在 , 错误信息 **150010 预付款余额不足**

        判断预付款余额是否可供提现金额 , 余额不足 , 错误信息 **150010 预付款余额不足**

        如果预付款类型为2(主材) , 更新装修单中的销售比例 , 包括预付款(主材)/销售款

**请求参数**:

- **payment.orderId**:
  装修单号
        - **payment.customer.cid**:
  客户ID
        - **payment.cash**:
  现金
        - **payment.cashInfo**:
  现金说明
        - **payment.bank**:
  刷卡
        - **payment.bankInfo**:
  刷卡说明
        - **payment.paymentType**:
  款项类型
        - **payment.type**:
  类型
        - **payment.comment**:
  说明

        **示例**:{
                "payment.orderId": "1601010001",
                "payment.customer.cid": 1,
                "payment.cash": 100,
                "payment.cashInfo": 175,
                "payment.paymengType": "主材预付款",
                "payment.type": "提现",
                "payment.comment": "说明"
            }

    ### `payPayment` <span style="color:gray">[内部]</span>

        预付款付款，更新预付款余额，新增预付款支付明细

        判断客户信息是否存在 , 不存在 , 错误信息 **客户信息不存在**

        判断客户预付款信息是否存在 , 不存在 , 错误信息 **150010 预付款余额不足**

        判断预付款余额是否可供提现金额 , 余额不足 , 错误信息 **150010 预付款余额不足**

**请求参数**:

- **payment.orderId**:
  装修单号
        - **payment.paymentType**:
  款项类型
        - **payment.comment**:
  说明
        - **payment.transfer**:
  转款

        **示例**:{
                "payment.orderId": "1601010001",
                "payment.paymentType": "合同预付款",
                "payment.comment": "",
                "payment.transfer": 1000
            }

    ### `updatePayment` <span style="color:gray">[内部]</span>

        更新预付款收款方式信息

        判断预付款是否存在 , 不存在 , 错误信息 **150003 款项不存在**

        预付款状态1(已付款) , 其他状态不可更新 , 错误信息 **150036 款项状态不可操作**

        预付款修改之后金额与应收额不等 , 不可更新 , 错误信息 **150025 款项金额不正确**

**请求参数**:

- **payment.pid**:
  预付款ID
        - **payment.cash**:
  现金
        - **payment.cashInfo**:
  现金信息
        - **payment.bank**:
  刷卡
        - **payment.bankInfo**:
  刷卡信息
        - **payment.checkv**:
  转账
        - **payment.checkvBank**:
  转账银行
        - **payment.installment**:
  分期
        - **payment.installmentBank**:
  分期银行
        - **payment.accounts**:
  对公
        - **payment.accountsBank**:
  对公银行
        - **payment.comment**:
  说明

        **示例**:{
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

**数据类型**:

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

    ### `pageDecorationPayment` <span style="color:gray">[内部]</span>

        分页方式获取装修收款信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**请求参数**:

- **decorationPayment.paymentStatus**:
  状态
        - **decorationPayment.oneType**:
  类型
        - **decorationPayment.twoType**:
  类型

        **示例**:{
                "decorationPayment.paymentStatus": 1,
                "decorationPayment.oneType": 0,
                "decorationPayment.twoType": 0
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  装修收款信息列表 , 每条数据类型 *decorationPayment*

        **示例**:{
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

    ### `queryDecorationPaymentByOrderId` <span style="color:gray">[内部]</span>

        通过装修单号获取装修款项信息

**请求参数**:

- **decorationPayment.orderId**:
  装修单号

        **示例**:{
                "decorationPayment.orderId": "1601010001"
            }

**返回参数**:

- **decorationPayments**: 装修款项信息列表 , 每条数据类型 *decorationPayment*
          - 类型: *List*

        **示例**:{
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

    ### `queryDecorationPaymentForContractByOrderId` <span style="color:gray">[内部]</span>

        通过装修单号获取装修款项信息 , 款项一类为0(收款) , 二类1(合同)

**请求参数**:

- **decorationPayment.orderId**:
  装修单号

        **示例**:{
                "decorationPayment.orderId": "1601010001"
            }

**返回参数**:

- **decorationPayments**: 装修款项信息列表 , 每条数据类型 *decorationPayment*
          - 类型: *List*

        **示例**:{
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

    ### `queryDecorationPaymentForNotInitByDrId` <span style="color:gray">[内部]</span>

        通过装修收据ID获取状态为未付款的装修款项

**请求参数**:

- **decorationReceipt.drid**:
  收据ID

        **示例**:{
                "decorationReceipt.drid": 1
            }

**返回参数**:

- **decorationPayments**: 装修款项信息列表 , 每条数据类型 *decorationPayment*
          - 类型: *List*

        **示例**:{
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

**请求参数**:

- **decorationPayment.dpid**:
  装修款ID

        **示例**:{
                "decorationPayment.dpid": 1
            }

**返回参数**:

- **decorationPayment**: 装修款信息 , 类型 *decorationPayment*
          - 类型: *Object*

        **示例**:{
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

    ### `queryDecoraionReceiptByDrId` <span style="color:gray">[内部]</span>

        通过收据ID获取装修收据信息

**请求参数**:

- **decorationReceipt.drid**:
  收据ID

        **示例**:{
                "decorationReceipt.drid": 1
            }

**返回参数**:

- **decorationReceipt**: 装修收据信息 , 类型 *decorationReceipt*
          - 类型: *Object*

        **示例**:{
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

    ### `sendDecorationPayment` <span style="color:gray">[内部]</span>

        推送装修款

        判断装修款信息是否存在 , 不存在 , 错误信息 **150003 款项不存在**

**请求参数**:

- **decorationPayment.dpid**:
  装修款ID

        **示例**:{
                "decorationPayment.dpid": 1
            }

    ### `checkDecorationPayment` <span style="color:gray">[内部]</span>

        判断装修款是否可以进行收款

        判断当前款项状态是否为0(初始) , 错误信息 **150008 款项不能进行收款**

**请求参数**:

- **decorationPayment.dpid**:
  款项ID

        **示例**:{
                "decorationPayment.dpid": 1
            }

    ### `addDecorationPayment` <span style="color:gray">[内部]</span>

        添加装修收款信息

        判断装修单是否存在 , 不存在添加失败 , 错误信息 **140013 订单不存在**

        判断装修款类型 , 增项款/减项款/合同退款/违约金 , 其他类型 , 错误信息 **150034 款项类型不可用**

**请求参数**:

- **decorationPayment.orderId**:
  装修单号
        - **decorationPayment.ptid**:
  款项类型ID
        - **decorationPayment.referMoney**:
  生成金额

        **示例**:{
                "decorationPayment.orderId": "1601010001",
                "decorationPayment.ptid": 1,
                "decorationPayment.referMoney": 600000
            }

    ### `changeDecorationPaymentForTime` <span style="color:gray">[内部]</span>

        修改装修款项收款和确认时间

**请求参数**:

- **decorationPayment.orderId**:
  装修单号
        - **decorationPayment.paymentType**:
  款项类型
        - **dateTime**: 修改时间
          - 类型: *Timestamp*

        **示例**:{
                "decorationPayment.orderId": "1601010001",
                "decorationPayment.paymentType": "首付款",
                "dateTime": "2016-01-01 00:00:00"
            }

    ### `collectDecorationPayment` <span style="color:gray">[内部]</span>

        装修款项收款

        判断装修单信息是否存在 , 不存在 , 错误信息 **150003 款项不存在**

        判断装修款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**

        根据操作款项中排序判断前置款项是否已经收款或确认 , 如果未收款或确认 , 错误信息 **150009 前置款项未处理**

        判断提交款项方式汇总金额与装修款应付金额是否相等 , 不相等 , 错误信息 **150008 款项不能进行收款**

        收款方式包括预付款 , 判断操作金额是否满足预付款余额 , 余额不足 , 错误信息 **150010 预付款余额不足**

        装修款公司信息根据收款人操作公司进行更新

        更新归属装修单的付款比例

**请求参数**:

- **decorationPayment.dpid**:
  款项ID
        - **decorationPayment.realMoney**:
  实收金额
        - **decorationPayment.cash**:
  现金
        - **decorationPayment.cashInfo**:
  现金信息
        - **decorationPayment.bank**:
  刷卡
        - **decorationPayment.bankInfo**:
  刷卡信息
        - **decorationPayment.checkv**:
  转账
        - **decorationPayment.checkvBank**:
  转账银行
        - **decorationPayment.installment**:
  分期
        - **decorationPayment.installmentBank**:
  分期银行
        - **decorationPayment.accounts**:
  对公
        - **decorationPayment.accountsBank**:
  对公银行
        - **decorationPayment.coupon**:
  券值
        - **decorationPayment.couponInfo**:
  券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
        - **decorationPayment.advance**:
  预付款
        - **decorationPayment.advanceType**:
  预付款类型 , 1: 合同预付款 , 2: 工程预付款
        - **decorationPayment.comment**:
  说明

        **示例**:{
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

    ### `refundDecorationPayment` <span style="color:gray">[内部]</span>

        装修款项中退款类型款项收款

        判断装修单信息是否存在 , 不存在 , 错误信息 **150003 款项不存在**

        判断装修款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**

        判断提交款项方式汇总金额与装修款应付金额是否相等 , 不相等 , 错误信息 **150013 款项实收金额不等于应收金额**

        装修款公司信息根据收款人操作公司进行更新

**请求参数**:

- **decorationPayment.dpid**:
  款项ID
        - **decorationPayment.realMoney**:
  实收金额
        - **decorationPayment.cash**:
  现金
        - **decorationPayment.cashInfo**:
  现金信息
        - **decorationPayment.bank**:
  刷卡
        - **decorationPayment.bankInfo**:
  刷卡信息
        - **decorationPayment.checkv**:
  转账
        - **decorationPayment.checkvBank**:
  转账银行
        - **decorationPayment.installment**:
  分期
        - **decorationPayment.installmentBank**:
  分期银行
        - **decorationPayment.accounts**:
  对公
        - **decorationPayment.accountsBank**:
  对公银行
        - **decorationPayment.coupon**:
  券值
        - **decorationPayment.couponInfo**:
  券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
        - **decorationPayment.advance**:
  预付款
        - **decorationPayment.advanceType**:
  预付款类型 , 1: 合同预付款 , 2: 工程预付款
        - **decorationPayment.comment**:
  说明

        **示例**:{
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

    ### `confirmDecorationPayment` <span style="color:gray">[内部]</span>

        装修款项确认 , 更新款项状态为已确认

**请求参数**:

- **dpids[n]**:
  款项ID列表 , 每条数据类型 Long

        **示例**:{
                "dpids[0]": 1
            }

    ### `updateDecorationPayment` <span style="color:gray">[内部]</span>

        更新装修款收款方式信息

        判断款项是否存在 , 不存在 , 错误信息 **150003 款项不存在**

        款项状态1(已付款) , 其他状态不可更新 , 错误信息 **150036 款项状态不可操作**

        款项修改之后金额与应收额不等 , 不可更新 , 错误信息 **150025 款项金额不正确**

        装修款收款方式更新 , 只能够针对现金/刷卡进行更新 , 优惠/预付不可更新

**请求参数**:

- **decorationPayment.dpid**:
  款项ID
        - **decorationPayment.cash**:
  现金
        - **decorationPayment.cashInfo**:
  现金信息
        - **decorationPayment.bank**:
  刷卡
        - **decorationPayment.bankInfo**:
  刷卡信息
        - **decorationPayment.checkv**:
  转账
        - **decorationPayment.checkvBank**:
  转账银行
        - **decorationPayment.installment**:
  分期
        - **decorationPayment.installmentBank**:
  分期银行
        - **decorationPayment.accounts**:
  对公
        - **decorationPayment.accountsBank**:
  对公银行
        - **decorationPayment.comment**:
  说明

        **示例**:{
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

    ### `deleteDecorationPayment` <span style="color:gray">[内部]</span>

        删除装修款

        判断款项是否存在 , 不存在 , 错误信息 **150003 款项不存在**

        款项状态非0(未付款) , 其他状态不可更新 , 错误信息 **150036 款项状态不可操作**

**请求参数**:

- **decorationPayment.dpid**:
  款项ID

        **示例**:{
                "decorationPayment.dpid": 1
            }

## 主材款

主材款款项信息管理以及相关业务功能

## api.payment.MaterialPaymentAction

**数据类型**:

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

    ### `pageMaterialPayment` <span style="color:gray">[内部]</span>

        分页方式获取主材收款信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**请求参数**:

- **materialPayment.paymentStatus**:
  状态
        - **materialPayment.paymentType**:
  类型

        **示例**:{
                "materialPayment.paymentStatus": 1,
                "materialPayment.paymentType": 0
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  主材收款信息列表 , 每条数据类型 *materialPayment*

        **示例**:{
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

    ### `queryMaterialPaymentByOrderId` <span style="color:gray">[内部]</span>

        通过装修单号获取装修单下所有主材装修单的款项信息

**请求参数**:

- **materialPayment.orderId**:
  装修单号

        **示例**:{
                "materialPayment.orderId": "1601010001"
            }

**返回参数**:

- **materialPayments**: 主材收款信息列表 , 每条数据类型 *materialPayment*
          - 类型: *List*

        **示例**:{
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

    ### `queryMaterialPaymentByMid` <span style="color:gray">[内部]</span>

        通过主材单ID获取主材收款信息

**请求参数**:

- **materialPayment.material.mid**:
  主材单ID

        **示例**:{
                "materialPayment.material.mid": 1
            }

**返回参数**:

- **materialPayments**: 主材收款信息列表 , 每条数据类型 *materialPayment*
          - 类型: *List*

        **示例**:{
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

    ### `queryMaterialPaymentForNotInitByMrId` <span style="color:gray">[内部]</span>

        通过收据ID获取主材款项信息 , 状态为非初始

**请求参数**:

- **materialReceipt.mrid**:
  收据ID

        **示例**:{
                "materialReceipt.mrid": 1
            }

**返回参数**:

- **materialPayments**: 主材收款信息列表 , 每条数据类型 *materialPayment*
          - 类型: *List*

        **示例**:{
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

    ### `queryMaterialReceiptByMrId` <span style="color:gray">[内部]</span>

        通过收据ID获取主材收据信息

**请求参数**:

- **materialReceipt.mrid**:
  收据ID

        **示例**:{
                "materialReceipt.mrid": 1
            }

**返回参数**:

- **materialReceipt**: 主材收据信息 , 类型 *materialReceipt*
          - 类型: *Object*

        **示例**:{
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

    ### `checkMaterialPayment` <span style="color:gray">[内部]</span>

        判断主材款项是否可以进行收款

        判断主材款项状态是否为0(初始) , 其他状态 , 错误信息 **150008 款项不能进行收款**

**请求参数**:

- **materialPayment.mpid**:
  款项ID

        **示例**:{
                "materialPayment.mpid": 1
            }

    ### `addMaterialPaymentForDeposit` <span style="color:gray">[内部]</span>

        生成定金主材款

        主材单是否存在 , 不存在 , 错误信息 **180001 主材订单不存在**

        应收款金额大于零 , 小于零 , 错误信息 **150025 款项金额不正确**

        不可存在主材单对应的其他款项 , 如果存在 , 错误信息 **150029 款项不可提交**

        判断提交主材款类型是否已经存在 , 已存在 , 错误信息 **150029 款项不可提交**

        主材单更新定金额为提交项金额 , 定金状态为1(未付款)

**请求参数**:

- **materialPayment.material.mid**:
  主材单ID
        - **materialPayment.referMoney**:
  应收金额

        **示例**:{
                "materialPayment.material.mid": 1,
                "materialPayment.paymentType": 1,
                "materialPayment.referMoney": 1000
            }

    ### `addMaterialPaymentForFullpay` <span style="color:gray">[内部]</span>

        生成补款主材款

        获取主材款类型为3(补款)的款项 , 如果存在 , 错误信息 **150040 补款已存在**

        定金主材款存在 , 判断款项状态是否为1(已收款)或2(已确认) , 状态为0(初始) , 错误信息 **150041 定金状态不可操作**

        判断主材项总额与定金+补款总额是否一致 , 不一致 , 错误信息 **150017 项目总额与款项额不符**

        生成款项金额为正数 , 款项类型为3(补款) , 生成金额为负数 , 款项类型为5(补款退款)

        主材单更新补款额为提交款项金额 , 补款状态为1(未付款)

        生成补款退款类型款项信息 , 其作用等同于补款

**请求参数**:

- **materialPayment.material.mid**:
  主材单ID
        - **materialPayment.referMoney**:
  金额

        **示例**:{
                "materialPayment.material.mid": 1,
                "materialPayment.referMoney": 1000
            }

    ### `cancelMaterialPaymentForDeposit` <span style="color:gray">[内部]</span>

        撤销定金主材款

        获取主材款类型为3(补款)的款项 , 如果存在 , 错误信息 **150040 补款已存在**

        获取主材款类型为2(定金)的款项 , 如果不存在 , 错误信息 **150037 定金不存在**

        判断定金主材款状态是否为0(初始) , 其他状态 , 错误信息 **150036 款项状态不可操作**

        删除定金主材款信息

        更新主材单中定金额为0 , 定金状态为0(初始)

**请求参数**:

- **materialPayment.material.mid**:
  主材单ID

        **示例**:{
                "materialPayment.material.mid": 1,
                "materialPayment.paymentType": 1
            }

    ### `cancelMaterialPaymentForFullpay` <span style="color:gray">[内部]</span>

        撤销补款主材款

        获取主材款类型为3(补款)/5(补款退款)的款项 , 如果不存在 , 错误信息 **150038 补款不存在**

        判断补款/补款退款主材款状态是否为0(初始) , 其他状态 , 错误信息 **150036 款项状态不可操作**

        删除补款主材款信息

        更新主材单中补款额为0, 补款状态为0(初始)

**请求参数**:

- **materialPayment.material.mid**:
  主材单ID

        **示例**:{
                "materialPayment.material.mid": 1,
                "materialPayment.paymentType": 1
            }

    ### `collectMaterialPayment` <span style="color:gray">[内部]</span>

        主材款项收款

        判断主材款是否存在 , 不存在 , 错误信息 **150003 款项不存在**

        判断主材款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**

        判断提交款项方式汇总金额与装修款应付金额是否相等 , 不相等 , 错误信息 **150008 款项不能进行收款**

        收款方式包括预付款 , 判断操作金额是否满足预付款余额 , 余额不足 , 错误信息 **150010 预付款余额不足**

        主材款公司信息根据收款人操作公司进行更新

        更新主材单对应收款类型的状态信息 , 定金/补款状态为1(已付款)

        款项类型为补款(3) , 更新销售单中补款时间

**请求参数**:

- **materialPayment.mpid**:
  款项ID
        - **materialPayment.realMoney**:
  实收金额
        - **materialPayment.cash**:
  现金
        - **materialPayment.cashInfo**:
  现金信息
        - **materialPayment.bank**:
  刷卡
        - **materialPayment.bankInfo**:
  刷卡信息
        - **materialPayment.checkv**:
  转账
        - **materialPayment.checkvBank**:
  转账银行
        - **materialPayment.installment**:
  分期
        - **materialPayment.installmentBank**:
  分期银行
        - **materialPayment.accounts**:
  对公
        - **materialPayment.accountsBank**:
  对公银行
        - **materialPayment.coupon**:
  券值
        - **materialPayment.couponInfo**:
  券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
        - **materialPayment.advance**:
  预付款
        - **materialPayment.advanceType**:
  预付款类型 , 1: 合同预付款 , 2: 工程预付款
        - **materialPayment.comment**:
  说明

        **示例**:{
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

    ### `collectMaterialPayments` <span style="color:gray">[内部]</span>

        主材款项批量收款

        判断主材款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**

        判断主材款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**

        判断提交款项方式汇总金额与装修款应付金额是否相等 , 不相等 , 错误信息 **150008 款项不能进行收款**

        收款方式包括预付款 , 判断操作金额是否满足预付款余额 , 余额不足 , 错误信息 **150010 预付款余额不足**

        主材款公司信息根据收款人操作公司进行更新

        更新主材单对应收款类型的状态信息 , 定金/补款状态为2(已付款)

        款项类型为补款(3) , 更新销售单中补款时间

**请求参数**:

- **material.orderId**:
  装修单号
        - **materialPayments[n].mpid**:
  款项ID列表 , 每条数据类型 Long
        - **materialReceipt.realMoney**:
  实收金额
        - **materialReceipt.cash**:
  现金
        - **materialReceipt.cashInfo**:
  现金信息
        - **materialReceipt.bank**:
  刷卡
        - **materialReceipt.bankInfo**:
  刷卡信息
        - **materialReceipt.checkv**:
  转账
        - **materialReceipt.checkvBank**:
  转账银行
        - **materialReceipt.installment**:
  分期
        - **materialReceipt.installmentBank**:
  分期银行
        - **materialReceipt.accounts**:
  对公
        - **materialReceipt.accountsBank**:
  对公银行
        - **materialReceipt.coupon**:
  券值
        - **materialReceipt.couponInfo**:
  券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
        - **materialReceipt.advance**:
  预付款
        - **materialReceipt.advanceType**:
  预付款类型 , 1: 合同预付款 , 2: 工程预付款
        - **materialReceipt.comment**:
  说明

        **示例**:{
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

    ### `refundMaterialPayment` <span style="color:gray">[内部]</span>

        主材退款

        判断主材款是否存在 , 不存在 , 错误信息 **150003 款项不存在**

        判断主材款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**

        如果主材款类型为7(定金退款) , 更新主材单中定金额为0 , 定金状态为0(初始)

        如果主材款类型为5(补款退款) , 更新主材单中补款状态为2(已付款) , 补款时间为操作时间

        如果主材款类型为4(退款) , 更新退款主材项状态为2(已付款)

        主材款公司信息根据收款人操作公司进行更新

        更新款项状态以及生成对应收据相关信息

**请求参数**:

- **materialPayment.mpid**:
  款项ID
        - **materialPayment.cash**:
  现金
        - **materialPayment.cashInfo**:
  现金信息
        - **materialPayment.bank**:
  刷卡
        - **materialPayment.bankInfo**:
  刷卡信息
        - **materialPayment.checkv**:
  转账
        - **materialPayment.checkvBank**:
  转账银行
        - **materialPayment.installment**:
  分期
        - **materialPayment.installmentBank**:
  分期银行
        - **materialPayment.accounts**:
  对公
        - **materialPayment.accountsBank**:
  对公银行
        - **materialPayment.coupon**:
  券值
        - **materialPayment.couponInfo**:
  券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
        - **materialPayment.advance**:
  预付款
        - **materialPayment.advanceType**:
  预付款类型 , 1: 合同预付款 , 2: 工程预付款
        - **materialPayment.comment**:
  说明

        **示例**:{
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

    ### `refundMaterialPaymentForDeposit` <span style="color:gray">[内部]</span>

        生成主材款中定金退款

        获取主材款类型为3(补款)的款项 , 如果存在 , 错误信息 **150040 补款已存在**

        获取主材款类型为2(定金)的款项 , 如果不存在 , 错误信息 **150037 定金不存在**

        判断定金主材款状态是否为2(已确认) , 其他状态 , 错误信息 **150012 款项不能进行退款**

        主材单更新定金额为0 , 定金状态为0(初始)

        主材单状态更新为8(废单)

**请求参数**:

- **materialPayment.material.mid**:
  主材单ID

        **示例**:{
                "materialPayment.material.mid": 1
            }

    ### `refundMaterialPaymentForCoupon` <span style="color:gray">[内部]</span>

        生成主材款项中券退款

        获取主材款类型为2(定金)的款项 , 如果不存在 , 错误信息 **150037 定金不存在**

        判断定金主材款状态是否为1(已收款)或2(已确认) , 状态为0(初始) , 错误信息 **150041 定金状态不可操作**

        生成券退款类型款项信息 , 同时更新主材单中券值和券信息

**请求参数**:

- **material.mid**:
  主材单ID
        - **material.coupon**:
  券值
        - **material.couponInfo**:
  券信息

        **示例**:{
                "material.mid": 1,
                "material.coupon": 100000,
                "material.couponInfo": #瓷砖券:100#
            }

    ### `updateMaterialPayment` <span style="color:gray">[内部]</span>

        更新主材款收款方式

        判断款项是否存在 , 不存在 , 错误信息 **150003 款项不存在**

        主材款状态1(已付款) , 其他状态不可更新 , 错误信息 **150036 款项状态不可操作**

        主材款修改之后金额与应收额不等 , 不可更新 , 错误信息 **150025 款项金额不正确**

        预付款和优惠券不可修改

**请求参数**:

- **materialPayment.mpid**:
  款项ID
        - **materialPayment.cash**:
  现金
        - **materialPayment.cashInfo**:
  现金信息
        - **materialPayment.bank**:
  刷卡
        - **materialPayment.bankInfo**:
  刷卡信息
        - **materialPayment.checkv**:
  转账
        - **materialPayment.checkvBank**:
  转账银行
        - **materialPayment.installment**:
  分期
        - **materialPayment.installmentBank**:
  分期银行
        - **materialPayment.accounts**:
  对公
        - **materialPayment.accountsBank**:
  对公银行
        - **materialPayment.comment**:
  说明

        **示例**:{
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

    ### `confirmMaterialPayment` <span style="color:gray">[内部]</span>

        主材款项确认

        判断款项是否存在 , 不存在 , 错误信息 **150003 款项不存在**

        主材款类型为2(定金) , 更新主材单定金状态为3(已确认)

        主材款类型为3(补款)/5(补款退款) , 更新主材单补款状态为3(已确认)

        已经确认的主材款项忽略处理

**请求参数**:

- **mpids[n]**:
  款项ID列表 , 每条数据类型 Long

        **示例**:{
                "mpids[0]": 1
            }

    ### `changeMaterialPaymentForTime` <span style="color:gray">[内部]</span>

        修改主材款项收款和确认时间

        判断主材款是否存在 , 不存在 , 错误信息 **150003 款项不存在**

**请求参数**:

- **materialPayment.no**:
  主材单编号
        - **materialPayment.paymentType**:
  款项类型
        - **dateTime**: 修改时间
          - 类型: *Timestamp*

        **示例**:{
                "materialPayment.no": "M1601010001",
                "materialPayment.paymentType": 1,
                "dateTime": "2016-01-01 00:00:00"
            }

## 服务款

服务款项信息管理以及相关业务功能

服务款主要针对类型为半价的装修单完成主材服务费款项相关操作

## api.payment.ServicePaymentAction

**数据类型**:

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

    ### `pageServicePayment` <span style="color:gray">[内部]</span>

        页方式获服务款收款信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        根据当前操作公司作为条件查询对应公司的服务款

**请求参数**:

- **servicePayment.status**:
  状态

        **示例**:{
                "servicePayment.status": 1
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  销售收款信息列表 , 每条数据类型 *servicePayment*

        **示例**:{
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

    ### `queryServicePaymentByOrderId` <span style="color:gray">[内部]</span>

        通过装修单号获取服务款项

**请求参数**:

- **servicePayment.decoration.orderId**:
  装修单号

        **示例**:{
                "servicePayment.decoration.orderId": 1
            }

**返回参数**:

- **servicePayments**: 服务款信息列表 , 每条数据类型 *servicePayment*
          - 类型: *List*

        **示例**:{
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

    ### `queryServicePaymentForNotInitBySrId` <span style="color:gray">[内部]</span>

        通过服务款收据ID获取非初始状态的服务款项

**请求参数**:

- **serviceReceipt.srid**:
  收据ID

        **示例**:{
                "serviceReceipt.srid": 1
            }

**返回参数**:

- **servicePayments**: 服务款信息列表 , 每条数据类型 *servicePayment*
          - 类型: *List*

        **示例**:{
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

    ### `queryServiceReceiptBySrId` <span style="color:gray">[内部]</span>

**请求参数**:

- **serviceReceipt.srid**:
  收据ID

        **示例**:{
                "serviceReceipt.srid": 1
            }

**返回参数**:

- **servicePayment**: 服务款信息 ,数据类型 *servicePayment*
          - 类型: *Object*

        **示例**:{
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

    ### `makeServicePayment` <span style="color:gray">[内部]</span>

        生成服务款

        判断装修单是否存在 , 不存在 , 错误信息 **140013 订单不存在**

        判断装修单对应的半价信息是否存在 , 不存在 , 错误信息 **260021 半价信息不存在**

        判断服务款剩余金额 , 如果大于交款金额 , 错误信息 **150025 款项金额不正确**

**请求参数**:

- **servicePayment.decoration.orderId**:
  装修单号
        - **servicePayment.referMoney**:
  收款金额

        **示例**:{
                "servicePayment.decoration.orderId": "1601010001",
                "servicePayment.referMoney": 10000
            }

    ### `collectServicePayment` <span style="color:gray">[内部]</span>

        服务款项收款 , 正常收款 , 需要拆分金额为预付款和服务款两个部分

        判断装修单对应的半价信息是否存在 , 不存在 , 错误信息 **260021 半价信息不存在**

        服务费收款款项拆分两部分 , 一是预付款 , 二是服务费 .

        拆分计算方式为 , 收款金额 / 1.1 = 主材预付款金额 , 收款金额 - 主材预付款金额 = 服务费

        拆分之后的服务费需要与装修单半价信息中服务费和实收服务费 , 如果拆分后服务费大于服务费与实收服务费差值 , 那么多余部分交款服务费转入主材预付款 .

        生成服务款款项以及收据信息 , 服务款状态为1(已付款) , 补全相关收据信息

        生成预付款款项以及收据信息 , 预付款状态为1(已付款) , 补全相关收据信息 , 收据使用转款字段存储

        更新装修单半价中的服务费以及主材额

        服务款公司信息根据收款人操作公司进行更新

**请求参数**:

- **servicePayment.decoration.orderId**:
  装修单号
        - **servicePayment.referMoney**:
  收款金额
        - **servicePayment.realMoney**:
  实收金额
        - **servicePayment.cash**:
  现金
        - **servicePayment.cashInfo**:
  现金信息
        - **servicePayment.bank**:
  刷卡
        - **servicePayment.bankInfo**:
  刷卡信息
        - **servicePayment.checkv**:
  转账
        - **servicePayment.checkvBank**:
  转账银行
        - **servicePayment.installment**:
  分期
        - **servicePayment.installmentBank**:
  分期银行
        - **servicePayment.accounts**:
  对公
        - **servicePayment.accountsBank**:
  对公银行
        - **servicePayment.comment**:
  说明

        **示例**:{
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

    ### `collectServicePaymentForService` <span style="color:gray">[内部]</span>

        服务款项收款 , 主要针对服务费收款

        判断装修单对应的半价信息是否存在 , 不存在 , 错误信息 **260021 半价信息不存在**

        收款金额作为服务费金额 , 不转入预付款 , 收款金额可以小于等于当前服务费剩余金额

        生成服务款款项以及收据信息

        更新装修单半价中的服务费信息

        服务款公司信息根据收款人操作公司进行更新

**请求参数**:

- **servicePayment.decoration.orderId**:
  装修单号
        - **servicePayment.realMoney**:
  实收金额
        - **servicePayment.cash**:
  现金
        - **servicePayment.cashInfo**:
  现金信息
        - **servicePayment.bank**:
  刷卡
        - **servicePayment.bankInfo**:
  刷卡信息
        - **servicePayment.checkv**:
  转账
        - **servicePayment.checkvBank**:
  转账银行
        - **servicePayment.installment**:
  分期
        - **servicePayment.installmentBank**:
  分期银行
        - **servicePayment.accounts**:
  对公
        - **servicePayment.accountsBank**:
  对公银行
        - **servicePayment.comment**:
  说明

        **示例**:{
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

    ### `refundServicePaymentForService` <span style="color:gray">[内部]</span>

        服务费退款 , 根据装修单半价信息中实收服务费金额进行退款

        判断装修单对应的半价信息是否存在 , 不存在 , 错误信息 **260021 半价信息不存在**

        生成服务款款项以及收据信息

        更新装修单半价中的服务费信息

        服务款公司信息根据收款人操作公司进行更新

**请求参数**:

- **servicePayment.decoration.orderId**:
  装修单号
        - **servicePayment.cash**:
  现金
        - **servicePayment.cashInfo**:
  现金信息
        - **servicePayment.bank**:
  刷卡
        - **servicePayment.bankInfo**:
  刷卡信息
        - **servicePayment.checkv**:
  转账
        - **servicePayment.checkvBank**:
  转账银行
        - **servicePayment.installment**:
  分期
        - **servicePayment.installmentBank**:
  分期银行
        - **servicePayment.accounts**:
  对公
        - **servicePayment.accountsBank**:
  对公银行
        - **servicePayment.comment**:
  说明

        **示例**:{
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

    ### `confirmServicePayment` <span style="color:gray">[内部]</span>

        服务款项确认

        已经确认的服务款项忽略处理

        更新款项状态为2(已确认)

        关联更新预付款状态为2(已确认)

**请求参数**:

- **spids[n]**:
  款项ID列表  ,  每条数据类型  Long

        **示例**:{
                "spids[0]": 1
            }

    ### `updateServicePayment` <span style="color:gray">[内部]</span>

        更新服务款收款方式

        判断款项是否存在 , 不存在 , 错误信息 **150003 款项不存在**

        款项状态1(已付款) , 其他状态不可更新 , 错误信息 **150036 款项状态不可操作**

        款项修改之后金额与应收额不等 , 不可更新 , 错误信息 **150025 款项金额不正确**

**请求参数**:

- **servicePayment.spid**:
  款项ID
        - **servicePayment.cash**:
  现金
        - **servicePayment.cashInfo**:
  现金信息
        - **servicePayment.bank**:
  刷卡
        - **servicePayment.bankInfo**:
  刷卡信息
        - **servicePayment.checkv**:
  转账
        - **servicePayment.checkvBank**:
  转账银行
        - **servicePayment.comment**:
  说明

        **示例**:{
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

**数据类型**:

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

    ### `pageSalesPayment` <span style="color:gray">[内部]</span>

        分页方式获取销售收款信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**请求参数**:

- **salesPayment.status**:
  状态
        - **salesPayment.type**:
  类型

        **示例**:{
                "salesPayment.status": 1,
                "salesPayment.type": 1
            }

**请求参数**:

- **companyType**: 公司类型 , 包括 company , dompany , pompany
          - 类型: *String*

        **示例**:{
                "companyType": "company"
            }

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  销售收款信息列表 , 每条数据类型 *salesPayment*

        **示例**:{
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

    ### `querySalesPaymentByOrderId` <span style="color:gray">[内部]</span>

        通过装修单号获取销售单所属的销售款信息

**请求参数**:

- **sales.orderId**:
  装修单号

        **示例**:{
                "sales.orderId": "1601010001"
            }

**返回参数**:

- **salesPayments**: 销售收款信息列表 , 每条数据类型 *salesPayment*
          - 类型: *List*

        **示例**:{
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

    ### `querySalesPaymentBySid` <span style="color:gray">[内部]</span>

        通过销售单ID，查询销售单对应的款项信息

**请求参数**:

- **salesPayment.sales.sid**:
  销售单ID

        **示例**:{
                "salesPayment.sales.sid": 1
            }

**返回参数**:

Parameters: salesPayments (List) – 销售款信息列表 , 每条数据类型 salesPayment

        **示例**:{
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

    ### `querySalesPaymentForNotInitBySrid` <span style="color:gray">[内部]</span>

        通过收据ID获取销售款信息 , 状态为非初始

**请求参数**:

- **salesReceipt.srid**:
  收据ID

        **示例**:{
                "salesReceipt.srid": 1
            }

**返回参数**:

- **salesPayments**: 销售收款信息列表 , 每条数据类型 *salesPayment*
          - 类型: *List*

        **示例**:{
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

**请求参数**:

- **salesPayment.spid**:
  销售款ID

        **示例**:{
                "salesPayment.srid": 1
            }

**返回参数**:

- **salesPayment**: 销售收款信息 , 类型 *salesPayment*
          - 类型: *Object*

        **示例**:{
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

    ### `querySalesReceiptBySrId` <span style="color:gray">[内部]</span>

        通过收据ID获取销售收据信息

**请求参数**:

- **salesReceipt.srid**:
  收据ID

        **示例**:{
                "salesReceipt.srid": 1
            }

**返回参数**:

- **salesReceipt**: 销售收据信息 , 类型 *salesReceipt*
          - 类型: *Object*

        **示例**:{
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

    ### `amountSalesPayment` <span style="color:gray">[内部]</span>

        获取装修单归属的销售款总额

**请求参数**:

- **salesPayment.sales.orderId**:
  装修单号
        - **salesPayment.sales.sid**:
  销售单ID

        **示例**:{
                "salesPayment.sales.orderId": "1601010001",
                "salesPayment.sales.sid": 1
            }

**返回参数**:

- **amount**: 销售款总额
          - 类型: *Long*

        **示例**:{
                ...
                "amount": 1000000,
                ...
            }

    ### `sendSalesPayment` <span style="color:gray">[内部]</span>

        推送销售款

        验证销售款信息是否存在 , 不存在 , 错误信息 **150003 款项不存在**

**请求参数**:

- **salesPayment.spid**:
  销售款ID

        **示例**:{
                "salesPayment.spid": 1
            }

    ### `addSalesPaymentForDeposit` <span style="color:gray">[内部]</span>

        添加定金销售款 , 支持不退类型

        判断销售单是否存在 , 不存在 , 错误信息 **260021 销售单不存在**

        应收款金额大于零 , 小于零 , 错误信息 **150025 款项金额不正确**

        不可存在销售单对应的其他款项 , 如果存在 , 错误信息 **150029 款项不可提交**

        判断提交销售款类型是否已经存在 , 已存在 , 错误信息 **150029 款项不可提交**

        销售单更新定金额为提交项金额 , 定金状态为0(未付款)

**请求参数**:

- **salesPayment.sales.sid**:
  销售单ID
        - **salesPayment.sales.ctype**:
  结算类型
        - **salesPayment.sales.cvalue**:
  结算值

        - **salesPayment.type**:
  类型 , 支持1(定金)和8(不退定金)
        - **salesPayment.referMoney**:
  应收金额

        **示例**:{
                "salesPayment.sales.sid": 1,
                "salesPayment.sales.ctype": 1,
                "salesPayment.sales.cvalue": 1000,
                "salesPayment.type": 1,
                "salesPayment.referMoney": 1000
            }

    ### `addSalesPaymentForFullpay` <span style="color:gray">[内部]</span>

        添加补款销售款

        获取销售款类型为3(补款)的款项 , 如果存在 , 错误信息 **150040 补款已存在**

        定金销售款存在 , 判断款项状态是否为1(已收款)或2(已确认) , 状态为0(初始) , 错误信息 **150041 定金状态不可操作**

        判断销售项数量是否为0 , 如果不存在项目 , 错误信息 **260060 销售项数量不足**

        判断销售项总额与定金+补款总额是否一致 , 不一致 , 错误信息 **150017 项目总额与款项额不符**

        生成款项金额为正数 , 款项类型为3(补款) , 生成金额为负数 , 款项类型为5(补款退款)

        款项类型为5(补款退款) , 判断销售单款项积分以及领取活动物品积分 , 款项积分不足 , 错误信息 **160037 积分不足**

        销售单更新补款额为提交款项金额 , 补款状态为0(未付款)

        生成补款退款类型款项信息 , 其作用等同于补款

**请求参数**:

- **salesPayment.sid**:
  销售单ID
        - **salesPayment.referMoney**:
  应收金额

        **示例**:{
                "salesPayment.sid": 1,
                "salesPayment.referMoney": 1000
            }

    ### `cancelSalesPayment` <span style="color:gray">[内部]</span>

        销售款撤销

        款项状态为初始才能够完成撤销 , 其他状态撤销失败 , 错误信息 **150019 款项不能撤销**

        根据款项类型更新销售单中款项状态 , 定金(2)更新定金金额为0 , 状态为无款项(-1) ; 补款(3)/补款退款(5)更新补款金额为0 , 状态为无款项(-1)

**请求参数**:

- **salesPayment.spid**:
  款项ID

        **示例**:{
                "salesPayment.spid": 1
            }

    ### `cancelSalesPaymentForDeposit` <span style="color:gray">[内部]</span>

        撤销定金销售款

        获取销售款类型为3(补款)的款项 , 如果存在 , 错误信息 **150040 补款已存在**

        获取销售款类型为2(定金)的款项 , 如果不存在 , 错误信息 **150037 定金不存在**

        判断定金销售款状态是否为0(初始) , 其他状态 , 错误信息 **150036 款项状态不可操作**

        删除定金销售款信息

        更新销售单中定金额为0 , 定金状态为-1(初始)

**请求参数**:

- **salesPayment.sid**:
  销售单ID

        **示例**:{
                "salesPayment.sid": 1
            }

    ### `cancelSalesPaymentForFullpay` <span style="color:gray">[内部]</span>

        撤销补款销售款

        获取销售款类型为3(补款)的款项 , 如果不存在 , 错误信息 **150038 补款不存在**

        判断补款销售款状态是否为0(初始) , 其他状态 , 错误信息 **150036 款项状态不可操作**

        删除补款销售款信息

        更新销售单中补款额为0, 补款状态为-1(初始)

**请求参数**:

- **salesPayment.sid**:
  销售单ID

        **示例**:{
                "salesPayment.sid": 1
            }

    ### `collectSalesPayment` <span style="color:gray">[内部]</span>

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

**请求参数**:

- **salesPayment.spid**:
  款项ID
        - **salesPayment.realMoney**:
  实收金额
        - **salesPayment.cash**:
  现金
        - **salesPayment.cashInfo**:
  现金信息
        - **salesPayment.bank**:
  刷卡
        - **salesPayment.bankInfo**:
  刷卡信息
        - **salesPayment.checkv**:
  转账
        - **salesPayment.checkvBank**:
  转账银行
        - **salesPayment.installment**:
  分期
        - **salesPayment.installmentBank**:
  分期银行
        - **salesPayment.accounts**:
  对公
        - **salesPayment.accountsBank**:
  对公银行
        - **salesPayment.coupon**:
  券值
        - **salesPayment.couponInfo**:
  券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
        - **salesPayment.advance**:
  预付款
        - **salesPayment.advanceType**:
  预付款类型 , 1: 合同预付款 , 2: 工程预付款
        - **salesPayment.comment**:
  说明

        **示例**:{
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

    ### `collectSalesPayments` <span style="color:gray">[内部]</span>

        销售款批量收款

        判断销售款是否存在 , 不存在 , 错误信息 **150003 款项不存在**

        判断销售款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**

        判断应收金额与各类型收款方式金额之和是否相等 , 不相等收款失败 , **150025 款项金额不正确**

        收款方式包括预付款 , 判断操作金额是否满足预付款余额 , 余额不足 , 错误信息 **150010 预付款余额不足**

        销售款公司信息根据收款人操作公司进行更新

        更新销售单对应收款类型的状态信息 , 定金/补款状态为1(已付款)

        款项类型为补款(3) , 更新销售单中补款时间

        更新归属装修单中的销售比例 , 包括预付款(主材)/销售款

**请求参数**:

- **sales.sid**:
  销售单ID
        - **salesPayment[n].spid**:
  款项ID列表 , 每条数据类型 Long
        - **salesReceipt.realMoney**:
  实收金额
        - **salesReceipt.cash**:
  现金
        - **salesReceipt.cashInfo**:
  现金信息
        - **salesReceipt.bank**:
  刷卡
        - **salesReceipt.bankInfo**:
  刷卡信息
        - **salesReceipt.checkv**:
  转账
        - **salesReceipt.checkvBank**:
  转账银行
        - **salesReceipt.installment**:
  分期
        - **salesReceipt.installmentBank**:
  分期银行
        - **salesReceipt.accounts**:
  对公
        - **salesReceipt.accountsBank**:
  对公银行
        - **salesReceipt.coupon**:
  券值
        - **salesReceipt.couponInfo**:
  券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
        - **salesReceipt.advance**:
  预付款
        - **salesReceipt.advanceType**:
  预付款类型 , 1: 合同预付款 , 2: 工程预付款
        - **salesReceipt.comment**:
  说明

        **示例**:{
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

    ### `refundSalesPayment` <span style="color:gray">[内部]</span>

        销售退款

        判断销售款是否存在 , 不存在 , 错误信息 **150003 款项不存在**

        判断销售款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**

        如果销售款类型为7(定金退款) , 更新主材单中定金额为0 , 定金状态为0(初始)

        如果主材款类型为5(补款退款) , 更新主材单中补款状态为1(已付款) , 补款时间为操作时间

        如果主材款类型为4(退款) , 更新退货单状态为1(已付款)

        销售款公司信息根据收款人操作公司进行更新

        更新款项状态以及生成对应收据相关信息

**请求参数**:

- **salesPayment.spid**:
  款项ID
        - **salesPayment.cash**:
  现金
        - **salesPayment.cashInfo**:
  现金信息
        - **salesPayment.bank**:
  刷卡
        - **salesPayment.bankInfo**:
  刷卡信息
        - **salesPayment.checkv**:
  转账
        - **salesPayment.checkvBank**:
  转账银行
        - **salesPayment.installment**:
  分期
        - **salesPayment.installmentBank**:
  分期银行
        - **salesPayment.accounts**:
  对公
        - **salesPayment.accountsBank**:
  对公银行
        - **salesPayment.coupon**:
  券值
        - **salesPayment.couponInfo**:
  券信息 , **#** 分隔多条刷卡信息, **:** 分隔信息中不同字段 , 由 **券类别:金额** 组成, 例如: **#通用券:1000#**
        - **salesPayment.advance**:
  预付款
        - **salesPayment.comment**:
  说明

        **示例**:{
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

    ### `refundSalesPaymentForDeposit` <span style="color:gray">[内部]</span>

        生成销售款中定金退款

        获取销售款类型为3(补款)的款项 , 如果存在 , 错误信息 **150040 补款已存在**

        获取销售款类型为2(定金)的款项 , 如果不存在 , 错误信息 **150037 定金不存在**

        判断定金销售款状态是否为2(已确认) , 其他状态 , 错误信息 **150012 款项不能进行退款**

        判断销售单款项积分以及领取活动物品积分 , 款项积分不足 , 错误信息 **160037 积分不足**

        销售单更新定金额为0 , 定金状态为-1(初始)

        主材单状态更新为4(废单)

**请求参数**:

- **salesPayment.sales.sid**:
  销售单ID

        **示例**:{
                "salesPayment.sales.sid": 1
            }

    ### `refundSalesPaymentForCoupon` <span style="color:gray">[内部]</span>

        生成销售款中券退款

        获取销售款类型为2(定金)的款项 , 如果不存在 , 错误信息 **150037 定金不存在**

        判断定金销售款状态是否为1(已收款)或2(已确认) , 状态为0(初始) , 错误信息 **150041 定金状态不可操作**

        判断销售单款项积分以及领取活动物品积分 , 款项积分不足 , 错误信息 **160037 积分不足**

        生成券退款类型款项信息 , 同时更新销售单中券值和券信息

**请求参数**:

- **sales.sid**:
  销售单ID
        - **sales.coupon**:
  券值
        - **sales.couponInfo**:
  券信息

        **示例**:{
                "sales.sid": 1,
                "sales.coupon": 100000,
                "sales.couponInfo": #瓷砖券:100#
            }

    ### `updateSalesPayment` <span style="color:gray">[内部]</span>

        更新销售款收款方式

        判断款项是否存在 , 不存在 , 错误信息 **150003 款项不存在**

        款项状态1(已付款) , 其他状态不可更新 , 错误信息 **150036 款项状态不可操作**

        款项修改之后金额与应收额不等 , 不可更新 , 错误信息 **150025 款项金额不正确**

        预付款和优惠券不可修改

**请求参数**:

- **salesPayment.spid**:
  款项ID
        - **salesPayment.cash**:
  现金
        - **salesPayment.cashInfo**:
  现金信息
        - **salesPayment.bank**:
  刷卡
        - **salesPayment.bankInfo**:
  刷卡信息
        - **salesPayment.checkv**:
  转账
        - **salesPayment.checkvBank**:
  转账银行
        - **salesPayment.comment**:
  说明

        **示例**:{
                "salesPayment.spid": 1,
                "salesPayment.cash": 10000,
                "salesPayment.cashInfo": "175",
                "salesPayment.bank": 10000,
                "salesPayment.bankInfo": "#187|10|2016-03-23 14:25:15#",
                "salesPayment.checkv": 10000,
                "salesPayment.checkvBank": "#187|10|2016-03-23 14:25:15#",
                "salesPayment.comment": "说明",
            }

    ### `confirmSalesPayment` <span style="color:gray">[内部]</span>

        销售款确认

        判断款项是否存在 , 不存在 , 错误信息 **150003 款项不存在**

        销售款类型为2(定金) , 更新销售单定金状态为2(已确认)

        销售款类型为3(补款)/5(补款退款) , 更新销售单单补款状态为2(已确认)

        已经确认的销售款忽略处理

**请求参数**:

- **spids[n]**:
  款项ID列表 , 每条数据类型 Long

        **示例**:{
                "spids[0]": 1
            }

## 活动款

## api.payment.ActivityPaymentAction

**数据类型**:

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

    ### `pageActivityPayment` <span style="color:gray">[内部]</span>

        分页方式获取活动款信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  活动款信息列表 , 每条数据类型 *activityPayment*

        **示例**:{
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

    ### `queryActivityPaymentByArid` <span style="color:gray">[内部]</span>

        通过活动收据ID获取活动款信息

**请求参数**:

- **activityPayment.arid**:
  活动收据ID

        **示例**:{
                "activityPayment.arid": 1
            }

**返回参数**:

- **activityPayments**: 活动款信息列表 , 每条数据类型 *activityPayment*
          - 类型: *List*

        **示例**:{
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

**请求参数**:

- **activityPayment.mno**:
  活动票号

        **示例**:{
                "activityPayment.mno": "000000000000000000"
            }

**返回参数**:

- **activityPayments**: 活动款信息列表 , 每条数据类型 *activityPayment*
          - 类型: *List*

        **示例**:{
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

    ### `queryActivityReceiptByArid` <span style="color:gray">[内部]</span>

        通过活动收据ID获取活动收据信息

**请求参数**:

- **activityReceipt.arid**:
  活动收据ID

        **示例**:{
                "activityReceipt.arid": 1
            }

**返回参数**:

- **activityReceipt**: 活动收据
          - 类型: *Object*

        **示例**:{
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

    ### `countActivityPayment` <span style="color:gray">[内部]</span>

        根据活动款主材类型 , 汇总统计不同品牌金额总数

**返回参数**:

- **counts**: 统计信息信息 , 类型 List <List <String>>
          - 类型: *Object*

        **示例**:{
                ...
                "counts":[
                    ["品牌1", "2000"],
                    ["品牌2", "2000"]
                ],
                ...
            }

    ### `createActivityPayment` <span style="color:gray">[内部]</span>

        创建活动款信息

**请求参数**:

- **activityPayment.mno**:
  活动票号
        - **activityPayment.type**:
  类型
        - **activityPayment.category**:
  品类
        - **activityPayment.brand**:
  品牌
        - **activityPayment.money**:
  金额
        - **activityPayment.comment**:
  备注

        **示例**:{
                "activityPayment.mno": "000000000000000000",
                "activityPayment.type": 1,
                "activityPayment.category": "品类",
                "activityPayment.brand": "品牌1",
                "activityPayment.money": 100000,
                "activityPayment.comment": "说明"
            }

    ### `collectActivityPayment` <span style="color:gray">[内部]</span>

        活动款收款 , 同时支持批量收款

        判断活动票是否存在 , 不存在 , 错误信息 **160044 活动票不存在**

        判断活动票是否已经注册 , 未注册 , 错误信息 **160045 活动票未注册**

        判断活动款总额是否与收款总额相同

        批量收款时 , 判断多个款项对应人会员号是否唯一

        创建收款数据 , 更新款项状态

**请求参数**:

- **activityPayment[n].apid**:
  活动款ID

        - **activityReceipt.orderId**:
  装修单号
        - **activityReceipt.cash**:
  现金
        - **activityReceipt.bank**:
  刷卡
        - **activityReceipt.bankInfo**:
  刷卡信息
        - **activityReceipt.comment**:
  说明

        **示例**:{
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

**数据类型**:

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

    ### `pageProxyPayment` <span style="color:gray">[内部]</span>

        分页方式获取代付款信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  代付款信息列表 , 每条数据类型 *proxyPayment*

        **示例**:{
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

    ### `queryProxyPayment` <span style="color:gray">[内部]</span>

        通过代付款ID获取信息

**请求参数**:

- **proxyPayment.ppid**:
  代付款ID

        **示例**:{
                "proxyPayment.ppid": 1
            }

**返回参数**:

- **proxyPayment**: 代付款 , 类型 *proxyPayment*
          - 类型: *Object*

        **示例**:{
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

    ### `queryProxyPaymentForUnionId` <span style="color:gray">[内部]</span>

        通过代付款ID获取信息

**请求参数**:

- **proxyPayment.unionId**:
  代付款ID

        **示例**:{
                "proxyPayment.unionId": 1
            }

**返回参数**:

- **proxyPayments**: 代付款 , 类型 *proxyPayment*
          - 类型: *Object*

        **示例**:{
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

    ### `addProxyPayment` <span style="color:gray">[内部]</span>

        添加代付款信息

**请求参数**:

- **proxyPayment.title**:
  标题
        - **proxyPayment.name**:
  名称
        - **proxyPayment.phone**:
  电话
        - **proxyPayment.address**:
  地址
        - **proxyPayment.referMoney**:
  生成金额
        - **proxyPayment.creater.userId**:
  创建人编号

        **示例**:{
                "proxyPayment.title": "",
                "proxyPayment.name": "",
                "proxyPayment.phone": "",
                "proxyPayment.address": "",
                "proxyPayment.referMoney": 600000,
                "proxyPayment.creater.userId": "FL-02381"
            }

    ### `collectProxyPayment` <span style="color:gray">[内部]</span>

        代付款收款

        判断代付款是否存在 , 不存在 , 错误信息 **150003 款项不存在**

        判断款收款状态是否为0(初始) , 其它状态不可收款 , 错误信息 **150036 款项状态不可操作**

**请求参数**:

- **proxyPayment.ppid**:
  款项ID
        - **proxyPayment.realMoney**:
  实收金额
        - **proxyPayment.cash**:
  现金
        - **proxyPayment.cashInfo**:
  现金信息
        - **proxyPayment.bank**:
  刷卡
        - **proxyPayment.bankInfo**:
  刷卡信息
        - **proxyPayment.checkv**:
  转账
        - **proxyPayment.checkvBank**:
  转账银行
        - **proxyPayment.comment**:
  说明

        **示例**:{
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

    ### `refundProxyPayment` <span style="color:gray">[内部]</span>

    ### `confirmProxyPayment` <span style="color:gray">[内部]</span>

        代付款确认 , 更新款项状态为已确认

**请求参数**:

- **ppids[n]**:
  款项ID列表 , 每条数据类型 Long

        **示例**:{
                "ppids[0]": 1
            }

    ### `cancelProxyPayment` <span style="color:gray">[内部]</span>

## 转换款

## api.payment.PaytranAction

**数据类型**:

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

    ### `pagePaytran` <span style="color:gray">[内部]</span>

        分页方式获取转换款信息 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter)

**返回参数**:

- **paging**: 分页信息
          - 类型: *object*
        - **paging.data**:
  转换款信息列表 , 每条数据类型 *paytran*

        **示例**:{
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

    ### `queryPaytran` <span style="color:gray">[内部]</span>

        根据款项ID以及类型获取转换款信息

**请求参数**:

- **paytran.pid**:
  款项ID
        - **paytran.rid**:
  收据ID
        - **paytran.type**:
  类型
        - **paytran.atttype**:
  业务类型

        **示例**:{
                "paytran.pid": 1,
                "paytran.rid": 1,
                "paytran.type": 1,
                "paytran.atttype": 0
            }

**返回参数**:

- **paytrans**: 转换款信息列表 , 类型 *paytran*
          - 类型: *List*

        **示例**:{
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

**请求参数**:

- **paytran.ptid**:
  转换款ID

        **示例**:{
                "paytran.pid": 1,
                "paytran.rid": 1,
                "paytran.type": 1
            }

**返回参数**:

- **paytran**: 转换款信息 , 类型 *paytran*
          - 类型: *Object*

        **示例**:{
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

    ### `sendPaytran` <span style="color:gray">[内部]</span>

        推送转换款

        验证转款款信息是否存在 , 不存在 , 错误信息 **150003 款项不存在**

**请求参数**:

- **paytran.pid**:
  转换款ID

        **示例**:{
                "paytran.pid": 1
            }

    ### `addPaytran` <span style="color:gray">[内部]</span>

        添加转换款信息 , 发起收款

        金额精度处理 , 支持两位小数 , 分

        判断金额处理之后 , 不能为0 , 错误信息 **150025 款项金额不正确**

        判断当前pid对应是否存在状态处于(0)初始的转换款信息 , 如果存在 , 错误信息 **150048 转换款支付未完成**

        调用第三方支付工具 , 完成发起转换款信息过程 , 更新第三方支付信息

**请求参数**:

- **paytran.pid**:
  款项ID
        - **paytran.type**:
  类型
        - **paytran.no**:
  收据编号
        - **paytran.sn**:
  机器编号
        - **paytran.money**:
  收据编号
        - **paytran.way**:
  交易方式

        **示例**:{
                "paytran.pid": 1,
                "paytran.type": 1,
                "paytran.no": "157",
                "paytran.sn": "420408479404809043870826390",
                "paytran.money": 1,
                "paytran.way": "wxpay"
            }

**返回参数**:

- **paytran**: 转换款 , 类型 *paytran*
          - 类型: *Object*

        **示例**:{
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

    ### `checkPaytran` <span style="color:gray">[内部]</span>

        验证转换款信息 , 收款成功或者失败 , 更新状态

        判断转换款信息是否存在 , 不存在 , 错误信息 **150043 转换款不存在**

        判断转换款信息状态是否为0(初始) , 其他状态 , 错误信息 **150047 转换款支付不可操作**

        调用第三方支付工具 , 完成转换款信息验证过程 , 同时更新转换款状态以及结果信息

**请求参数**:

- **paytran.ptid**:
  转换款ID

        **示例**:{
                "paytran.pid": 1,
            }

**返回参数**:

- **paytran**: 转换款 , 类型 *paytran*
          - 类型: *Object*

        **示例**:{
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

    ### `cancelPaytran` <span style="color:gray">[内部]</span>

        撤销转换款

        判断转换款信息是否存在 , 不存在 , 错误信息 **150043 转换款不存在**

        判断转换款信息状态不为1(成功) , 成功状态 , 错误信息 **150047 转换款支付不可操作**

**请求参数**:

- **paytran.ptid**:
  转换款ID

        **示例**:{
                "paytran.pid": 1,
            }

    ### `deletePaytran` <span style="color:gray">[内部]</span>

        删除转换款

        判断转换款信息是否存在 , 不存在 , 错误信息 **150043 转换款不存在**

        判断转换款信息状态不为0(初始) , 成功状态 , 错误信息 **150047 转换款支付不可操作**

**请求参数**:

- **paytran.ptid**:
  转换款ID

        **示例**:{
                "paytran.pid": 1,
            }

## 收款单

## api.payment.BillAction

**数据类型**:

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

    ### `pageBill` <span style="color:gray">[内部]</span>

        分页方式获取收款单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  钱包信息列表 , 每条数据类型 *wallet*

        **示例**:{
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

    ### `queryBill` <span style="color:gray">[内部]</span>

        获取收款单信息

**请求参数**:

- **bill.bid**:
  收款单ID

        **示例**:{
                "bill.bid": 1
            }

**返回参数**:

- **bill**: 收款单信息 , 数据类型 *bill*
          - 类型: *Object*

        **示例**:{
                "bid": 1,
                "orderId": "1601010001",
                "money": 1000000,
                "status": 1
            }

    ### `makeBill` <span style="color:gray">[内部]</span>

        创建收款单

**请求参数**:

- **bill.orderId**:
  装修单号
        - **bill.money**:
  收款额

        - **billItems[n].pid**:
  款项ID
        - **billItems[n].type**:
  款项类型

        **示例**:{
                "bill.orderId": "1601010001",
                "bill.money": 100000,

                "billItems[0].pid": 1,
                "billItems[0].type": 1
            }

    ### `cancelBill` <span style="color:gray">[内部]</span>

        取消收款单

**请求参数**:

- **bill.bid**:
  装修单号

        **示例**:{
                "bill.bid": 1
            }

## 钱包

### 钱包

## api.payment.WalletAction

**数据类型**:

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

    ### `pageWallet` <span style="color:gray">[内部]</span>

        分页方式获取钱包信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  钱包信息列表 , 每条数据类型 *wallet*

        **示例**:{
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

    ### `queryWallet` <span style="color:gray">[内部]</span>

        查询钱包信息

**请求参数**:

- **wallet.wid**:
  钱包ID

        **示例**:{
                "wallet.wid": 1
            }

**返回参数**:

- **wallet**: 钱包信息 , 数据类型 *wallet*
          - 类型: *Object*

        **示例**:{
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

    ### `applyWallet` <span style="color:gray">[内部]</span>

        开户

**请求参数**:

- **wallet.buid**:
  归属人ID
        - **wallet.phone**:
  电话
        - **wallet.identity**:
  身份证

        **示例**:{
                "wallet.buid": 1,
                "wallet.phone": "13848584582",
                "wallet.identity": ""
            }

    ### `bindWallet` <span style="color:gray">[内部]</span>

        绑定

        判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

        判断钱包状态为0(初始) , 其他状态 , 错误信息 **150055 钱包状态不可操作**

        更新钱包状态为1(绑定)

**请求参数**:

- **wallet.wid**:
  钱包ID

        **示例**:{
                "wallet.wid": 1
            }

**返回参数**:

- **wallet**: 钱包 , 数据类型 *wallet*
          - 类型: *Object*

        **示例**:{
                ...
                "wallet": {
                    "sn": 1,
                    "validCode": ""
                }
                ...
            }

    ### `updateWallet` <span style="color:gray">[内部]</span>

        更新

        判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

        判断钱包状态为1(绑定) , 其他状态 , 错误信息 **150055 钱包状态不可操作**

**请求参数**:

- **wallet.wid**:
  钱包ID
        - **wallet.phone**:
  电话

        **示例**:{
                "wallet.wid": 1,
                "wallet.phone": "13848548541"
            }

**返回参数**:

- **wallet**: 钱包 , 数据类型 *wallet*
          - 类型: *Object*

        **示例**:{
                ...
                "wallet": {
                    "sn": "",
                    "validCode": "6854"
                }
                ...
            }

    ### `confirmWallet` <span style="color:gray">[内部]</span>

        确认

        判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

**请求参数**:

- **wallet.wid**:
  钱包ID
        - **wallet.sn**:
  流水号
        - **wallet.validCode**:
  验证码

        **示例**:{
                "wallet.wid": 1,
                "wallet.sn": "",
                "wallet.validCode": "1585"
            }

    ### `freezeWallet` <span style="color:gray">[内部]</span>

        冻结

        判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

**请求参数**:

- **wallet.wid**:
  钱包ID

        **示例**:{
                "wallet.wid": 1
            }

    ### `unfreezeWallet` <span style="color:gray">[内部]</span>

        解冻

        判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

**请求参数**:

- **wallet.wid**:
  钱包ID

        **示例**:{
                "wallet.wid": 1
            }

    ### `consumeWallet` <span style="color:gray">[内部]</span>

        消费

        判断操作钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

        判断操作钱包状态为1(正常) , 其他状态 , 错误信息 **150055 钱包状态不可操作**

**请求参数**:

- **wallet.wid**:
  钱包ID
        - **wallet.amount**:
  金额
        - **tallet.wid**:
  钱包ID

        **示例**:{
                "wallet.wid": 1,
                "wallet.amount": 10000,
                "tallet.wid": 2
            }

**返回参数**:

- **wallet**: 钱包 , 数据类型 *wallet*
          - 类型: *Object*

        **示例**:{
                ...
                "wallet": {
                    "sn": "",
                    "validCode": "6854"
                }
                ...
            }

    ### `rechargeWallet` <span style="color:gray">[内部]</span>

        充值

        判断操作钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

        判断操作钱包状态为1(正常) , 其他状态 , 错误信息 **150055 钱包状态不可操作**

**请求参数**:

- **wallet.wid**:
  钱包ID
        - **wallet.amount**:
  金额

        **示例**:{
                "wallet.wid": 1,
                "wallet.amount": 10000
            }

**返回参数**:

- **wallet**: 钱包 , 数据类型 *wallet*
          - 类型: *Object*

        **示例**:{
                ...
                "wallet": {
                    "sn": "",
                    "validCode": "6854"
                }
                ...
            }

    ### `withdrawWallet` <span style="color:gray">[内部]</span>

        提现

        判断操作钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

        判断操作钱包状态为1(正常) , 其他状态 , 错误信息 **150055 钱包状态不可操作**

**请求参数**:

- **wallet.wid**:
  钱包ID
        - **wallet.amount**:
  金额

        **示例**:{
                "wallet.wid": 1,
                "wallet.amount": 10000
            }

**返回参数**:

- **wallet**: 钱包 , 数据类型 *wallet*
          - 类型: *Object*

        **示例**:{
                ...
                "wallet": {
                    "sn": "",
                    "validCode": "6854"
                }
                ...
            }

    ### `consentWallet` <span style="color:gray">[内部]</span>

        交易确认

        判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

**请求参数**:

- **wallet.wid**:
  钱包ID
        - **wallet.sn**:
  流水号
        - **wallet.validCode**:
  验证码

        **示例**:{
                "wallet.wid": 1,
                "wallet.sn": "",
                "wallet.validCode": "1585"
            }

    ### `transferWallet` <span style="color:gray">[内部]</span>

        判断操作钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

        判断操作钱包状态为1(正常) , 其他状态 , 错误信息 **150055 钱包状态不可操作**

**请求参数**:

- **wallet.wid**:
  钱包ID
        - **wallet.amount**:
  金额
        - **tallet.wid**:
  钱包ID

        **示例**:{
                "wallet.wid": 1,
                "wallet.amount": 10000,
                "tallet.wid": 2
            }

**返回参数**:

- **wallet**: 钱包 , 数据类型 *wallet*
          - 类型: *Object*

        **示例**:{
                ...
                "wallet": {
                    "sn": "",
                    "validCode": "6854"
                }
                ...
            }

    ### `approveWallet` <span style="color:gray">[内部]</span>

        转账确认

        判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

**请求参数**:

- **wallet.wid**:
  钱包ID
        - **wallet.sn**:
  流水号
        - **wallet.validCode**:
  验证码

        **示例**:{
                "wallet.wid": 1,
                "wallet.sn": "",
                "wallet.validCode": "1585"
            }

### 银行卡

## api.payment.WalletardAction

**数据类型**:

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

    ### `queryWalletard` <span style="color:gray">[内部]</span>

        获取银行卡信息

**请求参数**:

- **walletard.wid**:
  钱包ID

        **示例**:{
                "walletard.wid": 1
            }

**返回参数**:

- **walletards**: 银行卡信息列表 , 每条数据类型 *walletard*
          - 类型: *List*

        **示例**:{
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

    ### `bindWalletard` <span style="color:gray">[内部]</span>

        绑定银行卡

        判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

**请求参数**:

- **walletard.wtid**:
  钱包ID
        - **walletard.wid**:
  钱包ID
        - **walletard.bankNo**:
  银行卡号
        - **walletard.validTime**:
  有效期
        - **walletard.cvv**:
  安全码
        - **walletard.type**:
  类型
        - **walletard.mobile**:
  电话

        **示例**:{
                "walletard.wtid": 1,
                "walletard.wid": 1,
                "walletard.bankNo": "",
                "walletard.validTime": "20160101",
                "walletard.cvv": "789",
                "walletard.type": 0,
                "walletard.mobile": 13840585484,
            }

**返回参数**:

- **walletard**: 银行卡信息
          - 类型: *Object*

        **示例**:{
                ...
                "walletard": {
                    "sn": 1,
                    "validCode": ""
                }
                ...
            }

    ### `confirmWalletard` <span style="color:gray">[内部]</span>

        确认银行卡

        判断银行卡是否存在 , 不存在 , 错误信息 **150058 银行卡不存在**

        判断银行卡状态为0(初始)/5(解绑) , 其他状态 , 错误信息 **150059 银行卡状态不可操作**

**请求参数**:

- **walletard.wtid**:
  钱包ID
        - **walletard.sn**:
  流水号
        - **walletard.validCode**:
  验证码

        **示例**:{
                "walletard.wtid": 1,
                "walletard.sn": 1,
                "walletard.validCode": "6585"
            }

    ### `unbindWalletard` <span style="color:gray">[内部]</span>

        解绑银行卡

        判断银行卡是否存在 , 不存在 , 错误信息 **150058 银行卡不存在**

        判断银行卡状态为1(有效) , 其他状态 , 错误信息 **150059 银行卡状态不可操作**

**请求参数**:

- **walletard.wtid**:
  钱包ID

        **示例**:{
                "walletard.wtid": 1
            }

    ### `deleteWalletard` <span style="color:gray">[内部]</span>

        删除银行卡

        判断银行卡是否存在 , 不存在 , 错误信息 **150058 银行卡不存在**

        判断银行卡状态为0(初始)/5(解绑) , 其他状态 , 错误信息 **150059 银行卡状态不可操作**

**请求参数**:

- **walletard.wtid**:
  钱包ID

        **示例**:{
                "walletard.wtid": 1
            }

### 交易

## api.payment.WalletranAction

**数据类型**:

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

    ### `pageWalletran` <span style="color:gray">[内部]</span>

        分页方式获取交易信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  交易信息列表 , 每条数据类型 *walletran*

        **示例**:{
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

    ### `queryWalletran` <span style="color:gray">[内部]</span>

        获取交易信息

**请求参数**:

- **walletran.wid**:
  钱包ID

        **示例**:{
                "walletran.wid": 1
            }

**返回参数**:

- **walletrans**: 交易信息列表 , 每条数据类型 *walletran*
          - 类型: *List*

        **示例**:{
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

**数据类型**:

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


        获取钱包归属资源

**请求参数**:

- **walletres.wid**:
  钱包ID

        **示例**:{
                "walletres.wid": 1
            }

**返回参数**:

- **walletreses**: 资源信息列表 , 每条数据类型 *walletres*
          - 类型: *List*

        **示例**:{
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

    ### `uploadWalletres` <span style="color:gray">[内部]</span>

        上传资源

        判断钱包是否存在 , 不存在 , 错误信息 **150054 钱包不存在**

**请求参数**:

- **walletres.wid**:
  钱包ID
        - **walletres.name**:
  名称
        - **walletres.path**:
  路径
        - **walletres.type**:
  类型
        - **walletres.comment**:
  备注

        **示例**:{
                "walletres.wid": 1,
                "walletres.name": "名称",
                "walletres.path": "",
                "walletres.type": "00",
                "walletres.comment": "备注"
            }

    ### `deleteWalletres` <span style="color:gray">[内部]</span>

        删除资源

**请求参数**:

- **walletres.wtid**:
  资源ID

        **示例**:{
                "walletres.wtid": 1
            }

## 功能

## api.sales.PaymentFunctionAction

**数据类型**:

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

    ### `queryPaymentFunction` <span style="color:gray">[内部]</span>

        获取款项功能信息

**请求参数**:

- **paymentFunction.type**:
  类型

        **示例**:{
                "paymentFunction.type": 0
            }

**返回参数**:

- **paymentFunctions**: 功能信息 , 类型 *paymentFunction*
          - 类型: *Object*

        **示例**:{
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
