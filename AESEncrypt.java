import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class AESEncrypt {
    public static void main(String[] args) {
        try {
            String password = "HL1W@c7HCSUaRFSZjpZ@S&%m8dq^bEbQ";
            String content = "Fanglin@Big666";
            
            // 使用密码的前16字节作为密钥和IV（简化处理）
            byte[] keyBytes = password.getBytes("UTF-8");
            byte[] key = new byte[16];
            byte[] iv = new byte[16];
            System.arraycopy(keyBytes, 0, key, 0, Math.min(keyBytes.length, 16));
            System.arraycopy(keyBytes, 0, iv, 0, Math.min(keyBytes.length, 16));
            
            SecretKeySpec keySpec = new SecretKeySpec(key, "AES");
            IvParameterSpec ivSpec = new IvParameterSpec(iv);
            
            // 加密
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivSpec);
            byte[] encrypted = cipher.doFinal(content.getBytes("UTF-8"));
            String encryptedBase64 = Base64.getEncoder().encodeToString(encrypted);
            
            // 解密
            cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);
            byte[] decrypted = cipher.doFinal(Base64.getDecoder().decode(encryptedBase64));
            String decryptedContent = new String(decrypted, "UTF-8");
            
            System.out.println("Original: " + content);
            System.out.println("Encrypted (Base64): " + encryptedBase64);
            System.out.println("Decrypted: " + decryptedContent);
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
