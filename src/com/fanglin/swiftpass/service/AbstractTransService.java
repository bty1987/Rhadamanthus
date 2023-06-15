package com.fanglin.swiftpass.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.fanglin.swiftpass.config.Configure;
import com.fanglin.swiftpass.config.KeyConfigure;
import com.fanglin.swiftpass.enums.KeySignTypeEnum;
import com.fanglin.swiftpass.enums.ReqMethodEnum;
import com.fanglin.swiftpass.exception.SdkExType;
import com.fanglin.swiftpass.exception.SdkException;
import com.fanglin.swiftpass.utils.Base64;
import com.fanglin.swiftpass.utils.Const;
import com.fanglin.swiftpass.utils.SdkUtil;
import com.fanglin.swiftpass.utils.Signature;

/**
 * 通用请求器接口
 * <p>
 * 如果需要使用自己的HTTP通讯库，请继承自该接口
 * 
 */
public abstract class AbstractTransService {

	/**
	 * 发送请求
	 * 
	 * @param url 请求地址
	 * @param method 请求方法
	 * @param authInfo 请求头部签名信息
	 * @param headParams 头部请求参数集合
	 * @param bodyParam BODY请求参数
	 * @param filePath 文件路径
	 * @param bodyParamMap BODY请求参数集合
	 * @param keyConfigure 应用配置对象
	 * @param bodyJson BODY请求参数JSON字符串
	 * @return 通讯返回结果
	 * @throws Exception
	 */
	public abstract Object send(String url, ReqMethodEnum method, String authInfo, Map<String, String> headParams, String bodyParam, String filePath, Map<String, String> bodyParamMap, KeyConfigure keyConfigure, String bodyJson) throws Exception;

	/**
	 * 获取Configure指定的通讯类实例
	 * 
	 * @return 通讯类实例
	 * @throws ClassNotFoundException
	 * @throws InstantiationException
	 * @throws IllegalAccessException
	 */
	@SuppressWarnings("rawtypes")
	public static AbstractTransService getInstance() throws ClassNotFoundException, InstantiationException, IllegalAccessException {
		Class c = Class.forName(Configure.getHttpsRequestClassName());
		return (AbstractTransService) c.newInstance();
	}

	/**
	 * 通讯接口
	 * 
	 * @param url 请求地址
	 * @param method 请求方法
	 * @param authInfo 请求头部签名信息
	 * @param headParams 头部请求参数
	 * @param bodyParamString BODY请求参数
	 * @param filePath 文件路径
	 * @param bodyParamMap BODY请求参数集合
	 * @param keyConfigure 应用配置对象
	 * @param bodyJson BODY请求参数JSON字符串
	 * @return 通讯返回字符串
	 */
	protected static Object txn(String url, ReqMethodEnum method, String authInfo, Map<String, String> headParams, String bodyParamString, String filePath, Map<String, String> bodyParamMap, KeyConfigure keyConfigure, String bodyJson) throws SdkException {
		Object resp = null;
		try {
			AbstractTransService transService = AbstractTransService.getInstance();
			resp = transService.send(url, method, authInfo, headParams, bodyParamString, filePath, bodyParamMap, keyConfigure, bodyJson);
		} catch (Exception e) {
			if (e instanceof IOException) {
				throw new SdkException(SdkExType.CONN_ERR);
			} else if (e instanceof SdkException) {
				throw (SdkException) e;
			} else {
				throw new SdkException(SdkExType.UNKNOWN);
			}
		}
		return resp;
	}

	/**
	 * 获取请求地址
	 * 
	 * @return
	 */
	protected String getPostUrl() {
		String url = Configure.isDevEnv() ? Configure.getDevUrl() : Configure.PROD_URL;
		return (SdkUtil.notBlank(url) && url.endsWith("/")) ? url.substring(0, url.length() - 1) : url;
	}

