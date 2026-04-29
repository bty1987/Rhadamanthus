# 全局迁移路线图 (Global Migration Roadmap)

> Rhadamanthus → view-decoration-pc 四大业务模块前端迁移总体规划

---

## 目录

1. [迁移总览](#一迁移总览)
2. [模块依赖关系](#二模块依赖关系)
3. [迁移顺序与理由](#三迁移顺序与理由)
4. [分阶段里程碑](#四分阶段里程碑)
5. [团队分工方案](#五团队分工方案)
6. [关键路径分析](#六关键路径分析)
7. [风险管控](#七风险管控)
8. [质量保障](#八质量保障)
9. [验收标准](#九验收标准)
10. [附录](#十附录)

---

## 一、迁移总览

### 1.1 项目范围

| 维度 | 数值 |
|------|------|
| 迁移模块 | Decoration (装修), Sales (销售), Payment (付款), Quotation (报价) |
| 旧项目技术栈 | jQuery 1.x + Bootstrap 3 + Java (Spring MVC) |
| 新项目技术栈 | Vue 3.5 + TypeScript 5.8 + Arco Design Vue 2.57 + Pinia 3.0 + Wujie |
| 前端文件总数 | 302 |
| 前端代码总行 | ~113,775 |
| API 端点总数 | 783 |
| 核心页面数 | ~24 (高频使用) |
| 搜索条件总数 | ~150 |
| 弹窗峰值引用 | 500+ |

### 1.2 各模块规模

```
模块规模对比 (前端代码行数)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Quotation  ████████████████████████████████████████████ 55,651  (49%)
Decoration  ████████████████████████ 26,500  (23%)
Sales       ███████████████ 16,019  (14%)
Payment     ██████████████ 15,605  (14%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                              合计: ~113,775 行
```

```
API 端点数量对比
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Quotation  ████████████████████████████████████████ 388  (50%)
Decoration  ██████████████████ 149  (19%)
Payment     ███████████████ 136  (17%)
Sales       ████████████ 110  (14%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                              合计: 783
```

### 1.3 工作量估算

| 模块 | 前端代码行 | API数 | 页面数 | 搜索条件 | 纯前端工时 (人天) | 含联调测试 (人天) |
|------|-----------|------|-------|---------|:---------------:|:---------------:|
| Decoration | ~26,500 | 149 | 6 | ~30 | 25-30 | 40-50 |
| Sales | ~16,019 | 110 | 5 | ~25 | 15-20 | 25-35 |
| Payment | ~15,605 | 136 | 5 | 31 | 15-20 | 25-35 |
| Quotation | ~55,651 | 388 | 8 | 60+ | 50-65 | 80-105 |
| **共享层** | - | - | - | - | **15-20** | **20-30** |
| **合计** | **~113,775** | **783** | **24** | **~150** | **120-155** | **190-255** |

> 注: 纯前端工时指编码实现，含联调测试包含后端对接、集成测试、BUG 修复。

---

## 二、模块依赖关系

### 2.1 前端模块依赖图

```
                    ┌─────────────────┐
                    │    共享基础层     │
                    │  API / Store /   │
                    │  Router / Dict   │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
        ┌─────┴─────┐  ┌────┴────┐  ┌──────┴──────┐
        │ Decoration │  │  Sales  │  │   Payment   │
        │  (装修)    │  │ (销售)  │  │   (付款)    │
        └─────┬──────┘  └────┬────┘  └──────┬──────┘
              │              │              │
              │         ┌────┴────┐         │
              └────────►│Quotation│◄────────┘
                        │(报价)   │
                        └─────────┘

  ──► 表示"被依赖"方向 (Quotation 依赖其他三个模块的数据)
```

### 2.2 数据流向

```
Sales (客户信息、订单创建)
  │
  ├──► Decoration (装修单，关联销售订单)
  │      │
  │      ├──► Payment (装修款、预付款、服务费)
  │      │
  │      └──► Quotation (报价单，关联装修单)
  │             │
  │             └──► Payment (报价相关费用)
  │
  └──► Payment (销售款、定金)

核心关联字段: orderId (贯穿所有模块)
```

### 2.3 共享组件依赖

| 共享资源 | 依赖模块 | 被依赖次数 |
|---------|---------|:---------:|
| FilterBar (搜索组件) | DEC, SALES, PAY, QUOT | 4 |
| CRUDTable (表格组件) | DEC, SALES, PAY, QUOT | 4 |
| useDictStore (字典) | DEC, SALES, PAY, QUOT | 4 |
| PersonSelector (人员选择) | DEC, SALES, PAY, QUOT | 4 |
| BuildingSelector (楼盘选择) | DEC, SALES, PAY, QUOT | 4 |
| usePayment (支付逻辑) | DEC, SALES, PAY | 3 |
| OrderLink (订单关联) | DEC, SALES, PAY, QUOT | 4 |
| ApprovalFlow (审批流) | DEC, PAY, QUOT | 3 |
| useQuotationCalc (报价计算) | DEC, QUOT, PAY | 3 |
| StatusTag (状态标签) | DEC, SALES, PAY, QUOT | 4 |

---

## 三、迁移顺序与理由

### 3.1 推荐顺序

```
Phase 0: 共享基础层 ────────────────────────────── [第 1-2 周]
Phase 1: Decoration (装修) ─────────────────────── [第 3-7 周]
Phase 2: Sales (销售) ──────────────────────────── [第 5-9 周]  ※ 与 Phase 1 部分并行
Phase 3: Payment (付款) ────────────────────────── [第 8-12 周]
Phase 4: Quotation (报价) ──────────────────────── [第 10-18 周] ※ 与 Phase 3 部分并行
```

### 3.2 选择理由

| 顺序 | 模块 | 理由 |
|:----:|------|------|
| 0 | 共享基础层 | 所有模块依赖 API 封装、Store、路由、字典系统，必须最先完成 |
| 1 | Decoration | 1) 复杂度中等，适合作为迁移练手 2) 被其他模块依赖 (Payment/Quotation 关联装修单) 3) 6 个核心页面，可在 5 周内完成 |
| 2 | Sales | 1) 是业务起点 (客户→订单) 2) 代码量最少 (16K) 3) 可与 Decoration 并行启动 4) Payment 依赖销售订单数据 |
| 3 | Payment | 1) 依赖 Decoration/Sales 的订单数据 2) 复杂度中等 3) 5 种付款子模块结构清晰 |
| 4 | Quotation | 1) 体量最大 (55K, 388 API) 放最后集中攻坚 2) 依赖其他三个模块的订单/付款数据 3) 双系统 (Quotation+Quotetion) 增加复杂度 |

