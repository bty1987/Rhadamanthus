#!/bin/bash

# 智能 decoration 模块编译脚本
# 自动检测依赖并分步编译

set -e

echo "🚀 开始智能编译 decoration 模块..."

# 设置变量
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="$PROJECT_DIR/build"
CLASSES_DIR="$BUILD_DIR/classes"
JAR_OUTPUT="$BUILD_DIR/decoration-module.jar"

echo "========================================"
echo "第1步: 检查环境"
echo "========================================"
echo

# 检查 Java 环境
if ! command -v java &> /dev/null; then
    echo "❌ 错误: 未找到 Java 环境"
    exit 1
fi
echo "✅ Java 版本: $(java -version 2>&1 | head -1)"
echo

# 清理并创建目录
echo "第2步: 准备构建目录"
rm -rf "$BUILD_DIR"
mkdir -p "$CLASSES_DIR"
mkdir -p "$BUILD_DIR/logs"
mkdir -p "$PROJECT_DIR/project-libs"

# 复制 JAR 文件（如果不存在）
if [ ! -f "$PROJECT_DIR/project-libs/nlpush_sdk_java-1.0.06.jar" ]; then
    echo "复制 JAR 文件从 build/lib/..."
    cp build/lib/nlpush_sdk_java-1.0.06.jar "$PROJECT_DIR/project-libs/"
    cp build/lib/fadada_api_sdk-1.7.17.1.jar "$PROJECT_DIR/project-libs/"
    cp build/lib/sun.misc.base64decoder.jar "$PROJECT_DIR/project-libs/"
    echo "✅ 已复制必需的 JAR 文件"
fi

