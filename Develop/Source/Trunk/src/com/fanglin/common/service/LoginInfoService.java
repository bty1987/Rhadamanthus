/**
 * @File Name		: LoginInfoService.java
 * @Package   	: com.fanglin.common.service
 * @Version		: 1.0
 * @Date			: 2016-5-21
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.service;

import com.fanglin.common.vo.LoginInfoVO;
import com.fanglin.core.interceptor.FLException;

public interface LoginInfoService {
	
	public LoginInfoVO queryLoginInfoByLoginFlag(LoginInfoVO loginInfoVO);
	
	public LoginInfoVO addLoginInfo();
	
	public int updateLoginInfoForAuthentication(LoginInfoVO loginInfoVO) throws FLException;
	
	public int login(LoginInfoVO loginInfoVO);
	
	public int deleteLoginInfoByOptime(LoginInfoVO loginInfoVO);
	
}
