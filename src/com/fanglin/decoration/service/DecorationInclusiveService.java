package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.vo.DecorationInclusiveVO;
import com.fanglin.utils.Paging;

public interface DecorationInclusiveService {
	
	public void pageDecorationInclusive(Paging paging,List<Filter> filters, int company);
	
	public DecorationInclusiveVO queryDecorationInclusive(DecorationInclusiveVO decorationInclusiveVO);
	
	public void makeDecorationInclusive(DecorationInclusiveVO decorationInclusiveVO, String userId) throws FLException;
	
}
