# OSS 上传资源切换方案

> 定稿时间：2026-10-02
> 状态：方案待拍板，未实施
> 关联文档：`UPLOAD_GUIDE.md`（上传组件用法）、`OSS_IMAGE_SIMPLIFIED.md`（type=3 显示简化版 v3.0）

---

## 一、现状盘点

切换所需的"三件套"代码已存在，本方案核心是**补缺口 + 定契约 + 分批灰度**，不是从零建设。

### 1.1 后端（`com.fanglin.aliyun`，完整可用）

| 组件 | 文件 | 说明 |
|------|------|------|
| 配置 Bean | `src/com/fanglin/aliyun/config/OssProperties.java` | 读 `conf/oss.properties`；AK/SK 走 `ENC(...)` 由 `EncryptPropertyPlaceholderConfigurer` 启动解密；全后端唯一持有明文密钥入口 |
| STS 服务 | `src/com/fanglin/aliyun/service/impl/StsTokenServiceImpl.java` | AssumeRole 签发临时凭证；sessionName=userId，配合 RAM 策略 `${oss:assumedRoleName}` 实现"每会话只能写自己目录" |
| 凭证接口 | `src/com/fanglin/aliyun/action/OssConfigAction.java` | `getOssStsToken.do`（推荐，STS 直传）/ `generatePostSignature.do`（旧 Policy 签名，保留并行灰度）/ `getProgressiveImage.do`（已弃，v3.0 显示方案零依赖） |
| 代理兜底 | `src/com/fanglin/common/action/UploadAction.java` | `uploadFile.do`：服务端代理上传（钉钉微应用、后端生成文件等无法浏览器直传的场景）；大小/后缀白名单校验 |
| SDK | `WebContent/WEB-INF/lib/` | `aliyun-sdk-oss-3.17.4.jar`、`aliyun-java-sdk-sts-3.1.0.jar`、`aliyun-java-sdk-core-4.6.3.jar` 均已入库 |
| 配置文件 | `conf/oss.properties` | 模板已就位，⚠️ 生产真实值未填（见缺口 ②） |

### 1.2 老版前端（WebContent）

- `WebContent/js/com/core.js` `com.uploadify`（约 L1772）内置三模式开关：
  - `config.isAliOss === false` → `_uploadifyLocal`（老通道：`config.media + uploadImg.do / uploadOther.do`）
  - `config.isAliOss === true && uploadMode === 'sts'` → `_uploadifySts`（浏览器直传，multipartUpload 分片 5MB；**缺 ali-oss SDK 自动降级本地**）
  - `config.isAliOss === true && uploadMode === 'policy'` → `_uploadifyOss`（PostObject 签名）
- `com.showImg`（约 L1069）已支持 type：0=本地（`imgBasePath` 走媒体服务 showImg.do）、1=钉钉、2=华为 OBS、3=阿里 OSS（拼 `config.ossConfig.host` + `x-oss-process` 缩放）
- 调用面：**69 个 js 文件 / 89 处 `com.uploadify` 调用**，全部经 `com.uploadify` 一个口子
- API 定义：`WebContent/js/api/system.js` `upgrade` 命名空间（`getOssStsToken.do` 等，走主 ERP 域）

### 1.3 app 新前端

- `app/js/app/upload.js`：基于 layui upload 封装，**仅本地通道**（`uploadImg.do`，字段名 `strutsUploads`，响应 `{errorCode:0, resUrl}`）；无 OSS 分支
- app 版使用方：`app/js/construction/supervision4detail.js`、`feedbackGuarantee.js`、`supplierSignet.js` 等

### 1.4 老通道（媒体服务，不在本仓库）

- `uploadImg.do` / `uploadOther.do` / `showImg.do`（imgBasePath 参数）在**独立媒体服务**上（本仓库无对应 Action，grep 仅命中 QuotationPicturePO 注释）
- 前端环境前缀：`js/com/server.js`——生产 `config.media=''`（同源），内网 dev `http://192.168.5.21/`
- DB 落库契约：相对路径，展示时拼 `config.media` 解析

### 1.5 发现的缺口（阶段 1 要补）

