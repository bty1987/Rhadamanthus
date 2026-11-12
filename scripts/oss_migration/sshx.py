# -*- coding: utf-8 -*-
"""文件服务器 SSH 执行器: python -I scripts/oss_migration/sshx.py <host> "<command>"
密码不落盘, 从环境变量 FDFS_SSH_PW 读取"""
import os
import sys

import paramiko

HOSTS = {
    "102": "192.168.5.102",
    "116": "192.168.5.116",
}


def main():
    if len(sys.argv) < 3:
        print("usage: sshx.py <102|116|ip> <command>")
        sys.exit(1)
    target = sys.argv[1]
    host = HOSTS.get(target, target if target[0].isdigit() else None)
    if not host:
        print("unknown host alias:", target)
        sys.exit(1)
    cmd = sys.argv[2]

    pw = os.environ.get("FDFS_SSH_PW")
    if not pw:
        print("FDFS_SSH_PW not set")
        sys.exit(1)

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, port=19182, username="root", password=pw, timeout=10)
    stdin, stdout, stderr = client.exec_command(cmd, timeout=300)
    out = stdout.read().decode("utf-8", errors="replace")
    err = stderr.read().decode("utf-8", errors="replace")
    code = stdout.channel.recv_exit_status()
    client.close()
    if out:
        print(out)
    if err:
        sys.stderr.write(err)
    sys.exit(code)


if __name__ == "__main__":
    main()
