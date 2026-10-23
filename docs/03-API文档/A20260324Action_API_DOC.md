# A20260324Action 接口说明文档

> 模块: seiya (Seiya人事同步接口)
> 版本: 1.0
> 日期: 2026-03-24

---

## 一、模块概述

A20260324Action 是方林ERP系统中 Seiya 模块的核心控制器，用于对接外部HR系统，实现**职位、部门、用户**三类基础人事数据的双向同步。

本模块提供3个HTTP接口，均通过 Struts2 Action 暴露，支持新增和更新操作。

---

## 二、架构总览

### 文件清单

| 文件 | 路径 | 说明 |
|------|------|------|
| Action | src/com/fanglin/seiya/action/A20260324Action.java | Struts2控制器，参数校验与路由 |
| Service接口 | src/com/fanglin/seiya/service/A20260324Service.java | 业务接口定义 |
| Service实现 | src/com/fanglin/seiya/service/impl/A20260324ServiceImpl.java | 核心业务逻辑 |

### 分层调用链

```
HTTP请求 → A20260324Action (参数校验)
         → A20260324Service (接口)
         → A20260324ServiceImpl (业务逻辑)
            → DutyDao / DepartmentDao / UserDao / DutmentDao (数据访问)
            → CountingService (编号生成)
            → CompanyDao / DepartmentTypeDao / SystemConfigDao (基础数据)
```

### 依赖的DAO组件

| 组件 | 用途 |
|------|------|
| DutyDao | 职位数据CRUD |
| DepartmentDao | 部门数据CRUD |
| DepartmentTypeDao | 部门类型查询 |
| UserDao | 用户数据CRUD |
| DutmentDao | 定岗记录(部门-职位关联) |
| CompanyDao | 公司信息查询 |
| CountingService | 自增编号生成 |
| UserRoleDao | 用户角色关联 |
| SystemConfigDao | 系统配置(默认角色、默认密码) |

---

## 三、接口详情

### 基础信息

| 项目 | 值 |
|------|-----|
| 基础URL | http://[服务器地址]/ |
| Content-Type | application/x-www-form-urlencoded |
| 响应格式 | JSON |
| 认证方式 | Session认证 |

### 通用响应格式

```json
{
  "errorCode": 0,      // 0=成功, 非0=失败
  "errorMsg": "",       // 错误描述
  "data": "..."         // 业务数据(各接口不同)
}
```

---

### 3.1 同步职位 - syncDuty

**接口路径**: POST /syncDuty

**功能说明**: 同步职位信息，支持新增和更新。当提供code时为更新，否则为新增。

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | String | 是 | 职位名称 |
| code | String | 否 | 职位编码(如POST9526)，更新时必填 |
| type | Integer | 是 | 部门类型ID |
| org_code | String | 否 | 部门编号(保留字段，未使用) |
| status | Integer | 否 | 状态：1=启用，2=禁用 |
| leader_flag | Integer | 否 | 是否领导岗：0=否，1=是 |

#### 请求示例

新增职位:
```
name=司机&type=1&status=1&leader_flag=0
```

更新职位:
```
name=高级司机&code=POST9526&type=1&status=1&leader_flag=1
```

#### 响应示例

```json
{
  "errorCode": 0,
  "errorMsg": "",
  "data": "123"    // 职位ID(did)
}
```

#### 业务逻辑

1. 校验 name 和 type 必填
2. 查询部门类型(DepartmentTypePO)，不存在则报错
3. 状态转换: 外部1=启用 → 内部0，其他 → 内部1
4. 根据 code 查找已有职位:
   - 找到 → 更新(name/status/type/lead/pinyin)
   - 未找到 → 新增
5. 新增时检查名称唯一性，自动生成编号(规则: D + 3位数字，如D001)
6. 返回职位ID(did)

#### 错误码

| 错误码 | 说明 |
|--------|------|
| 400001 | 职位名称不能为空 |
| 400003 | 部门类型不能为空 |
| 130016 | 职位已存在(名称重复) |
| 510001 | 部门类型不存在 |
| 500003 | 同步职位失败(系统异常) |

---

### 3.2 同步部门 - syncDepartment

**接口路径**: POST /syncDepartment

**功能说明**: 同步部门信息，支持新增和更新，含定岗数据(dutment)处理。当提供code时为更新，否则为新增。

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | String | 是 | 部门名称 |
| code | String | 否 | 部门编码(如DEPT9526)，更新时提供 |
| type | Integer | 是 | 部门类型ID |
| parent_code | String | 否 | 父部门did或编号(纯数字优先按did查,否则按编号no查);不传=新增挂公司顶级/更新保持原父级;解析失败降级不报错 |
| org_code | String | 是 | 组织编码(即公司ID，如"1") |
| status | Integer | 否 | 状态：1=启用，2=禁用 |
| leader_code | String | 否 | 部门经理工号(如FL-09527) |
| posts | String | 否 | 定岗数据JSON(如{"1":10,"2":20}) |
| order_value | Integer | 否 | 排序值 |

#### 请求示例

