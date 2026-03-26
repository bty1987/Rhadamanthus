#!/bin/bash

# ========================================
# Rhadamanthus - Decoration 模块打包脚本
# ========================================
# 功能：打包 decoration 模块为独立的 JAR 文件
# 使用方法：./build-decoration-jar.sh
# ========================================

set -e  # 遇到错误立即退出

echo "=========================================="
echo "开始打包 decoration 模块..."
echo "=========================================="

# 检查 Maven 是否安装
if ! command -v mvn &> /dev/null; then
    echo "❌ 错误：Maven 未安装"
    echo "请先安装 Maven：https://maven.apache.org/download.cgi"
    exit 1
fi

# 检查 Java 是否安装
if ! command -v java &> /dev/null; then
    echo "❌ 错误：Java 未安装"
    echo "请先安装 JDK 1.8 或更高版本"
    exit 1
fi

# 显示版本信息
echo ""
echo "环境检查："
echo "  Maven 版本: $(mvn -version | head -1)"
echo "  Java 版本: $(java -version 2>&1 | head -1)"
echo ""

# 清理旧的构建
echo "步骤 1: 清理旧的构建..."
mvn clean

# 编译 decoration 模块
echo ""
echo "步骤 2: 编译 decoration 模块..."
mvn compile -P decoration

# 打包 JAR
echo ""
echo "步骤 3: 打包 JAR 文件..."
mvn package -P decoration -DskipTests

# 检查构建产物
echo ""
echo "步骤 4: 检查构建产物..."

if [ -f "target/rhadamanthus-1.0.0.jar" ]; then
    JAR_SIZE=$(du -h target/rhadamanthus-1.0.0.jar | cut -f1)
    echo "✅ JAR 文件已生成: target/rhadamanthus-1.0.0.jar"
    echo "   文件大小: $JAR_SIZE"
else
    echo "❌ 错误：JAR 文件未生成"
    exit 1
fi

# 显示 JAR 内容摘要
echo ""
echo "步骤 5: JAR 内容摘要..."
jar tf target/rhadamanthus-1.0.0.jar | grep "^com/fanglin/decoration/" | wc -l | xargs echo "  decoration 模块文件数:"
jar tf target/rhadamanthus-1.0.0.jar | grep "^com/fanglin/common/" | wc -l | xargs echo "  common 模块文件数:"
jar tf target/rhadamanthus-1.0.0.jar | grep "^com/fanglin/core/" | wc -l | xargs echo "  core 模块文件数:"

# 复制依赖到 WebContent/WEB-INF/lib（可选）
echo ""
echo "步骤 6: 复制依赖到 WebContent/WEB-INF/lib..."
mvn dependency:copy-dependencies -P decoration -DoutputDirectory=WebContent/WEB-INF/lib

# 统计依赖数量
DEP_COUNT=$(ls -1 WebContent/WEB-INF/lib/*.jar 2>/dev/null | wc -l)
echo "✅ 已复制 $DEP_COUNT 个依赖到 WebContent/WEB-INF/lib"

echo ""
echo "=========================================="
echo "✅ decoration 模块打包完成！"
echo "=========================================="
echo ""
echo "生成的文件："
echo "  - target/rhadamanthus-1.0.0.jar"
echo "  - WebContent/WEB-INF/lib/*.jar (依赖库)"
echo ""
echo "下一步："
echo "  1. 将 JAR 文件复制到 Tomcat 的 webapps/Rhadamanthus/WEB-INF/lib/"
echo "  2. 重启 Tomcat"
echo "  3. 验证功能正常"
echo ""
