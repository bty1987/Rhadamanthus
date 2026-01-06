# system {#system}

# 系统
## 公司

公司信息管理

## api.system.CompanyAction

        |DataType:|
        #### company

    - **cid**: 公司ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *Short*
    - **name**: 名称
      - 类型: *String*
    - **fullname**: 全名
      - 类型: *String*
    - **address**: 地址
      - 类型: *String*
    - **corporation**: 法人
      - 类型: *String*
    - **phone**: 电话
      - 类型: *String*
    - **drganization**: 装修组织 , 类型 [organization](./system.html#api.system.OrganizationAction.organization)
      - 类型: *Object*
    - **srganization**: 销售组织 , 类型 [organization](./system.html#api.system.OrganizationAction.organization)
      - 类型: *Object*
    - **atttype**: 业务类型 , 包括: 0: 集团 , 1: 装修 , 2: 家居 , 3: 工程 , 4: 建材 , 5: 房产 , 6: 科技 , 7: 其他
      - 类型: *Short*
    - **status**: 状态 , 0: 启用, 1: 禁用
      - 类型: *Short*
    
    ### <I> pageCompany

        分页方式获取公司信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
        公司主键Cid需要加密处理 , 加密失败 , 错误信息 **230017 公司获取失败**
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 公司信息列表 , 每条数据类型 *company*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "cid": 1,
                            "no": 1,
                            "name": "公司",
                            "fullname": "全名",
                            "address": "地址",
                            "corporation": "",
                            "phone": "024-25738293",
                            "drganization": {
                                "oid": 1,
                                "no": "JUYDO2NB4GK2N",
                                "name": "装修组织",
                            },
                            "srganization": {
                                "oid": 2,
                                "no": "B4U2NGK2YDJO2S",
                                "name": "销售组织",
                            },
                            "atttype": 0,
                            "status": 0
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <I> queryCompany

        获取全部公司信息
        
        公司主键Cid需要加密处理 , 加密失败 , 错误信息 **230017 公司获取失败**
        
                |Requests:|
                :param company.atttype: 业务类型
        :type company.atttype: Short
        
        Example::
        
            {
                "company.atttype": 1
            }
        
                |Returns:|
                - **companys**: 公司信息列表 , 每条数据类型 *company*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "companys": [
                    {
                        "cid": 1,
                        "no": 1,
                        "name": "公司",
                        "fullname": "全名",
                        "address": "地址",
                        "corporation": "",
                        "phone": "024-25738293",
                        "drganization": {
                            "oid": 1,
                            "no": "JUYDO2NB4GK2N",
                            "name": "装修组织",
                        },
                        "srganization": {
                            "oid": 2,
                            "no": "B4U2NGK2YDJO2S",
                            "name": "销售组织",
                        },
                        "atttype": 0,
                        "status": 0
                    }
                ],
                ...
            }
            
    ### <I> queryCompanyByCid

        通过公司ID获取全部公司信息
        
        首先利用解密处理公司Cid , 获取结果后 , 加密公司主键Cid
        
        公司主键Cid解密加密处理 , 处理失败 , 错误信息 **230017 公司获取失败**
        
                |Requests:|
                :param company.cid: ID
        :type company.cid: Long
        
        Example::
        
            {
                "company.cid": 1
            }
        
                |Returns:|
                - **company**: 公司信息 , 类型 *company*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "company": {
                    "cid": 1,
                    "no": 1,
                    "name": "公司",
                    "fullname": "全名",
                    "address": "地址",
                    "corporation": "",
                    "phone": "024-25738293",
                    "drganization": {
                        "oid": 1,
                        "no": "JUYDO2NB4GK2N",
                        "name": "装修组织",
                    },
                    "srganization": {
                        "oid": 2,
                        "no": "B4U2NGK2YDJO2S",
                        "name": "销售组织",
                    },
                    "atttype": 0,
                    "status": 0
                }
                ...
            }
            
    ### <C> createCompany

        创建公司
        

    ### <C> addCompany

        添加公司信息
        
        公司编号已存在 , 错误信息 **130013 公司编号已存在**
        
        公司名称已存在 , 错误信息 **130014 公司名称已存在**
        
                |Requests:|
                :param company.no: 编号
        :type company.no: Short
        :param company.name: 名称
        :type company.name: String
        :param company.fullname: 全名
        :type company.fullname: String
        :param company.address: 地址
        :type company.address: String
        :param company.corporation: 法人
        :type company.corporation: String
        :param company.phone: 电话
        :type company.phone: String
        :param company.drganization.oid: 组织ID
        :type company.drganization.oid: Long
        :param company.srganization.oid: 组织ID
        :type company.srganization.oid: Long
        :param company.atttype: 业务类型
        :type company.atttype: Short
        
        Example::
        
            {
                "company.no": 1,
                "company.name": "公司"
                "company.fullname": "全名",
                "company.address": "地址",
                "company.corporation": "",
                "company.phone": "024-25738293",
                "company.drganization.oid": 1,
                "company.srganization.oid": 2,
                "company.atttype": 0
            }
            
    ### <C> updateCompany

        更新公司信息
        
        公司主键Cid需要加密处理 , 加密失败 , 错误信息 **230017 公司获取失败**
        
        判断公司是否存在 , 不存在 , 错误信息 **230015 公司不存在**
        
                |Requests:|
                :param company.cid: ID
        :type company.cid: Long
        :param company.name: 名称
        :type company.name: String
        :param company.fullname: 全名
        :type company.fullname: String
        :param company.address: 地址
        :type company.address: String
        :param company.corporation: 法人
        :type company.corporation: String
        :param company.phone: 电话
        :type company.phone: String
        :param company.drganization.oid: 组织ID
        :type company.drganization.oid: Long
        :param company.srganization.oid: 组织ID
        :type company.srganization.oid: Long
        :param company.atttype: 业务类型
        :type company.atttype: Short
        
        Example::
        
            {
                "company.cid": 1,
                "company.name": "名称",
                "company.fullname": "全名",
                "company.address": "地址",
                "company.corporation": "法人",
                "company.phone": "245xxxx2345",
                "company.drganization.oid": 1,
                "company.srganization.oid": 2,
                "company.atttype": 0
            }
        
            
    ### <C> updateCompanyForStatus

        更新公司状态
        
        公司主键Cid需要加密处理 , 加密失败 , 错误信息 **230017 公司获取失败**
        
        判断公司是否存在 , 不存在 , 错误信息 **230015 公司不存在**
        
                |Requests:|
                :param company.cid: ID
        :type company.cid: Long
        :param company.status: 状态
        :type company.status: Short
        
        Example::
        
            {
                "company.cid": 1,
                "company.status": 0
            }

