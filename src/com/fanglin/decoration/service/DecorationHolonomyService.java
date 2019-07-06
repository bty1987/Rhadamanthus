package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.vo.DecorationHolonomyVO;
import com.fanglin.utils.Paging;

public interface DecorationHolonomyService {

	public void pageDecorationHolonomy(Paging paging, List<Filter> filters, int company);

	public DecorationHolonomyVO queryDecorationHolonomy(DecorationHolonomyVO decorationHolonomyVO);

	public void makeDecorationHolonomy(DecorationHolonomyVO decorationHolonomyVO, String userId) throws FLException;
	
	public void updateDecorationHolonomy(DecorationHolonomyVO decorationHolonomyVO, String userId) throws FLException;

}
