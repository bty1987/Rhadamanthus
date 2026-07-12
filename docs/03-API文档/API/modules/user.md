# 人资


## 部门


### 类型


部门类型信息管理


> **类**: `api.communion.DepartmentTypeAction`


#### 数据类型: `departmentType`

| 参数 | 说明 | 类型 |
|------|------|------|
| `dtid` | ID | Long |
| `name` | 名称 | String |


##### `查询` pageDepartmentType

分页方式获取部门类型信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 部门类型信息列表 , 每条数据类型 `departmentType`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "dtid": 1,
                "name": "设计",
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryDepartmentType

获取部门类型信息

**Returns:**

- `departmentTypes` (object): 部门类型信息 , 类型 `departmentType`

```json
{
    ...
    "departmentTypes": [
        {
            "dtid": 1,
            "name": "设计",
        }
    ],
    ...
}
```


##### `创建` addDepartmentType

添加部门类型信息

**Requests:**

- `departmentType.name` (String): 名称

```json
{
    "departmentType.name": "设计"
}
```

### 部门


部门信息管理


> **注意**
>
> * 部门层级可以划分多层 , 利用上级部门字段 , 按照两级结构进行划分 , 分为分区和部门 , 主要体现在设计和业务 .
> * 设计大区 - 设计部 , 业务大区 - 业务部 , 主材部 , 工程部 , 职能部 , 其他分类可以根据公司具体情况进行管理 .
>


> **类**: `api.communion.DepartmentAction`


#### 数据类型: `department`

