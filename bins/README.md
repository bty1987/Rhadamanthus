# Rhadamanthus 可执行脚本目录

本目录包含项目开发、构建、编译过程中使用的各种可执行脚本。

## 📁 目录结构

### 📦 build/ - 构建脚本
项目的整体构建相关脚本。

**文件列表**：
- `build-decoration.bat` - Windows 装饰模块构建脚本
- `build-decoration.sh` - Linux/Mac 装饰模块构建脚本
- `build-maven.bat` - Maven 构建脚本

**使用场景**：
- 完整项目构建
- 生成部署包
- 依赖管理

---

### 🔨 compile/ - 编译脚本
源代码编译相关的脚本。

**文件列表**：
- `compile-decoration.bat` - 装饰模块编译（Windows 完整版）
- `compile-decoration-simple.bat` - 装饰模块编译（Windows 简化版）
- `compile-decoration-simple.sh` - 装饰模块编译（Linux/Mac 简化版）
- `compile-decoration-smart.sh` - 装饰模块编译（Linux/Mac 智能版）
- `compile-full.bat` - 完整编译脚本
- `compile_check.sh` - 编译检查脚本

**使用场景**：
- 编译 Java 源代码
- 增量编译
- 编译验证

---

### 🛠️ tools/ - 工具脚本
开发辅助工具和问题修复脚本。

**文件列表**：
- `fix-bom.bat` - 修复文件 BOM（字节顺序标记）问题（Windows）
- `fix_base64.py` - Base64 编码修复工具（Python 跨平台）
- `remove-bom.ps1` - 移除文件 BOM（PowerShell）

**使用场景**：
- 修复文件编码问题
- 清理源代码中的 BOM 标记
- 数据格式转换

---

### 📚 lib/ - 库管理脚本
依赖库和资源文件管理脚本。

**文件列表**：
- `copy-libs.bat` - 复制依赖库文件

**使用场景**：
- 管理第三方 JAR 包
- 资源文件复制
- 依赖库更新

---

## 🔧 使用指南

### Windows 用户

**批处理脚本 (.bat)**：
```cmd
REM 编译项目
cd bins\compile
compile-decoration.bat

REM 构建项目
cd ..\build
build-decoration.bat
```

**PowerShell 脚本 (.ps1)**：
```powershell
# 移除 BOM 标记
cd bins\tools
.\remove-bom.ps1
```

### Linux/Mac 用户

**Shell 脚本 (.sh)**：
```bash
# 添加执行权限
chmod +x bins/**/*.sh

# 编译项目
cd bins/compile
./compile-decoration-smart.sh

# 构建项目
cd ../build
./build-decoration.sh
```

**Python 脚本 (.py)**：
```bash
# 修复 Base64 编码
cd bins/tools
python fix_base64.py
```

---

## 📝 脚本命名规范

### 前缀命名
- `build-` - 构建相关
- `compile-` - 编译相关
- `fix-` - 问题修复
- `copy-` - 文件复制

### 后缀命名
- `.bat` - Windows 批处理脚本
- `.sh` - Linux/Mac Shell 脚本
- `.py` - Python 脚本（跨平台）
- `.ps1` - PowerShell 脚本

### 变体命名
- `simple` - 简化版本
- `smart` - 智能版本
- `full` - 完整版本
- `check` - 检查版本

---

## ⚠️ 注意事项

1. **执行权限**：Linux/Mac 用户需要先添加执行权限
   ```bash
   chmod +x bins/**/*.sh
   ```

2. **路径依赖**：部分脚本需要在项目根目录下执行

3. **环境要求**：
   - Windows: 需要 CMD 或 PowerShell
   - Linux/Mac: 需要 Bash 环境
   - Python 脚本需要 Python 2.7+ 或 3.x

4. **依赖工具**：
   - JDK 1.7+（编译脚本）
   - Maven 3.x（Maven 构建）
   - Python 2.7+/3.x（Python 工具）

---

## 🔄 更新日志

### 2025-01-05
- ✅ 创建 bins 目录结构
- ✅ 分类整理 13 个可执行脚本
  - 编译脚本: 6 个
  - 构建脚本: 3 个
  - 工具脚本: 3 个
  - 库管理脚本: 1 个

---

## 📧 维护者

如有问题或建议，请联系项目维护团队。
