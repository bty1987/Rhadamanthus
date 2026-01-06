# approval 审批
## 审批

审批整体信息管理

## api.approval.ApprovalAction

    审批类型包括:


    | 1              | 客户信息修改                                                 | 保留          |
        #### approval

    - **aid**: 审批ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **receiver**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **sender**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **type**: 类型
      - 类型: *Short*
    - **ident**: 外链ID
      - 类型: *String*
    - **status**: 状态 , 包括: 0: 初始 , 1: 审批通过 , 2: 审批拒绝 , 3: 审批中 , 4: 发起失败 , 5: 客户确认 , 6: 待确认 , 7: 客户拒绝
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
    - **psid**: 钉钉审批编号
      - 类型: *String*

    ### `pageApproval` <span style="color:gray">[内部]</span>

        分页方式获取审批信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  审批信息列表 , 每条数据类型 *approval*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "aid": 1,
                            "orderId": "1601010001",
                            "receiver": {
                                "uid": 1,
                                "userId": "FL-02381",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "136xxxx1453",
                                ...
                            },
                            "sender": {
                                "uid": 2,
                                "userId": "FL-00186",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "phone": "138xxxx1828",
                                ...
                            },
                            "type": 8,
                            "ident": 1,
                            "status": 1,
                            "createTime": "2016-01-01 15:00:44",
                            "approvalTime": "2016-01-01 15:00:54",
                            "contents": "订单号:1607290003,参与活动:test1",
                            "comment": "",
                            "annotate": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### `pageApprovalForReceive` <span style="color:gray">[内部]</span>

        分页方式获取指定接收人的审批信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  审批信息列表 , 每条数据类型 *approval*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "aid": 1,
                            "orderId": "1601010001",
                            "receiver": {
                                "uid": 1,
                                "userId": "FL-02381",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "136xxxx1453",
                                ...
                            },
                            "sender": {
                                "uid": 2,
                                "userId": "FL-00186",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "phone": "138xxxx1828",
                                ...
                            },
                            "type": 8,
                            "ident": 1,
                            "status": 1,
                            "createTime": "2016-01-01 15:00:44",
                            "approvalTime": "2016-01-01 15:00:54",
                            "contents": "订单号:1607290003,参与活动:test1",
                            "comment": "",
                            "annotate": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### `pageApprovalForSend` <span style="color:gray">[内部]</span>

        分页方式获取指定发送人的审批信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  审批信息列表 , 每条数据类型 *approval*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "aid": 1,
                            "orderId": "1601010001",
                            "receiver": {
                                "uid": 1,
                                "userId": "FL-02381",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "136xxxx1453",
                                ...
                            },
                            "sender": {
                                "uid": 2,
                                "userId": "FL-00186",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "phone": "138xxxx1828",
                                ...
                            },
                            "type": 8,
                            "ident": 1,
                            "status": 1,
                            "createTime": "2016-01-01 15:00:44",
                            "approvalTime": "2016-01-01 15:00:54",
                            "contents": "订单号:1607290003,参与活动:test1",
                            "comment": "",
                            "annotate": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### `pageApprovalForReceive` <span style="color:gray">[内部]</span>

        分页方式获取指定接收人的审批信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  审批信息列表 , 每条数据类型 *approval*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "aid": 1,
                            "orderId": "1601010001",
                            "receiver": {
                                "uid": 1,
                                "userId": "FL-02381",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "136xxxx1453",
                                ...
                            },
                            "sender": {
                                "uid": 2,
                                "userId": "FL-00186",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "phone": "138xxxx1828",
                                ...
                            },
                            "type": 8,
                            "ident": 1,
                            "status": 1,
                            "createTime": "2016-01-01 15:00:44",
                            "approvalTime": "2016-01-01 15:00:54",
                            "contents": "订单号:1607290003,参与活动:test1",
                            "comment": "",
                            "annotate": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### `pageApprovalForReceiveDept` <span style="color:gray">[内部]</span>

        分页方式获取审批信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        获取方式为 , 根据当前操作人归属部门 , 查询审批信息中对应的审批部门

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  审批信息列表 , 每条数据类型 *approval*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "aid": 1,
                            "orderId": "1601010001",
                            "receiver": {
                                "uid": 1,
                                "userId": "FL-02381",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "136xxxx1453",
                                ...
                            },
                            "sender": {
                                "uid": 2,
                                "userId": "FL-00186",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "phone": "138xxxx1828",
                                ...
                            },
                            "type": 8,
                            "ident": 1,
                            "status": 1,
                            "createTime": "2016-01-01 15:00:44",
                            "approvalTime": "2016-01-01 15:00:54",
                            "contents": "订单号:1607290003,参与活动:test1",
                            "comment": "",
                            "annotate": ""
                        }
                    ],
                    ...
                },
                ...
            }

    ### `queryApprovalByAId` <span style="color:gray">[内部]</span>

        通过审批ID获取审批信息

**请求参数**:

- **approval.aid**:
  审批ID

        **示例**:{
                "approval.aid": 1
            }

**返回参数**:

- **approval**: 审批信息 , 类型 *approval*
          - 类型: *Object*

        **示例**:{
                ...
                "approval":{
                    "aid": 1,
                    "orderId": "1601010001",
                    "receiver": {
                        "uid": 1,
                        "userId": "FL-02381",
                        "userName": "王宁",
                        "currentName": "王宁",
                        "phone": "136xxxx1453",
                        ...
                    },
                    "sender": {
                        "uid": 2,
                        "userId": "FL-00186",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "phone": "138xxxx1828",
                        ...
                    },
                    "createTime": "2016-01-01 15:00:44",
                    "approvalTime": "2016-01-01 15:00:54",
                    "contents": "订单号:1607290003,参与活动:test1",
                    "type": 8,
                    "ident": 1,
                    "status": 1,
                    "createTime": "2016-01-01 15:00:44",
                    "approvalTime": "2016-01-01 15:00:54",
                    "contents": "订单号:1607290003,参与活动:test1",
                    "comment": "",
                    "annotate": ""
                },
                ...
            }

    ### `countApprovalForReceive` <span style="color:gray">[内部]</span>

        利用当前操作人 , 统计接收未处理审批数量

**返回参数**:

- **count**: 总数
          - 类型: *Integer*

        **示例**:{
                ...
                "count": 1
                ...
            }

    ### `countApprovalForSend` <span style="color:gray">[内部]</span>

        利用当前操作人 , 统计发送未处理审批数量

**返回参数**:

- **count**: 总数
          - 类型: *Integer*

        **示例**:{
                ...
                "count": 1
                ...
            }

    ### `approveApproval` <span style="color:gray">[内部]</span>

        通过审批

        判断审批信息是否存在 , 不存在 , 错误信息 **240009 审批信息不存在**

        判断审批状态是否为0(初始)/5(客户确认)/7(客户拒绝) , 其他状态不可操作 , 错误信息 **240009 审批状态不可操作**

        装修归属审批 , 通过之后原有归属信息状态设置为1(失效) , 利用审批信息更新归属信息 , 更新装修单附加信息内容

        报价折扣审批 , 通过之后修改报价折扣信息

        装修退款审批 , 通过之后需要将退款款项标记为历史 , 生成一条对应类型的退款记录并提交

        装修活动审批 , 通过之后将活动项更新到装修活动项 , 根据计算业绩标识计算净业绩和复合业绩 , 根据计算金额标识计算券优惠和物品优惠

        主材退货审批 , 通过之后需要将主材退货型号生成退货记录 , 同时判断该主材单是否为预结算/结算状态生成结算数据

        主材补款审批 , 通过之后生成补款款项信息

        销售退货审批 , 通过之后需要生成退货单以及商品对应退货项 , 同时判断该销售单是否为预结算/结算状态生成结算数据

        商品库存调拨审批 , 通过之后按照审批申请商品对应的出入库更新对应商品库存 , 同时生成调拨类型货单以及货单项

        销售补款审批 , 通过之后生成补款款项信息

