#!/bin/bash
set -e

echo "开始编译检查..."

BUILD_DIR="build/classes"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# 设置 CLASSPATH (Windows 路径格式)
CLASSPATH="build/classes"
for jar in WebContent/WEB-INF/lib/*.jar; do
    CLASSPATH="$CLASSPATH:$jar"
done

echo "编译 core 模块..."
javac -encoding UTF-8 -d "$BUILD_DIR" -cp "$CLASSPATH" \
    src/com/fanglin/core/action/BaseAction.java \
    src/com/fanglin/core/action/BaseListAction.java \
    src/com/fanglin/core/interceptor/FLException.java \
    2>&1 | head -30

echo ""
echo "编译 decoration 模块 Action..."
javac -encoding UTF-8 -d "$BUILD_DIR" -cp "$CLASSPATH" \
    src/com/fanglin/decoration/action/DecorationAccountAction.java \
    src/com/fanglin/decoration/action/DecorationActivityItemAction.java \
    src/com/fanglin/decoration/action/DecorationBelongAction.java \
    src/com/fanglin/decoration/action/DecorationInfoAction.java \
    2>&1 | head -50

echo ""
echo "编译 payment 模块 Action..."
javac -encoding UTF-8 -d "$BUILD_DIR" -cp "$CLASSPATH" \
    src/com/fanglin/payment/action/DecorationPaymentAction.java \
    src/com/fanglin/payment/action/SalesPaymentAction.java \
    2>&1 | head -50

echo ""
echo "编译完成!"
echo "生成的 class 文件:"
find "$BUILD_DIR" -name "*.class" | wc -l
