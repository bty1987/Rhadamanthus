# quotation {#quotation}

# 报价
## 预报

### 预报

装修单报价相关信息管理

折前总额 = ∑打折项 + ∑非打折项

折后总额 = ∑打折项 * 折扣 + ∑非打折项

车运费 = (∑打折项 + ∑非打折项) * 车运费比例

管理费 = (∑打折项 + ∑非打折项 + 车运费) * 管理费比例

报价额 = 工程额 + 车运费 + 管理费

## api.quotetion.QuotetionAction

        |DataType:|
        #### quotetion

    - **qid**: 报价ID
      - 类型: *Long*
    - **no**: 编号 , 随机生成一组字符串 , 同时系统唯一
      - 类型: *String*
    - **name**: 报价名称
      - 类型: *String*
    - **version**: 报价版本编号
      - 类型: *String*
    - **cuid**: 创建人ID
      - 类型: *Long*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **updateTime**: 更新时间
      - 类型: *Timestamp*
    - **basePrice**: 基数
      - 类型: *Long*
    - **undisPrice**: 不打折项总额 = ∑(工程量 * 不打折项折前单价)
      - 类型: *Long*
    - **disPrice**: 打折项总额 = ∑(工程量 * 打折项折前总价)
      - 类型: *Long*
    - **consPrice**: 工程总额
      - 类型: *Long*
    - **comsPrice**: 主材总额
      - 类型: *Long*
    - **discount**: 折扣
      - 类型: *Long*
    - **trafficPrice**: 车运费
      - 类型: *Long*
    - **trafficRate**: 车运费比例
      - 类型: *Integer*
    - **trafficDiscount**: 车运费折扣 , 0: 不打折 1: 打折
      - 类型: *Short*
    - **managePrice**: 管理费
      - 类型: *Long*
    - **manageRate**: 管理费比例
      - 类型: *Integer*
    - **manageDiscount**: 管理费折扣 , 0: 不打折 1: 打折
      - 类型: *Short*
    - **taxPrice**: 税金
      - 类型: *Long*
    - **taxRate**: 税金比例
      - 类型: *Integer*
    - **taxDiscount**: 税金折扣
      - 类型: *Short*
    - **costPrice**: 成本总额
      - 类型: *Long*
    - **content**: 说明
      - 类型: *String*
    
    - **totalPrice**: 报价总额
      - 类型: *Long*
    
    ### <I> queryQuotetion

        通过创建人ID查询归属的报价信息
        
                |Returns:|
                - **quotetions**: 报价信息列表 , 类型 *quotetion*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "quotetions":[
                    {
                        "qid": 1,
                        "no": "JIN123IN4JKHJH",
                        "name": "现代",
                        "version": "QV001",
                        "createTime": "2016-01-01",
                        "updateTime": "2016-01-01",
                        "basePrice": 0,
                        "undisPrice": 90154,
                        "disPrice": 90154,
                        "consPrice": 0,
                        "comsPrice": 0,
                        "discount": 10000,
                        "trafficPrice": 7800,
                        "trafficRate": 200,
                        "trafficDiscount": 0,
                        "managePrice": 11154,
                        "manageRate": 100,
                        "manageDiscount": 0,
                        "taxPrice": 0,
                        "taxRate": 0,
                        "taxDiscount": 0,
                        "costPrice": 0,
                        "totalPrice": 90154,
                        "content": ""
                    }
                ],
                ...
            }
    
    ### <I> queryQuotetionByQid

        通过报价ID获取报价信息
        
                |Requests:|
                :param quotetion.qid: 报价ID
        :type quotetion.qid: Long
        
        Example::
        
            {
                "quotetion.qid": 1
            }
            
                |Returns:|
                - **quotetion**: 报价信息 , 类型 *quotetion*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "quotetion": {
                    "qid": 1,
                    "no": "JIN123IN4JKHJH",
                    "name": "现代",
                    "version": "QV001",
                    "createTime": "2016-01-01",
                    "updateTime": "2016-01-01",
                    "basePrice": 0,
                    "undisPrice": 90154,
                    "disPrice": 90154,
                    "consPrice": 0,
                    "comsPrice": 0,
                    "discount": 10000,
                    "trafficPrice": 7800,
                    "trafficRate": 200,
                    "trafficDiscount": 0,
                    "managePrice": 11154,
                    "manageRate": 100,
                    "manageDiscount": 0,
                    "taxPrice": 0,
                    "taxRate": 0,
                    "taxDiscount": 0,
                    "costPrice": 0,
                    "totalPrice": 90154,
                    "content": ""
                }
                ...
            }
            
    ### <I> queryQuotetionByNo

        通过报价编号获取报价信息
        
                |Requests:|
                :param quotetion.no: 报价编号
        :type quotetion.no: String
        
        Example::
        
            {
                "quotetion.no": "JIN123IN4JKHJH"
            }
            
                |Returns:|
                - **quotetion**: 报价信息 , 类型 *quotetion*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "quotetion": {
                    "qid": 1,
                    "no": "JIN123IN4JKHJH",
                    "name": "现代",
                    "version": "QV001",
                    "createTime": "2016-01-01",
                    "updateTime": "2016-01-01",
                    "basePrice": 0,
                    "undisPrice": 90154,
                    "disPrice": 90154,
                    "consPrice": 0,
                    "comsPrice": 0,
                    "discount": 10000,
                    "trafficPrice": 7800,
                    "trafficRate": 200,
                    "trafficDiscount": 0,
                    "managePrice": 11154,
                    "manageRate": 100,
                    "manageDiscount": 0,
                    "taxPrice": 0,
                    "taxRate": 0,
                    "taxDiscount": 0,
                    "costPrice": 0,
                    "totalPrice": 90154,
                    "content": ""
                }
                ...
            }
            
    ### <I> addQuotetion

        添加报价信息
        
        判断当前操作人员创建报价数量 , 大于阀值 , 错误信息 **200001 报价已经达到数量上限**
        
        创建名称为"生成项目"功能区 , 排序号为9999 , 类型为0(管理)
        
        "生成项目"功能区创建两个项目
        
        名称: "车运费" , 单位: "" , 工种: "其他" , 类型: 2(车运费) , 子类: 0(工程)
        
        名称: "管理费" , 单位: "" , 工种: "其他" , 类型: 3(管理费) , 子类: 0(工程)
        
        车运费和管理费的比例根据报价版本信息获取
        
                |Requests:|
                :param quotetion.name: 报价名
        :type quotetion.name: String
        :param quotetion.version: 报价版本编号
        :type quotetion.version: String
        :param quotetion.content: 说明
        :type quotetion.content: String
        
        Example::
        
            {
                "quotetion.name": "测试",
                "quotetion.version": "QV001",
                "quotetion.content": ""
            }
            
    ### <I> updateQuotetion

        更新报价基础信息
        
        判断报价是否存在 , 不存在 错误信息 **200013 报价项不存在**
        
                |Requests:|
                :param quotetion.qid: 报价ID
        :type quotetion.qid: Long
        :param quotetion.name: 报价名
        :type quotetion.name: String
        :param quotetion.content: 说明
        :type quotetion.content: String
        
        Example::
        
            {
                "quotetion.qid": 1,
                "quotetion.name": "测试",
                "quotetion.content": ""
            }
            
    ### <I> updateQuotetionForAdvance

        更新报价高级信息 , 同时按照报价的类型分别更新对应的信息
        
        判断报价是否存在 , 不存在 错误信息 **200013 报价项不存在**
        
                |Requests:|
                :param quotetion.qid: 报价ID
        :type quotetion.qid: Long
        :param quotetion.basePrice: 基数
        :type quotation.basePrice: Long
        :param quotetion.undisPrice: 不打折项总额
        :type quotetion.undisPrice: Long
        :param quotetion.disPrice: 打折项总额
        :type quotetion.disPrice: Long
        :param quotetion.consPrice: 工程总额
        :type quotetion.consPrice: Long
        :param quotetion.comsPrice: 主材总额
        :type quotetion.comsPrice: Long
        :param quotetion.discount: 折扣
        :type quotetion.discount: Long
        :param quotetion.trafficPrice: 车运费
        :type quotetion.trafficPrice: Long
        :param quotetion.trafficRate: 车运费比例
        :type quotetion.trafficRate: Integer
        :param quotetion.trafficDiscount: 车运费折扣
        :type quotetion.trafficDiscount: Short
        :param quotetion.managePrice: 管理费
        :type quotetion.managePrice: Long
        :param quotetion.manageRate: 管理费比例
        :type quotetion.manageRate: Integer
        :param quotetion.manageDiscount: 管理费折扣
        :type quotetion.manageDiscount: Short
        :param quotetion.taxPrice: 税金
        :type quotetion.taxPrice: Long
        :param quotetion.taxRate: 税金比例
        :type quotetion.taxRate: Integer
        :param quotetion.taxDiscount: 税金折扣
        :type quotetion.taxDiscount: Short
        :param quotetion.costPrice: 成本金额
        :type quotetion.costPrice: Long
        :param quotetion.totalPrice: 报价总额
        :type quotetion.totalPrice: Long
            
        Example::
        
            {
                "quotetion.qid": 1,
                "quotetion.basePrice": 0,
                "quotetion.undisPrice": 10000,
                "quotetion.disPrice": 10000,
                "quotetion.consPrice": 0,
                "quotetion.comsPrice": 0,
                "quotetion.discount": 900,
                "quotetion.trafficPrice": 0,
                "quotetion.trafficRate": 200,
                "quotetion.trafficDiscount": 0,
                "quotetion.managePrice": 0,
                "quotetion.manageRate": 10035,
                "quotetion.manageDiscount": 0,
                "quotetion.taxPrice": 0,
                "quotetion.taxRate": 10035,
                "quotetion.taxDiscount": 0,
                "quotetion.costPrice": 0,
                "quotetion.totalPrice": 10000
            }
            
    ### <I> replicaQuotetion

        拷贝报价 , 将报价(quotation)拷贝到报价(quotetion)
        
        判断报价是否存在 , 不存在 错误信息 **200013 报价项不存在**
        
                |Requests:|
                :param quotetion.qid: 报价ID
        :type quotetion.qid: Long
            
        Example::
        
            {
                "quotetion.no": 1
            }
            
    ### <I> copyQuotetion

        复制报价到报价中
        
        判断报价是否存在 , 不存在 错误信息 **200013 报价项不存在**
        
                |Requests:|
                :param quotetion.qid: 拷贝报价ID
        :type quotetion.qid: Long
            
        Example::
        
            {
                "quotetion.qid": 1
            }
            
    ### <I> cloneQuotetion

        克隆报价 , 通过报价编号进行拷贝
        
        判断报价是否存在 , 不存在 错误信息 **200013 报价项不存在**
        
                |Requests:|
                :param quotetion.no: 报价编号
        :type quotetion.no: String
            
        Example::
        
            {
                "quotetion.no": "JIN123IN4JKHJH"
            }

    ### <I> deleteQuotetion

        通过报价ID删除报价信息 , 默认报价不能删除
        
        判断删除报价是否归属操作人 , 不归属 , 错误信息 **200030 报价不可操作**
        
                |Requests:|
                :param quotetion.qid: 报价ID
        :type quotetion.qid: Long
            
        Example::
        
            {
                "quotetion.qid": 1,
            }
            
### 预报-功能区

报价中功能区信息管理

## api.quotetion.QuotetionFunctionAreaAction

        |DataType:|
        #### quotetionFunctionArea

    - **qfaid**: 功能区ID
      - 类型: *Long*
    - **qid**: 报价ID
      - 类型: *Long*
    - **name**: 功能区名
      - 类型: *String*
    - **index**: 功能区排序
      - 类型: *Integer*
    - **type**: 类型 , 分为: 0(管理), 1(工程量), 2(功能区总额), 3(不计算) , 4(成本), 5(非业绩)
      - 类型: *Short*
    - **quotetionFunctionAreaItems**: 功能区包含报价项信息列表 , 每条数据类型 [quotetionFunctionAreaItem](./quotation.html#api.quotetion.QuotetionFunctionAreaItemAction.quotetionFunctionAreaItem)
      - 类型: *List*
            
    ### <I> queryQuotetionFunctionAreaByQid

        通过报价ID查询功能区信息 , 包含功能区中报价项信息
        
                |Requests:|
                :param quotetion.qid: 报价ID
        :type quotetion.qid: Long
        
        Example::
        
            {
                "quotetion.qid": 1,
            }
            
                |Returns:|
                - **quotetionFunctionAreas**: 功能区信息列表 , 每条数据类型 *quotetionFunctionArea*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "quotetionFunctionAreas": [
                    {
                        "qfaid": 1,
                        "qid": 1,
                        "name": "门厅",
                        "sort": 1,
                        "type": 1,
                        "quotetionFunctionAreaItems": [
                            {
                                "qfaiid": 1,
                                "qfaid": 1,
                                "qiid": null,
                                "name": "报价项",
                                "measurementUnit": "",
                                "discount": 0,
                                "num": 1,
                                "type": 2,
                                "unitPrice": 100,
                                "workType": "木工",
                                "content": ""
                            }
                        ]
                    }
                ],
                ...
            }
            
    ### <I> addQuotetionFuctionArea

        报价中添加功能区信息
        
        判断报价是否存在 , 不存在 错误信息 **200013 报价项不存在**
        
        返回功能区 , 同时返回功能区中包含的报价项
        
                |Requests:|
                :param quotetion.qid: 报价ID
        :type quotetion.qid: Long
        :param quotetion.basePrice: 基数
        :type quotetion.basePrice: Long
        :param quotetion.undisPrice: 不打折项总额
        :type quotetion.undisPrice: Long
        :param quotetion.disPrice: 打折项总额
        :type quotetion.disPrice: Long
        :param quotetion.discount: 折扣
        :type quotetion.discount: Long
        :param quotetion.trafficPrice: 车运费
        :type quotetion.trafficPrice: Long
        :param quotetion.trafficRate: 车运费比例
        :type quotetion.trafficRate: Integer
        :param quotetion.trafficDiscount: 车运费折扣
        :type quotetion.trafficDiscount: Short
        :param quotetion.managePrice: 管理费
        :type quotetion.managePrice: Long
        :param quotetion.manageRate: 管理费比例
        :type quotetion.manageRate: Integer
        :param quotetion.manageDiscount: 管理费折扣
        :type quotetion.manageDiscount: Short
        :param quotetion.taxPrice: 税金
        :type quotetion.taxPrice: Long
        :param quotetion.taxRate: 税金比例
        :type quotetion.taxRate: Integer
        :param quotetion.taxDiscount: 税金折扣
        :type quotetion.taxDiscount: Short
        :param quotetion.costPrice: 成本金额
        :type quotetion.costPrice: Long
        :param quotetion.totalPrice: 报价总额
        :type quotetion.totalPrice: Long
        
        :param functionAreaIds[n]: 功能区ID列表 , 每条数据类型 Long
        :type functionAreaIds[n]: List
        
        Example::
        
            {
                "quotetion.qid": 1,
                "quotetion.basePrice": 0,
                "quotetion.undisPrice": 10000,
                "quotetion.disPrice": 10000,
                "quotetion.discount": 900,
                "quotetion.trafficPrice": 0,
                "quotetion.trafficRate": 200,
                "quotetion.trafficDiscount": 0,
                "quotetion.managePrice": 0,
                "quotetion.manageRate": 10035,
                "quotetion.manageDiscount": 0,
                "quotetion.taxPrice": 0,
                "quotetion.taxRate": 10035,
                "quotetion.taxDiscount": 0,
                "quotetion.costPrice": 0,
                "quotetion.totalPrice": 10000,
                
                "functionAreaIds[0]": 1,
                "functionAreaIds[1]": 2,
            }
            
                |Returns:|
                - **quotetionFunctionAreas**: 功能区信息列表 , 每条数据类型 *quotetionFunctionArea*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "quotetionFunctionAreas": [
                    {
                        "qfaid": 1,
                        "qid": 1,
                        "name": "门厅",
                        "sort": 1,
                        "type": 1,
                        "quotetionFunctionAreaItems": [
                            {
                                "qfaiid": 1,
                                "qfaid": 1,
                                "qiid": 0,
                                "name": "报价项",
                                "measurementUnit": "",
                                "discount": 0,
                                "num": 1,
                                "type": 2,
                                "unitPrice": 100,
                                "workType": "木工",
                                "content": ""
                            }
                        ]
                    }
                ],
                ...
            }
            
    ### <I> updateQuotetionFunctionArea

        更新功能区信息
        
        判断功能区是否存在 , 不存在 , 错误信息 **200010 功能区不存在**
        
                |Requests:|
                :param quotetion.qid: 报价ID
        :type quotetion.qid: Long
        :param quotetion.basePrice: 基数
        :type quotetion.basePrice: Long
        :param quotetion.undisPrice: 不打折项总额
        :type quotetion.undisPrice: Long
        :param quotetion.disPrice: 打折项总额
        :type quotetion.disPrice: Long
        :param quotetion.discount: 折扣
        :type quotetion.discount: Long
        :param quotetion.trafficPrice: 车运费
        :type quotetion.trafficPrice: Long
        :param quotetion.trafficRate: 车运费比例
        :type quotetion.trafficRate: Integer
        :param quotetion.trafficDiscount: 车运费折扣
        :type quotetion.trafficDiscount: Short
        :param quotetion.managePrice: 管理费
        :type quotetion.managePrice: Long
        :param quotetion.manageRate: 管理费比例
        :type quotetion.manageRate: Integer
        :param quotetion.manageDiscount: 管理费折扣
        :type quotetion.manageDiscount: Short
        :param quotetion.taxPrice: 税金
        :type quotetion.taxPrice: Long
        :param quotetion.taxRate: 税金比例
        :type quotetion.taxRate: Integer
        :param quotetion.taxDiscount: 税金折扣
        :type quotetion.taxDiscount: Short
        :param quotetion.costPrice: 成本总额
        :type quotetion.costPrice: Long
        :param quotetion.totalPrice: 报价总额
        :type quotetion.totalPrice: Long
        
        :param quotetionFunctionArea.qfaid: 功能区ID
        :type quotetionFunctionArea.qfaid: Long
        :param quotetionFunctionArea.name: 功能区名称
        :type quotetionFunctionArea.name: String
        :param quotetionFunctionArea.sort: 功能区排序
        :type quotetionFunctionArea.sort: Integer
            
        Example::
        
            {
                "quotetion.qid": 1,
                "quotetion.basePrice": 0,
                "quotetion.undisPrice": 10000,
                "quotetion.disPrice": 10000,
                "quotetion.discount": 900,
                "quotetion.trafficPrice": 0,
                "quotetion.trafficRate": 200,
                "quotetion.trafficDiscount": 0,
                "quotetion.managePrice": 0,
                "quotetion.manageRate": 10035,
                "quotetion.manageDiscount": 0,
                "quotetion.taxPrice": 0,
                "quotetion.taxRate": 10035,
                "quotetion.taxDiscount": 0,
                "quotetion.costPrice": 0,
                "quotetion.totalPrice": 10000,
                
                "quotetionFunctionArea.qfaid": 2,
                "quotetionFunctionArea.name": "门厅",
                "quotetionFunctionArea.sort": 2,
            }
            
    ### <I> deleteQuotetionFunctionArea

        删除功能区信息 , 功能区中包含的报价项信息一同删除
        
                |Requests:|
                :param quotetion.qid: 报价ID
        :type quotetion.qid: Long
        :param quotetion.basePrice: 基数
        :type quotetion.basePrice: Long
        :param quotetion.undisPrice: 不打折项总额
        :type quotetion.undisPrice: Long
        :param quotetion.disPrice: 打折项总额
        :type quotetion.disPrice: Long
        :param quotetion.discount: 折扣
        :type quotetion.discount: Long
        :param quotetion.trafficPrice: 车运费
        :type quotetion.trafficPrice: Long
        :param quotetion.trafficRate: 车运费比例
        :type quotetion.trafficRate: Integer
        :param quotetion.trafficDiscount: 车运费折扣
        :type quotetion.trafficDiscount: Short
        :param quotetion.managePrice: 管理费
        :type quotetion.managePrice: Long
        :param quotetion.manageRate: 管理费比例
        :type quotetion.manageRate: Integer
        :param quotetion.manageDiscount: 管理费折扣
        :type quotetion.manageDiscount: Short
        :param quotetion.taxPrice: 税金
        :type quotetion.taxPrice: Long
        :param quotetion.taxRate: 税金比例
        :type quotetion.taxRate: Integer
        :param quotetion.taxDiscount: 税金折扣
        :type quotetion.taxDiscount: Short
        :param quotetion.costPrice: 成本总额
        :type quotetion.costPrice: Long
        :param quotetion.totalPrice: 报价总额
        :type quotetion.totalPrice: Long
        
        :param quotetionFunctionArea.qfaid: 功能区ID
        :type quotetionFunctionArea.qfaid: Long
        
        
        Example::
        
            {
                "quotetion.qid": 1,
                "quotetion.basePrice": 0,
                "quotetion.undisPrice": 10000,
                "quotetion.disPrice": 10000,
                "quotetion.discount": 900,
                "quotetion.trafficPrice": 0,
                "quotetion.trafficRate": 200,
                "quotetion.trafficDiscount": 0,
                "quotetion.managePrice": 0,
                "quotetion.manageRate": 10035,
                "quotetion.manageDiscount": 0,
                "quotetion.taxPrice": 0,
                "quotetion.taxRate": 10035,
                "quotetion.taxDiscount": 0,
                "quotetion.costPrice": 0,
                "quotetion.totalPrice": 10000,
                
                "quotetionFunctionArea.qfaid": 2
            }
            
### 功能区-预报项

功能区中报价项信息管理

