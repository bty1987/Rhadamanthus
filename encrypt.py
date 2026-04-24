from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Random import get_random_bytes
import base64
import hashlib

def derive_key(password, salt=None):
    if salt is None:
        salt = get_random_bytes(16)
    key = PBKDF2(password, salt, dkLen=32, count=100000, hmac_hash_module=hashlib.sha256)
    return key, salt

def encrypt_password(password, content):
    # 使用 PBKDF2 从密码派生密钥
    key, salt = derive_key(password)
    
    # 生成随机 IV
    iv = get_random_bytes(16)
    
    # 创建 AES 加密器 (CBC 模式)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    
    # 加密内容
    padded_data = pad(content.encode('utf-8'), AES.block_size)
    encrypted_data = cipher.encrypt(padded_data)
    
    # 组合: salt + iv + encrypted_data
    combined = salt + iv + encrypted_data
    
    # Base64 编码
    encrypted_base64 = base64.b64encode(combined).decode('utf-8')
    
    return encrypted_base64

def decrypt_password(password, encrypted_base64):
    # Base64 解码
    combined = base64.b64decode(encrypted_base64)
    
    # 提取 salt (前16字节), iv (接下来的16字节), encrypted_data
    salt = combined[:16]
    iv = combined[16:32]
    encrypted_data = combined[32:]
    
    # 使用相同的 salt 派生密钥
    key, _ = derive_key(password, salt)
    
    # 创建 AES 解密器
    cipher = AES.new(key, AES.MODE_CBC, iv)
    
    # 解密
    decrypted_padded = cipher.decrypt(encrypted_data)
    decrypted_data = unpad(decrypted_padded, AES.block_size)
    
    return decrypted_data.decode('utf-8')

if __name__ == "__main__":
    password = "HL1W@c7HCSUaRFSZjpZ@S&%m8dq^bEbQ"
    content = "Fanglin@Big666"
    
    # 加密
    encrypted = encrypt_password(password, content)
    print(f"Original:  {content}")
    print(f"Encrypted: {encrypted}")
    
    # 解密验证
    decrypted = decrypt_password(password, encrypted)
    print(f"Decrypted: {decrypted}")
    
    if content == decrypted:
        print("\n✓ 加密解密验证成功!")
    else:
        print("\n✗ 加密解密验证失败!")
