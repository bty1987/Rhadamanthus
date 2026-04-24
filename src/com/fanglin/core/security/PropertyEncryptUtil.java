package com.fanglin.core.security;

/**
 * 密钥加密命令行工具
 *
 * 用法: java com.fanglin.core.security.PropertyEncryptUtil <明文值>
 * 输出: ENC(xxxxx)  直接粘贴到 properties 文件
 *
 * 指定密钥:
 *   java -Dfanglin.secret.key=xxx -Dfanglin.secret.iv=xxx com.fanglin.core.security.PropertyEncryptUtil <明文值>
 *
 * 注意：
 *   - 密钥默认从 KeyManager 多级兜底获取
 *   - 生产环境请使用环境变量或启动参数指定密钥
 */
public class PropertyEncryptUtil {

    public static void main(String[] args) {
        if (args.length == 0) {
            System.out.println("用法: java [-Dfanglin.secret.key=xxx -Dfanglin.secret.iv=xxx] com.fanglin.core.security.PropertyEncryptUtil <明文值>");
            System.out.println("  或设置环境变量: FANGLIN_SECRET_KEY 和 FANGLIN_SECRET_IV");
            return;
        }
        try {
            String plaintext = args[0];

            // 使用 KeyManager 多级兜底获取密钥
            String encrypted = AESHelper.encrypt(
                plaintext,
                KeyManager.getCurrentKey(),
                KeyManager.getCurrentIv()
            );
            System.out.println("加密结果: ENC(" + encrypted + ")");
        } catch (Exception e) {
            System.err.println("加密失败: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
