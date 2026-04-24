#!/usr/bin/env python3
# migrate_sensitive_shadow.py
# 存量敏感数据 → 影子表 分批迁移脚本
#
# 运行方式: crontab 每分钟执行一次，或手动循环执行
#   * * * * * cd /path/to/script && python3 migrate_sensitive_shadow.py >> migrate.log 2>&1
#
# 特性:
#   - 每次执行处理一批 (默认1000条)
#   - 原表只读，不修改任何数据
#   - 影子表同时存储明文和密文
#   - 游标续跑: 从影子表 MAX(id_col) 取上次位置，避免重复扫描
#   - 支持校验模式: 解密密文与明文比对
#   - 支持重置: reset 命令清空影子表重新迁移

import pymysql
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import base64
import time
import sys
from datetime import datetime

# ========== 数据库配置 ==========
DB_HOST = 'your-db-host'
DB_PORT = 3306
DB_USER = 'migration_user'
DB_PASS = 'your-password'
DB_NAME = 'communion'

# ========== 密钥配置 ==========
# 旧密钥 (用于解密已加密的 phone 字段)
LEGACY_KEY = b'b4d617b336124c63'
LEGACY_IV  = b'b4d1a58a416957a5'

# 新密钥V1 (与 KeyManager.java 中的 encryptKeyV1/encryptIvV1 一致)
NEW_KEY = b'xxxxxxxxxxxxxxxx'  # TODO: 替换为实际新密钥 (16字节)
NEW_IV  = b'xxxxxxxxxxxxxxxx'  # TODO: 替换为实际新IV   (16字节)

# ========== 迁移参数 ==========
BATCH_SIZE = 1000          # 每批处理记录数
ENCRYPT_PREFIX = "ENC(V1:"
ENCRYPT_SUFFIX = ")"

# ========== AES 加解密 ==========

def aes_encrypt(plaintext, key, iv):
    """AES/CBC/PKCS5Padding 加密，返回 Base64 字符串"""
    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded = pad(plaintext.encode('utf-8'), AES.block_size)
    encrypted = cipher.encrypt(padded)
    return base64.b64encode(encrypted).decode('utf-8')

def aes_decrypt(ciphertext_b64, key, iv):
    """AES/CBC/PKCS5Padding 解密，输入 Base64 字符串"""
    raw = base64.b64decode(ciphertext_b64)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    decrypted = unpad(cipher.decrypt(raw), AES.block_size)
    return decrypted.decode('utf-8')

def is_old_encrypted(value):
    """判断是否为旧格式加密数据 (纯 Base64，无 ENC() 前缀)"""
    if not value or len(value) < 10:
        return False
    try:
        decoded = base64.b64decode(value)
        if len(decoded) % AES.block_size != 0:
            return False
        aes_decrypt(value, LEGACY_KEY, LEGACY_IV)
        return True
    except Exception:
        return False

def is_new_encrypted(value):
    """判断是否为新格式加密数据 ENC(V1:xxx)"""
    return value and value.startswith(ENCRYPT_PREFIX) and value.endswith(ENCRYPT_SUFFIX)

def to_plaintext(value):
    """将任意格式的值还原为明文"""
    if not value or len(value.strip()) == 0:
        return ''
    value = value.strip()
    if is_new_encrypted(value):
        # 新格式: 提取版本和密文部分
        inner = value[len(ENCRYPT_PREFIX):-len(ENCRYPT_SUFFIX)]
        parts = inner.split(':', 1)
        return aes_decrypt(parts[1], NEW_KEY, NEW_IV)
    if is_old_encrypted(value):
        # 旧格式: 直接用旧密钥解密
        return aes_decrypt(value, LEGACY_KEY, LEGACY_IV)
    # 明文
    return value

def to_new_encrypted(plaintext):
    """将明文加密为新格式 ENC(V1:xxx)"""
    if not plaintext:
        return ''
    encrypted = aes_encrypt(plaintext, NEW_KEY, NEW_IV)
    return ENCRYPT_PREFIX + encrypted + ENCRYPT_SUFFIX


# ========== 迁移任务定义 ==========

TASKS = [
    {
        'source_table': 'customer',
        'shadow_table': 'customer_shadow',
        'id_col': 'cid',
        'columns': ['phone', 'identity'],
        'extra_select': [],  # 无额外字段
    },
    {
        'source_table': 'customerPhone',
        'shadow_table': 'customerphone_shadow',
        'id_col': 'cpid',
        'columns': ['phone'],
        'extra_select': ['cid'],  # 冗余存储关联 cid
    },
    {
        'source_table': 'user',
        'shadow_table': 'user_shadow',
        'id_col': 'uid',
        'columns': ['phone', 'identity'],
        'extra_select': [],
    },
]


def get_batch_no():
    """生成批次号: YYYYMMDDHHMMSS"""
    return int(datetime.now().strftime('%Y%m%d%H%M%S'))


