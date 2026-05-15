#!/usr/bin/python
# -*- coding: UTF-8 -*-

"""
经纪人报备保护检查脚本
功能：每分钟查询上一分钟创建的装修单，调用 fl-sync 接口查询经纪人报备标识，
      如果有报备则更新 decorationaddition.brokerFlag = 1
创建时间：2026-05-15

使用方式：
1. 单次执行：python crond_broker_report_check.py
2. 循环执行：python crond_broker_report_check.py --loop
3. 指定间隔：python crond_broker_report_check.py --loop --interval 30

依赖安装：
pip install pymysql requests pycryptodome
"""

import pymysql
import requests
import json
import time
import logging
import sys
import uuid
import hashlib
import argparse
from datetime import datetime, timedelta

# ============================================================
# 配置项 — 请根据实际环境修改以下配置
# ============================================================

# 数据库配置
DB_CONFIG = {
    'host': '192.168.5.21',           # TODO: 替换为实际数据库地址
    'port': 3306,
    'user': 'root',                    # TODO: 替换为实际用户名
    'password': 'Neusoft!',            # TODO: 替换为实际密码
    'charset': 'utf8',
    'cursorclass': pymysql.cursors.DictCursor
}

# fl-sync 服务配置
FL_SYNC_CONFIG = {
    'base_url': 'http://TODO:PORT',    # TODO: 替换为 fl-sync 实际地址
    'broker_check_path': '/clue/brokerReportCheck',
    'timeout': 10,                     # 请求超时（秒）
}

# API 签名配置
API_SIGN_CONFIG = {
    'appId': 'erp_contacts_sync',      # 应用标识（文档中已指定）
    'appSecret': 'TODO',               # TODO: 替换为 erp_contacts_sync 对应的密钥
}

# customer.phone AES 解密配置（手机号在 DB 中是 AES 加密存储）
AES_CONFIG = {
    'key': 'TODO',                     # TODO: 替换为 AES 解密密钥（16/24/32字节）
    'iv': 'TODO',                      # TODO: 替换为 AES IV（通常与 key 相同或为空）
}

