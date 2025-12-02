# personel - 人事管理模块

[根目录](../../../CLAUDE.md) > [src](../../) > [com/fanglin](..) > **personel**

> 最后更新：2025-12-01 18:30:02

---

## 模块职责

personel 模块负责系统的**人力资源管理**，涵盖员工档案、入离职管理、考勤管理、绩效管理、合同管理、供应商管理等功能，是系统用户与组织架构的核心管理模块。

**核心功能**
- 员工档案管理（用户信息、教育经历、工作经验）
- 入职/离职/调岗流程
- 劳动合同管理（含电子签）
- 考勤管理
- 绩效管理
- 招聘管理
- 供应商管理
- 供应商合同管理
- 商户管理
- 员工角色与权限

---

## 入口与启动

### 控制器入口
- `UserAction` - 员工核心管理
- `UserContractAction` - 劳动合同管理
- `UserEducationAction` - 教育经历
- `UserExperienceAction` - 工作经验
- `AttendanceAction` - 考勤管理
- `PerformanceAction` - 绩效管理
- `RecruitmentAction` - 招聘管理
- `SupplierAction` - 供应商管理
- `SupplierContractAction` - 供应商合同
- `MerchantAction` - 商户管理
- `UserRoleAction` - 用户角色
- `UserFunctionAction` - 用户功能权限
- `UserPartnerAction` - 合伙人管理
- `UserOperationAction` - 员工操作记录

### 前端页面
- `WebContent/views/personel/user.html` - 员工列表（缺失，需在其他目录）
- `WebContent/views/personel/userInfo.html` - 员工详情
- `WebContent/views/personel/userContract.html` - 合同管理
- `WebContent/views/personel/attendance.html` - 考勤管理

---

## 对外接口

### 员工管理
```java
// 分页查询员工
GET/POST /pageUser.do
Request: Paging + Filters + user + company
Response: { data: [...], total, pages }

// 分页查询员工详细信息
GET/POST /pageUserInfo.do
Request: Paging + Filters + company
Response: { data: [...] }

// 根据模块查询用户
GET/POST /pageUserByMid.do
Request: Paging + Filters + module + company
Response: { data: [...] }

// 根据登录ID查询用户
GET/POST /queryUserByLoginId.do
Request: { userId }
Response: { user: {...} }

// 根据用户ID查询用户
GET/POST /queryUserByUserId.do
Request: { userId }
Response: { user: {...} }

// 根据用户ID查询详细信息
GET/POST /queryUserInfoByUserId.do
Request: { userId }
Response: { userInfo: {...} }

// 查询自己的信息
GET/POST /queryUserForSelfByUserId.do
Response: { userInfo: {...} }

// 根据拼音查询用户
GET/POST /queryUserByPinyin.do
Request: { pinyinName, user, departmentType, company }
Response: { autoFillKeyValue: [...], autoFillList: [...] }

// 根据UID列表查询用户
GET/POST /queryUserByUids.do
Request: { uids: [...] }
Response: { autoFillKeyValue: [...] }

// 新增员工
POST /addUser.do
Request: {
  userInfo: {...},
  userContracts: [...],
  userEducations: [...],
  userOperations: [...],
  company, userId
}
Response: success

// 更新员工信息
POST /updateUser.do
Request: { userInfo, company, userId }
Response: success

// 更新员工高级信息
POST /updateUserForAdvance.do
Request: { user, roleId, userId }
Response: success

// 更新员工头像
POST /updateUserForPhoto.do
Request: { user.photo }
Response: success

// 员工离职
POST /quitUser.do
Request: { userId, approve: "agree" }
Response: success

// 员工调岗
POST /tranUser.do
Request: { user, approve: "agree", userId, roleId }
Response: success

// 重置密码
POST /resetPassword.do
Request: { user, company }
Response: success

// 修改密码
POST /changePassword.do
Request: { userId, password, rePassword }
Response: success

// 默认密码
POST /defaultPassword.do
Request: { userId, company }
Response: success

// 注册用户
POST /registUser.do
Request: { user }
Response: success

// 重置用户
POST /resetUser.do
Request: { user }
Response: success

// 认证用户
POST /authUser.do
Request: { user }
Response: { redirect }

// 确认用户
POST /confirmUser.do
Request: { user }
Response: success

// 签名设置
POST /signateUser.do
Request: { user, imgbase }
Response: success

// 更新基本信息
POST /updateUserForBaseInfo.do
Request: { userInfo }
Response: success

// 更新个人资料
POST /updateUserForProfile.do
Request: { userInfo }
Response: success
```

### 考勤管理
```java
// 查询考勤记录
GET/POST /queryAttendance.do
Request: userId
Response: { attendances: [...] }

// 考勤报表
GET/POST /reportAttendance.do
Request: userId
Response: { option: {...} }  // ECharts 配置
```

