package com.fanglin.swiftpass.config;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import com.fanglin.swiftpass.enums.KeySignTypeEnum;
import com.fanglin.swiftpass.enums.RespSignAlgorithmEnum;
import com.fanglin.utils.SystemConfig;

/**
 * 开放银行平台配置类
 * <p>
 * 这里存放所有配置，开发者可以扩展该类 注意：请根据采用的配置方式调用OpenSdk类中对应的方法 1.采用单应用配置方式时，请务必配置该类中的变量，如keyId等 2.采用多应用配置方式时，请务必配置该类中的keyConfigures
 * 
 */
public class Configure {

	public static final String PROD_URL; // 开放银行平台生产环境地址

	private static boolean devEnv; // 是否测试环境开关，true连接测试环境，false连接生产环境

	private static String devUrl; // 开放银行平台测试环境地址，可根据需要修改

	private static String keyId; // 应用ID，为KY字母开头的字符串，区分大小写

	private static String priKey; // 请求报文签名私钥，需严格保密，建议使用配置文件或其他方式进行存储

	private static String respPubKey; // 响应报文验签公钥

	private static String reqParamEncryptKey; // 字段加密密钥

	private static KeySignTypeEnum keySignType = KeySignTypeEnum.SM3WITHSM2; // 请求签名算法

	private static boolean respSignSwitch; // 响应报文验签开关，true将进行验签，false不进行验签

	private static RespSignAlgorithmEnum respSignAlgorithm = RespSignAlgorithmEnum.SM3WITHSM2; // 响应报文验签算法

	private static String httpsRequestClassName = "com.fanglin.swiftpass.utils.HttpsPostRequest"; // HTTP通讯类

	// 多应用配置方式时，创建KeyConfigure对象存入map中。示例：map{key=keyId,value=keyConfigure}
	private static Map<String, KeyConfigure> keyConfigures = new HashMap<String, KeyConfigure>(8);

	// 双向认证证书文件存放路径，不为空将开启双向认证 该路径下证书文件名格式要求：{keyId}.p12，如KYONLYFORTEST012345678.p12
	private static String certPath = null;

	// 双向认证证书私钥的保护密码，用于提取证书私钥。双向认证开启时必须设置该项
	private static String certProtectionPwd = null;

	private static GrayConfigure grayConfigure = null; // 灰度发布标识参数

	private static final Object GET_KEYCONFIGURE_LOCK = new Object();

	private static Properties prop;

	private static String configFilePathName = "/swiftpass.properties";

	static {
		try {
			prop = new Properties();
			prop.load(SystemConfig.class.getResourceAsStream(configFilePathName));

			PROD_URL = prop.getProperty("PROD_URL");
			devEnv = Boolean.parseBoolean(prop.getProperty("DEVENV"));
			devUrl = prop.getProperty("DEVURL");
			keyId = prop.getProperty("KEYID");
			priKey = prop.getProperty("PRIKEY");
			respPubKey = prop.getProperty("RESPPUBKEY");
			reqParamEncryptKey = prop.getProperty("REQPARAMENCRYPTKEY");
			respSignSwitch = Boolean.parseBoolean(prop.getProperty("RESPSIGNSWITCH"));

		} catch (Throwable e) {
			throw new RuntimeException("config-file cannot be load: " + configFilePathName);
		}
	}

	public static String getKeyId() {
		return keyId;
	}

	public static void setKeyId(String keyId) {
		Configure.keyId = keyId;
	}

	public static String getPriKey() {
		if (priKey.startsWith("-----BEGIN PRIVATE KEY-----")) {
			priKey = priKey.replace("-----BEGIN PRIVATE KEY-----", "").replace("-----END PRIVATE KEY-----", "");
		}
		return priKey;
	}

	public static void setPriKey(String priKey) {
		Configure.priKey = priKey;
	}

	public static KeySignTypeEnum getKeySignType() {
		return keySignType;
	}

	public static void setKeySignType(KeySignTypeEnum keySignType) {
		Configure.keySignType = keySignType;
	}

	public static boolean isRespSignSwitch() {
		return respSignSwitch;
	}

	public static void setRespSignSwitch(boolean respSignSwitch) {
		Configure.respSignSwitch = respSignSwitch;
	}

	public static RespSignAlgorithmEnum getRespSignAlgorithm() {
		return respSignAlgorithm;
	}

	public static void setRespSignAlgorithm(RespSignAlgorithmEnum respSignAlgorithm) {
		Configure.respSignAlgorithm = respSignAlgorithm;
	}

	public static String getRespPubKey() {
		return respPubKey;
	}

	public static void setRespPubKey(String respPubKey) {
		Configure.respPubKey = respPubKey;
	}

	public static String getReqParamEncryptKey() {
		return reqParamEncryptKey;
	}

	public static void setReqParamEncryptKey(String reqParamEncryptKey) {
		Configure.reqParamEncryptKey = reqParamEncryptKey;
	}

	public static String getHttpsRequestClassName() {
		return httpsRequestClassName;
	}

	public static void setHttpsRequestClassName(String httpsRequestClassName) {
		Configure.httpsRequestClassName = httpsRequestClassName;
	}

	public static boolean isDevEnv() {
		return devEnv;
	}

	public static void setDevEnv(boolean devEnv) {
		Configure.devEnv = devEnv;
	}

	public static String getDevUrl() {
		return devUrl;
	}

	public static void setDevUrl(String devUrl) {
		Configure.devUrl = devUrl;
	}

	public static Map<String, KeyConfigure> getKeyConfigures() {
		return keyConfigures;
	}

	public static void setKeyConfigures(Map<String, KeyConfigure> keyConfigures) {
		Configure.keyConfigures = keyConfigures;
	}

	public static String getCertPath() {
		return certPath;
	}

	public static void setCertPath(String certPath) {
		Configure.certPath = certPath;
	}

	public static String getCertProtectionPwd() {
		return certProtectionPwd;
	}

	public static void setCertProtectionPwd(String certProtectionPwd) {
		Configure.certProtectionPwd = certProtectionPwd;
	}

	public static GrayConfigure getGrayConfigure() {
		return grayConfigure;
	}

	public static void setGrayConfigure(GrayConfigure grayConfigure) {
		Configure.grayConfigure = grayConfigure;
	}

	// 采用单应用配置方式时, 获取配置对象方法
	public static KeyConfigure getKeyConfigure() {

		KeyConfigure keyConfigure = keyConfigures.get(keyId);

		if (null != keyConfigure) {
			return keyConfigure;
		}

		synchronized (GET_KEYCONFIGURE_LOCK) {

			keyConfigure = keyConfigures.get(keyId);

			if (null != keyConfigure) {
				return keyConfigure;
			}

			keyConfigure = new KeyConfigure();
			keyConfigure.setKeyId(keyId);
			keyConfigure.setPriKey(priKey);
			keyConfigure.setKeySignType(keySignType);
			keyConfigure.setRespSignSwitch(respSignSwitch);
			keyConfigure.setRespSignAlgorithm(respSignAlgorithm);
			keyConfigure.setRespPubKey(respPubKey);
			keyConfigure.setReqParamEncryptKey(reqParamEncryptKey);
			keyConfigure.setCertProtectionPwd(certProtectionPwd);
			keyConfigure.setGrayConfigure(grayConfigure);
			keyConfigures.put(keyId, keyConfigure);
		}

		return keyConfigure;
	}

}