# ============================================================
# 日志配置
# ============================================================
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('crond_broker_report_check.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


# ============================================================
# API 签名工具 — 复用自 crond_message_queue_processor.py
# 签名规则：SHA256(requestParams + "#" + requestBody + "##" + headerStr + "###" + appSecret)
# ============================================================
class ApiSignUtil:

    @staticmethod
    def generate_sign(request_params, request_body, header_str, app_secret):
        """
        生成请求签名

        :param request_params: URL 请求参数字符串，如 "phone=138xxx&buildingNo=1栋"
                               对于 GET 请求，按参数名字典序排列 key=value&key=value
        :param request_body:   请求体字符串（GET 请求为空字符串 ""）
        :param header_str:     签名头字符串，格式 "appId=xxx&nonce=xxx&timestamp=xxx"
        :param app_secret:     应用密钥
        :return: 签名字符串（SHA256 hex）
        """
        sign_str = f"{request_params}#{request_body}##{header_str}###{app_secret}"
        sign = hashlib.sha256(sign_str.encode('utf-8')).hexdigest()
        logger.debug(f"签名原文: {sign_str}")
        logger.debug(f"签名结果: {sign}")
        return sign

    @staticmethod
    def generate_get_headers(query_params, app_id, app_secret):
        """
        为 GET 请求生成带签名的请求头

        :param query_params: 请求参数字典，如 {"phone": "138xxx", "buildingNo": "1栋"}
        :param app_id:       应用标识
        :param app_secret:   应用密钥
        :return: (headers_dict, query_string)
        """
        timestamp = int(time.time() * 1000)
        nonce = str(uuid.uuid4())

        # 1. 构造请求参数字符串（按 key 字典序排列）
        if query_params:
            sorted_keys = sorted(query_params.keys())
            param_parts = []
            for k in sorted_keys:
                v = query_params[k]
                if v is not None:
                    param_parts.append(f"{k}={v}")
            request_params = "&".join(param_parts)
        else:
            request_params = ""

        # 2. GET 请求无 body
        request_body = ""

        # 3. 构造签名头字符串
        header_str = f"appId={app_id}&nonce={nonce}&timestamp={timestamp}"

        # 4. 生成签名
        sign = ApiSignUtil.generate_sign(request_params, request_body, header_str, app_secret)

        # 5. 构造请求头
        headers = {
            'appId': app_id,
            'timestamp': str(timestamp),
            'nonce': nonce,
            'sign': sign
        }

        return headers, request_params


# ============================================================
# AES 解密工具（用于解密 customer.phone）
# ============================================================
class AesDecryptUtil:

    @staticmethod
    def decrypt(encrypted_text, key, iv):
        """
        AES 解密（兼容 Java SensitiveDataHelper 的加密方式）

        :param encrypted_text: Base64 编码的密文
        :param key:            AES 密钥（字符串）
        :param iv:             AES IV（字符串）
        :return: 明文字符串
        """
        try:
            from Crypto.Cipher import AES
            from Crypto.Util.Padding import unpad
            import base64

            key_bytes = key.encode('utf-8')
            iv_bytes = iv.encode('utf-8') if iv else key_bytes
            cipher = AES.new(key_bytes, AES.MODE_CBC, iv_bytes)
            decrypted = unpad(cipher.decrypt(base64.b64decode(encrypted_text)), AES.block_size)
            return decrypted.decode('utf-8')
        except Exception as e:
            logger.warning(f"AES 解密失败: {e}, 原始值: {encrypted_text}")
            return encrypted_text


# ============================================================
# 经纪人报备检查处理器
# ============================================================
class BrokerReportChecker:

    def __init__(self, db_config, api_config, aes_config):
        self.db_config = db_config
        self.api_config = api_config
        self.aes_config = aes_config
        self.conn = None
        self.session = requests.Session()

    def get_connection(self):
        """获取数据库连接"""
        try:
            if self.conn is None or not self.conn.open:
                self.conn = pymysql.connect(**self.db_config)
                logger.info("数据库连接成功")
            return self.conn
        except Exception as e:
            logger.error(f"数据库连接失败: {e}")
            raise

    def close_connection(self):
        """关闭数据库连接"""
        if self.conn and self.conn.open:
            self.conn.close()
            self.conn = None
            logger.info("数据库连接已关闭")

    # ------ Step 1: 查询上一分钟创建的装修单 ------
    def query_recent_decorations(self):
        """
        查询上一分钟内创建时间创建的装修单
        返回: list of dict [{orderId, phone, buildingNo, ...}]
        """
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            # 查询上一分钟创建的装修单
            # 关联 customer 表获取手机号，关联 house/village 获取楼盘地址
            sql = """
                SELECT
                    d.orderId,
                    d.createTime,
                    c.phone AS encryptedPhone,
                    h.houseNumber AS encryptedHouseNumber,
                    v.name AS villageName
                FROM decoration.decoration d
                LEFT JOIN communion.customer c ON d.customerId = c.cid
                LEFT JOIN communion.house h ON d.hid = h.hid
                LEFT JOIN communion.village v ON h.villageId = v.vid
                WHERE d.createTime >= DATE_SUB(NOW(), INTERVAL 2 MINUTE)
                  AND d.createTime < DATE_SUB(NOW(), INTERVAL 1 MINUTE)
                  AND d.status != 5
                ORDER BY d.createTime ASC
                LIMIT 200
            """

            cursor.execute(sql)
            results = cursor.fetchall()
            cursor.close()

            logger.info(f"查询到 {len(results)} 条上一分钟创建的装修单")
            return results

        except Exception as e:
            logger.error(f"查询装修单失败: {e}")
            return []

    # ------ Step 2: 调用 fl-sync 接口查询经纪人报备 ------
    def check_broker_report(self, phone=None, building_no=None, decoration_order_no=None):
        """
        调用 fl-sync /clue/brokerReportCheck 接口

        :param phone:              客户手机号（明文）
        :param building_no:        楼栋/门牌号
        :param decoration_order_no: 装修订单号
        :return: {isBrokerReported, clueNo, clueId} 或 None（调用失败时）
        """
        try:
            base_url = self.api_config['base_url'].rstrip('/')
            path = self.api_config['broker_check_path']
            url = f"{base_url}{path}"

            # 构造查询参数（至少传一个）
            query_params = {}
            if phone:
                query_params['phone'] = phone
            if building_no:
                query_params['buildingNo'] = building_no
            if decoration_order_no:
                query_params['decorationOrderNo'] = decoration_order_no

            if not query_params:
                logger.warning("无有效查询参数，跳过")
                return None

            # 生成签名头
            app_id = API_SIGN_CONFIG['appId']
            app_secret = API_SIGN_CONFIG['appSecret']

            if not app_secret or app_secret == 'TODO':
                logger.warning("appSecret 未配置，使用不带签名的请求头")
                headers = {'appId': app_id}
            else:
                headers, query_string = ApiSignUtil.generate_get_headers(
                    query_params, app_id, app_secret
                )

            # 发送 GET 请求
            response = self.session.get(
                url,
                params=query_params,
                headers=headers,
                timeout=self.api_config.get('timeout', 10)
            )

            if response.status_code == 200:
                result = response.json()
                logger.debug(f"接口响应: {result}")

                if result.get('code') == 0 or result.get('code') == '0':
                    return result.get('data')
                else:
                    logger.warning(f"接口返回非0: code={result.get('code')}, msg={result.get('msg')}")
                    return None
            else:
                logger.error(f"接口请求失败: HTTP {response.status_code}, 响应: {response.text}")
                return None

        except requests.exceptions.Timeout:
            logger.error(f"请求超时: {url}")
            return None
        except Exception as e:
            logger.error(f"查询经纪人报备异常: {e}")
            return None

    # ------ Step 3: 更新 decorationaddition.brokerFlag ------
    def update_broker_flag(self, order_id, clue_no=None, clue_id=None):
        """
        更新 decorationaddition 表的 brokerFlag 字段

        :param order_id: 装修订单号
        :param clue_no:  CRM 线索编号（可选，记录日志用）
        :param clue_id:  CRM 线索ID（可选，记录日志用）
        :return: 是否成功
        """
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            sql = """
                UPDATE decoration.decorationaddition
                SET brokerFlag = 1
                WHERE orderId = %s
            """
            affected = cursor.execute(sql, (order_id,))
            conn.commit()
            cursor.close()

            if affected > 0:
                logger.info(f"更新 brokerFlag 成功: orderId={order_id}, clueNo={clue_no}, clueId={clue_id}")
                return True
            else:
                logger.warning(f"未找到 decorationaddition 记录: orderId={order_id}")
                return False

        except Exception as e:
            logger.error(f"更新 brokerFlag 失败: orderId={order_id}, error={e}")
            return False

    # ------ Step 4: 插入消息队列事件 ------
    def insert_message_queue(self, order_id, clue_no=None, clue_id=None):
        """
        向 information.messagequeuing 插入一条经纪人报备事件

        :param order_id: 装修订单号
        :param clue_no:  CRM 线索编号
        :param clue_id:  CRM 线索ID
        :return: 是否成功
        """
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            # args 格式与现有 messagequeueing 一致: JSON 含 orderId + event
            args_data = {
                "orderId": order_id,
                "event": "BROKER_REPORT_MATCHED"
            }
            if clue_no:
                args_data["clueNo"] = clue_no
            if clue_id:
                args_data["clueId"] = clue_id

            args_str = json.dumps(args_data, ensure_ascii=False)

            sql = """
                INSERT INTO information.messagequeuing (orderId, operation, args, createTime, status)
                VALUES (%s, %s, %s, NOW(), 0)
            """
            cursor.execute(sql, (order_id, "brokerReportCheck", args_str))
            conn.commit()
            cursor.close()

            logger.info(f"插入消息队列成功: orderId={order_id}, operation=brokerReportCheck, args={args_str}")
            return True

        except Exception as e:
            logger.error(f"插入消息队列失败: orderId={order_id}, error={e}")
            return False

    # ------ Step 5: 解密手机号 ------
    def decrypt_phone(self, encrypted_phone):
        """解密客户手机号"""
        if not encrypted_phone:
            return None
        key = self.aes_config.get('key', '')
        iv = self.aes_config.get('iv', '')
        if not key or key == 'TODO':
            # 未配置解密密钥，直接返回原值
            logger.debug("AES 未配置，返回原始手机号")
            return encrypted_phone
        return AesDecryptUtil.decrypt(encrypted_phone, key, iv)

    # ------ Step 5: 解密门牌号 ------
    def decrypt_house_number(self, encrypted_number):
        """解密门牌号"""
        if not encrypted_number:
            return None
        key = self.aes_config.get('key', '')
        iv = self.aes_config.get('iv', '')
        if not key or key == 'TODO':
            return encrypted_number
        return AesDecryptUtil.decrypt(encrypted_number, key, iv)

    # ------ 主流程 ------
    def process_once(self):
        """执行一次完整的检查流程"""
        logger.info("=" * 60)
        logger.info(f"开始经纪人报备检查: {datetime.now()}")
        start_time = time.time()

        try:
            # 1. 查询上一分钟创建的装修单
            decorations = self.query_recent_decorations()

            if not decorations:
                logger.info("无新装修单，跳过")
                return

            checked_count = 0
            broker_count = 0
            update_count = 0
            fail_count = 0

            for deco in decorations:
                order_id = deco['orderId']
                encrypted_phone = deco.get('encryptedPhone')
                encrypted_house_number = deco.get('encryptedHouseNumber')
                village_name = deco.get('villageName', '')

                # 2. 解密敏感字段
                phone = self.decrypt_phone(encrypted_phone)
                house_number = self.decrypt_house_number(encrypted_house_number)

                # 拼接 buildingNo: 楼盘名 + 门牌号（根据接口实际要求调整）
                building_no = f"{village_name} {house_number}".strip() if house_number else village_name

                logger.info(f"检查装修单: orderId={order_id}, phone={phone}, buildingNo={building_no}")

                # 3. 调用接口查询经纪人报备
                result = self.check_broker_report(
                    phone=phone,
                    building_no=building_no,
                    decoration_order_no=order_id
                )

                checked_count += 1

                if result is None:
                    logger.warning(f"接口调用失败，跳过: orderId={order_id}")
                    fail_count += 1
                    continue

                is_reported = result.get('isBrokerReported', False)

                if is_reported:
                    clue_no = result.get('clueNo')
                    clue_id = result.get('clueId')
                    logger.info(f"发现经纪人报备: orderId={order_id}, clueNo={clue_no}, clueId={clue_id}")
                    broker_count += 1

                    # 4. 更新 decorationaddition.brokerFlag
                    if self.update_broker_flag(order_id, clue_no, clue_id):
                        update_count += 1

                        # 5. 插入消息队列事件（由 crond_message_queue_processor 后续处理）
                        self.insert_message_queue(order_id, clue_no, clue_id)
                else:
                    logger.debug(f"无经纪人报备: orderId={order_id}")

            elapsed = time.time() - start_time
            logger.info(f"检查完成: 共{checked_count}单, 报备{broker_count}单, "
                        f"更新{update_count}条, 失败{fail_count}条, 耗时{elapsed:.1f}s")

        except Exception as e:
            logger.error(f"处理异常: {e}", exc_info=True)

        logger.info("=" * 60)

    def run_loop(self, interval=60):
        """
        循环执行（每分钟一次）

        :param interval: 执行间隔（秒），默认60秒
        """
        logger.info(f"经纪人报备检查器启动，执行间隔: {interval}秒")
        logger.info("按 Ctrl+C 停止运行")

        try:
            while True:
                self.process_once()
                logger.info(f"等待 {interval} 秒后继续...")
                time.sleep(interval)
        except KeyboardInterrupt:
            logger.info("收到停止信号，退出程序")
        finally:
            self.close_connection()


# ============================================================
# 主入口
# ============================================================
def main():
    parser = argparse.ArgumentParser(description='经纪人报备保护检查脚本')
    parser.add_argument('--loop', action='store_true', help='循环执行模式（默认单次执行）')
    parser.add_argument('--interval', type=int, default=60, help='循环执行间隔（秒），默认60')
    parser.add_argument('--debug', action='store_true', help='开启调试日志')
    args = parser.parse_args()

    if args.debug:
        logging.getLogger().setLevel(logging.DEBUG)

    checker = BrokerReportChecker(DB_CONFIG, FL_SYNC_CONFIG, AES_CONFIG)

    if args.loop:
        checker.run_loop(interval=args.interval)
    else:
        checker.process_once()
        checker.close_connection()


if __name__ == '__main__':
    main()