def migrate_batch(conn, task, batch_no):
    """
    从源表读取一批未迁移的记录，写入影子表。
    返回: (本批处理数, 本批插入数, 本批跳过数, 错误数)
    """
    source = task['source_table']
    shadow = task['shadow_table']
    id_col = task['id_col']
    columns = task['columns']
    extra = task.get('extra_select', [])

    cursor = conn.cursor(pymysql.cursors.DictCursor)

    # 从影子表获取上次处理到的主键位置 (游标)
    cursor.execute(
        f"SELECT MAX({id_col}) as max_id FROM {shadow} WHERE migrate_status >= 1"
    )
    row = cursor.fetchone()
    checkpoint = row['max_id'] if row and row['max_id'] is not None else 0

    # 查询源表中主键大于游标位置的记录
    select_cols = [id_col] + columns + extra
    col_str = ', '.join(select_cols)

    sql_select = f"""
        SELECT {col_str}
        FROM {source}
        WHERE {id_col} > %s
        ORDER BY {id_col}
        LIMIT %s
    """
    cursor.execute(sql_select, (checkpoint, BATCH_SIZE))
    rows = cursor.fetchall()

    if not rows:
        return 0, 0, 0, 0

    processed = 0
    inserted = 0
    skipped = 0
    errors = 0

    for row in rows:
        row_id = row[id_col]
        processed += 1

        # 构建影子表记录
        fields = [id_col]
        values = [row_id]

        # 添加额外冗余字段 (如 cid)
        for ext_col in extra:
            fields.append(ext_col)
            values.append(row.get(ext_col))

        has_data = False  # 至少有一个字段有值才写入

        for col in columns:
            raw_value = row.get(col)
            if not raw_value or len(str(raw_value).strip()) == 0:
                # 空值: 明文和密文都存 NULL
                fields.append(f'{col}_plain')
                values.append(None)
                fields.append(f'{col}_enc')
                values.append(None)
                continue

            raw_str = str(raw_value).strip()
            has_data = True

            # 解密得到明文
            plaintext = to_plaintext(raw_str)
            # 用新密钥加密
            encrypted = to_new_encrypted(plaintext)

            fields.append(f'{col}_plain')
            values.append(plaintext)
            fields.append(f'{col}_enc')
            values.append(encrypted)

        if not has_data:
            skipped += 1
            continue

        # 添加迁移元信息
        fields.extend(['migrate_status', 'migrate_time', 'batch_no'])
        values.extend([1, datetime.now(), batch_no])

        # INSERT (游标方式保证不会重复，无需 ON DUPLICATE KEY UPDATE)
        placeholders = ', '.join(['%s'] * len(values))
        field_str = ', '.join(fields)

        sql_insert = f"""
            INSERT INTO {shadow} ({field_str})
            VALUES ({placeholders})
        """

        try:
            cursor.execute(sql_insert, values)
            inserted += 1
        except Exception as e:
            errors += 1
            print(f"  [ERROR] {shadow}.{id_col}={row_id}: {e}")
            conn.rollback()

    conn.commit()
    return processed, inserted, skipped, errors


def verify_batch(conn, task, sample_size=50):
    """
    校验影子表数据: 随机抽取若干条，解密密文与明文比对。
    返回: (校验通过数, 校验失败数)
    """
    shadow = task['shadow_table']
    id_col = task['id_col']
    columns = task['columns']

    cursor = conn.cursor(pymysql.cursors.DictCursor)

    # 构建查询字段
    select_parts = [id_col]
    for col in columns:
        select_parts.append(f'{col}_plain')
        select_parts.append(f'{col}_enc')
    col_str = ', '.join(select_parts)

    cursor.execute(f"""
        SELECT {col_str} FROM {shadow}
        WHERE migrate_status = 1
        ORDER BY RAND()
        LIMIT %s
    """, (sample_size,))
    rows = cursor.fetchall()

    passed = 0
    failed = 0

    for row in rows:
        row_id = row[id_col]
        all_ok = True

        for col in columns:
            plain = row.get(f'{col}_plain')
            enc = row.get(f'{col}_enc')

            if not plain or not enc:
                continue

            # 解密密文，与明文比对
            try:
                inner = enc[len(ENCRYPT_PREFIX):-len(ENCRYPT_SUFFIX)]
                encrypted_b64 = inner.split(':', 1)[1]
                decrypted = aes_decrypt(encrypted_b64, NEW_KEY, NEW_IV)

                if decrypted != plain:
                    print(f"  [VERIFY FAIL] {shadow}.{id_col}={row_id} col={col}: "
                          f"plain={plain} != decrypted={decrypted}")
                    all_ok = False
            except Exception as e:
                print(f"  [VERIFY ERROR] {shadow}.{id_col}={row_id} col={col}: {e}")
                all_ok = False

        if all_ok:
            passed += 1
            # 校验通过，更新状态为 2
            cursor.execute(
                f"UPDATE {shadow} SET migrate_status=2 WHERE {id_col}=%s",
                (row_id,)
            )
        else:
            failed += 1

    conn.commit()
    return passed, failed


