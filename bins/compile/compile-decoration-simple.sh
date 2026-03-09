#!/bin/bash

# 简化版 decoration 模块编译脚本

set -e

echo "开始编译 decoration 模块..."

# 设置变量
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="$PROJECT_DIR/build"
CLASSES_DIR="$BUILD_DIR/classes"
JAR_OUTPUT="$BUILD_DIR/decoration-module.jar"

# 清理并创建目录
rm -rf "$BUILD_DIR"
mkdir -p "$CLASSES_DIR"

# 设置 CLASSPATH
CLASSPATH="$CLASSES_DIR"
for jar in "$PROJECT_DIR"/project-libs/*.jar; do
    CLASSPATH="$CLASSPATH:$jar"
done
for jar in "$PROJECT_DIR"/build/lib/*.jar; do
    CLASSPATH="$CLASSPATH:$jar"
done

echo "CLASSPATH: $(echo $CLASSPATH | tr ':' '\n' | head -5)"

# 收集 decoration 模块源文件
echo "收集 decoration 模块源文件..."
find "$PROJECT_DIR/src/com/fanglin/decoration" -name "*.java" > "$BUILD_DIR/decoration-sources.txt"

# 检查源文件数量
SOURCE_COUNT=$(cat "$BUILD_DIR/decoration-sources.txt" | wc -l)
echo "找到 $SOURCE_COUNT 个 decoration 源文件"

if [ $SOURCE_COUNT -eq 0 ]; then
    echo "错误: 未找到 decoration 模块源文件"
    exit 1
fi

# 只编译 decoration 模块
echo "编译 decoration 模块..."
if javac -encoding UTF-8 -d "$CLASSES_DIR" -cp "$CLASSPATH" @"$BUILD_DIR/decoration-sources.txt" >"$BUILD_DIR/compile.log" 2>&1; then
    echo "✓ decoration 模块编译成功！"
else
    echo "❌ 编译失败，查看编译日志:"
    tail -20 "$BUILD_DIR/compile.log"
    exit 1
fi

# 检查编译结果
    echo "✓ decoration 模块编译成功！"

    # 打包 JAR
    echo "打包 JAR 文件..."
    cd "$CLASSES_DIR"

    # 确保目录存在
    mkdir -p "com/fanglin/decoration"

    # 移动编译后的 class 文件到正确位置
    find . -name "*.class" -path "./com/fanglin/decoration" -exec mv {} "com/fanglin/decoration/" \; 2>/dev/null || true

    # 打包
    if jar cvf "$JAR_OUTPUT" com/fanglin/decoration/ >/dev/null 2>&1; then
        echo "✓ JAR 打包成功: $JAR_OUTPUT"

        # 显示信息
        echo
        echo "文件大小: $(stat -f%s "$JAR_OUTPUT" 2>/dev/null || echo "未知") 字节"
        CLASS_COUNT=$(jar tf "$JAR_OUTPUT" 2>/dev/null | grep "\.class$" | wc -l || echo "0")
        echo "包含 $CLASS_COUNT 个 .class 文件"
        echo
        echo "🎉 成功生成 decoration-module.jar!"

        # 列出主要内容
        echo "主要模块:"
        jar tf "$JAR_OUTPUT" 2>/dev/null | grep "\.class$" | head -5 | while read -r line; do
            class_name=$(basename "$line" .class)
            echo "  - $class_name"
        done
    else
        echo "❌ JAR 打包失败"
    fi

    cd "$PROJECT_DIR"
else
    echo "❌ 编译失败，查看编译日志:"
    tail -20 "$BUILD_DIR/compile.log"
fi

echo "完成！"