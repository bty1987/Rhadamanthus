#!/usr/bin/evn python
#-*- encoding: utf-8 -*-

#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import pymysql
import requests
import time

# ========== 配置项 ==========
DB_CONFIG = {
    'host': 'localhost',
    'user': 'your_user',
    'password': 'your_password',
    'database': 'your_db',
    'charset': 'utf8mb4'
}

TENCENT_MAP_KEY = 'U5FBZ-SQLKZ-H5BX3-TCVW6-L3APZ-LUF5F'
TENCENT_API_URL = 'https://apis.map.qq.com/ws/place/v1/suggestion?keyword=%s&region=%s&output=json&key=' + TENCENT_MAP_KEY

BATCH_SIZE = 50
LAST_VID_FILE = '/var/run/village_last_vid.txt'   # 断点文件

# ========== 断点读写 ==========
def read_last_vid():
    if os.path.exists(LAST_VID_FILE):
        with open(LAST_VID_FILE) as f:
            return int(f.read().strip() or 0)
    return 0

def save_last_vid(vid):
    with open(LAST_VID_FILE, 'w') as f:
        f.write(str(vid))

# ========== 数据库连接 ==========
def get_db_connection():
    config = json.load(open(configPath,encoding="utf-8"))
    return pymysql.connect(host=config.host, user=config.username, password=config.password, charset=sconfigelf.charset)

# ========== 腾讯地图查询 ==========
def get_location_from_tencent(name, city):
    try:
        url = TENCENT_API_URL % (requests.utils.quote(name), requests.utils.quote(city))
        resp = requests.get(url, timeout=5).json()
        if resp.get('status') == 0 and resp.get('data'):
            loc = resp['data'][0]['location']
            return loc['lat'], loc['lng']
    except Exception as e:
        print(f'[ERROR] 腾讯地图API失败: {e}')
    return None, None

# ========== 批量更新 ==========
def flush_update(cursor, batch):
    if not batch:
        return
    vids = [b[0] for b in batch]
    x_map = {b[0]: b[1] for b in batch}
    y_map = {b[0]: b[2] for b in batch}

    case_x = ' '.join([f'WHEN {vid} THEN %s' for vid in vids])
    case_y = ' '.join([f'WHEN {vid} THEN %s' for vid in vids])
    sql = f"""
        UPDATE village
        SET x = CASE vid {case_x} END,
            y = CASE vid {case_y} END
        WHERE vid IN ({','.join(['%s'] * len(vids))})
    """
    params = []
    for vid in vids:
        params.append(x_map[vid])
    for vid in vids:
        params.append(y_map[vid])
    params.extend(vids)
    cursor.execute(sql, params)

# ========== 主逻辑 ==========
def main():
    last_vid = read_last_vid()
    conn = get_db_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    select_sql = """
        SELECT vid, name, city
        FROM village
        WHERE x = 0 AND y = 0 AND vid > %s
        ORDER BY vid ASC
        LIMIT 100
    """
    cursor.execute(select_sql, (last_vid,))
    rows = cursor.fetchall()
    if not rows:
        print('[INFO] 无新数据，退出')
        return

    batch = []
    max_vid = last_vid
    for row in rows:
        vid = row['vid']
        name = row['name']
        city = row['city']
        max_vid = max(max_vid, vid)

        print(f'[INFO] 处理: {name} ({city})')
        lat, lng = get_location_from_tencent(name, city)
        if lat is not None and lng is not None:
            batch.append((vid, lng, lat))   # x=lng, y=lat
            if len(batch) >= BATCH_SIZE:
                flush_update(cursor, batch)
                conn.commit()
                print(f'[SUCCESS] 批量更新 {len(batch)} 条')
                batch.clear()
        else:
            print(f'[WARNING] 未获取坐标: {name} ({city})')
        time.sleep(0.2)   # 控制QPS

    if batch:
        flush_update(cursor, batch)
        conn.commit()
        print(f'[SUCCESS] 最后批量更新 {len(batch)} 条')

    save_last_vid(max_vid)
    print(f'[INFO] 断点已记录，最大 vid = {max_vid}')

    cursor.close()
    conn.close()

if __name__ == '__main__':
    main()