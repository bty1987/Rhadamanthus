#!/usr/bin/python
# -*- coding: UTF-8 -*-

"""
消息队列处理脚本
功能：每分钟执行一次，查询 information.messagequeuing 表，处理延迟1分钟的消息队列
创建时间：2025-01-17
作者：AI Assistant

使用方式：
1. 直接运行：python message_queue_processor.py
2. 定时任务：使用 crontab 或 Windows 任务计划程序每分钟执行一次

依赖安装：
pip install pymysql requests
"""

import pymysql
import requests
import json
import time
import logging
import sys
from datetime import datetime, timedelta

# 日志配置
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('message_queue_processor.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


# 数据库配置 - 根据实际环境修改
DB_CONFIG = {
    'host': '192.168.5.21',
    'port': 3306,
    'user': 'root',
    'password': 'Neusoft!',
    'charset': 'utf8',
    'cursorclass': pymysql.cursors.DictCursor
}


class MessageQueueProcessor:
    """消息队列处理器"""

    def __init__(self, db_config):
        """
        初始化处理器
        :param db_config: 数据库配置字典
        """
        self.db_config = db_config
        self.conn = None
        self.pm_url = None

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

    def get_pm_url(self):
        """
        从 system_config 表获取 PM_URL_STR 配置
        :return: URL字符串
        """
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            sql = "SELECT value FROM system.system_config WHERE name = 'PM_URL_STR'"
            cursor.execute(sql)
            result = cursor.fetchone()

            cursor.close()

            if result:
                self.pm_url = result['value']
                logger.info(f"获取 PM_URL_STR 配置: {self.pm_url}")
            else:
                logger.warning("PM_URL_STR 配置不存在，消息队列处理功能未启用")
                self.pm_url = None

        except Exception as e:
            logger.error(f"获取 PM_URL_STR 配置失败: {e}")
            self.pm_url = None

    def query_pending_messages(self):
        """
        查询待处理的消息队列（创建时间延迟1分钟）
        :return: 消息队列列表
        """
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            # 查询状态为0（未处理）且创建时间小于当前时间减1分钟的记录
            delay_time = datetime.now() - timedelta(minutes=1)
            sql = """
                SELECT mqid, operation, args, orderId, createtime
                FROM information.messagequeuing
                WHERE status = 0
                  AND finishtime IS NULL
                  AND createtime < %s
                ORDER BY createtime ASC
                LIMIT 100
            """

            cursor.execute(sql, (delay_time,))
            messages = cursor.fetchall()
            cursor.close()

            logger.info(f"查询到 {len(messages)} 条待处理消息")
            return messages

        except Exception as e:
            logger.error(f"查询待处理消息失败: {e}")
            return []

    def publish_event(self, operation, args, orderId=None):
        """
        发送 HTTP POST 请求发布事件
        :param operation: 操作类型
        :param args: 参数（JSON字符串）
        :param orderId: 装修单号（优先使用此参数）
        :return: 响应结果
        """
        try:
            if not self.pm_url:
                logger.error("PM_URL_STR 未配置，无法发送请求")
                return None

            # 解析 args 参数
            try:
                args_dict = json.loads(args) if args else {}
            except json.JSONDecodeError:
                logger.error(f"args 参数解析失败: {args}")
                args_dict = {}

            # 构造请求参数（参考 A20260109ServiceImpl.publishErpEvent）
            # orderId 优先使用表字段，如果没有则从 args 中获取
            params = {
                "eventType": args_dict.get("event")
            }

            # 添加 orderId（必填）
            if orderId:
                params["orderId"] = orderId
            elif "orderId" in args_dict:
                params["orderId"] = args_dict.get("orderId")

            # 动态传递 args 中所有字段（包括 cnid, userId, dpid, belongType, status 等）
            for key, value in args_dict.items():
                if key not in ("event", "orderId"):  # event 和 orderId 已处理
                    params[key] = value

            logger.info(f"发布ERP事件: url={self.pm_url}, operation={operation}, params={params}")

            # 发送 POST 请求
            headers = {'Content-Type': 'application/json'}
            response = requests.post(
                self.pm_url,
                json=params,
                headers=headers,
                timeout=10
            )

            if response.status_code == 200:
                try:
                    result = response.json()
                except ValueError:
                    result = {"raw_response": response.text}
                logger.info(f"ERP事件响应: {result}")
                return result
            else:
                logger.error(f"ERP事件发布失败: HTTP {response.status_code}, response={response.text[:200]}")
                return None

        except requests.exceptions.Timeout:
            logger.error(f"请求超时: {self.pm_url}")
            return None
        except Exception as e:
            logger.error(f"发布事件异常: {e}")
            return None

    def update_message_status(self, mqid, success=True):
        """
        更新消息队列状态
        :param mqid: 消息队列ID
        :param success: 是否成功（True=status=1, False=status=2）
        :return: 是否成功
        """
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            status = 1 if success else 2
            sql = """
                UPDATE information.messagequeuing
                SET status = %s, finishtime = NOW()
                WHERE mqid = %s
            """
            cursor.execute(sql, (status, mqid))
            conn.commit()
            cursor.close()

            status_text = "成功" if success else "失败"
            logger.info(f"更新消息状态{status_text}: mqid={mqid}, status={status}")
            return True

        except Exception as e:
            logger.error(f"更新消息状态失败: mqid={mqid}, error={e}")
            return False

    def process_messages(self):
        """处理消息队列"""
        try:
            # 获取 PM_URL_STR 配置
            if not self.pm_url:
                self.get_pm_url()

            if not self.pm_url:
                logger.warning("PM_URL_STR 未配置，跳过本次处理")
                return

            # 查询待处理消息
            messages = self.query_pending_messages()

            if not messages:
                logger.info("没有待处理的消息")
                return

            # 处理每条消息
            success_count = 0
            fail_count = 0

            for msg in messages:
                mqid = msg['mqid']
                operation = msg['operation']
                args = msg['args']
                orderId = msg.get('orderId')
                createtime = msg['createtime']

                logger.info(f"处理消息: mqid={mqid}, operation={operation}, orderId={orderId}, createtime={createtime}")

                # 发送事件
                response = self.publish_event(operation, args, orderId)

                if response is not None:
                    # 判断是否成功：支持多种返回格式
                    # 1. {"code": 200} 或 {"code": "200"}
                    # 2. {"success": true}
                    # 3. HTTP 200 且有响应内容即视为成功
                    is_success = False

                    code = response.get('code')
                    if code == 200 or code == '200' or code == 0 or code == '0':
                        is_success = True
                    elif response.get('success') is True:
                        is_success = True
                    elif 'raw_response' in response and response.get('raw_response'):
                        # HTTP 200 但 JSON 解析失败，有原始响应视为成功
                        is_success = True

                    # 更新状态（成功=1, 失败=2）
                    if self.update_message_status(mqid, success=is_success):
                        if is_success:
                            success_count += 1
                        else:
                            fail_count += 1
                    else:
                        fail_count += 1
                else:
                    # 请求失败（超时、网络错误等），标记为失败
                    logger.error(f"事件发布失败: mqid={mqid}")
                    self.update_message_status(mqid, success=False)
                    fail_count += 1

            logger.info(f"消息处理完成: 成功={success_count}, 失败={fail_count}")

        except Exception as e:
            logger.error(f"处理消息队列异常: {e}")

    def run_once(self):
        """执行一次处理"""
        logger.info("=" * 50)
        logger.info(f"开始处理消息队列: {datetime.now()}")
        try:
            self.process_messages()
        except Exception as e:
            logger.error(f"处理异常: {e}")
        logger.info(f"处理完成: {datetime.now()}")
        logger.info("=" * 50)

    def run_loop(self, interval=60):
        """
        循环执行处理（每分钟一次）
        :param interval: 执行间隔（秒），默认60秒
        """
        logger.info(f"消息队列处理器启动，执行间隔: {interval}秒")
        logger.info("按 Ctrl+C 停止运行")

        try:
            while True:
                self.run_once()
                logger.info(f"等待 {interval} 秒后继续...")
                time.sleep(interval)
        except KeyboardInterrupt:
            logger.info("收到停止信号，退出程序")
        finally:
            if self.conn:
                self.conn.close()
                logger.info("数据库连接已关闭")


def main():
    """主函数"""
    # 解析命令行参数
    interval = 60  # 默认60秒

    if len(sys.argv) > 1:
        try:
            interval = int(sys.argv[1])
        except ValueError:
            print("参数错误: 间隔时间必须是整数（秒）")
            print("使用方式: python message_queue_processor.py [interval]")
            print("  interval - 执行间隔（秒），默认60秒")
            sys.exit(1)

    # 创建处理器并运行
    processor = MessageQueueProcessor(DB_CONFIG)
    processor.run_loop(interval)


if __name__ == '__main__':
    main()
