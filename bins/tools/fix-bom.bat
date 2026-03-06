@echo off
chcp 65001 >nul
echo 开始移除Java文件的BOM字符...
echo.

setlocal enabledelayedexpansion

set "files[0]=src\com\fanglin\production\service\impl\UserWorkflowServiceImpl.java"
set "files[1]=src\com\fanglin\store\service\impl\McolorServiceImpl.java"
set "files[2]=src\com\fanglin\system\service\impl\SystemConfigServiceImpl.java"
set "files[3]=src\com\fanglin\approval\service\impl\ApprovalManifestDBServiceImpl.java"
set "files[4]=src\com\fanglin\approval\service\impl\ApprovalDecorationBelongServiceImpl.java"
set "files[5]=src\com\fanglin\approval\service\impl\ApprovalQuotationDiscountServiceImpl.java"
set "files[6]=src\com\fanglin\data\quotation\dao\impl\FunctionAreaDaoImpl.java"
set "files[7]=src\com\fanglin\approval\service\impl\ApprovalSalesDiscountServiceImpl.java"

set /a count=8
set /a fixed=0

for /l %%i in (0,1,7) do (
    set "filepath=\!files[%%i]\!"
    if exist "\!filepath\!" (
        echo 正在处理: \!filepath\!

        rem 使用PowerShell移除BOM
        powershell -Command " = [System.IO.File]::ReadAllText('\!filepath\!', [System.Text.UTF8Encoding]::new()); [System.IO.File]::WriteAllText('\!filepath\!', , [System.Text.UTF8Encoding]::new())"

        if \!errorlevel\! equ 0 (
            echo    ✓ 已移除BOM字符
            set /a fixed+=1
        ) else (
            echo    ✗ 处理失败
        )
        echo.
    ) else (
        echo 文件不存在: \!filepath\!
        echo.
    )
)

echo 处理完成！
echo 共处理 %count% 个文件，成功修复 %fixed% 个文件
echo.
pause
