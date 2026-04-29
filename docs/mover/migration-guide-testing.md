# 测试指南 (P2)

> Vue 3 + TypeScript 项目测试策略 — 单元测试 + 组件测试 + E2E 测试 + Mock 方案

---

## 目录

1. [测试总则](#一测试总则)
2. [测试目录结构](#二测试目录结构)
3. [单元测试规范 (Vitest)](#三单元测试规范-vitest)
4. [组件测试规范 (Vue Test Utils)](#四组件测试规范-vue-test-utils)
5. [E2E 测试规范 (Playwright)](#五e2e-测试规范-playwright)
6. [Mock 方案 (MSW)](#六mock-方案-msw)
7. [测试覆盖率要求](#七测试覆盖率要求)
8. [CI/CD 集成](#八cicd-集成)
9. [测试数据工厂](#九测试数据工厂)
10. [各模块测试用例清单](#十各模块测试用例清单)

---

## 一、测试总则

### 1.1 测试金字塔

```
         /  E2E  \           ← Playwright, 少量关键路径 (~20个)
        / 组件测试 \          ← Vue Test Utils + Arco Design Mock
       /  单元测试   \        ← Vitest, 核心逻辑全覆盖
      /--------------\
```

| 层级 | 工具 | 覆盖目标 | 运行频率 | 耗时 |
|------|------|---------|---------|------|
| 单元测试 | Vitest | Composable / Store / Utils | 每次 commit | <10s |
| 组件测试 | Vue Test Utils | 业务组件 (非纯UI) | 每次 commit | <30s |
| E2E 测试 | Playwright | 关键业务流程 | PR合并前 | <5min |

### 1.2 优先级

| 优先级 | 测试对象 | 原因 |
|--------|---------|------|
| P0 | 金额计算 (Decimal.js) | 涉及资金, 不允许浮点误差 |
| P0 | Store 状态流转 | 全局状态, 影响范围大 |
| P0 | API 拦截器 (Token/401) | 认证核心 |
| P1 | Composable 逻辑 | 可复用业务逻辑 |
| P1 | 表单验证规则 | 数据完整性 |
| P2 | 纯UI组件渲染 | 变化频繁, ROI低 |
| P2 | 路由守卫 | 配置型, 不易出错 |

### 1.3 测试文件命名

```
规则: 被测文件名 + .test.ts

示例:
  src/composables/business/useQuotationCalc.ts
  → tests/unit/composables/useQuotationCalc.test.ts

  src/stores/modules/payment.ts
  → tests/unit/stores/payment.test.ts

  src/views/decoration/DecorationList.vue
  → tests/component/decoration/DecorationList.test.ts

  tests/e2e/decoration/create-decoration.spec.ts
```

---

## 二、测试目录结构

```
tests/
├── unit/                            # 单元测试
│   ├── composables/
│   │   ├── useQuotationCalc.test.ts
│   │   ├── usePayment.test.ts
│   │   ├── useFilterBar.test.ts
│   │   ├── useCRUDTable.test.ts
│   │   └── useExport.test.ts
│   │
│   ├── stores/
│   │   ├── user.test.ts
│   │   ├── dict.test.ts
│   │   ├── permission.test.ts
│   │   ├── decoration.test.ts
│   │   ├── payment.test.ts
│   │   ├── sales.test.ts
│   │   └── quotation.test.ts
│   │
│   ├── utils/
│   │   ├── auth.test.ts
│   │   ├── format.test.ts
│   │   ├── validate.test.ts
│   │   └── decimal.test.ts           # 金额计算核心
│   │
│   └── api/
│       ├── interceptor.test.ts
│       ├── request.test.ts
│       └── decoration.test.ts
│
├── component/                       # 组件测试
│   ├── shared/
│   │   ├── FilterBar.test.ts
│   │   ├── CRUDTable.test.ts
│   │   ├── ModalManager.test.ts
│   │   ├── DetailDrawer.test.ts
│   │   └── StatusTag.test.ts
│   │
│   ├── business/
│   │   ├── PersonSelector.test.ts
│   │   ├── BuildingSelector.test.ts
│   │   ├── OrderLink.test.ts
│   │   ├── PaymentWidget.test.ts
│   │   └── ApprovalFlow.test.ts
│   │
│   └── decoration/
│       ├── DecorationList.test.ts
│       ├── DecorationDetail.test.ts
│       └── DecorationForm.test.ts
│
├── e2e/                             # E2E 测试 (Playwright)
│   ├── auth.spec.ts                 # 登录/登出
│   ├── decoration/
│   │   ├── create-decoration.spec.ts
│   │   ├── decoration-list-filter.spec.ts
│   │   └── decoration-status-flow.spec.ts
│   │
│   ├── payment/
│   │   ├── collect-payment.spec.ts
│   │   └── refund-payment.spec.ts
│   │
│   ├── quotation/
│   │   ├── create-quotation.spec.ts
│   │   └── quotation-calc.spec.ts
│   │
│   └── sales/
│       ├── create-order.spec.ts
│       └── follow-record.spec.ts
│
├── mocks/                           # Mock 数据 & 工具
│   ├── handlers/                    # MSW handlers
│   │   ├── decoration.ts
│   │   ├── payment.ts
│   │   ├── sales.ts
│   │   ├── quotation.ts
│   │   ├── common.ts
│   │   └── index.ts
│   │
│   ├── data/                        # 静态 Mock 数据
│   │   ├── decoration.json
│   │   ├── payment.json
│   │   ├── sales.json
│   │   ├── quotation.json
│   │   └── common.json
│   │
│   ├── factories/                   # 测试数据工厂
│   │   ├── index.ts
│   │   ├── decoration.ts
│   │   ├── payment.ts
│   │   ├── sales.ts
│   │   └── quotation.ts
│   │
│   └── server.ts                    # MSW Server 配置
│
└── setup/                           # 测试配置
    ├── vitest.setup.ts              # Vitest 全局 setup
    ├── component.setup.ts           # 组件测试 setup
    └── e2e.setup.ts                 # E2E setup
```

---

## 三、单元测试规范 (Vitest)

### 3.1 Vitest 配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,                    // 全局 describe/it/expect
    environment: 'jsdom',             // DOM 环境
    setupFiles: ['./tests/setup/vitest.setup.ts'],
    include: ['tests/unit/**/*.test.ts', 'tests/component/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/composables/**',
        'src/stores/**',
        'src/utils/**',
        'src/api/**',
      ],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.ts',
        'src/mocks/**',
      ],
      thresholds: {
        statements: 70,
        branches: 60,
        functions: 70,
        lines: 70,
      },
    },
    // 测试超时
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
```

### 3.2 全局 Setup

```typescript
// tests/setup/vitest.setup.ts
import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
    get length() { return Object.keys(store).length },
    key: (i: number) => Object.keys(store)[i] ?? null,
  }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// 全局组件 stub (避免 Arco Design 组件渲染)
config.global.stubs = {
  'a-button': true,
  'a-input': true,
  'a-select': true,
  'a-table': true,
  'a-modal': true,
  'a-drawer': true,
  'a-form': true,
  'a-form-item': true,
  'a-tag': true,
  'a-space': true,
  'a-tooltip': true,
  'a-popconfirm': true,
  'a-message': true,
  'a-notification': true,
}
```

### 3.3 单元测试示例 — 金额计算 (P0)

```typescript
// tests/unit/utils/decimal.test.ts
import { describe, it, expect } from 'vitest'
import Decimal from 'decimal.js'
import {
  calcTotal,
  calcDiscount,
  calcBalance,
  calcProfitRate,
  sumPayments,
  formatMoney,
} from '@/utils/decimal'

describe('金额计算 (P0 — 不可有浮点误差)', () => {
  // 总价 = 数量 × 单价
  it('calcTotal: 3 × 199.50 = 598.50', () => {
    expect(calcTotal(3, 199.5)).toBe(598.5)
  })

  it('calcTotal: 0.1 × 0.2 = 0.02 (非 0.020000000000000004)', () => {
    expect(calcTotal(0.1, 0.2)).toBe(0.02)
  })

  it('calcTotal: 999999 × 999.99 = 999899001 (大数)', () => {
    expect(calcTotal(999999, 999.99)).toBe(999899001)
  })

  // 折扣
  it('calcDiscount: 10000 × 0.95 = 9500', () => {
    expect(calcDiscount(10000, 0.95)).toBe(9500)
  })

  it('calcDiscount: 0 折扣返回 0', () => {
    expect(calcDiscount(10000, 0)).toBe(0)
  })

  // 余额
  it('calcBalance: 10000 - 6000 - 3000 = 1000', () => {
    expect(calcBalance(10000, [6000, 3000])).toBe(1000)
  })

  it('calcBalance: 已收 > 应收返回 0 (不返回负数)', () => {
    expect(calcBalance(5000, [3000, 4000])).toBe(0)
  })

  // 利润率
  it('calcProfitRate: (15000-10000)/10000 = 50%', () => {
    expect(calcProfitRate(15000, 10000)).toBe(50)
  })

  it('calcProfitRate: 成本为0返回 0', () => {
    expect(calcProfitRate(10000, 0)).toBe(0)
  })

  // 累计收款
  it('sumPayments: 空数组返回 0', () => {
    expect(sumPayments([])).toBe(0)
  })

  it('sumPayments: 多笔收款求和', () => {
    const payments = [
      { amount: 3000, status: 1 },
      { amount: 2000, status: 1 },
      { amount: 5000, status: 0 },   // 未确认, 不计入
    ]
    expect(sumPayments(payments)).toBe(5000)
  })

  // 格式化
  it('formatMoney: 12345.6 → ¥12,345.60', () => {
    expect(formatMoney(12345.6)).toBe('¥12,345.60')
  })

  it('formatMoney: 0 → ¥0.00', () => {
    expect(formatMoney(0)).toBe('¥0.00')
  })

  it('formatMoney: 负数 → -¥1,234.56', () => {
    expect(formatMoney(-1234.56)).toBe('-¥1,234.56')
  })
})
```

### 3.4 单元测试示例 — Store (P0)

```typescript
// tests/unit/stores/payment.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePaymentStore } from '@/stores/modules/payment'
import type { PaymentRecordVO } from '@/api/payment/types'

describe('PaymentStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('初始状态正确', () => {
    const store = usePaymentStore()
    expect(store.payments).toEqual([])
    expect(store.currentPayment).toBeNull()
    expect(store.totalAmount).toBe(0)
  })

  it('setPayments 更新列表并重算总额', () => {
    const store = usePaymentStore()
    const records: PaymentRecordVO[] = [
      { id: 1, amount: 5000, actualAmount: 5000, status: 1 } as any,
      { id: 2, amount: 3000, actualAmount: 2800, status: 1 } as any,
    ]
    store.setPayments(records)
    expect(store.payments.length).toBe(2)
    expect(store.totalAmount).toBe(7800) // actualAmount 求和
  })

  it('addPayment 追加并重新计算', () => {
    const store = usePaymentStore()
    store.setPayments([
      { id: 1, amount: 5000, actualAmount: 5000, status: 1 } as any,
    ])
    store.addPayment({
      id: 2, amount: 3000, actualAmount: 3000, status: 1,
    } as PaymentRecordVO)
    expect(store.totalAmount).toBe(8000)
  })

  it('getPaymentsByType 按类型筛选', () => {
    const store = usePaymentStore()
    store.setPayments([
      { id: 1, paymentType: 'decoration', amount: 5000, actualAmount: 5000, status: 1 } as any,
      { id: 2, paymentType: 'material', amount: 3000, actualAmount: 3000, status: 1 } as any,
      { id: 3, paymentType: 'decoration', amount: 2000, actualAmount: 2000, status: 1 } as any,
    ])
    expect(store.getPaymentsByType('decoration').length).toBe(2)
  })

  it('reset 清空所有状态', () => {
    const store = usePaymentStore()
    store.setPayments([{ id: 1, amount: 5000, actualAmount: 5000, status: 1 } as any])
    store.reset()
    expect(store.payments).toEqual([])
    expect(store.totalAmount).toBe(0)
  })
})
```

### 3.5 单元测试示例 — API 拦截器 (P0)

```typescript
// tests/unit/api/interceptor.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { setupInterceptors } from '@/api/interceptor'

describe('API 拦截器', () => {
  let instance: any

  beforeEach(() => {
    instance = axios.create()
    setupInterceptors(instance)
  })

  it('请求拦截器: 有 Token 时注入 Authorization header', async () => {
    vi.spyOn(localStorage, 'getItem').mockReturnValue('test-token-123')

    const config: any = {}
    await instance.interceptors.request.handlers[0].fulfilled(config)

    expect(config.headers.Authorization).toBe('Bearer test-token-123')
  })

  it('请求拦截器: 无 Token 时不注入 header', async () => {
    vi.spyOn(localStorage, 'getItem').mockReturnValue(null)

    const config: any = { headers: {} }
    await instance.interceptors.request.handlers[0].fulfilled(config)

    expect(config.headers.Authorization).toBeUndefined()
  })

  it('响应拦截器: code=0 直接返回 data', async () => {
    const response = {
      data: { code: 0, msg: 'ok', data: { id: 1, name: 'test' } },
    }
    const result = await instance.interceptors.response.handlers[0].fulfilled(response)
    expect(result).toEqual({ id: 1, name: 'test' })
  })

  it('响应拦截器: code=401 触发 Token 过期处理', async () => {
    const response = {
      data: { code: 401, msg: '登录已过期', data: null },
    }

    await expect(
      instance.interceptors.response.handlers[0].fulfilled(response)
    ).rejects.toThrow('登录已过期')
  })

  it('响应拦截器: code=1 业务错误 reject', async () => {
    const response = {
      data: { code: 1, msg: '该装修单已锁定', data: null },
    }

    await expect(
      instance.interceptors.response.handlers[0].fulfilled(response)
    ).rejects.toThrow('该装修单已锁定')
  })
})
```

### 3.6 单元测试示例 — Composable (P1)

```typescript
// tests/unit/composables/useQuotationCalc.test.ts
import { describe, it, expect } from 'vitest'
import { useQuotationCalc } from '@/composables/business/useQuotationCalc'

describe('useQuotationCalc', () => {
  it('计算功能区小计: items quantity × unitPrice 之和', () => {
    const { calcFunctionAreaTotal } = useQuotationCalc()
    const items = [
      { quantity: 2, unitPrice: 150, totalPrice: 300 },
      { quantity: 5, unitPrice: 80, totalPrice: 400 },
      { quantity: 1, unitPrice: 200, totalPrice: 200 },
    ]
    expect(calcFunctionAreaTotal(items)).toBe(900)
  })

  it('计算报价单总计: 所有功能区之和', () => {
    const { calcQuotationTotal } = useQuotationCalc()
    const areas = [
      { name: '客厅', totalAmount: 15000 },
      { name: '卧室', totalAmount: 8000 },
      { name: '厨房', totalAmount: 6000 },
    ]
    expect(calcQuotationTotal(areas)).toBe(29000)
  })

  it('计算利润: finalAmount - costTotal', () => {
    const { calcProfit } = useQuotationCalc()
    expect(calcProfit(50000, 32000)).toBe(18000)
  })

  it('计算利润率: profit / costTotal × 100, 保留2位', () => {
    const { calcProfitRate } = useQuotationCalc()
    expect(calcProfitRate(50000, 32000)).toBe(56.25)
  })

  it('利润率: 成本为0返回0', () => {
    const { calcProfitRate } = useQuotationCalc()
    expect(calcProfitRate(50000, 0)).toBe(0)
  })

  it('应用优惠: 总额 - 优惠金额', () => {
    const { applyPrefer } = useQuotationCalc()
    expect(applyPrefer(50000, 3000, 0)).toBe(47000)
  })

  it('应用优惠: 按比例折扣', () => {
    const { applyPrefer } = useQuotationCalc()
    expect(applyPrefer(50000, 0, 0.95)).toBe(47500)
  })
})
```

### 3.7 单元测试示例 — useFilterBar (P1)

```typescript
// tests/unit/composables/useFilterBar.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useFilterBar } from '@/composables/shared/useFilterBar'

describe('useFilterBar', () => {
  it('初始查询参数为空', () => {
    const { queryParams } = useFilterBar()
    expect(queryParams.value).toEqual({ page: 1, size: 20 })
  })

  it('resetFilters 重置为初始值', () => {
    const { queryParams, setFilter, resetFilters } = useFilterBar()
    setFilter('customerName', '张三')
    setFilter('status', 1)
    expect(queryParams.value.customerName).toBe('张三')
    resetFilters()
    expect(queryParams.value.customerName).toBeUndefined()
    expect(queryParams.value.status).toBeUndefined()
  })

  it('setFilter 保留 page=1, size=20', () => {
    const { queryParams, setFilter } = useFilterBar()
    setFilter('village', '碧桂园')
    expect(queryParams.value.page).toBe(1)
    expect(queryParams.value.size).toBe(20)
  })

  it('removeFilter 移除单个筛选条件', () => {
    const { queryParams, setFilter, removeFilter } = useFilterBar()
    setFilter('customerName', '张三')
    setFilter('village', '碧桂园')
    removeFilter('customerName')
    expect(queryParams.value.customerName).toBeUndefined()
    expect(queryParams.value.village).toBe('碧桂园')
  })
})
```

---

## 四、组件测试规范 (Vue Test Utils)

### 4.1 组件测试 Setup

```typescript
// tests/setup/component.setup.ts
import { config } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createPinia, setActivePinia } from 'pinia'
import ArcoVue from '@arco-design/web-vue'

// i18n
const i18n = createI18n({ legacy: false, locale: 'zh-CN', messages: {} })

// 全局插件
config.global.plugins = [i18n, ArcoVue, createPinia()]

// 全局 provide
config.global.provide = {
  // 按需注入
}
```

### 4.2 组件测试示例 — StatusTag

```typescript
// tests/component/shared/StatusTag.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusTag from '@/components/shared/StatusTag/index.vue'

describe('StatusTag', () => {
  it('渲染状态文本', () => {
    const wrapper = mount(StatusTag, {
      props: { label: '施工中', color: 'blue' },
    })
    expect(wrapper.text()).toContain('施工中')
  })

  it('color 为 greenarcoblue 时渲染对应 Arco 颜色', () => {
    const wrapper = mount(StatusTag, {
      props: { label: '已签约', color: 'green' },
    })
    const tag = wrapper.find('.arco-tag')
    expect(tag.exists()).toBe(true)
    expect(tag.classes()).toContain('arco-tag-green')
  })
})
```

### 4.3 组件测试示例 — FormModal (弹窗系统)

```typescript
// tests/component/shared/ModalManager.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import FormModal from '@/components/shared/ModalManager/FormModal.vue'

describe('FormModal', () => {
  it('visible=false 时不渲染', () => {
    const wrapper = mount(FormModal, {
      props: {
        visible: false,
        title: '编辑装修单',
        formItems: [],
      },
    })
    expect(wrapper.find('.arco-modal').exists()).toBe(false)
  })

  it('visible=true 时渲染标题', () => {
    const wrapper = mount(FormModal, {
      props: {
        visible: true,
        title: '编辑装修单',
        formItems: [
          { field: 'customerName', label: '客户姓名', type: 'input', required: true },
        ],
      },
    })
    expect(wrapper.find('.arco-modal-header-title').text()).toBe('编辑装修单')
  })

  it('点击确定触发 @ok 事件', async () => {
    const onOk = vi.fn()
    const wrapper = mount(FormModal, {
      props: {
        visible: true,
        title: '编辑',
        formItems: [],
        onOk,
      },
    })
    await wrapper.find('.arco-modal-confirm-btn').trigger('click')
    expect(onOk).toHaveBeenCalled()
  })
})
```

### 4.4 组件测试示例 — PaymentWidget

```typescript
// tests/component/business/PaymentWidget.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PaymentWidget from '@/components/business/PaymentWidget/index.vue'

describe('PaymentWidget', () => {
  it('显示5种支付方式', () => {
    const wrapper = mount(PaymentWidget, {
      props: { visible: true, amount: 10000 },
    })
    // 应该有 现金/银行转账/POS/预付款抵扣/扫码支付 等选项
    const methods = wrapper.findAll('.payment-method-item')
    expect(methods.length).toBeGreaterThanOrEqual(4)
  })

  it('选择支付方式后显示对应表单字段', async () => {
    const wrapper = mount(PaymentWidget, {
      props: { visible: true, amount: 10000 },
    })
    // 选择银行转账后应显示 银行名称/卡号 字段
    await wrapper.findAll('.payment-method-item')[1].trigger('click')
    expect(wrapper.find('[placeholder*="银行"]').exists()).toBe(true)
  })

  it('金额不允许为0或负数', async () => {
    const onPay = vi.fn()
    const wrapper = mount(PaymentWidget, {
      props: { visible: true, amount: 0, onPay },
    })
    // 提交时应校验
    expect(wrapper.find('.arco-form-item-error').exists()).toBe(true)
  })
})
```

---

## 五、E2E 测试规范 (Playwright)

### 5.1 Playwright 配置

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,              // ERP 系统串行执行, 避免数据冲突
  retries: 1,
  workers: 1,
  reporter: [['html', { open: 'never' }]],
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // 在测试前启动开发服务器
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
})
```

### 5.2 E2E 通用工具

```typescript
// tests/e2e/fixtures.ts
import { test as base, expect } from '@playwright/test'

// 扩展 test fixture, 注入登录状态
export const test = base.extend({
  // 自动登录后进入首页
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login')
    await page.fill('[data-testid="login-username"]', 'testuser')
    await page.fill('[data-testid="login-password"]', 'testpass123')
    await page.click('[data-testid="login-submit"]')
    await page.waitForURL('/dashboard')
    await use(page)
  },
})

export { expect }
```

### 5.3 E2E 用例 — 创建装修单 (P0 关键路径)

```typescript
// tests/e2e/decoration/create-decoration.spec.ts
import { test, expect } from '../../fixtures'

test.describe('装修单 — 创建流程', () => {
  test('正常创建装修单', async ({ authenticatedPage: page }) => {
    await page.goto('/decoration/list')
    await page.click('[data-testid="btn-create"]')

    // 填写表单
    await page.fill('[data-testid="field-orderId"]', 'E2E-ZX-001')
    await page.click('[data-testid="field-customerId"]')
    await page.getByPlaceholder('搜索客户').fill('张三')
    await page.getByText('张三 (13800138000)').click()
    await page.click('[data-testid="field-designerId"]')
    await page.getByPlaceholder('搜索设计师').fill('李工')
    await page.getByText('李工').click()

    // 提交
    await page.click('[data-testid="btn-submit"]')
    await expect(page.getByText('创建成功')).toBeVisible()

    // 验证列表中出现新记录
    await expect(page.getByText('E2E-ZX-001')).toBeVisible()
  })

  test('必填字段为空时阻止提交', async ({ authenticatedPage: page }) => {
    await page.goto('/decoration/list')
    await page.click('[data-testid="btn-create"]')
    await page.click('[data-testid="btn-submit"]')
    await expect(page.getByText('请输入装修单号')).toBeVisible()
  })
})
```

### 5.4 E2E 用例 — 收款流程

```typescript
// tests/e2e/payment/collect-payment.spec.ts
import { test, expect } from '../../fixtures'

test.describe('付款 — 收款流程', () => {
  test('现金收款并确认', async ({ authenticatedPage: page }) => {
    // 进入装修单详情 → 收款页签
    await page.goto('/decoration/detail/ZX20260401001')
    await page.click('[data-testid="tab-payment"]')
    await page.click('[data-testid="btn-collect"]')

    // 填写收款信息
    await page.selectOption('[data-testid="field-method"]', '0')  // 现金
    await page.fill('[data-testid="field-amount"]', '5000')

    // 提交
    await page.click('[data-testid="btn-confirm-collect"]')
    await expect(page.getByText('收款成功')).toBeVisible()
  })

  test('退款并验证余额更新', async ({ authenticatedPage: page }) => {
    await page.goto('/decoration/detail/ZX20260401001')
    await page.click('[data-testid="tab-payment"]')

    // 记录当前余额
    const balanceBefore = await page.textContent('[data-testid="balance-amount"]')

    // 执行退款
    await page.click('[data-testid="btn-refund-first"]')
    await page.fill('[data-testid="field-refund-amount"]', '1000')
    await page.fill('[data-testid="field-refund-reason"]', '客户退款测试')
    await page.click('[data-testid="btn-confirm-refund"]')
    await expect(page.getByText('退款成功')).toBeVisible()

    // 验证余额增加
    const balanceAfter = await page.textContent('[data-testid="balance-amount"]')
    expect(Number(balanceAfter)).toBeGreaterThan(Number(balanceBefore))
  })
})
```

### 5.5 E2E 用例 — 报价计算

```typescript
// tests/e2e/quotation/quotation-calc.spec.ts
import { test, expect } from '../../fixtures'

test.describe('报价 — 金额计算', () => {
  test('报价单总价 = 所有功能区之和', async ({ authenticatedPage: page }) => {
    await page.goto('/quotation/detail/QT001')

    // 读取各功能区小计
    const areas = await page.locator('[data-testid="function-area-total"]').allTextContents()
    const areaTotals = areas.map(s => Number(s.replace(/[^0-9.]/g, '')))
    const sum = areaTotals.reduce((a, b) => a + b, 0)

    // 读取总价
    const totalText = await page.textContent('[data-testid="quotation-total"]')
    const total = Number(totalText.replace(/[^0-9.]/g, ''))

    expect(total).toBe(sum)
  })

  test('修改报价项数量后总价自动更新', async ({ authenticatedPage: page }) => {
    await page.goto('/quotation/detail/QT001')

    const totalBefore = await page.textContent('[data-testid="quotation-total"]')

    // 修改第一个报价项数量
    await page.click('[data-testid="edit-first-item"]')
    await page.fill('[data-testid="field-quantity"]', '10')
    await page.click('[data-testid="btn-save-item"]')

    await page.waitForTimeout(500)

    const totalAfter = await page.textContent('[data-testid="quotation-total"]')
    expect(totalAfter).not.toBe(totalBefore)
  })
})
```

---

## 六、Mock 方案 (MSW)

### 6.1 MSW Server 配置

```typescript
// tests/mocks/server.ts
import { setupServer } from 'msw/node'
import { decorationHandlers } from './handlers/decoration'
import { paymentHandlers } from './handlers/payment'
import { salesHandlers } from './handlers/sales'
import { quotationHandlers } from './handlers/quotation'
import { commonHandlers } from './handlers/common'

export const server = setupServer(
  ...commonHandlers,
  ...decorationHandlers,
  ...paymentHandlers,
  ...salesHandlers,
  ...quotationHandlers,
)
```

### 6.2 Vitest Setup 集成 MSW

```typescript
// tests/setup/vitest.setup.ts (补充 MSW 部分)
import { server } from '../mocks/server'
import { afterAll, afterEach, beforeAll } from 'vitest'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### 6.3 Handler 示例 — Decoration

```typescript
// tests/mocks/handlers/decoration.ts
import { http, HttpResponse } from 'msw'
import { createDecorationFactory } from '../factories/decoration'

const factory = createDecorationFactory()

export const decorationHandlers = [
  // 分页查询
  http.get('/decoration/pageDecoration.do', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const size = Number(url.searchParams.get('size')) || 20
    const status = url.searchParams.get('status')

    let items = factory.createList(size)
    if (status) {
      items = items.filter(i => String(i.status) === status)
    }

    return HttpResponse.json({
      code: 0,
      msg: 'ok',
      data: { list: items, count: 100, page, size },
    })
  }),

  // 按订单ID查询
  http.get('/decoration/queryDecorationByOrderId.do', ({ request }) => {
    const url = new URL(request.url)
    const orderId = url.searchParams.get('orderId') || 'ZX001'

    return HttpResponse.json({
      code: 0,
      msg: 'ok',
      data: factory.create({ orderId }),
    })
  }),

  // 创建
  http.post('/decoration/createDecoration.do', async ({ request }) => {
    const body = await request.json() as any

    if (!body.orderId || !body.customerId || !body.designerId) {
      return HttpResponse.json({ code: 1, msg: '必填参数缺失' })
    }

    return HttpResponse.json({
      code: 0,
      msg: 'ok',
      data: Date.now(), // 返回新记录ID
    })
  }),

  // 状态变更
  http.post('/decoration/changeDecorationForStatus.do', async ({ request }) => {
    const body = await request.json() as any

    if (body.status === undefined) {
      return HttpResponse.json({ code: 1, msg: 'status 参数缺失' })
    }

    return HttpResponse.json({ code: 0, msg: 'ok', data: { success: true } })
  }),
]
```

### 6.4 Handler 示例 — Common (认证)

```typescript
// tests/mocks/handlers/common.ts
import { http, HttpResponse } from 'msw'

export const commonHandlers = [
  // 登录
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as any

    if (body.username === 'testuser' && body.password === 'testpass123') {
      return HttpResponse.json({
        code: 0,
        msg: 'ok',
        data: { token: 'mock-jwt-token', userId: 1, name: '测试用户' },
      })
    }
    return HttpResponse.json({ code: 1, msg: '用户名或密码错误' })
  }),

  // 字典查询
  http.get('/api/common/dict/query', ({ request }) => {
    const url = new URL(request.url)
    const module = url.searchParams.get('module')
    const entity = url.searchParams.get('entity')

    return HttpResponse.json({
      code: 0,
      msg: 'ok',
      data: {
        keys: ['status_0', 'status_1', 'status_2'],
        values: [0, 1, 2],
        labels: ['草稿', '进行中', '已完成'],
        datas: [
          { key: 'status_0', value: 0, label: '草稿', color: 'gray' },
          { key: 'status_1', value: 1, label: '进行中', color: 'blue' },
          { key: 'status_2', value: 2, label: '已完成', color: 'green' },
        ],
      },
    })
  }),

  // 文件上传
  http.post('/common/uploadImg.do', async ({ request }) => {
    return HttpResponse.json({
      code: 0,
      msg: 'ok',
      data: { id: 1, name: 'test.png', url: '/uploads/test.png', size: 1024 },
    })
  }),
]
```

### 6.5 Handler 示例 — Payment (付款)

```typescript
// tests/mocks/handlers/payment.ts
import { http, HttpResponse } from 'msw'
import { createPaymentFactory } from '../factories/payment'

