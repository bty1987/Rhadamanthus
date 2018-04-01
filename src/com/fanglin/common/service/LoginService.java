/**
 * @File Name		: LoginService.java
 * @Package   	: com.fanglin.common.service
 * @Version		: 1.0
 * @Date			: 2017-8-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.service;

import com.fanglin.core.interceptor.FLException;

public interface LoginService {
	
	public String requestAuthCode(String userId, String code, String secret) throws FLException;
	
	public String changeAuthCode(String authentication, String company) throws FLException;
	
	public String updateAuthCode(String authentication, String password) throws FLException;

}
