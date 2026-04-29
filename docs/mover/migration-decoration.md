# 装饰(Decoration)模块迁移文档

> 从 Rhadamanthus (jQuery/Bootstrap) → view-decoration-pc (Vue 3 + TypeScript + Arco Design)

---

## 一、概述

### 1.1 迁移范围

将 R 项目中的 **decoration（装修/装饰）** 模块完整迁移到新业务平台 view-decoration-pc，作为后续所有模块迁移的参考案例。

### 1.2 源模块规模

| 类别 | 文件数 | 代码行数 | 说明 |
|------|--------|----------|------|
| HTML 页面 | 25 | 5,528 | `WebContent/views/decoration/*.html` |
| JS 业务逻辑 | 25 | 14,050 | `WebContent/js/decoration/*.js` |
| JS 共享工具 | 7 | 6,953 | decorationPageUtils / decorationUtils / materialUtils / quotationUtils / kingdeeUtils / houseUtils / approvalUtils |
| API 定义 | 1 | ~300 | `WebContent/js/api/decoration.js` (149 个 .do 端点) |
| **合计** | **57** | **~26,500** | |

### 1.3 技术栈对照

| 维度 | 旧项目 (Rhadamanthus) | 新项目 (view-decoration-pc) |
|------|----------------------|---------------------------|
| 框架 | jQuery 1.x + Bootstrap 3 | Vue 3.5 + TypeScript 5.8 |
| UI 库 | Bootstrap Modal / Dropdown / Tab | Arco Design Vue 2.57 |
| 构建 | 无 (直接引入) | Vite 6.2 |
| 状态管理 | 全局变量 + DOM 操作 | Pinia 3.0 |
| 路由 | 无 (多页面 + iframe) | Vue Router 4.5 |
| HTTP | `com.post()` (jQuery.ajax 封装) | Axios + interceptor.ts |
| 包管理 | script 标签 | pnpm |
| 微前端 | 无 | Wujie (CRM:2001, Member:2002) |
| 认证 | Cookie + Session | Bearer Token + 自动刷新 |

---

### 1.4 核心业务流程

装修单（Decoration）是整个装修模块的核心实体，其生命周期覆盖了从创建到归档的完整业务闭环。
下图描述了装修单的主状态流转及其关联的子流程：

```mermaid
stateDiagram-v2
    [*] --> 创建: 创建装修单

    创建 --> 待分配: 提交审核
    待分配 --> 已分配: 分配装修人员
    已分配 --> 施工中: 开始施工
    施工中 --> 竣工: 施工完成
    竣工 --> 决算: 提交决算
    决算 --> 归档: 审核通过

    %% 回退路径
    已分配 --> 待分配: 取消分配
    施工中 --> 已分配: 暂停施工

    %% 子流程（平行状态）
    state 已分配 {
        [*] --> 量房
        量房 --> 合同签订: 量房完成
        合同签订 --> [*]: 合同生效
    }

    state 施工中 {
        [*] --> 装修活动管理
        装修活动管理 --> 图片管理: 上传施工图片
        图片管理 --> 装修活动管理: 继续施工
    }

    state 决算 {
        [*] --> 装修决算
        装修决算 --> [*]: 决算完成
    }

    note right of 创建 : 状态: init
    note right of 待分配 : 状态: pending
    note right of 已分配 : 状态: assigned
    note right of 施工中 : 状态: in_construction
    note right of 竣工 : 状态: completed
    note right of 决算 : 状态: accounted
    note right of 归档 : 状态: archived
```

**子流程说明：**

| 子流程 | 说明 |
|--------|------|
| 装修人员分配 | 将待分配的装修单指派给具体装修团队/人员 |
| 装修活动管理 | 施工期间的工程进度记录与施工活动管理 |
| 装修合同签订 | 量房完成后签订正式装修合同 |
| 装修决算 | 竣工后进行费用核算与决算 |
| 量房 | 上门实地测量房屋尺寸 |
| 图片管理 | 施工过程图片上传、分类与管理 |

---

### 1.5 路由配置引用

> 装饰(Decoration)模块在新项目中的路由与权限配置规范。

| 配置项 | 值 |
|--------|-----|
| **路径前缀** | `/decoration` |
| **权限前缀** | `decoration:` |

**路由定义参考：**

```typescript
// src/router/modules/decoration.ts
import type { RouteRecordRaw } from 'vue-router'

const decorationRoutes: RouteRecordRaw[] = [
  {
    path: '/decoration',
    name: 'DecorationRoot',
    meta: { title: '装修管理', icon: 'icon-tool', authPrefix: 'decoration:' },
    children: [
      {
        path: 'list',
        name: 'DecorationList',
        component: () => import('@/views/decoration/DecorationList.vue'),
        meta: { title: '装修单列表', auth: 'decoration:list' },
      },
      {
        path: 'create',
        name: 'DecorationCreate',
        component: () => import('@/views/decoration/DecorationCreate.vue'),
        meta: { title: '创建装修单', auth: 'decoration:create' },
      },
      {
        path: 'detail/:orderId',
        name: 'DecorationDetail',
        component: () => import('@/views/decoration/DecorationDetail.vue'),
        meta: { title: '装修单详情', auth: 'decoration:detail' },
      },
      {
        path: 'account',
        name: 'DecorationAccount',
        component: () => import('@/views/decoration/DecorationAccount.vue'),
        meta: { title: '装修决算', auth: 'decoration:account' },
      },
      {
        path: 'activity',
        name: 'DecorationActivity',
        component: () => import('@/views/decoration/DecorationActivity.vue'),
        meta: { title: '装修活动', auth: 'decoration:activity' },
      },
      {
        path: 'contract',
        name: 'DecorationContract',
        component: () => import('@/views/decoration/DecorationContract.vue'),
        meta: { title: '装修合同', auth: 'decoration:contract' },
      },
      {
        path: 'measure',
        name: 'DecorationMeasure',
        component: () => import('@/views/decoration/DecorationMeasure.vue'),
        meta: { title: '装修量房', auth: 'decoration:measure' },
      },
      {
        path: 'picture',
        name: 'DecorationPicture',
        component: () => import('@/views/decoration/DecorationPicture.vue'),
        meta: { title: '装修图片', auth: 'decoration:picture' },
      },
      {
        path: 'belong',
        name: 'DecorationBelong',
        component: () => import('@/views/decoration/DecorationBelong.vue'),
        meta: { title: '装修归属', auth: 'decoration:belong' },
      },
      {
        path: 'service',
        name: 'DecorationService',
        component: () => import('@/views/decoration/DecorationService.vue'),
        meta: { title: '装修服务', auth: 'decoration:service' },
      },
      {
        path: 'holonomy',
        name: 'DecorationHolonomy',
        component: () => import('@/views/decoration/DecorationHolonomy.vue'),
        meta: { title: '全包', auth: 'decoration:holonomy' },
      },
      {
        path: 'inclusive',
        name: 'DecorationInclusive',
        component: () => import('@/views/decoration/DecorationInclusive.vue'),
        meta: { title: '半包', auth: 'decoration:inclusive' },
      },
      {
        path: 'midpack',
        name: 'DecorationMidpack',
        component: () => import('@/views/decoration/DecorationMidpack.vue'),
        meta: { title: '中包', auth: 'decoration:midpack' },
      },
    ],
  },
]

export default decorationRoutes
```

