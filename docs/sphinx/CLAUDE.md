# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Sphinx API 文档项目

### 项目概述

`docs/sphinx/` 是方林装饰 ERP 系统（Rhadamanthus）的 API 技术文档项目，使用 Sphinx 文档生成工具维护。该文档遵循 RESTful 风格，描述了方林开放平台（FOP - Fanglin Open Platform）的完整 API 接口规范。

**文档定位**：
- 目标受众：对接方林 ERP 系统的第三方开发者、内部开发人员
- 文档范围：Java 后端 API 接口定义、数据类型、请求/响应格式、错误代码、编码规范
- 文档格式：reStructuredText (RST)
- 输出格式：HTML（在线文档）、PDF（离线文档）

---

## 快速开始

### 环境准备

1. **安装 Sphinx**
   ```bash
   # Python 环境要求：Python 2.7+ 或 Python 3.x
   pip install sphinx
   ```

2. **验证安装**
   ```bash
   sphinx-build --version
   ```

### 构建文档

```bash
# 进入文档目录
cd docs/sphinx

# 构建 HTML 文档（输出到 _build/html/）
sphinx-build -b html . _build/html

# 构建 PDF 文档（需要 LaTeX 支持）
sphinx-build -b latex . _build/latex
cd _build/latex
make

# 清理构建文件
sphinx-build -M clean . _build
```

### 查看文档

```bash
# 本地预览 HTML 文档
# Windows
start _build/html/index.html

# Linux/Mac
open _build/html/index.html
```

---

## 文档架构

### 目录结构

```
docs/sphinx/
├── conf.py              # Sphinx 配置文件（主题、扩展、中文支持）
├── index.rst            # 文档主索引（定义目录结构）
├── format.rst           # 通讯格式说明（HTTP 协议、JSON 响应格式）
├── check_rule.rst       # API 参数校验规则（分页、过滤条件、数据类型）
├── standard.rst         # 编码规范（Java/HTML/JavaScript 代码规范）
├── error.rst            # 错误代码表（所有 API 错误码定义）
├── log.rst              # 变更记录（API 版本历史）
├── tools.rst            # 开发工具列表（JDK、Tomcat、MySQL 等版本）
├── LICENSE              # Apache License 2.0
├── modules/             # 模块 API 文档目录
│   ├── common.rst       # 通用模块（登录、验证码、菜单、文件上传）
│   ├── system.rst       # 系统模块（用户、角色、权限、区域）
│   ├── user.rst         # 员工模块（员工信息、部门、岗位）
│   ├── data.rst         # 数据字典模块（报价基础数据、材料定额）
│   ├── decoration.rst   # 装修订单模块（核心业务模块）
│   ├── quotation.rst    # 报价管理模块
│   ├── construction.rst # 施工管理模块
│   ├── sales.rst        # 主材销售模块
│   ├── material.rst     # 材料管理模块
│   ├── customer.rst     # 客户管理模块
│   ├── building.rst     # 楼盘管理模块
│   ├── balance.rst      # 财务结算模块
│   ├── finance.rst      # 财务管理模块
│   ├── payment.rst      # 支付管理模块
│   ├── inventory.rst    # 进销存模块
│   ├── production.rst   # 生产管理模块
│   ├── market.rst       # 商城模块
│   ├── information.rst  # 信息管理模块（公告、消息）
│   ├── approval.rst     # 审批流程模块
│   ├── salary.rst       # 薪资管理模块
│   ├── report.rst       # 报表统计模块
│   ├── right.rst        # 权限管理模块
│   └── dingtalk.rst     # 钉钉集成模块
└── _build/              # 构建输出目录（生成后）
    ├── html/            # HTML 格式输出
    └── latex/           # LaTeX/PDF 格式输出
```

---

## 文档编写规范

### RST 语法要点

#### 1. 类定义（数据类型）

```rst
.. class:: api.common.LoginAction

    +---------+
    |DataType:|
    +---------+

    .. data:: role

    :param rid: 角色ID
    :type rid: Integer
    :param name: 角色名
    :type name: String
```

#### 2. 方法定义（API 接口）

```rst
.. method:: <I> doLogin

    登陆，同时获取登陆结果信息。

    +---------+
    |Requests:|
    +---------+

    :param userId: 登陆用户编号
    :type userId: String
    :param password: 登陆密码
    :type password: String

    Example::

        {
            userId: "U001",
            password: "password"
        }

    +--------+
    |Returns:|
    +--------+

    :param authentication: 权限码
    :type authentication: String

    Example::

        {
            "authentication": "FCA5C7A2DA9EDA010A7ECD3DCE2"
        }
```

#### 3. 方法访问类型标识

- `<I>` - 内部接口（Internal）：需要登录认证
- `<A>` - 公开接口（Anonymous）：无需认证
- `<C>` - 自定义接口（Custom）：特殊逻辑处理

#### 4. 交叉引用

```rst
# 引用数据类型
:param role: 用户角色对象，类型 :data:`role`

# 引用其他文档
参见 :ref:`common` 通用模块
```

---

## 核心规范速查

### API 通讯格式