## api.quotetion.QuotetionFunctionAreaItemAction

        |DataType:|
        #### quotetionFunctionAreaItem

    - **qfaiId**: 报价项ID
      - 类型: *Long*
    - **qfaid**: 所属功能区ID
      - 类型: *Long*
    - **qiid**: 引用报价项ID
      - 类型: *Long*
    - **name**: 报价项名
      - 类型: *String*
    - **unitPrice**: 单价
      - 类型: *Integer*
    - **index**: 索引
      - 类型: *Integer*
    - **formula**: 公式
      - 类型: *String*
    - **num**: 工程量
      - 类型: *Integer*
    - **type**: 类型 , 0: 标准 , 1: 自定义 , 2: 车运 , 3: 管理 , 4: 不计 , 5: 成本
      - 类型: *Short*
    - **subtype**: 子类 , 0: 其他 , 1: 工程 , 2: 主材 , 3: 套餐 , 4: 家具 , 5: 电器 , 6: 灯具 , 7: 软装
      - 类型: *Short*
    - **measurementUnit**: 单位
      - 类型: *String*
    - **workType**: 工种
      - 类型: *String*
    - **discount**: 折扣标识 , 0: 不打折 , 1: 打折
      - 类型: *Short*
    - **content**: 说明
      - 类型: *String*
    
    ### <I> updateQuotetionFunctionAreaItem

        更新报价项信息 , 若无信息则为创建报价项信息
        
        标准报价项 , 需要引用报价项ID信息 , 其他信息直接赋值
        
        自定义报价项 , 引用报价项ID为NULL , 其他信息直接赋值
        
        判断报价是否存在 , 不存在 错误信息 **200013 报价项不存在**
        
        判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 **200030 报价状态不可操作**
        
                |Requests:|
                :param quotetion.qid: 报价ID
        :type quotetion.qid: Long
        :param quotetion.basePrice: 基数
        :type quotetion.basePrice: Long
        :param quotetion.undisPrice: 不打折项总额
        :type quotetion.undisPrice: Long
        :param quotetion.disPrice: 打折项总额
        :type quotetion.disPrice: Long
        :param quotetion.discount: 折扣
        :type quotetion.discount: Long
        :param quotetion.trafficPrice: 车运费
        :type quotetion.trafficPrice: Long
        :param quotetion.trafficRate: 车运费比例
        :type quotetion.trafficRate: Integer
        :param quotetion.trafficDiscount: 车运费折扣
        :type quotetion.trafficDiscount: Short
        :param quotetion.managePrice: 管理费
        :type quotetion.managePrice: Long
        :param quotetion.manageRate: 管理费比例
        :type quotetion.manageRate: Integer
        :param quotetion.manageDiscount: 管理费折扣
        :type quotetion.manageDiscount: Short
        :param quotetion.taxPrice: 税金
        :type quotetion.taxPrice: Long
        :param quotetion.taxRate: 税金比例
        :type quotetion.taxRate: Integer
        :param quotetion.taxDiscount: 税金折扣
        :type quotetion.taxDiscount: Short
        :param quotetion.costPrice: 成本总额
        :type quotetion.costPrice: Long
        :param quotetion.totalPrice: 报价总额
        :type quotetion.totalPrice: Long
        
        :param quotetionFunctionAreaItem.qfaiId: 报价项ID
        :type quotetionFunctionAreaItem.qfaiId: Long
        :param quotetionFunctionAreaItem.qfaid: 所属功能区ID
        :type quotetionFunctionAreaItem.qfaid: Long
        :param quotetionFunctionAreaItem.qiid: 引用报价项ID
        :type quotetionFunctionAreaItem.qiid: Long
        
        :param quotetionFunctionAreaItem.name: 报价项名
        :type quotetionFunctionAreaItem.name: String
        :param quotetionFunctionAreaItem.unitPrice: 单价
        :type quotetionFunctionAreaItem.unitPrice: Integer
        :param quotetionFunctionAreaItem.index: 索引
        :type quotetionFunctionAreaItem.index: Integer
        :param quotetionFunctionAreaItem.formula: 公式
        :type quotetionFunctionAreaItem.formula: String
        :param quotetionFunctionAreaItem.num: 工程量
        :type quotetionFunctionAreaItem.num: Integer
        :param quotetionFunctionAreaItem.type: 类型 , 0: 标准报价项 , 1: 自定义报价项
        :type quotetionFunctionAreaItem.type: Short
        :param quotetionFunctionAreaItem.subtype: 子类
        :type quotetionFunctionAreaItem.subtype: Short
        :param quotetionFunctionAreaItem.measurementUnit: 单位
        :type quotetionFunctionAreaItem.measurementUnit: String
        :param quotetionFunctionAreaItem.workType: 工种
        :type quotetionFunctionAreaItem.workType: String
        :param quotetionFunctionAreaItem.discount: 折扣标识 , 0: 不打折 , 1: 打折
        :type quotetionFunctionAreaItem.discount: Short
        :param quotetionFunctionAreaItem.content: 说明
        :type quotetionFunctionAreaItem.content: String

        Example::
        
            {
                "quotetion.qid": 1,
                "quotetion.basePrice": 0,
                "quotetion.undisPrice": 10000,
                "quotetion.disPrice": 10000,
                "quotetion.discount": 900,
                "quotetion.trafficPrice": 0,
                "quotetion.trafficRate": 200,
                "quotetion.trafficDiscount": 0,
                "quotetion.managePrice": 0,
                "quotetion.manageRate": 10035,
                "quotetion.manageDiscount": 0,
                "quotetion.taxPrice": 0,
                "quotetion.taxRate": 10035,
                "quotetion.taxDiscount": 0,
                "quotetion.costPrice": 0,
                "quotetion.totalPrice": 10000,
                
                "quotetionFunctionAreaItem.qfaid": 1,
                "quotetionFunctionAreaItem.qiid": null,
                "quotetionFunctionAreaItem.name": "整体墙棚面砂纸打磨处理",
                "quotetionFunctionAreaItem.index": 1,
                "quotetionFunctionAreaItem.formula": "1+1",
                "quotetionFunctionAreaItem.num": 5,
                "quotetionFunctionAreaItem.type": 0,
                "quotetionFunctionAreaItem.subtype": 0,
                "quotetionFunctionAreaItem.unitPrice": 2,
                "quotetionFunctionAreaItem.workType": "油",
                "quotetionFunctionAreaItem.measurementUnit": "平方米",
                "quotetionFunctionAreaItem.discount": 1,
                "quotetionFunctionAreaItem.content": ""
            }

                |Returns:|
                - **quotetionFunctionAreaItem**: 报价项信息 , 类型 *quotetionFunctionAreaItem*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "quotetionFunctionAreaItem": {
                    "qfaiid": 1,
                    "qfaid": 1,
                    "qiid": 0,
                    "name": "整体墙棚面砂纸打磨处理",
                    "index": 1,
                    "formula": "1+1",
                    "num": 5,
                    "type": 0,
                    "subtype": 0,
                    "unitPrice": 2,
                    "workType": "油",
                    "measurementUnit": "平方米",
                    "discount": 1,
                    "content": null,
                },
                ...
            }

    ### <I> updateQuotetionFunctionAreaItemForIndex

        更新报价项排序索引
        
        更新过程只能够在同一个功能区中的两个索引之间完成
        
        利用功能区定位报价项归属表
        
        报价项获取失败或无报价项 , 不进行更新动作
        
        判断功能区是否存在 , 不存在 , 错误信息 **200012 功能区不存在**
        
                |Requests:|
                :param quotetionFunctionArea.qfaid: 功能区ID
        :type quotetionFunctionArea.qfaid: Long
        :param quotetionFunctionAreaItems[n].qfaiId: 报价项ID
        :type quotetionFunctionAreaItems[n].qfaiId: Long
        :param quotetionFunctionAreaItems[n].index: 索引
        :type quotetionFunctionAreaItems[n].index: Short
        
        Example::
        
            {
                "quotetionFunctionArea.qfaid": 1,
                "quotetionFunctionAreaItems[0].qfaiId": 1,
                "quotetionFunctionAreaItems[0].index": 1,
                "quotetionFunctionAreaItems[1].qfaiId": 2,
                "quotetionFunctionAreaItems[1].index": 2
            }

    ### <I> updateQuotetionFunctionAreaItemForSpec

        通过报价ID以及报价项类型更新报价项单价信息 , 只能适用类型为2:车运费和3:管理费的项目
        
        判断报价是否存在 , 不存在 , 错误信息 **200013 报价项不存在**
        
                |Requests:|
                :param quotetion.qid: 报价ID
        :type quotetion.qid: Long
        :param quotetion.basePrice: 基数
        :type quotetion.basePrice: Long
        :param quotetion.undisPrice: 不打折项总额
        :type quotetion.undisPrice: Long
        :param quotetion.disPrice: 打折项总额
        :type quotetion.disPrice: Long
        :param quotetion.discount: 折扣
        :type quotetion.discount: Long
        :param quotetion.trafficPrice: 车运费
        :type quotetion.trafficPrice: Long
        :param quotetion.trafficRate: 车运费比例
        :type quotetion.trafficRate: Integer
        :param quotetion.trafficDiscount: 车运费折扣
        :type quotetion.trafficDiscount: Short
        :param quotetion.managePrice: 管理费
        :type quotetion.managePrice: Long
        :param quotetion.manageRate: 管理费比例
        :type quotetion.manageRate: Integer
        :param quotetion.manageDiscount: 管理费折扣
        :type quotetion.manageDiscount: Short
        :param quotetion.taxPrice: 税金
        :type quotetion.taxPrice: Long
        :param quotetion.taxRate: 税金比例
        :type quotetion.taxRate: Integer
        :param quotetion.taxDiscount: 税金折扣
        :type quotetion.taxDiscount: Short
        :param quotetion.costPrice: 成本总额
        :type quotetion.costPrice: Long
        :param quotetion.totalPrice: 报价总额
        :type quotetion.totalPrice: Long
        
        :param quotetionFunctionAreaItem.qfaiid: 报价项ID
        :type quotetionFunctionAreaItem.qfaiid: Long
        :param quotetionFunctionAreaItem.unitPrice: 单价
        :type quotetionFunctionAreaItem.unitPrice: Integer

        Example::
        
            {
                "quotetion.qid": 1,
                "quotetion.basePrice": 0,
                "quotetion.undisPrice": 10000,
                "quotetion.disPrice": 10000,
                "quotetion.discount": 900,
                "quotetion.trafficPrice": 0,
                "quotetion.trafficRate": 200,
                "quotetion.trafficDiscount": 0,
                "quotetion.managePrice": 0,
                "quotetion.manageRate": 10035,
                "quotetion.manageDiscount": 0,
                "quotetion.taxPrice": 0,
                "quotetion.taxRate": 10035,
                "quotetion.taxDiscount": 0,
                "quotetion.costPrice": 0,
                "quotetion.totalPrice": 10000,
                
                "quotetionFunctionAreaItem.qfaiid": 1,
                "quotetionFunctionAreaItem.unitPrice": 200
            }
            
    ### <I> deleteQuotetionFunctionAreaItem

        删除报价项信息
        
        利用功能区定位报价项归属表
        
        判断报价是否存在 , 不存在 错误信息 **200013 报价项不存在**
        
        判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 **200030 报价状态不可操作**
        
                |Requests:|
                :param quotetion.qid: 报价ID
        :type quotetion.qid: Long
        :param quotetion.basePrice: 基数
        :type quotetion.basePrice: Long
        :param quotetion.undisPrice: 不打折项总额
        :type quotetion.undisPrice: Long
        :param quotetion.disPrice: 打折项总额
        :type quotetion.disPrice: Long
        :param quotetion.discount: 折扣
        :type quotetion.discount: Long
        :param quotetion.trafficPrice: 车运费
        :type quotetion.trafficPrice: Long
        :param quotetion.trafficRate: 车运费比例
        :type quotetion.trafficRate: Integer
        :param quotetion.trafficDiscount: 车运费折扣
        :type quotetion.trafficDiscount: Short
        :param quotetion.managePrice: 管理费
        :type quotetion.managePrice: Long
        :param quotetion.manageRate: 管理费比例
        :type quotetion.manageRate: Integer
        :param quotetion.manageDiscount: 管理费折扣
        :type quotetion.manageDiscount: Short
        :param quotetion.taxPrice: 税金
        :type quotetion.taxPrice: Long
        :param quotetion.taxRate: 税金比例
        :type quotetion.taxRate: Integer
        :param quotetion.taxDiscount: 税金折扣
        :type quotetion.taxDiscount: Short
        :param quotetion.costPrice: 成本总额
        :type quotetion.costPrice: Long
        :param quotetion.totalPrice: 报价总额
        :type quotetion.totalPrice: Long
        
        :param quotetionFunctionArea.qfaid: 功能区ID
        :type quotetionFunctionArea.qfaid: Long
        - **qfaiIds**: 报价项ID列表 , 每条数据类型 Long
          - 类型: *List*
        
        Example::
        
            {
                "quotetion.qid": 1,
                "quotetion.basePrice": 0,
                "quotetion.undisPrice": 10000,
                "quotetion.disPrice": 10000,
                "quotetion.discount": 900,
                "quotetion.trafficPrice": 0,
                "quotetion.trafficRate": 200,
                "quotetion.trafficDiscount": 0,
                "quotetion.managePrice": 0,
                "quotetion.manageRate": 10035,
                "quotetion.manageDiscount": 0,
                "quotetion.taxPrice": 0,
                "quotetion.taxRate": 10035,
                "quotetion.taxDiscount": 0,
                "quotetion.costPrice": 10000,
                "quotetion.totalPrice": 10000,
                
                "quotetionFunctionArea.qfaid": 1,
                "qfaiIds[0]": 1,
                "qfaiIds[1]": 2
            }
            

## 预签

折扣 = (起报价 - 优惠) / (起报价) 
管理费 = (起报价 - 减项 - 优惠) * 管理费比例
总价 = 起报价 + 管理费 + 额外功能区 - 减项 + 增项 + 赋能

### 预签

## api.quotation.ProtationAction

        |DataType:|
        #### protation

    - **pid**: 预签ID
      - 类型: *Long*
    - **ppid**: 预签产品ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **decoration**: 装修单 , 类型: [decoration](./decoration.html#api.data.DecorationAction.decoration)
      - 类型: *Object*
    - **version**: 报价版本 , 类型 [quotationVersion](./data.html#api.data.QuotationVersionAction.quotationVersion)
      - 类型: *Object*
    - **product**: 产品名称
      - 类型: *String*
    - **name**: 名称
      - 类型: *名称*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **quotePrice**: 起报价
      - 类型: *Long*
    - **quoteArea**: 起报面积
      - 类型: *Integer*
    - **preferPrice**: 优惠额
      - 类型: *Long*
    - **managePrice**: 管理优惠
      - 类型: *Long*
    - **advancePrice**: 特殊优惠
      - 类型: *Long*
    - **unitPrice**: 计价单价
      - 类型: *Long*
    - **manageFormula**: 管理公式
      - 类型: *String*
    - **managePrice**: 管理费
      - 类型: *Long*
    - **costPrice**: 成本单价
      - 类型: *Long*
    - **mostPrice**: 主材成本
      - 类型: *Long*
    - **profitRate**: 利润率
      - 类型: *Integer*
    - **costRate**: 工程增项成本比例
      - 类型: *Integer*
    - **mostRate**: 主材增项成本比例
      - 类型: *Integer*
    - **basicPrice**: 基础额
      - 类型: *Long*
    - **comdPrice**: 工程额
      - 类型: *Long*
    - **commPrice**: 主材额
      - 类型: *Long*
    - **adddPrice**: 增工额
      - 类型: *Long*
    - **addmPrice**: 增主额
      - 类型: *Long*
    - **subcPrice**: 减通额
      - 类型: *Long*
    - **subdPrice**: 减工额
      - 类型: *Long*
    - **submPrice**: 减主额
      - 类型: *Long*
    - **accdPrice**: 赋工额
      - 类型: *Long*
    - **accmPrice**: 赋主额
      - 类型: *Long*
    - **totalPrice**: 总额
      - 类型: *Long*
    - **totalCost**: 成本总额
      - 类型: *Long*
    - **totalProfit**: 利润总额
      - 类型: *Long*
    - **status**: 状态 , 0: 启用 , 1: 禁用 , 2: 锁定
      - 类型: *Short*
    - **defaults**: 默认标识 , 0: 非默认 , 1: 默认
      - 类型: *Short*
    - **comment**: 备注
      - 类型: *String*
    
    ### <I> pageProtation

        分页方式获预签单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 预签单信息列表 , 每条数据类型 *protation*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "pid": 1,
                            "ppid": 1,
                            "orderId": "1601010001",
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
                            "version": {
                                "qvid": 1,
                                "no": "QV001",
                                "name": "test"
                                "comment": "test"
                            },
                            "name": "预签信息",
                            "creater": {
                                "uid": 1,
                                "createrId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师" 
                            },
                            "createTime": "2016-01-01",
                            "quotePrice": 100000,
                            "quoteArea": 1000000,
                            "preferPrice": 1000,
                            "managePrice": 0,
                            "advancePrice": 0,
                            "unitPrice": 100000,
                            "manageFormula": "",
                            "managePrice": 0,
                            "costPrice": 799000,
                            "mostPrice": 20000000,
                            "profitRate": 0,
                            "costRate": 100,
                            "mostRate": 100,
                            "basicPrice": 0,
                            "comdPrice": 0,
                            "commPrice": 0,
                            "adddPrice": 0,
                            "addmPrice": 0,
                            "subcPrice": 0,
                            "subdPrice": 0,
                            "submPrice": 0,
                            "accdPrice": 0,
                            "accmPrice": 0,
                            "totalPrice": 0,
                            "totalCost": 0,
                            "totalProfit": 0,
                            "status": 0,
                            "defaults": 0,
                            "comment": "备注"
                        },
                    ],
                    ...
                },
                ...
            }
    
    ### <I> queryProtationByOrderId

        通过装修单号查询预签信息
    
                |Requests:|
                :param protation.orderId: 装修单号
        :type protation.orderId: String
        
        Example::
        
            {
                "protation.orderId": "1601010001"
            }
        
                |Returns:|
                - **protations**: 预签信息列表 , 每条数据类型 *protation*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "protations": [
                    {
                        "pid": 1,
                        "ppid": 1,
                        "orderId": "1601010001",
                        "name": "预签信息",
                        "version": {
                            "qvid": 1,
                            "no": "QV001",
                            "name": "test"
                            "comment": "test"
                        },
                        "creater": {
                            "uid": 1,
                            "createrId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师" 
                        },
                        "createTime": "2016-01-01",
                        "quotePrice": 100000,
                        "quoteArea": 1000000,
                        "preferPrice": 1000,
                        "managePrice": 0,
                        "advancePrice": 0,
                        "unitPrice": 100000,
                        "manageFormula": "",
                        "managePrice": 0,
                        "costPrice": 799000,
                        "mostPrice": 20000000,
                        "profitRate": 0,
                        "costRate": 100,
                        "mostRate": 100,
                        "basicPrice": 0,
                        "comdPrice": 0,
                        "commPrice": 0,
                        "adddPrice": 0,
                        "addmPrice": 0,
                        "subcPrice": 0,
                        "subdPrice": 0,
                        "submPrice": 0,
                        "accdPrice": 0,
                        "accmPrice": 0,
                        "totalPrice": 0,
                        "totalCost": 0,
                        "totalProfit": 0,
                        "status": 0,
                        "defaults": 0,
                        "comment": "备注"
                    }
                ],
                ...
            }
    
    ### <I> queryProtationForDefaultByOrderId

        通过装修单号获取默认预签信息
    
                |Requests:|
                :param protation.orderId: 装修单号
        :type protation.orderId: String
        
        Example::
        
            {
                "protation.orderId": "1601010001"
            }
        
                |Returns:|
                - **protation**: 预签信息 , 类型 *protation*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "protation": {
                    "pid": 1,
                    "ppid": 1,
                    "orderId": "1601010001",
                    "name": "预签信息",
                    "version": {
                        "qvid": 1,
                        "no": "QV001",
                        "name": "test"
                        "comment": "test"
                    },
                    "creater": {
                        "uid": 1,
                        "createrId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师" 
                    },
                    "createTime": "2016-01-01",
                    "quotePrice": 100000,
                    "quoteArea": 1000000,
                    "preferPrice": 1000,
                    "managePrice": 0,
                    "advancePrice": 0,
                    "unitPrice": 100000,
                    "manageFormula": "",
                    "managePrice": 0,
                    "costPrice": 799000,
                    "mostPrice": 20000000,
                    "profitRate": 0,
                    "costRate": 100,
                    "mostRate": 100,
                    "basicPrice": 0,
                    "comdPrice": 0,
                    "commPrice": 0,
                    "adddPrice": 0,
                    "addmPrice": 0,
                    "subcPrice": 0,
                    "subdPrice": 0,
                    "submPrice": 0,
                    "accdPrice": 0,
                    "accmPrice": 0,
                    "totalPrice": 0,
                    "totalCost": 0,
                    "totalProfit": 0,
                    "status": 0,
                    "defaults": 0,
                    "comment": "备注"
                }
                ...
            }
    
    ### <I> queryProtationByPid

        通过预签ID获取预签信息
    
                |Requests:|
                :param protation.pid: 预签ID
        :type protation.pid: Long
        
        Example::
        
            {
                "protation.pid": 1
            }
        
                |Returns:|
                - **protation**: 预签信息 , 类型 *protation*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "protation": {
                    "pid": 1,
                    "ppid": 1,
                    "orderId": "1601010001",
                    "name": "预签信息",
                    "version": {
                        "qvid": 1,
                        "no": "QV001",
                        "name": "test"
                        "comment": "test"
                    },
                    "creater": {
                        "uid": 1,
                        "createrId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师" 
                    },
                    "createTime": "2016-01-01",
                    "quotePrice": 100000,
                    "quoteArea": 1000000,
                    "preferPrice": 1000,
                    "managePrice": 0,
                    "advancePrice": 0,
                    "unitPrice": 100000,
                    "manageFormula": "",
                    "managePrice": 0,
                    "costPrice": 799000,
                    "mostPrice": 20000000,
                    "profitRate": 0,
                    "costRate": 100,
                    "mostRate": 100,
                    "basicPrice": 0,
                    "comdPrice": 0,
                    "commPrice": 0,
                    "adddPrice": 0,
                    "addmPrice": 0,
                    "subcPrice": 0,
                    "subdPrice": 0,
                    "submPrice": 0,
                    "accdPrice": 0,
                    "accmPrice": 0,
                    "totalPrice": 0,
                    "totalCost": 0,
                    "totalProfit": 0,
                    "status": 0,
                    "defaults": 0,
                    "comment": "备注"
                }
                ...
            }
    
    ### <I> addProtation

        创建预签信息
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**
        
        判断装修单状态是否为0(初始)/1(定金) , 其他状态 , 错误信息 **200047 预签不可操作**
        
        判断预签数量是否已经达到上限 , 错误信息 **200048 预签数量达到上限**
        
                |Requests:|
                :param protation.ppid: 预签产品ID
        :type protation.ppid: String
        :param protation.orderId: 装修单号
        :type protation.orderId: String
        :param protation.name: 名称
        :type protation.name: String
        :param protation.comment: 备注
        :type protation.comment: String
        
        Example::
        
            {
                "protation.ppid": 1,
                "protation.orderId": "1601010001",
                "protation.name": "预签信息",
                "protation.comment": "备注"
            }
    
    ### <I> updateProtation

        更新预签信息
        
        判断预签信息是否存在 , 不存在 , 错误信息 **200046 预签不存在**
        
        判断预签信息状态是否为0(启用) , 其他状态 , 错误信息 **200047 预签不可操作**
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**
        
        判断装修单状态是否为0(初始)/1(定金) , 其他状态 , 错误信息 **200047 预签不可操作**
        
                |Requests:|
                :param protation.pid: 预签ID
        :type protation.pid: Long
        :param protation.name: 名称
        :type protation.name: String
        :param protation.version.qvid: 报价版本ID
        :type protation.version.qvid: Long
        :param protation.comment: 备注
        :type protation.comment: String
        
        Example::
        
            {
                "protation.pid": 1,
                "protation.name": "预签信息",
                "protation.version.qvid": 1,
                "protation.comment": "备注"
            }

    ### <I> updateProtationForAdvance

        更新预签信息
        
        判断预签信息是否存在 , 不存在 , 错误信息 **200046 预签不存在**
        
        判断预签信息状态是否为0(启用) , 其他状态 , 错误信息 **200047 预签不可操作**
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**
        
        判断装修单状态是否为0(初始)/1(定金) , 其他状态 , 错误信息 **200047 预签不可操作**
        
                |Requests:|
                :param protation.pid: 预签ID
        :type protation.pid: Long
        :param protation.basicPrice: 基础额
        :type protation.basicPrice: Long
        :param protation.profitPrice: 优惠额
        :type protation.profitPrice: Long
        :param protation.manageProfit: 管理优惠
        :type protation.manageProfit: Long
        :param protation.advanceProfit: 特殊优惠
        :type protation.advanceProfit: Long
        :param protation.managePrice: 管理费
        :type protation.managePrice: Long
        :param protation.comdPrice: 工程额
        :type protation.comdPrice: Long
        :param protation.commPrice: 主材额
        :type protation.commPrice: Long
        :param protation.adddPrice: 增工额
        :type protation.adddPrice: Long
        :param protation.addmPrice: 增主额
        :type protation.addmPrice: Long
        :param protation.subcPrice: 减通额
        :type protation.subcPrice: Long
        :param protation.subdPrice: 减工额
        :type protation.subdPrice: Long
        :param protation.submPrice: 减主额
        :type protation.submPrice: Long
        :param protation.accdPrice: 减工额
        :type protation.accdPrice: Long
        :param protation.accmPrice: 减主额
        :type protation.accmPrice: Long
        :param protation.totalPrice: 总额
        :type protation.totalPrice: Long
        :param protation.totalCost: 成本总额
        :type protation.totalCost: Long
        :param protation.totalProfit: 利润总额
        :type protation.totalProfit: Long
        
        Example::
        
            {
                "protation.pid": 1,
                "protation.basicPrice": 0,
                "protation.profitPrice": 0,
                "protation.manageProfit": 0,
                "protation.advanceProfit": 0,
                "protation.managePrice": 0,
                "protation.comdPrice": 0,
                "protation.commPrice": 0,
                "protation.adddPrice": 0,
                "protation.addmPrice": 0,
                "protation.subcPrice": 0,
                "protation.subdPrice": 0,
                "protation.submPrice": 0,
                "protation.accdPrice": 0,
                "protation.accmPrice": 0,
                "protation.totalPrice": 0,
                "protation.totalCost": 0,
                "protation.totalProfit": 0
            }

    ### <I> updateProtationForStatus

        更新预签状态
        
        判断预签报价是否存在 , 不存在 , 错误信息 **200046 预签不存在**
        
        判断预签报价状态是否为0(启用) , 其他状态 , 错误信息 **200047 预签不可操作**
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**
        
        判断装修单状态是否为0(初始)/1(定金) , 其他状态 , 错误信息 **200047 预签不可操作**
        
                |Requests:|
                :param protation.pid: 预签ID
        :type protation.pid: Long
        :param protation.status: 名称
        :type protation.status: String
        
        Example::
        
            {
                "protation.pid": 1,
                "protation.status": "预签信息"
            }
    
    ### <I> changeProtationForDefault

        默认预签 , 其他默认重置
        
        判断预签信息是否存在 , 不存在 , 错误信息 **200046 预签不存在**
        
        判断预签报价状态是否为0(启用) , 其他状态 , 错误信息 **200047 预签不可操作**
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**
        
        判断装修单状态是否为0(初始)/1(定金) , 其他状态 , 错误信息 **200047 预签不可操作**
        
                |Requests:|
                :param protation.pid: 预签ID
        :type protation.pid: Long
        
        Example::
        
            {
                "protation.pid": 1
            }

    ### <I> lockProtation

        锁定预签报价
        
        判断预签信息是否存在 , 不存在 , 错误信息 **200046 预签不存在**
        
        锁定状态的预签报价 , 可以进行打印功能 , 以及部分装修单操作限制 , 但不可以再进行编辑
        
        更新预签报价状态为1(锁定)
        
                |Requests:|
                :param protation.pid: 预签报价ID
        :type protation.pid: Long
            
        Example::
        
            {
                "protation.pid": 1
            }
            
    ### <I> unlockProtation

        解锁预签报价
        
        判断预签报价是否存在 , 不存在 错误信息 **200003 报价不存在**
        
        更新预签报价状态为0(启用)
        
                |Requests:|
                :param protation.pid: 报价ID
        :type protation.pid: Long
            
        Example::
        
            {
                "protation.pid": 1
            }
    
    ### <I> deleteProtation

        删除预签
        
        判断预签信息是否存在 , 不存在 , 错误信息 **200046 预签不存在**
        
        判断预签报价状态是否为0(启用) , 其他状态 , 错误信息 **200047 预签不可操作**
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**
        
        判断装修单状态是否为0(初始)/1(定金) , 其他状态 , 错误信息 **200047 预签不可操作**
        
                |Requests:|
                :param protation.pid: 预签ID
        :type protation.pid: Long
        
        Example::
        
            {
                "protation.pid": 1
            }