const factory = createPaymentFactory()

export const paymentHandlers = [
  // 装修款分页
  http.post('/payment/decoration/pageDecorationPayment.do', async ({ request }) => {
    const body = await request.json() as any
    const page = body.page ?? 1
    const size = body.size ?? 20

    const items = factory.createList(size)

    return HttpResponse.json({
      code: 0,
      msg: 'ok',
      data: { list: items, count: 50, page, size },
    })
  }),

  // 装修款收款
  http.post('/payment/decoration/collectDecorationPayment.do', async ({ request }) => {
    const body = await request.json() as any

    if (!body.orderId || !body.amount || body.method === undefined) {
      return HttpResponse.json({ code: 1, msg: '必填参数缺失' })
    }

    return HttpResponse.json({
      code: 0,
      msg: 'ok',
      data: factory.create({
        orderId: body.orderId,
        amount: body.amount,
        actualAmount: body.actualAmount ?? body.amount,
        method: body.method,
        status: 1,
      }),
    })
  }),

  // 装修款退款
  http.post('/payment/decoration/refundDecorationPayment.do', async ({ request }) => {
    const body = await request.json() as any

    if (!body.paymentId || !body.refundAmount) {
      return HttpResponse.json({ code: 1, msg: '必填参数缺失' })
    }

    if (body.refundAmount <= 0) {
      return HttpResponse.json({ code: 1, msg: '退款金额必须大于0' })
    }

    return HttpResponse.json({
      code: 0,
      msg: 'ok',
      data: factory.create({
        id: body.paymentId,
        refundAmount: body.refundAmount,
        status: 3,
        remark: body.reason ?? '退款',
      }),
    })
  }),

  // 预付款查询
  http.get('/payment/advance/queryByOrderId.do', ({ request }) => {
    const url = new URL(request.url)
    const orderId = url.searchParams.get('orderId') || 'ZX001'

    return HttpResponse.json({
      code: 0,
      msg: 'ok',
      data: {
        orderId,
        totalAdvance: 50000,
        usedAmount: 20000,
        availableAmount: 30000,
        withdrawRecords: [],
      },
    })
  }),

  // 预付款提现
  http.post('/payment/advance/withdrawPayment.do', async ({ request }) => {
    const body = await request.json() as any

    if (!body.orderId || !body.amount) {
      return HttpResponse.json({ code: 1, msg: '必填参数缺失' })
    }

    if (body.amount > 30000) {
      return HttpResponse.json({ code: 1, msg: '提现金额超出可用余额' })
    }

    return HttpResponse.json({
      code: 0,
      msg: 'ok',
      data: {
        withdrawId: Date.now(),
        orderId: body.orderId,
        amount: body.amount,
        status: 0,
        createTime: new Date().toISOString(),
      },
    })
  }),
]
```

### 6.6 Handler 示例 — Sales (销售)

```typescript
// tests/mocks/handlers/sales.ts
import { http, HttpResponse } from 'msw'