**权限标识规则：** `{authPrefix}{子模块}:{操作}`，例如：
- `decoration:list` — 装修单列表
- `decoration:create` — 创建装修单
- `decoration:detail` — 查看装修单详情
- `decoration:account:check` — 决算审核
- `decoration:contract:sign` — 合同签约
- `decoration:measure:apply` — 申请量房
- `decoration:activity:add` — 新增装修活动

---

## 二、API 清单 (149 个端点)

### 2.1 按功能域分组

#### 装修单 CRUD (Decoration Order)

| API 端点 (.do) | 用途 |
|----------------|------|
| `createDecoration.do` | 创建装修单 |
| `createDecorationForAdvance.do` | 创建预付款装修单 |
| `queryDecorationByOrderId.do` | 按订单ID查询 |
| `queryDecorationByDoid.do` | 按装修ID查询 |
| `queryDecorationByCustomerId.do` | 按客户ID查询 |
| `queryDecorationInfoByOrderId.do` | 查询装修信息 |
| `queryDecorationInfoForCustomer.do` | 客户端装修信息 |
| `queryDecorationForCommonByOrderId.do` | 公共装修信息查询 |
| `queryDecorationForReferByOrderId.do` | 引用查询 |
| `queryDecorationConfig.do` | 查询装修配置 |
| `queryDecorationFunction.do` | 查询装修功能项 |
| `queryDecorationFunctionByName.do` | 按名称查询功能项 |
| `queryDecorationSchedule.do` | 查询装修进度 |
| `checkDecoration.do` | 审核装修单 |
| `confirmDecorationInfo.do` | 确认装修信息 |
| `referDecorationInfo.do` | 引用装修信息 |
| `deleteReferDecorationInfo.do` | 删除引用 |
| `hiddenDecoration.do` | 隐藏装修单 |
| `obsoleteDecoration.do` | 作废装修单 |
| `terminalDecoration.do` | 终止装修单 |

#### 装修单分页查询 (14 个 page 端点)

| API 端点 (.do) | 用途 |
|----------------|------|
| `pageDecoration.do` | 通用分页 |
| `pageDecorationForBalance.do` | 决算视角 |
| `pageDecorationForBelong.do` | 归属视角 |
| `pageDecorationForCommon.do` | 公共视角 |
| `pageDecorationForCompany.do` | 公司视角 |
| `pageDecorationForCustomer.do` | 客户视角 |
| `pageDecorationForDesigner.do` | 设计师视角 |
| `pageDecorationForDesignerDept.do` | 设计部视角 |
| `pageDecorationForDesignerManager.do` | 设计经理视角 |
| `pageDecorationForEscorter.do` | 陪护人视角 |
| `pageDecorationForGeneral.do` | 综合视角 |
| `pageDecorationForGrade.do` | 评分视角 |
| `pageDecorationForMaterialer.do` | 材料员视角 |
| `pageDecorationForQuoter.do` | 报价员视角 |
| `pageDecorationForSalesman.do` | 销售员视角 |
| `pageDecorationForSalesmanDept.do` | 销售部视角 |
| `pageDecorationForSalesmanManager.do` | 销售经理视角 |
| `pageDecorationForUser.do` | 用户视角 |

#### 装修单变更操作

| API 端点 (.do) | 用途 |
|----------------|------|
| `changeDecorationForAdvance.do` | 变更预付款 |
| `changeDecorationForCustomer.do` | 变更客户 |
| `changeDecorationForHouse.do` | 变更房源 |
| `changeDecorationForOrderId.do` | 变更订单号 |
| `changeDecorationForPayScale.do` | 变更付款比例 |
| `changeDecorationForRepairStatus.do` | 变更修缮状态 |
| `changeDecorationForStatus.do` | 变更状态 |
| `changeDecorationForTime.do` | 变更时间 |
| `changeDecorationForVersionId.do` | 变更版本 |
| `subDecorationForQuotationTime.do` | 提交报价时间 |

#### 装修人员 (DecorationUser)

| API 端点 (.do) | 用途 |
|----------------|------|
| `addDecorationUser.do` | 添加装修人员 |
| `deleteDecorationUser.do` | 删除装修人员 |
| `queryDecorationUser.do` | 查询装修人员 |
| `updateDecorationUser.do` | 更新装修人员 |

#### 装修活动 (DecorationActivity)

