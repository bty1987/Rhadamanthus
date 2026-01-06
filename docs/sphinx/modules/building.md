# building {#building}

# 房产
## 流转节点

## api.building.BuildingNodeAction

        |DataType:|
        #### buildingNode

    - **bnid**: 房产节点ID
      - 类型: *Long*
    - **name**: 房产节点名称
      - 类型: *String*
    - **type**: 节点类型 , 包括: 0(一手房买卖) , 1(全款) , 2(商业贷款) , 3(公积金) , 4(部队公积金) , 5(租赁)
      - 类型: *Short*
    - **sore**: 排序 , 类型
      - 类型: *Short*
    - **status**: 状态 , 包括: 0(启用) , 1(禁用)
      - 类型: *Short*
    
    ### <I> pageBuildingNode

        分页方式获取房产节点信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 房产节点信息列表 , 每条数据类型 *buildingNode*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "bnid": 1,
                            "name": "面签",
                            "type": "商业贷款",
                            "sore": 2,
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <I> queryBuildingNodeByType

        通过节点类型查询节点信息, 同时可以利用sore获取具体节点信息

        如果sore没有传值将返回节点类型对应的所有节点信息

        节点状态为有效(0)
        
                |Requests:|
                :param buildingNode.type: 类型
        :type buildingNode.type: Short
        :param buildingNode.sore: 排序
        :type buildingNode.sore: Short
        
        Example::
        
            {
                "buildingNode.type": 2,
                "buildingNode.sore": 1
            }
    
    ### <I> addBuildingNode

        添加房产节点信息
        
                |Requests:|
                :param buildingNode.name: 名称
        :type buildingNode.name: String
        :param buildingNode.type: 商业贷款
        :type buildingNode.type: Short
        
        Example::
        
            {
                "buildingNode.name": "面签",
                "buildingNode.type": 2
            }
    
    ### <I> updateBuildingNode

        更新房产节点信息
        
                |Requests:|
                :param buildingNode.bnid: 房产节点ID
        :type buildingNode.bnid: Long
        :param buildingNode.name: 房产节点名称
        :type buildingNode.name: String
        
        Example::
        
            {
                "buildingNode.bnid": 2,
                "buildingNode.name": "面签"
            }
            
    ### <I> updateBuildingNodeForStatus

        更新房产节点状态
        
                |Requests:|
                :param buildingNode.bnid: 房产节点ID
        :type buildingNode.bnid: Long
        :param buildingNode.status: 状态
        :type buildingNode.status: short
        
        Example::
        
            {
                "buildingNode.bnid": 2,
                "buildingNode.status": 0
            }

## 房源