// 简易销售数据生成
function createSalesOrder(overrides: Record<string, any> = {}) {
  return {
    id: Math.floor(Math.random() * 999999) + 1,
    orderId: `XS${Date.now()}`,
    customerId: 100,
    customerName: '测试客户',
    customerPhone: '13800138000',
    salesmanId: 1,
    salesmanName: '测试销售',
    totalAmount: 15000,
    paidAmount: 8000,
    balanceAmount: 7000,
    status: 1,
    statusName: '待发货',
    deliveryAddress: '测试地址',
    remark: '',
    items: [
      { productId: 1, productName: '测试商品A', quantity: 2, unitPrice: 5000, totalPrice: 10000 },
      { productId: 2, productName: '测试商品B', quantity: 1, unitPrice: 5000, totalPrice: 5000 },
    ],
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    ...overrides,
  }
}

export const salesHandlers = [
  // 销售单分页
  http.post('/sales/pageSalesOrder.do', async ({ request }) => {
    const body = await request.json() as any
    const page = body.page ?? 1
    const size = body.size ?? 20

    const items = Array.from({ length: Math.min(size, 10) }, () =>
      createSalesOrder(),
    )

    return HttpResponse.json({
      code: 0,
      msg: 'ok',
      data: { list: items, count: 30, page, size },
    })
  }),

  // 销售单详情
  http.get('/sales/querySalesOrderByOrderId.do', ({ request }) => {
    const url = new URL(request.url)
    const orderId = url.searchParams.get('orderId') || 'XS001'

    return HttpResponse.json({
      code: 0,
      msg: 'ok',
      data: createSalesOrder({ orderId }),
    })
  }),

  // 客户搜索 (按手机号)
  http.get('/sales/queryCustomerByPhone.do', ({ request }) => {
    const url = new URL(request.url)
    const phone = url.searchParams.get('phone') || ''

    if (!phone) {
      return HttpResponse.json({ code: 1, msg: '手机号不能为空' })
    }

    // 模糊匹配返回结果
    const customers = [
      { id: 1, name: '张三', phone: '13800138000', address: '碧桂园5栋201' },
      { id: 2, name: '李四', phone: '13900139000', address: '万科花园3栋102' },
    ]

    const matched = customers.filter(c => c.phone.includes(phone))

    return HttpResponse.json({
      code: 0,
      msg: 'ok',
      data: matched.length > 0 ? matched : customers,
    })
  }),

  // 发货确认
  http.post('/sales/confirmSalesDelivery.do', async ({ request }) => {
    const body = await request.json() as any

    if (!body.orderId) {
      return HttpResponse.json({ code: 1, msg: '订单号不能为空' })
    }

    return HttpResponse.json({
      code: 0,
      msg: 'ok',
      data: {
        orderId: body.orderId,
        deliveryStatus: 1,
        deliveryTime: new Date().toISOString(),
        logisticsNo: body.logisticsNo ?? 'SF' + Date.now(),
      },
    })
  }),

  // 销售结算
  http.post('/sales/postSalesBalance.do', async ({ request }) => {
    const body = await request.json() as any

    if (!body.orderId || body.amount === undefined) {
      return HttpResponse.json({ code: 1, msg: '必填参数缺失' })
    }

    return HttpResponse.json({
      code: 0,
      msg: 'ok',
      data: {
        orderId: body.orderId,
        settledAmount: body.amount,
        balanceAmount: 0,
        settleTime: new Date().toISOString(),
      },
    })
  }),
]
```

### 6.7 Handler 示例 — Quotation (报价)

```typescript
// tests/mocks/handlers/quotation.ts
import { http, HttpResponse } from 'msw'

