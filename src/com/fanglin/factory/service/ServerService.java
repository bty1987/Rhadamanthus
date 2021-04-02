/**
 * @File Name		: ServerService.java
 * @Package   	: com.fanglin.system.service
 * @Version		: 1.0
 * @Date			: 2017-8-5
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.factory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.factory.vo.ServerVO;
import com.fanglin.personel.vo.UserVO;

public interface ServerService {
	
	public List<ServerVO> queryServer(UserVO userVO) throws FLException;

}
