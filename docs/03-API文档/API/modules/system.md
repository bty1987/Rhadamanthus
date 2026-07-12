# 系统


## 公司


公司信息管理


> **类**: `api.system.CompanyAction`


#### 数据类型: `company`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cid` | 公司ID | Long |
| `no` | 编号 | Short |
| `name` | 名称 | String |
| `fullname` | 全名 | String |
| `address` | 地址 | String |
| `corporation` | 法人 | String |
| `phone` | 电话 | String |
| `drganization` | 装修组织 , 类型 [organization ](./system.html#api.system.OrganizationAction.organization) | Object |
| `srganization` | 销售组织 , 类型 [organization ](./system.html#api.system.OrganizationAction.organization) | Object |
| `atttype` | 业务类型 , 包括: 0: 集团 , 1: 装修 , 2: 家居 , 3: 工程 , 4: 建材 , 5: 房产 , 6: 科技 , 7: 其他 | Short |
| `status` | 状态 , 0: 启用, 1: 禁用 | Short |


##### `查询` pageCompany

分页方式获取公司信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

公司主键Cid需要加密处理 , 加密失败 , 错误信息 **230017 公司获取失败**

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 公司信息列表 , 每条数据类型 `company`

```json
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
```


##### `查询` queryCompany

获取全部公司信息

公司主键Cid需要加密处理 , 加密失败 , 错误信息 **230017 公司获取失败**

**Requests:**

- `company.atttype` (Short): 业务类型

```json
{
    "company.atttype": 1
}
```

**Returns:**

- `companys` (List): 公司信息列表 , 每条数据类型 `company`

```json
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
```


##### `查询` queryCompanyByCid

通过公司ID获取全部公司信息

首先利用解密处理公司Cid , 获取结果后 , 加密公司主键Cid

公司主键Cid解密加密处理 , 处理失败 , 错误信息 **230017 公司获取失败**

**Requests:**

- `company.cid` (Long): ID

```json
{
    "company.cid": 1
}
```

**Returns:**

- `company` (Object): 公司信息 , 类型 `company`

```json
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
```


##### `创建` createCompany

创建公司


##### `创建` addCompany

添加公司信息

公司编号已存在 , 错误信息 **130013 公司编号已存在**

公司名称已存在 , 错误信息 **130014 公司名称已存在**

**Requests:**

- `company.no` (Short): 编号
- `company.name` (String): 名称
- `company.fullname` (String): 全名
- `company.address` (String): 地址
- `company.corporation` (String): 法人
- `company.phone` (String): 电话
- `company.drganization.oid` (Long): 组织ID
- `company.srganization.oid` (Long): 组织ID
- `company.atttype` (Short): 业务类型

```json
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
```


##### `创建` updateCompany

更新公司信息

公司主键Cid需要加密处理 , 加密失败 , 错误信息 **230017 公司获取失败**

判断公司是否存在 , 不存在 , 错误信息 **230015 公司不存在**

**Requests:**

- `company.cid` (Long): ID
- `company.name` (String): 名称
- `company.fullname` (String): 全名
- `company.address` (String): 地址
- `company.corporation` (String): 法人
- `company.phone` (String): 电话
- `company.drganization.oid` (Long): 组织ID
- `company.srganization.oid` (Long): 组织ID
- `company.atttype` (Short): 业务类型

```json
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
```


##### `创建` updateCompanyForStatus

更新公司状态

公司主键Cid需要加密处理 , 加密失败 , 错误信息 **230017 公司获取失败**

判断公司是否存在 , 不存在 , 错误信息 **230015 公司不存在**

**Requests:**

- `company.cid` (Long): ID
- `company.status` (Short): 状态

```json
{
    "company.cid": 1,
    "company.status": 0
}
```

## 组织


> **类**: `api.system.OrganizationAction`


#### 数据类型: `organization`

| 参数 | 说明 | 类型 |
|------|------|------|
| `oid` | 组织ID | Long |
| `no` | 编号 | Short |
| `name` | 名称 | String |
| `pinyin` | 拼音 | String |
| `status` | 状态 , 0: 启用, 1: 禁用 | Short |


##### `查询` pageOrganization

分页方式获取组织信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 组织信息列表 , 每条数据类型 `organization`

```json
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
```


##### `查询` queryOrganization

查询组织

**Returns:**

- `organizations` (List): 组织信息列表 , 每条数据类型 `organization`

```json
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
```


##### `查询` addOrganization

添加组织

**Requests:**

- `organization.no` (String): 编号
- `organization.name` (Short): 名称

```json
{
    "organization.no": "JUYDO2NB4GK2N",
    "organization.name": "组织",
}
```


##### `查询` updateOrganization

更新组织信息

判断组织是否存在 , 不存在 , 错误信息 **230026 组织不存在**

**Requests:**

- `organization.oid` (Long): 组织ID
- `organization.name` (Short): 名称

```json
{
    "organization.oid": 1,
    "organization.name": "组织",
}
```


##### `查询` updateOrganizationForStatus

更新组织状态

判断组织是否存在 , 不存在 , 错误信息 **230026 组织不存在**

**Requests:**

- `organization.oid` (Long): 组织ID
- `organization.status` (Short): 状态

```json
{
    "organization.oid": 1,
    "organization.status": 1,
}
```

## 大区


大区信息管理


> **类**: `api.system.RegionAction`


#### 数据类型: `region`

| 参数 | 说明 | 类型 |
|------|------|------|
| `rid` | 大区ID | Integer |
| `no` | 编码 | String |
| `name` | 大区名称 | String |


:param regionName: 大区名称
:type regionName: String


##### `查询` pageRegion

分页方式获取大区信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 大区信息列表 , 每条数据类型 `region`

```json
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
```


##### `查询` queryRegion

获取全部大区信息

**Returns:**

- `regions` (List): 大区信息列表 , 每条数据类型 `region`

```json
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
```


##### `查询` queryRegionByRid

通过大区ID获取大区信息

**Requests:**

- `region.rid` (Integer): 大区编号

```json
{
    "region.rid": 1
}
```

**Returns:**

- `region` (Object): 大区信息 , 类型 `region`

```json
{
    ...
    "region":{
        "rid": 1,
        "no": "R001",
        "name": "东北区"
    },
    ...
}
```


##### `查询` queryRegionByName

通过大区名称获取大区信息 , 大区名称可以使用名称拼音进行查询

**Requests:**

- `region.name` (String): 大区名称 , 大区名称拼音

```json
{
    "region.name": "dongbei"
}
```

**Returns:**

- `regions` (List): 大区信息列表 , 每条数据类型 `region`

```json
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
```


##### `创建` addRegion

添加大区信息

**Requests:**

- `region.name` (String): 大区名称

```json
{
    "region.name": "华中区"
}
```


##### `创建` updateRegion

更新大区信息

判断大区是否存在 , 不存在 , 错误信息 **230020 大区不存在**

**Requests:**

- `region.rid` (Integer): 大区ID
- `region.name` (String): 大区名称

```json
{
    "region.rid": 1,
    "region.name": "华中区"
}
```


##### `创建` deleteRegion

删除大区信息

**Requests:**


```json
{
    "rids[0]": 1,
    "rids[1]": 1
}
```

## 城市


城市信息管理


> **类**: `api.system.CityAction`


#### 数据类型: `city`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cid` | 城市ID | Integer |
| `no` | 城市编码 | String |
| `name` | 城市名称 | String |
| `province` | 省份 | String |
| `region` | 所属大区 , 类型 [region ](./system.html#api.system.RegionAction.region) | Object |
| `x` | 经度 | Integer |
| `y` | 纬度 | Integer |


:param name: 城市名称
:type name: String
:param regionId: 大区ID
:type regionId: String


##### `查询` pageCity

分页方式获取城市信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 城市信息列表 , 每条数据类型 `city`

```json
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
```


##### `查询` queryCity

获取全部城市信息

**Returns:**

- `citys` (List): 城市信息列表 , 每条数据类型 `city`

```json
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
```


##### `查询` queryCityByCid

通过城市ID获取城市信息

判断城市是否存在 , 不存在 , 错误信息 **230019 城市不存在**

**Requests:**

- `city.cid` (Integer): 城市ID

```json
{
    "city.cid": 1
}
```

**Returns:**

- `city` (Object): 城市信息 , 类型 `city`

```json
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
```


##### `查询` queryCityByRid

通过大区ID获取城市信息

**Requests:**

- `city.region.rid` (Integer): 大区ID

```json
{
    "city.region.rid": 1
}
```

**Returns:**

- `citys` (List): 城市信息列表 , 每条数据类型 `city`

```json
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
```


##### `查询` queryCityByName

通过城市名称获取城市信息 , 城市名称可以为名称拼音进行查询

**Requests:**

- `city.name` (String): 城市名称 , 城市名称拼音

```json
{
    "city.name": "shenyang"
}
```

**Returns:**

- `citys` (List): 城市信息列表 , 每条数据类型 `city`

```json
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
```


##### `创建` addCity

添加城市信息

**Requests:**

- `city.name` (String): 城市名称
- `city.province` (String): 省份
- `city.region.rid` (Integer): 大区编号
- `city.x` (Integer): 经度
- `city.y` (-): 纬度

```json
{
    "city.name": "本溪",
    "city.province": "辽宁",
    "city.region.rid": 1,
    "city.x": 0,
    "city.y": 0
}
```


##### `创建` updateCity

更新城市信息

判断城市是否存在 , 不存在 , 错误信息 **230019 城市不存在**

**Requests:**

- `city.cid` (Integer): 城市ID
- `city.name` (String): 城市名称
- `city.province` (String): 省份
- `city.region.rid` (-): 大区ID
- `city.region.rid` (-): Integer
- `city.x` (Integer): 经度
- `city.y` (-): 纬度

```json
{
    "city.cid": 1,
    "city.name": "沈阳",
    "city.province": "辽宁",
    "city.region.rid": 1
}
```


##### `查询` updateCityForPosition

更新城市位置

判断城市是否存在 , 不存在 , 错误信息 **230019 城市不存在**

**Requests:**

- `city.cid` (Integer): 城市ID
- `city.y` (Integer): 纬度

```json
{
    "city.cid": 1,
    "city.x": 0,
    "city.y": 0
}
```


##### `创建` deleteCity

通过城市ID删除城市

判断城市是否已经被城区引用 , 已引用 , 错误信息 **230006 城市已被引用,不能删除**

**Requests:**

- `city.cid` (Integer): 城市ID

```json
{
    "city.cid": 1,
    "city.name": "沈阳",
    "city.region.rid": 1
}
```

## 城区


城区信息管理


> **类**: `api.system.CityProperAction`


#### 数据类型: `cityProper`

| 参数 | 说明 | 类型 |
|------|------|------|
| `cpid` | 城区ID | Integer |
| `no` | 城区编码 | String |
| `name` | 城区名称 | String |
| `city` | 所属城市 , 类型 [city ](./system.html#api.system.CityAction.city) | Object |
| `x` | 经度 | Integer |
| `y` | 纬度 | Integer |


:param cityProperName: 城区名称
:type cityProperName: String
:param cityId: 城市ID
:type cityId: Integer
:param regionId: 大区ID
:type regionId: Integer


##### `查询` pageCityProper

分页方式获取城区信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 城区信息列表 , 每条数据类型 `cityProper`

```json
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
```


##### `查询` queryCityProper

获取全部城区信息

**Returns:**

- `cityPropers` (List): 城区信息列表 , 每条数据类型 `cityProper`

```json
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
```


##### `查询` queryCityProperByCpid

通过城区ID获取城区信息

判断城区是否存在 , 不存在 , 错误信息 **230018 城区不存在**

**Requests:**

- `cityProper.cpid` (Integer): 城区Id

```json
{
    "cityProper.cpid": 1
}
```

**Returns:**

- `cityProper` (Object): 城区信息 , 类型 `cityProper`

```json
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
```


##### `查询` queryCityProperByCid

通过城市ID获取城区信息

**Requests:**

- `cityProper.city.cid` (Integer): 城市ID

```json
{
    "cityProper.city.cid": 1
}
```

**Returns:**

- `cityPropers` (List): 城区信息列表 , 每条数据类型 `cityProper`

```json
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
```


##### `查询` queryCityProperByName

通过城区名称查询城区信息 , 城区名称可以使用名称拼音进行查询

**Requests:**

- `cityProper.name` (String): 城区名称 , 城区名称拼音

```json
{
    "cityProper.name": "tiexi"
}
```

**Returns:**

- `cityPropers` (List): 城区信息列表 , 每条数据类型 `cityProper`

```json
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
```


##### `创建` addCityProper

添加城区信息

**Requests:**

- `cityProper.name` (String): 城区名称
- `cityProper.city.cid` (Integer): 城市编号

```json
{
    "cityProper.name": "沈河",
    "cityProper.city.cid": 1
}
```


##### `创建` updateCityProper

更新城区信息

判断城区是否存在 , 不存在 , 错误信息 **230018 城区不存在**

**Requests:**

- `cityProper.cpid` (Long): 城区ID
- `cityProper.name` (String): 城区名称
- `cityProper.city.cid` (String): 城市编号

```json
{
    "cityProper.cpid": 1,
    "cityProper.name": "铁西",
    "cityProper.city.cid": 1
}
```


##### `创建` updateCityProperForPosition

更新城区位置

判断城区是否存在 , 不存在 , 错误信息 **230018 城区不存在**

**Requests:**

- `cityProper.cpid` (Long): 城区ID
- `cityProper.x` (Integer): 经度
- `cityProper.y` (Integer): 纬度

```json
{
    "cityProper.cpid": 1,
    "cityProper.x": "铁西",
    "cityProper.y": 1
}
```


##### `创建` deleteCityProper

删除城区信息

判断城区是否被楼盘引用 , 已引用 , 错误信息 **230003 , 城区已引用,不能删除**

判断城区是否被部门引用 , 已引用 , 错误信息 **230003 , 城区已引用,不能删除**

**Requests:**

- `cpid` (Integer): 城区编号

```json
{
    "cpid": 1
}
```

## 角色


角色信息管理


> **类**: `api.system.RoleAction`


#### 数据类型: `role`

| 参数 | 说明 | 类型 |
|------|------|------|
| `rid` | 角色ID | Long |
| `name` | 名称 | String |
| `pinyin` | 拼音 | String |
| `level` | 等级 | Short |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `content` | 描述 | String |


:param roleName: 角色名称
:type roleName: String


##### `查询` pageRole

分页方式获取角色信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 角色信息列表 , 每条数据类型 `role`

```json
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
```


##### `查询` queryRole

获取全部角色信息

**Returns:**

- `roleList` (List): 角色信息列表 , 每条数据类型 `role`

```json
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
```


##### `查询` queryRoleByRid

通过角色ID获取角色信息

**Requests:**

- `role.rid` (Integer): 角色ID

```json
{
    "role.rid": 1
}
```

**Returns:**

- `role` (Object): 角色信息 , 类型 `role`

```json
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
```


##### `查询` queryRoleByName

通过角色名称或者拼音获取角色信息

**Requests:**

- `role.name` (String): 角色名称

```json
{
    "role.name": "设计师"
}
```

**Returns:**

- `role` (Object): 角色信息 , 类型 `role`

```json
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
```


##### `创建` addRole

添加角色信息

判断角色名称是否存在 , 已存在 , 错误信息 **230005 角色名称已经存在**

**Requests:**

- `role.name` (String): 角色名称
- `role.content` (String): 角色描述

```json
{
    "role.name": "设计师",
    "role.content": "设计师"
}
```


##### `创建` updateRole

更新角色信息

判断角色是否存在 , 不存在 , 错误信息 **230010 角色不存在**

**Requests:**

- `role.rid` (String): 角色编号
- `role.name` (String): 角色名称
- `role.content` (String): 角色描述

```json
{
    "role.rid": "R001",
    "role.name": "设计师",
    "role.content": "设计师"
}
```


##### `创建` deleteRoleByRid

删除角色信息

判断角色是否被人员引用 , 已引用 , 错误信息 **230006 角色已引用, 不能删除**

**Requests:**

- `role.rid` (Integer): 角色Id

```json
{
    "rid": 1
}
```

## 模块


模块信息管理 , 控制菜单内容


> **类**: `api.system.ModuleAction`


#### 数据类型: `module`

| 参数 | 说明 | 类型 |
|------|------|------|
| `mid` | 模块ID | Integer |
| `fatherModule` | 父模块 , 类型 `module` | Object |
| `name` | 模块名 | String |
| `icon` | 图标 | String |
| `url` | 模块路径 | String |
| `level` | 层级 | Short |
| `system` | 所属系统 , 1: 信息 , 2: 财务 , 3: 进销存 | Short |
| `link` | 链接标识 | Short |


##### `查询` pageModule

分页方式获取模块信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 模块信息列表 , 每条数据类型 `module`

```json
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
```


##### `查询` queryModule

获取所有模块信息

**Returns:**

- `modules` (List): 模块信息列表 , 每条数据类型 `module`

```json
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
```


##### `查询` queryModuleForLogin

获取当前用户所属角色拥有的模块信息

**Returns:**

- `modules` (List): 模块信息列表 , 每条数据类型 `module`

```json
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
```


##### `查询` queryModuleForLink

获取当前用户所属角色拥有的链接模块信息

**Returns:**

- `modules` (List): 模块信息列表 , 每条数据类型 `module`

```json
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
```


##### `查询` queryModuleByUserId

通过员工编号获取用户所属角色拥有模块信息

判断员工是否存在 , 不存在 , 错误信息 **190005 员工不存在**

**Requests:**

- `user.userId` (String): 用户编号

```json
{
    "user.userId": "U001"
}
```

**Returns:**

- `modules` (List): 模块信息列表 , 每条数据类型 `module`

```json
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
```


##### `查询` queryModuleByRid

通过角色编号获取拥有模块信息

**Requests:**

- `role.rid` (Long): 角色ID

```json
{
    "role.rid": 1
}
```

**Returns:**

- `modules` (List): 模块信息列表 , 每条数据类型 `module`

```json
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
```


##### `创建` checkModule

检查模块权限

判断模块是否存在 , 不存在 , 错误信息 **230011 模块不存在**

**Requests:**

- `module.mid` (Long): 模块ID

```json
{
    "module.mid": 1
}
```


##### `创建` addModule

添加模块信息

判断父模块是否存在 , 不存在 , 错误信息 **230011 模块不存在**

**Requests:**

- `module.name` (String): 名称
- `module.icon` (String): 图标
- `module.url` (String): 地址
- `module.level` (Short): 层级
- `module.fatherModule.mid` (Integer): 父模块ID

```json
{
    "module.name": 系统,
    "module.icon": "icon-dashboard",
    "module.url": "/views/system/city.html",
    "module.system": 1,
    "module.fatherModule.mid": 1,
}
```


##### `创建` updateRoleModuleByRid

通过角色编号更新角色拥有的模块信息

判断角色是否存在 , 不存在 , 错误信息 **230010 角色不存在**

判断更新角色与操作人员对应角色等级 , 如果后者小于前者 , 错误信息 **-1 误操作权限**

**Requests:**

- `role.rid` (String): 角色编号

```json
{
    "role.rid": 1,
    "mids[0]": 1,
}
```


##### `创建` deleteModule

删除模块信息

判断模块是否已被角色引用 , 已引用 , 错误信息 **230012 模块已引用,不能删除**

**Requests:**

- `module.mid` (Short): 模块ID

```json
{
    "module.mid": 1
}
```

## 操作


操作信息管理 , 控制系统操作权限


> **类**: `api.system.OperationAction`


#### 数据类型: `operation`

| 参数 | 说明 | 类型 |
|------|------|------|
| `oid` | 操作ID | Integer |
| `module` | 模块 , 类型为 [module ](./system.html#api.system.ModuleAction.module) | String |
| `name` | 操作说明 | String |
| `operation` | 操作 | String |
| `system` | 所属系统 , 1: 平台 , 2: 小程序 | Short |
| `type` | 类型 , 0: 权限 , 1: 免检 , 2: 通用 , 3: 钉钉 , 4: 共享 | Short |


##### `查询` pageOperation

分页方式获取操作信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 操作信息列表 , 每条数据类型 `operation`

```json
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
```


##### `查询` queryOperation

获取所有操作信息

**Requests:**

- `operation.system` (Short): 系统

```json
{
    "operation.system": 1
}
```

**Returns:**

- `operations` (List): 操作信息列表 , 每条数据类型 `operation`

```json
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
```


##### `查询` queryOperationForLogin

通过操作名称查询操作信息

**Requests:**

- `operation.system` (Short): 系统

```json
{
    "operation.system": 1
}
```

**Returns:**

- `operations` (List): 操作信息列表 , 每条数据类型 `operation`

```json
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
```


##### `查询` queryOperationForSelf

查询当前操作用户拥有的操作信息

**Requests:**

- `operation.system` (Short): 系统

```json
{
    "operation.system": 1
}
```

**Returns:**

- `operations` (List): 操作信息列表 , 每条数据类型 `operation`

```json
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
```


##### `查询` queryOperationByUserId

通过用户编号获取操作信息

判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

**Requests:**

- `operation.system` (Short): 系统标识
- `user.userId` (String): 用户编号

```json
{
    "operation.system": 1,
    "user.userId": "U001"
}
```

**Returns:**

- `operations` (List): 操作信息列表 , 每条数据类型 `operation`

```json
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
```


##### `查询` queryOperationByRid

通过角色编号获取操作信息

判断角色是否存在 , 不存在 , 错误信息 **230010 角色不存在**

**Requests:**

- `operation.system` (Short): 系统标识
- `role.rid` (String): 角色编号

```json
{
    "operation.system": 1,
    "role.rid": 1
}
```

**Returns:**

- `operations` (List): 操作信息列表 , 每条数据类型 `operation`

```json
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
```


##### `创建` addOperation

添加操作信息 , 相同操作的操作不能添加

**Requests:**

- `operation.name` (String): 操作名
- `operation.operation` (String): 操作
- `operation.system` (Short): 系统
- `operation.type` (Short): 类型
- `operation.module.mid` (Integer): 所属模块ID

```json
{
    "operation.name": "测试",
    "operation.operation": "test",
    "operation.system": 1,
    "operation.type": 1,
    "operation.module.mid": 1
}
```


##### `创建` updateOpperation

更新

**Requests:**

- `operation.oid` (Long): 操作ID
- `operation.name` (String): 操作名
- `operation.operation` (String): 操作
- `operation.system` (Short): 系统
- `operation.type` (Short): 类型
- `operation.module.mid` (Integer): 所属模块ID

```json
{
    "operation.oid": 1,
    "operation.name": "测试",
    "operation.operation": "test",
    "operation.system": 1,
    "operation.type": 1,
    "operation.module.mid": 1
}
```


##### `创建` updateRoleOperation

根据角色编号更新角色的操作信息

判断角色是否存在 , 不存在 , 错误信息 **230010 角色不存在**

**Requests:**

- `operation.system` (String): 系统
- `role.rid` (Long): 角色ID
- `operation.oid` (Long): 操作ID

```json
{
    "oids[0]": 1
    "operation.system": 1,
    "role.rid": "R001",
}
```


##### `创建` updateRoleOperationByRid

根据角色编号更新角色的操作信息

判断角色是否存在 , 不存在 , 错误信息 **230010 角色不存在**

**Requests:**

- `operation.system` (String): 系统
- `role.rid` (String): 角色编号

```json
{
    "oids[0]": 1
    "operation.system": 1,
    "role.rid": "R001",
}
```


##### `创建` updateRoleOperationByUserId

根据员工编号更新员工所属角色的操作信息

判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

**Requests:**

- `operation.system` (String): 系统
- `user.userId` (String): 用户编号

```json
{
    "oids[0]": 1
    "operation.system": 1,
    "user.userId": "U001",
}
```


##### `创建` deleteOperation

删除操作信息

判断操作是否被角色引用 , 已引用 , 错误信息 **操作已引用,不能删除**

**Requests:**

- `operation.oid` (Integer): 操作ID

```json
{
    "operation.oid": 1
}
```


##### `创建` deleteRoleOperation

删除角色对应操作信息

**Requests:**

- `role.rid` (Integer): 角色ID
- `operation.oid` (Integer): 操作ID

```json
{
    "role.rid": 1,
    "operation.oid": 1
}
```

## 配置


系统配置管理


> **类**: `api.system.SystemConfigAction`


#### 数据类型: `systemConfig`

| 参数 | 说明 | 类型 |
|------|------|------|
| `scid` | 配置ID | Long |
| `key` | 键 | String |
| `value` | 值 | String |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `comment` | 备注 | String |
| `company` | 公司 | Integer |


##### `查询` pageSystemConfig

分页方式获取系统配置 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 系统配置列表 , 每条数据类型 `systemConfig`

```json
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
```


##### `查询` querySystemConfigByCid

通过公司ID获取归属系统配置信息

**Requests:**

- `systemConfig.company` (Integer): 公司Id

```json
{
    "systemConfig.company": 1
}
```

**Returns:**

- `systemConfigs` (List): 系统配置列表 , 每条数据类型 `systemConfig`

```json
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
```


##### `查询` querySystemConfigByKey


##### `创建` addSystemConfig

添加系统配置

判断系统配置键是否存在 , 已存在 , 错误信息 **130012 系统配置已存在**

**Requests:**

- `systemConfig.key` (String): 键
- `systemConfig.value` (String): 值

```json
{
    "systemConfig.key": "key",
    "systemConfig.value": "value"
}
```


##### `创建` updateSystemConfig

更新系统配置

判断系统配置是否存在 , 不存在 , 错误信息 **130013 系统配置不存在**

**Requests:**

- `systemConfig.scid` (String): 键
- `systemConfig.value` (String): 值
- `systemConfig.company` (Integer): 公司

```json
{
    "systemConfig.scid": 1,
    "systemConfig.value": "value",
    "systemConfig.company": 1
}
```

## 版本


系统版本信息管理


> **类**: `api.system.VersionAction`


#### 数据类型: `version`

| 参数 | 说明 | 类型 |
|------|------|------|
| `vid` | 版本ID | Long |
| `no` | 版本号 | String |
| `createTime` | 创建时间 | Timestamp |
| `comment` | 说明 | String |
| `status` | 状态 , 0: 启用 , 1: 禁用 | Short |


##### `查询` pageVersion

分页方式获版本配置 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 版本信息列表 , 每条数据类型 `version`

```json
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
```


##### `查询` queryVersion

获取所有版本信息

**Returns:**

- `versions` (List): 版本信息列表 , 每条数据类型 `version`

```json
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
```


##### `创建` addVersion

添加版本

判断版本编号是否存在 , 已存在 , 错误信息 **230022 版本已存在**

**Requests:**

- `version.no` (String): 编号
- `version.comment` (String): 说明

```json
{
    "version.no": "1.0.1",
    "version.comment": "说明"
}
```


##### `创建` updateVersion

更新版本

判断版本是否存在 , 不存在 , 错误信息 **230021 版本不存在**

判断版本编号是否存在 , 已存在 , 错误信息 **230022 版本已存在**

**Requests:**

- `version.vid` (Long): 版本Id
- `version.comment` (Strin): 说明

```json
{
    "version.vid": 1,
    "version.comment": "说明"
}
```


##### `创建` updateVersionForStatus

更新版本状态

判断版本是否存在 , 不存在 , 错误信息 **230021 版本不存在**

**Requests:**

- `version.vid` (Long): 版本Id
- `version.status` (Short): 状态

```json
{
    "version.vid": 1,
    "version.status": 1
}
```


##### `创建` deleteVersion

删除版本信息

**Requests:**

- `version.vid` (Long): 版本Id

```json
{
    "version.vid": 1
}
```

## 升级


系统升级处理


> **类**: `api.system.UpgradeAction`


#### 数据类型: `upgrade`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ugid` | ID | Long |
| `no` | 版本号 | String |
| `trialno` | 适用版本号 | String |
| `createTime` | 创建时间 | Timestamp |
| `content` | 说明 | String |
| `path` | 文件路径 | String |
| `fileSize` | 文件大小 | Integer |
| `status` | 状态 , 0: 初始 , 1: 上线 , 2: 下线 | Short |


##### `查询` pageUpgrade

分页方式获升级包配置 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (Object): 分页信息
- `paging.data` (List): 升级包信息列表 , 每条数据类型 `upgrade`

```json
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
```


##### `查询` queryUpgrade

获取所有升级包信息

**Returns:**

- `upgrades` (List): 升级包列表 , 每条数据类型 `upgrade`

```json
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
```


##### `创建` matchUpgrade

添加系统配置

**Requests:**

- `upgrade.trialno` (String): 适用版本

```json
{
    "version.trialno": "1.0.1"
}
```

**Returns:**

- `upgrades` (List): 升级包列表 , 每条数据类型 `upgrade`

```json
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
```


##### `创建` addUpgrade

添加升级包

判断版本编号是否存在 , 已存在 , 错误信息 **230022 版本已存在**

**Requests:**

- `upgrade.no` (String): 版本号
- `upgrade.trialno` (String): 适用版本号
- `upgrade.content` (String): 说明
- `upgrade.path` (String): 文件路径
- `upgrade.fileSize` (Integer): 文件大小

```json
{
    "upgrade.no": "1.0.2",
    "upgrade.trialno": "1.0.1",
    "upgrade.content": "说明"
    "upgrade.path": "JOISDNFDIFNNDSIDF.zip",
    "upgrade.fileSize": 1918
}
```


##### `查询` updateUpgradeForStatus

更新升级包状态

判断版本编号是否存在 , 已存在 , 错误信息 **230022 版本已存在**

**Requests:**

- `upgrade.ugid` (Long): 版本ID
**Requests:**

- `upgrade.ugid` (Long): ID

```json
{
    "upgrade.ugid": 1
}
```


##### `查询` deleteUpgrade

删除升级包

**Requests:**

- `upgrade.ugid` (Long): ID

```json
{
    "upgrade.ugid": 1
}
```
