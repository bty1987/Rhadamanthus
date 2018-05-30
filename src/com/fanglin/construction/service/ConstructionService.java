/**
 * @File Name	: ConstructionService.java
 * @Package   	: com.fanglin.service.construction
 * @Version		: 1.0
 * @Date		: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.ConstructionVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionService {
	
	public void pageConstruction(Paging paging, List<Filter> filters, Integer company);
	
	public void pageConstructionForSupervision(Paging paging, List<Filter> filters, String userId)throws FLException;

	public void pageConstructionForAcceptance(Paging paging, List<Filter> filters, Integer company);
	
	public ConstructionVO queryConstructionById(int cid);
	
	public ConstructionVO queryConstructionByOrderId(ConstructionVO constructionVO);
	
	public void saveOrUpdateConstructionByOrderId(ConstructionVO constructionVO);

}