新增部门:
```
name=设计一部&type=1&parent_code=DEPT9525&org_code=1&status=1&leader_code=FL-09527&posts={"1":10,"2":20}&order_value=1
```

更新部门:
```
name=设计一部&code=DEPT9526&type=1&org_code=1&status=1
```

#### 响应示例

```json
{
  "errorCode": 0,
  "errorMsg": "",
  "data": "456"    // 部门ID(did)
}
```

#### 定岗数据(posts)格式说明

posts字段为JSON字符串，key为职位ID，value为人员上限值:

```json
{
  "1": 10,    // 职位ID=1，上限10人
  "2": 20     // 职位ID=2，上限20人
}
```

系统会解析此JSON，为每个职位创建或更新DutmentPO(定岗记录)。

#### 业务逻辑

1. 校验 name、org_code、type 必填
2. 查询部门类型(DepartmentTypePO)，不存在则报错
3. 解析父部门(如提供parent_code):纯数字先按did查再按编号no兜底,非数字按编号no查;解析不到时降级(warn日志,新增挂顶级/更新保持原父级),不报错
4. 查询部门经理(如提供leader_code)，不存在则报错
5. 状态转换: 外部1=启用 → 内部STATUS_ENABLE，其他 → STATUS_DISABLE
6. org_code转为Integer作为公司ID
7. 根据 code 查找已有部门:
   - 找到 → 更新(名称/类型/父部门/经理/公司/状态/排序/定岗)
   - 未找到 → 新增
8. 新增时检查同公司下名称唯一性，自动生成编号(规则: 公司缩写D_序号，如FLD_001)
9. 处理定岗数据(posts JSON)，创建/更新DutmentPO记录
10. 返回部门ID(did)

#### 错误码

| 错误码 | 说明 |
|--------|------|
| 401001 | 部门名称不能为空 |
| 401002 | 组织编码不能为空 |
| 401003 | 部门类型不能为空 |
| 130017 | 部门名称已存在(同公司下重复) |
| 511001 | 部门类型不存在 |
| 511003 | 部门经理不存在 |
| 511004 | 组织编码格式错误(必须为数字) |
| 230015 | 公司不存在 |
| 500004 | 同步部门失败(系统异常) |

---

### 3.3 同步用户 - syncUser

**接口路径**: POST /syncUser

**功能说明**: 同步用户信息，支持新增和更新。新增时自动创建用户、分配角色、设置默认密码、更新定岗人数。

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | String | 否 | 用户工号(如FL-09527)，更新时提供，新增时为空或作为工号 |
| name | String | 是 | 姓名 |
| current_name | String | 否 | 现用名，默认使用name |
| gender | Integer | 否 | 性别：0=女，1=男，默认1 |
| identity | String | 是 | 身份证号 |
| phone | String | 是 | 手机号 |
| login_id | String | 否 | 登录用户名，默认使用code |
| dept_id | Integer | 是 | 部门ID |
| duty_id | Long | 是 | 职位ID |
| company | Integer | 是 | 公司ID(user.company) |
| status | Integer | 否 | 状态：1=在职，0=离职，2=停薪留职，默认1 |

#### 请求示例

新增用户:
```
name=张三&identity=210xxx&phone=13800138000&dept_id=123&duty_id=456&company=1&status=1
```

更新用户:
```
code=FL-09527&name=张三&current_name=张三三&identity=210xxx&phone=13800138000&dept_id=123&duty_id=456&company=1&status=1
```

#### 响应示例

```json
{
  "errorCode": 0,
  "errorMsg": "",
  "data": "{\"code\":\"12345\",\"belong_org_code\":\"1\",\"userId\":\"FL-09527\"}"
}
```

data字段解析(JSON字符串):

| 字段 | 说明 |
|------|------|
| code | 用户UID(user.uid) |
| belong_org_code | 公司ID(user.company) |
| userId | 工号(user.userId) |

#### 业务逻辑

1. 校验 name、identity、phone、dept_id、duty_id、company 必填
2. 查询公司(CompanyPO)、部门(DepartmentPO)、职位(DutyPO)，任一不存在则报错
3. 状态转换:
   - 外部 1/null → 内部 STATUS_ONJOB(在职=0)
   - 外部 0 → 内部 STATUS_OFFJOB(离职=1)
   - 外部 2 → 内部 2(停薪留职)
4. 根据 code 查找已有用户:
   - **新增场景**:
     a. 校验手机号+身份证唯一性
     b. 校验登录名唯一性
     c. 生成工号(code或自动: 公司缩写U-序号，如FLU-00001)
     d. 创建UserPO，设置默认角色(游客)、默认密码(MD5加密)、访问权限等
     e. 保存用户及用户角色关联(UserRolePO)
     f. 更新定岗人数(DutmentPO.num + 1)
   - **更新场景**:
     a. 更新用户基本信息(姓名/性别/身份证/手机/部门/职位/公司/状态)
     b. 不修改loginId、不处理定岗人数
5. 返回JSON格式的结果

#### 错误码

