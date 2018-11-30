/**
 * @File Name		: StorehouseUserService.java
 * @Package   	: com.fanglin.inventory.service
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.vo.StorehouseUserVO;
import com.fanglin.personel.vo.UserBaseVO;

public interface StorehouseUserService {
	
	public List<StorehouseUserVO> queryStorehouseUserByUserId(UserBaseVO userVO);
	
	public int updateStorehouseUser(UserBaseVO userVO, List<Long> shIds) throws FLException;

}
