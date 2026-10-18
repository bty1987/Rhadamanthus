/**
 * @File Name		: EsignClient.java
 * @Package   	: com.fanglin.esign.utils
 * @Version		: 1.0
 * @Date			: 2026-09-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: e签宝 openapi v3 HTTP 客户端（签名鉴权 + 公司级配置读取）
 */

package com.fanglin.esign.utils;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.security.MessageDigest;
import java.util.Map;
import java.util.TreeMap;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.elecsign.router.ElecsignRouter;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;

/**
 * e签宝 openapi v3 客户端。
 * 
 * <p>
 * 纯 HTTP 实现（HttpURLConnection），不引入 e签宝 SDK，避免与既有依赖冲突。 鉴权按 e签宝 v3 签名机制：待签名字符串 = Method + "\n" + Accept + "\n" + Content-MD5(有 body 时) + "\n" + Content-Type + "\n" + Date + "\n" + PathAndParameters，以 AppSecret 做 HmacSHA256， 请求头携带 X-Tsign-Open-App-Id / X-Tsign-Open-Auth-Mode / X-Tsign-Open-Ca-Signature / X-Tsign-Open-Ca-Timestamp。
 * 
 * <h3>公司级配置（systemconfig，group=elecsign）</h3>
 * <ul>
 * <li>{@code elecsign.appId}：e签宝应用ID（公司维度，回退 company=0 全局）</li>
 * <li>{@code elecsign.appSecret}：e签宝应用密钥</li>
 * <li>{@code elecsign.host}：openapi 地址，缺省 https://openapi.esign.cn</li>
 * </ul>
 * 
 * <p>
 * 响应约定：{"code":0,"message":"成功","data":{...}}，code!=0 视为业务失败抛 130097。
 */
@Component("esignClient")
public class EsignClient {

	private static final String ACCEPT = "*/*";

	private static final String CONTENT_TYPE = "application/json; charset=UTF-8";

	/** 生产网关；沙箱 https://smlopenapi.esign.cn 由 systemconfig elecsign.host 覆盖（联调期配置） */
	private static final String DEFAULT_HOST = "https://openapi.esign.cn";

	@Autowired
	private SystemConfigDao systemConfigDao;

	/**
	 * POST JSON 请求。
	 * 
	 * @param company 公司 cid（读该公司 e签宝配置）
	 * @param path 接口路径（如 /v3/sign-flow/create-by-file）
	 * @param body 请求体（JSONObject，可为 null）
	 * @return data 节点（无 data 时返回空对象）
	 * @throws FLException 配置缺失(130095)/网络或业务失败(130097)
	 */
	public JSONObject post(int company, String path, JSONObject body) throws FLException {
		return invoke(company, "POST", path, body == null ? new JSONObject() : body);
	}

	/**
	 * GET 请求（query 参数按 key 自然序参与签名）。
	 */
	public JSONObject get(int company, String path, Map<String, String> query) throws FLException {
		return invoke(company, "GET", path, query);
	}

