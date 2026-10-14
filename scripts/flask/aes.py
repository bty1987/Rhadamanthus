#!/usr/bin/evn python
#-*- encoding: utf-8 -*-

from Crypto.Cipher import AES
import base64

class AESENCRYPT(object):
    
    def __init__(self, key, iv):
        
        self.key = key
        self.iv = iv
        
        self.mode = AES.MODE_CBC
        
        BS = len(self.key)
        self.pad = lambda s: s + (BS - len(s) % BS) * chr(BS - len(s) % BS)
        self.unpad = lambda s : s[0:-ord(s[-1])]
    
    #加密函数
    def encrypt(self, content):
        
        try:
            cryptor = AES.new(self.key, self.mode, self.iv)
            ciphertext = cryptor.encrypt(self.pad(content))
            return base64.b64encode(ciphertext).decode('UTF-8')
        except Exception as e:
            print(e)
            return ""

    #解密函数
    def decrypt(self, content):
        
        try:
            decode = base64.b64decode(content)
            cryptor = AES.new(self.key, self.mode, self.iv)
            
            plain_text = cryptor.decrypt(decode)
            
            return self.unpad(plain_text.decode('UTF-8'))
        except Exception as e:
            print(e)
            return ""
    
if __name__ == '__main__':
    
    encrypt = AESENCRYPT("b4d617b336124c63", "b4d1a58a416957a5")
    
    print(encrypt.encrypt("1"))
    print(encrypt.decrypt("zmL/NgmvG3wVuBeKeyozyzKCrctm5y5bZ2Xz2J1vqrUlDt6JQYJFhLrJNFMkYjMJ7V3kLIXG5IE4EQQkdRbATAqNIYqdlFoJ5ksTjIIf+PiewzQNUFlvN34sFaLTq0HGc2ZbquBjcTZC5dXdcqVHDw=="))
    