### 项目
## api.quotation.ProtationItemAction

        |DataType:|
        #### protationItem

    - **piid**: 预签项ID
      - 类型: *Long*
    - **pid**: 预签ID
      - 类型: *Long*
    - **ppiid**: 产品项ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **basicNum**: 基础量
      - 类型: *Integer*
    - **addPrice**: 增补价
      - 类型: *Integer*
    - **price**: 价格
      - 类型: *Integer*
    - **subPrice**: 退减价
      - 类型: *Integer*
    - **cost**: 成本
      - 类型: *Integer*
    - **achePrice**: 业绩
      - 类型: *Integer*
    - **areaCale**: 面积规则 , 0: 数量 , 1: 面积
      - 类型: *Short*
    - **num**: 数量
      - 类型: *Integer*
    - **type**: 类型 , 0: 基础 , 1: 工程 , 2: 主材 , 3: 增工 , 4: 增主 , 5: 减工 , 6: 减主 , 7: 赋工 , 8: 赋主 , 11: 减通
      - 类型: *Short*
    - **onetype**: 一类 , 0: 标准 , 1: 标配 , 2: 标减
      - 类型: *Short*
    - **atttype**: 业务类型 , 0: 通用 , 1: 工程 , 2: 主材
      - 类型: *Short*
    - **content**: 说明
      - 类型: *String*
    
    ### <I> queryProtationItemByPid

        通过预签ID获取预签项
    
                |Requests:|
                :param protationItem.pid: 预签ID
        :type protationItem.pid: Long
        
        Example::
        
            {
                "protationItem.pid": 1
            }
        
                |Returns:|
                - **protationItems**: 预签项信息列表 , 每条数据类型 *protationItem*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "protationItems": [
                    {
                        "piid": 1,
                        "pid": 1,
                        "ppiid": 1,
                        "name": "预签项",
                        "basicNum": 0,
                        "addPrice": 1000,
                        "price": 100000,
                        "subPrice": 1000,
                        "cost": 0,
                        "achePrice": 0,
                        "areaCale": 0,
                        "num": 10000,
                        "type": 0,
                        "onetype": 0,
                        "atttype": 1,
                        "content": "说明"
                    }
                ],
                ...
            }
    
    ### <I> updateProtationItem

        创建/更新预签项
        
        判断预签项是否存在 , 不存在 , 错误信息 **200052 预签项不存在**
        
        判断预签报价状态是否为0(启用) , 其他状态 , 错误信息 **200047 预签不可操作**
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**
        
        判断装修单状态是否为0(初始)/1(定金) , 其他状态 , 错误信息 **200047 预签不可操作**
        
                |Requests:|
                :param protation.pid: 预签ID
        :type protation.pid: Long
        :param protation.basicPrice: 基础额
        :type protation.basicPrice: String
        :param protation.comdPrice: 工程额
        :type protation.comdPrice: String
        :param protation.commPrice: 主材额
        :type protation.commPrice: String
        :param protation.adddPrice: 增工额
        :type protation.adddPrice: String
        :param protation.addmPrice: 增主额
        :type protation.addmPrice: String
        :param protation.subcPrice: 减通额
        :type protation.subcPrice: String
        :param protation.subdPrice: 减工额
        :type protation.subdPrice: String
        :param protation.submPrice: 减主额
        :type protation.submPrice: String
        :param protation.totalPrice: 总额
        :type protation.totalPrice: String
        
        :param protationItem.piid: 预签项ID
        :type protationItem.piid: Long
        :param protationItem.ppiid: 产品项ID
        :type protationItem.ppiid: Long
        :param protationItem.name: 名称
        :type protationItem.name: String
        :param protationItem.basicNum: 基础量
        :type protationItem.basicNum: Integer
        :param protationItem.addPrice: 增补价
        :type protationItem.addPrice: Integer
        :param protationItem.price: 单价
        :type protationItem.price: Integer
        :param protationItem.subPrice: 退减价
        :type protationItem.subPrice: Integer
        :param protationItem.cost: 成本
        :type protationItem.cost: Integer
        :param protationItem.achePrice: 业绩价
        :type protationItem.achePrice: Integer
        :param protationItem.areaCale: 面积规则
        :type protationItem.areaCale: Short
        :param protationItem.num: 数量
        :type protationItem.num: Integer
        :param protationItem.type: 类型
        :type protationItem.type: Short
        :param protationItem.onetype: 一类
        :type protationItem.onetype: Short
        :param protationItem.atttype: 业务类型
        :type protationItem.atttype: Short
        
        Example::
        
            {
                "protation.pid": 1,
                "protation.basicPrice": 0,
                "protation.comdPrice": 0,
                "protation.commPrice": 0,
                "protation.adddPrice": 0,
                "protation.addmPrice": 0,
                "protation.subcPrice": 0,
                "protation.subdPrice": 0,
                "protation.submPrice": 0,
                "protation.totalPrice": 0,
                
                "protationItem.piid": 1,
                "protationItem.ppiid": 1,
                "protationItem.name": "预签项",
                "protationItem.basicNum": 0,
                "protationItem.addPrice": 1000,
                "protationItem.price": 100000,
                "protationItem.subPrice": 1000,
                "protationItem.cost": 0,
                "protationItem.achePrice": 1000,
                "protationItem.areaCale": 0,
                "protationItem.num": 10000,
                "protationItem.type": 0,
                "protationItem.onetype": 0,
                "protationItem.atttype": 1
            }
    
    ### <I> deleteProtationItem

        删除预签项
        
        判断预签项是否存在 , 不存在 , 错误信息 **200052 预签项不存在**
        
        判断预签报价状态是否为0(启用) , 其他状态 , 错误信息 **200047 预签不可操作**
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**
        
        判断装修单状态是否为0(初始)/1(定金) , 其他状态 , 错误信息 **200047 预签不可操作**
        
                |Requests:|
                :param protation.pid: 预签ID
        :type protation.pid: Long
        :param protation.basicPrice: 基础额
        :type protation.basicPrice: String
        :param protation.comdPrice: 工程额
        :type protation.comdPrice: String
        :param protation.commPrice: 主材额
        :type protation.commPrice: String
        :param protation.adddPrice: 增工额
        :type protation.adddPrice: String
        :param protation.addmPrice: 增主额
        :type protation.addmPrice: String
        :param protation.subcPrice: 减通额
        :type protation.subcPrice: String
        :param protation.subdPrice: 减工额
        :type protation.subdPrice: String
        :param protation.submPrice: 减主额
        :type protation.submPrice: String
        :param protation.totalPrice: 总额
        :type protation.totalPrice: String
        
        :param protationItem.piid: 预签项ID
        :type protationItem.piid: Long
        
        Example::
        
            {
                "protation.pid": 1,
                "protation.basicPrice": 0,
                "protation.comdPrice": 0,
                "protation.commPrice": 0,
                "protation.adddPrice": 0,
                "protation.addmPrice": 0,
                "protation.subcPrice": 0,
                "protation.subdPrice": 0,
                "protation.submPrice": 0,
                "protation.totalPrice": 0,
                
                "protationItem.piid": 1
            }

### 成本

基础成本 = 计价面积 * 工程成本(报价)

主材成本 = 主材成本(报价) + ∑((计价面积 - 下限面积(成本)|上线面积 - 下限面积(成本)) * 成本单价(成本))

户型成本 = 基础额(报价)

增项成本 = 增工额(报价) * 增项工程成本比例(报价) + 增主额(报价) * 增项主材成本比例(报价)

利润率 = 1 - (基础成本 + 主材成本 + 户型成本 + 增项成本) / (预签额 - 活动物品总额)

## api.quotation.ProtationCostAction

        |DataType:|
        #### protationCost

    - **pcid**: 成本ID
      - 类型: *Long*
    - **pid**: 预签ID
      - 类型: *Long*
    - **toplimit**: 上限面积
      - 类型: *Integer*
    - **lowlimit**: 下限面积
      - 类型: *Integer*
    - **costPrice**: 成本单价
      - 类型: *Integer*

    ### <I> queryProtationCost

        通过预签产品获取成本信息
        
                |Requests:|
                :param protationCost.pid: 预签产品ID
        :type protationCost.pid: Long
        
        Example::
        
            {
                "protationCost.pid": 1
            }

                |Returns:|
                - **protationCosts**: 预签成本列表 , 类型 *protationCost*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "protationCosts":[
                    {
                        "pcid": 1,
                        "pid": 1,
                        "toplimit": 0,
                        "lowlimit": 0,
                        "costPrice": 0
                    }
                ],
                ...
            }

## 报价

### 报价

装修单报价相关信息管理

折前总额 = ∑打折项 + ∑非打折项

折后总额 = ∑打折项 * 折扣 + ∑非打折项

车运费 = (∑打折项 + ∑非打折项) * 车运费比例 * (车运费折扣 * 折扣)

管理费 = (∑打折项 + ∑非打折项 + 车运费) * 管理费比例

半包工程额 = (∑打折项 + 车运费) * 折扣 + ∑非打折项 + ∑拓展项 + ∑增项 - ∑打折减项 * 折扣 - ∑非打折减项 - ∑拓展减项

套餐工程额 = (∑打折项 + 车运费) * 折扣 + ∑非打折项 + ∑拓展项 + ∑增项 - ∑非增减项 * 0 - ∑增项减项 - ∑拓展减项

半价/满减基础 = ((∑打折项 + ∑非打折项 + 车运费) - (∑打折项 + ∑非打折项 + 车运费) % 基数) * 折扣 + (∑打折项 + ∑非打折项 + 车运费) % 基数

半价/满减工程额 = 半价/满减基础 + ∑拓展项 + ∑增项 - ∑报价减项 * 折扣 - ∑增项减项 - ∑拓展减项

报价额 = 工程额 + 管理费

---------------------------------------------

打折项总额 = ∑打折项 * 折扣

非打折项独立总额 = ∑非打折项 * (非打折独立折扣 * 折扣)
非打折项基数总额 = ∑非打折项 * (非打折基数折扣 * 折扣)

车运费 = (∑打折项 + ∑非打折项) * 车运费比例
独立车运费 = 车运费 * (车运费独立折扣 * 折扣)
基数车运费 = 车运费 * (车运费基数折扣 * 折扣)

管理费 = (∑打折项 + ∑非打折项 + 车运费) * 管理费比例
独立管理费 = 管理费 * (管理费独立折扣 * 折扣)
基数管理费 = 管理费 * (管理费基数折扣 * 折扣)

管理税金 = (∑打折项 + ∑非打折项 + 车运费) * 税金比例 * 管理费税金折扣

基数总额 = 打折项总额 + 非打折项基数总额 + 基数车运费 + 基数管理费

工程总额 = ((基数总额 - 基数总额 % 基数) * 折扣 + 基数总额 % 基数 + 非打折项独立总额 + 独立车运费 + 独立管理费 + 管理税金) * (1 + 税金比例 * 总额税金折扣)
工程总额 = (基数总额 * 折扣 + (基数总额 % 基数 * (1 - 折扣)) + 非打折项独立总额 + 独立车运费 + 独立管理费 + 管理税金) * (1 + 税金比例 * 总额税金折扣)

基本参数 , ∑打折项 , ∑非打折项 , 基数 , 折扣 , 车运费折扣 , 车运费比例 , 管理费折扣 , 管理费比例 , 税金折扣 , 税金比例

车运费折扣 , 0: 不打折 , 1: 独立折扣 , 2: 基数折扣
管理费折扣 , 0: 不打折 , 1: 独立折扣 , 2: 基数折扣
税金折扣 , 0: 管理费 , 1: 总额

## api.quotation.QuotationAction

        |DataType:|
        #### quotation

    - **qid**: 报价ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **decoration**: 装修单 , 类型: [decoration](./decoration.html#api.data.DecorationAction.decoration)
      - 类型: *Object*
    - **name**: 报价名称
      - 类型: *String*
    - **style**: 风格
      - 类型: *String*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **updateTime**: 更新时间
      - 类型: *Timestamp*
    - **version**: 报价版本 , 类型 [quotationVersion](./data.html#api.data.QuotationVersionAction.quotationVersion)
      - 类型: *Object*
    - **basePrice**: 基数 , 满减类型计算参数
      - 类型: *Long*
    - **undisPrice**: 不打折项总额 = ∑(工程量 * 不打折项折前单价)
      - 类型: *Long*
    - **disPrice**: 打折项总额 = ∑(工程量 * 打折项折前总价)
      - 类型: *Long*
    - **consPrice**: 工程总额
      - 类型: *Long*
    - **comsPrice**: 主材总额
      - 类型: *Long*
    - **discount**: 折扣
      - 类型: *Long*
    - **trafficPrice**: 车运费
      - 类型: *Long*
    - **trafficRate**: 车运费比例
      - 类型: *Integer*
    - **trafficDiscount**: 车运费折扣 , 0: 不打折 1: 打折
      - 类型: *Short*
    - **managePrice**: 管理费
      - 类型: *Long*
    - **manageRate**: 管理费比例
      - 类型: *Integer*
    - **manageDiscount**: 管理费折扣 , 0: 不打折 1: 打折
      - 类型: *Short*
    - **taxPrice**: 税金
      - 类型: *Long*
    - **taxRate**: 税金比例
      - 类型: *Integer*
    - **taxDiscount**: 税金折扣
      - 类型: *Short*
    - **unachePrice**: 非业绩总额
      - 类型: *Long*
    - **costPrice**: 成本总额
      - 类型: *Long*
    - **totalPrice**: 报价总额
      - 类型: *Long*
    - **worktime**: 制作计时
      - 类型: *Integer*
    - **auditime**: 审核计时
      - 类型: *Integer*
    - **status**: 状态 , 0: 初始 , 1: 锁定
      - 类型: *Short*
    - **defaults**: 默认标识 , 0: 非默认 , 1: 默认
      - 类型: *Short*
    - **attstatus**: 业务状态 , 0: 初始 , 1: 制作 , 2: 审批 , 3: 完成
      - 类型: *Short*
    - **content**: 说明
      - 类型: *String*
    
    ### <I> pageQuotation

        分页方式获报价信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 报价单信息列表 , 每条数据类型 *quotation*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "qid": 1,
                            "orderId": "1601010001",
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
                            "name": "现代",
                            "creater": {
                                "uid": 1,
                                "createrId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师" 
                            },
                            "createTime": "2016-01-01",
                            "updateTime": "2016-01-01",
                            "style": "现代简约",
                            "discount": 9,
                            "houseArea": null,
                            "notSalesmanRate": 0,
                            "basePrice": 0,
                            "undisPrice": 90154,
                            "disPrice": 90154,
                            "trafficPrice": 7800,
                            "trafficRate": 200,
                            "trafficDiscount": 0,
                            "managePrice": 11154,
                            "manageRate": 100,
                            "manageDiscount": 0,
                            "taxPrice": 0,
                            "taxRate": 0,
                            "taxDiscount": 0,
                            "unachePrice": 0,
                            "costPrice": 0,
                            "totalPrice": 90154,
                            "worktime": 0,
                            "auditime": 0,
                            "status": 0,
                            "attstatus": 0,
                            "content": ""
                        },
                    ],
                    ...
                },
                ...
            }
    
    ### <I> queryQuotationByOrderId

        通过装修单号查询报价信息
        
                |Requests:|
                :param quotation.orderId: 装修单号
        :type quotation.orderId: String
        
        Example::
        
            {
                "quotation.orderId": "1601010001"
            }
            
                |Returns:|
                - **quotations**: 报价信息列表 , 类型 *quotation*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "quotations":[
                    {
                        "qid": 1,
                        "orderId": "1601010001",
                        "name": "现代",
                        "creater": {
                            "uid": 1,
                            "createrId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师" 
                        },
                        "createTime": "2016-01-01",
                        "updateTime": "2016-01-01",
                        "style": "现代简约",
                        "discount": 9,
                        "houseArea": null,
                        "notSalesmanRate": 0,
                        "basePrice": 0,
                        "undisPrice": 90154,
                        "disPrice": 90154,
                        "trafficPrice": 7800,
                        "trafficRate": 200,
                        "trafficDiscount": 0,
                        "managePrice": 11154,
                        "manageRate": 100,
                        "manageDiscount": 0,
                        "taxPrice": 0,
                        "taxRate": 0,
                        "taxDiscount": 0,
                        "unachePrice": 0,
                        "costPrice": 0,
                        "totalPrice": 90154,
                        "worktime": 0,
                        "auditime": 0,
                        "status": 0,
                        "attstatus": 0,
                        "content": ""
                    }
                ],
                ...
            }
    
    ### <I> queryQuotationForDefaultByOrderId

        通过装修单号获取默认报价信息
        
                |Requests:|
                :param quotation.orderId: 装修单号
        :type quotation.orderId: String
        :param quotation.type: 类型
        :type quotation.type: Short
        
        Example::
        
            {
                "quotation.orderId": "1601010001",
                "quotation.type": 0
            }
            
                |Returns:|
                - **quotation**: 报价信息 , 类型 *quotation*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "quotation": {
                    "qid": 1,
                    "orderId": "1601010001",
                    "name": "现代",
                    "creater": {
                        "uid": 1,
                        "createrId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师" 
                    },
                    "createTime": "2016-01-01",
                    "updateTime": "2016-01-01",
                    "style": "现代简约",
                    "discount": 9,
                    "houseArea": null,
                    "notSalesmanRate": 0,
                    "basePrice": 0,
                    "undisPrice": 90154,
                    "disPrice": 90154,
                    "trafficPrice": 7800,
                    "trafficRate": 200,
                    "trafficDiscount": 0,
                    "managePrice": 11154,
                    "manageRate": 100,
                    "manageDiscount": 0,
                    "taxPrice": 0,
                    "taxRate": 0,
                    "taxDiscount": 0,
                    "unachePrice": 0,
                    "costPrice": 0,
                    "totalPrice": 90154,
                    "worktime": 0,
                    "auditime": 0,
                    "status": 0,
                    "attstatus": 0,
                    "content": ""
                }
                ...
            }
            
    ### <I> queryQuotationById

        通过报价ID获取报价信息
        
                |Requests:|
                :param quotation.qid: 报价ID
        :type quotation.qid: String
        
        Example::
        
            {
                "quotation.qid": 1
            }
            
                |Returns:|
                - **quotation**: 报价信息 , 类型 *quotation*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "quotation": {
                    "qid": 1,
                    "orderId": "1601010001",
                    "name": "现代",
                    "creater": {
                        "uid": 1,
                        "createrId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师" 
                    },
                    "createTime": "2016-01-01",
                    "updateTime": "2016-01-01",
                    "style": "现代简约",
                    "discount": 9,
                    "houseArea": null,
                    "basePrice": 0,
                    "notSalesmanRate": 0,
                    "undisPrice": 90154,
                    "disPrice": 90154,
                    "trafficPrice": 7800,
                    "trafficRate": 200,
                    "trafficDiscount": 0,
                    "managePrice": 11154,
                    "manageRate": 100,
                    "manageDiscount": 0,
                    "taxPrice": 0,
                    "taxRate": 0,
                    "taxDiscount": 0,
                    "unachePrice": 0,
                    "costPrice": 0,
                    "totalPrice": 90154,
                    "worktime": 0,
                    "auditime": 0,
                    "status": 0,
                    "attstatus": 0,
                    "content": ""
                }
                ...
            }
            
    ### <I> queryQuotationForConfig

        获取报价相关配置信息
        
                |Returns:|
                - **configs**: 报价信息 , 类型 Map <String, List<Sting>>
          - 类型: *Map*
        
        Example::
        
            {
                ...
                "configs": {
                    "trafficRates": [
                        "0.015",
                        "0.02"
                    ],
                    "manageRates": [
                        "10035",
                        "10065"
                    ]
                }
                ...
            }

    ### <I> addQuotation

        添加报价信息
        
                |Requests:|
                :param quotation.orderId: 装修单号
        :type quotation.orderId: String
        :param quotation.name: 报价名
        :type quotation.name: String
        :param quotation.style: 风格
        :type quotation.style: String
        :param quotation.content: 说明
        :type quotation.content: String
        
        Example::
        
            {
                "quotation.orderId": "1601010001",
                "quotation.name": "测试",
                "quotation.style": "现代",
                "quotation.content": ""
            }
            
    ### <I> updateQuotation

        更新报价基础信息
        
        判断报价是否存在 , 不存在 错误信息 **200003 报价不存在**
        
        判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 **200030 报价状态不可操作**
    
                |Requests:|
                :param quotation.qid: 报价ID
        :type quotation.qid: Long
        :param quotation.orderId: 装修单号
        :type quotation.orderId: String
        :param quotation.name: 报价名
        :type quotation.name: String
        :param quotation.style: 风格
        :type quotation.style: String
        :param quotation.content: 说明
        :type quotation.content: String
        
        Example::
        
            {
                "quotation.qid": 1,
                "quotation.orderId": "1601010001",
                "quotation.name": "测试",
                "quotation.style": "现代",
                "quotation.content": ""
            }

    ### <I> updateQuotationForPrice

        更新报价价格信息
        
        判断报价是否存在 , 不存在 错误信息 **200003 报价不存在**
        
        判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 **200030 报价状态不可操作**
    
                |Requests:|
                :param quotation.qid: 报价ID
        :type quotation.qid: Long
        
        Example::
        
            {
                "quotation.qid": 1
            }
            
    ### <I> updateQuotationForAdvance

        更新报价高级信息 , 同时按照报价的类型分别更新对应的信息
        
        判断报价是否存在 , 不存在 错误信息 **200003 报价不存在**
        
        判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 **200030 报价状态不可操作**
        
                |Requests:|
                :param quotation.qid: 报价ID
        :type quotation.qid: Long
        :param quotation.basePrice: 基数
        :type quotation.basePrice: Long
        :param quotation.undisPrice: 不打折项总额
        :type quotation.undisPrice: Long
        :param quotation.disPrice: 打折项总额
        :type quotation.disPrice: Long
        :param quotation.discount: 折扣
        :type quotation.discount: Long
        :param quotation.trafficPrice: 车运费
        :type quotation.trafficPrice: Long
        :param quotation.trafficRate: 车运费比例
        :type quotation.trafficRate: Integer
        :param quotation.trafficDiscount: 车运费折扣
        :type quotation.trafficDiscount: Short
        :param quotation.managePrice: 管理费
        :type quotation.managePrice: Long
        :param quotation.manageRate: 管理费比例
        :type quotation.manageRate: Integer
        :param quotation.manageDiscount: 管理费折扣
        :type quotation.manageDiscount: Short
        :param quotation.taxPrice: 税金
        :type quotation.taxPrice: Long
        :param quotation.taxRate: 税金比例
        :type quotation.taxRate: Integer
        :param quotation.taxDiscount: 税金折扣
        :type quotation.taxDiscount: Short
        :param quotation.unachePrice: 非业绩总额
        :type quotation.unachePrice: Long
        :param quotation.costPrice: 成本总额
        :type quotation.costPrice: Long
        :param quotation.totalPrice: 报价总额
        :type quotation.totalPrice: Long
            
        Example::
        
            {
                "quotation.qid": 1,
                "quotation.basePrice": 0,
                "quotation.undisPrice": 10000,
                "quotation.disPrice": 10000,
                "quotation.discount": 900,
                "quotation.trafficPrice": 0,
                "quotation.trafficRate": 200,
                "quotation.trafficDiscount": 0,
                "quotation.managePrice": 0,
                "quotation.manageRate": 10035,
                "quotation.manageDiscount": 0,
                "quotation.taxPrice": 0,
                "quotation.taxRate": 10035,
                "quotation.taxDiscount": 0,
                "quotation.unachePrice": 0,
                "quotation.costPrice": 0,
                "quotation.totalPrice": 10000
            }

    ### <I> updateQuotationForStatus

        更新报价状态
        
        判断报价是否存在 , 不存在 错误信息 **200003 报价不存在**
        
                |Requests:|
                :param quotation.qid: 报价ID
        :type quotation.qid: Long
        :param quotation.status: 状态
        :type quotation.status: Short
        :param quotation.attstatus: 状态
        :type quotation.attstatus: Short
            
        Example::
        
            {
                "quotation.qid": 1,
                "quotation.status": 1,
                "quotation.attstatus": 1
            }

    ### <I> updateQuotationForTime

        更新报价状态
        
        判断报价是否存在 , 不存在 错误信息 **200003 报价不存在**
        
                |Requests:|
                :param quotation.qid: 报价ID
        :type quotation.qid: Long
        :param quotation.worktime: 制作及时
        :type quotation.worktime: Integer
        :param quotation.auditime: 审核计时
        :type quotation.auditime: Integer
            
        Example::
        
            {
                "quotation.qid": 1,
                "quotation.worktime": 1,
                "quotation.auditime": 1
            }
            
    ### <I> deleteQuotationById

        通过报价ID删除报价信息 , 默认报价不能删除
        
                |Requests:|
                :param quotation.qid: 报价ID
        :type quotation.qid: Long
            
        Example::
        
            {
                "quotation.qid": 1,
            }
            
    ### <I> replicaQuotation

        装修单间拷贝报价 , 其中折扣不进行复制
        
        判断报价是否存在 , 不存在 错误信息 **200003 报价不存在**
        
        判断报价数量是否已经达到上限 , 错误信息 **200001 报价已经达到数量上限**
        
        判断报价是否存在已锁定状态 , 错误信息 **200033 报价已锁定**
        
                |Requests:|
                :param quotation.qid: 拷贝报价ID
        :type quotation.qid: Long
        :param quotation.orderId: 目的装修单号
        :type quotation.orderId: String
            
        Example::
        
            {
                "quotation.qid": 1,
                "quotation.orderId": "1601010002"
            }
            
    ### <I> copyQuotation

        装修单内拷贝报价 , 折扣与原报价相同
        
        判断报价是否存在 , 不存在 错误信息 **200003 报价不存在**
        
        判断报价数量是否已经达到上限 , 错误信息 **200001 报价已经达到数量上限**
        
        判断报价是否存在已锁定状态 , 错误信息 **200033 报价已锁定**
        
                |Requests:|
                :param quotation.qid: 拷贝报价ID
        :type quotation.qid: Long
        :param quotation.orderId: 目的装修单号
        :type quotation.orderId: String
            
        Example::
        
            {
                "quotation.qid": 1,
                "quotation.orderId": "1601010002"
            }
            
    ### <I> cloneQuotation

        克隆报价 , 将报价(quotetion)拷贝到报价(quotation)
        
        判断报价是否存在 , 不存在 错误信息 **200003 报价不存在**
        
        判断报价数量是否已经达到上限 , 错误信息 **200001 报价已经达到数量上限**
        
        判断报价是否存在已锁定状态 , 错误信息 **200033 报价已锁定**
        
        判断拷贝报价与装修单报价版本是否一致 , 错误信息 **200002 复制报价与当前报价版本不同,不能拷贝**
        
                |Requests:|
                :param quotation.no: 报价编号
        :type quotation.no: String
            
        Example::
        
            {
                "quotation.no": 1
            }
            
    ### <I> changeQuotationForDefault

        更换默认报价 , 装修单内有且只有一份默认报价
        
                |Requests:|
                :param quotation.qid: 拷贝报价ID
        :type quotation.qid: Long
        :param quotation.orderId: 目的装修单号
        :type quotation.orderId: String
            
        Example::
        
            {
                "quotation.qid": 1,
                "quotation.orderId": "1601010002"
            }
            
    ### <I> lockQuotation

        锁定报价
        
        判断报价是否存在 , 不存在 错误信息 **200003 报价不存在**
        
        锁定状态的报价 , 可以进行打印功能 , 以及部分装修单操作限制 , 但不可以在进行编辑
        
        更新报价状态为1(锁定)
        
                |Requests:|
                :param quotation.qid: 报价ID
        :type quotation.qid: Long
            
        Example::
        
            {
                "quotation.qid": 1
            }
            
    ### <I> unlockQuotation

        解锁报价
        
        判断报价是否存在 , 不存在 错误信息 **200003 报价不存在**
        
        更新报价状态为0(初始)
        
                |Requests:|
                :param quotation.qid: 报价ID
        :type quotation.qid: Long
            
        Example::
        
            {
                "quotation.qid": 1
            }
            