# 设置 CLASSPATH
echo "第3步: 配置依赖路径"
CLASSPATH="$CLASSES_DIR"
for jar in "$PROJECT_DIR"/project-libs/*.jar "$PROJECT_DIR"/build/lib/*.jar; do
    CLASSPATH="$CLASSPATH:$jar"
done
echo "CLASSPATH 包含 $(echo $CLASSPATH | tr ':' '\n' | wc -l) 个路径"

# 设置 SRC_DIR 变量
SRC_DIR="$PROJECT_DIR/src"

# 统计依赖模块
echo "第4步: 检测依赖模块"
DEP_MODULES="core utils communion personel customer building quotation system approval personel payment information"
for module in $DEP_MODULES; do
    if [ -d "$SRC_DIR/com/fanglin/$module" ]; then
        echo "✅ 找到模块: $module"
        find "$SRC_DIR/com/fanglin/$module" -name "*.java" >> "$BUILD_DIR/all-sources.txt" 2>/dev/null || true
    fi
done

# 检查 decoration 模块
echo "第5步: 准备 decoration 源文件"
if [ ! -d "$SRC_DIR/com/fanglin/decoration" ]; then
    echo "❌ 错误: decoration 模块目录不存在"
    exit 1
fi

find "$SRC_DIR/com/fanglin/decoration" -name "*.java" > "$BUILD_DIR/decoration-sources.txt"
SOURCE_COUNT=$(cat "$BUILD_DIR/decoration-sources.txt" | wc -l)
echo "找到 $SOURCE_COUNT 个 decoration 源文件"

echo "第6步: 编译 decoration 模块（分步骤进行）"

# 创建编译阶段
PHASES=(
    "core"
    "utils"
    "communion"
    "personel"
    "customer"
    "building"
    "quotation"
    "data"
    "system"
    "approval"
    "personel"
    "payment"
    "sales"
    "construction"
    "material"
    "decoration"
)

TOTAL_PHASES=${#PHASES[@]}
PHASE_CURRENT=0

for phase in "${PHASES[@]}"; do
    PHASE_CURRENT=$((PHASE_CURRENT + 1))
    echo "阶段 $PHASE_CURRENT/${#TOTAL_PHASES}: 编译 $phase 模块依赖"

    if [ -d "$SRC_DIR/com/fanglin/$phase" ]; then
        echo "  - 找到 $phase 模块，编译中..."

        # 收集该模块的源文件
        PHASE_SOURCES="$BUILD_DIR/phase-${phase}-sources.txt"
        find "$SRC_DIR/com/fanglin/$phase" -name "*.java" > "$PHASE_SOURCES" 2>/dev/null || true

        COUNT=$(cat "$PHASE_SOURCES" | wc -l)
        if [ $COUNT -gt 0 ]; then
            echo "    找到 $COUNT 个文件"

            # 尝试编译该模块
            echo "    测试编译 $phase 模块..."
            if javac -encoding UTF-8 -d "$CLASSES_DIR" -cp "$CLASSPATH" @"$PHASE_SOURCES" >"$BUILD_DIR/phase-${phase}-compile.log" 2>&1; then
                echo "    ✅ $phase 模块编译成功"
                # 如果成功，添加到主源文件列表
                cat "$PHASE_SOURCES" >> "$BUILD_DIR/compiled-sources.txt"
            else
                echo "    ❌ $phase 模块编译失败"
                echo "    错误: $(head -10 "$BUILD_DIR/phase-${phase}-compile.log")"
            fi
        else
            echo "    - $phase 模块不存在，跳过"
        fi
    else
        echo "    - $phase 模块不存在，跳过"
    fi
    echo
done

# 合并所有源文件
echo "第7步: 合并所有源文件..."
if [ -f "$BUILD_DIR/compiled-sources.txt" ]; then
    cat "$BUILD_DIR/compiled-sources.txt" > "$BUILD_DIR/all-sources.txt"
fi
cat "$BUILD_DIR/decoration-sources.txt" >> "$BUILD_DIR/all-sources.txt" 2>/dev/null || true
echo "总源文件数: $(cat "$BUILD_DIR/all-sources.txt" | wc -l)"

# 最终编译
echo "第8步: 执行最终编译..."
echo "编译中（这需要几分钟）..."

if javac -encoding UTF-8 -d "$CLASSES_DIR" -cp "$CLASSPATH" @"$BUILD_DIR/all-sources.txt" >"$BUILD_DIR/final-compile.log" 2>&1; then
    echo "✅ 所有模块编译完成！"

    # 打包 JAR 文件
    echo "第9步: 打包 JAR 文件..."
    cd "$CLASSES_DIR"

    # 确保目录结构正确
    mkdir -p "com/fanglin/decoration/"

    # 移动所有编译结果到正确位置
    find . -name "*.class" -type f 2>/dev/null | while read -r f; do
        REL_PATH="${f#./}"
        if [[ "$REL_PATH" == com/fanglin/decoration/* ]]; then
            # 已经在正确位置，不需要移动
            echo "  - 保留: $f"
        fi
    done

    # 打包
    if jar cvf "$JAR_OUTPUT" com/fanglin/ >/dev/null 2>&1; then
        echo "✅ JAR 打包成功: $JAR_OUTPUT"

        # 显示文件信息
        if [ -f "$JAR_OUTPUT" ]; then
            echo "文件大小: $(stat -f%s "$JAR_OUTPUT" 2>/dev/null || echo "未知") 字节"
        fi

        # 统计 class 文件数量
        CLASS_COUNT=$(jar tf "$JAR_OUTPUT" 2>/dev/null | grep "\.class$" | wc -l || echo "0")
        echo "包含 $CLASS_COUNT 个 .class 文件"
        echo

        # 显示主要模块
        echo
        echo "主要包含的模块:"
        jar tf "$JAR_OUTPUT" | grep "com/fanglin/" | grep "\.class$" | head -10 | while read -r line; do
            class_name=$(basename "$line" .class)
            module=$(echo "$line" | cut -d'/' -f2-4 | tr '/' '.')
            if [ "$module" != "" ] && [ "$module" != "com" ]; then
                echo "  - $module"
            fi
        done

        echo
        echo "🎉 decoration-module.jar 已成功创建！"
        echo "输出位置: $JAR_OUTPUT"

    else
        echo "❌ JAR 打包失败"
    fi

    cd "$PROJECT_DIR"
else
    echo "❌ 编译失败！"
    echo "错误详情:"
    tail -20 "$BUILD_DIR/final-compile.log"
fi

echo
echo "========================================"
echo "编译状态检查"
echo "========================================"

# 检查 JAR 文件
if [ -f "$JAR_OUTPUT" ]; then
    echo "✅ JAR 文件: $JAR_OUTPUT"
    file "$JAR_OUTPUT" | head -1 | grep -E "Java|archive|data" || echo "非JAR文件"

    # 检查内容
    CLASS_COUNT=$(jar tf "$JAR_OUTPUT" 2>/dev/null | grep "\.class$" | wc -l)
    echo "✅ 包含 $CLASS_COUNT 个 class 文件"

    # 列出主要包
    echo "主要包结构:"
    jar tf "$JAR_OUTPUT" 2>/dev/null | grep "/$" | grep -E "^com/fanglin/" | head -10 | sort | uniq
else
    echo "❌ JAR 文件不存在"
fi

echo
echo "编译日志位置: $BUILD_DIR/final-compile.log"
echo "源文件列表: $BUILD_DIR/all-sources.txt"
echo
echo "Classes 目录: $CLASSES_DIR"
echo

echo
if [ -f "$BUILD_DIR/final-compile.log" ]; then
    ERROR_COUNT=$(grep -c "error:" "$BUILD_DIR/final-compile.log" || echo "0")
    WARNING_COUNT=$(grep -c "warning:" "$BUILD_DIR/final-compile.log" || echo "0")
    INFO_COUNT=$(grep -c "INFO" "$BUILD_DIR/final-compile.log" || echo "0")

    echo
    echo "编译日志统计:"
    echo "  - 错误: $ERROR_COUNT"
    echo "  - 警告: $WARNING_COUNT"
    echo "  - 信息: $INFO_COUNT"

    if [ $ERROR_COUNT -gt 0 ]; then
        echo
        echo "主要错误:"
        grep "ERROR" "$BUILD_DIR/final-compile.log" | head -10
    fi
fi

echo "========================================"