**请求参数**:

- **approval.aid**:
  审批ID
        - **approval.annotate**:
  批注

        **示例**:{
                "approval.aid": 1,
                "approval.annotate": 1
            }

    ### `refuseApproval` <span style="color:gray">[内部]</span>

        拒绝审批

        判断审批信息是否存在 , 不存在 , 错误信息 **240009 审批信息不存在**

        判断审批状态是否为0(初始)/5(客户确认)/7(客户拒绝) , 其他状态不可操作 , 错误信息 **240009 审批状态不可操作**

        装修退款审批 , 拒绝处理过程需要将需要处理的款项状态还原为 **已确认**

        主材退货审批 , 拒绝处理过程需要将申请退货的型号还原到主材单中对应商品

        主材补款审批 , 拒绝处理过程需要将主材订单补款状态修改为 **初始**

        销售退货审批 , 拒绝处理过程需要将申请退货的商品还原到销售单中对应商品

        商品库存调拨审批 , 拒绝处理过程需要将申请个调拨商品还原到货单中对应商品

**请求参数**:

- **approval.aid**:
  审批ID
        - **approval.annotate**:
  批注

        **示例**:{
                "approval.aid": 1,
                "approval.annotate": 1
            }

    ### `affirmApproval` <span style="color:gray">[内部]</span>

        发起确认

        判断审批信息是否存在 , 不存在 , 错误信息 **240009 审批信息不存在**

        判断审批状态是否为0(初始) , 其他状态不可操作 , 错误信息 **240009 审批状态不可操作**

        发送通知消息给客户 , 客户完成确认动作

        审批状态更新为6(待确认)

**请求参数**:

- **approval.aid**:
  审批ID

        **示例**:{
                "approval.aid": 1
            }

    ### <I-C> confirmApproval

        客户确认

        判断审批信息是否存在 , 不存在 , 错误信息 **240009 审批信息不存在**

        判断审批状态是否为6(待确认) , 其他状态不可操作 , 错误信息 **240009 审批状态不可操作**

        更新审批信息状态为5(客户确认)

**请求参数**:

- **approval.aid**:
  审批ID

        **示例**:{
                "approval.aid": 1
            }

    ### <I-C> rejectApproval

        客户拒绝

        判断审批信息是否存在 , 不存在 , 错误信息 **240009 审批信息不存在**

        判断审批状态是否为6(待确认) , 其他状态不可操作 , 错误信息 **240009 审批状态不可操作**

        更新审批信息状态为7(客户拒绝)

**请求参数**:

- **approval.aid**:
  审批ID

        **示例**:{
                "approval.aid": 1
            }

    ### <I-C> approvalCallback

        审批回调

        判断审批信息是否存在 , 不存在 , 错误信息 **240001 审批信息不存在**

        通过回调接口参数 , 执行通过审批或者拒绝审批流程

**请求参数**:

- **approval.psid**:
  钉钉审批编号

        **示例**:{
                "approval.psid": "SLKSDUD238N234FN7"
            }

## 审批人员

人员关于审批权限管理

## api.approval.ApproverAction

**数据类型**:

#### approver

    - **aid**: 审批人员ID
      - 类型: *Long*
    - **user**: 人员 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **type**: 审批类型 , 包括: 1(客户信息修改), 2(订单楼盘信息修改), 3(订单归属修改), 4(报价折扣修改), 5(订单退款), 6(主材退货), 7(主裁场外退款)(过时), 8(活动物品申领), 9(主材补款提交), 10(销售退货)
      - 类型: *Short*
    - **comment**: 说明信息
      - 类型: *String*

    ### <I/V> pageApprover

        分页方式获取审批人员信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  审批人员列表 , 每条数据类型 *approver*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "aid": 1,
                            "type": 1,
                            "user": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "设计师",
                                "currentName": "设计师",
                                "duty": "设计师"
                            },
                            "comment": "说明"
                        }
                    ],
                    ...
                },
                ...
            }

    ### `queryApproverByType` <span style="color:gray">[内部]</span>

        通过审批类型获取审批人员信息

**请求参数**:

- **approver.type**:
  审批类型

        **示例**:{
                "approver.type": 1
            }

**返回参数**:

- **approvers**: 审批人员列表 , 每条数据类型 *approver*
          - 类型: *List*

        **示例**:{
                ...
                "approvers": [
                    {
                        "aid": 1,
                        "type": 1,
                        "user": {
                            "uid": 1,
                            "userId": "U001",
                            "userName": "设计师",
                            "currentName": "设计师",
                            "duty": "设计师"
                        },
                        "comment": "说明"
                    }
                ]
                ...
            }

    ### <I/V> addApprover

        添加审批人员信息

        判断当前添加信息 , 审批类型对应员工是否已经存在 , 如果存在 , 错误信息 **230008 审批人员已有该审批权限**

**请求参数**:

- **approver.userId**:
  员工编号
        - **approver.type**:
  审批类型
        - **approver.comment**:
  说明

        **示例**:{
                "approver.userId": "U001",
                "approver.type": 1,
                "approver.comment": "说明"
            }

    ### <I/V> deleteApprover

        删除审批人员信息

**请求参数**:

- **approver.aid**:
  审批人员ID

        **示例**:{
                "approver.aid": 1
            }

## 装修单客户修改

装修单客户修改审批过程

## api.approval.ApprovalDecorationCustomerAction

**数据类型**:

#### approvalDecorationCustomer

    - **adcid**: ID
      - 类型: *Long*
    - **aid**: 审批ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **scid**: 原客户ID
      - 类型: *Long*
    - **tcid**: 现客户ID
      - 类型: *Long*

    ### `submitApprovalForDecorationCustomer` <span style="color:gray">[内部]</span>

        提交客户信息修改审批

**请求参数**:

- **approval.receiverId**:
  接收人编号
        - **approval.comment**:
  备注信息

        - **approvalDecorationCustomer.orderId**:
  装修单号
        - **approvalDecorationCustomer.scid**:
  原客户ID
        - **approvalDecorationCustomer.tcid**:
  现客户ID

        **示例**:{
                "approval.receiverId": "U0479",
                "approval.comment": "说明",
                "approvalDecorationCustomer.orderId": "1601010001",
                "approvalDecorationCustomer.scid": 1,
                "approvalDecorationCustomer.tcid": 2
            }

## 装修单房产修改

装修单房产修改审批过程

## api.approval.ApprovalDecorationHouseAction

**数据类型**:

#### approvalDecorationHouse

    - **adhid**: ID
      - 类型: *Lonng*
    - **aid**: 审批ID
      - 类型: *Lonng*
    - **orderId**: 装修单号
      - 类型: *String*
    - **shid**: 原房产ID
      - 类型: *Long*
    - **thid**: 现房产ID
      - 类型: *Long*

    ### `submitApprovalForDecorationHouse` <span style="color:gray">[内部]</span>

        提交装修单楼盘信息修改

**请求参数**:

- **approval.receiverId**:
  接收人编号
        - **approval.comment**:
  备注信息

        - **approvalDecorationHouse.orderId**:
  装修单号
        - **approvalDecorationHouse.shid**:
  原房产ID
        - **approvalDecorationHouse.thid**:
  现房产ID

        **示例**:{
                "approval.receiverId": "U0479",
                "approval.comment": "说明",
                "approvalDecorationHouse.orderId": "1601010001",
                "approvalDecorationHouse.shid": 1,
                "approvalDecorationHouse.thid": 2
            }