// 简易报价数据生成
function createQuotation(overrides: Record<string, any> = {}) {
  return {
    id: Math.floor(Math.random() * 999999) + 1,
    quotationId: `QT${Date.now()}`,
    orderId: 'ZX20260401001',
    versionId: 1,
    versionName: 'V1',
    status: 1,
    statusName: '待确认',
    totalAmount: 85000,
    costTotal: 55000,
    profitAmount: 30000,
    profitRate: 54.55,
    discountAmount: 0,
    discountRate: 1,
    finalAmount: 85000,
    functionAreas: [
      {
        id: 1,
        name: '客厅',
        totalAmount: 35000,
        items: [
          { id: 1, name: '地砖铺设', quantity: 40, unit: '㎡', unitPrice: 350, totalPrice: 14000 },
          { id: 2, name: '吊顶', quantity: 40, unit: '㎡', unitPrice: 280, totalPrice: 11200 },
          { id: 3, name: '墙面处理', quantity: 120, unit: '㎡', unitPrice: 82, totalPrice: 9800 },
        ],
      },
      {
        id: 2,
        name: '卧室',
        totalAmount: 28000,
        items: [
          { id: 4, name: '地板铺设', quantity: 25, unit: '㎡', unitPrice: 420, totalPrice: 10500 },
          { id: 5, name: '衣柜', quantity: 1, unit: '组', unitPrice: 12000, totalPrice: 12000 },
          { id: 6, name: '墙面处理', quantity: 70, unit: '㎡', unitPrice: 78.57, totalPrice: 5500 },
        ],
      },
      {
        id: 3,
        name: '厨房',
        totalAmount: 22000,
        items: [
          { id: 7, name: '橱柜', quantity: 1, unit: '套', unitPrice: 15000, totalPrice: 15000 },
          { id: 8, name: '墙地砖', quantity: 30, unit: '㎡', unitPrice: 233, totalPrice: 7000 },
        ],
      },
    ],
    createBy: 'admin',
    createTime: new Date().toISOString(),
    updateBy: 'admin',
    updateTime: new Date().toISOString(),
    ...overrides,
  }
}

