/**
 * @File Name		: DAccessTokenService.java
 * @Package   	: com.fanglin.common.service
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.dingding.service;

import com.fanglin.dingding.vo.AccessTokenVO;

public interface AccessTokenService {

	public AccessTokenVO queryAccessToken(String company);

	public int makeAccessToken(String company);

	public int batchmakeAccessToken(String company);

	public int deleteAccessTokenByOperateTime();

}
