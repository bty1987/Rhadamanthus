# scripts 目录说明

ERP 后台定时任务与数据导出/导入脚本集合。

> 📁 **目录结构约定**（2026-10-14 归类）：按族分子目录归档——`crond/` 定时任务族、
> `plan/` 计划任务族、`flask/` 部署脚本，根目录仅留仓库侧开发工具（i18n/菜单/加密等一次性工具）。
> `plan/`、`crond/` 为生产执行器 `/home/fanglin/cronbin/` 的归档镜像，同名冲突以目录内
> （执行器实况）为准；`config.json` 不入仓（执行器自备）。生产 `task.filepath` 为平铺绝对路径，
> **部署时将对应族脚本平铺摆放至执行器目录**，族内脚本与基建（plan_util.py 等）同目录，
> `config.json` 定位（`os.path.dirname(__file__)`）与 `from plan_util import *` 依赖不变。

---

## 一、生产任务脚本（plan_*）

由 `crond_plan_timing_handle.py` 每分钟轮询 `information.plan`，按 `task.filepath` +
`task.type`（python/sh/python3.7）拼装命令行启动。统一参数序：
`<解释器> <filepath> <pid> <args> <company>`，结果经 `updatePlanForAdvance.do` 回写进度。

### 导出类（plan_export_*）—— 查库写 Excel，上传文件服务器

| 脚本 | 说明 | 写入方式 |
|---|---|---|
| `plan_export_common.py` | **通用连表导出**（taskparam 元数据驱动，支持 kv 字典/防注入/分sheet） | packXlsxFile |
| `plan_export_balance_sales_sales.py` | 导出财务结算-销售 | exporter() |
| `plan_export_construction_drawline.py` | 导出放线信息 | exporter() |
| `plan_export_construction_info_pro.py` | 导出装修单信息 | exporter() |
| `plan_export_decoration_order_information.py` | 导出装修单信息（含业绩计算） | 手写+packXlsxFile |
| `plan_export_decoration_order_information_n.py` | 上者变体（内销/净业绩口径） | 手写+packXlsxFile |
| `plan_export_decoration_order_information_z.py` | 上者变体（另一口径） | 手写+packXlsxFile |
| `plan_export_decoration_order_midpack.py` | 导出装修单-半包 | exporter() |
| `plan_export_inventory_occessories_charge.py` | 导出外辅-费用 | exporter() |
| `plan_export_inventory_occessories_item.py` | 导出外辅-明细项 | exporter() |
| `plan_export_payment_advance_sales.py` | 导出预付款-销售 | exporter() |
| `plan_export_payment_invoice.py` | 导出发票/收据数据（含手机号解密） | exporter() |
| `plan_export_payment_sales.py` | 导出销售款 | exporter() |
| `plan_export_quotation_addreduce_item.py` | 导出报价增减项 | exporter() |
| `plan_export_quotation_function_area_item.py` | 导出报价功能区项目 | 手写+packXlsxFile |
| `plan_export_sales_balance.py` | 导出销售结算 | exporter() |
| `plan_export_sales_balance_item_sales.py` | 导出销售结算-购货明细 | exporter() |
| `plan_export_sales_oales.py` | 导出外销单业绩 | exporter() |

> 三种写入方式均已支持 **xlsx**（openpyxl，破除 65535 行上限）：
> - `exporter()` —— `plan_util.Util` 半通用方法，单 SQL 分页 + rower 后处理，自动 xlsx/分sheet/统一进度
> - `packXlsxFile` —— 手写循环直接调 xlsx 打包
> - `plan_export_common` —— taskparam 元数据全自动拼 SQL

### 导入/更新类（plan_import_* / plan_update_*）—— 读 Excel 写库

| 脚本 | 说明 |
|---|---|
| `plan_import_communion_user.py` | 导入人员 |
| `plan_import_data_aoods.py` | 导入商品 |
| `plan_import_data_aoods_charge.py` | 导入商品费用 |
| `plan_import_inventory_color.py` | 导入库存-颜色 |
| `plan_import_inventory_format.py` | 导入库存-规格 |
| `plan_import_inventory_goods.py` | 导入库存-商品 |
| `plan_import_inventory_price.py` | 导入库存-价格 |
| `plan_import_quotation_item.py` | 导入报价项目 |
| `plan_import_quotation_normoods.py` | 导入报价-定额商品 |
| `plan_import_quotation_normrice.py` | 导入报价-定额单价 |
| `plan_import_quotation_presign_price.py` | 导入报价-预签价 |
| `plan_update_data_goods_status.py` | 更新商品状态 |