## api.building.BuildingHouseAction

        |DataType:|
        #### buildingHouse

    - **hsid**: 房源ID
      - 类型: *Long*
    - **type**: 房源类型 , 包括: 0(出售) , 1(出租)
      - 类型: *Short*
    - **sourceType**: 信息来源 , 包括: 0(店内) , 1(电话) , 2(网络)
      - 类型: *Short*
    - **house**: 房证ID [house](./data.html#api.data.HouseAction.house)
      - 类型: *Object*
    - **customer**: 房产权属 [customer](./data.html#api.data.CustomerAction.customer)
      - 类型: *Object*
    - **deedNum**: 契证编号
      - 类型: *String*
    - **deedValue**: 契证原值
      - 类型: *Float*
    - **unitPrice**: 单价
      - 类型: *Float*
    - **totalPrice**: 总价
      - 类型: *Float*
    - **decorateTime**: 装修时间
      - 类型: *Timestamp*
    - **decorateDegree**: 装修程度 , 包括: 0(清水房) , 1(老式装修) , 2(简单装修) , 3(中等装修) , 4(高级装修) , 5(豪华装修) , 6(其它)
      - 类型: *Short*
    - **discussType**: 商议类型 , 包括: 0(少议) , 1(可议) , 2(不可议)
      - 类型: *Short*
    - **rentType**: 交租方式
      - 类型: *Short*
    - **indoores**: 室内设施
      - 类型: *String*
    - **history**: 房屋历史 , 包括: 0(正常) , 1(特殊)
      - 类型: *Short*
    - **propertyFee**: 物业费
      - 类型: *Float*
    - **elevator**: 电梯 , 包括: 0(有) , 1(无)
      - 类型: *Short*
    - **onlyHousing**: 唯一住房 , 包括: 0(是) , 1(否)
      - 类型: *Short*
    - **documentsDate**: 下证日期
      - 类型: *Timestamp*
    - **allowLoan**: 允许贷款 , 包括: 0(是) , 1(否)
      - 类型: *Short*
    - **beingLoan**: 有无贷款 , 包括: 0(无) , 1(有)
      - 类型: *Short*
    - **checkingTime**: 看房时间
      - 类型: *Timestamp*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **follower**: 跟进人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **department**: 跟进人部门 , 类型 [department](./department.html#api.communion.DepartmentAction.department)
      - 类型: *Object*
    - **region**: 跟进人分区 , 类型 [department](./department.html#api.communion.DepartmentAction.department)
      - 类型: *Object*
    - **keyer**: 钥匙归属人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **housingGrade**: 房源等级 , 包括: A , B , C , D
      - 类型: *String*
    - **status**: 状态 , 包括: 0(初始) , 1(签约) , 2(失效)
      - 类型: *Short*
    - **path**: 图片默认路径
      - 类型: *String*
    - **comment**: 备注
      - 类型: *String*
    
    ### <I> pageBuildingHouse

        分页方式获取房源信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 房源信息列表 , 每条数据类型 *buildingHouse*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "hsid": 1,
                            "type": 2
                            "sourceType": "1#1-1-1",
                            "house": {
                                "hid": 1,
                                "village": {
                                    "vid": 1,
                                    "no": "P001",
                                    "name": "广场一期",
                                    "deliveryTime": null,
                                    "developer": "222",
                                    "salesPhone": "",
                                    "status": 0,
                                },
                                "houseNumber": "1#1-1-1",
                                "built": 1,
                                "unit": 1,
                                "floor": 1,
                                "door": 1,
                                "type": 0,
                                "buildArea": 88.6,
                                "maxFloor": 7,
                                "through": 0,
                                "roomNum": 2,
                                "houseType": "2室1厅1卫1厨",
                                "orientation": 0,
                                "feature": ["临街", "把西山"],
                                "waterVapour": 0,
                                "parlourType": 0,
                                "status": 0,
                            },
                            "customer": {
                                "cid": 1,
                                "no": "1501010001",
                                "name": "李",
                            },
                            "deedNum": 1,
                            "deedValue": 1,
                            "unitPrice": 0,
                            "totalPrice": 88.6,
                            "decorateTime": 7,
                            "decorateDegree": 0,
                            "discussType": 2,
                            "rentType": "2室1厅1卫1厨",
                            "indoores": 0,
                            "history": ["临街", "把西山"],
                            "propertyFee": 0,
                            "elevator": 0,
                            "onlyHousing": 0,
                            "documentsDate": 0,
                            "allowLoan": 0,
                            "beingLoan": 0
                            "checkingTime": 0,
                            "creater": {
                                "uid": 1,
                                "userId": "U0001",
                                "oldUserId": "CS001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "deptType": "行政",
                                "duty": "财务",
                                "phone": "135xxxx1918",
                                "userPhoto": ""
                            },
                            "createTime": 0
                            "follower": {
                                "uid": 1,
                                "userId": "U0001",
                                "oldUserId": "CS001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "deptType": "行政",
                                "duty": "财务",
                                "phone": "135xxxx1918",
                                "userPhoto": ""
                            },
                            "keyer": {
                                "uid": 1,
                                "userId": "U0001",
                                "oldUserId": "CS001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "deptType": "行政",
                                "duty": "财务",
                                "phone": "135xxxx1918",
                                "userPhoto": ""
                            },
                            "housingGrade": 0,
                            "status": 0,
                            "path": 0,
                            "comment": 0
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <I> pageBuildingHouseForFollower

        分页方式获取房源信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        利用当前人员查询跟进人归属的房源信息
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 房源信息列表 , 每条数据类型 *buildingHouse*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "hsid": 1,
                            "type": 2
                            "sourceType": "1#1-1-1",
                            "house": {
                                "hid": 1,
                                "village": {
                                    "vid": 1,
                                    "no": "P001",
                                    "name": "广场一期",
                                    "deliveryTime": null,
                                    "developer": "222",
                                    "salesPhone": "",
                                    "status": 0,
                                },
                                "houseNumber": "1#1-1-1",
                                "built": 1,
                                "unit": 1,
                                "floor": 1,
                                "door": 1,
                                "type": 0,
                                "buildArea": 88.6,
                                "maxFloor": 7,
                                "through": 0,
                                "roomNum": 2,
                                "houseType": "2室1厅1卫1厨",
                                "orientation": 0,
                                "feature": ["临街", "把西山"],
                                "waterVapour": 0,
                                "parlourType": 0,
                                "status": 0,
                            },
                            "customer": {
                                "cid": 1,
                                "no": "1501010001",
                                "name": "李",
                            },
                            "deedNum": 1,
                            "deedValue": 1,
                            "unitPrice": 0,
                            "totalPrice": 88.6,
                            "decorateTime": 7,
                            "decorateDegree": 0,
                            "discussType": 2,
                            "rentType": "2室1厅1卫1厨",
                            "indoores": 0,
                            "history": ["临街", "把西山"],
                            "propertyFee": 0,
                            "elevator": 0,
                            "onlyHousing": 0,
                            "documentsDate": 0,
                            "allowLoan": 0,
                            "beingLoan": 0
                            "checkingTime": 0,
                            "creater": {
                                "uid": 1,
                                "userId": "U0001",
                                "oldUserId": "CS001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "deptType": "行政",
                                "duty": "财务",
                                "phone": "135xxxx1918",
                                "userPhoto": ""
                            },
                            "createTime": 0
                            "follower": {
                                "uid": 1,
                                "userId": "U0001",
                                "oldUserId": "CS001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "deptType": "行政",
                                "duty": "财务",
                                "phone": "135xxxx1918",
                                "userPhoto": ""
                            },
                            "keyer": {
                                "uid": 1,
                                "userId": "U0001",
                                "oldUserId": "CS001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "deptType": "行政",
                                "duty": "财务",
                                "phone": "135xxxx1918",
                                "userPhoto": ""
                            },
                            "housingGrade": 0,
                            "status": 0,
                            "path": 0,
                            "comment": 0
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <I> pageBuildingHouseForAdvance

        分页方式获取房源信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        利用房源-部门权限 , 查询当前人员拥有的部门权限下跟进人归属的房源信息
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 房源信息列表 , 每条数据类型 *buildingHouse*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "hsid": 1,
                            "type": 2
                            "sourceType": "1#1-1-1",
                            "house": {
                                "hid": 1,
                                "village": {
                                    "vid": 1,
                                    "no": "P001",
                                    "name": "广场一期",
                                    "deliveryTime": null,
                                    "developer": "222",
                                    "salesPhone": "",
                                    "status": 0,
                                },
                                "houseNumber": "1#1-1-1",
                                "built": 1,
                                "unit": 1,
                                "floor": 1,
                                "door": 1,
                                "type": 0,
                                "buildArea": 88.6,
                                "maxFloor": 7,
                                "through": 0,
                                "roomNum": 2,
                                "houseType": "2室1厅1卫1厨",
                                "orientation": 0,
                                "feature": ["临街", "把西山"],
                                "waterVapour": 0,
                                "parlourType": 0,
                                "status": 0,
                            },
                            "customer": {
                                "cid": 1,
                                "no": "1501010001",
                                "name": "李",
                            },
                            "deedNum": 1,
                            "deedValue": 1,
                            "unitPrice": 0,
                            "totalPrice": 88.6,
                            "decorateTime": 7,
                            "decorateDegree": 0,
                            "discussType": 2,
                            "rentType": "2室1厅1卫1厨",
                            "indoores": 0,
                            "history": ["临街", "把西山"],
                            "propertyFee": 0,
                            "elevator": 0,
                            "onlyHousing": 0,
                            "documentsDate": 0,
                            "allowLoan": 0,
                            "beingLoan": 0
                            "checkingTime": 0,
                            "creater": {
                                "uid": 1,
                                "userId": "U0001",
                                "oldUserId": "CS001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "deptType": "行政",
                                "duty": "财务",
                                "phone": "135xxxx1918",
                                "userPhoto": ""
                            },
                            "createTime": 0
                            "follower": {
                                "uid": 1,
                                "userId": "U0001",
                                "oldUserId": "CS001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "deptType": "行政",
                                "duty": "财务",
                                "phone": "135xxxx1918",
                                "userPhoto": ""
                            },
                            "keyer": {
                                "uid": 1,
                                "userId": "U0001",
                                "oldUserId": "CS001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "deptType": "行政",
                                "duty": "财务",
                                "phone": "135xxxx1918",
                                "userPhoto": ""
                            },
                            "housingGrade": 0,
                            "status": 0,
                            "path": 0,
                            "comment": 0
                        }
                    ],
                    ...
                },
                ...
            }
    
    ### <I> queryBuildingHouseByHsid

        根据房产ID获取房源信息
        
                |Requests:|
                :param buildingHouse.hsid: 房源ID
        :type buildingHouse.hsid: Long
        
        Example::
        
            {
                "buildingHouse.hsid": 1
            }
        
                |Returns:|
                - **buildingHouse**: 房源信息列表 , 每条数据类型 *buildingHouse*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "buildingHouse": {
                    "hsid": 1,
                    "type": 2
                    "sourceType": "1#1-1-1",
                    "house": {
                        "hid": 1,
                        "village": {
                            "vid": 1,
                            "no": "P001",
                            "name": "广场一期",
                            "deliveryTime": null,
                            "developer": "222",
                            "salesPhone": "",
                            "status": 0,
                        },
                        "houseNumber": "1#1-1-1",
                        "built": 1,
                        "unit": 1,
                        "floor": 1,
                        "door": 1,
                        "type": 0,
                        "buildArea": 88.6,
                        "maxFloor": 7,
                        "through": 0,
                        "roomNum": 2,
                        "houseType": "2室1厅1卫1厨",
                        "orientation": 0,
                        "feature": ["临街", "把西山"],
                        "waterVapour": 0,
                        "parlourType": 0,
                        "status": 0,
                    },
                    "customer": {
                        "cid": 1,
                        "no": "1501010001",
                        "name": "李",
                    },
                    "deedNum": 1,
                    "deedValue": 1,
                    "unitPrice": 0,
                    "totalPrice": 88.6,
                    "decorateTime": 7,
                    "decorateDegree": 0,
                    "discussType": 2,
                    "rentType": "2室1厅1卫1厨",
                    "indoores": 0,
                    "history": ["临街", "把西山"],
                    "propertyFee": 0,
                    "elevator": 0,
                    "onlyHousing": 0,
                    "documentsDate": 0,
                    "allowLoan": 0,
                    "beingLoan": 0
                    "checkingTime": 0,
                    "creater": {
                        "uid": 1,
                        "userId": "U0001",
                        "oldUserId": "CS001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "deptType": "行政",
                        "duty": "财务",
                        "phone": "135xxxx1918",
                        "userPhoto": ""
                    },
                    "createTime": 0
                    "follower": {
                        "uid": 1,
                        "userId": "U0001",
                        "oldUserId": "CS001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "deptType": "行政",
                        "duty": "财务",
                        "phone": "135xxxx1918",
                        "userPhoto": ""
                    },
                    "keyer": {
                                "uid": 1,
                                "userId": "U0001",
                                "oldUserId": "CS001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "deptType": "行政",
                                "duty": "财务",
                                "phone": "135xxxx1918",
                                "userPhoto": ""
                            },
                    "housingGrade": 0,
                    "status": 0,
                    "path": 0,
                    "comment": 0
                }
                ...
            }
            
    ### <I> queryBuildingHouseByNo

        根据房产编号获取房源信息
        
                |Requests:|
                :param buildingHouse.no: 房源编号
        :type buildingHouse.no: String
        
        Example::
        
            {
                "buildingHouse.no": "H1601010001"
            }
        
                |Returns:|
                - **buildingHouse**: 房源信息列表 , 每条数据类型 *buildingHouse*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "buildingHouse": {
                    "hsid": 1,
                    "type": 2
                    "sourceType": "1#1-1-1",
                    "house": {
                        "hid": 1,
                        "village": {
                            "vid": 1,
                            "no": "P001",
                            "name": "广场一期",
                            "deliveryTime": null,
                            "developer": "222",
                            "salesPhone": "",
                            "status": 0,
                        },
                        "houseNumber": "1#1-1-1",
                        "built": 1,
                        "unit": 1,
                        "floor": 1,
                        "door": 1,
                        "type": 0,
                        "buildArea": 88.6,
                        "maxFloor": 7,
                        "through": 0,
                        "roomNum": 2,
                        "houseType": "2室1厅1卫1厨",
                        "orientation": 0,
                        "feature": ["临街", "把西山"],
                        "waterVapour": 0,
                        "parlourType": 0,
                        "status": 0,
                    },
                    "customer": {
                        "id": 1,
                        "no": "1501010001",
                        "name": "李",
                    },
                    "deedNum": 1,
                    "deedValue": 1,
                    "unitPrice": 0,
                    "totalPrice": 88.6,
                    "decorateTime": 7,
                    "decorateDegree": 0,
                    "discussType": 2,
                    "rentType": "2室1厅1卫1厨",
                    "indoores": 0,
                    "history": ["临街", "把西山"],
                    "propertyFee": 0,
                    "elevator": 0,
                    "onlyHousing": 0,
                    "documentsDate": 0,
                    "allowLoan": 0,
                    "beingLoan": 0
                    "checkingTime": 0,
                    "creater": {
                        "uid": 1,
                        "userId": "U0001",
                        "oldUserId": "CS001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "deptType": "行政",
                        "duty": "财务",
                        "phone": "135xxxx1918",
                        "userPhoto": ""
                    },
                    "createTime": 0
                    "follower": {
                        "uid": 1,
                        "userId": "U0001",
                        "oldUserId": "CS001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "deptType": "行政",
                        "duty": "财务",
                        "phone": "135xxxx1918",
                        "userPhoto": ""
                    },
                    "keyer": {
                        "uid": 1,
                        "userId": "U0001",
                        "oldUserId": "CS001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "deptType": "行政",
                        "duty": "财务",
                        "phone": "135xxxx1918",
                        "userPhoto": ""
                    },
                    "housingGrade": 0,
                    "status": 0,
                    "path": 0,
                    "comment": 0
                }
                ...
            }
            
    ### <I> checkBuildingHouse

        验证房源信息
        
                |Requests:|
                :param buildingHouse.house.hid: 房产ID
        :type buildingHouse.house.hid: Long
        :param buildingHouse.type: 类型
        :type buildingHouse.type: Short
        
        Example::
        
            {
                "buildingHouse.house.hid": 1,
                "buildingHouse.type": 1
            }
        
                |Returns:|
                - **buildingHouse**: 房源信息列表 , 每条数据类型 *buildingHouse*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "buildingHouse": {
                    "hsid": 1,
                    "type": 2
                    "sourceType": "1#1-1-1",
                    "house": {
                        "hid": 1,
                        "village": {
                            "vid": 1,
                            "no": "P001",
                            "name": "广场一期",
                            "deliveryTime": null,
                            "developer": "222",
                            "salesPhone": "",
                            "status": 0,
                        },
                        "houseNumber": "1#1-1-1",
                        "built": 1,
                        "unit": 1,
                        "floor": 1,
                        "door": 1,
                        "type": 0,
                        "buildArea": 88.6,
                        "maxFloor": 7,
                        "through": 0,
                        "roomNum": 2,
                        "houseType": "2室1厅1卫1厨",
                        "orientation": 0,
                        "feature": ["临街", "把西山"],
                        "waterVapour": 0,
                        "parlourType": 0,
                        "status": 0,
                    },
                    "customer": {
                        "id": 1,
                        "no": "1501010001",
                        "name": "李",
                    },
                    "deedNum": 1,
                    "deedValue": 1,
                    "unitPrice": 0,
                    "totalPrice": 88.6,
                    "decorateTime": 7,
                    "decorateDegree": 0,
                    "discussType": 2,
                    "rentType": "2室1厅1卫1厨",
                    "indoores": 0,
                    "history": ["临街", "把西山"],
                    "propertyFee": 0,
                    "elevator": 0,
                    "onlyHousing": 0,
                    "documentsDate": 0,
                    "allowLoan": 0,
                    "beingLoan": 0
                    "checkingTime": 0,
                    "creater": {
                        "uid": 1,
                        "userId": "U0001",
                        "oldUserId": "CS001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "deptType": "行政",
                        "duty": "财务",
                        "phone": "135xxxx1918",
                        "userPhoto": ""
                    },
                    "createTime": 0
                    "follower": {
                        "uid": 1,
                        "userId": "U0001",
                        "oldUserId": "CS001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "deptType": "行政",
                        "duty": "财务",
                        "phone": "135xxxx1918",
                        "userPhoto": ""
                    },
                    "keyer": {
                        "uid": 1,
                        "userId": "U0001",
                        "oldUserId": "CS001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "deptType": "行政",
                        "duty": "财务",
                        "phone": "135xxxx1918",
                        "userPhoto": ""
                    },
                    "housingGrade": 0,
                    "status": 0,
                    "path": 0,
                    "comment": 0
                }
                ...
            }
    
    ### <I> addBuildingHouse

        添加房源信息
        
        判断房源是否存在 , 错误信息 **320004 房源已存在**
        
                |Requests:|
                :param buildingHouse.type: 房源类型
        :type buildingHouse.type: Short
        :param buildingHouse.sourceType: 信息来源
        :type buildingHouse.sourceType: Short
        :param buildingHouse.house.hid: 房证ID
        :type buildingHouse.house.hid: Long
        :param buildingHouse.customer.cid: 房产权属
        :type buildingHouse.customer.cid: Long
        :param buildingHouse.deedNum: 契证编号
        :type buildingHouse.deedNum: String
        :param buildingHouse.deedValue: 契证原值
        :type buildingHouse.deedValue: Float
        :param buildingHouse.unitPrice: 单价
        :type buildingHouse.unitPrice: Float
        :param buildingHouse.totalPrice: 总价
        :type buildingHouse.totalPrice: Float
        :param buildingHouse.decorateTime: 装修时间
        :type buildingHouse.decorateTime: Timestamp
        :param buildingHouse.decorateDegree: 装修程度
        :type buildingHouse.decorateDegree: Short
        :param buildingHouse.discussType: 商议类型
        :type buildingHouse.discussType: Short
        :param buildingHouse.rentType: 交租方式
        :type buildingHouse.rentType: Integer
        :param buildingHouse.indoores: 室内设施
        :type buildingHouse.indoores: String
        :param buildingHouse.history: 房屋历史
        :type buildingHouse.history: Short
        :param buildingHouse.propertyFee: 物业费
        :type buildingHouse.propertyFee: Float
        :param buildingHouse.elevator: 电梯
        :type buildingHouse.elevator: Short
        :param buildingHouse.onlyHousing: 唯一住房
        :type buildingHouse.onlyHousing: Short
        :param buildingHouse.documentsDate: 下证日期
        :type buildingHouse.documentsDate: Timestamp
        :param buildingHouse.allowLoan: 允许贷款
        :type buildingHouse.allowLoan: Short
        :param buildingHouse.beingLoan: 有无贷款
        :type buildingHouse.beingLoan: Short
        :param buildingHouse.checkingTime: 看房时间
        :type buildingHouse.checkingTime: Timestamp
        :param buildingHouse.user.uid: 跟进人
        :type buildingHouse.user.uid: Long
        :param buildingHouse.housingGrade: 房源等级
        :type buildingHouse.housingGrade: String
        :param buildingHouse.comment: 备注
        :type buildingHouse.comment: String
        
        Example::
        
            {
                "buildingHouse.type": 0,
                "buildingHouse.sourceType": 2,
                "buildingHouse.house.hid": 1,
                "buildingHouse.customer.cid": 1,
                "buildingHouse.deedNum": "×契证×字第×号",
                "buildingHouse.deedValue": 88,
                "buildingHouse.unitPrice": 6500,
                "buildingHouse.totalPrice": 50,
                "buildingHouse.decorateTime": "2017-01-01",
                "buildingHouse.decorateDegree": 2,
                "buildingHouse.discussType": 0,
                "buildingHouse.rentType": null,
                "buildingHouse.indoores": "["冰箱", "洗衣机"]",
                "buildingHouse.history": 0,
                "buildingHouse.propertyFee": 3.2,
                "buildingHouse.elevator": 0,
                "buildingHouse.onlyHousing": 0,
                "buildingHouse.documentsDate": "2016-01-01",
                "buildingHouse.allowLoan": 0,
                "buildingHouse.beingLoan": 0,
                "buildingHouse.checkingTime": 待定,
                "buildingHouse.user.uid": 1,
                "buildingHouse.housingGrade": A,
                "buildingHouse.comment": "说明"
            }
            
    ### <I> takeBuildingHouse

        认领房源信息
        
        判断房源是否存在 , 错误信息 **320005 房源不存在**
        
        判断房源当前跟进人是否为空 , 不为空 , 错误信息 **320006 房源状态不可操作**
        
                |Requests:|
                :param buildingHouse.hsid: 房产ID
        :type buildingHouse.hsid: Long
        
        Example::
        
            {
                "buildingHouse.hsid": 1
            }
    
    ### <I> updateBuildingHouse

        更新房源信息
        
        判断房源是否存在 , 错误信息 **320005 房源不存在**
        
        判断房源状态是否为失效 , 失效房产状态不可操作 , 错误信息 **320006 房源状态不可操作**
		
                |Requests:|
                :param buildingHouse.hsid: 房产ID
        :type buildingHouse.hsid: Long
        :param buildingHouse.sourceType: 信息来源
        :type buildingHouse.sourceType: Short
        :param buildingHouse.deedNum: 契证编号
        :type buildingHouse.deedNum: String
        :param buildingHouse.deedValue: 契证原值
        :type buildingHouse.deedValue: Float
        :param buildingHouse.unitPrice: 单价
        :type buildingHouse.unitPrice: Float
        :param buildingHouse.totalPrice: 总价
        :type buildingHouse.totalPrice: Float
        :param buildingHouse.decorateTime: 装修时间
        :type buildingHouse.decorateTime: Timestamp
        :param buildingHouse.decorateDegree: 装修程度
        :type buildingHouse.decorateDegree: Short
        :param buildingHouse.discussType: 商议类型
        :type buildingHouse.discussType: Short
        :param buildingHouse.rentType: 交租方式
        :type buildingHouse.rentType: Integer
        :param buildingHouse.indoores: 室内设施
        :type buildingHouse.indoores: String
        :param buildingHouse.history: 房屋历史
        :type buildingHouse.history: Short
        :param buildingHouse.propertyFee: 物业费
        :type buildingHouse.propertyFee: Float
        :param buildingHouse.elevator: 电梯
        :type buildingHouse.elevator: Short
        :param buildingHouse.onlyHousing: 唯一住房
        :type buildingHouse.onlyHousing: Short
        :param buildingHouse.documentsDate: 下证日期
        :type buildingHouse.documentsDate: Timestamp
        :param buildingHouse.allowLoan: 允许贷款
        :type buildingHouse.allowLoan: Short
        :param buildingHouse.beingLoan: 有无贷款
        :type buildingHouse.beingLoan: Short
        :param buildingHouse.checkingTime: 看房时间
        :type buildingHouse.checkingTime: Timestamp
        :param buildingHouse.housingGrade: 房源等级
        :type buildingHouse.housingGrade: String
        :param buildingHouse.comment: 备注
        :type buildingHouse.comment: String
        
        Example::
        
            {
                "buildingHouse.hsid": 1,
                "buildingHouse.sourceType": 2,
                "buildingHouse.deedNum": "×契证×字第×号",
                "buildingHouse.deedValue": 88,
                "buildingHouse.unitPrice": 6500,
                "buildingHouse.totalPrice": 50,
                "buildingHouse.decorateTime": "2017-01-01",
                "buildingHouse.decorateDegree": 2,
                "buildingHouse.discussType": 0,
                "buildingHouse.rentType": null,
                "buildingHouse.indoores": "["冰箱", "洗衣机"]",
                "buildingHouse.history": 0,
                "buildingHouse.propertyFee": 3.2,
                "buildingHouse.elevator": 0,
                "buildingHouse.onlyHousing": 0,
                "buildingHouse.documentsDate": "2016-01-01",
                "buildingHouse.allowLoan": 0,
                "buildingHouse.beingLoan": 0,
                "buildingHouse.checkingTime": 待定,
                "buildingHouse.housingGrade": A,
                "buildingHouse.comment": "说明"
            }
            
    ### <I> updateBuildingHouseForBelong

        更新房源的跟进人
        
        判断房源是否存在 , 错误信息 **320005 房源不存在**
        
        判断房源状态是否为0(初始) , 其他状态不可操作 , 错误信息 **320006 房源状态不可操作**
        
        添加房产记录 , 类型为归属 , 内容为 **原跟进人,编号:<userId>,名称:<userName>;现跟进人,编号:<userId>,名称:<userName>**
        
                |Requests:|
                :param buildingHouse.hsid: 房源ID
        :type buildingHouse.hsid: Long
        :param buildingHouse.follower.uid: 跟进人ID
        :type buildingHouse.follower.uid: Long
        
        Example::
        
            {
                "buildingHouse.hsid": 1,
                "buildingHouse.follower.uid": 1
            }
            
    ### <I> updateBuildingHouseForKeyer

        更新房源的钥匙归属人
        
        判断房源是否存在 , 错误信息 **320005 房源不存在**
        
        判断房源状态是否为0(初始) , 其他状态不可操作 , 错误信息 **320006 房源状态不可操作**
        
        添加房产记录 , 类型为归属 , 内容为 **原钥匙归属,编号:<userId>,名称:<userName>;现钥匙归属,编号:<userId>,名称:<userName>**
        
                |Requests:|
                :param buildingHouse.hsid: 房源ID
        :type buildingHouse.hsid: Long
        :param buildingHouse.keyer.uid: 钥匙归属人ID
        :type buildingHouse.keyer.uid: Long
        
        Example::
        
            {
                "buildingHouse.hsid": 1,
                "buildingHouse.keyer.uid": 1
            }
            
    ### <I> updateBuildingHouseForPath

        更新房源默认图片路径
        
        判断房源是否存在 , 错误信息 **320005 房源不存在**
        
                |Requests:|
                :param buildingHouse.hsid: 房源ID
        :type buildingHouse.hsid: Long
        :param buildingHouse.path: 默认图片路径
        :type buildingHouse.path: String
        
        Example::
        
            {
                "buildingHouse.hsid": 1,
                "buildingHouse.path": "HDKSDODKEJ3213J123H12K3J.jpg"
            }
            
    ### <I> updateBuildingHouseForStatus

        更新房源状态
        
        判断房源是否存在 , 错误信息 **320005 房源不存在**
        
        判断房源状态是否为失效 , 失效房产状态不可操作 , 错误信息 **320006 房源状态不可操作**
        
                |Requests:|
                :param buildingHouse.hsid: 房源ID
        :type buildingHouse.hsid: Long
        :param buildingHouse.status: 状态
        :type buildingHouse.status: Short
        
        Example::
        
            {
                "buildingHouse.hsid": 1,
                "buildingHouse.status": 2
            }

