# 组件拆分手册 (P0)

> 3个最复杂页面的 Vue 3 组件拆分方案 + Modal 复用策略

---

## 目录

1. [总则：拆分原则与约束](#一总则拆分原则与约束)
2. [Modal 复用体系：180个 Bootstrap Modal → 5个参数化弹窗](#二modal-复用体系180个-bootstrap-modal--5个参数化弹窗)
3. [页面一：decorationIndex.js 装修单列表 (2815行)](#三页面一decorationindexjs-装修单列表-2815行)
4. [页面二：payment.js 预付款列表 (65个Modal)](#四页面二paymentjs-预付款列表-65个modal)
5. [页面三：quotationPart.js 报价单详情 (5195行, 180个Modal)](#五页面三quotationpartjs-报价单详情-5195行-180个modal)
6. [页面四：decoration4detail.js 装修单详情 (2176行, 16个Modal)](#六页面四decoration4detailjs-装修单详情-2176行-16个modal)
7. [Composable 拆分清单](#七composable-拆分清单)
8. [目录结构全景图](#八目录结构全景图)

---

## 一、总则：拆分原则与约束

### 1.1 核心约束

| 规则 | 说明 |
|------|------|
| 单文件不超过 300 行 | 超出必须拆分子组件或提取 composable |
| 组件粒度 | 一个组件只做一件事（单一职责） |
| 数据流方向 | Props 下传，Emits 上报，禁止跨层级直接访问 |
| 共享状态 | 跨 Tab/跨组件的数据统一走 Pinia Store |
| Modal 复用 | 同类操作（编辑/查看/确认）使用同一个参数化 Modal |

### 1.2 组件分层模型

```
页面级组件 (index.vue)
  ├── 布局组件 (Layout)       — Tab/Drawer/SplitPanel
  ├── 业务组件 (Business)     — 与特定业务实体绑定
  ├── 通用弹窗 (Shared Modal) — 跨模块复用
  ├── 基础组件 (Base)         — 纯展示、无业务逻辑
  └── Composable              — 可复用逻辑（非组件）
```

### 1.3 命名约定

```
页面组件:    index.vue (目录入口)
业务组件:    PascalCase.vue (DecorationTable.vue)
通用弹窗:    XxxModal.vue (EditModal.vue, ConfirmModal.vue)
Composable:  useXxx.ts (useDecorationForm.ts)
Store:       useXxxStore (useDecorationStore)
```

---

## 二、Modal 复用体系：180个 Bootstrap Modal → 5个参数化弹窗

### 2.1 问题分析

旧项目中 Modal 的本质分类：

| Modal 类型 | 旧项目数量 | 特征 |
|-----------|-----------|------|
| **表单编辑型** | ~90 | 包含表单字段，有保存/取消按钮 |
| **确认操作型** | ~40 | 简单的确认/取消，可能带一个输入框 |
| **详情查看型** | ~30 | 只读展示，无编辑操作 |
| **选择器型** | ~15 | 从列表中选择一项或多项 |
| **复杂业务型** | ~5 | 包含子表格、金额计算、多步操作 |

### 2.2 五大通用 Modal 组件

#### 2.2.1 FormModal — 表单编辑弹窗

```vue
<!-- src/components/business/FormModal.vue -->
<template>
  <a-modal
    v-model:visible="innerVisible"
    :title="title"
    :width="width"
    :mask-closable="false"
    :ok-loading="submitting"
    @before-ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
    >
      <slot :form-state="formState" :disabled="readonly" />
    </a-form>
  </a-modal>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, reactive, watch } from 'vue'
import type { FormInstance, FieldRule } from '@arco-design/web-vue'

export interface FormModalProps<T> {
  visible: boolean
  title: string
  width?: number | string
  initialValues?: Partial<T>
  rules?: Record<string, FieldRule[]>
  readonly?: boolean
  onSubmit?: (data: T) => Promise<boolean>
}

const props = withDefaults(defineProps<FormModalProps<T>>(), {
  width: 600,
  readonly: false,
  onSubmit: undefined,
})

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'saved', data: T): void
}>()

const innerVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
})

const formRef = ref<FormInstance>()
const submitting = ref(false)
const formState = reactive<T>({} as T)

watch(() => props.visible, (val) => {
  if (val && props.initialValues) {
    Object.assign(formState, props.initialValues)
  }
})

async function handleSubmit() {
  const valid = await formRef.value?.validate()
  if (valid) return false
  if (props.onSubmit) {
    submitting.value = true
    try {
      const ok = await props.onSubmit({ ...formState } as T)
      if (ok) {
        emit('saved', { ...formState } as T)
        return true
      }
      return false
    } finally {
      submitting.value = false
    }
  }
  return true
}

function handleCancel() {
  innerVisible.value = false
}

defineExpose({ formRef, formState })
</script>
```

**使用示例（装修单编辑）：**

```vue
<template>
  <FormModal
    v-model:visible="editVisible"
    title="编辑装修单"
    :initial-values="editData"
    :rules="editRules"
    :on-submit="doSave"
  >
    <template #default="{ formState }">
      <a-form-item label="装修类型" field="decorationType">
        <a-select v-model="formState.decorationType" :options="typeOptions" />
      </a-form-item>
      <a-form-item label="备注" field="remark">
        <a-textarea v-model="formState.remark" :max-length="200" />
      </a-form-item>
    </template>
  </FormModal>
</template>
```

#### 2.2.2 ConfirmModal — 确认操作弹窗

```vue
<!-- src/components/business/ConfirmModal.vue -->
<template>
  <a-modal
    v-model:visible="innerVisible"
    :title="title"
    :width="400"
    :ok-text="okText"
    :ok-button-props="{ status: okStatus }"
    :mask-closable="false"
    @before-ok="handleOk"
  >
    <div class="confirm-content">
      <a-icon v-if="icon" :name="icon" :style="{ color: iconColor, fontSize: '24px' }" />
      <span>{{ message }}</span>
    </div>
    <div v-if="needInput" style="margin-top: 12px;">
      <a-input v-model="inputValue" :placeholder="inputPlaceholder" />
    </div>
  </a-modal>
</template>

<script setup lang="ts">
export interface ConfirmModalProps {
  visible: boolean
  title: string
  message: string
  icon?: string
  iconColor?: string
  okText?: string
  okStatus?: 'normal' | 'success' | 'warning' | 'danger'
  needInput?: boolean
  inputPlaceholder?: string
  onConfirm?: (inputValue?: string) => Promise<boolean>
}

const props = withDefaults(defineProps<ConfirmModalProps>(), {
  icon: 'icon-exclamation-circle',
  iconColor: '#165DFF',
  okText: '确认',
  okStatus: 'normal',
  needInput: false,
  inputPlaceholder: '',
})

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'confirmed'): void
}>()

const innerVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
})

const inputValue = ref('')

async function handleOk() {
  if (props.needInput && !inputValue.value) {
    Message.warning(props.inputPlaceholder || '请输入内容')
    return false
  }
  if (props.onConfirm) {
    const ok = await props.onConfirm(inputValue.value || undefined)
    if (ok) {
      emit('confirmed')
      inputValue.value = ''
      return true
    }
    return false
  }
  inputValue.value = ''
  return true
}
</script>
```

**使用示例（作废装修单）：**

```vue
<ConfirmModal
  v-model:visible="obsoleteVisible"
  title="作废确认"
  message="确定要作废该装修单吗？此操作不可撤销。"
  ok-text="确认作废"
  ok-status="danger"
  icon="icon-close-circle"
  icon-color="#F53F3F"
  :on-confirm="doObsolete"
/>
```

#### 2.2.3 DetailModal — 详情查看弹窗

```vue
<!-- src/components/business/DetailModal.vue -->
<template>
  <a-modal
    v-model:visible="innerVisible"
    :title="title"
    :width="width"
    :footer="false"
  >
    <a-spin :loading="loading">
      <slot />
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
export interface DetailModalProps {
  visible: boolean
  title: string
  width?: number | string
  loading?: boolean
}

withDefaults(defineProps<DetailModalProps>(), { width: 700, loading: false })

const emit = defineEmits<{ (e: 'update:visible', val: boolean): void }>()
const innerVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
})
</script>
```

#### 2.2.4 SelectorModal — 选择器弹窗

```vue
<!-- src/components/business/SelectorModal.vue -->
<template>
  <a-modal
    v-model:visible="innerVisible"
    :title="title"
    :width="width"
    @ok="handleOk"
  >
    <a-input
      v-model="keyword"
      placeholder="搜索..."
      allow-clear
      style="margin-bottom: 12px;"
      @input="handleSearch"
    />
    <a-table
      :data="filteredData"
      :row-selection="{
        type: multiple ? 'checkbox' : 'radio',
        selectedRowKeys,
      }"
      :pagination="pagination"
      row-key="id"
      @row-click="handleRowClick"
    >
      <template #columns>
        <a-table-column
          v-for="col in columns"
          :key="col.dataIndex"
          :title="col.title"
          :data-index="col.dataIndex"
          :width="col.width"
        />
      </template>
    </a-table>
  </a-modal>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
export interface SelectorColumn {
  title: string
  dataIndex: string
  width?: number
}

export interface SelectorModalProps<T> {
  visible: boolean
  title: string
  width?: number
  columns: SelectorColumn[]
  data: T[]
  multiple?: boolean
  selectedRowKeys?: (string | number)[]
}

const props = withDefaults(defineProps<SelectorModalProps<T>>(), {
  width: 800,
  multiple: false,
  selectedRowKeys: () => [],
})

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'select', rows: T[]): void
}>()

const keyword = ref('')
const innerVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
})

const filteredData = computed(() => {
  if (!keyword.value) return props.data
  const kw = keyword.value.toLowerCase()
  return props.data.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(kw)
    )
  )
})

const pagination = reactive({ current: 1, pageSize: 10, total: 0 })

function handleOk() {
  const selected = props.data.filter(row =>
    (props.selectedRowKeys as any[]).includes(row.id)
  )
  emit('select', selected)
  innerVisible.value = false
}

function handleRowClick(row: T) {
  if (!props.multiple) {
    emit('select', [row])
    innerVisible.value = false
  }
}

function handleSearch() {
  pagination.current = 1
}
</script>
```

#### 2.2.5 StepModal — 多步骤操作弹窗

```vue
<!-- src/components/business/StepModal.vue -->
<template>
  <a-modal
    v-model:visible="innerVisible"
    :title="title"
    :width="width"
    :mask-closable="false"
    :ok-text="isLastStep ? '完成' : '下一步'"
    :cancel-text="isFirstStep ? '取消' : '上一步'"
    @before-ok="handleNext"
    @cancel="handlePrevOrCancel"
  >
    <a-steps :current="currentStep" style="margin-bottom: 24px;">
      <a-step v-for="(step, i) in steps" :key="i" :title="step.title" />
    </a-steps>
    <slot :name="`step-${currentStep}`" :step-data="stepData" />
  </a-modal>
</template>

<script setup lang="ts">
export interface StepItem {
  title: string
}

export interface StepModalProps {
  visible: boolean
  title: string
  width?: number | string
  steps: StepItem[]
  onNext?: (step: number, data: any) => Promise<boolean>
  onFinish?: (allData: any[]) => Promise<boolean>
}

const props = withDefaults(defineProps<StepModalProps>(), { width: 700 })

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'completed', data: any[]): void
}>()

const innerVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
})

const currentStep = ref(0)
const stepData = ref<any[]>([])

const isFirstStep = computed(() => currentStep.value === 0)
const isLastStep = computed(() => currentStep.value === props.steps.length - 1)

async function handleNext() {
  if (props.onNext) {
    const ok = await props.onNext(currentStep.value, stepData.value)
    if (!ok) return false
  }
  if (isLastStep.value) {
    if (props.onFinish) {
      const ok = await props.onFinish(stepData.value)
      if (!ok) return false
    }
    emit('completed', stepData.value)
    currentStep.value = 0
    stepData.value = []
    return true
  }
  currentStep.value++
  return false // 不关闭弹窗
}

function handlePrevOrCancel() {
  if (isFirstStep.value) {
    innerVisible.value = false
    currentStep.value = 0
    stepData.value = []
  } else {
    currentStep.value--
  }
}
</script>
```

### 2.3 Modal 复用映射表

| 旧 Modal ID 模式 | 新组件 | 配置差异 |
|-----------------|--------|---------|
| `#editModal`, `#updateXxxModal`, `#changeXxxModal` | **FormModal** | title + initialValues + rules + slot |
| `#deleteModal`, `#obsoleteModal`, `#terminalModal`, `#confirmXxxModal` | **ConfirmModal** | message + okStatus + icon |
| `#viewModal`, `#detailModal`, `#infoModal` | **DetailModal** | title + width + slot |
| `#selectXxxModal`, `#chooseXxxModal`, `#pickXxxModal` | **SelectorModal** | columns + data + multiple |
| `#xxxStepModal`, `#createWithStepModal` | **StepModal** | steps + slot |

---

## 三、页面一：decorationIndex.js 装修单列表 (2815行)

### 3.1 现状分析

- **12 个 Searcher** — 每个角色一个独立的列表实例
- **12 个 Modal** — 创建/编辑/查看/状态变更/节点管理等
- **57 个 API** — 涵盖装修单全部 CRUD + 分页 + 变更操作
- **drawNode** — 施工节点树渲染
- **popup4page** — 跳转详情/合同/活动等子页面

### 3.2 拆分方案

```
views/decoration/index.vue                    ← 页面入口 (~80行)
├── components/
│   ├── RoleTabBar.vue                        ← 角色切换 Tab (~60行)
│   ├── SearchForm.vue                        ← 统一搜索表单 (~120行)
│   ├── DecorationTable.vue                   ← 装修单表格 (含动态列) (~200行)
│   ├── CreateModal.vue                       ← 创建装修单 (基于 FormModal) (~150行)
│   ├── EditModal.vue                         ← 编辑装修单 (基于 FormModal) (~150行)
│   ├── ViewDrawer.vue                        ← 查看详情 Drawer (~100行)
│   ├── StatusChangeModal.vue                 ← 状态变更 (基于 ConfirmModal) (~80行)
│   ├── NodeSchedule.vue                      ← 施工节点树 (替代 drawNode) (~200行)
│   └── BatchOperateBar.vue                   ← 批量操作工具栏 (~80行)
├── composables/
│   ├── useDecorationList.ts                  ← 列表数据获取 + 分页逻辑 (~100行)
│   ├── useDecorationSearch.ts                ← 搜索条件管理 (~80行)
│   ├── useDecorationAction.ts                ← 创建/编辑/状态变更/作废等操作 (~120行)
│   └── useDecorationPermission.ts            ← 按角色控制按钮和列显隐 (~60行)
└── config/
    └── roleConfig.ts                         ← 12个角色的列/按钮/搜索条件配置 (~150行)
```

### 3.3 核心组件 Props/Emits 定义

#### RoleTabBar.vue

```typescript
// Props
interface RoleTabBarProps {
  roles: RoleItem[]       // 角色列表
  activeRole: string      // 当前角色 key
}

interface RoleItem {
  key: string             // 'designer' | 'salesman' | 'quoter' | ...
  label: string           // '设计师' | '销售员' | '报价员' | ...
  icon?: string           // Arco icon name
}

// Events
interface RoleTabBarEmits {
  (e: 'change', role: string): void
}
```

#### DecorationTable.vue

```typescript
// Props
interface DecorationTableProps {
  data: DecorationVO[]
  loading: boolean
  columns: TableColumnConfig[]  // 根据角色动态生成的列配置
  selectedKeys: number[]
  rowSelection?: boolean
}

interface TableColumnConfig {
  dataIndex: string
  title: string
  width?: number
  sortable?: boolean
  fixed?: 'left' | 'right'
  slotName?: string
  visible?: boolean
}

// Events
interface DecorationTableEmits {
  (e: 'row-click', row: DecorationVO): void
  (e: 'selection-change', keys: number[]): void
  (e: 'page-change', page: number): void
  (e: 'page-size-change', size: number): void
}
```

#### NodeSchedule.vue — 施工节点树

```typescript
// Props
interface NodeScheduleProps {
  orderId: string
  decorationId: number
  readonly?: boolean
}

// Events
interface NodeScheduleEmits {
  (e: 'node-click', node: ConstructionNode): void
  (e: 'node-update', node: ConstructionNode): void
}
```

**实现思路：**

```vue
<template>
  <div class="node-schedule">
    <a-spin :loading="loading">
      <a-tree
        :data="treeData"
        :show-line="true"
        :default-expand-all="true"
        @select="handleNodeClick"
      >
        <template #icon="node">
          <a-tag :color="getNodeStatusColor(node.status)" size="small">
            {{ node.label }}
          </a-tag>
        </template>
        <template #extra="node">
          <a-space v-if="!readonly">
            <a-button type="text" size="mini" @click="handleUpdate(node)">
              <icon-edit />
            </a-button>
          </a-space>
        </template>
      </a-tree>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { queryConstructionNodeByOrderId } from '@/api/decoration'

const props = defineProps<NodeScheduleProps>()
const emit = defineEmits<NodeScheduleEmits>()

const treeData = ref<TreeNode[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await queryConstructionNodeByOrderId(props.orderId)
    treeData.value = buildTree(data)
  } finally {
    loading.value = false
  }
})

function buildTree(nodes: any[]): TreeNode[] {
  // 将扁平的施工节点数据转为树结构
  // 替代旧项目 drawNode.draw() 的 DOM 操作
  const map = new Map()
  const roots: TreeNode[] = []
  nodes.forEach(n => map.set(n.id, { ...n, children: [] }))
  nodes.forEach(n => {
    if (n.parentId && map.has(n.parentId)) {
      map.get(n.parentId).children.push(map.get(n.id))
    } else {
      roots.push(map.get(n.id))
    }
  })
  return roots
}
</script>
```

### 3.4 角色配置系统

```typescript
// config/roleConfig.ts
import type { TableColumnConfig, SearchFieldConfig } from '@/types/decoration'

export interface RoleViewConfig {
  key: string
  label: string
  pageApi: string          // 对应的 pageXxx.do 端点
  columns: TableColumnConfig[]
  searchFields: SearchFieldConfig[]
  actions: string[]        // 允许的操作: ['create', 'edit', 'view', 'obsolete', ...]
}

export const roleConfigs: Record<string, RoleViewConfig> = {
  designer: {
    key: 'designer',
    label: '设计师',
    pageApi: 'pageDecorationForDesigner',
    columns: [
      { dataIndex: 'orderId', title: '装修单号', width: 150, sortable: true, fixed: 'left' },
      { dataIndex: 'customerName', title: '客户', width: 100 },
      { dataIndex: 'village', title: '楼盘', width: 200 },
      { dataIndex: 'designerName', title: '设计师', width: 100 },
      { dataIndex: 'status', title: '状态', width: 80, slotName: 'status' },
      { dataIndex: 'createTime', title: '创建时间', width: 160, sortable: true },
    ],
    searchFields: [
      { field: 'orderId', label: '装修单号', type: 'text' },
      { field: 'customerName', label: '客户', type: 'autofill', apiUrl: '...' },
      { field: 'status', label: '状态', type: 'select', options: 'decorationStatus' },
      { field: 'createTime', label: '创建时间', type: 'dateRange' },
    ],
    actions: ['create', 'edit', 'view', 'obsolete'],
  },
  salesman: {
    key: 'salesman',
    label: '销售员',
    pageApi: 'pageDecorationForSalesman',
    columns: [
      { dataIndex: 'orderId', title: '装修单号', width: 150, sortable: true, fixed: 'left' },
      { dataIndex: 'customerName', title: '客户', width: 100 },
      { dataIndex: 'salesmanName', title: '销售员', width: 100 },
      { dataIndex: 'status', title: '状态', width: 80, slotName: 'status' },
    ],
    searchFields: [
      { field: 'orderId', label: '装修单号', type: 'text' },
      { field: 'status', label: '状态', type: 'select', options: 'decorationStatus' },
    ],
    actions: ['create', 'edit', 'view'],
  },
  // ... 其余 10 个角色配置类似
}
```

### 3.5 页面入口 index.vue

```vue
<template>
  <div class="decoration-list">
    <a-card :bordered="false">
      <!-- 角色切换 -->
      <RoleTabBar
        :roles="roleList"
        :active-role="activeRole"
        @change="handleRoleChange"
      />

      <!-- 搜索区 -->
      <SearchForm
        :fields="currentRoleConfig.searchFields"
        @search="handleSearch"
        @reset="handleReset"
      />

      <!-- 批量操作 -->
      <BatchOperateBar
        v-if="hasSelection"
        :actions="currentRoleConfig.actions"
        :selected-count="selectedKeys.length"
        @batch-action="handleBatchAction"
      />

      <!-- 数据表格 -->
      <DecorationTable
        :data="tableData"
        :loading="loading"
        :columns="currentRoleConfig.columns"
        :selected-keys="selectedKeys"
        :row-selection="true"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </a-card>

    <!-- 弹窗们 -->
    <CreateModal v-model:visible="createVisible" @saved="reloadData" />
    <EditModal v-model:visible="editVisible" :data="editRow" @saved="reloadData" />
    <ViewDrawer v-model:visible="viewVisible" :order-id="viewOrderId" />
    <StatusChangeModal
      v-model:visible="statusChangeVisible"
      :data="statusChangeRow"
      @confirmed="reloadData"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { roleConfigs } from './config/roleConfig'
import { useDecorationList } from './composables/useDecorationList'
import { useDecorationSearch } from './composables/useDecorationSearch'
import { useDecorationAction } from './composables/useDecorationAction'
import { useDecorationPermission } from './composables/useDecorationPermission'

const roleList = Object.values(roleConfigs).map(r => ({ key: r.key, label: r.label }))
const activeRole = ref('designer')
const currentRoleConfig = computed(() => roleConfigs[activeRole.value])

// 列表逻辑
const { tableData, loading, pagination, fetchData, reloadData } = useDecorationList()

// 搜索逻辑
const { searchParams, handleSearch, handleReset } = useDecorationSearch(currentRoleConfig)

// 权限控制
const { hasPermission } = useDecorationPermission()

// 操作弹窗状态
const createVisible = ref(false)
const editVisible = ref(false)
const editRow = ref<any>(null)
const viewVisible = ref(false)
const viewOrderId = ref('')
const statusChangeVisible = ref(false)
const statusChangeRow = ref<any>(null)
const selectedKeys = ref<number[]>([])
const hasSelection = computed(() => selectedKeys.value.length > 0)

// 操作逻辑
const { handleBatchAction } = useDecorationAction(selectedKeys, reloadData)

function handleRoleChange(role: string) {
  activeRole.value = role
  searchParams.value = {}
  pagination.value.current = 1
  fetchData()
}

function handleRowClick(row: any) {
  viewOrderId.value = row.orderId
  viewVisible.value = true
}

function handleSelectionChange(keys: number[]) {
  selectedKeys.value = keys
}

function handlePageChange(page: number) {
  pagination.value.current = page
  fetchData()
}

function handlePageSizeChange(size: number) {
  pagination.value.pageSize = size
  pagination.value.current = 1
  fetchData()
}

onMounted(() => fetchData())
</script>
```

### 3.6 12个Searcher → 1个表格 + 角色配置

旧项目中有12个独立的 Searcher 实例，每个对应一个角色视图。新项目用 **1个 DecorationTable + roleConfig** 替代：

| 旧 Searcher | roleConfig key | pageApi |
|------------|---------------|---------|
| `pageDecorationForDesigner` | designer | `pageDecorationForDesigner.do` |
| `pageDecorationForSalesman` | salesman | `pageDecorationForSalesman.do` |
| `pageDecorationForQuoter` | quoter | `pageDecorationForQuoter.do` |
| `pageDecorationForMaterialer` | materialer | `pageDecorationForMaterialer.do` |
| `pageDecorationForBalance` | balance | `pageDecorationForBalance.do` |
| `pageDecorationForBelong` | belong | `pageDecorationForBelong.do` |
| `pageDecorationForCommon` | common | `pageDecorationForCommon.do` |
| `pageDecorationForCompany` | company | `pageDecorationForCompany.do` |
| `pageDecorationForCustomer` | customer | `pageDecorationForCustomer.do` |
| `pageDecorationForDesignerDept` | designerDept | `pageDecorationForDesignerDept.do` |
| `pageDecorationForSalesmanDept` | salesmanDept | `pageDecorationForSalesmanDept.do` |
| `pageDecorationForGeneral` | general | `pageDecorationForGeneral.do` |

---

## 四、页面二：payment.js 预付款列表 (65个Modal)

### 4.1 现状分析

- **65 个 Modal** — 涵盖5种支付方式弹窗 + 编辑/查看/退款/审批等
- **paymentUtils.js** (1197行) — 全局支付工具函数
- **getConfig 系统** — 8个页面共享的动态权限配置
- **8种支付方式** — 现金/银行/刷卡/预付/优惠券/POS/扫码/钱包

### 4.2 拆分方案

```
views/payment/advance/index.vue               ← 预付款列表页 (~100行)
├── components/
│   ├── PaymentFilter.vue                     ← 搜索过滤 (含动态字段) (~120行)
│   ├── PaymentTable.vue                      ← 款项表格 (~180行)
│   ├── CollectDrawer.vue                     ← 收款抽屉 (整合5种支付方式) (~200行)
│   ├── RefundModal.vue                       ← 退款弹窗 (基于 StepModal) (~150行)
│   ├── ApprovalModal.vue                     ← 审批弹窗 (~100行)
│   └── HistoryDrawer.vue                     ← 收款历史记录 (~80行)
├── payment-methods/                          ← 支付方式子组件 (模块内共享)
│   ├── CashPayForm.vue                       ← 现金支付表单 (~80行)
│   ├── BankPayForm.vue                       ← 银行转账表单 (~100行)
│   ├── CheckvPayForm.vue                     ← 刷卡支付表单 (~80行)
│   ├── AdvancePayForm.vue                    ← 预付款抵扣表单 (~80行)
│   ├── CouponPayForm.vue                     ← 优惠券表单 (~100行)
│   ├── PosPayForm.vue                        ← POS机支付 (~80行)
│   └── QrCodePayForm.vue                     ← 扫码支付 (~60行)
├── composables/
│   ├── usePaymentList.ts                     ← 列表数据 + 分页 (~100行)
│   ├── usePaymentMethod.ts                   ← 统一支付方式管理 (~150行)
│   ├── usePaymentPageConfig.ts               ← 页面配置(getConfig替代) (~80行)
│   └── usePaymentAction.ts                   ← 收款/退款/确认等操作 (~120行)
```

### 4.3 CollectDrawer — 核心收款组件

```vue
<template>
  <a-drawer
    v-model:visible="innerVisible"
    title="收款"
    :width="520"
    :footer="true"
    @ok="handleSubmit"
    @cancel="innerVisible = false"
  >
    <a-spin :loading="submitting">
      <a-descriptions :column="2" bordered style="margin-bottom: 16px;">
        <a-descriptions-item label="订单号">{{ orderInfo.orderId }}</a-descriptions-item>
        <a-descriptions-item label="客户">{{ orderInfo.customerName }}</a-descriptions-item>
        <a-descriptions-item label="应收金额">
          <span style="color: #F53F3F; font-weight: bold;">¥{{ orderInfo.receivableAmount }}</span>
        </a-descriptions-item>
        <a-descriptions-item label="已收金额">¥{{ orderInfo.receivedAmount }}</a-descriptions-item>
      </a-descriptions>

      <!-- 支付方式选择 -->
      <a-form :model="formState" layout="vertical">
        <a-form-item label="本次支付方式" field="paymentType">
          <a-radio-group v-model="formState.paymentType" @change="handleMethodChange">
            <a-radio v-for="m in availableMethods" :key="m.value" :value="m.value">
              {{ m.label }}
            </a-radio>
          </a-radio-group>
        </a-form-item>

        <!-- 根据选择的支付方式渲染对应的表单 -->
        <component
          :is="methodComponent"
          v-model="formState.methodData"
          :max-amount="maxAmount"
        />

        <a-form-item label="本次收款金额" field="amount">
          <a-input-number
            v-model="formState.amount"
            :max="maxAmount"
            :precision="2"
            :style="{ width: '100%' }"
            placeholder="请输入收款金额"
          />
        </a-form-item>

        <a-form-item label="备注" field="remark">
          <a-textarea v-model="formState.remark" :max-length="200" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-drawer>
</template>

<script setup lang="ts">
import { computed, ref, reactive, markRaw, watch } from 'vue'
import CashPayForm from './payment-methods/CashPayForm.vue'
import BankPayForm from './payment-methods/BankPayForm.vue'
import CheckvPayForm from './payment-methods/CheckvPayForm.vue'
import AdvancePayForm from './payment-methods/AdvancePayForm.vue'
import CouponPayForm from './payment-methods/CouponPayForm.vue'
import PosPayForm from './payment-methods/PosPayForm.vue'
import QrCodePayForm from './payment-methods/QrCodePayForm.vue'

const METHOD_COMPONENTS: Record<number, any> = {
  0: markRaw(CashPayForm),      // 现金
  1: markRaw(BankPayForm),      // 银行
  2: markRaw(CheckvPayForm),    // 刷卡
  3: markRaw(AdvancePayForm),   // 预付
  4: markRaw(CouponPayForm),    // 优惠券
  5: markRaw(PosPayForm),       // POS
  6: markRaw(QrCodePayForm),    // 扫码
}

const props = defineProps<{
  visible: boolean
  orderInfo: { orderId: string; customerName: string; receivableAmount: number; receivedAmount: number }
  availableMethods: { value: number; label: string }[]
  onCollect: (data: any) => Promise<boolean>
}>()

const emit = defineEmits<{ (e: 'update:visible', val: boolean): void; (e: 'collected'): void }>()

const innerVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
})

const submitting = ref(false)
const maxAmount = computed(() => props.orderInfo.receivableAmount - props.orderInfo.receivedAmount)

const formState = reactive({
  paymentType: 0,
  amount: undefined as number | undefined,
  remark: '',
  methodData: {} as Record<string, any>,
})

const methodComponent = computed(() => METHOD_COMPONENTS[formState.paymentType] || CashPayForm)

function handleMethodChange() {
  formState.methodData = {}
}

async function handleSubmit() {
  if (!formState.amount || formState.amount <= 0) {
    Message.warning('请输入有效的收款金额')
    return false
  }
  submitting.value = true
  try {
    const ok = await props.onCollect({ ...formState })
    if (ok) {
      emit('collected')
      return true
    }
    return false
  } finally {
    submitting.value = false
  }
}
</script>
```

### 4.3b 支付方式表单组件 (7 个)

所有支付方式表单遵循统一接口: `v-model` 绑定方式数据, `maxAmount` 约束最大金额。

#### CashPayForm.vue — 现金支付 (~80行)

```vue
<template>
  <a-form-item label="收款人" field="cashier" :rules="[{ required: true, message: '请选择收款人' }]">
    <a-select v-model="formData.cashier" placeholder="请选择收款人" allow-search>
      <a-option v-for="u in cashierList" :key="u.id" :value="u.id">{{ u.name }}</a-option>
    </a-select>
  </a-form-item>
  <a-form-item label="备注" field="remark">
    <a-textarea v-model="formData.remark" :max-length="200" placeholder="可选" />
  </a-form-item>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

export interface CashPayData {
  cashier: number | undefined
  remark: string
}

const props = defineProps<{
  modelValue: CashPayData
  maxAmount: number
}>()

const emit = defineEmits<{ (e: 'update:modelValue', val: CashPayData): void }>()

const formData = reactive<CashPayData>({
  cashier: props.modelValue?.cashier ?? undefined,
  remark: props.modelValue?.remark ?? '',
})

// 模拟收款人列表 (实际从 userStore 获取)
const cashierList = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' },
]

watch(formData, (val) => emit('update:modelValue', { ...val }), { deep: true })
</script>
```

#### BankPayForm.vue — 银行转账 (~100行)

```vue
<template>
  <a-form-item label="收款银行" field="bankName" :rules="[{ required: true, message: '请输入银行名称' }]">
    <a-select v-model="formData.bankName" placeholder="请选择银行" allow-search allow-create>
      <a-option v-for="b in bankList" :key="b" :value="b">{{ b }}</a-option>
    </a-select>
  </a-form-item>
  <a-form-item label="银行账号" field="bankAccount" :rules="[{ required: true, message: '请输入银行账号' }]">
    <a-input v-model="formData.bankAccount" placeholder="请输入银行账号" />
  </a-form-item>
  <a-form-item label="转账流水号" field="transactionNo" :rules="[{ required: true, message: '请输入流水号' }]">
    <a-input v-model="formData.transactionNo" placeholder="请输入转账流水号" />
  </a-form-item>
  <a-form-item label="转账日期" field="transferDate">
    <a-date-picker v-model="formData.transferDate" style="width: 100%" />
  </a-form-item>
  <a-form-item label="凭证附件" field="attachment">
    <a-upload :limit="3" accept="image/*,.pdf" :auto-upload="false">
      <template #upload-button><a-button>上传凭证</a-button></template>
    </a-upload>
  </a-form-item>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

export interface BankPayData {
  bankName: string
  bankAccount: string
  transactionNo: string
  transferDate: string
  attachment?: File[]
}

const props = defineProps<{ modelValue: BankPayData; maxAmount: number }>()
const emit = defineEmits<{ (e: 'update:modelValue', val: BankPayData): void }>()

const formData = reactive<BankPayData>({
  bankName: props.modelValue?.bankName ?? '',
  bankAccount: props.modelValue?.bankAccount ?? '',
  transactionNo: props.modelValue?.transactionNo ?? '',
  transferDate: props.modelValue?.transferDate ?? '',
})

const bankList = ['工商银行', '建设银行', '农业银行', '中国银行', '招商银行', '交通银行']

watch(formData, (val) => emit('update:modelValue', { ...val }), { deep: true })
</script>
```

#### CheckvPayForm.vue — 刷卡支付 (~80行)

```vue
<template>
  <a-form-item label="刷卡方式" field="cardType" :rules="[{ required: true, message: '请选择刷卡方式' }]">
    <a-radio-group v-model="formData.cardType">
      <a-radio value="debit">借记卡</a-radio>
      <a-radio value="credit">信用卡</a-radio>
    </a-radio-group>
  </a-form-item>
  <a-form-item label="POS终端号" field="posTerminal" :rules="[{ required: true, message: '请输入终端号' }]">
    <a-input v-model="formData.posTerminal" placeholder="请输入POS终端号" />
  </a-form-item>
  <a-form-item label="交易参考号" field="referenceNo" :rules="[{ required: true, message: '请输入参考号' }]">
    <a-input v-model="formData.referenceNo" placeholder="请输入交易参考号" />
  </a-form-item>
  <a-form-item label="持卡人姓名" field="cardHolder">
    <a-input v-model="formData.cardHolder" placeholder="可选" />
  </a-form-item>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

export interface CheckvPayData {
  cardType: 'debit' | 'credit' | ''
  posTerminal: string
  referenceNo: string
  cardHolder: string
}

const props = defineProps<{ modelValue: CheckvPayData; maxAmount: number }>()
const emit = defineEmits<{ (e: 'update:modelValue', val: CheckvPayData): void }>()

const formData = reactive<CheckvPayData>({
  cardType: props.modelValue?.cardType ?? '',
  posTerminal: props.modelValue?.posTerminal ?? '',
  referenceNo: props.modelValue?.referenceNo ?? '',
  cardHolder: props.modelValue?.cardHolder ?? '',
})

watch(formData, (val) => emit('update:modelValue', { ...val }), { deep: true })
</script>
```

#### AdvancePayForm.vue — 预付款抵扣 (~80行)

```vue
<template>
  <a-alert type="info" style="margin-bottom: 12px;">
    可用预付款余额: <span style="color: #F53F3F; font-weight: bold;">¥{{ advanceBalance }}</span>
  </a-alert>
  <a-form-item label="使用金额" field="useAmount" :rules="[
    { required: true, message: '请输入使用金额' },
    { type: 'number', max: advanceBalance, message: '超出可用余额' },
  ]">
    <a-input-number
      v-model="formData.useAmount"
      :max="Math.min(advanceBalance, props.maxAmount)"
      :precision="2"
      :style="{ width: '100%' }"
      placeholder="请输入使用金额"
    />
  </a-form-item>
  <a-form-item label="预付款流水" field="advanceIds">
    <a-select
      v-model="formData.advanceIds"
      multiple
      placeholder="选择要抵扣的预付款记录"
    >
      <a-option v-for="a in advanceRecords" :key="a.id" :value="a.id">
        {{ a.title }} (¥{{ a.balance }})
      </a-option>
    </a-select>
  </a-form-item>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue'

export interface AdvancePayData {
  useAmount: number | undefined
  advanceIds: number[]
}

const props = defineProps<{ modelValue: AdvancePayData; maxAmount: number }>()
const emit = defineEmits<{ (e: 'update:modelValue', val: AdvancePayData): void }>()

// 模拟数据 (实际从 API 获取)
const advanceRecords = computed(() => [
  { id: 101, title: '2026-03 预付款', balance: 5000 },
  { id: 102, title: '2026-04 预付款', balance: 3000 },
])
const advanceBalance = computed(() => advanceRecords.value.reduce((s, a) => s + a.balance, 0))

const formData = reactive<AdvancePayData>({
  useAmount: props.modelValue?.useAmount ?? undefined,
  advanceIds: props.modelValue?.advanceIds ?? [],
})

watch(formData, (val) => emit('update:modelValue', { ...val }), { deep: true })
</script>
```

#### CouponPayForm.vue — 优惠券 (~100行)

```vue
<template>
  <a-form-item label="优惠券" field="couponId" :rules="[{ required: true, message: '请选择优惠券' }]">
    <a-select v-model="formData.couponId" placeholder="请选择优惠券" allow-search @change="handleCouponChange">
      <a-option v-for="c in couponList" :key="c.id" :value="c.id">
        {{ c.name }} — 面值 ¥{{ c.faceValue }} ({{ c.status === 1 ? '可用' : '已用' }})
      </a-option>
    </a-select>
  </a-form-item>
  <a-descriptions v-if="selectedCoupon" :column="1" bordered size="small" style="margin-bottom: 12px;">
    <a-descriptions-item label="券名称">{{ selectedCoupon.name }}</a-descriptions-item>
    <a-descriptions-item label="面值">¥{{ selectedCoupon.faceValue }}</a-descriptions-item>
    <a-descriptions-item label="有效期">{{ selectedCoupon.validFrom }} ~ {{ selectedCoupon.validTo }}</a-descriptions-item>
    <a-descriptions-item label="使用条件">满 ¥{{ selectedCoupon.minAmount }} 可用</a-descriptions-item>
  </a-descriptions>
  <a-form-item label="券面值抵扣" field="deductAmount">
    <a-input-number v-model="formData.deductAmount" :max="selectedCoupon?.faceValue ?? 0" :precision="2" disabled />
  </a-form-item>
</template>

<script setup lang="ts">
import { reactive, watch, computed, ref } from 'vue'

export interface CouponPayData {
  couponId: number | undefined
  deductAmount: number | undefined
}

interface CouponItem {
  id: number; name: string; faceValue: number; minAmount: number; status: number; validFrom: string; validTo: string
}

const props = defineProps<{ modelValue: CouponPayData; maxAmount: number }>()
const emit = defineEmits<{ (e: 'update:modelValue', val: CouponPayData): void }>()

// 模拟数据 (实际从 API 获取)
const couponList = ref<CouponItem[]>([
  { id: 1, name: '新客立减券', faceValue: 500, minAmount: 5000, status: 1, validFrom: '2026-01-01', validTo: '2026-12-31' },
  { id: 2, name: '活动满减券', faceValue: 1000, minAmount: 10000, status: 1, validFrom: '2026-03-01', validTo: '2026-06-30' },
])

const selectedCoupon = computed(() => couponList.value.find(c => c.id === formData.couponId))

const formData = reactive<CouponPayData>({
  couponId: props.modelValue?.couponId ?? undefined,
  deductAmount: props.modelValue?.deductAmount ?? undefined,
})

function handleCouponChange(id: number) {
  const coupon = couponList.value.find(c => c.id === id)
  formData.deductAmount = coupon?.faceValue ?? 0
}

watch(formData, (val) => emit('update:modelValue', { ...val }), { deep: true })
</script>
```

#### PosPayForm.vue — POS机支付 (~80行)

```vue
<template>
  <a-form-item label="POS机终端" field="posId" :rules="[{ required: true, message: '请选择POS机' }]">
    <a-select v-model="formData.posId" placeholder="请选择POS终端">
      <a-option v-for="p in posList" :key="p.id" :value="p.id">{{ p.name }} ({{ p.sn }})</a-option>
    </a-select>
  </a-form-item>
  <a-form-item label="交易金额" field="transAmount" :rules="[
    { required: true, message: '请输入交易金额' },
    { type: 'number', max: props.maxAmount, message: '超出应收金额' },
  ]">
    <a-input-number v-model="formData.transAmount" :max="props.maxAmount" :precision="2" :style="{ width: '100%' }" />
  </a-form-item>
  <a-form-item label="交易状态" field="transStatus">
    <a-tag v-if="formData.transStatus === 'success'" color="green">交易成功</a-tag>
    <a-tag v-else-if="formData.transStatus === 'pending'" color="orange">等待确认</a-tag>
    <a-tag v-else color="gray">未发起</a-tag>
    <a-button size="small" @click="queryPosStatus" :loading="querying">查询状态</a-button>
  </a-form-item>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue'

export interface PosPayData {
  posId: number | undefined
  transAmount: number | undefined
  transStatus: 'none' | 'pending' | 'success'
  transNo: string
}

const props = defineProps<{ modelValue: PosPayData; maxAmount: number }>()
const emit = defineEmits<{ (e: 'update:modelValue', val: PosPayData): void }>()

const querying = ref(false)
const posList = [
  { id: 1, name: '前台POS-1', sn: 'SN001' },
  { id: 2, name: '前台POS-2', sn: 'SN002' },
]

const formData = reactive<PosPayData>({
  posId: props.modelValue?.posId ?? undefined,
  transAmount: props.modelValue?.transAmount ?? undefined,
  transStatus: props.modelValue?.transStatus ?? 'none',
  transNo: props.modelValue?.transNo ?? '',
})

async function queryPosStatus() {
  querying.value = true
  // 模拟查询 POS 交易状态
  await new Promise(r => setTimeout(r, 1000))
  formData.transStatus = 'success'
  formData.transNo = 'POS' + Date.now()
  querying.value = false
}

watch(formData, (val) => emit('update:modelValue', { ...val }), { deep: true })
</script>
```

#### QrCodePayForm.vue — 扫码支付 (~60行)

```vue
<template>
  <div style="text-align: center;">
    <a-form-item label="支付平台" field="platform" :rules="[{ required: true, message: '请选择支付平台' }]">
      <a-radio-group v-model="formData.platform">
        <a-radio value="alipay">支付宝</a-radio>
        <a-radio value="wechat">微信支付</a-radio>
      </a-radio-group>
    </a-form-item>
    <div v-if="qrCodeUrl" style="margin: 16px 0;">
      <a-qrcode :value="qrCodeUrl" :size="180" />
      <p style="margin-top: 8px; color: #86909c;">请使用{{ formData.platform === 'alipay' ? '支付宝' : '微信' }}扫码支付</p>
    </div>
    <a-button v-else type="primary" @click="generateQrCode" :loading="generating">生成二维码</a-button>
    <a-form-item label="交易流水号" field="transNo" style="margin-top: 12px;">
      <a-input v-model="formData.transNo" placeholder="扫码后自动回填" />
    </a-form-item>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue'

export interface QrCodePayData {
  platform: 'alipay' | 'wechat' | ''
  transNo: string
}

const props = defineProps<{ modelValue: QrCodePayData; maxAmount: number }>()
const emit = defineEmits<{ (e: 'update:modelValue', val: QrCodePayData): void }>()

const generating = ref(false)
const qrCodeUrl = ref('')

const formData = reactive<QrCodePayData>({
  platform: props.modelValue?.platform ?? '',
  transNo: props.modelValue?.transNo ?? '',
})

async function generateQrCode() {
  generating.value = true
  // 模拟生成二维码 (实际调用后端接口)
  await new Promise(r => setTimeout(r, 800))
  qrCodeUrl.value = `https://pay.example.com/qr/${Date.now()}`
  generating.value = false
}

watch(formData, (val) => emit('update:modelValue', { ...val }), { deep: true })
</script>
```

### 4.4 65个Modal → 组件分类映射

| Modal 分类 | 数量 | 新组件 | 说明 |
|-----------|------|--------|------|
| 现金收款弹窗 | 8 | CollectDrawer + CashPayForm | 按 type 参数复用 |
| 银行收款弹窗 | 8 | CollectDrawer + BankPayForm | 按 type 参数复用 |
| 刷卡收款弹窗 | 8 | CollectDrawer + CheckvPayForm | 按 type 参数复用 |
| 预付抵扣弹窗 | 8 | CollectDrawer + AdvancePayForm | 按 type 参数复用 |
| 优惠券弹窗 | 8 | CollectDrawer + CouponPayForm | 按 type 参数复用 |
| 退款弹窗 | 6 | RefundModal (StepModal) | 退款多步骤 |
| 审批弹窗 | 4 | ApprovalModal | 退款/提现审批 |
| 编辑弹窗 | 5 | FormModal | 各类信息编辑 |
| 查看弹窗 | 4 | DetailModal | 收款详情 |
| 确认弹窗 | 6 | ConfirmModal | 确认/作废操作 |

---

## 五、页面三：quotationPart.js 报价单详情 (5195行, 180个Modal)

### 5.1 现状分析

- **180 个 Modal** — 全项目最高，全模块最高
- **30 个 API** — 报价单 CRUD + 功能区管理 + 报价项管理 + 金额计算
- **功能区+报价项嵌套结构** — 递归数据
- **quotationUtils.js** (1925行) — 核心计算引擎
- **报价计算引擎** — 折扣/成本/管理费/税率/优惠金额

### 5.2 拆分方案（最重要的一页）

```
views/quotation/part/index.vue                ← 报价单详情入口 (~120行)
├── components/
│   ├── QuotationHeader.vue                   ← 报价单头部信息栏 (~100行)
│   ├── FunctionAreaPanel.vue                 ← 功能区面板(容器) (~80行)
│   ├── FunctionAreaCard.vue                  ← 单个功能区卡片 (~150行)
│   ├── QuotationItemRow.vue                  ← 报价项行 (可编辑表格行) (~120行)
│   ├── QuotationItemSelector.vue             ← 报价项选择器 (基于 SelectorModal) (~150行)
│   ├── DiscountEditor.vue                    ← 折扣编辑 (基于 FormModal) (~120行)
│   ├── PreferModal.vue                       ← 优惠弹窗 (基于 FormModal) (~100行)
│   ├── VersionSwitchModal.vue                ← 版本切换 (基于 SelectorModal) (~80行)
│   ├── LockAction.vue                        ← 锁定/解锁操作栏 (~60行)
│   ├── AmountSummary.vue                     ← 金额汇总栏 (~120行)
│   └── QuotationToolbar.vue                  ← 工具栏(保存/提交/锁定/打印) (~80行)
├── composables/
│   ├── useQuotationDetail.ts                 ← 报价单数据加载 + 保存 (~150行)
│   ├── useQuotationCalculator.ts             ← 报价计算引擎 (核心!) (~300行)
│   ├── useFunctionArea.ts                    ← 功能区 CRUD 逻辑 (~120行)
│   ├── useQuotationItem.ts                   ← 报价项 CRUD 逻辑 (~100行)
│   ├── useQuotationAction.ts                 ← 提交/锁定/解锁/复制操作 (~100行)
│   └── useQuotationPermission.ts             ← 报价单权限控制 (~60行)
└── types/
    └── quotation-detail.ts                   ← 报价详情专用类型 (~80行)
```

### 5.3 核心数据流

```
                    ┌──────────────────┐
                    │   quotationStore  │  (Pinia, 共享报价单数据)
                    └────────┬─────────┘
                             │ provide/inject
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     QuotationHeader   AmountSummary   FunctionAreaPanel
              │              │              │
              │              │         ┌────┼────┐
              │              │         ▼    ▼    ▼
              │              │   FunctionAreaCard (×N)
              │              │         │
              │              │         ▼
              │              │   QuotationItemRow (×N)
              │              │
              └──────────────┴──→ useQuotationCalculator
                                      (计算引擎, 被多组件依赖)
```

### 5.4 useQuotationCalculator — 计算引擎

```typescript
// composables/useQuotationCalculator.ts
import { computed, reactive } from 'vue'
import Decimal from 'decimal.js'

export function useQuotationCalculator(areas: Ref<FunctionAreaVO[]>) {
  // 每个功能区的金额汇总
  const areaAmounts = computed(() => {
    return areas.value.map(area => {
      const items = area.items || []
      const total = items.reduce((sum, item) => {
        return sum.plus(new Decimal(item.quantity || 0).times(item.unitPrice || 0))
      }, new Decimal(0))
      return {
        areaId: area.id,
        areaName: area.name,
        total: total.toNumber(),
      }
    })
  })

  // 报价单总金额
  const grandTotal = computed(() => {
    return areaAmounts.value.reduce(
      (sum, a) => sum.plus(new Decimal(a.total)),
      new Decimal(0)
    ).toNumber()
  })

  // 折扣后金额
  const discountAmount = computed(() => {
    // 从优惠数据计算
    return grandTotal.value // 简化示例
  })

  // 税额
  const taxAmount = computed(() => {
    return new Decimal(discountAmount.value).times(taxRate.value).toNumber()
  })

  // 最终金额
  const finalAmount = computed(() => {
    return new Decimal(discountAmount.value).plus(taxAmount.value).toNumber()
  })

  // 成本汇总
  const costTotal = computed(() => {
    return areas.value.reduce((sum, area) => {
      const items = area.items || []
      return sum.plus(items.reduce((s, item) => {
        return s.plus(new Decimal(item.quantity || 0).times(item.costPrice || 0))
      }, new Decimal(0)))
    }, new Decimal(0)).toNumber()
  })

  // 利润
  const profit = computed(() => {
    return new Decimal(finalAmount.value).minus(costTotal.value).toNumber()
  })

  return {
    areaAmounts,
    grandTotal,
    discountAmount,
    taxAmount,
    finalAmount,
    costTotal,
    profit,
  }
}
```

### 5.5 FunctionAreaPanel + FunctionAreaCard — 递归嵌套

```vue
<!-- FunctionAreaPanel.vue -->
<template>
  <div class="function-area-panel">
    <div v-if="loading" class="loading-wrapper">
      <a-spin tip="加载功能区..." />
    </div>
    <template v-else>
      <a-empty v-if="areas.length === 0" description="暂无功能区，点击添加" />
      <FunctionAreaCard
        v-for="area in areas"
        :key="area.id"
        :area="area"
        :readonly="readonly"
        :expanded="expandedIds.has(area.id)"
        @toggle-expand="toggleExpand"
        @add-item="handleAddItem"
        @edit-item="handleEditItem"
        @delete-item="handleDeleteItem"
        @update-area="handleUpdateArea"
      />
    </template>

    <!-- 添加功能区按钮 -->
    <a-button v-if="!readonly" type="dashed" long @click="handleAddArea">
      <icon-plus /> 添加功能区
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FunctionAreaCard from './FunctionAreaCard.vue'
import { useFunctionArea } from '../composables/useFunctionArea'

const props = defineProps<{
  quotationId: number
  readonly?: boolean
}>()

const emit = defineEmits<{
  (e: 'change'): void
}>()

const { areas, loading, addArea, updateArea, deleteArea, addItem, updateItem, deleteItem } =
  useFunctionArea(props.quotationId)

const expandedIds = ref<Set<number>>(new Set())

function toggleExpand(areaId: number) {
  if (expandedIds.value.has(areaId)) {
    expandedIds.value.delete(areaId)
  } else {
    expandedIds.value.add(areaId)
  }
}

// ... event handlers
</script>
```

```vue
<!-- FunctionAreaCard.vue -->
<template>
  <a-card :bordered="true" class="function-area-card" :style="{ marginBottom: '12px' }">
    <!-- 功能区头部 -->
    <template #title>
      <div class="area-header">
        <a-space>
          <a-tag :color="getAreaTypeColor(area.type)">{{ area.typeName }}</a-tag>
          <span class="area-name">{{ area.name }}</span>
          <a-tag size="small">¥{{ areaTotal }}</a-tag>
        </a-space>
      </div>
    </template>

    <template #extra>
      <a-space>
        <a-button v-if="!readonly" type="text" size="mini" @click="emit('toggle-expand', area.id)">
          <icon-expand v-if="!expanded" />
          <icon-shrink v-else />
        </a-button>
        <a-button v-if="!readonly" type="text" size="mini" @click="handleEditArea">
          <icon-edit />
        </a-button>
        <a-button v-if="!readonly" type="text" size="mini" status="danger" @click="handleDeleteArea">
          <icon-delete />
        </a-button>
      </a-space>
    </template>

    <!-- 报价项列表 (展开时) -->
    <template v-if="expanded">
      <a-table
        :data="area.items || []"
        :pagination="false"
        :bordered="{ wrapper: true, cell: true }"
        size="small"
        row-key="id"
      >
        <template #columns>
          <a-table-column title="序号" :width="50">
            <template #cell="{ rowIndex }">{{ rowIndex + 1 }}</template>
          </a-table-column>
          <a-table-column title="名称" data-index="itemName" />
          <a-table-column title="规格" data-index="specification" :width="120" />
          <a-table-column title="单位" data-index="unit" :width="60" />
          <a-table-column title="数量" data-index="quantity" :width="80">
            <template #cell="{ record }">
              <a-input-number
                v-if="!readonly"
                v-model="record.quantity"
                size="mini"
                :min="0"
                :precision="2"
                @change="handleItemChange(record)"
              />
              <span v-else>{{ record.quantity }}</span>
            </template>
          </a-table-column>
          <a-table-column title="单价" data-index="unitPrice" :width="100">
            <template #cell="{ record }">
              ¥{{ record.unitPrice?.toFixed(2) }}
            </template>
          </a-table-column>
          <a-table-column title="小计" :width="100">
            <template #cell="{ record }">
              ¥{{ ((record.quantity || 0) * (record.unitPrice || 0)).toFixed(2) }}
            </template>
          </a-table-column>
          <a-table-column v-if="!readonly" title="操作" :width="100">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="mini" @click="emit('edit-item', record)">
                  <icon-edit />
                </a-button>
                <a-button type="text" size="mini" status="danger" @click="handleRemoveItem(record)">
                  <icon-delete />
                </a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>

      <!-- 添加报价项 -->
      <a-button v-if="!readonly" type="dashed" size="small" style="margin-top: 8px;" @click="emit('add-item', area)">
        <icon-plus /> 添加报价项
      </a-button>
    </template>
  </a-card>
</template>
```

### 5.6 180个Modal → 组件分类映射

| Modal 分类 | 旧项目数量 | 新组件 | 说明 |
|-----------|-----------|--------|------|
| 功能区编辑弹窗 | 20+ | FormModal + FunctionAreaCard 内联编辑 | 大部分改为行内编辑 |
| 报价项编辑弹窗 | 30+ | FormModal + QuotationItemRow 内联编辑 | 改为行内编辑 |
| 报价项选择弹窗 | 15+ | QuotationItemSelector (SelectorModal) | 从材料库选择 |
| 折扣设置弹窗 | 10+ | DiscountEditor (FormModal) | 折扣率/折扣额 |
| 优惠弹窗 | 8+ | PreferModal (FormModal) | 优惠类型/金额 |
| 版本管理弹窗 | 5+ | VersionSwitchModal (SelectorModal) | 版本切换/复制 |
| 删除确认弹窗 | 30+ | ConfirmModal | 统一确认 |
| 保存确认弹窗 | 15+ | ConfirmModal | 保存确认 |
| 查看详情弹窗 | 20+ | DetailModal | 只读查看 |
| 材料搜索弹窗 | 10+ | SelectorModal | 搜索选择材料 |
| 锁定确认弹窗 | 5+ | ConfirmModal | 锁定/解锁确认 |
| 其他确认弹窗 | 12+ | ConfirmModal | 各类操作确认 |

**关键变化：将90+个"编辑型Modal"改为表格行内编辑，大幅减少弹窗数量。**

---

## 六、页面四：decoration4detail.js 装修单详情 (2176行, 16个Modal)

### 6.1 现状分析

- **16 个 Modal** — 编辑各类信息弹窗
- **55 个 API** — 详情加载 + 各Tab数据 + 变更操作
- **多 Tab 结构** — 基本信息/报价/合同/活动/量房/图片/服务/变更/审批
- **2 个 popup4page** — 跳转子页面

### 6.2 拆分方案

```
views/decoration/detail/index.vue            ← 详情页入口 (~100行)
├── components/
│   ├── DetailHeader.vue                     ← 头部信息 (订单号+状态+操作按钮) (~100行)
│   ├── BasicInfoTab.vue                     ← 基本信息 Tab (~120行)
│   ├── QuoteInfoTab.vue                     ← 报价信息 Tab (~150行)
│   ├── ContractInfoTab.vue                  ← 合同信息 Tab (~130行)
│   ├── ActivityInfoTab.vue                  ← 活动信息 Tab (~120行)
│   ├── MeasureInfoTab.vue                   ← 量房信息 Tab (~100行)
│   ├── PictureInfoTab.vue                   ← 图片信息 Tab (~100行)
│   ├── ServiceInfoTab.vue                   ← 服务信息 Tab (~100行)
│   ├── ChangeHistoryTab.vue                 ← 变更记录 Tab (~80行)
│   └── AuditHistoryTab.vue                  ← 审批记录 Tab (~80行)
├── composables/
│   ├── useDecorationDetail.ts               ← 详情数据加载 + 刷新 (~120行)
│   ├── useDetailAction.ts                   ← 变更操作 (改客户/改房源/改状态等) (~150行)
│   └── useDetailTab.ts                      ← Tab切换 + 数据懒加载 (~60行)
```

### 6.3 详情页入口

```vue
<template>
  <div class="decoration-detail">
    <!-- 头部 -->
    <DetailHeader
      :order-id="orderId"
      :detail="detail"
      :loading="detailLoading"
      @refresh="loadDetail"
    />

    <!-- Tab 区域 -->
    <a-card :bordered="false" style="margin-top: 16px;">
      <a-tabs v-model:active-key="activeTab" lazy-load @change="handleTabChange">
        <a-tab-pane key="basic" title="基本信息">
          <BasicInfoTab :order-id="orderId" :detail="detail" @changed="loadDetail" />
        </a-tab-pane>
        <a-tab-pane key="quote" title="报价信息">
          <QuoteInfoTab :order-id="orderId" />
        </a-tab-pane>
        <a-tab-pane key="contract" title="合同信息">
          <ContractInfoTab :order-id="orderId" />
        </a-tab-pane>
        <a-tab-pane key="activity" title="活动信息">
          <ActivityInfoTab :order-id="orderId" />
        </a-tab-pane>
        <a-tab-pane key="measure" title="量房信息">
          <MeasureInfoTab :order-id="orderId" />
        </a-tab-pane>
        <a-tab-pane key="picture" title="图片信息">
          <PictureInfoTab :order-id="orderId" />
        </a-tab-pane>
        <a-tab-pane key="service" title="服务信息">
          <ServiceInfoTab :order-id="orderId" />
        </a-tab-pane>
        <a-tab-pane key="change" title="变更记录">
          <ChangeHistoryTab :order-id="orderId" />
        </a-tab-pane>
        <a-tab-pane key="audit" title="审批记录">
          <AuditHistoryTab :order-id="orderId" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDecorationDetail } from './composables/useDecorationDetail'
import DetailHeader from './components/DetailHeader.vue'
// ... import tabs

const route = useRoute()
const orderId = route.params.orderId as string
const activeTab = ref('basic')

const { detail, detailLoading, loadDetail } = useDecorationDetail(orderId)

onMounted(() => loadDetail())
</script>
```

### 6.4 Tab 间数据流转

```
                     ┌────────────────────┐
                     │  useDecorationDetail │ ← 详情数据 Store
                     └──────────┬─────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
       DetailHeader     BasicInfoTab      QuoteInfoTab
       (显示状态)        (编辑基本信息)     (查看报价, emit changed)
                                │                 │
                                │          ┌──────┘
                                │          ▼
                                │   ContractInfoTab
                                │   (查看/创建合同)
                                │
                                ▼
                          loadDetail()
                          (刷新详情数据, 所有Tab自动更新)
```

**数据流转规则：**
1. 所有 Tab 组件共享 `useDecorationDetail` 返回的 `detail` ref
2. Tab 修改数据后 emit `changed` 事件
3. 父组件收到 `changed` 后调用 `loadDetail()` 刷新
4. Vue 响应式自动更新所有引用 `detail` 的 Tab

### 6.5 16个Modal → 组件映射

| 旧 Modal | 归属 Tab | 新方案 |
|----------|---------|--------|
| 编辑基本信息 Modal | BasicInfoTab | Tab 内联表单 |
| 变更客户 Modal | BasicInfoTab | FormModal |
| 变更房源 Modal | BasicInfoTab | FormModal |
| 变更订单号 Modal | BasicInfoTab | FormModal |
| 变更状态 Modal | DetailHeader | ConfirmModal |
| 变更付款比例 Modal | BasicInfoTab | FormModal |
| 编辑合同 Modal | ContractInfoTab | FormModal |
| 签约 Modal | ContractInfoTab | ConfirmModal |
| 创建活动 Modal | ActivityInfoTab | FormModal |
| 申请量房 Modal | MeasureInfoTab | FormModal |
| 安排量房 Modal | MeasureInfoTab | FormModal |
| 上传图片 Modal | PictureInfoTab | a-upload 内联 |
| 添加服务 Modal | ServiceInfoTab | FormModal |
| 作废确认 Modal | DetailHeader | ConfirmModal |
| 终止确认 Modal | DetailHeader | ConfirmModal |
| 隐藏确认 Modal | DetailHeader | ConfirmModal |

---

## 七、Composable 拆分清单

### 7.1 汇总

| composable | 源文件 | 行数估算 | 替代的旧代码 |
|-----------|--------|---------|-------------|
| **Decoration 模块** ||||
| useDecorationList | decoration.js | ~100 | 12个Searcher实例化 + 数据加载 |
| useDecorationSearch | decoration.js | ~80 | 12个搜索条件构建 |
| useDecorationAction | decoration.js | ~120 | 57个API调用的操作逻辑 |
| useDecorationPermission | decoration.js + drawNode | ~60 | 角色权限判断 |
| useDecorationDetail | decoration4detail.js | ~120 | 详情数据加载 + 刷新 |
| useDetailAction | decoration4detail.js | ~150 | 变更操作 |
| **Payment 模块** ||||
| usePaymentList | paymentUtils.js | ~100 | 列表数据加载 |
| usePaymentMethod | paymentUtils.js (initCash/paramCash 等) | ~150 | 5种支付方式管理 |
| usePaymentPageConfig | paymentUtils.js (getConfig) | ~80 | 动态页面配置 |
| usePaymentAction | payment.js | ~120 | 收款/退款/确认操作 |
| **Quotation 模块** ||||
| useQuotationDetail | quotationUtils.js (loadQuotationDetail) | ~150 | 报价详情加载 |
| useQuotationCalculator | quotationUtils.js (核心计算) | ~300 | 报价计算引擎 |
| useFunctionArea | quotationPart.js | ~120 | 功能区 CRUD |
| useQuotationItem | quotationPart.js | ~100 | 报价项 CRUD |
| useQuotationAction | quotationPart.js | ~100 | 提交/锁定/解锁/复制 |
| **总计** | | **~1,850** | |

### 7.2 usePaymentMethod — 支付方式统一管理

```typescript
// composables/payment/usePaymentMethod.ts
import { ref, computed } from 'vue'
import Decimal from 'decimal.js'

export interface PaymentMethodInfo {
  type: number
  label: string
  icon: string
  component: string
  enabled: boolean
}

export function usePaymentMethod() {
  const methods = ref<PaymentMethodInfo[]>([
    { type: 0, label: '现金', icon: 'icon-money', component: 'CashPayForm', enabled: true },
    { type: 1, label: '银行转账', icon: 'icon-bank', component: 'BankPayForm', enabled: true },
    { type: 2, label: '刷卡', icon: 'icon-credit-card', component: 'CheckvPayForm', enabled: true },
    { type: 3, label: '预付款抵扣', icon: 'icon-wallet', component: 'AdvancePayForm', enabled: true },
    { type: 4, label: '优惠券', icon: 'icon-gift', component: 'CouponPayForm', enabled: true },
    { type: 5, label: 'POS', icon: 'icon-pos', component: 'PosPayForm', enabled: true },
    { type: 6, label: '扫码支付', icon: 'icon-qr-code', component: 'QrCodePayForm', enabled: true },
  ])

  const enabledMethods = computed(() => methods.value.filter(m => m.enabled))

  function getMethodComponent(type: number) {
    return methods.value.find(m => m.type === type)?.component || 'CashPayForm'
  }

  function validatePaymentData(type: number, data: Record<string, any>): string | null {
    switch (type) {
      case 0: // 现金
        return null // 现金无需额外验证
      case 1: // 银行
        if (!data.bankAccount) return '请选择银行账户'
        if (!data.transferVoucher) return '请上传转账凭证'
        return null
      case 2: // 刷卡
        if (!data.posTerminal) return '请选择POS终端'
        if (!data.cardNo) return '请输入卡号后四位'
        return null
      case 3: // 预付款
        if (!data.advancePaymentId) return '请选择预付款记录'
        return null
      case 4: // 优惠券
        if (!data.couponId) return '请选择优惠券'
        return null
      case 5: // POS
        if (!data.posTerminal) return '请选择POS终端'
        return null
      case 6: // 扫码
        if (!data.qrCodeUrl) return '请生成收款二维码'
        return null
      default:
        return null
    }
  }

  // 替代旧项目的 initCash/paramCash/initBank/paramBank/initCheckv/paramCheckv 等函数对
  function buildPaymentParams(type: number, data: Record<string, any>, amount: number) {
    const base = { paymentType: type, amount: new Decimal(amount).toFixed(2) }
    switch (type) {
      case 0: return { ...base, ...data } // 现金
      case 1: return { ...base, bankAccountId: data.bankAccount, transferVoucher: data.transferVoucher }
      case 2: return { ...base, posTerminalId: data.posTerminal, cardNo: data.cardNo }
      case 3: return { ...base, advancePaymentId: data.advancePaymentId }
      case 4: return { ...base, couponId: data.couponId }
      case 5: return { ...base, posTerminalId: data.posTerminal }
      case 6: return { ...base, qrCodeUrl: data.qrCodeUrl }
      default: return base
    }
  }

  return {
    methods,
    enabledMethods,
    getMethodComponent,
    validatePaymentData,
    buildPaymentParams,
  }
}
```

---

## 八、目录结构全景图

### 8.1 最终文件清单

```
src/
├── components/
│   └── business/                           ← 跨模块通用组件
│       ├── FormModal.vue                   (~80行)
│       ├── ConfirmModal.vue                (~60行)
│       ├── DetailModal.vue                 (~30行)
│       ├── SelectorModal.vue               (~90行)
│       ├── StepModal.vue                   (~80行)
│       └── FilterBar.vue                   (~120行)  通用搜索组件
│
├── views/
│   ├── decoration/
│   │   ├── index.vue                       (~100行)  列表入口
│   │   ├── components/                     (10个文件, ~1,220行)
│   │   ├── composables/                    (4个文件, ~360行)
│   │   ├── config/                         (1个文件, ~150行)
│   │   └── detail/                         (1个入口 + 10个Tab, ~1,180行)
│   │       ├── index.vue
│   │       ├── components/                 (10个Tab组件)
│   │       └── composables/                (3个composable)
│   │
│   ├── payment/
│   │   ├── advance/
│   │   │   ├── index.vue                   (~100行)
│   │   │   ├── components/                 (6个文件, ~830行)
│   │   │   ├── payment-methods/            (7个支付方式组件, ~580行)
│   │   │   └── composables/                (4个文件, ~450行)
│   │   ├── decoration/                     (类似结构, 装修款)
│   │   ├── material/                       (类似结构, 主材款)
│   │   ├── sales/                          (类似结构, 销售款)
│   │   ├── service/                        (类似结构, 服务费)
│   │   └── ...
│   │
│   └── quotation/
│       ├── part/
│       │   ├── index.vue                   (~120行)  报价详情入口
│       │   ├── components/                 (11个文件, ~1,260行)
│       │   ├── composables/                (6个文件, ~830行)
│       │   └── types/                      (1个文件, ~80行)
│       └── ...
│
└── composables/                            ← 跨模块共享 composable
    ├── useVisible.ts                       (~20行)   弹窗可见性管理
    ├── useForm.ts                          (~50行)   表单通用逻辑
    ├── usePagination.ts                    (~30行)   分页通用逻辑
    └── useAutoComplete.ts                  (~40行)   搜索补全
```

### 8.2 文件数量统计

| 分类 | 文件数 | 总行数(估) | 替代的旧代码行数 |
|------|--------|-----------|----------------|
| 通用组件 (business/) | 6 | ~460 | - |
| decoration 列表 | 16 | ~1,830 | 2,815 |
| decoration 详情 | 14 | ~1,410 | 2,176 |
| payment 列表 (单) | 18 | ~1,960 | ~3,000 (含 utils) |
| quotation 详情 | 19 | ~2,290 | 5,195 (含 utils) |
| 共享 composable | 4 | ~140 | - |
| **合计** | **77** | **~8,090** | **~13,186** |

**代码量减少 39%**（13,186 → 8,090行），主要来自 Modal 复用和逻辑提取。

### 8.3 迁移顺序建议

```
第1周: 通用组件层
  ├── FormModal, ConfirmModal, DetailModal, SelectorModal, StepModal
  ├── FilterBar, useVisible, useForm, usePagination
  └── 验收: 5个通用Modal可独立测试

第2周: Decoration 列表页
  ├── index.vue + RoleTabBar + SearchForm + DecorationTable
  ├── roleConfig.ts (12角色配置)
  ├── 4个 composable
  └── 验收: 装修单列表可按角色切换、搜索、分页

第3周: Decoration 详情页
  ├── index.vue + 10个 Tab 组件
  ├── useDecorationDetail + useDetailAction
  └── 验收: 详情页 Tab 切换、数据加载、编辑保存

第4周: Payment 收款组件
  ├── CollectDrawer + 7个支付方式表单
  ├── usePaymentMethod + usePaymentPageConfig
  └── 验收: 5种支付方式可正常收款

第5周: Quotation 详情页
  ├── index.vue + FunctionAreaPanel + FunctionAreaCard
  ├── useQuotationCalculator (计算引擎)
  ├── AmountSummary
  └── 验收: 功能区展开/折叠、报价项编辑、金额计算正确

第6周: Quotation 弹窗 + 集成
  ├── QuotationItemSelector, DiscountEditor, PreferModal
  ├── useQuotationAction (提交/锁定/解锁)
  └── 验收: 完整报价流程端到端测试
```

---

*文档生成时间: 2026-04-26*
*基于 migration-audit-report.md P0 优先级要求，覆盖 3个最复杂页面 + Modal 复用体系*
*旧项目总代码量 ~13,186 行 → 新项目预计 ~8,090 行，减少 39%*
