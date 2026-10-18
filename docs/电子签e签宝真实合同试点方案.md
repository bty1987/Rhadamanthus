# e签宝真实合同试点方案（装修合同 DecorationContract）

> 目标：选一家试点公司，在 e签宝 完成一份**真实装修合同**的全链路签署（生成→企业自动签→客户手动签→确认→归档→下载验章），法大大存量业务零影响。
>
> 前提：fadada 并行运行中，不需要动。系统侧多厂商架构已就绪（`ElecsignService` + `ElecsignRouter` 场景路由 + `ESignElecsignServiceImpl` v3 骨架 649 行）。
>
> 编写日期：2026-10-13

---

## 一、现状盘点（已就绪部分）

| 组件 | 状态 |
|------|------|
| 路由器 `ElecsignRouter` | ✅ 已支持场景级路由：`elecsign.provider.decoration`（公司×场景）→ `elecsign.provider` → 全局默认 → 兜底法大大 |
| 装修合同链路 | ✅ 已按路由接入：`routeForCreate`（生成，按合同 PO 记录 provider）+ `routeForRecord`（签/看/归档，按记录路由） |
| e签宝实现 `ESignElecsignServiceImpl` | ⚠️ 骨架 649 行（openapi v3 纯 HTTP，无 SDK 依赖），4 处端点 TODO 待联调核对 |
| 合同 PO | ✅ `DecorationContractPO` 已有 `provider` + `flowId`（存 fileId/signFlowId）字段 |
| 签署状态推进 | ⚠️ **人工确认模式**（员工点"已签"按钮），法大大也是这个模式，试点可沿用 |
| 印章/模板管理 | ❌ e签宝实现显式不支持（130098）——印章和模板在 e签宝控制台维护 |

**关键设计红利**：场景路由让试点风险被隔离——只给试点公司配 `elecsign.provider.decoration=esign`，该公司装修合同走 e签宝，其余一切（员工合同/付款合同/其他公司）继续法大大，删一条配置即回滚。

---

## 二、分阶段执行计划

### Phase 1：e签宝侧准备（外部依赖，最先启动，1-3 天）

| # | 事项 | 说明 | 产出 |
|---|------|------|------|
| 1 | 注册 e签宝开放平台 | open.esign.cn，企业实名 | 开发者账号 |
| 2 | 获取凭证 | **沙箱 + 生产两套** `appId/appSecret`，host 地址 | 凭证（交系统侧配置） |
| 3 | 试点公司机构实名 | 在 e签宝完成企业认证 | orgId |
| 4 | 开通正式版 | **真实合同需要法律效力**：CA 证书 + 出证服务（涉及商务计费，提前确认） | 正式版权益开通 |
| 5 | 开通静默签 | 企业签《自动落章授权书》，否则 autosign 失败 | 静默签授权生效 |
| 6 | 重做装修合同模板 | **模板不互通，但底稿 PDF 自带 AcroForm 域**（域名=conitem 变量名，实测 61 域中 38 个与前端 47 变量直接同名）。流程：用工单工具生成底稿+变量清单 → e签宝控制台上传底稿、识别/导入自带域 → 人工补缺失控件 → 拿 docTemplateId | docTemplateId |

> ✅ **Phase 1.6 已大幅降险（2026-10-18 调研实证）**：法大大模板底稿 PDF 本身带表单域，e签宝 可识别导入，
> 人工只需补 9 个 PDF 缺失控件（con-company-* 公司信息族 + con-markup-two/thr）+ 签章区。
> 工具：`python scripts/esign_template_workorder.py --cid <cid> --name <名> --page <模板页html> --pdf-url <path完整URL>`
> （path 拼接 `https://service-erp.fanglin.vip/`；已产出 cid=11093/2889 两个主力模板工单于 `target/esign-templates/`）。
> 剩余风险：9 个补建控件的位置人工对位；派生变量（con-sign-year 等 JS 追加）以测试环境抓包确认。

### Phase 2：系统侧代码收尾（1-2 天，与 Phase 1 并行）

`ESignElecsignServiceImpl` 骨架的联调核对清单：

- [ ] 机构认证&授权页面链接：端点与参数核对（`forCompany` 实例方法）
- [ ] 个人认证&授权页面链接：同上
- [ ] 模板填充（基于模板创建文档）：端点参数核对；确认装修合同是否用到动态表格 `tables`——若法大大模板无表格则 e签宝 tables 不映射可接受
- [ ] 获取签署链接：端点参数核对
- [ ] `extsign` 异常处理：当前失败静默返回 null，改为抛 `FLException`（否则员工看到空 URL 误以为成功）
- [ ] 个人实名的时序确认：客户必须先完成 e签宝 个人实名（拿到 psnId）才能进签署链接——确认 e签宝 H5 是否支持"未实名先引导实名再签"，否则试点流程要拆两步（先认证后签署）

改动文件仅 `src/com/fanglin/esign/` 包，零业务方改动。

**打包**：`fanglin-esign-8.3.027.jar` + `fanglin-elecsign-8.3.027.jar`（已有）+ 受影响业务方 jar。部署顺序：elecsign → esign → 业务方。

### Phase 3：系统侧配置（试点公司，0.5 天）

在 `communion.systemconfig` 为试点公司（假设 cid=N）插入：

```sql
INSERT INTO communion.systemconfig (`group`, `key`, `value`, `company`, `comment`) VALUES
('elecsign', 'elecsign.appId',                '{Phase1-生产appId}',  N, 'e签宝 appId'),
('elecsign', 'elecsign.appSecret',            '{加密后secret}',      N, 'e签宝密钥'),
('elecsign', 'elecsign.provider.decoration',  'esign',               N, '装修合同走e签宝'),
('elecsign', 'elecsign.provider.auth',        'esign',               N, '注册认证走e签宝（拿orgId/psnId必须）');
```

