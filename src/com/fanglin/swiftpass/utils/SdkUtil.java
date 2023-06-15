package com.fanglin.swiftpass.utils;

import java.net.URLEncoder;
import java.util.Date;
import java.util.Map;

/**
 * SDK工具类
 * 
 */
public class SdkUtil {

	private static final String REQ_SEPARATOR = "/";

	/**
	 * 检查请求URI
	 * 
	 * @param reqUri 请求URI
	 * @return 处理后的URI
	 */
	public static String checkReqUri(String reqUri) {
		if (reqUri == null || reqUri.length() == 0) {
			return reqUri;
		}
		if (!reqUri.startsWith(REQ_SEPARATOR)) {
			reqUri = REQ_SEPARATOR + reqUri;
		}
		if (reqUri.endsWith(REQ_SEPARATOR)) {
			reqUri = reqUri.substring(0, reqUri.length() - 1);
		}
		return reqUri;
	}

	/**
	 * 将Map拼接为字符串
	 * 
	 * @param paramsMap 参数集
	 * @return 拼接后的参数
	 */
	public static String jointMap(Map<String, String> paramsMap) {
		try {
			StringBuilder mapBuilder = new StringBuilder();
			if (paramsMap != null && paramsMap.size() != 0) {
				for (String key : paramsMap.keySet()) {
					mapBuilder.append(URLEncoder.encode(key, Const.CHARSET));
					mapBuilder.append("=");
					mapBuilder.append(null == paramsMap.get(key) ? null : URLEncoder.encode(paramsMap.get(key), Const.CHARSET));
					mapBuilder.append("&");
				}
			}
			if (mapBuilder.length() > 1) {
				mapBuilder.setLength(mapBuilder.length() - 1);
			}
			return mapBuilder.toString();
		} catch (Exception e) {
			return "";
		}
	}

	/**
	 * 获取格式化的时间：yyyyMMddHHmmss
	 * 
	 * @return String
	 */
	public static String getDateTime() {
		return Const.FORMATTER_TIME.format(new Date());
	}

	/**
	 * 判断字符串是否为空
	 * 
	 * @param str 字符串
	 * @return 判断结果
	 */
	public static boolean notBlank(String str) {
		if (null != str && "".equals(str) == false && "".equals(str.trim()) == false) {
			return true;
		}
		return false;
	}

	/**
	 * 判断Map是否为空
	 * 
	 * @param map 集合
	 * @return 判断结果
	 */
	public static boolean notEmpty(Map<String, String> map) {
		if (map != null && map.size() != 0) {
			return true;
		}
		return false;
	}

	/**
	 * 判断字符串是否为JSON格式
	 * 
	 * @param str 字符串
	 * @return 判断结果
	 */
	public static boolean isJSONString(String str) {
		if (null != str && str.startsWith("{") && str.endsWith("}")) {
			return true;
		}
		return false;
	}

}
