# API 契约文档 (P1)

> 783 个 API 端点的 TypeScript 类型定义模板 — 请求参数 + 响应类型 + 错误码

---

## 目录

1. [通用类型体系](#一通用类型体系)
2. [Decoration 装修模块 API 契约 (149个)](#二decoration-装修模块-api-契约)
3. [Payment 付款模块 API 契约 (136个)](#三payment-付款模块-api-契约)
4. [Sales 销售模块 API 契约 (110个)](#四sales-销售模块-api-契约)
5. [Quotation 报价模块 API 契约 (388个)](#五quotation-报价模块-api-契约)
6. [Common 跨模块共享 API 契约](#六common-跨模块共享-api-契约)
7. [错误码规范](#七错误码规范)
8. [API 文件目录结构](#八api-文件目录结构)

---

## 一、通用类型体系

### 1.1 基础响应类型

```typescript
// src/api/types.ts

/** 通用响应包装 */
export interface ApiResponse<T = any> {
  code: number       // 0=成功, 1=业务错误, 401=未授权, 403=无权限, 500=服务器错误
  msg: string        // 错误描述
  data: T            // 业务数据
}

/** 分页响应 */
export interface PageResult<T = any> {
  list: T[]          // 数据列表
  count: number      // 总记录数
  page?: number      // 当前页码
  size?: number      // 每页条数
}

/** 分页请求参数 */
export interface PageQuery {
  page: number       // 页码, 从1开始
  size: number       // 每页条数, 默认20
  sortField?: string // 排序字段
  sortOrder?: 'asc' | 'desc'  // 排序方向
}
```

### 1.2 通用业务类型

```typescript
// src/api/types.ts (续)

/** 通用操作结果 */
export interface OperateResult {
  success: boolean
  message: string
}

/** ID 列表批量操作请求 */
export interface BatchIdsRequest {
  ids: number[]
}

/** 状态变更请求 */
export interface StatusChangeRequest {
  id: number
  status: number
  reason?: string
}

/** 树形节点 (施工节点/组织架构等) */
export interface TreeNode {
  id: number
  parentId: number | null
  label: string
  value: string | number
  children?: TreeNode[]
  disabled?: boolean
  extra?: Record<string, any>
}

/** 字典项 */
export interface DictItem {
  key: string
  value: string | number
  label: string
  color?: string
  sort?: number
}

/** 选项组 (下拉框/搜索) */
export interface OptionItem {
  label: string
  value: string | number
  disabled?: boolean
  extra?: Record<string, any>
}

/** 附件信息 */
export interface AttachmentItem {
  id: number
  name: string
  url: string
  size: number
  type: string     // 文件MIME类型
  uploadTime: string
  uploader: string
}
```

### 1.3 时间与金额

```typescript
// src/api/types.ts (续)

/** 时间范围查询 */
export interface DateRangeQuery {
  startTime?: string   // 格式 yyyy-MM-dd HH:mm:ss
  endTime?: string     // 格式 yyyy-MM-dd HH:mm:ss
}

/** 金额统计 */
export interface AmountSummary {
  total: number        // 总金额
  received: number     // 已收金额
  balance: number      // 余额
  frozen: number       // 冻结金额
}

/** 金额明细 */
export interface AmountDetail {
  amount: number       // 金额
  type: number         // 类型: 1=收入, 2=支出, 3=退款
  method: number       // 支付方式
  remark: string
  operator: string
  createTime: string
}
```

### 1.4 用户与权限

```typescript
// src/api/types.ts (续)

/** 简要用户信息 */
export interface UserBrief {
  id: number
  name: string
  pinyin?: string     // 拼音, 用于搜索
  dept?: string       // 部门
  role?: string       // 角色
  phone?: string
}

/** 组织架构 */
export interface Organization {
  id: number
  name: string
  parentId: number | null
  type: number        // 1=公司, 2=部门, 3=小组
  managerId?: number
  managerName?: string
  children?: Organization[]
}

/** 菜单/权限项 */
export interface PermissionItem {
  id: number
  name: string
  code: string        // 如 'decoration:create', 'payment:refund'
  type: number        // 1=菜单, 2=按钮, 3=API
  parentId: number
  path?: string
  icon?: string
  sort: number
}
```

---

## 二、Decoration 装修模块 API 契约

### 2.1 装修单 (Decoration) — 67个端点

#### 2.1.1 装修单 VO (View Object)

```typescript
// src/api/decoration/types.ts

/** 装修单完整视图 */
export interface DecorationVO {
  id: number
  orderId: string           // 装修单号, 如 'ZX20260401001'
  customerId: number
  customerName: string
  customerPhone: string
  designerId: number
  designerName: string
  salesmanId: number
  salesmanName: string
  houseId: number
  houseName: string
  village: string           // 楼盘/小区
  address: string           // 详细地址
  area: number              // 面积(平方米)
  decorationType: number    // 装修类型: 0=半包, 1=整装, 2=全包
  decorationTypeName: string
  status: number            // 状态: 0=待报价, 1=已报价, 2=已签约, 3=施工中, 4=已完工, 5=已验收, 6=已结算, -1=已作废, -2=已终止
  statusName: string
  versionId: number         // 当前版本
  versionName: string
  contractId: number
  payScale: number          // 付款比例(%)
  saleScale: number         // 销售比例(%)
  remark: string
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
  quotationCount: number    // 报价单数量
  paymentCount: number      // 收款记录数
  isLocked: boolean         // 是否锁定
}

/** 装修单列表项 (分页查询返回) */
export interface DecorationListItem extends DecorationVO {
  quotationAmount: number   // 报价金额
  receivedAmount: number    // 已收金额
  balanceAmount: number     // 未收金额
  activityCount: number     // 活动数量
  scheduleStatus: string    // 施工进度
}
```

#### 2.1.2 装修单查询参数

```typescript
// src/api/decoration/types.ts (续)

/** 装修单分页查询 */
export interface DecorationPageQry extends PageQuery {
  orderId?: string          // 精确匹配
  customerName?: string     // 模糊匹配
  customerId?: number       // 精确匹配
  designerName?: string     // 模糊匹配
  designerId?: number       // 精确匹配
  salesmanName?: string     // 模糊匹配
  salesmanId?: number
  village?: string          // 模糊匹配
  decorationType?: number   // 枚举筛选
  status?: number           // 枚举筛选, 支持逗号分隔多值
  isLocked?: boolean
  hasContract?: boolean
  startTime?: string        // 创建时间起始
  endTime?: string          // 创建时间结束
}
```

#### 2.1.3 装修单操作请求

```typescript
// src/api/decoration/types.ts (续)

/** 创建装修单 */
export interface DecorationCreateCmd {
  orderId: string           // 必填
  customerId: number        // 必填
  designerId: number        // 必填
  houseId: number
  decorationType: number
  remark?: string
}

/** 创建预付款装修单 */
export interface DecorationCreateForAdvanceCmd {
  orderId: string
  customerId: number
  designerId: number
  advancePrice: number      // 预付款金额
}

/** 变更装修单 */
export interface DecorationChangeCmd {
  id: number
  field: string             // 变更字段名: 'customerId' | 'houseId' | 'status' | 'versionId' | 'payScale' | 'saleScale' | 'time'
  value: any                // 新值
  reason?: string           // 变更原因
}

/** 审核装修单 */
export interface DecorationCheckCmd {
  id: number
  passed: boolean           // 是否通过
  remark: string            // 审核意见
}
```

#### 2.1.4 装修单 API 函数

```typescript
// src/api/decoration/index.ts
import { get, post, page } from '@/api/request'
import type { PageQuery, PageResult } from '@/api/types'
import type {
  DecorationVO,
  DecorationListItem,
  DecorationPageQry,
  DecorationCreateCmd,
  DecorationCreateForAdvanceCmd,
  DecorationChangeCmd,
  DecorationCheckCmd,
  OperateResult,
} from './types'

const BASE = '/decoration'

// === CRUD ===
export function createDecoration(data: DecorationCreateCmd) {
  return post<number>(`${BASE}/createDecoration.do`, data)
}

export function createDecorationForAdvance(data: DecorationCreateForAdvanceCmd) {
  return post<number>(`${BASE}/createDecorationForAdvance.do`, data)
}

export function queryDecorationByOrderId(orderId: string): Promise<DecorationVO> {
  return get(`${BASE}/queryDecorationByOrderId.do`, { orderId })
}

export function queryDecorationByDoid(id: number): Promise<DecorationVO> {
  return get(`${BASE}/queryDecorationByDoid.do`, { id })
}

export function queryDecorationByCustomerId(customerId: number): Promise<DecorationVO[]> {
  return get(`${BASE}/queryDecorationByCustomerId.do`, { customerId })
}

export function queryDecorationInfoByOrderId(orderId: string): Promise<DecorationVO> {
  return get(`${BASE}/queryDecorationInfoByOrderId.do`, { orderId })
}

export function queryDecorationConfig(orderId: string) {
  return get(`${BASE}/queryDecorationConfig.do`, { orderId })
}

export function queryDecorationFunction(orderId: string) {
  return get(`${BASE}/queryDecorationFunction.do`, { orderId })
}

export function queryDecorationFunctionByName(name: string) {
  return get(`${BASE}/queryDecorationFunctionByName.do`, { name })
}

export function queryDecorationSchedule(orderId: string) {
  return get(`${BASE}/queryDecorationSchedule.do`, { orderId })
}

// === 审核/确认/引用/隐藏/作废/终止 ===
export function checkDecoration(data: DecorationCheckCmd): Promise<OperateResult> {
  return post(`${BASE}/checkDecoration.do`, data)
}

export function confirmDecorationInfo(id: number): Promise<OperateResult> {
  return post(`${BASE}/confirmDecorationInfo.do`, { id })
}

export function referDecorationInfo(id: number, sourceOrderId: string): Promise<OperateResult> {
  return post(`${BASE}/referDecorationInfo.do`, { id, sourceOrderId })
}

export function hiddenDecoration(id: number): Promise<OperateResult> {
  return post(`${BASE}/hiddenDecoration.do`, { id })
}

export function obsoleteDecoration(id: number): Promise<OperateResult> {
  return post(`${BASE}/obsoleteDecoration.do`, { id })
}

export function terminalDecoration(id: number, reason?: string): Promise<OperateResult> {
  return post(`${BASE}/terminalDecoration.do`, { id, reason })
}

// === 变更操作 ===
export function changeDecorationForAdvance(id: number, advancePrice: number): Promise<OperateResult> {
  return post(`${BASE}/changeDecorationForAdvance.do`, { id, advancePrice })
}

export function changeDecorationForCustomer(id: number, customerId: number): Promise<OperateResult> {
  return post(`${BASE}/changeDecorationForCustomer.do`, { id, customerId })
}

export function changeDecorationForHouse(id: number, houseId: number): Promise<OperateResult> {
  return post(`${BASE}/changeDecorationForHouse.do`, { id, houseId })
}

export function changeDecorationForStatus(id: number, status: number, reason?: string): Promise<OperateResult> {
  return post(`${BASE}/changeDecorationForStatus.do`, { id, status, reason })
}

export function changeDecorationForPayScale(id: number, payScale: number): Promise<OperateResult> {
  return post(`${BASE}/changeDecorationForPayScale.do`, { id, payScale })
}

export function changeDecorationForVersionId(id: number, versionId: number): Promise<OperateResult> {
  return post(`${BASE}/changeDecorationForVersionId.do`, { id, versionId })
}

// === 分页查询 (20个视角) ===
export function pageDecoration(params: DecorationPageQry): Promise<PageResult<DecorationListItem>> {
  return page(`${BASE}/pageDecoration.do`, params)
}

// 其他分页端点签名相同, 仅URL不同:
export function pageDecorationForBalance(params: DecorationPageQry) { return page(`${BASE}/pageDecorationForBalance.do`, params) }
export function pageDecorationForBelong(params: DecorationPageQry) { return page(`${BASE}/pageDecorationForBelong.do`, params) }
export function pageDecorationForCommon(params: DecorationPageQry) { return page(`${BASE}/pageDecorationForCommon.do`, params) }
export function pageDecorationForCompany(params: DecorationPageQry) { return page(`${BASE}/pageDecorationForCompany.do`, params) }
export function pageDecorationForCustomer(params: DecorationPageQry) { return page(`${BASE}/pageDecorationForCustomer.do`, params) }
export function pageDecorationForDesigner(params: DecorationPageQry) { return page(`${BASE}/pageDecorationForDesigner.do`, params) }
export function pageDecorationForDesignerDept(params: DecorationPageQry) { return page(`${BASE}/pageDecorationForDesignerDept.do`, params) }
export function pageDecorationForDesignerManager(params: DecorationPageQry) { return page(`${BASE}/pageDecorationForDesignerManager.do`, params) }
export function pageDecorationForEscorter(params: DecorationPageQry) { return page(`${BASE}/pageDecorationForEscorter.do`, params) }
export function pageDecorationForGeneral(params: DecorationPageQry) { return page(`${BASE}/pageDecorationForGeneral.do`, params) }
export function pageDecorationForGrade(params: DecorationPageQry) { return page(`${BASE}/pageDecorationForGrade.do`, params) }
export function pageDecorationForMaterialer(params: DecorationPageQry) { return page(`${BASE}/pageDecorationForMaterialer.do`, params) }
export function pageDecorationForQuoter(params: DecorationPageQry) { return page(`${BASE}/pageDecorationForQuoter.do`, params) }
export function pageDecorationForSalesman(params: DecorationPageQry) { return page(`${BASE}/pageDecorationForSalesman.do`, params) }
export function pageDecorationForSalesmanDept(params: DecorationPageQry) { return page(`${BASE}/pageDecorationForSalesmanDept.do`, params) }
export function pageDecorationForSalesmanManager(params: DecorationPageQry) { return page(`${BASE}/pageDecorationForSalesmanManager.do`, params) }
export function pageDecorationForUser(params: DecorationPageQry) { return page(`${BASE}/pageDecorationForUser.do`, params) }
```

### 2.2 装修人员 (DecorationUser) — 4个端点

```typescript
// src/api/decoration/types.ts (续)

export interface DecorationUserVO {
  id: number
  decorationId: number
  userId: number
  userName: string
  role: number            // 1=设计师, 2=销售员, 3=报价员, 4=材料员, 5=监理, 6=项目经理
  roleName: string
  phone: string
  joinTime: string
  leaveTime?: string
}

export interface DecorationUserCreateCmd {
  decorationId: number
  userId: number
  role: number
}

export function addDecorationUser(data: DecorationUserCreateCmd): Promise<OperateResult> {
  return post(`${BASE}/addDecorationUser.do`, data)
}

export function deleteDecorationUser(id: number): Promise<OperateResult> {
  return post(`${BASE}/deleteDecorationUser.do`, { id })
}

export function queryDecorationUser(decorationId: number): Promise<DecorationUserVO[]> {
  return get(`${BASE}/queryDecorationUser.do`, { decorationId })
}

export function updateDecorationUser(data: Partial<DecorationUserVO>): Promise<OperateResult> {
  return post(`${BASE}/updateDecorationUser.do`, data)
}
```

### 2.3 装修活动 (DecorationActivity) — 22个端点

```typescript
// src/api/decoration/types.ts (续)

export interface DecorationActivityVO {
  id: number
  orderId: string
  name: string
  totalAmount: number     // 活动总额
  usedAmount: number      // 已用金额
  balanceAmount: number   // 剩余金额
  status: number          // 0=进行中, 1=已完成, 2=已锁定
  items: DecorationActivityItemVO[]
}

export interface DecorationActivityItemVO {
  id: number
  activityId: number
  itemName: string
  specification: string
  unit: string
  quantity: number
  unitPrice: number
  amount: number
  status: number          // 0=未使用, 1=已确认, 2=已消耗, 3=已发放, 4=已退款, 5=已失效
}

export interface DecorationActivityResultVO {
  totalAmount: number
  usedAmount: number
}

// === 活动 CRUD ===
export function addDecorationActivity(orderId: string, name: string): Promise<number> {
  return post(`${BASE}/addDecorationActivity.do`, { orderId, name })
}

export function queryDecorationActivityByOrderId(orderId: string): Promise<DecorationActivityVO[]> {
  return get(`${BASE}/queryDecorationActivityByOrderId.do`, { orderId })
}

export function deleteDecorationActivity(id: number): Promise<OperateResult> {
  return post(`${BASE}/deleteDecorationActivity.do`, { id })
}

export function lockDecorationActivity(id: number): Promise<OperateResult> {
  return post(`${BASE}/lockDecorationActivity.do`, { id })
}

export function unlockDecorationActivity(id: number): Promise<OperateResult> {
  return post(`${BASE}/unlockDecorationActivity.do`, { id })
}

// === 活动项操作 ===
export function addDecorationActivityItem(activityId: number, item: Partial<DecorationActivityItemVO>): Promise<OperateResult> {
  return post(`${BASE}/addDecorationActivityItem.do`, { activityId, ...item })
}

export function amountDecorationActivity(activityId: number): Promise<DecorationActivityResultVO> {
  return get(`${BASE}/amountDecorationActivity.do`, { activityId })
}

export function affirmDecorationActivityItem(itemId: number): Promise<OperateResult> {
  return post(`${BASE}/affirmDecorationActivityItem.do`, { id: itemId })
}

export function consumeDecorationActivityItem(itemId: number, quantity: number): Promise<OperateResult> {
  return post(`${BASE}/consumeDecorationActivityItem.do`, { id: itemId, quantity })
}

export function deliveDecorationActivityItem(itemId: number): Promise<OperateResult> {
  return post(`${BASE}/deliveDecorationActivityItem.do`, { id: itemId })
}

export function discountDecorationActivityItem(itemId: number, discountRate: number): Promise<OperateResult> {
  return post(`${BASE}/discountDecorationActivityItem.do`, { id: itemId, discountRate })
}

export function refundDecorationActivityItem(itemId: number, amount: number): Promise<OperateResult> {
  return post(`${BASE}/refundDecorationActivityItem.do`, { id: itemId, amount })
}

export function unrefundDecorationActivityItem(itemId: number): Promise<OperateResult> {
  return post(`${BASE}/unrefundDecorationActivityItem.do`, { id: itemId })
}
```

### 2.4 装修合同 (DecorationContract) — 22个端点

```typescript
// src/api/decoration/types.ts (续)

export interface DecorationContractVO {
  id: number
  orderId: string
  contractNo: string      // 合同编号
  contractType: number    // 0=装修合同, 1=变更合同
  totalAmount: number     // 合同金额
  signedAmount: number    // 已签金额
  status: number          // 0=草稿, 1=待签约, 2=已签约, 3=已归档, 4=已到期
  signTime: string
  customerSignTime?: string
  companySignTime?: string
  filingTime?: string
  expireTime?: string
  remark: string
  attachments: AttachmentItem[]
}

export interface DecorationContractCreateCmd {
  orderId: string
  contractType: number
  totalAmount: number
  remark?: string
}

export function addDecorationContract(data: DecorationContractCreateCmd): Promise<number> {
  return post(`${BASE}/addDecorationContract.do`, data)
}

export function queryDecorationContract(id: number): Promise<DecorationContractVO> {
  return get(`${BASE}/queryDecorationContract.do`, { id })
}

export function queryDecorationContractByOrderId(orderId: string): Promise<DecorationContractVO[]> {
  return get(`${BASE}/queryDecorationContractByOrderId.do`, { orderId })
}

export function makeDecorationContract(orderId: string): Promise<number> {
  return post(`${BASE}/makeDecorationContract.do`, { orderId })
}

export function signDecorationContract(id: number): Promise<OperateResult> {
  return post(`${BASE}/signDecorationContract.do`, { id })
}

export function resignDecorationContract(id: number): Promise<OperateResult> {
  return post(`${BASE}/resignDecorationContract.do`, { id })
}

export function filingDecorationContract(id: number): Promise<OperateResult> {
  return post(`${BASE}/filingDecorationContract.do`, { id })
}

export function sendDecorationContract(id: number, target: string): Promise<OperateResult> {
  return post(`${BASE}/sendDecorationContract.do`, { id, target })
}
```

### 2.5 装修决算/量房/图片/服务 — 20个端点

```typescript
// src/api/decoration/types.ts (续)

// === 决算 ===
export interface DecorationAccountVO {
  id: number
  orderId: string
  originalAmount: number  // 原始金额
  changeAmount: number    // 变更金额
  finalAmount: number     // 最终金额
  status: number          // 0=草稿, 1=待确认, 2=已确认
}

export function makeDecorationAccount(orderId: string): Promise<number> {
  return post(`${BASE}/makeDecorationAccount.do`, { orderId })
}

export function queryDecorationAccount(orderId: string): Promise<DecorationAccountVO> {
  return get(`${BASE}/queryDecorationAccount.do`, { orderId })
}

export function affirmDecorationAccount(id: number): Promise<OperateResult> {
  return post(`${BASE}/affirmDecorationAccount.do`, { id })
}

// === 量房 ===
export interface DecorationMeasureVO {
  id: number
  orderId: string
  measureTime: string
  measureUserId: number
  measureUserName: string
  status: number          // 0=待安排, 1=已安排, 2=已完成, 3=失败
  area: number
  remark: string
}

export function applayDecorationMeasure(data: { orderId: string; measureTime: string }): Promise<number> {
  return post(`${BASE}/applayDecorationMeasure.do`, data)
}

export function pageDecorationMeasure(params: PageQuery): Promise<PageResult<DecorationMeasureVO>> {
  return page(`${BASE}/pageDecorationMeasure.do`, params)
}

export function updateDecorationMeasure(data: Partial<DecorationMeasureVO>): Promise<OperateResult> {
  return post(`${BASE}/updateDecorationMeasure.do`, data)
}

// === 图片 ===
export function queryDecorationPictureByOrderId(orderId: string): Promise<AttachmentItem[]> {
  return get(`${BASE}/queryDecorationPictureByOrderId.do`, { orderId })
}

export function addDecorationPicture(orderId: string, file: File): Promise<OperateResult> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('orderId', orderId)
  return post(`${BASE}/addDecorationPicture.do`, formData)
}

export function deleteDecorationPicture(id: number): Promise<OperateResult> {
  return post(`${BASE}/deleteDecorationPicture.do`, { id })
}

// === 服务 ===
export interface DecorationServiceVO {
  id: number
  orderId: string
  serviceType: number
  serviceName: string
  status: number          // 0=待服务, 1=服务中, 2=已完成
  startTime: string
  completeTime?: string
  remark: string
}

export function addDecorationService(orderId: string, serviceType: number): Promise<number> {
  return post(`${BASE}/addDecorationService.do`, { orderId, serviceType })
}

export function completeDecorationService(id: number): Promise<OperateResult> {
  return post(`${BASE}/completeDecorationService.do`, { id })
}
```

### 2.6 半包/整装/全包 — 9个端点

```typescript
// src/api/decoration/types.ts (续)

export interface DecorationPackageVO {
  id: number
  orderId: string
  packageType: number     // 1=半包, 2=整装, 3=全包
  totalAmount: number
  items: DecorationPackageItemVO[]
}

export interface DecorationPackageItemVO {
  id: number
  packageId: number
  itemName: string
  specification: string
  unit: string
  quantity: number
  unitPrice: number
  amount: number
}

// 半包
export function makeDecorationInclusive(orderId: string): Promise<number> { return post(`${BASE}/makeDecorationInclusive.do`, { orderId }) }
export function queryDecorationInclusive(id: number): Promise<DecorationPackageVO> { return get(`${BASE}/queryDecorationInclusive.do`, { id }) }

// 整装
export function makeDecorationMidpack(orderId: string): Promise<number> { return post(`${BASE}/makeDecorationMidpack.do`, { orderId }) }
export function queryDecorationMidpack(id: number): Promise<DecorationPackageVO> { return get(`${BASE}/queryDecorationMidpack.do`, { id }) }
export function updateDecorationMidpack(data: Partial<DecorationPackageVO>): Promise<OperateResult> { return post(`${BASE}/updateDecorationMidpack.do`, data) }

// 全包
export function makeDecorationHolonomy(orderId: string): Promise<number> { return post(`${BASE}/makeDecorationHolonomy.do`, { orderId }) }
export function queryDecorationHolonomy(id: number): Promise<DecorationPackageVO> { return get(`${BASE}/queryDecorationHolonomy.do`, { id }) }
export function updateDecorationHolonomy(data: Partial<DecorationPackageVO>): Promise<OperateResult> { return post(`${BASE}/updateDecorationHolonomy.do`, data) }
```

---

## 三、Payment 付款模块 API 契约

### 3.1 通用支付类型

```typescript
// src/api/payment/types.ts

/** 支付方式枚举 */
export enum PaymentMethodType {
  Cash = 0,               // 现金
  BankTransfer = 1,       // 银行转账
  POS = 2,                // POS刷卡
  AdvanceDeduct = 3,      // 预付款抵扣
  Coupon = 4,             // 优惠券
  QRCode = 5,             // 扫码支付
  Wallet = 6,             // 钱包
}

/** 支付类型名称映射 */
export const PaymentMethodLabels: Record<PaymentMethodType, string> = {
  [PaymentMethodType.Cash]: '现金',
  [PaymentMethodType.BankTransfer]: '银行转账',
  [PaymentMethodType.POS]: 'POS刷卡',
  [PaymentMethodType.AdvanceDeduct]: '预付款抵扣',
  [PaymentMethodType.Coupon]: '优惠券',
  [PaymentMethodType.QRCode]: '扫码支付',
  [PaymentMethodType.Wallet]: '钱包',
}

/** 付款类型 (业务域) */
export enum PaymentBusinessType {
  Advance = 'advance',       // 预付款
  Decoration = 'decoration', // 装修款
  Material = 'material',     // 主材款
  Sales = 'sales',           // 销售款
  Service = 'service',       // 服务费
}

/** 支付记录基础VO */
export interface PaymentRecordVO {
  id: number
  orderId: string
  customerId: number
  customerName: string
  paymentType: PaymentBusinessType
  paymentTypeName: string
  method: PaymentMethodType
  methodName: string
  amount: number
  actualAmount: number       // 实收金额(可能有折扣)
  bankAccount?: string
  bankName?: string
  posTerminal?: string
  voucherNo?: string         // 凭证号
  operator: string
  operatorName: string
  remark: string
  status: number             // 0=待确认, 1=已确认, 2=已退款, 3=已冲销
  statusName: string
  createTime: string
  confirmTime?: string
  refundAmount: number       // 已退款金额
}

/** 收款请求 */
export interface CollectPaymentCmd {
  orderId: string
  paymentType: PaymentBusinessType
  method: PaymentMethodType
  amount: number
  actualAmount?: number
  bankAccountId?: number
  bankName?: string
  posTerminalId?: number
  voucherNo?: string
  remark?: string
}

/** 退款请求 */
export interface RefundPaymentCmd {
  id: number
  refundAmount: number
  refundReason: string
  refundMethod: PaymentMethodType
  bankAccountId?: number
}
```

### 3.2 预付款 (Advance Payment) — 22个端点

```typescript
// src/api/payment/types.ts (续)

/** 预付款VO */
export interface AdvancePaymentVO {
  id: number
  orderId: string
  customerId: number
  customerName: string
  advancePrice: number       // 预付款总额
  usedPrice: number          // 已使用金额
  balancePrice: number       // 剩余金额
  frozenPrice: number        // 冻结金额
  status: number             // 0=待审批, 1=已审批, 2=已使用, 3=已退回
  createTime: string
  approvalRecords: any[]
}

/** 预付款分页查询 */
export interface AdvancePaymentPageQry extends PageQuery {
  orderId?: string
  customerName?: string
  status?: number
  startTime?: string
  endTime?: string
}

/** 提现请求 */
export interface WithdrawPaymentCmd {
  id: number
  withdrawAmount: number
  bankAccountId: number
  reason?: string
}

// === API 函数 ===
// src/api/payment/advance-payment.ts
const ADV = '/payment/advance'

export function pageAdvancePayment(params: AdvancePaymentPageQry): Promise<PageResult<AdvancePaymentVO>> {
  return page(`${ADV}/pageAdvancePayment.do`, params)
}

export function queryAdvancePaymentByOrderId(orderId: string): Promise<AdvancePaymentVO> {
  return get(`${ADV}/queryAdvancePaymentByOrderId.do`, { orderId })
}

export function addAdvancePayment(orderId: string, price: number): Promise<number> {
  return post(`${ADV}/addAdvancePayment.do`, { orderId, price })
}

export function withdrawPayment(data: WithdrawPaymentCmd): Promise<OperateResult> {
  return post(`${ADV}/withdrawPayment.do`, data)
}

export function queryAdvancePaymentRecord(paymentId: number): Promise<PaymentRecordVO[]> {
  return get(`${ADV}/queryAdvancePaymentRecord.do`, { paymentId })
}
```

### 3.3 装修款/主材款/销售款/服务费 — 通用模板

```typescript
// src/api/payment/decoration-payment.ts
const DEC = '/payment/decoration'

/** 装修款VO */
export interface DecorationPaymentVO {
  id: number
  orderId: string
  phase: number              // 付款阶段: 1=首期, 2=中期, 3=尾期, 4=增项
  phaseName: string
  planAmount: number         // 计划金额
  receivedAmount: number     // 已收金额
  balanceAmount: number      // 未收金额
  status: number
  records: PaymentRecordVO[]
}

/** 装修款分页查询 */
export interface DecorationPaymentPageQry extends PageQuery {
  orderId?: string
  customerName?: string
  phase?: number
  status?: number
}

export function pageDecorationPayment(params: DecorationPaymentPageQry): Promise<PageResult<DecorationPaymentVO>> {
  return page(`${DEC}/pageDecorationPayment.do`, params)
}

export function queryDecorationPaymentByOrderId(orderId: string): Promise<DecorationPaymentVO[]> {
  return get(`${DEC}/queryDecorationPaymentByOrderId.do`, { orderId })
}

export function collectDecorationPayment(data: CollectPaymentCmd): Promise<number> {
  return post(`${DEC}/collectDecorationPayment.do`, data)
}

export function refundDecorationPayment(data: RefundPaymentCmd): Promise<OperateResult> {
  return post(`${DEC}/refundDecorationPayment.do`, data)
}
```

### 3.3b 主材款 (Material Payment) — 14个端点

```typescript
// src/api/payment/material-payment.ts
const MAT = '/payment/material'

/** 主材款VO */
export interface MaterialPaymentVO {
  id: number
  orderId: string
  salesId: string
  materialName: string
  supplierName: string
  planAmount: number
  receivedAmount: number
  balanceAmount: number
  status: number               // 0=未付款, 1=部分付款, 2=已付清, 3=已冲销
  records: PaymentRecordVO[]
}

export interface MaterialPaymentPageQry extends PageQuery {
  orderId?: string
  salesId?: string
  materialName?: string
  supplierName?: string
  status?: number
}

export function pageMaterialPayment(params: MaterialPaymentPageQry): Promise<PageResult<MaterialPaymentVO>> {
  return page(`${MAT}/pageMaterialPayment.do`, params)
}

export function queryMaterialPaymentByOrderId(orderId: string): Promise<MaterialPaymentVO[]> {
  return get(`${MAT}/queryMaterialPaymentByOrderId.do`, { orderId })
}

export function collectMaterialPayment(data: CollectPaymentCmd): Promise<number> {
  return post(`${MAT}/collectMaterialPayment.do`, data)
}

export function refundMaterialPayment(data: RefundPaymentCmd): Promise<OperateResult> {
  return post(`${MAT}/refundMaterialPayment.do`, data)
}

export function confirmMaterialPayment(id: number): Promise<OperateResult> {
  return post(`${MAT}/confirmMaterialPayment.do`, { id })
}

export function revokeMaterialPayment(id: number): Promise<OperateResult> {
  return post(`${MAT}/revokeMaterialPayment.do`, { id })
}

export function pageMaterialPaymentForSupplier(params: PageQuery): Promise<PageResult<MaterialPaymentVO>> {
  return page(`${MAT}/pageMaterialPaymentForSupplier.do`, params)
}

export function queryMaterialPaymentSummary(orderId: string): Promise<{ total: number, received: number, balance: number }> {
  return get(`${MAT}/queryMaterialPaymentSummary.do`, { orderId })
}
```

### 3.3c 销售款 (Sales Payment) — 14个端点

```typescript
// src/api/payment/sales-payment.ts
const SP = '/payment/sales'

/** 销售款VO */
export interface SalesPaymentVO {
  id: number
  orderId: string
  salesOrderId: string
  salesType: number            // 1=成品, 2=定制
  planAmount: number
  receivedAmount: number
  balanceAmount: number
  status: number               // 0=未付款, 1=部分付款, 2=已付清, 3=已冲销
  records: PaymentRecordVO[]
}

export interface SalesPaymentPageQry extends PageQuery {
  orderId?: string
  salesOrderId?: string
  salesType?: number
  status?: number
}

export function pageSalesPayment(params: SalesPaymentPageQry): Promise<PageResult<SalesPaymentVO>> {
  return page(`${SP}/pageSalesPayment.do`, params)
}

export function querySalesPaymentByOrderId(orderId: string): Promise<SalesPaymentVO[]> {
  return get(`${SP}/querySalesPaymentByOrderId.do`, { orderId })
}

export function collectSalesPayment(data: CollectPaymentCmd): Promise<number> {
  return post(`${SP}/collectSalesPayment.do`, data)
}

export function refundSalesPayment(data: RefundPaymentCmd): Promise<OperateResult> {
  return post(`${SP}/refundSalesPayment.do`, data)
}

export function confirmSalesPayment(id: number): Promise<OperateResult> {
  return post(`${SP}/confirmSalesPayment.do`, { id })
}

export function revokeSalesPayment(id: number): Promise<OperateResult> {
  return post(`${SP}/revokeSalesPayment.do`, { id })
}

export function pageSalesPaymentForView(params: PageQuery): Promise<PageResult<SalesPaymentVO>> {
  return page(`${SP}/pageSalesPaymentForView.do`, params)
}

export function querySalesPaymentSummary(orderId: string): Promise<{ total: number, received: number, balance: number }> {
  return get(`${SP}/querySalesPaymentSummary.do`, { orderId })
}
```

### 3.3d 服务费 (Service Payment) — 14个端点

```typescript
// src/api/payment/service-payment.ts
const SVC = '/payment/service'

/** 服务费VO */
export interface ServicePaymentVO {
  id: number
  orderId: string
  serviceName: string
  serviceType: number          // 1=设计费, 2=管理费, 3=其他
  planAmount: number
  receivedAmount: number
  balanceAmount: number
  status: number               // 0=未付款, 1=部分付款, 2=已付清, 3=已冲销
  records: PaymentRecordVO[]
}

export interface ServicePaymentPageQry extends PageQuery {
  orderId?: string
  serviceName?: string
  serviceType?: number
  status?: number
}

export function pageServicePayment(params: ServicePaymentPageQry): Promise<PageResult<ServicePaymentVO>> {
  return page(`${SVC}/pageServicePayment.do`, params)
}

export function queryServicePaymentByOrderId(orderId: string): Promise<ServicePaymentVO[]> {
  return get(`${SVC}/queryServicePaymentByOrderId.do`, { orderId })
}

export function collectServicePayment(data: CollectPaymentCmd): Promise<number> {
  return post(`${SVC}/collectServicePayment.do`, data)
}

export function refundServicePayment(data: RefundPaymentCmd): Promise<OperateResult> {
  return post(`${SVC}/refundServicePayment.do`, data)
}

export function confirmServicePayment(id: number): Promise<OperateResult> {
  return post(`${SVC}/confirmServicePayment.do`, { id })
}

export function revokeServicePayment(id: number): Promise<OperateResult> {
  return post(`${SVC}/revokeServicePayment.do`, { id })
}

export function queryServicePaymentSummary(orderId: string): Promise<{ total: number, received: number, balance: number }> {
  return get(`${SVC}/queryServicePaymentSummary.do`, { orderId })
}
```

### 3.4 付款函数权限配置 (PaymentFunctionRight)

```typescript
// src/api/payment/types.ts (续)

/** 付款页面功能权限 */
export interface PaymentFunctionRight {
  canCollect: boolean        // 是否可收款
  canRefund: boolean         // 是否可退款
  canApprove: boolean        // 是否可审批
  canConfirm: boolean        // 是否可确认
  canPrint: boolean          // 是否可打印
  canExport: boolean         // 是否可导出
  visibleMethods: PaymentMethodType[]  // 可见的支付方式
  editableFields: string[]   // 可编辑的字段
  hiddenColumns: string[]    // 隐藏的列
}

/** 获取页面配置 */
export function getPaymentFunctionRight(pageType: string): Promise<PaymentFunctionRight> {
  return get('/payment/config/functionRight', { pageType })
}
```

---

## 四、Sales 销售模块 API 契约

### 4.1 订单 (Order) — 核心VO

```typescript
// src/api/sales/types.ts

/** 销售订单VO */
export interface SalesOrderVO {
  id: number
  orderId: string           // 订单号, 如 'XS20260401001'
  customerId: number
  customerName: string
  customerPhone: string
  source: number            // 来源: 0=自然到店, 1=电话营销, 2=网络推广, 3=转介绍, 4=老客户
  sourceName: string
  channel: number           // 渠道
  channelName: string
  salesmanId: number
  salesmanName: string
  designerId?: number
  designerName?: string
  status: number            // 0=意向, 1=跟进中, 2=已量房, 3=已报价, 4=已签约, 5=已作废
  statusName: string
  houseId?: number
  houseName?: string
  village?: string
  decorationType?: number
  estimatedAmount?: number  // 预估金额
  actualAmount?: number     // 实际金额
  remark: string
  followCount: number       // 跟进次数
  nextFollowTime?: string   // 下次跟进时间
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
}

/** 订单分页查询 */
export interface SalesOrderPageQry extends PageQuery {
  orderId?: string
  customerName?: string
  salesmanName?: string
  status?: number
  source?: number
  channel?: number
  village?: string
  startTime?: string
  endTime?: string
}
```

### 4.2 客户 (Customer)

```typescript
// src/api/sales/types.ts (续)

/** 客户VO */
export interface CustomerVO {
  id: number
  name: string
  phone: string
  phone2?: string
  gender: number            // 0=未知, 1=男, 2=女
  idCard?: string
  address?: string
  birthday?: string
  wechat?: string
  source: number
  sourceName: string
  level: number             // 客户等级: 0=普通, 1=银卡, 2=金卡, 3=钻石
  levelName: string
  protectUserId?: number    // 保护销售员
  protectUserName?: string
  protectExpiry?: string    // 保护到期时间
  remark: string
  orderCount: number        // 关联订单数
  totalAmount: number       // 累计消费
  lastOrderTime?: string
  createTime: string
}

export interface CustomerPageQry extends PageQuery {
  name?: string
  phone?: string
  source?: number
  level?: number
  protectUserId?: number
}
```

### 4.3 跟进记录 (FollowRecord)

```typescript
// src/api/sales/types.ts (续)

export interface FollowRecordVO {
  id: number
  orderId: string
  customerId: number
  type: number              // 1=电话, 2=到店, 3=上门, 4=微信, 5=其他
  typeName: string
  content: string           // 跟进内容
  nextTime?: string         // 下次跟进时间
  nextPlan?: string         // 下次跟进计划
  followBy: string
  followByName: string
  followTime: string
}

export interface FollowRecordCreateCmd {
  orderId: string
  type: number
  content: string
  nextTime?: string
  nextPlan?: string
}
```

### 4.4 Sales API 函数

```typescript
// src/api/sales/index.ts
const SALES = '/sales'

// === 订单 CRUD ===
export function pageSalesOrder(params: SalesOrderPageQry): Promise<PageResult<SalesOrderVO>> {
  return page(`${SALES}/pageSalesOrder.do`, params)
}

export function querySalesOrderByOrderId(orderId: string): Promise<SalesOrderVO> {
  return get(`${SALES}/querySalesOrderByOrderId.do`, { orderId })
}

export function addSalesOrder(data: Partial<SalesOrderVO>): Promise<number> {
  return post(`${SALES}/addSalesOrder.do`, data)
}

export function updateSalesOrder(data: Partial<SalesOrderVO>): Promise<OperateResult> {
  return post(`${SALES}/updateSalesOrder.do`, data)
}

export function obsoleteSalesOrder(id: number, reason: string): Promise<OperateResult> {
  return post(`${SALES}/obsoleteSalesOrder.do`, { id, reason })
}

// === 客户 ===
export function pageCustomer(params: CustomerPageQry): Promise<PageResult<CustomerVO>> {
  return page(`${SALES}/pageCustomer.do`, params)
}

export function queryCustomerById(id: number): Promise<CustomerVO> {
  return get(`${SALES}/queryCustomerById.do`, { id })
}

// === 跟进 ===
export function addFollowRecord(data: FollowRecordCreateCmd): Promise<number> {
  return post(`${SALES}/addFollowRecord.do`, data)
}

export function pageFollowRecord(orderId: string, params: PageQuery): Promise<PageResult<FollowRecordVO>> {
  return page(`${SALES}/pageFollowRecord.do`, { orderId, ...params })
}

// === 客户 CRUD (补充) ===
export function addCustomer(data: Partial<CustomerVO>): Promise<number> {
  return post(`${SALES}/addCustomer.do`, data)
}

export function updateCustomer(data: Partial<CustomerVO>): Promise<OperateResult> {
  return post(`${SALES}/updateCustomer.do`, data)
}

export function queryCustomerByPhone(phone: string): Promise<CustomerVO | null> {
  return get(`${SALES}/queryCustomerByPhone.do`, { phone })
}

export function pageCustomerForSelect(params: PageQuery): Promise<PageResult<CustomerVO>> {
  return page(`${SALES}/pageCustomerForSelect.do`, params)
}

// === 客户来源/渠道 ===
export interface CustomerSourceVO {
  id: number
  name: string
  type: number                // 1=线上, 2=线下, 3=转介绍
  enabled: boolean
}

export function queryCustomerSource(): Promise<CustomerSourceVO[]> {
  return get(`${SALES}/queryCustomerSource.do`)
}

// === 客户保护规则 ===
export interface CustomerProtectRuleVO {
  id: number
  protectType: number         // 1=同公司, 2=同部门, 3=同人员
  protectDays: number         // 保护天数
  enabled: boolean
}

export function queryCustomerProtectRules(): Promise<CustomerProtectRuleVO[]> {
  return get(`${SALES}/queryCustomerProtectRules.do`)
}

export function checkCustomerProtected(customerId: number): Promise<{ protected: boolean, owner?: string }> {
  return get(`${SALES}/checkCustomerProtected.do`, { customerId })
}

// === 活动 ===
export function pageSalesActivity(params: PageQuery): Promise<PageResult<any>> {
  return page(`${SALES}/pageSalesActivity.do`, params)
}

export function addSalesActivity(data: any): Promise<number> {
  return post(`${SALES}/addSalesActivity.do`, data)
}

export function updateSalesActivity(data: any): Promise<OperateResult> {
  return post(`${SALES}/updateSalesActivity.do`, data)
}

// === 发货 ===
export function pageSalesDelivery(params: PageQuery): Promise<PageResult<any>> {
  return page(`${SALES}/pageSalesDelivery.do`, params)
}

export function addSalesDelivery(data: any): Promise<number> {
  return post(`${SALES}/addSalesDelivery.do`, data)
}

export function confirmSalesDelivery(id: number): Promise<OperateResult> {
  return post(`${SALES}/confirmSalesDelivery.do`, { id })
}

// === 结算 ===
export function pageSalesBalance(params: PageQuery): Promise<PageResult<any>> {
  return page(`${SALES}/pageSalesBalance.do`, params)
}

export function preSalesBalance(orderId: string): Promise<any> {
  return get(`${SALES}/preSalesBalance.do`, { orderId })
}

export function postSalesBalance(data: any): Promise<OperateResult> {
  return post(`${SALES}/postSalesBalance.do`, data)
}

export function reverseSalesBalance(id: number, reason: string): Promise<OperateResult> {
  return post(`${SALES}/reverseSalesBalance.do`, { id, reason })
}

// === 统计/报表 ===
export function querySalesSummary(params: {
  startDate: string
  endDate: string
  groupBy: 'day' | 'week' | 'month' | 'staff' | 'dept'
}): Promise<any[]> {
  return get(`${SALES}/querySalesSummary.do`, params)
}

export function querySalesRanking(params: {
  startDate: string
  endDate: string
  rankType: 'amount' | 'count' | 'customer'
  top?: number
}): Promise<any[]> {
  return get(`${SALES}/querySalesRanking.do`, params)
}
```

---

## 五、Quotation 报价模块 API 契约

### 5.1 报价单 (Quotation) — 核心VO

```typescript
// src/api/quotation/types.ts

/** 报价单VO */
export interface QuotationVO {
  id: number
  qid: string              // 报价编号
  orderId: string
  version: number           // 版本号
  versionName: string
  isDefault: boolean        // 是否默认报价
  status: number            // 0=草稿, 1=待审核, 2=已审核, 3=已锁定, -1=已删除
  statusName: string
  totalAmount: number       // 总金额
  discountAmount: number    // 折扣金额
  preferAmount: number      // 优惠金额
  taxAmount: number         // 税额
  finalAmount: number       // 最终金额
  costTotal: number         // 成本总计
  profit: number            // 利润
  profitRate: number        // 利润率(%)
  workerType: number        // 工种
  quotationType: number     // 报价类型: 1=新版, 2=旧版
  functionAreas: QuotationFunctionAreaVO[]  // 功能区列表
  remark: string
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
  lockBy?: string
  lockTime?: string
}

/** 报价单列表项 */
export interface QuotationListItem extends QuotationVO {
  customerName: string
  designerName: string
  village: string
  decorationType: number
}
```

### 5.2 功能区 (FunctionArea)

```typescript
// src/api/quotation/types.ts (续)

/** 报价功能区VO */
export interface QuotationFunctionAreaVO {
  id: number
  qfaid: number            // 报价功能区ID
  quotationId: number
  functionAreaId: number
  name: string              // 功能区名称: 客厅/卧室/厨房/卫生间/阳台...
  type: number              // 类型
  typeName: string
  sort: number              // 排序
  totalAmount: number       // 本功能区总额
  items: QuotationItemVO[]  // 报价项列表
}

/** 报价项VO */
export interface QuotationItemVO {
  id: number
  qfaId: number
  quotationId: number
  itemName: string          // 项目名称
  specification: string     // 规格
  unit: string              // 单位
  quantity: number          // 数量
  unitPrice: number         // 单价
  totalPrice: number        // 小计 = quantity × unitPrice
  costPrice: number         // 成本价
  lossRate: number          // 损耗率(%)
  remark: string
  sort: number
  isCustom: boolean         // 是否自定义项
  categoryId: number        // 分类ID
  categoryName: string
}

/** 报价项选择参数 */
export interface QuotationItemSelectorQry {
  keyword?: string
  categoryId?: number
  functionAreaId?: number
}
```

### 5.3 旧版报价 (Quotetion)

```typescript
// src/api/quotation/types.ts (续)

/** 旧版报价VO — 结构与新版类似, 但字段命名略有不同 */
export interface QuotetionVO {
  id: number
  qid: string
  orderId: string
  version: number
  status: number
  totalAmount: number
  finalAmount: number
  functionAreas: QuotetionFunctionAreaVO[]
  remark: string
  createTime: string
}

export interface QuotetionFunctionAreaVO {
  id: number
  name: string
  type: number
  items: QuotetionItemVO[]
}
```

### 5.4 预签/增减/选材/定额/扩展

```typescript
// src/api/quotation/types.ts (续)

/** 预签单VO */
export interface ProtationVO {
  id: number
  pid: string
  orderId: string
  version: number
  isDefault: boolean
  status: number
  totalAmount: number
  items: ProtationItemVO[]
  costs: ProtationCostVO[]
  createTime: string
}

export interface ProtationItemVO {
  id: number
  protationId: number
  itemName: string
  specification: string
  unit: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface ProtationCostVO {
  id: number
  protationId: number
  costName: string
  costPrice: number
  remark: string
}

/** 增减项VO */
export interface AddReduceVO {
  id: number
  arid: string
  orderId: string
  type: number              // 1=增加, 2=减少
  typeName: string
  quotationId: number       // 关联报价单
  paymentId: number         // 关联装修款
  totalAmount: number
  status: number            // 0=草稿, 1=待审核, 2=已审核, 3=已锁定
  items: AddReduceItemVO[]
  createTime: string
}

export interface AddReduceItemVO {
  id: number
  addReduceId: number
  itemName: string
  specification: string
  unit: string
  quantity: number
  unitPrice: number
  totalPrice: number
  remark: string
}

/** 选材单VO */
export interface SelectionVO {
  id: number
  sid: string
  orderId: string
  version: number
  isDefault: boolean
  status: number
  totalAmount: number
  items: SelectionItemVO[]
  createTime: string
}

export interface SelectionItemVO {
  id: number
  selectionId: number
  materialModelId: number
  materialName: string
  brandName: string
  specification: string
  unit: string
  quantity: number
  unitPrice: number
  totalPrice: number
  status: number            // 0=待确认, 1=已确认, 2=已结算
}

/** 定额单VO */
export interface NormtionVO {
  id: number
  nid: string
  orderId: string
  status: number
  materialTotal: number
  laborTotal: number
  timeTotal: number
  createTime: string
}

/** 扩展单VO */
export interface ExtensionVO {
  id: number
  eid: string
  orderId: string
  totalAmount: number
  status: number
  items: ExtensionItemVO[]
  createTime: string
}

export interface ExtensionItemVO {
  id: number
  extensionId: number
  itemName: string
  specification: string
  unit: string
  quantity: number
  unitPrice: number
  totalPrice: number
}
```

### 5.5 预算分配 (Assign)

```typescript
// src/api/quotation/types.ts (续)

/** 预算分配请求VO */
export interface AssignRequestVO {
  id: number
  orderId: string
  quotationId: number
  qoterId: number            // 预算员ID
  qoterName: string
  status: number            // 0=待接收, 1=已接收, 2=已拒绝, 3=已完成, 4=已转交
  statusName: string
  deadline: string          // 截止时间
  remark: string
  createTime: string
  receiveTime?: string
  completeTime?: string
}

/** 预算员规则VO */
export interface AssignUserRuleVO {
  id: number
  userId: number
  userName: string
  ruleName: string
  priority: number
  isEnabled: boolean
  items: AssignUserRuleItemVO[]
}

export interface AssignUserRuleItemVO {
  id: number
  ruleId: number
  village?: string          // 楼盘匹配
  decorationType?: number   // 装修类型匹配
  amountMin?: number        // 金额范围最小
  amountMax?: number        // 金额范围最大
}
```

### 5.6 Quotation API 函数 (核心30个)

```typescript
// src/api/quotation/index.ts
const QUOT = '/quotation'

// === 报价单 CRUD ===
export function pageQuotation(params: PageQuery & { orderId?: string; status?: number }): Promise<PageResult<QuotationListItem>> {
  return page(`${QUOT}/pageQuotation.do`, params)
}

export function queryQuotationByQid(qid: string): Promise<QuotationVO> {
  return get(`${QUOT}/queryQuotationByQid.do`, { qid })
}

export function queryQuotationForDefaultByOrderId(orderId: string): Promise<QuotationVO> {
  return get(`${QUOT}/queryQuotationForDefaultByOrderId.do`, { orderId })
}

export function addQuotation(data: { orderId: string }): Promise<number> {
  return post(`${QUOT}/addQuotation.do`, data)
}

export function copyQuotation(qid: string): Promise<number> {
  return post(`${QUOT}/copyQuotation.do`, { qid })
}

export function submitQuotation(qid: string): Promise<OperateResult> {
  return post(`${QUOT}/submitQuotation.do`, { qid })
}

export function checkQuotation(qid: string, passed: boolean, remark: string): Promise<OperateResult> {
  return post(`${QUOT}/checkQuotation.do`, { qid, passed, remark })
}

export function lockQuotation(qid: string): Promise<OperateResult> {
  return post(`${QUOT}/lockQuotation.do`, { qid })
}

export function unlockQuotation(qid: string): Promise<OperateResult> {
  return post(`${QUOT}/unlockQuotation.do`, { qid })
}

export function setQuotationForDefault(qid: string): Promise<OperateResult> {
  return post(`${QUOT}/setQuotationForDefault.do`, { qid })
}

export function amountQuotation(qid: string): Promise<{ totalAmount: number; costTotal: number; profit: number }> {
  return get(`${QUOT}/amountQuotation.do`, { qid })
}

// === 功能区操作 ===
export function addQuotationFunctionArea(quotationId: number, name: string, type: number): Promise<number> {
  return post(`${QUOT}/addQuotationFunctionArea.do`, { quotationId, name, type })
}

export function sortFunctionArea(ids: number[]): Promise<OperateResult> {
  return post(`${QUOT}/sortFunctionArea.do`, { ids })
}

export function deleteQuotationFunctionArea(qfaId: number): Promise<OperateResult> {
  return post(`${QUOT}/deleteQuotationFunctionArea.do`, { qfaId })
}

// === 报价项操作 ===
export function addQuotationFunctionAreaItem(data: {
  qfaId: number
  itemName: string
  specification?: string
  unit: string
  quantity: number
  unitPrice: number
}): Promise<number> {
  return post(`${QUOT}/addQuotationFunctionAreaItem.do`, data)
}

export function updateQuotationFunctionAreaItem(data: Partial<QuotationItemVO> & { id: number }): Promise<OperateResult> {
  return post(`${QUOT}/updateQuotationFunctionAreaItem.do`, data)
}

export function deleteQuotationFunctionAreaItem(itemId: number): Promise<OperateResult> {
  return post(`${QUOT}/deleteQuotationFunctionAreaItem.do`, { itemId })
}

// === 优惠 ===
export function queryQuotationPrefer(qid: string): Promise<{ preferType: number; preferAmount: number; preferRate: number }> {
  return get(`${QUOT}/queryQuotationPrefer.do`, { qid })
}

export function updateQuotationPrefer(qid: string, preferType: number, preferAmount: number, preferRate: number): Promise<OperateResult> {
  return post(`${QUOT}/updateQuotationPrefer.do`, { qid, preferType, preferAmount, preferRate })
}

// === 增减项 ===
export function pageAddReduce(params: PageQuery): Promise<PageResult<AddReduceVO>> {
  return page(`${QUOT}/pageAddReduce.do`, params)
}

export function addAddReduce(data: { orderId: string; type: number; quotationId: number }): Promise<number> {
  return post(`${QUOT}/addAddReduce.do`, data)
}

export function submitAddReduce(arid: string): Promise<OperateResult> {
  return post(`${QUOT}/submitAddReduce.do`, { arid })
}

// === 选材单 ===
export function pageSelection(params: PageQuery): Promise<PageResult<SelectionVO>> {
  return page(`${QUOT}/pageSelection.do`, params)
}

// === 预算分配 ===
export function pageQuotationAssignRequest(params: PageQuery): Promise<PageResult<AssignRequestVO>> {
  return page(`${QUOT}/pageQuotationAssignRequest.do`, params)
}

export function receiveQuotationAssignRequest(id: number): Promise<OperateResult> {
  return post(`${QUOT}/receiveQuotationAssignRequest.do`, { id })
}

export function transferQuotationAssignRequest(id: number, targetUserId: number): Promise<OperateResult> {
  return post(`${QUOT}/transferQuotationAssignRequest.do`, { id, targetUserId })
}
```

---

## 六、Common 跨模块共享 API 契约

### 6.1 字典/常量

```typescript
// src/api/common/types.ts

/** 字典查询 */
export interface DictQueryParams {
  module: string           // 模块: 'decoration' | 'sales' | 'payment' | 'quotation'
  entity: string           // 实体: 'Decoration' | 'Payment' | ...
  field: string            // 字段: 'Status' | 'Type' | ...
}

/** 字典响应 */
export interface DictResponse {
  keys: string[]
  values: (string | number)[]
  labels: string[]
  datas: DictItem[]
}
```

### 6.2 文件上传

```typescript
// src/api/common/types.ts (续)

export interface UploadResult {
  id: number
  name: string
  url: string
  size: number
  type: string
}

/** 上传文件 */
export function uploadFile(file: File, category?: string): Promise<UploadResult> {
  const formData = new FormData()
  formData.append('file', file)
  if (category) formData.append('category', category)
  return post('/common/upload.do', formData)
}

/** 上传图片 */
export function uploadImg(file: File): Promise<UploadResult> {
  const formData = new FormData()
  formData.append('file', file)
  return post('/common/uploadImg.do', formData)
}
```

### 6.3 用户搜索

```typescript
// src/api/common/types.ts (续)

/** 拼音搜索用户 */
export function queryUserByPinyin(pinyin: string): Promise<UserBrief[]> {
  return get('/common/queryUserByPinyin.do', { pinyin })
}

/** 查询计量单位 */
export function queryMeasurementUnit(): Promise<OptionItem[]> {
  return get('/common/queryMeasurementUnit.do')
}

/** 查询工种 */
export function queryWorkType(): Promise<OptionItem[]> {
  return get('/common/queryWorkType.do')
}
```

### 6.4 审批流 (Approval)

```typescript
// src/api/common/approval.ts

/** 审批实例 */
export interface ApprovalInstanceVO {
  id: number
  businessType: string        // 业务类型: 'DecorationContract' | 'PaymentRefund' | 'SalesBalance'
  businessId: number          // 业务ID
  status: number              // 0=待提交, 1=审批中, 2=已通过, 3=已驳回, 4=已撤回
  currentStep: number         // 当前步骤
  totalSteps: number          // 总步骤数
  applicant: UserBrief
  applyTime: string
  approvalRecords: ApprovalRecordVO[]
}

/** 审批记录 */
export interface ApprovalRecordVO {
  id: number
  step: number
  approver: UserBrief
  action: 'approve' | 'reject' | 'withdraw' | 'delegate'
  comment: string
  operateTime: string
}

/** 提交审批 */
export function submitApproval(data: {
  businessType: string
  businessId: number
  comment?: string
}): Promise<number> {
  return post('/common/approval/submit.do', data)
}

/** 审批/驳回 */
export function operateApproval(data: {
  approvalId: number
  action: 'approve' | 'reject'
  comment: string
}): Promise<OperateResult> {
  return post('/common/approval/operate.do', data)
}

/** 撤回审批 */
export function withdrawApproval(approvalId: number): Promise<OperateResult> {
  return post('/common/approval/withdraw.do', { approvalId })
}

/** 查询审批状态 */
export function queryApprovalStatus(businessType: string, businessId: number): Promise<ApprovalInstanceVO | null> {
  return get('/common/approval/queryStatus.do', { businessType, businessId })
}

/** 我的待审批列表 */
export function pageMyPendingApproval(params: PageQuery): Promise<PageResult<ApprovalInstanceVO>> {
  return page('/common/approval/pageMyPending.do', params)
}
```

### 6.5 楼盘/房源 (House)

```typescript
// src/api/common/house.ts

/** 楼盘VO */
export interface HouseVO {
  houseId: number
  villageName: string          // 小区名
  buildingNumber: string       // 楼栋号
  unitNumber: string           // 单元号
  houseNumber: string          // 房号
  address: string              // 完整地址
  area: number                 // 面积
  houseType: string            // 户型: '三室两厅'
  developer: string
}

/** 楼盘搜索 (拼音/名称模糊匹配) */
export function queryHouseByPinyin(keyword: string): Promise<HouseVO[]> {
  return get('/common/house/queryByPinyin.do', { keyword })
}

/** 楼盘分页查询 */
export function pageHouse(params: PageQuery & {
  villageName?: string
  buildingNumber?: string
}): Promise<PageResult<HouseVO>> {
  return page('/common/house/pageHouse.do', params)
}

/** 楼盘详情 */
export function queryHouseById(houseId: number): Promise<HouseVO> {
  return get('/common/house/queryHouseById.do', { houseId })
}

/** 小区列表 (用于级联选择) */
export function queryVillageList(): Promise<{ id: number; name: string }[]> {
  return get('/common/house/queryVillageList.do')
}
```

### 6.6 数据导出 (Export)

```typescript
// src/api/common/export.ts

/** 导出任务 */
export interface ExportTaskVO {
  id: number
  taskName: string
  exportType: string           // 导出类型: 'excel' | 'csv' | 'pdf'
  status: number               // 0=排队中, 1=进行中, 2=已完成, 3=失败
  progress: number             // 0-100
  fileUrl: string
  createTime: string
  finishTime: string
}

/** 创建导出任务 */
export function createExportTask(data: {
  exportType: string
  module: string
  query: Record<string, any>
  columns?: string[]
}): Promise<number> {
  return post('/common/export/create.do', data)
}

/** 查询导出任务状态 */
export function queryExportTask(taskId: number): Promise<ExportTaskVO> {
  return get('/common/export/queryTask.do', { taskId })
}

/** 我的导出列表 */
export function pageMyExportTask(params: PageQuery): Promise<PageResult<ExportTaskVO>> {
  return page('/common/export/pageMyTask.do', params)
}

/** 下载导出文件 */
export function downloadExportFile(taskId: number): string {
  return `/common/export/download.do?taskId=${taskId}`
}
```

### 6.7 通知/消息 (Notification)

```typescript
// src/api/common/notification.ts

/** 系统通知 */
export interface NotificationVO {
  id: number
  title: string
  content: string
  type: number                 // 1=系统, 2=审批, 3=业务提醒
  isRead: boolean
  sender: UserBrief
  createTime: string
  businessType?: string
  businessId?: number
}

/** 未读消息数 */
export function queryUnreadCount(): Promise<number> {
  return get('/common/notification/unreadCount.do')
}

/** 消息列表 */
export function pageNotification(params: PageQuery & { type?: number }): Promise<PageResult<NotificationVO>> {
  return page('/common/notification/page.do', params)
}

/** 标记已读 */
export function markAsRead(ids: number[]): Promise<OperateResult> {
  return post('/common/notification/markRead.do', { ids })
}

/** 全部标记已读 */
export function markAllAsRead(): Promise<OperateResult> {
  return post('/common/notification/markAllRead.do')
}

/** 删除消息 */
export function deleteNotification(ids: number[]): Promise<OperateResult> {
  return post('/common/notification/delete.do', { ids })
}
```

---

## 七、错误码规范

### 7.1 全局错误码

| code | 含义 | 前端处理 |
|------|------|---------|
| 0 | 成功 | 正常处理 data |
| 1 | 业务错误 | Message.error(msg) |
| 401 | 未授权/登录过期 | 跳转登录页 |
| 403 | 无权限 | Message.warning('无操作权限') |
| 429 | 请求过于频繁 | Message.warning('操作太频繁, 请稍后') |
| 500 | 服务器内部错误 | Message.error('服务器错误, 请联系管理员') |

### 7.2 业务错误码 (msg 示例)

| msg 关键字 | 场景 | 前端建议 |
|-----------|------|---------|
| `已存在` | 重复创建 | 提示已存在, 引导查看 |
| `已锁定` | 并发操作 | 提示已被锁定, 刷新数据 |
| `已被审核` | 重复提交 | 提示已审核, 不允许重复操作 |
| `余额不足` | 退款/提现 | 引导查看余额 |
| `不匹配` | 数据关联错误 | 检查关联数据 |
| `已过期` | 超时操作 | 提示已过期, 不可操作 |

### 7.3 错误处理拦截器模板

```typescript
// src/api/interceptor.ts (补充说明)

// 响应拦截器错误处理策略
const ERROR_STRATEGIES: Record<string, (msg: string) => void> = {
  '已存在': (msg) => Message.warning(msg),
  '已锁定': (msg) => {
    Message.warning(msg)
    // 自动刷新当前页面数据
    eventBus.emit('refresh-data')
  },
  '已被审核': (msg) => Message.info(msg),
  '余额不足': (msg) => Modal.error({ title: '操作失败', content: msg }),
  '不匹配': (msg) => Message.error(msg),
  '已过期': (msg) => {
    Message.warning(msg)
    router.back()
  },
}

function matchErrorStrategy(msg: string): ((msg: string) => void) | null {
  for (const [keyword, handler] of Object.entries(ERROR_STRATEGIES)) {
    if (msg.includes(keyword)) return handler
  }
  return null
}
```

---

## 八、API 文件目录结构

### 8.1 最终文件清单

```
src/api/
├── types.ts                              ← 通用类型 (ApiResponse, PageResult, PageQuery 等)
├── request.ts                            ← Axios 实例 + 拦截器
├── interceptor.ts                        ← Token 注入 + 401 处理
│
├── decoration/
│   ├── types.ts                          ← 装修模块全部类型 (~250行)
│   └── index.ts                          ← 149个 API 函数 (~350行)
│
├── payment/
│   ├── types.ts                          ← 付款模块全部类型 (~200行)
│   ├── advance-payment.ts                ← 预付款 API (~80行)
│   ├── decoration-payment.ts             ← 装修款 API (~80行)
│   ├── material-payment.ts               ← 主材款 API (~80行)
│   ├── sales-payment.ts                  ← 销售款 API (~80行)
│   ├── service-payment.ts                ← 服务费 API (~80行)
│   └── index.ts                          ← 聚合导出
│
├── sales/
│   ├── types.ts                          ← 销售模块全部类型 (~180行)
│   └── index.ts                          ← 110个 API 函数 (~250行)
│
├── quotation/
│   ├── types.ts                          ← 报价模块全部类型 (~350行)
│   ├── quotation.ts                      ← 报价单 CRUD API (~120行)
│   ├── quotation-function.ts             ← 功能区 API (~60行)
│   ├── quotation-item.ts                 ← 报价项 API (~60行)
│   ├── add-reduce.ts                     ← 增减项 API (~60行)
│   ├── selection.ts                      ← 选材单 API (~60行)
│   ├── normtion.ts                       ← 定额单 API (~60行)
│   ├── extension.ts                      ← 扩展单 API (~40行)
│   ├── protation.ts                      ← 预签单 API (~60行)
│   ├── assign.ts                         ← 预算分配 API (~80行)
│   └── index.ts                          ← 聚合导出
│
└── common/
    ├── types.ts                          ← 共享类型 (~50行)
    ├── user.ts                           ← 用户搜索 (~30行)
    ├── dict.ts                           ← 字典查询 (~30行)
    ├── approval.ts                       ← 审批流 (~40行)
    ├── upload.ts                         ← 文件上传 (~40行)
    ├── house.ts                          ← 楼盘搜索 (~30行)
    ├── export.ts                         ← 数据导出 (~30行)
    └── index.ts                          ← 聚合导出
```

### 8.2 类型命名规范

| 后缀 | 含义 | 示例 |
|------|------|------|
| `VO` | View Object, 从后端返回的视图对象 | `DecorationVO`, `PaymentRecordVO` |
| `Cmd` | Command, 发送给后端的操作命令 | `DecorationCreateCmd`, `CollectPaymentCmd` |
| `Qry` | Query, 分页/搜索查询参数 | `DecorationPageQry`, `CustomerPageQry` |
| `DTO` | Data Transfer Object, 跨层数据传输 | 不常用, 优先用 Cmd |
| `Item` | 子项, 嵌套在父VO中 | `QuotationItemVO`, `FollowRecordVO` |

### 8.3 API 函数命名规范

| 前缀 | 含义 | 示例 |
|------|------|------|
| `page` | 分页查询 | `pageDecoration`, `pageQuotation` |
| `query` | 精确查询 (单条或多条) | `queryDecorationByOrderId` |
| `add` | 新增 | `addDecorationUser`, `addQuotation` |
| `update` | 修改 | `updateDecorationUser` |
| `delete` | 删除 | `deleteDecorationUser` |
| `submit` | 提交 (状态流转) | `submitQuotation`, `submitAddReduce` |
| `check` | 审核 | `checkDecoration`, `checkQuotation` |
| `lock/unlock` | 锁定/解锁 | `lockQuotation`, `unlockQuotation` |
| `copy` | 复制 | `copyQuotation`, `copySelection` |
| `amount` | 金额计算 | `amountQuotation`, `amountDecorationActivity` |
| `make` | 生成 (从其他实体派生) | `makeDecorationAccount`, `makeDecorationContract` |
| `sign/resign` | 签约/重签约 | `signDecorationContract` |
| `send` | 发送 (通知/邮件) | `sendDecorationContract` |
| `receive/refuse` | 接收/拒绝 (分配) | `receiveQuotationAssignRequest` |
| `transfer` | 转交 | `transferQuotationAssignRequest` |
| `sort` | 排序 | `sortFunctionArea`, `sortFunctionAreaItem` |

### 8.4 端点 URL 保留规则

```
规则: 所有 .do 端点 URL 保持不变

旧: com.post('createDecoration.do', data, callback)
新: post('/decoration/createDecoration.do', data)

注意:
1. BASE 路径前缀可能需要调整 (如 /api/decoration/...)
2. Content-Type 从 form-urlencoded → application/json (需确认后端支持)
3. 后端部分端点可能需要适配, 与后端团队对齐
```

### 8.5 Content-Type 迁移计划

| 阶段 | Content-Type | 说明 |
|------|-------------|------|
| Phase 0 | `application/json` (新默认) | 后端新接口统一 JSON |
| Phase 1 | 双兼容模式 | 后端同时支持 JSON 和 form-urlencoded |
| Phase 2 | 全量 `application/json` | 旧接口逐步切换完毕 |

```typescript
// 过渡期: 特定接口使用 form-urlencoded
export function postForm<T = any>(url: string, data: Record<string, any>): Promise<T> {
  const params = new URLSearchParams()
  Object.entries(data).forEach(([key, val]) => {
    if (val !== undefined && val !== null) params.append(key, String(val))
  })
  return request.post(url, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
```

---

*文档生成时间: 2026-04-26*
*覆盖 783 个 API 端点的 TypeScript 类型定义模板*
*含 4个模块的 VO/Cmd/Qry 类型 + 通用类型 + 错误码 + 命名规范*