### 报价-功能区

报价中功能区信息管理

## api.quotation.QuotationFunctionAreaAction

        |DataType:|
        #### quotationFunctionArea

    - **qfaid**: 功能区ID
      - 类型: *Long*
    - **quotationId**: 报价ID
      - 类型: *Long*
    - **functionAreaName**: 功能区名
      - 类型: *String*
    - **functionAreaOrder**: 功能区排序
      - 类型: *Integer*
    - **functionAreaType**: 功能区类型 , 保留字段
      - 类型: *String*
    - **type**: 类型 , 分为: 0(管理), 1(工程量), 2(功能区总额), 3(不计算) , 4(成本) , 5(非业绩)
      - 类型: *Short*
    - **total**: 总额 , 类型为
      - 类型: *Long*
    - **quotationFunctionAreaItems**: 功能区包含报价项信息列表 , 每条数据类型 [quotationFunctionAreaItem](./quotation.html#api.quotation.QuotationFunctionAreaItemAction.quotationFunctionAreaItem)
      - 类型: *List*
    
    ### <I> queryQuotationFunctionAreaForCommonByQuotationId

        通过报价ID查询功能区信息 , 不包含功能区中报价项信息
        
                |Requests:|
                :param quotation.qid: 报价ID
        :type quotation.qid: Long
        
        Example::
        
            {
                "quotation.qid": 1
            }
            
                |Returns:|
                - **quotationFunctionAreas**: 功能区信息列表 , 每条数据类型 *quotationFunctionArea*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "quotationFunctionAreas": [
                    {
                        "qfaid": 1,
                        "quotationId": 1,
                        "functionAreaName": "门厅",
                        "functionAreaOrder": 1,
                        "functionAreaType": "标准",
                        "type": 1,
                        "total": 0,
                        "quotationFunctionAreaItems": null,
                    }
                ],
                ...
            }
            
    ### <I> queryQuotationFunctionAreaByQuotationId

        通过报价ID查询功能区信息 , 包含功能区中报价项信息
        
                |Requests:|
                :param quotation.qid: 报价ID
        :type quotation.qid: Long
        
        Example::
        
            {
                "quotation.qid": 1,
            }
            
                |Returns:|
                - **quotationFunctionAreas**: 功能区信息列表 , 每条数据类型 *quotationFunctionArea*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "quotationFunctionAreas": [
                    {
                        "qfaid": 1,
                        "quotationId": 1,
                        "functionAreaName": "门厅",
                        "functionAreaOrder": 1,
                        "functionAreaType": "0",
                        "type": 1,
                        "total": 0,
                        "quotationFunctionAreaItems": [
                            {
                                "content": "",
                                "discount": 0,
                                "itemName": "报价项",
                                "measurementUnit": "",
                                "num": 1,
                                "qfaiId": 1,
                                "quotationFunctionAreaId": 1,
                                "quotationItemId": null,
                                "type": 2,
                                "unitPrice": 100,
                                "workType": "木工"
                            }
                        ]
                    }
                ],
                ...
            }
            
    ### <I> addQuotationFunctionArea

        报价中添加功能区
        
        根据装修单对应的默认报价完成功能区添加
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**
        
        判断装修单默认报价是否存在 , 不存在 错误信息 **200017 默认报价不存在**
        
        :param quotation.orderId: 装修单号
        :type quotation.orderId: String
        :param functionAreaIds[0]: 功能区ID
        :type functionAreaIds[0]: Long
        
        Example::
        
            {
                "quotation.orderId": "1601010001"
                "functionAreaIds[0]": 1
            }
            
    ### <I> addQuotationFunctionAreaByFunctionAreaIds

        报价中添加功能区信息
        
        判断报价是否存在 , 不存在 错误信息 **200013 报价项不存在**
        
        判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 **200030 报价状态不可操作**
        
                |Requests:|
                :param quotation.qid: 报价ID
        :type quotation.qid: Long
        :param quotation.basePrice: 基数
        :type quotation.basePrice: Long
        :param quotation.undisPrice: 不打折项总额
        :type quotation.undisPrice: Long
        :param quotation.disPrice: 打折项总额
        :type quotation.disPrice: Long
        :param quotation.discount: 折扣
        :type quotation.discount: Long
        :param quotation.trafficPrice: 车运费
        :type quotation.trafficPrice: Long
        :param quotation.trafficRate: 车运费比例
        :type quotation.trafficRate: Integer
        :param quotation.trafficDiscount: 车运费折扣
        :type quotation.trafficDiscount: Short
        :param quotation.managePrice: 管理费
        :type quotation.managePrice: Long
        :param quotation.manageRate: 管理费比例
        :type quotation.manageRate: Integer
        :param quotation.manageDiscount: 管理费折扣
        :type quotation.manageDiscount: Short
        :param quotation.taxPrice: 税金
        :type quotation.taxPrice: Long
        :param quotation.taxRate: 税金比例
        :type quotation.taxRate: Integer
        :param quotation.taxDiscount: 税金折扣
        :type quotation.taxDiscount: Short
        :param quotation.unachePrice: 非业绩总额
        :type quotation.unachePrice: Long
        :param quotation.costPrice: 成本总额
        :type quotation.costPrice: Long
        :param quotation.totalPrice: 报价总额
        :type quotation.totalPrice: Long
        
        :param quotationFunctionAreas[n].id: 功能区ID
        :type quotationFunctionAreas[n].id: Long
        :param quotationFunctionAreas[n].quotationFunctionAreaParam.girth: 周长
        :type quotationFunctionAreas[n].quotationFunctionAreaParam.girth: Integer
        :param quotationFunctionAreas[n].quotationFunctionAreaParam.area: 面积
        :type quotationFunctionAreas[n].quotationFunctionAreaParam.area: Integer
        :param quotationFunctionAreas[n].quotationFunctionAreaParam.height: 举架
        :type quotationFunctionAreas[n].quotationFunctionAreaParam.height: Integer
        :param quotationFunctionAreas[n].quotationFunctionAreaParam.holeLength: 洞长
        :type quotationFunctionAreas[n].quotationFunctionAreaParam.holeLength: Integer
        :param quotationFunctionAreas[n].quotationFunctionAreaParam.holeHeight: 洞高
        :type quotationFunctionAreas[n].quotationFunctionAreaParam.holeHeight: Integer
        :param quotationFunctionAreas[n].quotationFunctionAreaParam.windowLength: 窗长
        :type quotationFunctionAreas[n].quotationFunctionAreaParam.windowLength: Integer
        :param quotationFunctionAreas[n].quotationFunctionAreaParam.windowHeight: 窗高
        :type quotationFunctionAreas[n].quotationFunctionAreaParam.windowHeight: Integer
        :param quotationFunctionAreas[n].quotationFunctionAreaParam.beamLength: 梁长
        :type quotationFunctionAreas[n].quotationFunctionAreaParam.beamLength: Integer
        :param quotationFunctionAreas[n].quotationFunctionAreaParam.beamHeight: 梁高
        :type quotationFunctionAreas[n].quotationFunctionAreaParam.beamHeight: Integer
        
        Example::
        
            {
                "quotation.qid": 1,
                "quotation.basePrice": 0,
                "quotation.undisPrice": 10000,
                "quotation.disPrice": 10000,
                "quotation.discount": 900,
                "quotation.trafficPrice": 0,
                "quotation.trafficRate": 200,
                "quotation.trafficDiscount": 0,
                "quotation.managePrice": 0,
                "quotation.manageRate": 10035,
                "quotation.manageDiscount": 0,
                "quotation.taxPrice": 0,
                "quotation.taxRate": 10035,
                "quotation.taxDiscount": 0,
                "quotation.unachePrice": 0,
                "quotation.costPrice": 0,
                "quotation.totalPrice": 10000,
                
                "quotationFunctionAreas[0].id": 1,
                "quotationFunctionAreas[0].quotationFunctionAreaParam.girth": 1,
                "quotationFunctionAreas[1].id": 2,
                "quotationFunctionAreas[0].quotationFunctionAreaParam.area": 1,
            }
            
                |Returns:|
                - **quotationFunctionAreas**: 功能区信息列表 , 每条数据类型 *quotationFunctionArea*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "quotationFunctionAreas": [
                    {
                        "qfaid": 1,
                        "quotationId": 1,
                        "functionAreaName": "门厅",
                        "functionAreaOrder": 1,
                        "functionAreaType": "0",
                        "type": 1,
                        "total": 0,
                        "quotationFunctionAreaItems": [
                            {
                                "qfaiId": 1,
                                "itemName": "整体墙棚面砂纸打磨处理",
                                "index": 1,
                                "formula": "1+1",
                                "initnum": 5,
                                "num": 5,
                                "type": 0,
                                "subtype": 0,
                                "unitPrice": 2,
                                "workType": "油",
                                "measurementUnit": "平方米",
                                "discount": 1,
                                "quotationFunctionAreaId": null,
                                "quotationItemId": null,
                                "content": "",
                            }
                        ]
                    }
                ],
                ...
            }
            
    ### <I> updateQuotationFunctionArea

        更新功能区信息
        
        判断功能区是否存在 , 不存在 , 错误信息 **200010 功能区不存在**
        
        判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 200030 报价状态不可操作
        
                |Requests:|
                :param quotation.qid: 报价ID
        :type quotation.qid: Long
        :param quotation.basePrice: 基数
        :type quotation.basePrice: Long
        :param quotation.undisPrice: 不打折项总额
        :type quotation.undisPrice: Long
        :param quotation.disPrice: 打折项总额
        :type quotation.disPrice: Long
        :param quotation.discount: 折扣
        :type quotation.discount: Long
        :param quotation.trafficPrice: 车运费
        :type quotation.trafficPrice: Long
        :param quotation.trafficRate: 车运费比例
        :type quotation.trafficRate: Integer
        :param quotation.trafficDiscount: 车运费折扣
        :type quotation.trafficDiscount: Short
        :param quotation.managePrice: 管理费
        :type quotation.managePrice: Long
        :param quotation.manageRate: 管理费比例
        :type quotation.manageRate: Integer
        :param quotation.manageDiscount: 管理费折扣
        :type quotation.manageDiscount: Short
        :param quotation.taxPrice: 税金
        :type quotation.taxPrice: Long
        :param quotation.taxRate: 税金比例
        :type quotation.taxRate: Integer
        :param quotation.taxDiscount: 税金折扣
        :type quotation.taxDiscount: Short
        :param quotation.unachePrice: 非业绩总额
        :type quotation.unachePrice: Long
        :param quotation.costPrice: 成本总额
        :type quotation.costPrice: Long
        :param quotation.totalPrice: 报价总额
        :type quotation.totalPrice: Long
        
        :param quotationFunctionArea.qfaid: 功能区ID
        :type quotationFunctionArea.qfaid: Long
        :param quotationFunctionArea.functionAreaName: 功能区名称
        :type quotationFunctionArea.functionAreaName: String
        :param quotationFunctionArea.functionAreaOrder: 功能区排序
        :type quotationFunctionArea.functionAreaOrder: Integer
            
        Example::
        
            {
                "quotation.qid": 1,
                "quotation.basePrice": 0,
                "quotation.undisPrice": 10000,
                "quotation.disPrice": 10000,
                "quotation.discount": 900,
                "quotation.trafficPrice": 0,
                "quotation.trafficRate": 200,
                "quotation.trafficDiscount": 0,
                "quotation.managePrice": 0,
                "quotation.manageRate": 10035,
                "quotation.manageDiscount": 0,
                "quotation.taxPrice": 0,
                "quotation.taxRate": 10035,
                "quotation.taxDiscount": 0,
                "quotation.unachePrice": 0,
                "quotation.costPrice": 0,
                "quotation.totalPrice": 10000,
                
                "quotationFunctionArea.qfaid": 2,
                "quotationFunctionArea.functionAreaName": "门厅",
                "quotationFunctionArea.functionAreaOrder": 2,
            }
            
    ### <I> deleteQuotationFunctionArea

        删除功能区信息 , 功能区中包含的报价项信息一同删除
        
        判断是否存在关联选材项 , 如果存在 , 错误信息 **200037 存在关联选材项**
        
        判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 200030 报价状态不可操作
        
                |Requests:|
                :param quotation.qid: 报价ID
        :type quotation.qid: Long
        :param quotation.basePrice: 基数
        :type quotation.basePrice: Long
        :param quotation.undisPrice: 不打折项总额
        :type quotation.undisPrice: Long
        :param quotation.disPrice: 打折项总额
        :type quotation.disPrice: Long
        :param quotation.discount: 折扣
        :type quotation.discount: Long
        :param quotation.trafficPrice: 车运费
        :type quotation.trafficPrice: Long
        :param quotation.trafficRate: 车运费比例
        :type quotation.trafficRate: Integer
        :param quotation.trafficDiscount: 车运费折扣
        :type quotation.trafficDiscount: Short
        :param quotation.managePrice: 管理费
        :type quotation.managePrice: Long
        :param quotation.manageRate: 管理费比例
        :type quotation.manageRate: Integer
        :param quotation.manageDiscount: 管理费折扣
        :type quotation.manageDiscount: Short
        :param quotation.taxPrice: 税金
        :type quotation.taxPrice: Long
        :param quotation.taxRate: 税金比例
        :type quotation.taxRate: Integer
        :param quotation.taxDiscount: 税金折扣
        :type quotation.taxDiscount: Short
        :param quotation.unachePrice: 非业绩总额
        :type quotation.unachePrice: Long
        :param quotation.costPrice: 成本总额
        :type quotation.costPrice: Long
        :param quotation.totalPrice: 报价总额
        :type quotation.totalPrice: Long
        
        :param quotationFunctionArea.qfaid: 功能区ID
        :type quotationFunctionArea.qfaid: Long
        
        
        Example::
        
            {
                "quotation.qid": 1,
                "quotation.basePrice": 0,
                "quotation.undisPrice": 10000,
                "quotation.disPrice": 10000,
                "quotation.discount": 900,
                "quotation.trafficPrice": 0,
                "quotation.trafficRate": 200,
                "quotation.trafficDiscount": 0,
                "quotation.managePrice": 0,
                "quotation.manageRate": 10035,
                "quotation.manageDiscount": 0,
                "quotation.taxPrice": 0,
                "quotation.taxRate": 10035,
                "quotation.taxDiscount": 0,
                "quotation.unachePrice": 0,
                "quotation.costPrice": 0,
                "quotation.totalPrice": 10000,
                
                "quotationFunctionArea.qfaid": 2
            }
            
### 功能区-报价项

功能区中报价项信息管理

## api.quotation.QuotationFunctionAreaItemAction

        |DataType:|
        #### quotationFunctionAreaItem

    - **qfaiId**: 报价项ID
      - 类型: *Long*
    - **itemName**: 报价项名
      - 类型: *String*
    - **unitPrice**: 单价
      - 类型: *Integer*
    - **index**: 索引
      - 类型: *Integer*
    - **formula**: 公式
      - 类型: *String*
    - **initnum**: 初始工程量
      - 类型: *Integer*
    - **num**: 工程量
      - 类型: *Integer*
    - **type**: 类型 , 0: 标准 , 1: 自定义 , 2: 车运 , 3: 管理 , 4: 不计, 5: 成本 , 6: 非业绩
      - 类型: *Short*
    - **subtype**: 子类 , 0: 其他 , 1: 工程 , 2: 主材 , 3: 套餐 , 4: 家具 , 5: 电器 , 6: 灯具 , 7: 软装
      - 类型: *Short*
    - **measurementUnit**: 单位
      - 类型: *String*
    - **workType**: 工种
      - 类型: *String*
    - **discount**: 折扣标识 , 0: 不打折 , 1: 打折
      - 类型: *Short*
    - **quotationFunctionAreaId**: 所属功能区ID
      - 类型: *Long*
    - **quotationItemId**: 引用报价项ID
      - 类型: *Long*
    - **content**: 说明
      - 类型: *String*
    
    ### <I> queryQuotationFunctionAreaItemByQuotationFunctionAreaId

        通过归属功能区ID查询报价项信息
        
                |Requests:|
                :param quotationFunctionArea.quotationFunctionAreaId: 功能区ID
        :type quotationFunctionArea.quotationFunctionAreaId: Long
        
        Example::
        
            {
                "quotationFunctionArea.quotationFunctionAreaId": 1
            }
        
                |Returns:|
                - **quotationFunctionAreaItems**: 报价项信息列表 , 每条数据类型 *quotationFunctionAreaItem*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "quotationFunctionAreaItems": [
                    {
                        "qfaiId": 1,
                        "itemName": "整体墙棚面砂纸打磨处理",
                        "index": 1,
                        "formula": "1+1",
                        "initnum": 5,
                        "num": 5,
                        "type": 0,
                        "subtype": 0,
                        "unitPrice": 2,
                        "workType": "油",
                        "measurementUnit": "平方米",
                        "discount": 1,
                        "quotationFunctionAreaId": null,
                        "quotationItemId": null,
                        "content": "",
                    }
                ],
                ...
            }
            
    ### <I> updateQuotationFunctionAreaItem

        更新报价项信息 , 若无信息则为创建报价项信息 , 标准报价项 , 需要引用报价项ID信息 , 其他信息直接赋值 ; 自定义报价项 , 引用报价项ID为NULL , 其他信息直接赋值
        
        判断报价是否存在 , 不存在 错误信息 **200013 报价项不存在**
        
        判断是否存在关联选材项 , 如果存在 , 错误信息 **200037 存在关联选材项**
        
        判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 **200030 报价状态不可操作**
        
                |Requests:|
                :param quotation.qid: 报价ID
        :type quotation.qid: Long
        :param quotation.basePrice: 基数
        :type quotation.basePrice: Long
        :param quotation.undisPrice: 不打折项总额
        :type quotation.undisPrice: Long
        :param quotation.disPrice: 打折项总额
        :type quotation.disPrice: Long
        :param quotation.discount: 折扣
        :type quotation.discount: Long
        :param quotation.trafficPrice: 车运费
        :type quotation.trafficPrice: Long
        :param quotation.trafficRate: 车运费比例
        :type quotation.trafficRate: Integer
        :param quotation.trafficDiscount: 车运费折扣
        :type quotation.trafficDiscount: Short
        :param quotation.managePrice: 管理费
        :type quotation.managePrice: Long
        :param quotation.manageRate: 管理费比例
        :type quotation.manageRate: Integer
        :param quotation.manageDiscount: 管理费折扣
        :type quotation.manageDiscount: Short
        :param quotation.taxPrice: 税金
        :type quotation.taxPrice: Long
        :param quotation.taxRate: 税金比例
        :type quotation.taxRate: Integer
        :param quotation.taxDiscount: 税金折扣
        :type quotation.taxDiscount: Short
        :param quotation.unachePrice: 非业绩总额
        :type quotation.unachePrice: Long
        :param quotation.costPrice: 成本总额
        :type quotation.costPrice: Long
        :param quotation.totalPrice: 报价总额
        :type quotation.totalPrice: Long
        
        :param quotationFunctionAreaItem.qfaiId: 报价项ID
        :type quotationFunctionAreaItem.qfaiId: Long
        :param quotationFunctionAreaItem.itemName: 报价项名
        :type quotationFunctionAreaItem.itemName: String
        :param quotationFunctionAreaItem.unitPrice: 单价
        :type quotationFunctionAreaItem.unitPrice: Integer
        :param quotationFunctionAreaItem.index: 索引
        :type quotationFunctionAreaItem.index: Integer
        :param quotationFunctionAreaItem.formula: 公式
        :type quotationFunctionAreaItem.formula: String
        :param quotationFunctionAreaItem.initnum: 初始工程量
        :type quotationFunctionAreaItem.initnum: Integer
        :param quotationFunctionAreaItem.num: 工程量
        :type quotationFunctionAreaItem.num: Integer
        :param quotationFunctionAreaItem.type: 类型 , 0: 标准报价项 , 1: 自定义报价项
        :type quotationFunctionAreaItem.type: Short
        :param quotationFunctionAreaItem.subtype: 子类
        :type quotationFunctionAreaItem.subtype: Short
        :param quotationFunctionAreaItem.measurementUnit: 单位
        :type quotationFunctionAreaItem.measurementUnit: String
        :param quotationFunctionAreaItem.workType: 工种
        :type quotationFunctionAreaItem.workType: String
        :param quotationFunctionAreaItem.discount: 折扣标识 , 0: 不打折 , 1: 打折
        :type quotationFunctionAreaItem.discount: Short
        :param quotationFunctionAreaItem.quotationFunctionAreaId: 所属功能区ID
        :type quotationFunctionAreaItem.quotationFunctionAreaId: Long
        :param quotationFunctionAreaItem.quotationItemId: 引用报价项ID
        :type quotationFunctionAreaItem.quotationItemId: Long
        :param quotationFunctionAreaItem.content: 说明
        :type quotationFunctionAreaItem.content: String

        Example::
        
            {
                "quotation.qid": 1,
                "quotation.basePrice": 0,
                "quotation.undisPrice": 10000,
                "quotation.disPrice": 10000,
                "quotation.discount": 900,
                "quotation.trafficPrice": 0,
                "quotation.trafficRate": 200,
                "quotation.trafficDiscount": 0,
                "quotation.managePrice": 0,
                "quotation.manageRate": 10035,
                "quotation.manageDiscount": 0,
                "quotation.taxPrice": 0,
                "quotation.taxRate": 10035,
                "quotation.taxDiscount": 0,
                "quotation.unachePrice": 0,
                "quotation.costPrice": 0,
                "quotation.totalPrice": 10000,
                
                "quotationFunctionAreaItem.itemName": "整体墙棚面砂纸打磨处理",
                "quotationFunctionAreaItem.index": 1,
                "quotationFunctionAreaItem.formula": "1+1",
                "quotationFunctionAreaItem.initnum": 5,
                "quotationFunctionAreaItem.num": 5,
                "quotationFunctionAreaItem.type": 0,
                "quotationFunctionAreaItem.subtype": 0,
                "quotationFunctionAreaItem.unitPrice": 2,
                "quotationFunctionAreaItem.workType": "油",
                "quotationFunctionAreaItem.measurementUnit": "平方米",
                "quotationFunctionAreaItem.discount": 1,
                "quotationFunctionAreaItem.quotationFunctionAreaId": 1,
                "quotationFunctionAreaItem.quotationItemId": null,
                "quotationFunctionAreaItem.content": ""
            }

                |Returns:|
                - **quotationFunctionAreaItem**: 报价项信息 , 类型 *quotationFunctionAreaItem*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "quotationFunctionAreaItem": {
                    "qfaiId": 1,
                    "itemName": "整体墙棚面砂纸打磨处理",
                    "index": 1,
                    "formula": "1+1",
                    "initnum": 5,
                    "num": 5,
                    "type": 0,
                    "subtype": 0,
                    "unitPrice": 2,
                    "workType": "油",
                    "measurementUnit": "平方米",
                    "discount": 1,
                    "quotationFunctionAreaId": null,
                    "quotationItemId": null,
                    "content": null,
                },
                ...
            }

    ### <I> updateQuotationFunctionAreaItemForSpec

        更新特殊报价项单价信息 , 直接更新报价项单价
        
        利用功能区定位报价项归属表
        
        判断报价是否存在 , 不存在 , 错误信息 **200013 报价项不存在**
        
        判断功能区是否存在 , 不存在 , 错误信息 **200012 功能区不存在**
        
        判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 **200030 报价状态不可操作**
        
                |Requests:|
                :param quotationFunctionAreaItem.qfaiId: 报价项ID
        :type quotationFunctionAreaItem.qfaiId: Long
        :param quotationFunctionAreaItem.quotationFunctionAreaId: 功能区ID
        :type quotationFunctionAreaItem.quotationFunctionAreaId: Long
        :param quotationFunctionAreaItem.unitPrice: 单价
        :type quotationFunctionAreaItem.unitPrice: Integer
        
        Example::
        
            {
                "quotationFunctionAreaItem.qfaiId": 1,
                "quotationFunctionAreaItem.quotationFunctionAreaId": 1,
                "quotationFunctionAreaItem.unitPrice": 200
            }
            
    ### <I> updateQuotationFunctionAreaItemForIndex

        更新报价项排序索引
        
        更新过程只能够在同一个功能区中的两个索引之间完成
        
        利用功能区定位报价项归属表
        
        报价项获取失败或无报价项 , 不进行更新动作
        
        判断功能区是否存在 , 不存在 , 错误信息 **200012 功能区不存在**
        
                |Requests:|
                :param quotationFunctionArea.qfaid: 功能区ID
        :type quotationFunctionArea.qfaid: Long
        :param quotationFunctionAreaItems[n].qfaiId: 报价项ID
        :type quotationFunctionAreaItems[n].qfaiId: Long
        :param quotationFunctionAreaItems[n].index: 索引
        :type quotationFunctionAreaItems[n].index: Short
        
        Example::
        
            {
                "quotationFunctionArea.qfaid": 1,
                "quotationFunctionAreaItems[0].qfaiId": 1,
                "quotationFunctionAreaItems[0].index": 1,
                "quotationFunctionAreaItems[1].qfaiId": 2,
                "quotationFunctionAreaItems[1].index": 2
            }

    ### <I> updateQuotationFunctionAreaItemByQuotationIdAType

        通过报价ID以及报价项类型更新报价项单价信息 , 只能适用类型为2:车运费和3:管理费的项目
        
        判断报价是否存在 , 不存在 错误信息 **200013 报价项不存在**
        
        判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 **200030 报价状态不可操作**
        
                |Requests:|
                :param quotation.qid: 报价ID
        :type quotation.qid: Long
        :param quotation.basePrice: 基数
        :type quotation.basePrice: Long
        :param quotation.undisPrice: 不打折项总额
        :type quotation.undisPrice: Long
        :param quotation.disPrice: 打折项总额
        :type quotation.disPrice: Long
        :param quotation.discount: 折扣
        :type quotation.discount: Long
        :param quotation.trafficPrice: 车运费
        :type quotation.trafficPrice: Long
        :param quotation.trafficRate: 车运费比例
        :type quotation.trafficRate: Integer
        :param quotation.trafficDiscount: 车运费折扣
        :type quotation.trafficDiscount: Short
        :param quotation.managePrice: 管理费
        :type quotation.managePrice: Long
        :param quotation.manageRate: 管理费比例
        :type quotation.manageRate: Integer
        :param quotation.manageDiscount: 管理费折扣
        :type quotation.manageDiscount: Short
        :param quotation.taxPrice: 税金
        :type quotation.taxPrice: Long
        :param quotation.taxRate: 税金比例
        :type quotation.taxRate: Integer
        :param quotation.taxDiscount: 税金折扣
        :type quotation.taxDiscount: Short
        :param quotation.unachePrice: 非业绩总额
        :type quotation.unachePrice: Long
        :param quotation.costPrice: 成本总额
        :type quotation.costPrice: Long
        :param quotation.totalPrice: 报价总额
        :type quotation.totalPrice: Long
        
        :param quotationFunctionAreaItem.type: 报价项类型
        :type quotationFunctionAreaItem.type: Short
        :param quotationFunctionAreaItem.unitPrice: 单价
        :type quotationFunctionAreaItem.unitPrice: Integer

        Example::
        
            {
                "quotation.qid": 1,
                "quotation.basePrice": 0,
                "quotation.undisPrice": 10000,
                "quotation.disPrice": 10000,
                "quotation.discount": 900,
                "quotation.trafficPrice": 0,
                "quotation.trafficRate": 200,
                "quotation.trafficDiscount": 0,
                "quotation.managePrice": 0,
                "quotation.manageRate": 10035,
                "quotation.manageDiscount": 0,
                "quotation.taxPrice": 0,
                "quotation.taxRate": 10035,
                "quotation.taxDiscount": 0,
                "quotation.unachePrice": 0,
                "quotation.costPrice": 0,
                "quotation.totalPrice": 10000,
                
                "quotationFunctionAreaItem.type": 3,
                "quotationFunctionAreaItem.unitPrice": 200
            }
            
    ### <I> deleteQuotationFunctionAreaItem

        删除报价项信息
        
        利用功能区定位报价项归属表
        
        判断报价是否存在 , 不存在 , 错误信息 **200013 报价项不存在**
        
        判断是否存在关联选材项 , 如果存在 , 错误信息 **200037 存在关联选材项**
        
        判断报价状态为0(启用) , 其他状态不可操作 , 错误信息 **200030 报价状态不可操作**
        
                |Requests:|
                :param quotation.qid: 报价ID
        :type quotation.qid: Long
        :param quotation.basePrice: 基数
        :type quotation.basePrice: Long
        :param quotation.undisPrice: 不打折项总额
        :type quotation.undisPrice: Long
        :param quotation.disPrice: 打折项总额
        :type quotation.disPrice: Long
        :param quotation.discount: 折扣
        :type quotation.discount: Long
        :param quotation.trafficPrice: 车运费
        :type quotation.trafficPrice: Long
        :param quotation.trafficRate: 车运费比例
        :type quotation.trafficRate: Integer
        :param quotation.trafficDiscount: 车运费折扣
        :type quotation.trafficDiscount: Short
        :param quotation.managePrice: 管理费
        :type quotation.managePrice: Long
        :param quotation.manageRate: 管理费比例
        :type quotation.manageRate: Integer
        :param quotation.manageDiscount: 管理费折扣
        :type quotation.manageDiscount: Short
        :param quotation.taxPrice: 税金
        :type quotation.taxPrice: Long
        :param quotation.taxRate: 税金比例
        :type quotation.taxRate: Integer
        :param quotation.taxDiscount: 税金折扣
        :type quotation.taxDiscount: Short
        :param quotation.unachePrice: 非业绩总额
        :type quotation.unachePrice: Long
        :param quotation.costPrice: 成本总额
        :type quotation.costPrice: Long
        :param quotation.totalPrice: 报价总额
        :type quotation.totalPrice: Long
        
        :param quotationFunctionArea.qfaid: 功能区ID
        :type quotationFunctionArea.qfaid: Long
        - **qfaiIds**: 报价项ID列表 , 每条数据类型 Long
          - 类型: *List*
        
        Example::
        
            {
                "quotation.qid": 1,
                "quotation.basePrice": 0,
                "quotation.undisPrice": 10000,
                "quotation.disPrice": 10000,
                "quotation.discount": 900,
                "quotation.trafficPrice": 0,
                "quotation.trafficRate": 200,
                "quotation.trafficDiscount": 0,
                "quotation.managePrice": 0,
                "quotation.manageRate": 10035,
                "quotation.manageDiscount": 0,
                "quotation.taxPrice": 0,
                "quotation.taxRate": 10035,
                "quotation.taxDiscount": 0,
                "quotation.unachePrice": 0,
                "quotation.costPrice": 0,
                "quotation.totalPrice": 10000,
                
                "quotationFunctionArea.qfaid": 1,
                "qfaiIds[0]": 1,
                "qfaiIds[1]": 2
            }