## 组织

## api.system.OrganizationAction

        |DataType:|
        #### organization

    - **oid**: 组织ID
      - 类型: *Long*
    - **no**: 编号
      - 类型: *Short*
    - **name**: 名称
      - 类型: *String*
    - **pinyin**: 拼音
      - 类型: *String*
    - **status**: 状态 , 0: 启用, 1: 禁用
      - 类型: *Short*
    
    ### <I> pageOrganization

        分页方式获取组织信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 组织信息列表 , 每条数据类型 *organization*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "oid": 1,
                            "no": "JUYDO2NB4GK2N",
                            "name": "组织",
                        }
                    ],
                    ...
                },
                ...
            }

    ### <I> queryOrganization

        查询组织
        
                |Returns:|
                - **organizations**: 组织信息列表 , 每条数据类型 *organization*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "organizations": [
                    {
                        "oid": 1,
                        "no": "JUYDO2NB4GK2N",
                        "name": "组织",
                    }
                ],
                ...
            }

    ### <I> addOrganization

        添加组织
        
                |Requests:|
                :param organization.no: 编号
        :type organization.no: String
        :param organization.name: 名称
        :type organization.name: Short
        
        Example::
        
            {
                "organization.no": "JUYDO2NB4GK2N",
                "organization.name": "组织",
            }

    ### <I> updateOrganization

        更新组织信息
        
        判断组织是否存在 , 不存在 , 错误信息 **230026 组织不存在**
        
                |Requests:|
                :param organization.oid: 组织ID
        :type organization.oid: Long
        :param organization.name: 名称
        :type organization.name: Short
        
        Example::
        
            {
                "organization.oid": 1,
                "organization.name": "组织",
            }

    ### <I> updateOrganizationForStatus

        更新组织状态
        
        判断组织是否存在 , 不存在 , 错误信息 **230026 组织不存在**
        
                |Requests:|
                :param organization.oid: 组织ID
        :type organization.oid: Long
        :param organization.status: 状态
        :type organization.status: Short
        
        Example::
        
            {
                "organization.oid": 1,
                "organization.status": 1,
            }

## 大区

大区信息管理

## api.system.RegionAction

        |DataType:|
        #### region

    - **rid**: 大区ID
      - 类型: *Integer*
    - **no**: 编码
      - 类型: *String*
    - **name**: 大区名称
      - 类型: *String*
    
        |Filters:|
        - **regionName**: 大区名称
      - 类型: *String*
    
    ### <I> pageRegion

        分页方式获取大区信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 大区信息列表 , 每条数据类型 *region*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "rid": 1,
                            "no": "R001",
                            "name": "东北区"
                        },
                        {
                            "rid": 2,
                            "no": "R002",
                            "name": "华北区"
                        }
                    ],
                    ...
                },
                ...
            }
    
    ### <I> queryRegion

        获取全部大区信息
        
                |Returns:|
                - **regions**: 大区信息列表 , 每条数据类型 *region*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "regions": [
                    {
                        "rid": 1,
                        "no": "R001",
                        "name": "东北区"
                    },
                    {
                        "rid": 2,
                        "no": "R002",
                        "name": "华北区"
                    }
                ],
                ...
            }
            
    ### <I> queryRegionByRid

        通过大区ID获取大区信息
        
                |Requests:|
                :param region.rid: 大区编号
        :type region.rid: Integer
        
        Example::
        
            {
                "region.rid": 1
            }
            
                |Returns:|
                - **region**: 大区信息 , 类型 *region*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "region":{
                    "rid": 1,
                    "no": "R001",
                    "name": "东北区"
                },
                ...
            }
            
    ### <I> queryRegionByName

        通过大区名称获取大区信息 , 大区名称可以使用名称拼音进行查询
        
                |Requests:|
                :param region.name: 大区名称 , 大区名称拼音
        :type region.name: String
        
        Example::
        
            {
                "region.name": "dongbei"
            }
        
                |Returns:|
                - **regions**: 大区信息列表 , 每条数据类型 *region*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "regions": [
                    {
                        "rid": 1,
                        "no": "R001",
                        "name": "东北区"
                    }
                ],
                ...
            }
            
    ### <C> addRegion

        添加大区信息
        
                |Requests:|
                :param region.name: 大区名称
        :type region.name: String
        
        Example::
        
            {
                "region.name": "华中区"
            }
    
    ### <C> updateRegion

        更新大区信息
        
        判断大区是否存在 , 不存在 , 错误信息 **230020 大区不存在**
        
                |Requests:|
                :param region.rid: 大区ID
        :type region.rid: Integer
        :param region.name: 大区名称
        :type region.name: String
        
        Example::
        
            {
                "region.rid": 1,
                "region.name": "华中区"
            }
            
    ### <C> deleteRegion

        删除大区信息
        
                |Requests:|
                :param rids[n]: 大区编号列表, 每条数据类型 Integer
        :type rids[n]: List
        
        Example::
            
            {
                "rids[0]": 1,
                "rids[1]": 1
            }
    
## 城市

城市信息管理

