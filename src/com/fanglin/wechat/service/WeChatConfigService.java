/**
 * @File Name		: WeChatConfigService.java
 * @Package   	: com.fanglin.wechat.service
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信 JS-SDK 配置服务接口
 */

package com.fanglin.wechat.service;

import com.fanglin.wechat.vo.WeChatConfigVO;

/**
 * 微信 JS-SDK 配置服务
 * 用于生成微信 JS-SDK 所需的配置签名
 */
public interface WeChatConfigService {

	/**
	 * 查询微信 JS-SDK 配置（通过 VO 对象）
	 * @param wxConfigVO 微信配置对象（需包含 url、query、company）
	 * @return 包含签名的配置对象
	 */
	public WeChatConfigVO queryWXConfig(WeChatConfigVO wxConfigVO);

	/**
	 * 获取微信 JS-SDK 配置（JSON 格式字符串）
	 * @param urlString URL 地址
	 * @param queryString 查询字符串
	 * @param company 公司标识
	 * @return 签名配置 JSON 字符串，格式：({signature:'xxx',nonceStr:'xxx',timeStamp:'xxx',appId:'xxx'})
	 */
	public String getConfig(String urlString, String queryString, String company);

}