### 优惠

## api.quotation.QuotationPerferAction

        |DataType:|
        #### quotationPerfer

    - **qpid**: 优惠ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **qid**: 报价单ID
      - 类型: *Long*
    - **perferPrice**: 通用优惠
      - 类型: *Long*
    - **managePerfer**: 管理优惠
      - 类型: *Long*
    - **advancePerfer**: 特批优惠
      - 类型: *Long*
    
    ### <I> queryQuotationPerfer

        通过报价ID获取优惠信息
        
                |Requests:|
                :param quotationPerfer.qid: 报价单ID
        :type quotationPerfer.qid: Long
        
        Example::
        
            {
                "quotationPerfer.qid": 1
            }
            
                |Returns:|
                - **quotationPerfer**: 报价优惠信息 , 每条数据类型 *quotationPerfer*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "quotationPerfer": {
                    "qpid": 1,
                    "orderId": "1601010001",
                    "qid": 1,
                    "perferPrice": 1000,
                    "managePerfer": 1000,
                    "advancePerfer": 1000
                }
                ...
            }
    
    ### <I> updateQuotationPerfer

        更新报价优惠信息
        
                |Requests:|
                :param quotationPerfer.qid: 报价单ID
        :type quotationPerfer.qid: Long
        :param quotationPerfer.perferPrice: 通用优惠
        :type quotationPerfer.perferPrice: Long
        :param quotationPerfer.managePerfer: 管理优惠
        :type quotationPerfer.managePerfer: Long
        :param quotationPerfer.advancePerfer: 特批优惠
        :type quotationPerfer.advancePerfer: Long
        
        Example::
        
            {
                "quotationPerfer.orderId": "1601010001",
                "quotationPerfer.perferPrice": 0,
                "quotationPerfer.managePerfer": 0,
                "quotationPerfer.advancePerfer": 0
            }

## 扩展

装修单报价过程扩展项目处理过程 , 主要使用在订单类型为整装的处理过程

### 扩展

## api.quotation.ExtensionAction

        |DataType:|
        #### extension

    - **eid**: 拓展项ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **decoration**: 装修单 , 类型: [decoration](./decoration.html#api.data.DecorationAction.decoration)
      - 类型: *Object*
    - **type**: 类型 , 0: 增项 , 1: 减项
      - 类型: *Short*
    - **atttype**: 业务类型 , 0: 通用, 1: 置换
      - 类型: *Short*
    - **undisPrice**: 非打折项总额
      - 类型: *Long*
    - **disPrice**: 打折项总额
      - 类型: *Long*
    - **consPrice**: 工程总额
      - 类型: *Long*
    - **comsPrice**: 主材总额
      - 类型: *Long*
    - **manageRate**: 管理费比例
      - 类型: *Long*
    - **manageDiscount**: 管理费折扣 , 0: 不打折 , 1: 打折
      - 类型: *Short*
    - **managePrice**: 管理费
      - 类型: *Long*
    - **total**: 总价
      - 类型: *Long*
    - **status**: 状态 , 0: 初始 , 1: 锁定
      - 类型: *Short*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **content**: 说明
      - 类型: *String*
    
    ### <I> pageExtension

        分页方式获取拓展单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 拓展单信息列表 , 每条数据类型 *extension*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "eid": 1,
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
                            "creater": {
                                "uid": 1,
                                "createrId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师" 
                            },
                            "createTime": "2016-01-01",
                            "type": 0,
                            "atttype": 0,
                            "undisPrice": 1000.00,
                            "disPrice": 1000.00,
                            "consPrice": 0,
                            "comsPrice": 0,
                            "manageDiscount": 0,
                            "manageRate": 0,
                            "managePrice": 0,
                            "total": 4.53,
                            "status": 1,
                            "content": "主材拓展项"
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I> pageExtensionByOrderId

        分页方式获取拓展项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Requests:|
                :param extension.orderId: 装修单号
        :type extension.orderId: String
        
        Example::
        
            {
                "extension.orderId": "1601010001"
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 拓展项信息列表 , 每条数据类型 *extension*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "eid": 1,
                            "orderId": "1601010001",
                            "creater": {
                                "uid": 1,
                                "createrId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师" 
                            },
                            "createTime": "2016-01-01",
                            "type": 0,
                            "atttype": 0,
                            "undisPrice": 1000.00,
                            "disPrice": 1000.00,
                            "consPrice": 0,
                            "comsPrice": 0,
                            "manageDiscount": 0,
                            "manageRate": 0,
                            "managePrice": 0,
                            "total": 4.53,
                            "status": 1,
                            "content": "拓展项"
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <I> queryExtensionByEid

        通过拓展项ID获取拓展项信息
        
                |Requests:|
                :param extension.eid: 拓展单ID
        :type extension.eid: Long
        
        Example::
        
            {
                "extension.eid": 1
            }
            
                |Returns:|
                - **extensions**: 拓展项信息列表 , 每条数据类型 *extension*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "extensions": [
                    {
                        "eid": 1,
                        "orderId": "1601010001",
                        "creater": {
                            "uid": 1,
                            "createrId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师" 
                        },
                        "createTime": "2016-01-01",
                        "type": 0,
                        "atttype": 0,
                        "undisPrice": 1000.00,
                        "disPrice": 1000.00,
                        "consPrice": 0,
                        "comsPrice": 0,
                        "manageDiscount": 0,
                        "manageRate": 0,
                        "managePrice": 0,
                        "total": 4.53,
                        "status": 1,
                        "content": "拓展项"
                    }
                ],
                ...
            }
            
    ### <I> queryExtensionByOrderId

        通过装修单号获取拓展项信息
        
                |Requests:|
                :param extension.orderId: 装修单号
        :type extension.orderId: String
        
        Example::
        
            {
                "extension.orderId": "1601010001"
            }
            
                |Returns:|
                - **extensions**: 拓展项信息列表 , 每条数据类型 *extension*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "extensions": [
                    {
                        "eid": 1,
                        "orderId": "1601010001",
                        "creater": {
                            "uid": 1,
                            "createrId": "U001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "duty": "设计师" 
                        },
                        "createTime": "2016-01-01",
                        "type": 0,
                        "atttype": 0,
                        "undisPrice": 1000.00,
                        "disPrice": 1000.00,
                        "consPrice": 0,
                        "comsPrice": 0,
                        "manageDiscount": 0,
                        "manageRate": 0,
                        "managePrice": 0,
                        "total": 4.53,
                        "status": 1,
                        "content": "拓展项"
                    }
                ],
                ...
            }
            
    ### <I> addExtension

        添加拓展项信息
        
        判断添加拓展项归属装修单状态 , 已签约 , 废单 , 已完工 , 合同终止 , 不能添加 , 错误信息 **140049 装修单状态,可操作**
        
                |Requests:|
                :param extension.orderId: 装修单号
        :type extension.orderId: String
        :param extension.type: 类型 , 0: 增项 , 1: 减项
        :type extension.type: Short
        :param extension.atttype: 业务类型
        :type extension.atttype: Short
        :param extension.content: 说明
        :type extension.content: String
        
        Example::
        
            {
                "extension.orderId": "1601010001",
                "extension.type": 0,
                "extension.atttype": 0,
                "extension.content": ""
            }
        
    ### <I> updateExtension

        更新扩展信息
        
        判断扩展信息是否存在 , 不存在 , 错误信息 **200026 扩展信息不存在**
        
        判断添加拓展项归属装修单状态 , 已签约 , 重签合同 , 废单 , 已完工 , 合同终止 , 不能添加 , 错误信息 **140049 装修单状态,可操作**
        
                |Requests:|
                :param extension.eid: 拓展单ID
        :type extension.eid: Long
        :param extension.content: 说明
        :type extension.content: String
        
        Example::
        
            {
                "extension.eid": 1,
                "extension.content": ""
            }
            
    ### <I> updateExtensionForAdvance

        更新拓展项高级信息
        
        判断扩展信息是否存在 , 不存在 , 错误信息 **200026 扩展信息不存在**
        
        判断添加拓展项归属装修单状态 , 已签约 , 重签合同 , 废单 , 已完工 , 合同终止 , 不能添加 , 错误信息 **140049 装修单状态,可操作**
        
                |Requests:|
                :param extension.eid: 拓展单ID
        :type extension.eid: Long
        :param extension.undisPrice: 非打折项总额
        :type extension.undisPrice: Long
        :param extension.disPrice: 打折项总额
        :type extension.disPrice: Long
        :param extension.consPrice: 工程总额
        :type extension.consPrice: Long
        :param extension.comsPrice: 主材总额
        :type extension.comsPrice: Long
        :param extension.manageDiscount: 管理费折扣
        :type extension.manageDiscount: Short
        :param extension.manageRate: 管理费比例
        :type extension.manageRate: Integer
        :param extension.managePrice: 管理费
        :type extension.managePrice: Integer
        :param extension.total: 总价
        :type extension.total: Long
        
        Example::
        
            {
                "extension.eid": 1,
                "extension.undisPrice": 100,
                "extension.disPrice": 100,
                "extension.consPrice": 100,
                "extension.comsPrice": 100,
                "extension.manageDiscount": 0,
                "extension.manageRate": 0,
                "extension.managePrice": 0,
                "extension.total": 100
            }

    ### <I> deleteExtension

        删除拓展项信息
        
        判断扩展信息是否存在 , 不存在 , 错误信息 **200026 扩展信息不存在**
        
        判断是否存在关联选材项 , 如果存在 , 错误信息 **200037 存在关联选材项**
        
        判断添加拓展项归属装修单状态 , 已签约 , 重签合同 , 废单 , 已完工 , 合同终止 , 不能添加 , 错误信息 **140049 装修单状态,可操作**
        
                |Requests:|
                :param extension.eid: 拓展单ID
        :type extension.eid: Long

        Example::
        
            {
                "extension.eid": 1
            }

### 项目

## api.quotation.ExtensionItemAction

        |DataType:|
        #### extensionItem

    - **eiid**: ID
      - 类型: *Long*
    - **eid**: 拓展项ID
      - 类型: *Long*
    - **itemName**: 名称
      - 类型: *String*
    - **type**: 类型 , 0: 数据报价项(增项) , 1: 自定义(增项) , 2: 数据报价项(减项) , 3: 自定义(减项) , 4: 报价中项(减项), 5: 报价中项(增项)
      - 类型: *Short*
    - **subtype**: 子类 , 0: 其他 , 1: 工程 , 2: 主材 , 3: 套餐 , 4: 家具 , 5: 电器 , 6: 灯具 , 7: 软装
      - 类型: *Short*
    - **measurementUnit**: 单位
      - 类型: *String*
    - **workType**: 工种
      - 类型: *String*
    - **discount**: 打折标识 , 0: 不打折, 1: 打折
      - 类型: *Short*
    - **addPrice**: 增补价
      - 类型: *Integer*
    - **unitPrice**: 单价
      - 类型: *Integer*
    - **subPrice**: 退减价
      - 类型: *Integer*
    - **initnum**: 初始量
      - 类型: *Integer*
    - **num**: 工程量
      - 类型: *Integer*
    - **quotationFunctionAreaId**: 所属功能区ID
      - 类型: *Long*
    - **quotationFunctionAreaName**: 所属功能区
      - 类型: *String*
    - **quoteItemId**: 引用项ID
      - 类型: *Long*
    - **qiid**: 报价项ID (数据)
      - 类型: *Long*
    - **content**: 说明
      - 类型: *String*
    
    ### <I> queryExtensionItemByEid

        通过拓展项ID获取包含的报价项信息
    
                |Requests:|
                :param extension.eid: 拓展项ID
        :type extension.eid: Long
        
        Example::
        
            {
                "extension.eid": 1
            }
            
                |Returns:|
                - **extensionItems**: 拓展项中报价项信息列表 , 类型 *extensionItem*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "extensionItems": [
                    {
                        "eiid": 1,
                        "eid": 1,
                        "content": "说明信息",
                        "itemName": "原墙体建筑大白铲除",
                        "measurementUnit": "米",
                        "initnum": 1000,
                        "num": 1000,
                        "quotationFunctionAreaId": 2,
                        "quoteItemId": 3,
                        "qiid": 0,
                        "discount": 0,
                        "addPrice": 10,
                        "unitPrice": 10,
                        "subPrice": 10,
                        "workType": "油"
                    }
                ]
                ...
            }

    ### <I> queryExtensionItemByOrderId

        通过装修单号获取扩展项信息
        
                |Requests:|
                :param extension.orderId: 装修单号
        :type extension.orderId: String
        
        Example::
        
            {
                "extension.orderId": "1601010001"
            }
            
                |Returns:|
                - **extensionItems**: 拓展项中报价项信息列表 , 类型 *extensionItem*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "extensionItems": [
                    {
                        "eiid": 1,
                        "eid": 1,
                        "content": "说明信息",
                        "itemName": "原墙体建筑大白铲除",
                        "measurementUnit": "米",
                        "initnum": 1000,
                        "num": 1000,
                        "quotationFunctionAreaId": 2,
                        "quoteItemId": 3,
                        "qiid": 0,
                        "discount": 0,
                        "addPrice": 10,
                        "unitPrice": 10,
                        "subPrice": 10,
                        "workType": "油"
                    }
                ]
                ...
            }
            
    ### <I> queryExtensionItemByEids

        通过拓展项ID列表获取包含的报价项信息
        
                |Requests:|
                :param extensionIds[n]: 拓展项ID列表 , 每条数据类型 Long
        :type extensionIds[n]: List
        
        Example::
        
            {
                "extensionIds[0]": 1,
                "extensionIds[1]": 2
            }
            
                |Returns:|
                - **extensionItems**: 拓展项中报价项信息列表 , 类型 *extensionItem*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "extensionItems": [
                    {
                        "eiid": 1,
                        "eid": 1,
                        "content": "说明信息",
                        "itemName": "原墙体建筑大白铲除",
                        "measurementUnit": "米",
                        "initnum": 1000,
                        "num": 1000,
                        "quotationFunctionAreaId": 2,
                        "quoteItemId": 3,
                        "qiid": 0,
                        "discount": 0,
                        "addPrice": 10,
                        "unitPrice": 10,
                        "subPrice": 10,
                        "workType": "油"
                    }
                ]
                ...
            }
    
    ### <I> updateExtensionItem

        更新拓展项中报价项信息 , 如果无对应信息 , 创建新信息
        
        判断添加拓展项归属装修单状态 , 已签约 , 重签合同 , 废单 , 已完工 , 合同终止 , 不能添加 , 错误信息 **140049 装修单状态,可操作**
        
        判断是否存在关联选材项 , 如果存在 , 错误信息 **200037 存在关联选材项**
        
        拓展项 , 增项类型 , 单价使用引用报价项的增补价 ; 减项类型 , 单价使用引用报价项的退减价
        
                |Requests:|
                :param extension.eid: 拓展项ID
        :type extension.eid: Long
        :param extension.undisPrice: 非打折项总额
        :type extension.undisPrice: Long
        :param extension.disPrice: 打折项总额
        :type extension.disPrice: Long
        :param extension.consPrice: 工程总额
        :type extension.consPrice: Long
        :param extension.comsPrice: 主材总额
        :type extension.comsPrice: Long
        :param extension.manageDiscount: 管理费折扣
        :type extension.manageDiscount: Short
        :param extension.manageRate: 管理费比例
        :type extension.manageRate: Integer
        :param extension.managePrice: 管理费
        :type extension.managePrice: Integer
        :param extension.total: 总价
        :type extension.total: Long
        
        :param extensionItem.eiid: 拓展项目ID
        :type extensionItem.eiid: Long
        :param extensionItem.eid: 增减项ID
        :type extensionItem.eid: Long
        :param extensionItem.measurementUnit: 单位
        :type extensionItem.measurementUnit: String
        :param extensionItem.workType: 工种
        :type extensionItem.workType: String
        :param extensionItem.discount: 打折标识
        :type extensionItem.discount: Short
        :param extensionItem.addPrice: 增补价
        :type extensionItem.addPrice: Integer
        :param extensionItem.unitPrice: 单价
        :type extensionItem.unitPrice: Integer
        :param extensionItem.subPrice: 退减价
        :type extensionItem.subPrice: Integer
        :param extensionItem.num: 工程量
        :type extensionItem.num: Integer
        :param extensionItem.quotationFunctionAreaId: 所属功能区ID
        :type extensionItem.quotationFunctionAreaId: Long
        :param extensionItem.quoteItemId: 引用项ID
        :type extensionItem.quoteItemId: Long
        :param extensionItem.content: 说明
        :type extensionItem.content: String
        
        Example::
        
            {
                "extension.eid": 1,
                "extension.undisPrice": 10000,
                "extension.disPrice": 1000,
                "extension.consPrice": 1000,
                "extension.comsPrice": 1000,
                "extension.manageDiscount": 0,
                "extension.manageRate": 0,
                "extension.managePrice": 0,
                "extension.total": 100,
                
                "extensionItem.eiid": 1,
                "extensionItem.itemName": "原墙体建筑大白铲除",
                "extensionItem.measurementUnit": "米",
                "extensionItem.num": 1,
                "extensionItem.quotationFunctionAreaId": 2,
                "extensionItem.quoteItemId": 3,
                "extensionItem.discount": 0,
                "extensionItem.addPrice": 10,
                "extensionItem.unitPrice": 10,
                "extensionItem.subPrice": 10,
                "extensionItem.workType": "油",
                "extensionItem.content": "信息"
            }
            
    ### <I> deleteExtensionItem

        删除增减项中报价项信息
        
        判断添加拓展项归属装修单状态 , 已签约 , 重签合同 , 废单 , 已完工 , 合同终止 , 不能添加 , 错误信息 **140049 装修单状态,可操作**
        
        判断是否存在关联选材项 , 如果存在 , 错误信息 **200037 存在关联选材项**
        
                |Requests:|
                :param extension.eid: 增减项ID
        :type extension.eid: Long
        :param extension.undisPrice: 非打折项总额
        :type extension.undisPrice: Long
        :param extension.disPrice: 打折项总额
        :type extension.disPrice: Long
        :param extension.consPrice: 工程总额
        :type extension.consPrice: Long
        :param extension.comsPrice: 主材总额
        :type extension.comsPrice: Long
        :param extension.manageDiscount: 管理费折扣
        :type extension.manageDiscount: Short
        :param extension.manageRate: 管理费比例
        :type extension.manageRate: Integer
        :param extension.managePrice: 管理费
        :type extension.managePrice: Integer
        :param extension.total: 总价
        :type extension.total: Long
        
        :param extensionItem.eiid: 拓展项目ID
        :type extensionItem.eiid: Long
        
        Example::
        
            {
                "extension.eid": 1,
                "extension.undisPrice": 100,
                "extension.disPrice": 100,
                "extension.consPrice": 100,
                "extension.comsPrice": 100,
                "extension.manageDiscount": 100,
                "extension.manageRate": 100,
                "extension.managePrice": 100,
                "extension.total": 100,
                
                "extensionItem.eiid": 1
            }

## 增减

装修单增减项信息管理

增减项中的报价项 , 类型为2(自定义项)需要说明信息 , 其他类型说明信息以及打折依据引用项进行获取
    
增项类型为0(标准报价项) , 2(自定义项) , 减项类型为1(系统定义项) , 3(报价中报价项) , 4(增项中报价项)

### 增减