## 客源

## api.building.BuildingCustomerAction

        |DataType:|
        #### customerSource

    - **csid**: 客源ID
      - 类型: *Long*
    - **no**: 编号 , 
    - **customer**: 客户 , 类型 [customer](./data.html#api.data.CustomerAction.customer)
      - 类型: *Object*
    - **type**: 类型 , 包括: 0(买房) , 1(租房) , 2(投资)
      - 类型: *Short*
    - **purpose**: 目的
      - 类型: *String*
    - **intention**: 意向
      - 类型: *String*
    - **price**: 需求价格
      - 类型: *String*
    - **area**: 需求面积
      - 类型: *String*
    - **familyType**: 需求户型
      - 类型: *String*
    - **orientation**: 朝向
      - 类型: *Short*
    - **conditions**: 意向备注
      - 类型: *String*
    - **grade**: 客户等级
      - 类型: *String*
    - **creater**: 创建人 , 类型 [user](./user.html#api.data.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **status**: 状态 , 0(初始) , 1(签约) , 2(无效)
      - 类型: *Short*
    - **comment**: 备注
      - 类型: *String*
    
    ### <I> pageBuildingCustomer

        分页方式获取客源信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        针对当前人员返回客源信息
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 客源列表 , 每条数据类型 *customerSource*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "csid": 1,
                            "no": "C1601010001",
                            "customer": {
                                "id": 1,
                                "no": "1501010001",
                                "name": "李",
                            },
                            "type": 0,
                            "purpose": "婚房",
                            "intention": "铁西区学区房",
                            "price": "{'MAX':1200, 'MIN': 1000}",
                            "area": "{'MAX':70, 'MIN': 50}",
                            "familyType": 2,
                            "orientation": 0,
                            "condition": "["4楼", "不把山"]",
                            "grade": "A",
                            "creater": {
                                "uid": 1,
                                "userId": "U0001",
                                "oldUserId": "CS001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "deptType": "行政",
                                "duty": "财务",
                                "phone": "135xxxx1918",
                                "userPhoto": ""
                            },
                            "createTime": "2017-01-01",
                            "status": 0,
                            "comment": "说明"
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <I> queryBuildingCustomerByCsid

        通过客源ID获取客源信息
        
                |Requests:|
                :param customerSource.csid: 客源ID
        :type customerSource.csid: Long
        
        Example::
        
            {
                "customerSource.csid": 1
            }
            
                |Returns:|
                - **customerSource**: 客源 , 类型 *customerSource*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "customerSource": {
                    "csid": 1,
                    "no": "C1601010001",
                    "customer": {
                        "id": 1,
                        "no": "1501010001",
                        "name": "李",
                    },
                    "type": 0,
                    "purpose": "婚房",
                    "intention": "铁西区学区房",
                    "price": "{'MAX':1200, 'MIN': 1000}",
                    "area": "{'MAX':70, 'MIN': 50}",
                    "familyType": 2,
                    "orientation": 0,
                    "condition": "["4楼", "不把山"]",
                    "grade": "A",
                    "creater": {
                        "uid": 1,
                        "userId": "U0001",
                        "oldUserId": "CS001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "deptType": "行政",
                        "duty": "财务",
                        "phone": "135xxxx1918",
                        "userPhoto": ""
                    },
                    "createTime": "2017-01-01",
                    "status": 0,
                    "comment": "说明"
                }
                ...
            }
            
    ### <I> queryBuildingCustomerByNo

        通过客源编号获取客源信息
        
                |Requests:|
                :param customerSource.no: 客源编号
        :type customerSource.no: String
        
        Example::
        
            {
                "customerSource.no": "C1601010001",
            }
            
                |Returns:|
                - **customerSource**: 客源 , 类型 *customerSource*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "customerSource": {
                    "csid": 1,
                    "no": "C1601010001",
                    "customer": {
                        "id": 1,
                        "no": "1501010001",
                        "name": "李",
                    },
                    "type": 0,
                    "purpose": "婚房",
                    "intention": "铁西区学区房",
                    "price": "{'MAX':1200, 'MIN': 1000}",
                    "area": "{'MAX':70, 'MIN': 50}",
                    "familyType": 2,
                    "orientation": 0,
                    "condition": "["4楼", "不把山"]",
                    "grade": "A",
                    "creater": {
                        "uid": 1,
                        "userId": "U0001",
                        "oldUserId": "CS001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "deptType": "行政",
                        "duty": "财务",
                        "phone": "135xxxx1918",
                        "userPhoto": ""
                    },
                    "createTime": "2017-01-01",
                    "status": 0,
                    "comment": "说明"
                }
                ...
            }
            
    ### <I> checkBuildingCustomer

        检验客源信息是否存在
        
                |Requests:|
                :param customerSource.customer.cid: 客户ID
        :type customerSource.customer.cid: Long
        :param customerSource.type: 类型
        :type customerSource.type: Short
        
        Example::
        
            {
                "customerSource.customer.cid": 1,
                "customerSource.type": 0
            }
            
                |Returns:|
                - **customerSource**: 客源 , 类型 *customerSource*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "customerSource": {
                    "csid": 1,
                    "no": "C1601010001",
                    "customer": {
                        "id": 1,
                        "no": "1501010001",
                        "name": "李",
                    },
                    "type": 0,
                    "purpose": "婚房",
                    "intention": "铁西区学区房",
                    "price": "{'MAX':1200, 'MIN': 1000}",
                    "area": "{'MAX':70, 'MIN': 50}",
                    "familyType": 2,
                    "orientation": 0,
                    "condition": "["4楼", "不把山"]",
                    "grade": "A",
                    "creater": {
                        "uid": 1,
                        "userId": "U0001",
                        "oldUserId": "CS001",
                        "userName": "白雪",
                        "currentName": "白雪",
                        "deptType": "行政",
                        "duty": "财务",
                        "phone": "135xxxx1918",
                        "userPhoto": ""
                    },
                    "createTime": "2017-01-01",
                    "status": 0,
                    "comment": "说明"
                }
                ...
            }
    
    ### <I> addBuildingCustomer

        添加客源信息
        
                |Requests:|
                :param customerSource.customer.cid: 客户ID
        :type customerSource.customer.cid: Long
        :param customerSource.type: 类型
        :type customerSource.type: Short
        :param customerSource.purpose: 目的
        :type customerSource.purpose: String
        :param customerSource.intention: 意向
        :type customerSource.intention: String
        :param customerSource.price: 需求价格
        :type customerSource.price: String
        :param customerSource.area: 需求面积
        :type customerSource.area: String
        :param customerSource.familyType: 需求户型
        :type customerSource.familyType: String
        :param customerSource.orientation: 朝向
        :type customerSource.orientation: Short
        :param customerSource.condition: 意向备注
        :type customerSource.condition: String
        :param customerSource.grade: 客户等级
        :type customerSource.grade: String
        :param customerSource.comment: 备注
        :type customerSource.comment: String
        
        Example::
        
            {
                "customerSource.customer.cid": 2,
                "customerSource.type": 0,
                "customerSource.purpose": "婚房",
                "customerSource.intention": "铁西广场附近",
                "customerSource.price": "{'MAX':1200, 'MIN': 1000}",
                "customerSource.area": "{'MAX':70, 'MIN': 50}",
                "customerSource.familyType": 2,
                "customerSource.orientation": 0,
                "customerSource.condition": "["4楼", "不把山", "..."]",
                "customerSource.grade": "A",
                "customerSource.comment": "备注"
            }
    
    ### <I> updateBuildingCustomer

        更新客源信息
        
        判断客源是否存在 , 错误信息 **320008 客源不存在**
        
        判断客源状态是否为失效 , 失效客源状态不可操作 , 错误信息 **320009 客源状态不可操作**
        
                |Requests:|
                :param customerSource.csid: 房产ID
        :type customerSource.csid: 1
        :param customerSource.purpose: 目的
        :type customerSource.purpose: String
        :param customerSource.intention: 意向
        :type customerSource.intention: String
        :param customerSource.price: 需求价格
        :type customerSource.price: String
        :param customerSource.area: 需求面积
        :type customerSource.area: String
        :param customerSource.familyType: 需求户型
        :type customerSource.familyType: String
        :param customerSource.orientation: 朝向
        :type customerSource.orientation: Short
        :param customerSource.condition: 意向备注
        :type customerSource.condition: String
        :param customerSource.grade: 客户等级
        :type customerSource.grade: String
        :param customerSource.status: 备注
        :type customerSource.status: String
        
        Example::
        
            {
                "customerSource.csid": 1,
                "customerSource.purpose": "婚房",
                "customerSource.intention": "铁西广场附近",
                "customerSource.price": "{'MAX':1200, 'MIN': 1000}",
                "customerSource.area": "{'MAX':70, 'MIN': 50}",
                "customerSource.familyType": 2,
                "customerSource.orientation": 0,
                "customerSource.condition": "["4楼", "不把山", "..."]",
                "customerSource.grade": "A",
                "customerSource.status": 0
            }
            
    ### <I> updateBuildingCustomerForStatus

        更新客源信息状态
        
        判断客源是否存在 , 错误信息 **320008 客源不存在**
        
        判断客源状态是否为失效 , 失效客源状态不可操作 , 错误信息 **320009 客源状态不可操作**
        
                |Requests:|
                :param customerSource.csid: 客源ID
        :type customerSource.csid: Long
        :param customerSource.status: 状态
        :type customerSource.status: 1
        
        Example::
        
            {
                "customerSource.csid": 1,
                "customerSource.status": 1
            }
            
