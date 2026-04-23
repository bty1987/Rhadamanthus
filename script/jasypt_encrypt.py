#!/usr/bin/python3.11
"""
Jasypt 加密工具 - Python 版本
与 Java jasypt-spring-boot 4.0.4 兼容

算法: PBEWithHMACSHA512AndAES_256
输出: Base64 编码

使用方式:
1. 直接运行: python3 jasypt_encrypt.py
2. 按提示输入密钥和明文
3. 将输出的密文放入配置: ENC(密文)
"""

import getpass
import base64
import hashlib
from Crypto.Cipher import AES
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Hash import HMAC, SHA512
from Crypto.Random import get_random_bytes


class JasyptEncryptor:
    """Jasypt 加密器（兼容 Java 版本）"""

    ALGORITHM = "PBEWithHMACSHA512AndAES_256"
    KEY_SIZE = 32  # 256 bits
    IV_SIZE = 16   # 128 bits
    SALT_SIZE = 16 # 128 bits
    ITERATIONS = 100000

    def __init__(self, password: str):
        self.password = password

    def _derive_key(self, salt: bytes) -> bytes:
        """
        派生密钥和 IV（PBKDF2-HMAC-SHA512）
        返回 (key, iv)
        """
        key = PBKDF2(
            self.password.encode('utf-8'),
            salt,
            dkLen=self.KEY_SIZE + self.IV_SIZE,
            count=self.ITERATIONS,
            hmac_hash_module=SHA512
        )
        return key[:self.KEY_SIZE], key[self.KEY_SIZE:self.KEY_SIZE + self.IV_SIZE]

    def encrypt(self, plain_text: str) -> str:
        """
        加密明文，返回 Base64 编码的密文
        格式: salt(16) + iv(16) + ciphertext
        """
        # 生成随机 salt 和 iv
        salt = get_random_bytes(self.SALT_SIZE)
        key, iv = self._derive_key(salt)

        # 加密
        cipher = AES.new(key, AES.MODE_CBC, iv)
        padded_plain = self._pad(plain_text.encode('utf-8'), AES.block_size)
        ciphertext = cipher.encrypt(padded_plain)

        # 组合: salt + iv + ciphertext
        encrypted = salt + iv + ciphertext
        return base64.b64encode(encrypted).decode('utf-8')

    def decrypt(self, cipher_text: str) -> str:
        """
        解密 Base64 编码的密文
        """
        # Base64 解码
        encrypted = base64.b64decode(cipher_text.encode('utf-8'))

        # 提取 salt, iv, ciphertext
        salt = encrypted[:self.SALT_SIZE]
        iv = encrypted[self.SALT_SIZE:self.SALT_SIZE + self.IV_SIZE]
        ciphertext = encrypted[self.SALT_SIZE + self.IV_SIZE:]

        # 派生密钥
        key, _ = self._derive_key(salt)

        # 解密
        cipher = AES.new(key, AES.MODE_CBC, iv)
        padded_plain = cipher.decrypt(ciphertext)
        plain_text = self._unpad(padded_plain)

        return plain_text.decode('utf-8')

    @staticmethod
    def _pad(data: bytes, block_size: int) -> bytes:
        """PKCS7 填充"""
        pad_length = block_size - (len(data) % block_size)
        return data + bytes([pad_length] * pad_length)

    @staticmethod
    def _unpad(data: bytes) -> bytes:
        """移除 PKCS7 填充"""
        pad_length = data[-1]
        return data[:-pad_length]


def main():
    """交互式命令行工具"""
    print("=== Jasypt 加密工具（Python 版本） ===")
    print(f"算法: {JasyptEncryptor.ALGORITHM}")
    print()

    # 输入密钥
    password = getpass.getpass("请输入主密钥 (jasypt.encryptor.password): ").strip()

    # 输入明文
    plain_text = input("请输入要加密的明文: ").strip()

    # 加密
    encryptor = JasyptEncryptor(password)
    encrypted = encryptor.encrypt(plain_text)

    print()
    print("=== 加密结果 ===")
    print(f"Base64 密文: {encrypted}")
    print(f"Nacos 配置写法: ENC({encrypted})")

    # 解密验证
    decrypted = encryptor.decrypt(encrypted)
    print(f"解密验证: {decrypted}")
    print(f"验证{'通过 ✓' if plain_text == decrypted else '失败 ✗'}")
    
    print(f"HL1W@c7HCSUaRFSZjpZ@S&%m8dq^bEbQ")


if __name__ == "__main__":
    main()
