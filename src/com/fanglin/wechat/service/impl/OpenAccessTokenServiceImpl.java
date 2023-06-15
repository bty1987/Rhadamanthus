/**
 * @File Name		: WOpenAccessTokenServiceImpl.java
 * @Package   	: com.fanglin.common.service.impl
 * @Version		: 1.0
 * @Date			: 2016-6-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.wechat.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.wechat.service.OpenAccessTokenService;
import com.fanglin.wechat.vo.ConfigVO;

@Service("openAccessTokenService")
@Transactional(readOnly = true)
public class OpenAccessTokenServiceImpl implements OpenAccessTokenService {

	/* (non-Javadoc)
	 * @see com.fanglin.wechat.service.OpenAccessTokenService#queryAccessTokenByCode(com.fanglin.wechat.vo.ConfigVO, java.lang.String)
	 */
	@Override
	public int queryAccessTokenByCode(ConfigVO wxConfigVO, String company) throws FLException {
		// TODO Auto-generated method stub
		return 0;
	}

	/* (non-Javadoc)
	 * @see com.fanglin.wechat.service.OpenAccessTokenService#deleteOpenAccessTokenByOperateTime()
	 */
	@Override
	public int deleteOpenAccessTokenByOperateTime() {
		// TODO Auto-generated method stub
		return 0;
	}

}