### 3.3 备选方案

**方案 B: 按业务流程顺序** (客户路径)

```
Sales → Decoration → Quotation → Payment
```

优点: 符合客户操作流程，便于端到端测试
缺点: Payment 被延后，但实际使用频率较高

**方案 C: 按复杂度递增** (风险前置)

```
Sales (最简) → Payment (中等) → Decoration (中等) → Quotation (最复杂)
```

优点: 先易后难，团队渐进学习
缺点: Decoration 被延后，影响 Quotation 依赖

> **推荐方案 A** (上述 3.1 顺序)，平衡了依赖关系和并行效率。

---

## 四、分阶段里程碑

### Phase 0: 共享基础层 (第 1-2 周)

```
Week 1                              Week 2
├── API 封装层                       ├── FilterBar 组件开发
│   ├── request.ts                  ├── CRUDTable 组件开发
│   ├── interceptor.ts              ├── ModalManager 设计
│   └── 模块化目录结构               └── 常量/字典系统
├── Store 层                            ├── useDictStore
│   ├── useUserStore                    ├── TypeScript enum 文件
│   ├── useAppStore                     └── 字典映射 fallback
│   └── usePermissionStore          └── 共享组件
├── 路由骨架                           ├── PersonSelector
│   ├── 四大模块路由文件                ├── BuildingSelector
│   └── 路由守卫                       ├── StatusTag
└── 全局配置                           └── OrderLink
    ├── Arco Design 主题
    └── Wujie 初始化
```

