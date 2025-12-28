/**
 * @File Name		: WeChatUserInfoService.java
 * @Package   	: com.fanglin.wechat.service
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信公众号用户信息服务接口
 */

package com.fanglin.wechat.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.wechat.vo.WeChatUserInfoVO;

/**
 * 微信公众号用户信息服务
 * 用于获取微信公众号用户信息
 */
public interface WeChatUserInfoService {

	/**
	 * 查询微信公众号用户信息
	 * @param openId 微信用户 OpenID
	 * @param company 公司标识
	 * @return 微信用户信息
	 * @throws FLException 业务异常
	 */
	public WeChatUserInfoVO queryUserInfo(String openId, String company) throws FLException;

}
