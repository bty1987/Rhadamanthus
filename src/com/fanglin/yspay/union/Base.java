package com.fanglin.yspay.union;

import java.io.File;
import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.UUID;

import org.apache.commons.codec.binary.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.EncryptConfigLoader;
import com.fanglin.utils.SystemConfig;
import com.fanglin.yspay.utils.CertUtil;
import com.fanglin.yspay.utils.DateUtil;
import com.fanglin.yspay.utils.HttpUtil;
import com.fanglin.yspay.utils.RSAUtil;
import com.fanglin.yspay.utils.SignUtil;

public class Base implements Serializable {

	private static final Logger logger = LoggerFactory.getLogger(Base.class);

	private static final long serialVersionUID = -6133566416044112954L;

	private static String CERTID = null;
	private static String PFXPATH = "client.pfx";
	private static String CRTPATH = "service.crt";
	private static String PFXPWD = null;
	private static String APPSECRET = null;
	private static String HOST = null;
	private static String VERSION = "1";

	// private static String NOTIFY_URL_STR = "http://www.fanglin.vip/";
	// private static String RETURN_URL_STR = "http://www.fanglin.vip/"; // http://fanglin.vip:30080/communion/signatureCallback.do

	private static String configFilePathName = "/yinsheng.properties";

	private static Properties prop;

	static {
		try {
			try {
				prop = EncryptConfigLoader.load(configFilePathName);
			} catch (Throwable e) {
				logger.info("EncryptConfigLoader加载失败，回退到原始方式: {}", e.getMessage());
				prop = new Properties();
				prop.load(SystemConfig.class.getResourceAsStream(configFilePathName));
			}

			CERTID = prop.getProperty("cert.id");
			PFXPATH = prop.getProperty("pfx.path");
			CRTPATH = prop.getProperty("crt.path");
			APPSECRET = prop.getProperty("app.secret");
			PFXPWD = prop.getProperty("pfx.pwd");
			HOST = prop.getProperty("host");

		} catch (Throwable e) {
			logger.warn("yinsheng.properties 配置文件未找到或加载失败，银盛支付功能将不可用: {}", e.getMessage());
		}
	}

	private File file;

	public JSONObject handle(String args, String code, String api) throws FLException {

		JSONObject params = JSONObject.parseObject(args);

		params.put("appSecret", APPSECRET);

		CertUtil.init(CRTPATH, PFXPATH, PFXPWD);

		String data = JSONObject.toJSONString(params);

		String key = SignUtil.getRandomKey();
		String msg = SignUtil.encryptMessage(data, key);
		String encrypt = SignUtil.encryptKey(CERTID, CRTPATH, key);

		Map<String, String> map = new HashMap<String, String>();

		map.put("src", "02");
		map.put("msgCode", code);
		map.put("sendTo", "qrcode");
		map.put("timeStamp", DateUtil.getCurrentDate("yyyy-MM-dd HH:mm:dd"));
		map.put("msg", msg);
		map.put("check", encrypt);
		map.put("norce", UUID.randomUUID().toString().replaceAll("-", ""));
		map.put("certId", CERTID);
		map.put("version", VERSION);

		List<String> keys = new ArrayList<String>(map.keySet());
		Collections.sort(keys);
		StringBuilder sb1 = new StringBuilder();
		for (String k : keys) {
			sb1.append(k).append("=").append(map.get(k)).append("&");
		}
		sb1.setLength(sb1.length() > 0 ? sb1.length() - 1 : 0);

		map.put("sign", RSAUtil.sign(sb1.toString(), "UTF-8", PFXPWD));

		String url = String.format("%s%s", HOST, api);

		String result = getFile() == null ? HttpUtil.sendPost(url, map) : HttpUtil.sendPost(url, map, getFile());

		try {
			result = new String(RSAUtil.base64Decode(StringUtils.getBytesUtf8(result)));
		} catch (IOException e) {
			logger.error("支付平台响应解码失败", e);
			throw new FLException(150053, String.format("支付平台异常,%s", e.getMessage()));
		}

		System.out.println(result);

		JSONObject response = JSONObject.parseObject(result);

		if (response.getInteger("code") != 200) {
			throw new FLException(150053, String.format("支付平台异常,%s", response.getString("msg")));
		}

		System.out.println(response.getString("data"));

		Set<String> keyIter = response.keySet();
		Map<String, String> valueMap = new HashMap<String, String>();

		String value;

		for (String str : keyIter) {
			value = response.get(str).toString();
			valueMap.put(str, value);
		}

		try {
			response = JSONObject.parseObject(new String(SignUtil.decryptMessage(CERTID, CRTPATH, valueMap, key)));
		} catch (Exception e) {
			logger.error("解密支付平台响应失败", e);
			throw new FLException(150053, String.format("支付平台异常,%s", e.getMessage()));
		}

		return response;
	}

	public File getFile() {
		return file;
	}

	public void setFile(File file) {
		this.file = file;
	}

	public static void main(String[] args) {

		/**
		 * 问题
		 * 
		 * 0. 业务流程 , 开户->手机注册->钱包(交易) , 资料上传->进件->钱包(交易)
		 * 
		 * 1. 帐户/钱包 , 是否支持个人 , 进件方式
		 * 
		 * 2. 活体进件和进件的区别是什么 , 处理传递参数之外
		 * 
		 * 3. 进件中的银行卡和绑定银行卡的关系
		 * 
		 * 4. ysUserCode/appUserCode/userCode , 是否存在关联
		 * 
		 * 5. 不同商户主体B端开户是否相同 , 使用证书是否相同 , 利用什么信息进行区别(AppSecret)
		 * 
		 * 6. 平台/商户/个人概念如何理解 , 方林集团中的不同公司在平在下注册商户
		 */
	}

}