## api.system.CityAction

        |DataType:|
        #### city

    - **cid**: 城市ID
      - 类型: *Integer*
    - **no**: 城市编码
      - 类型: *String*
    - **name**: 城市名称
      - 类型: *String*
    - **province**: 省份
      - 类型: *String*
    - **region**: 所属大区 , 类型 `region <./system.html#api.system.RegionAction.region>`_
      - 类型: *Object*
    - **x**: 经度
      - 类型: *Integer*
    - **y**: 纬度
      - 类型: *Integer*
    
        |Filters:|
        - **name**: 城市名称
      - 类型: *String*
    - **regionId**: 大区ID
      - 类型: *String*
    
    ### <I> pageCity

        分页方式获取城市信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 城市信息列表 , 每条数据类型 *city*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "cid": 1,
                            "no": "C001",
                            "name": "沈阳",
                            "province": "辽宁",
                            "region": {
                                "rid": 1,
                                "no": "R001",
                                "name": "东北区"
                            },
                            "x": 0,
                            "y": 0
                        },
                        {
                            "cid": 2,
                            "no": "C002",
                            "name": "大连",
                            "province": "辽宁",
                            "region": {
                                "rid": 1,
                                "no": "R001",
                                "name": "东北区"
                            },
                            "x": 0,
                            "y": 0
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <I> queryCity

        获取全部城市信息
        
                |Returns:|
                - **citys**: 城市信息列表 , 每条数据类型 *city*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "citys": [
                    {
                        "cid": 1,
                        "no": "C001",
                        "name": "沈阳",
                        "province": "辽宁",
                        "region": {
                            "rid": 1,
                            "no": "R001",
                            "name": "东北区"
                        },
                        "x": 0,
                        "y": 0
                    },
                    {
                        "cid": 2,
                        "no": "C002",
                        "name": "大连",
                        "province": "辽宁",
                        "region": {
                            "rid": 1,
                            "no": "R001",
                            "name": "东北区"
                        },
                        "x": 0,
                        "y": 0
                    }
                ],
                ...
            }
            
    ### <I> queryCityByCid

        通过城市ID获取城市信息
        
        判断城市是否存在 , 不存在 , 错误信息 **230019 城市不存在**
        
                |Requests:|
                :param city.cid: 城市ID
        :type city.cid: Integer
        
        Example::
        
            {
                "city.cid": 1
            }
            
                |Returns:|
                - **city**: 城市信息 , 类型 *city*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "city": {
                    "cid": 2,
                    "no": "C002",
                    "name": "大连",
                    "province": "辽宁",
                    "region": {
                        "rid": 1,
                        "no": "R001",
                        "name": "东北区"
                    },
                    "x": 0,
                    "y": 0
                },
                ...
            }
            
    ### <I> queryCityByRid

        通过大区ID获取城市信息
        
                |Requests:|
                :param city.region.rid: 大区ID
        :type city.region.rid: Integer
        
        Example::
        
            {
                "city.region.rid": 1
            }
            
                |Returns:|
                - **citys**: 城市信息列表 , 每条数据类型 *city*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "citys": [
                    {
                        "cid": 1,
                        "no": "C001",
                        "name": "沈阳",
                        "province": "辽宁",
                        "region": {
                            "rid": 1,
                            "no": "R001",
                            "name": "东北区"
                        },
                        "x": 0,
                        "y": 0
                    },
                    {
                        "cid": 2,
                        "no": "C002",
                        "name": "大连",
                        "province": "辽宁",
                        "region": {
                            "rid": 1,
                            "no": "R001",
                            "name": "东北区"
                        },
                        "x": 0,
                        "y": 0
                    }
                ],
                ...
            }
            
    ### <I> queryCityByName

        通过城市名称获取城市信息 , 城市名称可以为名称拼音进行查询
        
                |Requests:|
                :param city.name: 城市名称 , 城市名称拼音
        :type city.name: String
        
        Example::
        
            {
                "city.name": "shenyang"
            }
        
                |Returns:|
                - **citys**: 城市信息列表 , 每条数据类型 *city*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "citys": [
                    {
                        "cid": 1,
                        "no": "C001",
                        "name": "沈阳",
                        "province": "辽宁",
                        "region": {
                            "rid": 1,
                            "no": "R001",
                            "name": "东北区"
                        },
                        "x": 0,
                        "y": 0
                    }
                ],
                ...
            }
            
    ### <C> addCity

        添加城市信息
        
                |Requests:|
                :param city.name: 城市名称
        :type city.name: String
        :param city.province: 省份
        :type city.province: String
        :param city.region.rid: 大区编号
        :type city.region.rid: Integer
        :param city.x: 经度
        :type city.x: Integer
        :param city.y: 纬度
        :tyoe city.y: Integer
        
        Example::
        
            {
                "city.name": "本溪",
                "city.province": "辽宁",
                "city.region.rid": 1,
                "city.x": 0,
                "city.y": 0
            }
            
    ### <C> updateCity

        更新城市信息
        
        判断城市是否存在 , 不存在 , 错误信息 **230019 城市不存在**
        
                |Requests:|
                :param city.cid: 城市ID
        :type city.cid: Integer
        :param city.name: 城市名称
        :type city.name: String
        :param city.province: 省份
        :type city.province: String
        :param city.region.rid: 大区ID
        :param city.region.rid: Integer
        :param city.x: 经度
        :type city.x: Integer
        :param city.y: 纬度
        :tyoe city.y: Integer
        
        Example::
        
            {
                "city.cid": 1,
                "city.name": "沈阳",
                "city.province": "辽宁",
                "city.region.rid": 1
            }

    ### <I> updateCityForPosition

        更新城市位置
        
        判断城市是否存在 , 不存在 , 错误信息 **230019 城市不存在**
        
                |Requests:|
                :param city.cid: 城市ID
        :type city.cid: Integer
        :param city.y: 纬度
        :type city.y: Integer
        
        Example::
        
            {
                "city.cid": 1,
                "city.x": 0,
                "city.y": 0
            }

    ### <C> deleteCity

        通过城市ID删除城市
        
        判断城市是否已经被城区引用 , 已引用 , 错误信息 **230006 城市已被引用,不能删除**
        
                |Requests:|
                :param city.cid: 城市ID
        :type city.cid: Integer
        
        Example::
        
            {
                "city.cid": 1,
                "city.name": "沈阳",
                "city.region.rid": 1
            }
            
## 城区

城区信息管理

