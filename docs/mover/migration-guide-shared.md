# 跨模块共享架构迁移指南 (Shared Architecture Migration Guide)

> view-decoration-pc 项目四大业务模块 (Decoration / Sales / Payment / Quotation) 共享架构设计方案

---

## 目录

1. [概述](#一概述)
2. [整体架构图](#二整体架构图)
3. [目录结构设计](#三目录结构设计)
4. [API 封装层](#四api-封装层)
5. [Store 层 (Pinia)](#五store-层-pinia)
6. [路由架构](#六路由架构)
7. [组件库](#七组件库)
8. [Composable 库](#八composable-库)
9. [常量/字典系统](#九常量字典系统)
10. [模块间通信方案](#十模块间通信方案-wujie-微前端场景)
11. [使用示例](#十一使用示例)
12. [旧项目映射对照表](#十二旧项目到新项目的映射对照表)
13. [迁移优先级与里程碑](#十三迁移优先级与里程碑)
14. [注意事项与最佳实践](#十四注意事项与最佳实践)

---

## 一、概述

### 1.1 背景

旧项目 Rhadamanthus (jQuery/Bootstrap) 中的 decoration、sales、payment、quotation 四大模块在前端层面存在大量共享代码：

- `com.post()` / `com.popup4page()` / `com.validator()` 等全局工具
- `Searcher` 搜索组件（150+ 搜索条件）
- `constant.*()` 常量系统（~60 个子分组）
- `paymentUtils` / `quotationUtils` 等业务工具函数
- 共享的选择器、弹窗、表格等 UI 组件

新项目 view-decoration-pc 采用 Vue 3.5 + TypeScript 5.8 + Arco Design Vue 2.57 + Pinia 3.0 + Wujie 微前端架构，需要建立一套系统化的共享架构来替代旧项目中的全局耦合模式。

### 1.2 四大模块规模总览

| 模块 | 前端文件数 | 前端代码行 | API 端点数 | 搜索条件 | 弹窗峰值 |
|------|-----------|-----------|-----------|---------| ---------|
| Decoration (装修) | 57 | ~26,500 | 149 | ~30 | ~60 |
| Sales (销售) | 57 | ~16,019 | 110 | ~25 | ~50 |
| Payment (付款) | 66 | ~15,605 | 136 | 31 | 65/页 |
| Quotation (报价) | 122 | ~55,651 | 388 | 60+ | 180/页 |
| **合计** | **302** | **~113,775** | **783** | **~150** | **500+** |

### 1.3 共享需求矩阵

| 共享资源 | DEC | SALES | PAY | QUOT | 优先级 |
|---------|:---:|:-----:|:---:|:----:|:------:|
| API 封装层 | Y | Y | Y | Y | P0 |
| Store (用户/字典/权限) | Y | Y | Y | Y | P0 |
| 路由架构 | Y | Y | Y | Y | P0 |
| FilterBar 搜索组件 | Y | Y | Y | Y | P0 |
| CRUD 表格组件 | Y | Y | Y | Y | P0 |
| 弹窗管理系统 | Y | Y | Y | Y | P0 |
| 常量/字典系统 | Y | Y | Y | Y | P0 |
| 支付组件 | Y | Y | - | - | P1 |
| 报价计算引擎 | Y | - | Y | - | P1 |
| 人员选择器 | Y | Y | Y | Y | P1 |
| 楼盘选择器 | Y | Y | Y | Y | P1 |
| 订单关联 (orderId) | Y | Y | Y | Y | P1 |
| 审批流组件 | Y | - | Y | Y | P2 |
| 导出功能 | Y | Y | Y | Y | P2 |
| 打印功能 | - | Y | Y | Y | P2 |

---

## 二、整体架构图

```
+================================================================+
|                    view-decoration-pc (主应用)                    |
|================================================================|
|                                                                  |
|  +----------------------------------------------------------+  |
|  |                    Shell Layer (壳层)                      |  |
|  |  main.ts / App.vue / Layout / Router Guard / Wujie Setup  |  |
|  +----------------------------------------------------------+  |
|                              |                                   |
|  +----------------------------------------------------------+  |
|  |                 Shared Layer (共享层)  <-- 本文档核心       |  |
|  |                                                            |  |
|  |  +-------------+  +-------------+  +------------------+   |  |
|  |  |  API Layer  |  | Store Layer |  |  Router Layer    |   |  |
|  |  | (统一封装)  |  | (Pinia)     |  | (模块化路由)     |   |  |
|  |  +-------------+  +-------------+  +------------------+   |  |
|  |                                                            |  |
|  |  +-------------+  +-------------+  +------------------+   |  |
|  |  | Components  |  | Composables |  |  Constants/Dict  |   |  |
|  |  | (共享组件库) |  | (共享逻辑库) |  | (常量/字典系统)  |   |  |
|  |  +-------------+  +-------------+  +------------------+   |  |
|  |                                                            |  |
|  |  +------------------+  +-------------------------------+  |  |
|  |  | Business Widgets |  | Cross-Module Communication    |  |  |
|  |  | (业务级共享组件) |  | (Wujie Bus / EventBus)        |  |  |
|  |  +------------------+  +-------------------------------+  |  |
|  +----------------------------------------------------------+  |
|                              |                                   |
|  +----------------------------------------------------------+  |
|  |                Business Module Layer (业务模块层)           |  |
|  |                                                            |  |
|  |  +-------------+ +--------+ +---------+ +-------------+   |  |
|  |  | decoration  | | sales  | | payment | | quotation   |   |  |
|  |  +-------------+ +--------+ +---------+ +-------------+   |  |
|  +----------------------------------------------------------+  |
|                              |                                   |
|  +----------------------------------------------------------+  |
|  |               Micro-App Layer (微应用层 - Wujie)           |  |
|  |  +------------------+  +------------------+               |  |
|  |  | CRM (:2001)      |  | Member (:2002)   |               |  |
|  |  +------------------+  +------------------+               |  |
|  +----------------------------------------------------------+  |
+================================================================+
```

### 架构分层说明

```
Shell Layer
  └── 应用入口、全局布局、路由守卫、Wujie 初始化

Shared Layer
  ├── api/           -- API 统一封装 (request wrapper + 模块化 API)
  ├── stores/        -- Pinia Store (全局 + 字典 + 权限)
  ├── router/        -- 模块化路由注册
  ├── components/    -- 共享 UI 组件 (FilterBar, CRUDTable, ModalManager...)
  ├── composables/   -- 共享 Composable (usePayment, useQuotationCalc...)
  ├── constants/     -- 常量定义 + 字典映射
  └── shared/        -- 跨模块业务组件 (PersonSelector, BuildingSelector...)

Business Module Layer
  ├── decoration/    -- 装修模块独立页面、组件、API
  ├── sales/         -- 销售模块独立页面、组件、API
  ├── payment/       -- 付款模块独立页面、组件、API
  └── quotation/     -- 报价模块独立页面、组件、API

Micro-App Layer
  ├── CRM 子应用     -- Wujie iframe 沙箱
  └── Member 子应用  -- Wujie iframe 沙箱
```

---

## 三、目录结构设计

```
src/
├── api/                          # API 层
│   ├── interceptor.ts            # Axios 拦截器 (Token 注入, 401 处理)
│   ├── request.ts                # 统一请求封装
│   ├── types.ts                  # 通用 API 类型定义
│   │
│   ├── decoration/               # 装修模块 API
│   │   ├── index.ts              # 聚合导出
│   │   └── types.ts              # 装修模块类型
│   │
│   ├── sales/                    # 销售模块 API
│   │   ├── index.ts
│   │   └── types.ts
│   │
│   ├── payment/                  # 付款模块 API
│   │   ├── index.ts
│   │   ├── advance-payment.ts    # 预付款
│   │   ├── decoration-payment.ts # 装修款
│   │   ├── material-payment.ts   # 主材款
│   │   ├── sales-payment.ts      # 销售款
│   │   ├── service-payment.ts    # 服务费
│   │   └── types.ts
│   │
│   ├── quotation/                # 报价模块 API
│   │   ├── index.ts
│   │   ├── quotation.ts          # 报价单 CRUD
│   │   ├── quotation-version.ts  # 报价版本
│   │   ├── quotation-function.ts # 报价功能区
│   │   ├── quotation-item.ts     # 报价项
│   │   ├── add-reduce.ts         # 增减项
│   │   ├── selection.ts          # 选材单
│   │   ├── normtion.ts           # 定额单
│   │   ├── extension.ts          # 扩展单
│   │   ├── protation.ts          # 预签单
│   │   └── types.ts
│   │
│   └── common/                   # 跨模块共享 API
│       ├── user.ts               # 用户信息
│       ├── organization.ts       # 组织架构
│       ├── dict.ts               # 数据字典
│       ├── approval.ts           # 审批流
│       ├── export.ts             # 数据导出
│       ├── upload.ts             # 文件上传
│       ├── house.ts              # 楼盘信息
│       └── types.ts
│
├── stores/                       # Store 层 (Pinia)
│   ├── index.ts                  # Store 聚合导出
│   └── modules/
│       ├── user.ts               # 用户信息 Store (跨模块共享)
│       ├── app.ts                # 应用全局 Store
│       ├── permission.ts         # 权限 Store (跨模块共享)
│       ├── dict.ts               # 字典 Store (跨模块共享, ~60 子分组)
│       ├── decoration.ts         # 装修模块 Store
│       ├── sales.ts              # 销售模块 Store
│       ├── payment.ts            # 付款模块 Store
│       └── quotation.ts          # 报价模块 Store
│
├── router/                       # 路由层
│   ├── index.ts                  # 路由实例 + 守卫
│   ├── constants.ts              # 路由常量
│   ├── guard/
│   │   ├── index.ts
│   │   └── permission.ts         # 权限守卫
│   └── routes/
│       ├── base.ts               # 基础布局路由
│       ├── defaultModules/       # 默认路由
│       │   ├── user.ts
│       │   ├── exception.ts
│       │   └── hide-menu.ts      # 微应用路由 (CRM/Member)
│       └── dynamicModules/       # 动态路由 (后端菜单驱动)
│           ├── decoration.ts     # 装修模块路由 (~30 页面)
│           ├── sales.ts          # 销售模块路由 (~25 页面)
│           ├── payment.ts        # 付款模块路由 (~20 页面)
│           └── quotation.ts      # 报价模块路由 (~50 页面)
│
├── components/                   # 共享 UI 组件
│   ├── index.ts                  # 全局注册入口
│   │
│   ├── business/                 # 业务级共享组件
│   │   ├── PersonSelector/       # 人员选择器 (拼音搜索)
│   │   ├── BuildingSelector/     # 楼盘选择器
│   │   ├── OrderLink/            # 订单关联组件 (orderId 跳转)
│   │   ├── ApprovalFlow/         # 审批流组件
│   │   ├── PaymentWidget/        # 支付组件 (5 种支付方式)
│   │   ├── QuotationOutput/      # 报价输出/打印
│   │   ├── ReceiptPrint/         # 收据打印
│   │   └── DataExport/           # 数据导出
│   │
│   └── shared/                   # 通用共享组件
│       ├── FilterBar/            # 统一搜索/筛选栏 (替代 Searcher)
│       ├── CRUDTable/            # 统一 CRUD 表格
│       ├── ModalManager/         # 弹窗管理系统
│       ├── DetailDrawer/         # 详情抽屉 (替代 com.popup4page)
│       └── StatusTag/            # 状态标签
│
├── composables/                  # 共享 Composable
│   ├── shared/                   # 跨模块共享逻辑
│   │   ├── useFilterBar.ts       # 筛选栏逻辑
│   │   ├── useCRUDTable.ts       # CRUD 表格逻辑
│   │   ├── usePagination.ts      # 分页逻辑
│   │   ├── useExport.ts          # 数据导出逻辑
│   │   ├── useApproval.ts        # 审批流逻辑
│   │   ├── useOrderLink.ts       # 订单关联逻辑
│   │   ├── useDict.ts            # 字典数据获取
│   │   └── usePermission.ts      # 权限检查
│   │
│   └── business/                 # 业务级共享逻辑
│       ├── usePayment.ts         # 支付逻辑 (替代 paymentUtils.js)
│       ├── useQuotationCalc.ts   # 报价计算引擎 (替代 quotationUtils.js)
│       └── useHouseSelector.ts   # 楼盘搜索逻辑
│
├── constants/                    # 常量/字典系统
│   ├── index.ts                  # 聚合导出
│   ├── modules/                  # 按模块分组的常量
│   │   ├── decoration.ts         # 装修模块常量 (~8 子分组)
│   │   ├── sales.ts              # 销售模块常量 (~10 子分组)
│   │   ├── payment.ts            # 付款模块常量 (~20 子分组)
│   │   ├── quotation.ts          # 报价模块常量 (~22 子分组)
│   │   └── common.ts             # 跨模块常量
│   └── dict/                     # 数据字典映射 (fallback)
│       ├── index.ts              # 字典注册表
│       ├── decoration-dict.ts
│       ├── sales-dict.ts
│       ├── payment-dict.ts
│       └── quotation-dict.ts
│
├── hooks/                        # 已有 hooks (保持)
│   ├── visible.ts
│   ├── user.ts
│   ├── permission.ts
│   ├── loading.ts
│   └── auth-group.tsx
│
├── views/                        # 业务页面
│   ├── decoration/               # 装修模块页面
│   ├── sales/                    # 销售模块页面
│   ├── payment/                  # 付款模块页面
│   └── quotation/                # 报价模块页面
│
└── main.ts                       # 入口
```

---

## 四、API 封装层

### 4.1 统一请求封装

```typescript
// src/api/request.ts
import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { getToken, handleTokenExpired } from '@/utils/auth'
import { Message } from '@arco-design/web-vue'

// 统一响应结构
export interface ApiResponse<T = any> {
  code: number        // 0=成功, 1=失败, 401=未授权
  msg: string
  data: T
}

// 分页响应结构
export interface PageResponse<T = any> {
  list: T[]
  count: number
}

// 分页请求参数
export interface PageParams {
  page?: number
  size?: number
  [key: string]: any
}

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// 请求拦截器: 注入 Token
request.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器: 统一错误处理
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, msg, data } = response.data
    if (code === 0) {
      return data as any
    }
    if (code === 401) {
      handleTokenExpired()
      return Promise.reject(new Error('登录已过期'))
    }
    Message.error(msg || '请求失败')
    return Promise.reject(new Error(msg))
  },
  (error) => {
    Message.error(error.message || '网络异常')
    return Promise.reject(error)
  }
)

// 通用请求方法
export function get<T = any>(url: string, params?: Record<string, any>): Promise<T> {
  return request.get(url, { params })
}

export function post<T = any>(url: string, data?: Record<string, any>): Promise<T> {
  return request.post(url, data)
}

export function page<T = any>(url: string, params?: PageParams): Promise<PageResponse<T>> {
  return request.get(url, { params })
}

export default request
```

### 4.2 模块化 API 示例 (Payment)

```typescript
// src/api/payment/types.ts

/** 5种支付方式类型 */
export enum PaymentMethod {
  Cash = 0,         // 现金
  BankTransfer = 1, // 银行转账
  POS = 2,          // POS刷卡
  Wallet = 3,       // 钱包
  Check = 4,        // 支票
}

/** 预付款信息 */
export interface AdvancePayment {
  arid: number
  orderId: string
  customerId: number
  customerName: string
  advancePrice: number
  balancePrice: number
  status: number
  createTime: string
}

/** 支付信息 */
export interface PaymentInfo {
  method: PaymentMethod
  amount: number
  bankName?: string
  bankCard?: string
  posNumber?: string
  checkNumber?: string
  walletId?: number
}
```

```typescript
// src/api/payment/advance-payment.ts
import { get, post, page } from '@/api/request'
import type { PageParams, PageResponse } from '@/api/request'
import type { AdvancePayment } from './types'

const BASE = '/api/payment/advance'

/** 预付款分页查询 */
export function pageAdvancePayment(params: PageParams) {
  return page<AdvancePayment>(`${BASE}/page`, params)
}

/** 按订单查询预付款 */
export function queryAdvancePaymentByOrderId(orderId: string) {
  return get<AdvancePayment>(`${BASE}/queryByOrderId`, { orderId })
}

/** 添加预付款 */
export function addAdvancePayment(data: Partial<AdvancePayment>) {
  return post(`${BASE}/add`, data)
}
```

```typescript
// src/api/payment/index.ts — 聚合导出
export * from './types'
export * from './advance-payment'
export * from './decoration-payment'
export * from './material-payment'
export * from './sales-payment'
export * from './service-payment'
```

### 4.3 跨模块共享 API

```typescript
// src/api/common/house.ts
import { get } from '@/api/request'

export interface HouseInfo {
  houseId: number
  houseNumber: string
  buildingName: string
  unitName: string
  floor: number
  room: string
  area: number
  customerId: number
  customerName: string
}

/** 楼盘搜索 - 所有模块共用 */
export function searchHouse(keyword: string) {
  return get<HouseInfo[]>('/api/common/house/search', { keyword })
}
```

```typescript
// src/api/common/approval.ts
import { get, post } from '@/api/request'

export interface ApprovalRecord {
  approvalId: number
  businessType: string    // decoration / payment / quotation
  businessId: string
  currentNode: string
  status: number          // 0=待审批, 1=已通过, 2=已拒绝
  approver: string
  approveTime: string
  remark: string
}

/** 查询审批记录 */
export function queryApprovalRecords(businessType: string, businessId: string) {
  return get<ApprovalRecord[]>('/api/common/approval/records', { businessType, businessId })
}

/** 提交审批 */
export function submitApproval(data: {
  businessType: string
  businessId: string
  remark?: string
}) {
  return post('/api/common/approval/submit', data)
}
```

---

## 五、Store 层 (Pinia)

### 5.1 字典 Store (核心共享)

```typescript
// src/stores/modules/dict.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { get } from '@/api/request'

export interface DictItem {
  label: string
  value: number | string
  color?: string
  disabled?: boolean
}

/** 字典分组键名 */
export type DictGroupKey =
  // 装修
  | 'decoration.status' | 'decoration.type' | 'decoration.function' | 'decoration.schedule'
  // 销售
  | 'sales.status' | 'sales.type' | 'sales.activity' | 'sales.refund.status'
  // 付款
  | 'payment.type' | 'payment.method' | 'payment.status' | 'payment.receipt.type'
  | 'payment.pos.status' | 'payment.wallet.type' | 'payment.contract.status'
  // 报价
  | 'quotation.status' | 'quotation.type' | 'quotation.item.type' | 'quotation.area.type'
  | 'quotation.price.type' | 'quotation.norm.type' | 'quotation.version.status'
  // 通用
  | 'common.approval.status' | 'common.export.type' | 'common.order.status'

export const useDictStore = defineStore('dict', () => {
  const dictMap = ref<Map<string, DictItem[]>>(new Map())
  const loadedGroups = ref<Set<string>>(new Set())

  /** 加载字典数据 */
  async function loadDict(groupKey: DictGroupKey | string) {
    if (loadedGroups.value.has(groupKey)) return dictMap.value.get(groupKey) || []

    const data = await get<DictItem[]>('/api/common/dict/load', { group: groupKey })
    dictMap.value.set(groupKey, data || [])
    loadedGroups.value.add(groupKey)
    return data || []
  }

  /** 批量加载字典 */
  async function loadDicts(groupKeys: string[]) {
    await Promise.all(groupKeys.map(key => loadDict(key)))
  }

  /** 获取字典列表 */
  function getDict(groupKey: string): DictItem[] {
    return dictMap.value.get(groupKey) || []
  }

  /** 根据 value 获取 label (高频使用) */
  function getLabel(groupKey: string, value: number | string): string {
    const items = dictMap.value.get(groupKey) || []
    return items.find(item => item.value === value)?.label || String(value)
  }

  /** 清除所有缓存 (退出登录时) */
  function clearAll() {
    dictMap.value.clear()
    loadedGroups.value.clear()
  }

  return { dictMap, loadDict, loadDicts, getDict, getLabel, clearAll }
})
```

### 5.2 用户信息 Store

```typescript
// src/stores/modules/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserInfo {
  userId: number
  staffId: number
  name: string
  phone: string
  avatar: string
  orgId: number
  orgName: string
  orgType: string
  posts: string[]
  permissions: string[]
  allMenuList: any[]
}

export const useUserStore = defineStore('user', () => {
  const userId = ref<number>(0)
  const staffId = ref<number>(0)
  const name = ref('')
  const permissions = ref<string[]>([])
  const allMenuList = ref<any[]>([])

  const isLoggedIn = computed(() => !!userId.value)

  function initUserInfo(info: Partial<UserInfo>) {
    if (info.userId) userId.value = info.userId
    if (info.staffId) staffId.value = info.staffId
    if (info.name) name.value = info.name
    if (info.permissions) permissions.value = info.permissions
    if (info.allMenuList) allMenuList.value = info.allMenuList
  }

  function hasPermission(perm: string): boolean {
    return permissions.value.includes(perm)
  }

  function clearUserInfo() {
    userId.value = 0
    permissions.value = []
    allMenuList.value = []
  }

  return { userId, staffId, name, permissions, allMenuList, isLoggedIn, initUserInfo, hasPermission, clearUserInfo }
})
```

### 5.3 权限 Store

```typescript
// src/stores/modules/permission.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'

/** 权限等级: 按钮级 > 功能级 > 页面级 > 模块级 */
export type PermLevel = 'module' | 'page' | 'feature' | 'button'

export interface PermNode {
  code: string               // 如 'decoration:list:btn:add'
  label: string              // 如 '新增装修单'
  level: PermLevel
  children?: PermNode[]
}

export const usePermissionStore = defineStore('permission', () => {
  // --- 权限树 (从后端 /api/common/permission/tree 加载) ---
  const permTree = ref<PermNode[]>([])
  const loaded = ref(false)

  // --- 页面权限集 (从 allMenuList 中提取) ---
  const pagePerms = ref<Set<string>>(new Set())
  // --- 按钮权限集 ---
  const buttonPerms = ref<Set<string>>(new Set())

  /** 初始化: 从 UserStore 的 allMenuList 中解析权限码 */
  function initFromMenu() {
    const userStore = useUserStore()
    const menus = userStore.allMenuList || []

    pagePerms.value.clear()
    buttonPerms.value.clear()

    function walk(items: any[]) {
      for (const item of items) {
        if (item.permission) {
          // 路由级权限 (如 'decoration:list')
          pagePerms.value.add(item.permission)
        }
        if (item.buttons && Array.isArray(item.buttons)) {
          for (const btn of item.buttons) {
            // 按钮级权限 (如 'decoration:list:btn:add')
            buttonPerms.value.add(btn.permission || btn.code)
          }
        }
        if (item.children) walk(item.children)
      }
    }
    walk(menus)
  }

  /** 异步加载完整权限树 (用于管理界面, 一般页面不需要) */
  async function loadPermTree() {
    if (loaded.value) return
    const { get } = await import('@/api/request')
    const data = await get<PermNode[]>('/api/common/permission/tree')
    permTree.value = data || []
    loaded.value = true
  }

  // --- 权限判断 ---

  /** 页面级权限: 是否有访问某页面的权限 */
  function hasPage(pageCode: string): boolean {
    return pagePerms.value.has(pageCode)
  }

  /** 按钮级权限: 是否有操作某功能的权限 */
  function hasButton(btnCode: string): boolean {
    return buttonPerms.value.has(btnCode)
  }

  /** 通用权限检查: 同时检查页面和按钮 */
  function has(code: string): boolean {
    return pagePerms.value.has(code) || buttonPerms.value.has(code)
  }

  /** 角色判断: 是否拥有指定角色 (基于 UserStore.posts) */
  const userStore = useUserStore()
  function hasRole(roleCode: string): boolean {
    return (userStore as any).posts?.includes(roleCode) ?? false
  }

  // --- 组合判断: 角色或权限二选一 ---
  function hasRoleOrPerm(roleCode: string, permCode: string): boolean {
    return hasRole(roleCode) || has(permCode)
  }

  function clearAll() {
    permTree.value = []
    pagePerms.value.clear()
    buttonPerms.value.clear()
    loaded.value = false
  }

  return {
    permTree, pagePerms, buttonPerms,
    initFromMenu, loadPermTree,
    hasPage, hasButton, has, hasRole, hasRoleOrPerm, clearAll
  }
})
```

#### 5.3.1 v-permission 指令

```typescript
// src/directives/permission.ts
import type { Directive } from 'vue'
import { usePermissionStore } from '@/stores/modules/permission'

/**
 * 用法:
 *   <button v-permission="'decoration:list:btn:add'">新增</button>
 *   <button v-permission:page="'decoration:detail'">查看详情</button>
 *   <div v-permission:hidden="'decoration:audit'">审核区域</div>
 */
export const vPermission: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    const permStore = usePermissionStore()
    const code = binding.value
    if (!code) return

    let hasAccess: boolean
    if (binding.arg === 'page') {
      hasAccess = permStore.hasPage(code)
    } else {
      hasAccess = permStore.hasButton(code)
    }

    if (!hasAccess) {
      if (binding.arg === 'hidden' || binding.modifiers.hidden) {
        el.style.display = 'none'
      } else {
        el.parentNode?.removeChild(el)
      }
    }
  }
}

// src/directives/index.ts — 全局注册
// import { vPermission } from './permission'
// app.directive('permission', vPermission)
```

#### 5.3.2 usePermission Composable

```typescript
// src/hooks/business/usePermission.ts
import { usePermissionStore } from '@/stores/modules/permission'

/**
 * 在组件中使用:
 *   const { canPage, canBtn } = usePermission()
 *   canBtn('decoration:list:btn:add')  // → true/false
 */
export function usePermission() {
  const permStore = usePermissionStore()

  function canPage(code: string): boolean {
    return permStore.hasPage(code)
  }

  function canBtn(code: string): boolean {
    return permStore.hasButton(code)
  }

  function canAny(...codes: string[]): boolean {
    return codes.some(c => permStore.has(c))
  }

  function canAll(...codes: string[]): boolean {
    return codes.every(c => permStore.has(c))
  }

  /** 基于角色+权限的视图配置 (替代 drawNode.getConfig) */
  function getViewConfig<T extends Record<string, any>>(
    roleConfigMap: Record<string, T>,
    defaultConfig: T
  ): T {
    const userStore = useUserStore()
    const roles = (userStore as any).posts || []
    for (const role of roles) {
      if (roleConfigMap[role]) return roleConfigMap[role]
    }
    return defaultConfig
  }

  return { canPage, canBtn, canAny, canAll, getViewConfig }
}
```

### 5.4 应用全局 Store

```typescript
// src/stores/modules/app.ts
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const currentModule = ref<string>('')
  const loading = ref(false)
  const online = ref(navigator.onLine)

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setModule(mod: string) {
    currentModule.value = mod
  }

  function setLoading(val: boolean) {
    loading.value = val
  }

  // 网络状态监听
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => { online.value = true })
    window.addEventListener('offline', () => { online.value = false })
  }

  return { sidebarCollapsed, currentModule, loading, online, toggleSidebar, setModule, setLoading }
})
```

### 5.5 Store 初始化流程

```typescript
// src/stores/index.ts
import { useUserStore } from './modules/user'
import { usePermissionStore } from './modules/permission'
import { useDictStore } from './modules/dict'
import { useAppStore } from './modules/app'

/**
 * 应用启动时调用 (在 router.beforeEach 中):
 *   1. 加载用户信息
 *   2. 从菜单解析权限
 *   3. 预加载当前路由所需的字典
 */
export async function initStores() {
  const userStore = useUserStore()
  const permStore = usePermissionStore()

  // 1. 获取用户信息 (通常从 /api/common/user/info)
  // userStore.initUserInfo(userInfo)

  // 2. 从菜单初始化权限
  permStore.initFromMenu()
}

export { useUserStore, usePermissionStore, useDictStore, useAppStore }
```

---

## 六、路由架构

### 6.1 模块路由示例 (Payment)

```typescript
// src/router/routes/dynamicModules/payment.ts
import type { RouteRecordRaw } from 'vue-router'

const paymentRoutes: RouteRecordRaw[] = [
  {
    path: '/payment',
    name: 'Payment',
    component: () => import('@/layout/default-layout.vue'),
    meta: { requiresAuth: true, module: 'payment', title: '付款管理', icon: 'icon-pay' },
    children: [
      {
        path: 'decoration',
        name: 'DecorationPayment',
        component: () => import('@/views/payment/decoration-payment/index.vue'),
        meta: { title: '装修款', requiresAuth: true },
      },
      {
        path: 'decoration/check',
        name: 'DecorationPaymentCheck',
        component: () => import('@/views/payment/decoration-payment/check.vue'),
        meta: { title: '装修款审核', requiresAuth: true, permission: 'payment:decoration:check' },
      },
      {
        path: 'advance',
        name: 'AdvancePayment',
        component: () => import('@/views/payment/advance-payment/index.vue'),
        meta: { title: '预付款', requiresAuth: true },
      },
      // ... 其余路由按相同模式
    ],
  },
]

export default paymentRoutes
```

### 6.2 路由元信息规范

```typescript
// src/router/types.ts
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    module?: 'decoration' | 'sales' | 'payment' | 'quotation' | string
    title?: string
    icon?: string
    hideInMenu?: boolean
    permission?: string
    microApp?: string
    keepAlive?: boolean
    dictGroups?: string[]        // 需要预加载的字典分组
    filterKeys?: string[]        // 页面搜索条件 key
  }
}
```

### 6.3 动态路由加载

```typescript
// src/router/guard/permission.ts
import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { usePermissionStore } from '@/stores/modules/permission'
import { useDictStore } from '@/stores/modules/dict'
import { initStores } from '@/stores'
import { buildDynamicRoutes } from '../routes/dynamicModules'

// 白名单: 不需要登录即可访问
const WHITE_LIST = ['/login', '/403', '/404', '/500']

export function setupPermissionGuard(router: Router) {
  let routesAdded = false

  router.beforeEach(async (to, from) => {
    // 1. 白名单直接放行
    if (WHITE_LIST.includes(to.path)) return true

    const userStore = useUserStore()

    // 2. 未登录 → 跳转登录
    if (!userStore.isLoggedIn) {
      return { path: '/login', query: { redirect: to.fullPath } }
    }

    // 3. 首次进入: 初始化 Store + 注册动态路由
    if (!routesAdded) {
      await initStores()

      const permStore = usePermissionStore()
      const dynamicRoutes = buildDynamicRoutes(userStore.allMenuList)

      for (const route of dynamicRoutes) {
        router.addRoute(route)
      }

      // 标记已注册, 防止重复
      routesAdded = true

      // 重新导航到目标路由 (因为路由表刚更新)
      return { ...to, replace: true }
    }

    // 4. 检查页面权限
    if (to.meta.permission) {
      const permStore = usePermissionStore()
      if (!permStore.has(to.meta.permission)) {
        return '/403'
      }
    }

    // 5. 预加载字典
    if (to.meta.dictGroups?.length) {
      const dictStore = useDictStore()
      await dictStore.loadDicts(to.meta.dictGroups)
    }

    // 6. 设置当前模块
    const appStore = useAppStore()
    if (to.meta.module) {
      appStore.setModule(to.meta.module)
    }

    return true
  })
}
```

### 6.4 后端菜单 → 动态路由构建

```typescript
// src/router/routes/dynamicModules/index.ts
import type { RouteRecordRaw } from 'vue-router'
import type { RouteMeta } from 'vue-router'

/** 后端菜单数据结构 */
interface MenuItem {
  id: number
  parentId: number
  name: string
  path: string
  component?: string        // Vue 组件路径, 如 'payment/decoration-payment/index'
  icon?: string
  permission?: string
  orderNum?: number
  children?: MenuItem[]
}

/** 组件路径 → 懒加载组件映射 */
function resolveComponent(componentPath?: string) {
  if (!componentPath) return undefined
  // 使用 Vite 的 import.meta.glob 获取所有视图组件
  const modules = import.meta.glob<{ default: any }>('@/views/**/*.vue')
  const matchedKey = Object.keys(modules).find(
    key => key.includes(componentPath)
  )
  return matchedKey ? modules[matchedKey] : undefined
}

/** 从后端菜单列表构建 Vue Router 路由表 */
export function buildDynamicRoutes(menus: any[]): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []

  function buildRoute(item: MenuItem, parentPath?: string): RouteRecordRaw | null {
    const fullPath = parentPath ? `${parentPath}/${item.path}` : `/${item.path}`

    const meta: RouteMeta = {
      title: item.name,
      icon: item.icon,
      permission: item.permission,
      requiresAuth: true,
    }

    const route: RouteRecordRaw = {
      path: item.path,
      name: item.path.replace(/\//g, '-'),
      meta,
    }

    // 有 component 字段 → 叶子路由, 懒加载组件
    if (item.component) {
      route.component = resolveComponent(item.component)
    }

    // 有 children → 递归构建子路由
    if (item.children?.length) {
      route.children = item.children
        .map(child => buildRoute(child, fullPath))
        .filter(Boolean) as RouteRecordRaw[]
    }

    return route
  }

  for (const menu of menus) {
    const route = buildRoute(menu)
    if (route) routes.push(route)
  }

  return routes
}
```

### 6.5 路由入口与 Guard 注册

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { setupPermissionGuard } from './guard/permission'

// 静态路由 (登录/错误页等)
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/403',
    component: () => import('@/views/error/403.vue'),
    meta: { title: '无权限' }
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '页面不存在' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
})

// 注册权限守卫
setupPermissionGuard(router)

export default router
```

### 6.6 四大模块路由示例

```typescript
// src/router/routes/dynamicModules/decoration.ts
import type { RouteRecordRaw } from 'vue-router'

export const decorationRoutes: RouteRecordRaw[] = [
  {
    path: '/decoration',
    name: 'DecorationRoot',
    redirect: '/decoration/list',
    meta: { requiresAuth: true, module: 'decoration', title: '装修管理', icon: 'icon-home' },
    children: [
      {
        path: 'list',
        name: 'DecorationList',
        component: () => import('@/views/decoration/list/index.vue'),
        meta: {
          title: '装修单列表',
          permission: 'decoration:list',
          dictGroups: ['decoration.status', 'decoration.type'],
        },
      },
      {
        path: 'detail/:orderId',
        name: 'DecorationDetail',
        component: () => import('@/views/decoration/detail/index.vue'),
        meta: {
          title: '装修单详情',
          hideInMenu: true,
          permission: 'decoration:detail',
          keepAlive: false,
        },
      },
      {
        path: 'create',
        name: 'DecorationCreate',
        component: () => import('@/views/decoration/create/index.vue'),
        meta: {
          title: '新建装修单',
          hideInMenu: true,
          permission: 'decoration:create',
        },
      },
      {
        path: 'account',
        name: 'DecorationAccount',
        component: () => import('@/views/decoration/account/index.vue'),
        meta: {
          title: '装修决算',
          permission: 'decoration:account',
        },
      },
      {
        path: 'activity',
        name: 'DecorationActivity',
        component: () => import('@/views/decoration/activity/index.vue'),
        meta: {
          title: '装修活动',
          permission: 'decoration:activity',
        },
      },
      {
        path: 'contract',
        name: 'DecorationContract',
        component: () => import('@/views/decoration/contract/index.vue'),
        meta: {
          title: '装修合同',
          permission: 'decoration:contract',
        },
      },
    ],
  },
]

// src/router/routes/dynamicModules/sales.ts
export const salesRoutes: RouteRecordRaw[] = [
  {
    path: '/sales',
    name: 'SalesRoot',
    redirect: '/sales/list',
    meta: { requiresAuth: true, module: 'sales', title: '销售管理', icon: 'icon-shopping' },
    children: [
      {
        path: 'list',
        name: 'SalesList',
        component: () => import('@/views/sales/list/index.vue'),
        meta: {
          title: '销售单列表',
          permission: 'sales:list',
          dictGroups: ['sales.status', 'sales.type'],
        },
      },
      {
        path: 'detail/:salesId',
        name: 'SalesDetail',
        component: () => import('@/views/sales/detail/index.vue'),
        meta: { title: '销售单详情', hideInMenu: true, permission: 'sales:detail' },
      },
      // ... activity / delivery / balance 等子页面
    ],
  },
]

// src/router/routes/dynamicModules/quotation.ts
export const quotationRoutes: RouteRecordRaw[] = [
  {
    path: '/quotation',
    name: 'QuotationRoot',
    redirect: '/quotation/list',
    meta: { requiresAuth: true, module: 'quotation', title: '报价管理', icon: 'icon-calculator' },
    children: [
      {
        path: 'list',
        name: 'QuotationList',
        component: () => import('@/views/quotation/list/index.vue'),
        meta: {
          title: '报价单列表',
          permission: 'quotation:list',
          dictGroups: ['quotation.status', 'quotation.type', 'quotation.area.type'],
        },
      },
      {
        path: 'detail/:quotationId',
        name: 'QuotationDetail',
        component: () => import('@/views/quotation/detail/index.vue'),
        meta: { title: '报价单详情', hideInMenu: true, permission: 'quotation:detail' },
      },
      // ... addreduce / selection / normtion / extension / protation 子页面
    ],
  },
]
```

---

## 七、组件库

### 7.1 FilterBar 统一搜索/筛选组件

替代旧项目的 `Searcher` 组件，支持 150+ 搜索条件的统一管理。

```typescript
// src/components/shared/FilterBar/types.ts

export type FilterType =
  | 'input' | 'select' | 'date' | 'dateRange' | 'number' | 'numberRange'
  | 'cascader' | 'treeSelect' | 'personSelect' | 'houseSelect'

export interface FilterConfig {
  key: string               // 字段名 (对应 API 参数名)
  label: string             // 显示标签
  type: FilterType          // 筛选类型
  defaultValue?: any        // 默认值
  options?: Array<{ label: string; value: any; disabled?: boolean }>
  dictGroup?: string        // 字典分组 (从 DictStore 加载选项)
  placeholder?: string
  multiple?: boolean
  filterable?: boolean
  required?: boolean
  remoteMethod?: (keyword: string) => Promise<any[]>
  remoteDebounce?: number
}
```

```vue
<!-- src/components/shared/FilterBar/index.vue -->
<template>
  <div class="filter-bar">
    <a-row :gutter="16" align="center">
      <template v-for="item in normalizedFilters" :key="item.key">
        <a-col :xs="24" :sm="12" :md="8" :lg="6">
          <!-- 文本输入 -->
          <a-input
            v-if="item.type === 'input'"
            v-model="filterValues[item.key]"
            :placeholder="item.placeholder || `请输入${item.label}`"
            allow-clear
            @press-enter="handleSearch"
          />
          <!-- 下拉选择 -->
          <a-select
            v-else-if="item.type === 'select'"
            v-model="filterValues[item.key]"
            :placeholder="`请选择${item.label}`"
            :options="getOptions(item)"
            :filterable="item.filterable"
            :multiple="item.multiple"
            allow-clear
          />
          <!-- 日期范围 -->
          <a-range-picker
            v-else-if="item.type === 'dateRange'"
            v-model="filterValues[item.key]"
            style="width: 100%"
          />
          <!-- 人员选择器 -->
          <PersonSelector
            v-else-if="item.type === 'personSelect'"
            v-model="filterValues[item.key]"
            :placeholder="`请选择${item.label}`"
          />
          <!-- 楼盘选择器 -->
          <BuildingSelector
            v-else-if="item.type === 'houseSelect'"
            v-model="filterValues[item.key]"
            :placeholder="`请选择${item.label}`"
          />
        </a-col>
      </template>

      <!-- 操作按钮 -->
      <a-col :xs="24" :sm="12" :md="8" :lg="6">
        <a-space>
          <a-button type="primary" @click="handleSearch">
            <template #icon><icon-search /></template> 搜索
          </a-button>
          <a-button @click="handleReset">
            <template #icon><icon-refresh /></template> 重置
          </a-button>
          <a-button v-if="hasMoreFilters" type="text" @click="expanded = !expanded">
            {{ expanded ? '收起' : '展开' }}
            <icon-down v-if="!expanded" /><icon-up v-else />
          </a-button>
        </a-space>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import type { FilterConfig } from './types'
import { useDictStore } from '@/stores/modules/dict'

const props = withDefaults(defineProps<{
  filters: FilterConfig[]
  defaultValues?: Record<string, any>
  defaultShowCount?: number
}>(), { defaultShowCount: 4 })

const emit = defineEmits<{
  (e: 'search', filters: Record<string, any>): void
  (e: 'reset'): void
  (e: 'change', key: string, value: any, filters: Record<string, any>): void
}>()

const dictStore = useDictStore()
const expanded = ref(false)
const filterValues = reactive<Record<string, any>>({ ...props.defaultValues })

const hasMoreFilters = computed(() => props.filters.length > props.defaultShowCount)
const normalizedFilters = computed(() =>
  expanded.value ? props.filters : props.filters.slice(0, props.defaultShowCount)
)

function getOptions(item: FilterConfig) {
  if (item.options) return item.options
  if (item.dictGroup) return dictStore.getDict(item.dictGroup)
  return []
}

function handleSearch() { emit('search', { ...filterValues }) }
function handleReset() {
  Object.keys(filterValues).forEach(key => { filterValues[key] = undefined })
  emit('reset')
}

onMounted(async () => {
  const groups = props.filters.filter(f => f.dictGroup).map(f => f.dictGroup!)
  if (groups.length) await dictStore.loadDicts(groups)
})
</script>
```

### 7.2 CRUDTable 统一表格组件

```typescript
// src/components/shared/CRUDTable/types.ts

export interface TableColumn {
  dataIndex: string
  title: string
  width?: number
  fixed?: 'left' | 'right'
  sortable?: boolean
  dictGroup?: string           // 状态列: 自动渲染 StatusTag
}

export interface ToolbarAction {
  label: string
  icon?: string
  type?: 'primary' | 'secondary' | 'outline' | 'text' | 'dashed'
  permission?: string
  handler: (selectedRows: any[]) => void
  disabled?: (selectedRows: any[]) => boolean
  visible?: (selectedRows: any[]) => boolean
}

export interface CRUDTableProps {
  columns: TableColumn[]
  fetchData: (params: any) => Promise<{ list: any[]; count: number }>
  rowKey?: string
  toolbarActions?: ToolbarAction[]
  rowActions?: ToolbarAction[]
  selectable?: boolean
  defaultPageSize?: number
  filters?: Record<string, any>
}
```

```vue
<!-- src/components/shared/CRUDTable/index.vue -->
<template>
  <div class="crud-table">
    <!-- 工具栏 -->
    <div v-if="toolbarActions?.length" class="mb-4 flex gap-2">
      <a-button
        v-for="action in visibleToolbarActions"
        :key="action.label"
        :type="action.type || 'outline'"
        :disabled="action.disabled?.(selectedRows)"
        @click="action.handler(selectedRows)"
      >
        {{ action.label }}
      </a-button>
    </div>

    <!-- 数据表格 -->
    <a-table
      :columns="normalizedColumns"
      :data="tableData"
      :loading="loading"
      :row-key="rowKey"
      :row-selection="selectable ? rowSelection : undefined"
      :pagination="{
        current: pagination.page,
        pageSize: pagination.size,
        total: pagination.total,
        showPageSize: true,
        showTotal: true,
      }"
      @page-change="onPageChange"
      @page-size-change="onPageSizeChange"
      stripe
      bordered
    >
      <template v-if="rowActions?.length" #operations="{ record }">
        <a-space>
          <a-button
            v-for="action in visibleRowActions(record)"
            :key="action.label"
            type="text"
            size="small"
            @click="action.handler([record])"
          >{{ action.label }}</a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import type { CRUDTableProps } from './types'

const props = withDefaults(defineProps<CRUDTableProps>(), {
  rowKey: 'id', selectable: false, defaultPageSize: 20,
})

const loading = ref(false)
const tableData = ref<any[]>([])
const selectedRows = ref<any[]>([])

const pagination = reactive({ page: 1, size: props.defaultPageSize, total: 0 })

const normalizedColumns = computed(() => {
  const cols = [...props.columns]
  if (props.rowActions?.length) {
    cols.push({ dataIndex: 'operations', title: '操作', width: 200, fixed: 'right' as const })
  }
  return cols
})

const rowSelection = computed(() => ({
  type: 'checkbox' as const,
  showCheckedAll: true,
}))

const visibleToolbarActions = computed(() =>
  (props.toolbarActions || []).filter(a => !a.visible || a.visible(selectedRows.value))
)

function visibleRowActions(record: any) {
  return (props.rowActions || []).filter(a => !a.visible || a.visible([record]))
}

async function fetchData() {
  loading.value = true
  try {
    const result = await props.fetchData({
      page: pagination.page,
      size: pagination.size,
      ...props.filters,
    })
    tableData.value = result.list || []
    pagination.total = result.count || 0
  } finally {
    loading.value = false
  }
}

function onPageChange(page: number) { pagination.page = page; fetchData() }
function onPageSizeChange(size: number) { pagination.size = size; fetchData() }

watch(() => props.filters, () => { pagination.page = 1; fetchData() }, { deep: true })

onMounted(() => fetchData())

defineExpose({ refresh: fetchData })
</script>
```

### 7.3 ModalManager 弹窗管理系统

替代旧项目超过 500 个 Bootstrap Modal 的管理方式。

```typescript
// src/components/shared/ModalManager/useModal.ts
import { ref } from 'vue'

export interface ModalConfig {
  id: string
  title: string
  component: any
  props?: Record<string, any>
  width?: number | string
  useDrawer?: boolean
  onOk?: (data?: any) => Promise<boolean | void>
  onCancel?: () => void
}

export interface ModalState extends ModalConfig {
  visible: boolean
  confirmLoading: boolean
}

export function useModal() {
  const modals = ref<Map<string, ModalState>>(new Map())

  function open(config: ModalConfig) {
    modals.value.set(config.id, { ...config, visible: true, confirmLoading: false })
  }

  function close(id: string) {
    modals.value.delete(id)
  }

  function closeAll() {
    modals.value.clear()
  }

  return { modals, open, close, closeAll }
}
```

---

## 八、Composable 库

### 8.1 usePayment (替代 paymentUtils.js)

```typescript
// src/composables/business/usePayment.ts
import { ref, computed } from 'vue'
import { useDictStore } from '@/stores/modules/dict'
import type { PaymentInfo, PaymentMethod } from '@/api/payment/types'
import { Message } from '@arco-design/web-vue'

/**
 * 支付逻辑 Composable
 * 替代旧项目 paymentUtils.js (1197行)
 * 用于 decoration/sales/payment 三个模块
 */
export function usePayment() {
  const dictStore = useDictStore()

  const payments = ref<PaymentInfo[]>([])
  const paymentMethods = computed(() => dictStore.getDict('payment.method'))

  function addPayment(payment: PaymentInfo) {
    payments.value.push(payment)
  }

  function removePayment(index: number) {
    payments.value.splice(index, 1)
  }

  const totalAmount = computed(() =>
    payments.value.reduce((sum, p) => sum + (p.amount || 0), 0)
  )

  function validatePayment(payment: PaymentInfo): string | null {
    if (!payment.method && payment.method !== 0) return '请选择支付方式'
    if (!payment.amount || payment.amount <= 0) return '请输入有效金额'
    switch (payment.method) {
      case 1: if (!payment.bankName) return '请输入银行名称'; break
      case 2: if (!payment.posNumber) return '请输入POS编号'; break
      case 3: if (!payment.walletId) return '请选择钱包'; break
      case 4: if (!payment.checkNumber) return '请输入支票号'; break
    }
    return null
  }

  function validateAll(): boolean {
    for (const payment of payments.value) {
      const error = validatePayment(payment)
      if (error) { Message.error(error); return false }
    }
    return true
  }

  function resetPayments() { payments.value = [] }

  return { payments, paymentMethods, totalAmount, addPayment, removePayment, validatePayment, validateAll, resetPayments }
}
```

### 8.2 useQuotationCalc (替代 quotationUtils.js)

```typescript
// src/composables/business/useQuotationCalc.ts
import { ref, computed } from 'vue'

export interface QuotationItem {
  qiId: number; name: string; unit: string
  quantity: number; unitPrice: number; discount: number
  area?: number; isCustom?: boolean
}

export interface FunctionArea {
  faId: number; name: string; items: QuotationItem[]
}

export interface QuotationSummary {
  subtotal: number; discountAmount: number; totalPrice: number
  managementFee: number; designFee: number
  taxRate: number; taxAmount: number; grandTotal: number
}

/**
 * 报价计算引擎
 * 替代旧项目 quotationUtils.js (1925行)
 * 用于 decoration/quotation/payment 三个模块
 */
export function useQuotationCalc() {
  const functionAreas = ref<FunctionArea[]>([])
  const managementFeeRate = ref(0.08)
  const designFee = ref(0)
  const taxRate = ref(0.06)
  const totalDiscount = ref(1)

  function calcItemPrice(item: QuotationItem): number {
    return item.quantity * item.unitPrice * (item.discount ?? 1)
  }

  function calcAreaTotal(area: FunctionArea): number {
    return area.items.reduce((sum, item) => sum + calcItemPrice(item), 0)
  }

  const summary = computed<QuotationSummary>(() => {
    const subtotal = functionAreas.value.reduce((sum, area) => sum + calcAreaTotal(area), 0)
    const discountAmount = subtotal * (1 - totalDiscount.value)
    const totalPrice = subtotal - discountAmount
    const managementFee = totalPrice * managementFeeRate.value
    const beforeTax = totalPrice + managementFee + designFee.value
    const taxAmount = beforeTax * taxRate.value
    const grandTotal = beforeTax + taxAmount

    return {
      subtotal, discountAmount, totalPrice, managementFee,
      designFee: designFee.value, taxRate: taxRate.value, taxAmount,
      grandTotal: Math.round(grandTotal * 100) / 100,
    }
  })

  function calcAddReduce(original: QuotationItem[], added: QuotationItem[], removed: QuotationItem[]): number {
    const toTotal = (arr: QuotationItem[]) => arr.reduce((s, i) => s + calcItemPrice(i), 0)
    return toTotal(added) - toTotal(removed)
  }

  return {
    functionAreas, managementFeeRate, designFee, taxRate, totalDiscount,
    summary, calcItemPrice, calcAreaTotal, calcAddReduce,
  }
}
```

### 8.3 useFilterBar

```typescript
// src/composables/shared/useFilterBar.ts
import { reactive, ref } from 'vue'
import type { FilterConfig } from '@/components/shared/FilterBar/types'

export function useFilterBar(
  filters: FilterConfig[],
  fetchMethod: (params: Record<string, any>) => Promise<any>
) {
  const filterValues = reactive<Record<string, any>>({})
  const searching = ref(false)

  filters.forEach(f => { filterValues[f.key] = f.defaultValue ?? undefined })

  async function handleSearch() {
    searching.value = true
    try {
      const params = Object.fromEntries(
        Object.entries(filterValues).filter(([, v]) => v !== undefined && v !== null && v !== '')
      )
      await fetchMethod(params)
    } finally { searching.value = false }
  }

  function handleReset() {
    filters.forEach(f => { filterValues[f.key] = f.defaultValue ?? undefined })
    handleSearch()
  }

  function getFilterParams(): Record<string, any> {
    return Object.fromEntries(
      Object.entries(filterValues).filter(([, v]) => v !== undefined && v !== null && v !== '')
    )
  }

  return { filterValues, searching, handleSearch, handleReset, getFilterParams }
}
```

---

## 九、常量/字典系统

### 9.1 常量定义 (TypeScript enum)

```typescript
// src/constants/modules/payment.ts

/** 付款类型 */
export enum PaymentType {
  Decoration = 0, Material = 1, Sales = 2, Service = 3, Activity = 4, Oales = 5, Collect = 6,
}

/** 付款状态 */
export enum PaymentStatus {
  Unpaid = 0, Partial = 1, Paid = 2, Confirmed = 3, Cancelled = 4, Refunding = 5, Refunded = 6,
}

/** 支付方式 */
export enum PaymentMethodType {
  Cash = 0, BankTransfer = 1, POS = 2, Wallet = 3, Check = 4,
}
```

### 9.2 字典映射 (fallback)

```typescript
// src/constants/dict/payment-dict.ts
import { PaymentStatus, PaymentMethodType } from '@/constants/modules/payment'

export const PAYMENT_STATUS_DICT = [
  { label: '未付款', value: PaymentStatus.Unpaid, color: 'gray' },
  { label: '部分付款', value: PaymentStatus.Partial, color: 'orange' },
  { label: '已付款', value: PaymentStatus.Paid, color: 'blue' },
  { label: '已确认', value: PaymentStatus.Confirmed, color: 'green' },
  { label: '已取消', value: PaymentStatus.Cancelled, color: 'red' },
  { label: '退款中', value: PaymentStatus.Refunding, color: 'orange' },
  { label: '已退款', value: PaymentStatus.Refunded, color: 'purple' },
]

export const PAYMENT_METHOD_DICT = [
  { label: '现金', value: PaymentMethodType.Cash },
  { label: '银行转账', value: PaymentMethodType.BankTransfer },
  { label: 'POS刷卡', value: PaymentMethodType.POS },
  { label: '钱包', value: PaymentMethodType.Wallet },
  { label: '支票', value: PaymentMethodType.Check },
]
```

---

## 十、模块间通信方案 (Wujie 微前端场景)

### 10.1 通信架构

```
+-------------------+         +-------------------+
|   view-crm-pc     |         |  view-member-pc   |
|   (CRM :2001)     |         |  (Member :2002)   |
|  window.$wujie    |         |  window.$wujie    |
|    .bus.$emit     |         |    .bus.$emit     |
+--------+----------+         +--------+----------+
         |                             |
         +-----------+-----------------+
                     | Wujie Bus
         +-----------+-----------+
+--------+----------------------+----------+
|        view-decoration-pc (主应用)        |
|  WujieVue.bus                            |
|    .$on('sub-route-change')              |
|    .$on('micro-app:session-expired')     |
|    .$emit('view-crm-pc:props-change')    |
+------------------------------------------+
```

### 10.2 主应用 -> 子应用

```typescript
// 通过 Props 传递共享数据
const subAppProps = computed(() => ({
  permissions: userStore.permissions,
  allMenuList: userStore.allMenuList,
  staffId: userStore.staffId,
  orgId: userStore.orgId,
}))

// 通过 Bus 发送事件
WujieVue.bus.$emit('view-crm-pc:props-change', { permissions: [...] })
WujieVue.bus.$emit('view-crm-pc:order-selected', { orderId: 'xxx', orderType: 'decoration' })
```

### 10.3 子应用 -> 主应用

```typescript
// 子应用发送事件
window.$wujie?.bus.$emit('sub-route-change', { path: '/decoration/detail', query: { orderId: 'xxx' } })
window.$wujie?.bus.$emit('micro-app:session-expired')
window.$wujie?.bus.$emit('navigate:decoration-detail', { orderId: 'xxx' })
```

### 10.4 主应用内四大模块间通信

四大模块在同一 Vue 应用内，不需要 Wujie Bus：

```typescript
// 方式 1: Pinia Store
const decorationStore = useDecorationStore()
console.log(decorationStore.currentOrderId)

// 方式 2: 路由参数
router.push({ path: '/payment/decoration', query: { orderId: decorationStore.currentOrderId } })

// 方式 3: provide/inject (同层级组件)
provide('currentOrder', currentOrderDetail)
const order = inject('currentOrder')
```

### 10.5 跨应用订单关联协议

```typescript
// src/composables/shared/useOrderLink.ts
import { useRouter } from 'vue-router'
import WujieVue from 'wujie-vue3'

export function useOrderLink() {
  const router = useRouter()

  type OrderType = 'decoration' | 'sales' | 'payment' | 'quotation'

  const ORDER_ROUTES: Record<OrderType, string> = {
    decoration: '/decoration/detail',
    sales: '/sales/detail',
    payment: '/payment/decoration',
    quotation: '/quotation/detail',
  }

  function navigateToOrder(type: OrderType, orderId: string) {
    router.push({ path: ORDER_ROUTES[type], query: { orderId } })
  }

  function openCustomerInCRM(customerId: number) {
    WujieVue.bus.$emit('view-crm-pc:open-customer', { customerId })
  }

  return { navigateToOrder, openCustomerInCRM }
}
```

---

## 十一、使用示例

### 11.1 完整列表页示例 (Payment 装修款)

```vue
<!-- src/views/payment/decoration-payment/index.vue -->
<template>
  <div class="page-container">
    <FilterBar :filters="filterConfig" @search="handleSearch" @reset="handleReset" />

    <CRUDTable
      :columns="columns"
      :fetch-data="fetchDecorationPayments"
      :filters="currentFilters"
      :toolbar-actions="toolbarActions"
      :row-actions="rowActions"
      row-key="dpId"
      selectable
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FilterBar from '@/components/shared/FilterBar/index.vue'
import CRUDTable from '@/components/shared/CRUDTable/index.vue'
import type { FilterConfig } from '@/components/shared/FilterBar/types'
import type { TableColumn, ToolbarAction } from '@/components/shared/CRUDTable/types'
import { pageDecorationPayment } from '@/api/payment/decoration-payment'

const router = useRouter()
const currentFilters = ref<Record<string, any>>({})

// 搜索条件配置
const filterConfig: FilterConfig[] = [
  { key: 'orderId', label: '订单号', type: 'input', filterable: true },
  { key: 'paymentType', label: '付款类型', type: 'select', dictGroup: 'payment.type' },
  { key: 'paymentStatus', label: '付款状态', type: 'select', dictGroup: 'payment.status' },
  { key: 'createTime', label: '创建时间', type: 'dateRange' },
  { key: 'designer', label: '设计师', type: 'personSelect' },
  { key: 'house', label: '楼盘', type: 'houseSelect' },
]

const columns: TableColumn[] = [
  { dataIndex: 'orderId', title: '订单号', width: 150, fixed: 'left' },
  { dataIndex: 'customerName', title: '客户', width: 100 },
  { dataIndex: 'houseName', title: '楼盘', width: 150 },
  { dataIndex: 'paymentType', title: '付款类型', width: 100, dictGroup: 'payment.type' },
  { dataIndex: 'money', title: '金额', width: 120, sortable: true },
  { dataIndex: 'paymentStatus', title: '状态', width: 100, dictGroup: 'payment.status' },
  { dataIndex: 'createTime', title: '创建时间', width: 180 },
]

const toolbarActions: ToolbarAction[] = [
  { label: '收款', type: 'primary', handler: () => { /* open modal */ } },
  { label: '导出', handler: () => { /* export */ } },
]

const rowActions: ToolbarAction[] = [
  { label: '详情', handler: ([row]) => router.push({ path: '/payment/decoration/receipt', query: { orderId: row.orderId } }) },
  { label: '审核', permission: 'payment:decoration:check', visible: ([row]) => row.paymentStatus === 0, handler: ([row]) => { /* audit */ } },
]

async function fetchDecorationPayments(params: any) { return pageDecorationPayment(params) }
function handleSearch(filters: Record<string, any>) { currentFilters.value = { ...filters } }
function handleReset() { currentFilters.value = {} }
</script>
```

### 11.2 模块初始化时加载字典

```typescript
// src/views/payment/index.vue
import { onMounted } from 'vue'
import { useDictStore } from '@/stores/modules/dict'

const dictStore = useDictStore()

onMounted(async () => {
  await dictStore.loadDicts([
    'payment.type', 'payment.method', 'payment.status',
    'payment.receipt.type', 'payment.pos.status', 'payment.contract.status',
  ])
})
```

---

## 十二、旧项目到新项目的映射对照表

| 旧项目 (Rhadamanthus) | 新项目 (view-decoration-pc) | 说明 |
|----------------------|---------------------------|------|
| `com.post(url, data)` | `post('/api/xxx', data)` | API 封装层 |
| `com.get(url, params)` | `get('/api/xxx', params)` | API 封装层 |
| `com.popup4page(url, title)` | `<DetailDrawer>` / `router.push()` | 弹窗/路由替代 |
| `com.popup(content, opts)` | `modal.open(config)` | ModalManager |
| `com.validator(form, rules)` | `<a-form :model :rules>` | Arco Form |
| `Searcher` (自定义) | `<FilterBar>` | 统一搜索组件 |
| `constant.decoration()` | `useDictStore().loadDict('decoration.status')` | 字典 Store |
| `paymentUtils.js` | `usePayment()` composable | 支付逻辑 |
| `quotationUtils.js` | `useQuotationCalc()` composable | 报价计算 |
| `condition/payment.js` | `FilterConfig[]` 配置数组 | 搜索条件 |
| `api.payment.*Index` | `router/routes/dynamicModules/payment.ts` | 路由配置 |
| `drawNode.getConfig(key)` | `route.meta` + Pinia Store | 页面配置 |
| Bootstrap Modal (峰值180/页) | `<a-modal>` / `<a-drawer>` + ModalManager | 弹窗管理 |
| Cookie + Session | Bearer Token + interceptor | 认证方式 |
| 全局变量 + DOM | Pinia Store + Vue 响应式 | 状态管理 |
| 多页面 + iframe | Vue Router SPA | 路由架构 |

---

## 十三、迁移优先级与里程碑

### Phase 1: 基础共享层 (P0, 1-2 周)

1. API 封装层 — `request.ts` + `interceptor.ts` + 模块化 API 结构
2. Store 层 — `useUserStore` + `useDictStore` + `useAppStore`
3. 路由架构 — 四大模块路由骨架
4. 常量/字典系统 — TypeScript enum + 字典映射文件

### Phase 2: 核心共享组件 (P0, 2-3 周)

1. FilterBar — 统一搜索组件 (替代 Searcher)
2. CRUDTable — 统一表格组件
3. ModalManager — 弹窗管理系统 (替代 Bootstrap Modal)
4. DetailDrawer — 详情抽屉 (替代 com.popup4page)

### Phase 3: 业务级共享 (P1, 2-3 周)

1. PersonSelector — 人员选择器 (拼音搜索)
2. BuildingSelector — 楼盘选择器
3. PaymentWidget — 支付组件 (5 种方式)
4. usePayment — 支付逻辑 Composable
5. useQuotationCalc — 报价计算引擎
6. OrderLink — 订单关联组件

### Phase 4: 高级功能 (P2, 1-2 周)

1. ApprovalFlow — 审批流组件
2. DataExport — 数据导出功能
3. ReceiptPrint — 收据打印
4. 微应用通信完善 — CRM/Member 与四大模块的联动

---

## 十四、注意事项与最佳实践

### 14.1 API 命名规范

```
旧: pageDecorationForDesigner.do
新: pageDecoration({ ...params, view: 'designer' })

旧: createDecoration.do
新: postDecoration(data)
```

### 14.2 字典使用规范

```typescript
// 正确: 使用字典 Store
const dictStore = useDictStore()
await dictStore.loadDict('payment.status')
const label = dictStore.getLabel('payment.status', row.status)

// 错误: 硬编码中文
const statusMap = { 0: '未付款', 1: '部分付款' }
```

### 14.3 弹窗管理规范

```typescript
// 正确: 使用参数化复用
const { visible, setVisible } = useVisible()
const currentType = ref('')

function openModal(type: string) {
  currentType.value = type
  setVisible(true)
}

// 错误: 页面中出现数十个 v-if 控制弹窗
```

### 14.4 微前端通信规范

```
事件命名: {目标应用}:{动作}
主→子: 'view-crm-pc:props-change', 'view-crm-pc:open-customer'
子→主: 'sub-route-change', 'micro-app:session-expired'
```

### 14.5 模块独立性原则

- 每个模块的页面、组件、API 文件独立存放，不跨模块直接引用
- 跨模块共享的代码必须放在 `shared/` 或 `business/` 目录下
- 使用 TypeScript 类型系统约束模块间的数据交换格式
- 通过 Pinia Store 和路由参数传递数据，避免直接 import 其他模块的内部实现

---

> 文档版本: v1.0 | 适用范围: decoration / sales / payment / quotation 四大业务模块共享架构