def get_progress(conn, task):
    """查询迁移进度，返回 (总量, 已迁移, 已校验, 游标位置)"""
    shadow = task['shadow_table']
    source = task['source_table']
    id_col = task['id_col']

    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute(f"SELECT COUNT(*) as cnt FROM {source}")
    total = cursor.fetchone()['cnt']

    cursor.execute(f"SELECT COUNT(*) as cnt FROM {shadow} WHERE migrate_status >= 1")
    migrated = cursor.fetchone()['cnt']

    cursor.execute(f"SELECT COUNT(*) as cnt FROM {shadow} WHERE migrate_status = 2")
    verified = cursor.fetchone()['cnt']

    # 游标位置 = 影子表中最大主键
    cursor.execute(
        f"SELECT MAX({id_col}) as max_id FROM {shadow} WHERE migrate_status >= 1"
    )
    row = cursor.fetchone()
    checkpoint = row['max_id'] if row and row['max_id'] is not None else 0

    return total, migrated, verified, checkpoint


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else 'migrate'

    conn = pymysql.connect(
        host=DB_HOST, port=DB_PORT, user=DB_USER,
        password=DB_PASS, db=DB_NAME, charset='utf8mb4'
    )

    try:
        batch_no = get_batch_no()

        if mode == 'migrate':
            # === 迁移模式 ===
            print(f"\n{'='*60}")
            print(f"[迁移开始] {datetime.now()} 批次号: {batch_no}")
            print(f"{'='*60}")

            for task in TASKS:
                print(f"\n--- {task['source_table']} → {task['shadow_table']} ---")
                total, migrated, verified, checkpoint = get_progress(conn, task)
                remaining = total - migrated
                print(f"  总量: {total}  已迁移: {migrated}  已校验: {verified}  剩余: {remaining}  游标: {checkpoint}")

                if remaining <= 0:
                    print(f"  [跳过] 已全部迁移")
                    continue

                p, i, s, e = migrate_batch(conn, task, batch_no)
                print(f"  本批: 读取{p}条, 写入{i}条, 跳过(空值){s}条, 错误{e}条")

            # 打印总进度
            print(f"\n{'='*60}")
            print(f"[进度汇总]")
            all_done = True
            for task in TASKS:
                total, migrated, verified, checkpoint = get_progress(conn, task)
                pct = (migrated / total * 100) if total > 0 else 0
                print(f"  {task['source_table']:20s}: {migrated:>8d}/{total:<8d} ({pct:5.1f}%) 校验:{verified} 游标:{checkpoint}")
                if migrated < total:
                    all_done = False

            if all_done:
                print(f"\n  ★ 全部迁移完成! 请运行校验模式: python3 {sys.argv[0]} verify")

        elif mode == 'verify':
            # === 校验模式 ===
            print(f"\n{'='*60}")
            print(f"[校验开始] {datetime.now()}")
            print(f"{'='*60}")

            for task in TASKS:
                print(f"\n--- {task['shadow_table']} ---")
                passed, failed = verify_batch(conn, task, sample_size=100)
                print(f"  抽样校验: 通过{passed}条, 失败{failed}条")

                if failed > 0:
                    print(f"  ⚠ 存在校验失败的数据，请检查!")

        elif mode == 'reset':
            # === 重置模式: 清空影子表，游标自动归零 ===
            print(f"\n{'='*60}")
            print(f"[重置确认] {datetime.now()}")
            print(f"{'='*60}")
            print(f"  ⚠ 此操作将清空以下影子表的所有数据:")
            for task in TASKS:
                print(f"    - {task['shadow_table']}")
            print(f"  清空后将从游标位置 0 重新开始迁移。")
            print(f"  如需确认，请运行: python3 {sys.argv[0]} reset --confirm")

            if '--confirm' not in sys.argv:
                return

            cursor = conn.cursor()
            for task in TASKS:
                shadow = task['shadow_table']
                cursor.execute(f"TRUNCATE TABLE {shadow}")
                print(f"  [已清空] {shadow}")

            conn.commit()
            print(f"\n  ★ 重置完成，游标已归零。下次 migrate 将从头开始。")

        elif mode == 'status':
            # === 状态查询 ===
            print(f"\n{'='*60}")
            print(f"[迁移状态] {datetime.now()}")
            print(f"{'='*60}")

            for task in TASKS:
                total, migrated, verified, checkpoint = get_progress(conn, task)
                pct = (migrated / total * 100) if total > 0 else 0
                bar_len = 30
                filled = int(bar_len * pct / 100)
                bar = '█' * filled + '░' * (bar_len - filled)
                print(f"  {task['source_table']:20s} [{bar}] {pct:5.1f}%  "
                      f"{migrated}/{total}  校验通过:{verified}  游标:{checkpoint}")

        else:
            print(f"用法: python3 {sys.argv[0]} [migrate|verify|status|reset]")
            print(f"  migrate  - 执行一批迁移 (默认)")
            print(f"  verify   - 校验已迁移数据")
            print(f"  status   - 查看迁移进度 (含游标位置)")
            print(f"  reset    - 清空影子表数据，从头重新迁移")

    finally:
        conn.close()


if __name__ == '__main__':
    main()