### 劳动合同管理
```java
// 分页查询合同
GET/POST /pageUserContract.do
Request: Paging + Filters
Response: { contracts: [...] }

// 新增合同
POST /addUserContract.do
Request: { userContract }
Response: success

// 更新合同
POST /updateUserContract.do
Request: { userContract }
Response: success
```

### 供应商管理
```java
// 分页查询供应商
GET/POST /pageSupplier.do
Request: Paging + Filters + company
Response: { suppliers: [...] }

// 新增供应商
POST /addSupplier.do
Request: { supplier, company }
Response: success

// 更新供应商
POST /updateSupplier.do
Request: { supplier }
Response: success
```

### 供应商合同管理
```java
// 分页查询供应商合同
GET/POST /pageSupplierContract.do
Request: Paging + Filters
Response: { contracts: [...] }

// 新增供应商合同
POST /addSupplierContract.do
Request: { contract, company }
Response: success
```

---

## 关键依赖与配置

### 核心依赖
- `com.fanglin.system` - 公司、部门、角色、权限
- `com.fanglin.communion` - 部门、岗位基础数据
- `com.fanglin.fadada` - 法大大电子签（合同签署）
- `com.fanglin.approval` - 审批流程（入离职审批）

### 导航配置
- `ds/personel.json` - 人事管理菜单配置
  - 员工管理
  - 考勤管理
  - 绩效管理
  - 招聘管理
  - 供应商管理
  - 合同管理

---

## 数据模型

### 核心实体（PO）

#### UserPO - 用户（员工）
```java
@Entity
@Table(name = "user", catalog = "communion")
- uid: int                      // 用户ID
- userId: String                // 工号
- oldUserId: String             // 旧工号
- password: String              // 密码（MD5加密）
- name: String                  // 姓名
- gender: short                 // 性别
- mobile: String                // 手机号
- email: String                 // 邮箱
- photo: String                 // 头像
- signature: String             // 签名
- entryTime: Timestamp          // 入职时间
- quitTime: Timestamp           // 离职时间
- status: short                 // 状态（在职/离职）
- company: CompanyPO            // 公司
- department: DepartmentPO      // 部门
- role: RolePO                  // 角色
- position: PositionPO          // 岗位
```

#### UserContractPO - 劳动合同
```java
@Entity
@Table(name = "userContract", catalog = "communion")
- ucid: long                    // 合同ID
- uid: int                      // 员工ID
- cid: long                     // 法大大合同ID
- no: String                    // 合同编号
- name: String                  // 合同名称
- title: String                 // 合同标题
- signTime: String              // 签订时间
- startTime: String             // 开始时间
- endTime: String               // 结束时间
- creater: UserPO               // 创建人
- signner: UserPO               // 签署人
- comsignTime: Timestamp        // 公司签署时间
- cussignTime: Timestamp        // 员工签署时间
- status: short                 // 状态
  - 0: 初始
  - 1: 无效
  - 2: 已签
  - 3: 归档
- download: String              // 下载链接
- viewpdf: String               // 预览链接
- comment: String               // 备注
```

#### UserEducationPO - 教育经历
```java
@Entity
- ueid: long                    // 经历ID
- user: UserPO                  // 员工
- school: String                // 学校
- major: String                 // 专业
- education: String             // 学历
- startTime: String             // 开始时间
- endTime: String               // 结束时间
```

#### UserExperiencePO - 工作经验
```java
@Entity
- ueid: long                    // 经验ID
- user: UserPO                  // 员工
- company: String               // 公司
- position: String              // 职位
- startTime: String             // 开始时间
- endTime: String               // 结束时间
- description: String           // 工作描述
```

#### AttendancePO - 考勤记录
```java
@Entity
- aid: long                     // 考勤ID
- user: UserPO                  // 员工
- date: Date                    // 日期
- checkInTime: Timestamp        // 签到时间
- checkOutTime: Timestamp       // 签退时间
- status: short                 // 状态（正常/迟到/早退/缺勤）
- remark: String                // 备注
```

#### PerformancePO - 绩效记录
```java
@Entity
- pid: long                     // 绩效ID
- user: UserPO                  // 员工
- period: String                // 考核周期
- score: int                    // 绩效分数
- level: String                 // 绩效等级
- creater: UserPO               // 创建人
- createTime: Timestamp         // 创建时间
```

#### RecruitmentPO - 招聘信息
```java
@Entity
- rid: long                     // 招聘ID
- position: String              // 招聘岗位
- count: int                    // 招聘人数
- requirement: String           // 岗位要求
- status: short                 // 状态（招聘中/已关闭）
- createTime: Timestamp         // 发布时间
```

#### SupplierPO - 供应商
```java
@Entity
- sid: long                     // 供应商ID
- name: String                  // 供应商名称
- contact: String               // 联系人
- mobile: String                // 联系电话
- address: String               // 地址
- category: String              // 供应品类
- level: short                  // 供应商等级
- company: int                  // 公司
- status: short                 // 状态
```

