# system 系统
## 公司

公司信息管理

## api.system.CompanyAction

**数据类型**:

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

    ### `pageCompany` <span style="color:gray">[内部]</span>

        分页方式获取公司信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

        公司主键Cid需要加密处理 , 加密失败 , 错误信息 **230017 公司获取失败**

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  公司信息列表 , 每条数据类型 *company*

        **示例**:{
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

    ### `queryCompany` <span style="color:gray">[内部]</span>

        获取全部公司信息

        公司主键Cid需要加密处理 , 加密失败 , 错误信息 **230017 公司获取失败**

**请求参数**:

- **company.atttype**:
  业务类型

        **示例**:{
                "company.atttype": 1
            }

**返回参数**:

- **companys**: 公司信息列表 , 每条数据类型 *company*
          - 类型: *List*

        **示例**:{
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

    ### `queryCompanyByCid` <span style="color:gray">[内部]</span>

        通过公司ID获取全部公司信息

        首先利用解密处理公司Cid , 获取结果后 , 加密公司主键Cid

        公司主键Cid解密加密处理 , 处理失败 , 错误信息 **230017 公司获取失败**

**请求参数**:

- **company.cid**:
  ID

        **示例**:{
                "company.cid": 1
            }

**返回参数**:

- **company**: 公司信息 , 类型 *company*
          - 类型: *Object*

        **示例**:{
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

    ### `createCompany` <span style="color:blue">[自定义]</span>

        创建公司


    ### `addCompany` <span style="color:blue">[自定义]</span>

        添加公司信息

        公司编号已存在 , 错误信息 **130013 公司编号已存在**

        公司名称已存在 , 错误信息 **130014 公司名称已存在**

**请求参数**:

- **company.no**:
  编号
        - **company.name**:
  名称
        - **company.fullname**:
  全名
        - **company.address**:
  地址
        - **company.corporation**:
  法人
        - **company.phone**:
  电话
        - **company.drganization.oid**:
  组织ID
        - **company.srganization.oid**:
  组织ID
        - **company.atttype**:
  业务类型

        **示例**:{
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

    ### `updateCompany` <span style="color:blue">[自定义]</span>

        更新公司信息

        公司主键Cid需要加密处理 , 加密失败 , 错误信息 **230017 公司获取失败**

        判断公司是否存在 , 不存在 , 错误信息 **230015 公司不存在**

**请求参数**:

- **company.cid**:
  ID
        - **company.name**:
  名称
        - **company.fullname**:
  全名
        - **company.address**:
  地址
        - **company.corporation**:
  法人
        - **company.phone**:
  电话
        - **company.drganization.oid**:
  组织ID
        - **company.srganization.oid**:
  组织ID
        - **company.atttype**:
  业务类型

        **示例**:{
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


    ### `updateCompanyForStatus` <span style="color:blue">[自定义]</span>

        更新公司状态

        公司主键Cid需要加密处理 , 加密失败 , 错误信息 **230017 公司获取失败**

        判断公司是否存在 , 不存在 , 错误信息 **230015 公司不存在**

**请求参数**:

- **company.cid**:
  ID
        - **company.status**:
  状态

        **示例**:{
                "company.cid": 1,
                "company.status": 0
            }

## 组织

## api.system.OrganizationAction

**数据类型**:

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

    ### `pageOrganization` <span style="color:gray">[内部]</span>

        分页方式获取组织信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  组织信息列表 , 每条数据类型 *organization*

        **示例**:{
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

    ### `queryOrganization` <span style="color:gray">[内部]</span>

        查询组织

**返回参数**:

- **organizations**: 组织信息列表 , 每条数据类型 *organization*
          - 类型: *List*

        **示例**:{
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

    ### `addOrganization` <span style="color:gray">[内部]</span>

        添加组织

**请求参数**:

- **organization.no**:
  编号
        - **organization.name**:
  名称

        **示例**:{
                "organization.no": "JUYDO2NB4GK2N",
                "organization.name": "组织",
            }

    ### `updateOrganization` <span style="color:gray">[内部]</span>

        更新组织信息

        判断组织是否存在 , 不存在 , 错误信息 **230026 组织不存在**

**请求参数**:

- **organization.oid**:
  组织ID
        - **organization.name**:
  名称

        **示例**:{
                "organization.oid": 1,
                "organization.name": "组织",
            }

    ### `updateOrganizationForStatus` <span style="color:gray">[内部]</span>

        更新组织状态

        判断组织是否存在 , 不存在 , 错误信息 **230026 组织不存在**

**请求参数**:

- **organization.oid**:
  组织ID
        - **organization.status**:
  状态

        **示例**:{
                "organization.oid": 1,
                "organization.status": 1,
            }

## 大区

大区信息管理

## api.system.RegionAction

**数据类型**:

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

    ### `pageRegion` <span style="color:gray">[内部]</span>

        分页方式获取大区信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  大区信息列表 , 每条数据类型 *region*

        **示例**:{
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

    ### `queryRegion` <span style="color:gray">[内部]</span>

        获取全部大区信息

**返回参数**:

- **regions**: 大区信息列表 , 每条数据类型 *region*
          - 类型: *List*

        **示例**:{
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

    ### `queryRegionByRid` <span style="color:gray">[内部]</span>

        通过大区ID获取大区信息

**请求参数**:

- **region.rid**:
  大区编号

        **示例**:{
                "region.rid": 1
            }

**返回参数**:

- **region**: 大区信息 , 类型 *region*
          - 类型: *Object*

        **示例**:{
                ...
                "region":{
                    "rid": 1,
                    "no": "R001",
                    "name": "东北区"
                },
                ...
            }

    ### `queryRegionByName` <span style="color:gray">[内部]</span>

        通过大区名称获取大区信息 , 大区名称可以使用名称拼音进行查询

**请求参数**:

- **region.name**:
  大区名称 , 大区名称拼音

        **示例**:{
                "region.name": "dongbei"
            }

**返回参数**:

- **regions**: 大区信息列表 , 每条数据类型 *region*
          - 类型: *List*

        **示例**:{
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

    ### `addRegion` <span style="color:blue">[自定义]</span>

        添加大区信息

**请求参数**:

- **region.name**:
  大区名称

        **示例**:{
                "region.name": "华中区"
            }

    ### `updateRegion` <span style="color:blue">[自定义]</span>

        更新大区信息

        判断大区是否存在 , 不存在 , 错误信息 **230020 大区不存在**

**请求参数**:

- **region.rid**:
  大区ID
        - **region.name**:
  大区名称

        **示例**:{
                "region.rid": 1,
                "region.name": "华中区"
            }

    ### `deleteRegion` <span style="color:blue">[自定义]</span>

        删除大区信息

**请求参数**:

- **rids[n]**:
  大区编号列表, 每条数据类型 Integer

        **示例**:{
                "rids[0]": 1,
                "rids[1]": 1
            }

## 城市

城市信息管理

## api.system.CityAction

**数据类型**:

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

    ### `pageCity` <span style="color:gray">[内部]</span>

        分页方式获取城市信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  城市信息列表 , 每条数据类型 *city*

        **示例**:{
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

    ### `queryCity` <span style="color:gray">[内部]</span>

        获取全部城市信息

**返回参数**:

- **citys**: 城市信息列表 , 每条数据类型 *city*
          - 类型: *List*

        **示例**:{
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

    ### `queryCityByCid` <span style="color:gray">[内部]</span>

        通过城市ID获取城市信息

        判断城市是否存在 , 不存在 , 错误信息 **230019 城市不存在**

**请求参数**:

- **city.cid**:
  城市ID

        **示例**:{
                "city.cid": 1
            }

**返回参数**:

- **city**: 城市信息 , 类型 *city*
          - 类型: *Object*

        **示例**:{
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

    ### `queryCityByRid` <span style="color:gray">[内部]</span>

        通过大区ID获取城市信息

**请求参数**:

- **city.region.rid**:
  大区ID

        **示例**:{
                "city.region.rid": 1
            }

**返回参数**:

- **citys**: 城市信息列表 , 每条数据类型 *city*
          - 类型: *List*

        **示例**:{
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

    ### `queryCityByName` <span style="color:gray">[内部]</span>

        通过城市名称获取城市信息 , 城市名称可以为名称拼音进行查询

**请求参数**:

- **city.name**:
  城市名称 , 城市名称拼音

        **示例**:{
                "city.name": "shenyang"
            }

**返回参数**:

- **citys**: 城市信息列表 , 每条数据类型 *city*
          - 类型: *List*

        **示例**:{
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

    ### `addCity` <span style="color:blue">[自定义]</span>

        添加城市信息

**请求参数**:

- **city.name**:
  城市名称
        - **city.province**:
  省份
        - **city.region.rid**:
  大区编号
        - **city.x**:
  经度
        - **city.y**:纬度
        :tyoe city.y: Integer

        **示例**:{
                "city.name": "本溪",
                "city.province": "辽宁",
                "city.region.rid": 1,
                "city.x": 0,
                "city.y": 0
            }

    ### `updateCity` <span style="color:blue">[自定义]</span>

        更新城市信息

        判断城市是否存在 , 不存在 , 错误信息 **230019 城市不存在**

**请求参数**:

- **city.cid**:
  城市ID
        - **city.name**:
  城市名称
        - **city.province**:
  省份
        - **city.region.rid**:大区ID
        - **city.region.rid**:Integer
        - **city.x**:
  经度
        - **city.y**:纬度
        :tyoe city.y: Integer

        **示例**:{
                "city.cid": 1,
                "city.name": "沈阳",
                "city.province": "辽宁",
                "city.region.rid": 1
            }

    ### `updateCityForPosition` <span style="color:gray">[内部]</span>

        更新城市位置

        判断城市是否存在 , 不存在 , 错误信息 **230019 城市不存在**

**请求参数**:

- **city.cid**:
  城市ID
        - **city.y**:
  纬度

        **示例**:{
                "city.cid": 1,
                "city.x": 0,
                "city.y": 0
            }

    ### `deleteCity` <span style="color:blue">[自定义]</span>

        通过城市ID删除城市

        判断城市是否已经被城区引用 , 已引用 , 错误信息 **230006 城市已被引用,不能删除**

**请求参数**:

- **city.cid**:
  城市ID

        **示例**:{
                "city.cid": 1,
                "city.name": "沈阳",
                "city.region.rid": 1
            }

## 城区

城区信息管理

## api.system.CityProperAction

**数据类型**:

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

    ### `pageCityProper` <span style="color:gray">[内部]</span>

        分页方式获取城区信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  城区信息列表 , 每条数据类型 *cityProper*

        **示例**:{
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

    ### `queryCityProper` <span style="color:gray">[内部]</span>

        获取全部城区信息

**返回参数**:

- **cityPropers**: 城区信息列表 , 每条数据类型 *cityProper*
          - 类型: *List*

        **示例**:{
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

    ### `queryCityProperByCpid` <span style="color:gray">[内部]</span>

        通过城区ID获取城区信息

        判断城区是否存在 , 不存在 , 错误信息 **230018 城区不存在**

**请求参数**:

- **cityProper.cpid**:
  城区Id

        **示例**:{
                "cityProper.cpid": 1
            }

**返回参数**:

- **cityProper**: 城区信息 , 类型 *cityProper*
          - 类型: *Object*

        **示例**:{
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

    ### `queryCityProperByCid` <span style="color:gray">[内部]</span>

        通过城市ID获取城区信息

**请求参数**:

- **cityProper.city.cid**:
  城市ID

        **示例**:{
                "cityProper.city.cid": 1
            }

**返回参数**:

- **cityPropers**: 城区信息列表 , 每条数据类型 *cityProper*
          - 类型: *List*

        **示例**:{
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

    ### `queryCityProperByName` <span style="color:gray">[内部]</span>

        通过城区名称查询城区信息 , 城区名称可以使用名称拼音进行查询

**请求参数**:

- **cityProper.name**:
  城区名称 , 城区名称拼音

        **示例**:{
                "cityProper.name": "tiexi"
            }

**返回参数**:

- **cityPropers**: 城区信息列表 , 每条数据类型 *cityProper*
          - 类型: *List*

        **示例**:{
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

    ### `addCityProper` <span style="color:blue">[自定义]</span>

        添加城区信息

**请求参数**:

- **cityProper.name**:
  城区名称
        - **cityProper.city.cid**:
  城市编号

        **示例**:{
                "cityProper.name": "沈河",
                "cityProper.city.cid": 1
            }

    ### `updateCityProper` <span style="color:blue">[自定义]</span>

        更新城区信息

        判断城区是否存在 , 不存在 , 错误信息 **230018 城区不存在**

**请求参数**:

- **cityProper.cpid**:
  城区ID
        - **cityProper.name**:
  城区名称
        - **cityProper.city.cid**:
  城市编号

        **示例**:{
                "cityProper.cpid": 1,
                "cityProper.name": "铁西",
                "cityProper.city.cid": 1
            }

    ### `updateCityProperForPosition` <span style="color:blue">[自定义]</span>

        更新城区位置

        判断城区是否存在 , 不存在 , 错误信息 **230018 城区不存在**

**请求参数**:

- **cityProper.cpid**:
  城区ID
        - **cityProper.x**:
  经度
        - **cityProper.y**:
  纬度

        **示例**:{
                "cityProper.cpid": 1,
                "cityProper.x": "铁西",
                "cityProper.y": 1
            }

    ### `deleteCityProper` <span style="color:blue">[自定义]</span>

        删除城区信息

        判断城区是否被楼盘引用 , 已引用 , 错误信息 **230003 , 城区已引用,不能删除**

        判断城区是否被部门引用 , 已引用 , 错误信息 **230003 , 城区已引用,不能删除**

**请求参数**:

- **cpid**: 城区编号
          - 类型: *Integer*

        **示例**:{
                "cpid": 1
            }

## 角色

角色信息管理

## api.system.RoleAction

**数据类型**:

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

    ### `pageRole` <span style="color:gray">[内部]</span>

        分页方式获取角色信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  角色信息列表 , 每条数据类型 *role*

        **示例**:{
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

    ### `queryRole` <span style="color:gray">[内部]</span>

        获取全部角色信息

**返回参数**:

- **roleList**: 角色信息列表 , 每条数据类型 *role*
          - 类型: *List*

        **示例**:{
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

    ### `queryRoleByRid` <span style="color:gray">[内部]</span>

        通过角色ID获取角色信息

**请求参数**:

- **role.rid**:
  角色ID

        **示例**:{
                "role.rid": 1
            }

**返回参数**:

- **role**: 角色信息 , 类型 *role*
          - 类型: *Object*

        **示例**:{
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

    ### `queryRoleByName` <span style="color:gray">[内部]</span>

        通过角色名称或者拼音获取角色信息

**请求参数**:

- **role.name**:
  角色名称

        **示例**:{
                "role.name": "设计师"
            }

**返回参数**:

- **role**: 角色信息 , 类型 *role*
          - 类型: *Object*

        **示例**:{
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

    ### `addRole` <span style="color:blue">[自定义]</span>

        添加角色信息

        判断角色名称是否存在 , 已存在 , 错误信息 **230005 角色名称已经存在**

**请求参数**:

- **role.name**:
  角色名称
        - **role.content**:
  角色描述

        **示例**:{
                "role.name": "设计师",
                "role.content": "设计师"
            }

    ### `updateRole` <span style="color:blue">[自定义]</span>

        更新角色信息

        判断角色是否存在 , 不存在 , 错误信息 **230010 角色不存在**

**请求参数**:

- **role.rid**:
  角色编号
        - **role.name**:
  角色名称
        - **role.content**:
  角色描述

        **示例**:{
                "role.rid": "R001",
                "role.name": "设计师",
                "role.content": "设计师"
            }

    ### `deleteRoleByRid` <span style="color:blue">[自定义]</span>

        删除角色信息

        判断角色是否被人员引用 , 已引用 , 错误信息 **230006 角色已引用, 不能删除**

**请求参数**:

- **role.rid**:
  角色Id

        **示例**:{
                "rid": 1
            }

## 模块

模块信息管理 , 控制菜单内容

## api.system.ModuleAction

**数据类型**:

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

    ### `pageModule` <span style="color:gray">[内部]</span>

        分页方式获取模块信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  模块信息列表 , 每条数据类型 *module*

        **示例**:{
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

    ### `queryModule` <span style="color:gray">[内部]</span>

        获取所有模块信息

**返回参数**:

- **modules**: 模块信息列表 , 每条数据类型 *module*
          - 类型: *List*

        **示例**:{
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

    ### `queryModuleForLogin` <span style="color:gray">[内部]</span>

        获取当前用户所属角色拥有的模块信息

**返回参数**:

- **modules**: 模块信息列表 , 每条数据类型 *module*
          - 类型: *List*

        **示例**:{
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

    ### `queryModuleForLink` <span style="color:gray">[内部]</span>

        获取当前用户所属角色拥有的链接模块信息

**返回参数**:

- **modules**: 模块信息列表 , 每条数据类型 *module*
          - 类型: *List*

        **示例**:{
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

    ### `queryModuleByUserId` <span style="color:gray">[内部]</span>

        通过员工编号获取用户所属角色拥有模块信息

        判断员工是否存在 , 不存在 , 错误信息 **190005 员工不存在**

**请求参数**:

- **user.userId**:
  用户编号

        **示例**:{
                "user.userId": "U001"
            }

**返回参数**:

- **modules**: 模块信息列表 , 每条数据类型 *module*
          - 类型: *List*

        **示例**:{
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

    ### `queryModuleByRid` <span style="color:gray">[内部]</span>

        通过角色编号获取拥有模块信息

**请求参数**:

- **role.rid**:
  角色ID

        **示例**:{
                "role.rid": 1
            }

**返回参数**:

- **modules**: 模块信息列表 , 每条数据类型 *module*
          - 类型: *List*

        **示例**:{
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

    ### `checkModule` <span style="color:blue">[自定义]</span>

        检查模块权限

        判断模块是否存在 , 不存在 , 错误信息 **230011 模块不存在**

**请求参数**:

- **module.mid**:
  模块ID

        **示例**:{
                "module.mid": 1
            }

    ### `addModule` <span style="color:blue">[自定义]</span>

        添加模块信息

        判断父模块是否存在 , 不存在 , 错误信息 **230011 模块不存在**

**请求参数**:

- **module.name**:
  名称
        - **module.icon**:
  图标
        - **module.url**:
  地址
        - **module.level**:
  层级
        - **module.fatherModule.mid**:
  父模块ID

        **示例**:{
                "module.name": 系统,
                "module.icon": "icon-dashboard",
                "module.url": "/views/system/city.html",
                "module.system": 1,
                "module.fatherModule.mid": 1,
            }

    ### `updateRoleModuleByRid` <span style="color:blue">[自定义]</span>

        通过角色编号更新角色拥有的模块信息

        判断角色是否存在 , 不存在 , 错误信息 **230010 角色不存在**

        判断更新角色与操作人员对应角色等级 , 如果后者小于前者 , 错误信息 **-1 误操作权限**

**请求参数**:

- **mids[n]**:
  模块编号列表 , 每条数据类型 Integer
        - **role.rid**:
  角色编号

        **示例**:{
                "role.rid": 1,
                "mids[0]": 1,
            }

    ### `deleteModule` <span style="color:blue">[自定义]</span>

        删除模块信息

        判断模块是否已被角色引用 , 已引用 , 错误信息 **230012 模块已引用,不能删除**

**请求参数**:

- **module.mid**:
  模块ID

        **示例**:{
                "module.mid": 1
            }

## 操作

操作信息管理 , 控制系统操作权限

## api.system.OperationAction

**数据类型**:

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

    ### `pageOperation` <span style="color:gray">[内部]</span>

        分页方式获取操作信息 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  操作信息列表 , 每条数据类型 *operation*

        **示例**:{
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

    ### `queryOperation` <span style="color:gray">[内部]</span>

        获取所有操作信息

**请求参数**:

- **operation.system**:
  系统

        **示例**:{
                "operation.system": 1
            }

**返回参数**:

- **operations**: 操作信息列表 , 每条数据类型 *operation*
          - 类型: *List*

        **示例**:{
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

    ### `queryOperationForLogin` <span style="color:gray">[内部]</span>

        通过操作名称查询操作信息

**请求参数**:

- **operation.system**:
  系统

        **示例**:{
                "operation.system": 1
            }

**返回参数**:

- **operations**: 操作信息列表 , 每条数据类型 *operation*
          - 类型: *List*

        **示例**:{
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

    ### `queryOperationForSelf` <span style="color:gray">[内部]</span>

        查询当前操作用户拥有的操作信息

**请求参数**:

- **operation.system**:
  系统

        **示例**:{
                "operation.system": 1
            }

**返回参数**:

- **operations**: 操作信息列表 , 每条数据类型 *operation*
          - 类型: *List*

        **示例**:{
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

    ### `queryOperationByUserId` <span style="color:gray">[内部]</span>

        通过用户编号获取操作信息

        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

**请求参数**:

- **operation.system**:
  系统标识
        - **user.userId**:
  用户编号

        **示例**:{
                "operation.system": 1,
                "user.userId": "U001"
            }

**返回参数**:

- **operations**: 操作信息列表 , 每条数据类型 *operation*
          - 类型: *List*

        **示例**:{
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

    ### `queryOperationByRid` <span style="color:gray">[内部]</span>

        通过角色编号获取操作信息

        判断角色是否存在 , 不存在 , 错误信息 **230010 角色不存在**

**请求参数**:

- **operation.system**:
  系统标识
        - **role.rid**:
  角色编号

        **示例**:{
                "operation.system": 1,
                "role.rid": 1
            }

**返回参数**:

- **operations**: 操作信息列表 , 每条数据类型 *operation*
          - 类型: *List*

        **示例**:{
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

    ### `addOperation` <span style="color:blue">[自定义]</span>

        添加操作信息 , 相同操作的操作不能添加

**请求参数**:

- **operation.name**:
  操作名
        - **operation.operation**:
  操作
        - **operation.system**:
  系统
        - **operation.type**:
  类型
        - **operation.module.mid**:
  所属模块ID

        **示例**:{
                "operation.name": "测试",
                "operation.operation": "test",
                "operation.system": 1,
                "operation.type": 1,
                "operation.module.mid": 1
            }

    ### `updateOpperation` <span style="color:blue">[自定义]</span>

        更新

**请求参数**:

- **operation.oid**:
  操作ID
        - **operation.name**:
  操作名
        - **operation.operation**:
  操作
        - **operation.system**:
  系统
        - **operation.type**:
  类型
        - **operation.module.mid**:
  所属模块ID

        **示例**:{
                "operation.oid": 1,
                "operation.name": "测试",
                "operation.operation": "test",
                "operation.system": 1,
                "operation.type": 1,
                "operation.module.mid": 1
            }

    ### `updateRoleOperation` <span style="color:blue">[自定义]</span>

        根据角色编号更新角色的操作信息

        判断角色是否存在 , 不存在 , 错误信息 **230010 角色不存在**

**请求参数**:

- **operation.system**:
  系统
        - **role.rid**:
  角色ID
        - **operation.oid**:
  操作ID

        **示例**:{
                "oids[0]": 1
                "operation.system": 1,
                "role.rid": "R001",
            }

    ### `updateRoleOperationByRid` <span style="color:blue">[自定义]</span>

        根据角色编号更新角色的操作信息

        判断角色是否存在 , 不存在 , 错误信息 **230010 角色不存在**

**请求参数**:

- **oids[n]**:
  操作编号列表 , 每条数据类型 Integer
        - **operation.system**:
  系统
        - **role.rid**:
  角色编号

        **示例**:{
                "oids[0]": 1
                "operation.system": 1,
                "role.rid": "R001",
            }

    ### `updateRoleOperationByUserId` <span style="color:blue">[自定义]</span>

        根据员工编号更新员工所属角色的操作信息

        判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

**请求参数**:

- **oids[n]**:
  操作编号列表 , 每条数据类型 Integer
        - **operation.system**:
  系统
        - **user.userId**:
  用户编号

        **示例**:{
                "oids[0]": 1
                "operation.system": 1,
                "user.userId": "U001",
            }

    ### `deleteOperation` <span style="color:blue">[自定义]</span>

        删除操作信息

        判断操作是否被角色引用 , 已引用 , 错误信息 **操作已引用,不能删除**

**请求参数**:

- **operation.oid**:
  操作ID

        **示例**:{
                "operation.oid": 1
            }

    ### `deleteRoleOperation` <span style="color:blue">[自定义]</span>

        删除角色对应操作信息

**请求参数**:

- **role.rid**:
  角色ID
        - **operation.oid**:
  操作ID

        **示例**:{
                "role.rid": 1,
                "operation.oid": 1
            }

## 配置

系统配置管理

## api.system.SystemConfigAction

**数据类型**:

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

    ### `pageSystemConfig` <span style="color:gray">[内部]</span>

        分页方式获取系统配置 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  系统配置列表 , 每条数据类型 *systemConfig*

        **示例**:{
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

    ### `querySystemConfigByCid` <span style="color:gray">[内部]</span>

        通过公司ID获取归属系统配置信息

**请求参数**:

- **systemConfig.company**:
  公司Id

        **示例**:{
                "systemConfig.company": 1
            }

**返回参数**:

- **systemConfigs**: 系统配置列表 , 每条数据类型 *systemConfig*
          - 类型: *List*

        **示例**:{
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

    ### `querySystemConfigByKey` <span style="color:gray">[内部]</span>

    ### `addSystemConfig` <span style="color:blue">[自定义]</span>

        添加系统配置

        判断系统配置键是否存在 , 已存在 , 错误信息 **130012 系统配置已存在**

**请求参数**:

- **systemConfig.key**:
  键
        - **systemConfig.value**:
  值

        **示例**:{
                "systemConfig.key": "key",
                "systemConfig.value": "value"
            }

    ### `updateSystemConfig` <span style="color:blue">[自定义]</span>

        更新系统配置

        判断系统配置是否存在 , 不存在 , 错误信息 **130013 系统配置不存在**

**请求参数**:

- **systemConfig.scid**:
  键
        - **systemConfig.value**:
  值
        - **systemConfig.company**:
  公司

        **示例**:{
                "systemConfig.scid": 1,
                "systemConfig.value": "value",
                "systemConfig.company": 1
            }

## 版本

系统版本信息管理

## api.system.VersionAction

**数据类型**:

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

    ### `pageVersion` <span style="color:gray">[内部]</span>

        分页方式获版本配置 , 分页以及条件参数传递方式参照 `paging <../check_rule.html#page>`_ 以及 `filter <../check_rule.html#filter>`_

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  版本信息列表 , 每条数据类型 *version*

        **示例**:{
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

    ### `queryVersion` <span style="color:gray">[内部]</span>

        获取所有版本信息

**返回参数**:

- **versions**: 版本信息列表 , 每条数据类型 *version*
          - 类型: *List*

        **示例**:{
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

    ### `addVersion` <span style="color:blue">[自定义]</span>

        添加版本

        判断版本编号是否存在 , 已存在 , 错误信息 **230022 版本已存在**

**请求参数**:

- **version.no**:
  编号
        - **version.comment**:
  说明

        **示例**:{
                "version.no": "1.0.1",
                "version.comment": "说明"
            }

    ### `updateVersion` <span style="color:blue">[自定义]</span>

        更新版本

        判断版本是否存在 , 不存在 , 错误信息 **230021 版本不存在**

        判断版本编号是否存在 , 已存在 , 错误信息 **230022 版本已存在**

**请求参数**:

- **version.vid**:
  版本Id
        - **version.comment**:
  说明

        **示例**:{
                "version.vid": 1,
                "version.comment": "说明"
            }

    ### `updateVersionForStatus` <span style="color:blue">[自定义]</span>

        更新版本状态

        判断版本是否存在 , 不存在 , 错误信息 **230021 版本不存在**

**请求参数**:

- **version.vid**:
  版本Id
        - **version.status**:
  状态

        **示例**:{
                "version.vid": 1,
                "version.status": 1
            }

    ### `deleteVersion` <span style="color:blue">[自定义]</span>

        删除版本信息

**请求参数**:

- **version.vid**:
  版本Id

        **示例**:{
                "version.vid": 1
            }

## 升级

系统升级处理

## api.system.UpgradeAction

**数据类型**:

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

    ### `pageUpgrade` <span style="color:gray">[内部]</span>

        分页方式获升级包配置 , 分页以及条件参数传递方式参照 [paging](../check_rule.html#page) 以及 [filter](../check_rule.html#filter)

**返回参数**:

- **paging**: 分页信息
          - 类型: *Object*
        - **paging.data**:
  升级包信息列表 , 每条数据类型 *upgrade*

        **示例**:{
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

    ### `queryUpgrade` <span style="color:gray">[内部]</span>

        获取所有升级包信息

**返回参数**:

- **upgrades**: 升级包列表 , 每条数据类型 *upgrade*
          - 类型: *List*

        **示例**:{
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

    ### `matchUpgrade` <span style="color:blue">[自定义]</span>

        添加系统配置

**请求参数**:

- **upgrade.trialno**:
  适用版本

        **示例**:{
                "version.trialno": "1.0.1"
            }

**返回参数**:

- **upgrades**: 升级包列表 , 每条数据类型 *upgrade*
          - 类型: *List*

        **示例**:{
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

    ### `addUpgrade` <span style="color:blue">[自定义]</span>

        添加升级包

        判断版本编号是否存在 , 已存在 , 错误信息 **230022 版本已存在**

**请求参数**:

- **upgrade.no**:
  版本号
        - **upgrade.trialno**:
  适用版本号
        - **upgrade.content**:
  说明
        - **upgrade.path**:
  文件路径
        - **upgrade.fileSize**:
  文件大小

        **示例**:{
                "upgrade.no": "1.0.2",
                "upgrade.trialno": "1.0.1",
                "upgrade.content": "说明"
                "upgrade.path": "JOISDNFDIFNNDSIDF.zip",
                "upgrade.fileSize": 1918
            }

    ### `updateUpgradeForStatus` <span style="color:gray">[内部]</span>

        更新升级包状态

        判断版本编号是否存在 , 已存在 , 错误信息 **230022 版本已存在**

**请求参数**:

- **upgrade.ugid**:
  版本ID

**请求参数**:

- **upgrade.ugid**:
  ID

        **示例**:{
                "upgrade.ugid": 1
            }

    ### `deleteUpgrade` <span style="color:gray">[内部]</span>

        删除升级包

**请求参数**:

- **upgrade.ugid**:
  ID

        **示例**:{
                "upgrade.ugid": 1
            }