## 房产单

## api.building.BuildingAction

        |DataType:|
        #### building

    - **bid**: 房产单ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *String*
    - **buildingHouse**: 房源 , 类型 [buildingHouse](./building.html#api.building.HouseSourceAction.buildingHouse)
      - 类型: *Object*
    - **customerSource**: 客源 , 类型 [customerSource](./building.html#api.building.BuildingCustomerAction.customerSource)
      - 类型: *Object*
    - **buildingHouseAgent**: 房源代理人 , 类型 [customer](./data.html#api.data.CustomerAction.customer)
      - 类型: *Object*
    - **customerSourceAgent**: 客源代理人 , 类型 [customer](./data.html#api.data.CustomerAction.customer)
      - 类型: *Object*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **signingTime**: 签约时间
      - 类型: *Timestamp*
    - **tradePrice**: 成交价格
      - 类型: *Float*
    - **downpayment**: 首付款
      - 类型: *Float*
    - **loanPrice**: 贷款金额
      - 类型: *Float*
    - **payType**: 支付方式 , 包括: 0(全款) , 1(贷款) , 2(月付)
      - 类型: *Short*
    - **status**: 状态 , 0(初始) , 1(失效)
      - 类型: *Short*
    - **buildingNode**: 流转状态 , 类型 [buildingNode](./building.html#api.building.BuildingNodeAction.buildingNode)
      - 类型: *Object*
    - **balanceStatus**: 结算状态 , 包括: 0(认购) , 1(成交)
      - 类型: *Short*
    
    ### <I> pageBuilding

        分页方式获取房产单信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 房产单信息列表 , 每条数据类型 *buildingHouse*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "bid": 1,
                            "no": "****",
                            "buildingHouse": {
                                "hsid": 1,
                                "type": 2
                                "sourceType": "1#1-1-1",
                                "house": {
                                    "hid": 1,
                                    "village": {
                                        "vid": 1,
                                        "no": "P001",
                                        "name": "广场一期",
                                        "deliveryTime": null,
                                        "developer": "222",
                                        "salesPhone": "",
                                        "status": 0,
                                    },
                                    "houseNumber": "1#1-1-1",
                                    "built": 1,
                                    "unit": 1,
                                    "floor": 1,
                                    "door": 1,
                                    "type": 0,
                                    "buildArea": 88.6,
                                    "maxFloor": 7,
                                    "through": 0,
                                    "roomNum": 2,
                                    "houseType": "2室1厅1卫1厨",
                                    "orientation": 0,
                                    "feature": ["临街", "把西山"],
                                    "waterVapour": 0,
                                    "parlourType": 0,
                                    "status": 0,
                                },
                                "customer": {
                                    "id": 1,
                                    "no": "1501010001",
                                    "name": "李",
                                },
                                "deedNum": 1,
                                "deedValue": 1,
                                "unitPrice": 0,
                                "totalPrice": 88.6,
                                "decorateTime": 7,
                                "decorateDegree": 0,
                                "discussType": 2,
                                "rentType": "2室1厅1卫1厨",
                                "indoores": 0,
                                "history": ["临街", "把西山"],
                                "propertyFee": 0,
                                "elevator": 0,
                                "onlyHousing": 0,
                                "documentsDate": 0,
                                "allowLoan": 0,
                                "beingLoan": 0
                                "checkingTime": 0,
                                "creater": {
                                    "uid": 1,
                                    "userId": "U0001",
                                    "oldUserId": "CS001",
                                    "userName": "白雪",
                                    "currentName": "白雪",
                                    "deptType": "行政",
                                    "duty": "财务",
                                    "phone": "135xxxx1918",
                                    "userPhoto": ""
                                },
                                "createTime": 0
                                "follower": {
                                    "uid": 1,
                                    "userId": "U0001",
                                    "oldUserId": "CS001",
                                    "userName": "白雪",
                                    "currentName": "白雪",
                                    "deptType": "行政",
                                    "duty": "财务",
                                    "phone": "135xxxx1918",
                                    "userPhoto": ""
                                },
                                "housingGrade": 0,
                                "status": 0,
                                "path": 0,
                                "comment": 0,
                            },
                            "customerSource": {
                                "csid": 1,
                                "customer": {
                                    "cid": 1,
                                    "no": "1501010001",
                                    "name": "李",
                                },
                                "purpose": "婚房",
                                "intention": "铁西区学区房",
                                "price": "{'MAX':1200, 'MIN': 1000}",
                                "area": "{'MAX':70, 'MIN': 50}",
                                "familyType": 2,
                                "orientation": 0,
                                "condition": "["4楼", "不把山"]",
                                "grade": "A",
                                "creater": {
                                    "uid": 1,
                                    "userId": "U0001",
                                    "oldUserId": "CS001",
                                    "userName": "白雪",
                                    "currentName": "白雪",
                                    "deptType": "行政",
                                    "duty": "财务",
                                    "phone": "135xxxx1918",
                                    "userPhoto": ""
                                },
                                "createTime": "2017-01-01",
                                "status": 0,
                                "comment": "说明",
                            },
                            "buildingHouseAgent": {
                                "cid": 1,
                                "no": "1501010001",
                                "name": "李",
                            },
                            "customerSourceAgent": {
                                "cid": 2,
                                "no": "1501010002",
                                "name": "赵",
                            },
                            "creater": {
                                "uid": 1,
                                "userId": "U0001",
                                "oldUserId": "CS001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "deptType": "行政",
                                "duty": "财务",
                                "phone": "135xxxx1918",
                                "userPhoto": ""
                            },
                            "createTime": "2017-01-01",
                            "signingTime": "2017-01-01",
                            "tradePrice": 50,
                            "downpayment": 15,
                            "loanPrice": 35,
                            "payType": 1,
                            "balanceStatus": 0
                        }
                    ],
                    ...
                },
                ...
            }
    
    ### <I> queryBuildingByBid

        根据房产单ID获取房产单信息
        
                |Requests:|
                :param building.bid: 房产单ID
        :type building.bid: Long
        
        Example::
        
            {
                "building.bid": 1
            }
        
                |Returns:|
                - **building**: 房产单信息列表 , 每条数据类型 *building*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "data": [
                    {
                        "bid": 1,
                        "no": "****",
                        "buildingHouse": {
                            "hsid": 1,
                            "type": 2
                            "sourceType": "1#1-1-1",
                            "house": {
                                "hid": 1,
                                "village": {
                                    "vid": 1,
                                    "no": "P001",
                                    "name": "广场一期",
                                    "deliveryTime": null,
                                    "developer": "222",
                                    "salesPhone": "",
                                    "status": 0,
                                },
                                "houseNumber": "1#1-1-1",
                                "built": 1,
                                "unit": 1,
                                "floor": 1,
                                "door": 1,
                                "type": 0,
                                "buildArea": 88.6,
                                "maxFloor": 7,
                                "through": 0,
                                "roomNum": 2,
                                "houseType": "2室1厅1卫1厨",
                                "orientation": 0,
                                "feature": ["临街", "把西山"],
                                "waterVapour": 0,
                                "parlourType": 0,
                                "status": 0,
                            },
                            "customer": {
                                "id": 1,
                                "no": "1501010001",
                                "name": "李",
                            },
                            "deedNum": 1,
                            "deedValue": 1,
                            "unitPrice": 0,
                            "totalPrice": 88.6,
                            "decorateTime": 7,
                            "decorateDegree": 0,
                            "discussType": 2,
                            "rentType": "2室1厅1卫1厨",
                            "indoores": 0,
                            "history": ["临街", "把西山"],
                            "propertyFee": 0,
                            "elevator": 0,
                            "onlyHousing": 0,
                            "documentsDate": 0,
                            "allowLoan": 0,
                            "beingLoan": 0
                            "checkingTime": 0,
                            "creater": {
                                "uid": 1,
                                "userId": "U0001",
                                "oldUserId": "CS001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "deptType": "行政",
                                "duty": "财务",
                                "phone": "135xxxx1918",
                                "userPhoto": ""
                            },
                            "createTime": 0
                            "follower": {
                                "uid": 1,
                                "userId": "U0001",
                                "oldUserId": "CS001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "deptType": "行政",
                                "duty": "财务",
                                "phone": "135xxxx1918",
                                "userPhoto": ""
                            },
                            "housingGrade": 0,
                            "status": 0,
                            "path": 0,
                            "comment": 0,
                        },
                        "customerSource": {
                            "csid": 1,
                            "customer": {
                                "id": 1,
                                "no": "1501010001",
                                "name": "李",
                            },
                            "type": 0,
                            "purpose": "婚房",
                            "intention": "铁西区学区房",
                            "price": "{'MAX':1200, 'MIN': 1000}",
                            "area": "{'MAX':70, 'MIN': 50}",
                            "familyType": 2,
                            "orientation": 0,
                            "condition": "["4楼", "不把山"]",
                            "grade": "A",
                            "creater": {
                                "uid": 1,
                                "userId": "U0001",
                                "oldUserId": "CS001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "deptType": "行政",
                                "duty": "财务",
                                "phone": "135xxxx1918",
                                "userPhoto": ""
                            },
                            "createTime": "2017-01-01",
                            "status": 0,
                            "comment": "说明",
                        },
                        "buildingHouseAgent": {
                            "cid": 1,
                            "no": "1501010001",
                            "name": "李",
                        },
                        "customerSourceAgent": {
                            "cid": 2,
                            "no": "1501010002",
                            "name": "赵",
                        },
                        "creater": {
                            "uid": 1,
                            "userId": "U0001",
                            "oldUserId": "CS001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "deptType": "行政",
                            "duty": "财务",
                            "phone": "135xxxx1918",
                            "userPhoto": ""
                        },
                        "createTime": "2017-01-01",
                        "signingTime": "2017-01-01",
                        "tradePrice": 50,
                        "downpayment": 15,
                        "loanPrice": 35,
                        "payType": 1,
                        "balanceStatus": 0
                    }
                ],
                ...
            }
    
    ### <I> bindBuilding

        房产单绑定房源、客源信息 , 房源客源状态变成已签约
        
        判断房源状态是否为初始状态 , 不是初始状态无法绑定 , 错误信息 **320006 房源状态不可操作**
        
        判断客源状态是否为初始状态 , 不是初始状态无法绑定 , 错误信息 **320009 客源状态不可操作**
        
        更新当前操作的房源和客源状态为1(签约)状态
        
        更新房源中跟进人归属的部门以及分区信息
        
                |Requests:|
                :param building.bid: 房产单ID
        :type building.bid: Long
        :param building.buildingHouse.hsid: 房源ID
        :type building.buildingHouse.hsid: Long
        :param building.customerSource.csid: 客源ID
        :type building.customerSource.csid: Long
        :param building.houseAgent.cid: 房源代理人ID
        :type building.houseAgent.cid: Long
        :param building.customerAgent.cid: 客源代理人ID
        :type building.customerAgent.cid: Long
        :param building.tradePrice: 成交价格
        :type building.tradePrice: Float
        :param building.downpayment: 首付款
        :type building.downpayment: Float
        :param building.loanPrice: 贷款额
        :type building.loanPrice: Float
        :param building.payType: 支付方式
        :type building.payType: Short
        :param building.status: 房产单状态
        :type building.status: Short
        
        
        Example::
        
            {
                "building.bid": 2,
                "building.buildingHouse.hsid": 1,
                "building.customerSource.csid": 1,
                "building.houseAgent.id": 2,
                "building.customerAgent.id": 2,
                "building.tradePrice": 1000
                "building.downpayment": 100,
                "building.loanPrice": "900",
                "building.payType": 1,
                "building.status": 1
            }
    
    ### <I> unbindBuilding

        房产单绑定房源、客源信息 , 房源客源状态变成初始
        
        判断房产单是否存在 , 错误信息 **320010 房产单不存在**
        
        判断房产单状态是否为已完成 , 已完成房产单状态不可操作 , 错误信息 **320011 房产单状态不可操作**
        
                |Requests:|
                :param building.bid: 房产单ID
        :type building.bid: Long
        :param building.buildingHouse.hsid: 房源ID
        :type building.buildingHouse.hsid: Long
        :param building.customerSource.csid: 客源ID
        :type building.customerSource.csid: Long
        
        Example::
        
            {
                "building.bid": 2,
                "building.buildingHouse.hsid": 1,
                "building.customerSource.csid": 1
            }
            
    ### <I> updateBuildingForBalanceStatus

        更新房产单结算状态
        
        判断房产单是否存在 , 错误信息 **320010 房产单不存在**
        
        判断房产单状态是否为已完成 , 已完成房产单状态不可操作 , 错误信息 **320011 房产单状态不可操作**
        
                |Requests:|
                :param building.bid: 房产单ID
        :type building.bid: Long
        :param building.balanceStatus: 结算状态
        :type building.balanceStatus: 1
        
        Example::
        
            {
                "building.bid": 1,
                "building.balanceStatus": 1
            }