**交付物:**
- [x] API 封装层可用 (`src/api/request.ts`)
- [x] 3 个核心 Store 可用 (`user`, `app`, `dict`)
- [x] 四大模块路由骨架
- [x] FilterBar + CRUDTable 组件
- [x] 常量/字典系统
- [x] 5 个基础共享组件

**验收标准:** 能在浏览器中访问四大模块的空页面骨架，API 封装层可正常请求后端。

---

### Phase 1: Decoration 装修模块 (第 3-7 周)

```
Week 3-4: 基础页面                    Week 5-6: 核心功能
├── 列表页 (decorationList)           ├── 审核功能
│   ├── FilterBar 集成               ├── 预放线 (DrawLine) 功能
│   ├── CRUDTable 集成               ├── 装修单变更
│   └── 149 API 对接                 └── 装修单进度管理
├── 详情页 (decorationDetail)         
│   ├── Tab 多标签页                  Week 7: 收尾 + 测试
│   ├── 关联信息加载                  ├── 全量功能回归测试
│   └── 审批流集成                   ├── 后端联调
└── 创建/编辑页                       ├── BUG 修复
    ├── 表单验证                      └── 交付文档
    └── 动态字段配置
```

**交付物:**
- [x] 装修单列表页 (含 30 搜索条件)
- [x] 装修单详情页 (含 Tab 切换)
- [x] 装修单创建/编辑
- [x] 审核功能
- [x] 149 API 全部对接
- [x] 装修模块专属组件

**工时分配:** 编码 25-30 人天 + 联调测试 15-20 人天

**里程碑:** 装修模块可在新系统中独立完成完整业务流程。

---

### Phase 2: Sales 销售模块 (第 5-9 周, 与 Phase 1 尾部并行)

```
Week 5-6: 基础页面                    Week 7-8: 核心功能
├── 销售列表页                        ├── 客户保护规则
├── 客户详情页                        ├── 机会管理
├── 销售创建/编辑页                   ├── 客户账户管理
└── 110 API 对接                     └── 导出功能

                                      Week 9: 收尾 + 测试
                                      ├── 全量功能回归测试
                                      ├── 后端联调
                                      └── BUG 修复 + 交付
```

**交付物:**
- [x] 销售列表页 (含 25 搜索条件)
- [x] 客户详情页
- [x] 销售单创建/编辑
- [x] 客户保护规则
- [x] 110 API 全部对接

**工时分配:** 编码 15-20 人天 + 联调测试 10-15 人天

**里程碑:** 销售模块可在新系统中完成客户→订单的完整流程。

---

### Phase 3: Payment 付款模块 (第 8-12 周)

```
Week 8-9: 预付款 + 装修款             Week 10-11: 其余子模块
├── 预付款 (advancePayment)           ├── 主材款 (materialPayment)
│   ├── 预付款列表                    ├── 销售款 (salesPayment)
│   ├── 预付款创建                    ├── 服务费 (servicePayment)
│   ├── 预付款提现 (withdraw)         ├── 定金 (activityPayment)
│   └── 预付款退款                    └── 收款 (collectPayment)
├── 装修款 (decorationPayment)        
│   ├── 装修款列表                    Week 12: 收尾 + 测试
│   ├── 装修款收款                    ├── 全量功能回归测试
│   ├── 装修款审核                    ├── 支付逻辑联调
│   └── 装修款退款                    ├── BUG 修复 + 交付
└── usePayment composable
```

**交付物:**
- [x] 7 个付款子模块列表页 (含 31 搜索条件)
- [x] 收款功能 (5 种支付方式)
- [x] 审核功能
- [x] 退款功能
- [x] usePayment composable
- [x] 136 API 全部对接

**工时分配:** 编码 15-20 人天 + 联调测试 10-15 人天

**里程碑:** 付款模块可在新系统中完成全类型收退款流程。

---

### Phase 4: Quotation 报价模块 (第 10-18 周, 与 Phase 3 部分并行)

