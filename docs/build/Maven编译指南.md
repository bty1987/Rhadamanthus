# Maven 编译指南

## 📋 当前状态

✅ **已完成**：
- 根据 lib.txt 文件成功补充了 pom.xml 中的所有依赖
- 添加了 50+ 个缺失的依赖包
- 修复了版本兼容性问题
- 配置了 decoration 模块打包

⚠️ **存在的问题**：
- 第三方专有 JAR 包需要手动安装到本地 Maven 仓库
- 部分代码使用了 sun.misc 包（Java 7+ 内部 API）
- 测试代码需要额外的测试框架依赖

## 🚀 推荐的编译方式

### 方法一：使用批处理脚本（最简单）

```bash
# 在项目根目录执行
build-decoration.bat
```

这个脚本已经配置好了：
- 自动收集所有必要的依赖
- 编译 decoration 模块及其依赖
- 生成 `build/decoration-module.jar`

### 方法二：使用 Maven（需要先安装第三方 JAR）

1. **安装第三方 JAR 包**：

```bash
# 银盛支付 SDK
mvn install:install-file \
  -Dfile="E:/Ali/Athena/98.Jars/Other/yspay/nlpush_sdk_java-1.0.06.jar" \
  -DgroupId=com.newland \
  -DartifactId=nlpush-sdk-java \
  -Dversion=1.0.06 \
  -Dpackaging=jar

# 法大大 SDK
mvn install:install-file \
  -Dfile="E:/Ali/Athena/98.Jars/Other/fadada/fadada_api_sdk-1.7.17.1.jar" \
  -DgroupId=com.fadada \
  -DartifactId=fadada-api-sdk \
  -Dversion=1.7.17.1 \
  -Dpackaging=jar

# Base64 解码器
mvn install:install-file \
  -Dfile="E:/Ali/Athena/98.Jars/Other/yspay/sun.misc.base64decoder.jar" \
  -DgroupId=sun.misc \
  -DartifactId=base64decoder \
  -Dversion=1.0 \
  -Dpackaging=jar
```

2. **取消注释 pom.xml 中的依赖**：
   将第 518-536 行的注释取消

3. **编译项目**：
```bash
mvn clean package -Dmaven.test.skip=true
```

### 方法三：部分编译（如果只想编译核心模块）

```bash
# 只编译，跳过有问题的模块
mvn compile -Dmaven.test.skip=true -Dmaven.compiler.failOnError=false

# 打包 decoration 模块
mvn jar:jar -Dclassifier=decoration
```

## 📦 已添加的依赖

### 云存储服务
- 阿里云 OSS SDK (2.5.0)
- 华为云 OBS SDK (3.19.7)

### 支付相关
- Hutool 工具包 (4.6.8)
- 加密解密库 (BouncyCastle)

### HTTP/网络
- Apache HttpClient (4.5.5)
- HTTP MIME (文件上传)
- OkHttp (3.11.0)

### JSON处理
- Fastjson (1.2.47)
- Gson (2.8.5)

### 数据库相关
- C3P0 连接池
- Hibernate 3.6.10
- MySQL Connector (5.1.46)

### 测试框架
- JUnit 4.12
- Mockito 2.23.4
- Spring Test

## 🔧 常见问题解决

### 1. 依赖解析失败

如果遇到 "Could not resolve dependencies" 错误：

```bash
# 清理本地仓库缓存
mvn dependency:purge-local-repository -DreResolve=false

# 强制更新依赖
mvn clean install -U
```

### 2. 编译错误：找不到符号

如果遇到类找不到的错误，检查：
- 是否所有 JAR 包都已安装到本地仓库
- pom.xml 中的依赖是否已取消注释
- 是否正确配置了 Maven 本地仓库路径

### 3. Java 版本问题

项目使用 Java 7，确保：
```bash
java -version  # 应该是 1.7.x
javac -version # 应该是 1.7.x
```

## 📁 输出位置

- **批处理方式**：`build/decoration-module.jar`
- **Maven 方式**：`target/decoration-module.jar`
- **依赖复制**：`WebContent/WEB-INF/lib/`

## 📝 注意事项

1. **第三方 JAR 包**：银盛支付和法大大的 SDK 是专有的，需要从 `E:/Ali/Athena/98.Jars/Other/` 目录手动安装

2. **Java 版本**：项目配置为 Java 1.7，使用更高版本的 Java 可能会有兼容性问题

3. **测试代码**：测试代码需要额外的测试框架依赖，可以使用 `-Dmaven.test.skip=true` 跳过

4. **内存配置**：如果编译时内存不足，可以设置：
```bash
set MAVEN_OPTS=-Xmx1024m
mvn clean package
```

## 🎯 最佳实践建议

1. **使用批处理脚本**：`build-decoration.bat` 是最简单可靠的方式

2. **定期更新依赖**：关注依赖库的安全更新

3. **版本管理**：记录使用的 JAR 包版本，确保团队一致

4. **持续集成**：配置 CI/CD 流水线时，建议将第三方 JAR 包也纳入版本控制

---

## 📞 需要帮助？

如果编译过程中遇到问题，请：
1. 检查错误日志
2. 确认所有 JAR 包路径正确
3. 验证 Maven 配置
4. 使用 `mvn -X` 查看详细错误信息