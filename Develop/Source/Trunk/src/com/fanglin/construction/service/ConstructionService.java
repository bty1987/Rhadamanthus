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
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionService {
	
	public void pageDecorationOrderForConstruction(Paging paging, List<Filter> filters, Integer company);
	
	public void pageDecorationOrderForSupervisionByUserId(Paging paging, List<Filter> filters, String userId, Integer company);

	public void pageDecorationOrderForAcceptance(Paging paging, List<Filter> filters, Integer company);
	
	public ConstructionVO queryConstructionById(int cid);
	
	public ConstructionVO queryConstructionByOrderId(ConstructionVO constructionVO, String userId);
	
	public ConstructionVO queryConstructionForWorkerNameByOrderId(ConstructionVO constructionVO);
	
	public void saveOrUpdateConstruction(ConstructionVO constructionVO);
	
	public void saveOrUpdateConstructionByOrderId(ConstructionVO constructionVO);

}