/**
 * @File Name		: WOpenAccessTokenService.java
 * @Package   	: com.fanglin.common.service
 * @Version		: 1.0
 * @Date			: 2016-6-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.wechat.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.wechat.vo.ConfigVO;

public interface OpenAccessTokenService {

	public int queryAccessTokenByCode(ConfigVO wxConfigVO, String company) throws FLException;

	public int deleteOpenAccessTokenByOperateTime();

}