> 导入类统一走 `plan_util.readFilesByline`，支持 **xls/xlsx** 双格式读取。

---

## 二、定时调度（crond_*）

由 Linux crontab 驱动的常驻/周期任务。

| 脚本 | 说明 | 触发 |
|---|---|---|
| `crond_plan_timing_handle.py` | **plan 任务调度器**：每分钟捞 `information.plan` 待执行项，按 filepath 启动对应脚本 | crontab `* * * * *` |
| `crond_message_queue_processor.py` | 消息队列处理（`information.messagequeuing` 延迟消息分发） | crontab 每分钟 |
| `crond_broker_report_check.py` | 经纪人报备保护检查 | 周期 |

---

## 三、基建（被其他脚本 import）

| 文件 | 说明 |
|---|---|
| `plan_util.py` | **核心工具类** `Util(Constant)`：DB 连接、分页、进度回调、Excel 读写（xls+xlsx）、文件打包上传、`exporter()` 半通用导出、`packXlsxFile` |
| `plan_zoo.py` | **常量基类** `Constant`：从 `communion.constant` 表加载字典，及内置业务字典（订单状态/付款类型/施工节点等） |
| `config.json` | 数据库/媒体服务器/pthost 配置（**gitignore，本地不提交，含敏感信息**） |

> 依赖链：`plan_export/import_*.py` → `plan_util(Util)` → `plan_zoo(Constant)` → `config.json`

---

## 四、开发工具（非生产依赖）

一次性或辅助工具，不在生产 task 表中，按需手动运行。

### i18n / 文档

| 脚本 | 说明 |
|---|---|
| `extract_i18n.py` | i18n HTML 抽取打标（半自动） |
| `apply_i18n_marks.py` | i18n HTML 自动打标（基于语言包回填 data-i18n） |
| `translate_menu.py` | i18n 菜单翻译生成器 |
| `check_menu.py` | 扫描 menu-{en,tw}.json 异常值 |
| `check_errorcode_consistency.py` | 错误码一致性校验 |
| `generate_error_json.py` | error.md → error-cn.json |
| `generate_constant_doc.py` | 从 constant 表生成常量文档 |
| `convert_rst_to_md.py` | RST toctree → Markdown 列表 |
| `fix_md_syntax.py` | 修复 MD 中 RST 语法残留 |

### 加密 / 数据

| 脚本 | 说明 |
|---|---|
| `jasypt_encrypt.py` / `jasypt_encrypt.js` | Jasypt 加密工具（Py/JS 双版本） |
| `migrate_sensitive_shadow.py` | 敏感字段 AES/CBC/PKCS5Padding 加密迁移 |
| `compare_fields.py` | 字段对比分析 |
| `download_contracts.py` | 查询合同数据下载 PDF（按公司分目录） |
| `tool_marge_project_code.py` | 增量代码同步工具 |

---

## 开发须知

### 新增一个普通导出任务（推荐路径）

无需写 Python，走通用脚本 `plan_export_common.py`：

1. `task.html` 建任务：filepath 填 `/home/fanglin/cronbin/py3/plan_export_common.py`、level=1（模块级）、type=2（py3）、plugins=A
2. `taskParam.html` 逐列配字段元数据（主表 ismain=0、从表 unionField、条件列 type=1、时间列 type=2、字典 handle）
3. 用户在 plan 页面勾字段、填时间/公司即可导出

详见 `docs/10-指南手册/GENERIC_EXPORT_DESIGN.md`。

### 新增一个定制导出脚本（特殊逻辑）

参照 `plan_export_payment_sales.py` 模板：实现 `sqler`（返回带 `%s` 列占位的 SQL）+ `rower`（行内后处理），main 调 `self.exporter(...)` 即可自动获得 xlsx/分sheet/统一进度。

### 依赖

- Python 3（生产 `/usr/local/bin/python3.7`）
- `pymysql`、`requests`、`openpyxl`、`xlrd`（读 .xls）、`xlwt`（仅历史写 .xls，新代码用 openpyxl）
- `config.json` 需手工放置（含 DB 连接、media、pthost、authentication）