**说明**：
- `provider.decoration` 只影响装修合同场景，员工/供应商/付款合同不受影响
- `provider.auth` **必须配**：e签宝 签署需要 orgId/psnId，试点公司的印章注册、客户/员工实名认证必须走 e签宝 才能拿到这些编号
- 先在测试环境用沙箱凭证验证一轮，再配生产凭证

### Phase 4：试点数据准备（0.5 天）

| # | 事项 | 操作 |
|---|------|------|
| 1 | 合同模板行 | `data.contract` 新增一行：`company=试点公司cid, atttype=0, no={e签宝docTemplateId}, page=现有模板表单页`（表单页复用，变量名已对齐） |
| 2 | 公司印章 | 系统印章管理页为试点公司注册印章（走 e签宝 路由 → 机构认证 → 静默签授权）→ `signet` 表得到 provider=2、signno=orgId 的记录；**keyword 仍要填**（自动落章定位用） |
| 3 | 试点客户 | 选真实业主：系统注册客户 → 走 e签宝 个人实名（auth 场景路由）→ `customer.signno`=psnId, provider=2 |

### Phase 5：真实合同签署演练（核心验证，0.5-1 天）

选试点公司一单真实装修订单，全链路走一遍：

```
1. 生成合同   员工选 e签宝模板行 → 填表单 → addDecorationContract
              ✅ 验证：生成成功、viewpdf/download 能打开、变量填充正确无空白错位
2. 企业自动签 员工选印章 → signDecorationContractForCompany
              ✅ 验证：e签宝控制台流程状态=企业已签；下载 PDF 看企业章位置（keyword 定位）
3. 客户手动签 发送签署（管理端 iframe 或客户短信链接 redirect.html?type=2）
              ✅ 验证：客户手机收到 e签宝 H5、完成实名+签名、真实签字落章
4. 人工确认   员工点"已签"（沿用现有人工确认模式）
5. 归档       员工点"归档"（e签宝建流时 autoArchived=true，本地置状态即可）
              ✅ 验证：合同状态流转 0→1→3、comsignTime/cussignTime/filingTime 齐全
6. 法律效力   从 e签宝下载最终 PDF + 出证报告
              ✅ 验证：双章齐全、e签宝验签通过、出证报告可出
```

**回归验证（同日）**：
- [ ] 其他公司装修合同照常走法大大（配置隔离验证）
- [ ] 试点公司走法大大签过的历史合同照常可看/下载（provider 按记录路由验证）
- [ ] 试点公司员工合同/付款合同照常走法大大（场景隔离验证）

### Phase 6：回滚预案

| 场景 | 操作 | 生效 |
|------|------|------|
| 试点公司新合同回法大大 | 删除/停用该公司 `elecsign.provider.decoration` 配置 | 立即（下次生成合同时） |
| 签到一半的合同 | 不受影响，按合同 PO 记录的 provider 路由，继续在 e签宝 完成 | — |
| 全局紧急回退 | 删所有 `elecsign.provider.*` 配置 | 立即 |

---

## 三、风险与对策

| 风险 | 等级 | 对策 |
|------|:---:|------|
| e签宝模板控件名与前端变量名不一致 → 合同空白/错位 | 🟢 低（已降级） | 底稿 PDF 自带域与前端变量同体系（38/47 直接同名），e签宝 识别导入 + 工单核对；生成后先 viewpdf 人工检查再签 |
| 真实合同法律效力（CA/出证）未开通 | 🔴 高 | Phase 1.4 商务提前确认正式版权益，演练用沙箱，**正式签署前必须确认正式版生效** |
| 客户未实名直接进签署链接被拒 | 🟡 中 | Phase 2 联调确认 H5 实名引导能力；试点流程先认证后签署 |
| 静默签授权未生效 → autosign 报错 | 🟡 中 | Phase 1.5 提前办；演练第 2 步即暴露 |
| 4 处端点 TODO 与实际 v3 文档不符 | 🟡 中 | Phase 2 沙箱联调逐个核对（纯 HTTP 实现改起来快） |
| `elecsign.appSecret` 明文入库 | 🟢 低 | value 用项目 `EncryptConfigLoader` 体系加密后存入 |
| 已知旧 bug（顺带修） | 🟢 低 | ① `Signature.java:766` filing 错误判断恒 false；② app 前端 `companySign` 未传 `signet.sid`（sid=0 NPE），试点前修掉② |

## 四、时间估算

| 阶段 | 工时 | 依赖 |
|------|------|------|
| Phase 1 e签宝侧准备 | 1-3 天（外部） | 商务/账号 |
| Phase 2 代码收尾 | 1-2 天 | 沙箱凭证 |
| Phase 3 配置 | 0.5 天 | Phase 1+2 |
| Phase 4 数据准备 | 0.5 天 | Phase 3 |
| Phase 5 真实合同演练 | 0.5-1 天 | 全部 |
| **合计** | **3.5-5.5 个工作日** | Phase 1/2 可并行 |

## 五、待确认问题（启动前）

1. **试点公司选哪家**：标准是有真实装修订单、愿意配合（印章/客户走 e签宝 认证）、离法大大到期远（便于并行观察）。
2. **e签宝商务是否已谈定**：正式版计费/出证服务/静默签开通条件。
3. **"真实合同"的定义**：是要具备法律效力的正式合同（必须 Phase 1.4 完成），还是先演练沙箱跑通（快但无效力）？建议两步走：先沙箱全链路 → 后生产正式签署。
4. **试点公司现有在途合同**：确认无生成到一半（status=0 未签完）的合同卡在切换边界。