export const quotationHandlers = [
  // 报价单分页
  http.post('/quotation/pageQuotation.do', async ({ request }) => {
    const body = await request.json() as any
    const page = body.page ?? 1
    const size = body.size ?? 20

    const items = Array.from({ length: Math.min(size, 10) }, () =>
      createQuotation(),
    )

    return HttpResponse.json({
      code: 0,
      msg: 'ok',
      data: { list: items, count: 40, page, size },
    })
  }),

  // 报价单详情
  http.get('/quotation/queryQuotationById.do', ({ request }) => {
    const url = new URL(request.url)
    const quotationId = url.searchParams.get('quotationId') || 'QT001'

    return HttpResponse.json({
      code: 0,
      msg: 'ok',
      data: createQuotation({ quotationId }),
    })
  }),

  // 功能区列表
  http.get('/quotation/functionArea/list.do', ({ request }) => {
    const url = new URL(request.url)
    const quotationId = url.searchParams.get('quotationId') || 'QT001'

    return HttpResponse.json({
      code: 0,
      msg: 'ok',
      data: [
        { id: 1, name: '客厅', sort: 1, totalAmount: 35000 },
        { id: 2, name: '卧室', sort: 2, totalAmount: 28000 },
        { id: 3, name: '厨房', sort: 3, totalAmount: 22000 },
      ],
    })
  }),

  // 报价计算
  http.post('/quotation/calculate.do', async ({ request }) => {
    const body = await request.json() as any
    const functionAreas = body.functionAreas ?? []

    // 模拟服务端计算总价
    let totalAmount = 0
    let costTotal = 0

    for (const area of functionAreas) {
      const areaTotal = (area.items ?? []).reduce(
        (sum: number, item: any) => sum + item.quantity * item.unitPrice,
        0,
      )
      totalAmount += areaTotal
      costTotal += area.costTotal ?? areaTotal * 0.65
    }

    const profitAmount = totalAmount - costTotal
    const profitRate = costTotal > 0 ? Math.round((profitAmount / costTotal) * 10000) / 100 : 0
    const discountAmount = body.discountAmount ?? 0
    const finalAmount = Math.max(0, totalAmount - discountAmount)

    return HttpResponse.json({
      code: 0,
      msg: 'ok',
      data: {
        totalAmount,
        costTotal,
        profitAmount,
        profitRate,
        discountAmount,
        finalAmount,
      },
    })
  }),

  // 报价版本列表
  http.get('/quotation/version/list.do', ({ request }) => {
    const url = new URL(request.url)
    const orderId = url.searchParams.get('orderId') || 'ZX001'

    return HttpResponse.json({
      code: 0,
      msg: 'ok',
      data: [
        { versionId: 1, versionName: 'V1', status: 2, statusName: '已确认', createTime: '2026-04-01T10:00:00Z' },
        { versionId: 2, versionName: 'V2', status: 1, statusName: '待确认', createTime: '2026-04-10T14:30:00Z' },
        { versionId: 3, versionName: 'V3', status: 0, statusName: '草稿', createTime: '2026-04-20T09:15:00Z' },
      ],
    })
  }),
]
```

---

## 七、测试覆盖率要求

### 7.1 最低覆盖率阈值

| 层级 | 模块 | statements | branches | functions | lines |
|------|------|-----------|----------|-----------|-------|
| P0 | utils/decimal.ts | 95% | 90% | 100% | 95% |
| P0 | api/interceptor.ts | 90% | 85% | 100% | 90% |
| P0 | stores/*.ts | 80% | 70% | 85% | 80% |
| P1 | composables/**/*.ts | 75% | 65% | 80% | 75% |
| P1 | utils/*.ts (非decimal) | 70% | 60% | 75% | 70% |
| P2 | components/**/*.vue | 50% | 40% | 55% | 50% |
| - | views/**/*.vue | 不要求 | - | - | - |

### 7.2 运行覆盖率

```bash
# 全量
npx vitest run --coverage

