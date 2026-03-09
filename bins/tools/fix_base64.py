#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re

# 需要修复的文件列表
files_to_fix = [
    'src/com/fanglin/fadada/tools/FddEncryptTool.java',
    'src/com/fanglin/utils/WMCodeUtil.java',
    'src/com/fanglin/utils/QRCodeUtil.java',
    'src/com/fanglin/yspay/utils/RSAUtil.java',
    'src/com/fanglin/swiftpass/utils/VerifyRespSignature.java'
]

# 修复模式
patterns = [
    (r'import\s+sun\.misc\.BASE64Decoder;', 'import java.util.Base64;'),
    (r'import\s+sun\.misc\.BASE64Encoder;', ''),
    (r'new\s+BASE64Decoder\(\)', 'Base64.getDecoder()'),
    (r'new\s+BASE64Encoder\(\)', 'Base64.getEncoder()'),
    (r'\.decodeBuffer\(', '.decode('),
    (r'\.encode\(', '.encodeToString(')
]

def fix_file(file_path):
    if not os.path.exists(file_path):
        print(f"文件不存在: {file_path}")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 添加 Base64 import（如果不存在）
    if 'import java.util.Base64;' not in content:
        # 找到第一个 import 语句的位置
        import_match = re.search(r'package\s+[\w.]+;', content)
        if import_match:
            package_end = import_match.end()
            # 在 package 语句后添加 import
            content = content[:package_end] + '\n\nimport java.util.Base64;' + content[package_end:]

    # 应用所有修复模式
    for pattern, replacement in patterns:
        content = re.sub(pattern, replacement, content)

    # 保存文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"已修复: {file_path}")

# 修复所有文件
for file_path in files_to_fix:
    fix_file(file_path)

print("\n所有文件修复完成！")