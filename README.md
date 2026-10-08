# Rhadamanthus — 方林装饰 ERP 系统

> 服务于装饰装修行业的多公司（多租户）ERP 平台：覆盖从客户线索 → 报价 → 装修订单 → 施工 → 主材销售 → 财务结算 → 售后的完整业务闭环，支撑集团及数十家分子公司协同运营。

---

## 一、项目简介

- **业务定位**：装饰装修行业全流程 ERP —— 客源管理、报价设计、装修订单、施工管理、主材销售/购货、财务结算、人事薪资、审批流、报表平台
- **多租户架构**：以 `communion.company` 为租户根，业务数据按 `company` 列隔离，支撑集团-分公司两级组织
- **开放能力**：SSO 单点登录（授权码模式）、钉钉/企业微信/微信集成、电子签（e签宝/法大大）、威富通/银联支付、阿里云 OSS、金蝶对接、施工摄像头（萤石）
- **开发模式**：小步快跑的持续迭代仓库，业务模块以独立 jar 热替换部署，SQL 脚本与代码同仓库版本化管理

## 二、技术栈

| 层 | 技术 | 版本 |
|-----|------|------|
| 语言 | Java | 1.8 |
| Web 框架 | Struts2 | 2.5.16 |
| IoC/AOP | Spring | 4.3.17.RELEASE |
| ORM | Hibernate | 3.6.10.Final |
| 数据库 | MySQL | 5.x（多 schema：communion/decoration/quotation/...） |
| 前端 | Ace Admin + jQuery + LayUI + i18n | — |
| 应用服务器 | Tomcat | 7.0.88 |
| 构建 | 自研模块化构建脚本（非 Maven） | bins/build |

> 早期框架版本为既定事实，项目策略是「框架老不是病根，同功能写两遍/状态人肉对账才是」——壳按模块渐进替换，业务规则不重写，前端新老双版并行（WebContent 老版为主、app/ 为 layui 实验版）。

## 三、模块全景（src/com/fanglin/）

| 业务域 | 模块 |
|--------|------|
| 装修主链 | `decoration` 装修订单 · `quotation` 报价 · `construction` 施工 · `sales` 主材销售 · `material` 主材 · `balance` 财务结算 · `payment` 款项收付 · `production` 生产 · `building` 楼盘 |
| 客户与营销 | `customer` 客户 · `communion` 通讯/基础数据 · `market` 营销卡券 · `report` 报表平台 |
| 组织与人事 | `personel` 人事 · `salary` 薪资 · `system` 系统管理 · `right` 权限 · `approval` 审批 · `finance` 财务 · `kingdee` 金蝶 |
| 供应链 | `store` 门店物料 · `inventory` 库存 · `data` 基础数据（商品/定额/共享项） · `imports`/`exports` 导入导出 |
| 集成与开放 | `seiya` 开放平台/SSO · `dingding`/`wechat`/`wecom` 钉钉微信企微 · `elecsign`/`esign`/`fadada` 电子签 · `swiftpass`/`yspay` 支付 · `aliyun` OSS · `camera` 施工摄像头 · `factory` 厂商对接 · `postar` · `market` |
| 基础设施 | `core` 框架核心（拦截器/DAO 基类/异常） · `utils` 工具集 · `common` 登录认证 · `log` 操作/登录日志 · `timer` 定时任务 · `secret` 密钥 |

## 四、目录结构

```
Rhadamanthus/
├── src/com/fanglin/        # 全部 Java 源码（Action/Service/DAO/PO/VO 分层）
├── WebContent/             # 老版前端主战场（views/js/assets）+ WEB-INF
│   ├── js/api/             #   接口注册中心（url + tranargs 金额换算声明）
│   ├── js/com/             #   公共组件（constant/validate/com 等）
│   └── views/              #   按模块组织的页面
├── app/                    # layui 实验版前端（渐进迁移验证场）
├── conf/                   # Spring/Struts/数据源/系统参数配置
├── docs/                   # 项目文档（见下方文档地图）
├── sqls/                   # 生产 SQL 脚本（按模块目录，随代码同仓版本化）
├── bins/                   # 构建/部署/依赖归集脚本（见 bins/BUILD_README.md）
├── AGENTS.md               # AI Agent 开发规范（分层/命名/错误码/事务/Git 约定）
└── WebContent/CLAUDE.md    # 前端架构说明
```