#### SupplierContractPO - 供应商合同
```java
@Entity
- scid: long                    // 合同ID
- supplier: SupplierPO          // 供应商
- no: String                    // 合同编号
- name: String                  // 合同名称
- signTime: Timestamp           // 签订时间
- startTime: String             // 开始时间
- endTime: String               // 结束时间
- amount: long                  // 合同金额
- status: short                 // 状态
```

### 值对象（VO）
- `UserVO` - 用户视图对象
- `UserInfoVO` - 用户详细信息视图
- `UserBaseVO` - 用户基本信息
- `UserContractVO` - 合同视图
- `UserEducationVO` - 教育经历视图
- `UserExperienceVO` - 工作经验视图
- `AttendanceVO` - 考勤视图
- `PerformanceVO` - 绩效视图
- `SupplierVO` - 供应商视图

---

## 员工状态流转

```
入职 → 在职 → 离职
         ↓
      调岗（部门/岗位变更）
```

---

## 测试与质量

### 当前测试覆盖
- 未发现独立的测试文件
- 依赖手工测试

### 建议增强
1. 为员工入离职流程添加单元测试
2. 测试合同签署流程
3. 验证考勤统计的准确性
4. 测试权限变更的影响范围

---

## 常见问题 (FAQ)

**Q: 如何新增员工？**
A: 调用 `addUser.do`，需提供：
- 基本信息（userInfo）
- 劳动合同（userContracts）
- 教育经历（userEducations）
- 操作记录（userOperations）

**Q: 员工离职流程是什么？**
A:
1. 发起离职申请
2. 审批通过后调用 `quitUser.do`
3. 系统更新员工状态为离职
4. 相关业务数据归档

**Q: 劳动合同如何签署？**
A: 通过法大大电子签集成：
1. 创建合同（addUserContract）
2. 发起签署流程
3. 员工在线签署
4. 公司盖章
5. 合同归档

**Q: 考勤如何统计？**
A:
- AttendanceAction 查询考勤记录
- reportAttendance 生成统计报表（ECharts 图表）
- 支持月度、年度统计

**Q: 如何重置员工密码？**
A:
- 管理员：调用 `resetPassword.do` 或 `defaultPassword.do`
- 员工自己：调用 `changePassword.do`

**Q: 供应商管理的作用是什么？**
A:
- 管理材料供应商信息
- 管理供应商合同
- 关联采购订单
- 供应商评级

---

## 相关文件清单

### 核心代码
```
src/com/fanglin/personel/
├── action/
│   ├── UserAction.java                   - 员工核心管理 ★
│   ├── UserContractAction.java           - 劳动合同
│   ├── UserEducationAction.java          - 教育经历
│   ├── UserExperienceAction.java         - 工作经验
│   ├── AttendanceAction.java             - 考勤管理 ★
│   ├── PerformanceAction.java            - 绩效管理
│   ├── RecruitmentAction.java            - 招聘管理
│   ├── SupplierAction.java               - 供应商管理 ★
│   ├── SupplierContractAction.java       - 供应商合同
│   ├── MerchantAction.java               - 商户管理
│   ├── UserRoleAction.java               - 用户角色
│   ├── UserFunctionAction.java           - 用户功能权限
│   └── UserPartnerAction.java            - 合伙人管理
├── service/
│   ├── UserService.java                  - 员工服务
│   ├── AttendanceService.java            - 考勤服务
│   ├── PerformanceService.java           - 绩效服务
│   ├── SupplierService.java              - 供应商服务
│   └── UserContractService.java          - 合同服务
├── dao/
│   ├── UserDao.java                      - 员工DAO
│   ├── UserInfoDao.java                  - 员工信息DAO
│   ├── AttendanceDao.java                - 考勤DAO
│   ├── SupplierDao.java                  - 供应商DAO
│   └── UserContractDao.java              - 合同DAO
├── po/
│   ├── UserPO.java                       - 用户实体（定义在communion）
│   ├── UserContractPO.java               - 劳动合同实体 ★
│   ├── UserEducationPO.java              - 教育经历实体
│   ├── UserExperiencePO.java             - 工作经验实体
│   ├── AttendancePO.java                 - 考勤实体
│   ├── PerformancePO.java                - 绩效实体
│   ├── RecruitmentPO.java                - 招聘实体
│   ├── SupplierPO.java                   - 供应商实体
│   └── SupplierContractPO.java           - 供应商合同实体
└── vo/
    ├── UserVO.java                       - 用户VO
    ├── UserInfoVO.java                   - 用户详细信息VO
    ├── UserContractVO.java               - 合同VO
    ├── AttendanceVO.java                 - 考勤VO
    └── SupplierVO.java                   - 供应商VO
```

**★ 标注的是最常用的核心功能**

---

## 变更记录 (Changelog)

### 2025-12-01 18:30:02
- 初始化人事管理模块 AI 上下文文档
- 记录员工档案、考勤、绩效、合同等功能
- 补充供应商管理说明
- 添加员工状态流转与常见问题解答