## api.system.CityProperAction

        |DataType:|
        #### cityProper

    - **cpid**: 城区ID
      - 类型: *Integer*
    - **no**: 城区编码
      - 类型: *String*
    - **name**: 城区名称
      - 类型: *String*
    - **city**: 所属城市 , 类型 `city <./system.html#api.system.CityAction.city>`_
      - 类型: *Object*
    - **x**: 经度
      - 类型: *Integer*
    - **y**: 纬度
      - 类型: *Integer*
    
        |Filters:|
        - **cityProperName**: 城区名称
      - 类型: *String*
    - **cityId**: 城市ID
      - 类型: *Integer*
    - **regionId**: 大区ID
      - 类型: *Integer*
    
    ### <I> pageCityProper

        分页方式获取城区信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 城区信息列表 , 每条数据类型 *cityProper*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "cpid": 1,
                            "no": "CP001",
                            "name": "铁西",
                            "city": {
                                "cid": 1,
                                "no": "C001",
                                "name": "沈阳",
                                "region": {
                                    "rid": 1,
                                    "no": "R001",
                                    "name": "东北区"
                                }
                            },
                            "x": 0,
                            "y": 0
                        },
                        {
                            "cpid": 2,
                            "no": "CP002",
                            "name": "和平",
                            "city": {
                                "cid": 1,
                                "no": "C001",
                                "name": "沈阳",
                                "region": {
                                    "rid": 1,
                                    "no": "R001",
                                    "name": "东北区"
                                }
                            },
                            "x": 0,
                            "y": 0
                        }
                    ],
                    ...
                },
                ...
            }
    
    ### <I> queryCityProper

        获取全部城区信息
        
                |Returns:|
                - **cityPropers**: 城区信息列表 , 每条数据类型 *cityProper*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "cityPropers": [
                    {
                        "cpid": 1,
                        "no": "CP001",
                        "name": "铁西",
                        "city": {
                            "cid": 1,
                            "no": "C001",
                            "name": "沈阳",
                            "region": {
                                "rid": 1,
                                "no": "R001",
                                "name": "东北区"
                            }
                        },
                        "x": 0,
                        "y": 0
                    },
                    {
                        "cpid": 2,
                        "no": "CP002",
                        "name": "和平",
                        "city": {
                            "cid": 1,
                            "no": "C001",
                            "name": "沈阳",
                            "region": {
                                "rid": 1,
                                "no": "R001",
                                "name": "东北区"
                            }
                        },
                        "x": 0,
                        "y": 0
                    }
                ],
                ...
            }
            
    ### <I> queryCityProperByCpid

        通过城区ID获取城区信息
        
        判断城区是否存在 , 不存在 , 错误信息 **230018 城区不存在**
        
                |Requests:|
                :param cityProper.cpid: 城区Id
        :type cityProper.cpid: Integer
        
        Example::
        
            {
                "cityProper.cpid": 1
            }
            
                |Returns:|
                - **cityProper**: 城区信息 , 类型 *cityProper*
          - 类型: *Object*
        
        Example::
        
            {
                ...
                "cityProper": {
                    "cpid": 1,
                    "no": "CP001",
                    "name": "铁西",
                    "city": {
                        "cid": 1,
                        "no": "C001",
                        "name": "沈阳",
                        "region": {
                            "rid": 1,
                            "no": "R001",
                            "name": "东北区"
                        }
                    },
                    "x": 0,
                    "y": 0
                },
                ...
            }
            
    ### <I> queryCityProperByCid

        通过城市ID获取城区信息
        
                |Requests:|
                :param cityProper.city.cid: 城市ID
        :type cityProper.city.cid: Integer
        
        Example::
        
            {
                "cityProper.city.cid": 1
            }
            
                |Returns:|
                - **cityPropers**: 城区信息列表 , 每条数据类型 *cityProper*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "cityPropers": [
                    {
                        "cpid": 1,
                        "no": "CP001",
                        "name": "铁西",
                        "city": {
                            "cid": 1,
                            "no": "C001",
                            "name": "沈阳",
                            "region": {
                                "rid": 1,
                                "no": "R001",
                                "name": "东北区"
                            }
                        },
                        "x": 0,
                        "y": 0
                    },
                    {
                        "cpid": 2,
                        "no": "CP002",
                        "name": "和平",
                        "city": {
                            "cid": 1,
                            "no": "C001",
                            "name": "沈阳",
                            "region": {
                                "rid": 1,
                                "no": "R001",
                                "name": "东北区"
                            }
                        },
                        "x": 0,
                        "y": 0
                    }
                ],
                ...
            }
            
    ### <I> queryCityProperByName

        通过城区名称查询城区信息 , 城区名称可以使用名称拼音进行查询
        
                |Requests:|
                :param cityProper.name: 城区名称 , 城区名称拼音
        :type cityProper.name: String
        
        Example::
        
            {
                "cityProper.name": "tiexi"
            }
            
                |Returns:|
                - **cityPropers**: 城区信息列表 , 每条数据类型 *cityProper*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "cityPropers": [
                    {
                        "cpid": 1,
                        "no": "CP001",
                        "name": "铁西",
                        "city": {
                            "cid": 1,
                            "no": "C001",
                            "name": "沈阳",
                            "region": {
                                "rid": 1,
                                "no": "R001",
                                "name": "东北区"
                            }
                        },
                        "x": 0,
                        "y": 0
                    }
                ],
                ...
            }
            
    ### <C> addCityProper

        添加城区信息
        
                |Requests:|
                :param cityProper.name: 城区名称
        :type cityProper.name: String
        :param cityProper.city.cid: 城市编号
        :type cityProper.city.cid: Integer
        
        Example::
        
            {
                "cityProper.name": "沈河",
                "cityProper.city.cid": 1
            }
            
    ### <C> updateCityProper

        更新城区信息
        
        判断城区是否存在 , 不存在 , 错误信息 **230018 城区不存在**
        
                |Requests:|
                :param cityProper.cpid: 城区ID
        :type cityProper.cpid: Long
        :param cityProper.name: 城区名称
        :type cityProper.name: String
        :param cityProper.city.cid: 城市编号
        :type cityProper.city.cid: String
        
        Example::
        
            {
                "cityProper.cpid": 1,
                "cityProper.name": "铁西",
                "cityProper.city.cid": 1
            }

    ### <C> updateCityProperForPosition

        更新城区位置
        
        判断城区是否存在 , 不存在 , 错误信息 **230018 城区不存在**
        
                |Requests:|
                :param cityProper.cpid: 城区ID
        :type cityProper.cpid: Long
        :param cityProper.x: 经度
        :type cityProper.x: Integer
        :param cityProper.y: 纬度
        :type cityProper.y: Integer
        
        Example::
        
            {
                "cityProper.cpid": 1,
                "cityProper.x": "铁西",
                "cityProper.y": 1
            }
            
    ### <C> deleteCityProper

        删除城区信息
        
        判断城区是否被楼盘引用 , 已引用 , 错误信息 **230003 , 城区已引用,不能删除**
        
        判断城区是否被部门引用 , 已引用 , 错误信息 **230003 , 城区已引用,不能删除**
        
                |Requests:|
                - **cpid**: 城区编号
          - 类型: *Integer*
        
        Example::
        
            {
                "cpid": 1
            }
            
## 角色

角色信息管理