## api.quotation.AddReduceAction

        |DataType:|
        #### addReduce

    - **arid**: 增减单ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **decoration**: 装修单 , 类型: [decoration](./decoration.html#api.data.DecorationAction.decoration)
      - 类型: *Object*
    - **dpid**: 装修款ID
      - 类型: *Long*
    - **type**: 类型 , 0: 增项 , 1: 减项
      - 类型: *Short*
    - **atttype**: 业务类型 , 0: 工程 , 1: 主材
      - 类型: *Short*
    - **paytype**: 付款类型 , 0: 付款 , 1: 下拨(增项) , 2: 特批(增项) , 3: 不退(减项)
      - 类型: *Short*
    - **discount**: 折扣
      - 类型: *Integer*
    - **manageRate**: 管理费比例
      - 类型: *Long*
    - **manageDiscount**: 管理费折扣 , 0: 不打折 , 1: 打折
      - 类型: *Short*
    - **managePrice**: 管理费
      - 类型: *Long*
    - **taxRate**: 税金比例
      - 类型: *Long*
    - **taxDiscount**: 税金折扣 , 0: 无税金 , 1: 管理税金 , 2: 总额税金
      - 类型: *Short*
    - **taxPrice**: 税金
      - 类型: *Long*
    - **undisPrice**: 不打折项总额 = ∑(工程量 * 不打折项折前单价)
      - 类型: *Long*
    - **disPrice**: 打折项总额 = ∑(工程量 * 打折项折前总价)
      - 类型: *Long*
    - **calPrice**: 计算总额
      - 类型: *Long*
    - **uncalPrice**: 非计算总额
      - 类型: *Long*
    - **consPrice**: 工程总额
      - 类型: *Long*
    - **comsPrice**: 主材总额
      - 类型: *Long*
    - **total**: 总价
      - 类型: *Long*
    - **schedule**: 进度 , 对应装修单状态
      - 类型: *Short*
    - **constructionNode**: 施工节点 , 包括: 0(初始) , 1(开工) , 2(完工) , 其他状态关联 [constructionNode](./data.html#api.data.ConstructionNodeAction.constructionNode)
      - 类型: *Long*
    - **status**: 状态 , 0: 初始 , 1: 提交 , 2: 已付款 , 3: 已确认
      - 类型: *Short*
    - **isAffirm**: 是否确认 , 0: 未确认 , 1: 客户确认
      - 类型: *Short*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **unpayTime**: 下拨时间
      - 类型: *Timestamp*
    - **confirmTime**: 确认时间
      - 类型: *Timestamp*
    - **sendTime**: 推送时间
      - 类型: *Timestamp*
    - **affirmTime**: 确认时间
      - 类型: *Timstamp*
    - **content**: 说明
      - 类型: *String*
    
        |Filters:|
        - **status**: 状态
      - 类型: *String*
    
    ### <I> pageAddReduce

        分页方式获取增减单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 增减单信息列表 , 每条数据类型 *addReduce*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "arid": 1,
                            "dpid": 2,
                            "orderId": "1601010001",
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
                            "type": 0,
                            "atttype": 0,
                            "paytype": 0,
                            "discount": 10000,
                            "manageRate": 0,
                            "manageDiscount": 0,
                            "managePrice": 0,
                            "taxRate": 0,
                            "taxDiscount": 0,
                            "taxPrice": 0,
                            "undisPrice": 0,
                            "disPrice": 0,
                            "calPrice": 0,
                            "uncalPrice": 0,
                            "consPrice": 0,
                            "comsPrice": 0,
                            "total": 4.53,
                            "schedule": 3,
                            "constructionNode": {
                                "cnid": 2,
                                "name": "铲大白"
                            },
                            "status": 1,
                            "isAffirm": 0,
                            "createTime": "2016-01-01",
                            "unpayTime": "2016-01-01",
                            "confirmTime": "2016-01-01",
                            "sendTime": "2016-01-01",
                            "affirmTime": "2016-01-01",
                            "content": "增项"
                        }
                    ],
                    ...
                },
                ...
            }
    
    ### <I> pageAddReduceByOrderId

        分页方式获取增减单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Requests:|
                :param addReduce.orderId: 装修单号
        :type addReduce.orderId: String
        
        Example::
        
            {
                "addReduce.orderId": "1601010001"
            }
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 增减单信息列表 , 每条数据类型 *addReduce*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "arid": 1,
                            "dpid": 2,
                            "orderId": "1601010001",
                            "type": 0,
                            "atttype": 0,
                            "paytype": 0,
                            "discount": 10000,
                            "manageRate": 0,
                            "manageDiscount": 0,
                            "managePrice": 0,
                            "taxRate": 0,
                            "taxDiscount": 0,
                            "taxPrice": 0,
                            "undisPrice": 0,
                            "disPrice": 0,
                            "calPrice": 0,
                            "uncalPrice": 0,
                            "consPrice": 0,
                            "comsPrice": 0,
                            "total": 4.53,
                            "schedule": 3,
                            "constructionNode": {
                                "cnid": 2,
                                "name": "铲大白"
                            },
                            "status": 1,
                            "isAffirm": 0,
                            "createTime": "2016-01-01",
                            "unpayTime": "2016-01-01",
                            "confirmTime": "2016-01-01",
                            "sendTime": "2016-01-01",
                            "affirmTime": "2016-01-01",
                            "content": "增项"
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <I> queryAddReduceByOrderId

        通过装修单号获取增减单信息
        
                |Requests:|
                :param addReduce.orderId: 装修单号
        :type addReduce.orderId: String
        
        Example::
        
            {
                "addReduce.orderId": "1601010001"
            }
            
                |Returns:|
                - **addReduces**: 增减单信息列表 , 每条数据类型 *addReduce*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "addReduces": [
                    {
                        "arid": 1,
                        "dpid": 2,
                        "orderId": "1601010001",
                        "type": 0,
                        "atttype": 0,
                        "paytype": 0,
                        "discount": 10000,
                        "manageRate": 0,
                        "manageDiscount": 0,
                        "managePrice": 0,
                        "taxRate": 0,
                        "taxDiscount": 0,
                        "taxPrice": 0,
                        "undisPrice": 0,
                        "disPrice": 0,
                        "calPrice": 0,
                        "uncalPrice": 0,
                        "consPrice": 0,
                        "comsPrice": 0,
                        "total": 0,
                        "schedule": 3,
                        "constructionNode": {
                            "cnid": 2,
                            "name": "铲大白"
                        },
                        "status": 1,
                        "isAffirm": 0,
                        "createTime": "2016-01-01",
                        "unpayTime": "2016-01-01",
                        "confirmTime": "2016-01-01",
                        "sendTime": "2016-01-01",
                        "affirmTime": "2016-01-01",
                        "content": "增项"
                    }
                ],
                ...
            }
            
    ### <I> queryAddReduceForPayedByOrderId

        通过装修单号获取款项状态为已付款和已确认的增减单信息
        
                |Requests:|
                :param addReduce.orderId: 装修单号
        :type addReduce.orderId: String
        
        Example::
        
            {
                "addReduce.orderId": "1601010001"
            }
            
                |Returns:|
                - **addReduces**: 增减单信息列表 , 每条数据类型 *addReduce*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "addReduces": [
                    {
                        "arid": 1,
                        "dpid": 2,
                        "orderId": "1601010001",
                        "type": 0,
                        "atttype": 0,
                        "paytype": 0,
                        "discount": 10000,
                        "manageRate": 0,
                        "manageDiscount": 0,
                        "managePrice": 0,
                        "taxRate": 0,
                        "taxDiscount": 0,
                        "taxPrice": 0,
                        "undisPrice": 0,
                        "disPrice": 0,
                        "calPrice": 0,
                        "uncalPrice": 0,
                        "consPrice": 0,
                        "comsPrice": 0,
                        "total": 0,
                        "schedule": 3,
                        "constructionNode": {
                            "cnid": 2,
                            "name": "铲大白"
                        },
                        "status": 1,
                        "isAffirm": 0,
                        "createTime": "2016-01-01",
                        "unpayTime": "2016-01-01",
                        "confirmTime": "2016-01-01",
                        "sendTime": "2016-01-01",
                        "affirmTime": "2016-01-01",
                        "content": "增项"
                    }
                ],
                ...
            }
            
    ### <I> queryAddReduceByArid

        通过增减单ID获取增减单信息
        
                |Requests:|
                :param addReduce.arid: 增减单ID
        :type addReduce.arid: Long
        
        Example::
        
            {
                "addReduce.arid": 1
            }
            
                |Returns:|
                - **addReduce**: 增减单信息 , 数据类型 *addReduce*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "addReduce": {
                    "arid": 1,
                    "dpid": 2,
                    "orderId": "1601010001",
                    "type": 0,
                    "atttype": 0,
                    "paytype": 0,
                    "discount": 10000,
                    "manageRate": 0,
                    "manageDiscount": 0,
                    "managePrice": 0,
                    "taxRate": 0,
                    "taxDiscount": 0,
                    "taxPrice": 0,
                    "undisPrice": 0,
                    "disPrice": 0,
                    "calPrice": 0,
                    "uncalPrice": 0,
                    "consPrice": 0,
                    "comsPrice": 0,
                    "total": 0,
                    "schedule": 3,
                    "constructionNode": {
                        "cnid": 2,
                        "name": "铲大白"
                    },
                    "status": 1,
                    "isAffirm": 0,
                    "createTime": "2016-01-01",
                    "unpayTime": "2016-01-01",
                    "confirmTime": "2016-01-01",
                    "sendTime": "2016-01-01",
                    "affirmTime": "2016-01-01",
                    "content": "增项"
                }
                ...
            }
    
    ### <I> queryAddReduceByDpid

        通过款项ID获取增减单信息
        
                |Requests:|
                :param addReduce.dpid: 款项ID
        :type addReduce.dpid: Long
        
        Example::
        
            {
                "addReduce.dpid": 2
            }
            
                |Returns:|
                - **addReduces**: 增减单信息列表 , 每条数据类型 *addReduce*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "addReduces": [
                    {
                        "arid": 1,
                        "dpid": 2,
                        "orderId": "1601010001",
                        "type": 0,
                        "atttype": 0,
                        "paytype": 0,
                        "discount": 10000,
                        "manageRate": 0,
                        "manageDiscount": 0,
                        "managePrice": 0,
                        "taxRate": 0,
                        "taxDiscount": 0,
                        "taxPrice": 0,
                        "undisPrice": 0,
                        "disPrice": 0,
                        "calPrice": 0,
                        "uncalPrice": 0,
                        "consPrice": 0,
                        "comsPrice": 0,
                        "total": 0,
                        "schedule": 3,
                        "constructionNode": {
                            "cnid": 2,
                            "name": "铲大白"
                        },
                        "status": 1,
                        "isAffirm": 0,
                        "createTime": "2016-01-01",
                        "unpayTime": "2016-01-01",
                        "confirmTime": "2016-01-01",
                        "sendTime": "2016-01-01",
                        "affirmTime": "2016-01-01",
                        "content": "增项"
                    }
                ],
                ...
            }

    ### <I> addAddReduce

        添加增减单
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**
        
                |Requests:|
                :param addReduce.orderId: 装修单号
        :type addReduce.orderId: String
        :param addReduce.type: 类型 , 0: 增项 , 1: 减项
        :type addReduce.type: Short
        :param addReduce.atttype: 业务类型
        :type addReduce.atttype: Short
        :param addReduce.content: 说明
        :type addReduce.content: String
        
        Example::
        
            {
                "addReduce.orderId": "1601010001",
                "addReduce.type": 0,
                "addReduce.atttype": 0,
                "addReduce.content": ""
            }
        
    ### <I> updateAddReduce

        更新增减单
        
        判断增减单是否存在 , 不存在 , 错误信息 **200060 增减单不存在**
        
        判断增减单状态是否为0(初始)/1(提交) , 其他状态 , 错误信息 **200061 增减单状态不可操作**
        
                |Requests:|
                :param addReduce.arid: 增减单ID
        :type addReduce.arid: Short
        :param addReduce.undisPrice: 不打折总额
        :type addReduce.undisPrice: Long
        :param addReduce.disPrice: 打折总额
        :type addReduce.disPrice: Long
        :param addReduce.uncalPrice: 非配比总额
        :type addReduce.uncalPrice: Long
        :param addReduce.calPrice: 配比总额
        :type addReduce.calPrice: Long
        :param addReduce.consPrice: 工程总额
        :type addReduce.consPrice: Long
        :param addReduce.comsPrice: 主材总额
        :type addReduce.comsPrice: Long
        
        Example::
        
            {
                "addReduce.arid": 1,
                "addReduce.undisPrice": 1000000,
                "addReduce.disPrice": 0,
                "addReduce.uncalPrice": 0,
                "addReduce.calPrice": 1000000,
                "addReduce.consPrice": 0,
                "addReduce.comsPrice": 0
            }
            
    ### <I> updateAddReduceForAdvance

        更新增减单
        
        判断增减单是否存在 , 不存在 , 错误信息 **200060 增减单不存在**
        
        判断增减单状态是否为0(初始)/1(提交) , 其他状态 , 错误信息 **200061 增减单状态不可操作**
        
                |Requests:|
                :param addReduce.arid: 增减单ID
        :type addReduce.arid: Integer
        :param addReduce.total: 总价
        :type addReduce.total: Long
        :param addReduce.manageRate: 管理费比例
        :type addReduce.manageRate: Long
        :param addReduce.manageDiscount: 管理费折扣
        :type addReduce.manageDiscount: Short
        :param addReduce.managePrice: 管理费
        :type addReduce.managePrice: Long
        :param addReduce.taxRate: 税金比例
        :type addReduce.taxRate: Long
        :param addReduce.taxDiscount: 税金折扣
        :type addReduce.taxDiscount: Short
        :param addReduce.taxPrice: 管理费
        :type addReduce.taxPrice: Long
        :param addReduce.undisPrice: 非打折项总额
        :type addReduce.undisPrice: Long
        :param addReduce.disPrice: 打折项总额
        :type addReduce.disPrice: Long
        :param addReduce.uncalPrice: 非配比总额
        :type addReduce.uncalPrice: Long
        :param addReduce.calPrice: 配比总额
        :type addReduce.calPrice: Long
        :param addReduce.consPrice: 工程总额
        :type addReduce.consPrice: Long
        :param addReduce.comsPrice: 主材总额
        :type addReduce.comsPrice: Long
        
        Example::
        
            {
                "addReduce.arid": 1,
                "addReduce.total": 100,
                "addReduce.manageRate": 1003
                "addReduce.manageDiscount": 0
                "addReduce.managePrice": 10,
                "addReduce.taxRate": 130
                "addReduce.taxDiscount": 0
                "addReduce.taxPrice": 0,
                "addReduce.undisPrice": 10,
                "addReduce.disPrice": 10,
                "addReduce.uncalPrice": 10,
                "addReduce.calPrice": 10,
                "addReduce.consPrice": 0,
                "addReduce.comsPrice": 0
            }

    ### <I> unpayAddReduce

        下拨
        
        判断增减单是否存在 , 不存在 , 错误信息 **200060 增减单不存在**
        
        判断增减单状态是否为0(初始)/1(提交) , 其他状态 , 错误信息 **200061 增减单状态不可操作**
        
        判断增减单类型是否为0(增项) , 其他类型 , 错误信息 **200062 增减单类型不可操作**
        
        判断增减单款项类型是否为0(付款) , 其他类型 , 错误信息 **200062 增减单类型不可操作**
        
                |Requests:|
                :param addReduce.arid: 增减单ID
        :type addReduce.arid: Long
        :param addReduce.paytype: 款项类型
        :type addReduce.paytype: Short
        
        Example::
        
            {
                "addReduce.arid": 1,
                "addReduce.paytype": 1
            }
    
    ### <I> confirmAddReduce

        确认
        
        判断增减单是否存在 , 不存在 , 错误信息 **200060 增减单不存在**
        
        判断增减单状态是否为0(初始)/1(提交) , 其他状态 , 错误信息 **200061 增减单状态不可操作**
        
        判断增减单款项类型是否为0(付款) , 类型匹配 , 错误信息 **200062 增减单类型不可操作**
        
                |Requests:|
                :param addReduce.arid: 增减单ID
        :type addReduce.arid: Long
        
        Example::
        
            {
                "addReduce.arid": 1
            }

    ### <I> sendAddReduce

        发送
        
                |Requests:|
                :param addReduces[n].arid: 增减单ID
        :type addReduces[n].arid: Long
        
        Example::
        
            {
                "addReduces[0].arid": 1
            }

    ### <C> affirmAddReduce

        确认
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**
        
        判断客户电话是否正确 , 不正确 , 错误信息 **客户电话不匹配**
        
                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoratoin.orderId: String
        :param decoration.customer.no: 编号
        :type decoration.customer.no: String
        
        :param addReduces[n].arid: 增减单ID
        :type addReduces[n].arid: Long
        
        Example::
        
            {
                "decoration.orderId": "1601010001",
                "decoration.customer.no": "",
                "addReduces[0].arid": 1
            }

    ### <I> submitAddReduce

        提交增减单
        
        判断增减单是否存在 , 不存在 , 错误信息 **200060 增减单不存在**
        
        判断增减单状态是否为0(初始) , 其他状态 , 错误信息 **200061 增减单状态不可操作**
        
        判断增减单是否存在关联装修款 , 已存在 , 错误信息 **150002 款项已存在**
        
        创建关联装修款 , 更新增减单状态为1(提交)
        
                |Requests:|
                :param addReduces[n].arid: 增减单ID
        :type addReduces[n].arid: Long
        
        Example::
        
            {
                "addReduces[n].arid": 1
            }

    ### <I> cancelAddReduce

        撤销增减单
        
        判断增减单是否存在 , 不存在 , 错误信息 **200060 增减单不存在**
        
        判断增减单状态是否为1(提交) , 其他状态 , 错误信息 **200061 增减单状态不可操作**
        
        判断关联装修款是否存在 , 不存在 , 错误信息 **150003 款项不存在**
        
        判断关联装修款状态是否为0(未付款) , 其他状态 , 错误信息 **150019 款项不能撤销**
        
        删除关联装修款 , 更新增减单状态为0(初始)
        
                |Requests:|
                :param addReduce.dpid: 装修款ID
        :type addReduce.dpid: Long
        
        Example::
        
            {
                "addReduce.dpid": 1
            }
            
    ### <I> deleteAddReduce

        删除增减单信息 , 只有初始和提交状态能够进行删除动作
        
        判断增减单是否存在 , 不存在 , 错误信息 **200060 增减单不存在**
        
        判断增减单状态是否为0(初始)/1(提交) , 其他状态 , 错误信息 **200061 增减单状态不可操作**
        
        判断是否存在关联选材项 , 如果存在 , 错误信息 **200037 存在关联选材项**
        
        判断是否存在关联报价项 , 获取失败 , 错误信息 **200013 报价项不存在**
        
        判断是否存在关联增减项 , 获取失败 , 错误信息 **140036 增减项不存在**
        
        判断是否存在关联扩展项 , 获取失败 , 错误信息 **200027 扩展项不存在**
        
        删除动作需要判断增减单状态 , 状态为初始和提交能够完成删除动作 , 同时需要将删除引用的报价项的工程量增加回原引用项目

                |Requests:|
                :param addReduce.arid: 增减单ID
        :type addReduce.arid: Long

        Example::
        
            {
                "addReduce.arid": 1
            }

### 项目

## api.quotation.AddReduceItemAction

        |DataType:|
        #### addReduceItem

    - **ariid**: 报价项ID
      - 类型: *Long*
    - **arid**: 增减单ID
      - 类型: *Long*
    - **itemName**: 名称
      - 类型: *String*
    - **type**: 类型 , 0: 标准报价项 , 1: 系统定义项 , 2: 自定义项 , 3: 报价中报价项 , 4: 增项中报价项 , 5: 拓展中报价项
      - 类型: *Short*
    - **subtype**: 子类 , 0: 其他 , 1: 工程 , 2: 主材 , 3: 套餐 , 4: 家具 , 5: 电器 , 6: 灯具 , 7: 软装
      - 类型: *Short*
    - **itemtype**: 项目类型 , 0: 标准 , 1: 成本
      - 类型: *Short*
    - **measurementUnit**: 单位
      - 类型: *String*
    - **workType**: 工种
      - 类型: *String*
    - **discount**: 折扣标识 , 0: 不打折 , 1: 打折 , 2: 不打折(非配比) , 3: 打折(非配比)
      - 类型: *Short*
    - **addPrice**: 增补价
      - 类型: *Integer*
    - **unitPrice**: 单价
      - 类型: *Integer*
    - **subPrice**: 退减价
      - 类型: *Integer*
    - **initnum**: 初始量
      - 类型: *Integer*
    - **num**: 工程量
      - 类型: *Integer*
    - **quotationFunctionAreaId**: 所属功能区ID
      - 类型: *Long*
    - **quotationFunctionAreaName**: 所属功能区
      - 类型: *String*
    - **quoteItemId**: 引用项ID
      - 类型: *Long*
    - **qiid**: 报价项ID (数据)
      - 类型: *Long*
    - **content**: 说明
      - 类型: *String*

    ### <I> queryAddReduceItemByAddReduceId

        通过增减单ID获取增减项中包含的报价项信息
    
                |Requests:|
                :param addReduce.arid: 增减单ID
        :type addReduce.arid: Long
        
        Example::
        
            {
                "addReduce.arid": 1
            }
            
                |Returns:|
                - **addReduceItems**: 增减项信息列表 , 类型 *addReduceItem*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "addReduceItems": [
                    {
                        "ariid": 1,
                        "arid": 1,
                        "itemName": "原墙体建筑大白铲除",
                        "type": 0,
                        "subtype": 1,
                        "itemtype": 1,
                        "measurementUnit": "米",
                        "workType": "油",
                        "discount": 0,
                        "addPrice": 10,
                        "unitPrice": 10,
                        "subPrice": 10,
                        "initnum": 1000,
                        "num": 1000,
                        "quotationFunctionAreaId": 2,
                        "quotationFunctionAreaName": "门厅",
                        "quoteItemId": 3,
                        "qiid": 0,
                        "content": "说明信息"
                    }
                ]
                ...
            }

    ### <I> queryAddReduceItemByOrderId

        通过增减单ID列表获取增减项中包含的报价项信息
        
                |Requests:|
                :param addReduce.orderId: 装修单号
        :type addReduce.orderId: String
        
        Example::
        
            {
                "addReduce.orderId": "1601010001"
            }
            
                |Returns:|
                - **addReduceItems**: 增减项信息列表 , 类型 *addReduceItem*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "addReduceItems": [
                    {
                        "ariid": 1,
                        "arid": 1,
                        "itemName": "原墙体建筑大白铲除",
                        "type": 0,
                        "subtype": 1,
                        "itemtype": 1,
                        "measurementUnit": "米",
                        "workType": "油",
                        "discount": 0,
                        "addPrice": 10,
                        "unitPrice": 10,
                        "subPrice": 10,
                        "initnum": 1000,
                        "num": 1000,
                        "quotationFunctionAreaId": 2,
                        "quotationFunctionAreaName": "门厅",
                        "quoteItemId": 3,
                        "qiid": 0,
                        "content": "说明信息"
                    }
                ]
                ...
            }
            
    ### <I> queryAddReduceItemByAddReduceIds

        通过增减单ID列表获取增减项中包含的报价项信息
        
                |Requests:|
                :param addReduceIds[n]: 增减单ID列表 , 每条数据类型 Integer
        :type addReduceIds[n]: List
        
        Example::
        
            {
                "addReduceIds[0]": 1,
                "addReduceIds[1]": 2
            }
            
                |Returns:|
                - **addReduceItems**: 增减项信息列表 , 类型 *addReduceItem*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "addReduceItems": [
                    {
                        "ariid": 1,
                        "arid": 1,
                        "itemName": "原墙体建筑大白铲除",
                        "type": 0,
                        "subtype": 1,
                        "itemtype": 1,
                        "measurementUnit": "米",
                        "workType": "油",
                        "discount": 0,
                        "addPrice": 10,
                        "unitPrice": 10,
                        "subPrice": 10,
                        "initnum": 1000,
                        "num": 1000,
                        "quotationFunctionAreaId": 2,
                        "quotationFunctionAreaName": "门厅",
                        "quoteItemId": 3,
                        "qiid": 0,
                        "content": "说明信息"
                    }
                ]
                ...
            }
            
    ### <I> updateAddReduceItem

        更新增减项中报价项信息 , 如果无对应信息 , 创建新信息
        
        判断是否存在关联选材项 , 如果存在 , 错误信息 **200037 存在关联选材项**
        
        类型为3(报价中报价项)和4(增项中报价项) , 增减项类型为减项 , 需要减去引用的项目工程量 , 同时判断引用项工程量
        
        增减项 , 增项类型 , 单价使用引用报价项的增补价 ; 减项类型 , 单价使用引用报价项的退减价
        
                |Requests:|
                :param addReduce.arid: 增减单ID
        :type addReduce.arid: Long
        :param addReduce.total: 总价
        :type addReduce.total: Long
        :param addReduce.manageRate: 管理费比例
        :type addReduce.manageRate: Long
        :param addReduce.managePrice: 管理费
        :type addReduce.managePrice: Long
        :param addReduce.undisPrice: 非打折项总额
        :type addReduce.undisPrice: Long
        :param addReduce.disPrice: 打折项总额
        :type addReduce.disPrice: Long
        :param addReduce.uncalPrice: 非配比总额
        :type addReduce.uncalPrice: Long
        :param addReduce.calPrice: 配比总额
        :type addReduce.calPrice: Long
        :param addReduce.consPrice: 工程总额
        :type addReduce.consPrice: Long
        :param addReduce.comsPrice: 主材总额
        :type addReduce.comsPrice: Long
        
        :param addReduceItem.ariid: 报价项ID
        :type addReduceItem.ariid: Long
        :param addReduceItem.arid: 增减项ID
        :type addReduceItem.arid: Long
        :param addReduceItem.type: 类型 , 0: 标准报价项 , 1: 系统定义项 , 2: 自定义项 , 3: 报价中报价项 , 4: 增项中报价项
        :type addReduceItem.type: Short
        :param addReduceItem.measurementUnit: 单位
        :type addReduceItem.measurementUnit: String
        :param addReduceItem.workType: 工种
        :type addReduceItem.workType: String
        :param addReduceItem.discount: 折扣
        :type addReduceItem.discount: Short
        :param addReduceItem.addPrice: 增补价
        :type addReduceItem.addPrice: Integer
        :param addReduceItem.unitPrice: 单价
        :type addReduceItem.unitPrice: Integer
        :param addReduceItem.subPrice: 退减价
        :type addReduceItem.subPrice: Integer
        :param addReduceItem.num: 工程量
        :type addReduceItem.num: Integer
        :param addReduceItem.quotationFunctionAreaId: 所属功能区ID
        :type addReduceItem.quotationFunctionAreaId: Long
        :param addReduceItem.quotationFunctionAreaName: 所属功能区
        :type addReduceItem.quotationFunctionAreaName: String
        :param addReduceItem.quoteItemId: 引用项ID
        :type addReduceItem.quoteItemId: Long
        :param addReduceItem.content: 说明
        :type addReduceItem.content: String
        
        Example::
        
            {
                "addReduce.arid": 1,
                "addReduce.total": 100,
                "addReduce.manageRate": 1003
                "addReduce.managePrice": 10,
                "addReduce.undisPrice": 10,
                "addReduce.disPrice": 10,
                "addReduce.uncalPrice": 10,
                "addReduce.calPrice": 10,
                "addReduce.consPrice": 0,
                "addReduce.comsPrice": 0,
                
                "addReduceItem.ariid": 1,
                "addReduceItem.itemName": "原墙体建筑大白铲除",
                "addReduceItem.type": 0,
                "addReduceItem.subtype": 1,
                "addReduceItem.itemtype": 1,
                "addReduceItem.measurementUnit": "米",
                "addReduceItem.workType": "油"
                "addReduceItem.discount": 0,
                "addReduceItem.addPrice": 10,
                "addReduceItem.unitPrice": 10,
                "addReduceItem.subPrice": 10,
                "addReduceItem.num": 1,
                "addReduceItem.quotationFunctionAreaId": 2,
                "addReduceItem.quoteItemId": 3,
                "addReduceItem.qiid": 3,
                "addReduceItem.content": "说明信息",
            }

    ### <I> updateAddReduceItemForAdvance

        更新增减项项目信息
        
        根据打折标识更新增减项的配比计算值
        
        判断增减单是否存在 , 不存在 , 错误信息 **140018 增减单不存在**
        
        判断增减项是否存在 , 不存在 , 错误信息 **140036 增减项不存在**
        
                |Requests:|
                :param addReduce.arid: 增减单ID
        :type addReduce.arid: Long
        :param addReduce.uncalPrice: 非配比总额
        :type addReduce.uncalPrice: Long
        :param addReduce.calPrice: 配比总额
        :type addReduce.calPrice: Long
        
        :param addReduceItem.ariid: 报价项ID
        :type addReduceItem.ariid: Long
        :param addReduceItem.discount: 打折标识
        :type addReduceItem.discount: Long
        
        Example::
        
            {
                "addReduce.arid": 1,
                "addReduce.uncalPrice": 0,
                "addReduce.calPrice": 0,
                
                "addReduceItem.ariid": 1,
                "addReduceItem.discount": 1
            }

    ### <I> deleteAddReduceItem

        删除增减项
        
        判断是否存在关联选材项 , 如果存在 , 错误信息 **200037 存在关联选材项**
        
        删除动作需要判断当前增减单的状态 , 状态为初始以及提交状态能够完成删除动作
        
                |Requests:|
                :param addReduce.arid: 增减单ID
        :type addReduce.arid: Long
        :param addReduce.total: 总价
        :type addReduce.total: Long
        :param addReduce.manageRate: 管理费比例
        :type addReduce.manageRate: Long
        :param addReduce.managePrice: 管理费
        :type addReduce.managePrice: Long
        :param addReduce.undisPrice: 非打折项总额
        :type addReduce.undisPrice: Long
        :param addReduce.disPrice: 打折项总额
        :type addReduce.disPrice: Long
        :param addReduce.uncalPrice: 非配比总额
        :type addReduce.uncalPrice: Long
        :param addReduce.calPrice: 配比总额
        :type addReduce.calPrice: Long
        :param addReduce.consPrice: 工程总额
        :type addReduce.consPrice: Long
        :param addReduce.comsPrice: 主材总额
        :type addReduce.comsPrice: Long
        
        :param addReduceItem.ariid: 报价项ID
        :type addReduceItem.ariid: Long
        
        Example::
        
            {
                "addReduce.arid": 1,
                "addReduce.total": 100,
                "addReduce.manageRate": 1003
                "addReduce.managePrice": 10,
                "addReduce.undisPrice": 10,
                "addReduce.disPrice": 10,
                "addReduce.uncalPrice": 10,
                "addReduce.calPrice": 10,
                "addReduce.consPrice": 0,
                "addReduce.comsPrice": 0,
                
                "addReduceItem.ariid": 1
            }

