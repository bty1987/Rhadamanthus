/**
 * @File Name		: QuotationItemService.java
 * @Package   	: com.fanglin.service
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.quotation.vo.FunctionAreaVO;
import com.fanglin.utils.Paging;

public interface FunctionAreaService {
	
	public void pageFunctionArea(Paging paging, List<FilterVO> filters);
	
	public FunctionAreaVO queryFunctionAreaByIdAVersionId(FunctionAreaVO functionAreaVO) throws FLException;
	
	public List<FunctionAreaVO> queryFunctionAreaByVersionId(FunctionAreaVO functionAreaVO) throws FLException;
	
	public int saveOrUpdateFunctionArea(FunctionAreaVO functionAreaVO) throws FLException;

	public void deleteFunctionAreaByIds(List<Long> ids);
	
	public void deleteFunctionArea(FunctionAreaVO functionAreaVO);

}
