package com.fanglin.store.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.vo.McategoryVO;
import com.fanglin.utils.Paging;

public interface McategoryService {
	
	public void pageMcategory(Paging paging, List<Filter> filters);

	public List<McategoryVO> queryMcategory();
	
	public List<McategoryVO> queryMcategoryForShow();

	public void addMcategory(McategoryVO mcategory) throws FLException;

	public void updateMcategory(McategoryVO mcategory) throws FLException;

	public void updateMcategoryForShow(McategoryVO mcategory) throws FLException;
	
}
