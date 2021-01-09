/**
 *
 * Licensed Property to China UnionPay Co., Ltd.
 * 
 * (C) Copyright of China UnionPay Co., Ltd. 2010
 *     All Rights Reserved.
 *
 * 
 * Modification History:
 * =============================================================================
 *   Author         Date          Description
 *   ------------ ---------- ---------------------------------------------------
 *   xshu       2014-05-28       证书工具类.
 * =============================================================================
 */

package com.fanglin.yspay.utils;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.spec.RSAPublicKeySpec;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CertUtil {

	private static Logger logger = LoggerFactory.getLogger(CertUtil.class);

	/** 证书容器. */
	private static KeyStore keyStore = null;

	/** 敏感信息加密公钥证书 */
	private static X509Certificate encryptCert = null;

	/** 磁道加密公钥 */
	private static PublicKey encryptTrackKey = null;

	/** 验证签名证书. */
	private static Certificate validateCert = null;

	private static final String KEYSTORE_TYPE = "PKCS12";

	/** 所有公钥证书完整路径 */
	private static final Map<String, Certificate> CRT_MAP = new HashMap<String, Certificate>();

	/** 所有私钥证书容器 */
	private static final Map<String, KeyStore> PFX_MAP = new HashMap<String, KeyStore>();

	/** 商户私钥存储Map */
	private final static Map<String, KeyStore> keyStoreMap = new ConcurrentHashMap<String, KeyStore>();

	/** 验证银联返回报文签名的公钥证书存储Map. */
	private static Map<String, X509Certificate> certMap = new HashMap<String, X509Certificate>();

	/**
	 * 初始化证书容器的方法
	 */
	// static {
	// init();
	// }

	/**
	 * 初始化所有证书.
	 */
	public static void init(String certpath, String pfxpath, String pfxpwd) {
		initSignCert(pfxpath, pfxpwd); // pfx文件
		initValidateCertFromDir(certpath);
	}

	/**
	 * 加载签名证书
	 */
	public static void initSignCert(String pfxpath, String pfxpwd) {
		if (null != keyStore) {
			keyStore = null;
		}
		try {
			// 默认存放的文件夹路径
			keyStore = getKeyInfo(pfxpath, pfxpwd, KEYSTORE_TYPE);
		} catch (IOException e) {
			logger.error("加载签名证书失败", e);
		}
	}

	/**
	 * 获取敏感信息加密证书PublicKey
	 * 
	 * @return
	 */
	public static PublicKey getEncryptCertPublicKey(String certpath) {
		if (null == encryptCert) {
			if (!StringUtils.isEmpty(certpath)) {
				encryptCert = initCert(certpath);
				return encryptCert.getPublicKey();
			} else {
				logger.error("acpsdk.encryptCert.path is empty");
				return null;
			}
		} else {
			return encryptCert.getPublicKey();
		}
	}

	/**
	 * 通过指定路径的私钥证书 获取PrivateKey对象
	 * 
	 * @return
	 */
	public static PrivateKey getSignCertPrivateKeyByStoreMap(String certPath, String certPwd) {
		if (!keyStoreMap.containsKey(certPath)) {
			loadSignCert(certPath, certPwd);
		}
		try {
			Enumeration<String> aliasenum = keyStoreMap.get(certPath).aliases();
			String keyAlias = null;
			if (aliasenum.hasMoreElements()) {
				keyAlias = aliasenum.nextElement();
			}
			PrivateKey privateKey = (PrivateKey) keyStoreMap.get(certPath).getKey(keyAlias, certPwd.toCharArray());
			return privateKey;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 获取磁道加密证书PublicKey
	 * 
	 * @return
	 */
	public static PublicKey getEncryptTrackPublicKey(String modulus, String exponent) {
		if (null == encryptTrackKey) {
			initTrackKey(modulus, exponent);
		}
		return encryptTrackKey;
	}

	/**
	 * 用配置文件acp_sdk.properties配置路径 加载磁道公钥
	 */
	private static void initTrackKey(String modulus, String exponent) {
		if (!StringUtils.isEmpty(modulus) && !StringUtils.isEmpty(exponent)) {
			encryptTrackKey = getPublicKey(modulus, exponent);
			logger.info("LoadEncryptTrackKey Successful");
		} else {
			logger.info("WARN: acpsdk.encryptTrackKey.modulus or acpsdk.encryptTrackKey.exponent is empty");
		}
	}

	/**
	 * 使用模和指数生成RSA公钥 注意：此代码用了默认补位方式，为RSA/None/PKCS1Padding，不同JDK默认的补位方式可能不同
	 * 
	 * @param modulus 模
	 * @param exponent 指数
	 * @return
	 */
	private static PublicKey getPublicKey(String modulus, String exponent) {
		try {
			BigInteger b1 = new BigInteger(modulus);
			BigInteger b2 = new BigInteger(exponent);
			KeyFactory keyFactory = KeyFactory.getInstance("RSA", "BC");
			RSAPublicKeySpec keySpec = new RSAPublicKeySpec(b1, b2);
			return keyFactory.generatePublic(keySpec);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 通过certId获取验签证书Map中对应证书PublicKey
	 * 
	 * @param certId 证书物理序号
	 * @return 通过证书编号获取到的公钥
	 */
	public static PublicKey getValidatePublicKey(String certId, String certpath) {
		X509Certificate cf = null;
		if (certMap.containsKey(certId)) {
			// 存在certId对应的证书对象
			cf = certMap.get(certId);
			return cf.getPublicKey();
		} else {
			// 不存在则重新Load证书文件目录
			initValidateCertFromDir(certpath);
			if (certMap.containsKey(certId)) {
				// 存在certId对应的证书对象
				cf = certMap.get(certId);
				return cf.getPublicKey();
			} else {
				logger.error("缺少certId=[" + certId + "]对应的验签证书.");
				return null;
			}
		}
	}

	/**
	 * 获取敏感信息加密证书的certId
	 * 
	 * @return
	 */
	public static String getEncryptCertId(String certpath) {
		if (null == encryptCert) {
			if (!StringUtils.isEmpty(certpath)) {
				encryptCert = initCert(certpath);
				return encryptCert.getSerialNumber().toString();
			} else {
				logger.error("acpsdk.encryptCert.path is empty");
				return null;
			}
		} else {
			return encryptCert.getSerialNumber().toString();
		}
	}

	/**
	 * 通过证书路径初始化为公钥证书
	 * 
	 * @param path
	 * @return
	 */
	private static X509Certificate initCert(String path) {
		X509Certificate encryptCertTemp = null;
		CertificateFactory cf = null;
		FileInputStream in = null;
		try {
			cf = CertificateFactory.getInstance("X.509", "BC");
			in = new FileInputStream(path);
			encryptCertTemp = (X509Certificate) cf.generateCertificate(in);
			// 打印证书加载信息,供测试阶段调试
			logger.info("[" + path + "][CertId=" + encryptCertTemp.getSerialNumber().toString() + "]");
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (null != in) {
				try {
					in.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return encryptCertTemp;
	}

	/**
	 * 通过签名私钥证书路径，密码获取私钥证书certId
	 * 
	 * @param certPath
	 * @param certPwd
	 * @return
	 */
	public static String getCertIdByKeyStoreMap(String certPath, String certPwd) {
		if (!keyStoreMap.containsKey(certPath)) {
			// 缓存中未查询到,则加载RSA证书
			loadSignCert(certPath, certPwd);
		}
		return getCertIdIdByStore(keyStoreMap.get(certPath));
	}

	/**
	 * 通过keystore获取私钥证书的certId值
	 * 
	 * @param keyStore
	 * @return
	 */
	private static String getCertIdIdByStore(KeyStore keyStore) {
		Enumeration<String> aliasenum = null;
		try {
			aliasenum = keyStore.aliases();
			String keyAlias = null;
			if (aliasenum.hasMoreElements()) {
				keyAlias = aliasenum.nextElement();
			}
			X509Certificate cert = (X509Certificate) keyStore.getCertificate(keyAlias);
			return cert.getSerialNumber().toString();
		} catch (KeyStoreException e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 用给定的路径和密码 加载签名证书，并保存到certKeyStoreMap
	 * 
	 * @param certFilePath
	 * @param certPwd
	 */
	private static void loadSignCert(String certFilePath, String certPwd) {
		KeyStore keyStore = null;
		try {
			keyStore = getKeyInfo(certFilePath, certPwd, "PKCS12");
			keyStoreMap.put(certFilePath, keyStore);
			logger.info("LoadRsaCert Successful");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 将证书文件读取为证书存储对象
	 * 
	 * @param pfxkeyfile 证书文件名
	 * @param keypwd 证书密码
	 * @param type 证书类型 ,以.pfx结尾用PKCS12
	 * @return 证书对象
	 * @throws IOException
	 */
	public static KeyStore getKeyInfo(String pfxkeyfile, String keypwd, String type) throws IOException {
		FileInputStream fis = null;
		try {

			KeyStore ks = null;
			ks = KeyStore.getInstance(type);
			logger.debug("传入的私钥证书路径为=>[{}],密码=[{}]", pfxkeyfile, keypwd);
			fis = new FileInputStream(pfxkeyfile);
			char[] nPassword = null;
			nPassword = null == keypwd || "".equals(keypwd.trim()) ? null : keypwd.toCharArray();
			if (null != ks) {
				ks.load(fis, nPassword);
			}
			logger.info("证书加载完成...");
			return ks;
		} catch (Exception e) {
			logger.error("读取私钥证书失败", e);
			return null;
		} finally {
			if (null != fis)
				fis.close();
		}
	}

	/**
	 * 获取签名证书私钥（单证书）
	 * 
	 * @return
	 */
	public static PrivateKey getSignCertPrivateKey(String pfxpwd) {
		try {
			Enumeration<String> aliasenum = keyStore.aliases();
			String keyAlias = null;
			if (aliasenum.hasMoreElements()) {
				keyAlias = aliasenum.nextElement();
			}
			PrivateKey privateKey = (PrivateKey) keyStore.getKey(keyAlias, pfxpwd.toCharArray());
			return privateKey;
		} catch (Exception e) {
			logger.error("获取签名证书的私钥失败", e);
			return null;
		}
	}

	public static Certificate getValidateCert(String certId, String certpath) {
		Certificate validateCert = CRT_MAP.get(certId);
		// 如果证书不存在，则需要加载
		if (validateCert == null) {
			return initValidateCertFromDir(certId, certpath);
		}
		return validateCert;
	}

	/**
	 * 从指定目录下加载验签证书
	 * 
	 * @return
	 * 
	 */
	public static Certificate initValidateCertFromDir(String certId, String certpath) {
		logger.debug("加载公钥证书开始.");
		CertificateFactory cf = null;
		FileInputStream in = null;

		try {
			cf = CertificateFactory.getInstance("X.509");
			in = new FileInputStream(certpath);
			Certificate validateCert = cf.generateCertificate(in);
			CRT_MAP.put(certId, validateCert);
			logger.info("公钥证书加载完成...");
			return validateCert;
		} catch (CertificateException e) {
			logger.error("验证签名证书加载失败", e);
		} catch (FileNotFoundException e) {
			logger.error("验证签名证书加载失败,证书文件不存在", e);
		} finally {
			if (null != in) {
				try {
					in.close();
				} catch (IOException e) {
					logger.error("操作失败", e);
				}
			}
		}
		return null;
	}

	/**
	 * 从指定目录下加载验签证书
	 * 
	 */
	public static void initValidateCertFromDir(String certpath) {
		logger.debug("从目录中加载验证签名证书开始.");
		CertificateFactory cf = null;
		FileInputStream in = null;

		try {
			cf = CertificateFactory.getInstance("X.509");
			in = new FileInputStream(certpath);
			validateCert = cf.generateCertificate(in);

		} catch (CertificateException e) {
			logger.error("验证签名证书加载失败", e);
		} catch (FileNotFoundException e) {
			logger.error("验证签名证书加载失败,证书文件不存在", e);
		} finally {
			if (null != in) {
				try {
					in.close();
				} catch (IOException e) {
					logger.error("操作失败", e);
				}
			}
		}
	}

	/**
	 * 获取签名证书私钥（单证书）
	 * 
	 * @return
	 */
	public static PrivateKey getSignCertPrivateKey(String certId, String pfxpath, String pfxpwd) {
		try {
			KeyStore keyStore = PFX_MAP.get(certId);
			if (keyStore == null) {
				keyStore = initSignCert(certId, pfxpath, pfxpwd);
			}
			if (keyStore == null) {
				logger.error("获取签名证书的私钥失败,keyStore为空");
				return null;
			}
			// 如果继续为空则抛异常
			Enumeration<String> aliasenum = keyStore.aliases();
			String keyAlias = null;
			if (aliasenum.hasMoreElements()) {
				keyAlias = aliasenum.nextElement();
			}
			PrivateKey privateKey = (PrivateKey) keyStore.getKey(keyAlias, pfxpwd.toCharArray());
			return privateKey;
		} catch (Exception e) {
			logger.error("获取签名证书的私钥失败", e);
			return null;
		}
	}

	/**
	 * 加载签名证书
	 * 
	 * @return
	 */
	public static KeyStore initSignCert(String certId, String pfxpath, String pfxpwd) {
		try {
			// 默认存放的文件夹路径
			KeyStore keyStore = getKeyInfo(pfxpath, pfxpwd, KEYSTORE_TYPE);
			if (keyStore == null) {
				logger.error("加载签名证书失败,keyStore为空");
				return null;
			}
			PFX_MAP.put(certId, keyStore);
			return keyStore;
		} catch (IOException e) {
			logger.error("加载签名证书失败", e);
		}
		return null;
	}

	public static Certificate getValidateCert() {
		return validateCert;
	}

	public static void setValidateCert(X509Certificate validateCert) {
		CertUtil.validateCert = validateCert;
	}

}