## api.system.RoleAction

        |DataType:|
        #### role

    - **rid**: 角色ID
      - 类型: *Long*
    - **name**: 名称
      - 类型: *String*
    - **pinyin**: 拼音
      - 类型: *String*
    - **level**: 等级
      - 类型: *Short*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **content**: 描述
      - 类型: *String*
    
        |Filters:|
        - **roleName**: 角色名称
      - 类型: *String*
    
    ### <I> pageRole

        分页方式获取角色信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 角色信息列表 , 每条数据类型 *role*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "rid": "R01",
                            "name": "设计师",
                            "creater": {
                                "uid": 1,
                                "userId": "U0203",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "136xxxx1453",
                                ...
                            },
                            "createTime": "2016-01-01 00:00:00",
                            "content": "设计师"
                        },
                        {
                            "rid": "R02",
                            "name": "业务员",
                            "creater": {
                                "uid": 1,
                                "userId": "U0203",
                                "userName": "王宁",
                                "currentName": "王宁",
                                "phone": "136xxxx1453",
                                ...
                            },
                            "createTime": "2016-01-01 00:00:00",
                            "content": "业务员"
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <I> queryRole

        获取全部角色信息
        
                |Returns:|
                - **roleList**: 角色信息列表 , 每条数据类型 *role*
          - 类型: *List*
        
        Example::
        
            {
                "roleList": [
                    {
                        "rid": "R01",
                        "name": "设计师",
                        "creater": {
                            "uid": 1,
                            "userId": "U0203",
                            "userName": "王宁",
                            "currentName": "王宁",
                            "phone": "136xxxx1453",
                            ...
                        },
                        "createTime": "2016-01-01 00:00:00",
                        "content": "设计师"
                    },
                    {
                        "rid": "R02",
                        "name": "业务员",
                        "creater": {
                            "uid": 1,
                            "userId": "U0203",
                            "userName": "王宁",
                            "currentName": "王宁",
                            "phone": "136xxxx1453",
                            ...
                        },
                        "createTime": "2016-01-01 00:00:00",
                        "content": "业务员"
                    }
                ]
            }
            
    ### <I> queryRoleByRid

        通过角色ID获取角色信息
        
                |Requests:|
                :param role.rid: 角色ID
        :type role.rid: Integer
        
        Example::
        
            {
                "role.rid": 1
            }
        
                |Returns:|
                - **role**: 角色信息 , 类型 *role*
          - 类型: *Object*
        
        Example::
        
            {
                "role": {
                    "rid": 1,
                    "no": "R01",
                    "name": "设计师",
                    "creater": {
                        "uid": 1,
                        "userId": "U0203",
                        "userName": "王宁",
                        "currentName": "王宁",
                        "phone": "136xxxx1453",
                        ...
                    },
                    "createTime": "2016-01-01 00:00:00",
                    "content": "设计师"
                }
            }

    ### <I> queryRoleByName

        通过角色名称或者拼音获取角色信息
        
                |Requests:|
                :param role.name: 角色名称
        :type role.name: String
        
        Example::
        
            {
                "role.name": "设计师"
            }
            
                |Returns:|
                - **role**: 角色信息 , 类型 *role*
          - 类型: *Object*
        
        Example::
        
            {
                "role": {
                    "rid": 1,
                    "no": "R01",
                    "name": "设计师",
                    "creater": {
                        "uid": 1,
                        "userId": "U0203",
                        "userName": "王宁",
                        "currentName": "王宁",
                        "phone": "136xxxx1453",
                        ...
                    },
                    "createTime": "2016-01-01 00:00:00",
                    "content": "设计师"
                }
            }
            
    ### <C> addRole

        添加角色信息
        
        判断角色名称是否存在 , 已存在 , 错误信息 **230005 角色名称已经存在**
        
                |Requests:|
                :param role.name: 角色名称
        :type role.name: String
        :param role.content: 角色描述
        :type role.content: String
        
        Example::
        
            {
                "role.name": "设计师",
                "role.content": "设计师"
            }
            
    ### <C> updateRole

        更新角色信息
        
        判断角色是否存在 , 不存在 , 错误信息 **230010 角色不存在**
        
                |Requests:|
                :param role.rid: 角色编号
        :type role.rid: String
        :param role.name: 角色名称
        :type role.name: String
        :param role.content: 角色描述
        :type role.content: String
        
        Example::
        
            {
                "role.rid": "R001",
                "role.name": "设计师",
                "role.content": "设计师"
            }
            
    ### <C> deleteRoleByRid

        删除角色信息
        
        判断角色是否被人员引用 , 已引用 , 错误信息 **230006 角色已引用, 不能删除**
        
                |Requests:|
                :param role.rid: 角色Id
        :type role.rid: Integer
        
        Example::
        
            {
                "rid": 1
            }
            
## 模块

模块信息管理 , 控制菜单内容

## api.system.ModuleAction

        |DataType:|
        #### module

    - **mid**: 模块ID
      - 类型: *Integer*
    - **fatherModule**: 父模块 , 类型 *module*
      - 类型: *Object*
    - **name**: 模块名
      - 类型: *String*
    - **icon**: 图标
      - 类型: *String*
    - **url**: 模块路径
      - 类型: *String*
    - **level**: 层级
      - 类型: *Short*
    - **system**: 所属系统 , 1: 信息 , 2: 财务 , 3: 进销存
      - 类型: *Short*
    - **link**: 链接标识
      - 类型: *Short*
    
    ### <I> pageModule

        分页方式获取模块信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 模块信息列表 , 每条数据类型 *module*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "name": "城市",
                            "icon": "icon-pencil",
                            "level": 2,
                            "mid": 15,
                            "url": "/views/system/city.html",
                            "fatherModule": {
                                "name": "系统",
                                "icon": "icon-dashboard",
                                "level": 1,
                                "mid": 1,
                                "system": 1,
                                "url": "",
                                "fatherModule": null,
                            }
                        }
                    ],
                    ...
                },
                ...
            }
    
    ### <I> queryModule

        获取所有模块信息
        
                |Returns:|
                - **modules**: 模块信息列表 , 每条数据类型 *module*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "modules": [
                    {
                        "name": "城市",
                        "icon": "icon-pencil",
                        "level": 2,
                        "mid": 15,
                        "url": "/views/system/city.html",
                        "fatherModule": {
                            "name": "系统",
                            "icon": "icon-dashboard",
                            "level": 1,
                            "mid": 1,
                            "system": 1,
                            "url": "",
                            "fatherModule": null,
                        }
                    }
                ],
                ...
            }
            
    ### <I> queryModuleForLogin

        获取当前用户所属角色拥有的模块信息
        
                |Returns:|
                - **modules**: 模块信息列表 , 每条数据类型 *module*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "modules": [
                    {
                        "name": "城市",
                        "icon": "icon-pencil",
                        "level": 2,
                        "mid": 15,
                        "system": 1,
                        "url": "/views/system/city.html",
                        "fatherModule": {
                            "name": "系统",
                            "icon": "icon-dashboard",
                            "level": 1,
                            "mid": 1,
                            "system": 1,
                            "url": "",
                            "fatherModule": null,
                        }
                    }
                ],
                ...
            }
            
    ### <I> queryModuleForLink

        获取当前用户所属角色拥有的链接模块信息
        
                |Returns:|
                - **modules**: 模块信息列表 , 每条数据类型 *module*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "modules": [
                    {
                        "name": "城市",
                        "icon": "icon-pencil",
                        "level": 2,
                        "mid": 15,
                        "system": 1,
                        "url": "/views/system/city.html",
                        "fatherModule": {
                            "name": "系统",
                            "icon": "icon-dashboard",
                            "level": 1,
                            "mid": 1,
                            "system": 1,
                            "url": "",
                            "fatherModule": null,
                        }
                    }
                ],
                ...
            }
            
    ### <I> queryModuleByUserId

        通过员工编号获取用户所属角色拥有模块信息
        
        判断员工是否存在 , 不存在 , 错误信息 **190005 员工不存在**
        
                |Requests:|
                :param user.userId: 用户编号
        :type user.userId: String
        
        Example::
        
            {
                "user.userId": "U001"
            }
            
                |Returns:|
                - **modules**: 模块信息列表 , 每条数据类型 *module*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "modules": [
                    {
                        "name": "城市",
                        "icon": "icon-pencil",
                        "level": 2,
                        "mid": 15,
                        "url": "/views/system/city.html",
                        "fatherModule": {
                            "name": "系统",
                            "icon": "icon-dashboard",
                            "level": 1,
                            "mid": 1,
                            "system": 1,
                            "url": "",
                            "fatherModule": null,
                        }
                    }
                ],
                ...
            }
            
    ### <I> queryModuleByRid

        通过角色编号获取拥有模块信息
        
                |Requests:|
                :param role.rid: 角色ID
        :type role.rid: Long
        
        Example::
        
            {
                "role.rid": 1
            }
            
                |Returns:|
                - **modules**: 模块信息列表 , 每条数据类型 *module*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "modules": [
                    {
                        "name": "城市",
                        "icon": "icon-pencil",
                        "level": 2,
                        "mid": 15,
                        "url": "/views/system/city.html",
                        "fatherModule": {
                            "name": "系统",
                            "icon": "icon-dashboard",
                            "level": 1,
                            "mid": 1,
                            "system": 1,
                            "url": "",
                            "fatherModule": null,
                        }
                    }
                ],
                ...
            }

    ### <C> checkModule

        检查模块权限
        
        判断模块是否存在 , 不存在 , 错误信息 **230011 模块不存在**
        
                |Requests:|
                :param module.mid: 模块ID
        :type module.mid: Long
        
        Example::
        
            {
                "module.mid": 1
            }
            
    ### <C> addModule

        添加模块信息
        
        判断父模块是否存在 , 不存在 , 错误信息 **230011 模块不存在**
        
                |Requests:|
                :param module.name: 名称
        :type module.name: String
        :param module.icon: 图标
        :type module.icon: String
        :param module.url: 地址
        :type module.url: String
        :param module.level: 层级
        :type module.level: Short
        :param module.fatherModule.mid: 父模块ID
        :type module.fatherModule.mid: Integer
        
        Example::
        
            {
                "module.name": 系统,
                "module.icon": "icon-dashboard",
                "module.url": "/views/system/city.html",
                "module.system": 1,
                "module.fatherModule.mid": 1,
            }
            
    ### <C> updateRoleModuleByRid

        通过角色编号更新角色拥有的模块信息
        
        判断角色是否存在 , 不存在 , 错误信息 **230010 角色不存在**
        
        判断更新角色与操作人员对应角色等级 , 如果后者小于前者 , 错误信息 **-1 误操作权限**
        
                |Requests:|
                :param mids[n]: 模块编号列表 , 每条数据类型 Integer
        :type mids[n]: List
        :param role.rid: 角色编号
        :type role.rid: String
        
        Example::
        
            {
                "role.rid": 1,
                "mids[0]": 1,
            }
            
    ### <C> deleteModule

        删除模块信息
        
        判断模块是否已被角色引用 , 已引用 , 错误信息 **230012 模块已引用,不能删除**
        
                |Requests:|
                :param module.mid: 模块ID
        :type module.mid: Short
        
        Example::
        
            {
                "module.mid": 1
            }
            