| # | 级别 | 缺口 | 依据 |
|---|------|------|------|
| ① | 🔴 | `aliyun-oss-sdk.min.js` **不在仓库**，即使打开 `config.isAliOss`，STS 直传也静默降级回本地，永远不会真走 OSS | `main.html:364` 引用 `assets/js/aliyun-oss-sdk.min.js`，但该文件不存在；实际 assets 目录结构为 `assets/altogether/js/` 等按主题分目录 |
| ② | 🔴 | `conf/oss.properties` 全是占位值（`LTAI5tNewRotatedKeyId`、`ENC(请用AESHelper.encrypt生成密文替换本占位)`、roleArn 占位） | `conf/oss.properties` |
| ③ | 🟡 | 落库契约不统一：本地通道返回相对路径（`resUrl`），STS 直传返回完整 URL（`uploadPath = sts.host + '/' + objectKey`）；`com.showImg` type=0 本地分支会把 `http` 开头的 URL 拼坏 | `core.js` `_uploadifySts` 成功回调 vs `_uploadifyLocal` |
| ④ | 🟡 | objectKey 日期用 `toISOString()` 取 UTC 日期，北京时间 0~8 点落错日期目录 | `core.js` `_uploadifySts` 内 `dateStr` |

---

## 二、切换总原则

1. **新单新文件走 OSS，存量数据一行不动**；展示层自动兼容双格式，不做强依赖的 DB 迁移
2. 按业务域分批，每批可独立回滚（一个开关回退本地通道）
3. 媒体服务只减不增，最后只读冻结 → 观察 → 下线

---

## 三、分阶段实施

### 阶段 0：云侧准备（运维，一次性，不动代码）

1. 建 bucket（与 ECS 同 region；**上传走内网 endpoint 免流量费**）
2. 🔴 **必须配 CORS 规则**：允许 ERP 域名 POST/PUT、ExposeHeaders=ETag。浏览器直传漏配 CORS 全军覆没——阶段 0 最容易漏的一项
3. RAM 子账号 AK/SK（仅后端持有）+ 两个角色：
   - `oss-uploader`：策略限 `PutObject` 到 `users/*` 下 `${oss:assumedRoleName}/` 目录（与 `StsTokenServiceImpl` 的会话隔离对应）
   - `oss-reader`：只读
4. 桶策略拍板：**推荐公共读 + Referer 防盗链**
   - 公共读：`showImg` 直接拼 URL + `x-oss-process` 图片处理即用，改动最小
   - 私有桶：要 presign 改展示链路，成本高，不推荐
   - 防盗链必须与开公共读**同步**上，否则外盗链烧流量
5. 生命周期规则兜底存储成本（低频访问层/冷归档）
6. 生产 `conf/oss.properties` 填真实值：secret 用 `AESHelper.encrypt` 生成 ENC 密文（密钥体系同 houseNumber V1 钥的 JVM 注入方式）

### 阶段 1：打通基建，不发业务（一次发版，三小改）

| # | 改动 | 文件 | 说明 |
|---|------|------|------|
| 1 | `aliyun-oss-sdk.min.js` 官方下载落盘入库（约 200KB） | `WebContent/assets/js/`（新建）+ 核对三个主题 `index-*.html` 与 `main.html` 的加载路径都能命中 | 解缺口 ① |
| 2 | `com.showImg` 本地分支加 http(s) 自动识别：url 以 `^https?:` 开头直接用，不再拼 `imgBasePath` | `WebContent/js/com/core.js` | **全方案关键地基**——一处改动覆盖全部 89 个展示调用点，存量列混入 OSS 完整 URL 天然可显示 |
| 3 | `com.uploadify` 支持 per-call 覆盖（如 `args.ossOff` 强制本页走本地）；顺手修 UTC 日期 bug | `WebContent/js/com/core.js` | 单页回滚开关 + 解缺口 ④ |
| 4 | 填 `config.ossConfig` 生产值（host 先空用 `bucket.endpoint`） | `WebContent/js/com/config.js` | type=3 显示用 |
| 5 | 生产冒烟 | `WebContent/views/test/upload-test.html` | STS 直传 / SDK 缺失降级 / 本地三态 + 回显 + 跨域 |

**灰度控制形态二选一：**
- A. `config.js` 静态开关（`config.isAliOss`），发版生效——简单
- B. 接入现有 `communion.constant` 机制（表驱动 JS 逻辑值，**改库即生效，免发版**）——推荐，与 ds/constant 双源惯例一致

### 阶段 2：按业务域分批灰度（逐步的主体）

**落库契约定版：统一存完整 URL**（`https://bucket.endpoint/{userId}/{yyyy-MM-dd}/{uuid}.{ext}`，与 STS 回调 `uploadPath` 和代理通道 `resUrl` 天然一致）。