## 装修归属修改

装修单归属信息修改审批过程

## api.approval.ApprovalDecorationBelongAction

**数据类型**:

#### approvalDecorationBelong

    - **adbid**: 审批ID
      - 类型: *Long*
    - **aid**: 审批ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **belongType**: 类型 , 包括: 0: 设计 , 1: 业务
      - 类型: *Short*

    #### approvalDecorationBelongItem

    - **adbiid**: 项目ID
      - 类型: *Long*
    - **aobId**: 审批ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **buid**: 归属人ID
      - 类型: *Long*
    - **bdid**: 归属部门ID
      - 类型: *Long*
    - **brid**: 归属分区ID
      - 类型: *Long*
    - **rate**: 归属比例
      - 类型: *Integer*
    - **defaultFlag**: 默认标识 , 0: 否 , 1: 是
      - 类型: *Long*

    ### `submitApprovalForDecorationBelong` <span style="color:gray">[内部]</span>

        提交装修单归属信息修改

**请求参数**:

- **approval.receiver.userId**:
  接收人编号
        - **approval.comment**:
  备注信息

        - **approvalDecorationBelong.orderId**:
  装修单号
        - **approvalDecorationBelong.belongType**:
  归属类型
        - **approvalDecorationBelongItem[n].buid**:
  归属人ID
        - **approvalDecorationBelongItem[n].bdid**:
  归属部门ID
        - **approvalDecorationBelongItem[n].brid**:
  归属分区Id
        - **approvalDecorationBelongItem[n].rate**:
  归属人比例
        - **approvalDecorationBelongItem[n].defaultFlag**:
  默认标识

        **示例**:{
                "approval.receiver.userId": "U0479",
                "approval.comment": "说明",
                "approvalDecorationBelong.orderId": "1601010001",
                "approvalDecorationBelong.belongType": 0,
                "approvalDecorationBelongItem[0].buid": 1,
                "approvalDecorationBelongItem[0].bdid": 1,
                "approvalDecorationBelongItem[0].brid": 1,
                "approvalDecorationBelongItem[0].rate": 0.5,
                "approvalDecorationBelongItem[0].defaultFlag": 1,
                "approvalDecorationBelongItem[1].buid": 2,
                "approvalDecorationBelongItem[1].bdid": 2,
                "approvalDecorationBelongItem[1].brid": 2,
                "approvalDecorationBelongItem[1].rate": 0.5,
                "approvalDecorationBelongItem[1].defaultFlag": 0
            }

## 报价折扣修改

报价折扣修改审批过程

## api.approval.ApprovalQuotationDiscountAction

**数据类型**:

#### approvalQuotationDiscount

    - **aqdId**: ID
      - 类型: *Long*
    - **aid**: 审批ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **quotationId**: 报价ID
      - 类型: *Integer*
    - **oldDiscount**: 原折扣
      - 类型: *Integer*
    - **newDiscount**: 新折扣
      - 类型: *Integer*
    - **basePrice**: 基数
      - 类型: *Integer*

    ### `submitApprovalForQuotationDiscount` <span style="color:gray">[内部]</span>

        提交报价折扣修改

**请求参数**:

- **approval.receiverId**:
  接收人编号
        - **approval.comment**:
  备注信息

        - **approvalQuotationDiscount.orderId**:
  装修单号
        - **approvalQuotationDiscount.quotationId**:
  报价ID
        - **approvalQuotationDiscount.oldDiscount**:
  原折扣
        - **approvalQuotationDiscount.newDiscount**:
  新折扣
        - **approvalQuotationDiscount.basePrice**:
  新折扣

        **示例**:{
                "approval.receiverId": "U0479",
                "approval.comment": "说明",
                "approvalOrderBelong.orderId": "1601010001",
                "approvalOrderBelong.quotationId": 1,
                "approvalOrderBelong.oldDiscount": 10000,
                "approvalOrderBelong.newDiscount": 9,
                "approvalOrderBelong.basePrice": 1
            }

## 装修款项退款

装修款项退款审批过程

## api.approval.ApprovalDecorationRefundAction

**数据类型**:

#### approvalDecorationRefund

    - **adrId**: ID
      - 类型: *Long*
    - **aid**: 审批ID
      - 类型: *Long*
    - **paymentId**: 装修款项ID
      - 类型: *Long*

    ### `submitApprovalForDecorationRefund` <span style="color:gray">[内部]</span>

        提交装修款项退款审批

**请求参数**:

- **approval.receiverId**:
  接收人编号
        - **approval.comment**:
  备注信息

        - **approvalDecorationRefund.paymentId**:
  装修款项ID

        **示例**:{
                "approval.receiverId": "U0479",
                "approval.comment": "说明",
                "approvalDecorationRefund.paymentId": 1
            }

## 主材退货

主材退货审批过程

## api.approval.ApprovalMaterialRefundAction

**数据类型**:

#### approvalMaterialRefund

    - **amrId**: ID
      - 类型: *Long*
    - **aid**: 审批ID
      - 类型: *Long*
    - **msoId**: 主材装修单号
      - 类型: *Long*
    - **refund**: 退货总金额
      - 类型: *Long*
    - **type**: 类型 , 0: 退货 , 6: 全退 , 7: 倒单
      - 类型: *Short*

    #### approvalMaterialRefundItem

    - **amriId**: SubID
      - 类型: *Long*
    - **amrId**: ID
      - 类型: *Long*
    - **msoId**: 主材装修单号
      - 类型: *Long*
    - **msoiId**: 型号ID
      - 类型: *Long*
    - **num**: 退货数量
      - 类型: *Integer*
    - **total**: 退货金额
      - 类型: *Integer*
    - **packageName**: 套餐名
      - 类型: *String*
    - **materialItem**: 型号 , 类型 [materialItem](./material.html#api.material.MaterialItemAction.materialItem)
      - 类型: *Object*

    ### `queryApprovalMaterialRefundItem` <span style="color:gray">[内部]</span>

        获取主材退货审批项信息

**请求参数**:

- **approval.aid**:
  审批ID

        **示例**:{
                "approval.aid": 1
            }

**返回参数**:

- **approvalMaterialRefundItems**: 主材退货型号信息列表 , 每条数据类型 *approvalMaterialRefundItem*
          - 类型: *List*

        **示例**:{
                ...
                "approvalMaterialRefundItems": {
                    "mid": 1,
                    "miid": 21,
                    "num": 1,
                    "total": 100000,
                    "packageName": "",
                    "materialItem": {
                        "brannd": "卫浴",
                        "name": "卫浴AB1116",
                        "no": "JP0005",
                        "purchasePrice": 1,
                        "category": "洁具",
                        "unitPrice": 2670000,
                        "measurementUnit": "个",
                        ...
                    }
                }
                ...
            }

    ### `submitApprovalForMaterialRefund` <span style="color:gray">[内部]</span>

        提交主材退货审批

**请求参数**:

- **approval.receiverId**:
  接收人编号
        - **approval.comment**:
  备注信息

        - **approvalMaterialRefund.mid**:
  主材订单ID
        - **approvalMaterialRefund.refund**:
  退款总金额
        - **approvalMateralRefundItem[n].mid**:
  主材订单ID
        - **approvalMateralRefundItem[n].miid**:
  型号ID
        - **approvalMateralRefundItem[n].num**:
  数量
        - **approvalMateralRefundItem[n].total**:
  退货金额
        - **approvalMateralRefundItem[n].packageName**:
  套餐名

        **示例**:{
                "approval.receiverId": "U0479",
                "approval.comment": "说明",
                "approvalMaterialRefund.mid": 1,
                "approvalMaterialRefund.refund": 100000,
                "approvalMateralRefundItem[0].mid": 1,
                "approvalMateralRefundItem[0].miid": 21,
                "approvalMateralRefundItem[0].num": 1,
                "approvalMateralRefundItem[0].total": 100000,
                "approvalMateralRefundItem[0].packageName": ""
            }

## 装修活动申请

装修活动以及活动物品申请审批过程

## api.approval.ApprovalDecorationActivityAction

**数据类型**:

#### approvalDecorationActivity

    - **adaid**: ID
      - 类型: *Long*
    - **aid**: 审批ID
      - 类型: *Long*
    - **activityId**: 活动ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **activityName**: 活动名
      - 类型: *String*

    #### approvalDecorationActivityItem

    - **adaiid**: SubID
      - 类型: *Long*
    - **adaid**: ID
      - 类型: *Long*
    - **aid**: 审批ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **activityName**: 活动名
      - 类型: *String*
    - **activityItemName**: 活动物品名
      - 类型: *String*
    - **type**: 物品类型 , 包括: 0: 券 , 1: 物品
      - 类型: *Short*
    - **stateType**: 状态类型 , 0: 到点 , 1: 定金 , 2: 签单 , 3: 抽奖 , 4: 特批 , 5: 购买(过时) , 6: 其他(过时) , 7: 升级
      - 类型: *Short*
    - **num**: 数量
      - 类型: *Integer*
    - **money**: 金额
      - 类型: *Integer*
    - **content**: 内容
      - 类型: *String*

    ### `queryApprovalDecorationActivity` <span style="color:gray">[内部]</span>

        获取装修活动审批信息

**请求参数**:

- **approval.aid**:
  审批ID

        **示例**:{
                "approval.aid": 1
            }

**返回参数**:

- **approvalDecorationActivityItems**: 装修活动项目列表 , 每条数据类型 *approvalDecorationActivityItem*
          - 类型: *List*

        **示例**:{
                ...
                "approvalDecorationActivityItems": [
                    {
                        "adaiid": 1,
                        "adaid": 1,
                        "aid": 1,
                        "orderId": "1601010001",
                        "activityName": "活动",
                        "activityItemName": "活动项",
                        "type": 0,
                        "stateType": 0,
                        "num": 1,
                        "money": 100000,
                        "content": "备注"
                    }
                ]
                ...
            }

    ### `submitApprovalForDecorationActivity` <span style="color:gray">[内部]</span>

        提交装修活动以及活动物品审批

**请求参数**:

- **approval.receiverId**:
  接收人编号
        - **approval.comment**:
  备注信息

        - **approvalDecorationActivity.orderId**:
  装修单号
        - **approvalDecorationActivity.activityName**:
  活动名
        - **approvalDecorationActivityItem[n].orderId**:
  装修单号
        - **approvalDecorationActivityItem[n].activityName**:
  活动名
        - **approvalDecorationActivityItem[n].activityItemName**:
  物品名
        - **approvalDecorationActivityItem[n].type**:
  类型
        - **approvalDecorationActivityItem[n].stateType**:
  状态类型
        - **approvalDecorationActivityItem[n].num**:
  数量
        - **approvalDecorationActivityItem[n].money**:
  金额
        - **approvalDecorationActivityItem[n].content**:
  内容

        **示例**:{
                "approval.receiverId": "U0479",
                "approval.comment": "说明",
                "approvalDecorationActivity.orderId": "1601010001",
                "approvalDecorationActivity.activityName": "活动",
                "approvalDecorationActivityItem[0].activityName": "活动",
                "approvalDecorationActivityItem[0].activityItemName": "券",
                "approvalDecorationActivityItem[0].type": 0,
                "approvalDecorationActivityItem[0].stateType": 0,
                "approvalDecorationActivityItem[0].num": 1,
                "approvalDecorationActivityItem[0].money": 100000,
                "approvalDecorationActivityItem[0].content": ""
            }

## 主材补款提交审批

主材单所属型号存在折扣价和单价打折之后的价格不等 , 提交补款时需要进行审批

## api.approval.ApprovalMaterialFullPaymentAction

**数据类型**:

#### approvalMaterialFullPayment

    - **amfpid**: ID
      - 类型: *Long*
    - **aid**: 审批ID
      - 类型: *Long*
    - **mid**: 主材单ID
      - 类型: *Long*
    - **referMoney**: 补款金额
      - 类型: *Long*

    ### `submitApprovalForMaterialFullPayment` <span style="color:gray">[内部]</span>

        提交主材补款审批

        审批通过增加主菜单对应的补款款项信息

        判断操作主材单对应的补款是否已经存在 , 如果存在 , 错误信息 **150033 款项类型已存在**

**请求参数**:

- **approval.receiverId**:
  接收人编号
        - **approval.comment**:
  备注信息

        - **approvalMaterialFullPayment.mid**:
  主材单ID
        - **approvalMaterialFullPayment.referMoney**:
  补款金额

        **示例**:{
                "approval.receiverId": "U0479",
                "approval.comment": "说明",
                "approvalMaterialFullPayment.mid": 1,
                "approvalMaterialFullPayment.referMoney": 100
            }

## 销售退货

销售退货审批过程

## api.approval.ApprovalSalesRefundAction

**数据类型**:

#### approvalSalesRefund

    - **asrid**: ID
      - 类型: *Long*
    - **aid**: 审批ID
      - 类型: *Long*
    - **sid**: 销售单ID
      - 类型: *Long*
    - **refund**: 退货总金额
      - 类型: *Long*
    - **type**: 类型 , 0: 退货 , 2: 全退 , 3: 倒单
      - 类型: *Short*

    #### approvalSalesRefundItem

    - **asriid**: 退货项ID
      - 类型: *Long*
    - **asrid**: ID
      - 类型: *Long*
    - **sid**: 销售单ID
      - 类型: *Long*
    - **siid**: 销售项ID
      - 类型: *Long*
    - **num**: 退货数量
      - 类型: *Integer*
    - **total**: 退货金额
      - 类型: *Integer*
    - **salesItem**: 销售项 , 类型 [salesItem](./inventory.html#api.inventory.SalesAction.salesItem)
      - 类型: *Object*

    ### <V> queryApprovalSalesRefundItem

        获取主材退货审批项信息

**请求参数**:

- **approval.aid**:
  审批ID

        **示例**:{
                "approval.aid": 1
            }

**返回参数**:

- **approvalSalesRefundItems**: 主材退货型号信息列表 , 每条数据类型 *approvalSalesRefundItem*
          - 类型: *List*

        **示例**:{
                ...
                "approvalSalesRefundItems": [
                    {
                        "asriid": 1,
                        "asrid": 1,
                        "sid": 1,
                        "num": 1,
                        "total": 100000,
                        "salesItem": {
                            "goods": {
                                "gid": 1,
                                "no": "JGIDNEHDUIN5SD",
                                "name": "瓷砖",
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
                            }
                        }
                    }
                ]
                ...
            }

    ### <V> submitApprovalForSalesRefund

        提交销售退货审批

        销售单信息不存在 , 更新失败 , 错误信息 **260021 销售单不存在**

        判断退货商品数据是否大于对应销售项数量 , 错误信息 **260030 销售项剩余数量不足**

        判断退货商品对于货单项存在 , 数量是否满足退货数量 , 错误信息 **160031 退货商品未到达仓库**

        更新退货所属销售项对应的销售货单项剩余数量

**请求参数**:

- **approval.receiverId**:
  接收人编号
        - **approval.comment**:
  备注信息

        - **approvalSalesRefund.sid**:
  销售单ID
        - **approvalSalesRefund.refund**:
  退款总金额
        - **approvalSalesRefundItem[n].sid**:
  销售单ID
        - **approvalSalesRefundItem[n].siid**:
  销售项ID
        - **approvalSalesRefundItem[n].num**:
  数量
        - **approvalSalesRefundItem[n].total**:
  退货金额

        **示例**:{
                "approval.receiverId": "U0479",
                "approval.comment": "说明",
                "approvalSalesRefund.sid": 1,
                "approvalSalesRefund.refund": 100000,
                "approvalSalesRefundItem[0].sid": 1,
                "approvalSalesRefundItem[0].siid": 21,
                "approvalSalesRefundItem[0].num": 1,
                "approvalSalesRefundItem[0].total": 100
            }

## 商品库存调拨

商品库存调拨审批过程

## api.approval.ApprovalManifestDBAction

**数据类型**:

#### approvalManifestDB

    - **amdbid**: ID
      - 类型: *Long*
    - **aid**: 审批ID
      - 类型: *Long*
    - **manifestTime**: 货单时间
      - 类型: *Timestamp*
    - **comment**: 备注
      - 类型: *String*
    - **attachment**: 附件路径
      - 类型: *String*

    #### approvalManifestDBItem

    - **amdbiid**: 调拨项ID
      - 类型: *Long*
    - **amdbid**: ID
      - 类型: *Long*
    - **goods**: 商品 , 类型 [goods](./inventory.html#api.data.GoodsAction.goods)
      - 类型: *Object*
    - **color**: 商品 , 类型 [color](./inventory.html#api.data.ColorAction.color)
      - 类型: *Object*
    - **format**: 商品 , 类型 [format](./inventory.html#api.data.FormatAction.format)
      - 类型: *Object*
    - **instorehouse**: 入库仓库 , 类型 [storehouse](./inventory.html#api.inventory.StorehouseAction.storehouse)
      - 类型: *Object*
    - **outstorehouse**: 出库仓库, 类型 [storehouse](./inventory.html#api.inventory.StorehouseAction.storehouse)
      - 类型: *Object*
    - **num**: 数量
      - 类型: *Integer*
    - **comment**: 说明
      - 类型: *String*

    ### <V> queryApprovalManifestDBItem

        获取主材退货审批项信息

**请求参数**:

- **approval.aid**:
  审批ID

        **示例**:{
                "approval.aid": 1
            }

**返回参数**:

- **approvalManifestDBItems**: 调拨商品列表 , 每条数据类型 *approvalManifestDBItem*
          - 类型: *List*

        **示例**:{
                ...
                "approvalManifestDBItems": [
                    {
                        "amdbiid": 1,
                        "amdbid": 1,
                        "goods": {
                            "gid": 1,
                            "no": "JGIDNEHDUIN5SD",
                            "name": "瓷砖",
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
                        "instorehouse": {
                            "shid": 1,
                            "code": "SDJ4SDF5",
                            "name": "仓库1"
                        },
                        "outstorehouse": {
                            "shid": 2,
                            "code": "KDI2J45N",
                            "name": "仓库2"
                        },
                        "num": 10000,
                        "comment": "说明"
                    }
                ]
                ...
            }

    ### <V> submitApprovalForManifestDB

        提交商品库存调拨审批

        判断调拨项出库对应商品(颜色 , 规格)库存不存在 , 调拨失败 , 错误信息 260008 商品库存不足

        判断调拨项出库对应商品(颜色 , 规格)库存数量小于出库数量 , 调拨失败 , 错误信息 260008 商品库存不足

        更新调拨项出库商品库存和入库商品数量

**请求参数**:

- **approval.receiverId**:
  接收人编号
        - **approval.comment**:
  备注信息

        - **approvalManifestDB.manifestTime**:
  货单时间
        - **approvalManifestDB.comment**:
  备注
        - **approvalManifestDB.attachment**:
  附件路径

        - **approvalManifestDBItem[n].goods.gid**:
  商品ID
        - **approvalManifestDBItem[n].color.cid**:
  商品ID
        - **approvalManifestDBItem[n].format.fid**:
  商品ID
        - **approvalManifestDBItem[n].instorehouse.shid**:
  入库仓库ID
        - **approvalManifestDBItem[n].outstorehouse.shid**:
  出库仓库ID
        - **approvalManifestDBItem[n].num**:
  数量
        - **approvalManifestDBItem[n].comment**:
  说明

        **示例**:{
                "approval.receiverId": "U0479",
                "approval.comment": "说明",
                "approvalManifestDB.manifestTime": "2016-01-01 00:00:00",
                "approvalManifestDB.comment": 100000,
                "approvalManifestDB.attachment": "",
                "approvalManifestDBItem[0].goods.gid": 1,
                "approvalManifestDBItem[0].color.cid": 1,
                "approvalManifestDBItem[0].format.fid": 1,
                "approvalManifestDBItem[0].instorehouse.shid": 1,
                "approvalManifestDBItem[0].outstorehouse.shid": 2,
                "approvalManifestDBItem[0].num": 1,
                "approvalManifestDBItem[0].comment": "说明"
            }

## 销售补款提交

销售单中销售项折扣价小于折让价 , 提交补款时需要进行审批

## api.approval.ApprovalSalesDiscountAction

**数据类型**:

#### approvalSalesDiscount

    - **asdid**: ID
      - 类型: *Long*
    - **aid**: 审批ID
      - 类型: *Long*
    - **sid**: 销售单ID
      - 类型: *Long*
    - **referMoney**: 补款金额
      - 类型: *Long*
    - **paymentType**: 款项类型 , 支持类型包括: 3(补款) , 5(补款退款)
      - 类型: *Short*

    ### `submitApprovalForSalesDiscount` <span style="color:gray">[内部]</span>

        销售补款提交审批

        审批通过增加销售款对应的补款款项信息

        判断操作销售单对应的补款是否已经存在 , 如果存在 , 错误信息 **260012 销售订单当前状态不能提交补款**

**请求参数**:

- **approval.receiverId**:
  接收人编号
        - **approval.comment**:
  备注信息

        - **approvalSalesDiscount.sid**:
  销售单ID
        - **approvalSalesDiscount.referMoney**:
  补款金额
        - **approvalSalesDiscount.paymentType**:
  款项类型

        **示例**:{
                "approval.receiverId": "U0479",
                "approval.comment": "说明",
                "approvalSalesDiscount.sid": 1,
                "approvalSalesDiscount.referMoney": 100000,
                "approvalSalesDiscount.paymentType": 3
            }

## 客源初审

## api.approval.ApprovalCustomerOriginAction

**数据类型**:

#### approvalCustomerOrigin

    - **acoid**: ID
      - 类型: *Long*
    - **aid**: 审批ID
      - 类型: *Long*
    - **csid**: 客源ID
      - 类型: *Long*

    ### `queryApprovalCustomerOrigin` <span style="color:gray">[内部]</span>

        查询审批客源信息

**请求参数**:

- **approval.aid**:
  审批ID

        **示例**:{
                "approval.aid": 1
            }

    ### `submitApprovalForCustomerOrigin` <span style="color:gray">[内部]</span>

        客源初审提交

**请求参数**:

- **approval.receiverId**:
  接收人编号
        - **approval.comment**:
  备注信息

        - **approvalCustomerOrigin.csid**:
  客源ID

        **示例**:{
                "approval.receiverId": "U0479",
                "approval.comment": "说明",
                "approvalCustomerOrigin.csid": 1
            }

## 客源转装修单

客源信息转成装修单

客源关联房产以及客户信息 , 之后提交判断是否存在装修单 , 不存在直接创建装修单 ; 存在通过判断量尺时间以及设计/业务的保护期进行更改装修单归属

## api.approval.ApprovalCustomerOriginTDecorationAction

**数据类型**:

#### approvalCustomerOriginTDecoration

    - **acodid**: ID
      - 类型: *Long*
    - **aid**: 审批ID
      - 类型: *Long*
    - **csid**: 客源ID
      - 类型: *Long*
    - **customerOrigin**: 客源 , 类型 [customerOrigin](./customer.html#api.customer.CustomerOriginAction.customerOrigin)
      - 类型: *Object*
    - **type**: 类型 , 0: 半包, 1: 整装, 2: 满减
      - 类型: *Short*
    - **typeness**: 类型
      - 类型: *Short*
    - **houseType**: 房屋类别 , 包括: 0: 期房 , 1: 现房
      - 类型: *Short*
    - **houseClass**: 房屋类型 , 包括: 平层 , 阁楼等
      - 类型: *String*
    - **resourceType**: 资源类型 , 0: 咨询 , 1: 量房
      - 类型: *Short*
    - **salesman**: 业务员 , 类型 [user](./user.html#api.data.UserAction.user)
      - 类型: *Object*

    - **code**: 审批编号
      - 类型: *String*
    - **forms**: 表格信息
      - 类型: *String*

    ### `queryApprovalCustomerOriginTDecoration` <span style="color:gray">[内部]</span>

        提交客源转装修单审批

**请求参数**:

- **approval.aid**:
  审批ID

        **示例**:{
                "approval.aid": 1
            }

**返回参数**:

- **approvalCustomerOriginTDecoration**: 客源信息 , 类型 *approvalCustomerOriginTDecoration*
          - 类型: *Object*

        **示例**:{
                ...
                "approvalCustomerOriginTDecoration": {
                    "customerOrigin": {
                        "house": {
                            "village": {
                                "vid": 1,
                                "no": "P001",
                                "name": "广场一期"
                            },
                            "houseNumber": "1#1-1-1",
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
                        "buildArea": 100000,
                        "salesmanType": "资源",
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
                    "type": 0,
                    "typeness": 0,
                    "houseType": 0,
                    "houseClass": "别墅",
                    "resourceType": 0,
                }
                ...
            }

    ### `submitApprovalForCustomerOriginTDecoration` <span style="color:gray">[内部]</span>

        提交客源转装修单审批

        判断客源是否存在 , 不存在 , 错误信息 **330001 客源不存在**

        判断客源状态是否为3(确认)和6(拒绝) , 其他状态 , 错误信息 **330014 客源状态不可操作**

        判断客源业务类型是否存在 , 不存在 , 错误信息 **240008 业务类型非空**

**请求参数**:

- **approval.receiverId**:
  接收人编号
        - **approval.comment**:
  备注信息

        - **approvalCustomerOriginTDecoration.customerOrigin.csid**:
  客源ID
        - **approvalCustomerOriginTDecoration.type**:
  装修单类型
        - **approvalCustomerOriginTDecoration.typeness**:
  装修单类型
        - **approvalCustomerOriginTDecoration.houseType**:
  房屋类别
        - **approvalCustomerOriginTDecoration.houseClass**:
  房屋类型
        - **approvalCustomerOriginTDecoration.resourceType**:
  资源类型
        - **approvalCustomerOriginTDecoration.salesman.userId**:
  业务员ID

        **示例**:{
                "approvalCustomerOriginTDecoration.customerOrigin.csid": 1,
                "approvalCustomerOriginTDecoration.type": 0,
                "approvalCustomerOriginTDecoration.typeness": 0,
                "approvalCustomerOriginTDecoration.houseType": "期房",
                "approvalCustomerOriginTDecoration.resourceType": 1,
                "approvalCustomerOriginTDecoration.salesman.userId": 1
            }

## 客户资源

## api.approval.ApprovalCustomerSourceAction

**数据类型**:

#### approvalCustomerSource

    - **acsid**: ID
      - 类型: *Long*
    - **aid**: 审批ID
      - 类型: *Long*
    - **csid**: 资源ID
      - 类型: *Long*
    - **hid**: 房产ID
      - 类型: *Long*

    ### `queryApprovalCustomerSource` <span style="color:gray">[内部]</span>

        查询审批客源信息

**请求参数**:

- **approval.aid**:
  审批ID

        **示例**:{
                "approval.aid": 1
            }

    ### `submitApprovalForCustomerSource` <span style="color:gray">[内部]</span>

        客源初审提交

**请求参数**:

- **approval.receiverId**:
  接收人编号
        - **approval.comment**:
  备注信息

        - **approvalCustomerSource.csid**:
  客源ID
        - **approvalCustomerSource.hid**:
  房产ID

        **示例**:{
                "approval.receiverId": "U0479",
                "approval.comment": "说明",
                "approvalCustomerSource.hid": 1,
                "approvalCustomerSource.hid": 1
            }

## 客户机会

机会信息转成装修单

客源关联房产以及客户信息 , 之后提交判断是否存在装修单 , 不存在直接创建装修单 ; 存在通过判断量尺时间以及设计/业务的保护期进行更改装修单归属

## api.approval.ApprovalCustomerChanceAction

**数据类型**:

#### approvalCustomerChance

    - **accid**: ID
      - 类型: *Long*
    - **aid**: 审批ID
      - 类型: *Long*
    - **ccid**: 机会ID
      - 类型: *Long*
    - **chance**: 机会 , 类型 [customerChance](./customer.html#api.customer.CustomerChanceAction.customerChance)
      - 类型: *Object*
    - **type**: 类型 , 0: 半包, 1: 整装, 2: 满减
      - 类型: *Short*
    - **typeness**: 类型
      - 类型: *Short*
    - **houseType**: 房屋类别 , 包括: 0: 期房 , 1: 现房
      - 类型: *Short*
    - **houseClass**: 房屋类型 , 包括: 平层 , 阁楼等
      - 类型: *String*
    - **resourceType**: 资源类型 , 0: 咨询 , 1: 量房
      - 类型: *Short*

    - **code**: 审批编号
      - 类型: *String*
    - **forms**: 表格信息
      - 类型: *String*

    ### `queryApprovalCustomerChance` <span style="color:gray">[内部]</span>

        提交客源转装修单审批

**请求参数**:

- **approval.aid**:
  审批ID

        **示例**:{
                "approval.aid": 1
            }

**返回参数**:

- **approvalCustomerChance**: 客源信息 , 类型 *approvalCustomerChance*
          - 类型: *Object*

        **示例**:{
                ...
                "approvalCustomerChance": {
                    "chance": {
                        "house": {
                            "village": {
                                "vid": 1,
                                "no": "P001",
                                "name": "广场一期"
                            },
                            "houseNumber": "1#1-1-1",
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
                        "buildArea": 100000,
                        "salesmanType": "资源",
                    },
                    "type": 0,
                    "typeness": 0,
                    "houseType": 0,
                    "houseClass": "别墅",
                    "resourceType": 0,
                }
                ...
            }

    ### `submitApprovalForCustomerChance` <span style="color:gray">[内部]</span>

        提交客户机会

        判断客户机会是否存在 , 不存在 , 错误信息 **330075 客户机会不存在**

        判断客户机会状态是否为3(确认) , 其他状态 , 错误信息 **330077 客户机会不可操作**

        判断客户资源状态是否为3(确认) , 其他状态 , 错误信息 **330074 客户资源不可操作**

**请求参数**:

- **approval.receiverId**:
  接收人编号
        - **approval.comment**:
  备注信息

        - **approvalCustomerChance.chance.ccid**:
  机会ID
        - **approvalCustomerChance.type**:
  装修单类型
        - **approvalCustomerChance.typeness**:
  装修单类型
        - **approvalCustomerChance.houseType**:
  房屋类别
        - **approvalCustomerChance.houseClass**:
  房屋类型
        - **approvalCustomerChance.resourceType**:
  资源类型
        - **approvalCustomerChance.salesman.userId**:
  业务员ID

        **示例**:{
                "approvalCustomerChance.chance.ccid": 1,
                "approvalCustomerChance.type": 0,
                "approvalCustomerChance.typeness": 0,
                "approvalCustomerChance.houseType": "期房",
                "approvalCustomerChance.resourceType": 1,
                "approvalCustomerChance.salesman.userId": 1
            }

## 装修单满减修改

## api.approval.ApprovalDecorationHolonomyAction

**数据类型**:

#### approvalDecorationHolonomy

    - **adhid**: ID
      - 类型: *Long*
    - **aid**: 审批ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **materialPrice**: 主材配比额
      - 类型: *Long*

    ### `submitApprovalForDecorationHolonomy` <span style="color:gray">[内部]</span>

        装修单满减修改

**请求参数**:

- **approval.receiverId**:
  接收人编号
        - **approval.comment**:
  备注信息

        - **approvalDecorationHolonomy.orderId**:
  装修单
        - **approvalDecorationHolonomy.materialPrice**:
  补款金额

        **示例**:{
                "approval.receiverId": "U0479",
                "approval.comment": "说明",
                "approvalSalesDiscount.sid": 1,
                "approvalSalesDiscount.referMoney": 100000
            }

**返回参数**:

- **approvalCustomerOrigin**: 客源信息 , 类型 *approvalCustomerOrigin*
          - 类型: *Object*

        **示例**:{
                ...
                "approvalCustomerOrigin": {
                    "customerOrigin": {
                        "house": {
                            "village": {
                                "vid": 1,
                                "no": "P001",
                                "name": "广场一期"
                            },
                            "houseNumber": "1#1-1-1",
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
                        "buildArea": 100000,
                        "salesmanType": "资源",
                    }
                }
                ...
            }

## 销售不退定金

## api.approval.ApprovalSalesDaymentAction

**数据类型**:

#### approvalSalesDayment

    - **sadid**: ID
      - 类型: *Long*
    - **aid**: 审批ID
      - 类型: *Long*
    - **sid**: 销售单ID
      - 类型: *Long*

    ### `submitApprovalForSalesDayment` <span style="color:gray">[内部]</span>

        销售不退定金

**请求参数**:

- **approval.receiverId**:
  接收人编号
        - **approval.comment**:
  备注信息

        - **approvalSalesDayment.sid**:
  销售单ID

        **示例**:{
                "approval.receiverId": "U0479",
                "approval.comment": "说明",
                "approvalSalesDayment.sid": 1
            }

## 装修合同终止

## api.approval.ApprovalDecorationTerminalAction

**数据类型**:

#### approvalDecorationTerminal

    - **adtid**: ID
      - 类型: *Long*
    - **aid**: 审批ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*

    #### approvalDecorationTerminalItem

    - **adtiid**: ID
      - 类型: *Long*
    - **aid**: 审批ID
      - 类型: *Long*
    - **adtid**: 合同终止审批ID
      - 类型: *Long*
    - **paymentType**: 款项类型
      - 类型: *String*
    - **referMoney**: 金额
      - 类型: *Long*

    ### `submitApprovalForDecorationTerminal` <span style="color:gray">[内部]</span>

        销售不退定金

**请求参数**:

- **approval.receiverId**:
  接收人编号
        - **approval.comment**:
  备注信息

        - **approvalDecorationTerminal.orderId**:
  装修单号

        - **approvalDecorationTerminalItem[n].paymentType**:
  款项类型
        - **approvalDecorationTerminalItem[n].referMoney**:
  金额

        **示例**:{
                "approval.receiverId": "U0479",
                "approval.comment": "说明",
                "approvalDecorationTerminal.orderId": "1601010001",
                "approvalDecorationTerminalItem[0].paymentType": "违约金",
                "approvalDecorationTerminalItem[0].referMoney": 0
            }

## 报价特批优惠

## api.approval.ApprovalQuotationPreferAction

**数据类型**:

#### approvalQuotationPrefer

    - **aqpid**: ID
      - 类型: *Long*
    - **aid**: 审批ID
      - 类型: *Long*
    - **qid**: 报价ID
      - 类型: *Long*
    - **qpid**: 报价优惠ID
      - 类型: *Long*
    - **ppid**: 预签产品ID
      - 类型: *Long*
    - **preferPrice**: 优惠额
      - 类型: *Long*
    - **managePrefer**: 管理优惠
      - 类型: *Long*
    - **advancePrefer**: 特批优惠
      - 类型: *Long*
    - **taxPrice**: 税金
      - 类型: *Long*
    - **totalPrice**: 报价总额
      - 类型: *Long*

    ### `submitApprovalForQuotationPreferAction` <span style="color:gray">[内部]</span>

        报价特批优惠

**请求参数**:

- **approval.receiverId**:
  接收人编号
        - **approval.comment**:
  备注信息

        - **approvalQuotationPrefer.qid**:
  报价ID
        - **approvalQuotationPrefer.qpid**:
  报价优惠ID
        - **approvalQuotationPrefer.ppid**:
  预签产品ID
        - **approvalQuotationPrefer.preferPrice**:
  优惠额
        - **approvalQuotationPrefer.managePrefer**:
  管理优惠
        - **approvalQuotationPrefer.advancePrefer**:
  管理优惠
        - **approvalQuotationPrefer.taxPrice**:
  管理优惠
        - **approvalQuotationPrefer.totalPrice**:
  报价总额

        **示例**:{
                "approval.receiverId": "U0479",
                "approval.comment": "说明",

                "approvalQuotationPrefer.qid": 1,
                "approvalQuotationPrefer.qpid": 1,
                "approvalQuotationPrefer.ppid": 0,
                "approvalQuotationPrefer.preferPrice": 10000,
                "approvalQuotationPrefer.managePrefer": 10000,
                "approvalQuotationPrefer.advancePrefer": 10000,
                "approvalQuotationPrefer.taxPrice": 10000,
                "approvalQuotationPrefer.totalPrice": 10000
            }

## 装修合同生成

## api.approval.ApprovalDecorationContractAction

**数据类型**:

#### approvalDecorationContract

    - **adcid**: ID
      - 类型: *Long*
    - **aid**: 审批ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **cid**: 合同模板ID
      - 类型: *Long*

    ### `submitApprovalDecorationContractAction` <span style="color:gray">[内部]</span>

        报价特批优惠

**请求参数**:

- **approval.receiverId**:
  接收人编号
        - **approval.comment**:
  备注信息

        - **approvalDecorationContract.orderId**:
  装修单号
        - **approvalDecorationContract.cid**:
  合同模板ID

        **示例**:{
                "approval.receiverId": "U0479",
                "approval.comment": "说明",

                "approvalQuotationPrefer.orderId": '1601010001',
                "approvalQuotationPrefer.cid": 1
            }

## 钉钉

## api.approval.ProcessAction

**数据类型**:

#### processRefer

    - **prid**: 参考ID
      - 类型: *Long*
    - **id**: 标识
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **type**: 类型 , 包括: query, filling, select, text, textarea, upload, datetime
      - 类型: *String*

    #### process

    - **pid**: 审批ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **key**: 键值
      - 类型: *String*
    - **code**: 编号
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **company**: 公司
      - 类型: *Integer*

    #### processItem

    - **piid**: 项目ID
      - 类型: *Long*
    - **pid**: 审批ID
      - 类型: *Long*
    - **id**: 标识
      - 类型: *String*
    - **name**: 名称
      - 类型: *String*
    - **form**: 类别 , 包括: field, item, comment
      - 类型: *String*
    - **type**: 类型 , 包括: query, filling, select, text, textarea, upload, datetime
      - 类型: *String*
    - **validate**: 校验 , 包括: require, integer, float
      - 类型: *String*
    - **data**: 数据 , select类型选择项内容
      - 类型: *String*
    - **comment**: 备注 , 备注类型说明内容
      - 类型: *String*
    - **sort**: 排序
      - 类型: *Short*

    ### `queryProcessRefer` <span style="color:gray">[内部]</span>

        获取审批参考信息

**返回参数**:

- **processRefers**: 审批参考列表 , 每条数据类型 *processRefer*
          - 类型: *List*

        **示例**:{
                ...
                "processRefers": [
                    {
                        "prid": 1,
                        "id": "id",
                        "name": "参考名称",
                        "type": "filling"
                    }
                ],
                ...
            }

    ### `pageProcess` <span style="color:gray">[内部]</span>

        分页方式获取审批信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  审批信息列表 , 每条数据类型 *process*

        **示例**:{
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "pid": 1,
                            "name": "审批名称",
                            "key": "A348",
                            "code": "JSD4H324JJ4JNjd43JNjdsjf"
                        }
                    ],
                    ...
                },
                ...
            }

    ### `queryProcess` <span style="color:gray">[内部]</span>

        获取审批信息

**返回参数**:

- **processes**: 审批信息列表 , 每条数据类型 *process*
          - 类型: *List*

        **示例**:{
                ...
                "processes": [
                    {
                        "pid": 1,
                        "name": "审批名称",
                        "key": "A348",
                        "code": "JSD4H324JJ4JNjd43JNjdsjf"
                        "items": [
                            {
                                "piid": 1,
                                "pid": 1,
                                "id": "name",
                                "name": "名称",
                                "form": "field",
                                "type": "text",
                                "validate": "require",
                                "data": "",
                                "comment": "",
                                "sort": 1
                            }
                        ],
                    }
                }
                ...
            }

    ### `queryProcessByPid` <span style="color:gray">[内部]</span>

        获取审批信息

**请求参数**:

- **process.pid**:
  审批ID

        **示例**:{
                "process.pid": 1
            }

**返回参数**:

- **process**: 审批信息 , 类型 *process*
          - 类型: *Object*

        **示例**:{
                ...
                "process": {
                    "pid": 1,
                    "name": "审批名称",
                    "key": "A348",
                    "code": "JSD4H324JJ4JNjd43JNjdsjf"
                    "items": [
                        {
                            "piid": 1,
                            "pid": 1,
                            "id": "name",
                            "name": "名称",
                            "form": "field",
                            "type": "text",
                            "validate": "require",
                            "data": "",
                            "comment": "",
                            "sort": 1
                        }
                    ]
                }
                ...
            }

    ### `queryProcessItem` <span style="color:gray">[内部]</span>

        获取审批项信息

**请求参数**:

- **process.pid**:
  审批ID

        **示例**:{
                "process.pid": 1
            }

**返回参数**:

- **processItems**: 审批项目信息列表 , 类型 *processItem*
          - 类型: *Object*

        **示例**:{
                ...
                "processItems": [
                    {
                        "piid": 1,
                        "pid": 1,
                        "id": "name",
                        "name": "名称",
                        "form": "field",
                        "type": "text",
                        "validate": "require",
                        "data": "",
                        "comment": "",
                        "sort": 1
                    }
                ]
                ...
            }

    ### `addProcess` <span style="color:gray">[内部]</span>

        添加审批

**请求参数**:

- **process.name**:
  名称
        - **process.key**:
  键值
        - **process.code**:
  编号

        - **processItems[n].id**:
  标识
        - **processItems[n].name**:
  名称
        - **processItems[n].form**:
  类别
        - **processItems[n].type**:
  类型
        - **processItems[n].validate**:
  校验
        - **processItems[n].data**:
  数据
        - **processItems[n].comment**:
  备注
        - **processItems[n].sort**:
  排序

        **示例**:{
                "process.name": "名称",
                "process.key": "A348",
                "process.code": "JSD4H324JJ4JNjd43JNjdsjf",

                "processItems[0].id": "name",
                "processItems[0].name": "名称",
                "processItems[0].form": "field",
                "processItems[0].type": "text",
                "processItems[0].validate": "require",
                "processItems[0].data": "",
                "processItems[0].comment": "",
                "processItems[0].sort": 1
            }

    ### `updateProcess` <span style="color:gray">[内部]</span>

        更新审批

**请求参数**:

- **process.pid**:
  审批ID
        - **process.name**:
  名称
        - **process.key**:
  键值
        - **process.code**:
  编号

        - **processItems[n].id**:
  标识
        - **processItems[n].name**:
  名称
        - **processItems[n].form**:
  类别
        - **processItems[n].type**:
  类型
        - **processItems[n].validate**:
  校验
        - **processItems[n].data**:
  数据
        - **processItems[n].comment**:
  备注
        - **processItems[n].sort**:
  排序

        **示例**:{
                "process.pid": 1,
                "process.name": "名称",
                "process.key": "A348",
                "process.code": "JSD4H324JJ4JNjd43JNjdsjf",

                "processItems[0].id": "name",
                "processItems[0].name": "名称",
                "processItems[0].form": "field",
                "processItems[0].type": "text",
                "processItems[0].validate": "require",
                "processItems[0].data": "",
                "processItems[0].comment": "",
                "processItems[0].sort": 1
            }

    ### `updateProcessForStatus` <span style="color:gray">[内部]</span>

        更新审批状态

**请求参数**:

- **process.pid**:
  审批ID
        - **process.status**:
  状态

        **示例**:{
                "process.pid": 1,
                "process.status": 1
            }

    ### `deleteProcess` <span style="color:gray">[内部]</span>

        删除审批

**请求参数**:

- **process.pid**:
  审批ID


        **示例**:{
                "process.pid": 1,
                "process.status": 1
            }

    ### `updateProcessItem` <span style="color:gray">[内部]</span>

        更新审批项

**请求参数**:

- **processItem.piid**:
  项目ID
        - **processItem.id**:
  标识
        - **processItem.name**:
  名称
        - **processItem.form**:
  类别
        - **processItem.type**:
  类型
        - **processItem.validate**:
  校验
        - **processItem.data**:
  数据
        - **processItem.comment**:
  备注
        - **processItem.sort**:
  排序

        **示例**:{
                "processItem.piid": 1,
                "processItem.id": "name",
                "processItem.name": "名称",
                "processItem.form": "field",
                "processItem.type": "text",
                "processItem.validate": "require",
                "processItem.data": "",
                "processItem.comment": "",
                "processItem.sort": 1
            }

    ### `deleteProcessItem` <span style="color:gray">[内部]</span>

        删除审批项

**请求参数**:

- **processItem.piid**:
  项目ID

        **示例**:{
                "processItem.piid": 1
            }