## 房产流转

## api.building.BuildingScheduleAction

        |DataType:|
        #### buildingSchedule

    - **bsid**: 流转ID
      - 类型: *Long*
    - **buildingNode**: 房产节点 , 类型 [buildingNode](./building.html#api.building.BuildingNodeAction.buildingNode)
      - 类型: *Object*
    - **bid**: 房产单ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **planTime**: 计划时间
      - 类型: *Timestamp*
    - **status**: 状态 , 包括: 0(初始) , 1(失效) , 2(完结)
      - 类型: *Short*
    - **operater**: 操作人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **operatTime**: 操作时间
      - 类型: *Timestamp*
    - **comment**: 备注
      - 类型: *String*
    
    ### <I> queryBuildingScheduleByBid

        通过房产单ID获取房产环节信息
        
                |Returns:|
                :param buildingSchedule.building.bid: 房产单ID
        :type buildingSchedule.building.bid: Long
        
        Example::
        
            {
                "buildingSchedule.building.bid": 1
            }
        
                |Returns:|
                - **buildingSchedules**: 房产进度列表 , 每条数据类型 *buildingSchedule*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "buildingSchedules": [
                    {
                        "bsid": 1,
                        "buildingNode": {
                            "bnid": 1,
                            "name": "面签",
                            "type": "商业贷款",
                            "sore": 2,
                        },
                        "name": 面签,
                        "planTime": "2016-01-01 00:00:00",
                        "operater": {
                            "uid": 1,
                            "userId": "U0479",
                            "userName": "白雪",
                            "currentName": "白雪",
                            ...
                        },
                        "operatTime": "2016-01-01 00:00:00"
                    },
                ]
                ...
            }
            
    ### <I> nextBuildingSchedule

        房产流转节点下一阶段处理
        
        更新当前操作流转节点状态为完成
        
        添加下一流转节点信息
        
                |Requests:|
                :param buildingSchedule.bsid: 流转ID
        :type buildingSchedule.bsid: Long
        
        Example::
        
            {
                "buildingSchedule.bsid": 1
            }
    
    ### <I> updateBuildingSchedule

        更新房产流转节点预计时间信息
        
                |Requests:|
                :param buildingSchedule.bsid: 流转ID
        :type buildingSchedule.bsid: Long
        :param buildingSchedule.planTime: 计划时间
        :type buildingSchedule.planTime: Timestamp
        
        Example::
        
            {
                "buildingSchedule.bsid": 1,
                "buildingSchedule.planTime": "2016-01-01 00:00:00"
            }
            
    ### <I> updateBuildingScheduleForStatus

        更新房产流转节点状态
        
                |Requests:|
                :param buildingSchedule.bsid: 流转ID
        :type buildingSchedule.bsid: Long
        :param buildingSchedule.status: 状态
        :type buildingSchedule.status: Short
        
        Example::
        
            {
                "buildingSchedule.bsid": 1,
                "buildingSchedule.status": 1
            }
            
    ### <I> resetBuildingSchedule

        重新设置房产流转节点
        
        原有流转节点信息状态设置为失效 , 并记录操作人和操作时间
        
        判断房产单是否存在 , 错误信息 **320010 房产单不存在**
        
        判断房产单状态是否为已完成 , 已完成房产单状态不可操作 , 错误信息 **320011 房产单状态不可操作**
        
                |Requests:|
                :param building.bid: 流转ID
        :type building.bid: Long
        :param building.payType: 支付方式
        :type building.payType: Short
        
        Example::
        
            {
                "building.bid": 1,
                "building.payType": 1
            }

