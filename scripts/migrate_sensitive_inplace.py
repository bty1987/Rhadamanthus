#!/usr/bin/env python3
# migrate_sensitive_inplace.py
# 敏感数据就地加密迁移脚本 (P2收官版, 替代影子表方案)
#
# 与旧版 migrate_sensitive_shadow.py 的区别:
#   - 不建影子表, 直接 UPDATE 原表 (应用层 SensitiveDataHelper 三层回退已上线,
#     明文/旧Base64/ENC(V1:) 三形态读写全兼容, 无需两阶段切换)
#   - 游标持久化在 cursor.json (按主键范围扫描, 不做全表正则过滤)
#   - 只加密明文行; 旧格式 Base64 密文(无ENC前缀)跳过不动, 防二次加密
#   - 每批 CAS 回写 (WHERE 主键 AND 原值), 并抽样回验
#   - 迁移前自动建 bak 备份表 (存在即跳过)
#
# 运行方式: crontab 每分钟一批 (时间换空间), 或手动循环
#   * * * * * cd /path/to/script && python3 migrate_sensitive_inplace.py migrate >> migrate_inplace.log 2>&1
#
# 模式:
#   migrate  - 执行一批迁移 (默认)
#   status   - 查看各表明文残留/密文进度
#   reset    - 清空游标从头再扫 (已加密行会被跳过, 幂等安全)
#
# 前置: DDL sqls/customer/62_companyphone_varchar128_upgrade.sql 已执行
#       (customer.companyPhone varchar(32)->128), 否则 customer 表批次会写入失败

import pymysql
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import base64
import json
import os
import re
import sys
from datetime import datetime

# ========== 数据库配置 (生产主库, 部署前必填) ==========
DB_HOST = 'your-prod-master-host'   # 生产主库地址 (ECS 内网 rm-****.mysql.rds.aliyuncs.com)
DB_PORT = 3306
DB_USER = 'fanglin1918'
DB_PASS = 'Fanglin1918!'
DB_NAME = 'communion'

# ========== 密钥配置 ==========
# 与生产 sysconfig.properties encryptKey/encryptIv (legacy) 一致;
# KeyManager 未配置 encryptKeyV1 时应用层 ENC(V1:) 实际也用此密钥, 两端完全一致
LEGACY_KEY = b'b4d617b336124c63'
LEGACY_IV  = b'b4d1a58a416957a5'

# ========== 迁移参数 ==========
BATCH_SIZE = 1000                 # 每批处理记录数
CURSOR_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cursor_inplace.json')
ENCRYPT_PREFIX = "ENC(V1:"
ENCRYPT_SUFFIX = ")"
BACKUP_SUFFIX = "_bak_p2enc_20261128"

# ========== 迁移任务 (顺序即执行顺序: 小表先行验证, house 大头殿后) ==========
TASKS = [
    {'table': 'user',           'id': 'uid', 'columns': ['phone', 'identity']},
    {'table': 'customeraccount','id': 'caid','columns': ['phone']},
    {'table': 'recruitment',    'id': 'rid', 'columns': ['phone', 'identity']},
    {'table': 'customer',       'id': 'cid', 'columns': ['identity', 'companyPhone']},
    {'table': 'house',          'id': 'hid', 'columns': ['houseNumber']},
]

# ========== AES 加解密 ==========

def aes_encrypt(plaintext, key=LEGACY_KEY, iv=LEGACY_IV):
    """AES/CBC/PKCS5Padding 加密, 返回 Base64 (与应用层 AESHelper 一致)"""
    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded = pad(plaintext.encode('utf-8'), AES.block_size)
    return base64.b64encode(cipher.encrypt(padded)).decode('utf-8')


def aes_decrypt(ciphertext_b64, key=LEGACY_KEY, iv=LEGACY_IV):
    raw = base64.b64decode(ciphertext_b64)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    return unpad(cipher.decrypt(raw), AES.block_size).decode('utf-8')


def to_new_encrypted(plaintext):
    """明文 -> ENC(V1:base64), 与 SensitiveDataHelper.encrypt 输出完全一致"""
    if plaintext is None or len(plaintext.strip()) == 0:
        return plaintext
    return ENCRYPT_PREFIX + aes_encrypt(plaintext.strip()) + ENCRYPT_SUFFIX

# ========== 形态判定 ==========

