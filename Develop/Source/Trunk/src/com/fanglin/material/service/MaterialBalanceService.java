/**
 * @File Name		: MaterialBalanceService.java
 * @Package   	: com.fanglin.material.service
 * @Version		: 1.0
 * @Date			: 2016-9-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.material.vo.MaterialBalanceVO;
import com.fanglin.utils.Paging;

public interface MaterialBalanceService {
	
	public void pageMaterialBalance(Paging paging, List<Filter> filters,int company);
	
	public void pageMaterialBalanceForVender(Paging paging, List<Filter> filters, String userId,int company) throws FLException;
	
	public void updateMaterialBalanceForVBalance(MaterialBalanceVO materialBalanceVO) throws FLException;
	
	public void vpostMaterialBalance(MaterialBalanceVO materialBalanceVO) throws FLException;
	
	public void updateMaterialBalanceForBalance(MaterialBalanceVO materialBalanceVO) throws FLException;
	
	public void postMaterialBalance(MaterialBalanceVO materialBalanceVO, String userId) throws FLException;

}
