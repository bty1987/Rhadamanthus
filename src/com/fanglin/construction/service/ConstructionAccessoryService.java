package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.ConstructionAccessoryVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionAccessoryService {

	public void pageConstructionAccessory(Paging paging, List<Filter> filters, ConstructionAccessoryVO constructionAccessory);
	
	public int addConstructionAccessory(ConstructionAccessoryVO constructionAccessoryVO) throws FLException;
	
	public int updateConstructionAccessory(ConstructionAccessoryVO constructionAccessoryVO) throws FLException;
	
}