	@SuppressWarnings("unchecked")
	private JSONObject invoke(int company, String method, String path, Object payload) throws FLException {

		Config config = config(company);

		String bodyStr = "";
		String contentMd5 = "";

		if ("POST".equals(method)) {
			bodyStr = payload.toString();
			contentMd5 = base64(md5(bodyStr.getBytes()));
		}

		// GET/DELETE 无 body 时 Content-Type 置空（官方 SDK 行为，参与签名与请求头一致）
		String contentType = bodyStr.isEmpty() ? "" : CONTENT_TYPE;

		String pathAndQuery = path;

		if ("GET".equals(method) && payload instanceof Map && !((Map<?, ?>) payload).isEmpty()) {

			StringBuilder qs = new StringBuilder(path);
			qs.append("?");

			boolean first = true;

			for (Map.Entry<String, String> entry : new TreeMap<String, String>((Map<String, String>) payload).entrySet()) {
				if (!first) qs.append("&");
				qs.append(urlEncode(entry.getKey())).append("=").append(urlEncode(entry.getValue() == null ? "" : entry.getValue()));
				first = false;
			}

			pathAndQuery = qs.toString();
		}

		String timestamp = String.valueOf(System.currentTimeMillis());

		// 签名串 6 段（官方 dev-guide3/tggw2e，2026-10 沙箱实测确认）：
		// method \n "*/*" \n contentMD5 \n contentType(GET空) \n ""(Date段恒空,时间戳不参与签名) \n pathAndQuery
		// 坑点：①Date 段是空串，时间戳只放 X-Tsign-Open-Ca-Timestamp 头；②Accept 恒为 "*/*"；
		//      ③GET 的 Content-Type 段为空串。三者任一不符即 401 INVALID_SIGNATURE。
		String stringToSign = String.join("\n", method, ACCEPT, contentMd5, contentType, "", pathAndQuery);

		String signature = hmacSha256(config.appSecret, stringToSign);

		HttpURLConnection connection = null;

		try {

			connection = (HttpURLConnection) new URL(config.host + pathAndQuery).openConnection();

			connection.setRequestMethod(method);
			connection.setConnectTimeout(10000);
			connection.setReadTimeout(30000);

			connection.setRequestProperty("Accept", ACCEPT);
			connection.setRequestProperty("X-Tsign-Open-App-Id", config.appId);
			connection.setRequestProperty("X-Tsign-Open-Auth-Mode", "Signature");
			connection.setRequestProperty("X-Tsign-Open-Ca-Signature", signature);
			connection.setRequestProperty("X-Tsign-Open-Ca-Timestamp", timestamp);
			connection.setRequestProperty("Date", "");
			connection.setRequestProperty("Content-Type", contentType);
			connection.setRequestProperty("Content-MD5", contentMd5);

			if ("POST".equals(method)) {
				connection.setDoOutput(true);
			}

			connection.connect();

			if ("POST".equals(method)) {
				OutputStream os = connection.getOutputStream();
				os.write(bodyStr.getBytes("UTF-8"));
				os.flush();
				os.close();
			}

			int code = connection.getResponseCode();

			InputStream is = code >= 400 ? connection.getErrorStream() : connection.getInputStream();

			BufferedReader reader = new BufferedReader(new InputStreamReader(is, "UTF-8"));

			StringBuilder response = new StringBuilder();

			String line;

			while ((line = reader.readLine()) != null) {
				response.append(line);
			}

			reader.close();

			JSONObject json = JSONObject.parseObject(response.toString());

			if (json == null || json.getInteger("code") == null) {
				throw new FLException(130097, String.format("e签宝接口调用失败, %s 无有效响应", path));
			}

			if (json.getIntValue("code") != 0) {
				throw new FLException(130097, String.format("e签宝接口调用失败, %s", json.getString("message")));
			}

			JSONObject data = json.getJSONObject("data");

			return data == null ? new JSONObject() : data;

		} catch (FLException e) {
			throw e;
		} catch (Exception e) {
			throw new FLException(130097, String.format("e签宝接口调用失败, %s, %s", path, e.getMessage()));
		} finally {
			if (connection != null) connection.disconnect();
		}
	}

	private Config config(int company) throws FLException {

		String appId = readConfig("elecsign.appId", company);
		String appSecret = readConfig("elecsign.appSecret", company);
		String host = readConfig("elecsign.host", company);

		if (appId == null || appId.trim().isEmpty() || appSecret == null || appSecret.trim().isEmpty()) {
			throw new FLException(130095, "e签宝配置缺失(elecsign.appId/appSecret)");
		}

		Config config = new Config();

		config.appId = appId.trim();
		config.appSecret = appSecret.trim();
		config.host = (host == null || host.trim().isEmpty()) ? DEFAULT_HOST : host.trim();

		return config;
	}

	/** 公司维度读取，缺失回退全局（company=0），与 ElecsignRouter 配置约定一致。 */
	private String readConfig(String key, int company) {

		SystemConfigPO config = systemConfigDao.querySystemConfig(key, company);

		if (config == null && company != ElecsignRouter.COMPANY_GLOBAL) {
			config = systemConfigDao.querySystemConfig(key, ElecsignRouter.COMPANY_GLOBAL);
		}

		return config == null ? null : config.getValue();
	}

	private byte[] md5(byte[] bytes) {
		try {
			return MessageDigest.getInstance("MD5").digest(bytes);
		} catch (Exception e) {
			throw new FLException(130097, "e签宝接口调用失败, MD5计算异常");
		}
	}

	private String base64(byte[] bytes) {
		return Base64.encodeBase64String(bytes);
	}

	private String hmacSha256(String secret, String data) throws FLException {
		try {
			Mac mac = Mac.getInstance("HmacSHA256");
			mac.init(new SecretKeySpec(secret.getBytes("UTF-8"), "HmacSHA256"));
			return Base64.encodeBase64String(mac.doFinal(data.getBytes("UTF-8")));
		} catch (Exception e) {
			throw new FLException(130097, "e签宝接口调用失败, 签名计算异常");
		}
	}

	private String urlEncode(String value) {
		try {
			return URLEncoder.encode(value, "UTF-8");
		} catch (Exception e) {
			return value;
		}
	}

	private static class Config {

		private String appId;

		private String appSecret;

		private String host;
	}

}
