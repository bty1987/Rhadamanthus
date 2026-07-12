# 钉钉


## 钉钉


> **类**: `api.dingding.DingTalkAction`


#### 数据类型: `user`

| 参数 | 说明 | 类型 |
|------|------|------|
| `userid` | 员工编号 | String |
| `name` | 员工名 | String |
| `position` | 职位 | String |
| `mobile` | 电话 | String |
| `avatar` | 头像 | String |
| `email` | 邮件 | String |
| `department` | 部门 | Object |
| `active` | 激活状态 | String |


#### 数据类型: `deptartment`

| 参数 | 说明 | 类型 |
|------|------|------|
| `id` | ID | Integer |
| `name` | 部门名称 | String |
| `parentid` | 父级部门ID | Integer |


##### `查询` queryDDUser

通过员工编号查询该人员的钉钉相关信息

**Requests:**

- `user.userId` (String): 员工编号

```json
{
    "user.userId": "FL-00001"
}
```

**Returns:**

- `user` (Object): 员工信息 , 类型 `user`

```json
{
    ...
    "user": {
        "active": true,
        "avatar": "http://static.dingtalk.com/media/lADPACOG84WW3mjNAq7NAoA_640_686.jpg",
        "department":{
           0:2465645,
           1:33271028
        } 
        "email": null,
        "extattr": null,
        "mobile": "138xxxx3620",
        "name": "白雪",
        "openId": "TWZrgP4lkiS6cqniimPUNvYwiEiE",
        "position": "设计师",
        "status": 0,
        "userid": "FL-00001",
    }
    ...
}
```


##### `查询` queryDDDepartment

通过登录人员的当前登录的公司查询当前公司的钉钉组织结构

**Returns:**

- `user` (List): 部门信息列表 , 每条数据类型 `department`

```json
{
    ...
    "departments": [
        0: {
            "id": 2742563,
            "name": "巡检部",
            "parentid": 2747375,
        },
    ],
    ...
}
```


##### `查询` addDDUser

添加人员到钉钉

**Requests:**

- `user.Mobile` (String): 联系方式
- `user.Position` (String): 职位
- `user.name` (String): 姓名
- `user.userid` (String): 员工号
- `dids` (list): 钉钉部门

```json
{
     "user.Mobile": "13840103620",
     "user.Position": "设计师",
     "user.name" : "白雪",
     "user.userid": "FL-07033",
     "dids": [2465645,2742563],
 }
```


##### `查询` updateDDUser

更新员工钉钉信息

**Requests:**

- `user.Mobile` (String): 联系方式
- `user.Position` (String): 职位
- `user.name` (String): 姓名
- `user.userid` (String): 员工号
- `dids` (list): 钉钉部门

```json
{
    "user.Mobile": "13840103620",
    "user.Position": "设计师",
    "user.name" : "白雪",
    "user.userid": "FL-07033",
    "dids": [2465645,2742563],
}
```


##### `查询` deleteDDUser

从钉钉中删除

**Requests:**

- `user.userId` (String): 员工编号

```json
{
    "user.userId": "FL-00001"
}
```


##### `查询` requestDDConfig


##### `查询` queryDDUserInfo


##### `查询` queryAccessToken


##### `查询` queryJsapiTicket


##### `查询` makeAccessToken


##### `查询` batchmakeAccessToken


##### `查询` deleteAccessToken
