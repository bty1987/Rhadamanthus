package com.fanglin.swiftpass.utils;

import java.math.BigInteger;
import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.SecureRandom;
import java.security.SignatureException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Arrays;

import org.bouncycastle.asn1.ASN1Integer;
import org.bouncycastle.asn1.ASN1Sequence;
import org.bouncycastle.asn1.gm.GMNamedCurves;
import org.bouncycastle.asn1.x9.X9ECParameters;
import org.bouncycastle.crypto.InvalidCipherTextException;
import org.bouncycastle.crypto.engines.SM2Engine;
import org.bouncycastle.crypto.params.ECDomainParameters;
import org.bouncycastle.crypto.params.ECPrivateKeyParameters;
import org.bouncycastle.crypto.params.ECPublicKeyParameters;
import org.bouncycastle.crypto.params.ParametersWithRandom;
import org.bouncycastle.jcajce.provider.asymmetric.ec.BCECPrivateKey;
import org.bouncycastle.jcajce.provider.asymmetric.ec.BCECPublicKey;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.jce.spec.ECParameterSpec;
import org.bouncycastle.jce.spec.ECPrivateKeySpec;
import org.bouncycastle.jce.spec.ECPublicKeySpec;
import org.bouncycastle.util.BigIntegers;
import org.bouncycastle.util.encoders.Hex;

/**
 * 签名验签工具类
 * 
 */
public class Signature {

	private static final BouncyCastleProvider BC = new BouncyCastleProvider();

	private static final int RS_LEN = 32;

	private static final String ALGORITHM_EC = "EC";

	private static X9ECParameters x9ECParameters = GMNamedCurves.getByName("sm2p256v1");
	private static ECParameterSpec ecParameterSpec = new ECParameterSpec(x9ECParameters.getCurve(), x9ECParameters.getG(), x9ECParameters.getN());
	private static ECDomainParameters ecDomainParameters = new ECDomainParameters(x9ECParameters.getCurve(), x9ECParameters.getG(), x9ECParameters.getN());