> 为什么不存对象键：回显靠阶段 1 的自动识别，89 个调用点**零改动**；存对象键则要逐页改 `type=3` 并拼 dir 前缀，漏改即白图。换 CDN 域名的远虑靠 OSS 自定义域名解，真要换桶域名再做一次性 DB 刷数。

批次建议（低风险先行、法律凭证类最后，具体排序待拍板）：

| 批次 | 域 | 理由 |
|------|-----|------|
| 试点 | 施工日记图片（constructionDiary）、公告附件 | 低频低风险，出问题影响面小 |
| 二批 | 客户反馈/售后/回访图片（feedbackGuarantee / feedbackComplaint / feedbackBackVisit） | 客服域，验证多媒体（音视频）路径 |
| 三批 | 主材/外辅单据、报价配图 | 量大，验证公共读+防盗链下的流量表现 |
| 末批 | 合同/签章/决算类凭证（supplierSignet / 印章 / 电子签） | 回滚最难，等前三批稳定后再切 |

每批动作：
1. 打开该域的上传（全局开关已开时多数页面零改动；单页异常用 `args.ossOff` 回退）
2. 该域展示页过一遍（依赖阶段 1 自动识别，理论上零改动，抽查即可）
3. app 版同批走 `uploadFile.do` 代理通道（零 SDK，响应契约 `resUrl` 一致；后续再考虑 app 直传优化）
4. 观察一周再切下一批

**两类页面单独过：**
- 服务端要读文件内容的场景（不能假设本地盘有文件，改走 OSS SDK / 内网 endpoint）
- 导出嵌图/打印页（html2canvas 等跨域画图需桶配 CORS + `useCORS: true`）

### 阶段 3：存量迁移（可选，仅当要下线媒体服务）

- 不迁移也可长期共存：老文件留媒体服务自然衰减
- 若决定下线，按域写脚本：DB 清单下载 → ossutil 上传（**路径保持原相对路径结构**）→ 回写完整 URL
- 老路径再用 nginx rewrite 或 OSS 镜像回源兜底一个观察期
- 注意 ENC 字段不碰（同既有修数脚本纪律）

### 阶段 4：收口

1. 媒体服务只读冻结（确认无新写入后观察数周）→ 下线
2. `generatePostSignature` / `getProgressiveImage` 旧接口退役
3. 上传约束统一收口到 `oss.upload.*`（当前 5MB / 后缀白名单 jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx）
4. `upload-test.html` / `upload-test.js` 测试页保留但菜单不挂

---

## 四、Top 风险清单

| # | 风险 | 对策 |
|---|------|------|
| 1 | CORS 漏配 → 直传全灭 | 阶段 0 首项验收 |
| 2 | SDK 文件缺失静默降级 → 以为在走 OSS 实际还在本地 | 阶段 1 必须在测试页实证直传链路（抓包见 OSS 域名请求），别只看上传成功 |
| 3 | 公共读桶被盗链烧流量 | Referer 白名单与开公共读同步上 |
| 4 | 契约漂移 → 混进相对路径的 OSS key 白图 | 各批次评审盯住"落库必须是完整 URL" |
| 5 | 钉钉端/外网可达性 | `dmedia` 是钉钉媒体域不受影响；新 OSS 域名要在钉钉微应用 webview 里实测 |
| 6 | STS 凭证 15 分钟过期 vs 大文件分片 | 当前 maxFileSize=5MB 单传无虞；若放宽上限需复核有效期余量 |
| 7 | Struts multipart 中转目录 `/upload/tmp` | 仅代理通道的临时盘，不随迁移受影响，确认磁盘水位即可 |

---

## 五、执行清单（Checklist）

- [ ] 阶段 0：bucket / CORS / RAM 角色与 AK / 防盗链 / 生命周期 / `conf/oss.properties` 生产值
- [ ] 阶段 1：SDK 文件落盘 + `showImg` 自动识别 + `ossOff` 开关 + UTC 修复 + `config.ossConfig` 生产值 + 测试页冒烟
- [ ] 阶段 2：试点批（施工日记/公告）→ 二批（客服反馈族）→ 三批（主材/外辅/报价）→ 末批（合同/签章/决算）
- [ ] 阶段 3（可选）：存量迁移脚本 + 媒体服务下线
- [ ] 阶段 4：旧接口退役 + 约束收口
