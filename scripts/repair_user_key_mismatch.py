#!/usr/bin/env python3
# repair_user_key_mismatch.py
# P2迁移一次性修复: user表key错配 + 旧密文误判二次加密
#
# 背景: 生产 sysconfig encryptKey=844dd1be967b6e9e/cdb421d038104126 (无encryptKeyV1, KeyManager兜底生效),
#       而迁移脚本误用仓库dev侧 b4d617b336124c63/b4d1a58a416957a5, 导致:
#   A类: bak明文行被 b4d6 加密 → 生产应用层解不开 → 修复=用844dd1重加密
#   B类: bak值为旧格式密文(844dd1加密的Base64)被误判PLAIN二次加密 → 修复=还原bak原值
#   C类: bak值为ENC(V1:)历史密文 → 脚本跳过未动 → 无需修复
#
# 判据(bak值, 非空且不以ENC(开头):
#   844dd1试解成功 → B类(还原原值) ; 试解失败 → A类(重加密)
# 全程CAS(主键+当前库值), 幂等: 修复后行不再满足条件

import pymysql
from Crypto.Cipher import AES
import base64

DB_HOST = 'rm-2zex3w4837e422i8x.mysql.rds.aliyuncs.com'
DB_PORT = 3306
DB_USER = 'fanglin1918'
DB_PASS = 'Fanglin1918!'
DB_NAME = 'communion'

# 生产生效key (sysconfig encryptKey/encryptIv)
ACTIVE_KEY = b'844dd1be967b6e9e'
ACTIVE_IV  = b'cdb421d038104126'
# 误用key (修复CAS比对用)
WRONG_KEY = b'b4d617b336124c63'
WRONG_IV  = b'b4d1a58a416957a5'

PREFIX = 'ENC(V1:'
SUFFIX = ')'
BATCH = 500


def _pad(data):
    n = AES.block_size - len(data) % AES.block_size
    return data + bytes([n]) * n


def _unpad(data):
    return data[:-data[-1]]


def enc(plaintext, key=ACTIVE_KEY, iv=ACTIVE_IV):
    cipher = AES.new(key, AES.MODE_CBC, iv)
    return PREFIX + base64.b64encode(cipher.encrypt(_pad(plaintext.encode('utf-8')))).decode() + SUFFIX


def dec(b64str, key=ACTIVE_KEY, iv=ACTIVE_IV):
    cipher = AES.new(key, AES.MODE_CBC, iv)
    return _unpad(cipher.decrypt(base64.b64decode(b64str))).decode('utf-8')


def strip_enc(value):
    """ENC(V1:xxx) -> xxx; 其他原样"""
    if value and value.startswith(PREFIX) and value.endswith(SUFFIX):
        return value[len(PREFIX):-len(SUFFIX)]
    return None


def main():
    conn = pymysql.connect(host=DB_HOST, port=DB_PORT, user=DB_USER,
                           password=DB_PASS, db=DB_NAME, charset='utf8mb4')
    cur = conn.cursor(pymysql.cursors.DictCursor)
    bak_cur = conn.cursor(pymysql.cursors.DictCursor)

    bak_cur.execute("SELECT MAX(uid) AS m FROM user_bak_p2enc_20261128")
    max_uid = bak_cur.fetchone()['m'] or 0

    stats = {'A_reenc': 0, 'B_restore': 0, 'C_skip': 0, 'empty_skip': 0, 'err': 0, 'cas_miss': 0}
    last = 0

    while last < max_uid:
        bak_cur.execute("SELECT uid, phone, identity FROM user_bak_p2enc_20261128 WHERE uid > %s ORDER BY uid LIMIT %s",
                        (last, BATCH))
        rows = bak_cur.fetchall()
        if not rows:
            break
        ids = [r['uid'] for r in rows]
        cur.execute("SELECT uid, phone, identity FROM user WHERE uid IN (%s)" % ','.join(['%s'] * len(ids)), ids)
        curmap = {r['uid']: r for r in cur.fetchall()}

        for bak in rows:
            uid = bak['uid']
            last = max(last, uid)
            cur_row = curmap.get(uid)
            if cur_row is None:
                continue

            for col in ('phone', 'identity'):
                old_plain = bak[col]
                if old_plain is None or len(old_plain.strip()) == 0:
                    stats['empty_skip'] += 1
                    continue
                old_plain = old_plain.strip()
                if old_plain.startswith(PREFIX) and old_plain.endswith(SUFFIX):
                    stats['C_skip'] += 1
                    continue  # 历史ENC行, 脚本未动

                now_val = cur_row[col]
                now_inner = strip_enc(now_val) if now_val else None

                if now_inner is None:
                    continue  # 当前值非ENC形态(未被脚本动过/或还原已完成), 跳过

                # 判定 bak 值类别
                try:
                    dec(old_plain)  # 844dd1试解成功 = 旧格式密文 → B类
                    kind = 'B'
                except Exception:
                    kind = 'A'

                if kind == 'A':
                    new_val = enc(old_plain)
                    desc = 'A_reenc'
                else:
                    new_val = old_plain
                    desc = 'B_restore'

                # CAS: 主键+当前库值(须仍是ENC形态, 即脚本产物)
                affected = cur.execute(f"UPDATE user SET {col} = %s WHERE uid = %s AND phone = %s" if col == 'phone'
                                       else f"UPDATE user SET {col} = %s WHERE uid = %s AND identity = %s",
                                       (new_val, uid, now_val))
                if affected == 1:
                    stats[desc] += 1
                else:
                    # 当前值已非预期(可能已修复), 校验是否已是目标值
                    recheck = dec(strip_enc(now_val)) if now_inner else None
                    cur.execute(f"SELECT {col} FROM user WHERE uid = %s", (uid,))
                    after = cur.fetchone()[col]
                    if after == new_val:
                        stats[desc] += 1  # 已是目标值(幂等重跑)
                    else:
                        stats['cas_miss'] += 1
                        print(f"  [CAS MISS] uid={uid} col={col}")

        conn.commit()
        print(f"  游标uid>{last}: {stats}")

    conn.commit()
    print("=== 修复完成 ===")
    print(f"A类重加密: {stats['A_reenc']}  B类还原: {stats['B_restore']}  C类跳过: {stats['C_skip']}  空值: {stats['empty_skip']}  异常: {stats['err']}  CAS MISS: {stats['cas_miss']}")
    conn.close()


if __name__ == '__main__':
    main()