```
Week 10-11: 基础结构 + 报价单 CRUD     Week 14-15: 扩展功能
├── 报价模块路由 (50+ 页面)           ├── 定额单 (normtion)
├── 报价单列表 (含 60+ 搜索条件)      ├── 扩展单 (extension)
├── 报价单创建/编辑                    ├── 预签单 (protation)
├── 报价版本管理                       └── 报价输出/打印
├── 报价功能区管理                     
├── 报价项管理                        Week 16-17: 高级功能 + 双系统
└── 388 API 骨架对接                  ├── 增减项管理
                                       ├── 选材单管理
Week 12-13: 报价计算引擎               ├── Quotation vs Quotetion 双系统兼容
├── useQuotationCalc composable       └── 报价审批流
├── 材料价格计算
├── 折扣计算                          Week 18: 收尾 + 全量测试
├── 管理费/设计费                      ├── 全量功能回归测试
└── 税费计算                           ├── 性能测试
                                       ├── BUG 修复 + 交付
                                       └── 迁移完成文档
```

**交付物:**
- [x] 报价单完整 CRUD
- [x] 版本管理 (V1/V2/V3)
- [x] 功能区 + 报价项管理
- [x] 报价计算引擎 (useQuotationCalc)
- [x] 增减项管理
- [x] 选材单管理
- [x] 定额单/扩展单/预签单
- [x] 双系统兼容 (Quotation + Quotetion)
- [x] 388 API 全部对接

**工时分配:** 编码 50-65 人天 + 联调测试 30-40 人天

**里程碑:** 报价模块完成，四大模块前端迁移全部完成。

---

### 总体时间线甘特图

```
         W1  W2  W3  W4  W5  W6  W7  W8  W9  W10 W11 W12 W13 W14 W15 W16 W17 W18
         ├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
Phase 0  ████████                                                     共享基础层
Phase 1          ████████████████████████                             Decoration
Phase 2                      ████████████████████                     Sales
Phase 3                                      ████████████████████    Payment
Phase 4                                          ████████████████████████████████  Quotation
                                                                          
关键节点:
  W2  ▼ 共享层完成，开始业务开发
  W7  ▼ Decoration 完成，可作为参考模板
  W9  ▼ Sales 完成，Decoration+Sales 可用
  W12 ▼ Payment 完成，三大模块可用
  W18 ▼ Quotation 完成，全量迁移完成
```

---

## 五、团队分工方案

### 5.1 三人团队方案 (推荐)

```
团队成员:  A (高级前端)  B (中级前端)  C (中级前端)
```

```
         W1  W2  W3  W4  W5  W6  W7  W8  W9  W10 W11 W12 W13 W14 W15 W16 W17 W18
         ├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
成员 A   ████████████████████████████████████████████████████████████████████████
(高级)    共享层   Decoration              Payment         Quotation (核心)
          ▲主要负责▲  ▲全部▲               ▲全部▲          ▲计算引擎+双系统▲

成员 B   ████████████████████████████████████████████████████████████████████████
(中级)    共享层    Sales                  Payment         Quotation (CRUD)
          ▲协助▲   ▲全部▲                 ▲协助▲          ▲页面+组件▲

成员 C   ████████████████████████████████████████████████████████████████████████
(中级)    共享层    Sales    测试/修复      Payment测试     Quotation (子单据)
          ▲协助▲   ▲协助▲   ▲联调▲       ▲联调+测试▲     ▲增减项/选材/定额▲
```

#### 详细分工

| 阶段 | 成员 A (高级) | 成员 B (中级) | 成员 C (中级) |
|------|-------------|-------------|-------------|
| Phase 0 (W1-2) | API 层 + Store + 路由架构 | FilterBar + CRUDTable 组件 | 共享组件 + 常量字典 |
| Phase 1 (W3-7) | Decoration 全部 | Sales 基础页面 | Sales 辅助 + 测试 |
| Phase 2 (W5-9) | Decoration 收尾 | Sales 全部 | Sales 联调 + 测试 |
| Phase 3 (W8-12) | Payment 核心逻辑 | Payment 页面 | Payment 联调 + 测试 |
| Phase 4 (W10-18) | Quotation 计算引擎 + 双系统 | Quotation 页面 + 组件 | Quotation 子单据 + 测试 |

### 5.2 两人团队方案

```
成员:  A (高级前端)  B (中级前端)
```

