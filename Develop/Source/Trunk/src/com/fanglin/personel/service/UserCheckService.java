/**
 * @File Name		: UserCheckService.java
 * @Package   	: com.fanglin.personel.service
 * @Version		: 1.0
 * @Date			: 2015-8-13
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.UserCheckVO;

public interface UserCheckService {
	
	public List<UserCheckVO> queryUserCheckByUserIdACheckTime(UserCheckVO userCheckVO);
	
	public void addUserCheck(UserCheckVO userCheckVO) throws FLException;

}
