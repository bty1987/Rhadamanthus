/**
 * @File Name		: WecomAuthService.java
 * @Package   	: com.fanglin.wecom.service
 * @Version		: 1.0
 * @Date			: 2026-11-23
 * @Copyright		: Copyright Creators 2014
 * @Describing	: 企业微信网页授权免登服务
 */

package com.fanglin.wecom.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.wecom.bean.User;

public interface WecomAuthService {

	/**
	 * 免登code换企微成员(两步链: auth/getuserinfo拿userid → user/get拿work_code工号)
	 *
	 * @param code 网页授权免登code(一次一用)
	 * @param company 公司
	 * @return 企微成员(userid=企微账号, workCode=ERP user.userId)
	 */
	public User getUserInfo(String code, String company) throws FLException;

}