# 单模块
npx vitest run --coverage tests/unit/utils/decimal.test.ts

# 查看报告
open coverage/index.html
```

### 7.3 CI 中覆盖率门禁

```yaml
# .github/workflows/test.yml (示例)
- name: Run unit tests with coverage
  run: npx vitest run --coverage

- name: Check coverage thresholds
  run: |
    npx vitest run --coverage --coverage.thresholds.100=false
    # P0 文件单独检查
    if [ "$(cat coverage/coverage-summary.json | jq '.total.lines.pct')" -lt 70 ]; then
      echo "Overall coverage below 70%"
      exit 1
    fi
```

---

## 八、CI/CD 集成

### 8.1 测试阶段流水线

> 文件路径：`.github/workflows/test.yml`

```yaml
# .github/workflows/test.yml — 完整 GitHub Actions 测试流水线
name: Test Pipeline

on:
  push:
    branches: [main, develop, 'feat/**', 'fix/**']
  pull_request:
    branches: [main, develop]

concurrency:
  group: test-${{ github.ref }}
  cancel-in-progress: true

env:
  NODE_VERSION: '20'
  PNPM_VERSION: '9'

jobs:
  # ──────────────────────────────────────────────
  # Job 1: 代码静态检查
  # ──────────────────────────────────────────────
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run ESLint
        run: pnpm run lint

      - name: TypeScript type check
        run: pnpm run type-check

  # ──────────────────────────────────────────────
  # Job 2: 单元 + 组件测试（含覆盖率门禁）
  # ──────────────────────────────────────────────
  unit-test:
    name: Unit & Component Tests
    runs-on: ubuntu-latest
    timeout-minutes: 10
    needs: lint
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run Vitest with coverage
        run: pnpm run test:coverage
        # vitest.config.ts 中的 coverage.thresholds 将作为门禁：
        #   branches: 80, functions: 80, lines: 80, statements: 80
        # 低于阈值时 Vitest 以非零退出码终止，流水线随之失败

      - name: Upload coverage report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
          retention-days: 14

      - name: Coverage summary
        if: always()
        run: |
          if [ -f coverage/coverage-summary.json ]; then
            echo "## Coverage Summary" >> $GITHUB_STEP_SUMMARY
            echo '```' >> $GITHUB_STEP_SUMMARY
            cat coverage/coverage-summary.json >> $GITHUB_STEP_SUMMARY
            echo '```' >> $GITHUB_STEP_SUMMARY
          fi

  # ──────────────────────────────────────────────
  # Job 3: E2E 端到端测试
  # ──────────────────────────────────────────────
  e2e-test:
    name: E2E Tests (Playwright)
    runs-on: ubuntu-latest
    timeout-minutes: 15
    needs: lint
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps chromium

      - name: Run Playwright tests
        run: pnpm run test:e2e

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7

  # ──────────────────────────────────────────────
  # Job 4: 生产构建
  # ──────────────────────────────────────────────
  build:
    name: Production Build
    runs-on: ubuntu-latest
    timeout-minutes: 10
    needs: [unit-test, e2e-test]
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Vite build
        run: pnpm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 3