| 阶段 | 成员 A | 成员 B | 周期 |
|------|--------|--------|------|
| Phase 0 | API + Store + 路由 | 组件 + 常量 | W1-2 |
| Phase 1 | Decoration 全部 | Sales 全部 | W3-9 |
| Phase 2 | Payment 全部 | Quotation 基础页面 | W10-16 |
| Phase 3 | Quotation 核心 + 双系统 | Quotation 子单据 + 测试 | W17-24 |

> 两人方案总周期约 24 周 (6 个月)，比三人方案延长 6 周。

### 5.3 一人团队方案

```
成员:  1 名全栈前端
```

| 阶段 | 周期 | 累计 |
|------|------|------|
| Phase 0: 共享基础层 | 2 周 | 2 周 |
| Phase 1: Decoration | 7 周 | 9 周 |
| Phase 2: Sales | 5 周 | 14 周 |
| Phase 3: Payment | 5 周 | 19 周 |
| Phase 4: Quotation | 12 周 | 31 周 |

> 一人方案总周期约 31 周 (7.5 个月)。建议至少 2 人，以减少疲劳和单点风险。

---

## 六、关键路径分析

### 6.1 关键路径 (Critical Path)

```
共享基础层 → Decoration → Payment → Quotation (计算引擎)
     2周        5周         5周         9周
```

**总关键路径: 21 周 (三人团队) / 24 周 (两人团队) / 31 周 (一人)**

### 6.2 可并行的任务

| 并行组合 | 重叠周数 | 前提条件 |
|---------|:-------:|---------|
| Decoration + Sales | 5 周 (W5-9) | 共享层完成 |
| Payment + Quotation 基础 | 5 周 (W10-14) | Sales 完成 |
| Payment 联调 + Quotation 开发 | 3 周 (W13-15) | Payment 核心逻辑完成 |

### 6.3 关键依赖与阻塞点

```
阻塞点 1: 共享基础层未完成 → 所有业务模块无法启动
  风险: 低 (2周内完成)
  应对: 优先完成 API 层和 Store，组件可后续补充

阻塞点 2: Decoration 未完成 → Quotation 无法关联装修单
  风险: 中 (Quotation 开发被延后)
  应对: Quotation 先开发独立功能，用 mock 数据

阻塞点 3: 后端 API 未就绪 → 前端无法联调
  风险: 高 (后端可能有自己的迁移/改造工作)
  应对: 使用 MSW (Mock Service Worker) 前端独立开发

阻塞点 4: Quotation 双系统 (Quotation + Quotetion) 理解偏差
  风险: 高 (双系统逻辑复杂，1925行工具函数)
  应对: 提前安排代码审查和知识分享会
```

---

## 七、风险管控

### 7.1 风险矩阵

| 风险 | 概率 | 影响 | 等级 | 应对措施 |
|------|:----:|:----:|:----:|---------|
| 后端 API 变更或延期 | 高 | 高 | **P0** | MSW mock + 前后端契约文档 |
| Quotation 双系统理解偏差 | 高 | 高 | **P0** | 提前代码审查 + 知识分享 |
| 共享组件设计不合理 | 中 | 高 | **P1** | 先做 Decoration 试点再推广 |
| 团队成员变动 | 中 | 高 | **P1** | 文档先行 + 知识共享 |
| 性能问题 (大型表格/复杂表单) | 中 | 中 | **P2** | 早期性能测试 + 虚拟滚动 |
| Wujie 微前端集成问题 | 低 | 中 | **P2** | 预留 1 周缓冲期 |
| 设计稿/交互变更 | 低 | 低 | **P3** | 使用 Arco Design 减少自定义 |

### 7.2 风险应对详情

**P0: 后端 API 变更或延期**

```
应对策略:
1. 前端使用 MSW (Mock Service Worker) 独立开发
2. 编写 API 契约文档，前后端各持一份
3. 每周同步会确认 API 变更
4. API 命名和参数格式以新项目为准

Mock 示例:
// src/mocks/handlers/decoration.ts
import { http, HttpResponse } from 'msw'
export const handlers = [
  http.get('/api/decoration/pageDecoration', () => {
    return HttpResponse.json({ code: 0, data: { list: mockDecorationList, count: 100 } })
  }),
]
```