| API 端点 (.do) | 用途 |
|----------------|------|
| `addDecorationActivity.do` | 创建活动 |
| `addDecorationActivityItem.do` | 创建活动项 |
| `addDecorationActivityRecord.do` | 创建活动记录 |
| `queryDecorationActivityByOrderId.do` | 按订单查询活动 |
| `queryDecorationActivityItem.do` | 查询活动项 |
| `queryDecorationActivityRecord.do` | 查询活动记录 |
| `deleteDecorationActivity.do` | 删除活动 |
| `amountDecorationActivity.do` | 活动金额计算 |
| `amountDecorationActivityItem.do` | 活动项金额计算 |
| `lockDecorationActivity.do` | 锁定活动 |
| `unlockDecorationActivity.do` | 解锁活动 |
| `abateDecorationActivityItem.do` | 活动项失效 |
| `affirmDecorationActivityItem.do` | 确认活动项 |
| `consumeDecorationActivityItem.do` | 消耗活动项 |
| `deliveDecorationActivityItem.do` | 发放活动项 |
| `discountDecorationActivityItem.do` | 折扣活动项 |
| `expendDecorationActivityItem.do` | 支出活动项 |
| `pointDecorationActivityItem.do` | 指向活动项 |
| `receiveDecorationActivityItem.do` | 接收活动项 |
| `refundDecorationActivityItem.do` | 退款活动项 |
| `unrefundDecorationActivityItem.do` | 取消退款 |
| `sendDecorationActivityItem.do` | 发送活动项 |

#### 装修合同 (DecorationContract)

| API 端点 (.do) | 用途 |
|----------------|------|
| `addDecorationContract.do` | 创建合同 |
| `queryDecorationContract.do` | 查询合同 |
| `queryDecorationContractByOrderId.do` | 按订单查询合同 |
| `queryDecorationContractRecord.do` | 合同记录 |
| `updateDecorationContract.do` | 更新合同 |
| `saveDecorationContract.do` | 保存合同 |
| `makeDecorationContract.do` | 生成合同 |
| `signDecorationContract.do` | 签约 |
| `signDecorationContractForCompany.do` | 公司签约 |
| `signDecorationContractForCustomer.do` | 客户签约 |
| `presignDecorationContract.do` | 预签约 |
| `resignDecorationContract.do` | 重签约 |
| `filingDecorationContract.do` | 归档 |
| `expireDecorationContract.do` | 到期处理 |
| `affixDecorationContract.do` | 附件处理 |
| `noticeDecorationContract.do` | 通知 |
| `redirectDecorationContract.do` | 重定向 |
| `sendDecorationContract.do` | 发送合同 |
| `sendDecorationContractForAuth.do` | 发送授权 |
| `showDecorationContract.do` | 展示合同 |
| `viewDecorationContract.do` | 查看合同 |

#### 装修量房 (DecorationMeasure)

| API 端点 (.do) | 用途 |
|----------------|------|
| `applayDecorationMeasure.do` | 申请量房 |
| `pageDecorationMeasure.do` | 量房分页列表 |
| `pageDecorationMeasureForApplay.do` | 申请量房列表 |
| `queryDecorationMeasure.do` | 查询量房 |
| `updateDecorationMeasure.do` | 更新量房 |
| `failureDecorationMeasure.do` | 量房失败处理 |

#### 装修决算 (DecorationAccount)

| API 端点 (.do) | 用途 |
|----------------|------|
| `makeDecorationAccount.do` | 生成决算 |
| `queryDecorationAccount.do` | 查询决算 |
| `sendDecorationAccount.do` | 发送决算 |
| `affirmDecorationAccount.do` | 确认决算 |
| `updateDecorationAccount.do` | 更新决算 |

#### 装修图片 (DecorationPicture)

| API 端点 (.do) | 用途 |
|----------------|------|
| `addDecorationPicture.do` | 上传图片 |
| `batchDecorationPicture.do` | 批量上传 |
| `deleteDecorationPicture.do` | 删除图片 |
| `downloadDecorationPicture.do` | 下载图片 |
| `queryDecorationPictureByOrderId.do` | 按订单查询图片 |

#### 装修服务 (DecorationService)

| API 端点 (.do) | 用途 |
|----------------|------|
| `addDecorationService.do` | 添加服务 |
| `completeDecorationService.do` | 完成服务 |
| `pageDecorationService.do` | 服务分页 |
| `queryDecorationServiceByOrderId.do` | 按订单查询服务 |

#### 装修半包/整装/全包

| API 端点 (.do) | 用途 |
|----------------|------|
| `makeDecorationHolonomy.do` | 生成全包 |
| `queryDecorationHolonomy.do` | 查询全包 |
| `updateDecorationHolonomy.do` | 更新全包 |
| `pageDecorationHolonomy.do` | 全包分页 |
| `makeDecorationInclusive.do` | 生成半包 |
| `queryDecorationInclusive.do` | 查询半包 |
| `pageDecorationInclusive.do` | 半包分页 |
| `makeDecorationMidpack.do` | 生成中包 |
| `queryDecorationMidpack.do` | 查询中包 |
| `updateDecorationMidpack.do` | 更新中包 |

#### 装修归属 (DecorationBelong)

| API 端点 (.do) | 用途 |
|----------------|------|
| `queryDecorationBelong.do` | 查询归属 |
| `tranDecorationBelong.do` | 转移归属 |

#### 其他

| API 端点 (.do) | 用途 |
|----------------|------|
| `queryDecorationAdditionByOrderId.do` | 查询附加信息 |
| `queryDecorationAtttypeByType.do` | 按类型查询附件类型 |
| `queryDecorationBalance.do` | 查询结算 |
| `makeDecorationBalance.do` | 生成结算 |
| `updateDecorationForAdvance.do` | 更新预付款 |
| `updateDecorationForPayScale.do` | 更新付款比例 |
| `updateDecorationForSaleScale.do` | 更新销售比例 |
| `addDecorationService.do` | 添加装修服务 |
| `exportDecorationByContractTime.do` | 按合同时间导出 |

---

## 三、页面级分析