## 房产图片

## api.building.buildingDrawingAction

        |DataType:|
        #### buildingDrawing

    - **bdid**: 房产图片ID
      - 类型: *Long*
    - **sid**: 资源ID
      - 类型: *Long*
    - **name**: 图片名称
      - 类型: *String*
    - **drawingUrl**: 图片路径
      - 类型: *String*
    - **type**: 类型 , 包括: 0(房源) , 1(楼盘) , 2(房产单) , 3(房产流转)
      - 类型: *Short*
    - **drawingType**: 图片类型 , 0(本地) , 1(钉钉)
      - 类型: *Short*
    - **status**: 状态 , 0: 有效, 1: 无效
      - 类型: *Short*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    
    ### <I> queryBuildingDrawing

        根据资源ID和图片类型获取房产图片信息
        
                |Requests:|
                :param buildingDrawing.sid: 资源ID
        :type buildingDrawing.sid: Long
        :param buildingDrawing.type: 类型
        :type buildingDrawing.type: Short
        
        Example::
        
            {
                "buildingDrawing.sid": 1
                "buildingDrawing.type": 0
            }
        
                |Returns:|
                - **buildingDrawings**: 房产图片信息列表 , 每条数据类型 *buildingDrawing*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "buildingDrawings": [
                    {
                        "bdid": 1,
                        "sid": 1,
                        "name": "资源图片",
                        "drawingUrl": "lADO0kagwM0D6M0C7g_750_1000.jpg",
                        "drawingType": 0,
                        "type": 1,
                        "creater": {
                            "uid": 1,
                            "userId": "U0001",
                            "oldUserId": "CS001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "deptType": "行政",
                            "duty": "财务",
                            "phone": "135xxxx1918",
                            "userPhoto": ""
                        },
                        "createTime": "2017-01-01"
                    }
                ],
                ...
            }
    
    ### <I> addBuildingDrawing

        添加房产图片信息
        
                |Requests:|
                :param buildingDrawing.sid: 资源ID
        :type buildingDrawing.sid: Long
        :param buildingDrawing.name: 图片名称
        :type buildingDrawing.name: String
        :param buildingDrawing.drawingUrl: 图片路径
        :type buildingDrawing.drawingUrl: String
        :param buildingDrawing.drawingType: 图片类型
        :type buildingDrawing.drawingType: Short
        :param buildingDrawing.type: 类型
        :type buildingDrawing.type: Short
        
        Example::
        
            {
                "buildingDrawing.sid": 1,
                "buildingDrawing.name": "资源图片",
                "buildingDrawing.drawingUrl": "lADO3gWWs80BkM0BkA_400_400.jpg",
                "buildingDrawing.drawingType": 0,
                "buildingDrawing.type": 1
            }
            
    ### <I> deleteBuildingDrawing

        删除房产图片信息
        
                |Requests:|
                :param buildingDrawing.bdid: 图片ID
        :type buildingDrawing.bdid: Long
        
        Example::
        
            {
                "buildingDrawing.bdid": 1
            }
            
