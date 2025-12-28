package com.fanglin.dingding.service;

/**
 * 钉钉认证服务接口
 * 提供钉钉 AccessToken、JsapiTicket 获取和签名功能
 */
public interface DingTalkAuthService {

	/**
	 * 获取钉钉 AccessToken
	 * @param company 公司标识
	 * @return AccessToken
	 */
	public String getAccessToken(String company);

	/**
	 * 获取钉钉 JsapiTicket
	 * @param company 公司标识
	 * @return JsapiTicket
	 */
	public String getJsapiTicket(String company);

	/**
	 * 生成签名
	 * @param ticket JsapiTicket
	 * @param nonceStr 随机字符串
	 * @param timeStamp 时间戳
	 * @param url 签名URL
	 * @return 签名字符串
	 */
	public String sign(String ticket, String nonceStr, long timeStamp, String url);

	/**
	 * 字节数组转十六进制字符串
	 * @param hash 字节数组
	 * @return 十六进制字符串
	 */
	public String bytesToHex(byte[] hash);

	/**
	 * 获取钉钉 JS-SDK 配置信息
	 * @param urlString URL地址
	 * @param queryString 查询字符串
	 * @param company 公司标识
	 * @return 配置信息JSON字符串
	 */
	public String getConfig(String urlString, String queryString, String company);

}