| 错误码 | 说明 |
|--------|------|
| 402001 | 姓名不能为空 |
| 402002 | 身份证号不能为空 |
| 402003 | 手机号不能为空 |
| 402005 | 部门ID不能为空 |
| 402006 | 职位ID不能为空 |
| 402007 | 公司ID不能为空 |
| 402008 | 公司不存在 |
| 402009 | 部门不存在 |
| 402010 | 职位不存在 |
| 402011 | 手机号或身份证已被使用 |
| 402012 | 登录名已存在 |
| 402013 | 游客角色配置不存在(visitor) |
| 500006 | 同步用户失败(系统异常) |

---

## 四、编号生成规则

### 职位编号

- 规则: D + 3位数字(如 D001, D002, ...)
- 方法: synchronized，查询当前最大编号后递增
- 代码位置: A20260324ServiceImpl.generateDutyCode()

### 部门编号

- 规则: 公司缩写 + "D_" + 3位序号(如 FLD_001)
- 依赖 CountingService 生成自增序号
- 代码位置: A20260324ServiceImpl.generateDepartmentNo()

### 用户工号

- 规则: 公司缩写 + "U-" + 5位序号(如 FLU-00001)
- 依赖 CountingService 生成自增序号
- 如果请求中提供了code，则直接使用code作为工号

---

## 五、状态映射对照表

### 职位状态

| 外部参数(status) | 内部值 | 含义 |
|-------------------|--------|------|
| 1 | 0 (STATUS_INIT) | 启用 |
| 其他/null | 1 | 禁用 |

### 部门状态

| 外部参数(status) | 内部值 | 含义 |
|-------------------|--------|------|
| 1 | STATUS_ENABLE | 启用 |
| 其他/null | STATUS_DISABLE | 禁用 |

### 用户状态

| 外部参数(status) | 内部值 | 含义 |
|-------------------|--------|------|
| 1 / null | 0 (STATUS_ONJOB) | 在职 |
| 0 | 1 (STATUS_OFFJOB) | 离职 |
| 2 | 2 | 停薪留职 |

---

## 六、关键业务规则

### 新增/更新判定

所有接口统一规则: **code有值且在数据库中能查到 → 更新，否则 → 新增**。

### 唯一性校验

| 实体 | 校验字段 | 范围 |
|------|----------|------|
| 职位(Duty) | name | 全局唯一 |
| 部门(Department) | name + company | 同公司下唯一 |
| 用户(User) | phone + identity | 全局唯一 |
| 用户(User) | loginId | 全局唯一 |

### 新增用户默认值

| 字段 | 默认值 | 来源 |
|------|--------|------|
| 角色(role) | visitor角色ID | SystemConfig(visitor) |
| 密码(password) | MD5(配置值) | SystemConfig(password, company)，未配置则MD5("helloworld") |
| 访问权限(extranet) | QCODE+WEB+PC | 固定值 |
| 登录权限(isLogin) | ISLOGIN_NOT | 不可登录 |
| 用户类型(type) | TYPE_USER | 普通用户 |
| 更新标记(isUpdate) | ISUPDATE_ADD | 新增标记 |

### 定岗(Dutment)处理

- 定岗记录关联 部门+职位，记录人员上限(limit)和当前人数(num)
- 新增用户时，对应定岗记录的num + 1
- 更新用户时，不处理定岗人数
- 定岗数据(posts JSON)中的职位ID必须在系统中存在

---

## 七、事务管理

所有Service方法均标注 `@Transactional(rollbackFor = Exception.class)`:
- syncDuty: 职位新增/更新在同一个事务内
- syncDepartment: 部门新增/更新 + 定岗数据处理在同一事务内
- syncUser: 用户创建 + 角色关联 + 定岗人数更新在同一事务内

任何环节抛出异常，整个事务回滚。

---

## 八、日志规范

所有关键操作均有日志输出:

| 级别 | 位置 | 内容 |
|------|------|------|
| INFO | 每个接口入口 | 完整请求参数 |
| INFO | 新增/更新成功 | 主键ID、名称、编码 |
| INFO | 定岗处理 | 处理结果统计(成功数/跳过数) |
| WARN | code查不到 | 降级为新增处理 |
| WARN | 定岗数据格式错误 | 跳过该条记录 |
| ERROR | catch块 | 异常堆栈 |

---

## 九、调用顺序建议

由于存在数据依赖关系，建议按以下顺序调用:

```
1. syncDuty     → 先同步职位(职位是独立数据)
2. syncDepartment → 再同步部门(可引用职位作为定岗数据)
3. syncUser     → 最后同步用户(依赖部门和职位)
```

---

## 十、错误码汇总

| 错误码范围 | 所属接口 |
|-----------|----------|
| 400001~400003 | syncDuty (参数校验) |
| 401001~401003 | syncDepartment (参数校验) |
| 402001~402013 | syncUser (参数校验+业务校验) |
| 130016 | 职位名称重复 |
| 130017 | 部门名称重复 |
| 230015 | 公司不存在 |
| 510001 | 部门类型不存在(syncDuty) |
| 511001~511004 | syncDepartment (业务校验) |
| 500003 | syncDuty 系统异常 |
| 500004 | syncDepartment 系统异常 |
| 500006 | syncUser 系统异常 |