**P0: Quotation 双系统理解偏差**

```
应对策略:
1. Phase 1 期间安排 Quotation 代码审查 (1-2天)
2. 编写 Quotation vs Quotetion 差异对照表
3. 邀请后端开发讲解双系统业务逻辑
4. quotationUtils.js 1925行逐函数拆解文档
```

**P1: 共享组件设计不合理**

```
应对策略:
1. 共享组件先在 Decoration 模块中验证
2. 验证通过后再推广到其他模块
3. 预留重构缓冲期 (每个 Phase 尾部 2 天)
4. 组件设计遵循 "最小可用" 原则
```

### 7.3 缓冲期规划

```
总规划 18 周 (三人方案):
  有效开发: 16 周
  缓冲时间: 2 周 (11%)

缓冲分布:
  Phase 0 尾部: 2 天 (共享组件调整)
  Phase 1 尾部: 3 天 (Decoration 反馈修正)
  Phase 2 尾部: 2 天 (Sales 快速收尾)
  Phase 3 尾部: 2 天 (Payment 联调缓冲)
  Phase 4 尾部: 3 天 (Quotation 复杂度缓冲)
```

---

## 八、质量保障

### 8.1 代码质量

| 保障措施 | 工具 | 频率 |
|---------|------|------|
| TypeScript 类型检查 | tsc --noEmit | 每次提交 |
| ESLint 代码规范 | eslint + @arco-design/eslint-config | 每次提交 |
| 代码格式化 | prettier | 每次提交 |
| Git 提交规范 | commitlint + husky | 每次提交 |
| 代码审查 | GitHub Pull Request | 每个 Feature |

### 8.2 测试策略

```
                     测试金字塔
                     ─────────
                        /\
                       /  \        E2E 测试 (Playwright)
                      / E2E\       关键业务流程: 5-10 条
                     /──────\
                    /        \     集成测试 (Vitest)
                   /  集成测试 \   API 调用 + Store + 组件交互
                  /────────────\
                 /              \  单元测试 (Vitest)
                /    单元测试     \ composable + utils + 常量映射
               /──────────────────\
```

| 测试类型 | 覆盖范围 | 目标覆盖率 | 优先覆盖 |
|---------|---------|:---------:|---------|
| 单元测试 | composable, utils, 常量 | 80%+ | usePayment, useQuotationCalc, 字典映射 |
| 组件测试 | 共享组件 | 60%+ | FilterBar, CRUDTable, ModalManager |
| 集成测试 | 模块核心流程 | 50%+ | 列表搜索、创建编辑、审核 |
| E2E 测试 | 关键业务路径 | 核心流程 | 创建装修单、收款、报价计算 |

### 8.3 测试示例

```typescript
// src/composables/business/__tests__/useQuotationCalc.test.ts
import { describe, it, expect } from 'vitest'
import { useQuotationCalc } from '../useQuotationCalc'

describe('useQuotationCalc', () => {
  it('计算单个报价项价格', () => {
    const { calcItemPrice } = useQuotationCalc()
    const item = { qiId: 1, name: 'test', unit: 'm²', quantity: 10, unitPrice: 100, discount: 0.9 }
    expect(calcItemPrice(item)).toBe(900)
  })

  it('计算功能区总价', () => {
    const { calcAreaTotal } = useQuotationCalc()
    const area = {
      faId: 1, name: '客厅',
      items: [
        { qiId: 1, name: '地板', unit: 'm²', quantity: 30, unitPrice: 80, discount: 1 },
        { qiId: 2, name: '墙面', unit: 'm²', quantity: 50, unitPrice: 40, discount: 0.95 },
      ],
    }
    expect(calcAreaTotal(area)).toBe(2400 + 1900)
  })

  it('计算含税总价', () => {
    const { summary, functionAreas } = useQuotationCalc()
    functionAreas.value = [{
      faId: 1, name: '客厅',
      items: [{ qiId: 1, name: '地板', unit: 'm²', quantity: 10, unitPrice: 100, discount: 1 }],
    }]
    // subtotal = 1000, managementFee(8%) = 80, taxRate(6%) on 1080 = 64.8
    // grandTotal = 1080 + 64.8 = 1144.8
    expect(summary.value.grandTotal).toBe(1144.8)
  })
})
```