### 3.1 页面清单与复杂度

按 JS 代码行数从高到低排列：

| # | HTML 页面 | JS 文件 | JS行数 | Modals | APIs | Searcher | 复杂度 | 预估天数 |
|---|----------|---------|--------|--------|------|----------|--------|----------|
| 1 | decoration.html | decoration.js | 2,815 | 12 | 57 | 是 | **核心** | 5-7 |
| 2 | decoration4detail.html | decoration4detail.js | 2,176 | 16 | 55 | 否 | **核心** | 5-7 |
| 3 | decoration4account.html | decoration4account.js | 1,670 | 2 | 16 | 否 | **高** | 3-4 |
| 4 | decoration4activity.html | decoration4activity.js | 927 | 0 | ~20 | 否 | 中 | 2-3 |
| 5 | decorationContract.html | decorationContract.js | 936 | 4 | 16 | 是 | 中 | 2-3 |
| 6 | decoration2create.html | decoration2create.js | 651 | 0 | ~10 | 否 | 低 | 1-2 |
| 7 | decorationMeasure.html | decorationMeasure.js | 560 | 0 | 10 | 是 | 低 | 1-2 |
| 8 | audit4record.html | audit4record.js | 560 | 0 | ~8 | 否 | 低 | 1-2 |
| 9 | decorationPicture.html | decorationPicture.js | 507 | 0 | 5 | 是 | 低 | 1 |
| 10 | decorationActivityRecord.html | decorationActivityRecord.js | 462 | 0 | 5 | 是 | 低 | 1 |
| 11 | decorationMeasure4apply.html | decorationMeasure4apply.js | 456 | 0 | 8 | 是 | 低 | 1 |
| 12 | decorationMeasure4setup.html | decorationMeasure4setup.js | 430 | 0 | 8 | 是 | 低 | 1 |
| 13 | decoration4belong.html | decoration4belong.js | 380 | 0 | 5 | 是 | 低 | 1 |
| 14 | decoration4refer.html | decoration4refer.js | 360 | 0 | 5 | 是 | 低 | 1 |
| 15 | decorationContract2create.html | decorationContract2create.js | 350 | 0 | 8 | 否 | 低 | 1 |
| 16 | decorationService.html | decorationService.js | 300 | 0 | 5 | 是 | 低 | 1 |
| 17 | decoration4common.html | decoration4common.js | 280 | 0 | 5 | 否 | 低 | 1 |
| 18 | decorationHolonomy.html | decorationHolonomy.js | 250 | 0 | 5 | 是 | 低 | 1 |
| 19 | decorationInclusive.html | decorationInclusive.js | 250 | 0 | 5 | 是 | 低 | 1 |
| 20 | decorationMidpack.html | decorationMidpack.js | 250 | 0 | 5 | 是 | 低 | 1 |
| 21-25 | 其他页面 | 各JS | ~500 | 0 | ~20 | 部分 | 低 | 1-2 |

### 3.2 核心页面详解

#### P1: decoration.js — 装修单列表 (2,815 行)

**功能描述：** 装修单的统一列表入口，按不同角色 (设计师/销售员/报价员/材料员等) 展示不同数据视图，是模块的核心枢纽页。

**R 项目技术特征：**
- 12 个 `Searcher` 实例 (分页列表组件，对应不同角色视图)
- 12 个 Bootstrap Modal (创建、编辑、查看弹窗)
- 57 个 API 调用
- 大量 `popup4page` 调用导航到子页面
- `drawNode.draw()` 渲染施工节点树
- 依赖 `constant.decoration()` 加载枚举常量

**Vue 3 映射方案：**
- 12 个 Searcher → 1 个 `<a-table>` + 角色切换 Tab/Select
- 12 个 Modal → `<a-modal>` 组件化
- popup4page → `<a-drawer>` 或 Vue Router 子路由
- drawNode → 自定义 Vue 组件 `DecorationScheduleTree.vue`
- constant.decoration() → Pinia Store `useDecorationStore`

#### P2: decoration4detail.js — 装修单详情 (2,176 行)

**功能描述：** 装修单的完整详情页，包含基本信息、报价信息、合同信息、变更记录等多个 Tab。

**R 项目技术特征：**
- 16 个 Bootstrap Modal
- 55 个 API 调用
- 2 个 popup4page
- 多 Tab 切换 (Bootstrap Tab)
- 大量表单联动和条件渲染

**Vue 3 映射方案：**
- 16 Modal → 独立 `<a-modal>` 组件 (可拆分子组件)
- Tab → `<a-tabs>`
- 表单联动 → Vue 3 reactive + computed/watch
- 详情数据 → `<a-descriptions>` + 自定义卡片

#### P3: decoration4account.js — 装修决算 (1,670 行)

**功能描述：** 装修单决算信息管理，包含决算生成、确认、打印等。

**Vue 3 映射方案：**
- popup → `<a-drawer>` 加载报价明细
- 打印 → window.print() 或打印组件
- 决算数据 → `<a-descriptions>` + `<a-table>`

---

## 四、技术映射

### 4.1 核心组件映射

| R 项目模式 | Vue 3 对应 | 说明 |
|-----------|-----------|------|
| `Searcher` (分页列表) | `<a-table>` + `pagination` + 查询表单 | 统一为 `ProTable` 组件 |
| `Bootstrap Modal` | `<a-modal>` | 可封装为组合式函数 |
| `com.popup()` | `<a-modal>` + 内容组件 | 弹窗加载完整页面 |
| `com.popup4page()` | `<a-drawer>` 或 Vue Router 导航 | iframe 子页面改为组件化 |
| `Bootstrap Tab` | `<a-tabs>` | 直接映射 |
| `Bootstrap Dropdown` | `<a-dropdown>` | 直接映射 |
| `Bootstrap Form` | `<a-form>` + `<a-form-item>` | 配合 v-model |
| `com.post()` | `axios.post/get` via interceptor | API 层统一封装 |
| `constant.decoration()` | Pinia Store + TS Enum | 预加载 + 类型安全 |
| `drawNode.draw()` | 自定义 Vue 组件 | 施工节点树组件 |
| `layer` (弹层) | `<a-modal>` / `<a-drawer>` / `<a-popover>` | 按场景选择 |
| `com.data.queryConstant` | API 调用 + Store 缓存 | 常量按需加载 |