## 房产记录

## api.building.BuildingRecordAction

        |DataType:|
        #### buildingRecord

    - **brid**: 房产记录ID
      - 类型: *Long*
    - **hsid**: 房源ID
      - 类型: *Long*
    - **csid**: 客源ID
      - 类型: *Long*
    - **comment**: 记录信息
      - 类型: *String*
    - **type**: 记录类型 , 包括: 0(跟进) , 1(带看) , 2(自看) , 3(归属)
      - 类型: *Short*
    - **pattern**: 联系方式
      - 类型: *Short*
    - **operater**: 操作人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **operatTime**: 记录时间
      - 类型: *Timestamp*
    
    ### <I> queryBuildingRecord

        根据房源ID或客源ID和类型获取房产记录信息
        
                |Requests:|
                :param buildingRecord.buildingHouse.hsid: 房源ID
        :type buildingRecord.buildingHouse.hsid: Long
        :param buildingRecord.customerSource.csid: 客源ID
        :type buildingRecord.customerSource.csid: Long
        :param buildingRecord.type: 类型
        :type buildingRecord.type: Short
        
        Example::
        
            {
                "buildingRecord.buildingHouse.hsid": 1,
                "buildingRecord.customerSource.csid": null,
                "buildingRecord.type": 0
            }
        
                |Returns:|
                - **buildingRecords**: 房产记录信息列表 , 每条数据类型 *buildingRecord*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "buildingRecords": [
                    {
                        "brid": 1,
                        "hsid": 1,
                        "csid": 1,
                        "operater": {
                            "uid": 1,
                            "userId": "U0001",
                            "oldUserId": "CS001",
                            "userName": "白雪",
                            "currentName": "白雪",
                            "deptType": "行政",
                            "duty": "财务",
                            "phone": "135xxxx1918",
                            "userPhoto": ""
                        },
                        "operatTime": "2017-01-01",
                        "comment": "说明",
                        "type": 0,
                        "pattern": 0
                    }
                ],
                ...
            }
    
    ### <I> addBuildingRecord

        添加房产记录信息
        
                |Requests:|
                :param buildingRecord.buildingHouse.hsid: 房源ID
        :type buildingRecord.buildingHouse.hsid: Long
        :param buildingRecord.customerSource.csid: 客源ID
        :type buildingRecord.customerSource.csid: Long
        :param buildingRecord.type: 记录类型
        :type buildingRecord.type: Short
        :param buildingRecord.pattern: 联系方式
        :type buildingRecord.pattern: Short
        :param buildingRecord.comment: 记录信息
        :type buildingRecord.comment: String
        
        Example::
        
            {
                "buildingRecord.buildingHouse.hsid": 1,
                "buildingRecord.customerSource.csid": 1,
                "buildingRecord.type": 1,
                "buildingRecord.pattern": 0,
                "buildingRecord.comment": "说明"
            }