| 参数 | 说明 | 类型 |
|------|------|------|
| `did` | 部门ID | Long |
| `no` | 编码 | String |
| `name` | 名称 | String |
| `pinyin` | 拼音 | String |
| `type` | 部门类型 , 类型 [departmentType ](./department.html#api.communion.DepartmentTypeAction.departmentType) | Object |
| `fatherDept` | 上级部门 , 类型 `department` | Object |
| `manager` | 管理员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `level` | 等级 , 1: 分区 , 2: 部门 | Short |
| `createTime` | 创建时间 | Timestamp |
| `status` | 状态 , 0: 禁用 , 1: 启用 | Short |
| `isdet` | 是否定岗 , 0: 开放 , 1: 定岗 | Short |
| `limit` | 数量上限 | Integer |
| `company` | 公司 | Long |
| `comment` | 说明信息 | String |
| `kino` | 金蝶编号 | String |
| `kiname` | 金蝶名称 | String |


:param type: 类型
:type type: String
:param name: 名称
:type name: String


##### `查询` pageDepartment

分页方式获取部门信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 部门信息列表 , 每条数据类型 `department`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "did": 1,
                "no": "D001",
                "name": "市场营销一部",
                "type": {
                    "dtid": 1,
                    "name": "设计"
                },
                "fatherDept": {
                    "did": 1,
                    "no": "D002",
                    "createTime": "2014-01-01",
                    "name": "市场一分区",
                    "comment": "市场一分区",
                    "subType": null,
                    "type": "业务大区",
                    "contractPrefix": null,
                    "fatherDept": null,
                    "cityProper": null
                },
                "manager": {
                    "uid": 2,
                    "userId": "FL-00186",
                    "userName": "白雪",
                    "currentName": "白雪",
                    "phone": "138xxxx1828",
                    ...
                },
                "level": 1,
                "createTime": "2014-01-01",
                "isdet": 0,
                "limit": 100,
                "comment": "",
                "kino": "01.01.02",
                "kiname": "市场营销一部"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryDepartment

获取全部部门信息

**Requests:**

- `dept.type` (String): 类型 , 通过类型进行查询

```json
{
	"dept.type": "业务部"
}
```

**Returns:**

- `departments` (List): 部门信息列表 , 每条数据类型 `department`

```json
{
    ...
    "departments": [
        {
            "did": 1,
            "no": "D001",
            "name": "市场营销一部",
            "createTime": "2014-01-01",
            "type": {
                "dtid": 1,
                "name": "设计"
            },
            "fatherDept": {
                "did": 1,
                "no": "D002",
                "createTime": "2014-01-01",
                "name": "市场一分区",
                "comment": "市场一分区",
                "subType": null,
                "type": "业务大区",
                "contractPrefix": null,
                "fatherDept": null,
                "cityProper": null
            },
            "level": 1,
            "isdet": 0,
            "limit": 100,
            "comment": "",
            "kino": "01.01.02",
            "kiname": "市场营销一部"
        }
    ],
    ...
}
```


##### `查询` queryDepartmentByDtid

通过部门类型ID获取部门信息

**Requests:**

- `dept.type.dtid` (Integer): 部门类型ID

```json
{
    "dept.type.dtid": 1
}
```

**Returns:**

- `departments` (List): 部门信息列表 , 每条数据类型 `department`

```json
{
    ...
    "departments": [
        {
            "did": 1,
            "no": "D001",
            "name": "市场营销一部",
            "createTime": "2014-01-01",
            "type": {
                "dtid": 1,
                "name": "设计"
            },
            "fatherDept": {
                "did": 1,
                "no": "D002",
                "createTime": "2014-01-01",
                "name": "市场一分区",
                "comment": "市场一分区",
                "subType": null,
                "type": "业务大区",
                "contractPrefix": null,
                "fatherDept": null,
                "cityProper": null
            },
            "manager": {
                "uid": 2,
                "userId": "FL-00186",
                "userName": "白雪",
                "currentName": "白雪",
                "phone": "138xxxx1828",
                ...
            },
            "level": 1,
            "isdet": 0,
            "limit": 100,
            "comment": "",
            "kino": "01.01.02",
            "kiname": "市场营销一部"
        }
    ],
    ...
}
```


##### `查询` queryDepartmentByDid

通过部门ID获取部门信息

**Requests:**

- `dept.did` (Long): 部门ID

```json
{
    "dept.did": 1
}
```

**Returns:**

- `dept` (object): 部门信息 , 类型 `department`

```json
{
    ...
    "dept":{
        "did": 1,
        "no": "D001",
        "name": "市场营销一部",
        "createTime": "2014-01-01",
        "type": {
            "dtid": 1,
            "name": "设计"
        },
        "fatherDept": {
            "did": 1,
            "no": "D002",
            "createTime": "2014-01-01",
            "name": "市场一分区",
            "comment": "市场一分区",
            "subType": null,
            "type": "业务大区",
            "contractPrefix": null,
            "fatherDept": null,
            "cityProper": null
        },
        "manager": {
            "uid": 2,
            "userId": "FL-00186",
            "userName": "白雪",
            "currentName": "白雪",
            "phone": "138xxxx1828",
            ...
        },
        "level": 1,
        "isdet": 0,
        "limit": 100,
        "comment": "",
        "kino": "01.01.02",
        "kiname": "市场营销一部"
    },
    ...
}
```


##### `查询` queryDepartmentByNo

通过部门编号获取部门信息

**Requests:**

- `dept.no` (String): 部门编号

```json
{
    "dept.no": "D001"
}
```

**Returns:**

- `dept` (object): 部门信息 , 类型 `department`

```json
{
    ...
    "dept":{
        "did": 1,
        "no": "D001",
        "name": "市场营销一部",
        "createTime": "2014-01-01",
        "type": {
            "dtid": 1,
            "name": "设计"
        },
        "fatherDept": {
            "did": 1,
            "no": "D002",
            "createTime": "2014-01-01",
            "name": "市场一分区",
            "comment": "市场一分区",
            "subType": null,
            "type": "业务大区",
            "contractPrefix": null,
            "fatherDept": null,
            "cityProper": null
        },
        "manager": {
            "uid": 2,
            "userId": "FL-00186",
            "userName": "白雪",
            "currentName": "白雪",
            "phone": "138xxxx1828",
            ...
        },
        "level": 1,
        "isdet": 0,
        "limit": 100,
        "comment": "",
        "kino": "01.01.02",
        "kiname": "市场营销一部"
    },
    ...
}
```


##### `查询` queryDepartmentByName

通过部门名称以及部门类型获取部门信息 , 部门名称可以使用名称拼音进行查询

**Requests:**

- `dept.name` (String): 部门名称 , 部门名称拼音
- `dept.type` (String): 类型 , 包括:设计大区 , 业务大区 , 设计部 , 业务部 , 主材部 , 职能部 , 工程部

```json
{
    "dept.name": "shichang",
    "dept.type": "设计部"
}
```

**Returns:**

- `departments` (List): 部门信息列表 , 每条数据类型 `department`

```json
{
    ...
    "departments": [
        {
            "did": 1,
            "no": "D001",
            "name": "市场营销一部",
            "createTime": "2014-01-01",
            "type": {
                "dtid": 1,
                "name": "设计"
            },
            "fatherDept": {
                "did": 1,
                "no": "D002",
                "createTime": "2014-01-01",
                "name": "市场一分区",
                "comment": "市场一分区",
                "subType": null,
                "type": "业务大区",
                "contractPrefix": null,
                "fatherDept": null,
                "cityProper": null
            },
            "manager": {
                "uid": 2,
                "userId": "FL-00186",
                "userName": "白雪",
                "currentName": "白雪",
                "phone": "138xxxx1828",
                ...
            },
            "level": 1,
            "isdet": 0,
            "limit": 100,
            "comment": "",
            "kino": "01.01.02",
            "kiname": "市场营销一部"
        }
    ],
    ...
}
```


##### `创建` addDepartment

添加部门信息

**Requests:**

- `dept.name` (String): 名称
- `dept.comment` (String): 说明信息
- `dept.type.dtid` (Long): 类型ID
- `dept.fatherDept.did` (Long): 上级部门ID
- `dept.manager.uid` (Long): 管理员ID
- `dept.level` (Short): 等级
- `dept.isdet` (Short): 是否定岗
- `dept.limit` (Short): 数量上限
- `dept.kino` (String): 金蝶编号
- `dept.kiname` (String): 金蝶名称

```json
{
    "dept.name": "设计部",
    "dept.comment": "说明信息",
    "dept.type.dtid": 1,
    "dept.fatherDept.did": 1,
    "dept.manager.uid": 1,
    "dept.level": 1,
    "dept.isdet": 1,
    "dept.limit": 1,
    "dept.kino": "01.01.02",
    "dept.kiname": "设计部"
}
```


##### `创建` updateDepartment

更新部门信息

**Requests:**

- `dept.did` (Long): 部门ID
- `dept.name` (String): 名称
- `dept.type.dtid` (Long): 类型ID
- `dept.fatherDept.did` (Long): 上级部门ID
- `dept.comment` (String): 说明信息
- `dept.manager.uid` (Long): 管理员ID
- `dept.level` (Short): 等级
- `dept.isdet` (Short): 是否定岗
- `dept.limit` (Short): 数量上限
- `dept.kino` (String): 金蝶编号
- `dept.kiname` (String): 金蝶名称

```json
{
    "dept.did": 1,
    "dept.name": "设计部",
    "dept.comment": "说明信息",
    "dept.type.dtid": 1,
    "dept.fatherDept.did": 1,
    "dept.manager.uid": 1,
    "dept.level": 1,
    "dept.isdet": 1,
    "dept.limit": 1,
    "dept.kino": "01.01.02",
    "dept.kiname": "设计部"
}
```


##### `创建` updateDepartmentForStatus

更新部门状态

**Requests:**

- `dept.did` (Long): 部门ID
- `dept.status` (Short): 状态
- `dept.isdet` (Short): 是否定岗

```json
{
    "dept.did": 1,
    "dept.status": 1,
    "dept.isdet": 0
}
```

### 定岗


> **类**: `api.communion.DutmentAction`


#### 数据类型: `dutment`

| 参数 | 说明 | 类型 |
|------|------|------|
| `did` | 定岗ID | Long |
| `dept` | 部门 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | Object |
| `duty` | 职位 , 类型 [duty ](./data.html#api.duty.DutyAction.duty) | Object |
| `limit` | 人员上限 | Integer |
| `num` | 人员数量 | Integer |


##### `查询` queryDutmentByDeid

根据部门获取对应职位的定岗信息

**Requests:**

- `dutment.dept.did` (Long): 部门ID

```json
{
    "dutment.dept.did": 1
}
```

**Returns:**

- `dutments` (List): 定岗列表 , 每条数据类型 `dutment`

```json
{
    ...
    "dutments": [
        {
            "did": 1,
            "dept": {
                "did": 1,
                "no": "D001",
                "name": "市场营销一部",
                "createTime": "2014-01-01",
                "type": {
                    "dtid": 1,
                    "name": "设计"
                },
                "fatherDept": {
                    "did": 1,
                    "no": "D002",
                    "createTime": "2014-01-01",
                    "name": "市场一分区",
                    "comment": "市场一分区",
                    "subType": null,
                    "type": "业务大区",
                    "contractPrefix": null,
                    "fatherDept": null,
                    "cityProper": null
                },
                "comment": "",
                "kino": "01.01.02",
                "kiname": "市场营销一部"
            },
            "duty": {
                "did": 1,
                "name": "设计师",
                "departmentType": {
                    "dtid": 1,
                    "name": "设计"
                },
                "type": 0,
                "status": 0,
                "lead": 0
            },
            "limit": 10000,
            "num": 0
        }
    ],
    ...
}
```


##### `查询` queryDutmentByDuid

根据职位获取对应部门的定岗信息

**Requests:**

- `dutment.duty.did` (Long): 职位ID

```json
{
    "dutment.duty.did": 1
}
```

**Returns:**

- `dutments` (List): 定岗列表 , 每条数据类型 `dutment`

```json
{
    ...
    "dutments": [
        {
            "did": 1,
            "dept": {
                "did": 1,
                "no": "D001",
                "name": "市场营销一部",
                "createTime": "2014-01-01",
                "type": {
                    "dtid": 1,
                    "name": "设计"
                },
                "fatherDept": {
                    "did": 1,
                    "no": "D002",
                    "createTime": "2014-01-01",
                    "name": "市场一分区",
                    "comment": "市场一分区",
                    "subType": null,
                    "type": "业务大区",
                    "contractPrefix": null,
                    "fatherDept": null,
                    "cityProper": null
                },
                "comment": "",
                "kino": "01.01.02",
                "kiname": "市场营销一部"
            },
            "duty": {
                "did": 1,
                "name": "设计师",
                "departmentType": {
                    "dtid": 1,
                    "name": "设计"
                },
                "type": 0,
                "status": 0,
                "lead": 0
            },
            "limit": 10000,
            "num": 0
        }
    ],
    ...
}
```


##### `创建` addDutment

添加定岗信息

判断职位和部门是否存在定岗信息 , 已经存在 , 错误信息 **130051 定岗信息已存在**

**Requests:**

- `dutment.duty.did` (Long): 职位ID
- `dutment.dept.did` (Long): 部门ID
- `dutment.limit` (Integer): 人员上限

```json
{
    "dutment.duty.did": 1,
    "dutment.dept.did": 1,
    "dutment.limit": 0
}
```


##### `创建` updateDutment

更新定岗信息

更新数据包括人员数量上限

判断定岗信息是否存在 , 不存在 , 错误信息 **130050 定岗信息不存在**

**Requests:**

- `dutment.did` (Long): 定岗ID
- `dutment.limit` (Integer): 人员上限

```json
{
    "dutment.did": 1,
    "dutment.limit": 0
}
```


##### `创建` deleteDutment

删除定岗信息

**Requests:**

- `dutment.did` (Long): 定岗ID

```json
{
    "dutment.did": 1
}
```

## 员工


### 员工


员工信息管理


> **类**: `api.personel.UserAction`


#### 数据类型: `user`

| 参数 | 说明 | 类型 |
|------|------|------|
| `uid` | 员工ID | Long |
| `userId` | 员工编号 | String |
| `oldUserId` | 旧员工编号 | String |
| `type` | 类型 , 0: 人员 , 1: 厂商 , 2: 商户 , 3: 管理 | Short |
| `loginId` | 登陆帐号 | String |
| `password` | 密码 | String |
| `userName` | 用户名 | String |
| `currentName` | 现用名 | String |
| `pinyin` | 拼音 | String |
| `identity` | 身份证号 | String |
| `phone` | 手机号 | String |
| `status` | 状态 , 0: 在职, 1: 离职, 2: 停薪留职 | Short |
| `userPhoto` | 用户图片 | String |
| `isLogin` | 是否允许登陆 , 0: 不能登陆 , 1: 允许登陆 | Short |
| `extranet` | 扫码权限 , 0: 允许, 1: 不允许 | Short |
| `freedom` | 特权 , 1: 超时 , 2: 操作名单 , 4:  , 默认值为0 , 标识没有超时特权 , 操作为黑名单 | Short |
| `duty` | 职位 , 类型 [duty ](./data.html#api.duty.DutyAction.duty) | Object |
| `role` | 角色 , 类型 [role ](./system.html#api.system.RoleAction.role) | object |
| `dept` | 部门 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | object |
| `authStatus` | 认证状态 , 0: 初始 , 1(认证) , 2(本地认证) | Short |
| `company` | 公司代码 | Long |
| `companys` | 公司信息 | String |


#### 数据类型: `userInfo`

| 参数 | 说明 | 类型 |
|------|------|------|
| `uiid` | 信息ID | Long |
| `user` | 员工 , 类型 `user` | Object |
| `rank` | 级别 | Short |
| `level` | 职级 , 0: 员工 , 1: 核心员工 , 2: 主管 , 3: 经理 , 4: 总监及以上 | Short |
| `form` | 岗位类型 , 0: 产值 , 1: 非产值 | Short |
| `gender` | 性别 , 0: 女 , 1: 男 | String |
| `age` | 年龄 | Integer |
| `birthday` | 出生日期 | Timestamp |
| `height` | 身高 | Integer |
| `weight` | 体重 | Integer |
| `political` | 政治面貌 , 0: 群众 , 1: 团员 , 2: 党员 | Short |
| `nation` | 民族 | String |
| `hobby` | 特长/爱好 | String |
| `qq` | QQ | String |
| `wechat` | 微信 | String |
| `email` | 邮箱 | String |
| `isMarried` | 婚姻状况 , 0: 已婚 , 1: 未婚 | Short |
| `isBirth` | 生育状况 , 0: 已育 , 1: 未育 | Short |
| `isHouseLoan` | 是否有房贷 , 0: 有 , 1: 无 | Short |
| `isCarLoan` | 是否有车贷 , 0: 有 , 1: 无 | Short |
| `isCarID` | 是否有驾照 , 0: 有 , 1: 无 | Short |
| `isPassID` | 是否有护照 , 0: 有 , 1: 无 | Short |
| `isHMID` | 是否有港澳通行证 , 0: 有 , 1: 无 | Short |
| `isTWID` | 是否有台湾通行证 , 0: 有 , 1: 无 | Short |
| `householdType` | 户口类型 , 0: 农村 , 1: 城镇 | Short |
| `hometownPlace` | 户籍地 | String |
| `hometownAddress` | 户籍地址 | String |
| `address` | 现住地址 | String |
| `lover` | 爱人 | String |
| `claner` | 直系亲属 | String |
| `clanerCom` | 直系亲属公司 | String |
| `emergencyMan` | 紧急联系人 | String |
| `emergencyPhone` | 紧急联系人电话 | String |
| `fangliner` | 方林家属 , 类型 `user` | Object |
| `firstTime` | 入司时间/进入集团时间 | Timestamp |
| `entryTime` | 入职时间 | Timestamp |
| `employWay` | 招聘方式 , 0: 校园招聘 , 1: 网络招聘 , 2: 内部推荐 , 3: 主动应聘 , 4: 猎头 | Short |
| `recommendMan` | 推荐人 | String |
| `jobYears` | 司龄 | Integer |
| `employType` | 招聘类型 , 0: 正式 , 1: 试用 | Short |
| `employTime` | 招聘时间 | Timestamp |
| `serviceYears` | 服务年限 | Integer |
| `isPresentGraduate` | 是否应届 , 0: 是 , 1: 否 | Short |
| `graduateTime` | 毕业时间 | Timestamp |
| `school` | 毕业学校 | String |
| `education` | 学历 , 0: 小学及以下 , 1: 初中 , 2: 中专 , 3: 高中 , 4: 大专 , 5: 本科 , 6: 研究生及以上 | Short |
| `specialty` | 专业 | String |
| `isContract` | 是否签劳动合同 | String |
| `signTime` | 签合同日期 | Timestamp |
| `eignTime` | 合同结束日期 | Timestamp |
| `fignTime` | 首次合同日期 | Timestamp |
| `signNum` | 续签合同次数 | Integer |
| `preformNum` | 试用期限 | String |
| `formTime` | 转正日期 | Timestamp |
| `isInsurance` | 是否上保险 , 0: 是 , 1: 否 | Short |
| `insuranceType` | 保险类型 , 0: 社保 , 1: 商业保险 | Short |
| `insuranceTime` | 参保时间 | Timestamp |
| `pensionNum` | 养老编号 | String |
| `medicalNum` | 医疗编号 | String |
| `publicNum` | 公积金号 |  |
| `palary` | 试用工资 | String |
| `salary` | 转正工资 | String |
| `bank` | 开户行 | String |
| `bankCardNum` | 银行卡号 | String |
| `comment` | 备注 | String |


#### 数据类型: `userBase`

| 参数 | 说明 | 类型 |
|------|------|------|
| `uid` | 员工ID | Long |
| `userId` | 员工编号 | String |
| `oldUserId` | 旧员工编号 | String |
| `userName` | 用户名 | String |
| `currentName` | 现用名 | String |
| `phone` | 手机号 | String |
| `userPhoto` | 用户图片 | String |
| `duty` | 职位 , 类型 [duty ](./data.html#api.duty.DutyAction.duty) | String |
| `dept` | 部门 , 类型 [department ](./department.html#api.department.DepartmentAction.department) | object |


#### 数据类型: `keyValue`

| 参数 | 说明 | 类型 |
|------|------|------|
| `key` | 键 | String |
| `value` | 值 | String |


:param userId: 员工编号
:type userId: String
:param currentName: 现用名
:type currentName: String
:param status: 状态
:type status: String
:param identity: 身份证号
:type identity: String
:param no: 角色编号
:type no: String
:param deptType: 部门类型
:type deptType: String
:param no: 部门编号
:type no: String


##### `查询` pageUser

分页方式获取员工信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 员工信息列表 , 每条数据类型 `user`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "uid": 34,
                "userId": "U001",
                "oldUserId": "U001",
                "userName": "员工",
                "currentName": "员工",
                "identity": "000000000000000000",
                "phone": "138xxxx3874",
                "company": 0,
                "duty": {
                    "did": 1,
                    "name": "设计师",
                    "departmentType": {
                        "dtid": 1,
                        "name": "设计"
                    },
                    "lead": 0
                },
                "dept": {
                    "did": 250,
                    "no": "D001",
                    "name": "设计部",
                    "fatherDept": null,
                    "type": "职能部"
                },
                "role": {
                    "rid": 1,
                    "no": "R001",
                    "name": "游客"
                },
                "status": 0,
                "userPhoto": "/upload/Imag//2016/07/26/0/bd9f4736d3334afd87318c5c24fe6c44.jpg"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` pageUserInfo

分页方式获取员工信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 员工信息列表 , 每条数据类型 `userInfo`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "uiid": 1,
                "user": {
                    "uid": 1,
                    "userId": "U001",
                    "oldUserId": "U001",
                    "userName": "员工",
                    "currentName": "员工",
                    "identity": "000000000000000000",
                    "phone": "138xxxx3874",
                    "company": 0,
                    "duty": {
                        "did": 1,
                        "name": "设计师",
                        "departmentType": {
                            "dtid": 1,
                            "name": "设计"
                        },
                        "lead": 0
                    },
                    "dept": {
                        "did": 250,
                        "no": "D001",
                        "name": "设计部",
                        "fatherDept": null,
                        "type": "职能部"
                    },
                    "role": {
                        "rid": 1,
                        "no": "R001",
                        "name": "游客"
                    },
                    "status": 0,
                    "userPhoto": "/upload/Imag//2016/07/26/0/bd9f4736d3334afd87318c5c24fe6c44.jpg"
                },

                "level": 0,

                "gender": 1,
                "age": 28,
                "birthday": "2016-01-01",
                "height": 180,
                "weight": 60,
                "political": 0,
                "nation": "汉",
                "hobby": "",
                "qq": "",
                "wechat": "",
                "email": "",

                "isMarried": 0,
                "isBirth": 0,
                "isHouseLoan": 0,
                "isCarLoan": 0,
                "isCarID": 0,
                "isPassID": 0,
                "isHMID": 0,
                "isTWID": 0,

                "householdType": 0,
                "hometownPlace": "沈阳",
                "hometownAddress": "",
                "address": "",
                "lover": "",
                "claner": "直系亲属",
                "clanerCom": "公司",
                "emergencyMan": "紧急联系人",
                "emergencyPhone": "电话",
                "fangliner": null,

                "firstTime": "2016-01-01",
                "entryTime": "2016-01-01",
                "employWay": 0,
                "employType": 0,
                "employTime": "2016-01-01",
                "recommendMan": "推荐人",
                "jobYears": 0,
                "serviceYears": 0,

                "isPresentGraduate": 0,
                "graduateTime": "2016-01-01",
                "school": "",
                "education": 0,
                "specialty": "",

                "isContract": 0,
                "signTime": "2016-01-01",
                "eignTime": "2016-01-01",
                "fignTime": "2016-01-01",
                "signNum": 0,
                "preformNum": 90,
                "formTime": "2016-01-01",

                "isInsurance": 0,
                "insuranceType": 0,
                "insuranceTime": "2016-01-01",
                "pensionNum": "",
                "medicalNum": "",
                "publicNum": "",

                "palary": 0,
                "salary": 0,
                "bank": "",
                "bankCardNum": "",
                "comment": ""
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryUserByLoginId

通过登录帐号获取员工信息

判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

**Requests:**

- `user.loginId` (String): 登陆帐号

```json
{
    "user.loginId": "yuangong"
}
```

**Returns:**

- `user` (object): 员工信息 , 类型 `user`

```json
{
    ...
    "user": {
        "uid": 34,
        "userId": "U001",
        "oldUserId": "U001",
        "userName": "员工",
        "currentName": "员工",
        "identity": "000000000000000000",
        "phone": "138xxxx3874",
        "company": 0,
        "duty": {
            "did": 1,
            "name": "设计师",
            "departmentType": {
                "dtid": 1,
                "name": "设计"
            },
            "lead": 0
        },
        "dept": {
            "did": 250,
            "no": "D001",
            "name": "设计部",
            "fatherDept": null,
            "type": "职能部"
        },
        "role": {
            "rid": 1,
            "no": "R001",
            "name": "游客"
        },
        "status": 0,
        "userPhoto": "/upload/Imag//2016/07/26/0/bd9f4736d3334afd87318c5c24fe6c44.jpg"
    }
    ...
}
```


##### `查询` queryUserByUserId

获取指定用户编号对应的用户信息

判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

获取人员同时获取公司名称信息

**Requests:**

- `user.userId` (String): 员工编号

```json
{
    "user.userId": "U001"
}
```

**Returns:**

- `user` (object): 员工信息 , 类型 `user`

```json
{
    ...
    "user": {
        "uid": 34,
        "userId": "U001",
        "oldUserId": "U001",
        "userName": "员工",
        "currentName": "员工",
        "identity": "000000000000000000",
        "phone": "138xxxx3874",
        "company": 0,
        "duty": {
            "did": 1,
            "name": "设计师",
            "departmentType": {
                "dtid": 1,
                "name": "设计"
            },
            "lead": 0
        },
        "dept": {
            "did": 250,
            "no": "D001",
            "name": "设计部",
            "fatherDept": null,
            "type": "职能部"
        },
        "role": {
            "rid": 1,
            "no": "R001",
            "name": "游客"
        },
        "status": 0,
        "userPhoto": "/upload/Imag//2016/07/26/0/bd9f4736d3334afd87318c5c24fe6c44.jpg"
    }
    ...
}
```


##### `查询` queryUserInfoByUserId

获取指定用户编号对应的用户信息

判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

获取人员同时获取公司名称信息

**Requests:**

- `userInfo.user.userId` (String): 员工编号

```json
{
    "userInfo.user.userId": "U001"
}
```

**Returns:**

- `userInfo` (object): 员工信息 , 类型 `userInfo`

```json
{
    ...
    "userInfo": {
        "uiid": 32,
        "user": {
            "uid": 34,
            "userId": "U001",
            "oldUserId": "U001",
            "userName": "员工",
            "currentName": "员工",
            "identity": "000000000000000000",
            "phone": "138xxxx3874",
            "company": 0,
            "duty": {
                "did": 1,
                "name": "设计师",
                "departmentType": {
                    "dtid": 1,
                    "name": "设计"
                },
                "lead": 0
            },
            "dept": {
                "did": 250,
                "no": "D001",
                "name": "设计部",
                "fatherDept": null,
                "type": "职能部"
            },
            "role": {
                "rid": 1,
                "no": "R001",
                "name": "游客"
            },
            "status": 0,
            "userPhoto": "/upload/Imag//2016/07/26/0/bd9f4736d3334afd87318c5c24fe6c44.jpg"
        },

        "level": 0,

        "gender": 1,
        "age": 28,
        "birthday": "2016-01-01",
        "height": 180,
        "weight": 60,
        "political": 0,
        "nation": "汉",
        "hobby": "",
        "qq": "",
        "wechat": "",
        "email": "",

        "isMarried": 0,
        "isBirth": 0,
        "isHouseLoan": 0,
        "isCarLoan": 0,
        "isCarID": 0,
        "isPassID": 0,
        "isHMID": 0,
        "isTWID": 0,

        "householdType": 0,
        "hometownPlace": "沈阳",
        "hometownAddress": "",
        "address": "",
        "lover": "",
        "claner": "直系亲属",
        "clanerCom": "公司",
        "emergencyMan": "紧急联系人",
        "emergencyPhone": "电话",
        "fangliner": null,

        "firstTime": "2016-01-01",
        "entryTime": "2016-01-01",
        "employWay": 0,
        "employType": 0,
        "employTime": "2016-01-01",
        "recommendMan": "推荐人",
        "jobYears": 0,
        "serviceYears": 0,

        "isPresentGraduate": 0,
        "graduateTime": "2016-01-01",
        "school": "",
        "education": 0,
        "specialty": "",

        "isContract": 0,
        "signTime": "2016-01-01",
        "eignTime": "2016-01-01",
        "fignTime": "2016-01-01",
        "signNum": 0,
        "preformNum": 90,
        "formTime": "2016-01-01",

        "isInsurance": 0,
        "insuranceType": 0,
        "insuranceTime": "2016-01-01",
        "pensionNum": "",
        "medicalNum": "",
        "publicNum": "",

        "palary": 0,
        "salary": 0,
        "bank": "",
        "bankCardNum": "",
        "comment": ""
    }
    ...
}
```


##### `查询` queryUserForSelfByUserId

获取当前登陆员工信息

判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

获取人员同时获取公司名称信息

**Returns:**

- `user` (object): 员工信息 , 类型 `user`

```json
{
    ...
    "user": {
        "uid": 34,
        "userId": "U001",
        "oldUserId": "U001",
        "userName": "员工",
        "currentName": "员工",
        "identity": "000000000000000000",
        "phone": "138xxxx3874",
        "company": 0,
        "duty": {
            "did": 1,
            "name": "设计师",
            "departmentType": {
                "dtid": 1,
                "name": "设计"
            },
            "lead": 0
        },
        "dept": {
            "did": 250,
            "no": "D001",
            "name": "设计部",
            "fatherDept": null,
            "type": "职能部"
        },
        "role": {
            "rid": 1,
            "no": "R001",
            "name": "游客"
        },
        "status": 0,
        "userPhoto": "/upload/Imag//2016/07/26/0/bd9f4736d3334afd87318c5c24fe6c44.jpg"
    }
    ...
}
```


##### `查询` queryUserByOldUserId

通过旧员工编号获取员工信息

判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

**Requests:**

- `user.oldUserId` (String): 旧员工编号

```json
{
    "user.oldUserId": "yuangong"
}
```

**Returns:**

- `user` (object): 员工信息 , 类型 `user`

```json
{
    ...
    "user": {
        "uid": 34,
        "userId": "U001",
        "oldUserId": "U001",
        "userName": "员工",
        "currentName": "员工",
        "identity": "000000000000000000",
        "phone": "138xxxx3874",
        "company": 0,
        "duty": {
            "did": 1,
            "name": "设计师",
            "departmentType": {
                "dtid": 1,
                "name": "设计"
            },
            "lead": 0
        },
        "dept": {
            "did": 250,
            "no": "D001",
            "name": "设计部",
            "fatherDept": null,
            "type": "职能部"
        },
        "role": {
            "rid": 1,
            "no": "R001",
            "name": "游客"
        },
        "status": 0,
        "userPhoto": "/upload/Imag//2016/07/26/0/bd9f4736d3334afd87318c5c24fe6c44.jpg"
    }
    ...
}
```


##### `查询` queryUserByPinyin

通过员工名拼音获取员工名以及员工编号信息

通过pinyin筛选的字段包括 , pinyin/currentName/userId

**Requests:**

- `pinyin` (String): 员工名拼音

```json
{
    "pinyin": "yuangong"
}
```

**Returns:**

- `autoFillKeyValue` (List): 键值列表 , 每条数据类型 `keyValue` , 键为员工编号 , 值为员工现用名
- `autoFillList` (List): 员工现用名列表 , 每条数据类型String

```json
{
    ...
    "autoFillKeyValue": [
        {
            "key": "U001",
            "value": "员工"
        }
    ],
    "autoFillList": [
        "员工"
    ],
    ...
}
```


##### `查询` queryUserByUids

通过员工ID列表获取员工信息

**Requests:**


```json
{
    "uids[0]": 1,
    "uids[1]": 2
}
```

**Returns:**

- `autoFillKeyValue` (List): 键值列表 , 每条数据类型 `keyValue` , 键为员工编号 , 值为员工现用名
- `autoFillList` (List): 员工现用名列表 , 每条数据类型String

```json
{
    ...
    "autoFillKeyValue": [
        {
            "key": "U001",
            "value": "员工"
        }
    ],
    "autoFillList": [
        "员工"
    ],
    ...
}
```


##### `创建` addUser

添加员工信息

判断公司信息是否存在 , 不存在 , 错误信息 **230015 公司不存在**

通过员工电话以及身份证信息判断是否存在 , 人员存在 , 错误信息 **190006 人员已存在**

判断人员归属部门是否存在上级部门 , 不存在不可添加人员 , 错误信息 **310002 部门不可添加人员**

如果部门是否定岗为1(定岗) , 同时定岗信息不存在 , 错误信息 **130050 定岗信息不存在**

根据部门和职位判断定岗信息 , 人员数量达到定岗上限 , 错误信息 **190011 人员数量已达上限**

添加人员默认角色信息是否存在 , 不存在 , 错误信息 **角色不存在**

生成工作经历信息 , 类型为入职 , 同时记录公司 , 部门 , 职位

**Requests:**

- `userInfo.user.loginId` (String): 登陆帐号
- `userInfo.user.oldUserId` (String): 旧员工编号
- `userInfo.user.userName` (String): 用户名
- `userInfo.user.currentName` (String): 现用名
- `userInfo.user.status` (Short): 状态
- `userInfo.user.identity` (String): 身份证号
- `userInfo.user.phone` (String): 手机号
- `userInfo.user.duty.did` (Long): 职位ID
- `userInfo.user.role.rid` (Long): 角色ID
- `userInfo.user.dept.did` (Long): 部门ID
- `userInfo.gender` (Short): 性别
- `userInfo.age` (Integer): 年龄
- `userInfo.birthday` (Timestamp): 出生日期
- `userInfo.height` (Integer): 身高
- `userInfo.weight` (Integer): 体重
- `userInfo.political` (Short): 政治面貌
- `userInfo.nation` (String): 民族
- `userInfo.hobby` (String): 爱好/特长
- `userInfo.qq` (String): QQ
- `userInfo.wechat` (String): 微信
- `userInfo.email` (String): 邮件
- `userInfo.isMarried` (Short): 婚姻状况
- `userInfo.isBirth` (Short): 生育状况
- `userInfo.isHouseLoan` (Short): 是否有房贷
- `userInfo.isCarLoan` (Short): 是否有车贷
- `userInfo.isCarID` (Short): 是否有驾照
- `userInfo.isPassID` (Short): 是否有护照
- `userInfo.isHMID` (Short): 是否有港澳通行证
- `userInfo.isTWID` (Short): 是否有台湾通行证
- `userInfo.householdType` (Short): 户籍类型
- `userInfo.hometownPlace` (String): 户籍地
- `userInfo.hometownAddress` (String): 户籍地址
- `userInfo.address` (String): 现住址
- `userInfo.claner` (String): 直系亲属
- `userInfo.clanerCom` (String): 直系亲属公司
- `userInfo.emergencyMan` (String): 紧急联系人
- `userInfo.emergencyPhone` (String): 紧急联系人电话
- `userInfo.fangliner.uid` (Long): 方林家属
- `userInfo.firstTime` (Timestamp): 入司时间
- `userInfo.entryTime` (Timestamp): 入职时间
- `userInfo.employWay` (Short): 招聘类型
- `userInfo.recommendMan` (String): 推荐人
- `userInfo.jobYears` (Integer): 司龄
- `userInfo.employType` (Short): 招聘类型
- `userInfo.employTime` (Timestamp): 招聘时间
- `userInfo.serviceYears` (Integer): 服务年限
- `userInfo.isPresentGraduate` (Short): 是否应届
- `userInfo.graduateTime` (Timestamp): 毕业时间
- `userInfo.school` (String): 毕业院校
- `userInfo.education` (Short): 学历
- `userInfo.specialty` (String): 专业
- `userInfo.isContract` (Short): 是否签劳动合同
- `userInfo.signTime` (Timestamp): 签合同日期
- `userInfo.eignTime` (Timestamp): 合同结束日期
- `userInfo.fignTime` (Timestamp): 首次合同日期
- `userInfo.signNum` (Integer): 续签合同次数
- `userInfo.preformNum` (Integer): 试用期限
- `userInfo.formTime` (Timestamp): 转正日期
- `userInfo.isInsurance` (Short): 是否上保险
- `userInfo.insuranceType` (Short): 保险类型
- `userInfo.insuranceTime` (Timestamp): 参保日期
- `userInfo.pensionNum` (String): 养老编号
- `userInfo.medicalNum` (String): 医疗编号
- `userInfo.publicNum` (String): 公积金号
- `userInfo.palary` (Integer): 试用工资
- `userInfo.salary` (Integer): 工资
- `userInfo.bank` (String): 开户行
- `userInfo.bankCardNum` (String): 银行卡号
- `userInfo.comment` (String): 备注
- `userEducations` (List): 教育信息列表 , 每条数据类型 [userEducation ](./user.html#api.personel.UserOperationAction.userOperation)
- `userContracts` (List): 合同信息列表 , 每条数据类型 [userEducation ](./user.html#api.personel.UserEducationAction.userEducation)
- `userOperations` (List): 公司信息列表 , 每条数据类型 [userOperation ](./user.html#api.personel.UserOperationAction.userOperation)

```json
{
    "userInfo.user.loginId": "yuangong",
    "userInfo.user.oldUserId": "U001",
    "userInfo.user.userName": "员工",
    "userInfo.user.currentName": "员工",
    "userInfo.user.status": 0,
    "userInfo.user.identity": "000000000000000000",
    "userInfo.user.phone": "13888888888",

    "userInfo.user.duty.did": 1,
    "userInfo.user.dept.did": 1,
    "userInfo.user.role.rid": 1,

    "userInfo.level": 0,

    "userInfo.gender": 1,
    "userInfo.age": 28,
    "userInfo.birthday": "2016-01-01",
    "userInfo.height": 180,
    "userInfo.weight": 60,
    "userInfo.political": 0,
    "userInfo.nation": "汉",
    "userInfo.hobby": "",
    "userInfo.qq": "",
    "userInfo.wechat": "",
    "userInfo.email": "",

    "userInfo.isMarried": 0,
    "userInfo.isBirth": 0,
    "userInfo.isHouseLoan": 0,
    "userInfo.isCarLoan": 0,
    "userInfo.isCarID": 0,
    "userInfo.isPassID": 0,
    "userInfo.isHMID": 0,
    "userInfo.isTWID": 0,

    "userInfo.householdType": 0,
    "userInfo.hometownPlace": "",
    "userInfo.hometownAddress": "",
    "userInfo.address": "",
    "userInfo.lover": "",
    "userInfo.claner": "直系亲属",
    "userInfo.clanerCom": "公司",
    "userInfo.emergencyMan": "紧急联系人",
    "userInfo.emergencyPhone": "电话",
    "userInfo.fangliner": null,

    "userInfo.firstTime": "2016-01-01",
    "userInfo.entryTime": "2016-01-01",
    "userInfo.employWay": 0,
    "userInfo.employType": 0,
    "userInfo.employTime": "2016-01-01",
    "userInfo.recommendMan": "推荐人",
    "userInfo.jobYears": 0,
    "userInfo.serviceYears": 0,

    "userInfo.isPresentGraduate": 0,
    "userInfo.graduateTime": "2016-01-01",
    "userInfo.school": "",
    "userInfo.education": 0,
    "userInfo.specialty": "",

    "userInfo.isContract": 0,
    "userInfo.signTime": "2016-01-01",
    "userInfo.eignTime": "2016-01-01",
    "userInfo.fignTime": "2016-01-01",
    "userInfo.signNum": 0,
    "userInfo.preformNum": 90,
    "userInfo.formTime": "2016-01-01",

    "userInfo.isInsurance": 0,
    "userInfo.insuranceType": 0,
    "userInfo.insuranceTime": "2016-01-01",
    "userInfo.pensionNum": "",
    "userInfo.medicalNum": "",
    "userInfo.publicNum": "",

    "userInfo.palary": 0,
    "userInfo.salary": 0,
    "userInfo.bank": "",
    "userInfo.bankCardNum": "",

    "userInfo.comment": ""

}
```


##### `创建` updateUser

更新员工信息

判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

判断人员归属部门是否存在上级部门 , 不存在不可添加人员 , 错误信息 **310002 部门不可添加人员**

生成工作经历信息 , 根据员工状态类型为调职/入职/离职 , 同时记录原部 , 现部 , 原职 , 现职

**Requests:**

- `userInfo.user.uid` (Long): 人员ID
- `userInfo.user.oldUserId` (String): 旧员工编号
- `userInfo.user.currentName` (String): 现用名
- `userInfo.user.status` (Short): 状态
- `userInfo.user.identity` (String): 身份证号
- `userInfo.user.phone` (String): 手机号
- `userInfo.user.duty.did` (Long): 职位ID
- `userInfo.user.role.rid` (Long): 角色ID
- `userInfo.user.dept.did` (Long): 部门ID
- `userInfo.gender` (Short): 性别
- `userInfo.age` (Integer): 年龄
- `userInfo.birthday` (Timestamp): 出生日期
- `userInfo.height` (Integer): 身高
- `userInfo.weight` (Integer): 体重
- `userInfo.political` (Short): 政治面貌
- `userInfo.nation` (String): 民族
- `userInfo.hobby` (String): 爱好/特长
- `userInfo.qq` (String): QQ
- `userInfo.wechat` (String): 微信
- `userInfo.email` (String): 邮件
- `userInfo.isMarried` (Short): 婚姻状况
- `userInfo.isBirth` (Short): 生育状况
- `userInfo.isHouseLoan` (Short): 是否有房贷
- `userInfo.isCarLoan` (Short): 是否有车贷
- `userInfo.isCarID` (Short): 是否有驾照
- `userInfo.isPassID` (Short): 是否有护照
- `userInfo.isHMID` (Short): 是否有港澳通行证
- `userInfo.isTWID` (Short): 是否有台湾通行证
- `userInfo.householdType` (Short): 户籍类型
- `userInfo.hometownPlace` (String): 户籍地址
- `userInfo.hometownAddress` (String): 户籍地址
- `userInfo.address` (String): 现住址
- `userInfo.claner` (String): 直系亲属
- `userInfo.clanerCom` (String): 直系亲属公司
- `userInfo.emergencyMan` (String): 紧急联系人
- `userInfo.emergencyPhone` (String): 紧急联系人电话
- `userInfo.fangliner.uid` (Long): 方林家属
- `userInfo.firstTime` (Timestamp): 入司时间
- `userInfo.entryTime` (Timestamp): 入职时间
- `userInfo.employWay` (Short): 招聘类型
- `userInfo.recommendMan` (String): 推荐人
- `userInfo.jobYears` (Integer): 司龄
- `userInfo.employType` (Short): 招聘类型
- `userInfo.employTime` (Timestamp): 招聘时间
- `userInfo.serviceYears` (Integer): 服务年限
- `userInfo.isPresentGraduate` (Short): 是否应届
- `userInfo.graduateTime` (Timestamp): 毕业时间
- `userInfo.school` (String): 毕业院校
- `userInfo.education` (Short): 学历
- `userInfo.specialty` (String): 专业
- `userInfo.isContract` (Short): 是否签劳动合同
- `userInfo.signTime` (Timestamp): 签合同日期
- `userInfo.eignTime` (Timestamp): 合同结束日期
- `userInfo.fignTime` (Timestamp): 首次合同日期
- `userInfo.signNum` (Integer): 续签合同次数
- `userInfo.preformNum` (Integer): 试用期限
- `userInfo.formTime` (Timestamp): 转正日期
- `userInfo.isInsurance` (Short): 是否上保险
- `userInfo.insuranceType` (Short): 保险类型
- `userInfo.insuranceTime` (Timestamp): 参保日期
- `userInfo.pensionNum` (String): 养老编号
- `userInfo.medicalNum` (String): 医疗编号
- `userInfo.publicNum` (String): 公积金号
- `userInfo.palary` (Integer): 试用工资
- `userInfo.salary` (Integer): 工资
- `userInfo.bank` (String): 开户行
- `userInfo.bankCardNum` (String): 银行卡号
- `userInfo.comment` (String): 备注

```json
{

    "userInfo.user.uid": 1,
    "userInfo.user.oldUserId": "U001",
    "userInfo.user.currentName": "员工",
    "userInfo.user.status": 0,
    "userInfo.user.identity": "000000000000000000",
    "userInfo.user.phone": "13888888888",

    "userInfo.user.duty.did": 1,
    "userInfo.user.dept.did": 1,
    "userInfo.user.role.rid": 1,

    "userInfo.level": 0,

    "userInfo.gender": 1,
    "userInfo.age": 28,
    "userInfo.birthday": "2016-01-01",
    "userInfo.height": 180,
    "userInfo.weight": 60,
    "userInfo.political": 0,
    "userInfo.nation": "汉",
    "userInfo.hobby": "",
    "userInfo.qq": "",
    "userInfo.wechat": "",
    "userInfo.email": "",

    "userInfo.isMarried": 0,
    "userInfo.isBirth": 0,
    "userInfo.isHouseLoan": 0,
    "userInfo.isCarLoan": 0,
    "userInfo.isCarID": 0,
    "userInfo.isPassID": 0,
    "userInfo.isHMID": 0,
    "userInfo.isTWID": 0,

    "userInfo.householdType": 0,
    "userInfo.hometownPlace": "",
    "userInfo.hometownAddress": "",
    "userInfo.address": "",
    "userInfo.lover": "",
    "userInfo.claner": "直系亲属",
    "userInfo.clanerCom": "公司",
    "userInfo.emergencyMan": "紧急联系人",
    "userInfo.emergencyPhone": "电话",
    "userInfo.fangliner": null,

    "userInfo.firstTime": "2016-01-01",
    "userInfo.entryTime": "2016-01-01",
    "userInfo.employWay": 0,
    "userInfo.employType": 0,
    "userInfo.employTime": "2016-01-01",
    "userInfo.recommendMan": "推荐人",
    "userInfo.jobYears": 0,
    "userInfo.serviceYears": 0,

    "userInfo.isPresentGraduate": 0,
    "userInfo.graduateTime": "2016-01-01",
    "userInfo.school": "",
    "userInfo.education": 0,
    "userInfo.specialty": "",

    "userInfo.isContract": 0,
    "userInfo.signTime": "2016-01-01",
    "userInfo.eignTime": "2016-01-01",
    "userInfo.fignTime": "2016-01-01",
    "userInfo.signNum": 0,
    "userInfo.preformNum": 90,
    "userInfo.formTime": "2016-01-01",

    "userInfo.isInsurance": 0,
    "userInfo.insuranceType": 0,
    "userInfo.insuranceTime": "2016-01-01",
    "userInfo.pensionNum": "",
    "userInfo.medicalNum": "",
    "userInfo.publicNum": "",

    "userInfo.palary": 0,
    "userInfo.salary": 0,
    "userInfo.bank": "",
    "userInfo.bankCardNum": "",

    "userInfo.comment": ""

    "userInfo.user.userId": "U001",
    "userInfo.user.oldUserId": "U001",
    "userInfo.user.userName": "员工",
    "userInfo.user.currentName": "员工",
    "userInfo.user.userNamePinYin": "[yuangong]",
    "userInfo.user.status": "在职",
    "userInfo.user.birthday": "2016-06-01",
    "userInfo.user.deptType": "职能部",
    "userInfo.user.duty.did": 1,
    "userInfo.user.gender": "男",
    "userInfo.user.identity": "000000000000000000",
    "userInfo.user.dept.no": "D001",
    "userInfo.user.role.no": "R001",

    "userInfo.address": "",
    "userInfo.age": 28,
    "userInfo.bank": "bank",
    "userInfo.bankCardNum": "0000000000000000",
    "userInfo.education": "",
    "userInfo.email": "",
    "userInfo.emergencyMan": "员工",
    "userInfo.emergencyPhone": "138xxxx3874",
    "userInfo.employTime": "2016-06-01",
    "userInfo.employType": "正式",
    "userInfo.employWay": "员工推荐",
    "userInfo.entryTime": "2016-06-01",
    "userInfo.extranet": 0,
    "userInfo.graduateTime": "2016-06-01",
    "userInfo.hometownPlace": "",
    "userInfo.hometownAddress": "",
    "userInfo.houseType": "",
    "userInfo.householdType": "城市户口",
    "userInfo.insuranceTime": "2015-01-01",
    "userInfo.isBirth": "是",
    "userInfo.isCarLoan": "否",
    "userInfo.isContract": "是",
    "userInfo.isHouseLoan": "是",
    "userInfo.isInsurance": "是",
    "userInfo.isLogin": 3,
    "userInfo.isMarried": "是",
    "userInfo.isPresentGraduate": "否",
    "userInfo.jobYears": 0,
    "userInfo.lover": "员工",
    "userInfo.medicalNum": "",
    "userInfo.pensionNum": "",
    "userInfo.phone": "138xxxx3874",
    "userInfo.political": "群众",
    "userInfo.qq": "",
    "userInfo.recommendMan": "员工",
    "userInfo.salary": 1000,
    "userInfo.school": "",
    "userInfo.serviceYears": 0,
    "userInfo.specialty": "",
    "userInfo.statusUpdateTime": "2016-01-01 00:00:00",
    "userInfo.wechat": ""
}
```


##### `创建` updateUserForBaseInfo

更新员工基本信息

判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

更新信息范围 , 年龄/QQ/微信号/邮箱/紧急联系人/紧急联系人电话/用户图片

**Requests:**

- `userInfo.user.uid` (String): 员工ID
- `userInfo.user.phone` (String): 手机号
- `userInfo.qq` (String): QQ
- `userInfo.wechat` (String): 微信
- `userInfo.email` (String): 邮箱
- `userInfo.emergencyMan` (String): 紧急联系人
- `userInfo.emergencyPhone` (String): 紧急联系人电话
- `userInfo.user.userPhoto` (String): 用户图片

```json
{
    "userInfo.user.userId": "U001",
    "userInfo.user.phone": "138xxxx3874",
    "userInfo.qq": "",
    "userInfo.wechat": "",
    "userInfo.email": "",
    "userInfo.emergencyMan": "员工",
    "userInfo.emergencyPhone": "",
    "userInfo.user.userPhoto": ""
}
```


##### `创建` updateUserForAdvance

更新用户高级信息

判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

判断更新角色与操作人员对应角色等级 , 如果后者小于前者 , 错误信息 **-1 误操作权限**

生成工作经历信息 , 类型为调公司 , 记录信息为原公司 , 现公司

**Requests:**

- `user.userId` (String): 员工编号
- `user.isLogin` (Short): 是否允许登陆 , 0: 不能登陆 , 1: 允许登陆
- `user.company` (Short): 公司代码
- `user.extranet` (Short): 外网权限
- `user.role.no` (String): 角色编号

```json
{
    "user.userId": "U001",
    "user.isLogin": 0,
    "user.company": 45854521,
    "user.extranet": 0,
    "user.role.no": "R001"
}
```


##### `创建` updateUserForProfile

更新用户简介信息

判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

**Requests:**

- `user.userId` (String): 员工编号

```json
{
    "user.userId": "U001"
}
```


##### `创建` updateUserForPhoto

更新用户图片信息

判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

**Requests:**

- `user.userId` (String): 员工编号
- `user.photo` (String): 头像
- `user.identityPathF` (String): 身份证正面照
- `user.identityPathB` (String): 身份证背面照

```json
{
    "user.userId": "U001",
    "user.photo": "",
    "user.userId": "",
    "user.userId": "",
}
```


##### `创建` quitUser

离职

判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

**Requests:**

- `user.userId` (String): 员工编号

```json
{
    "user.userId": "U001"
}
```


##### `创建` tranUser

调职

判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

**Requests:**

- `user.userId` (String): 员工编号
- `user.dept.did` (Long): 员工编号
- `user.company` (Integer): 公司

```json
{
    "user.userId": "U001"
    "user.dept.did": 1
    "user.company": 1
}
```


##### `创建` defaultPassword

重置密码

判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

利用系统配置中的默认密码更新人员的密码信息

**Requests:**

- `user.userId` (String): 员工编号

```json
{
    "user.userId": "U001"
}
```


##### `创建` resetPassword

重置密码

判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

随机生成密码更新人员的密码信息 , 同时进行通知

**Requests:**

- `user.userId` (String): 员工编号

```json
{
    "user.userId": "U001"
}
```


##### `创建` changePassword

修改密码

判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

验证原密码 , 更新新密码

**Requests:**

- `user.userId` (String): 员工编号
- `user.password` (String): 原密码
- `user.rePassword` (String): 新密码

```json
{
    "user.userId": "U001"
    "user.password": "password",
    "user.rePassword": "rePassword"
}
```


##### `创建` registUser

注册

判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

**Requests:**

- `user.uid` (Long): 人员ID

```json
{
    "user.uid": 1
}
```


##### `创建` resetUser

重置

判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

**Requests:**

- `user.uid` (Long): 人员ID

```json
{
    "user.uid": 1
}
```


##### `创建` authUser

认证

判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

**Requests:**

- `user.uid` (Long): 人员ID

```json
{
    "user.uid": 1
}
```


##### `创建` confirmUser

确认

判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

**Requests:**

- `user.uid` (Long): 人员ID

```json
{
    "user.uid": 1
}
```


##### `创建` signateUser

签名

判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

**Requests:**

- `user.uid` (Long): 人员ID

```json
{
    "user.uid": 1
}
```

### 合同


员工合同信息管理


> **类**: `api.personel.UserContractAction`


#### 数据类型: `userContract`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ucid` | 合同ID | Long |
| `uid` | 员工ID | Long |
| `no` | 合同编号 | String |
| `name` | 名称 | String |
| `title` | 标题 | 标题 |
| `signTime` | 签订时间 | Timestamp |
| `startTime` | 开始时间 | Timestamp |
| `endTime` | 结束时间 | Timestamp |
| `download` | 下载地址 | String |
| `viewpdf` | 查看地址 | String |
| `filesize` | 文件大小 | Integer |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `signner` | 签署人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `comsignTime` | 公司签时间 | Timestamp |
| `cussignTime` | 客户签时间 | Timestamp |
| `status` | 状态 , 0: 初始 , 1: 无效 , 2: 已签 , 3: 归档 , 4: 归档(本地) | Short |
| `comment` | 说明 | String |


##### `查询` queryUserContract

获取人员合同信息

**Requests:**

- `userContract.uid` (Long): 人员ID

```json
{
    "userContract.uid": 1
}
```

**Returns:**

- `userContracts` (List): 员工合同列表 , 每条数据类型 `userContract`

```json
{
    ...
    "userContracts": [
        {
            "ucid": 0,
            "uid": 1,
            "no": "ESCASD",
            "name": "合同名称",
            "title": "合同标题"
            "signTime": "2016-01-01 00:00:00",
            "startTime": "2016-01-01 00:00:00",
            "endTime": "2016-01-01 00:00:00",
            "viewpdf": "JKLSHFD213J12GH312U32.pdf",
            "download": "JKLSHFD213J12GH312U32.pdf",
            "filesize": 0,
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
            "status": 0,
            "comment": "说明"
        }
    ],
    ...
}
```


##### `查询` sendUserContractForAuth

发送认证通知

判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**

**Requests:**

- `userContract.ucid` (Long): 合同ID

```json
{
    "userContract.ucid": 1
}
```


##### `查询` sendUserContract

发送合同通知

通过不同类型的控制 , 统一的跳转页面来判断当前通知合同的状态是否符合操作

判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**

**Requests:**

- `userContract.ucid` (Long): 合同ID
- `userContract.type` (Short): 类型 , 1: 签章, 2: 签订, 3: 查看 , 4: 下载

```json
{
    "userContract.ucid": 1,
    "userContract.type": 1
}
```


##### `查询` redirectUserContract

跳转合同操作 , 根据发送合同通知的类型 , 响应对应功能的页面地址

类型包括1(签章)/2(签订)/3(查看)/4(下载)

判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**

**Requests:**

- `userContract.ucid` (Long): 合同ID

```json
{
    "userContract.ucid": 1
}
```

**Returns:**

- `redirect` (String): 跳转地址

```json
{
    ...
    "redirect": "http://redirect.com/redirect.html?type=view",
    ...
}
```


##### `查询` viewUserContract

查看合同

判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**

**Requests:**

- `userContract.ucid` (Long): 合同ID

```json
{
    "userContract.ucid": 1
}
```

**Returns:**

- `redirect` (String): 跳转地址

```json
{
    ...
    "redirect": "http://redirect.com/redirect.html?type=view",
    ...
}
```


##### `查询` signUserContractForCompany

签订合同 , 针对公司信息

判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**

判断签章是否存在 , 不存在 , 错误信息 **130045 签章不存在**

判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **190029 合同不可操作**

**Requests:**

- `userContract.ucid` (Long): 合同ID
- `signet.signno` (String): 签章编号
- `signet.keyword` (String): 关键字
- `signet.signid` (Long): 印章ID

```json
{
    "userContract.ucid": 1,
    "signet.signno": "IN31HJOS",
    "signet.keyword": "关键字",
    "signet.signid": 1
}
```


##### `查询` signUserContractForUser

签订合同 , 针对员工信息

判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**

判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **190029 合同不可操作**

**Requests:**

- `userContract.ucid` (Long): 合同ID

```json
{
    "userContract.ucid": 1
}
```

**Returns:**

- `redirect` (String): 跳转地址

```json
{
    ...
    "redirect": "http://redirect.com/redirect.html?type=sign",
    ...
}
```


##### `创建` addUserContract

添加用户合同信息

**Requests:**

- `userContract.uid` (Long): 人员ID
- `userContract.no` (String): 编号
- `userContract.name` (String): 名称
- `userContract.signTime` (Timestamp): 签订时间
- `userContract.beginTime` (Timestamp): 开始时间
- `userContract.endTime` (Timestamp): 结束时间
- `userContract.comment` (String): 说明
- `contract.cid` (Long): 合同ID
- `contract.no` (String): 合同编号
- `contract.name` (String): 名称
- `contract.title` (String): 标题

```json
{
    "userContract.uid": 1,
    "userContract.no": "ESAEASDF",
    "userContract.name": "合同名称",
    "userContract.signTime": "2016-01-01 00:00:00",
    "userContract.beginTime": "2016-01-01 00:00:00",
    "userContract.endTime": "2016-01-01 00:00:00",
    "userContract.comment": "",

    "contract.cid": 1,
    "contract.no": "74HENIDH121H",
    "contract.name": "合同模版",
    "contract.title": "合同标题",
}
```


##### `创建` updateUserContract

更新用户合同信息

**Requests:**

- `userContract.ucid` (Long): 合同ID
- `userContract.comment` (String): 说明

```json
{
    "userContract.ucid": 1,
    "userContract.comment": ""
}
```


##### `查询` affixUserContract

签订合同

判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**

判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **190029 合同不可操作**

更新装修合同为1(已签)

**Requests:**

- `userContract.ucid` (Long): 合同ID

```json
{
    "userContract.ucid": 1
}
```


##### `查询` expireUserContract

失效合同

判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**

判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **190029 合同不可操作**

更新装修合同为1(失效)

**Requests:**

- `userContract.ucid` (Long): 合同ID

```json
{
    "userContract.ucid": 1
}
```


##### `查询` filingUserContract

归档合同

判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**

判断合同状态是否为2(已签) , 其他状态不可操作 , 错误信息 **140068 合同不可操作**

更新装修合同为3(归档)

**Requests:**

- `userContract.ucid` (Long): 合同ID

```json
{
    "userContract.ucid": 1
}
```


##### `创建` deleteUserContract

删除合同

判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**

判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **140068 合同不可操作**

**Requests:**

- `userContract.ucid` (Long): 合同ID

```json
{
    "userContract.ucid: 1
}
```

### 经历


员工工作经历信息管理


> **类**: `api.personel.UserExperienceAction`


#### 数据类型: `userExperience`

| 参数 | 说明 | 类型 |
|------|------|------|
| `upid` | 工作经历ID | Long |
| `uid` | 用户编号 | Integer |
| `type` | 类型 , 包括: 调职 , 入职 , 离职 | String |
| `operator` | 操作人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `operateTime` | 操作时间 | Timestamp |
| `comment` | 描述 | String |


##### `查询` queryUserExperienceByUid

通过员工ID获取员工工经历

判断人员是否存在 , 不存在 , 错误信息 **190005 人员不存在**

**Requests:**

- `userExperience.uid` (Integer): 员工ID

```json
{
    "userExperience.uid": 1
}
```

**Returns:**

- `userExperiences` (List): 员工经历列表 , 每条数据类型 `userExperience`

```json
{
    ...
    "data": [
        {
            "upid": 1,
            "uid": 1,
            "type": "调职",
            "operator": {
                "uid": 1,
                "userId": "U0203",
                "userName": "王宁",
                "currentName": "王宁",
                "phone": "136xxxx1453",
                ...
            },
            "createTime": "2016-01-01 00:00:00",
            "operateTime": "2016-01-01 00:00:00",
            "comment": ""
        }
    ],
    ...
}
```


##### `查询` updateUserExperience

更新工作经历信息

**Requests:**

- `userExperience.ueid` (Long): 工作经历ID
- `userExperience.operateTime` (Long): 操作时间

```json
{
    "userExperience.ueid": 1,
    "userExperience.operateTime": "2016-01-01 00:00:00"
}
```

### 工作


员工工作信息管理


> **类**: `api.personel.UserOperationAction`


#### 数据类型: `userOperation`

| 参数 | 说明 | 类型 |
|------|------|------|
| `uoid` | 工作ID | Long |
| `uid` | 用户ID | Long |
| `company` | 公司 | String |
| `trade` | 行业 | String |
| `duty` | 职位 | String |
| `beginTime` | 开始时间 | Timestamp |
| `endTime` | 结束时间 | Timestamp |
| `salary` | 薪资 | Long |
| `createTime` | 创建时间 | String |
| `comment` | 描述 | String |


##### `查询` queryUserOperation

获取人员工作

**Requests:**

- `userOperation.uid` (Long): 人员ID

```json
{
    "userOperation.uid": 1
}
```

**Returns:**

- `userOperations` (List): 工作信息列表 , 每条数据类型 `userOperation`

```json
{
    ...
    "userOperations": [
        {
            "uoid": 1,
            "uid": 1,
            "company": "公司名称",
            "trade": "公司行业",
            "duty": "职位",
            "beginTime": "2016-01-01 00:00:00",
            "endTime": "2016-01-01 00:00:00",
            "salary": 0,
            "createTime": "2016-01-01 00:00:00",
            "comment": ""
        }
    ],
    ...
}
```


##### `创建` addUserOperation

添加人员工作

**Requests:**

- `userOperation.uid` (Long): 人员ID
- `userOperation.company` (String): 公司
- `userOperation.trade` (String): 行业
- `userOperation.duty` (String): 职位
- `userOperation.beginTime` (Timestamp): 开始时间
- `userOperation.endTime` (Timestamp): 公司
- `userOperation.salary` (Long): 薪资
- `userOperation.comment` (String): 说明

```json
{
    "userOperation.uid": 1,
    "userOperation.company": "公司名称",
    "userOperation.trade": "公司行业",
    "userOperation.duty": "职位",
    "userOperation.beginTime": "2016-01-01 00:00:00",
    "userOperation.endTime": "2016-01-01 00:00:00",
    "userOperation.salary": 0,
    "userOperation.comment": ""
}
```


##### `创建` updateUserOperation

添加人员工作

**Requests:**

- `userOperation.uoid` (Long): 工作ID
- `userOperation.company` (String): 公司
- `userOperation.trade` (String): 行业
- `userOperation.duty` (String): 职位
- `userOperation.beginTime` (Timestamp): 开始时间
- `userOperation.endTime` (Timestamp): 公司
- `userOperation.salary` (Long): 薪资
- `userOperation.comment` (String): 说明

```json
{
    "userOperation.uoid": 1,
    "userOperation.company": "公司名称",
    "userOperation.trade": "公司行业",
    "userOperation.duty": "职位",
    "userOperation.beginTime": "2016-01-01 00:00:00",
    "userOperation.endTime": "2016-01-01 00:00:00",
    "userOperation.salary": 0,
    "userOperation.comment": ""
}
```


##### `创建` deleteUserOperation

删除人员工作

**Requests:**

- `userOperation.uoid` (Long): 工作ID

```json
{
    "userOperation.uoid": 1
}
```

### 教育


> **类**: `api.personel.UserEducationAction`


#### 数据类型: `userEducation`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ueid` | 教育ID | Long |
| `uid` | 人员ID | Long |
| `organ` | 机构 | String |
| `certificate` | 证书 | String |
| `beginTime` | 开始时间 | Timestamp |
| `endTime` | 结束时间 | Timestamp |
| `createTime` | 创建时间 | String |
| `specialty` | 专业 | String |
| `content` | 内容 | String |


##### `查询` queryUserEducation

获取人员教育信息

**Requests:**

- `userEducation.uid` (Long): 人员ID

```json
{
    "userEducation.uid": 1
}
```

**Returns:**

- `userEducations` (List): 教育信息列表 , 每条数据类型 `userEducation`

```json
{
    ...
    "userEducations": [
        {
            "ueid": 1,
            "uid": 1,
            "organ": "机构名称",
            "certificate": "证书",
            "beginTime": "2016-01-01 00:00:00",
            "endTime": "2016-01-01 00:00:00",
            "createTime": "2016-01-01 00:00:00",
            "specialty": "专业",
            "content": ""
        }
    ],
    ...
}
```


##### `创建` addUserEducation

添加人员教育信息

**Requests:**

- `userEducation.uid` (Long): 人员ID
- `userEducation.organ` (String): 机构
- `userEducation.certificate` (String): 证书
- `userEducation.beginTime` (Timestamp): 开始时间
- `userEducation.endTime` (Timestamp): 公司
- `userEducation.specialty` (String): 专业
- `userEducation.content` (String): 内容

```json
{
    "userEducation.uid": 1,
    "userEducation.organ": "机构名称",
    "userEducation.certificate": "证书",
    "userEducation.beginTime": "2016-01-01 00:00:00",
    "userEducation.endTime": "2016-01-01 00:00:00",
    "userEducation.specialty": "专业",
    "userEducation.content": ""
}
```


##### `创建` updateUserEducation

更新人员教育信息

**Requests:**

- `userEducation.ueid` (Long): 教育ID
- `userEducation.organ` (String): 机构
- `userEducation.certificate` (String): 证书
- `userEducation.beginTime` (Timestamp): 开始时间
- `userEducation.endTime` (Timestamp): 公司
- `userEducation.specialty` (String): 专业
- `userEducation.content` (String): 内容

```json
{
    "userEducation.ueid": 1,
    "userEducation.organ": "机构名称",
    "userEducation.certificate": "证书",
    "userEducation.beginTime": "2016-01-01 00:00:00",
    "userEducation.endTime": "2016-01-01 00:00:00",
    "userEducation.specialty": "专业",
    "userEducation.content": ""
}
```


##### `创建` deleteUserEducation

更新人员教育信息

**Requests:**

- `userEducation.ueid` (Long): 教育ID

```json
{
    "userEducation.ueid": 1
}
```

### 公司


人员对应可操作公司权限


> **类**: `api.personel.UserCompanyAction`


#### 数据类型: `userCompany`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ucid` | ID | Integer |
| `uid` | 员工ID | Integer |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |
| `company` | 公司 , 类型 [company ](./system.html#api.system.CompanyAction.company) | Object |


##### `查询` queryUserCompany

通过员工ID获取对应操作公司信息

**Requests:**

- `user.uid` (Integer): 员工ID

```json
{
    "user.uid": 1
}
```

**Returns:**

- `userCompanys` (List): 员工-公司信息列表 , 每条数据类型 `userCompany`

```json
{
    ...
    "userCompanys": [
        {
            "ucid": 1,
            "uid": 1,
            "company": {
                "cid": "LAKDSAUFEJNSDAIDUF",
                "name": "公司"
            },
            "creater": {
                "uid": 1,
                "userId": "U0203",
                "userName": "王宁",
                "currentName": "王宁",
                "phone": "136xxxx1453",
                ...
            },
            "createTime": "2016-01-01 00:00:00",
        }
    ],
    ...
}
```


##### `查询` queryUserCompanyForSelf

获取当前操作人员公司信息

**Returns:**

- `userCompanys` (List): 员工-公司信息列表 , 每条数据类型 `userCompany`

```json
{
    ...
    "userCompanys": [
        {
            "ucid": 1,
            "uid": 1,
            "company": {
                "cid": "LAKDSAUFEJNSDAIDUF",
                "name": "公司"
            },
            "creater": {
                "uid": 1,
                "userId": "U0203",
                "userName": "王宁",
                "currentName": "王宁",
                "phone": "136xxxx1453",
                ...
            },
            "createTime": "2016-01-01 00:00:00",
        }
    ],
    ...
}
```


##### `创建` updateUserCompany

更新人员-公司信息

删除原有人员-公司信息 , 更新新配置人员-公司信息

**Requests:**

- `user.uid` (Integer): 员工ID

```json
{
    "user.uid": 1,
    "cids[0]": "LAKDSAUFEJNSDAIDUF"
}
```

### 角色


> **类**: `api.personel.UserCompanyAction`


#### 数据类型: `userRole`

| 参数 | 说明 | 类型 |
|------|------|------|
| `urid` | ID | Long |
| `uid` | 员工ID | Integer |
| `role` | 角色 , 类型 [role ](./system.html#api.system.RoleAction.role) | Object |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `createTime` | 创建时间 | Timestamp |


##### `查询` queryUserRole

通过员工ID获取对应角色信息

**Requests:**

- `user.uid` (Integer): 员工ID

```json
{
    "user.uid": 1
}
```

**Returns:**

- `userRoles` (List): 角色信息列表 , 每条数据类型 `userRole`

```json
{
    ...
    "userRoles": [
        {
            "urid": 1,
            "uid": 1,
            "role": {
                "rid": "1",
                "name": "角色",
            },
            "creater": {
                "uid": 1,
                "userId": "U0203",
                "userName": "王宁",
                "currentName": "王宁",
                "phone": "136xxxx1453",
                ...
            },
            "createTime": "2016-01-01 00:00:00",
        }
    ],
    ...
}
```


##### `创建` updateUserRole

更新人员-角色信息

删除原有人员-公司信息 , 更新新配置人员-公司信息

**Requests:**

- `user.uid` (Integer): 员工ID

```json
{
    "user.uid": 1,
    "rids[0]": 1
}
```

## 招聘


### 招聘


> **类**: `api.personel.RecruitmentAction`


#### 数据类型: `recruitment`

| 参数 | 说明 | 类型 |
|------|------|------|
| `rid` | 招聘ID | Long |
| `name` | 姓名 | String |
| `identity` | 身份证号 | String |
| `nation` | 民族 | String |
| `place` | 地址 | String |
| `photoPath` | 照片 | String |
| `identityPathF` | 身份证正面 | String |
| `identityPathB` | 身份证背面 | String |
| `weight` | 体重 | Integer |
| `height` | 身高 | Integer |
| `employWay` | 应聘方式 , 0: 校园招聘 , 1: 网络招聘 , 2: 内部推荐 , 3: 主动应聘 , 4: 猎头 | Short |
| `householdType` | 户口类型 , 0: 农村 , 1: 城镇 | Short |
| `political` | 政治面貌 , 0: 群众 , 1: 团员 , 2: 党员 | Short |
| `education` | 学历 , 0: 小学及以下 , 1: 初中 , 2: 中专 , 3: 高中 , 4: 大专 , 5: 本科 , 6: 研究生及以上 | Short |
| `phone` | 电话 | String |
| `wechat` | 微信号 | String |
| `qq` | QQ号 | String |
| `address` | 现住址 | String |
| `nativePlace` | 籍贯 | String |
| `hometownPlace` | 户籍地 | String |
| `specialty` | 专业 | String |
| `emergencyMan` | 紧急联系人 | String |
| `emergencyPhone` | 紧急联系人电话 | String |
| `isMarried` | 婚姻状况 , 0: 已婚 , 1: 未婚 | Short |
| `isBirth` | 生育状况 , 0: 已育 , 1: 未育 | Short |
| `isHouse` | 是否有独立住房 , 0: 有 , 1: 无 | Short |
| `isCar` | 是否有独立车辆 , 0: 有 , 1: 无 | Short |
| `isHouseLoan` | 是否有房贷 , 0: 有 , 1: 无 | Short |
| `isCarLoan` | 是否有车贷 , 0: 有 , 1: 无 | Short |
| `isCarID` | 是否有驾照 , 0: 有 , 1: 无 | Short |
| `isPassID` | 是否有护照 , 0: 有 , 1: 无 | Short |
| `isHMID` | 是否有港澳通行证 , 0: 有 , 1: 无 | Short |
| `isTWID` | 是否有台湾通行证 , 0: 有 , 1: 无 | Short |
| `isContract` | 是否与原单位签订劳动合同 , 0: 是 , 1: 否 | Short |
| `isSnsurance` | 是否已缴纳社会保险 , 0: 是 , 1: 否 | Short |
| `isFire` | 是否已经与其它单位解除了劳动关系 , 0: 是 , 1: 否 | Short |
| `isCnsurance` | 是否缴纳其他商业保险 , 0: 是 , 1: 否 | Short |
| `isCompete` | 现在是否还在竟业限制期内 , 0: 是 , 1: 否 | Short |
| `isTrain` | 公司提供培训机会时，是否同意并签订协议 , 0: 是 , 1: 否 | Short |
| `isCriminal` | 是否曾有前科劣迹、行政/邢事拘留等经历 , 0: 是 , 1: 否 | Short |
| `isDisease` | 是否患有精神系统疾病、传染性疾病、家族遗传病史、既往重病史 , 0: 是 , 1: 否 | Short |
| `status` | 状态 , 0: 初始 , 1: 入职 , 2: 作废 | Short |


##### `查询` pageRecruitment

分页方式获取招聘信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 招聘信息列表 , 每条数据类型 `recruitment`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "rid": 1,
                "name": "员工",
                "identity": "000000000000000000",
                "phone": "138xxxx3874",
                "nation": "汉",
                "place": "地址",

                "height": 180,
                "weight": 60,

                "qq": "",
                "wechat": "",
                "email": "",

                "employWay": 0,
                "political": 0,
                "householdType": 0,
                "education": 0,

                "address": "",
                "nativePlace": "沈阳",
                "hometownPlace": "沈阳",
                "specialty": "专业",

                "emergencyMan": "紧急联系人",
                "emergencyPhone": "电话",

                "isMarried": 0,
                "isBirth": 0,
                "isHouse": 0,
                "isHouseLoan": 0,
                "isCar": 0,
                "isCarLoan": 0,
                "isCarID": 0,
                "isPassID": 0,
                "isHMID": 0,
                "isTWID": 0,

                "isContract": 0,
                "isSnsurance": 0,
                "isFire": 0,
                "isCnsurance": 0,
                "isCompete": 0,
                "isTrain": 0,
                "isCriminal": 0,
                "isDisease": 0,
                "isCompete": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryRecruitment

查询招聘信息

**Requests:**

- `recruitment.identity` (String): 身份证号
- `recruitment.phone` (String): 电话

```json
{
    "recruitment.identity": "000000000000000000",
    "recruitment.phone": "138xxxx3874"
}
```

**Returns:**

- `recruitments` (List): 招聘信息列表 , 每条数据类型 `recruitment`

```json
{
    ...
    "recruitments": [
        {
            "rid": 1,
            "name": "员工",
            "identity": "000000000000000000",
            "phone": "138xxxx3874",
            "nation": "汉",
            "place": "地址",

            "height": 180,
            "weight": 60,

            "qq": "",
            "wechat": "",
            "email": "",

            "employWay": 0,
            "political": 0,
            "householdType": 0,
            "education": 0,

            "address": "",
            "nativePlace": "沈阳",
            "hometownPlace": "沈阳",
            "specialty": "专业",

            "emergencyMan": "紧急联系人",
            "emergencyPhone": "电话",

            "isMarried": 0,
            "isBirth": 0,
            "isHouse": 0,
            "isHouseLoan": 0,
            "isCar": 0,
            "isCarLoan": 0,
            "isCarID": 0,
            "isPassID": 0,
            "isHMID": 0,
            "isTWID": 0,

            "isContract": 0,
            "isSnsurance": 0,
            "isFire": 0,
            "isCnsurance": 0,
            "isCompete": 0,
            "isTrain": 0,
            "isCriminal": 0,
            "isDisease": 0
        }
    ],
    ...
}
```


##### `查询` queryRecruitmentByRid

查询招聘信息

**Requests:**

- `recruitment.rid` (String): 招聘ID

```json
{
    "recruitment.rid": 1
}
```

**Returns:**

- `recruitment` (List): 招聘信息 , 类型 `recruitment`

```json
{
    ...
    "recruitment": {
        "rid": 1,
        "name": "员工",
        "identity": "000000000000000000",
        "phone": "138xxxx3874",
        "nation": "汉",
        "place": "地址",

        "height": 180,
        "weight": 60,

        "qq": "",
        "wechat": "",
        "email": "",

        "employWay": 0,
        "political": 0,
        "householdType": 0,
        "education": 0,

        "address": "",
        "nativePlace": "沈阳",
        "hometownPlace": "沈阳",
        "specialty": "专业",

        "emergencyMan": "紧急联系人",
        "emergencyPhone": "电话",

        "isMarried": 0,
        "isBirth": 0,
        "isHouse": 0,
        "isHouseLoan": 0,
        "isCar": 0,
        "isCarLoan": 0,
        "isCarID": 0,
        "isPassID": 0,
        "isHMID": 0,
        "isTWID": 0,

        "isContract": 0,
        "isSnsurance": 0,
        "isFire": 0,
        "isCnsurance": 0,
        "isCompete": 0,
        "isTrain": 0,
        "isCriminal": 0,
        "isDisease": 0
    }
    ...
}
```


##### `查询` checkRecruitment

检查招聘信息

**Requests:**

- `recruitment.identity` (String): 身份证号
- `recruitment.phone` (String): 电话

```json
{
    "recruitment.identity": "000000000000000000",
    "recruitment.phone": "138xxxx3874"
}
```

**Returns:**

- `recruitment` (Object): 招聘信息 , 类型 `recruitment`

```json
{
    ...
    "recruitment": {
        "rid": 1,
        "name": "员工",
        "identity": "000000000000000000",
        "phone": "138xxxx3874",
        "nation": "汉",
        "place": "地址",

        "height": 180,
        "weight": 60,

        "qq": "",
        "wechat": "",
        "email": "",

        "employWay": 0,
        "political": 0,
        "householdType": 0,
        "education": 0,

        "address": "",
        "nativePlace": "沈阳",
        "hometownPlace": "沈阳",
        "specialty": "专业",

        "emergencyMan": "紧急联系人",
        "emergencyPhone": "电话",

        "isMarried": 0,
        "isBirth": 0,
        "isHouse": 0,
        "isHouseLoan": 0,
        "isCar": 0,
        "isCarLoan": 0,
        "isCarID": 0,
        "isPassID": 0,
        "isHMID": 0,
        "isTWID": 0,

        "isContract": 0,
        "isSnsurance": 0,
        "isFire": 0,
        "isCnsurance": 0,
        "isCompete": 0,
        "isTrain": 0,
        "isCriminal": 0,
        "isDisease": 0
    }
    ...
}
```


##### `查询` addRecruitment

添加招聘信息

**Requests:**

- `recruitment.name` (String): 姓名
- `recruitment.identity` (String): 身份证号
- `recruitment.phone` (String): 电话
- `recruitment.nation` (String): 民族
- `recruitment.place` (String): 地址
- `recruitment.height` (String): 身高
- `recruitment.weight` (String): 体重
- `recruitment.qq` (String): QQ号
- `recruitment.wechat` (String): 微信号
- `recruitment.email` (String): 地址
- `recruitment.employWay` (Short): 应聘方式
- `recruitment.political` (Short): 户口类型
- `recruitment.householdType` (Short): 政治面貌
- `recruitment.education` (Short): 学历
- `recruitment.address` (String): 现住址
- `recruitment.nativePlace` (String): 籍贯
- `recruitment.hometownPlace` (String): 户籍地
- `recruitment.specialty` (String): 专业
- `recruitment.emergencyMan` (String): 紧急联系人
- `recruitment.emergencyPhone` (String): 紧急联系人电话
- `recruitment.isMarried` (Short): 婚姻状况
- `recruitment.isBirth` (Short): 婚姻状况
- `recruitment.isHouse` (Short): 婚姻状况
- `recruitment.isCar` (Short): 婚姻状况
- `recruitment.isHouseLoan` (Short): 婚姻状况
- `recruitment.isCarLoan` (Short): 婚姻状况
- `recruitment.isCarID` (Short): 婚姻状况
- `recruitment.isPassID` (Short): 婚姻状况
- `recruitment.isHMID` (Short): 婚姻状况
- `recruitment.isTWID` (Short): 婚姻状况
- `recruitment.isContract` (Short): 是否与原单位签订劳动合同
- `recruitment.isSnsurance` (Short): 是否已缴纳社会保险
- `recruitment.isFire` (Short): 是否已经与其它单位解除了劳动关系
- `recruitment.isCnsurance` (Short): 是否缴纳其他商业保险
- `recruitment.isCompete` (Short): 现在是否还在竟业限制期内
- `recruitment.isTrain` (Short): 公司提供培训机会时，是否同意并签订协议
- `recruitment.isCriminal` (Short): 是否曾有前科劣迹、行政/邢事拘留等经历
- `recruitment.isDisease` (Short): 是否患有精神系统疾病、传染性疾病、家族遗传病史、既往重病史

```json
{
    "recruitment.name": "姓名",
    "recruitment.identity": "000000000000000000",
    "recruitment.phone": "138xxxx3874",
    "recruitment.nation": "汉",
    "recruitment.place": "地址",

    "recruitment.height": 180,
    "recruitment.weight": 60,
    "recruitment.qq": "",
    "recruitment.wechat": "",
    "recruitment.email": "",

    "recruitment.employWay": 0,
    "recruitment.political": 0,
    "recruitment.householdType": 0,
    "recruitment.education": 0,

    "recruitment.address": "辽宁沈阳",
    "recruitment.nativePlace": "辽宁沈阳",
    "recruitment.hometownPlace": "辽宁沈阳",
    "recruitment.specialty": "",

    "recruitment.emergencyMan": "",
    "recruitment.emergencyPhone": "",

    "recruitment.isMarried": 0,
    "recruitment.isBirth": 0,
    "recruitment.isHouse": 0,
    "recruitment.isCar": 0,
    "recruitment.isHouseLoan": 0,
    "recruitment.isCarLoan": 0,
    "recruitment.isCarID": 0,
    "recruitment.isPassID": 0,
    "recruitment.isHMID": 0,
    "recruitment.isTWID": 0,

    "recruitment.isContract": 0,
    "recruitment.isSnsurance": 0,
    "recruitment.isFire": 0,
    "recruitment.isCnsurance": 0,
    "recruitment.isCompete": 0,
    "recruitment.isTrain": 0,
    "recruitment.isCriminal": 0,
    "recruitment.isDisease": 0,

    "recruitmentEducation[0].organ": "",
    "recruitmentEducation[0].certificate": "",
    "recruitmentEducation[0].beginTime": "2016-01-01",
    "recruitmentEducation[0].endTime": "2016-01-01",
    "recruitmentEducation[0].createTime": "2016-01-01",
    "recruitmentEducation[0].specialty": "",
    "recruitmentEducation[0].content": "",

    "recruitmentOperation[0].company": "",
    "recruitmentOperation[0].trade": "",
    "recruitmentOperation[0].duty": "",
    "recruitmentOperation[0].beginTime": "2016-01-01",
    "recruitmentOperation[0].endTime": "2016-01-01",
    "recruitmentOperation[0].createTime": "2016-01-01",
    "recruitmentOperation[0].salary": "",
    "recruitmentOperation[0].comment": ""
}
```


##### `查询` updateRecruitment

更新招聘信息

判断招聘信息是否存在 , 不存在 , 错误信息 **190021 招聘信息不存在**

判断招聘信息状态为0(初始) , 其他状态 , 错误信息 **190022 招聘信息状态不可操作**

**Requests:**

- `recruitment.rid` (Long): 招聘ID
- `recruitment.name` (String): 姓名
- `recruitment.identity` (String): 身份证号
- `recruitment.phone` (String): 电话
- `recruitment.nation` (String): 民族
- `recruitment.place` (String): 地址
- `recruitment.height` (String): 身高
- `recruitment.weight` (String): 体重
- `recruitment.qq` (String): QQ号
- `recruitment.wechat` (String): 微信号
- `recruitment.email` (String): 地址
- `recruitment.employWay` (Short): 应聘方式
- `recruitment.political` (Short): 户口类型
- `recruitment.householdType` (Short): 政治面貌
- `recruitment.education` (Short): 学历
- `recruitment.address` (String): 现住址
- `recruitment.nativePlace` (String): 籍贯
- `recruitment.hometownPlace` (String): 户籍地
- `recruitment.specialty` (String): 专业
- `recruitment.emergencyMan` (String): 紧急联系人
- `recruitment.emergencyPhone` (String): 紧急联系人电话
- `recruitment.isMarried` (Short): 婚姻状况
- `recruitment.isBirth` (Short): 婚姻状况
- `recruitment.isHouse` (Short): 婚姻状况
- `recruitment.isCar` (Short): 婚姻状况
- `recruitment.isHouseLoan` (Short): 婚姻状况
- `recruitment.isCarLoan` (Short): 婚姻状况
- `recruitment.isCarID` (Short): 婚姻状况
- `recruitment.isPassID` (Short): 婚姻状况
- `recruitment.isHMID` (Short): 婚姻状况
- `recruitment.isTWID` (Short): 婚姻状况
- `recruitment.isContract` (Short): 是否与原单位签订劳动合同
- `recruitment.isSnsurance` (Short): 是否已缴纳社会保险
- `recruitment.isFire` (Short): 是否已经与其它单位解除了劳动关系
- `recruitment.isCnsurance` (Short): 是否缴纳其他商业保险
- `recruitment.isCompete` (Short): 现在是否还在竟业限制期内
- `recruitment.isTrain` (Short): 公司提供培训机会时，是否同意并签订协议
- `recruitment.isCriminal` (Short): 是否曾有前科劣迹、行政/邢事拘留等经历
- `recruitment.isDisease` (Short): 是否患有精神系统疾病、传染性疾病、家族遗传病史、既往重病史

```json
{
    "recruitment.rid": 1,
    "recruitment.name": "姓名",
    "recruitment.identity": "000000000000000000",
    "recruitment.phone": "138xxxx3874",
    "recruitment.nation": "汉",
    "recruitment.place": "地址",

    "recruitment.height": 180,
    "recruitment.weight": 60,
    "recruitment.qq": "",
    "recruitment.wechat": "",
    "recruitment.email": "",

    "recruitment.employWay": 0,
    "recruitment.political": 0,
    "recruitment.householdType": 0,
    "recruitment.education": 0,

    "recruitment.address": "辽宁沈阳",
    "recruitment.nativePlace": "辽宁沈阳",
    "recruitment.hometownPlace": "辽宁沈阳",
    "recruitment.specialty": "",

    "recruitment.emergencyMan": "",
    "recruitment.emergencyPhone": "",

    "recruitment.isMarried": 0,
    "recruitment.isBirth": 0,
    "recruitment.isHouse": 0,
    "recruitment.isCar": 0,
    "recruitment.isHouseLoan": 0,
    "recruitment.isCarLoan": 0,
    "recruitment.isCarID": 0,
    "recruitment.isPassID": 0,
    "recruitment.isHMID": 0,
    "recruitment.isTWID": 0,

    "recruitment.isContract": 0,
    "recruitment.isSnsurance": 0,
    "recruitment.isFire": 0,
    "recruitment.isCnsurance": 0,
    "recruitment.isCompete": 0,
    "recruitment.isTrain": 0,
    "recruitment.isCriminal": 0,
    "recruitment.isDisease": 0
}
```


##### `查询` updateRecruitmentForAdvance

更新招聘信息

判断招聘信息是否存在 , 不存在 , 错误信息 **190021 招聘信息不存在**

**Requests:**

- `recruitment.rid` (Long): 招聘ID
- `recruitment.photoPath` (String): 照片
- `recruitment.identityPathF` (String): 身份证正面
- `recruitment.identityPathB` (String): 身份证背面

```json
{
    "recruitment.rid": 1,
    "recruitment.photoPath": "ioTRuDhO9gHDrzXLTxp7ZyAN/wvq",
    "recruitment.identityPathF": "ioTRuDhO9gHDrzXLTxp7ZyAN/wvq",
    "recruitment.identityPathB": "ioTRuDhO9gHDrzXLTxp7ZyAN/wvq",
}
```


##### `查询` updateRecruitmentForStatus

更新招聘状态

判断招聘信息是否存在 , 不存在 , 错误信息 **190021 招聘信息不存在**

**Requests:**

- `recruitment.rid` (Long): 招聘ID

```json
{
    "recruitment.rid": 1
}
```


##### `查询` entryRecruitment

入职

判断招聘信息是否存在 , 不存在 , 错误信息 **190021 招聘信息不存在**

判断招聘信息状态是否为0(初始) , 其他状态 , 错误信息 **190022 招聘信息状态不可操作**

**Requests:**

- `recruitment.rid` (Long): 招聘ID

```json
{
    "recruitment.rid": 1
}
```


##### `查询` cancelRecruitment

作废

判断招聘信息是否存在 , 不存在 , 错误信息 **190021 招聘信息不存在**

判断招聘信息状态是否为0(初始) , 其他状态 , 错误信息 **190022 招聘信息状态不可操作**

**Requests:**

- `recruitment.rid` (Long): 招聘ID

```json
{
    "recruitment.rid": 1
}
```

### 教育


> **类**: `api.personel.RecruitmentEducationAction`


#### 数据类型: `recruitmentEducation`

| 参数 | 说明 | 类型 |
|------|------|------|
| `reid` | 教育ID | Long |
| `rid` | 人员ID | Long |
| `organ` | 机构 | String |
| `certificate` | 证书 | String |
| `beginTime` | 开始时间 | Timestamp |
| `endTime` | 结束时间 | Timestamp |
| `createTime` | 创建时间 | String |
| `specialty` | 专业 | String |
| `content` | 内容 | String |


##### `查询` queryRecruitmentEducation

查询招聘教育信息

**Requests:**

- `recruitmentEducation.rid` (Long): 招聘ID

```json
{
    "recruitmentEducation.rid": 1,
}
```

**Returns:**

- `recruitmentEducations` (List): 招聘信息列表 , 每条数据类型 `recruitmentEducation`

```json
{
    ...
    "recruitmentEducations": [
        {
            "reid": 1,
            "rid": 1,
            "organ": "",
            "certificate": "",
            "beginTime": "2016-01-01",
            "endTime": "2016-01-01",
            "createTime": "2016-01-01",
            "specialty": "专业",
            "content": ""
        }
    ],
    ...
}
```


##### `查询` addRecruitmentEducation

添加招聘教育信息

**Requests:**

- `recruitmentEducation.rid` (Long): 招聘ID
- `recruitmentEducation.organ` (String): 机构
- `recruitmentEducation.organ` (String): 机构
- `recruitmentEducation.certificate` (String): 证书
- `recruitmentEducation.beginTime` (Timestamp): 开始时间
- `recruitmentEducation.endTime` (Timestamp): 结束时间
- `recruitmentEducation.createTime` (Timestamp): 创建时间
- `recruitmentEducation.specialty` (String): 专业
- `recruitmentEducation.content` (String): 内容

```json
{
    "recruitmentEducation.rid": 1,
    "recruitmentEducation.organ": "",
    "recruitmentEducation.certificate": "",
    "recruitmentEducation.beginTime": "2016-01-01",
    "recruitmentEducation.endTime": "2016-01-01",
    "recruitmentEducation.createTime": "2016-01-01",
    "recruitmentEducation.specialty": "",
    "recruitmentEducation.content": "",
}
```


##### `查询` updateRecruitmentEducation

更新招聘教育信息

**Requests:**

- `recruitmentEducation.reid` (Long): 招聘教育ID
- `recruitmentEducation.organ` (String): 机构
- `recruitmentEducation.organ` (String): 机构
- `recruitmentEducation.certificate` (String): 证书
- `recruitmentEducation.beginTime` (Timestamp): 开始时间
- `recruitmentEducation.endTime` (Timestamp): 结束时间
- `recruitmentEducation.createTime` (Timestamp): 创建时间
- `recruitmentEducation.specialty` (String): 专业
- `recruitmentEducation.content` (String): 内容

```json
{
    "recruitmentEducation.reid": 1,
    "recruitmentEducation.organ": "",
    "recruitmentEducation.certificate": "",
    "recruitmentEducation.beginTime": "2016-01-01",
    "recruitmentEducation.endTime": "2016-01-01",
    "recruitmentEducation.createTime": "2016-01-01",
    "recruitmentEducation.specialty": "",
    "recruitmentEducation.content": "",
}
```


##### `查询` deleteRecruitmentEducation

删除招聘教育信息

**Requests:**

- `recruitmentEducation.reid` (Long): 招聘教育ID

```json
{
    "recruitmentEducation.reid": 1
}
```

### 工作


员工工作信息管理


> **类**: `api.personel.RecruitmentOperationAction`


#### 数据类型: `recruitmentOperation`

| 参数 | 说明 | 类型 |
|------|------|------|
| `roid` | 工作ID | Long |
| `rid` | 招聘ID | Long |
| `company` | 公司 | String |
| `trade` | 行业 | String |
| `duty` | 职位 | String |
| `beginTime` | 开始时间 | Timestamp |
| `endTime` | 结束时间 | Timestamp |
| `salary` | 薪资 | Long |
| `createTime` | 创建时间 | String |
| `comment` | 描述 | String |


##### `查询` queryRecruitmentOperation

查询招聘工作信息

**Requests:**

- `recruitmentOperation.rid` (Long): 招聘ID

```json
{
    "recruitmentOperation.rid": 1,
}
```

**Returns:**

- `recruitmentOperations` (List): 招聘信息列表 , 每条数据类型 `recruitmentOperation`

```json
{
    ...
    "recruitmentOperations": [
        {
            "roid": 1,
            "rid": 1,
            "company": "",
            "trade": "",
            "duty": "",
            "beginTime": "2016-01-01",
            "endTime": "2016-01-01",
            "createTime": "2016-01-01",
            "salary": 0,
            "comment": ""
        }
    ],
    ...
}
```


##### `查询` addRecruitmentOperation

添加招聘工作信息

**Requests:**

- `recruitmentOperation.rid` (Long): 招聘ID
- `recruitmentOperation.company` (String): 公司
- `recruitmentOperation.trade` (String): 行业
- `recruitmentOperation.duty` (String): 职位
- `recruitmentOperation.beginTime` (Timestamp): 开始时间
- `recruitmentOperation.endTime` (Timestamp): 结束时间
- `recruitmentOperation.createTime` (Timestamp): 创建时间
- `recruitmentOperation.salary` (String): 薪资
- `recruitmentOperation.comment` (String): 内容

```json
{
    "recruitmentOperation.rid": 1,
    "recruitmentOperation.company": "",
    "recruitmentOperation.trade": "",
    "recruitmentOperation.duty": "",
    "recruitmentOperation.beginTime": "2016-01-01",
    "recruitmentOperation.endTime": "2016-01-01",
    "recruitmentOperation.createTime": "2016-01-01",
    "recruitmentOperation.salary": "",
    "recruitmentOperation.comment": ""
}
```


##### `查询` updateRecruitmentOperation

更新招聘工作信息

**Requests:**

- `recruitmentOperation.roid` (Long): 招聘工作ID
- `recruitmentOperation.company` (String): 公司
- `recruitmentOperation.trade` (String): 行业
- `recruitmentOperation.duty` (String): 职位
- `recruitmentOperation.beginTime` (Timestamp): 开始时间
- `recruitmentOperation.endTime` (Timestamp): 结束时间
- `recruitmentOperation.createTime` (Timestamp): 创建时间
- `recruitmentOperation.salary` (String): 薪资
- `recruitmentOperation.comment` (String): 内容

```json
{
    "recruitmentOperation.roid": 1,
    "recruitmentOperation.company": "",
    "recruitmentOperation.trade": "",
    "recruitmentOperation.duty": "",
    "recruitmentOperation.beginTime": "2016-01-01",
    "recruitmentOperation.endTime": "2016-01-01",
    "recruitmentOperation.createTime": "2016-01-01",
    "recruitmentOperation.salary": "",
    "recruitmentOperation.comment": ""
}
```


##### `查询` deleteRecruitmentOperation

删除招聘工作信息

**Requests:**

- `recruitmentOperation.roid` (Long): 招聘工作ID

```json
{
    "recruitmentOperation.roid": 1
}
```

## 厂商


### 厂商


> **类**: `api.personel.SupplierAction`


##### `查询` pageSupplier

分页方式获取厂商信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 员工信息列表 , 每条数据类型 `user`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "uid": 34,
                "userId": "U001",
                "oldUserId": "U001",
                "userName": "员工",
                "currentName": "员工",
                "phone": "138xxxx3874",
                "company": 0,
                "duty": {
                    "did": 1,
                    "name": "设计师",
                    "departmentType": {
                        "dtid": 1,
                        "name": "设计"
                    },
                    "lead": 0
                },
                "dept": {
                    "did": 250,
                    "no": "D001",
                    "name": "设计部",
                    "fatherDept": null,
                    "type": "职能部"
                },
                "role": {
                    "rid": 1,
                    "no": "R001",
                    "name": "游客"
                },
                "status": 0,
                "userPhoto": "/upload/Imag//2016/07/26/0/bd9f4736d3334afd87318c5c24fe6c44.jpg"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` querySupplierByPinyin

通过拼音获取厂商信息

通过pinyin筛选的字段包括 , pinyin/currentName/userId

**Requests:**

- `supplier.pinyin` (String): 员工名拼音

```json
{
    "supplier.pinyin": "yuangong"
}
```

**Returns:**

- `autoFillKeyValue` (List): 键值列表 , 每条数据类型 `keyValue` , 键为员工编号 , 值为员工现用名
- `autoFillList` (List): 员工现用名列表 , 每条数据类型String

```json
{
    ...
    "autoFillKeyValue": [
        {
            "key": "C001",
            "value": "厂商"
        }
    ],
    "autoFillList": [
        "员工"
    ],
    ...
}
```


##### `查询` addSupplier

添加厂商

**Requests:**

- `supplier.loginId` (String): 登陆帐号
- `supplier.userName` (String): 用户名
- `supplier.duty.did` (Integer): 职位ID
- `supplier.identity` (String): 身份证号
- `supplier.phone` (String): 手机号

```json
{
    "supplier.loginId": "yuangong",
    "supplier.userName": "厂商",
    "supplier.deptType": "职能部",
    "supplier.duty.did": 1,
    "supplier.identity": "000000000000000000",
    "supplier.dept.no": "D001"
}
```


##### `查询` updateSupplier

更新厂商

判断厂商信息是否存在 , 不存在 , 错误信息 **190012 厂商不存在**

**Requests:**

- `supplier.uid` (Long): 厂商ID
- `supplier.userName` (String): 名称
- `supplier.identity` (String): 身份证号
- `supplier.phone` (String): 手机号

```json
{
    "supplier.loginId": "yuangong",
    "supplier.userName": "厂商",
    "supplier.identity": "000000000000000000",
    "supplier.phone": "138xxxx1918"
}
```

### 合同


员工合同信息管理


> **类**: `api.personel.SupplierContractAction`


#### 数据类型: `supplierContract`

| 参数 | 说明 | 类型 |
|------|------|------|
| `scid` | 合同ID | Long |
| `uid` | 员工ID | Long |
| `no` | 合同编号 | String |
| `name` | 名称 | String |
| `title` | 标题 | 标题 |
| `signTime` | 签订时间 | Timestamp |
| `startTime` | 开始时间 | Timestamp |
| `endTime` | 结束时间 | Timestamp |
| `download` | 下载地址 | String |
| `viewpdf` | 查看地址 | String |
| `filesize` | 文件大小 | Integer |
| `creater` | 创建人 , 类型 [supplier ](./supplier.html#api.personel.SupplierAction.supplier) | Object |
| `signner` | 签署人 , 类型 [supplier ](./supplier.html#api.personel.SupplierAction.supplier) | Object |
| `createTime` | 创建时间 | Timestamp |
| `comsignTime` | 公司签时间 | Timestamp |
| `cussignTime` | 客户签时间 | Timestamp |
| `status` | 状态 , 0: 初始 , 1: 无效 , 2: 已签 , 3: 归档 , 4: 归档(本地) | Short |
| `comment` | 说明 | String |


##### `查询` querySupplierContract

获取人员合同信息

**Requests:**

- `supplierContract.uid` (Long): 人员ID

```json
{
    "supplierContract.uid": 1
}
```

**Returns:**

- `supplierContracts` (List): 员工合同列表 , 每条数据类型 `supplierContract`

```json
{
    ...
    "supplierContracts": [
        {
            "scid": 0,
            "uid": 1,
            "no": "ESCASD",
            "name": "合同名称",
            "title": "合同标题"
            "signTime": "2016-01-01 00:00:00",
            "startTime": "2016-01-01 00:00:00",
            "endTime": "2016-01-01 00:00:00",
            "viewpdf": "JKLSHFD213J12GH312U32.pdf",
            "download": "JKLSHFD213J12GH312U32.pdf",
            "filesize": 0,
            "creater": {
                "uid": 1,
                "supplierId": "U0203",
                "supplierName": "王宁",
                "currentName": "王宁",
                "phone": "136xxxx1453",
                ...
            },
            "signner": null,
            "createTime": "2016-01-01 00:00:00",
            "comsignTime": null,
            "cussignTime": null,
            "status": 0,
            "comment": "说明"
        }
    ],
    ...
}
```


##### `查询` sendSupplierContractForAuth

发送认证通知

判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**

**Requests:**

- `supplierContract.scid` (Long): 合同ID

```json
{
    "supplierContract.scid": 1
}
```


##### `查询` sendSupplierContract

发送合同通知

通过不同类型的控制 , 统一的跳转页面来判断当前通知合同的状态是否符合操作

判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**

**Requests:**

- `supplierContract.scid` (Long): 合同ID
- `supplierContract.type` (Short): 类型 , 1: 签章, 2: 签订, 3: 查看 , 4: 下载

```json
{
    "supplierContract.scid": 1,
    "supplierContract.type": 1
}
```


##### `查询` redirectSupplierContract

跳转合同操作 , 根据发送合同通知的类型 , 响应对应功能的页面地址

类型包括1(签章)/2(签订)/3(查看)/4(下载)

判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**

**Requests:**

- `supplierContract.scid` (Long): 合同ID

```json
{
    "supplierContract.scid": 1
}
```

**Returns:**

- `redirect` (String): 跳转地址

```json
{
    ...
    "redirect": "http://redirect.com/redirect.html?type=view",
    ...
}
```


##### `查询` viewSupplierContract

查看合同

判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**

**Requests:**

- `supplierContract.scid` (Long): 合同ID

```json
{
    "supplierContract.scid": 1
}
```

**Returns:**

- `redirect` (String): 跳转地址

```json
{
    ...
    "redirect": "http://redirect.com/redirect.html?type=view",
    ...
}
```


##### `查询` signSupplierContractForCompany

签订合同 , 针对公司信息

判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**

判断签章是否存在 , 不存在 , 错误信息 **130045 签章不存在**

判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **190029 合同不可操作**

**Requests:**

- `supplierContract.scid` (Long): 合同ID
- `signet.signno` (String): 签章编号
- `signet.keyword` (String): 关键字
- `signet.signid` (Long): 印章ID

```json
{
    "supplierContract.scid": 1,
    "signet.signno": "IN31HJOS",
    "signet.keyword": "关键字",
    "signet.signid": 1
}
```


##### `查询` signSupplierContractForSupplier

签订合同 , 针对员工信息

判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**

判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **190029 合同不可操作**

**Requests:**

- `supplierContract.scid` (Long): 合同ID

```json
{
    "supplierContract.scid": 1
}
```

**Returns:**

- `redirect` (String): 跳转地址

```json
{
    ...
    "redirect": "http://redirect.com/redirect.html?type=sign",
    ...
}
```


##### `创建` addSupplierContract

添加用户合同信息

**Requests:**

- `supplierContract.uid` (Long): 人员ID
- `supplierContract.no` (String): 编号
- `supplierContract.name` (String): 名称
- `supplierContract.signTime` (Timestamp): 签订时间
- `supplierContract.beginTime` (Timestamp): 开始时间
- `supplierContract.endTime` (Timestamp): 结束时间
- `supplierContract.comment` (String): 说明
- `contract.cid` (Long): 合同ID
- `contract.no` (String): 合同编号
- `contract.name` (String): 名称
- `contract.title` (String): 标题

```json
{
    "supplierContract.uid": 1,
    "supplierContract.no": "ESAEASDF",
    "supplierContract.name": "合同名称",
    "supplierContract.signTime": "2016-01-01 00:00:00",
    "supplierContract.beginTime": "2016-01-01 00:00:00",
    "supplierContract.endTime": "2016-01-01 00:00:00",
    "supplierContract.comment": "",

    "contract.cid": 1,
    "contract.no": "74HENIDH121H",
    "contract.name": "合同模版",
    "contract.title": "合同标题",
}
```


##### `创建` updateSupplierContract

更新用户合同信息

**Requests:**

- `supplierContract.scid` (Long): 合同ID
- `supplierContract.comment` (String): 说明

```json
{
    "supplierContract.scid": 1,
    "supplierContract.comment": ""
}
```


##### `查询` affixSupplierContract

签订合同

判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**

判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **190029 合同不可操作**

更新装修合同为1(已签)

**Requests:**

- `supplierContract.scid` (Long): 合同ID

```json
{
    "supplierContract.scid": 1
}
```


##### `查询` expireSupplierContract

失效合同

判断合同是否存在 , 不存在 , 错误信息 **190028 合同不存在**

判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **190029 合同不可操作**

更新装修合同为1(失效)

**Requests:**

- `supplierContract.scid` (Long): 合同ID

```json
{
    "supplierContract.scid": 1
}
```


##### `查询` filingSupplierContract

归档合同

判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**

判断合同状态是否为2(已签) , 其他状态不可操作 , 错误信息 **140068 合同不可操作**

更新装修合同为3(归档)

**Requests:**

- `supplierContract.scid` (Long): 合同ID

```json
{
    "supplierContract.scid": 1
}
```


##### `创建` deleteSupplierContract

删除合同

判断合同是否存在 , 不存在 , 错误信息 **140067 合同不存在**

判断合同状态是否为0(初始) , 其他状态不可操作 , 错误信息 **140068 合同不可操作**

**Requests:**

- `supplierContract.scid` (Long): 合同ID

```json
{
    "supplierContract.scid: 1
}
```

### 合同-品牌


> **类**: `api.personel.SupplierContractBrandAction`


#### 数据类型: `supplierContractBrand`

| 参数 | 说明 | 类型 |
|------|------|------|
| `scbid` | ID | Long |
| `scid` | 合同ID | Long |
| `brand` | 品牌 , 类型 [brand ](./data.html#api.data.BrandAction.brand) | Object |
| `ctype` | 结算类型 , 0: 底价 , 1: 点位 | Short |
| `cvalue` | 结算值 , 点位结算对应结算值为0~1之前三位小数 , 底价结算对应结算值为浮点数 | Integer |
| `breakpay` | 违约金 | Integer |


.. querySupplierContractBrand

.. addSupplierContractBrand

.. deleteSupplierContractBrand

### 合同-商品


> **类**: `api.personel.SupplierContractGoodsAction`


#### 数据类型: `supplierContractGoods`

| 参数 | 说明 | 类型 |
|------|------|------|
| `scgid` | ID | Long |
| `scid` | 合同ID | Long |
| `goods` | 商品 , 类型 [goods ](./data.html#api.data.GoodsAction.goods) | Object |
| `price` | 价格 | Integer |
| `balance` | 结算价 | Integer |


.. querySupplierContractGoods

.. addSupplierContractGoods

.. deleteSupplierContractGoods

## 商户


> **类**: `api.personel.SupplierAction`


##### `查询` pageSupplier

分页方式获取商户信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 商户信息列表 , 每条数据类型 `user`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "uid": 34,
                "userId": "U001",
                "oldUserId": "U001",
                "userName": "员工",
                "currentName": "员工",
                "phone": "138xxxx3874",
                "company": 0,
                "duty": {
                    "did": 1,
                    "name": "设计师",
                    "departmentType": {
                        "dtid": 1,
                        "name": "设计"
                    },
                    "lead": 0
                },
                "dept": {
                    "did": 250,
                    "no": "D001",
                    "name": "设计部",
                    "fatherDept": null,
                    "type": "职能部"
                },
                "role": {
                    "rid": 1,
                    "no": "R001",
                    "name": "游客"
                },
                "status": 0,
                "userPhoto": "/upload/Imag//2016/07/26/0/bd9f4736d3334afd87318c5c24fe6c44.jpg"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryMerchantByPinyin

通过拼音获取商户信息

通过pinyin筛选的字段包括 , pinyin/currentName/userId

**Requests:**

- `merchant.pinyin` (String): 商户拼音

```json
{
    "merchant.pinyin": "yuangong"
}
```

**Returns:**

- `autoFillKeyValue` (List): 键值列表 , 每条数据类型 `keyValue` , 键为商户编号 , 值为名称
- `autoFillList` (List): 名称列表 , 每条数据类型String

```json
{
    ...
    "autoFillKeyValue": [
        {
            "key": "C001",
            "value": "厂商"
        }
    ],
    "autoFillList": [
        "员工"
    ],
    ...
}
```

## 管理


> **类**: `api.personel.AvengerAction`


##### `查询` pageAvenger

分页方式获取管理信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 管理信息列表 , 每条数据类型 `user`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "uid": 34,
                "userId": "U001",
                "oldUserId": "U001",
                "userName": "员工",
                "currentName": "员工",
                "phone": "138xxxx3874",
                "company": 0,
                "duty": {
                    "did": 1,
                    "name": "设计师",
                    "departmentType": {
                        "dtid": 1,
                        "name": "设计"
                    },
                    "lead": 0
                },
                "dept": {
                    "did": 250,
                    "no": "D001",
                    "name": "设计部",
                    "fatherDept": null,
                    "type": "职能部"
                },
                "role": {
                    "rid": 1,
                    "no": "R001",
                    "name": "游客"
                },
                "status": 0,
                "userPhoto": "/upload/Imag//2016/07/26/0/bd9f4736d3334afd87318c5c24fe6c44.jpg"
            }
        ],
        ...
    },
    ...
}
```


##### `查询` queryAvengerByPinyin

通过拼音获取管理信息

通过pinyin筛选的字段包括 , pinyin/currentName/userId

**Requests:**

- `avenger.pinyin` (String): 管理拼音

```json
{
    "avenger.pinyin": "yuangong"
}
```

**Returns:**

- `autoFillKeyValue` (List): 键值列表 , 每条数据类型 `keyValue` , 键为管理编号 , 值为名称
- `autoFillList` (List): 名称 , 每条数据类型String

```json
{
    ...
    "autoFillKeyValue": [
        {
            "key": "C001",
            "value": "厂商"
        }
    ],
    "autoFillList": [
        "员工"
    ],
    ...
}
```

## 需求


> **类**: `api.personel.UserRequireAction`


#### 数据类型: `userRequire`

| 参数 | 说明 | 类型 |
|------|------|------|
| `urid` | 需求ID | Long |
| `content` | 内容 | String |
| `creater` | 创建人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `department` | 创建部门 , 类型 [department ](./department.html#api.communion.DepartmentAction.department) | Object |
| `createTime` | 创建时间 | Timestamp |
| `receipter` | 接收人 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `approveTime` | 审批时间 |  |
| `finishTime` | 完成时间 | Timestamp |
| `type` | 类型 , 0: 招聘 , 1: 培训 | Short |
| `status` | 状态 , 0: 初始 , 1: 通过 , 2: 拒绝 , 3: 完成 | Short |


##### `查询` pageUserRequire

分页方式获取人员需求消息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)

**Returns:**

- `paging` (object): 分页信息
- `paging.data` (List): 人员需求信息列表 , 每条数据类型 `userRequire`

```json
{
    ...
    "paging": {
        ...
        "data": [
            {
                "urid": 1,
                "content": "招聘需求",
                "creater": {
                    "uid": 1,
                    "userId": "U0001",
                    "userName": "白雪",
                    "currentName": "白雪",
                },
                "department": {
                    "did": 1,
                    "no": "D001",
                    "name": "市场营销一部",
                },
                "createTime": "2016-01-01",
                "receipter": {
                    "uid": 1,
                    "userId": "U0001",
                    "userName": "白雪",
                    "currentName": "白雪",
                },
                "approveTime": "2016-01-01",
                "finishTime": "2016-01-01",
                "type": 0,
                "status": 0
            }
        ],
        ...
    },
    ...
}
```


##### `查询` addUserRequire

添加人员需求

**Requests:**

- `userRequire.content` (String): 名称
- `userRequire.type` (Short): 类型

```json
{
    "userRequire.content": "人员需求",
    "userRequire.type": 0
}
```


##### `查询` approveUserRequire

通过人员需求

判断人员需求信息是否存在 , 不存在 , 错误信息 **190009 人员需求不存在**

判断人员需求状态是否为0(初始) , 其他状态 , 错误信息 **190010 人员需求不可操作**

更新人员需求状态为1(通过)

- `userRequire.urid` (Long): 需求ID

```json
{
    "userRequire.urid": 1
}
```


##### `查询` refuseUserRequire

拒绝人员需求

判断人员需求信息是否存在 , 不存在 , 错误信息 **190009 人员需求不存在**

判断人员需求状态是否为0(初始) , 其他状态 , 错误信息 **190010 人员需求不可操作**

更新人员需求状态为2(拒绝)

- `userRequire.urid` (Long): 需求ID

```json
{
    "userRequire.urid": 1
}
```


##### `查询` finishUserRequire

完成人员需求

判断人员需求信息是否存在 , 不存在 , 错误信息 **190009 人员需求不存在**

判断人员需求状态是否为1(通过) , 其他状态 , 错误信息 **190010 人员需求不可操作**

更新人员需求状态为3(完成)

- `userRequire.urid` (Long): 需求ID

```json
{
    "userRequire.urid": 1
}
```

## 标签


> **类**: `api.data.UserLabelAction`


#### 数据类型: `userLabel`

| 参数 | 说明 | 类型 |
|------|------|------|
| `ulid` | 人员标签ID | Long |
| `user` | 人员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `label` | 标签 , 类型 [label ](./data.html#api.data.LabelAction.label) | Object |
| `scope` | 积分 | Integer |


##### `查询` queryUserLabelByUid


##### `查询` pickUserLabel


##### `查询` addUserLabel


##### `查询` deleteUserLabel

## 绩效


> **类**: `api.personel.PerformanceAction`


#### 数据类型: `performance`

| 参数 | 说明 | 类型 |
|------|------|------|
| `pid` | 绩效ID | Long |
| `user` | 人员 , 类型 [user ](./user.html#api.personel.UserAction.user) | Object |
| `type` | 类型 | Short |
| `value` | 绩效 | Integer |
| `level` | 等级 | Short |
| `startTime` | 开始时间 | Timestamp |
| `endTime` | 结束时间 | Timestamp |
| `work` | 工作 | String |
| `content` | 内容 | String |


##### pagePerformance

分页方式获取绩效信息 , 分页以及条件参数传递方式参照 [paging ](../check_rule.html#page) 以及 [filter ](../check_rule.html#filter)


##### addPreformance

添加绩效信息

## 考勤


> **类**: `api.personel.AttendanceAction`


#### 数据类型: `attendance`

| 参数 | 说明 | 类型 |
|------|------|------|
| `aid` | 考勤ID | Long |
| `uid` | 用户ID | Long |
| `month` | 月份 , 例如: 201601 | Integer |
| `a1` | 考勤标识 , 两位数 , 十位标识早记录 , 各位标识晚记录 , 1: 正常 , 2: 迟到/早退 , 3: 未打卡 | Short |
| `a2` | 考勤标识 | Short |
| `a31` | 考勤标识 | Short |


##### `查询` queryAttendance

获取考勤记录

**Requests:**

- `attendance.uid` (Long): 人员ID
- `attendance.month` (Integer): 月份

```json
{
    "attendance.uid": 1
}
```

**Returns:**

- `attendances` (List): 签到信息列表 , 每条数据类型 `attendance`

```json
{
    ...
    "attendances": [
        {
            "aid": 1,
            "uid": 1,
            "month": 201601,
            "a1": 11
            "a2": 12,
            ...
            "a31": 11
        }
    ],
    ...
}
```
