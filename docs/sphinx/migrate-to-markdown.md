# Sphinx RST 转 Markdown 迁移指南

## 方案选择

### ✅ 推荐方案：MyST-Parser（混合模式）

**优势**：
- Sphinx 官方支持的 Markdown 解析器
- RST 和 Markdown 可以**共存**（渐进式迁移）
- 支持 Markdown 的高级语法（交叉引用、角色、指令）
- 保留原有的 `conf.py` 配置

**适用场景**：
- 想要逐步迁移，不想一次性转换所有文件
- 需要保留 RST 的高级特性（如自定义指令）
- 团队成员对 Markdown 更熟悉


## 安装步骤

### 1. 安装 MyST-Parser

```bash
pip install myst-parser
```

### 2. 修改 `conf.py` 配置

在 `docs/sphinx/conf.py` 中添加：

```python
# 添加 Markdown 支持
source_suffix = {
    '.rst': 'restructuredtext',
    '.md': 'markdown',
}

# 添加 MyST-Parser 扩展
extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.intersphinx',
    'sphinx.ext.ifconfig',
    'sphinx.ext.viewcode',
    'myst_parser',  # 新增：支持 Markdown
]

# MyST-Parser 配置（可选）
myst_enable_extensions = [
    "colon_fence",    # 支持 ::: fenced blocks
    "deflist",        # 支持定义列表
    "dollarmath",     # 支持 $ 数学公式
]

myst_heading_anchors = 3  # 为标题生成锚点
```


## 迁移流程

### 阶段 1：验证环境（不转换任何文件）

```bash
# 1. 安装依赖
pip install myst-parser

# 2. 测试构建（现有 RST 文件应该正常工作）
cd docs/sphinx
sphinx-build -b html . _build/html

# 3. 检查输出
start _build/html/index.html
```

### 阶段 2：转换单个文件测试

**选择一个简单的文件测试**，例如 `tools.rst`：

```bash
# 使用 Pandoc 转换
pip install pandoc
pandoc tools.rst -o tools.md --wrap=none
```

**手动调整转换后的 Markdown**：

```markdown
<!-- tools.rst 原始格式 -->
.. _tools:

# 工具
## 开发环境

<!-- tools.md 转换后格式 -->
# 工具开发环境
```

### 阶段 3：RST → Markdown 语法映射

| RST 语法 | Markdown 等价语法 | 说明 |
| `.. _label:` | `# Heading` | 锚点定义 |
| `## name` | `:::{class} name` 或注释 | 类定义 |
| `### name` | `### method:: name` | 方法定义 |
| `#### name` | `### data:: name` | 数据定义 |
| `- **name**:` | `- **name**` | 参数说明 |
| `  - 类型: `` | `- *type*` | 类型说明 |
| `::` （代码块） | ` ``` ` | 代码块 |
| `.. note::` | `:::{note}` 或 `> **Note:**` | 注释块 |
| `[label](#label)` | `[](#label)` | 交叉引用 |

**示例对比**：

**RST 格式**（`common.rst`）：
```rst
## api.common.LoginAction

**数据类型**:

#### role
    - **rid**:角色ID
      - 类型: `Integer
```

**Markdown 格式**（`common.md`）：
```markdown
## api.common.LoginAction

### DataType

#### data:: role

- **rid** (*Integer*) - 角色ID
```

### 阶段 4：批量转换脚本

创建自动化脚本 `convert-rst-to-md.py`：

```python
#!/usr/bin/env python
"""
批量转换 RST 文件到 Markdown
"""
import os
import subprocess
from pathlib import Path

# 要转换的文件列表
FILES_TO_CONVERT = [
    'tools.rst',
    'format.rst',
    'check_rule.rst',
    # 逐个添加，测试后再继续
]

def convert_rst_to_md(rst_file):
    """使用 Pandoc 转换单个文件"""
    md_file = rst_file.replace('.rst', '.md')

    print(f"转换 {rst_file} -> {md_file}")

    # Pandoc 转换命令
    result = subprocess.run([
        'pandoc',
        rst_file,
        '-o', md_file,
        '--wrap=none',  # 不自动换行
        '--atx-headers',  # 使用 # 标题格式
    ], capture_output=True, text=True)

    if result.returncode == 0:
        print(f"✅ 成功：{md_file}")
        return True
    else:
        print(f"❌ 失败：{result.stderr}")
        return False

def main():
    os.chdir('docs/sphinx')

    for rst_file in FILES_TO_CONVERT:
        if os.path.exists(rst_file):
            convert_rst_to_md(rst_file)
        else:
            print(f"⚠️  文件不存在：{rst_file}")

if __name__ == '__main__':
    main()
```


## 验证构建

```bash
# 构建包含 Markdown 的文档
sphinx-build -b html . _build/html

# 注意观察输出中的 "WARNING" 信息
```


## 更新 index.rst

将 `.rst` 引用改为 `.md`：

```rst

    log.md      # 改为 .md
    format.md
    check_rule.md
    standard.md
    error.md
    tools.md

    ./modules/common.md  # 模块文件也可以转换
    ./modules/system.md
    # ...
```


## 注意事项

### ⚠️ 语法差异

1. **交叉引用**：
   - RST: `[common](#common)`
   - MD: `[](#common)` 或 `[common](common.md)`

2. **表格语法**：
   - RST: 使用网格表格
   - MD: 使用 pipe 表格（功能有限）

3. **代码块**：
   - RST: ````java`
   - MD: ` ```java `

### 🔧 需要手动调整的部分

1. **自定义指令**（如 `.. class::`、`.. method::`）需要使用 MyST 的 fenced blocks：
   ```markdown
   ::::{class} api.common.LoginAction
   ::::
   ```

2. **参数表格**需要手动格式化：
   ```markdown
   | 参数 | 类型 | 说明 |
      | rid | Integer | 角色ID |
   ```

3. **包含指令**（`.. include::`）在 Markdown 中不支持，需要改用 MyST 的包含语法。


## 回退方案

如果转换后出现问题，可以随时回退：

```bash
# 删除生成的 .md 文件
git clean -f *.md

# 或者保留原文件，在 conf.py 中指定优先使用 .rst
source_suffix = {
    '.rst': 'restructuredtext',
    '.md': 'markdown',
}
# Sphinx 会优先使用 .rst 文件
```


## 推荐迁移顺序

1. ✅ **第一阶段**（简单文件）：
   - `tools.rst` → `tools.md`
   - `log.rst` → `log.md`

2. ✅ **第二阶段**（规范文件）：
   - `format.rst` → `format.md`
   - `check_rule.rst` → `check_rule.md`
   - `standard.rst` → `standard.md`

3. ✅ **第三阶段**（模块文件）：
   - `modules/common.rst` → `modules/common.md`
   - `modules/system.rst` → `modules/system.md`
   - 其他模块文件...


## 资源链接

- [MyST-Parser 官方文档](https://myst-parser.readthedocs.io/)
- [Sphinx Markdown 支持](https://www.sphinx-doc.org/en/master/usage/markdown.html)
- [Pandoc 文档](https://pandoc.org/)
- [RST 到 Markdown 语法映射](https://myst-parser.readthedocs.io/en/latest/syntax/roles-and-directives.html)
