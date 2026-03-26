#!/bin/bash

# ========================================
# Rhadamanthus - 通用模块打包脚本
# ========================================
# 功能：打包指定模块为独立的 JAR 文件
# 使用方法：./build-module.sh <module_name>
# 示例：./build-module.sh inventory
# ========================================

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 检查参数
if [ -z "$1" ]; then
    echo "=========================================="
    echo "Rhadamanthus - 通用模块打包脚本"
    echo "=========================================="
    echo ""
    echo "使用方法："
    echo "  $0 <module_name>"
    echo ""
    echo "支持的模块："
    echo "  inventory      - 库存管理模块"
    echo "  quotation      - 报价管理模块"
    echo "  seiya          - 星野系统模块"
    echo "  sales          - 销售管理模块"
    echo "  construction   - 施工管理模块"
    echo "  decoration     - 装修管理模块"
    echo "  business-modules - 所有业务模块"
    echo ""
    echo "示例："
    echo "  $0 decoration"
    echo "  $0 inventory"
    echo ""
    exit 1
fi

MODULE_NAME=$1

# 检查模块是否有效
VALID_MODULES=("inventory" "quotation" "seiya" "sales" "construction" "decoration" "business-modules")

is_valid=false
for module in "${VALID_MODULES[@]}"; do
    if [ "$module" = "$MODULE_NAME" ]; then
        is_valid=true
        break
    fi
done

if [ "$is_valid" = false ]; then
    print_error "无效的模块名称: $MODULE_NAME"
    echo ""
    echo "支持的模块：${VALID_MODULES[*]}"
    exit 1
fi

echo "=========================================="
echo "开始打包 $MODULE_NAME 模块..."
echo "=========================================="

# 检查 Maven 是否安装
if ! command -v mvn &> /dev/null; then
    print_error "Maven 未安装"
    echo "请先安装 Maven：https://maven.apache.org/download.cgi"
    exit 1
fi

# 检查 Java 是否安装
if ! command -v java &> /dev/null; then
    print_error "Java 未安装"
    echo "请先安装 JDK 1.8 或更高版本"
    exit 1
fi

# 显示版本信息
echo ""
echo "环境检查："
echo "  Maven 版本: $(mvn -version | head -1)"
echo "  Java 版本: $(java -version 2>&1 | head -1)"
echo "  打包模块: $MODULE_NAME"
echo ""

# 清理旧的构建
echo "步骤 1: 清理旧的构建..."
mvn clean

# 编译指定模块
echo ""
echo "步骤 2: 编译 $MODULE_NAME 模块..."
if mvn compile -P $MODULE_NAME; then
    print_success "编译成功"
else
    print_error "编译失败"
    exit 1
fi

# 打包 JAR
echo ""
echo "步骤 3: 打包 JAR 文件..."
if mvn package -P $MODULE_NAME -DskipTests; then
    print_success "打包成功"
else
    print_error "打包失败"
    exit 1
fi

# 检查构建产物
echo ""
echo "步骤 4: 检查构建产物..."
if [ -f "target/rhadamanthus-1.0.0.jar" ]; then
    JAR_SIZE=$(du -h target/rhadamanthus-1.0.0.jar | cut -f1)
    print_success "JAR 文件已生成"
    echo "   文件: target/rhadamanthus-1.0.0.jar"
    echo "   大小: $JAR_SIZE"
else
    print_error "JAR 文件未生成"
    exit 1
fi

# 显示 JAR 内容摘要
echo ""
echo "步骤 5: JAR 内容摘要..."
jar tf target/rhadamanthus-1.0.0.jar | grep "^com/fanglin/" | grep -v "^com/fanglin/test/" | cut -d'/' -f1-4 | sort -u | head -20 | while read line; do
    echo "  - $line"
done

# 复制依赖到 WebContent/WEB-INF/lib（可选）
echo ""
echo "步骤 6: 复制依赖到 WebContent/WEB-INF/lib..."
if mvn dependency:copy-dependencies -P $MODULE_NAME -DoutputDirectory=WebContent/WEB-INF/lib; then
    DEP_COUNT=$(ls -1 WebContent/WEB-INF/lib/*.jar 2>/dev/null | wc -l)
    print_success "已复制 $DEP_COUNT 个依赖到 WebContent/WEB-INF/lib"
else
    print_warning "依赖复制失败（可能不影响使用）"
fi

echo ""
echo "=========================================="
print_success "$MODULE_NAME 模块打包完成！"
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