## 选材

装修单报价过程拓展项目处理过程 , 主要使用在订单类型为整装的处理过程

### 选材

## api.quotation.SelectionAction

        |DataType:|
        #### selection

    - **sid**: 选材单ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **decoration**: 装修单 , 类型: [decoration](./decoration.html#api.data.DecorationAction.decoration)
      - 类型: *Object*
    - **qid**: 报价ID
      - 类型: *Long*
    - **status**: 状态 , 0: 初始 , 1: 锁定
      - 类型: *Short*
    - **isAffirm**: 是否确认 , 0: 未确认 , 1: 客户确认
      - 类型: *Short*
    - **total**: 总额
      - 类型: *Long*
    - **quotationTotal**: 报价总额
      - 类型: *Long*
    - **extensionAddTotal**: 拓展总额
      - 类型: *Long*
    - **extensionReduceTotal**: 拓展总额
      - 类型: *Long*
    - **addReduceAddTotal**: 增减总额
      - 类型: *Long*
    - **addReduceMinusTotal**: 增减总额
      - 类型: *Long*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **splitter**: 拆单员 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **traner**: 下单人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **affirmTime**: 确认时间
      - 类型: *Timestamp*
    - **company**: 公司ID
      - 类型: *Integer*
    
    ### <I> pageSelection

        分页方式获取选材单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 选材单信息列表 , 每条数据类型 *selection*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "sid": 1,
                            "orderId": "1601010001,
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
                            "qid": 1,
                            "total": 10000,
                            "quotationTotal": 10000,
                            "extensionTotal": 0,
                            "addReductTotal": 0,
                            "creater": {
                                "uid": 1,
                                "createrId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师" 
                            },
                            "splitter": {
                                "uid": 11,
                                "userId": "U011",
                                "userName": "配送人",
                                "currentName": "配送人",
                                "duty": "配送人"
                            },
                            "traner": {
                                "uid": 11,
                                "userId": "U011",
                                "userName": "配送人",
                                "currentName": "配送人",
                                "duty": "配送人"
                            },
                            "createTime": "2016-01-01"
                        }
                    ],
                    ...
                },
                ...
            }
    
    ### <I> querySelectionByOrderId

        通过装修单号获取选材单 , 关联查询默认报价以及对应的选材单
        
        判断装修单的默认报价是否存在 , 不存在 , 错误信息 **200017 默认报价不存在**
        
        判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**
        
                |Requests:|
                :param selection.orderId: 装修单号
        :type selection.orderId: String
        
        Example::
        
            {
                "selection.orderId": "1601010001"
            }

                |Returns:|
                - **selection**: 选材单
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "selection": {
                    "sid": 1,
                    "orderId": "1601010001,
                    "qid": 1,
                    "total": 10000,
                    "quotationTotal": 10000,
                    "extensionTotal": 0,
                    "addReductTotal": 0,
                    "creater": {
                        "uid": 1,
                        "createrId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师" 
                    },
                    "splitter": {
                        "uid": 11,
                        "userId": "U011",
                        "userName": "配送人",
                        "currentName": "配送人",
                        "duty": "配送人"
                    },
                    "traner": {
                        "uid": 11,
                        "userId": "U011",
                        "userName": "配送人",
                        "currentName": "配送人",
                        "duty": "配送人"
                    },
                    "createTime": "2016-01-01"
                },
                ...
            }
            
    ### <I> querySelectionByQid

        通过报价ID获取选材单
        
        判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**
        
                |Requests:|
                :param selection.qid: 报价ID
        :type selection.qid: Long
        
        Example::
        
            {
                "selection.qid": 1
            }

                |Returns:|
                - **selection**: 选材单
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "selection": {
                    "sid": 1,
                    "orderId": "1601010001,
                    "qid": 1,
                    "total": 10000,
                    "quotationTotal": 10000,
                    "extensionTotal": 0,
                    "addReductTotal": 0,
                    "creater": {
                        "uid": 1,
                        "createrId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师" 
                    },
                    "splitter": {
                        "uid": 11,
                        "userId": "U011",
                        "userName": "配送人",
                        "currentName": "配送人",
                        "duty": "配送人"
                    },
                    "traner": {
                        "uid": 11,
                        "userId": "U011",
                        "userName": "配送人",
                        "currentName": "配送人",
                        "duty": "配送人"
                    },
                    "createTime": "2016-01-01"
                },
                ...
            }

    ### <I> addSelection

        创建选材单
        
        判断报价是否存在 , 不存在 , 错误信息 **200003 报价不存在**
        
                |Requests:|
                :param selection.qid: 报价ID
        :type selection.qid: Long
        
        Example::
        
            {
                "selection.qid": 1
            }
            

    ### <I> updateSelection

        更新选材单
        
        判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**
        
                |Requests:|
                :param selection.sid: 选材单ID
        :type selection.sid: Long
        :param selection.splitter.uid: 拆单员ID
        :type selection.splitter.uid: Long
        :param selection.traner.uid: 下单员ID
        :type selection.traner.uid: Long
        
        Example::
        
            {
                "selection.sid": 1,
                "selection.splitter.uid": 1,
                "selection.traner.uid": 1
            }

    ### <I> updateSelectionForAdvance

        更新选材单 , 主要针对各类总额更新
        
        判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**
        
        判断选材单状态为0(初始) , 其他状态 , 错误信息 **200036 选材单不可操作**
        
                |Requests:|
                :param selection.sid: 选材单ID
        :type selection.sid: Long
        :param selection.total: 总额
        :type selection.total: Long
        :param selection.quotationTotal: 报价总额
        :type selection.quotationTotal: Long
        :param selection.extensionTotal: 拓展总额
        :type selection.extensionTotal: Long
        :param selection.addReductTotal: 增减总额
        :type selection.addReductTotal: Long
        
        Example::
        
            {
                "selection.sid": 1,
                "selection.total": 10000,
                "selection.quotationTotal": 10000,
                "selection.extensionTotal": 0,
                "selection.addReductTotal": 0
            }
            
    ### <I> lockSelection

        锁定选材单
        
        判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**
        
        判断选材单状态为0(初始) , 其他状态 , 错误信息 **200036 选材单不可操作**
        
        更新选材单状态为1(锁定)
        
                |Requests:|
                :param selection.sid: 选材单ID
        :type selection.sid: Long
        
        Example::
        
            {
                "selection.sid": 1
            }

    ### <I> sendSelection

        推送
        
        判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**
        
                |Requests:|
                :param selection.sid: 选材单ID
        :type selection.sid: Long
        
        Example::
        
            {
                "selection.sid": 1
            }

    ### <C> affirmSelection

        确认
        
        判断装修单是否存在 , 不存在 , 错误信息 **140013 装修单不存在**
        
        判断客户电话是否正确 , 不正确 , 错误信息 **客户电话不匹配**
        
        判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**
        
                |Requests:|
                :param decoration.orderId: 装修单号
        :type decoration.orderId: String
        :param decoration.customer.no: 编号
        :type decoration.customer.no: String
        
        :param selection.sid: 选材单ID
        :type selection.sid: Long
        
        Example::
        
            {
                "decoration.orderId": "1601010001",
                "decoration.customer.no": "",
                "selection.sid": 1,
            }

### 项目

## api.quotation.SelectionItemAction

        |DataType:|
        #### selectionItem

    - **siid**: 选材项ID
      - 类型: *Long*
    - **decoration**: 装修单 , 类型: [decoration](./decoration.html#api.data.DecorationAction.decoration)
      - 类型: *Object*
    - **suid**: 厂商ID
      - 类型: *Long*
    - **sid**: 选材单ID
      - 类型: *Long*
    - **areaId**: 引用区ID , 包括三个类型 , 分别是功能区 , 拓展 , 增减
      - 类型: *Long*
    - **areaName**: 功能区名称
      - 类型: *String*
    - **quoteId**: 引用项ID , 包括四个类型 , 分别是报价项 , 拓展项 , 增减项 , 选材项
      - 类型: *Long*
    - **type**: 类型 , 0: 报价项 , 1: 拓展增 , 2: 拓展减 , 3: 增项增 , 4: 增项减 , 5: 选材项
      - 类型: *Short*
    - **goods**: 商品 , 类型: [goods](./data.html#api.data.GoodsAction.goods)
      - 类型: *Object*
    - **preprice**: 预算金额 , 通过报价项(原价) , 增项(增补价) , 减项(退减价)赋值
      - 类型: *Integer*
    - **postprice**: 结算价
      - 类型: *Integer*
    - **initnum**: 工程量
      - 类型: *Integer*
    - **num**: 数量
      - 类型: *Integer*
    - **refnum**: 退数量
      - 类型: *Integer*
    - **accountStatus**: 对账状态 , 0: 初始 , 1: 对账
      - 类型: *Short*
    - **status**: 状态 , 0: 初始(拆单), 1: 配送(下单), 2: 审核, 3: 确认, 4: 完结, 5: 核对, 6: 结算 , 7: 失效
      - 类型: *Short*
    - **createTime**: 创建时间(拆单时间)
      - 类型: *Timestamp*
    - **tranTime**: 配送时间(下单时间)
      - 类型: *Timestamp*
    - **checkTime**: 审核时间
      - 类型: *Timestamp*
    - **confirmTime**: 确认时间
      - 类型: *Timestamp*
    - **finishTime**: 完结时间
      - 类型: *Timestamp*
    - **balanceTime**: 结算时间
      - 类型: *Timestamp*
    - **accountTime**: 对账时间
      - 类型: *Timestamp*
    - **traner**: 配送人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **checker**: 审核人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **confirmer**: 确认人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **finisher**: 完结人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **balancer**: 结算人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **accounter**: 对账人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **comment**: 备注
      - 类型: *String*
    - **company**: 公司ID
      - 类型: *Integer*
    
    ### <I> pageSelectionItem

        分页方式获取选材项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 选材项信息列表 , 每条数据类型 *selectionItem*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "siid": 1,
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
                            "sid": 1,
                            "areaId": 1,
                            "quoteId": 1,
                            "goods": {
                                "gid": 1,
                                "no": "JGIDNEHDUIN5SD",
                                "name": "瓷砖",
                                "barcode": "254125212521251",
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "measurementUnit": "个",
                                "purchase": 100000,
                                "selling": 10000,
                                "pieceNum": 1,
                                "type": 0,
                                "checkup": 0,
                                "company": 0
                            },
                            "areaName": "功能区",
                            "preprice": 0,
                            "postprice": 0,
                            "initnum": 10000,
                            "num": 10000,
                            "refnum": 0,
                            "accountStatus": 0,
                            "status": 0,
                            "comment": "备注"
                            "tranTime": "2016-01-01 00:00:00",
                            "checkTime": "2016-01-01 00:00:00",
                            "confirmTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "accountTime": "2016-01-01 00:00:00",
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
                            },
                            "balancer": {
                                "uid": 15,
                                "userId": "U015",
                                "userName": "结算人",
                                "currentName": "结算人",
                                "duty": "结算人"
                            },
                            "accounter": null
                        },
                    ],
                    ...
                },
                ...
            }
    
    ### <I> pageSelectionItemForSupplier

        分页方式获取选材项信息 , 利用厂商作为条件 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 选材项信息列表 , 每条数据类型 *selectionItem*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "siid": 1,
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
                            "sid": 1,
                            "areaId": 1,
                            "quoteId": 1,
                            "goods": {
                                "gid": 1,
                                "no": "JGIDNEHDUIN5SD",
                                "name": "瓷砖",
                                "barcode": "254125212521251",
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "measurementUnit": "个",
                                "purchase": 100000,
                                "selling": 10000,
                                "pieceNum": 1,
                                "type": 0,
                                "checkup": 0,
                                "company": 0
                            },
                            "areaName": "功能区",
                            "preprice": 0,
                            "postprice": 0,
                            "initnum": 10000,
                            "num": 10000,
                            "refnum": 0,
                            "accountStatus": 0,
                            "status": 0,
                            "comment": "备注"
                            "tranTime": "2016-01-01 00:00:00",
                            "checkTime": "2016-01-01 00:00:00",
                            "confirmTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "accountTime": "2016-01-01 00:00:00",
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
                            },
                            "balancer": {
                                "uid": 15,
                                "userId": "U015",
                                "userName": "结算人",
                                "currentName": "结算人",
                                "duty": "结算人"
                            },
                            "accounter": null
                        },
                    ],
                    ...
                },
                ...
            }

    ### <I> pageSelectionItemForEscorter

        分页方式获取选材项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        归属装修单的跟单员作为当前操作的默认条件
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 选材项信息列表 , 每条数据类型 *selectionItem*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "siid": 1,
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
                            "sid": 1,
                            "areaId": 1,
                            "quoteId": 1,
                            "goods": {
                                "gid": 1,
                                "no": "JGIDNEHDUIN5SD",
                                "name": "瓷砖",
                                "barcode": "254125212521251",
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "measurementUnit": "个",
                                "purchase": 100000,
                                "selling": 10000,
                                "pieceNum": 1,
                                "type": 0,
                                "checkup": 0,
                                "company": 0
                            },
                            "areaName": "功能区",
                            "preprice": 0,
                            "postprice": 0,
                            "initnum": 10000,
                            "num": 10000,
                            "refnum": 0,
                            "accountStatus": 0,
                            "status": 0,
                            "comment": "备注"
                            "tranTime": "2016-01-01 00:00:00",
                            "checkTime": "2016-01-01 00:00:00",
                            "confirmTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "accountTime": "2016-01-01 00:00:00",
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
                            },
                            "balancer": {
                                "uid": 15,
                                "userId": "U015",
                                "userName": "结算人",
                                "currentName": "结算人",
                                "duty": "结算人"
                            },
                            "accounter": null
                        },
                    ],
                    ...
                },
                ...
            }

    ### <I> pageSelectionItemForAccount

        分页方式获取选材项信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        选材项对账状态为0(初始)作为默认条件
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 选材项信息列表 , 每条数据类型 *selectionItem*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "siid": 1,
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
                            "sid": 1,
                            "areaId": 1,
                            "quoteId": 1,
                            "goods": {
                                "gid": 1,
                                "no": "JGIDNEHDUIN5SD",
                                "name": "瓷砖",
                                "barcode": "254125212521251",
                                "category": "瓷砖",
                                "brand": "瓷砖",
                                "measurementUnit": "个",
                                "purchase": 100000,
                                "selling": 10000,
                                "pieceNum": 1,
                                "type": 0,
                                "checkup": 0,
                                "company": 0
                            },
                            "areaName": "功能区",
                            "preprice": 0,
                            "postprice": 0,
                            "initnum": 10000,
                            "num": 10000,
                            "refnum": 0,
                            "accountStatus": 0,
                            "status": 0,
                            "comment": "备注"
                            "tranTime": "2016-01-01 00:00:00",
                            "checkTime": "2016-01-01 00:00:00",
                            "confirmTime": "2016-01-01 00:00:00",
                            "balanceTime": "2016-01-01 00:00:00",
                            "accountTime": "2016-01-01 00:00:00",
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
                            },
                            "balancer": {
                                "uid": 15,
                                "userId": "U015",
                                "userName": "结算人",
                                "currentName": "结算人",
                                "duty": "结算人"
                            },
                            "accounter": null
                        },
                    ],
                    ...
                },
                ...
            }

    ### <I> querySelectionItemByOrderId

        通过装修单号获取选材项 , 利用装修单对应的默认报价获取对应的选材信息
        
        判断装修单的默认报价是否存在 , 不存在 , 错误信息 **200017 默认报价不存在**
        
        判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**
        
                |Requests:|
                :param selectionItem.orderId: 装修单编号
        :type selectionItem.orderId: String
        
        Example::
        
            {
                "selectionItem.orderId": "1601010001"
            }
            
                |Returns:|
                - **selectionItems**: 选材项列表 , 每条数据类型 *selectionItem*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "selectionItems": [
                    {
                        "siid": 1,
                        "orderId": "1601010001",
                        "sid": 1,
                        "areaId": 1,
                        "quoteId": 1,
                        "goods": {
                            "gid": 1,
                            "no": "JGIDNEHDUIN5SD",
                            "name": "瓷砖",
                            "barcode": "254125212521251",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "measurementUnit": "个",
                            "purchase": 100000,
                            "selling": 10000,
                            "pieceNum": 1,
                            "type": 0,
                            "checkup": 0,
                            "company": 0
                        },
                        "areaName": "功能区",
                        "preprice": 0,
                        "postprice": 0,
                        "initnum": 10000,
                        "num": 10000,
                        "refnum": 0,
                        "accountStatus": 0,
                        "status": 0,
                        "comment": "备注"
                        "tranTime": "2016-01-01 00:00:00",
                        "checkTime": "2016-01-01 00:00:00",
                        "confirmTime": "2016-01-01 00:00:00",
                        "balanceTime": "2016-01-01 00:00:00",
                        "accountTime": "2016-01-01 00:00:00",
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
                        },
                        "balancer": {
                            "uid": 15,
                            "userId": "U015",
                            "userName": "结算人",
                            "currentName": "结算人",
                            "duty": "结算人"
                        },
                        "accounter": null
                    }
                ]
                ...
            }
    
    ### <I> querySelectionItem

        通过报价ID获取选材项
        
        判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**
        
                |Requests:|
                :param selectionItem.sid: 选材单ID
        :type selectionItem.sid: Long
        
        Example::
        
            {
                "selectionItem.sid": 1
            }
            
                |Returns:|
                - **selectionItems**: 选材项列表 , 每条数据类型 *selectionItem*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "selectionItems": [
                    {
                        "siid": 1,
                        "orderId": "1601010001",
                        "sid": 1,
                        "areaId": 1,
                        "quoteId": 1,
                        "goods": {
                            "gid": 1,
                            "no": "JGIDNEHDUIN5SD",
                            "name": "瓷砖",
                            "barcode": "254125212521251",
                            "category": "瓷砖",
                            "brand": "瓷砖",
                            "measurementUnit": "个",
                            "purchase": 100000,
                            "selling": 10000,
                            "pieceNum": 1,
                            "type": 0,
                            "checkup": 0,
                            "company": 0
                        },
                        "areaName": "功能区",
                        "preprice": 0,
                        "postprice": 0,
                        "initnum": 10000,
                        "num": 10000,
                        "refnum": 0,
                        "accountStatus": 0,
                        "status": 0,
                        "comment": "备注"
                        "tranTime": "2016-01-01 00:00:00",
                        "checkTime": "2016-01-01 00:00:00",
                        "confirmTime": "2016-01-01 00:00:00",
                        "balanceTime": "2016-01-01 00:00:00",
                        "accountTime": "2016-01-01 00:00:00",
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
                        },
                        "balancer": {
                            "uid": 15,
                            "userId": "U015",
                            "userName": "结算人",
                            "currentName": "结算人",
                            "duty": "结算人"
                        },
                        "accounter": null
                    }
                ]
                ...
            }

    ### <I> collateSelectionItem

        核对选材项
        
        以装修单号为条件 , 判断状态非4(完结)的选材项 , 如果存在 , 错误信息 **200039 选材项状态不可操作**
        
                |Requests:|
                :param selection.orderId: 装修单号
        :type selection.orderId: String
        
        Example::
        
            {
                "selection.orderId": "1601010001"
            }
            
    ### <I> addSelectionItem

        添加选材项
        
        判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**
        
        判断选材单状态为0(初始) , 其他状态 , 错误信息 **200036 选材单不可操作**
        
                |Requests:|
                :param selection.sid: 选材单ID
        :type selection.sid: Long
        :param selection.total: 总额
        :type selection.total: Long
        :param selection.quotationTotal: 报价总额
        :type selection.quotationTotal: Long
        :param selection.extensionTotal: 拓展总额
        :type selection.extensionTotal: Long
        :param selection.addReductTotal: 增减总额
        :type selection.addReductTotal: Long
        
        :param selectionItem.areaId: 引用区ID
        :type selectionItem.areaId: Long
        :param selectionItem.quoteId: 引用项ID
        :type selectionItem.quoteId: Long
        :param selectionItem.goods.gid: 商品ID
        :type selectionItem.goods.gid: Long
        :param selectionItem.areaName: 功能区
        :type selectionItem.areaName: String
        :param selectionItem.preprice: 预算价格
        :type selectionItem.preprice: Integer
        :param selectionItem.initnum: 工程量
        :type selectionItme.initnum: Integer
        :param selectionItem.num: 数量
        :type selectionItem.num: Integer
        
        Example::
        
            {
                "selection.sid": 1,
                "selection.total": 10000,
                "selection.quotationTotal": 10000,
                "selection.extensionTotal": 0,
                "selection.addReductTotal": 0,
                
                "selectionItem.areaId": 1,
                "selectionItem.quoteId": 1,
                "selectionItem.goods.gid": 1,
                "selectionItem.areaName": "功能区",
                "selectionItem.preprice": 0,
                "selectionItem.initnum": 1000,
                "selectionItem.num": 1000
            }
            
    ### <I> updateSelectionItem

        更新选材项
        
        判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**
        
        判断选材单状态为0(初始) , 其他状态 , 错误信息 **200036 选材单不可操作**
        
                |Requests:|
                :param selection.sid: 选材单ID
        :type selection.sid: Long
        :param selection.total: 总额
        :type selection.total: Long
        :param selection.quotationTotal: 报价总额
        :type selection.quotationTotal: Long
        :param selection.extensionTotal: 拓展总额
        :type selection.extensionTotal: Long
        :param selection.addReductTotal: 增减总额
        :type selection.addReductTotal: Long
        
        :param selectionItem.siid: 选材项ID
        :type selectionItem.siid: Long
        :param selectionItem.postprice: 结算价
        :type selectionItem.postprice: Integer
        :param selectionItem.num: 数量
        :type selectionItem.num: Integer
        
        Example::
        
            {
                "selection.sid": 1,
                "selection.total": 10000,
                "selection.quotationTotal": 10000,
                "selection.extensionTotal": 0,
                "selection.addReductTotal": 0,
                
                "selectionItem.siid": 1,
                "selectionItem.postprice": 10000,
                "selectionItem.num": 10000
            }

    ### <I> tranSelectionItem

        配送选材项
        
        判断选材项是否存在 , 不存在 , 错误信息 **200038 选材项不存在**
        
        判断选材项状态为0(初始) , 其他状态 , 错误信息 **200039 选材项状态不可操作**
        
                |Requests:|
                :param selectionItems[n].siid: 选材项ID
        :type selectionItems[n].siid: Long
        :param selectionItems[n].num: 数量
        :type selectionItems[n].num: Integer
        
        Example::
        
            {
                "selectionItems[0].siid": 1,
                "selectionItems[0].num": 1000
            }

    ### <I> checkSelectionItem

        审核选材项
        
        判断选材项是否存在 , 不存在 , 错误信息 **200038 选材项不存在**
        
        判断选材项状态为1(配送) , 其他状态 , 错误信息 **200039 选材项状态不可操作**
        
                |Requests:|
                :param selectionItems[n].siid: 选材项ID
        :type selectionItems[n].siid: Long
        :param selectionItems[n].comment: 备注
        :type selectionItems[n].comment: String
        
        Example::
        
            {
                "selectionItems[0].siid": 1,
                "selectionItems[0].comment": "备注"
            }
            
    ### <I> confirmSelectionItem

        确认选材项
        
        判断选材项是否存在 , 不存在 , 错误信息 **200038 选材项不存在**
        
        判断选材项状态为2(审核) , 其他状态 , 错误信息 **200039 选材项状态不可操作**
        
                |Requests:|
                :param selectionItems[n].siid: 选材项ID
        :type selectionItems[n].siid: Long
        
        Example::
        
            {
                "selectionItems[0].siid": 1
            }
            
    ### <I> finishSelectionItem

        完结选材项
        
        判断选材项是否存在 , 不存在 , 错误信息 **200038 选材项不存在**
        
        判断选材项状态为3(确认) , 其他状态 , 错误信息 **200039 选材项状态不可操作**
        
                |Requests:|
                :param selectionItems[n].siid: 选材项ID
        :type selectionItems[n].siid: Long
        
        Example::
        
            {
                "selectionItems[0].siid": 1
            }

    ### <I> reviewSelectionItem

        核对选材项
        
        判断选材项是否存在 , 不存在 , 错误信息 **200038 选材项不存在**
        
        判断选材项状态为4(完结) , 其他状态 , 错误信息 **200039 选材项状态不可操作**
        
                |Requests:|
                :param selectionItem[n].siid: 选材项ID
        :type selectionItem[n].siid: Long
        
        Example::
        
            {
                "selectionItem[0].siid": 1
            }
            
    ### <I> balanceSelectionItem

        结算选材项
        
        判断选材项是否存在 , 不存在 , 错误信息 **200038 选材项不存在**
        
        判断选材项状态为5(核对) , 其他状态 , 错误信息 **200039 选材项状态不可操作**
        
                |Requests:|
                :param selectionItem[n].siid: 选材项ID
        :type selectionItem[n].siid: Long
        
        Example::
        
            {
                "selectionItem[0].siid": 1
            }

    ### <I> refundSelectionItem

        退货
        
        判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**
        
        判断选材单状态为5(核对)/6(结算) , 其他状态 , 错误信息 **200036 选材单不可操作**
        
                |Requests:|
                :param selectionItems[n].siid: 选材项ID
        :type selectionItems[n].siid: Long
        :param selectionItems[n].refnum: 退货量
        :type selectionItems[n].refnum: Integer
        
        Example::
        
            {
                "selectionItems[0].siid": 1,
                "selectionItems[0].refnum": 1
            }

    ### <I> deleteSelectionItem

        删除选材项
        
        判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**
        
        判断选材单状态非0(初始)/1(配送) , 其他状态 , 错误信息 **200036 选材单不可操作**
        
                |Requests:|
                :param selection.sid: 选材单ID
        :type selection.sid: Long
        :param selection.total: 总额
        :type selection.total: Long
        :param selection.quotationTotal: 报价总额
        :type selection.quotationTotal: Long
        :param selection.extensionTotal: 拓展总额
        :type selection.extensionTotal: Long
        :param selection.addReductTotal: 增减总额
        :type selection.addReductTotal: Long
        
        :param selectionItem.siid: 选材项ID
        :type selectionItem.siid: Long
        
        Example::
        
            {
                "selection.sid": 1,
                "selection.total": 10000,
                "selection.quotationTotal": 10000,
                "selection.extensionTotal": 0,
                "selection.addReductTotal": 0,
                
                "selectionItem.siid": 1
            }

    ### <I> cutoffSelectionItem

        失效选材项
        
        判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**
        
        判断选材单状态为5(核对)/6(结算) , 其他状态 , 错误信息 **200036 选材单不可操作**
        
        选材项状态更新为7(失效)
        
                |Requests:|
                :param selectionItems[n].siid: 选材项ID
        :type selectionItems[n].siid: Long
        
        Example::
        
            {
                "selectionItems[0].siid": 1
            }

    ### <I> rejectSelectionItem

        驳回选材项
        
        判断选材单是否存在 , 不存在 , 错误信息 **200035 选材单不存在**
        
        判断选材单状态非5(核对)/6(结算) , 其他状态 , 错误信息 **200036 选材单不可操作**
        
        选材项状态更新为4(完结)
        
                |Requests:|
                :param selectionItems[n].siid: 选材项ID
        :type selectionItems[n].siid: Long
        
        Example::
        
            {
                "selectionItems[0].siid": 1
            }