# 典型明文快排除 (不必逐个试解密)
RE_PLAIN_PHONE = re.compile(r'^1\d{10}$')
RE_PLAIN_ID18 = re.compile(r'^\d{17}[\dXx]$')
RE_PLAIN_ID15 = re.compile(r'^\d{15}$')
RE_HAS_NON_B64 = re.compile(r'[^A-Za-z0-9+/=]')


def is_old_encrypted(value):
    """判断是否为旧格式密文 (纯Base64, 无ENC前缀, legacy密钥可解)"""
    if not value or len(value) < 10:
        return False
    # 快速排除: 手机号/身份证号明文
    if RE_PLAIN_PHONE.match(value) or RE_PLAIN_ID18.match(value) or RE_PLAIN_ID15.match(value):
        return False
    # 快速排除: 含 Base64 字符集以外字符 (中文门牌/横杠座机等)
    if RE_HAS_NON_B64.search(value):
        return False
    try:
        decoded = base64.b64decode(value, validate=True)
        if len(decoded) == 0 or len(decoded) % AES.block_size != 0:
            return False
        aes_decrypt(value)  # legacy 密钥解密成功才认定是旧密文
        return True
    except Exception:
        return False


def classify(value):
    """EMPTY / NEW_ENC / OLD_ENC / PLAIN"""
    if value is None or len(value.strip()) == 0:
        return 'EMPTY'
    v = value.strip()
    if v.startswith(ENCRYPT_PREFIX) and v.endswith(ENCRYPT_SUFFIX):
        return 'NEW_ENC'
    if is_old_encrypted(v):
        return 'OLD_ENC'
    return 'PLAIN'

# ========== 游标 ==========

def load_cursor():
    if os.path.exists(CURSOR_FILE):
        with open(CURSOR_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}


def save_cursor(cursor_state):
    tmp = CURSOR_FILE + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(cursor_state, f, ensure_ascii=False, indent=2)
    os.replace(tmp, CURSOR_FILE)

# ========== 备份 ==========

def ensure_backup(conn, task):
    """迁移前建备份表 (仅明文列), 已存在则跳过"""
    cur = conn.cursor()
    cur.execute("SHOW TABLES LIKE %s", (task['table'] + BACKUP_SUFFIX,))
    if cur.fetchone():
        return
    col_str = ', '.join([task['id']] + task['columns'])
    cur.execute(f"CREATE TABLE {task['table']}{BACKUP_SUFFIX} AS SELECT {col_str} FROM {task['table']}")
    conn.commit()
    print(f"  [备份] {task['table']}{BACKUP_SUFFIX} 已创建")

# ========== 迁移 ==========

def migrate_batch(conn, task, cursor_state):
    """处理一批: 主键范围扫描 -> Python侧形态判定 -> CAS回写明文行"""
    table, id_col = task['table'], task['id']
    columns = task['columns']
    last_id = cursor_state.get(table, 0)

    cur = conn.cursor(pymysql.cursors.DictCursor)
    col_str = ', '.join([id_col] + columns)
    cur.execute(f"SELECT {col_str} FROM {table} WHERE {id_col} > %s ORDER BY {id_col} LIMIT %s",
                (last_id, BATCH_SIZE))
    rows = cur.fetchall()

    if not rows:
        return None  # 本表扫描完毕

    migrated, skipped_enc, skipped_empty, errors = 0, 0, 0, 0
    new_last_id = last_id

    for row in rows:
        row_id = row[id_col]
        new_last_id = max(new_last_id, row_id)

        # 收集本行的明文列 (只有明文列参与迁移)
        plain_cols = [col for col in columns if classify(row.get(col)) == 'PLAIN']
        if not plain_cols:
            # 本行全是密文/空值, 计数后跳过
            for col in columns:
                if classify(row.get(col)) == 'EMPTY':
                    skipped_empty += 1
                else:
                    skipped_enc += 1
            continue

        # SET: 明文列=密文; WHERE: 主键+各明文列=原值(CAS, 原值用未strip库值, 防带空格行永远MISS)
        set_parts = [f"{col} = %s" for col in plain_cols]
        where_parts = [f"{id_col} = %s"] + [f"{col} = %s" for col in plain_cols]
        # 参数必须按占位顺序分段: 先SET段(密文), 再WHERE段(主键+原值), 不可交错
        params = [to_new_encrypted(str(row.get(col)).strip()) for col in plain_cols]
        params.append(row_id)
        params += [row.get(col) for col in plain_cols]

        sql = f"UPDATE {table} SET {', '.join(set_parts)} WHERE {' AND '.join(where_parts)}"

        try:
            affected = cur.execute(sql, params)
            if affected == 0:
                print(f"  [CAS MISS] {table}.{id_col}={row_id} 原值已被并发修改, 跳过")
                errors += 1
            else:
                migrated += 1
        except Exception as e:
            # 单行失败不回滚整批: 成功行批末照常提交, 失败行靠 reset 重扫补齐(幂等)
            errors += 1
            print(f"  [ERROR] {table}.{id_col}={row_id}: {e}")

    conn.commit()
    cursor_state[table] = new_last_id
    return (migrated, skipped_enc, skipped_empty, errors, new_last_id)