### 4.2 API 层映射

**R 项目模式：**
```javascript
// api/decoration.js — API 定义
api.decoration = {
    queryDecorationByOrderId: { url: "queryDecorationByOrderId.do" },
    createDecoration: { url: "createDecoration.do" },
    // ...
}

// 业务代码中调用
com.post(api.decoration.queryDecorationByOrderId, { orderId: orderId }, function(res) {
    // 处理响应
});
```

**新项目模式：**
```typescript
// src/api/decoration/index.ts
import axios from 'axios'
import type { Page, BaseQry, BaseResult } from '@/types/global'

const MODULE = '/decoration'

// ---- 类型定义 ----
export interface DecorationQry extends BaseQry {
  orderId?: string
  customerId?: number
  designerId?: number
  status?: number
}

export interface DecorationVO {
  id: number
  orderId: string
  customerId: number
  customerName: string
  designerId: number
  designerName: string
  houseId: number
  houseName: string
  status: number
  // ... 更多字段
}

export interface DecorationCreateCmd {
  orderId: string
  customerId: number
  designerId: number
  // ...
}

// ---- API 函数 ----
export const queryDecorationByOrderId = (orderId: string) => {
  return axios.get<BaseResult<DecorationVO>>(`${MODULE}/queryDecorationByOrderId.do`, { params: { orderId } })
}

export const pageDecoration = (params: DecorationQry) => {
  return axios.get<BaseResult<Page<DecorationVO>>>(`${MODULE}/pageDecoration.do`, { params })
}

export const createDecoration = (data: DecorationCreateCmd) => {
  return axios.post<BaseResult<void>>(`${MODULE}/createDecoration.do`, data)
}
```

**关键注意事项：**
- 所有 `.do` 端点 URL 保持不变
- 新项目 interceptor.ts 会自动添加 `Authorization` header 和 `Org-Id`
- R 项目用 `com.post()` 发 POST (data 以 `application/x-www-form-urlencoded` 发送)，新项目需确认后端接口的 Content-Type 要求
- 新项目响应格式 `{ code: 0, data: T, msg: string }`，interceptor 已处理错误码

### 4.3 常量系统映射

**R 项目模式：**
```javascript
// 运行时从后端加载常量
com.data.queryConstant("decoration", "Decoration", "Status", function(data) {
    constant.decorationStatus = data; // { keys: [...], values: [...], datas: [...] }
});
```

**新项目方案 (两种选择)：**

**方案 A：使用已有 DictStore (推荐)**
```typescript
// 复用现有 src/stores/modules/dict.ts
const dictStore = useDictStore()
const decorationStatus = dictStore.getDictByType('decoration_status')
```

**方案 B：独立 DecorationStore**
```typescript
// src/stores/modules/decoration.ts
import { defineStore } from 'pinia'

interface DecorationConstants {
  status: DictItem[]
  type: DictItem[]
  // ...
}

const useDecorationStore = defineStore('decoration', {
  state: () => ({
    constants: {} as DecorationConstants,
    loaded: false,
  }),
  actions: {
    async loadConstants() {
      if (this.loaded) return
      const [status, type] = await Promise.all([
        queryConstant('decoration', 'Decoration', 'Status'),
        queryConstant('decoration', 'Decoration', 'Type'),
      ])
      this.constants = { status, type }
      this.loaded = true
    }
  }
})
```

### 4.4 Searcher → ProTable 映射

**R 项目 Searcher 模式：**
```javascript
var searcher = new Searcher();
searcher.init("#searcherDiv", function(condArr, page) {
    com.post(api.decoration.pageDecoration, $.extend(condArr, page), function(res) {
        // 渲染表格数据
    });
}, null, "#resultList", "decorationPagecond");
```

**新项目 ProTable 方案：**
```vue
<template>
  <div class="decoration-list">
    <!-- 查询表单 -->
    <a-card class="mb-4">
      <a-form :model="queryForm" layout="inline">
        <a-form-item field="orderId" label="装修单号">
          <a-input v-model="queryForm.orderId" placeholder="请输入" allow-clear />
        </a-form-item>
        <a-form-item field="status" label="状态">
          <a-select v-model="queryForm.status" :options="statusOptions" placeholder="全部" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">查询</a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 数据表格 -->
    <a-card>
      <a-table
        :data="tableData"
        :pagination="pagination"
        :loading="loading"
        row-key="id"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #columns>
          <a-table-column title="装修单号" data-index="orderId" />
          <a-table-column title="客户" data-index="customerName" />
          <a-table-column title="设计师" data-index="designerName" />
          <a-table-column title="状态" data-index="status">
            <template #cell="{ record }">
              <a-tag :color="getStatusColor(record.status)">{{ getStatusLabel(record.status) }}</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="操作" :width="200">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="handleView(record)">查看</a-button>
                <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { pageDecoration } from '@/api/decoration'
import type { DecorationVO, DecorationQry } from '@/api/decoration'

const queryForm = reactive<DecorationQry>({
  orderId: '',
  status: undefined,
  pageNo: 1,
  pageSize: 20,
})

const tableData = ref<DecorationVO[]>([])
const loading = ref(false)
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showTotal: true,
  showPageSize: true,
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await pageDecoration(queryForm)
    tableData.value = res.data.list
    pagination.total = res.data.total
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  queryForm.pageNo = 1
  fetchData()
}

const handleReset = () => {
  Object.assign(queryForm, { orderId: '', status: undefined, pageNo: 1 })
  fetchData()
}

const onPageChange = (page: number) => {
  queryForm.pageNo = page
  fetchData()
}

onMounted(() => fetchData())
</script>
```