	/**
	 * RSA签名
	 * 
	 * @param content 待签内容
	 * @param privateKey 开发者私钥
	 * @param charset 字符编码
	 * @return 签名值
	 */
	public static String signatureByRSA(String content, String privateKey, String charset) {
		try {
			PKCS8EncodedKeySpec priPKCS8 = new PKCS8EncodedKeySpec(Base64.decode(privateKey));
			KeyFactory keyf = KeyFactory.getInstance(Const.SIGN_TYPE);
			PrivateKey priKey = keyf.generatePrivate(priPKCS8);

			java.security.Signature signature = java.security.Signature.getInstance(Const.SIGN_ALGORITHMS);

			signature.initSign(priKey);
			signature.update(content.getBytes(charset));

			byte[] signed = signature.sign();
			return Base64.encode(signed);
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * SM2签名
	 * 
	 * @param content 待签内容
	 * @param privateKey 开发者私钥
	 * @param charset 字符编码
	 * @return
	 */
	public static String signatureBySM2(String content, String privateKey, String charset) {
		byte[] privateKeyBytes = Base64.decode(privateKey);
		BCECPrivateKey bcecPrivateKey = getPrivateKeyFromD(BigIntegers.fromUnsignedByteArray(privateKeyBytes));
		try {
			byte[] contentBytes = content.getBytes(charset);
			byte[] signed = rsAsn1ToPlainByteArray(signSm3WithSm2Asn1Rs(contentBytes, bcecPrivateKey));
			return Base64.encode(signed);
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * 使用SM2公钥加密数据
	 * 
	 * @param encodedPublicKey Base64编码的公钥
	 * @param contentBytes 待加密内容
	 * @return Base64编码后的密文数据
	 */
	public static String encryptBySM2PublicKey(String encodedPublicKey, byte[] contentBytes) throws Exception {
		try {
			byte[] publicKeyBytes = Base64.decode(encodedPublicKey);
			if (publicKeyBytes.length != 64 && publicKeyBytes.length != 65) {
				throw new Exception("err key length");
			}

			BigInteger x, y;
			if (publicKeyBytes.length > 64) {
				x = BigIntegers.fromUnsignedByteArray(publicKeyBytes, 1, 32);
				y = BigIntegers.fromUnsignedByteArray(publicKeyBytes, 33, 32);
			} else {
				x = BigIntegers.fromUnsignedByteArray(publicKeyBytes, 0, 32);
				y = BigIntegers.fromUnsignedByteArray(publicKeyBytes, 32, 32);
			}
			BCECPublicKey bcecPublicKey = getPublicKeyFromXY(x, y);
			byte[] results = changeC1C2C3ToC1C3C2(encryptBySM2PublicKeyOld(contentBytes, bcecPublicKey));
			return Base64.encode(results);
		} catch (Exception e) {
			throw e;
		}
	}

	/**
	 * 用SM2私钥解密
	 * 
	 * @param encodedPrivateKey Base64编码的私钥
	 * @param contentBytes 待解密内容
	 * @return 明文数据（byte数组）
	 */
	public static byte[] decryptBySM2PrivateKey(String encodedPrivateKey, byte[] contentBytes) throws Exception {
		try {
			byte[] privateKeyBytes = Base64.decode(encodedPrivateKey);
			BCECPrivateKey bcecPrivateKey = getPrivateKeyFromD(BigIntegers.fromUnsignedByteArray(privateKeyBytes));
			return decryptBySM2PrivateKeyOld(changeC1C3C2ToC1C2C3(contentBytes), bcecPrivateKey);
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * c1||c2||c3
	 * 
	 * @param data
	 * @param bcecPrivateKey
	 * @return
	 */
	public static byte[] decryptBySM2PrivateKeyOld(byte[] data, BCECPrivateKey bcecPrivateKey) throws InvalidCipherTextException {
		ECPrivateKeyParameters ecPrivateKeyParameters = new ECPrivateKeyParameters(bcecPrivateKey.getD(), ecDomainParameters);
		SM2Engine sm2Engine = new SM2Engine();
		sm2Engine.init(false, ecPrivateKeyParameters);
		return sm2Engine.processBlock(data, 0, data.length);
	}

	/**
	 * bc加解密使用旧标c1||c3||c2，此方法在解密前调用，将密文转化为c1||c2||c3再去解密
	 * 
	 * @param c1c3c2
	 * @return
	 */
	private static byte[] changeC1C3C2ToC1C2C3(byte[] c1c3c2) {
		// sm2p256v1的这个固定65
		final int c1Len = (x9ECParameters.getCurve().getFieldSize() + 7) / 8 * 2 + 1;
		// 可看GMNamedCurves、ECCurve代码。
		final int c3Len = 32;
		byte[] result = new byte[c1c3c2.length];
		// c1: 0->65
		System.arraycopy(c1c3c2, 0, result, 0, c1Len);
		// c2
		System.arraycopy(c1c3c2, c1Len + c3Len, result, c1Len, c1c3c2.length - c1Len - c3Len);
		// c3
		System.arraycopy(c1c3c2, c1Len, result, c1c3c2.length - c3Len, c3Len);
		return result;
	}

	/**
	 * c1||c2||c3
	 * 
	 * @param data
	 * @param bcecPublicKey
	 * @return
	 */
	public static byte[] encryptBySM2PublicKeyOld(byte[] data, BCECPublicKey bcecPublicKey) throws InvalidCipherTextException {
		ECPublicKeyParameters ecPublicKeyParameters = new ECPublicKeyParameters(bcecPublicKey.getQ(), ecDomainParameters);
		SM2Engine sm2Engine = new SM2Engine();
		sm2Engine.init(true, new ParametersWithRandom(ecPublicKeyParameters, new SecureRandom()));
		return sm2Engine.processBlock(data, 0, data.length);
	}

	/**
	 * bc加解密使用旧标c1||c2||c3，此方法在加密后调用，将结果转化为c1||c3||c2
	 * 
	 * @param c1c2c3
	 * @return
	 */
	private static byte[] changeC1C2C3ToC1C3C2(byte[] c1c2c3) {
		// sm2p256v1的这个固定65
		final int c1Len = (x9ECParameters.getCurve().getFieldSize() + 7) / 8 * 2 + 1;
		// 可看GMNamedCurves、ECCurve代码。
		final int c3Len = 32;
		byte[] result = new byte[c1c2c3.length];
		// c1
		System.arraycopy(c1c2c3, 0, result, 0, c1Len);
		// c3
		System.arraycopy(c1c2c3, c1c2c3.length - c3Len, result, c1Len, c3Len);
		// c2
		System.arraycopy(c1c2c3, c1Len, result, c1Len + c3Len, c1c2c3.length - c1Len - c3Len);
		return result;
	}

	private static BCECPrivateKey getPrivateKeyFromD(BigInteger d) {
		ECPrivateKeySpec ecPrivateKeySpec = new ECPrivateKeySpec(d, ecParameterSpec);
		return new BCECPrivateKey(Const.ALGORITHM_EC, ecPrivateKeySpec, BouncyCastleProvider.CONFIGURATION);
	}

	private static BCECPublicKey getPublicKeyFromXY(BigInteger x, BigInteger y) {
		ECPublicKeySpec ecPublicKeySpec = new ECPublicKeySpec(x9ECParameters.getCurve().createPoint(x, y), ecParameterSpec);
		return new BCECPublicKey(ALGORITHM_EC, ecPublicKeySpec, BouncyCastleProvider.CONFIGURATION);
	}

	private static byte[] bigIntToFixedLengthBytes(BigInteger rOrS) {
		byte[] rs = rOrS.toByteArray();
		if (rs.length == RS_LEN) {
			return rs;
		} else if (rs.length == RS_LEN + 1 && rs[0] == 0) {
			return Arrays.copyOfRange(rs, 1, RS_LEN + 1);
		} else if (rs.length < RS_LEN) {
			byte[] result = new byte[RS_LEN];
			Arrays.fill(result, (byte) 0);
			System.arraycopy(rs, 0, result, RS_LEN - rs.length, rs.length);
			return result;
		} else {
			throw new RuntimeException("err rs: " + Hex.toHexString(rs));
		}
	}

	/**
	 * BC的SM3withSM2签名得到的结果的rs是asn1格式的，这个方法转化成直接拼接r||s
	 * 
	 * @param rsDer rs in asn1 format
	 * @return sign result in plain byte array
	 */
	private static byte[] rsAsn1ToPlainByteArray(byte[] rsDer) {
		ASN1Sequence seq = ASN1Sequence.getInstance(rsDer);
		byte[] r = bigIntToFixedLengthBytes(ASN1Integer.getInstance(seq.getObjectAt(0)).getValue());
		byte[] s = bigIntToFixedLengthBytes(ASN1Integer.getInstance(seq.getObjectAt(1)).getValue());
		byte[] result = new byte[RS_LEN * 2];
		System.arraycopy(r, 0, result, 0, r.length);
		System.arraycopy(s, 0, result, RS_LEN, s.length);
		return result;
	}

	private static byte[] signSm3WithSm2Asn1Rs(byte[] msg, PrivateKey privateKey) throws NoSuchAlgorithmException, InvalidKeyException, SignatureException {
		java.security.Signature signer = java.security.Signature.getInstance(Const.ALGORITHM_SM3_WITH_SM2, BC);
		signer.initSign(privateKey, new SecureRandom());
		signer.update(msg, 0, msg.length);
		byte[] sig = signer.sign();
		return sig;
	}
}
