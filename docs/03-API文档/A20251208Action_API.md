# A20251208Action 平台项目对接接口文档

> 最后更新：2026-06-30
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
  - [6. syncConstructionScheduleForPlatforPm](#6-syncconstructionscheduleforplatforpm--同步工程环节)
  - [7. addConstructerForPlatforPm](#7-addconstructerforplatforpm--新增施工工人)
  - [8. deleteConstructerForPlatforPm](#8-deleteconstructerforplatforpm--删除施工工人)
  - [9. beginConstructionForPlatforPm](#9-beginconstructionforplatforpm--工程开工排期)
  - [10. syncConstructionForPlatforPm](#10-syncconstructionforplatforpm--同步工程成本限额)
  - [11. updateAcceptanceForPlatforPm](#11-updateacceptanceforplatforpm--更新工程验收)
  - [12. syncConstructionNodeForPlatforPm](#12-syncconstructionnodeforplatforpm--同步工程节点)
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

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `userInfo` | UserInfoVO | **是** | 人员信息载体（含 user、gender、fangliner 等） |
| `userInfo.user` | UserVO | **是** | 用户主体（userId / phone / identity / loginId / dept.did / duty.did / currentName / operateTime / status） |
| `userInfo.user.dept.did` | Integer | **是** | 目标部门 ID（必须存在且有父分区） |
| `userInfo.user.duty.did` | Integer | **是** | 目标职位 ID |
| `userInfo.fangliner.userId` | String | 否 | 介绍人工号（传则关联） |

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
| `user` | UserVO | **是** | `user.userId`（目标人员工号）、`user.dept.did`（新部门）、`user.isPrefor`、`user.operateTime` |

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

### 6. syncConstructionScheduleForPlatforPm — 同步工程环节

**路径**: `/syncConstructionScheduleForPlatforPm`
**方法位置**: `A20251208Action.java:113-119`
**Service**: `syncConstructionScheduleForPlatforPm`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `constructionSchedule.csid` | Long | **是** | 工程环节 ID |
| `constructionSchedule.precheck` | Integer | 否 | 开工前装修款比例阈值（‰） |
| `constructionSchedule.postcheck` | Integer | 否 | 完工后装修款比例阈值（‰） |
| `constructionSchedule.stacheck` | Integer | 否 | 开工前销售款比例阈值（‰） |
| `constructionSchedule.fincheck` | Integer | 否 | 完工后销售款比例阈值（‰） |

#### 业务逻辑

按 csid 定位环节，更新 4 个比例阈值字段。仅用于平台侧维护环节的款项门槛。

#### 异常场景

| 错误码 | 错误信息 | 触发条件 |
|:------:|---------|:---------|
| 120024 | 工程环节不存在 | csid 查不到 |

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
| 120001 | 当前工人已经添加,不能重复添加同一工人 | 重复添加 |

---

### 8. deleteConstructerForPlatforPm — 删除施工工人

**路径**: `/deleteConstructerForPlatforPm`
**方法位置**: `A20251208Action.java:129-135`
**Service**: `deleteConstructerForPlatforPm`

> 注意：源码 `ServiceImpl:849` 的判断 `constructerVO.getUser() == null && constructerVO.getUser().getUserId() == null` 存在 **空指针风险**（`&&` 左边为 true 时右边必 NPE），实际语义应为按 `crid` 定位；调用方建议**始终传 `crid`** 走分支一。

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

### 9. beginConstructionForPlatforPm — 工程开工排期

**路径**: `/beginConstructionForPlatforPm`
**方法位置**: `A20251208Action.java:137-143`
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

### 10. syncConstructionForPlatforPm — 同步工程成本限额

**路径**: `/syncConstructionForPlatforPm`
**方法位置**: `A20251208Action.java:145-151`
**Service**: `syncConstructionForPlatforPm`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `construction.orderId` | String | **是** | 装修单号 |

#### 业务逻辑

1. 按 orderId 查 `decorationPO`（否则 `140013`）与 `constructionPO`（否则 `120020`）。
2. 按 `house.buildArea` + 公司查 `ConstructionCostPO`（成本阶梯表）：
   - **命中**：用成本表的 `accessory / salary` 设置工程的辅材限额、工费限额、工费总限额。
   - **未命中**：回退到 `config.accessoryLimit` / `config.salaryLimit` / `config.WORKER_SALARY_LIMIT_TOTAL_INT`（均有默认值）。

#### 异常场景

| 错误码 | 错误信息 | 触发条件 |
|:------:|---------|:---------|
| 140013 | 订单不存在 | decorationPO 查不到 |
| 120020 | 工程信息不存在 | constructionPO 查不到 |

---

### 11. updateAcceptanceForPlatforPm — 更新工程验收

**路径**: `/updateAcceptanceForPlatforPm`
**方法位置**: `A20251208Action.java:153-159`
**Service**: `updateAcceptanceForPlatforPm`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `acceptance.orderId` | String | **是** | 装修单号 |
| `acceptance` 其他字段 | - | 否 | 验收信息（`BeanUtil.copyProperties` 整体覆盖） |

#### 业务逻辑

1. 校验装修单存在。
2. **款项校验**：`paySacle < config.CONSTRUCTION_ACCEPTANCE_LIMIT_INT`（缺省 80）→ `120018`。
3. 按 orderId 查 `AcceptancePO`：不存在则新建（`acceptanceTime = now`）。
4. 拷贝 VO → PO，`saveOrUpdate`。
5. 推进装修单 `projectStatus = FINISH`；推进工程 `endTime`/`finishTime`，`process` 若为 INIT 则置 FINISH。

#### 异常场景

| 错误码 | 错误信息 | 触发条件 |
|:------:|---------|:---------|
| 140013 | 订单不存在 | decorationPO 查不到 |
| 120018 | 装修款比例不足 | `paySacle < acceptanceLimit` |
| 120020 | 工程信息不存在 | constructionPO 查不到 |

---

### 12. syncConstructionNodeForPlatforPm — 同步工程节点

**路径**: `/syncConstructionNodeForPlatforPm`
**方法位置**: `A20251208Action.java:161-167`
**Service**: `syncConstructionNodeForPlatforPm`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|:----:|------|
| `constructionNode.cnid` | Integer | 否 | 节点 ID（空则新增，有则更新） |
| `constructionNode` 其他字段 | - | 是 | 节点信息（name/sort/timeLimit/process/mark 等） |

#### 业务逻辑

- `cnid` 为空或查不到 → 调 `constructionNodeService.addConstructionNode`（新增）。
- 否则 → 调 `constructionNodeService.updateConstructionNode`（更新）。

> 节点的具体字段与校验逻辑详见 `ConstructionNodeService`，本接口仅做转发。

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
| 130026 | 工程节点不存在 | 节点 | begin/finishConstructionSchedule |
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
