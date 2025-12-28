/**
 * @File Name		: WeChatOpenAccessTokenService.java
 * @Package   	: com.fanglin.wechat.service
 * @Version		: 1.0
 * @Date			: 2016-6-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信 Open AccessToken 服务接口
 */

package com.fanglin.wechat.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.wechat.vo.WeChatConfigVO;

/**
 * 微信 Open AccessToken 服务
 * 用于处理微信网页授权获取用户 OpenId 和 AccessToken
 */
public interface WeChatOpenAccessTokenService {

	/**
	 * 根据授权 code 查询或获取 OpenAccessToken
	 * @param wxConfigVO 微信配置对象
	 * @param company 公司标识
	 * @return 处理结果码
	 * @throws FLException 业务异常
	 */
	public int queryAccessTokenByCode(WeChatConfigVO wxConfigVO, String company) throws FLException;

	/**
	 * 删除过期的 OpenAccessToken
	 * @return 处理结果码
	 */
	public int deleteOpenAccessTokenByOperateTime();

}