## 操作

操作信息管理 , 控制系统操作权限

## api.system.OperationAction

        |DataType:|
        #### operation

    - **oid**: 操作ID
      - 类型: *Integer*
    - **module**: 模块 , 类型为 `module <./system.html#api.system.ModuleAction.module>`_
      - 类型: *String*
    - **name**: 操作说明
      - 类型: *String*
    - **operation**: 操作
      - 类型: *String*
    - **system**: 所属系统 , 1: 平台 , 2: 小程序
      - 类型: *Short*
    - **type**: 类型 , 0: 权限 , 1: 免检 , 2: 通用 , 3: 钉钉 , 4: 共享
      - 类型: *Short*
    
    ### <I> pageOperation

        分页方式获取操作信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 操作信息列表 , 每条数据类型 *operation*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "oid": 1,
                            "name": "测试",
                            "operation": "test",
                            "system": 1,
                            "module": null,
                            "type": 0
                        }
                    ],
                    ...
                },
                ...
            }
    
    ### <I> queryOperation

        获取所有操作信息
        
                |Requests:|
                :param operation.system: 系统
        :type operation.system: Short
        
        Example::
        
            {
                "operation.system": 1
            }
        
                |Returns:|
                - **operations**: 操作信息列表 , 每条数据类型 *operation*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "operations": [
                    {
                        "oid": 1,
                        "name": "测试",
                        "operation": "test",
                        "system": 1,
                        "module": null,
                        "type": 0
                    }
                ],
                ...
            }
        
    ### <I> queryOperationForLogin

        通过操作名称查询操作信息
        
                |Requests:|
                :param operation.system: 系统
        :type operation.system: Short
        
        Example::
        
            {
                "operation.system": 1
            }
            
                |Returns:|
                - **operations**: 操作信息列表 , 每条数据类型 *operation*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "operations": [
                    {
                        "oid": 1,
                        "name": "测试",
                        "operation": "test",
                        "system": 1,
                        "module": null,
                        "type": 0
                    }
                ],
                ...
            }

    ### <I> queryOperationForSelf

        查询当前操作用户拥有的操作信息
        
                |Requests:|
                :param operation.system: 系统
        :type operation.system: Short
        
        Example::
        
            {
                "operation.system": 1
            }
            
                |Returns:|
                - **operations**: 操作信息列表 , 每条数据类型 *operation*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "operations": [
                    {
                        "oid": 1,
                        "name": "测试",
                        "operation": "test",
                        "system": 1,
                        "module": null,
                        "type": 0
                    }
                ],
                ...
            }
            
    ### <I> queryOperationByUserId

        通过用户编号获取操作信息
        
        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**
        
                |Requests:|
                :param operation.system: 系统标识
        :type operation.system: Short
        :param user.userId: 用户编号
        :type user.userId: String
        
        Example::
        
            {
                "operation.system": 1,
                "user.userId": "U001"
            }
            
                |Returns:|
                - **operations**: 操作信息列表 , 每条数据类型 *operation*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "operations": [
                    {
                        "oid": 1,
                        "name": "测试",
                        "operation": "test",
                        "system": 1,
                        "module": null,
                        "type": 0
                    }
                ],
                ...
            }
            
    ### <I> queryOperationByRid

        通过角色编号获取操作信息
        
        判断角色是否存在 , 不存在 , 错误信息 **230010 角色不存在**
        
                |Requests:|
                :param operation.system: 系统标识
        :type operation.system: Short
        :param role.rid: 角色编号
        :type role.rid: String
        
        Example::
        
            {
                "operation.system": 1,
                "role.rid": 1
            }
            
                |Returns:|
                - **operations**: 操作信息列表 , 每条数据类型 *operation*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "operations": [
                    {
                        "oid": 1,
                        "name": "测试",
                        "operation": "test",
                        "system": 1,
                        "module": null,
                        "type": 0
                    }
                ],
                ...
            }
            
    ### <C> addOperation

        添加操作信息 , 相同操作的操作不能添加
        
                |Requests:|
                :param operation.name: 操作名
        :type operation.name: String
        :param operation.operation: 操作
        :type operation.operation: String
        :param operation.system: 系统
        :type operation.system: Short
        :param operation.type: 类型
        :type operation.type: Short
        :param operation.module.mid: 所属模块ID
        :type operation.module.mid: Integer
        
        Example::
        
            {
                "operation.name": "测试",
                "operation.operation": "test",
                "operation.system": 1,
                "operation.type": 1,
                "operation.module.mid": 1
            }

    ### <C> updateOpperation

        更新
        
                |Requests:|
                :param operation.oid: 操作ID
        :type operation.oid: Long
        :param operation.name: 操作名
        :type operation.name: String
        :param operation.operation: 操作
        :type operation.operation: String
        :param operation.system: 系统
        :type operation.system: Short
        :param operation.type: 类型
        :type operation.type: Short
        :param operation.module.mid: 所属模块ID
        :type operation.module.mid: Integer
        
        Example::
        
            {
                "operation.oid": 1,
                "operation.name": "测试",
                "operation.operation": "test",
                "operation.system": 1,
                "operation.type": 1,
                "operation.module.mid": 1
            }

    ### <C> updateRoleOperation

        根据角色编号更新角色的操作信息
        
        判断角色是否存在 , 不存在 , 错误信息 **230010 角色不存在**
        
                |Requests:|
                :param operation.system: 系统
        :type operation.system: String
        :param role.rid: 角色ID
        :type role.rid: Long
        :param operation.oid: 操作ID
        :type operation.oid: Long
        
        Example::
        
            {
                "oids[0]": 1
                "operation.system": 1,
                "role.rid": "R001",
            }
            
    ### <C> updateRoleOperationByRid

        根据角色编号更新角色的操作信息
        
        判断角色是否存在 , 不存在 , 错误信息 **230010 角色不存在**
        
                |Requests:|
                :param oids[n]: 操作编号列表 , 每条数据类型 Integer
        :type oids[n]: List
        :param operation.system: 系统
        :type operation.system: String
        :param role.rid: 角色编号
        :type role.rid: String
        
        Example::
        
            {
                "oids[0]": 1
                "operation.system": 1,
                "role.rid": "R001",
            }
            
    ### <C> updateRoleOperationByUserId

        根据员工编号更新员工所属角色的操作信息
        
        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**
        
                |Requests:|
                :param oids[n]: 操作编号列表 , 每条数据类型 Integer
        :type oids[n]: List
        :param operation.system: 系统
        :type operation.system: String
        :param user.userId: 用户编号
        :type user.userId: String
        
        Example::
        
            {
                "oids[0]": 1
                "operation.system": 1,
                "user.userId": "U001",
            }
            
    ### <C> deleteOperation

        删除操作信息
        
        判断操作是否被角色引用 , 已引用 , 错误信息 **操作已引用,不能删除**
    
                |Requests:|
                :param operation.oid: 操作ID
        :type operation.oid: Integer
        
        Example::
        
            {
                "operation.oid": 1
            }

    ### <C> deleteRoleOperation

        删除角色对应操作信息
    
                |Requests:|
                :param role.rid: 角色ID
        :type role.rid: Integer
        :param operation.oid: 操作ID
        :type operation.oid: Integer
        
        Example::
        
            {
                "role.rid": 1,
                "operation.oid": 1
            }
        
