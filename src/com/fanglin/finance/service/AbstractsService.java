/**
 * @File Name		: AbstractsService.java
 * @Package   	: com.fanglin.finance.service
 * @Version		: 1.0
 * @Date			: 2016-4-3
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.finance.vo.AbstractsVO;

public interface AbstractsService {
	
	public List<AbstractsVO> queryAbstractsByOwnerId(String userId) throws FLException ;
	
	public int addAbstracts(AbstractsVO abstractsVO, String userId) throws FLException ;
	
	public int deleteAbstracts(AbstractsVO abstractsVO);

}
