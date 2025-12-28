/**
 * @File Name		: WAccessTokenService.java
 * @Package   	: com.fanglin.common.service
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	:
 */

package com.fanglin.wechat.service;

import com.fanglin.wechat.vo.WeChatAccessTokenVO;
import com.fanglin.wechat.vo.WeChatJsapiTicketVO;

public interface WeChatAccessTokenService {

	public WeChatAccessTokenVO queryAccessToken(String company);

	public WeChatJsapiTicketVO queryJsapiTicketForNew(String company);

	public int makeAccessToken(short type, String company);

	public int deleteAccessToken();

}