## 配置

系统配置管理

## api.system.SystemConfigAction

        |DataType:|
        #### systemConfig

    - **scid**: 配置ID
      - 类型: *Long*
    - **key**: 键
      - 类型: *String*
    - **value**: 值
      - 类型: *String*
    - **creater**: 创建人 , 类型 [user](./user.html#api.personel.UserAction.user)
      - 类型: *Object*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **comment**: 备注
      - 类型: *String*
    - **company**: 公司
      - 类型: *Integer*
    
    ### <I> pageSystemConfig

        分页方式获取系统配置 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 系统配置列表 , 每条数据类型 *systemConfig*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "scid": 1,
                            "key": "key",
                            "value": "value",
                            "creater": {
                                "uid": 1,
                                "userId": "U001",
                                "userName": "白雪",
                                "currentName": "白雪",
                                "duty": "设计师"
                            },
                            "createTime": "2016-01-01 00:00:00",
                            "comment": "说明"
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <I> querySystemConfigByCid

        通过公司ID获取归属系统配置信息
        
                |Requests:|
                :param systemConfig.company: 公司Id
        :type systemConfig.company: Integer
        
        Example::
        
            {
                "systemConfig.company": 1
            }
            
                |Returns:|
                - **systemConfigs**: 系统配置列表 , 每条数据类型 *systemConfig*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "systemConfigs": [
                    {
                        "scid": 1,
                        "key": "key",
                        "value": "value",
                        "comment": "说明"
                    }
                ],
                ...
            }

    ### <I> querySystemConfigByKey

    ### <C> addSystemConfig

        添加系统配置
        
        判断系统配置键是否存在 , 已存在 , 错误信息 **130012 系统配置已存在**
        
                |Requests:|
                :param systemConfig.key: 键
        :type systemConfig.key: String
        :param systemConfig.value: 值
        :type systemConfig.value: String
        
        Example::
        
            {
                "systemConfig.key": "key",
                "systemConfig.value": "value"
            }
            
    ### <C> updateSystemConfig

        更新系统配置
        
        判断系统配置是否存在 , 不存在 , 错误信息 **130013 系统配置不存在**
        
                |Requests:|
                :param systemConfig.scid: 键
        :type systemConfig.scid: String
        :param systemConfig.value: 值
        :type systemConfig.value: String
        :param systemConfig.company: 公司
        :type systemConfig.company: Integer
        
        Example::
        
            {
                "systemConfig.scid": 1,
                "systemConfig.value": "value",
                "systemConfig.company": 1
            }
            
