package com.fanglin.yspay.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.ReUtil;

import com.fanglin.yspay.config.Config;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/**
 * 签名工具类
 */
public class SignUtils {

	private static final Logger logger = LoggerFactory.getLogger(SignUtils.class);

	private static Map<String, Object> certMap = new ConcurrentHashMap<String, Object>();

	private static Map<String, String> paraFilter(Map<String, String> sArray) {
		Map<String, String> result = new HashMap<String, String>();

		if ((sArray == null) || (sArray.size() <= 0)) {
			return result;
		}

		for (String key : sArray.keySet()) {
			String value = sArray.get(key);
			if ((value != null) && (!StringUtils.isEmpty(value)) && (!"sign".equalsIgnoreCase(key)) && (!"SgnInfo".equalsIgnoreCase(key))) {

				result.put(key, value);
			}
		}
		return result;
	}

	private static String getSignContent(Map<String, String> sortedParams) {
		StringBuffer content = new StringBuffer();
		List<String> keys = new ArrayList<String>(sortedParams.keySet());
		Collections.sort(keys);
		int index = 0;
		for (int i = 0; i < keys.size(); i++) {
			String key = keys.get(i);
			String value = sortedParams.get(key);
			if (StringUtils.areNotEmpty(key, value)) {
				content.append((index == 0 ? "" : "&") + key + "=" + value);
				index++;
			}
		}
		return content.toString();
	}

	public static boolean rsaCheckContent(Map<String, String> params, String sign, String charset) {

		String content = getSignContent(paraFilter(params));

		return checkSign(Config.PUBLICKEYPATH, content, sign, charset);
	}

	public static PublicKey getPublicKeyFromCert(InputStream ins) throws Exception {
		PublicKey pubKey = (PublicKey) certMap.get("PublicKey");
		if (pubKey != null) {
			return pubKey;
		}
		try {
			CertificateFactory cf = CertificateFactory.getInstance("X.509");
			Certificate cac = cf.generateCertificate(ins);
			pubKey = cac.getPublicKey();
			certMap.put("PublicKey", pubKey);
		} catch (Exception e) {
			throw e;
		} finally {
			if (ins != null) {
				ins.close();
			}
		}

		return pubKey;
	}

	public static boolean rsaCheckContent(InputStream publicCertFileInputStream, String content, String sign, String charset) throws Exception {

		boolean bFlag = false;
		try {
			Signature signetcheck = Signature.getInstance("SHA1WithRSA");

			signetcheck.initVerify(getPublicKeyFromCert(publicCertFileInputStream));

			signetcheck.update(content.getBytes(charset));
			if (signetcheck.verify(Base64.decodeBase64(sign.getBytes(charset)))) {
				bFlag = true;
			}
		} catch (Exception e) {

			throw new Exception("验证签名异常");
		}

		return bFlag;
	}

	public static boolean checkSign(String filePath, String content, String sign, String charset) {
		InputStream inputStream = FileUtil.getInputStream(filePath);
		boolean flag = false;
		try {
			flag = rsaCheckContent(inputStream, content, sign, charset);
		} catch (Exception e) {
			logger.error("验证签名失败", e);
		}
		return flag;
	}

	/**
	 * 验证签名
	 * 
	 * @param responseJsonStr
	 * @return
	 */
	public static boolean checkSign(String responseJsonStr, String charset) {

		String methodStr = ReUtil.get("ysepay(.*?)response", responseJsonStr, 0);

		JsonParser parser = new JsonParser();
		JsonObject jsonObject = parser.parse(responseJsonStr).getAsJsonObject();

		String content = jsonObject.get(methodStr).toString();
		String sign = jsonObject.get("sign").toString();

		return checkSign(Config.PUBLICKEYPATH, content, sign, charset);

	}

	/**
	 * 根据证书存放路径、src来获取证书签名
	 * 
	 * @param params
	 *            要签名的map
	 * @return 签名后的字符串
	 */
	public static String getSign(Map<String, String> params) {
		String sign = "";
		String pfxCertfilename = "";
		File file = new File(Config.PRIVATEKEYPATH);
		pfxCertfilename = FileUtil.getAbsolutePath(file);

		try {
			String charset = "GBK";
			if (params.containsKey("charset")) {
				charset = params.get("charset");
			}
			String content = new String(getSignContent(params).getBytes("UTF-8"), "UTF-8");
			FileInputStream pfxCertFileInputStream = new FileInputStream(new File(pfxCertfilename));
			sign = rsaSign(content, charset, pfxCertFileInputStream);
		} catch (UnsupportedEncodingException e) {
			logger.error("编码异常", e);
		} catch (FileNotFoundException e) {
			logger.error("证书文件未找到", e);
		} catch (Exception e) {
			logger.error("签名异常", e);
		}
		return sign;
	}

	private static String rsaSign(String content, String charset, InputStream pfxCertFileInputStream) throws Exception {
		try {

			PrivateKey priKey = getPrivateKeyFromPKCS12(Config.PASSWORD, pfxCertFileInputStream);

			Signature signature = Signature.getInstance("SHA1WithRSA");

			signature.initSign(priKey);

			if (StringUtils.isEmpty(charset)) {
				signature.update(content.getBytes());
			} else {
				signature.update(content.getBytes(charset));
			}

			byte[] signed = signature.sign();

			String sign = new String(Base64.encodeBase64(signed), charset);

			return sign;
		} catch (Exception e) {
			throw new Exception("RSAcontent = " + content + "; charset = " + charset, e);
		}
	}

	public static PrivateKey getPrivateKeyFromPKCS12(String password, InputStream ins) throws Exception {
		PrivateKey priKey = null;

		KeyStore keystoreCA = KeyStore.getInstance("PKCS12");
		try {
			keystoreCA.load(ins, password.toCharArray());

			Enumeration<?> aliases = keystoreCA.aliases();
			String keyAlias = null;
			if (aliases != null) {
				while (aliases.hasMoreElements()) {
					keyAlias = (String) aliases.nextElement();

					priKey = (PrivateKey) keystoreCA.getKey(keyAlias, password.toCharArray());
				}
			}
		} catch (Exception e) {

			throw e;
		} finally {
			if (ins != null) {
				ins.close();
			}
		}
		return priKey;
	}
}
