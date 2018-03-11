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
	
	public void pageDecorationForConstruction(Paging paging, List<Filter> filters, Integer company);
	
	public void pageDecorationForSupervisionByUserId(Paging paging, List<Filter> filters, String userId, Integer company) throws FLException;

	public void pageDecorationForAcceptance(Paging paging, List<Filter> filters, Integer company);
	
	public ConstructionVO queryConstructionById(int cid);
	
	public ConstructionVO queryConstructionByOrderId(ConstructionVO constructionVO);
	
	public ConstructionVO queryConstructionForWorkerNameByOrderId(ConstructionVO constructionVO);
	
	public void saveOrUpdateConstruction(ConstructionVO constructionVO);
	
	public void saveOrUpdateConstructionByOrderId(ConstructionVO constructionVO);

}