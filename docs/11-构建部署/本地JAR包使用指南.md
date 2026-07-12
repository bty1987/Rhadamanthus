# 本地 JAR 包使用指南

## 📦 使用本地 JAR 包的配置

我已经配置了使用项目本地 `project-libs` 目录来管理第三方专有 JAR 包，这种方式更简单实用。

### ✅ 配置内容

1. **创建了 `project-libs/` 目录**
   - 位于项目根目录下
   - 专门存放第三方专有 JAR 包

2. **更新了 pom.xml 配置**
   - 使用 `system` scope 指定本地 JAR 包
   - 每个依赖都有明确的文件路径

3. **创建了复制脚本**
   - `copy-libs.bat` - 自动从源目录复制 JAR 包

## 🚀 使用步骤

### 方法一：使用复制脚本（推荐）

```cmd
# 在项目根目录运行
copy-libs.bat
```

这个脚本会自动：
- 从 `E:/Ali/Athena/98.Jars/Other/` 复制 JAR 包
- 创建 `project-libs/` 目录
- 显示复制结果

### 方法二：手动复制

如果自动脚本有问题，你可以手动复制：

**需要复制的文件**：
```
project-libs/
├── nlpush_sdk_java-1.0.06.jar          # 银盛支付 SDK
├── fadada_api_sdk-1.7.17.1.jar        # 法大大 SDK
└── sun.misc.base64decoder.jar          # Base64 解码器
```

**从以下位置复制**：
```
E:/Ali/Athena/98.Jars/Other/
├── yspay/nlpush_sdk_java-1.0.06.jar
├── fadada/fadada_api_sdk-1.7.17.1.jar
└── yspay/sun.misc.base64decoder.jar
```

### 方法三：如果你已经有 JAR 文件

直接将 JAR 文件放到 `project-libs/` 目录下，确保文件名正确：

- `nlpush_sdk_java-1.0.06.jar`
- `fadada_api_sdk-1.7.17.1.jar`
- `sun.misc.base64decoder.jar`

## 🔧 验证配置

复制完成后，检查文件是否存在：

```cmd
# 检查 project-libs 目录
dir project-libs

# 检查具体文件
if exist project-libs\nlpush_sdk_java-1.0.06.jar echo ✓ 银盛支付SDK存在
if exist project-libs\fadada_api_sdk-1.7.17.1.jar echo ✓ 法大大SDK存在
if exist project-libs\sun.misc.base64decoder.jar echo ✓ Base64解码器存在
```

## 🏃‍♂️ 开始编译

配置完成后，使用 Maven 编译：

```cmd
# 清理并编译
mvn clean compile -Dmaven.test.skip=true

# 打包 decoration 模块
mvn package -Dmaven.test.skip=true
```

## 📋 优势对比

| 特性 | 本地 lib 目录 | Maven 本地仓库 |
|------|---------------|---------------|
| ✅ 配置简单 | ✅ | ❌ |
| ✅ 无需额外安装 | ✅ | ❌ |
| ✅ 团队共享 | ✅ | ❌ |
| ❌ IDE 代码提示 | ⚠️ 部分 | ✅ |
| ❌ 标准化 | ⚠️ 非标准 | ✅ |

## 💡 注意事项

1. **文件名必须匹配**
   - pom.xml 中配置的文件名必须与实际文件名完全一致
   - 包括大小写和扩展名

2. **路径问题**
   - 使用相对路径 `${project.basedir}`
   - 在不同系统下都能正常工作

3. **版本管理**
   - 可以在文件名中包含版本号
   - pom.xml 中的 version 标识用于管理

4. **团队协作**
   - 将 `project-libs/` 目录加入版本控制
   - 或者在 README 中说明如何获取这些 JAR 包

## 🔄 更新 JAR 包

如果需要更新 JAR 包版本：

1. 替换 `project-libs/` 目录下的文件
2. 更新 pom.xml 中的 version 和文件名
3. 重新编译项目

## 🐛 故障排除

### 问题：Maven 找不到 JAR 包

**症状**：
```
Could not find artifact xxx
```

**解决**：
1. 检查文件是否存在于 `project-libs/` 目录
2. 检查 pom.xml 中的文件名是否正确
3. 检查路径是否使用了正确的分隔符

### 问题：IDE 提示找不到类

**解决**：
1. 重新导入 Maven 项目
2. 刷新依赖
3. 确认 IDE 能识别本地 JAR 包

### 问题：编译通过但运行失败

**可能原因**：
1. JAR 包版本不匹配
2. 缺少运行时依赖
3. 类加载器问题

## 📞 需要帮助？

如果配置过程中遇到问题：
1. 检查 JAR 文件是否完整
2. 确认文件名和路径正确
3. 查看详细的编译错误信息

**推荐步骤**：
1. 运行 `copy-libs.bat` 复制 JAR 包
2. 确认文件复制成功
3. 运行 `mvn clean compile` 测试编译