```

### 8.2 package.json Scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:unit": "vitest run --dir tests/unit",
    "test:component": "vitest run --dir tests/component",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:all": "vitest run && playwright test"
  }
}
```

---

## 九、测试数据工厂

### 9.1 工厂模式

```typescript
// tests/mocks/factories/decoration.ts
import { faker } from '@faker-js/faker/locale/zh_CN'
import type { DecorationVO, DecorationListItem } from '@/api/decoration/types'

// 类型安全的字段覆盖
type Override<T, K extends keyof T> = Partial<Pick<T, K>> & Record<string, any>

function createDecoration(overrides: Override<DecorationVO, keyof DecorationVO> = {}): DecorationVO {
  const id = faker.number.int({ min: 1, max: 999999 })
  return {
    id,
    orderId: `ZX${faker.date.recent().toISOString().slice(0, 10).replace(/-/g, '')}${String(id).padStart(3, '0')}`,
    customerId: faker.number.int({ min: 1, max: 10000 }),
    customerName: faker.person.lastName() + faker.person.firstName(),
    customerPhone: faker.phone.number('138########'),
    designerId: faker.number.int({ min: 1, max: 100 }),
    designerName: faker.person.lastName() + faker.person.firstName(),
    salesmanId: faker.number.int({ min: 1, max: 100 }),
    salesmanName: faker.person.lastName() + faker.person.firstName(),
    houseId: faker.number.int({ min: 1, max: 50000 }),
    houseName: `${faker.location.buildingNumber()}栋${faker.location.secondaryAddress()}`,
    village: faker.location.streetName() + '小区',
    address: faker.location.streetAddress(),
    area: faker.number.float({ min: 50, max: 300, fractionDigits: 1 }),
    decorationType: faker.helpers.arrayElement([0, 1, 2]),
    decorationTypeName: faker.helpers.arrayElement(['半包', '整装', '全包']),
    status: faker.helpers.arrayElement([0, 1, 2, 3, 4, 5, 6, -1, -2]),
    statusName: faker.helpers.arrayElement(['待报价', '已报价', '已签约', '施工中', '已完工', '已验收', '已结算', '已作废', '已终止']),
    versionId: 1,
    versionName: 'V1',
    contractId: 0,
    payScale: 70,
    saleScale: 30,
    remark: '',
    createBy: 'admin',
    createTime: faker.date.recent().toISOString(),
    updateBy: 'admin',
    updateTime: faker.date.recent().toISOString(),
    quotationCount: faker.number.int({ min: 0, max: 5 }),
    paymentCount: faker.number.int({ min: 0, max: 10 }),
    isLocked: false,
    ...overrides,
  }
}

function createDecorationListItem(overrides = {}): DecorationListItem {
  const base = createDecoration(overrides)
  return {
    ...base,
    quotationAmount: faker.number.float({ min: 30000, max: 500000, fractionDigits: 2 }),
    receivedAmount: faker.number.float({ min: 0, max: 100000, fractionDigits: 2 }),
    balanceAmount: faker.number.float({ min: 0, max: 200000, fractionDigits: 2 }),
    activityCount: faker.number.int({ min: 0, max: 3 }),
    scheduleStatus: faker.helpers.arrayElement(['未开始', '水电阶段', '泥木阶段', '油漆阶段', '安装阶段', '软装阶段']),
    ...overrides,
  }
}

export function createDecorationFactory() {
  return {
    create: createDecoration,
    createListItem: createDecorationListItem,
    createList: (count: number) =>
      Array.from({ length: count }, () => createDecorationListItem()),
  }
}
```