---

## 九、验收标准

### 9.1 模块级验收

每个模块完成后需满足以下标准：

| 验收项 | 标准 | 验证方式 |
|--------|------|---------|
| 功能完整性 | 所有旧系统功能均已迁移 | 功能对照表逐项检查 |
| API 对接 | 所有 API 端点已对接且返回正确 | 网络请求对比 |
| 搜索筛选 | 所有搜索条件可用 | 逐一测试 |
| 表单验证 | 所有验证规则与旧系统一致 | 边界值测试 |
| 弹窗交互 | 所有弹窗正常打开/关闭/返回数据 | 交互测试 |
| 状态流转 | 业务状态流转与旧系统一致 | 端到端测试 |
| 权限控制 | 按钮级别权限正确 | 多角色测试 |
| 数据导出 | 导出格式与旧系统一致 | 文件对比 |
| 打印功能 | 打印输出与旧系统一致 (如有) | 打印对比 |
| 性能 | 首屏 < 3s, 表格渲染 < 1s | Lighthouse |

### 9.2 全局验收

| 验收项 | 标准 |
|--------|------|
| 四大模块全部通过模块级验收 | 100% |
| 跨模块数据关联正确 (orderId) | 装修单→报价→付款→收款 完整流程 |
| 微应用通信正常 | CRM/Member 子应用集成无异常 |
| TypeScript 无 any | `tsc --noEmit` 零错误 |
| 单元测试通过 | 覆盖率 ≥ 80% (composable/utils) |
| E2E 测试通过 | 核心业务流程 5+ 条 |
| 无 console.error | 生产构建无运行时错误 |
| Lighthouse 性能 | Performance ≥ 80 |

### 9.3 验收流程

```
模块开发完成
    │
    ├──► 自测 (开发者) ─── 功能对照表逐项检查
    │
    ├──► Code Review (团队) ─── PR 审查 + 设计一致性
    │
    ├──► 联调测试 (QA) ─── 端到端业务流程测试
    │
    ├──► 性能测试 ─── Lighthouse + 大数据量测试
    │
    └──► 验收签字 ─── 产品 + 技术负责人确认
```

---

## 十、附录

### 附录 A: 旧项目关键文件清单

```
Rhadamanthus/
├── decoration/                        # 装修模块
│   ├── index.html                     # 入口页
│   ├── decorationIndex.html           # 装修列表
│   ├── decorationDetail.html          # 装修详情 (核心页面)
│   ├── decorationCheck.html           # 装修审核
│   ├── decorationDesign.html          # 设计管理
│   ├── drawLineIndex.html             # 预放线
│   ├── js/
│   │   ├── decorationUtils.js         # 装修工具函数
│   │   ├── drawLineUtils.js           # 预放线工具
│   │   └── decoration.js              # 装修主逻辑
│   ├── api/decorationApi.js           # 149 API
│   └── condition/decorationCond.js    # ~30 搜索条件
│
├── sales/                             # 销售模块
│   ├── customerIndex.html             # 客户列表
│   ├── customerDetail.html            # 客户详情
│   ├── customerChanceIndex.html       # 机会列表
│   ├── salesIndex.html                # 销售列表
│   ├── js/
│   │   ├── customerUtils.js           # 客户工具
│   │   ├── customerChanceUtils.js     # 机会工具
│   │   └── salesUtils.js              # 销售工具
│   ├── api/salesApi.js                # 110 API
│   └── condition/salesCond.js         # ~25 搜索条件
│
├── payment/                           # 付款模块
│   ├── advancePaymentIndex.html       # 预付款列表
│   ├── decorationPaymentIndex.html    # 装修款列表
│   ├── materialPaymentIndex.html      # 主材款列表
│   ├── salesPaymentIndex.html         # 销售款列表
│   ├── servicePaymentIndex.html       # 服务费列表
│   ├── js/paymentUtils.js             # 1197 行
│   ├── api/paymentApi.js              # 136 API
│   └── condition/paymentCond.js       # 31 搜索条件
│
├── quotation/                         # 报价模块 (最大)
│   ├── quotationIndex.html            # 报价列表
│   ├── quotationDetail.html           # 报价详情 (核心, 峰值180弹窗)
│   ├── addReduceIndex.html            # 增减项
│   ├── selectionIndex.html            # 选材单
│   ├── normtionIndex.html             # 定额单
│   ├── extensionIndex.html            # 扩展单
│   ├── protationIndex.html            # 预签单
│   ├── js/
│   │   ├── quotationUtils.js          # 1925 行
│   │   ├── addReduceUtils.js
│   │   ├── selectionUtils.js
│   │   └── normtionUtils.js
│   ├── api/quotationApi.js            # 388 API
│   └── condition/quotationCond.js     # 60+ 搜索条件
│
├── common/                            # 共享代码
│   ├── com.js                         # 核心工具 (com.post/popup4page/validator)
│   ├── Searcher.js                    # 搜索组件
│   ├── constant.js                    # 常量系统 (~60 子分组)
│   ├── paymentUtils.js                # 支付工具 (跨模块共享)
│   ├── drawNode.js                    # 动态页面配置
│   └── formatter.js                   # 格式化函数
```