## 版本

系统版本信息管理

## api.system.VersionAction

        |DataType:|
        #### version

    - **vid**: 版本ID
      - 类型: *Long*
    - **no**: 版本号
      - 类型: *String*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **comment**: 说明
      - 类型: *String*
    - **status**: 状态 , 0: 启用 , 1: 禁用
      - 类型: *Short*
    
    ### <I> pageVersion

        分页方式获版本配置 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 版本信息列表 , 每条数据类型 *version*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "vid": 1,
                            "no": "1.0.1",
                            "createTime": "2016-01-01 00:00:00",
                            "comment": "说明"
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <I> queryVersion

        获取所有版本信息
        
                |Returns:|
                - **versions**: 版本信息列表 , 每条数据类型 *version*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "versions": [
                    {
                        "vid": 1,
                        "no": "1.0.1",
                        "createTime": "2016-01-01 00:00:00",
                        "comment": "说明"
                    }
                ],
                ...
            }
            
    ### <C> addVersion

        添加版本
        
        判断版本编号是否存在 , 已存在 , 错误信息 **230022 版本已存在**
        
                |Requests:|
                :param version.no: 编号
        :type version.no: String
        :param version.comment: 说明
        :type version.comment: String
        
        Example::
        
            {
                "version.no": "1.0.1",
                "version.comment": "说明"
            }
            
    ### <C> updateVersion

        更新版本
        
        判断版本是否存在 , 不存在 , 错误信息 **230021 版本不存在**
        
        判断版本编号是否存在 , 已存在 , 错误信息 **230022 版本已存在**
        
                |Requests:|
                :param version.vid: 版本Id
        :type version.vid: Long
        :param version.comment: 说明
        :type version.comment: Strin
        
        Example::
        
            {
                "version.vid": 1,
                "version.comment": "说明"
            }
            
    ### <C> updateVersionForStatus

        更新版本状态
        
        判断版本是否存在 , 不存在 , 错误信息 **230021 版本不存在**
        
                |Requests:|
                :param version.vid: 版本Id
        :type version.vid: Long
        :param version.status: 状态
        :type version.status: Short
        
        Example::
        
            {
                "version.vid": 1,
                "version.status": 1
            }
            
    ### <C> deleteVersion

        删除版本信息
        
                |Requests:|
                :param version.vid: 版本Id
        :type version.vid: Long
        
        Example::
        
            {
                "version.vid": 1
            }
            
## 升级

系统升级处理

## api.system.UpgradeAction

        |DataType:|
        #### upgrade

    - **ugid**: ID
      - 类型: *Long*
    - **no**: 版本号
      - 类型: *String*
    - **trialno**: 适用版本号
      - 类型: *String*
    - **createTime**: 创建时间
      - 类型: *Timestamp*
    - **content**: 说明
      - 类型: *String*
    - **path**: 文件路径
      - 类型: *String*
    - **fileSize**: 文件大小
      - 类型: *Integer*
    - **status**: 状态 , 0: 初始 , 1: 上线 , 2: 下线
      - 类型: *Short*
    
    ### <I> pageUpgrade

        分页方式获升级包配置 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter)
        
                |Returns:|
                - **paging**: 分页信息
          - 类型: *Object*
        :param paging.data: 升级包信息列表 , 每条数据类型 *upgrade*
        :type paging.data: List
        
        Example::
        
            {
                ...
                "paging": {
                    ...
                    "data": [
                        {
                            "ugid": 1,
                            "no": "1.0.2",
                            "trialno": "1.0.1",
                            "createTime": "2016-01-01 00:00:00",
                            "content": "说明",
                            "path": "JOISDNFDIFNNDSIDF.zip",
                            "fileSize": 1493
                        }
                    ],
                    ...
                },
                ...
            }
            
    ### <I> queryUpgrade

        获取所有升级包信息
        
                |Returns:|
                - **upgrades**: 升级包列表 , 每条数据类型 *upgrade*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "upgrades": [
                    {
                        "ugid": 1,
                        "no": "1.0.2",
                        "trialno": "1.0.1",
                        "createTime": "2016-01-01 00:00:00",
                        "content": "说明",
                        "path": "JOISDNFDIFNNDSIDF.zip",
                        "fileSize": 1493
                    }
                ],
                ...
            }
            
    ### <C> matchUpgrade

        添加系统配置
        
                |Requests:|
                :param upgrade.trialno: 适用版本
        :type upgrade.trialno: String
        
        Example::
        
            {
                "version.trialno": "1.0.1"
            }
            
                |Returns:|
                - **upgrades**: 升级包列表 , 每条数据类型 *upgrade*
          - 类型: *List*
        
        Example::
        
            {
                ...
                "upgrades": [
                    {
                        "ugid": 1,
                        "no": "1.0.2",
                        "trialno": "1.0.1",
                        "createTime": "2016-01-01 00:00:00",
                        "content": "说明",
                        "path": "JOISDNFDIFNNDSIDF.zip",
                        "fileSize": 1918
                    }
                ],
                ...
            }
            
    ### <C> addUpgrade

        添加升级包
        
        判断版本编号是否存在 , 已存在 , 错误信息 **230022 版本已存在**
        
                |Requests:|
                :param upgrade.no: 版本号
        :type upgrade.no: String
        :param upgrade.trialno: 适用版本号
        :type upgrade.trialno: String
        :param upgrade.content: 说明
        :type upgrade.content: String
        :param upgrade.path: 文件路径
        :type upgrade.path: String
        :param upgrade.fileSize: 文件大小
        :type upgrade.fileSize: Integer
        
        Example::
        
            {
                "upgrade.no": "1.0.2",
                "upgrade.trialno": "1.0.1",
                "upgrade.content": "说明"
                "upgrade.path": "JOISDNFDIFNNDSIDF.zip",
                "upgrade.fileSize": 1918
            }

    ### <I> updateUpgradeForStatus

        更新升级包状态
        
        判断版本编号是否存在 , 已存在 , 错误信息 **230022 版本已存在**
        
                |Requests:|
                :param upgrade.ugid: 版本ID
        :type upgrade.ugid: Long
        
                |Requests:|
                :param upgrade.ugid: ID
        :type upgrade.ugid: Long
        
        Example::
        
            {
                "upgrade.ugid": 1
            }
            
    ### <I> deleteUpgrade

        删除升级包
        
                |Requests:|
                :param upgrade.ugid: ID
        :type upgrade.ugid: Long
        
        Example::
        
            {
                "upgrade.ugid": 1
            }
