/**
 * @File Name		: MaterialSubOrderBalanceService.java
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
import com.fanglin.core.vo.FilterVO;
import com.fanglin.material.vo.MaterialSubOrderBalanceVO;
import com.fanglin.utils.Paging;

public interface MaterialSubOrderBalanceService {
	
	public void pageMaterialSubOrderBalance(Paging paging, List<FilterVO> filters);
	
	public void pageMaterialSubOrderBalanceForVender(Paging paging, List<FilterVO> filters, String userId) throws FLException;
	
	public void updateMaterialSubOrderBalanceForVBalance(MaterialSubOrderBalanceVO materialSubOrderBalanceVO) throws FLException;
	
	public void vpostMaterialSubOrderBalance(MaterialSubOrderBalanceVO materialSubOrderBalanceVO) throws FLException;
	
	public void updateMaterialSubOrderBalanceForBalance(MaterialSubOrderBalanceVO materialSubOrderBalanceVO) throws FLException;
	
	public void postMaterialSubOrderBalance(MaterialSubOrderBalanceVO materialSubOrderBalanceVO, String userId) throws FLException;

}