### 附录 B: 技术栈对照表

| 维度 | 旧项目 | 新项目 |
|------|--------|--------|
| 框架 | jQuery 1.x | Vue 3.5 (Composition API) |
| 语言 | JavaScript (ES5/ES6) | TypeScript 5.8 |
| UI 库 | Bootstrap 3 | Arco Design Vue 2.57 |
| 状态管理 | window 变量 / 闭包 | Pinia 3.0 |
| 路由 | 多页面 + iframe | Vue Router 4 |
| HTTP | jQuery.ajax (com.post) | Axios + 拦截器 |
| 构建 | 无 / 手动 | Vite 6.x |
| 代码质量 | 无 | ESLint + Prettier + TypeScript |
| 测试 | 无 | Vitest + Playwright |
| 微前端 | 无 | Wujie |
| 包管理 | 手动复制 | npm / pnpm |
| 版本控制 | SVN / Git 基础 | Git + 分支策略 |
| CI/CD | 无 | GitHub Actions / Jenkins |

### 附录 C: 命名约定

```
文件命名:
  页面:     kebab-case    decoration-detail.vue
  组件:     PascalCase    FilterBar/index.vue
  Composable: camelCase   usePayment.ts
  Store:    camelCase     useDictStore.ts
  API:      camelCase     pageDecoration.ts
  常量:     camelCase     decoration.ts
  类型:     PascalCase    IDecorationView

变量命名:
  接口:     I 前缀        IDecorationView
  枚举:     PascalCase    DecorationStatus
  枚举值:   UPPER_SNAKE   IN_PROGRESS
  ref:      camelCase     tableData
  事件处理: handle 前缀   handleSubmit
  布尔值:   is/has/can    isLoading, hasPermission
```

### 附录 D: Git 分支策略

```
main ─────────────────────────────────────────── 稳定分支
  │
  ├── develop ──────────────────────────────── 开发分支
  │     │
  │     ├── feature/shared-base ─────── 共享基础层
  │     ├── feature/decoration ──────── 装修模块
  │     ├── feature/sales ──────────── 销售模块
  │     ├── feature/payment ────────── 付款模块
  │     └── feature/quotation ──────── 报价模块
  │
  ├── release/v1.0 ──────────────────── 发布分支
  │
  └── hotfix/* ───────────────────────── 紧急修复
```

### 附录 E: 每日站会模板

```
每日站会 (15分钟)

1. 昨天完成了什么?
   - [具体任务 + 进度百分比]

2. 今天计划做什么?
   - [具体任务 + 预计完成时间]

3. 有什么阻塞?
   - [阻塞项 + 需要谁的帮助]

4. API 变更同步
   - [新变更/废弃/参数调整]
```

---

> 文档版本: v1.0 | 适用范围: decoration / sales / payment / quotation 全局迁移规划
> 总预估工期: 三人团队 18 周 / 两人团队 24 周 / 一人 31 周
