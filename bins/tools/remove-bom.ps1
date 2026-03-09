# 移除Java文件BOM字符的PowerShell脚本

$files = @(
    'src\com\fanglin\production\service\impl\UserWorkflowServiceImpl.java',
    'src\com\fanglin\store\service\impl\McolorServiceImpl.java',
    'src\com\fanglin\system\service\impl\SystemConfigServiceImpl.java',
    'src\com\fanglin\approval\service\impl\ApprovalManifestDBServiceImpl.java',
    'src\com\fanglin\approval\service\impl\ApprovalDecorationBelongServiceImpl.java',
    'src\com\fanglin\approval\service\impl\ApprovalQuotationDiscountServiceImpl.java',
    'src\com\fanglin\data\quotation\dao\impl\FunctionAreaDaoImpl.java',
    'src\com\fanglin\approval\service\impl\ApprovalSalesDiscountServiceImpl.java'
)

$fixed = 0
$total = $files.Count

Write-Host '开始移除Java文件的BOM字符...' -ForegroundColor Green
Write-Host ''

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "正在处理: $file" -ForegroundColor Yellow

        try {
            # 读取文件内容（不包含BOM）
            $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
            $content = [System.IO.File]::ReadAllText($file, $utf8NoBom)
            # 写回文件（不包含BOM）
            [System.IO.File]::WriteAllText($file, $content, $utf8NoBom)

            Write-Host '    ✓ 已移除BOM字符' -ForegroundColor Green
            $fixed++
        } catch {
            Write-Host "    ✗ 处理失败: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "文件不存在: $file" -ForegroundColor Red
    }
    Write-Host ''
}

Write-Host "处理完成！" -ForegroundColor Green
Write-Host "共处理 $total 个文件，成功修复 $fixed 个文件" -ForegroundColor Cyan
Read-Host "按任意键继续..."