## 五、构建与部署

项目**不使用 Maven**（无 pom.xml），采用自研模块化构建：

```bat
:: 编译并打包单个业务模块（模块名 = src\com\fanglin\ 下的目录名）
bins\build\build-module.bat <模块名> <版本号>

:: 例：打包装修模块
bins\build\build-module.bat decoration 8.3.031.000
```

- 产物：`target/fanglin-<模块名>-<版本号>.jar`（仅含该模块 class，公共包在 Tomcat lib）
- 模块 jar 支持生产热替换；**SQL 脚本与 jar 的上线顺序在每个 SQL 文件头注释中标明**
- 依赖 jar 归集：`bins/lib/gather-libs.bat`（详见 [bins/BUILD_README.md](bins/BUILD_README.md)）
- 全量编译 + war：`bins/build/build-all.bat`

## 六、开发规范

- **[AGENTS.md](AGENTS.md)** — 开发规范总纲：分层调用约定、方法命名（`动词+对象+By条件+For目的`，page/query 硬规则）、FLException 错误码登记制、Action 异常处理豁免清单、事务管理、Git 提交约定
- **[方法命名规范](docs/10-指南手册/METHOD_NAMING_CONVENTION.md)** — 2963 个方法名统计支撑的命名细则
- **[Operation 收集关闸 SOP](docs/10-指南手册/OPERATION_COLLECT_CUTOVER_SOP.md)** — 接口权限治理流程（operation/roleoperation 两级闸）
- 关键惯例：金额 ×1000 存储整型、字段命名 `isXxx` 布尔 / `xxxStatus` 状态机、复用 status 枚举优于加列、SQL 参数化查询、手机号/证件号 AES 加密存储

## 七、文档地图

文档总入口：**[docs/INDEX.md](docs/INDEX.md)**（16 类分类目录全量索引）

| 目录 | 内容 |
|------|------|
| `docs/01-方案设计/` | 功能设计方案（含实施状态标注） |
| `docs/02-需求功能/` | 需求与功能实现文档 |
| `docs/03-API文档/` | 对外/对内接口文档（含 SSO 对接、error.md 错误码总表） |
| `docs/04-问题修复/` | 线上问题诊断与修复记录 |
| `docs/05-优化性能/` | 性能优化 |
| `docs/06-重构改造/` | 重构记录 |
| `docs/07-总结报告/` | 阶段总结 |
| `docs/08-安全加密/` | 加密体系与安全治理 |
| `docs/09-SQL脚本/` | 数据修复与维护脚本 |
| `docs/10-指南手册/` | 开发指南与 SOP（命名规范/关闸 SOP/设计文档等） |
| `docs/11-构建部署/` | 构建部署 |
| `docs/12-规范标准/` | 规范标准 |
| `docs/13-集成同步/` | 三方集成与数据同步 |
| `docs/14-分析调研/` | 分析调研 |
| `mover/` | 前端迁移文档集 |

各业务模块的领域速查文档位于 `src/com/fanglin/[模块]/CLAUDE.md`，前端架构见 [WebContent/CLAUDE.md](WebContent/CLAUDE.md)。

## 八、快速启动（开发环境）

1. JDK 1.8 + Tomcat 7 + MySQL 5.x
2. 配置数据库连接 `conf/jdbc.properties`（多 schema 结构见脚本注释）
3. IDE 导入源码目录，依赖 jar 见 `WebContent/WEB-INF/lib/`（缺失执行 `bins/lib/gather-libs.bat`）
4. 部署至 Tomcat，访问 `http://localhost:8080/Rhadamanthus/login.html`
5. 改动业务模块后用 `bins/build/build-module.bat` 出对应 jar 热替换验证

---

> **声明**：本项目为方林装饰内部业务系统，仓库与文档仅面向内部开发与维护人员。