	/**
	 * 计算头部签名信息
	 * 
	 * @param method 请求方法
	 * @param uri 请求URI
	 * @param signParams 参数集合
	 * @param keyConfigure 应用配置对象
	 * @return 头部认证信息内容
	 */
	protected String getAuthInfo(ReqMethodEnum method, String uri, Map<String, String> signParams, KeyConfigure keyConfigure) {
		String timestamp = SdkUtil.getDateTime();

		// 待签参数拼接
		String nonce = UUID.randomUUID().toString().replaceAll("-", "");
		StringBuilder builder = new StringBuilder();
		builder.append(keyConfigure.getKeyId());
		builder.append("&");
		builder.append(timestamp);
		builder.append("&");
		builder.append(nonce);
		builder.append("&");
		builder.append(method);
		builder.append("&");
		builder.append(uri);
		if (signParams != null && signParams.size() != 0) {
			List<String> keyList = new ArrayList<String>(signParams.keySet());
			Collections.sort(keyList);
			for (String key : keyList) {
				builder.append("&");
				builder.append(key);
				builder.append("=");
				builder.append(signParams.get(key));
			}
		}

		// 组装请求头部签名信息
		String user = keyConfigure.getKeyId() + "_" + timestamp + "_" + nonce;
		String pwd;
		if (KeySignTypeEnum.SHA256WITHRSA.equals(keyConfigure.getKeySignType())) {
			pwd = Signature.signatureByRSA(builder.toString(), keyConfigure.getPriKey(), Const.CHARSET);
		} else {
			pwd = Signature.signatureBySM2(builder.toString(), keyConfigure.getPriKey(), Const.CHARSET);
		}

		return "Basic " + Base64.encode((user + ":" + pwd).getBytes());
	}

	/**
	 * 执行请求处理
	 * 
	 * @param reqUri 请求资源URI
	 * @param reqMethod 请求方法
	 * @param headParams 头部信息请求参数
	 * @param urlParams URL请求参数
	 * @param bodyParamMap BODY请求参数集合
	 * @param filePath 文件路径
	 * @param keyConfigure 应用配置对象
	 * @param bodyJson BODY请求参数JSON字符串
	 * @return
	 */
	public Object exec(String reqUri, ReqMethodEnum reqMethod, Map<String, String> headParams, Map<String, String> urlParams, Map<String, String> bodyParamMap, String filePath, KeyConfigure keyConfigure, String bodyJson) {

		// 准备签名参数
		Map<String, String> signParams = new HashMap<String, String>(64);
		if (SdkUtil.notEmpty(headParams)) {
			signParams.putAll(headParams);
		}
		if (SdkUtil.notEmpty(urlParams)) {
			signParams.putAll(urlParams);
		}
		if (SdkUtil.notEmpty(bodyParamMap)) {
			signParams.putAll(bodyParamMap);
		}
		if (SdkUtil.isJSONString(bodyJson)) {
			signParams.put("BODY", bodyJson);
		}

		// 计算签名值
		reqUri = SdkUtil.checkReqUri(reqUri);
		String authInfo = this.getAuthInfo(reqMethod, reqUri, signParams, keyConfigure);

		// 拼接请求参数
		String urlParam = SdkUtil.jointMap(urlParams);
		String bodyParamString = SdkUtil.jointMap(bodyParamMap);

		// 拼接请求URL
		StringBuilder urlBuilder = new StringBuilder();
		urlBuilder.append(this.getPostUrl());
		urlBuilder.append(reqUri);
		switch (reqMethod) {
			case GET:
			case POST:
				if (SdkUtil.notBlank(urlParam)) {
					urlBuilder.append(urlBuilder.toString().contains("?") ? "&" : "?");
					urlBuilder.append(urlParam);
				}
				break;
			default:
				break;
		}

		// 执行通讯请求
		Object response = "";
		try {
			response = txn(urlBuilder.toString(), reqMethod, authInfo, headParams, bodyParamString, filePath, bodyParamMap, keyConfigure, bodyJson);
		} catch (SdkException ex) {

			if (SdkExType.CONN_ERR.getCode().equals(ex.getCode())) {
				String url = Configure.isDevEnv() ? Configure.getDevUrl() : Configure.PROD_URL;
				response = ex.toString().replace("通讯错误", url + "通讯错误");
			} else {
				response = ex.toString();
			}
		}
		return response;
	}

}
