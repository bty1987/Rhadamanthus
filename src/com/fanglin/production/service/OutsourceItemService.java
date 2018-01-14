package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.vo.OutsourceItemVO;
import com.fanglin.production.vo.OutsourceVO;
import com.fanglin.utils.Paging;

public interface OutsourceItemService {
	
	public void pageOutsourceItemByOid (Paging paging, List<Filter> filters,OutsourceItemVO outsourceItemVO );
	
	public void addOutsourceItem (List<OutsourceItemVO> outsourceItems,OutsourceVO outsource) throws FLException;
	
	public int deleteOutsourceItem(OutsourceItemVO outsourceItem) throws FLException;

}
