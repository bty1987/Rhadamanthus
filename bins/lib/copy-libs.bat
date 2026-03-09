@echo off
chcp 65001 >nul
echo ========================================
echo 复制第三方 JAR 包到项目本地目录
echo ========================================
echo.

REM 设置源目录和目标目录
set SOURCE_DIR=E:/Ali/Athena/98.Jars/Other
set TARGET_DIR=%~dp0project-libs

REM 创建目标目录
echo 创建目录: %TARGET_DIR%
if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"
echo.

REM 复制银盛支付 SDK
echo [1/4] 复制银盛支付 SDK...
if exist "%SOURCE_DIR%\yspay\nlpush_sdk_java-1.0.06.jar" (
    copy "%SOURCE_DIR%\yspay\nlpush_sdk_java-1.0.06.jar" "%TARGET_DIR%\"
    echo ✓ 复制 nlpush_sdk_java-1.0.06.jar
) else (
    echo ✗ 文件不存在: nlpush_sdk_java-1.0.06.jar
)

if exist "%SOURCE_DIR%\yspay\sun.misc.base64decoder.jar" (
    copy "%SOURCE_DIR%\yspay\sun.misc.base64decoder.jar" "%TARGET_DIR%\"
    echo ✓ 复制 sun.misc.base64decoder.jar
) else (
    echo ✗ 文件不存在: sun.misc.base64decoder.jar
)
echo.

REM 复制法大大 SDK
echo [2/4] 复制法大大 SDK...
if exist "%SOURCE_DIR%\fadada\fadada_api_sdk-1.7.17.1.jar" (
    copy "%SOURCE_DIR%\fadada\fadada_api_sdk-1.7.17.1.jar" "%TARGET_DIR%\"
    echo ✓ 复制 fadada_api_sdk-1.7.17.1.jar
) else if exist "%SOURCE_DIR%\fadada\fadada_api_sdk.jar" (
    copy "%SOURCE_DIR%\fadada\fadada_api_sdk.jar" "%TARGET_DIR%\fadada_api_sdk-1.7.17.1.jar"
    echo ✓ 复制 fadada_api_sdk.jar (重命名为 fadada_api_sdk-1.7.17.1.jar)
) else (
    echo ✗ 文件不存在: fadada_api_sdk.jar
)
echo.

REM 复制华为云 OBS (如果需要)
echo [3/4] 检查华为云 OBS...
if exist "%SOURCE_DIR%\hwyun-obs\" (
    echo 发现华为云 OBS目录，复制相关JAR包...
    if exist "%SOURCE_DIR%\hwyun-obs\esdk-obs-java-3.19.7.jar" (
        copy "%SOURCE_DIR%\hwyun-obs\esdk-obs-java-3.19.7.jar" "%TARGET_DIR%\"
        echo ✓ 复制 esdk-obs-java-3.19.7.jar
    )

    if exist "%SOURCE_DIR%\hwyun-obs\okhttp-3.11.0.jar" (
        copy "%SOURCE_DIR%\hwyun-obs\okhttp-3.11.0.jar" "%TARGET_DIR%\"
        echo ✓ 复制 okhttp-3.11.0.jar
    )

    if exist "%SOURCE_DIR%\hwyun-obs\okio-1.14.0.jar" (
        copy "%SOURCE_DIR%\hwyun-obs\okio-1.14.0.jar" "%TARGET_DIR%\"
        echo ✓ 复制 okio-1.14.0.jar
    )
)
echo.

REM 复制阿里云 OSS (如果需要)
echo [4/4] 检查阿里云 OSS...
if exist "%SOURCE_DIR%\aliyun-oss\" (
    echo 发现阿里云 OSS目录，复制相关JAR包...
    if exist "%SOURCE_DIR%\aliyun-oss\aliyun-sdk-oss-2.5.0.jar" (
        copy "%SOURCE_DIR%\aliyun-oss\aliyun-sdk-oss-2.5.0.jar" "%TARGET_DIR%\"
        echo ✓ 复制 aliyun-sdk-oss-2.5.0.jar
    )

    if exist "%SOURCE_DIR%\aliyun-oss\jdom-1.1.jar" (
        copy "%SOURCE_DIR%\aliyun-oss\jdom-1.1.jar" "%TARGET_DIR%\"
        echo ✓ 复制 jdom-1.1.jar
    )
)
echo.

REM 显示结果
echo ========================================
echo 复制完成！
echo.
echo 当前项目JAR目录: %TARGET_DIR%
echo 已复制的文件:
for %%f in ("%TARGET_DIR%\*.jar") do echo   - %%~nxf
echo ========================================
echo.
echo 现在可以运行 Maven 编译:
echo   mvn clean compile -Dmaven.test.skip=true
echo.
pause