# 模式映射手册：jQuery/Bootstrap → Vue 3/Arco Design

> Rhadamanthus (jQuery 1.x + Bootstrap 3) → view-decoration-pc (Vue 3.5 + TypeScript 5.8 + Arco Design Vue 2.57)

---

## 目录索引

1. [com.post / com.get — HTTP 请求](#1-compost--comget--http-请求)
2. [Bootstrap Modal — 弹窗](#2-bootstrap-modal--弹窗)
3. [com.popup4page — iframe 子页面](#3-compopup4page--iframe-子页面)
4. [com.popup — 弹窗式页面](#4-compopup--弹窗式页面)
5. [Searcher — 搜索组件](#5-searcher--搜索组件)
6. [drawNode.getConfig — 动态页面配置](#6-drawnodegetconfig--动态页面配置)
7. [paymentUtils.getConfig — 付款权限配置](#7-paymentutilsgetconfig--付款权限配置)
8. [constant.module — 常量系统](#8-constantmodule--常量系统)
9. [quotationUtils / paymentUtils — 大型工具文件](#9-quotationutils--paymentutils--大型工具文件)
10. [condition/module.js — 搜索条件定义](#10-conditionmodulejs--搜索条件定义)
11. [api/module.js — API 端点定义](#11-apimodulejs--api-端点定义)
12. [com.validator — 表单验证](#12-comvalidator--表单验证)
13. [com.dateFormat / com.timeFormat — 日期时间格式化](#13-comdateformat--comtimeformat--日期时间格式化)
14. [Bootstrap Tab — 标签页切换](#14-bootstrap-tab--标签页切换)
15. [Bootstrap Dropdown — 下拉菜单](#15-bootstrap-dropdown--下拉菜单)
16. [动态表格行操作](#16-动态表格行操作)
17. [全局变量共享](#17-全局变量共享)
18. [回调地狱](#18-回调地狱)
19. [DOM 操作更新 UI](#19-dom-操作更新-ui)
20. [formatter 函数 — 表格列格式化](#20-formatter-函数--表格列格式化)

---

## 1. com.post / com.get — HTTP 请求

### 旧写法 (jQuery)

```javascript
// com 是全局封装的 jQuery.ajax 工具
com.post(
  'createDecoration.do',
  {
    orderId: orderId,
    decorationType: type
  },
  function(data) {
    // 成功回调
    console.log('创建成功', data);
    reloadTable();
  },
  function(err) {
    // 失败回调
    com.showMsg('创建失败: ' + err.message);
  }
);

// GET 请求
com.get('queryDecorationByOrderId.do', { orderId: 123 }, function(data) {
  fillForm(data);
});
```

### 新写法 (Vue 3 + Axios)

```typescript
// src/api/decoration/index.ts
import axios from 'axios'
import type { IDecorationView, IDecorationCreateCmd } from '@/types/decoration'

const BASE = '/decoration'

/** 创建装修单 */
export function createDecoration(data: IDecorationCreateCmd) {
  return axios.post<IDecorationView>(`${BASE}/createDecoration`, data)
}

/** 按订单ID查询 */
export function fetchDecorationByOrderId(orderId: number) {
  return axios.get<IDecorationView>(`${BASE}/queryDecorationByOrderId`, {
    params: { orderId },
  })
}

// --- 在组件中使用 ---
import { createDecoration } from '@/api/decoration'

async function handleSubmit() {
  try {
    const { data } = await createDecoration(form)
    Message.success('创建成功')
    reloadTable()
  } catch (err: any) {
    // Axios 拦截器已统一处理错误提示
    console.error('创建失败', err)
  }
}
```

### 关键差异

| 维度 | 旧 (com.post) | 新 (Axios) |
|------|--------------|------------|
| 调用方式 | 回调函数 | async/await + Promise |
| 类型安全 | 无 | 泛型响应 `axios.post<T>()` |
| 错误处理 | 回调参数 | try/catch + 全局拦截器 |
| 拦截器 | jQuery.ajax beforeSend | axios interceptor (interceptor.ts) |
| 请求取消 | 较难 | AbortController / CancelToken |

### 迁移注意事项

- 旧项目所有 `.do` 端点需要确认新后端是否保留相同路径
- `com.post` 的成功/失败回调拆分为 `await` + `try/catch`
- Token 认证由 Axios 拦截器统一注入，无需手动处理
- 批量请求可用 `Promise.all` / `Promise.allSettled` 替代嵌套调用

---

## 2. Bootstrap Modal — 弹窗

### 旧写法 (Bootstrap 3)

```html
<!-- HTML: 弹窗定义（一个页面最多180个 Modal 引用） -->
<div class="modal fade" id="editModal" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">编辑装修单</h4>
      </div>
      <div class="modal-body">
        <!-- 表单内容 -->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
        <button type="button" class="btn btn-primary" onclick="saveEdit()">保存</button>
      </div>
    </div>
  </div>
</div>

<script>
// JS: 手动控制显示/隐藏
$('#editModal').modal('show');
$('#editModal').modal('hide');

// 页面卸载时需要手动清理
$('#editModal').on('hidden.bs.modal', function() {
  // 清理表单状态
});
</script>
```

### 新写法 (Arco Design + useVisible)

```vue
<template>
  <!-- 使用 a-modal 组件 -->
  <a-modal
    v-model:visible="editVisible"
    title="编辑装修单"
    :width="800"
    :mask-closable="false"
    @before-ok="handleSave"
    @cancel="handleCancel"
  >
    <a-form :model="editForm" layout="vertical">
      <a-form-item label="装修类型" field="decorationType">
        <a-select v-model="editForm.decorationType" :options="typeOptions" />
      </a-form-item>
      <!-- 更多表单项 -->
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { useVisible } from '@/hooks/visible'

// 使用 composable 管理弹窗可见性
const { visible: editVisible, setVisible: setEditVisible } = useVisible()

// 编辑表单
const editForm = ref<IDecorationEditCmd>({})

function openEdit(row: IDecorationView) {
  Object.assign(editForm.value, row)
  setEditVisible(true)
}

async function handleSave() {
  await updateDecoration(editForm.value)
  setEditVisible(false)
  Message.success('保存成功')
  reloadTable()
}

function handleCancel() {
  setEditVisible(false)
}

// 暴露给父组件调用
defineExpose({ openEdit })
</script>
```

### 关键差异

| 维度 | 旧 (Bootstrap Modal) | 新 (Arco a-modal) |
|------|---------------------|-------------------|
| 声明方式 | HTML 模板 + jQuery 选择器 | Vue 组件 v-model:visible |
| 状态管理 | DOM 状态 | 响应式 ref (useVisible hook) |
| 内容渲染 | 静态 HTML（所有 Modal 同时存在于 DOM） | 按需渲染，v-if 自动销毁 |
| 表单管理 | 手动获取/设置值 | v-model 双向绑定 |
| 事件处理 | onclick 字符串绑定 | @before-ok / @cancel 事件 |
| 数量问题 | 一个页面 180 个 Modal 引用 | 组件化复用，1个 Modal + 动态数据 |

### 迁移注意事项

- 旧页面大量 Modal 可通过参数化复用同一个 Modal 组件，大幅减少代码量
- `data-dismiss="modal"` 对应 `v-model:visible = false` 或 useVisible 的 `setVisible(false)`
- 弹窗中的表单验证从 `com.validator` 迁移到 Arco Form 的 `rules`
- 注意 `@before-ok` 返回 `false` 或 `Promise` 可阻止关闭
- 嵌套弹窗（Modal 里再开 Modal）在 Arco Design 中原生支持

---

## 3. com.popup4page — iframe 子页面

### 旧写法

```javascript
// 在主页面中以 iframe 方式打开子页面
com.popup4page(
  'views/decoration/decorationDetail.html',  // 子页面URL
  { orderId: 123, readonly: true },          // 传递参数
  function(resultData) {                      // 回调：子页面关闭时返回数据
    console.log('子页面返回:', resultData);
    reloadMainTable();
  }
);

// 子页面中返回数据
function closePage(result) {
  com.closePage(result);  // 关闭 iframe 并触发回调
}
```

### 新写法 (Vue Router + 组件通信)

```vue
<!-- 方案 A：路由跳转 + query 传参 -->
<template>
  <a-button @click="goDetail(row)">查看详情</a-button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goDetail(row: IDecorationView) {
  router.push({
    name: 'DecorationDetail',
    query: { orderId: String(row.orderId), readonly: 'true' }
  })
}
</script>

<!-- 方案 B：弹窗组件 (适合简单场景) -->
<template>
  <DetailDrawer
    v-model:visible="drawerVisible"
    :order-id="currentOrderId"
    :readonly="true"
    @saved="handleSaved"
  />
</template>

<!-- 方案 C：Wujie 微前端 (跨应用通信) -->
<script setup lang="ts">
// 当需要加载旧系统或其他微应用页面时
import { startApp } from '@/wujie'

startApp({
  name: 'legacy-page',
  url: 'http://old-system/views/decoration/decorationDetail.html',
  props: { orderId: 123, readonly: true },
})
</script>
```

### 关键差异

| 维度 | 旧 (popup4page) | 新 (Vue) |
|------|----------------|----------|
| 页面模型 | iframe 嵌套 | 路由组件 / 弹窗组件 |
| 参数传递 | URL 参数 + 回调 | route query / props / emit |
| 返回数据 | com.closePage(result) | emit('saved', data) / router.back() |
| 生命周期 | iframe 独立生命周期 | Vue 组件生命周期 (onMounted 等) |
| 跨应用 | 不支持 | Wujie 微前端 |

### 迁移注意事项

- 优先使用路由跳转替代 iframe，除非必须嵌入外部系统
- 子页面的回调模式 → 父子组件的 emit 事件或 provide/inject
- 如果旧系统页面暂时无法迁移，可通过 Wujie 微前端作为过渡方案
- 注意 iframe 中的全局变量隔离问题在 Vue 组件中不存在

---

## 4. com.popup — 弹窗式页面

### 旧写法

```javascript
// 弹窗式打开一个新页面
com.popup(
  '选择材料',                                    // 标题
  'views/material/materialSelector.html',         // 页面URL
  800,                                             // 宽度
  600                                              // 高度
);

// 弹窗页面内的操作
$('.confirm-btn').on('click', function() {
  var selectedItems = getSelectedItems();
  com.closePopup(selectedItems);  // 返回选中的数据
});
```

### 新写法 (Arco Modal / Drawer)

```vue
<template>
  <!-- 弹窗选择器 -->
  <a-modal
    v-model:visible="selectorVisible"
    title="选择材料"
    :width="800"
    :footer="false"
  >
    <MaterialSelector @select="handleSelect" />
  </a-modal>

  <!-- 抽屉式 -->
  <a-drawer
    v-model:visible="drawerVisible"
    title="选择材料"
    :width="600"
    placement="right"
  >
    <MaterialSelector @select="handleSelect" />
  </a-drawer>
</template>

<script setup lang="ts">
import { useVisible } from '@/hooks/visible'
import MaterialSelector from './components/MaterialSelector.vue'

const { visible: selectorVisible, setVisible } = useVisible()

function handleSelect(items: IMaterial[]) {
  selectedMaterials.value = items
  setVisible(false)
}
</script>
```

### 迁移注意事项

- `com.popup` 的 width/height → `a-modal` 的 `:width` 属性
- 弹窗页面的独立 JS → 封装为子组件 (SFC)
- `com.closePopup(data)` → `emit('select', data)` + `setVisible(false)`
- 对于复杂选择器，建议抽离为独立组件，便于多处复用

---

## 5. Searcher — 搜索组件

### 旧写法

```javascript
// 初始化搜索器
var searcher = new Searcher({
  el: '#searchArea',
  conditions: [
    { name: 'orderId', label: '订单编号', type: 'text' },
    { name: 'status', label: '状态', type: 'select', options: statusOptions },
    { name: 'createTime', label: '创建时间', type: 'dateRange' }
  ],
  url: 'pageDecoration.do',
  columns: [
    { field: 'orderId', title: '订单编号', width: 120 },
    { field: 'status', title: '状态', formatter: statusFormatter },
    { field: 'createTime', title: '创建时间' }
  ],
  onSearch: function(data) {
    renderTable(data);
  }
});

// 手动触发搜索
searcher.search({ status: 1 });
```

### 新写法 (Vue 组件组合)

```vue
<template>
  <!-- 搜索条件区域 -->
  <a-card class="mb-4">
    <a-row :gutter="16">
      <a-col :span="6">
        <a-form-item label="订单编号">
          <a-input v-model="searchForm.orderId" placeholder="请输入" allow-clear />
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="状态">
          <a-select v-model="searchForm.status" :options="statusOptions" allow-clear />
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="创建时间">
          <a-range-picker v-model="searchForm.createTimeRange" />
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-space>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button @click="handleReset">重置</a-button>
        </a-space>
      </a-col>
    </a-row>
  </a-card>

  <!-- 数据表格 -->
  <a-table
    :columns="columns"
    :data="tableData"
    :loading="loading"
    :pagination="pagination"
    @page-change="onPageChange"
    @page-size-change="onPageSizeChange"
  >
    <template #status="{ record }">
      <a-tag :color="getStatusColor(record.status)">
        {{ getStatusLabel(record.status) }}
      </a-tag>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useLoading } from '@/hooks/loading'

const { loading, setLoading } = useLoading()

const searchForm = reactive({
  orderId: '',
  status: undefined as number | undefined,
  createTimeRange: [],
})

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
})

const columns = [
  { title: '订单编号', dataIndex: 'orderId', width: 120 },
  { title: '状态', dataIndex: 'status', slotName: 'status' },
  { title: '创建时间', dataIndex: 'createTime' },
]

const tableData = ref<IDecorationView[]>([])

async function fetchData() {
  setLoading(true)
  try {
    const { data } = await pageDecoration({
      ...searchForm,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    })
    tableData.value = data.records
    pagination.total = data.total
  } finally {
    setLoading(false)
  }
}

function handleSearch() {
  pagination.current = 1
  fetchData()
}

function handleReset() {
  Object.assign(searchForm, { orderId: '', status: undefined, createTimeRange: [] })
  handleSearch()
}

function onPageChange(page: number) {
  pagination.current = page
  fetchData()
}

onMounted(() => fetchData())
</script>
```

### 关键差异

| 维度 | 旧 (Searcher) | 新 (Vue 组合) |
|------|--------------|---------------|
| 条件+表格 | 一体化配置对象 | 搜索区 + a-table 分离 |
| 搜索触发 | searcher.search() | 调用 async 函数 |
| 分页 | Searcher 内置 | a-table pagination 属性 |
| 列格式化 | formatter 回调 | slot 插槽 |
| 状态管理 | Searcher 实例变量 | reactive / ref |

### 迁移注意事项

- Searcher 的 conditions 配置 → 拆解为独立的 a-form-item 组件
- 建议将搜索+表格模式封装为更高阶的 composable（如 `useTableSearch`）
- 旧项目中大量重复的搜索模式可抽取为通用组件

---

## 6. drawNode.getConfig — 动态页面配置

### 旧写法

```javascript
// 根据页面标识动态获取页面配置（字段可见性、权限、布局等）
var config = drawNode.getConfig('decorationDetail');

// 根据配置动态渲染或隐藏元素
if (config.showApproval) {
  $('#approvalSection').show();
}
if (config.editable) {
  $('#editBtn').show();
}

// 配置决定字段是否可编辑
config.fields.forEach(function(field) {
  if (!field.editable) {
    $('#' + field.name).attr('disabled', true);
  }
});
```

### 新写法 (Vue 响应式 + 权限系统)

```vue
<template>
  <div>
    <a-card v-if="pageConfig.showApproval">
      <!-- 审批区域 -->
    </a-card>

    <a-button v-if="pageConfig.editable" @click="handleEdit">编辑</a-button>

    <!-- 字段级别的禁用控制 -->
    <a-form-item label="装修类型">
      <a-select
        v-model="form.type"
        :disabled="!pageConfig.fields.type?.editable"
      />
    </a-form-item>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import usePermission from '@/hooks/permission'

const { checkPermission } = usePermission()

interface IPageConfig {
  showApproval: boolean
  editable: boolean
  fields: Record<string, { editable: boolean; visible: boolean }>
}

const pageConfig = ref<IPageConfig>({
  showApproval: false,
  editable: false,
  fields: {},
})

onMounted(async () => {
  const { data } = await fetchPageConfig('decorationDetail')
  pageConfig.value = data
})
</script>
```

### 关键差异

| 维度 | 旧 (drawNode.getConfig) | 新 (Vue) |
|------|------------------------|----------|
| 配置来源 | drawNode 工具函数 | API 请求 + Pinia/Store |
| UI 响应 | jQuery .show()/.hide() | v-if / v-show / v-permission |
| 字段控制 | attr('disabled', true) | :disabled 绑定 |
| 缓存 | 无或手动缓存 | Pinia store + computed |

### 迁移注意事项

- drawNode 的配置逻辑需迁移为对应的 Vue 响应式数据
- 简单权限判断可使用 `v-permission` 指令替代
- 复杂页面配置建议封装为 `usePageConfig(name)` composable

---

## 7. paymentUtils.getConfig — 付款权限配置

### 旧写法

```javascript
// 获取付款页面特定类型权限配置
var config = paymentUtils.getConfig('paymentCreate', 'advance');

if (config.canCreate) {
  $('#createBtn').show();
}
if (config.maxAmount) {
  $('#amountInput').attr('max', config.maxAmount);
}

// 付款流程节点配置
var nodes = paymentUtils.getFlowNodes('paymentAudit');
nodes.forEach(function(node) {
  addFlowNode(node.name, node.status, node.operator);
});
```

### 新写法 (Composable + 权限)

```typescript
// src/views/payment/hooks/usePaymentConfig.ts
import { ref, onMounted } from 'vue'
import { fetchPaymentConfig } from '@/api/payment/config'
import usePermission from '@/hooks/permission'

export function usePaymentConfig(page: string, type: string) {
  const { checkPermission } = usePermission()

  const config = ref<IPaymentPageConfig>({
    canCreate: false,
    maxAmount: 0,
    flowNodes: [],
  })

  const loading = ref(false)

  async function loadConfig() {
    loading.value = true
    try {
      const { data } = await fetchPaymentConfig({ page, type })
      config.value = data
    } finally {
      loading.value = false
    }
  }

  onMounted(() => loadConfig())

  return { config, loading, reload: loadConfig }
}

// --- 在组件中使用 ---
const { config } = usePaymentConfig('paymentCreate', 'advance')
```

### 迁移注意事项

- paymentUtils 中 1200+ 行的权限判断逻辑需逐一拆解
- 按功能域拆分为独立的 composable（如 usePaymentAudit、usePaymentCreate）
- 流程节点配置可与 Pinia store 配合，实现全局状态共享

---

## 8. constant.module — 常量系统

### 旧写法

```javascript
// 常量按模块组织，链式访问
constant.decoration().status.keys          // 装修单状态枚举
constant.decoration().status.value(1)      // 状态值→中文
constant.payment().type.keys               // 付款类型
constant.quotation().status.map           // 报价状态映射

// 在代码中使用
var statusLabel = constant.decoration().status.value(row.status);
if (row.status === constant.decoration().status.keys.IN_PROGRESS) {
  // 进行中的逻辑
}
```

### 新写法 (TypeScript 枚举 + 字典 Store)

```typescript
// src/constants/decoration.ts
export enum DecorationStatus {
  DRAFT = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  TERMINATED = 3,
  OBSOLETE = 4,
}

export const DecorationStatusLabel: Record<DecorationStatus, string> = {
  [DecorationStatus.DRAFT]: '草稿',
  [DecorationStatus.IN_PROGRESS]: '进行中',
  [DecorationStatus.COMPLETED]: '已完成',
  [DecorationStatus.TERMINATED]: '已终止',
  [DecorationStatus.OBSOLETE]: '已作废',
}

export const DecorationStatusColor: Record<DecorationStatus, string> = {
  [DecorationStatus.DRAFT]: 'gray',
  [DecorationStatus.IN_PROGRESS]: 'blue',
  [DecorationStatus.COMPLETED]: 'green',
  [DecorationStatus.TERMINATED]: 'red',
  [DecorationStatus.OBSOLETE]: 'orangered',
}

// --- 或使用字典 Store (后端管理的动态字典) ---
import { useDictStore } from '@/stores'

const dictStore = useDictStore()
const statusOptions = dictStore.getDictByType('decoration_status')
// 返回 [{ label: '进行中', value: 1, code: 'IN_PROGRESS' }, ...]

// --- 在组件中使用 ---
<template>
  <a-tag :color="DecorationStatusColor[record.status]">
    {{ DecorationStatusLabel[record.status] }}
  </a-tag>
</template>
```

### 关键差异

| 维度 | 旧 (constant) | 新 (TS 枚举 + Dict Store) |
|------|--------------|--------------------------|
| 定义方式 | JS 对象 + 函数调用 | TypeScript enum / const |
| 类型安全 | 无 | 完整类型推导和检查 |
| 动态字典 | 混在 constant 中 | Pinia Dict Store (后端获取) |
| 标签映射 | .value() 方法 | Record 映射对象 |

### 迁移注意事项

- 硬编码常量 → TypeScript enum 文件放在 `src/constants/` 目录
- 后端管理的动态字典 → 使用 `useDictStore().getDictByType(type)` 获取
- 枚举值务必与后端保持一致
- 建议为常用枚举创建对应的 Label 和 Color 映射对象

---

## 9. quotationUtils / paymentUtils — 大型工具文件

### 旧写法

```javascript
// quotationUtils.js — 约 1900 行
var quotationUtils = {
  calculateTotal: function(items) { ... },
  calculateDiscount: function(total, discount) { ... },
  calculateTax: function(amount, rate) { ... },
  formatPrice: function(price) { ... },
  validateQuotation: function(data) { ... },
  getStatusFlow: function(currentStatus) { ... },
  renderPriceCell: function(value) { ... },
  renderStatusCell: function(status) { ... },
};

// paymentUtils.js — 约 1200 行
var paymentUtils = {
  getConfig: function(page, type) { ... },
  calculatePayment: function(items) { ... },
  validatePayment: function(data) { ... },
};
```

### 新写法 (模块化拆分)

```typescript
// src/views/quotation/utils/calculate.ts — 计算逻辑
export function calculateTotal(items: IQuotationItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function calculateDiscount(total: number, discount: number): number {
  return Math.max(0, total - discount)
}

// src/views/quotation/utils/format.ts — 格式化
export function formatPrice(price: number): string {
  return `¥${price.toFixed(2)}`
}

// src/views/quotation/utils/validate.ts — 校验
export function validateQuotation(data: IQuotationCmd): string[] {
  const errors: string[] = []
  if (!data.items.length) errors.push('至少添加一项')
  if (data.total < 0) errors.push('总价不能为负')
  return errors
}

// src/views/quotation/hooks/useQuotationCalc.ts — composable
export function useQuotationCalc() {
  const total = computed(() => calculateTotal(items.value))
  const discount = ref(0)
  const finalPrice = computed(() => calculateDiscount(total.value, discount.value))

  return { total, discount, finalPrice }
}
```

### 关键差异

| 维度 | 旧 (大型 Utils) | 新 (模块化) |
|------|-----------------|------------|
| 文件组织 | 单文件 1200-1900 行 | 按职责拆分为多个文件 |
| 函数类型 | 无类型注解 | 完整 TypeScript 类型 |
| UI 渲染 | 工具函数内操作 DOM | 格式化纯函数 + Vue slot |
| 状态相关 | 混合在工具中 | 独立为 composable (hooks) |
| 可测试性 | 难以单元测试 | 纯函数易于测试 |

### 迁移注意事项

- 按功能域拆分：计算逻辑 → `utils/calculate.ts`，格式化 → `utils/format.ts`，校验 → `utils/validate.ts`
- 涉及响应式状态的逻辑提取为 composable（`hooks/useXxx.ts`）
- UI 渲染函数迁移为 Vue 组件的 slot 或过滤器
- 不要把所有工具函数放在一个文件中，按单一职责原则拆分

---

## 10. condition/module.js — 搜索条件定义

### 旧写法

```javascript
// condition/decoration.js — 搜索条件配置
var decorationConditions = {
  orderId: { label: '订单编号', type: 'text', match: 'like' },
  status: { label: '状态', type: 'select', options: constant.decoration().status.keys },
  customerId: { label: '客户', type: 'autocomplete', url: 'queryCustomer.do' },
  createTimeRange: { label: '创建时间', type: 'dateRange' },
  designerId: { label: '设计师', type: 'select', url: 'queryDesignerList.do' },
};
```

### 新写法 (TypeScript 接口 + 组件)

```typescript
// src/views/decoration/types/search.ts
export interface IDecorationSearch {
  orderId?: string
  status?: number
  customerId?: number
  createTimeRange?: string[]
  designerId?: number
}

// src/views/decoration/constants/search.ts
export const SEARCH_FIELDS: ISearchFieldConfig[] = [
  { key: 'orderId', label: '订单编号', component: 'input', span: 6 },
  {
    key: 'status',
    label: '状态',
    component: 'select',
    span: 6,
    dictType: 'decoration_status',  // 自动加载字典
  },
  {
    key: 'customerId',
    label: '客户',
    component: 'remote-select',  // 远程搜索下拉
    span: 6,
    fetchAction: fetchCustomerOptions,
  },
  {
    key: 'createTimeRange',
    label: '创建时间',
    component: 'range-picker',
    span: 6,
  },
]
```

### 迁移注意事项

- condition 文件中的类型配置 → TypeScript interface 定义搜索参数类型
- `type: 'select'` + `options` → 使用 `useDictStore` 加载字典
- `type: 'autocomplete'` → 封装远程搜索选择器组件
- 建议将通用搜索表单封装为 `SearchForm` 组件，接受配置数组

---

## 11. api/module.js — API 端点定义

### 旧写法

```javascript
// api/decoration.js — 约 300 行，149 个端点
var decorationApi = {
  createDecoration: 'createDecoration.do',
  queryDecorationByOrderId: 'queryDecorationByOrderId.do',
  pageDecoration: 'pageDecoration.do',
  pageDecorationForDesigner: 'pageDecorationForDesigner.do',
  checkDecoration: 'checkDecoration.do',
  // ... 140+ more
};
```

### 新写法 (Axios + TypeScript)

```typescript
// src/api/decoration/index.ts
import axios from 'axios'
import type { Page } from '@/types/global'
import type {
  IDecorationView,
  IDecorationCreateCmd,
  IDecorationPageQry,
} from '@/types/decoration'

const BASE = '/decoration'

/** 创建装修单 */
export function createDecoration(data: IDecorationCreateCmd) {
  return axios.post<IDecorationView>(`${BASE}/createDecoration`, data)
}

/** 按订单ID查询 */
export function fetchDecorationByOrderId(params: { orderId: number }) {
  return axios.get<IDecorationView>(`${BASE}/queryDecorationByOrderId`, { params })
}

/** 通用分页查询 */
export function pageDecoration(params: IDecorationPageQry) {
  return axios.get<Page<IDecorationView>>(`${BASE}/pageDecoration`, { params })
}

/** 审核装修单 */
export function checkDecoration(data: { orderId: number; result: boolean; comment?: string }) {
  return axios.post(`${BASE}/checkDecoration`, data)
}
```

### 关键差异

| 维度 | 旧 (api/decoration.js) | 新 (api/decoration/index.ts) |
|------|----------------------|------------------------------|
| 定义方式 | 字符串映射 | 类型化函数 |
| 类型安全 | 无 | 入参 + 返回值完整类型 |
| 请求方法 | 隐式 (com.post/get 决定) | 显式 (axios.get/post/put/delete) |
| URL 管理 | .do 后缀 | RESTful 风格或保留原有路径 |

### 迁移注意事项

- 每个 API 端点定义为一个独立的导出函数
- 必须定义请求参数和响应数据的 TypeScript 接口
- API 函数放在 `src/api/<module>/index.ts`，类型放在 `src/types/<module>/`

---

## 12. com.validator — 表单验证

### 旧写法

```javascript
var validResult = com.validator.validate('#editForm', {
  orderId: { required: true, message: '订单编号不能为空' },
  amount: { required: true, type: 'number', min: 0, message: '金额必须大于0' },
  phone: { required: true, pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误' },
});

if (!validResult.pass) {
  com.showMsg(validResult.message);
  return;
}
```

### 新写法 (Arco Form Validation)

```vue
<template>
  <a-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    layout="vertical"
    @submit-success="handleSubmit"
  >
    <a-form-item label="订单编号" field="orderId">
      <a-input v-model="formData.orderId" placeholder="请输入订单编号" />
    </a-form-item>
    <a-form-item label="金额" field="amount">
      <a-input-number v-model="formData.amount" :min="0" :precision="2" />
    </a-form-item>
    <a-form-item label="手机号" field="phone">
      <a-input v-model="formData.phone" placeholder="请输入手机号" />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import type { FormInstance } from '@arco-design/web-vue'

const formRef = ref<FormInstance>()

const formData = reactive({
  orderId: '',
  amount: 0,
  phone: '',
})

const formRules = {
  orderId: [{ required: true, message: '订单编号不能为空' }],
  amount: [
    { required: true, message: '金额不能为空' },
    { type: 'number', min: 0.01, message: '金额必须大于0' },
  ],
  phone: [
    { required: true, message: '手机号不能为空' },
    { match: /^1[3-9]\d{9}$/, message: '手机号格式错误' },
  ],
}

async function handleSubmit() {
  await createDecoration(formData)
  Message.success('创建成功')
}
</script>
```

### 关键差异

| 维度 | 旧 (com.validator) | 新 (Arco Form) |
|------|--------------------|----------------|
| 验证时机 | 手动调用 | 自动触发 + 手动 validate() |
| 错误展示 | com.showMsg 弹窗 | 表单项下方红色文字 |
| 定义位置 | 独立调用 | a-form 的 :rules 属性 |
| 自定义规则 | pattern 正则 | validator 函数（更灵活） |

---

## 13. com.dateFormat / com.timeFormat — 日期时间格式化

### 旧写法

```javascript
var dateStr = com.dateFormat(new Date());        // "2024-01-15"
var timeStr = com.timeFormat(new Date());        // "2024-01-15 14:30:00"
var customFormat = com.dateFormat(date, 'yyyy/MM/dd');

// 在表格中使用
{ field: 'createTime', title: '创建时间', formatter: function(v) {
  return com.timeFormat(new Date(v));
}}
```

### 新写法 (Day.js)

```typescript
// src/utils/date.ts
import dayjs from 'dayjs'

export function formatDate(date: Date | string | number, format = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format)
}

export function formatDateTime(date: Date | string | number): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

// --- 在组件中使用 ---
import { formatDateTime } from '@/utils/date'

// 表格列
{ title: '创建时间', dataIndex: 'createTime', render: ({ record }) => formatDateTime(record.createTime) }

// Arco DatePicker
<a-date-picker v-model="form.date" format="YYYY-MM-DD" />
```

### 关键差异

| 维度 | 旧 (com.dateFormat) | 新 (dayjs) |
|------|--------------------|-------------|
| 库 | 自定义封装 | dayjs（2KB，moment 兼容 API） |
| 格式 | yyyy-MM-dd | YYYY-MM-DD（ISO 格式） |
| 链式操作 | 不支持 | dayjs().add(1, 'day').format() |

### 迁移注意事项

- 日期格式模板从 `yyyy-MM-dd` → `YYYY-MM-DD`（大小写变化）
- 建议封装为 `src/utils/date.ts` 统一导出
- Arco Design 的 DatePicker 已内置 dayjs，无需额外配置

---

## 14. Bootstrap Tab — 标签页切换

### 旧写法

```html
<ul class="nav nav-tabs">
  <li class="active"><a href="#basicInfo" data-toggle="tab">基本信息</a></li>
  <li><a href="#materialInfo" data-toggle="tab">材料信息</a></li>
  <li><a href="#paymentInfo" data-toggle="tab">付款信息</a></li>
</ul>

<div class="tab-content">
  <div class="tab-pane active" id="basicInfo">基本内容...</div>
  <div class="tab-pane" id="materialInfo">材料内容...</div>
  <div class="tab-pane" id="paymentInfo">付款内容...</div>
</div>

<script>
$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
  var target = $(e.target).attr('href');
  if (target === '#materialInfo') {
    loadMaterialData();
  }
});
</script>
```

### 新写法 (Arco Tabs)

```vue
<template>
  <a-tabs v-model:active-key="activeTab" type="line" @change="handleTabChange">
    <a-tab-pane key="basicInfo" title="基本信息">
      <BasicInfoTab :data="decorationData" />
    </a-tab-pane>
    <a-tab-pane key="materialInfo" title="材料信息">
      <MaterialInfoTab :order-id="orderId" />
    </a-tab-pane>
    <a-tab-pane key="paymentInfo" title="付款信息">
      <PaymentInfoTab :order-id="orderId" />
    </a-tab-pane>
  </a-tabs>
</template>

<script setup lang="ts">
const activeTab = ref('basicInfo')
</script>
```

### 关键差异

| 维度 | 旧 (Bootstrap Tab) | 新 (Arco Tabs) |
|------|-------------------|-----------------|
| 声明方式 | HTML + CSS 类 | a-tabs + a-tab-pane 组件 |
| 状态绑定 | DOM 类名 (active) | v-model:active-key |
| 内容区 | div.tab-pane | 组件化的 TabPane |
| 懒加载 | 手动 JS 逻辑 | 组件 onMounted 或 v-if |

### 迁移注意事项

- 每个 tab 的内容建议封装为独立子组件
- `data-toggle="tab"` → `v-model:active-key` 双向绑定
- 复杂 tab 内容可用 `<component :is="...">` + `defineAsyncComponent`

---

## 15. Bootstrap Dropdown — 下拉菜单

### 旧写法

```html
<div class="dropdown">
  <button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
    操作 <span class="caret"></span>
  </button>
  <ul class="dropdown-menu">
    <li><a href="#" onclick="viewDetail()">查看</a></li>
    <li><a href="#" onclick="editItem()">编辑</a></li>
    <li class="divider"></li>
    <li><a href="#" onclick="deleteItem()">删除</a></li>
  </ul>
</div>
```

### 新写法 (Arco Dropdown)

```vue
<template>
  <a-dropdown @select="handleAction">
    <a-button>操作 <icon-down /></a-button>
    <template #content>
      <a-doption :value="'view'">查看</a-doption>
      <a-doption :value="'edit'">编辑</a-doption>
      <a-dseparator />
      <a-doption :value="'delete'" class="text-red-500">删除</a-doption>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
function handleAction(value: string) {
  switch (value) {
    case 'view': viewDetail(); break
    case 'edit': editItem(); break
    case 'delete': deleteItem(); break
  }
}
</script>
```

### 迁移注意事项

- `data-toggle="dropdown"` → `<a-dropdown>` 组件
- `onclick` 字符串 → `@select` 事件 + 值判断
- `<li class="divider">` → `<a-dseparator />`

---

## 16. 动态表格行操作

### 旧写法

```javascript
function addOrderItem() {
  var index = $('#itemTable tbody tr').length;
  var row = '<tr data-index="' + index + '">' +
    '<td><input type="text" name="items[' + index + '].name" /></td>' +
    '<td><input type="number" name="items[' + index + '].price" /></td>' +
    '<td><button onclick="removeRow(this)">删除</button></td>' +
    '</tr>';
  $('#itemTable tbody').append(row);
  calculateTotal();
}

function removeRow(btn) {
  $(btn).closest('tr').remove();
  calculateTotal();
}

function calculateTotal() {
  var total = 0;
  $('#itemTable tbody tr').each(function() {
    var price = $(this).find('input[name*="price"]').val() || 0;
    var qty = $(this).find('input[name*="quantity"]').val() || 0;
    total += parseFloat(price) * parseInt(qty);
  });
  $('#totalAmount').text('合计: ¥' + total.toFixed(2));
}
```

### 新写法 (Vue 响应式数组)

```vue
<template>
  <a-table :data="orderItems" :columns="itemColumns" :pagination="false">
    <template #name="{ record }">
      <a-input v-model="record.name" placeholder="材料名称" />
    </template>
    <template #price="{ record }">
      <a-input-number v-model="record.price" :min="0" :precision="2" />
    </template>
    <template #quantity="{ record }">
      <a-input-number v-model="record.quantity" :min="1" />
    </template>
    <template #subtotal="{ record }">
      ¥{{ (record.price * record.quantity).toFixed(2) }}
    </template>
    <template #action="{ rowIndex }">
      <a-button status="danger" @click="removeItem(rowIndex)">删除</a-button>
    </template>
  </a-table>

  <div class="mt-4 flex justify-between">
    <a-button @click="addItem">添加行</a-button>
    <span>合计: ¥{{ totalAmount.toFixed(2) }}</span>
  </div>
</template>

<script setup lang="ts">
interface IOrderItem { name: string; price: number; quantity: number }

const orderItems = ref<IOrderItem[]>([
  { name: '', price: 0, quantity: 1 },
])

const totalAmount = computed(() =>
  orderItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

function addItem() {
  orderItems.value.push({ name: '', price: 0, quantity: 1 })
}

function removeItem(index: number) {
  orderItems.value.splice(index, 1)
}
</script>
```

### 关键差异

| 维度 | 旧 (jQuery DOM 操作) | 新 (Vue 响应式) |
|------|---------------------|-----------------|
| 行数据 | DOM 中的 input 值 | 响应式数组元素 |
| 添加行 | append HTML 字符串 | array.push() |
| 删除行 | closest('tr').remove() | array.splice(index, 1) |
| 合计计算 | 手动遍历 DOM | computed 自动计算 |
| 序号管理 | 手动 reindex | 数组索引自动 |

---

## 17. 全局变量共享

### 旧写法

```javascript
// 通过 window 对象共享状态
window.currentOrderId = 123;
window.userInfo = { name: '张三', role: 'admin' };
window.decorationCache = {};

// 跨页面/iframe 访问
var orderId = window.parent.currentOrderId;
```

### 新写法 (Pinia Store)

```typescript
// src/stores/modules/app/index.ts
import { defineStore } from 'pinia'

const useAppStore = defineStore('app', {
  state: () => ({
    currentOrderId: null as number | null,
    userInfo: null as IUserInfo | null,
  }),
  actions: {
    setCurrentOrder(orderId: number) {
      this.currentOrderId = orderId
    },
  },
})

// --- 在任意组件中使用 ---
const appStore = useAppStore()
appStore.setCurrentOrder(123)

// 响应式监听
watch(() => appStore.currentOrderId, (newVal) => {
  console.log('订单ID变化:', newVal)
})
```

### 关键差异

| 维度 | 旧 (window/闭包) | 新 (Pinia) |
|------|-------------------|------------|
| 作用域 | 全局无隔离 | Store 命名空间隔离 |
| 响应式 | 无 | 自动响应式 |
| 类型安全 | 无 | TypeScript 完整推导 |
| 调试 | console.log | Pinia DevTools |
| 持久化 | 手动 localStorage | pinia-plugin-persistedstate |

---

## 18. 回调地狱

### 旧写法

```javascript
com.post('queryDecoration.do', { orderId: 123 }, function(decoration) {
  com.post('queryCustomer.do', { customerId: decoration.customerId }, function(customer) {
    com.post('queryDesigner.do', { designerId: decoration.designerId }, function(designer) {
      com.post('queryPaymentList.do', { orderId: 123 }, function(payments) {
        renderPage(decoration, customer, designer, payments);
      }, errorHandler);
    }, errorHandler);
  }, errorHandler);
}, errorHandler);
```

### 新写法 (async/await + Promise.all)

```typescript
async function loadPageData() {
  try {
    const decoration = await fetchDecoration(123)
    const [customer, designer] = await Promise.all([
      fetchCustomer(decoration.customerId),
      fetchDesigner(decoration.designerId),
    ])
    const [payments, quotation] = await Promise.all([
      fetchPaymentList(123),
      fetchQuotation(123),
    ])
    renderPage(decoration, customer, designer, payments, quotation)
  } catch (err) {
    Message.error('加载数据失败')
  }
}
```

### 关键差异

| 维度 | 旧 (回调嵌套) | 新 (async/await) |
|------|--------------|------------------|
| 可读性 | 金字塔式缩进 | 线性扁平结构 |
| 错误处理 | 每层单独处理 | 统一 try/catch |
| 并行执行 | 困难 | Promise.all |
| 条件逻辑 | 回调内 if/else | 正常的 if/else |

---

## 19. DOM 操作更新 UI

### 旧写法

```javascript
$('#orderName').text(order.name);
$('#statusSelect').val(order.status);
$('#editSection').show();
$('#viewSection').hide();
$('#detailPanel').html('<div>' + customer.name + '</div>');
$('#submitBtn').addClass('disabled').prop('disabled', true);
$('#progressBar').css('width', '60%');
```

### 新写法 (Vue 响应式数据绑定)

```vue
<template>
  <span>{{ order.name }}</span>
  <a-select v-model="order.status" />
  <div v-if="isEditing">编辑区域</div>
  <div v-else>查看区域</div>
  <a-button :disabled="!canSubmit" @click="handleSubmit">提交</a-button>
  <div class="progress-bar" :style="{ width: progress + '%' }"></div>
</template>
```

### jQuery → Vue 操作对照表

| jQuery 操作 | Vue 等价写法 |
|-------------|-------------|
| `.text(value)` | `{{ value }}` 插值 |
| `.val(value)` | `v-model` 双向绑定 |
| `.show()` / `.hide()` | `v-if` / `v-show` |
| `.html(content)` | 模板 + 数据绑定 |
| `.addClass()` / `.removeClass()` | `:class` 动态绑定 |
| `.css('width', val)` | `:style` 动态绑定 |
| `.prop('disabled', bool)` | `:disabled` 属性绑定 |
| `.each()` + 修改 | `v-for` + 响应式数据 |

### 迁移注意事项

- 核心思维转变：从"操作 DOM 改变 UI"到"改变数据，UI 自动更新"
- 不要在 Vue 项目中使用 jQuery 操作 DOM
- `v-if` 是条件渲染（销毁/重建 DOM），`v-show` 是 CSS display 切换
- 频繁切换用 `v-show`，条件稳定用 `v-if`

---

## 20. formatter 函数 — 表格列格式化

### 旧写法

```javascript
var columns = [
  {
    field: 'status',
    title: '状态',
    formatter: function(value, row, index) {
      return '<span class="label label-' + getStatusColor(value) + '">'
        + constant.decoration().status.value(value) + '</span>';
    }
  },
  {
    field: 'amount',
    title: '金额',
    formatter: function(value) {
      return '¥' + parseFloat(value).toFixed(2);
    }
  },
  {
    field: 'orderId',
    title: '操作',
    formatter: function(value, row) {
      return '<button class="btn btn-sm btn-primary" onclick="viewDetail(' + value + ')">查看</button>';
    }
  }
];
```

### 新写法 (Arco Table Slot)

```vue
<template>
  <a-table :data="tableData" :columns="columns">
    <template #status="{ record }">
      <a-tag :color="getStatusColor(record.status)">
        {{ DecorationStatusLabel[record.status] }}
      </a-tag>
    </template>

    <template #amount="{ record }">
      ¥{{ Number(record.amount).toFixed(2) }}
    </template>

    <template #action="{ record }">
      <a-space>
        <a-button type="text" size="small" @click="viewDetail(record)">查看</a-button>
        <a-button type="text" status="danger" size="small" @click="deleteItem(record)">删除</a-button>
      </a-space>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { DecorationStatusLabel, DecorationStatusColor } from '@/constants/decoration'

const columns = [
  { title: '状态', dataIndex: 'status', slotName: 'status' },
  { title: '金额', dataIndex: 'amount', slotName: 'amount', align: 'right' },
  { title: '操作', slotName: 'action', width: 150 },
]
</script>
```

### 关键差异

| 维度 | 旧 (formatter) | 新 (Table Slot) |
|------|----------------|-----------------|
| 定义位置 | 列配置中的函数 | 模板中的 slot |
| 返回值 | HTML 字符串 | Vue 模板语法 |
| 事件绑定 | onclick 字符串拼接 | @click 事件绑定 |
| 组件使用 | 无法使用 | 可嵌套任意 Arco 组件 |
| 类型安全 | 无 | 完整 TypeScript 类型 |

---

## 21. 权限控制 — drawNode/paymentUtils → usePermission

### 旧写法 (drawNode.getConfig / paymentUtils.getConfig)

```javascript
// 旧项目: 后端返回页面配置, 前端根据配置动态显示/隐藏元素
var config = drawNode.getConfig("decoration.list")
if (config.showAuditButton) {
  $('#btn-audit').show()
}
if (config.editableFields.indexOf('status') >= 0) {
  $('#status-select').prop('disabled', false)
}

// Payment 模块: paymentUtils.getConfig 控制收款按钮
var payConfig = paymentUtils.getConfig()
if (payConfig.canCollect) {
  $('#btn-collect').show()
}
```

### 新写法 (usePermission + v-permission 指令)

```typescript
// Vue 3: 声明式权限控制
// 1. 模板中使用指令
<template>
  <a-button v-permission="'decoration:list:btn:audit'" @click="handleAudit">审核</a-button>
  <a-button v-permission="'payment:collect'" type="primary" @click="handleCollect">收款</a-button>
  <a-select v-model="form.status" :disabled="!canEdit('status')">
    <!-- ... -->
  </a-select>
</template>

// 2. 组件中使用 composable
<script setup lang="ts">
import { usePermission } from '@/hooks/business/usePermission'

const { canBtn, canPage, getViewConfig } = usePermission()

// 替代 drawNode.getConfig 的角色配置
const viewConfig = getViewConfig(
  {
    'designer': { showAudit: false, editableFields: ['remark'] },
    'manager': { showAudit: true, editableFields: ['status', 'remark', 'designer'] },
    'admin':   { showAudit: true, editableFields: ['*'] },
  },
  { showAudit: false, editableFields: [] }  // 默认配置
)

function canEdit(field: string): boolean {
  if (viewConfig.editableFields.includes('*')) return true
  return viewConfig.editableFields.includes(field)
}
</script>
```

### 关键差异

| 维度 | 旧写法 | 新写法 |
|------|--------|--------|
| 配置来源 | 后端 DB 驱动, 每次请求 | 前端角色映射 + 后端菜单权限 |
| 控制粒度 | 配置对象属性判断 | 指令级 DOM 移除 + composable 逻辑判断 |
| 性能 | 每页需请求配置接口 | Store 初始化一次, 内存判断 |
| 类型安全 | 无 (动态属性) | 完整 TypeScript 类型 |
| 测试性 | 难以测试 | composable 可独立单测 |

### 迁移注意事项

- drawNode.getConfig 返回的配置需按角色拆分到 getViewConfig 映射表
- paymentUtils.getConfig 的 visibleMethods/hiddenColumns 映射到 usePermission 的 canBtn/canPage
- 旧项目中通过 `config.xxx` 判断隐藏的按钮, 新项目统一用 `v-permission` 指令

---

## 22. TypeScript 类型系统 — 无类型 → 完整类型定义

### 旧写法 (JavaScript 无类型)

```javascript
// 旧项目: 纯 JavaScript, 无类型约束
var order = {
  orderId: "",
  customer: { name: "", phone: "" },
  items: [],
  status: 0,
  totalAmount: 0
}
// 可以随意添加/修改属性, 运行时才发现错误
order.totlAmount = 100  // 拼写错误不会报错
```

### 新写法 (TypeScript 接口 + 泛型)

```typescript
// 新项目: 完整类型定义

// 1. 基础 VO 类型
interface OrderVO {
  orderId: string
  customer: CustomerBrief
  items: OrderItemVO[]
  status: OrderStatus
  totalAmount: number
  createTime: string
}

// 2. 枚举约束
enum OrderStatus {
  Draft = 0,
  Pending = 1,
  Confirmed = 2,
  Shipped = 3,
  Completed = 4,
  Cancelled = -1,
}

// 3. 泛型 API 响应
interface ApiResponse<T> {
  code: number
  msg: string
  data: T
}

interface PageResult<T> {
  rows: T[]
  total: number
}

// 4. 泛型查询参数
interface PageQuery {
  page: number
  pageSize: number
  [key: string]: any
}

// 5. 类型守卫
function isOrderVO(data: unknown): data is OrderVO {
  return typeof data === 'object' && data !== null
    && typeof (data as OrderVO).orderId === 'string'
}

// 6. 工具类型
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type OrderCreateCmd = Optional<OrderVO, 'orderId' | 'createTime' | 'status'>
```

### 关键差异

| 维度 | 旧写法 | 新写法 |
|------|--------|--------|
| 类型检查 | 无, 运行时发现错误 | 编译时发现错误 |
| IDE 支持 | 无自动补全 | 完整自动补全 + 类型提示 |
| 重构安全 | 不安全, 全局搜索 | 安全, 编译器自动检测 |
| API 契约 | 靠注释和文档 | 接口定义即文档 |
| 泛型复用 | 无法实现 | PageResult\<T\>、ApiResponse\<T\> 等 |
| 枚举 | 魔法数字 | TypeScript enum / const enum |

### 迁移注意事项

- 旧项目中的 `var obj = {}` 需转为明确类型定义
- 后端返回的数字状态码 (0,1,2...) 需定义对应枚举
- 旧项目中 `data.xxx` 动态取值的场景需用类型守卫保护
- 所有 API 函数参数和返回值必须声明类型

---

## 23. 错误处理 — com.post 回调 → Axios 拦截器

### 旧写法 (com.post 回调)

```javascript
// 旧项目: 每个请求单独处理错误, 容易遗漏
com.post(url, params, function(result) {
  if (result.errorCode == 0) {
    // 成功
    layer.msg('操作成功')
  } else if (result.errorCode == 1) {
    layer.msg(result.errorMessage)
  } else if (result.errorCode == 99) {
    layer.msg('登录已过期, 请重新登录')
    window.location.href = '/login'
  }
})
// 或者完全忽略错误处理
com.post(url, params, function(result) {
  // 只处理成功, 错误无人管
})
```

### 新写法 (Axios 拦截器 + 统一错误处理)

```typescript
// src/api/interceptor.ts — 统一拦截
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// 错误分类
enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',       // 网络错误
  SERVER_ERROR = 'SERVER_ERROR',         // 5xx
  BUSINESS_ERROR = 'BUSINESS_ERROR',     // code != 0
  AUTH_ERROR = 'AUTH_ERROR',             // 401/403
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',       // 超时
  VALIDATION_ERROR = 'VALIDATION_ERROR', // 参数校验失败
}

interface ApiError {
  type: ErrorType
  code: number
  message: string
  detail?: any
}

// 响应拦截器
function responseInterceptor(response: AxiosResponse): any {
  const { data } = response

  // 后端统一响应格式: { code, msg, data }
  if (data.code === 0) {
    return data.data  // 直接返回业务数据
  }

  // 业务错误
  const error: ApiError = {
    type: ErrorType.BUSINESS_ERROR,
    code: data.code,
    message: data.msg || '操作失败',
    detail: data,
  }

  // 特殊业务码处理
  switch (data.code) {
    case 401:
      error.type = ErrorType.AUTH_ERROR
      error.message = '登录已过期'
      redirectToLogin()
      break
    case 403:
      error.type = ErrorType.AUTH_ERROR
      error.message = '无操作权限'
      break
    case 422:
      error.type = ErrorType.VALIDATION_ERROR
      break
  }

  // 显示错误提示 (除特殊处理外)
  if (error.type === ErrorType.BUSINESS_ERROR) {
    Message.error(error.message)
  }

  return Promise.reject(error)
}

// 错误拦截器
function errorInterceptor(error: AxiosError): Promise<never> {
  const apiError: ApiError = {
    type: ErrorType.NETWORK_ERROR,
    code: 0,
    message: '网络异常',
  }

  if (error.response) {
    const status = error.response.status
    apiError.code = status

    if (status >= 500) {
      apiError.type = ErrorType.SERVER_ERROR
      apiError.message = '服务器异常, 请稍后重试'
    } else if (status === 401) {
      apiError.type = ErrorType.AUTH_ERROR
      apiError.message = '登录已过期'
      redirectToLogin()
    } else if (status === 403) {
      apiError.type = ErrorType.AUTH_ERROR
      apiError.message = '无操作权限'
    }
  } else if (error.code === 'ECONNABORTED') {
    apiError.type = ErrorType.TIMEOUT_ERROR
    apiError.message = '请求超时'
  }

  Message.error(apiError.message)
  return Promise.reject(apiError)
}

// --- 组件中使用 ---
// 默认: 错误自动提示, 无需手动处理
async function handleSubmit() {
  try {
    const result = await collectPayment(form)
    Message.success('收款成功')
  } catch (error: any) {
    // 错误已被拦截器处理, 这里只做额外逻辑
    if (error.type === ErrorType.BUSINESS_ERROR) {
      // 特殊业务错误 (如余额不足) 需额外处理
      showInsufficientBalanceDialog()
    }
    // 网络错误、权限错误等已由拦截器统一提示
  }
}
```

### 关键差异

| 维度 | 旧写法 | 新写法 |
|------|--------|--------|
| 错误处理 | 每个请求单独写, 容易遗漏 | 拦截器统一处理, 不遗漏 |
| 错误分类 | 只有 errorCode 数字 | ErrorType 枚举 + 结构化 ApiError |
| 提示方式 | layer.msg (全局) | Arco Message (可配置位置/类型) |
| 认证过期 | 手动判断 | 拦截器自动检测 + 跳转 |
| 可测试性 | 难以测试 | 拦截器可独立单测 |
| 组件代码 | 大量 if/else | try/catch, 错误已默认处理 |

### 迁移注意事项

- 旧项目中所有 `if (result.errorCode == 0)` 检查直接移除, 改为 try/catch
- `layer.msg('xxx')` 替换为 `Message.success/error('xxx')`
- 旧项目中手动判断 401/403 的代码全部移除, 由拦截器统一处理
- 特殊业务错误码 (如余额不足、库存不够) 在 catch 中按 type 区分处理

---

## 24. 配置驱动 → 声明式配置模式对比

### drawNode / paymentUtils / quotationUtils 配置对照

| 配置维度 | 旧写法 (配置对象) | 新写法 (声明式) | 涉及模式 |
|----------|------------------|----------------|----------|
| 页面字段显隐 | `config.showFields` | `v-if="viewConfig.showFields.includes('xxx')"` | 模式 6, 7 |
| 按钮权限 | `config.canAudit` | `v-permission="'module:btn:audit'"` | 模式 21 |
| 表格列显隐 | `config.hiddenColumns` | `computed(() => columns.filter(c => !hiddenCols.includes(c.dataIndex)))` | 模式 20 |
| 支付方式过滤 | `config.visibleMethods` | `paymentMethods.filter(m => canBtn('payment:method:' + m.code))` | 模式 7 |
| 表单字段只读 | `config.readonlyFields` | `:disabled="!canEdit('fieldName')"` | 模式 21 |
| 搜索条件显隐 | `config.filterKeys` | `route.meta.filterKeys` + `useFilterBar` | 模式 10 |
| 角色视图切换 | `config.roleViews` | `getViewConfig(roleMap, defaultConfig)` | 模式 21 |

### 迁移映射模板

```typescript
// 通用配置迁移模板: 将后端配置对象转为前端声明式配置
interface LegacyPageConfig {
  showFields?: string[]
  hiddenColumns?: string[]
  canAudit?: boolean
  canCollect?: boolean
  visibleMethods?: string[]
  readonlyFields?: string[]
}

function migrateLegacyConfig(legacy: LegacyPageConfig) {
  // 将后端配置映射为前端权限码
  const permCodes: string[] = []
  if (legacy.canAudit) permCodes.push('module:btn:audit')
  if (legacy.canCollect) permCodes.push('payment:collect')

  return {
    visibleFields: new Set(legacy.showFields || []),
    hiddenColumns: new Set(legacy.hiddenColumns || []),
    permCodes,
    visibleMethods: new Set(legacy.visibleMethods || []),
    readonlyFields: new Set(legacy.readonlyFields || []),
  }
}
```

---

## 附录：通用迁移检查清单

每个页面迁移时，请对照以下清单：

- [ ] API 调用：com.post/com.get → 类型化 Axios 函数
- [ ] 弹窗：Bootstrap Modal → a-modal + useVisible
- [ ] 表单：jQuery 获取/设置值 → v-model 双向绑定
- [ ] 表单验证：com.validator → Arco Form rules
- [ ] 表格：Bootstrap Table / 手动拼接 → a-table + slot
- [ ] 搜索：Searcher → 搜索表单 + a-table 组合
- [ ] 分页：Searcher 内置 → a-table pagination
- [ ] 下拉选择：Bootstrap Dropdown → a-dropdown / a-select
- [ ] 标签页：Bootstrap Tab → a-tabs
- [ ] 常量：constant.module() → TypeScript enum + Dict Store
- [ ] 工具函数：大型 Utils 文件 → 按职责拆分的模块化 TS 文件
- [ ] 全局状态：window 变量 → Pinia Store
- [ ] 回调嵌套 → async/await + Promise.all
- [ ] DOM 操作 → 响应式数据绑定
- [ ] 日期格式化：com.dateFormat → dayjs
- [ ] iframe 页面 → Vue Router 路由组件
- [ ] 权限控制：drawNode/paymentUtils → usePermission + v-permission
- [ ] 类型定义：无 → 完整 TypeScript 接口

---

> 文档版本: v1.0 | 适用范围: decoration / sales / payment / quotation 四大业务模块
