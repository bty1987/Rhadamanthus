#!/bin/bash

# ========================================
# 编译并打包 decoration 模块
# Linux/WSL 版本
# ========================================

set -e  # 遇到错误立即退出

# 设置项目路径
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC_DIR="$PROJECT_DIR/src"
BUILD_DIR="$PROJECT_DIR/build"
CLASSES_DIR="$BUILD_DIR/classes"
JAR_OUTPUT="$BUILD_DIR/decoration-module.jar"

echo "========================================"
echo "开始构建 decoration 模块"
echo "========================================"
echo

# 检查 Java 环境
echo "[1/5] 检查 Java 环境..."
if ! command -v java &> /dev/null; then
    echo "错误: 未找到 Java 环境，请确保 JDK 已安装并配置到 PATH"
    exit 1
fi

if ! command -v javac &> /dev/null; then
    echo "错误: 未找到 javac 编译器，请确保安装的是 JDK 而非 JRE"
    exit 1
fi

echo "Java 版本: $(java -version 2>&1 | head -1)"
echo "javac 版本: $(javac -version 2>&1)"
echo "Java 环境检查通过"
echo

# 创建构建目录
echo "[2/5] 创建构建目录..."
rm -rf "$BUILD_DIR"
mkdir -p "$CLASSES_DIR"
echo "构建目录创建完成"
echo

# 收集所有 JAR 依赖
echo "[3/5] 收集依赖库..."
CLASSPATH="$CLASSES_DIR"

# 添加 project-libs 中的 JAR
if [ -d "$PROJECT_DIR/project-libs" ]; then
    for jar in "$PROJECT_DIR"/project-libs/*.jar; do
        CLASSPATH="$CLASSPATH:$jar"
    done
    echo "已添加 project-libs 中的 JAR 文件"
fi

# 添加 build/lib 中的 JAR
if [ -d "$PROJECT_DIR/build/lib" ]; then
    for jar in "$PROJECT_DIR"/build/lib/*.jar; do
        CLASSPATH="$CLASSPATH:$jar"
    done
    echo "已添加 build/lib 中的 JAR 文件"
fi

echo "CLASSPATH 包含 $(echo $CLASSPATH | tr ':' '\n' | wc -l) 个路径"
echo

# 生成源文件列表
echo "[4/5] 收集源文件..."
SOURCE_LIST="$BUILD_DIR/sources.txt"
rm -f "$SOURCE_LIST"

# 收集所有需要的模块源文件
echo "收集依赖模块源文件..."
find "$SRC_DIR/com/fanglin/core" -name "*.java" >> "$SOURCE_LIST" 2>/dev/null || true
find "$SRC_DIR/com/fanglin/utils" -name "*.java" >> "$SOURCE_LIST" 2>/dev/null || true
find "$SRC_DIR/com/fanglin/communion" -name "*.java" >> "$SOURCE_LIST" 2>/dev/null || true
find "$SRC_DIR/com/fanglin/personel" -name "*.java" >> "$SOURCE_LIST" 2>/dev/null || true
find "$SRC_DIR/com/fanglin/customer" -name "*.java" >> "$SOURCE_LIST" 2>/dev/null || true
find "$SRC_DIR/com/fanglin/building" -name "*.java" >> "$SOURCE_LIST" 2>/dev/null || true
find "$SRC_DIR/com/fanglin/quotation" -name "*.java" >> "$SOURCE_LIST" 2>/dev/null || true
find "$SRC_DIR/com/fanglin/data" -name "*.java" >> "$SOURCE_LIST" 2>/dev/null || true
find "$SRC_DIR/com/fanglin/system" -name "*.java" >> "$SOURCE_LIST" 2>/dev/null || true
find "$SRC_DIR/com/fanglin/approval" -name "*.java" >> "$SOURCE_LIST" 2>/dev/null || true
find "$SRC_DIR/com/fanglin/balance" -name "*.java" >> "$SOURCE_LIST" 2>/dev/null || true
find "$SRC_DIR/com/fanglin/payment" -name "*.java" >> "$SOURCE_LIST" 2>/dev/null || true
find "$SRC_DIR/com/fanglin/right" -name "*.java" >> "$SOURCE_LIST" 2>/dev/null || true
find "$SRC_DIR/com/fanglin/sales" -name "*.java" >> "$SOURCE_LIST" 2>/dev/null || true
find "$SRC_DIR/com/fanglin/construction" -name "*.java" >> "$SOURCE_LIST" 2>/dev/null || true
find "$SRC_DIR/com/fanglin/material" -name "*.java" >> "$SOURCE_LIST" 2>/dev/null || true
find "$SRC_DIR/com/fanglin/decoration" -name "*.java" >> "$SOURCE_LIST" 2>/dev/null || true

echo "找到 $(cat "$SOURCE_LIST" | wc -l) 个 Java 文件"

# 开始编译
echo "开始编译（这可能需要几分钟）..."
if ! javac -encoding UTF-8 -d "$CLASSES_DIR" -cp "$CLASSPATH" -Xlint:none @"$SOURCE_LIST" >"$BUILD_DIR/compile-errors.log" 2>&1; then
    echo "✓ 编译成功"
    echo

    # 打包 JAR 文件（只包含 decoration 模块）
    echo "[5/5] 打包 JAR 文件..."
    cd "$CLASSES_DIR"
    if jar cvf "$JAR_OUTPUT" com/fanglin/decoration/ >/dev/null 2>&1; then
        echo "✓ JAR 打包成功: $JAR_OUTPUT"

        # 显示文件信息
        if [ -f "$JAR_OUTPUT" ]; then
            echo "文件大小: $(stat -f%s "$JAR_OUTPUT") 字节"
        fi

        # 列出 JAR 内容概览
        echo
        echo "JAR 包内容概览:"
        CLASS_COUNT=$(jar tf "$JAR_OUTPUT" | grep "com/fanglin/decoration.*\.class" | wc -l)
        echo "- 包含 $CLASS_COUNT 个 .class 文件"

        echo
        echo "主要包含的模块:"
        jar tf "$JAR_OUTPUT" | grep "\.class" | grep -v "\$" | head -10 | while read -r line; do
            module=$(echo "$line" | cut -d'/' -f3-4 | tr '/' '.')
            if [ -n "$module" ] && [ "$module" != "" ]; then
                echo "  - $module"
            fi
        done

        echo
        echo "🎉 decoration 模块 JAR 包已成功创建！"
        echo "输出位置: $JAR_OUTPUT"
    else
        echo "❌ JAR 打包失败"
        exit 1
    fi

    cd "$PROJECT_DIR"
else
    echo
    echo "❌ 编译失败！"
    echo "错误日志已保存到: $BUILD_DIR/compile-errors.log"
    echo
    echo "错误详情："
    head -50 "$BUILD_DIR/compile-errors.log"
    echo

    echo
    read -p "按 Enter 键退出..."
fi

echo
echo "========================================"
echo "构建完成！"
echo "========================================"