### 4.5 popup4page → Drawer/Router 映射

| R 项目调用 | 新项目方案 |
|-----------|-----------|
| `com.popup4page("#layerPopUp", "/views/decoration/decoration4detail.html", "详情")` | `<a-drawer>` 加载 `DecorationDetail.vue` 组件 |
| `com.popup4page("#layerPopUp", "/views/decoration/decorationContract2create.html", "创建合同")` | `<a-modal>` 加载 `ContractCreate.vue` 或 router.push |
| `com.popup4page("#layerPopUp", "/views/quotation/addReduceIndex.html", "明细")` | 跨模块导航 → 路由跳转或微前端调用 |
| `com.popup("查看合同", url)` | `<a-modal>` 内嵌 `<iframe>` (PDF预览) 或 `<a-image-preview>` |

**实现模式：**
```vue
<template>
  <!-- 方案 1: Drawer -->
  <a-drawer
    v-model:visible="detailVisible"
    title="装修单详情"
    :width="800"
    :footer="false"
  >
    <DecorationDetail :order-id="currentOrderId" />
  </a-drawer>

  <!-- 方案 2: 路由导航 -->
  <router-link :to="{ name: 'decoration-detail', params: { orderId: record.orderId } }">
    <a-button type="text">查看详情</a-button>
  </router-link>
</template>
```

---

## 五、目录结构规划

### 5.1 新增文件结构

```
src/
├── api/
│   └── decoration/
│       ├── index.ts              # API 函数统一导出
│       ├── types.ts              # 请求/响应类型定义
│       ├── order.ts              # 装修单相关 API
│       ├── contract.ts           # 合同相关 API
│       ├── activity.ts           # 活动相关 API
│       ├── measure.ts            # 量房相关 API
│       ├── account.ts            # 决算相关 API
│       ├── picture.ts            # 图片相关 API
│       ├── service.ts            # 服务相关 API
│       └── constant.ts           # 常量查询 API
├── types/
│   └── decoration/
│       ├── index.ts              # 类型统一导出
│       ├── decoration.ts         # 装修单类型
│       ├── contract.ts           # 合同类型
│       ├── activity.ts           # 活动类型
│       ├── measure.ts            # 量房类型
│       └── account.ts            # 决算类型
├── stores/
│   └── modules/
│       └── decoration.ts         # 装修模块 Store
├── views/
│   └── decoration/
│       ├── index.vue             # 装修单列表页 (decoration.html)
│       ├── components/
│       │   ├── SearchForm.vue        # 查询表单
│       │   ├── DecorationTable.vue   # 装修单表格 (角色切换)
│       │   ├── CreateModal.vue       # 创建装修单弹窗
│       │   ├── EditModal.vue         # 编辑弹窗
│       │   ├── StatusChangeModal.vue # 状态变更弹窗
│       │   ├── NodeSchedule.vue      # 施工节点树
│       │   └── common/
│       │       ├── CustomerInfo.vue   # 客户信息卡片
│       │       ├── HouseInfo.vue      # 房源信息卡片
│       │       └── DesignerInfo.vue   # 设计师信息卡片
│       ├── detail/
│       │   ├── index.vue             # 详情页主入口 (decoration4detail.html)
│       │   ├── components/
│       │   │   ├── BasicInfo.vue         # 基本信息 Tab
│       │   │   ├── QuoteInfo.vue          # 报价信息 Tab
│       │   │   ├── ContractInfo.vue       # 合同信息 Tab
│       │   │   ├── ActivityInfo.vue       # 活动信息 Tab
│       │   │   ├── MeasureInfo.vue        # 量房信息 Tab
│       │   │   ├── PictureInfo.vue        # 图片信息 Tab
│       │   │   ├── ServiceInfo.vue        # 服务信息 Tab
│       │   │   ├── ChangeHistory.vue      # 变更记录 Tab
│       │   │   └── AuditHistory.vue       # 审批记录 Tab
│       ├── contract/
│       │   ├── index.vue             # 合同列表 (decorationContract.html)
│       │   └── create.vue            # 创建合同 (decorationContract2create.html)
│       ├── activity/
│       │   ├── index.vue             # 活动管理 (decoration4activity.html)
│       │   └── record.vue            # 活动记录 (decorationActivityRecord.html)
│       ├── measure/
│       │   ├── index.vue             # 量房列表 (decorationMeasure.html)
│       │   ├── apply.vue             # 量房申请 (decorationMeasure4apply.html)
│       │   └── setup.vue             # 量房安排 (decorationMeasure4setup.html)
│       ├── account/
│       │   └── index.vue             # 决算管理 (decoration4account.html)
│       ├── picture/
│       │   └── index.vue             # 装修图片 (decorationPicture.html)
│       ├── belong/
│       │   └── index.vue             # 装修归属 (decoration4belong.html)
│       ├── refer/
│       │   └── index.vue             # 装修引用 (decoration4refer.html)
│       ├── service/
│       │   └── index.vue             # 装修服务 (decorationService.html)
│       ├── holonomy/
│       │   └── index.vue             # 全包 (decorationHolonomy.html)
│       ├── inclusive/
│       │   └── index.vue             # 半包 (decorationInclusive.html)
│       └── midpack/
│           └── index.vue             # 中包 (decorationMidpack.html)
├── router/
│   └── routes/
│       └── dynamicModules/
│           └── decoration.ts     # 装修模块路由配置
└── components/
    └── business/
        └── ProTable.vue              # 通用分页表格组件 (可选)
```

### 5.2 路由配置

