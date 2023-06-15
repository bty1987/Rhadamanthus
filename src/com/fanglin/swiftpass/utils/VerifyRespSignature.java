package com.fanglin.swiftpass.utils;

import java.io.IOException;
import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.X509EncodedKeySpec;
import java.util.Arrays;

import org.bouncycastle.asn1.ASN1EncodableVector;
import org.bouncycastle.asn1.ASN1Integer;
import org.bouncycastle.asn1.DERSequence;
import org.bouncycastle.asn1.gm.GMNamedCurves;
import org.bouncycastle.asn1.x9.X9ECParameters;
import org.bouncycastle.jcajce.provider.asymmetric.ec.BCECPublicKey;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.jce.spec.ECParameterSpec;
import org.bouncycastle.jce.spec.ECPublicKeySpec;
import org.bouncycastle.util.BigIntegers;

import com.fanglin.swiftpass.config.KeyConfigure;
import com.fanglin.swiftpass.enums.RespSignAlgorithmEnum;
import com.fanglin.swiftpass.exception.SdkExType;
import com.fanglin.swiftpass.exception.SdkException;

/**
 * 响应报文验签工具类
 * 
 */
public class VerifyRespSignature {

	private static final BouncyCastleProvider BC = new BouncyCastleProvider();

	private static final int RS_LEN = 32;

	private static X9ECParameters x9ECParameters = GMNamedCurves.getByName("sm2p256v1");
	private static ECParameterSpec ecParameterSpec = new ECParameterSpec(x9ECParameters.getCurve(), x9ECParameters.getG(), x9ECParameters.getN());

	/**
	 * 响应报文验签
	 * 
	 * @param timestamp 响应报文头部的时间戳
	 * @param nonce 响应报文头部的随机值
	 * @param responseSignValue 响应报文头部的签名值
	 * @param retn 响应报文
	 * @throws SdkException
	 */
	public static void verify(String timestamp, String nonce, String responseSignValue, Object retn, KeyConfigure keyConfigure) throws SdkException {

		if (SdkUtil.notBlank(timestamp) && SdkUtil.notBlank(responseSignValue)) {
			try {
				String respPubKey = keyConfigure.getRespPubKey();
				String verifyAlgorithm = keyConfigure.getRespSignAlgorithm().getLabel();
				byte[] bodyContentBytes;
				if (retn instanceof String) {
					String content = (String) retn;
					bodyContentBytes = content.getBytes(Const.CHARSET);
				} else {
					bodyContentBytes = (byte[]) retn;
				}

				// 待验签bytes内容为时间戳bytes＋报文bodyBytes
				byte[] timestampBytes = timestamp.getBytes(Const.CHARSET);
				byte[] nonceBytes = nonce.getBytes(Const.CHARSET);
				byte[] contentBytes = new byte[timestampBytes.length + nonceBytes.length + bodyContentBytes.length];
				System.arraycopy(timestampBytes, 0, contentBytes, 0, timestampBytes.length);
				System.arraycopy(nonceBytes, 0, contentBytes, timestampBytes.length, nonceBytes.length);
				System.arraycopy(bodyContentBytes, 0, contentBytes, timestampBytes.length + nonceBytes.length, bodyContentBytes.length);

				boolean flag;
				if (RespSignAlgorithmEnum.SM3WITHSM2.equals(keyConfigure.getRespSignAlgorithm())) {
					flag = verifyBySM2(contentBytes, responseSignValue, respPubKey);
				} else {
					flag = verifyByRSA(contentBytes, responseSignValue, respPubKey, verifyAlgorithm);
				}

				if (!flag) {
					throw new SdkException(SdkExType.RESPONSE_SIGN_ERR);
				}
			} catch (Exception e) {
				throw new SdkException(SdkExType.RESPONSE_SIGN_ERR);
			}
		} else {
			throw new SdkException(SdkExType.RESPONSE_SIGN_ERR);
		}
	}

	/**
	 * 验签，支持SHA1WithRSA、SHA256WithRSA算法
	 * 
	 * @param contentBytes 待验签名的内容
	 * @param sign 签名值
	 * @param publicKey 公钥
	 * @param verifyAlgorithm 验签算法
	 * @return 验签结果(true / false)
	 */
	private static boolean verifyByRSA(byte[] contentBytes, String sign, String publicKey, String verifyAlgorithm) {
		try {
			byte[] b = (new sun.misc.BASE64Decoder()).decodeBuffer(publicKey);
			X509EncodedKeySpec keySpec = new X509EncodedKeySpec(b);
			KeyFactory factoty = KeyFactory.getInstance(Const.SIGN_TYPE);
			PublicKey pubKey = factoty.generatePublic(keySpec);
			java.security.Signature signature = java.security.Signature.getInstance(verifyAlgorithm);
			signature.initVerify(pubKey);
			signature.update(contentBytes);

			return signature.verify(Base64.decode(sign));
		} catch (Exception e) {
			// e.printStackTrace();
			return false;
		}
	}

	/**
	 * SM3WithSM2验签
	 * 
	 * @param contentBytes 待验签名的内容
	 * @param sign 签名值
	 * @param publicKey 公钥
	 * @return
	 */
	public static boolean verifyBySM2(byte[] contentBytes, String sign, String publicKey) {
		byte[] publicKeyBytes = Base64.decode(publicKey);
		if (publicKeyBytes.length != 64 && publicKeyBytes.length != 65) {
			return false;
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
		byte[] rs = Base64.decode(sign);
		return verifySm3WithSm2Asn1Rs(contentBytes, rsPlainByteArrayToAsn1(rs), bcecPublicKey);
	}

	private static BCECPublicKey getPublicKeyFromXY(BigInteger x, BigInteger y) {
		ECPublicKeySpec ecPublicKeySpec = new ECPublicKeySpec(x9ECParameters.getCurve().createPoint(x, y), ecParameterSpec);
		return new BCECPublicKey(Const.ALGORITHM_EC, ecPublicKeySpec, BouncyCastleProvider.CONFIGURATION);
	}

	/**
	 * BC的SM3withSM2验签需要的rs是asn1格式的，这个方法将直接拼接r||s的字节数组转化成asn1格式
	 * 
	 * @param sign in plain byte array
	 * @return rs result in asn1 format
	 */
	public static byte[] rsPlainByteArrayToAsn1(byte[] sign) {
		if (sign.length != RS_LEN * 2) {
			throw new RuntimeException("err rs. ");
		}
		BigInteger r = new BigInteger(1, Arrays.copyOfRange(sign, 0, RS_LEN));
		BigInteger s = new BigInteger(1, Arrays.copyOfRange(sign, RS_LEN, RS_LEN * 2));
		ASN1EncodableVector v = new ASN1EncodableVector();
		v.add(new ASN1Integer(r));
		v.add(new ASN1Integer(s));
		try {
			return new DERSequence(v).getEncoded("DER");
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * @param msg
	 * @param rs in <b>asn1 format</b>
	 * @param publicKey
	 * @return
	 */
	private static boolean verifySm3WithSm2Asn1Rs(byte[] msg, byte[] rs, PublicKey publicKey) {
		try {
			Signature signature = Signature.getInstance(Const.ALGORITHM_SM3_WITH_SM2, BC);
			signature.initVerify(publicKey);
			signature.update(msg, 0, msg.length);
			return signature.verify(rs);
		} catch (Exception e) {
			return false;
		}
	}
}