### 项目

## api.quotation.QuotationRemeasureAction

        |DataType:|
        #### quotationRemeasure

    - **qrid**: 回尺单ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **brand**: 品牌 , 类型 [brand](./data.html#api.data.BrandAction.brand)
      - 类型: *Object*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0: 初始
      - 类型: *Short*
    - **company**: 公司ID
      - 类型: *Integer*
    
    #### quotationRemeasureItem

    - **qriid**: 回尺项ID
      - 类型: *Long*
    - **qrid**: 回尺单ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **areaId**: 引用区ID , 包括三个类型 , 分别是功能区 , 拓展 , 增减
      - 类型: *Long*
    - **areaName**: 功能区名称
      - 类型: *String*
    - **selectionItem**: 选材项 , 类型 [selectionItem](./quotation.html#api.quotation.SelectionItemAction.selectionItem)
      - 类型: *Object*
    - **remeasureFormat**: 回尺指标 , 类型 [remeasureFormat](./data.html#api.data.RemeasureFormatAction.remeasureFormat)
      - 类型: *Object*
    - **name**: 名称
      - 类型: *String*
    - **type**: 类型 , 0: 文本 , 1: 数值
      - 类型: *Short*

    ### <I> pageQuotationRemeasure

    ### <I> queryQuotationRemeasure

    ### <I> queryQuotationRemeasureItem

    ### <I> makeQuotationRemeasure

    ### <I> updateQuotationRemeasureItem

## 定额

### 定额

## api.quotation.NormtionAction

        |DataType:|
        #### normtion

    - **nid**: 报价定额ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **decoration**: 装修单 , 类型: [decoration](./decoration.html#api.data.DecorationAction.decoration)
      - 类型: *Object*
    - **qid**: 报价ID
      - 类型: *Long*
    - **moodTotal**: 材料总额
      - 类型: *Long*
    - **mriceTotal**: 工费总额
      - 类型: *Long*
    - **moodPrintNum**: 材料打印次数
      - 类型: *Integer*
    - **mricePriceNum**: 工费打印次数
      - 类型: *Integer*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    
    ### <I> pageNormtion

        分页方式获取定额单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 定额单信息列表 , 每条数据类型 *normtion*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "nid": 1,
                            "orderId": "1601010001",
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
                            "qid": 1,
                            "moodTotal": 0,
                            "mriceTotal": 0,
                            "noodPriceNum": 0,
                            "mricePriceNum": 0,
                            "status": 0,
                            "creater": {
                                "uid": 1,
                                "createrId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师" 
                            },
                            "createTime": "2016-01-01"
                        }
                    ],
                    ...
                },
                ...
            }
    
    ### <I> queryNormtion

        查询定额信息
    
                |Requests:|
                :param normtion.qid: 报价ID
        :type normtion.qid: Long
            
        Example::
        
            {
                "normtion.qid": 1
            }
        
                |Returns:|
                - **normtion**: 定额信息列表 , 类型 *normtion*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "normtion": {
                    "nid": 1,
                    "qid": 1,
                    "moodTotal": 0,
                    "mriceTotal": 0,
                    "noodPriceNum": 0,
                    "mricePriceNum": 0,
                    "status": 0,
                    "creater": {
                        "uid": 1,
                        "createrId": "U001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "duty": "设计师" 
                    },
                    "createTime": "2016-01-01"
                },
                ...
            }

    ### <I> makeNormtionForQuotation

        生成定额信息
        
                |Requests:|
                :param normtion.nid: 定额ID
        :type normtion.nid: Long
            
        Example::
        
            {
                "normtion.nid": 1
            }

    ### <I> makeNormtionForExtension

        生成定额信息
        
                |Requests:|
                :param normtion.orderId: 装修单号
        :type normtion.orderId: String
        :param extension.eid: 扩展单ID
        :type extension.eid: Long
            
        Example::
        
            {
                "normtion.orderId": 1,
                "extension.eid": 1
            }

    ### <I> makeNormtionForAddReduce

        生成定额信息
        
                |Requests:|
                :param normtion.orderId: 装修单号
        :type normtion.orderId: String
        :param addReduce.arid: 增减单ID
        :type addReduce.arid: Long
            
        Example::
        
            {
                "normtion.orderId": 1,
                "addReduce.arid": 1
            }
            
        Example::
        
            {
                "normtion.nid": 1
            }

    ### <I> printNormtion

        打印定额信息
        
                |Requests:|
                :param normtion.nid: 定额ID
        :type normtion.nid: Long
        :param normtion.noodPriceNum: 材料打印数量
        :type normtion.noodPriceNum: Integer
        :param normtion.mricePriceNum: 工费打印数量
        :type normtion.mricePriceNum: Integer
            
        Example::
        
            {
                "normtion.nid": 1,
                "normtion.noodPriceNum": 1,
                "normtion.mricePriceNum": 1
            }

    ### <I> updateNormtionForStatus

        更新定额单状态
    
                |Requests:|
                :param normtion.nid: 定额ID
        :type normtion.nid: Long
        :param normtion.status: 状态
        :type normtion.status: Short
            
        Example::
        
            {
                "normtion.nid": 1,
                "normtion.status": 1
            }

### 材料项

## api.quotation.NormoodItemAction

        |DataType:|
        #### normoodItem

    - **ngiid**: 定额材料ID
      - 类型: *Long*
    - **qid**: 报价ID
      - 类型: *Long*
    - **sid**: 引用ID , 包括报价/拓展/增减
      - 类型: *Long*
    - **areaId**: 功能区ID
      - 类型: *Long*
    - **quoteId**: 引用项ID
      - 类型: *Long*
    - **qiid**: 报价项ID
      - 类型: *Long*
    - **type**: 类型 , 包括: 0(报价) , 1(拓展) , 2(增减)
      - 类型: *Short*
    - **normtype**: 定额类型 , 包括: 0(材料) , 1(打包)
      - 类型: *Short*
    - **atttype**: 业务类型 , 包括: 0(收款) , 1(出款)
      - 类型: *Short*
    - **noods**: 定材 , 类型 [noods](./data.html#api.data.NoodsAction.noods)
      - 类型: *Object*
    - **unit**: 单位
      - 类型: *String*
    - **num**: 数量
      - 类型: *Integer*
    
    ### <I> queryNormoodItem

        查询报价定额材料项目
        
                |Requests:|
                :param normoodItem.qid: 报价ID
        :type normoodItem.qid: Long
            
        Example::
        
            {
                "normoodItem.qid": 1
            }
            
                |Returns:|
                - **normoodItems**: 定额材料信息列表 , 每条数据类型 *normoodItem*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "normoodItems": [
                    {
                        "ngiid": 1,
                        "qid": 1,
                        "sid": 1,
                        "areaId": 1,
                        "qiid": 1,
                        "type": 0,
                        "normtype": 0,
                        "atttype": 0,
                        "noods": {
                            "nid": 1,
                            "name": "名称",
                            "selling": 1000,
                            "balance": 1000
                        },
                        "unit": "个",
                        "num": 1000
                    }
                ],
                ...
            }

    ### <I> queryQuotationNormood

        获取报价项关联的定额材料
        
                |Requests:|
                :param quotation.qid: 报价ID
        :type quotation.qid: Long
            
        Example::
        
            {
                "quotation.qid": 1
            }
            
                |Returns:|
                - **quotationFunctionAreas**: 功能区信息列表 , 每条数据类型 *quotationFunctionArea*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "quotationFunctionAreas": [
                    {
                        "qfaid": 1,
                        "quotationId": 1,
                        "functionAreaName": "门厅",
                        "functionAreaOrder": 1,
                        "functionAreaType": "0",
                        "type": 1,
                        "total": 0,
                        "quotationFunctionAreaItems": [
                            {
                                "content": "",
                                "discount": 0,
                                "itemName": "报价项",
                                "measurementUnit": "",
                                "num": 1,
                                "qfaiId": 1,
                                "quotationFunctionAreaId": 1,
                                "quotationItemId": null,
                                "type": 2,
                                "unitPrice": 100,
                                "workType": "木工",
                                "noods": {
                                    "nid": 1,
                                    "name": "名称",
                                    "selling": 1000,
                                    "balance": 1000
                                },
                            }
                        ]
                    }
                ],
                ...
            }

    ### <I> queryExtensionNormood

    ### <I> queryAddReduceNormood

    ### <I> amountQuotationNormood

        汇总报价关联的定额材料
        
                |Requests:|
                :param quotation.qid: 报价ID
        :type quotation.qid: Long
            
        Example::
        
            {
                "quotation.qid": 1
            }
            
                |Returns:|
                - **normoods**: 定额信息列表 , 每条数据类型 [normood](./data.html#api.data.NormAction.normood)
          - 类型: *List*
        
        Example::
        
            {
                ...
                "normoods": [
                    {
                        "ngid": 1,
                        "num": 1000,
                        "amount": 1000
                    },
                ],
                ...
            }

    ### <I> amountExtensionNormood

    ### <I> amountAddReduceNormood

    ### <I> addNormoodItem

        添加报价定额材料
        
                |Requests:|
                :param normoodItem.qid: 报价ID
        :type normoodItem.qid: Long
        :param normoodItem.sid: 引用ID
        :type normoodItem.sid: Long
        :param normoodItem.areaId: 功能区ID
        :type normoodItem.areaId: Long
        :param normoodItem.quoteId: 引用项ID
        :type normoodItem.quoteId: Long
        :param normoodItem.qiid: 报价项ID
        :type normoodItem.qiid: Long
        :param normoodItem.type: 类型
        :type normoodItem.type: Short
        :param normoodItem.normtype: 定额类型
        :type normoodItem.normtype: Short
        :param normoodItem.atttype: 业务类型
        :type normoodItem.atttype: Short
        :param normoodItem.goods.gid: 商品ID
        :type normoodItem.goods.gid: Long
        :param normoodItem.noods.nid: 定材ID
        :type normoodItem.noods.nid: Long
        :param normoodItem.unit: 单位
        :type normoodItem.unit: String
        :param normoodItem.num: 数量
        :type normoodItem.num: Integer
            
        Example::
        
            {
                "normoodItem.qid": 1,
                "normoodItem.sid": 1,
                "normoodItem.areaId": 1,
                "normoodItem.quoteId": 1,
                "normoodItem.qiid": 1,
                "normoodItem.type": 0,
                "normoodItem.normtype": 0,
                "normoodItem.atttype": 0,
                "normoodItem.goods.gid": 1,
                "normoodItem.noods.nid": 1,
                "normoodItem.unit": "个",
                "normoodItem.num": 1,
            }
    
    ### <I> deleteNormoodItem

        删除报价定额材料
        
                |Requests:|
                :param normoodItem.ngiid: 报价定额材料ID
        :type normoodItem.ngiid: Long
        
        Example::
        
            {
                "normoodItem.ngiid": 1
            }

### 工费项

## api.quotation.NormriceItemAction

        |DataType:|
        #### normriceItem

    - **npiid**: 定额工费ID
      - 类型: *Long*
    - **qid**: 报价ID
      - 类型: *Long*
    - **sid**: 引用ID , 包括报价/拓展/增减
      - 类型: *Long*
    - **areaId**: 功能区ID
      - 类型: *Long*
    - **quoteId**: 引用项ID
      - 类型: *Long*
    - **qiid**: 报价项ID
      - 类型: *Long*
    - **type**: 类型 , 包括: 0(报价) , 1(拓展) , 2(增减)
      - 类型: *Short*
    - **normtype**: 定额类型 , 包括: 0(工费) , 1(附加)
      - 类型: *Short*
    - **atttype**: 业务类型 , 包括: 0(收款) , 1(出款)
      - 类型: *Short*
    - **constructionNode**: 施工节点 , 类型 [constructionNode](./data.html#api.data.ConstructionNodeAction.constructionNode)
      - 类型: *Object*
    - **name**: 名称
      - 类型: *String*
    - **unit**: 单位
      - 类型: *String*
    - **num**: 数量
      - 类型: *Integer*
    - **trannum**: 转换量
      - 类型: *Integer*
    - **salary**: 薪资
      - 类型: *Integer*
    
    ### <I> queryNormriceItem

        查询报价定额工费项目
        
                |Requests:|
                :param normriceItem.qid: 报价ID
        :type normriceItem.qid: Long
            
        Example::
        
            {
                "normriceItem.qid": 1
            }
            
                |Returns:|
                - **normriceItems**: 定额工费信息列表 , 每条数据类型 *normriceItem*
          - 类型: *List*
        
        - **npiid**: 定额工费ID
          - 类型: *Long*
        - **qid**: 报价ID
          - 类型: *Long*
        - **sid**: 引用ID , 包括报价/拓展/增减
          - 类型: *Long*
        - **areaId**: 功能区ID
          - 类型: *Long*
        - **quoteId**: 引用项ID
          - 类型: *Long*
        - **qiid**: 报价项ID
          - 类型: *Long*
        - **type**: 类型 , 包括: 0(报价) , 1(拓展) , 2(增减)
          - 类型: *Short*
        - **normtype**: 定额类型 , 包括: 0(工费) , 1(附加)
          - 类型: *Short*
        - **atttype**: 业务类型 , 包括: 0(收款) , 1(出款)
          - 类型: *Short*
        - **constructionNode**: 施工节点 , 类型 [constructionNode](./data.html#api.data.ConstructionNodeAction.constructionNode)
          - 类型: *Object*
        - **name**: 名称
          - 类型: *String*
        - **unit**: 单位
          - 类型: *String*
        - **num**: 数量
          - 类型: *Integer*
        - **trannum**: 转换量
          - 类型: *Integer*
        - **salary**: 薪资
          - 类型: *Integer*
        
        Example::
        
            {
                ...
                "normriceItems": [
                    {
                        "npiid": 1,
                        "qid": 1,
                        "sid": 1,
                        "areaId": 1,
                        "qiid": 1,
                        "type": 0,
                        "normtype": 0,
                        "atttype": 0,
                        "constructionNode": {
                            "cnid": 2,
                            "name": "铲大白"
                        },
                        "name": "名称",
                        "unit": "个",
                        "trannum": 1000,
                        "num": 1000,
                        "salary": 1000
                    }
                ],
                ...
            }
    
    ### <I> queryQuotationNormrice

        获取报价项关联的定额工费
        
                |Requests:|
                :param quotation.qid: 报价ID
        :type quotation.qid: Long
            
        Example::
        
            {
                "quotation.qid": 1
            }
            
                |Returns:|
                - **quotationFunctionAreas**: 功能区信息列表 , 每条数据类型 *quotationFunctionArea*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "quotationFunctionAreas": [
                    {
                        "qfaid": 1,
                        "quotationId": 1,
                        "functionAreaName": "门厅",
                        "functionAreaOrder": 1,
                        "functionAreaType": "0",
                        "type": 1,
                        "total": 0,
                        "quotationFunctionAreaItems": [
                            {
                                "content": "",
                                "discount": 0,
                                "itemName": "报价项",
                                "measurementUnit": "",
                                "num": 1,
                                "qfaiId": 1,
                                "quotationFunctionAreaId": 1,
                                "quotationItemId": null,
                                "type": 2,
                                "unitPrice": 100,
                                "workType": "木工",
                                "normrice": {
                                    "npid": 1,
                                    "constructionNode": {
                                        "cnid": 2,
                                        "name": "铲大白"
                                    },
                                    "salary": 1000
                                },
                            }
                        ]
                    }
                ],
                ...
            }

    ### <I> queryExtensionNormrice

    ### <I> queryAddReduceNormrice

    ### <I> amountQuotationNormrice

        汇总报价关联的定额工费
        
                |Requests:|
                :param quotation.qid: 报价ID
        :type quotation.qid: Long
            
        Example::
        
            {
                "quotation.qid": 1
            }
            
                |Returns:|
                - **normrices**: 定额信息列表 , 每条数据类型 [normrice](./data.html#api.data.NormAction.normrice)
          - 类型: *List*
        
        Example::
        
            {
                ...
                "normrices": [
                    {
                        "npid": 1,
                        "constructionNode": {
                            "cnid": 2,
                            "name": "铲大白"
                        },
                        "salary": 1000,
                        "amount": 1000
                    },
                ],
                ...
            }

    ### <I> amountExtensionNormrice

    ### <I> amountAddReduceNormrice

    ### <I> addNormriceItem

        添加报价定额工费
        
                |Requests:|
                :param normriceItem.qid: 报价ID
        :type normriceItem.qid: Long
        :param normriceItem.sid: 引用ID
        :type normriceItem.sid: Long
        :param normriceItem.areaId: 功能区ID
        :type normriceItem.areaId: Long
        :param normriceItem.quoteId: 引用项ID
        :type normriceItem.quoteId: Long
        :param normriceItem.qiid: 报价项ID
        :type normriceItem.qiid: Long
        :param normriceItem.type: 类型
        :type normriceItem.type: Short
        :param normriceItem.normtype: 定额类型
        :type normriceItem.normtype: Short
        :param normriceItem.atttype: 业务类型
        :type normriceItem.atttype: Short
        :param normriceItem.constructionNode.cnid: 施工节点ID
        :type normriceItem.constructionNode.cnid: Long
        :param normriceItem.name: 名称
        :type normriceItem.name: String
        :param normriceItem.unit: 单位
        :type normriceItem.unit: String
        :param normriceItem.trannum: 转换量
        :type normriceItem.trannum: Integer
        :param normriceItem.num: 数量
        :type normriceItem.num: Integer
        :param normriceItem.salary: 工费
        :type normriceItem.salary: Integer
            
        Example::
        
            {
                "normriceItem.qid": 1,
                "normriceItem.sid": 1,
                "normriceItem.areaId": 1,
                "normriceItem.quoteId": 1,
                "normriceItem.qiid": 1,
                "normriceItem.type": 0,
                "normriceItem.normtype": 0,
                "normriceItem.atttype": 0,
                "normriceItem.constructionNode.cnid": 1,
                "normriceItem.name": "名称",
                "normriceItem.unit": "个",
                "normriceItem.num": 1,
            }
    
    ### <I> deleteNormriceItem

        删除报价定额工费
        
                |Requests:|
                :param normriceItem.npiid: 报价定额工费ID
        :type normriceItem.npiid: Long
        
        Example::
        
            {
                "normriceItem.ngiid": 1
            }

## 记录

## api.quotation.QuotationRecordAction

        |DataType:|
        #### quotationRecord

    - **qrid**: 记录ID
      - 类型: *Long*
    - **orderId**: 装修单号
      - 类型: *String*
    - **sid**: 预签单ID/报价单ID/扩展单ID/增减单ID
      - 类型: *Long*
    - **type**: 类型 , 0(预签) , 1(报价) , 2(扩展) , 3(增减)
      - 类型: *Short*
    - **operator**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **operateTime**: 操作时间
      - 类型: *Timestamp*
    - **comment**: 说明
      - 类型: *String*
    
    ### <I> queryQuotationRecord

        获取报价记录信息
    
                |Requests:|
                :param quotationRecord.sid: ID
        :type quotationRecord.sid: Short
        :param quotationRecord.type: 类型
        :type quotationRecord.type: Short
        
        Example::
        
            {
                "quotationFunction.sid": 0,
                "quotationFunction.type": 0
            }
            
                |Returns:|
                - **quotationRecords**: 记录信息列表 , 类型 *quotationRecord*
          - 类型: *List*
            
        Example::
        
            {
                ...
                "quotationRecords": [
                    {
                        "qrid": 1,
                        "orderId": "1601010001",
                        "sid": 1,
                        "type": 0,
                        "comment": "说明"
                    }
                ],
                ...
            }
    
## 功能

## api.quotation.QuotationFunctionAction

        |DataType:|
        #### quotationFunction

    - **qfid**: 功能ID
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

    ### <I> queryQuotationFunction

        获取报价功能信息
    
                |Requests:|
                :param quotationFunction.type: 类型
        :type quotationFunction.type: Short
        
        Example::
        
            {
                "quotationFunction.type": 0
            }
            
                |Returns:|
                - **quotationFunctions**: 功能信息列表 , 类型 *quotationFunction*
          - 类型: *List*
            
        Example::
        
            {
                ...
                "quotationFunctions": [
                    {
                        "qfid": 1,
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