```typescript
// src/router/routes/dynamicModules/decoration.ts
import type { RouteRecordRaw } from 'vue-router'
import { DEFAULT_LAYOUT } from '@/router/constants'

const DECORATION: RouteRecordRaw = {
  path: '/decoration',
  name: 'decoration',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '装修管理',
    icon: 'icon-tool',
    order: 3,
    requiresAuth: true,
  },
  children: [
    {
      path: 'list',
      name: 'decoration-list',
      component: () => import('@/views/decoration/index.vue'),
      meta: {
        locale: '装修单列表',
        order: 0,
        requiresAuth: true,
      },
    },
    {
      path: 'detail/:orderId',
      name: 'decoration-detail',
      component: () => import('@/views/decoration/detail/index.vue'),
      meta: {
        locale: '装修单详情',
        hideInMenu: true,
        requiresAuth: true,
      },
    },
    {
      path: 'create',
      name: 'decoration-create',
      component: () => import('@/views/decoration/create.vue'),
      meta: {
        locale: '创建装修单',
        hideInMenu: true,
        requiresAuth: true,
      },
    },
    {
      path: 'contract',
      name: 'decoration-contract',
      component: () => import('@/views/decoration/contract/index.vue'),
      meta: {
        locale: '装修合同',
        order: 1,
        requiresAuth: true,
      },
    },
    {
      path: 'contract/create',
      name: 'decoration-contract-create',
      component: () => import('@/views/decoration/contract/create.vue'),
      meta: {
        locale: '创建合同',
        hideInMenu: true,
        requiresAuth: true,
      },
    },
    {
      path: 'activity',
      name: 'decoration-activity',
      component: () => import('@/views/decoration/activity/index.vue'),
      meta: {
        locale: '装修活动',
        order: 2,
        requiresAuth: true,
      },
    },
    {
      path: 'activity/record',
      name: 'decoration-activity-record',
      component: () => import('@/views/decoration/activity/record.vue'),
      meta: {
        locale: '活动记录',
        hideInMenu: true,
        requiresAuth: true,
      },
    },
    {
      path: 'measure',
      name: 'decoration-measure',
      component: () => import('@/views/decoration/measure/index.vue'),
      meta: {
        locale: '量房管理',
        order: 3,
        requiresAuth: true,
      },
    },
    {
      path: 'account',
      name: 'decoration-account',
      component: () => import('@/views/decoration/account/index.vue'),
      meta: {
        locale: '装修决算',
        order: 4,
        requiresAuth: true,
      },
    },
    {
      path: 'picture',
      name: 'decoration-picture',
      component: () => import('@/views/decoration/picture/index.vue'),
      meta: {
        locale: '装修图片',
        order: 5,
        requiresAuth: true,
      },
    },
    {
      path: 'belong',
      name: 'decoration-belong',
      component: () => import('@/views/decoration/belong/index.vue'),
      meta: {
        locale: '装修归属',
        order: 6,
        requiresAuth: true,
      },
    },
    {
      path: 'service',
      name: 'decoration-service',
      component: () => import('@/views/decoration/service/index.vue'),
      meta: {
        locale: '装修服务',
        order: 7,
        requiresAuth: true,
      },
    },
  ],
}

export default DECORATION
```

---

## 六、分阶段迁移计划

### 阶段 0：基础设施 (3-5 天)

**目标：** 搭建模块骨架，建立类型系统和 API 层。

| 步骤 | 任务 | 产出 |
|------|------|------|
| 0.1 | 创建目录结构和路由配置 | `src/views/decoration/`, `src/api/decoration/`, `decoration.ts` 路由 |
| 0.2 | 定义 TypeScript 类型 | `src/types/decoration/*.ts` — 所有 VO/Qry/Cmd 接口 |
| 0.3 | 封装 API 函数 | `src/api/decoration/*.ts` — 149 个端点的 TS 封装 |
| 0.4 | 创建 Decoration Store | `src/stores/modules/decoration.ts` — 常量和共享状态 |
| 0.5 | 封装 ProTable 组件 (可选) | `src/components/business/ProTable.vue` — 统一分页表格 |

**验收标准：**
- 路由注册成功，可访问 `/decoration/*` 页面
- API 调用可正常发出请求并获取响应
- TypeScript 编译无错误

### 阶段 1：简单页面 (5-8 天)

**目标：** 迁移低复杂度页面，建立开发模式。

按优先级排列：

| # | 页面 | R 项目文件 | 预估天数 |
|---|------|-----------|----------|
| 1.1 | 装修图片 | decorationPicture.js (507行) | 1 |
| 1.2 | 活动记录 | decorationActivityRecord.js (462行) | 1 |
| 1.3 | 量房申请 | decorationMeasure4apply.js (456行) | 1 |
| 1.4 | 量房安排 | decorationMeasure4setup.js (430行) | 1 |
| 1.5 | 装修归属 | decoration4belong.js (380行) | 1 |
| 1.6 | 装修引用 | decoration4refer.js (360行) | 1 |
| 1.7 | 创建合同 | decorationContract2create.js (350行) | 1 |
| 1.8 | 装修服务 | decorationService.js (300行) | 1 |
| 1.9 | 全包/半包/中包 | holonomy/inclusive/midpack (各~250行) | 2 |

**验收标准：**
- 每个页面功能与 R 项目一致
- 分页、搜索、CRUD 操作正常
- 响应式布局适配

### 阶段 2：中等页面 (8-12 天)

**目标：** 迁移中等复杂度页面，处理 popup/modal/跨模块交互。

| # | 页面 | R 项目文件 | 预估天数 |
|---|------|-----------|----------|
| 2.1 | 合同列表 | decorationContract.js (936行) | 2-3 |
| 2.2 | 活动管理 | decoration4activity.js (927行) | 2-3 |
| 2.3 | 创建装修单 | decoration2create.js (651行) | 1-2 |
| 2.4 | 量房管理 | decorationMeasure.js (560行) | 1-2 |
| 2.5 | 审批记录 | audit4record.js (560行) | 1-2 |
| 2.6 | 公共信息 | decoration4common.js (280行) | 1 |

**验收标准：**
- Modal 弹窗交互正常
- Drawer 侧滑面板正常
- 跨模块导航 (到 quotation/customer 等模块) 正常
- 表单验证完整

