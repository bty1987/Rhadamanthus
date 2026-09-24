# A20251208Action 平台项目对接接口文档

> 最后更新：2026-09-23
>
> **控制器**: `com.fanglin.seiya.action.A20251208Action`
>
> **源文件**: `src/com/fanglin/seiya/action/A20251208Action.java`
>
> **Service**: `com.fanglin.seiya.service.impl.A20251208ServiceImpl`
>
> **父包**: `@ParentPackage("base")`, `@Namespace("/")`
>
> **协议**: Struts2 + JSON, 所有接口 POST, Content-Type: `text/html`
>
> **用途**: 平台项目管理系统（PlatforPm）对接接口，覆盖**人员管理**（入职/调职/离职）与**施工管理**（工程开工/完工/同步/工人/验收/节点）两大类业务。

---

## 目录

- [一、通用约定](#一通用约定)
- [二、人员管理接口](#二人员管理接口)
  - [1. saveOrUpdateUserForPlatforPm](#1-saveorupdateuserforplatforpm--人员新增或更新)
  - [2. tranUserForPlatforPm](#2-tranuserforplatforpm--人员调职)
  - [3. quitUserForPlatforPm](#3-quituserforplatforpm--人员离职)
- [三、施工管理接口](#三施工管理接口)
  - [4. beginConstructionScheduleForPlatforPm](#4-beginconstructionscheduleforplatforpm--工程环节开工)
  - [5. finishConstructionScheduleForPlatforPm](#5-finishconstructionscheduleforplatforpm--工程环节完工)
  - [6. syncConstructionScheduleForPlatforPm](#6-syncconstructionscheduleforplatforpm--同步工程环节单条批量)
  - [7. addConstructerForPlatforPm](#7-addconstructerforplatforpm--新增施工工人)
  - [8. deleteConstructerForPlatforPm](#8-deleteconstructerforplatforpm--删除施工工人)
  - [9. syncSupervisorForPlatforPm](#9-syncsupervisorforplatforpm--同步工程监理)
  - [10. beginConstructionForPlatforPm](#10-beginconstructionforplatforpm--工程开工排期)
  - [11. syncConstructionForPlatforPm](#11-syncconstructionforplatforpm--同步工程单)
  - [12. updateAcceptanceForPlatforPm / syncAcceptanceForPlatforPm](#12-updateacceptanceforplatforpm--syncacceptanceforplatforpm--同步工程验收)
  - [13. syncConstructionNodeForPlatforPm](#13-syncconstructionnodeforplatforpm--同步工程节点)
- [四、错误码速查表](#四错误码速查表)
- [五、变更记录](#五变更记录)

---

## 一、通用约定

### 1.1 权限校验

人员管理类接口（`saveOrUpdateUserForPlatforPm` / `tranUserForPlatforPm` / `quitUserForPlatforPm`）在入口处统一校验：

```java
if (SystemConfig.getString("communion") == null) {
    throw new FLException(-1, "无操作权限");
}
```

> 即：仅当系统配置 `config.communion` 存在时，平台对接才被允许调用人员类接口；施工类接口无此限制，但操作人身份仍由 `queryUserId()`（继承自 `BaseListAction`）提供。

### 1.2 统一响应格式

接口走 Struts2 JSON 结果，`ignoreHierarchy=false`，无统一 `errorCode/errorMsg` 外壳，**直接序列化 Action 中的 VO 字段**。调用方需以 HTTP 200 + 是否抛出 `FLException`（返回异常 JSON）来判断成功失败。

### 1.3 通用操作人

- `queryUserId()`：当前登录用户工号，作为操作人记录到 `userExperience.operator`、消息发送方等。
- `queryCompany()`：当前登录用户所属公司，仅 `beginConstructionForPlatforPm` 使用。

---

## 二、人员管理接口

> 三个人员接口均硬编码写入 **company = 73**（平台项目固定公司），见 `A20251208ServiceImpl:176`。

### 1. saveOrUpdateUserForPlatforPm — 人员新增或更新

**路径**: `/saveOrUpdateUserForPlatforPm`
**方法位置**: `A20251208Action.java:62-71`
**Service**: `saveOrUpdateUserForPlatforPm` → 内部按 `userInfo.user.userId` 是否已存在 `UserInfoPO` 分流至 `addUser` / `updateUser`。

#### 请求参数

**`userInfo.user.*`（用户主体，UserVO）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `userInfo.user.userId` | String | 更新必填 | 工号；按此查 `UserInfoPO` 分流新增/更新。新增时系统自动生成工号（`FL-`/`{简称}U-`+5位流水）并回填返回，传入值不生效 |
| `userInfo.user.loginId` | String | 新增必填 | 登录名；新增时查重（重复抛 `190013`）并写入 `user.loginId`；更新时忽略不修改 |
| `userInfo.user.userName` | String | 否 | 员工姓名（旧字段，建议传 `currentName`） |
| `userInfo.user.currentName` | String | 新增必填 | 当前姓名；用于生成拼音、员工经历记录 |
| `userInfo.user.phone` | String | 建议 | 联系电话；新增时与 `identity` 联合查重（命中则回填 uid 直接返回，不报错） |
| `userInfo.user.identity` | String | 建议 | 身份证号；查重用途同上 |
| `userInfo.user.dept.did` | Integer | **是** | 目标部门 ID（必须存在且有父分区） |
| `userInfo.user.duty.did` | Integer | **是** | 目标职位 ID |
| `userInfo.user.status` | Short | 更新建议 | 在职状态：`0`=在职（开启 extranet），`1`=离职（关登录、清角色/公司关联）；与部门/职位任一变更即写员工经历 |
| `userInfo.user.operateTime` | Timestamp | 否 | 业务发生时间（落 `userExperience.operateTime`）；缺省取当前时间 |
| `userInfo.user.gender` | String | 否 | 性别（旧字段；新增时会被 `userInfo.gender` 推导值覆盖：0=女，其他=男） |
| `userInfo.user.isPrefor` | Short | 否 | 是否正式调转（该接口不消费，仅 `tranUserForPlatforPm` 使用） |
| `userInfo.user` 其余字段 | - | 否 | `oldUserId/pinYin/userPhoto/identityPathF/identityPathB/dutyName/companys` 等经 `BeanUtil.copyProperties` 原样拷贝；`role/dept/duty/uid/userId/loginId/password/isLogin/company/extranet` 由服务端控制，传入无效 |

**`userInfo.*`（扩展信息，UserInfoVO，经 BeanUtil 拷入 UserInfoPO，排除 `user`/`fangliner`）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `userInfo.gender` | Integer | 否 | 性别：`0`=女，非 0=男（新增分支写 `user.gender`） |
| `userInfo.level` | Short | 否 | 级别 |
| `userInfo.political` | Short | 否 | 政治面貌 |
| `userInfo.nation` | String | 否 | 民族 |
| `userInfo.hobby` | String | 否 | 爱好 |
| `userInfo.qq` | String | 否 | QQ |
| `userInfo.wechat` | String | 否 | 微信 |
| `userInfo.email` | String | 否 | 邮箱 |
| `userInfo.isMarried` | Short | 否 | 婚姻状况 |
| `userInfo.isBirth` | Short | 否 | 生育状况 |
| `userInfo.isHouseLoan` | Short | 否 | 房贷 |
| `userInfo.isCarLoan` | Short | 否 | 车贷 |
| `userInfo.isCarID` / `isPassID` / `isHMID` / `isTWID` | Short | 否 | 证件持有标记（驾照/护照/港澳/台湾） |
| `userInfo.householdType` | Integer | 否 | 户口类型 |
| `userInfo.hometownAddress` | String | 否 | 籍贯地址 |
| `userInfo.address` | String | 否 | 现住址 |
| `userInfo.lover` | String | 否 | 配偶 |
| `userInfo.claner` / `clanerCom` | String | 否 | 家属/家属单位 |
| `userInfo.emergencyMan` / `emergencyPhone` | String | 否 | 紧急联系人/电话 |
| `userInfo.employWay` | Short | 否 | 用工方式 |
| `userInfo.employType` | Short | 否 | 用工类型 |
| `userInfo.jobYears` | Integer | 否 | 工龄 |
| `userInfo.recommendMan` | String | 否 | 推荐人 |
| `userInfo.fangliner.userId` | String | 否 | 介绍人工号（传则关联 `UserInfoPO.fangliner`） |
| `userInfo` 时间字段 | String/Timestamp | 否 | `firstTime/entryTime/boardTime/hireTime/fireTime/tranTime` 可传；新增时 `hireTime` 强制取当前时间 |

#### 业务逻辑

1. **新增分支**（`addUser`, `ServiceImpl:188-320`）：
   - 按 `phone + identity` 查重 → 已存在则回填 uid 直接返回（不报错）。
   - 按 `loginId` 查重 → 已存在抛 `190013 登录名已存在`。
   - 校验部门存在、有父分区、未超 `dept.limit` / `dutment.limit`。
   - 自动生成工号：`FL-` 或 `{公司简称}U-` + 5 位流水（`countingService` 取 `CountingPO.TYPE_USER_INT`）。
   - 默认密码取 `config.password`（缺省 `helloworld`）MD5；角色取 `config.visitor`（游客角色）；默认 `isLogin=NOT`。
   - 写入 `UserPO`、`UserInfoPO`（入职时间 = now）、`UserExperiencePO`（type=`入职`）。

2. **更新分支**（`updateUser`, `ServiceImpl:322-455`）：
   - 校验人员、部门存在性。
   - 当 `status` / `dept` / `duty` 任一变更：
     - 离职状态 → 关闭登录、清空 extranet、删除 `userRole` / `userCompany`。
     - 在职状态 → 开启 extranet。
     - 重算新旧 `dutment` 的 num；超限抛 `190011`。
     - 写入 `UserExperiencePO`（type=`入职`/`调职`/`离职`，由状态判定）。

#### 异常场景

| 错误码 | 错误信息 | 触发条件 |
|:------:|---------|:---------|
| -1 | 无操作权限 | `config.communion` 未配置 |
| 230015 | 公司不存在 | `company=73` 查不到（新增分支） |
| 190013 | 登录名已存在 | loginId 已被占用 |
| 310002 | 部门不可添加人员 | 部门不存在或无父分区 |
| 190011 | 人员数量已达上限（部门/定岗） | 超 `dept.limit` 或 `dutment.limit` |
| 230010 | 角色不存在 | `config.visitor` 未配置 |
| 190005 | 人员不存在 | 更新分支查不到 UserInfoPO |

---

### 2. tranUserForPlatforPm — 人员调职

**路径**: `/tranUserForPlatforPm`
**方法位置**: `A20251208Action.java:73-83`
**Service**: `tranUserForPlatforPm`

> 仅当 `approve == "agree"` 时才执行，否则直接 SUCCESS（用于审批流的"同意"分支）。

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `approve` | String | **是** | 审批结果，必须等于 `"agree"` 才执行 |
| `user.userId` | String | **是** | 目标人员工号 |
| `user.dept.did` | Integer | 否 | 新部门 ID；传入才变更部门（校验存在+有父分区），不传仅记录调职经历 |
| `user.isPrefor` | Short | 否 | 是否正式调转（落 `userExperience.isPrefor`） |
| `user.operateTime` | Timestamp | 否 | 业务发生时间（落 `userExperience.operateTime`）；缺省取当前时间 |

#### 业务逻辑

- 校验目标人员存在。
- 若传入了新部门 `dept.did`：校验部门存在 + 有父分区 → 更新 `userPO.dept`。
- 写入 `UserExperiencePO`（type=`调职`，comment 含原部/现部）。
- 更新 `UserInfoPO.tranTime = now`。

#### 异常场景

| 错误码 | 错误信息 | 触发条件 |
|:------:|---------|:---------|
| -1 | 无操作权限 | `config.communion` 未配置 |
| 190005 | 人员不存在 | 工号查不到 |
| 310001 | 部门不存在 | 新部门 did 查不到 |
| 310002 | 部门不可添加人员 | 新部门无父分区 |

---

### 3. quitUserForPlatforPm — 人员离职

**路径**: `/quitUserForPlatforPm`
**方法位置**: `A20251208Action.java:85-95`
**Service**: `quitUserForPlatforPm`

> 仅当 `approve == "agree"` 时才执行。已离职人员重复调用会**静默返回**（不报错）。

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `approve` | String | **是** | 必须等于 `"agree"` |
| `userId` | String | **是** | 待离职人员工号（注意：此接口用的是 Action 顶层 `userId` 字段，非 `user` 对象） |

#### 业务逻辑

- 将 `status` 置为 `STATUS_OFFJOB`，角色改回游客（`config.visitor`）。
- 删除 `userRole` / `userCompany`、关闭登录、清空 extranet。
- 写入 `UserExperiencePO`（type=`离职`）。
- 更新 `UserInfoPO.fireTime = now`。

#### 异常场景

| 错误码 | 错误信息 | 触发条件 |
|:------:|---------|:---------|
| -1 | 无操作权限 | `config.communion` 未配置 |
| 190005 | 人员不存在 | 工号查不到 |
| 230010 | 角色不存在 | `config.visitor` 未配置 |

---

## 三、施工管理接口

### 4. beginConstructionScheduleForPlatforPm — 工程环节开工

**路径**: `/beginConstructionScheduleForPlatforPm`
**方法位置**: `A20251208Action.java:97-103`
**Service**: `beginConstructionScheduleForPlatforPm`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `constructionSchedule.csid` | Long | 二选一 | 工程环节 ID |
| `constructionSchedule.orderId` + `cnid` | String + Integer | 二选一 | 装修单号 + 节点 ID（csid 为空时按此定位） |

#### 业务逻辑

1. 定位 `ConstructionSchedulePO`（csid 优先，否则按 orderId+cnid 查，查不到抛 `120024`）。
2. 校验：环节状态必须为 `STATUS_INIT`（未开工），否则 `120025`。
3. **款项比例校验**（`checkout==VALID` 时）：
   - `decoration.paySacle < precheck/1000` → `120018 装修款比例不足`
   - `decoration.saleScale < stacheck/1000` → `120033 销售比例不足`
4. 环节置为 `STATUS_BEGIN`，`startTime = now`。
5. 若节点配置了开工问卷（`startSurvey.status==INIT`）→ 触发 `surveyService.makeSurvey`。
6. 若当前节点 sort 大于装修单 `projectStatus` 节点 sort → 推进 `decoration.projectStatus` 与 `construction.schedule/cnid`。
7. 若节点 `mark==MARK_START` → 设置 `construction.startTime` 并 `resetConstructionSchedule`。
8. 推送进场消息：`{节点名}准备进场. {startalk}`。

#### 异常场景

| 错误码 | 错误信息 | 触发条件 |
|:------:|---------|:---------|
| 120024 | 工程环节不存在 | 环节查不到 |
| 120020 | 工程信息不存在 | construction 查不到 |
| 120025 | 工程环节不可操作 | 环节状态非 INIT |
| 130026 | 工程节点不存在 | 节点缺失 |
| 120018 | 装修款比例不足 | `paySacle < precheck/1000` |
| 120033 | 销售比例不足 | `saleScale < stacheck/1000` |

---

### 5. finishConstructionScheduleForPlatforPm — 工程环节完工

**路径**: `/finishConstructionScheduleForPlatforPm`
**方法位置**: `A20251208Action.java:105-111`
**Service**: `finishConstructionScheduleForPlatforPm`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `constructionSchedule.csid` | Long | 二选一 | 工程环节 ID |
| `constructionSchedule.orderId` + `cnid` | String + Integer | 二选一 | 装修单号 + 节点 ID |

#### 业务逻辑

1. 定位环节；校验状态必须为 `STATUS_BEGIN`（已开工），否则 `120025`。
2. **款项比例校验**（`checkout==VALID` 时）：
   - `paySacle < postcheck/1000` → `120018`
   - `saleScale < fincheck/1000` → `120033`
3. 环节置为 `STATUS_FINISH`，`endTime = now`。
4. 若节点配置了完工问卷 → 触发 `surveyService.makeSurvey`。
5. 若该节点 sort 已完工数 + 1 = 同 process 节点总数 → 推进 `construction.process`。
6. 若 `mark==MARK_FINISH` → 设置 `construction.finishTime`。
7. 推送完工消息 + 给工程监理/创建人发送剩余天数提醒（基于 `ConstructionInfoPO.finishTime` 计算）。

#### 异常场景

同 [4. beginConstructionScheduleForPlatforPm](#4-beginconstructionscheduleforplatforpm--工程环节开工)，款项校验改为 `postcheck` / `fincheck`。

---

### 6. syncConstructionScheduleForPlatforPm — 同步工程环节（单条/批量）

**路径**: `/syncConstructionScheduleForPlatforPm`
**方法位置**: `A20251208Action.java`（`syncConstructionScheduleForPlatforPm`）
**Service**: `syncConstructionScheduleForPlatforPm`（单条逐项）/ `syncConstructionSchedulesForPlatforPm`（批量入口，整批一个事务，逐条委托单条逻辑）

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `constructionSchedule.csid` | Long | 三选一定位 | 工程环节 ID |
| `constructionSchedule.cid` + `cnid` | Long + Long | 三选一定位 | 工程 ID + 基础节点 ID |
| `constructionSchedule.orderId` + `cnid` | String + Long | 三选一定位 | 装修单号 + 基础节点 ID |
| `constructionSchedule.node.cnid` | Long | cnid 缺省时备用 | 基础节点 ID；顶层 `cnid` 为空时取此值参与定位 |
| `constructionSchedule.precheck` | Integer | 否 | 开工前装修款比例阈值（‰） |
| `constructionSchedule.postcheck` | Integer | 否 | 完工后装修款比例阈值（‰） |
| `constructionSchedule.stacheck` | Integer | 否 | 开工前销售款比例阈值（‰） |
| `constructionSchedule.fincheck` | Integer | 否 | 完工后销售款比例阈值（‰） |
| `constructionSchedule.accessoryLimit` | Integer | 否 | 材料浮动额 |
| `constructionSchedule.salaryLimit` | Integer | 否 | 工费浮动额 |
| `constructionSchedule.accessoryTotal` | Integer | 否 | 材料限额 |
| `constructionSchedule.salaryTotal` | Integer | 否 | 工费限额 |
| `constructionSchedule.salaryLimitTotal` | Integer | 否 | 工费浮动总上限 |
| `constructionSchedule.period/prenum/postnum` | Integer | 否 | 工期、前置天数、后置天数 |
| `constructionSchedule.preStartTime/preEndTime/startTime/endTime` | Timestamp | 否 | 预计/实际开完工时间 |
| `constructionSchedule.status/checkout/schedule/workStatus/scheduleStatus` | Short | 否 | 环节状态、款项校验、排序、施工状态、排期状态 |

#### 业务逻辑

按 `csid`、`cid+cnid` 或 `orderId+cnid` 定位环节；存在则仅更新传入字段，不传的字段保持原值。不存在时按单个基础节点创建一个 `ConstructionSchedulePO`，再应用传入字段。

该接口合并参考接口 `updateConstructionScheduleForScal`（款项比例）与 `updateConstructionScheduleForNorm`（材料/工费浮动额、限额）；不支持删除。

#### 批量报文（2026-09-24 起，同一 URL）

支持 Struts2 List 索引绑定，参数键为 `constructionSchedules[下标].字段名`（下标从 0 连续编号），一次请求同步多个工程环节：

- **整批一个事务**，任一条目失败整批回滚；
- 逐条执行与单条完全一致的"定位→不存在则新增→按传入字段更新"逻辑，`constructionSchedules[i].*` 字段范围与上表一致（`node.cnid` 备用定位写法为 `constructionSchedules[i].node.cnid`）；
- `constructionSchedules` 为空或不传时静默成功（no-op）。

**单条报文兼容**：沿用单条参数键 `constructionSchedule.*`（单数、无下标）调用本接口也可——服务端在复数参数缺省而单数参数存在时，自动将 `constructionSchedule` 包装为单元素批量执行，响应中单条字段照常回填 `csid`/`cid`/`orderId`/`cnid`。优先级：`constructionSchedules[i].*` 与 `constructionSchedule.*` 同时传入时以复数为准，单数忽略。

#### 异常场景

| 错误码 | 错误信息 | 触发条件 |
|:------:|---------|:---------|
| 120020 | 工程信息不存在 | 新增环节时工程查不到 |
| 120034 | 工程节点不存在 | 新增环节时基础节点查不到 |
| 120035 | 工费浮动已达上限 | 传入 `salaryLimit` 超过当前工费浮动额 + 工费浮动总上限 |

> 批量报文下异常码与单条一致，按触发条目抛出并**整批回滚**。

---

### 7. addConstructerForPlatforPm — 新增施工工人

**路径**: `/addConstructerForPlatforPm`
**方法位置**: `A20251208Action.java:121-127`
**Service**: `addConstructerForPlatforPm`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `constructer.cid` | Long | 三选一定位 | 工程 ID |
| `constructer.csid` | Long | 三选一定位 | 环节 ID（与 orderId+cnid 二选一） |
| `constructer.orderId` + `cnid` | String + Integer | 三选一定位 | 装修单号 + 节点 ID |
| `constructer.user.userId` | String | **是** | 工人工号 |

#### 业务逻辑

1. 校验工程存在 → 定位环节（csid 优先，否则按 orderId+cnid）。
2. 校验环节已开工（状态非 INIT，否则 `120026`）。
3. 校验工人存在（`userDao.queryUserByUserId`，否则 `220005`）。
4. 同工程同环节同工人不可重复（否则 `120001`）。
5. 写入 `ConstructerPO`（状态 INIT、回填 cid/csid/orderId/cnid）。

#### 异常场景

| 错误码 | 错误信息 | 触发条件 |
|:------:|---------|:---------|
| 120020 | 工程信息不存在 | cid 查不到工程 |
| 120024 | 工程环节不存在 | 环节查不到 |
| 120026 | 工程环节未开工 | 环节状态为 INIT |
| 220005 | 员工不存在 | 工人工号查不到 |
| 120001 | 工人已添加,不可重复添加 | 重复添加 |

---

### 8. deleteConstructerForPlatforPm — 删除施工工人

**路径**: `/deleteConstructerForPlatforPm`
**方法位置**: `A20251208Action.java:129-135`
**Service**: `deleteConstructerForPlatforPm`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `constructer.crid` | Long | 推荐 | 施工工人记录 ID（推荐方式） |
| `constructer.orderId` + `cnid` + `user.userId` | - | 备选 | 按订单+节点+工号定位 |

#### 业务逻辑

- 定位 `ConstructerPO`（crid 优先，否则按 orderId+cnid+uid）。
- 校验状态为 INIT（否则 `120022`）。
- 校验无工费记录（`workerSalaryDao.countWorkerSalary > 0` 则 `120023`）。
- 逻辑删除：状态置为 `STATUS_DISABLE`。

#### 异常场景

| 错误码 | 错误信息 | 触发条件 |
|:------:|---------|:---------|
| 120021 | 施工人员不存在 | 记录查不到或工人工号查不到 |
| 120022 | 施工人员状态不可操作 | 状态非 INIT |
| 120023 | 施工人员存在工费,不可删除 | 已有 workerSalary 记录 |

---

### 9. syncSupervisorForPlatforPm — 同步工程监理

**路径**: `/syncSupervisorForPlatforPm`
**方法位置**: `A20251208Action.java:137-143`
**Service**: `syncSupervisorForPlatforPm`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `construction.orderId` | String | **是** | 装修单号（内部先执行 `syncConstructionForPlatforPm` 保证工程单存在） |
| `construction.supervisor.userId` | String | 否 | 监理工号；为空时仅同步工程单，不变更监理 |
| `construction.cnid` | Long | 否 | 当前节点 ID（传入则更新） |
| `construction.schedule` | Integer | 否 | 当前节点排序（传入则更新） |
| `construction.process` | Short | 否 | 工程进度：`0`=在施，`1`=完工（传入则更新） |
| `construction.period` | Integer | 否 | 工期（天，传入则更新） |
| `construction.accessory` | Short | 否 | 材料开关（传入则更新） |
| `construction.accessoryLimit` | Long | 否 | 材料限额（传入则更新） |
| `construction.accessoryTotal` | Long | 否 | 材料额（传入则更新） |
| `construction.salaryLimit` | Long | 否 | 工费限额（传入则更新） |
| `construction.salaryLimitTotal` | Long | 否 | 工费总上限（传入则更新） |
| `construction.salaryTotal` | Long | 否 | 工费额（传入则更新） |
| `construction.createTime` | Timestamp | 否 | 创建时间（传入则更新） |
| `construction.preStartTime` | Timestamp | 否 | 预计开工时间（传入则更新） |
| `construction.preEndTime` | Timestamp | 否 | 预计完工时间（传入则更新） |
| `construction.startTime` | Timestamp | 否 | 开工时间（传入则更新；新建工程单时作开工时间） |
| `construction.endTime` | Timestamp | 否 | 完工时间（传入则更新） |
| `construction.finishTime` | Timestamp | 否 | 竣工时间（传入则更新） |
| `construction.processTime` | Timestamp | 否 | 进度变更时间（传入则更新） |
| `construction.workStatus` | Short | 否 | 施工状态（传入则更新） |
| `construction.scheduleStatus` | Short | 否 | 排期状态（传入则更新） |
| `construction.balanceStatus` | Short | 否 | 结算状态（传入则更新） |
| `construction.terminalStatus` | Short | 否 | 终结状态（传入则更新） |

> 监理变更时 `construction.cid` 由服务端回填，调用方无需传。

#### 业务逻辑

1. 先调用 `syncConstructionForPlatforPm`，保证工程单存在。
2. `supervisor.userId` 为空时直接返回，不做监理变更。
3. 校验监理工号存在后，复用 `ConstructionService.updateConstructionByOrderId` 的监理变更逻辑：更新 `construction.supervisor`、`decoration.supervisor`，写施工记录、下发监理变更消息，并按参考逻辑处理服务/销售协作人。

#### 异常场景

| 错误码 | 错误信息 | 触发条件 |
|:------:|---------|:---------|
| 140013 | 装修单不存在 | decorationPO 查不到 |
| 120020 | 工程信息不存在 | 参考监理变更逻辑要求的工程/工程信息查不到 |
| 220005 | 员工不存在 | 监理工号查不到 |

---

### 10. beginConstructionForPlatforPm — 工程开工排期

**路径**: `/beginConstructionForPlatforPm`
**方法位置**: `A20251208Action.java:145-151`
**Service**: `beginConstructionForPlatforPm`（**唯一使用 `queryCompany()` 的接口**）

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `construction.orderId` | String | **是** | 装修单号 |

#### 业务逻辑

1. 按 orderId 查 `decorationPO` / `constructionPO` / `constructionInfoPO`，任一缺失抛 `120020`。
2. 取 `config.WORKER_SALARY_LIMIT_TOTAL_INT`（公司级）作为环节工费总限额。
3. 遍历当前公司所有 `ConstructionNodePO`：
   - 以 `constructionInfoPO.drawlineTime`（缺省 now）为基准，按 `timeLimit` 顺次累加排期。
   - 已存在环节 → 更新 `preStartTime/preEndTime/startTime/endTime/period`；不存在 → 新建 `ConstructionSchedulePO`。
   - 同步更新 `construction` 的 `preStartTime/preEndTime/period`。
4. 若 `decoration.projectStatus == INITIAL` → 推进为 `START`。

#### 异常场景

| 错误码 | 错误信息 | 触发条件 |
|:------:|---------|:---------|
| 120020 | 工程信息不存在 | construction 或 constructionInfo 查不到 |

---

### 11. syncConstructionForPlatforPm — 同步工程单

**路径**: `/syncConstructionForPlatforPm`
**方法位置**: `A20251208Action.java:153-159`
**Service**: `syncConstructionForPlatforPm`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `construction.orderId` | String | **是** | 装修单号 |
| `construction.cnid` | Long | 否 | 当前节点 ID（传入则更新） |
| `construction.schedule` | Integer | 否 | 当前节点排序（传入则更新） |
| `construction.process` | Short | 否 | 工程进度：`0`=在施，`1`=完工（传入则更新） |
| `construction.period` | Integer | 否 | 工期（天，传入则更新） |
| `construction.accessory` | Short | 否 | 材料开关（传入则更新） |
| `construction.accessoryLimit` | Long | 否 | 材料限额（传入则更新；新建时未传则按房屋面积查 `ConstructionCostPO` 或系统配置 `accessoryLimit` 补默认值） |
| `construction.accessoryTotal` | Long | 否 | 材料额（传入则更新） |
| `construction.salaryLimit` | Long | 否 | 工费限额（传入则更新；新建时未传则按 `salaryLimit` 配置/`ConstructionCostPO` 补默认值） |
| `construction.salaryLimitTotal` | Long | 否 | 工费总上限（传入则更新；新建时未传则按 `WORKER_SALARY_LIMIT_TOTAL_INT` 配置补默认值） |
| `construction.salaryTotal` | Long | 否 | 工费额（传入则更新） |
| `construction.createTime` | Timestamp | 否 | 创建时间（传入则更新；新建时缺省 now） |
| `construction.preStartTime` | Timestamp | 否 | 预计开工时间（传入则更新） |
| `construction.preEndTime` | Timestamp | 否 | 预计完工时间（传入则更新） |
| `construction.startTime` | Timestamp | 否 | 开工时间（传入则更新；新建时缺省 now） |
| `construction.endTime` | Timestamp | 否 | 完工时间（传入则更新） |
| `construction.finishTime` | Timestamp | 否 | 竣工时间（传入则更新） |
| `construction.processTime` | Timestamp | 否 | 进度变更时间（传入则更新） |
| `construction.workStatus` | Short | 否 | 施工状态（传入则更新） |
| `construction.scheduleStatus` | Short | 否 | 排期状态（传入则更新） |
| `construction.balanceStatus` | Short | 否 | 结算状态（传入则更新） |
| `construction.terminalStatus` | Short | 否 | 终结状态（传入则更新） |
| `construction.supervisor` | UserBaseVO | 否 | 该接口**不消费**（仅 `syncSupervisorForPlatforPm` 使用）；新建时监理取装修单默认监理 |

> 响应回填：`construction.cid`（工程 ID）。

#### 业务逻辑

1. 按 `orderId` 校验装修单存在，否则 `140013`。
2. 工程单不存在时创建 `ConstructionPO`，写入创建/开工时间、装修单默认监理，按房屋面积参考 `ConstructionCostPO` 或系统配置补默认材料/工费限额，并补齐 `ConstructionInfoPO.cid`。
3. 工程单已存在时只更新外部传入字段，不传的字段保持原值。

#### 异常场景

| 错误码 | 错误信息 | 触发条件 |
|:------:|---------|:---------|
| 140013 | 装修单不存在 | decorationPO 查不到 |

---

### 12. updateAcceptanceForPlatforPm / syncAcceptanceForPlatforPm — 同步工程验收

**路径**: `/syncAcceptanceForPlatforPm`（推荐） / `/updateAcceptanceForPlatforPm`（兼容旧入口）
**方法位置**: `A20251208Action.java:169-175` / `A20251208Action.java:161-167`
**Service**: `syncAcceptanceForPlatforPm`；旧 `updateAcceptanceForPlatforPm` 委托到该方法

#### 请求参数

> 定位与时间由服务端控制：按 `orderId` 查 `AcceptancePO` 定位，`acceptanceTime` 为空时自动补当前日期（格式 `yyyy-MM-dd`）。

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `acceptance.orderId` | String | **是** | 装修单号 |
| `acceptance.acceptanceTime` | String | 否 | 验收时间（`yyyy-MM-dd`；不传自动补当前日期） |
| `acceptance.customer` | String | 否 | 客户姓名 |
| `acceptance.orderAddr` | String | 否 | 工程地址 |
| `acceptance.designer` | String | 否 | 设计师 |
| `acceptance.contractCode` | String | 否 | 合同编号 |
| `acceptance.waterwayQuality` | Integer | 否 | 水路-工程质量评分 |
| `acceptance.waterwayServer` | Integer | 否 | 水路-服务评分 |
| `acceptance.waterwayHygiene` | Integer | 否 | 水路-卫生评分 |
| `acceptance.waterwayDes` | String | 否 | 水路-评语 |
| `acceptance.circuitQuality` | Integer | 否 | 电路-工程质量评分 |
| `acceptance.circuitServer` | Integer | 否 | 电路-服务评分 |
| `acceptance.circuitHygiene` | Integer | 否 | 电路-卫生评分 |
| `acceptance.circuitDes` | String | 否 | 电路-评语 |
| `acceptance.bricklayQuality` | Integer | 否 | 瓦工-工程质量评分 |
| `acceptance.bricklayServer` | Integer | 否 | 瓦工-服务评分 |
| `acceptance.bricklayHygiene` | Integer | 否 | 瓦工-卫生评分 |
| `acceptance.bricklayDes` | String | 否 | 瓦工-评语 |
| `acceptance.carpentQuality` | Integer | 否 | 木工-工程质量评分 |
| `acceptance.carpentServer` | Integer | 否 | 木工-服务评分 |
| `acceptance.carpentHygiene` | Integer | 否 | 木工-卫生评分 |
| `acceptance.carpentDes` | String | 否 | 木工-评语 |
| `acceptance.oilQuality` | Integer | 否 | 油工-工程质量评分 |
| `acceptance.oilServer` | Integer | 否 | 油工-服务评分 |
| `acceptance.oilHygiene` | Integer | 否 | 油工-卫生评分 |
| `acceptance.oilDes` | String | 否 | 油工-评语 |
| `acceptance.supervisId` | String | 否 | 监理工号 |
| `acceptance.supervisName` | String | 否 | 监理姓名 |
| `acceptance.supervisQuality` | Integer | 否 | 监理-质量评分 |
| `acceptance.supervisServer` | Integer | 否 | 监理-服务评分 |
| `acceptance.supervisHygiene` | Integer | 否 | 监理-卫生评分 |
| `acceptance.supervisDes` | String | 否 | 监理-评语 |
| `acceptance.materialQuality` | Integer | 否 | 材料-质量评分 |
| `acceptance.materialServer` | Integer | 否 | 材料-服务评分 |
| `acceptance.materialDes` | String | 否 | 材料-评语 |
| `acceptance.question` | String | 否 | 存在问题 |
| `acceptance.propose` | String | 否 | 整改建议 |
| `acceptance.multiple` | Integer | 否 | 综合评定 |
| `acceptance.Integerernal` | Integer | 否 | 内部评定 |
| `acceptance.actId` | Integer | 否 | 验收记录 ID（不用于定位，传不传无效果） |

#### 业务逻辑

1. 校验装修单存在。
2. 款项校验：`paySacle < config.CONSTRUCTION_ACCEPTANCE_LIMIT_INT`（缺省 80）→ `120018`。
3. 按 `orderId` 查 `AcceptancePO`：不存在则新建，存在则更新；`acceptanceTime` 为空时补当前时间。
4. 拷贝 VO 到 PO 后 `saveOrUpdate`。
5. 参考 `AcceptanceService.updateAcceptance` 推进装修单 `projectStatus = FINISH`，推进工程 `endTime/finishTime/process`。
6. 当前同步入口暂不直接创建事件 `messagequeuing/messagecueuing` 数据。

#### 异常场景

| 错误码 | 错误信息 | 触发条件 |
|:------:|---------|:---------|
| 140013 | 装修单不存在 | decorationPO 查不到 |
| 120018 | 装修款比例不足 | `paySacle < acceptanceLimit` |
| 120020 | 工程信息不存在 | constructionPO 查不到 |

---

### 13. syncConstructionNodeForPlatforPm — 同步工程节点

**路径**: `/syncConstructionNodeForPlatforPm`
**方法位置**: `A20251208Action.java:177-183`
**Service**: `syncConstructionNodeForPlatforPm`

#### 请求参数

> 同一动作字段在新增/更新两个分支的消费范围不同（新增走 `addConstructionNode`，更新走 `updateConstructionNode`），下表"分支"列标注：**A**=仅新增消费，**U**=仅更新消费，A/U=两者均消费。

| 参数名 | 类型 | 分支 | 必填 | 说明 |
|--------|------|:----:|:----:|------|
| `constructionNode.cnid` | Long | - | 否 | 节点 ID；为空或查不到时走新增，否则走更新 |
| `constructionNode.name` | String | A | 新增必填 | 节点名称（更新分支不修改名称） |
| `constructionNode.precheck` | Integer | U | 否 | 开工前装修款比例阈值（‰）；新增时强制 0 |
| `constructionNode.postcheck` | Integer | U | 否 | 完工后装修款比例阈值（‰）；新增时强制 0 |
| `constructionNode.stacheck` | Integer | U | 否 | 开工前销售款比例阈值（‰）；新增时强制 0 |
| `constructionNode.fincheck` | Integer | U | 否 | 完工后销售款比例阈值（‰）；新增时强制 0 |
| `constructionNode.timeLimit` | Integer | U | 否 | 工期（天）；新增时强制 0 |
| `constructionNode.startalk` | String | A/U | 否 | 进场播报文案 |
| `constructionNode.endtalk` | String | A/U | 否 | 完工播报文案 |
| `constructionNode.kino` | String | A/U | 否 | 关联业务编码 |
| `constructionNode.kiname` | String | A/U | 否 | 关联业务名称 |
| `constructionNode.mark` | Short | A/U | 否 | 节点标记：`1`=开工节点（MARK_START），`2`=竣工节点（MARK_FINISH） |
| `constructionNode.account` | Short | A/U | 否 | 记账标记：`0`=不记账（缺省），`1`=记账 |
| `constructionNode.accessoryLimit` | Integer | A/U | 否 | 节点级材料限额 |
| `constructionNode.salaryLimit` | Integer | A/U | 否 | 节点级工费限额 |
| `constructionNode.process` | Short | A/U | 否 | 所属进程组 |
| `constructionNode.proset` | Short | A/U | 否 | 进程集合 |
| `constructionNode.startSurvey.stid` | Integer | U | 否 | 开工问卷模板 ID（更新时传入则绑定，否则置空） |
| `constructionNode.endSurvey.stid` | Integer | U | 否 | 完工问卷模板 ID（更新时传入则绑定，否则置空） |
| `constructionNode.sort` | Short | - | - | 排序；**两个分支均不消费**（历史字段，传入无效） |
| `constructionNode.checkout` / `status` / `company` | - | - | - | 该接口不消费 |

#### 业务逻辑

- `cnid` 为空或查不到 → 调 `constructionNodeService.addConstructionNode` 新增（比例阈值/工期强制 0，写 `NODE_CREATED` 消息队列事件）。
- 否则 → 调 `constructionNodeService.updateConstructionNode` 更新（注意：`name` 与 `sort` 不会被更新；两个问卷字段传 `stid` 才绑定、不传会被置空），写 `NODE_UPDATED` 消息队列事件。
- 不调用 `updateConstructionNodeForStatus`，基础节点禁用不在同步范围内（单条同步不支持禁用/删除）。

---

## 四、错误码速查表

| 错误码 | 错误信息 | 分类 | 涉及接口 |
|--------|---------|------|----------|
| -1 | 无操作权限 | 权限 | saveOrUpdateUser / tranUser / quitUser |
| 120001 | 当前工人已经添加,不能重复添加同一工人 | 工人 | addConstructer |
| 120018 | 装修款比例不足 | 款项 | begin/finishConstructionSchedule, updateAcceptance |
| 120020 | 工程信息不存在 | 工程 | 多个施工接口 |
| 120021 | 施工人员不存在 | 工人 | deleteConstructer |
| 120022 | 施工人员状态不可操作 | 工人 | deleteConstructer |
| 120023 | 施工人员存在工费,不可删除 | 工人 | deleteConstructer |
| 120024 | 工程环节不存在 | 环节 | begin/finish/syncConstructionSchedule, addConstructer |
| 120025 | 工程环节不可操作 | 环节 | begin/finishConstructionSchedule |
| 120026 | 工程环节未开工 | 环节 | addConstructer |
| 120033 | 销售比例不足 | 款项 | begin/finishConstructionSchedule |
| 130026 | 工程节点不存在 | 节点 | begin/finishConstructionSchedule, syncConstructionNodes |
| 140013 | 订单不存在 | 装修单 | syncConstructionForPlatforPm, updateAcceptance |
| 190005 | 人员不存在 | 人员 | saveOrUpdateUser(更新), tranUser, quitUser |
| 190011 | 人员数量已达上限 | 人员 | saveOrUpdateUser |
| 190013 | 登录名已存在 | 人员 | saveOrUpdateUser(新增) |
| 220005 | 员工不存在 | 人员 | addConstructer |
| 230010 | 角色不存在 | 系统 | saveOrUpdateUser, quitUser |
| 230015 | 公司不存在 | 系统 | saveOrUpdateUser(新增) |
| 310001 | 部门不存在 | 部门 | tranUser |
| 310002 | 部门不可添加人员 | 部门 | saveOrUpdateUser, tranUser |

---

## 五、相关文档

- [A20260103Action_API.md](./A20260103Action_API.md) — 客户线索接入接口
- [SEIYA_SYNC_API.md](./SEIYA_SYNC_API.md) — 职位/部门/用户同步接口（A20260324）

---

## 六、变更记录

### 2026-06-30
- 初始版本：基于 `A20251208Action.java` + `A20251208ServiceImpl.java` 输出完整 12 个接口文档
- 覆盖人员管理（3 个）+ 施工管理（9 个）两大类
- 标注已知问题：`deleteConstructerForPlatforPm` 中 `ServiceImpl:849` 的条件判断存在空指针风险，建议调用方优先传 `crid`

### 2026-08-20
- 参数全量化：消除所有"参考其他接口"式参数描述，逐一展开为完整字段表
  - `saveOrUpdateUserForPlatforPm`：展开 `userInfo.user.*`（UserVO）与 `userInfo.*`（UserInfoVO）全字段，标注 BeanUtil 拷贝排除项与服务端控制项
  - `tranUserForPlatforPm`：`user.*` 字段逐行列出
  - `syncSupervisorForPlatforPm` / `syncConstructionForPlatforPm`：`construction.*` 全字段逐行列出（两者消费范围差异已标注）
  - `syncAcceptanceForPlatforPm`：`acceptance.*`（AcceptanceVO）38 个字段全量列出（水路/电路/瓦工/木工/油工/监理/材料七组评分）
  - `syncConstructionNodeForPlatforPm`：`constructionNode.*` 全字段，按新增/更新分支标注消费范围（新增不消费比例阈值与工期，更新不改 name/sort，问卷不传置空）
- 补充 `syncConstructionScheduleForPlatforPm` 的 `node.cnid` 备用定位方式
- 修正 120001 错误消息与 error.md 一致（"工人已添加,不可重复添加"）

### 2026-09-23
- 新增第 14 节 `syncConstructionNodesForPlatforPm`（批量同步工程节点）：`List<ConstructionNodeVO>` 入参（Struts2 List 索引绑定 `constructionNodes[i].*`），整批一个事务、空列表 no-op
- 三种意图按字段分流：`cnid` 空=新增 / `cnid`+`status=1`=**禁用即逻辑删除**（仅 cnid+status 最小报文）/ 其余=全量更新（显式 `status=0` 覆盖恢复启用）
- data 模块配套：`ConstructionNodePO` 新增 `STATUS_DISABLE_SHORT=1` 常量；`countConstructionNode` 增加 `status=0` 过滤（禁用节点不再阻塞工序推进）
- 发版约束：`fanglin-seiya-8.3.029.jar` + `fanglin-data-8.3.029.jar` 两 jar 同批
- 已知约束：`sort` 服务端不落库（排序仍由 SQL 脚本维护），新增节点须尾部追加后调序；新增分支无同名查重
- 单条兼容：批量接口同时兼容旧单条接口参数键 `constructionNode.*`（单数、无下标），复数键缺省而单数键存在时自动包装为单元素批量执行；传单个节点也可用标准格式 `constructionNodes[0].*`

### 2026-09-24
- **方向修正**：批量同步的正确目标是工程环节（`constructionSchedule`，业务实例），而非工程节点（`constructionNode`，基础数据）。2026-09-23 误加的批量接口 `syncConstructionNodesForPlatforPm`（原第 14 节）**整体移除**，单条接口 [13](#13-syncconstructionnodeforplatforpm--同步工程节点) 保留不动
- 批量能力落在 [6. syncConstructionScheduleForPlatforPm](#6-syncconstructionscheduleforplatforpm--同步工程环节单条批量)（**URL 不变**）：支持 `constructionSchedules[i].*` 索引绑定整批一个事务，逐条执行"定位→不存在新增→按传入字段更新"，空列表 no-op；兼容旧单条键 `constructionSchedule.*`（复数缺省而单数存在时包装单元素执行，单条响应字段照常回填）
- Service 层：删除 `syncConstructionNodesForPlatforPm`，新增 `syncConstructionSchedulesForPlatforPm(List<ConstructionScheduleVO>)`
- data 模块不受影响：`ConstructionNodePO.STATUS_DISABLE_SHORT` 常量与 `countConstructionNode` 的 `status=0` 过滤系禁用语义的独立修复，保留；本轮仅重发 `fanglin-seiya-8.3.029.jar`（复用累积号），data jar 沿用已构建版本
