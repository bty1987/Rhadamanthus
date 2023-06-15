package com.fanglin.swiftpass.utils;

import java.util.Map;

import com.fanglin.swiftpass.config.Configure;
import com.fanglin.swiftpass.enums.ReqMethodEnum;
import com.fanglin.swiftpass.exception.SdkExType;
import com.fanglin.swiftpass.exception.SdkException;
import com.fanglin.swiftpass.service.AbstractTransService;

/**
 * 开放银行平台统一接口类
 * <p>
 * 注意：需要先配置Configure类中的值，示例参见Example.java文件 该SDK中代码仅供学习和参考，开发者可以自己根据接口文档进行编码实现，而不使用该SDK中的实现 各字段长度、类型等请参考具体接口文档中的定义，SDK不检查这些长度，而直接发送给服务端 重要：各传入参数SDK都不作任何检查、过滤，请务必在传入前进行安全检查或过滤，否则可能会导致安全问题
 * 
 */
public class OpenSdk {

	/**
	 * SDK请求入口
	 * 
	 * [重要]单应用配置方式，调用此方法前，请确保已经配置了Configure类中的变量，如keyId等 [重要]各传入参数SDK都不作任何检查、过滤，请务必在传入前进行安全检查或过滤，保证传入参数的安全性。
	 * 
	 * @param reqUri 请求资源URI
	 * @param reqMethod 请求方法
	 * @param headParams 头部信息请求参数
	 * @param urlParams URL请求参数
	 * @param bodyParams BODY请求参数
	 * @return 请求结果
	 */
	public static String gateway(String reqUri, ReqMethodEnum reqMethod, Map<String, String> headParams, Map<String, String> urlParams, Map<String, String> bodyParams) {
		try {
			Object result = AbstractTransService.getInstance().exec(reqUri, reqMethod, headParams, urlParams, bodyParams, null, Configure.getKeyConfigure(), null);
			return (String) result;
		} catch (Exception e) {
			SdkException ex = new SdkException(SdkExType.UNKNOWN);
			return ex.toString();
		}
	}
}