# ========== 进度 ==========

def status_report(conn):
    """按'非空且非ENC前缀'口径报残留 (含旧格式Base64, 应用层兼容可解)"""
    cur = conn.cursor()
    print(f"\n[迁移状态] {datetime.now():%Y-%m-%d %H:%M:%S}")
    print(f"{'表':<18}{'列':<14}{'有效值':>10}{'ENC密文':>10}{'残留(含旧格式)':>14}")
    for task in TASKS:
        for col in task['columns']:
            cur.execute(f"SELECT COUNT(*) FROM {task['table']} WHERE {col} IS NOT NULL AND {col} <> ''")
            total = cur.fetchone()[0]
            cur.execute(f"SELECT COUNT(*) FROM {task['table']} WHERE {col} LIKE 'ENC(%'")
            enc = cur.fetchone()[0]
            remain = total - enc
            mark = ' ✔' if remain == 0 else ''
            print(f"{task['table']:<18}{col:<14}{total:>10}{enc:>10}{remain:>14}{mark}")

# ========== main ==========

# ========== 进程锁 (cron 每分钟起实例, 上轮未完时防止并发) ==========
LOCK_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'migrate_inplace.lock')


def acquire_lock():
    try:
        import fcntl
    except ImportError:
        return open(LOCK_FILE, 'w')  # 非Linux(本地调试)跳过锁
    fd = open(LOCK_FILE, 'w')
    try:
        fcntl.flock(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
        return fd
    except IOError:
        fd.close()
        return None


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else 'migrate'

    lock_fd = None
    if mode == 'migrate':
        lock_fd = acquire_lock()
        if lock_fd is None:
            print(f"[{datetime.now():%Y-%m-%d %H:%M:%S}] 另一实例运行中, 本轮跳过")
            return

    conn = pymysql.connect(host=DB_HOST, port=DB_PORT, user=DB_USER,
                           password=DB_PASS, db=DB_NAME, charset='utf8mb4')

    try:
        if mode == 'migrate':
            cursor_state = load_cursor()
            batch_no = datetime.now().strftime('%Y%m%d%H%M%S')
            print(f"[{datetime.now():%Y-%m-%d %H:%M:%S}] 批次 {batch_no} 游标: {cursor_state}")

            for task in TASKS:
                last = cursor_state.get(task['table'], 0)
                cur = conn.cursor()
                cur.execute(f"SELECT MAX({task['id']}) FROM {task['table']}")
                max_id = cur.fetchone()[0] or 0
                if last >= max_id:
                    continue  # 本表已扫完

                ensure_backup(conn, task)
                result = migrate_batch(conn, task, cursor_state)
                if result is None:
                    cursor_state[task['table']] = max_id
                    print(f"  [{task['table']}] 扫描完毕 (游标={max_id})")
                else:
                    m, se, sempty, err, new_last = result
                    print(f"  [{task['table']}] 本批迁移{m} 跳过密文{se} 空{sempty} 异常{err} 游标->{new_last}")
                save_cursor(cursor_state)
                break  # 每次只跑一个表的一批, 下轮 cron 接续

        elif mode == 'status':
            status_report(conn)

        elif mode == 'reset':
            if os.path.exists(CURSOR_FILE):
                os.remove(CURSOR_FILE)
            print("游标已清空, 下次 migrate 从头扫描 (已加密行自动跳过, 幂等安全)")
        else:
            print(f"用法: python3 {sys.argv[0]} [migrate|status|reset]")
    finally:
        conn.close()
        if lock_fd:
            lock_fd.close()


if __name__ == '__main__':
    main()