### 9.2 Payment 工厂

```typescript
// tests/mocks/factories/payment.ts
import { faker } from '@faker-js/faker/locale/zh_CN'
import type { PaymentRecordVO } from '@/api/payment/types'
import { PaymentMethodType, PaymentBusinessType } from '@/api/payment/types'

function createPaymentRecord(overrides: Partial<PaymentRecordVO> = {}): PaymentRecordVO {
  const method = faker.helpers.arrayElement(Object.values(PaymentMethodType))
  return {
    id: faker.number.int({ min: 1, max: 999999 }),
    orderId: 'ZX20260401001',
    customerId: faker.number.int({ min: 1, max: 10000 }),
    customerName: faker.person.lastName() + faker.person.firstName(),
    paymentType: faker.helpers.arrayElement(Object.values(PaymentBusinessType)),
    paymentTypeName: '装修款',
    method,
    methodName: '现金',
    amount: faker.number.float({ min: 1000, max: 50000, fractionDigits: 2 }),
    actualAmount: faker.number.float({ min: 1000, max: 50000, fractionDigits: 2 }),
    operator: 'admin',
    operatorName: '管理员',
    remark: '',
    status: faker.helpers.arrayElement([0, 1, 2, 3]),
    statusName: '已确认',
    createTime: faker.date.recent().toISOString(),
    refundAmount: 0,
    ...overrides,
  }
}

export function createPaymentFactory() {
  return {
    create: createPaymentRecord,
    createList: (count: number) =>
      Array.from({ length: count }, () => createPaymentRecord()),
    createConfirmedList: (count: number, totalAmount: number) => {
      const records: PaymentRecordVO[] = []
      let remaining = totalAmount
      for (let i = 0; i < count && remaining > 0; i++) {
        const amount = Math.min(remaining, faker.number.float({ min: 1000, max: remaining, fractionDigits: 2 }))
        records.push(createPaymentRecord({ amount, actualAmount: amount, status: 1 }))
        remaining -= amount
      }
      return records
    },
  }
}
```

---

## 十、各模块测试用例清单

### 10.1 Decoration 装修模块

| 优先级 | 文件 | 用例数 | 关键用例 |
|--------|------|--------|---------|
| P0 | stores/decoration.test.ts | 12 | 状态流转, 锁定/解锁, 列表筛选 |
| P1 | composables/useDecorationList.ts | 8 | 分页加载, 排序, 条件重置 |
| P1 | component/DecorationList.test.ts | 6 | 表格渲染, 操作按钮权限 |
| P1 | component/DecorationDetail.test.ts | 5 | 信息展示, 标签页切换 |
| P2 | component/DecorationForm.test.ts | 8 | 表单校验, 字段联动 |
| P0 | e2e/create-decoration.spec.ts | 3 | 创建流程, 必填校验, 重复提交 |

### 10.2 Payment 付款模块

| 优先级 | 文件 | 用例数 | 关键用例 |
|--------|------|--------|---------|
| P0 | stores/payment.test.ts | 15 | 5种支付方式, 收款/退款, 余额计算 |
| P0 | utils/decimal.test.ts | 20 | 浮点精度, 折扣, 利润率, 格式化 |
| P1 | composables/usePayment.test.ts | 10 | 支付流程, 凭证生成, 权限检查 |
| P1 | component/PaymentWidget.test.ts | 8 | 支付方式切换, 金额校验, 表单字段 |
| P0 | e2e/collect-payment.spec.ts | 4 | 收款流程, 退款流程, 余额更新 |

### 10.3 Sales 销售模块

| 优先级 | 文件 | 用例数 | 关键用例 |
|--------|------|--------|---------|
| P1 | stores/sales.test.ts | 10 | 订单状态流转, 跟进记录 |
| P1 | composables/useCustomerSearch.test.ts | 6 | 拼音搜索, 手机号搜索 |
| P1 | component/FollowRecord.test.ts | 5 | 添加跟进, 时间校验 |
| P2 | e2e/create-order.spec.ts | 3 | 创建订单, 跟进流程 |

### 10.4 Quotation 报价模块

| 优先级 | 文件 | 用例数 | 关键用例 |
|--------|------|--------|---------|
| P0 | composables/useQuotationCalc.test.ts | 25 | 总价计算, 利润率, 优惠, 精度 |
| P1 | stores/quotation.test.ts | 15 | 版本管理, 锁定, 功能区排序 |
| P1 | component/QuotationEditor.test.ts | 10 | 功能区CRUD, 报价项增删改 |
| P1 | component/AssignRequest.test.ts | 6 | 分配/接收/转交 |
| P0 | e2e/quotation-calc.spec.ts | 3 | 计算验证, 实时更新 |

### 10.5 共享层

| 优先级 | 文件 | 用例数 | 关键用例 |
|--------|------|--------|---------|
| P0 | api/interceptor.test.ts | 6 | Token注入, 401处理, 错误分类 |
| P1 | stores/dict.test.ts | 8 | 字典加载, 缓存, fallback |
| P1 | stores/permission.test.ts | 6 | 权限判断, 菜单过滤 |
| P1 | composables/useFilterBar.test.ts | 8 | 条件增删, 重置, 分页联动 |
| P1 | composables/useCRUDTable.test.ts | 6 | 表格操作, 批量选择 |
| P2 | component/PersonSelector.test.ts | 5 | 拼音搜索, 多选 |

---

*文档生成时间: 2026-04-26*
*覆盖 单元测试 + 组件测试 + E2E 测试 + MSW Mock + 数据工厂*
*总用例数: ~200+ (单元 100+ / 组件 60+ / E2E 20)*