### 阶段 3：核心页面 (15-20 天)

**目标：** 迁移最复杂的两个核心页面。

| # | 页面 | R 项目文件 | 预估天数 |
|---|------|-----------|----------|
| 3.1 | 装修单列表 | decoration.js (2,815行, 12 Searcher, 57 API) | 7-10 |
| 3.2 | 装修单详情 | decoration4detail.js (2,176行, 16 Modal, 55 API) | 5-7 |
| 3.3 | 装修决算 | decoration4account.js (1,670行) | 3-4 |

**装修单列表页拆分策略：**
1. 角色视图 → `<a-tabs>` 切换，每个角色一个 TabPane
2. 共享查询表单 → `SearchForm.vue`
3. 统一表格 → `DecorationTable.vue`，根据角色动态列
4. 12 个 Modal → 按功能拆分为独立组件
5. 施工节点树 → `NodeSchedule.vue` 自定义组件

**装修单详情页拆分策略：**
1. Tab 结构 → `<a-tabs>` 按功能域划分
2. 16 个 Modal → 按 Tab 归属拆分到各子组件
3. 大量表单 → 使用 `useForm` 组合式函数复用逻辑
4. 共享数据 → 详情数据存入 Store，各 Tab 组件共享

### 阶段 4：集成测试与优化 (5-7 天)

| 任务 | 说明 |
|------|------|
| 功能回归测试 | 逐页面比对 R 项目功能 |
| 权限集成 | 对接新项目权限系统 (usePermission) |
| 微前端测试 | 在 Wujie 环境中验证子应用集成 |
| 性能优化 | 大列表虚拟滚动、懒加载、缓存策略 |
| UI 一致性 | 确保与 Arco Design 设计规范一致 |
| 跨浏览器测试 | Chrome / Edge / Firefox |

---

## 七、工作量估算汇总

| 阶段 | 天数 (单人) | 说明 |
|------|------------|------|
| 阶段 0：基础设施 | 3-5 | 类型、API、Store、路由 |
| 阶段 1：简单页面 (9页) | 5-8 | 每页 0.5-1 天 |
| 阶段 2：中等页面 (6页) | 8-12 | 每页 1-2 天 |
| 阶段 3：核心页面 (3页) | 15-20 | 列表页 7-10 天，详情页 5-7 天，决算 3-4 天 |
| 阶段 4：集成测试 | 5-7 | 测试、优化、联调 |
| **总计** | **36-52** | **单人全职约 2-2.5 个月** |

**双人协作估算：** 约 20-30 天
- 人员 A：基础设施 + 核心页面 (列表/详情)
- 人员 B：简单页面 + 中等页面 + 集成测试

---

## 八、关键风险与对策

| 风险 | 影响 | 对策 |
|------|------|------|
| 后端 API 兼容性 | 新旧项目请求格式不一致 | 先用 Postman 验证所有 .do 端点，确认 Content-Type 和参数格式 |
| 常量数据结构差异 | R 项目运行时加载 vs 新项目类型安全 | 建立常量映射表，优先使用 DictStore |
| 跨模块导航 | popup4page 跨 quotation/customer 模块 | 定义清晰的跨模块导航协议，微前端边界处理 |
| 微前端集成 | Wujie 子应用通信 | 使用 Wujie 的 props/event 机制传递装修单上下文 |
| 大数据量渲染 | 列表页数据量大 | 虚拟滚动、分页优化、请求防抖 |
| 表单复杂度 | 详情页大量联动表单 | 拆分子组件 + useForm 组合式函数 + debounce |

---

## 九、开发规范

### 9.1 命名规范

```
组件:     PascalCase (DecorationTable.vue)
组合式函数: camelCase (useDecorationForm.ts)
Store:   use + Module + Store (useDecorationStore)
API:     动词 + 名词 (queryDecorationByOrderId)
类型:    PascalCase + 后缀 (DecorationVO / DecorationQry / DecorationCreateCmd)
路由:    kebab-case (decoration-detail)
```

### 9.2 组件规范

- 每个页面组件不超过 300 行，超出则拆分子组件
- 使用 `<script setup lang="ts">` 语法
- Props 使用 `defineProps<T>()` + `withDefaults`
- Events 使用 `defineEmits<T>()`
- 复用逻辑提取为 `use*` 组合式函数
- API 调用统一在组件 `onMounted` 或用户交互中触发

### 9.3 Git 规范

```
feat(decoration): 新增装修单列表页
feat(decoration): 新增装修单详情页
fix(decoration): 修复合同创建表单验证问题
refactor(decoration): 拆分详情页子组件
```

---

## 十、参考资源

| 资源 | 路径 |
|------|------|
| 新项目源码 | `/d/GIT/view-decoration-pc/` (分支: `erp-master`) |
| R 项目源码 | `/d/GIT/Rhadamanthus/` |
| R 项目 decoration JS | `WebContent/js/decoration/*.js` |
| R 项目 decoration HTML | `WebContent/views/decoration/*.html` |
| R 项目 API 定义 | `WebContent/js/api/decoration.js` |
| R 项目常量系统 | `WebContent/js/com/constant.js` |
| R 项目共享工具 | `WebContent/js/utils/decorationUtils.js` 等 |
| 新项目 interceptor | `src/api/interceptor.ts` |
| 新项目 DictStore | `src/stores/modules/dict.ts` |
| 新项目路由示例 | `src/router/routes/dynamicModules/customer.ts` |
| 新项目类型定义 | `src/types/global.ts` |
| 新项目权限 Hook | `src/hooks/permission.ts` |
| Arco Design Vue 文档 | https://arco.design/vue/docs/start |
| Vue 3 文档 | https://vuejs.org/ |
| Pinia 文档 | https://pinia.vuejs.org/ |

---

*文档生成时间: 2026-04-25*
*基于 Rhadamanthus decoration 模块分析 (57 文件, ~26,500 行代码, 149 个 API 端点)*
