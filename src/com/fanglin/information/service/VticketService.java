package com.fanglin.information.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.vo.VticketVO;
import com.fanglin.utils.Paging;

public interface VticketService {

	public void pageVticket(Paging paging, List<Filter> filters);
	
	public void pageVticketForBelonger(Paging paging, List<Filter> filters, String userId);

	public List<?> countVticket(short param);

	public void createVticket(VticketVO vticket, String userId) throws FLException;

	public void updateVticket(VticketVO vticket) throws FLException;
	
}
