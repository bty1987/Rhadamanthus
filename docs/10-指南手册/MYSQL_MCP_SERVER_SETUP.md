# MySQL MCP 服务器配置指南

## ✅ 已完成配置

### 1. MCP 配置文件
**位置**: `C:\Users\Admin\.claude\claude_desktop_config.json`

**配置内容**:
```json
{
  "mcpServers": {
    "mysql": {
      "command": "npx",
      "args": ["-y", "@benborla29/mcp-server-mysql"],
      "env": {
        "MYSQL_HOST": "192.168.5.21",
        "MYSQL_PORT": "3306",
        "MYSQL_USER": "root",
        "MYSQL_PASSWORD": "Neusoft!",
        "MYSQL_DATABASE": ""
      }
    }
  }
}
```

### 2. 数据库连接信息
- **主机**: 192.168.5.21
- **端口**: 3306
- **用户**: root
- **密码**: Neusoft!
- **数据库**: 未指定（可连接后选择）

---

## 📋 使用说明

### 第一步：重启 Claude Code

MCP 服务器配置已创建，需要**重启 Claude Code** 才能生效。

**操作步骤**:
1. 完全关闭 Claude Code 应用
2. 重新打开 Claude Code
3. MCP 服务器会自动启动

---

### 第二步：验证 MCP 服务器

重启后，MCP 服务器会自动加载。你可以通过以下方式验证：

**查看可用工具**:
- 在聊天框输入: `@mysql 可以做什么？`
- 或者: `@mysql 列出所有数据库`

---

## 🛠️ 可用的 MCP 工具

根据 `@benborla29/mcp-server-mysql` 的功能，应该支持以下操作：

### 1. 数据库查询
- 📊 查询数据
- 🔍 执行 SELECT 语句
- 📋 查看表结构

### 2. 元数据操作
- 📁 列出所有数据库
- 📄 列出所有表
- 🔎 查看表结构、字段信息
- 📑 查看索引信息

### 3. 只读限制
⚠️ **注意**: `read-only-local-mysql-mcp-server` 是**只读**版本
- ❌ 不能执行 INSERT、UPDATE、DELETE
- ❌ 不能修改表结构
- ✅ 只能执行 SELECT 和查询操作

---

## 💡 使用示例

### 示例 1：列出所有数据库
```
@mysql 列出所有数据库
```

### 示例 2：查询指定数据库
```
@mysql 连接到 customer 数据库，列出所有表
```

### 示例 3：查询表数据
```
@mysql 查询 customer 表的前 10 条记录
```

### 示例 4：查看表结构
```
@mysql 显示 decoration 表的结构
```

---

## 🔧 故障排查

### 问题 1：MCP 服务器未启动
**症状**: 重启后无法使用 @mysql

**解决方案**:
1. 检查配置文件路径是否正确
2. 检查网络连接是否正常（192.168.5.21）
3. 查看 Claude Code 的 MCP 服务器日志

### 问题 2：连接数据库失败
**症状**: 提示无法连接到数据库

**解决方案**:
1. 确认数据库服务器 IP 地址正确
2. 测试网络连通性: `ping 192.168.5.21`
3. 确认 MySQL 服务正在运行
4. 确认用户名密码正确

### 问题 3：权限不足
**症状**: 无法访问某些数据库或表

**解决方案**:
1. 联系数据库管理员授权
2. 确认 root 用户有足够的权限

---

## 📚 相关资源

### MCP 服务器包
- **包名**: `@benborla29/mcp-server-mysql`
- **版本**: 最新
- **NPM**: https://www.npmjs.com/package/@benborla29/mcp-server-mysql

### 官方文档
- **MCP 规范**: https://modelcontextprotocol.io/
- **Claude Code**: https://code.anthropic.com/

---

## ⚙️ 高级配置

### 修改连接信息

如果需要修改数据库连接信息，编辑配置文件：
```bash
notepad C:\Users\Admin\.claude\claude_desktop_config.json
```

### 连接到特定数据库

修改 `MYSQL_DATABASE` 字段：
```json
"MYSQL_DATABASE": "customer"
```

### 只读模式确认

此 MCP 服务器为**只读模式**，适合：
- ✅ 数据查询
- ✅ 报表生成
- ✅ 数据分析
- ❌ 数据修改（需要其他工具）

---

## 🎉 下一步

1. **重启 Claude Code** ← 重要！
2. **测试连接**: 输入 `@mysql 列出所有数据库`
3. **开始使用**: 享受便捷的数据库查询功能

如有问题，请查看配置文件或联系技术支持。