**请求格式**：
- URL：`https://域名/接口名称.do`
- HTTP 方法：GET 或 POST
- 返回格式：JSON 或 download（文件下载）

**响应格式**：
```json
{
    "errorCode": 0,
    "errorMsg": null,
    "paging": {
        "data": [],
        "page": 1,
        "rows": 10,
        "totalPage": 10,
        "totalRecords": 100
    },
    "userId": "X-00001",
    "userName": "XXX",
    "company": 0
}
```

### 分页参数规范

**请求参数**：
- `paging.page` - 分页偏移量（从 1 开始）
- `paging.rows` - 单页数量

**响应参数**：
- `paging.data` - 数据结果集
- `paging.page` - 当前页码
- `paging.rows` - 单页数量
- `paging.totalPage` - 总页数
- `paging.totalRecords` - 总记录数

### 查询过滤规范

```json
{
    "filters[0].field": "orderId",
    "filters[0].data": "1501010001",
    "filters[0].op": "eq"
}
```

**操作符（op）**：
- `eq` - 等于
- `ne` - 不等于
- `gt` - 大于
- `lt` - 小于
- `ge` - 大于等于
- `le` - 小于等于
- `cn` - 模糊查询（LIKE）
- `in` - IN 查询

### 错误代码规范

**通用错误码**：
- `0` - 成功
- `-1` - 无操作权限
- `-2` - 数据冲突
- `-3` - 文件上传失败

**业务错误码**：
- `110xxx` - 系统模块错误
- `120xxx` - 施工模块错误
- `130xxx` - 装修模块错误
- `140xxx` - 报价模块错误
- `150xxx` - 主材模块错误
- `160xxx` - 财务模块错误

---

## 编码规范要点

### Java 编码规范

1. **文件组织**：
   - 开头注释（类名、版本、日期、版权、作者、邮箱、说明）
   - 包语句：`com.fanglin.*`
   - 引入语句
   - 类/接口声明

2. **命名规范**：
   - 类名：驼峰式，首字母大写（`CustomerService`）
   - 方法名：驼峰式，首字母小写（`getUserInfo`）
   - 变量名：驼峰式，首字母小写（`userName`）
   - 常量名：全大写，下划线分隔（`MAX_WIDTH`）

3. **排版规范**：
   - 缩进：4 个空格
   - 行长度：128 字符（最长不超过 160）
   - 大括号：左大括号在行尾，右大括号另起一行

### HTML 编码规范

1. **文档类型**：`<!DOCTYPE html>`
2. **脚本加载**：主页面将 `<script>` 标签加到 `</body>` 之前
3. **引号**：使用双引号 `""`
4. **语义化**：根据元素初始意义使用（heading、p、a 标签）
5. **关注点分离**：
   - 不使用行内样式 `<style>`
   - 不使用行内脚本 `<script>`
   - 不使用表象元素（`<b>`、`<u>`、`<center>`）

---

## 开发工作流

### 添加新 API 文档

1. **确定模块归属**：在 `modules/` 目录找到对应的 `.rst` 文件
2. **定义数据类型**：如果需要新数据结构，在 `DataType` 部分添加
3. **定义接口方法**：使用 `.. method::` 指令，填写请求参数、响应格式
4. **更新索引**：在 `index.rst` 中确保模块已包含在目录树中

### 修改现有 API

1. **定位文档位置**：使用 Grep 工具搜索接口名称
2. **更新文档内容**：修改参数、返回值或说明
3. **更新变更记录**：在 `log.rst` 中添加修改日期和说明
4. **重新构建文档**：运行 `sphinx-build -b html . _build/html`

### 版本管理

- **文档版本**：在 `conf.py` 中配置 `version = '1.0'` 和 `release = '1.0'`
- **变更记录**：所有 API 变更必须在 `log.rst` 中记录日期和内容
- **错误码管理**：新增错误码需在 `error.rst` 中登记

---

## 常用命令

```bash
# 完整构建流程
cd docs/sphinx
sphinx-build -b html . _build/html

# 仅检查文档语法（不构建）
sphinx-build -W -b html . _build/html

# 生成 PDF（需要 LaTeX）
sphinx-build -b latex . _build/latex
cd _build/latex && make

# 实时预览（需要 sphinx-autobuild）
pip install sphinx-autobuild
sphinx-autobuild . _build/html
```

---

## 注意事项

1. **字符编码**：所有 `.rst` 文件必须使用 UTF-8 编码
2. **中文支持**：`conf.py` 已配置 XeLaTeX 中文支持（Microsoft YaHei 字体）
3. **索引连续性**：列表参数（如 `filters[n]`）索引必须从 0 开始连续
4. **示例代码**：所有 JSON 示例必须格式化，便于阅读
5. **参数验证**：参考 `check_rule.rst` 确保参数定义符合校验规则

---

## 参考资料

- [Sphinx 官方文档](https://www.sphinx-doc.org/)
- [reStructuredText 语法](http://docutils.sourceforge.net/rst.html)
- 项目根文档：`../../CLAUDE.md`（Rhadamanthus 系统架构）
- API 接口文档：`../API.md`（前后端接口规范）
